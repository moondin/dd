---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 24
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 24 of 97)

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
Location: grapesjs-dev/packages/core/src/asset_manager/index.ts

```typescript
/**
 * You can customize the initial state of the module from the editor initialization, by passing the following [Configuration Object](https://github.com/GrapesJS/grapesjs/blob/master/src/asset_manager/config/config.ts)
 * ```js
 * const editor = grapesjs.init({
 *  assetManager: {
 *    // options
 *  }
 * })
 * ```
 *
 * Once the editor is instantiated you can use its API. Before using these methods you should get the module from the instance
 *
 * ```js
 * const assetManager = editor.AssetManager;
 * ```
 *
 * {REPLACE_EVENTS}
 *
 * ## Methods
 * * [open](#open)
 * * [close](#close)
 * * [isOpen](#isopen)
 * * [add](#add)
 * * [get](#get)
 * * [getAll](#getall)
 * * [getAllVisible](#getallvisible)
 * * [remove](#remove)
 * * [getContainer](#getcontainer)
 *
 * [Asset]: asset.html
 *
 * @module Assets
 */

import { debounce, isFunction } from 'underscore';
import { ItemManagerModule } from '../abstract/Module';
import { AddOptions, RemoveOptions } from '../common';
import EditorModel from '../editor/model/Editor';
import { ProjectData } from '../storage_manager';
import defConfig, { AssetManagerConfig } from './config/config';
import Asset from './model/Asset';
import Assets from './model/Assets';
import AssetsEvents, { AssetAddInput, AssetOpenOptions, AssetProps } from './types';
import AssetsView from './view/AssetsView';
import FileUploaderView from './view/FileUploader';

const assetCmd = 'open-assets';

export default class AssetManager extends ItemManagerModule<AssetManagerConfig, Assets> {
  storageKey = 'assets';
  Asset = Asset;
  Assets = Assets;
  assetsVis: Assets;
  am?: AssetsView;
  fu?: FileUploaderView;
  _bhv?: any;
  events = AssetsEvents;

  /**
   * Initialize module
   * @param {Object} config Configurations
   * @private
   */
  constructor(em: EditorModel) {
    // @ts-ignore
    super(em, 'AssetManager', new Assets([], em), AssetsEvents, defConfig());
    const { all, config } = this;
    // @ts-ignore
    this.assetsVis = new Assets([]);
    const ppfx = config.pStylePrefix;
    if (ppfx) {
      config.stylePrefix = `${ppfx}${config.stylePrefix}`;
    }

    // Setup the sync between the global and public collections
    all.on('add', (model: Asset) => this.getAllVisible().add(model));
    all.on('remove', (model: Asset) => this.getAllVisible().remove(model));

    this.__onAllEvent = debounce(() => this.__trgCustom(), 0);

    return this;
  }

  /**
   * Open the asset manager.
   * @param {Object} [options] Options for the asset manager.
   * @param {Array<String>} [options.types=['image']] Types of assets to show.
   * @param {Function} [options.select] Type of operation to perform on asset selection. If not specified, nothing will happen.
   * @example
   * assetManager.open({
   *  select(asset, complete) {
   *    const selected = editor.getSelected();
   *    if (selected && selected.is('image')) {
   *      selected.addAttributes({ src: asset.getSrc() });
   *      // The default AssetManager UI will trigger `select(asset, false)` on asset click
   *      // and `select(asset, true)` on double-click
   *      complete && assetManager.close();
   *    }
   *  }
   * });
   * // with your custom types (you should have assets with those types declared)
   * assetManager.open({ types: ['doc'], ... });
   */
  open(options: AssetOpenOptions = {}) {
    const cmd = this.em.Commands;
    cmd.run(assetCmd, {
      types: ['image'],
      select: () => {},
      ...options,
    });
  }

  /**
   * Close the asset manager.
   * @example
   * assetManager.close();
   */
  close() {
    const cmd = this.em.Commands;
    cmd.stop(assetCmd);
  }

  /**
   * Checks if the asset manager is open
   * @returns {Boolean}
   * @example
   * assetManager.isOpen(); // true | false
   */
  isOpen() {
    const cmd = this.em.Commands;
    return !!cmd?.isActive(assetCmd);
  }

  /**
   * Add new asset/s to the collection. URLs are supposed to be unique
   * @param {String|Object|Array<String>|Array<Object>} asset URL strings or an objects representing the resource.
   * @param {Object} [opts] Options
   * @returns {[Asset]}
   * @example
   * // As strings
   * assetManager.add('http://img.jpg');
   * assetManager.add(['http://img.jpg', './path/to/img.png']);
   *
   * // Using objects you can indicate the type and other meta informations
   * assetManager.add({
   *  // type: 'image',	// image is default
   * 	src: 'http://img.jpg',
   * 	height: 300,
   *	width: 200,
   * });
   * assetManager.add([{ src: 'img2.jpg' }, { src: 'img2.png' }]);
   */
  add(asset: AssetAddInput | AssetAddInput[], opts: AddOptions = {}) {
    // Put the model at the beginning
    if (typeof opts.at == 'undefined') {
      opts.at = 0;
    }

    return this.all.add(asset, opts);
  }

  /**
   * Return asset by URL
   * @param  {String} src URL of the asset
   * @returns {[Asset]|null}
   * @example
   * const asset = assetManager.get('http://img.jpg');
   */
  get(src: string): Asset | null {
    return this.all.where({ src })[0] || null;
  }

  /**
   * Return the global collection, containing all the assets
   * @returns {Collection<[Asset]>}
   */
  getAll() {
    return this.all;
  }

  /**
   * Return the visible collection, which contains assets actually rendered
   * @returns {Collection<[Asset]>}
   */
  getAllVisible() {
    return this.assetsVis;
  }

  /**
   * Remove asset
   * @param {String|[Asset]} asset Asset or asset URL
   * @returns {[Asset]} Removed asset
   * @example
   * const removed = assetManager.remove('http://img.jpg');
   * // or by passing the Asset
   * const asset = assetManager.get('http://img.jpg');
   * assetManager.remove(asset);
   */
  remove(asset: string | Asset, opts?: RemoveOptions) {
    return this.__remove(asset, opts);
  }

  store() {
    return this.getProjectData();
  }

  load(data: ProjectData) {
    return this.loadProjectData(data);
  }

  /**
   * Return the Asset Manager Container
   * @returns {HTMLElement}
   */
  getContainer() {
    const bhv = this.__getBehaviour();
    return bhv.container || this.am?.el;
  }

  /**
   *  Get assets element container
   * @returns {HTMLElement}
   * @private
   */
  getAssetsEl() {
    return this.am?.el.querySelector('[data-el=assets]');
  }

  /**
   * Render assets
   * @param  {array} assets Assets to render, without the argument will render all global assets
   * @returns {HTMLElement}
   * @private
   * @example
   * // Render all assets
   * assetManager.render();
   *
   * // Render some of the assets
   * const assets = assetManager.getAll();
   * assetManager.render(assets.filter(
   *  asset => asset.get('category') == 'cats'
   * ));
   */
  render(assts?: Asset[]) {
    if (this.getConfig().custom) return;
    const toRender = assts || this.getAll().models;

    if (!this.am) {
      const obj = this.__viewParams();
      obj.fu = this.FileUploader();
      this.am = new AssetsView({ ...obj });
      this.am.render();
    }

    this.assetsVis.reset(toRender);
    return this.getContainer();
  }

  __viewParams() {
    return {
      collection: this.assetsVis, // Collection visible in asset manager
      globalCollection: this.all,
      config: this.config,
      module: this as AssetManager,
      fu: undefined as any,
    };
  }

  /**
   * Add new type. If you want to get more about type definition we suggest to read the [module's page](/modules/Assets.html)
   * @param {string} id Type ID
   * @param {Object} definition Definition of the type. Each definition contains
   *                            `model` (business logic), `view` (presentation logic)
   *                            and `isType` function which recognize the type of the
   *                            passed entity
   * @private
   * @example
   * assetManager.addType('my-type', {
   *  model: {},
   *  view: {},
   *  isType: (value) => {},
   * })
   */
  addType(id: string, definition: any) {
    this.getAll().addType(id, definition);
  }

  /**
   * Get type
   * @param {string} id Type ID
   * @returns {Object} Type definition
   * @private
   */
  getType(id: string) {
    return this.getAll().getType(id);
  }

  /**
   * Get types
   * @returns {Array}
   * @private
   */
  getTypes() {
    return this.getAll().getTypes();
  }

  //-------

  AssetsView() {
    return this.am;
  }

  FileUploader() {
    if (!this.fu) {
      this.fu = new FileUploaderView(this.__viewParams());
    }
    return this.fu;
  }

  onLoad() {
    this.getAll().reset(this.config.assets);
    const { em, events } = this;
    em.Commands.__onRun(assetCmd, () => this.__propEv(events.open));
    em.Commands.__onStop(assetCmd, () => this.__propEv(events.close));
  }

  postRender(editorView: any) {
    this.config.dropzone && this.fu?.initDropzone(editorView);
  }

  /**
   * Set new target
   * @param	{Object}	m Model
   * @private
   * */
  setTarget(m: any) {
    this.assetsVis.target = m;
  }

  /**
   * Set callback after asset was selected
   * @param	{Object}	f Callback function
   * @private
   * */
  onSelect(f: any) {
    this.assetsVis.onSelect = f;
  }

  /**
   * Set callback to fire when the asset is clicked
   * @param {function} func
   * @private
   */
  onClick(func: any) {
    // @ts-ignore
    this.config.onClick = func;
  }

  /**
   * Set callback to fire when the asset is double clicked
   * @param {function} func
   * @private
   */
  onDblClick(func: any) {
    // @ts-ignore
    this.config.onDblClick = func;
  }

  __propEv(ev: string, ...data: any[]) {
    this.em.trigger(ev, ...data);
    this.getAll().trigger(ev, ...data);
  }

  __trgCustom() {
    const bhv = this.__getBehaviour();
    const custom = this.getConfig().custom;

    if (!bhv.container && !(custom as any).open) {
      return;
    }
    this.em.trigger(this.events.custom, this.__customData());
  }

  __customData() {
    const bhv = this.__getBehaviour();
    return {
      am: this as AssetManager,
      open: this.isOpen(),
      assets: this.getAll().models,
      types: bhv.types || [],
      container: bhv.container,
      close: () => this.close(),
      remove: (asset: string | Asset, opts?: Record<string, any>) => this.remove(asset, opts),
      select: (asset: Asset, complete: boolean) => {
        const res = this.add(asset);
        isFunction(bhv.select) && bhv.select(res, complete);
      },
      // extra
      options: bhv.options || {},
    };
  }

  __behaviour(opts = {}) {
    return (this._bhv = {
      ...(this._bhv || {}),
      ...opts,
    });
  }

  __getBehaviour(opts = {}) {
    return this._bhv || {};
  }

  destroy() {
    this.all.stopListening();
    this.all.reset();
    this.assetsVis.stopListening();
    this.assetsVis.reset();
    this.fu?.remove();
    this.am?.remove();
    this._bhv = {};
  }
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: grapesjs-dev/packages/core/src/asset_manager/types.ts

```typescript
import AssetManager from '.';
import {
  EventCallbackAdd,
  EventCallbackAll,
  EventCallbackRemove,
  EventCallbackRemoveBefore,
  EventCallbackUpdate,
  ObjectAny,
} from '../common';
import ComponentView from '../dom_components/view/ComponentView';
import Asset from './model/Asset';

export type AssetEvent = `${AssetsEvents}`;

export type AssetAddInput = string | AssetProps | Asset;

export interface AssetOpenOptions {
  select?: (asset: Asset, complete: boolean) => void;
  types?: string[];
  accept?: string;
  target?: any;
}

export interface AssetsCustomData {
  am: AssetManager;
  open: boolean;
  assets: Asset[];
  types: string[];
  container: HTMLElement | undefined;
  close: () => void;
  remove: (asset: Asset, opts?: ObjectAny) => Asset;
  select: (asset: Asset, complete?: boolean) => void;
  options: AssetOpenOptions;
}

export interface AssetProps {
  src: string;
  [key: string]: unknown;
}

export interface UploadFileOptions {
  componentView?: ComponentView;
  file?: File;
}

export type UploadFileClb = (result: { data: (AssetProps | string)[] }) => void;

export type UploadFileFn = (ev: DragEvent, clb?: UploadFileClb, opts?: UploadFileOptions) => Promise<void> | undefined;

/**{START_EVENTS}*/
export enum AssetsEvents {
  /**
   * @event `asset:add` New asset added to the collection. The [Asset] is passed as an argument to the callback.
   * @example
   * editor.on('asset:add', (asset) => { ... });
   */
  add = 'asset:add',

  /**
   * @event `asset:remove` Asset removed from the collection. The [Asset] is passed as an argument to the callback.
   * @example
   * editor.on('asset:remove', (asset) => { ... });
   */
  remove = 'asset:remove',
  removeBefore = 'asset:remove:before',

  /**
   * @event `asset:update` Asset updated. The [Asset] and the object containing changes are passed as arguments to the callback.
   * @example
   * editor.on('asset:update', (asset, updatedProps) => { ... });
   */
  update = 'asset:update',

  /**
   * @event `asset:open` Asset Manager opened.
   * @example
   * editor.on('asset:open', () => { ... });
   */
  open = 'asset:open',

  /**
   * @event `asset:close` Asset Manager closed.
   * @example
   * editor.on('asset:close', () => { ... });
   */
  close = 'asset:close',

  /**
   * @event `asset:upload:start` Asset upload start.
   * @example
   * editor.on('asset:upload:start', () => { ... });
   */
  uploadStart = 'asset:upload:start',

  /**
   * @event `asset:upload:end` Asset upload end.
   * @example
   * editor.on('asset:upload:end', (result) => { ... });
   */
  uploadEnd = 'asset:upload:end',

  /**
   * @event `asset:upload:error` Asset upload error.
   * @example
   * editor.on('asset:upload:error', (error) => { ... });
   */
  uploadError = 'asset:upload:error',

  /**
   * @event `asset:upload:response` Asset upload response.
   * @example
   * editor.on('asset:upload:response', (res) => { ... });
   */
  uploadResponse = 'asset:upload:response',

  /**
   * @event `asset:custom` Event to use in case of [custom Asset Manager UI](https://grapesjs.com/docs/modules/Assets.html#customization).
   * @example
   * editor.on('asset:custom', ({ container, assets, ... }) => { ... });
   */
  custom = 'asset:custom',

  /**
   * @event `asset` Catch-all event for all the events mentioned above. An object containing all the available data about the triggered event is passed as an argument to the callback.
   * @example
   * editor.on('asset', ({ event, model, ... }) => { ... });
   */
  all = 'asset',
}
/**{END_EVENTS}*/

export interface AssetsEventCallback {
  [AssetsEvents.add]: EventCallbackAdd<Asset>;
  [AssetsEvents.remove]: EventCallbackRemove<Asset>;
  [AssetsEvents.removeBefore]: EventCallbackRemoveBefore<Asset>;
  [AssetsEvents.update]: EventCallbackUpdate<Asset>;
  [AssetsEvents.open]: [];
  [AssetsEvents.close]: [];
  [AssetsEvents.uploadStart]: [];
  [AssetsEvents.uploadEnd]: [any];
  [AssetsEvents.uploadError]: [Error];
  [AssetsEvents.uploadResponse]: [any];
  [AssetsEvents.custom]: [AssetsCustomData];
  [AssetsEvents.all]: EventCallbackAll<AssetEvent, Asset>;
}

// need this to avoid the TS documentation generator to break
export default AssetsEvents;
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: grapesjs-dev/packages/core/src/asset_manager/config/config.ts

```typescript
import { UploadFileFn } from '../types';

export interface AssetManagerConfig {
  /**
   * Default assets.
   * @example
   * [
   *  'https://...image1.png',
   *  'https://...image2.png',
   *  {type: 'image', src: 'https://...image3.png', someOtherCustomProp: 1}
   * ]
   */
  assets?: (string | Record<string, any>)[];
  /**
   * Content to add where there is no assets to show.
   * @default ''
   * @example 'No <b>assets</b> here, drag to upload'
   */
  noAssets?: string;
  /**
   * Style prefix
   * @default 'am-'
   */
  stylePrefix?: string;
  /**
   * Upload endpoint, set `false` to disable upload.
   * @example 'https://endpoint/upload/assets'
   */
  upload?: false | string;
  /**
   * The name used in POST to pass uploaded files.
   * @default 'files'
   */
  uploadName?: string;
  /**
   * Custom headers to pass with the upload request.
   * @default {}
   */
  headers?: Record<string, any>;
  /**
   * Custom parameters to pass with the upload request, eg. csrf token.
   * @default {}
   */
  params?: Record<string, any>;
  /**
   * The credentials setting for the upload request, eg. 'include', 'omit'.
   * @default 'include'
   */
  credentials?: RequestCredentials;
  /**
   * Allow uploading multiple files per request. If disabled filename will not have the 'multiUploadSuffix' appended.
   * @default true
   */
  multiUpload?: boolean;
  /**
   * The suffix to append to 'uploadName' when 'multiUpload' is true.
   * @default '[]'
   */
  multiUploadSuffix?: string;
  /**
   * If true, tries to add automatically uploaded assets. To make it work the server should respond with a JSON containing assets in a data key, eg:
   * { data: [ 'https://.../image.png', {src: 'https://.../image2.png'} ]
   * @default true
   */
  autoAdd?: boolean;
  /**
   * Customize the options passed to the default Fetch API.
   * @example
   * fetchOptions: (options) => ({ ...options, method: 'put' }),
   */
  fetchOptions?: (options: RequestInit) => RequestInit;
  /**
   * To upload your assets, the module uses Fetch API. With this option you can overwrite it with your own logic. The custom function should return a Promise.
   * @example
   * customFetch: (url, options) => axios(url, { data: options.body }),
   */
  customFetch?: (url: string, options: Record<string, any>) => Promise<void>;
  /**
   * Custom uploadFile function.
   * Differently from the `customFetch` option, this gives a total control over the uploading process, but you also have to emit all `asset:upload:*` events b
   * y yourself (if you need to use them somewhere).
   * @example
   * uploadFile: (ev) => {
   *  const files = ev.dataTransfer ? ev.dataTransfer.files : ev.target.files;
   *  // ...send somewhere
   * }
   */
  uploadFile?: UploadFileFn;
  /**
   * In the absence of 'uploadFile' or 'upload' assets will be embedded as Base64.
   * @default true
   */
  embedAsBase64?: boolean;
  /**
   * Handle the image url submit from the built-in 'Add image' form.
   * @example
   * handleAdd: (textFromInput) => {
   *   // some check...
   *   editor.AssetManager.add(textFromInput);
   * }
   */
  handleAdd?: (value: string) => void;
  /**
   * Method called before upload, on return false upload is canceled.
   * @example
   * beforeUpload: (files) => {
   *  // logic...
   *  const stopUpload = true;
   *  if(stopUpload) return false;
   * }
   */
  beforeUpload?: (files: any) => void | false;
  /**
   * Toggles visiblity of assets url input
   * @default true
   */
  showUrlInput?: boolean;
  /**
   * Avoid rendering the default asset manager.
   * @default false
   */
  custom?:
    | boolean
    | {
        open?: (props: any) => void;
        close?: (props: any) => void;
      };
  /**
   * Enable an upload dropzone on the entire editor (not document) when dragging files over it.
   * If active the dropzone disable/hide the upload dropzone in asset modal, otherwise you will get double drops (#507).
   * @deprecated
   */
  dropzone?: boolean;
  /**
   * Open the asset manager once files are been dropped via the dropzone.
   * @deprecated
   */
  openAssetsOnDrop?: boolean;
  /**
   * Any dropzone content to append inside dropzone element
   * @deprecated
   */
  dropzoneContent?: string;
}

const config: () => AssetManagerConfig = () => ({
  assets: [],
  noAssets: '',
  stylePrefix: 'am-',
  upload: '',
  uploadName: 'files',
  headers: {},
  params: {},
  credentials: 'include',
  multiUpload: true,
  multiUploadSuffix: '[]',
  autoAdd: true,
  customFetch: undefined,
  uploadFile: undefined,
  embedAsBase64: true,
  handleAdd: undefined,
  beforeUpload: undefined,
  showUrlInput: true,
  custom: false,
  dropzone: false,
  openAssetsOnDrop: true,
  dropzoneContent: '',
});

export default config;
```

--------------------------------------------------------------------------------

---[FILE: Asset.ts]---
Location: grapesjs-dev/packages/core/src/asset_manager/model/Asset.ts

```typescript
import { result } from 'underscore';
import { Model } from '../../common';

/**
 * @property {String} type Asset type, eg. `'image'`.
 * @property {String} src Asset URL, eg. `'https://.../image.png'`.
 *
 * @module docsjs.Asset
 */
export default class Asset extends Model {
  static getDefaults() {
    return result(this.prototype, 'defaults');
  }

  defaults() {
    return {
      type: '',
      src: '',
    };
  }

  /**
   * Get asset type.
   * @returns {String}
   * @example
   * // Asset: { src: 'https://.../image.png', type: 'image' }
   * asset.getType(); // -> 'image'
   * */
  getType() {
    return this.get('type');
  }

  /**
   * Get asset URL.
   * @returns {String}
   * @example
   * // Asset: { src: 'https://.../image.png'  }
   * asset.getSrc(); // -> 'https://.../image.png'
   * */
  getSrc() {
    return this.get('src') || '';
  }

  /**
   * Get filename of the asset (based on `src`).
   * @returns {String}
   * @example
   * // Asset: { src: 'https://.../image.png' }
   * asset.getFilename(); // -> 'image.png'
   * // Asset: { src: 'https://.../image' }
   * asset.getFilename(); // -> 'image'
   * */
  getFilename() {
    return this.getSrc().split('/').pop().split('?').shift();
  }

  /**
   * Get extension of the asset (based on `src`).
   * @returns {String}
   * @example
   * // Asset: { src: 'https://.../image.png' }
   * asset.getExtension(); // -> 'png'
   * // Asset: { src: 'https://.../image' }
   * asset.getExtension(); // -> ''
   * */
  getExtension() {
    return this.getFilename().split('.').pop();
  }
}

Asset.prototype.idAttribute = 'src';
```

--------------------------------------------------------------------------------

---[FILE: AssetImage.ts]---
Location: grapesjs-dev/packages/core/src/asset_manager/model/AssetImage.ts

```typescript
import Asset from './Asset';

export default class AssetImage extends Asset {
  defaults() {
    return {
      ...Asset.getDefaults(),
      type: 'image',
      unitDim: 'px',
      height: 0,
      width: 0,
    };
  }
}
```

--------------------------------------------------------------------------------

---[FILE: Assets.ts]---
Location: grapesjs-dev/packages/core/src/asset_manager/model/Assets.ts

```typescript
import { Collection } from '../../common';
import Asset from './Asset';
import AssetImage from './AssetImage';
import AssetImageView from '../view/AssetImageView';
import TypeableCollection from '../../domain_abstract/model/TypeableCollection';

const TypeableCollectionExt = Collection.extend(TypeableCollection);

export default class Assets extends TypeableCollectionExt<Asset> {}

Assets.prototype.types = [
  {
    id: 'image',
    model: AssetImage,
    view: AssetImageView,
    isType(value: string) {
      if (typeof value == 'string') {
        return {
          type: 'image',
          src: value,
        };
      }
      return value;
    },
  },
];
```

--------------------------------------------------------------------------------

---[FILE: AssetImageView.ts]---
Location: grapesjs-dev/packages/core/src/asset_manager/view/AssetImageView.ts

```typescript
import { isFunction } from 'underscore';
import AssetView from './AssetView';
import AssetImage from '../model/AssetImage';
import html from '../../utils/html';

export default class AssetImageView extends AssetView<AssetImage> {
  getPreview() {
    const { pfx, ppfx, model } = this;
    const src = model.get('src');
    return html`
      <div class="${pfx}preview" style="background-image: url('${src}');"></div>
      <div class="${pfx}preview-bg ${ppfx}checker-bg"></div>
    `;
  }

  getInfo() {
    const { pfx, model } = this;
    let name = model.get('name');
    let width = model.get('width');
    let height = model.get('height');
    let unit = model.get('unitDim');
    let dim = width && height ? `${width}x${height}${unit}` : '';
    name = name || model.getFilename();
    return html`
      <div class="${pfx}name">${name}</div>
      <div class="${pfx}dimensions">${dim}</div>
    `;
  }

  // @ts-ignore
  init(o) {
    const pfx = this.pfx;
    this.className += ` ${pfx}asset-image`;
  }

  /**
   * Triggered when the asset is clicked
   * @private
   * */
  onClick() {
    const { model, pfx } = this;
    const { select } = this.__getBhv();
    // @ts-ignore
    const { onClick } = this.config;
    const coll = this.collection;
    coll.trigger('deselectAll');
    this.$el.addClass(pfx + 'highlight');

    if (isFunction(select)) {
      select(model, false);
    } else if (isFunction(onClick)) {
      onClick(model);
    } else {
      // @ts-ignore
      this.updateTarget(coll.target);
    }
  }

  /**
   * Triggered when the asset is double clicked
   * @private
   * */
  onDblClick() {
    const { em, model } = this;
    const { select } = this.__getBhv();
    // @ts-ignore
    const { onDblClick } = this.config;
    // @ts-ignore
    const { target, onSelect } = this.collection;

    if (isFunction(select)) {
      select(model, true);
    } else if (isFunction(onDblClick)) {
      onDblClick(model);
    } else {
      this.updateTarget(target);
      em?.Modal.close();
    }
    isFunction(onSelect) && onSelect(model);
  }

  /**
   * Remove asset from collection
   * @private
   * */
  onRemove(e: Event) {
    e.stopImmediatePropagation();
    this.model.collection.remove(this.model);
  }
}

AssetImageView.prototype.events = {
  // @ts-ignore
  'click [data-toggle=asset-remove]': 'onRemove',
  click: 'onClick',
  dblclick: 'onDblClick',
};
```

--------------------------------------------------------------------------------

---[FILE: AssetsView.ts]---
Location: grapesjs-dev/packages/core/src/asset_manager/view/AssetsView.ts

```typescript
import { View } from '../../common';
import EditorModel from '../../editor/model/Editor';
import { AssetManagerConfig } from '../config/config';
import Asset from '../model/Asset';

export default class AssetsView extends View {
  options: any;
  config: AssetManagerConfig;
  pfx: string;
  ppfx: string;
  em: EditorModel;
  inputUrl?: HTMLInputElement | null;

  template({ pfx, ppfx, em }: AssetsView) {
    let form = '';
    if (this.config.showUrlInput) {
      form = `
          <form class="${pfx}add-asset">
            <div class="${ppfx}field ${pfx}add-field">
              <input placeholder="${em?.t('assetManager.inputPlh')}"/>
            </div>
            <button class="${ppfx}btn-prim">${em?.t('assetManager.addButton')}</button>
            <div style="clear:both"></div>
          </form>
      `;
    }

    return `
    <div class="${pfx}assets-cont">
      <div class="${pfx}assets-header">
        ${form}
      </div>
      <div class="${pfx}assets" data-el="assets"></div>
      <div style="clear:both"></div>
    </div>
    `;
  }

  constructor(o: any = {}) {
    super(o);
    this.options = o;
    this.config = o.config;
    this.pfx = this.config.stylePrefix || '';
    // @ts-ignore
    this.ppfx = this.config.pStylePrefix || '';
    // @ts-ignore
    this.em = this.config.em;
    const coll = this.collection;
    this.listenTo(coll, 'reset', this.renderAssets);
    this.listenTo(coll, 'add', this.addToAsset);
    this.listenTo(coll, 'remove', this.removedAsset);
    this.listenTo(coll, 'deselectAll', this.deselectAll);
  }

  /**
   * Add new asset to the collection via string
   * @param {Event} e Event object
   * @return {this}
   * @private
   */
  handleSubmit(ev: Event) {
    ev.preventDefault();
    const input = this.getAddInput();
    const url = input && input.value.trim();
    const handleAdd = this.config.handleAdd;

    if (!url) {
      return;
    }

    input.value = '';
    const assetsEl = this.getAssetsEl();

    if (assetsEl) {
      assetsEl.scrollTop = 0;
    }

    if (handleAdd) {
      handleAdd.bind(this)(url);
    } else {
      this.options.globalCollection.add(url, { at: 0 });
    }
  }

  /**
   * Returns assets element
   * @return {HTMLElement}
   * @private
   */
  getAssetsEl() {
    //if(!this.assets) // Not able to cache as after the rerender it losses the ref
    return this.el.querySelector(`.${this.pfx}assets`);
  }

  /**
   * Returns input url element
   * @return {HTMLElement}
   * @private
   */
  getAddInput() {
    if (!this.inputUrl || !this.inputUrl.value) {
      this.inputUrl = this.el.querySelector(`.${this.pfx}add-asset input`);
    }
    return this.inputUrl;
  }

  /**
   * Triggered when an asset is removed
   * @param {Asset} model Removed asset
   * @private
   */
  removedAsset(model: Asset) {
    if (!this.collection.length) {
      this.toggleNoAssets();
    }
  }

  /**
   * Add asset to collection
   * @private
   * */
  addToAsset(model: Asset) {
    if (this.collection.length == 1) {
      this.toggleNoAssets(true);
    }
    this.addAsset(model);
  }

  /**
   * Add new asset to collection
   * @param Object Model
   * @param Object Fragment collection
   * @return Object Object created
   * @private
   * */
  addAsset(model: Asset, fragmentEl: DocumentFragment | null = null) {
    const fragment = fragmentEl;
    const collection = this.collection;
    const config = this.config;
    // @ts-ignore
    const rendered = new model.typeView({
      model,
      collection,
      config,
    }).render().el;

    if (fragment) {
      fragment.appendChild(rendered);
    } else {
      const assetsEl = this.getAssetsEl();
      if (assetsEl) {
        assetsEl.insertBefore(rendered, assetsEl.firstChild);
      }
    }

    return rendered;
  }

  /**
   * Checks if to show noAssets
   * @param {Boolean} hide
   * @private
   */
  toggleNoAssets(hide: boolean = false) {
    const assetsEl = this.$el.find(`.${this.pfx}assets`);

    if (hide) {
      assetsEl.empty();
    } else {
      const noAssets = this.config.noAssets;
      noAssets && assetsEl.append(noAssets);
    }
  }

  /**
   * Deselect all assets
   * @private
   * */
  deselectAll() {
    const pfx = this.pfx;
    this.$el.find(`.${pfx}highlight`).removeClass(`${pfx}highlight`);
  }

  renderAssets() {
    const fragment = document.createDocumentFragment();
    const assets = this.$el.find(`.${this.pfx}assets`);
    assets.empty();
    this.toggleNoAssets(!!this.collection.length);
    this.collection.each((model) => this.addAsset(model, fragment));
    assets.append(fragment);
  }

  render() {
    const fuRendered = this.options.fu.render().el;
    this.$el.empty();
    this.$el.append(fuRendered).append(this.template(this));
    this.el.className = `${this.ppfx}asset-manager`;
    this.renderAssets();
    return this;
  }
}

AssetsView.prototype.events = {
  // @ts-ignore
  submit: 'handleSubmit',
};
```

--------------------------------------------------------------------------------

---[FILE: AssetView.ts]---
Location: grapesjs-dev/packages/core/src/asset_manager/view/AssetView.ts

```typescript
import { View, ViewOptions } from '../../common';
import Asset from '../model/Asset';
import Assets from '../model/Assets';
import { AssetManagerConfig } from '../config/config';
import { clone } from 'underscore';
import EditorModel from '../../editor/model/Editor';

export type AssetViewProps = ViewOptions<Asset> & {
  collection: Assets;
  config: AssetManagerConfig;
};

export default class AssetView<TModel extends Asset = Asset> extends View<TModel> {
  pfx: string;
  ppfx: string;
  options: AssetViewProps;
  config: AssetManagerConfig;
  em: EditorModel;
  init?: (opt: AssetViewProps) => void;

  constructor(opt: AssetViewProps) {
    super(opt as any);
    this.options = opt;
    this.collection = opt.collection;
    const config = opt.config || {};
    this.config = config;
    this.pfx = config.stylePrefix || '';
    // @ts-ignore
    this.ppfx = config.pStylePrefix || '';
    // @ts-ignore
    this.em = config.em;
    this.className = this.pfx + 'asset';
    this.listenTo(this.model, 'destroy remove', this.remove);
    // @ts-ignore
    this.model.view = this;
    const init = this.init && this.init.bind(this);
    init && init(opt);
  }

  __getBhv() {
    const { em } = this;
    const am = em?.Assets;
    return am?.__getBehaviour() || {};
  }

  template(view: AssetView, asset: Asset) {
    const { pfx } = this;
    return `
      <div class="${pfx}preview-cont">
        ${this.getPreview()}
      </div>
      <div class="${pfx}meta">
        ${this.getInfo()}
      </div>
      <div class="${pfx}close" data-toggle="asset-remove">
        &Cross;
      </div>
    `;
  }

  /**
   * Update target if exists
   * @param {Model} target
   * @private
   * */
  updateTarget(target: any) {
    if (target && target.set) {
      target.set('attributes', clone(target.get('attributes')));
      target.set('src', this.model.get('src'));
    }
  }

  getPreview() {
    return '';
  }

  getInfo() {
    return '';
  }

  render() {
    const el = this.el;
    el.innerHTML = this.template(this, this.model);
    el.className = this.className!;
    return this;
  }
}
```

--------------------------------------------------------------------------------

````
