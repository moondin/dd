---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 60
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 60 of 695)

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

---[FILE: migration.mdx]---
Location: payload-main/docs/rich-text/migration.mdx

```text
---
title: Lexical Migration
label: Migration
order: 90
desc: Migration from slate and payload-plugin-lexical to lexical
keywords: lexical, rich text, editor, headless cms, migrate, migration
---

## Migrating from Slate

While both Slate and Lexical save the editor state in JSON, the structure of the JSON is different. Payload provides a two-phase migration approach that allows you to safely migrate from Slate to Lexical:

1. **Preview Phase**: Test the migration with an `afterRead` hook that converts data on-the-fly
2. **Migration Phase**: Run a script to permanently migrate all data in the database

### Phase 1: Preview & Test

First, add the `SlateToLexicalFeature` to every richText field you want to migrate. By default, this feature converts your data from Slate to Lexical format on-the-fly through an `afterRead` hook. If the data is already in Lexical format, it passes through unchanged.

This allows you to test the migration without modifying your database. The on-the-fly conversion happens server-side through the `afterRead` hook, which means:

- **In the Admin Panel**: Preview how your content will look in the Lexical editor
- **In your API**: All read operations (REST, GraphQL, Local API) return converted Lexical data instead of Slate data
- **In your application**: Your frontend receives Lexical data, allowing you to test if your app correctly handles the new format

You can verify that:

- All content converts correctly
- Custom nodes are handled properly
- Formatting is preserved
- Your application displays the Lexical data as expected
- Any custom converters work as expected

**Example:**

```ts
import type { CollectionConfig } from 'payload'

import { SlateToLexicalFeature } from '@payloadcms/richtext-lexical/migrate'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

const Pages: CollectionConfig = {
  slug: 'pages',
  fields: [
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          SlateToLexicalFeature({}),
        ],
      }),
    },
  ],
}
```

**Important**: In preview mode, if you save a document in the Admin Panel, it will overwrite the Slate data with the converted Lexical data in the database. Only save if you've verified the conversion is correct.

Each richText field has its own `SlateToLexicalFeature` instance because each field may require different converters. For example, one field might contain custom Slate nodes that need custom converters.

### Phase 2: Running the Migration Script

Once you've tested the migration in preview mode and verified the results, you can permanently migrate all data in your database.

#### Why Run the Migration Script?

While the `SlateToLexicalFeature` works well for testing, running the migration script has important benefits:

- **Performance**: The `afterRead` hook converts data on-the-fly, adding overhead to every read operation
- **Database Consistency**: Direct database operations (e.g., `payload.db.find` instead of `payload.find`) bypass hooks and return unconverted Slate data
- **Production Ready**: After migration, your data is fully converted and you can remove the migration feature

#### Migration Prerequisites

**CRITICAL: This will permanently overwrite all Slate data. Follow these steps carefully:**

1. **Backup Your Database**: Create a complete backup of your database before proceeding. If anything goes wrong without a backup, data recovery may not be possible.

2. **Convert All richText Fields**: Update your config to use `lexicalEditor()` for all richText fields. The script only converts fields that:

   - Use the Lexical editor
   - Have `SlateToLexicalFeature` added
   - Contain Slate data in the database

3. **Test the Preview**: Add `SlateToLexicalFeature` to every richText field (as shown in Phase 1) and thoroughly test in the Admin Panel. Build custom converters for any custom Slate nodes before proceeding.

4. **Disable Hooks**: Once testing is complete, add `disableHooks: true` to all `SlateToLexicalFeature` instances:

```ts
SlateToLexicalFeature({ disableHooks: true })
```

This prevents the `afterRead` hook from running during migration, improving performance and ensuring clean data writes.

#### Running the Migration

Create a migration script and run it:

```ts
import { getPayload } from 'payload'
import config from '@payload-config'
import { migrateSlateToLexical } from '@payloadcms/richtext-lexical/migrate'

const payload = await getPayload({ config })

await migrateSlateToLexical({ payload })
```

The migration will:

- Process all collections and globals
- Handle all locales (if localization is enabled)
- Migrate both published and draft documents
- Recursively process nested fields (arrays, blocks, tabs, groups)
- Log progress for each collection and document
- Collect and report any errors at the end

Depending on your database size, this may take considerable time. The script provides detailed progress updates as it runs.

### Converting Custom Slate Nodes

If your Slate editor includes custom nodes, you'll need to create custom converters for them. A converter transforms a Slate node structure into its Lexical equivalent.

#### How Converters Work

Each converter receives the Slate node and returns the corresponding Lexical node. The converter also specifies which Slate node types it handles via the `nodeTypes` array.

#### Example: Simple Node Converter

Here's the built-in Upload converter as an example:

```ts
import type { SerializedUploadNode } from '@payloadcms/richtext-lexical'
import type { SlateNodeConverter } from '@payloadcms/richtext-lexical'

export const SlateUploadConverter: SlateNodeConverter = {
  converter({ slateNode }) {
    return {
      type: 'upload',
      fields: {
        ...slateNode.fields,
      },
      format: '',
      relationTo: slateNode.relationTo,
      type: 'upload',
      value: {
        id: slateNode.value?.id || '',
      },
      version: 1,
    } as const as SerializedUploadNode
  },
  nodeTypes: ['upload'],
}
```

#### Example: Node with Children

For nodes that contain child nodes (like links), recursively convert the children:

```ts
import type { SerializedLinkNode } from '@payloadcms/richtext-lexical'
import type { SlateNodeConverter } from '@payloadcms/richtext-lexical'
import { convertSlateNodesToLexical } from '@payloadcms/richtext-lexical/migrate'

export const SlateLinkConverter: SlateNodeConverter = {
  converter({ converters, slateNode }) {
    return {
      type: 'link',
      children: convertSlateNodesToLexical({
        canContainParagraphs: false,
        converters,
        parentNodeType: 'link',
        slateNodes: slateNode.children || [],
      }),
      direction: 'ltr',
      fields: {
        doc: slateNode.doc || null,
        linkType: slateNode.linkType || 'custom',
        newTab: slateNode.newTab || false,
        url: slateNode.url || '',
      },
      format: '',
      indent: 0,
      version: 2,
    } as const as SerializedLinkNode
  },
  nodeTypes: ['link'],
}
```

#### Converter API

Your converter function receives these parameters:

```ts
{
  slateNode: SlateNode,         // The Slate node to convert
  converters: SlateNodeConverter[], // All available converters (for recursive conversion)
  parentNodeType: string,        // The Lexical node type of the parent
  childIndex: number,            // Index of this node in parent's children array
}
```

#### Adding Custom Converters

You can add custom converters by passing an array of converters to the `converters` property of the `SlateToLexicalFeature` props:

```ts
import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import {
  SlateToLexicalFeature,
  defaultSlateConverters,
} from '@payloadcms/richtext-lexical/migrate'
import { MyCustomConverter } from './converters/MyCustomConverter'

const Pages: CollectionConfig = {
  slug: 'pages',
  fields: [
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          SlateToLexicalFeature({
            converters: [...defaultSlateConverters, MyCustomConverter],
          }),
        ],
      }),
    },
  ],
}
```

#### Unknown Node Handling

If the migration encounters a Slate node without a converter, it:

1. Logs a warning to the console
2. Wraps it in an `unknownConverted` node that preserves the original data
3. Continues migration without failing

This ensures your migration completes even if some converters are missing, allowing you to handle edge cases later.

<Banner type="info">
  The migration script automatically traverses all collections and fields, retrieves converters from the `SlateToLexicalFeature` on each field, and converts the data using those converters.

If you're manually calling `convertSlateToLexical`, you can pass converters directly:

```ts
import { convertSlateToLexical } from '@payloadcms/richtext-lexical/migrate'

const lexicalData = convertSlateToLexical({
  slateData: mySlateData,
  converters: [...defaultSlateConverters, MyCustomConverter],
})
```

</Banner>
## Migrating lexical data from old version to new version

Each lexical node has a `version` property which is saved in the database. Every time we make a breaking change to the node's data, we increment the version. This way, we can detect an old version and automatically convert old data to the new format once you open up the editor.

The problem is, this migration only happens when you open the editor, modify the richText field (so that the field's `setValue` function is called) and save the document. Until you do that for all documents, some documents will still have the old data.

To solve this, we export an `upgradeLexicalData` function which goes through every single document in your Payload app and re-saves it, if it has a lexical editor. This way, the data is automatically converted to the new format, and that automatic conversion gets applied to every single document in your app.

IMPORTANT: Take a backup of your entire database. If anything goes wrong and you do not have a backup, you are on your own and will not receive any support.

```ts
import { upgradeLexicalData } from '@payloadcms/richtext-lexical'

await upgradeLexicalData({ payload })
```

## Migrating from payload-plugin-lexical

Migrating from [payload-plugin-lexical](https://github.com/AlessioGr/payload-plugin-lexical) works similar to migrating from Slate.

Instead of a `SlateToLexicalFeature` there is a `LexicalPluginToLexicalFeature` you can use. And instead of `convertSlateToLexical` you can use `convertLexicalPluginToLexical`.
```

--------------------------------------------------------------------------------

---[FILE: official-features.mdx]---
Location: payload-main/docs/rich-text/official-features.mdx

```text
---
description: Features officially maintained by Payload.
keywords: lexical, rich text, editor, headless cms, official, features
label: Official Features
order: 35
title: Official Features
---

Below are all the Rich Text Features Payload offers. Everything is customizable; you can [create your own features](/docs/rich-text/custom-features), modify ours and share them with the community.

## Features Overview

| Feature Name                    | Included by default | Description                                                                                                                                                                         |
| ------------------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`BoldFeature`**               | Yes                 | Adds support for bold text formatting.                                                                                                                                              |
| **`ItalicFeature`**             | Yes                 | Adds support for italic text formatting.                                                                                                                                            |
| **`UnderlineFeature`**          | Yes                 | Adds support for underlined text formatting.                                                                                                                                        |
| **`StrikethroughFeature`**      | Yes                 | Adds support for strikethrough text formatting.                                                                                                                                     |
| **`SubscriptFeature`**          | Yes                 | Adds support for subscript text formatting.                                                                                                                                         |
| **`SuperscriptFeature`**        | Yes                 | Adds support for superscript text formatting.                                                                                                                                       |
| **`InlineCodeFeature`**         | Yes                 | Adds support for inline code formatting.                                                                                                                                            |
| **`ParagraphFeature`**          | Yes                 | Provides entries in both the slash menu and toolbar dropdown for explicit paragraph creation or conversion.                                                                         |
| **`HeadingFeature`**            | Yes                 | Adds Heading Nodes (by default, H1 - H6, but that can be customized)                                                                                                                |
| **`AlignFeature`**              | Yes                 | Adds support for text alignment (left, center, right, justify)                                                                                                                      |
| **`IndentFeature`**             | Yes                 | Adds support for text indentation with toolbar buttons                                                                                                                              |
| **`UnorderedListFeature`**      | Yes                 | Adds support for unordered lists (ul)                                                                                                                                               |
| **`OrderedListFeature`**        | Yes                 | Adds support for ordered lists (ol)                                                                                                                                                 |
| **`ChecklistFeature`**          | Yes                 | Adds support for interactive checklists                                                                                                                                             |
| **`LinkFeature`**               | Yes                 | Allows you to create internal and external links                                                                                                                                    |
| **`RelationshipFeature`**       | Yes                 | Allows you to create block-level (not inline) relationships to other documents                                                                                                      |
| **`BlockquoteFeature`**         | Yes                 | Allows you to create block-level quotes                                                                                                                                             |
| **`UploadFeature`**             | Yes                 | Allows you to create block-level upload nodes - this supports all kinds of uploads, not just images                                                                                 |
| **`HorizontalRuleFeature`**     | Yes                 | Adds support for horizontal rules / separators. Basically displays an `<hr>` element                                                                                                |
| **`InlineToolbarFeature`**      | Yes                 | Provides a floating toolbar which appears when you select text. This toolbar only contains actions relevant for selected text                                                       |
| **`FixedToolbarFeature`**       | No                  | Provides a persistent toolbar pinned to the top and always visible. Both inline and fixed toolbars can be enabled at the same time.                                                 |
| **`BlocksFeature`**             | No                  | Allows you to use Payload's [Blocks Field](../fields/blocks) directly inside your editor. In the feature props, you can specify the allowed blocks - just like in the Blocks field. |
| **`TreeViewFeature`**           | No                  | Provides a debug box under the editor, which allows you to see the current editor state live, the dom, as well as time travel. Very useful for debugging                            |
| **`EXPERIMENTAL_TableFeature`** | No                  | Adds support for tables. This feature may be removed or receive breaking changes in the future - even within a stable lexical release, without needing a major release.             |
| **`TextStateFeature`**          | No                  | Allows you to store key-value attributes within TextNodes and assign them inline styles.                                                                                            |

## In depth

### BoldFeature

- Description: Adds support for bold text formatting, along with buttons to apply it in both fixed and inline toolbars.
- Included by default: Yes
- Markdown Support: `**bold**` or `__bold__`
- Keyboard Shortcut: Ctrl/Cmd + B

### ItalicFeature

- Description: Adds support for italic text formatting, along with buttons to apply it in both fixed and inline toolbars.
- Included by default: Yes
- Markdown Support: `*italic*` or `_italic_`
- Keyboard Shortcut: Ctrl/Cmd + I

### UnderlineFeature

- Description: Adds support for underlined text formatting, along with buttons to apply it in both fixed and inline toolbars.
- Included by default: Yes
- Keyboard Shortcut: Ctrl/Cmd + U

### StrikethroughFeature

- Description: Adds support for strikethrough text formatting, along with buttons to apply it in both fixed and inline toolbars.
- Included by default: Yes
- Markdown Support: `~~strikethrough~~`

### SubscriptFeature

- Description: Adds support for subscript text formatting, along with buttons to apply it in both fixed and inline toolbars.
- Included by default: Yes

### SuperscriptFeature

- Description: Adds support for superscript text formatting, along with buttons to apply it in both fixed and inline toolbars.
- Included by default: Yes

### InlineCodeFeature

- Description: Adds support for inline code formatting with distinct styling, along with buttons to apply it in both fixed and inline toolbars.
- Included by default: Yes
- Markdown Support: \`code\`

### ParagraphFeature

- Description: Provides entries in both the slash menu and toolbar dropdown for explicit paragraph creation or conversion.
- Included by default: Yes

### HeadingFeature

- Description: Adds support for heading nodes (H1-H6) with toolbar dropdown and slash menu entries for each enabled heading size.
- Included by default: Yes
- Markdown Support: `#`, `##`, `###`, ..., at start of line.
- Types:

```ts
type HeadingFeatureProps = {
  enabledHeadingSizes?: HeadingTagType[] // ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
}
```

- Usage example:

```ts
HeadingFeature({
  enabledHeadingSizes: ['h1', 'h2', 'h3'], // Default: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
})
```

### AlignFeature

- Description: Allows text alignment (left, center, right, justify), along with buttons to apply it in both fixed and inline toolbars.
- Included by default: Yes
- Keyboard Shortcut: Ctrl/Cmd + Shift + L/E/R/J (left/center/right/justify)

### IndentFeature

- Description: Adds support for text indentation, along with buttons to apply it in both fixed and inline toolbars.
- Included by default: Yes
- Keyboard Shortcut: Tab (increase), Shift + Tab (decrease)
- Types:

```ts
type IndentFeatureProps = {
  /**
   * The nodes that should not be indented. "type"
   * property of the nodes you don't want to be indented.
   * These can be: "paragraph", "heading", "listitem",
   * "quote" or other indentable nodes if they exist.
   */
  disabledNodes?: string[]
  /**
   * If true, pressing Tab in the middle of a block such
   * as a paragraph or heading will not insert a tabNode.
   * Instead, Tab will only be used for block-level indentation.
   * @default false
   */
  disableTabNode?: boolean
}
```

- Usage example:

```ts
// Allow block-level indentation only
IndentFeature({
  disableTabNode: true,
})
```

### UnorderedListFeature

- Description: Adds support for unordered lists (bullet points) with toolbar dropdown and slash menu entries.
- Included by default: Yes
- Markdown Support: `-`, `*`, or `+` at start of line

### OrderedListFeature

- Description: Adds support for ordered lists (numbered lists) with toolbar dropdown and slash menu entries.
- Included by default: Yes
- Markdown Support: `1.` at start of line

### ChecklistFeature

- Description: Adds support for interactive checklists with toolbar dropdown and slash menu entries.
- Included by default: Yes
- Markdown Support: `- [ ]` (unchecked) or `- [x]` (checked)

### LinkFeature

- Description: Allows creation of internal and external links with toolbar buttons and automatic URL conversion.
- Included by default: Yes
- Markdown Support: `[anchor](url)`
- Types:

```ts
type LinkFeatureServerProps = {
  /**
   * Disables the automatic creation of links
   * from URLs typed or pasted into the editor,
   * @default false
   */
  disableAutoLinks?: 'creationOnly' | true
  /**
   * A function or array defining additional
   * fields for the link feature.
   * These will be displayed in the link editor drawer.
   */
  fields?:
    | ((args: {
        config: SanitizedConfig
        defaultFields: FieldAffectingData[]
      }) => (Field | FieldAffectingData)[])
    | Field[]
  /**
   * Sets a maximum population depth for the internal
   * doc default field of link, regardless of the
   * remaining depth when the field is reached.
   */
  maxDepth?: number
} & ExclusiveLinkCollectionsProps

type ExclusiveLinkCollectionsProps =
  | {
      disabledCollections?: CollectionSlug[]
      enabledCollections?: never
    }
  | {
      disabledCollections?: never
      enabledCollections?: CollectionSlug[]
    }
```

- Usage example:

```ts
LinkFeature({
  fields: ({ defaultFields }) => [
    ...defaultFields,
    {
      name: 'rel',
      type: 'select',
      options: ['noopener', 'noreferrer', 'nofollow'],
    },
  ],
  enabledCollections: ['pages', 'posts'], // Collections for internal links
  maxDepth: 2, // Population depth for internal links
  disableAutoLinks: false, // Allow auto-conversion of URLs
})
```

### RelationshipFeature

- Description: Allows creation of block-level relationships to other documents with toolbar button and slash menu entry.
- Included by default: Yes
- Types:

```ts
type RelationshipFeatureProps = {
  /**
   * Sets a maximum population depth for this relationship,
   * regardless of the remaining depth when the respective
   * field is reached.
   */
  maxDepth?: number
} & ExclusiveRelationshipFeatureProps

type ExclusiveRelationshipFeatureProps =
  | {
      disabledCollections?: CollectionSlug[]
      enabledCollections?: never
    }
  | {
      disabledCollections?: never
      enabledCollections?: CollectionSlug[]
    }
```

- Usage example:

```ts
RelationshipFeature({
  disabledCollections: ['users'], // Collections to exclude
  maxDepth: 2, // Population depth for relationships
})
```

### UploadFeature

- Description: Allows creation of upload/media nodes with toolbar button and slash menu entry, supports all file types.
- Included by default: Yes
- Types:

```ts
type UploadFeatureProps = {
  collections?: {
    [collection: UploadCollectionSlug]: {
      fields: Field[]
    }
  }
  /**
   * Sets a maximum population depth for this upload (not the fields for this upload), regardless of the remaining depth when the respective field is reached.
   * This behaves exactly like the maxDepth properties of relationship and upload fields.
   *
   * {@link https://payloadcms.com/docs/getting-started/concepts#field-level-max-depth}
   */
  maxDepth?: number
} & ExclusiveUploadFeatureProps

type ExclusiveUploadFeatureProps =
  | {
      /**
       * The collections that should be disabled. Overrides the `enableRichTextRelationship` property in the collection config.
       * When this property is set, `enabledCollections` will not be available.
       **/
      disabledCollections?: UploadCollectionSlug[]

      // Ensures that enabledCollections is not available when disabledCollections is set
      enabledCollections?: never
    }
  | {
      // Ensures that disabledCollections is not available when enabledCollections is set
      disabledCollections?: never

      /**
       * The collections that should be enabled. Overrides the `enableRichTextRelationship` property in the collection config
       * When this property is set, `disabledCollections` will not be available.
       **/
      enabledCollections?: UploadCollectionSlug[]
    }
```

- Usage example:

```ts
UploadFeature({
  collections: {
    uploads: {
      fields: [
        {
          name: 'caption',
          type: 'text',
          label: 'Caption',
        },
        {
          name: 'alt',
          type: 'text',
          label: 'Alt Text',
        },
      ],
    },
  },
  maxDepth: 1, // Population depth for uploads
  disabledCollections: ['specialUploads'], // Collections to exclude
})
```

### BlockquoteFeature

- Description: Allows creation of blockquotes with toolbar button and slash menu entry.
- Included by default: Yes
- Markdown Support: `> quote text`

### HorizontalRuleFeature

- Description: Adds support for horizontal rules/separators with toolbar button and slash menu entry.
- Included by default: Yes
- Markdown Support: `---`

### InlineToolbarFeature

- Description: Provides a floating toolbar that appears when text is selected, containing formatting options relevant to selected text.
- Included by default: Yes

### FixedToolbarFeature

- Description: Provides a persistent toolbar pinned to the top of the editor that's always visible.
- Included by default: No
- Types:

```ts
type FixedToolbarFeatureProps = {
  /**
   * @default false
   * If this is enabled, the toolbar will apply
   * to the focused editor, not the editor with
   * the FixedToolbarFeature.
   */
  applyToFocusedEditor?: boolean
  /**
   * Custom configurations for toolbar groups
   * Key is the group key (e.g. 'format', 'indent', 'align')
   * Value is a partial ToolbarGroup object that will
   * be merged with the default configuration
   */
  customGroups?: CustomGroups
  /**
   * @default false
   * If there is a parent editor with a fixed toolbar,
   * this will disable the toolbar for this editor.
   */
  disableIfParentHasFixedToolbar?: boolean
}
```

- Usage example:

```ts
FixedToolbarFeature({
  applyToFocusedEditor: false, // Apply to focused editor
  customGroups: {
    format: {
      // Custom configuration for format group
    },
  },
})
```

### BlocksFeature

- Description: Allows use of Payload's Blocks Field directly in the editor with toolbar buttons and slash menu entries for each block type.
- Included by default: No
- Types:

```ts
type BlocksFeatureProps = {
  blocks?: (Block | BlockSlug)[] | Block[]
  inlineBlocks?: (Block | BlockSlug)[] | Block[]
}
```

- Usage example:

```ts
BlocksFeature({
  blocks: [
    {
      slug: 'callout',
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
  inlineBlocks: [
    {
      slug: 'mention',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
})
```

#### Code Blocks

Payload exports a premade CodeBlock that you can import and use in your project. It supports syntax highlighting, dynamically selecting the language and loading in external type definitions:

```ts
import { BlocksFeature, CodeBlock } from '@payloadcms/richtext-lexical'

// ...
BlocksFeature({
  blocks: [
    CodeBlock({
      defaultLanguage: 'ts',
      languages: {
        js: 'JavaScript',
        plaintext: 'Plain Text',
        ts: 'TypeScript',
      },
    }),
  ],
}),
// ...
```

When using TypeScript, you can also pass in additional type definitions that will be available in the editor. Here's an example of how to make `payload` and `react` available in the editor:

```ts
import { BlocksFeature, CodeBlock } from '@payloadcms/richtext-lexical'

// ...
BlocksFeature({
  blocks: [
    CodeBlock({
      slug: 'PayloadCode',
      languages: {
        ts: 'TypeScript',
      },
      typescript: {
        fetchTypes: [
          {
            // The index.bundled.d.ts contains all the types for Payload in one file, so that Monaco doesn't need to fetch multiple files.
            // This file may be removed in the future and is not guaranteed to be available in future versions of Payload.
            url: 'https://unpkg.com/payload@3.59.0-internal.8435f3c/dist/index.bundled.d.ts',
            filePath: 'file:///node_modules/payload/index.d.ts',
          },
          {
            url: 'https://unpkg.com/@types/react@19.1.17/index.d.ts',
            filePath: 'file:///node_modules/@types/react/index.d.ts',
          },
        ],
        paths: {
          payload: ['file:///node_modules/payload/index.d.ts'],
          react: ['file:///node_modules/@types/react/index.d.ts'],
        },
        typeRoots: ['node_modules/@types', 'node_modules/payload'],
        // Enable type checking. By default, only syntax checking is enabled.
        enableSemanticValidation: true,
      },
    }),
  ],
}),
// ...
```

### TreeViewFeature

- Description: Provides a debug panel below the editor showing the editor's internal state, DOM tree, and time travel debugging.
- Included by default: No

### EXPERIMENTAL_TableFeature

- Description: Adds support for tables with toolbar button and slash menu entry for creation and editing.
- Included by default: No

### TextStateFeature

- Description: Allows storing key-value attributes in text nodes with inline styles and toolbar dropdown for style selection.
- Included by default: No
- Types:

```ts
type TextStateFeatureProps = {
  /**
   * The keys of the top-level object (stateKeys) represent the attributes that the textNode can have (e.g., color).
   * The values of the top-level object (stateValues) represent the values that the attribute can have (e.g., red, blue, etc.).
   * Within the stateValue, you can define inline styles and labels.
   */
  state: { [stateKey: string]: StateValues }
}

type StateValues = {
  [stateValue: string]: {
    css: StyleObject
    label: string
  }
}

type StyleObject = {
  [K in keyof PropertiesHyphenFallback]?:
    | Extract<PropertiesHyphenFallback[K], string>
    | undefined
}
```

- Usage example:

```ts
// We offer default colors that have good contrast and look good in dark and light mode.
import { defaultColors, TextStateFeature } from '@payloadcms/richtext-lexical'

TextStateFeature({
  // prettier-ignore
  state: {
    color: {
      ...defaultColors,
      // fancy gradients!
      galaxy: { label: 'Galaxy', css: { background: 'linear-gradient(to right, #0000ff, #ff0000)', color: 'white' } },
      sunset: { label: 'Sunset', css: { background: 'linear-gradient(to top, #ff5f6d, #6a3093)' } },
    },
    // You can have both colored and underlined text at the same time.
    // If you don't want that, you should group them within the same key.
    // (just like I did with defaultColors and my fancy gradients)
    underline: {
      'solid': { label: 'Solid', css: { 'text-decoration': 'underline', 'text-underline-offset': '4px' } },
       // You'll probably want to use the CSS light-dark() utility.
      'yellow-dashed': { label: 'Yellow Dashed', css: { 'text-decoration': 'underline dashed', 'text-decoration-color': 'light-dark(#EAB308,yellow)', 'text-underline-offset': '4px' } },
    },
  },
}),
```

This is what the example above will look like:

<LightDarkImage
  srcDark="https://payloadcms.com/images/docs/text-state-feature.png"
  srcLight="https://payloadcms.com/images/docs/text-state-feature.png"
  alt="Example usage in light and dark mode for TextStateFeature with defaultColors and some custom styles"
/>
```

--------------------------------------------------------------------------------

````
