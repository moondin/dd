---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 40
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 40 of 695)

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

---[FILE: select.mdx]---
Location: payload-main/docs/fields/select.mdx

```text
---
title: Select Field
label: Select
order: 160
desc: The Select field provides a dropdown-style interface for choosing options from a predefined list. Learn how to use Select fields, see examples and options.
keywords: select, multi-select, fields, config, configuration, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

The Select Field provides a dropdown-style interface for choosing options from a predefined list as an enumeration.

<LightDarkImage
  srcLight="https://payloadcms.com/images/docs/fields/select.png"
  srcDark="https://payloadcms.com/images/docs/fields/select-dark.png"
  alt="Shows a Select field in the Payload Admin Panel"
  caption="Admin Panel screenshot of a Select field"
/>

To add a Select Field, set the `type` to `select` in your [Field Config](./overview):

```ts
import type { Field } from 'payload'

export const MySelectField: Field = {
  // ...
  // highlight-start
  type: 'select',
  options: [
    // ...
  ],
  // highlight-end
}
```

## Config Options

| Option                 | Description                                                                                                                                                                                                                                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`name`** \*          | To be used as the property name when stored and retrieved from the database. [More details](/docs/fields/overview#field-names).                                                                                                                                                                         |
| **`options`** \*       | Array of options to allow the field to store. Can either be an array of strings, or an array of objects containing a `label` string and a `value` string.                                                                                                                                               |
| **`hasMany`**          | Boolean when, if set to `true`, allows this field to have many selections instead of only one.                                                                                                                                                                                                          |
| **`label`**            | Text used as a field label in the Admin Panel or an object with keys for each language.                                                                                                                                                                                                                 |
| **`unique`**           | Enforce that each entry in the Collection has a unique value for this field.                                                                                                                                                                                                                            |
| **`validate`**         | Provide a custom validation function that will be executed on both the Admin Panel and the backend. [More details](/docs/fields/overview#validation).                                                                                                                                                   |
| **`index`**            | Build an [index](../database/indexes) for this field to produce faster queries. Set this field to `true` if your users will perform queries on this field's data often.                                                                                                                                 |
| **`saveToJWT`**        | If this field is top-level and nested in a config supporting [Authentication](/docs/authentication/overview), include its data in the user JWT.                                                                                                                                                         |
| **`hooks`**            | Provide Field Hooks to control logic for this field. [More details](../hooks/fields).                                                                                                                                                                                                                   |
| **`access`**           | Provide Field Access Control to denote what users can see and do with this field's data. [More details](../access-control/fields).                                                                                                                                                                      |
| **`hidden`**           | Restrict this field's visibility from all APIs entirely. Will still be saved to the database, but will not appear in any API or the Admin Panel.                                                                                                                                                        |
| **`defaultValue`**     | Provide data to be used for this field's default value. [More details](/docs/fields/overview#default-values).                                                                                                                                                                                           |
| **`localized`**        | Enable localization for this field. Requires [localization to be enabled](/docs/configuration/localization) in the Base config.                                                                                                                                                                         |
| **`required`**         | Require this field to have a value.                                                                                                                                                                                                                                                                     |
| **`admin`**            | Admin-specific configuration. See the [default field admin config](/docs/fields/overview#admin-options) for more details.                                                                                                                                                                               |
| **`custom`**           | Extension point for adding custom data (e.g. for plugins)                                                                                                                                                                                                                                               |
| **`enumName`**         | Custom enum name for this field when using SQL Database Adapter ([Postgres](/docs/database/postgres)). Auto-generated from name if not defined.                                                                                                                                                         |
| **`dbName`**           | Custom table name (if `hasMany` set to `true`) for this field when using SQL Database Adapter ([Postgres](/docs/database/postgres)). Auto-generated from name if not defined.                                                                                                                           |
| **`interfaceName`**    | Create a top level, reusable [Typescript interface](/docs/typescript/generating-types#custom-field-interfaces) & [GraphQL type](/docs/graphql/graphql-schema#custom-field-schemas).                                                                                                                     |
| **`filterOptions`**    | Dynamically filter which options are available based on the user, data, etc. [More details](#filteroptions)                                                                                                                                                                                             |
| **`typescriptSchema`** | Override field type generation with providing a JSON schema                                                                                                                                                                                                                                             |
| **`virtual`**          | Provide `true` to disable field in the database, or provide a string path to [link the field with a relationship](/docs/fields/relationship#linking-virtual-fields-with-relationships). See [Virtual Fields](https://payloadcms.com/blog/learn-how-virtual-fields-can-help-solve-common-cms-challenges) |

_\* An asterisk denotes that a property is required._

<Banner type="warning">
  **Important:** Option values should be strings that do not contain hyphens or
  special characters due to GraphQL enumeration naming constraints. Underscores
  are allowed. If you determine you need your option values to be non-strings or
  contain special characters, they will be formatted accordingly before being
  used as a GraphQL enum.
</Banner>

### filterOptions

Used to dynamically filter which options are available based on the current user, document data, or other criteria.

Some examples of this might include:

- Restricting options based on a user's role, e.g. admin-only options
- Displaying different options based on the value of another field, e.g. a city/state selector

The result of `filterOptions` will determine:

- Which options are displayed in the Admin Panel
- Which options can be saved to the database

To do this, use the `filterOptions` property in your [Field Config](./overview):

```ts
import type { Field } from 'payload'

export const MySelectField: Field = {
  // ...
  // highlight-start
  type: 'select',
  options: [
    {
      label: 'One',
      value: 'one',
    },
    {
      label: 'Two',
      value: 'two',
    },
    {
      label: 'Three',
      value: 'three',
    },
  ],
  filterOptions: ({ options, data }) =>
    data.disallowOption1
      ? options.filter(
          (option) =>
            (typeof option === 'string' ? options : option.value) !== 'one',
        )
      : options,
  // highlight-end
}
```

<Banner type="warning">
  **Note:** This property is similar to `filterOptions` in
  [Relationship](./relationship) or [Upload](./upload) fields, except that the
  return value of this function is simply an array of options, not a query
  constraint.
</Banner>

## Admin Options

To customize the appearance and behavior of the Select Field in the [Admin Panel](../admin/overview), you can use the `admin` option:

```ts
import type { Field } from 'payload'

export const MySelectField: Field = {
  // ...
  admin: {
    // highlight-line
    // ...
  },
}
```

The Select Field inherits all of the default admin options from the base [Field Admin Config](./overview#admin-options), plus the following additional options:

| Property          | Description                                                                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **`isClearable`** | Set to `true` if you'd like this field to be clearable within the Admin UI.                                                                 |
| **`isSortable`**  | Set to `true` if you'd like this field to be sortable within the Admin UI using drag and drop. (Only works when `hasMany` is set to `true`) |
| **`placeholder`** | Define a custom text or function to replace the generic default placeholder                                                                 |

## Example

```ts
import type { CollectionConfig } from 'payload'

export const ExampleCollection: CollectionConfig = {
  slug: 'example-collection',
  fields: [
    {
      name: 'selectedFeatures', // required
      type: 'select', // required
      hasMany: true,
      admin: {
        isClearable: true,
        isSortable: true, // use mouse to drag and drop different values, and sort them according to your choice
      },
      options: [
        {
          label: 'Metallic Paint',
          value: 'metallic_paint',
        },
        {
          label: 'Alloy Wheels',
          value: 'alloy_wheels',
        },
        {
          label: 'Carbon Fiber Dashboard',
          value: 'carbon_fiber_dashboard',
        },
      ],
    },
  ],
}
```

## Custom Components

### Field

#### Server Component

```tsx
import type { SelectFieldServerComponent } from 'payload'
import type React from 'react'

import { SelectField } from '@payloadcms/ui'

export const CustomSelectFieldServer: SelectFieldServerComponent = ({
  clientField,
  path,
  schemaPath,
  permissions,
}) => {
  return (
    <SelectField
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
import type { SelectFieldClientComponent } from 'payload'

import { SelectField } from '@payloadcms/ui'
import React from 'react'

export const CustomSelectFieldClient: SelectFieldClientComponent = (props) => {
  return <SelectField {...props} />
}
```

### Label

#### Server Component

```tsx
import React from 'react'
import { FieldLabel } from '@payloadcms/ui'
import type { SelectFieldLabelServerComponent } from 'payload'

export const CustomSelectFieldLabelServer: SelectFieldLabelServerComponent = ({
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
import type { SelectFieldLabelClientComponent } from 'payload'

export const CustomSelectFieldLabelClient: SelectFieldLabelClientComponent = ({
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

---[FILE: tabs.mdx]---
Location: payload-main/docs/fields/tabs.mdx

```text
---
title: Tabs Field
label: Tabs
order: 170
desc: The Tabs field is a great way to organize complex editing experiences into specific tab-based areas.
keywords: tabs, fields, config, configuration, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

The Tabs Field is presentational-only and only affects the [Admin Panel](../admin/overview) (unless a tab is named). By using it, you can place fields within a nice layout component that separates certain sub-fields by a tabbed interface.

<LightDarkImage
  srcLight="https://payloadcms.com/images/docs/fields/tabs.png"
  srcDark="https://payloadcms.com/images/docs/fields/tabs-dark.png"
  alt="Shows a tabs field used to separate Hero and Page layout in the Payload Admin Panel"
  caption="Tabs field type used to separate Hero fields from Page Layout"
/>

To add a Tabs Field, set the `type` to `tabs` in your [Field Config](./overview):

```ts
import type { Field } from 'payload'

export const MyTabsField: Field = {
  // ...
  // highlight-start
  type: 'tabs',
  tabs: [
    // ...
  ],
  // highlight-end
}
```

## Config Options

| Option        | Description                                                             |
| ------------- | ----------------------------------------------------------------------- |
| **`tabs`** \* | Array of tabs to render within this Tabs field.                         |
| **`admin`**   | Admin-specific configuration. [More details](./overview#admin-options). |
| **`custom`**  | Extension point for adding custom data (e.g. for plugins)               |

### Tab-specific Config

Each tab must have either a `name` or `label` and the required `fields` array. You can also optionally pass a `description` to render within each individual tab.

| Option              | Description                                                                                                                                                                                                                                                                                             |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`name`**          | Groups field data into an object when stored and retrieved from the database. [More details](/docs/fields/overview#field-names).                                                                                                                                                                        |
| **`label`**         | The label to render on the tab itself. Required when name is undefined, defaults to name converted to words.                                                                                                                                                                                            |
| **`fields`** \*     | The fields to render within this tab.                                                                                                                                                                                                                                                                   |
| **`description`**   | Optionally render a description within this tab to describe the contents of the tab itself.                                                                                                                                                                                                             |
| **`interfaceName`** | Create a top level, reusable [Typescript interface](/docs/typescript/generating-types#custom-field-interfaces) & [GraphQL type](/docs/graphql/graphql-schema#custom-field-schemas). (`name` must be present)                                                                                            |
| **`virtual`**       | Provide `true` to disable field in the database, or provide a string path to [link the field with a relationship](/docs/fields/relationship#linking-virtual-fields-with-relationships). See [Virtual Fields](https://payloadcms.com/blog/learn-how-virtual-fields-can-help-solve-common-cms-challenges) |

_\* An asterisk denotes that a property is required._

## Example

```ts
import type { CollectionConfig } from 'payload'

export const ExampleCollection: CollectionConfig = {
  slug: 'example-collection',
  fields: [
    {
      type: 'tabs', // required
      tabs: [
        // required
        {
          label: 'Tab One Label', // required
          description: 'This will appear within the tab above the fields.',
          fields: [
            // required
            {
              name: 'someTextField',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'tabTwo',
          label: 'Tab Two Label', // required
          interfaceName: 'TabTwo', // optional (`name` must be present)
          fields: [
            // required
            {
              name: 'numberField', // accessible via tabTwo.numberField
              type: 'number',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
```
```

--------------------------------------------------------------------------------

---[FILE: text.mdx]---
Location: payload-main/docs/fields/text.mdx

```text
---
title: Text Field
label: Text
order: 180
desc: Text field types simply save a string to the database and provide the Admin Panel with a text input. Learn how to use Text fields, see examples and options.
keywords: text, fields, config, configuration, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

The Text Field is one of the most commonly used fields. It saves a string to the database and provides the [Admin Panel](../admin/overview) with a simple text input.

<LightDarkImage
  srcLight="https://payloadcms.com/images/docs/fields/text.png"
  srcDark="https://payloadcms.com/images/docs/fields/text-dark.png"
  alt="Shows a text field and read-only text field in the Payload Admin Panel"
  caption="Admin Panel screenshot of a Text field and read-only Text field"
/>

To add a Text Field, set the `type` to `text` in your [Field Config](./overview):

```ts
import type { Field } from 'payload'

export const MyTextField: Field = {
  // ...
  type: 'text', // highlight-line
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
| **`hasMany`**          | Makes this field an ordered array of text instead of just a single text.                                                                                                                                                                                                                                |
| **`minRows`**          | Minimum number of texts in the array, if `hasMany` is set to true.                                                                                                                                                                                                                                      |
| **`maxRows`**          | Maximum number of texts in the array, if `hasMany` is set to true.                                                                                                                                                                                                                                      |
| **`typescriptSchema`** | Override field type generation with providing a JSON schema                                                                                                                                                                                                                                             |
| **`virtual`**          | Provide `true` to disable field in the database, or provide a string path to [link the field with a relationship](/docs/fields/relationship#linking-virtual-fields-with-relationships). See [Virtual Fields](https://payloadcms.com/blog/learn-how-virtual-fields-can-help-solve-common-cms-challenges) |

_\* An asterisk denotes that a property is required._

## Admin Options

To customize the appearance and behavior of the Text Field in the [Admin Panel](../admin/overview), you can use the `admin` option:

```ts
import type { Field } from 'payload'

export const MyTextField: Field = {
  // ...
  admin: {
    // highlight-line
    // ...
  },
}
```

The Text Field inherits all of the default admin options from the base [Field Admin Config](./overview#admin-options), plus the following additional options:

| Option             | Description                                                                                                                 |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| **`placeholder`**  | Set this property to define a placeholder string in the text input.                                                         |
| **`autoComplete`** | Set this property to a string that will be used for browser autocomplete.                                                   |
| **`rtl`**          | Override the default text direction of the Admin Panel for this field. Set to `true` to force right-to-left text direction. |

## Example

```ts
import type { CollectionConfig } from 'payload'

export const ExampleCollection: CollectionConfig = {
  slug: 'example-collection',
  fields: [
    {
      name: 'pageTitle', // required
      type: 'text', // required
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
import { TextField } from '@payloadcms/ui'
import type { TextFieldServerComponent } from 'payload'

export const CustomTextFieldServer: TextFieldServerComponent = ({
  clientField,
  path,
  schemaPath,
  permissions,
}) => {
  return (
    <TextField
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
import { TextField } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'

export const CustomTextFieldClient: TextFieldClientComponent = (props) => {
  return <TextField {...props} />
}
```

### Label

#### Server Component

```tsx
import React from 'react'
import { FieldLabel } from '@payloadcms/ui'
import type { TextFieldLabelServerComponent } from 'payload'

export const CustomTextFieldLabelServer: TextFieldLabelServerComponent = ({
  clientField,
  path,
  required,
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
import type { TextFieldLabelClientComponent } from 'payload'

export const CustomTextFieldLabelClient: TextFieldLabelClientComponent = ({
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

## Slug Field

<Banner type="warning">
  The slug field is experimental and may change, or even be removed, in future
  releases. Use at your own risk.
</Banner>

One common use case for the Text Field is to create a "slug" for a document. A slug is a unique, indexed, URL-friendly string that identifies a particular document, often used to construct the URL of a webpage.

Payload provides a built-in Slug Field so you don't have to built one from scratch. This field automatically generates a slug based on the value of another field, such as a title or name field. It provides UI to lock and unlock the field to protect its value, as well as to re-generate the slug on-demand.

To add a Slug Field, import the `slugField` into your field schema:

```ts
import { slugField } from 'payload'
import type { CollectionConfig } from 'payload'

export const ExampleCollection: CollectionConfig = {
  // ...
  fields: [
    // ...
    // highlight-line
    slugField(),
    // highlight-line
  ],
}
```

The slug field exposes a few top-level config options for easy customization:

| Option         | Description                                                                                                                              |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `name`         | To be used as the slug field's name. Defaults to `slug`.                                                                                 |
| `overrides`    | A function that receives the default fields so you can override on a granular level. See example below. [More details](#slug-overrides). |
| `checkboxName` | To be used as the name for the `generateSlug` checkbox field. Defaults to `generateSlug`.                                                |
| `useAsSlug`    | The name of the top-level field to use when generating the slug. This field must exist in the same collection. Defaults to `title`.      |
| `localized`    | Enable localization on the `slug` and `generateSlug` fields. Defaults to `false`.                                                        |
| `position`     | The position of the slug field. [More details](./overview#admin-options).                                                                |
| `required`     | Require the slug field. Defaults to `true`.                                                                                              |
| `slugify`      | Override the default slugify function. [More details](#custom-slugify-function).                                                         |

### Slug Overrides

If the above options aren't sufficient for your use case, you can use the `overrides` function to customize the slug field at a granular level. The `overrides` function receives the default fields that make up the slug field, and you can modify them to any extent you need.

```ts
import { slugField } from 'payload'
import type { CollectionConfig } from 'payload'

export const ExampleCollection: CollectionConfig = {
  // ...
  fields: [
    // ...
    // highlight-line
    slugField({
      overrides: (defaultField) => {
        defaultField.fields[1].label = 'Custom Slug Label'
        return defaultField
      },
    }),
    // highlight-line
  ],
}
```

### Custom Slugify Function

You can also override the default slugify function of the slug field. This is necessary if the slug requires special treatment, such as character encoding, additional language support, etc.

This functions receives the value of the `useAsSlug` field as `valueToSlugify` and must return a string.

For example, if you wanted to use the [`slugify`](https://www.npmjs.com/package/slugify) package, you could do something like this:

```ts
import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'
import slugify from 'slugify'

export const MyCollection: CollectionConfig = {
  // ...
  fields: [
    // ...
    slugField({
      slugify: ({ valueToSlugify }) =>
        slugify(valueToSlugify, {
          // ...additional `slugify` options here
        }),
    }),
  ],
}
```

The following args are provided to the custom `slugify` function:

| Argument         | Type             | Description                                      |
| ---------------- | ---------------- | ------------------------------------------------ |
| `valueToSlugify` | `string`         | The value of the field specified in `useAsSlug`. |
| `data`           | `object`         | The full document data being saved.              |
| `req`            | `PayloadRequest` | The Payload request object.                      |
```

--------------------------------------------------------------------------------

````
