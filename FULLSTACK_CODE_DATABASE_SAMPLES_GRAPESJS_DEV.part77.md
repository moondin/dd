---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 77
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 77 of 97)

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

---[FILE: jsonplaceholder.ts]---
Location: grapesjs-dev/packages/core/test/specs/data_sources/jsonplaceholder.ts
Signals: TypeORM

```typescript
import DataSourceManager from '../../../src/data_sources';
import ComponentWrapper from '../../../src/dom_components/model/ComponentWrapper';
import { DataVariableType } from '../../../src/data_sources/model/DataVariable';
import { DataSourceProps } from '../../../src/data_sources/types';
import { setupTestEditor } from '../../common';
import EditorModel from '../../../src/editor/model/Editor';
import htmlFormat from 'pretty';

type Comment = {
  postId: number;
  id: string;
  name: string;
  email: string;
  body: string;
};
function getComments() {
  const json = [
    {
      postId: 1,
      id: '1',
      name: 'id labore ex et quam laborum',
      email: 'Eliseo@gardner.biz',
      body: 'laudantium enim quasi est quidem magnam voluptate ipsam eos\ntempora quo necessitatibus\ndolor quam autem quasi\nreiciendis et nam sapiente accusantium',
    },
    {
      postId: 1,
      id: '2',
      name: 'quo vero reiciendis velit similique earum',
      email: 'Jayne_Kuhic@sydney.com',
      body: 'est natus enim nihil est dolore omnis voluptatem numquam\net omnis occaecati quod ullam at\nvoluptatem error expedita pariatur\nnihil sint nostrum voluptatem reiciendis et',
    },
    {
      postId: 1,
      id: '3',
      name: 'odio adipisci rerum aut animi',
      email: 'Nikita@garfield.biz',
      body: 'quia molestiae reprehenderit quasi aspernatur\naut expedita occaecati aliquam eveniet laudantium\nomnis quibusdam delectus saepe quia accusamus maiores nam est\ncum et ducimus et vero voluptates excepturi deleniti ratione',
    },
    {
      postId: 1,
      id: '4',
      name: 'alias odio sit',
      email: 'Lew@alysha.tv',
      body: 'non et atque\noccaecati deserunt quas accusantium unde odit nobis qui voluptatem\nquia voluptas consequuntur itaque dolor\net qui rerum deleniti ut occaecati',
    },
    {
      postId: 1,
      id: '5',
      name: 'vero eaque aliquid doloribus et culpa',
      email: 'Hayden@althea.biz',
      body: 'harum non quasi et ratione\ntempore iure ex voluptates in ratione\nharum architecto fugit inventore cupiditate\nvoluptates magni quo et',
    },
  ];

  return json;
}

// Comment https://github.com/GrapesJS/grapesjs/discussions/5956#discussioncomment-10559499
describe('JsonPlaceholder Usage', () => {
  let em: EditorModel;
  let dsm: DataSourceManager;
  let cmpRoot: ComponentWrapper;

  beforeEach(() => {
    ({ em, dsm, cmpRoot } = setupTestEditor());
  });

  afterEach(() => {
    em.destroy();
  });

  test('should render a list of comments from jsonplaceholder api', async () => {
    const comments = getComments();
    const dataSource: DataSourceProps<Comment> = {
      id: 'comments',
      records: comments as any,
    };
    dsm.add(dataSource);

    dsm
      .get('comments')
      .getRecords()
      .forEach((record) => {
        cmpRoot.append({
          tagName: 'div',
          components: [
            {
              tagName: 'h4',
              components: [
                {
                  type: DataVariableType,
                  dataResolver: { defaultValue: 'default', path: `comments.${record?.id}.name` },
                },
              ],
            },
            {
              tagName: 'p',
              components: [
                {
                  type: DataVariableType,
                  dataResolver: { defaultValue: 'default', path: `comments.${record?.id}.id` },
                },
              ],
            },
            {
              tagName: 'p',
              components: [
                {
                  type: DataVariableType,
                  dataResolver: { defaultValue: 'default', path: `comments.${record?.id}.body` },
                },
              ],
            },
          ],
        });
      });

    const html = cmpRoot.toHTML();
    expect(htmlFormat(html)).toMatchSnapshot();

    const components = cmpRoot.components();
    expect(components.length).toBe(comments.length);

    components.forEach((cmp, i) => {
      expect(cmp.get('components')?.length).toBe(3);
      const record = comments[i];
      const title = cmp.get('components')?.at(0);
      const id = cmp.get('components')?.at(1);
      const body = cmp.get('components')?.at(2);

      expect(title?.getInnerHTML()).toContain(record.name);
      expect(id?.getInnerHTML()).toContain(record.id.toString());
      expect(body?.getInnerHTML()).toContain(record.body);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: mutable.ts]---
Location: grapesjs-dev/packages/core/test/specs/data_sources/mutable.ts
Signals: TypeORM

```typescript
import DataSourceManager from '../../../src/data_sources';
import { setupTestEditor } from '../../common';
import EditorModel from '../../../src/editor/model/Editor';

describe('DataSource Immutability', () => {
  let em: EditorModel;
  let dsm: DataSourceManager;

  beforeEach(() => {
    ({ em, dsm } = setupTestEditor());
  });

  afterEach(() => {
    em.destroy();
  });

  test('set throws error for immutable record', () => {
    const ds = dsm.add({
      id: 'testDs1',
      records: [{ id: 'id1', name: 'Name1', value: 100, mutable: false }],
    });
    const record = ds.getRecord('id1');

    expect(() => record?.set('name', 'UpdatedName')).toThrow('Cannot modify immutable record');
    expect(record?.get('name')).toBe('Name1');
  });

  test('set throws error for multiple attributes on immutable record', () => {
    const ds = dsm.add({
      id: 'testDs2',
      records: [{ id: 'id1', name: 'Name1', value: 100, mutable: false }],
    });
    const record = ds.getRecord('id1');

    expect(() => record?.set({ name: 'UpdatedName', value: 150 })).toThrow('Cannot modify immutable record');
    expect(record?.get('name')).toBe('Name1');
    expect(record?.get('value')).toBe(100);
  });

  test('removeRecord throws error for immutable record', () => {
    const ds = dsm.add({
      id: 'testDs3',
      records: [{ id: 'id1', name: 'Name1', value: 100, mutable: false }],
    });

    expect(() => ds.removeRecord('id1')).toThrow('Cannot remove immutable record');
    expect(ds.getRecord('id1')).toBeTruthy();
  });

  test('addRecord creates an immutable record', () => {
    type RecordType = { id: string; name: string; value: number; mutable: boolean };
    const ds = dsm.add({
      id: 'testDs4',
      records: [] as RecordType[],
    });

    ds.addRecord({ id: 'id1', name: 'Name1', value: 100, mutable: false });
    const newRecord = ds.getRecord('id1');

    expect(() => newRecord?.set('name', 'UpdatedName')).toThrow('Cannot modify immutable record');
    expect(newRecord?.get('name')).toBe('Name1');
  });

  test('setRecords replaces all records with immutable ones', () => {
    const ds = dsm.add({
      id: 'testDs5',
      records: [{ id: 'id1', name: 'Name1', value: 100, mutable: false }],
    });

    ds.setRecords([
      { id: 'id1', name: 'Name1', value: 100, mutable: false },
      { id: 'id2', name: 'Name2', value: 200, mutable: false },
    ]);

    const record1 = ds.getRecord('id1');
    const record2 = ds.getRecord('id2');

    expect(() => record1?.set('name', 'UpdatedName1')).toThrow('Cannot modify immutable record');
    expect(() => record2?.set('name', 'UpdatedName2')).toThrow('Cannot modify immutable record');
    expect(record1?.get('name')).toBe('Name1');
    expect(record2?.get('name')).toBe('Name2');
  });

  test('batch update throws error for immutable records', () => {
    const ds = dsm.add({
      id: 'testDs6',
      records: [
        { id: 'id1', name: 'Name1', value: 100, mutable: false },
        { id: 'id2', name: 'Name2', value: 200, mutable: false },
      ],
    });

    expect(() => {
      ds.records.set([
        { id: 'id1', name: 'BatchUpdate1' },
        { id: 'id2', name: 'BatchUpdate2' },
      ]);
    }).toThrow('Cannot modify immutable record');

    expect(ds.getRecord('id1')?.get('name')).toBe('Name1');
    expect(ds.getRecord('id2')?.get('name')).toBe('Name2');
  });

  test('nested property update throws error for immutable record', () => {
    const ds = dsm.add({
      id: 'testDs7',
      records: [{ id: 'nested-id', nested: { prop: 'NestedValue' }, mutable: false }],
    });
    const record = ds.getRecord('nested-id');

    expect(() => record?.set('nested.prop', 'UpdatedNestedValue')).toThrow('Cannot modify immutable record');
  });

  test('record remains immutable after serialization and deserialization', () => {
    const ds = dsm.add({
      id: 'testDs8',
      records: [{ id: 'id1', name: 'Name1', value: 100, mutable: false }],
    });
    const serialized = JSON.parse(JSON.stringify(ds.toJSON()));

    dsm.remove(ds.id as string);
    const newDs = dsm.add(serialized);

    const record = newDs.getRecord('id1');

    expect(() => record?.set('name', 'SerializedUpdate')).toThrow('Cannot modify immutable record');
    expect(record?.get('name')).toBe('Name1');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: serialization.ts]---
Location: grapesjs-dev/packages/core/test/specs/data_sources/serialization.ts
Signals: TypeORM

```typescript
import Editor from '../../../src/editor';
import DataSourceManager from '../../../src/data_sources';
import ComponentWrapper from '../../../src/dom_components/model/ComponentWrapper';
import { DataVariableType } from '../../../src/data_sources/model/DataVariable';
import EditorModel from '../../../src/editor/model/Editor';
import { ProjectData } from '../../../src/storage_manager';
import { filterObjectForSnapshot, setupTestEditor } from '../../common';
describe('DataSource Serialization', () => {
  let editor: Editor;
  let em: EditorModel;
  let dsm: DataSourceManager;
  let cmpRoot: ComponentWrapper;
  const componentDataSource = {
    id: 'component-serialization',
    records: [
      { id: 'id1', content: 'Hello World' },
      { id: 'id2', color: 'red' },
    ],
    skipFromStorage: true,
  };
  const styleDataSource = {
    id: 'colors-data',
    records: [{ id: 'id1', color: 'red' }],
    skipFromStorage: true,
  };
  const traitDataSource = {
    id: 'test-input',
    records: [{ id: 'id1', value: 'test-value' }],
    skipFromStorage: true,
  };
  const propsDataSource = {
    id: 'test-input',
    records: [{ id: 'id1', value: 'test-value' }],
    skipFromStorage: true,
  };

  beforeEach(() => {
    ({ editor, em, dsm, cmpRoot } = setupTestEditor());

    dsm.add(componentDataSource);
    dsm.add(styleDataSource);
    dsm.add(traitDataSource);
  });

  afterEach(() => {
    em.destroy();
  });

  test('component .getHtml', () => {
    const cmp = cmpRoot.append({
      tagName: 'h1',
      type: 'text',
      components: [
        {
          type: DataVariableType,
          dataResolver: { defaultValue: 'default', path: `${componentDataSource.id}.id1.content` },
        },
      ],
    })[0];

    const el = cmp.getEl();
    expect(el?.innerHTML).toContain('Hello World');

    const html = em.getHtml();
    expect(html).toMatchInlineSnapshot('"<body><h1><div>Hello World</div></h1></body>"');
  });

  describe('.getProjectData', () => {
    test('Dynamic Props', () => {
      const dataVariable = {
        type: DataVariableType,
        defaultValue: 'default',
        path: `${propsDataSource.id}.id1.value`,
      };

      cmpRoot.append({
        tagName: 'input',
        content: dataVariable,
        customProp: dataVariable,
      })[0];

      const projectData = editor.getProjectData();
      const page = projectData.pages[0];
      const frame = page.frames[0];
      const component = frame.component.components[0];
      expect(component['content']).toEqual(dataVariable);
      expect(component['customProp']).toEqual(dataVariable);

      const snapshot = filterObjectForSnapshot(projectData);
      expect(snapshot).toMatchSnapshot(``);
    });

    test('Dynamic Attributes', () => {
      const dataVariable = {
        type: DataVariableType,
        defaultValue: 'default',
        path: `${propsDataSource.id}.id1.value`,
      };

      cmpRoot.append({
        tagName: 'input',
        attributes: {
          dynamicAttribute: dataVariable,
        },
      })[0];

      const projectData = editor.getProjectData();
      const page = projectData.pages[0];
      const frame = page.frames[0];
      const component = frame.component.components[0];
      expect(component['attributes']['dynamicAttribute']).toEqual(dataVariable);

      const snapshot = filterObjectForSnapshot(projectData);
      expect(snapshot).toMatchSnapshot(``);
    });

    test('ComponentDataVariable', () => {
      const dataVariable = {
        type: DataVariableType,
        dataResolver: { defaultValue: 'default', path: `${componentDataSource.id}.id1.content` },
      };

      cmpRoot.append({
        tagName: 'h1',
        type: 'text',
        components: [dataVariable],
      })[0];

      const projectData = editor.getProjectData();
      const page = projectData.pages[0];
      const frame = page.frames[0];
      const component = frame.component.components[0];
      expect(component.components[0]).toEqual(dataVariable);

      const snapshot = filterObjectForSnapshot(projectData);
      expect(snapshot).toMatchSnapshot(``);
    });

    test('StyleDataVariable', () => {
      const dataVariable = {
        type: DataVariableType,
        defaultValue: 'black',
        path: 'colors-data.id1.color',
      };

      cmpRoot.append({
        tagName: 'h1',
        type: 'text',
        content: 'Hello World',
        style: {
          color: dataVariable,
        },
      })[0];

      const projectData = editor.getProjectData();
      const page = projectData.pages[0];
      const frame = page.frames[0];
      const component = frame.component.components[0];
      const componentId = component.attributes.id;
      expect(componentId).toBeDefined();

      const styleSelector = projectData.styles.find((style: any) => style.selectors[0] === `#${componentId}`);
      expect(styleSelector.style).toEqual({
        color: dataVariable,
      });

      const snapshot = filterObjectForSnapshot(projectData);
      expect(snapshot).toMatchSnapshot(``);
    });
  });

  describe('.loadProjectData', () => {
    test('Dynamic Props', () => {
      const dataVariable = {
        type: DataVariableType,
        defaultValue: 'default',
        path: `${propsDataSource.id}.id1.value`,
      };

      const componentProjectData: ProjectData = {
        assets: [],
        pages: [
          {
            frames: [
              {
                component: {
                  components: [
                    {
                      content: dataVariable,
                      customProp: dataVariable,
                      tagName: 'input',
                      void: true,
                    },
                  ],
                  docEl: {
                    tagName: 'html',
                  },
                  head: {
                    type: 'head',
                  },
                  stylable: [
                    'background',
                    'background-color',
                    'background-image',
                    'background-repeat',
                    'background-attachment',
                    'background-position',
                    'background-size',
                  ],
                  type: 'wrapper',
                },
                id: 'frameid',
              },
            ],
            id: 'pageid',
            type: 'main',
          },
        ],
        styles: [],
        symbols: [],
        dataSources: [propsDataSource],
      };

      editor.loadProjectData(componentProjectData);

      const components = editor.getComponents();
      const component = components.models[0];
      expect(component.get('content')).toEqual('test-value');
      expect(component.get('customProp')).toEqual('test-value');

      dsm.get(propsDataSource.id).getRecord('id1')?.set('value', 'updated-value');
      expect(component.get('content')).toEqual('updated-value');
      expect(component.get('customProp')).toEqual('updated-value');
    });

    test('Dynamic Attributes', () => {
      const dataVariable = {
        type: DataVariableType,
        defaultValue: 'default',
        path: `${propsDataSource.id}.id1.value`,
      };

      const componentProjectData: ProjectData = {
        assets: [],
        pages: [
          {
            frames: [
              {
                component: {
                  components: [
                    {
                      attributes: {
                        dynamicAttribute: dataVariable,
                      },
                      tagName: 'input',
                      void: true,
                    },
                  ],
                  docEl: {
                    tagName: 'html',
                  },
                  head: {
                    type: 'head',
                  },
                  stylable: [
                    'background',
                    'background-color',
                    'background-image',
                    'background-repeat',
                    'background-attachment',
                    'background-position',
                    'background-size',
                  ],
                  type: 'wrapper',
                },
                id: 'frameid',
              },
            ],
            id: 'pageid',
            type: 'main',
          },
        ],
        styles: [],
        symbols: [],
        dataSources: [propsDataSource],
      };

      editor.loadProjectData(componentProjectData);

      const components = editor.getComponents();
      const component = components.at(0);
      expect(component.getAttributes()['dynamicAttribute']).toEqual('test-value');

      dsm.get(propsDataSource.id).getRecord('id1')?.set('value', 'updated-value');
      expect(component.getAttributes()['dynamicAttribute']).toEqual('updated-value');
    });

    test('ComponentDataVariable', () => {
      const componentProjectData: ProjectData = {
        assets: [],
        pages: [
          {
            frames: [
              {
                component: {
                  components: [
                    {
                      components: [
                        {
                          value: 'default',
                          type: DataVariableType,
                          dataResolver: { path: 'component-serialization.id1.content' },
                        },
                      ],
                      tagName: 'h1',
                      type: 'text',
                    },
                  ],
                  docEl: {
                    tagName: 'html',
                  },
                  head: {
                    type: 'head',
                  },
                  stylable: [
                    'background',
                    'background-color',
                    'background-image',
                    'background-repeat',
                    'background-attachment',
                    'background-position',
                    'background-size',
                  ],
                  type: 'wrapper',
                },
                id: 'data-variable-id',
              },
            ],
            id: 'data-variable-id',
            type: 'main',
          },
        ],
        styles: [],
        symbols: [],
        dataSources: [componentDataSource],
      };

      editor.loadProjectData(componentProjectData);
      const components = editor.getComponents();

      const component = components.models[0];
      const html = component.toHTML();
      expect(html).toContain('Hello World');
    });

    test('StyleDataVariable', () => {
      const componentProjectData: ProjectData = {
        pages: [
          {
            frames: [
              {
                component: {
                  components: [
                    {
                      attributes: {
                        id: 'selectorid',
                      },
                      content: 'Hello World',
                      tagName: 'h1',
                      type: 'text',
                    },
                  ],
                },
              },
            ],
          },
        ],
        styles: [
          {
            selectors: ['#selectorid'],
            style: {
              color: {
                path: 'colors-data.id1.color',
                type: DataVariableType,
                defaultValue: 'black',
              },
            },
          },
        ],
        dataSources: [styleDataSource],
      };

      editor.loadProjectData(componentProjectData);

      const component = editor.getComponents().models[0];
      const style = component.getStyle();
      expect(style).toEqual({ color: 'red' });

      // Further validation: ensure the style updates when the data source changes
      const loadedDsm = editor.DataSources;
      const colorsDatasource = loadedDsm.get('colors-data');
      colorsDatasource.getRecord('id1')?.set({ color: 'blue' });

      const updatedStyle = component.getStyle();
      expect(updatedStyle).toEqual({ color: 'blue' });
      const unresolvedStyle = component.getStyle({ skipResolve: true });
      expect(unresolvedStyle).toEqual({
        color: {
          path: 'colors-data.id1.color',
          type: DataVariableType,
          defaultValue: 'black',
        },
      });
    });

    test('should resolve styles, props, and attributes if the entire datasource is added after load', () => {
      const styleVar = {
        type: DataVariableType,
        defaultValue: 'black',
        path: 'new-unified-data.styleRecord.color',
      };
      const propAttrVar = {
        type: DataVariableType,
        defaultValue: 'default-value',
        path: 'new-unified-data.propRecord.value',
      };

      const componentProjectData: ProjectData = {
        pages: [
          {
            frames: [
              {
                component: {
                  components: [
                    {
                      attributes: { id: 'selectorid', 'data-test': propAttrVar },
                      tagName: 'div',
                      customProp: propAttrVar,
                    },
                  ],
                },
              },
            ],
          },
        ],
        styles: [{ selectors: ['#selectorid'], style: { color: styleVar } }],
        dataSources: [], // Start with no datasources
      };

      editor.loadProjectData(componentProjectData);
      const component = editor.getComponents().at(0); // Assert fallback to defaults before adding the data source

      expect(component.getStyle()).toEqual({ color: 'black' });
      expect(component.get('customProp')).toBe('default-value');
      expect(component.getAttributes()['data-test']).toBe('default-value');

      editor.DataSources.add({
        id: 'new-unified-data',
        records: [
          { id: 'styleRecord', color: 'green' },
          { id: 'propRecord', value: 'resolved-value' },
        ],
      });

      expect(component.getStyle()).toEqual({ color: 'green' });
      expect(component.get('customProp')).toBe('resolved-value');
      expect(component.getAttributes()['data-test']).toBe('resolved-value');
    });

    test('should resolve styles, props, and attributes if a record is added to an existing datasource after load', () => {
      const styleVar = {
        type: DataVariableType,
        defaultValue: 'black',
        path: 'unified-source.newStyleRecord.color',
      };
      const propAttrVar = {
        type: DataVariableType,
        defaultValue: 'default-value',
        path: 'unified-source.newPropRecord.value',
      };

      const componentProjectData: ProjectData = {
        pages: [
          {
            frames: [
              {
                component: {
                  components: [
                    {
                      attributes: { id: 'selectorid', 'data-test': propAttrVar },
                      tagName: 'div',
                      customProp: propAttrVar,
                    },
                  ],
                },
              },
            ],
          },
        ],
        styles: [{ selectors: ['#selectorid'], style: { color: styleVar } }],
        dataSources: [{ id: 'unified-source', records: [] }], // Data source exists but is empty
      };

      editor.loadProjectData(componentProjectData);
      const component = editor.getComponents().at(0); // Assert fallback to defaults because records are missing

      expect(component.getStyle()).toEqual({ color: 'black' });
      expect(component.get('customProp')).toBe('default-value');
      expect(component.getAttributes()['data-test']).toBe('default-value');

      const ds = editor.DataSources.get('unified-source');
      ds?.addRecord({ id: 'newStyleRecord', color: 'purple' });
      ds?.addRecord({ id: 'newPropRecord', value: 'resolved-record-value' });

      expect(component.getStyle()).toEqual({ color: 'purple' });
      expect(component.get('customProp')).toBe('resolved-record-value');
      expect(component.getAttributes()['data-test']).toBe('resolved-record-value');
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: storage.ts]---
Location: grapesjs-dev/packages/core/test/specs/data_sources/storage.ts
Signals: TypeORM

```typescript
import Editor from '../../../src/editor';
import DataSourceManager from '../../../src/data_sources';
import ComponentWrapper from '../../../src/dom_components/model/ComponentWrapper';
import { DataVariableType } from '../../../src/data_sources/model/DataVariable';
import EditorModel from '../../../src/editor/model/Editor';
import { DataSourceProps } from '../../../src/data_sources/types';
import { filterObjectForSnapshot, setupTestEditor } from '../../common';
import { ProjectData } from '../../../src/storage_manager';

describe('DataSource Storage', () => {
  let editor: Editor;
  let em: EditorModel;
  let dsm: DataSourceManager;
  let cmpRoot: ComponentWrapper;
  type Record = { id: string; content: string };
  const storedDataSource: DataSourceProps<Record> = {
    id: 'component-storage',
    records: [{ id: 'id1', content: 'Hello World' }],
  };

  const nonStoredDataSource: DataSourceProps<Record> = {
    id: 'component-non-storage',
    records: [{ id: 'id1', content: 'Hello World' }],
    skipFromStorage: true,
  };

  beforeEach(() => {
    ({ editor, em, dsm, cmpRoot } = setupTestEditor());

    dsm.add(storedDataSource);
    dsm.add(nonStoredDataSource);
  });

  afterEach(() => {
    em.destroy();
  });

  describe('.getProjectData', () => {
    test('ComponentDataVariable', () => {
      const dataVariable = {
        type: DataVariableType,
        dataResolver: { defaultValue: 'default', path: `${storedDataSource.id}.id1.content` },
      };

      cmpRoot.append({
        tagName: 'h1',
        type: 'text',
        components: [dataVariable],
      })[0];

      const projectData = editor.getProjectData();
      const page = projectData.pages[0];
      const frame = page.frames[0];
      const component = frame.component.components[0];
      expect(component.components[0]).toEqual(dataVariable);

      const snapshot = filterObjectForSnapshot(projectData);
      expect(snapshot).toMatchSnapshot(``);

      const dataSources = projectData.dataSources;
      expect(dataSources).toEqual([
        {
          id: storedDataSource.id,
          records: storedDataSource.records,
        },
      ]);
    });
  });

  describe('.loadProjectData', () => {
    test('ComponentDataVariable', () => {
      const componentProjectData: ProjectData = {
        assets: [],
        dataSources: [
          {
            id: storedDataSource.id,
            records: storedDataSource.records,
          },
        ],
        pages: [
          {
            frames: [
              {
                component: {
                  components: [
                    {
                      components: [
                        {
                          type: DataVariableType,
                          dataResolver: { defaultValue: 'default', path: `${storedDataSource.id}.id1.content` },
                        },
                      ],
                      tagName: 'h1',
                      type: 'text',
                    },
                  ],
                  docEl: {
                    tagName: 'html',
                  },
                  head: {
                    type: 'head',
                  },
                  stylable: [
                    'background',
                    'background-color',
                    'background-image',
                    'background-repeat',
                    'background-attachment',
                    'background-position',
                    'background-size',
                  ],
                  type: 'wrapper',
                },
                id: 'frame-id',
              },
            ],
            id: 'page-id',
            type: 'main',
          },
        ],
        styles: [],
        symbols: [],
      };

      editor.loadProjectData(componentProjectData);

      const dataSource = dsm.get(storedDataSource.id);
      const record = dataSource?.getRecord('id1');
      expect(record?.get('content')).toBe('Hello World');

      expect(editor.getHtml()).toEqual('<body><h1><div>Hello World</div></h1></body>');

      record?.set('content', 'Hello World Updated');

      expect(editor.getHtml()).toEqual('<body><h1><div>Hello World Updated</div></h1></body>');

      const reloadedProjectData = editor.getProjectData();
      const snapshot = filterObjectForSnapshot(reloadedProjectData);
      expect(snapshot).toMatchSnapshot(``);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: transformers.ts]---
Location: grapesjs-dev/packages/core/test/specs/data_sources/transformers.ts
Signals: TypeORM

```typescript
import DataSourceManager from '../../../src/data_sources';
import ComponentWrapper from '../../../src/dom_components/model/ComponentWrapper';
import { DataVariableType } from '../../../src/data_sources/model/DataVariable';
import { DataSourceProps } from '../../../src/data_sources/types';
import { setupTestEditor } from '../../common';
import EditorModel from '../../../src/editor/model/Editor';

describe('DataSource Transformers', () => {
  let em: EditorModel;
  let dsm: DataSourceManager;
  let cmpRoot: ComponentWrapper;

  beforeEach(() => {
    ({ em, dsm, cmpRoot } = setupTestEditor());
  });

  afterEach(() => {
    em.destroy();
  });

  test('should assert that onRecordSetValue is called when adding a record', () => {
    type Record = { id: string; content: string };
    const testDataSource: DataSourceProps<Record> = {
      id: 'test-data-source',
      records: [],
      transformers: {
        onRecordSetValue: ({ key, value }) => {
          if (key !== 'content') {
            return value;
          }

          return (value as string).toUpperCase();
        },
      },
    };
    dsm.add(testDataSource);

    const cmp = cmpRoot.append({
      tagName: 'h1',
      type: 'text',
      components: [
        {
          type: DataVariableType,
          dataResolver: { defaultValue: 'default', path: 'test-data-source.id1.content' },
        },
      ],
    })[0];

    const ds = dsm.get('test-data-source');
    ds.addRecord({ id: 'id1', content: 'i love grapes' });

    const el = cmp.getEl();
    expect(el?.innerHTML).toContain('I LOVE GRAPES');
    expect(cmp.getInnerHTML()).toContain('I LOVE GRAPES');

    const result = ds.getRecord('id1')?.get('content');
    expect(result).toBe('I LOVE GRAPES');
  });

  test('should assert that onRecordSetValue is called when setting a value on a record', () => {
    type Record = { id: string; content: string };
    const testDataSource: DataSourceProps<Record> = {
      id: 'test-data-source',
      records: [],
      transformers: {
        onRecordSetValue: ({ id, key, value }) => {
          if (key !== 'content') {
            return value;
          }

          if (typeof value !== 'string') {
            throw new Error('Value must be a string');
          }

          return value.toUpperCase();
        },
      },
    };
    dsm.add(testDataSource);

    const cmp = cmpRoot.append({
      tagName: 'h1',
      type: 'text',
      components: [
        {
          type: DataVariableType,
          dataResolver: { defaultValue: 'default', path: 'test-data-source.id1.content' },
        },
      ],
    })[0];

    const ds = dsm.get('test-data-source');
    const dr = ds.addRecord({ id: 'id1', content: 'i love grapes' });

    expect(() => dr.set('content', 123)).toThrowError('Value must be a string');
    expect(() => dr.set({ content: 123 })).toThrowError('Value must be a string');

    dr.set({ content: 'I LOVE GRAPES' });

    const el = cmp.getEl();
    expect(el?.innerHTML).toContain('I LOVE GRAPES');
    expect(cmp.getInnerHTML()).toContain('I LOVE GRAPES');

    const result = ds.getRecord('id1')?.get('content');
    expect(result).toBe('I LOVE GRAPES');
  });
});
```

--------------------------------------------------------------------------------

````
