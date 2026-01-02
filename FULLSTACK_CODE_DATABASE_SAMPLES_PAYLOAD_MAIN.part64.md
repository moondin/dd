---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 64
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 64 of 695)

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

---[FILE: storage-adapters.mdx]---
Location: payload-main/docs/upload/storage-adapters.mdx

```text
---
title: Storage Adapters
label: Storage Adapters
order: 20
desc: Payload provides additional storage adapters to handle file uploads. These adapters allow you to store files in different locations, such as Amazon S3, Vercel Blob Storage, Google Cloud Storage, Uploadthing, and more.
keywords: uploads, images, media, storage, adapters, s3, vercel, google cloud, azure
---

Payload offers additional storage adapters to handle file uploads. These adapters allow you to store files in different locations, such as Amazon S3, Vercel Blob Storage, Google Cloud Storage, and more.

| Service              | Package                                                                                                           |
| -------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Vercel Blob          | [`@payloadcms/storage-vercel-blob`](https://github.com/payloadcms/payload/tree/main/packages/storage-vercel-blob) |
| AWS S3               | [`@payloadcms/storage-s3`](https://github.com/payloadcms/payload/tree/main/packages/storage-s3)                   |
| Azure                | [`@payloadcms/storage-azure`](https://github.com/payloadcms/payload/tree/main/packages/storage-azure)             |
| Google Cloud Storage | [`@payloadcms/storage-gcs`](https://github.com/payloadcms/payload/tree/main/packages/storage-gcs)                 |
| Uploadthing          | [`@payloadcms/storage-uploadthing`](https://github.com/payloadcms/payload/tree/main/packages/storage-uploadthing) |
| R2                   | [`@payloadcms/storage-r2`](https://github.com/payloadcms/payload/tree/main/packages/storage-r2)                   |

## Vercel Blob Storage

[`@payloadcms/storage-vercel-blob`](https://www.npmjs.com/package/@payloadcms/storage-vercel-blob)

### Installation#vercel-blob-installation

```sh
pnpm add @payloadcms/storage-vercel-blob
```

### Usage#vercel-blob-usage

- Configure the `collections` object to specify which collections should use the Vercel Blob adapter. The slug _must_ match one of your existing collection slugs.
- Ensure you have `BLOB_READ_WRITE_TOKEN` set in your Vercel environment variables. This is usually set by Vercel automatically after adding blob storage to your project.
- When enabled, this package will automatically set `disableLocalStorage` to `true` for each collection.
- When deploying to Vercel, server uploads are limited with 4.5MB. Set `clientUploads` to `true` to do uploads directly on the client.

```ts
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { Media } from './collections/Media'
import { MediaWithPrefix } from './collections/MediaWithPrefix'

export default buildConfig({
  collections: [Media, MediaWithPrefix],
  plugins: [
    vercelBlobStorage({
      enabled: true, // Optional, defaults to true
      // Specify which collections should use Vercel Blob
      collections: {
        media: true,
        'media-with-prefix': {
          prefix: 'my-prefix',
        },
      },
      // Token provided by Vercel once Blob storage is added to your Vercel project
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
})
```

### Configuration Options#vercel-blob-configuration

| Option               | Description                                                          | Default                       |
| -------------------- | -------------------------------------------------------------------- | ----------------------------- |
| `enabled`            | Whether or not to enable the plugin                                  | `true`                        |
| `collections`        | Collections to apply the Vercel Blob adapter to                      |                               |
| `addRandomSuffix`    | Add a random suffix to the uploaded file name in Vercel Blob storage | `false`                       |
| `cacheControlMaxAge` | Cache-Control max-age in seconds                                     | `365 * 24 * 60 * 60` (1 Year) |
| `token`              | Vercel Blob storage read/write token                                 | `''`                          |
| `clientUploads`      | Do uploads directly on the client to bypass limits on Vercel.        |                               |

## S3 Storage

[`@payloadcms/storage-s3`](https://www.npmjs.com/package/@payloadcms/storage-s3)

### Installation#s3-installation

```sh
pnpm add @payloadcms/storage-s3
```

### Usage#s3-usage

- Configure the `collections` object to specify which collections should use the S3 Storage adapter. The slug _must_ match one of your existing collection slugs.
- The `config` object can be any [`S3ClientConfig`](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3) object (from [`@aws-sdk/client-s3`](https://github.com/aws/aws-sdk-js-v3)). _This is highly dependent on your AWS setup_. Check the AWS documentation for more information.
- When enabled, this package will automatically set `disableLocalStorage` to `true` for each collection.
- When deploying to Vercel, server uploads are limited with 4.5MB. Set `clientUploads` to `true` to do uploads directly on the client. You must allow CORS PUT method for the bucket to your website.
- Configure `signedDownloads` (either globally of per-collection in `collections`) to use [presigned URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html) for files downloading. This can improve performance for large files (like videos) while still respecting your access control. Additionally, with `signedDownloads.shouldUseSignedURL` you can specify a condition whether Payload should use a presigned URL, if you want to use this feature only for specific files.

```ts
import { s3Storage } from '@payloadcms/storage-s3'
import { Media } from './collections/Media'
import { MediaWithPrefix } from './collections/MediaWithPrefix'

export default buildConfig({
  collections: [Media, MediaWithPrefix],
  plugins: [
    s3Storage({
      collections: {
        media: true,
        'media-with-prefix': {
          prefix,
        },
        'media-with-presigned-downloads': {
          // Filter only mp4 files
          signedDownloads: {
            shouldUseSignedURL: ({ collection, filename, req }) => {
              return filename.endsWith('.mp4')
            },
          },
        },
      },
      bucket: process.env.S3_BUCKET,
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        },
        region: process.env.S3_REGION,
        // ... Other S3 configuration
      },
    }),
  ],
})
```

### Configuration Options#s3-configuration

See the [AWS SDK Package](https://github.com/aws/aws-sdk-js-v3) and [`S3ClientConfig`](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3) object for guidance on AWS S3 configuration.

## Azure Blob Storage

[`@payloadcms/storage-azure`](https://www.npmjs.com/package/@payloadcms/storage-azure)

### Installation#azure-installation

```sh
pnpm add @payloadcms/storage-azure
```

### Usage#azure-usage

- Configure the `collections` object to specify which collections should use the Azure Blob adapter. The slug _must_ match one of your existing collection slugs.
- When enabled, this package will automatically set `disableLocalStorage` to `true` for each collection.
- When deploying to Vercel, server uploads are limited with 4.5MB. Set `clientUploads` to `true` to do uploads directly on the client. You must allow CORS PUT method to your website.

```ts
import { azureStorage } from '@payloadcms/storage-azure'
import { Media } from './collections/Media'
import { MediaWithPrefix } from './collections/MediaWithPrefix'

export default buildConfig({
  collections: [Media, MediaWithPrefix],
  plugins: [
    azureStorage({
      collections: {
        media: true,
        'media-with-prefix': {
          prefix,
        },
      },
      allowContainerCreate:
        process.env.AZURE_STORAGE_ALLOW_CONTAINER_CREATE === 'true',
      baseURL: process.env.AZURE_STORAGE_ACCOUNT_BASEURL,
      connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
      containerName: process.env.AZURE_STORAGE_CONTAINER_NAME,
    }),
  ],
})
```

### Configuration Options#azure-configuration

| Option                 | Description                                                              | Default |
| ---------------------- | ------------------------------------------------------------------------ | ------- |
| `enabled`              | Whether or not to enable the plugin                                      | `true`  |
| `collections`          | Collections to apply the Azure Blob adapter to                           |         |
| `allowContainerCreate` | Whether or not to allow the container to be created if it does not exist | `false` |
| `baseURL`              | Base URL for the Azure Blob storage account                              |         |
| `connectionString`     | Azure Blob storage connection string                                     |         |
| `containerName`        | Azure Blob storage container name                                        |         |
| `clientUploads`        | Do uploads directly on the client to bypass limits on Vercel.            |         |

## Google Cloud Storage

[`@payloadcms/storage-gcs`](https://www.npmjs.com/package/@payloadcms/storage-gcs)

### Installation#gcs-installation

```sh
pnpm add @payloadcms/storage-gcs
```

### Usage#gcs-usage

- Configure the `collections` object to specify which collections should use the Google Cloud Storage adapter. The slug _must_ match one of your existing collection slugs.
- When enabled, this package will automatically set `disableLocalStorage` to `true` for each collection.
- When deploying to Vercel, server uploads are limited with 4.5MB. Set `clientUploads` to `true` to do uploads directly on the client. You must allow CORS PUT method for the bucket to your website.

```ts
import { gcsStorage } from '@payloadcms/storage-gcs'
import { Media } from './collections/Media'
import { MediaWithPrefix } from './collections/MediaWithPrefix'

export default buildConfig({
  collections: [Media, MediaWithPrefix],
  plugins: [
    gcsStorage({
      collections: {
        media: true,
        'media-with-prefix': {
          prefix,
        },
      },
      bucket: process.env.GCS_BUCKET,
      options: {
        apiEndpoint: process.env.GCS_ENDPOINT,
        projectId: process.env.GCS_PROJECT_ID,
      },
    }),
  ],
})
```

### Configuration Options#gcs-configuration

| Option          | Description                                                                                         | Default   |
| --------------- | --------------------------------------------------------------------------------------------------- | --------- |
| `enabled`       | Whether or not to enable the plugin                                                                 | `true`    |
| `collections`   | Collections to apply the storage to                                                                 |           |
| `bucket`        | The name of the bucket to use                                                                       |           |
| `options`       | Google Cloud Storage client configuration. See [Docs](https://github.com/googleapis/nodejs-storage) |           |
| `acl`           | Access control list for files that are uploaded                                                     | `Private` |
| `clientUploads` | Do uploads directly on the client to bypass limits on Vercel.                                       |           |

## Uploadthing Storage

[`@payloadcms/storage-uploadthing`](https://www.npmjs.com/package/@payloadcms/storage-uploadthing)

### Installation#uploadthing-installation

```sh
pnpm add @payloadcms/storage-uploadthing
```

### Usage#uploadthing-usage

- Configure the `collections` object to specify which collections should use uploadthing. The slug _must_ match one of your existing collection slugs and be an `upload` type.
- Get a token from Uploadthing and set it as `token` in the `options` object.
- `acl` is optional and defaults to `public-read`.
- When deploying to Vercel, server uploads are limited with 4.5MB. Set `clientUploads` to `true` to do uploads directly on the client.

```ts
export default buildConfig({
  collections: [Media],
  plugins: [
    uploadthingStorage({
      collections: {
        media: true,
      },
      options: {
        token: process.env.UPLOADTHING_TOKEN,
        acl: 'public-read',
      },
    }),
  ],
})
```

### Configuration Options#uploadthing-configuration

| Option           | Description                                                   | Default       |
| ---------------- | ------------------------------------------------------------- | ------------- |
| `token`          | Token from Uploadthing. Required.                             |               |
| `acl`            | Access control list for files that are uploaded               | `public-read` |
| `logLevel`       | Log level for Uploadthing                                     | `info`        |
| `fetch`          | Custom fetch function                                         | `fetch`       |
| `defaultKeyType` | Default key type for file operations                          | `fileKey`     |
| `clientUploads`  | Do uploads directly on the client to bypass limits on Vercel. |               |

## R2 Storage

<Banner type="warning">
  **Note**: The R2 Storage Adapter is in **beta** as some aspects of it may
  change on any minor releases.
</Banner>

[`@payloadcms/storage-r2`](https://www.npmjs.com/package/@payloadcms/storage-r2)

Use this adapter to store uploads in a Cloudflare R2 bucket via the Cloudflare Workers environment. If you're trying to connect to R2 using the S3 API then you should use the [S3](#s3-storage) adapter instead.

### Installation#r2-installation

```sh
pnpm add @payloadcms/storage-r2
```

### Usage#r2-usage

- Configure the `collections` object to specify which collections should use r2. The slug _must_ match one of your existing collection slugs and be an `upload` type.
- Pass in the R2 bucket binding to the `bucket` option, this should be done in the environment where Payload is running (e.g. Cloudflare Worker).
- You can conditionally determine whether or not to enable the plugin with the `enabled` option.

```ts
export default buildConfig({
  collections: [Media],
  plugins: [
    r2Storage({
      collections: {
        media: true,
      },
      bucket: cloudflare.env.R2,
    }),
  ],
})
```

## Custom Storage Adapters

If you need to create a custom storage adapter, you can use the [`@payloadcms/plugin-cloud-storage`](https://www.npmjs.com/package/@payloadcms/plugin-cloud-storage) package. This package is used internally by the storage adapters mentioned above.

### Installation#custom-installation

`pnpm add @payloadcms/plugin-cloud-storage`

### Usage#custom-usage

Reference any of the existing storage adapters for guidance on how this should be structured. Create an adapter following the `GeneratedAdapter` interface. Then, pass the adapter to the `cloudStorage` plugin.

```ts
export interface GeneratedAdapter {
  /**
   * Additional fields to be injected into the base
   * collection and image sizes
   */
  fields?: Field[]
  /**
   * Generates the public URL for a file
   */
  generateURL?: GenerateURL
  handleDelete: HandleDelete
  handleUpload: HandleUpload
  name: string
  onInit?: () => void
  staticHandler: StaticHandler
}
```

```ts
import { buildConfig } from 'payload'
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'

export default buildConfig({
  plugins: [
    cloudStorage({
      collections: {
        'my-collection-slug': {
          adapter: theAdapterToUse, // see docs for the adapter you want to use
        },
      },
    }),
  ],
  // The rest of your config goes here
})
```

## Plugin options

This plugin is configurable to work across many different Payload collections. A `*` denotes that the property is required.

| Option           | Type                                | Description                                                                                                                       |
| ---------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `collections` \* | `Record<string, CollectionOptions>` | Object with keys set to the slug of collections you want to enable the plugin for, and values set to collection-specific options. |
| `enabled`        | `boolean`                           | To conditionally enable/disable plugin. Default: `true`.                                                                          |

## Collection-specific options

| Option                        | Type                                                                                                              | Description                                                                                                                                                                                                   |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `adapter` \*                  | [Adapter](https://github.com/payloadcms/payload/blob/main/packages/plugin-cloud-storage/src/types.ts#L49)         | Pass in the adapter that you'd like to use for this collection. You can also set this field to `null` for local development if you'd like to bypass cloud storage in certain scenarios and use local storage. |
| `disableLocalStorage`         | `boolean`                                                                                                         | Choose to disable local storage on this collection. Defaults to `true`.                                                                                                                                       |
| `disablePayloadAccessControl` | `true`                                                                                                            | Set to `true` to disable Payload's Access Control. [More](#payload-access-control)                                                                                                                            |
| `prefix`                      | `string`                                                                                                          | Set to `media/images` to upload files inside `media/images` folder in the bucket.                                                                                                                             |
| `generateFileURL`             | [GenerateFileURL](https://github.com/payloadcms/payload/blob/main/packages/plugin-cloud-storage/src/types.ts#L67) | Override the generated file URL with one that you create.                                                                                                                                                     |

## Payload Access Control

Payload ships with [Access Control](../access-control/overview) that runs _even on statically served files_. The same `read` Access Control property on your `upload`-enabled collections is used, and it allows you to restrict who can request your uploaded files.

To preserve this feature, by default, this plugin _keeps all file URLs exactly the same_. Your file URLs won't be updated to point directly to your cloud storage source, as in that case, Payload's Access control will be completely bypassed and you would need public readability on your cloud-hosted files.

Instead, all uploads will still be reached from the default `/collectionSlug/staticURL/filename` path. This plugin will "pass through" all files that are hosted on your third-party cloud service—with the added benefit of keeping your existing Access Control in place.

If this does not apply to you (your upload collection has `read: () => true` or similar) you can disable this functionality by setting `disablePayloadAccessControl` to `true`. When this setting is in place, this plugin will update your file URLs to point directly to your cloud host.

## Conditionally Enabling/Disabling

The proper way to conditionally enable/disable this plugin is to use the `enabled` property.

```ts
cloudStoragePlugin({
  enabled: process.env.MY_CONDITION === 'true',
  collections: {
    'my-collection-slug': {
      adapter: theAdapterToUse, // see docs for the adapter you want to use
    },
  },
}),
```
```

--------------------------------------------------------------------------------

---[FILE: autosave.mdx]---
Location: payload-main/docs/versions/autosave.mdx

```text
---
title: Autosave
label: Autosave
order: 30
desc: Using Payload's Draft functionality, you can configure your collections and globals to autosave changes as drafts, and publish only you're ready.
keywords: version history, revisions, audit log, draft, publish, autosave, Content Management System, cms, headless, javascript, node, react, nextjs
---

Extending on Payload's [Draft](/docs/versions/drafts) functionality, you can configure your collections and globals to autosave changes as drafts, and publish only you're ready. The Admin UI will automatically adapt to autosaving progress at an interval that you define, and will store all autosaved changes as a new Draft version. Never lose your work - and publish changes to the live document only when you're ready.

<Banner type="warning">
  Autosave relies on Versions and Drafts being enabled in order to function.
</Banner>

![Autosave Enabled](/images/docs/autosave-v3.jpg)
_If Autosave is enabled, drafts will be created automatically as the document is modified and the Admin UI adds an indicator describing when the document was last saved to the top right of the sidebar._

## Options

Collections and Globals both support the same options for configuring autosave. You can either set `versions.drafts.autosave` to `true`, or pass an object to configure autosave properties.

| Drafts Autosave Options | Description                                                                                                                                                           |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `interval`              | Define an `interval` in milliseconds to automatically save progress while documents are edited. Document updates are "debounced" at this interval. Defaults to `800`. |
| `showSaveDraftButton`   | Set this to `true` to show the "Save as draft" button even while autosave is enabled. Defaults to `false`.                                                            |

**Example config with versions, drafts, and autosave enabled:**

```ts
import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    read: ({ req }) => {
      // If there is a user logged in,
      // let them retrieve all documents
      if (req.user) return true

      // If there is no user,
      // restrict the documents that are returned
      // to only those where `_status` is equal to `published`
      return {
        _status: {
          equals: 'published',
        },
      }
    },
  },
  versions: {
    drafts: {
      autosave: true,

      // Alternatively, you can specify an object to customize autosave:
      // autosave: {
      // Define how often the document should be autosaved (in milliseconds)
      //   interval: 1500,
      //
      // Show the "Save as draft" button even while autosave is enabled
      //   showSaveDraftButton: true,
      // },
    },
  },
  //.. the rest of the Pages config here
}
```

## Autosave API

When `autosave` is enabled, all `update` operations within Payload expose a new argument called `autosave`. When set to `true`, Payload will treat the incoming draft update as an `autosave`. This is primarily used by the Admin UI, but there may be some cases where you are building an app for your users and wish to implement `autosave` in your own app. To do so, use the `autosave` argument in your `update` operations.

### How autosaves are stored

If we created a new version for each autosave, you'd quickly find a ton of autosaves that clutter up your `_versions` collection within the database. That would be messy quick because `autosave` is typically set to save a document at ~800ms intervals.

<Banner type="success">
  Instead of creating a new version each time a document is autosaved, Payload
  smartly only creates **one** autosave version, and then updates that specific
  version with each autosave performed. This makes sure that your versions
  remain nice and tidy.
</Banner>
```

--------------------------------------------------------------------------------

---[FILE: drafts.mdx]---
Location: payload-main/docs/versions/drafts.mdx

```text
---
title: Drafts
label: Drafts
order: 20
desc: Enable drafts on collection documents or globals and build true preview environments for your data.
keywords: version history, drafts, preview, draft, restore, publish, autosave, Content Management System, cms, headless, javascript, node, react, nextjs
---

Payload's Draft functionality builds on top of the Versions functionality to allow you to make changes to your collection documents and globals, but publish only when you're ready. This functionality allows you to build powerful Preview environments for your data, where you can make sure your changes look good before publishing documents.

<Banner type="warning">
  Drafts rely on Versions being enabled in order to function.
</Banner>

By enabling Versions with Drafts, your collections and globals can maintain _newer_, and _unpublished_ versions of your documents. It's perfect for cases where you might want to work on a document, update it and save your progress, but not necessarily make it publicly published right away. Drafts are extremely helpful when building preview implementations.

![Drafts Enabled](/images/docs/autosave-drafts.jpg)
_If Drafts are enabled, the typical Save button is replaced with new actions which allow you to either save a draft, or publish your changes._

## Options

Collections and Globals both support the same options for configuring drafts. You can either set `versions.drafts` to `true`, or pass an object to configure draft properties.

| Draft Option      | Description                                                                                                                                                      |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `autosave`        | Enable `autosave` to automatically save progress while documents are edited. To enable, set to `true` or pass an object with [options](/docs/versions/autosave). |
| `schedulePublish` | Allow for editors to schedule publish / unpublish events in the future. [More](#scheduled-publish)                                                               |
| `validate`        | Set `validate` to `true` to validate draft documents when saved. Default is `false`.                                                                             |

## Database changes

By enabling drafts on a collection or a global, Payload will **automatically inject a new field into your schema** called `_status`. The `_status` field is used internally by Payload to store if a document is set to `draft` or `published`.

**Admin UI status indication**

Within the Admin UI, if drafts are enabled, a document can be shown with one of three "statuses":

1. **Draft** - if a document has never been published, and only draft versions of the document
   are present
1. **Published** - if a document is published and there are no newer drafts available
1. **Changed** - if a document has been published, but there are newer drafts available
   and not yet published

## Draft API

<Banner type="success">
  If drafts are enabled on your collection or global, important and powerful
  changes are made to your REST, GraphQL, and Local APIs that allow you to
  specify if you are interacting with drafts or with live documents.
</Banner>

#### Using the `draft` parameter

When drafts are enabled, the `create`, `update`, `find`, and `findByID` operations for REST, GraphQL, and Local APIs expose a `draft` parameter. For write operations, it controls validation and where data is written. For read operations, it determines whether to return draft versions.

```ts
// REST API
POST /api/your-collection?draft=true

// Local API
await payload.create({
  collection: 'your-collection',
  data: {
    // your data here
  },
  draft: true,
})

// GraphQL
mutation {
  createYourCollection(data: { ... }, draft: true) {
    // ...
  }
}
```

**Understanding `draft` parameter and `_status` field**

The `draft` parameter and `_status` field work together but serve different purposes:

**`draft` parameter** - Controls two things:

1. **Validation**: When `draft: true`, required fields are not enforced, allowing you to save incomplete documents
2. **Write location**: Determines whether the main collection document is updated
   - `draft: true` - Saves ONLY to versions table (main collection unchanged)
   - `draft: false` or omitted - Saves to BOTH main collection AND versions table

**`_status` field** - Indicates whether a document is published or in draft state

- Defaults to `'draft'` when not explicitly provided
- Can be explicitly set in your data to `'published'` or `'draft'`

**First document creation**

When you first create a document, it's always written to the main collection (since no document exists yet):

- If you don't specify `_status`, it defaults to `_status: 'draft'`
- A version is also created in the versions table
- The `draft` parameter controls validation but doesn't change where the initial document is written

**Subsequent updates**

After initial creation, the `draft` parameter controls where your updates are written:

- **`draft: true`** - Only the versions table is updated; the main collection document remains unchanged
- **`draft: false` or omitted** - Both the main collection and versions table are updated

**Important:** The `draft` parameter does NOT control whether a document is published or not. A document remains with `_status: 'draft'` by default unless you explicitly set `_status: 'published'` in your data.

**Publishing a document**

To publish a document, you must explicitly set `_status: 'published'` in your data. When you do this:

- If you use `draft: false` or omit it, the main collection will be updated with the published status
- If you use `draft: true`, the `_status: 'published'` takes precedence and will still update the main collection as published (overriding the `draft: true` behavior)

**Quick reference**

| Operation | `draft` param      | `_status` in data    | Result                                                         |
| --------- | ------------------ | -------------------- | -------------------------------------------------------------- |
| Create    | `true` or `false`  | omitted              | Main collection updated with `_status: 'draft'`                |
| Create    | `true` or `false`  | `'published'`        | Main collection updated with `_status: 'published'`            |
| Update    | `true`             | omitted or `'draft'` | Only versions table updated, main collection unchanged         |
| Update    | `true`             | `'published'`        | Main collection updated with `_status: 'published'` (override) |
| Update    | `false` or omitted | omitted              | Main collection updated with `_status: 'draft'`                |
| Update    | `false` or omitted | `'published'`        | Main collection updated with `_status: 'published'`            |

**Required fields**

Setting `_status: "draft"` will not bypass required field validation. You need to set `draft: true` to save incomplete documents as shown in the previous examples.

#### Reading drafts vs. published documents

In addition to the `draft` argument within `create` and `update` operations, a `draft` argument is also exposed for `find` and `findByID` operations.

When `draft` is set to `true` while reading a document, **Payload will return the most recent version from the versions table**, regardless of whether it's a draft or published document.

**Example scenario:**

1. You create a document with `_status: 'published'` (published in main collection)
1. You update with `draft: true` to make changes without affecting the published version
1. You update again with `draft: true` to make more draft changes

At this point, your published document remains unchanged in the main collection, and you have two newer draft versions in the `_[collectionSlug]_versions` table.

When you fetch the document with a standard `find` or `findByID` operation, the published document from the main collection is returned and draft versions are ignored.

However, if you pass `draft: true` to the read operation, Payload will return the most recent version from the versions table. In the scenario above with two draft versions, you'll get the latest (second) draft.

**Note:** If there are no newer drafts (e.g., you published a document and haven't made draft changes since), querying with `draft: true` will still return the latest version from the versions table, which would be the same published content as in the main collection.

<Banner type="error">
  **Important:** the `draft` argument on its own will not restrict documents
  with `_status: 'draft'` from being returned from the API. You need to use
  Access Control to prevent documents with `_status: 'draft'` from being
  returned to unauthenticated users. Read below for more information on how this
  works.
</Banner>

## Controlling who can see Collection drafts

<Banner type="warning">
  If you're using the **drafts** feature, it's important for you to consider who
  can view your drafts, and who can view only published documents. Luckily,
  Payload makes this extremely simple and puts the power completely in your
  hands.
</Banner>

#### Restricting draft access

You can use the `read` [Access Control](../access-control/collections#read) method to restrict who is able to view drafts of your documents by simply returning a [query constraint](/docs/queries/overview) which restricts the documents that any given user is able to retrieve.

Here is an example that utilizes the `_status` field to require a user to be logged in to retrieve drafts:

```ts
import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    read: ({ req }) => {
      // If there is a user logged in,
      // let them retrieve all documents
      if (req.user) return true

      // If there is no user,
      // restrict the documents that are returned
      // to only those where `_status` is equal to `published`
      return {
        _status: {
          equals: 'published',
        },
      }
    },
  },
  versions: {
    drafts: true,
  },
  //.. the rest of the Pages config here
}
```

<Banner type="warning">
  **Note regarding adding versions to an existing collection**

If you already have a collection with documents, and you _opt in_ to draft functionality
after you have already created existing documents, all of your old documents
_will not have a `_status` field_ until you resave them. For this reason, if you are
_adding_ versions into an existing collection, you might want to write your Access Control
function to allow for users to read both documents where
**`_status` is equal to `"published"`** as well as where
**`_status` does not exist**.

</Banner>

Here is an example for how to write an [Access Control](../access-control/overview) function that grants access to both documents where `_status` is equal to "published" and where `_status` does not exist:

```ts
import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    read: ({ req }) => {
      // If there is a user logged in,
      // let them retrieve all documents
      if (req.user) return true

      // If there is no user,
      // restrict the documents that are returned
      // to only those where `_status` is equal to `published`
      // or where `_status` does not exist
      return {
        or: [
          {
            _status: {
              equals: 'published',
            },
          },
          {
            _status: {
              exists: false,
            },
          },
        ],
      }
    },
  },
  versions: {
    drafts: true,
  },
  //.. the rest of the Pages config here
}
```

## Scheduled publish

Payload provides for an ability to schedule publishing / unpublishing events in the future, which can be helpful if you need to set certain documents to "go live" at a given date in the future, or, vice versa, revert to a draft state after a certain time has passed.

You can enable this functionality on both collections and globals via the `versions.drafts.schedulePublish: true` property.

<Banner type="warning">
  **Important:** if you are going to enable scheduled publish / unpublish, you
  need to make sure your Payload app is set up to process
  [Jobs](/docs/jobs-queue/overview). This feature works by creating a Job in the
  background, which will be picked up after the job becomes available. If you do
  not have any mechanism in place to run jobs, your scheduled publish /
  unpublish jobs will never be executed.
</Banner>

## Unpublishing drafts

If a document is published, the Payload Admin UI will be updated to show an "unpublish" button at the top of the sidebar, which will "unpublish" the currently published document. Consider this as a way to "revert" a document back to a draft state. On the API side, this is done by simply setting `_status: 'draft'` on any document.

## Reverting to published

If a document is published, and you have made further changes which are saved as a draft, Payload will show a "revert to published" button at the top of the sidebar which will allow you to reject your draft changes and "revert" back to the published state of the document. Your drafts will still be saved, but a new version will be created that will reflect the last published state of the document.
```

--------------------------------------------------------------------------------

````
