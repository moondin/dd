---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 96
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 96 of 97)

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

---[FILE: PropertySelectView.ts]---
Location: grapesjs-dev/packages/core/test/specs/style_manager/view/PropertySelectView.ts

```typescript
import PropertySelectView from '../../../../src/style_manager/view/PropertySelectView';
import Property from '../../../../src/style_manager/model/PropertyRadio';
import Editor from '../../../../src/editor/model/Editor';
import Component from '../../../../src/dom_components/model/Component';

describe('PropertySelectView', () => {
  let em: Editor;
  let dcomp: Editor['Components'];
  let compOpts: any;
  let component: Component;
  let fixtures: HTMLElement;
  let target: Component;
  let model: Property;
  let view: PropertySelectView;
  const propName = 'testprop';
  const propValue = 'test1value';
  const defValue = 'test2value';
  let options: any = [
    { id: 'test1value', style: 'test:style' },
    { id: 'test2', value: 'test2value' },
  ];

  beforeEach(() => {
    em = new Editor({});
    dcomp = em.Components;
    compOpts = { em, componentTypes: dcomp.componentTypes };
    target = new Component({}, compOpts);
    component = new Component({}, compOpts);
    model = new Property(
      {
        type: 'select',
        list: options,
        property: propName,
      },
      { em },
    );
    view = new PropertySelectView({ model });
    document.body.innerHTML = '<div id="fixtures"></div>';
    fixtures = document.body.firstChild as HTMLElement;
    view.render();
    fixtures.appendChild(view.el);
  });

  afterEach(() => {
    em.destroy();
  });

  test('Rendered correctly', () => {
    const prop = view.el;
    expect(fixtures.querySelector('.property')).toBeTruthy();
    expect(prop.querySelector('.label')).toBeTruthy();
    expect(prop.querySelector('.field')).toBeTruthy();
  });

  test('Select rendered', () => {
    const prop = view.el;
    expect(prop.querySelector('select')).toBeTruthy();
  });

  test('Options rendered', () => {
    const select = view.el.querySelector('select')!;
    expect(select.children.length).toEqual(options.length);
  });

  test('Options rendered correctly', () => {
    const select = view.el.querySelector('select')!;
    const children = select.children;
    expect((children[0] as any).value).toEqual(options[0].id);
    expect((children[1] as any).value).toEqual(options[1].id);
    expect(children[0].textContent).toEqual(options[0].id);
    expect(children[1].textContent).toEqual(options[1].id);
    expect(children[0].getAttribute('style')).toEqual(options[0].style);
    expect(children[1].getAttribute('style')).toEqual(null);
  });

  test('Input should exist', () => {
    expect(view.input).toBeTruthy();
  });

  test('Input value is empty', () => {
    expect(view.model.get('value')).toBeFalsy();
  });

  test('Update model on input change', () => {
    view.getInputEl().value = propValue;
    view.inputValueChanged({
      target: { value: propValue },
      stopPropagation() {},
    });
    expect(view.model.get('value')).toEqual(propValue);
  });

  test('Update input on value change', (done) => {
    view.model.set('value', propValue);
    setTimeout(() => {
      expect(view.getInputEl().value).toEqual(propValue);
      done();
    }, 11);
  });

  describe('Init property', () => {
    beforeEach(() => {
      component = new Component({}, compOpts);
      model = new Property({
        type: 'select',
        list: options,
        defaults: defValue,
        property: propName,
      });
      view = new PropertySelectView({
        model,
      });
      fixtures.innerHTML = '';
      view.render();
      fixtures.appendChild(view.el);
    });

    test('Value as default', () => {
      expect(view.model.getValue()).toEqual(defValue);
    });

    test('Empty value as default', () => {
      options = [
        { value: '', name: 'test' },
        { value: 'test1value', name: 'test1' },
        { value: 'test2value', name: 'test2' },
        { value: '', name: 'TestDef' },
      ];
      component = new Component({}, compOpts);
      model = new Property({
        type: 'select',
        list: options,
        defaults: '',
        property: 'emptyDefault',
      });
      view = new PropertySelectView({
        model,
      });
      view.render();
      fixtures.innerHTML = '';
      fixtures.appendChild(view.el);
      expect(view.getInputEl().value).toEqual('');
    });

    test('Input value is as default', () => {
      expect(view.model.getDefaultValue()).toEqual(defValue);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: PropertyStackView.ts]---
Location: grapesjs-dev/packages/core/test/specs/style_manager/view/PropertyStackView.ts

```typescript
import PropertyStackView from '../../../../src/style_manager/view/PropertyStackView';
import PropertyStack from '../../../../src/style_manager/model/PropertyStack';
import Component from '../../../../src/dom_components/model/Component';
import Editor from '../../../../src/editor/model/Editor';
import DomComponents from '../../../../src/dom_components';

describe('PropertyStackView', () => {
  let em: Editor;
  let dcomp: Editor['Components'];
  let compOpts: any;
  let component: Component;
  let fixtures: HTMLElement;
  let target: Component;
  let model: PropertyStack;
  let view: PropertyStackView;
  const propName = 'testprop';
  const properties = [
    { property: 'subprop1' },
    {
      type: 'integer',
      property: 'subprop2',
      defaults: '0',
      units: ['%', 'px'],
    },
    {
      type: 'select',
      property: 'subprop3',
      defaults: 'val2',
      list: [{ value: 'val1' }, { value: 'val2' }, { value: 'val3' }],
    },
  ];

  beforeEach(() => {
    em = new Editor({});
    dcomp = new DomComponents(em);
    compOpts = { em, componentTypes: dcomp.componentTypes };
    target = new Component({}, compOpts);
    component = new Component({}, compOpts);
    model = new PropertyStack({
      type: 'stack',
      property: propName,
      properties,
    });
    view = new PropertyStackView({
      model,
    });
    document.body.innerHTML = '<div id="fixtures"></div>';
    fixtures = document.body.firstChild as HTMLElement;
    view.render();
    fixtures.appendChild(view.el);
  });

  afterEach(() => {
    em.destroy();
  });

  test('Rendered correctly', () => {
    const prop = view.el;
    expect(fixtures.querySelector('.property')).toBeTruthy();
    expect(prop.querySelector('.label')).toBeTruthy();
    expect(prop.querySelector('.field')).toBeTruthy();
    expect(prop.querySelector('#add')).toBeTruthy();
  });

  test('Layers rendered', () => {
    expect(view.el.querySelector('.layers')).toBeTruthy();
  });

  test('Layers wrapper should exist', () => {
    expect(view.el.querySelector('[data-layers-wrapper]')).toBeTruthy();
  });

  test('Layers rendered correctly', () => {
    const children = view.el.querySelector('[data-layers-wrapper]')!.children;
    expect(children.length).toEqual(1);
  });

  test('Layers container is empty', () => {
    const layers = view.el.querySelector('.layers')!;
    expect(layers.innerHTML).toBeFalsy();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: PropertyView.ts]---
Location: grapesjs-dev/packages/core/test/specs/style_manager/view/PropertyView.ts

```typescript
import PropertyView from '../../../../src/style_manager/view/PropertyView';
import Property from '../../../../src/style_manager/model/Property';
import Editor from '../../../../src/editor/model/Editor';
import Component from '../../../../src/dom_components/model/Component';

describe('PropertyView', () => {
  let em: Editor;
  let dcomp: Editor['Components'];
  let compOpts: any;
  var component: Component;
  var fixtures: HTMLElement;
  var target: Component;
  var model: Property;
  var view: PropertyView;
  var propName = 'testprop';
  var propValue = 'testvalue';
  var defValue = 'testDefault';

  beforeEach(() => {
    em = new Editor({});
    dcomp = em.Components;
    compOpts = { em, componentTypes: dcomp.componentTypes };
    target = new Component({}, compOpts);
    component = new Component({}, compOpts);
    model = new Property({ property: propName }, { em });
    view = new PropertyView({
      model,
      config: { em },
    });
    document.body.innerHTML = '<div id="fixtures"></div>';
    fixtures = document.body.firstChild as HTMLElement;
    view.render();
    fixtures.appendChild(view.el);
  });

  afterEach(() => {
    em.destroy();
  });

  test('Rendered correctly', () => {
    var prop = view.el;
    expect(fixtures.querySelector('.property')).toBeTruthy();
    expect(prop.querySelector('.label')).toBeTruthy();
    expect(prop.querySelector('.field')).toBeTruthy();
  });

  test('Input should exist', () => {
    expect(view.getInputEl()).toBeTruthy();
  });

  test('Input value is empty', () => {
    expect(view.model.get('value')).toBeFalsy();
    expect(view.getInputEl().value).toBeFalsy();
  });

  test('Model not change without update trigger', () => {
    view.getInputEl().value = propValue;
    expect(view.model.get('value')).toBeFalsy();
  });

  test('Update model on input change', () => {
    view.getInputEl().value = propValue;
    view.inputValueChanged({
      target: { value: propValue },
      stopPropagation() {},
    });
    expect(view.model.get('value')).toEqual(propValue);
  });

  test('Update input on value change', (done) => {
    view.model.set('value', propValue);
    setTimeout(() => {
      expect(view.getInputEl().value).toEqual(propValue);
      done();
    }, 15);
  });

  describe('Init property', () => {
    beforeEach(() => {
      em = new Editor({});
      component = new Component({}, { em, config: em.Components.config });
      model = new Property({
        property: propName,
        default: defValue,
      });
      view = new PropertyView({
        model,
      });
      fixtures.innerHTML = '';
      view.render();
      fixtures.appendChild(view.el);
    });

    test('Value as default', () => {
      expect(view.model.getValue()).toEqual(defValue);
    });

    test('Placeholder as default', () => {
      var input = view.getInputEl();
      expect(input.getAttribute('placeholder')).toEqual(defValue);
    });

    test('Input value is set up to default', () => {
      expect(view.getInputEl().value).toEqual(defValue);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: SectorsView.ts]---
Location: grapesjs-dev/packages/core/test/specs/style_manager/view/SectorsView.ts

```typescript
import SectorsView from '../../../../src/style_manager/view/SectorsView';
import Sectors from '../../../../src/style_manager/model/Sectors';

describe('SectorsView', () => {
  let fixtures: HTMLElement;
  let model: Sectors;
  let view: SectorsView;

  beforeEach(() => {
    model = new Sectors([]);
    view = new SectorsView({
      collection: model,
    });
    document.body.innerHTML = '<div id="fixtures"></div>';
    fixtures = document.body.firstChild as HTMLElement;
    fixtures.appendChild(view.render().el);
  });

  afterEach(() => {
    view.collection.reset();
  });

  test('Collection is empty', () => {
    expect(view.el.innerHTML).toEqual('');
  });

  test('Add new sectors', () => {
    view.collection.add([{}, {}]);
    expect(view.el.children.length).toEqual(2);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: SectorView.ts]---
Location: grapesjs-dev/packages/core/test/specs/style_manager/view/SectorView.ts

```typescript
import SectorView from '../../../../src/style_manager/view/SectorView';
import Sector from '../../../../src/style_manager/model/Sector';

describe('SectorView', () => {
  let fixtures: HTMLElement;
  let model: Sector;
  let view: SectorView;

  beforeEach(() => {
    model = new Sector({ name: 'sector' });
    view = new SectorView({ model, config: {} });
    document.body.innerHTML = '<div id="fixtures"></div>';
    fixtures = document.body.querySelector('#fixtures') as HTMLElement;
    fixtures.appendChild(view.render().el);
  });

  afterEach(() => {
    view.remove();
  });

  test('Rendered correctly', () => {
    const sector = view.el;
    expect(sector.querySelector('[data-sector-title]')).toBeTruthy();
    const props = sector.querySelector('.properties');
    expect(props).toBeTruthy();
    expect(sector.classList.contains('open')).toEqual(true);
  });

  test('No properties', () => {
    const props = view.el.querySelector('.properties')!;
    expect(props.innerHTML).toEqual('');
  });

  test('Update on open', () => {
    const sector = view.el;
    const props = sector.querySelector<HTMLElement>('.properties')!;
    model.set('open', false);
    expect(sector.classList.contains('open')).toEqual(false);
    expect(props.style.display).toEqual('none');
  });

  test('Toggle on click', () => {
    const sector = view.el;
    view.$el.find('[data-sector-title]').click();
    expect(sector.classList.contains('open')).toEqual(false);
  });

  describe('Init with options', () => {
    beforeEach(() => {
      model = new Sector({
        open: false,
        name: 'TestName',
        properties: [{ type: 'integer' }, { type: 'integer' }, { type: 'integer' }],
      });
      view = new SectorView({ model, config: {} });
      document.body.innerHTML = '<div id="fixtures"></div>';
      fixtures = document.body.querySelector('#fixtures') as HTMLElement;
      fixtures.appendChild(view.render().el);
    });

    test('Rendered correctly', () => {
      const sector = view.el;
      const props = sector.querySelector('.properties') as HTMLElement;
      expect(sector.querySelector('[data-sector-title]')!.innerHTML).toContain('TestName');
      expect(props).toBeTruthy();
      expect(sector.classList.contains('open')).toEqual(false);
      expect(props.style.display).toEqual('none');
    });

    test('Has properties', () => {
      const props = view.el.querySelector('.properties') as HTMLElement;
      expect(props.children.length).toEqual(3);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: grapesjs-dev/packages/core/test/specs/trait_manager/index.ts

```typescript
import Editor from '../../../src/editor/model/Editor';
import TraitManager from '../../../src/trait_manager';

describe('TraitManager', () => {
  let em: Editor;
  let tm: TraitManager;

  beforeEach(() => {
    em = new Editor({
      mediaCondition: 'max-width',
      avoidInlineStyle: true,
    });
    tm = em.Traits;
    // em.Pages.onLoad();
  });

  afterEach(() => {
    em.destroy();
  });

  test('TraitManager exists', () => {
    expect(tm).toBeTruthy();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: TraitsModel.ts]---
Location: grapesjs-dev/packages/core/test/specs/trait_manager/model/TraitsModel.ts

```typescript
import Trait from '../../../../src/trait_manager/model/Trait';
import Traits from '../../../../src/trait_manager/model/Traits';
import Component from '../../../../src/dom_components/model/Component';
import Editor from '../../../../src/editor';
import EditorModel from '../../../../src/editor/model/Editor';

describe('TraitModels', () => {
  var trait: Trait;
  var target: Component;
  var modelName = 'title';
  var em: EditorModel;

  beforeEach(() => {
    em = new Editor().getModel();
    target = new Component({}, { em, config: em.Components.config });
    trait = new Trait(
      {
        name: modelName,
        target,
      },
      em,
    );
  });

  afterEach(() => {});

  test('Object exists', () => {
    expect(trait).toBeTruthy();
  });
  test('Traits undo property', () => {
    em.loadOnStart();
    const wrapper = em.Components.getWrapper();
    wrapper!.append(target);
    const traits = new Traits([], { em });
    traits.add(modelName);
    traits.setTarget(target);
    const trait = traits.models[0];
    trait.setTargetValue('TitleValue');

    expect(target.getAttributes()[modelName]).toBe('TitleValue');
    em.UndoManager.undo();
    expect(target.getAttributes()[modelName]).toBeUndefined;
  });
});
```

--------------------------------------------------------------------------------

---[FILE: TraitsView.ts]---
Location: grapesjs-dev/packages/core/test/specs/trait_manager/view/TraitsView.ts

```typescript
import Trait from '../../../../src/trait_manager/model/Trait';
import TraitView from '../../../../src/trait_manager/view/TraitView';
import Component from '../../../../src/dom_components/model/Component';
import EditorModel from '../../../../src/editor/model/Editor';
import Editor from '../../../../src/editor';
import { ComponentOptions } from '../../../../src/dom_components/model/types';

describe('TraitView', () => {
  let obj: TraitView;
  let trait: Trait;
  let modelName = 'title';
  let target: Component;
  let em: EditorModel;
  let config: ComponentOptions;

  beforeEach(() => {
    em = new Editor().getModel();
    config = { em, config: em.Components.config };
    target = new Component({}, config);
    trait = new Trait(
      {
        name: modelName,
        target,
      },
      em,
    );
    obj = new TraitView({
      model: trait,
      config,
    });
  });

  afterEach(() => {});

  test('Target has no attributes on init', () => {
    expect(target.get('attributes')).toEqual({});
  });

  test('On update of the value updates the target attributes', () => {
    trait.set('value', 'test');
    const eq = { [modelName]: 'test' };
    expect(target.get('attributes')).toEqual(eq);
  });

  test('Updates on different models do not alter other targets', () => {
    const target1 = new Component({}, config);
    const target2 = new Component({}, config);
    const trait1 = new Trait(
      {
        name: modelName,
        target: target1,
      },
      em,
    );
    const trait2 = new Trait(
      {
        name: modelName,
        target: target2,
      },
      em,
    );
    const obj1 = new TraitView({ model: trait1 });
    const obj2 = new TraitView({ model: trait2 });

    trait1.set('value', 'test1');
    trait2.set('value', 'test2');
    const eq1 = { [modelName]: 'test1' };
    const eq2 = { [modelName]: 'test2' };
    expect(target1.get('attributes')).toEqual(eq1);
    expect(target2.get('attributes')).toEqual(eq2);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: datasources.ts]---
Location: grapesjs-dev/packages/core/test/specs/undo_manager/datasources.ts

```typescript
import { Component, DataSourceManager, Editor } from '../../../src';
import { DataConditionType } from '../../../src/data_sources/model/conditional_variables/DataCondition';
import { StringOperation } from '../../../src/data_sources/model/conditional_variables/operators/StringOperator';
import { DataVariableType } from '../../../src/data_sources/model/DataVariable';
import UndoManager from '../../../src/undo_manager';
import { setupTestEditor } from '../../common';

describe('Undo Manager with Data Binding', () => {
  let editor: Editor;
  let um: UndoManager;
  let wrapper: Component;
  let dsm: DataSourceManager;

  const makeColorVar = () => ({
    type: DataVariableType,
    path: 'ds1.rec1.color',
  });
  const makeTitleVar = () => ({
    type: DataVariableType,
    path: 'ds1.rec1.title',
  });
  const makeContentVar = () => ({
    type: DataVariableType,
    path: 'ds1.rec1.content',
  });

  beforeEach(() => {
    ({ editor, um, dsm } = setupTestEditor({ withCanvas: true }));
    wrapper = editor.getWrapper()!;
    dsm.add({
      id: 'ds1',
      records: [{ id: 'rec1', color: 'red', title: 'Initial Title', content: 'Initial Content' }],
    });
    jest.useFakeTimers();
  });

  afterEach(() => {
    editor.destroy();
  });

  describe('Initial State with Data Binding', () => {
    it('should correctly initialize with a component having data-bound properties', () => {
      const component = wrapper.append({
        style: { color: makeColorVar() },
        attributes: { title: makeTitleVar() },
        content: makeContentVar(),
      })[0];

      expect(um.getStackGroup()).toHaveLength(1);
      um.undo();
      um.redo();
      expect(component.getStyle().color).toBe('red');
      expect(component.getAttributes().title).toBe('Initial Title');
      expect(component.get('content')).toBe('Initial Content');
      expect(um.getStackGroup()).toHaveLength(1);
    });
  });

  describe('Core Undo/Redo on Component Data Binding', () => {
    describe('Styles', () => {
      it('should undo and redo the assignment of a data value to a style', () => {
        const component = wrapper.append({
          content: makeContentVar(),
          style: { color: 'blue', 'font-size': '12px' },
        })[0];

        jest.runAllTimers();
        um.clear();
        component.setStyle({ color: makeColorVar() });
        expect(component.getStyle().color).toBe('red');
        expect(component.getStyle({ skipResolve: true }).color).toEqual(makeColorVar());

        um.undo();
        expect(component.getStyle().color).toBe('blue');
        expect(component.getStyle({ skipResolve: true }).color).toBe('blue');

        um.redo();
        expect(component.getStyle().color).toBe('red');
        expect(component.getStyle({ skipResolve: true }).color).toEqual(makeColorVar());
      });

      it('should handle binding with a data-condition value', () => {
        const component = wrapper.append({ content: 'some content', style: { color: 'blue' } })[0];
        const conditionVar = {
          type: DataConditionType,
          condition: { left: makeTitleVar(), operator: StringOperation.contains, right: 'Initial' },
          ifTrue: 'green',
          ifFalse: 'purple',
        };

        jest.runAllTimers();
        um.clear();

        component.addStyle({ color: conditionVar });
        expect(component.getStyle().color).toBe('green');

        um.undo();
        expect(component.getStyle().color).toBe('blue');

        um.redo();
        expect(component.getStyle().color).toBe('green');
      });
    });

    describe('Attributes', () => {
      it('should undo and redo the assignment of a data value to an attribute', () => {
        const component = wrapper.append({ attributes: { title: 'Static Title' } })[0];

        jest.runAllTimers();
        um.clear();

        component.setAttributes({ title: makeTitleVar() });
        expect(component.getAttributes().title).toBe('Initial Title');

        um.undo();
        expect(component.getAttributes().title).toBe('Static Title');

        um.redo();
        expect(component.getAttributes().title).toBe('Initial Title');
      });
    });

    describe('Properties', () => {
      it('should undo and redo the assignment of a data value to a property', () => {
        const component = wrapper.append({ content: 'Static Content' })[0];

        jest.runAllTimers();
        um.clear();

        component.set({ content: makeContentVar() });
        expect(component.get('content')).toBe('Initial Content');

        um.undo();
        expect(component.get('content')).toBe('Static Content');

        um.redo();
        expect(component.get('content')).toBe('Initial Content');
      });
    });
  });

  describe('Value Overwriting Scenarios', () => {
    it('should correctly undo a static style that overwrites a data binding', () => {
      const component = wrapper.append({
        style: { color: makeColorVar() },
        attributes: { title: 'Static Title' },
      })[0];

      jest.runAllTimers();
      um.clear();

      component.addStyle({ color: 'green' });
      expect(component.getStyle().color).toBe('green');

      um.undo();
      expect(component.getStyle().color).toBe('red');
      expect(component.getAttributes().title).toBe('Static Title');
    });

    it('should correctly undo a data binding that overwrites a static style', () => {
      const component = wrapper.append({ style: { color: 'green' } })[0];

      jest.runAllTimers();
      um.clear();

      component.addStyle({ color: makeColorVar() });
      expect(component.getStyle().color).toBe('red');

      um.undo();
      expect(component.getStyle().color).toBe('green');
    });
  });

  describe('Listeners & Data Source Integrity', () => {
    it('should maintain listeners after a binding is restored via undo', () => {
      const component = wrapper.append({ style: { color: makeColorVar() } })[0];

      jest.runAllTimers();
      um.clear();

      component.addStyle({ color: 'green' });
      expect(component.getStyle().color).toBe('green');

      um.undo();
      expect(component.getStyle().color).toBe('red');

      dsm.get('ds1').getRecord('rec1')!.set('color', 'purple');
      expect(component.getStyle().color).toBe('purple');
    });

    it('should handle undo when the data source has been removed', () => {
      const component = wrapper.append({ style: { color: makeColorVar() } })[0];
      expect(component.getStyle().color).toBe('red');

      jest.runAllTimers();
      um.clear();

      dsm.remove('ds1');
      expect(component.getStyle().color).toBeUndefined();

      um.undo();
      expect(dsm.get('ds1')).toBeTruthy();
      expect(component.getStyle().color).toBe('red');
    });
  });

  describe('Serialization & Cloning', () => {
    let component: any;

    beforeEach(() => {
      component = wrapper.append({
        style: { color: makeColorVar() },
        attributes: { title: makeTitleVar() },
        content: makeContentVar(),
      })[0];
    });

    it('should correctly serialize data bindings in toJSON()', () => {
      const json = component.toJSON();
      expect(json.attributes.title).toEqual(makeTitleVar());
      expect(json.__dynamicProps).toBeUndefined();
    });

    it('should correctly clone data bindings', () => {
      const clone = component.clone();
      expect(clone.getStyle('', { skipResolve: true }).color).toEqual(makeColorVar());
      expect(clone.getAttributes({ skipResolve: true }).title).toEqual(makeTitleVar());
      expect(clone.get('content', { skipResolve: true })).toEqual(makeContentVar());
      expect(clone.getStyle().color).toBe('red');
    });

    it('should ensure a cloned component has an independent undo history', () => {
      const clone = component.clone();
      wrapper.append(clone);

      jest.runAllTimers();
      um.clear();

      component.addStyle({ color: 'blue' });
      expect(um.hasUndo()).toBe(true);
      expect(clone.getStyle().color).toBe('red');

      um.undo();
      expect(component.getStyle().color).toBe('red');
      expect(clone.getStyle().color).toBe('red');
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: grapesjs-dev/packages/core/test/specs/undo_manager/index.ts

```typescript
import UndoManager from '../../../src/undo_manager';
import Editor from '../../../src/editor';
import { setupTestEditor } from '../../common';

describe('Undo Manager', () => {
  let editor: Editor;
  let um: UndoManager;
  let wrapper: any;

  beforeEach(() => {
    ({ editor, um } = setupTestEditor({
      withCanvas: true,
    }));
    wrapper = editor.getWrapper();
    um.clear();
  });

  afterEach(() => {
    editor.destroy();
  });

  test('Initial state is correct', () => {
    expect(um.hasUndo()).toBe(false);
    expect(um.hasRedo()).toBe(false);
    expect(um.getStack()).toHaveLength(0);
  });

  describe('Component changes', () => {
    test('Add component', () => {
      expect(wrapper.components()).toHaveLength(0);
      wrapper.append('<div></div>');
      expect(wrapper.components()).toHaveLength(1);
      expect(um.hasUndo()).toBe(true);

      um.undo();
      expect(wrapper.components()).toHaveLength(0);
      expect(um.hasRedo()).toBe(true);

      um.redo();
      expect(wrapper.components()).toHaveLength(1);
    });

    test('Remove component', () => {
      const comp = wrapper.append('<div></div>')[0];
      expect(wrapper.components()).toHaveLength(1);
      um.clear();

      comp.remove();
      expect(wrapper.components()).toHaveLength(0);
      expect(um.hasUndo()).toBe(true);

      um.undo();
      expect(wrapper.components()).toHaveLength(1);
      expect(um.hasRedo()).toBe(true);

      um.redo();
      expect(wrapper.components()).toHaveLength(0);
    });

    test('Modify component properties', () => {
      const comp = wrapper.append({ tagName: 'div', content: 'test' })[0];
      um.clear();

      comp.set('content', 'test2');
      expect(comp.get('content')).toBe('test2');
      expect(um.hasUndo()).toBe(true);

      um.undo();
      expect(comp.get('content')).toBe('test');

      um.redo();
      expect(comp.get('content')).toBe('test2');
    });

    test('Modify component style (StyleManager)', () => {
      const comp = wrapper.append('<div></div>')[0];

      um.clear();
      comp.addStyle({ color: 'red' });
      expect(comp.getStyle().color).toBe('red');
      expect(um.hasUndo()).toBe(true);

      um.undo();
      expect(comp.getStyle().color).toBeUndefined();

      um.redo();
      expect(comp.getStyle().color).toBe('red');
    });

    test('Move component', () => {
      wrapper.append('<div>1</div><div>2</div>');
      const comp1 = wrapper.components().at(0);
      const comp2 = wrapper.components().at(1);

      um.clear();

      wrapper.append(comp1, { at: 2 });
      expect(wrapper.components().at(0)).toBe(comp2);
      expect(wrapper.components().at(1)).toBe(comp1);
      expect(um.hasUndo()).toBe(true);

      um.undo();
      expect(wrapper.components().at(0)).toBe(comp1);
      expect(wrapper.components().at(1)).toBe(comp2);

      um.redo();
      expect(wrapper.components().at(0)).toBe(comp2);
      expect(wrapper.components().at(1)).toBe(comp1);
    });

    test('Grouped component additions are treated as one undo action', () => {
      wrapper.append('<div>1</div><div>2</div>');

      expect(wrapper.components()).toHaveLength(2);
      expect(um.getStackGroup()).toHaveLength(1);

      um.undo();
      expect(wrapper.components()).toHaveLength(0);
    });
  });

  describe('CSS Rule changes', () => {
    test('Add CSS Rule', () => {
      editor.Css.addRules('.test { color: red; }');

      expect(editor.Css.getRules('.test')).toHaveLength(1);

      expect(um.hasUndo()).toBe(true);

      um.undo();
      expect(editor.Css.getRules('.test')).toHaveLength(0);

      um.redo();
      expect(editor.Css.getRules('.test')).toHaveLength(1);
      expect(editor.Css.getRule('.test')?.getStyle().color).toBe('red');
    });

    test('Modify CSS Rule', () => {
      const rule = editor.Css.addRules('.test { color: red; }')[0];

      um.clear();

      rule.setStyle({ color: 'blue' });
      expect(rule.getStyle().color).toBe('blue');
      expect(um.hasUndo()).toBe(true);

      um.undo();
      expect(rule.getStyle().color).toBe('red');

      um.redo();
      expect(rule.getStyle().color).toBe('blue');
    });

    test('Remove CSS Rule', () => {
      const rule = editor.Css.addRules('.test { color: red; }')[0];

      um.clear();

      editor.Css.remove(rule);
      expect(editor.Css.getRules('.test')).toHaveLength(0);
      expect(um.hasUndo()).toBe(true);

      um.undo();
      expect(editor.Css.getRules('.test')).toHaveLength(1);

      um.redo();
      expect(editor.Css.getRules('.test')).toHaveLength(0);
    });
  });

  // TODO: add undo_manager to asset manager
  describe.skip('Asset Manager changes', () => {
    test('Add asset', () => {
      const am = editor.Assets;
      expect(am.getAll()).toHaveLength(0);

      um.clear();

      am.add('path/to/img.jpg');
      expect(am.getAll()).toHaveLength(1);
      expect(um.hasUndo()).toBe(true);

      um.undo();
      expect(am.getAll()).toHaveLength(0);

      um.redo();
      expect(am.getAll()).toHaveLength(1);
      expect(am.get('path/to/img.jpg')).toBeTruthy();
    });

    test('Remove asset', () => {
      const am = editor.Assets;
      const asset = am.add('path/to/img.jpg');
      expect(am.getAll()).toHaveLength(1);

      um.clear();

      am.remove(asset);
      expect(am.getAll()).toHaveLength(0);
      expect(um.hasUndo()).toBe(true);

      um.undo();
      expect(am.getAll()).toHaveLength(1);

      um.redo();
      expect(am.getAll()).toHaveLength(0);
    });
  });

  // TODO: add undo_manager to editor
  describe.skip('Editor states changes', () => {
    test('Device change', () => {
      editor.Devices.add({ id: 'tablet', name: 'Tablet', width: 'auto' });

      um.clear();

      editor.setDevice('Tablet');
      expect(editor.getDevice()).toBe('Tablet');
      expect(um.hasUndo()).toBe(true);

      um.undo();
      // Default device is an empty string
      expect(editor.getDevice()).toBe('');

      um.redo();
      expect(editor.getDevice()).toBe('Tablet');
    });

    test('Panel visibility change', () => {
      const panel = editor.Panels.getPanel('options')!;
      panel.set('visible', true);

      um.clear();

      panel.set('visible', false);
      expect(panel.get('visible')).toBe(false);
      expect(um.hasUndo()).toBe(true);

      um.undo();
      expect(panel.get('visible')).toBe(true);

      um.redo();
      expect(panel.get('visible')).toBe(false);
    });
  });

  describe('Selection tracking', () => {
    test('Change selection', (done) => {
      const comp1 = wrapper.append('<div>1</div>')[0];
      const comp2 = wrapper.append('<div>2</div>')[0];

      um.clear();
      editor.select(comp1);
      expect(editor.getSelected()).toBe(comp1);

      setTimeout(() => {
        editor.select(comp2);
        expect(editor.getSelected()).toBe(comp2);
        expect(um.hasUndo()).toBe(true);
        um.undo();
        expect(editor.getSelected()).toBe(comp1);
        um.redo();
        expect(editor.getSelected()).toBe(comp2);
        done();
      });
    });
  });

  describe('Operations with `noUndo`', () => {
    test('Skipping undo for component modification', () => {
      const comp = wrapper.append('<div></div>')[0];

      um.clear();

      comp.set('content', 'no undo content', { noUndo: true });
      expect(um.hasUndo()).toBe(false);

      wrapper.append('<div>undo this</div>');
      expect(um.hasUndo()).toBe(true);

      um.undo();
      expect(wrapper.components()).toHaveLength(1);
      expect(wrapper.components().at(0).get('content')).toBe('no undo content');
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: Mixins.ts]---
Location: grapesjs-dev/packages/core/test/specs/utils/Mixins.ts

```typescript
import { buildBase64UrlFromSvg } from '../../../src/utils/mixins';

describe('.buildBase64UrlFromSvg', () => {
  it('returns original when a none svg is provided', () => {
    const input = 'something else';
    expect(buildBase64UrlFromSvg(input)).toEqual(input);
  });

  it('returns base64 image when an svg is provided', () => {
    const input = `<svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>`;

    const output =
      // eslint-disable-next-line max-len
      'data:image/svg+xml;base64,PHN2ZwogICAgICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgICAgIHdpZHRoPSIyNCIKICAgICAgaGVpZ2h0PSIyNCIKICAgICAgdmlld0JveD0iMCAwIDI0IDI0IgogICAgICBmaWxsPSJub25lIgogICAgICBzdHJva2U9ImN1cnJlbnRDb2xvciIKICAgICAgc3Ryb2tlLXdpZHRoPSIyIgogICAgICBzdHJva2UtbGluZWNhcD0icm91bmQiCiAgICAgIHN0cm9rZS1saW5lam9pbj0icm91bmQiCiAgICA+CiAgICAgIDxwb2x5Z29uIHBvaW50cz0iMSA2IDEgMjIgOCAxOCAxNiAyMiAyMyAxOCAyMyAyIDE2IDYgOCAyIDEgNiIgLz4KICAgICAgPGxpbmUgeDE9IjgiIHkxPSIyIiB4Mj0iOCIgeTI9IjE4IiAvPgogICAgICA8bGluZSB4MT0iMTYiIHkxPSI2IiB4Mj0iMTYiIHkyPSIyMiIgLz4KICAgIDwvc3ZnPg==';
    expect(buildBase64UrlFromSvg(input)).toEqual(output);
  });
});
```

--------------------------------------------------------------------------------

````
