---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 28
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 28 of 97)

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

---[FILE: CanvasView.ts]---
Location: grapesjs-dev/packages/core/src/canvas/view/CanvasView.ts

```typescript
import { bindAll, isFunction, isNumber } from 'underscore';
import { ModuleView } from '../../abstract';
import { BoxRect, Coordinates, CoordinatesTypes, ElementRect } from '../../common';
import Component from '../../dom_components/model/Component';
import ComponentView from '../../dom_components/view/ComponentView';
import {
  createEl,
  getDocumentScroll,
  getElRect,
  getKeyChar,
  hasModifierKey,
  isTextNode,
  off,
  on,
} from '../../utils/dom';
import { getComponentView, getElement, getUiClass } from '../../utils/mixins';
import Canvas from '../model/Canvas';
import Frame from '../model/Frame';
import { GetBoxRectOptions, ToWorldOption } from '../types';
import FrameView from './FrameView';
import FramesView from './FramesView';
import { ComponentsEvents } from '../../dom_components/types';

export interface MarginPaddingOffsets {
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  borderTopWidth?: number;
  borderRightWidth?: number;
  borderBottomWidth?: number;
  borderLeftWidth?: number;
}

export type ElementPosOpts = {
  avoidFrameOffset?: boolean;
  avoidFrameZoom?: boolean;
  noScroll?: boolean;
};

export interface FitViewportOptions {
  frame?: Frame;
  gap?: number | { x: number; y: number };
  ignoreHeight?: boolean;
  el?: HTMLElement;
  zoom?: number | ((zoom: number) => number);
}

export default class CanvasView extends ModuleView<Canvas> {
  template() {
    const { pfx } = this;
    return `
      <div class="${pfx}canvas__frames" data-frames>
        <div class="${pfx}canvas__spots" data-spots></div>
      </div>
      <div id="${pfx}tools" class="${pfx}canvas__tools" data-tools></div>
      <style data-canvas-style></style>
    `;
  }
  /*get className(){
    return this.pfx + 'canvas':
  }*/
  hlEl?: HTMLElement;
  badgeEl?: HTMLElement;
  placerEl?: HTMLElement;
  ghostEl?: HTMLElement;
  toolbarEl?: HTMLElement;
  resizerEl?: HTMLElement;
  offsetEl?: HTMLElement;
  fixedOffsetEl?: HTMLElement;
  toolsGlobEl?: HTMLElement;
  toolsEl?: HTMLElement;
  framesArea?: HTMLElement;
  toolsWrapper?: HTMLElement;
  spotsEl?: HTMLElement;
  cvStyle?: HTMLElement;
  clsUnscale: string;
  ready = false;

  frames!: FramesView;
  frame?: FrameView;

  private timerZoom?: NodeJS.Timeout;

  private frmOff?: { top: number; left: number; width: number; height: number };
  private cvsOff?: { top: number; left: number; width: number; height: number };

  constructor(model: Canvas) {
    super({ model });
    bindAll(this, 'clearOff', 'onKeyPress', 'onWheel', 'onPointer');
    const { em, pfx, ppfx } = this;
    const { events } = this.module;
    this.className = `${pfx}canvas ${ppfx}no-touch-actions${!em.config.customUI ? ` ${pfx}canvas-bg` : ''}`;
    this.clsUnscale = `${pfx}unscale`;
    this._initFrames();
    this.listenTo(em, events.refresh, this.clearOff);
    this.listenTo(em, 'component:selected', this.checkSelected);
    this.listenTo(em, `${events.coords} ${events.zoom}`, this.updateFrames);
    this.listenTo(model, 'change:frames', this._onFramesUpdate);
    this.toggleListeners(true);
  }

  _onFramesUpdate() {
    this._initFrames();
    this._renderFrames();
  }

  _initFrames() {
    const { frames, model, config, em } = this;
    const collection = model.frames;
    em.set('readyCanvas', 0);
    collection.once('loaded:all', () => em.set('readyCanvas', 1));
    frames?.remove();
    this.frames = new FramesView(
      { collection },
      {
        ...config,
        canvasView: this,
      },
    );
  }

  checkSelected(component: Component, opts: { scroll?: ScrollIntoViewOptions } = {}) {
    const { scroll } = opts;
    const currFrame = this.em.getCurrentFrame();

    scroll &&
      component.views?.forEach((view) => {
        view.frameView === currFrame && view.scrollIntoView(scroll);
      });
  }

  remove(...args: any) {
    clearTimeout(this.timerZoom);
    this.frames?.remove();
    //@ts-ignore
    this.frames = undefined;
    ModuleView.prototype.remove.apply(this, args);
    this.toggleListeners(false);
    return this;
  }

  preventDefault(ev: Event) {
    if (ev) {
      ev.preventDefault();
      (ev as any)._parentEvent?.preventDefault();
    }
  }

  toggleListeners(enable: boolean) {
    const { el, config } = this;
    const fn = enable ? on : off;
    fn(document, 'keypress', this.onKeyPress);
    fn(window, 'scroll resize', this.clearOff);
    fn(el, 'wheel', this.onWheel, { passive: !config.infiniteCanvas });
    fn(el, 'pointermove', this.onPointer);
  }

  screenToWorld(x: number, y: number): Coordinates {
    const { module } = this;
    const coords = module.getCoords();
    const zoom = module.getZoomMultiplier();
    const vwDelta = this.getViewportDelta();

    return {
      x: (x - coords.x - vwDelta.x) * zoom,
      y: (y - coords.y - vwDelta.y) * zoom,
    };
  }

  onPointer(ev: WheelEvent) {
    if (!this.config.infiniteCanvas) return;

    const canvasRect = this.getCanvasOffset();
    const docScroll = getDocumentScroll();
    const screenCoords: Coordinates = {
      x: ev.clientX - canvasRect.left + docScroll.x,
      y: ev.clientY - canvasRect.top + docScroll.y,
    };

    if ((ev as any)._parentEvent) {
      // with _parentEvent means was triggered from the iframe
      const frameRect = (ev.target as HTMLElement).getBoundingClientRect();
      const zoom = this.module.getZoomDecimal();
      screenCoords.x = frameRect.left - canvasRect.left + docScroll.x + ev.clientX * zoom;
      screenCoords.y = frameRect.top - canvasRect.top + docScroll.y + ev.clientY * zoom;
    }

    this.model.set({
      pointerScreen: screenCoords,
      pointer: this.screenToWorld(screenCoords.x, screenCoords.y),
    });
  }

  onKeyPress(ev: KeyboardEvent) {
    const { em } = this;
    const key = getKeyChar(ev);

    if (key === ' ' && em.getZoomDecimal() !== 1 && !em.Canvas.isInputFocused()) {
      this.preventDefault(ev);
      em.Editor.runCommand('core:canvas-move');
    }
  }

  onWheel(ev: WheelEvent) {
    const { module, config } = this;
    if (config.infiniteCanvas) {
      this.preventDefault(ev);
      const { deltaX, deltaY } = ev;
      const zoom = module.getZoomDecimal();
      const isZooming = hasModifierKey(ev);
      const coords = module.getCoords();

      if (isZooming) {
        const newZoom = zoom - deltaY * zoom * 0.01;
        module.setZoom(newZoom * 100);

        // Update coordinates based on pointer
        const pointer = this.model.getPointerCoords(CoordinatesTypes.Screen);
        const canvasRect = this.getCanvasOffset();
        const pointerX = pointer.x - canvasRect.width / 2;
        const pointerY = pointer.y - canvasRect.height / 2;
        const zoomDelta = newZoom / zoom;
        const x = pointerX - (pointerX - coords.x) * zoomDelta;
        const y = pointerY - (pointerY - coords.y) * zoomDelta;
        module.setCoords(x, y);
      } else {
        this.onPointer(ev);
        module.setCoords(coords.x - deltaX, coords.y - deltaY);
      }
    }
  }

  updateFrames(ev: Event) {
    const { em } = this;
    const toolsWrpEl = this.toolsWrapper!;
    const defOpts = { preserveSelected: 1 };
    this.updateFramesArea();
    this.clearOff();
    toolsWrpEl.style.display = 'none';
    em.trigger('canvas:update', ev);
    clearTimeout(this.timerZoom);
    this.timerZoom = setTimeout(() => {
      em.stopDefault(defOpts);
      em.runDefault(defOpts);
      toolsWrpEl.style.display = '';
    }, 300);
  }

  updateFramesArea() {
    const { framesArea, model, module, cvStyle, clsUnscale } = this;
    const mpl = module.getZoomMultiplier();

    if (framesArea) {
      const { x, y } = model.attributes;
      const zoomDc = module.getZoomDecimal();

      framesArea.style.transform = `scale(${zoomDc}) translate(${x * mpl}px, ${y * mpl}px)`;
    }

    if (cvStyle) {
      cvStyle.innerHTML = `
        .${clsUnscale} { scale: ${mpl} }
      `;
    }
  }

  fitViewport(opts: FitViewportOptions = {}) {
    const { em, module, model } = this;
    this.clearOff();
    const canvasRect = this.getCanvasOffset();
    const { el } = opts;
    const elFrame = el && getComponentView(el)?.frameView;
    const frame = elFrame ? elFrame.model : opts.frame || em.getCurrentFrameModel() || model.frames.at(0);
    const { x, y } = frame.attributes;
    const boxRect: BoxRect = {
      x: x ?? 0,
      y: y ?? 0,
      width: frame.width,
      height: frame.height,
    };

    if (el) {
      const elRect = this.getElBoxRect(el);
      boxRect.x = boxRect.x + elRect.x;
      boxRect.y = boxRect.y + elRect.y;
      boxRect.width = elRect.width;
      boxRect.height = elRect.height;
    }

    const noHeight = opts.ignoreHeight;
    const gap = opts.gap ?? 0;
    const gapIsNum = isNumber(gap);
    const gapX = gapIsNum ? gap : gap.x;
    const gapY = gapIsNum ? gap : gap.y;
    const boxWidth = boxRect.width + gapX * 2;
    const boxHeight = boxRect.height + gapY * 2;
    const canvasWidth = canvasRect.width;
    const canvasHeight = canvasRect.height;
    const widthRatio = canvasWidth / boxWidth;
    const heightRatio = canvasHeight / boxHeight;

    const zoomRatio = noHeight ? widthRatio : Math.min(widthRatio, heightRatio);
    const zoom = zoomRatio * 100;
    const newZoom = (isFunction(opts.zoom) ? opts.zoom(zoom) : opts.zoom) ?? zoom;
    module.setZoom(newZoom, { from: 'fitViewport' });

    // check for the frame width is necessary as we're centering the frame via CSS
    const coordX = -boxRect.x + (frame.width >= canvasWidth ? canvasWidth / 2 - boxWidth / 2 : -gapX);
    const coordY = -boxRect.y + canvasHeight / 2 - boxHeight / 2;
    const zoomDecimal = module.getZoomDecimal();

    const coords = {
      x: (coordX + gapX) * zoomDecimal,
      y: (coordY + gapY) * zoomDecimal,
    };

    if (noHeight) {
      const zoomMltp = module.getZoomMultiplier();
      const canvasWorldHeight = canvasHeight * zoomMltp;
      const canvasHeightDiff = canvasWorldHeight - canvasHeight;
      const yDelta = canvasHeightDiff / 2;
      coords.y = (-boxRect.y + gapY) * zoomDecimal - yDelta / zoomMltp;
    }

    module.setCoords(coords.x, coords.y);
  }

  /**
   * Checks if the element is visible in the canvas's viewport
   * @param  {HTMLElement}  el
   * @return {Boolean}
   */
  isElInViewport(el: HTMLElement) {
    const elem = getElement(el);
    const rect = getElRect(elem);
    const frameRect = this.getFrameOffset(elem);
    const rTop = rect.top;
    const rLeft = rect.left;
    return rTop >= 0 && rLeft >= 0 && rTop <= frameRect.height && rLeft <= frameRect.width;
  }

  /**
   * Get the offset of the element
   * @param  {HTMLElement} el
   * @return { {top: number, left: number, width: number, height: number} }
   */
  offset(el?: HTMLElement, opts: ElementPosOpts = {}) {
    const { noScroll } = opts;
    const rect = getElRect(el);
    const scroll = noScroll ? { x: 0, y: 0 } : getDocumentScroll(el);

    return {
      top: rect.top + scroll.y,
      left: rect.left + scroll.x,
      width: rect.width,
      height: rect.height,
    };
  }

  getRectToScreen(boxRect: Partial<BoxRect>): BoxRect {
    const canvasScroll = this.getCanvasScroll();
    const zoom = this.module.getZoomDecimal();
    const coords = this.module.getCoords();
    const vwDelta = this.getViewportDelta();
    const x = (boxRect.x ?? 0) * zoom - canvasScroll.scrollLeft + coords.x + vwDelta.x || 0;
    const y = (boxRect.y ?? 0) * zoom - canvasScroll.scrollTop + coords.y + vwDelta.y || 0;

    return {
      x,
      y,
      width: (boxRect.width ?? 0) * zoom,
      height: (boxRect.height ?? 0) * zoom,
    };
  }

  getElBoxRect(el: HTMLElement, opts: GetBoxRectOptions = {}): BoxRect {
    const { module } = this;
    const { width, height, left, top } = getElRect(el);
    const frameView = getComponentView(el)?.frameView;
    const frameRect = frameView?.getBoxRect();
    const zoomMlt = module.getZoomMultiplier();
    const frameX = frameRect?.x ?? 0;
    const frameY = frameRect?.y ?? 0;
    const canvasEl = this.el;
    const docScroll = getDocumentScroll();
    const xWithFrame = left + frameX + (canvasEl.scrollLeft + docScroll.x) * zoomMlt;
    const yWithFrame = top + frameY + (canvasEl.scrollTop + docScroll.y) * zoomMlt;
    const boxRect = {
      x: xWithFrame,
      y: yWithFrame,
      width,
      height,
    };

    if (opts.local) {
      boxRect.x = left;
      boxRect.y = top;
    }

    return opts.toScreen ? this.getRectToScreen(boxRect) : boxRect;
  }

  getViewportRect(opts: ToWorldOption = {}): BoxRect {
    const { top, left, width, height } = this.getCanvasOffset();
    const { module } = this;

    if (opts.toWorld) {
      const zoom = module.getZoomMultiplier();
      const coords = module.getCoords();
      const vwDelta = this.getViewportDelta();
      const x = -coords.x - vwDelta.x || 0;
      const y = -coords.y - vwDelta.y || 0;

      return {
        x: x * zoom,
        y: y * zoom,
        width: width * zoom,
        height: height * zoom,
      };
    } else {
      return {
        x: left,
        y: top,
        width,
        height,
      };
    }
  }

  getViewportDelta(opts: { withZoom?: number } = {}): Coordinates {
    const zoom = this.module.getZoomMultiplier();
    const { width, height } = this.getCanvasOffset();
    const worldWidth = width * zoom;
    const worldHeight = height * zoom;
    const widthDelta = worldWidth - width;
    const heightDelta = worldHeight - height;

    return {
      x: widthDelta / 2 / zoom,
      y: heightDelta / 2 / zoom,
    };
  }

  /**
   * Cleare cached offsets
   * @private
   */
  clearOff() {
    this.frmOff = undefined;
    this.cvsOff = undefined;
  }

  /**
   * Return frame offset
   * @return { {top: number, left: number, width: number, height: number} }
   * @public
   */
  getFrameOffset(el?: HTMLElement) {
    if (!this.frmOff || el) {
      const frame = this.frame?.el;
      const winEl = el?.ownerDocument.defaultView;
      const frEl = winEl ? (winEl.frameElement as HTMLElement) : frame;
      this.frmOff = this.offset(frEl || frame);
    }

    return this.frmOff;
  }

  /**
   * Return canvas offset
   * @return { {top: number, left: number, width: number, height: number} }
   * @public
   */
  getCanvasOffset() {
    if (!this.cvsOff) this.cvsOff = this.offset(this.el);
    return this.cvsOff;
  }

  /**
   * Returns element's rect info
   * @param {HTMLElement} el
   * @param {object} opts
   * @return { {top: number, left: number, width: number, height: number, zoom: number, rect: any} }
   * @public
   */
  getElementPos(el: HTMLElement, opts: ElementPosOpts = {}) {
    const zoom = this.module.getZoomDecimal();
    const frameOffset = this.getFrameOffset(el);
    const canvasEl = this.el;
    const canvasOffset = this.getCanvasOffset();
    const elRect = this.offset(el, opts);
    const frameTop = opts.avoidFrameOffset ? 0 : frameOffset.top;
    const frameLeft = opts.avoidFrameOffset ? 0 : frameOffset.left;

    const elTop = opts.avoidFrameZoom ? elRect.top : elRect.top * zoom;
    const elLeft = opts.avoidFrameZoom ? elRect.left : elRect.left * zoom;

    const top = opts.avoidFrameOffset ? elTop : elTop + frameTop - canvasOffset.top + canvasEl.scrollTop;
    const left = opts.avoidFrameOffset ? elLeft : elLeft + frameLeft - canvasOffset.left + canvasEl.scrollLeft;
    const height = opts.avoidFrameZoom ? elRect.height : elRect.height * zoom;
    const width = opts.avoidFrameZoom ? elRect.width : elRect.width * zoom;

    return { top, left, height, width, zoom, rect: elRect };
  }

  /**
   * Returns element's offsets like margins and paddings
   * @param {HTMLElement} el
   * @return { MarginPaddingOffsets }
   * @public
   */
  getElementOffsets(el: HTMLElement) {
    if (!el || isTextNode(el)) return {};
    const result: MarginPaddingOffsets = {};
    const styles = window.getComputedStyle(el);
    const zoom = this.module.getZoomDecimal();
    const marginPaddingOffsets: (keyof MarginPaddingOffsets)[] = [
      'marginTop',
      'marginRight',
      'marginBottom',
      'marginLeft',
      'paddingTop',
      'paddingRight',
      'paddingBottom',
      'paddingLeft',
      'borderTopWidth',
      'borderRightWidth',
      'borderBottomWidth',
      'borderLeftWidth',
    ];
    marginPaddingOffsets.forEach((offset) => {
      result[offset] = parseFloat(styles[offset]) * zoom;
    });

    return result;
  }

  /**
   * Returns position data of the canvas element
   * @return { {top: number, left: number, width: number, height: number} } obj Position object
   * @public
   */
  getPosition(opts: any = {}): ElementRect {
    const doc = this.frame?.el.contentDocument;
    if (!doc) {
      return {
        top: 0,
        left: 0,
        width: 0,
        height: 0,
      };
    }
    const bEl = doc.body;
    const zoom = this.module.getZoomDecimal();
    const fo = this.getFrameOffset();
    const co = this.getCanvasOffset();
    const { noScroll } = opts;

    return {
      top: fo.top + (noScroll ? 0 : bEl.scrollTop) * zoom - co.top,
      left: fo.left + (noScroll ? 0 : bEl.scrollLeft) * zoom - co.left,
      width: co.width,
      height: co.height,
    };
  }

  /**
   * Returns the scroll position of the canvas.
   *
   * If the canvas is scrollable, returns the current `scrollTop` and `scrollLeft` values.
   * Otherwise, returns an object with `scrollTop` and `scrollLeft` both set to 0.
   *
   * @returns An object containing the vertical and horizontal scroll positions.
   */
  getCanvasScroll(): { scrollTop: number; scrollLeft: number } {
    return this.config.scrollableCanvas
      ? {
          scrollTop: this.el.scrollTop,
          scrollLeft: this.el.scrollLeft,
        }
      : { scrollTop: 0, scrollLeft: 0 };
  }

  /**
   * Update javascript of a specific component passed by its View
   * @param {ModuleView} view Component's View
   * @private
   */
  //TODO change type after the ComponentView was updated to ts
  updateScript(view: ComponentView) {
    const component = view.model;
    const id = component.getId();
    const dataToEmit = { component, view, el: view.el };

    if (!view.scriptContainer) {
      view.scriptContainer = createEl('div', { 'data-id': id });
      const jsEl = this.getJsContainer();
      jsEl?.appendChild(view.scriptContainer);
    }

    view.el.id = id;
    view.scriptContainer.innerHTML = '';
    // In editor, I make use of setTimeout as during the append process of elements
    // those will not be available immediately, therefore 'item' variable
    const script = document.createElement('script');
    const scriptFn = component.getScriptString();
    const scriptFnStr = component.get('script-props') ? scriptFn : `function(){\n${scriptFn}\n;}`;
    const scriptProps = JSON.stringify(component.__getScriptProps());
    script.innerHTML = `
      setTimeout(function() {
        var item = document.getElementById('${id}');
        if (!item) return;
        var script = (${scriptFnStr}).bind(item);
        script(${scriptProps}, { el: item });
      }, 1);`;

    // #873 Adding setTimeout will make js components work on init of the editor
    setTimeout(() => {
      component.emitWithEditor(ComponentsEvents.scriptMountBefore, dataToEmit);
      const scr = view.scriptContainer;
      scr?.appendChild(script);
      component.emitWithEditor(ComponentsEvents.scriptMount, dataToEmit);
    }, 0);
  }

  /**
   * Get javascript container
   * @private
   */
  getJsContainer(view?: ComponentView) {
    const frameView = this.getFrameView(view);
    return frameView?.getJsContainer();
  }

  getFrameView(view?: ComponentView) {
    return view?.frameView || this.em.getCurrentFrame();
  }

  _renderFrames() {
    if (!this.ready) return;
    const { model, frames, em, framesArea } = this;
    const frms = model.frames;
    frms.listenToLoad();
    frames.render();
    const mainFrame = frms.at(0);
    const currFrame = mainFrame?.view;
    em.setCurrentFrame(currFrame);
    framesArea?.appendChild(frames.el);
    this.frame = currFrame;
    this.updateFramesArea();
  }

  renderFrames() {
    this._renderFrames();
  }

  render() {
    const { el, $el, ppfx, config, em } = this;
    $el.html(this.template());
    const $frames = $el.find('[data-frames]');
    this.framesArea = $frames.get(0);

    const toolsWrp = $el.find('[data-tools]');
    this.toolsWrapper = toolsWrp.get(0);
    toolsWrp.append(`
      <div class="${ppfx}tools ${ppfx}tools-gl" style="pointer-events:none">
        <div class="${ppfx}placeholder">
          <div class="${ppfx}placeholder-int"></div>
        </div>
      </div>
      <div id="${ppfx}tools" style="pointer-events:none">
        ${config.extHl ? `<div class="${ppfx}highlighter-sel"></div>` : ''}
        <div class="${ppfx}badge"></div>
        <div class="${ppfx}ghost"></div>
        <div class="${ppfx}toolbar" style="pointer-events:all"></div>
        <div class="${ppfx}resizer"></div>
        <div class="${ppfx}offset-v"></div>
        <div class="${ppfx}offset-fixed-v"></div>
      </div>
    `);
    this.toolsEl = el.querySelector(`#${ppfx}tools`)!;
    this.hlEl = el.querySelector(`.${ppfx}highlighter`)!;
    this.badgeEl = el.querySelector(`.${ppfx}badge`)!;
    this.placerEl = el.querySelector(`.${ppfx}placeholder`)!;
    this.ghostEl = el.querySelector(`.${ppfx}ghost`)!;
    this.toolbarEl = el.querySelector(`.${ppfx}toolbar`)!;
    this.resizerEl = el.querySelector(`.${ppfx}resizer`)!;
    this.offsetEl = el.querySelector(`.${ppfx}offset-v`)!;
    this.fixedOffsetEl = el.querySelector(`.${ppfx}offset-fixed-v`)!;
    this.toolsGlobEl = el.querySelector(`.${ppfx}tools-gl`)!;
    this.spotsEl = el.querySelector('[data-spots]')!;
    this.cvStyle = el.querySelector('[data-canvas-style]')!;
    el.className = getUiClass(em, this.className);
    if (config.scrollableCanvas === true) {
      el.style.overflow = 'auto';
    }
    this.ready = true;
    this._renderFrames();

    return this;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: FramesView.ts]---
Location: grapesjs-dev/packages/core/src/canvas/view/FramesView.ts

```typescript
import CanvasModule from '..';
import ModuleDomainViews from '../../abstract/ModuleDomainViews';
import Frames from '../model/Frames';
import CanvasView from './CanvasView';
import FrameWrapView from './FrameWrapView';

export default class FramesView extends ModuleDomainViews<Frames, FrameWrapView> {
  canvasView: CanvasView;
  private _module: CanvasModule;

  constructor(opts = {}, config: any) {
    super(opts, true);
    this.listenTo(this.collection, 'reset', this.render);
    this.canvasView = config.canvasView;
    this._module = config.module;
  }

  onRemoveBefore(items: FrameWrapView[], opts = {}) {
    items.forEach((item) => item.remove(opts));
  }

  onRender() {
    const { $el, ppfx } = this;
    $el.attr({ class: `${ppfx}frames` });
  }

  clearItems() {
    const items = this.viewCollection || [];
    items.forEach((item) => item.remove());
    this.viewCollection = [];
  }

  protected renderView(item: any, type: string) {
    return new FrameWrapView(item, this.canvasView);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: FrameView.ts]---
Location: grapesjs-dev/packages/core/src/canvas/view/FrameView.ts

```typescript
import { bindAll, debounce, isFunction, isString } from 'underscore';
import { ModuleView } from '../../abstract';
import { BoxRect, ObjectAny } from '../../common';
import CssRulesView from '../../css_composer/view/CssRulesView';
import { type as typeHead } from '../../dom_components/model/ComponentHead';
import ComponentView from '../../dom_components/view/ComponentView';
import ComponentWrapperView from '../../dom_components/view/ComponentWrapperView';
import AutoScroller from '../../utils/AutoScroller';
import Droppable from '../../utils/Droppable';
import { append, appendVNodes, createCustomEvent, createEl, motionsEv, off, on } from '../../utils/dom';
import { hasDnd, setViewEl } from '../../utils/mixins';
import Canvas from '../model/Canvas';
import Frame from '../model/Frame';
import CanvasEvents from '../types';
import FrameWrapView from './FrameWrapView';

export default class FrameView extends ModuleView<Frame, HTMLIFrameElement> {
  /** @ts-ignore */
  get tagName() {
    return 'iframe';
  }
  /** @ts-ignore */
  get attributes() {
    return { allowfullscreen: 'allowfullscreen' };
  }

  dragging = false;
  loaded = false;
  droppable?: Droppable;
  rect?: DOMRect;

  lastClientY?: number;
  lastMaxHeight = 0;
  private autoScroller: AutoScroller;
  private jsContainer?: HTMLElement;
  private tools: { [key: string]: HTMLElement } = {};
  private wrapper?: ComponentWrapperView;
  private headView?: ComponentView;
  private frameWrapView?: FrameWrapView;

  constructor(model: Frame, view?: FrameWrapView) {
    super({ model });
    bindAll(this, 'startAutoscroll', 'stopAutoscroll', '_emitUpdate');
    const { el } = this;
    //@ts-ignore
    this.module._config = {
      ...(this.config || {}),
      //@ts-ignore
      frameView: this,
      //canvasView: view?.cv
    };
    this.frameWrapView = view;
    this.showGlobalTools = debounce(this.showGlobalTools.bind(this), 50);
    const cvModel = this.getCanvasModel();
    this.listenTo(model, 'change:head', this.updateHead);
    this.listenTo(cvModel, 'change:styles', this.renderStyles);
    model.view = this;
    setViewEl(el, this);

    this.autoScroller = new AutoScroller(this.config.autoscrollLimit, {
      rectIsInScrollIframe: true,
      onScroll: () => {
        const toolsEl = this.getGlobalToolsEl();
        toolsEl.style.opacity = '0';
        this.showGlobalTools();

        this.em.Canvas.spots.refreshDbn();
      },
    });
  }

  getBoxRect(): BoxRect {
    const { el, module } = this;
    const canvasView = module.getCanvasView();
    const coords = module.getCoords();
    const frameRect = el.getBoundingClientRect();
    const canvasRect = canvasView.getCanvasOffset();
    const vwDelta = canvasView.getViewportDelta();
    const zoomM = module.getZoomMultiplier();
    const x = (frameRect.x - canvasRect.left - vwDelta.x - coords.x) * zoomM;
    const y = (frameRect.y - canvasRect.top - vwDelta.y - coords.y) * zoomM;
    const width = frameRect.width * zoomM;
    const height = frameRect.height * zoomM;

    return {
      x,
      y,
      width,
      height,
    };
  }

  /**
   * Update `<head>` content of the frame
   */
  updateHead() {
    const { model } = this;
    const headEl = this.getHead();
    const toRemove: any[] = [];
    const toAdd: any[] = [];
    const current = model.head;
    const prev = model.previous('head');
    const attrStr = (attr: any = {}) =>
      Object.keys(attr)
        .sort()
        .map((i) => `[${i}="${attr[i]}"]`)
        .join('');
    const find = (items: any[], stack: any[], res: any[]) => {
      items.forEach((item) => {
        const { tag, attributes } = item;
        const has = stack.some((s) => s.tag === tag && attrStr(s.attributes) === attrStr(attributes));
        !has && res.push(item);
      });
    };
    find(current, prev, toAdd);
    find(prev, current, toRemove);
    toRemove.forEach((stl) => {
      const el = headEl.querySelector(`${stl.tag}${attrStr(stl.attributes)}`);
      el?.parentNode?.removeChild(el);
    });
    appendVNodes(headEl, toAdd);
  }

  getEl() {
    return this.el;
  }

  getCanvasModel(): Canvas {
    return this?.em.Canvas?.getModel();
  }

  getWindow() {
    return this.getEl().contentWindow as Window;
  }

  getDoc() {
    return this.getEl().contentDocument as Document;
  }

  getHead() {
    return this.getDoc().querySelector('head') as HTMLHeadElement;
  }

  getBody() {
    return this.getDoc().querySelector('body') as HTMLBodyElement;
  }

  getWrapper() {
    return this.getBody().querySelector('[data-gjs-type=wrapper]') as HTMLElement;
  }

  getJsContainer() {
    if (!this.jsContainer) {
      this.jsContainer = createEl('div', { class: `${this.ppfx}js-cont` });
    }

    return this.jsContainer;
  }

  getToolsEl() {
    return this.frameWrapView?.elTools as HTMLElement;
  }

  getGlobalToolsEl() {
    return this.em.Canvas.getGlobalToolsEl()!;
  }

  getHighlighter() {
    return this._getTool('[data-hl]');
  }

  getBadgeEl() {
    return this._getTool('[data-badge]');
  }

  getOffsetViewerEl() {
    return this._getTool('[data-offset]');
  }

  getRect() {
    if (!this.rect) {
      this.rect = this.el.getBoundingClientRect();
    }

    return this.rect;
  }

  /**
   * Get rect data, not affected by the canvas zoom
   */
  getOffsetRect() {
    const { el } = this;
    const { scrollTop, scrollLeft } = this.getBody();
    const height = el.offsetHeight;
    const width = el.offsetWidth;

    return {
      top: el.offsetTop,
      left: el.offsetLeft,
      height,
      width,
      scrollTop,
      scrollLeft,
      scrollBottom: scrollTop + height,
      scrollRight: scrollLeft + width,
    };
  }

  _getTool(name: string) {
    const { tools } = this;
    const toolsEl = this.getToolsEl();

    if (!tools[name]) {
      tools[name] = toolsEl.querySelector(name) as HTMLElement;
    }

    return tools[name];
  }

  remove(...args: any) {
    this._toggleEffects(false);
    this.tools = {};
    this.wrapper?.remove();
    ModuleView.prototype.remove.apply(this, args);
    return this;
  }

  startAutoscroll() {
    this.autoScroller.start(this.el, this.getWindow(), {
      lastMaxHeight: this.getWrapper().offsetHeight - this.el.offsetHeight,
      zoom: this.em.getZoomDecimal(),
      ignoredElement: this.em.Canvas.getSpotsEl(),
    });
  }

  stopAutoscroll() {
    this.autoScroller.stop();
  }

  showGlobalTools() {
    this.getGlobalToolsEl().style.opacity = '';
  }

  render() {
    const { $el, ppfx, em } = this;
    $el.attr({ class: `${ppfx}frame` });
    this.renderScripts();
    em.trigger('frame:render', this); // deprecated
    return this;
  }

  renderScripts() {
    const { el, model, em } = this;
    const evLoad = 'frame:load';
    const evOpts: ObjectAny = { el, model, view: this };
    const canvas = this.getCanvasModel();
    const appendScript = (scripts: any[]) => {
      if (scripts.length > 0) {
        const src = scripts.shift();
        const scriptEl = createEl('script', {
          type: 'text/javascript',
          ...(isString(src) ? { src } : src),
        });
        el.contentDocument?.head.appendChild(scriptEl);

        if (scriptEl.hasAttribute('nomodule') && 'noModule' in HTMLScriptElement.prototype) {
          appendScript(scripts);
        } else {
          scriptEl.onerror = scriptEl.onload = appendScript.bind(null, scripts);
        }
      } else {
        em?.trigger(CanvasEvents.frameLoadHead, evOpts);
        this.renderBody();
        em?.trigger(CanvasEvents.frameLoadBody, evOpts);
        em?.trigger(evLoad, evOpts); // deprecated
      }
    };

    el.onload = () => {
      const { frameContent } = this.config;
      if (frameContent) {
        const doc = this.getDoc();
        doc.open();
        doc.write(frameContent);
        doc.close();
      }
      evOpts.window = this.getWindow();
      em?.trigger(`${evLoad}:before`, evOpts); // deprecated
      em?.trigger(CanvasEvents.frameLoad, evOpts);
      this.renderHead();
      appendScript([...canvas.get('scripts')]);
    };
  }

  renderStyles(opts: any = {}) {
    const head = this.getHead();
    const canvas = this.getCanvasModel();
    const normalize = (stls: any[] = []) =>
      stls.map((href) => ({
        tag: 'link',
        attributes: {
          rel: 'stylesheet',
          ...(isString(href) ? { href } : href),
        },
      }));
    const prevStyles = normalize(opts.prev || canvas.previous('styles'));
    const styles = normalize(canvas?.get('styles'));
    const toRemove: any[] = [];
    const toAdd: any[] = [];
    const find = (items: any[], stack: any[], res: any[]) => {
      items.forEach((item) => {
        const { href } = item.attributes;
        const has = stack.some((s) => s.attributes.href === href);
        !has && res.push(item);
      });
    };
    find(styles, prevStyles, toAdd);
    find(prevStyles, styles, toRemove);
    toRemove.forEach((stl) => {
      const el = head.querySelector(`link[href="${stl.attributes.href}"]`);
      el?.parentNode?.removeChild(el);
    });
    appendVNodes(head, toAdd);
  }

  renderHead() {
    const { model, em } = this;
    const { root } = model;
    const HeadView = em?.Components?.getType(typeHead)!.view;
    if (!HeadView) return;
    this.headView = new HeadView({
      el: this.getHead(),
      model: root.head,
      config: {
        ...root.config,
        frameView: this,
      },
    }).render();
  }

  renderBody() {
    const { config, em, model, ppfx } = this;
    const body = this.getBody();
    const win = this.getWindow();
    const hasAutoHeight = model.hasAutoHeight();
    const conf = em.config;
    //@ts-ignore This could be used inside component-related scripts to check if the
    // script is executed inside the editor.
    win._isEditor = true;
    this.renderStyles({ prev: [] });

    const colorWarn = '#ffca6f';

    append(
      body,
      `<style>
      ${conf.baseCss || config.frameStyle || ''}

      ${hasAutoHeight ? 'body { overflow: hidden }' : ''}

      [data-gjs-type="wrapper"] {
        ${!hasAutoHeight ? 'min-height: 100vh;' : ''}
        padding-top: 0.001em;
      }

      .${ppfx}dashed *[data-gjs-highlightable] {
        outline: 1px dashed rgba(170,170,170,0.7);
        outline-offset: -2px;
      }

      .${ppfx}selected {
        outline: 2px solid #3b97e3 !important;
        outline-offset: -2px;
      }

      .${ppfx}selected-parent {
        outline: 2px solid ${colorWarn} !important
      }

      .${ppfx}no-select {
        user-select: none;
        -webkit-user-select:none;
        -moz-user-select: none;
      }

      .${ppfx}freezed {
        opacity: 0.5;
        pointer-events: none;
      }

      .${ppfx}no-pointer {
        pointer-events: none;
      }

      .${ppfx}pointer-init {
        pointer-events: initial;
      }

      .${ppfx}plh-image {
        background: #f5f5f5;
        border: none;
        height: 100px;
        width: 100px;
        display: block;
        outline: 3px solid #ffca6f;
        cursor: pointer;
        outline-offset: -2px
      }

      .${ppfx}grabbing {
        cursor: grabbing;
        cursor: -webkit-grabbing;
      }

      .${ppfx}is__grabbing {
        overflow-x: hidden;
      }

      .${ppfx}is__grabbing,
      .${ppfx}is__grabbing * {
        cursor: grabbing !important;
      }

      ${conf.canvasCss || ''}
      ${conf.protectedCss || ''}
    </style>`,
    );
    const { root } = model;
    const { view } = em?.Components?.getType('wrapper') || {};

    if (!view) return;
    if (isFunction(config.customRenderer)) {
      config.customRenderer({
        editor: em.Editor,
        frame: model,
        window: win,
        frameView: this,
        onMount: (rootView) => {
          this.wrapper = rootView;
          this._onRootMount(rootView);
        },
      });
    } else {
      this.wrapper = new view({
        model: root,
        config: {
          ...root.config,
          em,
          frameView: this,
        },
      }).render();
      this._onRootMount(this.wrapper!);
    }
  }

  _onRootMount(rootView: ComponentView) {
    const { config, em, model } = this;
    const doc = this.getDoc();
    const body = doc.body;
    append(body, rootView.el);
    append(
      body,
      new CssRulesView({
        collection: model.getStyles(),
        //@ts-ignore
        config: {
          ...em.Css.getConfig(),
          frameView: this,
        },
      }).render().el,
    );
    append(body, this.getJsContainer());
    // em.trigger('loaded'); // I need to manage only the first one maybe
    //this.updateOffset(); // TOFIX (check if I need it)

    // Avoid some default behaviours
    //@ts-ignore
    on(body, 'click', (ev) => ev && ev.target?.tagName == 'A' && ev.preventDefault());
    on(body, 'submit', (ev) => ev && ev.preventDefault());

    // When the iframe is focused the event dispatcher is not the same so
    // I need to delegate all events to the parent document
    [
      { event: 'keydown keyup keypress', class: 'KeyboardEvent' },
      { event: 'mousedown mousemove mouseup', class: 'MouseEvent' },
      { event: 'pointerdown pointermove pointerup', class: 'PointerEvent' },
      { event: 'wheel', class: 'WheelEvent', opts: { passive: !config.infiniteCanvas } },
    ].forEach((obj) =>
      obj.event.split(' ').forEach((event) => {
        doc.addEventListener(event, (ev) => this.el.dispatchEvent(createCustomEvent(ev, obj.class)), obj.opts);
      }),
    );

    this._toggleEffects(true);

    if (hasDnd(em)) {
      this.droppable = new Droppable(em, this.wrapper?.el);
    }

    this.loaded = true;
    model.trigger('loaded');
  }

  _toggleEffects(enable: boolean) {
    const method = enable ? on : off;
    const win = this.getWindow();
    win && method(win, `${motionsEv} resize`, this._emitUpdate);
  }

  _emitUpdate() {
    this.model._emitUpdated();
  }
}
```

--------------------------------------------------------------------------------

````
