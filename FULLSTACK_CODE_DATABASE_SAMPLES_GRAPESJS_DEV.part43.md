---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 43
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 43 of 97)

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

---[FILE: ComponentVideo.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/model/ComponentVideo.ts

```typescript
import { ObjectAny } from '../../common';
import { isDef, isEmptyObj, toLowerCase } from '../../utils/mixins';
import ComponentImage from './ComponentImage';
import { ComponentOptions, ComponentProperties } from './types';

const type = 'video';
const yt = 'yt';
const vi = 'vi';
const ytnc = 'ytnc';
const defProvider = 'so';

const hasParam = (value: string) => value && value !== '0';

export default class ComponentVideo extends ComponentImage {
  get defaults() {
    return {
      // @ts-ignore
      ...super.defaults,
      type,
      tagName: type,
      videoId: '',
      void: false,
      provider: defProvider, // on change of provider, traits are switched
      ytUrl: 'https://www.youtube.com/embed/',
      ytncUrl: 'https://www.youtube-nocookie.com/embed/',
      viUrl: 'https://player.vimeo.com/video/',
      loop: false,
      poster: '',
      muted: false,
      autoplay: false,
      controls: true,
      color: '',
      list: '',
      src: '',
      rel: 1, // YT related videos
      modestbranding: 0, // YT modest branding
      sources: [],
      attributes: { allowfullscreen: 'allowfullscreen' },
    };
  }

  constructor(props: ComponentProperties = {}, opt: ComponentOptions) {
    super(props, opt);
    if (this.get('src')) this.parseFromSrc();
    this.updatePropsFromAttr();
    this.updateTraits();
    this.on('change:provider', this.updateTraits);
    this.on('change:videoId change:provider', this.updateSrc);
  }

  updatePropsFromAttr() {
    if (this.get('provider') === defProvider) {
      const { controls, autoplay, loop, muted } = this.get('attributes')!;
      const toUp: ObjectAny = {};

      if (isDef(controls)) toUp.controls = !!controls;
      if (isDef(autoplay)) toUp.autoplay = !!autoplay;
      if (isDef(loop)) toUp.loop = !!loop;
      if (isDef(muted)) toUp.muted = !!muted; // Update for muted

      if (!isEmptyObj(toUp)) {
        this.set(toUp);
      }
    }
  }

  /**
   * Update traits by provider
   * @private
   */
  updateTraits() {
    const { em } = this;
    const prov = this.get('provider');
    let tagName = 'iframe';
    let traits;

    switch (prov) {
      case yt:
      case ytnc:
        traits = this.getYoutubeTraits();
        break;
      case vi:
        traits = this.getVimeoTraits();
        break;
      default:
        tagName = 'video';
        traits = this.getSourceTraits();
    }

    this.set({ tagName }, { silent: true }); // avoid break in view
    // @ts-ignore
    this.set({ traits });
    em.get('ready') && em.trigger('component:toggled');
  }

  /**
   * Set attributes by src string
   */
  parseFromSrc() {
    const prov = this.get('provider');
    const uri = this.parseUri(this.get('src'));
    const qr = uri.query;
    switch (prov) {
      case yt:
      case ytnc:
      case vi:
        this.set('videoId', uri.pathname.split('/').pop());
        qr.list && this.set('list', qr.list);
        hasParam(qr.autoplay) && this.set('autoplay', true);
        hasParam(qr.loop) && this.set('loop', true);
        parseInt(qr.controls) === 0 && this.set('controls', false);
        hasParam(qr.color) && this.set('color', qr.color);
        qr.rel === '0' && this.set('rel', 0);
        qr.modestbranding === '1' && this.set('modestbranding', 1);
        qr.muted === '1' && this.set('muted', true);
        break;
      default:
    }
  }

  /**
   * Update src on change of video ID
   * @private
   */
  updateSrc() {
    const prov = this.get('provider');
    let src = '';

    switch (prov) {
      case yt:
        src = this.getYoutubeSrc();
        break;
      case ytnc:
        src = this.getYoutubeNoCookieSrc();
        break;
      case vi:
        src = this.getVimeoSrc();
        break;
    }

    this.set({ src });
  }

  /**
   * Returns object of attributes for HTML
   * @return {Object}
   * @private
   */
  getAttrToHTML() {
    const attr = super.getAttrToHTML();
    const prov = this.get('provider');

    switch (prov) {
      case yt:
      case ytnc:
      case vi:
        break;
      default:
        attr.loop = !!this.get('loop');
        attr.autoplay = !!this.get('autoplay');
        attr.controls = !!this.get('controls');
        attr.muted = !!this.get('muted');
    }

    return attr;
  }

  // Listen provider change and switch traits, in TraitView listen traits change

  /**
   * Return the provider trait
   * @return {Object}
   * @private
   */
  getProviderTrait() {
    return {
      type: 'select',
      label: 'Provider',
      name: 'provider',
      changeProp: true,
      options: [
        { value: 'so', name: 'HTML5 Source' },
        { value: yt, name: 'Youtube' },
        { value: ytnc, name: 'Youtube (no cookie)' },
        { value: vi, name: 'Vimeo' },
      ],
    };
  }

  /**
   * Return traits for the source provider
   * @return {Array<Object>}
   * @private
   */
  getSourceTraits() {
    return [
      this.getProviderTrait(),
      {
        label: 'Source',
        name: 'src',
        placeholder: 'eg. ./media/video.mp4',
        changeProp: true,
      },
      {
        label: 'Poster',
        name: 'poster',
        placeholder: 'eg. ./media/image.jpg',
      },
      this.getAutoplayTrait(),
      this.getLoopTrait(),
      this.getControlsTrait(),
      this.getMutedTrait(),
    ];
  }
  /**
   * Return traits for the source provider
   * @return {Array<Object>}
   * @private
   */
  getYoutubeTraits() {
    return [
      this.getProviderTrait(),
      {
        label: 'Video ID',
        name: 'videoId',
        placeholder: 'eg. jNQXAC9IVRw',
        changeProp: true,
      },
      this.getAutoplayTrait(),
      this.getLoopTrait(),
      this.getControlsTrait(),
      {
        type: 'checkbox',
        label: 'Related',
        name: 'rel',
        changeProp: true,
      },
      {
        type: 'checkbox',
        label: 'Modest',
        name: 'modestbranding',
        changeProp: true,
      },
      this.getMutedTrait(),
    ];
  }

  /**
   * Return traits for the source provider
   * @return {Array<Object>}
   * @private
   */
  getVimeoTraits() {
    return [
      this.getProviderTrait(),
      {
        label: 'Video ID',
        name: 'videoId',
        placeholder: 'eg. 123456789',
        changeProp: true,
      },
      {
        label: 'Color',
        name: 'color',
        placeholder: 'eg. FF0000',
        changeProp: true,
      },
      this.getAutoplayTrait(),
      this.getLoopTrait(),
      this.getMutedTrait(),
    ];
  }

  /**
   * Return object trait
   * @return {Object}
   * @private
   */
  getAutoplayTrait() {
    return {
      type: 'checkbox',
      label: 'Autoplay',
      name: 'autoplay',
      changeProp: true,
    };
  }

  /**
   * Return object trait
   * @return {Object}
   * @private
   */
  getLoopTrait() {
    return {
      type: 'checkbox',
      label: 'Loop',
      name: 'loop',
      changeProp: true,
    };
  }

  /**
   * Return object trait
   * @return {Object}
   * @private
   */
  getControlsTrait() {
    return {
      type: 'checkbox',
      label: 'Controls',
      name: 'controls',
      changeProp: true,
    };
  }

  /**
   * Return object trait
   * @return {Object}
   * @private
   */
  getMutedTrait() {
    return {
      type: 'checkbox',
      label: 'Muted',
      name: 'muted',
      changeProp: true,
    };
  }

  /**
   * Returns url to youtube video
   * @return {string}
   * @private
   */
  getYoutubeSrc() {
    const id = this.get('videoId');
    let url = this.get('ytUrl') as string;
    const list = this.get('list');
    url += id + (id.indexOf('?') < 0 ? '?' : '');
    url += list ? `&list=${list}` : '';
    url += this.get('autoplay') ? '&autoplay=1' : '';
    url += this.get('muted') ? '&mute=1' : '';
    url += !this.get('controls') ? '&controls=0&showinfo=0' : '';
    url += this.get('loop') ? `&loop=1&playlist=${id}` : '';
    url += this.get('rel') ? '' : '&rel=0';
    url += this.get('modestbranding') ? '&modestbranding=1' : '';
    return url;
  }

  /**
   * Returns url to youtube no cookie video
   * @return {string}
   * @private
   */
  getYoutubeNoCookieSrc() {
    let url = this.getYoutubeSrc();
    url = url.replace(this.get('ytUrl'), this.get('ytncUrl'));
    return url;
  }

  /**
   * Returns url to vimeo video
   * @return {string}
   * @private
   */
  getVimeoSrc() {
    let url = this.get('viUrl') as string;
    url += this.get('videoId') + '?';
    url += this.get('autoplay') ? '&autoplay=1' : '';
    url += this.get('muted') ? '&muted=1' : '';
    url += this.get('loop') ? '&loop=1' : '';
    url += !this.get('controls') ? '&title=0&portrait=0&badge=0' : '';
    url += this.get('color') ? '&color=' + this.get('color') : '';
    return url;
  }

  static isComponent(el: HTMLVideoElement) {
    const { tagName, src } = el;
    const isYtProv = /youtube\.com\/embed/.test(src);
    const isYtncProv = /youtube-nocookie\.com\/embed/.test(src);
    const isViProv = /player\.vimeo\.com\/video/.test(src);
    const isExtProv = isYtProv || isYtncProv || isViProv;
    if (toLowerCase(tagName) == type || (toLowerCase(tagName) == 'iframe' && isExtProv)) {
      const result: any = { type: 'video' };
      if (src) result.src = src;
      if (isExtProv) {
        if (isYtProv) result.provider = yt;
        else if (isYtncProv) result.provider = ytnc;
        else if (isViProv) result.provider = vi;
      }
      return result;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ComponentWrapper.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/model/ComponentWrapper.ts

```typescript
import { all, isArray, isNumber, isUndefined } from 'underscore';
import ComponentWithCollectionsState from '../../data_sources/model/ComponentWithCollectionsState';
import DataResolverListener from '../../data_sources/model/DataResolverListener';
import { DataVariableProps } from '../../data_sources/model/DataVariable';
import { DataCollectionStateMap, DataCollectionStateType } from '../../data_sources/model/data_collection/types';
import { DataCollectionKeys } from '../../data_sources/types';
import { attrToString } from '../../utils/dom';
import Component from './Component';
import ComponentHead, { type as typeHead } from './ComponentHead';
import Components from './Components';
import { ComponentOptions, ComponentProperties, ToHTMLOptions } from './types';

type ResolverCurrentItemType = string | number;

export default class ComponentWrapper extends ComponentWithCollectionsState<DataVariableProps> {
  dataSourceWatcher?: DataResolverListener;
  private _resolverCurrentItem: ResolverCurrentItemType = 0;
  private _isWatchingCollectionStateMap = false;

  get defaults() {
    return {
      // @ts-ignore
      ...super.defaults,
      dataResolver: null,
      tagName: 'body',
      removable: false,
      copyable: false,
      draggable: false,
      components: [],
      traits: [],
      doctype: '',
      head: null,
      docEl: null,
      stylable: [
        'background',
        'background-color',
        'background-image',
        'background-repeat',
        'background-attachment',
        'background-position',
        'background-size',
      ],
    };
  }

  constructor(props: ComponentProperties = {}, opt: ComponentOptions) {
    super(props, opt);

    const hasDataResolver = this.dataResolverProps;
    if (hasDataResolver) {
      this.onDataSourceChange();
      this.syncComponentsCollectionState();
    }
  }

  preInit() {
    const { opt, attributes: props } = this;
    const cmp = this.em?.Components;
    const CmpHead = cmp?.getType(typeHead)?.model;
    const CmpDef = cmp?.getType('default').model;
    if (CmpHead) {
      const { head, docEl } = props;
      this.set(
        {
          head: head && head instanceof Component ? head : new CmpHead({ ...head }, opt),
          docEl: docEl && docEl instanceof Component ? docEl : new CmpDef({ tagName: 'html', ...docEl }, opt),
        },
        { silent: true },
      );
    }
  }

  get head(): ComponentHead {
    return this.get('head');
  }

  get docEl(): Component {
    return this.get('docEl');
  }

  get doctype(): string {
    return this.attributes.doctype || '';
  }

  clone(opt?: { symbol?: boolean | undefined; symbolInv?: boolean | undefined }): this {
    const result = super.clone(opt);
    result.set('head', this.get('head').clone(opt));
    result.set('docEl', this.get('docEl').clone(opt));

    return result;
  }

  toHTML(opts: ToHTMLOptions = {}) {
    const { doctype } = this;
    const asDoc = !isUndefined(opts.asDocument) ? opts.asDocument : !!doctype;
    const { head, docEl } = this;
    const body = super.toHTML(opts);
    const headStr = (asDoc && head?.toHTML(opts)) || '';
    const docElAttr = (asDoc && attrToString(docEl?.getAttrToHTML())) || '';
    const docElAttrStr = docElAttr ? ` ${docElAttr}` : '';
    return asDoc ? `${doctype}<html${docElAttrStr}>${headStr}${body}</html>` : body;
  }

  onCollectionsStateMapUpdate(collectionsStateMap: DataCollectionStateMap) {
    const { head } = this;
    super.onCollectionsStateMapUpdate(collectionsStateMap);
    head.onCollectionsStateMapUpdate(collectionsStateMap);
  }

  syncComponentsCollectionState() {
    super.syncComponentsCollectionState();
    this.head.syncComponentsCollectionState();
  }

  syncOnComponentChange(model: Component, collection: Components, opts: any) {
    const collectionsStateMap: any = this.getCollectionsStateMap();

    this.collectionsStateMap = collectionsStateMap;
    super.syncOnComponentChange(model, collection, opts);
    this.onCollectionsStateMapUpdate(collectionsStateMap);
  }

  get resolverCurrentItem(): ResolverCurrentItemType | undefined {
    return this._resolverCurrentItem;
  }

  set resolverCurrentItem(value: ResolverCurrentItemType) {
    this._resolverCurrentItem = value;
    this.onCollectionsStateMapUpdate(this.getCollectionsStateMap());
  }

  setResolverCurrentItem(value: ResolverCurrentItemType) {
    this.resolverCurrentItem = value;
  }

  getCollectionsState() {
    const collectionId = `${DataCollectionKeys.rootData}`;
    const { dataResolverPath, resolverCurrentItem } = this;
    const result = { collectionId };
    if (!dataResolverPath) return result;

    let prevItem: Record<string, any> | undefined;
    let currentItem: Record<string, any> | undefined;
    let nextItem: Record<string, any> | undefined;

    const allItems: Record<string, any> | Record<string, any>[] = this.getDataSourceItems();
    const allItemsArray = isArray(allItems) ? allItems : Object.values(allItems || {});
    let currentIndex = resolverCurrentItem;

    if (isNumber(resolverCurrentItem)) {
      currentItem = allItemsArray[resolverCurrentItem];
      prevItem = allItemsArray[resolverCurrentItem - 1];
      nextItem = allItemsArray[resolverCurrentItem + 1];
    } else {
      const entries = Object.entries(allItems).map(([id, value]) => ({ id, ...value }));
      const idx = entries.findIndex((it) => it?.id === resolverCurrentItem);
      currentIndex = idx;
      currentItem = allItemsArray[idx];
      prevItem = allItemsArray[idx - 1];
      nextItem = allItemsArray[idx + 1];
    }

    return {
      ...result,
      prevItem,
      nextItem,
      [DataCollectionStateType.currentItem]: currentItem,
      [DataCollectionStateType.currentIndex]: currentIndex,
      [DataCollectionStateType.totalItems]: allItemsArray.length,
    };
  }

  protected onDataSourceChange() {
    this.onCollectionsStateMapUpdate(this.getCollectionsStateMap());
  }

  protected listenToPropsChange() {
    this.on(`change:dataResolver`, (_, value) => {
      const hasResolver = !isUndefined(value);

      if (hasResolver && !this._isWatchingCollectionStateMap) {
        this._isWatchingCollectionStateMap = true;
        this.syncComponentsCollectionState();
        this.onCollectionsStateMapUpdate(this.getCollectionsStateMap());
        this.listenToDataSource();
      } else if (!hasResolver && this._isWatchingCollectionStateMap) {
        this._isWatchingCollectionStateMap = false;
        this.stopSyncComponentCollectionState();
      }
    });

    this.listenToDataSource();
  }

  private getCollectionsStateMap(): DataCollectionStateMap {
    if (!this.dataResolverPath) return {};

    return {
      [DataCollectionKeys.rootData]: this.getCollectionsState(),
    } as DataCollectionStateMap;
  }

  __postAdd() {
    const um = this.em?.UndoManager;
    !this.__hasUm && um?.add(this);
    return super.__postAdd();
  }

  __postRemove() {
    const um = this.em?.UndoManager;
    um?.remove(this);
    return super.__postRemove();
  }

  static isComponent() {
    return false;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ModelDataResolverWatchers.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/model/ModelDataResolverWatchers.ts

```typescript
import { ObjectAny } from '../../common';
import {
  ModelResolverWatcher,
  ModelResolverWatcherOptions,
  DataWatchersOptions,
  WatchableModel,
} from './ModelResolverWatcher';
import { getSymbolsToUpdate, isSymbol } from './SymbolUtils';
import Component, { keySymbolOvrd } from './Component';
import { StyleableModelProperties } from '../../domain_abstract/model/StyleableModel';
import { isEmpty, isObject } from 'underscore';

export const updateFromWatcher = { fromDataSource: true, avoidStore: true };
export const keyDataValues = '__data_values';

export class ModelDataResolverWatchers<T extends StyleableModelProperties> {
  private propertyWatcher: ModelResolverWatcher<T>;
  private attributeWatcher: ModelResolverWatcher<T>;
  private styleWatcher: ModelResolverWatcher<T>;

  constructor(
    private model: WatchableModel<T>,
    private options: ModelResolverWatcherOptions,
  ) {
    this.propertyWatcher = new ModelResolverWatcher(model, this.onPropertyUpdate, options);
    this.attributeWatcher = new ModelResolverWatcher(model, this.onAttributeUpdate, options);
    this.styleWatcher = new ModelResolverWatcher(model, this.onStyleUpdate, options);
  }

  bindModel(model: WatchableModel<T>) {
    this.model = model;
    this.watchers.forEach((watcher) => watcher.bindModel(model));
    this.updateSymbolOverride();
  }

  addProps(props: ObjectAny, options: DataWatchersOptions = {}) {
    const dataValues = props[keyDataValues] ?? {};

    const filteredProps = this.filterProps(props);
    const evaluatedProps = {
      ...props,
      ...this.propertyWatcher.addDataValues({ ...filteredProps, ...dataValues.props }, options),
    };

    if (this.shouldProcessProp('attributes', props, dataValues)) {
      evaluatedProps.attributes = this.processAttributes(props, dataValues, options);
    }

    if (this.shouldProcessProp('style', props, dataValues)) {
      evaluatedProps.style = this.processStyles(props, dataValues, options);
    }

    const skipOverrideUpdates = options.skipWatcherUpdates || options.fromDataSource;
    if (!skipOverrideUpdates) {
      this.updateSymbolOverride();
      evaluatedProps[keyDataValues] = {
        props: this.propertyWatcher.getAllDataResolvers(),
        style: this.styleWatcher.getAllDataResolvers(),
        attributes: this.attributeWatcher.getAllDataResolvers(),
      };
    }

    return evaluatedProps;
  }

  getProps(data: ObjectAny): ObjectAny {
    const resolvedProps = this.getValueOrResolver('props', data);
    const result = {
      ...resolvedProps,
    };
    delete result[keyDataValues];

    if (!isEmpty(data.attributes)) {
      result.attributes = this.getValueOrResolver('attributes', data.attributes);
    }

    if (isObject(data.style) && !isEmpty(data.style)) {
      result.style = this.getValueOrResolver('styles', data.style);
    }

    return result;
  }

  /**
   * Resolves properties, styles, or attributes to their final values or returns the data resolvers.
   * - If `data` is `null` or `undefined`, the method returns an object containing all data resolvers for the specified `target`.
   */
  getValueOrResolver(target: 'props' | 'styles' | 'attributes', data?: ObjectAny) {
    let watcher;

    switch (target) {
      case 'props':
        watcher = this.propertyWatcher;
        break;
      case 'styles':
        watcher = this.styleWatcher;
        break;
      case 'attributes':
        watcher = this.attributeWatcher;
        break;
      default: {
        const { em } = this.options;
        em?.logError(`Invalid target '${target}'. Must be 'props', 'styles', or 'attributes'.`);
        return {};
      }
    }

    if (!data) {
      return watcher.getAllDataResolvers();
    }

    return watcher.getValuesOrResolver(data);
  }

  removeAttributes(attributes: string[]) {
    this.attributeWatcher.removeListeners(attributes);
    this.updateSymbolOverride();
  }

  /**
   * Disables inline style management for the component. Style handling is shifted to CSS rules
   */
  disableStyles() {
    this.styleWatcher.removeListeners();
    this.styleWatcher.destroy();
  }

  onCollectionsStateMapUpdate() {
    this.watchers.forEach((watcher) => watcher.onCollectionsStateMapUpdate());
  }

  destroy() {
    this.watchers.forEach((watcher) => watcher.destroy());
  }

  private get watchers() {
    return [this.propertyWatcher, this.styleWatcher, this.attributeWatcher];
  }

  private isComponent(model: any): model is Component {
    return model instanceof Component;
  }

  private onPropertyUpdate = (model: WatchableModel<T>, key: string, value: any) => {
    model?.set(key, value, updateFromWatcher);
  };

  private onAttributeUpdate = (model: WatchableModel<T>, key: string, value: any) => {
    if (!this.isComponent(model)) return;
    model?.addAttributes({ [key]: value }, updateFromWatcher);
  };

  private onStyleUpdate = (model: WatchableModel<T>, key: string, value: any) => {
    model?.addStyle({ [key]: value }, { ...updateFromWatcher, partial: true, avoidStore: true });
  };

  private shouldProcessProp(key: 'attributes' | 'style', newProps: ObjectAny, dataValues: ObjectAny): boolean {
    const watcher = key === 'attributes' ? this.attributeWatcher : this.styleWatcher;
    const dataSubProps = dataValues[key];

    const hasNewValues = !!newProps[key];
    const hasExistingDataValues = dataSubProps && Object.keys(dataSubProps).length > 0;
    const hasApplicableWatchers = dataSubProps && Object.keys(watcher.getAllDataResolvers()).length > 0;

    return hasNewValues || hasExistingDataValues || hasApplicableWatchers;
  }

  private updateSymbolOverride() {
    const { model } = this;
    if (!this.isComponent(model) || !isSymbol(model)) return;

    const isCollectionItem = !!Object.keys(model?.collectionsStateMap ?? {}).length;
    if (!isCollectionItem) return;

    const keys = this.propertyWatcher.getValuesResolvingFromCollections();
    const attributesKeys = this.attributeWatcher.getValuesResolvingFromCollections();

    const combinedKeys = ['locked', 'layerable', ...keys];
    const haveOverridenAttributes = Object.keys(attributesKeys).length;
    if (haveOverridenAttributes) combinedKeys.push('attributes');

    const toUp = getSymbolsToUpdate(model);
    toUp.forEach((child) => {
      child.setSymbolOverride(combinedKeys, { fromDataSource: true });
    });
    model.setSymbolOverride(combinedKeys, { fromDataSource: true });
  }

  private filterProps(props: ObjectAny) {
    const excludedFromEvaluation = [
      'components',
      'dataResolver',
      'status',
      'state',
      'open',
      keySymbolOvrd,
      keyDataValues,
    ];
    const filteredProps = Object.fromEntries(
      Object.entries(props).filter(([key]) => !excludedFromEvaluation.includes(key)),
    );

    return filteredProps;
  }

  private processAttributes(baseValue: ObjectAny, dataValues: ObjectAny, options: DataWatchersOptions = {}) {
    return this.attributeWatcher.setDataValues({ ...baseValue.attributes, ...(dataValues.attributes ?? {}) }, options);
  }

  private processStyles(baseValue: ObjectAny | string, dataValues: ObjectAny, options: DataWatchersOptions = {}) {
    if (typeof baseValue === 'string') {
      this.styleWatcher.removeListeners();
      return baseValue;
    }

    return this.styleWatcher.setDataValues({ ...baseValue.style, ...(dataValues.style ?? {}) }, options);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ModelResolverWatcher.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/model/ModelResolverWatcher.ts

```typescript
import { ObjectAny, ObjectHash } from '../../common';
import DataResolverListener from '../../data_sources/model/DataResolverListener';
import { getDataResolverInstance, getDataResolverInstanceValue, isDataResolverProps } from '../../data_sources/utils';
import StyleableModel from '../../domain_abstract/model/StyleableModel';
import EditorModel from '../../editor/model/Editor';

export interface DataWatchersOptions {
  skipWatcherUpdates?: boolean;
  fromDataSource?: boolean;
}

export interface ModelResolverWatcherOptions {
  em: EditorModel;
}

export type WatchableModel<T extends ObjectHash> = StyleableModel<T> | undefined;
export type UpdateFn<T extends ObjectHash> = (component: WatchableModel<T>, key: string, value: any) => void;

export class ModelResolverWatcher<T extends ObjectHash> {
  private em: EditorModel;
  private resolverListeners: Record<string, DataResolverListener> = {};

  constructor(
    private model: WatchableModel<T>,
    private updateFn: UpdateFn<T>,
    options: ModelResolverWatcherOptions,
  ) {
    this.em = options.em;
  }

  bindModel(model: WatchableModel<T>) {
    this.model = model;
  }

  setDataValues(values: ObjectAny | undefined, options: DataWatchersOptions = {}) {
    const shouldSkipWatcherUpdates = options.skipWatcherUpdates || options.fromDataSource;
    if (!shouldSkipWatcherUpdates) {
      this.removeListeners();
    }

    return this.addDataValues(values, options);
  }

  addDataValues(values: ObjectAny | undefined, options: DataWatchersOptions = {}) {
    if (!values) return {};
    const evaluatedValues = this.evaluateValues(values);

    const shouldSkipWatcherUpdates = options.skipWatcherUpdates || options.fromDataSource;
    if (!shouldSkipWatcherUpdates) {
      this.updateListeners(values);
    }

    return evaluatedValues;
  }

  onCollectionsStateMapUpdate() {
    const resolvesFromCollections = this.getValuesResolvingFromCollections();
    if (!resolvesFromCollections.length) return;

    const evaluatedValues = this.addDataValues(
      this.getValuesOrResolver(Object.fromEntries(resolvesFromCollections.map((key) => [key, '']))),
    );

    Object.entries(evaluatedValues).forEach(([key, value]) => this.updateFn(this.model, key, value));
  }

  private get collectionsStateMap() {
    const component = this.model;

    return component?.collectionsStateMap ?? {};
  }

  private updateListeners(values: { [key: string]: any }) {
    const { em, collectionsStateMap } = this;
    this.removeListeners(Object.keys(values));
    const propsKeys = Object.keys(values);

    for (let index = 0; index < propsKeys.length; index++) {
      const key = propsKeys[index];
      const resolverProps = values[key];

      if (!isDataResolverProps(resolverProps)) {
        continue;
      }

      const resolver = getDataResolverInstance(resolverProps, { em, collectionsStateMap })!;
      this.resolverListeners[key] = new DataResolverListener({
        em,
        resolver,
        onUpdate: (value) => this.updateFn(this.model, key, value),
      });
    }
  }

  private evaluateValues(values: ObjectAny) {
    const { em, collectionsStateMap } = this;
    const evaluatedValues = { ...values };
    const propsKeys = Object.keys(values);

    for (let index = 0; index < propsKeys.length; index++) {
      const key = propsKeys[index];
      const resolverProps = values[key];

      if (!isDataResolverProps(resolverProps)) {
        continue;
      }

      evaluatedValues[key] = getDataResolverInstanceValue(resolverProps, { em, collectionsStateMap });
    }

    return evaluatedValues;
  }

  /**
   * removes listeners to stop watching for changes,
   * if keys argument is omitted, remove all listeners
   * @argument keys
   */
  removeListeners(keys?: string[]) {
    const propsKeys = keys ? keys : Object.keys(this.resolverListeners);

    propsKeys.forEach((key) => {
      if (this.resolverListeners[key]) {
        this.resolverListeners[key].destroy?.();
        delete this.resolverListeners[key];
      }
    });

    return propsKeys;
  }

  getValuesOrResolver(values: ObjectAny) {
    if (!values) return {};
    const serializableValues: ObjectAny = { ...values };
    const propsKeys = Object.keys(serializableValues);

    for (let index = 0; index < propsKeys.length; index++) {
      const key = propsKeys[index];
      const resolverListener = this.resolverListeners[key];
      if (resolverListener) {
        serializableValues[key] = resolverListener.resolver.toJSON();
      }
    }

    return serializableValues;
  }

  getAllDataResolvers() {
    const serializableValues: ObjectAny = {};
    const propsKeys = Object.keys(this.resolverListeners);

    for (let index = 0; index < propsKeys.length; index++) {
      const key = propsKeys[index];
      serializableValues[key] = this.resolverListeners[key].resolver.toJSON();
    }

    return serializableValues;
  }

  getValuesResolvingFromCollections() {
    const keys = Object.keys(this.resolverListeners).filter((key: string) => {
      return this.resolverListeners[key].resolver.resolvesFromCollection();
    });

    return keys;
  }

  destroy() {
    this.removeListeners();
  }
}
```

--------------------------------------------------------------------------------

---[FILE: Symbols.ts]---
Location: grapesjs-dev/packages/core/src/dom_components/model/Symbols.ts

```typescript
import { debounce } from 'underscore';
import { Debounced, ObjectAny } from '../../common';
import Component from './Component';
import Components from './Components';
import { detachSymbolInstance, getSymbolInstances } from './SymbolUtils';

interface PropsComponentUpdate {
  component: Component;
  changed: ObjectAny;
  options: ObjectAny;
}

export default class Symbols extends Components {
  refreshDbn: Debounced;

  constructor(...args: ConstructorParameters<typeof Components>) {
    super(...args);
    this.refreshDbn = debounce(() => this.refresh(), 0);
    const { events } = this;
    this.on(events.update, this.onUpdate);
    this.on(events.updateInside, this.onUpdateDeep);
  }

  removeChildren(component: Component, coll?: Components, opts: any = {}) {
    super.removeChildren(component, coll, opts);
    getSymbolInstances(component)?.forEach((i) => detachSymbolInstance(i, { skipRefs: true }));
    this.__trgEvent(this.events.symbolMainRemove, { component });
  }

  onAdd(...args: Parameters<Components['onAdd']>) {
    super.onAdd(...args);
    const [component] = args;
    this.__trgEvent(this.events.symbolMainAdd, { component });
  }

  onUpdate(props: PropsComponentUpdate) {
    this.__trgEvent(this.events.symbolMainUpdate, props);
  }

  onUpdateDeep(props: PropsComponentUpdate) {
    this.__trgEvent(this.events.symbolMainUpdateDeep, props);
  }

  refresh() {
    const { em, events } = this;
    em.trigger(events.symbol);
  }

  __trgEvent(event: string, props: ObjectAny, isInstance = false) {
    const { em, events } = this;
    const eventType = isInstance ? events.symbolInstance : events.symbolMain;
    em.trigger(event, props);
    em.trigger(eventType, { ...props, event });
    this.refreshDbn();
  }
}
```

--------------------------------------------------------------------------------

````
