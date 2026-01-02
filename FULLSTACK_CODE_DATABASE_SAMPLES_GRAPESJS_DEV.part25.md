---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 25
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 25 of 97)

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

---[FILE: FileUploader.ts]---
Location: grapesjs-dev/packages/core/src/asset_manager/view/FileUploader.ts

```typescript
import AssetManager from '..';
import { View } from '../../common';
import EditorModel from '../../editor/model/Editor';
import fetch from '../../utils/fetch';
import html from '../../utils/html';
import { AssetManagerConfig } from '../config/config';
import { UploadFileClb, UploadFileOptions } from '../types';

type FileUploaderTemplateProps = {
  pfx: string;
  title: string;
  uploadId: string;
  disabled: boolean;
  multiUpload: boolean;
};

export default class FileUploaderView extends View {
  options: any;
  config: AssetManagerConfig;
  pfx: string;
  ppfx: string;
  em: EditorModel;
  module: AssetManager;
  target: any;
  uploadId: string;
  disabled: boolean;
  multiUpload: boolean;
  uploadForm?: HTMLFormElement | null;

  template({ pfx, title, uploadId, disabled, multiUpload }: FileUploaderTemplateProps) {
    return html`
      <form>
        <div id="${pfx}title">${title}</div>
        <input
          data-input
          type="file"
          id="${uploadId}"
          name="file"
          accept="*/*"
          ${disabled ? 'disabled' : ''}
          ${multiUpload ? 'multiple' : ''}
        />
        <div style="clear:both;"></div>
      </form>
    `;
  }

  events() {
    return {
      'change [data-input]': 'uploadFile',
    };
  }

  constructor(opts: any = {}) {
    super(opts);
    this.options = opts;
    const c = (opts.config || {}) as AssetManagerConfig & { pStylePrefix?: string; disableUpload?: boolean };
    this.module = opts.module;
    this.config = c;
    // @ts-ignore
    this.em = this.config.em;
    this.pfx = c.stylePrefix || '';
    this.ppfx = c.pStylePrefix || '';
    this.target = this.options.globalCollection || {};
    this.uploadId = this.pfx + 'uploadFile';
    this.disabled = c.disableUpload !== undefined ? c.disableUpload : !c.upload && !c.embedAsBase64;
    this.multiUpload = c.multiUpload !== undefined ? c.multiUpload : true;
    const uploadFile = c.uploadFile;

    if (uploadFile) {
      this.uploadFile = uploadFile.bind(this);
    } else if (!c.upload && c.embedAsBase64) {
      this.uploadFile = FileUploaderView.embedAsBase64;
    }

    this.delegateEvents();
  }

  /**
   * Triggered before the upload is started
   * @private
   */
  onUploadStart() {
    const { module } = this;
    module?.__propEv(module.events.uploadStart);
  }

  /**
   * Triggered after the upload is ended
   * @param  {Object|string} res End result
   * @private
   */
  onUploadEnd(res: any) {
    const { $el, module } = this;
    module?.__propEv(module.events.uploadEnd, res);
    const input = $el.find('input');
    input && input.val('');
  }

  /**
   * Triggered on upload error
   * @param  {Object} err Error
   * @private
   */
  onUploadError(err: Error) {
    const { module } = this;
    console.error(err);
    this.onUploadEnd(err);
    module?.__propEv(module.events.uploadError, err);
  }

  /**
   * Triggered on upload response
   * @param  {string} text Response text
   * @private
   */
  onUploadResponse(text: string, clb?: UploadFileClb) {
    const { module, config, target } = this;
    let json;
    try {
      json = typeof text === 'string' ? JSON.parse(text) : text;
    } catch (e) {
      json = text;
    }

    module?.__propEv(module.events.uploadResponse, json);

    if (config.autoAdd && target) {
      target.add(json.data, { at: 0 });
    }

    this.onUploadEnd(text);
    clb?.(json);
  }

  /**
   * Upload files
   * @param  {Object}  e Event
   * @return {Promise}
   * @private
   * */
  uploadFile(e: DragEvent, clb?: UploadFileClb, opts?: UploadFileOptions) {
    opts; // Options are not used here but can be used by the custom uploadFile function
    const files = e.dataTransfer ? e.dataTransfer.files : ((e.target as any)?.files as FileList);
    const { config } = this;
    const { beforeUpload } = config;

    const beforeUploadResponse = beforeUpload && beforeUpload(files);
    if (beforeUploadResponse === false) return;

    const body = new FormData();
    const { params, customFetch, fetchOptions } = config;

    for (let param in params) {
      body.append(param, params[param]);
    }

    if (this.multiUpload) {
      for (let i = 0; i < files.length; i++) {
        body.append(`${config.uploadName}${config.multiUploadSuffix}`, files[i]);
      }
    } else if (files.length) {
      body.append(config.uploadName!, files[0]);
    }

    const url = config.upload;
    const headers = config.headers!;
    const reqHead = 'X-Requested-With';

    if (typeof headers[reqHead] == 'undefined') {
      headers[reqHead] = 'XMLHttpRequest';
    }

    if (url) {
      this.onUploadStart();
      const fetchOpts = {
        method: 'post',
        credentials: config.credentials || 'include',
        headers,
        body,
      };
      const fetchOptsResult = fetchOptions?.(fetchOpts) || fetchOpts;
      const fetchResult = customFetch
        ? customFetch(url, fetchOptsResult)
        : fetch(url, fetchOptsResult).then((res: any) =>
            ((res.status / 200) | 0) == 1 ? res.text() : res.text().then((text: string) => Promise.reject(text)),
          );
      return fetchResult
        .then((text: string) => this.onUploadResponse(text, clb))
        .catch((err: Error) => this.onUploadError(err));
    }
  }

  /**
   * Make input file droppable
   * @private
   * */
  initDrop() {
    var that = this;

    if (!this.uploadForm) {
      this.uploadForm = this.$el.find('form').get(0)!;
      const formEl = this.uploadForm;

      if ('draggable' in formEl) {
        this.uploadForm.ondragover = function () {
          formEl.className = that.pfx + 'hover';
          return false;
        };
        this.uploadForm.ondragleave = function () {
          formEl.className = '';
          return false;
        };
        this.uploadForm.ondrop = function (ev) {
          formEl.className = '';
          ev.preventDefault();
          that.uploadFile(ev);
          return;
        };
      }
    }
  }

  initDropzone(ev: any) {
    let addedCls = 0;
    const c = this.config;
    const em = ev.model;
    const edEl = ev.el;
    const editor = em.Editor;
    const frameEl = em.Canvas.getBody();
    const ppfx = this.ppfx;
    const updatedCls = `${ppfx}dropzone-active`;
    const dropzoneCls = `${ppfx}dropzone`;
    const cleanEditorElCls = () => {
      edEl.className = edEl.className.replace(updatedCls, '').trim();
      addedCls = 0;
    };
    const onDragOver = () => {
      if (!addedCls) {
        edEl.className += ` ${updatedCls}`;
        addedCls = 1;
      }
      return false;
    };
    const onDragLeave = () => {
      cleanEditorElCls();
      return false;
    };
    const onDrop = (e: DragEvent) => {
      cleanEditorElCls();
      e.preventDefault();
      e.stopPropagation();
      this.uploadFile(e);

      if (c.openAssetsOnDrop && editor) {
        const target = editor.getSelected();
        editor.runCommand('open-assets', {
          target,
          onSelect() {
            editor.Modal.close();
            editor.AssetManager.setTarget(null);
          },
        });
      }

      return false;
    };

    ev.$el.append(`<div class="${dropzoneCls}">${c.dropzoneContent}</div>`);
    cleanEditorElCls();

    if ('draggable' in edEl) {
      [edEl, frameEl].forEach((item) => {
        item.ondragover = onDragOver;
        item.ondragleave = onDragLeave;
        item.ondrop = onDrop;
      });
    }
  }

  render() {
    const { $el, pfx, em } = this;
    $el.html(
      this.template({
        title: em && em.t('assetManager.uploadTitle'),
        uploadId: this.uploadId,
        disabled: this.disabled,
        multiUpload: this.multiUpload,
        pfx,
      }),
    );
    this.initDrop();
    $el.attr('class', pfx + 'file-uploader');
    return this;
  }

  static embedAsBase64(e: DragEvent, clb?: UploadFileClb) {
    // List files dropped
    // @ts-ignore
    const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
    const response: Record<string, any> = { data: [] };

    // Unlikely, widely supported now
    if (!FileReader) {
      // @ts-ignore
      this.onUploadError(new Error('Unsupported platform, FileReader is not defined'));
      return;
    }

    const promises = [];
    const mimeTypeMatcher = /^(.+)\/(.+)$/;

    for (const file of files) {
      // For each file a reader (to read the base64 URL)
      // and a promise (to track and merge results and errors)
      const promise = new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener('load', (event) => {
          let type;
          const name = file.name;

          // Try to find the MIME type of the file.
          const match = mimeTypeMatcher.exec(file.type);
          if (match) {
            type = match[1]; // The first part in the MIME, "image" in image/png
          } else {
            type = file.type;
          }

          /*
        // Show local video files, http://jsfiddle.net/dsbonev/cCCZ2/embedded/result,js,html,css/
        var URL = window.URL || window.webkitURL
        var file = this.files[0]
        var type = file.type
        var videoNode = document.createElement('video');
        var canPlay = videoNode.canPlayType(type) // can use also for 'audio' types
        if (canPlay === '') canPlay = 'no'
        var message = 'Can play type "' + type + '": ' + canPlay
        var isError = canPlay === 'no'
        displayMessage(message, isError)

        if (isError) {
          return
        }

        var fileURL = URL.createObjectURL(file)
        videoNode.src = fileURL
         */

          // If it's an image, try to find its size
          if (type === 'image') {
            const data = {
              src: reader.result,
              name,
              type,
              height: 0,
              width: 0,
            };

            const image = new Image();
            image.addEventListener('error', (error) => {
              reject(error);
            });
            image.addEventListener('load', () => {
              data.height = image.height;
              data.width = image.width;
              resolve(data);
            });
            // @ts-ignore
            image.src = data.src;
          } else if (type) {
            // Not an image, but has a type
            resolve({
              src: reader.result,
              name,
              type,
            });
          } else {
            // No type found, resolve with the URL only
            resolve(reader.result);
          }
        });
        reader.addEventListener('error', (error) => {
          reject(error);
        });
        reader.addEventListener('abort', (error) => {
          reject('Aborted');
        });

        reader.readAsDataURL(file);
      });

      promises.push(promise);
    }

    return Promise.all(promises).then(
      (data) => {
        response.data = data;
        // @ts-ignore
        this.onUploadResponse(response, clb);
      },
      (error) => {
        // @ts-ignore
        this.onUploadError(error);
      },
    );
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: grapesjs-dev/packages/core/src/block_manager/index.ts

```typescript
/**
 * You can customize the initial state of the module from the editor initialization, by passing the following [Configuration Object](https://github.com/GrapesJS/grapesjs/blob/master/src/block_manager/config/config.ts)
 * ```js
 * const editor = grapesjs.init({
 *  blockManager: {
 *    // options
 *  }
 * })
 * ```
 *
 * Once the editor is instantiated you can use its API and listen to its events. Before using these methods, you should get the module from the instance.
 *
 * ```js
 * // Listen to events
 * editor.on('block:add', (block) => { ... });
 *
 * // Use the API
 * const blockManager = editor.Blocks;
 * blockManager.add(...);
 * ```
 *
 * {REPLACE_EVENTS}
 *
 * [Block]: block.html
 * [Component]: component.html
 *
 * @module Blocks
 */
import { debounce, isArray } from 'underscore';
import { ItemManagerModule } from '../abstract/Module';
import FrameView from '../canvas/view/FrameView';
import Component from '../dom_components/model/Component';
import EditorModel from '../editor/model/Editor';
import defConfig, { BlockManagerConfig } from './config/config';
import Block, { BlockProperties } from './model/Block';
import Blocks from './model/Blocks';
import Categories from '../abstract/ModuleCategories';
import Category, { getItemsByCategory } from '../abstract/ModuleCategory';
import { BlocksByCategory, BlocksCustomData, BlocksEvents } from './types';
import BlocksView from './view/BlocksView';

export default class BlockManager extends ItemManagerModule<BlockManagerConfig, Blocks> {
  blocks: Blocks;
  blocksVisible: Blocks;
  categories: Categories;
  blocksView?: BlocksView;
  _dragBlock?: Block;
  _bhv?: Record<string, any>;
  events = BlocksEvents;

  Block = Block;

  Blocks = Blocks;

  Category = Category;

  Categories = Categories;

  storageKey = '';

  constructor(em: EditorModel) {
    super(em, 'BlockManager', new Blocks([], { em }), BlocksEvents, defConfig());
    this.blocks = this.all;
    this.blocksVisible = new Blocks(this.blocks.models, { em });
    this.categories = new Categories([], { em, events: { update: BlocksEvents.categoryUpdate } });
    this.__onAllEvent = debounce(() => this.__trgCustom(), 0);

    return this;
  }

  onInit() {
    const { config, blocks, blocksVisible } = this;
    // Setup the sync between the global and public collections
    blocks.on('add', (model) => blocksVisible.add(model));
    blocks.on('remove', (model) => blocksVisible.remove(model));
    blocks.on('reset', (coll) => blocksVisible.reset(coll.models));
    blocks.add(config.blocks || []);
  }

  /**
   * Get configuration object
   * @name getConfig
   * @function
   * @return {Object}
   */

  __trgCustom() {
    this.em.trigger(this.events.custom, this.__customData());
  }

  __customData(): BlocksCustomData {
    const bhv = this.__getBehaviour();
    return {
      bm: this as BlockManager,
      blocks: this.getAll().models,
      container: bhv.container,
      dragStart: (block: Block, ev?: Event) => this.startDrag(block, ev),
      drag: (ev: Event) => this.__drag(ev),
      dragStop: (cancel?: boolean) => this.endDrag(cancel),
    };
  }

  __startDrag(block: Block, ev?: Event) {
    const { em, events, blocks } = this;
    const content = block.getContent ? block.getContent() : block;
    this._dragBlock = block;
    em.set({
      dragResult: null,
      dragSource: {
        content,
        dragDef: block.getDragDef(),
      },
    });
    [em, blocks].map((i) => i.trigger(events.dragStart, block, ev));
  }

  __drag(ev: Event) {
    const { em, events, blocks } = this;
    const block = this._dragBlock;
    [em, blocks].map((i) => i.trigger(events.drag, block, ev));
  }

  __endDrag(opts: { component?: Component } = {}) {
    const { em, events, blocks } = this;
    const block = this._dragBlock;
    const cmp = opts.component || em.get('dragResult');
    delete this._dragBlock;

    if (cmp && block) {
      const oldKey = 'activeOnRender';
      const oldActive = cmp.get && cmp.get(oldKey);
      const toActive = block.get('activate') || oldActive;
      const toSelect = block.get('select');
      const first = isArray(cmp) ? cmp[0] : cmp;
      const selected = toSelect || (toActive && toSelect !== false);

      if (selected) {
        em.setSelected(first, { activate: toActive });
      } else if (toActive) {
        first.trigger('active');
      }

      if (toActive && oldActive) {
        first.unset(oldKey);
      }

      if (block.get('resetId')) {
        first.onAll((cmp: any) => cmp.resetId());
      }
    }

    em.set({ dragResult: null, dragSource: undefined });

    if (block) {
      [em, blocks].map((i) => i.trigger(events.dragEnd, cmp, block));
    }
  }

  __getFrameViews(): FrameView[] {
    return this.em.Canvas.getFrames()
      .map((frame) => frame.view!)
      .filter(Boolean);
  }

  __behaviour(opts = {}) {
    return (this._bhv = {
      ...(this._bhv || {}),
      ...opts,
    });
  }

  __getBehaviour() {
    return this._bhv || {};
  }

  startDrag(block: Block, ev?: Event) {
    this.__startDrag(block, ev);
    this.__getFrameViews().forEach((fv) => fv.droppable?.startCustom());
  }

  endDrag(cancel?: boolean) {
    this.__getFrameViews().forEach((fv) => fv.droppable?.endCustom(cancel));
    this.__endDrag();
  }

  postRender() {
    const { categories, config, em } = this;
    const collection = this.blocksVisible;
    this.blocksView = new BlocksView({ collection, categories }, { ...config, em });
    this.__appendTo(collection.models);
    this.__trgCustom();
  }

  /**
   * Add new block.
   * @param {String} id Block ID
   * @param {[Block]} props Block properties
   * @returns {[Block]} Added block
   * @example
   * blockManager.add('h1-block', {
   *   label: 'Heading',
   *   content: '<h1>Put your title here</h1>',
   *   category: 'Basic',
   *   attributes: {
   *     title: 'Insert h1 block'
   *   }
   * });
   */
  add(id: string, props: BlockProperties, opts = {}) {
    const prp = props || {};
    prp.id = id;
    return this.blocks.add(prp, opts);
  }

  /**
   * Get the block by id.
   * @param  {String} id Block id
   * @returns {[Block]}
   * @example
   * const block = blockManager.get('h1-block');
   * console.log(JSON.stringify(block));
   * // {label: 'Heading', content: '<h1>Put your ...', ...}
   */
  get(id: string) {
    return this.blocks.get(id);
  }

  /**
   * Return all blocks.
   * @returns {Collection<[Block]>}
   * @example
   * const blocks = blockManager.getAll();
   * console.log(JSON.stringify(blocks));
   * // [{label: 'Heading', content: '<h1>Put your ...'}, ...]
   */
  getAll() {
    return this.blocks;
  }

  /**
   * Return the visible collection, which containes blocks actually rendered
   * @returns {Collection<[Block]>}
   */
  getAllVisible() {
    return this.blocksVisible;
  }

  /**
   * Remove block.
   * @param {String|[Block]} block Block or block ID
   * @returns {[Block]} Removed block
   * @example
   * const removed = blockManager.remove('BLOCK_ID');
   * // or by passing the Block
   * const block = blockManager.get('BLOCK_ID');
   * blockManager.remove(block);
   */
  remove(block: string | Block, opts = {}) {
    return this.__remove(block, opts);
  }

  /**
   * Get all available categories.
   * It's possible to add categories only within blocks via 'add()' method
   * @return {Array|Collection}
   */
  getCategories() {
    return this.categories;
  }

  /**
   * Return the Blocks container element
   * @return {HTMLElement}
   */
  getContainer() {
    return this.blocksView?.el;
  }

  /**
   * Returns currently dragging block.
   * Updated when the drag starts and cleared once it's done.
   * @returns {[Block]|undefined}
   */
  getDragBlock() {
    return this._dragBlock;
  }

  /**
   * Get blocks by category.
   * @example
   * blockManager.getBlocksByCategory();
   * // Returns an array of items of this type
   * // > { category?: Category; items: Block[] }
   *
   * // NOTE: The item without category is the one containing blocks without category.
   *
   * // You can also get the same output format by passing your own array of Blocks
   * const myFilteredBlocks: Block[] = [...];
   * blockManager.getBlocksByCategorymyFilteredBlocks
   */
  getBlocksByCategory(blocks?: Block[]): BlocksByCategory[] {
    return getItemsByCategory<Block>(blocks || this.getAll().models);
  }

  /**
   * Render blocks
   * @param  {Array} blocks Blocks to render, without the argument will render all global blocks
   * @param  {Object} [opts={}] Options
   * @param  {Boolean} [opts.external] Render blocks in a new container (HTMLElement will be returned)
   * @param  {Boolean} [opts.ignoreCategories] Render blocks without categories
   * @return {HTMLElement} Rendered element
   * @example
   * // Render all blocks (inside the global collection)
   * blockManager.render();
   *
   * // Render new set of blocks
   * const blocks = blockManager.getAll();
   * const filtered = blocks.filter(block => block.get('category') == 'sections')
   *
   * blockManager.render(filtered);
   * // Or a new set from an array
   * blockManager.render([
   *  {label: 'Label text', content: '<div>Content</div>'}
   * ]);
   *
   * // Back to blocks from the global collection
   * blockManager.render();
   *
   * // You can also render your blocks outside of the main block container
   * const newBlocksEl = blockManager.render(filtered, { external: true });
   * document.getElementById('some-id').appendChild(newBlocksEl);
   */
  render(blocks?: Block[], opts: { external?: boolean } = {}) {
    const { categories, config, em } = this;
    const toRender = blocks || this.getAll().models;

    if (opts.external) {
      const collection = new Blocks(toRender, { em });
      return new BlocksView({ collection, categories }, { em, ...config, ...opts }).render().el;
    }

    if (this.blocksView) {
      this.blocksView.updateConfig(opts);
      this.blocksView.collection.reset(toRender);

      if (!this.blocksView.rendered) {
        this.blocksView.render();
        this.blocksView.rendered = true;
      }
    }

    return this.getContainer();
  }

  destroy() {
    const colls = [this.blocks, this.blocksVisible, this.categories];
    colls.map((c) => c.stopListening());
    colls.map((c) => c.reset());
    this.blocksView?.remove();
  }
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: grapesjs-dev/packages/core/src/block_manager/types.ts

```typescript
import BlockManager from '.';
import Category, { CategoryProperties, ItemsByCategory } from '../abstract/ModuleCategory';
import {
  AddOptions,
  EventCallbackAdd,
  EventCallbackAll,
  EventCallbackRemove,
  EventCallbackRemoveBefore,
  EventCallbackUpdate,
} from '../common';
import Component from '../dom_components/model/Component';
import Block from './model/Block';

export interface BlocksByCategory extends ItemsByCategory<Block> {}

export interface BlocksCustomData {
  bm: BlockManager;
  blocks: Block[];
  container: HTMLElement | undefined;
  dragStart: (block: Block, ev?: Event) => void;
  drag: (ev: Event) => void;
  dragStop: (cancel?: boolean) => void;
}

export type BlockEvent = `${BlocksEvents}`;

/**{START_EVENTS}*/
export enum BlocksEvents {
  /**
   * @event `block:add` New block added to the collection. The [Block] is passed as an argument to the callback.
   * @example
   * editor.on('block:add', (block) => { ... });
   */
  add = 'block:add',

  /**
   * @event `block:remove` Block removed from the collection. The [Block] is passed as an argument to the callback.
   * @example
   * editor.on('block:remove', (block) => { ... });
   */
  remove = 'block:remove',

  /**
   * @event `block:remove:before` Event triggered before Block remove.
   * @example
   * editor.on('block:remove:before', (block, remove, opts) => { ... });
   */
  removeBefore = 'block:remove:before',

  /**
   * @event `block:update` Block updated. The [Block] and the object containing changes are passed as arguments to the callback.
   * @example
   * editor.on('block:update', (block, updatedProps) => { ... });
   */
  update = 'block:update',

  /**
   * @event `block:drag:start` Started dragging block. The [Block] is passed as an argument.
   * @example
   * editor.on('block:drag:start', (block) => { ... });
   */
  dragStart = 'block:drag:start',

  /**
   * @event `block:drag` The block is dragging. The [Block] is passed as an argument.
   * @example
   * editor.on('block:drag', (block) => { ... });
   */
  drag = 'block:drag',

  /**
   * @event `block:drag:stop` Dragging of the block is stopped. The dropped [Component] (if dropped successfully) and the [Block] are passed as arguments.
   * @example
   * editor.on('block:drag:stop', (component, block) => { ... });
   */
  dragEnd = 'block:drag:stop',

  /**
   * @event `block:category:update` Block category updated.
   * @example
   * editor.on('block:category:update', ({ category, changes }) => { ... });
   */
  categoryUpdate = 'block:category:update',

  /**
   * @event `block:custom` Event to use in case of [custom Block Manager UI](https://grapesjs.com/docs/modules/Blocks.html#customization).
   * @example
   * editor.on('block:custom', ({ container, blocks, ... }) => { ... });
   */
  custom = 'block:custom',

  /**
   * @event `block` Catch-all event for all the events mentioned above. An object containing all the available data about the triggered event is passed as an argument to the callback.
   * @example
   * editor.on('block', ({ event, model, ... }) => { ... });
   */
  all = 'block',
}
/**{END_EVENTS}*/

export interface BlocksEventCallback {
  [BlocksEvents.add]: EventCallbackAdd<Block>;
  [BlocksEvents.remove]: EventCallbackRemove<Block>;
  [BlocksEvents.removeBefore]: EventCallbackRemoveBefore<Block>;
  [BlocksEvents.update]: EventCallbackUpdate<Block>;
  [BlocksEvents.dragStart]: [Block, DragEvent?];
  [BlocksEvents.drag]: [Block, DragEvent?];
  [BlocksEvents.dragEnd]: [Component | undefined, Block];
  [BlocksEvents.categoryUpdate]: [{ category: Category; changes: Partial<CategoryProperties>; options: AddOptions }];
  [BlocksEvents.custom]: [BlocksCustomData];
  [BlocksEvents.all]: EventCallbackAll<BlockEvent, Block>;
}

// need this to avoid the TS documentation generator to break
export default BlocksEvents;
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: grapesjs-dev/packages/core/src/block_manager/config/config.ts

```typescript
import Editor from '../../editor';
import Block, { BlockProperties } from '../model/Block';

export interface BlockManagerConfig {
  /**
   * Specify the element to use as a container, string (query) or HTMLElement.
   * With the empty value, nothing will be rendered.
   * @default ''
   */
  appendTo?: HTMLElement | string;
  /**
   * Default blocks.
   * @default []
   */
  blocks?: BlockProperties[];
  /**
   * Append blocks to canvas on click.
   * With the `true` value, it will try to append the block to the selected component
   * If there is no selected component, the block will be appened to the wrapper.
   * You can also pass a function to this option, use it as a catch-all for all block
   * clicks and implement a custom logic for each block.
   * @default false
   * @example
   * // Example with a function
   * appendOnClick: (block, editor) => {
   *  if (block.get('id') === 'some-id')
   *    editor.getSelected().append(block.get('content'))
   *  else
   *    editor.getWrapper().append(block.get('content'))
   * }
   */
  appendOnClick?: boolean | ((block: Block, editor: Editor, opts: { event: Event }) => void);
  /**
   * Avoid rendering the default block manager UI.
   * More about it here: https://grapesjs.com/docs/modules/Blocks.html#customization
   * @default false
   */
  custom?: boolean;
}

const config: () => BlockManagerConfig = () => ({
  appendTo: '',
  blocks: [],
  appendOnClick: false,
  custom: false,
});

export default config;
```

--------------------------------------------------------------------------------

---[FILE: Block.ts]---
Location: grapesjs-dev/packages/core/src/block_manager/model/Block.ts

```typescript
import { Model } from '../../common';
import { isFunction } from 'underscore';
import Editor from '../../editor';
import Category, { CategoryProperties } from '../../abstract/ModuleCategory';
import Blocks from './Blocks';
import { DraggableContent } from '../../utils/sorter/types';

/** @private */
export interface BlockProperties extends DraggableContent {
  /**
   * Block label, eg. `My block`
   */
  label: string;
  /**
   * HTML string for the media/icon of the block, eg. `<svg ...`, `<img ...`, etc.
   * @default ''
   */
  media?: string;
  /**
   * Block category, eg. `Basic blocks`
   * @default ''
   */
  category?: string | CategoryProperties;
  /**
   * If true, triggers the `active` event on the dropped component.
   * @default false
   */
  activate?: boolean;
  /**
   * If true, the dropped component will be selected.
   * @default false
   */
  select?: boolean;
  /**
   * If true, all IDs of dropped components and their styles will be changed.
   * @default false
   */
  resetId?: boolean;
  /**
   * Disable the block from being interacted.
   * @default false
   */
  disable?: boolean;
  /**
   * Custom behavior on click.
   * @example
   * onClick: (block, editor) => editor.getWrapper().append(block.get('content'))
   */
  onClick?: (block: Block, editor: Editor) => void;
  /**
   * Block attributes
   */
  attributes?: Record<string, any>;

  id?: string;

  /**
   * @deprecated
   */
  activeOnRender?: boolean;
}

/**
 * @property {String} label Block label, eg. `My block`
 * @property {String|Object} content The content of the block. Might be an HTML string or a [Component Definition](/modules/Components.html#component-definition)
 * @property {String} [media=''] HTML string for the media/icon of the block, eg. `<svg ...`, `<img ...`, etc.
 * @property {String} [category=''] Block category, eg. `Basic blocks`
 * @property {Boolean} [activate=false] If true, triggers the `active` event on the dropped component.
 * @property {Boolean} [select=false] If true, the dropped component will be selected.
 * @property {Boolean} [resetId=false] If true, all IDs of dropped components and their styles will be changed.
 * @property {Boolean} [disable=false] Disable the block from being interacted
 * @property {Function} [onClick] Custom behavior on click, eg. `(block, editor) => editor.getWrapper().append(block.get('content'))`
 * @property {Object} [attributes={}] Block attributes to apply in the view element
 *
 * @module docsjs.Block
 */
export default class Block extends Model<BlockProperties> {
  defaults() {
    return {
      label: '',
      content: '',
      media: '',
      category: '',
      activate: false,
      select: undefined,
      resetId: false,
      disable: false,
      onClick: undefined,
      attributes: {},
      dragDef: {},
    };
  }

  get category(): Category | undefined {
    const cat = this.get('category');
    return cat instanceof Category ? cat : undefined;
  }

  get parent() {
    return this.collection as unknown as Blocks;
  }

  /**
   * Get block id
   * @returns {String}
   */
  getId() {
    return this.id as string;
  }

  /**
   * Get block label
   * @returns {String}
   */
  getLabel() {
    return this.get('label')!;
  }

  /**
   * Get block media
   * @returns {String}
   */
  getMedia() {
    return this.get('media');
  }

  /**
   * Get block content
   * @returns {Object|String|Array<Object|String>}
   */
  getContent() {
    return this.get('content');
  }

  /**
   * Get block component dragDef
   * @returns {ComponentDefinition}
   */
  getDragDef() {
    return this.get('dragDef');
  }

  /**
   * Get block category label
   * @returns {String}
   */
  getCategoryLabel(): string {
    const ctg = this.get('category');
    // @ts-ignore
    return isFunction(ctg?.get) ? ctg.get('label') : ctg?.label ? ctg?.label : ctg;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: Blocks.ts]---
Location: grapesjs-dev/packages/core/src/block_manager/model/Blocks.ts

```typescript
import { CollectionWithCategories } from '../../abstract/CollectionWithCategories';
import EditorModel from '../../editor/model/Editor';
import Block from './Block';

export default class Blocks extends CollectionWithCategories<Block> {
  em: EditorModel;

  constructor(coll: any[], options: { em: EditorModel }) {
    super(coll);
    this.em = options.em;
    this.on('add', this.handleAdd);
  }

  getCategories() {
    return this.em.Blocks.getCategories();
  }

  handleAdd(model: Block) {
    this.initCategory(model);
  }
}

Blocks.prototype.model = Block;
```

--------------------------------------------------------------------------------

---[FILE: BlocksView.ts]---
Location: grapesjs-dev/packages/core/src/block_manager/view/BlocksView.ts

```typescript
import { isString, isObject, bindAll } from 'underscore';
import BlockManager from '..';
import { View } from '../../common';
import Component from '../../dom_components/model/Component';
import EditorModel from '../../editor/model/Editor';
import Block from '../model/Block';
import Categories from '../../abstract/ModuleCategories';
import BlockView from './BlockView';
import CategoryView from '../../abstract/ModuleCategoryView';
import CanvasNewComponentNode from '../../utils/sorter/CanvasNewComponentNode';
import { DragDirection } from '../../utils/sorter/types';

export interface BlocksViewConfig {
  em: EditorModel;
  pStylePrefix?: string;
  ignoreCategories?: boolean;
  getSorter?: any;
}

export default class BlocksView extends View {
  em: EditorModel;
  config: BlocksViewConfig;
  categories: Categories;
  renderedCategories = new Map<string, CategoryView>();
  ppfx: string;
  noCatClass: string;
  blockContClass: string;
  catsClass: string;
  catsEl?: HTMLElement;
  blocksEl?: HTMLElement;
  rendered?: boolean;
  sorter: any;

  constructor(opts: any, config: BlocksViewConfig) {
    super(opts);
    bindAll(this, 'getSorter', 'onDrag', 'onDrop', 'onMove');
    this.config = config || {};
    this.categories = opts.categories || '';
    const ppfx = this.config.pStylePrefix || '';
    this.ppfx = ppfx;
    this.noCatClass = `${ppfx}blocks-no-cat`;
    this.blockContClass = `${ppfx}blocks-c`;
    this.catsClass = `${ppfx}block-categories`;
    const coll = this.collection;
    this.listenTo(coll, 'add', this.addTo);
    this.listenTo(coll, 'reset', this.render);
    this.em = this.config.em;

    if (this.em) {
      this.config.getSorter = this.getSorter;
    }
  }

  __getModule(): BlockManager {
    return this.em.Blocks;
  }

  updateConfig(opts = {}) {
    this.config = {
      ...this.config,
      ...opts,
    };
  }

  /**
   * Get sorter
   * @private
   */
  getSorter() {
    const { em } = this;
    if (!em) return;

    if (!this.sorter) {
      const utils = em.Utils;
      const canvas = em.Canvas;
      this.sorter = new utils.ComponentSorter({
        em,
        treeClass: CanvasNewComponentNode,
        containerContext: {
          container: canvas.getBody(),
          containerSel: '*',
          itemSel: '*',
          pfx: this.ppfx,
          placeholderElement: canvas.getPlacerEl()!,
          document: canvas.getBody().ownerDocument,
        },
        dragBehavior: {
          dragDirection: DragDirection.BothDirections,
          nested: true,
        },
        positionOptions: {
          windowMargin: 1,
          canvasRelative: true,
        },
        eventHandlers: {
          legacyOnStartSort: this.onDrag,
          legacyOnEndMove: this.onDrop,
          legacyOnMoveClb: this.onMove,
        },
      });
    }

    return this.sorter;
  }

  onDrag(ev: Event) {
    this.em.stopDefault();
    this.__getModule().__startDrag(this.sorter.__currentBlock, ev);
  }

  onMove(ev: Event) {
    this.__getModule().__drag(ev);
  }

  onDrop(component?: Component) {
    this.em.runDefault();
    this.__getModule().__endDrag({ component });
    delete this.sorter.__currentBlock;
  }

  /**
   * Add new model to the collection
   * @param {Model} model
   * @private
   * */
  addTo(model: Block) {
    this.add(model);
  }

  /**
   * Render new model inside the view
   * @param {Model} model
   * @param {Object} fragment Fragment collection
   * @private
   * */
  add(model: Block, fragment?: DocumentFragment) {
    const { config, renderedCategories } = this;
    const attributes = model.get('attributes');
    const view = new BlockView({ model, attributes }, config);
    const rendered = view.render().el;
    const category = model.parent.initCategory(model);

    // Check for categories
    if (category && this.categories && !config.ignoreCategories) {
      const catId = category.getId();
      const categories = this.getCategoriesEl();
      let catView = renderedCategories.get(catId);

      if (!catView && categories) {
        catView = new CategoryView({ model: category }, config, 'block').render();
        renderedCategories.set(catId, catView);
        categories.appendChild(catView.el);
      }

      catView?.append(rendered);
      return;
    }

    fragment ? fragment.appendChild(rendered) : this.append(rendered);
  }

  getCategoriesEl() {
    if (!this.catsEl) {
      this.catsEl = this.el.querySelector(`.${this.catsClass}`)!;
    }

    return this.catsEl;
  }

  getBlocksEl() {
    if (!this.blocksEl) {
      this.blocksEl = this.el.querySelector(`.${this.noCatClass} .${this.blockContClass}`)!;
    }

    return this.blocksEl;
  }

  append(el: HTMLElement | DocumentFragment) {
    let blocks = this.getBlocksEl();
    blocks && blocks.appendChild(el);
  }

  render() {
    const ppfx = this.ppfx;
    const frag = document.createDocumentFragment();
    delete this.catsEl;
    delete this.blocksEl;
    this.renderedCategories = new Map();
    this.el.innerHTML = `
      <div class="${this.catsClass}"></div>
      <div class="${this.noCatClass}">
        <div class="${this.blockContClass}"></div>
      </div>
    `;

    this.collection.each((model) => this.add(model, frag));
    this.append(frag);
    const cls = `${this.blockContClass}s ${ppfx}one-bg ${ppfx}two-color`;
    this.$el.addClass(cls);
    this.rendered = true;
    return this;
  }
}
```

--------------------------------------------------------------------------------

````
