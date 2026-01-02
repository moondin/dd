---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 78
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 78 of 97)

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

---[FILE: attributes.ts]---
Location: grapesjs-dev/packages/core/test/specs/data_sources/dynamic_values/attributes.ts
Signals: TypeORM

```typescript
import Editor from '../../../../src/editor/model/Editor';
import DataSourceManager from '../../../../src/data_sources';
import ComponentWrapper from '../../../../src/dom_components/model/ComponentWrapper';
import { DataVariableType } from '../../../../src/data_sources/model/DataVariable';
import { setupTestEditor } from '../../../common';
import { Component } from '../../../../src';

const staticAttributeValue = 'some tiltle';
describe('Dynamic Attributes', () => {
  let em: Editor;
  let dsm: DataSourceManager;
  let cmpRoot: ComponentWrapper;
  const staticAttributes = {
    staticAttribute: staticAttributeValue,
  };

  beforeEach(() => {
    ({ em, dsm, cmpRoot } = setupTestEditor());
  });

  afterEach(() => {
    em.destroy();
  });

  test('static and dynamic attributes', () => {
    const inputDataSource = {
      id: 'ds_id',
      records: [{ id: 'id1', value: 'test-value' }],
    };
    dsm.add(inputDataSource);

    const attributes = {
      ...staticAttributes,
      dynamicAttribute: {
        type: DataVariableType,
        defaultValue: 'default',
        path: 'ds_id.id1.value',
      },
    };
    const cmp = cmpRoot.append({
      tagName: 'input',
      attributes,
    })[0];

    testAttribute(cmp, 'dynamicAttribute', 'test-value');
    testStaticAttributes(cmp);
  });

  test('dynamic attributes should listen to change', () => {
    const dataSource = {
      id: 'ds_id',
      records: [{ id: 'id1', value: 'test-value' }],
    };
    dsm.add(dataSource);

    const attributes = {
      ...staticAttributes,
      dynamicAttribute: {
        type: DataVariableType,
        defaultValue: 'default',
        path: 'ds_id.id1.value',
      },
    };
    const cmp = cmpRoot.append({
      tagName: 'input',
      attributes,
    })[0];

    testAttribute(cmp, 'dynamicAttribute', 'test-value');
    testStaticAttributes(cmp);

    changeDataSourceValue(dsm, 'id1');
    testAttribute(cmp, 'dynamicAttribute', 'changed-value');
  });

  test('(Component.setAttributes) dynamic attributes should listen to the latest dynamic value', () => {
    const dataSource = {
      id: 'ds_id',
      records: [
        { id: 'id1', value: 'test-value' },
        { id: 'id2', value: 'second-test-value' },
      ],
    };
    dsm.add(dataSource);

    const attributes = {
      ...staticAttributes,
      dynamicAttribute: {
        type: DataVariableType,
        defaultValue: 'default',
        path: 'ds_id.id1.value',
      },
    };
    const cmp = cmpRoot.append({
      tagName: 'input',
      attributes,
    })[0];

    cmp.setAttributes({ dynamicAttribute: 'some-static-value' });
    testAttribute(cmp, 'dynamicAttribute', 'some-static-value');

    cmp.setAttributes({
      dynamicAttribute: {
        type: DataVariableType,
        defaultValue: 'default',
        path: 'ds_id.id2.value',
      },
    });
    changeDataSourceValue(dsm, 'id1');
    testAttribute(cmp, 'dynamicAttribute', 'second-test-value');

    changeDataSourceValue(dsm, 'id2');
    testAttribute(cmp, 'dynamicAttribute', 'changed-value');
  });

  test('(Component.addAttributes) dynamic attributes should listen to the latest dynamic value', () => {
    const dataSource = {
      id: 'ds_id',
      records: [
        { id: 'id1', value: 'test-value' },
        { id: 'id2', value: 'second-test-value' },
      ],
    };
    dsm.add(dataSource);

    const attributes = {
      ...staticAttributes,
      dynamicAttribute: {
        type: DataVariableType,
        defaultValue: 'default',
        path: 'ds_id.id1.value',
      },
    };
    const cmp = cmpRoot.append({
      tagName: 'input',
      attributes,
    })[0];

    cmp.addAttributes({ dynamicAttribute: 'some-static-value' });
    testAttribute(cmp, 'dynamicAttribute', 'some-static-value');

    cmp.addAttributes({
      dynamicAttribute: {
        type: DataVariableType,
        defaultValue: 'default',
        path: 'ds_id.id2.value',
      },
    });
    changeDataSourceValue(dsm, 'id1');
    testAttribute(cmp, 'dynamicAttribute', 'second-test-value');

    changeDataSourceValue(dsm, 'id2');
    testAttribute(cmp, 'dynamicAttribute', 'changed-value');
  });

  test('dynamic attributes should stop listening to change if the value changed to static', () => {
    const dataSource = {
      id: 'ds_id',
      records: [{ id: 'id1', value: 'test-value' }],
    };
    dsm.add(dataSource);

    const attributes = {
      ...staticAttributes,
      dynamicAttribute: {
        type: DataVariableType,
        defaultValue: 'default',
        path: 'ds_id.id1.value',
      },
    };
    const cmp = cmpRoot.append({
      tagName: 'input',
      attributes,
    })[0];

    testAttribute(cmp, 'dynamicAttribute', 'test-value');
    testStaticAttributes(cmp);

    cmp.setAttributes({
      dynamicAttribute: 'static-value',
    });
    changeDataSourceValue(dsm, 'id1');
    testAttribute(cmp, 'dynamicAttribute', 'static-value');
  });

  test('dynamic attributes should start listening to change if the value changed to dynamic value', () => {
    const dataSource = {
      id: 'ds_id',
      records: [{ id: 'id1', value: 'test-value' }],
    };
    dsm.add(dataSource);

    const attributes = {
      ...staticAttributes,
      dynamicAttribute: 'static-value',
    };
    const cmp = cmpRoot.append({
      tagName: 'input',
      attributes,
    })[0];

    cmp.setAttributes({
      dynamicAttribute: {
        type: DataVariableType,
        defaultValue: 'default',
        path: 'ds_id.id1.value',
      },
    });
    testAttribute(cmp, 'dynamicAttribute', 'test-value');
    changeDataSourceValue(dsm, 'id1');
    testAttribute(cmp, 'dynamicAttribute', 'changed-value');
  });

  test('dynamic attributes should stop listening to change if the attribute was removed', () => {
    const dataSource = {
      id: 'ds_id',
      records: [{ id: 'id1', value: 'test-value' }],
    };
    dsm.add(dataSource);

    const attributes = {
      ...staticAttributes,
      dynamicAttribute: {
        type: DataVariableType,
        defaultValue: 'default',
        path: 'ds_id.id1.value',
      },
    };
    const cmp = cmpRoot.append({
      tagName: 'input',
      attributes,
    })[0];

    testAttribute(cmp, 'dynamicAttribute', 'test-value');
    testStaticAttributes(cmp);

    cmp.removeAttributes('dynamicAttribute');
    changeDataSourceValue(dsm, 'id1');
    expect(cmp?.getAttributes()['dynamicAttribute']).toBe(undefined);
    const input = cmp.getEl();
    expect(input?.getAttribute('dynamicAttribute')).toBe(null);
  });

  test('attributes should not collide with styles', () => {
    ({ em, dsm, cmpRoot } = setupTestEditor({ config: { avoidInlineStyle: false } }));
    dsm.add({
      id: 'ds_id',
      records: [
        { id: 'id1', value: 'test-value' },
        { id: 'id2', value: 'second-test-value' },
      ],
    });

    const cmp = cmpRoot.append({
      tagName: 'input',
    })[0];

    cmp.addAttributes({
      static: 'static-value-attr',
      dynamic: {
        type: DataVariableType,
        defaultValue: 'default',
        path: 'ds_id.id1.value',
      },
    });
    cmp.addStyle({
      static: 'static-value-style',
      dynamic: {
        type: DataVariableType,
        defaultValue: 'default',
        path: 'ds_id.id2.value',
      },
    });

    testAttribute(cmp, 'style', 'static:static-value-style;dynamic:second-test-value;');
    testAttribute(cmp, 'dynamic', 'test-value');
    testAttribute(cmp, 'static', 'static-value-attr');

    cmp.addAttributes({
      static: 'static-value-attr-2',
      dynamic: {
        type: DataVariableType,
        defaultValue: 'default',
        path: 'ds_id.id2.value',
      },
    });
    cmp.addStyle({
      static: 'static-value-style-2',
      dynamic: {
        type: DataVariableType,
        defaultValue: 'default',
        path: 'ds_id.id1.value',
      },
    });

    testAttribute(cmp, 'style', 'static:static-value-style-2;dynamic:test-value;');
    testAttribute(cmp, 'dynamic', 'second-test-value');
    testAttribute(cmp, 'static', 'static-value-attr-2');
  });
});

function changeDataSourceValue(dsm: DataSourceManager, id: string) {
  dsm.get('ds_id').getRecord(id)?.set('value', 'intermediate-value1');
  dsm.get('ds_id').getRecord(id)?.set('value', 'intermediate-value2');
  dsm.get('ds_id').getRecord(id)?.set('value', 'changed-value');
}

function testStaticAttributes(cmp: Component) {
  testAttribute(cmp, 'staticAttribute', staticAttributeValue);
}

function testAttribute(cmp: Component, attribute: string, value: string) {
  expect(cmp?.getAttributes()[attribute]).toBe(value);
  const input = cmp.getEl();
  expect(input?.getAttribute(attribute)).toBe(value);
}
```

--------------------------------------------------------------------------------

---[FILE: props.ts]---
Location: grapesjs-dev/packages/core/test/specs/data_sources/dynamic_values/props.ts
Signals: TypeORM

```typescript
import Editor from '../../../../src/editor/model/Editor';
import DataSourceManager from '../../../../src/data_sources';
import ComponentWrapper from '../../../../src/dom_components/model/ComponentWrapper';
import { DataVariableType } from '../../../../src/data_sources/model/DataVariable';
import { setupTestEditor } from '../../../common';

describe('Component Dynamic Properties', () => {
  let em: Editor;
  let dsm: DataSourceManager;
  let cmpRoot: ComponentWrapper;

  beforeEach(() => {
    ({ em, dsm, cmpRoot } = setupTestEditor());
  });

  afterEach(() => {
    em.destroy();
  });

  test('set static and dynamic properties', () => {
    const dataSource = {
      id: 'ds_id',
      records: [{ id: 'id1', value: 'test-value' }],
    };
    dsm.add(dataSource);

    const properties = {
      custom_property: 'static-value',
      content: {
        type: DataVariableType,
        path: 'ds_id.id1.value',
        defaultValue: 'default',
      },
    };

    const cmp = cmpRoot.append({
      tagName: 'div',
      ...properties,
    })[0];

    expect(cmp.get('custom_property')).toBe('static-value');
    expect(cmp.get('content')).toBe('test-value');
  });

  test('dynamic properties respond to data changes', () => {
    const dataSource = {
      id: 'ds_id',
      records: [{ id: 'id1', value: 'initial-value' }],
    };
    dsm.add(dataSource);

    const cmp = cmpRoot.append({
      tagName: 'div',
      content: {
        type: DataVariableType,
        path: 'ds_id.id1.value',
        defaultValue: 'default',
      },
    })[0];

    expect(cmp.get('content')).toBe('initial-value');
    dsm.get('ds_id').getRecord('id1')?.set('value', 'updated-value');
    expect(cmp.get('content')).toBe('updated-value');
  });

  test('setting static values stops dynamic updates', () => {
    const dataSource = {
      id: 'ds_id',
      records: [{ id: 'id1', value: 'dynamic-value' }],
    };
    dsm.add(dataSource);

    const dataVariable = {
      type: DataVariableType,
      path: 'ds_id.id1.value',
      defaultValue: 'default',
    };
    const cmp = cmpRoot.append({
      tagName: 'div',
      content: dataVariable,
    })[0];

    cmp.set('content', 'static-value');
    dsm.get('ds_id').getRecord('id1')?.set('value', 'new-dynamic-value');
    expect(cmp.get('content')).toBe('static-value');

    // @ts-ignore
    cmp.set({ content: dataVariable });
    expect(cmp.get('content')).toBe('new-dynamic-value');
  });

  test('updating to a new dynamic value listens to the new dynamic value only', () => {
    const dataSource = {
      id: 'ds_id',
      records: [
        { id: 'id1', value: 'dynamic-value1' },
        { id: 'id2', value: 'dynamic-value2' },
      ],
    };
    dsm.add(dataSource);

    const cmp = cmpRoot.append({
      tagName: 'div',
      content: {
        type: DataVariableType,
        path: 'ds_id.id1.value',
        defaultValue: 'default',
      },
    })[0];

    cmp.set({
      content: {
        type: DataVariableType,
        path: 'ds_id.id2.value',
        defaultValue: 'default',
      } as any,
    });
    dsm.get('ds_id').getRecord('id1')?.set('value', 'new-dynamic-value1');
    expect(cmp.get('content')).toBe('dynamic-value2');
    dsm.get('ds_id').getRecord('id2')?.set('value', 'new-dynamic-value2');
    expect(cmp.get('content')).toBe('new-dynamic-value2');
  });

  test('unset properties stops dynamic updates', () => {
    const dataSource = {
      id: 'ds_id',
      records: [
        { id: 'id1', value: 'dynamic-value1' },
        { id: 'id2', value: 'dynamic-value2' },
      ],
    };
    dsm.add(dataSource);

    const cmp = cmpRoot.append({
      tagName: 'div',
      custom_property: {
        type: DataVariableType,
        path: 'ds_id.id1.value',
        defaultValue: 'default',
      },
    })[0];

    cmp.unset('custom_property');
    dsm.get('ds_id').getRecord('id1')?.set('value', 'new-dynamic-value');
    expect(cmp.get('custom_property')).toBeUndefined();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: styles.ts]---
Location: grapesjs-dev/packages/core/test/specs/data_sources/dynamic_values/styles.ts

```typescript
import Editor from '../../../../src/editor/model/Editor';
import DataSourceManager from '../../../../src/data_sources';
import ComponentWrapper from '../../../../src/dom_components/model/ComponentWrapper';
import { DataVariableType } from '../../../../src/data_sources/model/DataVariable';
import { setupTestEditor } from '../../../common';

describe('StyleDataVariable', () => {
  let em: Editor;
  let dsm: DataSourceManager;
  let cmpRoot: ComponentWrapper;

  beforeEach(() => {
    ({ em, dsm, cmpRoot } = setupTestEditor());
  });

  afterEach(() => {
    em.destroy();
  });

  test('component initializes with data-variable style', () => {
    const styleDataSource = {
      id: 'colors-data',
      records: [{ id: 'id1', color: 'red' }],
    };
    dsm.add(styleDataSource);

    const initialStyle = {
      color: {
        type: DataVariableType,
        defaultValue: 'black',
        path: 'colors-data.id1.color',
      },
    };

    const cmp = cmpRoot.append({
      tagName: 'h1',
      type: 'text',
      content: 'Hello World',
      style: initialStyle,
    })[0];

    const style = cmp.getStyle();
    expect(style).toHaveProperty('color', 'red');
  });

  test('component updates on style change', () => {
    const styleDataSource = {
      id: 'colors-data',
      records: [{ id: 'id1', color: 'red' }],
    };
    dsm.add(styleDataSource);

    const cmp = cmpRoot.append({
      tagName: 'h1',
      type: 'text',
      content: 'Hello World',
      style: {
        color: {
          type: DataVariableType,
          defaultValue: 'black',
          path: 'colors-data.id1.color',
        },
      },
    })[0];

    const style = cmp.getStyle();
    expect(style).toHaveProperty('color', 'red');

    const colorsDatasource = dsm.get('colors-data');
    colorsDatasource.getRecord('id1')?.set({ color: 'blue' });

    const updatedStyle = cmp.getStyle();
    expect(updatedStyle).toHaveProperty('color', 'blue');
  });

  test('component updates to defaultValue on record removal', () => {
    const styleDataSource = {
      id: 'colors-data-removal',
      records: [{ id: 'id1', color: 'red' }],
    };
    dsm.add(styleDataSource);

    const cmp = cmpRoot.append({
      tagName: 'h1',
      type: 'text',
      content: 'Hello World',
      style: {
        color: {
          type: DataVariableType,
          defaultValue: 'black',
          path: `${styleDataSource.id}.id1.color`,
        },
      },
    })[0];

    const style = cmp.getStyle();
    expect(style).toHaveProperty('color', 'red');

    const colorsDatasource = dsm.get(styleDataSource.id);
    colorsDatasource.removeRecord('id1');

    const updatedStyle = cmp.getStyle();
    expect(updatedStyle).toHaveProperty('color', 'black');
  });

  test("should use default value if data source doesn't exist", () => {
    const cmp = cmpRoot.append({
      tagName: 'h1',
      type: 'text',
      content: 'Hello World',
      style: {
        color: {
          type: DataVariableType,
          defaultValue: 'black',
          path: 'unknown.id1.color',
        },
      },
    })[0];

    const style = cmp.getStyle();
    expect(style).toHaveProperty('color', 'black');
  });

  test('component initializes and updates with data-variable style for nested object', () => {
    const styleDataSource = {
      id: 'style-data',
      records: [
        {
          id: 'id1',
          nestedObject: {
            color: 'red',
          },
        },
      ],
    };
    dsm.add(styleDataSource);

    const cmp = cmpRoot.append({
      tagName: 'h1',
      type: 'text',
      content: 'Hello World',
      style: {
        color: {
          type: DataVariableType,
          defaultValue: 'black',
          path: 'style-data.id1.nestedObject.color',
        },
      },
    })[0];

    const style = cmp.getStyle();
    expect(style).toHaveProperty('color', 'red');

    const ds = dsm.get('style-data');
    ds.getRecord('id1')?.set({ nestedObject: { color: 'blue' } });

    const updatedStyle = cmp.getStyle();
    expect(updatedStyle).toHaveProperty('color', 'blue');
  });

  describe('Component style manipulations', () => {
    test('adding a new dynamic style with addStyle', () => {
      dsm.add({ id: 'data1', records: [{ id: 'rec1', color: 'red' }] });
      const cmp = cmpRoot.append({
        style: {
          color: { type: DataVariableType, path: 'data1.rec1.color' },
        },
      })[0];
      expect(cmp.getStyle()).toEqual({ color: 'red' });

      dsm.add({ id: 'data2', records: [{ id: 'rec2', width: '100px' }] });
      cmp.addStyle({
        width: { type: DataVariableType, path: 'data2.rec2.width' },
      });

      expect(cmp.getStyle()).toEqual({ color: 'red', width: '100px' });
      dsm.get('data1').getRecord('rec1')?.set({ color: 'blue' });
      expect(cmp.getStyle()).toEqual({ color: 'blue', width: '100px' });
      dsm.get('data2').getRecord('rec2')?.set({ width: '200px' });
      expect(cmp.getStyle()).toEqual({ color: 'blue', width: '200px' });
    });

    test('updating a dynamic style with a static value using setStyle', () => {
      dsm.add({ id: 'data1', records: [{ id: 'rec1', color: 'red' }] });
      const cmp = cmpRoot.append({
        style: {
          color: { type: DataVariableType, path: 'data1.rec1.color' },
          'font-size': '12px',
        },
      })[0];
      expect(cmp.getStyle()).toEqual({ color: 'red', 'font-size': '12px' });

      cmp.setStyle({ color: 'green', 'font-size': '12px' });
      expect(cmp.getStyle()).toEqual({ color: 'green', 'font-size': '12px' });

      // The component should no longer be listening to the data source
      dsm.get('data1').getRecord('rec1')?.set({ color: 'blue' });
      expect(cmp.getStyle()).toEqual({ color: 'green', 'font-size': '12px' });
    });

    test('updating a static style with a dynamic value', () => {
      dsm.add({ id: 'data1', records: [{ id: 'rec1', color: 'red' }] });
      const cmp = cmpRoot.append({ style: { color: 'green' } })[0];
      expect(cmp.getStyle()).toEqual({ color: 'green' });

      cmp.setStyle({
        color: { type: DataVariableType, path: 'data1.rec1.color' },
      });
      expect(cmp.getStyle()).toEqual({ color: 'red' });

      dsm.get('data1').getRecord('rec1')?.set({ color: 'blue' });
      expect(cmp.getStyle()).toEqual({ color: 'blue' });
    });

    test('overwriting a dynamic style with a new dynamic style', () => {
      dsm.add({ id: 'data1', records: [{ id: 'rec1', color: 'red' }] });
      dsm.add({ id: 'data2', records: [{ id: 'rec2', color: 'purple' }] });
      const cmp = cmpRoot.append({
        style: {
          color: { type: DataVariableType, path: 'data1.rec1.color' },
        },
      })[0];
      expect(cmp.getStyle()).toEqual({ color: 'red' });

      cmp.setStyle({
        color: { type: DataVariableType, path: 'data2.rec2.color' },
      });
      expect(cmp.getStyle()).toEqual({ color: 'purple' });

      // Should no longer listen to the old data source
      dsm.get('data1').getRecord('rec1')?.set({ color: 'blue' });
      expect(cmp.getStyle()).toEqual({ color: 'purple' });

      // Should listen to the new data source
      dsm.get('data2').getRecord('rec2')?.set({ color: 'orange' });
      expect(cmp.getStyle()).toEqual({ color: 'orange' });
    });

    test('getting unresolver style values', () => {
      dsm.add({ id: 'data1', records: [{ id: 'rec1', color: 'red', width: '100px' }] });
      const color = { type: DataVariableType, path: 'data1.rec1.color' };
      const cmp = cmpRoot.append({
        style: {
          color,
        },
      })[0];
      expect(cmp.getStyle()).toEqual({ color: 'red' });
      const width = { type: DataVariableType, path: 'data1.rec1.width' };
      cmp.addStyle({ width });

      expect(cmp.getStyle({ skipResolve: true })).toEqual({ color, width });
    });
  });

  describe('.addToCollection', () => {
    test('should add a datavariable to css rule and verify via CssComposer', () => {
      const dsId = 'globalStyles';
      const drId1 = 'red-header';
      const drId2 = 'blue-paragraph';
      const selectorH1 = 'h1';
      const selectorP = 'p';

      dsm.add({
        id: dsId,
        records: [
          { id: drId1, value: 'red' },
          { id: drId2, value: 'blue' },
        ],
      });

      cmpRoot.append([
        { tagName: 'h1', type: 'text', content: 'Hello World' },
        { tagName: 'p', type: 'text', content: 'This is a paragraph.' },
      ]);

      const cssComposer = em.getEditor().CssComposer;
      const initialStyle1 = {
        color: { type: DataVariableType, path: `${dsId}.${drId1}.value` },
      };
      const initialStyle2 = {
        color: { type: DataVariableType, path: `${dsId}.${drId2}.value` },
      };

      const [rule1] = cssComposer.addCollection([{ selectors: [selectorH1], style: initialStyle1 }]);
      const [rule2] = cssComposer.addCollection([{ selectors: [selectorP], style: initialStyle2 }]);

      cssComposer.render();
      const allRules = cssComposer.getAll();

      // Verify initial resolved and unresolved styles
      expect(rule1.getStyle()).toHaveProperty('color', 'red');
      expect(rule2.getStyle()).toHaveProperty('color', 'blue');
      expect(allRules.at(0).getStyle('', { skipResolve: true })).toEqual(initialStyle1);
      expect(allRules.at(1).getStyle('', { skipResolve: true })).toEqual(initialStyle2);

      // Update data source and verify changes
      const ds = dsm.get(dsId);
      ds.getRecord(drId1)?.set({ value: 'purple' });
      ds.getRecord(drId2)?.set({ value: 'orange' });

      expect(rule1.getStyle()).toHaveProperty('color', 'purple');
      expect(allRules.at(1).getStyle()).toHaveProperty('color', 'orange');
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: traits.ts]---
Location: grapesjs-dev/packages/core/test/specs/data_sources/dynamic_values/traits.ts

```typescript
import Editor from '../../../../src/editor/model/Editor';
import DataSourceManager from '../../../../src/data_sources';
import ComponentWrapper from '../../../../src/dom_components/model/ComponentWrapper';
import { DataVariableType } from '../../../../src/data_sources/model/DataVariable';
import { setupTestEditor } from '../../../common';

describe('TraitDataVariable', () => {
  let em: Editor;
  let dsm: DataSourceManager;
  let cmpRoot: ComponentWrapper;

  beforeEach(() => {
    ({ em, dsm, cmpRoot } = setupTestEditor());
  });

  afterEach(() => {
    em.destroy();
  });

  test('set component attribute to trait value if component has no value for the attribute', () => {
    const inputDataSource = {
      id: 'test-input',
      records: [{ id: 'id1', value: 'test-value' }],
    };
    dsm.add(inputDataSource);

    const cmp = cmpRoot.append({
      tagName: 'input',
      traits: [
        'name',
        {
          type: 'text',
          label: 'Value',
          name: 'value',
          value: {
            type: DataVariableType,
            defaultValue: 'default',
            path: `${inputDataSource.id}.id1.value`,
          },
        },
      ],
    })[0];

    const input = cmp.getEl();
    expect(input?.getAttribute('value')).toBe('test-value');
    expect(cmp?.getAttributes().value).toBe('test-value');

    const testDs = dsm.get(inputDataSource.id);
    testDs.getRecord('id1')?.set({ value: 'new-value' });

    expect(input?.getAttribute('value')).toBe('new-value');
    expect(cmp?.getAttributes().value).toBe('new-value');
  });

  test('set component prop to trait value if component has no value for the prop', () => {
    const inputDataSource = {
      id: 'test-input',
      records: [{ id: 'id1', value: 'test-value' }],
    };
    dsm.add(inputDataSource);

    const cmp = cmpRoot.append({
      tagName: 'input',
      traits: [
        'name',
        {
          type: 'text',
          label: 'Value',
          name: 'value',
          changeProp: true,
          value: {
            type: DataVariableType,
            defaultValue: 'default',
            path: `${inputDataSource.id}.id1.value`,
          },
        },
      ],
    })[0];

    expect(cmp?.get('value')).toBe('test-value');

    const testDs = dsm.get(inputDataSource.id);
    testDs.getRecord('id1')?.set({ value: 'new-value' });

    expect(cmp?.get('value')).toBe('new-value');
  });

  test('should keep component prop if component already has a value for the prop', () => {
    const inputDataSource = {
      id: 'test-input',
      records: [{ id: 'id1', value: 'test-value' }],
    };
    dsm.add(inputDataSource);

    const cmp = cmpRoot.append({
      tagName: 'input',
      attributes: {
        value: 'existing-value',
      },
      traits: [
        'name',
        {
          type: 'text',
          label: 'Value',
          name: 'value',
          changeProp: true,
          value: {
            type: DataVariableType,
            defaultValue: 'default',
            path: `${inputDataSource.id}.id1.value`,
          },
        },
      ],
    })[0];

    const input = cmp.getEl();
    expect(input?.getAttribute('value')).toBe('existing-value');
    expect(cmp?.getAttributes().value).toBe('existing-value');

    const testDs = dsm.get(inputDataSource.id);
    testDs.getRecord('id1')?.set({ value: 'new-value' });

    expect(input?.getAttribute('value')).toBe('existing-value');
    expect(cmp?.getAttributes().value).toBe('existing-value');
  });

  test('should keep component prop if component already has a value for the prop', () => {
    const inputDataSource = {
      id: 'test-input',
      records: [{ id: 'id1', value: 'test-value' }],
    };
    dsm.add(inputDataSource);

    const cmp = cmpRoot.append({
      tagName: 'input',
      value: 'existing-value',
      traits: [
        'name',
        {
          type: 'text',
          label: 'Value',
          name: 'value',
          changeProp: true,
          value: {
            type: DataVariableType,
            defaultValue: 'default',
            path: `${inputDataSource.id}.id1.value`,
          },
        },
      ],
    })[0];

    expect(cmp?.get('value')).toBe('existing-value');

    const testDs = dsm.get(inputDataSource.id);
    testDs.getRecord('id1')?.set({ value: 'new-value' });

    expect(cmp?.get('value')).toBe('existing-value');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ComponentDataVariable.getters-setters.ts]---
Location: grapesjs-dev/packages/core/test/specs/data_sources/model/ComponentDataVariable.getters-setters.ts
Signals: TypeORM

```typescript
import { DataSourceManager } from '../../../../src';
import ComponentDataVariable from '../../../../src/data_sources/model/ComponentDataVariable';
import { DataVariableType } from '../../../../src/data_sources/model/DataVariable';
import ComponentWrapper from '../../../../src/dom_components/model/ComponentWrapper';
import EditorModel from '../../../../src/editor/model/Editor';
import { setupTestEditor } from '../../../common';

describe('ComponentDataVariable - setPath and setDefaultValue', () => {
  let em: EditorModel;
  let dsm: DataSourceManager;
  let cmpRoot: ComponentWrapper;

  beforeEach(() => {
    ({ em, dsm, cmpRoot } = setupTestEditor());
    const dataSource = {
      id: 'ds_id',
      records: [
        { id: 'id1', name: 'Name1' },
        { id: 'id2', name: 'Name2' },
      ],
    };

    dsm.add(dataSource);
  });

  afterEach(() => {
    em.destroy();
  });

  test('component updates when path is changed using setPath', () => {
    const cmp = cmpRoot.append({
      type: DataVariableType,
      dataResolver: {
        defaultValue: 'default',
        path: 'ds_id.id1.name',
      },
    })[0] as ComponentDataVariable;

    expect(cmp.getEl()?.innerHTML).toContain('Name1');
    expect(cmp.getPath()).toBe('ds_id.id1.name');

    cmp.setPath('ds_id.id2.name');
    expect(cmp.getEl()?.innerHTML).toContain('Name2');
    expect(cmp.getPath()).toBe('ds_id.id2.name');
  });

  test('component updates when default value is changed using setDefaultValue', () => {
    const cmp = cmpRoot.append({
      type: DataVariableType,
      dataResolver: { defaultValue: 'default', path: 'unknown.id1.name' },
    })[0] as ComponentDataVariable;

    expect(cmp.getEl()?.innerHTML).toContain('default');
    expect(cmp.getDefaultValue()).toBe('default');

    cmp.setDefaultValue('new default');
    expect(cmp.getEl()?.innerHTML).toContain('new default');
    expect(cmp.getDefaultValue()).toBe('new default');
  });

  test('component updates correctly after path and default value are changed', () => {
    const cmp = cmpRoot.append({
      type: DataVariableType,
      dataResolver: { defaultValue: 'default', path: 'ds_id.id1.name' },
    })[0] as ComponentDataVariable;

    expect(cmp.getEl()?.innerHTML).toContain('Name1');

    cmp.setPath('ds_id.id2.name');
    expect(cmp.getEl()?.innerHTML).toContain('Name2');

    cmp.setDefaultValue('new default');
    dsm.all.reset();
    expect(cmp.getEl()?.innerHTML).toContain('new default');
    expect(cmp.getDefaultValue()).toBe('new default');
  });

  test('component updates correctly after path is changed and data is updated', () => {
    const cmp = cmpRoot.append({
      type: DataVariableType,
      dataResolver: { defaultValue: 'default', path: 'ds_id.id1.name' },
    })[0] as ComponentDataVariable;

    expect(cmp.getEl()?.innerHTML).toContain('Name1');

    cmp.setPath('ds_id.id2.name');
    expect(cmp.getEl()?.innerHTML).toContain('Name2');

    const ds = dsm.get('ds_id');
    ds.getRecord('id2')?.set({ name: 'Name2-UP' });
    expect(cmp.getEl()?.innerHTML).toContain('Name2-UP');
  });
});
```

--------------------------------------------------------------------------------

````
