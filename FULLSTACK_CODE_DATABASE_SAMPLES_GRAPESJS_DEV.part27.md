---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 27
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 27 of 97)

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

---[FILE: config.ts]---
Location: grapesjs-dev/packages/core/src/canvas/config/config.ts

```typescript
import Component from '../../dom_components/model/Component';
import ComponentView from '../../dom_components/view/ComponentView';
import Editor from '../../editor';
import { CanvasSpotBuiltInTypes } from '../model/CanvasSpot';
import Frame from '../model/Frame';
import FrameView from '../view/FrameView';

export interface CustomRendererProps {
  editor: Editor;
  frame: Frame;
  window: Window;
  frameView: FrameView;
  onMount: (view: ComponentView) => void;
}

export interface CanvasConfig {
  stylePrefix?: string;

  /**
   * Append external scripts to the `<head>` of the iframe.
   * Be aware that these scripts will not be printed in the export code.
   * @default []
   * @example
   * scripts: [ 'https://...1.js', 'https://...2.js' ]
   * // or passing objects as attributes
   * scripts: [ { src: '/file.js', someattr: 'value' }, ... ]
   */
  scripts?: (string | Record<string, any>)[];

  /**
   * Append external styles to the `<head>` of the iframe.
   * Be aware that these scripts will not be printed in the export code.
   * @default []
   * @example
   * styles: [ 'https://...1.css', 'https://...2.css' ]
   * // or passing objects as attributes
   * styles: [ { href: '/style.css', someattr: 'value' }, ... ]
   */
  styles?: (string | Record<string, any>)[];

  /**
   * Add custom badge naming strategy.
   * @example
   * customBadgeLabel: component => component.getName(),
   */
  customBadgeLabel?: (component: Component) => string;

  /**
   * Indicate when to start the autoscroll of the canvas on component/block dragging (value in px).
   * @default 50
   */
  autoscrollLimit?: number;

  /**
   * Experimental: external highlighter box
   */
  extHl?: boolean;

  /**
   * Initial content to load in all frames.
   * The default value enables the standard mode for the iframe.
   * @default '<!DOCTYPE html>'
   */
  frameContent?: string;

  /**
   * Initial style to load in all frames.
   */
  frameStyle?: string;

  /**
   * When some textable component is selected and focused (eg. input or text component), the editor
   * stops some commands (eg. disables the copy/paste of components with CTRL+C/V to allow the copy/paste of the text).
   * This option allows to customize, by a selector, which element should not be considered textable.
   */
  notTextable?: string[];

  /**
   * By default, the editor allows to drop external elements by relying on the native HTML5
   * drag & drop API (eg. like a D&D of an image file from your desktop).
   * If you want to customize how external elements are interpreted by the editor, you can rely
   * on `canvas:dragdata` event, eg. https://github.com/GrapesJS/grapesjs/discussions/3849
   * @default true
   */
  allowExternalDrop?: boolean;

  /**
   * Disable the rendering of built-in canvas spots.
   *
   * Read here for more information about [Canvas Spots](https://grapesjs.com/docs/modules/Canvas.html#canvas-spots).
   * @example
   * // Disable only the hover type spot
   * customSpots: { hover: true },
   *
   * // Disable all built-in spots
   * customSpots: true,
   */
  customSpots?: boolean | Partial<Record<CanvasSpotBuiltInTypes, boolean>>;

  /**
   * Experimental: enable infinite canvas.
   */
  infiniteCanvas?: boolean;

  /**
   * Enables the scrollable canvas feature.
   *
   * When this feature flag is set to `true`, the canvas element
   * will have its `overflow` style set to `auto`, allowing users to scroll
   * the canvas content if it exceeds the visible area.  This is useful for
   * handling large diagrams or zoomed-in views where parts of the content
   * are initially hidden.  If `false`, the canvas will use default overflow (typically hidden).
   *
   * @default false
   */
  scrollableCanvas?: boolean;

  /**
   * Custom renderer function for canvas content.
   * This allows replacing the default HTML rendering with custom frameworks like React.
   * @example
   * customRenderer: ({ editor, frame, window, frameView }) => {
   *   // Mount React on the frame body
   *   const root = frame.getComponent();
   *   const reactRoot = createRoot(window.document.body);
   *   reactRoot.render(<React.StrictMode><RenderChildren components={[root]}/></React.StrictMode>);
   * }
   */
  customRenderer?: (props: CustomRendererProps) => void;
}

const config: () => CanvasConfig = () => ({
  stylePrefix: 'cv-',
  scripts: [],
  styles: [],
  customBadgeLabel: undefined,
  autoscrollLimit: 50,
  extHl: false,
  frameContent: '<!DOCTYPE html>',
  frameStyle: `
    body { background-color: #fff }
    * ::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.1) }
    * ::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2) }
    * ::-webkit-scrollbar { width: 10px }
  `,
  notTextable: ['button', 'a', 'input[type=checkbox]', 'input[type=radio]'],
  allowExternalDrop: true,
});

export default config;
```

--------------------------------------------------------------------------------

---[FILE: Canvas.ts]---
Location: grapesjs-dev/packages/core/src/canvas/model/Canvas.ts

```typescript
import CanvasModule from '..';
import { ModuleModel } from '../../abstract';
import { Coordinates, CoordinatesTypes, DEFAULT_COORDS, ObjectAny } from '../../common';
import DeviceEvents from '../../device_manager/types';
import Page from '../../pages/model/Page';
import PagesEvents from '../../pages/types';
import Frame from './Frame';
import Frames from './Frames';

export default class Canvas extends ModuleModel<CanvasModule> {
  defaults() {
    return {
      frame: '',
      frames: [],
      rulers: false,
      zoom: 100,
      x: 0,
      y: 0,
      // Scripts to apply on all frames
      scripts: [],
      // Styles to apply on all frames
      styles: [],
      pointer: DEFAULT_COORDS,
      pointerScreen: DEFAULT_COORDS,
    };
  }

  constructor(module: CanvasModule) {
    const { em, config } = module;
    const { scripts, styles } = config;
    super(module, { scripts, styles });
    this.set('frames', new Frames(module));
    this.on('change:zoom', this.onZoomChange);
    this.on('change:x change:y', this.onCoordsChange);
    this.on('change:pointer change:pointerScreen', this.onPointerChange);
    this.listenTo(em, `change:device ${DeviceEvents.update}`, this.updateDevice);
    this.listenTo(em, PagesEvents.select, this._pageUpdated);
  }

  get frames(): Frames {
    return this.get('frames');
  }

  init() {
    const { em } = this;
    const mainPage = em.Pages._initPage();
    this.set('frames', mainPage.getFrames());
    this.updateDevice({ frame: mainPage.getMainFrame() });
  }

  _pageUpdated(page: Page, prev?: Page) {
    const { em } = this;
    em.setSelected();
    em.get('readyCanvas') && em.stopDefault(); // We have to stop before changing current frames
    prev?.getFrames().map((frame) => {
      frame.disable();
      frame._emitUnload();
    });
    this.set('frames', page.getFrames());
    this.updateDevice({ frame: page.getMainFrame() });
  }

  updateDevice(opts: { frame?: Frame } = {}) {
    const { em } = this;
    const device = em.getDeviceModel();
    const frame = opts.frame || em.getCurrentFrameModel();

    if (frame && device) {
      const { width, height, minHeight } = device.attributes;
      frame.set({ width, height, minHeight }, { noUndo: 1 });
    }
  }

  onZoomChange(m: any, v: any, options: ObjectAny) {
    const { em, module } = this;
    const zoom = this.get('zoom');
    zoom < 1 && this.set('zoom', 1);
    em.trigger(module.events.zoom, { options });
  }

  onCoordsChange() {
    const { em, module } = this;
    em.trigger(module.events.coords);
  }

  onPointerChange() {
    const { em, module } = this;
    em.trigger(module.events.pointer);
  }

  getPointerCoords(type: CoordinatesTypes = CoordinatesTypes.World): Coordinates {
    const { pointer, pointerScreen } = this.attributes;
    return type === CoordinatesTypes.World ? pointer : pointerScreen;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: CanvasSpot.ts]---
Location: grapesjs-dev/packages/core/src/canvas/model/CanvasSpot.ts

```typescript
import CanvasModule from '..';
import { ModuleModel } from '../../abstract';
import { BoxRect, LiteralUnion } from '../../common';
import Component from '../../dom_components/model/Component';
import ComponentView from '../../dom_components/view/ComponentView';
import { GetBoxRectOptions } from '../types';
import Frame from './Frame';

export enum CanvasSpotBuiltInTypes {
  Select = 'select',
  Hover = 'hover',
  Spacing = 'spacing',
  Target = 'target',
  Resize = 'resize',
}

export type CanvasSpotBuiltInType = `${CanvasSpotBuiltInTypes}`;

export type CanvasSpotType = LiteralUnion<CanvasSpotBuiltInType, string>;

/** @private */
export interface CanvasSpotBase<T extends CanvasSpotType> {
  /**
   * Spot type, eg. `select`.
   */
  type: T;
  /**
   * Spot ID.
   */
  id: string;
  /**
   * Fixed box rect of the spot, eg. `{ width: 100, height: 100, x: 0, y: 0 }`.
   */
  boxRect?: BoxRect;
  /**
   * Component to which the spot will be attached.
   */
  component?: Component;
  /**
   * ComponentView to which the spot will be attached.
   */
  componentView?: ComponentView;
  frame?: Frame;
}

export interface CanvasSpotProps<T extends CanvasSpotType = CanvasSpotType> extends CanvasSpotBase<T> {}

/**
 * Canvas spots are elements drawn on top of the canvas. They can be used to represent anything you
 * might need but the most common use case of canvas spots is rendering information and managing
 * components rendered in the canvas.
 * Read here for more information about [Canvas Spots](https://grapesjs.com/docs/modules/Canvas.html#canvas-spots)
 *
 * [Component]: component.html
 *
 * @property {String} id Spot ID.
 * @property {String} type Spot type.
 * @property {[Component]} [component] Component to which the spot will be attached.
 * @property {ComponentView} [componentView] ComponentView to which the spot will be attached.
 * @property {Object} [boxRect] Fixed box rect of the spot, eg. `{ width: 100, height: 100, x: 0, y: 0 }`.
 *
 */
export default class CanvasSpot<T extends CanvasSpotProps = CanvasSpotProps> extends ModuleModel<CanvasModule, T> {
  defaults() {
    return {
      id: '',
      type: '',
    } as T;
  }

  get type() {
    return this.get('type') || '';
  }

  get component() {
    const cmp = this.get('component');
    return cmp || this.get('componentView')?.model;
  }

  get componentView() {
    const cmpView = this.get('componentView');
    return cmpView || this.get('component')?.getView();
  }

  get el() {
    return this.componentView?.el;
  }

  /**
   * Get the box rect of the spot.
   * @param {Object} [opts={}]
   * @returns {Object} The box rect object
   * @example
   * canvasSpot.getBoxRect();
   * // { width: 100, height: 50, x: 0, y: 0 }
   */
  getBoxRect(opts?: GetBoxRectOptions) {
    const { el, em } = this;
    const cvView = em.Canvas.getCanvasView();
    const boxRect = this.get('boxRect');

    if (boxRect) {
      return boxRect;
    } else if (el && cvView) {
      return cvView.getElBoxRect(el, opts);
    }

    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
  }

  /**
   * Get the style object of the spot.
   * @param {Object} [opts={}]
   * @returns {CSSStyleDeclaration} [opts]
   * @example
   * canvasSpot.getStyle();
   * // { width: '100px', height: '...', ... }
   */
  getStyle(opts: { boxRect?: BoxRect } & GetBoxRectOptions = {}): Partial<CSSStyleDeclaration> {
    const { width, height, x, y } = opts.boxRect || this.getBoxRect(opts);

    return {
      width: `${width}px`,
      height: `${height}px`,
      top: '0',
      left: '0',
      position: 'absolute',
      translate: `${x}px ${y}px`,
    };
  }

  /**
   * Check the spot type.
   * @param {String} type
   * @returns {Boolean}
   * @example
   * canvasSpot.isType('select');
   */
  isType<E extends T>(type: E['type']): this is CanvasSpot<E> {
    return this.type === type;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: CanvasSpots.ts]---
Location: grapesjs-dev/packages/core/src/canvas/model/CanvasSpots.ts

```typescript
import { debounce } from 'underscore';
import CanvasModule from '..';
import { ModuleCollection } from '../../abstract';
import { Debounced, ObjectAny } from '../../common';
import EditorModel from '../../editor/model/Editor';
import CanvasSpot, { CanvasSpotProps } from './CanvasSpot';
import { ComponentsEvents } from '../../dom_components/types';

export default class CanvasSpots extends ModuleCollection<CanvasSpot> {
  refreshDbn: Debounced;

  constructor(module: CanvasModule, models: CanvasSpot[] | CanvasSpotProps[] = []) {
    super(module, models, CanvasSpot);
    this.on('add', this.onAdd);
    this.on('change', this.onChange);
    this.on('remove', this.onRemove);
    const { em } = this;
    this.refreshDbn = debounce(() => this.refresh(), 0);

    const evToRefreshDbn = `${ComponentsEvents.resize} styleable:change ${ComponentsEvents.input} ${ComponentsEvents.update} frame:updated undo redo`;
    this.listenTo(em, evToRefreshDbn, () => this.refreshDbn());
  }

  get em(): EditorModel {
    return this.module.em;
  }

  get events() {
    return this.module.events;
  }

  refresh() {
    const { em, events } = this;
    em.trigger(events.spot);
  }

  onAdd(spot: CanvasSpot) {
    this.__trgEvent(this.events.spotAdd, { spot });
  }

  onChange(spot: CanvasSpot) {
    this.__trgEvent(this.events.spotUpdate, { spot });
  }

  onRemove(spot: CanvasSpot) {
    this.__trgEvent(this.events.spotRemove, { spot });
  }

  __trgEvent(event: string, props: ObjectAny) {
    const { module } = this;
    const { em } = module;
    em.trigger(event, props);
    this.refreshDbn();
  }
}
```

--------------------------------------------------------------------------------

---[FILE: Frame.ts]---
Location: grapesjs-dev/packages/core/src/canvas/model/Frame.ts

```typescript
import { forEach, isEmpty, isNumber, isString, keys, result } from 'underscore';
import CanvasModule from '..';
import { ModuleModel } from '../../abstract';
import { BoxRect, PrevToNewIdMap } from '../../common';
import ComponentWrapper from '../../dom_components/model/ComponentWrapper';
import Page from '../../pages/model/Page';
import { createId, isComponent, isObject } from '../../utils/mixins';
import FrameView from '../view/FrameView';
import Frames from './Frames';
import { CssRuleJSON } from '../../css_composer/model/CssRule';
import CanvasEvents from '../types';

const keyAutoW = '__aw';
const keyAutoH = '__ah';

const getDimension = (frame: Frame, type: 'width' | 'height') => {
  const dim = frame.get(type);
  const viewDim = frame.view?.el[type === 'width' ? 'offsetWidth' : 'offsetHeight'];

  if (isNumber(dim)) {
    return dim;
  } else if (isString(dim) && dim.endsWith('px')) {
    return parseFloat(dim);
  } else if (viewDim) {
    return viewDim;
  } else {
    return 0;
  }
};

/**
 * @property {Object|String} component Wrapper component definition. You can also pass an HTML string as components of the default wrapper component.
 * @property {String} [width=''] Width of the frame. By default, the canvas width will be taken.
 * @property {String} [height=''] Height of the frame. By default, the canvas height will be taken.
 * @property {Number} [x=0] Horizontal position of the frame in the canvas.
 * @property {Number} [y=0] Vertical position of the frame in the canvas.
 *
 */
export default class Frame extends ModuleModel<CanvasModule> {
  defaults() {
    return {
      x: 0,
      y: 0,
      changesCount: 0,
      attributes: {},
      width: null,
      height: null,
      head: [],
      component: '',
      styles: '',
      refFrame: null,
      _undo: true,
      _undoexc: ['changesCount'],
    };
  }
  view?: FrameView;

  /**
   * @hideconstructor
   */
  constructor(module: CanvasModule, attr: any) {
    super(module, attr);
    const { em } = this;
    const { styles, component } = this.attributes;
    const domc = em.Components;
    const conf = domc.getConfig();
    const allRules = em.Css.getAll();
    const idMap: PrevToNewIdMap = {};
    const modOpts = { em, config: conf, frame: this, idMap };

    if (!isComponent(component)) {
      const wrp = isObject(component) ? component : { components: component };
      !wrp.type && (wrp.type = 'wrapper');
      const Wrapper = domc.getType('wrapper')!.model;
      this.set('component', new Wrapper(wrp, modOpts));
    }

    if (!styles) {
      this.set('styles', allRules);
    } else if (!isObject(styles)) {
      let newStyles = styles as string | CssRuleJSON[];

      // Avoid losing styles on remapped components
      if (keys(idMap).length) {
        newStyles = isString(newStyles) ? em.Parser.parseCss(newStyles) : newStyles;
        em.Css.checkId(newStyles, { idMap });
      }

      allRules.add(newStyles);
      this.set('styles', allRules);
    }

    !attr.width && this.set(keyAutoW, 1);
    !attr.height && this.set(keyAutoH, 1);

    !this.id && this.set('id', createId());
  }

  get width() {
    return getDimension(this, 'width');
  }

  get height() {
    return getDimension(this, 'height');
  }

  get head(): { tag: string; attributes: any }[] {
    return this.get('head');
  }

  get refFrame(): Frame | undefined {
    return this.get('refFrame');
  }

  get root() {
    const { refFrame } = this;
    return refFrame?.getComponent() || this.getComponent();
  }

  initRefs() {
    const { refFrame } = this;
    if (isString(refFrame)) {
      const frame = this.module.framesById[refFrame];
      frame && this.set({ refFrame: frame }, { silent: true });
    }
  }

  getBoxRect(): BoxRect {
    const { x, y } = this.attributes;
    const { width, height } = this;

    return {
      x,
      y,
      width,
      height,
    };
  }

  onRemove() {
    !this.refFrame && this.getComponent().remove({ root: 1 });
  }

  changesUp(opt: any = {}) {
    if (opt.temporary || opt.noCount || opt.avoidStore) {
      return;
    }
    this.set('changesCount', this.get('changesCount') + 1);
  }

  getComponent(): ComponentWrapper {
    return this.get('component');
  }

  getStyles() {
    return this.get('styles');
  }

  disable() {
    this.trigger('disable');
  }

  remove() {
    this.view?.remove();
    this.view = undefined;
    const coll = this.collection;
    return coll && coll.remove(this);
  }

  getHead() {
    return [...this.head];
  }

  setHead(value: { tag: string; attributes: any }[]) {
    return this.set('head', [...value]);
  }

  addHeadItem(item: { tag: string; attributes: any }) {
    this.head.push(item);
  }

  getHeadByAttr(attr: string, value: any, tag: string) {
    return this.head.filter(
      (item) => item.attributes && item.attributes[attr] == value && (!tag || tag === item.tag),
    )[0];
  }

  removeHeadByAttr(attr: string, value: any, tag: string) {
    const item = this.getHeadByAttr(attr, value, tag);
    const index = this.head.indexOf(item);

    if (index >= 0) {
      this.head.splice(index, 1);
    }
  }

  addLink(href: string) {
    const tag = 'link';
    !this.getHeadByAttr('href', href, tag) &&
      this.addHeadItem({
        tag,
        attributes: {
          href,
          rel: 'stylesheet',
        },
      });
  }

  removeLink(href: string) {
    this.removeHeadByAttr('href', href, 'link');
  }

  addScript(src: string) {
    const tag = 'script';
    !this.getHeadByAttr('src', src, tag) &&
      this.addHeadItem({
        tag,
        attributes: { src },
      });
  }

  removeScript(src: string) {
    this.removeHeadByAttr('src', src, 'script');
  }

  getPage(): Page | undefined {
    return (this.collection as unknown as Frames)?.page;
  }

  _emitUpdated(data = {}) {
    this.em.trigger('frame:updated', { frame: this, ...data });
  }

  _emitUnload() {
    this._emitWithEditor(CanvasEvents.frameUnload, { frame: this });
  }

  _emitWithEditor(event: string, data?: Record<string, any>) {
    [this.em, this].forEach((item) => item?.trigger(event, data));
  }

  hasAutoHeight() {
    const { height } = this.attributes;

    if (height === 'auto' || this.config.infiniteCanvas) {
      return true;
    }

    return false;
  }

  toJSON(opts: any = {}) {
    const obj = ModuleModel.prototype.toJSON.call(this, opts);
    const defaults = result(this, 'defaults');

    if (opts.fromUndo) delete obj.component;
    delete obj.styles;
    delete obj.changesCount;
    obj[keyAutoW] && delete obj.width;
    obj[keyAutoH] && delete obj.height;

    if (obj.refFrame) {
      obj.refFrame = obj.refFrame.id;
      delete obj.component;
    }

    // Remove private keys
    forEach(obj, (value, key) => {
      key.indexOf('_') === 0 && delete obj[key];
    });

    forEach(defaults, (value, key) => {
      if (obj[key] === value) delete obj[key];
    });

    forEach(['attributes', 'head'], (prop) => {
      if (isEmpty(obj[prop])) delete obj[prop];
    });

    return obj;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: Frames.ts]---
Location: grapesjs-dev/packages/core/src/canvas/model/Frames.ts

```typescript
import { bindAll } from 'underscore';
import CanvasModule from '..';
import { ModuleCollection } from '../../abstract';
import Page from '../../pages/model/Page';
import Frame from './Frame';

export default class Frames extends ModuleCollection<Frame> {
  loadedItems = 0;
  itemsToLoad = 0;
  page?: Page;

  constructor(module: CanvasModule, models: Frame[] | Array<Record<string, any>> = []) {
    super(module, models, Frame);
    bindAll(this, 'itemLoaded');
    this.on('add', this.onAdd);
    this.on('reset', this.onReset);
    this.on('remove', this.onRemove);
    this.forEach((frame) => this.onAdd(frame));
  }

  onAdd(frame: Frame) {
    this.module.framesById[frame.id] = frame;
  }

  onReset(m: Frame, opts?: { previousModels?: Frame[] }) {
    const prev = opts?.previousModels || [];
    prev.map((p) => this.onRemove(p));
  }

  onRemove(frame: Frame) {
    frame.onRemove();
    delete this.module.framesById[frame.id];
  }

  initRefs() {
    this.forEach((frame) => frame.initRefs());
  }

  itemLoaded() {
    this.loadedItems++;

    if (this.loadedItems >= this.itemsToLoad) {
      this.trigger('loaded:all');
      this.listenToLoadItems(false);
    }
  }

  listenToLoad() {
    this.loadedItems = 0;
    this.itemsToLoad = this.length;
    this.listenToLoadItems(true);
  }

  listenToLoadItems(on: boolean) {
    this.forEach((item) => item[on ? 'on' : 'off']('loaded', this.itemLoaded));
  }
}
```

--------------------------------------------------------------------------------

````
