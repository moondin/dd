---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 84
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 84 of 97)

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

---[FILE: ComponentDataCollectionWithDataVariable.ts.snap]---
Location: grapesjs-dev/packages/core/test/specs/data_sources/model/data_collection/__snapshots__/ComponentDataCollectionWithDataVariable.ts.snap

```text
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`Collection variable components Serialization Saving: Collection with collection variable component ( no grandchildren ) 1`] = `
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
            "id": "cmp-coll-item-child-1",
          },
          "type": "default",
        },
        {
          "attributes": {
            "id": "cmp-coll-item-child",
          },
          "dataResolver": {
            "collectionId": "my_collection",
            "path": "user",
            "variableType": "currentItem",
          },
          "type": "data-variable",
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
    "endIndex": 2,
    "startIndex": 0,
  },
  "type": "data-collection",
}
`;

exports[`Collection variable components Serialization Saving: Collection with collection variable component ( with grandchildren ) 1`] = `
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
            "id": "cmp-coll-item-child-1",
          },
          "components": [
            {
              "attributes": {
                "id": "cmp-var",
              },
              "dataResolver": {
                "collectionId": "my_collection",
                "path": "user",
                "variableType": "currentIndex",
              },
              "type": "data-variable",
            },
          ],
          "type": "default",
        },
        {
          "attributes": {
            "id": "cmp-coll-item-child",
          },
          "dataResolver": {
            "collectionId": "my_collection",
            "path": "user",
            "variableType": "currentItem",
          },
          "type": "data-variable",
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
    "endIndex": 2,
    "startIndex": 0,
  },
  "type": "data-collection",
}
`;

exports[`Collection variable components Serialization Serializion to JSON: Collection with collection variable component ( no grandchildren ) 1`] = `
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
            "id": "cmp-coll-item-child-1",
          },
          "type": "default",
        },
        {
          "attributes": {
            "id": "cmp-coll-item-child",
          },
          "dataResolver": {
            "collectionId": "my_collection",
            "path": "user",
            "variableType": "currentItem",
          },
          "type": "data-variable",
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
    "endIndex": 2,
    "startIndex": 0,
  },
  "type": "data-collection",
}
`;

exports[`Collection variable components Serialization Serializion to JSON: Collection with collection variable component ( with grandchildren ) 1`] = `
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
            "id": "cmp-coll-item-child-1",
          },
          "components": [
            {
              "attributes": {
                "id": "cmp-var",
              },
              "dataResolver": {
                "collectionId": "my_collection",
                "path": "user",
                "variableType": "currentIndex",
              },
              "type": "data-variable",
            },
          ],
          "type": "default",
        },
        {
          "attributes": {
            "id": "cmp-coll-item-child",
          },
          "dataResolver": {
            "collectionId": "my_collection",
            "path": "user",
            "variableType": "currentItem",
          },
          "type": "data-variable",
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
    "endIndex": 2,
    "startIndex": 0,
  },
  "type": "data-collection",
}
`;
```

--------------------------------------------------------------------------------

---[FILE: nestedComponentDataCollections.ts.snap]---
Location: grapesjs-dev/packages/core/test/specs/data_sources/model/data_collection/__snapshots__/nestedComponentDataCollections.ts.snap

```text
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`Collection component Nested collections are correctly serialized 1`] = `
{
  "attributes": {
    "id": "cmp-coll-parent",
  },
  "components": [
    {
      "attributes": {
        "id": "cmp-coll-parent-item",
      },
      "components": [
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
                    "id": "cmp-coll-item-child-1",
                  },
                  "name": {
                    "collectionId": "nested_collection",
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
            "collectionId": "nested_collection",
            "dataSource": {
              "path": "nested_data_source_id",
              "type": "data-variable",
            },
          },
          "type": "data-collection",
        },
      ],
      "type": "data-collection-item",
    },
  ],
  "dataResolver": {
    "collectionId": "parent_collection",
    "dataSource": {
      "path": "my_data_source_id",
      "type": "data-variable",
    },
  },
  "type": "data-collection",
}
`;
```

--------------------------------------------------------------------------------

---[FILE: jsonplaceholder.ts.snap]---
Location: grapesjs-dev/packages/core/test/specs/data_sources/__snapshots__/jsonplaceholder.ts.snap

```text
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`JsonPlaceholder Usage should render a list of comments from jsonplaceholder api 1`] = `
"<body>
  <div>
    <h4>
      <div>id labore ex et quam laborum</div>
    </h4>
    <p>
    <div>1</div>
    </p>
    <p>
    <div>laudantium enim quasi est quidem magnam voluptate ipsam eos
      tempora quo necessitatibus
      dolor quam autem quasi
      reiciendis et nam sapiente accusantium</div>
    </p>
  </div>
  <div>
    <h4>
      <div>quo vero reiciendis velit similique earum</div>
    </h4>
    <p>
    <div>2</div>
    </p>
    <p>
    <div>est natus enim nihil est dolore omnis voluptatem numquam
      et omnis occaecati quod ullam at
      voluptatem error expedita pariatur
      nihil sint nostrum voluptatem reiciendis et</div>
    </p>
  </div>
  <div>
    <h4>
      <div>odio adipisci rerum aut animi</div>
    </h4>
    <p>
    <div>3</div>
    </p>
    <p>
    <div>quia molestiae reprehenderit quasi aspernatur
      aut expedita occaecati aliquam eveniet laudantium
      omnis quibusdam delectus saepe quia accusamus maiores nam est
      cum et ducimus et vero voluptates excepturi deleniti ratione</div>
    </p>
  </div>
  <div>
    <h4>
      <div>alias odio sit</div>
    </h4>
    <p>
    <div>4</div>
    </p>
    <p>
    <div>non et atque
      occaecati deserunt quas accusantium unde odit nobis qui voluptatem
      quia voluptas consequuntur itaque dolor
      et qui rerum deleniti ut occaecati</div>
    </p>
  </div>
  <div>
    <h4>
      <div>vero eaque aliquid doloribus et culpa</div>
    </h4>
    <p>
    <div>5</div>
    </p>
    <p>
    <div>harum non quasi et ratione
      tempore iure ex voluptates in ratione
      harum architecto fugit inventore cupiditate
      voluptates magni quo et</div>
    </p>
  </div>
</body>"
`;
```

--------------------------------------------------------------------------------

---[FILE: serialization.ts.snap]---
Location: grapesjs-dev/packages/core/test/specs/data_sources/__snapshots__/serialization.ts.snap

```text
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`DataSource Serialization .getProjectData ComponentDataVariable 1`] = `
{
  "assets": [],
  "dataSources": [],
  "pages": [
    {
      "frames": [
        {
          "component": {
            "components": [
              {
                "components": [
                  {
                    "dataResolver": {
                      "defaultValue": "default",
                      "path": "component-serialization.id1.content",
                    },
                    "type": "data-variable",
                  },
                ],
                "tagName": "h1",
                "type": "text",
              },
            ],
            "docEl": {
              "tagName": "html",
            },
            "head": {
              "type": "head",
            },
            "stylable": [
              "background",
              "background-color",
              "background-image",
              "background-repeat",
              "background-attachment",
              "background-position",
              "background-size",
            ],
            "type": "wrapper",
          },
          "id": "data-variable-id",
        },
      ],
      "id": "data-variable-id",
      "type": "main",
    },
  ],
  "styles": [],
  "symbols": [],
}
`;

exports[`DataSource Serialization .getProjectData Dynamic Attributes 1`] = `
{
  "assets": [],
  "dataSources": [],
  "pages": [
    {
      "frames": [
        {
          "component": {
            "components": [
              {
                "attributes": {
                  "dynamicAttribute": {
                    "defaultValue": "default",
                    "path": "test-input.id1.value",
                    "type": "data-variable",
                  },
                },
                "tagName": "input",
                "void": true,
              },
            ],
            "docEl": {
              "tagName": "html",
            },
            "head": {
              "type": "head",
            },
            "stylable": [
              "background",
              "background-color",
              "background-image",
              "background-repeat",
              "background-attachment",
              "background-position",
              "background-size",
            ],
            "type": "wrapper",
          },
          "id": "data-variable-id",
        },
      ],
      "id": "data-variable-id",
      "type": "main",
    },
  ],
  "styles": [],
  "symbols": [],
}
`;

exports[`DataSource Serialization .getProjectData Dynamic Props 1`] = `
{
  "assets": [],
  "dataSources": [],
  "pages": [
    {
      "frames": [
        {
          "component": {
            "components": [
              {
                "content": {
                  "defaultValue": "default",
                  "path": "test-input.id1.value",
                  "type": "data-variable",
                },
                "customProp": {
                  "defaultValue": "default",
                  "path": "test-input.id1.value",
                  "type": "data-variable",
                },
                "tagName": "input",
                "void": true,
              },
            ],
            "docEl": {
              "tagName": "html",
            },
            "head": {
              "type": "head",
            },
            "stylable": [
              "background",
              "background-color",
              "background-image",
              "background-repeat",
              "background-attachment",
              "background-position",
              "background-size",
            ],
            "type": "wrapper",
          },
          "id": "data-variable-id",
        },
      ],
      "id": "data-variable-id",
      "type": "main",
    },
  ],
  "styles": [],
  "symbols": [],
}
`;

exports[`DataSource Serialization .getProjectData StyleDataVariable 1`] = `
{
  "assets": [],
  "dataSources": [],
  "pages": [
    {
      "frames": [
        {
          "component": {
            "components": [
              {
                "attributes": {
                  "id": "data-variable-id",
                },
                "content": "Hello World",
                "tagName": "h1",
                "type": "text",
              },
            ],
            "docEl": {
              "tagName": "html",
            },
            "head": {
              "type": "head",
            },
            "stylable": [
              "background",
              "background-color",
              "background-image",
              "background-repeat",
              "background-attachment",
              "background-position",
              "background-size",
            ],
            "type": "wrapper",
          },
          "id": "data-variable-id",
        },
      ],
      "id": "data-variable-id",
      "type": "main",
    },
  ],
  "styles": [
    {
      "selectors": [
        "data-variable-id",
      ],
      "style": {
        "color": {
          "defaultValue": "black",
          "path": "colors-data.id1.color",
          "type": "data-variable",
        },
      },
    },
  ],
  "symbols": [],
}
`;
```

--------------------------------------------------------------------------------

---[FILE: storage.ts.snap]---
Location: grapesjs-dev/packages/core/test/specs/data_sources/__snapshots__/storage.ts.snap

```text
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`DataSource Storage .getProjectData ComponentDataVariable 1`] = `
{
  "assets": [],
  "dataSources": [
    {
      "id": "data-variable-id",
      "records": [
        {
          "content": "Hello World",
          "id": "data-variable-id",
        },
      ],
    },
  ],
  "pages": [
    {
      "frames": [
        {
          "component": {
            "components": [
              {
                "components": [
                  {
                    "dataResolver": {
                      "defaultValue": "default",
                      "path": "component-storage.id1.content",
                    },
                    "type": "data-variable",
                  },
                ],
                "tagName": "h1",
                "type": "text",
              },
            ],
            "docEl": {
              "tagName": "html",
            },
            "head": {
              "type": "head",
            },
            "stylable": [
              "background",
              "background-color",
              "background-image",
              "background-repeat",
              "background-attachment",
              "background-position",
              "background-size",
            ],
            "type": "wrapper",
          },
          "id": "data-variable-id",
        },
      ],
      "id": "data-variable-id",
      "type": "main",
    },
  ],
  "styles": [],
  "symbols": [],
}
`;

exports[`DataSource Storage .loadProjectData ComponentDataVariable 1`] = `
{
  "assets": [],
  "dataSources": [
    {
      "id": "data-variable-id",
      "records": [
        {
          "content": "Hello World Updated",
          "id": "data-variable-id",
        },
      ],
    },
  ],
  "pages": [
    {
      "frames": [
        {
          "component": {
            "components": [
              {
                "components": [
                  {
                    "dataResolver": {
                      "defaultValue": "default",
                      "path": "component-storage.id1.content",
                    },
                    "type": "data-variable",
                  },
                ],
                "tagName": "h1",
                "type": "text",
              },
            ],
            "docEl": {
              "tagName": "html",
            },
            "head": {
              "type": "head",
            },
            "stylable": [
              "background",
              "background-color",
              "background-image",
              "background-repeat",
              "background-attachment",
              "background-position",
              "background-size",
            ],
            "type": "wrapper",
          },
          "id": "data-variable-id",
        },
      ],
      "id": "data-variable-id",
      "type": "main",
    },
  ],
  "styles": [],
  "symbols": [],
}
`;
```

--------------------------------------------------------------------------------

---[FILE: index.js]---
Location: grapesjs-dev/packages/core/test/specs/device_manager/index.js

```javascript
import Editor from 'editor';

describe('DeviceManager', () => {
  describe('Main', () => {
    let obj;
    let testNameDevice;
    let testWidthDevice;
    let editor;
    let em;

    beforeEach(() => {
      testNameDevice = 'Tablet';
      testWidthDevice = '100px';
      editor = new Editor({
        deviceManager: {
          devices: [],
        },
      });
      em = editor.getModel();
      obj = editor.Devices;
    });

    afterEach(() => {
      editor.destroy();
      obj = null;
    });

    test('Object exists', () => {
      expect(obj).toBeTruthy();
    });

    test('No device inside', () => {
      var coll = obj.getAll();
      expect(coll.length).toEqual(0);
    });

    test('Add new device', () => {
      obj.add(testNameDevice, testWidthDevice);
      expect(obj.getAll().length).toEqual(1);
    });

    test('Add new device triggers proper events', () => {
      const eventFn = jest.fn();
      const eventFnAll = jest.fn();
      em.on(obj.events.add, eventFn);
      em.on(obj.events.all, eventFnAll);
      obj.add(testNameDevice, testWidthDevice);
      expect(eventFn).toBeCalledTimes(1);
      expect(eventFnAll).toBeCalled();
    });

    test('Added device has correct data', () => {
      var model = obj.add(testNameDevice, testWidthDevice);
      expect(model.get('id')).toEqual(testNameDevice);
      expect(model.get('name')).toEqual(testNameDevice);
      expect(model.get('width')).toEqual(testWidthDevice);
    });

    test('Add device width options', () => {
      var model = obj.add(testNameDevice, testWidthDevice, { opt: 'value' });
      expect(model.get('opt')).toEqual('value');
    });

    test('Add device with props', () => {
      const model = obj.add({
        name: testNameDevice,
        width: testWidthDevice,
      });
      expect(model.get('id')).toEqual(testNameDevice);
      expect(model.get('name')).toEqual(testNameDevice);
      expect(model.get('width')).toEqual(testWidthDevice);
    });

    test('Add device without id and name', () => {
      const model = obj.add({
        width: testWidthDevice,
      });
      expect(model.get('name')).toEqual('');
      expect(model.get('width')).toEqual(testWidthDevice);
      expect(model.get('id')).toBeTruthy();
    });

    test('The name of the device is unique', () => {
      const model = obj.add(testNameDevice, testWidthDevice);
      const model2 = obj.add(testNameDevice, '2px');
      const model3 = obj.add({ id: testNameDevice, width: '3px' });
      expect(model).toBe(model2);
      expect(model2).toBe(model3);
    });

    test('Get device by name', () => {
      const model = obj.add(testNameDevice, testWidthDevice);
      const model2 = obj.get(testNameDevice);
      expect(model).toEqual(model2);
    });

    test('Get device by name with different id', () => {
      const model = obj.add({
        id: 'device',
        name: testNameDevice,
      });
      const model2 = obj.get(testNameDevice);
      expect(model).toBe(model2);
    });

    test('Remove device', () => {
      const id = 'device';
      const all = obj.getAll();
      const model = obj.add({ id });
      expect(all.length).toEqual(1);
      const eventFn = jest.fn();
      const eventFnAll = jest.fn();
      em.on(obj.events.remove, eventFn);
      em.on(obj.events.all, eventFnAll);

      const removed = obj.remove(id);
      expect(all.length).toEqual(0);
      expect(model).toBe(removed);
      // Check for events
      expect(eventFn).toBeCalledTimes(1);
      expect(eventFnAll).toBeCalled();
    });

    test('Update device', () => {
      const event = jest.fn();
      em.on(obj.events.update, event);
      const model = obj.add({});
      const up = { name: 'Test' };
      const opts = { myopts: 1 };
      model.set(up, opts);
      expect(event).toBeCalledTimes(1);
      expect(event).toBeCalledWith(model, up, opts);
    });

    test('Select device', () => {
      const event = jest.fn();
      const eventAll = jest.fn();
      const model = obj.add({ id: 'dev-1' });
      const model2 = obj.add({ id: 'dev-2' });

      em.on(obj.events.select, event);
      em.on(obj.events.all, eventAll);
      // Select from the manager
      obj.select(model);
      expect(em.get('device')).toBe('dev-1');
      expect(obj.getSelected()).toBe(model);
      expect(event).toBeCalledTimes(1);
      expect(eventAll).toBeCalled();

      // Select from the manager with id
      obj.select('dev-2');
      expect(em.get('device')).toBe('dev-2');
      expect(obj.getSelected()).toBe(model2);
      expect(event).toBeCalledTimes(2);

      // Select from the editor
      em.set('device', 'dev-1');
      expect(obj.getSelected()).toBe(model);
      expect(event).toBeCalledTimes(3);
    });

    test('Render devices', () => {
      expect(obj.render()).toBeTruthy();
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: DevicesView.js]---
Location: grapesjs-dev/packages/core/test/specs/device_manager/view/DevicesView.js

```javascript
import DevicesView from 'device_manager/view/DevicesView';
import Devices from 'device_manager/model/Devices';
import { Model } from 'backbone';

describe('DevicesView', () => {
  var model;
  var view;
  var editorModel;
  var em;

  beforeEach(() => {
    model = new Devices([]);
    view = new DevicesView({
      collection: model,
      config: { em: new Model() },
    });
    document.body.innerHTML = '<div id="fixtures"></div>';
    document.body.querySelector('#fixtures').appendChild(view.render().el);
  });

  afterEach(() => {
    view.collection.reset();
  });

  test('The content is not empty', () => {
    expect(view.el.innerHTML).toBeTruthy();
  });

  test('No options without devices', () => {
    expect(view.getOptions()).toEqual('');
  });

  test('Render new button', () => {
    view.collection.add({});
    expect(view.$el.html()).toBeTruthy();
  });

  describe('With configs', () => {
    beforeEach(() => {
      editorModel = new Model();
      model = new Devices([{ name: 'test1' }, { name: 'test2' }]);
      view = new DevicesView({
        collection: model,
        config: { em: editorModel },
      });
      document.body.innerHTML = '<div id="fixtures"></div>';
      document.body.querySelector('#fixtures').appendChild(view.render().el);
    });

    test('Update device on select change', () => {
      view.$el.find('select').val('test2');
      view.updateDevice();
      expect(view.config.em.get('device')).toEqual('test2');
    });

    test('Render options', () => {
      expect(view.getOptions()).toEqual('<option value="test1">test1</option><option value="test2">test2</option>');
    });
  });
});
```

--------------------------------------------------------------------------------

````
