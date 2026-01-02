---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 17
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 17 of 97)

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

---[FILE: DataSources.md]---
Location: grapesjs-dev/docs/modules/DataSources.md

```text
---
title: Data Sources
---

# DataSources

## Overview

**DataSources** are a powerful feature in GrapesJS that allow you to manage and inject data into your components, styles, and traits programmatically. They help you bind dynamic data to your design elements and keep your user interface synchronized with underlying data models.

### Key Concepts

1. **DataSource**: A static object with records that can be used throughout GrapesJS.
2. **ComponentDataVariable**: A type of data variable that can be used within components to inject dynamic values.
3. **StyleDataVariable**: A data variable used to bind CSS properties to values in your DataSource.
4. **TraitDataVariable**: A data variable used in component traits to bind data to various UI elements.
5. **Transformers**: Methods for validating and transforming data records in a DataSource.

## Creating and Adding DataSources

To start using DataSources, you need to create them and add them to GrapesJS.

**Example: Creating and Adding a DataSource**

```ts
const editor = grapesjs.init({
  container: '#gjs',
});

const datasource = {
  id: 'my-datasource',
  records: [
    { id: 'id1', content: 'Hello World' },
    { id: 'id2', color: 'red' },
  ],
};

editor.DataSources.add(datasource);
```

## Using DataSources with Components

You can reference DataSources within your components to dynamically inject data.

**Example: Using DataSources with Components**

```ts
editor.addComponents([
  {
    tagName: 'h1',
    type: 'text',
    components: [
      {
        type: 'data-variable',
        defaultValue: 'default',
        path: 'my-datasource.id1.content',
      },
    ],
  },
]);
```

In this example, the `h1` component will display "Hello World" by fetching the content from the DataSource with the path `my-datasource.id1.content`.

## Using DataSources with Styles

DataSources can also be used to bind data to CSS properties.

**Example: Using DataSources with Styles**

```ts
editor.addComponents([
  {
    tagName: 'h1',
    type: 'text',
    components: [
      {
        type: 'data-variable',
        defaultValue: 'default',
        path: 'my-datasource.id1.content',
      },
    ],
    style: {
      color: {
        type: 'data-variable',
        defaultValue: 'red',
        path: 'my-datasource.id2.color',
      },
    },
  },
]);
```

Here, the `h1` component's color will be set to red, as specified in the DataSource at `my-datasource.id2.color`.

## Using DataSources with Traits

Traits are used to bind DataSource values to component properties, such as input fields.

**Example: Using DataSources with Traits**

```ts
const datasource = {
  id: 'my-datasource',
  records: [{ id: 'id1', value: 'I Love Grapes' }],
};
editor.DataSources.add(datasource);

editor.addComponents([
  {
    tagName: 'input',
    traits: [
      'name',
      'type',
      {
        type: 'text',
        label: 'Value',
        name: 'value',
        value: {
          type: 'data-variable',
          defaultValue: 'default',
          path: 'my-datasource.id1.value',
        },
      },
    ],
  },
]);
```

In this case, the value of the input field is bound to the DataSource value at `my-datasource.id1.value`.

## DataSource Transformers

Transformers in DataSources allow you to customize how data is processed during various stages of interaction with the data. The primary transformer functions include:

### 1. `onRecordSetValue`

This transformer is invoked when a record's property is added or updated. It provides an opportunity to validate or transform the new value.

#### Example Usage

```javascript
const testDataSource = {
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
```

In this example, the `onRecordSetValue` transformer ensures that the `content` property is always an uppercase string.

## Storing DataSources in Project JSON

GrapesJS allows you to control whether a DataSource should be stored statically in the project JSON. This is useful for managing persistent data across project saves and loads.

### Using the `skipFromStorage` Key

When creating a DataSource, you can use the `skipFromStorage` key to specify whether it should be included in the project JSON.

**Example: Creating a DataSource with `skipFromStorage`**

```ts
const persistentDataSource = {
  id: 'persistent-datasource',
  records: [
    { id: 'id1', content: 'This data will be saved' },
    { id: 'id2', color: 'blue' },
  ],
};

editor.DataSources.add(persistentDataSource);

const temporaryDataSource = {
  id: 'temporary-datasource',
  records: [
    { id: 'id1', content: 'This data will not be saved' },
  ],
  skipFromStorage: true,
};

editor.DataSources.add(temporaryDataSource);
```

In this example, `persistentDataSource` will be included in the project JSON when the project is saved, while `temporaryDataSource` will not.

### Benefits of Using `skipFromStorage`

1. **Persistent Configuration**: Store configuration data that should persist across project saves and loads.
2. **Default Data**: Include default data that should always be available in the project.
3. **Selective Storage**: Choose which DataSources to include in the project JSON, optimizing storage and load times.

### Accessing Stored DataSources

When a project is loaded, GrapesJS will automatically restore the DataSources that were saved. You can then access and use these DataSources as usual.

```ts
// After loading a project
const loadedDataSource = editor.DataSources.get('persistent-datasource');
console.log(loadedDataSource.getRecord('id1').get('content')); // Outputs: "This data will be saved"
```

Remember that DataSources with `skipFromStorage: true` will not be available after a project is loaded unless you add them programmatically.


## Record Mutability

DataSource records are mutable by default, but can be set as immutable to prevent modifications. Use the mutable flag when creating records to control this behavior.

```ts
const dataSource = {
  id: 'my-datasource',
  records: [
    { id: 'id1', content: 'Mutable content' },
    { id: 'id2', content: 'Immutable content', mutable: false },
  ],
};


editor.DataSources.add(dataSource);

const ds = editor.DataSources.get('my-datasource');
ds.getRecord('id1').set('content', 'Updated content'); // Succeeds
ds.getRecord('id2').set('content', 'New content'); // Throws error
```

Immutable records cannot be modified or removed, ensuring data integrity for critical information.

## Benefits of Using DataSources

DataSources are integrated with GrapesJS's runtime and BackboneJS models, enabling dynamic updates and synchronization between your data and UI components. This allows you to:

1. **Inject Configuration**: Manage and inject configuration settings dynamically.
2. **Manage Global Themes**: Apply and update global styling themes.
3. **Mock & Test**: Use DataSources for testing and mocking data during development.
4. **Integrate with Third-Party Services**: Connect and synchronize with external data sources and services.

**Example: Using DataSources to Manage a Counter**

```ts
const datasource = {
  id: 'my-datasource',
  records: [{ id: 'id1', counter: 0 }],
};

editor.DataSources.add(datasource);

editor.addComponents([
  {
    tagName: 'span',
    type: 'text',
    components: [
      {
        type: 'data-variable',
        defaultValue: 'default',
        path: 'my-datasource.id1.counter',
      },
    ],
  },
]);

const ds = editor.DataSources.get('my-datasource');
setInterval(() => {
  console.log('Incrementing counter');
  const counterRecord = ds.getRecord('id1');
  counterRecord.set({ counter: counterRecord.get('counter') + 1 });
}, 1000);
```

In this example, a counter is dynamically updated and displayed in the UI, demonstrating the real-time synchronization capabilities of DataSources.

**Examples of How DataSources Could Be Used:**

1. Injecting configuration
2. Managing global themes
3. Mocking & testing
4. Third-party integrations
```

--------------------------------------------------------------------------------

---[FILE: I18n.md]---
Location: grapesjs-dev/docs/modules/I18n.md

```text
---
title: I18n (Internationalization)
---

# Internationalization

The **I18n** module allows the internationalization and update of strings in the editor UI

::: warning
This guide is referring to GrapesJS v0.15.9 or higher

The module was added recently so we're open to receive support in [translating strings in other languages](#adding-new-language). Your help will be much appreciated!
:::

[[toc]]

## Configuration

By default, the editor includes only the English language, if you need other languages you have to import them manually.
**Note**: The language code is defined in the [ISO 639-1] standard.

```js
import grapesjs from 'grapesjs';
import it from 'grapesjs/locale/it';
import tr from 'grapesjs/locale/tr';

const editor = grapesjs.init({
  ...
  i18n: {
    // locale: 'en', // default locale
    // detectLocale: true, // by default, the editor will detect the language
    // localeFallback: 'en', // default fallback
    messages: { it, tr },
  }
});
```

Now the editor will be translated in Italian for those browsers which default language is Italian (by default `detectLocale` option is enabled)

## Update strings

If you need to change some default language strings you can easily update them by using [I18n API](/api/i18n.html).
To find the correct path of the string you can check the [`en` locale file] and follow its inner path inside the locale object.

Let's say we want to update the default message of the empty state in Style Manager when no elements are selected.

<img :src="$withBase('/sm-empty-state.jpg')">

From the `en` locale file you can see it by following the path below

```js
{
    ...
    styleManager: {
        empty: 'Select an element before using Style Manager',
        ...
    },
    ...
}
```

So now to update it you'll do this

```js
editor.I18n.addMessages({
  en: {
    // indicate the locale to update
    styleManager: {
      empty: 'New empty state message',
    },
  },
});
```

Even if the UI shows correctly the updated message, we highly suggest to do all the API calls wrapped in a [plugin](Plugins.html)

```js
const myPlugin = editor => {
    editor.I18n.addMessages({ ... });
    // ...
}

grapesjs.init({
  // ...
  plugins: [myPlugin],
});
```

### Generated strings

Not all the strings are indicated in the `en` local file as some of them can be generated from `id`s, `name`s, etc.
If you look back at the `styleManager` path from the `en` file you'll notice the empty `properties` key

```js
...
styleManager: {
    ...
    properties: {
        // float: 'Float',
    },
    ...
},
...
```

This object is used to translate property names inside StyleManager, so if you need, for instance, to change the auto-generated names for the `margin` properties

<img :src="$withBase('/margin-strings.jpg')">

you'd this

```js
editor.I18n.addMessages({
  en: {
    styleManager: {
      properties: {
        // The key is the property name (or id)
        'margin-top': 'Top',
        'margin-right': 'Right',
        'margin-left': 'Left',
        'margin-bottom': 'Bottom',
      },
    },
  },
});
```

<!--
### Updates post rendering

If you try to update strings, by using API, once the UI is rendered you'll see no changes.
...
We need to find the way to update the UI
-->

## Adding new language

If you want to support GrapesJS by adding a new language to our repository all you need to do is to follow steps below:

1. First of all, be sure to check the language file in [`src/i18n/locale`](https://github.com/GrapesJS/grapesjs/blob/master/src/i18n/locale) doesn't exist already
1. [Open a new issue](https://github.com/GrapesJS/grapesjs/issues/new?title=XX%20Language%20support) to avoid overlap with other contributors. To be sure, check also no one else has opened already an issue for the same language
1. Start a new branch from `dev`
1. Copy (in the same folder) and rename the [`en` locale file] to the name of your language of choice (be sure to be compliant to [ISO 639-1])
1. Now you can start translating strings
1. By following comments you'll probably notice that some keys are not indicated (eg. `styleManager.properties`), for the reference you can check other locale files
1. Once you've done, you can create a new Pull Request on GitHub from your branch to `dev` by making also a reference to your issue in order to close it automatically once it's merged (your PR message should contain `Closes #1234` where 1234 is the issue ID)

## Plugin development

::: warning
This section is dedicated **only** to plugin developers and can also be skipped in case you use [grapesjs-cli](https://github.com/GrapesJS/cli) to init your plugin project
:::

If you're developing a plugin for GrapesJS and you need to support some string localization or simply change the default one, we recommend the following structure.

```
plugin-dir
- package.json
- README.md
- ...
- src
    - index.js
    - locale // create the locale folder in your src
        - en.js // All default strings should be placed here
```

For your plugin specific strings, place them under the plugin name key

```js
// src/locale/en.js
export default {
  'grapesjs-plugin-name': {
    yourKey: 'Your value',
  },
};
```

In your `index.js` use the `en.js` file and add `i18n` option to allow import of other local files

```js
// src/index.js
import en from 'locale/en';

export default (editor, opts = {}) => {
  const options = {
    i18n: {},
    // ...
    ...opts,
  };

  // ...

  editor.I18n.addMessages({
    en,
    ...options.i18n,
  });
};
```

The next step would be to compile your locale files into `<rootDir>/locale` directory to make them easily accessible by your users. This folder could be ignored in your git repository be should be deployd to the npm registry

::: warning
Remember that you can skip all these long steps and init your project with [grapesjs-cli](https://github.com/GrapesJS/cli). This will create all the necessary folders/files/commands for you (during `init` command this step is flagged `true` by default and we recommend to keep it even in case the i18n is not required in your project)
:::

At the end, your plugin users will be able to import other locale files (if they exist) in this way

```js
import grapesjs from 'grapesjs';

// Import from your plugin
import yourPlugin from 'grapesjs-your-plugin';
import ch from 'grapesjs-your-plugin/locale/ch';
import fr from 'grapesjs-your-plugin/locale/fr';

const editor = grapesjs.init({
  ...
  plugins: [ yourPlugin ],
  pluginsOpts: {
      [yourPlugin]: {
          i18n: { ch, fr }
      }
  }
});
```

[ISO 639-1]: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
[`en` locale file]: https://github.com/GrapesJS/grapesjs/blob/master/src/i18n/locale/en.js
```

--------------------------------------------------------------------------------

---[FILE: Layers.md]---
Location: grapesjs-dev/docs/modules/Layers.md

```text
---
title: Layer Manager
---

# Layer Manager

<p align="center"><img :src="$withBase('/layer-manager.png')" alt="GrapesJS - Layer Manager"/></p>

The Layer Manager module is responsible to manage and display your [Components] as a tree.

::: warning
This guide is referring to GrapesJS v0.19.5 or higher
:::

[[toc]]

## Configuration

To change the default configurations you have to pass the `layerManager` option with the main configuration object.

```js
const editor = grapesjs.init({
  ...
  layerManager: {
    ...
  }
});
```

You can check here the full list of available configuration options: [Layer Manager Config](https://github.com/GrapesJS/grapesjs/blob/master/src/navigator/config/config.ts)

Layers are a direct representation of your components, therefore they will only be available once your components are loaded in the editor (eg. you might load your project data from a remote endpoint).

In your configuration, you're able to change the global behavior of layers (eg. make all the layers not sortable) and also decide which component layer should be used as a root.

```js
const editor = grapesjs.init({
  ...
  layerManager: {
    // If the `root` is not specified or the component element is not found,
    // the main wrapper component will be used.
    root: '#my-custom-root',
    sortable: false,
    hidable: false,
  }
});
```

The configurations are mainly targeting the default UI provided by GrapesJS core, in case you need more control over the tree of your layers, you can read more in the [Customization](#customization) section below.

## Programmatic usage

If you need to manage layers programmatically you can use its [APIs][Layers API].

## Customization

By using the [Layers API][Layers API] you're able to replace the default UI with your own implementation.

All you have to do is to indicate to the editor your intent to use a custom UI and then subscribe to a few events that allow you to properly update your UI.

```js
const editor = grapesjs.init({
  // ...
  layerManager: {
    custom: true,
    // ...
  },
});

// Use this event to append your UI in the default container provided by GrapesJS.
// You can skip this event if you don't rely on the core panels and decide to
// place the UI in some other place.
editor.on('layer:custom', (props) => {
  // props.container (HTMLElement) - The default element where you can append your UI
});

// Triggered when the root layer is changed.
editor.on('layer:root', (root) => {
  // Update the root of your UI
});

// Triggered when a component is updated, this allows you to update specific layers.
editor.on('layer:component', (component) => {
  // Update the specific layer of your UI
});
```

In the example below we'll replicate most of the default functionality with our own implementation.

<demo-viewer value="L24hkgm5" height="500" darkcode/>

<!-- Demo template, here for reference
<style>
.layer-manager {
  position: relative;
  text-align: left;
}
.layer-item.hidden {
  opacity: 0.5;
}
.layer-item-icon {
  width: 15px;
  cursor: pointer;
}
.layer-item-eye {
}
.layer-item-chevron {
  transform: rotate(90deg);
}
.layer-item-chevron.open {
  transform: rotate(180deg);
}
.layer-item-chevron.hidden {
  opacity: 0;
  pointer-events: none;
}
.layer-item-row {
  display: flex;
  align-items: center;
  user-select: none;
  gap: 8px;
  padding: 5px 8px;
  border-bottom: 1px solid rgba(0,0,0,0.35);
}
.layer-item-row.selected {
  background-color: rgba(255,255,255,0.15);
}
.layer-item-row.hovered {
  background-color: rgba(255,255,255,0.05);
}
.layer-item-name {
  margin-left: 3px;
}
.layer-item-name.editing {
  background-color: white;
  color: #555;
  padding: 0 3px;
}
.layer-item-name-cnt {
  display: flex;
  align-items: center;
  flex-grow: 1;
}
.layer-drag-indicator {
  position: absolute;
  width: 100%;
  height: 1px;
  left: 0;
  background-color: #3b97e3;
}
</style>
<div style="display: none">
  <div
    class="layer-manager"
    @pointerdown="onDragStart"
    @pointermove="onDragMove"
    @pointerup="onDragEnd"
  >
    <layer-item v-if="root" :component="root" :level="0"></layer-item>
    <div
      v-if="dragIndicator.show"
      class="layer-drag-indicator"
      :style="{ top: `${dragIndicator.y}px`, marginLeft: `${dragIndicator.offset}px`, width: `calc(100% - ${dragIndicator.offset}px)` }"></div>
  </div>

  <div id="layer-item-template" style="display: none;">
    <div :class="['layer-item', !visible && 'hidden']">
      <div
        :class="['layer-item-row', selected && 'selected', hovered && 'hovered']"
        @click="setSelected"
        @mouseenter="setHover(true)"
        @mouseleave="setHover(false)"
        ref="layerRef"
        data-layer-item
      >
        <div class="layer-item-icon layer-item-eye" @click.stop="toggleVisibility()">
          <svg v-if="visible" viewBox="0 0 24 24"><path fill="currentColor" d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" /></svg>
          <svg v-else viewBox="0 0 24 24"><path fill="currentColor" d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.08L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.74,7.13 11.35,7 12,7Z" /></svg>
        </div>
        <div class="layer-item-name-cnt" :style="{ marginLeft: `${level*10}px` }">
          <div :class="['layer-item-icon layer-item-chevron', open && 'open', !components.length && 'hidden']" @click.stop="toggleOpen()">
            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z" /></svg>
          </div>
          <div ref="nameInput"
            :class="['layer-item-name', editing && 'editing']"
            :contenteditable="editing"
            @dblclick.stop="setEditing(true)"
            @blur.stop="setEditing(false)"
            @keydown.enter="setEditing(false)"
          >
            {{ name }}
          </div>
        </div>
        <div v-if="component.get('draggable')" class="layer-item-icon layer-item-move" data-layer-move>
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M13,6V11H18V7.75L22.25,12L18,16.25V13H13V18H16.25L12,22.25L7.75,18H11V13H6V16.25L1.75,12L6,7.75V11H11V6H7.75L12,1.75L16.25,6H13Z"/></svg>
        </div>
      </div>
      <div v-if="open" class="layer-items">
        <layer-item v-for="cmp in components" :key="cmp.getId()" :component="cmp" :level="level + 1"/>
      </div>
    </div>
  </div>
</div>
<script>
const { Components, Layers } = editor;
const cmpElMap = new WeakMap();

Vue.component('layer-item', {
  template: '#layer-item-template',
  props: { component: Object, level: Number },
  data() {
    return {
      name: '',
      components: [],
      visible: true,
      open: false,
      selected: false,
      hovered: false,
      editing: false,
    }
  },
  mounted() {
    this.updateLayer(Layers.getLayerData(this.component));
    cmpElMap.set(this.$refs.layerRef, this.component);
    editor.on('layer:component', this.onLayerComponentUpdate);
  },
  destroyed() {
    editor.off('layer:component', this.onLayerComponentUpdate);
  },
  methods: {
    onLayerComponentUpdate(cmp) {
      if (cmp === this.component) {
        this.updateLayer(Layers.getLayerData(cmp));
      }
    },
    updateLayer(data) {
      this.name = data.name;
      this.components = data.components;
      this.visible = data.visible;
      this.open = data.open;
      this.selected = data.selected;
      this.hovered = data.hovered;
    },
    toggleVisibility() {
      const { component } = this;
      Layers.setVisible(this.component, !this.visible);
    },
    toggleOpen() {
      const { component } = this;
      Layers.setOpen(this.component, !this.open);
    },
    setHover(hovered) {
      Layers.setLayerData(this.component, { hovered })
    },
    setSelected(event) {
      Layers.setLayerData(this.component, { selected: true }, { event })
    },
    setEditing(value) {
      this.editing = value;
      const el = this.$refs.nameInput;
      if (!value) {
        Layers.setName(this.component, el.innerText)
      } else {
        setTimeout(() => el.focus())
      }
    },
  }
});

const app = new Vue({
  el: '.layer-manager',
  data: {
    root: null,
    isDragging: false,
    draggingCmp: null,
    draggingOverCmp: null,
    dragIndicator: {},
    canMoveRes: {},
  },
  mounted() {
    editor.on('layer:custom', this.handleCustom);
    editor.on('layer:root', this.handleRootChange);
  },
  destroyed() {
    editor.off('layer:custom', this.handleCustom);
    editor.off('layer:root', this.handleRootChange);
  },
  methods: {
    handleCustom(props = {}) {
      const { container, root } = props;
      container && container.appendChild(this.$el);
      this.handleRootChange(root);
    },
    handleRootChange(root) {
      console.log('root update', root);
      this.root = root;
    },
    getDragTarget(ev) {
      const el = document.elementFromPoint(ev.clientX, ev.clientY);
      const dragEl = el?.closest('[data-layer-move]');
      const elLayer = el?.closest('[data-layer-item]');

      return {
          dragEl,
          elLayer,
          cmp: cmpElMap.get(elLayer),
      }
    },
    onDragStart(ev) {
      if (this.getDragTarget(ev).dragEl) {
        this.isDragging = true;
      }
    },
    onDragMove(ev) {
      if (!this.isDragging) return;
      const { cmp, elLayer } = this.getDragTarget(ev);
      if (!cmp || !elLayer) return;
      const { draggingCmp } = this;
      const layerRect = elLayer.getBoundingClientRect();
      const layerH = elLayer.offsetHeight;
      const layerY = elLayer.offsetTop;
      const pointerY = ev.clientY;
      const isBefore = pointerY < (layerRect.y + layerH / 2);
      const cmpSource = !draggingCmp ? cmp : draggingCmp;
      const cmpTarget = cmp.parent();
      const cmpIndex = cmp.index() + (isBefore ? 0 : 1);
      this.draggingCmp = !draggingCmp ? cmp : draggingCmp;
      this.draggingOverCmp = cmp;
      const canMove = Components.canMove(cmpTarget, cmpSource, cmpIndex);
      const canMoveInside = Components.canMove(cmp, cmpSource);
      const canMoveRes = {
          ...canMove,
          canMoveInside,
          index: cmpIndex,
      };
      // if (
      //     canMoveInside.result &&
      //     (
      //         pointerY > (layerRect.y + LAYER_PAD)
      //         && pointerY < (layerRect.y + layerH - LAYER_PAD))
      // ) {
      //     pointerInside = true;
      //     canMoveRes.target = cmp;
      //     delete canMoveRes.index;
      // }
      // setDragParent(pointerInside ? cmp : undefined);
      this.canMoveRes = canMoveRes;
      const dragLevel = (cmp ? cmp.parents() : []).length;
      this.dragIndicator = {
          y: layerY + (isBefore ? 0 : layerH),
          h: layerH,
          offset: dragLevel * 10 + 20,
          show: !!(this.draggingCmp && canMoveRes?.result),
      };
    },
    onDragEnd(ev) {
      const { canMoveRes } = this;
      canMoveRes.result && canMoveRes.source.move(canMoveRes.target, { at: canMoveRes.index });
      this.isDragging = false;
      this.draggingCmp = null;
      this.draggingOverCmp = null;
      this.dragIndicator = {};
      this.canMoveRes = {};
    },
  }
});
</script>
-->

## Events

For a complete list of available events, you can check it [here](/api/layer_manager.html#available-events).

[Components]: Components.html
[Layers API]: /api/layer_manager.html
```

--------------------------------------------------------------------------------

---[FILE: Modal.md]---
Location: grapesjs-dev/docs/modules/Modal.md

```text
---
title: Modal
---

# Modal

The **Modal** module allows to easily display content in a dialog window.

::: warning
This guide is referring to GrapesJS v0.17.26 or higher
:::

[[toc]]

## Basic usage

You can easily display your content by calling a single API call.

```js
// Init editor
const editor = grapesjs.init({ ... });
// Open modal
const openModal = () => {
    editor.Modal.open({
        title: 'My title', // string | HTMLElement
        content: 'My content', // string | HTMLElement
    });
};
// Create a simple custom button that will open the modal
document.body.insertAdjacentHTML('afterbegin',`
    <button onclick="openModal()">Open Modal</button>
`);
```

## Using API

By using other [available APIs](/api/modal_dialog.html) you have full control of the modal (eg. updating content/title, closing the modal, etc.).

Here are a few examples:

```js
const { Modal } = editor;

// Close the modal
Modal.close();

// Check if the modal is open
Modal.isOpen();

// Update title
Modal.setTitle('New title');

// Update content
Modal.setContent('New content');

// Execute one-time callback on modal close
Modal.onceClose(() => {
  console.log('My last modal is closed');
});
```

## Customization

The modal can be fully customized and you have different available options.
The fastest and the easiest one is to use your specific CSS for the modal element. With a few lines of CSS your modal can be completely adapted to your choices.

```css
.gjs-mdl-dialog {
  background-color: white;
  color: #333;
}
```

In case you have to customize a specific modal differently, you can rely on your custom class attributes.

```js
editor.Modal.open({
  title: 'My title',
  content: 'My content',
  attributes: {
    class: 'my-small-modal',
  },
});
```

```css
.my-small-modal .gjs-mdl-dialog {
  max-width: 300px;
}
```

::: warning
Your custom CSS has to be loaded after the GrapesJS one.
:::

### Custom Modal

For more advanced usage, you can completely replace the default modal with one of your own. All you have to do is to indicate the editor your intent to use a custom modal and then subscribe to the `modal` event that will give you all the information on any requested change.

```js
const editor = grapesjs.init({
  // ...
  modal: { custom: true },
});

editor.on('modal', (props) => {
  // The `props` will contain all the information you need in order to update your custom modal.
  // props.open (boolean) - Indicates if the modal should be open
  // props.title (Node) - Modal title
  // props.content (Node) - Modal content
  // props.attributes (Object) - Modal custom attributes (eg. class)
  // props.close (Function) - A callback to use when you want to close the modal programmatically
  // Here you would put the logic to control your modal.
});
```

Here an example of using the Bootstrap modal.

<demo-viewer value="x70amv3f" height="500" darkcode/>

## Events

For a complete list of available events, you can check it [here](/api/modal_dialog.html#available-events).
```

--------------------------------------------------------------------------------

---[FILE: Pages.md]---
Location: grapesjs-dev/docs/modules/Pages.md

```text
---
title: Pages
---

# Pages

The Pages module in GrapesJS allows you to create a project with multiple pages. By default, one page is always created under the hood, even if you don't need multi-page support. This allows keeping the API consistent and easier to extend if you need to add multiple pages later.

::: warning
This guide is referring to GrapesJS v0.21.1 or higher
:::

::: tip
Want pages to just work, with a polished UI? [See how the Grapes Studio SDK does it!](https://app.grapesjs.com/docs-sdk/configuration/pages?utm_source=grapesjs-docs&utm_medium=tip)
:::
[[toc]]

## Initialization

The default editor initialization doesn't require any knowledge of pages and this was mainly done to avoid introducing breaking changes when the Pages module was introduced.

This is how a typical editor initialization looks like:

```js
const editor = grapesjs.init({
  container: '#gjs',
  height: '100%',
  storageManager: false,
  // CSS or a JSON of styles
  style: '.my-el { color: red }',
  // HTML string or a JSON of components
  components: '<div class="my-el">Hello world!</div>',
  // ...other config options
});
```

What actually is happening is that this configuration is automatically migrated to the Page Manager.

```js
const editor = grapesjs.init({
  container: '#gjs',
  height: '100%',
  storageManager: false,
  pageManager: {
    pages: [
      {
        // without an explicit ID, a random one will be created
        id: 'my-first-page',
        // CSS or a JSON of styles
        styles: '.my-el { color: red }',
        // HTML string or a JSON of components
        component: '<div class="my-el">Hello world!</div>',
      },
    ],
  },
});
```

::: warning
Worth noting the previous keys are `style` and `components`, where in pages you should use `styles` and `component`.
:::

As you might guess, this is how initializing the editor with multiple pages would look like:

```js
const editor = grapesjs.init({
  // ...
  pageManager: {
    pages: [
      {
        id: 'my-first-page',
        styles: '.my-page1-el { color: red }',
        component: '<div class="my-page1-el">Page 1</div>',
      },
      {
        id: 'my-second-page',
        styles: '.my-page2-el { color: blue }',
        component: '<div class="my-page2-el">Page 2</div>',
      },
    ],
  },
});
```

GrapesJS doesn't provide any default UI for the Page Manager but you can easily built one by leveraging its [APIs][Pages API]. Check the [Customization](#customization) section for more details on how to create your own Page Manager UI.

## Programmatic usage

If you need to manage pages programmatically you can use its [APIs][Pages API].

Below are some commonly used methods:

```js
// Get the Pages module first
const pages = editor.Pages;

// Get an array of all pages
const allPages = pages.getAll();

// Get currently selected page
const selectedPage = pages.getSelected();

// Add a new Page
const newPage = pages.add({
  id: 'new-page-id',
  styles: '.my-class { color: red }',
  component: '<div class="my-class">My element</div>',
});

// Get the Page by ID
const page = pages.get('new-page-id');

// Select another page by ID
pages.select('new-page-id');
// or by passing the Page instance
pages.select(page);

// Get the HTML/CSS code from the page component
const component = page.getMainComponent();
const htmlPage = editor.getHtml({ component });
const cssPage = editor.getCss({ component });

// Remove the Page by ID (or by Page instance)
pages.remove('new-page-id');
```

## Customization

By using the [Pages API] it's easy to create your own Page Manager UI.

The simpliest way is to subscribe to the catch-all `page` event, which is triggered on any change related to the Page module (not related to page content like components or styles), and update your UI accordingly.

```js
const editor = grapesjs.init({
  // ...
});

editor.on('page', () => {
  // Update your UI
});
```

In the example below you can see an quick implementation of the Page Manager UI.

<demo-viewer value="1y6bgeo3" height="500" darkcode/>

<!-- Demo template, here for reference
<style>
  .app-wrap {
    height: 100%;
    width: 100%;
    display: flex;
  }
  .editor-wrap  {
    widtH: 100%;
    height: 100%;
  }
  .pages-wrp, .pages {
    display: flex;
    flex-direction: column
  }
  .pages-wrp {
      background: #333;
      padding: 5px;
  }
  .add-page {
    background: #444444;
    color: white;
    padding: 5px;
    border-radius: 2px;
    cursor: pointer;
    white-space: nowrap;
    margin-bottom: 10px;
  }
  .page {
    background-color: #444;
    color: white;
    padding: 5px;
    margin-bottom: 5px;
    border-radius: 2px;
    cursor: pointer;

    &.selected {
      background-color: #706f6f
    }
  }

  .page-close {
    opacity: 0.5;
    float: right;
    background-color: #2c2c2c;
    height: 20px;
    display: inline-block;
    width: 17px;
    text-align: center;
    border-radius: 3px;

    &:hover {
      opacity: 1;
    }
  }
</style>

<div style="height: 100%">
  <div class="app-wrap">
    <div class="pages-wrp">
        <div class="add-page" @click="addPage">Add new page</div>
        <div class="pages">
          <div v-for="page in pages" :key="page.id" :class="{page: 1, selected: isSelected(page) }" @click="selectPage(page.id)">
            {{ page.get('name') || page.id }} <span v-if="!isSelected(page)" @click="removePage(page.id)" class="page-close">&Cross;</span>
          </div>
        </div>
    </div>
    <div class="editor-wrap">
      <div id="gjs"></div>
    </div>
  </div>
</div>

<script>
const editor = grapesjs.init({
  container: '#gjs',
  height: '100%',
  storageManager: false,
  plugins: ['gjs-blocks-basic'],
  pageManager: {
    pages: [{
      id: 'page-1',
      name: 'Page 1',
      component: '<div id="comp1">Page 1</div>',
      styles: `#comp1 { color: red }`,
    }, {
      id: 'page-2',
      name: 'Page 2',
      component: '<div id="comp2">Page 2</div>',
      styles: `#comp2 { color: green }`,
    }, {
      id: 'page-3',
      name: 'Page 3',
      component: '<div id="comp3">Page 3</div>',
      styles: `#comp3 { color: blue }`,
    }]
  },
});

const pm = editor.Pages;

const app = new Vue({
  el: '.pages-wrp',
  data: { pages: [] },
  mounted() {
    this.setPages(pm.getAll());
    editor.on('page', () => {
      this.pages = [...pm.getAll()];
    });
  },
  methods: {
    setPages(pages) {
      this.pages = [...pages];
    },
    isSelected(page) {
      return pm.getSelected().id == page.id;
    },
    selectPage(pageId) {
      return pm.select(pageId);
    },
    removePage(pageId) {
      return pm.remove(pageId);
    },
    addPage() {
      const len = pm.getAll().length;
      pm.add({
        name: `Page ${len + 1}`,
        component: '<div>New page</div>',
      });
    },
  }
});
</script>
-->

## Events

For a complete list of available events, you can check it [here](/api/pages.html#available-events).

[Pages API]: /api/pages.html
```

--------------------------------------------------------------------------------

````
