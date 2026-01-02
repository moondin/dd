---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 18
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 18 of 695)

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

---[FILE: preferences.mdx]---
Location: payload-main/docs/admin/preferences.mdx

```text
---
title: Managing User Preferences
label: Preferences
order: 60
desc: Store the preferences of your users as they interact with the Admin Panel.
keywords: admin, preferences, custom, customize, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

As your users interact with the [Admin Panel](./overview), you might want to store their preferences in a persistent manner, so that when they revisit the Admin Panel in a different session or from a different device, they can pick right back up where they left off.

Out of the box, Payload handles the persistence of your users' preferences in a handful of ways, including:

1. Columns in the Collection List View: their active state and order
1. The user's last active [Locale](../configuration/localization)
1. The "collapsed" state of `blocks`, `array`, and `collapsible` fields
1. The last-known state of the `Nav` component, etc.

<Banner type="warning">
  **Important:**

All preferences are stored on an individual user basis. Payload automatically recognizes the user
that is reading or setting a preference via all provided authentication methods.

</Banner>

## Use Cases

This API is used significantly for internal operations of the Admin Panel, as mentioned above. But, if you're building your own React components for use in the Admin Panel, you can allow users to set their own preferences in correspondence to their usage of your components. For example:

- If you have built a "color picker", you could "remember" the last used colors that the user has set for easy access next time
- If you've built a custom `Nav` component, and you've built in an "accordion-style" UI, you might want to store the `collapsed` state of each Nav collapsible item. This way, if an editor returns to the panel, their `Nav` state is persisted automatically
- You might want to store `recentlyAccessed` documents to give admin editors an easy shortcut back to their recently accessed documents on the `Dashboard` or similar
- Many other use cases exist. Invent your own! Give your editors an intelligent and persistent editing experience.

## Database

Payload automatically creates an internally used `payload-preferences` Collection that stores user preferences. Each document in the `payload-preferences` Collection contains the following shape:

| Key               | Value                                                             |
| ----------------- | ----------------------------------------------------------------- |
| `id`              | A unique ID for each preference stored.                           |
| `key`             | A unique `key` that corresponds to the preference.                |
| `user.value`      | The ID of the `user` that is storing its preference.              |
| `user.relationTo` | The `slug` of the Collection that the `user` is logged in as.     |
| `value`           | The value of the preference. Can be any data shape that you need. |
| `createdAt`       | A timestamp of when the preference was created.                   |
| `updatedAt`       | A timestamp set to the last time the preference was updated.      |

## APIs

Preferences are available to both [GraphQL](/docs/graphql/overview#preferences) and [REST](/docs/rest-api/overview#preferences) APIs.

## Adding or reading Preferences in your own components

The Payload Admin Panel offers a `usePreferences` hook. The hook is only meant for use within the Admin Panel itself. It provides you with two methods:

#### `getPreference`

This async method provides an easy way to retrieve a user's preferences by `key`. It will return a promise containing the resulting preference value.

**Arguments**

- `key`: the `key` of your preference to retrieve.

#### `setPreference`

Also async, this method provides you with an easy way to set a user preference. It returns `void`.

**Arguments:**

- `key`: the `key` of your preference to set.
- `value`: the `value` of your preference that you're looking to set.

## Example

Here is an example for how you can utilize `usePreferences` within your custom Admin Panel components. Note - this example is not fully useful and is more just a reference for how to utilize the Preferences API. In this case, we are demonstrating how to set and retrieve a user's last used colors history within a `ColorPicker` or similar type component.

```tsx
'use client'
import React, { Fragment, useState, useEffect, useCallback } from 'react'
import { usePreferences } from '@payloadcms/ui'

const lastUsedColorsPreferenceKey = 'last-used-colors'

export function CustomComponent() {
  const { getPreference, setPreference } = usePreferences()

  // Store the last used colors in local state
  const [lastUsedColors, setLastUsedColors] = useState([])

  // Callback to add a color to the last used colors
  const updateLastUsedColors = useCallback(
    (color) => {
      // First, check if color already exists in last used colors.
      // If it already exists, there is no need to update preferences
      const colorAlreadyExists = lastUsedColors.indexOf(color) > -1

      if (!colorAlreadyExists) {
        const newLastUsedColors = [...lastUsedColors, color]

        setLastUsedColors(newLastUsedColors)
        setPreference(lastUsedColorsPreferenceKey, newLastUsedColors)
      }
    },
    [lastUsedColors, setPreference],
  )

  // Retrieve preferences on component mount
  // This will only be run one time, because the `getPreference` method never changes
  useEffect(() => {
    const asyncGetPreference = async () => {
      const lastUsedColorsFromPreferences = await getPreference(
        lastUsedColorsPreferenceKey,
      )
      setLastUsedColors(lastUsedColorsFromPreferences)
    }

    asyncGetPreference()
  }, [getPreference])

  return (
    <div>
      <button type="button" onClick={() => updateLastUsedColors('red')}>
        Use red
      </button>
      <button type="button" onClick={() => updateLastUsedColors('blue')}>
        Use blue
      </button>
      <button type="button" onClick={() => updateLastUsedColors('purple')}>
        Use purple
      </button>
      <button type="button" onClick={() => updateLastUsedColors('yellow')}>
        Use yellow
      </button>
      {lastUsedColors && (
        <Fragment>
          <h5>Last used colors:</h5>
          <ul>
            {lastUsedColors?.map((color) => <li key={color}>{color}</li>)}
          </ul>
        </Fragment>
      )}
    </div>
  )
}
```
```

--------------------------------------------------------------------------------

---[FILE: preview.mdx]---
Location: payload-main/docs/admin/preview.mdx

```text
---
title: Preview
label: Preview
order: 30
desc: Enable links to your front-end to preview published or draft content.
keywords: admin, components, preview, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

Preview is a feature that allows you to generate a direct link to your front-end application. When enabled, a "preview" button will appear on the Edit View within the [Admin Panel](./overview) with an href pointing to the URL you provide. This will provide your editors with a quick way of navigating to the front-end application where that Document's data is represented. Otherwise, they'd have to determine that URL themselves which is not always straightforward especially in complex apps.

The Preview feature can also be used to achieve something known as "Draft Preview". With Draft Preview, you can navigate to your front-end application and enter "draft mode", where your queries are modified to fetch draft content instead of published content. This is useful for seeing how your content will look before being published. [More details](#draft-preview).

<Banner type="warning">
  **Note:** Preview is different than [Live Preview](../live-preview/overview).
  Live Preview loads your app within an iframe and renders it in the Admin Panel
  allowing you to see changes in real-time. Preview, on the other hand, allows
  you to generate a direct link to your front-end application.
</Banner>

To add Preview, pass a function to the `admin.preview` property in any [Collection Config](../configuration/collections#admin-options) or [Global Config](../configuration/globals#admin-options):

```ts
import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    preview: ({ slug }) => `http://localhost:3000/${slug}`,
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
    },
  ],
}
```

## Options

The `preview` function resolves to a string that points to your front-end application with additional URL parameters. This can be an absolute URL or a relative path, and can run async if needed.

The following arguments are provided to the `preview` function:

| Path          | Description                                                                                |
| ------------- | ------------------------------------------------------------------------------------------ |
| **`doc`**     | The data of the Document being edited. This includes changes that have not yet been saved. |
| **`options`** | An object with additional properties.                                                      |

The `options` object contains the following properties:

| Path         | Description                                           |
| ------------ | ----------------------------------------------------- |
| **`locale`** | The current locale of the Document being edited.      |
| **`req`**    | The Payload Request object.                           |
| **`token`**  | The JWT token of the currently authenticated user.    |

If your application requires a fully qualified URL, such as within deploying to Vercel Preview Deployments, you can use the `req` property to build this URL:

```ts
preview: (doc, { req }) => `${req.protocol}//${req.host}/${doc.slug}` // highlight-line
```

## Draft Preview

The Preview feature can be used to achieve "Draft Preview". After clicking the preview button from the Admin Panel, you can enter into "draft mode" within your front-end application. This will allow you to adjust your page queries to include the `draft: true` param. When this param is present on the request, Payload will send back a draft document as opposed to a published one based on the document's `_status` field.

To enter draft mode, the URL provided to the `preview` function can point to a custom endpoint in your front-end application that sets a cookie or session variable to indicate that draft mode is enabled. This is framework specific, so the mechanisms here vary from framework to framework although the underlying concept is the same.

### Next.js

If you're using Next.js, you can do the following code to enter [Draft Mode](https://nextjs.org/docs/app/building-your-application/configuring/draft-mode).

#### Step 1: Format the Preview URL

First, format your `admin.preview` function to point to a custom endpoint that you'll open on your front-end. This URL should include a few key query search params:

```ts
import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    preview: ({ slug }) => {
      const encodedParams = new URLSearchParams({
        slug,
        collection: 'pages',
        path: `/${slug}`,
        previewSecret: process.env.PREVIEW_SECRET || '',
      })

      return `/preview?${encodedParams.toString()}` // highlight-line
    },
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
    },
  ],
}
```

#### Step 2: Create the Preview Route

Then, create an API route that verifies the preview secret, authenticates the user, and enters draft mode:

`/app/preview/route.ts`

```ts
import type { CollectionSlug, PayloadRequest } from 'payload'
import { getPayload } from 'payload'

import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

import configPromise from '@payload-config'

export async function GET(
  req: {
    cookies: {
      get: (name: string) => {
        value: string
      }
    }
  } & Request,
): Promise<Response> {
  const payload = await getPayload({ config: configPromise })

  const { searchParams } = new URL(req.url)

  const path = searchParams.get('path')
  const collection = searchParams.get('collection') as CollectionSlug
  const slug = searchParams.get('slug')
  const previewSecret = searchParams.get('previewSecret')

  if (previewSecret !== process.env.PREVIEW_SECRET) {
    return new Response('You are not allowed to preview this page', {
      status: 403,
    })
  }

  if (!path || !collection || !slug) {
    return new Response('Insufficient search params', { status: 404 })
  }

  if (!path.startsWith('/')) {
    return new Response(
      'This endpoint can only be used for relative previews',
      { status: 500 },
    )
  }

  let user

  try {
    user = await payload.auth({
      req: req as unknown as PayloadRequest,
      headers: req.headers,
    })
  } catch (error) {
    payload.logger.error(
      { err: error },
      'Error verifying token for live preview',
    )
    return new Response('You are not allowed to preview this page', {
      status: 403,
    })
  }

  const draft = await draftMode()

  if (!user) {
    draft.disable()
    return new Response('You are not allowed to preview this page', {
      status: 403,
    })
  }

  // You can add additional checks here to see if the user is allowed to preview this page

  draft.enable()

  redirect(path)
}
```

#### Step 3: Query Draft Content

Finally, in your front-end application, you can detect draft mode and adjust your queries to include drafts:

`/app/[slug]/page.tsx`

```ts
export default async function Page({ params: paramsPromise }) {
  const { slug = 'home' } = await paramsPromise

  const { isEnabled: isDraftMode } = await draftMode()

  const payload = await getPayload({ config })

  const page = await payload.find({
    collection: 'pages',
    depth: 0,
    draft: isDraftMode, // highlight-line
    limit: 1,
    overrideAccess: isDraftMode,
    where: {
      slug: {
        equals: slug,
      },
    },
  })?.then(({ docs }) => docs?.[0])

  if (page === null) {
    return notFound()
  }

  return (
    <main>
      <h1>{page?.title}</h1>
    </main>
  )
}
```

<Banner type="success">
  **Note:** For fully working example of this, check out the official [Draft
  Preview
  Example](https://github.com/payloadcms/payload/tree/main/examples/draft-preview)
  in the [Examples
  Directory](https://github.com/payloadcms/payload/tree/main/examples).
</Banner>

### Conditional Preview URLs

You can also conditionally enable or disable the preview button based on the document's data. This is useful for scenarios where you only want to show the preview button when certain criteria are met.

To do this, simply return `null` from the `preview` function when you want to hide the preview button:

```ts
import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    preview: (doc) => {
      return doc?.enabled ? `http://localhost:3000/${doc.slug}` : null
    },
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
    },
    {
      name: 'enabled',
      type: 'checkbox',
    },
  ],
}
```
```

--------------------------------------------------------------------------------

````
