---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 61
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 61 of 695)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - payload-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/payload-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: overview.mdx]---
Location: payload-main/docs/rich-text/overview.mdx

```text
---
description: The Payload editor, based on Lexical, allows for great customization with unparalleled ease.
keywords: lexical, rich text, editor, headless cms
label: Overview
order: 10
title: Rich Text Editor
---

<Banner type="success">

This documentation is about our new editor, based on Lexical (Meta's rich text editor). The previous default
editor, based on Slate, has been deprecated and will be removed in 4.0. You can read [its documentation](/docs/rich-text/slate),
or the [migration guide](/docs/rich-text/migration) to migrate from Slate to Lexical (recommended).

</Banner>

The editor is the most important property of the [rich text field](/docs/fields/rich-text).

As a key part of Payload, we are proud to offer you the best editing experience you can imagine. With healthy
defaults out of the box, but also with the flexibility to customize every detail: from the “/” menu
and toolbars (whether inline or fixed) to inserting any component or subfield you can imagine.

To use the rich text editor, first you need to install it:

```bash
pnpm install @payloadcms/richtext-lexical
```

Once you have it installed, you can pass it to your top-level Payload Config as follows:

```ts
import { buildConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export default buildConfig({
  collections: [
    // your collections here
  ],
  // Pass the Lexical editor to the root config
  editor: lexicalEditor({}),
})
```

You can also override Lexical settings on a field-by-field basis as follows:

```ts
import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Pages: CollectionConfig = {
  slug: 'pages',
  fields: [
    {
      name: 'content',
      type: 'richText',
      // Pass the Lexical editor here and override base settings as necessary
      editor: lexicalEditor({}),
    },
  ],
}
```

## Extending the lexical editor with Features

Lexical has been designed with extensibility in mind. Whether you're aiming to introduce new functionalities or tweak the existing ones, Lexical makes it seamless for you to bring those changes to life.

### Features: The Building Blocks

At the heart of Lexical's customization potential are "features". While Lexical ships with a set of default features we believe are essential for most use cases, the true power lies in your ability to redefine, expand, or prune these as needed.

If you remove all the default features, you're left with a blank editor. You can then add in only the features you need, or you can build your own custom features from scratch.

### Integrating New Features

To weave in your custom features, utilize the `features` prop when initializing the Lexical Editor. Here's a basic example of how this is done:

```ts
import {
  BlocksFeature,
  LinkFeature,
  UploadFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { Banner } from '../blocks/Banner'
import { CallToAction } from '../blocks/CallToAction'

{
  editor: lexicalEditor({
    features: ({ defaultFeatures, rootFeatures }) => [
      ...defaultFeatures,
      LinkFeature({
        // Example showing how to customize the built-in fields
        // of the Link feature
        fields: ({ defaultFields }) => [
          ...defaultFields,
          {
            name: 'rel',
            label: 'Rel Attribute',
            type: 'select',
            hasMany: true,
            options: ['noopener', 'noreferrer', 'nofollow'],
            admin: {
              description:
                'The rel attribute defines the relationship between a linked resource and the current document. This is a custom link field.',
            },
          },
        ],
      }),
      UploadFeature({
        collections: {
          uploads: {
            // Example showing how to customize the built-in fields
            // of the Upload feature
            fields: [
              {
                name: 'caption',
                type: 'richText',
                editor: lexicalEditor(),
              },
            ],
          },
        },
      }),
      // This is incredibly powerful. You can reuse your Payload blocks
      // directly in the Lexical editor as follows:
      BlocksFeature({
        blocks: [Banner, CallToAction],
      }),
    ],
  })
}
```

`features` can be both an array of features, or a function returning an array of features. The function provides the following props:

| Prop                  | Description                                                                                                                                                                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`defaultFeatures`** | This opinionated array contains all "recommended" default features. You can see which features are included in the default features in the table below.                                                                                                |
| **`rootFeatures`**    | This array contains all features that are enabled in the root richText editor (the one defined in the payload.config.ts). If this field is the root richText editor, or if the root richText editor is not a lexical editor, this array will be empty. |

## Official Features

You can find more information about the official features in our [official features docs](../rich-text/official-features).

## Creating your own, custom Feature

You can find more information about creating your own feature in our [building custom feature docs](../rich-text/custom-features).

## TypeScript

Every single piece of saved data is 100% fully typed within lexical. It provides a type for every single node, which can be imported from `@payloadcms/richtext-lexical` - each type is prefixed with `Serialized`, e.g., `SerializedUploadNode`.

To fully type the entire editor JSON, you can use our `TypedEditorState` helper type, which accepts a union of all possible node types as a generic. We don't provide a type that already contains all possible node types because they depend on which features you have enabled in your editor. Here is an example:

```ts
import type {
  SerializedAutoLinkNode,
  SerializedBlockNode,
  SerializedHorizontalRuleNode,
  SerializedLinkNode,
  SerializedListItemNode,
  SerializedListNode,
  SerializedParagraphNode,
  SerializedQuoteNode,
  SerializedRelationshipNode,
  SerializedTextNode,
  SerializedUploadNode,
  TypedEditorState,
  SerializedHeadingNode,
} from '@payloadcms/richtext-lexical'

const editorState: TypedEditorState<
  | SerializedAutoLinkNode
  | SerializedBlockNode
  | SerializedHorizontalRuleNode
  | SerializedLinkNode
  | SerializedListItemNode
  | SerializedListNode
  | SerializedParagraphNode
  | SerializedQuoteNode
  | SerializedRelationshipNode
  | SerializedTextNode
  | SerializedUploadNode
  | SerializedHeadingNode
> = {
  root: {
    type: 'root',
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: 'Some text. Every property here is fully-typed',
            type: 'text',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        textFormat: 0,
        version: 1,
      },
    ],
  },
}
```

Alternatively, you can use the `DefaultTypedEditorState` type, which includes all types for all nodes included in the `defaultFeatures`:

```ts
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

const editorState: DefaultTypedEditorState = {
  root: {
    type: 'root',
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: 'Some text. Every property here is fully-typed',
            type: 'text',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        textFormat: 0,
        version: 1,
      },
    ],
  },
}
```

Just like `TypedEditorState`, the `DefaultTypedEditorState` also accepts an optional node type union as a generic. Here, this would **add** the specified node types to the default ones. Example:

```ts
DefaultTypedEditorState<SerializedBlockNode | YourCustomSerializedNode>
```

This is a type-safe representation of the editor state. If you look at the auto suggestions of a node's `type` property, you will see all the possible node types you can use.

Make sure to only use types exported from `@payloadcms/richtext-lexical`, not from the lexical core packages. We only have control over the types we export and can make sure they're correct, even though the lexical core may export types with identical names.

### Automatic type generation

Lexical does not generate accurate type definitions for your richText fields for you yet - this will be improved in the future. Currently, it only outputs the rough shape of the editor JSON, which you can enhance using type assertions.

## Admin customization

The Rich Text Field editor configuration has an `admin` property with the following options:

| Property                        | Description                                                                                                 |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **`placeholder`**               | Set this property to define a placeholder string for the field.                                             |
| **`hideGutter`**                | Set this property to `true` to hide this field's gutter within the Admin Panel.                             |
| **`hideInsertParagraphAtEnd`**  | Set this property to `true` to hide the "+" button that appears at the end of the editor.                   |
| **`hideDraggableBlockElement`** | Set this property to `true` to hide the draggable element that appears when you hover a node in the editor. |
| **`hideAddBlockButton`**        | Set this property to `true` to hide the "+" button that appears when you hover a node in the editor.        |

### Disable the gutter

You can disable the gutter (the vertical line padding between the editor and the left edge of the screen) by setting the `hideGutter` prop to `true`:

```ts
{
  name: 'richText',
  type: 'richText',
  editor: lexicalEditor({
    admin: {
      hideGutter: true
    },
  }),
}
```

### Customize the placeholder

You can customize the placeholder (the text that appears in the editor when it's empty) by setting the `placeholder` prop:

```ts
{
  name: 'richText',
  type: 'richText',
  editor: lexicalEditor({
    admin: {
      placeholder: 'Type your content here...'
    },
  }),
}
```

## Detecting empty editor state

When you first type into a rich text field and subsequently delete everything through the admin panel, its value changes from `null` to a JSON object containing an empty paragraph.

If needed, you can reset the field value to `null` programmatically - for example, by using a custom hook to detect when the editor is empty.

This also applies to fields like `text` and `textArea`, which could be stored as either `null` or an empty value in the database. Since the empty value for richText is a JSON object, checking for emptiness is a bit more involved - so Payload provides a utility for it:

```ts
import { hasText } from '@payloadcms/richtext-lexical/shared'

hasText(richtextData)
```
```

--------------------------------------------------------------------------------

---[FILE: rendering-on-demand.mdx]---
Location: payload-main/docs/rich-text/rendering-on-demand.mdx

```text
---
title: Rendering On Demand
label: Rendering On Demand
order: 50
desc: Rendering rich text on demand
keywords: lexical, rich text, editor, headless cms, render, rendering
---

Lexical in Payload is a **React Server Component (RSC)**. Historically that created three headaches: 1. You couldn't render the editor directly from the client. 2. Features like blocks, tables and link drawers require the server to know the shape of nested sub-fields at render time. If you tried to render on demand, the server didn't know those schemas. 3. The rich text field is designed to live inside a `Form`. For simple use cases, setting up a full form just to manage editor state was cumbersome.

To simplify rendering richtext on demand, <RenderLexical />, that renders a Lexical editor while still covering the full feature set. On mount, it calls a server action to render the editor on the server using the new `render-field` server function. That server render gives Lexical everything it needs (including nested field schemas) and returns a ready-to-hydrate editor.

<Banner type="warning">
  `RenderLexical` and the underlying `render-field` server function are
  experimental and may change in minor releases.
</Banner>

## Inside an existing Form

If you have an existing Form and want to render a richtext field within it, you can use the `RenderLexical` component like this:

```tsx
'use client'

import type { JSONFieldClientComponent } from 'payload'

import {
  buildEditorState,
  RenderLexical,
} from '@payloadcms/richtext-lexical/client'

import { lexicalFullyFeaturedSlug } from '../../slugs.js'

export const Component: JSONFieldClientComponent = (args) => {
  return (
    <RenderLexical
      field={{
        name: 'myFieldName' /* Make sure this matches the field name present in your form */,
      }}
      initialValue={buildEditorState<DefaultNodeTypes>({
        text: 'default value',
      })}
      schemaPath={`collection.${lexicalFullyFeaturedSlug}.richText`}
    />
  )
}
```

## Outside of a Form (you control state)

```tsx
'use client'

import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { JSONFieldClientComponent } from 'payload'

import {
  buildEditorState,
  RenderLexical,
} from '@payloadcms/richtext-lexical/client'
import React, { useState } from 'react'

import { lexicalFullyFeaturedSlug } from '../../slugs.js'

export const Component: JSONFieldClientComponent = (args) => {
  // Manually manage the editor state
  const [value, setValue] = useState<DefaultTypedEditorState | undefined>(() =>
    buildEditorState<DefaultNodeTypes>({ text: 'state default' }),
  )

  const handleReset = React.useCallback(() => {
    setValue(buildEditorState<DefaultNodeTypes>({ text: 'state default' }))
  }, [])

  return (
    <div>
      <RenderLexical
        field={{ name: 'myField' }}
        initialValue={buildEditorState<DefaultNodeTypes>({
          text: 'default value',
        })}
        schemaPath={`collection.${lexicalFullyFeaturedSlug}.richText`}
        setValue={setValue as any}
        value={value}
      />
      <button onClick={handleReset} style={{ marginTop: 8 }} type="button">
        Reset Editor State
      </button>
    </div>
  )
}
```

## Choosing the schemaPath

`schemaPath` tells the server which richText field to render. This gives the server the exact nested field schemas (blocks, relationship drawers, upload fields, tables, etc.).

Format:

- `collection.<collectionSlug>.<fieldPath>`
- `global.<globalSlug>.<fieldPath>`

Example (top level): `collection.posts.richText`

Example (nested in a group/tab): `collection.posts.content.richText`

<Banner type="info">
  **Tip:** If your target editor lives deep in arrays/blocks and you're unsure of the exact path, you can define a **hidden top-level richText** purely as a "render anchor":

```ts
{
  name: 'onDemandAnchor',
  type: 'richText',
  admin: { hidden: true }
}
```

Then use `schemaPath="collection.posts.onDemandAnchor"`

</Banner>
```

--------------------------------------------------------------------------------

---[FILE: slate.mdx]---
Location: payload-main/docs/rich-text/slate.mdx

```text
---
title: Slate Editor
label: Slate (legacy)
order: 100
desc: The Slate editor is our old rich text editor and will be removed in 4.0.
keywords: slatejs, slate
---

<Banner type="warning">

The [default Payload editor](/docs/rich-text/overview) is currently based on Lexical. This documentation is about our old Slate-based editor which has been deprecated and will be removed in 4.0. We recommend [migrating to Lexical](/docs/rich-text/migration) instead.

</Banner>

To use the Slate editor, first you need to install it:

```
npm install --save @payloadcms/richtext-slate
```

After installation, you can pass it to your top-level Payload Config:

```ts
import { buildConfig } from 'payload'
import { slateEditor } from '@payloadcms/richtext-slate'

export default buildConfig({
  collections: [
    // your collections here
  ],
  // Pass the Slate editor to the root config
  editor: slateEditor({}),
})
```

And here's an example for how to install the Slate editor on a field-by-field basis, while customizing its options:

```ts
import type { CollectionConfig } from 'payload'
import { slateEditor } from '@payloadcms/richtext-slate'

export const Pages: CollectionConfig = {
  slug: 'pages',
  fields: [
    {
      name: 'content',
      type: 'richText',
      // Pass the Slate editor here and configure it accordingly
      editor: slateEditor({
        admin: {
          elements: [
            // customize elements allowed in Slate editor here
          ],
          leaves: [
            // customize leaves allowed in Slate editor here
          ],
        },
      }),
    },
  ],
}
```

## Admin Options

**`elements`**

The `elements` property is used to specify which built-in or custom [SlateJS elements](https://docs.slatejs.org/concepts/02-nodes#element) should be made available to the field within the Admin Panel.

The default `elements` available in Payload are:

- `h1`
- `h2`
- `h3`
- `h4`
- `h5`
- `h6`
- `blockquote`
- `link`
- `ol`
- `ul`
- `li`
- `textAlign`
- `indent`
- [`relationship`](#relationship-element)
- [`upload`](#upload-element)
- [`textAlign`](#text-align)

**`leaves`**

The `leaves` property specifies built-in or custom [SlateJS leaves](https://docs.slatejs.org/concepts/08-rendering#leaves) to be enabled within the Admin Panel.

The default `leaves` available in Payload are:

- `bold`
- `code`
- `italic`
- `strikethrough`
- `underline`

**`link.fields`**

This allows [fields](/docs/fields/overview) to be saved as extra fields on a link inside the Rich Text Editor. When this is present, the fields will render inside a modal that can be opened by clicking the "edit" button on the link element.

`link.fields` may either be an array of fields (in which case all fields defined in it will be appended below the default fields) or a function that accepts the default fields as only argument and returns an array defining the entirety of fields to be used (thus providing a mechanism of overriding the default fields).

![RichText link fields](https://payloadcms.com/images/docs/fields/richText/rte-link-fields-modal.jpg)
_RichText link with custom fields_

**`upload.collections[collection-name].fields`**

This allows [fields](/docs/fields/overview) to be saved as meta data on an upload field inside the Rich Text Editor. When this is present, the fields will render inside a modal that can be opened by clicking the "edit" button on the upload element.

![RichText upload element](https://payloadcms.com/images/docs/fields/richText/rte-upload-element.jpg)
_RichText field using the upload element_

![RichText upload element modal](https://payloadcms.com/images/docs/fields/richText/rte-upload-fields-modal.jpg)
_RichText upload element modal displaying fields from the config_

### Relationship element

The built-in `relationship` element is a powerful way to reference other Documents directly within your Rich Text editor.

### Upload element

Similar to the `relationship` element, the `upload` element is a user-friendly way to reference [Upload-enabled collections](/docs/upload/overview) with a UI specifically designed for media / image-based uploads.

<Banner type="success">
  **Tip:**

Collections are automatically allowed to be selected within the Rich Text relationship and upload
elements by default. If you want to disable a collection from being able to be referenced in Rich
Text fields, set the collection admin options of **enableRichTextLink** and
**enableRichTextRelationship** to false.

</Banner>

Relationship and Upload elements are populated dynamically into your Rich Text field' content. Within the REST and Local APIs, any present RichText `relationship` or `upload` elements will respect the `depth` option that you pass, and will be populated accordingly. In GraphQL, each `richText` field accepts an argument of `depth` for you to utilize.

### TextAlign element

Text Alignment is not included by default and can be added to a Rich Text Editor by adding `textAlign` to the list of elements. TextAlign will alter the existing element to include a new `textAlign` field in the resulting JSON. This field can be used in combination with other elements and leaves to position content to the left, center or right.

### Specifying which elements and leaves to allow

To specify which default elements or leaves should be allowed to be used for this field, define arrays that contain string names for each element or leaf you wish to enable. To specify a custom element or leaf, pass an object with all corresponding properties as outlined below. View the [example](#example) to reference how this all works.

### Building custom elements and leaves

You can design and build your own Slate elements and leaves to extend the editor with your own functionality. To do so, first start by reading the [SlateJS documentation](https://docs.slatejs.org/) and looking at the [Slate examples](https://www.slatejs.org/examples/richtext) to familiarize yourself with the SlateJS editor as a whole.

Once you're up to speed with the general concepts involved, you can pass in your own elements and leaves to your field's admin config.

**Both custom elements and leaves are defined via the following config:**

| Property        | Description                                                |
| --------------- | ---------------------------------------------------------- |
| **`name`** \*   | The default name to be used as a `type` for this element.  |
| **`Button`** \* | A React component to be rendered in the Rich Text toolbar. |
| **`plugins`**   | An array of plugins to provide to the Rich Text editor.    |
| **`type`**      | A type that overrides the default type used by `name`      |

Custom `Element`s also require the `Element` property set to a React component to be rendered as the `Element` within the rich text editor itself.

Custom `Leaf` objects follow a similar pattern but require you to define the `Leaf` property instead.

Specifying custom `Type`s let you extend your custom elements by adding additional fields to your JSON object.

### Example

```ts
import type { CollectionConfig } from 'payload'

import { slateEditor } from '@payloadcms/richtext-slate'

export const ExampleCollection: CollectionConfig = {
  slug: 'example-collection',
  fields: [
    {
      name: 'content', // required
      type: 'richText', // required
      defaultValue: [
        {
          children: [{ text: 'Here is some default content for this field' }],
        },
      ],
      required: true,
      editor: slateEditor({
        admin: {
          elements: [
            'h2',
            'h3',
            'h4',
            'link',
            'blockquote',
            {
              name: 'cta',
              Button: CustomCallToActionButton,
              Element: CustomCallToActionElement,
              plugins: [
                // any plugins that are required by this element go here
              ],
            },
          ],
          leaves: [
            'bold',
            'italic',
            {
              name: 'highlight',
              Button: CustomHighlightButton,
              Leaf: CustomHighlightLeaf,
              plugins: [
                // any plugins that are required by this leaf go here
              ],
            },
          ],
          link: {
            // Inject your own fields into the Link element
            fields: [
              {
                name: 'rel',
                label: 'Rel Attribute',
                type: 'select',
                hasMany: true,
                options: ['noopener', 'noreferrer', 'nofollow'],
              },
            ],
          },
          upload: {
            collections: {
              media: {
                fields: [
                  // any fields that you would like to save
                  // on an upload element in the `media` collection
                ],
              },
            },
          },
        },
      }),
    },
  ],
}
```

### Generating HTML

As the Rich Text field saves its content in a JSON format, you'll need to render it as HTML yourself. Here is an example for how to generate JSX / HTML from Rich Text content:

```ts
import React, { Fragment } from "react";
import escapeHTML from "escape-html";
import { Text } from "slate";

const serialize = (children) =>
  children.map((node, i) => {
    if (Text.isText(node)) {
      let text = (
        <span dangerouslySetInnerHTML={{ __html: escapeHTML(node.text) }} />
      );

      if (node.bold) {
        text = <strong key={i}>{text}</strong>;
      }

      if (node.code) {
        text = <code key={i}>{text}</code>;
      }

      if (node.italic) {
        text = <em key={i}>{text}</em>;
      }

      // Handle other leaf types here...

      return <Fragment key={i}>{text}</Fragment>;
    }

    if (!node) {
      return null;
    }

    switch (node.type) {
      case "h1":
        return <h1 key={i}>{serialize(node.children)}</h1>;
      // Iterate through all headings here...
      case "h6":
        return <h6 key={i}>{serialize(node.children)}</h6>;
      case "blockquote":
        return <blockquote key={i}>{serialize(node.children)}</blockquote>;
      case "ul":
        return <ul key={i}>{serialize(node.children)}</ul>;
      case "ol":
        return <ol key={i}>{serialize(node.children)}</ol>;
      case "li":
        return <li key={i}>{serialize(node.children)}</li>;
      case "link":
        return (
          <a href={escapeHTML(node.url)} key={i}>
            {serialize(node.children)}
          </a>
        );

      default:
        return <p key={i}>{serialize(node.children)}</p>;
    }
  });
```

<Banner>
  **Note:**

The above example is for how to render to JSX, although for plain HTML the pattern is similar.
Just remove the JSX and return HTML strings instead!

</Banner>

### Built-in SlateJS Plugins

Payload comes with a few built-in SlateJS plugins which can be extended to make developing your own elements and leaves a bit easier.

#### `shouldBreakOutOnEnter`

Payload's built-in heading elements all allow a "hard return" to "break out" of the currently active element. For example, if you hit `enter` while typing an `h1`, the `h1` will be "broken out of" and you'll be able to continue writing as the default paragraph element.

If you want to utilize this functionality within your own custom elements, you can do so by adding a custom plugin to your `element` like the following "large body" element example:

`customLargeBodyElement.js`:

```ts
import Button from './Button'
import Element from './Element'
import withLargeBody from './plugin'

export default {
  name: 'large-body',
  Button,
  Element,
  plugins: [
    (incomingEditor) => {
      const editor = incomingEditor
      const { shouldBreakOutOnEnter } = editor

      editor.shouldBreakOutOnEnter = (element) =>
        element.type === 'large-body' ? true : shouldBreakOutOnEnter(element)

      return editor
    },
  ],
}
```

Above, you can see that we are creating a custom SlateJS element with a name of `large-body`. This might render a slightly larger body copy on the frontend of your app(s). We pass it a name, button, and element&mdash;but additionally, we pass it a `plugins` array containing a single SlateJS plugin.

The plugin itself extends Payload's built-in `shouldBreakOutOnEnter` Slate function to add its own element name to the list of elements that should "break out" when the `enter` key is pressed.

### TypeScript

If you are building your own custom Rich Text elements or leaves, you may benefit from importing the following types:

```ts
import type {
  RichTextCustomElement,
  RichTextCustomLeaf,
} from '@payloadcms/richtext-slate'
```
```

--------------------------------------------------------------------------------

---[FILE: overview.mdx]---
Location: payload-main/docs/trash/overview.mdx

```text
---
title: Trash
label: Overview
order: 10
desc: Enable soft deletes for your collections to mark documents as deleted without permanently removing them.
keywords: trash, soft delete, deletedAt, recovery, restore
---

Trash (also known as soft delete) allows documents to be marked as deleted without being permanently removed. When enabled on a collection, deleted documents will receive a `deletedAt` timestamp, making it possible to restore them later, view them in a dedicated Trash view, or permanently delete them.

Soft delete is a safer way to manage content lifecycle, giving editors a chance to review and recover documents that may have been deleted by mistake.

<Banner type="warning">
  **Note:** The Trash feature is currently in beta and may be subject to change
  in minor version updates.
</Banner>

## Collection Configuration

To enable soft deleting for a collection, set the `trash` property to `true`:

```ts
import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  trash: true,
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    // other fields...
  ],
}
```

When enabled, Payload automatically injects a deletedAt field into the collection's schema. This timestamp is set when a document is soft-deleted, and cleared when the document is restored.

## Admin Panel behavior

Once `trash` is enabled, the Admin Panel provides a dedicated Trash view for each collection:

- A new route is added at `/collections/:collectionSlug/trash`
- The `Trash` view shows all documents that have a `deletedAt` timestamp

From the Trash view, you can:

- Use bulk actions to manage trashed documents:

  - **Restore** to clear the `deletedAt` timestamp and return documents to their original state
  - **Delete** to permanently remove selected documents
  - **Empty Trash** to select and permanently delete all trashed documents at once

- Enter each document's **edit view**, just like in the main list view. While in the edit view of a trashed document:
  - All fields are in a **read-only** state
  - Standard document actions (e.g., Save, Publish, Restore Version) are hidden and disabled.
  - The available actions are **Restore** and **Permanently Delete**.
  - Access to the **API**, **Versions**, and **Preview** views is preserved.

When deleting a document from the main collection List View, Payload will soft-delete the document by default. A checkbox in the delete confirmation modal allows users to skip the trash and permanently delete instead.

## API Support

Soft deletes are fully supported across all Payload APIs: **Local**, **REST**, and **GraphQL**.

The following operations respect and support the `trash` functionality:

- `find`
- `findByID`
- `update`
- `updateByID`
- `delete`
- `deleteByID`
- `findVersions`
- `findVersionByID`

### Understanding `trash` Behavior

Passing `trash: true` to these operations will **include soft-deleted documents** in the query results.

To return _only_ soft-deleted documents, you must combine `trash: true` with a `where` clause that checks if `deletedAt` exists.

### Examples

#### Local API

Return all documents including trashed:

```ts
const result = await payload.find({
  collection: 'posts',
  trash: true,
})
```

Return only trashed documents:

```ts
const result = await payload.find({
  collection: 'posts',
  trash: true,
  where: {
    deletedAt: {
      exists: true,
    },
  },
})
```

Return only non-trashed documents:

```ts
const result = await payload.find({
  collection: 'posts',
  trash: false,
})
```

#### REST

Return **all** documents including trashed:

```http
GET /api/posts?trash=true
```

Return **only trashed** documents:

```http
GET /api/posts?trash=true&where[deletedAt][exists]=true
```

Return only non-trashed documents:

```http
GET /api/posts?trash=false
```

#### GraphQL

Return all documents including trashed:

```ts
query {
  Posts(trash: true) {
    docs {
      id
      deletedAt
    }
  }
}
```

Return only trashed documents:

```ts
query {
  Posts(
    trash: true
    where: { deletedAt: { exists: true } }
  ) {
    docs {
      id
      deletedAt
    }
  }
}
```

Return only non-trashed documents:

```ts
query {
  Posts(trash: false) {
    docs {
      id
      deletedAt
    }
  }
}
```

## Access Control

All trash-related actions (delete, permanent delete) respect the `delete` access control defined in your collection config.

This means:

- If a user is denied delete access, they cannot soft delete or permanently delete documents

## Versions and Trash

When a document is soft-deleted:

- It can no longer have a version **restored** until it is first restored from trash
- Attempting to restore a version while the document is in trash will result in an error
- This ensures consistency between the current document state and its version history

However, versions are still fully **visible and accessible** from the **edit view** of a trashed document. You can view the full version history, but must restore the document itself before restoring any individual version.
```

--------------------------------------------------------------------------------

````
