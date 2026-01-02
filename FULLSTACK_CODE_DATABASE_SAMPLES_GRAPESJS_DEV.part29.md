---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 29
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 29 of 97)

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

---[FILE: FrameWrapView.ts]---
Location: grapesjs-dev/packages/core/src/canvas/view/FrameWrapView.ts

```typescript
import { bindAll, isNumber, isNull, debounce } from 'underscore';
import { ModuleView } from '../../abstract';
import FrameView from './FrameView';
import { createEl, removeEl } from '../../utils/dom';
import Dragger from '../../utils/Dragger';
import CanvasView from './CanvasView';
import Frame from '../model/Frame';

export default class FrameWrapView extends ModuleView<Frame> {
  events() {
    return {
      'click [data-action-remove]': 'remove',
      'mousedown [data-action-move]': 'startDrag',
    };
  }
  elTools?: HTMLElement;
  frame: FrameView;
  dragger?: Dragger;
  cv: CanvasView;
  classAnim: string;
  sizeObserver?: ResizeObserver;

  constructor(model: Frame, canvasView: CanvasView) {
    super({ model });
    bindAll(this, 'onScroll', 'frameLoaded', 'updateOffset', 'remove', 'startDrag');
    const config = {
      ...model.config,
      frameWrapView: this,
    };
    this.cv = canvasView;
    this.frame = new FrameView(model, this);
    this.classAnim = `${this.ppfx}frame-wrapper--anim`;
    this.updateOffset = debounce(this.updateOffset.bind(this), 0);
    this.updateSize = debounce(this.updateSize.bind(this), 0);
    this.listenTo(model, 'loaded', this.frameLoaded);
    this.listenTo(model, 'change:x change:y', this.updatePos);
    this.listenTo(model, 'change:width change:height', this.updateSize);
    this.listenTo(model, 'destroy remove', this.remove);
    this.updatePos();
    this.setupDragger();
  }

  setupDragger() {
    const { module, model } = this;
    let dragX: number, dragY: number, zoom: number;
    const toggleEffects = (on: boolean) => {
      module.toggleFramesEvents(on);
    };

    this.dragger = new Dragger({
      onStart: () => {
        const { x, y } = model.attributes;
        zoom = this.em.getZoomMultiplier();
        dragX = x;
        dragY = y;
        toggleEffects(false);
      },
      onEnd: () => toggleEffects(true),
      setPosition: (posOpts: any) => {
        model.set({
          x: dragX + posOpts.x * zoom,
          y: dragY + posOpts.y * zoom,
        });
      },
    });
  }

  startDrag(ev?: Event) {
    ev && this.dragger?.start(ev);
  }

  __clear(opts?: any) {
    const { frame } = this;
    frame && frame.remove(opts);
    removeEl(this.elTools);
  }

  remove(opts?: any) {
    this.sizeObserver?.disconnect();
    this.__clear(opts);
    ModuleView.prototype.remove.apply(this, opts);
    //@ts-ignore
    ['frame', 'dragger', 'cv', 'elTools'].forEach((i) => (this[i] = 0));
    return this;
  }

  updateOffset() {
    const { em, $el, frame } = this;
    if (!em || em.destroyed) return;
    em.runDefault({ preserveSelected: 1 });
    $el.removeClass(this.classAnim);
    frame?.model?._emitUpdated();
  }

  updatePos(md?: boolean) {
    const { model, el } = this;
    const { x, y } = model.attributes;
    const { style } = el;
    this.frame.rect = undefined;
    style.left = isNaN(x) ? x : `${x}px`;
    style.top = isNaN(y) ? y : `${y}px`;
    md && this.updateOffset();
  }

  updateSize() {
    this.updateDim();
  }

  /**
   * Update dimensions of the frame
   * @private
   */
  updateDim() {
    const { em, el, $el, model, classAnim, frame } = this;
    if (!frame) return;
    frame.rect = undefined;
    $el.addClass(classAnim);
    const { noChanges, width, height } = this.__handleSize();

    // Set width and height from DOM (should be done only once)
    if (isNull(width) || isNull(height)) {
      model.set(
        {
          ...(!width ? { width: el.offsetWidth } : {}),
          ...(!height ? { height: el.offsetHeight } : {}),
        },
        { silent: 1 },
      );
    }

    // Prevent fixed highlighting box which appears when on
    // component hover during the animation
    em.stopDefault({ preserveSelected: 1 });
    noChanges ? this.updateOffset() : setTimeout(this.updateOffset, 350);
  }

  onScroll() {
    const { frame, em } = this;
    em.trigger('frame:scroll', {
      frame,
      body: frame.getBody(),
      target: frame.getWindow(),
    });
  }

  frameLoaded() {
    const { frame, config } = this;
    frame.getWindow().onscroll = this.onScroll;
    this.updateDim();
  }

  __handleSize() {
    const un = 'px';
    const { model, el } = this;
    const { style } = el;
    const { width, height } = model.attributes;
    const currW = style.width || '';
    const currH = style.height || '';
    const newW = width || '';
    const newH = height || '';
    const noChanges = currW == newW && currH == newH;
    const newWidth = isNumber(newW) ? `${newW}${un}` : newW;
    const newHeight = isNumber(newH) ? `${newH}${un}` : newH;
    style.width = newWidth;
    this.sizeObserver?.disconnect();

    if (model.hasAutoHeight()) {
      const iframe = this.frame.el;
      const { contentDocument } = iframe;

      if (contentDocument) {
        const observer = new ResizeObserver(() => {
          // This prevents "ResizeObserver loop completed with undelivered notifications"
          requestAnimationFrame(() => {
            const minHeight = parseFloat(model.get('minHeight')) || 0;
            const heightResult = Math.max(contentDocument.body.scrollHeight, minHeight);
            style.height = `${heightResult}px`;
          });
        });
        observer.observe(contentDocument.body);
        this.sizeObserver = observer;
      }
    } else {
      style.height = newHeight;
      delete this.sizeObserver;
    }

    return { noChanges, width, height, newW, newH };
  }

  render() {
    const { frame, $el, ppfx, cv, model, el } = this;
    const { onRender } = model.attributes;
    this.__clear();
    this.__handleSize();
    frame.render();
    $el
      .empty()
      .attr({ class: `${ppfx}frame-wrapper` })
      .append(
        `
      <div class="${ppfx}frame-wrapper__top gjs-two-color" data-frame-top>
        <div class="${ppfx}frame-wrapper__name" data-action-move>
          ${model.get('name') || ''}
        </div>
        <div class="${ppfx}frame-wrapper__top-r">
          <div class="${ppfx}frame-wrapper__icon" data-action-remove style="display: none">
            <svg viewBox="0 0 24 24"><path d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12z"></path></svg>
          </div>
        </div>
      </div>
      <div class="${ppfx}frame-wrapper__right" data-frame-right></div>
      <div class="${ppfx}frame-wrapper__left" data-frame-left></div>
      <div class="${ppfx}frame-wrapper__bottom" data-frame-bottom></div>
      `,
      )
      .append(frame.el);
    const elTools = createEl(
      'div',
      {
        class: `${ppfx}tools`,
        style: 'pointer-events:none; display: none',
      },
      `
      <div class="${ppfx}highlighter" data-hl></div>
      <div class="${ppfx}badge" data-badge></div>
      <div class="${ppfx}placeholder">
        <div class="${ppfx}placeholder-int"></div>
      </div>
      <div class="${ppfx}ghost"></div>
      <div class="${ppfx}toolbar" style="pointer-events:all"></div>
      <div class="${ppfx}resizer"></div>
      <div class="${ppfx}offset-v" data-offset>
        <div class="gjs-marginName" data-offset-m>
          <div class="gjs-margin-v-el gjs-margin-v-top" data-offset-m-t></div>
          <div class="gjs-margin-v-el gjs-margin-v-bottom" data-offset-m-b></div>
          <div class="gjs-margin-v-el gjs-margin-v-left" data-offset-m-l></div>
          <div class="gjs-margin-v-el gjs-margin-v-right" data-offset-m-r></div>
        </div>
        <div class="gjs-paddingName" data-offset-m>
          <div class="gjs-padding-v-el gjs-padding-v-top" data-offset-p-t></div>
          <div class="gjs-padding-v-el gjs-padding-v-bottom" data-offset-p-b></div>
          <div class="gjs-padding-v-el gjs-padding-v-left" data-offset-p-l></div>
          <div class="gjs-padding-v-el gjs-padding-v-right" data-offset-p-r></div>
        </div>
      </div>
      <div class="${ppfx}offset-fixed-v"></div>
    `,
    );
    this.elTools = elTools;
    const twrp = cv?.toolsWrapper;
    twrp && twrp.appendChild(elTools); // TODO remove on frame remove
    onRender &&
      onRender({
        el,
        elTop: el.querySelector('[data-frame-top]'),
        elRight: el.querySelector('[data-frame-right]'),
        elBottom: el.querySelector('[data-frame-bottom]'),
        elLeft: el.querySelector('[data-frame-left]'),
        frame: model,
        frameWrapperView: this,
        remove: this.remove,
        startDrag: this.startDrag,
      });
    return this;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: grapesjs-dev/packages/core/src/code_manager/index.ts

```typescript
/**
 * - [addGenerator](#addgenerator)
 * - [getGenerator](#getgenerator)
 * - [getGenerators](#getgenerators)
 * - [addViewer](#addviewer)
 * - [getViewer](#getviewer)
 * - [getViewers](#getviewers)
 * - [updateViewer](#updateviewer)
 * - [getCode](#getcode)
 *
 *
 * Before using methods you should get first the module from the editor instance, in this way:
 *
 * ```js
 * var codeManager = editor.CodeManager;
 * ```
 *
 * @module CodeManager
 */
import { isUndefined } from 'underscore';
import defConfig, { CodeManagerConfig } from './config/config';
import gHtml from './model/HtmlGenerator';
import gCss from './model/CssGenerator';
import gJson from './model/JsonGenerator';
import gJs from './model/JsGenerator';
import eCM from './model/CodeMirrorEditor';
import CodeEditorView from './view/EditorView';
import { Module } from '../abstract';
import EditorModel from '../editor/model/Editor';

const defaultViewer = 'CodeMirror';

export default class CodeManagerModule extends Module<CodeManagerConfig & { pStylePrefix?: string }> {
  defGenerators: Record<string, any>;
  defViewers: Record<string, any>;
  generators: Record<string, any>;
  viewers: Record<string, any>;

  EditorView = CodeEditorView;

  constructor(em: EditorModel) {
    super(em, 'CodeManager', defConfig());
    const { config } = this;
    const ppfx = config.pStylePrefix;
    if (ppfx) config.stylePrefix = ppfx + config.stylePrefix;

    this.generators = {};
    this.viewers = {};
    this.defGenerators = {
      html: new gHtml(),
      css: new gCss(),
      json: new gJson(),
      js: new gJs(),
    };
    this.defViewers = { CodeMirror: new eCM() };
    this.loadDefaultGenerators().loadDefaultViewers();
  }

  /**
   * Add new code generator to the collection
   * @param  {string} id Code generator ID
   * @param  {Object} generator Code generator wrapper
   * @param {Function} generator.build Function that builds the code
   * @return {this}
   * @example
   * codeManager.addGenerator('html7',{
   *   build: function(model){
   *    return 'myCode';
   *   }
   * });
   * */
  addGenerator(id: string, generator: any) {
    this.generators[id] = generator;
    return this;
  }

  /**
   * Get code generator by id
   * @param  {string} id Code generator ID
   * @return {Object|null}
   * @example
   * var generator = codeManager.getGenerator('html7');
   * generator.build = function(model){
   *   //extend
   * };
   * */
  getGenerator(id: string) {
    return this.generators[id];
  }

  /**
   * Returns all code generators
   * @return {Array<Object>}
   * */
  getGenerators() {
    return this.generators;
  }

  /**
   * Add new code viewer
   * @param  {string} id Code viewer ID
   * @param  {Object} viewer Code viewer wrapper
   * @param {Function} viewer.init Set element on which viewer will be displayed
   * @param {Function} viewer.setContent Set content to the viewer
   * @return {this}
   * @example
   * codeManager.addViewer('ace',{
   *   init: function(el){
   *     var ace = require('ace-editor');
   *     this.editor  = ace.edit(el.id);
   *   },
   *   setContent: function(code){
   *    this.editor.setValue(code);
   *   }
   * });
   * */
  addViewer(id: string, viewer: any) {
    this.viewers[id] = viewer;
    return this;
  }

  /**
   * Get code viewer by id
   * @param  {string} id Code viewer ID
   * @return {Object|null}
   * @example
   * var viewer = codeManager.getViewer('ace');
   * */
  getViewer(id: string) {
    return this.viewers[id];
  }

  /**
   * Returns all code viewers
   * @return {Array<Object>}
   * */
  getViewers() {
    return this.viewers;
  }

  createViewer(opts: any = {}) {
    const type = !isUndefined(opts.type) ? opts.type : defaultViewer;
    const viewer = this.getViewer(type) && this.getViewer(type).clone();
    const cont = document.createElement('div');
    const txtarea = document.createElement('textarea');
    cont.appendChild(txtarea);
    viewer.set({
      ...this.config.optsCodeViewer,
      ...opts,
    });
    viewer.init(txtarea);
    viewer.setElement(cont);

    return viewer;
  }

  /**
   * Update code viewer content
   * @param  {Object} viewer Viewer instance
   * @param  {string} code  Code string
   * @example
   * var AceViewer = codeManager.getViewer('ace');
   * // ...
   * var viewer = AceViewer.init(el);
   * // ...
   * codeManager.updateViewer(AceViewer, 'code');
   * */
  updateViewer(viewer: any, code: string) {
    viewer.setContent(code);
  }

  /**
   * Get code from model
   * @param  {Object} model Any kind of model that will be passed to the build method of generator
   * @param  {string} genId Code generator id
   * @param  {Object} [opt] Options
   * @return {string}
   * @example
   * var codeStr = codeManager.getCode(model, 'html');
   * */
  getCode(model: any, genId: string, opt: any = {}): string {
    opt.em = this.em;
    const generator = this.getGenerator(genId);
    return generator ? generator.build(model, opt) : '';
  }

  /**
   * Load default code generators
   * @return {this}
   * @private
   * */
  loadDefaultGenerators() {
    for (const id in this.defGenerators) {
      this.addGenerator(id, this.defGenerators[id]);
    }

    return this;
  }

  /**
   * Load default code viewers
   * @return {this}
   * @private
   * */
  loadDefaultViewers() {
    for (const id in this.defViewers) {
      this.addViewer(id, this.defViewers[id]);
    }

    return this;
  }

  destroy() {}
}
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: grapesjs-dev/packages/core/src/code_manager/config/config.ts

```typescript
export interface CodeManagerConfig {
  /**
   * Style prefix.
   * @default 'cm-'
   */
  stylePrefix?: string;

  /**
   * Pass default options to code viewer
   * @default {}
   */
  optsCodeViewer?: Record<string, any>;
}

const config: () => CodeManagerConfig = () => ({
  stylePrefix: 'cm-',
  optsCodeViewer: {},
});

export default config;
```

--------------------------------------------------------------------------------

---[FILE: CodeMirrorEditor.ts]---
Location: grapesjs-dev/packages/core/src/code_manager/model/CodeMirrorEditor.ts

```typescript
import { bindAll } from 'underscore';
import { Model } from '../../common';
import { hasWin } from '../../utils/mixins';

let CodeMirror: any;

if (hasWin()) {
  CodeMirror = require('codemirror/lib/codemirror');
  require('codemirror/mode/htmlmixed/htmlmixed');
  require('codemirror/mode/css/css');
  require('codemirror-formatting');
}

export default class CodeMirrorEditor extends Model {
  editor?: any;
  element?: HTMLElement;

  defaults() {
    return {
      input: '',
      label: '',
      codeName: '',
      theme: 'hopscotch',
      readOnly: true,
      lineNumbers: true,
      autoFormat: true,
    };
  }

  init(el: HTMLElement) {
    bindAll(this, 'onChange');
    this.editor = CodeMirror.fromTextArea(el, {
      dragDrop: false,
      lineWrapping: true,
      mode: this.get('codeName'),
      ...this.attributes,
    });
    this.element = el;
    this.editor.on('change', this.onChange);

    return this;
  }

  onChange() {
    this.trigger('update', this);
  }

  getEditor() {
    return this.editor;
  }

  /**
   * The element where the viewer is attached
   * @return {HTMLElement}
   */
  getElement() {
    return this.element;
  }

  /**
   * Set the element which contains the viewer attached.
   * Generally, it should be just a textarea, but some editor might require
   * a container for it some in that case this method can be used
   * @param {HTMLElement} el
   * @return {self}
   */
  setElement(el: HTMLElement) {
    this.element = el;
    return this;
  }

  /**
   * Refresh the viewer
   * @return {self}
   */
  refresh() {
    this.getEditor().refresh();
    return this;
  }

  /**
   * Focus the viewer
   * @return {self}
   */
  focus() {
    this.getEditor().focus();
    return this;
  }

  getContent() {
    const ed = this.getEditor();
    return ed && ed.getValue();
  }

  /** @inheritdoc */
  setContent(value: string, opts: any = {}) {
    const { editor } = this;
    if (!editor) return;
    editor.setValue(value);
    const autoFormat = this.get('autoFormat');
    const canAutoFormat =
      editor.autoFormatRange &&
      (autoFormat === true || (Array.isArray(autoFormat) && autoFormat.includes(this.get('codeName'))));

    if (canAutoFormat) {
      CodeMirror.commands.selectAll(editor);
      editor.autoFormatRange(editor.getCursor(true), editor.getCursor(false));
      CodeMirror.commands.goDocStart(editor);
    }

    !opts.noRefresh && setTimeout(() => this.refresh());
  }
}

// @ts-ignore
CodeMirrorEditor.prototype.CodeMirror = CodeMirror;
```

--------------------------------------------------------------------------------

---[FILE: CssGenerator.ts]---
Location: grapesjs-dev/packages/core/src/code_manager/model/CssGenerator.ts

```typescript
import { bindAll, isUndefined, each } from 'underscore';
import { Model } from '../../common';
import CssComposer from '../../css_composer';
import CssRule from '../../css_composer/model/CssRule';
import CssRules from '../../css_composer/model/CssRules';
import Component from '../../dom_components/model/Component';
import EditorModel from '../../editor/model/Editor';
import { hasWin } from '../../utils/mixins';

const maxValue = Number.MAX_VALUE;

export const getMediaLength = (mediaQuery: string) => {
  const length = /(-?\d*\.?\d+)\w{0,}/.exec(mediaQuery);
  return !length ? '' : length[0];
};

export type CssGeneratorBuildOptions = {
  /**
   * Return an array of CssRules instead of the CSS string.
   */
  json?: boolean;

  /**
   * Return only rules matched by the passed component.
   */
  onlyMatched?: boolean;

  /**
   * Force keep all defined rules. Toggle on in case output looks different inside/outside of the editor.
   */
  keepUnusedStyles?: boolean;
  rules?: CssRule[];
  clearStyles?: boolean;
};

type CssGeneratorBuildOptionsProps = CssGeneratorBuildOptions & {
  em?: EditorModel;
  cssc?: CssComposer;
};

type AtRules = Record<string, CssRule[]>;

export default class CssGenerator extends Model {
  compCls: string[];
  ids: string[];
  model?: Component;
  em?: EditorModel;

  constructor() {
    super();
    bindAll(this, 'sortRules');
    this.compCls = [];
    this.ids = [];
  }

  /**
   * Get CSS from a component
   * @param {Model} model
   * @return {String}
   */
  buildFromModel(model: Component, opts: CssGeneratorBuildOptions = {}) {
    let code = '';
    const em = this.em;
    const avoidInline = em && em.getConfig().avoidInlineStyle;
    const style = model.styleToString();
    const classes = model.classes;
    this.ids.push(`#${model.getId()}`);

    // Let's know what classes I've found
    classes.forEach((model: any) => this.compCls.push(model.getFullName()));

    if (!avoidInline && style) {
      code = `#${model.getId()}{${style}}`;
    }

    const components = model.components();
    components.forEach((model: Component) => (code += this.buildFromModel(model, opts)));
    return code;
  }

  build(model: Component, opts: CssGeneratorBuildOptionsProps = {}) {
    const { json } = opts;
    const em = opts.em;
    const cssc = opts.cssc || em?.Css;
    this.em = em;
    this.compCls = [];
    this.ids = [];
    this.model = model;
    const codeJson: CssRule[] = [];
    let code = model ? this.buildFromModel(model, opts) : '';
    const clearStyles = isUndefined(opts.clearStyles) && em ? em.getConfig().clearStyles : opts.clearStyles;

    if (cssc) {
      let rules: CssRules | CssRule[] = opts.rules || cssc.getAll();
      const atRules: AtRules = {};
      const dump: CssRule[] = [];

      if (opts.onlyMatched && model && hasWin()) {
        rules = this.matchedRules(model, rules);
      }

      rules.forEach((rule) => {
        const atRule = rule.getAtRule();

        if (atRule) {
          const mRules = atRules[atRule];
          if (mRules) {
            mRules.push(rule);
          } else {
            atRules[atRule] = [rule];
          }
          return;
        }

        const res = this.buildFromRule(rule, dump, opts);

        if (json) {
          codeJson.push(res as CssRule);
        } else {
          code += res;
        }
      });

      this.sortMediaObject(atRules).forEach((item) => {
        let rulesStr = '';
        const atRule = item.key;
        const mRules = item.value;

        mRules.forEach((rule) => {
          const ruleStr = this.buildFromRule(rule, dump, opts);

          if (rule.get('singleAtRule')) {
            code += `${atRule}{${ruleStr}}`;
          } else {
            rulesStr += ruleStr;
          }

          json && codeJson.push(ruleStr as CssRule);
        });

        if (rulesStr) {
          code += `${atRule}{${rulesStr}}`;
        }
      });

      // @ts-ignore
      em && clearStyles && rules.remove && rules.remove(dump);
    }

    return json ? codeJson.filter((r) => r) : code;
  }

  /**
   * Get CSS from the rule model
   * @param {Model} rule
   * @return {string} CSS string
   */
  buildFromRule(rule: CssRule, dump: CssRule[], opts: CssGeneratorBuildOptions = {}) {
    let result: CssRule | string = '';
    const { model } = this;
    const selectorStrNoAdd = rule.selectorsToString({ skipAdd: 1 });
    const selectorsAdd = rule.get('selectorsAdd');
    const singleAtRule = rule.get('singleAtRule');
    let found;

    // This will not render a rule if there is no its component
    rule.get('selectors')?.forEach((selector) => {
      const name = selector.getFullName();
      if (this.compCls.indexOf(name) >= 0 || this.ids.indexOf(name) >= 0 || opts.keepUnusedStyles) {
        found = 1;
      }
    });

    if ((selectorStrNoAdd && found) || selectorsAdd || singleAtRule || !model) {
      const block = rule.getDeclaration();
      block && (opts.json ? (result = rule) : (result += block));
    } else {
      dump.push(rule);
    }

    return result;
  }

  /**
   * Get matched rules of a component
   * @param {Component} component
   * @param {Array<CSSRule>} rules
   * @returns {Array<CSSRule>}
   */
  matchedRules(component: Component, rules: CssRules | CssRule[]) {
    const el = component.getEl();
    let result: CssRule[] = [];

    rules.forEach((rule) => {
      try {
        if (
          rule
            .selectorsToString()
            .split(',')
            .some((selector) => el?.matches(this.__cleanSelector(selector)))
        ) {
          result.push(rule);
        }
      } catch (err) {}
    });

    component.components().forEach((component: Component) => {
      result = result.concat(this.matchedRules(component, rules));
    });

    // Remove duplicates
    result = result.filter((rule, i) => result.indexOf(rule) === i);

    return result;
  }

  /**
   * Get the numeric length of the media query string
   * @param  {String} mediaQuery Media query string
   * @return {Number}
   */
  getQueryLength(mediaQuery: string) {
    const length = /(-?\d*\.?\d+)\w{0,}/.exec(mediaQuery);
    if (!length) return maxValue;

    return parseFloat(length[1]);
  }

  /**
   * Return a sorted array from media query object
   * @param  {Object} items
   * @return {Array}
   */
  sortMediaObject(items: AtRules = {}) {
    const itemsArr: { key: string; value: CssRule[] }[] = [];
    each(items, (value, key) => itemsArr.push({ key, value }));
    return itemsArr.sort((a, b) => {
      const isMobFirst = [a.key, b.key].every((mquery) => mquery.indexOf('min-width') !== -1);
      const left = isMobFirst ? a.key : b.key;
      const right = isMobFirst ? b.key : a.key;
      return this.getQueryLength(left) - this.getQueryLength(right);
    });
  }

  sortRules(a: CssRule, b: CssRule) {
    const getKey = (rule: CssRule) => rule.get('mediaText') || '';
    const isMobFirst = [getKey(a), getKey(b)].every((q) => q.indexOf('min-width') !== -1);
    const left = isMobFirst ? getKey(a) : getKey(b);
    const right = isMobFirst ? getKey(b) : getKey(a);
    return this.getQueryLength(left) - this.getQueryLength(right);
  }

  /**
   * Return passed selector without states
   * @param {String} selector
   * @returns {String}
   * @private
   */
  __cleanSelector(selector: string) {
    return selector
      .split(' ')
      .map((item) => item.split(':')[0])
      .join(' ');
  }
}
```

--------------------------------------------------------------------------------

---[FILE: HtmlGenerator.ts]---
Location: grapesjs-dev/packages/core/src/code_manager/model/HtmlGenerator.ts

```typescript
import { Model } from '../../common';
import Component from '../../dom_components/model/Component';
import { ToHTMLOptions } from '../../dom_components/model/types';
import EditorModel from '../../editor/model/Editor';

export interface HTMLGeneratorBuildOptions extends ToHTMLOptions {
  /**
   * Remove unnecessary IDs (eg. those created automatically).
   */
  cleanId?: boolean;
}

export default class HTMLGenerator extends Model {
  build(model: Component, opts: HTMLGeneratorBuildOptions & { em?: EditorModel } = {}) {
    const { em, ...restOpts } = opts;
    const htmlOpts = restOpts;

    // Remove unnecessary IDs
    if (opts.cleanId && em) {
      const rules = em.Css.getAll();
      const idRules = rules
        .toJSON()
        .map((rule: any) => {
          const sels = rule.selectors;
          const sel = sels && sels.length === 1 && sels.models[0];
          return sel && sel.isId() && sel.get('name');
        })
        .filter(Boolean);

      const attributes = htmlOpts.attributes;
      htmlOpts.attributes = (mod, attrs) => {
        attrs = typeof attributes === 'function' ? attributes(mod, attrs) : attrs;
        const { id } = attrs;
        if (
          id &&
          id[0] === 'i' && // all autogenerated IDs start with 'i'
          !mod.get('script') && // if the component has script, we have to leave the ID
          !mod.get('script-export') && // if the component has script, we have to leave the ID
          !mod.get('attributes')!.id && // id is not intentionally in attributes
          idRules.indexOf(id) < 0 // we shouldn't have any rule with this ID
        ) {
          delete attrs.id;
        }
        return attrs;
      };
    }

    return model.toHTML(htmlOpts);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: JsGenerator.ts]---
Location: grapesjs-dev/packages/core/src/code_manager/model/JsGenerator.ts

```typescript
import { extend } from 'underscore';
import { Model } from '../../common';
import Component from '../../dom_components/model/Component';

function isFunctionEmpty(fn: string) {
  const content = fn.toString().match(/\{([\s\S]*)\}/m)?.[1] || ''; // content between first and last { }
  return content.replace(/^\s*\/\/.*$/gm, '').trim().length === 0; // remove comments
}

type MapJsItem = {
  ids: string[];
  code: string;
  props?: Record<string, any>;
};

export default class JsGenerator extends Model {
  mapJs!: Record<string, MapJsItem>;

  mapModel(model: Component) {
    let code = '';
    const script = model.get('script-export') || model.get('script');
    const type = model.get('type')!;
    const comps = model.get('components')!;
    const id = model.getId();

    if (script) {
      // If the component has scripts we need to expose his ID
      let attr = model.get('attributes');
      attr = extend({}, attr, { id });
      model.set('attributes', attr, { silent: true });
      // @ts-ignore
      const scrStr = model.getScriptString(script);
      const scrProps = model.get('script-props');

      // If the script was updated, I'll put its code in a separate container
      if (model.get('scriptUpdated') && !scrProps) {
        this.mapJs[type + '-' + id] = { ids: [id], code: scrStr };
      } else {
        let props;
        const mapType = this.mapJs[type];

        if (scrProps) {
          props = model.__getScriptProps();
        }

        if (mapType) {
          mapType.ids.push(id);
          if (props) mapType.props![id] = props;
        } else {
          const res: MapJsItem = { ids: [id], code: scrStr };
          if (props) res.props = { [id]: props };
          this.mapJs[type] = res;
        }
      }
    }

    comps.forEach((model: Component) => {
      code += this.mapModel(model);
    });

    return code;
  }

  build(model: Component) {
    this.mapJs = {};
    this.mapModel(model);
    let code = '';

    for (let type in this.mapJs) {
      const mapType = this.mapJs[type];

      if (!mapType.code) {
        continue;
      }

      if (mapType.props) {
        if (isFunctionEmpty(mapType.code)) {
          continue;
        }

        code += `
          var props = ${JSON.stringify(mapType.props)};
          var ids = Object.keys(props).map(function(id) { return '#'+id }).join(',');
          var els = document.querySelectorAll(ids);
          for (var i = 0, len = els.length; i < len; i++) {
            var el = els[i];
            (${mapType.code}.bind(el))(props[el.id]);
          }`;
      } else {
        // Deprecated
        const ids = '#' + mapType.ids.join(', #');
        code += `
          var items = document.querySelectorAll('${ids}');
          for (var i = 0, len = items.length; i < len; i++) {
            (function(){\n${mapType.code}\n}.bind(items[i]))();
          }`;
      }
    }

    return code;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: JsonGenerator.ts]---
Location: grapesjs-dev/packages/core/src/code_manager/model/JsonGenerator.ts

```typescript
import { each } from 'underscore';
import { Model, Collection } from '../../common';
import Component from '../../dom_components/model/Component';

type ComponentProps = Record<string, any>;

export default class JsonGenerator extends Model {
  build(model: Component) {
    // @ts-ignore
    const json = model.toJSON() as ComponentProps;
    this.beforeEach(json);

    each(json, (v, attr) => {
      const obj = json[attr];
      if (obj instanceof Model) {
        // @ts-ignore
        json[attr] = this.build(obj);
      } else if (obj instanceof Collection) {
        const coll = obj;
        json[attr] = [];
        if (coll.length) {
          coll.forEach((el, index) => {
            json[attr][index] = this.build(el);
          });
        }
      }
    });

    return json;
  }

  /**
   * Execute on each object
   * @param {Object} obj
   */
  beforeEach(obj: ComponentProps) {
    delete obj.status;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: EditorView.ts]---
Location: grapesjs-dev/packages/core/src/code_manager/view/EditorView.ts

```typescript
import { View } from '../../common';
import html from '../../utils/html';

export default class CodeEditorView extends View {
  pfx?: string;
  config!: Record<string, any>;

  template({ pfx, codeName, label }: { pfx: string; codeName: string; label: string }) {
    return html`
      <div class="${pfx}editor" id="${pfx}${codeName}">
        <div id="${pfx}title">${label}</div>
        <div id="${pfx}code"></div>
      </div>
    `;
  }

  initialize(o: any) {
    this.config = o.config || {};
    this.pfx = this.config.stylePrefix;
  }

  render() {
    const { model, pfx, $el } = this;
    const obj = model.toJSON();
    const toAppend = model.get('input') || (model as any).getElement?.();
    obj.pfx = pfx;
    $el.html(this.template(obj));
    $el.attr('class', `${pfx}editor-c`);
    $el.find(`#${pfx}code`).append(toAppend);
    return this;
  }
}
```

--------------------------------------------------------------------------------

````
