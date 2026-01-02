---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 14
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 14 of 97)

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

---[FILE: Assets.md]---
Location: grapesjs-dev/docs/modules/Assets.md

```text
---
title: Asset Manager
---

# Asset Manager

<p align="center"><img src="http://grapesjs.com/img/sc-grapesjs-assets-1.jpg" alt="GrapesJS - Asset Manager" align="center"/></p>

In this section, you will see how to setup and take the full advantage of built-in Asset Manager in GrapesJS. The Asset Manager is lightweight and implements just an `image` in its core, but as you'll see next it's easy to extend and create your own asset types.

::: tip
Want an asset manager that looks great out of the box? [Try the Grapes Studio SDK!](https://app.grapesjs.com/docs-sdk/configuration/assets/overview?utm_source=grapesjs-docs&utm_medium=tip)
:::

[[toc]]

## Configuration

To change default configurations you'd need to pass the `assetManager` property with the main configuration object

```js
const editor = grapesjs.init({
  ...
  assetManager: {
    assets: [...],
    ...
  }
});
```

You can update most of them later by using `getConfig` inside of the module

```js
const amConfig = editor.AssetManager.getConfig();
```

Check the full list of available options here: [Asset Manager Config](https://github.com/GrapesJS/grapesjs/blob/master/src/asset_manager/config/config.ts)

## Initialization

The Asset Manager is ready to work by default, so pass few URLs to see them loaded

```js
const editor = grapesjs.init({
  ...
  assetManager: {
    assets: [
     'http://placehold.it/350x250/78c5d6/fff/image1.jpg',
     // Pass an object with your properties
     {
       type: 'image',
       src: 'http://placehold.it/350x250/459ba8/fff/image2.jpg',
       height: 350,
       width: 250,
       name: 'displayName'
     },
     {
       // As the 'image' is the base type of assets, omitting it will
       // be set as `image` by default
       src: 'http://placehold.it/350x250/79c267/fff/image3.jpg',
       height: 350,
       width: 250,
       name: 'displayName'
     },
    ],
  }
});
```

If you want a complete list of available properties check out the source [AssetImage Model](https://github.com/GrapesJS/grapesjs/blob/dev/packages/core/src/asset_manager/model/AssetImage.ts)

The built-in Asset Manager modal is implemented and is showing up when requested. By default, you can make it appear by dragging Image Components in canvas, double clicking on images and all other stuff related to images (eg. CSS styling)

<img :src="$withBase('/assets-builtin-modal.png')">

<!--
Making the modal appear is registered with a command, so you can make it appear with this

```js
// This command shows only assets with `image` type
editor.runCommand('open-assets');
```


Worth noting that by doing this you can't do much with assets (if you double click on them nothing happens) and this is because you've not indicated any target. Try just to select an image in your canvas and run this in console (you should first make the editor globally available `window.editor = editor;` in your script)

```js
editor.runCommand('open-assets', {
  target: editor.getSelected()
});
```

Now you should be able to change the image of the component.
-->

## Uploading assets

The default Asset Manager includes also an easy to use, drag-and-drop uploader with a few UI helpers. The default uploader is already visible when you open the Asset Manager.

<img :src="$withBase('/assets-uploader.png')">

You can click on the uploader to select your files or just drag them directly from your computer to trigger the uploader. Obviously, before it will work you have to setup your server to receive your assets and specify the upload endpoint in your configuration

```js
const editor = grapesjs.init({
  ...
  assetManager: {
    ...
    // Upload endpoint, set `false` to disable upload, default `false`
    upload: 'https://endpoint/upload/assets',

    // The name used in POST to pass uploaded files, default: `'files'`
    uploadName: 'files',
    ...
  },
  ...
});
```

### Listeners

If you want to execute an action before/after the uploading process (eg. loading animation) or even on response, you can make use of these listeners

```js
// The upload is started
editor.on('asset:upload:start', () => {
  startAnimation();
});

// The upload is ended (completed or not)
editor.on('asset:upload:end', () => {
  endAnimation();
});

// Error handling
editor.on('asset:upload:error', (err) => {
  notifyError(err);
});

// Do something on response
editor.on('asset:upload:response', (response) => {
  ...
});
```

### Response

When the uploading is over, by default (via config parameter `autoAdd: 1`), the editor expects to receive a JSON of uploaded assets in a `data` key as a response and tries to add them to the main collection. The JSON might look like this:

```js
{
  data: [
    'https://.../image.png',
    // ...
    {
      src: 'https://.../image2.png',
      type: 'image',
      height: 100,
      width: 200,
    },
    // ...
  ];
}
```

<!-- Deprecated
### Setup Dropzone

There is another helper which improves the uploading of assets: A full-width editor dropzone.

<img :src="$withBase('/assets-full-dropzone.gif')">


All you have to do is to activate it and possibly set a custom content (you might also want to hide the default uploader)

```js
const editor = grapesjs.init({
  ...
  assetManager: {
    ...,
    dropzone: 1,
    dropzoneContent: '<div class="dropzone-inner">Drop here your assets</div>'
  }
});
``` -->

## Programmatic usage

If you need to manage your assets programmatically you have to use its [APIs][API-Asset-Manager]

```js
// Get the Asset Manager module first
const am = editor.AssetManager;
```

First of all, it's worth noting that Asset Manager keeps 2 collections of assets:

- **global** - which is just the one with all available assets, you can get it with `am.getAll()`
- **visible** - this is the collection which is currently rendered by the Asset Manager, you get it with `am.getAllVisible()`

This allows you to decide which assets to show and when. Let's say we'd like to have a category switcher, first of all you gonna add to the **global** collection all your assets (which you may already defined at init by `config.assetManager.assets = [...]`)

```js
am.add([
  {
    // You can pass any custom property you want
    category: 'c1',
    src: 'http://placehold.it/350x250/78c5d6/fff/image1.jpg',
  },
  {
    category: 'c1',
    src: 'http://placehold.it/350x250/459ba8/fff/image2.jpg',
  },
  {
    category: 'c2',
    src: 'http://placehold.it/350x250/79c267/fff/image3.jpg',
  },
  // ...
]);
```

Now if you call the `render()`, without an argument, you will see all the assets rendered

```js
// without any argument
am.render();

am.getAll().length; // <- 3
am.getAllVisible().length; // <- 3
```

Ok, now let's show only assets from the first category

```js
const assets = am.getAll();

am.render(assets.filter((asset) => asset.get('category') == 'c1'));

am.getAll().length; // Still have 3 assets
am.getAllVisible().length; // but only 2 are shown
```

You can also mix arrays of assets

```js
am.render([...assets1, ...assets2, ...assets3]);
```

<!--
If you want to customize the asset manager container you can get its `HTMLElement`

```js
am.getContainer().insertAdjacentHTML('afterbegin', '<div><button type="button">Click</button></div>');
```
-->

In case you want to update or remove an asset, you can make use of this methods

```js
// Get the asset via its `src`
const asset = am.get('http://.../img.jpg');

// Update asset property
asset.set({ src: 'http://.../new-img.jpg' });

// Remove asset
am.remove(asset); // or via src, am.remove('http://.../new-img.jpg');
```

For more APIs methods check out the [API Reference][API-Asset-Manager].

### Custom select logic

::: warning
This section is referring to GrapesJS v0.17.26 or higher
:::

You can open the Asset Manager with your own select logic.

```js
am.open({
  types: ['image'], // This is the default option
  // Without select, nothing will happen on asset selection
  select(asset, complete) {
    const selected = editor.getSelected();

    if (selected && selected.is('image')) {
      selected.addAttributes({ src: asset.getSrc() });
      // The default AssetManager UI will trigger `select(asset, false)`
      // on asset click and `select(asset, true)` on double-click
      complete && am.close();
    }
  },
});
```

## Customization

The default Asset Manager UI is great for simple things, but except the possibility to tweak some CSS style, adding more complex things like a search input, filters, etc. requires a replace of the default UI.

All you have to do is to indicate the editor your intent to use a custom UI and then subscribe to the `asset:custom` event that will give you all the information on any requested change.

```js
const editor = grapesjs.init({
  // ...
  assetManager: {
    // ...
    custom: true,
  },
});

editor.on('asset:custom', (props) => {
  // The `props` will contain all the information you need in order to update your UI.
  // props.open (boolean) - Indicates if the Asset Manager is open
  // props.assets (Array<Asset>) - Array of all assets
  // props.types (Array<String>) - Array of asset types requested, eg. ['image'],
  // props.close (Function) - A callback to close the Asset Manager
  // props.remove (Function<Asset>) - A callback to remove an asset
  // props.select (Function<Asset, boolean>) - A callback to select an asset
  // props.container (HTMLElement) - The element where you should append your UI
  // Here you would put the logic to render/update your UI.
});
```

Here an example of using custom Asset Manager with a Vue component.

<demo-viewer value="wbj4tmqk" height="500" darkcode/>

The example above is the right way if you need to replace the default UI, but as you might notice we append the mounted element to the container `props.container.appendChild(this.$el);`.
This is required as the Asset Manager, by default, is placed in the [Modal](/modules/Modal.html).

How to approach the case when your Asset Manager is a completely independent/external module (eg. should be shown in its own custom modal)? Not a problem, you can bind the Asset Manager state via `assetManager.custom.open`.

```js
const editor = grapesjs.init({
  // ...
  assetManager: {
    // ...
    custom: {
      open(props) {
        // `props` are the same used in `asset:custom` event
        // ...
        // Init and open your external Asset Manager
        // ...
        // IMPORTANT:
        // When the external library is closed you have to communicate
        // this state back to the editor, otherwise GrapesJS will think
        // the Asset Manager is still open.
        // example: myAssetManager.on('close', () => props.close())
      },
      close(props) {
        // Close the external Asset Manager
      },
    },
  },
});
```

It's important to declare also the `close` function, the editor should be able to close the Asset Manager via `am.close()`.

<!--
### Define new Asset type

Generally speaking, images aren't the only asset you'll use, it could be a `video`, `svg-icon`, or any other kind of `document`. Each type of asset is applied in our templates/pages differently. If you need to change the image of the Component all you need is another `url` in `src` attribute. However In case of a `svg-icon`, it's not the same, you might want to replace the element with a new `<svg>` content. Besides this you also have to deal with the presentation/preview of the asset inside the panel/modal. For example, showing a thumbnail for big images or the possibility to preview videos.


Defining a new asset means we have to push on top of the 'Stack of Types' a new layer. This stack is iterated over by the editor at any addition of the asset and tries to associate the correct type.

```js
am.add('https://.../image.png');
// string, url, ends with '.png' -> it's an 'image' type

am.add('<svg ...');
// string and starts with '<svg...' -> 'svg' type

am.add({type: 'video', src: '...'});
// an object, has 'video' type key -> 'video' type
```

It's up to you tell the editor how to recognize your type and for this purpose you should to use `isType()` method.
Let's see now an example of how we'd start to defining a type like `svg-icon`


```js
am.addType('svg-icon', {
  // `value` is for example the argument passed in `am.add(VALUE);`
  isType(value) {
    // The condition is intentionally simple
    if (value.substring(0, 5) == '<svg ') {
      return {
        type: 'svg-icon',
        svgContent: value
      };
    }
    // Maybe you pass the `svg-icon` object already
    else if (typeof value == 'object' && value.type == 'svg-icon') {
      return value;
    }
  }
})
```

With this snippet you can already add SVGs, the asset manager will assign the appropriate type.

```js
// Add some random SVG
am.add(`<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M22,9 C22,8.4 21.5,8 20.75,8 L3.25,8 C2.5,8 2,8.4 2,9 L2,15 C2,15.6 2.5,16 3.25,16 L20.75,16 C21.5,16 22,15.6 22,15 L22,9 Z M21,15 L3,15 L3,9 L21,9 L21,15 Z"></path>
  <polygon points="4 10 5 10 5 14 4 14"></polygon>
</svg>`);
```


The default `open-assets` command shows only `image` assets, so to render `svg-icon` run this

```js
am.render(am.getAll().filter(
  asset => asset.get('type') == 'svg-icon'
));
```


You should see something like this

<img :src="$withBase('/assets-empty-view.png')">


The SVG asset is not rendered correctly and this is because we haven't yet configured its view

```js
am.addType('svg-icon', {
  view: {
    // `getPreview()` and `getInfo()` are just few helpers, you can
    // override the entire template with `template()`
    // Check the base `template()` here:
    // https://github.com/GrapesJS/grapesjs/blob/dev/packages/core/src/asset_manager/view/AssetView.ts
    getPreview() {
      return `<div style="text-align: center">${this.model.get('svgContent')}</div>`;
    },
    getInfo() {
      // You can use model's properties if you passed them:
      // am.add({
      //  type: 'svg-icon',
      //  svgContent: '<svg ...',
      //  name: 'Some name'
      //  })
      //  ... then
      //  this.model.get('name');
      return '<div>SVG description</div>';
    },
  },
  isType(value) {...}
})
```


This is the result

<img :src="$withBase('/assets-svg-view.png')">


Now we have to deal with how to assign our `svgContent` to the selected element


```js
am.addType('svg-icon', {
  view: {
    // In our case the target is the selected component
    updateTarget(target) {
      const svg = this.model.get('svgContent');

      // Just to make things bit interesting, if it's an image type
      // I put the svg as a data uri, content otherwise
      if (target.get('type') == 'image') {
        // Tip: you can also use `data:image/svg+xml;utf8,<svg ...` but you
        // have to escape few chars
        target.set('src', `data:mime/type;base64,${btoa(svg)}`);
      } else {
        target.set('content', svg);
      }
    },
    ...
  },
  isType(value) {...}
})
```


Our custom `svg-icon` asset is ready to use. You can also add a `model` to the `addType` definition to group the business logic of your asset, but usually it's optional.


```js
// Just an example of model use
am.addType('svg-icon', {
  model: {
    // With `default` you define model's default properties
    defaults: {
      type:  'svg-icon',
      svgContent: '',
      name: 'Default SVG Name',
    },

    // You can call model's methods inside views:
    // const name = this.model.getName();
    getName() {
      return this.get('name');
    }
  },
  view: {...},
  isType(value) {...}
})
```


### Extend Asset Types

Extending asset types is basically the same as adding them, you can choose what type to extend and how.

```js
// svgIconType will contain the definition (model, view, isType)
const svgIconType = am.getType('svg-icon');

// Add new type and extend another one
am.addType('svg-icon2', {
  view: svgIconType.view.extend({
    getInfo() {
      return '<div>SVG2 description</div>';
    },
  }),
  // The `isType` is important, but if you omit it the default one will be added
  // isType(value) {
  //  if (value && value.type == id) {
  //    return {type: value.type};
  //  }
  // };
})
```


You can also extend the already defined types (to be sure to load assets with the old type extended create a plugin for your definitions)

```js
// Extend the original `image` and add a confirm dialog before removing it
am.addType('image', {
  // As you adding on top of an already defined type you can avoid indicating
  // `am.getType('image').view.extend({...` the editor will do it by default
  // but you can eventually extend some other type
  view: {
    // If you want to see more methods to extend check out
    // https://github.com/GrapesJS/grapesjs/blob/dev/packages/core/src/asset_manager/view/AssetImageView.ts
    onRemove(e) {
      e.stopPropagation();
      const model = this.model;

      if (confirm('Are you sure?')) {
        model.collection.remove(model);
      }
    }
  },
})
``` -->

## Events

For a complete list of available events, you can check it [here](/api/assets.html#available-events).

[API-Asset-Manager]: /api/assets.html
```

--------------------------------------------------------------------------------

---[FILE: Blocks.md]---
Location: grapesjs-dev/docs/modules/Blocks.md

```text
---
title: Block Manager
---

# Block Manager

<p align="center"><img src="http://grapesjs.com/img/sc-grapesjs-blocks-prp.jpg" alt="GrapesJS - Block Manager" height="400" align="center"/></p>

A [Block] is a simple object which allows the end-user to reuse your [Components]. It can be connected to a single [Component] or to a complex composition of them. In this guide, you will see how to setup and take full advantage of the built-in Block Manager UI in GrapesJS.
The default UI is a lightweight component with built-in Drag & Drop support, but as you'll see next in this guide, it's easy to extend and create your own UI manager.

::: warning
To get a better understanding of the content in this guide, we recommend reading [Components] first
:::
::: warning
This guide is referring to GrapesJS v0.17.27 or higher
:::

::: tip
Need a sleek block UI that’s easy to extend and customize? [Explore the Grapes Studio SDK!](https://app.grapesjs.com/docs-sdk/configuration/blocks?utm_source=grapesjs-docs&utm_medium=tip)
:::

[[toc]]

## Configuration

To change the default configurations you have to pass the `blockManager` property with the main configuration object.

```js
const editor = grapesjs.init({
  ...
  blockManager: {
    blocks: [...],
    ...
  }
});
```

Check the full list of available options here: [Block Manager Config](https://github.com/GrapesJS/grapesjs/blob/master/src/block_manager/config/config.ts)

## Initialization

By default, Block Manager UI is considered a hidden component. Currently, the GrapesJS core, renders default panels and buttons that allow you to show them, but in the long term, this is something that might change. Here below you can see how to init the editor without default panels and immediately rendered Block Manager UI.

::: tip
Follow the [Getting Started] guide in order to setup properly the editor with custom panels.
:::

```js
const editor = grapesjs.init({
  container: '#gjs',
  height: '100%',
  storageManager: false,
  panels: { defaults: [] }, // Avoid default panels
  blockManager: {
    appendTo: '.myblocks',
    blocks: [
      {
        id: 'image',
        label: 'Image',
        media: `<svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z" />
        </svg>`,
        // Use `image` component
        content: { type: 'image' },
        // The component `image` is activatable (shows the Asset Manager).
        // We want to activate it once dropped in the canvas.
        activate: true,
        // select: true, // Default with `activate: true`
      },
    ],
  },
});
```

## Block content types

The key of connecting blocks to components is the `block.content` property and what we passed in the example above is the [Component Definition]. This is the component-oriented way to create blocks and this is how we highly recommend the creation of your blocks.

### Component-oriented

The `content` can accept different formats, like an HTML string (which will be parsed and converted to components), but the component-oriented approach is the most precise as you can keep the control of your each dropped block in the canvas. Another advice is to keep your blocks' [Component Definition] as light as possible, if you're defining a lot of redundant properties, probably it makes sense to create another dedicated component, this might reduce the size of your project JSON file. Here an example:

```js
// Your components
editor.Components.addType('my-cmp', {
  model: {
    defaults: {
      prop1: 'value1',
      prop2: 'value2',
    }
  }
});
// Your blocks
[
  { ..., content: { type: 'my-cmp', prop1: 'value1-EXT', prop2: 'value2-EXT' } }
  { ..., content: { type: 'my-cmp', prop1: 'value1-EXT', prop2: 'value2-EXT' } }
  { ..., content: { type: 'my-cmp', prop1: 'value1-EXT', prop2: 'value2-EXT' } }
]
```

Here we're reusing the same component multiple times with the same set of properties (just an example, makes more sense with composed content of components), this can be reduced to something like this.

```js
// Your components
editor.Components.addType('my-cmp', { ... });
editor.Components.addType('my-cmp-alt', {
  extend: 'my-cmp',
  model: {
    defaults: {
      prop1: 'value1-EXT',
      prop2: 'value2-EXT'
    }
  }
});
// Your blocks
[
  { ..., content: { type: 'my-cmp-alt' } }
  { ..., content: { type: 'my-cmp-alt' } }
  { ..., content: { type: 'my-cmp-alt' } }
]
```

### HTML strings

Using HTML strings as `content` is not wrong, in some cases you don't need the finest control over components and want to leave the user full freedom on template composition (eg. static site builder editor with HTML copy-pasted from a framework like [Tailwind Components](https://tailwindcomponents.com/))

```js
// Your block
{
  // ...
  content: `<div class="el-X">
    <div class="el-Y el-A">Element A</div>
    <div class="el-Y el-B">Element B</div>
    <div class="el-Y el-C">Element C</div>
  </div>`;
}
```

In such a case, all rendered elements will be converted to the best suited default component (eg. `.el-Y` elements will be treated like `text` components). The user will be able to style and drag them with no particular restrictions.

Thanks to Components' [isComponet](Components.html#iscomponent) feature (executed post parsing), you're still able to bind your rendered elements to components and enforce an extra logic. Here an example how you would enforce all `.el-Y` elements to be placed only inside `.el-X` one, without touching any part of the original HTML used in the `content`.

```js
// Your component
editor.Components.addType('cmp-Y', {
  // Detect '.el-Y' elements
  isComponent: (el) => el.classList?.contains('el-Y'),
  model: {
    defaults: {
      name: 'Component Y', // Simple custom name
      draggable: '.el-X', // Add `draggable` logic
    },
  },
});
```

Another alternative is to leverage `data-gjs-*` attributes to attach properties to components.

::: tip
You can use most of the available [Component properties](/api/component.html#properties).
:::

```js
// -- [Option 1]: Declare type in HTML strings --
{
  // ...
  content: `<div class="el-X">
    <div data-gjs-type="cmp-Y" class="el-Y el-A">Element A</div>
    <div data-gjs-type="cmp-Y" class="el-Y el-B">Element B</div>
    <div data-gjs-type="cmp-Y" class="el-Y el-C">Element C</div>
  </div>`;
}
// Component
editor.Components.addType('cmp-Y', {
  // You don't need `isComponent` anymore as you declare types already on elements
  model: {
    defaults: {
      name: 'Component Y', // Simple custom name
      draggable: '.el-X', // Add `draggable` logic
    },
  },
});

// -- [Option 2]: Declare properties in HTML strings (less recommended option) --
{
  // ...
  content: `<div class="el-X">
    <div data-gjs-name="Component Y" data-gjs-draggable=".el-X" class="el-Y el-A">Element A</div>
    <div data-gjs-name="Component Y" data-gjs-draggable=".el-X" class="el-Y el-B">Element B</div>
    <div data-gjs-name="Component Y" data-gjs-draggable=".el-X" class="el-Y el-C">Element C</div>
  </div>`;
}
// No need for a custom component.
// You're already defining properties of each element.
```

Here we showed all the possibilities you have with HTML strings, but we strongly advise against the abuse of the `Option 2` and to stick to a more component-oriented approach.
Without a proper component type, not only your HTML will be harder to read, but all those defined properties will be "hard-coded" to a generic component of those elements. So, if one day you decide to "upgrade" the logic of the component (eg. `draggable: '.el-X'` -> `draggable: '.el-X, .el-Z'`), you won't be able.

### Mixed

It's also possible to mix components with HTML strings by passing an array.

```js
{
  // ...
  // Options like `activate`/`select` will be triggered only on the first component.
  activate: true,
  content: [
    { type: 'image' },
    `<div>Extra</div>`
  ]
}
```

## Important caveats

::: danger Read carefully
&nbsp;
:::

### Avoid non serializable properties

Don't put non serializable properties, like functions, in your blocks, keep them only in your components.

```js
// Your block
{
  content: {
    type: 'my-cmp',
    script() {...},
  },
}
```

This will work, but if you try to save and reload a stored project, those will disappear.

### Avoid styles

Don't put styles in your blocks, keep them always in your components.

```js
// Your block
{
  content: [
    // BAD: You risk to create conflicting styles
    { type: 'my-cmp', styles: '.cmp { color: red }' },
    { type: 'my-cmp', styles: '.cmp { color: green }' },

    // REALLY BAD: In case all related components are removed,
    // there is no safe way for the editor to know how to connect
    // and clean your styles.
    `<div class="el">Element</div>
    <div class="el2">Element 2</div>
    <style>
      .el { color: blue }
      .el2 { color: violet }
    </style>`,
  ],
}
```

<!-- Styles imported via component definition, by using the `styles` property, are connected to that specific component type. This allows the editor to remove automatically those styles if all related components are deleted. -->

With the component-oriented approach, you put yourself in a risk of conflicting styles and having a lot of useless redundant styles definitions in your project JSON.

With the HTML string, if you remove all related elements, the editor is not able to clean those styles from the project JSON, as there is no safe way to connect them.

## Programmatic usage

If you need to manage your blocks programmatically you can use its [APIs][Blocks API].

::: warning
All Blocks API methods update mainly your Block Manager UI, it has nothing to do with Components already dropped in the canvas.
:::

Below an example of commonly used methods.

```js
// Get the BlockManager module first
const bm = editor.Blocks; // `Blocks` is an alias of `BlockManager`

// Add a new Block
const block = bm.add('BLOCK-ID', {
  // Your block properties...
  label: 'My block',
  content: '...',
});

// Get the Block
const block2 = bm.get('BLOCK-ID-2');

// Update the Block properties
block2.set({
  label: 'Updated block',
});

// Remove the Block
const removedBlock = bm.remove('BLOCK-ID-2');
```

To know more about the available block properties, check the [Block API Reference][Block].

## Customization

The default Block Manager UI is great for simple things, but except the possibility to tweak some CSS style, adding more complex elements requires a replace of the default UI.

All you have to do is to indicate the editor your intent to use a custom UI and then subscribe to the `block:custom` event that will give you all the information on any requested change.

```js
const editor = grapesjs.init({
  // ...
  blockManager: {
    // ...
    custom: true,
  },
});

editor.on('block:custom', (props) => {
  // The `props` will contain all the information you need in order to update your UI.
  // props.blocks (Array<Block>) - Array of all blocks
  // props.dragStart (Function<Block>) - A callback to trigger the start of block dragging.
  // props.dragStop (Function<Block>) - A callback to trigger the stop of block dragging.
  // props.container (HTMLElement) - The default element where you can append your UI
  // Here you would put the logic to render/update your UI.
});
```

Here an example of using custom Block Manager with a Vue component.

<demo-viewer value="xyofm1qr" height="500" darkcode/>

From the demo above you can also see how we decided to hide our custom Block Manager and append it to the default container, but that is up to your preferences.

## Events

For a complete list of available events, you can check it [here](/api/block_manager.html#available-events).

<!--
## Custom render <Badge text="0.14.55+"/>

If you need to customize the aspect of each block you can pass a `render` callback function in the block definition. Let's see how it works.

As a first option, you can return a simple HTML string, which will be used as a new inner content of the block. As an argument of the callback you will get an object containing the following properties:

* `model` - Block's model (so you can use any passed property to it)
* `el` - Current rendered HTMLElement of the block
* `className` - The base class name used for blocks (useful if you follow BEM, so you can create classes like `${className}__elem`)

```js
blockManager.add('some-block-id', {
  label: `<div>
      <img src="https://picsum.photos/70/70"/>
      <div class="my-label-block">Label block</div>
    </div>`,
  content: '<div>...</div>',
  render: ({ model, className }) => `<div class="${className}__my-wrap">
      Before label
      ${model.get('label')}
      After label
    </div>`,
});
```

<img :src="$withBase('/block-custom-render.jpg')">


Another option would be to avoid returning from the callback (in that case nothing will be replaced) and edit only the current `el` block element

```js
blockManager.add('some-block-id', {
  // ...
  render: ({ el }) => {
    const btn = document.createElement('button');
    btn.innerHTML = 'Click me';
    btn.addEventListener('click', () => alert('Do something'))
    el.appendChild(btn);
  },
});
```
<img :src="$withBase('/block-custom-render2.jpg')">
-->

[Block]: /api/block.html
[Component]: /api/component.html
[Components]: Components.html
[Getting Started]: /getting-started.html
[Blocks API]: /api/block_manager.html
[Component Definition]: Components.html#component-definition
```

--------------------------------------------------------------------------------

---[FILE: Canvas.md]---
Location: grapesjs-dev/docs/modules/Canvas.md

```text
---
title: Canvas
---

# Canvas

::: danger WIP
The documentation of this module is still a work in progress.
:::

::: warning
This guide is referring to GrapesJS v0.21.5 or higher
:::

[[toc]]

## Configuration

To change the default configurations you have to pass the `canvas` property with the main configuration object.

```js
const editor = grapesjs.init({
  ...
  canvas: {
    ...
  }
});
```

Check the full list of available options here: [Canvas Config](https://github.com/GrapesJS/grapesjs/blob/master/src/canvas/config/config.ts)

## Canvas Spots

Canvas spots are elements drawn on top of the canvas. They can be used to represent anything you might need but the most common use case of canvas spots is rendering information and managing components rendered in the canvas.

In order to get a better understanding of canvas spots let's see their built-in types usage.

### Built-in spot types

#### Select type

<img :src="$withBase('/canvas-spot-select.jpg')" class="img-ctr" style="max-height: 100px">

The `select` type is responsable for showing selected components and rendering the available toolbar items of the last selected component.

::: tip
Get the toolbar items from the component.

```js
const toolbarItems = editor.getSelected().toolbar;
```

:::

#### Resize type

<img :src="$withBase('/canvas-spot-resize.jpg')" class="img-ctr" style="max-height: 200px">

The `resize` type allows resizing of a component, based on the component's resizable options.

::: tip
Get the component resizable options.

```js
const resizable = editor.getSelected().resizable;
```

:::

#### Target type

<img :src="$withBase('/canvas-spot-target.jpg')" class="img-ctr" style="max-height: 200px">

The `target` type is used to highlight the component, like during the drag & drop, to show where the component will be placed.

::: warning
The default green position indicator is not part of the spot but you can easily customize it via CSS.

```css
.gjs-placeholder.horizontal {
  border-color: transparent red;
}
.gjs-placeholder.vertical {
  border-color: red transparent;
}
.gjs-placeholder-int {
  background-color: red;
}
```

:::

#### Hover type

<img :src="$withBase('/canvas-spot-hover.jpg')" class="img-ctr" style="max-height: 200px">

The `hover` is used to highlight the hovered component and show the component name.

::: tip
Get the component name.

```js
const name = editor.getSelected().getName();
```

:::

#### Spacing type

The `spacing` type is used to show component offsets like paddings and margins (visible on the `hover` type image above).

### Disable built-in types

You can disable the rendering of built-in canvas spots (some or all of them) during the editor initialization.

```js
grapesjs.init({
  // ...
  canvas: {
    // Disable only the hover type spot
    customSpots: {
      hover: true,
    },
    // Disable all built-in spots
    customSpots: true,
  },
});
```

In the next section, we'll see how it's possible to reuse the built-in spots and create your own.

### Spots customization

In the example below we'll see how to reuse the built-in `hover` canvas spot to render our custom highlighting rectangle (we'll disable the rendering of the default one) and create a new one in order to render a button below the selected `text` components.

[DEMO](https://jsfiddle.net/artur_arseniev/zdetbjsg/)

<demo-viewer value="zdetbjsg" height="500" darkcode/>

Worth noting a few important points:

- Our custom container has to be moved inside the GrapesJS spots container.

```js
editor.onReady(() => {
  Canvas.getSpotsEl().appendChild(this.$el);
});
```

- We pass the `component` to our custom spot, in order to have the style coordinates properly updated when we scroll the page or update the component.

```js
Canvas.addSpot({ type: customSpotType, component });
```

- The single spot is placed properly with `spot.getStyle()`

```html
<div ... class="spot" :style="spot.getStyle()">...</div>
```

- The spots container, by default, relies on `pointer-events: none`, in order to prevent the spot from blocking the interaction with the components. This is why we have to re-enable the pointer event on the button in order to make it interactable.

```css
.spot-text-btn {
  /*...*/
  pointer-events: auto;
}
```

<!-- Demo template, here for reference
<style>
    .spot-text-btn {
        background-color: #3b97e3;
        border: none;
        color: white;
        padding: 4px 8px;
        border-radius: 3px;
        cursor: pointer;
        position: absolute;
        left: 50%;
        bottom: 0;
        translate: -50% 120%;
        pointer-events: auto;
    }
    .spot-hover {
        border: 2px solid #d23be3;
    }
    .spot-hover-tag {
        background-color: #d23be3;
        color: white;
        padding: 4px 8px;
        position: absolute;
        left: 0;
        bottom: 0;
        translate: 0% 100%;
        white-space: nowrap;
    }
</style>

<div class="vue-app">
    <div
      v-for="spot in spots"
      v-if="isSpotToShow(spot)"
      :key="spot.id"
      :class="{spot: 1, 'spot-hover': isHoverSpot(spot) }"
      :style="spot.getStyle()"
    >
      <button
        v-if="isTextSelectedSpot(spot)"
        class="spot-text-btn" type="button" @click="onBtnAdd"
      >
        + Add
      </button>
      <span
        v-if="isHoverSpot(spot)"
        class="spot-hover-tag"
      >
        Name: {{ spot.component.getName() }}
      </span>
    </div>
</div>

<script>
  const app = new Vue({
    el: '.vue-app',
    data: { spots: [] },
    mounted() {
      const { Canvas } = editor;
      // Catch-all event for any spot update
      editor.on('canvas:spot', this.onCanvasSpot);

      // Add a new custom canvas spot for the last selected text component.
      editor.on('component:toggled', (component) => {
        // Remove all spots related to out custom type
        Canvas.removeSpots({ type: 'my-text-spot' });

        if (component === editor.getSelected() && component.is('text')) {
          Canvas.addSpot({ type: 'my-text-spot', component });
        }
      });

      editor.onReady(() => {
        editor.Canvas.getSpotsEl().appendChild(this.$el);
      });
    },
    methods: {
      onCanvasSpot() {
        this.spots = editor.Canvas.getSpots();
        console.log('onCanvasSpot', this.spots.map(s => s.id));
      },
      onBtnAdd() {
        const selected = editor.getSelected();
        const parent = selected.parent();
        if (parent) {
          parent.append(
            { type: 'text', components: 'New text component' },
            { at: selected.index() + 1 }
          )
        }
      },
      isTextSelectedSpot(spot) {
        return spot.type === 'my-text-spot';
      },
      isHoverSpot(spot) {
        return spot.type === 'hover';
      },
      isSpotToShow(spot) {
        return this.isTextSelectedSpot(spot) || this.isHoverSpot(spot);
      },
    }
  });
</script>
-->

## Events

For a complete list of available events, you can check it [here](/api/canvas.html#available-events).
```

--------------------------------------------------------------------------------

````
