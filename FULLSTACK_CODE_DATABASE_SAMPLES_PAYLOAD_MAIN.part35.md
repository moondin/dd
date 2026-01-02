---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 35
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 35 of 695)

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

---[FILE: group.mdx]---
Location: payload-main/docs/fields/group.mdx

```text
---
title: Group Field
label: Group
order: 90
desc: The Group field allows other fields to be nested under a common property. Learn how to use Group fields, see examples and options.
keywords: group, fields, config, configuration, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

The Group Field allows [Fields](./overview) to be nested under a common property name. It also groups fields together visually in the [Admin Panel](../admin/overview).

<LightDarkImage
  srcLight="https://payloadcms.com/images/docs/fields/group.png"
  srcDark="https://payloadcms.com/images/docs/fields/group-dark.png"
  alt="Shows a Group field in the Payload Admin Panel"
  caption="Admin Panel screenshot of a Group field"
/>

To add a Group Field, set the `type` to `group` in your [Field Config](./overview):

```ts
import type { Field } from 'payload'

export const MyGroupField: Field = {
  // ...
  // highlight-start
  type: 'group',
  fields: [
    // ...
  ],
  // highlight-end
}
```

## Config Options

| Option                 | Description                                                                                                                                                                                                                                                                        |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`name`**             | To be used as the property name when stored and retrieved from the database. [More details](/docs/fields/overview#field-names).                                                                                                                                                    |
| **`fields`** \*        | Array of field types to nest within this Group.                                                                                                                                                                                                                                    |
| **`label`**            | Used as a heading in the Admin Panel and to name the generated GraphQL type. Defaults to the field name, if defined.                                                                                                                                                               |
| **`validate`**         | Provide a custom validation function that will be executed on both the Admin Panel and the backend. [More details](/docs/fields/overview#validation).                                                                                                                              |
| **`saveToJWT`**        | If this field is top-level and nested in a config supporting [Authentication](/docs/authentication/overview), include its data in the user JWT.                                                                                                                                    |
| **`hooks`**            | Provide Field Hooks to control logic for this field. [More details](../hooks/fields).                                                                                                                                                                                              |
| **`access`**           | Provide Field Access Control to denote what users can see and do with this field's data. [More details](../access-control/fields).                                                                                                                                                 |
| **`hidden`**           | Restrict this field's visibility from all APIs entirely. Will still be saved to the database, but will not appear in any API or the Admin Panel.                                                                                                                                   |
| **`defaultValue`**     | Provide an object of data to be used for this field's default value. [More details](/docs/fields/overview#default-values).                                                                                                                                                         |
| **`localized`**        | Enable localization for this field. Requires [localization to be enabled](/docs/configuration/localization) in the Base config. If enabled, a separate, localized set of all data within this Group will be kept, so there is no need to specify each nested field as `localized`. |
| **`admin`**            | Admin-specific configuration. [More details](#admin-options).                                                                                                                                                                                                                      |
| **`custom`**           | Extension point for adding custom data (e.g. for plugins)                                                                                                                                                                                                                          |
| **`interfaceName`**    | Create a top level, reusable [Typescript interface](/docs/typescript/generating-types#custom-field-interfaces) & [GraphQL type](/docs/graphql/graphql-schema#custom-field-schemas).                                                                                                |
| **`typescriptSchema`** | Override field type generation with providing a JSON schema                                                                                                                                                                                                                        |
| **`virtual`**          | Provide `true` to disable field in the database. See [Virtual Fields](https://payloadcms.com/blog/learn-how-virtual-fields-can-help-solve-common-cms-challenges)                                                                                                                   |

_\* An asterisk denotes that a property is required._

## Admin Options

To customize the appearance and behavior of the Group Field in the [Admin Panel](../admin/overview), you can use the `admin` option:

```ts
import type { Field } from 'payload'

export const MyGroupField: Field = {
  // ...
  admin: {
    // highlight-line
    // ...
  },
}
```

The Group Field inherits all of the default admin options from the base [Field Admin Config](./overview#admin-options), plus the following additional options:

| Option           | Description                                                                                                                                                                                                                                      |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`hideGutter`** | Set this property to `true` to hide this field's gutter within the Admin Panel. The field gutter is rendered as a vertical line and padding, but often if this field is nested within a Group, Block, or Array, you may want to hide the gutter. |

## Example

```ts
import type { CollectionConfig } from 'payload'

export const ExampleCollection: CollectionConfig = {
  slug: 'example-collection',
  fields: [
    {
      name: 'pageMeta',
      type: 'group', // required
      interfaceName: 'Meta', // optional
      fields: [
        // required
        {
          name: 'title',
          type: 'text',
          required: true,
          minLength: 20,
          maxLength: 100,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          minLength: 40,
          maxLength: 160,
        },
      ],
    },
  ],
}
```

## Presentational group fields

You can also use the Group field to only visually group fields without affecting the data structure. Not defining a `name` will render just the grouped fields (no nested object is created). If you want the group to appear as a titled section in the Admin UI, set a `label`.

```ts
import type { CollectionConfig } from 'payload'

export const ExampleCollection: CollectionConfig = {
  slug: 'example-collection',
  fields: [
    {
      label: 'Page meta', // label only → presentational
      type: 'group', // required
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          minLength: 20,
          maxLength: 100,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          minLength: 40,
          maxLength: 160,
        },
      ],
    },
  ],
}
```

## Named group

```ts
import type { CollectionConfig } from 'payload'

export const ExampleCollection: CollectionConfig = {
  slug: 'example-collection',
  fields: [
    {
      name: 'pageMeta', // name → nested object in data
      label: 'Page meta',
      type: 'group', // required
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          minLength: 20,
          maxLength: 100,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          minLength: 40,
          maxLength: 160,
        },
      ],
    },
  ],
}
```
```

--------------------------------------------------------------------------------

---[FILE: join.mdx]---
Location: payload-main/docs/fields/join.mdx

```text
---
title: Join Field
label: Join
order: 140
desc: The Join field provides the ability to work on related documents. Learn how to use Join field, see examples and options.
keywords: join, relationship, junction, fields, config, configuration, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

The Join Field is used to make Relationship and Upload fields available in the opposite direction. With a Join you can
edit and view collections
having reference to a specific collection document. The field itself acts as a virtual field, in that no new data is
stored on the collection with a Join
field. Instead, the Admin UI surfaces the related documents for a better editing experience and is surfaced by Payload's
APIs.

The Join field is useful in scenarios including:

- To surface `Orders` for a given `Product`
- To view and edit `Posts` belonging to a `Category`
- To work with any bi-directional relationship data
- Displaying where a document or upload is used in other documents

<LightDarkImage
  srcLight="https://payloadcms.com/images/docs/fields/join.png"
  srcDark="https://payloadcms.com/images/docs/fields/join-dark.png"
  alt="Shows Join field in the Payload Admin Panel"
  caption="Admin Panel screenshot of Join field"
/>

For the Join field to work, you must have an existing [relationship](./relationship) or [upload](./upload) field in the
collection you are joining. This will reference the collection and path of the field of the related documents.
To add a Relationship Field, set the `type` to `join` in your [Field Config](./overview):

```ts
import type { Field } from 'payload'

export const MyJoinField: Field = {
  // highlight-start
  name: 'relatedPosts',
  type: 'join',
  collection: 'posts',
  on: 'category',
  // highlight-end
}

// relationship field in another collection:
export const MyRelationshipField: Field = {
  name: 'category',
  type: 'relationship',
  relationTo: 'categories',
}
```

In this example, the field is defined to show the related `posts` when added to a `category` collection. The `on`
property is used to specify the relationship field name of the field that relates to the collection document.

With this example, if you navigate to a Category in the Admin UI or an API response, you'll now see that the Posts which
are related to the Category are populated for you. This is extremely powerful and can be used to define a wide variety
of relationship types in an easy manner.

<Banner type="success">
  The Join field is extremely performant and does not add additional query
  overhead to your API responses until you add depth of 1 or above. It works in
  all database adapters. In MongoDB, we use **aggregations** to automatically
  join in related documents, and in relational databases, we use joins.
</Banner>

<Banner type="warning">
  The Join Field is not supported in
  [DocumentDB](https://aws.amazon.com/documentdb/) and [Azure Cosmos
  DB](https://azure.microsoft.com/en-us/products/cosmos-db), as we internally
  use MongoDB aggregations to query data for that field, which are limited
  there. This can be changed in the future.
</Banner>

### Schema advice

When modeling your database, you might come across many places where you'd like to feature bi-directional relationships.
But here's an important consideration—you generally only want to store information about a given relationship in _one_
place.

Let's take the Posts and Categories example. It makes sense to define which category a post belongs to while editing the
post.

It would generally not be necessary to have a list of post IDs stored directly on the category as well, for a few
reasons:

- You want to have a "single source of truth" for relationships, and not worry about keeping two sources in sync with
  one another
- If you have hundreds, thousands, or even millions of posts, you would not want to store all of those post IDs on a
  given category
- Etc.

This is where the `join` field is especially powerful. With it, you only need to store the `category_id` on the `post`,
and Payload will automatically join in related posts for you when you query for categories. The related category is only
stored on the post itself - and is not duplicated on both sides. However, the `join` field is what enables
bi-directional APIs and UI for you.

### Using the Join field to have full control of your database schema

For typical polymorphic / many relationships, if you're using Postgres or SQLite, Payload will automatically create
a `posts_rels` table, which acts as a junction table to store all of a given document's relationships.

However, this might not be appropriate for your use case if you'd like to have more control over your database
architecture. You might not want to have that `_rels` table, and would prefer to maintain / control your own junction
table design.

<Banner type="success">
  With the Join field, you can control your own junction table design, and avoid
  Payload's automatic _rels table creation.
</Banner>

The `join` field can be used in conjunction with _any_ collection - and if you wanted to define your own "junction"
collection, which, say, is called `categories_posts` and has a `post_id` and a `category_id` column, you can achieve
complete control over the shape of that junction table.

You could go a step further and leverage the `admin.hidden` property of the `categories_posts` collection to hide the
collection from appearing in the Admin UI navigation.

#### Specifying additional fields on relationships

Another very powerful use case of the `join` field is to be able to define "context" fields on your relationships. Let's
say that you have Posts and Categories, and use join fields on both your Posts and Categories collection to join in
related docs from a new pseudo-junction collection called `categories_posts`. Now, the relations are stored in this
third junction collection, and can be surfaced on both Posts and Categories. But, importantly, you could add
additional "context" fields to this shared junction collection.

For example, on this `categories_posts` collection, in addition to having the `category` and `post` fields, we could add
custom "context" fields like `featured` or `spotlight`,
which would allow you to store additional information directly on relationships.
The `join` field gives you complete control over any type of relational architecture in Payload, all wrapped up in a
powerful Admin UI.

## Config Options

| Option                 | Description                                                                                                                                                                                                                            |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`name`** \*          | To be used as the property name when retrieved from the database. [More details](./overview#field-names).                                                                                                                              |
| **`collection`** \*    | The `slug`s having the relationship field or an array of collection slugs.                                                                                                                                                             |
| **`on`** \*            | The name of the relationship or upload field that relates to the collection document. Use dot notation for nested paths, like 'myGroup.relationName'. If `collection` is an array, this field must exist for all specified collections |
| **`orderable`**        | If true, enables custom ordering and joined documents can be reordered via drag and drop. Uses [fractional indexing](https://observablehq.com/@dgreensp/implementing-fractional-indexing) for efficient reordering.                    |
| **`where`**            | A `Where` query to hide related documents from appearing. Will be merged with any `where` specified in the request.                                                                                                                    |
| **`maxDepth`**         | Default is 1, Sets a maximum population depth for this field, regardless of the remaining depth when this field is reached. [Max Depth](../queries/depth#max-depth).                                                                   |
| **`label`**            | Text used as a field label in the Admin Panel or an object with keys for each language.                                                                                                                                                |
| **`hooks`**            | Provide Field Hooks to control logic for this field. [More details](../hooks/fields).                                                                                                                                                  |
| **`access`**           | Provide Field Access Control to denote what users can see and do with this field's data. [More details](../access-control/fields).                                                                                                     |
| **`defaultLimit`**     | The number of documents to return. Set to 0 to return all related documents.                                                                                                                                                           |
| **`defaultSort`**      | The field name used to specify the order the joined documents are returned.                                                                                                                                                            |
| **`admin`**            | Admin-specific configuration. [More details](#admin-config-options).                                                                                                                                                                   |
| **`custom`**           | Extension point for adding custom data (e.g. for plugins).                                                                                                                                                                             |
| **`typescriptSchema`** | Override field type generation with providing a JSON schema.                                                                                                                                                                           |
| **`graphQL`**          | Custom graphQL configuration for the field. [More details](/docs/graphql/overview#field-complexity)                                                                                                                                    |

_\* An asterisk denotes that a property is required._

## Admin Config Options

You can control the user experience of the join field using the `admin` config properties. The following options are supported:

| Option                 | Description                                                                                                                                                                               |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`defaultColumns`**   | Array of field names that correspond to which columns to show in the relationship table. Default is the collection config.                                                                |
| **`allowCreate`**      | Set to `false` to remove the controls for making new related documents from this field.                                                                                                   |
| **`components.Label`** | Override the default Label of the Field Component. [More details](./overview#label)                                                                                                       |
| **`disableRowTypes`**  | Set to `false` to render row types, and `true` to hide them. Defaults to `false` for join fields with a singular `relationTo`, and `true` for join fields where `relationTo` is an array. |

## Join Field Data

When a document is returned that for a Join field is populated with related documents. The structure returned is an
object with:

- `docs` an array of related documents or only IDs if the depth is reached
- `hasNextPage` a boolean indicating if there are additional documents
- `totalDocs` a total number of documents, exists only if `count: true` is passed to the join query

```json
{
  "id": "66e3431a3f23e684075aae9c",
  "relatedPosts": {
    "docs": [
      {
        "id": "66e3431a3f23e684075aaeb9",
        // other fields...
        "category": "66e3431a3f23e684075aae9c"
      }
      // { ... }
    ],
    "hasNextPage": false,
    "totalDocs": 10 // if count: true is passed
  }
  // other fields...
}
```

## Join Field Data (polymorphic)

When a document is returned that for a polymorphic Join field (with `collection` as an array) is populated with related documents. The structure returned is an
object with:

- `docs` an array of `relationTo` - the collection slug of the document and `value` - the document itself or the ID if the depth is reached
- `hasNextPage` a boolean indicating if there are additional documents
- `totalDocs` a total number of documents, exists only if `count: true` is passed to the join query

```json
{
  "id": "66e3431a3f23e684075aae9c",
  "relatedPosts": {
    "docs": [
      {
        "relationTo": "posts",
        "value": {
          "id": "66e3431a3f23e684075aaeb9",
          // other fields...
          "category": "66e3431a3f23e684075aae9c"
        }
      }
      // { ... }
    ],
    "hasNextPage": false,
    "totalDocs": 10 // if count: true is passed
  }
  // other fields...
}
```

## Query Options

The Join Field supports custom queries to filter, sort, and limit the related documents that will be returned. In
addition to the specific query options for each Join Field, you can pass `joins: false` to disable all Join Field from
returning. This is useful for performance reasons when you don't need the related documents.

The following query options are supported:

| Property    | Description                                                                                         |
| ----------- | --------------------------------------------------------------------------------------------------- |
| **`limit`** | The maximum related documents to be returned, default is 10.                                        |
| **`where`** | An optional `Where` query to filter joined documents. Will be merged with the field `where` object. |
| **`sort`**  | A string used to order related results                                                              |
| **`count`** | Whether include the count of related documents or not. Not included by default                      |

These can be applied to the Local API, GraphQL, and REST API.

### Local API

By adding `joins` to the Local API you can customize the request for each join field by the `name` of the field.

```js
const result = await payload.find({
  collection: 'categories',
  where: {
    title: {
      equals: 'My Category',
    },
  },
  joins: {
    relatedPosts: {
      limit: 5,
      where: {
        title: {
          equals: 'My Post',
        },
      },
      sort: 'title',
    },
  },
})
```

<Banner type="warning">
  Currently, `Where` query support on joined documents for join fields with an
  array of `collection` is limited and not supported for fields inside arrays
  and blocks.
</Banner>

### Rest API

The REST API supports the same query options as the Local API. You can use the `joins` query parameter to customize the
request for each join field by the `name` of the field. For example, an API call to get a document with the related
posts limited to 5 and sorted by title:

`/api/categories/${id}?joins[relatedPosts][limit]=5&joins[relatedPosts][sort]=title`

You can specify as many `joins` parameters as needed for the same or different join fields for a single request.

### GraphQL

The GraphQL API supports the same query options as the local and REST APIs. You can specify the query options for each
join field in your query.

Example:

```graphql
query {
  Categories {
    docs {
      relatedPosts(
        sort: "createdAt"
        limit: 5
        where: { author: { equals: "66e3431a3f23e684075aaeb9" } }
        """
        Optionally pass count: true if you want to retrieve totalDocs
        """
        count: true -- s
      ) {
        docs {
          title
        }
        hasNextPage
        totalDocs
      }
    }
  }
}
```
```

--------------------------------------------------------------------------------

---[FILE: json.mdx]---
Location: payload-main/docs/fields/json.mdx

```text
---
title: JSON Field
label: JSON
order: 50
desc: The JSON field type will store any string in the Database. Learn how to use JSON fields, see examples and options.

keywords: json, jsonSchema, schema, validation, fields, config, configuration, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

The JSON Field saves raw JSON to the database and provides the [Admin Panel](../admin/overview) with a code editor styled interface. This is different from the [Code Field](./code) which saves the value as a string in the database.

<LightDarkImage
  srcLight="https://payloadcms.com/images/docs/fields/json.png"
  srcDark="https://payloadcms.com/images/docs/fields/json-dark.png"
  alt="Shows a JSON field in the Payload Admin Panel"
  caption="This field is using the `monaco-react` editor syntax highlighting."
/>

To add a JSON Field, set the `type` to `json` in your [Field Config](./overview):

```ts
import type { Field } from 'payload'

export const MyJSONField: Field = {
  // ...
  type: 'json', // highlight-line
}
```

## Config Options

| Option                 | Description                                                                                                                                                                                                                                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`name`** \*          | To be used as the property name when stored and retrieved from the database. [More details](/docs/fields/overview#field-names).                                                                                                                                                                         |
| **`label`**            | Text used as a field label in the Admin Panel or an object with keys for each language.                                                                                                                                                                                                                 |
| **`unique`**           | Enforce that each entry in the Collection has a unique value for this field.                                                                                                                                                                                                                            |
| **`index`**            | Build an [index](../database/indexes) for this field to produce faster queries. Set this field to `true` if your users will perform queries on this field's data often.                                                                                                                                 |
| **`validate`**         | Provide a custom validation function that will be executed on both the Admin Panel and the backend. [More details](/docs/fields/overview#validation).                                                                                                                                                   |
| **`jsonSchema`**       | Provide a JSON schema that will be used for validation. [JSON schemas](https://json-schema.org/learn/getting-started-step-by-step)                                                                                                                                                                      |
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

To customize the appearance and behavior of the JSON Field in the [Admin Panel](../admin/overview), you can use the `admin` option:

```ts
import type { Field } from 'payload'

export const MyJSONField: Field = {
  // ...
  admin: {
    // highlight-line
    // ...
  },
}
```

The JSON Field inherits all of the default admin options from the base [Field Admin Config](./overview#admin-options), plus the following additional options:

| Option              | Description                                                                                                                                                   |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`editorOptions`** | Options that can be passed to the monaco editor, [view the full list](https://microsoft.github.io/monaco-editor/typedoc/variables/editor.EditorOptions.html). |

## Example

```ts
import type { CollectionConfig } from 'payload'

export const ExampleCollection: CollectionConfig = {
  slug: 'example-collection',
  fields: [
    {
      name: 'customerJSON', // required
      type: 'json', // required
      required: true,
    },
  ],
}
```

## JSON Schema Validation

Payload JSON fields fully support the [JSON schema](https://json-schema.org/) standard. By providing a schema in your field config, the editor will be guided in the admin UI, getting typeahead for properties and their formats automatically. When the document is saved, the default validation will prevent saving any invalid data in the field according to the schema in your config.

If you only provide a URL to a schema, Payload will fetch the desired schema if it is publicly available. If not, it is recommended to add the schema directly to your config or import it from another file so that it can be implemented consistently in your project.

### Local JSON Schema

`collections/ExampleCollection.ts`

```ts
import type { CollectionConfig } from 'payload'

export const ExampleCollection: CollectionConfig = {
  slug: 'example-collection',
  fields: [
    {
      name: 'customerJSON', // required
      type: 'json', // required
      jsonSchema: {
        uri: 'a://b/foo.json', // required
        fileMatch: ['a://b/foo.json'], // required
        schema: {
          type: 'object',
          properties: {
            foo: {
              enum: ['bar', 'foobar'],
            },
          },
        },
      },
    },
  ],
}
// {"foo": "bar"} or {"foo": "foobar"} - ok
// Attempting to create {"foo": "not-bar"} will throw an error
```

### Remote JSON Schema

`collections/ExampleCollection.ts`

```ts
import type { CollectionConfig } from 'payload'

export const ExampleCollection: CollectionConfig = {
  slug: 'example-collection',
  fields: [
    {
      name: 'customerJSON', // required
      type: 'json', // required
      jsonSchema: {
        uri: 'https://example.com/customer.schema.json', // required
        fileMatch: ['https://example.com/customer.schema.json'], // required
      },
    },
  ],
}
// If 'https://example.com/customer.schema.json' has a JSON schema
// {"foo": "bar"} or {"foo": "foobar"} - ok
// Attempting to create {"foo": "not-bar"} will throw an error
```

## Custom Components

### Field

#### Server Component

```tsx
import type React from 'react'
import { JSONField } from '@payloadcms/ui'
import type { JSONFieldServerComponent } from 'payload'

export const CustomJSONFieldServer: JSONFieldServerComponent = ({
  clientField,
  path,
  schemaPath,
  permissions,
}) => {
  return (
    <JSONField
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
import { JSONField } from '@payloadcms/ui'
import type { JSONFieldClientComponent } from 'payload'

export const CustomJSONFieldClient: JSONFieldClientComponent = (props) => {
  return <JSONField {...props} />
}
```

### Label

#### Server Component

```tsx
import React from 'react'
import { FieldLabel } from '@payloadcms/ui'
import type { JSONFieldLabelServerComponent } from 'payload'

export const CustomJSONFieldLabelServer: JSONFieldLabelServerComponent = ({
  clientField,
  path,
}) => {
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
import type { JSONFieldLabelClientComponent } from 'payload'

export const CustomJSONFieldLabelClient: JSONFieldLabelClientComponent = ({
  field,
  path,
}) => {
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

````
