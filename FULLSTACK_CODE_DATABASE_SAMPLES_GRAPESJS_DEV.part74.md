---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 74
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 74 of 97)

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

---[FILE: Sorter.ts]---
Location: grapesjs-dev/packages/core/src/utils/sorter/Sorter.ts

```typescript
import { bindAll } from 'underscore';
import { $ } from '../../common';
import EditorModel from '../../editor/model/Editor';
import { off, on } from '../dom';
import { SortableTreeNode } from './SortableTreeNode';
import { DragSource } from './types';
import { DropLocationDeterminer } from './DropLocationDeterminer';
import { PlaceholderClass } from './PlaceholderClass';
import { getMergedOptions, getDocument, matches, closest, sortDom } from './SorterUtils';
import {
  SorterContainerContext,
  PositionOptions,
  SorterDragBehaviorOptions,
  SorterEventHandlers,
  Placement,
} from './types';
import Dimension from './Dimension';
import { SorterOptions } from './types';

interface SorterSource<T> {
  element?: HTMLElement;
  dragSource?: DragSource<T>;
}

export default class Sorter<T, NodeType extends SortableTreeNode<T>> {
  em: EditorModel;
  treeClass: new (model: T, dragSource?: DragSource<T>) => NodeType;
  placeholder: PlaceholderClass;
  dropLocationDeterminer: DropLocationDeterminer<T, NodeType>;

  positionOptions: PositionOptions;
  containerContext: SorterContainerContext;
  dragBehavior: SorterDragBehaviorOptions;
  eventHandlers: SorterEventHandlers<NodeType>;
  sourceNodes?: NodeType[];
  constructor(sorterOptions: SorterOptions<T, NodeType>) {
    const mergedOptions = getMergedOptions<T, NodeType>(sorterOptions);

    bindAll(
      this,
      'startSort',
      'cancelDrag',
      'recalculateTargetOnScroll',
      'rollback',
      'updateOffset',
      'handlePlaceholderMove',
      'finalizeMove',
    );
    this.containerContext = mergedOptions.containerContext;
    this.positionOptions = mergedOptions.positionOptions;
    this.dragBehavior = mergedOptions.dragBehavior;
    this.eventHandlers = {
      ...mergedOptions.eventHandlers,
      onPlaceholderPositionChange: this.handlePlaceholderMove,
      onEnd: this.finalizeMove,
    };

    this.em = sorterOptions.em;
    this.treeClass = sorterOptions.treeClass;
    this.updateOffset();
    this.em.on(this.em.Canvas.events.refresh, this.updateOffset);
    this.placeholder = this.createPlaceholder();

    this.dropLocationDeterminer = new DropLocationDeterminer({
      em: this.em,
      treeClass: this.treeClass,
      containerContext: this.containerContext,
      positionOptions: this.positionOptions,
      dragDirection: this.dragBehavior.dragDirection,
      eventHandlers: this.eventHandlers,
    });
  }

  /**
   * Picking components to move
   * @param {HTMLElement[]} sources[]
   * */
  startSort(sources: SorterSource<T>[]) {
    const { sourceNodes, sourcesWithModel } = this.getSourceNodes(sources);
    this.sourceNodes = sourceNodes;
    this.dropLocationDeterminer.startSort(sourceNodes);
    this.bindDragEventHandlers();

    this.eventHandlers.onStartSort?.(this.sourceNodes, this.containerContext.container);

    // For backward compatibility, leave it to a single node
    const model = this.sourceNodes[0]?.model;
    this.eventHandlers.legacyOnStartSort?.({
      sorter: this,
      target: model,
      // @ts-ignore
      parent: model && model.parent?.(),
      // @ts-ignore
      index: model && model.index?.(),
    });

    // For backward compatibility, leave it to a single node
    this.em.trigger('sorter:drag:start', sources[0], sourcesWithModel[0]);
  }

  validTarget(targetEl: HTMLElement | undefined, sources: SorterSource<T>[], index: number): boolean {
    if (!targetEl) return false;
    const targetModel = $(targetEl).data('model');
    if (!targetModel) return false;

    const targetNode = new this.treeClass(targetModel);
    const { sourceNodes } = this.getSourceNodes(sources);
    const canMove = sourceNodes.some((node) => targetNode.canMove(node, index));
    return canMove;
  }

  private getSourceNodes(sources: SorterSource<T>[]) {
    const validSources = sources.filter((source) => !!source.dragSource || this.findValidSourceElement(source.element));

    const sourcesWithModel: { model: T; content?: any }[] = validSources.map((source) => {
      return {
        model: source.dragSource?.model || $(source.element)?.data('model'),
        content: source.dragSource,
      };
    });
    const sortedSources = sourcesWithModel.sort((a, b) => {
      return sortDom(a.model, b.model);
    });
    const sourceNodes = sortedSources.map((source) => new this.treeClass(source.model, source.content));
    return { sourceNodes, sourcesWithModel };
  }

  /**
   * This method is should be called when the user scrolls within the container.
   */
  protected recalculateTargetOnScroll(): void {
    this.dropLocationDeterminer.recalculateTargetOnScroll();
  }

  /**
   * Called when the drag operation should be cancelled
   */
  cancelDrag(): void {
    this.triggerNullOnEndMove(true);
    this.dropLocationDeterminer.cancelDrag();
  }

  /**
   * Called to drop an item onto a valid target.
   */
  endDrag() {
    this.dropLocationDeterminer.endDrag();
  }

  private handlePlaceholderMove(elementDimension: Dimension, placement: Placement) {
    this.ensurePlaceholderElement();
    this.updatePlaceholderPosition(elementDimension, placement);
  }

  /**
   * Creates a new placeholder element for the drag-and-drop operation.
   *
   * @returns {PlaceholderClass} The newly created placeholder instance.
   */
  private createPlaceholder(): PlaceholderClass {
    return new PlaceholderClass({
      container: this.containerContext.container,
      allowNesting: this.dragBehavior.nested,
      pfx: this.containerContext.pfx,
      el: this.containerContext.placeholderElement,
      offset: {
        top: this.positionOptions.offsetTop!,
        left: this.positionOptions.offsetLeft!,
      },
    });
  }

  private ensurePlaceholderElement() {
    const el = this.placeholder.el;
    const container = this.containerContext.container;
    if (!el.ownerDocument.contains(el)) {
      container.append(this.placeholder.el);
    }
  }

  /**
   * Triggered when the offset of the editor is changed
   */
  private updateOffset() {
    const offset = this.em?.get('canvasOffset') || {};
    this.positionOptions.offsetTop = offset.top;
    this.positionOptions.offsetLeft = offset.left;
  }

  /**
   * Finds the closest valid source element within the container context.

   * @param sourceElement - The initial source element to check.
   * @returns The closest valid source element, or null if none is found.
   */
  private findValidSourceElement(sourceElement?: HTMLElement): HTMLElement | undefined {
    if (
      sourceElement &&
      !matches(sourceElement, `${this.containerContext.itemSel}, ${this.containerContext.containerSel}`)
    ) {
      sourceElement = closest(sourceElement, this.containerContext.itemSel)!;
    }

    return sourceElement;
  }

  protected bindDragEventHandlers() {
    on(this.containerContext.document, 'keydown', this.rollback);
  }

  private updatePlaceholderPosition(targetDimension: Dimension, placement: Placement) {
    this.placeholder.move(targetDimension, placement);
  }

  /**
   * Clean up event listeners that were attached during the move.
   *
   * @private
   */
  protected cleanupEventListeners(): void {
    off(this.containerContext.document, 'keydown', this.rollback);
  }

  /**
   * Finalize the move.
   *
   * @private
   */
  protected finalizeMove(): void {
    this.cleanupEventListeners();
    this.placeholder.hide();
    delete this.sourceNodes;
  }

  /**
   * Cancels the drag on Escape press ( nothing is dropped or moved )
   * @param {KeyboardEvent} e - The keyboard event object.
   */
  private rollback(e: KeyboardEvent) {
    off(this.containerContext.document, 'keydown', this.rollback);
    const ESC_KEY = 'Escape';

    if (e.key === ESC_KEY) {
      this.cancelDrag();
    }
  }

  // For the old sorter
  protected triggerNullOnEndMove(dragIsCancelled: boolean) {
    const model = this.sourceNodes?.[0].model;
    const data = {
      target: model,
      // @ts-ignore
      parent: model && model.parent?.(),
      // @ts-ignore
      index: model && model.index?.(),
    };

    this.eventHandlers.legacyOnEndMove?.(null, this, { ...data, cancelled: dragIsCancelled });
  }
}
```

--------------------------------------------------------------------------------

---[FILE: SorterUtils.ts]---
Location: grapesjs-dev/packages/core/src/utils/sorter/SorterUtils.ts

```typescript
import { $, Model, SetOptions } from '../../common';
import EditorModel from '../../editor/model/Editor';
import { isTextNode } from '../dom';
import { matches as matchesMixin } from '../mixins';
import { SortableTreeNode } from './SortableTreeNode';
import { Placement, DragDirection, SorterOptions } from './types';
import Dimension from './Dimension';

/**
 * Find the position based on passed dimensions and coordinates
 * @param {Array<Array>} dims Dimensions of nodes to parse
 * @param {number} posX X coordindate
 * @param {number} posY Y coordindate
 * @return {Object}
 * */
export function findPosition(dims: Dimension[], posX: number, posY: number) {
  const result = { index: 0, placement: 'before' as Placement };
  let leftLimit = 0;
  let xLimit = 0;
  let dimRight = 0;
  let yLimit = 0;
  let xCenter = 0;
  let yCenter = 0;
  let dimDown = 0;
  let dim: Dimension;

  // Each dim is: Top, Left, Height, Width
  for (var i = 0, len = dims.length; i < len; i++) {
    dim = dims[i];
    const { top, left, height, width } = dim;
    // Right position of the element. Left + Width
    dimRight = left + width;
    // Bottom position of the element. Top + Height
    dimDown = top + height;
    // X center position of the element. Left + (Width / 2)
    xCenter = left + width / 2;
    // Y center position of the element. Top + (Height / 2)
    yCenter = top + height / 2;
    // Skip if over the limits
    if (
      (xLimit && left > xLimit) ||
      (yLimit && yCenter >= yLimit) || // >= avoid issue with clearfixes
      (leftLimit && dimRight < leftLimit)
    )
      continue;
    result.index = i;
    // If it's not in flow (like 'float' element)
    if (!dim.dir) {
      if (posY < dimDown) yLimit = dimDown;
      //If x lefter than center
      if (posX < xCenter) {
        xLimit = xCenter;
        result.placement = 'before';
      } else {
        leftLimit = xCenter;
        result.placement = 'after';
      }
    } else {
      // If y upper than center
      if (posY < yCenter) {
        result.placement = 'before';
        break;
      } else result.placement = 'after'; // After last element
    }
  }

  return result;
}
/**
 * Get the offset of the element
 * @param  {HTMLElement} el
 * @return {Object}
 */
export function offset(el: HTMLElement) {
  const rect = el.getBoundingClientRect();

  return {
    top: rect.top + document.body.scrollTop,
    left: rect.left + document.body.scrollLeft,
  };
}
/**
 * Returns true if the element matches with selector
 * @param {Element} el
 * @param {String} selector
 * @return {Boolean}
 */
export function matches(el: HTMLElement, selector: string): boolean {
  return matchesMixin.call(el, selector);
}

/**
 * Sort according to the position in the dom
 * @param {Object} model2
 * @param {Object} model1
 */
export function sortDom(model1: any, model2: any) {
  const model1Parents = parents(model1);
  const model2Parents = parents(model2);
  // common ancesters
  const ancesters = model2Parents.filter((p: any) => model1Parents.includes(p));
  const ancester = ancesters[0];
  if (!ancester) {
    // this is never supposed to happen
    return model1.model.index() - model2.model.index();
  }
  // find siblings in the common ancester
  // the sibling is the element inside the ancester
  const s1 = model2Parents[model2Parents.indexOf(ancester) - 1];
  const s2 = model1Parents[model1Parents.indexOf(ancester) - 1];
  // order according to the position in the DOM
  return s2.index() - s1.index();
}
/**
 * Build an array of all the parents, including the component itself
 * @return {Model|null}
 */
function parents(model: any): any[] {
  return model ? [model].concat(parents(model.parent())) : [];
}

/**
 * Closest parent
 * @param {Element} el
 * @param {String} selector
 * @return {Element|null}
 */
export function closest(el: HTMLElement, selector: string): HTMLElement | undefined {
  if (!el) return;
  let elem = el.parentNode;

  while (elem && elem.nodeType === 1) {
    if (matches(elem as HTMLElement, selector)) return elem as HTMLElement;
    elem = elem.parentNode;
  }
}

/**
 * Checks if an element has styles that keep it in the document flow.
 * Considers properties like `float`, `position`, and certain display types.
 *
 * @param  {HTMLElement} el - The element to check.
 * @param  {HTMLElement} parent - The parent element for additional style checks.
 * @return {boolean} Returns `true` if the element is styled to be in flow, otherwise `false`.
 * @private
 */
export function isStyleInFlow(el: HTMLElement, parent: HTMLElement): boolean {
  if (isTextNode(el)) return false;

  const elementStyles = el.style || {};
  const $el = $(el);
  const $parent = $(parent);

  // Check overflow property
  if (elementStyles.overflow && elementStyles.overflow !== 'visible') return false;

  // Check float property
  const elementFloat = $el.css('float');
  if (elementFloat && elementFloat !== 'none') return false;

  // Check parent for flexbox display and non-column flex-direction
  if ($parent.css('display') === 'flex' && $parent.css('flex-direction') !== 'column') return false;

  // Check position property
  if (!isInFlowPosition(elementStyles.position)) return false;

  // Check tag and display properties
  return isFlowElementTag(el) || isFlowElementDisplay($el);
}

/**
 * Determines if the element's `position` style keeps it in the flow.
 *
 * @param {string} position - The position style of the element.
 * @return {boolean} Returns `true` if the position keeps the element in flow.
 * @private
 */
function isInFlowPosition(position: string): boolean {
  switch (position) {
    case 'static':
    case 'relative':
    case '':
      return true;
    default:
      return false;
  }
}

/**
 * Checks if the element's tag name represents an element typically in flow.
 *
 * @param {HTMLElement} el - The element to check.
 * @return {boolean} Returns `true` if the tag name represents a flow element.
 * @private
 */
function isFlowElementTag(el: HTMLElement): boolean {
  const flowTags = ['TR', 'TBODY', 'THEAD', 'TFOOT'];
  return flowTags.includes(el.tagName);
}

/**
 * Checks if the element's display style keeps it in flow.
 *
 * @param {JQuery} $el - The jQuery-wrapped element to check.
 * @return {boolean} Returns `true` if the display style represents a flow element.
 * @private
 */
function isFlowElementDisplay($el: JQuery): boolean {
  const display = $el.css('display');
  const flowDisplays = ['block', 'list-item', 'table', 'flex', 'grid'];
  return flowDisplays.includes(display);
}

export function getDocument(em?: EditorModel, el?: HTMLElement) {
  const elDoc = el ? el.ownerDocument : em?.Canvas.getBody().ownerDocument;
  return elDoc;
}

export function getMergedOptions<T, NodeType extends SortableTreeNode<T>>(sorterOptions: SorterOptions<T, NodeType>) {
  const defaultOptions = {
    containerContext: {
      container: '' as any,
      placeholderElement: '' as any,
      containerSel: '*',
      itemSel: '*',
      pfx: '',
      document,
    },
    positionOptions: {
      borderOffset: 10,
      relative: false,
      windowMargin: 0,
      offsetTop: 0,
      offsetLeft: 0,
      scale: 1,
      canvasRelative: false,
    },
    dragBehavior: {
      dragDirection: DragDirection.Vertical,
      nested: false,
      selectOnEnd: true,
    },
    eventHandlers: {},
  };

  const mergedOptions = {
    ...defaultOptions,
    ...sorterOptions,
    containerContext: {
      ...defaultOptions.containerContext,
      ...sorterOptions.containerContext,
    },
    positionOptions: {
      ...defaultOptions.positionOptions,
      ...sorterOptions.positionOptions,
    },
    dragBehavior: {
      ...defaultOptions.dragBehavior,
      ...sorterOptions.dragBehavior,
    },
    eventHandlers: {
      ...defaultOptions.eventHandlers,
      ...sorterOptions.eventHandlers,
    },
  };

  return mergedOptions;
}
```

--------------------------------------------------------------------------------

---[FILE: StyleManagerSorter.ts]---
Location: grapesjs-dev/packages/core/src/utils/sorter/StyleManagerSorter.ts

```typescript
import EditorModel from '../../editor/model/Editor';
import Layer from '../../style_manager/model/Layer';
import Layers from '../../style_manager/model/Layers';
import { LayerNode } from './LayerNode';
import Sorter from './Sorter';
import { SorterContainerContext, PositionOptions, SorterDragBehaviorOptions, SorterEventHandlers } from './types';

export default class StyleManagerSorter extends Sorter<Layers | Layer, LayerNode> {
  constructor({
    em,
    containerContext,
    dragBehavior,
    positionOptions = {},
    eventHandlers = {},
  }: {
    em: EditorModel;
    containerContext: SorterContainerContext;
    dragBehavior: SorterDragBehaviorOptions;
    positionOptions?: PositionOptions;
    eventHandlers?: SorterEventHandlers<LayerNode>;
  }) {
    super({
      em,
      treeClass: LayerNode,
      containerContext,
      positionOptions,
      dragBehavior,
      eventHandlers: {
        onStartSort: (sourceNodes: LayerNode[], containerElement?: HTMLElement) => {
          eventHandlers.onStartSort?.(sourceNodes, containerElement);
          this.onLayerStartSort(sourceNodes);
        },
        onDrop: (targetNode: LayerNode | undefined, sourceNodes: LayerNode[], index: number | undefined) => {
          eventHandlers.onDrop?.(targetNode, sourceNodes, index);
          this.onLayerDrop(targetNode, sourceNodes, index);
        },
        onEnd: () => {
          this.placeholder.hide();
        },
        ...eventHandlers,
      },
    });
  }

  onLayerStartSort = (sourceNodes: LayerNode[]) => {
    this.em.clearSelection();

    // For backward compatibility, leave it to a single node
    const sourceNode = sourceNodes[0];
    this.em.trigger('sorter:drag:start', sourceNode?.element, sourceNode?.model);
    this.placeholder.show();
  };

  onLayerDrop = (targetNode: LayerNode | undefined, sourceNodes: LayerNode[], index: number | undefined) => {
    if (!targetNode) {
      return;
    }
    index = typeof index === 'number' ? index : -1;
    for (let idx = 0; idx < sourceNodes.length; idx++) {
      const sourceNode = sourceNodes[idx];
      if (!targetNode.canMove(sourceNode, idx)) {
        continue;
      }
      const parent = sourceNode.getParent();
      let initialSourceIndex = -1;
      if (parent) {
        initialSourceIndex = parent.indexOfChild(sourceNode);
        parent.removeChildAt(initialSourceIndex);
      }
      index = initialSourceIndex < index ? index - 1 : index;

      targetNode.addChildAt(sourceNode, index);
    }
    this.placeholder.hide();
  };
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: grapesjs-dev/packages/core/src/utils/sorter/types.ts

```typescript
import { ComponentDefinition } from '../../dom_components/model/types';
import EditorModel from '../../editor/model/Editor';
import Dimension from './Dimension';
import { SortableTreeNode } from './SortableTreeNode';

export type ContentElement = string | ComponentDefinition;
export type ContentType = ContentElement | ContentElement[];

export interface DraggableContent {
  /**
   * Determines if a block can be moved inside a given component when the content is a function.
   *
   * This property is used to determine the validity of the drag operation.
   * @type {ComponentDefinition | undefined}
   */
  dragDef?: ComponentDefinition;
  /**
   * The content being dragged. Might be an HTML string or a [Component Defintion](/modules/Components.html#component-definition)
   */
  content?: ContentType | (() => ContentType);
}

export type DragSource<T> = DraggableContent & {
  model?: T;
};

export type Placement = 'inside' | 'before' | 'after';

export type DroppableZoneConfig = {
  ratio: number;
  minUndroppableDimension: number; // In px
  maxUndroppableDimension: number; // In px
};

export enum DragDirection {
  Vertical = 'Vertical',
  Horizontal = 'Horizontal',
  BothDirections = 'BothDirections',
}

export type CustomTarget = ({ event }: { event: MouseEvent }) => HTMLElement | null;

export interface SorterContainerContext {
  container: HTMLElement;
  containerSel: string;
  itemSel: string;
  pfx: string;
  document: Document;
  placeholderElement: HTMLElement;
  customTarget?: CustomTarget;
}

export interface PositionOptions {
  windowMargin?: number;
  borderOffset?: number;
  offsetTop?: number;
  offsetLeft?: number;
  canvasRelative?: boolean;
  relative?: boolean;
}

/**
 * Represents an event handler for the `onStartSort` event.
 *
 * @param sourceNodes The source nodes being sorted.
 * @param container The container element where the sorting is taking place.
 */
type OnStartSortHandler<NodeType> = (sourceNodes: NodeType[], container?: HTMLElement) => void;

/**
 * Represents an event handler for the `onDragStart` event.
 *
 * @param mouseEvent The mouse event associated with the drag start.
 */
type OnDragStartHandler = (mouseEvent: MouseEvent) => void;
type OnMouseMoveHandler = (mouseEvent: MouseEvent) => void;
type OnDropHandler<NodeType> = (
  targetNode: NodeType | undefined,
  sourceNodes: NodeType[],
  index: number | undefined,
) => void;
type OnTargetChangeHandler<NodeType> = (
  oldTargetNode: NodeType | undefined,
  newTargetNode: NodeType | undefined,
) => void;
type OnPlaceholderPositionChangeHandler = (targetDimension: Dimension, placement: Placement) => void;
type OnEndHandler = () => void;

/**
 * Represents a collection of event handlers for sortable tree node events.
 */
export interface SorterEventHandlers<NodeType> {
  onStartSort?: OnStartSortHandler<NodeType>;
  onDragStart?: OnDragStartHandler;
  onMouseMove?: OnMouseMoveHandler;
  onDrop?: OnDropHandler<NodeType>;
  onTargetChange?: OnTargetChangeHandler<NodeType>;
  onPlaceholderPositionChange?: OnPlaceholderPositionChangeHandler;
  onEnd?: OnEndHandler;

  // For compatibility with old sorter
  legacyOnMoveClb?: Function;
  legacyOnStartSort?: Function;
  legacyOnEndMove?: Function;
  legacyOnEnd?: Function;
}

export interface SorterDragBehaviorOptions {
  dragDirection: DragDirection;
  nested?: boolean;
  selectOnEnd?: boolean;
}

export interface SorterOptions<T, NodeType extends SortableTreeNode<T>> {
  em: EditorModel;
  treeClass: new (model: T, dragSource?: DragSource<T>) => NodeType;

  containerContext: SorterContainerContext;
  positionOptions: PositionOptions;
  dragBehavior: SorterDragBehaviorOptions;
  eventHandlers: SorterEventHandlers<NodeType>;
}
```

--------------------------------------------------------------------------------

---[FILE: common.ts]---
Location: grapesjs-dev/packages/core/test/common.ts

```typescript
import CanvasEvents from '../src/canvas/types';
import { ObjectAny } from '../src/common';
import { NumberOperation } from '../src/data_sources/model/conditional_variables/operators/NumberOperator';
import { DataComponentTypes } from '../src/data_sources/types';
import Editor from '../src/editor';
import { EditorConfig } from '../src/editor/config/config';
import EditorModel from '../src/editor/model/Editor';

// DocEl + Head + Wrapper
export const DEFAULT_CMPS = 3;

export function setupTestEditor(opts?: { withCanvas?: boolean; config?: Partial<EditorConfig> }) {
  document.body.innerHTML = '';
  const fixtures = document.createElement('div');
  fixtures.id = 'fixtures';
  const canvasWrapEl = document.createElement('div');
  canvasWrapEl.id = 'canvas-wrp';
  const editorEl = document.createElement('div');
  editorEl.id = 'editor';
  document.body.appendChild(fixtures);
  document.body.appendChild(canvasWrapEl);
  document.body.appendChild(editorEl);

  const editor = new Editor({
    mediaCondition: 'max-width',
    el: document.body.querySelector('#editor') as HTMLElement,
    avoidInlineStyle: true,
    ...opts?.config,
  });
  const em = editor.getModel();
  const dsm = em.DataSources;
  const um = em.UndoManager;
  const { Pages, Components, Canvas } = em;
  Pages.onLoad();
  const cmpRoot = Components.getWrapper()!;
  const View = Components.getType('wrapper')!.view;
  const wrapperEl = new View({
    model: cmpRoot,
    config: { ...cmpRoot.config, em },
  });
  wrapperEl.render();

  /**
   * When trying to render the canvas, seems like jest gets stuck in a loop of iframe.onload (FrameView.ts)
   * and all subsequent tests containing setTimeout are not executed.
   */
  if (opts?.withCanvas) {
    Canvas.postLoad();
    canvasWrapEl.appendChild(Canvas.render());
    editor.on(CanvasEvents.frameLoad, ({ el }) => {
      // this seems to fix the issue of the loop
      el.onload = null;
    });
    // Enable undo manager
    editor.UndoManager.postLoad();
    editor.CssComposer.postLoad();
    editor.DataSources.postLoad();
    editor.Components.postLoad();
    editor.Pages.postLoad();

    em.set({ readyLoad: true, readyCanvas: true, ready: true });
    em.loadTriggered = true;
  }

  return { editor, em, dsm, um, cmpRoot, fixtures };
}

export function fixJsDom(editor: Editor) {
  fixJsDomIframe(editor);
}

export const fixJsDomIframe = (em: EditorModel | Editor) => {
  em.on(CanvasEvents.frameLoad, ({ el, view }) => {
    // this seems to fix the issue of the loop
    el.onload = null;
  });
};

export function waitEditorEvent(em: Editor | EditorModel, event: string) {
  return new Promise((resolve) => em.once(event, resolve));
}

export function flattenHTML(html: string) {
  return html.replace(/>\s+|\s+</g, (m) => m.trim());
}

// Filter out the unique ids and selectors replaced with 'data-variable-id'
// Makes the snapshot more stable
export function filterObjectForSnapshot(obj: any, parentKey: string = ''): any {
  const result: any = {};

  for (const key in obj) {
    if (key === 'id') {
      result[key] = 'data-variable-id';
      continue;
    }

    if (key === 'selectors') {
      result[key] = obj[key].map(() => 'data-variable-id');
      continue;
    }

    if (typeof obj[key] === 'object' && obj[key] !== null) {
      if (Array.isArray(obj[key])) {
        result[key] = obj[key].map((item: any) =>
          typeof item === 'object' ? filterObjectForSnapshot(item, key) : item,
        );
      } else {
        result[key] = filterObjectForSnapshot(obj[key], key);
      }
    } else {
      result[key] = obj[key];
    }
  }

  return result;
}

const baseComponent = {
  type: 'text',
  tagName: 'h1',
};

const createContent = (content: string) => ({
  ...baseComponent,
  content,
});

/**
 * Creates a component definition for a conditional component (ifTrue or ifFalse).
 * @param type - The component type (e.g., DataConditionIfTrueType).
 * @param content - The text content.
 * @returns The component definition.
 */
const createConditionalComponentDef = (type: string, content: string) => ({
  type,
  components: [createContent(content)],
});

const DataConditionIfTrueType = DataComponentTypes.conditionTrue;
const DataConditionIfFalseType = DataComponentTypes.conditionFalse;
export const ifTrueText = 'true text';
export const newIfTrueText = 'new true text';
export const ifFalseText = 'false text';
export const newIfFalseText = 'new false text';
export const ifTrueComponentDef = createConditionalComponentDef(DataConditionIfTrueType, ifTrueText);
export const newIfTrueComponentDef = createConditionalComponentDef(DataConditionIfTrueType, newIfTrueText);
export const ifFalseComponentDef = createConditionalComponentDef(DataConditionIfFalseType, ifFalseText);
export const newIfFalseComponentDef = createConditionalComponentDef(DataConditionIfFalseType, newIfFalseText);

export function isObjectContained(received: ObjectAny, expected: ObjectAny): boolean {
  return Object.keys(expected).every((key) => {
    if (typeof expected[key] === 'object' && expected[key] !== null) {
      return isObjectContained(received[key], expected[key]);
    }

    return received?.[key] === expected?.[key];
  });
}

export const TRUE_CONDITION = {
  left: 1,
  operator: NumberOperation.greaterThan,
  right: 0,
};

export const FALSE_CONDITION = {
  left: 0,
  operator: NumberOperation.lessThan,
  right: -1,
};
```

--------------------------------------------------------------------------------

---[FILE: setup.js]---
Location: grapesjs-dev/packages/core/test/setup.js

```javascript
import 'regenerator-runtime/runtime';
import 'whatwg-fetch';
import _ from 'underscore';

const localStorage = {
  getItem(key) {
    return this[key];
  },
  setItem(key, value) {
    this[key] = value;
  },
  removeItem(key, value) {
    delete this[key];
  },
};

global._ = _;
global.__GJS_VERSION__ = '';
global.grapesjs = require('./../src').default;
global.$ = global.grapesjs.$;
global.localStorage = localStorage;
```

--------------------------------------------------------------------------------

---[FILE: test_utils.js]---
Location: grapesjs-dev/packages/core/test/test_utils.js

```javascript
module.exports = {
  storageMock() {
    var db = {};
    return {
      id: 'testStorage',
      store(data) {
        db = data;
      },
      load(keys) {
        return db;
      },
      getDb() {
        return db;
      },
    };
  },
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: grapesjs-dev/packages/core/test/specs/asset_manager/index.ts

```typescript
import AssetManager from '../../../src/asset_manager';
import EditorModel from '../../../src/editor/model/Editor';

describe('Asset Manager', () => {
  describe('Main', () => {
    let obj: AssetManager;
    const imgObj = {
      type: 'image',
      src: 'path/to/image',
      width: 101,
      height: 102,
    };

    beforeEach(() => {
      document.body.innerHTML = '<div id="asset-c"></div>';
      obj = new AssetManager(new EditorModel());
      document.body.querySelector('#asset-c')!.appendChild(obj.render());
    });

    test('Object exists', () => {
      expect(obj).toBeTruthy();
    });

    test('No assets inside', () => {
      expect(obj.getAll().length).toEqual(0);
    });

    test('Add new asset', () => {
      obj.add(imgObj);
      expect(obj.getAll().length).toEqual(1);
    });

    test('Added asset has correct data', () => {
      obj.add(imgObj);
      const asset = obj.get(imgObj.src)!;
      expect(asset.get('width')).toEqual(imgObj.width);
      expect(asset.get('height')).toEqual(imgObj.height);
      expect(asset.get('type')).toEqual(imgObj.type);
    });

    test('Add asset with src', () => {
      obj.add(imgObj.src);
      const asset = obj.get(imgObj.src)!;
      expect(asset.get('type')).toEqual('image');
      expect(asset.get('src')).toEqual(imgObj.src);
    });

    test('Add asset with more src', () => {
      obj.add([imgObj.src, imgObj.src + '2']);
      expect(obj.getAll().length).toEqual(2);
      const asset1 = obj.getAll().at(0);
      const asset2 = obj.getAll().at(1);
      expect(asset1.get('src')).toEqual(imgObj.src);
      expect(asset2.get('src')).toEqual(imgObj.src + '2');
    });

    test('Remove asset', () => {
      obj.add(imgObj);
      obj.remove(imgObj.src);
      expect(obj.getAll().length).toEqual(0);
    });

    test('Render assets', () => {
      obj.add(imgObj);
      expect(obj.render()).toBeTruthy();
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: Asset.ts]---
Location: grapesjs-dev/packages/core/test/specs/asset_manager/model/Asset.ts

```typescript
import Asset from '../../../../src/asset_manager/model/Asset';

describe('Asset', () => {
  test('Object exists', () => {
    expect(Asset).toBeTruthy();
  });

  test('Has default values', () => {
    const asset = new Asset({});
    expect(asset.get('type')).toBeFalsy();
    expect(asset.get('src')).toBeFalsy();
    expect(asset.getExtension()).toBeFalsy();
    expect(asset.getFilename()).toBeFalsy();
  });

  test('Test getFilename', () => {
    const asset = new Asset({ type: 'image', src: 'ch/eck/t.e.s.t' });
    expect(asset.getFilename()).toEqual('t.e.s.t');
    const asset2 = new Asset({ type: 'image', src: 'ch/eck/1234abc' });
    expect(asset2.getFilename()).toEqual('1234abc');
  });

  test('Test getExtension', () => {
    const asset = new Asset({ type: 'image', src: 'ch/eck/t.e.s.t' });
    expect(asset.getExtension()).toEqual('t');
    const asset2 = new Asset({ type: 'image', src: 'ch/eck/1234abc.' });
    expect(asset2.getExtension()).toEqual('');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: AssetImage.ts]---
Location: grapesjs-dev/packages/core/test/specs/asset_manager/model/AssetImage.ts

```typescript
import AssetImage from '../../../../src/asset_manager/model/AssetImage';

describe('AssetImage', () => {
  test('Object exists', () => {
    expect(AssetImage).toBeTruthy();
  });

  test('Has default values', () => {
    const obj = new AssetImage({});
    expect(obj.get('type')).toEqual('image');
    expect(obj.get('src')).toBeFalsy();
    expect(obj.get('unitDim')).toEqual('px');
    expect(obj.get('height')).toEqual(0);
    expect(obj.get('width')).toEqual(0);
    expect(obj.getExtension()).toBeFalsy();
    expect(obj.getFilename()).toBeFalsy();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: Assets.ts]---
Location: grapesjs-dev/packages/core/test/specs/asset_manager/model/Assets.ts

```typescript
import Assets from '../../../../src/asset_manager/model/Assets';

describe('Assets', () => {
  let obj: Assets;

  beforeEach(() => {
    obj = new Assets();
  });

  test('Object exists', () => {
    expect(obj).toBeTruthy();
  });

  test('Collection is empty', () => {
    expect(obj.length).toEqual(0);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: AssetImageView.ts]---
Location: grapesjs-dev/packages/core/test/specs/asset_manager/view/AssetImageView.ts

```typescript
import AssetImageView from '../../../../src/asset_manager/view/AssetImageView';
import Assets from '../../../../src/asset_manager/model/Assets';

describe('AssetImageView', () => {
  let obj: AssetImageView;

  beforeEach(() => {
    const coll = new Assets();
    const model = coll.add({ type: 'image', src: '/test' });
    obj = new AssetImageView({
      collection: new Assets(),
      config: {},
      model,
    });
    document.body.innerHTML = '<div id="fixtures"></div>';
    document.body.querySelector('#fixtures')!.appendChild(obj.render().el);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('Object exists', () => {
    expect(AssetImageView).toBeTruthy();
  });

  describe('Asset should be rendered correctly', () => {
    test('Has preview box', () => {
      const $asset = obj.$el;
      expect($asset.find('.preview').length).toEqual(1);
    });

    test('Has meta box', () => {
      const $asset = obj.$el;
      expect($asset.find('.meta').length).toEqual(1);
    });

    test('Has close button', () => {
      const $asset = obj.$el;
      expect($asset.find('[data-toggle=asset-remove]').length).toEqual(1);
    });
  });

  test('Could be selected', () => {
    const spy = jest.spyOn(obj, 'updateTarget');
    obj.$el.trigger('click');
    expect(obj.$el.attr('class')).toContain('highlight');
    expect(spy).toHaveBeenCalled();
  });

  test('Could be chosen', () => {
    const spy = jest.spyOn(obj, 'updateTarget');
    obj.$el.trigger('dblclick');
    expect(spy).toHaveBeenCalled();
  });

  test('Could be removed', () => {
    const fn = jest.fn();
    obj.model.on('remove', fn);
    obj.onRemove({ stopImmediatePropagation() {} } as any);
    expect(fn).toBeCalledTimes(1);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: AssetsView.ts]---
Location: grapesjs-dev/packages/core/test/specs/asset_manager/view/AssetsView.ts

```typescript
import AssetsView from '../../../../src/asset_manager/view/AssetsView';
import FileUploader from '../../../../src/asset_manager/view/FileUploader';
import Assets from '../../../../src/asset_manager/model/Assets';

describe('AssetsView', () => {
  let obj: AssetsView;
  let coll: Assets;

  beforeEach(() => {
    coll = new Assets();
    obj = new AssetsView({
      config: {},
      collection: coll,
      globalCollection: new Assets(),
      fu: new FileUploader({}),
    });
    document.body.innerHTML = '<div id="fixtures"></div>';
    obj.render();
    document.body.querySelector('#fixtures')!.appendChild(obj.el);
  });

  afterEach(() => {
    obj.collection.reset();
  });

  test('Object exists', () => {
    expect(AssetsView).toBeTruthy();
  });

  test('Collection is empty', () => {
    expect(obj.getAssetsEl()!.innerHTML).toBeFalsy();
  });

  test('Add new asset', () => {
    const spy = jest.spyOn(obj, 'addAsset');
    coll.add({ src: 'test' });
    expect(spy).toBeCalledTimes(1);
  });

  test('Render new asset', () => {
    coll.add({ src: 'test' });
    expect(obj.getAssetsEl()!.innerHTML).toBeTruthy();
  });

  test('Render correctly new image asset', () => {
    coll.add({ type: 'image', src: 'test' });
    const asset = obj.getAssetsEl()!.firstChild as HTMLElement;
    expect(asset.tagName).toEqual('DIV');
    expect(asset.innerHTML).toBeTruthy();
  });

  test('Clean collection from asset', () => {
    const model = coll.add({ src: 'test' });
    coll.remove(model);
    expect(obj.getAssetsEl()!.innerHTML).toBeFalsy();
  });

  test('Deselect works', () => {
    coll.add([{}, {}]);
    const $asset = obj.$el.children().first();
    $asset.attr('class', obj.pfx + 'highlight');
    coll.trigger('deselectAll');
    expect($asset.attr('class')).toBeFalsy();
  });

  test('Returns not empty assets element', () => {
    expect(obj.getAssetsEl()).toBeTruthy();
  });

  describe('Assets input is enabled', () => {
    let obj: AssetsView;
    let coll = new Assets();

    beforeEach(() => {
      const config = {
        showUrlInput: true,
      };

      obj = new AssetsView({
        config: config,
        collection: coll,
        globalCollection: new Assets(),
        fu: new FileUploader({}),
      });
      document.body.innerHTML = '<div id="fixtures"></div>';
      obj.render();
      document.body.querySelector('#fixtures')!.appendChild(obj.el);
    });

    test('Returns not empty url input', () => {
      expect(obj.getAddInput()).toBeTruthy();
    });

    test('Add image asset from input string', () => {
      obj.getAddInput()!.value = 'test';
      obj.handleSubmit({
        preventDefault() {},
      } as Event);
      const asset = obj.options.globalCollection.at(0);
      expect(asset.get('src')).toEqual('test');
    });
  });

  describe('Assets inputs is disabled', () => {
    let obj: AssetsView;
    let coll: Assets;

    beforeEach(() => {
      const config = {
        showUrlInput: false,
      };

      coll = new Assets();
      obj = new AssetsView({
        config: config,
        collection: coll,
        globalCollection: new Assets(),
        fu: new FileUploader({}),
      });
      document.body.innerHTML = '<div id="fixtures"></div>';
      obj.render();
      document.body.querySelector('#fixtures')!.appendChild(obj.el);
    });

    test('No presence of url input', () => {
      expect(obj.getAddInput()).toBeFalsy();
    });
  });
});
```

--------------------------------------------------------------------------------

````
