---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 32
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 32 of 97)

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

---[FILE: OpenAssets.ts]---
Location: grapesjs-dev/packages/core/src/commands/view/OpenAssets.ts

```typescript
import { isFunction } from 'underscore';
import Asset from '../../asset_manager/model/Asset';
import { createEl } from '../../utils/dom';
import { CommandObject } from './CommandAbstract';

export default {
  open(content: string) {
    const { editor, title, config, am } = this;
    const { custom } = config;
    if (isFunction(custom.open)) {
      return custom.open(am.__customData());
    }
    const { Modal } = editor;
    Modal.open({ title, content }).onceClose(() => editor.stopCommand(this.id));
  },

  close() {
    const { custom } = this.config;
    if (isFunction(custom.close)) {
      return custom.close(this.am.__customData());
    }
    const { Modal } = this.editor;
    Modal && Modal.close();
  },

  run(editor, sender, opts = {}) {
    const am = editor.AssetManager;
    const config = am.getConfig();
    const { types = [], accept, select } = opts;
    this.title = opts.modalTitle || editor.t('assetManager.modalTitle') || '';
    this.editor = editor;
    this.config = config;
    this.am = am;

    am.setTarget(opts.target);
    am.onClick(opts.onClick);
    am.onDblClick(opts.onDblClick);
    am.onSelect(opts.onSelect);
    am.__behaviour({
      select,
      types,
      options: opts,
    });

    if (config.custom) {
      this.rendered = this.rendered || createEl('div');
      this.rendered.className = `${config.stylePrefix}custom-wrp`;
      am.__behaviour({ container: this.rendered });
      am.__trgCustom();
    } else {
      if (!this.rendered || types) {
        let assets: Asset[] = am.getAll().filter((i: Asset) => i);

        if (types && types.length) {
          assets = assets.filter((a) => types.indexOf(a.get('type')) !== -1);
        }

        am.render(assets);
        this.rendered = am.getContainer();
      }

      if (accept) {
        const uploadEl = this.rendered.querySelector(`input#${config.stylePrefix}uploadFile`);
        uploadEl && uploadEl.setAttribute('accept', accept);
      }
    }

    this.open(this.rendered);
    return this;
  },

  stop(editor) {
    this.editor = editor;
    this.close(this.rendered);
  },
} as CommandObject<any, { [k: string]: any }>;
```

--------------------------------------------------------------------------------

---[FILE: OpenBlocks.ts]---
Location: grapesjs-dev/packages/core/src/commands/view/OpenBlocks.ts

```typescript
import { isFunction } from 'underscore';
import { createEl } from '../../utils/dom';
import { CommandObject } from './CommandAbstract';

export default {
  open() {
    const { container, editor, bm, config } = this;
    const { custom, appendTo } = config;

    if (isFunction(custom.open)) {
      return custom.open(bm.__customData());
    }

    if (this.firstRender && !appendTo) {
      const id = 'views-container';
      const pn = editor.Panels;
      const panels = pn.getPanel(id) || pn.addPanel({ id });
      panels.set('appendContent', container).trigger('change:appendContent');
      if (!custom) container.appendChild(bm.render());
    }

    if (container) container.style.display = 'block';
  },

  close() {
    const { container, config } = this;
    const { custom } = config;

    if (isFunction(custom.close)) {
      return custom.close(this.bm.__customData());
    }

    if (container) container.style.display = 'none';
  },

  run(editor) {
    const bm = editor.Blocks;
    this.config = bm.getConfig();
    this.firstRender = !this.container;
    this.container = this.container || createEl('div');
    this.editor = editor;
    this.bm = bm;
    const { container } = this;
    bm.__behaviour({
      container,
    });

    if (this.config.custom) {
      bm.__trgCustom();
    }

    this.open();
  },

  stop() {
    this.close();
  },
} as CommandObject<{}, { [k: string]: any }>;
```

--------------------------------------------------------------------------------

---[FILE: OpenLayers.ts]---
Location: grapesjs-dev/packages/core/src/commands/view/OpenLayers.ts

```typescript
import { CommandObject } from './CommandAbstract';

export default {
  run(editor) {
    const lm = editor.LayerManager;
    const pn = editor.Panels;
    const lmConfig = lm.getConfig();

    if (lmConfig.appendTo) return;

    if (!this.layers) {
      const id = 'views-container';
      const layers = document.createElement('div');
      // @ts-ignore
      const panels = pn.getPanel(id) || pn.addPanel({ id });

      if (lmConfig.custom) {
        lm.__trgCustom({ container: layers });
      } else {
        layers.appendChild(lm.render());
      }

      panels.set('appendContent', layers).trigger('change:appendContent');
      this.layers = layers;
    }

    this.layers.style.display = 'block';
  },

  stop() {
    const { layers } = this;
    layers && (layers.style.display = 'none');
  },
} as CommandObject<{}, { [k: string]: any }>;
```

--------------------------------------------------------------------------------

---[FILE: OpenStyleManager.ts]---
Location: grapesjs-dev/packages/core/src/commands/view/OpenStyleManager.ts

```typescript
import { $ } from '../../common';
import { CommandObject } from './CommandAbstract';

export default {
  run(editor, sender) {
    this.sender = sender;

    if (!this.$cnt) {
      const config = editor.getConfig();
      const { Panels, DeviceManager, SelectorManager, StyleManager } = editor;
      const trgEvCnt = 'change:appendContent';
      const $cnt = $('<div></div>');
      const $cntInner = $('<div></div>');
      const $cntSlm = $('<div></div>');
      const $cntSm = $('<div></div>');
      this.$cnt = $cnt;
      this.$cntInner = $cntInner;
      $cntInner.append($cntSlm);
      $cntInner.append($cntSm);
      $cnt.append($cntInner);

      // Device Manager
      if (DeviceManager && config.showDevices) {
        const devicePanel = Panels.addPanel({ id: 'devices-c' });
        const dvEl = DeviceManager.render();
        devicePanel.set('appendContent', dvEl).trigger(trgEvCnt);
      }

      // Selector Manager container
      const slmConfig = SelectorManager.getConfig();
      if (slmConfig.custom) {
        SelectorManager.__trgCustom({ container: $cntSlm.get(0) });
      } else if (!slmConfig.appendTo) {
        $cntSlm.append(SelectorManager.render([]));
      }

      // Style Manager
      this.sm = StyleManager;
      const smConfig = StyleManager.getConfig();
      const pfx = smConfig.stylePrefix;
      this.$header = $(`<div class="${pfx}header">${editor.t('styleManager.empty')}</div>`);
      $cnt.append(this.$header);

      if (smConfig.custom) {
        StyleManager.__trgCustom({ container: $cntSm.get(0) });
      } else if (!smConfig.appendTo) {
        $cntSm.append(StyleManager.render());
      }

      // Create panel if not exists
      const pnCnt = 'views-container';
      const pnl = Panels.getPanel(pnCnt) || Panels.addPanel({ id: pnCnt });

      // Add all containers to the panel
      pnl.set('appendContent', $cnt).trigger(trgEvCnt);

      // Toggle Style Manager on target selection
      const em = editor.getModel();
      this.listenTo(em, StyleManager.events.target, this.toggleSm);
    }

    this.toggleSm();
  },

  /**
   * Toggle Style Manager visibility
   * @private
   */
  toggleSm() {
    const { sender, sm, $cntInner, $header } = this;
    if ((sender && sender.get && !sender.get('active')) || !sm) return;

    if (sm.getSelected()) {
      $cntInner?.show();
      $header?.hide();
    } else {
      $cntInner?.hide();
      $header?.show();
    }
  },

  stop() {
    this.$cntInner?.hide();
    this.$header?.hide();
  },
} as CommandObject<{}, { [k: string]: any }>;
```

--------------------------------------------------------------------------------

---[FILE: OpenTraitManager.ts]---
Location: grapesjs-dev/packages/core/src/commands/view/OpenTraitManager.ts

```typescript
import { CommandObject } from './CommandAbstract';
import { $ } from '../../common';

export default {
  run(editor, sender) {
    this.sender = sender;
    const em = editor.getModel();

    const config = editor.Config;
    const pfx = config.stylePrefix;
    const tm = editor.TraitManager;
    const confTm = tm.getConfig();
    let panelC;

    if (confTm.appendTo) return;

    if (!this.$cn) {
      this.$cn = $('<div></div>');
      this.$cn2 = $('<div></div>');
      this.$cn.append(this.$cn2);
      this.$header = $('<div>').append(`<div class="${confTm.stylePrefix}header">${em.t('traitManager.empty')}</div>`);
      this.$cn.append(this.$header);

      if (confTm.custom) {
        tm.__trgCustom({ container: this.$cn2.get(0) });
      } else {
        this.$cn2.append(`<div class="${pfx}traits-label">${em.t('traitManager.label')}</div>`);
        this.$cn2.append(tm.render());
      }

      var panels = editor.Panels;

      if (!panels.getPanel('views-container')) {
        // @ts-ignore
        panelC = panels.addPanel({ id: 'views-container' });
      } else {
        panelC = panels.getPanel('views-container');
      }

      panelC?.set('appendContent', this.$cn.get(0)).trigger('change:appendContent');

      this.target = editor.getModel();
      this.listenTo(this.target, 'component:toggled', this.toggleTm);
    }

    this.toggleTm();
  },

  /**
   * Toggle Trait Manager visibility
   * @private
   */
  toggleTm() {
    const sender = this.sender;
    if (sender && sender.get && !sender.get('active')) return;

    if (this.target.getSelectedAll().length === 1) {
      this.$cn2.show();
      this.$header.hide();
    } else {
      this.$cn2.hide();
      this.$header.show();
    }
  },

  stop() {
    this.$cn2 && this.$cn2.hide();
    this.$header && this.$header.hide();
  },
} as CommandObject<{}, { [k: string]: any }>;
```

--------------------------------------------------------------------------------

---[FILE: PasteComponent.ts]---
Location: grapesjs-dev/packages/core/src/commands/view/PasteComponent.ts

```typescript
import { isArray, contains } from 'underscore';
import Component from '../../dom_components/model/Component';
import { CommandObject } from './CommandAbstract';
import Editor from '../../editor';

export default {
  run(ed, s, opts = {}) {
    const em = ed.getModel();
    const clp: Component[] | null = em.get('clipboard');
    const lastSelected = ed.getSelected();

    if (clp?.length && lastSelected) {
      ed.getSelectedAll().forEach((sel) => {
        const selected = sel.delegate?.copy?.(sel) || sel;
        const { collection } = selected;
        let added;
        if (collection) {
          const at = selected.index() + 1;
          const addOpts = { at, action: opts.action || 'paste-component' };

          if (contains(clp, selected) && selected.get('copyable')) {
            added = collection.add(selected.clone(), addOpts);
          } else {
            added = doAdd(ed, clp, selected.parent()!, addOpts);
          }
        } else {
          // Page body is selected
          // Paste at the end of the body
          const pageBody = em.Pages.getSelected()?.getMainComponent();
          const addOpts = { at: pageBody?.components().length || 0, action: opts.action || 'paste-component' };

          added = doAdd(ed, clp, pageBody as Component, addOpts);
        }

        added = isArray(added) ? added : [added];
        added.forEach((add) => ed.trigger('component:paste', add));
      });

      lastSelected.emitUpdate();
    }
  },
} as CommandObject;

function doAdd(ed: Editor, clp: Component[], parent: Component, addOpts: any): Component[] | Component {
  const copyable = clp.filter((cop) => cop.get('copyable'));
  const pasteable = copyable.filter((cop) => ed.Components.canMove(parent, cop).result);
  return parent.components().add(
    pasteable.map((cop) => cop.clone()),
    addOpts,
  );
}
```

--------------------------------------------------------------------------------

---[FILE: Preview.ts]---
Location: grapesjs-dev/packages/core/src/commands/view/Preview.ts

```typescript
import { each } from 'underscore';
import Editor from '../../editor';
import { CommandObject } from './CommandAbstract';

const cmdOutline = 'core:component-outline';

export default {
  getPanels(editor: Editor) {
    if (!this.panels) {
      this.panels = editor.Panels.getPanels();
    }

    return this.panels;
  },

  preventDrag(opts: any) {
    opts.abort = 1;
  },

  tglEffects(on: boolean) {
    const { em } = this;
    const mthEv = on ? 'on' : 'off';
    if (em) {
      const canvas = em.Canvas;
      const body = canvas.getBody();
      const tlb = canvas.getToolbarEl();
      tlb && (tlb.style.display = on ? 'none' : '');
      const elP = body.querySelectorAll(`.${this.ppfx}no-pointer`);
      each(elP, (item) => ((item as HTMLElement).style.pointerEvents = on ? 'all' : ''));
      em[mthEv]('run:tlb-move:before', this.preventDrag);
    }
  },

  run(editor, sender) {
    this.sender = sender;
    this.selected = [...editor.getSelectedAll()];
    editor.select();

    if (!this.shouldRunSwVisibility) {
      this.shouldRunSwVisibility = editor.Commands.isActive(cmdOutline);
    }

    this.shouldRunSwVisibility && editor.stopCommand(cmdOutline);
    editor.getModel().stopDefault();

    const panels = this.getPanels(editor);
    const canvas = editor.Canvas.getElement();
    const editorEl = editor.getEl()!;
    const pfx = editor.Config.stylePrefix;

    if (!this.helper) {
      const helper = document.createElement('span');
      helper.className = `${pfx}off-prv fa fa-eye-slash`;
      editorEl.appendChild(helper);
      helper.onclick = () => this.stopCommand();
      this.helper = helper;
    }

    this.helper.style.display = 'inline-block';

    panels.forEach((panel: any) => panel.set('visible', false));

    const canvasS = canvas.style;
    canvasS.width = '100%';
    canvasS.height = '100%';
    canvasS.top = '0';
    canvasS.left = '0';
    canvasS.padding = '0';
    canvasS.margin = '0';
    editor.refresh();
    this.tglEffects(1);
  },

  stop(editor) {
    const { sender = {}, selected } = this;
    sender.set && sender.set('active', 0);
    const panels = this.getPanels(editor);

    if (this.shouldRunSwVisibility) {
      editor.runCommand(cmdOutline);
      this.shouldRunSwVisibility = false;
    }

    editor.getModel().runDefault();
    panels.forEach((panel: any) => panel.set('visible', true));

    const canvas = editor.Canvas.getElement();
    canvas.setAttribute('style', '');
    selected && editor.select(selected);
    delete this.selected;

    if (this.helper) {
      this.helper.style.display = 'none';
    }

    editor.refresh();
    this.tglEffects();
  },
} as CommandObject<{}, { [k: string]: any }>;
```

--------------------------------------------------------------------------------

---[FILE: Resize.ts]---
Location: grapesjs-dev/packages/core/src/commands/view/Resize.ts

```typescript
import { LiteralUnion, Position } from '../../common';
import Component from '../../dom_components/model/Component';
import { ComponentsEvents } from '../../dom_components/types';
import ComponentView from '../../dom_components/view/ComponentView';
import StyleableModel, { StyleProps } from '../../domain_abstract/model/StyleableModel';
import { getUnitFromValue } from '../../utils/mixins';
import Resizer, { RectDim, ResizerOptions } from '../../utils/Resizer';
import { CommandObject } from './CommandAbstract';

export interface ComponentResizeOptions extends ResizerOptions {
  component: Component;
  componentView?: ComponentView;
  el?: HTMLElement;
  afterStart?: () => void;
  afterEnd?: () => void;
  /**
   * When the element is using an absolute position, the resizer, by default, will try to
   * update position values (eg. 'top'/'left')
   */
  skipPositionUpdate?: boolean;
  /**
   * @deprecated
   */
  options?: ResizerOptions;
}

export interface ComponentResizeModelProperty {
  value: string;
  property: string;
  number: number;
  unit: string;
}

export interface ComponentResizeEventProps {
  component: Component;
  event: PointerEvent;
  el: HTMLElement;
  rect: RectDim;
}

export interface ComponentResizeEventStartProps extends ComponentResizeEventProps {
  model: StyleableModel;
  modelWidth: ComponentResizeModelProperty;
  modelHeight: ComponentResizeModelProperty;
}

export interface ComponentResizeEventMoveProps extends ComponentResizeEventProps {
  delta: Position;
  pointer: Position;
}

export interface ComponentResizeEventEndProps extends ComponentResizeEventProps {
  moved: boolean;
}

export interface ComponentResizeEventUpdateProps extends ComponentResizeEventProps {
  partial: boolean;
  delta: Position;
  pointer: Position;
  style: StyleProps;
  updateStyle: (styles?: StyleProps) => void;
  convertPxToUnit: (props: ConvertPxToUnitProps) => string;
}

export interface ConvertPxToUnitProps {
  el: HTMLElement;
  valuePx: number;
  unit?: LiteralUnion<ConvertUnitsToPx, string>;
  elComputedStyle?: CSSStyleDeclaration;
  /**
   * If true, the conversion will be done as height (requred for % units).
   */
  isHeight?: boolean;
  /**
   * @default 3
   */
  roundDecimals?: number;
  /**
   * DPI (Dots Per Inch) value to use for conversion.
   * @default 96
   */
  dpi?: number;
}

export enum ConvertUnitsToPx {
  pt = 'pt',
  pc = 'pc',
  in = 'in',
  cm = 'cm',
  mm = 'mm',
  vw = 'vw',
  vh = 'vh',
  vmin = 'vmin',
  vmax = 'vmax',
  svw = 'svw',
  lvw = 'lvw',
  dvw = 'dvw',
  svh = 'svh',
  lvh = 'lvh',
  dvh = 'dvh',
  perc = '%',
}

export default {
  run(editor, _, options: ComponentResizeOptions) {
    const { Canvas, Utils, em } = editor;
    const canvasView = Canvas.getCanvasView();
    const pfx = em.config.stylePrefix || '';
    const resizeClass = `${pfx}resizing`;
    const {
      onStart = () => {},
      onMove = () => {},
      onEnd = () => {},
      updateTarget = () => {},
      el: elOpts,
      componentView,
      component,
      skipPositionUpdate,
      ...resizableOpts
    } = options;
    const el = elOpts || componentView?.el || component.getEl()!;
    const resizeEventOpts = { component, el };
    let modelToStyle: StyleableModel;
    let elComputedStyle: CSSStyleDeclaration;

    const toggleBodyClass = (method: string, e: any, opts: any) => {
      const docs = opts.docs;
      docs &&
        docs.forEach((doc: Document) => {
          const body = doc.body;
          const cls = body.className || '';
          body.className = (method == 'add' ? `${cls} ${resizeClass}` : cls.replace(resizeClass, '')).trim();
        });
    };

    const resizeOptions: ResizerOptions = {
      appendTo: Canvas.getResizerEl(),
      prefix: editor.getConfig().stylePrefix,
      posFetcher: canvasView.getElementPos.bind(canvasView),
      mousePosFetcher: Canvas.getMouseRelativePos.bind(Canvas),
      docs: [document],
      updateOnMove: true,
      skipUnitAdjustments: true,
      onStart: (ev, opts) => {
        onStart(ev, opts);
        const { el, config, resizer } = opts;
        const { keyHeight, keyWidth, currentUnit, keepAutoHeight, keepAutoWidth } = config;
        toggleBodyClass('add', ev, opts);
        modelToStyle = em.Styles.getModelToStyle(component);
        elComputedStyle = getComputedStyle(el);
        const modelStyle = modelToStyle.getStyle();
        const rectStart = { ...resizer.startDim! };

        let currentWidth = modelStyle[keyWidth!] as string;
        config.autoWidth = keepAutoWidth && currentWidth === 'auto';
        if (isNaN(parseFloat(currentWidth))) {
          currentWidth = elComputedStyle[keyWidth as any];
        }

        let currentHeight = modelStyle[keyHeight!] as string;
        config.autoHeight = keepAutoHeight && currentHeight === 'auto';
        if (isNaN(parseFloat(currentHeight))) {
          currentHeight = elComputedStyle[keyHeight as any];
        }

        const valueWidth = parseFloat(currentWidth);
        const valueHeight = parseFloat(currentHeight);
        const unitWidth = getUnitFromValue(currentWidth);
        const unitHeight = getUnitFromValue(currentHeight);

        if (currentUnit) {
          config.unitWidth = unitWidth;
          config.unitHeight = unitHeight;
        }

        const eventProps: ComponentResizeEventStartProps = {
          ...resizeEventOpts,
          event: ev,
          rect: rectStart,
          model: modelToStyle,
          modelWidth: {
            value: currentWidth,
            property: keyWidth!,
            number: valueWidth,
            unit: unitWidth,
          },
          modelHeight: {
            value: currentHeight,
            property: keyHeight!,
            number: valueHeight,
            unit: unitHeight,
          },
        };
        editor.trigger(ComponentsEvents.resizeStart, eventProps);
        editor.trigger(ComponentsEvents.resize, { ...eventProps, type: 'start' });
        options.afterStart?.();
      },

      onMove: (event, opts) => {
        onMove(event, opts);
        const { resizer } = opts;
        const eventProps: ComponentResizeEventMoveProps = {
          ...resizeEventOpts,
          event,
          delta: resizer.delta!,
          pointer: resizer.currentPos!,
          rect: resizer.rectDim!,
        };
        editor.trigger(ComponentsEvents.resizeStart, eventProps);
        editor.trigger(ComponentsEvents.resize, { ...eventProps, type: 'move' });
      },

      onEnd: (event, opts) => {
        onEnd(event, opts);
        toggleBodyClass('remove', event, opts);
        const { resizer } = opts;
        const eventProps: ComponentResizeEventEndProps = {
          ...resizeEventOpts,
          event,
          rect: resizer.rectDim!,
          moved: resizer.moved,
        };
        editor.trigger(ComponentsEvents.resizeEnd, eventProps);
        editor.trigger(ComponentsEvents.resize, { ...resizeEventOpts, type: 'end' });
        options.afterEnd?.();
      },

      updateTarget: (_el, rect, options) => {
        updateTarget(_el, rect, options);
        if (!modelToStyle) {
          return;
        }

        const { store, selectedHandler, config, resizer, event } = options;
        const { keyHeight, keyWidth, autoHeight, autoWidth, unitWidth, unitHeight } = config;
        const onlyHeight = ['tc', 'bc'].indexOf(selectedHandler!) >= 0;
        const onlyWidth = ['cl', 'cr'].indexOf(selectedHandler!) >= 0;
        const partial = !store;
        const style: StyleProps = {};

        if (!onlyHeight) {
          const bodyw = Canvas.getBody()?.offsetWidth || 0;
          const width = rect.w < bodyw ? rect.w : bodyw;
          style[keyWidth!] = autoWidth
            ? 'auto'
            : this.convertPxToUnit({
                el,
                elComputedStyle,
                valuePx: width,
                unit: unitWidth,
              });
        }

        if (!onlyWidth) {
          style[keyHeight!] = autoHeight
            ? 'auto'
            : this.convertPxToUnit({
                el,
                elComputedStyle,
                valuePx: rect.h,
                unit: unitHeight,
                isHeight: true,
              });
        }

        if (!skipPositionUpdate && em.getDragMode(component)) {
          style.top = `${rect.t}px`;
          style.left = `${rect.l}px`;
        }

        let styleUpdated = false;

        const updateStyle = (customStyle?: StyleProps) => {
          styleUpdated = true;
          const finalStyle = { ...(customStyle || style), __p: partial };
          modelToStyle.addStyle(finalStyle, { avoidStore: partial });
          em.Styles.__emitCmpStyleUpdate(finalStyle as any, { components: component });
        };

        const eventProps: ComponentResizeEventUpdateProps = {
          ...resizeEventOpts,
          rect,
          partial,
          event,
          style,
          updateStyle,
          convertPxToUnit: (props: Omit<ConvertPxToUnitProps, 'el'>) =>
            this.convertPxToUnit({ el, elComputedStyle, ...props }),
          delta: resizer.delta!,
          pointer: resizer.currentPos!,
        };
        editor.trigger(ComponentsEvents.resizeUpdate, eventProps);
        !styleUpdated && updateStyle();
      },
      ...resizableOpts,
      ...options.options,
    };

    let { canvasResizer } = this;

    // Create the resizer for the canvas if not yet created
    if (!canvasResizer) {
      this.canvasResizer = new Utils.Resizer(resizeOptions);
      canvasResizer = this.canvasResizer;
    }

    canvasResizer.setOptions(resizeOptions, true);
    canvasResizer.blur();
    canvasResizer.focus(el);
    return canvasResizer;
  },

  stop() {
    this.canvasResizer?.blur();
  },

  convertPxToUnit(props: ConvertPxToUnitProps): string {
    const { el, valuePx, unit, dpi = 96, roundDecimals = 3, isHeight, elComputedStyle } = props;
    const win = el.ownerDocument.defaultView;
    const winWidth = win?.innerWidth || 1;
    const winHeight = window.innerHeight || 1;
    let valueResult = valuePx;
    let untiResult = unit;

    switch (unit) {
      case ConvertUnitsToPx.pt:
        valueResult = valuePx * (72 / dpi);
        break;
      case ConvertUnitsToPx.pc:
        valueResult = valuePx * (6 / dpi);
        break;
      case ConvertUnitsToPx.in:
        valueResult = valuePx / dpi;
        break;
      case ConvertUnitsToPx.cm:
        valueResult = valuePx / (dpi / 2.54);
        break;
      case ConvertUnitsToPx.mm:
        valueResult = valuePx / (dpi / 25.4);
        break;
      case ConvertUnitsToPx.vw:
        valueResult = (valuePx / winWidth) * 100;
        break;
      case ConvertUnitsToPx.vh:
        valueResult = (valuePx / winHeight) * 100;
        break;
      case ConvertUnitsToPx.vmin: {
        const vmin = Math.min(winWidth, winHeight);
        valueResult = (valuePx / vmin) * 100;
        break;
      }
      case ConvertUnitsToPx.vmax: {
        const vmax = Math.max(winWidth, winHeight);
        valueResult = (valuePx / vmax) * 100;
        break;
      }
      case ConvertUnitsToPx.perc: {
        const { parentElement, offsetParent } = el;
        const parentEl = elComputedStyle?.position === 'absolute' ? (offsetParent as HTMLElement) : parentElement;
        const parentWidth = parentEl?.offsetWidth || 1;
        const parentHeight = parentEl?.offsetHeight || 1;
        const parentSize = isHeight ? parentHeight : parentWidth;
        valueResult = (valuePx / parentSize) * 100;
        break;
      }
      case ConvertUnitsToPx.svw:
      case ConvertUnitsToPx.lvw:
      case ConvertUnitsToPx.dvw:
        valueResult = (valuePx / winWidth) * 100;
        break;
      case ConvertUnitsToPx.svh:
      case ConvertUnitsToPx.lvh:
      case ConvertUnitsToPx.dvh:
        valueResult = (valuePx / winHeight) * 100;
        break;
      default:
        untiResult = 'px';
    }

    return `${+valueResult.toFixed(roundDecimals)}${untiResult}`;
  },
} as CommandObject<
  ComponentResizeOptions,
  {
    canvasResizer?: Resizer;
    convertPxToUnit: (props: ConvertPxToUnitProps) => string;
  }
>;
```

--------------------------------------------------------------------------------

````
