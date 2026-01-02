---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 88
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 88 of 97)

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
Location: grapesjs-dev/packages/core/test/specs/dom_components/view/ComponentTextView.ts

```typescript
import ComponentTextView from '../../../../src/dom_components/view/ComponentTextView';
import Component from '../../../../src/dom_components/model/Component';
import Editor from '../../../../src/editor/model/Editor';
import { CustomRTE } from '../../../../src/rich_text_editor/config/config';

describe('ComponentTextView', () => {
  let fixtures: HTMLElement;
  let model;
  let view: ComponentTextView;
  let el: HTMLElement;
  let dcomp;
  let compOpts: any;
  let compViewOpts: any;
  let em: Editor;

  beforeEach(() => {
    em = new Editor({ avoidDefaults: true });
    dcomp = em.Components;
    compOpts = {
      em,
      componentTypes: dcomp.componentTypes,
      domc: dcomp,
    };
    model = new Component({}, compOpts);
    compViewOpts = {
      config: { ...em.config, em },
      model,
    };
    view = new ComponentTextView(compViewOpts);
    document.body.innerHTML = '<div id="fixtures"></div>';
    fixtures = document.body.querySelector('#fixtures')!;
    el = view.render().el;
    fixtures.appendChild(el);
  });

  afterEach(() => {
    view.remove();
  });

  test('Component empty', () => {
    expect(fixtures.innerHTML).toEqual(
      `<div data-gjs-highlightable="true" id="${el.id}" data-gjs-type="default"></div>`,
    );
  });

  test('Input content is stored in model', () => {
    //view.enableEditing();
    view.el.innerHTML = 'test';
    //view.disableEditing();
    //model.get('content').should.equal('test');
  });

  test('Init with content', () => {
    model = new Component({ content: 'test' }, compOpts);
    view = new ComponentTextView({ ...compViewOpts, model });
    fixtures.appendChild(view.render().el);
    expect(view.el.innerHTML).toEqual('test');
  });

  describe('.getContent', () => {
    let fakeRte: CustomRTE<any>;
    let fakeRteContent = '';
    let fakeChildContainer: any;

    beforeEach(() => {
      fakeRteContent = 'fakeRteContent';

      fakeRte = {
        enable() {},
        disable() {},
        getContent: jest.fn(() => fakeRteContent),
      };

      fakeChildContainer = {
        innerHTML: 'fakeChildInnerHTML',
      };

      jest.spyOn(view, 'getChildrenContainer').mockReturnValue(fakeChildContainer);
      em.RichTextEditor.customRte = fakeRte;
    });

    it('should get content from active RTE if available', async () => {
      view.activeRte = {} as any;
      expect(await view.getContent()).toEqual(fakeRteContent);
      expect(fakeRte.getContent).toHaveBeenCalled();
    });

    it("should get child container's `innerHTML` if active RTE is not available or if it has no `getContent` function", async () => {
      expect(await view.getContent()).toEqual(fakeChildContainer.innerHTML);

      delete fakeRte.getContent;
      view.activeRte = {} as any;
      expect(await view.getContent()).toEqual(fakeChildContainer.innerHTML);

      expect(view.getChildrenContainer).toHaveBeenCalledTimes(2);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ComponentView.ts]---
Location: grapesjs-dev/packages/core/test/specs/dom_components/view/ComponentView.ts

```typescript
import Component from '../../../../src/dom_components/model/Component';
import ComponentView from '../../../../src/dom_components/view/ComponentView';
import Editor from '../../../../src/editor/model/Editor';

describe('ComponentView', () => {
  let fixtures: Element;
  let model: Component;
  let view: ComponentView;
  let dcomp: Editor['Components'];
  let compOpts: any;
  let em: Editor;
  let el: HTMLElement;
  let compViewOpst: any;

  beforeEach(() => {
    em = new Editor({});
    dcomp = em.Components;
    compOpts = {
      em,
      componentTypes: dcomp.componentTypes,
    };
    model = new Component({}, compOpts);
    compViewOpst = {
      config: {},
    };
    view = new ComponentView({
      ...compViewOpst,
      model,
    });
    em.Styles.render(); // Enable to listen em.setState
    document.body.innerHTML = '<div id="fixtures"></div>';
    fixtures = document.body.querySelector('#fixtures')!;
    el = view.render().el;
    fixtures.appendChild(el);
  });

  afterEach(() => {
    view.remove();
  });

  test('Component empty', () => {
    expect(fixtures.innerHTML).toEqual(
      `<div data-gjs-highlightable="true" id="${el.id}" data-gjs-type="default"></div>`,
    );
  });

  test('Clean form helper state', () => {
    em.setSelected(model);
    em.setState('test');
    em.setState('');
    expect(fixtures.innerHTML).toEqual(
      `<div data-gjs-highlightable="true" id="${el.id}" data-gjs-type="default" class="selected"></div>`,
    );
  });

  test('Add helper class on status update', () => {
    model.set('status', 'selected');
    expect(fixtures.innerHTML).toEqual(
      `<div data-gjs-highlightable="true" id="${el.id}" data-gjs-type="default" class="selected"></div>`,
    );
  });

  test('Get string of classes', () => {
    model.set('attributes', { class: ['test', 'test2'] });
    expect(view.getClasses()).toEqual('test test2');
  });

  test('Update attributes', () => {
    model.set('attributes', {
      title: 'value',
      'data-test': 'value2',
    });
    expect(view.el.getAttribute('title')).toEqual('value');
    expect(view.el.getAttribute('data-test')).toEqual('value2');
  });

  test('Update style', () => {
    model.set('style', {
      color: 'red',
      float: 'left',
    });
    expect(view.el.getAttribute('style')).toEqual('color:red;float:left;');
  });

  test('Clean style', () => {
    model.set('style', { color: 'red' });
    model.set('style', {});
    expect(view.el.getAttribute('style')).toEqual(null);
  });

  test('Add class', () => {
    model.classes.add({ name: 'test' });
    expect(view.el.getAttribute('class')).toEqual('test');
  });

  test('Add classes', () => {
    model.classes.add([{ name: 'test' }, { name: 'test2' }]);
    expect(view.el.getAttribute('class')).toEqual('test test2');
  });

  test('Update on remove of some class', () => {
    var cls1 = model.classes.add({ name: 'test' });
    var cls12 = model.classes.add({ name: 'test2' });
    model.classes.remove(cls1);
    expect(view.el.getAttribute('class')).toEqual('test2');
  });

  test('Init with different tag', () => {
    model = new Component({ tagName: 'span' }, compOpts);
    view = new ComponentView({ ...compViewOpst, model });
    fixtures.innerHTML = '';
    fixtures.appendChild(view.render().el);
    expect(view.render().el.tagName).toEqual('SPAN');
  });

  test('Init with nested components', () => {
    model = new Component(
      {
        // @ts-ignore
        components: [{ tagName: 'span' }, { attributes: { title: 'test' } }],
      },
      compOpts,
    );
    view = new ComponentView({
      ...compViewOpst,
      model,
      // @ts-ignore
      componentTypes: dcomp.componentTypes,
    });
    fixtures.innerHTML = '';
    el = view.render().el;
    fixtures.appendChild(el);
    const firstId = el.children[0].id;
    const secondId = el.children[1].id;
    expect(view.$el.html()).toEqual(
      `<span data-gjs-highlightable="true" id="${firstId}" data-gjs-type="default"></span><div data-gjs-highlightable="true" id="${secondId}" data-gjs-type="default" title="test"></div>`,
    );
  });

  test('removeClass removes classes from attributes', () => {
    model.addClass('class1');
    model.removeClass('class1');
    const result = model.getAttributes();
    expect(result.class).toEqual(undefined);
  });

  test('updateStatus removes previous classes and adds new ones', () => {
    model.addClass('selected');

    model.set('locked', true);
    view.updateStatus();
    expect(view.el.getAttribute('class')).toEqual('no-pointer');

    model.set('locked', false);
    view.updateStatus();
    expect(view.el.getAttribute('class')).toEqual('pointer-init');

    model.set('locked');
    view.updateStatus();
    expect(view.el.getAttribute('class')).toEqual('');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: grapesjs-dev/packages/core/test/specs/editor/index.ts

```typescript
import Editor from '../../../src/editor';
import { DEFAULT_CMPS } from '../../common';

const { keys } = Object;

describe('Editor', () => {
  let editor: Editor;

  beforeEach((done) => {
    editor = new Editor();
    editor.getModel().loadOnStart();
    editor.on('change:readyLoad', () => done());
  });

  afterEach(() => {
    editor.destroy();
  });

  test('Object exists', () => {
    expect(editor).toBeTruthy();
  });

  test('Has no components', () => {
    const all = editor.Components.allById();
    const allKeys = keys(all);
    // By default 1 wrapper components is created
    expect(allKeys.length).toBe(DEFAULT_CMPS);
    expect(all[allKeys[0]].get('type')).toBe('wrapper');
  });

  test('Has no CSS rules', () => {
    const all = editor.Css.getAll();
    expect(all.length).toBe(0);
  });

  test('Has one default frame', () => {
    const all = editor.Canvas.getFrames();
    expect(all.length).toBe(1);
  });

  test('The default frame has the same main component and css', () => {
    const wrapper = editor.getWrapper();
    const style = editor.getStyle();
    const frame = editor.Canvas.getFrame();
    expect(wrapper).toBe(frame.getComponent());
    expect(style).toBe(frame.get('styles'));
  });

  test('Components are correctly tracked on add', () => {
    const all = editor.Components.allById();
    const wrapper = editor.getWrapper()!;
    wrapper.append('<div>Component</div>'); // Div component + textnode
    expect(keys(all).length).toBe(2 + DEFAULT_CMPS);
  });

  test('Components are correctly tracked on add and remove', () => {
    const all = editor.Components.allById();
    const wrapper = editor.getWrapper()!;
    const added = wrapper.append(`
        <div>Component 1</div>
        <div></div>
    `);
    expect(keys(all).length).toBe(3 + DEFAULT_CMPS);
    const secComp = added[1];
    secComp.append(`
        <div>Component 2</div>
        <div>Component 3</div>
    `);
    expect(keys(all).length).toBe(7 + DEFAULT_CMPS);
    wrapper.empty();
    expect(wrapper.components().length).toBe(0);
    expect(keys(all).length).toBe(DEFAULT_CMPS);
  });

  test('Components are correctly tracked with UndoManager', () => {
    const all = editor.Components.allById();
    const um = editor.UndoManager;
    const umStack = um.getStack();
    const wrapper = editor.getWrapper()!;
    expect(umStack.length).toBe(0);
    wrapper.append('<div>Component 1</div>')[0];
    expect(umStack.length).toBe(1);
    wrapper.empty();
    expect(umStack.length).toBe(2);
    expect(keys(all).length).toBe(DEFAULT_CMPS);
    um.undo(false);
    expect(keys(all).length).toBe(2 + DEFAULT_CMPS);
  });

  test('Components are correctly tracked with UndoManager and mutiple operations', () => {
    const all = editor.Components.allById();
    const um = editor.UndoManager;
    const umStack = um.getStack();
    const wrapper = editor.getWrapper()!;
    expect(umStack.length).toBe(0);
    wrapper.append(`<div>
        <div>Component 1</div>
        <div>Component 2</div>
    </div>`);
    expect(umStack.length).toBe(1); // UM counts first children
    expect(keys(all).length).toBe(5 + DEFAULT_CMPS);
    wrapper.components().at(0).components().at(0).remove(); // Remove 1 component

    expect(umStack.length).toBe(2);
    expect(keys(all).length).toBe(3 + DEFAULT_CMPS);
    wrapper.empty();
    expect(umStack.length).toBe(3);
    expect(keys(all).length).toBe(DEFAULT_CMPS);
  });

  test('One component can be selected at a time without shift', () => {
    const all = editor.Components.allById();
    const em = editor.em;
    em.getConfig().multipleSelection = true;
    const wrapper = editor.getWrapper()!;
    const added = wrapper.append(`
      <div>Component 1</div>
      <div>Component 2</div>
    `);
    em.setSelected(added[0]);
    em.setSelected(added[1]);
    expect(editor.getSelectedAll().length).toBe(1);
  });

  test('Shift key should allow selecting multiple components', () => {
    const all = editor.Components.allById();
    const em = editor.em;
    em.getConfig().multipleSelection = true;
    const wrapper = editor.getWrapper()!;
    const added = wrapper.append(`
      <div>Component 1</div>
      <div>Component 2</div>
    `);

    const callSelectedOptions = {
      event: {
        shiftKey: true,
      },
    } as any;

    em.setSelected(added[0], callSelectedOptions);
    em.setSelected(added[1], callSelectedOptions);
    expect(editor.getSelectedAll().length).toBe(2);
  });

  test('Shift key selecting a component that is being edited should should be ignored', () => {
    const all = editor.Components.allById();
    const em = editor.em;
    em.getConfig().multipleSelection = true;
    const wrapper = editor.getWrapper()!;
    const added = wrapper.append(`
      <div>Component 1</div>
      <div>Component 2</div>
    `);

    const callSelectedOptions = {
      event: {
        shiftKey: true,
      },
    } as any;

    const firstComponent = all[keys(all)[0]];
    firstComponent.em.setEditing(true);
    em.setSelected(added[0], callSelectedOptions);
    expect(editor.getSelectedAll().length).toBe(0);
  });

  test.skip('Shift key selecting a component that is being edited should not clear any text selections', () => {
    const all = editor.Components.allById();
    const em = editor.em;
    em.getConfig().multipleSelection = true;
    const wrapper = editor.getWrapper()!;
    const added = wrapper.append(`
      <div>Component 1</div>
      <div>Component 2</div>
    `);

    const callSelectedOptions = {
      event: {
        shiftKey: true,
      },
    } as any;

    const firstComponent = all[keys(all)[0]];
    firstComponent.em.setEditing(true);
    // TODO: highlight the text of the first component

    em.setSelected(added[0], callSelectedOptions);
    // TODO: check if the text of the first component is still highlighted
    expect(editor.getSelectedAll().length).toBe(0);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: telemetry.ts]---
Location: grapesjs-dev/packages/core/test/specs/editor/telemetry.ts

```typescript
import grapesjs from '../../../src';
import { EditorConfig } from '../../../src/editor/config/config';
import { fixJsDom, fixJsDomIframe, waitEditorEvent } from '../../common';

import * as hostUtil from '../../../src/utils/host-name';
jest.mock('../../../src/utils/host-name');

describe('Editor telemetry', () => {
  const version = '1.0.0';
  let fixture: HTMLElement;
  let editorName = '';
  let htmlString = '';
  let config: Partial<EditorConfig>;
  let cssString = '';
  let documentEl = '';

  let originalFetch: typeof fetch;
  let fetchMock: jest.Mock;

  const initTestEditor = (config: Partial<EditorConfig>) => {
    grapesjs.version = version;
    const editor = grapesjs.init({
      ...config,
      plugins: [fixJsDom, ...(config.plugins || [])],
    });
    fixJsDomIframe(editor.getModel().shallow);

    return editor;
  };

  beforeAll(() => {
    jest.spyOn(hostUtil, 'getHostName').mockReturnValue('example.com');
    editorName = 'editor-fixture';
  });

  beforeEach(() => {
    const initHtml = '<div class="test1"></div><div class="test2"></div>';
    htmlString = `<body>${initHtml}</body>`;
    cssString = '.test2{color:red}.test3{color:blue}';
    documentEl = '<style>' + cssString + '</style>' + initHtml;
    config = {
      container: '#' + editorName,
      storageManager: {
        autoload: false,
        autosave: false,
        type: '',
      },
    };
    document.body.innerHTML = `<div id="fixtures"><div id="${editorName}"></div></div>`;
    fixture = document.body.querySelector(`#${editorName}`)!;

    originalFetch = global.fetch;
    fetchMock = jest.fn(() => Promise.resolve({ ok: true }));
    global.fetch = fetchMock;

    const sessionStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };

    Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

    Object.defineProperty(window, 'location', {
      value: {
        hostname: 'example.com',
      },
    });

    console.log = jest.fn();
    console.error = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.resetAllMocks();
  });

  test('Telemetry is sent when enabled', async () => {
    const editor = initTestEditor({
      ...config,
      telemetry: true,
    });

    await waitEditorEvent(editor, 'load');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toContain('/api/gjs/telemetry/collect');
    expect(fetchMock.mock.calls[0][1].method).toBe('POST');
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({
      domain: expect.any(String),
      version: expect.any(String),
    });
  });

  test('Telemetry is not sent when disabled', async () => {
    const editor = initTestEditor({
      ...config,
      telemetry: false,
    });
    await waitEditorEvent(editor, 'load');

    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('Telemetry is not sent twice in the same session', async () => {
    window.sessionStorage.getItem = jest.fn(() => 'true');

    const editor = initTestEditor({
      ...config,
      telemetry: true,
    });
    await waitEditorEvent(editor, 'load');

    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('Telemetry handles fetch errors gracefully', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Network error'));

    const editor = initTestEditor({
      ...config,
      telemetry: true,
    });
    await waitEditorEvent(editor, 'load');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(console.log).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
  });

  test('Telemetry cleans up old version keys', async () => {
    const sessionStorageMock = {
      getItem: jest.fn(() => null),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      'gjs_telemetry_sent_0.9.0': 'true',
      'gjs_telemetry_sent_0.9.1': 'true',
      other_key: 'true',
    };
    Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });
    Object.defineProperty(sessionStorageMock, 'length', { value: 3 });

    fetchMock.mockResolvedValueOnce({ ok: true });

    const editor = initTestEditor({
      ...config,
      telemetry: true,
    });
    await waitEditorEvent(editor, 'load');

    await new Promise((resolve) => setTimeout(resolve, 1000));
    expect(sessionStorageMock.setItem).toHaveBeenCalledWith(`gjs_telemetry_sent_${version}`, 'true');
    expect(sessionStorageMock.removeItem).toHaveBeenCalledWith('gjs_telemetry_sent_0.9.0');
    expect(sessionStorageMock.removeItem).toHaveBeenCalledWith('gjs_telemetry_sent_0.9.1');
    expect(sessionStorageMock.removeItem).not.toHaveBeenCalledWith('other_key');
  }, 10000);
});
```

--------------------------------------------------------------------------------

---[FILE: headless.ts]---
Location: grapesjs-dev/packages/core/test/specs/grapesjs/headless.ts

```typescript
/**
 * @jest-environment node
 */
import grapesjs, { Editor } from '../../../src';

describe('GrapesJS Headless', () => {
  test('Can init and destroy an editor', () => {
    const editor = grapesjs.init({ headless: true });
    expect(editor).toBeTruthy();
    editor.destroy();
  });

  describe('Headless operations', () => {
    let editor: Editor;
    const cmpObj = {
      attributes: { test: 'value', class: 'cls' },
      components: { type: 'textnode', content: 'Test' },
    };
    const cmpStr = '<div test="value" class="cls">Test</div>';
    const fullHtml = `<body>${cmpStr}</body>`;
    const styleObj = {
      selectors: [{ name: 'cls' }],
      style: { color: 'red' },
    };
    const styleStr = '.cls{color:red;}';

    beforeEach(() => {
      editor = grapesjs.init({ headless: true, protectedCss: '' });
    });

    afterEach(() => {
      editor.destroy();
    });

    test('Add components', () => {
      const res = editor.addComponents(cmpObj);
      expect(res.length).toBe(1);
      const comp = res[0];
      expect(comp.toHTML()).toBe(cmpStr);
      expect(editor.Selectors.getAll().length).toBe(1); // 1 selector is created
      expect(editor.Css.getAll().length).toBe(0); // No CSS
      expect(editor.getHtml()).toBe(fullHtml);
      expect(editor.getCss()).toBe(''); // same as default
    });

    test('Add components with children', () => {
      const res = editor.addComponents([
        {
          tagName: 'h1',
          type: 'text',
          components: [
            {
              type: 'textnode',
              removable: false,
              draggable: false,
              highlightable: 0,
              copyable: false,
              selectable: true,
              content: 'Hello!',
              _innertext: false,
            },
          ],
        },
      ]);
      expect(res.length).toBe(1);
      const resHtml = '<h1>Hello!</h1>';
      const comp = res[0];
      expect(comp.toHTML()).toBe(resHtml);
      expect(editor.Selectors.getAll().length).toBe(0);
      expect(editor.Css.getAll().length).toBe(0);
      expect(editor.getHtml()).toBe(`<body>${resHtml}</body>`);
      expect(editor.getCss()).toBe('');
    });

    test('Add styles', () => {
      const res = editor.addStyle(styleObj);
      expect(res.length).toBe(1);
      const rule = res[0];
      expect(rule.toCSS()).toBe(styleStr);
      expect(editor.Selectors.getAll().length).toBe(1); // 1 selector is created
    });

    test('Load data', () => {
      editor.loadData({
        components: [cmpObj],
        styles: [styleObj],
      });
      expect(editor.Selectors.getAll().length).toBe(1);
      expect(editor.getHtml()).toBe(fullHtml);
      expect(editor.getCss()).toBe(styleStr);
    });

    test('loadProjectData with different components', () => {
      editor.loadProjectData({
        pages: [
          {
            frames: [
              {
                component: {
                  type: 'wrapper',
                  attributes: { id: 'wrapper-id' },
                  components: [
                    {
                      type: 'text',
                      attributes: { id: 'text-id' },
                      components: [{ type: 'textnode', content: 'Hello world!' }],
                    },
                    {
                      type: 'image',
                      attributes: { id: 'image-id' },
                    },
                    {
                      type: 'video',
                      attributes: { id: 'video-id' },
                    },
                    {
                      type: 'map',
                      attributes: { id: 'map-id' },
                    },
                  ],
                },
              },
            ],
            id: 'page-id',
          },
        ],
      });

      expect(editor.getHtml()).toBeDefined();
      expect(editor.getCss()).toBeDefined();
    });
  });
});
```

--------------------------------------------------------------------------------

````
