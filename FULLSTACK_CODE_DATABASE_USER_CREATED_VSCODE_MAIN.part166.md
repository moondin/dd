---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 166
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 166 of 552)

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

---[FILE: src/vs/base/browser/ui/grid/grid.ts]---
Location: vscode-main/src/vs/base/browser/ui/grid/grid.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IBoundarySashes, Orientation } from '../sash/sash.js';
import { equals, tail } from '../../../common/arrays.js';
import { Event } from '../../../common/event.js';
import { Disposable } from '../../../common/lifecycle.js';
import './gridview.css';
import { Box, GridView, IGridViewOptions, IGridViewStyles, IView as IGridViewView, IViewSize, orthogonal, Sizing as GridViewSizing, GridLocation } from './gridview.js';
import type { SplitView, AutoSizing as SplitViewAutoSizing } from '../splitview/splitview.js';

export type { IViewSize };
export { LayoutPriority, Orientation, orthogonal } from './gridview.js';

export const enum Direction {
	Up,
	Down,
	Left,
	Right
}

function oppositeDirection(direction: Direction): Direction {
	switch (direction) {
		case Direction.Up: return Direction.Down;
		case Direction.Down: return Direction.Up;
		case Direction.Left: return Direction.Right;
		case Direction.Right: return Direction.Left;
	}
}

/**
 * The interface to implement for views within a {@link Grid}.
 */
export interface IView extends IGridViewView {

	/**
	 * The preferred width for when the user double clicks a sash
	 * adjacent to this view.
	 */
	readonly preferredWidth?: number;

	/**
	 * The preferred height for when the user double clicks a sash
	 * adjacent to this view.
	 */
	readonly preferredHeight?: number;
}

export interface GridLeafNode<T extends IView> {
	readonly view: T;
	readonly box: Box;
	readonly cachedVisibleSize: number | undefined;
	readonly maximized: boolean;
}

export interface GridBranchNode<T extends IView> {
	readonly children: GridNode<T>[];
	readonly box: Box;
}

export type GridNode<T extends IView> = GridLeafNode<T> | GridBranchNode<T>;

export function isGridBranchNode<T extends IView>(node: GridNode<T>): node is GridBranchNode<T> {
	// eslint-disable-next-line local/code-no-any-casts
	return !!(node as any).children;
}

function getGridNode<T extends IView>(node: GridNode<T>, location: GridLocation): GridNode<T> {
	if (location.length === 0) {
		return node;
	}

	if (!isGridBranchNode(node)) {
		throw new Error('Invalid location');
	}

	const [index, ...rest] = location;
	return getGridNode(node.children[index], rest);
}

interface Range {
	readonly start: number;
	readonly end: number;
}

function intersects(one: Range, other: Range): boolean {
	return !(one.start >= other.end || other.start >= one.end);
}

interface Boundary {
	readonly offset: number;
	readonly range: Range;
}

function getBoxBoundary(box: Box, direction: Direction): Boundary {
	const orientation = getDirectionOrientation(direction);
	const offset = direction === Direction.Up ? box.top :
		direction === Direction.Right ? box.left + box.width :
			direction === Direction.Down ? box.top + box.height :
				box.left;

	const range = {
		start: orientation === Orientation.HORIZONTAL ? box.top : box.left,
		end: orientation === Orientation.HORIZONTAL ? box.top + box.height : box.left + box.width
	};

	return { offset, range };
}

function findAdjacentBoxLeafNodes<T extends IView>(boxNode: GridNode<T>, direction: Direction, boundary: Boundary): GridLeafNode<T>[] {
	const result: GridLeafNode<T>[] = [];

	function _(boxNode: GridNode<T>, direction: Direction, boundary: Boundary): void {
		if (isGridBranchNode(boxNode)) {
			for (const child of boxNode.children) {
				_(child, direction, boundary);
			}
		} else {
			const { offset, range } = getBoxBoundary(boxNode.box, direction);

			if (offset === boundary.offset && intersects(range, boundary.range)) {
				result.push(boxNode);
			}
		}
	}

	_(boxNode, direction, boundary);
	return result;
}

function getLocationOrientation(rootOrientation: Orientation, location: GridLocation): Orientation {
	return location.length % 2 === 0 ? orthogonal(rootOrientation) : rootOrientation;
}

function getDirectionOrientation(direction: Direction): Orientation {
	return direction === Direction.Up || direction === Direction.Down ? Orientation.VERTICAL : Orientation.HORIZONTAL;
}

export function getRelativeLocation(rootOrientation: Orientation, location: GridLocation, direction: Direction): GridLocation {
	const orientation = getLocationOrientation(rootOrientation, location);
	const directionOrientation = getDirectionOrientation(direction);

	if (orientation === directionOrientation) {
		let [rest, index] = tail(location);

		if (direction === Direction.Right || direction === Direction.Down) {
			index += 1;
		}

		return [...rest, index];
	} else {
		const index = (direction === Direction.Right || direction === Direction.Down) ? 1 : 0;
		return [...location, index];
	}
}

function indexInParent(element: HTMLElement): number {
	const parentElement = element.parentElement;

	if (!parentElement) {
		throw new Error('Invalid grid element');
	}

	let el = parentElement.firstElementChild;
	let index = 0;

	while (el !== element && el !== parentElement.lastElementChild && el) {
		el = el.nextElementSibling;
		index++;
	}

	return index;
}

/**
 * Find the grid location of a specific DOM element by traversing the parent
 * chain and finding each child index on the way.
 *
 * This will break as soon as DOM structures of the Splitview or Gridview change.
 */
function getGridLocation(element: HTMLElement): GridLocation {
	const parentElement = element.parentElement;

	if (!parentElement) {
		throw new Error('Invalid grid element');
	}

	if (/\bmonaco-grid-view\b/.test(parentElement.className)) {
		return [];
	}

	const index = indexInParent(parentElement);
	const ancestor = parentElement.parentElement!.parentElement!.parentElement!.parentElement!;
	return [...getGridLocation(ancestor), index];
}

export type DistributeSizing = { type: 'distribute' };
export type SplitSizing = { type: 'split' };
export type AutoSizing = { type: 'auto' };
export type InvisibleSizing = { type: 'invisible'; cachedVisibleSize: number };
export type Sizing = DistributeSizing | SplitSizing | AutoSizing | InvisibleSizing;

export namespace Sizing {
	export const Distribute: DistributeSizing = { type: 'distribute' };
	export const Split: SplitSizing = { type: 'split' };
	export const Auto: AutoSizing = { type: 'auto' };
	export function Invisible(cachedVisibleSize: number): InvisibleSizing { return { type: 'invisible', cachedVisibleSize }; }
}

export interface IGridStyles extends IGridViewStyles { }
export interface IGridOptions extends IGridViewOptions { }

/**
 * The {@link Grid} exposes a Grid widget in a friendlier API than the underlying
 * {@link GridView} widget. Namely, all mutation operations are addressed by the
 * model elements, rather than indexes.
 *
 * It support the same features as the {@link GridView}.
 */
export class Grid<T extends IView = IView> extends Disposable {

	protected gridview: GridView;
	private views = new Map<T, HTMLElement>();

	/**
	 * The orientation of the grid. Matches the orientation of the root
	 * {@link SplitView} in the grid's {@link GridLocation} model.
	 */
	get orientation(): Orientation { return this.gridview.orientation; }
	set orientation(orientation: Orientation) { this.gridview.orientation = orientation; }

	/**
	 * The width of the grid.
	 */
	get width(): number { return this.gridview.width; }

	/**
	 * The height of the grid.
	 */
	get height(): number { return this.gridview.height; }

	/**
	 * The minimum width of the grid.
	 */
	get minimumWidth(): number { return this.gridview.minimumWidth; }

	/**
	 * The minimum height of the grid.
	 */
	get minimumHeight(): number { return this.gridview.minimumHeight; }

	/**
	 * The maximum width of the grid.
	 */
	get maximumWidth(): number { return this.gridview.maximumWidth; }

	/**
	 * The maximum height of the grid.
	 */
	get maximumHeight(): number { return this.gridview.maximumHeight; }

	/**
	 * Fires whenever a view within the grid changes its size constraints.
	 */
	readonly onDidChange: Event<{ width: number; height: number } | undefined>;

	/**
	 * Fires whenever the user scrolls a {@link SplitView} within
	 * the grid.
	 */
	readonly onDidScroll: Event<void>;

	/**
	 * A collection of sashes perpendicular to each edge of the grid.
	 * Corner sashes will be created for each intersection.
	 */
	get boundarySashes(): IBoundarySashes { return this.gridview.boundarySashes; }
	set boundarySashes(boundarySashes: IBoundarySashes) { this.gridview.boundarySashes = boundarySashes; }

	/**
	 * Enable/disable edge snapping across all grid views.
	 */
	set edgeSnapping(edgeSnapping: boolean) { this.gridview.edgeSnapping = edgeSnapping; }

	/**
	 * The DOM element for this view.
	 */
	get element(): HTMLElement { return this.gridview.element; }

	private didLayout = false;

	readonly onDidChangeViewMaximized: Event<boolean>;
	/**
	 * Create a new {@link Grid}. A grid must *always* have a view
	 * inside.
	 *
	 * @param view An initial view for this Grid.
	 */
	constructor(view: T | GridView, options: IGridOptions = {}) {
		super();

		if (view instanceof GridView) {
			this.gridview = view;
			this.gridview.getViewMap(this.views);
		} else {
			this.gridview = new GridView(options);
		}

		this._register(this.gridview);
		this._register(this.gridview.onDidSashReset(this.onDidSashReset, this));

		if (!(view instanceof GridView)) {
			this._addView(view, 0, [0]);
		}

		this.onDidChange = this.gridview.onDidChange;
		this.onDidScroll = this.gridview.onDidScroll;
		this.onDidChangeViewMaximized = this.gridview.onDidChangeViewMaximized;
	}

	style(styles: IGridStyles): void {
		this.gridview.style(styles);
	}

	/**
	 * Layout the {@link Grid}.
	 *
	 * Optionally provide a `top` and `left` positions, those will propagate
	 * as an origin for positions passed to {@link IView.layout}.
	 *
	 * @param width The width of the {@link Grid}.
	 * @param height The height of the {@link Grid}.
	 * @param top Optional, the top location of the {@link Grid}.
	 * @param left Optional, the left location of the {@link Grid}.
	 */
	layout(width: number, height: number, top: number = 0, left: number = 0): void {
		this.gridview.layout(width, height, top, left);
		this.didLayout = true;
	}

	/**
	 * Add a {@link IView view} to this {@link Grid}, based on another reference view.
	 *
	 * Take this grid as an example:
	 *
	 * ```
	 *  +-----+---------------+
	 *  |  A  |      B        |
	 *  +-----+---------+-----+
	 *  |        C      |     |
	 *  +---------------+  D  |
	 *  |        E      |     |
	 *  +---------------+-----+
	 * ```
	 *
	 * Calling `addView(X, Sizing.Distribute, C, Direction.Right)` will make the following
	 * changes:
	 *
	 * ```
	 *  +-----+---------------+
	 *  |  A  |      B        |
	 *  +-----+-+-------+-----+
	 *  |   C   |   X   |     |
	 *  +-------+-------+  D  |
	 *  |        E      |     |
	 *  +---------------+-----+
	 * ```
	 *
	 * Or `addView(X, Sizing.Distribute, D, Direction.Down)`:
	 *
	 * ```
	 *  +-----+---------------+
	 *  |  A  |      B        |
	 *  +-----+---------+-----+
	 *  |        C      |  D  |
	 *  +---------------+-----+
	 *  |        E      |  X  |
	 *  +---------------+-----+
	 * ```
	 *
	 * @param newView The view to add.
	 * @param size Either a fixed size, or a dynamic {@link Sizing} strategy.
	 * @param referenceView Another view to place this new view next to.
	 * @param direction The direction the new view should be placed next to the reference view.
	 */
	addView(newView: T, size: number | Sizing, referenceView: T, direction: Direction): void {
		if (this.views.has(newView)) {
			throw new Error('Can\'t add same view twice');
		}

		const orientation = getDirectionOrientation(direction);

		if (this.views.size === 1 && this.orientation !== orientation) {
			this.orientation = orientation;
		}

		const referenceLocation = this.getViewLocation(referenceView);
		const location = getRelativeLocation(this.gridview.orientation, referenceLocation, direction);

		let viewSize: number | GridViewSizing;

		if (typeof size === 'number') {
			viewSize = size;
		} else if (size.type === 'split') {
			const [, index] = tail(referenceLocation);
			viewSize = GridViewSizing.Split(index);
		} else if (size.type === 'distribute') {
			viewSize = GridViewSizing.Distribute;
		} else if (size.type === 'auto') {
			const [, index] = tail(referenceLocation);
			viewSize = GridViewSizing.Auto(index);
		} else {
			viewSize = size;
		}

		this._addView(newView, viewSize, location);
	}

	private addViewAt(newView: T, size: number | DistributeSizing | InvisibleSizing, location: GridLocation): void {
		if (this.views.has(newView)) {
			throw new Error('Can\'t add same view twice');
		}

		let viewSize: number | GridViewSizing;

		if (typeof size === 'number') {
			viewSize = size;
		} else if (size.type === 'distribute') {
			viewSize = GridViewSizing.Distribute;
		} else {
			viewSize = size;
		}

		this._addView(newView, viewSize, location);
	}

	protected _addView(newView: T, size: number | GridViewSizing, location: GridLocation): void {
		this.views.set(newView, newView.element);
		this.gridview.addView(newView, size, location);
	}

	/**
	 * Remove a {@link IView view} from this {@link Grid}.
	 *
	 * @param view The {@link IView view} to remove.
	 * @param sizing Whether to distribute other {@link IView view}'s sizes.
	 */
	removeView(view: T, sizing?: Sizing): void {
		if (this.views.size === 1) {
			throw new Error('Can\'t remove last view');
		}

		const location = this.getViewLocation(view);

		let gridViewSizing: DistributeSizing | SplitViewAutoSizing | undefined;

		if (sizing?.type === 'distribute') {
			gridViewSizing = GridViewSizing.Distribute;
		} else if (sizing?.type === 'auto') {
			const index = location[location.length - 1];
			gridViewSizing = GridViewSizing.Auto(index === 0 ? 1 : index - 1);
		}

		this.gridview.removeView(location, gridViewSizing);
		this.views.delete(view);
	}

	/**
	 * Move a {@link IView view} to another location in the grid.
	 *
	 * @remarks See {@link Grid.addView}.
	 *
	 * @param view The {@link IView view} to move.
	 * @param sizing Either a fixed size, or a dynamic {@link Sizing} strategy.
	 * @param referenceView Another view to place the view next to.
	 * @param direction The direction the view should be placed next to the reference view.
	 */
	moveView(view: T, sizing: number | Sizing, referenceView: T, direction: Direction): void {
		const sourceLocation = this.getViewLocation(view);
		const [sourceParentLocation, from] = tail(sourceLocation);

		const referenceLocation = this.getViewLocation(referenceView);
		const targetLocation = getRelativeLocation(this.gridview.orientation, referenceLocation, direction);
		const [targetParentLocation, to] = tail(targetLocation);

		if (equals(sourceParentLocation, targetParentLocation)) {
			this.gridview.moveView(sourceParentLocation, from, to);
		} else {
			this.removeView(view, typeof sizing === 'number' ? undefined : sizing);
			this.addView(view, sizing, referenceView, direction);
		}
	}

	/**
	 * Move a {@link IView view} to another location in the grid.
	 *
	 * @remarks Internal method, do not use without knowing what you're doing.
	 * @remarks See {@link GridView.moveView}.
	 *
	 * @param view The {@link IView view} to move.
	 * @param location The {@link GridLocation location} to insert the view on.
	 */
	moveViewTo(view: T, location: GridLocation): void {
		const sourceLocation = this.getViewLocation(view);
		const [sourceParentLocation, from] = tail(sourceLocation);
		const [targetParentLocation, to] = tail(location);

		if (equals(sourceParentLocation, targetParentLocation)) {
			this.gridview.moveView(sourceParentLocation, from, to);
		} else {
			const size = this.getViewSize(view);
			const orientation = getLocationOrientation(this.gridview.orientation, sourceLocation);
			const cachedViewSize = this.getViewCachedVisibleSize(view);
			const sizing = typeof cachedViewSize === 'undefined'
				? (orientation === Orientation.HORIZONTAL ? size.width : size.height)
				: Sizing.Invisible(cachedViewSize);

			this.removeView(view);
			this.addViewAt(view, sizing, location);
		}
	}

	/**
	 * Swap two {@link IView views} within the {@link Grid}.
	 *
	 * @param from One {@link IView view}.
	 * @param to Another {@link IView view}.
	 */
	swapViews(from: T, to: T): void {
		const fromLocation = this.getViewLocation(from);
		const toLocation = this.getViewLocation(to);
		return this.gridview.swapViews(fromLocation, toLocation);
	}

	/**
	 * Resize a {@link IView view}.
	 *
	 * @param view The {@link IView view} to resize.
	 * @param size The size the view should be.
	 */
	resizeView(view: T, size: IViewSize): void {
		const location = this.getViewLocation(view);
		return this.gridview.resizeView(location, size);
	}

	/**
	 * Returns whether all other {@link IView views} are at their minimum size.
	 *
	 * @param view The reference {@link IView view}.
	 */
	isViewExpanded(view: T): boolean {
		const location = this.getViewLocation(view);
		return this.gridview.isViewExpanded(location);
	}

	/**
	 * Returns whether the {@link IView view} is maximized.
	 *
	 * @param view The reference {@link IView view}.
	 */
	isViewMaximized(view: T): boolean {
		const location = this.getViewLocation(view);
		return this.gridview.isViewMaximized(location);
	}

	/**
	 * Returns whether the {@link IView view} is maximized.
	 *
	 * @param view The reference {@link IView view}.
	 */
	hasMaximizedView(): boolean {
		return this.gridview.hasMaximizedView();
	}

	/**
	 * Get the size of a {@link IView view}.
	 *
	 * @param view The {@link IView view}. Provide `undefined` to get the size
	 * of the grid itself.
	 */
	getViewSize(view?: T): IViewSize {
		if (!view) {
			return this.gridview.getViewSize();
		}

		const location = this.getViewLocation(view);
		return this.gridview.getViewSize(location);
	}

	/**
	 * Get the cached visible size of a {@link IView view}. This was the size
	 * of the view at the moment it last became hidden.
	 *
	 * @param view The {@link IView view}.
	 */
	getViewCachedVisibleSize(view: T): number | undefined {
		const location = this.getViewLocation(view);
		return this.gridview.getViewCachedVisibleSize(location);
	}

	/**
	 * Maximizes the specified view and hides all other views.
	 * @param view The view to maximize.
	 */
	maximizeView(view: T) {
		if (this.views.size < 2) {
			throw new Error('At least two views are required to maximize a view');
		}
		const location = this.getViewLocation(view);
		this.gridview.maximizeView(location);
	}

	exitMaximizedView(): void {
		this.gridview.exitMaximizedView();
	}

	/**
	 * Expand the size of a {@link IView view} by collapsing all other views
	 * to their minimum sizes.
	 *
	 * @param view The {@link IView view}.
	 */
	expandView(view: T): void {
		const location = this.getViewLocation(view);
		this.gridview.expandView(location);
	}

	/**
	 * Distribute the size among all {@link IView views} within the entire
	 * grid or within a single {@link SplitView}.
	 */
	distributeViewSizes(): void {
		this.gridview.distributeViewSizes();
	}

	/**
	 * Returns whether a {@link IView view} is visible.
	 *
	 * @param view The {@link IView view}.
	 */
	isViewVisible(view: T): boolean {
		const location = this.getViewLocation(view);
		return this.gridview.isViewVisible(location);
	}

	/**
	 * Set the visibility state of a {@link IView view}.
	 *
	 * @param view The {@link IView view}.
	 */
	setViewVisible(view: T, visible: boolean): void {
		const location = this.getViewLocation(view);
		this.gridview.setViewVisible(location, visible);
	}

	/**
	 * Returns a descriptor for the entire grid.
	 */
	getViews(): GridBranchNode<T> {
		return this.gridview.getView() as GridBranchNode<T>;
	}

	/**
	 * Utility method to return the collection all views which intersect
	 * a view's edge.
	 *
	 * @param view The {@link IView view}.
	 * @param direction Which direction edge to be considered.
	 * @param wrap Whether the grid wraps around (from right to left, from bottom to top).
	 */
	getNeighborViews(view: T, direction: Direction, wrap: boolean = false): T[] {
		if (!this.didLayout) {
			throw new Error('Can\'t call getNeighborViews before first layout');
		}

		const location = this.getViewLocation(view);
		const root = this.getViews();
		const node = getGridNode(root, location);
		let boundary = getBoxBoundary(node.box, direction);

		if (wrap) {
			if (direction === Direction.Up && node.box.top === 0) {
				boundary = { offset: root.box.top + root.box.height, range: boundary.range };
			} else if (direction === Direction.Right && node.box.left + node.box.width === root.box.width) {
				boundary = { offset: 0, range: boundary.range };
			} else if (direction === Direction.Down && node.box.top + node.box.height === root.box.height) {
				boundary = { offset: 0, range: boundary.range };
			} else if (direction === Direction.Left && node.box.left === 0) {
				boundary = { offset: root.box.left + root.box.width, range: boundary.range };
			}
		}

		return findAdjacentBoxLeafNodes(root, oppositeDirection(direction), boundary)
			.map(node => node.view);
	}

	private getViewLocation(view: T): GridLocation {
		const element = this.views.get(view);

		if (!element) {
			throw new Error('View not found');
		}

		return getGridLocation(element);
	}

	private onDidSashReset(location: GridLocation): void {
		const resizeToPreferredSize = (location: GridLocation): boolean => {
			const node = this.gridview.getView(location) as GridNode<T>;

			if (isGridBranchNode(node)) {
				return false;
			}

			const direction = getLocationOrientation(this.orientation, location);
			const size = direction === Orientation.HORIZONTAL ? node.view.preferredWidth : node.view.preferredHeight;

			if (typeof size !== 'number') {
				return false;
			}

			const viewSize = direction === Orientation.HORIZONTAL ? { width: Math.round(size) } : { height: Math.round(size) };
			this.gridview.resizeView(location, viewSize);
			return true;
		};

		if (resizeToPreferredSize(location)) {
			return;
		}

		const [parentLocation, index] = tail(location);

		if (resizeToPreferredSize([...parentLocation, index + 1])) {
			return;
		}

		this.gridview.distributeViewSizes(parentLocation);
	}
}

export interface ISerializableView extends IView {
	toJSON(): object;
}

export interface IViewDeserializer<T extends ISerializableView> {
	fromJSON(json: any): T;
}

export interface ISerializedLeafNode {
	type: 'leaf';
	data: unknown;
	size: number;
	visible?: boolean;
	maximized?: boolean;
}

export interface ISerializedBranchNode {
	type: 'branch';
	data: ISerializedNode[];
	size: number;
	visible?: boolean;
}

export type ISerializedNode = ISerializedLeafNode | ISerializedBranchNode;

export interface ISerializedGrid {
	root: ISerializedNode;
	orientation: Orientation;
	width: number;
	height: number;
}

/**
 * A {@link Grid} which can serialize itself.
 */
export class SerializableGrid<T extends ISerializableView> extends Grid<T> {

	private static serializeNode<T extends ISerializableView>(node: GridNode<T>, orientation: Orientation): ISerializedNode {
		const size = orientation === Orientation.VERTICAL ? node.box.width : node.box.height;

		if (!isGridBranchNode(node)) {
			const serializedLeafNode: ISerializedLeafNode = { type: 'leaf', data: node.view.toJSON(), size };

			if (typeof node.cachedVisibleSize === 'number') {
				serializedLeafNode.size = node.cachedVisibleSize;
				serializedLeafNode.visible = false;
			} else if (node.maximized) {
				serializedLeafNode.maximized = true;
			}

			return serializedLeafNode;
		}

		const data = node.children.map(c => SerializableGrid.serializeNode(c, orthogonal(orientation)));
		if (data.some(c => c.visible !== false)) {
			return { type: 'branch', data: data, size };
		}
		return { type: 'branch', data: data, size, visible: false };
	}

	/**
	 * Construct a new {@link SerializableGrid} from a JSON object.
	 *
	 * @param json The JSON object.
	 * @param deserializer A deserializer which can revive each view.
	 * @returns A new {@link SerializableGrid} instance.
	 */
	static deserialize<T extends ISerializableView>(json: ISerializedGrid, deserializer: IViewDeserializer<T>, options: IGridOptions = {}): SerializableGrid<T> {
		if (typeof json.orientation !== 'number') {
			throw new Error('Invalid JSON: \'orientation\' property must be a number.');
		} else if (typeof json.width !== 'number') {
			throw new Error('Invalid JSON: \'width\' property must be a number.');
		} else if (typeof json.height !== 'number') {
			throw new Error('Invalid JSON: \'height\' property must be a number.');
		}

		const gridview = GridView.deserialize(json, deserializer, options);
		const result = new SerializableGrid<T>(gridview, options);

		return result;
	}

	/**
	 * Construct a new {@link SerializableGrid} from a grid descriptor.
	 *
	 * @param gridDescriptor A grid descriptor in which leaf nodes point to actual views.
	 * @returns A new {@link SerializableGrid} instance.
	 */
	static from<T extends ISerializableView>(gridDescriptor: GridDescriptor<T>, options: IGridOptions = {}): SerializableGrid<T> {
		return SerializableGrid.deserialize(createSerializedGrid(gridDescriptor), { fromJSON: view => view }, options);
	}

	/**
	 * Useful information in order to proportionally restore view sizes
	 * upon the very first layout call.
	 */
	private initialLayoutContext: boolean = true;

	/**
	 * Serialize this grid into a JSON object.
	 */
	serialize(): ISerializedGrid {
		return {
			root: SerializableGrid.serializeNode(this.getViews(), this.orientation),
			orientation: this.orientation,
			width: this.width,
			height: this.height
		};
	}

	override layout(width: number, height: number, top: number = 0, left: number = 0): void {
		super.layout(width, height, top, left);

		if (this.initialLayoutContext) {
			this.initialLayoutContext = false;
			this.gridview.trySet2x2();
		}
	}
}

export type GridLeafNodeDescriptor<T> = { size?: number; data?: any };
export type GridBranchNodeDescriptor<T> = { size?: number; groups: GridNodeDescriptor<T>[] };
export type GridNodeDescriptor<T> = GridBranchNodeDescriptor<T> | GridLeafNodeDescriptor<T>;
export type GridDescriptor<T> = { orientation: Orientation } & GridBranchNodeDescriptor<T>;

function isGridBranchNodeDescriptor<T>(nodeDescriptor: GridNodeDescriptor<T>): nodeDescriptor is GridBranchNodeDescriptor<T> {
	return !!(nodeDescriptor as GridBranchNodeDescriptor<T>).groups;
}

export function sanitizeGridNodeDescriptor<T>(nodeDescriptor: GridNodeDescriptor<T>, rootNode: boolean): void {
	// eslint-disable-next-line local/code-no-any-casts
	if (!rootNode && (nodeDescriptor as any).groups && (nodeDescriptor as any).groups.length <= 1) {
		// eslint-disable-next-line local/code-no-any-casts
		(nodeDescriptor as any).groups = undefined;
	}

	if (!isGridBranchNodeDescriptor(nodeDescriptor)) {
		return;
	}

	let totalDefinedSize = 0;
	let totalDefinedSizeCount = 0;

	for (const child of nodeDescriptor.groups) {
		sanitizeGridNodeDescriptor(child, false);

		if (child.size) {
			totalDefinedSize += child.size;
			totalDefinedSizeCount++;
		}
	}

	const totalUndefinedSize = totalDefinedSizeCount > 0 ? totalDefinedSize : 1;
	const totalUndefinedSizeCount = nodeDescriptor.groups.length - totalDefinedSizeCount;
	const eachUndefinedSize = totalUndefinedSize / totalUndefinedSizeCount;

	for (const child of nodeDescriptor.groups) {
		if (!child.size) {
			child.size = eachUndefinedSize;
		}
	}
}

function createSerializedNode<T>(nodeDescriptor: GridNodeDescriptor<T>): ISerializedNode {
	if (isGridBranchNodeDescriptor(nodeDescriptor)) {
		return { type: 'branch', data: nodeDescriptor.groups.map(c => createSerializedNode(c)), size: nodeDescriptor.size! };
	} else {
		return { type: 'leaf', data: nodeDescriptor.data, size: nodeDescriptor.size! };
	}
}

function getDimensions(node: ISerializedNode, orientation: Orientation): { width?: number; height?: number } {
	if (node.type === 'branch') {
		const childrenDimensions = node.data.map(c => getDimensions(c, orthogonal(orientation)));

		if (orientation === Orientation.VERTICAL) {
			const width = node.size || (childrenDimensions.length === 0 ? undefined : Math.max(...childrenDimensions.map(d => d.width || 0)));
			const height = childrenDimensions.length === 0 ? undefined : childrenDimensions.reduce((r, d) => r + (d.height || 0), 0);
			return { width, height };
		} else {
			const width = childrenDimensions.length === 0 ? undefined : childrenDimensions.reduce((r, d) => r + (d.width || 0), 0);
			const height = node.size || (childrenDimensions.length === 0 ? undefined : Math.max(...childrenDimensions.map(d => d.height || 0)));
			return { width, height };
		}
	} else {
		const width = orientation === Orientation.VERTICAL ? node.size : undefined;
		const height = orientation === Orientation.VERTICAL ? undefined : node.size;
		return { width, height };
	}
}

/**
 * Creates a new JSON object from a {@link GridDescriptor}, which can
 * be deserialized by {@link SerializableGrid.deserialize}.
 */
export function createSerializedGrid<T>(gridDescriptor: GridDescriptor<T>): ISerializedGrid {
	sanitizeGridNodeDescriptor(gridDescriptor, true);

	const root = createSerializedNode(gridDescriptor);
	const { width, height } = getDimensions(root, gridDescriptor.orientation);

	return {
		root,
		orientation: gridDescriptor.orientation,
		width: width || 1,
		height: height || 1
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/grid/gridview.css]---
Location: vscode-main/src/vs/base/browser/ui/grid/gridview.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-grid-view {
	position: relative;
	overflow: hidden;
	width: 100%;
	height: 100%;
}

.monaco-grid-branch-node {
	width: 100%;
	height: 100%;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/grid/gridview.ts]---
Location: vscode-main/src/vs/base/browser/ui/grid/gridview.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { $ } from '../../dom.js';
import { IBoundarySashes, Orientation, Sash } from '../sash/sash.js';
import { DistributeSizing, ISplitViewStyles, IView as ISplitView, LayoutPriority, Sizing, AutoSizing, SplitView } from '../splitview/splitview.js';
import { equals as arrayEquals, tail } from '../../../common/arrays.js';
import { Color } from '../../../common/color.js';
import { Emitter, Event, Relay } from '../../../common/event.js';
import { Disposable, DisposableStore, IDisposable, toDisposable } from '../../../common/lifecycle.js';
import { rot } from '../../../common/numbers.js';
import { isUndefined } from '../../../common/types.js';
import './gridview.css';

export { Orientation } from '../sash/sash.js';
export { LayoutPriority, Sizing } from '../splitview/splitview.js';

export interface IGridViewStyles extends ISplitViewStyles { }

const defaultStyles: IGridViewStyles = {
	separatorBorder: Color.transparent
};

export interface IViewSize {
	readonly width: number;
	readonly height: number;
}

interface IRelativeBoundarySashes {
	readonly start?: Sash;
	readonly end?: Sash;
	readonly orthogonalStart?: Sash;
	readonly orthogonalEnd?: Sash;
}

/**
 * The interface to implement for views within a {@link GridView}.
 */
export interface IView {

	/**
	 * The DOM element for this view.
	 */
	readonly element: HTMLElement;

	/**
	 * A minimum width for this view.
	 *
	 * @remarks If none, set it to `0`.
	 */
	readonly minimumWidth: number;

	/**
	 * A minimum width for this view.
	 *
	 * @remarks If none, set it to `Number.POSITIVE_INFINITY`.
	 */
	readonly maximumWidth: number;

	/**
	 * A minimum height for this view.
	 *
	 * @remarks If none, set it to `0`.
	 */
	readonly minimumHeight: number;

	/**
	 * A minimum height for this view.
	 *
	 * @remarks If none, set it to `Number.POSITIVE_INFINITY`.
	 */
	readonly maximumHeight: number;

	/**
	 * The priority of the view when the {@link GridView} layout algorithm
	 * runs. Views with higher priority will be resized first.
	 *
	 * @remarks Only used when `proportionalLayout` is false.
	 */
	readonly priority?: LayoutPriority;

	/**
	 * If the {@link GridView} supports proportional layout,
	 * this property allows for finer control over the proportional layout algorithm, per view.
	 *
	 * @defaultValue `true`
	 */
	readonly proportionalLayout?: boolean;

	/**
	 * Whether the view will snap whenever the user reaches its minimum size or
	 * attempts to grow it beyond the minimum size.
	 *
	 * @defaultValue `false`
	 */
	readonly snap?: boolean;

	/**
	 * View instances are supposed to fire this event whenever any of the constraint
	 * properties have changed:
	 *
	 * - {@link IView.minimumWidth}
	 * - {@link IView.maximumWidth}
	 * - {@link IView.minimumHeight}
	 * - {@link IView.maximumHeight}
	 * - {@link IView.priority}
	 * - {@link IView.snap}
	 *
	 * The {@link GridView} will relayout whenever that happens. The event can
	 * optionally emit the view's preferred size for that relayout.
	 */
	readonly onDidChange: Event<IViewSize | undefined>;

	/**
	 * This will be called by the {@link GridView} during layout. A view meant to
	 * pass along the layout information down to its descendants.
	 */
	layout(width: number, height: number, top: number, left: number): void;

	/**
	 * This will be called by the {@link GridView} whenever this view is made
	 * visible or hidden.
	 *
	 * @param visible Whether the view becomes visible.
	 */
	setVisible?(visible: boolean): void;

	/**
	 * This will be called by the {@link GridView} whenever this view is on
	 * an edge of the grid and the grid's
	 * {@link GridView.boundarySashes boundary sashes} change.
	 */
	setBoundarySashes?(sashes: IBoundarySashes): void;
}

export interface ISerializableView extends IView {
	toJSON(): object;
}

export interface IViewDeserializer<T extends ISerializableView> {
	fromJSON(json: any): T;
}

export interface ISerializedLeafNode {
	type: 'leaf';
	data: unknown;
	size: number;
	visible?: boolean;
	maximized?: boolean;
}

export interface ISerializedBranchNode {
	type: 'branch';
	data: ISerializedNode[];
	size: number;
	visible?: boolean;
}

export type ISerializedNode = ISerializedLeafNode | ISerializedBranchNode;

export interface ISerializedGridView {
	root: ISerializedNode;
	orientation: Orientation;
	width: number;
	height: number;
}

export function orthogonal(orientation: Orientation): Orientation {
	return orientation === Orientation.VERTICAL ? Orientation.HORIZONTAL : Orientation.VERTICAL;
}

export interface Box {
	readonly top: number;
	readonly left: number;
	readonly width: number;
	readonly height: number;
}

export interface GridLeafNode {
	readonly view: IView;
	readonly box: Box;
	readonly cachedVisibleSize: number | undefined;
	readonly maximized: boolean;
}

export interface GridBranchNode {
	readonly children: GridNode[];
	readonly box: Box;
}

export type GridNode = GridLeafNode | GridBranchNode;

export function isGridBranchNode(node: GridNode): node is GridBranchNode {
	// eslint-disable-next-line local/code-no-any-casts
	return !!(node as any).children;
}

class LayoutController {
	constructor(public isLayoutEnabled: boolean) { }
}

export interface IGridViewOptions {

	/**
	 * Styles overriding the {@link defaultStyles default ones}.
	 */
	readonly styles?: IGridViewStyles;

	/**
	 * Resize each view proportionally when resizing the {@link GridView}.
	 *
	 * @defaultValue `true`
	 */
	readonly proportionalLayout?: boolean; // default true
}

interface ILayoutContext {
	readonly orthogonalSize: number;
	readonly absoluteOffset: number;
	readonly absoluteOrthogonalOffset: number;
	readonly absoluteSize: number;
	readonly absoluteOrthogonalSize: number;
}

function toAbsoluteBoundarySashes(sashes: IRelativeBoundarySashes, orientation: Orientation): IBoundarySashes {
	if (orientation === Orientation.HORIZONTAL) {
		return { left: sashes.start, right: sashes.end, top: sashes.orthogonalStart, bottom: sashes.orthogonalEnd };
	} else {
		return { top: sashes.start, bottom: sashes.end, left: sashes.orthogonalStart, right: sashes.orthogonalEnd };
	}
}

function fromAbsoluteBoundarySashes(sashes: IBoundarySashes, orientation: Orientation): IRelativeBoundarySashes {
	if (orientation === Orientation.HORIZONTAL) {
		return { start: sashes.left, end: sashes.right, orthogonalStart: sashes.top, orthogonalEnd: sashes.bottom };
	} else {
		return { start: sashes.top, end: sashes.bottom, orthogonalStart: sashes.left, orthogonalEnd: sashes.right };
	}
}

function validateIndex(index: number, numChildren: number): number {
	if (Math.abs(index) > numChildren) {
		throw new Error('Invalid index');
	}

	return rot(index, numChildren + 1);
}

class BranchNode implements ISplitView<ILayoutContext>, IDisposable {

	readonly element: HTMLElement;
	readonly children: Node[] = [];
	private splitview: SplitView<ILayoutContext, Node>;

	private _size: number;
	get size(): number { return this._size; }

	private _orthogonalSize: number;
	get orthogonalSize(): number { return this._orthogonalSize; }

	private _absoluteOffset: number = 0;
	get absoluteOffset(): number { return this._absoluteOffset; }

	private _absoluteOrthogonalOffset: number = 0;
	get absoluteOrthogonalOffset(): number { return this._absoluteOrthogonalOffset; }

	private absoluteOrthogonalSize: number = 0;

	private _styles: IGridViewStyles;
	get styles(): IGridViewStyles { return this._styles; }

	get width(): number {
		return this.orientation === Orientation.HORIZONTAL ? this.size : this.orthogonalSize;
	}

	get height(): number {
		return this.orientation === Orientation.HORIZONTAL ? this.orthogonalSize : this.size;
	}

	get top(): number {
		return this.orientation === Orientation.HORIZONTAL ? this._absoluteOffset : this._absoluteOrthogonalOffset;
	}

	get left(): number {
		return this.orientation === Orientation.HORIZONTAL ? this._absoluteOrthogonalOffset : this._absoluteOffset;
	}

	get minimumSize(): number {
		return this.children.length === 0 ? 0 : Math.max(...this.children.map((c, index) => this.splitview.isViewVisible(index) ? c.minimumOrthogonalSize : 0));
	}

	get maximumSize(): number {
		return Math.min(...this.children.map((c, index) => this.splitview.isViewVisible(index) ? c.maximumOrthogonalSize : Number.POSITIVE_INFINITY));
	}

	get priority(): LayoutPriority {
		if (this.children.length === 0) {
			return LayoutPriority.Normal;
		}

		const priorities = this.children.map(c => typeof c.priority === 'undefined' ? LayoutPriority.Normal : c.priority);

		if (priorities.some(p => p === LayoutPriority.High)) {
			return LayoutPriority.High;
		} else if (priorities.some(p => p === LayoutPriority.Low)) {
			return LayoutPriority.Low;
		}

		return LayoutPriority.Normal;
	}

	get proportionalLayout(): boolean {
		if (this.children.length === 0) {
			return true;
		}

		return this.children.every(c => c.proportionalLayout);
	}

	get minimumOrthogonalSize(): number {
		return this.splitview.minimumSize;
	}

	get maximumOrthogonalSize(): number {
		return this.splitview.maximumSize;
	}

	get minimumWidth(): number {
		return this.orientation === Orientation.HORIZONTAL ? this.minimumOrthogonalSize : this.minimumSize;
	}

	get minimumHeight(): number {
		return this.orientation === Orientation.HORIZONTAL ? this.minimumSize : this.minimumOrthogonalSize;
	}

	get maximumWidth(): number {
		return this.orientation === Orientation.HORIZONTAL ? this.maximumOrthogonalSize : this.maximumSize;
	}

	get maximumHeight(): number {
		return this.orientation === Orientation.HORIZONTAL ? this.maximumSize : this.maximumOrthogonalSize;
	}

	private readonly _onDidChange = new Emitter<number | undefined>();
	readonly onDidChange: Event<number | undefined> = this._onDidChange.event;

	private readonly _onDidVisibilityChange = new Emitter<boolean>();
	readonly onDidVisibilityChange: Event<boolean> = this._onDidVisibilityChange.event;
	private readonly childrenVisibilityChangeDisposable: DisposableStore = new DisposableStore();

	private _onDidScroll = new Emitter<void>();
	private onDidScrollDisposable: IDisposable = Disposable.None;
	readonly onDidScroll: Event<void> = this._onDidScroll.event;

	private childrenChangeDisposable: IDisposable = Disposable.None;

	private readonly _onDidSashReset = new Emitter<GridLocation>();
	readonly onDidSashReset: Event<GridLocation> = this._onDidSashReset.event;
	private splitviewSashResetDisposable: IDisposable = Disposable.None;
	private childrenSashResetDisposable: IDisposable = Disposable.None;

	private _boundarySashes: IRelativeBoundarySashes = {};
	get boundarySashes(): IRelativeBoundarySashes { return this._boundarySashes; }
	set boundarySashes(boundarySashes: IRelativeBoundarySashes) {
		if (this._boundarySashes.start === boundarySashes.start
			&& this._boundarySashes.end === boundarySashes.end
			&& this._boundarySashes.orthogonalStart === boundarySashes.orthogonalStart
			&& this._boundarySashes.orthogonalEnd === boundarySashes.orthogonalEnd) {
			return;
		}

		this._boundarySashes = boundarySashes;

		this.splitview.orthogonalStartSash = boundarySashes.orthogonalStart;
		this.splitview.orthogonalEndSash = boundarySashes.orthogonalEnd;

		for (let index = 0; index < this.children.length; index++) {
			const child = this.children[index];
			const first = index === 0;
			const last = index === this.children.length - 1;

			child.boundarySashes = {
				start: boundarySashes.orthogonalStart,
				end: boundarySashes.orthogonalEnd,
				orthogonalStart: first ? boundarySashes.start : child.boundarySashes.orthogonalStart,
				orthogonalEnd: last ? boundarySashes.end : child.boundarySashes.orthogonalEnd,
			};
		}
	}

	private _edgeSnapping = false;
	get edgeSnapping(): boolean { return this._edgeSnapping; }
	set edgeSnapping(edgeSnapping: boolean) {
		if (this._edgeSnapping === edgeSnapping) {
			return;
		}

		this._edgeSnapping = edgeSnapping;

		for (const child of this.children) {
			if (child instanceof BranchNode) {
				child.edgeSnapping = edgeSnapping;
			}
		}

		this.updateSplitviewEdgeSnappingEnablement();
	}

	constructor(
		readonly orientation: Orientation,
		readonly layoutController: LayoutController,
		styles: IGridViewStyles,
		readonly splitviewProportionalLayout: boolean,
		size: number = 0,
		orthogonalSize: number = 0,
		edgeSnapping: boolean = false,
		childDescriptors?: INodeDescriptor[]
	) {
		this._styles = styles;
		this._size = size;
		this._orthogonalSize = orthogonalSize;

		this.element = $('.monaco-grid-branch-node');

		if (!childDescriptors) {
			// Normal behavior, we have no children yet, just set up the splitview
			this.splitview = new SplitView(this.element, { orientation, styles, proportionalLayout: splitviewProportionalLayout });
			this.splitview.layout(size, { orthogonalSize, absoluteOffset: 0, absoluteOrthogonalOffset: 0, absoluteSize: size, absoluteOrthogonalSize: orthogonalSize });
		} else {
			// Reconstruction behavior, we want to reconstruct a splitview
			const descriptor = {
				views: childDescriptors.map(childDescriptor => {
					return {
						view: childDescriptor.node,
						size: childDescriptor.node.size,
						visible: childDescriptor.visible !== false
					};
				}),
				size: this.orthogonalSize
			};

			const options = { proportionalLayout: splitviewProportionalLayout, orientation, styles };

			this.children = childDescriptors.map(c => c.node);
			this.splitview = new SplitView(this.element, { ...options, descriptor });

			this.children.forEach((node, index) => {
				const first = index === 0;
				const last = index === this.children.length;

				node.boundarySashes = {
					start: this.boundarySashes.orthogonalStart,
					end: this.boundarySashes.orthogonalEnd,
					orthogonalStart: first ? this.boundarySashes.start : this.splitview.sashes[index - 1],
					orthogonalEnd: last ? this.boundarySashes.end : this.splitview.sashes[index],
				};
			});
		}

		const onDidSashReset = Event.map(this.splitview.onDidSashReset, i => [i]);
		this.splitviewSashResetDisposable = onDidSashReset(this._onDidSashReset.fire, this._onDidSashReset);

		this.updateChildrenEvents();
	}

	style(styles: IGridViewStyles): void {
		this._styles = styles;
		this.splitview.style(styles);

		for (const child of this.children) {
			if (child instanceof BranchNode) {
				child.style(styles);
			}
		}
	}

	layout(size: number, offset: number, ctx: ILayoutContext | undefined): void {
		if (!this.layoutController.isLayoutEnabled) {
			return;
		}

		if (typeof ctx === 'undefined') {
			throw new Error('Invalid state');
		}

		// branch nodes should flip the normal/orthogonal directions
		this._size = ctx.orthogonalSize;
		this._orthogonalSize = size;
		this._absoluteOffset = ctx.absoluteOffset + offset;
		this._absoluteOrthogonalOffset = ctx.absoluteOrthogonalOffset;
		this.absoluteOrthogonalSize = ctx.absoluteOrthogonalSize;

		this.splitview.layout(ctx.orthogonalSize, {
			orthogonalSize: size,
			absoluteOffset: this._absoluteOrthogonalOffset,
			absoluteOrthogonalOffset: this._absoluteOffset,
			absoluteSize: ctx.absoluteOrthogonalSize,
			absoluteOrthogonalSize: ctx.absoluteSize
		});

		this.updateSplitviewEdgeSnappingEnablement();
	}

	setVisible(visible: boolean): void {
		for (const child of this.children) {
			child.setVisible(visible);
		}
	}

	addChild(node: Node, size: number | Sizing, index: number, skipLayout?: boolean): void {
		index = validateIndex(index, this.children.length);

		this.splitview.addView(node, size, index, skipLayout);
		this.children.splice(index, 0, node);

		this.updateBoundarySashes();
		this.onDidChildrenChange();
	}

	removeChild(index: number, sizing?: Sizing): Node {
		index = validateIndex(index, this.children.length);

		const result = this.splitview.removeView(index, sizing);
		this.children.splice(index, 1);

		this.updateBoundarySashes();
		this.onDidChildrenChange();

		return result;
	}

	removeAllChildren(): Node[] {
		const result = this.splitview.removeAllViews();

		this.children.splice(0, this.children.length);

		this.updateBoundarySashes();
		this.onDidChildrenChange();

		return result;
	}

	moveChild(from: number, to: number): void {
		from = validateIndex(from, this.children.length);
		to = validateIndex(to, this.children.length);

		if (from === to) {
			return;
		}

		if (from < to) {
			to -= 1;
		}

		this.splitview.moveView(from, to);
		this.children.splice(to, 0, this.children.splice(from, 1)[0]);

		this.updateBoundarySashes();
		this.onDidChildrenChange();
	}

	swapChildren(from: number, to: number): void {
		from = validateIndex(from, this.children.length);
		to = validateIndex(to, this.children.length);

		if (from === to) {
			return;
		}

		this.splitview.swapViews(from, to);

		// swap boundary sashes
		[this.children[from].boundarySashes, this.children[to].boundarySashes]
			= [this.children[from].boundarySashes, this.children[to].boundarySashes];

		// swap children
		[this.children[from], this.children[to]] = [this.children[to], this.children[from]];

		this.onDidChildrenChange();
	}

	resizeChild(index: number, size: number): void {
		index = validateIndex(index, this.children.length);

		this.splitview.resizeView(index, size);
	}

	isChildExpanded(index: number): boolean {
		return this.splitview.isViewExpanded(index);
	}

	distributeViewSizes(recursive = false): void {
		this.splitview.distributeViewSizes();

		if (recursive) {
			for (const child of this.children) {
				if (child instanceof BranchNode) {
					child.distributeViewSizes(true);
				}
			}
		}
	}

	getChildSize(index: number): number {
		index = validateIndex(index, this.children.length);

		return this.splitview.getViewSize(index);
	}

	isChildVisible(index: number): boolean {
		index = validateIndex(index, this.children.length);

		return this.splitview.isViewVisible(index);
	}

	setChildVisible(index: number, visible: boolean): void {
		index = validateIndex(index, this.children.length);

		if (this.splitview.isViewVisible(index) === visible) {
			return;
		}

		const wereAllChildrenHidden = this.splitview.contentSize === 0;
		this.splitview.setViewVisible(index, visible);
		const areAllChildrenHidden = this.splitview.contentSize === 0;

		// If all children are hidden then the parent should hide the entire splitview
		// If the entire splitview is hidden then the parent should show the splitview when a child is shown
		if ((visible && wereAllChildrenHidden) || (!visible && areAllChildrenHidden)) {
			this._onDidVisibilityChange.fire(visible);
		}
	}

	getChildCachedVisibleSize(index: number): number | undefined {
		index = validateIndex(index, this.children.length);

		return this.splitview.getViewCachedVisibleSize(index);
	}

	private updateBoundarySashes(): void {
		for (let i = 0; i < this.children.length; i++) {
			this.children[i].boundarySashes = {
				start: this.boundarySashes.orthogonalStart,
				end: this.boundarySashes.orthogonalEnd,
				orthogonalStart: i === 0 ? this.boundarySashes.start : this.splitview.sashes[i - 1],
				orthogonalEnd: i === this.children.length - 1 ? this.boundarySashes.end : this.splitview.sashes[i],
			};
		}
	}

	private onDidChildrenChange(): void {
		this.updateChildrenEvents();
		this._onDidChange.fire(undefined);
	}

	private updateChildrenEvents(): void {
		const onDidChildrenChange = Event.map(Event.any(...this.children.map(c => c.onDidChange)), () => undefined);
		this.childrenChangeDisposable.dispose();
		this.childrenChangeDisposable = onDidChildrenChange(this._onDidChange.fire, this._onDidChange);

		const onDidChildrenSashReset = Event.any(...this.children.map((c, i) => Event.map(c.onDidSashReset, location => [i, ...location])));
		this.childrenSashResetDisposable.dispose();
		this.childrenSashResetDisposable = onDidChildrenSashReset(this._onDidSashReset.fire, this._onDidSashReset);

		const onDidScroll = Event.any(Event.signal(this.splitview.onDidScroll), ...this.children.map(c => c.onDidScroll));
		this.onDidScrollDisposable.dispose();
		this.onDidScrollDisposable = onDidScroll(this._onDidScroll.fire, this._onDidScroll);

		this.childrenVisibilityChangeDisposable.clear();
		this.children.forEach((child, index) => {
			if (child instanceof BranchNode) {
				this.childrenVisibilityChangeDisposable.add(child.onDidVisibilityChange((visible) => {
					this.setChildVisible(index, visible);
				}));
			}
		});
	}

	trySet2x2(other: BranchNode): IDisposable {
		if (this.children.length !== 2 || other.children.length !== 2) {
			return Disposable.None;
		}

		if (this.getChildSize(0) !== other.getChildSize(0)) {
			return Disposable.None;
		}

		const [firstChild, secondChild] = this.children;
		const [otherFirstChild, otherSecondChild] = other.children;

		if (!(firstChild instanceof LeafNode) || !(secondChild instanceof LeafNode)) {
			return Disposable.None;
		}

		if (!(otherFirstChild instanceof LeafNode) || !(otherSecondChild instanceof LeafNode)) {
			return Disposable.None;
		}

		if (this.orientation === Orientation.VERTICAL) {
			secondChild.linkedWidthNode = otherFirstChild.linkedHeightNode = firstChild;
			firstChild.linkedWidthNode = otherSecondChild.linkedHeightNode = secondChild;
			otherSecondChild.linkedWidthNode = firstChild.linkedHeightNode = otherFirstChild;
			otherFirstChild.linkedWidthNode = secondChild.linkedHeightNode = otherSecondChild;
		} else {
			otherFirstChild.linkedWidthNode = secondChild.linkedHeightNode = firstChild;
			otherSecondChild.linkedWidthNode = firstChild.linkedHeightNode = secondChild;
			firstChild.linkedWidthNode = otherSecondChild.linkedHeightNode = otherFirstChild;
			secondChild.linkedWidthNode = otherFirstChild.linkedHeightNode = otherSecondChild;
		}

		const mySash = this.splitview.sashes[0];
		const otherSash = other.splitview.sashes[0];
		mySash.linkedSash = otherSash;
		otherSash.linkedSash = mySash;

		this._onDidChange.fire(undefined);
		other._onDidChange.fire(undefined);

		return toDisposable(() => {
			mySash.linkedSash = otherSash.linkedSash = undefined;
			firstChild.linkedHeightNode = firstChild.linkedWidthNode = undefined;
			secondChild.linkedHeightNode = secondChild.linkedWidthNode = undefined;
			otherFirstChild.linkedHeightNode = otherFirstChild.linkedWidthNode = undefined;
			otherSecondChild.linkedHeightNode = otherSecondChild.linkedWidthNode = undefined;
		});
	}

	private updateSplitviewEdgeSnappingEnablement(): void {
		this.splitview.startSnappingEnabled = this._edgeSnapping || this._absoluteOrthogonalOffset > 0;
		this.splitview.endSnappingEnabled = this._edgeSnapping || this._absoluteOrthogonalOffset + this._size < this.absoluteOrthogonalSize;
	}

	dispose(): void {
		for (const child of this.children) {
			child.dispose();
		}

		this._onDidChange.dispose();
		this._onDidSashReset.dispose();
		this._onDidVisibilityChange.dispose();

		this.childrenVisibilityChangeDisposable.dispose();
		this.splitviewSashResetDisposable.dispose();
		this.childrenSashResetDisposable.dispose();
		this.childrenChangeDisposable.dispose();
		this.onDidScrollDisposable.dispose();
		this.splitview.dispose();
	}
}

/**
 * Creates a latched event that avoids being fired when the view
 * constraints do not change at all.
 */
function createLatchedOnDidChangeViewEvent(view: IView): Event<IViewSize | undefined> {
	const [onDidChangeViewConstraints, onDidSetViewSize] = Event.split<undefined, IViewSize>(view.onDidChange, isUndefined);

	return Event.any(
		onDidSetViewSize,
		Event.map(
			Event.latch(
				Event.map(onDidChangeViewConstraints, _ => ([view.minimumWidth, view.maximumWidth, view.minimumHeight, view.maximumHeight])),
				arrayEquals
			),
			_ => undefined
		)
	);
}

class LeafNode implements ISplitView<ILayoutContext>, IDisposable {

	private _size: number = 0;
	get size(): number { return this._size; }

	private _orthogonalSize: number;
	get orthogonalSize(): number { return this._orthogonalSize; }

	private absoluteOffset: number = 0;
	private absoluteOrthogonalOffset: number = 0;

	readonly onDidScroll: Event<void> = Event.None;
	readonly onDidSashReset: Event<GridLocation> = Event.None;

	private _onDidLinkedWidthNodeChange = new Relay<number | undefined>();
	private _linkedWidthNode: LeafNode | undefined = undefined;
	get linkedWidthNode(): LeafNode | undefined { return this._linkedWidthNode; }
	set linkedWidthNode(node: LeafNode | undefined) {
		this._onDidLinkedWidthNodeChange.input = node ? node._onDidViewChange : Event.None;
		this._linkedWidthNode = node;
		this._onDidSetLinkedNode.fire(undefined);
	}

	private _onDidLinkedHeightNodeChange = new Relay<number | undefined>();
	private _linkedHeightNode: LeafNode | undefined = undefined;
	get linkedHeightNode(): LeafNode | undefined { return this._linkedHeightNode; }
	set linkedHeightNode(node: LeafNode | undefined) {
		this._onDidLinkedHeightNodeChange.input = node ? node._onDidViewChange : Event.None;
		this._linkedHeightNode = node;
		this._onDidSetLinkedNode.fire(undefined);
	}

	private readonly _onDidSetLinkedNode = new Emitter<number | undefined>();
	private _onDidViewChange: Event<number | undefined>;
	readonly onDidChange: Event<number | undefined>;

	private readonly disposables = new DisposableStore();

	constructor(
		readonly view: IView,
		readonly orientation: Orientation,
		readonly layoutController: LayoutController,
		orthogonalSize: number,
		size: number = 0
	) {
		this._orthogonalSize = orthogonalSize;
		this._size = size;

		const onDidChange = createLatchedOnDidChangeViewEvent(view);
		this._onDidViewChange = Event.map(onDidChange, e => e && (this.orientation === Orientation.VERTICAL ? e.width : e.height), this.disposables);
		this.onDidChange = Event.any(this._onDidViewChange, this._onDidSetLinkedNode.event, this._onDidLinkedWidthNodeChange.event, this._onDidLinkedHeightNodeChange.event);
	}

	get width(): number {
		return this.orientation === Orientation.HORIZONTAL ? this.orthogonalSize : this.size;
	}

	get height(): number {
		return this.orientation === Orientation.HORIZONTAL ? this.size : this.orthogonalSize;
	}

	get top(): number {
		return this.orientation === Orientation.HORIZONTAL ? this.absoluteOffset : this.absoluteOrthogonalOffset;
	}

	get left(): number {
		return this.orientation === Orientation.HORIZONTAL ? this.absoluteOrthogonalOffset : this.absoluteOffset;
	}

	get element(): HTMLElement {
		return this.view.element;
	}

	private get minimumWidth(): number {
		return this.linkedWidthNode ? Math.max(this.linkedWidthNode.view.minimumWidth, this.view.minimumWidth) : this.view.minimumWidth;
	}

	private get maximumWidth(): number {
		return this.linkedWidthNode ? Math.min(this.linkedWidthNode.view.maximumWidth, this.view.maximumWidth) : this.view.maximumWidth;
	}

	private get minimumHeight(): number {
		return this.linkedHeightNode ? Math.max(this.linkedHeightNode.view.minimumHeight, this.view.minimumHeight) : this.view.minimumHeight;
	}

	private get maximumHeight(): number {
		return this.linkedHeightNode ? Math.min(this.linkedHeightNode.view.maximumHeight, this.view.maximumHeight) : this.view.maximumHeight;
	}

	get minimumSize(): number {
		return this.orientation === Orientation.HORIZONTAL ? this.minimumHeight : this.minimumWidth;
	}

	get maximumSize(): number {
		return this.orientation === Orientation.HORIZONTAL ? this.maximumHeight : this.maximumWidth;
	}

	get priority(): LayoutPriority | undefined {
		return this.view.priority;
	}

	get proportionalLayout(): boolean {
		return this.view.proportionalLayout ?? true;
	}

	get snap(): boolean | undefined {
		return this.view.snap;
	}

	get minimumOrthogonalSize(): number {
		return this.orientation === Orientation.HORIZONTAL ? this.minimumWidth : this.minimumHeight;
	}

	get maximumOrthogonalSize(): number {
		return this.orientation === Orientation.HORIZONTAL ? this.maximumWidth : this.maximumHeight;
	}

	private _boundarySashes: IRelativeBoundarySashes = {};
	get boundarySashes(): IRelativeBoundarySashes { return this._boundarySashes; }
	set boundarySashes(boundarySashes: IRelativeBoundarySashes) {
		this._boundarySashes = boundarySashes;

		this.view.setBoundarySashes?.(toAbsoluteBoundarySashes(boundarySashes, this.orientation));
	}

	layout(size: number, offset: number, ctx: ILayoutContext | undefined): void {
		if (!this.layoutController.isLayoutEnabled) {
			return;
		}

		if (typeof ctx === 'undefined') {
			throw new Error('Invalid state');
		}

		this._size = size;
		this._orthogonalSize = ctx.orthogonalSize;
		this.absoluteOffset = ctx.absoluteOffset + offset;
		this.absoluteOrthogonalOffset = ctx.absoluteOrthogonalOffset;

		this._layout(this.width, this.height, this.top, this.left);
	}

	private cachedWidth: number = 0;
	private cachedHeight: number = 0;
	private cachedTop: number = 0;
	private cachedLeft: number = 0;

	private _layout(width: number, height: number, top: number, left: number): void {
		if (this.cachedWidth === width && this.cachedHeight === height && this.cachedTop === top && this.cachedLeft === left) {
			return;
		}

		this.cachedWidth = width;
		this.cachedHeight = height;
		this.cachedTop = top;
		this.cachedLeft = left;
		this.view.layout(width, height, top, left);
	}

	setVisible(visible: boolean): void {
		this.view.setVisible?.(visible);
	}

	dispose(): void {
		this.disposables.dispose();
	}
}

type Node = BranchNode | LeafNode;

export interface INodeDescriptor {
	node: Node;
	visible?: boolean;
}

function flipNode(node: BranchNode, size: number, orthogonalSize: number): BranchNode;
function flipNode(node: LeafNode, size: number, orthogonalSize: number): LeafNode;
function flipNode(node: Node, size: number, orthogonalSize: number): Node;
function flipNode(node: Node, size: number, orthogonalSize: number): Node {
	if (node instanceof BranchNode) {
		const result = new BranchNode(orthogonal(node.orientation), node.layoutController, node.styles, node.splitviewProportionalLayout, size, orthogonalSize, node.edgeSnapping);

		let totalSize = 0;

		for (let i = node.children.length - 1; i >= 0; i--) {
			const child = node.children[i];
			const childSize = child instanceof BranchNode ? child.orthogonalSize : child.size;

			let newSize = node.size === 0 ? 0 : Math.round((size * childSize) / node.size);
			totalSize += newSize;

			// The last view to add should adjust to rounding errors
			if (i === 0) {
				newSize += size - totalSize;
			}

			result.addChild(flipNode(child, orthogonalSize, newSize), newSize, 0, true);
		}

		node.dispose();
		return result;
	} else {
		const result = new LeafNode(node.view, orthogonal(node.orientation), node.layoutController, orthogonalSize);
		node.dispose();
		return result;
	}
}

/**
 * The location of a {@link IView view} within a {@link GridView}.
 *
 * A GridView is a tree composition of multiple {@link SplitView} instances, orthogonal
 * between one another. Here's an example:
 *
 * ```
 *  +-----+---------------+
 *  |  A  |      B        |
 *  +-----+---------+-----+
 *  |        C      |     |
 *  +---------------+  D  |
 *  |        E      |     |
 *  +---------------+-----+
 * ```
 *
 * The above grid's tree structure is:
 *
 * ```
 *  Vertical SplitView
 *  +-Horizontal SplitView
 *  | +-A
 *  | +-B
 *  +- Horizontal SplitView
 *    +-Vertical SplitView
 *    | +-C
 *    | +-E
 *    +-D
 * ```
 *
 * So, {@link IView views} within a {@link GridView} can be referenced by
 * a sequence of indexes, each index referencing each SplitView. Here are
 * each view's locations, from the example above:
 *
 * - `A`: `[0,0]`
 * - `B`: `[0,1]`
 * - `C`: `[1,0,0]`
 * - `D`: `[1,1]`
 * - `E`: `[1,0,1]`
 */
export type GridLocation = number[];

/**
 * The {@link GridView} is the UI component which implements a two dimensional
 * flex-like layout algorithm for a collection of {@link IView} instances, which
 * are mostly HTMLElement instances with size constraints. A {@link GridView} is a
 * tree composition of multiple {@link SplitView} instances, orthogonal between
 * one another. It will respect view's size contraints, just like the SplitView.
 *
 * It has a low-level index based API, allowing for fine grain performant operations.
 * Look into the {@link Grid} widget for a higher-level API.
 *
 * Features:
 * - flex-like layout algorithm
 * - snap support
 * - corner sash support
 * - Alt key modifier behavior, macOS style
 * - layout (de)serialization
 */
export class GridView implements IDisposable {

	/**
	 * The DOM element for this view.
	 */
	readonly element: HTMLElement;

	private styles: IGridViewStyles;
	private proportionalLayout: boolean;
	private _root!: BranchNode;
	private onDidSashResetRelay = new Relay<GridLocation>();
	private _onDidScroll = new Relay<void>();
	private _onDidChange = new Relay<IViewSize | undefined>();
	private _boundarySashes: IBoundarySashes = {};

	/**
	 * The layout controller makes sure layout only propagates
	 * to the views after the very first call to {@link GridView.layout}.
	 */
	private layoutController: LayoutController;
	private disposable2x2: IDisposable = Disposable.None;

	private get root(): BranchNode { return this._root; }

	private set root(root: BranchNode) {
		const oldRoot = this._root;

		if (oldRoot) {
			oldRoot.element.remove();
			oldRoot.dispose();
		}

		this._root = root;
		this.element.appendChild(root.element);
		this.onDidSashResetRelay.input = root.onDidSashReset;
		this._onDidChange.input = Event.map(root.onDidChange, () => undefined); // TODO
		this._onDidScroll.input = root.onDidScroll;
	}

	/**
	 * Fires whenever the user double clicks a {@link Sash sash}.
	 */
	readonly onDidSashReset = this.onDidSashResetRelay.event;

	/**
	 * Fires whenever the user scrolls a {@link SplitView} within
	 * the grid.
	 */
	readonly onDidScroll = this._onDidScroll.event;

	/**
	 * Fires whenever a view within the grid changes its size constraints.
	 */
	readonly onDidChange = this._onDidChange.event;

	/**
	 * The width of the grid.
	 */
	get width(): number { return this.root.width; }

	/**
	 * The height of the grid.
	 */
	get height(): number { return this.root.height; }

	/**
	 * The minimum width of the grid.
	 */
	get minimumWidth(): number { return this.root.minimumWidth; }

	/**
	 * The minimum height of the grid.
	 */
	get minimumHeight(): number { return this.root.minimumHeight; }

	/**
	 * The maximum width of the grid.
	 */
	get maximumWidth(): number { return this.root.maximumHeight; }

	/**
	 * The maximum height of the grid.
	 */
	get maximumHeight(): number { return this.root.maximumHeight; }

	get orientation(): Orientation { return this._root.orientation; }
	get boundarySashes(): IBoundarySashes { return this._boundarySashes; }

	/**
	 * The orientation of the grid. Matches the orientation of the root
	 * {@link SplitView} in the grid's tree model.
	 */
	set orientation(orientation: Orientation) {
		if (this._root.orientation === orientation) {
			return;
		}

		const { size, orthogonalSize, absoluteOffset, absoluteOrthogonalOffset } = this._root;
		this.root = flipNode(this._root, orthogonalSize, size);
		this.root.layout(size, 0, { orthogonalSize, absoluteOffset: absoluteOrthogonalOffset, absoluteOrthogonalOffset: absoluteOffset, absoluteSize: size, absoluteOrthogonalSize: orthogonalSize });
		this.boundarySashes = this.boundarySashes;
	}

	/**
	 * A collection of sashes perpendicular to each edge of the grid.
	 * Corner sashes will be created for each intersection.
	 */
	set boundarySashes(boundarySashes: IBoundarySashes) {
		this._boundarySashes = boundarySashes;
		this.root.boundarySashes = fromAbsoluteBoundarySashes(boundarySashes, this.orientation);
	}

	/**
	 * Enable/disable edge snapping across all grid views.
	 */
	set edgeSnapping(edgeSnapping: boolean) {
		this.root.edgeSnapping = edgeSnapping;
	}

	private maximizedNode: LeafNode | undefined = undefined;

	private readonly _onDidChangeViewMaximized = new Emitter<boolean>();
	readonly onDidChangeViewMaximized = this._onDidChangeViewMaximized.event;

	/**
	 * Create a new {@link GridView} instance.
	 *
	 * @remarks It's the caller's responsibility to append the
	 * {@link GridView.element} to the page's DOM.
	 */
	constructor(options: IGridViewOptions = {}) {
		this.element = $('.monaco-grid-view');
		this.styles = options.styles || defaultStyles;
		this.proportionalLayout = typeof options.proportionalLayout !== 'undefined' ? !!options.proportionalLayout : true;
		this.layoutController = new LayoutController(false);
		this.root = new BranchNode(Orientation.VERTICAL, this.layoutController, this.styles, this.proportionalLayout);
	}

	style(styles: IGridViewStyles): void {
		this.styles = styles;
		this.root.style(styles);
	}

	/**
	 * Layout the {@link GridView}.
	 *
	 * Optionally provide a `top` and `left` positions, those will propagate
	 * as an origin for positions passed to {@link IView.layout}.
	 *
	 * @param width The width of the {@link GridView}.
	 * @param height The height of the {@link GridView}.
	 * @param top Optional, the top location of the {@link GridView}.
	 * @param left Optional, the left location of the {@link GridView}.
	 */
	layout(width: number, height: number, top: number = 0, left: number = 0): void {
		this.layoutController.isLayoutEnabled = true;

		const [size, orthogonalSize, offset, orthogonalOffset] = this.root.orientation === Orientation.HORIZONTAL ? [height, width, top, left] : [width, height, left, top];
		this.root.layout(size, 0, { orthogonalSize, absoluteOffset: offset, absoluteOrthogonalOffset: orthogonalOffset, absoluteSize: size, absoluteOrthogonalSize: orthogonalSize });
	}

	/**
	 * Add a {@link IView view} to this {@link GridView}.
	 *
	 * @param view The view to add.
	 * @param size Either a fixed size, or a dynamic {@link Sizing} strategy.
	 * @param location The {@link GridLocation location} to insert the view on.
	 */
	addView(view: IView, size: number | Sizing, location: GridLocation): void {
		if (this.hasMaximizedView()) {
			this.exitMaximizedView();
		}

		this.disposable2x2.dispose();
		this.disposable2x2 = Disposable.None;

		const [rest, index] = tail(location);
		const [pathToParent, parent] = this.getNode(rest);

		if (parent instanceof BranchNode) {
			const node = new LeafNode(view, orthogonal(parent.orientation), this.layoutController, parent.orthogonalSize);

			try {
				parent.addChild(node, size, index);
			} catch (err) {
				node.dispose();
				throw err;
			}
		} else {
			const [, grandParent] = tail(pathToParent);
			const [, parentIndex] = tail(rest);

			let newSiblingSize: number | Sizing = 0;

			const newSiblingCachedVisibleSize = grandParent.getChildCachedVisibleSize(parentIndex);
			if (typeof newSiblingCachedVisibleSize === 'number') {
				newSiblingSize = Sizing.Invisible(newSiblingCachedVisibleSize);
			}

			const oldChild = grandParent.removeChild(parentIndex);
			oldChild.dispose();

			const newParent = new BranchNode(parent.orientation, parent.layoutController, this.styles, this.proportionalLayout, parent.size, parent.orthogonalSize, grandParent.edgeSnapping);
			grandParent.addChild(newParent, parent.size, parentIndex);

			const newSibling = new LeafNode(parent.view, grandParent.orientation, this.layoutController, parent.size);
			newParent.addChild(newSibling, newSiblingSize, 0);

			if (typeof size !== 'number' && size.type === 'split') {
				size = Sizing.Split(0);
			}

			const node = new LeafNode(view, grandParent.orientation, this.layoutController, parent.size);
			newParent.addChild(node, size, index);
		}

		this.trySet2x2();
	}

	/**
	 * Remove a {@link IView view} from this {@link GridView}.
	 *
	 * @param location The {@link GridLocation location} of the {@link IView view}.
	 * @param sizing Whether to distribute other {@link IView view}'s sizes.
	 */
	removeView(location: GridLocation, sizing?: DistributeSizing | AutoSizing): IView {
		if (this.hasMaximizedView()) {
			this.exitMaximizedView();
		}

		this.disposable2x2.dispose();
		this.disposable2x2 = Disposable.None;

		const [rest, index] = tail(location);
		const [pathToParent, parent] = this.getNode(rest);

		if (!(parent instanceof BranchNode)) {
			throw new Error('Invalid location');
		}

		const node = parent.children[index];

		if (!(node instanceof LeafNode)) {
			throw new Error('Invalid location');
		}

		parent.removeChild(index, sizing);
		node.dispose();

		if (parent.children.length === 0) {
			throw new Error('Invalid grid state');
		}

		if (parent.children.length > 1) {
			this.trySet2x2();
			return node.view;
		}

		if (pathToParent.length === 0) { // parent is root
			const sibling = parent.children[0];

			if (sibling instanceof LeafNode) {
				return node.view;
			}

			// we must promote sibling to be the new root
			parent.removeChild(0);
			parent.dispose();
			this.root = sibling;
			this.boundarySashes = this.boundarySashes;
			this.trySet2x2();
			return node.view;
		}

		const [, grandParent] = tail(pathToParent);
		const [, parentIndex] = tail(rest);

		const isSiblingVisible = parent.isChildVisible(0);
		const sibling = parent.removeChild(0);

		const sizes = grandParent.children.map((_, i) => grandParent.getChildSize(i));
		grandParent.removeChild(parentIndex, sizing);
		parent.dispose();

		if (sibling instanceof BranchNode) {
			sizes.splice(parentIndex, 1, ...sibling.children.map(c => c.size));

			const siblingChildren = sibling.removeAllChildren();

			for (let i = 0; i < siblingChildren.length; i++) {
				grandParent.addChild(siblingChildren[i], siblingChildren[i].size, parentIndex + i);
			}
		} else {
			const newSibling = new LeafNode(sibling.view, orthogonal(sibling.orientation), this.layoutController, sibling.size);
			const sizing = isSiblingVisible ? sibling.orthogonalSize : Sizing.Invisible(sibling.orthogonalSize);
			grandParent.addChild(newSibling, sizing, parentIndex);
		}

		sibling.dispose();

		for (let i = 0; i < sizes.length; i++) {
			grandParent.resizeChild(i, sizes[i]);
		}

		this.trySet2x2();
		return node.view;
	}

	/**
	 * Move a {@link IView view} within its parent.
	 *
	 * @param parentLocation The {@link GridLocation location} of the {@link IView view}'s parent.
	 * @param from The index of the {@link IView view} to move.
	 * @param to The index where the {@link IView view} should move to.
	 */
	moveView(parentLocation: GridLocation, from: number, to: number): void {
		if (this.hasMaximizedView()) {
			this.exitMaximizedView();
		}

		const [, parent] = this.getNode(parentLocation);

		if (!(parent instanceof BranchNode)) {
			throw new Error('Invalid location');
		}

		parent.moveChild(from, to);

		this.trySet2x2();
	}

	/**
	 * Swap two {@link IView views} within the {@link GridView}.
	 *
	 * @param from The {@link GridLocation location} of one view.
	 * @param to The {@link GridLocation location} of another view.
	 */
	swapViews(from: GridLocation, to: GridLocation): void {
		if (this.hasMaximizedView()) {
			this.exitMaximizedView();
		}

		const [fromRest, fromIndex] = tail(from);
		const [, fromParent] = this.getNode(fromRest);

		if (!(fromParent instanceof BranchNode)) {
			throw new Error('Invalid from location');
		}

		const fromSize = fromParent.getChildSize(fromIndex);
		const fromNode = fromParent.children[fromIndex];

		if (!(fromNode instanceof LeafNode)) {
			throw new Error('Invalid from location');
		}

		const [toRest, toIndex] = tail(to);
		const [, toParent] = this.getNode(toRest);

		if (!(toParent instanceof BranchNode)) {
			throw new Error('Invalid to location');
		}

		const toSize = toParent.getChildSize(toIndex);
		const toNode = toParent.children[toIndex];

		if (!(toNode instanceof LeafNode)) {
			throw new Error('Invalid to location');
		}

		if (fromParent === toParent) {
			fromParent.swapChildren(fromIndex, toIndex);
		} else {
			fromParent.removeChild(fromIndex);
			toParent.removeChild(toIndex);

			fromParent.addChild(toNode, fromSize, fromIndex);
			toParent.addChild(fromNode, toSize, toIndex);
		}

		this.trySet2x2();
	}

	/**
	 * Resize a {@link IView view}.
	 *
	 * @param location The {@link GridLocation location} of the view.
	 * @param size The size the view should be. Optionally provide a single dimension.
	 */
	resizeView(location: GridLocation, size: Partial<IViewSize>): void {
		if (this.hasMaximizedView()) {
			this.exitMaximizedView();
		}

		const [rest, index] = tail(location);
		const [pathToParent, parent] = this.getNode(rest);

		if (!(parent instanceof BranchNode)) {
			throw new Error('Invalid location');
		}

		if (!size.width && !size.height) {
			return;
		}

		const [parentSize, grandParentSize] = parent.orientation === Orientation.HORIZONTAL ? [size.width, size.height] : [size.height, size.width];

		if (typeof grandParentSize === 'number' && pathToParent.length > 0) {
			const [, grandParent] = tail(pathToParent);
			const [, parentIndex] = tail(rest);

			grandParent.resizeChild(parentIndex, grandParentSize);
		}

		if (typeof parentSize === 'number') {
			parent.resizeChild(index, parentSize);
		}

		this.trySet2x2();
	}

	/**
	 * Get the size of a {@link IView view}.
	 *
	 * @param location The {@link GridLocation location} of the view. Provide `undefined` to get
	 * the size of the grid itself.
	 */
	getViewSize(location?: GridLocation): IViewSize {
		if (!location) {
			return { width: this.root.width, height: this.root.height };
		}

		const [, node] = this.getNode(location);
		return { width: node.width, height: node.height };
	}

	/**
	 * Get the cached visible size of a {@link IView view}. This was the size
	 * of the view at the moment it last became hidden.
	 *
	 * @param location The {@link GridLocation location} of the view.
	 */
	getViewCachedVisibleSize(location: GridLocation): number | undefined {
		const [rest, index] = tail(location);
		const [, parent] = this.getNode(rest);

		if (!(parent instanceof BranchNode)) {
			throw new Error('Invalid location');
		}

		return parent.getChildCachedVisibleSize(index);
	}

	/**
	 * Maximize the size of a {@link IView view} by collapsing all other views
	 * to their minimum sizes.
	 *
	 * @param location The {@link GridLocation location} of the view.
	 */
	expandView(location: GridLocation): void {
		if (this.hasMaximizedView()) {
			this.exitMaximizedView();
		}

		const [ancestors, node] = this.getNode(location);

		if (!(node instanceof LeafNode)) {
			throw new Error('Invalid location');
		}

		for (let i = 0; i < ancestors.length; i++) {
			ancestors[i].resizeChild(location[i], Number.POSITIVE_INFINITY);
		}
	}

	/**
	 * Returns whether all other {@link IView views} are at their minimum size.
	 *
	 * @param location The {@link GridLocation location} of the view.
	 */
	isViewExpanded(location: GridLocation): boolean {
		if (this.hasMaximizedView()) {
			// No view can be expanded when a view is maximized
			return false;
		}

		const [ancestors, node] = this.getNode(location);

		if (!(node instanceof LeafNode)) {
			throw new Error('Invalid location');
		}

		for (let i = 0; i < ancestors.length; i++) {
			if (!ancestors[i].isChildExpanded(location[i])) {
				return false;
			}
		}

		return true;
	}

	maximizeView(location: GridLocation) {
		const [, nodeToMaximize] = this.getNode(location);
		if (!(nodeToMaximize instanceof LeafNode)) {
			throw new Error('Location is not a LeafNode');
		}

		if (this.maximizedNode === nodeToMaximize) {
			return;
		}

		if (this.hasMaximizedView()) {
			this.exitMaximizedView();
		}

		function hideAllViewsBut(parent: BranchNode, exclude: LeafNode): void {
			for (let i = 0; i < parent.children.length; i++) {
				const child = parent.children[i];
				if (child instanceof LeafNode) {
					if (child !== exclude) {
						parent.setChildVisible(i, false);
					}
				} else {
					hideAllViewsBut(child, exclude);
				}
			}
		}

		hideAllViewsBut(this.root, nodeToMaximize);

		this.maximizedNode = nodeToMaximize;
		this._onDidChangeViewMaximized.fire(true);
	}

	exitMaximizedView(): void {
		if (!this.maximizedNode) {
			return;
		}
		this.maximizedNode = undefined;

		// When hiding a view, it's previous size is cached.
		// To restore the sizes of all views, they need to be made visible in reverse order.
		function showViewsInReverseOrder(parent: BranchNode): void {
			for (let index = parent.children.length - 1; index >= 0; index--) {
				const child = parent.children[index];
				if (child instanceof LeafNode) {
					parent.setChildVisible(index, true);
				} else {
					showViewsInReverseOrder(child);
				}
			}
		}

		showViewsInReverseOrder(this.root);

		this._onDidChangeViewMaximized.fire(false);
	}

	hasMaximizedView(): boolean {
		return this.maximizedNode !== undefined;
	}

	/**
	 * Returns whether the {@link IView view} is maximized.
	 *
	 * @param location The {@link GridLocation location} of the view.
	 */
	isViewMaximized(location: GridLocation): boolean {
		const [, node] = this.getNode(location);
		if (!(node instanceof LeafNode)) {
			throw new Error('Location is not a LeafNode');
		}
		return node === this.maximizedNode;
	}

	/**
	 * Distribute the size among all {@link IView views} within the entire
	 * grid or within a single {@link SplitView}.
	 *
	 * @param location The {@link GridLocation location} of a view containing
	 * children views, which will have their sizes distributed within the parent
	 * view's size. Provide `undefined` to recursively distribute all views' sizes
	 * in the entire grid.
	 */
	distributeViewSizes(location?: GridLocation): void {
		if (this.hasMaximizedView()) {
			this.exitMaximizedView();
		}

		if (!location) {
			this.root.distributeViewSizes(true);
			return;
		}

		const [, node] = this.getNode(location);

		if (!(node instanceof BranchNode)) {
			throw new Error('Invalid location');
		}

		node.distributeViewSizes();
		this.trySet2x2();
	}

	/**
	 * Returns whether a {@link IView view} is visible.
	 *
	 * @param location The {@link GridLocation location} of the view.
	 */
	isViewVisible(location: GridLocation): boolean {
		const [rest, index] = tail(location);
		const [, parent] = this.getNode(rest);

		if (!(parent instanceof BranchNode)) {
			throw new Error('Invalid from location');
		}

		return parent.isChildVisible(index);
	}

	/**
	 * Set the visibility state of a {@link IView view}.
	 *
	 * @param location The {@link GridLocation location} of the view.
	 */
	setViewVisible(location: GridLocation, visible: boolean): void {
		if (this.hasMaximizedView()) {
			this.exitMaximizedView();
			return;
		}

		const [rest, index] = tail(location);
		const [, parent] = this.getNode(rest);

		if (!(parent instanceof BranchNode)) {
			throw new Error('Invalid from location');
		}

		parent.setChildVisible(index, visible);
	}

	/**
	 * Returns a descriptor for the entire grid.
	 */
	getView(): GridBranchNode;

	/**
	 * Returns a descriptor for a {@link GridLocation subtree} within the
	 * {@link GridView}.
	 *
	 * @param location The {@link GridLocation location} of the root of
	 * the {@link GridLocation subtree}.
	 */
	getView(location: GridLocation): GridNode;
	getView(location?: GridLocation): GridNode {
		const node = location ? this.getNode(location)[1] : this._root;
		return this._getViews(node, this.orientation);
	}

	/**
	 * Construct a new {@link GridView} from a JSON object.
	 *
	 * @param json The JSON object.
	 * @param deserializer A deserializer which can revive each view.
	 * @returns A new {@link GridView} instance.
	 */
	static deserialize<T extends ISerializableView>(json: ISerializedGridView, deserializer: IViewDeserializer<T>, options: IGridViewOptions = {}): GridView {
		if (typeof json.orientation !== 'number') {
			throw new Error('Invalid JSON: \'orientation\' property must be a number.');
		} else if (typeof json.width !== 'number') {
			throw new Error('Invalid JSON: \'width\' property must be a number.');
		} else if (typeof json.height !== 'number') {
			throw new Error('Invalid JSON: \'height\' property must be a number.');
		} else if (json.root?.type !== 'branch') {
			throw new Error('Invalid JSON: \'root\' property must have \'type\' value of branch.');
		}

		const orientation = json.orientation;
		const height = json.height;

		const result = new GridView(options);
		result._deserialize(json.root, orientation, deserializer, height);

		return result;
	}

	private _deserialize(root: ISerializedBranchNode, orientation: Orientation, deserializer: IViewDeserializer<ISerializableView>, orthogonalSize: number): void {
		this.root = this._deserializeNode(root, orientation, deserializer, orthogonalSize) as BranchNode;
	}

	private _deserializeNode(node: ISerializedNode, orientation: Orientation, deserializer: IViewDeserializer<ISerializableView>, orthogonalSize: number): Node {
		let result: Node;
		if (node.type === 'branch') {
			const serializedChildren = node.data;
			const children = serializedChildren.map(serializedChild => {
				return {
					node: this._deserializeNode(serializedChild, orthogonal(orientation), deserializer, node.size),
					visible: (serializedChild as { visible?: boolean }).visible
				} satisfies INodeDescriptor;
			});

			result = new BranchNode(orientation, this.layoutController, this.styles, this.proportionalLayout, node.size, orthogonalSize, undefined, children);
		} else {
			result = new LeafNode(deserializer.fromJSON(node.data), orientation, this.layoutController, orthogonalSize, node.size);
			if (node.maximized && !this.maximizedNode) {
				this.maximizedNode = result;
				this._onDidChangeViewMaximized.fire(true);
			}
		}

		return result;
	}

	private _getViews(node: Node, orientation: Orientation, cachedVisibleSize?: number): GridNode {
		const box = { top: node.top, left: node.left, width: node.width, height: node.height };

		if (node instanceof LeafNode) {
			return { view: node.view, box, cachedVisibleSize, maximized: this.maximizedNode === node };
		}

		const children: GridNode[] = [];

		for (let i = 0; i < node.children.length; i++) {
			const child = node.children[i];
			const cachedVisibleSize = node.getChildCachedVisibleSize(i);

			children.push(this._getViews(child, orthogonal(orientation), cachedVisibleSize));
		}

		return { children, box };
	}

	private getNode(location: GridLocation, node: Node = this.root, path: BranchNode[] = []): [BranchNode[], Node] {
		if (location.length === 0) {
			return [path, node];
		}

		if (!(node instanceof BranchNode)) {
			throw new Error('Invalid location');
		}

		const [index, ...rest] = location;

		if (index < 0 || index >= node.children.length) {
			throw new Error('Invalid location');
		}

		const child = node.children[index];
		path.push(node);

		return this.getNode(rest, child, path);
	}

	/**
	 * Attempt to lock the {@link Sash sashes} in this {@link GridView} so
	 * the grid behaves as a 2x2 matrix, with a corner sash in the middle.
	 *
	 * In case the grid isn't a 2x2 grid _and_ all sashes are not aligned,
	 * this method is a no-op.
	 */
	trySet2x2(): void {
		this.disposable2x2.dispose();
		this.disposable2x2 = Disposable.None;

		if (this.root.children.length !== 2) {
			return;
		}

		const [first, second] = this.root.children;

		if (!(first instanceof BranchNode) || !(second instanceof BranchNode)) {
			return;
		}

		this.disposable2x2 = first.trySet2x2(second);
	}

	/**
	 * Populate a map with views to DOM nodes.
	 * @remarks To be used internally only.
	 */
	getViewMap(map: Map<IView, HTMLElement>, node?: Node): void {
		if (!node) {
			node = this.root;
		}

		if (node instanceof BranchNode) {
			node.children.forEach(child => this.getViewMap(map, child));
		} else {
			map.set(node.view, node.element);
		}
	}

	dispose(): void {
		this.onDidSashResetRelay.dispose();
		this.root.dispose();
		this.element.remove();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/highlightedlabel/highlightedLabel.ts]---
Location: vscode-main/src/vs/base/browser/ui/highlightedlabel/highlightedLabel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../dom.js';
import type { IManagedHover } from '../hover/hover.js';
import { IHoverDelegate } from '../hover/hoverDelegate.js';
import { getBaseLayerHoverDelegate } from '../hover/hoverDelegate2.js';
import { getDefaultHoverDelegate } from '../hover/hoverDelegateFactory.js';
import { renderLabelWithIcons } from '../iconLabel/iconLabels.js';
import { Disposable } from '../../../common/lifecycle.js';
import * as objects from '../../../common/objects.js';

/**
 * A range to be highlighted.
 */
export interface IHighlight {
	start: number;
	end: number;
	readonly extraClasses?: readonly string[];
}

export interface IHighlightedLabelOptions {
	readonly hoverDelegate?: IHoverDelegate;
}

/**
 * A widget which can render a label with substring highlights, often
 * originating from a filter function like the fuzzy matcher.
 */
export class HighlightedLabel extends Disposable {

	private readonly domNode: HTMLElement;
	private text: string = '';
	private title: string = '';
	private highlights: readonly IHighlight[] = [];
	private didEverRender: boolean = false;
	private customHover: IManagedHover | undefined;

	/**
	 * Create a new {@link HighlightedLabel}.
	 *
	 * @param container The parent container to append to.
	 */
	constructor(container: HTMLElement, private readonly options?: IHighlightedLabelOptions) {
		super();

		this.domNode = dom.append(container, dom.$('span.monaco-highlighted-label'));
	}

	/**
	 * The label's DOM node.
	 */
	get element(): HTMLElement {
		return this.domNode;
	}

	/**
	 * Set the label and highlights.
	 *
	 * @param text The label to display.
	 * @param highlights The ranges to highlight.
	 * @param title An optional title for the hover tooltip.
	 * @param escapeNewLines Whether to escape new lines.
	 * @returns
	 */
	set(text: string | undefined, highlights: readonly IHighlight[] = [], title: string = '', escapeNewLines?: boolean, supportIcons?: boolean) {
		if (!text) {
			text = '';
		}

		if (escapeNewLines) {
			// adjusts highlights inplace
			text = HighlightedLabel.escapeNewLines(text, highlights);
		}

		if (this.didEverRender && this.text === text && this.title === title && objects.equals(this.highlights, highlights)) {
			return;
		}

		this.text = text;
		this.title = title;
		this.highlights = highlights;
		this.render(supportIcons);
	}

	private render(supportIcons?: boolean): void {

		const children: Array<HTMLSpanElement | string> = [];
		let pos = 0;

		for (const highlight of this.highlights) {
			if (highlight.end === highlight.start) {
				continue;
			}

			if (pos < highlight.start) {
				const substring = this.text.substring(pos, highlight.start);
				if (supportIcons) {
					children.push(...renderLabelWithIcons(substring));
				} else {
					children.push(substring);
				}
				pos = highlight.start;
			}

			const substring = this.text.substring(pos, highlight.end);
			const element = dom.$('span.highlight', undefined, ...supportIcons ? renderLabelWithIcons(substring) : [substring]);

			if (highlight.extraClasses) {
				element.classList.add(...highlight.extraClasses);
			}

			children.push(element);
			pos = highlight.end;
		}

		if (pos < this.text.length) {
			const substring = this.text.substring(pos,);
			if (supportIcons) {
				children.push(...renderLabelWithIcons(substring));
			} else {
				children.push(substring);
			}
		}

		dom.reset(this.domNode, ...children);

		if (!this.customHover && this.title !== '') {
			const hoverDelegate = this.options?.hoverDelegate ?? getDefaultHoverDelegate('mouse');
			this.customHover = this._register(getBaseLayerHoverDelegate().setupManagedHover(hoverDelegate, this.domNode, this.title));
		} else if (this.customHover) {
			this.customHover.update(this.title);
		}

		this.didEverRender = true;
	}

	static escapeNewLines(text: string, highlights: readonly IHighlight[]): string {
		let total = 0;
		let extra = 0;

		return text.replace(/\r\n|\r|\n/g, (match, offset) => {
			extra = match === '\r\n' ? -1 : 0;
			offset += total;

			for (const highlight of highlights) {
				if (highlight.end <= offset) {
					continue;
				}
				if (highlight.start >= offset) {
					highlight.start += extra;
				}
				if (highlight.end >= offset) {
					highlight.end += extra;
				}
			}

			total += extra;
			return '\u23CE';
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/hover/hover.ts]---
Location: vscode-main/src/vs/base/browser/ui/hover/hover.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { IHoverDelegate } from './hoverDelegate.js';
import type { HoverPosition } from './hoverWidget.js';
import type { CancellationToken } from '../../../common/cancellation.js';
import type { IMarkdownString } from '../../../common/htmlContent.js';
import type { IDisposable } from '../../../common/lifecycle.js';

/**
 * Enables the convenient display of rich markdown-based hovers in the workbench.
 */
export interface IHoverDelegate2 {
	/**
	 * Shows a hover after a delay, or immediately if the {@link groupId} matches the currently
	 * shown hover.
	 *
	 * Use this method when you want to:
	 *
	 * - Control showing the hover yourself.
	 * - Show the hover after the standard delay.
	 *
	 * @param options The options of the hover.
	 * @param groupId The group ID of the hover. If the group ID is the same as the currently shown
	 * hover, the hover will be shown immediately, skipping the delay.
	 */
	showDelayedHover(
		options: IHoverOptions,
		lifecycleOptions: Pick<IHoverLifecycleOptions, 'groupId'>,
	): IHoverWidget | undefined;

	/**
	 * A simple wrapper around showDelayedHover that includes listening to events on the
	 * {@link target} element that shows the hover.
	 *
	 * Use this method when you want to:
	 *
	 * - Let the hover service handle showing the hover.
	 * - Show the hover after the standard delay.
	 * - Want the hover positioned beside the {@link target} element.
	 *
	 * @param target The target element to listener for mouseover events on.
	 * @param hoverOptions The options of the hover.
	 * @param lifecycleOptions The options of the hover's lifecycle.
	 */
	setupDelayedHover(
		target: HTMLElement,
		hoverOptions: (() => IDelayedHoverOptions) | IDelayedHoverOptions,
		lifecycleOptions?: IHoverLifecycleOptions,
	): IDisposable;

	/**
	 * A simple wrapper around showDelayedHover that includes listening to events on the
	 * {@link target} element that shows the hover. This differs from {@link setupDelayedHover} in
	 * that the hover will be shown at the mouse position instead of the
	 * {@link target target} element's position, ignoring any
	 * {@link IHoverOptions.position position options} that are passed in.
	 *
	 * Use this method when you want to:
	 *
	 * - Let the hover service handle showing the hover.
	 * - Show the hover after the standard delay.
	 * - Want the hover positioned beside the mouse.
	 *
	 * @param target The target element to listener for mouseover events on.
	 * @param hoverOptions The options of the hover.
	 * @param lifecycleOptions The options of the hover's lifecycle.
	 */
	setupDelayedHoverAtMouse(
		target: HTMLElement,
		hoverOptions: (() => IDelayedHoverAtMouseOptions) | IDelayedHoverAtMouseOptions,
		lifecycleOptions?: IHoverLifecycleOptions,
	): IDisposable;

	/**
	 * Shows a hover immediately, provided a hover with the same {@link options} object is not
	 * already visible.
	 *
	 * Use this method when you want to:
	 *
	 * - Control showing the hover yourself.
	 * - Show the hover immediately.
	 *
	 * @param options A set of options defining the characteristics of the hover.
	 * @param focus Whether to focus the hover (useful for keyboard accessibility).
	 *
	 * @example A simple usage with a single element target.
	 *
	 * ```typescript
	 * showInstantHover({
	 *   text: new MarkdownString('Hello world'),
	 *   target: someElement
	 * });
	 * ```
	 */
	showInstantHover(
		options: IHoverOptions,
		focus?: boolean
	): IHoverWidget | undefined;

	/**
	 * Hides the hover if it was visible. This call will be ignored if the hover is currently
	 * "locked" via the alt/option key unless `force` is set.
	 */
	hideHover(force?: boolean): void;

	/**
	 * This should only be used until we have the ability to show multiple context views
	 * simultaneously. #188822
	 */
	showAndFocusLastHover(): void;

	/**
	 * Sets up a managed hover for the given element. A managed hover will set up listeners for
	 * mouse events, show the hover after a delay and provide hooks to easily update the content.
	 *
	 * This should be used over {@link showInstantHover} when fine-grained control is not needed. The
	 * managed hover also does not scale well, consider using {@link showInstantHover} when showing hovers
	 * for many elements.
	 *
	 * @param hoverDelegate The hover delegate containing hooks and configuration for the hover.
	 * @param targetElement The target element to show the hover for.
	 * @param content The content of the hover or a factory that creates it at the time it's shown.
	 * @param options Additional options for the managed hover.
	 *
	 * @deprecated Use {@link setupDelayedHover} or {@link setupDelayedHoverAtMouse} instead where
	 * possible.
	 */
	setupManagedHover(hoverDelegate: IHoverDelegate, targetElement: HTMLElement, content: IManagedHoverContentOrFactory, options?: IManagedHoverOptions): IManagedHover;

	/**
	 * Shows the hover for the given element if one has been setup.
	 *
	 * @param targetElement The target element of the hover, as set up in {@link setupManagedHover}.
	 *
	 * @deprecated Use {@link setupDelayedHover} or {@link setupDelayedHoverAtMouse} instead where
	 * possible.
	 */
	showManagedHover(targetElement: HTMLElement): void;
}

export interface IHoverWidget extends IDisposable {
	/**
	 * Whether the hover widget has been disposed.
	 */
	readonly isDisposed: boolean;
}

export const enum HoverStyle {
	/**
	 * The hover is anchored below the element with a pointer above it pointing at the target.
	 */
	Pointer = 1,
	/**
	 * The hover is anchored to the bottom right of the cursor's location.
	 */
	Mouse = 2,
}

export interface IHoverOptions {
	/**
	 * The content to display in the primary section of the hover. The type of text determines the
	 * default `hideOnHover` behavior.
	 */
	content: IMarkdownString | string | HTMLElement;

	/**
	 * The target for the hover. This determines the position of the hover and it will only be
	 * hidden when the mouse leaves both the hover and the target. A HTMLElement can be used for
	 * simple cases and a IHoverTarget for more complex cases where multiple elements and/or a
	 * dispose method is required.
	 */
	target: IHoverTarget | HTMLElement;

	/*
	 * The container to pass to {@link IContextViewProvider.showContextView} which renders the hover
	 * in. This is particularly useful for more natural tab focusing behavior, where the hover is
	 * created as the next tab index after the element being hovered and/or to workaround the
	 * element's container hiding on `focusout`.
	 */
	container?: HTMLElement;

	/**
	 * An ID to associate with the hover to be used as an equality check. Normally when calling
	 * {@link IHoverService.showHover} the options object itself is used to determine if the hover
	 * is the same one that is already showing, when this is set, the ID will be used instead.
	 *
	 * When `undefined`, this will default to a serialized version of {@link content}. In this case
	 * it will remain `undefined` if {@link content} is a `HTMLElement`.
	 */
	id?: string;

	/**
	 * A set of actions for the hover's "status bar".
	 */
	actions?: IHoverAction[];

	/**
	 * An optional array of classes to add to the hover element.
	 */
	additionalClasses?: string[];

	/**
	 * An optional link handler for markdown links, if this is not provided the IOpenerService will
	 * be used to open the links using its default options.
	 */
	linkHandler?(url: string): void;

	/**
	 * Whether to trap focus in the following ways:
	 * - When the hover closes, focus goes to the element that had focus before the hover opened
	 * - If there are elements in the hover to focus, focus stays inside of the hover when tabbing
	 * Note that this is overridden to true when in screen reader optimized mode.
	 */
	trapFocus?: boolean;

	/**
	 * The style of the hover, this sets default values of {@link position} and {@link appearance}:
	 */
	style?: HoverStyle;

	/**
	 * Options that defines where the hover is positioned.
	 */
	position?: IHoverPositionOptions;

	/**
	 * Options that defines how long the hover is shown and when it hides.
	 */
	persistence?: IHoverPersistenceOptions;

	/**
	 * Options that define how the hover looks.
	 */
	appearance?: IHoverAppearanceOptions;
}

// `target` is ignored for delayed hover methods as it's included in the method and added
// automatically when the hover options get resolved.
export type IDelayedHoverOptions = Omit<IHoverOptions, 'target'>;

// `position` is ignored for delayed at mouse hover methods as it's overwritten by the mouse event.
// `showPointer` is always false when using mouse positioning
export type IDelayedHoverAtMouseOptions = Omit<IDelayedHoverOptions, 'position' | 'appearance'> & { appearance?: Omit<IHoverAppearanceOptions, 'showPointer'> };

export interface IHoverLifecycleOptions {
	/**
	 * The group ID of the hover. If the group ID is the same as the currently shown hover, the
	 * hover will be shown immediately, skipping the delay.
	 *
	 * @example Use a UUID to set a unique `groupId` for related hovers
	 *
	 * ```typescript
	 * const groupId = generateUuid();
	 * showDelayedHover({ content: 'Button 1', target: someElement1 }, { groupId });
	 * showDelayedHover({ content: 'Button 2', target: someElement2 }, { groupId });
	 * ```
	 *
	 * @example Use a feature-specific string to set a unqiue `groupId` for related hovers
	 *
	 * ```typescript
	 * showDelayedHover({ content: 'Button 1', target: someElement1 }, { groupId: 'my-feature-items' });
	 * showDelayedHover({ content: 'Button 2', target: someElement2 }, { groupId: 'my-feature-items' });
	 * ```
	 */
	groupId?: string;

	/**
	 * Whether to set up space and enter keyboard events for the hover, when these are pressed when
	 * the hover's target is focused it will show and focus the hover.
	 *
	 * Typically this should _not_ be used when the space or enter events are already handled by
	 * something else.
	 */
	setupKeyboardEvents?: boolean;
}

export interface IHoverPositionOptions {
	/**
	 * Position of the hover. The default is to show above the target. This option will be ignored
	 * if there is not enough room to layout the hover in the specified position, unless the
	 * forcePosition option is set.
	 */
	hoverPosition?: HoverPosition | MouseEvent;

	/**
	 * Force the hover position, reducing the size of the hover instead of adjusting the hover
	 * position.
	 */
	forcePosition?: boolean;
}

export interface IHoverPersistenceOptions {
	/**
	 * Whether to hide the hover when the mouse leaves the `target` and enters the actual hover.
	 * This is false by default when text is an `IMarkdownString` and true when `text` is a
	 * `string`. Note that this will be ignored if any `actions` are provided as hovering is
	 * required to make them accessible.
	 *
	 * In general hiding on hover is desired for:
	 * - Regular text where selection is not important
	 * - Markdown that contains no links where selection is not important
	 */
	hideOnHover?: boolean;

	/**
	 * Whether to hide the hover when a key is pressed.
	 */
	hideOnKeyDown?: boolean;

	/**
	 * Whether to make the hover sticky, this means it will not be hidden when the mouse leaves the
	 * hover.
	 */
	sticky?: boolean;
}

export interface IHoverAppearanceOptions {
	/**
	 * Whether to show the hover pointer, a little arrow that connects the target and the hover.
	 */
	showPointer?: boolean;

	/**
	 * Whether to show a compact hover, reducing the font size and padding of the hover.
	 */
	compact?: boolean;

	/**
	 * When {@link hideOnHover} is explicitly true or undefined and its auto value is detected to
	 * hide, show a hint at the bottom of the hover explaining how to mouse over the widget. This
	 * should be used in the cases where despite the hover having no interactive content, it's
	 * likely the user may want to interact with it somehow.
	 */
	showHoverHint?: boolean;

	/**
	 * Whether to skip the fade in animation, this should be used when hovering from one hover to
	 * another in the same group so it looks like the hover is moving from one element to the other.
	 */
	skipFadeInAnimation?: boolean;

	/**
	 * The max height of the hover relative to the window height.
	 * Accepted values: (0,1]
	 * Default: 0.5
	 */
	maxHeightRatio?: number;
}

export interface IHoverAction {
	/**
	 * The label to use in the hover's status bar.
	 */
	label: string;

	/**
	 * The command ID of the action, this is used to resolve the keybinding to display after the
	 * action label.
	 */
	commandId: string;

	/**
	 * An optional class of an icon that will be displayed before the label.
	 */
	iconClass?: string;

	/**
	 * The callback to run the action.
	 * @param target The action element that was activated.
	 */
	run(target: HTMLElement): void;
}

/**
 * A target for a hover.
 */
export interface IHoverTarget extends Partial<IDisposable> {
	/**
	 * A set of target elements used to position the hover. If multiple elements are used the hover
	 * will try to not overlap any target element. An example use case for this is show a hover for
	 * wrapped text.
	 */
	readonly targetElements: readonly HTMLElement[];

	/**
	 * An optional absolute x coordinate to position the hover with, for example to position the
	 * hover using `MouseEvent.pageX`.
	 */
	readonly x?: number;

	/**
	 * An optional absolute y coordinate to position the hover with, for example to position the
	 * hover using `MouseEvent.pageY`.
	 */
	readonly y?: number;
}

// #region Managed hover

export interface IManagedHoverTooltipMarkdownString {
	markdown: IMarkdownString | string | undefined | ((token: CancellationToken) => Promise<IMarkdownString | string | undefined>);
	markdownNotSupportedFallback: string | undefined;
}

export function isManagedHoverTooltipMarkdownString(obj: unknown): obj is IManagedHoverTooltipMarkdownString {
	const candidate = obj as IManagedHoverTooltipMarkdownString;
	return typeof candidate === 'object' && 'markdown' in candidate && 'markdownNotSupportedFallback' in candidate;
}

export interface IManagedHoverTooltipHTMLElement {
	element: (token: CancellationToken) => HTMLElement | Promise<HTMLElement>;
}

export function isManagedHoverTooltipHTMLElement(obj: unknown): obj is IManagedHoverTooltipHTMLElement {
	const candidate = obj as IManagedHoverTooltipHTMLElement;
	return typeof candidate === 'object' && 'element' in candidate;
}

export type IManagedHoverContent = string | IManagedHoverTooltipMarkdownString | IManagedHoverTooltipHTMLElement | HTMLElement | undefined;
export type IManagedHoverContentOrFactory = IManagedHoverContent | (() => IManagedHoverContent);

export interface IManagedHoverOptions extends Pick<IHoverOptions, 'actions' | 'linkHandler' | 'trapFocus'> {
	appearance?: Pick<IHoverAppearanceOptions, 'showHoverHint'>;
}

export interface IManagedHover extends IDisposable {
	/**
	 * Allows to programmatically open the hover.
	 */
	show(focus?: boolean): void;

	/**
	 * Allows to programmatically hide the hover.
	 */
	hide(): void;

	/**
	 * Updates the contents of the hover.
	 */
	update(tooltip: IManagedHoverContent, options?: IManagedHoverOptions): void;
}

// #endregion Managed hover
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/hover/hoverDelegate.ts]---
Location: vscode-main/src/vs/base/browser/ui/hover/hoverDelegate.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { IHoverWidget, IManagedHoverContentOrFactory, IManagedHoverOptions } from './hover.js';
import { HoverPosition } from './hoverWidget.js';
import { IMarkdownString } from '../../../common/htmlContent.js';
import { IDisposable } from '../../../common/lifecycle.js';

export interface IHoverDelegateTarget extends IDisposable {
	readonly targetElements: readonly HTMLElement[];
	x?: number;
}

export interface IHoverDelegateOptions extends IManagedHoverOptions {
	/**
	 * The content to display in the primary section of the hover. The type of text determines the
	 * default `hideOnHover` behavior.
	 */
	content: IMarkdownString | string | HTMLElement;
	/**
	 * The target for the hover. This determines the position of the hover and it will only be
	 * hidden when the mouse leaves both the hover and the target. A HTMLElement can be used for
	 * simple cases and a IHoverDelegateTarget for more complex cases where multiple elements and/or a
	 * dispose method is required.
	 */
	target: IHoverDelegateTarget | HTMLElement;
	/**
	 * The container to pass to {@link IContextViewProvider.showContextView} which renders the hover
	 * in. This is particularly useful for more natural tab focusing behavior, where the hover is
	 * created as the next tab index after the element being hovered and/or to workaround the
	 * element's container hiding on `focusout`.
	 */
	container?: HTMLElement;
	/**
	 * Options that defines where the hover is positioned.
	 */
	position?: {
		/**
		 * Position of the hover. The default is to show above the target. This option will be ignored
		 * if there is not enough room to layout the hover in the specified position, unless the
		 * forcePosition option is set.
		 */
		hoverPosition?: HoverPosition;
	};
	appearance?: {
		/**
		 * Whether to show the hover pointer
		 */
		showPointer?: boolean;
		/**
		 * When {@link hideOnHover} is explicitly true or undefined and its auto value is detected to
		 * hide, show a hint at the bottom of the hover explaining how to mouse over the widget. This
		 * should be used in the cases where despite the hover having no interactive content, it's
		 * likely the user may want to interact with it somehow.
		 */
		showHoverHint?: boolean;
		/**
		 * Whether to skip the fade in animation, this should be used when hovering from one hover to
		 * another in the same group so it looks like the hover is moving from one element to the other.
		 */
		skipFadeInAnimation?: boolean;
	};
}

export interface IHoverDelegate {
	showHover(options: IHoverDelegateOptions, focus?: boolean): IHoverWidget | undefined;
	onDidHideHover?: () => void;
	delay: number | ((content?: IManagedHoverContentOrFactory) => number);
	placement?: 'mouse' | 'element';
	showNativeHover?: boolean; // TODO@benibenj remove this, only temp fix for contextviews
}

export interface IScopedHoverDelegate extends IHoverDelegate, IDisposable { }
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/hover/hoverDelegate2.ts]---
Location: vscode-main/src/vs/base/browser/ui/hover/hoverDelegate2.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../common/lifecycle.js';
import type { IHoverDelegate2 } from './hover.js';

let baseHoverDelegate: IHoverDelegate2 = {
	showInstantHover: () => undefined,
	showDelayedHover: () => undefined,
	setupDelayedHover: () => Disposable.None,
	setupDelayedHoverAtMouse: () => Disposable.None,
	hideHover: () => undefined,
	showAndFocusLastHover: () => undefined,
	setupManagedHover: () => ({
		dispose: () => undefined,
		show: () => undefined,
		hide: () => undefined,
		update: () => undefined,
	}),
	showManagedHover: () => undefined
};

/**
 * Sets the hover delegate for use **only in the `base/` layer**.
 */
export function setBaseLayerHoverDelegate(hoverDelegate: IHoverDelegate2): void {
	baseHoverDelegate = hoverDelegate;
}

/**
 * Gets the hover delegate for use **only in the `base/` layer**.
 *
 * Since the hover service depends on various platform services, this delegate essentially bypasses
 * the standard dependency injection mechanism by injecting a global hover service at start up. The
 * only reason this should be used is if `IHoverService` is not available.
 */
export function getBaseLayerHoverDelegate(): IHoverDelegate2 {
	return baseHoverDelegate;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/hover/hoverDelegateFactory.ts]---
Location: vscode-main/src/vs/base/browser/ui/hover/hoverDelegateFactory.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IHoverDelegate, IScopedHoverDelegate } from './hoverDelegate.js';
import { Lazy } from '../../../common/lazy.js';

const nullHoverDelegateFactory = () => ({
	get delay(): number { return -1; },
	dispose: () => { },
	showHover: () => { return undefined; },
});

let hoverDelegateFactory: (placement: 'mouse' | 'element', enableInstantHover: boolean) => IScopedHoverDelegate = nullHoverDelegateFactory;
const defaultHoverDelegateMouse = new Lazy<IHoverDelegate>(() => hoverDelegateFactory('mouse', false));
const defaultHoverDelegateElement = new Lazy<IHoverDelegate>(() => hoverDelegateFactory('element', false));

// TODO: Remove when getDefaultHoverDelegate is no longer used
export function setHoverDelegateFactory(hoverDelegateProvider: ((placement: 'mouse' | 'element', enableInstantHover: boolean) => IScopedHoverDelegate)): void {
	hoverDelegateFactory = hoverDelegateProvider;
}

// TODO: Refine type for use in new IHoverService interface
export function getDefaultHoverDelegate(placement: 'mouse' | 'element'): IHoverDelegate {
	if (placement === 'element') {
		return defaultHoverDelegateElement.value;
	}
	return defaultHoverDelegateMouse.value;
}

// TODO: Create equivalent in IHoverService
export function createInstantHoverDelegate(): IScopedHoverDelegate {
	// Creates a hover delegate with instant hover enabled.
	// This hover belongs to the consumer and requires the them to dispose it.
	// Instant hover only makes sense for 'element' placement.
	return hoverDelegateFactory('element', true);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/hover/hoverWidget.css]---
Location: vscode-main/src/vs/base/browser/ui/hover/hoverWidget.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-hover {
	cursor: default;
	position: absolute;
	overflow: hidden;
	user-select: text;
	-webkit-user-select: text;
	box-sizing: border-box;
	line-height: 1.5em;
	white-space: var(--vscode-hover-whiteSpace, normal);
}

.monaco-hover.fade-in {
	animation: fadein 100ms linear;
}

.monaco-hover.hidden {
	display: none;
}

.monaco-hover a:hover:not(.disabled) {
	cursor: pointer;
}

.monaco-hover .hover-contents:not(.html-hover-contents) {
	padding: 4px 8px;
}

.monaco-hover .markdown-hover > .hover-contents:not(.code-hover-contents) {
	max-width: var(--vscode-hover-maxWidth, 500px);
	word-wrap: break-word;
}

.monaco-hover .markdown-hover > .hover-contents:not(.code-hover-contents) hr {
	min-width: 100%;
}

.monaco-hover p,
.monaco-hover .code,
.monaco-hover ul,
.monaco-hover h1,
.monaco-hover h2,
.monaco-hover h3,
.monaco-hover h4,
.monaco-hover h5,
.monaco-hover h6 {
	margin: 8px 0;
}

.monaco-hover h1,
.monaco-hover h2,
.monaco-hover h3,
.monaco-hover h4,
.monaco-hover h5,
.monaco-hover h6 {
	line-height: 1.1;
}

.monaco-hover code {
	font-family: var(--monaco-monospace-font);
}

.monaco-hover hr {
	box-sizing: border-box;
	border-left: 0px;
	border-right: 0px;
	margin-top: 4px;
	margin-bottom: -4px;
	margin-left: -8px;
	margin-right: -8px;
	height: 1px;
}

.monaco-hover p:first-child,
.monaco-hover .code:first-child,
.monaco-hover ul:first-child {
	margin-top: 0;
}

.monaco-hover p:last-child,
.monaco-hover .code:last-child,
.monaco-hover ul:last-child {
	margin-bottom: 0;
}

/* MarkupContent Layout */
.monaco-hover ul {
	padding-left: 20px;
}
.monaco-hover ol {
	padding-left: 20px;
}

.monaco-hover li > p {
	margin-bottom: 0;
}

.monaco-hover li > ul {
	margin-top: 0;
}

.monaco-hover code {
	border-radius: 3px;
	padding: 0 0.4em;
}

.monaco-hover .monaco-tokenized-source {
	white-space: var(--vscode-hover-sourceWhiteSpace, pre-wrap);
}

.monaco-hover .hover-row.status-bar {
	font-size: 12px;
	line-height: 22px;
}

.monaco-hover .hover-row.status-bar .info {
	font-style: italic;
	padding: 0px 8px;
}

.monaco-hover .hover-row.status-bar .actions {
	display: flex;
	padding: 0px 8px;
	width: 100%;
}

.monaco-hover .hover-row.status-bar .actions .action-container {
	margin-right: 16px;
	cursor: pointer;
	overflow: hidden;
	text-wrap: nowrap;
	text-overflow: ellipsis;
}

.monaco-hover .hover-row.status-bar .actions .action-container .action .icon {
	padding-right: 4px;
	vertical-align: middle;
}

.monaco-hover .hover-row.status-bar .actions .action-container a {
	color: var(--vscode-textLink-foreground);
	text-decoration: var(--text-link-decoration);
}

.monaco-hover .hover-row.status-bar .actions .action-container a .icon.codicon {
	color: var(--vscode-textLink-foreground);
}

.monaco-hover .markdown-hover .hover-contents .codicon {
	color: inherit;
	font-size: inherit;
	vertical-align: middle;
}

.monaco-hover .hover-contents a.code-link:hover,
.monaco-hover .hover-contents a.code-link {
	color: inherit;
}

.monaco-hover .hover-contents a.code-link:before {
	content: '(';
}

.monaco-hover .hover-contents a.code-link:after {
	content: ')';
}

.monaco-hover .hover-contents a.code-link > span {
	text-decoration: underline;
	/** Hack to force underline to show **/
	border-bottom: 1px solid transparent;
	text-underline-position: under;
	color: var(--vscode-textLink-foreground);
}

.monaco-hover .hover-contents a.code-link > span:hover {
	color: var(--vscode-textLink-activeForeground);
}

/**
 * Add a slight margin to try vertically align codicons with any text
 * https://github.com/microsoft/vscode/issues/221359
 */
.monaco-hover .markdown-hover .hover-contents:not(.code-hover-contents):not(.html-hover-contents) span.codicon {
	margin-bottom: 2px;
}

.monaco-hover-content .action-container a {
	-webkit-user-select: none;
	user-select: none;
}

.monaco-hover-content .action-container.disabled {
	pointer-events: none;
	opacity: 0.4;
	cursor: default;
}

/* Prevent text selection in all button-like elements within hovers */
.monaco-hover .action-container,
.monaco-hover .action,
.monaco-hover button,
.monaco-hover .monaco-button,
.monaco-hover .monaco-text-button,
.monaco-hover [role="button"] {
	-webkit-user-select: none;
	user-select: none;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/hover/hoverWidget.ts]---
Location: vscode-main/src/vs/base/browser/ui/hover/hoverWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../dom.js';
import { StandardKeyboardEvent } from '../../keyboardEvent.js';
import { DomScrollableElement } from '../scrollbar/scrollableElement.js';
import { KeyCode } from '../../../common/keyCodes.js';
import { Disposable } from '../../../common/lifecycle.js';
import './hoverWidget.css';
import { localize } from '../../../../nls.js';

const $ = dom.$;

export const enum HoverPosition {
	LEFT,
	RIGHT,
	BELOW,
	ABOVE,
}

export class HoverWidget extends Disposable {

	public readonly containerDomNode: HTMLElement;
	public readonly contentsDomNode: HTMLElement;
	public readonly scrollbar: DomScrollableElement;

	constructor(fadeIn: boolean) {
		super();

		this.containerDomNode = document.createElement('div');
		this.containerDomNode.className = 'monaco-hover';
		this.containerDomNode.classList.toggle('fade-in', !!fadeIn);
		this.containerDomNode.tabIndex = 0;
		this.containerDomNode.setAttribute('role', 'tooltip');

		this.contentsDomNode = document.createElement('div');
		this.contentsDomNode.className = 'monaco-hover-content';

		this.scrollbar = this._register(new DomScrollableElement(this.contentsDomNode, {
			consumeMouseWheelIfScrollbarIsNeeded: true
		}));
		this.containerDomNode.appendChild(this.scrollbar.getDomNode());
	}

	public onContentsChanged(): void {
		this.scrollbar.scanDomNode();
	}
}

export class HoverAction extends Disposable {
	public static render(parent: HTMLElement, actionOptions: { label: string; iconClass?: string; run: (target: HTMLElement) => void; commandId: string }, keybindingLabel: string | null) {
		return new HoverAction(parent, actionOptions, keybindingLabel);
	}

	public readonly actionLabel: string;
	public readonly actionKeybindingLabel: string | null;

	public readonly actionRenderedLabel: string;
	public readonly actionContainer: HTMLElement;

	private readonly action: HTMLElement;

	private constructor(parent: HTMLElement, actionOptions: { label: string; iconClass?: string; run: (target: HTMLElement) => void; commandId: string }, keybindingLabel: string | null) {
		super();

		this.actionLabel = actionOptions.label;
		this.actionKeybindingLabel = keybindingLabel;

		this.actionContainer = dom.append(parent, $('div.action-container'));
		this.actionContainer.setAttribute('tabindex', '0');

		this.action = dom.append(this.actionContainer, $('a.action'));
		this.action.setAttribute('role', 'button');
		if (actionOptions.iconClass) {
			const iconElement = dom.append(this.action, $(`span.icon`));
			iconElement.classList.add(...actionOptions.iconClass.split(' '));
		}
		this.actionRenderedLabel = keybindingLabel ? `${actionOptions.label} (${keybindingLabel})` : actionOptions.label;
		const label = dom.append(this.action, $('span'));
		label.textContent = this.actionRenderedLabel;

		this._store.add(new ClickAction(this.actionContainer, actionOptions.run));
		this._store.add(new KeyDownAction(this.actionContainer, actionOptions.run, [KeyCode.Enter, KeyCode.Space]));
		this.setEnabled(true);
	}

	public setEnabled(enabled: boolean): void {
		if (enabled) {
			this.actionContainer.classList.remove('disabled');
			this.actionContainer.removeAttribute('aria-disabled');
		} else {
			this.actionContainer.classList.add('disabled');
			this.actionContainer.setAttribute('aria-disabled', 'true');
		}
	}
}

export function getHoverAccessibleViewHint(shouldHaveHint?: boolean, keybinding?: string | null): string | undefined {
	return shouldHaveHint && keybinding ? localize('acessibleViewHint', "Inspect this in the accessible view with {0}.", keybinding) : shouldHaveHint ? localize('acessibleViewHintNoKbOpen', "Inspect this in the accessible view via the command Open Accessible View which is currently not triggerable via keybinding.") : '';
}

export class ClickAction extends Disposable {
	constructor(container: HTMLElement, run: (container: HTMLElement) => void) {
		super();
		this._register(dom.addDisposableListener(container, dom.EventType.CLICK, e => {
			e.stopPropagation();
			e.preventDefault();
			run(container);
		}));
	}
}

export class KeyDownAction extends Disposable {
	constructor(container: HTMLElement, run: (container: HTMLElement) => void, keyCodes: KeyCode[]) {
		super();
		this._register(dom.addDisposableListener(container, dom.EventType.KEY_DOWN, e => {
			const event = new StandardKeyboardEvent(e);
			if (keyCodes.some(keyCode => event.equals(keyCode))) {
				e.stopPropagation();
				e.preventDefault();
				run(container);
			}
		}));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/iconLabel/iconlabel.css]---
Location: vscode-main/src/vs/base/browser/ui/iconLabel/iconlabel.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* ---------- Icon label ---------- */

.monaco-icon-label {
	display: flex; /* required for icons support :before rule */
	overflow: hidden;
	text-overflow: ellipsis;
}

.monaco-icon-label::before {

	/* svg icons rendered as background image */
	background-size: 16px;
	background-position: left center;
	background-repeat: no-repeat;
	padding-right: 6px;
	width: 16px;
	height: 22px;
	line-height: inherit !important;
	display: inline-block;

	/* fonts icons */
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	vertical-align: top;

	flex-shrink: 0; /* fix for https://github.com/microsoft/vscode/issues/13787 */
}

.monaco-icon-label-iconpath {
	width: 16px;
	height: 22px;
	margin-right: 6px;
	display: flex;
}

.monaco-icon-label-container.disabled {
	color: var(--vscode-disabledForeground);
}
.monaco-icon-label > .monaco-icon-label-container {
	min-width: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	flex: 1;
}

.monaco-icon-label > .monaco-icon-label-container > .monaco-icon-name-container > .label-name {
	color: inherit;
	white-space: pre; /* enable to show labels that include multiple whitespaces */
}

.monaco-icon-label > .monaco-icon-label-container > .monaco-icon-name-container > .label-name > .label-separator {
	margin: 0 2px;
	opacity: 0.5;
}

.monaco-icon-label > .monaco-icon-label-container > .monaco-icon-suffix-container > .label-suffix {
	opacity: .7;
	white-space: pre;
}

.monaco-icon-label > .monaco-icon-label-container > .monaco-icon-description-container > .label-description {
	opacity: .7;
	margin-left: 0.5em;
	font-size: 0.9em;
	white-space: pre; /* enable to show labels that include multiple whitespaces */
}

.monaco-icon-label.nowrap > .monaco-icon-label-container > .monaco-icon-description-container > .label-description{
	white-space: nowrap
}

.vs .monaco-icon-label > .monaco-icon-label-container > .monaco-icon-description-container > .label-description {
	opacity: .95;
}

.monaco-icon-label.bold > .monaco-icon-label-container > .monaco-icon-name-container > .label-name,
.monaco-icon-label.bold > .monaco-icon-label-container > .monaco-icon-description-container > .label-description {
	font-weight: bold;
}

.monaco-icon-label.italic > .monaco-icon-label-container > .monaco-icon-name-container > .label-name,
.monaco-icon-label.italic > .monaco-icon-label-container > .monaco-icon-description-container > .label-description {
	font-style: italic;
}

.monaco-icon-label.deprecated {
	text-decoration: line-through;
	opacity: 0.66;
}

.monaco-icon-label.strikethrough > .monaco-icon-label-container > .monaco-icon-name-container > .label-name,
.monaco-icon-label.strikethrough > .monaco-icon-label-container > .monaco-icon-description-container > .label-description {
	text-decoration: line-through;
}

.monaco-icon-label::after {
	opacity: 0.75;
	font-size: 90%;
	font-weight: 600;
	margin: auto 16px 0 5px; /* https://github.com/microsoft/vscode/issues/113223 */
	text-align: center;
}

/* make sure selection color wins when a label is being selected */
.monaco-list:focus .selected .monaco-icon-label, /* list */
.monaco-list:focus .selected .monaco-icon-label::after
{
	color: inherit !important;
}

.monaco-list-row.focused.selected .label-description,
.monaco-list-row.selected .label-description {
	opacity: .8;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/iconLabel/iconLabel.ts]---
Location: vscode-main/src/vs/base/browser/ui/iconLabel/iconLabel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './iconlabel.css';
import * as dom from '../../dom.js';
import * as css from '../../cssValue.js';
import { HighlightedLabel } from '../highlightedlabel/highlightedLabel.js';
import { IHoverDelegate } from '../hover/hoverDelegate.js';
import { IMatch } from '../../../common/filters.js';
import { Disposable, IDisposable } from '../../../common/lifecycle.js';
import { equals } from '../../../common/objects.js';
import { Range } from '../../../common/range.js';
import { getDefaultHoverDelegate } from '../hover/hoverDelegateFactory.js';
import type { IManagedHoverTooltipMarkdownString } from '../hover/hover.js';
import { getBaseLayerHoverDelegate } from '../hover/hoverDelegate2.js';
import { URI } from '../../../common/uri.js';
import { ThemeIcon } from '../../../common/themables.js';

export interface IIconLabelCreationOptions {
	readonly supportHighlights?: boolean;
	readonly supportDescriptionHighlights?: boolean;
	readonly supportIcons?: boolean;
	readonly hoverDelegate?: IHoverDelegate;
	readonly hoverTargetOverride?: HTMLElement;
}

export interface IIconLabelValueOptions {
	title?: string | IManagedHoverTooltipMarkdownString;
	descriptionTitle?: string | IManagedHoverTooltipMarkdownString;
	suffix?: string;
	hideIcon?: boolean;
	extraClasses?: readonly string[];
	bold?: boolean;
	italic?: boolean;
	strikethrough?: boolean;
	matches?: readonly IMatch[];
	labelEscapeNewLines?: boolean;
	descriptionMatches?: readonly IMatch[];
	disabledCommand?: boolean;
	readonly separator?: string;
	readonly domId?: string;
	iconPath?: URI | ThemeIcon;
	supportIcons?: boolean;
}

class FastLabelNode {
	private disposed: boolean | undefined;
	private _textContent: string | undefined;
	private _classNames: string[] | undefined;
	private _empty: boolean | undefined;

	constructor(private _element: HTMLElement) {
	}

	get element(): HTMLElement {
		return this._element;
	}

	set textContent(content: string) {
		if (this.disposed || content === this._textContent) {
			return;
		}

		this._textContent = content;
		this._element.textContent = content;
	}

	set classNames(classNames: string[]) {
		if (this.disposed || equals(classNames, this._classNames)) {
			return;
		}

		this._classNames = classNames;
		this._element.classList.value = '';
		this._element.classList.add(...classNames);
	}

	set empty(empty: boolean) {
		if (this.disposed || empty === this._empty) {
			return;
		}

		this._empty = empty;
		this._element.style.marginLeft = empty ? '0' : '';
	}

	dispose(): void {
		this.disposed = true;
	}
}

export class IconLabel extends Disposable {

	private readonly creationOptions?: IIconLabelCreationOptions;

	private readonly domNode: FastLabelNode;
	private readonly nameContainer: HTMLElement;
	private readonly nameNode: Label | LabelWithHighlights;

	private descriptionNode: FastLabelNode | HighlightedLabel | undefined;
	private suffixNode: FastLabelNode | undefined;

	private readonly labelContainer: HTMLElement;

	private readonly hoverDelegate: IHoverDelegate;
	private readonly customHovers: Map<HTMLElement, IDisposable> = new Map();

	constructor(container: HTMLElement, options?: IIconLabelCreationOptions) {
		super();
		this.creationOptions = options;

		this.domNode = this._register(new FastLabelNode(dom.append(container, dom.$('.monaco-icon-label'))));

		this.labelContainer = dom.append(this.domNode.element, dom.$('.monaco-icon-label-container'));

		this.nameContainer = dom.append(this.labelContainer, dom.$('span.monaco-icon-name-container'));

		if (options?.supportHighlights || options?.supportIcons) {
			this.nameNode = this._register(new LabelWithHighlights(this.nameContainer, !!options.supportIcons));
		} else {
			this.nameNode = new Label(this.nameContainer);
		}

		this.hoverDelegate = options?.hoverDelegate ?? getDefaultHoverDelegate('mouse');
	}

	get element(): HTMLElement {
		return this.domNode.element;
	}

	setLabel(label: string | string[], description?: string, options?: IIconLabelValueOptions): void {
		const labelClasses = ['monaco-icon-label'];
		const containerClasses = ['monaco-icon-label-container'];
		let ariaLabel: string = '';
		if (options) {
			if (options.extraClasses) {
				labelClasses.push(...options.extraClasses);
			}

			if (options.bold) {
				labelClasses.push('bold');
			}

			if (options.italic) {
				labelClasses.push('italic');
			}

			if (options.strikethrough) {
				labelClasses.push('strikethrough');
			}

			if (options.disabledCommand) {
				containerClasses.push('disabled');
			}
			if (options.title) {
				if (typeof options.title === 'string') {
					ariaLabel += options.title;
				} else {
					ariaLabel += label;
				}
			}
		}

		// eslint-disable-next-line no-restricted-syntax
		const existingIconNode = this.domNode.element.querySelector('.monaco-icon-label-iconpath');
		if (options?.iconPath) {
			let iconNode;
			if (!existingIconNode || !(dom.isHTMLElement(existingIconNode))) {
				iconNode = dom.$('.monaco-icon-label-iconpath');
				this.domNode.element.prepend(iconNode);
			} else {
				iconNode = existingIconNode;
			}
			if (ThemeIcon.isThemeIcon(options.iconPath)) {
				const iconClass = ThemeIcon.asClassName(options.iconPath);
				iconNode.className = `monaco-icon-label-iconpath ${iconClass}`;
				iconNode.style.backgroundImage = '';
			} else {
				iconNode.style.backgroundImage = css.asCSSUrl(options?.iconPath);
			}
			iconNode.style.backgroundRepeat = 'no-repeat';
			iconNode.style.backgroundPosition = 'center';
			iconNode.style.backgroundSize = 'contain';

		} else if (existingIconNode) {
			existingIconNode.remove();
		}

		this.domNode.classNames = labelClasses;
		this.domNode.element.setAttribute('aria-label', ariaLabel);
		this.labelContainer.classList.value = '';
		this.labelContainer.classList.add(...containerClasses);
		this.setupHover(options?.descriptionTitle ? this.labelContainer : this.element, options?.title);

		this.nameNode.setLabel(label, options);

		if (description || this.descriptionNode) {
			const descriptionNode = this.getOrCreateDescriptionNode();
			if (descriptionNode instanceof HighlightedLabel) {
				const supportIcons = options?.supportIcons ?? this.creationOptions?.supportIcons;
				descriptionNode.set(description || '', options ? options.descriptionMatches : undefined, undefined, options?.labelEscapeNewLines, supportIcons);
				this.setupHover(descriptionNode.element, options?.descriptionTitle);
			} else {
				descriptionNode.textContent = description && options?.labelEscapeNewLines ? HighlightedLabel.escapeNewLines(description, []) : (description || '');
				this.setupHover(descriptionNode.element, options?.descriptionTitle || '');
				descriptionNode.empty = !description;
			}
		}

		if (options?.suffix || this.suffixNode) {
			const suffixNode = this.getOrCreateSuffixNode();
			suffixNode.textContent = options?.suffix ?? '';
		}
	}

	private setupHover(htmlElement: HTMLElement, tooltip: string | IManagedHoverTooltipMarkdownString | undefined): void {
		const previousCustomHover = this.customHovers.get(htmlElement);
		if (previousCustomHover) {
			previousCustomHover.dispose();
			this.customHovers.delete(htmlElement);
		}

		if (!tooltip) {
			htmlElement.removeAttribute('title');
			return;
		}

		let hoverTarget = htmlElement;
		if (this.creationOptions?.hoverTargetOverride) {
			if (!dom.isAncestor(htmlElement, this.creationOptions.hoverTargetOverride)) {
				throw new Error('hoverTargetOverrride must be an ancestor of the htmlElement');
			}
			hoverTarget = this.creationOptions.hoverTargetOverride;
		}

		const hoverDisposable = getBaseLayerHoverDelegate().setupManagedHover(this.hoverDelegate, hoverTarget, tooltip);
		if (hoverDisposable) {
			this.customHovers.set(htmlElement, hoverDisposable);
		}
	}

	public override dispose() {
		super.dispose();
		for (const disposable of this.customHovers.values()) {
			disposable.dispose();
		}
		this.customHovers.clear();
	}

	private getOrCreateSuffixNode() {
		if (!this.suffixNode) {
			const suffixContainer = this._register(new FastLabelNode(dom.after(this.nameContainer, dom.$('span.monaco-icon-suffix-container'))));
			this.suffixNode = this._register(new FastLabelNode(dom.append(suffixContainer.element, dom.$('span.label-suffix'))));
		}

		return this.suffixNode;
	}

	private getOrCreateDescriptionNode() {
		if (!this.descriptionNode) {
			const descriptionContainer = this._register(new FastLabelNode(dom.append(this.labelContainer, dom.$('span.monaco-icon-description-container'))));
			if (this.creationOptions?.supportDescriptionHighlights) {
				this.descriptionNode = this._register(new HighlightedLabel(dom.append(descriptionContainer.element, dom.$('span.label-description'))));
			} else {
				this.descriptionNode = this._register(new FastLabelNode(dom.append(descriptionContainer.element, dom.$('span.label-description'))));
			}
		}

		return this.descriptionNode;
	}
}

class Label {

	private label: string | string[] | undefined = undefined;
	private singleLabel: HTMLElement | undefined = undefined;
	private options: IIconLabelValueOptions | undefined;

	constructor(private container: HTMLElement) { }

	setLabel(label: string | string[], options?: IIconLabelValueOptions): void {
		if (this.label === label && equals(this.options, options)) {
			return;
		}

		this.label = label;
		this.options = options;

		if (typeof label === 'string') {
			if (!this.singleLabel) {
				this.container.textContent = '';
				this.container.classList.remove('multiple');
				this.singleLabel = dom.append(this.container, dom.$('a.label-name', { id: options?.domId }));
			}

			this.singleLabel.textContent = label;
		} else {
			this.container.textContent = '';
			this.container.classList.add('multiple');
			this.singleLabel = undefined;

			for (let i = 0; i < label.length; i++) {
				const l = label[i];
				const id = options?.domId && `${options?.domId}_${i}`;

				dom.append(this.container, dom.$('a.label-name', { id, 'data-icon-label-count': label.length, 'data-icon-label-index': i, 'role': 'treeitem' }, l));

				if (i < label.length - 1) {
					dom.append(this.container, dom.$('span.label-separator', undefined, options?.separator || '/'));
				}
			}
		}
	}
}

function splitMatches(labels: string[], separator: string, matches: readonly IMatch[] | undefined): IMatch[][] | undefined {
	if (!matches) {
		return undefined;
	}

	let labelStart = 0;

	return labels.map(label => {
		const labelRange = { start: labelStart, end: labelStart + label.length };

		const result = matches
			.map(match => Range.intersect(labelRange, match))
			.filter(range => !Range.isEmpty(range))
			.map(({ start, end }) => ({ start: start - labelStart, end: end - labelStart }));

		labelStart = labelRange.end + separator.length;
		return result;
	});
}

class LabelWithHighlights extends Disposable {

	private label: string | string[] | undefined = undefined;
	private singleLabel: HighlightedLabel | undefined = undefined;
	private options: IIconLabelValueOptions | undefined;

	constructor(private container: HTMLElement, private supportIcons: boolean) {
		super();
	}

	setLabel(label: string | string[], options?: IIconLabelValueOptions): void {
		if (this.label === label && equals(this.options, options)) {
			return;
		}

		this.label = label;
		this.options = options;

		// Determine supportIcons: use option if provided, otherwise use constructor value
		const supportIcons = options?.supportIcons ?? this.supportIcons;

		if (typeof label === 'string') {
			if (!this.singleLabel) {
				this.container.textContent = '';
				this.container.classList.remove('multiple');
				this.singleLabel = this._register(new HighlightedLabel(dom.append(this.container, dom.$('a.label-name', { id: options?.domId }))));
			}

			this.singleLabel.set(label, options?.matches, undefined, options?.labelEscapeNewLines, supportIcons);
		} else {
			this.container.textContent = '';
			this.container.classList.add('multiple');
			this.singleLabel = undefined;

			const separator = options?.separator || '/';
			const matches = splitMatches(label, separator, options?.matches);

			for (let i = 0; i < label.length; i++) {
				const l = label[i];
				const m = matches ? matches[i] : undefined;
				const id = options?.domId && `${options?.domId}_${i}`;

				const name = dom.$('a.label-name', { id, 'data-icon-label-count': label.length, 'data-icon-label-index': i, 'role': 'treeitem' });
				const highlightedLabel = this._register(new HighlightedLabel(dom.append(this.container, name)));
				highlightedLabel.set(l, m, undefined, options?.labelEscapeNewLines, supportIcons);

				if (i < label.length - 1) {
					dom.append(name, dom.$('span.label-separator', undefined, separator));
				}
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/iconLabel/iconLabels.ts]---
Location: vscode-main/src/vs/base/browser/ui/iconLabel/iconLabels.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../dom.js';
import { ThemeIcon } from '../../../common/themables.js';

const labelWithIconsRegex = new RegExp(`(\\\\)?\\$\\((${ThemeIcon.iconNameExpression}(?:${ThemeIcon.iconModifierExpression})?)\\)`, 'g');
export function renderLabelWithIcons(text: string): Array<HTMLSpanElement | string> {
	const elements = new Array<HTMLSpanElement | string>();
	let match: RegExpExecArray | null;

	let textStart = 0, textStop = 0;
	while ((match = labelWithIconsRegex.exec(text)) !== null) {
		textStop = match.index || 0;
		if (textStart < textStop) {
			elements.push(text.substring(textStart, textStop));
		}
		textStart = (match.index || 0) + match[0].length;

		const [, escaped, codicon] = match;
		elements.push(escaped ? `$(${codicon})` : renderIcon({ id: codicon }));
	}

	if (textStart < text.length) {
		elements.push(text.substring(textStart));
	}
	return elements;
}

export function renderIcon(icon: ThemeIcon): HTMLSpanElement {
	const node = dom.$(`span`);
	node.classList.add(...ThemeIcon.asClassNameArray(icon));
	return node;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/iconLabel/simpleIconLabel.ts]---
Location: vscode-main/src/vs/base/browser/ui/iconLabel/simpleIconLabel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { reset } from '../../dom.js';
import type { IManagedHover } from '../hover/hover.js';
import { getBaseLayerHoverDelegate } from '../hover/hoverDelegate2.js';
import { getDefaultHoverDelegate } from '../hover/hoverDelegateFactory.js';
import { renderLabelWithIcons } from './iconLabels.js';
import { IDisposable } from '../../../common/lifecycle.js';

export class SimpleIconLabel implements IDisposable {

	private hover?: IManagedHover;

	constructor(
		private readonly _container: HTMLElement
	) { }

	set text(text: string) {
		reset(this._container, ...renderLabelWithIcons(text ?? ''));
	}

	set title(title: string) {
		if (!this.hover && title) {
			this.hover = getBaseLayerHoverDelegate().setupManagedHover(getDefaultHoverDelegate('mouse'), this._container, title);
		} else if (this.hover) {
			this.hover.update(title);
		}
	}

	dispose(): void {
		this.hover?.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/icons/iconSelectBox.css]---
Location: vscode-main/src/vs/base/browser/ui/icons/iconSelectBox.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.icon-select-box > .icon-select-box-container {
	height: 100%;
}

.icon-select-box .icon-select-icons-container {
	height: 100%;
	outline: 0 !important;
}

.icon-select-box .icon-select-icons-container > .icon-container {
	display: inline-flex;
	cursor: pointer;
	font-size: 20px;
	align-items: center;
	justify-content: center;
	border-radius: 5px;
}

.icon-select-box .icon-select-icons-container > .icon-container.focused {
	background-color: var(--vscode-quickInputList-focusBackground);
	color: var(--vscode-quickInputList-focusForeground);
}

.icon-select-box .icon-select-icons-container > .icon-container:hover:not(.focused) {
	background-color: var(--vscode-toolbar-hoverBackground);
	color: var(--vscode-list-hoverForeground)
}

.icon-select-box .icon-select-id-container .icon-select-id-label {
	height: 24px;
	padding: 10px;
	opacity: .8;
}

.icon-select-box .icon-select-id-container .icon-select-id-label .highlight {
	color: var(--vscode-list-highlightForeground);
	font-weight: bold;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/icons/iconSelectBox.ts]---
Location: vscode-main/src/vs/base/browser/ui/icons/iconSelectBox.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './iconSelectBox.css';
import * as dom from '../../dom.js';
import { alert } from '../aria/aria.js';
import { IInputBoxStyles, InputBox } from '../inputbox/inputBox.js';
import { DomScrollableElement } from '../scrollbar/scrollableElement.js';
import { Emitter } from '../../../common/event.js';
import { IDisposable, DisposableStore, Disposable, MutableDisposable } from '../../../common/lifecycle.js';
import { ThemeIcon } from '../../../common/themables.js';
import { localize } from '../../../../nls.js';
import { IMatch } from '../../../common/filters.js';
import { ScrollbarVisibility } from '../../../common/scrollable.js';
import { HighlightedLabel } from '../highlightedlabel/highlightedLabel.js';

export interface IIconSelectBoxOptions {
	readonly icons: ThemeIcon[];
	readonly inputBoxStyles: IInputBoxStyles;
	readonly showIconInfo?: boolean;
}

interface IRenderedIconItem {
	readonly icon: ThemeIcon;
	readonly element: HTMLElement;
	readonly highlightMatches?: IMatch[];
}

export class IconSelectBox extends Disposable {

	private static InstanceCount = 0;
	readonly domId = `icon_select_box_id_${++IconSelectBox.InstanceCount}`;

	readonly domNode: HTMLElement;

	private _onDidSelect = this._register(new Emitter<ThemeIcon>());
	readonly onDidSelect = this._onDidSelect.event;

	private renderedIcons: IRenderedIconItem[] = [];

	private focusedItemIndex: number = 0;
	private numberOfElementsPerRow: number = 1;

	protected inputBox: InputBox | undefined;
	private scrollableElement: DomScrollableElement | undefined;
	private iconsContainer: HTMLElement | undefined;
	private iconIdElement: HighlightedLabel | undefined;
	private readonly iconContainerWidth = 36;
	private readonly iconContainerHeight = 36;

	constructor(
		private readonly options: IIconSelectBoxOptions,
	) {
		super();
		this.domNode = dom.$('.icon-select-box');
		this._register(this.create());
	}

	private create(): IDisposable {
		const disposables = new DisposableStore();

		const iconSelectBoxContainer = dom.append(this.domNode, dom.$('.icon-select-box-container'));
		iconSelectBoxContainer.style.margin = '10px 15px';

		const iconSelectInputContainer = dom.append(iconSelectBoxContainer, dom.$('.icon-select-input-container'));
		iconSelectInputContainer.style.paddingBottom = '10px';
		this.inputBox = disposables.add(new InputBox(iconSelectInputContainer, undefined, {
			placeholder: localize('iconSelect.placeholder', "Search icons"),
			inputBoxStyles: this.options.inputBoxStyles,
		}));

		const iconsContainer = this.iconsContainer = dom.$('.icon-select-icons-container', { id: `${this.domId}_icons` });
		iconsContainer.role = 'listbox';
		iconsContainer.tabIndex = 0;
		this.scrollableElement = disposables.add(new DomScrollableElement(iconsContainer, {
			useShadows: false,
			horizontal: ScrollbarVisibility.Hidden,
		}));
		dom.append(iconSelectBoxContainer, this.scrollableElement.getDomNode());

		if (this.options.showIconInfo) {
			this.iconIdElement = this._register(new HighlightedLabel(dom.append(dom.append(iconSelectBoxContainer, dom.$('.icon-select-id-container')), dom.$('.icon-select-id-label'))));
		}

		const iconsDisposables = disposables.add(new MutableDisposable());
		iconsDisposables.value = this.renderIcons(this.options.icons, [], iconsContainer);
		this.scrollableElement.scanDomNode();

		disposables.add(this.inputBox.onDidChange(value => {
			const icons = [], matches = [];
			for (const icon of this.options.icons) {
				const match = this.matchesContiguous(value, icon.id);
				if (match) {
					icons.push(icon);
					matches.push(match);
				}
			}
			if (icons.length) {
				iconsDisposables.value = this.renderIcons(icons, matches, iconsContainer);
				this.scrollableElement?.scanDomNode();
			}
		}));

		this.inputBox.inputElement.role = 'combobox';
		this.inputBox.inputElement.ariaHasPopup = 'menu';
		this.inputBox.inputElement.ariaAutoComplete = 'list';
		this.inputBox.inputElement.ariaExpanded = 'true';
		this.inputBox.inputElement.setAttribute('aria-controls', iconsContainer.id);

		return disposables;
	}

	private renderIcons(icons: ThemeIcon[], matches: IMatch[][], container: HTMLElement): IDisposable {
		const disposables = new DisposableStore();
		dom.clearNode(container);
		const focusedIcon = this.renderedIcons[this.focusedItemIndex]?.icon;
		let focusedIconIndex = 0;
		const renderedIcons: IRenderedIconItem[] = [];
		if (icons.length) {
			for (let index = 0; index < icons.length; index++) {
				const icon = icons[index];
				const iconContainer = dom.append(container, dom.$('.icon-container', { id: `${this.domId}_icons_${index}` }));
				iconContainer.style.width = `${this.iconContainerWidth}px`;
				iconContainer.style.height = `${this.iconContainerHeight}px`;
				iconContainer.title = icon.id;
				iconContainer.role = 'button';
				iconContainer.setAttribute('aria-setsize', `${icons.length}`);
				iconContainer.setAttribute('aria-posinset', `${index + 1}`);
				dom.append(iconContainer, dom.$(ThemeIcon.asCSSSelector(icon)));
				renderedIcons.push({ icon, element: iconContainer, highlightMatches: matches[index] });

				disposables.add(dom.addDisposableListener(iconContainer, dom.EventType.CLICK, (e: MouseEvent) => {
					e.stopPropagation();
					this.setSelection(index);
				}));

				if (icon === focusedIcon) {
					focusedIconIndex = index;
				}
			}
		} else {
			const noResults = localize('iconSelect.noResults', "No results");
			dom.append(container, dom.$('.icon-no-results', undefined, noResults));
			alert(noResults);
		}

		this.renderedIcons.splice(0, this.renderedIcons.length, ...renderedIcons);
		this.focusIcon(focusedIconIndex);

		return disposables;
	}

	private focusIcon(index: number): void {
		const existing = this.renderedIcons[this.focusedItemIndex];
		if (existing) {
			existing.element.classList.remove('focused');
		}

		this.focusedItemIndex = index;
		const renderedItem = this.renderedIcons[index];

		if (renderedItem) {
			renderedItem.element.classList.add('focused');
		}

		if (this.inputBox) {
			if (renderedItem) {
				this.inputBox.inputElement.setAttribute('aria-activedescendant', renderedItem.element.id);
			} else {
				this.inputBox.inputElement.removeAttribute('aria-activedescendant');
			}
		}

		if (this.iconIdElement) {
			if (renderedItem) {
				this.iconIdElement.set(renderedItem.icon.id, renderedItem.highlightMatches);
			} else {
				this.iconIdElement.set('');
			}
		}

		this.reveal(index);
	}

	private reveal(index: number): void {
		if (!this.scrollableElement) {
			return;
		}
		if (index < 0 || index >= this.renderedIcons.length) {
			return;
		}
		const element = this.renderedIcons[index].element;
		if (!element) {
			return;
		}
		const { height } = this.scrollableElement.getScrollDimensions();
		const { scrollTop } = this.scrollableElement.getScrollPosition();
		if (element.offsetTop + this.iconContainerHeight > scrollTop + height) {
			this.scrollableElement.setScrollPosition({ scrollTop: element.offsetTop + this.iconContainerHeight - height });
		} else if (element.offsetTop < scrollTop) {
			this.scrollableElement.setScrollPosition({ scrollTop: element.offsetTop });
		}
	}

	private matchesContiguous(word: string, wordToMatchAgainst: string): IMatch[] | null {
		const matchIndex = wordToMatchAgainst.toLowerCase().indexOf(word.toLowerCase());
		if (matchIndex !== -1) {
			return [{ start: matchIndex, end: matchIndex + word.length }];
		}
		return null;
	}

	layout(dimension: dom.Dimension): void {
		this.domNode.style.width = `${dimension.width}px`;
		this.domNode.style.height = `${dimension.height}px`;

		const iconsContainerWidth = dimension.width - 30;
		this.numberOfElementsPerRow = Math.floor(iconsContainerWidth / this.iconContainerWidth);
		if (this.numberOfElementsPerRow === 0) {
			throw new Error('Insufficient width');
		}

		const extraSpace = iconsContainerWidth % this.iconContainerWidth;
		const iconElementMargin = Math.floor(extraSpace / this.numberOfElementsPerRow);
		for (const { element } of this.renderedIcons) {
			element.style.marginRight = `${iconElementMargin}px`;
		}

		const containerPadding = extraSpace % this.numberOfElementsPerRow;
		if (this.iconsContainer) {
			this.iconsContainer.style.paddingLeft = `${Math.floor(containerPadding / 2)}px`;
			this.iconsContainer.style.paddingRight = `${Math.ceil(containerPadding / 2)}px`;
		}

		if (this.scrollableElement) {
			this.scrollableElement.getDomNode().style.height = `${this.iconIdElement ? dimension.height - 80 : dimension.height - 40}px`;
			this.scrollableElement.scanDomNode();
		}
	}

	getFocus(): number[] {
		return [this.focusedItemIndex];
	}

	setSelection(index: number): void {
		if (index < 0 || index >= this.renderedIcons.length) {
			throw new Error(`Invalid index ${index}`);
		}
		this.focusIcon(index);
		this._onDidSelect.fire(this.renderedIcons[index].icon);
	}

	clearInput(): void {
		if (this.inputBox) {
			this.inputBox.value = '';
		}
	}

	focus(): void {
		this.inputBox?.focus();
		this.focusIcon(0);
	}

	focusNext(): void {
		this.focusIcon((this.focusedItemIndex + 1) % this.renderedIcons.length);
	}

	focusPrevious(): void {
		this.focusIcon((this.focusedItemIndex - 1 + this.renderedIcons.length) % this.renderedIcons.length);
	}

	focusNextRow(): void {
		let nextRowIndex = this.focusedItemIndex + this.numberOfElementsPerRow;
		if (nextRowIndex >= this.renderedIcons.length) {
			nextRowIndex = (nextRowIndex + 1) % this.numberOfElementsPerRow;
			nextRowIndex = nextRowIndex >= this.renderedIcons.length ? 0 : nextRowIndex;
		}
		this.focusIcon(nextRowIndex);
	}

	focusPreviousRow(): void {
		let previousRowIndex = this.focusedItemIndex - this.numberOfElementsPerRow;
		if (previousRowIndex < 0) {
			const numberOfRows = Math.floor(this.renderedIcons.length / this.numberOfElementsPerRow);
			previousRowIndex = this.focusedItemIndex + (this.numberOfElementsPerRow * numberOfRows) - 1;
			previousRowIndex = previousRowIndex < 0
				? this.renderedIcons.length - 1
				: previousRowIndex >= this.renderedIcons.length
					? previousRowIndex - this.numberOfElementsPerRow
					: previousRowIndex;
		}
		this.focusIcon(previousRowIndex);
	}

	getFocusedIcon(): ThemeIcon {
		return this.renderedIcons[this.focusedItemIndex].icon;
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/inputbox/inputBox.css]---
Location: vscode-main/src/vs/base/browser/ui/inputbox/inputBox.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-inputbox {
	position: relative;
	display: block;
	padding: 0;
	box-sizing:	border-box;
	border-radius: 2px;

	/* Customizable */
	font-size: inherit;
}

.monaco-inputbox > .ibwrapper > .input,
.monaco-inputbox > .ibwrapper > .mirror {

	/* Customizable */
	padding: 4px 6px;
}

.monaco-inputbox > .ibwrapper {
	position: relative;
	width: 100%;
}

.monaco-inputbox > .ibwrapper > .input {
	display: inline-block;
	box-sizing:	border-box;
	width: 100%;
	height: 100%;
	line-height: inherit;
	border: none;
	font-family: inherit;
	font-size: inherit;
	resize: none;
	color: inherit;
}

.monaco-inputbox > .ibwrapper > input {
	text-overflow: ellipsis;
}

.monaco-inputbox > .ibwrapper > textarea.input {
	display: block;
	scrollbar-width: none; /* Firefox: hide scrollbars */
	outline: none;
}

.monaco-inputbox > .ibwrapper > textarea.input::-webkit-scrollbar {
	display: none; /* Chrome + Safari: hide scrollbar */
}

.monaco-inputbox > .ibwrapper > textarea.input.empty {
	white-space: nowrap;
}

.monaco-inputbox > .ibwrapper > .mirror {
	position: absolute;
	display: inline-block;
	width: 100%;
	top: 0;
	left: 0;
	box-sizing: border-box;
	white-space: pre-wrap;
	visibility: hidden;
	word-wrap: break-word;
}

/* Context view */

.monaco-inputbox-container {
	text-align: right;
}

.monaco-inputbox-container .monaco-inputbox-message {
	display: inline-block;
	overflow: hidden;
	text-align: left;
	width: 100%;
	box-sizing:	border-box;
	padding: 0.4em;
	font-size: 12px;
	line-height: 17px;
	margin-top: -1px;
	word-wrap: break-word;
}

/* Action bar support */
.monaco-inputbox .monaco-action-bar {
	position: absolute;
	right: 2px;
	top: 4px;
}

.monaco-inputbox .monaco-action-bar .action-item {
	margin-left: 2px;
}

.monaco-inputbox .monaco-action-bar .action-item .codicon {
	background-repeat: no-repeat;
	width: 16px;
	height: 16px;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/inputbox/inputBox.ts]---
Location: vscode-main/src/vs/base/browser/ui/inputbox/inputBox.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../dom.js';
import * as cssJs from '../../cssValue.js';
import { DomEmitter } from '../../event.js';
import { renderFormattedText, renderText } from '../../formattedTextRenderer.js';
import { IHistoryNavigationWidget } from '../../history.js';
import { ActionBar, IActionViewItemProvider } from '../actionbar/actionbar.js';
import * as aria from '../aria/aria.js';
import { AnchorAlignment, IContextViewProvider } from '../contextview/contextview.js';
import { getBaseLayerHoverDelegate } from '../hover/hoverDelegate2.js';
import { ScrollableElement } from '../scrollbar/scrollableElement.js';
import { Widget } from '../widget.js';
import { IAction } from '../../../common/actions.js';
import { Emitter, Event } from '../../../common/event.js';
import { HistoryNavigator, IHistory } from '../../../common/history.js';
import { equals } from '../../../common/objects.js';
import { ScrollbarVisibility } from '../../../common/scrollable.js';
import './inputBox.css';
import * as nls from '../../../../nls.js';
import { MutableDisposable, type IDisposable } from '../../../common/lifecycle.js';


const $ = dom.$;

export interface IInputOptions {
	readonly placeholder?: string;
	readonly showPlaceholderOnFocus?: boolean;
	readonly tooltip?: string;
	readonly ariaLabel?: string;
	readonly type?: string;
	readonly validationOptions?: IInputValidationOptions;
	readonly flexibleHeight?: boolean;
	readonly flexibleWidth?: boolean;
	readonly flexibleMaxHeight?: number;
	readonly actions?: ReadonlyArray<IAction>;
	readonly actionViewItemProvider?: IActionViewItemProvider;
	readonly inputBoxStyles: IInputBoxStyles;
	readonly history?: IHistory<string>;
}

export interface IInputBoxStyles {
	readonly inputBackground: string | undefined;
	readonly inputForeground: string | undefined;
	readonly inputBorder: string | undefined;
	readonly inputValidationInfoBorder: string | undefined;
	readonly inputValidationInfoBackground: string | undefined;
	readonly inputValidationInfoForeground: string | undefined;
	readonly inputValidationWarningBorder: string | undefined;
	readonly inputValidationWarningBackground: string | undefined;
	readonly inputValidationWarningForeground: string | undefined;
	readonly inputValidationErrorBorder: string | undefined;
	readonly inputValidationErrorBackground: string | undefined;
	readonly inputValidationErrorForeground: string | undefined;
}

export interface IInputValidator {
	(value: string): IMessage | null;
}

export interface IMessage {
	readonly content?: string;
	readonly formatContent?: boolean; // defaults to false
	readonly type?: MessageType;
}

export interface IInputValidationOptions {
	validation?: IInputValidator;
}

export const enum MessageType {
	INFO = 1,
	WARNING = 2,
	ERROR = 3
}

export interface IRange {
	start: number;
	end: number;
}

export const unthemedInboxStyles: IInputBoxStyles = {
	inputBackground: '#3C3C3C',
	inputForeground: '#CCCCCC',
	inputValidationInfoBorder: '#55AAFF',
	inputValidationInfoBackground: '#063B49',
	inputValidationWarningBorder: '#B89500',
	inputValidationWarningBackground: '#352A05',
	inputValidationErrorBorder: '#BE1100',
	inputValidationErrorBackground: '#5A1D1D',
	inputBorder: undefined,
	inputValidationErrorForeground: undefined,
	inputValidationInfoForeground: undefined,
	inputValidationWarningForeground: undefined
};

export class InputBox extends Widget {
	private contextViewProvider?: IContextViewProvider;
	element: HTMLElement;
	protected input: HTMLInputElement;
	private actionbar?: ActionBar;
	private readonly options: IInputOptions;
	private message: IMessage | null;
	protected placeholder: string;
	private tooltip: string;
	private ariaLabel: string;
	private validation?: IInputValidator;
	private state: 'idle' | 'open' | 'closed' = 'idle';

	private mirror: HTMLElement | undefined;
	private cachedHeight: number | undefined;
	private cachedContentHeight: number | undefined;
	private maxHeight: number = Number.POSITIVE_INFINITY;
	private scrollableElement: ScrollableElement | undefined;
	private readonly hover: MutableDisposable<IDisposable> = this._register(new MutableDisposable());

	private _onDidChange = this._register(new Emitter<string>());
	public get onDidChange(): Event<string> { return this._onDidChange.event; }

	private _onDidHeightChange = this._register(new Emitter<number>());
	public get onDidHeightChange(): Event<number> { return this._onDidHeightChange.event; }

	constructor(container: HTMLElement, contextViewProvider: IContextViewProvider | undefined, options: IInputOptions) {
		super();

		this.contextViewProvider = contextViewProvider;
		this.options = options;

		this.message = null;
		this.placeholder = this.options.placeholder || '';
		this.tooltip = this.options.tooltip ?? (this.placeholder || '');
		this.ariaLabel = this.options.ariaLabel || '';

		if (this.options.validationOptions) {
			this.validation = this.options.validationOptions.validation;
		}

		this.element = dom.append(container, $('.monaco-inputbox.idle'));

		const tagName = this.options.flexibleHeight ? 'textarea' : 'input';

		const wrapper = dom.append(this.element, $('.ibwrapper'));
		this.input = dom.append(wrapper, $(tagName + '.input.empty'));
		this.input.setAttribute('autocorrect', 'off');
		this.input.setAttribute('autocapitalize', 'off');
		this.input.setAttribute('spellcheck', 'false');

		this.onfocus(this.input, () => this.element.classList.add('synthetic-focus'));
		this.onblur(this.input, () => this.element.classList.remove('synthetic-focus'));

		if (this.options.flexibleHeight) {
			this.maxHeight = typeof this.options.flexibleMaxHeight === 'number' ? this.options.flexibleMaxHeight : Number.POSITIVE_INFINITY;

			this.mirror = dom.append(wrapper, $('div.mirror'));
			this.mirror.innerText = '\u00a0';

			this.scrollableElement = new ScrollableElement(this.element, { vertical: ScrollbarVisibility.Auto });

			if (this.options.flexibleWidth) {
				this.input.setAttribute('wrap', 'off');
				this.mirror.style.whiteSpace = 'pre';
				this.mirror.style.wordWrap = 'initial';
			}

			dom.append(container, this.scrollableElement.getDomNode());
			this._register(this.scrollableElement);

			// from ScrollableElement to DOM
			this._register(this.scrollableElement.onScroll(e => this.input.scrollTop = e.scrollTop));

			const onSelectionChange = this._register(new DomEmitter(container.ownerDocument, 'selectionchange'));
			const onAnchoredSelectionChange = Event.filter(onSelectionChange.event, () => {
				const selection = container.ownerDocument.getSelection();
				return selection?.anchorNode === wrapper;
			});

			// from DOM to ScrollableElement
			this._register(onAnchoredSelectionChange(this.updateScrollDimensions, this));
			this._register(this.onDidHeightChange(this.updateScrollDimensions, this));
		} else {
			this.input.type = this.options.type || 'text';
			this.input.setAttribute('wrap', 'off');
		}

		if (this.ariaLabel) {
			this.input.setAttribute('aria-label', this.ariaLabel);
		}

		if (this.placeholder && !this.options.showPlaceholderOnFocus) {
			this.setPlaceHolder(this.placeholder);
		}

		if (this.tooltip) {
			this.setTooltip(this.tooltip);
		}

		this.oninput(this.input, () => this.onValueChange());
		this.onblur(this.input, () => this.onBlur());
		this.onfocus(this.input, () => this.onFocus());

		this._register(this.ignoreGesture(this.input));

		setTimeout(() => this.updateMirror(), 0);

		// Support actions
		if (this.options.actions) {
			this.actionbar = this._register(new ActionBar(this.element, {
				actionViewItemProvider: this.options.actionViewItemProvider
			}));
			this.actionbar.push(this.options.actions, { icon: true, label: false });
		}

		this.applyStyles();
	}

	public setActions(actions: ReadonlyArray<IAction> | undefined, actionViewItemProvider?: IActionViewItemProvider): void {
		if (this.actionbar) {
			this.actionbar.clear();
			if (actions) {
				this.actionbar.push(actions, { icon: true, label: false });
			}
		} else if (actions) {
			this.actionbar = this._register(new ActionBar(this.element, {
				actionViewItemProvider: actionViewItemProvider ?? this.options.actionViewItemProvider
			}));
			this.actionbar.push(actions, { icon: true, label: false });
		}
	}

	protected onBlur(): void {
		this._hideMessage();
		if (this.options.showPlaceholderOnFocus) {
			this.input.setAttribute('placeholder', '');
		}
	}

	protected onFocus(): void {
		this._showMessage();
		if (this.options.showPlaceholderOnFocus) {
			this.input.setAttribute('placeholder', this.placeholder || '');
		}
	}

	public setPlaceHolder(placeHolder: string): void {
		this.placeholder = placeHolder;
		this.input.setAttribute('placeholder', placeHolder);
	}

	public setTooltip(tooltip: string): void {
		this.tooltip = tooltip;
		if (!this.hover.value) {
			this.hover.value = this._register(getBaseLayerHoverDelegate().setupDelayedHoverAtMouse(this.input, () => ({
				content: this.tooltip,
				appearance: {
					compact: true,
				}
			})));
		}
	}

	public setAriaLabel(label: string): void {
		this.ariaLabel = label;

		if (label) {
			this.input.setAttribute('aria-label', this.ariaLabel);
		} else {
			this.input.removeAttribute('aria-label');
		}
	}

	public getAriaLabel(): string {
		return this.ariaLabel;
	}

	public get mirrorElement(): HTMLElement | undefined {
		return this.mirror;
	}

	public get inputElement(): HTMLInputElement {
		return this.input;
	}

	public get value(): string {
		return this.input.value;
	}

	public set value(newValue: string) {
		if (this.input.value !== newValue) {
			this.input.value = newValue;
			this.onValueChange();
		}
	}

	public get step(): string {
		return this.input.step;
	}

	public set step(newValue: string) {
		this.input.step = newValue;
	}

	public get height(): number {
		return typeof this.cachedHeight === 'number' ? this.cachedHeight : dom.getTotalHeight(this.element);
	}

	public focus(): void {
		this.input.focus();
	}

	public blur(): void {
		this.input.blur();
	}

	public hasFocus(): boolean {
		return dom.isActiveElement(this.input);
	}

	public select(range: IRange | null = null): void {
		this.input.select();

		if (range) {
			this.input.setSelectionRange(range.start, range.end);
			if (range.end === this.input.value.length) {
				this.input.scrollLeft = this.input.scrollWidth;
			}
		}
	}

	public isSelectionAtEnd(): boolean {
		return this.input.selectionEnd === this.input.value.length && this.input.selectionStart === this.input.selectionEnd;
	}

	public getSelection(): IRange | null {
		const selectionStart = this.input.selectionStart;
		if (selectionStart === null) {
			return null;
		}
		const selectionEnd = this.input.selectionEnd ?? selectionStart;
		return {
			start: selectionStart,
			end: selectionEnd,
		};
	}

	public enable(): void {
		this.input.removeAttribute('disabled');
	}

	public disable(): void {
		this.blur();
		this.input.disabled = true;
		this._hideMessage();
	}

	public setEnabled(enabled: boolean): void {
		if (enabled) {
			this.enable();
		} else {
			this.disable();
		}
	}

	public get width(): number {
		return dom.getTotalWidth(this.input);
	}

	public set width(width: number) {
		if (this.options.flexibleHeight && this.options.flexibleWidth) {
			// textarea with horizontal scrolling
			let horizontalPadding = 0;
			if (this.mirror) {
				const paddingLeft = parseFloat(this.mirror.style.paddingLeft || '') || 0;
				const paddingRight = parseFloat(this.mirror.style.paddingRight || '') || 0;
				horizontalPadding = paddingLeft + paddingRight;
			}
			this.input.style.width = (width - horizontalPadding) + 'px';
		} else {
			this.input.style.width = width + 'px';
		}

		if (this.mirror) {
			this.mirror.style.width = width + 'px';
		}
	}

	public set paddingRight(paddingRight: number) {
		// Set width to avoid hint text overlapping buttons
		this.input.style.width = `calc(100% - ${paddingRight}px)`;

		if (this.mirror) {
			this.mirror.style.paddingRight = paddingRight + 'px';
		}
	}

	private updateScrollDimensions(): void {
		if (typeof this.cachedContentHeight !== 'number' || typeof this.cachedHeight !== 'number' || !this.scrollableElement) {
			return;
		}

		const scrollHeight = this.cachedContentHeight;
		const height = this.cachedHeight;
		const scrollTop = this.input.scrollTop;

		this.scrollableElement.setScrollDimensions({ scrollHeight, height });
		this.scrollableElement.setScrollPosition({ scrollTop });
	}

	public showMessage(message: IMessage, force?: boolean): void {
		if (this.state === 'open' && equals(this.message, message)) {
			// Already showing
			return;
		}

		this.message = message;

		this.element.classList.remove('idle');
		this.element.classList.remove('info');
		this.element.classList.remove('warning');
		this.element.classList.remove('error');
		this.element.classList.add(this.classForType(message.type));

		const styles = this.stylesForType(this.message.type);
		this.element.style.border = `1px solid ${cssJs.asCssValueWithDefault(styles.border, 'transparent')}`;

		if (this.message.content && (this.hasFocus() || force)) {
			this._showMessage();
		}
	}

	public hideMessage(): void {
		this.message = null;

		this.element.classList.remove('info');
		this.element.classList.remove('warning');
		this.element.classList.remove('error');
		this.element.classList.add('idle');

		this._hideMessage();
		this.applyStyles();
	}

	public isInputValid(): boolean {
		return !!this.validation && !this.validation(this.value);
	}

	public validate(): MessageType | undefined {
		let errorMsg: IMessage | null = null;

		if (this.validation) {
			errorMsg = this.validation(this.value);

			if (errorMsg) {
				this.inputElement.setAttribute('aria-invalid', 'true');
				this.showMessage(errorMsg);
			}
			else if (this.inputElement.hasAttribute('aria-invalid')) {
				this.inputElement.removeAttribute('aria-invalid');
				this.hideMessage();
			}
		}

		return errorMsg?.type;
	}

	public stylesForType(type: MessageType | undefined): { border: string | undefined; background: string | undefined; foreground: string | undefined } {
		const styles = this.options.inputBoxStyles;
		switch (type) {
			case MessageType.INFO: return { border: styles.inputValidationInfoBorder, background: styles.inputValidationInfoBackground, foreground: styles.inputValidationInfoForeground };
			case MessageType.WARNING: return { border: styles.inputValidationWarningBorder, background: styles.inputValidationWarningBackground, foreground: styles.inputValidationWarningForeground };
			default: return { border: styles.inputValidationErrorBorder, background: styles.inputValidationErrorBackground, foreground: styles.inputValidationErrorForeground };
		}
	}

	private classForType(type: MessageType | undefined): string {
		switch (type) {
			case MessageType.INFO: return 'info';
			case MessageType.WARNING: return 'warning';
			default: return 'error';
		}
	}

	private _showMessage(): void {
		if (!this.contextViewProvider || !this.message) {
			return;
		}

		let div: HTMLElement;
		const layout = () => div.style.width = dom.getTotalWidth(this.element) + 'px';

		this.contextViewProvider.showContextView({
			getAnchor: () => this.element,
			anchorAlignment: AnchorAlignment.RIGHT,
			render: (container: HTMLElement) => {
				if (!this.message) {
					return null;
				}

				div = dom.append(container, $('.monaco-inputbox-container'));
				layout();


				const spanElement = $('span.monaco-inputbox-message');
				if (this.message.formatContent) {
					renderFormattedText(this.message.content!, undefined, spanElement);
				} else {
					renderText(this.message.content!, undefined, spanElement);
				}

				spanElement.classList.add(this.classForType(this.message.type));

				const styles = this.stylesForType(this.message.type);
				spanElement.style.backgroundColor = styles.background ?? '';
				spanElement.style.color = styles.foreground ?? '';
				spanElement.style.border = styles.border ? `1px solid ${styles.border}` : '';

				dom.append(div, spanElement);

				return null;
			},
			onHide: () => {
				this.state = 'closed';
			},
			layout: layout
		});

		// ARIA Support
		let alertText: string;
		if (this.message.type === MessageType.ERROR) {
			alertText = nls.localize('alertErrorMessage', "Error: {0}", this.message.content);
		} else if (this.message.type === MessageType.WARNING) {
			alertText = nls.localize('alertWarningMessage', "Warning: {0}", this.message.content);
		} else {
			alertText = nls.localize('alertInfoMessage', "Info: {0}", this.message.content);
		}

		aria.alert(alertText);

		this.state = 'open';
	}

	private _hideMessage(): void {
		if (!this.contextViewProvider) {
			return;
		}

		if (this.state === 'open') {
			this.contextViewProvider.hideContextView();
		}

		this.state = 'idle';
	}

	private layoutMessage(): void {
		if (this.state === 'open' && this.contextViewProvider) {
			this.contextViewProvider.layout();
		}
	}

	private onValueChange(): void {
		this._onDidChange.fire(this.value);

		this.validate();
		this.updateMirror();
		this.input.classList.toggle('empty', !this.value);

		if (this.state === 'open' && this.contextViewProvider) {
			this.contextViewProvider.layout();
		}
	}

	private updateMirror(): void {
		if (!this.mirror) {
			return;
		}

		const value = this.value;
		const lastCharCode = value.charCodeAt(value.length - 1);
		const suffix = lastCharCode === 10 ? ' ' : '';
		const mirrorTextContent = (value + suffix)
			.replace(/\u000c/g, ''); // Don't measure with the form feed character, which messes up sizing

		if (mirrorTextContent) {
			this.mirror.textContent = value + suffix;
		} else {
			this.mirror.innerText = '\u00a0';
		}

		this.layout();
	}

	protected applyStyles(): void {
		const styles = this.options.inputBoxStyles;

		const background = styles.inputBackground ?? '';
		const foreground = styles.inputForeground ?? '';
		const border = styles.inputBorder ?? '';

		this.element.style.backgroundColor = background;
		this.element.style.color = foreground;
		this.input.style.backgroundColor = 'inherit';
		this.input.style.color = foreground;

		// there's always a border, even if the color is not set.
		this.element.style.border = `1px solid ${cssJs.asCssValueWithDefault(border, 'transparent')}`;
	}

	public layout(): void {
		if (!this.mirror) {
			this.layoutMessage();
			return;
		}

		const previousHeight = this.cachedContentHeight;
		this.cachedContentHeight = dom.getTotalHeight(this.mirror);

		if (previousHeight !== this.cachedContentHeight) {
			this.cachedHeight = Math.min(this.cachedContentHeight, this.maxHeight);
			this.input.style.height = this.cachedHeight + 'px';
			this._onDidHeightChange.fire(this.cachedContentHeight);
		}

		this.layoutMessage();
	}

	public insertAtCursor(text: string): void {
		const inputElement = this.inputElement;
		const start = inputElement.selectionStart;
		const end = inputElement.selectionEnd;
		const content = inputElement.value;

		if (start !== null && end !== null) {
			this.value = content.substr(0, start) + text + content.substr(end);
			inputElement.setSelectionRange(start + 1, start + 1);
			this.layout();
		}
	}

	public override dispose(): void {
		this._hideMessage();

		this.message = null;

		this.actionbar?.dispose();

		super.dispose();
	}
}

export interface IHistoryInputOptions extends IInputOptions {
	readonly showHistoryHint?: () => boolean;
}

export class HistoryInputBox extends InputBox implements IHistoryNavigationWidget {

	private readonly history: HistoryNavigator<string>;
	private observer: MutationObserver | undefined;

	private readonly _onDidFocus = this._register(new Emitter<void>());
	readonly onDidFocus = this._onDidFocus.event;

	private readonly _onDidBlur = this._register(new Emitter<void>());
	readonly onDidBlur = this._onDidBlur.event;

	constructor(container: HTMLElement, contextViewProvider: IContextViewProvider | undefined, options: IHistoryInputOptions) {
		const NLS_PLACEHOLDER_HISTORY_HINT_SUFFIX_NO_PARENS = nls.localize({
			key: 'history.inputbox.hint.suffix.noparens',
			comment: ['Text is the suffix of an input field placeholder coming after the action the input field performs, this will be used when the input field ends in a closing parenthesis ")", for example "Filter (e.g. text, !exclude)". The character inserted into the final string is \u21C5 to represent the up and down arrow keys.']
		}, ' or {0} for history', `\u21C5`);
		const NLS_PLACEHOLDER_HISTORY_HINT_SUFFIX_IN_PARENS = nls.localize({
			key: 'history.inputbox.hint.suffix.inparens',
			comment: ['Text is the suffix of an input field placeholder coming after the action the input field performs, this will be used when the input field does NOT end in a closing parenthesis (eg. "Find"). The character inserted into the final string is \u21C5 to represent the up and down arrow keys.']
		}, ' ({0} for history)', `\u21C5`);

		super(container, contextViewProvider, options);
		this.history = this._register(new HistoryNavigator<string>(options.history, 100));

		// Function to append the history suffix to the placeholder if necessary
		const addSuffix = () => {
			if (options.showHistoryHint && options.showHistoryHint() && !this.placeholder.endsWith(NLS_PLACEHOLDER_HISTORY_HINT_SUFFIX_NO_PARENS) && !this.placeholder.endsWith(NLS_PLACEHOLDER_HISTORY_HINT_SUFFIX_IN_PARENS) && this.history.getHistory().length) {
				const suffix = this.placeholder.endsWith(')') ? NLS_PLACEHOLDER_HISTORY_HINT_SUFFIX_NO_PARENS : NLS_PLACEHOLDER_HISTORY_HINT_SUFFIX_IN_PARENS;
				const suffixedPlaceholder = this.placeholder + suffix;
				if (options.showPlaceholderOnFocus && !dom.isActiveElement(this.input)) {
					this.placeholder = suffixedPlaceholder;
				}
				else {
					this.setPlaceHolder(suffixedPlaceholder);
				}
			}
		};

		// Spot the change to the textarea class attribute which occurs when it changes between non-empty and empty,
		// and add the history suffix to the placeholder if not yet present
		this.observer = new MutationObserver((mutationList: MutationRecord[], observer: MutationObserver) => {
			mutationList.forEach((mutation: MutationRecord) => {
				if (!mutation.target.textContent) {
					addSuffix();
				}
			});
		});
		this.observer.observe(this.input, { attributeFilter: ['class'] });

		this.onfocus(this.input, () => addSuffix());
		this.onblur(this.input, () => {
			const resetPlaceholder = (historyHint: string) => {
				if (!this.placeholder.endsWith(historyHint)) {
					return false;
				}
				else {
					const revertedPlaceholder = this.placeholder.slice(0, this.placeholder.length - historyHint.length);
					if (options.showPlaceholderOnFocus) {
						this.placeholder = revertedPlaceholder;
					}
					else {
						this.setPlaceHolder(revertedPlaceholder);
					}
					return true;
				}
			};
			if (!resetPlaceholder(NLS_PLACEHOLDER_HISTORY_HINT_SUFFIX_IN_PARENS)) {
				resetPlaceholder(NLS_PLACEHOLDER_HISTORY_HINT_SUFFIX_NO_PARENS);
			}
		});
	}

	override dispose() {
		super.dispose();
		if (this.observer) {
			this.observer.disconnect();
			this.observer = undefined;
		}
	}

	public addToHistory(always?: boolean): void {
		if (this.value && (always || this.value !== this.getCurrentValue())) {
			this.history.add(this.value);
		}
	}

	public prependHistory(restoredHistory: string[]): void {
		const newHistory = this.getHistory();
		this.clearHistory();

		restoredHistory.forEach((item) => {
			this.history.add(item);
		});

		newHistory.forEach(item => {
			this.history.add(item);
		});
	}

	public getHistory(): string[] {
		return this.history.getHistory();
	}

	public isAtFirstInHistory(): boolean {
		return this.history.isFirst();
	}

	public isAtLastInHistory(): boolean {
		return this.history.isLast();
	}

	public isNowhereInHistory(): boolean {
		return this.history.isNowhere();
	}

	public showNextValue(): void {
		if (!this.history.has(this.value)) {
			this.addToHistory();
		}

		let next = this.getNextValue();
		if (next) {
			next = next === this.value ? this.getNextValue() : next;
		}

		this.value = next ?? '';
		aria.status(this.value ? this.value : nls.localize('clearedInput', "Cleared Input"));
	}

	public showPreviousValue(): void {
		if (!this.history.has(this.value)) {
			this.addToHistory();
		}

		let previous = this.getPreviousValue();
		if (previous) {
			previous = previous === this.value ? this.getPreviousValue() : previous;
		}

		if (previous) {
			this.value = previous;
			aria.status(this.value);
		}
	}

	public clearHistory(): void {
		this.history.clear();
	}

	public override setPlaceHolder(placeHolder: string): void {
		super.setPlaceHolder(placeHolder);
		this.setTooltip(placeHolder);
	}

	protected override onBlur(): void {
		super.onBlur();
		this._onDidBlur.fire();
	}

	protected override onFocus(): void {
		super.onFocus();
		this._onDidFocus.fire();
	}

	private getCurrentValue(): string | null {
		let currentValue = this.history.current();
		if (!currentValue) {
			currentValue = this.history.last();
			this.history.next();
		}
		return currentValue;
	}

	private getPreviousValue(): string | null {
		return this.history.previous() || this.history.first();
	}

	private getNextValue(): string | null {
		return this.history.next();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/keybindingLabel/keybindingLabel.css]---
Location: vscode-main/src/vs/base/browser/ui/keybindingLabel/keybindingLabel.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-keybinding {
	display: flex;
	align-items: center;
	line-height: 10px;
}

.monaco-keybinding > .monaco-keybinding-key {
	display: inline-flex;
	align-items: center;
	border-style: solid;
	border-width: 1px;
	border-radius: 3px;
	justify-content: center;
	min-width: 12px;
	font-size: 11px;
	padding: 3px 5px;
	margin: 0 2px;
}

.monaco-keybinding > .monaco-keybinding-key:first-child {
	margin-left: 0;
}

.monaco-keybinding > .monaco-keybinding-key:last-child {
	margin-right: 0;
}

.monaco-keybinding > .monaco-keybinding-key-separator {
	display: inline-block;
}

.monaco-keybinding > .monaco-keybinding-key-chord-separator {
	width: 6px;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/keybindingLabel/keybindingLabel.ts]---
Location: vscode-main/src/vs/base/browser/ui/keybindingLabel/keybindingLabel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../dom.js';
import type { IManagedHover } from '../hover/hover.js';
import { getBaseLayerHoverDelegate } from '../hover/hoverDelegate2.js';
import { getDefaultHoverDelegate } from '../hover/hoverDelegateFactory.js';
import { UILabelProvider } from '../../../common/keybindingLabels.js';
import { ResolvedKeybinding, ResolvedChord } from '../../../common/keybindings.js';
import { Disposable } from '../../../common/lifecycle.js';
import { equals } from '../../../common/objects.js';
import { OperatingSystem } from '../../../common/platform.js';
import './keybindingLabel.css';
import { localize } from '../../../../nls.js';

const $ = dom.$;

export interface ChordMatches {
	ctrlKey?: boolean;
	shiftKey?: boolean;
	altKey?: boolean;
	metaKey?: boolean;
	keyCode?: boolean;
}

export interface Matches {
	firstPart: ChordMatches;
	chordPart: ChordMatches;
}

export interface KeybindingLabelOptions extends IKeybindingLabelStyles {
	renderUnboundKeybindings?: boolean;
	/**
	 * Default false.
	 */
	disableTitle?: boolean;
}

export interface IKeybindingLabelStyles {
	keybindingLabelBackground: string | undefined;
	keybindingLabelForeground: string | undefined;
	keybindingLabelBorder: string | undefined;
	keybindingLabelBottomBorder: string | undefined;
	keybindingLabelShadow: string | undefined;
}

export const unthemedKeybindingLabelOptions: KeybindingLabelOptions = {
	keybindingLabelBackground: undefined,
	keybindingLabelForeground: undefined,
	keybindingLabelBorder: undefined,
	keybindingLabelBottomBorder: undefined,
	keybindingLabelShadow: undefined
};

export class KeybindingLabel extends Disposable {

	private domNode: HTMLElement;
	private options: KeybindingLabelOptions;

	private readonly keyElements = new Set<HTMLSpanElement>();

	private hover: IManagedHover;
	private keybinding: ResolvedKeybinding | undefined;
	private matches: Matches | undefined;
	private didEverRender: boolean;

	constructor(container: HTMLElement, private os: OperatingSystem, options?: KeybindingLabelOptions) {
		super();

		this.options = options || Object.create(null);

		const labelForeground = this.options.keybindingLabelForeground;

		this.domNode = dom.append(container, $('.monaco-keybinding'));
		if (labelForeground) {
			this.domNode.style.color = labelForeground;
		}

		this.hover = this._register(getBaseLayerHoverDelegate().setupManagedHover(getDefaultHoverDelegate('mouse'), this.domNode, ''));

		this.didEverRender = false;
		container.appendChild(this.domNode);
	}

	get element(): HTMLElement {
		return this.domNode;
	}

	set(keybinding: ResolvedKeybinding | undefined, matches?: Matches) {
		if (this.didEverRender && this.keybinding === keybinding && KeybindingLabel.areSame(this.matches, matches)) {
			return;
		}

		this.keybinding = keybinding;
		this.matches = matches;
		this.render();
	}

	private render() {
		this.clear();

		if (this.keybinding) {
			const chords = this.keybinding.getChords();
			if (chords[0]) {
				this.renderChord(this.domNode, chords[0], this.matches ? this.matches.firstPart : null);
			}
			for (let i = 1; i < chords.length; i++) {
				dom.append(this.domNode, $('span.monaco-keybinding-key-chord-separator', undefined, ' '));
				this.renderChord(this.domNode, chords[i], this.matches ? this.matches.chordPart : null);
			}
			const title = (this.options.disableTitle ?? false) ? undefined : this.keybinding.getAriaLabel() || undefined;
			this.hover.update(title);
			this.domNode.setAttribute('aria-label', title || '');
		} else if (this.options && this.options.renderUnboundKeybindings) {
			this.renderUnbound(this.domNode);
		}

		this.didEverRender = true;
	}

	private clear(): void {
		dom.clearNode(this.domNode);
		this.keyElements.clear();
	}

	private renderChord(parent: HTMLElement, chord: ResolvedChord, match: ChordMatches | null) {
		const modifierLabels = UILabelProvider.modifierLabels[this.os];
		if (chord.ctrlKey) {
			this.renderKey(parent, modifierLabels.ctrlKey, Boolean(match?.ctrlKey), modifierLabels.separator);
		}
		if (chord.shiftKey) {
			this.renderKey(parent, modifierLabels.shiftKey, Boolean(match?.shiftKey), modifierLabels.separator);
		}
		if (chord.altKey) {
			this.renderKey(parent, modifierLabels.altKey, Boolean(match?.altKey), modifierLabels.separator);
		}
		if (chord.metaKey) {
			this.renderKey(parent, modifierLabels.metaKey, Boolean(match?.metaKey), modifierLabels.separator);
		}
		const keyLabel = chord.keyLabel;
		if (keyLabel) {
			this.renderKey(parent, keyLabel, Boolean(match?.keyCode), '');
		}
	}

	private renderKey(parent: HTMLElement, label: string, highlight: boolean, separator: string): void {
		dom.append(parent, this.createKeyElement(label, highlight ? '.highlight' : ''));
		if (separator) {
			dom.append(parent, $('span.monaco-keybinding-key-separator', undefined, separator));
		}
	}

	private renderUnbound(parent: HTMLElement): void {
		dom.append(parent, this.createKeyElement(localize('unbound', "Unbound")));
	}

	private createKeyElement(label: string, extraClass = ''): HTMLElement {
		const keyElement = $('span.monaco-keybinding-key' + extraClass, undefined, label);
		this.keyElements.add(keyElement);

		if (this.options.keybindingLabelBackground) {
			keyElement.style.backgroundColor = this.options.keybindingLabelBackground;
		}
		if (this.options.keybindingLabelBorder) {
			keyElement.style.borderColor = this.options.keybindingLabelBorder;
		}
		if (this.options.keybindingLabelBottomBorder) {
			keyElement.style.borderBottomColor = this.options.keybindingLabelBottomBorder;
		}
		if (this.options.keybindingLabelShadow) {
			keyElement.style.boxShadow = `inset 0 -1px 0 ${this.options.keybindingLabelShadow}`;
		}

		return keyElement;
	}

	private static areSame(a: Matches | undefined, b: Matches | undefined): boolean {
		if (a === b || (!a && !b)) {
			return true;
		}
		return !!a && !!b && equals(a.firstPart, b.firstPart) && equals(a.chordPart, b.chordPart);
	}
}
```

--------------------------------------------------------------------------------

````
