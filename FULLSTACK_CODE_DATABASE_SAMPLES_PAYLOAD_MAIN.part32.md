---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 32
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 32 of 695)

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
Location: payload-main/docs/email/overview.mdx

```text
---
title: Email Functionality
label: Overview
order: 10
desc: Payload uses an adapter pattern to enable email functionality. Set up email functions such as password resets, order confirmations and more.
keywords: email, overview, config, configuration, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

## Introduction

Payload has a few email adapters that can be imported to enable email functionality. The [@payloadcms/email-nodemailer](https://www.npmjs.com/package/@payloadcms/email-nodemailer) package will be the package most will want to install. This package provides an easy way to use [Nodemailer](https://nodemailer.com) for email and won't get in your way for those already familiar.

The email adapter should be passed into the `email` property of the Payload Config. This will allow Payload to send [auth-related emails](../authentication/email) for things like password resets, new user verification, and any other email sending needs you may have.

## Configuration

### Default Configuration

When email is not needed or desired, Payload will log a warning on startup notifying that email is not configured. A warning message will also be logged on any attempt to send an email.

### Email Adapter

An email adapter will require at least the following fields:

| Option                      | Description                                                                      |
| --------------------------- | -------------------------------------------------------------------------------- |
| **`defaultFromName`** \*    | The name part of the From field that will be seen on the delivered email         |
| **`defaultFromAddress`** \* | The email address part of the From field that will be used when delivering email |

### Official Email Adapters

| Name       | Package                                                                                    | Description                                                                                                                                                                                     |
| ---------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nodemailer | [@payloadcms/email-nodemailer](https://www.npmjs.com/package/@payloadcms/email-nodemailer) | Use any [Nodemailer transport](https://nodemailer.com/transports), including SMTP, Resend, SendGrid, and more. This was provided by default in Payload 2.x. This is the easiest migration path. |
| Resend     | [@payloadcms/email-resend](https://www.npmjs.com/package/@payloadcms/email-resend)         | Resend email via their REST API. This is preferred for serverless platforms such as Vercel because it is much more lightweight than the nodemailer adapter.                                     |

## Nodemailer Configuration

| Option                 | Description                                                                                                                                                                            |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`transport`**        | The Nodemailer transport object for when you want to do it yourself, not needed when transportOptions is set                                                                           |
| **`transportOptions`** | An object that configures the transporter that Payload will create. For all the available options see the [Nodemailer documentation](https://nodemailer.com) or see the examples below |

## Use SMTP

Simple Mail Transfer Protocol (SMTP) options can be passed in using the `transportOptions` object on the `email` options. See the [Nodemailer SMTP documentation](https://nodemailer.com/smtp/) for more information, including details on when `secure` should and should not be set to `true`.

**Example email options using SMTP:**

```ts
import { buildConfig } from 'payload'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

export default buildConfig({
  email: nodemailerAdapter({
    defaultFromAddress: 'info@payloadcms.com',
    defaultFromName: 'Payload',
    // Nodemailer transportOptions
    transportOptions: {
      host: process.env.SMTP_HOST,
      port: 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  }),
})
```

**Example email options using nodemailer.createTransport:**

```ts
import { buildConfig } from 'payload'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import nodemailer from 'nodemailer'

export default buildConfig({
  email: nodemailerAdapter({
    defaultFromAddress: 'info@payloadcms.com',
    defaultFromName: 'Payload',
    // Any Nodemailer transport can be used
    transport: nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    }),
  }),
})
```

**Custom Transport:**

You also have the ability to bring your own nodemailer transport. This is an example of using the SendGrid nodemailer transport.

```ts
import { buildConfig } from 'payload'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import nodemailerSendgrid from 'nodemailer-sendgrid'

export default buildConfig({
  email: nodemailerAdapter({
    defaultFromAddress: 'info@payloadcms.com',
    defaultFromName: 'Payload',
    transportOptions: nodemailerSendgrid({
      apiKey: process.env.SENDGRID_API_KEY,
    }),
  }),
})
```

During development, if you pass nothing to `nodemailerAdapter`, it will use the [ethereal.email](https://ethereal.email) service.

This will log the ethereal.email details to console on startup.

```ts
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

export default buildConfig({
  email: nodemailerAdapter(),
})
```

## Resend Configuration

The Resend adapter requires an API key to be passed in the options. This can be found in the Resend dashboard. This is the preferred package if you are deploying on Vercel because this is much more lightweight than the Nodemailer adapter.

| Option | Description                         |
| ------ | ----------------------------------- |
| apiKey | The API key for the Resend service. |

```ts
import { buildConfig } from 'payload'
import { resendAdapter } from '@payloadcms/email-resend'

export default buildConfig({
  email: resendAdapter({
    defaultFromAddress: 'dev@payloadcms.com',
    defaultFromName: 'Payload CMS',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
})
```

## Sending Mail

With a working transport you can call it anywhere you have access to Payload by calling `payload.sendEmail(message)`. The `message` will contain the `to`, `subject` and `html` or `text` for the email being sent. Other options are also available and can be seen in the sendEmail args. Support for these will depend on the adapter being used.

```ts
// Example of sending an email
const email = await payload.sendEmail({
  to: 'test@example.com',
  subject: 'This is a test email',
  text: 'This is my message body',
})
```

## Sending email with attachments

**Nodemailer adapter (SMTP/SendGrid/etc.)**

Works with `@payloadcms/email-nodemailer` and any Nodemailer transport.

```ts
await payload.sendEmail({
  to: 'user@example.com',
  subject: 'Your report',
  html: '<p>See attached.</p>',
  attachments: [
    // From a file path (local disk, mounted volume, etc.)
    {
      filename: 'invoice.pdf',
      path: '/var/data/invoice.pdf',
      contentType: 'application/pdf',
    },
    // From a Buffer you generated at runtime
    {
      filename: 'report.csv',
      content: Buffer.from('col1,col2\nA,B\n'),
      contentType: 'text/csv',
    },
  ],
})
```

Anything supported by Nodemailer’s attachments—streams, Buffers, URLs, content IDs for inline images (cid), etc.—will work here.

### Resend adapter

Works with @payloadcms/email-resend.

For attachments from remote URLs

```ts
await payload.sendEmail({
  to: 'user@example.com',
  subject: 'Your invoice',
  html: '<p>Thanks! Invoice attached.</p>',
  attachments: [
    {
      // Resend will fetch this URL
      path: 'https://example.com/invoices/1234.pdf',
      filename: 'invoice-1234.pdf',
    },
  ],
})
```

For a local file

```ts
import { readFile } from 'node:fs/promises'
const pdf = await readFile('/var/data/invoice.pdf')
await payload.sendEmail({
  to: 'user@example.com',
  subject: 'Your invoice',
  html: '<p>Thanks! Invoice attached.</p>',
  attachments: [
    {
      filename: 'invoice.pdf',
      // Resend expects Base64 here
      content: pdf.toString('base64'),
    },
  ],
})
```

## Attaching files from Payload media collections

If you store files in a Payload collection with `upload: true`, you can attach them to emails by fetching the document and using its file data.

**Example: Attaching a file from a Media collection**

```ts
const mediaDoc = await payload.findByID({
  collection: 'media',
  id: 'your-file-id',
})

// For local storage adapter
await payload.sendEmail({
  to: 'user@example.com',
  subject: 'Your document',
  html: '<p>Attached is the document you requested.</p>',
  attachments: [
    {
      filename: mediaDoc.filename,
      path: mediaDoc.url, // Local file path when using local storage
      contentType: mediaDoc.mimeType,
    },
  ],
})

// For cloud storage (S3, Azure, GCS, etc.)
const response = await fetch(mediaDoc.url)
const buffer = Buffer.from(await response.arrayBuffer())

await payload.sendEmail({
  to: 'user@example.com',
  subject: 'Your document',
  html: '<p>Attached is the document you requested.</p>',
  attachments: [
    {
      filename: mediaDoc.filename,
      content: buffer,
      contentType: mediaDoc.mimeType,
    },
  ],
})
```

### With Resend adapter:

```ts
const mediaDoc = await payload.findByID({
  collection: 'media',
  id: 'your-file-id',
})

// If using cloud storage, Resend can fetch from the URL directly
await payload.sendEmail({
  to: 'user@example.com',
  subject: 'Your document',
  html: '<p>Attached is the document you requested.</p>',
  attachments: [
    {
      filename: mediaDoc.filename,
      path: mediaDoc.url, // Resend will fetch from this URL
    },
  ],
})

// For local storage, read the file and convert to Base64
import { readFile } from 'node:fs/promises'
const fileBuffer = await readFile(mediaDoc.url)

await payload.sendEmail({
  to: 'user@example.com',
  subject: 'Your document',
  html: '<p>Attached is the document you requested.</p>',
  attachments: [
    {
      filename: mediaDoc.filename,
      content: fileBuffer.toString('base64'),
    },
  ],
})
```

## Using multiple mail providers

Payload supports the use of a single transporter of email, but there is nothing stopping you from having more. Consider a use case where sending bulk email is handled differently than transactional email and could be done using a [hook](/docs/hooks/overview).
```

--------------------------------------------------------------------------------

---[FILE: overview.mdx]---
Location: payload-main/docs/examples/overview.mdx

```text
---
title: Examples
label: Overview
order: 10
desc:
keywords: example, examples, starter, boilerplate, template, templates
---

Payload provides a vast array of examples to help you get started with your project no matter what you are working on. These examples are designed to be easy to get up and running, and to be easy to understand. They showcase nothing more than the specific features being demonstrated so you can easily decipher precisely what is going on.

- [Auth](https://github.com/payloadcms/payload/tree/main/examples/auth)
- [Custom Components](https://github.com/payloadcms/payload/tree/main/examples/custom-components)
- [Draft Preview](https://github.com/payloadcms/payload/tree/main/examples/draft-preview)
- [Email](https://github.com/payloadcms/payload/tree/main/examples/email)
- [Form Builder](https://github.com/payloadcms/payload/tree/main/examples/form-builder)
- [Live Preview](https://github.com/payloadcms/payload/tree/main/examples/live-preview)
- [Multi-tenant](https://github.com/payloadcms/payload/tree/main/examples/multi-tenant)
- [Tailwind / Shadcn-ui](https://github.com/payloadcms/payload/tree/main/examples/tailwind-shadcn-ui)
- [White-label Admin UI](https://github.com/payloadcms/payload/tree/main/examples/whitelabel)

If you'd like to run the examples, you can use `create-payload-app` to create a project from one:

```sh
npx create-payload-app --example example_name
```

We are adding new examples every day, so if your particular use case is not demonstrated in any existing example, please feel free to start a new [Discussion](https://github.com/payloadcms/payload/discussions) or open a new [PR](https://github.com/payloadcms/payload/pulls) to add it yourself.
```

--------------------------------------------------------------------------------

---[FILE: array.mdx]---
Location: payload-main/docs/fields/array.mdx

```text
---
title: Array Field
label: Array
order: 20
desc: Array Fields are intended for sets of repeating fields, that you define. Learn how to use Array Fields, see examples and options.
keywords: array, fields, config, configuration, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

The Array Field is used when you need to have a set of "repeating" [Fields](./overview). It stores an array of objects containing fields that you define. These fields can be of any type, including other arrays, to achieve infinitely nested data structures.

Arrays are useful for many different types of content from simple to complex, such as:

- A "slider" with an image ([upload field](/docs/fields/upload)) and a caption ([text field](/docs/fields/text))
- Navigational structures where editors can specify nav items containing pages ([relationship field](/docs/fields/relationship)), an "open in new tab" [checkbox field](/docs/fields/checkbox)
- Event agenda "timeslots" where you need to specify start & end time ([date field](/docs/fields/date)), label ([text field](/docs/fields/text)), and Learn More page [relationship](/docs/fields/relationship)

<LightDarkImage
  srcLight="https://payloadcms.com/images/docs/fields/array.png"
  srcDark="https://payloadcms.com/images/docs/fields/array-dark.png"
  alt="Array field with two Rows in Payload Admin Panel"
  caption="Admin Panel screenshot of an Array field with two Rows"
/>

To create an Array Field, set the `type` to `array` in your [Field Config](./overview):

```ts
import type { Field } from 'payload'

export const MyArrayField: Field = {
  // ...
  // highlight-start
  type: 'array',
  fields: [
    // ...
  ],
  // highlight-end
}
```

## Config Options

| Option                 | Description                                                                                                                                                                                                                                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`name`** \*          | To be used as the property name when stored and retrieved from the database. [More details](/docs/fields/overview#field-names).                                                                                                                                                                         |
| **`label`**            | Text used as the heading in the [Admin Panel](../admin/overview) or an object with keys for each language. Auto-generated from name if not defined.                                                                                                                                                     |
| **`fields`** \*        | Array of field types to correspond to each row of the Array.                                                                                                                                                                                                                                            |
| **`validate`**         | Provide a custom validation function that will be executed on both the [Admin Panel](../admin/overview) and the backend. [More details](/docs/fields/overview#validation).                                                                                                                              |
| **`minRows`**          | A number for the fewest allowed items during validation when a value is present.                                                                                                                                                                                                                        |
| **`maxRows`**          | A number for the most allowed items during validation when a value is present.                                                                                                                                                                                                                          |
| **`saveToJWT`**        | If this field is top-level and nested in a config supporting [Authentication](/docs/authentication/overview), include its data in the user JWT.                                                                                                                                                         |
| **`hooks`**            | Provide Field Hooks to control logic for this field. [More details](../hooks/fields).                                                                                                                                                                                                                   |
| **`access`**           | Provide Field Access Control to denote what users can see and do with this field's data. [More details](../access-control/fields).                                                                                                                                                                      |
| **`hidden`**           | Restrict this field's visibility from all APIs entirely. Will still be saved to the database, but will not appear in any API or the Admin Panel.                                                                                                                                                        |
| **`defaultValue`**     | Provide an array of row data to be used for this field's default value. [More details](/docs/fields/overview#default-values).                                                                                                                                                                           |
| **`localized`**        | Enable localization for this field. Requires [localization to be enabled](/docs/configuration/localization) in the Base config. If enabled, a separate, localized set of all data within this Array will be kept, so there is no need to specify each nested field as `localized`.                      |
| **`required`**         | Require this field to have a value.                                                                                                                                                                                                                                                                     |
| **`labels`**           | Customize the row labels appearing in the Admin dashboard.                                                                                                                                                                                                                                              |
| **`admin`**            | Admin-specific configuration. [More details](#admin-options).                                                                                                                                                                                                                                           |
| **`custom`**           | Extension point for adding custom data (e.g. for plugins)                                                                                                                                                                                                                                               |
| **`interfaceName`**    | Create a top level, reusable [Typescript interface](/docs/typescript/generating-types#custom-field-interfaces) & [GraphQL type](/docs/graphql/graphql-schema#custom-field-schemas).                                                                                                                     |
| **`dbName`**           | Custom table name for the field when using SQL Database Adapter ([Postgres](/docs/database/postgres)). Auto-generated from name if not defined.                                                                                                                                                         |
| **`typescriptSchema`** | Override field type generation with providing a JSON schema                                                                                                                                                                                                                                             |
| **`virtual`**          | Provide `true` to disable field in the database, or provide a string path to [link the field with a relationship](/docs/fields/relationship#linking-virtual-fields-with-relationships). See [Virtual Fields](https://payloadcms.com/blog/learn-how-virtual-fields-can-help-solve-common-cms-challenges) |

_\* An asterisk denotes that a property is required._

## Admin Options

To customize the appearance and behavior of the Array Field in the [Admin Panel](../admin/overview), you can use the `admin` option:

```ts
import type { Field } from 'payload'

export const MyArrayField: Field = {
  // ...
  admin: {
    // highlight-line
    // ...
  },
}
```

The Array Field inherits all of the default admin options from the base [Field Admin Config](./overview#admin-options), plus the following additional options:

| Option                    | Description                                                                         |
| ------------------------- | ----------------------------------------------------------------------------------- |
| **`initCollapsed`**       | Set the initial collapsed state                                                     |
| **`components.RowLabel`** | React component to be rendered as the label on the array row. [Example](#row-label) |
| **`isSortable`**          | Disable order sorting by setting this value to `false`                              |

## Example

In this example, we have an Array Field called `slider` that contains a set of fields for a simple image slider. Each row in the array has a `title`, `image`, and `caption`. We also customize the row label to display the title if it exists, or a default label if it doesn't.

```ts
import type { CollectionConfig } from 'payload'

export const ExampleCollection: CollectionConfig = {
  slug: 'example-collection',
  fields: [
    {
      name: 'slider', // required
      type: 'array', // required
      label: 'Image Slider',
      minRows: 2,
      maxRows: 10,
      interfaceName: 'CardSlider', // optional
      labels: {
        singular: 'Slide',
        plural: 'Slides',
      },
      fields: [
        // required
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
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
import type React from 'react'
import { ArrayField } from '@payloadcms/ui'
import type { ArrayFieldServerComponent } from 'payload'

export const CustomArrayFieldServer: ArrayFieldServerComponent = ({
  clientField,
  path,
  schemaPath,
  permissions,
}) => {
  return (
    <ArrayField
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
import { ArrayField } from '@payloadcms/ui'
import type { ArrayFieldClientComponent } from 'payload'

export const CustomArrayFieldClient: ArrayFieldClientComponent = (props) => {
  return <ArrayField {...props} />
}
```

### Label

#### Server Component

```tsx
import React from 'react'
import { FieldLabel } from '@payloadcms/ui'
import type { ArrayFieldLabelServerComponent } from 'payload'

export const CustomArrayFieldLabelServer: ArrayFieldLabelServerComponent = ({
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
import type { ArrayFieldLabelClientComponent } from 'payload'

import { FieldLabel } from '@payloadcms/ui'
import React from 'react'

export const CustomArrayFieldLabelClient: ArrayFieldLabelClientComponent = ({
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

### Row Label

```tsx
'use client'

import { useRowLabel } from '@payloadcms/ui'

export const ArrayRowLabel = () => {
  const { data, rowNumber } = useRowLabel<{ title?: string }>()

  const customLabel = `${data.title || 'Slide'} ${String(rowNumber).padStart(2, '0')} `

  return <div>Custom Label: {customLabel}</div>
}
```
```

--------------------------------------------------------------------------------

````
