---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 612
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 612 of 695)

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

---[FILE: shared.ts]---
Location: payload-main/test/live-preview/shared.ts

```typescript
export const pagesSlug = 'pages'
export const tenantsSlug = 'tenants'
export const ssrPagesSlug = 'ssr'
export const customLivePreviewSlug = 'custom-live-preview'
export const ssrAutosavePagesSlug = 'ssr-autosave'
export const postsSlug = 'posts'
export const mediaSlug = 'media'
export const categoriesSlug = 'categories'
export const collectionLevelConfigSlug = 'collection-level-config'
export const usersSlug = 'users'

export const mobileBreakpoint = {
  label: 'Mobile',
  name: 'mobile',
  width: 375,
  height: 667,
}

export const desktopBreakpoint = {
  label: 'Desktop',
  name: 'desktop',
  width: 1920,
  height: 1080,
}

export const renderedPageTitleID = 'rendered-page-title'

export const localizedPageTitleID = 'localized-page-title'
```

--------------------------------------------------------------------------------

---[FILE: startLivePreviewDemo.ts]---
Location: payload-main/test/live-preview/startLivePreviewDemo.ts

```typescript
import type { ChildProcessWithoutNullStreams } from 'child_process'
import type { Payload } from 'payload'

import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const installNodeModules = async (args: { payload: Payload }): Promise<void> => {
  const { payload } = args

  let installing = false

  return new Promise(function (resolve) {
    // Install the node modules for the Next.js app
    const installation = spawn('pnpm', ['install', '--ignore-workspace'], {
      cwd: path.resolve(dirname, './next-app'),
    })

    installation.stdout.on('data', (data) => {
      if (!installing) {
        payload.logger.info('Installing Next.js...')
        installing = true
      }

      payload.logger.info(data.toString())
    })

    installation.stderr.on('data', (data) => {
      payload.logger.error(data.toString())
    })

    installation.on('exit', () => {
      payload.logger.info('Done')
      resolve()
    })
  })
}

const bootNextApp = async (args: { payload: Payload }): Promise<ChildProcessWithoutNullStreams> => {
  const { payload } = args

  let started = false

  return new Promise(function (resolve, reject) {
    // Boot up the Next.js app
    const app = spawn('pnpm', ['dev'], {
      cwd: path.resolve(dirname, './next-app'),
    })

    app.stdout.on('data', (data) => {
      if (!started) {
        payload.logger.info('Starting Next.js...')
        started = true
      }

      payload.logger.info(data.toString())

      if (data.toString().includes('Ready in')) {
        resolve(app)
      }
    })

    app.stderr.on('data', (data) => {
      payload.logger.error(data.toString())
    })

    app.on('exit', (code) => {
      payload.logger.info(`Next.js exited with code ${code}`)
      reject()
    })
  })
}

export const startLivePreviewDemo = async (args: {
  payload: Payload
}): Promise<ChildProcessWithoutNullStreams> => {
  await installNodeModules(args)
  const process = await bootNextApp(args)

  return process
}
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.eslint.json]---
Location: payload-main/test/live-preview/tsconfig.eslint.json

```json
{
  // extend your base config to share compilerOptions, etc
  //"extends": "./tsconfig.json",
  "compilerOptions": {
    // ensure that nobody can accidentally use this config for a build
    "noEmit": true
  },
  "include": [
    // whatever paths you intend to lint
    "./**/*.ts",
    "./**/*.tsx"
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/test/live-preview/tsconfig.json
Signals: Next.js

```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@payload-config": ["./config.ts"],
      "@payloadcms/ui/assets": ["../../packages/ui/src/assets/index.ts"],
      "@payloadcms/ui/elements/*": ["../../packages/ui/src/elements/*/index.tsx"],
      "@payloadcms/ui/fields/*": ["../../packages/ui/src/fields/*/index.tsx"],
      "@payloadcms/ui/forms/*": ["../../packages/ui/src/forms/*/index.tsx"],
      "@payloadcms/ui/graphics/*": ["../../packages/ui/src/graphics/*/index.tsx"],
      "@payloadcms/ui/hooks/*": ["../../packages/ui/src/hooks/*.ts"],
      "@payloadcms/ui/icons/*": ["../../packages/ui/src/icons/*/index.tsx"],
      "@payloadcms/ui/providers/*": ["../../packages/ui/src/providers/*/index.tsx"],
      "@payloadcms/ui/templates/*": ["../../packages/ui/src/templates/*/index.tsx"],
      "@payloadcms/ui/utilities/*": ["../../packages/ui/src/utilities/*.ts"],
      "@payloadcms/ui/scss": ["../../packages/ui/src/scss.scss"],
      "@payloadcms/ui/scss/app.scss": ["../../packages/ui/src/scss/app.scss"],
      "payload/types": ["../../packages/payload/src/exports/types.ts"],
      "@payloadcms/next/*": ["../../packages/next/src/*"],
      "@payloadcms/next": ["../../packages/next/src/exports/*"]
    }
  },
  "include": ["next-env.d.ts", ".next/types/**/*.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

--------------------------------------------------------------------------------

---[FILE: custom.scss]---
Location: payload-main/test/live-preview/app/(payload)/custom.scss

```text
#custom-css {
  font-family: monospace;
}

#custom-css::after {
  content: 'custom-css';
}
```

--------------------------------------------------------------------------------

---[FILE: layout.tsx]---
Location: payload-main/test/live-preview/app/(payload)/layout.tsx
Signals: React

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { ServerFunctionClient } from 'payload'

import config from '@payload-config'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import React from 'react'

import { importMap } from './admin/importMap.js'
import './custom.scss'

type Args = {
  children: React.ReactNode
}

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
)

export default Layout
```

--------------------------------------------------------------------------------

---[FILE: not-found.tsx]---
Location: payload-main/test/live-preview/app/(payload)/admin/[[...segments]]/not-found.tsx
Signals: Next.js

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from 'next'

import config from '@payload-config'
import { generatePageMetadata, NotFoundPage } from '@payloadcms/next/views'

import { importMap } from '../importMap.js'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

const NotFound = ({ params, searchParams }: Args) =>
  NotFoundPage({ config, importMap, params, searchParams })

export default NotFound
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: payload-main/test/live-preview/app/(payload)/admin/[[...segments]]/page.tsx
Signals: Next.js

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from 'next'

import config from '@payload-config'
import { generatePageMetadata, RootPage } from '@payloadcms/next/views'

import { importMap } from '../importMap.js'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

const Page = ({ params, searchParams }: Args) =>
  RootPage({ config, importMap, params, searchParams })

export default Page
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: payload-main/test/live-preview/app/(payload)/api/graphql/route.ts

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import { GRAPHQL_POST, REST_OPTIONS } from '@payloadcms/next/routes'

export const POST = GRAPHQL_POST(config)

export const OPTIONS = REST_OPTIONS(config)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: payload-main/test/live-preview/app/(payload)/api/graphql-playground/route.ts

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import { GRAPHQL_PLAYGROUND_GET } from '@payloadcms/next/routes/index.js'

export const GET = GRAPHQL_PLAYGROUND_GET(config)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: payload-main/test/live-preview/app/(payload)/api/[...slug]/route.ts

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import { REST_DELETE, REST_GET, REST_OPTIONS, REST_PATCH, REST_POST } from '@payloadcms/next/routes'

export const GET = REST_GET(config)
export const POST = REST_POST(config)
export const DELETE = REST_DELETE(config)
export const PATCH = REST_PATCH(config)
export const OPTIONS = REST_OPTIONS(config)
```

--------------------------------------------------------------------------------

---[FILE: cssVariables.js]---
Location: payload-main/test/live-preview/app/live-preview/cssVariables.js

```javascript
// Keep these in sync with the CSS variables in the `_css` directory
export default {
  breakpoints: {
    s: 768,
    m: 1024,
    l: 1440,
  },
  colors: {
    base0: 'rgb(255, 255, 255)',
    base100: 'rgb(235, 235, 235)',
    base500: 'rgb(128, 128, 128)',
    base850: 'rgb(34, 34, 34)',
    base1000: 'rgb(0, 0, 0)',
    error500: 'rgb(255, 111, 118)',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: layout.tsx]---
Location: payload-main/test/live-preview/app/live-preview/layout.tsx
Signals: React, Next.js

```typescript
import type { Metadata } from 'next'

import React from 'react'

import { Footer } from './_components/Footer/index.js'
import { Header } from './_components/Header/index.js'
import './_css/app.scss'

export const metadata: Metadata = {
  description: 'Payload Live Preview',
  title: 'Payload Live Preview',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: not-found.tsx]---
Location: payload-main/test/live-preview/app/live-preview/not-found.tsx
Signals: React

```typescript
'use client'

import React from 'react'

import { Gutter } from './_components/Gutter/index.js'
import { VerticalPadding } from './_components/VerticalPadding/index.js'

export default function NotFound() {
  return (
    <main>
      <VerticalPadding bottom="medium" top="none">
        <Gutter>
          <h1>404</h1>
          <p>This page could not be found.</p>
        </Gutter>
      </VerticalPadding>
    </main>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: payload-main/test/live-preview/app/live-preview/page.tsx

```typescript
import PageTemplate from './(pages)/[slug]/page.js'

export default PageTemplate
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: payload-main/test/live-preview/app/live-preview/(pages)/custom-live-preview/[slug]/page.tsx
Signals: React, Next.js

```typescript
import { Gutter } from '@payloadcms/ui'
import { notFound } from 'next/navigation.js'
import React, { Fragment } from 'react'

import type { Page } from '../../../../../payload-types.js'

import { renderedPageTitleID, customLivePreviewSlug } from '../../../../../shared.js'
import { getDoc } from '../../../_api/getDoc.js'
import { getDocs } from '../../../_api/getDocs.js'
import { Blocks } from '../../../_components/Blocks/index.js'
import { Hero } from '../../../_components/Hero/index.js'
import { RefreshRouteOnSave } from './RefreshRouteOnSave.js'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function SSRAutosavePage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise

  const data = await getDoc<Page>({
    slug,
    collection: customLivePreviewSlug,
    draft: true,
  })

  if (!data) {
    notFound()
  }

  return (
    <Fragment>
      <RefreshRouteOnSave />
      <Hero {...data?.hero} />
      <Blocks blocks={data?.layout} />
      <Gutter>
        <div id={renderedPageTitleID}>{`For Testing: ${data.title}`}</div>
      </Gutter>
    </Fragment>
  )
}

export async function generateStaticParams() {
  process.env.PAYLOAD_DROP_DATABASE = 'false'
  try {
    const ssrPages = await getDocs<Page>(customLivePreviewSlug)
    return ssrPages?.map((page) => {
      return { slug: page.slug }
    })
  } catch (_err) {
    return []
  }
}
```

--------------------------------------------------------------------------------

---[FILE: RefreshRouteOnSave.tsx]---
Location: payload-main/test/live-preview/app/live-preview/(pages)/custom-live-preview/[slug]/RefreshRouteOnSave.tsx
Signals: React, Next.js

```typescript
'use client'

import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation.js'
import React from 'react'

import { PAYLOAD_SERVER_URL } from '../../../_api/serverURL.js'

export const RefreshRouteOnSave: React.FC = () => {
  const router = useRouter()
  return <PayloadLivePreview refresh={() => router.refresh()} serverURL={PAYLOAD_SERVER_URL} />
}
```

--------------------------------------------------------------------------------

---[FILE: page.client.tsx]---
Location: payload-main/test/live-preview/app/live-preview/(pages)/posts/[slug]/page.client.tsx
Signals: React

```typescript
'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'
import { Gutter } from '@payloadcms/ui'
import React from 'react'

import type { Post as PostType } from '../../../../../payload-types.js'

import { postsSlug, renderedPageTitleID } from '../../../../../shared.js'
import { PAYLOAD_SERVER_URL } from '../../../_api/serverURL.js'
import { Blocks } from '../../../_components/Blocks/index.js'
import { PostHero } from '../../../_heros/PostHero/index.js'

export const PostClient: React.FC<{
  post: PostType
}> = ({ post: initialPost }) => {
  const { data } = useLivePreview<PostType>({
    depth: 2,
    initialData: initialPost,
    serverURL: PAYLOAD_SERVER_URL,
  })

  return (
    <React.Fragment>
      <PostHero post={data} />
      <Blocks blocks={data?.layout} />
      <Blocks
        blocks={[
          {
            blockName: 'Related Posts',
            blockType: 'relatedPosts',
            docs: data?.relatedPosts,
            introContent: [
              {
                type: 'h4',
                children: [
                  {
                    text: 'Related posts',
                  },
                ],
              },
              {
                type: 'p',
                children: [
                  {
                    text: 'The posts displayed here are individually selected for this page. Admins can select any number of related posts to display here and the layout will adjust accordingly. Alternatively, you could swap this out for the "Archive" block to automatically populate posts by category complete with pagination. To manage related posts, ',
                  },
                  {
                    type: 'link',
                    children: [
                      {
                        text: 'navigate to the admin dashboard',
                      },
                    ],
                    url: `/admin/collections/posts/${data?.id}`,
                  },
                  {
                    text: '.',
                  },
                ],
              },
            ],
            relationTo: postsSlug,
          },
        ]}
        disableTopPadding
      />
      <Gutter>
        <div id={renderedPageTitleID}>{`For Testing: ${data.title}`}</div>
      </Gutter>
    </React.Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: payload-main/test/live-preview/app/live-preview/(pages)/posts/[slug]/page.tsx
Signals: React, Next.js

```typescript
import { notFound } from 'next/navigation.js'
import React from 'react'

import type { Post } from '../../../../../payload-types.js'

import { postsSlug } from '../../../../../shared.js'
import { getDoc } from '../../../_api/getDoc.js'
import { getDocs } from '../../../_api/getDocs.js'
import { PostClient } from './page.client.js'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  let post: null | Post = null

  try {
    post = await getDoc<Post>({
      slug,
      collection: postsSlug,
    })
  } catch (error) {
    console.error(error) // eslint-disable-line no-console
  }

  if (!post) {
    notFound()
  }

  return <PostClient post={post} />
}

export async function generateStaticParams() {
  process.env.PAYLOAD_DROP_DATABASE = 'false'
  try {
    const ssrPosts = await getDocs<Post>(postsSlug)
    return ssrPosts?.map((page) => {
      return { slug: page.slug }
    })
  } catch (error) {
    return []
  }
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: payload-main/test/live-preview/app/live-preview/(pages)/ssr/[slug]/page.tsx
Signals: React, Next.js

```typescript
import { Gutter } from '@payloadcms/ui'
import { notFound } from 'next/navigation.js'
import React, { Fragment } from 'react'

import type { Page } from '../../../../../payload-types.js'

import { renderedPageTitleID, ssrPagesSlug } from '../../../../../shared.js'
import { getDoc } from '../../../_api/getDoc.js'
import { getDocs } from '../../../_api/getDocs.js'
import { Blocks } from '../../../_components/Blocks/index.js'
import { Hero } from '../../../_components/Hero/index.js'
import { RefreshRouteOnSave } from './RefreshRouteOnSave.js'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function SSRPage({ params: paramsPromise }: Args) {
  const { slug = ' ' } = await paramsPromise
  const data = await getDoc<Page>({
    slug,
    collection: ssrPagesSlug,
    draft: true,
  })

  if (!data) {
    notFound()
  }

  return (
    <Fragment>
      <RefreshRouteOnSave />
      <Hero {...data?.hero} />
      <Blocks blocks={data?.layout} />
      <Gutter>
        <div id={renderedPageTitleID}>{`For Testing: ${data.title}`}</div>
      </Gutter>
    </Fragment>
  )
}

export async function generateStaticParams() {
  process.env.PAYLOAD_DROP_DATABASE = 'false'
  try {
    const ssrPages = await getDocs<Page>(ssrPagesSlug)
    return ssrPages?.map((page) => {
      return { slug: page.slug }
    })
  } catch (_err) {
    return []
  }
}
```

--------------------------------------------------------------------------------

---[FILE: RefreshRouteOnSave.tsx]---
Location: payload-main/test/live-preview/app/live-preview/(pages)/ssr/[slug]/RefreshRouteOnSave.tsx
Signals: React, Next.js

```typescript
'use client'

import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation.js'
import React from 'react'

import { PAYLOAD_SERVER_URL } from '../../../_api/serverURL.js'

export const RefreshRouteOnSave: React.FC = () => {
  const router = useRouter()
  return <PayloadLivePreview refresh={() => router.refresh()} serverURL={PAYLOAD_SERVER_URL} />
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: payload-main/test/live-preview/app/live-preview/(pages)/ssr-autosave/[slug]/page.tsx
Signals: React, Next.js

```typescript
import { Gutter } from '@payloadcms/ui'
import { notFound } from 'next/navigation.js'
import React, { Fragment } from 'react'

import type { Page } from '../../../../../payload-types.js'

import { renderedPageTitleID, ssrAutosavePagesSlug } from '../../../../../shared.js'
import { getDoc } from '../../../_api/getDoc.js'
import { getDocs } from '../../../_api/getDocs.js'
import { Blocks } from '../../../_components/Blocks/index.js'
import { Hero } from '../../../_components/Hero/index.js'
import { RefreshRouteOnSave } from './RefreshRouteOnSave.js'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function SSRAutosavePage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise

  const data = await getDoc<Page>({
    slug,
    collection: ssrAutosavePagesSlug,
    draft: true,
  })

  if (!data) {
    notFound()
  }

  return (
    <Fragment>
      <RefreshRouteOnSave />
      <Hero {...data?.hero} />
      <Blocks blocks={data?.layout} />
      <Gutter>
        <div id={renderedPageTitleID}>{`For Testing: ${data.title}`}</div>
      </Gutter>
    </Fragment>
  )
}

export async function generateStaticParams() {
  process.env.PAYLOAD_DROP_DATABASE = 'false'
  try {
    const ssrPages = await getDocs<Page>(ssrAutosavePagesSlug)
    return ssrPages?.map((page) => {
      return { slug: page.slug }
    })
  } catch (_err) {
    return []
  }
}
```

--------------------------------------------------------------------------------

---[FILE: RefreshRouteOnSave.tsx]---
Location: payload-main/test/live-preview/app/live-preview/(pages)/ssr-autosave/[slug]/RefreshRouteOnSave.tsx
Signals: React, Next.js

```typescript
'use client'

import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation.js'
import React from 'react'

import { PAYLOAD_SERVER_URL } from '../../../_api/serverURL.js'

export const RefreshRouteOnSave: React.FC = () => {
  const router = useRouter()
  return <PayloadLivePreview refresh={() => router.refresh()} serverURL={PAYLOAD_SERVER_URL} />
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: payload-main/test/live-preview/app/live-preview/(pages)/static/page.tsx
Signals: React

```typescript
import { Gutter } from '@payloadcms/ui'

import React, { Fragment } from 'react'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function TestPage(args: Args) {
  return (
    <Fragment>
      <Gutter>
        <p>This is a static page for testing.</p>
      </Gutter>
    </Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: page.client.tsx]---
Location: payload-main/test/live-preview/app/live-preview/(pages)/[slug]/page.client.tsx
Signals: React

```typescript
'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'
import React from 'react'

import type { Page as PageType } from '../../../../payload-types.js'

import { localizedPageTitleID, renderedPageTitleID } from '../../../../shared.js'
import { PAYLOAD_SERVER_URL } from '../../_api/serverURL.js'
import { Blocks } from '../../_components/Blocks/index.js'
import { Gutter } from '../../_components/Gutter/index.js'
import { Hero } from '../../_components/Hero/index.js'

export const PageClient: React.FC<{
  page: PageType
}> = ({ page: initialPage }) => {
  const { data } = useLivePreview<PageType>({
    depth: 2,
    initialData: initialPage,
    serverURL: PAYLOAD_SERVER_URL,
  })

  return (
    <React.Fragment>
      <Hero {...data?.hero} />
      <Blocks
        blocks={[
          ...(data?.layout ?? []),
          {
            blockName: 'Relationships',
            blockType: 'relationships',
            data,
          },
        ]}
        disableTopPadding={
          !data?.hero || data?.hero?.type === 'none' || data?.hero?.type === 'lowImpact'
        }
      />
      <Gutter>
        <div id={renderedPageTitleID}>{`For Testing: ${data.title}`}</div>
        <div id={localizedPageTitleID}>
          {`For Testing (Localized): ${typeof data.relationToLocalized === 'string' ? data.relationToLocalized : data.relationToLocalized?.localizedTitle}`}
        </div>
      </Gutter>
    </React.Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: payload-main/test/live-preview/app/live-preview/(pages)/[slug]/page.tsx
Signals: React, Next.js

```typescript
/* eslint-disable no-restricted-exports */
import { notFound } from 'next/navigation.js'
import React from 'react'

import type { Page } from '../../../../payload-types.js'

import { getDoc } from '../../_api/getDoc.js'
import { getDocs } from '../../_api/getDocs.js'
import { PageClient } from './page.client.js'

type Args = {
  params: Promise<{ slug?: string }>
}
export default async function Page({ params: paramsPromise }: Args) {
  const { slug = 'home' } = await paramsPromise
  let page: null | Page = null

  try {
    page = await getDoc<Page>({
      slug,
      collection: 'pages',
    })
  } catch (error) {
    console.error(error) // eslint-disable-line no-console
  }

  if (!page) {
    return notFound()
  }

  return <PageClient page={page} />
}

export async function generateStaticParams() {
  process.env.PAYLOAD_DROP_DATABASE = 'false'

  try {
    const pages = await getDocs<Page>('pages')
    return pages?.map((page) => {
      return { slug: page.slug }
    })
  } catch (_err) {
    return []
  }
}
```

--------------------------------------------------------------------------------

---[FILE: getDoc.ts]---
Location: payload-main/test/live-preview/app/live-preview/_api/getDoc.ts

```typescript
import type { CollectionSlug, Where } from 'payload'

import config from '@payload-config'
import { getPayload } from 'payload'

export const getDoc = async <T>(args: {
  collection: CollectionSlug
  depth?: number
  draft?: boolean
  slug?: string
}): Promise<T> => {
  const payload = await getPayload({ config })
  const { slug, collection, depth = 2, draft } = args || {}

  const where: Where = {}

  if (slug) {
    where.slug = {
      equals: slug,
    }
  }

  try {
    const { docs } = await payload.find({
      collection,
      depth,
      where,
      draft,
      trash: true, // Include trashed documents
    })

    if (docs[0]) {
      return docs[0] as T
    }
  } catch (err: Error | any) {
    throw new Error(`Error getting doc: ${err.message}`)
  }

  throw new Error('No doc found')
}
```

--------------------------------------------------------------------------------

---[FILE: getDocs.ts]---
Location: payload-main/test/live-preview/app/live-preview/_api/getDocs.ts

```typescript
import config from '@payload-config'
import { type CollectionSlug, getPayload } from 'payload'

export const getDocs = async <T>(collection: CollectionSlug): Promise<T[]> => {
  const payload = await getPayload({ config })

  try {
    const { docs } = await payload.find({
      collection,
      depth: 0,
      limit: 100,
    })

    if (docs) {
      return docs as T[]
    }
  } catch (err) {
    throw new Error(`Error getting docs: ${err.message}`)
  }

  throw new Error('No docs found')
}
```

--------------------------------------------------------------------------------

---[FILE: getFooter.ts]---
Location: payload-main/test/live-preview/app/live-preview/_api/getFooter.ts

```typescript
import config from '@payload-config'
import { getPayload } from 'payload'

import type { Footer } from '../../../payload-types.js'

export async function getFooter(): Promise<Footer> {
  const payload = await getPayload({ config })

  try {
    const footer = await payload.findGlobal({
      slug: 'footer',
    })

    return footer
  } catch (err) {
    console.error(err)
  }

  throw new Error('Error getting footer.')
}
```

--------------------------------------------------------------------------------

---[FILE: getHeader.ts]---
Location: payload-main/test/live-preview/app/live-preview/_api/getHeader.ts

```typescript
import config from '@payload-config'
import { getPayload } from 'payload'

import type { Header } from '../../../payload-types.js'

export async function getHeader(): Promise<Header> {
  const payload = await getPayload({ config })

  try {
    const header = await payload.findGlobal({
      slug: 'header',
    })

    return header
  } catch (err) {
    console.error(err)
  }

  throw new Error('Error getting header.')
}
```

--------------------------------------------------------------------------------

---[FILE: serverURL.ts]---
Location: payload-main/test/live-preview/app/live-preview/_api/serverURL.ts

```typescript
export const PAYLOAD_SERVER_URL = 'http://localhost:3000'
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/test/live-preview/app/live-preview/_blocks/ArchiveBlock/index.module.scss

```text
@import '../../_css/common';

.archiveBlock {
  position: relative;
}

.introContent {
  margin-bottom: calc(var(--base) * 2);

  @include mid-break {
    margin-bottom: calc(var(--base) * 2);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/live-preview/app/live-preview/_blocks/ArchiveBlock/index.tsx
Signals: React

```typescript
import React from 'react'

import type { ArchiveBlockProps } from './types.js'

import { CollectionArchive } from '../../_components/CollectionArchive/index.js'
import { Gutter } from '../../_components/Gutter/index.js'
import RichText from '../../_components/RichText/index.js'
import classes from './index.module.scss'

export const ArchiveBlock: React.FC<
  {
    id?: string
  } & ArchiveBlockProps
> = (props) => {
  const {
    id,
    categories,
    introContent,
    limit,
    populateBy,
    populatedDocs,
    populatedDocsTotal,
    relationTo,
    selectedDocs,
  } = props

  return (
    <div className={classes.archiveBlock} id={`block-${id}`}>
      {introContent && (
        <Gutter className={classes.introContent}>
          <RichText content={introContent} />
        </Gutter>
      )}
      <CollectionArchive
        categories={categories}
        limit={limit}
        populateBy={populateBy}
        populatedDocs={populatedDocs}
        populatedDocsTotal={populatedDocsTotal}
        relationTo={relationTo}
        selectedDocs={selectedDocs}
        sort="-publishedDate"
      />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/test/live-preview/app/live-preview/_blocks/ArchiveBlock/types.ts

```typescript
import type { Page } from '../../../../payload-types.js'

export type ArchiveBlockProps = Extract<
  Exclude<Page['layout'], undefined>[0],
  { blockType: 'archive' }
>
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/test/live-preview/app/live-preview/_blocks/CallToAction/index.module.scss

```text
@use '../../_css/queries.scss' as *;

$spacer-h: calc(var(--block-padding) / 2);

.callToAction {
  padding-left: $spacer-h;
  padding-right: $spacer-h;
  position: relative;
  background-color: var(--color-base-100);
  color: var(--color-base-1000);
}

.invert {
  background-color: var(--color-base-1000);
  color: var(--color-base-0);
}

.wrap {
  display: flex;
  gap: $spacer-h;
  align-items: center;

  @include mid-break {
    flex-direction: column;
    align-items: flex-start;
  }
}

.content {
  flex-grow: 1;
}

.linkGroup {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  flex-shrink: 0;

  > * {
    margin-bottom: calc(var(--base) / 2);

    &:last-child {
      margin-bottom: 0;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/live-preview/app/live-preview/_blocks/CallToAction/index.tsx
Signals: React

```typescript
import React from 'react'

import type { Page } from '../../../../payload-types.js'

import { Gutter } from '../../_components/Gutter/index.js'
import { CMSLink } from '../../_components/Link/index.js'
import RichText from '../../_components/RichText/index.js'
import { VerticalPadding } from '../../_components/VerticalPadding/index.js'
import classes from './index.module.scss'

type Props = Extract<Exclude<Page['layout'], undefined>[0], { blockType: 'cta' }>

export const CallToActionBlock: React.FC<
  {
    id?: string
  } & Props
> = ({ invertBackground, links, richText }) => {
  return (
    <Gutter>
      <VerticalPadding
        className={[classes.callToAction, invertBackground && classes.invert]
          .filter(Boolean)
          .join(' ')}
      >
        <div className={classes.wrap}>
          <div className={classes.content}>
            <RichText className={classes.richText} content={richText} />
          </div>
          <div className={classes.linkGroup}>
            {(links || []).map(({ link }, i) => {
              return <CMSLink key={i} {...link} invert={invertBackground} />
            })}
          </div>
        </div>
      </VerticalPadding>
    </Gutter>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/test/live-preview/app/live-preview/_blocks/Content/index.module.scss

```text
@import '../../_css/common';

.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--base) calc(var(--base) * 2);

  @include mid-break {
    grid-template-columns: repeat(6, 1fr);
    gap: var(--base) var(--base);
  }
}

.column--oneThird {
  grid-column-end: span 4;
}

.column--half {
  grid-column-end: span 6;
}

.column--twoThirds {
  grid-column-end: span 8;
}

.column--full {
  grid-column-end: span 12;
}

.column {
  @include mid-break {
    grid-column-end: span 6;
  }

  @include small-break {
    grid-column-end: span 6;
  }
}

.link {
  margin-top: var(--base);
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/live-preview/app/live-preview/_blocks/Content/index.tsx
Signals: React

```typescript
import React, { Fragment } from 'react'

import type { Page } from '../../../../payload-types.js'

import { Gutter } from '../../_components/Gutter/index.js'
import { CMSLink } from '../../_components/Link/index.js'
import RichText from '../../_components/RichText/index.js'
import classes from './index.module.scss'

type Props = Extract<Exclude<Page['layout'], undefined>[0], { blockType: 'content' }>

export const ContentBlock: React.FC<
  {
    id?: string
  } & Props
> = (props) => {
  const { columns } = props

  return (
    <Gutter className={classes.content}>
      <div className={classes.grid}>
        {columns && columns.length > 0 ? (
          <Fragment>
            {columns.map((col, index) => {
              const { enableLink, link, richText, size } = col

              return (
                <div className={[classes.column, classes[`column--${size}`]].join(' ')} key={index}>
                  <RichText content={richText} />
                  {enableLink && <CMSLink className={classes.link} {...link} />}
                </div>
              )
            })}
          </Fragment>
        ) : null}
      </div>
    </Gutter>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/test/live-preview/app/live-preview/_blocks/MediaBlock/index.module.scss

```text
.mediaBlock {
  position: relative;
}

.caption {
  color: var(--color-base-500);
  margin-top: var(--base);
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/live-preview/app/live-preview/_blocks/MediaBlock/index.tsx
Signals: React, Next.js

```typescript
import type { StaticImageData } from 'next/image.js'

import React from 'react'

import type { Page } from '../../../../payload-types.js'

import { Gutter } from '../../_components/Gutter/index.js'
import { Media } from '../../_components/Media/index.js'
import RichText from '../../_components/RichText/index.js'
import classes from './index.module.scss'

type Props = {
  id?: string
  staticImage?: StaticImageData
} & Extract<Exclude<Page['layout'], undefined>[0], { blockType: 'mediaBlock' }>

export const MediaBlock: React.FC<Props> = (props) => {
  const { media, position = 'default', staticImage } = props

  let caption
  if (media && typeof media === 'object') caption = media.caption

  return (
    <div className={classes.mediaBlock}>
      {position === 'fullscreen' && (
        <div className={classes.fullscreen}>
          <Media resource={media} src={staticImage} />
        </div>
      )}
      {position === 'default' && (
        <Gutter>
          <Media resource={media} src={staticImage} />
        </Gutter>
      )}
      {caption && (
        <Gutter className={classes.caption}>
          <RichText content={caption} />
        </Gutter>
      )}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/test/live-preview/app/live-preview/_blocks/RelatedPosts/index.module.scss

```text
@import '../../_css/common';

.introContent {
  position: relative;
  margin-bottom: calc(var(--base) * 2);

  @include mid-break {
    margin-bottom: var(--base);
  }
}

.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  width: 100%;
  gap: var(--base) 40px;

  @include mid-break {
    grid-template-columns: repeat(6, 1fr);
    gap: calc(var(--base) / 2) var(--base);
  }
}

.column {
  grid-column-end: span 12;

  @include mid-break {
    grid-column-end: span 6;
  }

  @include small-break {
    grid-column-end: span 6;
  }
}

.cols-half {
  grid-column-end: span 6;

  @include mid-break {
    grid-column-end: span 6;
  }

  @include small-break {
    grid-column-end: span 6;
  }
}

.cols-thirds {
  grid-column-end: span 3;

  @include mid-break {
    grid-column-end: span 6;
  }

  @include small-break {
    grid-column-end: span 6;
  }
}
```

--------------------------------------------------------------------------------

````
