---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 17
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 17 of 695)

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

---[FILE: locked-documents.mdx]---
Location: payload-main/docs/admin/locked-documents.mdx

```text
---
title: Document Locking
label: Document Locking
order: 40
desc: Ensure your documents are locked during editing to prevent concurrent changes from multiple users and maintain data integrity.
keywords: locking, document locking, edit locking, document, concurrency, Payload, headless, Content Management System, cms, javascript, react, node, nextjs
---

Document locking in Payload ensures that only one user at a time can edit a document, preventing data conflicts and accidental overwrites. When a document is locked, other users are prevented from making changes until the lock is released, ensuring data integrity in collaborative environments.

The lock is automatically triggered when a user begins editing a document within the Admin Panel and remains in place until the user exits the editing view or the lock expires due to inactivity.

## How it works

When a user starts editing a document, Payload locks it for that user. If another user attempts to access the same document, they will be notified that it is currently being edited. They can then choose one of the following options:

- View in Read-Only: View the document without the ability to make any changes.
- Take Over: Take over editing from the current user, which locks the document for the new editor and notifies the original user.
- Return to Dashboard: Navigate away from the locked document and continue with other tasks.

The lock will automatically expire after a set period of inactivity, configurable using the `duration` property in the `lockDocuments` configuration, after which others can resume editing.

<Banner type="info">
  **Note:** If your application does not require document locking, you can
  disable this feature for any collection or global by setting the
  `lockDocuments` property to `false`.
</Banner>

### Config Options

The `lockDocuments` property exists on both the Collection Config and the Global Config. Document locking is enabled by default, but you can customize the lock duration or turn off the feature for any collection or global.

Here's an example configuration for document locking:

```ts
import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    // other fields...
  ],
  lockDocuments: {
    duration: 600, // Duration in seconds
  },
}
```

#### Locking Options

| Option              | Description                                                                                                                                                                    |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`lockDocuments`** | Enables or disables document locking for the collection or global. By default, document locking is enabled. Set to an object to configure, or set to false to disable locking. |
| **`duration`**      | Specifies the duration (in seconds) for how long a document remains locked without user interaction. The default is 300 seconds (5 minutes).                                   |

### Impact on APIs

Document locking affects both the Local and REST APIs, ensuring that if a document is locked, concurrent users will not be able to perform updates or deletes on that document (including globals). If a user attempts to update or delete a locked document, they will receive an error.

Once the document is unlocked or the lock duration has expired, other users can proceed with updates or deletes as normal.

#### Overriding Locks

For operations like `update` and `delete`, Payload includes an `overrideLock` option. This boolean flag, when set to `false`, enforces document locks, ensuring that the operation will not proceed if another user currently holds the lock.

By default, `overrideLock` is set to `true`, which means that document locks are ignored, and the operation will proceed even if the document is locked. To enforce locks and prevent updates or deletes on locked documents, set `overrideLock: false`.

```ts
const result = await payload.update({
  collection: 'posts',
  id: '123',
  data: {
    title: 'New title',
  },
  overrideLock: false, // Enforces the document lock, preventing updates if the document is locked
})
```

This option is particularly useful in scenarios where administrative privileges or specific workflows require you to override the lock and ensure the operation is completed.
```

--------------------------------------------------------------------------------

---[FILE: metadata.mdx]---
Location: payload-main/docs/admin/metadata.mdx

```text
---
title: Page Metadata
label: Metadata
order: 70
desc: Customize the metadata of your pages within the Admin Panel
keywords: admin, components, custom, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

Every page within the Admin Panel automatically receives dynamic, auto-generated metadata derived from live document data, the user's current locale, and more. This includes the page title, description, og:image, etc. and requires no additional configuration.

Metadata is fully configurable at the root level and cascades down to individual collections, documents, and custom views. This allows for the ability to control metadata on any page with high precision, while also providing sensible defaults.

All metadata is injected into Next.js' [`generateMetadata`](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) function. This is used to generate the `<head>` of pages within the Admin Panel. All metadata options that are available in Next.js are exposed by Payload.

Within the Admin Panel, metadata can be customized at the following levels:

- [Root Metadata](#root-metadata)
- [Collection Metadata](#collection-metadata)
- [Global Metadata](#global-metadata)
- [View Metadata](#view-metadata)

All of these types of metadata share a similar structure, with a few key differences on the Root level. To customize metadata, consult the list of available scopes. Determine the scope that corresponds to what you are trying to accomplish, then author your metadata within the Payload Config accordingly.

## Root Metadata

Root Metadata is the metadata that is applied to all pages within the Admin Panel. This is where you can control things like the suffix appended onto each page's title, the favicon displayed in the browser's tab, and the Open Graph data that is used when sharing the Admin Panel on social media.

To customize Root Metadata, use the `admin.meta` key in your Payload Config:

```ts
{
  // ...
  admin: {
    // highlight-start
    meta: {
    // highlight-end
      title: 'My Admin Panel',
      description: 'The best admin panel in the world',
      icons: [
        {
          rel: 'icon',
          type: 'image/png',
          url: '/favicon.png',
        },
      ],
    },
  },
}
```

The following options are available for Root Metadata:

| Key                  | Type                                    | Description                                                                                                                                                                                                                                                               |
| -------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defaultOGImageType` | `dynamic` (default), `static`, or `off` | The type of default OG image to use. If set to `dynamic`, Payload will use Next.js image generation to create an image with the title of the page. If set to `static`, Payload will use the `defaultOGImage` URL. If set to `off`, Payload will not generate an OG image. |
| `titleSuffix`        | `string`                                | A suffix to append to the end of the title of every page. Defaults to "- Payload".                                                                                                                                                                                        |
| `[keyof Metadata]`   | `unknown`                               | Any other properties that Next.js supports within the `generateMetadata` function. [More details](https://nextjs.org/docs/app/api-reference/functions/generate-metadata).                                                                                                 |

<Banner type="success">
  **Reminder:** These are the _root-level_ options for the Admin Panel. You can
  also customize metadata on the [Collection](../configuration/collections),
  [Global](../configuration/globals), and Document levels through their
  respective configs.
</Banner>

### Icons

The Icons Config corresponds to the `<link>` tags that are used to specify icons for the Admin Panel. The `icons` key is an array of objects, each of which represents an individual icon. Icons are differentiated from one another by their `rel` attribute, which specifies the relationship between the document and the icon.

The most common icon type is the favicon, which is displayed in the browser tab. This is specified by the `rel` attribute `icon`. Other common icon types include `apple-touch-icon`, which is used by Apple devices when the Admin Panel is saved to the home screen, and `mask-icon`, which is used by Safari to mask the Admin Panel icon.

To customize icons, use the `admin.meta.icons` property in your Payload Config:

```ts
{
  // ...
  admin: {
    meta: {
      // highlight-start
      icons: [
      // highlight-end
        {
          rel: 'icon',
          type: 'image/png',
          url: '/favicon.png',
        },
        {
          rel: 'apple-touch-icon',
          type: 'image/png',
          url: '/apple-touch-icon.png',
        },
      ],
    },
  },
}
```

For a full list of all available Icon options, see the [Next.js documentation](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#icons).

### Open Graph

Open Graph metadata is a set of tags that are used to control how URLs are displayed when shared on social media platforms. Open Graph metadata is automatically generated by Payload, but can be customized at the Root level.

To customize Open Graph metadata, use the `admin.meta.openGraph` property in your Payload Config:

```ts
{
  // ...
  admin: {
    meta: {
      // highlight-start
      openGraph: {
      // highlight-end
        description: 'The best admin panel in the world',
        images: [
          {
            url: 'https://example.com/image.jpg',
            width: 800,
            height: 600,
          },
        ],
        siteName: 'Payload',
        title: 'My Admin Panel',
      },
    },
  },
}
```

For a full list of all available Open Graph options, see the [Next.js documentation](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#opengraph).

### Robots

Setting the `robots` property will allow you to control the `robots` meta tag that is rendered within the `<head>` of the Admin Panel. This can be used to control how search engines index pages and displays them in search results.

By default, the Admin Panel is set to prevent search engines from indexing pages within the Admin Panel.

To customize the Robots Config, use the `admin.meta.robots` property in your Payload Config:

```ts
{
  // ...
  admin: {
    meta: {
      // highlight-start
      robots: 'noindex, nofollow',
      // highlight-end
    },
  },
}
```

For a full list of all available Robots options, see the [Next.js documentation](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#robots).

##### Prevent Crawling

While setting meta tags via `admin.meta.robots` can prevent search engines from _indexing_ web pages, it does not prevent them from being _crawled_.

To prevent your pages from being crawled altogether, add a `robots.txt` file to your root directory.

```text
User-agent: *
Disallow: /admin/
```

<Banner type="info">
  **Note:** If you've customized the path to your Admin Panel via
  `config.routes`, be sure to update the `Disallow` directive to match your
  custom path.
</Banner>

## Collection Metadata

Collection Metadata is the metadata that is applied to all pages within any given Collection within the Admin Panel. This metadata is used to customize the title and description of all views within any given Collection, unless overridden by the view itself.

To customize Collection Metadata, use the `admin.meta` key within your Collection Config:

```ts
import type { CollectionConfig } from 'payload'

export const MyCollection: CollectionConfig = {
  // ...
  admin: {
    // highlight-start
    meta: {
      // highlight-end
      title: 'My Collection',
      description: 'The best collection in the world',
    },
  },
}
```

The Collection Meta config has the same options as the [Root Metadata](#root-metadata) config.

## Global Metadata

Global Metadata is the metadata that is applied to all pages within any given Global within the Admin Panel. This metadata is used to customize the title and description of all views within any given Global, unless overridden by the view itself.

To customize Global Metadata, use the `admin.meta` key within your Global Config:

```ts
import { GlobalConfig } from 'payload'

export const MyGlobal: GlobalConfig = {
  // ...
  admin: {
    // highlight-start
    meta: {
      // highlight-end
      title: 'My Global',
      description: 'The best admin panel in the world',
    },
  },
}
```

The Global Meta config has the same options as the [Root Metadata](#root-metadata) config.

## View Metadata

View Metadata is the metadata that is applied to specific [Views](../custom-components/custom-views) within the Admin Panel. This metadata is used to customize the title and description of a specific view, overriding any metadata set at the [Root](#root-metadata), [Collection](#collection-metadata), or [Global](#global-metadata) level.

To customize View Metadata, use the `meta` key within your View Config:

```ts
{
  // ...
  admin: {
    views: {
      dashboard: {
        // highlight-start
        meta: {
        // highlight-end
          title: 'My Dashboard',
          description: 'The best dashboard in the world',
        }
      },
    },
  },
}
```
```

--------------------------------------------------------------------------------

---[FILE: overview.mdx]---
Location: payload-main/docs/admin/overview.mdx

```text
---
title: The Admin Panel
label: Overview
order: 10
desc: Manage your data and customize the Payload Admin Panel by swapping in your own React components. Create, modify or remove views, fields, styles and much more.
keywords: admin, components, custom, customize, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

Payload dynamically generates a beautiful, [fully type-safe](../typescript/overview) Admin Panel to manage your users and data. It is highly performant, even with 100+ fields, and is translated in over 30 languages. Within the Admin Panel you can manage content, [render your site](../live-preview/overview), [preview drafts](./preview), [diff versions](../versions/overview), and so much more.

The Admin Panel is designed to [white-label your brand](https://payloadcms.com/blog/white-label-admin-ui). You can endlessly customize and extend the Admin UI by swapping in your own [Custom Components](../custom-components/overview)—everything from simple field labels to entire views can be modified or replaced to perfectly tailor the interface for your editors.

The Admin Panel is written in [TypeScript](https://www.typescriptlang.org) and built with [React](https://react.dev) using the [Next.js App Router](https://nextjs.org/docs/app). It supports [React Server Components](https://react.dev/reference/rsc/server-components), enabling the use of the [Local API](/docs/local-api/overview) on the front-end. You can install Payload into any [existing Next.js app in just one line](../getting-started/installation) and [deploy it anywhere](../production/deployment).

<Banner type="success">
  The Payload Admin Panel is designed to be as minimal and straightforward as
  possible to allow easy customization and control. [Learn
  more](../custom-components/overview).
</Banner>

<LightDarkImage
  srcLight="https://payloadcms.com/images/docs/admin.jpg"
  srcDark="https://payloadcms.com/images/docs/admin-dark.jpg"
  alt="Admin Panel with collapsible sidebar"
  caption="Redesigned Admin Panel with a collapsible sidebar that's open by default, providing greater extensibility and enhanced horizontal real estate."
/>

## Project Structure

The Admin Panel serves as the entire HTTP layer for Payload, providing a full CRUD interface for your app. This means that both the [REST](../rest-api/overview) and [GraphQL](../graphql/overview) APIs are simply [Next.js Routes](https://nextjs.org/docs/app/building-your-application/routing) that exist directly alongside your front-end application.

Once you [install Payload](../getting-started/installation), the following files and directories will be created in your app:

```plaintext
app
├─ (payload)
├── admin
├─── [[...segments]]
├──── page.tsx
├──── not-found.tsx
├── api
├─── [...slug]
├──── route.ts
├── graphql
├──── route.ts
├── graphql-playground
├──── route.ts
├── custom.scss
├── layout.tsx
```

<Banner type="info">
  If you are not familiar with Next.js project structure, you can [learn more
  about it here](https://nextjs.org/docs/getting-started/project-structure).
</Banner>

As shown above, all Payload routes are nested within the `(payload)` route group. This creates a boundary between the Admin Panel and the rest of your application by scoping all layouts and styles. The `layout.tsx` file within this directory, for example, is where Payload manages the `html` tag of the document to set proper [`lang`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang) and [`dir`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir) attributes, etc.

The `admin` directory contains all the _pages_ related to the interface itself, whereas the `api` and `graphql` directories contain all the _routes_ related to the [REST API](../rest-api/overview) and [GraphQL API](../graphql/overview). All admin routes are [easily configurable](#customizing-routes) to meet your application's exact requirements.

<Banner type="warning">
  **Note:** If you don't intend to use the Admin Panel, [REST
  API](../rest-api/overview), or [GraphQL API](../graphql/overview), you can
  opt-out by simply deleting their corresponding directories within your Next.js
  app. The overhead, however, is completely constrained to these routes, and
  will not slow down or affect Payload outside when not in use.
</Banner>

Finally, the `custom.scss` file is where you can add or override globally-oriented styles in the Admin Panel, such as modify the color palette. Customizing the look and feel through CSS alone is a powerful feature of the Admin Panel, [more on that here](./customizing-css).

All auto-generated files will contain the following comments at the top of each file:

```tsx
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */,
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
```

## Admin Options

All root-level options for the Admin Panel are defined in your [Payload Config](../configuration/overview) under the `admin` property:

```ts
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  // highlight-start
  admin: {
    // ...
  },
  // highlight-end
})
```

The following options are available:

| Option                     | Description                                                                                                                                     |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `avatar`                   | Set account profile picture. Options: `gravatar`, `default` or a custom React component.                                                        |
| `autoLogin`                | Used to automate log-in for dev and demonstration convenience. [More details](../authentication/overview).                                      |
| `autoRefresh`              | Used to automatically refresh user tokens for users logged into the dashboard. [More details](../authentication/overview).                      |
| `components`               | Component overrides that affect the entirety of the Admin Panel. [More details](../custom-components/overview).                                 |
| `custom`                   | Any custom properties you wish to pass to the Admin Panel.                                                                                      |
| `dateFormat`               | The date format that will be used for all dates within the Admin Panel. Any valid [date-fns](https://date-fns.org/) format pattern can be used. |
| `livePreview`              | Enable real-time editing for instant visual feedback of your front-end application. [More details](../live-preview/overview).                   |
| `meta`                     | Base metadata to use for the Admin Panel. [More details](./metadata).                                                                           |
| `routes`                   | Replace built-in Admin Panel routes with your own custom routes. [More details](#customizing-routes).                                           |
| `suppressHydrationWarning` | If set to `true`, suppresses React hydration mismatch warnings during the hydration of the root `<html>` tag. Defaults to `false`.              |
| `theme`                    | Restrict the Admin Panel theme to use only one of your choice. Default is `all`.                                                                |
| `timezones`                | Configure the timezone settings for the admin panel. [More details](#timezones)                                                                 |
| `toast`                    | Customize the handling of toast messages within the Admin Panel. [More details](#toasts)                                                        |
| `user`                     | The `slug` of the Collection that you want to allow to login to the Admin Panel. [More details](#the-admin-user-collection).                    |

<Banner type="success">
  **Reminder:** These are the _root-level_ options for the Admin Panel. You can
  also customize [Collection Admin
  Options](../configuration/collections#admin-options) and [Global Admin
  Options](../configuration/globals#admin-options) through their respective
  `admin` keys.
</Banner>

### The Admin User Collection

To specify which Collection to allow to login to the Admin Panel, pass the `admin.user` key equal to the slug of any auth-enabled Collection:

```ts
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  admin: {
    user: 'admins', // highlight-line
  },
})
```

<Banner type="warning">
  **Important:**

The Admin Panel can only be used by a single auth-enabled Collection. To enable authentication for a Collection, simply set `auth: true` in the Collection's configuration. See [Authentication](../authentication/overview) for more information.

</Banner>

By default, if you have not specified a Collection, Payload will automatically provide a `User` Collection with access to the Admin Panel. You can customize or override the fields and settings of the default `User` Collection by adding your own Collection with `slug: 'users'`. Doing this will force Payload to use your provided `User` Collection instead of its default version.

You can use whatever Collection you'd like to access the Admin Panel as long as the Collection supports [Authentication](/docs/authentication/overview). It doesn't need to be called `users`. For example, you may wish to have two Collections that both support authentication:

- `admins` - meant to have a higher level of permissions to manage your data and access the Admin Panel
- `customers` - meant for end users of your app that should not be allowed to log into the Admin Panel

To do this, specify `admin: { user: 'admins' }` in your config. This will provide access to the Admin Panel to only `admins`. Any users authenticated as `customers` will be prevented from accessing the Admin Panel. See [Access Control](/docs/access-control/overview) for full details.

### Role-based Access Control

It is also possible to allow multiple user types into the Admin Panel with limited permissions, known as role-based access control (RBAC). For example, you may wish to have two roles within the `admins` Collection:

- `super-admin` - full access to the Admin Panel to perform any action
- `editor` - limited access to the Admin Panel to only manage content

To do this, add a `roles` or similar field to your auth-enabled Collection, then use the `access.admin` property to grant or deny access based on the value of that field. See [Access Control](/docs/access-control/overview) for full details. For a complete, working example of role-based access control, check out the official [Auth Example](https://github.com/payloadcms/payload/tree/main/examples/auth).

## Customizing Routes

You have full control over the routes that Payload binds itself to. This includes both [Root-level Routes](#root-level-routes) such as the [REST API](../rest-api/overview), and [Admin-level Routes](#admin-level-routes) such as the user's account page. You can customize these routes to meet the needs of your application simply by specifying the desired paths in your config.

### Root-level Routes

Root-level routes are those that are not behind the `/admin` path, such as the [REST API](../rest-api/overview) and [GraphQL API](../graphql/overview), or the root path of the Admin Panel itself.

To customize root-level routes, use the `routes` property in your [Payload Config](../configuration/overview):

```ts
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  routes: {
    admin: '/custom-admin-route', // highlight-line
  },
})
```

The following options are available:

| Option              | Default route         | Description                                       |
| ------------------- | --------------------- | ------------------------------------------------- |
| `admin`             | `/admin`              | The Admin Panel itself.                           |
| `api`               | `/api`                | The [REST API](../rest-api/overview) base path.   |
| `graphQL`           | `/graphql`            | The [GraphQL API](../graphql/overview) base path. |
| `graphQLPlayground` | `/graphql-playground` | The GraphQL Playground.                           |

<Banner type="warning">
  **Important:** Changing Root-level Routes also requires a change to [Project
  Structure](#project-structure) to match the new route. [More
  details](#customizing-root-level-routes).
</Banner>

<Banner type="success">
  **Tip:** You can easily add _new_ routes to the Admin Panel through [Custom
  Endpoints](../rest-api/overview#custom-endpoints) and [Custom
  Views](../custom-components/custom-views).
</Banner>

#### Customizing Root-level Routes

You can change the Root-level Routes as needed, such as to mount the Admin Panel at the root of your application.

This change, however, also requires a change to your [Project Structure](#project-structure) to match the new route.

For example, if you set `routes.admin` to `/`:

```ts
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  routes: {
    admin: '/', // highlight-line
  },
})
```

Then you would need to completely remove the `admin` directory from the project structure:

```plaintext
app
├─ (payload)
├── [[...segments]]
├──── ...
├── layout.tsx
```

<Banner type="warning">
  **Note:** If you set Root-level Routes _before_ auto-generating the Admin
  Panel via `create-payload-app`, your [Project Structure](#project-structure)
  will already be set up correctly.
</Banner>

### Admin-level Routes

Admin-level routes are those behind the `/admin` path. These are the routes that are part of the Admin Panel itself, such as the user's account page, the login page, etc.

To customize admin-level routes, use the `admin.routes` property in your [Payload Config](../configuration/overview):

```ts
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  admin: {
    routes: {
      account: '/my-account', // highlight-line
    },
  },
})
```

The following options are available:

| Option            | Default route        | Description                               |
| ----------------- | -------------------- | ----------------------------------------- |
| `account`         | `/account`           | The user's account page.                  |
| `createFirstUser` | `/create-first-user` | The page to create the first user.        |
| `forgot`          | `/forgot`            | The password reset page.                  |
| `inactivity`      | `/logout-inactivity` | The page to redirect to after inactivity. |
| `login`           | `/login`             | The login page.                           |
| `logout`          | `/logout`            | The logout page.                          |
| `reset`           | `/reset`             | The password reset page.                  |
| `unauthorized`    | `/unauthorized`      | The unauthorized page.                    |

<Banner type="success">
  **Note:** You can also swap out entire _views_ out for your own, using the
  `admin.views` property of the Payload Config. See [Custom
  Views](../custom-components/custom-views) for more information.
</Banner>

## I18n

The Payload Admin Panel is translated in over [30 languages and counting](https://github.com/payloadcms/payload/tree/main/packages/translations). Languages are automatically detected based on the user's browser and used by the Admin Panel to display all text in that language. If no language was detected, or if the user's language is not yet supported, English will be chosen. Users can easily specify their language by selecting one from their account page. See [I18n](../configuration/i18n) for more information.

## Light and Dark Modes

Users in the Admin Panel have the ability to choose between light mode and dark mode for their editing experience. Users can select their preferred theme from their account page. Once selected, it is saved to their user's preferences and persisted across sessions and devices. If no theme was selected, the Admin Panel will automatically detect the operation system's theme and use that as the default.

## Timezones

The `admin.timezones` configuration allows you to configure timezone settings for the Admin Panel. You can customise the available list of timezones and in the future configure the default timezone for the Admin Panel and for all users.

Dates in Payload are always stored in UTC in the database. The timezone settings in the Admin Panel affect only how dates are displayed to editors to help ensure consistency for multi-region editorial teams.

The following options are available:

| Option               | Description                                                                                                                                                                        |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `supportedTimezones` | An array of label/value options for selectable timezones where the value is the IANA name eg. `America/Detroit`. Also supports a function that is given the defaultTimezones list. |
| `defaultTimezone`    | The `value` of the default selected timezone. eg. `America/Los_Angeles`                                                                                                            |

We validate the supported timezones array by checking the value against the list of IANA timezones supported via the Intl API, specifically `Intl.supportedValuesOf('timeZone')`.

<Banner type="info">
  **Important** You must enable timezones on each individual date field via
  `timezone: true`. See [Date Fields](../fields/overview#date) for more
  information.
</Banner>

For example:

```ts
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  admin: {
    timezones: {
      supportedTimezones: [
        {
          label: 'Europe/Dublin',
          value: 'Europe/Dublin',
        },
        {
          label: 'Europe/Amsterdam',
          value: 'Europe/Amsterdam',
        },
        {
          label: 'Europe/Bucharest',
          value: 'Europe/Bucharest',
        },
      ],
      defaultTimezone: 'Europe/Amsterdam',
    },
  },
})
```

### Extending supported timezones

For `supportedTimezones` we also support using a function that is given the defaultTimezones list. This allows you to easily extend the default list of timezones rather than replacing it completely.

```ts
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  admin: {
    timezones: {
      supportedTimezones: ({ defaultTimezones }) => [
        ...defaultTimezones, // list provided by Payload
        {
          label: 'Europe/Dublin',
          value: 'Europe/Dublin',
        },
        {
          label: 'Europe/Amsterdam',
          value: 'Europe/Amsterdam',
        },
        {
          label: 'Europe/Bucharest',
          value: 'Europe/Bucharest',
        },
      ],
      defaultTimezone: 'Europe/Amsterdam',
    },
  },
})
```

### Using a UTC timezone

In some situations you may want the displayed date and time to match exactly what's being stored in the database where we always store values in UTC. You can do this by adding UTC as a valid timezone option.
Using a UTC timezone means that an editor inputing for example '1pm' will always see '1pm' and the stored value will be '13:00:00Z'.

```ts
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  admin: {
    timezones: {
      supportedTimezones: [
        {
          label: 'UTC',
          value: 'UTC',
        },
        // ...other timezones
      ],
      defaultTimezone: 'UTC',
    },
  },
})
```

## Toast

The `admin.toast` configuration allows you to customize the handling of toast messages within the Admin Panel, such as increasing the duration they are displayed and limiting the number of visible toasts at once.

<Banner type="info">
  **Note:** The Admin Panel currently uses the
  [Sonner](https://sonner.emilkowal.ski) library for toast notifications.
</Banner>

The following options are available for the `admin.toast` configuration:

| Option     | Description                                                                                                      | Default        |
| ---------- | ---------------------------------------------------------------------------------------------------------------- | -------------- |
| `duration` | The length of time (in milliseconds) that a toast message is displayed.                                          | `4000`         |
| `expand`   | If `true`, will expand the message stack so that all messages are shown simultaneously without user interaction. | `false`        |
| `limit`    | The maximum number of toasts that can be visible on the screen at once.                                          | `5`            |
| `position` | The position of the toast on the screen.                                                                         | `bottom-right` |
```

--------------------------------------------------------------------------------

````
