---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 34
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 34 of 695)

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

---[FILE: code.mdx]---
Location: payload-main/docs/fields/code.mdx

```text
---
title: Code Field
label: Code
order: 50
desc: The Code field type will store any string in the Database. Learn how to use Code fields, see examples and options.

keywords: code, fields, config, configuration, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

The Code Field saves a string in the database, but provides the [Admin Panel](../admin/overview) with a code editor styled interface.

<LightDarkImage
  srcLight="https://payloadcms.com/images/docs/fields/code.png"
  srcDark="https://payloadcms.com/images/docs/fields/code-dark.png"
  alt="Shows a Code field in the Payload Admin Panel"
  caption="This field is using the `monaco-react` editor syntax highlighting."
/>

To add a Code Field, set the `type` to `code` in your [Field Config](./overview):

```ts
import type { Field } from 'payload'

export const MyBlocksField: Field = {
  // ...
  type: 'code', // highlight-line
}
```

## Config Options

| Option                 | Description                                                                                                                                                                                                                                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`name`** \*          | To be used as the property name when stored and retrieved from the database. [More details](/docs/fields/overview#field-names).                                                                                                                                                                         |
| **`label`**            | Text used as a field label in the Admin Panel or an object with keys for each language.                                                                                                                                                                                                                 |
| **`unique`**           | Enforce that each entry in the Collection has a unique value for this field.                                                                                                                                                                                                                            |
| **`index`**            | Build an [index](../database/indexes) for this field to produce faster queries. Set this field to `true` if your users will perform queries on this field's data often.                                                                                                                                 |
| **`minLength`**        | Used by the default validation function to ensure values are of a minimum character length.                                                                                                                                                                                                             |
| **`maxLength`**        | Used by the default validation function to ensure values are of a maximum character length.                                                                                                                                                                                                             |
| **`validate`**         | Provide a custom validation function that will be executed on both the Admin Panel and the backend. [More details](/docs/fields/overview#validation).                                                                                                                                                   |
| **`saveToJWT`**        | If this field is top-level and nested in a config supporting [Authentication](/docs/authentication/overview), include its data in the user JWT.                                                                                                                                                         |
| **`hooks`**            | Provide Field Hooks to control logic for this field. [More details](../hooks/fields).                                                                                                                                                                                                                   |
| **`access`**           | Provide Field Access Control to denote what users can see and do with this field's data. [More details](../access-control/fields).                                                                                                                                                                      |
| **`hidden`**           | Restrict this field's visibility from all APIs entirely. Will still be saved to the database, but will not appear in any API or the Admin Panel.                                                                                                                                                        |
| **`defaultValue`**     | Provide data to be used for this field's default value. [More details](/docs/fields/overview#default-values).                                                                                                                                                                                           |
| **`localized`**        | Enable localization for this field. Requires [localization to be enabled](/docs/configuration/localization) in the Base config.                                                                                                                                                                         |
| **`required`**         | Require this field to have a value.                                                                                                                                                                                                                                                                     |
| **`admin`**            | Admin-specific configuration. See below for [more detail](#admin-options).                                                                                                                                                                                                                              |
| **`custom`**           | Extension point for adding custom data (e.g. for plugins)                                                                                                                                                                                                                                               |
| **`typescriptSchema`** | Override field type generation with providing a JSON schema                                                                                                                                                                                                                                             |
| **`virtual`**          | Provide `true` to disable field in the database, or provide a string path to [link the field with a relationship](/docs/fields/relationship#linking-virtual-fields-with-relationships). See [Virtual Fields](https://payloadcms.com/blog/learn-how-virtual-fields-can-help-solve-common-cms-challenges) |

_\* An asterisk denotes that a property is required._

## Admin Options

To customize the appearance and behavior of the Code Field in the [Admin Panel](../admin/overview), you can use the `admin` option:

```ts
import type { Field } from 'payload'

export const MyCodeField: Field = {
  // ...
  admin: {
    // highlight-line
    // ...
  },
}
```

The Code Field inherits all of the default admin options from the base [Field Admin Config](./overview#admin-options), plus the following additional options:

| Option              | Description                                                                                                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`language`**      | This property can be set to any language listed [here](https://github.com/microsoft/monaco-editor/tree/main/src/basic-languages).                                               |
| **`editorOptions`** | Options that can be passed to the monaco editor, [view the full list](https://microsoft.github.io/monaco-editor/typedoc/interfaces/editor.IDiffEditorConstructionOptions.html). |

## Example

`collections/ExampleCollection.ts

```ts
import type { CollectionConfig } from 'payload'

export const ExampleCollection: CollectionConfig = {
  slug: 'example-collection',
  fields: [
    {
      name: 'trackingCode', // required
      type: 'code', // required
      required: true,
      admin: {
        language: 'javascript',
      },
    },
  ],
}
```

## Custom Components

### Field

#### Server Component

```tsx
import type React from 'react'
import { CodeField } from '@payloadcms/ui'
import type { CodeFieldServerComponent } from 'payload'

export const CustomCodeFieldServer: CodeFieldServerComponent = ({
  clientField,
  path,
  schemaPath,
  permissions,
}) => {
  return (
    <CodeField
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
import { CodeField } from '@payloadcms/ui'
import type { CodeFieldClientComponent } from 'payload'

export const CustomCodeFieldClient: CodeFieldClientComponent = (props) => {
  return <CodeField {...props} />
}
```

### Label

#### Server Component

```tsx
import React from 'react'
import { FieldLabel } from '@payloadcms/ui'
import type { CodeFieldLabelServerComponent } from 'payload'

export const CustomCodeFieldLabelServer: CodeFieldLabelServerComponent = ({
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
import type { CodeFieldLabelClientComponent } from 'payload'

export const CustomCodeFieldLabelClient: CodeFieldLabelClientComponent = ({
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

---[FILE: collapsible.mdx]---
Location: payload-main/docs/fields/collapsible.mdx

```text
---
title: Collapsible Field
label: Collapsible
order: 60
desc: With the Collapsible field, you can place fields within a collapsible layout component that can be collapsed / expanded.
keywords: row, fields, config, configuration, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

The Collapsible Field is presentational-only and only affects the Admin Panel. By using it, you can place fields within a nice layout component that can be collapsed / expanded.

<LightDarkImage
  srcLight="https://payloadcms.com/images/docs/fields/collapsible.png"
  srcDark="https://payloadcms.com/images/docs/fields/collapsible-dark.png"
  alt="Shows a Collapsible field in the Payload Admin Panel"
  caption="Admin Panel screenshot of a Collapsible field"
/>

To add a Collapsible Field, set the `type` to `collapsible` in your [Field Config](./overview):

```ts
import type { Field } from 'payload'

export const MyCollapsibleField: Field = {
  // ...
  // highlight-start
  type: 'collapsible',
  fields: [
    // ...
  ],
  // highlight-end
}
```

## Config Options

| Option          | Description                                                                                                                                                                  |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`label`** \*  | A label to render within the header of the collapsible component. This can be a string, function or react component. Function/components receive `({ data, path })` as args. |
| **`fields`** \* | Array of field types to nest within this Collapsible.                                                                                                                        |
| **`admin`**     | Admin-specific configuration. [More details](#admin-options).                                                                                                                |
| **`custom`**    | Extension point for adding custom data (e.g. for plugins)                                                                                                                    |

_\* An asterisk denotes that a property is required._

## Admin Options

To customize the appearance and behavior of the Collapsible Field in the [Admin Panel](../admin/overview), you can use the `admin` option:

```ts
import type { Field } from 'payload'

export const MyCollapsibleField: Field = {
  // ...
  admin: {
    // highlight-line
    // ...
  },
}
```

The Collapsible Field inherits all of the default admin options from the base [Field Admin Config](./overview#admin-options), plus the following additional options:

| Option              | Description                     |
| ------------------- | ------------------------------- |
| **`initCollapsed`** | Set the initial collapsed state |

## Example

```ts
import type { CollectionConfig } from 'payload'

export const ExampleCollection: CollectionConfig = {
  slug: 'example-collection',
  fields: [
    {
      label: ({ data }) => data?.title || 'Untitled',
      type: 'collapsible', // required
      fields: [
        // required
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'someTextField',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
```
```

--------------------------------------------------------------------------------

---[FILE: date.mdx]---
Location: payload-main/docs/fields/date.mdx

```text
---
title: Date Field
label: Date
order: 70
desc: The Date field type stores a Date in the database. Learn how to use and customize the Date field, see examples and options.
keywords: date, fields, config, configuration, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

The Date Field saves a Date in the database and provides the [Admin Panel](../admin/overview) with a customizable time picker interface.

<LightDarkImage
  srcLight="https://payloadcms.com/images/docs/fields/date.png"
  srcDark="https://payloadcms.com/images/docs/fields/date-dark.png"
  alt="Shows a Date field in the Payload Admin Panel"
  caption="This field is using the `react-datepicker` component for UI."
/>

To add a Date Field, set the `type` to `date` in your [Field Config](./overview):

```ts
import type { Field } from 'payload'

export const MyDateField: Field = {
  // ...
  type: 'date', // highlight-line
}
```

## Config Options

| Option                 | Description                                                                                                                                                                                                                                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`name`** \*          | To be used as the property name when stored and retrieved from the database. [More details](/docs/fields/overview#field-names).                                                                                                                                                                         |
| **`label`**            | Text used as a field label in the Admin Panel or an object with keys for each language.                                                                                                                                                                                                                 |
| **`index`**            | Build an [index](../database/indexes) for this field to produce faster queries. Set this field to `true` if your users will perform queries on this field's data often.                                                                                                                                 |
| **`validate`**         | Provide a custom validation function that will be executed on both the Admin Panel and the backend. [More details](/docs/fields/overview#validation).                                                                                                                                                   |
| **`saveToJWT`**        | If this field is top-level and nested in a config supporting [Authentication](/docs/authentication/overview), include its data in the user JWT.                                                                                                                                                         |
| **`hooks`**            | Provide Field Hooks to control logic for this field. [More details](../hooks/fields).                                                                                                                                                                                                                   |
| **`access`**           | Provide Field Access Control to denote what users can see and do with this field's data. [More details](../access-control/fields).                                                                                                                                                                      |
| **`hidden`**           | Restrict this field's visibility from all APIs entirely. Will still be saved to the database, but will not appear in any API or the Admin Panel.                                                                                                                                                        |
| **`defaultValue`**     | Provide data to be used for this field's default value. [More details](/docs/fields/overview#default-values).                                                                                                                                                                                           |
| **`localized`**        | Enable localization for this field. Requires [localization to be enabled](/docs/configuration/localization) in the Base config.                                                                                                                                                                         |
| **`required`**         | Require this field to have a value.                                                                                                                                                                                                                                                                     |
| **`admin`**            | Admin-specific configuration. [More details](#admin-options).                                                                                                                                                                                                                                           |
| **`custom`**           | Extension point for adding custom data (e.g. for plugins)                                                                                                                                                                                                                                               |
| **`timezone`** \*      | Set to `true` to enable timezone selection on this field. [More details](#timezones).                                                                                                                                                                                                                   |
| **`typescriptSchema`** | Override field type generation with providing a JSON schema                                                                                                                                                                                                                                             |
| **`virtual`**          | Provide `true` to disable field in the database, or provide a string path to [link the field with a relationship](/docs/fields/relationship#linking-virtual-fields-with-relationships). See [Virtual Fields](https://payloadcms.com/blog/learn-how-virtual-fields-can-help-solve-common-cms-challenges) |

_\* An asterisk denotes that a property is required._

## Admin Options

To customize the appearance and behavior of the Date Field in the [Admin Panel](../admin/overview), you can use the `admin` option:

```ts
import type { Field } from 'payload'

export const MyDateField: Field = {
  // ...
  admin: {
    // highlight-line
    // ...
  },
}
```

The Date Field inherits all of the default admin options from the base [Field Admin Config](./overview#admin-options), plus the following additional options:

| Property                       | Description                                                                                                                            |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| **`placeholder`**              | Placeholder text for the field.                                                                                                        |
| **`date`**                     | Pass options to customize date field appearance.                                                                                       |
| **`date.displayFormat`**       | Format date to be shown in field **cell**.                                                                                             |
| **`date.pickerAppearance`** \* | Determines the appearance of the datepicker: `dayAndTime` `timeOnly` `dayOnly` `monthOnly`.                                            |
| **`date.monthsToShow`** \*     | Number of months to display max is 2. Defaults to 1.                                                                                   |
| **`date.minDate`** \*          | Min date value to allow.                                                                                                               |
| **`date.maxDate`** \*          | Max date value to allow.                                                                                                               |
| **`date.minTime`** \*          | Min time value to allow.                                                                                                               |
| **`date.maxTime`** \*          | Max date value to allow.                                                                                                               |
| **`date.overrides`** \*        | Pass any valid props directly to the [react-datepicker](https://github.com/Hacker0x01/react-datepicker/blob/master/docs/datepicker.md) |
| **`date.timeIntervals`** \*    | Time intervals to display. Defaults to 30 minutes.                                                                                     |
| **`date.timeFormat`** \*       | Determines time format. Defaults to `'h:mm aa'`.                                                                                       |

_\* This property is passed directly to [react-datepicker](https://github.com/Hacker0x01/react-datepicker/blob/master/docs/datepicker.md)._

### Display Format and Picker Appearance

These properties only affect how the date is displayed in the UI. The full date is always stored in the format `YYYY-MM-DDTHH:mm:ss.SSSZ` (e.g. `1999-01-01T8:00:00.000+05:00`).

`displayFormat` determines how the date is presented in the field **cell**, you can pass any valid [unicode date format](https://date-fns.org/v4.1.0/docs/format).

`pickerAppearance` sets the appearance of the **react datepicker**, the options available are `dayAndTime`, `dayOnly`, `timeOnly`, and `monthOnly`. By default, the datepicker will display `dayOnly`.

When only `pickerAppearance` is set, an equivalent format will be rendered in the date field cell. To overwrite this format, set `displayFormat`.

## Example

```ts
import type { CollectionConfig } from 'payload'

export const ExampleCollection: CollectionConfig = {
  slug: 'example-collection',
  fields: [
    {
      name: 'dateOnly',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'd MMM yyy',
        },
      },
    },
    {
      name: 'timeOnly',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'timeOnly',
          displayFormat: 'h:mm:ss a',
        },
      },
    },
    {
      name: 'monthOnly',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'monthOnly',
          displayFormat: 'MMMM yyyy',
        },
      },
    },
  ],
}
```

## Custom Components

### Field

#### Server Component

```tsx
import type React from 'react'
import { DateTimeField } from '@payloadcms/ui'
import type { DateFieldServerComponent } from 'payload'

export const CustomDateFieldServer: DateFieldServerComponent = ({
  clientField,
  path,
  schemaPath,
  permissions,
}) => {
  return (
    <DateTimeField
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
import { DateTimeField } from '@payloadcms/ui'
import type { DateFieldClientComponent } from 'payload'

export const CustomDateFieldClient: DateFieldClientComponent = (props) => {
  return <DateTimeField {...props} />
}
```

### Label

#### Server Component

```tsx
import React from 'react'
import { FieldLabel } from '@payloadcms/ui'
import type { DateFieldLabelServerComponent } from 'payload'

export const CustomDateFieldLabelServer: DateFieldLabelServerComponent = ({
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
import type { DateFieldLabelClientComponent } from 'payload'

export const CustomDateFieldLabelClient: DateFieldLabelClientComponent = ({
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

## Timezones

To enable timezone selection on a Date field, set the `timezone` property to `true`:

```ts
{
  name: 'date',
  type: 'date',
  timezone: true,
}
```

This will add a dropdown to the date picker that allows users to select a timezone. The selected timezone will be saved in the database along with the date in a new column named `date_tz`.

You can customise the available list of timezones in the [global admin config](../admin/overview#timezones) or on the field config itself which accepts the following config as well:

| Property             | Description                                                               |
| -------------------- | ------------------------------------------------------------------------- |
| `defaultTimezone`    | A value for the default timezone to be set.                               |
| `supportedTimezones` | An array of supported timezones with label and value object.              |
| `required`           | If true, the timezone selection will be required even if the date is not. |

```ts
{
  name: 'date',
  type: 'date',
  timezone: {
    defaultTimezone: 'America/New_York',
    supportedTimezones: [
      { label: 'New York', value: 'America/New_York' },
      { label: 'Los Angeles', value: 'America/Los_Angeles' },
      { label: 'London', value: 'Europe/London' },
    ],
  },
}
```

<Banner type="info">
  **Good to know:**
  The date itself will be stored in UTC so it's up to you to handle the conversion to the user's timezone when displaying the date in your frontend.

Dates without a specific time are normalised to 12:00 in the selected timezone.

</Banner>
```

--------------------------------------------------------------------------------

---[FILE: email.mdx]---
Location: payload-main/docs/fields/email.mdx

```text
---
title: Email Field
label: Email
order: 80
desc: The Email field enforces that the value provided is a valid email address. Learn how to use Email fields, see examples and options.
keywords: email, fields, config, configuration, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

The Email Field enforces that the value provided is a valid email address.

<LightDarkImage
  srcLight="https://payloadcms.com/images/docs/fields/email.png"
  srcDark="https://payloadcms.com/images/docs/fields/email-dark.png"
  alt="Shows an Email field in the Payload Admin Panel"
  caption="Admin Panel screenshot of an Email field"
/>

To create an Email Field, set the `type` to `email` in your [Field Config](./overview):

```ts
import type { Field } from 'payload'

export const MyEmailField: Field = {
  // ...
  type: 'email', // highlight-line
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

To customize the appearance and behavior of the Email Field in the [Admin Panel](../admin/overview), you can use the `admin` option:

```ts
import type { Field } from 'payload'

export const MyEmailField: Field = {
  // ...
  admin: {
    // highlight-line
    // ...
  },
}
```

The Email Field inherits all of the default admin options from the base [Field Admin Config](./overview#admin-options), plus the following additional options:

| Property           | Description                                                               |
| ------------------ | ------------------------------------------------------------------------- |
| **`placeholder`**  | Set this property to define a placeholder string for the field.           |
| **`autoComplete`** | Set this property to a string that will be used for browser autocomplete. |

## Example

```ts
import type { CollectionConfig } from 'payload'

export const ExampleCollection: CollectionConfig = {
  slug: 'example-collection',
  fields: [
    {
      name: 'contact', // required
      type: 'email', // required
      label: 'Contact Email Address',
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
import { EmailField } from '@payloadcms/ui'
import type { EmailFieldServerComponent } from 'payload'

export const CustomEmailFieldServer: EmailFieldServerComponent = ({
  clientField,
  path,
  schemaPath,
  permissions,
}) => {
  return (
    <EmailField
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
import { EmailField } from '@payloadcms/ui'
import type { EmailFieldClientComponent } from 'payload'

export const CustomEmailFieldClient: EmailFieldClientComponent = (props) => {
  return <EmailField {...props} />
}
```

### Label

#### Server Component

```tsx
import React from 'react'
import { FieldLabel } from '@payloadcms/ui'
import type { EmailFieldLabelServerComponent } from 'payload'

export const CustomEmailFieldLabelServer: EmailFieldLabelServerComponent = ({
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
import type { EmailFieldLabelClientComponent } from 'payload'

export const CustomEmailFieldLabelClient: EmailFieldLabelClientComponent = ({
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
