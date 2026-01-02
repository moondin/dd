---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 83
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 83 of 97)

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

---[FILE: ComponentDataCollectionWithDataVariable.ts]---
Location: grapesjs-dev/packages/core/test/specs/data_sources/model/data_collection/ComponentDataCollectionWithDataVariable.ts
Signals: TypeORM

```typescript
import { Component, DataRecord, DataSource, DataSourceManager, Editor } from '../../../../../src';
import { DataVariableType } from '../../../../../src/data_sources/model/DataVariable';
import {
  ComponentDataCollectionProps,
  DataCollectionStateType,
} from '../../../../../src/data_sources/model/data_collection/types';
import { DataComponentTypes } from '../../../../../src/data_sources/types';
import EditorModel from '../../../../../src/editor/model/Editor';
import { ProjectData } from '../../../../../src/storage_manager';
import { setupTestEditor } from '../../../../common';

const DataCollectionItemType = DataComponentTypes.collectionItem;
const DataCollectionType = DataComponentTypes.collection;

describe('Collection variable components', () => {
  let em: EditorModel;
  let editor: Editor;
  let dsm: DataSourceManager;
  let dataSource: DataSource;
  let wrapper: Component;
  let firstRecord: DataRecord;
  let secondRecord: DataRecord;

  beforeEach(() => {
    ({ em, editor, dsm } = setupTestEditor());
    wrapper = em.getWrapper()!;
    dataSource = dsm.add({
      id: 'my_data_source_id',
      records: [
        { id: 'user1', user: 'user1', age: '12' },
        { id: 'user2', user: 'user2', age: '14' },
        { id: 'user3', user: 'user3', age: '16' },
      ],
    });

    firstRecord = dataSource.getRecord('user1')!;
    secondRecord = dataSource.getRecord('user2')!;
  });

  afterEach(() => {
    em.destroy();
  });

  test('Gets the correct static value', async () => {
    const cmpDef = {
      type: DataCollectionType,
      components: {
        type: 'default',
        components: [
          {
            type: DataVariableType,
            dataResolver: {
              variableType: DataCollectionStateType.currentItem,
              collectionId: 'my_collection',
              path: 'user',
            },
          },
        ],
      },
      dataResolver: {
        collectionId: 'my_collection',
        dataSource: {
          type: DataVariableType,
          path: 'my_data_source_id',
        },
      },
    } as ComponentDataCollectionProps;
    const cmp = wrapper.components(cmpDef)[0];

    const firstGrandchild = cmp.components().at(0).components().at(0);
    expect(firstGrandchild.getInnerHTML()).toContain('user1');
    expect(firstGrandchild.getEl()?.innerHTML).toContain('user1');

    const secondGrandchild = cmp.components().at(1).components().at(0);
    expect(secondGrandchild.getInnerHTML()).toContain('user2');
    expect(secondGrandchild.getEl()?.innerHTML).toContain('user2');
  });

  test('Watches collection variable changes', async () => {
    const cmpDef = {
      type: DataCollectionType,
      components: {
        type: 'default',
        components: {
          type: DataVariableType,
          dataResolver: {
            variableType: DataCollectionStateType.currentItem,
            collectionId: 'my_collection',
            path: 'user',
          },
        },
      },
      dataResolver: {
        collectionId: 'my_collection',
        dataSource: {
          type: DataVariableType,
          path: 'my_data_source_id',
        },
      },
    } as ComponentDataCollectionProps;
    const cmp = wrapper.components(cmpDef)[0];
    firstRecord.set('user', 'new_correct_value');

    const firstGrandchild = cmp.components().at(0).components().at(0);
    expect(firstGrandchild.getInnerHTML()).toContain('new_correct_value');
    expect(firstGrandchild.getEl()?.innerHTML).toContain('new_correct_value');

    const secondGrandchild = cmp.components().at(1).components().at(0);
    expect(secondGrandchild.getInnerHTML()).toContain('user2');
    expect(secondGrandchild.getEl()?.innerHTML).toContain('user2');
  });

  describe('Serialization', () => {
    let cmp: Component;

    beforeEach(() => {
      const variableCmpDef = {
        type: DataVariableType,
        attributes: { id: 'cmp-coll-item-child' },
        dataResolver: {
          variableType: DataCollectionStateType.currentItem,
          collectionId: 'my_collection',
          path: 'user',
        },
      };

      const collectionCmpDef = {
        type: DataCollectionType,
        attributes: { id: 'cmp-coll' },
        components: {
          type: DataCollectionItemType,
          attributes: { id: 'cmp-coll-item' },
          components: [
            {
              type: 'default',
              attributes: { id: 'cmp-coll-item-child-1' },
            },
            variableCmpDef,
          ],
        },
        dataResolver: {
          collectionId: 'my_collection',
          startIndex: 0,
          endIndex: 2,
          dataSource: {
            type: DataVariableType,
            path: 'my_data_source_id',
          },
        },
      } as ComponentDataCollectionProps;

      cmp = wrapper.components(collectionCmpDef)[0];
    });

    test('Serializion to JSON', () => {
      expect(cmp.toJSON()).toMatchSnapshot(`Collection with collection variable component ( no grandchildren )`);

      const firstChild = cmp.components().at(0);
      const newChildDefinition = {
        type: DataVariableType,
        attributes: { id: 'cmp-var' },
        dataResolver: {
          variableType: DataCollectionStateType.currentIndex,
          collectionId: 'my_collection',
          path: 'user',
        },
      };
      firstChild.components().at(0).components(newChildDefinition);
      expect(cmp.toJSON()).toMatchSnapshot(`Collection with collection variable component ( with grandchildren )`);
    });

    test('Saving', () => {
      const projectData = editor.getProjectData();
      const page = projectData.pages[0];
      const frame = page.frames[0];
      const component = frame.component.components[0];

      expect(component).toMatchSnapshot(`Collection with collection variable component ( no grandchildren )`);

      const firstChild = cmp.components().at(0);
      const newChildDefinition = {
        type: DataVariableType,
        attributes: { id: 'cmp-var' },
        dataResolver: {
          variableType: DataCollectionStateType.currentIndex,
          collectionId: 'my_collection',
          path: 'user',
        },
      };

      firstChild.components().at(0).components(newChildDefinition);
      expect(cmp.toJSON()).toMatchSnapshot(`Collection with collection variable component ( with grandchildren )`);
    });

    test('Loading', () => {
      const cmpDef = {
        components: {
          components: [
            {
              type: DataVariableType,
              dataResolver: {
                variableType: DataCollectionStateType.currentItem,
                collectionId: 'my_collection',
                path: 'user',
              },
            },
          ],
          type: 'default',
        },
        dataResolver: {
          collectionId: 'my_collection',
          dataSource: {
            path: 'my_data_source_id',
            type: DataVariableType,
          },
          endIndex: 1,
          startIndex: 0,
        },
        type: DataCollectionType,
      } as ComponentDataCollectionProps;

      const componentProjectData: ProjectData = {
        assets: [],
        pages: [
          {
            frames: [
              {
                component: {
                  components: [cmpDef],
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
        dataSources: [dataSource],
      };
      editor.loadProjectData(componentProjectData);

      const components = editor.getComponents();
      const component = components.models[0];
      const firstChild = component.components().at(0);
      const firstGrandchild = firstChild.components().at(0);
      const secondChild = component.components().at(1);
      const secondGrandchild = secondChild.components().at(0);

      expect(firstGrandchild.getInnerHTML()).toBe('user1');
      expect(secondGrandchild.getInnerHTML()).toBe('user2');

      firstRecord.set('user', 'new_user1_value');
      expect(firstGrandchild.getInnerHTML()).toBe('new_user1_value');
      expect(secondGrandchild.getInnerHTML()).toBe('user2');

      secondRecord.set('user', 'new_user2_value');
      expect(firstGrandchild.getInnerHTML()).toBe('new_user1_value');
      expect(secondGrandchild.getInnerHTML()).toBe('new_user2_value');
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: nestedComponentDataCollections.ts]---
Location: grapesjs-dev/packages/core/test/specs/data_sources/model/data_collection/nestedComponentDataCollections.ts
Signals: TypeORM

```typescript
import { Component, DataRecord, DataSource, DataSourceManager } from '../../../../../src';
import { DataVariableType } from '../../../../../src/data_sources/model/DataVariable';
import ComponentDataCollection from '../../../../../src/data_sources/model/data_collection/ComponentDataCollection';
import {
  ComponentDataCollectionProps,
  DataCollectionStateType,
} from '../../../../../src/data_sources/model/data_collection/types';
import { DataComponentTypes } from '../../../../../src/data_sources/types';
import EditorModel from '../../../../../src/editor/model/Editor';
import { setupTestEditor } from '../../../../common';

const DataCollectionItemType = DataComponentTypes.collectionItem;
const DataCollectionType = DataComponentTypes.collection;

describe('Collection component', () => {
  let em: EditorModel;
  let dsm: DataSourceManager;
  let dataSource: DataSource;
  let nestedDataSource: DataSource;
  let wrapper: Component;
  let firstRecord: DataRecord;
  let firstNestedRecord: DataRecord;
  let cmpDef: ComponentDataCollectionProps | undefined;
  let nestedCmpDef: ComponentDataCollectionProps | undefined;
  let parentCmp: ComponentDataCollection;
  let nestedCmp: ComponentDataCollection;

  function getCmpDef(nestedCmpDef: ComponentDataCollectionProps): ComponentDataCollectionProps {
    return {
      type: DataCollectionType,
      attributes: { id: 'cmp-coll-parent' },
      components: {
        type: DataCollectionItemType,
        attributes: { id: 'cmp-coll-parent-item' },
        components: nestedCmpDef,
      },
      dataResolver: {
        collectionId: 'parent_collection',
        dataSource: {
          type: DataVariableType,
          path: 'my_data_source_id',
        },
      },
    };
  }

  beforeEach(() => {
    ({ em, dsm } = setupTestEditor());
    wrapper = em.getWrapper()!;
    dataSource = dsm.add({
      id: 'my_data_source_id',
      records: [
        { id: 'user1', user: 'user1', age: '12' },
        { id: 'user2', user: 'user2', age: '14' },
      ],
    });

    nestedDataSource = dsm.add({
      id: 'nested_data_source_id',
      records: [
        { id: 'nested_user1', user: 'nested_user1', age: '12' },
        { id: 'nested_user2', user: 'nested_user2', age: '14' },
        { id: 'nested_user3', user: 'nested_user3', age: '16' },
      ],
    });

    firstRecord = dataSource.getRecord('user1')!;
    firstNestedRecord = nestedDataSource.getRecord('nested_user1')!;

    nestedCmpDef = {
      type: DataCollectionType,
      attributes: { id: 'cmp-coll' },
      components: {
        type: DataCollectionItemType,
        attributes: { id: 'cmp-coll-item' },
        components: {
          type: 'default',
          attributes: { id: 'cmp-coll-item-child-1' },
          name: {
            type: DataVariableType,
            variableType: DataCollectionStateType.currentItem,
            collectionId: 'nested_collection',
            path: 'user',
          },
        },
      },
      dataResolver: {
        collectionId: 'nested_collection',
        dataSource: {
          type: DataVariableType,
          path: 'nested_data_source_id',
        },
      },
    };

    cmpDef = getCmpDef(nestedCmpDef);

    parentCmp = wrapper.components(cmpDef)[0] as unknown as ComponentDataCollection;
    nestedCmp = parentCmp.getCollectionItemComponents().at(0) as ComponentDataCollection;
  });

  afterEach(() => {
    em.destroy();
    nestedCmpDef = undefined;
    cmpDef = undefined;
  });

  test('Nested collections bind to correct data sources', () => {
    const nestedFirstChild = nestedCmp.components().at(0).components().at(0);
    const nestedSecondChild = nestedCmp.components().at(1).components().at(0);

    expect(nestedFirstChild.get('name')).toBe('nested_user1');
    expect(nestedSecondChild.get('name')).toBe('nested_user2');
  });

  test('Updates in parent collection propagate to nested collections', () => {
    const nestedFirstChild = nestedCmp.components().at(0).components().at(0);
    const nestedSecondChild = nestedCmp.components().at(1).components().at(0);

    firstNestedRecord.set('user', 'updated_user1');
    expect(nestedFirstChild.get('name')).toBe('updated_user1');
    expect(nestedSecondChild.get('name')).toBe('nested_user2');
  });

  test('Nested collections are correctly serialized', () => {
    const serialized = parentCmp.toJSON();
    expect(serialized).toMatchSnapshot();
  });

  test('Nested collections respect startIndex and endIndex', () => {
    nestedCmpDef = {
      type: DataCollectionType,
      components: {
        type: DataCollectionItemType,
        components: {
          type: 'default',
          name: {
            type: DataVariableType,
            variableType: DataCollectionStateType.currentItem,
            collectionId: 'nested_collection',
            path: 'user',
          },
        },
      },
      dataResolver: {
        collectionId: 'nested_collection',
        startIndex: 0,
        endIndex: 1,
        dataSource: {
          type: DataVariableType,
          path: 'nested_data_source_id',
        },
      },
    };

    const updatedParentCmp = wrapper.components(getCmpDef(nestedCmpDef))[0] as unknown as ComponentDataCollection;
    const updatedNestedCmp = updatedParentCmp.getCollectionItemComponents().at(0) as ComponentDataCollection;
    expect(updatedNestedCmp.getItemsCount()).toBe(2);
  });

  test('Nested collection gets and watches value from the parent collection', () => {
    nestedCmpDef = {
      type: DataCollectionType,
      components: {
        type: DataCollectionItemType,
        components: {
          type: 'default',
          name: {
            type: DataVariableType,
            variableType: DataCollectionStateType.currentItem,
            collectionId: 'parent_collection',
            path: 'user',
          },
        },
      },
      dataResolver: {
        collectionId: 'nested_collection',
        startIndex: 0,
        endIndex: 1,
        dataSource: {
          type: DataVariableType,
          path: 'nested_data_source_id',
        },
      },
    };

    const updatedParentCmp = wrapper.components(getCmpDef(nestedCmpDef))[0] as unknown as ComponentDataCollection;
    const updatedNestedCmp = updatedParentCmp.getCollectionItemComponents().at(0) as ComponentDataCollection;
    const firstNestedChild = updatedNestedCmp.getCollectionItemComponents().at(0);

    expect(firstNestedChild.get('name')).toBe('user1');
    firstRecord.set('user', 'updated_user1');
    expect(firstNestedChild.get('name')).toBe('updated_user1');
  });

  test('Nested collection switches to using its own collection variable', () => {
    const firstChild = nestedCmp.components().at(0).components().at(0);

    firstChild.set('name', {
      // @ts-ignore
      type: DataVariableType,
      variableType: DataCollectionStateType.currentItem,
      path: 'user',
      collectionId: 'nested_collection',
    });

    expect(firstChild.get('name')).toBe('nested_user1');
  });

  describe('Nested Collection Component with Parent and Nested Data Sources', () => {
    beforeEach(() => {
      nestedCmpDef = {
        type: DataCollectionType,
        name: {
          type: DataVariableType,
          variableType: DataCollectionStateType.currentItem,
          collectionId: 'parent_collection',
          path: 'user',
        },
        components: {
          type: DataCollectionItemType,
          components: {
            type: 'default',
            name: {
              type: DataVariableType,
              variableType: DataCollectionStateType.currentItem,
              collectionId: 'nested_collection',
              path: 'user',
            },
          },
        },
        dataResolver: {
          collectionId: 'nested_collection',
          dataSource: {
            type: DataVariableType,
            path: 'nested_data_source_id',
          },
        },
      };

      parentCmp = wrapper.components(getCmpDef(nestedCmpDef))[0] as unknown as ComponentDataCollection;
      nestedCmp = parentCmp.getCollectionItemComponents().at(0) as ComponentDataCollection;
    });

    test('Removing a record from the parent data source updates the parent collection correctly', () => {
      expect(parentCmp.getItemsCount()).toBe(2);
      dataSource.removeRecord('user1');
      expect(parentCmp.getItemsCount()).toBe(1);
      expect(parentCmp.components().at(0).components().at(0).get('name')).toBe('user2');
      expect(nestedCmp.getItemsCount()).toBe(3);
      expect(nestedCmp.components().at(0).components().at(0).get('name')).toBe('nested_user1');
    });

    test('Adding a record to the parent data source updates the parent collection correctly', () => {
      expect(parentCmp.getItemsCount()).toBe(2);
      dataSource.addRecord({ id: 'user3', user: 'user3', age: '16' });
      expect(parentCmp.getItemsCount()).toBe(3);
      expect(parentCmp.components().at(2).components().at(0).get('name')).toBe('user3');
      expect(nestedCmp.getItemsCount()).toBe(3);
      expect(nestedCmp.components().at(0).components().at(0).get('name')).toBe('nested_user1');
    });

    test('Removing a record from the nested data source updates the nested collection correctly', () => {
      expect(nestedCmp.getItemsCount()).toBe(3);
      nestedDataSource.removeRecord('nested_user1');
      expect(nestedCmp.getItemsCount()).toBe(2);
      expect(nestedCmp.components().at(0).components().at(0).get('name')).toBe('nested_user2');
      expect(nestedCmp.components().at(1).components().at(0).get('name')).toBe('nested_user3');
    });

    test('Adding a record to the nested data source updates the nested collection correctly', () => {
      expect(nestedCmp.getItemsCount()).toBe(3);
      expect(nestedCmp.components().at(0).components().at(0).get('name')).toBe('nested_user1');
      expect(nestedCmp.components().at(1).components().at(0).get('name')).toBe('nested_user2');
      expect(nestedCmp.components().at(2).components().at(0).get('name')).toBe('nested_user3');

      nestedDataSource.addRecord({ id: 'user4', user: 'nested_user4', age: '18' });
      expect(nestedCmp.getItemsCount()).toBe(4);
      expect(nestedCmp.components().at(3).components().at(0).get('name')).toBe('nested_user4');
      expect(nestedCmp.components().at(0).components().at(0).get('name')).toBe('nested_user1');
      expect(nestedCmp.components().at(1).components().at(0).get('name')).toBe('nested_user2');
      expect(nestedCmp.components().at(2).components().at(0).get('name')).toBe('nested_user3');
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ComponentDataCollection.ts.snap]---
Location: grapesjs-dev/packages/core/test/specs/data_sources/model/data_collection/__snapshots__/ComponentDataCollection.ts.snap

```text
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`Collection component Serialization Saving: Collection with grandchildren 1`] = `
{
  "attributes": {
    "id": "cmp-coll",
  },
  "components": [
    {
      "attributes": {
        "id": "cmp-coll-item",
      },
      "components": [
        {
          "attributes": {
            "attribute_trait": {
              "collectionId": "my_collection",
              "path": "user",
              "type": "data-variable",
              "variableType": "currentItem",
            },
            "id": "cmp-coll-item-child-1",
            "name": {
              "collectionId": "my_collection",
              "path": "user",
              "type": "data-variable",
              "variableType": "currentItem",
            },
          },
          "components": [
            {
              "attributes": {
                "id": "cmp-coll-item-child-UP",
              },
              "name": {
                "collectionId": "my_collection",
                "path": "user",
                "type": "data-variable",
                "variableType": "currentIndex",
              },
              "type": "default",
            },
          ],
          "custom_prop": {
            "collectionId": "my_collection",
            "path": "user",
            "type": "data-variable",
            "variableType": "currentIndex",
          },
          "name": {
            "collectionId": "my_collection",
            "path": "user",
            "type": "data-variable",
            "variableType": "currentItem",
          },
          "property_trait": {
            "collectionId": "my_collection",
            "path": "user",
            "type": "data-variable",
            "variableType": "currentItem",
          },
          "type": "default",
        },
      ],
      "type": "data-collection-item",
    },
  ],
  "dataResolver": {
    "collectionId": "my_collection",
    "dataSource": {
      "path": "my_data_source_id",
      "type": "data-variable",
    },
    "endIndex": 1,
    "startIndex": 0,
  },
  "type": "data-collection",
}
`;

exports[`Collection component Serialization Saving: Collection with no grandchildren 1`] = `
{
  "attributes": {
    "id": "cmp-coll",
  },
  "components": [
    {
      "attributes": {
        "id": "cmp-coll-item",
      },
      "components": [
        {
          "attributes": {
            "attribute_trait": {
              "collectionId": "my_collection",
              "path": "user",
              "type": "data-variable",
              "variableType": "currentItem",
            },
            "id": "cmp-coll-item-child-1",
            "name": {
              "collectionId": "my_collection",
              "path": "user",
              "type": "data-variable",
              "variableType": "currentItem",
            },
          },
          "components": [
            {
              "attributes": {
                "attribute_trait": {
                  "collectionId": "my_collection",
                  "path": "user",
                  "type": "data-variable",
                  "variableType": "currentItem",
                },
                "id": "cmp-coll-item-child-1-1",
                "name": {
                  "collectionId": "my_collection",
                  "path": "user",
                  "type": "data-variable",
                  "variableType": "currentItem",
                },
              },
              "custom_prop": {
                "collectionId": "my_collection",
                "path": "user",
                "type": "data-variable",
                "variableType": "currentIndex",
              },
              "name": {
                "collectionId": "my_collection",
                "path": "user",
                "type": "data-variable",
                "variableType": "currentItem",
              },
              "property_trait": {
                "collectionId": "my_collection",
                "path": "user",
                "type": "data-variable",
                "variableType": "currentItem",
              },
              "type": "default",
            },
            {
              "attributes": {
                "attribute_trait": {
                  "collectionId": "my_collection",
                  "path": "user",
                  "type": "data-variable",
                  "variableType": "currentItem",
                },
                "id": "cmp-coll-item-child-1-2",
                "name": {
                  "collectionId": "my_collection",
                  "path": "user",
                  "type": "data-variable",
                  "variableType": "currentItem",
                },
              },
              "custom_prop": {
                "collectionId": "my_collection",
                "path": "user",
                "type": "data-variable",
                "variableType": "currentIndex",
              },
              "name": {
                "collectionId": "my_collection",
                "path": "user",
                "type": "data-variable",
                "variableType": "currentItem",
              },
              "property_trait": {
                "collectionId": "my_collection",
                "path": "user",
                "type": "data-variable",
                "variableType": "currentItem",
              },
              "type": "default",
            },
          ],
          "custom_prop": {
            "collectionId": "my_collection",
            "path": "user",
            "type": "data-variable",
            "variableType": "currentIndex",
          },
          "name": {
            "collectionId": "my_collection",
            "path": "user",
            "type": "data-variable",
            "variableType": "currentItem",
          },
          "property_trait": {
            "collectionId": "my_collection",
            "path": "user",
            "type": "data-variable",
            "variableType": "currentItem",
          },
          "type": "default",
        },
      ],
      "type": "data-collection-item",
    },
  ],
  "dataResolver": {
    "collectionId": "my_collection",
    "dataSource": {
      "path": "my_data_source_id",
      "type": "data-variable",
    },
    "endIndex": 1,
    "startIndex": 0,
  },
  "type": "data-collection",
}
`;

exports[`Collection component Serialization Serializion with Collection Variables to JSON: Collection with grandchildren 1`] = `
{
  "attributes": {
    "id": "cmp-coll",
  },
  "components": [
    {
      "attributes": {
        "id": "cmp-coll-item",
      },
      "components": [
        {
          "attributes": {
            "attribute_trait": {
              "collectionId": "my_collection",
              "path": "user",
              "type": "data-variable",
              "variableType": "currentItem",
            },
            "id": "cmp-coll-item-child-1",
            "name": {
              "collectionId": "my_collection",
              "path": "user",
              "type": "data-variable",
              "variableType": "currentItem",
            },
          },
          "components": [
            {
              "attributes": {
                "attribute_trait": {
                  "collectionId": "my_collection",
                  "path": "user",
                  "type": "data-variable",
                  "variableType": "currentItem",
                },
                "id": "cmp-coll-item-child-1-1",
                "name": {
                  "collectionId": "my_collection",
                  "path": "user",
                  "type": "data-variable",
                  "variableType": "currentItem",
                },
              },
              "components": [
                {
                  "attributes": {
                    "id": "cmp-coll-item-child-UP",
                  },
                  "name": {
                    "collectionId": "my_collection",
                    "path": "user",
                    "type": "data-variable",
                    "variableType": "currentIndex",
                  },
                  "type": "default",
                },
              ],
              "custom_prop": {
                "collectionId": "my_collection",
                "path": "user",
                "type": "data-variable",
                "variableType": "currentIndex",
              },
              "name": {
                "collectionId": "my_collection",
                "path": "user",
                "type": "data-variable",
                "variableType": "currentItem",
              },
              "property_trait": {
                "collectionId": "my_collection",
                "path": "user",
                "type": "data-variable",
                "variableType": "currentItem",
              },
              "type": "default",
            },
            {
              "attributes": {
                "attribute_trait": {
                  "collectionId": "my_collection",
                  "path": "user",
                  "type": "data-variable",
                  "variableType": "currentItem",
                },
                "id": "cmp-coll-item-child-1-2",
                "name": {
                  "collectionId": "my_collection",
                  "path": "user",
                  "type": "data-variable",
                  "variableType": "currentItem",
                },
              },
              "custom_prop": {
                "collectionId": "my_collection",
                "path": "user",
                "type": "data-variable",
                "variableType": "currentIndex",
              },
              "name": {
                "collectionId": "my_collection",
                "path": "user",
                "type": "data-variable",
                "variableType": "currentItem",
              },
              "property_trait": {
                "collectionId": "my_collection",
                "path": "user",
                "type": "data-variable",
                "variableType": "currentItem",
              },
              "type": "default",
            },
          ],
          "custom_prop": {
            "collectionId": "my_collection",
            "path": "user",
            "type": "data-variable",
            "variableType": "currentIndex",
          },
          "name": {
            "collectionId": "my_collection",
            "path": "user",
            "type": "data-variable",
            "variableType": "currentItem",
          },
          "property_trait": {
            "collectionId": "my_collection",
            "path": "user",
            "type": "data-variable",
            "variableType": "currentItem",
          },
          "type": "default",
        },
      ],
      "type": "data-collection-item",
    },
  ],
  "dataResolver": {
    "collectionId": "my_collection",
    "dataSource": {
      "path": "my_data_source_id",
      "type": "data-variable",
    },
    "endIndex": 1,
    "startIndex": 0,
  },
  "type": "data-collection",
}
`;

exports[`Collection component Serialization Serializion with Collection Variables to JSON: Collection with no grandchildren 1`] = `
{
  "attributes": {
    "id": "cmp-coll",
  },
  "components": [
    {
      "attributes": {
        "id": "cmp-coll-item",
      },
      "components": [
        {
          "attributes": {
            "attribute_trait": {
              "collectionId": "my_collection",
              "path": "user",
              "type": "data-variable",
              "variableType": "currentItem",
            },
            "id": "cmp-coll-item-child-1",
            "name": {
              "collectionId": "my_collection",
              "path": "user",
              "type": "data-variable",
              "variableType": "currentItem",
            },
          },
          "components": [
            {
              "attributes": {
                "attribute_trait": {
                  "collectionId": "my_collection",
                  "path": "user",
                  "type": "data-variable",
                  "variableType": "currentItem",
                },
                "id": "cmp-coll-item-child-1-1",
                "name": {
                  "collectionId": "my_collection",
                  "path": "user",
                  "type": "data-variable",
                  "variableType": "currentItem",
                },
              },
              "custom_prop": {
                "collectionId": "my_collection",
                "path": "user",
                "type": "data-variable",
                "variableType": "currentIndex",
              },
              "name": {
                "collectionId": "my_collection",
                "path": "user",
                "type": "data-variable",
                "variableType": "currentItem",
              },
              "property_trait": {
                "collectionId": "my_collection",
                "path": "user",
                "type": "data-variable",
                "variableType": "currentItem",
              },
              "type": "default",
            },
            {
              "attributes": {
                "attribute_trait": {
                  "collectionId": "my_collection",
                  "path": "user",
                  "type": "data-variable",
                  "variableType": "currentItem",
                },
                "id": "cmp-coll-item-child-1-2",
                "name": {
                  "collectionId": "my_collection",
                  "path": "user",
                  "type": "data-variable",
                  "variableType": "currentItem",
                },
              },
              "custom_prop": {
                "collectionId": "my_collection",
                "path": "user",
                "type": "data-variable",
                "variableType": "currentIndex",
              },
              "name": {
                "collectionId": "my_collection",
                "path": "user",
                "type": "data-variable",
                "variableType": "currentItem",
              },
              "property_trait": {
                "collectionId": "my_collection",
                "path": "user",
                "type": "data-variable",
                "variableType": "currentItem",
              },
              "type": "default",
            },
          ],
          "custom_prop": {
            "collectionId": "my_collection",
            "path": "user",
            "type": "data-variable",
            "variableType": "currentIndex",
          },
          "name": {
            "collectionId": "my_collection",
            "path": "user",
            "type": "data-variable",
            "variableType": "currentItem",
          },
          "property_trait": {
            "collectionId": "my_collection",
            "path": "user",
            "type": "data-variable",
            "variableType": "currentItem",
          },
          "type": "default",
        },
      ],
      "type": "data-collection-item",
    },
  ],
  "dataResolver": {
    "collectionId": "my_collection",
    "dataSource": {
      "path": "my_data_source_id",
      "type": "data-variable",
    },
    "endIndex": 1,
    "startIndex": 0,
  },
  "type": "data-collection",
}
`;
```

--------------------------------------------------------------------------------

````
