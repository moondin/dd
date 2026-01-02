---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 54
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 54 of 97)

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
Location: grapesjs-dev/packages/core/src/panels/index.ts

```typescript
/**
 * You can customize the initial state of the module from the editor initialization, by passing the following [Configuration Object](https://github.com/GrapesJS/grapesjs/blob/master/src/panels/config/config.ts)
 * ```js
 * const editor = grapesjs.init({
 *  panels: {
 *    // options
 *  }
 * })
 * ```
 *
 * Once the editor is instantiated you can use its API. Before using these methods you should get the module from the instance
 *
 * ```js
 * const panelManager = editor.Panels;
 * ```
 *
 * * [addPanel](#addpanel)
 * * [addButton](#addbutton)
 * * [getButton](#getbutton)
 * * [getPanel](#getpanel)
 * * [getPanels](#getpanels)
 * * [getPanelsEl](#getpanelsel)
 * * [removePanel](#removepanel)
 * * [removeButton](#removebutton)
 *
 * @module Panels
 */
import { Module } from '../abstract';
import EditorModel from '../editor/model/Editor';
import defConfig, { PanelsConfig } from './config/config';
import Panel, { PanelProperties } from './model/Panel';
import Panels from './model/Panels';
import PanelsView from './view/PanelsView';

export default class PanelManager extends Module<PanelsConfig> {
  panels: Panels;
  PanelsViewObj?: PanelsView;

  /**
   * Initialize module. Automatically called with a new instance of the editor
   * @param {Object} config Configurations
   * @private
   */
  constructor(em: EditorModel) {
    super(em, 'Panels', defConfig());
    this.panels = new Panels(this, this.config.defaults!);
  }

  /**
   * Returns the collection of panels
   * @return {Collection} Collection of panel
   */
  getPanels() {
    return this.panels;
  }

  /**
   * Returns panels element
   * @return {HTMLElement}
   */
  getPanelsEl() {
    return this.PanelsViewObj?.el;
  }

  /**
   * Add new panel to the collection
   * @param {Object|Panel} panel Object with right properties or an instance of Panel
   * @return {Panel} Added panel. Useful in case passed argument was an Object
   * @example
   * const newPanel = panelManager.addPanel({
   *  id: 'myNewPanel',
   *  visible: true,
   *  buttons: [...],
   * });
   */
  addPanel(panel: Panel | PanelProperties) {
    return this.panels.add(panel as Panel);
  }

  /**
   * Remove a panel from the collection
   * @param {Panel|String} panel Panel instance or panel id
   * @return {Panel} Removed panel
   * @example
   * const somePanel = panelManager.getPanel('somePanel');
   * const removedPanel = panelManager.removePanel(somePanel);
   *
   * // or by id
   * const removedPanel = panelManager.removePanel('myNewPanel');
   *
   */
  removePanel(panel: Panel | string) {
    return this.panels.remove(panel);
  }

  /**
   * Get panel by ID
   * @param  {string} id Id string
   * @return {Panel|null}
   * @example
   * const myPanel = panelManager.getPanel('myPanel');
   */
  getPanel(id: string) {
    const res = this.panels.where({ id });
    return res.length ? res[0] : null;
  }

  /**
   * Add button to the panel
   * @param {string} panelId Panel's ID
   * @param {Object|Button} button Button object or instance of Button
   * @return {Button|null} Added button. Useful in case passed button was an Object
   * @example
   * const newButton = panelManager.addButton('myNewPanel',{
   *   id: 'myNewButton',
   *   className: 'someClass',
   *   command: 'someCommand',
   *   attributes: { title: 'Some title'},
   *   active: false,
   * });
   * // It's also possible to pass the command as an object
   * // with .run and .stop methods
   * ...
   * command: {
   *   run: function(editor) {
   *     ...
   *   },
   *   stop: function(editor) {
   *     ...
   *   }
   * },
   * // Or simply like a function which will be evaluated as a single .run command
   * ...
   * command: function(editor) {
   *   ...
   * }
   */
  addButton(panelId: string, button: any) {
    const pn = this.getPanel(panelId);
    return pn ? pn.buttons.add(button) : null;
  }

  /**
   * Remove button from the panel
   * @param {String} panelId Panel's ID
   * @param {String} buttonId Button's ID
   * @return {Button|null} Removed button.
   * @example
   * const removedButton = panelManager.addButton('myNewPanel',{
   *   id: 'myNewButton',
   *   className: 'someClass',
   *   command: 'someCommand',
   *   attributes: { title: 'Some title'},
   *   active: false,
   * });
   *
   * const removedButton = panelManager.removeButton('myNewPanel', 'myNewButton');
   *
   */
  removeButton(panelId: string, button: any) {
    const pn = this.getPanel(panelId);
    return pn && pn.buttons.remove(button);
  }

  /**
   * Get button from the panel
   * @param {string} panelId Panel's ID
   * @param {string} id Button's ID
   * @return {Button|null}
   * @example
   * const button = panelManager.getButton('myPanel', 'myButton');
   */
  getButton(panelId: string, id: string) {
    const pn = this.getPanel(panelId);
    if (pn) {
      const res = pn.buttons.where({ id });
      return res.length ? res[0] : null;
    }
    return null;
  }

  /**
   * Render panels and buttons
   * @return {HTMLElement}
   * @private
   */
  render() {
    this.PanelsViewObj?.remove();
    this.PanelsViewObj = new PanelsView(this.panels);
    return this.PanelsViewObj.render().el;
  }

  /**
   * Active activable buttons
   * @private
   */
  active() {
    this.getPanels().each((p) => {
      p.buttons.each((btn) => {
        btn.get('active') && btn.trigger('updateActive');
      });
    });
  }

  /**
   * Disable buttons flagged as disabled
   * @private
   */
  disableButtons() {
    this.getPanels().each((p) => {
      p.buttons.each((btn) => {
        if (btn.get('disable')) btn.trigger('change:disable');
      });
    });
  }

  destroy() {
    this.panels.reset();
    this.panels.stopListening();
    this.PanelsViewObj && this.PanelsViewObj.remove();
  }
}
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: grapesjs-dev/packages/core/src/panels/config/config.ts

```typescript
import { PanelProperties } from '../model/Panel';

const swv = 'sw-visibility';
const expt = 'export-template';
const osm = 'open-sm';
const otm = 'open-tm';
const ola = 'open-layers';
const obl = 'open-blocks';
const ful = 'fullscreen';
const prv = 'preview';

interface ButtonProps {
  id?: string;
  active?: boolean;
  label?: string;
  togglable?: boolean;
  className?: string;
  command?: string | (() => any);
  context?: string;
  attributes?: Record<string, any>;
}

interface PanelProps extends Omit<PanelProperties, 'id' | 'buttons'> {
  id?: string;
  buttons?: ButtonProps[];
}

export interface PanelsConfig {
  stylePrefix?: string;

  /**
   * Default panels.
   */
  defaults?: PanelProps[];
}

const config: () => PanelsConfig = () => ({
  stylePrefix: 'pn-',
  defaults: [
    {
      id: 'commands',
      buttons: [{}],
    },
    {
      id: 'options',
      buttons: [
        {
          active: true,
          id: swv,
          className: 'fa fa-square-o',
          command: 'core:component-outline',
          context: swv,
          attributes: { title: 'View components' },
        },
        {
          id: prv,
          className: 'fa fa-eye',
          command: prv,
          context: prv,
          attributes: { title: 'Preview' },
        },
        {
          id: ful,
          className: 'fa fa-arrows-alt',
          command: ful,
          context: ful,
          attributes: { title: 'Fullscreen' },
        },
        {
          id: expt,
          className: 'fa fa-code',
          command: expt,
          attributes: { title: 'View code' },
        },
      ],
    },
    {
      id: 'views',
      buttons: [
        {
          id: osm,
          className: 'fa fa-paint-brush',
          command: osm,
          active: true,
          togglable: false,
          attributes: { title: 'Open Style Manager' },
        },
        {
          id: otm,
          className: 'fa fa-cog',
          command: otm,
          togglable: false,
          attributes: { title: 'Settings' },
        },
        {
          id: ola,
          className: 'fa fa-bars',
          command: ola,
          togglable: false,
          attributes: { title: 'Open Layer Manager' },
        },
        {
          id: obl,
          className: 'fa fa-th-large',
          command: obl,
          togglable: false,
          attributes: { title: 'Open Blocks' },
        },
      ],
    },
  ],
});

export default config;
```

--------------------------------------------------------------------------------

---[FILE: Button.ts]---
Location: grapesjs-dev/packages/core/src/panels/model/Button.ts

```typescript
import PanelManager from '..';
import { ModuleModel } from '../../abstract';
import Buttons from './Buttons';

export default class Button extends ModuleModel<PanelManager> {
  defaults() {
    return {
      id: '',
      label: '',
      tagName: 'span',
      className: '',
      command: '',
      context: '',
      buttons: [],
      attributes: {},
      options: {},
      active: false,
      dragDrop: false,
      togglable: true,
      runDefaultCommand: true,
      stopDefaultCommand: false,
      disable: false,
    };
  }

  get className(): string {
    return this.get('className');
  }

  get command(): string {
    return this.get('command');
  }

  get active(): boolean {
    return this.get('active');
  }
  set active(isActive: boolean) {
    this.set('active', isActive);
  }

  get togglable(): boolean {
    return this.get('togglable');
  }

  get runDefaultCommand(): boolean {
    return this.get('runDefaultCommand');
  }
  get stopDefaultCommand(): boolean {
    return this.get('stopDefaultCommand');
  }
  get disable(): boolean {
    return this.get('disable');
  }

  constructor(module: PanelManager, options: any) {
    super(module, options);
    if (this.get('buttons').length) {
      this.set('buttons', new Buttons(this.module, this.get('buttons')));
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: Buttons.ts]---
Location: grapesjs-dev/packages/core/src/panels/model/Buttons.ts

```typescript
import PanelManager from '..';
import { ModuleCollection } from '../../abstract';
import Button from './Button';

export default class Buttons extends ModuleCollection<Button> {
  constructor(module: PanelManager, models: Button[]) {
    super(module, models, Button);
  }
  /**
   * Deactivate all buttons, except one passed
   * @param  {Object}  except  Model to ignore
   * @param  {Boolean}  r     Recursive flag
   *
   * @return  void
   * */
  deactivateAllExceptOne(except: Button, r: boolean) {
    this.forEach((model, index) => {
      if (model !== except) {
        model.set('active', false);
        if (r && model.get('buttons').length) model.get('buttons').deactivateAllExceptOne(except, r);
      }
    });
  }

  /**
   * Deactivate all buttons
   * @param  {String}  ctx Context string
   *
   * @return  void
   * */
  deactivateAll(ctx?: string, sender?: any) {
    const context = ctx || '';
    this.forEach((model) => {
      if (model.get('context') == context && model !== sender) {
        //@ts-ignore
        model.set('active', false, { fromCollection: true });
      }
    });
  }

  /**
   * Disables all buttons
   * @param  {String}  ctx Context string
   *
   * @return  void
   * */
  disableAllButtons(ctx?: string) {
    var context = ctx || '';
    this.forEach((model, index) => {
      if (model.get('context') == context) {
        model.set('disable', true);
      }
    });
  }

  /**
   * Disables all buttons, except one passed
   * @param  {Object}  except  Model to ignore
   * @param  {Boolean}  r     Recursive flag
   *
   * @return  void
   * */
  disableAllButtonsExceptOne(except: Button, r: boolean) {
    this.forEach((model, index) => {
      if (model !== except) {
        model.set('disable', true);
        if (r && model.get('buttons').length) model.get('buttons').disableAllButtonsExceptOne(except, r);
      }
    });
  }
}

Buttons.prototype.model = Button;
```

--------------------------------------------------------------------------------

---[FILE: Panel.ts]---
Location: grapesjs-dev/packages/core/src/panels/model/Panel.ts

```typescript
import PanelManager from '..';
import { ModuleModel } from '../../abstract';
import { ObjectAny } from '../../common';
import { ResizerOptions } from '../../utils/Resizer';
import Buttons from './Buttons';

/** @private */
export interface PanelProperties {
  /**
   * Panel id.
   */
  id: string;

  /**
   * Panel content.
   */
  content?: string;

  /**
   * Panel visibility.
   * @default true
   */
  visible?: boolean;

  /**
   * Panel buttons.
   * @default []
   */
  buttons?: ObjectAny[];

  /**
   * Panel attributes.
   * @default {}
   */
  attributes?: ObjectAny;

  /**
   * Specify element query where to append the panel
   */
  appendTo?: string;

  /**
   * Resizable options.
   */
  resizable?: boolean | ResizerOptions;

  el?: string;

  appendContent?: HTMLElement;
}

export interface PanelPropertiesDefined extends Omit<Required<PanelProperties>, 'buttons'> {
  buttons: Buttons;
  [key: string]: unknown;
}

export default class Panel extends ModuleModel<PanelManager, PanelPropertiesDefined> {
  defaults() {
    return {
      id: '',
      content: '',
      visible: true,
      buttons: [] as unknown as Buttons,
      attributes: {},
    };
  }

  get buttons() {
    return this.get('buttons')!;
  }

  private set buttons(buttons: Buttons) {
    this.set('buttons', buttons);
  }

  view?: any;

  constructor(module: PanelManager, options: PanelProperties) {
    super(module, options as unknown as PanelPropertiesDefined);
    const btn = this.get('buttons') || [];
    this.buttons = new Buttons(module, btn as any);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: Panels.ts]---
Location: grapesjs-dev/packages/core/src/panels/model/Panels.ts

```typescript
import PanelManager from '..';
import { ModuleCollection } from '../../abstract';
import Panel from './Panel';

export default class Panels extends ModuleCollection<Panel> {
  constructor(module: PanelManager, models: Panel[] | Array<Record<string, any>>) {
    super(module, models, Panel);
  }
}

Panels.prototype.model = Panel;
```

--------------------------------------------------------------------------------

---[FILE: ButtonsView.ts]---
Location: grapesjs-dev/packages/core/src/panels/view/ButtonsView.ts

```typescript
import { result } from 'underscore';
import { ModuleView } from '../../abstract';
import Button from '../model/Button';
import Buttons from '../model/Buttons';
import ButtonView from './ButtonView';

export default class ButtonsView extends ModuleView<Buttons> {
  constructor(collection: Buttons) {
    super({ collection });
    this.listenTo(this.collection, 'add', this.addTo);
    this.listenTo(this.collection, 'reset remove', this.render);
    this.className = this.pfx + 'buttons';
  }

  /**
   * Add to collection
   * @param Object Model
   *
   * @return Object
   * */
  private addTo(model: Button) {
    this.addToCollection(model);
  }

  /**
   * Add new object to collection
   * @param  Object  Model
   * @param  Object   Fragment collection
   *
   * @return Object Object created
   * */
  private addToCollection(model: Button, fragmentEl?: DocumentFragment) {
    const fragment = fragmentEl || null;
    const el = model.get('el');
    const view = new ButtonView({
      el,
      model,
    });
    const rendered = view.render().el;

    if (fragment) {
      fragment.appendChild(rendered);
    } else {
      this.$el.append(rendered);
    }

    return rendered;
  }

  public render() {
    var fragment = document.createDocumentFragment();
    this.$el.empty();

    this.collection.each((model) => this.addToCollection(model, fragment));

    this.$el.append(fragment);
    this.$el.attr('class', result(this, 'className'));
    return this;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ButtonView.ts]---
Location: grapesjs-dev/packages/core/src/panels/view/ButtonView.ts

```typescript
import { isString, isObject, isFunction } from 'underscore';
import { ModuleView } from '../../abstract';
import Button from '../model/Button';
import Buttons from '../model/Buttons';

export default class ButtonView extends ModuleView<Button> {
  //@ts-ignore
  tagName() {
    return this.model.get('tagName');
  }

  events() {
    return {
      click: 'clicked',
    };
  }

  commands: any;
  activeCls: string;
  disableCls: string;
  btnsVisCls: string;

  //Note: I don't think this is working
  $buttons?: any;

  constructor(o: any) {
    super(o);
    const { model, em, pfx, ppfx } = this;
    const cls = model.className;
    const { command, listen } = model.attributes;

    this.id = pfx + model.get('id');
    this.activeCls = `${pfx}active ${ppfx}four-color`;
    this.disableCls = `${ppfx}disabled`;
    this.btnsVisCls = `${pfx}visible`;
    this.className = pfx + 'btn' + (cls ? ' ' + cls : '');
    this.listenTo(model, 'change', this.render);
    this.listenTo(model, 'change:active updateActive', this.updateActive);
    this.listenTo(model, 'checkActive', this.checkActive);
    this.listenTo(model, 'change:bntsVis', this.updateBtnsVis);
    this.listenTo(model, 'change:attributes', this.updateAttributes);
    this.listenTo(model, 'change:className', this.updateClassName);
    this.listenTo(model, 'change:disable', this.updateDisable);

    if (em && isString(command) && listen) {
      const chnOpt: any = { fromListen: true };
      this.listenTo(em, `run:${command}`, () => model.set('active', true, chnOpt));
      this.listenTo(em, `stop:${command}`, () => model.set('active', false, chnOpt));
    }

    if (em && em.get) this.commands = em.get('Commands');
  }

  /**
   * Updates class name of the button
   *
   * @return   void
   * */
  private updateClassName() {
    const { model, pfx } = this;
    const cls = model.className;
    const attrCls = model.get('attributes').class;
    const classStr = `${attrCls ? attrCls : ''} ${pfx}btn ${cls ? cls : ''}`;
    this.$el.attr('class', classStr.trim());
  }

  /**
   * Updates attributes of the button
   *
   * @return   void
   * */
  private updateAttributes() {
    const { em, model, $el } = this;
    const attr = model.get('attributes') || {};
    const title = em && em.t && em.t(`panels.buttons.titles.${model.id}`);
    $el.attr(attr);
    title && $el.attr({ title });

    this.updateClassName();
  }

  /**
   * Updates visibility of children buttons
   *
   * @return  void
   * */
  private updateBtnsVis() {
    if (!this.$buttons) return;

    if (this.model.get('bntsVis')) this.$buttons.addClass(this.btnsVisCls);
    else this.$buttons.removeClass(this.btnsVisCls);
  }

  /**
   * Update active status of the button
   *
   * @return   void
   * */
  private updateActive(m: any, v: any, opts: any = {}) {
    const { model, commands, $el, activeCls } = this;
    const { fromCollection, fromListen } = opts;
    const context = model.get('context');
    const options = model.get('options');
    const commandName = model.command;
    let command = {};

    if (!commandName) return;

    if (commands && isString(commandName)) {
      command = commands.get(commandName) || {};
    } else if (isFunction(commandName)) {
      command = commands.create({ run: commandName });
    } else if (commandName !== null && isObject(commandName)) {
      command = commands.create(commandName);
    }

    if (model.active) {
      !fromCollection && (model.collection as Buttons)?.deactivateAll(context, model);
      model.set('active', true, { silent: true }).trigger('checkActive');
      !fromListen && commands.runCommand(command, { ...options, sender: model });

      // Disable button if the command has no stop method
      //@ts-ignore
      command.noStop && model.set('active', false);
    } else {
      $el.removeClass(activeCls);
      !fromListen && commands.stopCommand(command, { ...options, sender: model, force: 1 });
    }
  }

  updateDisable() {
    const { disableCls, model } = this;
    const disable = model.disable;
    this.$el[disable ? 'addClass' : 'removeClass'](disableCls);
  }

  /**
   * Update active style status
   *
   * @return   void
   * */
  checkActive() {
    const { model, $el, activeCls } = this;
    model.active ? $el.addClass(activeCls) : $el.removeClass(activeCls);
  }

  /**
   * Triggered when button is clicked
   * @return   void
   * */
  clicked() {
    const { model } = this;

    if (model.get('bntsVis') || model.disable || !model.command) return;

    this.toggleActive();
  }

  private toggleActive() {
    const { model, em } = this;
    const { active, togglable } = model;

    if (active && !togglable) return;

    model.active = !active;

    // If the stop is requested
    if (active) {
      if (model.runDefaultCommand) em.runDefault();
    } else {
      if (model.stopDefaultCommand) em.stopDefault();
    }
  }

  public render() {
    const { model } = this;
    const label = model.get('label');
    const { $el } = this;
    !model.get('el') && $el.empty();
    this.updateAttributes();
    label && $el.append(label);
    this.checkActive();
    this.updateDisable();

    return this;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: PanelsView.ts]---
Location: grapesjs-dev/packages/core/src/panels/view/PanelsView.ts

```typescript
import { ModuleView } from '../../abstract';
import Panel from '../model/Panel';
import Panels from '../model/Panels';
import PanelView from './PanelView';

export default class PanelsView extends ModuleView<Panels> {
  constructor(target: Panels) {
    super({ collection: target });
    this.listenTo(target, 'add', this.addTo);
    this.listenTo(target, 'reset', this.render);
    this.listenTo(target, 'remove', this.onRemove);
    this.className = this.pfx + 'panels';
  }

  private onRemove(model: Panel) {
    const view = model.view;
    view && view.remove();
  }

  /**
   * Add to collection
   * @param Object Model
   *
   * @return Object
   * @private
   * */
  private addTo(model: Panel) {
    this.addToCollection(model);
  }

  /**
   * Add new object to collection
   * @param  Object  Model
   * @param  Object   Fragment collection
   * @param  integer  Index of append
   *
   * @return Object Object created
   * @private
   * */
  private addToCollection(model: Panel, fragmentEl?: DocumentFragment) {
    const fragment = fragmentEl || null;
    const el = model.get('el');
    const view = new PanelView(model);
    const rendered = view.render().el;
    const appendTo = model.get('appendTo');

    // Do nothing if the panel was requested to be another element
    if (el) {
    } else if (appendTo) {
      const appendEl = document.querySelector(appendTo);
      appendEl?.appendChild(rendered);
    } else {
      if (fragment) {
        fragment.appendChild(rendered);
      } else {
        this.$el.append(rendered);
      }
    }

    view.initResize();
    return rendered;
  }

  public render() {
    const $el = this.$el;
    const frag = document.createDocumentFragment();
    $el.empty();
    this.collection.each((model) => this.addToCollection(model, frag));
    $el.append(frag);
    $el.attr('class', this.className);
    return this;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: PanelView.ts]---
Location: grapesjs-dev/packages/core/src/panels/view/PanelView.ts

```typescript
import { ModuleView } from '../../abstract';
import Resizer from '../../utils/Resizer';
import Panel from '../model/Panel';
import ButtonsView from './ButtonsView';

export default class PanelView extends ModuleView<Panel> {
  constructor(model: Panel) {
    super({ model, el: model.get('el') as string });
    this.className = this.pfx + 'panel';
    this.id = this.pfx + model.get('id');
    this.listenTo(model, 'change:appendContent', this.appendContent);
    this.listenTo(model, 'change:content', this.updateContent);
    this.listenTo(model, 'change:visible', this.toggleVisible);
    model.view = this;
  }

  /**
   * Append content of the panel
   * */
  appendContent() {
    this.$el.append(this.model.get('appendContent')!);
  }

  /**
   * Update content
   * */
  updateContent() {
    this.$el.html(this.model.get('content')!);
  }

  toggleVisible() {
    if (!this.model.get('visible')) {
      this.$el.addClass(`${this.ppfx}hidden`);
      return;
    }
    this.$el.removeClass(`${this.ppfx}hidden`);
  }

  //@ts-ignore
  attributes() {
    return this.model.get('attributes');
  }

  initResize() {
    const { em } = this;
    const editor = em?.Editor;
    const resizable = this.model.get('resizable');

    if (editor && resizable) {
      const resz = resizable === true ? [true, true, true, true] : resizable;
      const resLen = (resz as boolean[]).length;
      let tc,
        cr,
        bc,
        cl = false;

      // Choose which sides of the panel are resizable
      if (resLen == 2) {
        const resBools = resz as boolean[];
        tc = resBools[0];
        bc = resBools[0];
        cr = resBools[1];
        cl = resBools[1];
      } else if (resLen == 4) {
        const resBools = resz as boolean[];
        tc = resBools[0];
        cr = resBools[1];
        bc = resBools[2];
        cl = resBools[3];
      }

      const resizer: Resizer = new editor.Utils.Resizer({
        tc,
        cr,
        bc,
        cl,
        tl: false,
        tr: false,
        bl: false,
        br: false,
        appendTo: this.el,
        silentFrames: true,
        avoidContainerUpdate: true,
        prefix: editor.getConfig().stylePrefix,
        onEnd() {
          em.Canvas.refresh({ all: true });
        },
        posFetcher: (el: HTMLElement, { target }: any) => {
          const style = el.style as any;
          const config = resizer.getConfig();
          const keyWidth = config.keyWidth!;
          const keyHeight = config.keyHeight!;
          const rect = el.getBoundingClientRect();
          const forContainer = target == 'container';
          const styleWidth = style[keyWidth];
          const styleHeight = style[keyHeight];
          const width = styleWidth && !forContainer ? parseFloat(styleWidth) : rect.width;
          const height = styleHeight && !forContainer ? parseFloat(styleHeight) : rect.height;
          return {
            left: 0,
            top: 0,
            width,
            height,
          };
        },
        ...(resizable && typeof resizable !== 'boolean' ? resizable : {}),
      });
      resizer.blur = () => {};
      resizer.focus(this.el);
    }
  }

  render() {
    const { buttons } = this.model;
    const $el = this.$el;
    const ppfx = this.ppfx;
    const cls = `${this.className} ${this.id} ${ppfx}one-bg ${ppfx}two-color`;
    $el.addClass(cls);

    this.toggleVisible();

    if (buttons.length) {
      var buttonsView = new ButtonsView(buttons);
      $el.append(buttonsView.render().el);
    }

    $el.append(this.model.get('content')!);
    return this;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: grapesjs-dev/packages/core/src/parser/index.ts

```typescript
/**
 * You can customize the initial state of the module from the editor initialization, by passing the following [Configuration Object](https://github.com/GrapesJS/grapesjs/blob/master/src/parser/config/config.ts)
 * ```js
 * const editor = grapesjs.init({
 *  parser: {
 *    // options
 *  }
 * })
 * ```
 *
 * Once the editor is instantiated you can use its API. Before using these methods you should get the module from the instance
 *
 * ```js
 * const { Parser } = editor;
 * ```
 *
 * {REPLACE_EVENTS}
 *
 * ## Methods
 * * [getConfig](#getconfig)
 * * [parseHtml](#parsehtml)
 * * [parseCss](#parsecss)
 *
 * @module Parser
 */
import { Module } from '../abstract';
import { ObjectAny } from '../common';
import EditorModel from '../editor/model/Editor';
import defConfig, { HTMLParserOptions, ParserConfig } from './config/config';
import ParserCss from './model/ParserCss';
import ParserHtml from './model/ParserHtml';
import { ParserEvents } from './types';

export default class ParserModule extends Module<ParserConfig & { name?: string }> {
  parserHtml: ReturnType<typeof ParserHtml>;
  parserCss: ReturnType<typeof ParserCss>;
  events = ParserEvents;

  constructor(em: EditorModel) {
    super(em, 'Parser', defConfig());
    const { config } = this;
    this.parserCss = ParserCss(em, config);
    this.parserHtml = ParserHtml(em, config);
  }

  /**
   * Get configuration object
   * @name getConfig
   * @function
   * @return {Object}
   */

  /**
   * Parse HTML string and return the object containing the Component Definition
   * @param  {String} input HTML string to parse
   * @param  {Object} [options] Options
   * @param  {String} [options.htmlType] [HTML mime type](https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString#Argument02) to parse
   * @param  {Boolean} [options.allowScripts=false] Allow `<script>` tags
   * @param  {Boolean} [options.allowUnsafeAttr=false] Allow unsafe HTML attributes (eg. `on*` inline event handlers)
   * @param  {Boolean} [options.allowUnsafeAttrValue=false] Allow unsafe HTML attribute values (eg. `src="javascript:..."`)
   * @param  {Boolean} [options.keepEmptyTextNodes=false] Keep whitespaces regardless of whether they are meaningful
   * @param  {Boolean} [options.asDocument] Treat the HTML string as document
   * @param  {Boolean|Function} [options.detectDocument] Indicate if or how to detect if the HTML string should be treated as document
   * @param  {Function} [options.preParser] How to pre-process the HTML string before parsing
   * @param  {Boolean} [options.convertDataGjsAttributesHyphens=false] Convert `data-gjs-*` attributes from hyphenated to camelCase (eg. `data-gjs-my-component` to `data-gjs-myComponent`)
   * @returns {Object} Object containing the result `{ html: ..., css: ... }`
   * @example
   * const resHtml = Parser.parseHtml(`<table><div>Hi</div></table>`, {
   *   htmlType: 'text/html', // default
   * });
   * // By using the `text/html`, this will fix automatically all the HTML syntax issues
   * // Indeed the final representation, in this case, will be `<div>Hi</div><table></table>`
   * const resXml = Parser.parseHtml(`<table><div>Hi</div></table>`, {
   *   htmlType: 'application/xml',
   * });
   * // This will preserve the original format as, from the XML point of view, is a valid format
   */
  parseHtml(input: string, options: HTMLParserOptions = {}) {
    const { em, parserHtml } = this;
    parserHtml.compTypes = em.Components.getTypes() || [];
    return parserHtml.parse(input, this.parserCss, options);
  }

  /**
   * Parse CSS string and return an array of valid definition objects for CSSRules
   * @param  {String} input CSS string to parse
   * @returns {Array<Object>} Array containing the result
   * @example
   * const res = Parser.parseCss('.cls { color: red }');
   * // [{ ... }]
   */
  parseCss(input: string) {
    return this.parserCss.parse(input);
  }

  __emitEvent(event: string, data: ObjectAny) {
    const { em, events } = this;
    em.trigger(event, data);
    em.trigger(events.all, { event, ...data });
  }

  destroy() {}
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: grapesjs-dev/packages/core/src/parser/types.ts

```typescript
/**{START_EVENTS}*/
export enum ParserEvents {
  /**
   * @event `parse:html` On HTML parse, an object containing the input and the output of the parser is passed as an argument.
   * @example
   * editor.on('parse:html', ({ input, output }) => { ... });
   */
  html = 'parse:html',
  htmlRoot = 'parse:html:root',

  /**
   * @event `parse:html:before` Event triggered before the HTML parsing starts. An object containing the input is passed as an argument.
   * @example
   * editor.on('parse:html:before', (options) => {
   *   console.log('Parser input', options.input);
   *   // You can also process the input and update `options.input`
   *   options.input += '<div>Extra content</div>';
   * });
   */
  htmlBefore = 'parse:html:before',

  /**
   * @event `parse:css` On CSS parse, an object containing the input and the output of the parser is passed as an argument.
   * @example
   * editor.on('parse:css', ({ input, output }) => { ... });
   */
  css = 'parse:css',

  /**
   * @event `parse:css:before` Event triggered before the CSS parsing starts. An object containing the input is passed as an argument.
   * @example
   * editor.on('parse:css:before', (options) => {
   *   console.log('Parser input', options.input);
   *   // You can also process the input and update `options.input`
   *   options.input += '.my-class { color: red; }';
   * });
   */
  cssBefore = 'parse:css:before',

  /**
   * @event `parse` Catch-all event for all the events mentioned above. An object containing all the available data about the triggered event is passed as an argument to the callback.
   * @example
   * editor.on('parse', ({ event, ... }) => { ... });
   */
  all = 'parse',
}
/**{END_EVENTS}*/

// need this to avoid the TS documentation generator to break
export default ParserEvents;
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: grapesjs-dev/packages/core/src/parser/config/config.ts

```typescript
import { OptionAsDocument } from '../../common';
import { CssRuleJSON } from '../../css_composer/model/CssRule';
import { ComponentDefinitionDefined } from '../../dom_components/model/types';
import Editor from '../../editor';

export interface ParsedCssRule {
  selectors: string | string[];
  style: Record<string, string>;
  atRule?: string;
  params?: string;
}

export type CustomParserCss = (input: string, editor: Editor) => ParsedCssRule[];

export type CustomParserHtml = (input: string, options: HTMLParserOptions) => HTMLElement;

export interface HTMLParseResult {
  html: ComponentDefinitionDefined | ComponentDefinitionDefined[];
  css?: CssRuleJSON[];
  doctype?: string;
  root?: ComponentDefinitionDefined;
  head?: ComponentDefinitionDefined;
}

export interface ParseNodeOptions extends HTMLParserOptions {
  inSvg?: boolean;
  skipChildren?: boolean;
}

export interface HTMLParserOptions extends OptionAsDocument {
  /**
   * DOMParser mime type.
   * If you use the `text/html` parser, it will fix the invalid syntax automatically.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString
   * @default 'text/html'
   */
  htmlType?: DOMParserSupportedType;

  /**
   * Allow <script> tags.
   * @default false
   */
  allowScripts?: boolean;

  /**
   * Allow unsafe HTML attributes (eg. `on*` inline event handlers).
   * @default false
   */
  allowUnsafeAttr?: boolean;

  /**
   * Allow unsafe HTML attribute values (eg. `src="javascript:..."`).
   * @default false
   */
  allowUnsafeAttrValue?: boolean;

  /**
   * When false, removes empty text nodes when parsed, unless they contain a space.
   * @default false
   */
  keepEmptyTextNodes?: boolean;

  /**
   * Indicate if or how to detect if the passed HTML string should be parsed as a document.
   */
  detectDocument?: boolean | ((html: string) => boolean);

  /**
   * Custom transformer to run before passing the input HTML to the parser.
   * A common use case might be to sanitize the input string.
   * @example
   * preParser: htmlString => DOMPurify.sanitize(htmlString)
   */
  preParser?: (input: string, opts: { editor: Editor }) => string;

  /**
   * Configures whether `data-gjs-*` attributes should be automatically converted from hyphenated to camelCase.
   *
   * When `true`:
   * - Hyphenated `data-gjs-*` attributes (e.g., `data-gjs-my-component`) are transformed into camelCase (`data-gjs-myComponent`).
   * - If `defaults` contains the camelCase version and not the original attribute, the camelCase will be used; otherwise, the original name is kept.
   *
   * @default false
   */
  convertDataGjsAttributesHyphens?: boolean;
}

export interface ParserConfig {
  /**
   * Let the editor know which HTML tags should be treated as part of the text component.
   * @default ['br', 'b', 'i', 'u', 'a', 'ul', 'ol']
   */
  textTags?: string[];

  /**
   * Let the editor know which Component types should be treated as part of the text component.
   * @default ['text', 'textnode', 'comment']
   */
  textTypes?: string[];

  /**
   * Custom CSS parser.
   * @see https://grapesjs.com/docs/guides/Custom-CSS-parser.html
   */
  parserCss?: CustomParserCss;

  /**
   * Custom HTML parser.
   * At the moment, the custom HTML parser should rely on DOM Node instance as the result.
   * @example
   * // The return should be an instance of an Node as the root to traverse
   * // https://developer.mozilla.org/en-US/docs/Web/API/Node
   * // Here the result will be XMLDocument, which extends Node.
   * parserHtml: (input, opts = {}) => (new DOMParser()).parseFromString(input, 'text/xml')
   */
  parserHtml?: CustomParserHtml;

  /**
   * Default HTML parser options (used in `parserModule.parseHtml('<div...', options)`).
   */
  optionsHtml?: HTMLParserOptions;
}

const config: () => ParserConfig = () => ({
  textTags: ['br', 'b', 'i', 'u', 'a', 'ul', 'ol'],
  textTypes: ['text', 'textnode', 'comment'],
  parserCss: undefined,
  parserHtml: undefined,
  optionsHtml: {
    htmlType: 'text/html',
    allowScripts: false,
    allowUnsafeAttr: false,
    allowUnsafeAttrValue: false,
    keepEmptyTextNodes: false,
    convertDataGjsAttributesHyphens: false,
  },
});

export default config;
```

--------------------------------------------------------------------------------

````
