---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 56
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 56 of 695)

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
Location: payload-main/docs/queries/overview.mdx

```text
---
title: Querying your Documents
label: Overview
order: 10
desc: Payload provides a querying language through all APIs, allowing you to filter or search through documents within a Collection.
keywords: query, documents, overview, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

In Payload, "querying" means filtering or searching through Documents within a [Collection](../configuration/collections). The querying language in Payload is designed to be simple and powerful, allowing you to filter Documents with extreme precision through an intuitive and standardized structure.

Payload provides three common APIs for querying your data:

- [Local API](/docs/local-api/overview) - Extremely fast, direct-to-database access
- [REST API](/docs/rest-api/overview) - Standard HTTP endpoints for querying and mutating data
- [GraphQL](/docs/graphql/overview) - A full GraphQL API with a GraphQL Playground

Each of these APIs share the same underlying querying language, and fully support all of the same features. This means that you can learn Payload's querying language once, and use it across any of the APIs that you might use.

To query your Documents, you can send any number of [Operators](#operators) through your request:

```ts
import type { Where } from 'payload'

const query: Where = {
  color: {
    equals: 'blue',
  },
}
```

_The exact query syntax will depend on the API you are using, but the concepts are the same across all APIs. [More details](#writing-queries)._

<Banner>
  **Tip:** You can also use queries within [Access
  Control](../access-control/overview) functions.
</Banner>

## Operators

The following operators are available for use in queries:

| Operator             | Description                                                                                                                                                                      |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `equals`             | The value must be exactly equal.                                                                                                                                                 |
| `not_equals`         | The query will return all documents where the value is not equal.                                                                                                                |
| `greater_than`       | For numeric or date-based fields.                                                                                                                                                |
| `greater_than_equal` | For numeric or date-based fields.                                                                                                                                                |
| `less_than`          | For numeric or date-based fields.                                                                                                                                                |
| `less_than_equal`    | For numeric or date-based fields.                                                                                                                                                |
| `like`               | Case-insensitive string must be present. If string of words, all words must be present, in any order.                                                                            |
| `contains`           | Must contain the value entered, case-insensitive.                                                                                                                                |
| `in`                 | The value must be found within the provided comma-delimited list of values.                                                                                                      |
| `not_in`             | The value must NOT be within the provided comma-delimited list of values.                                                                                                        |
| `all`                | The value must contain all values provided in the comma-delimited list. Note: currently this operator is supported only with the MongoDB adapter.                                |
| `exists`             | Only return documents where the value either exists (`true`) or does not exist (`false`).                                                                                        |
| `near`               | For distance related to a [Point Field](../fields/point) comma separated as `<longitude>, <latitude>, <maxDistance in meters (nullable)>, <minDistance in meters (nullable)>`.   |
| `within`             | For [Point Fields](../fields/point) to filter documents based on whether points are inside of the given area defined in GeoJSON. [Example](../fields/point#querying-within)      |
| `intersects`         | For [Point Fields](../fields/point) to filter documents based on whether points intersect with the given area defined in GeoJSON. [Example](../fields/point#querying-intersects) |

<Banner type="success">
  **Tip:** If you know your users will be querying on certain fields a lot, add
  `index: true` to the Field Config. This will speed up searches using that
  field immensely. [More details](../database/indexes).
</Banner>

### And / Or Logic

In addition to defining simple queries, you can join multiple queries together using AND / OR logic. These can be nested as deeply as you need to create complex queries.

To join queries, use the `and` or `or` keys in your query object:

```ts
import type { Where } from 'payload'

const query: Where = {
  or: [
    // highlight-line
    {
      color: {
        equals: 'mint',
      },
    },
    {
      and: [
        // highlight-line
        {
          color: {
            equals: 'white',
          },
        },
        {
          featured: {
            equals: false,
          },
        },
      ],
    },
  ],
}
```

Written in plain English, if the above query were passed to a `find` operation, it would translate to finding posts where either the `color` is `mint` OR the `color` is `white` AND `featured` is set to false.

### Nested properties

When working with nested properties, which can happen when using relational fields, it is possible to use the dot notation to access the nested property. For example, when working with a `Song` collection that has an `artists` field which is related to an `Artists` collection using the `name: 'artists'`. You can access a property within the collection `Artists` like so:

```js
import type { Where } from 'payload'

const query: Where = {
  'artists.featured': {
    // nested property name to filter on
    exists: true, // operator to use and boolean value that needs to be true
  },
}
```

## Writing Queries

Writing queries in Payload is simple and consistent across all APIs, with only minor differences in syntax between them.

### Local API

The [Local API](../local-api/overview) supports the `find` operation that accepts a raw query object:

```ts
import type { Payload } from 'payload'

const getPosts = async (payload: Payload) => {
  const posts = await payload.find({
    collection: 'posts',
    where: {
      color: {
        equals: 'mint',
      },
    },
  })

  return posts
}
```

### GraphQL API

All `find` queries in the [GraphQL API](../graphql/overview) support the `where` argument that accepts a raw query object:

```ts
query {
  Posts(where: { color: { equals: mint } }) {
    docs {
      color
    }
    totalDocs
  }
}
```

### REST API

With the [REST API](../rest-api/overview), you can use the full power of Payload queries, but they are written as query strings instead:

**`https://localhost:3000/api/posts?where[color][equals]=mint`**

To understand the syntax, you need to understand that complex URL search strings are parsed into a JSON object. This one isn't too bad, but more complex queries get unavoidably more difficult to write.

For this reason, we recommend to use the extremely helpful and ubiquitous [`qs-esm`](https://www.npmjs.com/package/qs-esm) package to parse your JSON / object-formatted queries into query strings:

```ts
import { stringify } from 'qs-esm'
import type { Where } from 'payload'

const query: Where = {
  color: {
    equals: 'mint',
  },
  // This query could be much more complex
  // and qs-esm would handle it beautifully
}

const getPosts = async () => {
  const stringifiedQuery = stringify(
    {
      where: query, // ensure that `qs-esm` adds the `where` property, too!
    },
    { addQueryPrefix: true },
  )

  const response = await fetch(
    `http://localhost:3000/api/posts${stringifiedQuery}`,
  )
  // Continue to handle the response below...
}
```

## Performance

There are several ways to optimize your queries. Many of these options directly impact overall database overhead, response sizes, and/or computational load and can significantly improve performance.

When building queries, combine as many of these strategies together as possible to ensure your queries are as performant as they can be.

<Banner type="success">
  For more performance tips, see the [Performance
  documentation](../performance/overview).
</Banner>

### Indexes

Build [Indexes](../database/indexes) for fields that are often queried or sorted by.

When your query runs, the database will not search the entire document to find that one field, but will instead use the index to quickly locate the data.

This is done by adding `index: true` to the Field Config for that field:

```ts
// In your collection configuration
{
  name: 'posts',
  fields: [
    {
      name: 'title',
      type: 'text',
      // highlight-start
      index: true, // Add an index to the title field
      // highlight-end
    },
    // Other fields...
  ],
}
```

To learn more, see the [Indexes documentation](../database/indexes).

### Depth

Set the [Depth](./depth) to only the level that you need to avoid populating unnecessary related documents.

Relationships will only populate down to the specified depth, and any relationships beyond that depth will only return the ID of the related document.

```ts
const posts = await payload.find({
  collection: 'posts',
  where: { ... },
  // highlight-start
  depth: 0, // Only return the IDs of related documents
  // highlight-end
})
```

To learn more, see the [Depth documentation](./depth).

### Limit

Set the [Limit](./pagination#limit) if you can reliably predict the number of matched documents, such as when querying on a unique field.

```ts
const posts = await payload.find({
  collection: 'posts',
  where: {
    slug: {
      equals: 'unique-post-slug',
    },
  },
  // highlight-start
  limit: 1, // Only expect one document to be returned
  // highlight-end
})
```

<Banner type="success">
  **Tip:** Use in combination with `pagination: false` for best performance when
  querying by unique fields.
</Banner>

To learn more, see the [Limit documentation](./pagination#limit).

### Select

Use the [Select API](./select) to only process and return the fields you need.

This will reduce the amount of data returned from the request, and also skip processing of any fields that are not selected, such as running their field hooks.

```ts
const posts = await payload.find({
  collection: 'posts',
  where: { ... },
  // highlight-start
  select: [{
    title: true,
  }],
  // highlight-end
```

This is a basic example, but there are many ways to use the Select API, including selecting specific fields, excluding fields, etc.

To learn more, see the [Select documentation](./select).

### Pagination

[Disable Pagination](./pagination#disabling-pagination) if you can reliably predict the number of matched documents, such as when querying on a unique field.

```ts
const posts = await payload.find({
  collection: 'posts',
  where: {
    slug: {
      equals: 'unique-post-slug',
    },
  },
  // highlight-start
  pagination: false, // Return all matched documents without pagination
  // highlight-end
})
```

<Banner type="success">
  **Tip:** Use in combination with `limit: 1` for best performance when querying
  by unique fields.
</Banner>

To learn more, see the [Pagination documentation](./pagination).
```

--------------------------------------------------------------------------------

---[FILE: pagination.mdx]---
Location: payload-main/docs/queries/pagination.mdx

```text
---
title: Pagination
label: Pagination
order: 40
desc: Payload queries are equipped with automatic pagination so you create paginated lists of documents within your app.
keywords: query, documents, pagination, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

With Pagination you can limit the number of documents returned per page, and get a specific page of results. This is useful for creating paginated lists of documents within your application.

All paginated responses include documents nested within a `docs` array, and return top-level meta data related to pagination such as `totalDocs`, `limit`, `totalPages`, `page`, and more.

<Banner type="success">
  **Note:** Collection `find` queries are paginated automatically.
</Banner>

## Options

All Payload APIs support the pagination controls below. With them, you can create paginated lists of documents within your application:

| Control      | Default | Description                                                               |
| ------------ | ------- | ------------------------------------------------------------------------- |
| `limit`      | `10`    | Limits the number of documents returned per page. [More details](#limit). |
| `pagination` | `true`  | Set to `false` to disable pagination and return all documents.            |
| `page`       | `1`     | Get a specific page number.                                               |

## Local API

To specify pagination controls in the [Local API](../local-api/overview), you can use the `limit`, `page`, and `pagination` options in your query:

```ts
import type { Payload } from 'payload'

const getPosts = async (payload: Payload) => {
  const posts = await payload.find({
    collection: 'posts',
    // highlight-start
    limit: 10,
    page: 2,
    // highlight-end
  })

  return posts
}
```

## REST API

With the [REST API](../rest-api/overview), you can use the pagination controls below as query strings:

```ts
// highlight-start
fetch('https://localhost:3000/api/posts?limit=10&page=2')
  // highlight-end
  .then((res) => res.json())
  .then((data) => console.log(data))
```

## Response

All paginated responses include documents nested within a `docs` array, and return top-level meta data related to pagination.

The `find` operation includes the following properties in its response:

| Property        | Description                                               |
| --------------- | --------------------------------------------------------- |
| `docs`          | Array of documents in the collection                      |
| `totalDocs`     | Total available documents within the collection           |
| `limit`         | Limit query parameter - defaults to `10`                  |
| `totalPages`    | Total pages available, based upon the `limit` queried for |
| `page`          | Current page number                                       |
| `pagingCounter` | `number` of the first doc on the current page             |
| `hasPrevPage`   | `true/false` if previous page exists                      |
| `hasNextPage`   | `true/false` if next page exists                          |
| `prevPage`      | `number` of previous page, `null` if it doesn't exist     |
| `nextPage`      | `number` of next page, `null` if it doesn't exist         |

**Example response:**

```json
{
  // Document Array // highlight-line
  "docs": [
    {
      "title": "Page Title",
      "description": "Some description text",
      "priority": 1,
      "createdAt": "2020-10-17T01:19:29.858Z",
      "updatedAt": "2020-10-17T01:19:29.858Z",
      "id": "5f8a46a1dd05db75c3c64760"
    }
  ],
  // Metadata // highlight-line
  "totalDocs": 6,
  "limit": 1,
  "totalPages": 6,
  "page": 1,
  "pagingCounter": 1,
  "hasPrevPage": false,
  "hasNextPage": true,
  "prevPage": null,
  "nextPage": 2
}
```

## Limit

You can specify a `limit` to restrict the number of documents returned per page.

<Banner type="warning">
  **Reminder:** By default, any query with `limit: 0` will automatically
  [disable pagination](#disabling-pagination).
</Banner>

#### Performance benefits

If you are querying for a specific document and can reliably expect only one document to match, you can set a limit of `1` (or another low number) to reduce the number of database lookups and improve performance.

For example, when querying a document by a unique field such as `slug`, you can set the limit to `1` since you know there will only be one document with that slug.

To do this, set the `limit` option in your query:

```ts
await payload.find({
  collection: 'posts',
  where: {
    slug: {
      equals: 'post-1',
    },
  },
  // highlight-start
  limit: 1,
  // highlight-end
})
```

## Disabling pagination

Disabling pagination can improve performance by reducing the overhead of pagination calculations and improve query speed.

For `find` operations within the Local API, you can disable pagination to retrieve all documents from a collection by passing `pagination: false` to the `find` local operation.

To do this, set `pagination: false` in your query:

```ts
import type { Payload } from 'payload'

const getPost = async (payload: Payload) => {
  const posts = await payload.find({
    collection: 'posts',
    where: {
      title: { equals: 'My Post' },
    },
    // highlight-start
    pagination: false,
    // highlight-end
  })

  return posts
}
```
```

--------------------------------------------------------------------------------

---[FILE: select.mdx]---
Location: payload-main/docs/queries/select.mdx

```text
---
title: Select
label: Select
order: 30
desc: Payload select determines which fields are selected to the result.
keywords: query, documents, pagination, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

By default, Payload's APIs will return _all fields_ for a given collection or global. But, you may not need all of that data for all of your queries. Sometimes, you might want just a few fields from the response.

With the Select API, you can define exactly which fields you'd like to retrieve. This can impact the performance of your queries by affecting the load on the database and the size of the response.

## Local API

To specify `select` in the [Local API](../local-api/overview), you can use the `select` option in your query:

```ts
import type { Payload } from 'payload'

// Include mode
const getPosts = async (payload: Payload) => {
  const posts = await payload.find({
    collection: 'posts',
    // highlight-start
    select: {
      text: true,
      // select a specific field from group
      group: {
        number: true,
      },
      // select all fields from array
      array: true,
    },
    // highlight-end
  })

  return posts
}

// Exclude mode
const getPosts = async (payload: Payload) => {
  const posts = await payload.find({
    collection: 'posts',
    // Select everything except for array and group.number
    // highlight-start
    select: {
      array: false,
      group: {
        number: false,
      },
    },
    // highlight-end
  })

  return posts
}
```

<Banner type="warning">
  **Important:** To perform querying with `select` efficiently, Payload
  implements your `select` query on the database level. Because of that, your
  `beforeRead` and `afterRead` hooks may not receive the full `doc`. To ensure
  that some fields are always selected for your hooks / access control,
  regardless of the `select` query you can use `forceSelect` collection config
  property.
</Banner>

## REST API

To specify select in the [REST API](../rest-api/overview), you can use the `select` parameter in your query:

```ts
fetch(
  // highlight-start
  'https://localhost:3000/api/posts?select[color]=true&select[group][number]=true',
  // highlight-end
)
  .then((res) => res.json())
  .then((data) => console.log(data))
```

To understand the syntax, you need to understand that complex URL search strings are parsed into a JSON object. This one isn't too bad, but more complex queries get unavoidably more difficult to write.

For this reason, we recommend to use the extremely helpful and ubiquitous [`qs-esm`](https://www.npmjs.com/package/qs-esm) package to parse your JSON / object-formatted queries into query strings:

```ts
import { stringify } from 'qs-esm'
import type { Where } from 'payload'

const select: Where = {
  text: true,
  group: {
    number: true,
  },
  // This query could be much more complex
  // and QS would handle it beautifully
}

const getPosts = async () => {
  const stringifiedQuery = stringify(
    {
      select, // ensure that `qs` adds the `select` property, too!
    },
    { addQueryPrefix: true },
  )

  const response = await fetch(
    `http://localhost:3000/api/posts${stringifiedQuery}`,
  )
  // Continue to handle the response below...
}
```

<Banner type="info">
  **Reminder:** This is the same for [Globals](../configuration/globals) using
  the `/api/globals` endpoint.
</Banner>

## defaultPopulate collection config property

The `defaultPopulate` property allows you specify which fields to select when populating the collection from another document.
This is especially useful for links where only the `slug` is needed instead of the entire document.

With this feature, you can dramatically reduce the amount of JSON that is populated from [Relationship](/docs/fields/relationship) or [Upload](/docs/fields/upload) fields.

For example, in your content model, you might have a `Link` field which links out to a different page. When you go to retrieve these links, you really only need the `slug` of the page.

Loading all of the page content, its related links, and everything else is going to be overkill and will bog down your Payload APIs. Instead, you can define the `defaultPopulate` property on your `Pages` collection, so that when Payload "populates" a related Page, it only selects the `slug` field and therefore returns significantly less JSON:

```ts
import type { CollectionConfig } from 'payload'

// The TSlug generic can be passed to have type safety for `defaultPopulate`.
// If avoided, the `defaultPopulate` type resolves to `SelectType`.
export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  // Specify `select`.
  defaultPopulate: {
    slug: true,
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
    },
  ],
}
```

<VideoDrawer
  id="Snqjng_w-QU"
  label="Watch default populate in action"
  drawerTitle="How to easily optimize Payload CMS requests with defaultPopulate"
/>

<Banner type="warning">
  **Important:** When using `defaultPopulate` on a collection with
  [Uploads](/docs/fields/upload) enabled and you want to select the `url` field,
  it is important to specify `filename: true` as well, otherwise Payload will
  not be able to construct the correct file URL, instead returning `url: null`.
</Banner>

## Populate

Setting `defaultPopulate` will enforce that each time Payload performs a "population" of a related document, only the fields specified will be queried and returned. However, you can override `defaultPopulate` with the `populate` property in the Local and REST API:

**Local API:**

```ts
import type { Payload } from 'payload'

const getPosts = async (payload: Payload) => {
  const posts = await payload.find({
    collection: 'posts',
    populate: {
      // Select only `text` from populated docs in the "pages" collection
      // Now, no matter what the `defaultPopulate` is set to on the "pages" collection,
      // it will be overridden, and the `text` field will be returned instead.
      pages: {
        text: true,
      }, // highlight-line
    },
  })

  return posts
}
```

**REST API:**

```ts
fetch('https://localhost:3000/api/posts?populate[pages][text]=true') // highlight-line
  .then((res) => res.json())
  .then((data) => console.log(data))
```
```

--------------------------------------------------------------------------------

---[FILE: sort.mdx]---
Location: payload-main/docs/queries/sort.mdx

```text
---
title: Sort
label: Sort
order: 20
desc: Payload sort allows you to order your documents by a field in ascending or descending order.
keywords: query, documents, pagination, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

Documents in Payload can be easily sorted by a specific [Field](../fields/overview). When querying Documents, you can pass the name of any top-level field, and the response will sort the Documents by that field in _ascending_ order.

If prefixed with a minus symbol ("-"), they will be sorted in _descending_ order. In Local API multiple fields can be specified by using an array of strings. In REST API multiple fields can be specified by separating fields with comma. The minus symbol can be in front of individual fields.

Because sorting is handled by the database, the field cannot be a [Virtual Field](https://payloadcms.com/blog/learn-how-virtual-fields-can-help-solve-common-cms-challenges) unless it's [linked with a relationship field](/docs/fields/relationship#linking-virtual-fields-with-relationships). It must be stored in the database to be searchable.

<Banner type="success">
  **Tip:** For performance reasons, it is recommended to enable `index: true`
  for the fields that will be sorted upon. [More details](../database/indexes).
</Banner>

## Local API

To sort Documents in the [Local API](../local-api/overview), you can use the `sort` option in your query:

```ts
import type { Payload } from 'payload'

const getPosts = async (payload: Payload) => {
  const posts = await payload.find({
    collection: 'posts',
    sort: '-createdAt', // highlight-line
  })

  return posts
}
```

To sort by multiple fields, you can use the `sort` option with fields in an array:

```ts
import type { Payload } from 'payload'

const getPosts = async (payload: Payload) => {
  const posts = await payload.find({
    collection: 'posts',
    sort: ['priority', '-createdAt'], // highlight-line
  })

  return posts
}
```

## REST API

To sort in the [REST API](../rest-api/overview), you can use the `sort` parameter in your query:

```ts
fetch('https://localhost:3000/api/posts?sort=-createdAt') // highlight-line
  .then((response) => response.json())
  .then((data) => console.log(data))
```

To sort by multiple fields, you can use the `sort` parameter with fields separated by comma:

```ts
fetch('https://localhost:3000/api/posts?sort=priority,-createdAt') // highlight-line
  .then((response) => response.json())
  .then((data) => console.log(data))
```

## GraphQL API

To sort in the [GraphQL API](../graphql/overview), you can use the `sort` parameter in your query:

```ts
query {
  Posts(sort: "-createdAt") {
    docs {
      color
    }
  }
}
```
```

--------------------------------------------------------------------------------

---[FILE: overview.mdx]---
Location: payload-main/docs/query-presets/overview.mdx

```text
---
title: Query Presets
label: Overview
order: 10
desc: Query Presets allow you to save and share filters, columns, and sort orders for your collections.
keywords:
---

Query Presets allow you to save and share filters, columns, and sort orders for your [Collections](../configuration/collections). This is useful for reusing common or complex filtering patterns and/or sharing them across your team.

Each Query Preset is saved as a new record in the database under the `payload-query-presets` collection. This allows for an endless number of preset configurations, where the users of your app define the presets that are most useful to them, rather than being hard coded into the Payload Config.

Within the [Admin Panel](../admin/overview), Query Presets are applied to the List View. When enabled, new controls are displayed for users to manage presets. Once saved, these presets can be loaded up at any time and optionally shared with others.

To enable Query Presets on a Collection, use the `enableQueryPresets` property in your [Collection Config](../configuration/collections):

```ts
import type { CollectionConfig } from 'payload'

export const MyCollection: CollectionConfig = {
  // ...
  // highlight-start
  enableQueryPresets: true,
  // highlight-end
}
```

## Config Options

While not required, you may want to customize the behavior of Query Presets to suit your needs, such as add custom labels or access control rules.

Settings for Query Presets are managed on the `queryPresets` property at the root of your [Payload Config](../configuration/overview):

```ts
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  // highlight-start
  queryPresets: {
    // ...
  },
  // highlight-end
})
```

The following options are available for Query Presets:

| Option              | Description                                                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `access`            | Used to define custom collection-level access control that applies to all presets. [More details](#access-control).             |
| `filterConstraints` | Used to define which constraints are available to users when managing presets. [More details](#constraint-access-control).      |
| `constraints`       | Used to define custom document-level access control that apply to individual presets. [More details](#document-access-control). |
| `labels`            | Custom labels to use for the Query Presets collection.                                                                          |

## Access Control

Query Presets are subject to the same [Access Control](../access-control/overview) as the rest of Payload. This means you can use the same patterns you are already familiar with to control who can read, update, and delete presets.

Access Control for Query Presets can be customized in two ways:

1. [Collection Access Control](#collection-access-control): Applies to all presets. These rules are not controllable by the user and are statically defined in the config.
2. [Document Access Control](#document-access-control): Applies to each individual preset. These rules are controllable by the user and are dynamically defined on each record in the database.

### Collection Access Control

Collection-level access control applies to _all_ presets within the Query Presets collection. Users cannot control these rules, they are written statically in your config.

To add Collection Access Control, use the `queryPresets.access` property in your [Payload Config](../configuration/overview):

```ts
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  queryPresets: {
    // ...
    // highlight-start
    access: {
      read: ({ req: { user } }) =>
        user ? user?.roles?.some((role) => role === 'admin') : false,
      update: ({ req: { user } }) =>
        user ? user?.roles?.some((role) => role === 'admin') : false,
    },
    // highlight-end
  },
})
```

This example restricts all Query Presets to users with the role of `admin`.

<Banner type="warning">
  **Note:** Custom access control will override the defaults on this collection,
  including the requirement for a user to be authenticated. Be sure to include
  any necessary checks in your custom rules unless you intend on making these
  publicly accessible.
</Banner>

### Document Access Control

You can also define access control rules that apply to each specific preset. Users have the ability to define and modify these rules on the fly as they manage presets. These are saved dynamically in the database on each record.

When a user manages a preset, document-level access control options will be available to them in the Admin Panel for each operation.

By default, Payload provides a set of sensible defaults for all Query Presets, but you can customize these rules to suit your needs:

- **Only Me**: Only the user who created the preset can read, update, and delete it.
- **Everyone**: All users can read, update, and delete the preset.
- **Specific Users**: Only select users can read, update, and delete the preset.

#### Custom Access Control

You can augment the default access control rules with your own custom rules. This can be useful for creating more complex access control patterns that the defaults don't provide, such as for RBAC.

Adding custom access control rules requires:

1. A label to display in the dropdown
2. A set of fields to conditionally render when that option is selected
3. A function that returns the access control rules for that option

To do this, use the `queryPresets.constraints` property in your [Payload Config](../configuration/overview).

```ts
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  queryPresets: {
    // ...
    // highlight-start
    constraints: {
      read: [
        {
          label: 'Specific Roles',
          value: 'specificRoles',
          fields: [
            {
              name: 'roles',
              type: 'select',
              hasMany: true,
              options: [
                { label: 'Admin', value: 'admin' },
                { label: 'User', value: 'user' },
              ],
            },
          ],
          access: ({ req: { user } }) => ({
            'access.read.roles': {
              in: [user?.roles],
            },
          }),
        },
      ],
    },
    // highlight-end
  },
})
```

In this example, we've added a new option called `Specific Roles` that allows users to select from a list of roles. When this option is selected, the user will be prompted to select one or more roles from a list of options. The access control rule for this option is that the user operating on the preset must have one of the selected roles.

<Banner type="warning">
  **Note:** Payload places your custom fields into the `access[operation]` field
  group, so your rules will need to reflect this.
</Banner>

The following options are available for each constraint:

| Option   | Description                                                              |
| -------- | ------------------------------------------------------------------------ |
| `label`  | The label to display in the dropdown for this constraint.                |
| `value`  | The value to store in the database when this constraint is selected.     |
| `fields` | An array of fields to render when this constraint is selected.           |
| `access` | A function that determines the access control rules for this constraint. |

### Constraint Access Control

Used to dynamically filter which constraints are available based on the current user, document data, or other criteria.

Some examples of this might include:

- Ensuring that only "admins" are allowed to make a preset available to "everyone"
- Preventing the "onlyMe" option from being selected based on a hypothetical "disablePrivatePresets" checkbox

When a user lacks the permission to set a constraint, the option will either be hidden from them, or disabled if it is already saved to that preset.

To do this, you can use the `filterConstraints` property in your [Payload Config](../configuration/overview):

```ts
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  queryPresets: {
    // ...
    // highlight-start
    filterConstraints: ({ req, options }) =>
      !req.user?.roles?.includes('admin')
        ? options.filter(
            (option) =>
              (typeof option === 'string' ? option : option.value) !==
              'everyone',
          )
        : options,
    // highlight-end
  },
})
```

The `filterConstraints` function receives the same arguments as [`filterOptions`](../fields/select#filteroptions) in the [Select field](../fields/select).
```

--------------------------------------------------------------------------------

````
