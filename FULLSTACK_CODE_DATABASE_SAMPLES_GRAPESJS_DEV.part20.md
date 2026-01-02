---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 20
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 20 of 97)

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

---[FILE: Traits.md]---
Location: grapesjs-dev/docs/modules/Traits.md

```text
---
title: Trait Manager
---

# Trait Manager

In GrapesJS, Traits define different parameters and behaviors of a component. The user generally will see traits as the _Settings_ of a component. A common use of traits is to customize element attributes (eg. `placeholder` for `<input>`) or you can also bind them to the properties of your components and react to their changes.

::: warning
This guide is referring to GrapesJS v0.21.9 or higher.<br><br>
To get a better understanding of the content in this guide we recommend reading [Components](Components.html) first
:::

::: tip
Want traits that look great and work out of the box? [See how the Grapes Studio SDK handles it.](https://app.grapesjs.com/docs-sdk/configuration/components/properties?utm_source=grapesjs-docs&utm_medium=tip#traits)
:::

[[toc]]

## Add Traits to Components

Generally, you define traits on the definition of your new custom components (or by extending another one). Let's see in this example how to make inputs more customizable by the editor.

All components, by default, contain two traits: `id` and `title` (at the moment of writing). So, if you select an input and open the Settings panel you will see this:

<img :src="$withBase('/default-traits.png')" class="img-ctr-rad" style="max-width: 200px;" alt="Default traits">

We can start by creating a new custom `input` component in this way:

```js
editor.Components.addType('input', {
  isComponent: (el) => el.tagName === 'INPUT',
  model: {
    defaults: {
      traits: [
        // Strings are automatically converted to text types
        'name', // Same as: { type: 'text', name: 'name' }
        'placeholder',
        {
          type: 'select', // Type of the trait
          name: 'type', // (required) The name of the attribute/property to use on component
          label: 'Type', // The label you will see in Settings
          options: [
            { id: 'text', label: 'Text' },
            { id: 'email', label: 'Email' },
            { id: 'password', label: 'Password' },
            { id: 'number', label: 'Number' },
          ],
        },
        {
          type: 'checkbox',
          name: 'required',
        },
      ],
      // As by default, traits are bound to attributes, so to define
      // their initial value we can use attributes
      attributes: { type: 'text', required: true },
    },
  },
});
```

Now the result will be

<img :src="$withBase('/input-custom-traits.png')" class="img-ctr-rad" style="max-width: 230px;" alt="Input with custom traits">

If you want you can also define traits dynamically via functions, which will be created on component initialization. It might be useful if you need to create traits based on some other component characteristic.

```js
editor.Components.addType('input', {
  isComponent: (el) => el.tagName === 'INPUT',
  model: {
    defaults: {
      traits(component) {
        const result = [];

        // Example of some logic
        if (component.get('draggable')) {
          result.push('name');
        } else {
          result.push({
            type: 'select',
            // ....
          });
        }

        return result;
      },
    },
  },
});
```

If you need to react to some change of the trait you can subscribe to their attribute listeners

```js
editor.Components.addType('input', {
  model: {
    defaults: {
      // ...
    },

    init() {
      this.on('change:attributes:type', this.handleTypeChange);
    },

    handleTypeChange() {
      console.log('Input type changed to: ', this.getAttributes().type);
    },
  },
});
```

As already mentioned, by default, traits modify attributes of the model, but you can also bind them to the properties by using `changeProp` options.

```js
editor.Components.addType('input', {
  model: {
    defaults: {
      // ...
      traits: [
        {
          name: 'placeholder',
          changeProp: 1,
        },
        // ...
      ],
      // As we switched from attributes to properties the
      // initial value should be set from the property
      placeholder: 'Initial placeholder',
    },

    init() {
      // Also the listener changes from `change:attributes:*` to `change:*`
      this.on('change:placeholder', this.handlePlhChange);
    },
    // ...
  },
});
```

### Categories

It's possible to group your traits into categories, as shown below.

<img :src="$withBase('/trait-categories.png')" class="img-ctr-rad" style="max-width: 250px;" alt="Traits with categories">

```js
const category1 = { id: 'first', label: 'First category' };
const category2 = { id: 'second', label: 'Second category', open: false };

editor.Components.addType('input', {
  model: {
    defaults: {
      // ...
      traits: [
        { name: 'trait-1', category: category1 },
        { name: 'trait-2', category: category1 },
        { name: 'trait-3', category: category2 },
        { name: 'trait-4', category: category2 },
        // Traits without categories will be rendered at the bottom
        { name: 'trait-5' },
        { name: 'trait-6' },
      ],
    },
  },
});
```

## Built-in trait types

GrapesJS comes along with few built-in types that you can use to define your traits:

### Text

Simple text input

```js
{
  type: 'text', // If you don't specify the type, the `text` is the default one
  name: 'my-trait', // Required and available for all traits
  label: 'My trait', // The label you will see near the input
  // label: false, // If you set label to `false`, the label column will be removed
  placeholder: 'Insert text', // Placeholder to show inside the input
}
```

### Number

Input for numbers

```js
{
  type: 'number',
  // ...
  placeholder: '0-100',
  min: 0, // Minimum number value
  max: 100, // Maximum number value
  step: 5, // Number of steps
}
```

### Checkbox

Simple checkbox input

```js
{
  type: 'checkbox',
  // ...
  valueTrue: 'YES', // Value to assign when is checked, default: `true`
  valueFalse: 'NO', // Value to assign when is unchecked, default: `false`
}
```

### Select

Select input with options

```js
{
  type: 'select',
  // ...
  options: [ // Array of options
    { id: 'opt1', label: 'Option 1'},
    { id: 'opt2', label: 'Option 2'},
  ]
}
```

### Color

Color picker

```js
{
  type: 'color',
  // ...
}
```

### Button

Button with a command to assign

```js
{
  type: 'button',
  // ...
  text: 'Click me',
  full: true, // Full width button
  command: editor => alert('Hello'),
  // or you can just specify the Command ID
  command: 'some-command',

}
```

## Updating traits at run-time

If you need to change some trait on your component you can update it wherever you want by using [Component API](/api/component.html)

The trait is a simple property of the component so to get the complete list of current traits you can use this:

```js
const component = editor.getSelected(); // Component selected in canvas
const traits = component.get('traits');
traits.forEach((trait) => console.log(trait.props()));
```

In case you need a single one:

```js
const component = editor.getSelected();
console.log(component.getTrait('type').props()); // Finds by the `name` of the trait
```

If you want, for example, updating some property of the trait, do this:

```js
// Let's update `options` of our `type` trait, defined in Input component
const component = editor.getSelected();
component.getTrait('type').set('options', [
  { id: 'opt1', label: 'New option 1'},
  { id: 'opt2', label: 'New option 2'},
]);
// or with multiple values
component.getTrait('type').set({
  label: 'My type',
  options: [...],
});
```

You can also easily add new traits or remove some other by using [`addTrait`](/api/component.html#addtrait)/[`removeTrait`](/api/component.html#removetrait)

```js
// Add new trait
const component = editor.getSelected();
component.addTrait({
  name: 'type',
  ...
}, { at: 0 });
// The `at` option indicates the index where to place the new trait,
// without it, the trait will be appended at the end of the list

// Remove trait
component.removeTrait('type');
```

## I18n

To leverage the [I18n module](I18n.html), you can refer to this schema

```js
{
  en: {
    traitManager: {
      empty: 'Select an element before using Trait Manager',
      label: 'Component settings',
      categories: {
        categoryId: 'Category label',
      },
      traits: {
        // The trait `name` property is used as a key
        labels: {
          href: 'Href label',
        },
        // For built-in traits, like `text` type, these are used on input DOM attributes
        attributes: {
          href: { placeholder: 'eg. https://google.com' },
        },
        // For `select` types, these are used to translate option labels
        options: {
          target: {
            // Here the key is the `id` of the option
            _blank: 'New window',
          },
        },
      },
    },
  }
}
```

## Customization

The default types should cover most of the common properties but in case you need a more advanced UI you can [define your own types](#define-new-trait-type) or even create a completely [custom Trait Manager UI](#custom-trait-manager) from scratch.

### Define new Trait type

For most of the cases, default types should be enough, but sometimes you might need something more.
In that case, you can define a new type of trait and bind any kind of element to it.

#### Create element

Let's update the default `link` Component with a new kind of trait. This is the default situation of traits for a simple link.

<img :src="$withBase('/default-link-comp.jpg')" class="img-ctr-rad" style="max-width: 210px;" alt="Default link component">

Let's just replace all of its traits with a new one, `href-next`, which will allow the user to select the type of href (eg. 'url', 'email', etc.)

```js
// Update component
editor.Components.addType('link', {
  model: {
    defaults: {
      traits: [
        {
          type: 'href-next',
          name: 'href',
          label: 'New href',
        },
      ],
    },
  },
});
```

Now you'll see a simple text input because we have not yet defined our new trait type, so let's do it:

```js
editor.Traits.addType('href-next', {
  // Expects as return a simple HTML string or an HTML element
  createInput({ trait }) {
    // Here we can decide to use properties from the trait
    const traitOpts = trait.get('options') || [];
    const options = traitOpts.length
      ? traitOpts
      : [
          { id: 'url', label: 'URL' },
          { id: 'email', label: 'Email' },
        ];

    // Create a new element container and add some content
    const el = document.createElement('div');
    el.innerHTML = `
      <select class="href-next__type">
        ${options.map((opt) => `<option value="${opt.id}">${opt.label}</option>`).join('')}
      </select>
      <div class="href-next__url-inputs">
        <input class="href-next__url" placeholder="Insert URL"/>
      </div>
      <div class="href-next__email-inputs">
        <input class="href-next__email" placeholder="Insert email"/>
        <input class="href-next__email-subject" placeholder="Insert subject"/>
      </div>
    `;

    // Let's make our content interactive
    const inputsUrl = el.querySelector('.href-next__url-inputs');
    const inputsEmail = el.querySelector('.href-next__email-inputs');
    const inputType = el.querySelector('.href-next__type');
    inputType.addEventListener('change', (ev) => {
      switch (ev.target.value) {
        case 'url':
          inputsUrl.style.display = '';
          inputsEmail.style.display = 'none';
          break;
        case 'email':
          inputsUrl.style.display = 'none';
          inputsEmail.style.display = '';
          break;
      }
    });

    return el;
  },
});
```

From the example above we simply created our custom inputs (by giving also the possibility to use `option` trait property) and defined some input switch behavior on the type change. Now the result would be something like this

<img :src="$withBase('/docs-init-link-trait.jpg')" class="img-ctr-rad" style="max-width: 215px;" alt="Link with traits">

#### Update layout

Before going forward and making our trait work let's talk about the layout structure of a trait. You might have noticed that the trait is composed by the label and input columns, for this reason, GrapesJS allows you to customize both of them.

For the label customization you might use `createLabel`

```js
editor.Traits.addType('href-next', {
  // Expects as return a simple HTML string or an HTML element
  createLabel({ label }) {
    return `<div>
      <div>Before</div>
      ${label}
      <div>After</div>
    </div>`;
  },
  // ...
});
```

You've probably seen already that in trait definition you can setup `label: false` to completely remove the label column, but in case you need to force this behavior in all instances of this trait type you can use `noLabel` property

```js
editor.Traits.addType('href-next', {
  noLabel: true,
  // ...
});
```

You might also notice that by default GrapesJS applies kind of a wrapper around your inputs, generally is ok for simple inputs but probably is not what you need where you're creating a complex custom trait. To remove the default wrapper you can use the `templateInput` option

```js
editor.Traits.addType('href-next', {
  // Completely remove the wrapper
  templateInput: '',
  // Use a new one, by specifying with `data-input` attribute where to place the input container
  templateInput: `<div class="custom-input-wrapper">
    Before input
    <div data-input></div>
    After input
  </div>`,
  // It might also be a function, expects an HTML string as the result
  templateInput({ trait }) {
    return '<div ...';
  },
});
```

<img :src="$withBase('/docs-link-trait-raw.jpg')" class="img-ctr-rad" style="max-width: 215px;" alt="Basic custom link trait">

In this case, the result will be quite raw and unstyled but the point of custom trait types is to allow you to reuse your own styled inputs, probably already designed and defined (or implemented in some UI framework).
For now, let's keep the default input wrapper and continue with the integration of our custom trait.

#### Bind to component

At the current state, our element created in `createInput` is not binded to the component so nothing happens when you update inputs, so let's do it now

```js
editor.Traits.addType('href-next', {
  // ...

  // Update the component based on element changes
  // `elInput` is the result HTMLElement you get from `createInput`
  onEvent({ elInput, component, event }) {
    const inputType = elInput.querySelector('.href-next__type');
    let href = '';

    switch (inputType.value) {
      case 'url':
        const valUrl = elInput.querySelector('.href-next__url').value;
        href = valUrl;
        break;
      case 'email':
        const valEmail = elInput.querySelector('.href-next__email').value;
        const valSubj = elInput.querySelector('.href-next__email-subject').value;
        href = `mailto:${valEmail}${valSubj ? `?subject=${valSubj}` : ''}`;
        break;
    }

    component.addAttributes({ href });
  },
});
```

Now, most of the stuff should already work (you can update the trait and check the HTML in code preview). You might wonder how the editor captures the input change and how is possible to control it.
By default, the base trait wrapper applies a listener on `change` event and calls `onEvent` on any captured event (to be captured the event should be able to [bubble](https://stackoverflow.com/questions/4616694/what-is-event-bubbling-and-capturing)). If you want, for example, to update the component on `input` event you can change the `eventCapture` property

```js
editor.Traits.addType('href-next', {
  eventCapture: ['input'], // you can use multiple events in the array
  // ...
});
```

The last thing, you might have noticed the wrong initial render of our trait, where inputs are not populated in case of already defined `href` attribute. This step should be done in `onUpdate` method

```js
editor.Traits.addType('href-next', {
  // ...

  // Update elements on the component change
  onUpdate({ elInput, component }) {
    const href = component.getAttributes().href || '';
    const inputType = elInput.querySelector('.href-next__type');
    let type = 'url';

    if (href.indexOf('mailto:') === 0) {
      const inputEmail = elInput.querySelector('.href-next__email');
      const inputSubject = elInput.querySelector('.href-next__email-subject');
      const mailTo = href.replace('mailto:', '').split('?');
      const email = mailTo[0];
      const params = (mailTo[1] || '').split('&').reduce((acc, item) => {
        const items = item.split('=');
        acc[items[0]] = items[1];
        return acc;
      }, {});
      type = 'email';

      inputEmail.value = email || '';
      inputSubject.value = params.subject || '';
    } else {
      elInput.querySelector('.href-next__url').value = href;
    }

    inputType.value = type;
    inputType.dispatchEvent(new CustomEvent('change'));
  },
});
```

Now the trait will update even on component change like:

```js
editor.getSelected().addAttributes({ href: 'mailto:new-email@test.com?subject=NewSubject' });
```

To recap what we have done so far, to create a custom trait type all you will need are 3 methods:

- `createInput` - Where we define our custom HTML element
- `onEvent` - How to update the component on inputs changes
- `onUpdate` - How to update inputs on component changes

#### Result

The final result of what we have done can be seen here
<demo-viewer value="yf6amdqb/10"/>

#### Integrate external UI components

By looking at the example above might seems like a lot of code, but at the end, it's just about a little bit of logic and the native DOM API which is not super pretty. If you use a modern UI client framework (eg. Vue, React, etc.) you could see that the integration is even easier. There is how it would be integrating a custom [Vue Slider Component](https://github.com/NightCatSama/vue-slider-component) as a trait

```js
editor.Traits.addType('slider', {
  createInput({ trait }) {
    const vueInst = new Vue({ render: (h) => h(VueSlider) }).$mount();
    const sliderInst = vueInst.$children[0];
    sliderInst.$on('change', (ev) => this.onChange(ev)); // Use onChange to trigger onEvent
    this.sliderInst = sliderInst;
    return vueInst.$el;
  },

  onEvent({ component }) {
    const value = this.sliderInst.getValue() || 0;
    component.addAttributes({ value });
  },

  onUpdate({ component }) {
    const value = component.getAttributes().value || 0;
    this.sliderInst.setValue(value);
  },
});
```

<demo-viewer value="x9sw2udv"/>

The integration with external components is possible by following these simple core points:

1. **Component rendering**: `new Vue({ render: ...`<br/>
   Depends on the framework, for example, in React it should be `ReactDOM.render(element, ...`
1. **Change propagation**: `sliderInst.$on('change', ev => this.onChange(ev))`<br/>
   The framework should have a mechanism to subscribe to changes and the component [should expose that change](https://nightcatsama.github.io/vue-slider-component/#/api/events)<br/>
   We've also used `onChange` method which comes handy when you need to trigger manually the `onEvent` event (you should never call directly `onEvent` method, but only via `onChange` when you need)
1. **Property getters/setters**: [`sliderInst.getValue()`](https://nightcatsama.github.io/vue-slider-component/#/api/methods?hash=getvalue)/ [`sliderInst.setValue(value)`](https://nightcatsama.github.io/vue-slider-component/#/api/methods?hash=setvaluevalue)<br/>
   The component should allow to read and write data from the instance

### Custom Trait Manager

The default Trait Manager UI should handle most of the common tasks but in case you need more advanced logic/elements, you can create your custom one from scratch.

All you have to do is to indicate to the editor your intent to use a custom UI and then subscribe to the `trait:custom` event that will trigger on any necessary update of the UI.

```js
const editor = grapesjs.init({
  // ...
  traitManager: {
    custom: true,
    // ...
  },
});

editor.on('trait:custom', (props) => {
  // props.container (HTMLElement) - The default element where you can append your custom UI
  // Here you would put the logic to render/update your UI.
});
```

In the example below we'll replicate most of the default functionality by using the [Traits API].

<demo-viewer value="hszpw2rb" height="500" darkcode/>

<!--
<style>
  .trait-input-color {
    width: 16px !important;
    height: 15px !important;
    opacity: 0 !important;
  }
  /* Vuetify overrides */
  .v-application {
    background: transparent !important;
  }
  .v-application--wrap {
    min-height: auto;
  }
  .v-input__slot {
    font-size: 12px;
    min-height: 10px !important;
    color-scheme: dark;
  }
  .v-select__selections {
    flex-wrap: nowrap;
  }
  .v-text-field .v-input__slot {
    padding: 0 10px !important;
  }
  .v-input--selection-controls {
    margin-top: 0;
  }
  .v-text-field__details, .v-messages {
    display: none;
  }
  .no-cat-header {
    opacity: 0;
    padding: 10px;
    max-height: 10px;
    pointer-events: none;
    min-height: auto !important;
  }
  .trait-color-prv {
    border: 1px solid rgba(255,255,255,0.5);
    border-radius: 3px;
  }
</style>
<div>
  <div class="vue-app">
    <v-app>
      <v-main>
        <v-expansion-panels accordion multiple v-model="panels">
          <v-expansion-panel v-for="trc in traitCategories">
            <v-expansion-panel-header v-if="trc.category">
              {{ trc.category.getLabel() }}
            </v-expansion-panel-header>
            <v-expansion-panel-header class="no-cat-header" v-else></v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <trait-field v-for="trait in trc.items" :key="trait.id" :trait="trait"/>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-main>
    </v-app>
  </div>

  <div id="trait-field" style="display: none;">
    <v-col :class="['py-0 px-1 mb-1', trait.get('full') && 'mb-3']" :cols="12">
      <v-row class="flex-nowrap" v-if="isTypeNeedLabel">
        <v-col cols="auto pr-0">{{ trait.getLabel() }}</v-col>
      </v-row>
      <div v-if="type === 'number'">
        <v-text-field :placeholder="placeholder" :value="inputValue" @change="handleChange" outlined dense/>
      </div>
      <div v-else-if="type === 'checkbox'">
        <v-checkbox :label="trait.getLabel()" :input-value="inputValue" @change="handleChange"></v-checkbox>
      </div>
      <div v-else-if="type === 'select'">
        <v-select :items="toOptions" :value="inputValue" @change="handleChange" outlined dense/>
      </div>
      <div v-else-if="type === 'color'">
        <v-text-field :placeholder="placeholder" :value="inputValue" @change="handleChange" outlined dense>
          <template v-slot:append>
            <div :style="{ backgroundColor: inputValue || placeholder }" class="trait-color-prv">
              <input class="trait-input-color"
                      type="color"
                      :value="inputValue || placeholder"
                      @change="(ev) => handleChange(ev.target.value)"
                      @input="(ev) => handleInput(ev.target.value)"
                      />
            </div>
          </template>
        </v-text-field>
      </div>
      <div v-else-if="type === 'button'">
        <v-btn block @click="trait.runCommand()">
          <v-row>
            <v-col>{{ trait.get('labelButton') }}</v-col>
          </v-row>
        </v-btn>
      </div>
      <div v-else>
        <v-text-field :placeholder="placeholder" :type="type" :value="inputValue" @change="handleChange" outlined dense/>
      </div>
    </v-col>
  </div>
</div>
<script>
  const myPlugin = (editor) => {
    const category1 = { id: 'first', label: 'First category' };
    const category2 = { id: 'second', label: 'Second category', open: false };

    editor.Components.addType('demo-cmp', {
      model: {
        defaults: {
          traits: [
            {
              type: 'date',
              name: 'date-trait',
              label: 'Date trait',
              placeholder: 'Insert date',
            },
            {
              type: 'text',
              name: 'text-trait',
              label: false,
              placeholder: 'Insert text',
              category: category1,
            },
            {
              type: 'select',
              name: 'select-trait',
              label: 'Select 1',
              category: category1,
              default: 'opt1',
              options: [
                { id: 'opt1', name: 'Option 1'},
                { id: 'opt2', name: 'Option 2'},
                { id: 'opt3', name: 'Option 3'},
              ]
            },
            {
              type: 'select',
              name: 'select-trait2',
              label: 'Select 2',
              category: category1,
              default: 'opt2',
              options: [
                { id: 'opt1', name: 'Option 1'},
                { id: 'opt2', name: 'Option 2'},
                { id: 'opt3', name: 'Option 3'},
              ]
            },
            {
              type: 'number',
              name: 'number-trait',
              placeholder: '0-100',
              min: 0,
              max: 100,
              step: 5,
            },
            {
              type: 'color',
              label: 'Color trait',
              name: 'color-trait',
            },
            {
              type: 'checkbox',
              label: 'Checkbox trait',
              name: 'checkbox-trait',
              valueTrue: 'YES',
              valueFalse: 'NO',
            },
            {
              type: 'checkbox',
              name: 'open',
              category: category2,
            },
            {
              type: 'button',
              label: 'Button trait',
              labelButton: 'Alert',
              name: 'button-trait',
              category: category2,
              full: true,
              command: () => alert('hello'),
            },
            {
              type: 'button',
              label: false,
              full: true,
              category: category2,
              labelButton: 'Open code',
              name: 'button-trait2',
              command: 'core:open-code',
            },
          ],
        },
      },
    });
  };

  const editor = grapesjs.init({
    container: '#gjs',
    height: '100%',
    storageManager: false,
    fromElement: true,
    plugins: ['gjs-blocks-basic', myPlugin],
    traitManager: {
      custom: true
    }
  });

  Vue.component('trait-field', {
    props: { trait: Object },
    template: '#trait-field',
    computed: {
      inputValue() {
        return this.trait.getValue({ useType: true });
      },
      type() {
        return this.trait.getType();
      },
      placeholder() {
        return this.trait.get('placeholder');
      },
      toOptions() {
        const { trait } = this;
        return trait.getOptions().map(o => ({ value: trait.getOptionId(o), text: trait.getOptionLabel(o) }))
      },
      isTypeNeedLabel() {
        return !['checkbox', 'button'].includes(this.type);
      }
    },
    methods: {
      handleChange(value) {
        this.trait.setValue(value);
      },
      handleInput(value) {
        this.trait.setValue(value, { partial: true });
      },
    }
  });

  const app = new Vue({
    el: '.vue-app',
    vuetify: new Vuetify({
      theme: { dark: true },
    }),
    data: {
      traitCategories: [],
      panels: [],
    },
    mounted() {
      const { Traits } = editor;
      // Catch-all event for any spot update
      editor.on('trait:custom', this.onTraitCustom);
    },
    destroyed() {
      editor.off('trait:custom', this.handleCustom);
    },
    methods: {
      onTraitCustom(props) {
        const { container } = props;
        if (container && !container.contains(this.$el)) {
          container.appendChild(this.$el);
        }
        const traitsByCategory = editor.Traits.getTraitsByCategory();
        const noCategoryIndex = traitsByCategory.findIndex(trc => !trc.category) || 0;
        // Keep items without categories open
        if (!this.panels.includes(noCategoryIndex)) {
          this.panels.push(noCategoryIndex);
        }
        this.traitCategories = traitsByCategory;
      },
      categoryId(traitCategory) {
        return traitCategory.category?.id || 'none';
      },
    }
  });
</script>
-->

## Events

For a complete list of available events, you can check it [here](/api/trait_manager.html#available-events).

[Traits API]: /api/trait_manager.html
```

--------------------------------------------------------------------------------

---[FILE: babel.config.js]---
Location: grapesjs-dev/packages/cli/babel.config.js

```javascript
module.exports = {
  presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-typescript'],
};
```

--------------------------------------------------------------------------------

---[FILE: index.html]---
Location: grapesjs-dev/packages/cli/index.html

```text
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title><%= title %></title>
    <link
      href="<%= pathGjsCss ? pathGjsCss : 'https://unpkg.com/grapesjs@' + gjsVersion + '/dist/css/grapes.min.css' %>"
      rel="stylesheet"
    />
    <script src="<%= pathGjs ? pathGjs : 'https://unpkg.com/grapesjs@' + gjsVersion %>"></script>
    <style>
      body,
      html {
        height: 100%;
        margin: 0;
      }
    </style>
  </head>
  <body>
    <div id="gjs" style="height: 0px; overflow: hidden">
      <div style="margin: 100px 100px 25px; padding: 25px; font: caption">
        This is a demo content generated from <b>GrapesJS CLI</b>. For the development, you should create a _index.html
        template file (might be a copy of this one) and on the next server start the new file will be served, and it
        will be ignored by git.
      </div>
    </div>

    <script type="text/javascript">
      window.onload = () => {
        window.editor = grapesjs.init({
          height: '100%',
          container: '#gjs',
          showOffsets: 1,
          noticeOnUnload: 0,
          storageManager: false,
          fromElement: true,
          plugins: ['<%= name %>'],
        });
      };
    </script>
  </body>
</html>
```

--------------------------------------------------------------------------------

---[FILE: jest.config.ts]---
Location: grapesjs-dev/packages/cli/jest.config.ts

```typescript
import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'node',
  verbose: true,
  modulePaths: ['<rootDir>/src'],
  testMatch: ['<rootDir>/test/**/*.(t|j)s'],
};

export default config;
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: grapesjs-dev/packages/cli/package.json

```json
{
  "name": "grapesjs-cli",
  "version": "4.1.3",
  "description": "GrapesJS CLI tool for the plugin development",
  "bin": {
    "grapesjs-cli": "dist/cli.js"
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "cross-env BUILD_MODE=production webpack --config ./webpack.cli.ts",
    "build:watch": "webpack --config ./webpack.cli.ts --watch",
    "lint": "eslint src",
    "patch": "npm version patch -m 'Bump v%s'",
    "test": "jest"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/GrapesJS/grapesjs.git"
  },
  "keywords": [
    "grapesjs",
    "plugin",
    "dev",
    "cli"
  ],
  "author": "Artur Arseniev",
  "license": "BSD-3-Clause",
  "dependencies": {
    "@babel/core": "7.25.2",
    "@babel/plugin-transform-runtime": "7.26.10",
    "@babel/preset-env": "7.25.4",
    "@babel/runtime": "7.25.6",
    "babel-loader": "9.1.3",
    "chalk": "^4.1.2",
    "core-js": "3.38.1",
    "dts-bundle-generator": "^8.0.1",
    "html-webpack-plugin": "5.6.3",
    "inquirer": "^8.2.5",
    "listr": "^0.14.3",
    "lodash.template": "^4.5.0",
    "rimraf": "^4.1.2",
    "spdx-license-list": "^6.6.0",
    "terser-webpack-plugin": "^5.3.14",
    "webpack": "5.94.0",
    "webpack-cli": "5.1.4",
    "webpack-dev-server": "5.1.0",
    "yargs": "^17.6.2"
  },
  "devDependencies": {
    "@types/webpack-node-externals": "^3.0.0",
    "copy-webpack-plugin": "^11.0.0",
    "fork-ts-checker-webpack-plugin": "^8.0.0",
    "webpack-node-externals": "^3.0.0"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: grapesjs-dev/packages/cli/README.md

```text
# GrapesJS CLI

[![npm](https://img.shields.io/npm/v/grapesjs-cli.svg)](https://www.npmjs.com/package/grapesjs-cli)

![grapesjs-cli](https://user-images.githubusercontent.com/11614725/67523496-0ed41300-f6af-11e9-9850-7175355f2946.jpg)

A simple CLI library for helping in GrapesJS plugin development.

The goal of this package is to avoid the hassle of setting up all the dependencies and configurations for the plugin development by centralizing and speeding up the necessary steps during the process.

- Fast project scaffolding
- No need to touch Babel and Webpack configurations

## Plugin from 0 to 100

Create a production-ready plugin in a few simple steps.

- Create a folder for your plugin and init some preliminary steps

```sh
mkdir grapesjs-my-plugin
cd grapesjs-my-plugin
npm init -y
git init
```

- Install the package

```sh
npm i -D grapesjs-cli
```

- Init your plugin project by following few steps

```sh
npx grapesjs-cli init
```

You can also skip all the questions with `-y` option or pass all the answers via options (to see all available options run `npx grapesjs-cli init --help`)

```sh
npx grapesjs-cli init -y --user=YOUR-GITHUB-USERNAME
```

- The command will scaffold the `src` directory and a bunch of other files inside your project. The `src/index.js` will be the entry point of your plugin. Before starting developing your plugin run the development server and open the printed URL (eg. the default is http://localhost:8080)

```sh
npx grapesjs-cli serve
```

If you need a custom port use the `-p` option

```sh
npx grapesjs-cli serve -p 8081
```

Under the hood we use `webpack-dev-server` and you can pass its option via CLI in this way

```sh
npx grapesjs-cli serve --devServer='{"https": true}'
```

- Once the development is finished you can build your plugin and generate the minified file ready for production

```sh
npx grapesjs-cli build
```

- Before publishing your package remember to complete your README.md file with all the available options, components, blocks and so on.
  For a better user engagement create a simple live demo by using services like [JSFiddle](https://jsfiddle.net) [CodeSandbox](https://codesandbox.io) [CodePen](https://codepen.io) and link it in your README. To help you in this process we'll print all the necessary HTML/CSS/JS in your README, so it will be just a matter of copy-pasting on some of those services.

## Customization

### Customize webpack config

If you need to customize the webpack configuration, you can create `webpack.config.js` file in the root dir of your project and export a function, which should return the new configuration object. Check the example below.

```js
// YOUR-PROJECT-DIR/webpack.config.js

// config is the default configuration
export default ({ config }) => {
  // This is how you can distinguish the `build` command from the `serve`
  const isBuild = config.mode === 'production';

  return {
    ...config,
    module: {
      rules: [
        {
          /* extra rule */
        },
        ...config.module.rules,
      ],
    },
  };
};
```

## Generic CLI usage

Show all available commands

```sh
grapesjs-cli
```

Show available options for a command

```sh
grapesjs-cli COMMAND --help
```

Run the command

```sh
grapesjs-cli COMMAND --OPT1 --OPT2=VALUE
```

## License

MIT
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: grapesjs-dev/packages/cli/tsconfig.json

```json
{
  "compilerOptions": {
    "allowJs": true,
    "noImplicitThis": true,
    "moduleResolution": "node",
    "noUnusedLocals": true,
    "allowUnreachableCode": false,
    "module": "commonjs",
    "target": "es2016",
    "outDir": "dist",
    "esModuleInterop": true,
    "declaration": true,
    "noImplicitReturns": false,
    "noImplicitAny": false,
    "strictNullChecks": false,
    "resolveJsonModule": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true
  },
  "include": ["src/cli.ts"]
}
```

--------------------------------------------------------------------------------

---[FILE: webpack.cli.ts]---
Location: grapesjs-dev/packages/cli/webpack.cli.ts

```typescript
import webpack, { type Configuration } from 'webpack';
import NodeExternals from 'webpack-node-externals';
import CopyPlugin from 'copy-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { resolve } from 'path';

const MODE = process.env.BUILD_MODE === 'production' ? 'production' : 'development';

const config: Configuration = {
  context: process.cwd(),
  mode: MODE,
  entry: './src/cli.ts',
  output: {
    filename: 'cli.js',
    path: resolve(__dirname, 'dist'),
  },
  target: 'node',
  stats: {
    preset: 'minimal',
    warnings: false,
  },
  module: {
    rules: [
      {
        test: /\.(jsx?|tsx?)$/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: ['@babel/preset-typescript'],
            assumptions: {
              setPublicClassFields: false,
            },
          },
        },
        exclude: [/node_modules/],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.d.ts'],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new webpack.BannerPlugin({ banner: '#!/usr/bin/env node', raw: true }),
    new CopyPlugin({
      patterns: [
        { from: 'src/banner.txt', to: 'banner.txt' },
        {
          from: 'src/template',
          to: 'template',
          // Terser skip this file for minimization
          info: { minimized: true },
        },
      ],
    }),
  ],
  externalsPresets: { node: true },
  externals: [NodeExternals()],
};

export default config;
```

--------------------------------------------------------------------------------

---[FILE: banner.txt]---
Location: grapesjs-dev/packages/cli/src/banner.txt

```text
   ______                               _______       ________    ____
  / ____/________ _____  ___  _____    / / ___/      / ____/ /   /  _/
 / / __/ ___/ __ `/ __ \/ _ \/ ___/_  / /\__ \______/ /   / /    / /
/ /_/ / /  / /_/ / /_/ /  __(__  ) /_/ /___/ /_____/ /___/ /____/ /
\____/_/   \__,_/ .___/\___/____/\____//____/      \____/_____/___/
               /_/
```

--------------------------------------------------------------------------------

````
