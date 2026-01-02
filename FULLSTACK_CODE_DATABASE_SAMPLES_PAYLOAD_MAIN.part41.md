---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 41
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 41 of 695)

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

---[FILE: textarea.mdx]---
Location: payload-main/docs/fields/textarea.mdx

```text
---
title: Textarea Field
label: Textarea
order: 190
desc: Textarea field types save a string to the database, similar to the Text field type but equipped for longer text. Learn how to use Textarea fields, see examples and options.
keywords: textarea, fields, config, configuration, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

The Textarea Field is nearly identical to the [Text Field](./text) but it features a slightly larger input that is better suited to edit longer text.

<LightDarkImage
  srcLight="https://payloadcms.com/images/docs/fields/textarea.png"
  srcDark="https://payloadcms.com/images/docs/fields/textarea-dark.png"
  alt="Shows a textarea field and read-only textarea field in the Payload Admin Panel"
  caption="Admin Panel screenshot of a Textarea field and read-only Textarea field"
/>

To add a Textarea Field, set the `type` to `textarea` in your [Field Config](./overview):

```ts
import type { Field } from 'payload'

export const MyTextareaField: Field = {
  // ...
  type: 'textarea', // highlight-line
}
```

## Config Options

| Option                 | Description                                                                                                                                                                                                                                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`name`** \*          | To be used as the property name when stored and retrieved from the database. [More details](/docs/fields/overview#field-names).                                                                                                                                                                         |
| **`label`**            | Text used as a field label in the Admin Panel or an object with keys for each language.                                                                                                                                                                                                                 |
| **`unique`**           | Enforce that each entry in the Collection has a unique value for this field.                                                                                                                                                                                                                            |
| **`minLength`**        | Used by the default validation function to ensure values are of a minimum character length.                                                                                                                                                                                                             |
| **`maxLength`**        | Used by the default validation function to ensure values are of a maximum character length.                                                                                                                                                                                                             |
| **`validate`**         | Provide a custom validation function that will be executed on both the Admin Panel and the backend. [More details](/docs/fields/overview#validation).                                                                                                                                                   |
| **`index`**            | Build an [index](../database/indexes) for this field to produce faster queries. Set this field to `true` if your users will perform queries on this field's data often.                                                                                                                                 |
| **`saveToJWT`**        | If this field is top-level and nested in a config supporting [Authentication](/docs/authentication/overview), include its data in the user JWT.                                                                                                                                                         |
| **`hooks`**            | Provide Field Hooks to control logic for this field. [More details](../hooks/fields).                                                                                                                                                                                                                   |
| **`access`**           | Provide Field Access Control to denote what users can see and do with this field's data. [More details](../access-control/fields).                                                                                                                                                                      |
| **`hidden`**           | Restrict this field's visibility from all APIs entirely. Will still be saved to the database, but will not appear in any API or the Admin Panel.                                                                                                                                                        |
| **`defaultValue`**     | Provide data to be used for this field's default value. [More details](/docs/fields/overview#default-values).                                                                                                                                                                                           |
| **`localized`**        | Enable localization for this field. Requires [localization to be enabled](/docs/configuration/localization) in the Base config.                                                                                                                                                                         |
| **`required`**         | Require this field to have a value.                                                                                                                                                                                                                                                                     |
| **`admin`**            | Admin-specific configuration. [More details](#admin-options).                                                                                                                                                                                                                                           |
| **`custom`**           | Extension point for adding custom data (e.g. for plugins)                                                                                                                                                                                                                                               |
| **`typescriptSchema`** | Override field type generation with providing a JSON schema                                                                                                                                                                                                                                             |
| **`virtual`**          | Provide `true` to disable field in the database, or provide a string path to [link the field with a relationship](/docs/fields/relationship#linking-virtual-fields-with-relationships). See [Virtual Fields](https://payloadcms.com/blog/learn-how-virtual-fields-can-help-solve-common-cms-challenges) |

_\* An asterisk denotes that a property is required._

## Admin Options

To customize the appearance and behavior of the Textarea Field in the [Admin Panel](../admin/overview), you can use the `admin` option:

```ts
import type { Field } from 'payload'

export const MyTextareaField: Field = {
  // ...
  admin: {
    // highlight-line
    // ...
  },
}
```

The Textarea Field inherits all of the default admin options from the base [Field Admin Config](./overview#admin-options), plus the following additional options:

| Option             | Description                                                                                                                 |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| **`placeholder`**  | Set this property to define a placeholder string in the textarea.                                                           |
| **`autoComplete`** | Set this property to a string that will be used for browser autocomplete.                                                   |
| **`rows`**         | Set the number of visible text rows in the textarea. Defaults to `2` if not specified.                                      |
| **`rtl`**          | Override the default text direction of the Admin Panel for this field. Set to `true` to force right-to-left text direction. |

## Example

```ts
import type { CollectionConfig } from 'payload'

export const ExampleCollection: CollectionConfig = {
  slug: 'example-collection',
  fields: [
    {
      name: 'metaDescription', // required
      type: 'textarea', // required
      required: true,
    },
  ],
}
```

## Custom Components

### Field

#### Server Component

```tsx
import type React from 'react'
import { TextareaField } from '@payloadcms/ui'
import type { TextareaFieldServerComponent } from 'payload'

export const CustomTextareaFieldServer: TextareaFieldServerComponent = ({
  clientField,
  path,
  schemaPath,
  permissions,
}) => {
  return (
    <TextareaField
      field={clientField}
      path={path}
      schemaPath={schemaPath}
      permissions={permissions}
    />
  )
}
```

#### Client Component

```tsx
'use client'
import React from 'react'
import { TextareaField } from '@payloadcms/ui'
import type { TextareaFieldClientComponent } from 'payload'

export const CustomTextareaFieldClient: TextareaFieldClientComponent = (
  props,
) => {
  return <TextareaField {...props} />
}
```

### Label

#### Server Component

```tsx
import React from 'react'
import { FieldLabel } from '@payloadcms/ui'
import type { TextareaFieldLabelServerComponent } from 'payload'

export const CustomTextareaFieldLabelServer: TextareaFieldLabelServerComponent =
  ({ clientField, path }) => {
    return (
      <FieldLabel
        label={clientField?.label || clientField?.name}
        path={path}
        required={clientField?.required}
      />
    )
  }
```

#### Client Component

```tsx
'use client'
import React from 'react'
import { FieldLabel } from '@payloadcms/ui'
import type { TextareaFieldLabelClientComponent } from 'payload'

export const CustomTextareaFieldLabelClient: TextareaFieldLabelClientComponent =
  ({ field, path }) => {
    return (
      <FieldLabel
        label={field?.label || field?.name}
        path={path}
        required={field?.required}
      />
    )
  }
```
```

--------------------------------------------------------------------------------

---[FILE: ui.mdx]---
Location: payload-main/docs/fields/ui.mdx

```text
---
title: UI Field
label: UI
order: 200
desc: UI fields are purely presentational and allow developers to customize the Admin Panel to a very fine degree, including adding actions and other functions.
keywords: custom field, react component, fields, config, configuration, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

The UI (user interface) Field gives you a ton of power to add your own React components directly into the [Admin Panel](../admin/overview), nested directly within your other fields. It has absolutely no effect on the data of your documents. It is presentational-only. Think of it as a way for you to "plug in" your own React components directly within your other fields, so you can provide your editors with new controls exactly where you want them to go.

With the UI Field, you can:

- Add a custom message or block of text within the body of an Edit View to describe the purpose of surrounding fields
- Add a "Refund" button to an Order's Edit View sidebar, which might make a fetch call to a custom `refund` endpoint
- Add a "view page" button into a Pages List View to give editors a shortcut to view a page on the frontend of the site
- Build a "clear cache" button or similar mechanism to manually clear caches of specific documents

To add a UI Field, set the `type` to `ui` in your [Field Config](./overview):

```ts
import type { Field } from 'payload'

export const MyUIField: Field = {
  // ...
  type: 'ui', // highlight-line
}
```

## Config Options

| Option                          | Description                                                                                                |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **`name`** \*                   | A unique identifier for this field.                                                                        |
| **`label`**                     | Human-readable label for this UI field.                                                                    |
| **`admin.components.Field`** \* | React component to be rendered for this field within the Edit View. [More details](./overview#field).      |
| **`admin.components.Cell`**     | React component to be rendered as a Cell within collection List views. [More details](./overview#cell).    |
| **`admin.disableListColumn`**   | Set `disableListColumn` to `true` to prevent the UI field from appearing in the list view column selector. |
| **`custom`**                    | Extension point for adding custom data (e.g. for plugins)                                                  |

_\* An asterisk denotes that a property is required._

## Example

```ts
import type { CollectionConfig } from 'payload'

export const ExampleCollection: CollectionConfig = {
  slug: 'example-collection',
  fields: [
    {
      name: 'myCustomUIField', // required
      type: 'ui', // required
      admin: {
        components: {
          Field: '/path/to/MyCustomUIField',
          Cell: '/path/to/MyCustomUICell',
        },
      },
    },
  ],
}
```
```

--------------------------------------------------------------------------------

---[FILE: upload.mdx]---
Location: payload-main/docs/fields/upload.mdx

```text
---
title: Upload Field
label: Upload
order: 210
desc: Upload fields will allow a file to be uploaded, only from a collection supporting Uploads. Learn how to use Upload fields, see examples and options.
keywords: upload, images media, fields, config, configuration, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

The Upload Field allows for the selection of a Document from a Collection supporting [Uploads](../upload/overview), and
formats the selection as a thumbnail in the Admin Panel.

Upload fields are useful for a variety of use cases, such as:

- To provide a `Page` with a featured image
- To allow for a `Product` to deliver a downloadable asset like PDF or MP3
- To give a layout building block the ability to feature a background image

<LightDarkImage
  srcLight="https://payloadcms.com/images/docs/fields/upload.png"
  srcDark="https://payloadcms.com/images/docs/fields/upload-dark.png"
  alt="Shows an upload field in the Payload Admin Panel"
  caption="Admin Panel screenshot of an Upload field"
/>

To create an Upload Field, set the `type` to `upload` in your [Field Config](./overview):

```ts
import type { Field } from 'payload'

export const MyUploadField: Field = {
  // ...
  // highlight-start
  type: 'upload',
  relationTo: 'media',
  // highlight-end
}
```

<Banner type="warning">
  **Important:** To use the Upload Field, you must have a
  [Collection](../configuration/collections) configured to allow
  [Uploads](../upload/overview).
</Banner>

## Config Options

| Option                 | Description                                                                                                                                                                                                                                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`name`** \*          | To be used as the property name when stored and retrieved from the database. [More details](/docs/fields/overview#field-names).                                                                                                                                                                         |
| **`relationTo`** \*    | Provide a single collection `slug` or an array of slugs to allow this field to accept a relation to. **Note: the related collections must be configured to support Uploads.**                                                                                                                           |
| **`filterOptions`**    | A query to filter which options appear in the UI and validate against. [More details](#filtering-upload-options).                                                                                                                                                                                       |
| **`hasMany`**          | Boolean which, if set to true, allows this field to have many relations instead of only one.                                                                                                                                                                                                            |
| **`minRows`**          | A number for the fewest allowed items during validation when a value is present. Used with hasMany.                                                                                                                                                                                                     |
| **`maxRows`**          | A number for the most allowed items during validation when a value is present. Used with hasMany.                                                                                                                                                                                                       |
| **`maxDepth`**         | Sets a number limit on iterations of related documents to populate when queried. [Depth](../queries/depth)                                                                                                                                                                                              |
| **`label`**            | Text used as a field label in the Admin Panel or an object with keys for each language.                                                                                                                                                                                                                 |
| **`unique`**           | Enforce that each entry in the Collection has a unique value for this field.                                                                                                                                                                                                                            |
| **`validate`**         | Provide a custom validation function that will be executed on both the Admin Panel and the backend. [More details](/docs/fields/overview#validation).                                                                                                                                                   |
| **`index`**            | Build an [index](../database/indexes) for this field to produce faster queries. Set this field to `true` if your users will perform queries on this field's data often.                                                                                                                                 |
| **`saveToJWT`**        | If this field is top-level and nested in a config supporting [Authentication](/docs/authentication/overview), include its data in the user JWT.                                                                                                                                                         |
| **`hooks`**            | Provide Field Hooks to control logic for this field. [More details](../hooks/fields).                                                                                                                                                                                                                   |
| **`access`**           | Provide Field Access Control to denote what users can see and do with this field's data. [More details](../access-control/fields).                                                                                                                                                                      |
| **`hidden`**           | Restrict this field's visibility from all APIs entirely. Will still be saved to the database, but will not appear in any API or the Admin Panel.                                                                                                                                                        |
| **`defaultValue`**     | Provide data to be used for this field's default value. [More details](/docs/fields/overview#default-values).                                                                                                                                                                                           |
| **`displayPreview`**   | Enable displaying preview of the uploaded file. Overrides related Collection's `displayPreview` option. [More details](/docs/upload/overview#collection-upload-options).                                                                                                                                |
| **`localized`**        | Enable localization for this field. Requires [localization to be enabled](/docs/configuration/localization) in the Base config.                                                                                                                                                                         |
| **`required`**         | Require this field to have a value.                                                                                                                                                                                                                                                                     |
| **`admin`**            | Admin-specific configuration. [Admin Options](./overview#admin-options).                                                                                                                                                                                                                                |
| **`custom`**           | Extension point for adding custom data (e.g. for plugins)                                                                                                                                                                                                                                               |
| **`typescriptSchema`** | Override field type generation with providing a JSON schema                                                                                                                                                                                                                                             |
| **`virtual`**          | Provide `true` to disable field in the database, or provide a string path to [link the field with a relationship](/docs/fields/relationship#linking-virtual-fields-with-relationships). See [Virtual Fields](https://payloadcms.com/blog/learn-how-virtual-fields-can-help-solve-common-cms-challenges) |
| **`graphQL`**          | Custom graphQL configuration for the field. [More details](/docs/graphql/overview#field-complexity)                                                                                                                                                                                                     |

_\* An asterisk denotes that a property is required._

## Example

```ts
import type { CollectionConfig } from 'payload'

export const ExampleCollection: CollectionConfig = {
  slug: 'example-collection',
  fields: [
    {
      name: 'backgroundImage', // required
      type: 'upload', // required
      relationTo: 'media', // required
      required: true,
    },
  ],
}
```

## Filtering upload options

Options can be dynamically limited by supplying a [query constraint](/docs/queries/overview), which will be used both
for validating input and filtering available uploads in the UI.

The `filterOptions` property can either be a `Where` query, or a function returning `true` to not filter, `false` to
prevent all, or a `Where` query. When using a function, it will be
called with an argument object with the following properties:

| Property      | Description                                                                                           |
| ------------- | ----------------------------------------------------------------------------------------------------- |
| `relationTo`  | The collection `slug` to filter against, limited to this field's `relationTo` property                |
| `data`        | An object containing the full collection or global document currently being edited                    |
| `siblingData` | An object containing document data that is scoped to only fields within the same parent of this field |
| `id`          | The `id` of the current document being edited. `id` is `undefined` during the `create` operation      |
| `user`        | An object containing the currently authenticated user                                                 |
| `req`         | The Payload Request, which contains references to `payload`, `user`, `locale`, and more.              |

### Example#filter-options-example

```ts
const uploadField = {
  name: 'image',
  type: 'upload',
  relationTo: 'media',
  filterOptions: {
    mimeType: { contains: 'image' },
  },
}
```

You can learn more about writing queries [here](/docs/queries/overview).

<Banner type="warning">
  **Note:**

When an upload field has both **filterOptions** and a custom
**validate** function, the api will not validate **filterOptions**
unless you call the default upload field validation function imported from
**payload/shared** in your validate function.

</Banner>

## Bi-directional relationships

The `upload` field on its own is used to reference documents in an upload collection. This can be considered a "one-way"
relationship. If you wish to allow an editor to visit the upload document and see where it is being used, you may use
the `join` field in the upload enabled collection. Read more about bi-directional relationships using
the [Join field](./join)

## Polymorphic Uploads

Upload fields can reference multiple upload collections by providing an array of collection slugs to the `relationTo` property.

```ts
import type { CollectionConfig } from 'payload'

export const ExampleCollection: CollectionConfig = {
  slug: 'example-collection',
  fields: [
    {
      name: 'media',
      type: 'upload',
      relationTo: ['images', 'documents', 'videos'], // references multiple upload collections
    },
  ],
}
```

This can be combined with the `hasMany` property to allow multiple uploads from multiple collections.

```ts
import type { CollectionConfig } from 'payload'

export const ExampleCollection: CollectionConfig = {
  slug: 'example-collection',
  fields: [
    {
      name: 'media',
      type: 'upload',
      relationTo: ['images', 'documents', 'videos'], // references multiple upload collections
      hasMany: true, // allows multiple uploads
    },
  ],
}
```
```

--------------------------------------------------------------------------------

---[FILE: overview.mdx]---
Location: payload-main/docs/folders/overview.mdx

```text
---
title: Folders
label: Overview
order: 10
desc: Folders allow you to group documents across collections, and are a great way to organize your content.
keywords: folders, folder, content organization
---

Folders allow you to group documents across collections, and are a great way to organize your content. Folders are built on top of relationship fields, when you enable folders on a collection, Payload adds a hidden relationship field `folders`, that relates to a folder — or no folder. Folders also have the `folder` field, allowing folders to be nested within other folders.

The configuration for folders is done in two places, the collection config and the Payload config. The collection config is where you enable folders, and the Payload config is where you configure the global folder settings.

<Banner type="warning">
  **Note:** The Folders feature is currently in beta and may be subject to
  change in minor versions updates prior to being stable.
</Banner>

## Folder Configuration

On the payload config, you can configure the following settings under the `folders` property:

```ts
// Type definition

type RootFoldersConfiguration = {
  /**
   * If true, the browse by folder view will be enabled
   *
   * @default true
   */
  browseByFolder?: boolean
  /**
   * An array of functions to be ran when the folder collection is initialized
   * This allows plugins to modify the collection configuration
   */
  collectionOverrides?: (({
    collection,
  }: {
    collection: CollectionConfig
  }) => CollectionConfig | Promise<CollectionConfig>)[]
  /**
   * Ability to view hidden fields and collections related to folders
   *
   * @default false
   */
  debug?: boolean
  /**
   * The Folder field name
   *
   * @default "folder"
   */
  fieldName?: string
  /**
   * Slug for the folder collection
   *
   * @default "payload-folders"
   */
  slug?: string
}
```

```ts
// Example usage

import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  folders: {
    // highlight-start
    debug: true, // optional
    collectionOverrides: [
      async ({ collection }) => {
        return collection
      },
    ], // optional
    fieldName: 'folder', // optional
    slug: 'payload-folders', // optional
    // highlight-end
  },
})
```

## Collection Configuration

To enable folders on a collection, you need to set the `admin.folders` property to `true` on the collection config. This will add a hidden relationship field to the collection that relates to a folder — or no folder.

```ts
// Type definition

type CollectionFoldersConfiguration =
  | boolean
  | {
      /**
       * If true, the collection will be included in the browse by folder view
       *
       * @default true
       */
      browseByFolder?: boolean
    }
```

```ts
// Example usage

import { buildConfig } from 'payload'

const config = buildConfig({
  collections: [
    {
      slug: 'pages',
      // highlight-start
      folders: true, // defaults to false
      // highlight-end
    },
  ],
})
```
```

--------------------------------------------------------------------------------

---[FILE: concepts.mdx]---
Location: payload-main/docs/getting-started/concepts.mdx

```text
---
title: Payload Concepts
label: Concepts
order: 20
desc: Payload is based around a small and intuitive set of concepts. Key concepts include collections, globals, fields and more.
keywords: documentation, getting started, guide, Content Management System, cms, headless, javascript, node, react, nextjs
---

Payload is based around a small and intuitive set of high-level concepts. Before starting to work with Payload, it's a good idea to familiarize yourself with these concepts in order to establish a common language and understanding when discussing Payload.

## Config

The Payload Config is central to everything that Payload does. It allows for the deep configuration of your application through a simple and intuitive API. The Payload Config is a fully-typed JavaScript object that can be infinitely extended upon. [More details](../configuration/overview).

## Database

Payload is database agnostic, meaning you can use any type of database behind Payload's familiar APIs through what is known as a Database Adapter. [More details](../database/overview).

## Collections

A Collection is a group of records, called Documents, that all share a common schema. Each Collection is stored in the [Database](../database/overview) based on the [Fields](../fields/overview) that you define. [More details](../configuration/collections).

## Globals

Globals are in many ways similar to [Collections](../configuration/collections), except they correspond to only a single Document. Each Global is stored in the [Database](../database/overview) based on the [Fields](../fields/overview) that you define. [More details](../configuration/globals).

## Fields

Fields are the building blocks of Payload. They define the schema of the Documents that will be stored in the [Database](../database/overview), as well as automatically generate the corresponding UI within the Admin Panel. [More details](../fields/overview).

## Hooks

Hooks allow you to execute your own side effects during specific events of the Document lifecycle, such as before read, after create, etc. [More details](../hooks/overview).

## Authentication

Payload provides a secure, portable way to manage user accounts out of the box. Payload Authentication is designed to be used in both the Admin Panel, as well as your own external applications. [More details](../authentication/overview).

## Access Control

Access Control determines what a user can and cannot do with any given Document, such as read, update, etc., as well as what they can and cannot see within the Admin Panel. [More details](../access-control/overview).

## Admin Panel

Payload dynamically generates a beautiful, fully type-safe interface to manage your users and data. The Admin Panel is a React application built using the Next.js App Router. [More details](../admin/overview).

## Retrieving Data

Everything Payload does (create, read, update, delete, login, logout, etc.) is exposed to you via three APIs:

- [Local API](#local-api) - Extremely fast, direct-to-database access
- [REST API](#rest-api) - Standard HTTP endpoints for querying and mutating data
- [GraphQL](#graphql-api) - A full GraphQL API with a GraphQL Playground

<Banner type="success">
  **Note:** All of these APIs share the exact same query language. [More
  details](../queries/overview).
</Banner>

### Local API

By far one of the most powerful aspects of Payload is the fact that it gives you direct-to-database access to your data through the [Local API](../local-api/overview). It's _extremely_ fast and does not incur any typical HTTP overhead—you query your database directly in Node.js.

The Local API is written in TypeScript, and so it is strongly typed and extremely nice to use. It works anywhere on the server, including custom Next.js Routes, Payload Hooks, Payload Access Control, and React Server Components.

Here's a quick example of a React Server Component fetching data using the Local API:

```tsx
import React from 'react'
import config from '@payload-config'
import { getPayload } from 'payload'

const MyServerComponent: React.FC = () => {
  const payload = await getPayload({ config })

  // The `findResult` here will be fully typed as `PaginatedDocs<Page>`,
  // where you will have the `docs` that are returned as well as
  // information about how many items are returned / are available in total / etc
  const findResult = await payload.find({ collection: 'pages' })

  return (
    <ul>
      {findResult.docs.map((page) => {
        // Render whatever here!
        // The `page` is fully typed as your Pages collection!
      })}
    </ul>
  )
}
```

<Banner type="info">
  For more information about the Local API, [click here](../local-api/overview).
</Banner>

### REST API

By default, the Payload [REST API](../rest-api/overview) is mounted automatically for you at the `/api` path of your app.

For example, if you have a Collection called `pages`:

```ts
fetch('https://localhost:3000/api/pages') // highlight-line
  .then((res) => res.json())
  .then((data) => console.log(data))
```

<Banner type="info">
  For more information about the REST API, [click here](../rest-api/overview).
</Banner>

### GraphQL API

Payload automatically exposes GraphQL queries and mutations through a dedicated [GraphQL API](../graphql/overview). By default, the GraphQL route handler is mounted at the `/api/graphql` path of your app. You'll also find a full GraphQL Playground which can be accessible at the `/api/graphql-playground` path of your app.

You can use any GraphQL client with Payload's GraphQL endpoint. Here are a few packages:

- [`graphql-request`](https://www.npmjs.com/package/graphql-request) - a very lightweight GraphQL client
- [`@apollo/client`](https://www.apollographql.com/docs/react/api/core/ApolloClient/) - an industry-standard GraphQL client with lots of nice features

<Banner type="info">
  For more information about the GraphQL API, [click here](../graphql/overview).
</Banner>

## Package Structure

Payload is abstracted into a set of dedicated packages to keep the core `payload` package as lightweight as possible. This allows you to only install the parts of Payload based on your unique project requirements.

<Banner type="warning">
  **Important:** Version numbers of all official Payload packages are always
  published in sync. You should make sure that you always use matching versions
  for all official Payload packages.
</Banner>

`payload`

The `payload` package is where core business logic for Payload lives. You can think of Payload as an ORM with superpowers—it contains the logic for all Payload "operations" like `find`, `create`, `update`, and `delete` and exposes a [Local API](../local-api/overview). It executes [Access Control](../access-control/overview), [Hooks](../hooks/overview), [Validation](../fields/overview#validation), and more.

Payload itself is extremely compact, and can be used in any Node environment. As long as you have `payload` installed and you have access to your Payload Config, you can query and mutate your database directly without going through an unnecessary HTTP layer.

Payload also contains all TypeScript definitions, which can be imported from `payload` directly.

Here's how to import some common Payload types:

```ts
import { Config, CollectionConfig, GlobalConfig, Field } from 'payload'
```

`@payloadcms/next`

Whereas Payload itself is responsible for direct database access, and control over Payload business logic, the `@payloadcms/next` package is responsible for the Admin Panel and the entire HTTP layer that Payload exposes, including the [REST API](../rest-api/overview) and [GraphQL API](../graphql/overview).

`@payloadcms/graphql`

All of Payload's GraphQL functionality is abstracted into a separate package. Payload, its Admin UI, and REST API have absolutely no overlap with GraphQL, and you will incur no performance overhead from GraphQL if you are not using it. However, it's installed within the `@payloadcms/next` package so you don't have to install it manually. You do, however, need to have GraphQL installed separately in your `package.json` if you are using GraphQL.

`@payloadcms/ui`

This is the UI library that Payload's Admin Panel uses. All components are exported from this package and can be re-used as you build extensions to the Payload admin UI, or want to use Payload components in your own React apps. Some exports are server components and some are client components.

`@payloadcms/db-postgres`, `@payloadcms/db-vercel-postgres`, `@payloadcms/db-mongodb`, `@payloadcms/db-sqlite`

You can choose which Database Adapter you'd like to use for your project, and no matter which you choose, the entire data layer for Payload is contained within these packages. You can only use one at a time for any given project.

`@payloadcms/richtext-lexical`, `@payloadcms/richtext-slate`

Payload's Rich Text functionality is abstracted into separate packages and if you want to enable Rich Text in your project, you'll need to install one of these packages. We recommend Lexical for all new projects, and this is where Payload will focus its efforts on from this point, but Slate is still supported if you have already built with it.

<Banner type="info">
  **Note:** Rich Text is entirely optional and you may not need it for your
  project.
</Banner>
```

--------------------------------------------------------------------------------

````
