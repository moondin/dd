---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 90
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 90 of 97)

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
Location: grapesjs-dev/packages/core/test/specs/pages/index.ts

```typescript
import CanvasEvents from '../../../src/canvas/types';
import { ComponentDefinition } from '../../../src/dom_components/model/types';
import Editor from '../../../src/editor';
import EditorModel from '../../../src/editor/model/Editor';
import { PageProperties } from '../../../src/pages/model/Page';
import { DEFAULT_CMPS, setupTestEditor, waitEditorEvent } from '../../common';

describe('Pages', () => {
  let editor: Editor;
  let em: EditorModel;
  let domc: Editor['Components'];
  let initCmpLen = 0;
  let pm: Editor['Pages'];

  beforeAll(() => {
    editor = new Editor({ pageManager: {} });
    em = editor.getModel();
    domc = em.Components;
    pm = em.Pages;
    pm.onLoad();
    initCmpLen = Object.keys(domc.allById()).length;
  });

  afterAll(() => {
    editor.destroy();
  });

  test('Pages module exists', () => {
    expect(pm).toBeTruthy();
  });

  test('Has by default one page created', () => {
    expect(pm.getAll().length).toBe(1);
  });

  test('The default page is selected', () => {
    expect(pm.getMain()).toBe(pm.getSelected());
  });

  test('The default page has one frame', () => {
    expect(pm.getMain().getFrames().length).toBe(1);
  });

  test('The default frame has the wrapper component', () => {
    const frame = pm.getMain().getFrames().at(0);
    const frameCmp = frame.getComponent();
    expect(frameCmp.is('wrapper')).toBe(true);
  });

  test('The default wrapper has no content', () => {
    const frame = pm.getMain().getFrames().at(0);
    const frameCmp = frame.getComponent();
    expect(frameCmp.components().length).toBe(0);
    expect(frame.getStyles().length).toBe(0);
    expect(initCmpLen).toBe(DEFAULT_CMPS);
  });

  test('Adding new page with selection', () => {
    const name = 'Test page';
    const page = pm.add({ name }, { select: true })!;
    expect(page.id).toBeTruthy();
    expect(page.get('name')).toBe(name);
    expect(pm.getSelected()).toBe(page);
    expect(pm.getAll().length).toBe(2);
    const pageComp = page.getMainComponent();
    expect(pageComp.is('wrapper')).toBe(true);
    expect(pageComp.components().length).toBe(0);
  });

  describe('Init with pages', () => {
    let idPage1 = 'page-1';
    let idComp1 = 'comp1';
    let idComp2 = 'comp2';
    let comp1: ComponentDefinition;
    let comp2: ComponentDefinition;
    let initPages: PageProperties[];
    let allbyId: ReturnType<Editor['Components']['allById']>;

    const createCompDef = (id: string): ComponentDefinition => ({
      attributes: {
        id,
        class: id,
        customattr: id,
      },
      components: `Component ${id}`,
    });

    beforeAll(() => {
      comp1 = createCompDef(idComp1);
      comp2 = createCompDef(idComp2);
      initPages = [
        {
          id: idPage1,
          component: [comp1],
          styles: `#${idComp1} { color: red }`,
        },
        {
          id: 'page-2',
          frames: [
            {
              component: [comp2],
              styles: `#${idComp2} { color: blue }`,
            },
          ],
        },
        {
          id: 'page-3',
          frames: [
            {
              component: '<div id="comp3">Component 3</div>',
              styles: '#comp3 { color: green }',
            },
          ],
        },
      ];
      editor = new Editor({
        pageManager: {
          pages: initPages,
        },
      });
      em = editor.getModel();
      domc = em.Components;
      pm = em.Pages;
      pm.onLoad();
      allbyId = domc.allById();
      initCmpLen = Object.keys(allbyId).length;
    });

    afterAll(() => {
      editor.destroy();
    });

    test('Pages are created correctly', () => {
      const pages = pm.getAll();
      expect(pages.length).toBe(initPages.length);
      pages.map((page) => {
        // All pages should have an ID
        expect(page.get('id')).toBeTruthy();
        // The main component is always a wrapper
        expect(page.getMainFrame().getComponent().is('wrapper')).toBe(true);
      });
      // Components container should contain the same amount of wrappers as pages
      const wrappers = Object.keys(allbyId)
        .map((id) => allbyId[id])
        .filter((i) => i.is('wrapper'));
      expect(wrappers.length).toBe(initPages.length);
      // Components container should contain the right amount of components
      // Number of wrappers (eg. 3) where each one containes 1 component and 1 textnode (5 * 3)
      expect(initCmpLen).toBe((2 + DEFAULT_CMPS) * 3);
      // Each page contains 1 rule per component
      expect(em.Css.getAll().length).toBe(initPages.length);
    });

    test('Change initial selected page', () => {
      const selected = 'page-3';
      editor = new Editor({
        pageManager: {
          pages: initPages,
          selected,
        },
      });
      pm = editor.getModel().Pages;
      pm.onLoad();
      pm.getSelected();
      expect(pm.getSelected()?.id).toBe(selected);
    });
  });
});

describe('Managing pages', () => {
  let editor: Editor;
  let em: EditorModel;
  let domc: Editor['Components'];
  let initCmpLen = 0;
  let pm: Editor['Pages'];

  beforeEach(() => {
    editor = new Editor({ pageManager: {} });
    em = editor.getModel();
    domc = em.Components;
    pm = em.Pages;
    editor.getModel().loadOnStart();
    initCmpLen = Object.keys(domc.allById()).length;
  });

  afterEach(() => {
    editor.destroy();
  });

  test('Add page', () => {
    const eventAdd = jest.fn();
    em.on(pm.events.add, eventAdd);
    pm.add({});
    expect(pm.getAll().length).toBe(2);
    expect(eventAdd).toBeCalledTimes(1);
  });

  test('Abort add page', () => {
    em.on(pm.events.addBefore, (p, c, opts) => {
      opts.abort = 1;
    });
    pm.add({});
    expect(pm.getAll().length).toBe(1);
  });

  test('Abort add page and complete', () => {
    em.on(pm.events.addBefore, (p, complete, opts) => {
      opts.abort = 1;
      complete();
    });
    pm.add({});
    expect(pm.getAll().length).toBe(2);
  });

  test('Remove page', () => {
    const eventRm = jest.fn();
    em.on(pm.events.remove, eventRm);
    const page = pm.add({})!;
    pm.remove(`${page.id}`);
    expect(pm.getAll().length).toBe(1);
    expect(eventRm).toBeCalledTimes(1);
  });

  test('Abort remove page', () => {
    em.on(pm.events.removeBefore, (p, c, opts) => {
      opts.abort = 1;
    });
    const page = pm.add({})!;
    pm.remove(`${page.id}`);
    expect(pm.getAll().length).toBe(2);
  });

  test('Abort remove page and complete', () => {
    em.on(pm.events.removeBefore, (p, complete, opts) => {
      opts.abort = 1;
      complete();
    });
    const page = pm.add({})!;
    pm.remove(`${page.id}`);
    expect(pm.getAll().length).toBe(1);
  });

  test('Change page', () => {
    const event = jest.fn();
    em.on(pm.events.update, event);
    const page = pm.add({})!;
    const up = { name: 'Test' };
    const opts = { myopts: 1 };
    page.set(up, opts);
    expect(event).toBeCalledTimes(1);
    expect(event).toBeCalledWith(page, up, opts);
  });

  test('Prevent duplicate ids in components and styles', () => {
    const id = 'myid';
    const idSel = `#${id}`;
    pm.add({
      component: `<div id="${id}">My Page</div>`,
      styles: `${idSel} { color: red }`,
    })!;
    pm.add({
      component: `<div id="${id}">My Page</div>`,
      styles: `${idSel} { color: blue }`,
    })!;

    expect(pm.getAll().length).toBe(3);

    // Check component/rule from the first page
    const cmp1 = domc.allById()[id];
    const rule1 = em.Css.getRule(idSel)!;
    expect(cmp1.getId()).toBe(id);
    expect(rule1.getSelectorsString()).toBe(idSel);
    expect(rule1.getStyle()).toEqual({ color: 'red' });

    // Check component/rule from the second page
    const id2 = 'myid-2';
    const idSel2 = `#${id2}`;
    const cmp2 = domc.allById()[id2];
    const rule2 = em.Css.getRule(idSel2)!;
    expect(cmp2.getId()).toBe(id2);
    expect(rule2.getSelectorsString()).toBe(idSel2);
    expect(rule2.getStyle()).toEqual({ color: 'blue' });
  });
});

describe('Pages in canvas', () => {
  let editor: Editor;
  let canvas: Editor['Canvas'];
  let em: EditorModel;
  let fxt: HTMLElement;
  let pm: Editor['Pages'];
  const clsPageEl = 'cmp';
  const selPageEl = `.${clsPageEl}`;

  const getPageContent = () => canvas.getBody().querySelector(selPageEl)?.innerHTML;

  beforeEach(async () => {
    const testEditor = setupTestEditor({
      withCanvas: true,
      config: {
        pageManager: {
          pages: [
            {
              id: 'page-1',
              component: `<div class="${clsPageEl}">Page 1</div>`,
            },
          ],
        },
      },
    });
    editor = testEditor.editor;
    canvas = editor.Canvas;
    em = testEditor.em;
    fxt = testEditor.fixtures;
    pm = editor.Pages;
    await waitEditorEvent(em, 'change:readyCanvas');
  });

  afterEach(() => {
    editor.destroy();
  });

  test('Pages are rendering properly with undo/redo', async () => {
    const mainPage = pm.getMain();
    expect(mainPage).toBe(pm.getSelected());

    const page = pm.add(
      {
        id: 'page-2',
        component: `<div class="${clsPageEl}">Page 2</div>`,
      },
      { select: true },
    )!;

    // Check the second page is selected and rendered properly
    expect(page).toBe(pm.getSelected());
    await waitEditorEvent(em, CanvasEvents.frameLoadBody);
    expect(getPageContent()).toEqual('Page 2');

    // Undo and check the main page is rendered properly
    em.UndoManager.undo();
    expect(mainPage).toBe(pm.getSelected());
    await waitEditorEvent(em, CanvasEvents.frameLoadBody);
    expect(getPageContent()).toBe('Page 1');

    // Redo and check the second page is rendered properly again
    em.UndoManager.redo();
    expect(page).toBe(pm.getSelected());
    await waitEditorEvent(em, CanvasEvents.frameLoadBody);
    expect(getPageContent()).toEqual('Page 2');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: pages-same-id-on-different-pages.ts]---
Location: grapesjs-dev/packages/core/test/specs/pages/pages-same-id-on-different-pages.ts

```typescript
import Editor from '../../../src/editor';
import EditorModel from '../../../src/editor/model/Editor';
import ComponentWrapper from '../../../src/dom_components/model/ComponentWrapper';
import { setupTestEditor } from '../../common';

describe('Pages with same component ids across pages', () => {
  let editor: Editor;
  let em: EditorModel;
  let pm: Editor['Pages'];
  let domc: Editor['Components'];
  const rootDefaultProps = {
    type: 'wrapper',
    head: { type: 'head' },
    docEl: { tagName: 'html' },
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

  const getTitle = (wrapper: ComponentWrapper) => wrapper.components().at(0);

  const getRootComponent = ({ idBody = 'body', idTitle = 'main-title', contentTitle = 'A' } = {}) => ({
    type: 'wrapper',
    attributes: { id: idBody },
    components: [
      {
        tagName: 'h1',
        type: 'text',
        attributes: { id: idTitle },
        components: [{ type: 'textnode', content: contentTitle }],
      },
    ],
  });

  beforeEach(() => {
    ({ editor } = setupTestEditor());
    em = editor.getModel();
    pm = em.Pages;
    domc = em.Components;
  });

  afterEach(() => {
    editor.destroy();
  });

  test('Default behavior with pages having components with same ids are incremented', () => {
    editor.Pages.add({
      id: 'page1',
      frames: [{ component: getRootComponent() }],
    });
    editor.Pages.add({
      id: 'page2',
      frames: [{ component: getRootComponent({ contentTitle: 'B' }) }],
    });

    const root1 = pm.get('page1')!.getMainComponent();
    const root2 = pm.get('page2')!.getMainComponent();

    expect(editor.getHtml({ component: root1 })).toBe('<body id="body"><h1 id="main-title">A</h1></body>');
    expect(editor.getHtml({ component: root2 })).toBe('<body id="body-2"><h1 id="main-title-2">B</h1></body>');

    expect(JSON.parse(JSON.stringify(root1))).toEqual({
      ...rootDefaultProps,
      attributes: { id: 'body' },
      components: [
        {
          tagName: 'h1',
          type: 'text',
          attributes: { id: 'main-title' },
          components: [{ type: 'textnode', content: 'A' }],
        },
      ],
    });

    expect(JSON.parse(JSON.stringify(root2))).toEqual({
      ...rootDefaultProps,
      attributes: { id: 'body-2' },
      components: [
        {
          tagName: 'h1',
          type: 'text',
          attributes: { id: 'main-title-2' },
          components: [{ type: 'textnode', content: 'B' }],
        },
      ],
    });
  });

  test('Handles pages with components having the same id across pages', () => {
    editor.Components.config.keepAttributeIdsCrossPages = true;
    editor.Pages.add({
      id: 'page1',
      frames: [{ component: getRootComponent() }],
    });
    editor.Pages.add({
      id: 'page2',
      frames: [{ component: getRootComponent({ contentTitle: 'B' }) }],
    });
    const page1 = pm.get('page1')!;
    const page2 = pm.get('page2')!;
    const root1 = page1.getMainComponent();
    const root2 = page2.getMainComponent();

    expect(root1.getId()).toBe('body');
    expect(root2.getId()).toBe('body');

    const title1 = getTitle(root1);
    const title2 = getTitle(root2);

    // IDs should be preserved per page but stored uniquely in the shared map
    expect(title1.getId()).toBe('main-title');
    expect(title2.getId()).toBe('main-title');

    const all = domc.allById();

    expect(all['body']).toBe(root1);
    expect(all['body-2']).toBe(root2);
    expect(all['main-title']).toBe(title1);
    expect(all['main-title-2']).toBe(title2);

    expect(editor.getHtml({ component: root1 })).toBe('<body id="body"><h1 id="main-title">A</h1></body>');
    expect(editor.getHtml({ component: root2 })).toBe('<body id="body"><h1 id="main-title">B</h1></body>');

    expect(JSON.parse(JSON.stringify(root1))).toEqual({
      ...rootDefaultProps,
      attributes: { id: 'body' },
      components: [
        {
          tagName: 'h1',
          type: 'text',
          attributes: { id: 'main-title' },
          components: [{ type: 'textnode', content: 'A' }],
        },
      ],
    });

    expect(JSON.parse(JSON.stringify(root2))).toEqual({
      ...rootDefaultProps,
      id: 'body-2',
      attributes: { id: 'body' },
      components: [
        {
          id: 'main-title-2',
          tagName: 'h1',
          type: 'text',
          attributes: { id: 'main-title' },
          components: [{ type: 'textnode', content: 'B' }],
        },
      ],
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: grapesjs-dev/packages/core/test/specs/panels/index.ts

```typescript
import Panels from '../../../src/panels';
import Panel from '../../../src/panels/model/Panel';
import Editor from '../../../src/editor/model/Editor';

describe('Panels', () => {
  describe('Main', () => {
    let em: Editor;
    let obj: Panels;

    beforeEach(() => {
      em = new Editor({});
      obj = new Panels(em);
    });

    test('Object exists', () => {
      expect(obj).toBeTruthy();
    });

    test('No panels inside', () => {
      expect(obj.getPanels().length).toEqual(3);
    });

    test('Adds new panel correctly via object', () => {
      const panel = obj.addPanel({ id: 'test' });
      expect(panel.get('id')).toEqual('test');
    });

    test('New panel has no buttons', () => {
      const panel = obj.addPanel({ id: 'test' });
      expect(panel.buttons.length).toEqual(0);
    });

    test('Adds new panel correctly via Panel instance', () => {
      const oPanel = new Panel(obj, { id: 'test' });
      const panel = obj.addPanel(oPanel);
      expect(panel).toEqual(oPanel);
      expect(panel.get('id')).toEqual('test');
    });

    test('getPanel returns null in case there is no requested panel', () => {
      expect(obj.getPanel('test')).toEqual(null);
    });

    test('getPanel returns correctly the panel', () => {
      const panel = obj.addPanel({ id: 'test' });
      expect(obj.getPanel('test')).toEqual(panel);
    });

    test("Can't add button to non existent panel", () => {
      expect(obj.addButton('test', { id: 'btn' })).toEqual(null);
    });

    test('Add button correctly', () => {
      const panel = obj.addPanel({ id: 'test' });
      const btn = obj.addButton('test', { id: 'btn' });
      expect(panel.buttons.length).toEqual(1);
      expect(panel.buttons.at(0).get('id')).toEqual('btn');
    });

    test('getButton returns null in case there is no requested panel', () => {
      expect(obj.addButton('test', 'btn')).toEqual(null);
    });

    test('getButton returns null in case there is no requested button', () => {
      obj.addPanel({ id: 'test' });
      expect(obj.getButton('test', 'btn')).toEqual(null);
    });

    test('getButton returns correctly the button', () => {
      obj.addPanel({ id: 'test' });
      const btn = obj.addButton('test', { id: 'btn' });
      expect(obj.getButton('test', 'btn')).toEqual(btn);
    });

    test('Renders correctly', () => {
      expect(obj.render()).toBeTruthy();
    });

    test('Active correctly activable buttons', () => {
      const fn = jest.fn();
      obj.addPanel({ id: 'test' });
      const btn = obj.addButton('test', { id: 'btn', active: true });
      btn?.on('updateActive', fn);
      obj.active();
      expect(fn).toBeCalledTimes(1);
    });

    test('Disable correctly buttons flagged as disabled', () => {
      const fn = jest.fn();
      obj.addPanel({ id: 'test' });
      const btn = obj.addButton('test', { id: 'btn', disable: true });
      btn?.on('change:disable', fn);
      obj.disableButtons();
      expect(fn).toBeCalledTimes(1);
    });

    test("Can't remove button to non existent panel", () => {
      expect(obj.removeButton('test', { id: 'btn' })).toEqual(null);
    });

    describe('Removes button', () => {
      test('Remove button correctly with object', () => {
        const panel = obj.addPanel({ id: 'test' });
        const btn = obj.addButton('test', { id: 'btn' });
        expect(panel.buttons.length).toEqual(1);
        expect(panel.buttons.at(0).get('id')).toEqual('btn');
        expect(obj.removeButton('test', { id: 'btn' })).toEqual(btn);
        expect(panel.buttons.length).toEqual(0);
      });

      test('Remove button correctly with sting', () => {
        const panel = obj.addPanel({ id: 'test' });
        const btn = obj.addButton('test', { id: 'btn' });
        expect(panel.buttons.length).toEqual(1);
        expect(panel.buttons.at(0).get('id')).toEqual('btn');
        expect(obj.removeButton('test', 'btn')).toEqual(btn);
        expect(panel.buttons.length).toEqual(0);
      });
    });

    describe('Removes Panel', () => {
      test('Removes panel correctly via object', () => {
        const panel = obj.addPanel({ id: 'test' });
        expect(panel.get('id')).toEqual('test');
        obj.removePanel('test');
        expect(panel.get('id')).toEqual('test');
      });

      test('Removes panel correctly via Panel instance', () => {
        const oPanel = new Panel(obj, { id: 'test' });
        const panel = obj.addPanel(oPanel);
        expect(panel).toEqual(oPanel);
        expect(panel.get('id')).toEqual('test');
        obj.removePanel(oPanel);
        expect(obj.getPanels.length).toEqual(0);
      });

      test('Removes panel correctly via id', () => {
        const oPanel = new Panel(obj, { id: 'test' });
        const panel = obj.addPanel(oPanel);
        expect(panel).toEqual(oPanel);
        expect(panel.get('id')).toEqual('test');
        obj.removePanel('test');
        expect(obj.getPanels.length).toEqual(0);
      });
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: PanelsE2e.js]---
Location: grapesjs-dev/packages/core/test/specs/panels/e2e/PanelsE2e.js

```javascript
describe('E2E tests', () => {
  var fixtures;
  var fixture;
  var obj;
  var config;
  var editorName = 'panel-fixture';

  beforeAll(() => {
    fixtures = $('<div id="#fixtures"></div>').appendTo('body');
  });

  beforeEach(() => {
    obj = grapesjs;
    config = {
      container: '#' + editorName,
      storageManager: { autoload: 0, type: 'none' },
    };
    fixture = $('<div id="' + editorName + '"></div>');
    fixture.empty().appendTo(fixtures);
  });

  afterEach(() => {
    obj = null;
    config = null;
    fixture.remove();
  });

  afterAll(() => {
    //fixture.remove();
  });

  test('Command is correctly executed on button click', () => {
    var commandId = 'command-test';
    config.commands = {
      defaults: [
        {
          id: commandId,
          run(ed, caller) {
            ed.testValue = 'testValue';
            caller.set('active', false);
          },
        },
      ],
    };
    config.panels = {
      defaults: [
        {
          id: 'toolbar-test',
          buttons: [
            {
              id: 'button-test',
              className: 'fa fa-smile-o',
              command: commandId,
            },
          ],
        },
      ],
    };
    var editor = obj.init(config);
    editor.testValue = '';
    var button = editor.Panels.getButton('toolbar-test', 'button-test');
    button.set('active', 1);
    expect(editor.testValue).toEqual('testValue');
    expect(button.get('active')).toEqual(false);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: PanelModels.js]---
Location: grapesjs-dev/packages/core/test/specs/panels/model/PanelModels.js

```javascript
import Button from 'panels/model/Button';
import Buttons from 'panels/model/Buttons';
import Panel from 'panels/model/Panel';

describe('Button', () => {
  var obj;

  beforeEach(() => {
    obj = new Button();
  });

  afterEach(() => {
    obj = null;
  });

  test('Has buttons instance', () => {
    expect(obj.has('buttons')).toEqual(true);
  });

  test('Has no buttons', () => {
    expect(obj.get('buttons').length).toEqual(0);
  });

  test('Init with other buttons inside correctly', () => {
    obj = new Button(null, {
      buttons: [{}],
    });
    expect(obj.get('buttons') instanceof Buttons).toEqual(true);
    expect(obj.get('buttons').length).toEqual(1);
  });

  test('Has a disable attribute with default value as false', () => {
    expect(obj.get('disable')).toEqual(false);
  });
});

describe('Buttons', () => {
  var obj;

  beforeEach(() => {
    obj = new Buttons();
  });

  afterEach(() => {
    obj = null;
  });

  test('Deactivates buttons', () => {
    obj.add({ active: true });
    obj.deactivateAll();
    expect(obj.at(0).get('active')).toEqual(false);
  });

  test('Deactivates buttons with context', () => {
    obj.add({ active: true });
    obj.deactivateAll('someContext');
    expect(obj.at(0).get('active')).toEqual(true);
  });

  test('Deactivates except one', () => {
    var btn = obj.add({ active: true });
    obj.deactivateAllExceptOne();
    expect(obj.at(0).get('active')).toEqual(false);
  });

  test('Deactivates except one with model', () => {
    var btn = obj.add({ active: true });
    obj.deactivateAllExceptOne(btn);
    expect(obj.at(0).get('active')).toEqual(true);
  });

  test('Disable all buttons', () => {
    obj.add({ disable: false });
    obj.disableAllButtons();
    expect(obj.at(0).get('disable')).toEqual(true);
  });

  test('Disables buttons with context', () => {
    obj.add({ disable: false, context: 'someContext' });
    obj.disableAllButtons('someContext');
    expect(obj.at(0).get('disable')).toEqual(true);
  });

  test('Disables except one', () => {
    var btn = obj.add({ disable: false });
    obj.disableAllButtonsExceptOne(btn);
    expect(obj.at(0).get('disable')).toEqual(false);
  });
});

describe('Panel', () => {
  var obj;

  beforeEach(() => {
    obj = new Panel();
  });

  afterEach(() => {
    obj = null;
  });

  test('Has buttons instance', () => {
    expect(obj.has('buttons')).toEqual(true);
    expect(obj.get('buttons') instanceof Buttons).toEqual(true);
  });

  test('Has no buttons', () => {
    expect(obj.get('buttons').length).toEqual(0);
  });

  test('Init with buttons inside correctly', () => {
    obj = new Panel(null, {
      buttons: [{}],
    });
    expect(obj.get('buttons') instanceof Buttons).toEqual(true);
    expect(obj.get('buttons').length).toEqual(1);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ButtonsView.ts]---
Location: grapesjs-dev/packages/core/test/specs/panels/view/ButtonsView.ts

```typescript
import ButtonsView from '../../../../src/panels/view/ButtonsView';
import Buttons from '../../../../src/panels/model/Buttons';
import EditorModel from '../../../../src/editor/model/Editor';

describe('ButtonsView', () => {
  let fixtures: HTMLElement;
  let em: EditorModel;
  let model: Buttons;
  let view: ButtonsView;

  beforeEach(() => {
    em = new EditorModel({});
    model = new Buttons(em.Panels, []);
    view = new ButtonsView(model);
    document.body.innerHTML = '<div id="fixtures"></div>';
    fixtures = document.body.querySelector('#fixtures')!;
    fixtures.appendChild(view.render().el);
  });

  afterEach(() => {
    view.collection.reset();
  });

  test('Collection is empty', () => {
    expect(view.$el.html()).toEqual('');
  });

  test('Add new button', () => {
    const spy = jest.spyOn(view, 'addToCollection' as any);
    view.collection.add([{}]);
    expect(spy).toBeCalledTimes(1);
  });

  test('Render new button', () => {
    view.collection.add([{}]);
    expect(view.$el.html()).toBeTruthy();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ButtonView.ts]---
Location: grapesjs-dev/packages/core/test/specs/panels/view/ButtonView.ts

```typescript
import ButtonView from '../../../../src/panels/view/ButtonView';
import Button from '../../../../src/panels/model/Button';
import EditorModel from '../../../../src/editor/model/Editor';

describe('ButtonView', () => {
  let fixtures: HTMLElement;
  let em: EditorModel;
  let model: Button;
  let view: ButtonView;
  let btnClass = 'pn-btn';

  beforeEach(() => {
    em = new EditorModel({});
    model = new Button(em.Panels, { command: 'fake-command' });
    view = new ButtonView({
      model: model,
    });
    document.body.innerHTML = '<div id="fixtures"></div>';
    fixtures = document.body.querySelector('#fixtures')!;
    fixtures.appendChild(view.render().el);
  });

  afterEach(() => {
    view.remove();
  });

  test('Button empty', () => {
    expect(fixtures.innerHTML).toEqual('<span class="' + btnClass + '"></span>');
  });

  test('Update class', () => {
    model.set('className', 'test');
    expect(view.el.getAttribute('class')).toEqual(btnClass + ' test');
  });

  test('Update attributes', () => {
    model.set('attributes', {
      'data-test': 'test-value',
    });
    expect(view.el.getAttribute('data-test')).toEqual('test-value');
  });

  test('Check enable active', () => {
    model.set('active', true, { silent: true });
    view.checkActive();
    expect(view.el.getAttribute('class')).toContain(btnClass + ' pn-active');
  });

  test('Check disable active', () => {
    model.set('active', true, { silent: true });
    view.checkActive();
    model.set('active', false, { silent: true });
    view.checkActive();
    expect(view.el.getAttribute('class')).toEqual(btnClass);
  });

  test('Disable the button', () => {
    model.set('disable', true, { silent: true });
    view.updateDisable();
    expect(view.el.getAttribute('class')).toEqual(btnClass + ' disabled');
  });

  test('Enable the disabled button', () => {
    model.set('disable', true, { silent: true });
    view.updateDisable();
    model.set('disable', false, { silent: true });
    view.updateDisable();
    expect(view.el.getAttribute('class')).toEqual(btnClass);
  });

  test('Cancels the click action when button is disabled', () => {
    const spy = jest.spyOn(view, 'toggleActive' as any);
    model.set('disable', true, { silent: true });
    view.clicked();
    expect(spy).toBeCalledTimes(0);
  });

  test('Enable the click action when button is enable', () => {
    const spy = jest.spyOn(view, 'toggleActive' as any);
    model.set('disable', false, { silent: true });
    view.clicked();
    expect(spy).toBeCalledTimes(1);
  });

  test('Renders correctly', () => {
    expect(view.render()).toBeTruthy();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: PanelsView.ts]---
Location: grapesjs-dev/packages/core/test/specs/panels/view/PanelsView.ts

```typescript
import PanelsView from '../../../../src/panels/view/PanelsView';
import Panels from '../../../../src/panels/model/Panels';
import Editor from '../../../../src/editor';

describe('PanelsView', () => {
  let fixtures: HTMLElement;
  let editor: Editor;
  let model: Panels;
  let view: PanelsView;

  beforeEach(() => {
    editor = new Editor({});
    model = new Panels(editor.Panels, []);
    view = new PanelsView(model);
    document.body.innerHTML = '<div id="fixtures"></div>';
    fixtures = document.body.querySelector('#fixtures')!;
    fixtures.appendChild(view.render().el);
  });

  afterEach(() => {
    view.collection.reset();
  });

  test('Collection is empty', () => {
    expect(view.$el.html()).toEqual('');
  });

  test('Add new panel', () => {
    const spy = jest.spyOn(view, 'addToCollection' as any);
    view.collection.add([{}]);
    expect(spy).toBeCalledTimes(1);
  });

  test('Render new panel', () => {
    view.collection.add([{}]);
    expect(view.$el.html()).toBeTruthy();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: PanelView.ts]---
Location: grapesjs-dev/packages/core/test/specs/panels/view/PanelView.ts

```typescript
import PanelView from '../../../../src/panels/view/PanelView';
import Panel from '../../../../src/panels/model/Panel';
import Editor from '../../../../src/editor';

describe('PanelView', () => {
  let fixtures: HTMLElement;
  let editor: Editor;
  let model: Panel;
  let view: PanelView;

  beforeEach(() => {
    editor = new Editor();
    model = new Panel(editor.Panels, {} as any);
    view = new PanelView(model);
    document.body.innerHTML = '<div id="fixtures"></div>';
    fixtures = document.body.querySelector('#fixtures')!;
    fixtures.appendChild(view.render().el);
  });

  afterEach(() => {
    view.remove();
  });

  test('Panel empty', () => {
    fixtures.firstElementChild!.className = '';
    expect(fixtures.innerHTML).toEqual('<div class=""></div>');
  });

  test('Append content', () => {
    model.set('appendContent', 'test' as any);
    model.set('appendContent', 'test2' as any);
    expect(view.$el.html()).toEqual('testtest2');
  });

  test('Update content', () => {
    model.set('content', 'test');
    model.set('content', 'test2');
    expect(view.$el.html()).toEqual('test2');
  });

  test('Hide panel', () => {
    expect(view.$el.hasClass('gjs-hidden')).toBeFalsy();
    model.set('visible', false);
    expect(view.$el.hasClass('gjs-hidden')).toBeTruthy();
  });

  test('Show panel', () => {
    model.set('visible', false);
    expect(view.$el.hasClass('gjs-hidden')).toBeTruthy();
    model.set('visible', true);
    expect(view.$el.hasClass('gjs-hidden')).toBeFalsy();
  });
});
```

--------------------------------------------------------------------------------

````
