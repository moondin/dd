---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 34
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 34 of 97)

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

---[FILE: index.ts]---
Location: grapesjs-dev/packages/core/src/css_composer/index.ts

```typescript
/**
 * This module manages CSS rules in the canvas.
 * You can customize the initial state of the module from the editor initialization, by passing the following [Configuration Object](https://github.com/GrapesJS/grapesjs/blob/master/src/css_composer/config/config.ts)
 * ```js
 * const editor = grapesjs.init({
 *  cssComposer: {
 *    // options
 *  }
 * })
 * ```
 *
 * Once the editor is instantiated you can use its API. Before using these methods you should get the module from the instance
 *
 * ```js
 * const css = editor.Css;
 * ```
 *
 * * [addRules](#addrules)
 * * [setRule](#setrule)
 * * [getRule](#getrule)
 * * [getRules](#getrules)
 * * [remove](#remove)
 * * [clear](#clear)
 *
 * [CssRule]: css_rule.html
 *
 * @module Css
 */

import { isArray, isString, isUndefined } from 'underscore';
import { isObject } from '../utils/mixins';
import Selectors from '../selector_manager/model/Selectors';
import Selector from '../selector_manager/model/Selector';
import defConfig, { CssComposerConfig } from './config/config';
import CssRule, { CssRuleJSON, CssRuleProperties } from './model/CssRule';
import CssRules from './model/CssRules';
import CssRulesView from './view/CssRulesView';
import { ItemManagerModule } from '../abstract/Module';
import EditorModel from '../editor/model/Editor';
import Component from '../dom_components/model/Component';
import { ObjectAny, PrevToNewIdMap } from '../common';
import { UpdateStyleOptions } from '../domain_abstract/model/StyleableModel';
import { CssEvents } from './types';
import CssRuleView from './view/CssRuleView';

/** @private */
interface RuleOptions {
  /**
   * At-rule type, eg. `media`
   */
  atRuleType?: string;
  /**
   * At-rule parameters, eg. `(min-width: 500px)`
   */
  atRuleParams?: string;
}

/** @private */
interface SetRuleOptions extends RuleOptions, UpdateStyleOptions {
  /**
   * If the rule exists already, merge passed styles instead of replacing them.
   */
  addStyles?: boolean;
}

/** @private */
export interface GetSetRuleOptions extends UpdateStyleOptions {
  state?: string;
  mediaText?: string;
  addOpts?: ObjectAny;
  current?: boolean;
}

type CssRuleStyle = Required<CssRuleProperties>['style'];

export default class CssComposer extends ItemManagerModule<CssComposerConfig & { pStylePrefix?: string }> {
  classes = {
    CssRule,
    CssRules,
    CssRuleView,
    CssRulesView,
  };
  rules: CssRules;
  rulesView?: CssRulesView;
  events = CssEvents;

  Selectors = Selectors;

  storageKey = 'styles';
  protected _itemCache = new Map<string, CssRule>();
  /**
   * Initializes module. Automatically called with a new instance of the editor
   * @param {Object} config Configurations
   * @private
   */
  constructor(em: EditorModel) {
    super(em, 'CssComposer', null, CssEvents, defConfig());
    const { config } = this;

    const ppfx = config.pStylePrefix;
    if (ppfx) config.stylePrefix = ppfx + config.stylePrefix;

    // @ts-ignore
    config.rules = this.em.config.style || config.rules || '';

    this.rules = new CssRules([], config);
    this._setupCacheListeners();
  }

  protected override _setupCacheListeners() {
    super._setupCacheListeners();
    this.em.listenTo(this.rules, 'change:selectors change:state change:mediaText', this._onItemKeyChange.bind(this));
  }

  protected _makeCacheKey(rule: CssRule) {
    const atRuleKey = rule.getAtRule();
    const selectorsKey = rule.selectorsToString();
    return `${atRuleKey}__${selectorsKey}`;
  }

  _makeCacheKeyFromProps(ruleProps: CssRuleProperties) {
    const { atRuleType = '', mediaText = '', state = '', selectorsAdd = '', selectors = [] } = ruleProps;

    const selectorsStr = selectors.map((selector) => (isString(selector) ? selector : selector.toString())).join('');

    const selectorsRes = [];
    selectorsStr && selectorsRes.push(`${selectorsStr}${state ? `:${state}` : ''}`);
    selectorsAdd && selectorsRes.push(selectorsAdd);
    const selectorsKey = selectorsRes.join(', ');

    const typeStr = atRuleType ? `@${atRuleType}` : mediaText ? '@media' : '';
    const atRuleKey = typeStr + (mediaText && typeStr ? ` ${mediaText}` : '');

    return `${atRuleKey}__${selectorsKey}`;
  }

  /**
   * On load callback
   * @private
   */
  onLoad() {
    this.rules.add(this.config.rules, { silent: true });
    this._onItemsResetCache(this.rules as any);
  }

  /**
   * Do stuff after load
   * @param  {Editor} em
   * @private
   */
  postLoad() {
    this.em.UndoManager.add(this.getAll());
  }

  store() {
    return this.getProjectData();
  }

  load(data: any) {
    return this.loadProjectData(data, {
      // @ts-ignore Fix add() first in CssRules
      all: this.rules,
    });
  }

  /**
   * Find a rule in the collection by its properties.
   * @private
   */
  _findRule(
    selectors: any,
    state?: string,
    width?: string,
    ruleProps?: Omit<CssRuleProperties, 'selectors'>,
  ): CssRule | null {
    let slc = selectors;
    if (isString(selectors)) {
      const sm = this.em.Selectors;
      const singleSel = selectors.split(',')[0].trim();
      const node = this.em.Parser.parserCss.checkNode({ selectors: singleSel } as any)[0];
      slc = sm.get(node.selectors as string[]);
    }

    const rule = this.rules.find((r) => r.compare(slc, state, width, ruleProps)) || null;
    return rule;
  }

  /**
   * Add new rule to the collection, if not yet exists with the same selectors
   * @param {Array<Selector>} selectors Array of selectors
   * @param {String} state Css rule state
   * @param {String} width For which device this style is oriented
   * @param {Object} props Other props for the rule
   * @param {Object} opts Options for the add of new rule
   * @return {Model}
   * @private
   * @example
   * var sm = editor.SelectorManager;
   * var sel1 = sm.add('myClass1');
   * var sel2 = sm.add('myClass2');
   * var rule = cssComposer.add([sel1, sel2], 'hover');
   * rule.set('style', {
   *   width: '100px',
   *   color: '#fff',
   * });
   * */
  add(selectors: any, state?: string, width?: string, opts = {}, addOpts = {}) {
    const s = state || '';
    const w = width || '';
    const opt = { ...opts } as CssRuleProperties;
    const key = this._makeCacheKeyFromProps({
      state: s,
      mediaText: w,
      ...opt,
      selectors: Array.isArray(selectors) ? selectors : [selectors],
    });

    const cached = this._itemCache.get(key);
    if (cached && cached.config && !cached.config.singleAtRule) {
      return cached;
    }

    let rule = this._findRule(selectors, s, w, opt);

    if (rule && rule.config && !rule.config.singleAtRule) {
      this._cacheItem(rule);
      return rule;
    }

    opt.state = s;
    opt.mediaText = w;
    opt.selectors = [];
    if (w && !opt.atRuleType) opt.atRuleType = 'media';

    rule = new CssRule(opt, this.config);
    // @ts-ignore
    rule.get('selectors').add(selectors, addOpts);
    this.rules.add(rule, addOpts);

    this._cacheItem(rule);

    return rule;
  }

  /**
   * Get the rule
   * @param {String|Array<Selector>} selectors Array of selectors or selector string, eg `.myClass1.myClass2`
   * @param {String} state Css rule state, eg. 'hover'
   * @param {String} width Media rule value, eg. '(max-width: 992px)'
   * @param {Object} ruleProps Other rule props
   * @return  {Model|null}
   * @private
   * @example
   * const sm = editor.SelectorManager;
   * const sel1 = sm.add('myClass1');
   * const sel2 = sm.add('myClass2');
   * const rule = cssComposer.get([sel1, sel2], 'hover', '(max-width: 992px)');
   * // Update the style
   * rule.set('style', {
   *   width: '300px',
   *   color: '#000',
   * });
   * */
  get(selectors: any, state?: string, width?: string, ruleProps?: Omit<CssRuleProperties, 'selectors'>) {
    const key = this._makeCacheKeyFromProps({
      ...ruleProps,
      selectors: Array.isArray(selectors) ? selectors : [selectors],
      state,
      width,
      mediaText: width,
    });
    const cached = this._itemCache.get(key);
    if (cached) return cached;

    const rule = this._findRule(selectors, state, width, ruleProps);

    if (rule) {
      this._cacheItem(rule);
    }

    return rule;
  }

  getAll() {
    return this.rules;
  }

  /**
   * Add a raw collection of rule objects
   * This method overrides styles, in case, of already defined rule
   * @param {String|Array<Object>} data CSS string or an array of rule objects, eg. [{selectors: ['class1'], style: {....}}, ..]
   * @param {Object} opts Options
   * @param {Object} props Additional properties to add on rules
   * @return {Array<Model>}
   * @private
   */
  addCollection(data: string | CssRuleJSON[], opts: Record<string, any> = {}, props = {}) {
    const { em } = this;
    const result: CssRule[] = [];

    if (isString(data)) {
      data = em.Parser.parseCss(data);
    }

    const d = data instanceof Array ? data : [data];

    for (var i = 0, l = d.length; i < l; i++) {
      const rule = (d[i] || {}) as CssRuleJSON;
      if (!rule.selectors) continue;

      const sm = em?.Selectors;
      if (!sm) console.warn('Selector Manager not found');
      const sl = rule.selectors;
      const sels = sl instanceof Array ? sl : [sl];
      const newSels = [];

      for (let j = 0, le = sels.length; j < le; j++) {
        // @ts-ignore
        const selec = sm.add(sels[j]);
        newSels.push(selec);
      }

      const modelExists = this.get(newSels, rule.state, rule.mediaText, rule);
      const model = this.add(newSels, rule.state, rule.mediaText, rule, opts);
      const updateStyle = !modelExists || !opts.avoidUpdateStyle;
      const style = rule.style || {};

      isObject(props) && model.set(props, opts);

      if (updateStyle) {
        const styleUpdate = opts.extend ? { ...model.getStyle('', { skipResolve: true }), ...style } : style;
        model.setStyle(styleUpdate, opts);
      }

      result.push(model);
    }

    return result;
  }

  /**
   * Add CssRules via CSS string.
   * @param {String} css CSS string of rules to add.
   * @returns {Array<[CssRule]>} Array of rules
   * @example
   * const addedRules = css.addRules('.my-cls{ color: red } @media (max-width: 992px) { .my-cls{ color: darkred } }');
   * // Check rules
   * console.log(addedRules.map(rule => rule.toCSS()));
   */
  addRules(css: string) {
    return this.addCollection(css);
  }

  /**
   * Add/update the CssRule.
   * @param {String} selectors Selector string, eg. `.myclass`
   * @param {Object} style  Style properties and values. If the rule exists, styles will be replaced unless `addStyles` option is used.
   * @param {Object} [opts={}]  Additional properties.
   * @param {String} [opts.atRuleType='']  At-rule type, eg. `media`.
   * @param {String} [opts.atRuleParams='']  At-rule parameters, eg. `(min-width: 500px)`.
   * @param {Boolean} [opts.addStyles=false] If the rule exists already, merge passed styles instead of replacing them.
   * @returns {[CssRule]} The new/updated CssRule.
   * @example
   * // Simple class-based rule
   * const rule = css.setRule('.class1.class2', { color: 'red' });
   * console.log(rule.toCSS()) // output: .class1.class2 { color: red }
   * // With state and other mixed selector
   * const rule = css.setRule('.class1.class2:hover, div#myid', { color: 'red' });
   * // output: .class1.class2:hover, div#myid { color: red }
   * // With media
   * const rule = css.setRule('.class1:hover', { color: 'red' }, {
   *  atRuleType: 'media',
   *  atRuleParams: '(min-width: 500px)',
   * });
   * // output: `@media (min-width: 500px) { .class1:hover { color: red } }`
   *
   * // Update styles of existent rule
   * css.setRule('.class1', { color: 'red', background: 'red' });
   * css.setRule('.class1', { color: 'blue' }, { addStyles: true });
   * // output: .class1 { color: blue; background: red }
   */
  setRule(selectors: any, style: CssRuleProperties['style'] = {}, opts: SetRuleOptions = {}) {
    const { atRuleType, atRuleParams } = opts;
    const node = this.em.Parser.parserCss.checkNode({
      selectors,
      style,
    })[0];
    const { state, selectorsAdd } = node;
    const sm = this.em.Selectors;
    const selector = sm.add(node.selectors as any);
    const rule = this.add(selector, state, atRuleParams, {
      selectorsAdd,
      atRule: atRuleType,
    });

    if (opts.addStyles) {
      rule.addStyle(style, opts);
    } else {
      rule.setStyle(style, opts);
    }

    return rule;
  }

  /**
   * Get the CssRule.
   * @param {String} selectors Selector string, eg. `.myclass:hover`
   * @param {Object} [opts={}]  Additional properties
   * @param {String} [opts.atRuleType='']  At-rule type, eg. `media`
   * @param {String} [opts.atRuleParams='']  At-rule parameters, eg. '(min-width: 500px)'
   * @returns {[CssRule]}
   * @example
   * const rule = css.getRule('.myclass1:hover');
   * const rule2 = css.getRule('.myclass1:hover, div#myid');
   * const rule3 = css.getRule('.myclass1', {
   *  atRuleType: 'media',
   *  atRuleParams: '(min-width: 500px)',
   * });
   */
  getRule(selectors: any, opts: RuleOptions = {}) {
    const { em } = this;
    const sm = em.Selectors;
    const node = em.Parser.parserCss.checkNode({ selectors })[0];
    // @ts-ignore
    const selector = sm.get(node.selectors);
    const { state, selectorsAdd } = node;
    const { atRuleType, atRuleParams } = opts;
    return selector
      ? this.get(selector, state, atRuleParams, {
          selectorsAdd,
          atRuleType,
        })
      : undefined;
  }

  /**
   * Get all rules or filtered by a matching selector.
   * @param {String} [selector=''] Selector, eg. `.myclass`
   * @returns {Array<[CssRule]>}
   * @example
   * // Take all the component specific rules
   * const id = someComponent.getId();
   * const rules = css.getRules(`#${id}`);
   * console.log(rules.map(rule => rule.toCSS()))
   * // All rules in the project
   * console.log(css.getRules())
   */
  getRules(selector?: string) {
    const rules = this.getAll();
    if (!selector) return [...rules.models];
    const optRuleSel = { sort: true };
    const sels = isString(selector) ? selector.split(',').map((s) => s.trim()) : selector;
    const result = rules.filter((r) => sels.indexOf(r.getSelectors().getFullString(null, optRuleSel)) >= 0);
    return result;
  }

  /**
   * Add/update the CSS rule with id selector
   * @param {string} name Id selector name, eg. 'my-id'
   * @param {Object} style  Style properties and values
   * @param {Object} [opts={}]  Custom options, like `state` and `mediaText`
   * @return {CssRule} The new/updated rule
   * @private
   * @example
   * const rule = css.setIdRule('myid', { color: 'red' });
   * const ruleHover = css.setIdRule('myid', { color: 'blue' }, { state: 'hover' });
   * // This will add current CSS:
   * // #myid { color: red }
   * // #myid:hover { color: blue }
   */
  setIdRule(name: string, style: CssRuleStyle = {}, opts: GetSetRuleOptions = {}) {
    const { addOpts = {}, mediaText } = opts;
    const state = opts.state || '';
    const media = !isUndefined(mediaText) ? mediaText : this.em.getCurrentMedia();
    const sm = this.em.Selectors;
    const selector = sm.add({ name, type: Selector.TYPE_ID }, addOpts);
    const rule = this.add(selector, state, media, {}, addOpts);
    rule.setStyle(style, { ...opts, ...addOpts });
    return rule;
  }

  /**
   * Get the CSS rule by id selector
   * @param {string} name Id selector name, eg. 'my-id'
   * @param  {Object} [opts={}]  Custom options, like `state` and `mediaText`
   * @return {CssRule}
   * @private
   * @example
   * const rule = css.getIdRule('myid');
   * const ruleHover = css.setIdRule('myid', { state: 'hover' });
   */
  getIdRule(name: string, opts: GetSetRuleOptions = {}) {
    const { mediaText } = opts;
    const state = opts.state || '';
    const media = !isUndefined(mediaText) ? mediaText : this.em.getCurrentMedia();
    const selector = this.em.Selectors.get(name, Selector.TYPE_ID);
    return selector && this.get(selector, state, media);
  }

  /**
   * Add/update the CSS rule with class selector
   * @param {string} name Class selector name, eg. 'my-class'
   * @param {Object} style  Style properties and values
   * @param {Object} [opts={}]  Custom options, like `state` and `mediaText`
   * @return {CssRule} The new/updated rule
   * @private
   * @example
   * const rule = css.setClassRule('myclass', { color: 'red' });
   * const ruleHover = css.setClassRule('myclass', { color: 'blue' }, { state: 'hover' });
   * // This will add current CSS:
   * // .myclass { color: red }
   * // .myclass:hover { color: blue }
   */
  setClassRule(name: string, style: CssRuleStyle = {}, opts: GetSetRuleOptions = {}) {
    const state = opts.state || '';
    const media = opts.mediaText || this.em.getCurrentMedia();
    const sm = this.em.Selectors;
    const selector = sm.add({ name, type: Selector.TYPE_CLASS });
    const rule = this.add(selector, state, media);
    rule.setStyle(style, opts);
    return rule;
  }

  /**
   * Get the CSS rule by class selector
   * @param {string} name Class selector name, eg. 'my-class'
   * @param  {Object} [opts={}]  Custom options, like `state` and `mediaText`
   * @return {CssRule}
   * @private
   * @example
   * const rule = css.getClassRule('myclass');
   * const ruleHover = css.getClassRule('myclass', { state: 'hover' });
   */
  getClassRule(name: string, opts: GetSetRuleOptions = {}) {
    const state = opts.state || '';
    const media = opts.mediaText || this.em.getCurrentMedia();
    const selector = this.em.Selectors.get(name, Selector.TYPE_CLASS);
    return selector && this.get(selector, state, media);
  }

  /**
   * Remove rule, by CssRule or matching selector (eg. the selector will match also at-rules like `@media`)
   * @param {String|[CssRule]|Array<[CssRule]>} rule CssRule or matching selector.
   * @return {Array<[CssRule]>} Removed rules
   * @example
   * // Remove by CssRule
   * const toRemove = css.getRules('.my-cls');
   * css.remove(toRemove);
   * // Remove by selector
   * css.remove('.my-cls-2');
   */
  remove(rule: string | CssRule, opts?: any) {
    const toRemove = isString(rule) ? this.getRules(rule) : rule;
    const arr = Array.isArray(toRemove) ? toRemove : [toRemove];
    const result = this.getAll().remove(arr, opts);
    return Array.isArray(result) ? result : [result];
  }

  /**
   * Remove all rules
   * @return {this}
   */
  clear(opts = {}) {
    this._clearItemCache();
    this.getAll().reset([], opts);
    return this;
  }

  getComponentRules(cmp: Component, opts: GetSetRuleOptions = {}) {
    let { state, mediaText, current } = opts;
    if (current) {
      state = this.em.get('state') || '';
      mediaText = this.em.getCurrentMedia();
    }
    const id = cmp.getId();
    const rules = this.getAll().filter((r) => {
      if (!isUndefined(state) && r.get('state') !== state) return false;
      if (!isUndefined(mediaText) && r.get('mediaText') !== mediaText) return false;
      return r.getSelectorsString() === `#${id}`;
    });
    return rules;
  }

  /**
   * Render the block of CSS rules
   * @return {HTMLElement}
   * @private
   */
  render() {
    this.rulesView?.remove();
    this.rulesView = new CssRulesView({
      collection: this.rules,
      config: this.config,
    });
    return this.rulesView.render().el;
  }

  checkId(rule: CssRuleJSON | CssRuleJSON[], opts: { idMap?: PrevToNewIdMap } = {}) {
    const { idMap = {} } = opts;
    const changed: CssRuleJSON[] = [];

    if (!Object.keys(idMap).length) return changed;

    const rules = Array.isArray(rule) ? rule : [rule];
    rules.forEach((rule) => {
      const sel = rule.selectors;

      if (sel && sel.length == 1) {
        const sSel = sel[0];

        if (isString(sSel)) {
          if (sSel[0] === '#') {
            const prevId = sSel.substring(1);
            const newId = idMap[prevId];
            if (prevId && newId) {
              sel[0] = `#${newId}`;
              changed.push(rule);
            }
          }
        } else if (sSel.name && sSel.type === Selector.TYPE_ID) {
          const newId = idMap[sSel.name];
          if (newId) {
            sSel.name = newId;
            changed.push(rule);
          }
        }
      }
    });

    return changed;
  }

  destroy() {
    this.rules.reset();
    this.rules.stopListening();
    this.rulesView?.remove();
  }
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: grapesjs-dev/packages/core/src/css_composer/types.ts

```typescript
export enum CssEvents {
  /**
   * @event `css:mount` CSS rule is mounted in the canvas.
   * @example
   * editor.on('css:mount', ({ rule }) => { ... });
   */
  mount = 'css:mount',
  mountBefore = 'css:mount:before',
}
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: grapesjs-dev/packages/core/src/css_composer/config/config.ts

```typescript
export interface CssComposerConfig {
  /**
   * Style prefix.
   * @default 'css-'
   */
  stylePrefix?: string;

  /**
   * Default CSS style rules
   */
  rules?: Array<string>; // TODO
}

const config: () => CssComposerConfig = () => ({
  stylePrefix: 'css-',
  rules: [],
});

export default config;
```

--------------------------------------------------------------------------------

---[FILE: CssRule.ts]---
Location: grapesjs-dev/packages/core/src/css_composer/model/CssRule.ts

```typescript
import { isEmpty, forEach, isString, isArray } from 'underscore';
import { ObjectAny, ObjectHash } from '../../common';
import StyleableModel, { StyleProps } from '../../domain_abstract/model/StyleableModel';
import Selectors from '../../selector_manager/model/Selectors';
import { getMediaLength } from '../../code_manager/model/CssGenerator';
import { isEmptyObj, hasWin } from '../../utils/mixins';
import Selector, { SelectorProps } from '../../selector_manager/model/Selector';
import EditorModel from '../../editor/model/Editor';
import CssRuleView from '../view/CssRuleView';

export interface ToCssOptions {
  important?: boolean | string[];
  allowEmpty?: boolean;
  style?: StyleProps;
  inline?: boolean;
}

/** @private */
export interface CssRuleProperties extends ObjectHash {
  /**
   * Array of selectors
   */
  selectors: Selector[];
  /**
   * Object containing style definitions
   * @default {}
   */
  style?: Record<string, any>;
  /**
   * Additional string css selectors
   * @default ''
   */
  selectorsAdd?: string;
  /**
   * Type of at-rule, eg. `media`, 'font-face'
   * @default ''
   */
  atRuleType?: string;
  /**
   * At-rule value, eg. `(max-width: 1000px)`
   * @default ''
   */
  mediaText?: string;
  /**
   * This property is used only on at-rules, like 'page' or 'font-face', where the block containes only style declarations.
   * @default false
   */
  singleAtRule?: boolean;
  /**
   * State of the rule, eg: `hover`, `focused`
   * @default ''
   */
  state?: string;
  /**
   * If true, sets `!important` on all properties. You can also pass an array to specify properties on which to use important.
   * @default false
   */
  important?: boolean | string[];
  /**
   * Indicates if the rule is stylable from the editor.
   * @default true
   */
  stylable?: boolean | string[];
  /**
   * Group for rules.
   * @default ''
   */
  group?: string;
  /**
   * If true, the rule won't be stored in JSON or showed in CSS export.
   * @default false
   */
  shallow?: boolean;
}

export interface CssRuleJSON extends Omit<CssRuleProperties, 'selectors'> {
  selectors: (string | SelectorProps)[];
}

// @ts-ignore
const { CSS } = hasWin() ? window : {};

/**
 * @typedef CssRule
 * @property {Array<Selector>} selectors Array of selectors
 * @property {Object} style Object containing style definitions
 * @property {String} [selectorsAdd=''] Additional string css selectors
 * @property {String} [atRuleType=''] Type of at-rule, eg. `media`, 'font-face'
 * @property {String} [mediaText=''] At-rule value, eg. `(max-width: 1000px)`
 * @property {Boolean} [singleAtRule=false] This property is used only on at-rules, like 'page' or 'font-face', where the block containes only style declarations
 * @property {String} [state=''] State of the rule, eg: `hover`, `focused`
 * @property {Boolean|Array<String>} [important=false] If true, sets `!important` on all properties. You can also pass an array to specify properties on which use important
 * @property {Boolean} [stylable=true] Indicates if the rule is stylable from the editor
 *
 * [Device]: device.html
 * [State]: state.html
 * [Component]: component.html
 */
export default class CssRule extends StyleableModel<CssRuleProperties> {
  config: CssRuleProperties;
  em?: EditorModel;
  opt: any;
  views: CssRuleView[] = [];

  defaults() {
    return {
      selectors: [],
      selectorsAdd: '',
      style: {},
      mediaText: '',
      state: '',
      stylable: true,
      atRuleType: '',
      singleAtRule: false,
      important: false,
      group: '',
      shallow: false,
      _undo: true,
    };
  }

  constructor(props: CssRuleProperties, opt: any = {}) {
    super(props, { em: opt.em });
    this.config = props || {};
    this.opt = opt;
    this.em = opt.em;
    this.ensureSelectors(null, null, {});
    this.setStyle(this.get('style'), { skipWatcherUpdates: true });
    this.on('change', this.__onChange);
  }

  __onChange(rule: CssRule, options: any) {
    const { em } = this;
    const changed = this.changedAttributes();
    changed && !isEmptyObj(changed) && em?.changesUp(options, { rule, changed, options });
  }

  clone(): typeof this {
    const selectors = this.get('selectors')!.map((s) => s.clone() as Selector);

    return super.clone({ selectors });
  }

  ensureSelectors(m: any, c: any, opts: any) {
    const { em } = this;
    const sm = em?.Selectors;
    const toListen = [this, 'change:selectors', this.ensureSelectors];
    let sels = this.getSelectors() as any;
    this.stopListening(...toListen);

    if (sels.models) {
      sels = [...sels.models];
    }

    sels = isString(sels) ? [sels] : sels;

    if (Array.isArray(sels)) {
      const res = sels.filter((i) => i).map((i) => (sm ? sm.add(i) : i));
      sels = new Selectors(res);
    }

    this.set('selectors', sels, opts);
    // @ts-ignore
    this.listenTo(...toListen);
  }

  /**
   * Returns the at-rule statement when exists, eg. `@media (...)`, `@keyframes`
   * @returns {String}
   * @example
   * const cssRule = editor.Css.setRule('.class1', { color: 'red' }, {
   *  atRuleType: 'media',
   *  atRuleParams: '(min-width: 500px)'
   * });
   * cssRule.getAtRule(); // "@media (min-width: 500px)"
   */
  getAtRule() {
    return CssRule.getAtRuleFromProps(this.attributes);
  }

  static getAtRuleFromProps(cssRuleProps: Partial<CssRuleProperties>) {
    const type = cssRuleProps.atRuleType;
    const condition = cssRuleProps.mediaText;
    const typeStr = type ? `@${type}` : condition ? '@media' : '';

    return typeStr + (condition && typeStr ? ` ${condition}` : '');
  }

  /**
   * Return selectors of the rule as a string
   * @param {Object} [opts] Options
   * @param {Boolean} [opts.skipState] Skip state from the result
   * @returns {String}
   * @example
   * const cssRule = editor.Css.setRule('.class1:hover', { color: 'red' });
   * cssRule.selectorsToString(); // ".class1:hover"
   * cssRule.selectorsToString({ skipState: true }); // ".class1"
   */
  selectorsToString(opts: ObjectAny = {}) {
    const result = [];
    const state = this.get('state');
    const addSelector = this.get('selectorsAdd');
    const selOpts = {
      escape: (str: string) => (CSS && CSS.escape ? CSS.escape(str) : str),
    };
    // @ts-ignore
    const selectors = this.getSelectors().getFullString(0, selOpts);
    const stateStr = state && !opts.skipState ? `:${state}` : '';
    selectors && result.push(`${selectors}${stateStr}`);
    addSelector && !opts.skipAdd && result.push(addSelector);
    return result.join(', ');
  }

  /**
   * Get declaration block (without the at-rule statement)
   * @param {Object} [opts={}] Options (same as in `selectorsToString`)
   * @returns {String}
   * @example
   * const cssRule = editor.Css.setRule('.class1', { color: 'red' }, {
   *  atRuleType: 'media',
   *  atRuleParams: '(min-width: 500px)'
   * });
   * cssRule.getDeclaration() // ".class1{color:red;}"
   */
  getDeclaration(opts: ToCssOptions = {}) {
    let result = '';
    const { important } = this.attributes;
    const selectors = this.selectorsToString(opts);
    const style = this.styleToString({ important, ...opts });
    const singleAtRule = this.get('singleAtRule');

    if ((selectors || singleAtRule) && (style || opts.allowEmpty)) {
      result = singleAtRule ? style : `${selectors}{${style}}`;
    }

    return result;
  }

  /**
   * Get the Device the rule is related to.
   * @returns {[Device]|null}
   * @example
   * const device = rule.getDevice();
   * console.log(device?.getName());
   */
  getDevice() {
    const { em } = this;
    const { atRuleType, mediaText } = this.attributes;
    const devices = em?.Devices.getDevices() || [];
    const deviceDefault = devices.filter((d) => d.getWidthMedia() === '')[0];
    if (atRuleType !== 'media' || !mediaText) {
      return deviceDefault || null;
    }
    return devices.filter((d) => d.getWidthMedia() === getMediaLength(mediaText))[0] || null;
  }

  /**
   * Get the State the rule is related to.
   * @returns {[State]|null}
   * @example
   * const state = rule.getState();
   * console.log(state?.getLabel());
   */
  getState() {
    const { em } = this;
    const stateValue = this.get('state');
    const states = em?.Selectors.getStates() || [];
    return states.filter((s) => s.getName() === stateValue)[0] || null;
  }

  /**
   * Returns the related Component (valid only for component-specific rules).
   * @returns {[Component]|null}
   * @example
   * const cmp = rule.getComponent();
   * console.log(cmp?.toHTML());
   */
  getComponent() {
    const sel = this.getSelectors();
    const sngl = sel.length == 1 && sel.at(0);
    const cmpId = sngl && sngl.isId() && sngl.get('name');
    return (cmpId && this.em?.Components.getById(cmpId)) || null;
  }

  /**
   * Return the CSS string of the rule
   * @param {Object} [opts={}] Options (same as in `getDeclaration`)
   * @return {String} CSS string
   * @example
   * const cssRule = editor.Css.setRule('.class1', { color: 'red' }, {
   *  atRuleType: 'media',
   *  atRuleParams: '(min-width: 500px)'
   * });
   * cssRule.toCSS() // "@media (min-width: 500px){.class1{color:red;}}"
   */
  toCSS(opts: ToCssOptions = {}) {
    let result = '';
    const atRule = this.getAtRule();
    const block = this.getDeclaration(opts);
    if (block || opts.allowEmpty) {
      result = block;
    }

    if (atRule && result) {
      result = `${atRule}{${result}}`;
    }

    return result;
  }

  toJSON(opts?: ObjectAny) {
    const obj = super.toJSON(opts);
    if (this.em?.getConfig().avoidDefaults) {
      const defaults = this.defaults();

      forEach(defaults, (value, key) => {
        if (obj[key] === value) {
          delete obj[key];
        }
      });

      // Delete the property used for partial updates
      delete obj.style.__p;

      if (isEmpty(obj.selectors)) delete obj.selectors;
      if (isEmpty(obj.style)) delete obj.style;
    }

    return obj;
  }

  /**
   * Compare the actual model with parameters
   * @param {Object} selectors Collection of selectors
   * @param {String} state Css rule state
   * @param {String} width For which device this style is oriented
   * @param {Object} ruleProps Other rule props
   * @returns  {Boolean}
   * @private
   */
  compare(selectors: any, state?: string, width?: string, ruleProps: Partial<CssRuleProperties> = {}) {
    const st = state || '';
    const wd = width || '';
    const selAdd = ruleProps.selectorsAdd || '';
    let atRule = ruleProps.atRuleType || '';
    const sel = !isArray(selectors) && !selectors.models ? [selectors] : selectors.models || selectors;

    // Fix atRuleType in case is not specified with width
    if (wd && !atRule) atRule = 'media';

    const a1: string[] = sel.map((model: any) => model.getFullName());
    const a2: string[] = this.get('selectors')?.map((model) => model.getFullName())!;

    // Check selectors
    const a1S = a1.slice().sort();
    const a2S = a2.slice().sort();
    if (a1.length !== a2.length || !a1S.every((v, i) => v === a2S[i])) {
      return false;
    }

    // Check other properties
    if (
      this.get('state') !== st ||
      this.get('mediaText') !== wd ||
      this.get('selectorsAdd') !== selAdd ||
      this.get('atRuleType') !== atRule
    ) {
      return false;
    }

    return true;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: CssRules.ts]---
Location: grapesjs-dev/packages/core/src/css_composer/model/CssRules.ts

```typescript
import { Collection } from '../../common';
import EditorModel from '../../editor/model/Editor';
import CssRule, { CssRuleProperties } from './CssRule';

export default class CssRules extends Collection<CssRule> {
  editor: EditorModel;

  constructor(props: any, opt: any) {
    super(props);
    // Inject editor
    this.editor = opt?.em;

    // This will put the listener post CssComposer.postLoad
    setTimeout(() => {
      this.on('remove', this.onRemove);
      this.on('add', this.onAdd);
    });
  }

  toJSON(opts?: any) {
    const result = Collection.prototype.toJSON.call(this, opts);
    return result.filter((rule: CssRuleProperties) => rule.style && !rule.shallow);
  }

  onAdd(model: CssRule, c: CssRules, o: any) {
    model.ensureSelectors(model, c, o); // required for undo
  }

  onRemove(removed: CssRule) {
    const em = this.editor;
    em.stopListening(removed);
    em.UndoManager.remove(removed);
  }

  /** @ts-ignore */
  add(models: any, opt: any = {}) {
    if (typeof models === 'string') {
      models = this.editor.get('Parser').parseCss(models);
    }
    opt.em = this.editor;
    return Collection.prototype.add.apply(this, [models, opt]);
  }
}

CssRules.prototype.model = CssRule;
```

--------------------------------------------------------------------------------

---[FILE: CssGroupRuleView.ts]---
Location: grapesjs-dev/packages/core/src/css_composer/view/CssGroupRuleView.ts

```typescript
import CssRuleView from './CssRuleView';

export default class CssGroupRuleView extends CssRuleView {
  _createElement() {
    return document.createTextNode('');
  }

  render() {
    const model = this.model;
    const important = model.get('important');
    this.el.textContent = model.getDeclaration({ important });
    return this;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: CssRulesView.ts]---
Location: grapesjs-dev/packages/core/src/css_composer/view/CssRulesView.ts

```typescript
import { bindAll } from 'underscore';

import { View } from '../../common';
import { createEl } from '../../utils/dom';
import CssRuleView from './CssRuleView';
import CssGroupRuleView from './CssGroupRuleView';
import EditorModel from '../../editor/model/Editor';
import CssRule from '../model/CssRule';

const getBlockId = (pfx: string, order?: string | number) => `${pfx}${order ? `-${parseFloat(order as string)}` : ''}`;

export default class CssRulesView extends View {
  atRules: Record<string, any>;
  config: Record<string, any>;
  em: EditorModel;
  pfx: string;
  renderStarted?: boolean;

  constructor(o: any) {
    super(o);
    bindAll(this, 'sortRules');

    const config = o.config || {};
    this.atRules = {};
    this.config = config;
    this.em = config.em;
    this.pfx = config.stylePrefix || '';
    this.className = this.pfx + 'rules';
    const coll = this.collection;
    this.listenTo(coll, 'add', this.addTo);
    this.listenTo(coll, 'reset', this.render);
  }

  /**
   * Add to collection
   * @param {Object} model
   * @private
   * */
  addTo(model: CssRule) {
    this.addToCollection(model);
  }

  /**
   * Add new object to collection
   * @param {Object} model
   * @param {Object} fragmentEl
   * @return {Object}
   * @private
   * */
  addToCollection(model: CssRule, fragmentEl?: DocumentFragment) {
    // If the render is not yet started
    if (!this.renderStarted) {
      return;
    }

    const fragment = fragmentEl || null;
    const { config } = this;
    const opts = { model, config };
    let rendered, view;

    // I have to render keyframes of the same name together
    // Unfortunately at the moment I didn't find the way of appending them
    // if not statically, via appendData
    if (model.get('atRuleType') === 'keyframes') {
      const atRule = model.getAtRule();
      let atRuleEl = this.atRules[atRule];

      if (!atRuleEl) {
        const styleEl = document.createElement('style');
        atRuleEl = document.createTextNode('');
        styleEl.appendChild(document.createTextNode(`${atRule}{`));
        styleEl.appendChild(atRuleEl);
        styleEl.appendChild(document.createTextNode('}'));
        this.atRules[atRule] = atRuleEl;
        rendered = styleEl;
      }

      view = new CssGroupRuleView(opts);
      atRuleEl.appendData(view.render().el.textContent);
    } else {
      view = new CssRuleView(opts);
      rendered = view.render().el;
    }

    const clsName = this.className!;
    const mediaText = model.get('mediaText');
    const defaultBlockId = getBlockId(clsName);
    let blockId = defaultBlockId;

    // If the rule contains a media query it might have a different container
    // for it (eg. rules created with Device Manager)
    if (mediaText) {
      blockId = getBlockId(clsName, this.getMediaWidth(mediaText));
    }

    if (rendered) {
      const container = fragment || this.el;
      let contRules;

      // Try to find a specific container for the rule (if it
      // containes a media query), otherwise get the default one
      try {
        contRules = container.querySelector(`#${blockId}`);
      } catch (e) {}

      if (!contRules) {
        contRules = container.querySelector(`#${defaultBlockId}`);
      }

      contRules?.appendChild(rendered);
    }

    return rendered;
  }

  getMediaWidth(mediaText: string) {
    return mediaText && mediaText.replace(`(${this.em.getConfig().mediaCondition}: `, '').replace(')', '');
  }

  sortRules(a: number, b: number) {
    const { em } = this;
    const isMobFirst = (em.getConfig().mediaCondition || '').indexOf('min-width') !== -1;

    if (!isMobFirst) return 0;

    const left = isMobFirst ? a : b;
    const right = isMobFirst ? b : a;

    return left - right;
  }

  render() {
    this.renderStarted = true;
    this.atRules = {};
    const { em, $el, collection } = this;
    const cls = this.className!;
    const frag = document.createDocumentFragment();
    $el.empty();

    // Create devices related DOM structure, ensure also to have a default container
    const prs = em.Devices.getAll().pluck('priority').sort(this.sortRules) as number[];
    prs.every((pr) => pr) && prs.unshift(0);
    prs.forEach((pr) => frag.appendChild(createEl('div', { id: getBlockId(cls, pr) })));

    collection.each((model) => this.addToCollection(model, frag));
    $el.append(frag);
    $el.attr('class', cls);
    return this;
  }
}
```

--------------------------------------------------------------------------------

````
