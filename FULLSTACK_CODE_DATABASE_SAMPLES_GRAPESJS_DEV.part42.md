---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 42
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 42 of 97)

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

---[FILE: ComponentComment.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/model/ComponentComment.ts

```typescript
import ComponentTextNode from './ComponentTextNode';

export default class ComponentComment extends ComponentTextNode {
  get defaults() {
    // @ts-ignore
    return { ...super.defaults };
  }

  toHTML() {
    return `<!--${this.content}-->`;
  }

  static isComponent(el: HTMLElement) {
    if (el.nodeType == 8) {
      return {
        type: 'comment',
        content: el.textContent ?? '',
      };
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ComponentFrame.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/model/ComponentFrame.ts

```typescript
import Component from './Component';
import { toLowerCase } from '../../utils/mixins';

const type = 'iframe';

export default class ComponentFrame extends Component {
  get defaults() {
    return {
      // @ts-ignore
      ...super.defaults,
      type,
      tagName: type,
      droppable: false,
      resizable: true,
      traits: ['id', 'title', 'src'],
      attributes: { frameborder: '0' },
    };
  }

  static isComponent(el: HTMLElement) {
    return toLowerCase(el.tagName) === type;
  }
}

// ComponentFrame.isComponent = el => toLowerCase(el.tagName) === type;
```

--------------------------------------------------------------------------------

---[FILE: ComponentHead.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/model/ComponentHead.ts

```typescript
import Component from './Component';
import { toLowerCase } from '../../utils/mixins';
import { DraggableDroppableFn } from './types';

export const type = 'head';
const droppable = ['title', 'style', 'base', 'link', 'meta', 'script', 'noscript'];

export default class ComponentHead extends Component {
  get defaults() {
    return {
      // @ts-ignore
      ...super.defaults,
      type,
      tagName: type,
      draggable: false,
      highlightable: false,
      droppable: (({ tagName }) => !tagName || droppable.includes(toLowerCase(tagName))) as DraggableDroppableFn,
    };
  }

  static isComponent(el: HTMLElement) {
    return toLowerCase(el.tagName) === type;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ComponentImage.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/model/ComponentImage.ts

```typescript
import { result } from 'underscore';
import Component from './Component';
import { toLowerCase, buildBase64UrlFromSvg, hasWin } from '../../utils/mixins';
import { ObjectStrings } from '../../common';
import { ComponentOptions, ComponentProperties } from './types';

const svgAttrs =
  'xmlns="http://www.w3.org/2000/svg" width="100" viewBox="0 0 24 24" style="fill: rgba(0,0,0,0.15); transform: scale(0.75)"';

export default class ComponentImage extends Component {
  get defaults() {
    return {
      // @ts-ignore
      ...super.defaults,
      type: 'image',
      tagName: 'img',
      void: true,
      droppable: 0,
      editable: 1,
      highlightable: 0,
      resizable: { ratioDefault: 1 },
      traits: ['alt'],

      src: `<svg ${svgAttrs}>
        <path d="M8.5 13.5l2.5 3 3.5-4.5 4.5 6H5m16 1V5a2 2 0 0 0-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2z"></path>
      </svg>`,

      // Fallback image in case the src can't be loaded
      // If you use SVG, xmlns="http://www.w3.org/2000/svg" is required
      fallback: `<svg ${svgAttrs}>
        <path d="M2.28 3L1 4.27l2 2V19c0 1.1.9 2 2 2h12.73l2 2L21 21.72 2.28 3m2.55 0L21 19.17V5a2 2 0 0 0-2-2H4.83M8.5 13.5l2.5 3 1-1.25L14.73 18H5l3.5-4.5z"></path>
      </svg>`,

      // File to load asynchronously once the model is rendered
      file: '',
    };
  }

  constructor(props: ComponentProperties = {}, opt: ComponentOptions) {
    super(props, opt);
    const { src } = this.get('attributes')!;
    if (src && buildBase64UrlFromSvg(result(this, 'defaults').src) !== src) {
      this.set('src', src, { silent: true });
    }
  }

  initToolbar() {
    super.initToolbar();
    const { em } = this;

    if (em) {
      const cmd = em.Commands;
      const cmdName = 'image-editor';

      // Add Image Editor button only if the default command exists
      if (cmd.has(cmdName)) {
        let hasButtonBool = false;
        const tb = this.get('toolbar')!;

        for (let i = 0; i < tb.length; i++) {
          if (tb[i].command === 'image-editor') {
            hasButtonBool = true;
            break;
          }
        }

        if (!hasButtonBool) {
          tb.push({
            attributes: { class: 'fa fa-pencil' },
            command: cmdName,
          });
          this.set('toolbar', tb);
        }
      }
    }
  }

  /**
   * Returns object of attributes for HTML
   * @return {Object}
   * @private
   */
  getAttrToHTML() {
    const attr = super.getAttrToHTML();
    const src = this.getSrcResult();
    if (src) attr.src = src;
    return attr;
  }

  getSrcResult(opt: { fallback?: boolean } = {}) {
    const src = this.get(opt.fallback ? 'fallback' : 'src') || '';
    let result = src;

    if (src && src.substr(0, 4) === '<svg') {
      result = buildBase64UrlFromSvg(src);
    }

    return result;
  }

  isDefaultSrc() {
    const src = this.get('src');
    const srcDef = result(this, 'defaults').src;
    return src === srcDef || src === buildBase64UrlFromSvg(srcDef);
  }

  /**
   * Return a shallow copy of the model's attributes for JSON
   * stringification.
   * @return {Object}
   * @private
   */
  toJSON(opts: Parameters<Component['toJSON']>[0]) {
    const obj = super.toJSON(opts);
    const { attributes } = obj;

    if (attributes && obj.src === attributes.src) {
      delete obj.src;
    }

    return obj;
  }

  /**
   * Parse uri
   * @param  {string} uri
   * @return {object}
   * @private
   */
  parseUri(uri: string) {
    let result: HTMLAnchorElement | URL | ObjectStrings = {};

    const getQueryObject = (search = '') => {
      const query: ObjectStrings = {};
      const qrs = search.substring(1).split('&');

      for (let i = 0; i < qrs.length; i++) {
        const pair = qrs[i].split('=');
        const name = decodeURIComponent(pair[0]);
        if (name) query[name] = decodeURIComponent(pair[1] || '');
      }

      return query;
    };

    if (hasWin()) {
      result = document.createElement('a');
      result.href = uri;
    } else if (typeof URL !== 'undefined') {
      try {
        result = new URL(uri);
      } catch (e) {}
    }

    return {
      hostname: result.hostname || '',
      pathname: result.pathname || '',
      protocol: result.protocol || '',
      search: result.search || '',
      hash: result.hash || '',
      port: result.port || '',
      query: getQueryObject(result.search),
    };
  }

  static isComponent(el: HTMLElement) {
    return toLowerCase(el.tagName) === 'img';
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ComponentLabel.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/model/ComponentLabel.ts

```typescript
import ComponentText from './ComponentText';
import { toLowerCase } from '../../utils/mixins';

const type = 'label';

export default class ComponentLabel extends ComponentText {
  get defaults() {
    return {
      // @ts-ignore
      ...super.defaults,
      type,
      tagName: type,
      traits: ['id', 'title', 'for'],
    };
  }

  static isComponent(el: HTMLElement) {
    return toLowerCase(el.tagName) === type;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ComponentLink.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/model/ComponentLink.ts

```typescript
import { forEach } from 'underscore';
import { toLowerCase } from '../../utils/mixins';
import ComponentText from './ComponentText';

const type = 'link';

export default class ComponentLink extends ComponentText {
  get defaults() {
    return {
      // @ts-ignore
      ...super.defaults,
      type,
      tagName: 'a',
      traits: ['title', 'href', 'target'],
    };
  }

  static isComponent(el: HTMLElement, opts: any = {}) {
    let result: any;

    if (toLowerCase(el.tagName) === 'a') {
      const textTags = opts.textTags || [];
      result = { type, editable: false };

      // The link is editable only if, at least, one of its
      // children is a text node (not empty one)
      const children = el.childNodes;
      const len = children.length;
      if (!len) delete result.editable;

      forEach(children, (child) => {
        const { tagName } = child as HTMLElement;
        if (
          (child.nodeType == 3 && (child as any).textContent.trim() !== '') ||
          (tagName && textTags.indexOf(toLowerCase(tagName)) >= 0)
        ) {
          delete result.editable;
        }
      });
    }

    return result;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ComponentMap.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/model/ComponentMap.ts

```typescript
import ComponentImage from './ComponentImage';
import { toLowerCase } from '../../utils/mixins';
import { ComponentOptions, ComponentProperties } from './types';

export default class ComponentMap extends ComponentImage {
  /** @ts-ignore */
  get defaults() {
    // @ts-ignore
    const defs = super.defaults;

    return {
      ...defs,
      type: 'map',
      src: '',
      void: false,
      mapUrl: 'https://maps.google.com/maps',
      tagName: 'iframe',
      mapType: 'q',
      address: '',
      zoom: '1',
      attributes: { frameborder: 0 },
      // @ts-ignore
      toolbar: defs.toolbar,
      traits: [
        {
          label: 'Address',
          name: 'address',
          placeholder: 'eg. London, UK',
          changeProp: true,
        },
        {
          type: 'select',
          label: 'Map type',
          name: 'mapType',
          changeProp: true,
          options: [
            { id: 'q', label: 'Roadmap' },
            { id: 'w', label: 'Satellite' },
          ],
        },
        {
          label: 'Zoom',
          name: 'zoom',
          type: 'range',
          min: 1,
          max: 20,
          changeProp: true,
        },
      ],
    };
  }

  constructor(props: ComponentProperties = {}, opt: ComponentOptions) {
    super(props, opt);
    if (this.get('src')) this.parseFromSrc();
    else this.updateSrc();

    this.listenTo(this, 'change:address change:zoom change:mapType', this.updateSrc);
  }

  updateSrc() {
    this.set('src', this.getMapUrl());
  }

  /**
   * Returns url of the map
   * @return {string}
   * @private
   */
  getMapUrl() {
    let addr = this.get('address');
    let zoom = this.get('zoom');
    let type = this.get('mapType');
    addr = addr ? '&q=' + addr : '';
    zoom = zoom ? '&z=' + zoom : '';
    type = type ? '&t=' + type : '';
    let result = this.get('mapUrl') + '?' + addr + zoom + type;
    result += '&output=embed';
    return result;
  }

  /**
   * Set attributes by src string
   * @private
   */
  parseFromSrc() {
    const uri = this.parseUri(this.get('src'));
    const qr = uri.query;
    if (qr.q) this.set('address', qr.q);
    if (qr.z) this.set('zoom', qr.z);
    if (qr.t) this.set('mapType', qr.t);
  }

  static isComponent(el: HTMLIFrameElement) {
    if (toLowerCase(el.tagName) == 'iframe' && /maps\.google\.com/.test(el.src)) {
      return { type: 'map', src: el.src };
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: Components.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/model/Components.ts

```typescript
import { isEmpty, isArray, isString, isFunction, each, includes, extend, flatten, keys } from 'underscore';
import Component, { SetAttrOptions } from './Component';
import { AddOptions, Collection } from '../../common';
import { DomComponentsConfig } from '../config/config';
import EditorModel from '../../editor/model/Editor';
import ComponentManager from '..';
import CssRule from '../../css_composer/model/CssRule';

import {
  ComponentAdd,
  ComponentAddType,
  ComponentDefinition,
  ComponentDefinitionDefined,
  ComponentProperties,
} from './types';
import ComponentText from './ComponentText';
import ComponentWrapper from './ComponentWrapper';
import { ComponentsEvents, ParseStringOptions } from '../types';
import { isSymbolInstance, isSymbolRoot, updateSymbolComps } from './SymbolUtils';

export interface ResetCommonUpdateProps {
  component: Component;
  item: ComponentDefinitionDefined;
  options: SetAttrOptions;
}

export interface ResetFromStringOptions {
  visitedCmps?: Record<string, ComponentDefinitionDefined[]>;
  keepIds?: string[];
  updateOptions?: {
    onAttributes?: (props: ResetCommonUpdateProps & { attributes: Record<string, any> }) => void;
    onStyle?: (props: ResetCommonUpdateProps & { style: Record<string, any> }) => void;
  };
}

export const getComponentIds = (cmp?: Component | Component[] | Components, res: string[] = []) => {
  if (!cmp) return [];
  const cmps = (isArray(cmp) || isFunction((cmp as Components).map) ? cmp : [cmp]) as Component[];
  cmps.map((cmp) => {
    res.push(cmp.getId());
    getComponentIds(cmp.components().models, res);
  });
  return res;
};

const getComponentsFromDefs = (
  items: ReturnType<Components['parseString']>,
  all: ReturnType<ComponentManager['allById']> = {},
  opts: any = {},
) => {
  opts.visitedCmps = opts.visitedCmps || {};
  const { visitedCmps } = opts;
  const updateOptions = (opts.updateOptions as ResetFromStringOptions['updateOptions']) || {};
  const itms = isArray(items) ? items : [items];

  return itms.map((item) => {
    const { attributes = {}, components, tagName, style } = item;
    let { id, draggable, ...restAttr } = attributes;
    let result = item;

    if (id) {
      // Detect components with the same ID
      if (!visitedCmps[id]) {
        visitedCmps[id] = [];

        // Update the component if exists already
        if (all[id]) {
          result = all[id] as any;
          const { onAttributes, onStyle } = updateOptions;
          const component = result as unknown as Component;
          tagName && component.set({ tagName }, { ...opts, silent: true });

          if (onAttributes) {
            onAttributes({ item, component, attributes: restAttr, options: opts });
          } else if (keys(restAttr).length) {
            component.addAttributes(restAttr, { ...opts });
          }

          if (onStyle) {
            onStyle({ item, component, style, options: opts });
          } else if (keys(style).length) {
            component.addStyle(style, opts);
          }
        }
      } else {
        // Found another component with the same ID, treat it as a new component
        visitedCmps[id].push(result);
        id = Component.getNewId(all);
        result.attributes.id = id;
      }
    }

    // Here `result` might be a Component
    const cmp = isFunction(result.components) ? (result as unknown as Component) : null;

    if (components) {
      const newComponents = getComponentsFromDefs(components, all, opts);

      if (cmp) {
        cmp.components().reset(newComponents, opts);
      } else {
        result.components = newComponents;
      }
    } else if (cmp) {
      // The component already exists but the parsed one is without components
      cmp.components().reset([], opts);
    }

    return result;
  });
};

export interface ComponentsOptions {
  em: EditorModel;
  config?: DomComponentsConfig;
  domc?: ComponentManager;
}

interface AddComponentOptions extends AddOptions {
  previousModels?: Component[];
  keepIds?: string[];
}

export default class Components extends Collection</**
 * Keep this format to avoid errors in TS bundler */
/** @ts-ignore */
Component> {
  opt!: ComponentsOptions;
  config?: DomComponentsConfig;
  em: EditorModel;
  domc?: ComponentManager;
  parent?: Component;

  constructor(models: any, opt: ComponentsOptions) {
    super(models, opt);
    this.opt = opt;
    this.listenTo(this, 'add', this.onAdd);
    this.listenTo(this, 'remove', this.removeChildren);
    this.listenTo(this, 'reset', this.resetChildren);
    const { em, config } = opt;
    this.config = config;
    this.em = em;
    this.domc = opt.domc || em?.Components;
  }

  get events() {
    return this.domc?.events!;
  }

  resetChildren(models: Components, opts: { previousModels?: Component[]; keepIds?: string[] } = {}) {
    const coll = this;
    const prev = opts.previousModels || [];
    const toRemove = prev.filter((prev) => !models.get(prev.cid));
    const newIds = getComponentIds(models);
    const idsToKeep = getComponentIds(prev).filter((pr) => newIds.indexOf(pr) >= 0);
    opts.keepIds = (opts.keepIds || []).concat(idsToKeep);
    toRemove.forEach((md) => this.removeChildren(md, coll, opts));
    models.each((model) => this.onAdd(model));
  }

  resetFromString(input = '', opts: ResetFromStringOptions = {}) {
    opts.keepIds = getComponentIds(this);
    const { domc, em, parent } = this;
    const allByID = domc?.allById() || {};
    const parsed = this.parseString(input, { ...opts, cloneRules: true });
    const fromDefOpts = { skipViewUpdate: true, ...opts };
    const newCmps = getComponentsFromDefs(parsed, allByID, fromDefOpts);
    Components.cloneCssRules(em, fromDefOpts.visitedCmps);

    this.reset(newCmps, opts as any);
    em?.trigger('component:content', parent, opts, input);
    (parent as ComponentText).__checkInnerChilds?.();
  }

  removeChildren(removed: Component, coll?: Components, opts: any = {}) {
    // Removing a parent component can cause this function
    // to be called with an already removed child element
    if (!removed) {
      return;
    }

    const { domc, em } = this;
    const isTemp = opts.temporary || opts.fromUndo;
    removed.prevColl = this; // This one is required for symbols

    if (!isTemp) {
      // Remove the component from the global list
      const id = removed.getId();
      const sels = em.Selectors.getAll();
      const rules = em.Css.getAll();
      const canRemoveStyle = (opts.keepIds || []).indexOf(id) < 0;
      const allByID = domc ? domc.allById() : {};
      delete allByID[id];

      // Remove all component related styles
      const rulesRemoved = (
        canRemoveStyle
          ? rules.remove(
              rules.filter((r) => r.getSelectors().getFullString() === `#${id}`),
              opts,
            )
          : []
      ) as CssRule[];

      // Clean selectors
      sels.remove(rulesRemoved.map((rule) => rule.getSelectors().at(0)));

      if (!removed.opt.temporary) {
        em.Commands.run('core:component-style-clear', { target: removed });
        removed.views.forEach((view) => {
          view.scriptContainer &&
            removed.emitWithEditor(ComponentsEvents.scriptUnmount, { component: removed, view, el: view.el });
        });
        removed.removed();
        removed.trigger('removed');
        em.trigger(ComponentsEvents.remove, removed);

        if (domc && isSymbolInstance(removed) && isSymbolRoot(removed)) {
          domc.symbols.__trgEvent(domc.events.symbolInstanceRemove, { component: removed }, true);
        }
      }

      const inner = removed.components();
      inner.forEach((it) => {
        updateSymbolComps(it, it, inner, { ...opts, skipRefsUp: true });
        this.removeChildren(it, coll, opts);
      });
    }

    // Remove stuff registered in DomComponents.handleChanges
    const inner = removed.components();
    em.stopListening(inner);
    em.stopListening(removed);
    em.stopListening(removed.get('classes'));
    removed.__postRemove();

    if (!removed.opt.temporary) {
      const triggerRemoved = (cmp: Component) => {
        cmp.emitWithEditor(ComponentsEvents.removed, cmp, { removeOptions: opts });
        cmp.components().forEach((cmp) => triggerRemoved(cmp));
      };
      triggerRemoved(removed);
    }
  }

  /** @ts-ignore */
  model(attrs: Partial<ComponentProperties>, options: any) {
    const { opt } = options.collection;
    const em = opt.em as EditorModel;
    let model;
    const df = em.Components.componentTypes;
    options.em = em;
    options.config = opt.config;
    options.componentTypes = df;
    options.domc = opt.domc;

    for (let it = 0; it < df.length; it++) {
      const dfId = df[it].id;
      if (dfId == attrs.type) {
        model = df[it].model;
        break;
      }
    }

    // If no model found, get the default one
    if (!model) {
      model = df[df.length - 1].model;
      em &&
        attrs.type &&
        em.logWarning(`Component type '${attrs.type}' not found`, {
          attrs,
          options,
        });
    }

    return new model(attrs, options) as Component;
  }

  parseString(value: string, opt: ParseStringOptions = {}) {
    const { em, domc, parent } = this;
    const isWrapper = parent?.is('wrapper');
    const asDocument = opt.asDocument && isWrapper;
    const cssc = em.Css;
    const parsed = em.Parser.parseHtml(value, { asDocument, ...opt.parserOptions });
    let components = parsed.html;

    if (isWrapper && parsed.doctype) {
      const root = parent as ComponentWrapper;
      const { components: bodyCmps = [], ...restBody } = (parsed.html as ComponentDefinitionDefined) || {};
      const { components: headCmps, ...restHead } = parsed.head || {};
      components = bodyCmps!;
      root.set(restBody as any, opt);
      root.head.set(restHead as any, opt);
      root.head.components(headCmps, opt);
      root.docEl.set(parsed.root as any, opt);
      root.set({ doctype: parsed.doctype });
    }

    // We need this to avoid duplicate IDs
    const result = Component.checkId(components, parsed.css, domc!.componentsById, opt);
    opt.cloneRules && Components.cloneCssRules(em, result.updatedIds);

    if (parsed.css && cssc && !opt.temporary) {
      const { at, ...optsToPass } = opt;
      cssc.addCollection(parsed.css, {
        ...optsToPass,
        extend: 1,
      });
    }

    return components;
  }

  add(model: Exclude<ComponentAddType, string>, opt?: AddComponentOptions): Component;
  add(models: ComponentAddType[], opt?: AddComponentOptions): Component[];
  add(models: ComponentAdd, opt?: AddComponentOptions): Component | Component[];
  add(models: unknown, opt: AddComponentOptions = {}): unknown {
    if (models == undefined) return;

    opt.keepIds = [...(opt.keepIds || []), ...getComponentIds(opt.previousModels)];

    if (isString(models)) {
      models = this.parseString(models, opt)!;
    } else if (isArray(models)) {
      // Avoid "Cannot assign to read only property '0' of object '[object Array]'
      models = [...models];
      (models as any).forEach((item: string, index: number) => {
        if (isString(item)) {
          const nodes = this.parseString(item, opt);
          (models as any)[index] = isArray(nodes) && !nodes.length ? null : nodes;
        }
      });
    }

    const processedModels = (isArray(models) ? models : [models])
      .filter(Boolean)
      .map((model: any) => this.processDef(model));

    models = isArray(models) ? flatten(processedModels as any, 1) : processedModels[0];

    return super.add(models as any, opt);
  }

  /**
   * Process component definition.
   */
  processDef(mdl: Component | ComponentDefinition | ComponentDefinitionDefined) {
    // Avoid processing Models
    if (mdl.cid && mdl.ccid) return mdl;
    const { em, config = {} } = this;
    const { processor } = config;
    let model = mdl;

    if (processor) {
      model = { ...model }; // Avoid 'Cannot delete property ...'
      const modelPr = processor(model);
      if (modelPr) {
        //@ts-ignore
        each(model, (val, key) => delete model[key]);
        extend(model, modelPr);
      }
    }

    // React JSX preset
    //@ts-ignore
    if (model.$$typeof && typeof model.props == 'object') {
      model = { ...model };
      model.props = { ...model.props };
      const domc = em.Components;
      const parser = em.Parser;
      const { parserHtml } = parser;

      each(model, (value, key) => {
        //@ts-ignore
        if (!includes(['props', 'type'], key)) delete model[key];
      });
      const { props } = model;
      const comps = props.children;
      delete props.children;
      delete model.props;
      const res = parserHtml.splitPropsFromAttr(props);
      model.attributes = res.attrs;

      if (comps) {
        model.components = comps;
      }
      if (!model.type) {
        model.type = 'textnode';
      } else if (!domc.getType(model.type)) {
        model.tagName = model.type;
        delete model.type;
      }

      extend(model, res.props);
    }

    return model;
  }

  onAdd(model: Component, c?: any, opts: { temporary?: boolean } = {}) {
    const { domc, em } = this;
    const avoidInline = em.config.avoidInlineStyle;
    domc && domc.Component.ensureInList(model);

    if (!avoidInline && em.config.forceClass && !opts.temporary) {
      const style = model.getStyle();

      if (!isEmpty(style)) {
        const name = model.cid;
        em.Css.setClassRule(name, style);
        model.setStyle({});
        model.addClass(name);
      }
    }

    model.__postAdd({ recursive: true });

    if (em && !opts.temporary) {
      const triggerAdd = (model: Component) => {
        em.trigger(ComponentsEvents.add, model, opts);
        model.components().forEach((comp) => triggerAdd(comp));
      };
      triggerAdd(model);

      if (domc && isSymbolInstance(model) && isSymbolRoot(model)) {
        domc.symbols.__trgEvent(domc.events.symbolInstanceAdd, { component: model }, true);
      }
    }
  }

  static cloneCssRules(em: EditorModel, cmpsMap: Record<string, ComponentDefinitionDefined[]> = {}) {
    const { Css } = em;
    Object.keys(cmpsMap).forEach((id) => {
      const cmps = cmpsMap[id];
      if (cmps.length) {
        // Get all available rules of the component
        const rulesToClone = (Css.getRules(`#${id}`) || []).filter((rule) => !isEmpty(rule.attributes.style));

        if (rulesToClone.length) {
          const rules = Css.getAll();
          cmps.forEach((cmp) => {
            rulesToClone.forEach((rule) => {
              const newRule = rule.clone();
              newRule.set('selectors', [`#${cmp.attributes.id}`] as any);
              rules.add(newRule);
            });
          });
        }
      }
    });
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ComponentScript.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/model/ComponentScript.ts

```typescript
import Component from './Component';
import { toLowerCase } from '../../utils/mixins';

const type = 'script';

export default class ComponentScript extends Component {
  get defaults() {
    return {
      // @ts-ignore
      ...super.defaults,
      type,
      tagName: type,
      droppable: false,
      draggable: false,
      layerable: false,
      highlightable: false,
    };
  }

  static isComponent(el: HTMLScriptElement) {
    return toLowerCase(el.tagName) === type;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ComponentSvg.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/model/ComponentSvg.ts

```typescript
import Component from './Component';
import { toLowerCase } from '../../utils/mixins';

const type = 'svg';

export default class ComponentSvg extends Component {
  get defaults() {
    return {
      // @ts-ignore
      ...super.defaults,
      type,
      tagName: type,
      highlightable: false,
      resizable: { ratioDefault: true },
    };
  }

  getName() {
    let name = this.get('tagName')!;
    const customName = this.get('custom-name');
    name = name.charAt(0).toUpperCase() + name.slice(1);
    return customName || name;
  }

  static isComponent(el: HTMLElement) {
    return toLowerCase(el.tagName) === type;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ComponentSvgIn.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/model/ComponentSvgIn.ts

```typescript
import ComponentSvg from './ComponentSvg';

/**
 * Component for inner SVG elements
 */
export default class ComponentSvgIn extends ComponentSvg {
  get defaults() {
    return {
      // @ts-ignore
      ...super.defaults,
      selectable: false,
      hoverable: false,
      layerable: false,
    };
  }

  static isComponent(el: any, opts: any = {}) {
    return !!opts.inSvg;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ComponentTable.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/model/ComponentTable.ts

```typescript
import Component from './Component';
import { toLowerCase } from '../../utils/mixins';
import { ComponentOptions, ComponentProperties } from './types';

const type = 'table';

export default class ComponentTable extends Component {
  get defaults() {
    return {
      // @ts-ignore
      ...super.defaults,
      type,
      tagName: type,
      droppable: ['tbody', 'thead', 'tfoot'],
    };
  }

  constructor(props: ComponentProperties = {}, opt: ComponentOptions) {
    super(props, opt);
    const components = this.get('components')!;
    !components.length && components.add({ type: 'tbody' });
  }

  static isComponent(el: HTMLElement) {
    return toLowerCase(el.tagName) === type;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ComponentTableBody.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/model/ComponentTableBody.ts

```typescript
import Component from './Component';
import { toLowerCase } from '../../utils/mixins';
import { ComponentOptions, ComponentProperties } from './types';

const type = 'tbody';

export default class ComponentTableBody extends Component {
  get defaults() {
    return {
      // @ts-ignore
      ...super.defaults,
      type,
      tagName: type,
      draggable: ['table'],
      droppable: ['tr'],
      columns: 1,
      rows: 1,
    };
  }

  constructor(props: ComponentProperties = {}, opt: ComponentOptions) {
    super(props, opt);
    const components = this.get('components')!;
    let columns = this.get('columns');
    let rows = this.get('rows');

    // Init components if empty
    if (!components.length) {
      const rowsToAdd = [];

      while (rows--) {
        const columnsToAdd = [];
        let clm = columns;

        while (clm--) {
          columnsToAdd.push({
            type: 'cell',
            classes: ['cell'],
          });
        }

        rowsToAdd.push({
          type: 'row',
          classes: ['row'],
          components: columnsToAdd,
        });
      }

      components.add(rowsToAdd);
    }
  }

  static isComponent(el: HTMLElement) {
    return toLowerCase(el.tagName) === type;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ComponentTableCell.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/model/ComponentTableCell.ts

```typescript
import Component from './Component';
import { toLowerCase } from '../../utils/mixins';

export default class ComponentTableCell extends Component {
  get defaults() {
    return {
      // @ts-ignore
      ...super.defaults,
      type: 'cell',
      tagName: 'td',
      draggable: ['tr'],
    };
  }

  static isComponent(el: HTMLElement) {
    return ['td', 'th'].indexOf(toLowerCase(el.tagName)) >= 0;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ComponentTableFoot.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/model/ComponentTableFoot.ts

```typescript
import ComponentTableBody from './ComponentTableBody';
import { toLowerCase } from '../../utils/mixins';

const type = 'tfoot';

export default class ComponentTableFoot extends ComponentTableBody {
  get defaults() {
    return {
      // @ts-ignore
      ...super.defaults,
      type,
      tagName: type,
    };
  }

  static isComponent(el: HTMLElement) {
    return toLowerCase(el.tagName) === type;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ComponentTableHead.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/model/ComponentTableHead.ts

```typescript
import ComponentTableBody from './ComponentTableBody';
import { toLowerCase } from '../../utils/mixins';

const type = 'thead';

export default class ComponentTableHead extends ComponentTableBody {
  get defaults() {
    return {
      // @ts-ignore
      ...super.defaults,
      type,
      tagName: type,
    };
  }

  static isComponent(el: HTMLElement) {
    return toLowerCase(el.tagName) === type;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ComponentTableRow.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/model/ComponentTableRow.ts

```typescript
import Component from './Component';
import { toLowerCase } from '../../utils/mixins';

const tagName = 'tr';

export default class ComponentTableRow extends Component {
  get defaults() {
    return {
      // @ts-ignore
      ...super.defaults,
      tagName,
      draggable: ['thead', 'tbody', 'tfoot'],
      droppable: ['th', 'td'],
    };
  }

  static isComponent(el: HTMLElement) {
    return toLowerCase(el.tagName) === tagName;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ComponentText.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/model/ComponentText.ts

```typescript
import { isFunction } from 'underscore';
import Component from './Component';
import { ComponentOptions, ComponentProperties } from './types';

export default class ComponentText extends Component {
  get defaults() {
    return {
      // @ts-ignore
      ...super.defaults,
      type: 'text',
      droppable: false,
      editable: true,
    };
  }

  constructor(props: ComponentProperties = {}, opt: ComponentOptions) {
    super(props, opt);
    this.__checkInnerChilds();
  }

  __checkInnerChilds() {
    const { disableTextInnerChilds } = this.em.Components.config;
    if (disableTextInnerChilds) {
      const disableChild = (child: Component) => {
        if (!child.isInstanceOf('textnode')) {
          child.set({
            locked: true,
            layerable: false,
          });
        }
      };

      if (isFunction(disableTextInnerChilds)) {
        this.forEachChild((child) => {
          disableTextInnerChilds(child) && disableChild(child);
        });
      } else {
        this.forEachChild(disableChild);
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ComponentTextNode.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/model/ComponentTextNode.ts

```typescript
import Component from './Component';
import { escapeNodeContent } from '../../utils/mixins';

export default class ComponentTextNode extends Component {
  get defaults() {
    return {
      // @ts-ignore
      ...super.defaults,
      tagName: '',
      droppable: false,
      layerable: false,
      selectable: false,
      editable: true,
    };
  }

  toHTML() {
    const { content } = this;
    const parent = this.parent();
    return parent?.is('script') ? content : this.__escapeContent(content);
  }

  __escapeContent(content: string) {
    return escapeNodeContent(content);
  }

  static isComponent(el: HTMLElement) {
    if (el.nodeType === 3) {
      return {
        type: 'textnode',
        content: el.textContent ?? '',
      };
    }
  }
}
```

--------------------------------------------------------------------------------

````
