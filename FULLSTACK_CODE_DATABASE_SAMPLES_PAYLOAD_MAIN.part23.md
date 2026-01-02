---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 23
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 23 of 695)

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

---[FILE: globals.mdx]---
Location: payload-main/docs/configuration/globals.mdx

```text
---
title: Global Configs
label: Globals
order: 30
desc: Set up your Global config for your needs by defining fields, adding slugs and labels, establishing access control, tying in hooks and more.
keywords: globals, config, configuration, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

Globals are in many ways similar to [Collections](./collections), except that they correspond to only a single Document. You can define as many Globals as your application needs. Each Global Document is stored in the [Database](../database/overview) based on the [Fields](../fields/overview) that you define, and automatically generates a [Local API](../local-api/overview), [REST API](../rest-api/overview), and [GraphQL API](../graphql/overview) used to manage your Documents.

Globals are the primary way to structure singletons in Payload, such as a header navigation, site-wide banner alerts, or app-wide localized strings. Each Global can have its own unique [Access Control](../access-control/overview), [Hooks](../hooks/overview), [Admin Options](#admin-options), and more.

To define a Global Config, use the `globals` property in your [Payload Config](./overview):

```ts
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  globals: [
    // highlight-line
    // Your Globals go here
  ],
})
```

<Banner type="success">
  **Tip:** If you have more than one Global that share the same structure,
  consider using a [Collection](./collections) instead.
</Banner>

## Config Options

It's often best practice to write your Globals in separate files and then import them into the main [Payload Config](./overview).

Here is what a simple Global Config might look like:

```ts
import { GlobalConfig } from 'payload'

export const Nav: GlobalConfig = {
  slug: 'nav',
  fields: [
    {
      name: 'items',
      type: 'array',
      required: true,
      maxRows: 8,
      fields: [
        {
          name: 'page',
          type: 'relationship',
          relationTo: 'pages', // "pages" is the slug of an existing collection
          required: true,
        },
      ],
    },
  ],
}
```

<Banner type="success">
  **Reminder:** For more complex examples, see the
  [Templates](https://github.com/payloadcms/payload/tree/main/templates) and
  [Examples](https://github.com/payloadcms/payload/tree/main/examples)
  directories in the Payload repository.
</Banner>

The following options are available:

| Option          | Description                                                                                                                                                                                    |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `access`        | Provide Access Control functions to define exactly who should be able to do what with this Global. [More details](../access-control/globals).                                                  |
| `admin`         | The configuration options for the Admin Panel. [More details](#admin-options).                                                                                                                 |
| `custom`        | Extension point for adding custom data (e.g. for plugins)                                                                                                                                      |
| `dbName`        | Custom table or collection name for this Global depending on the Database Adapter. Auto-generated from slug if not defined.                                                                    |
| `description`   | Text or React component to display below the Global header to give editors more information.                                                                                                   |
| `endpoints`     | Add custom routes to the REST API. [More details](../rest-api/overview#custom-endpoints).                                                                                                      |
| `fields` \*     | Array of field types that will determine the structure and functionality of the data stored within this Global. [More details](../fields/overview).                                            |
| `graphQL`       | Manage GraphQL-related properties related to this global. [More details](#graphql)                                                                                                             |
| `hooks`         | Entry point for Hooks. [More details](../hooks/overview#global-hooks).                                                                                                                         |
| `label`         | Text for the name in the Admin Panel or an object with keys for each language. Auto-generated from slug if not defined.                                                                        |
| `lockDocuments` | Enables or disables document locking. By default, document locking is enabled. Set to an object to configure, or set to `false` to disable locking. [More details](../admin/locked-documents). |
| `slug` \*       | Unique, URL-friendly string that will act as an identifier for this Global.                                                                                                                    |
| `typescript`    | An object with property `interface` as the text used in schema generation. Auto-generated from slug if not defined.                                                                            |
| `versions`      | Set to true to enable default options, or configure with object properties. [More details](../versions/overview#global-config).                                                                |
| `forceSelect`   | Specify which fields should be selected always, regardless of the `select` query which can be useful that the field exists for access control / hooks. [More details](../queries/select).      |

_\* An asterisk denotes that a property is required._

### Fields

Fields define the schema of the Global. To learn more, go to the [Fields](../fields/overview) documentation.

### Access Control

[Global Access Control](../access-control/globals) determines what a user can and cannot do with any given Global Document. To learn more, go to the [Access Control](../access-control/overview) documentation.

### Hooks

[Global Hooks](../hooks/globals) allow you to tie into the lifecycle of your Documents so you can execute your own logic during specific events. To learn more, go to the [Hooks](../hooks/overview) documentation.

## Admin Options

The behavior of Globals within the [Admin Panel](../admin/overview) can be fully customized to fit the needs of your application. This includes grouping or hiding their navigation links, adding [Custom Components](../custom-components/overview), setting page metadata, and more.

To configure Admin Options for Globals, use the `admin` property in your Global Config:

```ts
import { GlobalConfig } from 'payload'

export const MyGlobal: GlobalConfig = {
  // ...
  admin: {
    // highlight-line
    // ...
  },
}
```

The following options are available:

| Option        | Description                                                                                                                                                                             |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `group`       | Text or localization object used to group Collection and Global links in the admin navigation. Set to `false` to hide the link from the navigation while keeping its routes accessible. |
| `hidden`      | Set to true or a function, called with the current user, returning true to exclude this Global from navigation and admin routing.                                                       |
| `components`  | Swap in your own React components to be used within this Global. [More details](#custom-components).                                                                                    |
| `preview`     | Function to generate a preview URL within the Admin Panel for this Global that can point to your app. [More details](../admin/preview).                                                 |
| `livePreview` | Enable real-time editing for instant visual feedback of your front-end application. [More details](../live-preview/overview).                                                           |
| `hideAPIURL`  | Hides the "API URL" meta field while editing documents within this collection.                                                                                                          |
| `meta`        | Page metadata overrides to apply to this Global within the Admin Panel. [More details](../admin/metadata).                                                                              |

### Custom Components

Globals can set their own [Custom Components](../custom-components/overview) which only apply to Global-specific UI within the [Admin Panel](../admin/overview). This includes elements such as the Save Button, or entire layouts such as the Edit View.

To override Global Components, use the `admin.components` property in your Global Config:

```ts
import type { SanitizedGlobalConfig } from 'payload'

export const MyGlobal: SanitizedGlobalConfig = {
  // ...
  admin: {
    components: {
      // highlight-line
      // ...
    },
  },
}
```

The following options are available:

#### General

| Option     | Description                                                                                             |
| ---------- | ------------------------------------------------------------------------------------------------------- |
| `elements` | Override or create new elements within the Edit View. [More details](#edit-view-options).               |
| `views`    | Override or create new views within the Admin Panel. [More details](../custom-components/custom-views). |

#### Edit View Options

```ts
import type { SanitizedGlobalConfig } from 'payload'

export const MyGlobal: SanitizedGlobalConfig = {
  // ...
  admin: {
    components: {
      elements: {
        // highlight-line
        // ...
      },
    },
  },
}
```

The following options are available:

| Option            | Description                                                                                                                                                                                                |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SaveButton`      | Replace the default Save Button with a Custom Component. [Drafts](../versions/drafts) must be disabled. [More details](../custom-components/edit-view#savebutton).                                         |
| `SaveDraftButton` | Replace the default Save Draft Button with a Custom Component. [Drafts](../versions/drafts) must be enabled and autosave must be disabled. [More details](../custom-components/edit-view#savedraftbutton). |
| `PublishButton`   | Replace the default Publish Button with a Custom Component. [Drafts](../versions/drafts) must be enabled. [More details](../custom-components/edit-view#publishbutton).                                    |
| `PreviewButton`   | Replace the default Preview Button with a Custom Component. [Preview](../admin/preview) must be enabled. [More details](../custom-components/edit-view#previewbutton).                                     |

<Banner type="success">
  **Note:** For details on how to build Custom Components, see [Building Custom
  Components](../custom-components/overview#building-custom-components).
</Banner>

## GraphQL

You can completely disable GraphQL for this global by passing `graphQL: false` to your global config. This will completely disable all queries, mutations, and types from appearing in your GraphQL schema.

You can also pass an object to the global's `graphQL` property, which allows you to define the following properties:

| Option             | Description                                                                     |
| ------------------ | ------------------------------------------------------------------------------- |
| `name`             | Override the name that will be used in GraphQL schema generation.               |
| `disableQueries`   | Disable all GraphQL queries that correspond to this global by passing `true`.   |
| `disableMutations` | Disable all GraphQL mutations that correspond to this global by passing `true`. |

## TypeScript

You can import types from Payload to help make writing your Global configs easier and type-safe. There are two main types that represent the Global Config, `GlobalConfig` and `SanitizedGlobalConfig`.

The `GlobalConfig` type represents a raw Global Config in its full form, where only the bare minimum properties are marked as required. The `SanitizedGlobalConfig` type represents a Global Config after it has been fully sanitized. Generally, this is only used internally by Payload.

```ts
import type { GlobalConfig, SanitizedGlobalConfig } from 'payload'
```
```

--------------------------------------------------------------------------------

---[FILE: i18n.mdx]---
Location: payload-main/docs/configuration/i18n.mdx

```text
---
title: I18n
label: I18n
order: 40
desc: Manage and customize internationalization support in your CMS editor experience
keywords: internationalization, i18n, config, configuration, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

The [Admin Panel](../admin/overview) is translated in over [30 languages and counting](https://github.com/payloadcms/payload/tree/main/packages/translations). With I18n, editors can navigate the interface and read API error messages in their preferred language. This is similar to [Localization](./localization), but instead of managing translations for the data itself, you are managing translations for your application's interface.

By default, Payload comes preinstalled with English, but you can easily load other languages into your own application. Languages are automatically detected based on the request. If no language is detected, or if the user's language is not yet supported by your application, English will be chosen.

To add I18n to your project, you first need to install the `@payloadcms/translations` package:

```bash
pnpm install @payloadcms/translations
```

Once installed, it can be configured using the `i18n` key in your [Payload Config](./overview):

```ts
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  i18n: {
    // highlight-line
    // ...
  },
})
```

<Banner type="success">
  **Note:** If there is a language that Payload does not yet support, we accept
  [code
  contributions](https://github.com/payloadcms/payload/blob/main/CONTRIBUTING.md).
</Banner>

## Config Options

You can easily customize and override any of the i18n settings that Payload provides by default. Payload will use your custom options and merge them in with its own.

```ts
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  // highlight-start
  i18n: {
    fallbackLanguage: 'en', // default
  },
  // highlight-end
})
```

The following options are available:

| Option               | Description                                                                                                        |
| -------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `fallbackLanguage`   | The language to fall back to if the user's preferred language is not supported. Default is `'en'`.                 |
| `translations`       | An object containing the translations. The keys are the language codes and the values are the translations.        |
| `supportedLanguages` | An object containing the supported languages. The keys are the language codes and the values are the translations. |

## Adding Languages

You can easily add new languages to your Payload app by providing the translations for the new language. Payload maintains a number of built-in translations that can be imported from `@payloadcms/translations`, but you can also provide your own [Custom Translations](#custom-translations) to support any language.

To add a new language, use the `i18n.supportedLanguages` key in your [Payload Config](./overview):

```ts
import { buildConfig } from 'payload'
import { en } from '@payloadcms/translations/languages/en'
import { de } from '@payloadcms/translations/languages/de'

export default buildConfig({
  // ...
  // highlight-start
  i18n: {
    supportedLanguages: { en, de },
  },
  // highlight-end
})
```

<Banner type="warning">
  **Tip:** It's best to only support the languages that you need so that the
  bundled JavaScript is kept to a minimum for your project.
</Banner>

### Custom Translations

You can customize Payload's built-in translations either by extending existing languages or by adding new languages entirely. This can be done by injecting new translation strings into existing languages, or by providing an entirely new language keys altogether.

To add Custom Translations, use the `i18n.translations` key in your [Payload Config](./overview):

```ts
import { buildConfig } from 'payload'

export default buildConfig({
  //...
  i18n: {
    // highlight-start
    translations: {
      en: {
        custom: {
          // namespace can be anything you want
          key1: 'Translation with {{variable}}', // translation
        },
        // override existing translation keys
        general: {
          dashboard: 'Home',
        },
      },
    },
    // highlight-end
  },
  //...
})
```

### Project Translations

While Payload's built-in features come fully translated, you may also want to translate parts of your own project. This is possible in places like [Collections](./collections) and [Globals](./globals), such as on their labels and groups, field labels, descriptions or input placeholder text.

To do this, provide the translations wherever applicable, keyed to the language code:

```ts
import type { CollectionConfig } from 'payload'

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: {
    singular: {
      // highlight-start
      en: 'Article',
      es: 'Artículo',
      // highlight-end
    },
    plural: {
      // highlight-start
      en: 'Articles',
      es: 'Artículos',
      // highlight-end
    },
  },
  admin: {
    group: {
      // highlight-start
      en: 'Content',
      es: 'Contenido',
      // highlight-end
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: {
        // highlight-start
        en: 'Title',
        es: 'Título',
        // highlight-end
      },
      admin: {
        placeholder: {
          // highlight-start
          en: 'Enter title',
          es: 'Introduce el título',
          // highlight-end
        },
      },
    },
  ],
}
```

## Changing Languages

Users can change their preferred language in their account settings or by otherwise manipulating their [User Preferences](../admin/preferences).

## Node.js#node

Payload's backend sets the language on incoming requests before they are handled. This allows backend validation to return error messages in the user's own language or system generated emails to be sent using the correct translation. You can make HTTP requests with the `accept-language` header and Payload will use that language.

Anywhere in your Payload app that you have access to the `req` object, you can access Payload's extensive internationalization features assigned to `req.i18n`. To access text translations you can use `req.t('namespace:key')`.

## TypeScript

In order to use [Custom Translations](#custom-translations) in your project, you need to provide the types for the translations.

Here we create a shareable translations object. We will import this in both our custom components and in our Payload config.

In this example we show how to extend English, but you can do the same for any language you want.

```ts
// <rootDir>/custom-translations.ts

import { enTranslations } from '@payloadcms/translations/languages/en'
import type { NestedKeysStripped } from '@payloadcms/translations'

export const customTranslations = {
  en: {
    general: {
      myCustomKey: 'My custom english translation',
    },
    fields: {
      addLabel: 'Add!',
    },
  },
}

export type CustomTranslationsObject = typeof customTranslations.en &
  typeof enTranslations
export type CustomTranslationsKeys =
  NestedKeysStripped<CustomTranslationsObject>
```

Import the shared translations object into our Payload config so they are available for use:

```ts
// <rootDir>/payload.config.ts

import { buildConfig } from 'payload'

import { customTranslations } from './custom-translations'

export default buildConfig({
  //...
  i18n: {
    translations: customTranslations,
  },
  //...
})
```

Import the shared translation types to use in your [Custom Component](../custom-components/overview):

```ts
// <rootDir>/components/MyComponent.tsx

'use client'
import type React from 'react'
import { useTranslation } from '@payloadcms/ui'

import type {
  CustomTranslationsObject,
  CustomTranslationsKeys,
} from '../custom-translations'

export const MyComponent: React.FC = () => {
  const { i18n, t } = useTranslation<
    CustomTranslationsObject,
    CustomTranslationsKeys
  >() // These generics merge your custom translations with the default client translations

  return t('general:myCustomKey')
}
```

Additionally, Payload exposes the `t` function in various places, for example in labels. Here is how you would type those:

```ts
// <rootDir>/fields/myField.ts

import type { TFunction } from '@payloadcms/translations'
import type { Field } from 'payload'

import { CustomTranslationsKeys } from '../custom-translations'

const field: Field = {
  name: 'myField',
  type: 'text',
  label: ({ t: defaultT }) => {
    const t = defaultT as TFunction<CustomTranslationsKeys>
    return t('fields:addLabel')
  },
}
```
```

--------------------------------------------------------------------------------

---[FILE: localization.mdx]---
Location: payload-main/docs/configuration/localization.mdx

```text
---
title: Localization
label: Localization
order: 50
desc: Add and maintain as many locales as you need by adding Localization to your Payload Config, set options for default locale, fallbacks, fields and more.
keywords: localization, internationalization, i18n, config, configuration, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

Localization is one of the most important features of a modern CMS. It allows you to manage content in multiple languages, then serve it to your users based on their requested language. This is similar to [I18n](./i18n), but instead of managing translations for your application's interface, you are managing translations for the data itself.

With Localization, you can begin to serve personalized content to your users based on their specific language preferences, such as a multilingual website or multi-site application. There are no limits to the number of locales you can add to your Payload project.

To configure Localization, use the `localization` key in your [Payload Config](./overview):

```ts
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  localization: {
    // highlight-line
    // ...
  },
})
```

## Config Options

Add the `localization` property to your Payload Config to enable Localization project-wide. You'll need to provide a list of all locales that you'd like to support as well as set a few other options.

To configure locales, use the `localization.locales` property in your [Payload Config](./overview):

```ts
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  localization: {
    locales: ['en', 'es', 'de'], // required
    defaultLocale: 'en', // required
  },
})
```

You can also define locales using [full configuration objects](#locale-object):

```ts
import { buildConfig } from 'payload'

export default buildConfig({
  collections: [
    // collections go here
  ],
  localization: {
    locales: [
      {
        label: 'English',
        code: 'en',
      },
      {
        label: 'Arabic',
        code: 'ar',
        // opt-in to setting default text-alignment on Input fields to rtl (right-to-left)
        // when current locale is rtl
        rtl: true,
      },
    ],
    defaultLocale: 'en', // required
    fallback: true, // defaults to true
  },
})
```

<Banner type="success">
  **Tip:** Localization works very well alongside
  [I18n](/docs/configuration/i18n).
</Banner>

The following options are available:

| Option                       | Description                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`locales`**                | Array of all the languages that you would like to support. [More details](#locales)                                                                                                                                                                                                                                                                                                                                               |
| **`defaultLocale`**          | Required string that matches one of the locale codes from the array provided. By default, if no locale is specified, documents will be returned in this locale.                                                                                                                                                                                                                                                                   |
| **`fallback`**               | Boolean enabling "fallback" locale functionality. If a document is requested in a locale, but a field does not have a localized value corresponding to the requested locale, then if this property is enabled, the document will automatically fall back to the fallback locale value. If this property is not enabled, the value will not be populated unless a fallback is explicitly provided in the request. True by default. |
| **`filterAvailableLocales`** | A function that is called with the array of `locales` and the `req`, it should return locales to show in admin UI selector. [See more](#filter-available-options).                                                                                                                                                                                                                                                                |

### Locales

The locales array is a list of all the languages that you would like to support. This can be strings for each language code, or [full configuration objects](#locale-object) for more advanced options.

The locale codes do not need to be in any specific format. It's up to you to define how to represent your locales. Common patterns are to use two-letter ISO 639 language codes or four-letter language and country codes (ISO 3166‑1) such as `en-US`, `en-UK`, `es-MX`, etc.

#### Locale Object

| Option               | Description                                                                                                                               |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **`code`** \*        | Unique code to identify the language throughout the APIs for `locale` and `fallbackLocale`                                                |
| **`label`**          | A string to use for the selector when choosing a language, or an object keyed on the i18n keys for different languages in use.            |
| **`rtl`**            | A boolean that when true will make the admin UI display in Right-To-Left.                                                                 |
| **`fallbackLocale`** | The code for this language to fallback to when properties of a document are not present. This can be a single locale or array of locales. |

_\* An asterisk denotes that a property is required._

#### Filter Available Options

In some projects you may want to filter the available locales shown in the admin UI selector. You can do this by providing a `filterAvailableLocales` function in your Payload Config. This is called on the server side and is passed the array of locales. This means that you can determine what locales are visible in the localizer selection menu at the top of the admin panel. You could do this per user, or implement a function that scopes these to tenants and more. Here is an example using request headers in a multi-tenant application:

```ts
// ... rest of Payload config
localization: {
  defaultLocale: 'en',
  locales: ['en', 'es'],
  filterAvailableLocales: async ({ req, locales }) => {
    if (getTenantFromCookie(req.headers, 'text')) {
      const fullTenant = await req.payload.findByID({
        id: getTenantFromCookie(req.headers, 'text') as string,
        collection: 'tenants',
        req,
      })
      if (fullTenant && fullTenant.supportedLocales?.length) {
        return locales.filter((locale) => {
          return fullTenant.supportedLocales?.includes(locale.code as 'en' | 'es')
        })
      }
    }
    return locales
  },
}
```

Since the filtering happens at the root level of the application and its result is not calculated every time you navigate to a new page, you may want to call `router.refresh` in a custom component that watches when values that affect the result change. In the example above, you would want to do this when `supportedLocales` changes on the tenant document.

## Field Localization

Payload Localization works on a **field** level—not a document level. In addition to configuring the base Payload Config to support Localization, you need to specify each field that you would like to localize.

**Here is an example of how to enable Localization for a field:**

```js
{
  name: 'title',
  type: 'text',
  // highlight-start
  localized: true,
  // highlight-end
}
```

With the above configuration, the `title` field will now be saved in the database as an object of all locales instead of a single string.

All field types with a `name` property support the `localized` property—even the more complex field types like `array`s and `block`s.

<Banner type="info">
  **Note:** Enabling Localization for field types that support nested fields
  will automatically create localized "sets" of all fields contained within the
  field. For example, if you have a page layout using a blocks field type, you
  have the choice of either localizing the full layout, by enabling Localization
  on the top-level blocks field, or only certain fields within the layout.
</Banner>

<Banner type="warning">
  **Important:** When converting an existing field to or from `localized: true`
  the data structure in the document will change for this field and so existing
  data for this field will be lost. Before changing the Localization setting on
  fields with existing data, you may need to consider a field migration
  strategy.
</Banner>

## Retrieving Localized Docs

When retrieving documents, you can specify which locale you'd like to receive as well as which fallback locale should be
used.

#### REST API

REST API locale functionality relies on URL query parameters.

**`?locale=`**

Specify your desired locale by providing the `locale` query parameter directly in the endpoint URL.

**`?fallback-locale=`**

Specify fallback locale to be used by providing the `fallback-locale` query parameter. This can be provided as either a
valid locale as provided to your base Payload Config, or `'null'`, `'false'`, or `'none'` to disable falling back.

**Example:**

```
fetch('https://localhost:3000/api/pages?locale=es&fallback-locale=none');
```

#### GraphQL API

In the GraphQL API, you can specify `locale` and `fallbackLocale` args to all relevant queries and mutations.

The `locale` arg will only accept valid locales, but locales will be formatted automatically as valid GraphQL enum
values (dashes or special characters will be converted to underscores, spaces will be removed, etc.). If you are curious
to see how locales are auto-formatted, you can use the [GraphQL playground](/docs/graphql/overview#graphql-playground).

The `fallbackLocale` arg will accept valid locales, an array of locales, as well as `none` to disable falling back.

**Example:**

```graphql
query {
  Posts(locale: de, fallbackLocale: none) {
    docs {
      title
    }
  }
}
```

<Banner>
  In GraphQL, specifying the locale at the top level of a query will
  automatically apply it throughout all nested relationship fields. You can
  override this behavior by re-specifying locale arguments in nested related
  document queries.
</Banner>

#### Local API

You can specify `locale` as well as `fallbackLocale` within the Local API as well as properties on the `options`
argument. The `locale` property will accept any valid locale, and the `fallbackLocale` property will accept any valid
locale, array of locales, as well as `'null'`, `'false'`, `false`, and `'none'`.

**Example:**

```js
const posts = await payload.find({
  collection: 'posts',
  locale: 'es',
  fallbackLocale: false,
})
```

<Banner type="success">
  **Tip:** The REST and Local APIs can return all Localization data in one
  request by passing 'all' or '*' as the **locale** parameter. The response will
  be structured so that field values come back as the full objects keyed for
  each locale instead of the single, translated value.
</Banner>
```

--------------------------------------------------------------------------------

````
