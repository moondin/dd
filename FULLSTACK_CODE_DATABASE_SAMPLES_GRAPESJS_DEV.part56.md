---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 56
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 56 of 97)

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
Location: grapesjs-dev/packages/core/src/rich_text_editor/index.ts

```typescript
/**
 * This module allows to customize the built-in toolbar of the Rich Text Editor and use commands from the [HTML Editing APIs](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand).
 * It's highly recommended to keep this toolbar as small as possible, especially from styling commands (eg. 'fontSize') and leave this task to the Style Manager
 *
 * You can customize the initial state of the module from the editor initialization, by passing the following [Configuration Object](https://github.com/GrapesJS/grapesjs/blob/master/src/rich_text_editor/config/config.ts)
 * ```js
 * const editor = grapesjs.init({
 *  richTextEditor: {
 *    // options
 *  }
 * })
 * ```
 *
 * Once the editor is instantiated you can use its API. Before using these methods you should get the module from the instance.
 *
 * ```js
 * const rte = editor.RichTextEditor;
 * ```
 *
 * {REPLACE_EVENTS}
 *
 * ## Methods
 * * [add](#add)
 * * [get](#get)
 * * [run](#run)
 * * [getAll](#getall)
 * * [remove](#remove)
 * * [getToolbarEl](#gettoolbarel)
 *
 * @module RichTextEditor
 */

import { debounce, isFunction, isString } from 'underscore';
import { Module } from '../abstract';
import CanvasEvents from '../canvas/types';
import { Debounced, DisableOptions, Model } from '../common';
import { ComponentsEvents } from '../dom_components/types';
import ComponentTextView from '../dom_components/view/ComponentTextView';
import EditorModel from '../editor/model/Editor';
import { createEl, cx, on, removeEl } from '../utils/dom';
import { hasWin, isDef } from '../utils/mixins';
import defConfig, { CustomRTE, CustomRteOptions, RichTextEditorConfig } from './config/config';
import RichTextEditor, { RichTextEditorAction } from './model/RichTextEditor';
import { ModelRTE, RichTextEditorEvents, RteDisableResult } from './types';

export type { RichTextEditorEvent, RteDisableResult } from './types';

const eventsUp = `${CanvasEvents.refresh} frame:scroll ${ComponentsEvents.update}`;

export default class RichTextEditorModule extends Module<RichTextEditorConfig & { pStylePrefix?: string }> {
  pfx: string;
  toolbar!: HTMLElement;
  globalRte?: RichTextEditor;
  actionbar?: HTMLElement;
  lastEl?: HTMLElement;
  actions?: (RichTextEditorAction | string)[];
  customRte?: CustomRTE;
  model: Model<ModelRTE>;
  __dbdTrgCustom: Debounced;
  events = RichTextEditorEvents;

  /**
   * Get configuration object
   * @name getConfig
   * @function
   * @return {Object}
   */

  constructor(em: EditorModel) {
    super(em, 'RichTextEditor', defConfig());
    const { config } = this;
    const ppfx = config.pStylePrefix;

    if (ppfx) {
      config.stylePrefix = ppfx + config.stylePrefix;
    }

    this.pfx = config.stylePrefix!;
    this.actions = config.actions || [];
    const model = new Model();
    this.model = model;
    model.on('change:currentView', this.__trgCustom, this);
    this.__dbdTrgCustom = debounce(() => this.__trgCustom(), 0);
  }

  onLoad() {
    if (!hasWin()) return;
    const { config } = this;
    const ppfx = config.pStylePrefix;
    const isCustom = config.custom;
    const toolbar = createEl('div', {
      class: cx(`${ppfx}rte-toolbar`, !isCustom && `${ppfx}one-bg ${ppfx}rte-toolbar-ui`),
    });
    this.toolbar = toolbar;
    this.initRte(createEl('div'));

    //Avoid closing on toolbar clicking
    on(toolbar, 'mousedown', (e) => e.stopPropagation());
  }

  __trgCustom() {
    const { model, em, events } = this;
    em.trigger(events.custom, {
      enabled: !!model.get('currentView'),
      container: this.getToolbarEl(),
      actions: this.getAll(),
    });
  }

  destroy() {
    this.globalRte?.destroy();
    this.customRte?.destroy?.();
    this.model.stopListening().clear({ silent: true });
    this.__dbdTrgCustom.cancel();
    removeEl(this.toolbar);
  }

  /**
   * Post render callback
   * @param  {View} ev
   * @private
   */
  postRender(ev: any) {
    const canvas = ev.model.get('Canvas');
    this.toolbar.style.pointerEvents = 'all';
    this.hideToolbar();
    canvas.getToolsEl().appendChild(this.toolbar);
  }

  /**
   * Init the built-in RTE
   * @param  {HTMLElement} el
   * @return {RichTextEditor}
   * @private
   */
  initRte(el: HTMLElement) {
    let { globalRte } = this;
    const { em, pfx, actionbar, config } = this;
    const actions = this.actions || [...config.actions!];
    const classes = {
      actionbar: `${pfx}actionbar`,
      button: `${pfx}action`,
      active: `${pfx}active`,
      inactive: `${pfx}inactive`,
      disabled: `${pfx}disabled`,
    };

    if (!globalRte) {
      globalRte = new RichTextEditor(em, el, {
        classes,
        actions,
        actionbar,
        actionbarContainer: this.toolbar,
        module: this,
      });
      this.globalRte = globalRte;
    } else {
      globalRte.em = em;
      globalRte.setEl(el);
    }

    if (globalRte.actionbar) {
      this.actionbar = globalRte.actionbar;
    }

    if (globalRte.actions) {
      this.actions = globalRte.actions;
    }

    return globalRte;
  }

  /**
   * Add a new action to the built-in RTE toolbar
   * @param {string} name Action name
   * @param {Object} action Action options
   * @example
   * rte.add('bold', {
   *   icon: '<b>B</b>',
   *   attributes: {title: 'Bold'},
   *   result: rte => rte.exec('bold')
   * });
   * rte.add('link', {
   *   icon: document.getElementById('t'),
   *   attributes: { title: 'Link' },
   *   // Example on how to wrap selected content
   *   result: rte => rte.insertHTML(`<a href="#">${rte.selection()}</a>`)
   * });
   * // An example with fontSize
   * rte.add('fontSize', {
   *   icon: `<select class="gjs-field">
   *         <option>1</option>
   *         <option>4</option>
   *         <option>7</option>
   *       </select>`,
   *     // Bind the 'result' on 'change' listener
   *   event: 'change',
   *   result: (rte, action) => rte.exec('fontSize', action.btn.firstChild.value),
   *   // Callback on any input change (mousedown, keydown, etc..)
   *   update: (rte, action) => {
   *     const value = rte.doc.queryCommandValue(action.name);
   *     if (value != 'false') { // value is a string
   *       action.btn.firstChild.value = value;
   *     }
   *    }
   *   })
   * // An example with state
   * const isValidAnchor = (rte) => {
   *   // a utility function to help determine if the selected is a valid anchor node
   *   const anchor = rte.selection().anchorNode;
   *   const parentNode  = anchor && anchor.parentNode;
   *   const nextSibling = anchor && anchor.nextSibling;
   *   return (parentNode && parentNode.nodeName == 'A') || (nextSibling && nextSibling.nodeName == 'A')
   * }
   * rte.add('toggleAnchor', {
   *   icon: `<span style="transform:rotate(45deg)">&supdsub;</span>`,
   *   state: (rte, doc) => {
   *    if (rte && rte.selection()) {
   *      // `btnState` is a integer, -1 for disabled, 0 for inactive, 1 for active
   *      return isValidAnchor(rte) ? btnState.ACTIVE : btnState.INACTIVE;
   *    } else {
   *      return btnState.INACTIVE;
   *    }
   *   },
   *   result: (rte, action) => {
   *     if (isValidAnchor(rte)) {
   *       rte.exec('unlink');
   *     } else {
   *       rte.insertHTML(`<a class="link" href="">${rte.selection()}</a>`);
   *     }
   *   }
   * })
   */
  add(name: string, action: Partial<RichTextEditorAction> = {}) {
    action.name = name;
    this.globalRte?.addAction(action as RichTextEditorAction, { sync: true });
  }

  /**
   * Get the action by its name
   * @param {string} name Action name
   * @return {Object}
   * @example
   * const action = rte.get('bold');
   * // {name: 'bold', ...}
   */
  get(name: string): RichTextEditorAction | undefined {
    let result;
    this.globalRte?.getActions().forEach((action) => {
      if (action.name == name) {
        result = action;
      }
    });
    return result;
  }

  /**
   * Get all actions
   * @return {Array}
   */
  getAll() {
    return this.globalRte?.getActions() || [];
  }

  /**
   * Remove the action from the toolbar
   * @param  {string} name
   * @return {Object} Removed action
   * @example
   * const action = rte.remove('bold');
   * // {name: 'bold', ...}
   */
  remove(name: string) {
    const actions = this.getAll();
    const action = this.get(name);

    if (action) {
      const btn = action.btn;
      const index = actions.indexOf(action);
      btn?.parentNode?.removeChild(btn);
      actions.splice(index, 1);
    }

    return action;
  }

  /**
   * Run action command.
   * @param action Action to run
   * @example
   * const action = rte.get('bold');
   * rte.run(action) // or rte.run('bold')
   */
  run(action: string | RichTextEditorAction) {
    const rte = this.globalRte;
    const actionRes = isString(action) ? this.get(action) : action;

    if (rte && actionRes) {
      actionRes.result(rte, actionRes);
      rte.updateActiveActions();
    }
  }

  /**
   * Get the toolbar element
   * @return {HTMLElement}
   */
  getToolbarEl() {
    return this.toolbar;
  }

  /**
   * Triggered when the offset of the editor is changed
   * @private
   */
  updatePosition() {
    const { em, toolbar } = this;
    const un = 'px';
    const canvas = em.Canvas;
    const { style } = toolbar;
    const pos = canvas.getTargetToElementFixed(this.lastEl!, toolbar, {
      event: 'rteToolbarPosUpdate',
      left: 0,
    });
    ['top', 'left', 'bottom', 'right'].forEach((key) => {
      const value = pos[key as keyof typeof pos];
      if (isDef(value)) {
        style[key as any] = isString(value) ? value : (value || 0) + un;
      }
    });
  }

  /**
   * Enable rich text editor on the element
   * @param {View} view Component view
   * @param {Object} rte The instance of already defined RTE
   * @private
   * */
  async enable(view: ComponentTextView, rte: RichTextEditor, opts: CustomRteOptions) {
    this.lastEl = view.el;
    const { customRte, em, events } = this;
    const el = view.getChildrenContainer();

    this.toolbar.style.display = '';
    const rteInst = await (customRte ? customRte.enable(el, rte, opts) : this.initRte(el).enable(opts));

    if (em) {
      setTimeout(this.updatePosition.bind(this), 0);
      em.off(eventsUp, this.updatePosition, this);
      em.on(eventsUp, this.updatePosition, this);
      em.trigger(events.enable, view, rteInst);
    }

    this.model.set({ currentView: view });

    return rteInst;
  }

  async getContent(view: ComponentTextView, rte: RichTextEditor) {
    const { customRte } = this;
    const el = view.getChildrenContainer();

    if (customRte && rte && isFunction(customRte.getContent)) {
      return await customRte.getContent(el, rte, { view });
    } else {
      return el.innerHTML;
    }
  }

  hideToolbar() {
    const style = this.toolbar.style;
    const size = '-1000px';
    style.top = size;
    style.left = size;
    style.display = 'none';
  }

  /**
   * Unbind rich text editor from the element
   * @param {View} view
   * @param {Object} rte The instance of already defined RTE
   * @private
   * */
  async disable(view: ComponentTextView, rte?: RichTextEditor, opts: DisableOptions = {}) {
    let result: RteDisableResult = {};
    const { em, events } = this;
    const customRte = this.customRte;

    if (customRte) {
      const res = await customRte.disable(view.getChildrenContainer(), rte, { ...opts, view });
      if (res) {
        result = res;
      }
    } else {
      rte && rte.disable();
    }

    this.hideToolbar();

    if (em) {
      em.off(eventsUp, this.updatePosition, this);
      !opts.fromMove && em.trigger(events.disable, view, rte);
    }

    this.model.unset('currentView');

    return result;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: grapesjs-dev/packages/core/src/rich_text_editor/types.ts

```typescript
import ComponentTextView from '../dom_components/view/ComponentTextView';

export interface ModelRTE {
  currentView?: ComponentTextView;
}

export type RichTextEditorEvent = `${RichTextEditorEvents}`;

export interface RteDisableResult {
  forceSync?: boolean;
}

/**{START_EVENTS}*/
export enum RichTextEditorEvents {
  /**
   * @event `rte:enable` RTE enabled. The view, on which RTE is enabled, and the RTE instance are passed as arguments.
   * @example
   * editor.on('rte:enable', (view, rte) => { ... });
   */
  enable = 'rte:enable',

  /**
   * @event `rte:disable` RTE disabled. The view, on which RTE is disabled, and the RTE instance are passed as arguments.
   * @example
   * editor.on('rte:disable', (view, rte) => { ... });
   */
  disable = 'rte:disable',

  /**
   * @event `rte:custom` Custom RTE event. Object with enabled status, container, and actions is passed as an argument.
   * @example
   * editor.on('rte:custom', ({ enabled, container, actions }) => { ... });
   */
  custom = 'rte:custom',
}
/**{END_EVENTS}*/

// need this to avoid the TS documentation generator to break
export default RichTextEditorEvents;
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: grapesjs-dev/packages/core/src/rich_text_editor/config/config.ts

```typescript
import ComponentTextView from '../../dom_components/view/ComponentTextView';
import Editor from '../../editor';
import RichTextEditor from '../model/RichTextEditor';

export interface CustomRteOptions {
  event?: MouseEvent;
  view: ComponentTextView;
}

export interface CustomRTE<T = any> {
  /**
   * If true, the returned HTML content will be parsed into Components, allowing
   * the custom RTE to behave in the same way as the native one.
   * If false, the HTML content will be used as it is in the canvas and the export code.
   */
  parseContent?: boolean;
  /**
   * Create or enable the custom RTE.
   */
  enable: (el: HTMLElement, rte: T | undefined, opts: CustomRteOptions) => T | Promise<T>;
  /**
   * Disable the custom RTE.
   */
  disable: (el: HTMLElement, rte: T, opts: CustomRteOptions) => any | Promise<any>;
  /**
   * Get HTML content from the custom RTE.
   * If not specified, it will use the innerHTML of the element (passed also as `content` in options).
   */
  getContent?: (el: HTMLElement, rte: T | undefined, opts: CustomRteOptions) => string | Promise<string>;
  /**
   * Destroy the custom RTE.
   * Will be triggered on editor destroy.
   */
  destroy?: () => void;

  [key: string]: unknown;
}

export interface RichTextEditorConfig {
  /**
   * Class name prefix for styles
   * @default 'rte-'
   */
  stylePrefix?: string;

  /**
   * If true, moves the toolbar below the element when the top canvas edge is reached.
   * @default true
   */
  adjustToolbar?: boolean;

  /**
   * Default RTE actions.
   * @default ['bold', 'italic', 'underline', 'strikethrough', 'link', 'wrap']
   */
  actions?: string[];

  /**
   * Custom on paste logic for the built-in RTE.
   * @example
   * onPaste: ({ ev, rte }) => {
   *  ev.preventDefault();
   *  const { clipboardData } = ev;
   *  const text = clipboardData.getData('text');
   *  rte.exec('insertHTML', `<b>[ ${text} ]</b>`);
   * }
   */
  onPaste?: (data: { ev: ClipboardEvent; editor: Editor; rte: RichTextEditor }) => void;

  /**
   * Custom on keydown logic for the built-in RTE.
   * @example
   * onKeydown: ({ ev, rte }) => {
   *  if (ev.key === 'Enter') {
   *    ev.preventDefault();
   *    rte.exec('insertHTML', `<br>-- custom line break --<br>`);
   *  }
   * }
   */
  onKeydown?: (data: { ev: KeyboardEvent; editor: Editor; rte: RichTextEditor }) => void;

  /**
   * Avoid rendering the default RTE UI.
   * @default false
   */
  custom?: boolean;
}

const config: () => RichTextEditorConfig = () => ({
  stylePrefix: 'rte-',
  adjustToolbar: true,
  actions: ['bold', 'italic', 'underline', 'strikethrough', 'link', 'wrap'],
  custom: false,
});

export default config;
```

--------------------------------------------------------------------------------

---[FILE: RichTextEditor.ts]---
Location: grapesjs-dev/packages/core/src/rich_text_editor/model/RichTextEditor.ts

```typescript
// The initial version of this RTE was borrowed from https://github.com/jaredreich/pell
// and adapted to the GrapesJS's need

import { isString } from 'underscore';
import RichTextEditorModule from '..';
import EditorModel from '../../editor/model/Editor';
import { getPointerEvent, off, on } from '../../utils/dom';
import { getComponentModel } from '../../utils/mixins';

export interface RichTextEditorAction {
  name: string;
  icon: string | HTMLElement;
  event?: string;
  attributes?: Record<string, any>;
  result: (rte: RichTextEditor, action: RichTextEditorAction) => void;
  update?: (rte: RichTextEditor, action: RichTextEditorAction) => number;
  state?: (rte: RichTextEditor, doc: Document) => number;
  btn?: HTMLElement;
  currentState?: RichTextEditorActionState;
}

export enum RichTextEditorActionState {
  ACTIVE = 1,
  INACTIVE = 0,
  DISABLED = -1,
}

export interface RichTextEditorOptions {
  actions?: (RichTextEditorAction | string)[];
  classes?: Record<string, string>;
  actionbar?: HTMLElement;
  actionbarContainer?: HTMLElement;
  styleWithCSS?: boolean;
  module?: RichTextEditorModule;
}

type EffectOptions = {
  event?: Event;
};

const RTE_KEY = '_rte';

const btnState = {
  ACTIVE: 1,
  INACTIVE: 0,
  DISABLED: -1,
};
const isValidTag = (rte: RichTextEditor, tagName = 'A') => {
  const { anchorNode, focusNode } = rte.selection() || {};
  const parentAnchor = anchorNode?.parentNode;
  const parentFocus = focusNode?.parentNode;
  return parentAnchor?.nodeName == tagName || parentFocus?.nodeName == tagName;
};

const customElAttr = 'data-selectme';

const defActions: Record<string, RichTextEditorAction> = {
  bold: {
    name: 'bold',
    icon: '<b>B</b>',
    attributes: { title: 'Bold' },
    result: (rte) => rte.exec('bold'),
  },
  italic: {
    name: 'italic',
    icon: '<i>I</i>',
    attributes: { title: 'Italic' },
    result: (rte) => rte.exec('italic'),
  },
  underline: {
    name: 'underline',
    icon: '<u>U</u>',
    attributes: { title: 'Underline' },
    result: (rte) => rte.exec('underline'),
  },
  strikethrough: {
    name: 'strikethrough',
    icon: '<s>S</s>',
    attributes: { title: 'Strike-through' },
    result: (rte) => rte.exec('strikeThrough'),
  },
  link: {
    // eslint-disable-next-line max-len
    icon: `<svg viewBox="0 0 24 24">
          <path fill="currentColor" d="M3.9,12C3.9,10.29 5.29,8.9 7,8.9H11V7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H11V15.1H7C5.29,15.1 3.9,13.71 3.9,12M8,13H16V11H8V13M17,7H13V8.9H17C18.71,8.9 20.1,10.29 20.1,12C20.1,13.71 18.71,15.1 17,15.1H13V17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7Z" />
        </svg>`,
    name: 'link',
    attributes: {
      style: 'font-size:1.4rem;padding:0 4px 2px;',
      title: 'Link',
    },
    state: (rte) => {
      return rte && rte.selection() && isValidTag(rte) ? btnState.ACTIVE : btnState.INACTIVE;
    },
    result: (rte) => {
      if (isValidTag(rte)) {
        rte.exec('unlink');
      } else {
        rte.insertHTML(`<a href="" ${customElAttr}>${rte.selection()}</a>`, {
          select: true,
        });
      }
    },
  },
  wrap: {
    name: 'wrap',
    icon: `<svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M20.71,4.63L19.37,3.29C19,2.9 18.35,2.9 17.96,3.29L9,12.25L11.75,15L20.71,6.04C21.1,5.65 21.1,5 20.71,4.63M7,14A3,3 0 0,0 4,17C4,18.31 2.84,19 2,19C2.92,20.22 4.5,21 6,21A4,4 0 0,0 10,17A3,3 0 0,0 7,14Z" />
        </svg>`,
    attributes: { title: 'Wrap for style' },
    state: (rte) => {
      return rte?.selection() && isValidTag(rte, 'SPAN') ? btnState.DISABLED : btnState.INACTIVE;
    },
    result: (rte) => {
      !isValidTag(rte, 'SPAN') &&
        rte.insertHTML(`<span ${customElAttr}>${rte.selection()}</span>`, {
          select: true,
        });
    },
  },
};

export default class RichTextEditor {
  em: EditorModel;
  settings: RichTextEditorOptions;
  classes!: Record<string, string>;
  actionbar?: HTMLElement;
  actions!: RichTextEditorAction[];
  el!: HTMLElement;
  doc!: Document;
  enabled?: boolean;
  getContent?: () => string;

  constructor(em: EditorModel, el: HTMLElement & { _rte?: RichTextEditor }, settings: RichTextEditorOptions = {}) {
    this.em = em;
    this.settings = settings;

    if (el[RTE_KEY]) {
      return el[RTE_KEY]!;
    }

    el[RTE_KEY] = this;
    this.setEl(el);
    this.updateActiveActions = this.updateActiveActions.bind(this);
    this.__onKeydown = this.__onKeydown.bind(this);
    this.__onPaste = this.__onPaste.bind(this);

    const acts = (settings.actions || []).map((action) => {
      let result = action;
      if (isString(action)) {
        result = { ...defActions[action] };
      } else if (defActions[action.name]) {
        result = { ...defActions[action.name], ...action };
      }
      return result as RichTextEditorAction;
    });
    const actions = acts.length ? acts : Object.keys(defActions).map((a) => defActions[a]);

    settings.classes = {
      actionbar: 'actionbar',
      button: 'action',
      active: 'active',
      disabled: 'disabled',
      inactive: 'inactive',
      ...settings.classes,
    };

    const classes = settings.classes;
    let actionbar = settings.actionbar;
    this.actionbar = actionbar!;
    this.classes = classes;
    this.actions = actions;

    if (!actionbar) {
      if (!this.isCustom(settings.module)) {
        const actionbarCont = settings.actionbarContainer;
        actionbar = document.createElement('div');
        actionbar.className = classes.actionbar;
        actionbarCont?.appendChild(actionbar);
        this.actionbar = actionbar;
      }
      actions.forEach((action) => this.addAction(action));
    }

    settings.styleWithCSS && this.exec('styleWithCSS');
    return this;
  }

  isCustom(module?: RichTextEditorModule) {
    const rte = module || this.em.RichTextEditor;
    return !!(rte?.config.custom || rte?.customRte);
  }

  destroy() {}

  setEl(el: HTMLElement) {
    this.el = el;
    this.doc = el.ownerDocument;
  }

  updateActiveActions() {
    const actions = this.getActions();
    actions.forEach((action) => {
      const { update, btn } = action;
      const { active, inactive, disabled } = this.classes;
      const state = action.state;
      const name = action.name;
      const doc = this.doc;
      let currentState = RichTextEditorActionState.INACTIVE;

      if (btn) {
        btn.className = btn.className.replace(active, '').trim();
        btn.className = btn.className.replace(inactive, '').trim();
        btn.className = btn.className.replace(disabled, '').trim();
      }

      // if there is a state function, which depicts the state,
      // i.e. `active`, `disabled`, then call it
      if (state) {
        const newState = state(this, doc);
        currentState = newState;
        if (btn) {
          switch (newState) {
            case btnState.ACTIVE:
              btn.className += ` ${active}`;
              break;
            case btnState.INACTIVE:
              btn.className += ` ${inactive}`;
              break;
            case btnState.DISABLED:
              btn.className += ` ${disabled}`;
              break;
          }
        }
      } else {
        // otherwise default to checking if the name command is supported & enabled
        if (doc.queryCommandSupported(name) && doc.queryCommandState(name)) {
          btn && (btn.className += ` ${active}`);
          currentState = RichTextEditorActionState.ACTIVE;
        }
      }
      action.currentState = currentState;
      update?.(this, action);
    });

    actions.length && this.em.RichTextEditor.__dbdTrgCustom();
  }

  enable(opts: EffectOptions) {
    if (this.enabled) return this;
    return this.__toggleEffects(true, opts);
  }

  disable() {
    return this.__toggleEffects(false);
  }

  __toggleEffects(enable = false, opts: EffectOptions = {}) {
    const method = enable ? on : off;
    const { el, doc } = this;
    const actionbar = this.actionbarEl();
    actionbar && (actionbar.style.display = enable ? '' : 'none');
    el.contentEditable = `${!!enable}`;
    method(el, 'mouseup keyup', this.updateActiveActions);
    method(doc, 'keydown', this.__onKeydown);
    method(doc, 'paste', this.__onPaste);
    this.enabled = enable;

    if (enable) {
      const { event } = opts;
      this.syncActions();
      this.updateActiveActions();

      if (event) {
        let range = null;

        // Still used as caretPositionFromPoint is not yet well adopted
        if (doc.caretRangeFromPoint) {
          const poiner = getPointerEvent(event);
          range = doc.caretRangeFromPoint(poiner.clientX, poiner.clientY);
          // @ts-ignore for Firefox
        } else if (event.rangeParent) {
          range = doc.createRange();
          // @ts-ignore
          range.setStart(event.rangeParent, event.rangeOffset);
        }

        const sel = doc.getSelection();
        sel?.removeAllRanges();
        range && sel?.addRange(range);
      }

      el.focus();
    }

    return this;
  }

  __onKeydown(ev: KeyboardEvent) {
    const { em } = this;
    const { onKeydown } = em.RichTextEditor.getConfig();

    if (onKeydown) {
      return onKeydown({ ev, rte: this, editor: em.getEditor() });
    }

    const { doc } = this;
    const cmdList = ['insertOrderedList', 'insertUnorderedList'];

    if (ev.key === 'Enter' && !cmdList.some((cmd) => doc.queryCommandState(cmd))) {
      doc.execCommand('insertLineBreak');
      ev.preventDefault();
    }
  }

  __onPaste(ev: ClipboardEvent) {
    const { em } = this;
    const { onPaste } = em.RichTextEditor.getConfig();

    if (onPaste) {
      return onPaste({ ev, rte: this, editor: em.getEditor() });
    }

    const clipboardData = ev.clipboardData!;
    const text = clipboardData.getData('text');
    const textHtml = clipboardData.getData('text/html');

    // Replace \n with <br> in case of a plain text
    if (text && !textHtml) {
      ev.preventDefault();
      const html = text.replace(/(?:\r\n|\r|\n)/g, '<br/>');
      this.doc.execCommand('insertHTML', false, html);
    }
  }

  /**
   * Sync actions with the current RTE
   */
  syncActions() {
    this.getActions().forEach((action) => {
      if (this.actionbar) {
        if (!action.state || (action.state && action.state(this, this.doc) >= 0)) {
          const event = action.event || 'click';
          const { btn } = action;
          if (btn) {
            (btn as any)[`on${event}`] = () => {
              action.result(this, action);
              this.updateActiveActions();
            };
          }
        }
      }
    });
  }

  /**
   * Add new action to the actionbar
   * @param {Object} action
   * @param {Object} [opts={}]
   */
  addAction(action: RichTextEditorAction, opts: { sync?: boolean } = {}) {
    const { sync } = opts;
    const actionbar = this.actionbarEl();

    if (actionbar) {
      const { icon, attributes: attr = {} } = action;
      const btn = document.createElement('span');
      btn.className = this.classes.button;
      action.btn = btn;

      for (let key in attr) {
        btn.setAttribute(key, attr[key]);
      }

      if (typeof icon == 'string') {
        btn.innerHTML = icon;
      } else {
        btn.appendChild(icon);
      }

      actionbar.appendChild(btn);
    }

    if (sync) {
      this.actions.push(action);
      this.syncActions();
    }
  }

  /**
   * Get the array of current actions
   * @return {Array}
   */
  getActions() {
    return this.actions;
  }

  /**
   * Returns the Selection instance
   * @return {Selection}
   */
  selection() {
    return this.doc.getSelection();
  }

  /**
   * Wrapper around [execCommand](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand) to allow
   * you to perform operations like `insertText`
   * @param  {string} command Command name
   * @param  {any} [value=null Command's arguments
   */
  exec(command: string, value?: string) {
    this.doc.execCommand(command, false, value);
  }

  /**
   * Get the actionbar element
   * @return {HTMLElement}
   */
  actionbarEl() {
    return this.actionbar;
  }

  /**
   * Set custom HTML to the selection, useful as the default 'insertHTML' command
   * doesn't work in the same way on all browsers
   * @param  {string} value HTML string
   */
  insertHTML(value: string | HTMLElement, { select }: { select?: boolean } = {}) {
    const { em, doc, el } = this;
    const sel = doc.getSelection();

    if (sel && sel.rangeCount) {
      const model = getComponentModel(el) || em.getSelected();
      const node = doc.createElement('div');
      const range = sel.getRangeAt(0);
      range.deleteContents();

      if (isString(value)) {
        node.innerHTML = value;
      } else if (value) {
        node.appendChild(value);
      }

      Array.prototype.slice.call(node.childNodes).forEach((nd) => {
        range.insertNode(nd);
      });

      sel.removeAllRanges();
      sel.addRange(range);
      el.focus();

      if (select && model) {
        model.once('rte:disable', () => {
          const toSel = model.find(`[${customElAttr}]`)[0];
          if (!toSel) return;
          em.setSelected(toSel);
          toSel.removeAttributes(customElAttr);
        });
        model.trigger('disable');
      }
    }
  }
}
```

--------------------------------------------------------------------------------

````
