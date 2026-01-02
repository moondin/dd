---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 75
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 75 of 97)

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

---[FILE: AssetView.ts]---
Location: grapesjs-dev/packages/core/test/specs/asset_manager/view/AssetView.ts

```typescript
import Assets from '../../../../src/asset_manager/model/Assets';
import AssetView from '../../../../src/asset_manager/view/AssetView';

describe('AssetView', () => {
  let testContext: { view?: AssetView };

  beforeEach(() => {
    testContext = {};
  });

  beforeEach(() => {
    const coll = new Assets();
    const model = coll.add({ src: 'test' });
    testContext.view = new AssetView({
      config: {},
      model,
    } as any);
    document.body.innerHTML = '<div id="fixtures"></div>';
    document.body.querySelector('#fixtures')!.appendChild(testContext.view.render().el);
  });

  afterEach(() => {
    testContext.view!.remove();
  });

  test('Object exists', () => {
    expect(AssetView).toBeTruthy();
  });

  test('Has correct prefix', () => {
    expect(testContext.view!.pfx).toEqual('');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: FileUploader.ts]---
Location: grapesjs-dev/packages/core/test/specs/asset_manager/view/FileUploader.ts

```typescript
import FileUploader from '../../../../src/asset_manager/view/FileUploader';

describe('File Uploader', () => {
  let obj: FileUploader;

  beforeEach(() => {
    obj = new FileUploader({ config: {} });
    document.body.innerHTML = '<div id="fixtures"></div>';
    document.body.querySelector('#fixtures')!.appendChild(obj.render().el);
  });

  afterEach(() => {
    obj.remove();
  });

  test('Object exists', () => {
    expect(FileUploader).toBeTruthy();
  });

  test('Has correct prefix', () => {
    expect(obj.pfx).toBeFalsy();
  });

  describe('Should be rendered correctly', () => {
    test('Has title', () => {
      expect(obj.$el.find('#title').length).toEqual(1);
    });

    test('Title is empty', () => {
      expect(obj.$el.find('#title').html()).toEqual('');
    });

    test('Has file input', () => {
      expect(obj.$el.find('input[type=file]').length).toEqual(1);
    });

    test('File input is enabled', () => {
      expect(obj.$el.find('input[type=file]').prop('disabled')).toEqual(true);
    });
  });

  describe('Interprets configurations correctly', () => {
    test('Could be disabled', () => {
      const view = new FileUploader({
        config: {
          disableUpload: true,
          upload: 'something',
        },
      });
      view.render();
      expect(view.$el.find('input[type=file]').prop('disabled')).toEqual(true);
    });

    test('Handles multiUpload false', () => {
      const view = new FileUploader({
        config: {
          multiUpload: false,
        },
      });
      view.render();
      expect(view.$el.find('input[type=file]').prop('multiple')).toBeFalsy();
    });

    test('Handles embedAsBase64 parameter', () => {
      const view = new FileUploader({
        config: {
          embedAsBase64: true,
        },
      });
      view.render();
      expect(view.$el.find('input[type=file]').prop('disabled')).toEqual(false);
      expect(view.uploadFile).toEqual(FileUploader.embedAsBase64);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: grapesjs-dev/packages/core/test/specs/block_manager/index.ts

```typescript
import { BlockProperties } from '../../../src/block_manager/model/Block';
import Editor from '../../../src/editor';

describe('BlockManager', () => {
  describe('Main', () => {
    let obj: Editor['Blocks'];
    const idTest = 'h1-block';
    let optsTest: BlockProperties = { label: '', content: '' };
    let editor: Editor;

    beforeEach(() => {
      editor = new Editor({
        blockManager: {
          blocks: [],
        },
      });
      optsTest = {
        label: 'Heading',
        content: '<h1>Test</h1>',
      };

      obj = editor.Blocks;
    });

    afterEach(() => {
      editor.destroy();
    });

    test('Object exists', () => {
      expect(obj).toBeTruthy();
    });

    test('No blocks inside', () => {
      expect(obj.getAll().length).toEqual(0);
    });

    test('No categories inside', () => {
      expect(obj.getCategories().length).toEqual(0);
    });

    test('Add new block', () => {
      obj.add(idTest, optsTest);
      expect(obj.getAll().length).toEqual(1);
    });

    test('Added block has correct data', () => {
      var model = obj.add(idTest, optsTest);
      expect(model.get('label')).toEqual(optsTest.label);
      expect(model.get('content')).toEqual(optsTest.content);
    });

    test('Add block with attributes', () => {
      optsTest.attributes = { class: 'test' };
      var model = obj.add(idTest, optsTest);
      expect(model.get('attributes')!.class).toEqual('test');
    });

    test('The id of the block is unique', () => {
      var model = obj.add(idTest, optsTest);
      var model2 = obj.add(idTest, { ...optsTest, content: 'test' });
      expect(model).toEqual(model2);
    });

    test('Get block by id', () => {
      var model = obj.add(idTest, optsTest);
      var model2 = obj.get(idTest);
      expect(model).toEqual(model2);
    });

    test('Render blocks', () => {
      obj.postRender();
      obj.render();
      expect(obj.getContainer()).toBeTruthy();
    });

    describe('Events', () => {
      test('Add triggers proper events', () => {
        const eventAdd = jest.fn();
        const eventAll = jest.fn();
        editor.on(obj.events.add, eventAdd);
        editor.on(obj.events.all, eventAll);
        const added = obj.add(idTest, optsTest);
        expect(eventAdd).toBeCalledTimes(1);
        expect(eventAdd).toBeCalledWith(added, expect.anything());
        expect(eventAll).toBeCalled();
      });

      test('Remove triggers proper events', () => {
        const eventBfRm = jest.fn();
        const eventRm = jest.fn();
        const eventAll = jest.fn();
        obj.add(idTest, optsTest);
        editor.on(obj.events.removeBefore, eventBfRm);
        editor.on(obj.events.remove, eventRm);
        editor.on(obj.events.all, eventAll);
        const removed = obj.remove(idTest);
        expect(obj.getAll().length).toBe(0);
        expect(eventBfRm).toBeCalledTimes(1);
        expect(eventRm).toBeCalledTimes(1);
        expect(eventRm).toBeCalledWith(removed, expect.anything());
        expect(eventAll).toBeCalled();
      });

      test('Update triggers proper events', () => {
        const eventUp = jest.fn();
        const eventAll = jest.fn();
        const added = obj.add(idTest, optsTest);
        const newProps = { label: 'Heading 2' };
        editor.on(obj.events.update, eventUp);
        editor.on(obj.events.all, eventAll);
        added.set(newProps);
        expect(eventUp).toBeCalledTimes(1);
        expect(eventUp).toBeCalledWith(added, newProps, expect.anything());
        expect(eventAll).toBeCalled();
      });
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: BlocksView.ts]---
Location: grapesjs-dev/packages/core/test/specs/block_manager/view/BlocksView.ts

```typescript
import BlocksView from '../../../../src/block_manager/view/BlocksView';
import Blocks from '../../../../src/block_manager/model/Blocks';
import EditorModel from '../../../../src/editor/model/Editor';

describe('BlocksView', () => {
  let model: Blocks;
  let view: BlocksView;
  let em: EditorModel;

  beforeEach(() => {
    em = new EditorModel();
    model = em.Blocks.blocks;
    view = new BlocksView({ collection: model }, { em });
    document.body.innerHTML = '<div id="fixtures"></div>';
    document.body.querySelector('#fixtures')!.appendChild(view.render().el);
  });

  afterEach(() => {
    view.collection.reset();
    em.destroy();
  });

  test('The container is not empty', () => {
    expect(view.el.outerHTML).toBeTruthy();
  });

  test('No children inside', () => {
    expect(view.getBlocksEl().children.length).toEqual(0);
  });

  test('Render children on add', () => {
    model.add({});
    expect(view.getBlocksEl().children.length).toEqual(1);
    model.add([{}, {}]);
    expect(view.getBlocksEl().children.length).toEqual(3);
  });

  test('Destroy children on remove', () => {
    model.add([{}, {}]);
    expect(view.getBlocksEl().children.length).toEqual(2);
    model.at(0).destroy();
    expect(view.getBlocksEl().children.length).toEqual(1);
  });

  describe('With configs', () => {
    beforeEach(() => {
      em = new EditorModel({
        blockManager: {
          blocks: [
            { label: 'test1', content: '1' },
            { label: 'test2', content: '2' },
          ],
        },
      });
      em.initModules();
      model = em.Blocks.blocks;
      view = new BlocksView({ collection: model }, { em });
      document.body.innerHTML = '<div id="fixtures"></div>';
      document.body.querySelector('#fixtures')!.appendChild(view.render().el);
    });

    test('Render children', () => {
      expect(view.getBlocksEl().children.length).toEqual(2);
    });

    test('Render container', () => {
      expect(view.getBlocksEl().getAttribute('class')).toEqual('blocks-c');
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: grapesjs-dev/packages/core/test/specs/canvas/index.ts

```typescript
import { CanvasSpotBuiltInTypes } from '../../../src/canvas/model/CanvasSpot';
import EditorModel from '../../../src/editor/model/Editor';

const { Select, Target } = CanvasSpotBuiltInTypes;

describe('Canvas', () => {
  let em: EditorModel;
  let canvas: EditorModel['Canvas'];

  beforeEach(() => {
    em = new EditorModel({});
    canvas = em.Canvas;
  });

  afterEach(() => {
    em.destroy();
  });

  test('Canvas module exists', () => {
    expect(canvas).toBeTruthy();
  });

  describe('Canvas Spots', () => {
    describe('addSpot()', () => {
      test('Add single spot', () => {
        canvas.addSpot({ type: Select });
        const spots = canvas.getSpots();
        expect(spots.length).toBe(1);
        expect(spots[0].type).toBe(Select);
      });

      test('Add multiple spots with the same schema', () => {
        const spot1 = canvas.addSpot({ type: Select });
        // The id of this spot is the same as the one above
        const spot2 = canvas.addSpot({ type: Select });
        const spots = canvas.getSpots();
        expect(spots.length).toBe(1);
        expect(spots[0].type).toBe(Select);
        expect(spot1).toBe(spot2);
      });

      test('Adding multiple spots with the same id, will update the spot', () => {
        const spot1 = canvas.addSpot({ id: 'spot1', type: Select });
        const spot2 = canvas.addSpot({ id: 'spot1', type: Target });
        const spots = canvas.getSpots();
        expect(spots.length).toBe(1);
        expect(spots[0].type).toBe(Target);
        expect(spot1).toBe(spot2);
      });
    });

    describe('getSpots()', () => {
      test('Get all spots', () => {
        canvas.addSpot({ type: Select });
        canvas.addSpot({ type: Target });
        const spots = canvas.getSpots();
        expect(spots.length).toBe(2);
        expect(spots[0].type).toBe(Select);
        expect(spots[1].type).toBe(Target);
      });

      test('Get spots by props', () => {
        canvas.addSpot({ type: Select });
        canvas.addSpot({ type: Target });
        canvas.addSpot({ id: 'target2', type: Target });
        const spotsSelect = canvas.getSpots({ type: Select });
        const spotsTarget = canvas.getSpots({ type: Target });
        expect(spotsSelect.length).toBe(1);
        expect(spotsTarget.length).toBe(2);
      });

      test('Get spot by id', () => {
        canvas.addSpot({ type: Select });
        canvas.addSpot({ type: Target });
        const spotT2 = canvas.addSpot({ id: 'target2', type: Target });

        const spotsTarget = canvas.getSpots({ id: 'target2', type: Select });
        expect(spotsTarget.length).toBe(1);
        expect(spotsTarget[0]).toBe(spotT2);
      });
    });

    describe('removeSpots()', () => {
      test('Remove all spots', () => {
        canvas.addSpot({ type: Select });
        canvas.addSpot({ type: Target });
        canvas.removeSpots();
        const spots = canvas.getSpots();
        expect(spots.length).toBe(0);
      });

      test('Remove spots by props', () => {
        canvas.addSpot({ type: Select });
        canvas.addSpot({ type: Target });
        canvas.addSpot({ id: 'target2', type: Target });
        canvas.removeSpots({ type: Target });
        const spots = canvas.getSpots();
        expect(spots.length).toBe(1);
      });

      test('Remove spots by id', () => {
        canvas.addSpot({ type: Select });
        canvas.addSpot({ type: Target });
        canvas.addSpot({ id: 'target2', type: Target });
        canvas.removeSpots({ id: 'target2' });
        const spots = canvas.getSpots();
        expect(spots.length).toBe(2);
      });

      test('Remove spots by array of spots', () => {
        const spotSelect = canvas.addSpot({ type: Select });
        const spotTarget1 = canvas.addSpot({ type: Target });
        const spotTarget2 = canvas.addSpot({ id: 'target2', type: Target });
        canvas.removeSpots([spotTarget1, spotTarget2]);
        const spots = canvas.getSpots();
        expect(spots.length).toBe(1);
        expect(spots[0]).toBe(spotSelect);
      });
    });

    describe('Spot Events', () => {
      test('addSpot() triggers proper events', (done) => {
        const eventAdd = jest.fn();
        const eventAll = jest.fn();
        em.on(canvas.events.spotAdd, eventAdd);
        em.on(canvas.events.spot, eventAll);
        const spot = canvas.addSpot({ type: Select });
        expect(eventAdd).toBeCalledTimes(1);
        expect(eventAdd).toBeCalledWith({ spot });
        setTimeout(() => {
          expect(eventAll).toBeCalledTimes(1);
          done();
        });
      });

      test('Update of spots triggers proper events', (done) => {
        const eventUpdate = jest.fn();
        const eventAll = jest.fn();
        em.on(canvas.events.spotUpdate, eventUpdate);
        em.on(canvas.events.spot, eventAll);
        const spot = canvas.addSpot({ id: 'spot1', type: Select });
        canvas.addSpot({ id: 'spot1', type: Target });

        expect(eventUpdate).toBeCalledTimes(1);
        expect(eventUpdate).toBeCalledWith({ spot });
        setTimeout(() => {
          expect(eventAll).toBeCalledTimes(1);
          done();
        });
      });

      test('removeSpot() triggers proper events', (done) => {
        const eventRemove = jest.fn();
        const eventAll = jest.fn();
        em.on(canvas.events.spotRemove, eventRemove);
        em.on(canvas.events.spot, eventAll);
        const spot = canvas.addSpot({ type: Select });
        canvas.removeSpots();
        expect(eventRemove).toBeCalledTimes(1);
        expect(eventRemove).toBeCalledWith({ spot });
        setTimeout(() => {
          expect(eventAll).toBeCalledTimes(1);
          done();
        });
      });
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: index.js]---
Location: grapesjs-dev/packages/core/test/specs/code_manager/index.js

```javascript
import CodeManager from 'code_manager';
import Editor from 'editor/model/Editor';

describe('Code Manager', () => {
  describe('Main', () => {
    let obj;

    beforeEach(() => {
      const em = new Editor({});
      obj = new CodeManager(em);
    });

    afterEach(() => {
      obj = null;
    });

    test('Object exists', () => {
      expect(CodeManager).toBeTruthy();
    });

    test('Add and get code generator', () => {
      obj.addGenerator('test', 'gen');
      expect(obj.getGenerator('test')).toEqual('gen');
    });

    test('Add and get code viewer', () => {
      obj.addViewer('test', 'view');
      expect(obj.getViewer('test')).toEqual('view');
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: CodeModels.js]---
Location: grapesjs-dev/packages/core/test/specs/code_manager/model/CodeModels.js

```javascript
import CssGenerator from 'code_manager/model/CssGenerator';
import HtmlGenerator from 'code_manager/model/HtmlGenerator';
import DomComponents from 'dom_components';
import Component from 'dom_components/model/Component';
import Editor from 'editor/model/Editor';
import CssComposer from 'css_composer';

let comp;
let dcomp;
let obj;
let em;
let cc;

describe('HtmlGenerator', () => {
  beforeEach(() => {
    em = new Editor();
    obj = new HtmlGenerator();
    dcomp = new DomComponents(em);
    comp = new Component(
      {},
      {
        em,
        componentTypes: dcomp.componentTypes,
      },
    );
  });

  afterEach(() => {
    obj = null;
  });

  test('Build correctly one component', () => {
    expect(obj.build(comp)).toEqual('<div></div>');
  });

  test('Build correctly empty component inside', () => {
    comp.get('components').add({});
    expect(obj.build(comp)).toEqual('<div><div></div></div>');
  });

  test('Build correctly not empty component inside', () => {
    const m1 = comp.get('components').add({
      tagName: 'article',
      attributes: {
        'data-test1': 'value1',
        'data-test2': 'value2',
      },
    });
    expect(obj.build(m1)).toEqual('<article data-test1="value1" data-test2="value2"></article>');
  });

  test('Build correctly component with classes', () => {
    const m1 = comp.get('components').add({
      tagName: 'article',
      attributes: {
        'data-test1': 'value1',
        'data-test2': 'value2',
      },
    });
    ['class1', 'class2'].forEach((item) => {
      m1.get('classes').add({ name: item });
    });
    expect(obj.build(m1)).toEqual('<article data-test1="value1" data-test2="value2" class="class1 class2"></article>');
  });

  test('Build correctly component with id preserved when script is defined', () => {
    const m1 = comp.get('components').add({
      tagName: 'article',
    });
    m1.set('script', 'anything');
    expect(obj.build(m1, { cleanId: true, em })).toEqual(`<article id="${m1.getId()}"></article>`);
  });

  test('Build correctly component with id preserved when script-export is defined', () => {
    const m1 = comp.get('components').add({
      tagName: 'article',
    });
    m1.set('script-export', 'anything');
    expect(obj.build(m1, { cleanId: true, em })).toEqual(`<article id="${m1.getId()}"></article>`);
  });

  test('Build correctly component with id preserved when id is explicitly set ', () => {
    const m1 = comp.get('components').add({
      tagName: 'article',
    });
    m1.setId('i11');
    expect(obj.build(m1, { cleanId: true, em })).toEqual(`<article id="i11"></article>`);
  });

  test('Build correctly component with cleanId is enabled and id is not required ', () => {
    const m1 = comp.get('components').add({
      tagName: 'article',
    });
    expect(obj.build(m1, { cleanId: true, em })).toEqual(`<article></article>`);
  });
});

describe('CssGenerator', () => {
  let newCssComp;

  beforeEach(() => {
    em = new Editor({});
    newCssComp = () => new CssComposer(em);

    cc = em.get('CssComposer');
    obj = new CssGenerator();
    dcomp = new DomComponents(em);
    comp = new Component(
      {},
      {
        em,
        componentTypes: dcomp.componentTypes,
      },
    );
  });

  afterEach(() => {
    obj = null;
  });

  test('Build correctly one component', () => {
    expect(obj.build(comp)).toEqual('');
  });

  test('Build correctly empty component inside', () => {
    var m1 = comp.get('components').add({ tagName: 'article' });
    expect(obj.build(comp)).toEqual('');
  });

  test('Build correctly component with style inside', () => {
    var m1 = comp.get('components').add({
      tagName: 'article',
      style: {
        prop1: 'value1',
        prop2: 'value2',
      },
    });
    expect(obj.build(comp)).toEqual('#' + m1.getId() + '{prop1:value1;prop2:value2;}');
  });

  test('Build correctly component with class styled', () => {
    var m1 = comp.get('components').add({ tagName: 'article' });
    var cls1 = m1.get('classes').add({ name: 'class1' });

    var cssc = newCssComp();
    var rule = cssc.add(cls1);
    rule.set('style', { prop1: 'value1', prop2: 'value2' });

    expect(obj.build(comp, { cssc })).toEqual('.class1{prop1:value1;prop2:value2;}');
  });

  test('Build correctly component styled with class and state', () => {
    var m1 = comp.get('components').add({ tagName: 'article' });
    var cls1 = m1.get('classes').add({ name: 'class1' });

    var cssc = newCssComp();
    var rule = cssc.add(cls1);
    rule.set('style', { prop1: 'value1', prop2: 'value2' });
    rule.set('state', 'hover');

    expect(obj.build(comp, { cssc })).toEqual('.class1:hover{prop1:value1;prop2:value2;}');
  });

  test('Build correctly with more classes', () => {
    var m1 = comp.get('components').add({ tagName: 'article' });
    var cls1 = m1.get('classes').add({ name: 'class1' });
    var cls2 = m1.get('classes').add({ name: 'class2' });

    var cssc = newCssComp();
    var rule = cssc.add([cls1, cls2]);
    rule.set('style', { prop1: 'value1', prop2: 'value2' });

    expect(obj.build(comp, { cssc })).toEqual('.class1.class2{prop1:value1;prop2:value2;}');
  });

  test('Build rules with mixed classes', () => {
    var m1 = comp.get('components').add({ tagName: 'article' });
    var cls1 = m1.get('classes').add({ name: 'class1' });
    var cls2 = m1.get('classes').add({ name: 'class2' });

    var cssc = newCssComp();
    var rule = cssc.add([cls1, cls2]);
    rule.set('style', { prop1: 'value1', prop2: 'value2' });
    rule.set('selectorsAdd', '.class1 .class2, div > .class4');

    expect(obj.build(comp, { cssc })).toEqual(
      '.class1.class2, .class1 .class2, div > .class4{prop1:value1;prop2:value2;}',
    );
  });

  test('Build rules with only not class based selectors', () => {
    var cssc = newCssComp();
    var rule = cssc.add([]);
    rule.set('style', { prop1: 'value1', prop2: 'value2' });
    rule.set('selectorsAdd', '.class1 .class2, div > .class4');

    expect(obj.build(comp, { cssc })).toEqual('.class1 .class2, div > .class4{prop1:value1;prop2:value2;}');
  });

  test('Build correctly with class styled out', () => {
    var m1 = comp.get('components').add({ tagName: 'article' });
    var cls1 = m1.get('classes').add({ name: 'class1' });
    var cls2 = m1.get('classes').add({ name: 'class2' });

    var cssc = newCssComp();
    var rule = cssc.add([cls1, cls2]);
    rule.set('style', { prop1: 'value1' });
    var rule2 = cssc.add(cls2);
    rule2.set('style', { prop2: 'value2' });

    expect(obj.build(comp, { cssc })).toEqual('.class1.class2{prop1:value1;}.class2{prop2:value2;}');
  });

  test('Rule with media query', () => {
    var m1 = comp.get('components').add({ tagName: 'article' });
    var cls1 = m1.get('classes').add({ name: 'class1' });
    var cls2 = m1.get('classes').add({ name: 'class2' });

    var cssc = newCssComp();
    var rule = cssc.add([cls1, cls2]);
    rule.set('style', { prop1: 'value1' });
    rule.set('mediaText', '(max-width: 999px)');

    expect(obj.build(comp, { cssc })).toEqual('@media (max-width: 999px){.class1.class2{prop1:value1;}}');
  });

  test('Rules mixed with media queries', () => {
    var m1 = comp.get('components').add({ tagName: 'article' });
    var cls1 = m1.get('classes').add({ name: 'class1' });
    var cls2 = m1.get('classes').add({ name: 'class2' });

    var cssc = newCssComp();

    var rule = cssc.add([cls1, cls2]);
    rule.set('style', { prop1: 'value1' });
    var rule2 = cssc.add(cls2);
    rule2.set('style', { prop2: 'value2' });

    var rule3 = cssc.add(cls1, '', '(max-width: 999px)');
    rule3.set('style', { prop3: 'value3' });
    var rule4 = cssc.add(cls2, '', '(max-width: 999px)');
    rule4.set('style', { prop4: 'value4' });

    var rule5 = cssc.add(cls1, '', '(max-width: 100px)');
    rule5.set('style', { prop5: 'value5' });

    expect(obj.build(comp, { cssc })).toEqual(
      '.class1.class2{prop1:value1;}.class2{prop2:value2;}' +
        '@media (max-width: 999px){.class1{prop3:value3;}.class2{prop4:value4;}}' +
        '@media (max-width: 100px){.class1{prop5:value5;}}',
    );
  });

  test('Avoid useless code', () => {
    var m1 = comp.get('components').add({ tagName: 'article' });
    var cls1 = m1.get('classes').add({ name: 'class1' });

    var cssc = newCssComp();
    var rule = cssc.add(cls1);
    rule.set('style', { prop1: 'value1', prop2: 'value2' });

    comp.get('components').remove(m1);
    expect(obj.build(comp, { cssc })).toEqual('');
  });

  test('Render correctly a rule without avoidInlineStyle option', () => {
    comp.setStyle({ color: 'red' });
    const id = comp.getId();
    const result = `#${id}{color:red;}`;
    expect(obj.build(comp, { cssc: cc })).toEqual(result);
  });

  test('Render correctly a rule with avoidInlineStyle option', () => {
    em.getConfig().avoidInlineStyle = 1;
    comp = new Component(
      {},
      {
        em,
        componentTypes: dcomp.componentTypes,
      },
    );
    comp.setStyle({ color: 'red' });
    const id = comp.getId();
    const result = `#${id}{color:red;}`;
    expect(obj.build(comp, { cssc: cc, em })).toEqual(result);
  });

  test('Render correctly a rule with avoidInlineStyle and state', () => {
    em.getConfig().avoidInlineStyle = 1;
    const state = 'hover';
    comp.config.avoidInlineStyle = 1;
    em.get('SelectorManager').setState(state);
    comp.setStyle({ color: 'red' });
    const id = comp.getId();
    const result = `#${id}:${state}{color:red;}`;
    expect(obj.build(comp, { cssc: cc, em })).toEqual(result);
  });

  test('Render correctly a rule with avoidInlineStyle and w/o state', () => {
    em.getConfig().avoidInlineStyle = 1;
    const state = 'hover';
    comp.config.avoidInlineStyle = 1;
    comp.setStyle({ color: 'blue' });
    em.get('SelectorManager').setState(state);
    comp.setStyle({ color: 'red' });
    const id = comp.getId();
    const result = `#${id}{color:blue;}#${id}:${state}{color:red;}`;
    expect(obj.build(comp, { cssc: cc, em })).toEqual(result);
  });

  test('Media queries are correctly cleaned for the length', () => {
    [
      ['@media (max-width: 999px)', 999],
      ['@media (min-width: 123%)', 123],
      ['@media (min-width: 1040rem)', 1040],
    ].forEach((item) => {
      expect(obj.getQueryLength(item[0])).toBe(item[1]);
    });
  });

  test('The media objects are correctly sorted', () => {
    expect(
      obj.sortMediaObject({
        '@media (max-width: 480px)': 1,
        '@font-face': 2,
        '@media (max-width: 768px)': 3,
        '@media (max-width: 1020ch)': 4,
        '@media (max-width: 10%)': 5,
      }),
    ).toEqual([
      { key: '@font-face', value: 2 },
      { key: '@media (max-width: 1020ch)', value: 4 },
      { key: '@media (max-width: 768px)', value: 3 },
      { key: '@media (max-width: 480px)', value: 1 },
      { key: '@media (max-width: 10%)', value: 5 },
    ]);
  });

  test('The media objects, for the mobile first approach, are correctly sorted', () => {
    expect(
      obj.sortMediaObject({
        '@media (min-width: 480px)': 1,
        '@font-face': 2,
        '@media (min-width: 768px)': 3,
        '@media (min-width: 1020ch)': 4,
        '@media (min-width: 10%)': 5,
      }),
    ).toEqual([
      { key: '@font-face', value: 2 },
      { key: '@media (min-width: 10%)', value: 5 },
      { key: '@media (min-width: 480px)', value: 1 },
      { key: '@media (min-width: 768px)', value: 3 },
      { key: '@media (min-width: 1020ch)', value: 4 },
    ]);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: grapesjs-dev/packages/core/test/specs/commands/index.ts

```typescript
import EditorModel from '../../../src/editor/model/Editor';
import type Commands from '../../../src/commands';
import type { Command, CommandFunction, CommandOptions } from '../../../src/commands/view/CommandAbstract';

describe('Commands', () => {
  describe('Main', () => {
    let em: EditorModel;
    let obj: Commands;
    let commSimple: Command;
    let commRunOnly: Command;
    let commFunc: CommandFunction;
    let commName = 'commandTest';
    let commResultRun = 'Run executed';
    let commResultStop = 'Stop executed';

    beforeEach(() => {
      commSimple = {
        run: () => commResultRun,
        stop: () => commResultStop,
      };
      commRunOnly = {
        run: () => commResultRun,
      };
      commFunc = () => commResultRun;
      em = new EditorModel();
      em.set('Editor', em);
      obj = em.Commands;
    });

    afterEach(() => {
      em.destroy();
    });

    test('No commands inside', () => {
      expect(obj.get('test')).toBeUndefined();
    });

    test('Push new command', () => {
      const comm = { test: 'test' };
      const len = Object.keys(obj.getAll()).length;
      obj.add('test', comm);
      expect(obj.has('test')).toBe(true);
      expect(Object.keys(obj.getAll()).length).toBe(len + 1);
      expect(obj.get('test')!.test).toEqual('test');
    });

    test('Default commands after loadDefaultCommands', () => {
      expect(obj.get('select-comp')).not.toBeUndefined();
    });

    test('Commands module should not have toLoad property', () => {
      // @ts-ignore
      expect(obj.toLoad).toBeUndefined();
    });

    test('Run simple command and check if the state is tracked', () => {
      // Add the command
      obj.add(commName, commSimple);
      expect(obj.isActive(commName)).toBe(false);

      // Start the command
      let result = obj.run(commName);
      expect(result).toBe(commResultRun);
      expect(obj.isActive(commName)).toBe(true);
      expect(Object.keys(obj.getActive()).length).toBe(1);

      // Stop the command
      result = obj.stop(commName);
      expect(result).toBe(commResultStop);
      expect(obj.isActive(commName)).toBe(false);
      expect(Object.keys(obj.getActive()).length).toBe(0);
    });

    test('Run command only with run method, ensure is not tracked', () => {
      // Add the command
      obj.add(commName, commRunOnly);
      expect(obj.isActive(commName)).toBe(false);

      // Start the command
      let result = obj.run(commName);
      expect(result).toBe(commResultRun);
      expect(obj.isActive(commName)).toBe(false);
      expect(Object.keys(obj.getActive()).length).toBe(0);
    });

    test('Run function command, ensure is not tracked', () => {
      // Add the command
      obj.add(commName, commFunc);
      expect(obj.isActive(commName)).toBe(false);

      // Start the command
      let result = obj.run(commName);
      expect(result).toBe(commResultRun);
      expect(obj.isActive(commName)).toBe(false);
      expect(Object.keys(obj.getActive()).length).toBe(0);
    });

    test('Run command and check if none, custom, and default options are passed', () => {
      const customOptions = { customValue: 'customValue' };
      const defaultOptions = { defaultValue: 'defaultValue' };

      // Create a function that returns the options
      const runFn = (_editor: any, _sender: any, options: any) => options;

      // Add the command
      obj.add(commName, { run: runFn });

      // Run the command without custom options
      let result = obj.run(commName);
      expect(result).toEqual({});

      // Run the command with custom options
      result = obj.run(commName, customOptions);
      expect(result).toEqual(customOptions);

      // Set default options for the command
      obj.config.defaultOptions = {
        [commName]: {
          run: (options: CommandOptions) => ({ ...options, ...defaultOptions }),
        },
      };

      // Run the command with default options
      result = obj.run(commName, customOptions);
      expect(result).toEqual({ ...customOptions, ...defaultOptions });
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: CommandAbstract.ts]---
Location: grapesjs-dev/packages/core/test/specs/commands/view/CommandAbstract.ts

```typescript
import CommandsEvents from '../../../../src/commands/types';
import CommandAbstract from '../../../../src/commands/view/CommandAbstract';
import Editor from '../../../../src/editor';

describe('CommandAbstract', () => {
  let editor: Editor;
  let command: CommandAbstract;

  beforeEach(() => {
    editor = new Editor();
    command = new CommandAbstract({});
    command.id = 'test';
  });

  test('callRun returns result when no "abort" option specified', () => {
    const returnValue = 'result';
    const triggerSpy = jest.spyOn(editor, 'trigger');
    const runSpy = jest.spyOn(command, 'run');
    runSpy.mockReturnValue(returnValue as any);
    const result = command.callRun(editor);
    const options = {};
    const resOptions = { options, id: command.id, result: returnValue };
    const resCallOptions = { ...resOptions, type: 'run' };

    expect(triggerSpy.mock.calls.length).toBe(5);
    expect(triggerSpy.mock.calls[0]).toEqual([`${CommandsEvents.runBeforeCommand}test`, { options }]);
    expect(triggerSpy.mock.calls[1]).toEqual([`${CommandsEvents.runCommand}test`, resOptions]);
    expect(triggerSpy.mock.calls[2]).toEqual([`${CommandsEvents.callCommand}test`, resCallOptions]);
    expect(triggerSpy.mock.calls[3]).toEqual([CommandsEvents.run, resOptions]);
    expect(triggerSpy.mock.calls[4]).toEqual([CommandsEvents.call, resCallOptions]);

    expect(runSpy).toHaveBeenCalledTimes(1);
    expect(result).toEqual(returnValue);
  });

  test('callRun returns undefined when "abort" option is specified', () => {
    const returnValue = 'result';
    const options = { abort: true };
    const triggerSpy = jest.spyOn(editor, 'trigger');
    const runSpy = jest.spyOn(command, 'run');
    runSpy.mockReturnValue(returnValue as any);
    const result = command.callRun(editor, options);

    expect(triggerSpy.mock.calls.length).toBe(2);
    expect(triggerSpy.mock.calls[0]).toEqual([`${CommandsEvents.runBeforeCommand}test`, { options }]);
    expect(triggerSpy.mock.calls[1]).toEqual([`${CommandsEvents.abort}test`, { options }]);

    expect(runSpy).toHaveBeenCalledTimes(0);
    expect(result).toEqual(undefined);
  });

  test('callStop returns result', () => {
    const returnValue = 'stopped';
    const triggerSpy = jest.spyOn(editor, 'trigger');
    const runSpy = jest.spyOn(command, 'stop');
    runSpy.mockReturnValue(returnValue as any);
    const result = command.callStop(editor);
    const options = {};
    const resOptions = { options, id: command.id, result: returnValue };
    const resCallOptions = { ...resOptions, type: 'stop' };

    expect(triggerSpy.mock.calls.length).toBe(5);
    expect(triggerSpy.mock.calls[0]).toEqual([`${CommandsEvents.stopBeforeCommand}test`, { options }]);
    expect(triggerSpy.mock.calls[1]).toEqual([`${CommandsEvents.stopCommand}test`, resOptions]);
    expect(triggerSpy.mock.calls[2]).toEqual([`${CommandsEvents.callCommand}test`, resCallOptions]);
    expect(triggerSpy.mock.calls[3]).toEqual([CommandsEvents.stop, resOptions]);
    expect(triggerSpy.mock.calls[4]).toEqual([CommandsEvents.call, resCallOptions]);

    expect(runSpy).toHaveBeenCalledTimes(1);
    expect(result).toEqual(returnValue);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: Preview.ts]---
Location: grapesjs-dev/packages/core/test/specs/commands/view/Preview.ts

```typescript
import Panel from '../../../../src/panels/model/Panel';
import Preview from '../../../../src/commands/view/Preview';

describe('Preview command', () => {
  let fakePanels: Panel[];
  let fakeEditor: any;
  let fakeIsActive: any;
  const obj: any = {};

  beforeEach(() => {
    fakePanels = [new Panel(obj, obj), new Panel(obj, obj), new Panel(obj, obj)];
    fakeIsActive = false;

    fakeEditor = {
      getEl: jest.fn(),
      refresh: jest.fn(),
      runCommand: jest.fn(),
      stopCommand: jest.fn(),

      getModel: jest.fn().mockReturnValue({
        runDefault: jest.fn(),
        stopDefault: jest.fn(),
      }),

      Config: {},

      Canvas: {
        getElement: jest.fn().mockReturnValue({
          style: {},
          setAttribute: jest.fn(),
        }),
      },

      select: jest.fn(),

      getSelectedAll: jest.fn().mockReturnValue([]),

      Commands: {
        isActive: jest.fn(() => fakeIsActive),
      },

      Panels: {
        getPanels: jest.fn(() => fakePanels),
      },
    };

    Preview.panels = undefined;
    Preview.shouldRunSwVisibility = undefined;
  });

  describe('.getPanels', () => {
    test('it should return panels set with the editor panels if not already set', () => {
      Preview.getPanels(fakeEditor);
      expect(Preview.panels).toBe(fakePanels);
      Preview.getPanels(fakeEditor);
      expect(fakeEditor.Panels.getPanels).toHaveBeenCalledTimes(1);
    });
  });

  describe('.run', () => {
    beforeEach(() => {
      Preview.helper = { style: {} };
    });

    it('should hide all panels', () => {
      fakePanels.forEach((panel) => expect(panel.get('visible')).toEqual(true));
      Preview.run!(fakeEditor, obj, obj);
      fakePanels.forEach((panel) => expect(panel.get('visible')).toEqual(false));
    });

    it("should stop the 'core:component-outline' command if active", () => {
      Preview.run!(fakeEditor, obj, obj);
      expect(fakeEditor.stopCommand).not.toHaveBeenCalled();
      fakeIsActive = true;
      Preview.run!(fakeEditor, obj, obj);
      expect(fakeEditor.stopCommand).toHaveBeenCalledWith('core:component-outline');
    });

    it('should not reset the `shouldRunSwVisibility` state once active if run multiple times', () => {
      expect(Preview.shouldRunSwVisibility).toBeUndefined();
      fakeIsActive = true;
      Preview.run!(fakeEditor, obj, obj);
      expect(Preview.shouldRunSwVisibility).toEqual(true);
      fakeIsActive = false;
      Preview.run!(fakeEditor, obj, obj);
      expect(Preview.shouldRunSwVisibility).toEqual(true);
    });
  });

  describe('.stop', () => {
    it('should show all panels', () => {
      fakePanels.forEach((panel) => panel.set('visible', false));
      Preview.stop!(fakeEditor, obj, obj);
      fakePanels.forEach((panel) => expect(panel.get('visible')).toEqual(true));
    });

    it("should run the 'core:component-outline' command if it was active before run", () => {
      Preview.stop!(fakeEditor, obj, obj);
      expect(fakeEditor.runCommand).not.toHaveBeenCalled();
      Preview.shouldRunSwVisibility = true;
      Preview.stop!(fakeEditor, obj, obj);
      expect(fakeEditor.runCommand).toHaveBeenCalledWith('core:component-outline');
      expect(Preview.shouldRunSwVisibility).toEqual(false);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: SwitchVisibility.ts]---
Location: grapesjs-dev/packages/core/test/specs/commands/view/SwitchVisibility.ts

```typescript
import SwitchVisibility from '../../../../src/commands/view/SwitchVisibility';

describe('SwitchVisibility command', () => {
  let fakeEditor: any;
  let fakeFrames: any;
  let fakeIsActive: any;

  beforeEach(() => {
    fakeFrames = [];
    fakeIsActive = false;

    fakeEditor = {
      Canvas: {
        getFrames: jest.fn(() => fakeFrames),
      },

      Commands: {
        isActive: jest.fn(() => fakeIsActive),
      },
    };
  });

  describe('.toggleVis', () => {
    it('should do nothing if the preview command is active', () => {
      expect(fakeEditor.Canvas.getFrames).not.toHaveBeenCalled();
      fakeIsActive = true;
      SwitchVisibility.toggleVis(fakeEditor);
      expect(fakeEditor.Canvas.getFrames).not.toHaveBeenCalled();
    });
  });
});
```

--------------------------------------------------------------------------------

````
