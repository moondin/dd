---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 31
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 31 of 97)

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

---[FILE: ComponentDrag.ts]---
Location: grapesjs-dev/packages/core/src/commands/view/ComponentDrag.ts

```typescript
import { keys, bindAll, each, isUndefined, debounce } from 'underscore';
import Dragger, { DraggerOptions } from '../../utils/Dragger';
import type { CommandObject } from './CommandAbstract';
import type Editor from '../../editor';
import type Component from '../../dom_components/model/Component';
import type EditorModel from '../../editor/model/Editor';
import { getComponentModel, getComponentView } from '../../utils/mixins';
import type ComponentView from '../../dom_components/view/ComponentView';
import type CommandAbstract from './CommandAbstract';

const evName = 'dmode';

export default {
  run(editor, _sender, opts = {} as ComponentDragOpts) {
    bindAll(
      this,
      'setPosition',
      'onStart',
      'onDrag',
      'onEnd',
      'getPosition',
      'getGuidesStatic',
      'renderGuide',
      'getGuidesTarget',
    );

    if (!opts.target) throw new Error('Target option is required');

    const config = {
      doc: opts.target.getEl()?.ownerDocument,
      onStart: this.onStart,
      onEnd: this.onEnd,
      onDrag: this.onDrag,
      getPosition: this.getPosition,
      setPosition: this.setPosition,
      guidesStatic: () => this.guidesStatic ?? [],
      guidesTarget: () => this.guidesTarget ?? [],
      ...(opts.dragger ?? {}),
    };
    this.setupGuides();
    this.opts = opts;
    this.editor = editor;
    this.em = editor.getModel();
    this.target = opts.target;
    this.isTran = opts.mode == 'translate';
    this.guidesContainer = this.getGuidesContainer();
    this.guidesTarget = this.getGuidesTarget();
    this.guidesStatic = this.getGuidesStatic();

    let drg = this.dragger;

    if (!drg) {
      drg = new Dragger(config);
      this.dragger = drg;
    } else {
      drg.setOptions(config);
    }

    opts.event && drg.start(opts.event);
    this.toggleDrag(true);
    this.em.trigger(`${evName}:start`, this.getEventOpts());

    return drg;
  },

  getEventOpts() {
    const guidesActive = this.guidesTarget?.filter((item) => item.active) ?? [];
    return {
      mode: this.opts.mode,
      component: this.target,
      target: this.target,
      guidesTarget: this.guidesTarget,
      guidesStatic: this.guidesStatic,
      guidesMatched: this.getGuidesMatched(guidesActive),
      command: this,
    };
  },

  stop() {
    this.toggleDrag();
  },

  setupGuides() {
    (this.guides ?? []).forEach((item) => {
      const { guide } = item;
      guide?.parentNode?.removeChild(guide);
    });
    this.guides = [];
  },

  getGuidesContainer() {
    let { guidesEl } = this;

    if (!guidesEl) {
      const { editor, em, opts } = this;
      const pfx = editor.getConfig().stylePrefix ?? '';
      const elInfoX = document.createElement('div');
      const elInfoY = document.createElement('div');
      const guideContent = `<div class="${pfx}guide-info__line ${pfx}danger-bg">
        <div class="${pfx}guide-info__content ${pfx}danger-color"></div>
      </div>`;
      guidesEl = document.createElement('div');
      guidesEl.className = `${pfx}guides`;
      elInfoX.className = `${pfx}guide-info ${pfx}guide-info__x`;
      elInfoY.className = `${pfx}guide-info ${pfx}guide-info__y`;
      elInfoX.innerHTML = guideContent;
      elInfoY.innerHTML = guideContent;
      guidesEl.appendChild(elInfoX);
      guidesEl.appendChild(elInfoY);
      editor.Canvas.getGlobalToolsEl()?.appendChild(guidesEl);
      this.guidesEl = guidesEl;
      this.elGuideInfoX = elInfoX;
      this.elGuideInfoY = elInfoY;
      this.elGuideInfoContentX = elInfoX.querySelector(`.${pfx}guide-info__content`) ?? undefined;
      this.elGuideInfoContentY = elInfoY.querySelector(`.${pfx}guide-info__content`) ?? undefined;

      em.on(
        'canvas:update frame:scroll',
        debounce(() => {
          this.updateGuides();
          opts.debug && this.guides?.forEach((item) => this.renderGuide(item));
        }, 200),
      );
    }

    return guidesEl;
  },

  getGuidesStatic() {
    let result: ComponentDragGuide[] = [];
    const el = this.target.getEl();
    const parentNode = el?.parentElement;
    if (!parentNode) return [];
    each(
      parentNode.children,
      (item) => (result = result.concat(el !== item ? this.getElementGuides(item as HTMLElement) : [])),
    );

    return result.concat(this.getElementGuides(parentNode));
  },

  getGuidesTarget() {
    return this.getElementGuides(this.target.getEl()!);
  },

  updateGuides(guides) {
    let lastEl: HTMLElement;
    let lastPos: ComponentOrigRect;
    const guidesToUpdate = guides ?? this.guides ?? [];
    guidesToUpdate.forEach((item) => {
      const { origin } = item;
      const pos = lastEl === origin ? lastPos : this.getElementPos(origin);
      lastEl = origin;
      lastPos = pos;
      each(this.getGuidePosUpdate(item, pos), (val, key) => {
        (item as unknown as Record<string, unknown>)[key] = val;
      });
      item.originRect = pos;
    });
  },

  getGuidePosUpdate(item, rect) {
    const result: { x?: number; y?: number } = {};
    const { top, height, left, width } = rect;

    switch (item.type) {
      case 't':
        result.y = top;
        break;
      case 'b':
        result.y = top + height;
        break;
      case 'l':
        result.x = left;
        break;
      case 'r':
        result.x = left + width;
        break;
      case 'x':
        result.x = left + width / 2;
        break;
      case 'y':
        result.y = top + height / 2;
        break;
    }

    return result;
  },

  renderGuide(item) {
    if (this.opts.skipGuidesRender) return;
    const el = item.guide ?? document.createElement('div');
    const un = 'px';
    const guideSize = item.active ? 2 : 1;

    el.style.cssText = `position: absolute; background-color: ${item.active ? 'green' : 'red'};`;

    if (!el.children.length) {
      const numEl = document.createElement('div');
      numEl.style.cssText = 'position: absolute; color: red; padding: 5px; top: 0; left: 0;';
      el.appendChild(numEl);
    }

    if (item.y) {
      el.style.width = '100%';
      el.style.height = `${guideSize}${un}`;
      el.style.top = `${item.y}${un}`;
      el.style.left = '0';
    } else {
      el.style.width = `${guideSize}${un}`;
      el.style.height = '100%';
      el.style.left = `${item.x}${un}`;
      el.style.top = `0${un}`;
    }

    !item.guide && this.guidesContainer?.appendChild(el);
    return el;
  },

  getElementPos(el) {
    return this.editor.Canvas.getElementPos(el, { noScroll: 1 });
  },

  getElementGuides(el) {
    const { opts } = this;
    const origin = el;
    const originRect = this.getElementPos(el);
    const component = getComponentModel(el);
    const componentView = getComponentView(el);

    const { top, height, left, width } = originRect;
    const guidePoints: { type: string; x?: number; y?: number }[] = [
      { type: 't', y: top }, // Top
      { type: 'b', y: top + height }, // Bottom
      { type: 'l', x: left }, // Left
      { type: 'r', x: left + width }, // Right
      { type: 'x', x: left + width / 2 }, // Mid x
      { type: 'y', y: top + height / 2 }, // Mid y
    ];

    const guides = guidePoints.map((guidePoint) => {
      const guide = opts.debug ? this.renderGuide(guidePoint) : undefined;
      return {
        ...guidePoint,
        component,
        componentView,
        componentEl: origin,
        origin,
        componentElRect: originRect,
        originRect,
        guideEl: guide,
        guide,
      };
    }) as ComponentDragGuide[];

    guides.forEach((guidePoint) => this.guides?.push(guidePoint));

    return guides;
  },

  getTranslate(transform, axis = 'x') {
    let result = 0;
    (transform || '').split(' ').forEach((item) => {
      const itemStr = item.trim();
      const fn = `translate${axis.toUpperCase()}(`;
      if (itemStr.indexOf(fn) === 0) result = parseFloat(itemStr.replace(fn, ''));
    });
    return result;
  },

  setTranslate(transform, axis, value) {
    const fn = `translate${axis.toUpperCase()}(`;
    const val = `${fn}${value})`;
    let result = (transform || '')
      .split(' ')
      .map((item) => {
        const itemStr = item.trim();
        if (itemStr.indexOf(fn) === 0) item = val;
        return item;
      })
      .join(' ');
    if (result.indexOf(fn) < 0) result += ` ${val}`;

    return result;
  },

  getPosition() {
    const { target, isTran } = this;
    const targetStyle = target.getStyle();

    const transform = targetStyle.transform as string | undefined;
    const left = targetStyle.left as string | undefined;
    const top = targetStyle.top as string | undefined;

    let x = 0;
    let y = 0;

    if (isTran && transform) {
      x = this.getTranslate(transform);
      y = this.getTranslate(transform, 'y');
    } else {
      x = parseFloat(left ?? '0');
      y = parseFloat(top ?? '0');
    }

    return { x, y };
  },

  setPosition({ x, y, end, position, width, height }) {
    const { target, isTran, em, opts } = this;
    const unit = 'px';
    const __p = !end; // Indicate if partial change
    const left = `${parseInt(`${x}`, 10)}${unit}`;
    const top = `${parseInt(`${y}`, 10)}${unit}`;
    let styleUp = {};

    if (isTran) {
      let transform = (target.getStyle()?.transform ?? '') as string;
      transform = this.setTranslate(transform, 'x', left);
      transform = this.setTranslate(transform, 'y', top);
      styleUp = { transform, __p };
    } else {
      const adds: any = { position, width, height };
      const style: any = { left, top, __p };
      keys(adds).forEach((add) => {
        const prop = adds[add];
        if (prop) style[add] = prop;
      });
      styleUp = style;
    }

    if (opts.addStyle) {
      opts.addStyle({ component: target, styles: styleUp, partial: !end });
    } else {
      target.addStyle(styleUp, { avoidStore: !end });
    }

    em.Styles.__emitCmpStyleUpdate(styleUp, { components: em.getSelected() });
  },

  _getDragData() {
    const { target } = this;
    return {
      target,
      parent: target.parent(),
      index: target.index(),
    };
  },

  onStart(event) {
    const { target, editor, isTran, opts } = this;
    const { Canvas } = editor;
    const style = target.getStyle();
    const position = 'absolute';
    const relPos = [position, 'relative'];
    opts.onStart?.(this._getDragData());
    if (isTran) return;

    if (style.position !== position) {
      let { left, top, width, height } = Canvas.offset(target.getEl()!);
      let parent = target.parent();
      let parentRel = null;

      // Check for the relative parent
      do {
        const pStyle = parent?.getStyle();
        const position = pStyle?.position as string | undefined;
        if (position) {
          parentRel = relPos.indexOf(position) >= 0 ? parent : null;
        }
        parent = parent?.parent();
      } while (parent && !parentRel);

      // Center the target to the pointer position (used in Droppable for Blocks)
      if (opts.center) {
        const { x, y } = Canvas.getMouseRelativeCanvas(event as MouseEvent);
        left = x;
        top = y;
      } else if (parentRel) {
        const offsetP = Canvas.offset(parentRel.getEl()!);
        left = left - offsetP.left;
        top = top - offsetP.top;
      }

      this.setPosition({
        x: left,
        y: top,
        width: `${width}px`,
        height: `${height}px`,
        position,
      });
    }

    // Recalculate guides to avoid issues with the new position durin the first drag
    this.guidesStatic = this.getGuidesStatic();
  },

  onDrag(event) {
    const { guidesTarget, opts } = this;

    this.updateGuides(guidesTarget);
    opts.debug && guidesTarget?.forEach((item) => this.renderGuide(item));
    opts.guidesInfo && this.renderGuideInfo(guidesTarget?.filter((item) => item.active) ?? []);
    opts.onDrag?.(this._getDragData());

    this.opts.event = event;
    this.em.trigger(`${evName}:move`, this.getEventOpts());
  },

  onEnd(ev, _dragger, opt) {
    const { editor, opts, id } = this;
    opts.onEnd?.(ev, opt, { event: ev, ...opt, ...this._getDragData() });
    editor.stopCommand(`${id}`);
    this.hideGuidesInfo();

    this.em.trigger(`${evName}:end`, this.getEventOpts());
  },

  hideGuidesInfo() {
    ['X', 'Y'].forEach((item) => {
      const guide = this[`elGuideInfo${item}` as ElGuideInfoKey];
      if (guide) guide.style.display = 'none';
    });
  },

  renderGuideInfo(guides = []) {
    this.hideGuidesInfo();

    const guidesMatched = this.getGuidesMatched(guides);

    guidesMatched.forEach((guideMatched) => {
      if (!this.opts.skipGuidesRender) {
        this.renderSingleGuideInfo(guideMatched);
      }

      this.em.trigger(`${evName}:active`, {
        ...this.getEventOpts(),
        ...guideMatched,
      });
    });
  },

  renderSingleGuideInfo(guideMatched) {
    const { posFirst, posSecond, size, sizeRaw, guide, elGuideInfo, elGuideInfoCnt } = guideMatched;

    const axis = isUndefined(guide.x) ? 'y' : 'x';
    const isY = axis === 'y';

    const guideInfoStyle = elGuideInfo.style;

    guideInfoStyle.display = '';
    guideInfoStyle[isY ? 'top' : 'left'] = `${posFirst}px`;
    guideInfoStyle[isY ? 'left' : 'top'] = `${posSecond}px`;
    guideInfoStyle[isY ? 'width' : 'height'] = `${size}px`;

    elGuideInfoCnt.innerHTML = `${Math.round(sizeRaw)}px`;
  },

  getGuidesMatched(guides = []) {
    const { guidesStatic = [] } = this;
    return guides
      .map((guide) => {
        const { origin, x } = guide;
        const rectOrigin = this.getElementPos(origin);
        const axis = isUndefined(x) ? 'y' : 'x';
        const isY = axis === 'y';

        // Calculate the edges of the element
        const origEdge1 = rectOrigin[isY ? 'left' : 'top'];
        const origEdge1Raw = rectOrigin.rect[isY ? 'left' : 'top'];
        const origEdge2 = isY ? origEdge1 + rectOrigin.width : origEdge1 + rectOrigin.height;
        const origEdge2Raw = isY ? origEdge1Raw + rectOrigin.rect.width : origEdge1Raw + rectOrigin.rect.height;

        // Find the nearest element
        const guidesMatched = guidesStatic
          .filter((guideStatic) => {
            // Define complementary guide types
            const complementaryTypes: Record<string, string[]> = {
              l: ['r', 'x'], // Left can match with Right or Middle (horizontal)
              r: ['l', 'x'], // Right can match with Left or Middle (horizontal)
              x: ['l', 'r'], // Middle (horizontal) can match with Left or Right
              t: ['b', 'y'], // Top can match with Bottom or Middle (vertical)
              b: ['t', 'y'], // Bottom can match with Top or Middle (vertical)
              y: ['t', 'b'], // Middle (vertical) can match with Top or Bottom
            };

            // Check if the guide type matches or is complementary
            return guideStatic.type === guide.type || complementaryTypes[guide.type]?.includes(guideStatic.type);
          })
          .map((guideStatic) => {
            const { left, width, top, height } = guideStatic.originRect;
            const statEdge1 = isY ? left : top;
            const statEdge2 = isY ? left + width : top + height;
            return {
              gap: statEdge2 < origEdge1 ? origEdge1 - statEdge2 : statEdge1 - origEdge2,
              guide: guideStatic,
            };
          })
          .filter((item) => item.gap > 0)
          .sort((a, b) => a.gap - b.gap)
          .map((item) => item.guide)
          // Filter the guides that don't match the position of the dragged element
          .filter((item) => {
            switch (guide.type) {
              case 'l':
              case 'r':
              case 'x':
                return Math.abs(item.x - guide.x) < 1;
              case 't':
              case 'b':
              case 'y':
                return Math.abs(item.y - guide.y) < 1;
              default:
                return false;
            }
          });

        // TODO: consider supporting multiple guides
        const firstGuideMatched = guidesMatched[0];

        if (firstGuideMatched) {
          const { left, width, top, height, rect } = firstGuideMatched.originRect;
          const isEdge1 = isY ? left < rectOrigin.left : top < rectOrigin.top;
          const statEdge1 = isY ? left : top;
          const statEdge1Raw = isY ? rect.left : rect.top;
          const statEdge2 = isY ? left + width : top + height;
          const statEdge2Raw = isY ? rect.left + rect.width : rect.top + rect.height;
          const posFirst = isY ? guide.y : guide.x;
          const posSecond = isEdge1 ? statEdge2 : origEdge2;
          const size = isEdge1 ? origEdge1 - statEdge2 : statEdge1 - origEdge2;
          const sizeRaw = isEdge1 ? origEdge1Raw - statEdge2Raw : statEdge1Raw - origEdge2Raw;

          const elGuideInfo = this[`elGuideInfo${axis.toUpperCase()}` as ElGuideInfoKey]!;
          const elGuideInfoCnt = this[`elGuideInfoContent${axis.toUpperCase()}` as ElGuideInfoContentKey]!;

          return {
            guide,
            guidesStatic,
            matched: firstGuideMatched,
            posFirst,
            posSecond,
            size,
            sizeRaw,
            elGuideInfo,
            elGuideInfoCnt,
          };
        } else {
          return null;
        }
      })
      .filter(Boolean) as ComponentDragGuideMatched[];
  },

  toggleDrag(enable) {
    const { ppfx, editor } = this;
    const methodCls = enable ? 'add' : 'remove';
    const classes = [`${ppfx}is__grabbing`];
    const { Canvas } = editor;
    const body = Canvas.getBody();
    classes.forEach((cls) => body.classList[methodCls](cls));
    Canvas[enable ? 'startAutoscroll' : 'stopAutoscroll']();
  },

  // These properties values are set in the run method, they need to be initialized here to avoid TS errors
  editor: undefined as unknown as Editor,
  em: undefined as unknown as EditorModel,
  opts: undefined as unknown as ComponentDragOpts,
  target: undefined as unknown as Component,
} as CommandObject<ComponentDragOpts, ComponentDragProps>;

interface ComponentDragProps {
  editor: Editor;
  em?: EditorModel;
  guides?: ComponentDragGuide[];
  guidesContainer?: HTMLElement;
  guidesEl?: HTMLElement;
  guidesStatic?: ComponentDragGuide[];
  guidesTarget?: ComponentDragGuide[];
  isTran?: boolean;
  opts: ComponentDragOpts;
  target: Component;
  elGuideInfoX?: HTMLElement;
  elGuideInfoY?: HTMLElement;
  elGuideInfoContentX?: HTMLElement;
  elGuideInfoContentY?: HTMLElement;
  dragger?: Dragger;

  getEventOpts: () => ComponentDragEventProps;
  stop: () => void;
  setupGuides: () => void;
  getGuidesContainer: () => HTMLElement;
  getGuidesStatic: () => ComponentDragGuide[];
  getGuidesTarget: () => ComponentDragGuide[];
  updateGuides: (guides?: ComponentDragGuide[]) => void;
  getGuidePosUpdate: (item: ComponentDragGuide, rect: ComponentOrigRect) => { x?: number; y?: number };
  renderGuide: (item: { active?: boolean; guide?: HTMLElement; x?: number; y?: number }) => HTMLElement;
  getElementPos: (el: HTMLElement) => ComponentOrigRect;
  getElementGuides: (el: HTMLElement) => ComponentDragGuide[];
  getTranslate: (transform: string, axis?: string) => number;
  setTranslate: (transform: string, axis: string, value: string) => string;
  getPosition: DraggerOptions['getPosition'];
  setPosition: (data: any) => void; // TODO: fix any
  _getDragData: () => { target: Component; parent?: Component; index?: number };
  onStart: DraggerOptions['onStart'];
  onDrag: DraggerOptions['onDrag'];
  onEnd: DraggerOptions['onEnd'];
  hideGuidesInfo: () => void;
  renderGuideInfo: (guides?: ComponentDragGuide[]) => void;
  renderSingleGuideInfo: (guideMatched: ComponentDragGuideMatched) => void;
  getGuidesMatched: (guides?: ComponentDragGuide[]) => ComponentDragGuideMatched[];
  toggleDrag: (enable?: boolean) => void;
}

interface ComponentDragOpts {
  target: Component;
  center?: number;
  debug?: boolean;
  dragger?: DraggerOptions;
  event?: Event;
  guidesInfo?: number;
  mode?: 'absolute' | 'translate';
  skipGuidesRender?: boolean;
  addStyle?: (data: { component?: Component; styles?: Record<string, unknown>; partial?: boolean }) => void;
  onStart?: (data: any) => Editor;
  onDrag?: (data: any) => Editor;
  onEnd?: (ev: Event, opt: any, data: any) => void;
}

/**
 * Represents the properties of the drag events.
 */
export interface ComponentDragEventProps {
  /**
   * The mode of the drag (absolute or translate).
   */
  mode: ComponentDragOpts['mode'];
  /**
   * The component being dragged.
   * @deprecated Use `component` instead.
   */
  target: Component;
  /**
   * The component being dragged.
   */
  component: Component;
  /**
   * The guides of the component being dragged.
   * @deprecated Use `guidesMatched` instead.
   */
  guidesTarget: ComponentDragGuide[];
  /**
   * All the guides except the ones of the component being dragged.
   * @deprecated Use `guidesMatched` instead.
   */
  guidesStatic: ComponentDragGuide[];
  /**
   * The guides that are being matched.
   */
  guidesMatched: ComponentDragGuideMatched[];

  /**
   * The options used for the drag event.
   */
  command: ComponentDragProps & CommandAbstract<ComponentDragOpts>;
}

/**
 * Represents a guide used during component dragging.
 */
interface ComponentDragGuide {
  /**
   * The type of the guide (e.g., 't', 'b', 'l', 'r', 'x', 'y').
   */
  type: string;
  /**
   * The vertical position of the guide.
   */
  y: number;
  /**
   * The horizontal position of the guide.
   */
  x: number;
  /**
   * The component associated with the guide.
   */
  component: Component;
  /**
   * The view of the component associated with the guide.
   */
  componentView: ComponentView;
  /**
   * The HTML element associated with the guide.
   * @deprecated Use `componentEl` instead.
   */
  origin: HTMLElement;
  /**
   * The HTML element associated with the guide.
   */
  componentEl: HTMLElement;
  /**
   * The rectangle (position and dimensions) of the guide's element.
   * @deprecated Use `componentElRect` instead.
   */
  originRect: ComponentOrigRect;
  /**
   * The rectangle (position and dimensions) of the guide's element.
   */
  componentElRect: ComponentOrigRect;
  /**
   * The HTML element representing the guide.
   * @deprecated Use `guideEl` instead.
   */
  guide?: HTMLElement;
  /**
   * The HTML element representing the guide.
   */
  guideEl?: HTMLElement;
  /**
   * Indicates whether the guide is active.
   * @todo The `active` property is not set in the code, but the value is changing.
   */
  active?: boolean;
}

/**
 * Represents a matched guide during component dragging.
 */
interface ComponentDragGuideMatched {
  /**
   * The static guides used for matching.
   */
  guidesStatic: ComponentDragGuide[];
  /**
   * The origin component guide.
   */
  guide: ComponentDragGuide;
  /**
   * The matched component guide.
   */
  matched: ComponentDragGuide;
  /**
   * The primary position of the guide (either x or y depending on the axis).
   */
  posFirst: number;
  /**
   * The secondary position of the guide (the opposite axis of posFirst).
   */
  posSecond: number;
  /**
   * The distance between the two matched guides in pixels.
   */
  size: number;
  /**
   * The raw distance between the two matched guides in pixels.
   */
  sizeRaw: number;
  /**
   * The HTML element representing the guide info (line between the guides).
   */
  elGuideInfo: HTMLElement;
  /**
   * The container element for the guide info (text content of the line).
   */
  elGuideInfoCnt: HTMLElement;
}

type ComponentRect = { left: number; width: number; top: number; height: number };
type ComponentOrigRect = ComponentRect & { rect: ComponentRect };
type ElGuideInfoKey = 'elGuideInfoX' | 'elGuideInfoY';
type ElGuideInfoContentKey = 'elGuideInfoContentX' | 'elGuideInfoContentY';
```

--------------------------------------------------------------------------------

---[FILE: ComponentEnter.ts]---
Location: grapesjs-dev/packages/core/src/commands/view/ComponentEnter.ts

```typescript
import Component from '../../dom_components/model/Component';
import { CommandObject } from './CommandAbstract';

export default {
  run(ed) {
    if (!ed.Canvas.hasFocus()) return;
    const toSelect: Component[] = [];

    ed.getSelectedAll().forEach((component) => {
      const coll = component.components();
      const next = coll && coll.filter((c: any) => c.get('selectable'))[0];
      next && toSelect.push(next);
    });

    toSelect.length && ed.select(toSelect);
  },
} as CommandObject;
```

--------------------------------------------------------------------------------

---[FILE: ComponentExit.ts]---
Location: grapesjs-dev/packages/core/src/commands/view/ComponentExit.ts

```typescript
import Component from '../../dom_components/model/Component';
import { CommandObject } from './CommandAbstract';

export default {
  run(ed, snd, opts = {}) {
    if (!ed.Canvas.hasFocus() && !opts.force) return;
    const toSelect: Component[] = [];

    ed.getSelectedAll().forEach((component) => {
      let next = component.parent();

      // Recurse through the parent() chain until a selectable parent is found
      while (next && !next.get('selectable')) {
        next = next.parent();
      }

      next && toSelect.push(next);
    });

    toSelect.length && ed.select(toSelect);
  },
} as CommandObject;
```

--------------------------------------------------------------------------------

---[FILE: ComponentNext.ts]---
Location: grapesjs-dev/packages/core/src/commands/view/ComponentNext.ts

```typescript
import Component from '../../dom_components/model/Component';
import { CommandObject } from './CommandAbstract';

export default {
  run(ed) {
    if (!ed.Canvas.hasFocus()) return;
    const toSelect: Component[] = [];

    ed.getSelectedAll().forEach((cmp) => {
      const parent = cmp.parent();
      if (!parent) return;

      const len = parent.components().length;
      let incr = 0;
      let at = 0;
      let next: any;

      // Get the next selectable component
      do {
        incr++;
        at = cmp.index() + incr;
        next = at <= len ? parent.getChildAt(at) : null;
      } while (next && !next.get('selectable'));

      toSelect.push(next || cmp);
    });

    toSelect.length && ed.select(toSelect);
  },
} as CommandObject;
```

--------------------------------------------------------------------------------

---[FILE: ComponentPrev.ts]---
Location: grapesjs-dev/packages/core/src/commands/view/ComponentPrev.ts

```typescript
import Component from '../../dom_components/model/Component';
import { CommandObject } from './CommandAbstract';

export default {
  run(ed) {
    if (!ed.Canvas.hasFocus()) return;
    const toSelect: Component[] = [];

    ed.getSelectedAll().forEach((cmp) => {
      const parent = cmp.parent();
      if (!parent) return;

      let incr = 0;
      let at = 0;
      let next: any;

      // Get the first selectable component
      do {
        incr++;
        at = cmp.index() - incr;
        next = at >= 0 ? parent.getChildAt(at) : null;
      } while (next && !next.get('selectable'));

      toSelect.push(next || cmp);
    });

    toSelect.length && ed.select(toSelect);
  },
} as CommandObject;
```

--------------------------------------------------------------------------------

---[FILE: ComponentStyleClear.ts]---
Location: grapesjs-dev/packages/core/src/commands/view/ComponentStyleClear.ts

```typescript
import { flatten } from 'underscore';
import CssRule from '../../css_composer/model/CssRule';
import { CommandObject } from './CommandAbstract';

export default {
  run(ed, s, opts = {}) {
    const { target } = opts;
    let toRemove: CssRule[] = [];

    if (!target.get('styles')) return toRemove;

    // Find all components in the project, of the target component type
    const type = target.get('type');
    const wrappers = ed.Pages.getAllWrappers();
    const len = flatten(wrappers.map((wrp) => wrp.findType(type))).length;

    // Remove component related styles only if there are no more components
    // of that type in the project
    if (!len) {
      const rules = ed.CssComposer.getAll();
      toRemove = rules.filter((rule) => rule.get('group') === `cmp:${type}`);
      rules.remove(toRemove);
    }

    return toRemove;
  },
} as CommandObject;
```

--------------------------------------------------------------------------------

---[FILE: CopyComponent.ts]---
Location: grapesjs-dev/packages/core/src/commands/view/CopyComponent.ts

```typescript
import { CommandObject } from './CommandAbstract';

export default {
  run(ed) {
    const em = ed.getModel();
    const models = [...ed.getSelectedAll()].map((md) => md.delegate?.copy?.(md) || md).filter(Boolean);
    models.length && em.set('clipboard', models);
  },
} as CommandObject;
```

--------------------------------------------------------------------------------

---[FILE: ExportTemplate.ts]---
Location: grapesjs-dev/packages/core/src/commands/view/ExportTemplate.ts

```typescript
import { CommandObject } from './CommandAbstract';
import { EditorParam } from '../../editor';
import { createEl } from '../../utils/dom';

interface ExportTemplateRunOptions {
  optsHtml?: EditorParam<'getHtml', 0>;
  optsCss?: EditorParam<'getCss', 0>;
}

export default {
  run(editor, sender, opts: ExportTemplateRunOptions = {}) {
    sender && sender.set && sender.set('active', 0);
    const config = editor.getConfig();
    const modal = editor.Modal;
    const pfx = config.stylePrefix;
    this.cm = editor.CodeManager || null;

    if (!this.editors) {
      const oHtmlEd = this.buildEditor('htmlmixed', 'hopscotch', 'HTML');
      const oCsslEd = this.buildEditor('css', 'hopscotch', 'CSS');
      this.htmlEditor = oHtmlEd.model;
      this.cssEditor = oCsslEd.model;
      const editors = createEl('div', { class: `${pfx}export-dl` });
      editors.appendChild(oHtmlEd.el);
      editors.appendChild(oCsslEd.el);
      this.editors = editors;
    }

    modal
      .open({
        title: config.textViewCode,
        content: this.editors,
      })
      .getModel()
      .once('change:open', () => editor.stopCommand(`${this.id}`));
    this.htmlEditor.setContent(editor.getHtml(opts.optsHtml));
    this.cssEditor.setContent(editor.getCss(opts.optsCss));
  },

  stop(editor) {
    const modal = editor.Modal;
    modal && modal.close();
  },

  buildEditor(codeName: string, theme: string, label: string) {
    const cm = this.em.CodeManager;
    const model = cm.createViewer({
      label,
      codeName,
      theme,
    });

    const el = new cm.EditorView({
      model,
      config: cm.getConfig(),
    } as any).render().el;

    return { model, el };
  },
} as CommandObject<{}, { [k: string]: any }>;
```

--------------------------------------------------------------------------------

---[FILE: Fullscreen.ts]---
Location: grapesjs-dev/packages/core/src/commands/view/Fullscreen.ts

```typescript
import { isElement } from 'underscore';
import { CommandObject } from './CommandAbstract';

export default {
  /**
   * Check if fullscreen mode is enabled
   * @return {Boolean}
   */
  isEnabled() {
    const d = document;
    // @ts-ignore
    if (d.fullscreenElement || d.webkitFullscreenElement || d.mozFullScreenElement) {
      return true;
    }
    return false;
  },

  /**
   * Enable fullscreen mode and return browser prefix
   * @param  {HTMLElement} el
   * @return {string}
   */
  enable(el: any) {
    let pfx = '';

    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.webkitRequestFullscreen) {
      pfx = 'webkit';
      el.webkitRequestFullscreen();
    } else if (el.mozRequestFullScreen) {
      pfx = 'moz';
      el.mozRequestFullScreen();
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen();
    }

    return pfx;
  },

  /**
   * Disable fullscreen mode
   */
  disable() {
    const d: any = document;

    if (this.isEnabled()) {
      if (d.exitFullscreen) d.exitFullscreen();
      else if (d.webkitExitFullscreen) d.webkitExitFullscreen();
      else if (d.mozCancelFullScreen) d.mozCancelFullScreen();
      else if (d.msExitFullscreen) d.msExitFullscreen();
    }
  },

  /**
   * Triggered when the state of the fullscreen is changed. Inside detects if
   * it's enabled
   * @param  {strinf} pfx Browser prefix
   * @param  {Event} e
   */
  fsChanged(pfx: string) {
    if (!this.isEnabled()) {
      this.stopCommand({ sender: this.sender });
      document.removeEventListener(`${pfx || ''}fullscreenchange`, this.fsChanged);
    }
  },

  run(editor, sender, opts = {}) {
    this.sender = sender;
    const { target } = opts;
    const targetEl = isElement(target) ? target : document.querySelector(target!);
    const pfx = this.enable(targetEl || editor.getContainer());
    this.fsChanged = this.fsChanged.bind(this, pfx);
    document.addEventListener(pfx + 'fullscreenchange', this.fsChanged);
  },

  stop(editor, sender) {
    if (sender && sender.set) sender.set('active', false);
    this.disable();
  },
} as CommandObject<{ target?: HTMLElement | string }, { [k: string]: any }>;
```

--------------------------------------------------------------------------------

---[FILE: MoveComponent.ts]---
Location: grapesjs-dev/packages/core/src/commands/view/MoveComponent.ts

```typescript
import { bindAll, extend } from 'underscore';
import { $ } from '../../common';
import Component from '../../dom_components/model/Component';
import { off, on } from '../../utils/dom';
import { CommandObject } from './CommandAbstract';
import SelectComponent from './SelectComponent';
import SelectPosition from './SelectPosition';

export default extend({}, SelectPosition, SelectComponent, {
  init(o: any) {
    SelectComponent.init.apply(this, arguments);
    bindAll(this, 'initSorter', 'rollback', 'onEndMove');
    this.opt = o;
    this.hoverClass = this.ppfx + 'highlighter-warning';
    this.badgeClass = this.ppfx + 'badge-warning';
    this.noSelClass = this.ppfx + 'no-select';
  },

  enable(...args: any) {
    SelectComponent.enable.apply(this, args);
    this.getBadgeEl().addClass(this.badgeClass);
    this.getHighlighterEl().addClass(this.hoverClass);
    var wp = this.$wrapper;
    wp.css('cursor', 'move');
    wp.on('mousedown', this.initSorter);

    // Avoid strange moving behavior
    wp.addClass(this.noSelClass);
  },

  /**
   * Overwrite for doing nothing
   * @private
   */
  toggleClipboard() {},

  /**
   * Delegate sorting
   * @param  {Event} e
   * @private
   * */
  initSorter(e: any) {
    var el = $(e.target).data('model');
    var drag = el.get('draggable');
    if (!drag) return;

    // Avoid badge showing on move
    this.cacheEl = null;
    this.startSelectPosition(e.target, this.frameEl.contentDocument);
    this.sorter.draggable = drag;
    this.sorter.eventHandlers.legacyOnEndMove = this.onEndMove.bind(this);
    this.stopSelectComponent();
    this.$wrapper.off('mousedown', this.initSorter);
    on(this.getContentWindow(), 'keydown', this.rollback);
  },

  /**
   * Init sorter from model
   * @param  {Object} model
   * @private
   */
  initSorterFromModel(model: Component) {
    var drag = model.get('draggable');
    if (!drag) return;
    // Avoid badge showing on move
    this.cacheEl = null;
    // @ts-ignore
    var el = model.view.el;
    this.startSelectPosition(el, this.frameEl.contentDocument);
    this.sorter.draggable = drag;
    this.sorter.eventHandlers.legacyOnEndMove = this.onEndMoveFromModel.bind(this);

    /*
    this.sorter.setDragHelper(el);
    var dragHelper = this.sorter.dragHelper;
    dragHelper.className = this.ppfx + 'drag-helper';
    dragHelper.innerHTML = '';
    dragHelper.backgroundColor = 'white';
    */

    this.stopSelectComponent();
    on(this.getContentWindow(), 'keydown', this.rollback);
  },

  /**
   * Init sorter from models
   * @param  {Object} model
   * @private
   */
  initSorterFromModels(models: Component[]) {
    // TODO: if one only check for `draggable`
    // Avoid badge showing on move
    this.cacheEl = null;
    const lastModel = models[models.length - 1];
    const frameView = this.em.getCurrentFrame();
    const el = lastModel.getEl(frameView?.model)!;
    const doc = el.ownerDocument;
    const elements = models.map((model) => model?.view?.el);
    this.startSelectPosition(elements, doc, { onStart: this.onStart });
    this.sorter.eventHandlers.legacyOnMoveClb = this.onDrag;
    this.sorter.eventHandlers.legacyOnEndMove = this.onEndMoveFromModel.bind(this);
    this.stopSelectComponent();
    on(this.getContentWindow(), 'keydown', this.rollback);
  },

  onEndMoveFromModel() {
    off(this.getContentWindow(), 'keydown', this.rollback);
  },

  /**
   * Callback after sorting
   * @private
   */
  onEndMove() {
    this.enable();
    off(this.getContentWindow(), 'keydown', this.rollback);
  },

  /**
   * Say what to do after the component was selected (selectComponent)
   * @param {Event} e
   * @param {Object} Selected element
   * @private
   * */
  onSelect(e: any, el: any) {},

  /**
   * Used to bring the previous situation before start moving the component
   * @param {Event} e
   * @param {Boolean} Indicates if rollback in anycase
   * @private
   * */
  rollback(e: any, force: boolean) {
    var key = e.which || e.keyCode;
    if (key == 27 || force) {
      this.sorter.cancelDrag();
    }
    return;
  },

  /**
   * Returns badge element
   * @return {HTMLElement}
   * @private
   */
  getBadgeEl() {
    if (!this.$badge) this.$badge = $(this.getBadge());
    return this.$badge;
  },

  /**
   * Returns highlighter element
   * @return {HTMLElement}
   * @private
   */
  getHighlighterEl() {
    if (!this.$hl) this.$hl = $(this.canvas.getHighlighter());
    return this.$hl;
  },

  stop(...args) {
    // @ts-ignore
    SelectComponent.stop.apply(this, args);
    this.getBadgeEl().removeClass(this.badgeClass);
    this.getHighlighterEl().removeClass(this.hoverClass);
    var wp = this.$wrapper;
    wp.css('cursor', '').unbind().removeClass(this.noSelClass);
  },
} as CommandObject<{}, { [k: string]: any }>);
```

--------------------------------------------------------------------------------

````
