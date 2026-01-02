---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 33
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 33 of 97)

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

---[FILE: SelectComponent.ts]---
Location: grapesjs-dev/packages/core/src/commands/view/SelectComponent.ts

```typescript
import { bindAll, debounce, isElement } from 'underscore';
import { CanvasSpotBuiltInTypes } from '../../canvas/model/CanvasSpot';
import Component from '../../dom_components/model/Component';
import Toolbar from '../../dom_components/model/Toolbar';
import { ComponentsEvents } from '../../dom_components/types';
import ToolbarView from '../../dom_components/view/ToolbarView';
import { isDoc, isTaggableNode, isVisible, off, on } from '../../utils/dom';
import { getComponentModel, getComponentView, hasWin, isObject } from '../../utils/mixins';
import { CommandObject } from './CommandAbstract';

let showOffsets: boolean;
/**
 * This command is responsible for show selecting components and displaying
 * all the necessary tools around (component toolbar, badge, highlight box, etc.)
 *
 * The command manages different boxes to display tools and when something in
 * the canvas is updated, the command triggers the appropriate method to update
 * their position (across multiple frames/components):
 * - Global Tools (updateToolsGlobal/updateGlobalPos)
 * This box contains tools intended to be displayed only on ONE component per time,
 * like Component Toolbar (updated by updateToolbar/updateToolbarPos), this means
 * you won't be able to see more than one Component Toolbar (even with multiple
 * frames or multiple selected components)
 * - Local Tools (updateToolsLocal/updateLocalPos)
 * Each frame in the canvas has its own local box, so we're able to see more than
 * one active container at the same time. When you put a mouse over an element
 * you can see stuff like the highlight box, badge, margins/paddings offsets, etc.
 * so those elements are inside the Local Tools box
 *
 *
 */
export default {
  activeResizer: false,

  init() {
    this.onSelect = debounce(this.onSelect, 0);
    bindAll(
      this,
      'onHover',
      'onOut',
      'onClick',
      'onCanvasScroll',
      'onFrameScroll',
      'onFrameResize',
      'onFrameUpdated',
      'onContainerChange',
    );
  },

  enable() {
    this.frameOff = this.canvasOff = this.adjScroll = null;
    this.startSelectComponent();
    showOffsets = true;
  },

  /**
   * Start select component event
   * @private
   * */
  startSelectComponent() {
    this.toggleSelectComponent(1);
    this.em.getSelected() && this.onSelect();
  },

  /**
   * Stop select component event
   * @private
   * */
  stopSelectComponent() {
    this.toggleSelectComponent();
  },

  /**
   * Toggle select component event
   * @private
   * */
  toggleSelectComponent(enable: boolean) {
    const { em, canvas } = this;
    const canvasEl = canvas.getCanvasView().el;
    const listenToEl = em.getConfig().listenToEl!;
    const { parentNode } = em.getContainer()!;
    const method = enable ? 'on' : 'off';
    const methods = { on, off };
    const eventCmpUpdate = ComponentsEvents.update;
    !listenToEl.length && parentNode && listenToEl.push(parentNode as HTMLElement);
    const trigger = (win: Window, body: HTMLBodyElement, canvasEl: HTMLElement) => {
      methods[method](canvasEl, 'scroll', this.onCanvasScroll, true);
      methods[method](body, 'mouseover', this.onHover);
      methods[method](body, 'mouseleave', this.onOut);
      methods[method](body, 'click', this.onClick);
      methods[method](win, 'scroll', this.onFrameScroll, true);
      methods[method](win, 'resize', this.onFrameResize);
    };
    methods[method](window, 'resize', this.onFrameUpdated);
    methods[method](listenToEl, 'scroll', this.onContainerChange);
    em[method](`component:toggled ${eventCmpUpdate} undo redo`, this.onSelect, this);
    em[method]('change:componentHovered', this.onHovered, this);
    em[method](`${ComponentsEvents.resize} styleable:change ${ComponentsEvents.input}`, this.updateGlobalPos, this);
    em[method](`${eventCmpUpdate}:toolbar`, this._upToolbar, this);
    em[method]('frame:updated', this.onFrameUpdated, this);
    em[method]('canvas:updateTools', this.onFrameUpdated, this);
    em[method](em.Canvas.events.refresh, this.updateAttached, this);
    em.Canvas.getFrames().forEach((frame) => {
      const { view } = frame;
      const win = view?.getWindow();
      win && trigger(win, view?.getBody()!, canvasEl);
    });
  },

  /**
   * Hover command
   * @param {Object}  e
   * @private
   */
  onHover(ev: Event) {
    ev.stopPropagation();
    const { em } = this;
    const el = ev.target as HTMLElement;
    const view = getComponentView(el);
    const frameView = view?.frameView;
    let model = view?.model;

    // Get first valid model
    if (!model) {
      let parentEl = el.parentNode;
      while (!model && parentEl && !isDoc(parentEl)) {
        model = getComponentModel(parentEl);
        parentEl = parentEl.parentNode;
      }
    }

    this.currentDoc = el.ownerDocument;
    em.setHovered(model, { useValid: true });
    frameView && em.setCurrentFrame(frameView);
  },

  onFrameUpdated() {
    this.updateLocalPos();
    this.updateGlobalPos();
  },

  onHovered(em: any, component: Component) {
    let result = {};

    if (component) {
      component.views?.forEach((view) => {
        const el = view.el;
        const pos = this.getElementPos(el);
        result = { el, pos, component, view };

        if (el.ownerDocument === this.currentDoc) {
          this.elHovered = result;
        }

        this.updateToolsLocal(result);
      });
    } else {
      this.currentDoc = null;
      this.elHovered = 0;
      this.updateToolsLocal();
      this.canvas.getFrames().forEach((frame) => {
        const { view } = frame;
        const el = view && view.getToolsEl();
        el && this.toggleToolsEl(0, 0, { el });
      });
    }
  },

  /**
   * Say what to do after the component was selected
   * @param {Object}  e
   * @param {Object}  el
   * @private
   * */
  onSelect() {
    const { em } = this;
    const component = em.getSelected();
    const currentFrame = em.getCurrentFrame();
    const view = component && component.getView(currentFrame?.model);
    let el = view?.el;
    let result = {};

    if (el && isVisible(el)) {
      const pos = this.getElementPos(el);
      result = { el, pos, component, view };
    }

    this.elSelected = result;
    this.updateToolsGlobal();
    // This will hide some elements from the select component
    this.updateLocalPos(result);
    this.initResize(component);
  },

  updateGlobalPos() {
    const sel = this.getElSelected();
    if (!sel.el) return;
    sel.pos = this.getElementPos(sel.el);
    this.updateToolsGlobal();
  },

  updateLocalPos(data: any) {
    const sel = this.getElHovered();
    if (!sel.el) return;
    sel.pos = this.getElementPos(sel.el);
    this.updateToolsLocal(data);
  },

  getElHovered() {
    return this.elHovered || {};
  },

  getElSelected() {
    return this.elSelected || {};
  },

  onOut() {
    this.em.setHovered();
  },

  toggleToolsEl(on: boolean, view: any, opts: any = {}) {
    const el = opts.el || this.canvas.getToolsEl(view);
    el && (el.style.display = on ? '' : 'none');
    return el || {};
  },

  /**
   * Show element offset viewer
   * @param {HTMLElement}  el
   * @param {Object} pos
   */
  showElementOffset(el: HTMLElement, pos: any, opts: any = {}) {
    if (!showOffsets) return;
    this.editor.runCommand('show-offset', {
      el,
      elPos: pos,
      view: opts.view,
      force: 1,
      top: 0,
      left: 0,
    });
  },

  /**
   * Hide element offset viewer
   * @param {HTMLElement}  el
   * @param {Object} pos
   */
  hideElementOffset(view: any) {
    this.editor.stopCommand('show-offset', {
      view,
    });
  },

  /**
   * Show fixed element offset viewer
   * @param {HTMLElement}  el
   * @param {Object} pos
   */
  showFixedElementOffset(el: HTMLElement, pos: any) {
    this.editor.runCommand('show-offset', {
      el,
      elPos: pos,
      state: 'Fixed',
    });
  },

  /**
   * Hide fixed element offset viewer
   * @param {HTMLElement}  el
   * @param {Object} pos
   */
  hideFixedElementOffset() {
    if (this.editor) this.editor.stopCommand('show-offset', { state: 'Fixed' });
  },

  /**
   * Hide Highlighter element
   */
  hideHighlighter(view: any) {
    this.canvas.getHighlighter(view).style.opacity = 0;
  },

  /**
   * On element click
   * @param {Event}  e
   * @private
   */
  onClick(ev: Event) {
    ev.stopPropagation();
    ev.preventDefault();
    const { em } = this;

    if (em.get('_cmpDrag')) return em.set('_cmpDrag');

    const el = ev.target as HTMLElement;
    let cmp = getComponentModel(el);

    if (!cmp) {
      let parentEl = el.parentNode;

      while (!cmp && parentEl && !isDoc(parentEl)) {
        cmp = getComponentModel(parentEl);
        parentEl = parentEl.parentNode;
      }
    }

    if (cmp) {
      if (
        em.isEditing() &&
        // Avoid selection of inner text components during editing
        ((!cmp.get('textable') && cmp.isChildOf('text')) ||
          // Prevents selecting another component if the pointer was pressed and
          // dragged outside of the editing component
          em.getEditing() !== cmp)
      ) {
        return;
      }

      this.select(cmp, ev);
    }
  },

  /**
   * Select component
   * @param  {Component} model
   * @param  {Event} event
   */
  select(model: Component, event: MouseEvent) {
    if (!model) return;
    const { em } = this;
    em.setSelected(model, { event, useValid: true });
    // Ensure we're passing the proper selected component #6096
    this.initResize(em.getSelected());
  },

  /**
   * Update badge for the component
   * @param {Object} Component
   * @param {Object} pos Position object
   * @private
   * */
  updateBadge(el: HTMLElement, pos: any, opts: any = {}) {
    const { canvas } = this;
    const model = getComponentModel(el);
    const badge = this.getBadge(opts);
    const bStyle = badge.style;

    if (!model || !model.get('badgable')) {
      bStyle.display = 'none';
      return;
    }

    if (!opts.posOnly) {
      const config = this.canvas.getConfig();
      const icon = model.getIcon();
      const ppfx = config.pStylePrefix || '';
      const clsBadge = `${ppfx}badge`;
      const customeLabel = config.customBadgeLabel;
      const badgeLabel = `${icon ? `<div class="${clsBadge}__icon">${icon}</div>` : ''}
        <div class="${clsBadge}__name">${model.getName()}</div>`;
      badge.innerHTML = customeLabel ? customeLabel(model) : badgeLabel;
    }

    const un = 'px';
    bStyle.display = 'block';

    const targetToElem = canvas.getTargetToElementFixed(el, badge, {
      pos: pos,
    });

    const top = targetToElem.top; //opts.topOff - badgeH < 0 ? -opts.topOff : posTop;
    const left = opts.leftOff < 0 ? -opts.leftOff : 0;

    bStyle.top = top + un;
    bStyle.left = left + un;
  },

  /**
   * Update highlighter element
   * @param {HTMLElement} el
   * @param {Object} pos Position object
   * @private
   */
  showHighlighter(view: any) {
    this.canvas.getHighlighter(view).style.opacity = '';
  },

  /**
   * Init resizer on the element if possible
   * @param  {HTMLElement|Component} elem
   * @private
   */
  initResize(elem: HTMLElement) {
    const { em, canvas } = this;
    const editor = em.Editor;
    const component = !isElement(elem) && isTaggableNode(elem) ? elem : em.getSelected();
    const resizable = component?.get?.('resizable');
    const spotTypeResize = CanvasSpotBuiltInTypes.Resize;
    const hasCustomResize = canvas.hasCustomSpot(spotTypeResize);
    canvas.removeSpots({ type: spotTypeResize });
    const initEventOpts = {
      component,
      hasCustomResize,
      resizable,
    };

    component && em.trigger(ComponentsEvents.resizeInit, initEventOpts);
    const resizableResult = initEventOpts.resizable;

    if (component && resizableResult) {
      canvas.addSpot({ type: spotTypeResize, component });
      const el = isElement(elem) ? elem : component.getEl();
      const resizableOpts = isObject(resizableResult) ? resizableResult : {};

      if (hasCustomResize || !el || this.activeResizer) return;

      this.resizer = editor.runCommand('resize', {
        ...resizableOpts,
        el,
        component,
        force: true,
        afterStart: () => {
          showOffsets = false;
          this.activeResizer = true;
        },
        afterEnd: () => {
          showOffsets = true;
          this.activeResizer = false;
        },
      });
    } else {
      if (hasCustomResize) return;

      editor.stopCommand('resize');
      this.resizer = null;
    }
  },

  /**
   * Update toolbar if the component has one
   * @param {Object} mod
   */
  updateToolbar(mod: Component) {
    const { canvas } = this;
    const { em } = this.config;
    const model = mod === em ? em.getSelected() : mod;
    const toolbarEl = canvas.getToolbarEl()!;
    const toolbarStyle = toolbarEl.style;
    const toolbar = model.get('toolbar');
    const showToolbar = em.config.showToolbar;
    const noCustomSpotSelect = !canvas.hasCustomSpot(CanvasSpotBuiltInTypes.Select);

    if (model && showToolbar && toolbar && toolbar.length && noCustomSpotSelect) {
      toolbarStyle.display = '';
      if (!this.toolbar) {
        toolbarEl.innerHTML = '';
        this.toolbar = new Toolbar(toolbar);
        // @ts-ignore
        const toolbarView = new ToolbarView({ collection: this.toolbar, em });
        toolbarEl.appendChild(toolbarView.render().el);
      }

      this.toolbar.reset(toolbar);
      toolbarStyle.top = '-100px';
      toolbarStyle.left = '0';
    } else {
      toolbarStyle.display = 'none';
    }
  },

  /**
   * Update toolbar positions
   * @param {HTMLElement} el
   * @param {Object} pos
   */
  updateToolbarPos(pos: any) {
    const unit = 'px';
    const { style } = this.canvas.getToolbarEl()!;
    style.top = `${pos.top}${unit}`;
    style.left = `${pos.left}${unit}`;
    style.opacity = '';
  },

  /**
   * Return canvas dimensions and positions
   * @return {Object}
   */
  getCanvasPosition() {
    return this.canvas.getCanvasView().getPosition();
  },

  /**
   * Returns badge element
   * @return {HTMLElement}
   * @private
   */
  getBadge(opts: any = {}) {
    return this.canvas.getBadgeEl(opts.view);
  },

  /**
   * On canvas scroll callback
   * @private
   */
  onCanvasScroll(e: any) {
    this.onFrameScroll(e);
    this.onContainerChange();
  },

  /**
   * On frame scroll callback
   * @private
   */
  onFrameScroll() {
    this.updateTools();
    this.canvas.refreshSpots();
  },

  onFrameResize() {
    this.canvas.refresh({ all: true });
  },

  updateTools() {
    this.updateLocalPos();
    this.updateGlobalPos();
  },

  isCompSelected(comp: Component) {
    return comp && comp.get('status') === 'selected';
  },

  /**
   * Update tools visible on hover
   * @param {HTMLElement} el
   * @param {Object} pos
   */
  updateToolsLocal(data: any) {
    const config = this.em.getConfig();
    const { el, pos, view, component } = data || this.getElHovered();

    if (!el) {
      this.lastHovered = 0;
      return;
    }

    const isHoverEn = component.get('hoverable');
    const isNewEl = this.lastHovered !== el;
    const badgeOpts = isNewEl ? {} : { posOnly: 1 };
    const customHoverSpot = this.canvas.hasCustomSpot(CanvasSpotBuiltInTypes.Hover);

    if (isNewEl && isHoverEn) {
      this.lastHovered = el;
      customHoverSpot ? this.hideHighlighter(view) : this.showHighlighter(view);
      this.showElementOffset(el, pos, { view });
    }

    if (this.isCompSelected(component)) {
      this.hideHighlighter(view);
      !config.showOffsetsSelected && this.hideElementOffset(view);
    }

    const unit = 'px';
    const toolsEl = this.toggleToolsEl(1, view);
    const { style } = toolsEl;
    const frameOff = this.canvas.canvasRectOffset(el, pos);
    const topOff = frameOff.top;
    const leftOff = frameOff.left;

    !customHoverSpot &&
      this.updateBadge(el, pos, {
        ...badgeOpts,
        view,
        topOff,
        leftOff,
      });

    style.top = topOff + unit;
    style.left = leftOff + unit;
    style.width = pos.width + unit;
    style.height = pos.height + unit;

    this._trgToolUp('local', {
      component,
      el: toolsEl,
      top: topOff,
      left: leftOff,
      width: pos.width,
      height: pos.height,
    });
  },

  _upToolbar: debounce(function () {
    // @ts-ignore
    this.updateToolsGlobal({ force: 1 });
  }, 0),

  _trgToolUp(type: string, opts = {}) {
    this.em.trigger('canvas:tools:update', {
      type,
      ...opts,
    });
  },

  updateToolsGlobal(opts: any = {}) {
    const { el, pos, component } = this.getElSelected();

    if (!el) {
      this.toggleToolsEl(); // Hides toolbar
      this.lastSelected = 0;
      return;
    }

    const { canvas } = this;
    const isNewEl = this.lastSelected !== el;

    if (isNewEl || opts.force) {
      this.lastSelected = el;
      this.updateToolbar(component);
    }

    const unit = 'px';
    const toolsEl = this.toggleToolsEl(1);
    const { style } = toolsEl;
    const targetToElem = canvas.getTargetToElementFixed(el, canvas.getToolbarEl()!, { pos });
    const topOff = targetToElem.canvasOffsetTop;
    const leftOff = targetToElem.canvasOffsetLeft;
    style.top = topOff + unit;
    style.left = leftOff + unit;
    style.width = pos.width + unit;
    style.height = pos.height + unit;

    this.updateToolbarPos({ top: targetToElem.top, left: targetToElem.left });
    this._trgToolUp('global', {
      component,
      el: toolsEl,
      top: topOff,
      left: leftOff,
      width: pos.width,
      height: pos.height,
    });
  },

  /**
   * Update attached elements, eg. component toolbar
   */
  updateAttached: debounce(function () {
    // @ts-ignore
    this.updateGlobalPos();
  }, 0),

  onContainerChange: debounce(function () {
    // @ts-ignore
    this.em.refreshCanvas();
  }, 150),

  /**
   * Returns element's data info
   * @param {HTMLElement} el
   * @return {Object}
   * @private
   */
  getElementPos(el: HTMLElement) {
    return this.canvas.getCanvasView().getElementPos(el, { noScroll: true });
  },

  /**
   * Hide badge
   * @private
   * */
  hideBadge() {
    this.getBadge().style.display = 'none';
  },

  /**
   * Clean previous model from different states
   * @param {Component} model
   * @private
   */
  cleanPrevious(model: Component) {
    model &&
      model.set({
        status: '',
        state: '',
      });
  },

  /**
   * Returns content window
   * @private
   */
  getContentWindow() {
    return this.canvas.getWindow();
  },

  run(editor) {
    if (!hasWin()) return;
    // @ts-ignore
    this.editor = editor && editor.get('Editor');
    this.enable();
  },

  stop(ed, sender, opts = {}) {
    if (!hasWin()) return;
    const { em, editor } = this;
    this.onHovered(); // force to hide toolbar
    this.stopSelectComponent();
    !opts.preserveSelected && em.setSelected();
    this.toggleToolsEl();
    this.updateAttached.cancel();
    editor && editor.stopCommand('resize');
  },
} as CommandObject<any, { [k: string]: any }>;
```

--------------------------------------------------------------------------------

---[FILE: SelectPosition.ts]---
Location: grapesjs-dev/packages/core/src/commands/view/SelectPosition.ts

```typescript
import { $ } from '../../common';
import CanvasComponentNode from '../../utils/sorter/CanvasComponentNode';
import { DragDirection } from '../../utils/sorter/types';
import { CommandObject } from './CommandAbstract';
export default {
  /**
   * Start select position event
   * @param {HTMLElement[]} sourceElements
   * @private
   * */
  startSelectPosition(sourceElements: HTMLElement[], doc: Document, opts: any = {}) {
    this.isPointed = false;
    const utils = this.em.Utils;
    const container = sourceElements[0].ownerDocument.body;

    if (utils)
      this.sorter = new utils.ComponentSorter({
        em: this.em,
        treeClass: CanvasComponentNode,
        containerContext: {
          container,
          containerSel: '*',
          itemSel: '*',
          pfx: this.ppfx,
          document: doc,
          placeholderElement: this.canvas.getPlacerEl()!,
        },
        positionOptions: {
          windowMargin: 1,
          canvasRelative: true,
        },
        dragBehavior: {
          dragDirection: DragDirection.BothDirections,
          nested: true,
        },
      });

    if (opts.onStart) this.sorter.eventHandlers.legacyOnStartSort = opts.onStart;
    sourceElements &&
      sourceElements.length > 0 &&
      this.sorter.startSort(sourceElements.map((element) => ({ element })));
  },

  /**
   * Get frame position
   * @return {Object}
   * @private
   */
  getOffsetDim() {
    var frameOff = this.offset(this.canvas.getFrameEl());
    var canvasOff = this.offset(this.canvas.getElement());
    var top = frameOff.top - canvasOff.top;
    var left = frameOff.left - canvasOff.left;
    return { top, left };
  },

  /**
   * Stop select position event
   * @private
   * */
  stopSelectPosition() {
    this.posTargetCollection = null;
    this.posIndex = this.posMethod == 'after' && this.cDim.length !== 0 ? this.posIndex + 1 : this.posIndex; //Normalize
    if (this.sorter) {
      this.sorter.cancelDrag();
    }
    if (this.cDim) {
      this.posIsLastEl = this.cDim.length !== 0 && this.posMethod == 'after' && this.posIndex == this.cDim.length;
      this.posTargetEl =
        this.cDim.length === 0
          ? $(this.outsideElem)
          : !this.posIsLastEl && this.cDim[this.posIndex]
            ? $(this.cDim[this.posIndex][5]).parent()
            : $(this.outsideElem);
      this.posTargetModel = this.posTargetEl.data('model');
      this.posTargetCollection = this.posTargetEl.data('model-comp');
    }
  },

  /**
   * Enabel select position
   * @private
   */
  enable() {
    this.startSelectPosition();
  },

  /**
   * Check if the pointer is near to the float component
   * @param {number} index
   * @param {string} method
   * @param {Array<Array>} dims
   * @return {Boolean}
   * @private
   * */
  nearFloat(index: number, method: string, dims: any[]) {
    var i = index || 0;
    var m = method || 'before';
    var len = dims.length;
    var isLast = len !== 0 && m == 'after' && i == len;
    if (len !== 0 && ((!isLast && !dims[i][4]) || (dims[i - 1] && !dims[i - 1][4]) || (isLast && !dims[i - 1][4])))
      return 1;
    return 0;
  },

  run() {
    this.enable();
  },

  stop() {
    this.stopSelectPosition();
    this.$wrapper.css('cursor', '');
    this.$wrapper.unbind();
  },
} as CommandObject<{}, { [k: string]: any }>;
```

--------------------------------------------------------------------------------

---[FILE: ShowOffset.ts]---
Location: grapesjs-dev/packages/core/src/commands/view/ShowOffset.ts

```typescript
import { isUndefined } from 'underscore';
import { CanvasSpotBuiltInTypes } from '../../canvas/model/CanvasSpot';
import { $ } from '../../common';
import { CommandObject } from './CommandAbstract';

export default {
  getOffsetMethod(state: string) {
    var method = state || '';
    return 'get' + method + 'OffsetViewerEl';
  },

  run(editor, sender, opts) {
    const { canvas } = this;
    const opt = opts || {};
    const state = opt.state || '';
    const config = editor.getConfig();
    const zoom = this.em.getZoomDecimal();
    const el = opt.el as HTMLElement | undefined;

    if (!config.showOffsets || !(el instanceof HTMLElement) || (!config.showOffsetsSelected && state == 'Fixed')) {
      editor.stopCommand(`${this.id}`, opts);
      return;
    }

    if (canvas.hasCustomSpot(CanvasSpotBuiltInTypes.Spacing)) {
      return;
    }

    var pos = { ...(opt.elPos || canvas.getElementPos(el)) };

    if (!isUndefined(opt.top)) {
      pos.top = opt.top;
    }
    if (!isUndefined(opt.left)) {
      pos.left = opt.left;
    }

    var style = window.getComputedStyle(el);
    var ppfx = this.ppfx;
    var stateVar = state + 'State';
    var method = this.getOffsetMethod(state);
    // @ts-ignore
    var offsetViewer = canvas[method](opts.view);
    offsetViewer.style.opacity = '';

    let marginT = this['marginT' + state];
    let marginB = this['marginB' + state];
    let marginL = this['marginL' + state];
    let marginR = this['marginR' + state];
    let padT = this['padT' + state];
    let padB = this['padB' + state];
    let padL = this['padL' + state];
    let padR = this['padR' + state];

    if (offsetViewer.childNodes.length) {
      this[stateVar] = '1';
      marginT = offsetViewer.querySelector('[data-offset-m-t]');
      marginB = offsetViewer.querySelector('[data-offset-m-b]');
      marginL = offsetViewer.querySelector('[data-offset-m-l]');
      marginR = offsetViewer.querySelector('[data-offset-m-r]');
      padT = offsetViewer.querySelector('[data-offset-p-t]');
      padB = offsetViewer.querySelector('[data-offset-p-b]');
      padL = offsetViewer.querySelector('[data-offset-p-l]');
      padR = offsetViewer.querySelector('[data-offset-p-r]');
    }

    if (!this[stateVar]) {
      var stateLow = state.toLowerCase();
      var marginName = stateLow + 'margin-v';
      var paddingName = stateLow + 'padding-v';
      var marginV = $(`<div class="${ppfx}marginName">`).get(0) as HTMLElement;
      var paddingV = $(`<div class="${ppfx}paddingName">`).get(0) as HTMLElement;
      var marginEls = ppfx + marginName + '-el';
      var paddingEls = ppfx + paddingName + '-el';
      const fullMargName = `${marginEls} ${ppfx + marginName}`;
      const fullPadName = `${paddingEls} ${ppfx + paddingName}`;
      marginT = $(`<div class="${fullMargName}-top"></div>`).get(0);
      marginB = $(`<div class="${fullMargName}-bottom"></div>`).get(0);
      marginL = $(`<div class="${fullMargName}-left"></div>`).get(0);
      marginR = $(`<div class="${fullMargName}-right"></div>`).get(0);
      padT = $(`<div class="${fullPadName}-top"></div>`).get(0);
      padB = $(`<div class="${fullPadName}-bottom"></div>`).get(0);
      padL = $(`<div class="${fullPadName}-left"></div>`).get(0);
      padR = $(`<div class="${fullPadName}-right"></div>`).get(0);
      this['marginT' + state] = marginT;
      this['marginB' + state] = marginB;
      this['marginL' + state] = marginL;
      this['marginR' + state] = marginR;
      this['padT' + state] = padT;
      this['padB' + state] = padB;
      this['padL' + state] = padL;
      this['padR' + state] = padR;
      marginV.appendChild(marginT);
      marginV.appendChild(marginB);
      marginV.appendChild(marginL);
      marginV.appendChild(marginR);
      paddingV.appendChild(padT);
      paddingV.appendChild(padB);
      paddingV.appendChild(padL);
      paddingV.appendChild(padR);
      offsetViewer.appendChild(marginV);
      offsetViewer.appendChild(paddingV);
      this[stateVar] = '1';
    }

    var unit = 'px';
    var marginLeftSt = parseFloat(style.marginLeft.replace(unit, '')) * zoom;
    var marginRightSt = parseFloat(style.marginRight.replace(unit, '')) * zoom;
    var marginTopSt = parseFloat(style.marginTop.replace(unit, '')) * zoom;
    var marginBottomSt = parseFloat(style.marginBottom.replace(unit, '')) * zoom;
    var mtStyle = marginT.style;
    var mbStyle = marginB.style;
    var mlStyle = marginL.style;
    var mrStyle = marginR.style;
    var ptStyle = padT.style;
    var pbStyle = padB.style;
    var plStyle = padL.style;
    var prStyle = padR.style;
    var posLeft = parseFloat(pos.left);
    var widthEl = parseFloat(style.width) * zoom + unit;

    // Margin style
    mtStyle.height = marginTopSt + unit;
    mtStyle.width = widthEl;
    mtStyle.top = pos.top - marginTopSt + unit;
    mtStyle.left = posLeft + unit;

    mbStyle.height = marginBottomSt + unit;
    mbStyle.width = widthEl;
    mbStyle.top = pos.top + pos.height + unit;
    mbStyle.left = posLeft + unit;

    var marginSideH = pos.height + marginTopSt + marginBottomSt + unit;
    var marginSideT = pos.top - marginTopSt + unit;
    mlStyle.height = marginSideH;
    mlStyle.width = marginLeftSt + unit;
    mlStyle.top = marginSideT;
    mlStyle.left = posLeft - marginLeftSt + unit;

    mrStyle.height = marginSideH;
    mrStyle.width = marginRightSt + unit;
    mrStyle.top = marginSideT;
    mrStyle.left = posLeft + pos.width + unit;

    // Padding style
    var padTop = parseFloat(style.paddingTop) * zoom;
    ptStyle.height = padTop + unit;
    // ptStyle.width = widthEl;
    // ptStyle.top = pos.top + unit;
    // ptStyle.left = posLeft + unit;

    var padBot = parseFloat(style.paddingBottom) * zoom;
    pbStyle.height = padBot + unit;
    // pbStyle.width = widthEl;
    // pbStyle.top = pos.top + pos.height - padBot + unit;
    // pbStyle.left = posLeft + unit;

    var padSideH = pos.height - padBot - padTop + unit;
    var padSideT = pos.top + padTop + unit;
    plStyle.height = padSideH;
    plStyle.width = parseFloat(style.paddingLeft) * zoom + unit;
    plStyle.top = padSideT;
    // plStyle.left = pos.left + unit;
    //  plStyle.right = 0;

    var padRight = parseFloat(style.paddingRight) * zoom;
    prStyle.height = padSideH;
    prStyle.width = padRight + unit;
    prStyle.top = padSideT;
    // prStyle.left = pos.left + pos.width - padRight + unit;
    //  prStyle.left = 0;
  },

  stop(editor, sender, opts = {}) {
    var opt = opts || {};
    var state = opt.state || '';
    var method = this.getOffsetMethod(state);
    const { view } = opts;
    const canvas = this.canvas;
    // @ts-ignore
    var offsetViewer = canvas[method](view);
    offsetViewer.style.opacity = 0;
  },
} as CommandObject<any, { [k: string]: any }>;
```

--------------------------------------------------------------------------------

---[FILE: SwitchVisibility.ts]---
Location: grapesjs-dev/packages/core/src/commands/view/SwitchVisibility.ts

```typescript
import { bindAll } from 'underscore';
import Frame from '../../canvas/model/Frame';
import Editor from '../../editor';
import { CommandObject } from './CommandAbstract';
import { isDef } from '../../utils/mixins';

export default {
  init() {
    bindAll(this, '_onFramesChange');
  },

  run(ed) {
    this.toggleVis(ed, true);
  },

  stop(ed) {
    this.toggleVis(ed, false);
  },

  toggleVis(ed: Editor, active = true) {
    if (!ed.Commands.isActive('preview')) {
      const cv = ed.Canvas;
      const mth = active ? 'on' : 'off';
      const canvasModel = cv.getModel();
      canvasModel[mth]('change:frames', this._onFramesChange);
      this.handleFrames(cv.getFrames(), active);
    }
  },

  handleFrames(frames: Frame[], active?: boolean) {
    frames.forEach((frame: Frame & { __ol?: boolean }) => {
      frame.view?.loaded && this._upFrame(frame, active);

      if (!frame.__ol) {
        frame.on('loaded', () => this._upFrame(frame));
        frame.__ol = true;
      }
    });
  },

  _onFramesChange(_: any, frames: Frame[]) {
    this.handleFrames(frames);
  },

  _upFrame(frame: Frame, active?: boolean) {
    const { ppfx, em, id } = this;
    const isActive = isDef(active) ? active : em.Commands.isActive(id as string);
    const method = isActive ? 'add' : 'remove';
    const cls = `${ppfx}dashed`;
    frame.view?.getBody().classList[method](cls);
  },
} as CommandObject<
  {},
  {
    [key: string]: any;
  }
>;
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: grapesjs-dev/packages/core/src/common/index.ts

```typescript
import Backbone from 'backbone';
import { HTMLParserOptions } from '../parser/config/config';
export { default as $ } from '../utils/cash-dom';

interface NOOP {}

export const collectionEvents = 'add remove reset change';

export type Debounced = Function & { cancel(): void };

export type SetOptions = Backbone.ModelSetOptions & {
  avoidStore?: boolean;
  avoidTransformers?: boolean;
  partial?: boolean;
};

export type AddOptions = Backbone.AddOptions & { temporary?: boolean; action?: string };

export type DisableOptions = { fromMove?: boolean };

export type LocaleOptions = { locale?: boolean };

export type UndoOptions = { fromUndo?: boolean };

export type WithHTMLParserOptions = { parserOptions?: HTMLParserOptions };

export type RemoveOptions = Backbone.Silenceable & UndoOptions & { dangerously?: boolean; temporary?: boolean };

export type EventHandler = Backbone.EventHandler;

export type ObjectHash = Backbone.ObjectHash;

export type ObjectAny = Record<string, any>;

export type ObjectStrings = Record<string, string>;

export type Nullable = undefined | null | false;

export interface OptionAsDocument {
  /**
   * Treat the HTML string as document (option valid on the root component, eg. will include doctype, html, head, etc.).
   */
  asDocument?: boolean;
}

// https://github.com/microsoft/TypeScript/issues/29729#issuecomment-1483854699
export type LiteralUnion<T, U> = T | (U & NOOP);

export type Position = {
  x: number;
  y: number;
};

export interface Coordinates {
  x: number;
  y: number;
}

export interface Dimensions {
  height: number;
  width: number;
}

export interface BoxRect extends Coordinates, Dimensions {}

export type ElementRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type CombinedModelConstructorOptions<
  E,
  M extends Model<any, any, E> = Model,
> = Backbone.ModelConstructorOptions<M> & E;

export interface ViewOptions<TModel extends Model | undefined = Model, TElement extends Element = HTMLElement>
  extends Backbone.ViewOptions<TModel, TElement> {}

export class Model<T extends ObjectHash = any, S = SetOptions, E = any> extends Backbone.Model<T, S, E> {}

export class Collection<T extends Model = Model> extends Backbone.Collection<T> {}

export class View<T extends Model | undefined = Model, E extends Element = HTMLElement> extends Backbone.View<T, E> {}

export type PickMatching<T, V> = { [K in keyof T as T[K] extends V ? K : never]: T[K] };

export type ExtractMethods<T> = PickMatching<T, Function>;

export enum CoordinatesTypes {
  Screen = 'screen',
  World = 'world',
}

export const DEFAULT_COORDS: Coordinates = {
  x: 0,
  y: 0,
};

export const DEFAULT_BOXRECT: BoxRect = {
  ...DEFAULT_COORDS,
  width: 0,
  height: 0,
};

export type PrevToNewIdMap = Record<string, string>;

export type EventCallbackAdd<M> = [M, AddOptions];
export type EventCallbackUpdate<M> = [M, AddOptions];
export type EventCallbackRemove<M> = [M, RemoveOptions];
export type EventCallbackRemoveBefore<M> = [M, RemoveFn: () => void, RemoveOptions];
export type EventCallbackAll<E, M> = [{ event: E; model?: M; options: ObjectAny }];
```

--------------------------------------------------------------------------------

````
