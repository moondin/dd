---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 580
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 580 of 695)

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

---[FILE: seed.ts]---
Location: payload-main/test/group-by/seed.ts

```typescript
import type { Payload } from 'payload'

import { devUser } from '../credentials.js'
import { executePromises } from '../helpers/executePromises.js'
import { seedDB } from '../helpers/seed.js'
import { categoriesSlug } from './collections/Categories/index.js'
import { pagesSlug } from './collections/Pages/index.js'
import { postsSlug } from './collections/Posts/index.js'
import { relationshipsSlug } from './collections/Relationships/index.js'

export const seed = async (_payload: Payload) => {
  await executePromises(
    [
      () =>
        _payload.create({
          collection: 'users',
          data: {
            email: devUser.email,
            password: devUser.password,
          },
          depth: 0,
          overrideAccess: true,
        }),
      async () => {
        const [category1, category2] = await Promise.all([
          _payload.create({
            collection: categoriesSlug,
            data: {
              title: 'Category 1',
            },
          }),
          _payload.create({
            collection: categoriesSlug,
            data: {
              title: 'Category 2',
            },
          }),
        ])

        // Create 30 pages, one for each post
        const pages = await Promise.all(
          Array.from({ length: 30 }).map(async (_, index) =>
            _payload.create({
              collection: pagesSlug,
              data: {
                title: `Page ${index + 1}`,
              },
            }),
          ),
        )

        await Promise.all(
          Array.from({ length: 30 }).map(async (_, index) =>
            _payload.create({
              collection: postsSlug,
              data: {
                category: index < 15 ? category1.id : category2.id,
                page: pages[index]!.id,
                title: `Post ${index + 1}`,
              },
            }),
          ),
        )

        await _payload.create({
          collection: 'posts',
          data: {
            category: category1.id,
            title: 'Find me',
          },
        })

        await _payload.create({
          collection: 'posts',
          data: {
            category: category2.id,
            title: 'Find me',
          },
        })

        // Get the first post for polymorphic relationships
        const firstPost = await _payload.find({
          collection: postsSlug,
          limit: 1,
        })

        // Create relationship test documents
        await Promise.all([
          // Document with PolyHasOneRelationship to category
          _payload.create({
            collection: relationshipsSlug,
            data: {
              PolyHasOneRelationship: {
                relationTo: categoriesSlug,
                value: category1.id,
              },
              title: 'Poly HasOne (Category)',
            },
          }),

          // Document with PolyHasOneRelationship to post
          _payload.create({
            collection: relationshipsSlug,
            data: {
              PolyHasOneRelationship: {
                relationTo: postsSlug,
                value: firstPost.docs[0]?.id ?? '',
              },
              title: 'Poly HasOne (Post)',
            },
          }),

          // Document with PolyHasManyRelationship to both categories and posts
          _payload.create({
            collection: relationshipsSlug,
            data: {
              PolyHasManyRelationship: [
                {
                  relationTo: categoriesSlug,
                  value: category1.id,
                },
                {
                  relationTo: postsSlug,
                  value: firstPost.docs[0]?.id ?? '',
                },
                {
                  relationTo: categoriesSlug,
                  value: category2.id,
                },
              ],
              title: 'Poly HasMany (Mixed)',
            },
          }),

          // Document with MonoHasOneRelationship
          _payload.create({
            collection: relationshipsSlug,
            data: {
              MonoHasOneRelationship: category1.id,
              title: 'Mono HasOne',
            },
          }),

          // Document with MonoHasManyRelationship
          _payload.create({
            collection: relationshipsSlug,
            data: {
              MonoHasManyRelationship: [category1.id, category2.id],
              title: 'Mono HasMany',
            },
          }),

          // Documents with no relationships (for "No Value" testing)
          _payload.create({
            collection: relationshipsSlug,
            data: {
              title: 'No Relationships 1',
            },
          }),

          _payload.create({
            collection: relationshipsSlug,
            data: {
              title: 'No Relationships 2',
            },
          }),
        ])
      },
    ],
    false,
  )
}

export async function clearAndSeedEverything(_payload: Payload) {
  return await seedDB({
    _payload,
    collectionSlugs: [postsSlug, categoriesSlug, pagesSlug, relationshipsSlug, 'users', 'media'],
    seedFunction: seed,
    snapshotKey: 'groupByTests',
    // uploadsDir: path.resolve(dirname, './collections/Upload/uploads'),
  })
}
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.eslint.json]---
Location: payload-main/test/group-by/tsconfig.eslint.json

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
Location: payload-main/test/group-by/tsconfig.json

```json
{
  "extends": "../tsconfig.json"
}
```

--------------------------------------------------------------------------------

---[FILE: types.d.ts]---
Location: payload-main/test/group-by/types.d.ts

```typescript
import type { RequestContext as OriginalRequestContext } from 'payload'

declare module 'payload' {
  // Create a new interface that merges your additional fields with the original one
  export interface RequestContext extends OriginalRequestContext {
    myObject?: string
    // ...
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/group-by/collections/Categories/index.ts

```typescript
import type { CollectionConfig } from 'payload'

export const categoriesSlug = 'categories'

export const CategoriesCollection: CollectionConfig = {
  slug: categoriesSlug,
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/group-by/collections/Media/index.ts

```typescript
import type { CollectionConfig } from 'payload'

export const mediaSlug = 'media'

export const MediaCollection: CollectionConfig = {
  slug: mediaSlug,
  access: {
    create: () => true,
    read: () => true,
  },
  fields: [],
  upload: {
    crop: true,
    focalPoint: true,
    imageSizes: [
      {
        name: 'thumbnail',
        height: 200,
        width: 200,
      },
      {
        name: 'medium',
        height: 800,
        width: 800,
      },
      {
        name: 'large',
        height: 1200,
        width: 1200,
      },
    ],
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/group-by/collections/Pages/index.ts

```typescript
import type { CollectionConfig } from 'payload'

export const pagesSlug = 'pages'

export const PagesCollection: CollectionConfig = {
  slug: pagesSlug,
  admin: {
    useAsTitle: 'title',
    groupBy: true,
  },
  trash: true,
  fields: [
    {
      name: 'title',
      type: 'text',
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/group-by/collections/Posts/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { categoriesSlug } from '../Categories/index.js'

export const postsSlug = 'posts'

export const PostsCollection: CollectionConfig = {
  slug: postsSlug,
  admin: {
    useAsTitle: 'title',
    groupBy: true,
    defaultColumns: ['title', 'category', 'createdAt', 'updatedAt'],
  },
  enableQueryPresets: true,
  trash: true,
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: categoriesSlug,
    },
    {
      name: 'virtualTitleFromCategory',
      type: 'text',
      virtual: 'category.title',
      admin: {
        disableGroupBy: true,
      },
    },
    {
      name: 'page',
      type: 'relationship',
      relationTo: 'pages',
    },
    {
      name: 'virtualTitleFromPage',
      type: 'text',
      virtual: 'page.title',
    },
    {
      name: 'checkbox',
      type: 'checkbox',
    },
    {
      name: 'date',
      type: 'date',
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Tab 1',
          fields: [
            {
              name: 'tab1Field',
              type: 'text',
            },
          ],
        },
      ],
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/group-by/collections/Relationships/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { categoriesSlug } from '../Categories/index.js'
import { postsSlug } from '../Posts/index.js'

export const relationshipsSlug = 'relationships'

export const RelationshipsCollection: CollectionConfig = {
  slug: relationshipsSlug,
  admin: {
    useAsTitle: 'title',
    groupBy: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'PolyHasOneRelationship',
      type: 'relationship',
      relationTo: [categoriesSlug, postsSlug],
    },
    {
      name: 'PolyHasManyRelationship',
      type: 'relationship',
      relationTo: [categoriesSlug, postsSlug],
      hasMany: true,
    },
    {
      name: 'MonoHasOneRelationship',
      type: 'relationship',
      relationTo: categoriesSlug,
    },
    {
      name: 'MonoHasManyRelationship',
      type: 'relationship',
      relationTo: categoriesSlug,
      hasMany: true,
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: adminUrlUtil.ts]---
Location: payload-main/test/helpers/adminUrlUtil.ts

```typescript
import type { Config } from 'payload'

// IMPORTANT: ensure that imports do not contain React components, etc. as this breaks Playwright tests
// Instead of pointing to the bundled code, which will include React components, use direct import paths
import { formatAdminURL } from '../../packages/ui/src/utilities/formatAdminURL.js' // eslint-disable-line payload/no-relative-monorepo-imports

export class AdminUrlUtil {
  account: string

  admin: string

  byFolder: string

  create: string

  entitySlug: string

  list: string

  login: string

  logout: string

  routes: Config['routes']

  serverURL: string

  trash: string

  constructor(serverURL: string, slug: string, routes?: Config['routes']) {
    this.routes = {
      admin: routes?.admin || '/admin',
    }

    this.serverURL = serverURL

    this.entitySlug = slug

    this.admin = formatAdminURL({
      adminRoute: this.routes.admin,
      path: '',
      serverURL: this.serverURL,
    })

    this.account = formatAdminURL({
      adminRoute: this.routes.admin,
      path: '/account',
      serverURL: this.serverURL,
    })

    this.login = formatAdminURL({
      adminRoute: this.routes.admin,
      path: '/login',
      serverURL: this.serverURL,
    })

    this.logout = formatAdminURL({
      adminRoute: this.routes.admin,
      path: '/logout',
      serverURL: this.serverURL,
    })

    this.list = formatAdminURL({
      adminRoute: this.routes.admin,
      path: `/collections/${this.entitySlug}`,
      serverURL: this.serverURL,
    })

    this.create = formatAdminURL({
      adminRoute: this.routes.admin,
      path: `/collections/${this.entitySlug}/create`,
      serverURL: this.serverURL,
    })

    this.byFolder = formatAdminURL({
      adminRoute: this.routes.admin,
      path: `/collections/${this.entitySlug}/payload-folders`,
      serverURL: this.serverURL,
    })

    this.trash = formatAdminURL({
      adminRoute: this.routes.admin,
      path: `/collections/${this.entitySlug}/trash`,
      serverURL: this.serverURL,
    })
  }

  collection(slug: string): string {
    return formatAdminURL({
      adminRoute: this.routes?.admin,
      path: `/collections/${slug}`,
      serverURL: this.serverURL,
    })
  }

  edit(id: number | string): string {
    return `${this.list}/${id}`
  }

  global(slug: string): string {
    return formatAdminURL({
      adminRoute: this.routes?.admin,
      path: `/globals/${slug}`,
      serverURL: this.serverURL,
    })
  }

  trashEdit(id: number | string): string {
    return `${this.trash}/${id}`
  }
}
```

--------------------------------------------------------------------------------

---[FILE: assertToastErrors.ts]---
Location: payload-main/test/helpers/assertToastErrors.ts

```typescript
import type { Page } from '@playwright/test'

import { expect } from '@playwright/test'

export async function assertToastErrors({
  page,
  errors,
  dismissAfterAssertion,
}: {
  dismissAfterAssertion?: boolean
  errors: string[]
  page: Page
}): Promise<void> {
  const isSingleError = errors.length === 1
  const message = isSingleError
    ? 'The following field is invalid: '
    : `The following fields are invalid (${errors.length}):`

  // Check the intro message text
  await expect(page.locator('.payload-toast-container')).toContainText(message)

  // Check single error
  if (isSingleError) {
    await expect(page.locator('.payload-toast-container [data-testid="field-error"]')).toHaveText(
      errors[0]!,
    )
  } else {
    // Check multiple errors
    const errorItems = page.locator('.payload-toast-container [data-testid="field-errors"] li')
    for (let i = 0; i < errors.length; i++) {
      await expect(errorItems.nth(i)).toHaveText(errors[i]!)
    }
  }

  if (dismissAfterAssertion) {
    const closeButtons = page.locator('.payload-toast-container button.payload-toast-close-button')
    const count = await closeButtons.count()

    for (let i = 0; i < count; i++) {
      await closeButtons.nth(i).click()
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: bootAdminPanel.mjs]---
Location: payload-main/test/helpers/bootAdminPanel.mjs

```text
import { createServer } from 'http'
import next from 'next'
import { parse } from 'url'

const actualNext = 'default' in next ? next.default : next
export const bootAdminPanel = async ({ port = 3000, appDir }) => {
  const serverURL = `http://localhost:${port}`
  const app = actualNext({
    dev: true,
    hostname: 'localhost',
    port,
    dir: appDir,
  })

  const handle = app.getRequestHandler()
  await app.prepare()

  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on ${serverURL}`)
    })
}
```

--------------------------------------------------------------------------------

---[FILE: build.js]---
Location: payload-main/test/helpers/build.js
Signals: Next.js

```javascript
import nextBuild from 'next/dist/build/index.js'

const build = async () => {
  await nextBuild.default(process.env.NEXTJS_DIR, false, false, false, true, true, false, 'compile')
}

build()
```

--------------------------------------------------------------------------------

---[FILE: executePromises.ts]---
Location: payload-main/test/helpers/executePromises.ts

```typescript
/**
 * Allows for easy toggling between resolving promises sequentially vs in parallel
 */
export async function executePromises<T extends Array<() => Promise<any>>>(
  promiseFns: T,
  parallel?: boolean,
): Promise<{ [K in keyof T]: Awaited<ReturnType<T[K]>> }> {
  if (parallel) {
    // Parallel execution with Promise.all and maintain proper typing
    return Promise.all(promiseFns.map((promiseFn) => promiseFn())) as Promise<{
      [K in keyof T]: Awaited<ReturnType<T[K]>>
    }>
  } else {
    // Sequential execution while maintaining types
    const results: Awaited<ReturnType<T[number]>>[] = []
    for (const promiseFn of promiseFns) {
      results.push(await promiseFn())
    }
    return results as unknown as Promise<{ [K in keyof T]: Awaited<ReturnType<T[K]>> }>
  }
}
```

--------------------------------------------------------------------------------

---[FILE: getFormDataSize.ts]---
Location: payload-main/test/helpers/getFormDataSize.ts

```typescript
export function getFormDataSize(formData: FormData) {
  const blob = new Blob(formDataToArray(formData))
  return blob.size
}

function formDataToArray(formData: FormData) {
  const parts = []
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      parts.push(value)
    } else {
      parts.push(new Blob([value], { type: 'text/plain' }))
    }
  }
  return parts
}
```

--------------------------------------------------------------------------------

---[FILE: getNextRootDir.ts]---
Location: payload-main/test/helpers/getNextRootDir.ts

```typescript
import fs from 'fs'
import path, { resolve } from 'path'
import { fileURLToPath } from 'url'

import { adminRoute as rootAdminRoute } from '../admin-root/shared.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * The root directory for e2e tests is either the monorepo root (normal e2e) or the test directory (test e2e).
 */
export function getNextRootDir(testSuite?: string) {
  let adminRoute = '/admin'

  /*
   * Handle test suites that have their own app directory
   */
  if (testSuite) {
    const testSuiteDir = resolve(dirname, `../${testSuite}`)

    let hasNextConfig = false

    try {
      fs.accessSync(`${testSuiteDir}/next.config.mjs`, fs.constants.F_OK)
      hasNextConfig = true
    } catch (err) {
      // Swallow err - no config found
    }

    if (testSuite === 'admin-root') {
      adminRoute = rootAdminRoute
    }

    if (hasNextConfig) {
      let rootDir = testSuiteDir
      if (process.env.PAYLOAD_TEST_PROD === 'true') {
        // If in prod mode, there may be a testSuite/prod folder. If so, use that as the rootDir
        const prodDir = resolve(testSuiteDir, 'prod')
        try {
          fs.accessSync(prodDir, fs.constants.F_OK)
          rootDir = prodDir
        } catch (err) {
          // Swallow err - no prod folder
        }
      }
      return {
        rootDir,
        adminRoute,
      }
    }
  }

  /*
   * Handle normal cases
   */
  if (process.env.PAYLOAD_TEST_PROD === 'true') {
    return {
      rootDir: path.resolve(dirname, '..'),
      adminRoute,
    }
  }

  return {
    rootDir: path.resolve(dirname, '..', '..'),
    adminRoute,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: getSDK.ts]---
Location: payload-main/test/helpers/getSDK.ts

```typescript
import type { GeneratedTypes, SanitizedConfig } from 'payload'

import { REST_DELETE, REST_GET, REST_PATCH, REST_POST, REST_PUT } from '@payloadcms/next/routes'
import { PayloadSDK } from '@payloadcms/sdk'

export type TypedPayloadSDK = PayloadSDK<GeneratedTypes>

/**
 * SDK with a custom fetch to run the routes directly without an HTTP server.
 */
export const getSDK = (config: SanitizedConfig) => {
  const api = {
    GET: REST_GET(config),
    POST: REST_POST(config),
    PATCH: REST_PATCH(config),
    DELETE: REST_DELETE(config),
    PUT: REST_PUT(config),
  }

  return new PayloadSDK<GeneratedTypes>({
    baseURL: ``,
    fetch: (path: string, init: RequestInit) => {
      const [slugs, search] = path.slice(1).split('?')
      const url = `${config.serverURL || 'http://localhost:3000'}${config.routes.api}/${slugs}${search ? `?${search}` : ''}`

      if (init.body instanceof FormData) {
        const file = init.body.get('file') as Blob
        if (file && init.headers instanceof Headers) {
          init.headers.set('Content-Length', file.size.toString())
        }
      }
      const request = new Request(url, init)

      const params = {
        params: Promise.resolve({
          slug: slugs.split('/'),
        }),
      }

      return api[init.method.toUpperCase()](request, params)
    },
  })
}
```

--------------------------------------------------------------------------------

---[FILE: idToString.ts]---
Location: payload-main/test/helpers/idToString.ts

```typescript
import type { Payload } from 'payload'

export const idToString = (id: number | string, payload: Payload): string =>
  `${payload.db.defaultIDType === 'number' ? id : `"${id}"`}`
```

--------------------------------------------------------------------------------

---[FILE: initPayloadE2ENoConfig.ts]---
Location: payload-main/test/helpers/initPayloadE2ENoConfig.ts

```typescript
import { spawn } from 'node:child_process'
import path, { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

import type { GeneratedTypes } from './sdk/types.js'

import { getNextRootDir } from './getNextRootDir.js'
import { PayloadTestSDK } from './sdk/index.js'

const _filename = fileURLToPath(import.meta.url)
const _dirname = dirname(_filename)

type Args = {
  dirname: string
  prebuild?: boolean
}

type Result<T extends GeneratedTypes<T>> = {
  payload: PayloadTestSDK<T>
  serverURL: string
}

export async function initPayloadE2ENoConfig<T extends GeneratedTypes<T>>({
  dirname,
  prebuild,
}: Args): Promise<Result<T>> {
  const testSuiteName = path.basename(dirname)

  const port = 3000
  process.env.PORT = String(port)
  process.env.PAYLOAD_CI_DEPENDENCY_CHECKER = 'true'

  const serverURL = `http://localhost:${port}`

  const { rootDir } = getNextRootDir(testSuiteName)

  if (prebuild) {
    await new Promise<void>((res, rej) => {
      const buildArgs = ['--max-old-space-size=8192', resolve(_dirname, 'build.js')]

      const childProcess = spawn('node', buildArgs, {
        stdio: 'inherit',
        env: {
          PATH: process.env.PATH,
          NODE_ENV: 'production',
          NEXTJS_DIR: rootDir,
        },
      })

      childProcess.on('close', (code) => {
        if (code === 0) {
          res()
        }
        rej()
      })
    })
  }

  process.env.NODE_OPTIONS = '--max-old-space-size=8192 --no-deprecation'

  return {
    serverURL,
    payload: new PayloadTestSDK<T>({ serverURL }),
  }
}
```

--------------------------------------------------------------------------------

---[FILE: initPayloadInt.ts]---
Location: payload-main/test/helpers/initPayloadInt.ts

```typescript
import type { PayloadSDK } from '@payloadcms/sdk'
import type { GeneratedTypes, Payload, SanitizedConfig } from 'payload'

import path from 'path'
import { getPayload } from 'payload'

import { runInit } from '../runInit.js'
import { getSDK } from './getSDK.js'
import { NextRESTClient } from './NextRESTClient.js'

/**
 * Initialize Payload configured for integration tests
 */
export async function initPayloadInt<TInitializePayload extends boolean | undefined = true>(
  dirname: string,
  testSuiteNameOverride?: string,
  initializePayload?: TInitializePayload,
  configFile?: string,
): Promise<
  TInitializePayload extends false
    ? { config: SanitizedConfig }
    : {
        config: SanitizedConfig
        payload: Payload
        restClient: NextRESTClient
        sdk: PayloadSDK<GeneratedTypes>
      }
> {
  const testSuiteName = testSuiteNameOverride ?? path.basename(dirname)
  await runInit(testSuiteName, false, true, configFile)
  console.log('importing config', path.resolve(dirname, configFile ?? 'config.ts'))
  const { default: config } = await import(path.resolve(dirname, configFile ?? 'config.ts'))

  if (initializePayload === false) {
    return { config: await config } as any
  }

  console.log('starting payload')

  const payload = await getPayload({ config, cron: true })
  console.log('initializing rest client')
  const restClient = new NextRESTClient(payload.config)
  console.log('initPayloadInt done')
  const sdk = getSDK(payload.config)
  return { config: payload.config, sdk, payload, restClient } as any
}
```

--------------------------------------------------------------------------------

---[FILE: isErrorWithCode.ts]---
Location: payload-main/test/helpers/isErrorWithCode.ts

```typescript
export function isErrorWithCode(err: unknown, code?: string): err is NodeJS.ErrnoException {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    typeof (err as any).code === 'string' &&
    (!code || (err as NodeJS.ErrnoException).code === code)
  )
}
```

--------------------------------------------------------------------------------

---[FILE: isMongoose.ts]---
Location: payload-main/test/helpers/isMongoose.ts

```typescript
import type { Payload } from 'payload'

export const mongooseList = ['cosmosdb', 'documentdb', 'firestore', 'mongodb']

export function isMongoose(_payload?: Payload) {
  return _payload?.db?.name === 'mongoose' || mongooseList.includes(process.env.PAYLOAD_DATABASE)
}
```

--------------------------------------------------------------------------------

---[FILE: NextRESTClient.ts]---
Location: payload-main/test/helpers/NextRESTClient.ts

```typescript
import type { JoinQuery, PopulateType, SanitizedConfig, SelectType, Where } from 'payload'
import type { ParsedQs } from 'qs-esm'

import {
  REST_DELETE as createDELETE,
  REST_GET as createGET,
  GRAPHQL_POST as createGraphqlPOST,
  REST_PATCH as createPATCH,
  REST_POST as createPOST,
  REST_PUT as createPUT,
} from '@payloadcms/next/routes'
import * as qs from 'qs-esm'

import { devUser } from '../credentials.js'
import { getFormDataSize } from './getFormDataSize.js'

type ValidPath = `/${string}`
type RequestOptions = {
  auth?: boolean
  query?: { [key: string]: unknown } & {
    depth?: number
    fallbackLocale?: string | string[]
    joins?: JoinQuery
    limit?: number
    locale?: string
    page?: number
    populate?: PopulateType
    select?: SelectType
    sort?: string
    where?: Where
  }
}

type FileArg = {
  file?: Omit<File, 'webkitRelativePath'>
}

function generateQueryString(query: RequestOptions['query'], params: ParsedQs): string {
  return qs.stringify(
    {
      ...(params || {}),
      ...(query || {}),
    },
    {
      addQueryPrefix: true,
    },
  )
}

export class NextRESTClient {
  private _DELETE: (
    request: Request,
    args: { params: Promise<{ slug: string[] }> },
  ) => Promise<Response>

  private _GET: (
    request: Request,
    args: { params: Promise<{ slug: string[] }> },
  ) => Promise<Response>

  private _GRAPHQL_POST: (request: Request) => Promise<Response>

  private _PATCH: (
    request: Request,
    args: { params: Promise<{ slug: string[] }> },
  ) => Promise<Response>

  private _POST: (
    request: Request,
    args: { params: Promise<{ slug: string[] }> },
  ) => Promise<Response>

  private _PUT: (
    request: Request,
    args: { params: Promise<{ slug: string[] }> },
  ) => Promise<Response>

  private readonly config: SanitizedConfig

  private token: string

  serverURL: string = 'http://localhost:3000'

  constructor(config: SanitizedConfig) {
    this.config = config
    if (config?.serverURL) {
      this.serverURL = config.serverURL
    }
    this._GET = createGET(config)
    this._POST = createPOST(config)
    this._DELETE = createDELETE(config)
    this._PATCH = createPATCH(config)
    this._PUT = createPUT(config)
    this._GRAPHQL_POST = createGraphqlPOST(config)
  }

  private buildHeaders(options: FileArg & RequestInit & RequestOptions): Headers {
    // Only set `Content-Type` to `application/json` if body is not `FormData`
    const isFormData =
      options &&
      typeof options.body !== 'undefined' &&
      typeof FormData !== 'undefined' &&
      options.body instanceof FormData

    const headers = new Headers(options.headers || {})

    if (options?.file) {
      headers.set('Content-Length', options.file.size.toString())
    }

    if (isFormData) {
      headers.set('Content-Length', getFormDataSize(options.body as FormData).toString())
    }

    if (!isFormData && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }

    if (options.auth !== false && this.token) {
      headers.set('Authorization', `JWT ${this.token}`)
    }
    if (options.auth === false) {
      headers.set('DisableAutologin', 'true')
    }

    return headers
  }

  private generateRequestParts(path: ValidPath): {
    params?: ParsedQs
    slug: string[]
    url: string
  } {
    const [slugs, params] = path.slice(1).split('?')
    const url = `${this.serverURL}${this.config.routes.api}/${slugs}`

    return {
      slug: slugs.split('/'),
      params: params ? qs.parse(params) : undefined,
      url,
    }
  }

  async DELETE(path: ValidPath, options: RequestInit & RequestOptions = {}): Promise<Response> {
    const { slug, params, url } = this.generateRequestParts(path)
    const { query, ...rest } = options || {}
    const queryParams = generateQueryString(query, params)

    const request = new Request(`${url}${queryParams}`, {
      ...rest,
      headers: this.buildHeaders(options),
      method: 'DELETE',
    })
    return this._DELETE(request, { params: Promise.resolve({ slug }) })
  }

  async GET(
    path: ValidPath,
    options: Omit<RequestInit, 'body'> & RequestOptions = {},
  ): Promise<Response> {
    const { slug, params, url } = this.generateRequestParts(path)
    const { query, ...rest } = options || {}
    const queryParams = generateQueryString(query, params)

    const request = new Request(`${url}${queryParams}`, {
      ...rest,
      headers: this.buildHeaders(options),
      method: 'GET',
    })
    return this._GET(request, { params: Promise.resolve({ slug }) })
  }

  async GRAPHQL_POST(options: RequestInit & RequestOptions): Promise<Response> {
    const { query, ...rest } = options
    const queryParams = generateQueryString(query, {})
    const request = new Request(
      `${this.serverURL}${this.config.routes.api}${this.config.routes.graphQL}${queryParams}`,
      {
        ...rest,
        headers: this.buildHeaders(options),
        method: 'POST',
      },
    )
    return this._GRAPHQL_POST(request)
  }

  async login({
    slug,
    credentials,
  }: {
    credentials?: {
      email: string
      password: string
    }
    slug: string
  }): Promise<{ [key: string]: any }> {
    const response = await this.POST(`/${slug}/login`, {
      body: JSON.stringify(
        credentials ? { ...credentials } : { email: devUser.email, password: devUser.password },
      ),
    })
    const result = await response.json()

    this.token = result.token

    if (!result.token) {
      // If the token is not in the response body, then we can extract it from the cookies
      const setCookie = response.headers.get('Set-Cookie')
      const tokenMatchResult = setCookie?.match(/payload-token=(?<token>.+?);/)
      this.token = tokenMatchResult?.groups?.token
    }

    return result
  }

  async PATCH(path: ValidPath, options: FileArg & RequestInit & RequestOptions): Promise<Response> {
    const { slug, params, url } = this.generateRequestParts(path)
    const { query, ...rest } = options
    const queryParams = generateQueryString(query, params)

    const request = new Request(`${url}${queryParams}`, {
      ...rest,
      headers: this.buildHeaders(options),
      method: 'PATCH',
    })

    return this._PATCH(request, { params: Promise.resolve({ slug }) })
  }

  async POST(
    path: ValidPath,
    options: FileArg & RequestInit & RequestOptions = {},
  ): Promise<Response> {
    const { slug, params, url } = this.generateRequestParts(path)
    const queryParams = generateQueryString({}, params)
    const request = new Request(`${url}${queryParams}`, {
      ...options,
      headers: this.buildHeaders(options),
      method: 'POST',
    })
    return this._POST(request, { params: Promise.resolve({ slug }) })
  }

  async PUT(path: ValidPath, options: FileArg & RequestInit & RequestOptions): Promise<Response> {
    const { slug, params, url } = this.generateRequestParts(path)
    const { query, ...rest } = options
    const queryParams = generateQueryString(query, params)

    const request = new Request(`${url}${queryParams}`, {
      ...rest,
      headers: this.buildHeaders(options),
      method: 'PUT',
    })
    return this._PUT(request, { params: Promise.resolve({ slug }) })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: reInitEndpoint.ts]---
Location: payload-main/test/helpers/reInitEndpoint.ts

```typescript
import type { Endpoint, PayloadHandler } from 'payload'

import { status as httpStatus } from 'http-status'
import * as qs from 'qs-esm'

import { path } from './reInitializeDB.js'
import { seedDB } from './seed.js'

const handler: PayloadHandler = async (req) => {
  process.env.SEED_IN_CONFIG_ONINIT = 'true'
  const { payload } = req

  if (!req.url) {
    throw new Error('Request URL is required')
  }

  const query: {
    deleteOnly?: string
    snapshotKey?: string
    uploadsDir?: string | string[]
  } = qs.parse(req.url.split('?')[1] ?? '', {
    depth: 10,
    ignoreQueryPrefix: true,
  })

  try {
    await seedDB({
      _payload: payload,
      collectionSlugs: payload.config.collections.map(({ slug }) => slug),
      seedFunction: payload.config.onInit,
      snapshotKey: String(query.snapshotKey),
      // uploadsDir can be string or stringlist
      uploadsDir: query.uploadsDir as string | string[],
      // query value will be a string of 'true' or 'false'
      deleteOnly: query.deleteOnly === 'true',
    })

    return Response.json(
      {
        message: 'Database reset and onInit run successfully.',
      },
      {
        status: httpStatus.OK,
      },
    )
  } catch (err) {
    payload.logger.error(err)
    return Response.json(err, {
      status: httpStatus.BAD_REQUEST,
    })
  }
}

export const reInitEndpoint: Endpoint = {
  path,
  method: 'get',
  handler,
}
```

--------------------------------------------------------------------------------

---[FILE: reInitializeDB.ts]---
Location: payload-main/test/helpers/reInitializeDB.ts

```typescript
import * as qs from 'qs-esm'

export const path = '/re-initialize'

export const reInitializeDB = async ({
  serverURL,
  snapshotKey,
  uploadsDir,
  deleteOnly,
}: {
  deleteOnly?: boolean
  serverURL: string
  snapshotKey: string
  uploadsDir?: string | string[]
}) => {
  const maxAttempts = 50
  let attempt = 1
  const startTime = Date.now()

  while (attempt <= maxAttempts) {
    try {
      console.log(`Attempting to reinitialize DB (attempt ${attempt}/${maxAttempts})...`)

      const queryParams = qs.stringify(
        {
          snapshotKey,
          uploadsDir,
          deleteOnly,
        },
        {
          addQueryPrefix: true,
        },
      )

      const response = await fetch(`${serverURL}/api${path}${queryParams}`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const timeTaken = Date.now() - startTime
      console.log(`Successfully reinitialized DB (took ${timeTaken}ms)`)
      return
    } catch (error) {
      console.error(`Failed to reinitialize DB`, error)

      if (attempt === maxAttempts) {
        console.error('Max retry attempts reached. Giving up.')
        throw error
      }

      console.log('Retrying in 3 seconds...')
      await new Promise((resolve) => setTimeout(resolve, 3000))
      attempt++
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: removeFiles.ts]---
Location: payload-main/test/helpers/removeFiles.ts

```typescript
import fs from 'fs'

const removeFiles = (dir) => {
  if (!fs.existsSync(dir)) return

  fs.readdirSync(dir).forEach((f) => {
    return fs.rmSync(`${dir}/${f}`, { recursive: true })
  })
}

export default removeFiles
```

--------------------------------------------------------------------------------

---[FILE: reset.ts]---
Location: payload-main/test/helpers/reset.ts

```typescript
import type { DrizzleAdapter } from '@payloadcms/drizzle/types'
import type { Payload } from 'payload'

import { isMongoose } from './isMongoose.js'

export async function resetDB(_payload: Payload, collectionSlugs: string[]) {
  if (isMongoose(_payload) && 'collections' in _payload.db && collectionSlugs.length > 0) {
    const firstCollectionSlug = collectionSlugs?.[0]

    if (!firstCollectionSlug?.length) {
      throw new Error('No collection slugs provided to reset the database.')
    }

    // Delete all documents from each collection instead of dropping the database.
    // This preserves indexes and is much faster for consecutive test runs.
    const mongooseCollections = _payload.db.collections[firstCollectionSlug]?.db.collections
    if (mongooseCollections) {
      await Promise.all(
        Object.values(mongooseCollections).map(async (collection: any) => {
          await collection.deleteMany({})
        }),
      )
    }
  } else if ('drizzle' in _payload.db) {
    const db = _payload.db as unknown as DrizzleAdapter

    // Alternative to: await db.drizzle.execute(sql`drop schema public cascade; create schema public;`)

    // Deleting the schema causes issues when restoring the database from a snapshot later on. That's why we only delete the table data here,
    // To avoid having to re-create any table schemas / indexes / whatever
    const schema = db.drizzle._.schema
    if (!schema) {
      return
    }

    const queries = Object.values(schema)
      .map((table: any) => {
        return `DELETE FROM ${db.schemaName ? db.schemaName + '.' : ''}${table.dbName};`
      })
      .join('')

    await db.execute({
      drizzle: db.drizzle,
      raw: queries,
    })
  }
}
```

--------------------------------------------------------------------------------

````
