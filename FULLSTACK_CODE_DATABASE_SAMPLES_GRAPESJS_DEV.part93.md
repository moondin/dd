---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 93
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 93 of 97)

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

---[FILE: ClassManager.ts]---
Location: grapesjs-dev/packages/core/test/specs/selector_manager/e2e/ClassManager.ts

```typescript
import grapesjs, { Component, Components, Editor } from '../../../../src';
import Selector from '../../../../src/selector_manager/model/Selector';
import ClassTagsView from '../../../../src/selector_manager/view/ClassTagsView';

describe('ClassManager E2E tests', () => {
  let fixtures: HTMLElement;
  let components: Components;
  let tagEl: ClassTagsView;
  let gjs: Editor;
  let module: Editor['Selectors'];

  describe('Interaction with Components', () => {
    beforeEach(() => {
      document.body.innerHTML = '<div id="fixtures"><div id="SelectorManager-fixture"></div></div>';
      fixtures = document.body.firstElementChild as HTMLElement;
      gjs = grapesjs.init({
        stylePrefix: '',
        storageManager: false,
        container: '#SelectorManager-fixture',
      });
      components = gjs.getComponents();
      module = gjs.Selectors;
      fixtures.appendChild(module.render([]));
      tagEl = module.selectorTags!;
    });

    afterEach(() => {
      gjs.destroy();
    });

    test('Assign correctly new class to component', () => {
      const model = components.add({}) as unknown as Component;
      expect(model.classes.length).toEqual(0);
      gjs.select(model);
      tagEl.addNewTag('test');
      expect(model.classes.length).toEqual(1);
      expect(model.classes.at(0).get('name')).toEqual('test');
    });

    test('Classes from components are correctly imported inside main container', () => {
      components.add([{ classes: ['test11', 'test12', 'test13'] }, { classes: ['test11', 'test22', 'test22'] }]);
      expect(gjs.editor.get('SelectorManager').getAll().length).toEqual(4);
    });

    test('Class imported into component is the same model from main container', () => {
      const model = components.add({ classes: ['test1'] }) as unknown as Component;
      const clModel = model.classes.at(0);
      const clModel2 = gjs.editor.get('SelectorManager').getAll().at(0);
      expect(clModel).toEqual(clModel2);
    });

    test('Can assign only one time the same class on selected component and the class viewer', () => {
      const model = components.add({}) as unknown as Component;
      gjs.select(model);
      tagEl.addNewTag('test');
      tagEl.addNewTag('test');
      const sels = model.getSelectors();
      // Component has 1 selector
      expect(sels.length).toEqual(1);
      expect(sels.at(0).get('name')).toEqual('test');
      // One only selector added
      expect(module.getAll().length).toEqual(1);
      expect(module.getAll().at(0).get('name')).toEqual('test');
    });

    test('Removing from container removes also from selected component', () => {
      const model = components.add({}) as unknown as Component;
      gjs.editor.setSelected(model);
      tagEl.addNewTag('test');
      tagEl.getClasses().find('.tag #close').trigger('click');
      setTimeout(() => expect(model.classes.length).toEqual(0));
    });

    test('Trigger correctly event on target with new class add', () => {
      const spy = jest.fn();
      const model = components.add({});
      gjs.select(model);
      tagEl.addNewTag('test');
      gjs.editor.on('component:update:classes', spy);
      tagEl.addNewTag('test');
      expect(spy).toBeCalledTimes(0);
      tagEl.addNewTag('test2');
      expect(spy).toBeCalledTimes(1);
    });

    test('Selectors are properly transformed to JSON', () => {
      const model = components.add({
        classes: [
          'test1',
          '.test1a',
          '#test2',
          { name: 'test3', label: 'test3' },
          { name: 'test4', label: 'test4a' },
          { name: 'test5' },
          { name: 'test6', type: Selector.TYPE_CLASS },
          { name: 'test7', type: Selector.TYPE_ID },
          { name: 'test8', type: Selector.TYPE_CLASS, protected: 1 },
          { name: 'test9', type: Selector.TYPE_ID, protected: 1 },
          { label: 'test10' },
          { label: 'test11', type: Selector.TYPE_ID },
          { label: 'test12', protected: 1 },
        ],
      });

      const modelTr = JSON.parse(JSON.stringify(model));
      expect(modelTr.classes).toEqual([
        'test1',
        'test1a',
        '#test2',
        'test3',
        { name: 'test4', label: 'test4a' },
        'test5',
        'test6',
        '#test7',
        { name: 'test8', protected: 1 },
        { name: 'test9', type: Selector.TYPE_ID, protected: 1 },
        'test10',
        '#test11',
        { name: 'test12', protected: 1 },
      ]);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: SelectorModels.ts]---
Location: grapesjs-dev/packages/core/test/specs/selector_manager/model/SelectorModels.ts

```typescript
import Selector from '../../../../src/selector_manager/model/Selector';
import Selectors from '../../../../src/selector_manager/model/Selectors';

describe('Selector', () => {
  let obj: Selector;
  const nameToEscape = '  @Te    sT:*[]!"£$%&/()=?^{}(). %/+#';
  const nameEscaped = '@Te-sT:*[]!"£$%&/()=?^{}().-%/+#';

  beforeEach(() => {
    obj = new Selector({ name: '' });
  });

  test('Has name property', () => {
    expect(obj.has('name')).toEqual(true);
  });

  test('Has label property', () => {
    expect(obj.has('label')).toEqual(true);
  });

  test('Has active property', () => {
    expect(obj.has('active')).toEqual(true);
  });

  test('escapeName test', () => {
    expect(Selector.escapeName(nameToEscape)).toEqual(nameEscaped);
  });

  test('Name is corrected at instantiation', () => {
    obj = new Selector({ name: nameToEscape });
    expect(obj.get('name')).toEqual(nameEscaped);
  });
});

describe('Selectors', () => {
  let obj: Selectors;

  beforeEach(() => {
    obj = new Selectors();
  });

  test('Creates collection item correctly', () => {
    var c = new Selectors();
    var m = c.add({});
    expect(m instanceof Selector).toEqual(true);
  });

  test('getFullString with single class', () => {
    obj.add({ name: 'test' });
    expect(obj.getFullString()).toEqual('.test');
  });

  test('getFullString with multiple classes', () => {
    obj.add([{ name: 'test' }, { name: 'test2' }]);
    expect(obj.getFullString()).toEqual('.test.test2');
  });

  test('getFullString with mixed selectors', () => {
    obj.add([{ name: 'test' }, { name: 'test2', type: Selector.TYPE_ID }]);
    expect(obj.getFullString()).toEqual('.test#test2');
  });

  test('getFullName with combination of 2 classes', () => {
    obj.add([{ name: 'a' }, { name: 'b' }]);
    expect(
      obj.getFullName({
        combination: true,
        array: true,
      }),
    ).toEqual(['.a', '.a.b', '.b']);

    expect(obj.getFullName({ combination: true })).toEqual('.a,.a.b,.b');
    expect(obj.getFullName({ array: true })).toEqual(['.a', '.b']);
    expect(obj.getFullName()).toEqual('.a.b');
  });

  test('getFullName with combination of 3 classes', () => {
    obj.add([{ name: 'c' }, { name: 'b' }, { name: 'a' }]);
    expect(
      obj.getFullName({
        combination: true,
        array: true,
      }),
    ).toEqual(['.a', '.a.b', '.a.b.c', '.a.c', '.b', '.b.c', '.c']);
  });

  test('getFullName with combination of 4 classes', () => {
    obj.add([{ name: 'd' }, { name: 'c' }, { name: 'b' }, { name: 'a' }]);
    expect(
      obj.getFullName({
        combination: true,
        array: true,
      }),
    ).toEqual([
      '.a',
      '.a.b',
      '.a.b.c',
      '.a.b.c.d',
      '.a.b.d',
      '.a.c',
      '.a.c.d',
      '.a.d',
      '.b',
      '.b.c',
      '.b.c.d',
      '.b.d',
      '.c',
      '.c.d',
      '.d',
    ]);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ClassTagsView.ts]---
Location: grapesjs-dev/packages/core/test/specs/selector_manager/view/ClassTagsView.ts

```typescript
import ClassTagsView from '../../../../src/selector_manager/view/ClassTagsView';
import Selectors from '../../../../src/selector_manager/model/Selectors';
import Component from '../../../../src/dom_components/model/Component';
import Rule from '../../../../src/css_composer/model/CssRule';
import Editor from '../../../../src/editor/model/Editor';
import { Selector } from '../../../../src';
import { createEl } from '../../../../src/utils/dom';

describe('ClassTagsView', () => {
  let testContext: any;
  let view: ClassTagsView;
  let fixture: HTMLElement;
  let fixtures: HTMLElement;
  let coll: Selectors;
  let target: Editor;
  let em: Editor;
  let compTest: Component;
  const getSelectorNames = (arr: Selector[] | Selectors) => arr.map((item) => item.getFullName());
  const newComponent = (obj: any) => new Component(obj, { em, config: em.Components.config });
  const newRule = (obj: any) => new Rule(obj, { em });

  beforeAll(() => {
    document.body.innerHTML = '<div id="fixtures"></div>';
    fixtures = document.body.querySelector('#fixtures')!;
    testContext = {};
  });

  afterAll(() => {
    fixture.remove();
  });

  beforeEach(() => {
    target = new Editor();
    em = target;
    coll = new Selectors();
    view = new ClassTagsView({
      config: { em },
      collection: coll,
      module: em.Selectors,
    });

    testContext.targetStub = {
      add(v: any) {
        return { name: v };
      },
    };

    compTest = new Component({}, { em, config: em.Components.config });
    testContext.compTargetStub = compTest;

    fixtures.innerHTML = '';
    fixture = createEl('div', { class: 'classtag-fixture' });
    fixtures.appendChild(fixture);
    // fixture.empty().appendTo(fixtures);
    fixture.appendChild(view.render().el);
    testContext.btnAdd = view.$addBtn;
    testContext.input = view.$el.find('[data-input]');
    testContext.$tags = view.$el.find('[data-selectors]');
    testContext.$statesC = view.$el.find('[data-states-c]');
  });

  afterEach(() => {
    target.destroy();
    fixture.remove();
  });

  test('Object exists', () => {
    expect(ClassTagsView).toBeTruthy();
  });

  test('Not tags inside', () => {
    expect(testContext.$tags.html()).toEqual('');
  });

  test('Add new tag triggers correct method', () => {
    const spy = jest.spyOn(view, 'addToClasses');
    coll.add({ name: 'test' });
    expect(spy).toBeCalledTimes(1);
  });

  test('Start new tag creation', () => {
    testContext.btnAdd.trigger('click');
    expect(testContext.btnAdd.css('display')).toEqual('none');
    expect(testContext.input.css('display')).not.toEqual('none');
  });

  test('Stop tag creation', () => {
    testContext.btnAdd.trigger('click');
    testContext.input.val('test');
    testContext.input.trigger('focusout');
    expect(testContext.btnAdd.css('display')).not.toEqual('none');
    expect(testContext.input.css('display')).toEqual('none');
    expect(testContext.input.val()).toBeFalsy();
  });

  test.skip('Check keyup of ESC on input', function () {
    // this.btnAdd.click();
    // sinon.stub(view, 'addNewTag');
    // this.input.trigger({
    //   type: 'keyup',
    //   keyCode: 13,
    // });
    // expect(view.addNewTag.calledOnce).toEqual(true);
  });

  test.skip('Check keyup on ENTER on input', function () {
    // this.btnAdd.click();
    // sinon.stub(view, 'endNewTag');
    // this.input.trigger({
    //   type: 'keyup',
    //   keyCode: 27,
    // });
    // expect(view.endNewTag.calledOnce).toEqual(true);
  });

  test('Collection changes on update of target', (done) => {
    coll.add({ name: 'test' });
    target.trigger('component:toggled');
    setTimeout(() => {
      expect(coll.length).toEqual(0);
      done();
    });
  });

  test('Collection reacts on reset', () => {
    coll.add([{ name: 'test1' }, { name: 'test2' }]);
    const spy = jest.spyOn(view, 'addToClasses');
    coll.trigger('reset');
    expect(spy).toBeCalledTimes(2);
  });

  test("Don't accept empty tags", () => {
    view.addNewTag('');
    expect(testContext.$tags.html()).toEqual('');
  });

  test('Accept new tags', (done) => {
    em.setSelected(compTest);
    view.addNewTag('test');
    view.addNewTag('test2');
    setTimeout(() => {
      expect(testContext.$tags.children().length).toEqual(2);
      done();
    });
  });

  test('New tag correctly added', () => {
    coll.add({ label: 'test' });
    expect(testContext.$tags.children().first().find('[data-tag-name]').text()).toEqual('test');
  });

  test('States are hidden in case no tags', () => {
    view.updateStateVis();
    expect(testContext.$statesC.css('display')).toEqual('none');
  });

  test('States are visible in case of more tags inside', () => {
    coll.add({ label: 'test' });
    view.updateStateVis();
    expect(testContext.$statesC.css('display')).toEqual('');
  });

  test('Update state visibility on new tag', (done) => {
    const spy = jest.spyOn(view, 'updateStateVis');
    em.setSelected(compTest);
    view.addNewTag('test');
    setTimeout(() => {
      expect(spy).toBeCalledTimes(1);
      done();
    });
  });

  test('Update state visibility on removing of the tag', (done) => {
    em.setSelected(compTest);
    view.addNewTag('test');
    const spy = jest.spyOn(view, 'updateStateVis');
    coll.remove(coll.at(0));
    setTimeout(() => {
      expect(spy).toBeCalledTimes(1);
      done();
    });
  });

  test('Output correctly state options', (done) => {
    target.get('SelectorManager').setStates([{ name: 'testName', label: 'testLabel' }]);
    setTimeout(() => {
      const res = '<option value="">- State -</option><option value="testName">testLabel</option>';
      expect(view.getStates()[0].innerHTML).toEqual(res);
      done();
    });
  });

  describe('_commonSelectors', () => {
    test('Returns empty array with no arguments', () => {
      expect(view._commonSelectors()).toEqual([]);
    });

    test('Returns the first item if only one argument is passed', () => {
      const item = [1, 2];
      expect(view._commonSelectors(item)).toEqual(item);
    });

    test('Returns corret output with 2 arrays', () => {
      const item1 = [1, 2, 3, 4];
      const item2 = [3, 4, 5, 6];
      expect(view._commonSelectors(item1, item2)).toEqual([3, 4]);
    });

    test('Returns corret output with more arrays', () => {
      const item1 = [1, 2, 3, 4, 5];
      const item2 = [3, 4, 5, 6];
      const item3 = [30, 5, 6];
      expect(view._commonSelectors(item1, item2, item3)).toEqual([5]);
    });
  });

  describe('getCommonSelectors', () => {
    test('Returns empty array with no targets', () => {
      expect(view.getCommonSelectors({ targets: [] })).toEqual([]);
    });

    test('Returns the selectors of a single component', () => {
      const cmp = newComponent({ classes: 'test1 test2 test3' });
      const selectors = cmp.getSelectors();
      const result = view.getCommonSelectors({ targets: [cmp] });
      expect(getSelectorNames(result)).toEqual(getSelectorNames(selectors));
    });

    test('Returns common selectors of two components', () => {
      const cmp1 = newComponent({ classes: 'test1 test2 test3' });
      const cmp2 = newComponent({ classes: 'test1 test2' });
      const result = view.getCommonSelectors({ targets: [cmp1, cmp2] });
      expect(getSelectorNames(result)).toEqual(['.test1', '.test2']);
    });

    test('Returns common selectors of more components', () => {
      const cmp1 = newComponent({ classes: 'test1 test2 test3' });
      const cmp2 = newComponent({ classes: 'test1 test2' });
      const cmp3 = newComponent({ classes: 'test2 test3' });
      const result = view.getCommonSelectors({ targets: [cmp1, cmp2, cmp3] });
      expect(getSelectorNames(result)).toEqual(['.test2']);
    });

    test('Returns empty array with components without common selectors', () => {
      const cmp1 = newComponent({ classes: 'test1 test2 test3' });
      const cmp2 = newComponent({ classes: 'test1 test2' });
      const cmp3 = newComponent({ classes: 'test4' });
      const result = view.getCommonSelectors({ targets: [cmp1, cmp2, cmp3] });
      expect(getSelectorNames(result)).toEqual([]);
    });
  });

  describe('updateSelection', () => {
    test('Returns empty array without targets', () => {
      expect(view.updateSelection([])).toEqual([]);
    });

    test('Returns empty array with invalid selectors', () => {
      expect(view.updateSelection('body .test' as any)).toEqual([]);
    });

    test('Returns array with common selectors from Components', () => {
      const cmp1 = newComponent({ classes: 'test1 test2 test3' });
      const cmp2 = newComponent({ classes: 'test1 test2' });
      const cmp3 = newComponent({ classes: 'test2 test3' });
      const result = view.updateSelection([cmp1, cmp2, cmp3]);
      expect(getSelectorNames(result)).toEqual(['.test2']);
    });

    test('Returns array with common selectors from CssRule', () => {
      const rule1 = newRule({ selectors: 'test1 test2 test3'.split(' ') });
      const rule2 = newRule({ selectors: 'test1 test2'.split(' ') });
      const rule3 = newRule({ selectors: 'test2 test3'.split(' ') });
      const result = view.updateSelection([rule1, rule2, rule3] as any);
      expect(getSelectorNames(result)).toEqual(['.test2']);
    });

    test('Returns array with common selectors from CssRule and Components', () => {
      const rule1 = newRule({ selectors: 'test1 test2 test3'.split(' ') });
      const rule2 = newRule({ selectors: 'test1 test2'.split(' ') });
      const cmp1 = newComponent({ classes: 'test2 test3' });
      const result = view.updateSelection([rule1, rule2, cmp1] as any);
      expect(getSelectorNames(result)).toEqual(['.test2']);
    });
  });

  describe('Should be rendered correctly', () => {
    test('Has label', () => {
      expect(view.$el.find('#label')[0]).toBeTruthy();
    });
    test('Has tags container', () => {
      expect(view.$el.find('#tags-c')[0]).toBeTruthy();
    });
    test('Has add button', () => {
      expect(view.$el.find('#add-tag')[0]).toBeTruthy();
    });
    test('Has states input', () => {
      expect(view.$el.find('#states')[0]).toBeTruthy();
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ClassTagView.ts]---
Location: grapesjs-dev/packages/core/test/specs/selector_manager/view/ClassTagView.ts

```typescript
import EditorModel from '../../../../src/editor/model/Editor';
import ClassTagView from '../../../../src/selector_manager/view/ClassTagView';
import Selectors from '../../../../src/selector_manager/model/Selectors';

describe('ClassTagView', () => {
  let obj: ClassTagView;
  let fixtures: HTMLElement;
  let coll: Selectors;
  let em: EditorModel;
  const testLabel = 'TestLabel';

  beforeEach(() => {
    coll = new Selectors();
    em = new EditorModel();
    const model = coll.add({
      name: 'test',
      label: testLabel,
    });
    obj = new ClassTagView({
      config: { em },
      model,
      coll,
    });
    document.body.innerHTML = '<div id="fixtures"></div>';
    fixtures = document.body.querySelector('#fixtures')!;
    fixtures.appendChild(obj.render().el);
  });

  test('Object exists', () => {
    expect(ClassTagView).toBeTruthy();
  });

  test('Not empty', () => {
    const $el = obj.$el;
    expect($el.html()).toBeTruthy();
  });

  test('Not empty', () => {
    const $el = obj.$el;
    expect($el.html()).toContain(testLabel);
  });

  describe('Should be rendered correctly', () => {
    test('Has close button', () => {
      const $el = obj.$el;
      expect($el.find('#close')[0]).toBeTruthy();
    });
    test('Has checkbox', () => {
      const $el = obj.$el;
      expect($el.find('#checkbox')[0]).toBeTruthy();
    });
    test('Has label', () => {
      const $el = obj.$el;
      expect($el.find('#tag-label')[0]).toBeTruthy();
    });
  });
  // To refactor.. the remove method relies on selected component...
  test.skip('Could be removed', () => {
    obj.$el.find('#close').trigger('click');
    expect(fixtures.innerHTML).toBeFalsy();
  });

  test('Checkbox toggles status', () => {
    const spy = jest.fn();
    obj.model.on('change:active', spy);
    obj.model.set('active', true);
    obj.$el.find('#checkbox').trigger('click');
    expect(obj.model.get('active')).toEqual(false);
    // expect(spy.called).toEqual(true);
    expect(spy).toBeCalledTimes(1);
  });

  test('Label input is disabled', () => {
    expect(obj.getInputEl().contentEditable).toBeFalsy();
  });

  test('On double click label input is enable', () => {
    obj.$el.find('#tag-label').trigger('dblclick');
    expect(obj.getInputEl().contentEditable).toEqual('true');
  });

  test('On blur label input turns back disabled', () => {
    obj.$el.find('#tag-label').trigger('dblclick');
    obj.endEditTag();
    expect(obj.getInputEl().contentEditable).toEqual('false');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: grapesjs-dev/packages/core/test/specs/storage_manager/index.ts

```typescript
import EditorModel from '../../../src/editor/model/Editor';
import StorageManager from '../../../src/storage_manager';

describe('Storage Manager', () => {
  describe('Main', () => {
    let obj: StorageManager;
    let em: EditorModel;

    beforeEach(() => {
      em = new EditorModel();
      obj = em.Storage;
    });

    afterEach(() => {
      em.destroy();
    });

    test('Object exists', () => {
      expect(StorageManager).toBeTruthy();
    });

    test('Autosave is active by default', () => {
      expect(obj.isAutosave()).toEqual(true);
    });

    test('Change autosave', () => {
      obj.setAutosave(false);
      expect(obj.isAutosave()).toEqual(false);
    });

    test('Steps before save are set as default', () => {
      expect(obj.getStepsBeforeSave()).toEqual(1);
    });

    test('Change steps before save', () => {
      obj.setStepsBeforeSave(5);
      expect(obj.getStepsBeforeSave()).toEqual(5);
    });

    test('Add and get new storage', () => {
      expect(obj.get('test')).toBe(undefined);
      obj.add('test', {
        async load() {
          return {};
        },
        async store() {},
      });
      expect(obj.get('test')).toBeDefined();
    });

    test('LocalStorage is set as default', () => {
      expect(obj.getCurrent()).toEqual('local');
    });

    test('Change storage type', () => {
      obj.setCurrent('remote');
      expect(obj.getCurrent()).toEqual('remote');
    });

    test('Store is executed', async () => {
      const spy = jest.spyOn(obj, '__exec');
      await obj.store({ item: 'test' });
      expect(spy).toBeCalledTimes(1);
    });

    test('Load default storages ', () => {
      expect(obj.get('local')).toBeTruthy();
      expect(obj.get('remote')).toBeTruthy();
      expect(obj.get('test')).toBeFalsy();
    });

    describe('With custom storage', () => {
      let storeValue = {};
      const storageId = 'testStorage';

      beforeEach(() => {
        storeValue = [];
        em = new EditorModel({
          storageManager: {
            type: storageId,
          },
        });
        obj = em.Storage;
        obj.add(storageId, {
          async store(data) {
            storeValue = data;
          },
          async load() {
            return storeValue;
          },
        });
      });

      afterEach(() => {
        em.destroy();
      });

      test('Check custom storage is enabled', () => {
        expect(obj.getCurrent()).toEqual(storageId);
        expect(obj.getCurrentStorage()).toBeDefined();
      });

      test('Store and load data', async () => {
        const data = {
          item: 'testData',
          item2: 'testData2',
        };

        await obj.store(data);
        expect(storeValue).toEqual(data);
        const res = await obj.load();
        expect(res).toEqual(data);
      });
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: Models.js]---
Location: grapesjs-dev/packages/core/test/specs/storage_manager/model/Models.js

```javascript
import LocalStorage from 'storage_manager/model/LocalStorage';
import RemoteStorage from 'storage_manager/model/RemoteStorage';

describe('LocalStorage', () => {
  let obj;
  let data = {
    item1: 'value1',
    item2: 'value2',
  };

  beforeEach(() => {
    obj = new LocalStorage();
  });

  afterEach(() => {
    obj = null;
  });

  test('Store and load items', async () => {
    await obj.store(data);
    const result = await obj.load();
    expect(result).toEqual(data);
  });
});

describe('RemoteStorage', () => {
  let obj;
  let data;
  let defaultOpts = {
    urlStore: '/store',
    urlLoad: '/load',
    credentials: true,
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
  };
  let mockResponse = (body = {}) => {
    return new window.Response(JSON.stringify(body), {
      status: 200,
      headers: { 'Content-type': 'application/json' },
    });
  };

  beforeEach(() => {
    data = {
      item1: 'value1',
      item2: 'value2',
    };
    obj = new RemoteStorage();
    obj.request = jest.fn(() => Promise.resolve(mockResponse({ data: 1 })));
  });

  afterEach(() => {
    obj.request.mockRestore();
    obj = null;
  });

  test('Store data', async () => {
    await obj.store(data, defaultOpts);
    const { calls } = obj.request.mock;
    expect(calls.length).toBe(1);
    expect(calls[0][0]).toBe(defaultOpts.urlStore);
    // expect(obj.request).toBeCalledWith(opts.urlStore, defaultOpts, opts);
    const { body, ...args } = calls[0][1];
    expect(args).toEqual({
      method: 'POST',
      headers: defaultOpts.headers,
      credentials: defaultOpts.credentials,
    });
  });

  test('Load data', async () => {
    await obj.load(defaultOpts);
    const { calls } = obj.request.mock;
    expect(obj.request).toBeCalledTimes(1);
    expect(calls[0][0]).toBe(defaultOpts.urlLoad);
    expect(calls[0][1]).toEqual({
      method: 'GET',
      body: undefined,
      headers: defaultOpts.headers,
      credentials: defaultOpts.credentials,
    });
  });

  test('Load data with custom fetch options', async () => {
    const customOpts = { customOpt: 'customValue' };
    await obj.load({
      ...defaultOpts,
      fetchOptions: () => customOpts,
    });

    expect(obj.request).toBeCalledTimes(1);
    expect(obj.request.mock.calls[0][1]).toEqual({
      method: 'GET',
      body: undefined,
      headers: defaultOpts.headers,
      credentials: defaultOpts.credentials,
      ...customOpts,
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: grapesjs-dev/packages/core/test/specs/style_manager/index.ts

```typescript
import CssComposer from '../../../src/css_composer';
import DeviceManager from '../../../src/device_manager';
import ComponentManager from '../../../src/dom_components';
import Editor from '../../../src/editor/model/Editor';
import SelectorManager from '../../../src/selector_manager';
import StyleManager from '../../../src/style_manager';

describe('StyleManager', () => {
  describe('Main', () => {
    let obj: StyleManager;
    let em: Editor;
    let domc: ComponentManager;
    let dv: DeviceManager;
    let cssc: CssComposer;
    let sm: SelectorManager;

    beforeEach(() => {
      em = new Editor({
        mediaCondition: 'max-width',
        avoidInlineStyle: true,
      });
      domc = em.Components;
      cssc = em.Css;
      dv = em.Devices;
      sm = em.Selectors;
      obj = em.Styles;
      em.Pages.onLoad();
    });

    afterEach(() => {
      em.destroy();
    });

    test('Object exists', () => {
      expect(obj).toBeTruthy();
    });

    test('No sectors', () => {
      expect(obj.getSectors().length).toEqual(0);
    });

    test('Add sector', () => {
      obj.addSector('test', {
        name: 'Test name',
      });
      var sector = obj.getSectors({ array: true })[0];
      expect(obj.getSectors().length).toEqual(1);
      expect(sector.get('id')).toEqual('test');
      expect(sector.get('name')).toEqual('Test name');
    });

    test('Add sectors', () => {
      obj.addSector('test', { name: 'test' });
      obj.addSector('test2', { name: 'test2' });
      expect(obj.getSectors().length).toEqual(2);
    });

    test("Can't create more than one sector with the same id", () => {
      var sect1 = obj.addSector('test', { name: 'test' });
      var sect2 = obj.addSector('test', { name: 'test' });
      expect(obj.getSectors().length).toEqual(1);
      expect(sect1).toEqual(sect2);
    });

    test('Get inexistent sector', () => {
      expect(obj.getSector('test')).toBeFalsy();
    });

    test('Get sector', () => {
      var sect1 = obj.addSector('test', { name: 'Test' });
      var sect2 = obj.getSector('test');
      expect(sect1).toEqual(sect2);
    });

    test('Add property to inexistent sector', () => {
      expect(obj.addProperty('test', { property: 'test' })).toEqual(undefined);
    });

    test('Add property', () => {
      obj.addSector('test', { name: 'test' });
      expect(obj.addProperty('test', { property: 'test' })).toBeTruthy();
      expect(obj.getProperties('test')!.length).toEqual(1);
    });

    test('Check added property', () => {
      obj.addSector('test', { name: 'test' });
      var prop = obj.addProperty('test', {
        name: 'test',
        property: 'test',
      });
      expect(prop?.get('name')).toEqual('test');
    });

    test('Add properties', () => {
      obj.addSector('test', { name: 'test' });
      // @ts-ignore
      obj.addProperty('test', [{}, {}]);
      expect(obj.getProperties('test')!.length).toEqual(2);
    });

    test('Get property from inexistent sector', () => {
      expect(obj.getProperty('test', 'test-prop')).toEqual(undefined);
    });

    test("Can't get properties without proper name", () => {
      obj.addSector('test', { name: 'test' });
      // @ts-ignore
      obj.addProperty('test', [{}, {}]);
      expect(obj.getProperty('test', 'test-prop')).toEqual(undefined);
    });

    test('Get property with proper name', () => {
      obj.addSector('test', { name: 'test' });
      var prop1 = obj.addProperty('test', { property: 'test-prop' });
      var prop2 = obj.getProperty('test', 'test-prop');
      expect(prop1).toEqual(prop2);
    });

    test('Get properties with proper name', () => {
      obj.addSector('test', { name: 'test' });
      // @ts-ignore
      obj.addProperty('test', [{ property: 'test-prop' }, { property: 'test-prop' }]);
      expect(obj.getProperty('test', 'test-prop')).toBeTruthy();
    });

    test('Get inexistent properties', () => {
      expect(obj.getProperties('test')).toEqual(undefined);
      expect(obj.getProperties('')).toEqual(undefined);
    });

    test('Renders correctly', () => {
      expect(obj.render()).toBeTruthy();
    });

    describe('Parent rules', () => {
      test('No parents without selection', () => {
        expect(obj.getSelectedParents()).toEqual([]);
      });

      test('Single class, multiple devices', (done) => {
        const cmp = domc.addComponent('<div class="cls"></div>');
        const [rule1, rule2] = cssc.addRules(`
          .cls { color: red; }
          @media (max-width: 992px) {
            .cls { color: blue; }
          }
        `);
        dv.select('tablet');
        em.setSelected(cmp);
        setTimeout(() => {
          expect(obj.getSelected()).toBe(rule2);
          expect(obj.getSelectedParents()).toEqual([rule1]);
          done();
        });
      });

      test('With ID, multiple devices', () => {
        sm.setComponentFirst(true);
        const cmp = domc.addComponent('<div class="cls" id="id-test"></div>');
        const [rule1, rule2] = cssc.addRules(`
          #id-test { color: red; }
          @media (max-width: 992px) {
            #id-test { color: blue; }
          }
        `);
        dv.select('tablet');
        em.setSelected(cmp);
        obj.__upSel();
        expect(obj.getSelected()).toBe(rule2);
        expect(obj.getSelectedParents()).toEqual([rule1]);
      });

      test('With ID + class, class first', () => {
        const cmp = domc.addComponent('<div class="cls" id="id-test"></div>');
        const [rule1, rule2] = cssc.addRules(`
          .cls { color: red; }
          #id-test { color: blue; }
        `);
        em.setSelected(cmp);
        obj.__upSel();
        expect(obj.getSelected()).toBe(rule1);
        expect(obj.getSelectedParents()).toEqual([rule2]);
      });

      test('With ID + class, component first', () => {
        sm.setComponentFirst(true);
        const cmp = domc.addComponent('<div class="cls" id="id-test"></div>');
        const [rule1, rule2] = cssc.addRules(`
          .cls { color: red; }
          #id-test { color: blue; }
        `);
        em.setSelected(cmp);
        obj.__upSel();
        expect(obj.getSelected()).toBe(rule2);
        expect(obj.getSelectedParents()).toEqual([rule1]);
      });

      test('With multiple classes, should both be in parents list', () => {
        const cmp = domc.addComponent('<div class="cls cls2"></div>');
        const [rule1, rule2] = cssc.addRules(`
          .cls { color: red; }
          .cls2 { color: blue; }
        `);
        em.setSelected(cmp);
        obj.__upSel();
        expect(obj.getSelected()).not.toBe(rule1);
        expect(obj.getSelected()).not.toBe(rule2);
        expect(obj.getSelectedParents()).toEqual([rule2, rule1]);
      });

      test('With tagName + class, class first', () => {
        const cmp = domc.addComponent('<div class="cls" id="id-test"></div>');
        const [rule1, rule2] = cssc.addRules(`
          .cls { color: red; }
          div { color: yellow; }
        `);
        em.setSelected(cmp);
        obj.__upSel();
        expect(obj.getSelected()).toBe(rule1);
        expect(obj.getSelectedParents()).toEqual([rule2]);
      });

      test('Should ignore rules with tagName in the selector path but the rule is not apply on the tagName', () => {
        const cmp = domc.addComponent('<div class="cls" id="id-test"></div>');
        const [rule1, rule2] = cssc.addRules(`
          .cls { color: red; }
          div { color: yellow; }
          div .child { padding: 10px; }
        `);
        em.setSelected(cmp);
        obj.__upSel();
        // getSelectedParents should only have 1 rule as the third one is not applied on the div
        expect(obj.getSelected()).toBe(rule1);
        expect(obj.getSelectedParents()).toEqual([rule2]);
      });

      test('Should tagName rules if the selectors does not contain only the tagNale', () => {
        const cmp = domc.addComponent('<div class="cls" id="id-test"></div>');
        const [rule1, rule2] = cssc.addRules(`
          .cls { color: red; }
          div { color: yellow; }
          .child div { padding: 10px; }
        `);
        em.setSelected(cmp);
        obj.__upSel();
        // getSelectedParents should only have 1 rule as the third one is not applied on the div
        expect(obj.getSelected()).toBe(rule1);
        expect(obj.getSelectedParents()).toEqual([rule2]);
      });

      test('With tagName + ID + class, class first, ID second', () => {
        const cmp = domc.addComponent('<div class="cls" id="id-test"></div>');
        const [rule1, rule2, rule3] = cssc.addRules(`
          .cls { color: red; }
          div { color: yellow; }
          #id-test { color: blue; }
        `);
        em.setSelected(cmp);
        obj.__upSel();
        expect(obj.getSelected()).toBe(rule1);
        expect(obj.getSelectedParents()).toEqual([rule3, rule2]);
      });

      test('With ID + class, multiple devices', () => {
        sm.setComponentFirst(true);
        const cmp = domc.addComponent('<div class="cls" id="id-test"></div>');
        const [rule1, rule2] = cssc.addRules(`
          .cls { color: red; }
          @media (max-width: 992px) {
            #id-test { color: blue; }
          }
        `);
        dv.select('tablet');
        em.setSelected(cmp);
        obj.__upSel();
        expect(obj.getSelected()).toBe(rule2);
        expect(obj.getSelectedParents()).toEqual([rule1]);
      });

      test('Mixed classes', () => {
        const cmp = domc.addComponent('<div class="cls1 cls2"></div>');
        const [a, b, rule1, rule2] = cssc.addRules(`
          h1 { color: white; }
          h1 .test { color: black; }
          .cls1 { color: red; }
          .cls1.cls2 { color: blue; }
          .cls2 { color: green; }
          .cls1.cls3 { color: green; }
          h2 { color: white; }
          h2 .test { color: black; }
        `);
        em.setSelected(cmp);
        obj.__upSel();
        expect(obj.getSelectedParents().length).toBe(1);
        expect(obj.getSelected()).toBe(rule2);
        expect(obj.getSelectedParents()).toEqual([rule1]);
      });
    });

    describe('Init with configuration', () => {
      beforeEach(() => {
        em = new Editor({
          styleManager: {
            sectors: [
              {
                id: 'dim',
                name: 'Dimension',
                properties: [
                  {
                    name: 'Width',
                    property: 'width',
                  },
                  {
                    name: 'Height',
                    property: 'height',
                  },
                ],
              },
              {
                id: 'pos',
                name: 'position',
                properties: [
                  {
                    name: 'Width',
                    property: 'width',
                  },
                ],
              },
            ],
          },
        });
        obj = em.get('StyleManager');
        obj.onLoad();
      });

      afterEach(() => {
        em.destroy();
      });

      test('Sectors added', () => {
        expect(obj.getSectors().length).toEqual(2);
        var sect1 = obj.getSector('dim');
        expect(sect1.get('name')).toEqual('Dimension');
      });

      test('Properties added', () => {
        var sect1 = obj.getSector('dim');
        var sect2 = obj.getSector('pos');
        expect(sect1.get('properties')?.length).toEqual(2);
        expect(sect2.get('properties')?.length).toEqual(1);
      });

      test('Property is correct', () => {
        var prop1 = obj.getProperty('dim', 'width')!;
        expect(prop1.get('name')).toEqual('Width');
      });

      test('Add built-in', () => {
        obj.addBuiltIn('test', { type: 'number' });
        obj.addBuiltIn('test2', { type: 'stack' });
        const added = obj.addProperty('dim', { extend: 'test', property: 'test' })!;
        expect(added.getType()).toEqual('number');
        // @ts-ignore
        const added2 = obj.addProperty('dim', 'test2')!;
        expect(added2.getType()).toEqual('stack');
      });
    });
  });
});
```

--------------------------------------------------------------------------------

````
