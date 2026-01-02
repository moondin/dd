---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 52
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 52 of 97)

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

---[FILE: vi.js]---
Location: grapesjs-dev/packages/core/src/i18n/locale/vi.js

```javascript
const traitInputAttr = { placeholder: 'ví dụ: chữ ở đây' };

export default {
  assetManager: {
    addButton: 'Thêm ảnh',
    inputPlh: 'http://path/to/the/image.jpg',
    modalTitle: 'Chọn ảnh',
    uploadTitle: 'Kéo thả file vào đây hoặc click để upload',
  },
  // Here just as a reference, GrapesJS core doesn't contain any block,
  // so this should be omitted from other local files
  blockManager: {
    labels: {
      // 'block-id': 'Nhãn khố',
    },
    categories: {
      // 'category-id': 'Nhãn nhóm',
    },
  },
  domComponents: {
    names: {
      '': 'Box',
      wrapper: 'Body',
      text: 'Text',
      comment: 'Bình luận',
      image: 'Hình ảnh',
      video: 'Video',
      label: 'Nhãn',
      link: 'Liên kết',
      map: 'Sơ đồ',
      tfoot: 'Chân bảng biểu',
      tbody: 'Thân bảng biểu',
      thead: 'Đầu bảng biểu',
      table: 'Bảng biểu',
      row: 'Dòng',
      cell: 'Ô',
    },
  },
  deviceManager: {
    device: 'Thiết bị',
    devices: {
      desktop: 'Máy tính',
      tablet: 'Máy tính bảng',
      mobileLandscape: 'Di động ngang',
      mobilePortrait: 'Di động dọc',
    },
  },
  panels: {
    buttons: {
      titles: {
        preview: 'Xem thử',
        fullscreen: 'Toàn màn hình',
        'sw-visibility': 'Xem thành phần',
        'export-template': 'Xem mã',
        'open-sm': 'Mở trình soạn thảo style',
        'open-tm': 'Thiết lập',
        'open-layers': 'Mở trình soạn thảo lớp',
        'open-blocks': 'Mở khối',
      },
    },
  },
  selectorManager: {
    label: 'Classes',
    selected: 'Đã chọn',
    emptyState: '- Trạng thái -',
    states: {
      hover: 'Hover',
      active: 'Click',
      'nth-of-type(2n)': 'Chẵn/Lẻ',
    },
  },
  styleManager: {
    empty: 'Chọn 1 phần tử trước khi sử dụng quản lý style',
    layer: 'Lớp',
    fileButton: 'Hình ảnh',
    sectors: {
      general: 'Chung',
      layout: 'Bố cục',
      typography: 'Kiểu chữ',
      decorations: 'Trang trí',
      extra: 'Extra',
      flex: 'Flex',
      dimension: 'Kích thước',
    },
    // Default names for sub properties in Composite and Stack types.
    // Other labels are generated directly from their property names (eg. 'font-size' will be 'Font size').
    properties: {
      'text-shadow-h': 'X',
      'text-shadow-v': 'Y',
      'text-shadow-blur': 'Mờ',
      'text-shadow-color': 'Màu',
      'box-shadow-h': 'X',
      'box-shadow-v': 'Y',
      'box-shadow-blur': 'Mờ',
      'box-shadow-spread': 'Spread',
      'box-shadow-color': 'Màu',
      'box-shadow-type': 'Loại',
      'margin-top-sub': 'Đầu',
      'margin-right-sub': 'Phải',
      'margin-bottom-sub': 'Dưới',
      'margin-left-sub': 'Trái',
      'padding-top-sub': 'Đầu',
      'padding-right-sub': 'Phải',
      'padding-bottom-sub': 'Dưới',
      'padding-left-sub': 'Trái',
      'border-width-sub': 'Rộng',
      'border-style-sub': 'Phong cách',
      'border-color-sub': 'Màu',
      'border-top-left-radius-sub': 'Trên góc trái',
      'border-top-right-radius-sub': 'Trên góc phải',
      'border-bottom-right-radius-sub': 'Dưới góc phải',
      'border-bottom-left-radius-sub': 'Dưới góc trái',
      'transform-rotate-x': 'Rotate X',
      'transform-rotate-y': 'Rotate Y',
      'transform-rotate-z': 'Rotate Z',
      'transform-scale-x': 'Scale X',
      'transform-scale-y': 'Scale Y',
      'transform-scale-z': 'Scale Z',
      'transition-property-sub': 'Thuộc tính',
      'transition-duration-sub': 'Duration',
      'transition-timing-function-sub': 'Timing',
      'background-image-sub': 'Hình ảnh',
      'background-repeat-sub': 'Lặp lại',
      'background-position-sub': 'Vị trí',
      'background-attachment-sub': 'Đính kèm',
      'background-size-sub': 'Kích thước',
    },
    // Translate options in style properties
    // options: {
    //   float: { // Id of the property
    //     ...
    //     left: 'Left', // {option id}: {Option label}
    //   }
    // }
  },
  traitManager: {
    empty: 'Chọn 1 thành phần trước khi sử dụng bộ quản lý lưu vết',
    label: 'Thiết lập thành phần',
    traits: {
      // The core library generates the name by their `name` property
      labels: {
        // id: 'Id',
        // alt: 'Alt',
        // title: 'Title',
        // href: 'Href',
      },
      // In a simple trait, like text input, these are used on input attributes
      attributes: {
        id: traitInputAttr,
        alt: traitInputAttr,
        title: traitInputAttr,
        href: { placeholder: 'Ví dụ: https://google.com' },
      },
      // In a trait like select, these are used to translate option names
      options: {
        target: {
          false: 'Cửa sổ hiện tại',
          _blank: 'Cửa sổ mới',
        },
      },
    },
  },
  storageManager: {
    recover: 'Bạn có muốn khôi phục những thay đổi chưa được lưu?',
  },
};
```

--------------------------------------------------------------------------------

---[FILE: zh.js]---
Location: grapesjs-dev/packages/core/src/i18n/locale/zh.js

```javascript
const traitInputAttr = { placeholder: '例子. 输入文字' };

export default {
  assetManager: {
    addButton: '添加图片',
    inputPlh: 'http://path/to/the/image.jpg',
    modalTitle: '选择图片',
    uploadTitle: '点击或者拖拽图片上传',
  },
  domComponents: {
    names: {
      '': 'Box',
      wrapper: 'Body',
      text: '文字',
      comment: '评论',
      image: '图片',
      video: '视频',
      label: '文本',
      link: '超链接',
      map: '地图',
      tfoot: '表格末尾',
      tbody: '表格主体',
      thead: '表头',
      table: '表格',
      row: '行',
      cell: '单元格',
    },
  },
  deviceManager: {
    device: '设备',
    devices: {
      desktop: '桌面',
      tablet: '平板',
      mobileLandscape: 'Mobile Landscape',
      mobilePortrait: 'Mobile Portrait',
    },
  },
  panels: {
    buttons: {
      titles: {
        preview: '预览',
        fullscreen: '全屏',
        'sw-visibility': '查看组件',
        'export-template': '查看代码',
        'open-sm': '打开样式管理器',
        'open-tm': '设置',
        'open-layers': '打开布局管理器',
        'open-blocks': '打开块',
      },
    },
  },
  selectorManager: {
    label: 'Classes',
    selected: 'Selected',
    emptyState: '- State -',
    states: {
      hover: 'Hover',
      active: 'Click',
      'nth-of-type(2n)': 'Even/Odd',
    },
  },
  styleManager: {
    empty: '设置样式前选择请一个元素',
    layer: '层级',
    fileButton: '图片',
    sectors: {
      general: '常规',
      layout: '布局',
      typography: '版式',
      decorations: '装饰',
      extra: '扩展',
      flex: '盒子模型',
      dimension: '尺寸',
    },
    // The core library generates the name by their `property` name
    properties: {
      // float: 'Float',
    },
  },
  traitManager: {
    empty: '用设置项前选择一个组件',
    label: '组件设置',
    traits: {
      // In a simple trait, like text input, these are used on input attributes
      attributes: {
        id: traitInputAttr,
        alt: traitInputAttr,
        title: traitInputAttr,
        href: { placeholder: 'eg. https://google.com' },
      },
      // In a trait like select, these are used to translate option names
      options: {
        target: {
          false: '本窗口',
          _blank: '新窗口',
        },
      },
    },
  },
};
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: grapesjs-dev/packages/core/src/keymaps/config.ts

```typescript
import { CommandFunction } from '../commands/view/CommandAbstract';

export interface Keymap {
  id: string;
  keys: string;
  handler: string | CommandFunction;
}

export interface KeymapOptions {
  /**
   * Force the handler to be executed.
   */
  force?: boolean;
  /**
   * Prevent default of the original triggered event.
   */
  prevent?: boolean;
}

export interface KeymapsConfig {
  /**
   * Default keymaps.
   */
  defaults?: Record<string, Omit<Keymap, 'id'> & { opts?: KeymapOptions }>;
}

const config: () => KeymapsConfig = () => ({
  defaults: {
    'core:undo': {
      keys: '⌘+z, ctrl+z',
      handler: 'core:undo',
      opts: { prevent: true },
    },
    'core:redo': {
      keys: '⌘+shift+z, ctrl+shift+z',
      handler: 'core:redo',
      opts: { prevent: true },
    },
    'core:copy': {
      keys: '⌘+c, ctrl+c',
      handler: 'core:copy',
    },
    'core:paste': {
      keys: '⌘+v, ctrl+v',
      handler: 'core:paste',
    },
    'core:component-next': {
      keys: 's',
      handler: 'core:component-next',
    },
    'core:component-prev': {
      keys: 'w',
      handler: 'core:component-prev',
    },
    'core:component-enter': {
      keys: 'd',
      handler: 'core:component-enter',
    },
    'core:component-exit': {
      keys: 'a',
      handler: 'core:component-exit',
    },
    'core:component-delete': {
      keys: 'backspace, delete',
      handler: 'core:component-delete',
      opts: { prevent: true },
    },
  },
});

export default config;
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: grapesjs-dev/packages/core/src/keymaps/index.ts

```typescript
/**
 * You can customize the initial state of the module from the editor initialization
 * ```js
 * const editor = grapesjs.init({
 *  keymaps: {
 *     // Object of keymaps
 *    defaults: {
 *      'your-namespace:keymap-name' {
 *        keys: '⌘+z, ctrl+z',
 *        handler: 'some-command-id'
 *      },
 *      ...
 *    }
 *  }
 * })
 * ```
 *
 * Once the editor is instantiated you can use its API. Before using these methods you should get the module from the instance.
 *
 * ```js
 * const keymaps = editor.Keymaps;
 * ```
 *
 * {REPLACE_EVENTS}
 *
 * ## Methods
 * * [getConfig](#getconfig)
 * * [add](#add)
 * * [get](#get)
 * * [getAll](#getAll)
 * * [remove](#remove)
 * * [removeAll](#removeall)
 *
 * @module Keymaps
 */

import { isFunction, isString } from 'underscore';
import { Module } from '../abstract';
import EditorModel from '../editor/model/Editor';
import keymaster from '../utils/keymaster';
import { hasWin } from '../utils/mixins';
import defConfig, { Keymap, KeymapOptions, KeymapsConfig } from './config';
import { KeymapsEvents } from './types';

export type KeymapEvent = `${KeymapsEvents}`;

hasWin() && keymaster.init(window);

export default class KeymapsModule extends Module<KeymapsConfig & { name?: string }> {
  keymaster: any = keymaster;
  keymaps: Record<string, Keymap>;
  events = KeymapsEvents;

  constructor(em: EditorModel) {
    super(em, 'Keymaps', defConfig());
    this.keymaps = {};
  }

  onLoad() {
    if (this.em.isHeadless) return;
    const defKeys = this.config.defaults;

    for (let id in defKeys) {
      const value = defKeys[id];
      this.add(id, value.keys, value.handler, value.opts || {});
    }
  }

  /**
   * Get configuration object
   * @name getConfig
   * @function
   * @return {Object}
   */

  /**
   * Add new keymap
   * @param {string} id Keymap id
   * @param {string} keys Keymap keys, eg. `ctrl+a`, `⌘+z, ctrl+z`
   * @param {Function|string} handler Keymap handler, might be a function
   * @param {Object} [opts={}] Options
   * @param {Boolean} [opts.force=false] Force the handler to be executed.
   * @param {Boolean} [opts.prevent=false] Prevent default of the original triggered event.
   * @returns {Object} Added keymap
   * @example
   * // 'ns' is just a custom namespace
   * keymaps.add('ns:my-keymap', '⌘+j, ⌘+u, ctrl+j, alt+u', editor => {
   *  console.log('do stuff');
   * });
   * // or
   * keymaps.add('ns:my-keymap', '⌘+s, ctrl+s', 'some-gjs-command', {
   *  // Prevent the default browser action
   *  prevent: true,
   * });
   *
   * // listen to events
   * editor.on('keymap:emit', (id, shortcut, event) => {
   *  // ...
   * })
   */
  add(id: Keymap['id'], keys: Keymap['keys'], handler: Keymap['handler'], opts: KeymapOptions = {}) {
    const { em, events } = this;
    const cmd = em.Commands;
    const editor = em.getEditor();
    const canvas = em.Canvas;
    const keymap: Keymap = { id, keys, handler };
    const pk = this.keymaps[id];
    pk && this.remove(id);
    this.keymaps[id] = keymap;
    keymaster(
      keys,
      (e: any, h: any) => {
        // It's safer putting handlers resolution inside the callback
        const opt = { event: e, h };
        const handlerRes = isString(handler) ? cmd.get(handler) : handler;
        const ableTorun = !em.isEditing() && !editor.Canvas.isInputFocused();
        if (ableTorun || opts.force) {
          opts.prevent && canvas.getCanvasView()?.preventDefault(e);
          isFunction(handlerRes) ? handlerRes(editor, 0, opt) : cmd.runCommand(handlerRes, opt);
          const args = [id, h.shortcut, e];
          em.trigger(events.emit, ...args);
          em.trigger(`${events.emitId}${id}`, ...args);
        }
      },
      undefined,
    );
    em.trigger(events.add, keymap);
    return keymap;
  }

  /**
   * Get the keymap by id
   * @param {string} id Keymap id
   * @return {Object} Keymap object
   * @example
   * keymaps.get('ns:my-keymap');
   * // -> {keys, handler};
   */
  get(id: string) {
    return this.keymaps[id];
  }

  /**
   * Get all keymaps
   * @return {Object}
   * @example
   * keymaps.getAll();
   * // -> {id1: {}, id2: {}};
   */
  getAll() {
    return this.keymaps;
  }

  /**
   * Remove the keymap by id
   * @param {string} id Keymap id
   * @return {Object} Removed keymap
   * @example
   * keymaps.remove('ns:my-keymap');
   * // -> {keys, handler};
   */
  remove(id: string) {
    const { em, events } = this;
    const keymap = this.get(id);

    if (keymap) {
      delete this.keymaps[id];
      keymap.keys.split(', ').forEach((k) => {
        // @ts-ignore
        keymaster.unbind(k.trim());
      });
      em?.trigger(events.remove, keymap);
      return keymap;
    }
  }

  /**
   * Remove all binded keymaps
   * @return {this}
   */
  removeAll() {
    Object.keys(this.keymaps).forEach((keymap) => this.remove(keymap));
    keymaster.handlers = {};
    return this;
  }

  destroy() {
    this.removeAll();
    this.keymaps = {};
  }
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: grapesjs-dev/packages/core/src/keymaps/types.ts

```typescript
/**{START_EVENTS}*/
export enum KeymapsEvents {
  /**
   * @event `keymap:add` New keymap added. The new keymap object is passed as an argument to the callback.
   * @example
   * editor.on('keymap:add', (keymap) => { ... });
   */
  add = 'keymap:add',

  /**
   * @event `keymap:remove` Keymap removed. The removed keymap object is passed as an argument to the callback.
   * @example
   * editor.on('keymap:remove', (keymap) => { ... });
   */
  remove = 'keymap:remove',

  /**
   * @event `keymap:emit` Some keymap emitted. The keymapId, shortcutUsed, and Event are passed as arguments to the callback.
   * @example
   * editor.on('keymap:emit', (keymapId, shortcutUsed, event) => { ... });
   */
  emit = 'keymap:emit',
  emitId = 'keymap:emit:',
}
/**{END_EVENTS}*/

// need this to avoid the TS documentation generator to break
export default KeymapsEvents;
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: grapesjs-dev/packages/core/src/modal_dialog/index.ts

```typescript
/**
 * You can customize the initial state of the module from the editor initialization, by passing the following [Configuration Object](https://github.com/GrapesJS/grapesjs/blob/master/src/modal_dialog/config/config.ts)
 * ```js
 * const editor = grapesjs.init({
 *  modal: {
 *    // options
 *  }
 * })
 * ```
 *
 * Once the editor is instantiated you can use its API. Before using these methods you should get the module from the instance
 *
 * ```js
 * const modal = editor.Modal;
 * ```
 *
 * {REPLACE_EVENTS}
 *
 * ## Methods
 * * [open](#open)
 * * [close](#close)
 * * [isOpen](#isopen)
 * * [setTitle](#settitle)
 * * [getTitle](#gettitle)
 * * [setContent](#setcontent)
 * * [getContent](#getcontent)
 * * [onceClose](#onceclose)
 * * [onceOpen](#onceopen)
 *
 * @module Modal
 */

import { debounce, isFunction, isString } from 'underscore';
import { Module } from '../abstract';
import { EventHandler } from '../common';
import EditorModel from '../editor/model/Editor';
import EditorView from '../editor/view/EditorView';
import { createText } from '../utils/dom';
import defConfig, { ModalConfig } from './config/config';
import ModalM from './model/Modal';
import { ModalEvents } from './types';
import ModalView from './view/ModalView';

export type ModalEvent = `${ModalEvents}`;

export default class ModalModule extends Module<ModalConfig> {
  modal?: ModalView;
  events = ModalEvents;

  /**
   * Initialize module. Automatically called with a new instance of the editor
   * @param {Object} config Configurations
   * @private
   */
  constructor(em: EditorModel) {
    super(em, 'Modal', defConfig());
    const { events } = this;
    this.model = new ModalM(this);
    this.model.on('change:open', (m: ModalM, enable: boolean) => {
      em.trigger(enable ? events.open : events.close);
    });
    this.model.on(
      'change',
      debounce(() => {
        const data = this._evData();
        const { custom } = this.config;
        //@ts-ignore
        isFunction(custom) && custom(data);
        em.trigger(events.all, data);
      }, 0),
    );

    return this;
  }

  _evData() {
    const titl = this.getTitle();
    const cnt = this.getContent();
    const { open, attributes } = this.model.attributes;
    return {
      open,
      attributes,
      title: isString(titl) ? createText(titl) : titl,
      //@ts-ignore
      content: isString(cnt) ? createText(cnt) : cnt.get ? cnt.get(0) : cnt,
      close: () => {
        this.close();
      },
    };
  }

  postRender(view: EditorView) {
    const el = view.model.config.el || view.el;
    const res = this.render();
    res && el?.appendChild(res);
  }

  /**
   * Open the modal window
   * @param {Object} [opts={}] Options
   * @param {String|HTMLElement} [opts.title] Title to set for the modal
   * @param {String|HTMLElement} [opts.content] Content to set for the modal
   * @param {Object} [opts.attributes] Updates the modal wrapper with custom attributes
   * @returns {this}
   * @example
   * modal.open({
   *   title: 'My title',
   *   content: 'My content',
   *   attributes: { class: 'my-class' },
   * });
   */
  open(opts: any = {}) {
    const attr = opts.attributes || {};
    opts.title && this.setTitle(opts.title);
    opts.content && this.setContent(opts.content);
    this.model.set('attributes', attr);
    this.model.open();
    this.modal && this.modal.updateAttr(attr);
    return this;
  }

  /**
   * Close the modal window
   * @returns {this}
   * @example
   * modal.close();
   */
  close() {
    this.model.close();
    return this;
  }

  /**
   * Execute callback when the modal will be closed.
   * The callback will be called one only time
   * @param {Function} clb Callback to call
   * @returns {this}
   * @example
   * modal.onceClose(() => {
   *  console.log('The modal is closed');
   * });
   */
  onceClose(clb: EventHandler) {
    const { em, events } = this;
    em.once(events.close, clb);
    return this;
  }

  /**
   * Execute callback when the modal will be opened.
   * The callback will be called one only time
   * @param {Function} clb Callback to call
   * @returns {this}
   * @example
   * modal.onceOpen(() => {
   *  console.log('The modal is opened');
   * });
   */
  onceOpen(clb: EventHandler) {
    const { em, events } = this;
    em.once(events.open, clb);
    return this;
  }

  /**
   * Checks if the modal window is open
   * @returns {Boolean}
   * @example
   * modal.isOpen(); // true | false
   */
  isOpen() {
    return !!this.model.get('open');
  }

  /**
   * Set the title to the modal window
   * @param {string | HTMLElement} title Title
   * @returns {this}
   * @example
   * // pass a string
   * modal.setTitle('Some title');
   * // or an HTMLElement
   * const el = document.createElement('div');
   * el.innerText =  'New title';
   * modal.setTitle(el);
   */
  setTitle(title: string) {
    this.model.set('title', title);
    return this;
  }

  /**
   * Returns the title of the modal window
   * @returns {string | HTMLElement}
   * @example
   * modal.getTitle();
   */
  getTitle() {
    return this.model.get('title');
  }

  /**
   * Set the content of the modal window
   * @param {string | HTMLElement} content Content
   * @returns {this}
   * @example
   * // pass a string
   * modal.setContent('Some content');
   * // or an HTMLElement
   * const el = document.createElement('div');
   * el.innerText =  'New content';
   * modal.setContent(el);
   */
  setContent(content: string | HTMLElement) {
    this.model.set('content', ' ');
    this.model.set('content', content);
    return this;
  }

  /**
   * Get the content of the modal window
   * @returns {string | HTMLElement}
   * @example
   * modal.getContent();
   */
  getContent(): string | HTMLElement {
    return this.model.get('content');
  }

  /**
   * Returns content element
   * @return {HTMLElement}
   * @private
   */
  getContentEl(): HTMLElement | undefined {
    return this.modal?.getContent().get(0);
  }

  /**
   * Returns modal model
   * @return {Model}
   * @private
   */
  getModel() {
    return this.model;
  }

  /**
   * Render the modal window
   * @return {HTMLElement}
   * @private
   */
  render(): HTMLElement | undefined {
    if (this.config.custom) return;
    const View = ModalView.extend(this.config.extend);
    const el = this.modal && this.modal.el;
    this.modal = new View({
      el,
      model: this.model,
      config: this.config,
    });
    return this.modal?.render().el;
  }

  destroy() {
    this.modal?.remove();
  }
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: grapesjs-dev/packages/core/src/modal_dialog/types.ts

```typescript
/**{START_EVENTS}*/
export enum ModalEvents {
  /**
   * @event `modal:open` Modal is opened
   * @example
   * editor.on('modal:open', () => { ... });
   */
  open = 'modal:open',

  /**
   * @event `modal:close` Modal is closed
   * @example
   * editor.on('modal:close', () => { ... });
   */
  close = 'modal:close',

  /**
   * @event `modal` Event triggered on any change related to the modal. An object containing all the available data about the triggered event is passed as an argument to the callback.
   * @example
   * editor.on('modal', ({ open, title, content, ... }) => { ... });
   */
  all = 'modal',
}
/**{END_EVENTS}*/

// need this to avoid the TS documentation generator to break
export default ModalEvents;
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: grapesjs-dev/packages/core/src/modal_dialog/config/config.ts

```typescript
export interface ModalConfig {
  stylePrefix?: string;
  title?: string;
  content?: string;
  /**
   * Close modal on interact with backdrop.
   * @default true
   */
  backdrop?: boolean;

  /**
   * Avoid rendering the default modal.
   * @default false
   */
  custom?: boolean;

  /**
   * Extend ModalView object (view/ModalView.js)
   * @example
   * extend: {
   *   template() {
   *     return '<div>...New modal template...</div>';
   *   },
   * },
   */
  extend?: Record<string, any>;
}

const config: () => ModalConfig = () => ({
  stylePrefix: 'mdl-',
  title: '',
  content: '',
  backdrop: true,
  custom: false,
  extend: {},
});

export default config;
```

--------------------------------------------------------------------------------

---[FILE: Modal.ts]---
Location: grapesjs-dev/packages/core/src/modal_dialog/model/Modal.ts

```typescript
import ModalModule from '..';
import { ModuleModel } from '../../abstract';

export default class Modal extends ModuleModel<ModalModule> {
  defaults() {
    return {
      title: '',
      content: '',
      attributes: {},
      open: false,
    };
  }

  open() {
    this.set('open', true);
  }

  close() {
    this.set('open', false);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ModalView.ts]---
Location: grapesjs-dev/packages/core/src/modal_dialog/view/ModalView.ts

```typescript
import { ModuleView } from '../../abstract';
import Modal from '../model/Modal';

export default class ModalView extends ModuleView<Modal> {
  template({ pfx, ppfx, content, title }: any) {
    return `<div class="${pfx}dialog ${ppfx}one-bg ${ppfx}two-color">
      <div class="${pfx}header">
        <div class="${pfx}title">${title}</div>
        <div class="${pfx}btn-close" data-close-modal>&Cross;</div>
      </div>
      <div class="${pfx}content">
        <div id="${pfx}c">${content}</div>
        <div style="clear:both"></div>
      </div>
    </div>
    <div class="${pfx}collector" style="display: none"></div>`;
  }

  events() {
    return {
      click: 'onClick',
      'click [data-close-modal]': 'hide',
    };
  }

  $title?: JQuery<HTMLElement>;
  $content?: JQuery<HTMLElement>;
  $collector?: JQuery<HTMLElement>;

  constructor(o: any) {
    super(o);
    const model = this.model;
    this.listenTo(model, 'change:open', this.updateOpen);
    this.listenTo(model, 'change:title', this.updateTitle);
    this.listenTo(model, 'change:content', this.updateContent);
  }

  onClick(e: Event) {
    const bkd = this.config.backdrop;
    bkd && e.target === this.el && this.hide();
  }

  /**
   * Returns collector element
   * @return {HTMLElement}
   * @private
   */
  getCollector() {
    if (!this.$collector) this.$collector = this.$el.find('.' + this.pfx + 'collector');
    return this.$collector;
  }

  /**
   * Returns content element
   * @return {HTMLElement}
   */
  getContent() {
    const pfx = this.pfx;

    if (!this.$content) {
      this.$content = this.$el.find(`.${pfx}content #${pfx}c`);
    }

    return this.$content;
  }

  /**
   * Returns title element
   * @return {HTMLElement}
   * @private
   */
  getTitle(opts: any = {}) {
    if (!this.$title) this.$title = this.$el.find('.' + this.pfx + 'title');
    return opts.$ ? this.$title : this.$title.get(0);
  }

  /**
   * Update content
   * @private
   * */
  updateContent() {
    var content = this.getContent();
    const children = content.children();
    const coll = this.getCollector();
    const body = this.model.get('content');
    children.length && coll.append(children);
    content.empty().append(body);
  }

  /**
   * Update title
   * @private
   * */
  updateTitle() {
    const title = this.getTitle({ $: true });
    //@ts-ignore
    title && title.empty().append(this.model.get('title'));
  }

  /**
   * Update open
   * @private
   * */
  updateOpen() {
    this.el.style.display = this.model.get('open') ? '' : 'none';
  }

  /**
   * Hide modal
   * @private
   * */
  hide() {
    this.model.close();
  }

  /**
   * Show modal
   * @private
   * */
  show() {
    this.model.open();
  }

  updateAttr(attr?: any) {
    const { pfx, $el, el } = this;
    //@ts-ignore
    const currAttr = [].slice.call(el.attributes).map((i) => i.name);
    $el.removeAttr(currAttr.join(' '));
    $el.attr({
      ...(attr || {}),
      class: `${pfx}container ${(attr && attr.class) || ''}`.trim(),
    });
  }

  render() {
    const el = this.$el;
    const obj = this.model.toJSON();
    obj.pfx = this.pfx;
    obj.ppfx = this.ppfx;
    el.html(this.template(obj));
    this.updateAttr();
    this.updateOpen();
    return this;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: grapesjs-dev/packages/core/src/navigator/index.ts

```typescript
/**
 * You can customize the initial state of the module from the editor initialization
 * ```js
 * const editor = grapesjs.init({
 *  // ...
 *  layerManager: {
 *    // ...
 *  },
 * })
 * ```
 *
 * Once the editor is instantiated you can use its API. Before using these methods you should get the module from the instance.
 *
 * ```js
 * const layers = editor.Layers;
 * ```
 *
 * {REPLACE_EVENTS}
 *
 * ## Methods
 * * [setRoot](#setroot)
 * * [getRoot](#getroot)
 * * [getComponents](#getcomponents)
 * * [setOpen](#setopen)
 * * [isOpen](#isopen)
 * * [setVisible](#setvisible)
 * * [isVisible](#isvisible)
 * * [setlocked](#setlocked)
 * * [isLocked](#islocked)
 * * [setName](#setname)
 * * [getName](#getname)
 * * [getLayerData](#getlayerdata)
 *
 * [Page]: page.html
 * [Component]: component.html
 *
 * @module Layers
 */

import { bindAll, isString } from 'underscore';
import { ModuleModel } from '../abstract';
import Module from '../abstract/Module';
import Component from '../dom_components/model/Component';
import { ComponentsEvents } from '../dom_components/types';
import EditorModel from '../editor/model/Editor';
import { hasWin, isComponent, isDef } from '../utils/mixins';
import defConfig, { LayerManagerConfig } from './config/config';
import { LayerData, LayerEvents } from './types';
import View from './view/ItemView';

export type LayerEvent = `${LayerEvents}`;

const styleOpts = { mediaText: '' };

const propsToListen = ['open', 'status', 'locked', 'custom-name', 'components', 'classes']
  .map((p) => `${ComponentsEvents.update}:${p}`)
  .join(' ');

const isStyleHidden = (style: any = {}) => {
  return (style.display || '').trim().indexOf('none') === 0;
};

export default class LayerManager extends Module<LayerManagerConfig> {
  model!: ModuleModel;
  __ctn?: HTMLElement;

  view?: View;

  events = LayerEvents;

  constructor(em: EditorModel) {
    super(em, 'LayerManager', defConfig());
    bindAll(this, 'componentChanged', '__onRootChange', '__onComponent');
    this.model = new ModuleModel(this, { opened: {} });
    // @ts-ignore
    this.config.stylePrefix = this.config.pStylePrefix;
    return this;
  }

  onLoad() {
    const { em, config, model } = this;
    model.listenTo(em, 'component:selected', this.componentChanged);
    model.on('change:root', this.__onRootChange);
    model.listenTo(em, propsToListen, this.__onComponent);
    this.componentChanged();
    model.listenToOnce(em, 'load', () => {
      this.setRoot(config.root!);
      this.__appendTo();
    });
  }

  /**
   * Update the root layer with another component.
   * @param {[Component]|String} component Component to be set as root
   * @return {[Component]}
   * @example
   * const component = editor.getSelected();
   * layers.setRoot(component);
   */
  setRoot(component: Component | string): Component {
    const wrapper: Component = this.em.getWrapper()!;
    let root = isComponent(component) ? (component as Component) : wrapper;

    if (component && isString(component) && hasWin()) {
      root = wrapper.find(component)[0] || wrapper;
    }

    const result = this.__getLayerFromComponent(root);
    this.model.set('root', result);

    return result;
  }

  /**
   * Get the current root layer.
   * @return {[Component]}
   * @example
   * const layerRoot = layers.getRoot();
   */
  getRoot(): Component {
    return this.model.get('root'); // || this.em.getWrapper();
  }

  /**
   * Get valid layer child components (eg. excludes non layerable components).
   * @param {[Component]} component Component from which you want to get child components
   * @returns {Array<[Component]>}
   * @example
   * const component = editor.getSelected();
   * const components = layers.getComponents(component);
   * console.log(components);
   */
  getComponents(component: Component): Component[] {
    return component
      .components()
      .map((cmp) => this.__getLayerFromComponent(cmp))
      .filter((cmp: any) => this.__isLayerable(cmp));
  }

  /**
   * Update the layer open state of the component.
   * @param {[Component]} component Component to update
   * @param {Boolean} value
   */
  setOpen(component: Component, value: boolean) {
    component.set('open', value);
  }

  /**
   * Check the layer open state of the component.
   * @param {[Component]} component
   * @returns {Boolean}
   */
  isOpen(component: Component): boolean {
    return !!component.get('open');
  }

  /**
   * Update the layer visibility state of the component.
   * @param {[Component]} component Component to update
   * @param {Boolean} value
   */
  setVisible(component: Component, value: boolean) {
    const prevDspKey = '__prev-display';
    const style: any = component.getStyle(styleOpts as any);
    const { display } = style;

    if (value) {
      const prevDisplay = component.get(prevDspKey);
      delete style.display;

      if (prevDisplay) {
        style.display = prevDisplay;
        component.unset(prevDspKey);
      }
    } else {
      display && component.set(prevDspKey, display);
      style.display = 'none';
    }

    component.setStyle(style, styleOpts as any);
    this.updateLayer(component);
    this.em.trigger('component:toggled'); // Updates Style Manager #2938
  }

  /**
   * Check the layer visibility state of the component.
   * @param {[Component]} component
   * @returns {Boolean}
   */
  isVisible(component: Component): boolean {
    return !isStyleHidden(component.getStyle(styleOpts as any));
  }

  /**
   * Update the layer locked state of the component.
   * @param {[Component]} component Component to update
   * @param {Boolean} value
   */
  setLocked(component: Component, value: boolean) {
    component.set('locked', value);
  }

  /**
   * Check the layer locked state of the component.
   * @param {[Component]} component
   * @returns {Boolean}
   */
  isLocked(component: Component): boolean {
    return !!component.get('locked');
  }

  /**
   * Update the layer name of the component.
   * @param {[Component]} component Component to update
   * @param {String} value New name
   */
  setName(component: Component, value: string) {
    component.set('custom-name', value);
  }

  /**
   * Get the layer name of the component.
   * @param {[Component]} component
   * @returns {String} Component layer name
   */
  getName(component: Component) {
    return component.getName();
  }

  /**
   * Get layer data from a component.
   * @param {[Component]} component Component from which you want to read layer data.
   * @returns {Object} Object containing the layer data.
   * @example
   * const component = editor.getSelected();
   * const layerData = layers.getLayerData(component);
   * console.log(layerData);
   */
  getLayerData(component: Component): LayerData {
    const status = component.get('status');

    return {
      name: component.getName(),
      open: this.isOpen(component),
      selected: status === 'selected',
      hovered: status === 'hovered', // || this.em.getHovered() === component,
      visible: this.isVisible(component),
      locked: this.isLocked(component),
      components: this.getComponents(component),
    };
  }

  setLayerData(component: Component, data: Partial<Omit<LayerData, 'components'>>, opts = {}) {
    const { em, config } = this;
    const { open, selected, hovered, visible, locked, name } = data;
    const cmpOpts = { fromLayers: true, ...opts } as any;

    if (isDef(open)) {
      this.setOpen(component, open!);
    }
    if (isDef(selected)) {
      if (selected) {
        em.setSelected(component, cmpOpts);
        const scroll = config.scrollCanvas;
        scroll && component.views?.forEach((view: any) => view.scrollIntoView(scroll));
      } else {
        em.removeSelected(component, cmpOpts);
      }
    }
    if (isDef(hovered) && config.showHover) {
      hovered ? em.setHovered(component, cmpOpts) : em.setHovered(null, cmpOpts);
    }
    if (isDef(visible)) {
      visible !== this.isVisible(component) && this.setVisible(component, visible!);
    }
    if (isDef(locked)) {
      this.setLocked(component, locked!);
    }
    if (isDef(name)) {
      this.setName(component, name!);
    }
  }

  /**
   * Triggered when the selected component is changed
   * @private
   */
  componentChanged(sel?: Component, opts = {}) {
    // @ts-ignore
    if (opts.fromLayers) return;
    const { em, config } = this;
    const { scrollLayers } = config;
    const opened = this.model.get('opened');
    const selected = em.getSelected();
    let parent = selected?.parent();

    for (let cid in opened) {
      opened[cid].set('open', false);
      delete opened[cid];
    }

    while (parent) {
      parent.set('open', true);
      opened[parent.cid] = parent;
      parent = parent.parent();
    }

    if (selected && scrollLayers) {
      const el = selected.viewLayer?.el;
      el?.scrollIntoView(scrollLayers);
    }
  }

  getAll() {
    return this.view;
  }

  render() {
    const { config, model } = this;
    const ItemView = View.extend(config.extend);
    this.view = new ItemView({
      el: this.view?.el,
      ItemView,
      level: 0,
      config,
      opened: model.get('opened'),
      model: this.getRoot(),
      module: this,
    });
    return this.view?.render().el as HTMLElement;
  }

  destroy() {
    this.view?.remove();
  }

  __onRootChange() {
    const { em, events } = this;
    const root = this.getRoot();
    this.view?.setRoot(root);
    em.trigger(events.root, root);
    this.__trgCustom();
  }

  __getLayerFromComponent(cmp: Component) {
    return cmp.delegate?.layer?.(cmp) || cmp;
  }

  __onComponent(component: Component) {
    this.updateLayer(component);
  }

  __isLayerable(cmp: Component): boolean {
    const tag = cmp.tagName;
    const hideText = this.config.hideTextnode;
    const isValid = !hideText || (!cmp.isInstanceOf('textnode') && tag !== 'br');

    return isValid && cmp.get('layerable')!;
  }

  __trgCustom(opts?: any) {
    const { __ctn, em, events } = this;
    this.__ctn = __ctn || opts?.container;
    em.trigger(events.custom, {
      container: this.__ctn,
      root: this.getRoot(),
    });
  }

  updateLayer(component: Component, opts?: any) {
    const { em, events } = this;
    em.trigger(events.component, component, opts);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: grapesjs-dev/packages/core/src/navigator/types.ts

```typescript
import Component from '../dom_components/model/Component';

export interface LayerData {
  name: string;
  open: boolean;
  selected: boolean;
  hovered: boolean;
  visible: boolean;
  locked: boolean;
  components: Component[];
}

/**{START_EVENTS}*/
export enum LayerEvents {
  /**
   * @event `layer:root` Root layer changed. The new root component is passed as an argument to the callback.
   * @example
   * editor.on('layer:root', (component) => { ... });
   */
  root = 'layer:root',

  /**
   * @event `layer:component` Component layer is updated. The updated component is passed as an argument to the callback.
   * @example
   * editor.on('layer:component', (component, opts) => { ... });
   */
  component = 'layer:component',

  /**
   * @event `layer:custom` Custom layer event. Object with container and root is passed as an argument to the callback.
   * @example
   * editor.on('layer:custom', ({ container, root }) => { ... });
   */
  custom = 'layer:custom',
}
/**{END_EVENTS}*/

// need this to avoid the TS documentation generator to break
export default LayerEvents;
```

--------------------------------------------------------------------------------

````
