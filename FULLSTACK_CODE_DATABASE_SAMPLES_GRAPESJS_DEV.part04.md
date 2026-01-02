---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 4
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 4 of 97)

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

---[FILE: getting-started.md]---
Location: grapesjs-dev/docs/getting-started.md

```text
---
title: Getting Started
pageClass: page__getting-started
meta:
  - name: keywords
    content: grapesjs getting started
---

# Getting Started

This is a step-by-step guide for anyone who wants to create their own builder with GrapesJS. This is not a comprehensive guide, just a concise overview of the most common modules. Follow along to create a page builder from scratch. Skip to the end of this page to see the [final result](#final-result).

::: tip

Looking for a customizable version of GrapesJS with an embeddable, production-ready UI? [Explore the Grapes Studio SDK!](https://app.grapesjs.com/docs-sdk/overview/getting-started) 

:::

## Import the library

Before you start using GrapesJS, you'll have to import it. Let's import the latest version:

```html
<link rel="stylesheet" href="//unpkg.com/grapesjs/dist/css/grapes.min.css" />
<script src="//unpkg.com/grapesjs"></script>
<!--
If you need plugins, put them below the main grapesjs script
<script src="/path/to/some/plugin.min.js"></script>
-->
```

or if you're in a Node environment

```js
import 'grapesjs/dist/css/grapes.min.css';
import grapesjs from 'grapesjs';
// If you need plugins, put them below the main grapesjs script
// import 'grapesjs-some-plugin';
```

## Start from the canvas

The first step is to define the interface of our editor. For this purpose we gonna start with basic HTML layouts. Finding a common structure for the UI of any project is not an easy task. That's why GrapesJS prefers to keep this process as simple as possible. We provide a few helpers, but let the user define the interface. This guarantees maximum flexibility.
The main part of the GrapesJS editor is the canvas, this is where you create the structure of your templates and you can't miss it. Let's try to initiate the editor with the canvas and no panels.

<<< @/.vuepress/components/demos/DemoCanvasOnly.html
<<< @/.vuepress/components/demos/DemoCanvasOnly.js
<<< @/.vuepress/components/demos/DemoCanvasOnly.css
<Demo>
<DemoCanvasOnly/>
</Demo>

With just the canvas you're already able to move, copy and delete components from the structure. For now, we see the example template taken from the container. Next let's look at how to create and drag custom blocks into our canvas.

## Add Blocks

The block in GrapesJS is just a reusable piece of HTML that you can drop in the canvas. A block can be an image, a button, or an entire section with videos, forms and iframes. Let's start by creating another container and append a few basic blocks inside of it. Later we can use this technique to build more complex structures.

```html{4}
<div id="gjs">
  ...
</div>
<div id="blocks"></div>
```

```js
const editor = grapesjs.init({
  // ...
  blockManager: {
    appendTo: '#blocks',
    blocks: [
      {
        id: 'section', // id is mandatory
        label: '<b>Section</b>', // You can use HTML/SVG inside labels
        attributes: { class: 'gjs-block-section' },
        content: `<section>
          <h1>This is a simple title</h1>
          <div>This is just a Lorem text: Lorem ipsum dolor sit amet</div>
        </section>`,
      },
      {
        id: 'text',
        label: 'Text',
        content: '<div data-gjs-type="text">Insert your text here</div>',
      },
      {
        id: 'image',
        label: 'Image',
        // Select the component once it's dropped
        select: true,
        // You can pass components as a JSON instead of a simple HTML string,
        // in this case we also use a defined component type `image`
        content: { type: 'image' },
        // This triggers `active` event on dropped components and the `image`
        // reacts by opening the AssetManager
        activate: true,
      },
    ],
  },
});
```

```css
.gjs-block {
  width: auto;
  height: auto;
  min-height: auto;
}
```

<Demo>
 <DemoBasicBlocks/>
</Demo>

As you can see we add our blocks via the initial configuration. Obviously there might be a case in which you would like to add them dynamically, in this case you have to use the [Block Manager API](api/block_manager.html):

```js
editor.BlockManager.add('my-block-id', {
  label: '...',
  category: '...',
  // ...
});
```

::: tip
If you want to learn more about blocks we suggest reading its dedicated article: [Block Manager Module](modules/Blocks.html).
:::

## Define Components

Technically, once you drop your HTML block inside the canvas each element of the content is transformed into a GrapesJS Component. A GrapesJS Component is an object containing information about how the element is rendered in the canvas (managed in the View) and how it might look in its final code (created by the properties in the Model). Generally, all Model properties are reflected in the View. Therefore, if you add a new attribute to the model, it will be available in the export code (which we will learn more about later), and the element you see in the canvas will be updated with new attributes.
This isn't totally out of the ordinary, but the unique thing about Components is that you can create a totally decoupled View. This means you can show the user whatever you desire regardless of what is in the Model. For example, by dragging a placeholder text you can fetch and show instead a dynamic content. If you want to learn more about Custom Components, you should check out [Component Manager Module](modules/Components.html).

GrapesJS comes with a few [built-in Components](modules/Components.html#built-in-component-types) that enable different features once rendered in the canvas. For example, by double clicking on an image component you will see the default [Asset Manager](modules/Assets.html), which you can customize or integrate your own. By double clicking on the text component you're able to edit it via the built-in Rich Text Editor, which is also customizable and [replaceable](guides/Replace-Rich-Text-Editor.html).

As we have seen before you can create Blocks directly as Components:

```js
editor.BlockManager.add('my-block-id', {
  // ...
  content: {
    tagName: 'div',
    draggable: false,
    attributes: { 'some-attribute': 'some-value' },
    components: [
      {
        tagName: 'span',
        content: '<b>Some static content</b>',
      },
      {
        tagName: 'div',
        // use `content` for static strings, `components` string will be parsed
        // and transformed in Components
        components: '<span>HTML at some point</span>',
      },
    ],
  },
});
```

::: tip
Check out the [Components API](api/components.html) to learn how to interact with components dynamically.
:::

An example of how to select some inner component and replace its children with new contents:

```js
// The wrapper is the root Component
const wrapper = editor.DomComponents.getWrapper();
const myComponent = wrapper.find('div.my-component')[0];
myComponent.components().forEach(component => /* ... do something ... */);
myComponent.components('<div>New content</div>');
```

## Panels & Buttons

Now that we have a canvas and custom blocks let's see how to create a new custom panel with some buttons inside (using [Panels API](api/panels.html)) which trigger commands (the core one or custom).

```html{1,2,3}
<div class="panel__top">
    <div class="panel__basic-actions"></div>
</div>
<div id="gjs">
  ...
</div>
<div id="blocks"></div>
```

```css
.panel__top {
  padding: 0;
  width: 100%;
  display: flex;
  position: initial;
  justify-content: center;
  justify-content: space-between;
}
.panel__basic-actions {
  position: initial;
}
```

```js
editor.Panels.addPanel({
  id: 'panel-top',
  el: '.panel__top',
});
editor.Panels.addPanel({
  id: 'basic-actions',
  el: '.panel__basic-actions',
  buttons: [
    {
      id: 'visibility',
      active: true, // active by default
      className: 'btn-toggle-borders',
      label: '<u>B</u>',
      command: 'sw-visibility', // Built-in command
    },
    {
      id: 'export',
      className: 'btn-open-export',
      label: 'Exp',
      command: 'export-template',
      context: 'export-template', // For grouping context of buttons from the same panel
    },
    {
      id: 'show-json',
      className: 'btn-show-json',
      label: 'JSON',
      context: 'show-json',
      command(editor) {
        editor.Modal.setTitle('Components JSON')
          .setContent(
            `<textarea style="width:100%; height: 250px;">
            ${JSON.stringify(editor.getComponents())}
          </textarea>`,
          )
          .open();
      },
    },
  ],
});
```

<Demo>
 <DemoCustomPanels/>
</Demo>

We have defined where to render the panel with `el: '#basic-panel'` and then for each button we added a `command` property. The command could be the id, an object with `run` and `stop` functions or simply a single function.
Try to use [Commands](api/commands.html) when possible, they allow you to track actions globally. Commands also execute callbacks before and after their execution (you can even interrupt them).

```js
editor.on('run:export-template:before', (opts) => {
  console.log('Before the command run');
  if (0 /* some condition */) {
    opts.abort = 1;
  }
});
editor.on('run:export-template', () => console.log('After the command run'));
editor.on('abort:export-template', () => console.log('Command aborted'));
```

::: tip
Check out the [Panels API](api/panels.html) to see all the available methods.
:::

## Layers

Another utility tool you might find useful when working with web elements is the layer manager. It's a tree overview of the structure nodes and enables you to manage it easier. To enable it you just have to specify where you want to render it.

```html{4,5,6,7,8,9,10,11}
<div class="panel__top">
    <div class="panel__basic-actions"></div>
</div>
<div class="editor-row">
  <div class="editor-canvas">
    <div id="gjs">...</div>
  </div>
  <div class="panel__right">
    <div class="layers-container"></div>
  </div>
</div>
<div id="blocks"></div>
```

<<< @/.vuepress/components/demos/DemoLayers.css

```js
const editor = grapesjs.init({
  // ...
  layerManager: {
    appendTo: '.layers-container',
  },
  // We define a default panel as a sidebar to contain layers
  panels: {
    defaults: [
      {
        id: 'layers',
        el: '.panel__right',
        // Make the panel resizable
        resizable: {
          maxDim: 350,
          minDim: 200,
          tc: false, // Top handler
          cl: true, // Left handler
          cr: false, // Right handler
          bc: false, // Bottom handler
          // Being a flex child we need to change `flex-basis` property
          // instead of the `width` (default)
          keyWidth: 'flex-basis',
        },
      },
    ],
  },
});
```

<Demo>
 <DemoLayers/>
</Demo>

## Style Manager

Once you have defined the structure of the template the next step is the ability to style it. To meet this need GrapesJS includes the Style Manager module which is composed by CSS style properties and sectors. To make it more clear, let's see how to define a basic set.

Let's start by adding one more panel inside the `panel__right` and another one in `panel__top` which will contain a Layer/Style Manager switcher:

```html{3,8}
<div class="panel__top">
    <div class="panel__basic-actions"></div>
    <div class="panel__switcher"></div>
</div>
...
  <div class="panel__right">
    <div class="layers-container"></div>
    <div class="styles-container"></div>
  </div>
...
```

```css
.panel__switcher {
  position: initial;
}
```

```js
const editor = grapesjs.init({
  // ...
  panels: {
    defaults: [
      // ...
      {
        id: 'panel-switcher',
        el: '.panel__switcher',
        buttons: [
          {
            id: 'show-layers',
            active: true,
            label: 'Layers',
            command: 'show-layers',
            // Once activated disable the possibility to turn it off
            togglable: false,
          },
          {
            id: 'show-style',
            active: true,
            label: 'Styles',
            command: 'show-styles',
            togglable: false,
          },
        ],
      },
    ],
  },
  // The Selector Manager allows to assign classes and
  // different states (eg. :hover) on components.
  // Generally, it's used in conjunction with Style Manager
  // but it's not mandatory
  selectorManager: {
    appendTo: '.styles-container',
  },
  styleManager: {
    appendTo: '.styles-container',
    sectors: [
      {
        name: 'Dimension',
        open: false,
        // Use built-in properties
        buildProps: ['width', 'min-height', 'padding'],
        // Use `properties` to define/override single property
        properties: [
          {
            // Type of the input,
            // options: integer | radio | select | color | slider | file | composite | stack
            type: 'integer',
            name: 'The width', // Label for the property
            property: 'width', // CSS property (if buildProps contains it will be extended)
            units: ['px', '%'], // Units, available only for 'integer' types
            defaults: 'auto', // Default value
            min: 0, // Min value, available only for 'integer' types
          },
        ],
      },
      {
        name: 'Extra',
        open: false,
        buildProps: ['background-color', 'box-shadow', 'custom-prop'],
        properties: [
          {
            id: 'custom-prop',
            name: 'Custom Label',
            property: 'font-size',
            type: 'select',
            defaults: '32px',
            // List of options, available only for 'select' and 'radio'  types
            options: [
              { value: '12px', name: 'Tiny' },
              { value: '18px', name: 'Medium' },
              { value: '32px', name: 'Big' },
            ],
          },
        ],
      },
    ],
  },
});

// Define commands
editor.Commands.add('show-layers', {
  getRowEl(editor) {
    return editor.getContainer().closest('.editor-row');
  },
  getLayersEl(row) {
    return row.querySelector('.layers-container');
  },

  run(editor, sender) {
    const lmEl = this.getLayersEl(this.getRowEl(editor));
    lmEl.style.display = '';
  },
  stop(editor, sender) {
    const lmEl = this.getLayersEl(this.getRowEl(editor));
    lmEl.style.display = 'none';
  },
});
editor.Commands.add('show-styles', {
  getRowEl(editor) {
    return editor.getContainer().closest('.editor-row');
  },
  getStyleEl(row) {
    return row.querySelector('.styles-container');
  },

  run(editor, sender) {
    const smEl = this.getStyleEl(this.getRowEl(editor));
    smEl.style.display = '';
  },
  stop(editor, sender) {
    const smEl = this.getStyleEl(this.getRowEl(editor));
    smEl.style.display = 'none';
  },
});
```

<Demo>
  <DemoStyle/>
</Demo>

Inside Style Manager definition we use `buildProps` which helps us create common properties from [available built-in objects](modules/Style-manager.html#built-in-properties) then in `properties` we can override same objects (eg. passing another `name` to change the label) identified by `property` name. As you can see from `custom-prop` example it's a matter of defining the CSS `property` and the input `type`. We suggest checking a more complete example of Style Manager properties usage from the [webpage preset demo](https://github.com/GrapesJS/grapesjs/blob/gh-pages/demo.html#L1000).

::: tip
Check the [Style Manager API](api/panels.html) to see how to update sectors and properties dynamically.
:::

<!--
To get more about style manager extension check out this guide.
Each component can also indicate what to style and what not.

-- Example component with limit styles
-->

## Traits

Most of the time you would style your components and place them somewhere in the structure, but sometimes your components might need custom attributes or even custom behaviors and for this need you can make use of traits. Traits are commonly used to update HTML element attributes (eg. `placeholder` for inputs or `alt` for images), but you can also define your own custom traits. Access the selected Component model and do whatever you want. For this guide, we are going to show you how to render available traits, for more details on how to extend them we suggest you read the [Trait Manager Module page](modules/Traits.html).

Let's create a new container for traits. Tell the editor where to render it and update the sidebar switcher:

```html{5}
...
  <div class="panel__right">
    <div class="layers-container"></div>
    <div class="styles-container"></div>
    <div class="traits-container"></div>
  </div>
...
```

```js
const editor = grapesjs.init({
  // ...
  panels: {
    defaults: [
      // ...
      {
        id: 'panel-switcher',
        el: '.panel__switcher',
        buttons: [
          // ...
          {
            id: 'show-traits',
            active: true,
            label: 'Traits',
            command: 'show-traits',
            togglable: false,
          },
        ],
      },
    ],
  },
  traitManager: {
    appendTo: '.traits-container',
  },
});

// Define command
// ...
editor.Commands.add('show-traits', {
  getTraitsEl(editor) {
    const row = editor.getContainer().closest('.editor-row');
    return row.querySelector('.traits-container');
  },
  run(editor, sender) {
    this.getTraitsEl(editor).style.display = '';
  },
  stop(editor, sender) {
    this.getTraitsEl(editor).style.display = 'none';
  },
});
```

<Demo>
  <DemoTraits/>
</Demo>

Now if you switch to the Trait panel and select one of the inner components you should see its default traits.

## Responsive templates

GrapesJS implements a module which allows you to work with responsive templates easily. Let's see how to define different devices and a button for device switching:

```html{3}
<div class="panel__top">
    <div class="panel__basic-actions"></div>
    <div class="panel__devices"></div>
    <div class="panel__switcher"></div>
</div>
...
```

```css
.panel__devices {
  position: initial;
}
```

```js
const editor = grapesjs.init({
  // ...
  deviceManager: {
    devices: [
      {
        name: 'Desktop',
        width: '', // default size
      },
      {
        name: 'Mobile',
        width: '320px', // this value will be used on canvas width
        widthMedia: '480px', // this value will be used in CSS @media
      },
    ],
  },
  // ...
  panels: {
    defaults: [
      // ...
      {
        id: 'panel-devices',
        el: '.panel__devices',
        buttons: [
          {
            id: 'device-desktop',
            label: 'D',
            command: 'set-device-desktop',
            active: true,
            togglable: false,
          },
          {
            id: 'device-mobile',
            label: 'M',
            command: 'set-device-mobile',
            togglable: false,
          },
        ],
      },
    ],
  },
});

// Commands
editor.Commands.add('set-device-desktop', {
  run: (editor) => editor.setDevice('Desktop'),
});
editor.Commands.add('set-device-mobile', {
  run: (editor) => editor.setDevice('Mobile'),
});
```

<Demo>
  <DemoDevices/>
</Demo>

As you can see from the commands definition we use the `editor.setDevice` method to change the size of the viewport. In case you need to trigger an action on device change you can setup a listener like this:

```js
editor.on('change:device', () => console.log('Current device: ', editor.getDevice()));
```

What about the mobile-first approach? You can achieve it by changing your configurations in this way:

```js
const editor = grapesjs.init({
  // ...
  mediaCondition: 'min-width', // default is `max-width`
  deviceManager: {
    devices: [
      {
        name: 'Mobile',
        width: '320',
        widthMedia: '',
      },
      {
        name: 'Desktop',
        width: '',
        widthMedia: '1024',
      },
    ],
  },
  // ...
});

// Set initial device as Mobile
editor.setDevice('Mobile');
```

::: tip
Check out the [Device Manager API](api/device_manager.html) to see all the available methods.
:::

## Store & load data

Once you have finished with defining your builder interface the next step would be to setup the storing and loading process.
GrapesJS implements 2 simple type of storages inside its Storage Manager: The local (by using `localStorage`, active by default) and the remote one. Those are enough to cover most of the cases, but it's also possible to add new implementations ([grapesjs-indexeddb](https://github.com/GrapesJS/storage-indexeddb) is a good example).
Let's see how the default options work:

```js
grapesjs.init({
  // ...
  storageManager: {
    type: 'local', // Type of the storage, available: 'local' | 'remote'
    autosave: true, // Store data automatically
    autoload: true, // Autoload stored data on init
    stepsBeforeSave: 1, // If autosave enabled, indicates how many changes are necessary before store method is triggered
    options: {
      local: {
        // Options for the `local` type
        key: 'gjsProject', // The key for the local storage
      },
    },
  },
});
```

Let's take a look at the configuration required to setup the remote storage:

```js
grapesjs.init({
  // ...
  storageManager: {
    type: 'remote',
    // ...
    stepsBeforeSave: 10,
    options: {
      remote: {
        headers: {}, // Custom headers for the remote storage request
        urlStore: 'https://your-server/endpoint/store', // Endpoint URL where to store data project
        urlLoad: 'https://your-server/endpoint/load', // Endpoint URL where to load data project
      },
    },
  },
});
```

As you might noticed, we've left some default options unchanged, increased changes necessary for autosave triggering and passed remote endpoints.
If you prefer you could also disable the autosaving and use a custom command to trigger the store:

```js
// ...
  storageManager: {
    type: 'remote',
    autosave: false,
    // ...
  },
  // ...
  commands: {
    defaults: [
      // ...
      {
        id: 'store-data',
        run(editor) {
          editor.store();
        },
      }
    ]
  }
// ...
```

To get a better overview of the Storage Manager and how you should store/load the template, or how to define new storages you should read the [Storage Manager Module](modules/Storage.html) page.

## Theming

One last step that might actually improve a lot your editor personality is how it looks visually. To achieve an easy theming we have adapted an atomic design for this purpose. So for example to customize the main palette of colors all you have to do is to place your custom CSS rules after the GrapesJS styles.

To complete our builder let's customize its color palette and to make it more visually "readable" we can replace all button labels with SVG icons:

```css
/* We can remove the border we've set at the beginning */
#gjs {
  border: none;
}
/* Theming */

/* Primary color for the background */
.gjs-one-bg {
  background-color: #78366a;
}

/* Secondary color for the text color */
.gjs-two-color {
  color: rgba(255, 255, 255, 0.7);
}

/* Tertiary color for the background */
.gjs-three-bg {
  background-color: #ec5896;
  color: white;
}

/* Quaternary color for the text color */
.gjs-four-color,
.gjs-four-color-h:hover {
  color: #ec5896;
}
```

There is also a bunch of [CSS custom properties (variables)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) that you can use to customize the styles of the editor.

For example, you could achieve the same result as above by doing this:

```css
:root {
  --gjs-primary-color: #78366a;
  --gjs-secondary-color: rgba(255, 255, 255, 0.7);
  --gjs-tertiary-color: #ec5896;
  --gjs-quaternary-color: #ec5896;
}
```

And here is our final result:

<Demo id="final-result">
  <DemoTheme/>
</Demo>
```

--------------------------------------------------------------------------------

---[FILE: Home.md]---
Location: grapesjs-dev/docs/Home.md

```text
# Getting started

This page will introduce you to the main options of GrapesJS and how it works, in the way to be able to create your custom editor.

The pretty minimalistic way to instantiate the editor could be like this:

```html
<link rel="stylesheet" href="path/to/grapes.min.css" />
<script src="path/to/grapes.min.js"></script>

<div id="gjs"></div>

<script type="text/javascript">
  var editor = grapesjs.init({
    container: '#gjs',
    components: '<div class="txt-red">Hello world!</div>',
    style: '.txt-red{color: red}',
  });
</script>
```

In just few lines, with the default configurations, you're already able to see something with which play around.

[[img/default-gjs.jpg]]

You'll see components commands on top left position that come handy to create and manage your blocks, below there are options which need to highlight and export them. When you select components ('mouse pointer' icon), on the right side, you should see pop up Class Manager and Style Manager options which allow to customize the style of the components. There is also a Layer Manager/Navigator ('hamburger' icon) which helps to manage easily the structure.

Of course all those stuff (panels, buttons, commands, etc.) are set just as default so you can overwrite them and add more other. Before you start to create things you should know that GrapesJS UI is composed basically by a canvas (where you will 'draw') and panels (which will contain buttons)

[[img/canvas-panels.jpg]]

If you'd like to extend the already instantiated editor you have to check [API Reference]. Check also [how to create plugins](./Creating-plugins) using the same API.
In this guide we'll focus on how to initialize the editor with all custom UI from scratch.

Let's start the editor with some basic toolbar panel

```js
...
var editor = grapesjs.init({
    container : '#gjs',
    height: '100%',

    panels: {
      defaults: [{
          id: 'commands',
      }],
    }
});
...
```

In this example we set a panel with 'commands' as an id and after the render we'll see nothing more than an empty div added to our panels. The new panel is already styled as the id 'commands' is one of the default but you can use whatever you like and place it wherever you want with CSS. With refresh we might see something like shown in the image below, with the new panel on the left:

[[img/new-panel.png]]

> Check [Editor API Reference] for more details about editor configurations

Now let's put some button inside

```js
...
  panels: {
    defaults  : [{
        id      : 'commands',
        buttons : [{
            id          : 'smile',
            className   : 'fa fa-smile-o',
            attributes  : { title: 'Smile' }
        }],
    }],
  }
...
```

On refresh the page might present some changes ('fa fa-smile-o' are from FontAwesome set, so be sure to have placed correctly the font directory)

[[img/new-btn.png]]

Yeah, the button is pretty nice and happy, but useless without any command assigned, if you click on it nothing gonna happen.

> Check [Panels API Reference] for more details about Panels and Buttons

Assigning commands is pretty easy, but before you should define one or use one of defaults ([Built-in commands](./Built-in-commands)). So in this case we gonna create a new one.

```js
...
  panels: {
    defaults  : [{
        id      : 'commands',
        buttons : [{
            id          : 'smile',
            className   : 'fa fa-smile-o',
            attributes  : { title: 'Smile' },
            command     : 'helloWorld',
        }],
    }],
  },
  commands: {
    defaults: [{
        id: 'helloWorld',

        run:  function(editor, senderBtn){
          alert('Hello world!');
          // Deactivate button
          senderBtn.set('active', false);
        },

        stop:  function(editor, senderBtn){
        },
    }]
  }
...
```

As you see we added a new command `helloWorld` and used its `id` as an identifier inside `button.command`. In addition to this we've also implemented two required methods, `run` and `stop`, to make button execute commands.

[[img/btn-clicked.png]]

> Check [Commands API Reference]

Check the [demo](http://grapesjs.com/demo.html) for more complete usage of panels, buttons and built-in commands.

## Components

Components are elements inside the canvas, which can be drawn by commands or injected directly via configurations. In simple terms components represent the structure of our HTML document. You can init the editor with passing components as an HTML string

```js
...
  // Disable default local storage in case you've already used GrapesJS
  storageManager: {type: 'none'},

  components: '<div style="width:300px; min-height:100px; margin: 0 auto"></div>' +
              '<div style="width:400px; min-height:100px; margin: 0 auto"></div>' +
              '<div style="width:500px; min-height:100px; margin: 0 auto"></div>',
...
```

We added 3 simple components with some basic style. If you refresh probably you'll see the same empty page but are actually there, you only need to highlight them.
For this purpose already exists a command, so add it to your panel in this way

```js
...
  panels: {
    defaults  : [{
        id      : 'commands',
        buttons : [
          {
            id: 'smile',
            ...
          },
          {
            id        : 'vis',
            className : 'fa fa-eye',
            command   : 'sw-visibility',
            context   : 'some-random-context', // For grouping context of buttons in the same panel
            active    : true,
          },
        ],
    }],
  },
...
```

Worth noting the use of `context` option (try to click 'smile' command without it) and `active` to enable it after the render.
Now you should be able to see blocks inside canvas.

[[img/blocks3.jpg]]

You could add other commands to enable interactions with blocks. Check [Built-in commands](./Built-in-commands) to get more information

> Check [Components API Reference]

## Style Manager

Any HTML structure requires, at some point, a proper style, so to meet this need the Style Manager was added as a built-in feature in GrapesJS. Style manager is composed by sectors, which group inside different types of CSS properties. So you can add, for instance, a `Dimension` sector for `width` and `height`, and another one as `Typography` for `font-size` and `color`. So it's up to you to decide how to organize sectors.

To enable this module we rely on a built-in command `open-sm`, which shows up the Style Manager, which we gonna bind to another button in a separate panel

```js
...
panels: {
    defaults  : [
      {
        id      : 'commands',
        ...
      },{
        // If you use this id the default CSS will place this panel on top right corner for you
        id      : 'views',
        buttons : [{
            id        : 'open-style-manager',
            className : 'fa fa-paint-brush',
            command   : 'open-sm',
            active    : true,
        }]
      }
    ],
},
...
```

After this you'll be able to see something like in the image below

[[img/enabled-sm.jpg]]

As you can see Style Manager is enabled but before using it you have to select an element in the canvas, for this purpose we can add another button with a built-in command `select-comp` in this way

```js
...
  panels: {
    defaults  : [{
        id      : 'commands',
        buttons : [
          {
            id: 'smile',
            ...
          },{
            id         : 'select',
            className : 'fa fa-mouse-pointer',
            command   : 'select-comp',
          }
        ],
    }],
  },
...
```

Selecting one of the component will show up the Style Manager with default sectors, properties and an input where you can manage classes. The default class you see (cXX) was generated by extracting style from the component

[[img/default-sm.jpg]]

As we explore different configurations inside GrapesJS we gonna overwrite all the default sectors to create some custom one

Let's put a few sectors with use of `buildProps` which helps us building common properties

```js
...
  styleManager : {
    sectors: [{
      name: 'Dimension',
      buildProps: ['width', 'min-height']
    },{
      name: 'Extra',
      buildProps: ['background-color', 'box-shadow']
    }]
  }
...
```

Now you should be able to style components

[[img/style-comp.jpg]]

You can check the list of usable properties inside `buildProps` here: [Built-in properties](./Built-in-properties)
otherwise is possible to build them on your own, let's see how we'd have done the previous configuration without the `buildProps` helper

```js
...
styleManager : {
  sectors: [
    {
      name: 'Dimension',
      properties:[
        {
            // Just the name
            name      : 'Width',
            // CSS property
            property  : 'width',
            // Type of the input, options: integer | radio | select | color | file | composite | stack
            type      : 'integer',
            // Units, available only for 'integer' types
            units     : ['px', '%'],
            // Default value
            defaults  : 'auto',
            // Min value, available only for 'integer' types
            min       : 0,
        },{
            // Here I'm going to be more original
            name      : 'Minimum height',
            property  : 'min-height',
            type      : 'select',
            defaults  : '100px',
            // List of options, available only for 'select' and 'radio'  types
            list    : [{
                      value   : '100px',
                      name    : '100',
                    },{
                      value   : '200px',
                      name    : '200',
                    },{
                      value   : '300px',
                      name    : '300',
                    }],
        }
      ]
    },{
      name: 'Extra',
      // Sectors are expanded by default so put this one closed
      open: false,
      properties:[
        {
          name      : 'Background',
          property  : 'background-color',
          type      : 'color',
          defaults:   'none'
        },{
          name    : 'Box shadow',
          property  : 'box-shadow',
          type    : 'stack',
          preview   : true,
          // List of nested properties, available only for 'stack' and 'composite'  types
          properties  : [{
                  name:     'Shadow type',
                  // Nested properties with stack/composite type don't require proper 'property' name
                  // as all of them will be merged to parent property, eg. box-shadow: X Y ...;
                  property:   'shadow-type',
                  type:     'select',
                  defaults:   '',
                  list:   [ { value : '', name : 'Outside', },
                              { value : 'inset', name : 'Inside', }],
                },{
                  name:     'X position',
                  property:   'shadow-x',
                  type:     'integer',
                  units:    ['px','%'],
                  defaults :  0,
                },{
                  name:     'Y position',
                  property:   'shadow-y',
                  type:     'integer',
                  units:    ['px','%'],
                  defaults :  0,
                },{
                  name:     'Blur',
                  property: 'shadow-blur',
                  type:     'integer',
                  units:    ['px'],
                  defaults :  0,
                  min:    0,
                },{
                  name:     'Spread',
                  property:   'shadow-spread',
                  type:     'integer',
                  units:    ['px'],
                  defaults :  0,
                },{
                  name:     'Color',
                  property:   'shadow-color',
                  type:     'color',
                  defaults:   'black',
                },],
        }
      ]
    }
  ]
}
...
```

As you can see using `buildProps` actually will save you a lot of work. You could also mix these techniques to obtain custom properties in less time. For example, let's see how we can setup the same width but with a different value of `min`:

```js
...
  styleManager : {
    sectors: [{
      name: 'Dimension',
      buildProps: ['width', 'min-height'],
      properties:[{
        property: 'width', // Use 'property' as id
        min: 30
      }]
    },
    ...
  }
...
```

> Check [Style Manager API Reference]

## Store/load data

In this last part we're gonna see how to store and load template data inside GrapesJS. You may already noticed that even if you refresh the page after changes on canvas your data are not lost and this because GrapesJS comes with some built-in storage implementation.
The default one is the localStorage which is pretty simple and all the data are stored locally on your computer. Let's see the options available for this storage

```js
...
var editor = grapesjs.init({
    container : '#gjs',
    ...
    // Default configuration
    storageManager: {
      id: 'gjs-',             // Prefix identifier that will be used inside storing and loading
      type: 'local',          // Type of the storage
      autosave: true,         // Store data automatically
      autoload: true,         // Autoload stored data on init
      stepsBeforeSave: 1,     // If autosave enabled, indicates how many changes are necessary before store method is triggered
      storeComponents: false, // Enable/Disable storing of components in JSON format
      storeStyles: false,     // Enable/Disable storing of rules/style in JSON format
      storeHtml: true,        // Enable/Disable storing of components as HTML string
      storeCss: true,         // Enable/Disable storing of rules/style as CSS string
    }
});
...
```

Worth noting the default `id` parameter which adds a prefix for all keys to store. If you check the localStorage inside your DOM panel you'll see something like `{ 'gjs-components': '<div>....' ...}` in this way it prevents the risk of collisions, quite common with localStorage use in large applications.

Storing data locally it's easy and fast but useless in some common cases. In the next example we'll see how to setup a remote storage, which is not far from the previous one

```js
...
var editor = grapesjs.init({
    container : '#gjs',
    ...
    storageManager: {
      type: 'remote',
      stepsBeforeSave: 10,
      urlStore: 'http://store/endpoint',
      urlLoad: 'http://load/endpoint',
      params: {},   // For custom values on requests
    }
});
...
```

As you can see we've left some default option unchanged, increased changes necessary for autosave triggering and passed remote endpoints.

If you prefer you could also disable autosaving and do it by yourself using some custom command in this way:

```js
...
  storageManager: {
    type: 'remote',
    autosave: false,
  },
  ...
  commands: {
    defaults: [{
        id: 'storeData',
        run:  function(editor, senderBtn){
          editor.store();
        },
    }]
  }
...
```

> Check [Storage Manager API Reference]

[API Reference]: API-Reference
[Panels API Reference]: API-Panels
[Commands API Reference]: API-Commands
[Components API Reference]: API-Components
[Style Manager API Reference]: API-Style-Manager
[Editor API Reference]: API-Editor
[Storage Manager API Reference]: API-Storage-Manager
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: grapesjs-dev/docs/package.json

```json
{
  "name": "@grapesjs/docs",
  "private": true,
  "description": "Free and Open Source Web Builder Framework",
  "version": "0.22.7",
  "license": "BSD-3-Clause",
  "homepage": "http://grapesjs.com",
  "files": [
    "dist",
    "locale",
    "src/styles"
  ],
  "sideEffects": [
    "*.vue",
    "*.css",
    "*.scss"
  ],
  "dependencies": {
    "codemirror": "5.63.0",
    "codemirror-formatting": "1.0.0",
    "html-entities": "~1.4.0"
  },
  "devDependencies": {
    "chalk": "4.1.2",
    "@types/markdown-it": "14.1.2",
    "@vuepress/plugin-google-analytics": "1.8.2",
    "@vuepress/types": "1.9.10",
    "documentation": "14.0.3",
    "postcss": "8",
    "sass": "1.80.3",
    "vuepress-plugin-sitemap": "2.3.1",
    "vuepress": "1.9.10",
    "webpack": "4.0.0",
    "whatwg-fetch": "3.6.20"
  },
  "scripts": {
    "docs": "vuepress dev .",
    "docs:api": "node ./api.mjs",
    "build": "npm run docs:api && vuepress build ."
  }
}
```

--------------------------------------------------------------------------------

````
