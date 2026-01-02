---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 52
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 52 of 695)

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

---[FILE: form-builder.mdx]---
Location: payload-main/docs/plugins/form-builder.mdx

```text
---
title: Form Builder Plugin
label: Form Builder
order: 30
desc: Easily build and manage forms from the Admin Panel. Send dynamic, personalized emails and even accept and process payments.
keywords: plugins, plugin, form, forms, form builder
---

![https://www.npmjs.com/package/@payloadcms/plugin-form-builder](https://img.shields.io/npm/v/@payloadcms/plugin-form-builder)

This plugin allows you to build and manage custom forms directly within the [Admin Panel](../admin/overview). Instead of hard-coding a new form into your website or application every time you need one, admins can simply define the schema for each form they need on-the-fly, and your front-end can map over this schema, render its own UI components, and match your brand's design system.

All form submissions are stored directly in your database and are managed directly from the Admin Panel. When forms are submitted, you can display a custom on-screen confirmation message to the user or redirect them to a dedicated confirmation page. You can even send dynamic, personalized emails derived from the form's data. For example, you may want to send a confirmation email to the user who submitted the form, and also send a notification email to your team.

Forms can be as simple or complex as you need, from a basic contact form, to a multi-step lead generation engine, or even a donation form that processes payment. You may not need to reach for third-party services like HubSpot or Mailchimp for this, but instead use your own first-party tooling, built directly into your own application.

<Banner type="info">
  This plugin is completely open-source and the [source code can be found
  here](https://github.com/payloadcms/payload/tree/main/packages/plugin-form-builder).
  If you need help, check out our [Community
  Help](https://payloadcms.com/community-help). If you think you've found a bug,
  please [open a new
  issue](https://github.com/payloadcms/payload/issues/new?assignees=&labels=plugin%3A%20form-builder&template=bug_report.md&title=plugin-form-builder%3A)
  with as much detail as possible.
</Banner>

## Core Features

- Build completely dynamic forms directly from the Admin Panel for a variety of use cases
- Render forms on your front-end using your own UI components and match your brand's design system
- Send dynamic, personalized emails upon form submission to multiple recipients, derived from the form's data
- Display a custom confirmation message or automatically redirect upon form submission
- Build dynamic prices based on form input to use for payment processing (optional)

## Installation

Install the plugin using any JavaScript package manager like [pnpm](https://pnpm.io), [npm](https://npmjs.com), or [Yarn](https://yarnpkg.com):

```bash
pnpm add @payloadcms/plugin-form-builder
```

## Basic Usage

In the `plugins` array of your [Payload Config](https://payloadcms.com/docs/configuration/overview), call the plugin with [options](#options):

```ts
import { buildConfig } from 'payload'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'

const config = buildConfig({
  collections: [
    {
      slug: 'pages',
      fields: [],
    },
  ],
  plugins: [
    formBuilderPlugin({
      // see below for a list of available options
    }),
  ],
})

export default config
```

## Options

### `fields` (option)

The `fields` property is an object of field types to allow your admin editors to build forms with. To override default settings, pass either a boolean value or a partial [Payload Block](https://payloadcms.com/docs/fields/blocks#block-configs) _keyed to the block's slug_. See [Fields](#fields) for more details.

```ts
// payload.config.ts
formBuilderPlugin({
  // ...
  fields: {
    text: true,
    textarea: true,
    select: true,
    radio: true,
    email: true,
    state: true,
    country: true,
    checkbox: true,
    number: true,
    message: true,
    date: false,
    payment: false,
  },
})
```

### `redirectRelationships`

The `redirectRelationships` property is an array of collection slugs that, when enabled, are populated as options in the form's `redirect` field. This field is used to redirect the user to a dedicated confirmation page upon form submission (optional).

```ts
// payload.config.ts
formBuilderPlugin({
  // ...
  redirectRelationships: ['pages'],
})
```

### `beforeEmail`

The `beforeEmail` property is a [beforeChange](https://payloadcms.com/docs/hooks/globals#beforechange) hook that is called just after emails are prepared, but before they are sent. This is a great place to inject your own HTML template to add custom styles.

```ts
// payload.config.ts
formBuilderPlugin({
  // ...
  beforeEmail: (emailsToSend, beforeChangeParams) => {
    // modify the emails in any way before they are sent
    return emails.map((email) => ({
      ...email,
      html: email.html, // transform the html in any way you'd like (maybe wrap it in an html template?)
    }))
  },
})
```

For full types with `beforeChangeParams`, you can import the types from the plugin:

```ts
import type { BeforeEmail } from '@payloadcms/plugin-form-builder'
// Your generated FormSubmission type
import type { FormSubmission } from '@payload-types'

// Pass it through and 'data' or 'originalDoc' will now be typed
const beforeEmail: BeforeEmail<FormSubmission> = (
  emailsToSend,
  beforeChangeParams,
) => {
  // modify the emails in any way before they are sent
  return emails.map((email) => ({
    ...email,
    html: email.html, // transform the html in any way you'd like (maybe wrap it in an html template?)
  }))
}
```

### `defaultToEmail`

Provide a fallback for the email address to send form submissions to. If the email in form configuration does not have a to email set, this email address will be used. If this is not provided then it falls back to the `defaultFromAddress` in your [email configuration](../email/overview).

```ts
// payload.config.ts
formBuilderPlugin({
  // ...
  defaultToEmail: 'test@example.com',
})
```

### `formOverrides`

Override anything on the `forms` collection by sending a [Payload Collection Config](https://payloadcms.com/docs/configuration/collections) to the `formOverrides` property.

Note that the `fields` property is a function that receives the default fields and returns an array of fields. This is because the `fields` property is a special case that is merged with the default fields, rather than replacing them. This allows you to map over default fields and modify them as needed.

<Banner type="warning">
  Good to know: The form collection is publicly available to read by default.
  The emails field is locked for authenticated users only. If you have any
  frontend users you should override the access permissions for both the
  collection and the emails field to make sure you don't leak out any private
  emails.
</Banner>

```ts
// payload.config.ts
formBuilderPlugin({
  // ...
  formOverrides: {
    slug: 'contact-forms',
    access: {
      read: ({ req: { user } }) => !!user, // authenticated users only
      update: () => false,
    },
    fields: ({ defaultFields }) => {
      return [
        ...defaultFields,
        {
          name: 'custom',
          type: 'text',
        },
      ]
    },
  },
})
```

### `formSubmissionOverrides`

Override anything on the `form-submissions` collection by sending a [Payload Collection Config](https://payloadcms.com/docs/configuration/collections) to the `formSubmissionOverrides` property.

<Banner type="warning">
  By default, this plugin relies on [Payload access
  control](https://payloadcms.com/docs/access-control/collections) to restrict
  the `update` and `read` operations on the `form-submissions` collection. This
  is because _anyone_ should be able to create a form submission, even from a
  public-facing website, but _no one_ should be able to update a submission once
  it has been created, or read a submission unless they have permission. You can
  override this behavior or any other property as needed.
</Banner>

```ts
// payload.config.ts
formBuilderPlugin({
  // ...
  formSubmissionOverrides: {
    slug: 'leads',
    fields: ({ defaultFields }) => {
      return [
        ...defaultFields,
        {
          name: 'custom',
          type: 'text',
        },
      ]
    },
  },
})
```

### `handlePayment`

The `handlePayment` property is a [beforeChange](https://payloadcms.com/docs/hooks/globals#beforechange) hook that is called upon form submission. You can integrate into any third-party payment processing API here to accept payment based on form input. You can use the `getPaymentTotal` function to calculate the total cost after all conditions have been applied. This is only applicable if the form has enabled the `payment` field.

First import the utility function. This will execute all of the price conditions that you have set in your form's `payment` field and returns the total price.

```ts
// payload.config.ts
import { getPaymentTotal } from '@payloadcms/plugin-form-builder'
```

Then in your plugin's config:

```ts
// payload.config.ts
formBuilderPlugin({
  // ...
  handlePayment: async ({ form, submissionData }) => {
    // first calculate the price
    const paymentField = form.fields?.find(
      (field) => field.blockType === 'payment',
    )
    const price = getPaymentTotal({
      basePrice: paymentField.basePrice,
      priceConditions: paymentField.priceConditions,
      fieldValues: submissionData,
    })
    // then asynchronously process the payment here
  },
})
```

## Fields

Each field represents a form input. To override default settings pass either a boolean value or a partial [Payload Block](https://payloadcms.com/docs/fields/blocks) _keyed to the block's slug_. See [Field Overrides](#field-overrides) for more details on how to do this.

<Banner type="info">
  **Note:** "Fields" here is in reference to the _fields to build forms with_,
  not to be confused with the _fields of a collection_ which are set via
  `formOverrides.fields`.
</Banner>

### Text

Maps to a `text` input in your front-end. Used to collect a simple string.

| Property       | Type     | Description                                          |
| -------------- | -------- | ---------------------------------------------------- |
| `name`         | string   | The name of the field.                               |
| `label`        | string   | The label of the field.                              |
| `defaultValue` | string   | The default value of the field.                      |
| `width`        | string   | The width of the field on the front-end.             |
| `required`     | checkbox | Whether or not the field is required when submitted. |

### Textarea

Maps to a `textarea` input on your front-end. Used to collect a multi-line string.

| Property       | Type     | Description                                          |
| -------------- | -------- | ---------------------------------------------------- |
| `name`         | string   | The name of the field.                               |
| `label`        | string   | The label of the field.                              |
| `defaultValue` | string   | The default value of the field.                      |
| `width`        | string   | The width of the field on the front-end.             |
| `required`     | checkbox | Whether or not the field is required when submitted. |

### Select

Maps to a `select` input on your front-end. Used to display a list of options.

| Property       | Type     | Description                                                                     |
| -------------- | -------- | ------------------------------------------------------------------------------- |
| `name`         | string   | The name of the field.                                                          |
| `label`        | string   | The label of the field.                                                         |
| `defaultValue` | string   | The default value of the field.                                                 |
| `placeholder`  | string   | The placeholder text for the field.                                             |
| `width`        | string   | The width of the field on the front-end.                                        |
| `required`     | checkbox | Whether or not the field is required when submitted.                            |
| `options`      | array    | An array of objects that define the select options. See below for more details. |

#### Select Options

Each option in the `options` array defines a selectable choice for the select field.

| Property | Type   | Description                         |
| -------- | ------ | ----------------------------------- |
| `label`  | string | The display text for the option.    |
| `value`  | string | The value submitted for the option. |

### Radio

Maps to radio button inputs on your front-end. Used to allow users to select a single option from a list of choices.

| Property       | Type     | Description                                                                    |
| -------------- | -------- | ------------------------------------------------------------------------------ |
| `name`         | string   | The name of the field.                                                         |
| `label`        | string   | The label of the field.                                                        |
| `defaultValue` | string   | The default value of the field.                                                |
| `width`        | string   | The width of the field on the front-end.                                       |
| `required`     | checkbox | Whether or not the field is required when submitted.                           |
| `options`      | array    | An array of objects that define the radio options. See below for more details. |

#### Radio Options

Each option in the `options` array defines a selectable choice for the radio field.

| Property | Type   | Description                         |
| -------- | ------ | ----------------------------------- |
| `label`  | string | The display text for the option.    |
| `value`  | string | The value submitted for the option. |

### Email (field)

Maps to a `text` input with type `email` on your front-end. Used to collect an email address.

| Property       | Type     | Description                                          |
| -------------- | -------- | ---------------------------------------------------- |
| `name`         | string   | The name of the field.                               |
| `label`        | string   | The label of the field.                              |
| `defaultValue` | string   | The default value of the field.                      |
| `width`        | string   | The width of the field on the front-end.             |
| `required`     | checkbox | Whether or not the field is required when submitted. |

### State

Maps to a `select` input on your front-end. Used to collect a US state.

| Property       | Type     | Description                                          |
| -------------- | -------- | ---------------------------------------------------- |
| `name`         | string   | The name of the field.                               |
| `label`        | string   | The label of the field.                              |
| `defaultValue` | string   | The default value of the field.                      |
| `width`        | string   | The width of the field on the front-end.             |
| `required`     | checkbox | Whether or not the field is required when submitted. |

### Country

Maps to a `select` input on your front-end. Used to collect a country.

| Property       | Type     | Description                                          |
| -------------- | -------- | ---------------------------------------------------- |
| `name`         | string   | The name of the field.                               |
| `label`        | string   | The label of the field.                              |
| `defaultValue` | string   | The default value of the field.                      |
| `width`        | string   | The width of the field on the front-end.             |
| `required`     | checkbox | Whether or not the field is required when submitted. |

### Checkbox

Maps to a `checkbox` input on your front-end. Used to collect a boolean value.

| Property       | Type     | Description                                          |
| -------------- | -------- | ---------------------------------------------------- |
| `name`         | string   | The name of the field.                               |
| `label`        | string   | The label of the field.                              |
| `defaultValue` | checkbox | The default value of the field.                      |
| `width`        | string   | The width of the field on the front-end.             |
| `required`     | checkbox | Whether or not the field is required when submitted. |

### Date

Maps to a `date` input on your front-end. Used to collect a date value.

| Property       | Type     | Description                                          |
| -------------- | -------- | ---------------------------------------------------- |
| `name`         | string   | The name of the field.                               |
| `label`        | string   | The label of the field.                              |
| `defaultValue` | date     | The default value of the field.                      |
| `width`        | string   | The width of the field on the front-end.             |
| `required`     | checkbox | Whether or not the field is required when submitted. |

### Number

Maps to a `number` input on your front-end. Used to collect a number.

| Property       | Type     | Description                                          |
| -------------- | -------- | ---------------------------------------------------- |
| `name`         | string   | The name of the field.                               |
| `label`        | string   | The label of the field.                              |
| `defaultValue` | number   | The default value of the field.                      |
| `width`        | string   | The width of the field on the front-end.             |
| `required`     | checkbox | Whether or not the field is required when submitted. |

### Message

Maps to a `RichText` component on your front-end. Used to display an arbitrary message to the user anywhere in the form.

| property  | type     | description                         |
| --------- | -------- | ----------------------------------- |
| `message` | richText | The message to display on the form. |

### Payment

Add this field to your form if it should collect payment. Upon submission, the `handlePayment` callback is executed with the form and submission data. You can use this to integrate with any third-party payment processing API.

| property          | type     | description                                                                       |
| ----------------- | -------- | --------------------------------------------------------------------------------- |
| `name`            | string   | The name of the field.                                                            |
| `label`           | string   | The label of the field.                                                           |
| `defaultValue`    | number   | The default value of the field.                                                   |
| `width`           | string   | The width of the field on the front-end.                                          |
| `required`        | checkbox | Whether or not the field is required when submitted.                              |
| `priceConditions` | array    | An array of objects that define the price conditions. See below for more details. |

#### Price Conditions

Each of the `priceConditions` are executed by the `getPaymentTotal` utility that this plugin provides. You can call this function in your `handlePayment` callback to dynamically calculate the total price of a form upon submission based on the user's input. For example, you could create a price condition that says "if the user selects 'yes' for this checkbox, add $10 to the total price".

| property           | type         | description                                      |
| ------------------ | ------------ | ------------------------------------------------ |
| `fieldToUse`       | relationship | The field to use to determine the price.         |
| `condition`        | string       | The condition to use to determine the price.     |
| `valueForOperator` | string       | The value to use for the operator.               |
| `operator`         | string       | The operator to use to determine the price.      |
| `valueType`        | string       | The type of value to use to determine the price. |
| `value`            | string       | The value to use to determine the price.         |

### Field Overrides

You can provide your own custom fields by passing a new [Payload Block](https://payloadcms.com/docs/fields/blocks#block-configs) object into `fields`. You can override or extend any existing fields by first importing the `fields` from the plugin:

```ts
import { fields } from '@payloadcms/plugin-form-builder'
```

Then merging it into your own custom field:

```ts
// payload.config.ts
formBuilderPlugin({
  // ...
  fields: {
    text: {
      ...fields.text,
      labels: {
        singular: 'Custom Text Field',
        plural: 'Custom Text Fields',
      },
    },
  },
})
```

### Customizing the date field default value

You can custommise the default value of the date field and any other aspects of the date block in this way.
Note that the end submission source will be responsible for the timezone of the date. Payload only stores the date in UTC format.

```ts
import { fields as formFields } from '@payloadcms/plugin-form-builder'

// payload.config.ts
formBuilderPlugin({
  fields: {
    // date: true, // just enable it without any customizations
    date: {
      ...formFields.date,
      fields: [
        ...(formFields.date && 'fields' in formFields.date
          ? formFields.date.fields.map((field) => {
              if ('name' in field && field.name === 'defaultValue') {
                return {
                  ...field,
                  timezone: true, // optionally enable timezone
                  admin: {
                    ...field.admin,
                    description: 'This is a date field',
                  },
                }
              }
              return field
            })
          : []),
      ],
    },
  },
})
```

### Preventing generated schema naming conflicts

Plugin fields can cause GraphQL type name collisions with your own blocks or collections. This results in errors like:

```plaintext
Error: Schema must contain uniquely named types but contains multiple types named "Country"
```

You can resolve this by overriding:

- `graphQL.singularName` in your collection config (for GraphQL schema conflicts)
- `interfaceName` in your block config
- `interfaceName` in the plugin field config

```ts
// payload.config.ts
formBuilderPlugin({
  fields: {
    country: {
      interfaceName: 'CountryFormBlock', // overrides the generated type name to avoid a conflict
    },
  },
})
```

## Email

This plugin relies on the [email configuration](../email/overview) defined in your Payload configuration. It will read from your config and attempt to send your emails using the credentials provided.

### Email formatting

The email contents supports rich text which will be serialized to HTML on the server before being sent. By default it reads the global configuration of your rich text editor.

The email subject and body supports inserting dynamic fields from the form submission data using the `{{field_name}}` syntax. For example, if you have a field called `name` in your form, you can include this in the email body like so:

```html
Thank you for your submission, {{name}}!
```

You can also use `{{*}}` as a wildcard to output all the data in a key:value format and `{{*:table}}` to output all the data in a table format.

## TypeScript

All types can be directly imported:

```ts
import type {
  PluginConfig,
  Form,
  FormSubmission,
  FieldsConfig,
  BeforeEmail,
  HandlePayment,
  ...
} from "@payloadcms/plugin-form-builder/types";
```

## Examples

The [Examples Directory](https://github.com/payloadcms/payload/tree/main/examples) contains an official [Form Builder Plugin Example](https://github.com/payloadcms/payload/tree/main/examples/form-builder) which demonstrates exactly how to configure this plugin in Payload and implement it on your front-end. We've also included an in-depth walk-through of how to build a form from scratch in our [Form Builder Plugin Blog Post](https://payloadcms.com/blog/create-custom-forms-with-the-official-form-builder-plugin).

## Troubleshooting

Below are some common troubleshooting tips. To help other developers, please contribute to this section as you troubleshoot your own application.

#### SendGrid 403 Forbidden Error

- If you are using [SendGrid Link Branding](https://docs.sendgrid.com/ui/account-and-settings/how-to-set-up-link-branding) to remove the "via sendgrid.net" part of your email, you must also setup [Domain Authentication](https://docs.sendgrid.com/ui/account-and-settings/how-to-set-up-domain-authentication). This means you can only send emails from an address on this domain — so the `from` addresses in your form submission emails **_cannot_** be anything other than `something@your_domain.com`. This means that from `{{email}}` will not work, but `website@your_domain.com` will. You can still send the form's email address in the body of the email.

## Screenshots

![screenshot 1](https://github.com/payloadcms/plugin-form-builder/blob/main/images/screenshot-1.jpg?raw=true)

![screenshot 2](https://github.com/payloadcms/plugin-form-builder/blob/main/images/screenshot-2.jpg?raw=true)

![screenshot 3](https://github.com/payloadcms/plugin-form-builder/blob/main/images/screenshot-3.jpg?raw=true)

![screenshot 4](https://github.com/payloadcms/plugin-form-builder/blob/main/images/screenshot-4.jpg?raw=true)

![screenshot 5](https://github.com/payloadcms/plugin-form-builder/blob/main/images/screenshot-5.jpg?raw=true)

![screenshot 6](https://github.com/payloadcms/plugin-form-builder/blob/main/images/screenshot-6.jpg?raw=true)
```

--------------------------------------------------------------------------------

---[FILE: import-export.mdx]---
Location: payload-main/docs/plugins/import-export.mdx

```text
---
title: Import Export Plugin
label: Import Export
order: 40
desc: Add Import and export functionality to create CSV and JSON data exports
keywords: plugins, plugin, import, export, csv, JSON, data, ETL, download
---

![https://www.npmjs.com/package/@payloadcms/plugin-import-export](https://img.shields.io/npm/v/@payloadcms/plugin-import-export)

<Banner type="warning">
  **Note**: This plugin is in **beta** as some aspects of it may change on any
  minor releases. It is under development and currently only supports exporting
  of collection data.
</Banner>

This plugin adds features that give admin users the ability to download or create export data as an upload collection and import it back into a project.

## Core Features

- Export data as CSV or JSON format via the admin UI
- Download the export directly through the browser
- Create a file upload of the export data
- Use the jobs queue for large exports
- (Coming soon) Import collection data

## Installation

Install the plugin using any JavaScript package manager like [pnpm](https://pnpm.io), [npm](https://npmjs.com), or [Yarn](https://yarnpkg.com):

```bash
pnpm add @payloadcms/plugin-import-export
```

## Basic Usage

In the `plugins` array of your [Payload Config](https://payloadcms.com/docs/configuration/overview), call the plugin with [options](#options):

```ts
import { buildConfig } from 'payload'
import { importExportPlugin } from '@payloadcms/plugin-import-export'

const config = buildConfig({
  collections: [Pages, Media],
  plugins: [
    importExportPlugin({
      collections: ['users', 'pages'],
      // see below for a list of available options
    }),
  ],
})

export default config
```

## Options

| Property                   | Type     | Description                                                                                                                          |
| -------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `collections`              | string[] | Collections to include Import/Export controls in. Defaults to all collections.                                                       |
| `debug`                    | boolean  | If true, enables debug logging.                                                                                                      |
| `disableDownload`          | boolean  | If true, disables the download button in the export preview UI.                                                                      |
| `disableJobsQueue`         | boolean  | If true, forces the export to run synchronously.                                                                                     |
| `disableSave`              | boolean  | If true, disables the save button in the export preview UI.                                                                          |
| `format`                   | string   | Forces a specific export format (`csv` or `json`), hides the format dropdown, and prevents the user from choosing the export format. |
| `overrideExportCollection` | function | Function to override the default export collection; takes the default export collection and allows you to modify and return it.      |

## Field Options

In addition to the above plugin configuration options, you can granularly set the following field level options using the `custom['plugin-import-export']` properties in any of your collections.

| Property   | Type     | Description                                                                                                                   |
| ---------- | -------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `disabled` | boolean  | When `true` the field is completely excluded from the import-export plugin.                                                   |
| `toCSV`    | function | Custom function used to modify the outgoing csv data by manipulating the data, siblingData or by returning the desired value. |

### Customizing the output of CSV data

To manipulate the data that a field exports you can add `toCSV` custom functions. This allows you to modify the outgoing csv data by manipulating the data, siblingData or by returning the desired value.

The toCSV function argument is an object with the following properties:

| Property     | Type    | Description                                                       |
| ------------ | ------- | ----------------------------------------------------------------- |
| `columnName` | string  | The CSV column name given to the field.                           |
| `doc`        | object  | The top level document                                            |
| `row`        | object  | The object data that can be manipulated to assign data to the CSV |
| `siblingDoc` | object  | The document data at the level where it belongs                   |
| `value`      | unknown | The data for the field.                                           |

Example function:

```ts
const pages: CollectionConfig = {
  slug: 'pages',
  fields: [
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      custom: {
        'plugin-import-export': {
          toCSV: ({ value, columnName, row }) => {
            // add both `author_id` and the `author_email` to the csv export
            if (
              value &&
              typeof value === 'object' &&
              'id' in value &&
              'email' in value
            ) {
              row[`${columnName}_id`] = (value as { id: number | string }).id
              row[`${columnName}_email`] = (value as { email: string }).email
            }
          },
        },
      },
    },
  ],
}
```

## Exporting Data

There are four possible ways that the plugin allows for exporting documents, the first two are available in the admin UI from the list view of a collection:

1. Direct download - Using a `POST` to `/api/exports/download` and streams the response as a file download
2. File storage - Goes to the `exports` collection as an uploads enabled collection
3. Local API - A create call to the uploads collection: `payload.create({ slug: 'uploads', ...parameters })`
4. Jobs Queue - `payload.jobs.queue({ task: 'createCollectionExport', input: parameters })`

By default, a user can use the Export drawer to create a file download by choosing `Save` or stream a downloadable file directly without persisting it by using the `Download` button. Either option can be disabled to provide the export experience you desire for your use-case.

The UI for creating exports provides options so that users can be selective about which documents to include and also which columns or fields to include.

It is necessary to add access control to the uploads collection configuration using the `overrideExportCollection` function if you have enabled this plugin on collections with data that some authenticated users should not have access to.

<Banner type="warning">
  **Note**: Users who have read access to the upload collection may be able to
  download data that is normally not readable due to [access
  control](../access-control/overview).
</Banner>

The following parameters are used by the export function to handle requests:

| Property         | Type     | Description                                                                                                       |
| ---------------- | -------- | ----------------------------------------------------------------------------------------------------------------- |
| `format`         | text     | Either `csv` or `json` to determine the shape of data exported                                                    |
| `limit`          | number   | The max number of documents to return                                                                             |
| `sort`           | select   | The field to use for ordering documents                                                                           |
| `locale`         | string   | The locale code to query documents or `all`                                                                       |
| `draft`          | string   | Either `yes` or `no` to return documents with their newest drafts for drafts enabled collections                  |
| `fields`         | string[] | Which collection fields are used to create the export, defaults to all                                            |
| `collectionSlug` | string   | The slug to query against                                                                                         |
| `where`          | object   | The WhereObject used to query documents to export. This is set by making selections or filters from the list view |
| `filename`       | text     | What to call the export being created                                                                             |
```

--------------------------------------------------------------------------------

````
