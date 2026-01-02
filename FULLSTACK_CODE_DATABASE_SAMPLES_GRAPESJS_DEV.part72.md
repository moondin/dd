---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 72
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 72 of 97)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - grapesjs-dev
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/grapesjs-dev
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: BaseComponentNode.ts]---
Location: grapesjs-dev/packages/core/src/utils/sorter/BaseComponentNode.ts

```typescript
import Component from '../../dom_components/model/Component';
import { SortableTreeNode } from './SortableTreeNode';

/**
 * BaseComponentNode is an abstract class that provides basic operations
 * for managing component nodes in a tree structure. It extends
 * SortableTreeNode to handle sorting behavior for components.
 * Subclasses must implement the `view` and `element` methods.
 */
export abstract class BaseComponentNode extends SortableTreeNode<Component> {
  private displayCache: Map<Component, boolean> = new Map();

  /**
   * Get the list of child components.
   * @returns {BaseComponentNode[] | null} - The list of children wrapped in
   * BaseComponentNode, or null if there are no children.
   */
  getChildren(): BaseComponentNode[] | null {
    return this.getDisplayedChildren();
  }

  /**
   * Get the list of displayed children, i.e., components that have a valid HTML element.
   * Cached values are used to avoid recalculating the display status unnecessarily.
   * @returns {BaseComponentNode[] | null} - The list of displayed children wrapped in
   * BaseComponentNode, or null if there are no displayed children.
   */
  private getDisplayedChildren(): BaseComponentNode[] | null {
    const children = this.model.components();
    const displayedChildren = children.filter((child) => this.isChildDisplayed(child));

    return displayedChildren.map((comp: Component) => new (this.constructor as any)(comp));
  }

  /**
   * Check if a child is displayed, using cached value if available.
   * @param {Component} child - The child component to check.
   * @returns {boolean} - Whether the child is displayed.
   */
  private isChildDisplayed(child: Component): boolean {
    // Check if display status is cached
    if (this.displayCache.has(child)) {
      return this.displayCache.get(child)!;
    }

    const element = child.getEl();
    const displayed = isDisplayed(element);

    // Cache the display status
    this.displayCache.set(child, displayed);

    return displayed;
  }

  /**
   * Get the parent component of this node.
   * @returns {BaseComponentNode | null} - The parent wrapped in BaseComponentNode,
   * or null if no parent exists.
   */
  getParent(): BaseComponentNode | null {
    const parent = this.model.parent();
    return parent ? new (this.constructor as any)(parent) : null;
  }

  /**
   * Add a child component to this node at the specified index.
   * @param {BaseComponentNode} node - The child node to add.
   * @param {number} displayIndex - The visual index at which to insert the child.
   * @param {{ action: string }} options - Options for the operation, with the default action being 'add-component'.
   * @returns {BaseComponentNode} - The newly added child node wrapped in BaseComponentNode.
   */
  addChildAt(
    node: BaseComponentNode,
    displayIndex: number,
    options: { action: string } = { action: 'add-component' },
  ): BaseComponentNode {
    const insertingTextableIntoText = this.model?.isInstanceOf?.('text') && node?.model?.get?.('textable');

    if (insertingTextableIntoText) {
      // @ts-ignore: Handle inserting textable components
      return this.model?.getView?.()?.insertComponent?.(node?.model, { action: options.action });
    }

    const newModel = this.model.components().add(node.model, {
      at: this.getRealIndex(displayIndex),
      action: options.action,
    });

    return new (this.constructor as any)(newModel);
  }

  /**
   * Remove a child component at the specified index.
   * @param {number} displayIndex - The visual index of the child to remove.
   * @param {{ temporary: boolean }} options - Whether to temporarily remove the child.
   */
  removeChildAt(displayIndex: number, options: { temporary: boolean } = { temporary: false }): void {
    const child = this.model.components().at(this.getRealIndex(displayIndex));
    if (child) {
      this.model.components().remove(child, options as any);
    }
  }

  /**
   * Get the visual index of a child node within the displayed children.
   * @param {BaseComponentNode} node - The child node to locate.
   * @returns {number} - The index of the child node, or -1 if not found.
   */
  indexOfChild(node: BaseComponentNode): number {
    return this.getDisplayIndex(node);
  }

  /**
   * Get the index of the given node within the displayed children.
   * @param {BaseComponentNode} node - The node to find.
   * @returns {number} - The display index of the node, or -1 if not found.
   */
  private getDisplayIndex(node: BaseComponentNode): number {
    const displayedChildren = this.getDisplayedChildren();
    return displayedChildren ? displayedChildren.findIndex((displayedNode) => displayedNode.model === node.model) : -1;
  }

  /**
   * Convert a display index to the actual index within the component's children array.
   * @param {number} index - The display index to convert.
   * @returns {number} - The corresponding real index, or -1 if not found.
   */
  getRealIndex(index: number): number {
    if (index === -1) return -1;

    let displayedCount = 0;
    const children = this.model.components();

    for (let i = 0; i < children.length; i++) {
      const child = children.at(i);
      const displayed = this.isChildDisplayed(child);

      if (displayed) displayedCount++;
      if (displayedCount === index + 1) return i;
    }

    return -1;
  }

  /**
   * Check if a source node can be moved to a specified index within this component.
   * @param {BaseComponentNode} source - The source node to move.
   * @param {number} index - The display index to move the source to.
   * @returns {boolean} - True if the move is allowed, false otherwise.
   */
  canMove(source: BaseComponentNode, index: number): boolean {
    return this.model.em.Components.canMove(this.model, source.model, this.getRealIndex(index)).result;
  }

  equals(node?: BaseComponentNode): node is BaseComponentNode {
    return !!node?._model && this._model.getId() === node._model.getId();
  }

  /**
   * Abstract method to get the view associated with this component.
   * Subclasses must implement this method.
   * @abstract
   */
  abstract get view(): any;

  /**
   * Abstract method to get the DOM element associated with this component.
   * Subclasses must implement this method.
   * @abstract
   */
  abstract get element(): HTMLElement | undefined;

  /**
   * Reset the state of the node by clearing its status and disabling editing.
   */
  restNodeState(): void {
    this.clearState();
    const { model } = this;
    this.setContentEditable(false);
    model.em.getEditing() === model && this.disableEditing();
  }

  /**
   * Set the contentEditable property of the node's DOM element.
   * @param {boolean} value - True to make the content editable, false to disable editing.
   */
  setContentEditable(value: boolean): void {
    if (this.element && this.isTextNode()) {
      this.element.contentEditable = value ? 'true' : 'false';
    }
  }

  /**
   * Disable editing capabilities for the component's view.
   * This method depends on the presence of the `disableEditing` method in the view.
   */
  private disableEditing(): void {
    // @ts-ignore
    this.view?.disableEditing?.();
  }

  /**
   * Clear the current state of the node by resetting its status.
   */
  private clearState(): void {
    this.model.set?.('status', '');
  }

  /**
   * Set the state of the node to 'selected-parent'.
   */
  setSelectedParentState(): void {
    this.model.set?.('status', 'selected-parent');
  }

  /**
   * Determine if the component is a text node.
   * @returns {boolean} - True if the component is a text node, false otherwise.
   */
  isTextNode(): boolean {
    return this.model.isInstanceOf?.('text');
  }

  /**
   * Determine if the component is textable.
   * @returns {boolean} - True if the component is textable, false otherwise.
   */
  isTextable(): boolean {
    return this.model.get?.('textable');
  }
}

/**
 * Function to check if an element is displayed in the DOM.
 * @param {HTMLElement | undefined} element - The element to check.
 * @returns {boolean} - Whether the element is displayed.
 */
function isDisplayed(element: HTMLElement | undefined): boolean {
  if (!element) return false;
  return (
    typeof element === 'object' &&
    element.nodeType === Node.ELEMENT_NODE &&
    window.getComputedStyle(element).display !== 'none' &&
    element.offsetWidth > 0 &&
    element.offsetHeight > 0
  );
}
```

--------------------------------------------------------------------------------

---[FILE: CanvasComponentNode.ts]---
Location: grapesjs-dev/packages/core/src/utils/sorter/CanvasComponentNode.ts

```typescript
import { BaseComponentNode } from './BaseComponentNode';

export default class CanvasComponentNode extends BaseComponentNode {
  protected _dropAreaConfig = {
    ratio: 0.8,
    minUndroppableDimension: 1, // In px
    maxUndroppableDimension: 15, // In px
  };
  /**
   * Get the associated view of this component.
   * @returns The view associated with the component, or undefined if none.
   */
  get view() {
    return this.model.getView?.();
  }

  /**
   * Get the associated element of this component.
   * @returns The Element associated with the component, or undefined if none.
   */
  get element() {
    return this.model.getEl?.();
  }
}
```

--------------------------------------------------------------------------------

---[FILE: CanvasNewComponentNode.ts]---
Location: grapesjs-dev/packages/core/src/utils/sorter/CanvasNewComponentNode.ts

```typescript
import { isFunction } from 'underscore';
import CanvasComponentNode from './CanvasComponentNode';
import { getSymbolMain, getSymbolTop, isSymbol, isSymbolMain } from '../../dom_components/model/SymbolUtils';
import Component from '../../dom_components/model/Component';
import { ContentElement, ContentType } from './types';

type CanMoveSource = Component | ContentType;

export default class CanvasNewComponentNode extends CanvasComponentNode {
  canMove(source: CanvasNewComponentNode, index: number): boolean {
    const realIndex = this.getRealIndex(index);
    const { model: symbolModel, content, dragDef } = source._dragSource;

    const canMoveSymbol = !symbolModel || !this.isSourceSameSymbol(symbolModel);
    const sourceContent: CanMoveSource = (isFunction(content) ? dragDef : content) || source.model;

    if (Array.isArray(sourceContent)) {
      return (
        canMoveSymbol && sourceContent.every((contentItem, i) => this.canMoveSingleContent(contentItem, realIndex + i))
      );
    }

    return canMoveSymbol && this.canMoveSingleContent(sourceContent, realIndex);
  }

  private canMoveSingleContent(contentItem: ContentElement | Component, index: number): boolean {
    return this.model.em.Components.canMove(this.model, contentItem, index).result;
  }

  addChildAt(node: CanvasNewComponentNode, index: number): CanvasNewComponentNode {
    const dragSource = node._dragSource;
    const dragSourceContent = dragSource.content!;
    const insertingTextableIntoText = this.isTextNode() && node.isTextable();
    const content = isFunction(dragSourceContent) ? dragSourceContent() : dragSourceContent;

    if (Array.isArray(content)) {
      return this.addMultipleChildren(content, index, insertingTextableIntoText);
    }

    return this.addSingleChild(content, index, insertingTextableIntoText);
  }

  /**
   * Adds a single content item to the current node.
   * @param {ContentType} content - The content to add.
   * @param {number} index - The index where the content is to be added.
   * @param {boolean} insertingTextableIntoText - Whether the operation involves textable content.
   * @returns {CanvasNewComponentNode} - The newly added node.
   */
  private addSingleChild(
    content: ContentType,
    index: number,
    insertingTextableIntoText: boolean,
  ): CanvasNewComponentNode {
    let model;
    if (insertingTextableIntoText) {
      // @ts-ignore
      model = this.model?.getView?.()?.insertComponent?.(content, { action: 'add-component' });
    } else {
      model = this.model.components().add(content, { at: this.getRealIndex(index), action: 'add-component' });
    }
    return new (this.constructor as any)(model);
  }

  /**
   * Adds multiple content items as children, looping through the array.
   * @param {any[]} contentArray - Array of content items
   * @param {number} index - Index to start adding children
   * @param {boolean} insertingTextableIntoText - Whether inserting textable content
   * @returns {CanvasNewComponentNode} The last added node
   */
  private addMultipleChildren(
    contentArray: ContentType[],
    index: number,
    insertingTextableIntoText: boolean,
  ): CanvasNewComponentNode {
    let lastNode: CanvasNewComponentNode | undefined;
    contentArray.forEach((contentItem, i) => {
      lastNode = this.addSingleChild(contentItem, index + i, insertingTextableIntoText);
    });
    return lastNode!;
  }

  /**
   * Checks if the source component belongs to the same symbol model as the current component.
   * @param {Component | undefined} symbolModel - Symbol model to compare
   * @returns {boolean} Whether the source is the same symbol
   */
  private isSourceSameSymbol(symbolModel: Component | undefined) {
    if (isSymbol(this.model)) {
      const targetRootSymbol = getSymbolTop(this.model);
      const targetMainSymbol = isSymbolMain(targetRootSymbol) ? targetRootSymbol : getSymbolMain(targetRootSymbol);

      if (targetMainSymbol === symbolModel) {
        return true;
      }
    }
    return false;
  }

  set content(content: ContentType | (() => ContentType)) {
    this._dragSource.content = content;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ComponentSorter.ts]---
Location: grapesjs-dev/packages/core/src/utils/sorter/ComponentSorter.ts

```typescript
import { bindAll } from 'underscore';
import { CanvasSpotBuiltInTypes } from '../../canvas/model/CanvasSpot';
import Component from '../../dom_components/model/Component';
import EditorModel from '../../editor/model/Editor';
import { getPointerEvent } from '../dom';
import { BaseComponentNode } from './BaseComponentNode';
import Sorter from './Sorter';
import {
  SorterContainerContext,
  PositionOptions,
  SorterDragBehaviorOptions,
  SorterEventHandlers,
  DragSource,
} from './types';
import Block from '../../block_manager/model/Block';

const targetSpotType = CanvasSpotBuiltInTypes.Target;

const spotTarget = {
  id: 'sorter-target',
  type: targetSpotType,
};

export default class ComponentSorter<NodeType extends BaseComponentNode> extends Sorter<Component, NodeType> {
  targetIsText: boolean = false;
  // For event triggering
  __currentBlock?: Block;
  constructor({
    em,
    treeClass,
    containerContext,
    dragBehavior,
    positionOptions = {},
    eventHandlers = {},
  }: {
    em: EditorModel;
    treeClass: new (model: Component, dragSource?: DragSource<Component>) => NodeType;
    containerContext: SorterContainerContext;
    dragBehavior: SorterDragBehaviorOptions;
    positionOptions?: PositionOptions;
    eventHandlers?: SorterEventHandlers<NodeType>;
  }) {
    super({
      em,
      treeClass,
      containerContext,
      positionOptions,
      dragBehavior,
      eventHandlers: {
        ...eventHandlers,
        onStartSort: (sourceNodes: NodeType[], containerElement?: HTMLElement) => {
          eventHandlers.onStartSort?.(sourceNodes, containerElement);
          this.onStartSort();
        },
        onDrop: (targetNode: NodeType | undefined, sourceNodes: NodeType[], index: number | undefined) => {
          eventHandlers.onDrop?.(targetNode, sourceNodes, index);
          this.onDrop(targetNode, sourceNodes, index);
        },
        onTargetChange: (oldTargetNode: NodeType | undefined, newTargetNode: NodeType | undefined) => {
          eventHandlers.onTargetChange?.(oldTargetNode, newTargetNode);
          this.onTargetChange(oldTargetNode, newTargetNode);
        },
        onMouseMove: (mouseEvent) => {
          eventHandlers.onMouseMove?.(mouseEvent);
          this.onMouseMove(mouseEvent);
        },
      },
    });

    bindAll(this, 'handleScrollEvent');
  }

  private onStartSort() {
    this.em.clearSelection();
    this.setAutoCanvasScroll(true);
  }

  protected bindDragEventHandlers() {
    this.em.on('frame:scroll', this.handleScrollEvent);
    super.bindDragEventHandlers();
  }

  protected cleanupEventListeners(): void {
    this.em.off('frame:scroll', this.handleScrollEvent);
    super.cleanupEventListeners();
  }

  handleScrollEvent(...agrs: any[]) {
    const frame = agrs?.[0]?.frame;
    const canvasScroll = this.em.Canvas.getCanvasView().frame === frame;
    if (canvasScroll) this.recalculateTargetOnScroll();
  }

  private onMouseMove = (mouseEvent: MouseEvent) => {
    const insertingTextableIntoText = this.targetIsText && this.sourceNodes?.some((node) => node.isTextable());
    if (insertingTextableIntoText) {
      this.updateTextViewCursorPosition(mouseEvent);
    }
  };

  /**
   * Handles the drop action by moving the source nodes to the target node.
   * Calls appropriate handlers based on whether the move was successful or not.
   *
   * @param targetNode - The node where the source nodes will be dropped.
   * @param sourceNodes - The nodes being dropped.
   * @param index - The index at which to drop the source nodes.
   */
  private onDrop = (targetNode: NodeType | undefined, sourceNodes: NodeType[], index: number | undefined): void => {
    const at = typeof index === 'number' ? index : -1;
    if (targetNode && sourceNodes.length > 0) {
      const addedNodes = this.handleNodeAddition(targetNode, sourceNodes, at);
      if (addedNodes.length === 0) this.triggerNullOnEndMove(false);
    } else {
      this.triggerNullOnEndMove(true);
    }

    targetNode?.restNodeState();
    this.placeholder.hide();
  };

  /**
   * Handles the addition of multiple source nodes to the target node.
   * If the move is valid, adds the nodes at the specified index and increments the index.
   *
   * @param targetNode - The target node where source nodes will be added.
   * @param sourceNodes - The nodes being added.
   * @param index - The initial index at which to add the source nodes.
   * @returns The list of successfully added nodes.
   */
  private handleNodeAddition(targetNode: NodeType, sourceNodes: NodeType[], index: number): NodeType[] {
    return sourceNodes.reduce((addedNodes, sourceNode) => {
      if (!targetNode.canMove(sourceNode, index)) return addedNodes;
      if (this.isPositionChanged(targetNode, sourceNode, index)) {
        const { index: lastIndex, addedNode } = this.moveNode(targetNode, sourceNode, index);
        addedNodes.push(addedNode);
        index = lastIndex;
      }
      index++; // Increment the index
      return addedNodes;
    }, [] as NodeType[]);
  }

  /**
   * Determines if a source node position has changed.
   *
   * @param targetNode - The node where the source node will be moved.
   * @param sourceNode - The node being moved.
   * @param index - The index at which to move the source node.
   * @returns Whether the node can be moved.
   */
  private isPositionChanged(targetNode: NodeType, sourceNode: NodeType, index: number): boolean {
    const parent = sourceNode.getParent();
    const initialSourceIndex = parent ? parent.indexOfChild(sourceNode) : -1;
    if (parent?.model.cid === targetNode.model.cid && initialSourceIndex < index) {
      index--; // Adjust index if moving within the same collection and after the initial position
    }

    const isSameCollection = parent?.model.cid === targetNode.model.cid;
    const isSameIndex = initialSourceIndex === index;
    const insertingTextableIntoText = this.targetIsText && sourceNode.isTextable();

    return !(isSameCollection && isSameIndex && !insertingTextableIntoText);
  }

  /**
   * Moves a source node to the target node at the specified index, handling edge cases.
   *
   * @param targetNode - The node where the source node will be moved.
   * @param sourceNode - The node being moved.
   * @param index - The index at which to move the source node.
   * @returns An object containing the added node and its new index, or null if it couldn't be moved.
   */
  private moveNode(targetNode: NodeType, sourceNode: NodeType, index: number) {
    const parent = sourceNode.getParent();
    if (parent) {
      const initialSourceIndex = parent.indexOfChild(sourceNode);
      parent.removeChildAt(initialSourceIndex, { temporary: true });

      if (parent.model.cid === targetNode.model.cid && initialSourceIndex < index) {
        index--; // Adjust index if moving within the same collection and after the initial position
      }
    }
    const addedNode = targetNode.addChildAt(sourceNode, index, { action: 'move-component' }) as NodeType;
    addedNode && this.triggerEndMoveEvent(addedNode);

    return { addedNode, index };
  }

  /**
   * Triggers the end move event for a node that was added to the target.
   *
   * @param addedNode - The node that was moved and added to the target.
   */
  private triggerEndMoveEvent(addedNode: NodeType): void {
    this.eventHandlers.legacyOnEndMove?.(addedNode.model, this, {
      target: addedNode.model,
      // @ts-ignore
      parent: addedNode.model && addedNode.model.parent?.(),
      // @ts-ignore
      index: addedNode.model && addedNode.model.index?.(),
    });
  }

  /**
   * Finalize the move by removing any helpers and selecting the target model.
   *
   * @private
   */
  protected finalizeMove(): void {
    this.em?.Canvas.removeSpots(spotTarget);
    this.sourceNodes?.forEach((node) => node.restNodeState());
    this.setAutoCanvasScroll(false);
    super.finalizeMove();
  }

  private onTargetChange = (oldTargetNode: NodeType | undefined, newTargetNode: NodeType | undefined) => {
    oldTargetNode?.restNodeState();
    const { Canvas } = this.em;
    if (!newTargetNode) {
      this.placeholder.hide();
      Canvas.removeSpots(spotTarget);
      return;
    }
    newTargetNode?.setSelectedParentState();
    this.targetIsText = newTargetNode.isTextNode();
    const insertingTextableIntoText = this.targetIsText && this.sourceNodes?.some((node) => node.isTextable());
    if (insertingTextableIntoText) {
      newTargetNode.setContentEditable(true);
      this.placeholder.hide();
    } else {
      this.placeholder.show();
    }

    const { Select, Hover, Spacing } = CanvasSpotBuiltInTypes;
    [Select, Hover, Spacing].forEach((type) => Canvas.removeSpots({ type }));
    Canvas.addSpot({ ...spotTarget, component: newTargetNode.model });
  };

  private updateTextViewCursorPosition(e: any) {
    const { em } = this;
    if (!em) return;
    const Canvas = em.Canvas;
    const targetDoc = Canvas.getDocument();
    let range = null;

    const poiner = getPointerEvent(e);

    // @ts-ignore
    if (targetDoc.caretPositionFromPoint) {
      // New standard method
      // @ts-ignore
      const caretPosition = targetDoc.caretPositionFromPoint(poiner.clientX, poiner.clientY);
      if (caretPosition) {
        range = targetDoc.createRange();
        range.setStart(caretPosition.offsetNode, caretPosition.offset);
      }
    } else if (targetDoc.caretRangeFromPoint) {
      // Fallback for older browsers
      range = targetDoc.caretRangeFromPoint(poiner.clientX, poiner.clientY);
    } else if (e.rangeParent) {
      // Firefox fallback
      range = targetDoc.createRange();
      range.setStart(e.rangeParent, e.rangeOffset);
    }

    const sel = Canvas.getWindow().getSelection();
    Canvas.getFrameEl().focus();
    sel?.removeAllRanges();
    range && sel?.addRange(range);
  }

  /**
   * Change Autoscroll while sorting
   * @param {Boolean} active
   */
  private setAutoCanvasScroll(active?: boolean) {
    const { em } = this;
    const cv = em?.Canvas;

    // Avoid updating body className as it causes a huge repaint
    // Noticeable with "fast" drag of blocks
    cv && (active ? cv.startAutoscroll() : cv.stopAutoscroll());
  }
}
```

--------------------------------------------------------------------------------

---[FILE: Dimension.ts]---
Location: grapesjs-dev/packages/core/src/utils/sorter/Dimension.ts

```typescript
import CanvasModule from '../../canvas';
import { Placement, DroppableZoneConfig } from './types';

/**
 * A class representing dimensions of an element, including position, size, offsets, and other metadata.
 * Provides functionality to calculate differences between current and previous dimensions and update them.
 */
export default class Dimension {
  public top: number;
  public left: number;
  public height: number;
  public width: number;
  public offsets: ReturnType<CanvasModule['getElementOffsets']>;
  public dir?: boolean;

  /**
   * Initializes the DimensionCalculator with the given initial dimensions.
   *
   * @param initialDimensions - The initial dimensions containing `top`, `left`, `height`, `width`, and other properties.
   */
  constructor(initialDimensions: {
    top: number;
    left: number;
    height: number;
    width: number;
    offsets: ReturnType<CanvasModule['getElementOffsets']>;
    dir?: boolean;
    el?: HTMLElement;
    indexEl?: number;
  }) {
    this.top = initialDimensions.top;
    this.left = initialDimensions.left;
    this.height = initialDimensions.height;
    this.width = initialDimensions.width;
    this.offsets = initialDimensions.offsets;
    this.dir = initialDimensions.dir;
  }

  /**
   * Calculates the difference between the current and previous dimensions.
   * If there are no previous dimensions, it will return zero differences.
   *
   * @returns An object containing the differences in `top` and `left` positions.
   */
  public calculateDimensionDifference(dimension: Dimension): { topDifference: number; leftDifference: number } {
    const topDifference = dimension.top - this.top;
    const leftDifference = dimension.left - this.left;

    return { topDifference, leftDifference };
  }

  /**
   * Updates the current dimensions by adding the given differences to the `top` and `left` values.
   *
   * @param topDifference - The difference to add to the current `top` value.
   * @param leftDifference - The difference to add to the current `left` value.
   */
  public adjustDimensions(difference: { topDifference: number; leftDifference: number }): Dimension {
    this.top += difference.topDifference;
    this.left += difference.leftDifference;

    return this;
  }

  /**
   * Determines the placement ('before' or 'after') based on the X and Y coordinates and center points.
   *
   * @param {number} mouseX X coordinate of the mouse
   * @param {number} mouseY Y coordinate of the mouse
   * @return {Placement} 'before' or 'after'
   */
  public determinePlacement(mouseX: number, mouseY: number): Placement {
    const xCenter = this.left + this.width / 2;
    const yCenter = this.top + this.height / 2;

    if (this.dir) {
      return mouseY < yCenter ? 'before' : 'after';
    } else {
      return mouseX < xCenter ? 'before' : 'after';
    }
  }

  /**
   * Compares the current dimension object with another dimension to check equality.
   *
   * @param {Dimension} dimension - The dimension to compare against.
   * @returns {boolean} True if the dimensions are equal, otherwise false.
   */
  public equals(dimension: Dimension | undefined): boolean {
    if (!dimension) return false;
    return (
      this.top === dimension.top &&
      this.left === dimension.left &&
      this.height === dimension.height &&
      this.width === dimension.width &&
      this.dir === dimension.dir &&
      JSON.stringify(this.offsets) === JSON.stringify(dimension.offsets)
    );
  }

  /**
   * Creates a clone of the current Dimension object.
   *
   * @returns {Dimension} A new Dimension object with the same properties.
   */
  public clone(): Dimension {
    return new Dimension({
      top: this.top,
      left: this.left,
      height: this.height,
      width: this.width,
      offsets: { ...this.offsets }, // Shallow copy of offsets
      dir: this.dir,
    });
  }

  public getDropArea(config: DroppableZoneConfig): Dimension {
    const dropZone = this.clone();
    // Adjust width
    const { newSize: newWidth, newPosition: newLeft } = this.adjustDropDimension(this.width, this.left, config);
    dropZone.width = newWidth;
    dropZone.left = newLeft;

    // Adjust height
    const { newSize: newHeight, newPosition: newTop } = this.adjustDropDimension(this.height, this.top, config);
    dropZone.height = newHeight;
    dropZone.top = newTop;

    return dropZone;
  }

  private adjustDropDimension(
    size: number,
    position: number,
    config: DroppableZoneConfig,
  ): { newSize: number; newPosition: number } {
    const { ratio, minUndroppableDimension: minUnDroppableDimension, maxUndroppableDimension } = config;

    let undroppableDimension = (size * (1 - ratio)) / 2;
    undroppableDimension = Math.max(undroppableDimension, minUnDroppableDimension);
    undroppableDimension = Math.min(undroppableDimension, maxUndroppableDimension);
    const newSize = size - undroppableDimension * 2;
    const newPosition = position + undroppableDimension;

    return { newSize, newPosition };
  }

  /**
   * Checks if the given coordinates are within the bounds of this dimension instance.
   *
   * @param {number} x - The X coordinate to check.
   * @param {number} y - The Y coordinate to check.
   * @returns {boolean} - True if the coordinates are within bounds, otherwise false.
   */
  public isWithinBounds(x: number, y: number): boolean {
    return x >= this.left && x <= this.left + this.width && y >= this.top && y <= this.top + this.height;
  }
}
```

--------------------------------------------------------------------------------

````
