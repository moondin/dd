---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 45
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 45 of 97)

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

---[FILE: ComponentTextView.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/view/ComponentTextView.ts

```typescript
import { bindAll } from 'underscore';
import { AddOptions, DisableOptions, ObjectAny, WithHTMLParserOptions } from '../../common';
import RichTextEditorModule, { RteDisableResult } from '../../rich_text_editor';
import RichTextEditor from '../../rich_text_editor/model/RichTextEditor';
import { off, on } from '../../utils/dom';
import { getComponentModel } from '../../utils/mixins';
import Component from '../model/Component';
import { getComponentIds } from '../model/Components';
import ComponentText from '../model/ComponentText';
import { ComponentDefinition } from '../model/types';
import ComponentView from './ComponentView';
import { ComponentsEvents } from '../types';

export default class ComponentTextView<TComp extends ComponentText = ComponentText> extends ComponentView<TComp> {
  rte?: RichTextEditorModule;
  rteEnabled?: boolean;
  activeRte?: RichTextEditor;
  lastContent?: string;

  events() {
    return {
      dblclick: 'onActive',
      input: 'onInput',
    };
  }

  initialize(props: any) {
    super.initialize(props);
    bindAll(this, 'disableEditing', 'onDisable');
    const model = this.model;
    const em = this.em;
    this.listenTo(model, 'focus', this.onActive);
    this.listenTo(model, 'change:content', this.updateContentText);
    this.listenTo(model, 'sync:content', this.syncContent);
    this.rte = em?.RichTextEditor;
  }

  updateContentText(m: any, v: any, opts: { fromDisable?: boolean } = {}) {
    !opts.fromDisable && this.disableEditing();
  }

  canActivate() {
    const { model, rteEnabled, em } = this;
    const modelInEdit = em?.getEditing();
    const sameInEdit = modelInEdit === model;
    let result = true;
    let isInnerText = false;
    let delegate;

    if (rteEnabled || !model.get('editable') || sameInEdit || (isInnerText = model.isChildOf('text'))) {
      result = false;
      // If the current is inner text, select the closest text
      if (isInnerText && !model.get('textable')) {
        let parent = model.parent();

        while (parent && !parent.isInstanceOf('text')) {
          parent = parent.parent();
        }

        if (parent && parent.get('editable')) {
          delegate = parent;
        } else {
          result = true;
        }
      }
    }

    return { result, delegate };
  }

  /**
   * Enable element content editing
   * @private
   * */
  async onActive(ev: MouseEvent) {
    const { rte, em } = this;
    const { result, delegate } = this.canActivate();

    // We place this before stopPropagation in case of nested
    // text components will not block the editing (#1394)
    if (!result) {
      if (delegate) {
        ev?.stopPropagation?.();
        em.setSelected(delegate);
        delegate.trigger('active', ev);
      }
      return;
    }

    ev?.stopPropagation?.();
    this.lastContent = await this.getContent();

    if (rte) {
      try {
        const view = this;
        this.activeRte = await rte.enable(view, this.activeRte!, { event: ev, view });
      } catch (err) {
        em.logError(err as any);
      }
    }

    this.toggleEvents(true);
  }

  onDisable(opts?: DisableOptions) {
    this.disableEditing(opts);
  }

  /**
   * Disable element content editing
   * @private
   * */
  async disableEditing(opts: DisableOptions & WithHTMLParserOptions = {}) {
    const { model, rte, activeRte, em } = this;
    // There are rare cases when disableEditing is called when the view is already removed
    // so, we have to check for the model, this will avoid breaking stuff.
    const editable = model && model.get('editable');

    if (rte) {
      let disableRes: RteDisableResult = {};
      const content = await this.getContent();

      try {
        disableRes = await rte.disable(this, activeRte, opts);
      } catch (err) {
        em.logError(err as any);
      }

      if (editable && (content !== this.lastContent || disableRes.forceSync)) {
        await this.syncContent({ ...opts, content });
        this.lastContent = '';
      }
    }

    this.toggleEvents();
  }

  /**
   * get content from RTE
   * @return string
   */
  async getContent() {
    const { rte, activeRte } = this;
    let result = '';

    if (rte) {
      result = await rte.getContent(this, activeRte!);
    }

    return result;
  }

  /**
   * Merge content from the DOM to the model
   */
  async syncContent(opts: ObjectAny = {}) {
    const { model, rte, rteEnabled } = this;
    if (!rteEnabled && !opts.force) return;
    const content = opts.content ?? (await this.getContent());
    const comps = model.components();
    const contentOpt: ObjectAny = { fromDisable: 1, ...opts };
    model.set('content', '', contentOpt);

    // If there is a custom RTE the content is just added statically
    // inside 'content'
    if (rte?.customRte && !rte.customRte.parseContent) {
      comps.length &&
        comps.reset(undefined, {
          ...opts,
          // @ts-ignore
          keepIds: getComponentIds(comps),
        });
      model.set('content', content, contentOpt);
    } else {
      comps.resetFromString(content, opts);
    }
  }

  insertComponent(content: ComponentDefinition, opts: AddOptions & { useDomContent?: boolean } = {}) {
    const { model, el } = this;
    const doc = el.ownerDocument;
    const selection = doc.getSelection();

    if (selection?.rangeCount) {
      const range = selection.getRangeAt(0);
      const textNode = range.startContainer;
      const offset = range.startOffset;
      const textModel = getComponentModel(textNode);
      const newCmps: (ComponentDefinition | Component)[] = [];

      if (textModel && textModel.is?.('textnode')) {
        const cmps = textModel.collection;
        cmps.forEach((cmp) => {
          if (cmp === textModel) {
            const type = 'textnode';
            const cnt = opts.useDomContent ? textNode.textContent || '' : cmp.content;
            newCmps.push({ type, content: cnt.slice(0, offset) });
            newCmps.push(content);
            newCmps.push({ type, content: cnt.slice(offset) });
          } else {
            newCmps.push(cmp);
          }
        });

        const result = newCmps.filter(Boolean);
        const index = result.indexOf(content);
        cmps.reset(result, opts);

        return cmps.at(index);
      }
    }

    return model.append(content, opts);
  }

  /**
   * Callback on input event
   * @param  {Event} e
   */
  onInput() {
    const { model } = this;
    const events = [ComponentsEvents.update, ComponentsEvents.input];
    events.forEach((ev) => model.emitWithEditor(ev, model));
  }

  /**
   * Isolate disable propagation method
   * @param {Event}
   * @private
   * */
  disablePropagation(e: Event) {
    e.stopPropagation();
  }

  /**
   * Enable/Disable events
   * @param {Boolean} enable
   */
  toggleEvents(enable?: boolean) {
    const { em, model, $el } = this;
    const mixins = { on, off };
    const method = enable ? 'on' : 'off';
    em.setEditing(enable ? this : false);
    this.rteEnabled = !!enable;

    // The ownerDocument is from the frame
    var elDocs = [this.el.ownerDocument, document];
    mixins.off(elDocs, 'mousedown', this.onDisable as any);
    mixins[method](elDocs, 'mousedown', this.onDisable as any);
    em[method]('toolbar:run:before', this.onDisable);

    if (model) {
      const rteEvents = em.RichTextEditor.events;
      model[method]('removed', this.onDisable);
      model.trigger(enable ? rteEvents.enable : rteEvents.disable);
    }

    // @ts-ignore Avoid closing edit mode on component click
    $el?.off('mousedown', this.disablePropagation);
    // @ts-ignore
    $el && $el[method]('mousedown', this.disablePropagation);

    // Fixes #2210 but use this also as a replacement
    // of this fix: bd7b804f3b46eb45b4398304b2345ce870f232d2
    if (this.config.draggableComponents) {
      let { el } = this;

      while (el) {
        el.draggable = enable ? !1 : !0;
        // Note: el.parentNode is sometimes null here
        el = el.parentNode as HTMLElement;
        if (el && el.tagName == 'BODY') {
          // @ts-ignore
          el = 0;
        }
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ComponentVideoView.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/view/ComponentVideoView.ts

```typescript
import ComponentVideo from '../model/ComponentVideo';
import ComponentImageView from './ComponentImageView';
import ComponentView from './ComponentView';

export default class ComponentVideoView extends ComponentImageView<ComponentVideo> {
  videoEl?: HTMLVideoElement | HTMLIFrameElement;

  tagName() {
    return 'div';
  }

  // @ts-ignore
  events() {
    return {};
  }

  initialize() {
    // @ts-ignore
    ComponentView.prototype.initialize.apply(this, arguments);
    const { model } = this;
    const props = ['loop', 'autoplay', 'controls', 'color', 'rel', 'modestbranding', 'poster', 'muted'];
    const events = props.map((p) => `change:${p}`).join(' ');
    this.listenTo(model, 'change:provider', this.updateProvider);
    this.listenTo(model, 'change:src', this.updateSrc);
    this.listenTo(model, events, this.updateVideo);
  }

  /**
   * Rerender on update of the provider
   * @private
   */
  updateProvider() {
    var prov = this.model.get('provider');
    this.el.innerHTML = '';
    this.el.appendChild(this.renderByProvider(prov));
  }

  /**
   * Update the source of the video
   * @private
   */
  updateSrc() {
    const { model, videoEl } = this;
    if (!videoEl) return;
    const prov = model.get('provider');
    let src = model.get('src');

    switch (prov) {
      case 'yt':
        src = model.getYoutubeSrc();
        break;
      case 'ytnc':
        src = model.getYoutubeNoCookieSrc();
        break;
      case 'vi':
        src = model.getVimeoSrc();
        break;
    }

    videoEl.src = src;
  }

  /**
   * Update video parameters
   * @private
   */
  updateVideo() {
    const { model, videoEl } = this;
    const prov = model.get('provider');
    switch (prov) {
      case 'yt':
      case 'ytnc':
      case 'vi':
        model.trigger('change:videoId');
        break;
      default: {
        if (videoEl) {
          const el = videoEl as HTMLVideoElement;
          el.loop = model.get('loop');
          el.autoplay = model.get('autoplay');
          el.controls = model.get('controls');
          el.poster = model.get('poster');
          el.muted = model.get('muted');
        }
      }
    }
  }

  renderByProvider(prov: string) {
    let videoEl;

    switch (prov) {
      case 'yt':
        videoEl = this.renderYoutube();
        break;
      case 'ytnc':
        videoEl = this.renderYoutubeNoCookie();
        break;
      case 'vi':
        videoEl = this.renderVimeo();
        break;
      default:
        videoEl = this.renderSource();
    }

    this.videoEl = videoEl;
    return videoEl;
  }

  renderSource() {
    const el = document.createElement('video');
    el.src = this.model.get('src');
    this.initVideoEl(el);
    return el;
  }

  renderYoutube() {
    const el = document.createElement('iframe');
    el.src = this.model.getYoutubeSrc();
    el.frameBorder = '0';
    el.setAttribute('allowfullscreen', 'true');
    this.initVideoEl(el);
    return el;
  }

  renderYoutubeNoCookie() {
    var el = document.createElement('iframe');
    el.src = this.model.getYoutubeNoCookieSrc();
    el.frameBorder = '0';
    el.setAttribute('allowfullscreen', 'true');
    this.initVideoEl(el);
    return el;
  }

  renderVimeo() {
    var el = document.createElement('iframe');
    el.src = this.model.getVimeoSrc();
    el.frameBorder = '0';
    el.setAttribute('allowfullscreen', 'true');
    this.initVideoEl(el);
    return el;
  }

  initVideoEl(el: HTMLElement) {
    el.className = this.ppfx + 'no-pointer';
    el.style.height = '100%';
    el.style.width = '100%';
  }

  render() {
    ComponentView.prototype.render.apply(this);
    this.updateClasses();
    var prov = this.model.get('provider');
    this.el.appendChild(this.renderByProvider(prov));
    this.updateVideo();
    return this;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ComponentView.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/view/ComponentView.ts

```typescript
import { each, isBoolean, isEmpty, keys, result } from 'underscore';
import { CanvasSpotBuiltInTypes } from '../../canvas/model/CanvasSpot';
import FrameView from '../../canvas/view/FrameView';
import { DisableOptions, ExtractMethods, ObjectAny, View } from '../../common';
import { GetSetRuleOptions } from '../../css_composer';
import Editor from '../../editor';
import EditorModel from '../../editor/model/Editor';
import Selectors from '../../selector_manager/model/Selectors';
import { replaceWith } from '../../utils/dom';
import { setViewEl } from '../../utils/mixins';
import { DomComponentsConfig } from '../config/config';
import Component, { avoidInline } from '../model/Component';
import Components from '../model/Components';
import { ComponentOptions, UpdateComponentsOptions } from '../model/types';
import ComponentsView from './ComponentsView';
import { ComponentsEvents } from '../types';

type ClbObj = ReturnType<ComponentView['_clbObj']>;

export interface IComponentView extends ExtractMethods<ComponentView> {}

export default class ComponentView<TComp extends Component = Component> extends View</**
 * Keep this format to avoid errors in TS bundler */
/** @ts-ignore */
TComp> {
  /** @ts-ignore */
  model!: TComp;

  /** @ts-ignore */
  className() {
    return this.getClasses();
  }

  /** @ts-ignore */
  tagName() {
    return this.model.get('tagName')!;
  }

  modelOpt!: ComponentOptions;
  em!: EditorModel;
  opts?: any;
  pfx?: string;
  ppfx?: string;
  attr?: Record<string, any>;
  classe?: string;
  config!: DomComponentsConfig;
  childrenView?: ComponentsView;
  getChildrenSelector?: Function;
  getTemplate?: Function;
  scriptContainer?: HTMLElement;
  rendered = false;

  preinitialize(opt: any = {}) {
    this.opts = opt;
  }

  initialize(opt: any = {}) {
    const model = this.model;
    const config = opt.config || {};
    const em = config.em;
    const modelOpt = model.opt || {};
    const { $el, el } = this;
    this.opts = opt;
    this.modelOpt = modelOpt;
    this.config = config;
    this.em = em;
    this.pfx = config.stylePrefix || '';
    this.ppfx = config.pStylePrefix || '';
    this.attr = model.get('attributes')!;
    this.classe = this.attr.class || [];
    this.listenTo(model, 'change:style', this.updateStyle);
    this.listenTo(model, 'change:attributes', this.renderAttributes);
    this.listenTo(model, 'change:highlightable', this.updateHighlight);
    this.listenTo(model, 'change:status change:locked', this.updateStatus);
    this.listenTo(model, 'change:script rerender', this.reset);
    this.listenTo(model, 'change:content', this.updateContent);
    this.listenTo(model, 'change', this.handleChange);
    this.listenTo(model, 'active', this.onActive);
    this.listenTo(model, 'disable', this.onDisable);
    $el.data('model', model);
    setViewEl(el, this);
    model.view = this;
    this.frameView && model.views.push(this);
    this.initClasses();
    this.initComponents({ avoidRender: true });
    this.events = {
      ...(this.constructor as typeof ComponentView).getEvents(),
      dragstart: 'handleDragStart',
    };
    this.delegateEvents();
    !modelOpt.temporary && this.init(this._clbObj());
  }

  get __cmpStyleOpts(): GetSetRuleOptions {
    return { state: '', mediaText: '' };
  }

  get frameView(): FrameView {
    return this.opts.config.frameView;
  }

  get createDoc() {
    const doc = this.frameView?.getDoc() || document;
    return this.opts.config?.useFrameDoc ? doc : document;
  }

  __isDraggable() {
    const { model, config } = this;
    const { draggable } = model.attributes;
    return config.draggableComponents && draggable;
  }

  _clbObj() {
    const { em, model, el } = this;
    return {
      editor: em?.getEditor() as Editor,
      model,
      el,
    };
  }

  /**
   * Initialize callback
   */
  init(opts: ClbObj) {}

  /**
   * Remove callback
   */
  removed(opts: ClbObj) {}

  /**
   * On render callback
   */
  onRender(opts: ClbObj) {}

  /**
   * Callback executed when the `active` event is triggered on component
   */
  onActive(ev?: Event) {}

  /**
   * Callback executed when the `disable` event is triggered on component
   */
  onDisable(opts?: DisableOptions) {}

  remove() {
    super.remove();
    const { model, $el } = this;
    const { views } = model;
    const frame = this.frameView || {};
    model.components().forEach((comp) => {
      const view = comp.getView(frame.model);
      view?.remove();
    });
    this.childrenView?.remove();
    views.splice(views.indexOf(this), 1);
    this.removed(this._clbObj());
    $el.data({ model: '', collection: '', view: '' });
    // delete model.view; // Sorter relies on this property
    return this;
  }

  handleDragStart(event: Event) {
    if (!this.__isDraggable()) return false;
    event.stopPropagation();
    event.preventDefault();
    const selected = this.em.getSelectedAll();
    const modelsToMove = selected.includes(this.model) ? selected : [this.model];
    this.em.Commands.run('tlb-move', {
      target: modelsToMove,
      event,
    });
  }

  initClasses() {
    const { model } = this;
    const { classes } = model;
    const event = 'change:classes';

    if (classes instanceof Selectors) {
      this.stopListening(model, event, this.initClasses);
      this.listenTo(model, event, this.initClasses);
      this.listenTo(classes, 'add remove change reset', this.updateClasses);
      classes.length && this.importClasses();
    }
  }

  initComponents(opts: { avoidRender?: boolean } = {}) {
    const { model, $el, childrenView } = this;
    const event = 'change:components';
    const comps = model.get('components');
    const toListen = [model, event, this.initComponents];

    if (comps instanceof Components) {
      $el.data('collection', comps);
      childrenView && childrenView.remove();
      this.stopListening(...toListen);
      !opts.avoidRender && this.renderChildren();
      // @ts-ignore
      this.listenTo(...toListen);
    }
  }

  /**
   * Handle any property change
   * @private
   */
  handleChange() {
    const { model } = this;
    const chgArr = keys(model.changed);
    if (chgArr.length === 1 && chgArr[0] === 'status') return;
    model.emitUpdate();

    for (let prop in model.changed) {
      model.emitUpdate(prop);
    }
  }

  /**
   * Import, if possible, classes inside main container
   * @private
   * */
  importClasses() {
    const { em, model } = this;
    const sm = em.Selectors;
    sm && model.classes.forEach((s) => sm.add(s.getName()));
  }

  /**
   * Update item on status change
   * @param  {Event} e
   * @private
   * */
  updateStatus(opts: { noExtHl?: boolean; avoidHover?: boolean } = {}) {
    const { em, el, ppfx, model } = this;
    const canvas = em?.Canvas;
    const extHl = canvas?.config.extHl;
    const status = model.get('status');
    const selectedCls = `${ppfx}selected`;
    const selectedParentCls = `${selectedCls}-parent`;
    const freezedCls = `${ppfx}freezed`;
    const hoveredCls = `${ppfx}hovered`;
    const noPointerCls = `${ppfx}no-pointer`;
    const pointerInitCls = `${ppfx}pointer-init`;
    const toRemove = [selectedCls, selectedParentCls, freezedCls, hoveredCls, noPointerCls, pointerInitCls];
    const selCls = extHl && !opts.noExtHl ? '' : selectedCls;
    this.$el.removeClass(toRemove.join(' '));
    const actualCls = el.getAttribute('class') || '';
    const cls = [actualCls];
    const noCustomSpotSelect = !canvas?.hasCustomSpot(CanvasSpotBuiltInTypes.Select);
    const noCustomSpotTarget = !canvas?.hasCustomSpot(CanvasSpotBuiltInTypes.Target);

    switch (status) {
      case 'selected':
        noCustomSpotSelect && cls.push(selCls);
        break;
      case 'selected-parent':
        noCustomSpotTarget && cls.push(selectedParentCls);
        break;
      case 'freezed':
        cls.push(freezedCls);
        break;
      case 'freezed-selected':
        cls.push(freezedCls);
        noCustomSpotSelect && cls.push(selCls);
        break;
      case 'hovered':
        !opts.avoidHover && cls.push(hoveredCls);
        break;
    }

    if (isBoolean(model.locked)) {
      cls.push(model.locked ? noPointerCls : pointerInitCls);
    }

    const clsStr = cls.filter(Boolean).join(' ');
    clsStr && el.setAttribute('class', clsStr);
  }

  /**
   * Update highlight attribute
   * @private
   * */
  updateHighlight() {
    const { model } = this;
    const isTextable = model.get('textable');
    const hl = model.get('highlightable') && (isTextable || !model.isChildOf('text'));
    this.setAttribute('data-gjs-highlightable', hl ? true : '');
  }

  /**
   * Update style attribute
   * @private
   * */
  updateStyle(m?: any, v?: any, opts: ObjectAny = {}) {
    const { model, em } = this;

    if (avoidInline(em) && !opts.inline) {
      // Move inline styles to CSSRule
      const styleOpts = this.__cmpStyleOpts;
      const style = model.getStyle({ inline: true, ...styleOpts });
      !isEmpty(style) && model.setStyle(style, styleOpts);
    } else {
      this.setAttribute('style', model.styleToString(opts));
    }
  }

  updateStyles() {
    this.updateStyle();
  }

  /**
   * Update classe attribute
   * @private
   * */
  updateClasses() {
    const str = this.model.classes.pluck?.('name').join(' ') || '';
    this.setAttribute('class', str);

    // Regenerate status class
    this.updateStatus();
    this.onAttrUpdate();
  }

  /**
   * Update single attribute
   * @param {[type]} name  [description]
   * @param {[type]} value [description]
   */
  setAttribute(name: string, value: any) {
    const el = this.$el;
    value ? el.attr(name, value) : el.removeAttr(name);
  }

  /**
   * Get classes from attributes.
   * This method is called before initialize
   *
   * @return  {Array}|null
   * @private
   * */
  getClasses() {
    return this.model.getClasses().join(' ');
  }

  /**
   * Update attributes
   * @private
   * */
  updateAttributes() {
    const attrs: string[] = [];
    const { model, $el, el } = this;
    const { textable, type } = model.attributes;

    const defaultAttr = {
      id: model.getId(),
      'data-gjs-type': type || 'default',
      ...(this.__isDraggable() && { draggable: true }),
      ...(textable && { contenteditable: 'false' }),
    };

    this.__clearAttributes();
    this.updateStyle();
    this.updateHighlight();
    const attr = {
      ...defaultAttr,
      ...model.getAttributes(),
    };

    // Remove all `false` attributes
    keys(attr).forEach((key) => attr[key] === false && delete attr[key]);

    $el.attr(attr);
  }

  __clearAttributes() {
    const { el, $el } = this;
    const attrs: string[] = [];
    each(el.attributes, (attr) => attrs.push(attr.nodeName));
    attrs.forEach((attr) => $el.removeAttr(attr));
  }

  /**
   * Update component content
   * @private
   * */
  updateContent() {
    const { content } = this.model;
    const hasComps = this.model.components().length;
    this.getChildrenContainer().innerHTML = hasComps ? '' : content;
  }

  /**
   * Prevent default helper
   * @param  {Event} e
   * @private
   */
  prevDef(e: Event) {
    e.preventDefault();
  }

  /**
   * Render component's script
   * @private
   */
  updateScript() {
    const { model, em } = this;
    if (!model.get('script')) return;
    em?.Canvas.getCanvasView().updateScript(this);
  }

  /**
   * Return children container
   * Differently from a simple component where children container is the
   * component itself
   * <my-comp>
   *  <!--
   *    <child></child> ...
   *   -->
   * </my-comp>
   * You could have the children container more deeper
   * <my-comp>
   *  <div></div>
   *  <div></div>
   *  <div>
   *    <div>
   *      <!--
   *        <child></child> ...
   *      -->
   *    </div>
   *  </div>
   * </my-comp>
   * @return HTMLElement
   * @private
   */
  getChildrenContainer() {
    var container = this.el;

    if (typeof this.getChildrenSelector == 'function') {
      container = this.el.querySelector(this.getChildrenSelector());
    } else if (typeof this.getTemplate == 'function') {
      // Need to find deepest first child
    }

    return container;
  }

  /**
   * This returns rect informations not affected by the canvas zoom.
   * The method `getBoundingClientRect` doesn't work here and we
   * have to take in account offsetParent
   */
  getOffsetRect() {
    const rect = { top: 0, left: 0, bottom: 0, right: 0 };
    const target = this.el;
    let gtop = 0;
    let gleft = 0;

    const assignRect = (el: HTMLElement) => {
      const offsetParent = el.offsetParent as HTMLElement;

      if (offsetParent) {
        gtop += offsetParent.offsetTop;
        gleft += offsetParent.offsetLeft;
        assignRect(offsetParent);
      } else {
        rect.top = target.offsetTop + gtop;
        rect.left = target.offsetLeft + gleft;
        rect.bottom = rect.top + target.offsetHeight;
        rect.right = rect.left + target.offsetWidth;
      }
    };
    assignRect(target);

    return rect;
  }

  isInViewport() {
    const { el, em, frameView } = this;
    const canvasView = em.Canvas.getCanvasView();
    const elRect = canvasView.getElBoxRect(el, { local: true });
    const frameEl = frameView.el;
    const frameH = frameEl.clientHeight;
    const frameW = frameEl.clientWidth;

    const elTop = elRect.y;
    const elRight = elRect.x;
    const elBottom = elTop + elRect.height;
    const elLeft = elRight + elRect.width;
    const isTopInside = elTop >= 0 && elTop < frameH;
    const isBottomInside = elBottom > 0 && elBottom < frameH;
    const isLeftInside = elLeft >= 0 && elLeft < frameW;
    const isRightInside = elRight > 0 && elRight <= frameW;

    const partiallyIn = (isTopInside || isBottomInside) && (isLeftInside || isRightInside);

    return partiallyIn;
  }

  scrollIntoView(opts: { force?: boolean } & ScrollIntoViewOptions = {}) {
    const isInViewport = this.isInViewport();

    if (!isInViewport || opts.force) {
      const { el } = this;

      // PATCH: scrollIntoView won't work with multiple requests from iframes
      if (opts.behavior !== 'smooth') {
        const rect = this.getOffsetRect();
        el.ownerDocument.defaultView?.scrollTo(0, rect.top);
      } else {
        el.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          ...opts,
        });
      }
    }
  }

  /**
   * Recreate the element of the view
   */
  reset() {
    const view = this;
    const { el, model } = view;
    view.scriptContainer && model.emitWithEditor(ComponentsEvents.scriptUnmount, { component: model, view, el });
    // @ts-ignore
    this.el = '';
    this._ensureElement();
    this._setData();
    replaceWith(el, this.el);
    this.render();
  }

  _setData() {
    const { model, el } = this;
    const collection = model.components();
    const view = this;
    this.$el.data({ model, collection, view });
    setViewEl(el, this);
  }

  _createElement(tagName: string): Node {
    return this.createDoc.createElement(tagName);
  }

  /**
   * Render children components
   * @private
   */
  renderChildren() {
    this.updateContent();
    const container = this.getChildrenContainer();
    const view =
      this.childrenView ||
      new ComponentsView({
        // @ts-ignore
        collection: this.model.get('components')!,
        config: this.config,
        componentTypes: this.opts.componentTypes,
      });

    view.render(container);
    this.childrenView = view;
    const childNodes = Array.prototype.slice.call(view.el.childNodes);

    for (var i = 0, len = childNodes.length; i < len; i++) {
      container.appendChild(childNodes.shift());
    }
  }

  renderAttributes(m?: any, v?: any, opts: UpdateComponentsOptions = {}) {
    if (opts.skipViewUpdate) return;
    this.updateAttributes();
    this.updateClasses();
  }

  onAttrUpdate() {}

  render() {
    this.renderAttributes();
    if (this.modelOpt.temporary) return this;
    this.renderChildren();
    this.updateScript();
    setViewEl(this.el, this);
    this.postRender();

    return this;
  }

  postRender() {
    if (!this.modelOpt.temporary) {
      const { model, el } = this;
      this.onRender(this._clbObj());
      model.emitWithEditor(ComponentsEvents.render, {
        component: model,
        view: this,
        el,
      });
      this.rendered = true;
    }
  }

  static getEvents() {
    return result(this.prototype, 'events');
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ComponentWrapperView.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/view/ComponentWrapperView.ts

```typescript
import ComponentView from './ComponentView';

export default class ComponentWrapperView extends ComponentView {
  tagName() {
    return 'div';
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ToolbarButtonView.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/view/ToolbarButtonView.ts

```typescript
import { isFunction, isString } from 'underscore';
import { View } from '../../common';
import EditorModel from '../../editor/model/Editor';
import ToolbarButton from '../model/ToolbarButton';

export type ToolbarViewProps = { em: EditorModel };

export default class ToolbarButtonView extends View<ToolbarButton> {
  em: EditorModel;

  events() {
    return (
      this.model.get('events') || {
        mousedown: 'handleClick',
      }
    );
  }

  // @ts-ignore
  attributes() {
    return this.model.get('attributes');
  }

  constructor(props: { config: ToolbarViewProps; model: ToolbarButton }) {
    super(props);
    this.em = props.config.em;
  }

  handleClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    /*
     * Since the toolbar lives outside the canvas frame, the event's
     * generated on it have clientX and clientY relative to the page.
     *
     * This causes issues during events like dragging, where they depend
     * on the clientX and clientY.
     *
     * This makes sure the offsets are calculated.
     *
     * More information on
     * https://github.com/GrapesJS/grapesjs/issues/2372
     * https://github.com/GrapesJS/grapesjs/issues/2207
     */

    const { em } = this;
    const { left, top } = em.Canvas.getFrameEl().getBoundingClientRect();
    const ev = {
      ...event,
      clientX: event.clientX - left,
      clientY: event.clientY - top,
    };

    em.trigger('toolbar:run:before', { event: ev });
    this.execCommand(ev);
  }

  execCommand(event: MouseEvent) {
    const { em, model } = this;
    const opts = { event };
    const command = model.get('command');
    const editor = em.Editor;

    if (isFunction(command)) {
      command(editor, null, opts);
    }

    if (isString(command)) {
      editor.runCommand(command, opts);
    }
  }

  render() {
    const { em, $el, model } = this;
    const id = model.get('id');
    const label = model.get('label');
    const pfx = em.getConfig().stylePrefix;
    $el.addClass(`${pfx}toolbar-item`);
    id && $el.addClass(`${pfx}toolbar-item__${id}`);
    label && $el.append(label);
    return this;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ToolbarView.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/view/ToolbarView.ts

```typescript
import DomainViews from '../../domain_abstract/view/DomainViews';
import EditorModel from '../../editor/model/Editor';
import ToolbarButtonView, { ToolbarViewProps } from './ToolbarButtonView';

export default class ToolbarView extends DomainViews {
  em: EditorModel;

  constructor(opts: ToolbarViewProps) {
    super(opts);
    const { em } = opts;
    this.em = em;
    this.config = { em };
    this.listenTo(this.collection, 'reset', this.render);
  }

  onRender() {
    const pfx = this.em.config.stylePrefix!;
    this.el.className = `${pfx}toolbar-items`;
  }
}

// @ts-ignore
ToolbarView.prototype.itemView = ToolbarButtonView;
```

--------------------------------------------------------------------------------

````
