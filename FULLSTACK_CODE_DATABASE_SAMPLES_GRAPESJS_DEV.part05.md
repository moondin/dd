---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 5
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 5 of 97)

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

---[FILE: README.md]---
Location: grapesjs-dev/docs/README.md

```text
# Introduction

[[toc]]

::: tip

Supercharge your web builder with the [Grapes Studio SDK](https://app.grapesjs.com/docs-sdk/overview/getting-started) — a customizable GrapesJS experience, complete with a polished UI that’s ready to embed.

:::


## What is GrapesJS?

At first glance one might think this is just another page/HTML builder, but it's something more. GrapesJS is a multi-purpose, Web Builder Framework, which means it allows you to easily create a drag & drop enabled builder of "things". By "things" we mean anything with HTML-like structure, which entails much more than web pages. We use HTML-like structure basically everywhere: Newsletters (eg. [MJML](https://mjml.io/)), Native Mobile Applications (eg. [React Native](https://github.com/facebook/react-native)), Native Desktop Applications (eg. [Vuido](https://vuido.mimec.org)), PDFs (eg. [React PDF](https://github.com/diegomura/react-pdf)), etc. So, for everything you can imagine as a set of elements like `<tag some="attribute">... other nested elements ...</tag>` you can create easily a GrapesJS builder around it and then use it independently in your applications.
GrapesJS ships with features and tools that enable you to craft easy to use builders. Which allows your users to create complex HTML-like templates without any knowledge of coding.

## Why GrapesJS?

GrapesJS was designed primarily for use inside Content Management Systems to speed up the creation of dynamic templates and replace common WYSIWYG editors, which are good for content editing, but inappropriate for creating HTML structures. Instead of creating an application we decided to create an extensible framework that could be used by anyone for any purpose.

## Quick Start

To showcase the power of GrapesJS we have created some presets.

- [grapesjs-preset-webpage](https://github.com/GrapesJS/preset-webpage) - [Webpage Builder](https://grapesjs.com/demo.html)
- [grapesjs-preset-newsletter](https://github.com/GrapesJS/preset-newsletter) - [Newsletter Builder](https://grapesjs.com/demo-newsletter-editor.html)
- [grapesjs-mjml](https://github.com/GrapesJS/mjml) - [Newsletter Builder with MJML](https://grapesjs.com/demo-mjml.html)

You can actually use them as a starting point for your editors, so, just follow the instructions on their repositories to get a quick start for your builder.

## Download

Latest version: [![npm](https://img.shields.io/npm/v/grapesjs.svg?colorB=e67891)](https://www.npmjs.com/package/grapesjs)

You can download GrapesJS from one of these sources

- CDNs
  - unpkg
    - `https://unpkg.com/grapesjs`
    - `https://unpkg.com/grapesjs/dist/css/grapes.min.css`
  - cdnjs
    - `https://cdnjs.cloudflare.com/ajax/libs/grapesjs/0.12.17/grapes.min.js`
    - `https://cdnjs.cloudflare.com/ajax/libs/grapesjs/0.12.17/css/grapes.min.css`
- npm
  - `npm i grapesjs`
- git
  - `git clone https://github.com/GrapesJS/grapesjs.git`

## Changelog

To track changes made in the library we rely on [Github Releases](https://github.com/GrapesJS/grapesjs/releases)
```

--------------------------------------------------------------------------------

---[FILE: config.js]---
Location: grapesjs-dev/docs/.vuepress/config.js
Signals: TypeORM

```javascript
const version = require('../package.json').version;
const isDev = process.argv[2] === 'dev';
const devPath = 'http://localhost:8080';
const baseUrl = 'https://grapesjs.com';
const subDivider = ' ‍  ‍  ‍ ';

module.exports = {
  title: 'GrapesJS',
  description: 'GrapesJS documentation',
  base: '/docs/',
  serviceWorker: false, // Enable Service Worker for offline usage
  head: [
    ['link', { rel: 'icon', href: '/logo-icon.png' }],
    [
      'link',
      {
        rel: 'stylesheet',
        href: isDev
          ? `${devPath}/dist/css/grapes.min.css`
          : `${baseUrl}/assets/styles/grapesjs/grapes.min.css?${version}`,
      },
    ],
    [
      'script',
      { src: isDev ? `${devPath}/grapes.min.js` : `${baseUrl}/assets/scripts/grapesjs/grapes.min.js?${version}` },
    ],
  ],
  localesSKIP: {
    '/': {
      lang: 'en-US',
    },
    '/it/': {
      lang: 'it-IT',
      description: 'GrapesJS documentazione',
    },
  },
  themeConfig: {
    editLinks: true,
    docsDir: 'docs',
    docsBranch: 'dev',
    repo: 'artf/grapesjs',
    editLinkText: 'Edit this page on GitHub',

    logo: '/logo.png',
    lastUpdated: 'Last Updated',
    locales: {
      '/': {
        selectText: 'EN',
        label: 'English',
      },
      '/it/': {
        selectText: 'IT',
        label: 'Italiano',
        nav: [{ text: 'Supportaci', link: 'https://opencollective.com/grapesjs' }],
        sidebar: ['/', ['/getting-started', 'Getting Started']],
      },
    },
    nav: [
      { text: 'Docs', link: '/' },
      { text: 'API Reference', link: '/api/' },
      { text: 'Support Us', link: 'https://opencollective.com/grapesjs' },
      { text: 'Twitter', link: 'https://twitter.com/grapesjs' },
    ],
    sidebar: {
      '/api/': [
        '',
        ['/api/editor', 'Editor'],
        ['/api/i18n', 'I18n'],
        ['/api/canvas', 'Canvas'],
        ['/api/frame', `${subDivider}Frame`],
        ['/api/canvas_spot', `${subDivider}CanvasSpot`],
        ['/api/assets', 'Asset Manager'],
        ['/api/asset', `${subDivider}Asset`],
        ['/api/block_manager', 'Block Manager'],
        ['/api/block', `${subDivider}Block`],
        ['/api/commands', 'Commands'],
        ['/api/components', 'DOM Components'],
        ['/api/component', `${subDivider}Component`],
        ['/api/panels', 'Panels'],
        ['/api/pages', 'Pages'],
        ['/api/page', `${subDivider}Page`],
        ['/api/layer_manager', 'Layers'],
        ['/api/style_manager', 'Style Manager'],
        ['/api/sector', `${subDivider}Sector`],
        ['/api/property', `${subDivider}Property`],
        ['/api/property_number', `${subDivider}PropertyNumber`],
        ['/api/property_select', `${subDivider}PropertySelect`],
        ['/api/property_composite', `${subDivider}PropertyComposite`],
        ['/api/property_stack', `${subDivider}PropertyStack`],
        ['/api/layer', `${subDivider}Layer`],
        ['/api/storage_manager', 'Storage Manager'],
        ['/api/device_manager', 'Device Manager'],
        ['/api/device', `${subDivider}Device`],
        ['/api/selector_manager', 'Selector Manager'],
        ['/api/selector', `${subDivider}Selector`],
        ['/api/state', `${subDivider}State`],
        ['/api/trait_manager', 'Trait Manager'],
        ['/api/trait', `${subDivider}Trait`],
        ['/api/css_composer', 'CSS Composer'],
        ['/api/css_rule', `${subDivider}CssRule`],
        ['/api/modal_dialog', 'Modal'],
        ['/api/rich_text_editor', 'Rich Text Editor'],
        ['/api/keymaps', 'Keymaps'],
        ['/api/undo_manager', 'Undo Manager'],
        ['/api/parser', 'Parser'],
        ['/api/datasources', 'Data Sources'],
        ['/api/datasource', `${subDivider}DataSource`],
        ['/api/datarecord', `${subDivider}DataRecord`],
      ],
      '/': [
        '',
        ['/getting-started', 'Getting Started'],
        // ['/faq', 'FAQ'],
        {
          title: 'Modules',
          collapsable: false,
          children: [
            ['/modules/Components', 'Components'],
            ['/modules/Components-js', 'Components & JS'],
            ['/modules/Traits', 'Traits'],
            ['/modules/Blocks', 'Blocks'],
            ['/modules/Assets', 'Assets'],
            ['/modules/Commands', 'Commands'],
            ['/modules/I18n', 'I18n'],
            ['/modules/Selectors', 'Selectors'],
            ['/modules/Layers', 'Layers'],
            ['/modules/Pages', 'Pages'],
            ['/modules/Style-manager', 'Style Manager'],
            ['/modules/Storage', 'Storage Manager'],
            ['/modules/Modal', 'Modal'],
            ['/modules/Plugins', 'Plugins'],
            // ['/modules/DataSources', 'Data Sources'],
          ],
        },
        {
          title: 'Guides',
          collapsable: false,
          children: [
            ['/guides/Symbols', 'Symbols'],
            ['/guides/Replace-Rich-Text-Editor', 'Replace Rich Text Editor'],
            ['/guides/Custom-CSS-parser', 'Use Custom CSS Parser'],
            ['/guides/Telemetry', 'GrapesJS Telemetry'],
          ],
        },
      ],
    },
  },
  plugins: [
    ['@vuepress/google-analytics', { ga: 'UA-74284223-1' }],
    ['sitemap', { hostname: 'https://grapesjs.com' }],
  ],
};
```

--------------------------------------------------------------------------------

---[FILE: enhanceApp.js]---
Location: grapesjs-dev/docs/.vuepress/enhanceApp.js

```javascript
// We can use this hook to install additional Vue plugins, register global components, or add additional router hooks
module.exports = ({
  Vue, // the version of Vue being used in the VuePress app
  options, // the options for the root Vue instance
  router, // the router instance for the app
  siteData, // site metadata
}) => {
  // ...apply enhancements to the app
};
```

--------------------------------------------------------------------------------

---[FILE: Demo.vue]---
Location: grapesjs-dev/docs/.vuepress/components/Demo.vue

```text
<template>
  <div class="demo-container">
    <slot />
  </div>
</template>

<style scoped>
.demo-container {
  min-height: 20px;
  border: 1px solid #eee;
  border-radius: 2px;
  padding: 25px 35px;
}
</style>
```

--------------------------------------------------------------------------------

---[FILE: DemoBasicBlocks.vue]---
Location: grapesjs-dev/docs/.vuepress/components/DemoBasicBlocks.vue

```text
<template>
  <div>
    <div class="gjs" id="gjs2">
      <h1>Hello World Component!</h1>
    </div>
    <div id="blocks2"></div>
  </div>
</template>

<script>
import utils from './demos/utils.js';

export default {
  mounted() {
    window.editor2 = grapesjs.init(utils.gjsConfigBlocks);
  },
};
</script>

<style>
.gjs {
  border: 3px solid #444;
  box-sizing: border-box;
}
.gjs-block {
  width: auto;
  height: auto;
  min-height: auto;
}
</style>
```

--------------------------------------------------------------------------------

---[FILE: DemoCanvasOnly.vue]---
Location: grapesjs-dev/docs/.vuepress/components/DemoCanvasOnly.vue

```text
<template src="./demos/DemoCanvasOnly.html"></template>

<script>
import utils from './demos/utils.js';

export default {
  mounted() {
    const editor = grapesjs.init(utils.gjsConfigStart);
  },
};
</script>

<style src="./demos/DemoCanvasOnly.css"></style>
```

--------------------------------------------------------------------------------

---[FILE: DemoCustomPanels.vue]---
Location: grapesjs-dev/docs/.vuepress/components/DemoCustomPanels.vue

```text
<template>
  <div>
    <div class="panel__top" id="panel__top3">
      <div class="panel__basic-actions" id="panel__basic-actions3"></div>
    </div>
    <div class="gjs" id="gjs3">
      <h1>Hello World Component!</h1>
    </div>
    <div id="blocks3"></div>
  </div>
</template>

<script>
import utils from './demos/utils.js';

export default {
  mounted() {
    const editor3 = grapesjs.init(utils.gjsConfigPanels);
    editor3.Panels.addPanel(
      Object.assign({}, utils.panelTop, {
        el: '#panel__top3',
      }),
    );
    editor3.Panels.addPanel(
      Object.assign({}, utils.panelBasicActions, {
        el: '#panel__basic-actions3',
      }),
    );
    window.editor3 = editor3;
  },
};
</script>

<style>
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
.content pre {
  padding-top: 0;
  padding-bottom: 0;
  margin-top: 0;
  margin-bottom: 0;
}
</style>
```

--------------------------------------------------------------------------------

---[FILE: DemoDevices.vue]---
Location: grapesjs-dev/docs/.vuepress/components/DemoDevices.vue

```text
<template>
  <div>
    <div class="panel__top" id="panel__top7">
      <div class="panel__basic-actions" id="panel__basic-actions7"></div>
      <div class="panel__devices" id="panel__devices7"></div>
      <div class="panel__switcher" id="panel__switcher7"></div>
    </div>

    <div class="editor-row">
      <div class="editor-canvas">
        <div class="gjs" id="gjs7">
          <h1>Hello World Component!</h1>
        </div>
      </div>
      <div class="panel__right" id="panel__right7">
        <div class="layers-container" id="layers-container7"></div>
        <div class="styles-container" id="styles-container7"></div>
        <div class="traits-container" id="traits-container7"></div>
      </div>
    </div>

    <div id="blocks7"></div>
  </div>
</template>

<script>
import utils from './demos/utils.js';

export default {
  mounted() {
    const editor7 = grapesjs.init(utils.gjsConfigDevices);
    editor7.Panels.addPanel(
      Object.assign({}, utils.panelTop, {
        el: '#panel__top7',
      }),
    );
    editor7.Panels.addPanel(
      Object.assign({}, utils.panelBasicActions, {
        el: '#panel__basic-actions7',
      }),
    );
    editor7.Panels.addPanel(
      Object.assign({}, utils.panelSidebar, {
        el: '#panel__right7',
      }),
    );
    editor7.Panels.addPanel(
      Object.assign({}, utils.panelSwitcherTraits, {
        el: '#panel__switcher7',
      }),
    );
    editor7.Panels.addPanel(
      Object.assign({}, utils.panelDevices, {
        el: '#panel__devices7',
      }),
    );
    window.editor7 = editor7;
  },
};
</script>

<style>
.panel__devices {
  position: initial;
}
</style>
```

--------------------------------------------------------------------------------

---[FILE: DemoLayers.vue]---
Location: grapesjs-dev/docs/.vuepress/components/DemoLayers.vue

```text
<template>
  <div>
    <div class="panel__top" id="panel__top4">
      <div class="panel__basic-actions" id="panel__basic-actions4"></div>
    </div>

    <div class="editor-row">
      <div class="editor-canvas">
        <div class="gjs" id="gjs4">
          <h1>Hello World Component!</h1>
        </div>
      </div>
      <div class="panel__right" id="panel__right4">
        <div id="layers-container"></div>
      </div>
    </div>

    <div id="blocks4"></div>
  </div>
</template>

<script>
import utils from './demos/utils.js';

export default {
  mounted() {
    const editor4 = grapesjs.init(utils.gjsConfigLayers);
    editor4.Panels.addPanel(
      Object.assign({}, utils.panelTop, {
        el: '#panel__top4',
      }),
    );
    editor4.Panels.addPanel(
      Object.assign({}, utils.panelBasicActions, {
        el: '#panel__basic-actions4',
      }),
    );
    window.editor4 = editor4;
  },
};
</script>

<style src="./demos/DemoLayers.css"></style>
```

--------------------------------------------------------------------------------

---[FILE: DemoStyle.vue]---
Location: grapesjs-dev/docs/.vuepress/components/DemoStyle.vue

```text
<template>
  <div>
    <div class="panel__top" id="panel__top5">
      <div class="panel__basic-actions" id="panel__basic-actions5"></div>
      <div class="panel__switcher" id="panel__switcher5"></div>
    </div>

    <div class="editor-row">
      <div class="editor-canvas">
        <div class="gjs" id="gjs5">
          <h1>Hello World Component!</h1>
        </div>
      </div>
      <div class="panel__right" id="panel__right5">
        <div class="layers-container" id="layers-container5"></div>
        <div class="styles-container" id="styles-container5"></div>
      </div>
    </div>

    <div id="blocks5"></div>
  </div>
</template>

<script>
import utils from './demos/utils.js';

export default {
  mounted() {
    const editor5 = grapesjs.init(utils.gjsConfigStyle);
    editor5.Panels.addPanel(
      Object.assign({}, utils.panelTop, {
        el: '#panel__top5',
      }),
    );
    editor5.Panels.addPanel(
      Object.assign({}, utils.panelBasicActions, {
        el: '#panel__basic-actions5',
      }),
    );
    editor5.Panels.addPanel(
      Object.assign({}, utils.panelSidebar, {
        el: '#panel__right5',
      }),
    );
    editor5.Panels.addPanel(
      Object.assign({}, utils.panelSwitcher, {
        el: '#panel__switcher5',
      }),
    );
    window.editor5 = editor5;
  },
};
</script>

<style>
.panel__switcher {
  position: initial;
}
</style>
```

--------------------------------------------------------------------------------

---[FILE: DemoTheme.vue]---
Location: grapesjs-dev/docs/.vuepress/components/DemoTheme.vue

```text
<template>
  <div class="gjs__themed">
    <div class="panel__top" id="panel__top8">
      <div class="panel__basic-actions" id="panel__basic-actions8"></div>
      <div class="panel__devices" id="panel__devices8"></div>
      <div class="panel__switcher" id="panel__switcher8"></div>
    </div>

    <div class="editor-row">
      <div class="editor-canvas">
        <div class="gjs" id="gjs8">
          <h1>Hello World Component!</h1>
        </div>
      </div>
      <div class="panel__right" id="panel__right8">
        <div class="layers-container" id="layers-container8"></div>
        <div class="styles-container" id="styles-container8"></div>
        <div class="traits-container" id="traits-container8"></div>
      </div>
    </div>

    <div id="blocks8"></div>
  </div>
</template>

<script>
import utils from './demos/utils.js';

export default {
  mounted() {
    const editor8 = grapesjs.init(utils.gjsConfigTheme);
    editor8.Panels.addPanel(
      Object.assign({}, utils.panelTop, {
        el: '#panel__top8',
      }),
    );
    editor8.Panels.addPanel(
      Object.assign({}, utils.panelBasicActionsIcons, {
        el: '#panel__basic-actions8',
      }),
    );
    editor8.Panels.addPanel(
      Object.assign({}, utils.panelSidebar, {
        el: '#panel__right8',
      }),
    );
    editor8.Panels.addPanel(
      Object.assign({}, utils.panelSwitcherTraitsIcons, {
        el: '#panel__switcher8',
      }),
    );
    editor8.Panels.addPanel(
      Object.assign({}, utils.panelDevicesIcons, {
        el: '#panel__devices8',
      }),
    );
    window.editor8 = editor8;
  },
};
</script>

<style lang="stylus">
.gjs__themed {
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

  .gjs {
    border: none;
  }
}
</style>
```

--------------------------------------------------------------------------------

---[FILE: DemoTraits.vue]---
Location: grapesjs-dev/docs/.vuepress/components/DemoTraits.vue

```text
<template>
  <div>
    <div class="panel__top" id="panel__top6">
      <div class="panel__basic-actions" id="panel__basic-actions6"></div>
      <div class="panel__switcher" id="panel__switcher6"></div>
    </div>

    <div class="editor-row">
      <div class="editor-canvas">
        <div class="gjs" id="gjs6">
          <h1>Hello World Component!</h1>
        </div>
      </div>
      <div class="panel__right" id="panel__right6">
        <div class="layers-container" id="layers-container6"></div>
        <div class="styles-container" id="styles-container6"></div>
        <div class="traits-container" id="traits-container6"></div>
      </div>
    </div>

    <div id="blocks6"></div>
  </div>
</template>

<script>
import utils from './demos/utils.js';

export default {
  mounted() {
    const editor6 = grapesjs.init(utils.gjsConfigTraits);
    editor6.Panels.addPanel(
      Object.assign({}, utils.panelTop, {
        el: '#panel__top6',
      }),
    );
    editor6.Panels.addPanel(
      Object.assign({}, utils.panelBasicActions, {
        el: '#panel__basic-actions6',
      }),
    );
    editor6.Panels.addPanel(
      Object.assign({}, utils.panelSidebar, {
        el: '#panel__right6',
      }),
    );
    editor6.Panels.addPanel(
      Object.assign({}, utils.panelSwitcherTraits, {
        el: '#panel__switcher6',
      }),
    );
    window.editor6 = editor6;
  },
};
</script>

<style>
.panel__switcher {
  position: initial;
}
</style>
```

--------------------------------------------------------------------------------

---[FILE: DemoViewer.vue]---
Location: grapesjs-dev/docs/.vuepress/components/DemoViewer.vue

```text
<template>
  <iframe :width="width" :height="height" :src="src" allowfullscreen="allowfullscreen" frameborder="0" />
</template>

<script>
export default {
  name: 'DemoViewer',
  props: {
    value: {
      type: String,
      default: '',
    },
    user: {
      type: String,
      default: 'artur_arseniev',
    },
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '300',
    },
    darkcode: {
      type: Boolean,
      default: false,
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    src() {
      const { value, user, darkcode, show } = this;
      const tabs = show ? 'result,js,html,css' : 'js,html,css,result';
      const dcStr = darkcode ? '/dark/?menuColor=fff&fontColor=333&accentColor=e67891' : '';
      return `//jsfiddle.net/${user}/${value}/embedded/${tabs}${dcStr}`;
    },
  },
};
</script>
```

--------------------------------------------------------------------------------

---[FILE: DemoCanvasOnly.css]---
Location: grapesjs-dev/docs/.vuepress/components/demos/DemoCanvasOnly.css

```text
/* Let's highlight canvas boundaries */
#gjs {
  border: 3px solid #444;
}

/* Reset some default styling */
.gjs-cv-canvas {
  top: 0;
  width: 100%;
  height: 100%;
}
```

--------------------------------------------------------------------------------

---[FILE: DemoCanvasOnly.html]---
Location: grapesjs-dev/docs/.vuepress/components/demos/DemoCanvasOnly.html

```text
<div id="gjs">
  <h1>Hello World Component!</h1>
</div>
```

--------------------------------------------------------------------------------

---[FILE: DemoCanvasOnly.js]---
Location: grapesjs-dev/docs/.vuepress/components/demos/DemoCanvasOnly.js

```javascript
const editor = grapesjs.init({
  // Indicate where to init the editor. You can also pass an HTMLElement
  container: '#gjs',
  // Get the content for the canvas directly from the element
  // As an alternative we could use: `components: '<h1>Hello World Component!</h1>'`,
  fromElement: true,
  // Size of the editor
  height: '300px',
  width: 'auto',
  // Disable the storage manager for the moment
  storageManager: false,
  // Avoid any default panel
  panels: { defaults: [] },
});
```

--------------------------------------------------------------------------------

---[FILE: DemoLayers.css]---
Location: grapesjs-dev/docs/.vuepress/components/demos/DemoLayers.css

```text
.editor-row {
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  flex-wrap: nowrap;
  height: 300px;
}

.editor-canvas {
  flex-grow: 1;
}

.panel__right {
  flex-basis: 230px;
  position: relative;
  overflow-y: auto;
}
```

--------------------------------------------------------------------------------

---[FILE: utils.js]---
Location: grapesjs-dev/docs/.vuepress/components/demos/utils.js

```javascript
export const loadScript = (url) =>
  new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.onload = resolve;
    script.onerror = reject;
    script.src = url;
    document.head.appendChild(script);
  });

export const loadStyle = (url) =>
  new Promise((resolve) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;
    document.head.appendChild(link);
    resolve();
  });

// Don't know yet why but can't use ES6

var blockManager = {
  appendTo: '#blocks2',
  blocks: [
    {
      id: 'section', // id is mandatory
      label: '<b>Section</b>',
      attributes: { class: 'gjs-block-section' },
      content: `<section>
        <h1>This is a simple title</h1>
        <div>This is just a Lorem text: Lorem ipsum dolor sit amet, consectetur adipiscing elit</div>
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
      // Select the component once dropped in canavas
      select: true,
      // You can pass components as a JSON instead of a simple HTML string,
      // in this case we also use a defined component type `image`
      content: { type: 'image' },
      // This triggers `active` on dropped components
      activate: true,
    },
  ],
};

var blockManagerIcons = Object.assign({}, blockManager, {
  blocks: [
    Object.assign({}, blockManager.blocks[0], {
      label:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 3H5c-1.11 0-2 .89-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5a2 2 0 0 0-2-2m0 2v14H5V5h14z"></path></svg>',
    }),
    Object.assign({}, blockManager.blocks[1], {
      label:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.5 4l1.16 4.35-.96.26c-.45-.87-.91-1.74-1.44-2.18C16.73 6 16.11 6 15.5 6H13v10.5c0 .5 0 1 .33 1.25.34.25 1 .25 1.67.25v1H9v-1c.67 0 1.33 0 1.67-.25.33-.25.33-.75.33-1.25V6H8.5c-.61 0-1.23 0-1.76.43-.53.44-.99 1.31-1.44 2.18l-.96-.26L5.5 4h13z"></path></svg>',
    }),
    Object.assign({}, blockManager.blocks[2], {
      label:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 5c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H4a2 2 0 0 1-2-2V7c0-1.11.89-2 2-2h16M5 16h14l-4.5-6-3.5 4.5-2.5-3L5 16z"></path></svg>',
    }),
  ],
});

var styleManager = {
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
};

var layerManager = { scrollLayers: 0 };
var selectorManager = {};
var traitManager = {};
var deviceManager = {
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
};

var panelTop = { id: 'panel-top' };
var panelBasicActions = {
  id: 'panel-basic',
  buttons: [
    {
      id: 'visibility',
      // active by default
      active: true,
      className: 'btn-toggle-borders',
      label: '<u>B</u>',
      // Built-in command
      command: 'sw-visibility',
    },
    {
      id: 'export',
      className: 'btn-open-export',
      label: 'Exp',
      command: 'export-template',
      // For grouping context of buttons in the same panel
      context: 'export-template',
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
};
var panelBasicActionsIcons = Object.assign({}, panelBasicActions, {
  buttons: [
    Object.assign({}, panelBasicActions.buttons[0], {
      label:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15 5h2V3h-2m0 18h2v-2h-2M11 5h2V3h-2m8 2h2V3h-2m0 6h2V7h-2m0 14h2v-2h-2m0-6h2v-2h-2m0 6h2v-2h-2M3 5h2V3H3m0 6h2V7H3m0 6h2v-2H3m0 6h2v-2H3m0 6h2v-2H3m8 2h2v-2h-2m-4 2h2v-2H7M7 5h2V3H7v2z"></path></svg>',
    }),
    Object.assign({}, panelBasicActions.buttons[1], {
      label:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 20h14v-2H5m14-9h-4V3H9v6H5l7 7 7-7z"></path></svg>',
    }),
    Object.assign({}, panelBasicActions.buttons[2], {
      label:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8 3c-1.1 0-2 .9-2 2v4c0 1.1-.9 2-2 2H3v2h1c1.1 0 2 .9 2 2v4c0 1.1.9 2 2 2h2v-2H8v-5c0-1.1-.9-2-2-2 1.1 0 2-.9 2-2V5h2V3m6 0c1.1 0 2 .9 2 2v4c0 1.1.9 2 2 2h1v2h-1c-1.1 0-2 .9-2 2v4c0 1.1-.9 2-2 2h-2v-2h2v-5c0-1.1.9-2 2-2-1.1 0-2-.9-2-2V5h-2V3h2z"></path></svg>',
    }),
  ],
});
var panelSidebar = {
  el: '#panel__right4',
  id: 'layers',
  // Make the panel resizable
  resizable: {
    maxDim: 350,
    minDim: 200,
    tc: 0, // Top handler
    cl: 1, // Left handler
    cr: 0, // Right handler
    bc: 0, // Bottom handler
    // Being a flex child we need to change `flex-basis` property
    // instead of the `width` (default)
    keyWidth: 'flex-basis',
  },
};

var buttonShowLayers = {
  id: 'show-layers',
  active: true,
  togglable: false,
  label: 'Layers',
  command: {
    getRowEl(editor) {
      return editor.getContainer().parentNode.parentNode;
    },
    getLayersEl(row) {
      return row.querySelector('.layers-container');
    },
    getStyleEl(row) {
      return row.querySelector('.styles-container');
    },

    run(editor, sender) {
      const row = this.getRowEl(editor);
      const lmEl = this.getLayersEl(row);
      lmEl.style.display = '';
    },
    stop(editor, sender) {
      const row = this.getRowEl(editor);
      const lmEl = this.getLayersEl(row);
      lmEl.style.display = 'none';
    },
  },
};
var buttonShowStyle = {
  id: 'show-style',
  label: 'Styles',
  togglable: false,
  active: true,
  command: {
    getRowEl(editor) {
      return editor.getContainer().parentNode.parentNode;
    },
    getLayersEl(row) {
      return row.querySelector('.layers-container');
    },
    getStyleEl(row) {
      return row.querySelector('.styles-container');
    },

    run(editor, sender) {
      const row = this.getRowEl(editor);
      const smEl = this.getStyleEl(row);
      smEl.style.display = '';
    },
    stop(editor, sender) {
      const row = this.getRowEl(editor);
      const smEl = this.getStyleEl(row);
      smEl.style.display = 'none';
    },
  },
};
var buttonShowTraits = {
  id: 'show-traits',
  label: 'Traits',
  togglable: false,
  active: true,
  command: {
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
  },
};

var panelSwitcher = {
  id: 'panel-switcher',
  buttons: [buttonShowLayers, buttonShowStyle],
};

var panelSwitcherTraits = {
  id: 'panel-switcher',
  buttons: [buttonShowLayers, buttonShowStyle, buttonShowTraits],
};

var panelSwitcherTraitsIcons = {
  id: 'panel-switcher',
  buttons: [
    Object.assign({}, buttonShowLayers, {
      label:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27M12 18.54l-7.38-5.73L3 14.07l9 7 9-7-1.63-1.27L12 18.54z"></path></svg>',
    }),
    Object.assign({}, buttonShowStyle, {
      label:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17.5 12c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5m-3-4c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8m-5 0C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8m-3 4c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12M12 3a9 9 0 0 0 0 18c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1-.23-.27-.38-.62-.38-1 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8z"></path></svg>',
    }),
    Object.assign({}, buttonShowTraits, {
      label:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66z"></path></svg>',
    }),
  ],
};

var panelDevices = {
  id: 'panel-devices',
  buttons: [
    {
      id: 'device-desktop',
      label: 'D',
      command: { run: (editor) => editor.setDevice('Desktop') },
      active: true,
      togglable: false,
    },
    {
      id: 'device-mobile',
      label: 'M',
      command: { run: (editor) => editor.setDevice('Mobile') },
      togglable: false,
    },
  ],
};

var panelDevicesIcons = Object.assign({}, panelDevices, {
  buttons: [
    Object.assign({}, panelDevices.buttons[0], {
      label:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21 14H3V4h18m0-2H3c-1.11 0-2 .89-2 2v12c0 1.1.9 2 2 2h7l-2 3v1h8v-1l-2-3h7c1.1 0 2-.9 2-2V4a2 2 0 0 0-2-2z"></path></svg>',
    }),
    Object.assign({}, panelDevices.buttons[1], {
      label:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16 18H7V4h9m-4.5 18c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5m4-21h-8A2.5 2.5 0 0 0 5 3.5v17A2.5 2.5 0 0 0 7.5 23h8a2.5 2.5 0 0 0 2.5-2.5v-17A2.5 2.5 0 0 0 15.5 1z"></path></svg>',
    }),
  ],
});

var gjsConfigStart = {
  // Indicate where to init the editor. It's also possible to pass an HTMLElement
  container: '#gjs',
  // Get the content for the canvas direectly from the element
  // As an alternative we could use: `components: '<h1>Hello World Component!</h1>'`,
  fromElement: true,
  // Size of the editor
  height: '300px',
  width: 'auto',
  // Disable the storage manager for the moment
  storageManager: { type: null },
  // Avoid any default panel
  panels: { defaults: [] },
};

var gjsConfigBlocks = Object.assign({}, gjsConfigStart, {
  container: '#gjs2',
  blockManager,
});

var gjsConfigPanels = Object.assign({}, gjsConfigBlocks, {
  container: '#gjs3',
  blockManager: Object.assign({}, blockManager, { appendTo: '#blocks3' }),
});

var gjsConfigLayers = Object.assign({}, gjsConfigBlocks, {
  container: '#gjs4',
  blockManager: Object.assign({}, blockManager, { appendTo: '#blocks4' }),
  layerManager: { appendTo: '#layers-container', scrollLayers: 0 },
  panels: { defaults: [panelSidebar] },
});

var gjsConfigStyle = Object.assign({}, gjsConfigBlocks, {
  container: '#gjs5',
  blockManager: Object.assign({}, blockManager, { appendTo: '#blocks5' }),
  layerManager: { appendTo: '#layers-container5', scrollLayers: 0 },
  styleManager: Object.assign({}, styleManager, { appendTo: '#styles-container5' }),
  selectorManager: Object.assign({}, selectorManager, { appendTo: '#styles-container5' }),
});

var gjsConfigTraits = Object.assign({}, gjsConfigBlocks, {
  container: '#gjs6',
  blockManager: Object.assign({}, blockManager, { appendTo: '#blocks6' }),
  layerManager: Object.assign({}, layerManager, { appendTo: '#layers-container6' }),
  styleManager: Object.assign({}, styleManager, { appendTo: '#styles-container6' }),
  traitManager: Object.assign({}, traitManager, { appendTo: '#traits-container6' }),
  selectorManager: Object.assign({}, selectorManager, { appendTo: '#styles-container6' }),
});

var gjsConfigDevices = Object.assign({}, gjsConfigBlocks, {
  container: '#gjs7',
  blockManager: Object.assign({}, blockManager, { appendTo: '#blocks7' }),
  layerManager: Object.assign({}, layerManager, { appendTo: '#layers-container7' }),
  styleManager: Object.assign({}, styleManager, { appendTo: '#styles-container7' }),
  traitManager: Object.assign({}, traitManager, { appendTo: '#traits-container7' }),
  selectorManager: Object.assign({}, selectorManager, { appendTo: '#styles-container7' }),
  deviceManager,
});

var gjsConfigTheme = Object.assign({}, gjsConfigBlocks, {
  container: '#gjs8',
  blockManager: Object.assign({}, blockManagerIcons, { appendTo: '#blocks8' }),
  layerManager: Object.assign({}, layerManager, { appendTo: '#layers-container8' }),
  styleManager: Object.assign({}, styleManager, { appendTo: '#styles-container8' }),
  traitManager: Object.assign({}, traitManager, { appendTo: '#traits-container8' }),
  selectorManager: Object.assign({}, selectorManager, { appendTo: '#styles-container8' }),
  deviceManager,
});

export default {
  gjsConfigStart,
  gjsConfigBlocks,
  gjsConfigPanels,
  gjsConfigLayers,
  gjsConfigStyle,
  gjsConfigTraits,
  gjsConfigDevices,
  gjsConfigTheme,
  panelTop,
  panelBasicActions,
  panelBasicActionsIcons,
  panelSidebar,
  panelSwitcher,
  panelSwitcherTraits,
  panelSwitcherTraitsIcons,
  panelDevices,
  panelDevicesIcons,
};
```

--------------------------------------------------------------------------------

````
