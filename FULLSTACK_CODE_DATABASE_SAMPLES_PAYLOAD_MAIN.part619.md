---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 619
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 619 of 695)

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

---[FILE: index.module.scss]---
Location: payload-main/test/live-preview/prod/app/live-preview/_heros/PostHero/index.module.scss

```text
@use '../../_css/common.scss' as *;

.postHero {
  display: flex;
  gap: calc(var(--base) * 2);

  @include mid-break {
    flex-direction: column;
    gap: var(--base);
  }
}

.content {
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: var(--base);

  @include mid-break {
    width: 100%;
    gap: calc(var(--base) / 2);
  }
}

.warning {
  margin-bottom: calc(var(--base) * 1.5);
}

.meta {
  margin: 0;
}

.description {
  margin: 0;
}

.media {
  width: 50%;

  @include mid-break {
    width: 100%;
  }
}

.mediaWrapper {
  text-decoration: none;
  display: block;
  position: relative;
  aspect-ratio: 5 / 4;
  margin-bottom: calc(var(--base) / 2);
  width: calc(100% + calc(var(--gutter-h) / 2));

  @include mid-break {
    margin-left: calc(var(--gutter-h) * -1);
    width: calc(100% + var(--gutter-h) * 2);
  }
}

.image {
  object-fit: cover;
}

.placeholder {
  background-color: var(--color-base-50);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.caption {
  color: var(--color-base-500);
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/live-preview/prod/app/live-preview/_heros/PostHero/index.tsx
Signals: React, Next.js

```typescript
import LinkWithDefault from 'next/link.js'
import React, { Fragment } from 'react'

import type { Post } from '../../../../../payload-types.js'

import { PAYLOAD_SERVER_URL } from '../../_api/serverURL.js'
import { Gutter } from '../../_components/Gutter/index.js'
import { Media } from '../../_components/Media/index.js'
import RichText from '../../_components/RichText/index.js'
import { formatDateTime } from '../../_utilities/formatDateTime.js'
import classes from './index.module.scss'

const Link = 'default' in LinkWithDefault ? LinkWithDefault.default : LinkWithDefault

export const PostHero: React.FC<{
  post: Post
}> = ({ post }) => {
  const { id, createdAt, meta: { description, image: metaImage } = {} } = post

  return (
    <Fragment>
      <Gutter className={classes.postHero}>
        <div className={classes.content}>
          <RichText className={classes.richText} content={post?.hero?.richText} />
          <p className={classes.meta}>
            {createdAt && (
              <Fragment>
                {'Created on '}
                {formatDateTime(createdAt)}
              </Fragment>
            )}
          </p>
          <div>
            <p className={classes.description}>
              {`${description ? `${description} ` : ''}To edit this post, `}
              <Link href={`${PAYLOAD_SERVER_URL}/admin/collections/posts/${id}`}>
                navigate to the admin dashboard
              </Link>
              .
            </p>
          </div>
        </div>
        <div className={classes.media}>
          <div className={classes.mediaWrapper}>
            {!metaImage && <div className={classes.placeholder}>No image</div>}
            {metaImage && typeof metaImage !== 'string' && (
              <Media fill imgClassName={classes.image} resource={metaImage} />
            )}
          </div>
          {metaImage && typeof metaImage !== 'string' && metaImage?.caption && (
            <RichText className={classes.caption} content={metaImage.caption} />
          )}
        </div>
      </Gutter>
    </Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: formatDateTime.ts]---
Location: payload-main/test/live-preview/prod/app/live-preview/_utilities/formatDateTime.ts

```typescript
export const formatDateTime = (timestamp: string): string => {
  const now = new Date()
  let date = now
  if (timestamp) date = new Date(timestamp)
  const months = date.getMonth()
  const days = date.getDate()
  // const hours = date.getHours();
  // const minutes = date.getMinutes();
  // const seconds = date.getSeconds();

  const MM = months + 1 < 10 ? `0${months + 1}` : months + 1
  const DD = days < 10 ? `0${days}` : days
  const YYYY = date.getFullYear()
  // const AMPM = hours < 12 ? 'AM' : 'PM';
  // const HH = hours > 12 ? hours - 12 : hours;
  // const MinMin = (minutes < 10) ? `0${minutes}` : minutes;
  // const SS = (seconds < 10) ? `0${seconds}` : seconds;

  return `${MM}/${DD}/${YYYY}`
}
```

--------------------------------------------------------------------------------

---[FILE: toKebabCase.ts]---
Location: payload-main/test/live-preview/prod/app/live-preview/_utilities/toKebabCase.ts

```typescript
export const toKebabCase = (string: string): string =>
  string
    ?.replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase()
```

--------------------------------------------------------------------------------

---[FILE: footer.ts]---
Location: payload-main/test/live-preview/seed/footer.ts

```typescript
import type { Footer } from '../payload-types.js'

export const footer: Partial<Footer> = {}
```

--------------------------------------------------------------------------------

---[FILE: header.ts]---
Location: payload-main/test/live-preview/seed/header.ts

```typescript
import type { Header } from '../payload-types.js'

export const header: Partial<Header> = {
  navItems: [
    {
      link: {
        type: 'reference',
        url: '',
        reference: {
          relationTo: 'pages',
          value: '{{POSTS_PAGE_ID}}',
        },
        label: 'Posts',
      },
    },
    {
      link: {
        type: 'reference',
        url: '',
        reference: {
          relationTo: 'posts',
          value: '{{POST_1_ID}}',
        },
        label: 'Post 1',
      },
    },
    {
      link: {
        type: 'reference',
        url: '',
        reference: {
          relationTo: 'posts',
          value: '{{POST_2_ID}}',
        },
        label: 'Post 2',
      },
    },
    {
      link: {
        type: 'reference',
        url: '',
        reference: {
          relationTo: 'posts',
          value: '{{POST_3_ID}}',
        },
        label: 'Post 3',
      },
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: home.ts]---
Location: payload-main/test/live-preview/seed/home.ts

```typescript
import type { Page } from '../payload-types.js'

import { postsSlug } from '../shared.js'

export const home: Omit<Page, 'createdAt' | 'id' | 'updatedAt'> = {
  slug: 'home',
  title: 'Home',
  meta: {
    description: 'This is an example of live preview on a page.',
  },
  tenant: '{{TENANT_1_ID}}',
  localizedTitle: 'Localized Title',
  hero: {
    type: 'highImpact',
    richText: [
      {
        type: 'h1',
        children: [{ text: 'Hello, world!' }],
      },
      {
        type: 'p',
        children: [
          {
            text: 'This is an example of live preview on a page. You can edit this page in the admin panel and see the changes reflected here.',
          },
        ],
      },
    ],
    media: '{{MEDIA_ID}}',
  },
  layout: [
    {
      blockType: 'archive',
      populateBy: 'selection',
      selectedDocs: [
        {
          relationTo: postsSlug,
          value: '{{POST_1_ID}}',
        },
        {
          relationTo: postsSlug,
          value: '{{POST_2_ID}}',
        },
        {
          relationTo: postsSlug,
          value: '{{POST_3_ID}}',
        },
      ],
      introContent: [
        {
          type: 'h2',
          children: [{ text: 'Recent Posts' }],
        },
        {
          type: 'p',
          children: [
            {
              text: 'This is a custom layout building block. You can edit this block in the admin panel and see the changes reflected here.',
            },
          ],
        },
      ],
    },
    {
      blockType: 'cta',
      blockName: 'CTA',
      richText: [
        {
          children: [
            {
              text: 'This is a call to action',
            },
          ],
          type: 'h4',
        },
        {
          children: [
            {
              text: 'This is a custom layout building block. You can edit this block in the admin panel and see the changes reflected here.',
            },
          ],
        },
      ],
      links: [
        {
          link: {
            type: 'reference',
            url: '',
            label: 'All posts',
            appearance: 'primary',
            reference: {
              value: '{{POSTS_PAGE_ID}}',
              relationTo: 'pages',
            },
          },
        },
      ],
    },
  ],
  relationshipAsUpload: '{{MEDIA_ID}}',
  richTextSlate: [
    {
      children: [
        {
          text: ' ',
        },
      ],
      relationTo: postsSlug,
      type: 'relationship',
      value: {
        id: '{{POST_1_ID}}',
      },
    },
    {
      type: 'paragraph',
      children: [
        {
          text: '',
        },
      ],
    },
    {
      children: [
        {
          text: '',
        },
      ],
      relationTo: 'media',
      type: 'upload',
      value: {
        id: '{{MEDIA_ID}}',
      },
    },
  ],
  richTextLexical: {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: [
        {
          format: '',
          type: 'relationship',
          version: 1,
          relationTo: postsSlug,
          value: {
            id: '{{POST_1_ID}}',
          },
        },
        {
          children: [],
          direction: null,
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
        },
        {
          format: '',
          type: 'upload',
          version: 1,
          fields: null,
          relationTo: 'media',
          value: {
            id: '{{MEDIA_ID}}',
          },
        },
      ],
      direction: null,
    },
  },
  richTextLexicalLocalized: {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: [
        {
          children: [],
          direction: null,
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
        },
        {
          format: '',
          type: 'upload',
          version: 1,
          fields: null,
          relationTo: 'media',
          value: {
            id: '{{MEDIA_ID}}',
          },
        },
      ],
      direction: null,
    },
  },
  relationshipMonoHasMany: ['{{POST_1_ID}}'],
  relationshipMonoHasOne: '{{POST_1_ID}}',
  relationshipPolyHasMany: [{ relationTo: 'posts', value: '{{POST_1_ID}}' }],
  relationshipPolyHasOne: { relationTo: 'posts', value: '{{POST_1_ID}}' },
  arrayOfRelationships: [
    {
      uploadInArray: '{{MEDIA_ID}}',
      richTextInArray: {
        root: {
          type: 'root',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              format: '',
              type: 'relationship',
              version: 1,
              relationTo: postsSlug,
              value: {
                id: '{{POST_1_ID}}',
              },
            },
            {
              children: [],
              direction: null,
              format: '',
              indent: 0,
              type: 'paragraph',
              version: 1,
            },
            {
              format: '',
              type: 'upload',
              version: 1,
              fields: null,
              relationTo: 'media',
              value: {
                id: '{{MEDIA_ID}}',
              },
            },
          ],
          direction: null,
        },
      },
      relationshipInArrayMonoHasMany: ['{{POST_1_ID}}'],
      relationshipInArrayMonoHasOne: '{{POST_1_ID}}',
      relationshipInArrayPolyHasMany: [{ relationTo: 'posts', value: '{{POST_1_ID}}' }],
      relationshipInArrayPolyHasOne: { relationTo: 'posts', value: '{{POST_1_ID}}' },
    },
  ],
  tab: {
    relationshipInTab: '{{POST_1_ID}}',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/live-preview/seed/index.ts

```typescript
import type { Config } from 'payload'

import path from 'path'
import { fileURLToPath } from 'url'

import { devUser } from '../../credentials.js'
import removeFiles from '../../helpers/removeFiles.js'
import {
  customLivePreviewSlug,
  pagesSlug,
  postsSlug,
  ssrAutosavePagesSlug,
  ssrPagesSlug,
  tenantsSlug,
} from '../shared.js'
import { footer } from './footer.js'
import { header } from './header.js'
import { home } from './home.js'
import { post1 } from './post-1.js'
import { post2 } from './post-2.js'
import { post3 } from './post-3.js'
import { postsPage } from './posts-page.js'
import { tenant1 } from './tenant-1.js'
import { tenant2 } from './tenant-2.js'
import { trashedPost } from './trashed-post.js'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const seed: Config['onInit'] = async (payload) => {
  const existingUser = await payload.find({
    collection: 'users',
    where: {
      email: {
        equals: devUser.email,
      },
    },
  })

  // Seed already ran => this is likely a consecutive, uncached getPayload call
  if (existingUser.docs.length) {
    return
  }

  const uploadsDir = path.resolve(dirname, './media')
  removeFiles(path.normalize(uploadsDir))

  await payload.create({
    collection: 'users',
    data: {
      email: devUser.email,
      password: devUser.password,
    },
  })

  const tenant1Doc = await payload.create({
    collection: tenantsSlug,
    data: tenant1,
  })

  await payload.create({
    collection: tenantsSlug,
    data: tenant2,
  })

  const media = await payload.create({
    collection: 'media',
    filePath: path.resolve(dirname, 'image-1.jpg'),
    data: {
      alt: 'Image 1',
    },
  })

  const mediaID = payload.db.defaultIDType === 'number' ? media.id : `"${media.id}"`
  const tenantID = payload.db.defaultIDType === 'number' ? tenant1Doc.id : `"${tenant1Doc.id}"`

  const post1Doc = await payload.create({
    collection: postsSlug,
    data: JSON.parse(
      JSON.stringify(post1)
        .replace(/"\{\{IMAGE\}\}"/g, mediaID)
        .replace(/"\{\{TENANT_1_ID\}\}"/g, tenantID),
    ),
  })

  const post2Doc = await payload.create({
    collection: postsSlug,
    data: JSON.parse(
      JSON.stringify(post2)
        .replace(/"\{\{IMAGE\}\}"/g, mediaID)
        .replace(/"\{\{TENANT_1_ID\}\}"/g, tenantID),
    ),
  })

  const post3Doc = await payload.create({
    collection: postsSlug,
    data: JSON.parse(
      JSON.stringify(post3)
        .replace(/"\{\{IMAGE\}\}"/g, mediaID)
        .replace(/"\{\{TENANT_1_ID\}\}"/g, tenantID),
    ),
  })

  await payload.create({
    collection: postsSlug,
    data: JSON.parse(
      JSON.stringify(trashedPost)
        .replace(/"\{\{IMAGE\}\}"/g, mediaID)
        .replace(/"\{\{TENANT_1_ID\}\}"/g, tenantID),
    ),
  })

  const postsPageDoc = await payload.create({
    collection: pagesSlug,
    data: JSON.parse(JSON.stringify(postsPage).replace(/"\{\{IMAGE\}\}"/g, mediaID)),
  })

  let postsPageDocID = postsPageDoc.id
  let post1DocID = post1Doc.id
  let post2DocID = post2Doc.id
  let post3DocID = post3Doc.id

  if (payload.db.defaultIDType !== 'number') {
    postsPageDocID = `"${postsPageDoc.id}"`
    post1DocID = `"${post1Doc.id}"`
    post2DocID = `"${post2Doc.id}"`
    post3DocID = `"${post3Doc.id}"`
  }

  await payload.create({
    collection: pagesSlug,
    data: JSON.parse(
      JSON.stringify(home)
        .replace(/"\{\{MEDIA_ID\}\}"/g, mediaID)
        .replace(/"\{\{POSTS_PAGE_ID\}\}"/g, postsPageDocID)
        .replace(/"\{\{POST_1_ID\}\}"/g, post1DocID)
        .replace(/"\{\{POST_2_ID\}\}"/g, post2DocID)
        .replace(/"\{\{POST_3_ID\}\}"/g, post3DocID)
        .replace(/"\{\{TENANT_1_ID\}\}"/g, tenantID),
    ),
  })

  await payload.create({
    collection: customLivePreviewSlug,
    data: {
      ...JSON.parse(
        JSON.stringify(home)
          .replace(/"\{\{MEDIA_ID\}\}"/g, mediaID)
          .replace(/"\{\{POSTS_PAGE_ID\}\}"/g, postsPageDocID)
          .replace(/"\{\{POST_1_ID\}\}"/g, post1DocID)
          .replace(/"\{\{POST_2_ID\}\}"/g, post2DocID)
          .replace(/"\{\{POST_3_ID\}\}"/g, post3DocID)
          .replace(/"\{\{TENANT_1_ID\}\}"/g, tenantID),
      ),
      title: 'Custom Live Preview',
      slug: 'custom-live-preview',
    },
  })

  await payload.create({
    collection: ssrPagesSlug,
    data: {
      ...JSON.parse(
        JSON.stringify(home)
          .replace(/"\{\{MEDIA_ID\}\}"/g, mediaID)
          .replace(/"\{\{POSTS_PAGE_ID\}\}"/g, postsPageDocID)
          .replace(/"\{\{POST_1_ID\}\}"/g, post1DocID)
          .replace(/"\{\{POST_2_ID\}\}"/g, post2DocID)
          .replace(/"\{\{POST_3_ID\}\}"/g, post3DocID)
          .replace(/"\{\{TENANT_1_ID\}\}"/g, tenantID),
      ),
      title: 'SSR Home',
      slug: 'home',
    },
  })

  await payload.create({
    collection: ssrAutosavePagesSlug,
    data: {
      ...JSON.parse(
        JSON.stringify(home)
          .replace(/"\{\{MEDIA_ID\}\}"/g, mediaID)
          .replace(/"\{\{POSTS_PAGE_ID\}\}"/g, postsPageDocID)
          .replace(/"\{\{POST_1_ID\}\}"/g, post1DocID)
          .replace(/"\{\{POST_2_ID\}\}"/g, post2DocID)
          .replace(/"\{\{POST_3_ID\}\}"/g, post3DocID)
          .replace(/"\{\{TENANT_1_ID\}\}"/g, tenantID),
      ),
      title: 'SSR Home',
      slug: 'home',
    },
  })

  await payload.updateGlobal({
    slug: 'header',
    data: JSON.parse(
      JSON.stringify(header)
        .replace(/"\{\{POSTS_PAGE_ID\}\}"/g, postsPageDocID)
        .replace(/"\{\{POST_1_ID\}\}"/g, post1DocID)
        .replace(/"\{\{POST_2_ID\}\}"/g, post2DocID)
        .replace(/"\{\{POST_3_ID\}\}"/g, post3DocID),
    ),
  })

  await payload.updateGlobal({
    slug: 'footer',
    data: JSON.parse(JSON.stringify(footer)),
  })
}
```

--------------------------------------------------------------------------------

---[FILE: post-1.ts]---
Location: payload-main/test/live-preview/seed/post-1.ts

```typescript
import type { Post } from '../payload-types.js'
export const post1: Omit<Post, 'createdAt' | 'id' | 'updatedAt'> = {
  title: 'Post 1',
  slug: 'post-1',
  meta: {
    title: 'Post 1',
    description: 'This is the first post.',
    image: '{{IMAGE}}',
  },
  tenant: '{{TENANT_1_ID}}',
  hero: {
    type: 'lowImpact',
    richText: [
      {
        children: [
          {
            text: 'Post 1',
          },
        ],
        type: 'h1',
      },
    ],
    media: null,
  },
  layout: [
    {
      blockType: 'content',
      columns: [
        {
          size: 'twoThirds',
          richText: [
            {
              children: [
                {
                  text: "This content is completely dynamic using custom layout building blocks configured in the CMS. This can be anything you'd like from rich text and images, to highly designed, complex components.",
                },
              ],
            },
          ],
          link: {
            type: 'custom',
            url: '',
            label: '',
          },
        },
      ],
    },
  ],
  relatedPosts: [], // this is populated by the seed script
}
```

--------------------------------------------------------------------------------

---[FILE: post-2.ts]---
Location: payload-main/test/live-preview/seed/post-2.ts

```typescript
import type { Post } from '../payload-types.js'

export const post2: Omit<Post, 'createdAt' | 'id' | 'updatedAt'> = {
  title: 'Post 2',
  slug: 'post-2',
  meta: {
    title: 'Post 2',
    description: 'This is the second post.',
    image: '{{IMAGE}}',
  },
  tenant: '{{TENANT_1_ID}}',
  hero: {
    type: 'lowImpact',
    richText: [
      {
        children: [
          {
            text: 'Post 2',
          },
        ],
        type: 'h1',
      },
    ],
    media: null,
  },
  layout: [
    {
      blockType: 'content',
      columns: [
        {
          size: 'twoThirds',
          richText: [
            {
              children: [
                {
                  text: "This content is completely dynamic using custom layout building blocks configured in the CMS. This can be anything you'd like from rich text and images, to highly designed, complex components.",
                },
              ],
            },
          ],
          link: {
            type: 'custom',
            url: '',
            label: '',
          },
        },
      ],
    },
  ],
  relatedPosts: [], // this is populated by the seed script
}
```

--------------------------------------------------------------------------------

---[FILE: post-3.ts]---
Location: payload-main/test/live-preview/seed/post-3.ts

```typescript
import type { Post } from '../payload-types.js'

export const post3: Omit<Post, 'createdAt' | 'id' | 'updatedAt'> = {
  title: 'Post 3',
  slug: 'post-3',
  meta: {
    title: 'Post 3',
    description: 'This is the third post.',
    image: '{{IMAGE}}',
  },
  tenant: '{{TENANT_1_ID}}',
  hero: {
    type: 'lowImpact',
    richText: [
      {
        children: [
          {
            text: 'Post 3',
          },
        ],
        type: 'h1',
      },
    ],
    media: null,
  },
  layout: [
    {
      blockType: 'content',
      columns: [
        {
          size: 'twoThirds',
          richText: [
            {
              children: [
                {
                  text: "This content is completely dynamic using custom layout building blocks configured in the CMS. This can be anything you'd like from rich text and images, to highly designed, complex components.",
                },
              ],
            },
          ],
          link: {
            type: 'custom',
            url: '',
            label: '',
          },
        },
      ],
    },
  ],
  relatedPosts: [], // this is populated by the seed script
}
```

--------------------------------------------------------------------------------

---[FILE: posts-page.ts]---
Location: payload-main/test/live-preview/seed/posts-page.ts

```typescript
import type { Page } from '../payload-types.js'

import { postsSlug } from '../shared.js'

export const postsPage: Partial<Page> = {
  title: 'Posts',
  slug: 'posts',
  meta: {
    title: 'Payload Website Template',
    description: 'An open-source website built with Payload and Next.js.',
    image: '{{IMAGE}}',
  },
  hero: {
    type: 'lowImpact',
    richText: [
      {
        type: 'h1',
        children: [
          {
            text: 'All posts',
          },
        ],
      },
      {
        type: 'p',
        children: [
          {
            text: 'This is an example of live preview on a page. You can edit this page in the admin panel and see the changes reflected here.',
          },
        ],
      },
    ],
    media: undefined,
  },
  layout: [
    {
      blockName: 'Archive Block',
      blockType: 'archive',
      introContent: [
        {
          type: 'h4',
          children: [
            {
              text: 'All posts',
            },
          ],
        },
        {
          type: 'p',
          children: [
            {
              text: 'This is a custom layout building block. You can edit this block in the admin panel and see the changes reflected here.',
            },
          ],
        },
      ],
      populateBy: 'collection',
      relationTo: postsSlug,
      limit: 10,
      categories: [],
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: tenant-1.ts]---
Location: payload-main/test/live-preview/seed/tenant-1.ts

```typescript
import type { Tenant } from '../payload-types.js'

export const tenant1: Omit<Tenant, 'createdAt' | 'id' | 'updatedAt'> = {
  title: 'Tenant 1',
  clientURL: 'http://localhost:3000',
}
```

--------------------------------------------------------------------------------

---[FILE: tenant-2.ts]---
Location: payload-main/test/live-preview/seed/tenant-2.ts

```typescript
import type { Tenant } from '../payload-types.js'

export const tenant2: Omit<Tenant, 'createdAt' | 'id' | 'updatedAt'> = {
  title: 'Tenant 2',
  clientURL: 'http://localhost:3001',
}
```

--------------------------------------------------------------------------------

---[FILE: trashed-post.ts]---
Location: payload-main/test/live-preview/seed/trashed-post.ts

```typescript
import type { Post } from '../payload-types.js'

export const trashedPost: Omit<Post, 'createdAt' | 'id' | 'updatedAt'> = {
  title: 'Trashed Post',
  slug: 'trashed-post',
  meta: {
    title: 'Trashed Post',
    description: 'This is a trashed post.',
    image: '{{IMAGE}}',
  },
  tenant: '{{TENANT_1_ID}}',
  hero: {
    type: 'lowImpact',
    richText: [
      {
        children: [
          {
            text: 'Trashed Post',
          },
        ],
        type: 'h1',
      },
    ],
    media: null,
  },
  layout: [
    {
      blockType: 'content',
      columns: [
        {
          size: 'twoThirds',
          richText: [
            {
              children: [
                {
                  text: "This content is completely dynamic using custom layout building blocks configured in the CMS. This can be anything you'd like from rich text and images, to highly designed, complex components.",
                },
              ],
            },
          ],
          link: {
            type: 'custom',
            url: '',
            label: '',
          },
        },
      ],
    },
  ],
  relatedPosts: [], // this is populated by the seed script
  deletedAt: new Date().toISOString(), // Marking the post as trashed
}
```

--------------------------------------------------------------------------------

---[FILE: deepMerge.ts]---
Location: payload-main/test/live-preview/utilities/deepMerge.ts

```typescript
// @ts-nocheck

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item: unknown): boolean {
  return item && typeof item === 'object' && !Array.isArray(item)
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export default function deepMerge<T, R>(target: T, source: R): T {
  const output = { ...target }
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] })
        } else {
          output[key] = deepMerge(target[key], source[key])
        }
      } else {
        Object.assign(output, { [key]: source[key] })
      }
    })
  }

  return output
}
```

--------------------------------------------------------------------------------

---[FILE: formatLivePreviewURL.ts]---
Location: payload-main/test/live-preview/utilities/formatLivePreviewURL.ts

```typescript
import type { LivePreviewConfig } from 'payload'

export const formatLivePreviewURL: LivePreviewConfig['url'] = async ({
  data,
  collectionConfig,
  req,
}) => {
  let baseURL = `/live-preview`

  // You can run async requests here, if needed
  // For example, multi-tenant apps may need to lookup additional data
  if (data?.tenant) {
    try {
      const fullTenant = await req.payload
        .find({
          collection: 'tenants',
          where: {
            id: {
              equals: data.tenant,
            },
          },
          limit: 1,
          depth: 0,
        })
        .then((res) => res?.docs?.[0])

      if (fullTenant?.clientURL) {
        // Note: appending a fully-qualified URL here won't work for preview deployments on Vercel
        baseURL = `${fullTenant.clientURL}/live-preview`
      }
    } catch (e) {
      console.error(e)
    }
  }

  // Format the URL as needed, based on the document and data
  // I.e. append '/posts' to the URL if the document is a post
  // You can also do this on individual collection or global config, if preferred
  const isPage = collectionConfig && collectionConfig.slug === 'pages'
  const isHomePage = isPage && data?.slug === 'home'

  return `${baseURL}${
    !isPage && collectionConfig ? `/${collectionConfig.slug}` : ''
  }${!isHomePage && data?.slug ? `/${data.slug}` : ''}`
}
```

--------------------------------------------------------------------------------

---[FILE: formatSlug.ts]---
Location: payload-main/test/live-preview/utilities/formatSlug.ts

```typescript
import type { FieldHook } from 'payload'

const format = (val: string): string =>
  val
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .toLowerCase()

const formatSlug =
  (fallback: string): FieldHook =>
  ({ operation, value, originalDoc, data }) => {
    if (typeof value === 'string') {
      return format(value)
    }

    if (operation === 'create') {
      const fallbackData = data?.[fallback] || originalDoc?.[fallback]

      if (fallbackData && typeof fallbackData === 'string') {
        return format(fallbackData)
      }
    }

    return value
  }

export default formatSlug
```

--------------------------------------------------------------------------------

---[FILE: dependency-test.js]---
Location: payload-main/test/loader/dependency-test.js
Signals: Next.js

```javascript
import { redirect } from 'next/navigation.js'
import { v4 as uuid } from 'uuid'
import { mongooseAdapter } from '@payloadcms/db-mongodb'

export { redirect, uuid, mongooseAdapter }
```

--------------------------------------------------------------------------------

---[FILE: fileWithCJSImport.ts]---
Location: payload-main/test/loader/fileWithCJSImport.ts
Signals: Next.js

```typescript
import Link from 'next/link.js'

//@ts-expect-error
if (typeof Link.render !== 'function') {
  throw new Error('Link.render is not a function')
}
```

--------------------------------------------------------------------------------

---[FILE: init.js]---
Location: payload-main/test/loader/init.js

```javascript
async function init() {
  try {
    const result = await (await import(process.env.LOADER_TEST_FILE_PATH)).default
    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

void init()
```

--------------------------------------------------------------------------------

---[FILE: int.spec.ts]---
Location: payload-main/test/loader/int.spec.ts

```typescript
import { startChildProcess } from './startChildProcess.js'

describe('Loader', () => {
  it('should load dependencies without extensions', async () => {
    const code = await startChildProcess('./dependency-test.js')
    expect(code).toStrictEqual(0)
  })

  it('should import complex configs', async () => {
    const code = await startChildProcess('../fields/config.ts')
    expect(code).toStrictEqual(0)
  })

  it('should import configs that rely on custom components', async () => {
    const code = await startChildProcess('../admin/config.ts')
    expect(code).toStrictEqual(0)
  })

  it('should import unexported, direct .js file from commonjs module', async () => {
    /*
    Background of this test: next/Link.js is a CJS module which directly resolves to the Link.js JavaScript file. This file is not part of the package.json main or exports fields.
    This test ensures that the loader can resolve this file even if the .js extension is omitted.

    Previously, this import would be resolved as an empty {} object rather than the full Link. Whether it's a named or default export doesn't matter.

    The reason for that is that this goes through the ts moduleResolution of our loader (the default node nextResolve fails, as the js extension specifier is missing).

    Now the ts moduleResolution is able to resolve the file correctly, however it resolves to the pnpm symlink of the file, which is not the actual file on disk. The CommonJS module loader
    seems to fail to resolve symlink file paths. We have added a function which resolves the original path for potential symlinks - this fixes the issue. This test ensures that.
     */
    const code = await startChildProcess('./fileWithCJSImport.ts')
    expect(code).toStrictEqual(0)
  })
})
```

--------------------------------------------------------------------------------

---[FILE: startChildProcess.ts]---
Location: payload-main/test/loader/startChildProcess.ts

```typescript
import { spawn } from 'node:child_process'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import path from 'path'

const _filename = fileURLToPath(import.meta.url)
const _dirname = dirname(_filename)

export const startChildProcess = async (filePath: string): Promise<number> => {
  return new Promise<number>((res) => {
    const childProcess = spawn(
      'node',
      [
        '--no-deprecation',
        '--import',
        '@swc-node/register/esm-register',
        path.resolve(_dirname, 'init.js'),
      ],
      {
        env: {
          LOADER_TEST_FILE_PATH: filePath,
          NODE_ENV: 'development',
          PATH: process.env.PATH,
        },
        stdio: 'inherit',
      },
    )

    childProcess.on('close', (code) => {
      res(code)
    })
  })
}
```

--------------------------------------------------------------------------------

````
