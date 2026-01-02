---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 79
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 79 of 97)

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

---[FILE: ComponentDataVariable.ts]---
Location: grapesjs-dev/packages/core/test/specs/data_sources/model/ComponentDataVariable.ts
Signals: TypeORM

```typescript
import DataSourceManager from '../../../../src/data_sources';
import ComponentWrapper from '../../../../src/dom_components/model/ComponentWrapper';
import { DataVariableType } from '../../../../src/data_sources/model/DataVariable';
import { setupTestEditor } from '../../../common';
import EditorModel from '../../../../src/editor/model/Editor';
import ComponentDataVariable from '../../../../src/data_sources/model/ComponentDataVariable';

describe('ComponentDataVariable', () => {
  let em: EditorModel;
  let dsm: DataSourceManager;
  let cmpRoot: ComponentWrapper;

  beforeEach(() => {
    ({ em, dsm, cmpRoot } = setupTestEditor());
  });

  afterEach(() => {
    em.destroy();
  });

  test('component initializes with data-variable content', () => {
    const dataSource = {
      id: 'ds1',
      records: [{ id: 'id1', name: 'Name1' }],
    };
    dsm.add(dataSource);

    const cmp = cmpRoot.append({
      tagName: 'div',
      type: 'default',
      components: [
        {
          type: DataVariableType,
          dataResolver: { defaultValue: 'default', path: 'ds1.id1.name' },
        },
      ],
    })[0];

    expect(cmp.getEl()?.innerHTML).toContain('Name1');
    expect(cmp.getInnerHTML()).toContain('Name1');
  });

  test('component updates on data-variable change', () => {
    const dataSource = {
      id: 'ds2',
      records: [{ id: 'id1', name: 'Name1' }],
    };
    dsm.add(dataSource);

    const cmp = cmpRoot.append({
      tagName: 'div',
      type: 'default',
      components: [
        {
          type: DataVariableType,
          dataResolver: { defaultValue: 'default', path: 'ds2.id1.name' },
        },
      ],
    })[0];

    expect(cmp.getEl()?.innerHTML).toContain('Name1');
    expect(cmp.getInnerHTML()).toContain('Name1');

    const ds = dsm.get('ds2');
    ds.getRecord('id1')?.set({ name: 'Name1-UP' });

    expect(cmp.getEl()?.innerHTML).toContain('Name1-UP');
    expect(cmp.getInnerHTML()).toContain('Name1-UP');
  });

  test("component uses default value if data source doesn't exist", () => {
    const cmp = cmpRoot.append({
      tagName: 'div',
      type: 'default',
      components: [
        {
          type: DataVariableType,
          dataResolver: { defaultValue: 'default', path: 'unknown.id1.name' },
        },
      ],
    })[0];

    expect(cmp.getEl()?.innerHTML).toContain('default');
  });

  test('component updates on data source reset', () => {
    const dataSource = {
      id: 'ds3',
      records: [{ id: 'id1', name: 'Name1' }],
    };
    dsm.add(dataSource);

    const cmp = cmpRoot.append({
      tagName: 'div',
      type: 'default',
      components: [
        {
          type: DataVariableType,
          dataResolver: { defaultValue: 'default', path: 'ds3.id1.name' },
        },
      ],
    })[0];

    expect(cmp.getEl()?.innerHTML).toContain('Name1');
    expect(cmp.getInnerHTML()).toContain('Name1');

    dsm.all.reset();
    expect(cmp.getEl()?.innerHTML).toContain('default');
    expect(cmp.getInnerHTML()).toContain('default');
  });

  test('component updates on data source setRecords', () => {
    const dataSource = {
      id: 'component-setRecords',
      records: [{ id: 'id1', name: 'init name' }],
    };
    dsm.add(dataSource);

    const cmp = cmpRoot.append({
      tagName: 'div',
      type: 'default',
      components: [
        {
          type: DataVariableType,
          dataResolver: { defaultValue: 'default', path: `${dataSource.id}.id1.name` },
        },
      ],
    })[0];

    expect(cmp.getEl()?.innerHTML).toContain('init name');
    expect(cmp.getInnerHTML()).toContain('init name');

    const ds = dsm.get(dataSource.id);
    ds.setRecords([{ id: 'id1', name: 'updated name' }]);

    expect(cmp.getEl()?.innerHTML).toContain('updated name');
    expect(cmp.getInnerHTML()).toContain('updated name');
  });

  test('component updates on record removal', () => {
    const dataSource = {
      id: 'ds4',
      records: [{ id: 'id1', name: 'Name1' }],
    };
    dsm.add(dataSource);

    const cmp = cmpRoot.append({
      tagName: 'div',
      type: 'default',
      components: [
        {
          type: DataVariableType,
          dataResolver: { defaultValue: 'default', path: 'ds4.id1.name' },
        },
      ],
    })[0];

    expect(cmp.getEl()?.innerHTML).toContain('Name1');
    expect(cmp.getInnerHTML()).toContain('Name1');

    const ds = dsm.get('ds4');
    ds.removeRecord('id1');

    expect(cmp.getEl()?.innerHTML).toContain('default');
    expect(cmp.getInnerHTML()).toContain('default');
  });

  test('component initializes and updates with data-variable for nested object', () => {
    const dataSource = {
      id: 'dsNestedObject',
      records: [
        {
          id: 'id1',
          nestedObject: {
            name: 'NestedName1',
          },
        },
      ],
    };
    dsm.add(dataSource);

    const cmp = cmpRoot.append({
      tagName: 'div',
      type: 'default',
      components: [
        {
          type: DataVariableType,
          dataResolver: { defaultValue: 'default', path: 'dsNestedObject.id1.nestedObject.name' },
        },
      ],
    })[0];

    expect(cmp.getEl()?.innerHTML).toContain('NestedName1');
    expect(cmp.getInnerHTML()).toContain('NestedName1');

    const ds = dsm.get('dsNestedObject');
    ds.getRecord('id1')?.set({ nestedObject: { name: 'NestedName1-UP' } });

    expect(cmp.getEl()?.innerHTML).toContain('NestedName1-UP');
    expect(cmp.getInnerHTML()).toContain('NestedName1-UP');
  });

  test('component initializes and updates with data-variable for nested object inside an array', () => {
    const dataSource = {
      id: 'dsNestedArray',
      records: [
        {
          id: 'id1',
          items: [
            {
              id: 'item1',
              nestedObject: {
                name: 'NestedItemName1',
              },
            },
          ],
        },
      ],
    };
    dsm.add(dataSource);

    const cmp = cmpRoot.append({
      tagName: 'div',
      type: 'default',
      components: [
        {
          type: DataVariableType,
          dataResolver: { defaultValue: 'default', path: 'dsNestedArray.id1.items.0.nestedObject.name' },
        },
      ],
    })[0];

    expect(cmp.getEl()?.innerHTML).toContain('NestedItemName1');
    expect(cmp.getInnerHTML()).toContain('NestedItemName1');

    const ds = dsm.get('dsNestedArray');
    ds.getRecord('id1')?.set({
      items: [
        {
          id: 'item1',
          nestedObject: { name: 'NestedItemName1-UP' },
        },
      ],
    });

    expect(cmp.getEl()?.innerHTML).toContain('NestedItemName1-UP');
    expect(cmp.getInnerHTML()).toContain('NestedItemName1-UP');
  });

  test('component initalizes and updates data on datarecord set object', () => {
    const dataSource = {
      id: 'setObject',
      records: [{ id: 'id1', content: 'Hello World', color: 'red' }],
    };
    dsm.add(dataSource);

    const cmp = cmpRoot.append({
      tagName: 'h1',
      type: 'text',
      components: [
        {
          type: DataVariableType,
          dataResolver: { defaultValue: 'default', path: `${dataSource.id}.id1.content` },
        },
      ],
      style: {
        color: {
          type: DataVariableType,
          defaultValue: 'black',
          path: `${dataSource.id}.id1.color`,
        },
      },
    })[0];

    const style = cmp.getStyle();
    expect(style).toHaveProperty('color', 'red');
    expect(cmp.getEl()?.innerHTML).toContain('Hello World');

    const ds = dsm.get('setObject');
    ds.getRecord('id1')?.set({ content: 'Hello World UP', color: 'blue' });

    const updatedStyle = cmp.getStyle();
    expect(updatedStyle).toHaveProperty('color', 'blue');
    expect(cmp.getEl()?.innerHTML).toContain('Hello World UP');
  });

  test("fixes: ComponentDataVariable dataResolver type 'data-variable' issue", () => {
    const dataSource = {
      id: 'ds1',
      records: [{ id: 'id1', name: 'Name1' }],
    };
    dsm.add(dataSource);

    const dataResolver = { type: DataVariableType, defaultValue: 'default', path: 'ds1.id1.name' };
    const cmp = cmpRoot.append({
      type: DataVariableType,
      dataResolver,
    })[0] as ComponentDataVariable;

    expect(cmp.getDataResolver()).toBe(dataResolver);
    expect(cmp.getEl()?.innerHTML).toContain('Name1');
    expect(cmp.getInnerHTML()).toContain('Name1');
  });

  test('renders content as plain text or HTML based on asPlainText option', () => {
    const htmlContent = '<p>Hello <strong>World</strong>!</p>';
    const plainTextContent = '&lt;p&gt;Hello &lt;strong&gt;World&lt;/strong&gt;!&lt;/p&gt;';
    const dataSource = {
      id: 'dsHtmlTest',
      records: [{ id: 'r1', content: htmlContent }],
    };
    dsm.add(dataSource);

    // Scenario 1: asPlainText is true
    const cmpPlainText = cmpRoot.append({
      type: DataVariableType,
      dataResolver: { path: 'dsHtmlTest.r1.content', asPlainText: true },
    })[0] as ComponentDataVariable;
    expect(cmpPlainText.getEl()?.innerHTML).toBe(plainTextContent);
    expect(cmpPlainText.getEl()?.textContent).toBe(htmlContent);

    // Scenario 2: asPlainText is false
    const cmpHtml = cmpRoot.append({
      type: DataVariableType,
      dataResolver: { path: 'dsHtmlTest.r1.content', asPlainText: false },
    })[0] as ComponentDataVariable;
    expect(cmpHtml.getEl()?.innerHTML).toBe(htmlContent);
    expect(cmpHtml.getEl()?.textContent).toBe('Hello World!');

    // Scenario 3: asPlainText is omitted (should default to HTML rendering)
    const cmpDefaultHtml = cmpRoot.append({
      type: DataVariableType,
      dataResolver: { path: 'dsHtmlTest.r1.content' },
    })[0] as ComponentDataVariable;
    expect(cmpDefaultHtml.getEl()?.innerHTML).toBe(htmlContent);
    expect(cmpDefaultHtml.getEl()?.textContent).toBe('Hello World!');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: DataSource.ts]---
Location: grapesjs-dev/packages/core/test/specs/data_sources/model/DataSource.ts
Signals: TypeORM

```typescript
import { DataSourceManager } from '../../../../src';
import DataSource from '../../../../src/data_sources/model/DataSource';
import {
  DataFieldPrimitiveType,
  DataFieldSchemaNumber,
  DataFieldSchemaString,
  DataRecordProps,
  DataSourceProviderResult,
} from '../../../../src/data_sources/types';
import Editor from '../../../../src/editor/model/Editor';
import { setupTestEditor } from '../../../common';

interface TestRecord extends DataRecordProps {
  name?: string;
  age?: number;
}

const serializeRecords = (records: any[]) => JSON.parse(JSON.stringify(records));

describe('DataSource', () => {
  let em: Editor;
  let editor: Editor['Editor'];
  let dsm: DataSourceManager;
  let ds: DataSource<TestRecord>;
  const categoryRecords = [
    { id: 'cat1', uid: 'cat1-uid', name: 'Category 1' },
    { id: 'cat2', uid: 'cat2-uid', name: 'Category 2' },
    { id: 'cat3', uid: 'cat3-uid', name: 'Category 3' },
  ];
  const userRecords = [
    { id: 'user1', username: 'user_one' },
    { id: 'user2', username: 'user_two' },
    { id: 'user3', username: 'user_three' },
  ];
  const blogRecords = [
    { id: 'blog1', title: 'First Blog', author: 'user1', categories: ['cat1-uid'] },
    { id: 'blog2', title: 'Second Blog', author: 'user2' },
    { id: 'blog3', title: 'Third Blog', categories: ['cat1-uid', 'cat3-uid'] },
  ];

  const addTestDataSource = (records?: TestRecord[]) => {
    return dsm.add<TestRecord>({ id: 'test', records: records || [{ id: 'user1', age: 30 }] });
  };

  beforeEach(() => {
    ({ em, dsm, editor } = setupTestEditor());
  });

  afterEach(() => {
    em.destroy();
  });

  describe('Schema', () => {
    const schemaName: DataFieldSchemaString = {
      type: DataFieldPrimitiveType.string,
      label: 'Name',
    };
    const schemaAge: DataFieldSchemaNumber = {
      type: DataFieldPrimitiveType.number,
      label: 'Age',
      default: 18,
    };

    beforeEach(() => {
      ds = addTestDataSource();
    });

    test('Initialize with empty schema', () => {
      expect(ds.schema).toEqual({});
    });

    test('Add and update schema', () => {
      const schemaNameDef: typeof ds.schema = { name: schemaName };
      const schemaAgeDef: typeof ds.schema = { age: schemaAge };
      ds.upSchema(schemaNameDef);
      ds.upSchema(schemaAgeDef);
      expect(ds.schema).toEqual({ ...schemaNameDef, ...schemaAgeDef });
    });

    test('Should update existing field schema', () => {
      ds.upSchema({ name: schemaName });

      const updatedSchema: typeof ds.schema = {
        name: {
          ...schemaName,
          description: 'User name field',
        },
      };
      ds.upSchema(updatedSchema);
      expect(ds.schema).toEqual(updatedSchema);
    });

    test('Should get field schema', () => {
      ds.upSchema({
        name: schemaName,
        age: schemaAge,
      });
      expect(ds.getSchemaField('name')).toEqual(schemaName);
      expect(ds.getSchemaField('age')).toEqual(schemaAge);
      expect(ds.getSchemaField('nonExistentField')).toBeUndefined();
    });

    describe('Relations', () => {
      beforeEach(() => {
        dsm.add({
          id: 'categories',
          records: categoryRecords,
        });
        dsm.add({
          id: 'users',
          records: userRecords,
        });
        dsm.add({
          id: 'blogs',
          records: blogRecords,
          schema: {
            title: {
              type: DataFieldPrimitiveType.string,
            },
            author: {
              type: DataFieldPrimitiveType.relation,
              target: 'users',
              targetField: 'id',
            },
          },
        });
      });

      test('return default values', () => {
        const blogsDS = dsm.get('blogs');
        expect(serializeRecords(blogsDS.getRecords())).toEqual(blogRecords);
      });

      test('return 1:1 resolved values', () => {
        const blogsDS = dsm.get('blogs');
        const records = blogsDS.getResolvedRecords();
        expect(records).toEqual([
          { ...blogRecords[0], author: userRecords[0] },
          { ...blogRecords[1], author: userRecords[1] },
          blogRecords[2],
        ]);
      });

      test('return 1:many resolved values', () => {
        const blogsDS = dsm.get('blogs');
        blogsDS.upSchema({
          categories: {
            type: DataFieldPrimitiveType.relation,
            target: 'categories',
            targetField: 'uid',
            isMany: true,
          },
        });
        const records = blogsDS.getResolvedRecords();
        expect(records).toEqual([
          { ...blogRecords[0], author: userRecords[0], categories: [categoryRecords[0]] },
          { ...blogRecords[1], author: userRecords[1] },
          { ...blogRecords[2], categories: [categoryRecords[0], categoryRecords[2]] },
        ]);
      });
    });
  });

  describe('Providers', () => {
    const testApiUrl = 'https://api.example.com/data';
    const testHeaders = { 'Content-Type': 'application/json' };
    const getMockSchema = () => ({
      author: {
        type: DataFieldPrimitiveType.relation,
        target: 'users',
        targetField: 'id',
      },
    });
    const getMockProviderResponse: () => DataSourceProviderResult = () => ({
      records: blogRecords,
      schema: getMockSchema(),
    });
    const getProviderBlogsGet = () => ({ url: testApiUrl, headers: testHeaders });
    const addBlogsWithProvider = () => {
      return dsm.add({
        id: 'blogs',
        name: 'My blogs',
        provider: {
          get: getProviderBlogsGet(),
        },
      });
    };

    beforeEach(() => {
      jest.spyOn(global, 'fetch').mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(getMockProviderResponse()),
        } as Response),
      );

      dsm.add({
        id: 'categories',
        records: categoryRecords,
      });
      dsm.add({
        id: 'users',
        records: userRecords,
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    test('loadProvider', async () => {
      const ds = addBlogsWithProvider();
      await ds.loadProvider();

      expect(fetch).toHaveBeenCalledWith(testApiUrl, { headers: testHeaders });
      expect(ds.schema).toEqual(getMockSchema());
      expect(ds.getResolvedRecords()).toEqual([
        { ...blogRecords[0], author: userRecords[0] },
        { ...blogRecords[1], author: userRecords[1] },
        blogRecords[2],
      ]);
    });

    test('loadProvider with failed fetch', async () => {
      jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'));

      em.config.log = false;
      const ds = addBlogsWithProvider();
      await ds.loadProvider();

      expect(fetch).toHaveBeenCalledWith(testApiUrl, { headers: testHeaders });
      expect(ds.schema).toEqual({});
      expect(ds.getRecords().length).toBe(0);
    });

    test('records loaded from the provider are not persisted', async () => {
      const ds = addBlogsWithProvider();
      const eventLoad = jest.fn();
      em.on(dsm.events.providerLoad, eventLoad);

      await ds.loadProvider();

      expect(editor.getProjectData().dataSources).toEqual([
        { id: 'categories', records: categoryRecords },
        { id: 'users', records: userRecords },
        {
          id: 'blogs',
          name: 'My blogs',
          schema: getMockSchema(),
          provider: { get: getProviderBlogsGet() },
        },
      ]);
      expect(eventLoad).toHaveBeenCalledTimes(1);
      expect(eventLoad).toHaveBeenCalledWith({
        dataSource: ds,
        result: getMockProviderResponse(),
      });
    });

    test('load providers on project load', (done) => {
      dsm.getConfig().autoloadProviders = true;

      editor.on(dsm.events.providerLoadAll, () => {
        expect(dsm.get('blogs').getResolvedRecords()).toEqual([
          { ...blogRecords[0], author: userRecords[0] },
          { ...blogRecords[1], author: userRecords[1] },
          blogRecords[2],
        ]);

        expect(editor.getProjectData().dataSources).toEqual([
          { id: 'categories', records: categoryRecords },
          { id: 'users', records: userRecords },
          {
            id: 'blogs',
            schema: getMockSchema(),
            provider: { get: testApiUrl },
          },
        ]);

        done();
      });

      editor.loadProjectData({
        dataSources: [
          { id: 'categories', records: categoryRecords },
          { id: 'users', records: userRecords },
          {
            id: 'blogs',
            provider: { get: testApiUrl },
          },
        ],
      });
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ComponentDataCondition.getters-setters.ts]---
Location: grapesjs-dev/packages/core/test/specs/data_sources/model/conditional_variables/ComponentDataCondition.getters-setters.ts
Signals: TypeORM

```typescript
import { DataSourceManager } from '../../../../../src';
import { DataVariableType } from '../../../../../src/data_sources/model/DataVariable';
import ComponentDataCondition from '../../../../../src/data_sources/model/conditional_variables/ComponentDataCondition';
import { DataConditionType } from '../../../../../src/data_sources/model/conditional_variables/DataCondition';
import { AnyTypeOperation } from '../../../../../src/data_sources/model/conditional_variables/operators/AnyTypeOperator';
import ComponentDataConditionView from '../../../../../src/data_sources/view/ComponentDataConditionView';
import ComponentWrapper from '../../../../../src/dom_components/model/ComponentWrapper';
import EditorModel from '../../../../../src/editor/model/Editor';
import {
  ifFalseText,
  setupTestEditor,
  ifTrueComponentDef,
  ifFalseComponentDef,
  newIfTrueText,
  ifTrueText,
  FALSE_CONDITION,
  TRUE_CONDITION,
  newIfFalseText,
  newIfTrueComponentDef,
  newIfFalseComponentDef,
} from '../../../../common';

describe('ComponentDataCondition Setters', () => {
  let em: EditorModel;
  let dsm: DataSourceManager;
  let cmpRoot: ComponentWrapper;

  beforeEach(() => {
    ({ em, dsm, cmpRoot } = setupTestEditor());
  });

  afterEach(() => {
    em.destroy();
  });

  it('should update the condition using setCondition', () => {
    const component = cmpRoot.append({
      type: DataConditionType,
      dataResolver: { condition: TRUE_CONDITION },
      components: [ifTrueComponentDef, ifFalseComponentDef],
    })[0] as ComponentDataCondition;

    component.setCondition(FALSE_CONDITION);
    expect(component.getCondition()).toEqual(FALSE_CONDITION);
    expect(component.getInnerHTML()).toContain(ifFalseText);
    expect(component.getEl()?.innerHTML).toContain(ifFalseText);
  });

  it('should update the ifTrue value using setIfTrueComponents', () => {
    const component = cmpRoot.append({
      type: DataConditionType,
      dataResolver: { condition: TRUE_CONDITION },
      components: [ifTrueComponentDef, ifFalseComponentDef],
    })[0] as ComponentDataCondition;

    component.setIfTrueComponents(newIfTrueComponentDef.components);
    expect(JSON.parse(JSON.stringify(component.getIfTrueContent()))).toEqual(newIfTrueComponentDef);
    expect(component.getInnerHTML()).toContain(newIfTrueText);
    expect(component.getEl()?.innerHTML).toContain(newIfTrueText);
  });

  it('should update the ifFalse value using setIfFalseComponents', () => {
    const component = cmpRoot.append({
      type: DataConditionType,
      dataResolver: { condition: TRUE_CONDITION },
      components: [ifTrueComponentDef, ifFalseComponentDef],
    })[0] as ComponentDataCondition;

    component.setIfFalseComponents(newIfFalseComponentDef.components);
    expect(JSON.parse(JSON.stringify(component.getIfFalseContent()))).toEqual(newIfFalseComponentDef);

    component.setCondition(FALSE_CONDITION);
    expect(component.getInnerHTML()).toContain(newIfFalseText);
    expect(component.getEl()?.innerHTML).toContain(newIfFalseText);
  });

  it('should update the data sources and re-evaluate the condition', () => {
    const dataSource = {
      id: 'ds1',
      records: [
        { id: 'left_id', left: 'Name1' },
        { id: 'right_id', right: 'Name1' },
      ],
    };
    dsm.add(dataSource);

    const component = cmpRoot.append({
      type: DataConditionType,
      dataResolver: {
        condition: {
          left: {
            type: DataVariableType,
            path: 'ds1.left_id.left',
          },
          operator: AnyTypeOperation.equals,
          right: {
            type: DataVariableType,
            path: 'ds1.right_id.right',
          },
        },
      },
      components: [ifTrueComponentDef, ifFalseComponentDef],
    })[0] as ComponentDataCondition;

    expect(component.getInnerHTML()).toContain(ifTrueText);

    changeDataSourceValue(dsm, 'Different value');
    expect(component.getInnerHTML()).toContain(ifFalseText);
    expect(component.getEl()?.innerHTML).toContain(ifFalseText);

    changeDataSourceValue(dsm, 'Name1');
    expect(component.getInnerHTML()).toContain(ifTrueText);
    expect(component.getEl()?.innerHTML).toContain(ifTrueText);
  });

  it('should re-render the component when condition, ifTrue, or ifFalse changes', () => {
    const component = cmpRoot.append({
      type: DataConditionType,
      dataResolver: { condition: TRUE_CONDITION },
      components: [ifTrueComponentDef, ifFalseComponentDef],
    })[0] as ComponentDataCondition;

    const componentView = component.getView() as ComponentDataConditionView;

    component.setIfTrueComponents(newIfTrueComponentDef);

    expect(component.getInnerHTML()).toContain(newIfTrueText);
    expect(componentView.el.innerHTML).toContain(newIfTrueText);

    component.setIfFalseComponents(newIfFalseComponentDef);
    component.setCondition(FALSE_CONDITION);
    expect(component.getInnerHTML()).toContain(newIfFalseText);
    expect(componentView.el.innerHTML).toContain(newIfFalseText);
  });
});

export const changeDataSourceValue = (dsm: DataSourceManager, newValue: string) => {
  dsm.get('ds1').getRecord('left_id')?.set('left', newValue);
};
```

--------------------------------------------------------------------------------

---[FILE: ComponentDataCondition.ts]---
Location: grapesjs-dev/packages/core/test/specs/data_sources/model/conditional_variables/ComponentDataCondition.ts
Signals: TypeORM

```typescript
import { DataSourceManager, Editor } from '../../../../../src';
import { DataVariableType } from '../../../../../src/data_sources/model/DataVariable';
import ComponentDataCondition from '../../../../../src/data_sources/model/conditional_variables/ComponentDataCondition';
import { DataConditionType } from '../../../../../src/data_sources/model/conditional_variables/DataCondition';
import { AnyTypeOperation } from '../../../../../src/data_sources/model/conditional_variables/operators/AnyTypeOperator';
import { NumberOperation } from '../../../../../src/data_sources/model/conditional_variables/operators/NumberOperator';
import { DataComponentTypes } from '../../../../../src/data_sources/types';
import ComponentDataConditionView from '../../../../../src/data_sources/view/ComponentDataConditionView';
import ComponentWrapper from '../../../../../src/dom_components/model/ComponentWrapper';
import EditorModel from '../../../../../src/editor/model/Editor';
import {
  FALSE_CONDITION,
  ifFalseComponentDef,
  ifFalseText,
  ifTrueComponentDef,
  ifTrueText,
  isObjectContained,
  setupTestEditor,
  TRUE_CONDITION,
} from '../../../../common';

describe('ComponentDataCondition', () => {
  let editor: Editor;
  let em: EditorModel;
  let dsm: DataSourceManager;
  let cmpRoot: ComponentWrapper;

  beforeEach(() => {
    ({ editor, em, dsm, cmpRoot } = setupTestEditor());
  });

  afterEach(() => {
    em.destroy();
  });

  it('should add a component with a condition', () => {
    const component = cmpRoot.append({
      type: DataConditionType,
      dataResolver: { condition: TRUE_CONDITION },
      components: [ifTrueComponentDef],
    })[0] as ComponentDataCondition;
    expect(component).toBeDefined();
    expect(component.get('type')).toBe(DataConditionType);
    const componentView = component.getView();
    expect(componentView).toBeInstanceOf(ComponentDataConditionView);

    expect(component.getInnerHTML()).toContain(ifTrueText);
    expect(component.getEl()?.innerHTML).toContain(ifTrueText);
    const ifTrueContent = component.getIfTrueContent()!;
    expect(ifTrueContent.getInnerHTML()).toContain(ifTrueText);
    expect(ifTrueContent.getEl()?.textContent).toBe(ifTrueText);
    expect(ifTrueContent.getEl()?.style.display).toBe('');
  });

  it('ComponentDataCondition getIfTrueContent and getIfFalseContent', () => {
    const component = cmpRoot.append({
      type: DataConditionType,
      dataResolver: { condition: TRUE_CONDITION },
      components: [ifTrueComponentDef, ifFalseComponentDef],
    })[0] as ComponentDataCondition;

    expect(JSON.parse(JSON.stringify(component.getIfTrueContent()!))).toEqual(ifTrueComponentDef);
    expect(JSON.parse(JSON.stringify(component.getIfFalseContent()!))).toEqual(ifFalseComponentDef);
  });

  it('should test component variable with data-source', () => {
    const dataSource = {
      id: 'ds1',
      records: [
        { id: 'left_id', left: 'Name1' },
        { id: 'right_id', right: 'Name1' },
      ],
    };
    dsm.add(dataSource);

    const component = cmpRoot.append({
      type: DataConditionType,
      dataResolver: {
        condition: {
          left: {
            type: DataVariableType,
            path: 'ds1.left_id.left',
          },
          operator: AnyTypeOperation.equals,
          right: {
            type: DataVariableType,
            path: 'ds1.right_id.right',
          },
        },
      },
      components: [ifTrueComponentDef, ifFalseComponentDef],
    })[0] as ComponentDataCondition;
    expect(component.getInnerHTML()).toContain(ifTrueText);
    expect(component.getEl()?.innerHTML).toContain(ifTrueText);
    const ifTrueContent = component.getIfTrueContent()!;
    expect(ifTrueContent.getInnerHTML()).toContain(ifTrueText);
    expect(ifTrueContent.getEl()?.textContent).toBe(ifTrueText);
    expect(ifTrueContent.getEl()?.style.display).toBe('');

    expect(component.getInnerHTML()).not.toContain(ifFalseText);
    expect(component.getEl()?.innerHTML).toContain(ifFalseText);
    const ifFalseContent = component.getIfFalseContent()!;
    expect(ifFalseContent.getInnerHTML()).toContain(ifFalseText);
    expect(ifFalseContent.getEl()?.textContent).toBe(ifFalseText);
    expect(ifFalseContent.getEl()?.style.display).toBe('none');

    /* Test changing datasources */
    const WrongValue = 'Diffirent value';
    changeDataSourceValue(dsm, WrongValue);
    expect(component.getEl()?.innerHTML).toContain(ifTrueText);
    expect(component.getEl()?.innerHTML).toContain(ifFalseText);
    expect(ifTrueContent.getEl()?.style.display).toBe('none');
    expect(ifFalseContent.getEl()?.style.display).toBe('');

    const CorrectValue = 'Name1';
    changeDataSourceValue(dsm, CorrectValue);
    expect(component.getEl()?.innerHTML).toContain(ifTrueText);
    expect(component.getEl()?.innerHTML).toContain(ifFalseText);
    expect(ifTrueContent.getEl()?.style.display).toBe('');
    expect(ifFalseContent.getEl()?.style.display).toBe('none');
  });

  it('should test a conditional component with a child that is also a conditional component', () => {
    const dataSource = {
      id: 'ds1',
      records: [
        { id: 'left_id', left: 'Name1' },
        { id: 'right_id', right: 'Name1' },
      ],
    };
    dsm.add(dataSource);

    const component = cmpRoot.append({
      type: DataConditionType,
      dataResolver: {
        condition: {
          left: {
            type: DataVariableType,
            path: 'ds1.left_id.left',
          },
          operator: AnyTypeOperation.equals,
          right: {
            type: DataVariableType,
            path: 'ds1.right_id.right',
          },
        },
      },
      components: [
        {
          type: DataComponentTypes.conditionTrue,
          components: {
            type: DataConditionType,
            dataResolver: {
              condition: {
                left: {
                  type: DataVariableType,
                  path: 'ds1.left_id.left',
                },
                operator: AnyTypeOperation.equals,
                right: {
                  type: DataVariableType,
                  path: 'ds1.right_id.right',
                },
              },
            },
            components: ifTrueComponentDef,
          },
        },
        ifFalseComponentDef,
      ],
    })[0] as ComponentDataCondition;
    const ifTrueContent = component.getIfTrueContent()!;
    expect(ifTrueContent.getInnerHTML()).toContain(ifTrueText);
    expect(ifTrueContent.getEl()?.textContent).toBe(ifTrueText);
    expect(ifTrueContent.getEl()?.style.display).toBe('');
  });

  it('should store conditional components', () => {
    const conditionalCmptDef = {
      type: DataConditionType,
      dataResolver: { condition: FALSE_CONDITION },
      components: [ifTrueComponentDef, ifFalseComponentDef],
    };

    cmpRoot.append(conditionalCmptDef)[0];

    const projectData = editor.getProjectData();
    const page = projectData.pages[0];
    const frame = page.frames[0];
    const storageCmptDef = frame.component.components[0];
    expect(isObjectContained(storageCmptDef, conditionalCmptDef)).toBe(true);
  });

  it('should dynamically display ifTrue, ifFalse components in the correct order', () => {
    const component = cmpRoot.append({
      type: DataConditionType,
      dataResolver: { condition: TRUE_CONDITION },
      components: [ifTrueComponentDef, ifFalseComponentDef],
    })[0] as ComponentDataCondition;
    const el = component.getEl()!;
    const ifTrueEl = el.childNodes[0] as any;
    const ifFalseEl = el.childNodes[1] as any;
    expect(ifTrueEl.textContent).toContain(ifTrueText);
    expect(ifTrueEl.style.display).toBe('');
    expect(ifFalseEl.textContent).toContain(ifFalseText);
    expect(ifFalseEl.style.display).toBe('none');

    component.setCondition(FALSE_CONDITION);
    expect(ifTrueEl.style.display).toBe('none');
    expect(ifTrueEl.textContent).toContain(ifTrueText);
    expect(ifFalseEl.style.display).toBe('');
    expect(ifFalseEl.textContent).toContain(ifFalseText);
  });

  it('should dynamically update display components when data source changes', () => {
    const dataSource = {
      id: 'ds1',
      records: [{ id: 'left_id', left: 1 }],
    };
    dsm.add(dataSource);

    const component = cmpRoot.append({
      type: DataConditionType,
      dataResolver: {
        condition: {
          left: {
            type: DataVariableType,
            path: 'ds1.left_id.left',
          },
          operator: NumberOperation.greaterThan,
          right: 0,
        },
      },
      components: [ifTrueComponentDef, ifFalseComponentDef],
    })[0] as ComponentDataCondition;

    const el = component.view!.el!;
    const falseValue = -1;
    changeDataSourceValue(dsm, falseValue);
    expect(el.innerHTML).toContain(ifTrueText);
    expect(el.innerHTML).toContain(ifFalseText);

    const ifTrueEl = el.childNodes[0] as any;
    const ifFalseEl = el.childNodes[1] as any;
    expect(ifTrueEl!.style.display).toBe('none');
    expect(ifTrueEl.textContent).toContain(ifTrueText);
    expect(ifFalseEl.style.display).toBe('');
    expect(ifFalseEl.textContent).toContain(ifFalseText);
  });

  it('should update content of ifTrue, ifFalse components when condition changes', () => {
    const component = cmpRoot.append({
      type: DataConditionType,
      dataResolver: { condition: TRUE_CONDITION },
      components: [ifTrueComponentDef, ifFalseComponentDef],
    })[0] as ComponentDataCondition;
    const el = component.view!.el;

    component.setCondition(FALSE_CONDITION);
    const ifTrueEl = el.childNodes[0] as any;
    const ifFalseEl = el.childNodes[1] as any;
    expect(ifTrueEl!.style.display).toBe('none');
    expect(ifTrueEl.textContent).toContain(ifTrueText);
    expect(ifFalseEl.style.display).toBe('');
    expect(ifFalseEl.textContent).toContain(ifFalseText);
  });

  test("fixes: ComponentDatacondition dataResolver type 'data-variable' issue", () => {
    const dataResolver = {
      type: DataConditionType,
      condition: {
        left: 1,
        operator: NumberOperation.greaterThan,
        right: 0,
      },
    };
    const cmp = cmpRoot.append({
      type: DataConditionType,
      dataResolver,
      components: [ifTrueComponentDef, ifFalseComponentDef],
    })[0] as ComponentDataCondition;

    expect(cmp.getDataResolver()).toBe(dataResolver);
  });
});

function changeDataSourceValue(dsm: DataSourceManager, newValue: string | number) {
  dsm.get('ds1').getRecord('left_id')?.set('left', newValue);
}
```

--------------------------------------------------------------------------------

---[FILE: ConditionalStyles.ts]---
Location: grapesjs-dev/packages/core/test/specs/data_sources/model/conditional_variables/ConditionalStyles.ts
Signals: TypeORM

```typescript
import { DataSourceManager, Editor } from '../../../../../src';
import { DataVariableType } from '../../../../../src/data_sources/model/DataVariable';
import { DataConditionType } from '../../../../../src/data_sources/model/conditional_variables/DataCondition';
import { AnyTypeOperation } from '../../../../../src/data_sources/model/conditional_variables/operators/AnyTypeOperator';
import { NumberOperation } from '../../../../../src/data_sources/model/conditional_variables/operators/NumberOperator';
import ComponentWrapper from '../../../../../src/dom_components/model/ComponentWrapper';
import EditorModel from '../../../../../src/editor/model/Editor';
import { filterObjectForSnapshot, setupTestEditor } from '../../../../common';

describe('StyleConditionalVariable', () => {
  let editor: Editor;
  let em: EditorModel;
  let dsm: DataSourceManager;
  let cmpRoot: ComponentWrapper;

  beforeEach(() => {
    ({ editor, em, dsm, cmpRoot } = setupTestEditor());
  });

  afterEach(() => {
    em.destroy();
  });

  it('should add a component with a conditionally styled attribute', () => {
    const component = cmpRoot.append({
      tagName: 'h1',
      type: 'text',
      content: 'some text',
      style: {
        color: {
          type: DataConditionType,
          condition: {
            left: 0,
            operator: NumberOperation.greaterThan,
            right: -1,
          },
          ifTrue: 'red',
          ifFalse: 'black',
        },
      },
    })[0];

    expect(component).toBeDefined();
    expect(component.getStyle().color).toBe('red');
  });

  it('should change style based on data source changes', () => {
    const dataSource = {
      id: 'ds1',
      records: [
        { id: 'left_id', left: 'Value1' },
        { id: 'right_id', right: 'Value2' },
      ],
    };
    dsm.add(dataSource);

    const component = cmpRoot.append({
      tagName: 'h1',
      type: 'text',
      content: 'some text',
      style: {
        color: {
          type: DataConditionType,
          condition: {
            left: {
              type: DataVariableType,
              path: 'ds1.left_id.left',
            },
            operator: AnyTypeOperation.equals,
            right: {
              type: DataVariableType,
              path: 'ds1.right_id.right',
            },
          },
          ifTrue: 'green',
          ifFalse: 'blue',
        },
      },
    })[0];

    expect(component.getStyle().color).toBe('blue');

    dsm.get('ds1').getRecord('right_id')?.set('right', 'Value1');
    expect(component.getStyle().color).toBe('green');
  });

  it.skip('should store components with conditional styles correctly', () => {
    const conditionalStyleDef = {
      tagName: 'h1',
      type: 'text',
      content: 'some text',
      style: {
        color: {
          type: DataConditionType,
          condition: {
            left: 0,
            operator: NumberOperation.greaterThan,
            right: -1,
          },
          ifTrue: 'yellow',
          ifFalse: 'black',
        },
      },
    };

    cmpRoot.append(conditionalStyleDef)[0];

    const projectData = filterObjectForSnapshot(editor.getProjectData());
    const page = projectData.pages[0];
    const frame = page.frames[0];
    const storedComponent = frame.component.components[0];
    expect(storedComponent).toEqual(expect.objectContaining(conditionalStyleDef));
  });
});
```

--------------------------------------------------------------------------------

````
