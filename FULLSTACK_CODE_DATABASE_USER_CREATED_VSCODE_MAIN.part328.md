---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 328
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 328 of 552)

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

---[FILE: src/vs/workbench/browser/parts/compositeBar.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/compositeBar.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../nls.js';
import { IAction, toAction } from '../../../base/common/actions.js';
import { IActivity } from '../../services/activity/common/activity.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';
import { ActionBar, ActionsOrientation } from '../../../base/browser/ui/actionbar/actionbar.js';
import { CompositeActionViewItem, CompositeOverflowActivityAction, CompositeOverflowActivityActionViewItem, CompositeBarAction, ICompositeBar, ICompositeBarColors, IActivityHoverOptions } from './compositeBarActions.js';
import { Dimension, $, addDisposableListener, EventType, EventHelper, isAncestor, getWindow } from '../../../base/browser/dom.js';
import { StandardMouseEvent } from '../../../base/browser/mouseEvent.js';
import { IContextMenuService } from '../../../platform/contextview/browser/contextView.js';
import { Widget } from '../../../base/browser/ui/widget.js';
import { isUndefinedOrNull } from '../../../base/common/types.js';
import { IColorTheme } from '../../../platform/theme/common/themeService.js';
import { Emitter } from '../../../base/common/event.js';
import { ViewContainerLocation, IViewDescriptorService } from '../../common/views.js';
import { IPaneComposite } from '../../common/panecomposite.js';
import { IComposite } from '../../common/composite.js';
import { CompositeDragAndDropData, CompositeDragAndDropObserver, IDraggedCompositeData, ICompositeDragAndDrop, Before2D, toggleDropEffect, ICompositeDragAndDropObserverCallbacks } from '../dnd.js';
import { Gesture, EventType as TouchEventType, GestureEvent } from '../../../base/browser/touch.js';
import { MutableDisposable } from '../../../base/common/lifecycle.js';

export interface ICompositeBarItem {

	readonly id: string;

	name?: string;
	pinned: boolean;
	order?: number;
	visible: boolean;
}

export class CompositeDragAndDrop implements ICompositeDragAndDrop {

	constructor(
		private viewDescriptorService: IViewDescriptorService,
		private targetContainerLocation: ViewContainerLocation,
		private orientation: ActionsOrientation,
		private openComposite: (id: string, focus?: boolean) => Promise<IPaneComposite | null>,
		private moveComposite: (from: string, to: string, before?: Before2D) => void,
		private getItems: () => ICompositeBarItem[]
	) { }

	drop(data: CompositeDragAndDropData, targetCompositeId: string | undefined, originalEvent: DragEvent, before?: Before2D): void {
		const dragData = data.getData();

		if (dragData.type === 'composite') {
			const currentContainer = this.viewDescriptorService.getViewContainerById(dragData.id)!;
			const currentLocation = this.viewDescriptorService.getViewContainerLocation(currentContainer);
			let moved = false;

			// ... on the same composite bar
			if (currentLocation === this.targetContainerLocation) {
				if (targetCompositeId) {
					this.moveComposite(dragData.id, targetCompositeId, before);
					moved = true;
				}
			}
			// ... on a different composite bar
			else {
				this.viewDescriptorService.moveViewContainerToLocation(currentContainer, this.targetContainerLocation, this.getTargetIndex(targetCompositeId, before), 'dnd');
				moved = true;
			}

			if (moved) {
				this.openComposite(currentContainer.id, true);
			}
		}

		if (dragData.type === 'view') {
			const viewToMove = this.viewDescriptorService.getViewDescriptorById(dragData.id)!;
			if (viewToMove.canMoveView) {
				this.viewDescriptorService.moveViewToLocation(viewToMove, this.targetContainerLocation, 'dnd');

				const newContainer = this.viewDescriptorService.getViewContainerByViewId(viewToMove.id)!;

				if (targetCompositeId) {
					this.moveComposite(newContainer.id, targetCompositeId, before);
				}

				this.openComposite(newContainer.id, true).then(composite => {
					composite?.openView(viewToMove.id, true);
				});
			}
		}
	}

	onDragEnter(data: CompositeDragAndDropData, targetCompositeId: string | undefined, originalEvent: DragEvent): boolean {
		return this.canDrop(data, targetCompositeId);
	}

	onDragOver(data: CompositeDragAndDropData, targetCompositeId: string | undefined, originalEvent: DragEvent): boolean {
		return this.canDrop(data, targetCompositeId);
	}

	private getTargetIndex(targetId: string | undefined, before2d: Before2D | undefined): number | undefined {
		if (!targetId) {
			return undefined;
		}

		const items = this.getItems();
		const before = this.orientation === ActionsOrientation.HORIZONTAL ? before2d?.horizontallyBefore : before2d?.verticallyBefore;
		return items.filter(item => item.visible).findIndex(item => item.id === targetId) + (before ? 0 : 1);
	}

	private canDrop(data: CompositeDragAndDropData, targetCompositeId: string | undefined): boolean {
		const dragData = data.getData();

		if (dragData.type === 'composite') {

			// Dragging a composite
			const currentContainer = this.viewDescriptorService.getViewContainerById(dragData.id)!;
			const currentLocation = this.viewDescriptorService.getViewContainerLocation(currentContainer);

			// ... to the same composite location
			if (currentLocation === this.targetContainerLocation) {
				return dragData.id !== targetCompositeId;
			}

			return true;
		} else {

			// Dragging an individual view
			const viewDescriptor = this.viewDescriptorService.getViewDescriptorById(dragData.id);

			// ... that cannot move
			if (!viewDescriptor?.canMoveView) {
				return false;
			}

			// ... to create a view container
			return true;
		}
	}
}

export interface ICompositeBarOptions {

	readonly icon: boolean;
	readonly orientation: ActionsOrientation;
	readonly colors: (theme: IColorTheme) => ICompositeBarColors;
	readonly compact?: boolean;
	readonly compositeSize: number;
	readonly overflowActionSize: number;
	readonly dndHandler: ICompositeDragAndDrop;
	readonly activityHoverOptions: IActivityHoverOptions;
	readonly preventLoopNavigation?: boolean;

	readonly getActivityAction: (compositeId: string) => CompositeBarAction;
	readonly getCompositePinnedAction: (compositeId: string) => IAction;
	readonly getCompositeBadgeAction: (compositeId: string) => IAction;
	readonly getOnCompositeClickAction: (compositeId: string) => IAction;
	readonly fillExtraContextMenuActions: (actions: IAction[], e?: MouseEvent | GestureEvent) => void;
	readonly getContextMenuActionsForComposite: (compositeId: string) => IAction[];

	readonly openComposite: (compositeId: string, preserveFocus?: boolean) => Promise<IComposite | null>;
	readonly getDefaultCompositeId: () => string | undefined;
}

class CompositeBarDndCallbacks implements ICompositeDragAndDropObserverCallbacks {

	private insertDropBefore: Before2D | undefined = undefined;

	constructor(
		private readonly compositeBarContainer: HTMLElement,
		private readonly actionBarContainer: HTMLElement,
		private readonly compositeBarModel: CompositeBarModel,
		private readonly dndHandler: ICompositeDragAndDrop,
		private readonly orientation: ActionsOrientation,
	) { }

	onDragOver(e: IDraggedCompositeData) {

		// don't add feedback if this is over the composite bar actions or there are no actions
		const visibleItems = this.compositeBarModel.visibleItems;
		if (!visibleItems.length || (e.eventData.target && isAncestor(e.eventData.target as HTMLElement, this.actionBarContainer))) {
			this.insertDropBefore = this.updateFromDragging(this.compositeBarContainer, false, false, true);
			return;
		}

		const insertAtFront = this.insertAtFront(this.actionBarContainer, e.eventData);
		const target = insertAtFront ? visibleItems[0] : visibleItems[visibleItems.length - 1];
		const validDropTarget = this.dndHandler.onDragOver(e.dragAndDropData, target.id, e.eventData);
		toggleDropEffect(e.eventData.dataTransfer, 'move', validDropTarget);
		this.insertDropBefore = this.updateFromDragging(this.compositeBarContainer, validDropTarget, insertAtFront, true);
	}

	onDragLeave(e: IDraggedCompositeData) {
		this.insertDropBefore = this.updateFromDragging(this.compositeBarContainer, false, false, false);
	}

	onDragEnd(e: IDraggedCompositeData) {
		this.insertDropBefore = this.updateFromDragging(this.compositeBarContainer, false, false, false);
	}

	onDrop(e: IDraggedCompositeData) {
		const visibleItems = this.compositeBarModel.visibleItems;
		let targetId = undefined;
		if (visibleItems.length) {
			targetId = this.insertAtFront(this.actionBarContainer, e.eventData) ? visibleItems[0].id : visibleItems[visibleItems.length - 1].id;
		}
		this.dndHandler.drop(e.dragAndDropData, targetId, e.eventData, this.insertDropBefore);
		this.insertDropBefore = this.updateFromDragging(this.compositeBarContainer, false, false, false);
	}

	private insertAtFront(element: HTMLElement, event: DragEvent): boolean {
		const rect = element.getBoundingClientRect();
		const posX = event.clientX;
		const posY = event.clientY;

		switch (this.orientation) {
			case ActionsOrientation.HORIZONTAL:
				return posX < rect.left;
			case ActionsOrientation.VERTICAL:
				return posY < rect.top;
		}
	}

	private updateFromDragging(element: HTMLElement, showFeedback: boolean, front: boolean, isDragging: boolean): Before2D | undefined {
		element.classList.toggle('dragged-over', isDragging);
		element.classList.toggle('dragged-over-head', showFeedback && front);
		element.classList.toggle('dragged-over-tail', showFeedback && !front);

		if (!showFeedback) {
			return undefined;
		}

		return { verticallyBefore: front, horizontallyBefore: front };
	}
}

export class CompositeBar extends Widget implements ICompositeBar {

	private readonly _onDidChange = this._register(new Emitter<void>());
	readonly onDidChange = this._onDidChange.event;

	private dimension: Dimension | undefined;

	private compositeSwitcherBar: ActionBar | undefined;
	private compositeOverflowAction = this._register(new MutableDisposable<CompositeOverflowActivityAction>());
	private compositeOverflowActionViewItem = this._register(new MutableDisposable<CompositeOverflowActivityActionViewItem>());

	private readonly model: CompositeBarModel;
	private readonly visibleComposites: string[];
	private readonly compositeSizeInBar: Map<string, number>;

	constructor(
		items: ICompositeBarItem[],
		private readonly options: ICompositeBarOptions,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
		@IViewDescriptorService private readonly viewDescriptorService: IViewDescriptorService,
	) {
		super();

		this.model = new CompositeBarModel(items, options);
		this.visibleComposites = [];
		this.compositeSizeInBar = new Map<string, number>();
		this.computeSizes(this.model.visibleItems);
	}

	getCompositeBarItems(): ICompositeBarItem[] {
		return [...this.model.items];
	}

	setCompositeBarItems(items: ICompositeBarItem[]): void {
		this.model.setItems(items);
		this.updateCompositeSwitcher(true);
	}

	getPinnedComposites(): ICompositeBarItem[] {
		return this.model.pinnedItems;
	}

	getPinnedCompositeIds(): string[] {
		return this.getPinnedComposites().map(c => c.id);
	}

	getVisibleComposites(): ICompositeBarItem[] {
		return this.model.visibleItems;
	}

	create(parent: HTMLElement): HTMLElement {
		const actionBarDiv = parent.appendChild($('.composite-bar'));
		this.compositeSwitcherBar = this._register(new ActionBar(actionBarDiv, {
			actionViewItemProvider: (action, options) => {
				if (action instanceof CompositeOverflowActivityAction) {
					return this.compositeOverflowActionViewItem.value;
				}
				const item = this.model.findItem(action.id);
				return item && this.instantiationService.createInstance(
					CompositeActionViewItem,
					{ ...options, draggable: true, colors: this.options.colors, icon: this.options.icon, hoverOptions: this.options.activityHoverOptions, compact: this.options.compact },
					action as CompositeBarAction,
					item.pinnedAction,
					item.toggleBadgeAction,
					compositeId => this.options.getContextMenuActionsForComposite(compositeId),
					() => this.getContextMenuActions(),
					this.options.dndHandler,
					this
				);
			},
			orientation: this.options.orientation,
			ariaLabel: localize('activityBarAriaLabel', "Active View Switcher"),
			ariaRole: 'tablist',
			preventLoopNavigation: this.options.preventLoopNavigation,
			triggerKeys: { keyDown: true }
		}));

		// Contextmenu for composites
		this._register(addDisposableListener(parent, EventType.CONTEXT_MENU, e => this.showContextMenu(getWindow(parent), e)));
		this._register(Gesture.addTarget(parent));
		this._register(addDisposableListener(parent, TouchEventType.Contextmenu, e => this.showContextMenu(getWindow(parent), e)));

		// Register a drop target on the whole bar to prevent forbidden feedback
		const dndCallback = new CompositeBarDndCallbacks(parent, actionBarDiv, this.model, this.options.dndHandler, this.options.orientation);
		this._register(CompositeDragAndDropObserver.INSTANCE.registerTarget(parent, dndCallback));

		return actionBarDiv;
	}

	focus(index?: number): void {
		this.compositeSwitcherBar?.focus(index);
	}

	recomputeSizes(): void {
		this.computeSizes(this.model.visibleItems);
		this.updateCompositeSwitcher();
	}

	layout(dimension: Dimension): void {
		this.dimension = dimension;

		if (dimension.height === 0 || dimension.width === 0) {
			// Do not layout if not visible. Otherwise the size measurment would be computed wrongly
			return;
		}

		if (this.compositeSizeInBar.size === 0) {
			// Compute size of each composite by getting the size from the css renderer
			// Size is later used for overflow computation
			this.computeSizes(this.model.visibleItems);
		}

		this.updateCompositeSwitcher();
	}

	addComposite({ id, name, order, requestedIndex }: { id: string; name: string; order?: number; requestedIndex?: number }): void {
		if (this.model.add(id, name, order, requestedIndex)) {
			this.computeSizes([this.model.findItem(id)]);
			this.updateCompositeSwitcher();
		}
	}

	removeComposite(id: string): void {

		// If it pinned, unpin it first
		if (this.isPinned(id)) {
			this.unpin(id);
		}

		// Remove from the model
		if (this.model.remove(id)) {
			this.updateCompositeSwitcher();
		}
	}

	hideComposite(id: string): void {
		if (this.model.hide(id)) {
			this.resetActiveComposite(id);
			this.updateCompositeSwitcher();
		}
	}

	activateComposite(id: string): void {
		const previousActiveItem = this.model.activeItem;
		if (this.model.activate(id)) {
			// Update if current composite is neither visible nor pinned
			// or previous active composite is not pinned
			if (this.visibleComposites.indexOf(id) === - 1 || (!!this.model.activeItem && !this.model.activeItem.pinned) || (previousActiveItem && !previousActiveItem.pinned)) {
				this.updateCompositeSwitcher();
			}
		}
	}

	deactivateComposite(id: string): void {
		const previousActiveItem = this.model.activeItem;
		if (this.model.deactivate()) {
			if (previousActiveItem && !previousActiveItem.pinned) {
				this.updateCompositeSwitcher();
			}
		}
	}

	async pin(compositeId: string, open?: boolean): Promise<void> {
		if (this.model.setPinned(compositeId, true)) {
			this.updateCompositeSwitcher();

			if (open) {
				await this.options.openComposite(compositeId);
				this.activateComposite(compositeId); // Activate after opening
			}
		}
	}

	unpin(compositeId: string): void {
		if (this.model.setPinned(compositeId, false)) {

			this.updateCompositeSwitcher();

			this.resetActiveComposite(compositeId);
		}
	}

	areBadgesEnabled(compositeId: string): boolean {
		return this.viewDescriptorService.getViewContainerBadgeEnablementState(compositeId);
	}

	toggleBadgeEnablement(compositeId: string): void {
		this.viewDescriptorService.setViewContainerBadgeEnablementState(compositeId, !this.areBadgesEnabled(compositeId));
		this.updateCompositeSwitcher();
		const item = this.model.findItem(compositeId);
		if (item) {
			// TODO @lramos15 how do we tell the activity to re-render the badge? This triggers an onDidChange but isn't the right way to do it.
			// I could add another specific function like `activity.updateBadgeEnablement` would then the activity store the sate?
			item.activityAction.activities = item.activityAction.activities;
		}
	}

	private resetActiveComposite(compositeId: string) {
		const defaultCompositeId = this.options.getDefaultCompositeId();

		// Case: composite is not the active one or the active one is a different one
		// Solv: we do nothing
		if (!this.model.activeItem || this.model.activeItem.id !== compositeId) {
			return;
		}

		// Deactivate itself
		this.deactivateComposite(compositeId);

		// Case: composite is not the default composite and default composite is still showing
		// Solv: we open the default composite
		if (defaultCompositeId && defaultCompositeId !== compositeId && this.isPinned(defaultCompositeId)) {
			this.options.openComposite(defaultCompositeId, true);
		}

		// Case: we closed the default composite
		// Solv: we open the next visible composite from top
		else {
			const visibleComposite = this.visibleComposites.find(cid => cid !== compositeId);
			if (visibleComposite) {
				this.options.openComposite(visibleComposite);
			}
		}
	}

	isPinned(compositeId: string): boolean {
		const item = this.model.findItem(compositeId);
		return item?.pinned;
	}

	move(compositeId: string, toCompositeId: string, before?: boolean): void {
		if (before !== undefined) {
			const fromIndex = this.model.items.findIndex(c => c.id === compositeId);
			let toIndex = this.model.items.findIndex(c => c.id === toCompositeId);

			if (fromIndex >= 0 && toIndex >= 0) {
				if (!before && fromIndex > toIndex) {
					toIndex++;
				}

				if (before && fromIndex < toIndex) {
					toIndex--;
				}

				if (toIndex < this.model.items.length && toIndex >= 0 && toIndex !== fromIndex) {
					if (this.model.move(this.model.items[fromIndex].id, this.model.items[toIndex].id)) {
						// timeout helps to prevent artifacts from showing up
						setTimeout(() => this.updateCompositeSwitcher(), 0);
					}
				}
			}
		} else {
			if (this.model.move(compositeId, toCompositeId)) {
				// timeout helps to prevent artifacts from showing up
				setTimeout(() => this.updateCompositeSwitcher(), 0);
			}
		}
	}

	getAction(compositeId: string): CompositeBarAction {
		const item = this.model.findItem(compositeId);

		return item?.activityAction;
	}

	private computeSizes(items: ICompositeBarModelItem[]): void {
		const size = this.options.compositeSize;
		if (size) {
			items.forEach(composite => this.compositeSizeInBar.set(composite.id, size));
		} else {
			const compositeSwitcherBar = this.compositeSwitcherBar;
			if (compositeSwitcherBar && this.dimension && this.dimension.height !== 0 && this.dimension.width !== 0) {

				// Compute sizes only if visible. Otherwise the size measurment would be computed wrongly.
				const currentItemsLength = compositeSwitcherBar.viewItems.length;
				compositeSwitcherBar.push(items.map(composite => composite.activityAction));
				items.map((composite, index) => this.compositeSizeInBar.set(composite.id, this.options.orientation === ActionsOrientation.VERTICAL
					? compositeSwitcherBar.getHeight(currentItemsLength + index)
					: compositeSwitcherBar.getWidth(currentItemsLength + index)
				));
				items.forEach(() => compositeSwitcherBar.pull(compositeSwitcherBar.viewItems.length - 1));
			}
		}
	}

	private updateCompositeSwitcher(donotTrigger?: boolean): void {
		const compositeSwitcherBar = this.compositeSwitcherBar;
		if (!compositeSwitcherBar || !this.dimension) {
			return; // We have not been rendered yet so there is nothing to update.
		}

		let compositesToShow = this.model.visibleItems.filter(item =>
			item.pinned
			|| (this.model.activeItem && this.model.activeItem.id === item.id) /* Show the active composite even if it is not pinned */
		).map(item => item.id);

		// Ensure we are not showing more composites than we have height for
		let maxVisible = compositesToShow.length;
		const totalComposites = compositesToShow.length;
		let size = 0;
		const limit = this.options.orientation === ActionsOrientation.VERTICAL ? this.dimension.height : this.dimension.width;

		// Add composites while they fit
		for (let i = 0; i < compositesToShow.length; i++) {
			const compositeSize = this.compositeSizeInBar.get(compositesToShow[i])!;
			// Adding this composite will overflow available size, so don't
			if (size + compositeSize > limit) {
				maxVisible = i;
				break;
			}

			size += compositeSize;
		}

		// Remove the tail of composites that did not fit
		if (totalComposites > maxVisible) {
			compositesToShow = compositesToShow.slice(0, maxVisible);
		}

		// We always try show the active composite, so re-add it if it was sliced out
		if (this.model.activeItem && compositesToShow.every(compositeId => !!this.model.activeItem && compositeId !== this.model.activeItem.id)) {
			size += this.compositeSizeInBar.get(this.model.activeItem.id)!;
			compositesToShow.push(this.model.activeItem.id);
		}

		// The active composite might have pushed us over the limit
		// Keep popping the composite before the active one until it fits
		// If even the active one doesn't fit, we will resort to overflow
		while (size > limit && compositesToShow.length) {
			const removedComposite = compositesToShow.length > 1 ? compositesToShow.splice(compositesToShow.length - 2, 1)[0] : compositesToShow.pop();
			size -= this.compositeSizeInBar.get(removedComposite!)!;
		}

		// We are overflowing, add the overflow size
		if (totalComposites > compositesToShow.length) {
			size += this.options.overflowActionSize;
		}

		// Check if we need to make extra room for the overflow action
		while (size > limit && compositesToShow.length) {
			const removedComposite = compositesToShow.length > 1 && compositesToShow[compositesToShow.length - 1] === this.model.activeItem?.id ?
				compositesToShow.splice(compositesToShow.length - 2, 1)[0] : compositesToShow.pop();
			size -= this.compositeSizeInBar.get(removedComposite!)!;
		}

		// Remove the overflow action if there are no overflows
		if (totalComposites === compositesToShow.length && this.compositeOverflowAction.value) {
			compositeSwitcherBar.pull(compositeSwitcherBar.length() - 1);

			this.compositeOverflowAction.value = undefined;
			this.compositeOverflowActionViewItem.value = undefined;
		}

		// Pull out composites that overflow or got hidden
		const compositesToRemove: number[] = [];
		this.visibleComposites.forEach((compositeId, index) => {
			if (!compositesToShow.includes(compositeId)) {
				compositesToRemove.push(index);
			}
		});
		compositesToRemove.reverse().forEach(index => {
			compositeSwitcherBar.pull(index);
			this.visibleComposites.splice(index, 1);
		});

		// Update the positions of the composites
		compositesToShow.forEach((compositeId, newIndex) => {
			const currentIndex = this.visibleComposites.indexOf(compositeId);
			if (newIndex !== currentIndex) {
				if (currentIndex !== -1) {
					compositeSwitcherBar.pull(currentIndex);
					this.visibleComposites.splice(currentIndex, 1);
				}

				compositeSwitcherBar.push(this.model.findItem(compositeId).activityAction, { label: true, icon: this.options.icon, index: newIndex });
				this.visibleComposites.splice(newIndex, 0, compositeId);
			}
		});

		// Add overflow action as needed
		if (totalComposites > compositesToShow.length && !this.compositeOverflowAction.value) {
			this.compositeOverflowAction.value = this.instantiationService.createInstance(CompositeOverflowActivityAction, () => {
				this.compositeOverflowActionViewItem.value?.showMenu();
			});
			this.compositeOverflowActionViewItem.value = this.instantiationService.createInstance(
				CompositeOverflowActivityActionViewItem,
				this.compositeOverflowAction.value,
				() => this.getOverflowingComposites(),
				() => this.model.activeItem ? this.model.activeItem.id : undefined,
				compositeId => {
					const item = this.model.findItem(compositeId);
					return item?.activity[0]?.badge;
				},
				this.options.getOnCompositeClickAction,
				this.options.colors,
				this.options.activityHoverOptions
			);

			compositeSwitcherBar.push(this.compositeOverflowAction.value, { label: false, icon: true });
		}

		if (!donotTrigger) {
			this._onDidChange.fire();
		}
	}

	private getOverflowingComposites(): { id: string; name?: string }[] {
		let overflowingIds = this.model.visibleItems.filter(item => item.pinned).map(item => item.id);

		// Show the active composite even if it is not pinned
		if (this.model.activeItem && !this.model.activeItem.pinned) {
			overflowingIds.push(this.model.activeItem.id);
		}

		overflowingIds = overflowingIds.filter(compositeId => !this.visibleComposites.includes(compositeId));
		return this.model.visibleItems.filter(c => overflowingIds.includes(c.id)).map(item => { return { id: item.id, name: this.getAction(item.id)?.label || item.name }; });
	}

	private showContextMenu(targetWindow: Window, e: MouseEvent | GestureEvent): void {
		EventHelper.stop(e, true);

		const event = new StandardMouseEvent(targetWindow, e);
		this.contextMenuService.showContextMenu({
			getAnchor: () => event,
			getActions: () => this.getContextMenuActions(e)
		});
	}

	getContextMenuActions(e?: MouseEvent | GestureEvent): IAction[] {
		const actions: IAction[] = this.model.visibleItems
			.map(({ id, name, activityAction }) => {
				const isPinned = this.isPinned(id);
				return toAction({
					id,
					label: this.getAction(id).label || name || id,
					checked: isPinned,
					enabled: activityAction.enabled && (!isPinned || this.getPinnedCompositeIds().length > 1),
					run: () => {
						if (this.isPinned(id)) {
							this.unpin(id);
						} else {
							this.pin(id, true);
						}
					}
				});
			});

		this.options.fillExtraContextMenuActions(actions, e);

		return actions;
	}
}

interface ICompositeBarModelItem extends ICompositeBarItem {
	readonly activityAction: CompositeBarAction;
	readonly pinnedAction: IAction;
	readonly toggleBadgeAction: IAction;
	readonly activity: IActivity[];
}

class CompositeBarModel {

	private _items: ICompositeBarModelItem[] = [];
	get items(): ICompositeBarModelItem[] { return this._items; }

	private readonly options: ICompositeBarOptions;

	activeItem?: ICompositeBarModelItem;

	constructor(
		items: ICompositeBarItem[],
		options: ICompositeBarOptions
	) {
		this.options = options;
		this.setItems(items);
	}

	setItems(items: ICompositeBarItem[]): void {
		this._items = [];
		this._items = items
			.map(i => this.createCompositeBarItem(i.id, i.name, i.order, i.pinned, i.visible));
	}

	get visibleItems(): ICompositeBarModelItem[] {
		return this.items.filter(item => item.visible);
	}

	get pinnedItems(): ICompositeBarModelItem[] {
		return this.items.filter(item => item.visible && item.pinned);
	}

	private createCompositeBarItem(id: string, name: string | undefined, order: number | undefined, pinned: boolean, visible: boolean): ICompositeBarModelItem {
		const options = this.options;
		return {
			id, name, pinned, order, visible,
			activity: [],
			get activityAction() {
				return options.getActivityAction(id);
			},
			get pinnedAction() {
				return options.getCompositePinnedAction(id);
			},
			get toggleBadgeAction() {
				return options.getCompositeBadgeAction(id);
			}
		};
	}

	add(id: string, name: string, order: number | undefined, requestedIndex: number | undefined): boolean {
		const item = this.findItem(id);
		if (item) {
			let changed = false;
			item.name = name;
			if (!isUndefinedOrNull(order)) {
				changed = item.order !== order;
				item.order = order;
			}
			if (!item.visible) {
				item.visible = true;
				changed = true;
			}

			return changed;
		} else {
			const item = this.createCompositeBarItem(id, name, order, true, true);
			if (!isUndefinedOrNull(requestedIndex)) {
				let index = 0;
				let rIndex = requestedIndex;
				while (rIndex > 0 && index < this.items.length) {
					if (this.items[index++].visible) {
						rIndex--;
					}
				}

				this.items.splice(index, 0, item);
			} else if (isUndefinedOrNull(order)) {
				this.items.push(item);
			} else {
				let index = 0;
				while (index < this.items.length && typeof this.items[index].order === 'number' && this.items[index].order! < order) {
					index++;
				}
				this.items.splice(index, 0, item);
			}

			return true;
		}
	}

	remove(id: string): boolean {
		for (let index = 0; index < this.items.length; index++) {
			if (this.items[index].id === id) {
				this.items.splice(index, 1);
				return true;
			}
		}
		return false;
	}

	hide(id: string): boolean {
		for (const item of this.items) {
			if (item.id === id) {
				if (item.visible) {
					item.visible = false;
					return true;
				}
				return false;
			}
		}
		return false;
	}

	move(compositeId: string, toCompositeId: string): boolean {

		const fromIndex = this.findIndex(compositeId);
		const toIndex = this.findIndex(toCompositeId);

		// Make sure both items are known to the model
		if (fromIndex === -1 || toIndex === -1) {
			return false;
		}

		const sourceItem = this.items.splice(fromIndex, 1)[0];
		this.items.splice(toIndex, 0, sourceItem);

		// Make sure a moved composite gets pinned
		sourceItem.pinned = true;

		return true;
	}

	setPinned(id: string, pinned: boolean): boolean {
		for (const item of this.items) {
			if (item.id === id) {
				if (item.pinned !== pinned) {
					item.pinned = pinned;
					return true;
				}
				return false;
			}
		}
		return false;
	}

	activate(id: string): boolean {
		if (!this.activeItem || this.activeItem.id !== id) {
			if (this.activeItem) {
				this.deactivate();
			}
			for (const item of this.items) {
				if (item.id === id) {
					this.activeItem = item;
					this.activeItem.activityAction.activate();
					return true;
				}
			}
		}
		return false;
	}

	deactivate(): boolean {
		if (this.activeItem) {
			this.activeItem.activityAction.deactivate();
			this.activeItem = undefined;
			return true;
		}
		return false;
	}

	findItem(id: string): ICompositeBarModelItem {
		return this.items.filter(item => item.id === id)[0];
	}

	private findIndex(id: string): number {
		for (let index = 0; index < this.items.length; index++) {
			if (this.items[index].id === id) {
				return index;
			}
		}

		return -1;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/compositeBarActions.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/compositeBarActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../nls.js';
import { Action, IAction, Separator } from '../../../base/common/actions.js';
import { $, addDisposableListener, append, clearNode, EventHelper, EventType, getDomNodePagePosition, hide, show } from '../../../base/browser/dom.js';
import { ICommandService } from '../../../platform/commands/common/commands.js';
import { toDisposable, DisposableStore, MutableDisposable } from '../../../base/common/lifecycle.js';
import { IContextMenuService } from '../../../platform/contextview/browser/contextView.js';
import { IThemeService, IColorTheme } from '../../../platform/theme/common/themeService.js';
import { NumberBadge, IBadge, IActivity, ProgressBadge, IconBadge } from '../../services/activity/common/activity.js';
import { IInstantiationService, ServicesAccessor } from '../../../platform/instantiation/common/instantiation.js';
import { DelayedDragHandler } from '../../../base/browser/dnd.js';
import { IKeybindingService } from '../../../platform/keybinding/common/keybinding.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { CompositeDragAndDropObserver, ICompositeDragAndDrop, Before2D, toggleDropEffect } from '../dnd.js';
import { Color } from '../../../base/common/color.js';
import { BaseActionViewItem, IActionViewItemOptions } from '../../../base/browser/ui/actionbar/actionViewItems.js';
import { Codicon } from '../../../base/common/codicons.js';
import { ThemeIcon } from '../../../base/common/themables.js';
import { IHoverService } from '../../../platform/hover/browser/hover.js';
import { IConfigurationService } from '../../../platform/configuration/common/configuration.js';
import { HoverPosition } from '../../../base/browser/ui/hover/hoverWidget.js';
import { URI } from '../../../base/common/uri.js';
import { badgeBackground, badgeForeground, contrastBorder } from '../../../platform/theme/common/colorRegistry.js';
import { Action2, IAction2Options } from '../../../platform/actions/common/actions.js';
import { ViewContainerLocation } from '../../common/views.js';
import { IPaneCompositePartService } from '../../services/panecomposite/browser/panecomposite.js';
import { createConfigureKeybindingAction } from '../../../platform/actions/common/menuService.js';
import { HoverStyle } from '../../../base/browser/ui/hover/hover.js';

export interface ICompositeBar {

	/**
	 * Unpins a composite from the composite bar.
	 */
	unpin(compositeId: string): void;

	/**
	 * Pin a composite inside the composite bar.
	 */
	pin(compositeId: string): void;

	/**
	 * Find out if a composite is pinned in the composite bar.
	 */
	isPinned(compositeId: string): boolean;

	/**
	 * Get pinned composite ids in the composite bar.
	 */
	getPinnedCompositeIds(): string[];

	/**
	 * Returns if badges are enabled for that specified composite.
	 * @param compositeId The id of the composite to check
	 */
	areBadgesEnabled(compositeId: string): boolean;

	/**
	 * Toggles whether or not badges are shown on that particular composite.
	 * @param compositeId The composite to toggle badge enablement for
	 */
	toggleBadgeEnablement(compositeId: string): void;

	/**
	 * Reorder composite ordering by moving a composite to the location of another composite.
	 */
	move(compositeId: string, tocompositeId: string): void;
}

export interface ICompositeBarActionItem {
	id: string;
	name: string;
	keybindingId?: string;
	classNames?: string[];
	iconUrl?: URI;
}

export class CompositeBarAction extends Action {

	private readonly _onDidChangeCompositeBarActionItem = this._register(new Emitter<CompositeBarAction>());
	readonly onDidChangeCompositeBarActionItem = this._onDidChangeCompositeBarActionItem.event;

	private readonly _onDidChangeActivity = this._register(new Emitter<IActivity[]>());
	readonly onDidChangeActivity = this._onDidChangeActivity.event;

	private _activities: IActivity[] = [];

	constructor(private item: ICompositeBarActionItem) {
		super(item.id, item.name, item.classNames?.join(' '), true);
	}

	get compositeBarActionItem(): ICompositeBarActionItem {
		return this.item;
	}

	set compositeBarActionItem(item: ICompositeBarActionItem) {
		this._label = item.name;
		this.item = item;
		this._onDidChangeCompositeBarActionItem.fire(this);
	}

	get activities(): IActivity[] {
		return this._activities;
	}

	set activities(activities: IActivity[]) {
		this._activities = activities;
		this._onDidChangeActivity.fire(activities);
	}

	activate(): void {
		if (!this.checked) {
			this._setChecked(true);
		}
	}

	deactivate(): void {
		if (this.checked) {
			this._setChecked(false);
		}
	}

}

export interface ICompositeBarColors {
	readonly activeBackgroundColor?: Color;
	readonly inactiveBackgroundColor?: Color;
	readonly activeBorderColor?: Color;
	readonly activeBackground?: Color;
	readonly activeBorderBottomColor?: Color;
	readonly activeForegroundColor?: Color;
	readonly inactiveForegroundColor?: Color;
	readonly badgeBackground?: Color;
	readonly badgeForeground?: Color;
	readonly dragAndDropBorder?: Color;
}

export interface IActivityHoverOptions {
	readonly position: () => HoverPosition;
}

export interface ICompositeBarActionViewItemOptions extends IActionViewItemOptions {
	readonly icon?: boolean;
	readonly colors: (theme: IColorTheme) => ICompositeBarColors;

	readonly hoverOptions: IActivityHoverOptions;
	readonly hasPopup?: boolean;
	readonly compact?: boolean;
}

export class CompositeBarActionViewItem extends BaseActionViewItem {

	protected container!: HTMLElement;
	protected label!: HTMLElement;
	protected badge!: HTMLElement;
	protected override readonly options: ICompositeBarActionViewItemOptions;

	private badgeContent: HTMLElement | undefined;
	private readonly badgeDisposable = this._register(new MutableDisposable<DisposableStore>());
	private mouseUpTimeout: Timeout | undefined;
	private keybindingLabel: string | undefined | null;

	constructor(
		action: CompositeBarAction,
		options: ICompositeBarActionViewItemOptions,
		private readonly badgesEnabled: (compositeId: string) => boolean,
		@IThemeService protected readonly themeService: IThemeService,
		@IHoverService private readonly hoverService: IHoverService,
		@IConfigurationService protected readonly configurationService: IConfigurationService,
		@IKeybindingService protected readonly keybindingService: IKeybindingService,
	) {
		super(null, action, options);

		this.options = options;

		this._register(this.themeService.onDidColorThemeChange(this.onThemeChange, this));
		this._register(action.onDidChangeCompositeBarActionItem(() => this.update()));
		this._register(Event.filter(keybindingService.onDidUpdateKeybindings, () => this.keybindingLabel !== this.computeKeybindingLabel())(() => this.updateTitle()));
		this._register(action.onDidChangeActivity(() => this.updateActivity()));
	}

	protected get compositeBarActionItem(): ICompositeBarActionItem {
		return (this._action as CompositeBarAction).compositeBarActionItem;
	}

	protected updateStyles(): void {
		const theme = this.themeService.getColorTheme();
		const colors = this.options.colors(theme);

		if (this.label) {
			if (this.options.icon) {
				const foreground = this._action.checked ? colors.activeForegroundColor : colors.inactiveForegroundColor;
				if (this.compositeBarActionItem.iconUrl) {
					// Apply background color to activity bar item provided with iconUrls
					this.label.style.backgroundColor = foreground ? foreground.toString() : '';
					this.label.style.color = '';
				} else {
					// Apply foreground color to activity bar items provided with codicons
					this.label.style.color = foreground ? foreground.toString() : '';
					this.label.style.backgroundColor = '';
				}
			} else {
				const foreground = this._action.checked ? colors.activeForegroundColor : colors.inactiveForegroundColor;
				const borderBottomColor = this._action.checked ? colors.activeBorderBottomColor : null;
				this.label.style.color = foreground ? foreground.toString() : '';
				this.label.style.borderBottomColor = borderBottomColor ? borderBottomColor.toString() : '';
			}

			this.container.style.setProperty('--insert-border-color', colors.dragAndDropBorder ? colors.dragAndDropBorder.toString() : '');
		}

		// Badge
		if (this.badgeContent) {
			const badgeStyles = this.getActivities()[0]?.badge.getColors(theme);
			const badgeFg = badgeStyles?.badgeForeground ?? colors.badgeForeground ?? theme.getColor(badgeForeground);
			const badgeBg = badgeStyles?.badgeBackground ?? colors.badgeBackground ?? theme.getColor(badgeBackground);
			const contrastBorderColor = badgeStyles?.badgeBorder ?? theme.getColor(contrastBorder);

			this.badgeContent.style.color = badgeFg ? badgeFg.toString() : '';
			this.badgeContent.style.backgroundColor = badgeBg ? badgeBg.toString() : '';

			this.badgeContent.style.borderStyle = contrastBorderColor && !this.options.compact ? 'solid' : '';
			this.badgeContent.style.borderWidth = contrastBorderColor ? '1px' : '';
			this.badgeContent.style.borderColor = contrastBorderColor ? contrastBorderColor.toString() : '';
		}
	}

	override render(container: HTMLElement): void {
		super.render(container);

		this.container = container;
		if (this.options.icon) {
			this.container.classList.add('icon');
		}

		if (this.options.hasPopup) {
			this.container.setAttribute('role', 'button');
			this.container.setAttribute('aria-haspopup', 'true');
		} else {
			this.container.setAttribute('role', 'tab');
		}

		// Try hard to prevent keyboard only focus feedback when using mouse
		this._register(addDisposableListener(this.container, EventType.MOUSE_DOWN, () => {
			this.container.classList.add('clicked');
		}));

		this._register(addDisposableListener(this.container, EventType.MOUSE_UP, () => {
			if (this.mouseUpTimeout) {
				clearTimeout(this.mouseUpTimeout);
			}

			this.mouseUpTimeout = setTimeout(() => {
				this.container.classList.remove('clicked');
			}, 800); // delayed to prevent focus feedback from showing on mouse up
		}));

		this._register(this.hoverService.setupDelayedHover(this.container, () => ({
			content: this.computeTitle(),
			style: HoverStyle.Pointer,
			position: {
				hoverPosition: this.options.hoverOptions.position(),
			},
			persistence: {
				hideOnKeyDown: true,
			},
		}), { groupId: 'composite-bar-actions' }));

		// Label
		this.label = append(container, $('a'));

		// Badge
		this.badge = append(container, $('.badge'));
		this.badgeContent = append(this.badge, $('.badge-content'));

		// pane composite bar active border + background
		append(container, $('.active-item-indicator'));

		hide(this.badge);

		this.update();
		this.updateStyles();
		this.updateTitle();
	}

	private onThemeChange(theme: IColorTheme): void {
		this.updateStyles();
	}

	protected update(): void {
		this.updateLabel();
		this.updateActivity();
		this.updateTitle();
		this.updateStyles();
	}

	private getActivities(): IActivity[] {
		if (this._action instanceof CompositeBarAction) {
			return this._action.activities;
		}
		return [];
	}

	protected updateActivity(): void {
		if (!this.badge || !this.badgeContent || !(this._action instanceof CompositeBarAction)) {
			return;
		}

		const { badges, type } = this.getVisibleBadges(this.getActivities());

		this.badgeDisposable.value = new DisposableStore();

		clearNode(this.badgeContent);
		hide(this.badge);

		const shouldRenderBadges = this.badgesEnabled(this.compositeBarActionItem.id);

		if (badges.length > 0 && shouldRenderBadges) {

			const classes: string[] = [];

			if (this.options.compact) {
				classes.push('compact');
			}

			// Progress
			if (type === 'progress') {
				show(this.badge);
				classes.push('progress-badge');
			}

			// Number
			else if (type === 'number') {
				const total = badges.reduce((r, b) => r + (b instanceof NumberBadge ? b.number : 0), 0);
				if (total > 0) {
					let badgeNumber = total.toString();
					if (total > 999) {
						const noOfThousands = total / 1000;
						const floor = Math.floor(noOfThousands);
						badgeNumber = noOfThousands > floor ? `${floor}K+` : `${noOfThousands}K`;
					}
					if (this.options.compact && badgeNumber.length >= 3) {
						classes.push('compact-content');
					}
					this.badgeContent.textContent = badgeNumber;
					show(this.badge);
				}
			}

			// Icon
			else if (type === 'icon') {
				classes.push('icon-badge');
				const badgeContentClassess = ['icon-overlay', ...ThemeIcon.asClassNameArray((badges[0] as IconBadge).icon)];
				this.badgeContent.classList.add(...badgeContentClassess);
				this.badgeDisposable.value.add(toDisposable(() => this.badgeContent?.classList.remove(...badgeContentClassess)));
				show(this.badge);
			}

			if (classes.length) {
				this.badge.classList.add(...classes);
				this.badgeDisposable.value.add(toDisposable(() => this.badge.classList.remove(...classes)));
			}

		}

		this.updateTitle();
		this.updateStyles();
	}

	private getVisibleBadges(activities: IActivity[]): { badges: IBadge[]; type: 'progress' | 'icon' | 'number' | undefined } {
		const progressBadges = activities.filter(activity => activity.badge instanceof ProgressBadge).map(activity => activity.badge);
		if (progressBadges.length > 0) {
			return { badges: progressBadges, type: 'progress' };
		}

		const iconBadges = activities.filter(activity => activity.badge instanceof IconBadge).map(activity => activity.badge);
		if (iconBadges.length > 0) {
			return { badges: iconBadges, type: 'icon' };
		}

		const numberBadges = activities.filter(activity => activity.badge instanceof NumberBadge).map(activity => activity.badge);
		if (numberBadges.length > 0) {
			return { badges: numberBadges, type: 'number' };
		}

		return { badges: [], type: undefined };
	}

	protected override updateLabel(): void {
		this.label.className = 'action-label';

		if (this.compositeBarActionItem.classNames) {
			this.label.classList.add(...this.compositeBarActionItem.classNames);
		}

		if (!this.options.icon) {
			this.label.textContent = this.action.label;
		}
	}

	private updateTitle(): void {
		const title = this.computeTitle();
		[this.label, this.badge, this.container].forEach(element => {
			if (element) {
				element.setAttribute('aria-label', title);
				element.setAttribute('title', '');
				element.removeAttribute('title');
			}
		});
	}

	protected computeTitle(): string {
		this.keybindingLabel = this.computeKeybindingLabel();
		let title = this.keybindingLabel ? localize('titleKeybinding', "{0} ({1})", this.compositeBarActionItem.name, this.keybindingLabel) : this.compositeBarActionItem.name;

		const badges = this.getVisibleBadges((this.action as CompositeBarAction).activities).badges;
		for (const badge of badges) {
			const description = badge.getDescription();
			if (!description) {
				continue;
			}
			title = `${title} - ${badge.getDescription()}`;
		}

		return title;
	}

	private computeKeybindingLabel(): string | undefined | null {
		const keybinding = this.compositeBarActionItem.keybindingId ? this.keybindingService.lookupKeybinding(this.compositeBarActionItem.keybindingId) : null;

		return keybinding?.getLabel();
	}

	override dispose(): void {
		super.dispose();

		if (this.mouseUpTimeout) {
			clearTimeout(this.mouseUpTimeout);
		}

		this.badge.remove();
	}
}

export class CompositeOverflowActivityAction extends CompositeBarAction {

	constructor(
		private showMenu: () => void
	) {
		super({
			id: 'additionalComposites.action',
			name: localize('additionalViews', "Additional Views"),
			classNames: ThemeIcon.asClassNameArray(Codicon.more)
		});
	}

	override async run(): Promise<void> {
		this.showMenu();
	}
}

export class CompositeOverflowActivityActionViewItem extends CompositeBarActionViewItem {

	constructor(
		action: CompositeBarAction,
		private getOverflowingComposites: () => { id: string; name?: string }[],
		private getActiveCompositeId: () => string | undefined,
		private getBadge: (compositeId: string) => IBadge,
		private getCompositeOpenAction: (compositeId: string) => IAction,
		colors: (theme: IColorTheme) => ICompositeBarColors,
		hoverOptions: IActivityHoverOptions,
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
		@IThemeService themeService: IThemeService,
		@IHoverService hoverService: IHoverService,
		@IConfigurationService configurationService: IConfigurationService,
		@IKeybindingService keybindingService: IKeybindingService,
	) {
		super(action, { icon: true, colors, hasPopup: true, hoverOptions }, () => true, themeService, hoverService, configurationService, keybindingService);
	}

	showMenu(): void {
		this.contextMenuService.showContextMenu({
			getAnchor: () => this.container,
			getActions: () => this.getActions(),
			getCheckedActionsRepresentation: () => 'radio',
		});
	}

	private getActions(): IAction[] {
		return this.getOverflowingComposites().map(composite => {
			const action = this.getCompositeOpenAction(composite.id);
			action.checked = this.getActiveCompositeId() === action.id;

			const badge = this.getBadge(composite.id);
			let suffix: string | number | undefined;
			if (badge instanceof NumberBadge) {
				suffix = badge.number;
			}

			if (suffix) {
				action.label = localize('numberBadge', "{0} ({1})", composite.name, suffix);
			} else {
				action.label = composite.name || '';
			}

			return action;
		});
	}
}

export class CompositeActionViewItem extends CompositeBarActionViewItem {

	constructor(
		options: ICompositeBarActionViewItemOptions,
		compositeActivityAction: CompositeBarAction,
		private readonly toggleCompositePinnedAction: IAction,
		private readonly toggleCompositeBadgeAction: IAction,
		private readonly compositeContextMenuActionsProvider: (compositeId: string) => IAction[],
		private readonly contextMenuActionsProvider: () => IAction[],
		private readonly dndHandler: ICompositeDragAndDrop,
		private readonly compositeBar: ICompositeBar,
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IThemeService themeService: IThemeService,
		@IHoverService hoverService: IHoverService,
		@IConfigurationService configurationService: IConfigurationService,
		@ICommandService private readonly commandService: ICommandService
	) {
		super(
			compositeActivityAction,
			options,
			compositeBar.areBadgesEnabled.bind(compositeBar),
			themeService,
			hoverService,
			configurationService,
			keybindingService
		);
	}

	override render(container: HTMLElement): void {
		super.render(container);

		this.updateChecked();
		this.updateEnabled();

		this._register(addDisposableListener(this.container, EventType.CONTEXT_MENU, e => {
			EventHelper.stop(e, true);

			this.showContextMenu(container);
		}));

		// Allow to drag
		let insertDropBefore: Before2D | undefined = undefined;
		this._register(CompositeDragAndDropObserver.INSTANCE.registerDraggable(this.container, () => { return { type: 'composite', id: this.compositeBarActionItem.id }; }, {
			onDragOver: e => {
				const isValidMove = e.dragAndDropData.getData().id !== this.compositeBarActionItem.id && this.dndHandler.onDragOver(e.dragAndDropData, this.compositeBarActionItem.id, e.eventData);
				toggleDropEffect(e.eventData.dataTransfer, 'move', isValidMove);
				insertDropBefore = this.updateFromDragging(container, isValidMove, e.eventData);
			},
			onDragLeave: e => {
				insertDropBefore = this.updateFromDragging(container, false, e.eventData);
			},
			onDragEnd: e => {
				insertDropBefore = this.updateFromDragging(container, false, e.eventData);
			},
			onDrop: e => {
				EventHelper.stop(e.eventData, true);
				this.dndHandler.drop(e.dragAndDropData, this.compositeBarActionItem.id, e.eventData, insertDropBefore);
				insertDropBefore = this.updateFromDragging(container, false, e.eventData);
			},
			onDragStart: e => {
				if (e.dragAndDropData.getData().id !== this.compositeBarActionItem.id) {
					return;
				}

				if (e.eventData.dataTransfer) {
					e.eventData.dataTransfer.effectAllowed = 'move';
				}

				this.blur(); // Remove focus indicator when dragging
			}
		}));

		// Activate on drag over to reveal targets
		[this.badge, this.label].forEach(element => this._register(new DelayedDragHandler(element, () => {
			if (!this.action.checked) {
				this.action.run();
			}
		})));

		this.updateStyles();
	}

	private updateFromDragging(element: HTMLElement, showFeedback: boolean, event: DragEvent): Before2D | undefined {
		const rect = element.getBoundingClientRect();
		const posX = event.clientX;
		const posY = event.clientY;
		const height = rect.bottom - rect.top;
		const width = rect.right - rect.left;

		const forceTop = posY <= rect.top + height * 0.4;
		const forceBottom = posY > rect.bottom - height * 0.4;
		const preferTop = posY <= rect.top + height * 0.5;

		const forceLeft = posX <= rect.left + width * 0.4;
		const forceRight = posX > rect.right - width * 0.4;
		const preferLeft = posX <= rect.left + width * 0.5;

		const classes = element.classList;
		const lastClasses = {
			vertical: classes.contains('top') ? 'top' : (classes.contains('bottom') ? 'bottom' : undefined),
			horizontal: classes.contains('left') ? 'left' : (classes.contains('right') ? 'right' : undefined)
		};

		const top = forceTop || (preferTop && !lastClasses.vertical) || (!forceBottom && lastClasses.vertical === 'top');
		const bottom = forceBottom || (!preferTop && !lastClasses.vertical) || (!forceTop && lastClasses.vertical === 'bottom');
		const left = forceLeft || (preferLeft && !lastClasses.horizontal) || (!forceRight && lastClasses.horizontal === 'left');
		const right = forceRight || (!preferLeft && !lastClasses.horizontal) || (!forceLeft && lastClasses.horizontal === 'right');

		element.classList.toggle('top', showFeedback && top);
		element.classList.toggle('bottom', showFeedback && bottom);
		element.classList.toggle('left', showFeedback && left);
		element.classList.toggle('right', showFeedback && right);

		if (!showFeedback) {
			return undefined;
		}

		return { verticallyBefore: top, horizontallyBefore: left };
	}

	private showContextMenu(container: HTMLElement): void {
		const actions: IAction[] = [];

		if (this.compositeBarActionItem.keybindingId) {
			actions.push(createConfigureKeybindingAction(this.commandService, this.keybindingService, this.compositeBarActionItem.keybindingId));
		}

		actions.push(this.toggleCompositePinnedAction, this.toggleCompositeBadgeAction);

		const compositeContextMenuActions = this.compositeContextMenuActionsProvider(this.compositeBarActionItem.id);
		if (compositeContextMenuActions.length) {
			actions.push(...compositeContextMenuActions);
		}

		const isPinned = this.compositeBar.isPinned(this.compositeBarActionItem.id);
		if (isPinned) {
			this.toggleCompositePinnedAction.label = localize('hide', "Hide '{0}'", this.compositeBarActionItem.name);
			this.toggleCompositePinnedAction.checked = false;
			this.toggleCompositePinnedAction.enabled = this.compositeBar.getPinnedCompositeIds().length > 1;
		} else {
			this.toggleCompositePinnedAction.label = localize('keep', "Keep '{0}'", this.compositeBarActionItem.name);
			this.toggleCompositePinnedAction.enabled = true;
		}

		const isBadgeEnabled = this.compositeBar.areBadgesEnabled(this.compositeBarActionItem.id);
		if (isBadgeEnabled) {
			this.toggleCompositeBadgeAction.label = localize('hideBadge', "Hide Badge");
		} else {
			this.toggleCompositeBadgeAction.label = localize('showBadge', "Show Badge");
		}

		const otherActions = this.contextMenuActionsProvider();
		if (otherActions.length) {
			actions.push(new Separator());
			actions.push(...otherActions);
		}

		const elementPosition = getDomNodePagePosition(container);
		const anchor = {
			x: Math.floor(elementPosition.left + (elementPosition.width / 2)),
			y: elementPosition.top + elementPosition.height
		};

		this.contextMenuService.showContextMenu({
			getAnchor: () => anchor,
			getActions: () => actions,
			getActionsContext: () => this.compositeBarActionItem.id
		});
	}

	protected override updateChecked(): void {
		if (this.action.checked) {
			this.container.classList.add('checked');
			this.container.setAttribute('aria-label', this.getTooltip() ?? this.container.title);
			this.container.setAttribute('aria-expanded', 'true');
			this.container.setAttribute('aria-selected', 'true');
		} else {
			this.container.classList.remove('checked');
			this.container.setAttribute('aria-label', this.getTooltip() ?? this.container.title);
			this.container.setAttribute('aria-expanded', 'false');
			this.container.setAttribute('aria-selected', 'false');
		}

		this.updateStyles();
	}

	protected override updateEnabled(): void {
		if (!this.element) {
			return;
		}

		if (this.action.enabled) {
			this.element.classList.remove('disabled');
		} else {
			this.element.classList.add('disabled');
		}
	}

	override dispose(): void {
		super.dispose();

		this.label.remove();
	}
}

export class ToggleCompositePinnedAction extends Action {

	constructor(
		private activity: ICompositeBarActionItem | undefined,
		private compositeBar: ICompositeBar
	) {
		super('show.toggleCompositePinned', activity ? activity.name : localize('toggle', "Toggle View Pinned"));

		this.checked = !!this.activity && this.compositeBar.isPinned(this.activity.id);
	}

	override async run(context: string): Promise<void> {
		const id = this.activity ? this.activity.id : context;

		if (this.compositeBar.isPinned(id)) {
			this.compositeBar.unpin(id);
		} else {
			this.compositeBar.pin(id);
		}
	}
}

export class ToggleCompositeBadgeAction extends Action {
	constructor(
		private compositeBarActionItem: ICompositeBarActionItem | undefined,
		private compositeBar: ICompositeBar
	) {
		super('show.toggleCompositeBadge', compositeBarActionItem ? compositeBarActionItem.name : localize('toggleBadge', "Toggle View Badge"));

		this.checked = false;
	}

	override async run(context: string): Promise<void> {
		const id = this.compositeBarActionItem ? this.compositeBarActionItem.id : context;
		this.compositeBar.toggleBadgeEnablement(id);
	}
}

export class SwitchCompositeViewAction extends Action2 {
	constructor(
		desc: Readonly<IAction2Options>,
		private readonly location: ViewContainerLocation,
		private readonly offset: number
	) {
		super(desc);
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const paneCompositeService = accessor.get(IPaneCompositePartService);

		const activeComposite = paneCompositeService.getActivePaneComposite(this.location);
		if (!activeComposite) {
			return;
		}

		let targetCompositeId: string | undefined;

		const visibleCompositeIds = paneCompositeService.getVisiblePaneCompositeIds(this.location);
		for (let i = 0; i < visibleCompositeIds.length; i++) {
			if (visibleCompositeIds[i] === activeComposite.getId()) {
				targetCompositeId = visibleCompositeIds[(i + visibleCompositeIds.length + this.offset) % visibleCompositeIds.length];
				break;
			}
		}

		if (typeof targetCompositeId !== 'undefined') {
			await paneCompositeService.openPaneComposite(targetCompositeId, this.location, true);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/compositePart.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/compositePart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/compositepart.css';
import { localize } from '../../../nls.js';
import { defaultGenerator } from '../../../base/common/idGenerator.js';
import { IDisposable, dispose, DisposableStore, MutableDisposable, } from '../../../base/common/lifecycle.js';
import { Emitter } from '../../../base/common/event.js';
import { isCancellationError } from '../../../base/common/errors.js';
import { ActionsOrientation, IActionViewItem, prepareActions } from '../../../base/browser/ui/actionbar/actionbar.js';
import { ProgressBar } from '../../../base/browser/ui/progressbar/progressbar.js';
import { IAction } from '../../../base/common/actions.js';
import { Part, IPartOptions } from '../part.js';
import { Composite, CompositeRegistry } from '../composite.js';
import { IComposite } from '../../common/composite.js';
import { IWorkbenchLayoutService } from '../../services/layout/browser/layoutService.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../platform/storage/common/storage.js';
import { IContextMenuService } from '../../../platform/contextview/browser/contextView.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';
import { ServiceCollection } from '../../../platform/instantiation/common/serviceCollection.js';
import { IProgressIndicator, IEditorProgressService } from '../../../platform/progress/common/progress.js';
import { IKeybindingService } from '../../../platform/keybinding/common/keybinding.js';
import { IThemeService } from '../../../platform/theme/common/themeService.js';
import { INotificationService } from '../../../platform/notification/common/notification.js';
import { Dimension, append, $, hide, show } from '../../../base/browser/dom.js';
import { AnchorAlignment } from '../../../base/browser/ui/contextview/contextview.js';
import { assertReturnsDefined } from '../../../base/common/types.js';
import { createActionViewItem } from '../../../platform/actions/browser/menuEntryActionViewItem.js';
import { AbstractProgressScope, ScopedProgressIndicator } from '../../services/progress/browser/progressIndicator.js';
import { WorkbenchToolBar } from '../../../platform/actions/browser/toolbar.js';
import { defaultProgressBarStyles } from '../../../platform/theme/browser/defaultStyles.js';
import { IBoundarySashes } from '../../../base/browser/ui/sash/sash.js';
import { IBaseActionViewItemOptions } from '../../../base/browser/ui/actionbar/actionViewItems.js';
import { IHoverDelegate } from '../../../base/browser/ui/hover/hoverDelegate.js';
import { createInstantHoverDelegate, getDefaultHoverDelegate } from '../../../base/browser/ui/hover/hoverDelegateFactory.js';
import type { IHoverService } from '../../../platform/hover/browser/hover.js';

export interface ICompositeTitleLabel {

	/**
	 * Asks to update the title for the composite with the given ID.
	 */
	updateTitle(id: string, title: string, keybinding?: string): void;

	/**
	 * Called when theming information changes.
	 */
	updateStyles(): void;
}

interface CompositeItem {
	readonly composite: Composite;
	readonly disposable: IDisposable;
	readonly progress: IProgressIndicator;
}

export interface ICompositePartOptions extends IPartOptions {
	readonly trailingSeparator?: boolean;
}

export abstract class CompositePart<T extends Composite, MementoType extends object = object> extends Part<MementoType> {

	protected readonly onDidCompositeOpen = this._register(new Emitter<{ composite: IComposite; focus: boolean }>());
	protected readonly onDidCompositeClose = this._register(new Emitter<IComposite>());

	protected toolBar: WorkbenchToolBar | undefined;
	protected titleLabelElement: HTMLElement | undefined;
	protected readonly toolbarHoverDelegate: IHoverDelegate;

	private readonly mapCompositeToCompositeContainer = new Map<string, HTMLElement>();
	private readonly mapActionsBindingToComposite = new Map<string, () => void>();
	private activeComposite: Composite | undefined;
	private lastActiveCompositeId: string;
	private readonly instantiatedCompositeItems = new Map<string, CompositeItem>();
	protected titleLabel: ICompositeTitleLabel | undefined;
	private progressBar: ProgressBar | undefined;
	private contentAreaSize: Dimension | undefined;
	private readonly actionsListener = this._register(new MutableDisposable());
	private currentCompositeOpenToken: string | undefined;
	private boundarySashes: IBoundarySashes | undefined;
	private readonly trailingSeparator: boolean;

	constructor(
		private readonly notificationService: INotificationService,
		protected readonly storageService: IStorageService,
		protected readonly contextMenuService: IContextMenuService,
		layoutService: IWorkbenchLayoutService,
		protected readonly keybindingService: IKeybindingService,
		private readonly hoverService: IHoverService,
		protected readonly instantiationService: IInstantiationService,
		themeService: IThemeService,
		protected readonly registry: CompositeRegistry<T>,
		private readonly activeCompositeSettingsKey: string,
		private readonly defaultCompositeId: string,
		protected readonly nameForTelemetry: string,
		private readonly compositeCSSClass: string,
		private readonly titleForegroundColor: string | undefined,
		private readonly titleBorderColor: string | undefined,
		id: string,
		options: ICompositePartOptions
	) {
		super(id, options, themeService, storageService, layoutService);

		this.lastActiveCompositeId = storageService.get(activeCompositeSettingsKey, StorageScope.WORKSPACE, this.defaultCompositeId);
		this.toolbarHoverDelegate = this._register(createInstantHoverDelegate());
		this.trailingSeparator = options.trailingSeparator ?? false;
	}

	protected openComposite(id: string, focus?: boolean): Composite | undefined {

		// Check if composite already visible and just focus in that case
		if (this.activeComposite?.getId() === id) {
			if (focus) {
				this.activeComposite.focus();
			}

			// Fullfill promise with composite that is being opened
			return this.activeComposite;
		}

		// We cannot open the composite if we have not been created yet
		if (!this.element) {
			return;
		}

		// Open
		return this.doOpenComposite(id, focus);
	}

	private doOpenComposite(id: string, focus: boolean = false): Composite | undefined {

		// Use a generated token to avoid race conditions from long running promises
		const currentCompositeOpenToken = defaultGenerator.nextId();
		this.currentCompositeOpenToken = currentCompositeOpenToken;

		// Hide current
		if (this.activeComposite) {
			this.hideActiveComposite();
		}

		// Update Title
		this.updateTitle(id);

		// Create composite
		const composite = this.createComposite(id, true);

		// Check if another composite opened meanwhile and return in that case
		if ((this.currentCompositeOpenToken !== currentCompositeOpenToken) || (this.activeComposite && this.activeComposite.getId() !== composite.getId())) {
			return undefined;
		}

		// Check if composite already visible and just focus in that case
		if (this.activeComposite?.getId() === composite.getId()) {
			if (focus) {
				composite.focus();
			}

			this.onDidCompositeOpen.fire({ composite, focus });
			return composite;
		}

		// Show Composite and Focus
		this.showComposite(composite);
		if (focus) {
			composite.focus();
		}

		// Return with the composite that is being opened
		if (composite) {
			this.onDidCompositeOpen.fire({ composite, focus });
		}

		return composite;
	}

	protected createComposite(id: string, isActive?: boolean): Composite {

		// Check if composite is already created
		const compositeItem = this.instantiatedCompositeItems.get(id);
		if (compositeItem) {
			return compositeItem.composite;
		}

		// Instantiate composite from registry otherwise
		const compositeDescriptor = this.registry.getComposite(id);
		if (compositeDescriptor) {
			const that = this;
			const compositeProgressIndicator = new ScopedProgressIndicator(assertReturnsDefined(this.progressBar), this._register(new class extends AbstractProgressScope {
				constructor() {
					super(compositeDescriptor!.id, !!isActive);
					this._register(that.onDidCompositeOpen.event(e => this.onScopeOpened(e.composite.getId())));
					this._register(that.onDidCompositeClose.event(e => this.onScopeClosed(e.getId())));
				}
			}()));
			const compositeInstantiationService = this._register(this.instantiationService.createChild(new ServiceCollection(
				[IEditorProgressService, compositeProgressIndicator] // provide the editor progress service for any editors instantiated within the composite
			)));

			const composite = compositeDescriptor.instantiate(compositeInstantiationService);
			const disposable = new DisposableStore();

			// Remember as Instantiated
			this.instantiatedCompositeItems.set(id, { composite, disposable, progress: compositeProgressIndicator });

			// Register to title area update events from the composite
			disposable.add(composite.onTitleAreaUpdate(() => this.onTitleAreaUpdate(composite.getId()), this));
			disposable.add(compositeInstantiationService);

			return composite;
		}

		throw new Error(`Unable to find composite with id ${id}`);
	}

	protected showComposite(composite: Composite): void {

		// Remember Composite
		this.activeComposite = composite;

		// Store in preferences
		const id = this.activeComposite.getId();
		if (id !== this.defaultCompositeId) {
			this.storageService.store(this.activeCompositeSettingsKey, id, StorageScope.WORKSPACE, StorageTarget.MACHINE);
		} else {
			this.storageService.remove(this.activeCompositeSettingsKey, StorageScope.WORKSPACE);
		}

		// Remember
		this.lastActiveCompositeId = this.activeComposite.getId();

		// Composites created for the first time
		let compositeContainer = this.mapCompositeToCompositeContainer.get(composite.getId());
		if (!compositeContainer) {

			// Build Container off-DOM
			compositeContainer = $('.composite');
			compositeContainer.classList.add(...this.compositeCSSClass.split(' '));
			compositeContainer.id = composite.getId();

			composite.create(compositeContainer);
			composite.updateStyles();

			// Remember composite container
			this.mapCompositeToCompositeContainer.set(composite.getId(), compositeContainer);
		}

		// Fill Content and Actions
		// Make sure that the user meanwhile did not open another composite or closed the part containing the composite
		if (!this.activeComposite || composite.getId() !== this.activeComposite.getId()) {
			return undefined;
		}

		// Take Composite on-DOM and show
		this.contentArea?.appendChild(compositeContainer);
		show(compositeContainer);

		// Setup action runner
		const toolBar = assertReturnsDefined(this.toolBar);
		toolBar.actionRunner = composite.getActionRunner();

		// Update title with composite title if it differs from descriptor
		const descriptor = this.registry.getComposite(composite.getId());
		if (descriptor && descriptor.name !== composite.getTitle()) {
			this.updateTitle(composite.getId(), composite.getTitle());
		}

		// Handle Composite Actions
		let actionsBinding = this.mapActionsBindingToComposite.get(composite.getId());
		if (!actionsBinding) {
			actionsBinding = this.collectCompositeActions(composite);
			this.mapActionsBindingToComposite.set(composite.getId(), actionsBinding);
		}
		actionsBinding();

		// Action Run Handling
		this.actionsListener.value = toolBar.actionRunner.onDidRun(e => {

			// Check for Error
			if (e.error && !isCancellationError(e.error)) {
				this.notificationService.error(e.error);
			}
		});

		// Indicate to composite that it is now visible
		composite.setVisible(true);

		// Make sure that the user meanwhile did not open another composite or closed the part containing the composite
		if (!this.activeComposite || composite.getId() !== this.activeComposite.getId()) {
			return;
		}

		// Make sure the composite is layed out
		if (this.contentAreaSize) {
			composite.layout(this.contentAreaSize);
		}

		// Make sure boundary sashes are propagated
		if (this.boundarySashes) {
			composite.setBoundarySashes(this.boundarySashes);
		}
	}

	protected onTitleAreaUpdate(compositeId: string): void {

		// Title
		const composite = this.instantiatedCompositeItems.get(compositeId);
		if (composite) {
			this.updateTitle(compositeId, composite.composite.getTitle());
		}

		// Active Composite
		if (this.activeComposite?.getId() === compositeId) {
			// Actions
			const actionsBinding = this.collectCompositeActions(this.activeComposite);
			this.mapActionsBindingToComposite.set(this.activeComposite.getId(), actionsBinding);
			actionsBinding();
		}

		// Otherwise invalidate actions binding for next time when the composite becomes visible
		else {
			this.mapActionsBindingToComposite.delete(compositeId);
		}
	}

	private updateTitle(compositeId: string, compositeTitle?: string): void {
		const compositeDescriptor = this.registry.getComposite(compositeId);
		if (!compositeDescriptor || !this.titleLabel) {
			return;
		}

		if (!compositeTitle) {
			compositeTitle = compositeDescriptor.name;
		}

		const keybinding = this.keybindingService.lookupKeybinding(compositeId);

		this.titleLabel.updateTitle(compositeId, compositeTitle, keybinding?.getLabel() ?? undefined);

		const toolBar = assertReturnsDefined(this.toolBar);
		toolBar.setAriaLabel(localize('ariaCompositeToolbarLabel', "{0} actions", compositeTitle));
	}

	private collectCompositeActions(composite?: Composite): () => void {

		// From Composite
		const menuIds = composite?.getMenuIds();
		const primaryActions: IAction[] = composite?.getActions().slice(0) || [];
		const secondaryActions: IAction[] = composite?.getSecondaryActions().slice(0) || [];

		// Update context
		const toolBar = assertReturnsDefined(this.toolBar);
		toolBar.context = this.actionsContextProvider();

		// Return fn to set into toolbar
		return () => {
			toolBar.setActions(prepareActions(primaryActions), prepareActions(secondaryActions), menuIds);
			this.titleArea?.classList.toggle('has-actions', primaryActions.length > 0 || secondaryActions.length > 0);
		};
	}

	protected getActiveComposite(): IComposite | undefined {
		return this.activeComposite;
	}

	protected getLastActiveCompositeId(): string {
		return this.lastActiveCompositeId;
	}

	protected hideActiveComposite(): Composite | undefined {
		if (!this.activeComposite) {
			return undefined; // Nothing to do
		}

		const composite = this.activeComposite;
		this.activeComposite = undefined;

		const compositeContainer = this.mapCompositeToCompositeContainer.get(composite.getId());

		// Indicate to Composite
		composite.setVisible(false);

		// Take Container Off-DOM and hide
		if (compositeContainer) {
			compositeContainer.remove();
			hide(compositeContainer);
		}

		// Clear any running Progress
		this.progressBar?.stop().hide();

		// Empty Actions
		if (this.toolBar) {
			this.collectCompositeActions()();
		}
		this.onDidCompositeClose.fire(composite);

		return composite;
	}

	protected override createTitleArea(parent: HTMLElement): HTMLElement {

		// Title Area Container
		const titleArea = append(parent, $('.composite'));
		titleArea.classList.add('title');

		// Left Title Label
		this.titleLabel = this.createTitleLabel(titleArea);

		// Right Actions Container
		const titleActionsContainer = append(titleArea, $('.title-actions'));

		// Toolbar
		this.toolBar = this._register(this.instantiationService.createInstance(WorkbenchToolBar, titleActionsContainer, {
			actionViewItemProvider: (action, options) => this.actionViewItemProvider(action, options),
			orientation: ActionsOrientation.HORIZONTAL,
			getKeyBinding: action => this.keybindingService.lookupKeybinding(action.id),
			anchorAlignmentProvider: () => this.getTitleAreaDropDownAnchorAlignment(),
			toggleMenuTitle: localize('viewsAndMoreActions', "Views and More Actions..."),
			telemetrySource: this.nameForTelemetry,
			hoverDelegate: this.toolbarHoverDelegate,
			trailingSeparator: this.trailingSeparator,
		}));

		this.collectCompositeActions()();

		return titleArea;
	}

	protected createTitleLabel(parent: HTMLElement): ICompositeTitleLabel {
		const titleContainer = append(parent, $('.title-label'));
		const titleLabel = append(titleContainer, $('h2'));
		this.titleLabelElement = titleLabel;
		const hover = this._register(this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), titleLabel, ''));

		const $this = this;
		return {
			updateTitle: (id, title, keybinding) => {
				// The title label is shared for all composites in the base CompositePart
				if (!this.activeComposite || this.activeComposite.getId() === id) {
					titleLabel.textContent = title;
					hover.update(keybinding ? localize('titleTooltip', "{0} ({1})", title, keybinding) : title);
				}
			},

			updateStyles: () => {
				titleLabel.style.color = $this.titleForegroundColor ? $this.getColor($this.titleForegroundColor) || '' : '';
				const borderColor = $this.titleBorderColor ? $this.getColor($this.titleBorderColor) : undefined;
				parent.style.borderBottom = borderColor ? `1px solid ${borderColor}` : '';
			}
		};
	}

	protected createHeaderArea(): HTMLElement {
		return $('.composite');
	}

	protected createFooterArea(): HTMLElement {
		return $('.composite');
	}

	override updateStyles(): void {
		super.updateStyles();

		// Forward to title label
		const titleLabel = assertReturnsDefined(this.titleLabel);
		titleLabel.updateStyles();
	}

	protected actionViewItemProvider(action: IAction, options: IBaseActionViewItemOptions): IActionViewItem | undefined {

		// Check Active Composite
		if (this.activeComposite) {
			return this.activeComposite.getActionViewItem(action, options);
		}

		return createActionViewItem(this.instantiationService, action, options);
	}

	protected actionsContextProvider(): unknown {

		// Check Active Composite
		if (this.activeComposite) {
			return this.activeComposite.getActionsContext();
		}

		return null;
	}

	protected override createContentArea(parent: HTMLElement): HTMLElement {
		const contentContainer = append(parent, $('.content'));

		this.progressBar = this._register(new ProgressBar(contentContainer, defaultProgressBarStyles));
		this.progressBar.hide();

		return contentContainer;
	}

	getProgressIndicator(id: string): IProgressIndicator | undefined {
		const compositeItem = this.instantiatedCompositeItems.get(id);

		return compositeItem ? compositeItem.progress : undefined;
	}

	protected getTitleAreaDropDownAnchorAlignment(): AnchorAlignment {
		return AnchorAlignment.RIGHT;
	}

	override layout(width: number, height: number, top: number, left: number): void {
		super.layout(width, height, top, left);

		// Layout contents
		this.contentAreaSize = Dimension.lift(super.layoutContents(width, height).contentSize);

		// Layout composite
		this.activeComposite?.layout(this.contentAreaSize);
	}

	setBoundarySashes?(sashes: IBoundarySashes): void {
		this.boundarySashes = sashes;
		this.activeComposite?.setBoundarySashes(sashes);
	}

	protected removeComposite(compositeId: string): boolean {
		if (this.activeComposite?.getId() === compositeId) {
			return false; // do not remove active composite
		}

		this.mapCompositeToCompositeContainer.delete(compositeId);
		this.mapActionsBindingToComposite.delete(compositeId);
		const compositeItem = this.instantiatedCompositeItems.get(compositeId);
		if (compositeItem) {
			compositeItem.composite.dispose();
			dispose(compositeItem.disposable);
			this.instantiatedCompositeItems.delete(compositeId);
		}

		return true;
	}

	override dispose(): void {
		this.mapCompositeToCompositeContainer.clear();
		this.mapActionsBindingToComposite.clear();

		this.instantiatedCompositeItems.forEach(compositeItem => {
			compositeItem.composite.dispose();
			dispose(compositeItem.disposable);
		});

		this.instantiatedCompositeItems.clear();

		super.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/globalCompositeBar.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/globalCompositeBar.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../nls.js';
import { ActionBar, ActionsOrientation } from '../../../base/browser/ui/actionbar/actionbar.js';
import { ACCOUNTS_ACTIVITY_ID, GLOBAL_ACTIVITY_ID } from '../../common/activity.js';
import { IActivityService } from '../../services/activity/common/activity.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';
import { DisposableStore, Disposable } from '../../../base/common/lifecycle.js';
import { IColorTheme, IThemeService } from '../../../platform/theme/common/themeService.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../platform/storage/common/storage.js';
import { IExtensionService } from '../../services/extensions/common/extensions.js';
import { CompositeBarActionViewItem, CompositeBarAction, IActivityHoverOptions, ICompositeBarActionViewItemOptions, ICompositeBarColors } from './compositeBarActions.js';
import { Codicon } from '../../../base/common/codicons.js';
import { ThemeIcon } from '../../../base/common/themables.js';
import { registerIcon } from '../../../platform/theme/common/iconRegistry.js';
import { Action, IAction, Separator, SubmenuAction, toAction } from '../../../base/common/actions.js';
import { IMenu, IMenuService, MenuId } from '../../../platform/actions/common/actions.js';
import { addDisposableListener, EventType, append, clearNode, hide, show, EventHelper, $, runWhenWindowIdle, getWindow } from '../../../base/browser/dom.js';
import { StandardKeyboardEvent } from '../../../base/browser/keyboardEvent.js';
import { StandardMouseEvent } from '../../../base/browser/mouseEvent.js';
import { EventType as TouchEventType, GestureEvent } from '../../../base/browser/touch.js';
import { AnchorAlignment, AnchorAxisAlignment } from '../../../base/browser/ui/contextview/contextview.js';
import { Lazy } from '../../../base/common/lazy.js';
import { getActionBarActions } from '../../../platform/actions/browser/menuEntryActionViewItem.js';
import { IConfigurationService } from '../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../platform/contextview/browser/contextView.js';
import { IKeybindingService } from '../../../platform/keybinding/common/keybinding.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { IProductService } from '../../../platform/product/common/productService.js';
import { ISecretStorageService } from '../../../platform/secrets/common/secrets.js';
import { AuthenticationSessionInfo, getCurrentAuthenticationSessionInfo } from '../../services/authentication/browser/authenticationService.js';
import { AuthenticationSessionAccount, IAuthenticationService, INTERNAL_AUTH_PROVIDER_PREFIX } from '../../services/authentication/common/authentication.js';
import { IWorkbenchEnvironmentService } from '../../services/environment/common/environmentService.js';
import { IHoverService } from '../../../platform/hover/browser/hover.js';
import { ILifecycleService, LifecyclePhase } from '../../services/lifecycle/common/lifecycle.js';
import { IUserDataProfileService } from '../../services/userDataProfile/common/userDataProfile.js';
import { DEFAULT_ICON } from '../../services/userDataProfile/common/userDataProfileIcons.js';
import { isString } from '../../../base/common/types.js';
import { KeyCode } from '../../../base/common/keyCodes.js';
import { ACTIVITY_BAR_BADGE_BACKGROUND, ACTIVITY_BAR_BADGE_FOREGROUND } from '../../common/theme.js';
import { IBaseActionViewItemOptions } from '../../../base/browser/ui/actionbar/actionViewItems.js';
import { ICommandService } from '../../../platform/commands/common/commands.js';

export class GlobalCompositeBar extends Disposable {

	private static readonly ACCOUNTS_ACTION_INDEX = 0;
	static readonly ACCOUNTS_ICON = registerIcon('accounts-view-bar-icon', Codicon.account, localize('accountsViewBarIcon', "Accounts icon in the view bar."));

	readonly element: HTMLElement;

	private readonly globalActivityAction = this._register(new Action(GLOBAL_ACTIVITY_ID));
	private readonly accountAction = this._register(new Action(ACCOUNTS_ACTIVITY_ID));
	private readonly globalActivityActionBar: ActionBar;

	constructor(
		private readonly contextMenuActionsProvider: () => IAction[],
		private readonly colors: (theme: IColorTheme) => ICompositeBarColors,
		private readonly activityHoverOptions: IActivityHoverOptions,
		@IConfigurationService configurationService: IConfigurationService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IStorageService private readonly storageService: IStorageService,
		@IExtensionService private readonly extensionService: IExtensionService,
	) {
		super();

		this.element = $('div');
		const contextMenuAlignmentOptions = () => ({
			anchorAlignment: configurationService.getValue('workbench.sideBar.location') === 'left' ? AnchorAlignment.RIGHT : AnchorAlignment.LEFT,
			anchorAxisAlignment: AnchorAxisAlignment.HORIZONTAL
		});
		this.globalActivityActionBar = this._register(new ActionBar(this.element, {
			actionViewItemProvider: (action, options) => {
				if (action.id === GLOBAL_ACTIVITY_ID) {
					return this.instantiationService.createInstance(GlobalActivityActionViewItem, this.contextMenuActionsProvider, { ...options, colors: this.colors, hoverOptions: this.activityHoverOptions }, contextMenuAlignmentOptions);
				}

				if (action.id === ACCOUNTS_ACTIVITY_ID) {
					return this.instantiationService.createInstance(AccountsActivityActionViewItem,
						this.contextMenuActionsProvider,
						{
							...options,
							colors: this.colors,
							hoverOptions: this.activityHoverOptions
						},
						contextMenuAlignmentOptions,
						(actions: IAction[]) => {
							actions.unshift(...[
								toAction({ id: 'hideAccounts', label: localize('hideAccounts', "Hide Accounts"), run: () => setAccountsActionVisible(storageService, false) }),
								new Separator()
							]);
						});
				}

				throw new Error(`No view item for action '${action.id}'`);
			},
			orientation: ActionsOrientation.VERTICAL,
			ariaLabel: localize('manage', "Manage"),
			preventLoopNavigation: true
		}));

		if (this.accountsVisibilityPreference) {
			this.globalActivityActionBar.push(this.accountAction, { index: GlobalCompositeBar.ACCOUNTS_ACTION_INDEX });
		}

		this.globalActivityActionBar.push(this.globalActivityAction);

		this.registerListeners();
	}

	private registerListeners(): void {
		this.extensionService.whenInstalledExtensionsRegistered().then(() => {
			if (!this._store.isDisposed) {
				this._register(this.storageService.onDidChangeValue(StorageScope.PROFILE, AccountsActivityActionViewItem.ACCOUNTS_VISIBILITY_PREFERENCE_KEY, this._store)(() => this.toggleAccountsActivity()));
			}
		});
	}

	create(parent: HTMLElement): void {
		parent.appendChild(this.element);
	}

	focus(): void {
		this.globalActivityActionBar.focus(true);
	}

	size(): number {
		return this.globalActivityActionBar.viewItems.length;
	}

	getContextMenuActions(): IAction[] {
		return [toAction({ id: 'toggleAccountsVisibility', label: localize('accounts', "Accounts"), checked: this.accountsVisibilityPreference, run: () => this.accountsVisibilityPreference = !this.accountsVisibilityPreference })];
	}

	private toggleAccountsActivity() {
		if (this.globalActivityActionBar.length() === 2 && this.accountsVisibilityPreference) {
			return;
		}
		if (this.globalActivityActionBar.length() === 2) {
			this.globalActivityActionBar.pull(GlobalCompositeBar.ACCOUNTS_ACTION_INDEX);
		} else {
			this.globalActivityActionBar.push(this.accountAction, { index: GlobalCompositeBar.ACCOUNTS_ACTION_INDEX });
		}
	}

	private get accountsVisibilityPreference(): boolean {
		return isAccountsActionVisible(this.storageService);
	}

	private set accountsVisibilityPreference(value: boolean) {
		setAccountsActionVisible(this.storageService, value);
	}
}

abstract class AbstractGlobalActivityActionViewItem extends CompositeBarActionViewItem {

	constructor(
		private readonly menuId: MenuId,
		action: CompositeBarAction,
		options: ICompositeBarActionViewItemOptions,
		private readonly contextMenuActionsProvider: () => IAction[],
		private readonly contextMenuAlignmentOptions: () => Readonly<{ anchorAlignment: AnchorAlignment; anchorAxisAlignment: AnchorAxisAlignment }> | undefined,
		@IThemeService themeService: IThemeService,
		@IHoverService hoverService: IHoverService,
		@IMenuService private readonly menuService: IMenuService,
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IConfigurationService configurationService: IConfigurationService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IActivityService private readonly activityService: IActivityService,
	) {
		super(action, { draggable: false, icon: true, hasPopup: true, ...options }, () => true, themeService, hoverService, configurationService, keybindingService);

		this.updateItemActivity();
		this._register(this.activityService.onDidChangeActivity(viewContainerOrAction => {
			if (isString(viewContainerOrAction) && viewContainerOrAction === this.compositeBarActionItem.id) {
				this.updateItemActivity();
			}
		}));
	}

	private updateItemActivity(): void {
		(this.action as CompositeBarAction).activities = this.activityService.getActivity(this.compositeBarActionItem.id);
	}

	override render(container: HTMLElement): void {
		super.render(container);

		this._register(addDisposableListener(this.container, EventType.MOUSE_DOWN, async (e: MouseEvent) => {
			EventHelper.stop(e, true);
			const isLeftClick = e?.button !== 2;
			// Left-click run
			if (isLeftClick) {
				this.run();
			}
		}));

		// The rest of the activity bar uses context menu event for the context menu, so we match this
		this._register(addDisposableListener(this.container, EventType.CONTEXT_MENU, async (e: MouseEvent) => {
			// Let the item decide on the context menu instead of the toolbar
			e.stopPropagation();

			const disposables = new DisposableStore();
			const actions = await this.resolveContextMenuActions(disposables);

			const event = new StandardMouseEvent(getWindow(this.container), e);

			this.contextMenuService.showContextMenu({
				getAnchor: () => event,
				getActions: () => actions,
				onHide: () => disposables.dispose()
			});
		}));

		this._register(addDisposableListener(this.container, EventType.KEY_UP, (e: KeyboardEvent) => {
			const event = new StandardKeyboardEvent(e);
			if (event.equals(KeyCode.Enter) || event.equals(KeyCode.Space)) {
				EventHelper.stop(e, true);
				this.run();
			}
		}));

		this._register(addDisposableListener(this.container, TouchEventType.Tap, (e: GestureEvent) => {
			EventHelper.stop(e, true);
			this.run();
		}));
	}

	protected async resolveContextMenuActions(disposables: DisposableStore): Promise<IAction[]> {
		return this.contextMenuActionsProvider();
	}

	private async run(): Promise<void> {
		const disposables = new DisposableStore();
		const menu = disposables.add(this.menuService.createMenu(this.menuId, this.contextKeyService));
		const actions = await this.resolveMainMenuActions(menu, disposables);
		const { anchorAlignment, anchorAxisAlignment } = this.contextMenuAlignmentOptions() ?? { anchorAlignment: undefined, anchorAxisAlignment: undefined };

		this.contextMenuService.showContextMenu({
			getAnchor: () => this.label,
			anchorAlignment,
			anchorAxisAlignment,
			getActions: () => actions,
			onHide: () => disposables.dispose(),
			menuActionOptions: { renderShortTitle: true },
		});

	}

	protected async resolveMainMenuActions(menu: IMenu, _disposable: DisposableStore): Promise<IAction[]> {
		return getActionBarActions(menu.getActions({ renderShortTitle: true })).secondary;
	}
}

export class AccountsActivityActionViewItem extends AbstractGlobalActivityActionViewItem {

	static readonly ACCOUNTS_VISIBILITY_PREFERENCE_KEY = 'workbench.activity.showAccounts';

	private readonly groupedAccounts: Map<string, (AuthenticationSessionAccount & { canSignOut: boolean })[]> = new Map();
	private readonly problematicProviders: Set<string> = new Set();

	private initialized = false;
	private sessionFromEmbedder = new Lazy<Promise<AuthenticationSessionInfo | undefined>>(() => getCurrentAuthenticationSessionInfo(this.secretStorageService, this.productService));

	constructor(
		contextMenuActionsProvider: () => IAction[],
		options: ICompositeBarActionViewItemOptions,
		contextMenuAlignmentOptions: () => Readonly<{ anchorAlignment: AnchorAlignment; anchorAxisAlignment: AnchorAxisAlignment }> | undefined,
		private readonly fillContextMenuActions: (actions: IAction[]) => void,
		@IThemeService themeService: IThemeService,
		@ILifecycleService private readonly lifecycleService: ILifecycleService,
		@IHoverService hoverService: IHoverService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IMenuService menuService: IMenuService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IAuthenticationService private readonly authenticationService: IAuthenticationService,
		@IWorkbenchEnvironmentService environmentService: IWorkbenchEnvironmentService,
		@IProductService private readonly productService: IProductService,
		@IConfigurationService configurationService: IConfigurationService,
		@IKeybindingService keybindingService: IKeybindingService,
		@ISecretStorageService private readonly secretStorageService: ISecretStorageService,
		@ILogService private readonly logService: ILogService,
		@IActivityService activityService: IActivityService,
		@IInstantiationService instantiationService: IInstantiationService,
		@ICommandService private readonly commandService: ICommandService
	) {
		const action = instantiationService.createInstance(CompositeBarAction, {
			id: ACCOUNTS_ACTIVITY_ID,
			name: localize('accounts', "Accounts"),
			classNames: ThemeIcon.asClassNameArray(GlobalCompositeBar.ACCOUNTS_ICON)
		});
		super(MenuId.AccountsContext, action, options, contextMenuActionsProvider, contextMenuAlignmentOptions, themeService, hoverService, menuService, contextMenuService, contextKeyService, configurationService, keybindingService, activityService);
		this._register(action);
		this.registerListeners();
		this.initialize();
	}

	private registerListeners(): void {
		this._register(this.authenticationService.onDidRegisterAuthenticationProvider(async (e) => {
			await this.addAccountsFromProvider(e.id);
		}));

		this._register(this.authenticationService.onDidUnregisterAuthenticationProvider((e) => {
			this.groupedAccounts.delete(e.id);
			this.problematicProviders.delete(e.id);
		}));

		this._register(this.authenticationService.onDidChangeSessions(async e => {
			if (e.event.removed) {
				for (const removed of e.event.removed) {
					this.removeAccount(e.providerId, removed.account);
				}
			}
			for (const changed of [...(e.event.changed ?? []), ...(e.event.added ?? [])]) {
				try {
					await this.addOrUpdateAccount(e.providerId, changed.account);
				} catch (e) {
					this.logService.error(e);
				}
			}
		}));
	}

	// This function exists to ensure that the accounts are added for auth providers that had already been registered
	// before the menu was created.
	private async initialize(): Promise<void> {
		// Resolving the menu doesn't need to happen immediately, so we can wait until after the workbench has been restored
		// and only run this when the system is idle.
		await this.lifecycleService.when(LifecyclePhase.Restored);
		if (this._store.isDisposed) {
			return;
		}
		const disposable = this._register(runWhenWindowIdle(getWindow(this.element), async () => {
			await this.doInitialize();
			disposable.dispose();
		}));
	}

	private async doInitialize(): Promise<void> {
		const providerIds = this.authenticationService.getProviderIds();
		const results = await Promise.allSettled(providerIds.map(providerId => this.addAccountsFromProvider(providerId)));

		// Log any errors that occurred while initializing. We try to be best effort here to show the most amount of accounts
		for (const result of results) {
			if (result.status === 'rejected') {
				this.logService.error(result.reason);
			}
		}

		this.initialized = true;
	}

	//#region overrides

	protected override async resolveMainMenuActions(accountsMenu: IMenu, disposables: DisposableStore): Promise<IAction[]> {
		await super.resolveMainMenuActions(accountsMenu, disposables);

		const providers = this.authenticationService.getProviderIds().filter(p => !p.startsWith(INTERNAL_AUTH_PROVIDER_PREFIX));
		const otherCommands = accountsMenu.getActions();
		let menus: IAction[] = [];

		const registeredProviders = providers.filter(providerId => !this.authenticationService.isDynamicAuthenticationProvider(providerId));
		const dynamicProviders = providers.filter(providerId => this.authenticationService.isDynamicAuthenticationProvider(providerId));

		if (!this.initialized) {
			const noAccountsAvailableAction = disposables.add(new Action('noAccountsAvailable', localize('loading', "Loading..."), undefined, false));
			menus.push(noAccountsAvailableAction);
		} else {
			for (const providerId of registeredProviders) {
				const provider = this.authenticationService.getProvider(providerId);
				const accounts = this.groupedAccounts.get(providerId);
				if (!accounts) {
					if (this.problematicProviders.has(providerId)) {
						const providerUnavailableAction = disposables.add(new Action('providerUnavailable', localize('authProviderUnavailable', '{0} is currently unavailable', provider.label), undefined, false));
						menus.push(providerUnavailableAction);
						// try again in the background so that if the failure was intermittent, we can resolve it on the next showing of the menu
						try {
							await this.addAccountsFromProvider(providerId);
						} catch (e) {
							this.logService.error(e);
						}
					}
					continue;
				}

				const canUseMcp = !!provider.authorizationServers?.length;
				for (const account of accounts) {
					const manageExtensionsAction = toAction({
						id: `configureSessions${account.label}`,
						label: localize('manageTrustedExtensions', "Manage Trusted Extensions"),
						enabled: true,
						run: () => this.commandService.executeCommand('_manageTrustedExtensionsForAccount', { providerId, accountLabel: account.label })
					});


					const providerSubMenuActions: IAction[] = [manageExtensionsAction];
					if (canUseMcp) {
						const manageMCPAction = toAction({
							id: `configureSessions${account.label}`,
							label: localize('manageTrustedMCPServers', "Manage Trusted MCP Servers"),
							enabled: true,
							run: () => this.commandService.executeCommand('_manageTrustedMCPServersForAccount', { providerId, accountLabel: account.label })
						});
						providerSubMenuActions.push(manageMCPAction);
					}
					if (account.canSignOut) {
						providerSubMenuActions.push(toAction({
							id: 'signOut',
							label: localize('signOut', "Sign Out"),
							enabled: true,
							run: () => this.commandService.executeCommand('_signOutOfAccount', { providerId, accountLabel: account.label })
						}));
					}

					const providerSubMenu = new SubmenuAction('activitybar.submenu', `${account.label} (${provider.label})`, providerSubMenuActions);
					menus.push(providerSubMenu);
				}
			}

			if (dynamicProviders.length && registeredProviders.length) {
				menus.push(new Separator());
			}

			for (const providerId of dynamicProviders) {
				const provider = this.authenticationService.getProvider(providerId);
				const accounts = this.groupedAccounts.get(providerId);
				// Provide _some_ discoverable way to manage dynamic authentication providers.
				// This will either show up inside the account submenu or as a top-level menu item if there
				// are no accounts.
				const manageDynamicAuthProvidersAction = toAction({
					id: 'manageDynamicAuthProviders',
					label: localize('manageDynamicAuthProviders', "Manage Dynamic Authentication Providers..."),
					enabled: true,
					run: () => this.commandService.executeCommand('workbench.action.removeDynamicAuthenticationProviders')
				});
				if (!accounts) {
					if (this.problematicProviders.has(providerId)) {
						const providerUnavailableAction = disposables.add(new Action('providerUnavailable', localize('authProviderUnavailable', '{0} is currently unavailable', provider.label), undefined, false));
						menus.push(providerUnavailableAction);
						// try again in the background so that if the failure was intermittent, we can resolve it on the next showing of the menu
						try {
							await this.addAccountsFromProvider(providerId);
						} catch (e) {
							this.logService.error(e);
						}
					}
					menus.push(manageDynamicAuthProvidersAction);
					continue;
				}

				for (const account of accounts) {
					// TODO@TylerLeonhardt: Is there a nice way to bring this back?
					// const manageExtensionsAction = toAction({
					// 	id: `configureSessions${account.label}`,
					// 	label: localize('manageTrustedExtensions', "Manage Trusted Extensions"),
					// 	enabled: true,
					// 	run: () => this.commandService.executeCommand('_manageTrustedExtensionsForAccount', { providerId, accountLabel: account.label })
					// });

					const providerSubMenuActions: IAction[] = [];
					const manageMCPAction = toAction({
						id: `configureSessions${account.label}`,
						label: localize('manageTrustedMCPServers', "Manage Trusted MCP Servers"),
						enabled: true,
						run: () => this.commandService.executeCommand('_manageTrustedMCPServersForAccount', { providerId, accountLabel: account.label })
					});
					providerSubMenuActions.push(manageMCPAction);
					providerSubMenuActions.push(manageDynamicAuthProvidersAction);
					if (account.canSignOut) {
						providerSubMenuActions.push(toAction({
							id: 'signOut',
							label: localize('signOut', "Sign Out"),
							enabled: true,
							run: () => this.commandService.executeCommand('_signOutOfAccount', { providerId, accountLabel: account.label })
						}));
					}

					const providerSubMenu = new SubmenuAction('activitybar.submenu', `${account.label} (${provider.label})`, providerSubMenuActions);
					menus.push(providerSubMenu);
				}
			}
		}

		if (menus.length && otherCommands.length) {
			menus.push(new Separator());
		}

		otherCommands.forEach((group, i) => {
			const actions = group[1];
			menus = menus.concat(actions);
			if (i !== otherCommands.length - 1) {
				menus.push(new Separator());
			}
		});

		return menus;
	}

	protected override async resolveContextMenuActions(disposables: DisposableStore): Promise<IAction[]> {
		const actions = await super.resolveContextMenuActions(disposables);
		this.fillContextMenuActions(actions);
		return actions;
	}

	//#endregion

	//#region groupedAccounts helpers

	private async addOrUpdateAccount(providerId: string, account: AuthenticationSessionAccount): Promise<void> {
		let accounts = this.groupedAccounts.get(providerId);
		if (!accounts) {
			accounts = [];
			this.groupedAccounts.set(providerId, accounts);
		}

		const sessionFromEmbedder = await this.sessionFromEmbedder.value;
		let canSignOut = true;
		if (
			sessionFromEmbedder												// if we have a session from the embedder
			&& !sessionFromEmbedder.canSignOut								// and that session says we can't sign out
			&& (await this.authenticationService.getSessions(providerId))	// and that session is associated with the account we are adding/updating
				.some(s =>
					s.id === sessionFromEmbedder.id
					&& s.account.id === account.id
				)
		) {
			canSignOut = false;
		}

		const existingAccount = accounts.find(a => a.label === account.label);
		if (existingAccount) {
			// if we have an existing account and we discover that we
			// can't sign out of it, update the account to mark it as "can't sign out"
			if (!canSignOut) {
				existingAccount.canSignOut = canSignOut;
			}
		} else {
			accounts.push({ ...account, canSignOut });
		}
	}

	private removeAccount(providerId: string, account: AuthenticationSessionAccount): void {
		const accounts = this.groupedAccounts.get(providerId);
		if (!accounts) {
			return;
		}

		const index = accounts.findIndex(a => a.id === account.id);
		if (index === -1) {
			return;
		}

		accounts.splice(index, 1);
		if (accounts.length === 0) {
			this.groupedAccounts.delete(providerId);
		}
	}

	private async addAccountsFromProvider(providerId: string): Promise<void> {
		try {
			const sessions = await this.authenticationService.getSessions(providerId);
			this.problematicProviders.delete(providerId);

			for (const session of sessions) {
				try {
					await this.addOrUpdateAccount(providerId, session.account);
				} catch (e) {
					this.logService.error(e);
				}
			}
		} catch (e) {
			this.logService.error(e);
			this.problematicProviders.add(providerId);
		}
	}

	//#endregion
}

export class GlobalActivityActionViewItem extends AbstractGlobalActivityActionViewItem {

	private profileBadge: HTMLElement | undefined;
	private profileBadgeContent: HTMLElement | undefined;

	constructor(
		contextMenuActionsProvider: () => IAction[],
		options: ICompositeBarActionViewItemOptions,
		contextMenuAlignmentOptions: () => Readonly<{ anchorAlignment: AnchorAlignment; anchorAxisAlignment: AnchorAxisAlignment }> | undefined,
		@IUserDataProfileService private readonly userDataProfileService: IUserDataProfileService,
		@IThemeService themeService: IThemeService,
		@IHoverService hoverService: IHoverService,
		@IMenuService menuService: IMenuService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IConfigurationService configurationService: IConfigurationService,
		@IWorkbenchEnvironmentService environmentService: IWorkbenchEnvironmentService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IActivityService activityService: IActivityService,
	) {
		const action = instantiationService.createInstance(CompositeBarAction, {
			id: GLOBAL_ACTIVITY_ID,
			name: localize('manage', "Manage"),
			classNames: ThemeIcon.asClassNameArray(userDataProfileService.currentProfile.icon ? ThemeIcon.fromId(userDataProfileService.currentProfile.icon) : DEFAULT_ICON)
		});
		super(MenuId.GlobalActivity, action, options, contextMenuActionsProvider, contextMenuAlignmentOptions, themeService, hoverService, menuService, contextMenuService, contextKeyService, configurationService, keybindingService, activityService);
		this._register(action);
		this._register(this.userDataProfileService.onDidChangeCurrentProfile(e => {
			action.compositeBarActionItem = {
				...action.compositeBarActionItem,
				classNames: ThemeIcon.asClassNameArray(userDataProfileService.currentProfile.icon ? ThemeIcon.fromId(userDataProfileService.currentProfile.icon) : DEFAULT_ICON)
			};
		}));
	}

	override render(container: HTMLElement): void {
		super.render(container);

		this.profileBadge = append(container, $('.profile-badge'));
		this.profileBadgeContent = append(this.profileBadge, $('.profile-badge-content'));
		this.updateProfileBadge();
	}

	private updateProfileBadge(): void {
		if (!this.profileBadge || !this.profileBadgeContent) {
			return;
		}

		clearNode(this.profileBadgeContent);
		hide(this.profileBadge);

		if (this.userDataProfileService.currentProfile.isDefault) {
			return;
		}

		if (this.userDataProfileService.currentProfile.icon && this.userDataProfileService.currentProfile.icon !== DEFAULT_ICON.id) {
			return;
		}

		if ((this.action as CompositeBarAction).activities.length > 0) {
			return;
		}

		show(this.profileBadge);
		this.profileBadgeContent.classList.add('profile-text-overlay');
		this.profileBadgeContent.textContent = this.userDataProfileService.currentProfile.name.substring(0, 2).toUpperCase();
	}

	protected override updateActivity(): void {
		super.updateActivity();
		this.updateProfileBadge();
	}

	protected override computeTitle(): string {
		return this.userDataProfileService.currentProfile.isDefault ? super.computeTitle() : localize('manage profile', "Manage {0} (Profile)", this.userDataProfileService.currentProfile.name);
	}
}

export class SimpleAccountActivityActionViewItem extends AccountsActivityActionViewItem {

	constructor(
		hoverOptions: IActivityHoverOptions,
		options: IBaseActionViewItemOptions,
		@IThemeService themeService: IThemeService,
		@ILifecycleService lifecycleService: ILifecycleService,
		@IHoverService hoverService: IHoverService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IMenuService menuService: IMenuService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IAuthenticationService authenticationService: IAuthenticationService,
		@IWorkbenchEnvironmentService environmentService: IWorkbenchEnvironmentService,
		@IProductService productService: IProductService,
		@IConfigurationService configurationService: IConfigurationService,
		@IKeybindingService keybindingService: IKeybindingService,
		@ISecretStorageService secretStorageService: ISecretStorageService,
		@IStorageService storageService: IStorageService,
		@ILogService logService: ILogService,
		@IActivityService activityService: IActivityService,
		@IInstantiationService instantiationService: IInstantiationService,
		@ICommandService commandService: ICommandService
	) {
		super(() => simpleActivityContextMenuActions(storageService, true),
			{
				...options,
				colors: theme => ({
					badgeBackground: theme.getColor(ACTIVITY_BAR_BADGE_BACKGROUND),
					badgeForeground: theme.getColor(ACTIVITY_BAR_BADGE_FOREGROUND),
				}),
				hoverOptions,
				compact: true,
			}, () => undefined, actions => actions, themeService, lifecycleService, hoverService, contextMenuService, menuService, contextKeyService, authenticationService, environmentService, productService, configurationService, keybindingService, secretStorageService, logService, activityService, instantiationService, commandService);
	}
}

export class SimpleGlobalActivityActionViewItem extends GlobalActivityActionViewItem {

	constructor(
		hoverOptions: IActivityHoverOptions,
		options: IBaseActionViewItemOptions,
		@IUserDataProfileService userDataProfileService: IUserDataProfileService,
		@IThemeService themeService: IThemeService,
		@IHoverService hoverService: IHoverService,
		@IMenuService menuService: IMenuService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IConfigurationService configurationService: IConfigurationService,
		@IWorkbenchEnvironmentService environmentService: IWorkbenchEnvironmentService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IActivityService activityService: IActivityService,
		@IStorageService storageService: IStorageService
	) {
		super(() => simpleActivityContextMenuActions(storageService, false),
			{
				...options,
				colors: theme => ({
					badgeBackground: theme.getColor(ACTIVITY_BAR_BADGE_BACKGROUND),
					badgeForeground: theme.getColor(ACTIVITY_BAR_BADGE_FOREGROUND),
				}),
				hoverOptions,
				compact: true,
			}, () => undefined, userDataProfileService, themeService, hoverService, menuService, contextMenuService, contextKeyService, configurationService, environmentService, keybindingService, instantiationService, activityService);
	}
}

function simpleActivityContextMenuActions(storageService: IStorageService, isAccount: boolean): IAction[] {
	const currentElementContextMenuActions: IAction[] = [];
	if (isAccount) {
		currentElementContextMenuActions.push(
			toAction({ id: 'hideAccounts', label: localize('hideAccounts', "Hide Accounts"), run: () => setAccountsActionVisible(storageService, false) }),
			new Separator()
		);
	}
	return [
		...currentElementContextMenuActions,
		toAction({ id: 'toggle.hideAccounts', label: localize('accounts', "Accounts"), checked: isAccountsActionVisible(storageService), run: () => setAccountsActionVisible(storageService, !isAccountsActionVisible(storageService)) }),
		toAction({ id: 'toggle.hideManage', label: localize('manage', "Manage"), checked: true, enabled: false, run: () => { throw new Error('"Manage" can not be hidden'); } })
	];
}

export function isAccountsActionVisible(storageService: IStorageService): boolean {
	return storageService.getBoolean(AccountsActivityActionViewItem.ACCOUNTS_VISIBILITY_PREFERENCE_KEY, StorageScope.PROFILE, true);
}

function setAccountsActionVisible(storageService: IStorageService, visible: boolean) {
	storageService.store(AccountsActivityActionViewItem.ACCOUNTS_VISIBILITY_PREFERENCE_KEY, visible, StorageScope.PROFILE, StorageTarget.USER);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/paneCompositeBar.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/paneCompositeBar.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../nls.js';
import { ActionsOrientation } from '../../../base/browser/ui/actionbar/actionbar.js';
import { IActivityService } from '../../services/activity/common/activity.js';
import { IWorkbenchLayoutService, Parts } from '../../services/layout/browser/layoutService.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';
import { IDisposable, DisposableStore, Disposable, DisposableMap } from '../../../base/common/lifecycle.js';
import { IColorTheme } from '../../../platform/theme/common/themeService.js';
import { CompositeBar, ICompositeBarItem, CompositeDragAndDrop } from './compositeBar.js';
import { Dimension, isMouseEvent } from '../../../base/browser/dom.js';
import { createCSSRule } from '../../../base/browser/domStylesheets.js';
import { asCSSUrl } from '../../../base/browser/cssValue.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../platform/storage/common/storage.js';
import { IExtensionService } from '../../services/extensions/common/extensions.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { ToggleCompositePinnedAction, ICompositeBarColors, IActivityHoverOptions, ToggleCompositeBadgeAction, CompositeBarAction, ICompositeBar, ICompositeBarActionItem } from './compositeBarActions.js';
import { IViewDescriptorService, ViewContainer, IViewContainerModel, ViewContainerLocation } from '../../common/views.js';
import { IContextKeyService, ContextKeyExpr } from '../../../platform/contextkey/common/contextkey.js';
import { isString } from '../../../base/common/types.js';
import { IWorkbenchEnvironmentService } from '../../services/environment/common/environmentService.js';
import { isNative } from '../../../base/common/platform.js';
import { Before2D, ICompositeDragAndDrop } from '../dnd.js';
import { ThemeIcon } from '../../../base/common/themables.js';
import { IAction, Separator, SubmenuAction, toAction } from '../../../base/common/actions.js';
import { StringSHA1 } from '../../../base/common/hash.js';
import { GestureEvent } from '../../../base/browser/touch.js';
import { IPaneCompositePart } from './paneCompositePart.js';
import { IConfigurationService } from '../../../platform/configuration/common/configuration.js';
import { IViewsService } from '../../services/views/common/viewsService.js';

interface IPlaceholderViewContainer {
	readonly id: string;
	readonly name?: string;
	readonly iconUrl?: UriComponents;
	readonly themeIcon?: ThemeIcon;
	readonly isBuiltin?: boolean;
	readonly views?: { when?: string }[];
	// TODO @sandy081: Remove this after a while. Migrated to visible in IViewContainerWorkspaceState
	readonly visible?: boolean;
}

interface IPinnedViewContainer {
	readonly id: string;
	readonly pinned: boolean;
	readonly order?: number;
	// TODO @sandy081: Remove this after a while. Migrated to visible in IViewContainerWorkspaceState
	readonly visible: boolean;
}

interface IViewContainerWorkspaceState {
	readonly id: string;
	readonly visible: boolean;
}

interface ICachedViewContainer {
	readonly id: string;
	name?: string;
	icon?: URI | ThemeIcon;
	readonly pinned: boolean;
	readonly order?: number;
	visible: boolean;
	isBuiltin?: boolean;
	views?: { when?: string }[];
}

export interface IPaneCompositeBarOptions {
	readonly partContainerClass: string;
	readonly pinnedViewContainersKey: string;
	readonly placeholderViewContainersKey: string;
	readonly viewContainersWorkspaceStateKey: string;
	readonly icon: boolean;
	readonly compact?: boolean;
	readonly iconSize: number;
	readonly recomputeSizes: boolean;
	readonly orientation: ActionsOrientation;
	readonly compositeSize: number;
	readonly overflowActionSize: number;
	readonly preventLoopNavigation?: boolean;
	readonly activityHoverOptions: IActivityHoverOptions;
	readonly fillExtraContextMenuActions: (actions: IAction[], e?: MouseEvent | GestureEvent) => void;
	readonly colors: (theme: IColorTheme) => ICompositeBarColors;
}

export class PaneCompositeBar extends Disposable {

	private readonly viewContainerDisposables = this._register(new DisposableMap<string, IDisposable>());
	private readonly location: ViewContainerLocation;

	private readonly compositeBar: CompositeBar;
	readonly dndHandler: ICompositeDragAndDrop;
	private readonly compositeActions = new Map<string, { activityAction: ViewContainerActivityAction; pinnedAction: ToggleCompositePinnedAction; badgeAction: ToggleCompositeBadgeAction }>();

	private hasExtensionsRegistered: boolean = false;

	constructor(
		protected readonly options: IPaneCompositeBarOptions,
		protected readonly part: Parts,
		private readonly paneCompositePart: IPaneCompositePart,
		@IInstantiationService protected readonly instantiationService: IInstantiationService,
		@IStorageService private readonly storageService: IStorageService,
		@IExtensionService private readonly extensionService: IExtensionService,
		@IViewDescriptorService private readonly viewDescriptorService: IViewDescriptorService,
		@IViewsService private readonly viewService: IViewsService,
		@IContextKeyService protected readonly contextKeyService: IContextKeyService,
		@IWorkbenchEnvironmentService private readonly environmentService: IWorkbenchEnvironmentService,
		@IWorkbenchLayoutService protected readonly layoutService: IWorkbenchLayoutService,
	) {
		super();

		this.location = paneCompositePart.partId === Parts.PANEL_PART
			? ViewContainerLocation.Panel : paneCompositePart.partId === Parts.AUXILIARYBAR_PART
				? ViewContainerLocation.AuxiliaryBar : ViewContainerLocation.Sidebar;

		this.dndHandler = new CompositeDragAndDrop(this.viewDescriptorService, this.location, this.options.orientation,
			async (id: string, focus?: boolean) => { return await this.paneCompositePart.openPaneComposite(id, focus) ?? null; },
			(from: string, to: string, before?: Before2D) => this.compositeBar.move(from, to, this.options.orientation === ActionsOrientation.VERTICAL ? before?.verticallyBefore : before?.horizontallyBefore),
			() => this.compositeBar.getCompositeBarItems(),
		);

		const cachedItems = this.cachedViewContainers
			.map(container => ({
				id: container.id,
				name: container.name,
				visible: !this.shouldBeHidden(container.id, container),
				order: container.order,
				pinned: container.pinned,
			}));
		this.compositeBar = this.createCompositeBar(cachedItems);
		this.onDidRegisterViewContainers(this.getViewContainers());
		this.registerListeners();
	}

	private createCompositeBar(cachedItems: ICompositeBarItem[]) {
		return this._register(this.instantiationService.createInstance(CompositeBar, cachedItems, {
			icon: this.options.icon,
			compact: this.options.compact,
			orientation: this.options.orientation,
			activityHoverOptions: this.options.activityHoverOptions,
			preventLoopNavigation: this.options.preventLoopNavigation,
			openComposite: async (compositeId, preserveFocus) => {
				return (await this.paneCompositePart.openPaneComposite(compositeId, !preserveFocus)) ?? null;
			},
			getActivityAction: compositeId => this.getCompositeActions(compositeId).activityAction,
			getCompositePinnedAction: compositeId => this.getCompositeActions(compositeId).pinnedAction,
			getCompositeBadgeAction: compositeId => this.getCompositeActions(compositeId).badgeAction,
			getOnCompositeClickAction: compositeId => this.getCompositeActions(compositeId).activityAction,
			fillExtraContextMenuActions: (actions, e) => this.options.fillExtraContextMenuActions(actions, e),
			getContextMenuActionsForComposite: compositeId => this.getContextMenuActionsForComposite(compositeId),
			getDefaultCompositeId: () => this.viewDescriptorService.getDefaultViewContainer(this.location)?.id,
			dndHandler: this.dndHandler,
			compositeSize: this.options.compositeSize,
			overflowActionSize: this.options.overflowActionSize,
			colors: theme => this.options.colors(theme),
		}));
	}

	private getContextMenuActionsForComposite(compositeId: string): IAction[] {
		const actions: IAction[] = [new Separator()];

		const viewContainer = this.viewDescriptorService.getViewContainerById(compositeId)!;
		const defaultLocation = this.viewDescriptorService.getDefaultViewContainerLocation(viewContainer)!;
		const currentLocation = this.viewDescriptorService.getViewContainerLocation(viewContainer);

		// Move View Container
		const moveActions = [];
		for (const location of [ViewContainerLocation.Sidebar, ViewContainerLocation.AuxiliaryBar, ViewContainerLocation.Panel]) {
			if (currentLocation !== location) {
				moveActions.push(this.createMoveAction(viewContainer, location, defaultLocation));
			}
		}

		actions.push(new SubmenuAction('moveToMenu', localize('moveToMenu', "Move To"), moveActions));

		// Reset Location
		if (defaultLocation !== currentLocation) {
			actions.push(toAction({
				id: 'resetLocationAction', label: localize('resetLocation', "Reset Location"), run: () => {
					this.viewDescriptorService.moveViewContainerToLocation(viewContainer, defaultLocation, undefined, 'resetLocationAction');
					this.viewService.openViewContainer(viewContainer.id, true);
				}
			}));
		} else {
			const viewContainerModel = this.viewDescriptorService.getViewContainerModel(viewContainer);
			if (viewContainerModel.allViewDescriptors.length === 1) {
				const viewToReset = viewContainerModel.allViewDescriptors[0];
				const defaultContainer = this.viewDescriptorService.getDefaultContainerById(viewToReset.id)!;
				if (defaultContainer !== viewContainer) {
					actions.push(toAction({
						id: 'resetLocationAction', label: localize('resetLocation', "Reset Location"), run: () => {
							this.viewDescriptorService.moveViewsToContainer([viewToReset], defaultContainer, undefined, 'resetLocationAction');
							this.viewService.openViewContainer(viewContainer.id, true);
						}
					}));
				}
			}
		}

		return actions;
	}

	private createMoveAction(viewContainer: ViewContainer, newLocation: ViewContainerLocation, defaultLocation: ViewContainerLocation): IAction {
		return toAction({
			id: `moveViewContainerTo${newLocation}`,
			label: newLocation === ViewContainerLocation.Panel ? localize('panel', "Panel") : newLocation === ViewContainerLocation.Sidebar ? localize('sidebar', "Primary Side Bar") : localize('auxiliarybar', "Secondary Side Bar"),
			run: () => {
				let index: number | undefined;
				if (newLocation !== defaultLocation) {
					index = this.viewDescriptorService.getViewContainersByLocation(newLocation).length; // move to the end of the location
				} else {
					index = undefined; // restore default location
				}
				this.viewDescriptorService.moveViewContainerToLocation(viewContainer, newLocation, index);
				this.viewService.openViewContainer(viewContainer.id, true);
			}
		});
	}

	private registerListeners(): void {

		// View Container Changes
		this._register(this.viewDescriptorService.onDidChangeViewContainers(({ added, removed }) => this.onDidChangeViewContainers(added, removed)));
		this._register(this.viewDescriptorService.onDidChangeContainerLocation(({ viewContainer, from, to }) => this.onDidChangeViewContainerLocation(viewContainer, from, to)));

		// View Container Visibility Changes
		this._register(this.paneCompositePart.onDidPaneCompositeOpen(e => this.onDidChangeViewContainerVisibility(e.getId(), true)));
		this._register(this.paneCompositePart.onDidPaneCompositeClose(e => this.onDidChangeViewContainerVisibility(e.getId(), false)));

		// Extension registration
		this.extensionService.whenInstalledExtensionsRegistered().then(() => {
			if (this._store.isDisposed) {
				return;
			}
			this.onDidRegisterExtensions();
			this._register(this.compositeBar.onDidChange(() => {
				this.updateCompositeBarItemsFromStorage(true);
				this.saveCachedViewContainers();
			}));
			this._register(this.storageService.onDidChangeValue(StorageScope.PROFILE, this.options.pinnedViewContainersKey, this._store)(() => this.updateCompositeBarItemsFromStorage(false)));
		});
	}

	private onDidChangeViewContainers(added: readonly { container: ViewContainer; location: ViewContainerLocation }[], removed: readonly { container: ViewContainer; location: ViewContainerLocation }[]) {
		removed.filter(({ location }) => location === this.location).forEach(({ container }) => this.onDidDeregisterViewContainer(container));
		this.onDidRegisterViewContainers(added.filter(({ location }) => location === this.location).map(({ container }) => container));
	}

	private onDidChangeViewContainerLocation(container: ViewContainer, from: ViewContainerLocation, to: ViewContainerLocation) {
		if (from === this.location) {
			this.onDidDeregisterViewContainer(container);
		}

		if (to === this.location) {
			this.onDidRegisterViewContainers([container]);
		}
	}

	private onDidChangeViewContainerVisibility(id: string, visible: boolean) {
		if (visible) {
			// Activate view container action on opening of a view container
			this.onDidViewContainerVisible(id);
		} else {
			// Deactivate view container action on close
			this.compositeBar.deactivateComposite(id);
		}
	}

	private onDidRegisterExtensions(): void {
		this.hasExtensionsRegistered = true;

		// show/hide/remove composites
		for (const { id } of this.cachedViewContainers) {
			const viewContainer = this.getViewContainer(id);
			if (viewContainer) {
				this.showOrHideViewContainer(viewContainer);
			} else {
				if (this.viewDescriptorService.isViewContainerRemovedPermanently(id)) {
					this.removeComposite(id);
				} else {
					this.hideComposite(id);
				}
			}
		}

		this.saveCachedViewContainers();
	}

	private onDidViewContainerVisible(id: string): void {
		const viewContainer = this.getViewContainer(id);
		if (viewContainer) {

			// Update the composite bar by adding
			this.addComposite(viewContainer);
			this.compositeBar.activateComposite(viewContainer.id);

			if (this.shouldBeHidden(viewContainer)) {
				const viewContainerModel = this.viewDescriptorService.getViewContainerModel(viewContainer);
				if (viewContainerModel.activeViewDescriptors.length === 0) {
					// Update the composite bar by hiding
					this.hideComposite(viewContainer.id);
				}
			}
		}
	}

	create(parent: HTMLElement): HTMLElement {
		return this.compositeBar.create(parent);
	}

	private getCompositeActions(compositeId: string): { activityAction: ViewContainerActivityAction; pinnedAction: ToggleCompositePinnedAction; badgeAction: ToggleCompositeBadgeAction } {
		let compositeActions = this.compositeActions.get(compositeId);
		if (!compositeActions) {
			const viewContainer = this.getViewContainer(compositeId);
			if (viewContainer) {
				const viewContainerModel = this.viewDescriptorService.getViewContainerModel(viewContainer);
				compositeActions = {
					activityAction: this._register(this.instantiationService.createInstance(ViewContainerActivityAction, this.toCompositeBarActionItemFrom(viewContainerModel), this.part, this.paneCompositePart)),
					pinnedAction: this._register(new ToggleCompositePinnedAction(this.toCompositeBarActionItemFrom(viewContainerModel), this.compositeBar)),
					badgeAction: this._register(new ToggleCompositeBadgeAction(this.toCompositeBarActionItemFrom(viewContainerModel), this.compositeBar))
				};
			} else {
				const cachedComposite = this.cachedViewContainers.filter(c => c.id === compositeId)[0];
				compositeActions = {
					activityAction: this._register(this.instantiationService.createInstance(PlaceHolderViewContainerActivityAction, this.toCompositeBarActionItem(compositeId, cachedComposite?.name ?? compositeId, cachedComposite?.icon, undefined), this.part, this.paneCompositePart)),
					pinnedAction: this._register(new PlaceHolderToggleCompositePinnedAction(compositeId, this.compositeBar)),
					badgeAction: this._register(new PlaceHolderToggleCompositeBadgeAction(compositeId, this.compositeBar))
				};
			}

			this.compositeActions.set(compositeId, compositeActions);
		}

		return compositeActions;
	}

	private onDidRegisterViewContainers(viewContainers: readonly ViewContainer[]): void {
		for (const viewContainer of viewContainers) {
			this.addComposite(viewContainer);

			// Pin it by default if it is new
			const cachedViewContainer = this.cachedViewContainers.filter(({ id }) => id === viewContainer.id)[0];
			if (!cachedViewContainer) {
				this.compositeBar.pin(viewContainer.id);
			}

			// Active
			const visibleViewContainer = this.paneCompositePart.getActivePaneComposite();
			if (visibleViewContainer?.getId() === viewContainer.id) {
				this.compositeBar.activateComposite(viewContainer.id);
			}

			const viewContainerModel = this.viewDescriptorService.getViewContainerModel(viewContainer);
			this.updateCompositeBarActionItem(viewContainer, viewContainerModel);
			this.showOrHideViewContainer(viewContainer);

			const disposables = new DisposableStore();
			disposables.add(viewContainerModel.onDidChangeContainerInfo(() => this.updateCompositeBarActionItem(viewContainer, viewContainerModel)));
			disposables.add(viewContainerModel.onDidChangeActiveViewDescriptors(() => this.showOrHideViewContainer(viewContainer)));

			this.viewContainerDisposables.set(viewContainer.id, disposables);
		}
	}

	private onDidDeregisterViewContainer(viewContainer: ViewContainer): void {
		this.viewContainerDisposables.deleteAndDispose(viewContainer.id);
		this.removeComposite(viewContainer.id);
	}

	private updateCompositeBarActionItem(viewContainer: ViewContainer, viewContainerModel: IViewContainerModel): void {
		const compositeBarActionItem = this.toCompositeBarActionItemFrom(viewContainerModel);
		const { activityAction, pinnedAction } = this.getCompositeActions(viewContainer.id);
		activityAction.updateCompositeBarActionItem(compositeBarActionItem);

		if (pinnedAction instanceof PlaceHolderToggleCompositePinnedAction) {
			pinnedAction.setActivity(compositeBarActionItem);
		}

		if (this.options.recomputeSizes) {
			this.compositeBar.recomputeSizes();
		}

		this.saveCachedViewContainers();
	}

	private toCompositeBarActionItemFrom(viewContainerModel: IViewContainerModel): ICompositeBarActionItem {
		return this.toCompositeBarActionItem(viewContainerModel.viewContainer.id, viewContainerModel.title, viewContainerModel.icon, viewContainerModel.keybindingId);
	}

	private toCompositeBarActionItem(id: string, name: string, icon: URI | ThemeIcon | undefined, keybindingId: string | undefined): ICompositeBarActionItem {
		let classNames: string[] | undefined = undefined;
		let iconUrl: URI | undefined = undefined;
		if (this.options.icon) {
			if (URI.isUri(icon)) {
				iconUrl = icon;
				const cssUrl = asCSSUrl(icon);
				const hash = new StringSHA1();
				hash.update(cssUrl);
				const iconId = `activity-${id.replace(/\./g, '-')}-${hash.digest()}`;
				const iconClass = `.monaco-workbench .${this.options.partContainerClass} .monaco-action-bar .action-label.${iconId}`;
				classNames = [iconId, 'uri-icon'];
				createCSSRule(iconClass, `
				mask: ${cssUrl} no-repeat 50% 50%;
				mask-size: ${this.options.iconSize}px;
				-webkit-mask: ${cssUrl} no-repeat 50% 50%;
				-webkit-mask-size: ${this.options.iconSize}px;
				mask-origin: padding;
				-webkit-mask-origin: padding;
			`);
			} else if (ThemeIcon.isThemeIcon(icon)) {
				classNames = ThemeIcon.asClassNameArray(icon);
			}
		}

		return { id, name, classNames, iconUrl, keybindingId };
	}

	private showOrHideViewContainer(viewContainer: ViewContainer): void {
		if (this.shouldBeHidden(viewContainer)) {
			this.hideComposite(viewContainer.id);
		} else {
			this.addComposite(viewContainer);

			// Activate if this is the active pane composite
			const activePaneComposite = this.paneCompositePart.getActivePaneComposite();
			if (activePaneComposite?.getId() === viewContainer.id) {
				this.compositeBar.activateComposite(viewContainer.id);
			}
		}
	}

	private shouldBeHidden(viewContainerOrId: string | ViewContainer, cachedViewContainer?: ICachedViewContainer): boolean {
		const viewContainer = isString(viewContainerOrId) ? this.getViewContainer(viewContainerOrId) : viewContainerOrId;
		const viewContainerId = isString(viewContainerOrId) ? viewContainerOrId : viewContainerOrId.id;

		if (viewContainer) {
			if (viewContainer.hideIfEmpty) {
				if (this.viewService.isViewContainerActive(viewContainerId)) {
					return false;
				}
			} else {
				return false;
			}
		}

		// Check cache only if extensions are not yet registered and current window is not native (desktop) remote connection window
		if (!this.hasExtensionsRegistered && !(this.part === Parts.SIDEBAR_PART && this.environmentService.remoteAuthority && isNative)) {
			cachedViewContainer = cachedViewContainer || this.cachedViewContainers.find(({ id }) => id === viewContainerId);

			// Show builtin ViewContainer if not registered yet
			if (!viewContainer && cachedViewContainer?.isBuiltin && cachedViewContainer?.visible) {
				return false;
			}

			if (cachedViewContainer?.views?.length) {
				return cachedViewContainer.views.every(({ when }) => !!when && !this.contextKeyService.contextMatchesRules(ContextKeyExpr.deserialize(when)));
			}
		}

		return true;
	}

	private addComposite(viewContainer: ViewContainer): void {
		this.compositeBar.addComposite({ id: viewContainer.id, name: typeof viewContainer.title === 'string' ? viewContainer.title : viewContainer.title.value, order: viewContainer.order, requestedIndex: viewContainer.requestedIndex });
	}

	private hideComposite(compositeId: string): void {
		this.compositeBar.hideComposite(compositeId);

		const compositeActions = this.compositeActions.get(compositeId);
		if (compositeActions) {
			compositeActions.activityAction.dispose();
			compositeActions.pinnedAction.dispose();
			this.compositeActions.delete(compositeId);
		}
	}

	private removeComposite(compositeId: string): void {
		this.compositeBar.removeComposite(compositeId);

		const compositeActions = this.compositeActions.get(compositeId);
		if (compositeActions) {
			compositeActions.activityAction.dispose();
			compositeActions.pinnedAction.dispose();
			this.compositeActions.delete(compositeId);
		}
	}

	getPinnedPaneCompositeIds(): string[] {
		const pinnedCompositeIds = this.compositeBar.getPinnedComposites().map(v => v.id);
		return this.getViewContainers()
			.filter(v => this.compositeBar.isPinned(v.id))
			.sort((v1, v2) => pinnedCompositeIds.indexOf(v1.id) - pinnedCompositeIds.indexOf(v2.id))
			.map(v => v.id);
	}

	getVisiblePaneCompositeIds(): string[] {
		return this.compositeBar.getVisibleComposites()
			.filter(v => this.paneCompositePart.getActivePaneComposite()?.getId() === v.id || this.compositeBar.isPinned(v.id))
			.map(v => v.id);
	}

	getPaneCompositeIds(): string[] {
		return this.compositeBar.getVisibleComposites()
			.map(v => v.id);
	}

	getContextMenuActions(): IAction[] {
		return this.compositeBar.getContextMenuActions();
	}

	focus(index?: number): void {
		this.compositeBar.focus(index);
	}

	layout(width: number, height: number): void {
		this.compositeBar.layout(new Dimension(width, height));
	}

	private getViewContainer(id: string): ViewContainer | undefined {
		const viewContainer = this.viewDescriptorService.getViewContainerById(id);
		return viewContainer && this.viewDescriptorService.getViewContainerLocation(viewContainer) === this.location ? viewContainer : undefined;
	}

	private getViewContainers(): readonly ViewContainer[] {
		return this.viewDescriptorService.getViewContainersByLocation(this.location);
	}

	private updateCompositeBarItemsFromStorage(retainExisting: boolean): void {
		if (this.pinnedViewContainersValue === this.getStoredPinnedViewContainersValue()) {
			return;
		}

		this._placeholderViewContainersValue = undefined;
		this._pinnedViewContainersValue = undefined;
		this._cachedViewContainers = undefined;

		const newCompositeItems: ICompositeBarItem[] = [];
		const compositeItems = this.compositeBar.getCompositeBarItems();

		for (const cachedViewContainer of this.cachedViewContainers) {
			newCompositeItems.push({
				id: cachedViewContainer.id,
				name: cachedViewContainer.name,
				order: cachedViewContainer.order,
				pinned: cachedViewContainer.pinned,
				visible: cachedViewContainer.visible && !!this.getViewContainer(cachedViewContainer.id),
			});
		}

		for (const viewContainer of this.getViewContainers()) {
			// Add missing view containers
			if (!newCompositeItems.some(({ id }) => id === viewContainer.id)) {
				const index = compositeItems.findIndex(({ id }) => id === viewContainer.id);
				if (index !== -1) {
					const compositeItem = compositeItems[index];
					newCompositeItems.splice(index, 0, {
						id: viewContainer.id,
						name: typeof viewContainer.title === 'string' ? viewContainer.title : viewContainer.title.value,
						order: compositeItem.order,
						pinned: compositeItem.pinned,
						visible: compositeItem.visible,
					});
				} else {
					newCompositeItems.push({
						id: viewContainer.id,
						name: typeof viewContainer.title === 'string' ? viewContainer.title : viewContainer.title.value,
						order: viewContainer.order,
						pinned: true,
						visible: !this.shouldBeHidden(viewContainer),
					});
				}
			}
		}

		if (retainExisting) {
			for (const compositeItem of compositeItems) {
				const newCompositeItem = newCompositeItems.find(({ id }) => id === compositeItem.id);
				if (!newCompositeItem) {
					newCompositeItems.push(compositeItem);
				}
			}
		}

		this.compositeBar.setCompositeBarItems(newCompositeItems);
	}

	private saveCachedViewContainers(): void {
		const state: ICachedViewContainer[] = [];

		const compositeItems = this.compositeBar.getCompositeBarItems();
		for (const compositeItem of compositeItems) {
			const viewContainer = this.getViewContainer(compositeItem.id);
			if (viewContainer) {
				const viewContainerModel = this.viewDescriptorService.getViewContainerModel(viewContainer);
				const views: { when: string | undefined }[] = [];
				for (const { when } of viewContainerModel.allViewDescriptors) {
					views.push({ when: when ? when.serialize() : undefined });
				}
				state.push({
					id: compositeItem.id,
					name: viewContainerModel.title,
					icon: URI.isUri(viewContainerModel.icon) && this.environmentService.remoteAuthority ? undefined : viewContainerModel.icon, // Do not cache uri icons with remote connection
					views,
					pinned: compositeItem.pinned,
					order: compositeItem.order,
					visible: compositeItem.visible,
					isBuiltin: !viewContainer.extensionId
				});
			} else {
				state.push({ id: compositeItem.id, name: compositeItem.name, pinned: compositeItem.pinned, order: compositeItem.order, visible: false, isBuiltin: false });
			}
		}

		this.storeCachedViewContainersState(state);
	}

	private _cachedViewContainers: ICachedViewContainer[] | undefined = undefined;
	private get cachedViewContainers(): ICachedViewContainer[] {
		if (this._cachedViewContainers === undefined) {
			this._cachedViewContainers = this.getPinnedViewContainers();
			for (const placeholderViewContainer of this.getPlaceholderViewContainers()) {
				const cachedViewContainer = this._cachedViewContainers.find(cached => cached.id === placeholderViewContainer.id);
				if (cachedViewContainer) {
					cachedViewContainer.visible = placeholderViewContainer.visible ?? cachedViewContainer.visible;
					cachedViewContainer.name = placeholderViewContainer.name;
					cachedViewContainer.icon = placeholderViewContainer.themeIcon ? placeholderViewContainer.themeIcon :
						placeholderViewContainer.iconUrl ? URI.revive(placeholderViewContainer.iconUrl) : undefined;
					if (URI.isUri(cachedViewContainer.icon) && this.environmentService.remoteAuthority) {
						cachedViewContainer.icon = undefined; // Do not cache uri icons with remote connection
					}
					cachedViewContainer.views = placeholderViewContainer.views;
					cachedViewContainer.isBuiltin = placeholderViewContainer.isBuiltin;
				}
			}
			for (const viewContainerWorkspaceState of this.getViewContainersWorkspaceState()) {
				const cachedViewContainer = this._cachedViewContainers.find(cached => cached.id === viewContainerWorkspaceState.id);
				if (cachedViewContainer) {
					cachedViewContainer.visible = viewContainerWorkspaceState.visible ?? cachedViewContainer.visible;
				}
			}
		}

		return this._cachedViewContainers;
	}

	private storeCachedViewContainersState(cachedViewContainers: ICachedViewContainer[]): void {
		const pinnedViewContainers = this.getPinnedViewContainers();
		this.setPinnedViewContainers(cachedViewContainers.map(({ id, pinned, order }) => ({
			id,
			pinned,
			visible: Boolean(pinnedViewContainers.find(({ id: pinnedId }) => pinnedId === id)?.visible),
			order
		} satisfies IPinnedViewContainer)));

		this.setPlaceholderViewContainers(cachedViewContainers.map(({ id, icon, name, views, isBuiltin }) => ({
			id,
			iconUrl: URI.isUri(icon) ? icon : undefined,
			themeIcon: ThemeIcon.isThemeIcon(icon) ? icon : undefined,
			name,
			isBuiltin,
			views
		} satisfies IPlaceholderViewContainer)));

		this.setViewContainersWorkspaceState(cachedViewContainers.map(({ id, visible }) => ({
			id,
			visible,
		} satisfies IViewContainerWorkspaceState)));
	}

	private getPinnedViewContainers(): IPinnedViewContainer[] {
		return JSON.parse(this.pinnedViewContainersValue);
	}

	private setPinnedViewContainers(pinnedViewContainers: IPinnedViewContainer[]): void {
		this.pinnedViewContainersValue = JSON.stringify(pinnedViewContainers);
	}

	private _pinnedViewContainersValue: string | undefined;
	private get pinnedViewContainersValue(): string {
		if (!this._pinnedViewContainersValue) {
			this._pinnedViewContainersValue = this.getStoredPinnedViewContainersValue();
		}

		return this._pinnedViewContainersValue;
	}

	private set pinnedViewContainersValue(pinnedViewContainersValue: string) {
		if (this.pinnedViewContainersValue !== pinnedViewContainersValue) {
			this._pinnedViewContainersValue = pinnedViewContainersValue;
			this.setStoredPinnedViewContainersValue(pinnedViewContainersValue);
		}
	}

	private getStoredPinnedViewContainersValue(): string {
		return this.storageService.get(this.options.pinnedViewContainersKey, StorageScope.PROFILE, '[]');
	}

	private setStoredPinnedViewContainersValue(value: string): void {
		this.storageService.store(this.options.pinnedViewContainersKey, value, StorageScope.PROFILE, StorageTarget.USER);
	}

	private getPlaceholderViewContainers(): IPlaceholderViewContainer[] {
		return JSON.parse(this.placeholderViewContainersValue);
	}

	private setPlaceholderViewContainers(placeholderViewContainers: IPlaceholderViewContainer[]): void {
		this.placeholderViewContainersValue = JSON.stringify(placeholderViewContainers);
	}

	private _placeholderViewContainersValue: string | undefined;
	private get placeholderViewContainersValue(): string {
		if (!this._placeholderViewContainersValue) {
			this._placeholderViewContainersValue = this.getStoredPlaceholderViewContainersValue();
		}

		return this._placeholderViewContainersValue;
	}

	private set placeholderViewContainersValue(placeholderViewContainesValue: string) {
		if (this.placeholderViewContainersValue !== placeholderViewContainesValue) {
			this._placeholderViewContainersValue = placeholderViewContainesValue;
			this.setStoredPlaceholderViewContainersValue(placeholderViewContainesValue);
		}
	}

	private getStoredPlaceholderViewContainersValue(): string {
		return this.storageService.get(this.options.placeholderViewContainersKey, StorageScope.PROFILE, '[]');
	}

	private setStoredPlaceholderViewContainersValue(value: string): void {
		this.storageService.store(this.options.placeholderViewContainersKey, value, StorageScope.PROFILE, StorageTarget.MACHINE);
	}

	private getViewContainersWorkspaceState(): IViewContainerWorkspaceState[] {
		return JSON.parse(this.viewContainersWorkspaceStateValue);
	}

	private setViewContainersWorkspaceState(viewContainersWorkspaceState: IViewContainerWorkspaceState[]): void {
		this.viewContainersWorkspaceStateValue = JSON.stringify(viewContainersWorkspaceState);
	}

	private _viewContainersWorkspaceStateValue: string | undefined;
	private get viewContainersWorkspaceStateValue(): string {
		if (!this._viewContainersWorkspaceStateValue) {
			this._viewContainersWorkspaceStateValue = this.getStoredViewContainersWorkspaceStateValue();
		}

		return this._viewContainersWorkspaceStateValue;
	}

	private set viewContainersWorkspaceStateValue(viewContainersWorkspaceStateValue: string) {
		if (this.viewContainersWorkspaceStateValue !== viewContainersWorkspaceStateValue) {
			this._viewContainersWorkspaceStateValue = viewContainersWorkspaceStateValue;
			this.setStoredViewContainersWorkspaceStateValue(viewContainersWorkspaceStateValue);
		}
	}

	private getStoredViewContainersWorkspaceStateValue(): string {
		return this.storageService.get(this.options.viewContainersWorkspaceStateKey, StorageScope.WORKSPACE, '[]');
	}

	private setStoredViewContainersWorkspaceStateValue(value: string): void {
		this.storageService.store(this.options.viewContainersWorkspaceStateKey, value, StorageScope.WORKSPACE, StorageTarget.MACHINE);
	}
}

class ViewContainerActivityAction extends CompositeBarAction {

	private static readonly preventDoubleClickDelay = 300;

	private lastRun = 0;

	constructor(
		compositeBarActionItem: ICompositeBarActionItem,
		private readonly part: Parts,
		private readonly paneCompositePart: IPaneCompositePart,
		@IWorkbenchLayoutService private readonly layoutService: IWorkbenchLayoutService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IActivityService private readonly activityService: IActivityService,
	) {
		super(compositeBarActionItem);
		this.updateActivity();
		this._register(this.activityService.onDidChangeActivity(viewContainerOrAction => {
			if (!isString(viewContainerOrAction) && viewContainerOrAction.id === this.compositeBarActionItem.id) {
				this.updateActivity();
			}
		}));
	}

	updateCompositeBarActionItem(compositeBarActionItem: ICompositeBarActionItem): void {
		this.compositeBarActionItem = compositeBarActionItem;
	}

	private updateActivity(): void {
		this.activities = this.activityService.getViewContainerActivities(this.compositeBarActionItem.id);
	}

	override async run(event: { preserveFocus: boolean }): Promise<void> {
		if (isMouseEvent(event) && event.button === 2) {
			return; // do not run on right click
		}

		// prevent accident trigger on a doubleclick (to help nervous people)
		const now = Date.now();
		if (now > this.lastRun /* https://github.com/microsoft/vscode/issues/25830 */ && now - this.lastRun < ViewContainerActivityAction.preventDoubleClickDelay) {
			return;
		}
		this.lastRun = now;

		const focus = (event && 'preserveFocus' in event) ? !event.preserveFocus : true;

		if (this.part === Parts.ACTIVITYBAR_PART) {
			const sideBarVisible = this.layoutService.isVisible(Parts.SIDEBAR_PART);
			const activeViewlet = this.paneCompositePart.getActivePaneComposite();
			const focusBehavior = this.configurationService.getValue<string>('workbench.activityBar.iconClickBehavior');

			if (sideBarVisible && activeViewlet?.getId() === this.compositeBarActionItem.id) {
				switch (focusBehavior) {
					case 'focus':
						this.paneCompositePart.openPaneComposite(this.compositeBarActionItem.id, focus);
						break;
					case 'toggle':
					default:
						// Hide sidebar if selected viewlet already visible
						this.layoutService.setPartHidden(true, Parts.SIDEBAR_PART);
						break;
				}

				return;
			}
		}

		await this.paneCompositePart.openPaneComposite(this.compositeBarActionItem.id, focus);
		return this.activate();
	}
}

class PlaceHolderViewContainerActivityAction extends ViewContainerActivityAction { }

class PlaceHolderToggleCompositePinnedAction extends ToggleCompositePinnedAction {

	constructor(id: string, compositeBar: ICompositeBar) {
		super({ id, name: id, classNames: undefined }, compositeBar);
	}

	setActivity(activity: ICompositeBarActionItem): void {
		this.label = activity.name;
	}
}

class PlaceHolderToggleCompositeBadgeAction extends ToggleCompositeBadgeAction {

	constructor(id: string, compositeBar: ICompositeBar) {
		super({ id, name: id, classNames: undefined }, compositeBar);
	}

	setCompositeBarActionItem(actionItem: ICompositeBarActionItem): void {
		this.label = actionItem.name;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/paneCompositePart.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/paneCompositePart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/paneCompositePart.css';
import { Event } from '../../../base/common/event.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';
import { IProgressIndicator } from '../../../platform/progress/common/progress.js';
import { Extensions, PaneComposite, PaneCompositeDescriptor, PaneCompositeRegistry } from '../panecomposite.js';
import { IPaneComposite } from '../../common/panecomposite.js';
import { IViewDescriptorService, ViewContainerLocation } from '../../common/views.js';
import { DisposableStore, MutableDisposable } from '../../../base/common/lifecycle.js';
import { IView } from '../../../base/browser/ui/grid/grid.js';
import { IWorkbenchLayoutService, Parts } from '../../services/layout/browser/layoutService.js';
import { CompositePart, ICompositePartOptions, ICompositeTitleLabel } from './compositePart.js';
import { IPaneCompositeBarOptions, PaneCompositeBar } from './paneCompositeBar.js';
import { Dimension, EventHelper, trackFocus, $, addDisposableListener, EventType, prepend, getWindow } from '../../../base/browser/dom.js';
import { Registry } from '../../../platform/registry/common/platform.js';
import { INotificationService } from '../../../platform/notification/common/notification.js';
import { IStorageService } from '../../../platform/storage/common/storage.js';
import { IContextMenuService } from '../../../platform/contextview/browser/contextView.js';
import { IKeybindingService } from '../../../platform/keybinding/common/keybinding.js';
import { IThemeService } from '../../../platform/theme/common/themeService.js';
import { IContextKey, IContextKeyService } from '../../../platform/contextkey/common/contextkey.js';
import { IExtensionService } from '../../services/extensions/common/extensions.js';
import { IComposite } from '../../common/composite.js';
import { localize } from '../../../nls.js';
import { CompositeDragAndDropObserver, toggleDropEffect } from '../dnd.js';
import { EDITOR_DRAG_AND_DROP_BACKGROUND } from '../../common/theme.js';
import { IMenuService, MenuId } from '../../../platform/actions/common/actions.js';
import { ActionsOrientation } from '../../../base/browser/ui/actionbar/actionbar.js';
import { Gesture, EventType as GestureEventType } from '../../../base/browser/touch.js';
import { StandardMouseEvent } from '../../../base/browser/mouseEvent.js';
import { IAction, SubmenuAction } from '../../../base/common/actions.js';
import { Composite } from '../composite.js';
import { ViewsSubMenu } from './views/viewPaneContainer.js';
import { getActionBarActions } from '../../../platform/actions/browser/menuEntryActionViewItem.js';
import { IHoverService } from '../../../platform/hover/browser/hover.js';
import { HiddenItemStrategy, MenuWorkbenchToolBar } from '../../../platform/actions/browser/toolbar.js';
import { DeferredPromise } from '../../../base/common/async.js';

export enum CompositeBarPosition {
	TOP,
	TITLE,
	BOTTOM
}

export interface IPaneCompositePart extends IView {

	readonly partId: Parts.PANEL_PART | Parts.AUXILIARYBAR_PART | Parts.SIDEBAR_PART;

	readonly onDidPaneCompositeOpen: Event<IPaneComposite>;
	readonly onDidPaneCompositeClose: Event<IPaneComposite>;

	/**
	 * Opens a viewlet with the given identifier and pass keyboard focus to it if specified.
	 */
	openPaneComposite(id: string | undefined, focus?: boolean): Promise<IPaneComposite | undefined>;

	/**
	 * Returns the current active viewlet if any.
	 */
	getActivePaneComposite(): IPaneComposite | undefined;

	/**
	 * Returns the viewlet by id.
	 */
	getPaneComposite(id: string): PaneCompositeDescriptor | undefined;

	/**
	 * Returns all enabled viewlets
	 */
	getPaneComposites(): PaneCompositeDescriptor[];

	/**
	 * Returns the progress indicator for the side bar.
	 */
	getProgressIndicator(id: string): IProgressIndicator | undefined;

	/**
	 * Hide the active viewlet.
	 */
	hideActivePaneComposite(): void;

	/**
	 * Return the last active viewlet id.
	 */
	getLastActivePaneCompositeId(): string;

	/**
	 * Returns id of pinned view containers following the visual order.
	 */
	getPinnedPaneCompositeIds(): string[];

	/**
	 * Returns id of visible view containers following the visual order.
	 */
	getVisiblePaneCompositeIds(): string[];

	/**
	 * Returns id of all view containers following the visual order.
	 */
	getPaneCompositeIds(): string[];
}

export abstract class AbstractPaneCompositePart extends CompositePart<PaneComposite> implements IPaneCompositePart {

	private static readonly MIN_COMPOSITE_BAR_WIDTH = 50;

	get snap(): boolean {
		// Always allow snapping closed
		// Only allow dragging open if the panel contains view containers
		return this.layoutService.isVisible(this.partId) || !!this.paneCompositeBar.value?.getVisiblePaneCompositeIds().length;
	}

	get onDidPaneCompositeOpen(): Event<IPaneComposite> { return Event.map(this.onDidCompositeOpen.event, compositeEvent => <IPaneComposite>compositeEvent.composite); }
	readonly onDidPaneCompositeClose = this.onDidCompositeClose.event as Event<IPaneComposite>;

	private readonly location: ViewContainerLocation;
	private titleContainer: HTMLElement | undefined;
	private headerFooterCompositeBarContainer: HTMLElement | undefined;
	protected readonly headerFooterCompositeBarDispoables = this._register(new DisposableStore());
	private paneCompositeBarContainer: HTMLElement | undefined;
	private readonly paneCompositeBar = this._register(new MutableDisposable<PaneCompositeBar>());
	private compositeBarPosition: CompositeBarPosition | undefined = undefined;
	private emptyPaneMessageElement: HTMLElement | undefined;

	private readonly globalActionsMenuId: MenuId;
	private globalToolBar: MenuWorkbenchToolBar | undefined;

	private blockOpening: DeferredPromise<PaneComposite | undefined> | undefined = undefined;
	protected contentDimension: Dimension | undefined;

	constructor(
		readonly partId: Parts.PANEL_PART | Parts.AUXILIARYBAR_PART | Parts.SIDEBAR_PART,
		partOptions: ICompositePartOptions,
		activePaneCompositeSettingsKey: string,
		private readonly activePaneContextKey: IContextKey<string>,
		private paneFocusContextKey: IContextKey<boolean>,
		nameForTelemetry: string,
		compositeCSSClass: string,
		titleForegroundColor: string | undefined,
		titleBorderColor: string | undefined,
		@INotificationService notificationService: INotificationService,
		@IStorageService storageService: IStorageService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IWorkbenchLayoutService layoutService: IWorkbenchLayoutService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IHoverService hoverService: IHoverService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IThemeService themeService: IThemeService,
		@IViewDescriptorService private readonly viewDescriptorService: IViewDescriptorService,
		@IContextKeyService protected readonly contextKeyService: IContextKeyService,
		@IExtensionService private readonly extensionService: IExtensionService,
		@IMenuService protected readonly menuService: IMenuService,
	) {
		let location = ViewContainerLocation.Sidebar;
		let registryId = Extensions.Viewlets;
		let globalActionsMenuId = MenuId.SidebarTitle;
		if (partId === Parts.PANEL_PART) {
			location = ViewContainerLocation.Panel;
			registryId = Extensions.Panels;
			globalActionsMenuId = MenuId.PanelTitle;
		} else if (partId === Parts.AUXILIARYBAR_PART) {
			location = ViewContainerLocation.AuxiliaryBar;
			registryId = Extensions.Auxiliary;
			globalActionsMenuId = MenuId.AuxiliaryBarTitle;
		}
		super(
			notificationService,
			storageService,
			contextMenuService,
			layoutService,
			keybindingService,
			hoverService,
			instantiationService,
			themeService,
			Registry.as<PaneCompositeRegistry>(registryId),
			activePaneCompositeSettingsKey,
			viewDescriptorService.getDefaultViewContainer(location)?.id || '',
			nameForTelemetry,
			compositeCSSClass,
			titleForegroundColor,
			titleBorderColor,
			partId,
			partOptions
		);

		this.location = location;
		this.globalActionsMenuId = globalActionsMenuId;
		this.registerListeners();
	}

	private registerListeners(): void {
		this._register(this.onDidPaneCompositeOpen(composite => this.onDidOpen(composite)));
		this._register(this.onDidPaneCompositeClose(this.onDidClose, this));

		this._register(this.registry.onDidDeregister((viewletDescriptor: PaneCompositeDescriptor) => {

			const activeContainers = this.viewDescriptorService.getViewContainersByLocation(this.location)
				.filter(container => this.viewDescriptorService.getViewContainerModel(container).activeViewDescriptors.length > 0);

			if (activeContainers.length) {
				if (this.getActiveComposite()?.getId() === viewletDescriptor.id) {
					const defaultViewletId = this.viewDescriptorService.getDefaultViewContainer(this.location)?.id;
					const containerToOpen = activeContainers.filter(c => c.id === defaultViewletId)[0] || activeContainers[0];
					this.doOpenPaneComposite(containerToOpen.id);
				}
			} else {
				this.layoutService.setPartHidden(true, this.partId);
			}

			this.removeComposite(viewletDescriptor.id);
		}));

		this._register(this.extensionService.onDidRegisterExtensions(() => {
			this.layoutCompositeBar();
		}));
	}

	private onDidOpen(composite: IComposite): void {
		this.activePaneContextKey.set(composite.getId());
	}

	private onDidClose(composite: IComposite): void {
		const id = composite.getId();
		if (this.activePaneContextKey.get() === id) {
			this.activePaneContextKey.reset();
		}
	}

	protected override showComposite(composite: Composite): void {
		super.showComposite(composite);
		this.layoutCompositeBar();
		this.layoutEmptyMessage();
	}

	protected override hideActiveComposite(): Composite | undefined {
		const composite = super.hideActiveComposite();
		this.layoutCompositeBar();
		this.layoutEmptyMessage();
		return composite;
	}

	override create(parent: HTMLElement): void {
		this.element = parent;
		this.element.classList.add('pane-composite-part');

		super.create(parent);

		if (this.contentArea) {
			this.createEmptyPaneMessage(this.contentArea);
		}

		this.updateCompositeBar();

		const focusTracker = this._register(trackFocus(parent));
		this._register(focusTracker.onDidFocus(() => this.paneFocusContextKey.set(true)));
		this._register(focusTracker.onDidBlur(() => this.paneFocusContextKey.set(false)));
	}

	private createEmptyPaneMessage(parent: HTMLElement): void {
		this.emptyPaneMessageElement = $('.empty-pane-message-area');

		const messageElement = $('.empty-pane-message');
		messageElement.textContent = localize('pane.emptyMessage', "Drag a view here to display.");

		this.emptyPaneMessageElement.appendChild(messageElement);
		parent.appendChild(this.emptyPaneMessageElement);

		const setDropBackgroundFeedback = (visible: boolean) => {
			const updateActivityBarBackground = !this.getActiveComposite() || !visible;
			const backgroundColor = visible ? this.theme.getColor(EDITOR_DRAG_AND_DROP_BACKGROUND)?.toString() || '' : '';

			if (this.titleContainer && updateActivityBarBackground) {
				this.titleContainer.style.backgroundColor = backgroundColor;
			}
			if (this.headerFooterCompositeBarContainer && updateActivityBarBackground) {
				this.headerFooterCompositeBarContainer.style.backgroundColor = backgroundColor;
			}

			this.emptyPaneMessageElement!.style.backgroundColor = backgroundColor;
		};

		this._register(CompositeDragAndDropObserver.INSTANCE.registerTarget(this.element, {
			onDragOver: (e) => {
				EventHelper.stop(e.eventData, true);
				if (this.paneCompositeBar.value) {
					const validDropTarget = this.paneCompositeBar.value.dndHandler.onDragEnter(e.dragAndDropData, undefined, e.eventData);
					toggleDropEffect(e.eventData.dataTransfer, 'move', validDropTarget);
				}
			},
			onDragEnter: (e) => {
				EventHelper.stop(e.eventData, true);
				if (this.paneCompositeBar.value) {
					const validDropTarget = this.paneCompositeBar.value.dndHandler.onDragEnter(e.dragAndDropData, undefined, e.eventData);
					setDropBackgroundFeedback(validDropTarget);
				}
			},
			onDragLeave: (e) => {
				EventHelper.stop(e.eventData, true);
				setDropBackgroundFeedback(false);
			},
			onDragEnd: (e) => {
				EventHelper.stop(e.eventData, true);
				setDropBackgroundFeedback(false);
			},
			onDrop: (e) => {
				EventHelper.stop(e.eventData, true);
				setDropBackgroundFeedback(false);
				if (this.paneCompositeBar.value) {
					this.paneCompositeBar.value.dndHandler.drop(e.dragAndDropData, undefined, e.eventData);
				} else {
					// Allow opening views/composites if the composite bar is hidden
					const dragData = e.dragAndDropData.getData();

					if (dragData.type === 'composite') {
						const currentContainer = this.viewDescriptorService.getViewContainerById(dragData.id)!;
						this.viewDescriptorService.moveViewContainerToLocation(currentContainer, this.location, undefined, 'dnd');
						this.openPaneComposite(currentContainer.id, true);
					}

					else if (dragData.type === 'view') {
						const viewToMove = this.viewDescriptorService.getViewDescriptorById(dragData.id)!;
						if (viewToMove.canMoveView) {
							this.viewDescriptorService.moveViewToLocation(viewToMove, this.location, 'dnd');

							const newContainer = this.viewDescriptorService.getViewContainerByViewId(viewToMove.id)!;

							this.openPaneComposite(newContainer.id, true).then(composite => {
								composite?.openView(viewToMove.id, true);
							});
						}
					}
				}
			},
		}));
	}

	protected override createTitleArea(parent: HTMLElement): HTMLElement {
		const titleArea = super.createTitleArea(parent);

		this._register(addDisposableListener(titleArea, EventType.CONTEXT_MENU, e => {
			this.onTitleAreaContextMenu(new StandardMouseEvent(getWindow(titleArea), e));
		}));
		this._register(Gesture.addTarget(titleArea));
		this._register(addDisposableListener(titleArea, GestureEventType.Contextmenu, e => {
			this.onTitleAreaContextMenu(new StandardMouseEvent(getWindow(titleArea), e));
		}));

		const globalTitleActionsContainer = titleArea.appendChild($('.global-actions'));

		// Global Actions Toolbar
		this.globalToolBar = this._register(this.instantiationService.createInstance(MenuWorkbenchToolBar,
			globalTitleActionsContainer,
			this.globalActionsMenuId,
			{
				actionViewItemProvider: (action, options) => this.actionViewItemProvider(action, options),
				orientation: ActionsOrientation.HORIZONTAL,
				getKeyBinding: action => this.keybindingService.lookupKeybinding(action.id),
				anchorAlignmentProvider: () => this.getTitleAreaDropDownAnchorAlignment(),
				toggleMenuTitle: localize('moreActions', "More Actions..."),
				hoverDelegate: this.toolbarHoverDelegate,
				hiddenItemStrategy: HiddenItemStrategy.NoHide,
				highlightToggledItems: true,
				telemetrySource: this.nameForTelemetry
			}
		));

		return titleArea;
	}

	protected override createTitleLabel(parent: HTMLElement): ICompositeTitleLabel {
		this.titleContainer = parent;

		const titleLabel = super.createTitleLabel(parent);
		this.titleLabelElement!.draggable = true;
		const draggedItemProvider = (): { type: 'view' | 'composite'; id: string } => {
			const activeViewlet = this.getActivePaneComposite()!;
			return { type: 'composite', id: activeViewlet.getId() };
		};
		this._register(CompositeDragAndDropObserver.INSTANCE.registerDraggable(this.titleLabelElement!, draggedItemProvider, {}));

		return titleLabel;
	}

	protected updateCompositeBar(updateCompositeBarOption: boolean = false): void {
		const wasCompositeBarVisible = this.compositeBarPosition !== undefined;
		const isCompositeBarVisible = this.shouldShowCompositeBar();
		const previousPosition = this.compositeBarPosition;
		const newPosition = isCompositeBarVisible ? this.getCompositeBarPosition() : undefined;

		// Only update if the visibility or position has changed or if the composite bar options should be updated
		if (!updateCompositeBarOption && previousPosition === newPosition) {
			return;
		}

		// Remove old composite bar
		if (wasCompositeBarVisible) {
			const previousCompositeBarContainer = previousPosition === CompositeBarPosition.TITLE ? this.titleContainer : this.headerFooterCompositeBarContainer;
			if (!this.paneCompositeBarContainer || !this.paneCompositeBar.value || !previousCompositeBarContainer) {
				throw new Error('Composite bar containers should exist when removing the previous composite bar');
			}

			this.paneCompositeBarContainer.remove();
			this.paneCompositeBarContainer = undefined;
			this.paneCompositeBar.value = undefined;

			previousCompositeBarContainer.classList.remove('has-composite-bar');

			if (previousPosition === CompositeBarPosition.TOP) {
				this.removeFooterHeaderArea(true);
			} else if (previousPosition === CompositeBarPosition.BOTTOM) {
				this.removeFooterHeaderArea(false);
			}
		}

		// Create new composite bar
		let newCompositeBarContainer;
		switch (newPosition) {
			case CompositeBarPosition.TOP: newCompositeBarContainer = this.createHeaderArea(); break;
			case CompositeBarPosition.TITLE: newCompositeBarContainer = this.titleContainer; break;
			case CompositeBarPosition.BOTTOM: newCompositeBarContainer = this.createFooterArea(); break;
		}
		if (isCompositeBarVisible) {

			if (this.paneCompositeBarContainer || this.paneCompositeBar.value || !newCompositeBarContainer) {
				throw new Error('Invalid composite bar state when creating the new composite bar');
			}

			newCompositeBarContainer.classList.add('has-composite-bar');
			this.paneCompositeBarContainer = prepend(newCompositeBarContainer, $('.composite-bar-container'));
			this.paneCompositeBar.value = this.createCompositeBar();
			this.paneCompositeBar.value.create(this.paneCompositeBarContainer);

			if (newPosition === CompositeBarPosition.TOP) {
				this.setHeaderArea(newCompositeBarContainer);
			} else if (newPosition === CompositeBarPosition.BOTTOM) {
				this.setFooterArea(newCompositeBarContainer);
			}
		}

		this.compositeBarPosition = newPosition;

		if (updateCompositeBarOption) {
			this.layoutCompositeBar();
		}
	}

	protected override createHeaderArea(): HTMLElement {
		const headerArea = super.createHeaderArea();

		return this.createHeaderFooterCompositeBarArea(headerArea);
	}

	protected override createFooterArea(): HTMLElement {
		const footerArea = super.createFooterArea();

		return this.createHeaderFooterCompositeBarArea(footerArea);
	}

	protected createHeaderFooterCompositeBarArea(area: HTMLElement): HTMLElement {
		if (this.headerFooterCompositeBarContainer) {
			// A pane composite part has either a header or a footer, but not both
			throw new Error('Header or Footer composite bar already exists');
		}
		this.headerFooterCompositeBarContainer = area;

		this.headerFooterCompositeBarDispoables.add(addDisposableListener(area, EventType.CONTEXT_MENU, e => {
			this.onCompositeBarAreaContextMenu(new StandardMouseEvent(getWindow(area), e));
		}));
		this.headerFooterCompositeBarDispoables.add(Gesture.addTarget(area));
		this.headerFooterCompositeBarDispoables.add(addDisposableListener(area, GestureEventType.Contextmenu, e => {
			this.onCompositeBarAreaContextMenu(new StandardMouseEvent(getWindow(area), e));
		}));

		return area;
	}

	private removeFooterHeaderArea(header: boolean): void {
		this.headerFooterCompositeBarContainer = undefined;
		this.headerFooterCompositeBarDispoables.clear();
		if (header) {
			this.removeHeaderArea();
		} else {
			this.removeFooterArea();
		}
	}

	protected createCompositeBar(): PaneCompositeBar {
		return this.instantiationService.createInstance(PaneCompositeBar, this.getCompositeBarOptions(), this.partId, this);
	}

	protected override onTitleAreaUpdate(compositeId: string): void {
		super.onTitleAreaUpdate(compositeId);

		// If title actions change, relayout the composite bar
		this.layoutCompositeBar();
	}

	async openPaneComposite(id?: string, focus?: boolean): Promise<PaneComposite | undefined> {
		if (typeof id === 'string' && this.getPaneComposite(id)) {
			return this.doOpenPaneComposite(id, focus);
		}

		await this.extensionService.whenInstalledExtensionsRegistered();

		if (typeof id === 'string' && this.getPaneComposite(id)) {
			return this.doOpenPaneComposite(id, focus);
		}

		return undefined;
	}

	private async doOpenPaneComposite(id: string, focus?: boolean): Promise<PaneComposite | undefined> {
		if (this.blockOpening) {
			// Workaround against a potential race condition when calling
			// `setPartHidden` we may end up in `openPaneComposite` again.
			// But we still want to return the result of the original call,
			// so we return the promise of the original call.
			return this.blockOpening.p;
		}

		let blockOpening: DeferredPromise<PaneComposite | undefined> | undefined;
		if (!this.layoutService.isVisible(this.partId)) {
			try {
				blockOpening = this.blockOpening = new DeferredPromise<PaneComposite | undefined>();
				this.layoutService.setPartHidden(false, this.partId);
			} finally {
				this.blockOpening = undefined;
			}
		}

		try {
			const result = this.openComposite(id, focus) as PaneComposite | undefined;
			blockOpening?.complete(result);

			return result;
		} catch (error) {
			blockOpening?.error(error);
			throw error;
		}
	}

	getPaneComposite(id: string): PaneCompositeDescriptor | undefined {
		return (this.registry as PaneCompositeRegistry).getPaneComposite(id);
	}

	getPaneComposites(): PaneCompositeDescriptor[] {
		return (this.registry as PaneCompositeRegistry).getPaneComposites()
			.sort((v1, v2) => {
				if (typeof v1.order !== 'number') {
					return 1;
				}

				if (typeof v2.order !== 'number') {
					return -1;
				}

				return v1.order - v2.order;
			});
	}

	getPinnedPaneCompositeIds(): string[] {
		return this.paneCompositeBar.value?.getPinnedPaneCompositeIds() ?? [];
	}

	getVisiblePaneCompositeIds(): string[] {
		return this.paneCompositeBar.value?.getVisiblePaneCompositeIds() ?? [];
	}

	getPaneCompositeIds(): string[] {
		return this.paneCompositeBar.value?.getPaneCompositeIds() ?? [];
	}

	getActivePaneComposite(): IPaneComposite | undefined {
		return <IPaneComposite>this.getActiveComposite();
	}

	getLastActivePaneCompositeId(): string {
		return this.getLastActiveCompositeId();
	}

	hideActivePaneComposite(): void {
		if (this.layoutService.isVisible(this.partId)) {
			this.layoutService.setPartHidden(true, this.partId);
		}

		this.hideActiveComposite();
	}

	protected focusCompositeBar(): void {
		this.paneCompositeBar.value?.focus();
	}

	override layout(width: number, height: number, top: number, left: number): void {
		if (!this.layoutService.isVisible(this.partId)) {
			return;
		}

		this.contentDimension = new Dimension(width, height);

		// Layout contents
		super.layout(this.contentDimension.width, this.contentDimension.height, top, left);

		// Layout composite bar
		this.layoutCompositeBar();

		// Add empty pane message
		this.layoutEmptyMessage();
	}

	private layoutCompositeBar(): void {
		if (this.contentDimension && this.dimension && this.paneCompositeBar.value) {
			const padding = this.compositeBarPosition === CompositeBarPosition.TITLE ? 16 : 8;
			const borderWidth = this.partId === Parts.PANEL_PART ? 0 : 1;
			let availableWidth = this.contentDimension.width - padding - borderWidth;
			availableWidth = Math.max(AbstractPaneCompositePart.MIN_COMPOSITE_BAR_WIDTH, availableWidth - this.getToolbarWidth());
			this.paneCompositeBar.value.layout(availableWidth, this.dimension.height);
		}
	}

	private layoutEmptyMessage(): void {
		const visible = !this.getActiveComposite();
		this.element.classList.toggle('empty', visible);
		if (visible) {
			this.titleLabel?.updateTitle('', '');
		}
	}

	protected getToolbarWidth(): number {
		if (!this.toolBar || this.compositeBarPosition !== CompositeBarPosition.TITLE) {
			return 0;
		}

		const activePane = this.getActivePaneComposite();
		if (!activePane) {
			return 0;
		}

		// Each toolbar item has 4px margin
		const toolBarWidth = this.toolBar.getItemsWidth() + this.toolBar.getItemsLength() * 4;
		const globalToolBarWidth = this.globalToolBar ? this.globalToolBar.getItemsWidth() + this.globalToolBar.getItemsLength() * 4 : 0;
		return toolBarWidth + globalToolBarWidth + 8; // 8px padding left
	}

	private onTitleAreaContextMenu(event: StandardMouseEvent): void {
		if (this.shouldShowCompositeBar() && this.getCompositeBarPosition() === CompositeBarPosition.TITLE) {
			return this.onCompositeBarContextMenu(event);
		} else {
			const activePaneComposite = this.getActivePaneComposite() as PaneComposite;
			const activePaneCompositeActions = activePaneComposite ? activePaneComposite.getContextMenuActions() : [];
			if (activePaneCompositeActions.length) {
				this.contextMenuService.showContextMenu({
					getAnchor: () => event,
					getActions: () => activePaneCompositeActions,
					getActionViewItem: (action, options) => this.actionViewItemProvider(action, options),
					actionRunner: activePaneComposite.getActionRunner(),
					skipTelemetry: true
				});
			}
		}
	}

	private onCompositeBarAreaContextMenu(event: StandardMouseEvent): void {
		return this.onCompositeBarContextMenu(event);
	}

	private onCompositeBarContextMenu(event: StandardMouseEvent): void {
		if (this.paneCompositeBar.value) {
			const actions: IAction[] = [...this.paneCompositeBar.value.getContextMenuActions()];
			if (actions.length) {
				this.contextMenuService.showContextMenu({
					getAnchor: () => event,
					getActions: () => actions,
					skipTelemetry: true
				});
			}
		}
	}

	protected getViewsSubmenuAction(): SubmenuAction | undefined {
		const viewPaneContainer = (this.getActivePaneComposite() as PaneComposite)?.getViewPaneContainer();
		if (viewPaneContainer) {
			const disposables = new DisposableStore();
			const scopedContextKeyService = disposables.add(this.contextKeyService.createScoped(this.element));
			scopedContextKeyService.createKey('viewContainer', viewPaneContainer.viewContainer.id);
			const menu = this.menuService.getMenuActions(ViewsSubMenu, scopedContextKeyService, { shouldForwardArgs: true, renderShortTitle: true });
			const viewsActions = getActionBarActions(menu, () => true).primary;
			disposables.dispose();
			return viewsActions.length > 1 && viewsActions.some(a => a.enabled) ? new SubmenuAction('views', localize('views', "Views"), viewsActions) : undefined;
		}
		return undefined;
	}

	protected abstract shouldShowCompositeBar(): boolean;
	protected abstract getCompositeBarOptions(): IPaneCompositeBarOptions;
	protected abstract getCompositeBarPosition(): CompositeBarPosition;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/paneCompositePartService.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/paneCompositePartService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import { assertReturnsDefined } from '../../../base/common/types.js';
import { InstantiationType, registerSingleton } from '../../../platform/instantiation/common/extensions.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';
import { IProgressIndicator } from '../../../platform/progress/common/progress.js';
import { PaneCompositeDescriptor } from '../panecomposite.js';
import { AuxiliaryBarPart } from './auxiliarybar/auxiliaryBarPart.js';
import { PanelPart } from './panel/panelPart.js';
import { SidebarPart } from './sidebar/sidebarPart.js';
import { IPaneComposite } from '../../common/panecomposite.js';
import { ViewContainerLocation, ViewContainerLocations } from '../../common/views.js';
import { IPaneCompositePartService } from '../../services/panecomposite/browser/panecomposite.js';
import { Disposable, DisposableStore } from '../../../base/common/lifecycle.js';
import { IPaneCompositePart } from './paneCompositePart.js';

export class PaneCompositePartService extends Disposable implements IPaneCompositePartService {

	declare readonly _serviceBrand: undefined;

	readonly onDidPaneCompositeOpen: Event<{ composite: IPaneComposite; viewContainerLocation: ViewContainerLocation }>;
	readonly onDidPaneCompositeClose: Event<{ composite: IPaneComposite; viewContainerLocation: ViewContainerLocation }>;

	private readonly paneCompositeParts = new Map<ViewContainerLocation, IPaneCompositePart>();

	constructor(
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		super();

		const panelPart = instantiationService.createInstance(PanelPart);
		const sideBarPart = instantiationService.createInstance(SidebarPart);
		const auxiliaryBarPart = instantiationService.createInstance(AuxiliaryBarPart);

		this.paneCompositeParts.set(ViewContainerLocation.Panel, panelPart);
		this.paneCompositeParts.set(ViewContainerLocation.Sidebar, sideBarPart);
		this.paneCompositeParts.set(ViewContainerLocation.AuxiliaryBar, auxiliaryBarPart);

		const eventDisposables = this._register(new DisposableStore());
		this.onDidPaneCompositeOpen = Event.any(...ViewContainerLocations.map(loc => Event.map(this.paneCompositeParts.get(loc)!.onDidPaneCompositeOpen, composite => { return { composite, viewContainerLocation: loc }; }, eventDisposables)));
		this.onDidPaneCompositeClose = Event.any(...ViewContainerLocations.map(loc => Event.map(this.paneCompositeParts.get(loc)!.onDidPaneCompositeClose, composite => { return { composite, viewContainerLocation: loc }; }, eventDisposables)));
	}

	openPaneComposite(id: string | undefined, viewContainerLocation: ViewContainerLocation, focus?: boolean): Promise<IPaneComposite | undefined> {
		return this.getPartByLocation(viewContainerLocation).openPaneComposite(id, focus);
	}

	getActivePaneComposite(viewContainerLocation: ViewContainerLocation): IPaneComposite | undefined {
		return this.getPartByLocation(viewContainerLocation).getActivePaneComposite();
	}

	getPaneComposite(id: string, viewContainerLocation: ViewContainerLocation): PaneCompositeDescriptor | undefined {
		return this.getPartByLocation(viewContainerLocation).getPaneComposite(id);
	}

	getPaneComposites(viewContainerLocation: ViewContainerLocation): PaneCompositeDescriptor[] {
		return this.getPartByLocation(viewContainerLocation).getPaneComposites();
	}

	getPinnedPaneCompositeIds(viewContainerLocation: ViewContainerLocation): string[] {
		return this.getPartByLocation(viewContainerLocation).getPinnedPaneCompositeIds();
	}

	getVisiblePaneCompositeIds(viewContainerLocation: ViewContainerLocation): string[] {
		return this.getPartByLocation(viewContainerLocation).getVisiblePaneCompositeIds();
	}

	getPaneCompositeIds(viewContainerLocation: ViewContainerLocation): string[] {
		return this.getPartByLocation(viewContainerLocation).getPaneCompositeIds();
	}

	getProgressIndicator(id: string, viewContainerLocation: ViewContainerLocation): IProgressIndicator | undefined {
		return this.getPartByLocation(viewContainerLocation).getProgressIndicator(id);
	}

	hideActivePaneComposite(viewContainerLocation: ViewContainerLocation): void {
		this.getPartByLocation(viewContainerLocation).hideActivePaneComposite();
	}

	getLastActivePaneCompositeId(viewContainerLocation: ViewContainerLocation): string {
		return this.getPartByLocation(viewContainerLocation).getLastActivePaneCompositeId();
	}

	private getPartByLocation(viewContainerLocation: ViewContainerLocation): IPaneCompositePart {
		return assertReturnsDefined(this.paneCompositeParts.get(viewContainerLocation));
	}

}

registerSingleton(IPaneCompositePartService, PaneCompositePartService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

````
