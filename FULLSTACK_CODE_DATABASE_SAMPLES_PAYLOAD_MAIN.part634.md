---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 634
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 634 of 695)

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

---[FILE: config.ts]---
Location: payload-main/test/plugin-import-export/config.ts

```typescript
import { fileURLToPath } from 'node:url'
import path from 'path'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
import { importExportPlugin } from '@payloadcms/plugin-import-export'
import { en } from '@payloadcms/translations/languages/en'
import { es } from '@payloadcms/translations/languages/es'

import { buildConfigWithDefaults } from '../buildConfigWithDefaults.js'
import { Pages } from './collections/Pages.js'
import { Posts } from './collections/Posts.js'
import { Users } from './collections/Users.js'
import { seed } from './seed/index.js'
export default buildConfigWithDefaults({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Pages, Posts],
  localization: {
    defaultLocale: 'en',
    fallback: true,
    locales: ['en', 'es', 'de'],
  },
  i18n: {
    supportedLanguages: {
      en,
      es,
    },
    fallbackLanguage: 'en',
  },
  onInit: async (payload) => {
    await seed(payload)
  },
  plugins: [
    importExportPlugin({
      overrideExportCollection: (collection) => {
        collection.admin.group = 'System'
        collection.upload.staticDir = path.resolve(dirname, 'uploads')
        return collection
      },
      disableJobsQueue: true,
    }),
    importExportPlugin({
      collections: ['pages'],
      overrideExportCollection: (collection) => {
        collection.slug = 'exports-tasks'
        if (collection.admin) {
          collection.admin.group = 'System'
        }
        collection.upload.staticDir = path.resolve(dirname, 'uploads')
        return collection
      },
    }),
  ],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
```

--------------------------------------------------------------------------------

---[FILE: e2e.spec.ts]---
Location: payload-main/test/plugin-import-export/e2e.spec.ts

```typescript
import type { Page } from '@playwright/test'

import { expect, test } from '@playwright/test'
import * as path from 'path'
import { fileURLToPath } from 'url'

import type { PayloadTestSDK } from '../helpers/sdk/index.js'
import type { Config } from './payload-types.js'

import { ensureCompilationIsDone, initPageConsoleErrorCatch } from '../helpers.js'
import { AdminUrlUtil } from '../helpers/adminUrlUtil.js'
import { initPayloadE2ENoConfig } from '../helpers/initPayloadE2ENoConfig.js'
import { POLL_TOPASS_TIMEOUT, TEST_TIMEOUT_LONG } from '../playwright.config.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

test.describe('Import Export', () => {
  let page: Page
  let pagesURL: AdminUrlUtil
  let payload: PayloadTestSDK<Config>

  test.beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(TEST_TIMEOUT_LONG)
    const { payload: payloadFromInit, serverURL } = await initPayloadE2ENoConfig<Config>({
      dirname,
    })
    pagesURL = new AdminUrlUtil(serverURL, 'pages')

    payload = payloadFromInit

    const context = await browser.newContext()
    page = await context.newPage()
    initPageConsoleErrorCatch(page)

    await ensureCompilationIsDone({ page, serverURL })
  })

  test.describe('Import', () => {
    test('works', async () => {
      // TODO: write e2e tests
    })
  })

  test.describe('Export', () => {
    test('works', async () => {
      // TODO: write e2e tests
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: helpers.ts]---
Location: payload-main/test/plugin-import-export/helpers.ts

```typescript
import { parse } from 'csv-parse'
import fs from 'fs'

export const readCSV = async (path: string): Promise<any[]> => {
  const buffer = fs.readFileSync(path)
  const data: any[] = []
  const promise = new Promise<void>((resolve) => {
    const parser = parse({ bom: true, columns: true })

    // Collect data from the CSV
    parser.on('readable', () => {
      let record
      while ((record = parser.read())) {
        data.push(record)
      }
    })

    // Resolve the promise on 'end'
    parser.on('end', () => {
      resolve()
    })

    // Handle errors (optional, but good practice)
    parser.on('error', (error) => {
      console.error('Error parsing CSV:', error)
      resolve() // Ensures promise doesn't hang on error
    })

    // Pipe the buffer into the parser
    parser.write(buffer)
    parser.end()
  })

  // Await the promise
  await promise

  return data
}

export const readJSON = async (path: string): Promise<any[]> => {
  const buffer = fs.readFileSync(path)
  const str = buffer.toString()

  try {
    const json = await JSON.parse(str)
    return json
  } catch (error) {
    console.error('Error reading JSON file:', error)
    throw error
  }
}
```

--------------------------------------------------------------------------------

---[FILE: int.spec.ts]---
Location: payload-main/test/plugin-import-export/int.spec.ts

```typescript
import type { CollectionSlug, Payload } from 'payload'

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import type { NextRESTClient } from '../helpers/NextRESTClient.js'

import { devUser } from '../credentials.js'
import { initPayloadInt } from '../helpers/initPayloadInt.js'
import { readCSV, readJSON } from './helpers.js'
import { richTextData } from './seed/richTextData.js'

let payload: Payload
let restClient: NextRESTClient
let user: any

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

describe('@payloadcms/plugin-import-export', () => {
  beforeAll(async () => {
    ;({ payload, restClient } = await initPayloadInt(dirname))
    user = await payload.login({
      collection: 'users',
      data: {
        email: devUser.email,
        password: devUser.password,
      },
    })
  })

  afterAll(async () => {
    await payload.destroy()
  })

  describe('graphql', () => {
    it('should not break graphql', async () => {
      const query = `query {
        __schema {
          queryType {
            name
          }
        }
      }`
      const response = await restClient
        .GRAPHQL_POST({
          body: JSON.stringify({ query }),
        })
        .then((res) => res.json())

      expect(response.error).toBeUndefined()
    })
  })

  describe('exports', () => {
    it('should create a file for collection csv from defined fields', async () => {
      let doc = await payload.create({
        collection: 'exports',
        user,
        data: {
          collectionSlug: 'pages',
          sort: 'createdAt',
          fields: ['id', 'title', 'group.value', 'group.array.field1', 'createdAt', 'updatedAt'],
          format: 'csv',
          where: {
            title: { contains: 'Title ' },
          },
        },
      })

      doc = await payload.findByID({
        collection: 'exports',
        id: doc.id,
      })

      expect(doc.filename).toContain('pages.csv')
      const expectedPath = path.join(dirname, './uploads', doc.filename as string)
      const data = await readCSV(expectedPath)

      expect(data[0].id).toBeDefined()
      expect(data[0].title).toStrictEqual('Title 0')
      expect(data[0].group_value).toStrictEqual('group value')
      expect(data[0].group_ignore).toBeUndefined()
      expect(data[0].group_array_0_field1).toStrictEqual('test')
      expect(data[0].createdAt).toBeDefined()
      expect(data[0].updatedAt).toBeDefined()
    })

    it('should create a file for collection csv with all documents when limit 0', async () => {
      let doc = await payload.create({
        collection: 'exports',
        user,
        data: {
          collectionSlug: 'pages',
          format: 'csv',
          limit: 0,
        },
      })

      doc = await payload.findByID({
        collection: 'exports',
        id: doc.id,
      })

      const { totalDocs: totalNumberOfDocs } = await payload.count({
        collection: 'pages',
      })

      expect(doc.filename).toBeDefined()
      const expectedPath = path.join(dirname, './uploads', doc.filename as string)
      const data = await readCSV(expectedPath)

      expect(data).toHaveLength(totalNumberOfDocs)
    })

    it('should create a file for collection csv with all documents when no limit', async () => {
      let doc = await payload.create({
        collection: 'exports',
        user,
        data: {
          collectionSlug: 'pages',
          format: 'csv',
        },
      })

      doc = await payload.findByID({
        collection: 'exports',
        id: doc.id,
      })

      const { totalDocs: totalNumberOfDocs } = await payload.count({
        collection: 'pages',
      })

      expect(doc.filename).toBeDefined()
      const expectedPath = path.join(dirname, './uploads', doc.filename as string)
      const data = await readCSV(expectedPath)

      expect(data).toHaveLength(totalNumberOfDocs)
    })

    it('should create a file for collection csv from limit and page 1', async () => {
      let doc = await payload.create({
        collection: 'exports',
        user,
        data: {
          collectionSlug: 'pages',
          format: 'csv',
          limit: 100,
          page: 1,
        },
      })

      doc = await payload.findByID({
        collection: 'exports',
        id: doc.id,
      })

      expect(doc.filename).toBeDefined()
      const expectedPath = path.join(dirname, './uploads', doc.filename as string)
      const data = await readCSV(expectedPath)

      expect(data[0].id).toBeDefined()
      expect(data[0].title).toStrictEqual('Polymorphic 4')
    })

    it('should create a file for collection csv from limit and page 2', async () => {
      let doc = await payload.create({
        collection: 'exports',
        user,
        data: {
          collectionSlug: 'pages',
          format: 'csv',
          limit: 100,
          page: 2,
        },
      })

      doc = await payload.findByID({
        collection: 'exports',
        id: doc.id,
      })

      // query pages with the same limit and page as the export made above
      const pages = await payload.find({
        collection: 'pages',
        limit: 100,
        page: 2,
      })

      const firstDocOnPage2 = pages.docs?.[0]

      expect(doc.filename).toBeDefined()
      const expectedPath = path.join(dirname, './uploads', doc.filename as string)
      const data = await readCSV(expectedPath)

      expect(data[0].id).toBeDefined()
      expect(data[0].title).toStrictEqual(firstDocOnPage2?.title)
    })

    it('should not create a file for collection csv when limit < 0', async () => {
      await expect(
        payload.create({
          collection: 'exports',
          user,
          data: {
            collectionSlug: 'pages',
            format: 'csv',
            limit: -1,
          },
        }),
      ).rejects.toThrow(/Limit/)
    })

    it('should not create a file for collection csv when limit is not a multiple of 100', async () => {
      await expect(
        payload.create({
          collection: 'exports',
          user,
          data: {
            collectionSlug: 'pages',
            format: 'csv',
            limit: 99,
          },
        }),
      ).rejects.toThrow(/Limit/)
    })

    it('should export results sorted ASC by title when sort="title"', async () => {
      let doc = await payload.create({
        collection: 'exports',
        user,
        data: {
          collectionSlug: 'pages',
          format: 'csv',
          sort: 'title',
          where: {
            or: [{ title: { contains: 'Title' } }, { title: { contains: 'Array' } }],
          },
        },
      })

      doc = await payload.findByID({
        collection: 'exports',
        id: doc.id,
      })

      expect(doc.filename).toBeDefined()
      const expectedPath = path.join(dirname, './uploads', doc.filename as string)
      const data = await readCSV(expectedPath)

      expect(data[0].id).toBeDefined()
      expect(data[0].title).toStrictEqual('Array 0')
    })

    it('should export results sorted DESC by title when sort="-title"', async () => {
      let doc = await payload.create({
        collection: 'exports',
        user,
        data: {
          collectionSlug: 'pages',
          format: 'csv',
          sort: '-title',
          where: {
            or: [{ title: { contains: 'Title' } }, { title: { contains: 'Array' } }],
          },
        },
      })

      doc = await payload.findByID({
        collection: 'exports',
        id: doc.id,
      })

      expect(doc.filename).toBeDefined()
      const expectedPath = path.join(dirname, './uploads', doc.filename as string)
      const data = await readCSV(expectedPath)

      expect(data[0].id).toBeDefined()
      expect(data[0].title).toStrictEqual('Title 4')
    })

    it('should create a file for collection csv with draft data', async () => {
      const draftPage = await payload.create({
        collection: 'pages',
        user,
        data: {
          title: 'Draft Page',
          _status: 'published',
        },
      })

      await payload.update({
        collection: 'pages',
        id: draftPage.id,
        data: {
          title: 'Draft Page Updated',
          _status: 'draft',
        },
      })

      let doc = await payload.create({
        collection: 'exports',
        user,
        data: {
          collectionSlug: 'pages',
          fields: ['id', 'title', '_status'],
          locale: 'en',
          format: 'csv',
          where: {
            title: { contains: 'Draft ' },
          },
        },
      })

      doc = await payload.findByID({
        collection: 'exports',
        id: doc.id,
      })

      expect(doc.filename).toBeDefined()
      const expectedPath = path.join(dirname, './uploads', doc.filename as string)
      const data = await readCSV(expectedPath)

      expect(data[0].id).toBeDefined()
      expect(data[0].title).toStrictEqual('Draft Page Updated')
      expect(data[0]._status).toStrictEqual('draft')
    })

    it('should create a file for collection csv from one locale', async () => {
      let doc = await payload.create({
        collection: 'exports',
        user,
        data: {
          collectionSlug: 'pages',
          fields: ['id', 'localized'],
          locale: 'en',
          format: 'csv',
          where: {
            title: { contains: 'Localized ' },
          },
        },
      })

      doc = await payload.findByID({
        collection: 'exports',
        id: doc.id,
      })

      expect(doc.filename).toBeDefined()
      const expectedPath = path.join(dirname, './uploads', doc.filename as string)
      const data = await readCSV(expectedPath)

      expect(data[0].id).toBeDefined()
      expect(data[0].localized).toStrictEqual('en test')
    })

    it('should create a file for collection csv from multiple locales', async () => {
      let doc = await payload.create({
        collection: 'exports',
        user,
        data: {
          collectionSlug: 'pages',
          fields: ['id', 'localized'],
          locale: 'all',
          format: 'csv',
          where: {
            title: { contains: 'Localized ' },
          },
        },
      })

      doc = await payload.findByID({
        collection: 'exports',
        id: doc.id,
      })

      expect(doc.filename).toBeDefined()
      const expectedPath = path.join(dirname, './uploads', doc.filename as string)
      const data = await readCSV(expectedPath)

      expect(data[0].id).toBeDefined()
      expect(data[0].localized_en).toStrictEqual('en test')
      expect(data[0].localized_es).toStrictEqual('es test')
    })

    it('should create a file for collection csv from array', async () => {
      let doc = await payload.create({
        collection: 'exports',
        user,
        data: {
          collectionSlug: 'pages',
          fields: ['id', 'array'],
          format: 'csv',
          where: {
            title: { contains: 'Array ' },
          },
        },
      })

      doc = await payload.findByID({
        collection: 'exports',
        id: doc.id,
      })

      expect(doc.filename).toBeDefined()
      const expectedPath = path.join(dirname, './uploads', doc.filename as string)
      const data = await readCSV(expectedPath)

      expect(data[0].array_0_field1).toStrictEqual('foo')
      expect(data[0].array_0_field2).toStrictEqual('bar')
      expect(data[0].array_1_field1).toStrictEqual('foo')
      expect(data[0].array_1_field2).toStrictEqual('baz')
    })

    it('should create a CSV file with columns matching the order of the fields array', async () => {
      const fields = ['id', 'group.value', 'group.array.field1', 'title', 'createdAt', 'updatedAt']
      const doc = await payload.create({
        collection: 'exports',
        user,
        data: {
          collectionSlug: 'pages',
          fields,
          format: 'csv',
          where: {
            title: { contains: 'Title ' },
          },
        },
      })

      const exportDoc = await payload.findByID({
        collection: 'exports',
        id: doc.id,
      })

      expect(exportDoc.filename).toBeDefined()
      const expectedPath = path.join(dirname, './uploads', exportDoc.filename as string)
      const buffer = fs.readFileSync(expectedPath)
      const str = buffer.toString()

      // Assert that the header row matches the fields array
      expect(str.indexOf('id')).toBeLessThan(str.indexOf('title'))
      expect(str.indexOf('group_value')).toBeLessThan(str.indexOf('title'))
      expect(str.indexOf('group_value')).toBeLessThan(str.indexOf('group_array'))
      expect(str.indexOf('title')).toBeLessThan(str.indexOf('createdAt'))
      expect(str.indexOf('createdAt')).toBeLessThan(str.indexOf('updatedAt'))
    })

    it('should create a CSV file with virtual fields', async () => {
      const fields = ['id', 'virtual', 'virtualRelationship']
      const doc = await payload.create({
        collection: 'exports',
        user,
        data: {
          collectionSlug: 'pages',
          fields,
          format: 'csv',
          where: {
            title: { contains: 'Virtual ' },
          },
        },
      })

      const exportDoc = await payload.findByID({
        collection: 'exports',
        id: doc.id,
      })

      expect(exportDoc.filename).toBeDefined()
      const expectedPath = path.join(dirname, './uploads', exportDoc.filename as string)
      const data = await readCSV(expectedPath)

      // Assert that the csv file contains the expected virtual fields
      expect(data[0].virtual).toStrictEqual('virtual value')
      expect(data[0].virtualRelationship).toStrictEqual('name value')
    })

    it('should create a file for collection csv from array.subfield', async () => {
      let doc = await payload.create({
        collection: 'exports',
        user,
        data: {
          collectionSlug: 'pages',
          fields: ['id', 'array.field1'],
          format: 'csv',
          where: {
            title: { contains: 'Array Subfield ' },
          },
        },
      })

      doc = await payload.findByID({
        collection: 'exports',
        id: doc.id,
      })

      expect(doc.filename).toBeDefined()
      const expectedPath = path.join(dirname, './uploads', doc.filename as string)
      const data = await readCSV(expectedPath)

      expect(data[0].array_0_field1).toStrictEqual('foo')
      expect(data[0].array_0_field2).toBeUndefined()
      expect(data[0].array_1_field1).toStrictEqual('foo')
      expect(data[0].array_1_field2).toBeUndefined()
    })

    it('should create a file for collection csv from hasMany field', async () => {
      let doc = await payload.create({
        collection: 'exports',
        user,
        data: {
          collectionSlug: 'pages',
          fields: ['id', 'hasManyNumber'],
          format: 'csv',
          where: {
            title: { contains: 'hasMany Number ' },
          },
        },
      })

      doc = await payload.findByID({
        collection: 'exports',
        id: doc.id,
      })

      expect(doc.filename).toBeDefined()
      const expectedPath = path.join(dirname, './uploads', doc.filename as string)
      const data = await readCSV(expectedPath)

      expect(data[0].hasManyNumber_0).toStrictEqual('0')
      expect(data[0].hasManyNumber_1).toStrictEqual('1')
      expect(data[0].hasManyNumber_2).toStrictEqual('1')
      expect(data[0].hasManyNumber_3).toStrictEqual('2')
      expect(data[0].hasManyNumber_4).toStrictEqual('3')
    })

    it('should create a file for collection csv from blocks field', async () => {
      let doc = await payload.create({
        collection: 'exports',
        user,
        data: {
          collectionSlug: 'pages',
          fields: ['id', 'blocks'],
          format: 'csv',
          where: {
            title: { contains: 'Blocks ' },
          },
        },
      })

      doc = await payload.findByID({
        collection: 'exports',
        id: doc.id,
      })

      expect(doc.filename).toBeDefined()
      const expectedPath = path.join(dirname, './uploads', doc.filename as string)
      const data = await readCSV(expectedPath)

      expect(data[0].blocks_0_hero_blockType).toStrictEqual('hero')
      expect(data[0].blocks_1_content_blockType).toStrictEqual('content')
    })

    it('should create a csv of all fields when fields is empty', async () => {
      const doc = await payload.create({
        collection: 'exports',
        user,
        data: {
          collectionSlug: 'pages',
          fields: [],
          format: 'csv',
          where: {
            title: { contains: 'Title ' },
          },
        },
      })

      const exportDoc = await payload.findByID({
        collection: 'exports',
        id: doc.id,
      })

      expect(exportDoc.filename).toBeDefined()
      const expectedPath = path.join(dirname, './uploads', exportDoc.filename as string)
      const data = await readCSV(expectedPath)

      // Assert that the csv file contains fields even when the specific fields were not given
      expect(data[0].id).toBeDefined()
      expect(data[0].title).toBeDefined()
      expect(data[0].createdAt).toBeDefined()
      expect(data[0].createdAt).toBeDefined()
    })

    it('should run custom toCSV function on a field', async () => {
      const fields = [
        'id',
        'custom',
        'group.custom',
        'customRelationship',
        'tabToCSV',
        'namedTab.tabToCSV',
      ]
      const doc = await payload.create({
        collection: 'exports',
        user,
        data: {
          collectionSlug: 'pages',
          fields,
          format: 'csv',
          where: {
            title: { contains: 'Custom ' },
          },
        },
      })

      const exportDoc = await payload.findByID({
        collection: 'exports',
        id: doc.id,
      })

      expect(exportDoc.filename).toBeDefined()
      const expectedPath = path.join(dirname, './uploads', exportDoc.filename as string)
      const data = await readCSV(expectedPath)

      // Assert that the csv file contains the expected virtual fields
      expect(data[0].custom).toStrictEqual('my custom csv transformer toCSV')
      expect(data[0].group_custom).toStrictEqual('my custom csv transformer toCSV')
      expect(data[0].tabToCSV).toStrictEqual('my custom csv transformer toCSV')
      expect(data[0].namedTab_tabToCSV).toStrictEqual('my custom csv transformer toCSV')
      expect(data[0].customRelationship_id).toBeDefined()
      expect(data[0].customRelationship_email).toBeDefined()
      expect(data[0].customRelationship_createdAt).toBeUndefined()
      expect(data[0].customRelationship).toBeUndefined()
    })

    it('should create a JSON file for collection', async () => {
      let doc = await payload.create({
        collection: 'exports',
        user,
        data: {
          collectionSlug: 'pages',
          fields: ['id', 'title'],
          format: 'json',
          sort: 'title',
          where: {
            title: { contains: 'JSON ' },
          },
        },
      })

      doc = await payload.findByID({
        collection: 'exports',
        id: doc.id,
      })

      expect(doc.filename).toBeDefined()
      const expectedPath = path.join(dirname, './uploads', doc.filename as string)
      const data = await readJSON(expectedPath)

      expect(data[0].title).toStrictEqual('JSON 0')
    })

    it('should download an existing export JSON file', async () => {
      const response = await restClient.POST('/exports/download', {
        body: JSON.stringify({
          data: {
            collectionSlug: 'pages',
            fields: ['id', 'title'],
            format: 'json',
            sort: 'title',
          },
        }),
        headers: { 'Content-Type': 'application/json' },
      })

      expect(response.status).toBe(200)
      expect(response.headers.get('content-type')).toMatch(/application\/json/)

      const data = await response.json()

      expect(Array.isArray(data)).toBe(true)
      expect(['string', 'number']).toContain(typeof data[0].id)
      expect(typeof data[0].title).toBe('string')
    })

    it('should create an export with every field when no fields are defined', async () => {
      let doc = await payload.create({
        collection: 'exports',
        user,
        data: {
          collectionSlug: 'pages',
          format: 'json',
          sort: 'title',
        },
      })

      doc = await payload.findByID({
        collection: 'exports',
        id: doc.id,
      })

      expect(doc.filename).toBeDefined()
      const expectedPath = path.join(dirname, './uploads', doc.filename as string)
      const data = await readJSON(expectedPath)

      expect(data[0].id).toBeDefined()
      expect(data[0].title).toBeDefined()
      expect(data[0].createdAt).toBeDefined()
      expect(data[0].updatedAt).toBeDefined()
    })

    it('should create jobs task for exports', async () => {
      const doc = await payload.create({
        collection: 'exports-tasks' as CollectionSlug,
        user,
        data: {
          collectionSlug: 'pages',
          fields: ['id', 'title'],
          format: 'csv',
          sort: 'title',
          where: {
            title: { contains: 'Jobs ' },
          },
        },
      })

      const { docs } = await payload.find({
        collection: 'payload-jobs' as CollectionSlug,
      })
      const job = docs[0]

      expect(job).toBeDefined()

      const { input } = job

      expect(input.id).toBeDefined()
      expect(input.name).toBeDefined()
      expect(input.format).toStrictEqual('csv')
      expect(input.locale).toStrictEqual('all')
      expect(input.fields).toStrictEqual(['id', 'title'])
      expect(input.collectionSlug).toStrictEqual('pages')
      expect(input.exportsCollection).toStrictEqual('exports-tasks')
      expect(input.user).toBeDefined()
      expect(input.userCollection).toBeDefined()

      await payload.jobs.run()

      const exportDoc = await payload.findByID({
        collection: 'exports-tasks' as CollectionSlug,
        id: doc.id,
      })

      expect(exportDoc.filename).toBeDefined()
      const expectedPath = path.join(dirname, './uploads', exportDoc.filename as string)
      const data = await readCSV(expectedPath)

      expect(data[0].title).toStrictEqual('Jobs 0')
    })

    it('should export polymorphic relationship fields to CSV', async () => {
      const doc = await payload.create({
        collection: 'exports',
        user,
        data: {
          collectionSlug: 'pages',
          fields: ['id', 'hasOnePolymorphic', 'hasManyPolymorphic'],
          format: 'csv',
          where: {
            title: { contains: 'Polymorphic' },
          },
        },
      })

      const exportDoc = await payload.findByID({
        collection: 'exports',
        id: doc.id,
      })

      expect(exportDoc.filename).toBeDefined()
      const expectedPath = path.join(dirname, './uploads', exportDoc.filename as string)
      const data = await readCSV(expectedPath)

      // hasOnePolymorphic
      expect(data[0].hasOnePolymorphic_id).toBeDefined()
      expect(data[0].hasOnePolymorphic_relationTo).toBe('posts')

      // hasManyPolymorphic
      expect(data[0].hasManyPolymorphic_0_id).toBeDefined()
      expect(data[0].hasManyPolymorphic_0_relationTo).toBe('users')
      expect(data[0].hasManyPolymorphic_1_id).toBeDefined()
      expect(data[0].hasManyPolymorphic_1_relationTo).toBe('posts')
    })

    it('should export hasMany monomorphic relationship fields to CSV', async () => {
      const doc = await payload.create({
        collection: 'exports',
        user,
        data: {
          collectionSlug: 'pages',
          fields: ['id', 'hasManyMonomorphic'],
          format: 'csv',
          where: {
            title: { contains: 'Monomorphic' },
          },
        },
      })

      const exportDoc = await payload.findByID({
        collection: 'exports',
        id: doc.id,
      })

      expect(exportDoc.filename).toBeDefined()
      const expectedPath = path.join(dirname, './uploads', exportDoc.filename as string)
      const data = await readCSV(expectedPath)

      // hasManyMonomorphic
      expect(data[0].hasManyMonomorphic_0_id).toBeDefined()
      expect(data[0].hasManyMonomorphic_0_relationTo).toBeUndefined()
      expect(data[0].hasManyMonomorphic_0_title).toBeUndefined()
    })

    // disabled so we don't always run a massive test
    it.skip('should create a file from a large set of collection documents', async () => {
      const allPromises = []
      let promises = []
      for (let i = 0; i < 100000; i++) {
        promises.push(
          await payload.create({
            collection: 'pages',
            data: {
              title: `Array ${i}`,
              blocks: [
                {
                  blockType: 'hero',
                  title: 'test',
                },
                {
                  blockType: 'content',
                  richText: richTextData,
                },
              ],
            },
          }),
        )
        if (promises.length >= 500) {
          await Promise.all(promises)
          promises = []
        }
        if (i % 1000 === 0) {
          console.log('created', i)
        }
      }
      await Promise.all(promises)

      console.log('seeded')

      let doc = await payload.create({
        collection: 'exports',
        user,
        data: {
          collectionSlug: 'pages',
          fields: ['id', 'blocks'],
          format: 'csv',
        },
      })

      doc = await payload.findByID({
        collection: 'exports',
        id: doc.id,
      })

      expect(doc.filename).toBeDefined()
      const expectedPath = path.join(dirname, './uploads', doc.filename as string)
      const data = await readCSV(expectedPath)

      expect(data[0].blocks_0_hero_blockType).toStrictEqual('hero')
      expect(data[0].blocks_1_content_blockType).toStrictEqual('content')
    })
  })
})
```

--------------------------------------------------------------------------------

````
