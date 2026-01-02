---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 16
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 16 of 695)

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

---[FILE: collections.mdx]---
Location: payload-main/docs/access-control/collections.mdx

```text
---
title: Collection Access Control
label: Collections
order: 20
desc: With Collection-level Access Control you can define which users can create, read, update or delete Collections.
keywords: collections, access control, permissions, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

Collection Access Control is [Access Control](../access-control/overview) used to restrict access to Documents within a [Collection](../getting-started/concepts#collections), as well as what they can and cannot see within the [Admin Panel](../admin/overview) as it relates to that Collection.

To add Access Control to a Collection, use the `access` property in your [Collection Config](../configuration/collections):

```ts
import type { CollectionConfig } from 'payload'

export const CollectionWithAccessControl: CollectionConfig = {
  // ...
  access: {
    // highlight-line
    // ...
  },
}
```

## Config Options

Access Control is specific to the operation of the request.

To add Access Control to a Collection, use the `access` property in your [Collection Config](../configuration/collections):

```ts
import type { CollectionConfig } from 'payload';

export const CollectionWithAccessControl: CollectionConfig = {
  // ...
  // highlight-start
  access: {
    create: () => {...},
    read: () => {...},
    update: () => {...},
    delete: () => {...},

    // Auth-enabled Collections only
    admin: () => {...},
    unlock: () => {...},

    // Version-enabled Collections only
    readVersions: () => {...},
  },
  // highlight-end
}
```

The following options are available:

| Function     | Allows/Denies Access                                                 |
| ------------ | -------------------------------------------------------------------- |
| **`create`** | Used in the `create` operation. [More details](#create).             |
| **`read`**   | Used in the `find` and `findByID` operations. [More details](#read). |
| **`update`** | Used in the `update` operation. [More details](#update).             |
| **`delete`** | Used in the `delete` operation. [More details](#delete).             |

If a Collection supports [`Authentication`](../authentication/overview), the following additional options are available:

| Function     | Allows/Denies Access                                                                     |
| ------------ | ---------------------------------------------------------------------------------------- |
| **`admin`**  | Used to restrict access to the [Admin Panel](../admin/overview). [More details](#admin). |
| **`unlock`** | Used to restrict which users can access the `unlock` operation. [More details](#unlock). |

If a Collection supports [Versions](../versions/overview), the following additional options are available:

| Function           | Allows/Denies Access                                                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`readVersions`** | Used to control who can read versions, and who can't. Will automatically restrict the Admin UI version viewing access. [More details](#read-versions). |

### Create

Returns a boolean which allows/denies access to the `create` request.

To add create Access Control to a Collection, use the `create` property in the [Collection Config](../configuration/collections):

```ts
import type { CollectionConfig } from 'payload'

export const CollectionWithCreateAccess: CollectionConfig = {
  // ...
  access: {
    // highlight-start
    create: ({ req: { user }, data }) => {
      return Boolean(user)
    },
    // highlight-end
  },
}
```

The following arguments are provided to the `create` function:

| Option     | Description                                                                                                                   |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **`req`**  | The [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object containing the currently authenticated `user`. |
| **`data`** | The data passed to create the document with.                                                                                  |

### Read

Returns a boolean which allows/denies access to the `read` request.

To add read Access Control to a Collection, use the `read` property in the [Collection Config](../configuration/collections):

```ts
import type { CollectionConfig } from 'payload'

export const CollectionWithReadAccess: CollectionConfig = {
  // ...
  access: {
    // highlight-start
    read: ({ req: { user } }) => {
      return Boolean(user)
    },
    // highlight-end
  },
}
```

<Banner type="success">
  **Tip:** Return a [Query](../queries/overview) to limit the Documents to only
  those that match the constraint. This can be helpful to restrict users' access
  to specific Documents. [More details](../queries/overview).
</Banner>

As your application becomes more complex, you may want to define your function in a separate file and import them into your Collection Config:

```ts
import type { Access } from 'payload'
import type { Page } from '@/payload-types'

export const canReadPage: Access<Page> = ({ req: { user } }) => {
  // Allow authenticated users
  if (user) {
    return true
  }

  // By returning a Query, guest users can read public Documents
  // Note: this assumes you have a `isPublic` checkbox field on your Collection
  return {
    isPublic: {
      equals: true,
    },
  }
}
```

The following arguments are provided to the `read` function:

| Option    | Description                                                                                                                   |
| --------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **`req`** | The [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object containing the currently authenticated `user`. |
| **`id`**  | `id` of document requested, if within `findByID`.                                                                             |

### Update

Returns a boolean which allows/denies access to the `update` request.

To add update Access Control to a Collection, use the `update` property in the [Collection Config](../configuration/collections):

```ts
import type { CollectionConfig } from 'payload'

export const CollectionWithUpdateAccess: CollectionConfig = {
  // ...
  access: {
    // highlight-start
    update: ({ req: { user } }) => {
      return Boolean(user)
    },
    // highlight-end
  },
}
```

<Banner type="success">
  **Tip:** Return a [Query](../queries/overview) to limit the Documents to only
  those that match the constraint. This can be helpful to restrict users' access
  to specific Documents. [More details](../queries/overview).
</Banner>

As your application becomes more complex, you may want to define your function in a separate file and import them into your Collection Config:

```ts
import type { Access } from 'payload'
import type { User } from '@/payload-types'

export const canUpdateUser: Access<User> = ({ req: { user }, id }) => {
  // Allow users with a role of 'admin'
  if (user.roles && user.roles.some((role) => role === 'admin')) {
    return true
  }

  // allow any other users to update only oneself
  return user.id === id
}
```

The following arguments are provided to the `update` function:

| Option     | Description                                                                                                                   |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **`req`**  | The [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object containing the currently authenticated `user`. |
| **`id`**   | `id` of document requested to update.                                                                                         |
| **`data`** | The data passed to update the document with.                                                                                  |

### Delete

Similarly to the Update function, returns a boolean or a [query constraint](/docs/queries/overview) to limit which documents can be deleted by which users.

To add delete Access Control to a Collection, use the `delete` property in the [Collection Config](../configuration/collections):

```ts
import type { CollectionConfig } from 'payload'

export const CollectionWithDeleteAccess: CollectionConfig = {
  // ...
  access: {
    // highlight-start
    delete: ({ req: { user } }) => {
      return Boolean(user)
    },
    // highlight-end
  },
}
```

As your application becomes more complex, you may want to define your function in a separate file and import them into your Collection Config:

```ts
import type { Access } from 'payload'
import type { Customer } from '@/payload-types'

export const canDeleteCustomer: Access<Customer> = async ({ req, id }) => {
  if (!id) {
    // allow the admin UI to show controls to delete since it is indeterminate without the `id`
    return true
  }

  // Query another Collection using the `id`
  const result = await req.payload.find({
    collection: 'contracts',
    limit: 0,
    depth: 0,
    where: {
      customer: { equals: id },
    },
  })

  return result.totalDocs === 0
}
```

The following arguments are provided to the `delete` function:

| Option    | Description                                                                                                                                            |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`req`** | The [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object with additional `user` property, which is the currently logged in user. |
| **`id`**  | `id` of document requested to delete.                                                                                                                  |

### Admin

If the Collection is used to access the [Admin Panel](../admin/overview#the-admin-user-collection), the `Admin` Access Control function determines whether or not the currently logged in user can access the admin UI.

To add Admin Access Control to a Collection, use the `admin` property in the [Collection Config](../configuration/collections):

```ts
import type { CollectionConfig } from 'payload'

export const CollectionWithAdminAccess: CollectionConfig = {
  // ...
  access: {
    // highlight-start
    admin: ({ req: { user } }) => {
      return Boolean(user)
    },
    // highlight-end
  },
}
```

The following arguments are provided to the `admin` function:

| Option    | Description                                                                                                                   |
| --------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **`req`** | The [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object containing the currently authenticated `user`. |

### Unlock

Determines which users can [unlock](/docs/authentication/operations#unlock) other users who may be blocked from authenticating successfully due to [failing too many login attempts](/docs/authentication/overview#config-options).

To add Unlock Access Control to a Collection, use the `unlock` property in the [Collection Config](../configuration/collections):

```ts
import type { CollectionConfig } from 'payload'

export const CollectionWithUnlockAccess: CollectionConfig = {
  // ...
  access: {
    // highlight-start
    unlock: ({ req: { user } }) => {
      return Boolean(user)
    },
    // highlight-end
  },
}
```

The following arguments are provided to the `unlock` function:

| Option    | Description                                                                                                                   |
| --------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **`req`** | The [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object containing the currently authenticated `user`. |

### Read Versions

If the Collection has [Versions](../versions/overview) enabled, the `readVersions` Access Control function determines whether or not the currently logged in user can access the version history of a Document.

To add Read Versions Access Control to a Collection, use the `readVersions` property in the [Collection Config](../configuration/collections):

```ts
import type { CollectionConfig } from 'payload'

export const CollectionWithVersionsAccess: CollectionConfig = {
  // ...
  access: {
    // highlight-start
    readVersions: ({ req: { user } }) => {
      return Boolean(user)
    },
    // highlight-end
  },
}
```

<Banner type="warning">
  **Note:** Returning a [Query](../queries/overview) will apply the constraint
  to the [`versions` collection](../versions/overview#database-impact), not the
  original Collection.
</Banner>

The following arguments are provided to the `readVersions` function:

| Option    | Description                                                                                                                   |
| --------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **`req`** | The [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object containing the currently authenticated `user`. |
```

--------------------------------------------------------------------------------

---[FILE: fields.mdx]---
Location: payload-main/docs/access-control/fields.mdx

```text
---
title: Field-level Access Control
label: Fields
order: 40
desc: Field-level Access Control is specified within a field's config, and allows you to define which users can create, read or update Fields.
keywords: fields, access control, permissions, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

Field Access Control is [Access Control](../access-control/overview) used to restrict access to specific [Fields](../fields/overview) within a Document.

To add Access Control to a Field, use the `access` property in your [Field Config](../fields/overview):

```ts
import type { Field } from 'payload'

export const FieldWithAccessControl: Field = {
  // ...
  access: {
    // highlight-line
    // ...
  },
}
```

<Banner type="warning">
  **Note:** Field Access Control does not support returning
  [Query](../queries/overview) constraints like [Collection Access
  Control](./collections) does.
</Banner>

## Config Options

Access Control is specific to the operation of the request.

To add Access Control to a Field, use the `access` property in the [Field Config](../fields/overview):

```ts
import type { CollectionConfig } from 'payload';

export const Posts: CollectionConfig = {
  slug: 'posts',
  fields: [
    {
      name: 'title',
      type: 'text',
      // highlight-start
      access: {
        create: ({ req: { user } }) => { ... },
        read: ({ req: { user } }) => { ... },
        update: ({ req: { user } }) => { ... },
      },
      // highlight-end
    };
  ],
};
```

The following options are available:

| Function     | Purpose                                                                                                    |
| ------------ | ---------------------------------------------------------------------------------------------------------- |
| **`create`** | Allows or denies the ability to set a field's value when creating a new document. [More details](#create). |
| **`read`**   | Allows or denies the ability to read a field's value. [More details](#read).                               |
| **`update`** | Allows or denies the ability to update a field's value [More details](#update).                            |

### Create

Returns a boolean which allows or denies the ability to set a field's value when creating a new document. If `false` is returned, any passed values will be discarded.

**Available argument properties:**

| Option            | Description                                                                                                                  |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **`req`**         | The [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object containing the currently authenticated `user` |
| **`data`**        | The full data passed to create the document.                                                                                 |
| **`siblingData`** | Immediately adjacent field data passed to create the document.                                                               |

### Read

Returns a boolean which allows or denies the ability to read a field's value. If `false`, the entire property is omitted from the resulting document.

**Available argument properties:**

| Option            | Description                                                                                                                  |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **`req`**         | The [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object containing the currently authenticated `user` |
| **`id`**          | `id` of the document being read                                                                                              |
| **`doc`**         | The full document data.                                                                                                      |
| **`siblingData`** | Immediately adjacent field data of the document being read.                                                                  |

### Update

Returns a boolean which allows or denies the ability to update a field's value. If `false` is returned, any passed values will be discarded.

If `false` is returned and you attempt to update the field's value, the operation will **not** throw an error however the field will be omitted from the update operation and the value will remain unchanged.

**Available argument properties:**

| Option            | Description                                                                                                                  |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **`req`**         | The [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object containing the currently authenticated `user` |
| **`id`**          | `id` of the document being updated                                                                                           |
| **`data`**        | The full data passed to update the document.                                                                                 |
| **`siblingData`** | Immediately adjacent field data passed to update the document with.                                                          |
| **`doc`**         | The full document data, before the update is applied.                                                                        |
```

--------------------------------------------------------------------------------

---[FILE: globals.mdx]---
Location: payload-main/docs/access-control/globals.mdx

```text
---
title: Globals Access Control
label: Globals
order: 30
desc: Global-level Access Control is specified within each Global's `access` property and allows you to define which users can read or update Globals.
keywords: globals, access control, permissions, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

Global Access Control is [Access Control](../access-control/overview) used to restrict access to [Global](../configuration/globals) Documents, as well as what they can and cannot see within the [Admin Panel](../admin/overview) as it relates to that Global.

To add Access Control to a Global, use the `access` property in your [Global Config](../configuration/globals):

```ts
import type { GlobalConfig } from 'payload'

export const GlobalWithAccessControl: GlobalConfig = {
  // ...
  access: {
    // highlight-line
    // ...
  },
}
```

## Config Options

Access Control is specific to the operation of the request.

To add Access Control to a [Global](../configuration/globals), use the `access` property in the [Global Config](../configuration/globals):

```ts
import { GlobalConfig } from 'payload'

const GlobalWithAccessControl: GlobalConfig = {
  // ...
  // highlight-start
  access: {
    read: ({ req: { user } }) => {...},
    update: ({ req: { user } }) => {...},

    // Version-enabled Globals only
    readVersions: () => {...},
  },
  // highlight-end
}

export default Header
```

The following options are available:

| Function     | Allows/Denies Access                                            |
| ------------ | --------------------------------------------------------------- |
| **`read`**   | Used in the `findOne` Global operation. [More details](#read).  |
| **`update`** | Used in the `update` Global operation. [More details](#update). |

If a Global supports [Versions](../versions/overview), the following additional options are available:

| Function           | Allows/Denies Access                                                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`readVersions`** | Used to control who can read versions, and who can't. Will automatically restrict the Admin UI version viewing access. [More details](#read-versions). |

### Read

Returns a boolean result or optionally a [query constraint](../queries/overview) which limits who can read this global based on its current properties.

To add read Access Control to a [Global](../configuration/globals), use the `access` property in the [Global Config](../configuration/globals):

```ts
import { GlobalConfig } from 'payload'

const Header: GlobalConfig = {
  // ...
  // highlight-start
  access: {
    read: ({ req: { user } }) => {
      return Boolean(user)
    },
  },
  // highlight-end
}
```

The following arguments are provided to the `read` function:

| Option    | Description                                                                                                                   |
| --------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **`req`** | The [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object containing the currently authenticated `user`. |

### Update

Returns a boolean result or optionally a [query constraint](../queries/overview) which limits who can update this global based on its current properties.

To add update Access Control to a [Global](../configuration/globals), use the `access` property in the [Global Config](../configuration/globals):

```ts
import { GlobalConfig } from 'payload'

const Header: GlobalConfig = {
  // ...
  // highlight-start
  access: {
    update: ({ req: { user }, data }) => {
      return Boolean(user)
    },
  },
  // highlight-end
}
```

The following arguments are provided to the `update` function:

| Option     | Description                                                                                                                   |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **`req`**  | The [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object containing the currently authenticated `user`. |
| **`data`** | The data passed to update the global with.                                                                                    |

### Read Versions

If the Global has [Versions](../versions/overview) enabled, the `readVersions` Access Control function determines whether or not the currently logged in user can access the version history of a Document.

To add Read Versions Access Control to a Global, use the `readVersions` property in the [Global Config](../configuration/globals):

```ts
import type { GlobalConfig } from 'payload'

export const GlobalWithVersionsAccess: GlobalConfig = {
  // ...
  access: {
    // highlight-start
    readVersions: ({ req: { user } }) => {
      return Boolean(user)
    },
    // highlight-end
  },
}
```

<Banner type="warning">
  **Note:** Returning a [Query](../queries/overview) will apply the constraint
  to the [`versions` collection](../versions/overview#database-impact), not the
  original Global.
</Banner>

The following arguments are provided to the `readVersions` function:

| Option    | Description                                                                                                                   |
| --------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **`req`** | The [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object containing the currently authenticated `user`. |
```

--------------------------------------------------------------------------------

---[FILE: overview.mdx]---
Location: payload-main/docs/access-control/overview.mdx

```text
---
title: Access Control
label: Overview
order: 10
desc: Payload makes it simple to define and manage Access Control. By declaring roles, you can set permissions and restrict what your users can interact with.
keywords: overview, access control, permissions, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

<YouTube id="DoPLyXG26Dg" title="Overview of Payload Access Control" />

Access Control determines what a user can and cannot do with any given Document, as well as what they can and cannot see within the [Admin Panel](../admin/overview). By implementing Access Control, you can define granular restrictions based on the user, their roles (RBAC), Document data, or any other criteria your application requires.

Access Control functions are scoped to the _operation_, meaning you can have different rules for `create`, `read`, `update`, `delete`, etc. Access Control functions are executed _before_ any changes are made and _before_ any operations are completed. This allows you to determine if the user has the necessary permissions before fulfilling the request.

There are many use cases for Access Control, including:

- Allowing anyone `read` access to all posts
- Only allowing public access to posts where a `status` field is equal to `published`
- Giving only users with a `role` field equal to `admin` the ability to delete posts
- Allowing anyone to submit contact forms, but only logged in users to `read`, `update` or `delete` them
- Restricting a user to only be able to see their own orders, but no-one else's
- Allowing users that belong to a certain organization to access only that organization's resources

There are three main types of Access Control in Payload:

- [Collection Access Control](./collections)
- [Global Access Control](./globals)
- [Field Access Control](./fields)

## Default Access Control

Payload provides default Access Control so that your data is secured behind [Authentication](../authentication/overview) without additional configuration. To do this, Payload sets a default function that simply checks if a user is present on the request. You can override this default behavior by defining your own Access Control functions as needed.

Here is the default Access Control that Payload provides:

```ts
const defaultPayloadAccess = ({ req: { user } }) => {
  // Return `true` if a user is found
  // and `false` if it is undefined or null
  return Boolean(user) // highlight-line
}
```

<Banner type="warning">
  **Important:** In the [Local API](../local-api/overview), all Access Control
  is _skipped_ by default. This allows your server to have full control over
  your application. To opt back in, you can set the `overrideAccess` option to
  `false` in your requests.
</Banner>

## The Access Operation

The Admin Panel responds dynamically to your changes to Access Control. For example, if you restrict editing `ExampleCollection` to only users that feature an "admin" role, Payload will **hide** that Collection from the Admin Panel entirely. This is super powerful and allows you to control who can do what within your Admin Panel using the same functions that secure your APIs.

To accomplish this, Payload exposes the [Access Operation](../authentication/operations#access). Upon login, Payload executes each Access Control function at the top level, across all Collections, Globals, and Fields, and returns a response that contains a reflection of what the currently authenticated user can do within your application.

<Banner type="warning">
  **Important:** When your access control functions are executed via the [Access
  Operation](../authentication/operations#access), the `id`, `data`, `siblingData`, `blockData` and `doc` arguments
  will be `undefined`. Additionally, `Where` queries returned from access control functions will not be run - we'll assume the user does not have access instead.

This is because Payload is executing your functions without referencing a specific Document.

</Banner>

If you use `id`, `data`, `siblingData`, `blockData` and `doc` within your access control functions, make sure to check that they are defined first. If they are not, then you can assume that your Access Control is being executed via the Access Operation to determine solely what the user can do within the Admin Panel.

## Locale Specific Access Control

To implement locale-specific access control, you can use the `req.locale` argument in your access control functions. This argument allows you to evaluate the current locale of the request and determine access permissions accordingly.

Here is an example:

```ts
const access = ({ req }) => {
  // Grant access if the locale is 'en'
  if (req.locale === 'en') {
    return true
  }

  // Deny access for all other locales
  return false
}
```
```

--------------------------------------------------------------------------------

---[FILE: accessibility.mdx]---
Location: payload-main/docs/admin/accessibility.mdx

```text
---
title: Accessibility
label: Accessibility
order: 50
desc: Our commitment and approach to accessibility within the admin panel.
keywords: admin, accessibility, a11y, custom, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

Payload is committed to ensuring that our admin panel is accessible to all users, including those with disabilities. We follow best practices and guidelines to create an inclusive experience.

<Banner type="info">
  <p>
    We are actively working towards full compliance with WCAG 2.2 AA standards.
    If you encounter any accessibility issues, please report them in our{' '}
    <a
      href="https://github.com/payloadcms/payload/discussions/14489"
      target="_blank"
      rel="noopener noreferrer"
    >
      GitHub Discussion
    </a>{' '}
    page.
  </p>
</Banner>

## Compliance standards

| Standard                                     | Status      | Description                                                                                               |
| -------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------- |
| [WCAG 2.2 AA](https://www.w3.org/TR/WCAG22/) | In Progress | Web Content Accessibility Guidelines (WCAG) 2.2 AA is a widely recognized standard for web accessibility. |

You can view our [report](https://github.com/payloadcms/payload/discussions/14489) on the current state of the admin panel's accessibility compliance.

## Our approach

- Integrated Axe within our e2e test suites to ensure long term compliance.
- Custom utilities to test keyboard navigation, window overflow and focus indicators across our components.
- Manual testing with screen readers and other assistive technologies.
```

--------------------------------------------------------------------------------

---[FILE: customizing-css.mdx]---
Location: payload-main/docs/admin/customizing-css.mdx

```text
---
title: Customizing CSS & SCSS
label: Customizing CSS
order: 50
desc: Customize the Payload Admin Panel further by adding your own CSS or SCSS style sheet to the configuration, powerful theme and design options are waiting for you.
keywords: admin, css, scss, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

Customizing the Payload [Admin Panel](./overview) through CSS alone is one of the easiest and most powerful ways to customize the look and feel of the dashboard. To allow for this level of customization, Payload:

1. Exposes a [root-level stylesheet](#global-css) for you to inject custom selectors
1. Provides a [CSS library](#css-library) that can be easily overridden or extended
1. Uses [BEM naming conventions](http://getbem.com) so that class names are globally accessible

To customize the CSS within the Admin UI, determine scope and change you'd like to make, and then add your own CSS or SCSS to the configuration as needed.

## Global CSS

Global CSS refers to the CSS that is applied to the entire [Admin Panel](./overview). This is where you can have a significant impact to the look and feel of the Admin UI through just a few lines of code.

You can add your own global CSS through the root `custom.scss` file of your app. This file is loaded into the root of the Admin Panel and can be used to inject custom selectors or styles however needed.

Here is an example of how you might target the Dashboard View and change the background color:

```scss
.dashboard {
  background-color: red; // highlight-line
}
```

<Banner type="warning">
  **Note:** If you are building [Custom
  Components](../custom-components/overview), it is best to import your own
  stylesheets directly into your components, rather than using the global
  stylesheet. You can continue to use the [CSS library](#css-library) as needed.
</Banner>

### Specificity rules

All Payload CSS is encapsulated inside CSS layers under `@layer payload-default`. Any custom css will now have the highest possible specificity.

We have also provided a layer `@layer payload` if you want to use layers and ensure that your styles are applied after payload.

To override existing styles in a way that the previous rules of specificity would be respected you can use the default layer like so

```css
@layer payload-default {
  // my styles within the Payload specificity
}
```

## Re-using Payload SCSS variables and utilities

You can re-use Payload's SCSS variables and utilities in your own stylesheets by importing it from the UI package.

```scss
@import '~@payloadcms/ui/scss';
```

## CSS Library

To make it as easy as possible for you to override default styles, Payload uses [BEM naming conventions](http://getbem.com/) for all CSS within the Admin UI. If you provide your own CSS, you can override any built-in styles easily, including targeting nested components and their various component states.

You can also override Payload's built-in [CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties). These variables are widely consumed by the Admin Panel, so modifying them has a significant impact on the look and feel of the Admin UI.

The following variables are defined and can be overridden:

- [Breakpoints](https://github.com/payloadcms/payload/blob/main/packages/ui/src/scss/queries.scss)
- [Colors](https://github.com/payloadcms/payload/blob/main/packages/ui/src/scss/colors.scss)
  - Base color shades (white to black by default)
  - Success / warning / error color shades
  - Theme-specific colors (background, input background, text color, etc.)
  - Elevation colors (used to determine how "bright" something should be when compared to the background)
- [Sizing](https://github.com/payloadcms/payload/blob/main/packages/ui/src/scss/app.scss)
  - Horizontal gutter
  - Transition speeds
  - Font sizes
  - Etc.

For an up-to-date, comprehensive list of all available variables, please refer to the [Source Code](https://github.com/payloadcms/payload/blob/main/packages/ui/src/scss).

<Banner type="warning">
  **Warning:** If you're overriding colors or theme elevations, make sure to
  consider how [your changes will affect dark mode](#dark-mode).
</Banner>

#### Dark Mode

Colors are designed to automatically adapt to theme of the [Admin Panel](./overview). By default, Payload automatically overrides all `--theme-elevation` colors and inverts all success / warning / error shades to suit dark mode. We also update some base theme variables like `--theme-bg`, `--theme-text`, etc.
```

--------------------------------------------------------------------------------

````
