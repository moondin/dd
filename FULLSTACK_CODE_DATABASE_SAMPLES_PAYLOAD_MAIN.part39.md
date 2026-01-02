---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 39
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 39 of 695)

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

---[FILE: relationship.mdx]---
Location: payload-main/docs/fields/relationship.mdx

```text
---
title: Relationship Field
label: Relationship
order: 130
desc: The Relationship field provides the ability to relate documents together. Learn how to use Relationship fields, see examples and options.
keywords: relationship, fields, config, configuration, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

The Relationship Field is one of the most powerful fields Payload features. It provides the ability to easily relate documents together.

<LightDarkImage
  srcLight="https://payloadcms.com/images/docs/fields/relationship.png"
  srcDark="https://payloadcms.com/images/docs/fields/relationship-dark.png"
  alt="Shows a relationship field in the Payload Admin Panel"
  caption="Admin Panel screenshot of a Relationship field"
/>

The Relationship field is used in a variety of ways, including:

- To add `Product` documents to an `Order` document
- To allow for an `Order` to feature a `placedBy` relationship to either an `Organization` or `User` collection
- To assign `Category` documents to `Post` documents

To add a Relationship Field, set the `type` to `relationship` in your [Field Config](./overview):

```ts
import type { Field } from 'payload'

export const MyRelationshipField: Field = {
  // ...
  // highlight-start
  type: 'relationship',
  relationTo: 'products',
  // highlight-end
}
```

## Config Options

| Option                 | Description                                                                                                                                                                                           |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`name`** \*          | To be used as the property name when stored and retrieved from the database. [More details](/docs/fields/overview#field-names).                                                                       |
| **`relationTo`** \*    | Provide one or many collection `slug`s to be able to assign relationships to.                                                                                                                         |
| **`filterOptions`**    | A query to filter which options appear in the UI and validate against. [More details](#filtering-relationship-options).                                                                               |
| **`hasMany`**          | Boolean when, if set to `true`, allows this field to have many relations instead of only one.                                                                                                         |
| **`minRows`**          | A number for the fewest allowed items during validation when a value is present. Used with `hasMany`.                                                                                                 |
| **`maxRows`**          | A number for the most allowed items during validation when a value is present. Used with `hasMany`.                                                                                                   |
| **`maxDepth`**         | Sets a maximum population depth for this field, regardless of the remaining depth when this field is reached. [Max Depth](/docs/queries/depth#max-depth)                                              |
| **`label`**            | Text used as a field label in the Admin Panel or an object with keys for each language.                                                                                                               |
| **`unique`**           | Enforce that each entry in the Collection has a unique value for this field.                                                                                                                          |
| **`validate`**         | Provide a custom validation function that will be executed on both the Admin Panel and the backend. [More details](/docs/fields/overview#validation).                                                 |
| **`index`**            | Build an [index](../database/indexes) for this field to produce faster queries. Set this field to `true` if your users will perform queries on this field's data often.                               |
| **`saveToJWT`**        | If this field is top-level and nested in a config supporting [Authentication](/docs/authentication/overview), include its data in the user JWT.                                                       |
| **`hooks`**            | Provide Field Hooks to control logic for this field. [More details](../hooks/fields).                                                                                                                 |
| **`access`**           | Provide Field Access Control to denote what users can see and do with this field's data. [More details](../access-control/fields).                                                                    |
| **`hidden`**           | Restrict this field's visibility from all APIs entirely. Will still be saved to the database, but will not appear in any API or the Admin Panel.                                                      |
| **`defaultValue`**     | Provide data to be used for this field's default value. [More details](/docs/fields/overview#default-values).                                                                                         |
| **`localized`**        | Enable localization for this field. Requires [localization to be enabled](/docs/configuration/localization) in the Base config.                                                                       |
| **`required`**         | Require this field to have a value.                                                                                                                                                                   |
| **`admin`**            | Admin-specific configuration. [More details](#admin-options).                                                                                                                                         |
| **`custom`**           | Extension point for adding custom data (e.g. for plugins)                                                                                                                                             |
| **`typescriptSchema`** | Override field type generation with providing a JSON schema                                                                                                                                           |
| **`virtual`**          | Provide `true` to disable field in the database, or provide a string path to link the field with a relationship. See [Virtual Field Configuration](/docs/fields/overview#virtual-field-configuration) |
| **`graphQL`**          | Custom graphQL configuration for the field. [More details](/docs/graphql/overview#field-complexity)                                                                                                   |

_\* An asterisk denotes that a property is required._

<Banner type="success">
  **Tip:** The [Depth](../queries/depth) parameter can be used to automatically
  populate related documents that are returned by the API.
</Banner>

## Admin Options

To the appearance and behavior of the Relationship Field in the [Admin Panel](../admin/overview), you can use the `admin` option:

```ts
import type { Field } from 'payload'

export const MyRelationshipField: Field = {
  // ...
  admin: {
    // highlight-line
    // ...
  },
}
```

The Relationship Field inherits all of the default admin options from the base [Field Admin Config](./overview#admin-options), plus the following additional options:

| Property          | Description                                                                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **`isSortable`**  | Set to `true` if you'd like this field to be sortable within the Admin UI using drag and drop (only works when `hasMany` is set to `true`). |
| **`allowCreate`** | Set to `false` if you'd like to disable the ability to create new documents from within the relationship field.                             |
| **`allowEdit`**   | Set to `false` if you'd like to disable the ability to edit documents from within the relationship field.                                   |
| **`sortOptions`** | Define a default sorting order for the options within a Relationship field's dropdown. [More details](#sort-options)                        |
| **`placeholder`** | Define a custom text or function to replace the generic default placeholder                                                                 |
| **`appearance`**  | Set to `drawer` or `select` to change the behavior of the field. Defaults to `select`.                                                      |

### Sort Options

You can specify `sortOptions` in two ways:

**As a string:**

Provide a string to define a global default sort field for all relationship field dropdowns across different
collections. You can prefix the field name with a minus symbol ("-") to sort in descending order.

Example:

```ts
sortOptions: 'fieldName',
```

This configuration will sort all relationship field dropdowns by `"fieldName"` in ascending order.

**As an object :**

Specify an object where keys are collection slugs and values are strings representing the field names to sort by. This
allows for different sorting fields for each collection's relationship dropdown.

Example:

```ts
sortOptions: {
  "pages": "fieldName1",
  "posts": "-fieldName2",
  "categories": "fieldName3"
}
```

In this configuration:

- Dropdowns related to `pages` will be sorted by `"fieldName1"` in ascending order.
- Dropdowns for `posts` will use `"fieldName2"` for sorting in descending order (noted by the "-" prefix).
- Dropdowns associated with `categories` will sort based on `"fieldName3"` in ascending order.

Note: If `sortOptions` is not defined, the default sorting behavior of the Relationship field dropdown will be used.

## Filtering relationship options

Options can be dynamically limited by supplying a [query constraint](/docs/queries/overview), which will be used both for validating input and filtering available relationships in the UI.

The `filterOptions` property can either be a `Where` query, or a function returning `true` to not filter, `false` to prevent all, or a `Where` query. When using a function, it will be called with an argument object with the following properties:

| Property      | Description                                                                                                                                                                              |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `blockData`   | The data of the nearest parent block. Will be `undefined` if the field is not within a block or when called on a `Filter` component within the list view.                                |
| `data`        | An object containing the full collection or global document currently being edited. Will be an empty object when called on a `Filter` component within the list view.                    |
| `id`          | The `id` of the current document being edited. Will be `undefined` during the `create` operation or when called on a `Filter` component within the list view.                            |
| `relationTo`  | The collection `slug` to filter against, limited to this field's `relationTo` property.                                                                                                  |
| `req`         | The Payload Request, which contains references to `payload`, `user`, `locale`, and more.                                                                                                 |
| `siblingData` | An object containing document data that is scoped to only fields within the same parent of this field. Will be an empty object when called on a `Filter` component within the list view. |
| `user`        | An object containing the currently authenticated user.                                                                                                                                   |

## Example

```ts
import type { CollectionConfig } from 'payload'

export const ExampleCollection: CollectionConfig = {
  slug: 'example-collection',
  fields: [
    {
      name: 'purchase',
      type: 'relationship',
      relationTo: ['products', 'services'],
      filterOptions: ({ relationTo, siblingData }) => {
        // returns a Where query dynamically by the type of relationship
        if (relationTo === 'products') {
          return {
            stock: { greater_than: siblingData.quantity },
          }
        }

        if (relationTo === 'services') {
          return {
            isAvailable: { equals: true },
          }
        }
      },
    },
  ],
}
```

You can learn more about writing queries [here](/docs/queries/overview).

<Banner type="warning">
  **Note:**

When a relationship field has both **filterOptions** and a custom
**validate** function, the api will not validate **filterOptions**
unless you call the default relationship field validation function imported from
**payload/shared** in your validate function.

</Banner>

## Bi-directional relationships

The `relationship` field on its own is used to define relationships for the document that contains the relationship field, and this can be considered as a "one-way" relationship. For example, if you have a Post that has a `category` relationship field on it, the related `category` itself will not surface any information about the posts that have the category set.

However, the `relationship` field can be used in conjunction with the `Join` field to produce powerful bi-directional relationship authoring capabilities. If you're interested in bi-directional relationships, check out the [documentation for the Join field](./join).

## How the data is saved

Given the variety of options possible within the `relationship` field type, the shape of the data needed for creating
and updating these fields can vary. The following sections will describe the variety of data shapes that can arise from
this field.

### Has One

The most simple pattern of a relationship is to use `hasMany: false` with a `relationTo` that allows for only one type
of collection.

```ts
{
  slug: 'example-collection',
  fields: [
    {
      name: 'owner', // required
      type: 'relationship', // required
      relationTo: 'users', // required
      hasMany: false,
    }
  ]
}
```

The shape of the data to save for a document with the field configured this way would be:

```json
{
  // ObjectID of the related user
  "owner": "6031ac9e1289176380734024"
}
```

When querying documents in this collection via REST API, you could query as follows:

`?where[owner][equals]=6031ac9e1289176380734024`.

### Has One - Polymorphic

Also known as **dynamic references**, in this configuration, the `relationTo` field is an array of Collection slugs that
tells Payload which Collections are valid to reference.

```ts
{
  slug: 'example-collection',
  fields: [
    {
      name: 'owner', // required
      type: 'relationship', // required
      relationTo: ['users', 'organizations'], // required
      hasMany: false,
    }
  ]
}
```

The shape of the data to save for a document with more than one relationship type would be:

```json
{
  "owner": {
    "relationTo": "organizations",
    "value": "6031ac9e1289176380734024"
  }
}
```

Here is an example for how to query documents by this data (note the difference in referencing the `owner.value`):

`?where[owner.value][equals]=6031ac9e1289176380734024`.

You can also query for documents where a field has a relationship to a specific Collection:

`?where[owners.relationTo][equals]=organizations`.

This query would return only documents that have an owner relationship to organizations.

### Has Many

The `hasMany` tells Payload that there may be more than one collection saved to the field.

```ts
{
  slug: 'example-collection',
  fields: [
    {
      name: 'owners', // required
      type: 'relationship', // required
      relationTo: 'users', // required
      hasMany: true,
    }
  ]
}
```

To save to the `hasMany` relationship field we need to send an array of IDs:

```json
{
  "owners": ["6031ac9e1289176380734024", "602c3c327b811235943ee12b"]
}
```

When querying documents, the format does not change for arrays:

`?where[owners][equals]=6031ac9e1289176380734024`.

### Has Many - Polymorphic

```ts
{
  slug: 'example-collection',
  fields: [
    {
      name: 'owners', // required
      type: 'relationship', // required
      relationTo: ['users', 'organizations'], // required
      hasMany: true,
      required: true,
    }
  ]
}
```

Relationship fields with `hasMany` set to more than one kind of collections save their data as an array of objects—each
containing the Collection `slug` as the `relationTo` value, and the related document `id` for the `value`:

```json
{
  "owners": [
    {
      "relationTo": "users",
      "value": "6031ac9e1289176380734024"
    },
    {
      "relationTo": "organizations",
      "value": "602c3c327b811235943ee12b"
    }
  ]
}
```

Querying is done in the same way as the earlier Polymorphic example:

`?where[owners.value][equals]=6031ac9e1289176380734024`.

### Querying and Filtering Polymorphic Relationships

Polymorphic and non-polymorphic relationships must be queried differently because of how the related data is stored and
may be inconsistent across different collections. Because of this, filtering polymorphic relationship fields from the
Collection List admin UI is limited to the `id` value.

For a polymorphic relationship, the response will always be an array of objects. Each object will contain
the `relationTo` and `value` properties.

The data can be queried by the related document ID:

`?where[field.value][equals]=6031ac9e1289176380734024`.

Or by the related document Collection slug:

`?where[field.relationTo][equals]=your-collection-slug`.

However, you **cannot** query on any field values within the related document.
Since we are referencing multiple collections, the field you are querying on may not exist and break the query.

<Banner type="warning">
  **Note:**

You **cannot** query on a field within a polymorphic relationship as you would with a
non-polymorphic relationship.

</Banner>

## Custom Components

### Field

#### Server Component

```tsx
import type React from 'react'
import { RelationshipField } from '@payloadcms/ui'
import type { RelationshipFieldServerComponent } from 'payload'

export const CustomRelationshipFieldServer: RelationshipFieldServerComponent =
  ({ clientField, path, schemaPath, permissions }) => {
    return (
      <RelationshipField
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
import { RelationshipField } from '@payloadcms/ui'
import type { RelationshipFieldClientComponent } from 'payload'

export const CustomRelationshipFieldClient: RelationshipFieldClientComponent = (
  props,
) => {
  return <RelationshipField {...props} />
}
```

### Label

#### Server Component

```tsx
import React from 'react'
import { FieldLabel } from '@payloadcms/ui'
import type { RelationshipFieldLabelServerComponent } from 'payload'

export const CustomRelationshipFieldLabelServer: RelationshipFieldLabelServerComponent =
  (clientField, path) => {
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
import type { RelationshipFieldLabelClientComponent } from 'payload'

export const CustomRelationshipFieldLabelClient: RelationshipFieldLabelClientComponent =
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

---[FILE: rich-text.mdx]---
Location: payload-main/docs/fields/rich-text.mdx

```text
---
description: The Rich Text field allows dynamic content to be written through the Admin Panel. Learn how to use Rich Text fields, see examples and options.
keywords: rich text, fields, config, configuration, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
label: Rich Text
order: 140
title: Rich Text Field
---

The Rich Text Field lets editors write and format dynamic content in a familiar interface. The content is saved as JSON in the database and can be converted to HTML or any other format needed.

Consistent with Payload's goal of making you learn as little of Payload as possible, customizing and using the Rich Text Editor does not involve learning how to develop for a Payload rich text editor.

Instead, you can invest your time and effort into learning the underlying open-source tools that will allow you to apply your learnings elsewhere as well.

<LightDarkImage
  alt="Shows a Rich Text field in the Payload Admin Panel"
  caption="Admin Panel screenshot of a Rich Text field"
  srcDark="https://payloadcms.com/images/docs/fields/richtext-dark.png"
  srcLight="https://payloadcms.com/images/docs/fields/richtext.png"
/>

## Config Options

| Option                 | Description                                                                                                                                                                                                                                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`name`** \*          | To be used as the property name when stored and retrieved from the database. [More details](./overview#field-names).                                                                                                                                                                                    |
| **`label`**            | Text used as a field label in the Admin Panel or an object with keys for each language.                                                                                                                                                                                                                 |
| **`validate`**         | Provide a custom validation function that will be executed on both the Admin Panel and the backend. [More details](./overview#validation).                                                                                                                                                              |
| **`saveToJWT`**        | If this field is top-level and nested in a config supporting [Authentication](../authentication/overview), include its data in the user JWT.                                                                                                                                                            |
| **`hooks`**            | Provide Field Hooks to control logic for this field. [More details](../hooks/fields).                                                                                                                                                                                                                   |
| **`access`**           | Provide Field Access Control to denote what users can see and do with this field's data. [More details](../access-control/fields).                                                                                                                                                                      |
| **`hidden`**           | Restrict this field's visibility from all APIs entirely. Will still be saved to the database, but will not appear in any API or the Admin Panel.                                                                                                                                                        |
| **`defaultValue`**     | Provide data to be used for this field's default value. [More details](./overview#default-values).                                                                                                                                                                                                      |
| **`localized`**        | Enable localization for this field. Requires [localization to be enabled](../configuration/localization) in the Base config.                                                                                                                                                                            |
| **`required`**         | Require this field to have a value.                                                                                                                                                                                                                                                                     |
| **`admin`**            | Admin-specific configuration. [More details](#admin-options).                                                                                                                                                                                                                                           |
| **`editor`**           | Customize or override the rich text editor. [More details](../rich-text/overview).                                                                                                                                                                                                                      |
| **`custom`**           | Extension point for adding custom data (e.g. for plugins)                                                                                                                                                                                                                                               |
| **`typescriptSchema`** | Override field type generation with providing a JSON schema                                                                                                                                                                                                                                             |
| **`virtual`**          | Provide `true` to disable field in the database, or provide a string path to [link the field with a relationship](/docs/fields/relationship#linking-virtual-fields-with-relationships). See [Virtual Fields](https://payloadcms.com/blog/learn-how-virtual-fields-can-help-solve-common-cms-challenges) |

\*_ An asterisk denotes that a property is required._

## Admin Options

To customize the appearance and behavior of the Rich Text Field in the [Admin Panel](../admin/overview), you can use the `admin` option. The Rich Text Field inherits all the default options from the base [Field Admin Config](./overview#admin-options).

```ts
import type { Field } from 'payload'

export const MyRichTextField: Field = {
  // ...
  admin: {
    // highlight-line
    // ...
  },
}
```

Further customization can be done with editor-specific options.

## Editor-specific Options

For a ton more editor-specific options, including how to build custom rich text elements directly into your editor,
take a look at the [rich text editor documentation](../rich-text/overview).
```

--------------------------------------------------------------------------------

---[FILE: row.mdx]---
Location: payload-main/docs/fields/row.mdx

```text
---
title: Row Field
label: Row
order: 150
desc: With the Row field you can arrange fields next to each other in the Admin Panel to help you customize your Dashboard.
keywords: row, fields, config, configuration, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

The Row Field is presentational-only and only affects the [Admin Panel](../admin/overview). By using it, you can arrange [Fields](./overview) next to each other horizontally.

<LightDarkImage
  srcLight="https://payloadcms.com/images/docs/fields/row.png"
  srcDark="https://payloadcms.com/images/docs/fields/row-dark.png"
  alt="Shows a row field in the Payload Admin Panel"
  caption="Admin Panel screenshot of a Row field"
/>

To add a Row Field, set the `type` to `row` in your [Field Config](./overview):

```ts
import type { Field } from 'payload'

export const MyRowField: Field = {
  // ...
  // highlight-start
  type: 'row',
  fields: [
    // ...
  ],
  // highlight-end
}
```

## Config Options

| Option          | Description                                                                                                               |
| --------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **`fields`** \* | Array of field types to nest within this Row.                                                                             |
| **`admin`**     | Admin-specific configuration excluding `description`, `readOnly`, and `hidden`. [More details](./overview#admin-options). |
| **`custom`**    | Extension point for adding custom data (e.g. for plugins)                                                                 |

_\* An asterisk denotes that a property is required._

## Example

```ts
import type { CollectionConfig } from 'payload'

export const ExampleCollection: CollectionConfig = {
  slug: 'example-collection',
  fields: [
    {
      type: 'row', // required
      fields: [
        // required
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'value',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
          },
        },
      ],
    },
  ],
}
```
```

--------------------------------------------------------------------------------

````
