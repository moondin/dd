---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 230
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 230 of 695)

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

---[FILE: plugin.spec.ts]---
Location: payload-main/packages/payload-cloud/src/plugin.spec.ts

```typescript
import type { Config, Payload } from 'payload'

import { jest } from '@jest/globals'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import nodemailer from 'nodemailer'
import { defaults } from 'payload'

// TO-DO: this would be needed for the TO-DO tests below.
// maybe we have to use jest.unstable_mockModule? (already tried)
// jest.mock('./plugin.ts', () => ({
//   // generateRandomString: jest.fn<() => string>().mockReturnValue('instance'),
//   generateRandomString: jest.fn().mockReturnValue('instance'),
// }))

const mockedPayload: Payload = {
  updateGlobal: jest.fn(),
  findGlobal: jest.fn().mockReturnValue('instance'),
} as unknown as Payload

import { payloadCloudPlugin } from './plugin.js'

describe('plugin', () => {
  let createTransportSpy: jest.Spied<any>

  const skipVerify = true

  beforeAll(() => {
    // Mock createTestAccount to prevent calling external services
    jest.spyOn(nodemailer, 'createTestAccount').mockImplementation(() => {
      return Promise.resolve({
        imap: { host: 'imap.test.com', port: 993, secure: true },
        pass: 'testpass',
        pop3: { host: 'pop3.test.com', port: 995, secure: true },
        smtp: { host: 'smtp.test.com', port: 587, secure: false },
        user: 'testuser',
        web: 'https://webmail.test.com',
      })
    })
  })

  beforeEach(() => {
    createTransportSpy = jest.spyOn(nodemailer, 'createTransport').mockImplementationOnce(() => {
      return {
        transporter: {
          name: 'Nodemailer - SMTP',
        },
        verify: jest.fn(),
      } as unknown as ReturnType<typeof nodemailer.createTransport>
    })
  })

  describe('not in Payload Cloud', () => {
    it('should return unmodified config', async () => {
      const plugin = payloadCloudPlugin()
      const config = await plugin(createConfig())

      assertNoCloudStorage(config)
      expect(config.email).toBeUndefined()
    })
  })

  describe('in Payload Cloud', () => {
    beforeEach(() => {
      process.env.PAYLOAD_CLOUD = 'true'
      process.env.PAYLOAD_CLOUD_EMAIL_API_KEY = 'test-key'
      process.env.PAYLOAD_CLOUD_DEFAULT_DOMAIN = 'test-domain.com'
    })

    describe('storage', () => {
      // eslint-disable-next-line jest/expect-expect
      it('should default to using payload cloud storage', async () => {
        const plugin = payloadCloudPlugin()
        const config = await plugin(createConfig())

        assertCloudStorage(config)
      })

      // eslint-disable-next-line jest/expect-expect
      it('should allow opt-out', async () => {
        const plugin = payloadCloudPlugin({ storage: false })
        const config = await plugin(createConfig())

        assertNoCloudStorage(config)
      })
    })

    describe('email', () => {
      it('should default to using payload cloud email', async () => {
        const plugin = payloadCloudPlugin()
        await plugin(createConfig())

        expect(createTransportSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            host: 'smtp.resend.com',
          }),
        )
      })

      it('should allow opt-out', async () => {
        const plugin = payloadCloudPlugin({ email: false })
        const config = await plugin(createConfig())

        expect(config.email).toBeUndefined()
      })

      it('should allow PAYLOAD_CLOUD_EMAIL_* env vars to be unset', async () => {
        delete process.env.PAYLOAD_CLOUD_EMAIL_API_KEY
        delete process.env.PAYLOAD_CLOUD_DEFAULT_DOMAIN

        const plugin = payloadCloudPlugin()
        const config = await plugin(createConfig())

        expect(config.email).toBeUndefined()
      })

      it('should not modify existing email transport', async () => {
        const logSpy = jest.spyOn(console, 'log')

        const existingTransport = nodemailer.createTransport({
          name: 'existing-transport',
          // eslint-disable-next-line @typescript-eslint/require-await
          verify: async (): Promise<true> => true,
          // eslint-disable-next-line @typescript-eslint/require-await, @typescript-eslint/no-misused-promises
          send: async (mail) => {
            // eslint-disable-next-line no-console
            console.log('mock send', mail)
          },
          version: '0.0.1',
        })

        const configWithTransport = createConfig({
          email: await nodemailerAdapter({
            defaultFromAddress: 'test@test.com',
            defaultFromName: 'Test',
            skipVerify,
            transport: existingTransport,
          }),
        })

        const plugin = payloadCloudPlugin()
        await plugin(configWithTransport)

        expect(logSpy).toHaveBeenCalledWith(
          expect.stringContaining('Payload Cloud Email is enabled but'),
        )

        // expect(config.email).toBeUndefined()
      })

      it('should allow setting fromName and fromAddress', async () => {
        const defaultFromName = 'Test'
        const defaultFromAddress = 'test@test.com'
        const configWithPartialEmail = createConfig({
          email: await nodemailerAdapter({
            defaultFromAddress,
            defaultFromName,
            skipVerify,
          }),
        })

        const plugin = payloadCloudPlugin()
        const config = await plugin(configWithPartialEmail)
        const emailConfig = config.email as Awaited<ReturnType<typeof nodemailerAdapter>>

        const initializedEmail = emailConfig({ payload: mockedPayload })

        expect(initializedEmail.defaultFromName).toStrictEqual(defaultFromName)
        expect(initializedEmail.defaultFromAddress).toStrictEqual(defaultFromAddress)

        expect(createTransportSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            host: 'smtp.resend.com',
          }),
        )
      })
    })
  })

  describe('autoRun and cronJobs', () => {
    beforeEach(() => {
      process.env.PAYLOAD_CLOUD = 'true'
      process.env.PAYLOAD_CLOUD_EMAIL_API_KEY = 'test-key'
      process.env.PAYLOAD_CLOUD_DEFAULT_DOMAIN = 'test-domain.com'
    })

    test('should always set global instance identifier', async () => {
      const plugin = payloadCloudPlugin()
      const config = await plugin(createConfig())

      const globalInstance = config.globals?.find(
        (global) => global.slug === 'payload-cloud-instance',
      )

      expect(globalInstance).toBeDefined()
      expect(globalInstance?.fields).toStrictEqual([
        {
          name: 'instance',
          type: 'text',
          required: true,
        },
      ]),
        expect(globalInstance?.admin?.hidden).toStrictEqual(true)
    })
    // TO-DO: I managed to mock findGlobal, but not generateRandomString
    test.skip('if autoRun is not set, should return default cron job', async () => {
      const plugin = payloadCloudPlugin()
      const config = await plugin(createConfig())
      const DEFAULT_CRON_JOB = {
        cron: '* * * * *',
        limit: 10,
        queue: 'default (every minute)',
      }
      if (typeof config.jobs?.autoRun !== 'function') {
        throw new Error('autoRun should be a function')
      }
      const cronConfig = await config.jobs!.autoRun!(mockedPayload)
      expect(cronConfig).toStrictEqual([DEFAULT_CRON_JOB])
    })
    // TO-DO: I managed to mock findGlobal, but not generateRandomString
    // Either way when mocking the plugin part this test has little if any importance
    test.skip('if autoRun is a function, should return the result of the function', async () => {
      const plugin = payloadCloudPlugin()
      const config = await plugin(
        createConfig({
          jobs: {
            tasks: [],
            autoRun: async () => {
              return [
                {
                  cron: '1 2 3 4 5',
                  limit: 5,
                  queue: 'test-queue',
                },
                {},
              ]
            },
          },
        }),
      )
      expect(config.jobs?.autoRun).toStrictEqual([
        {
          cron: '1 2 3 4 5',
          limit: 5,
          queue: 'test-queue',
        },
        {},
      ])
    })
  })
})

function assertCloudStorage(config: Config) {
  expect(config.upload?.useTempFiles).toStrictEqual(true)
}

function assertNoCloudStorage(config: Config) {
  expect(config.upload?.useTempFiles).toBeFalsy()
}

function createConfig(overrides?: Partial<Config>): Config {
  return {
    ...defaults,
    ...overrides,
  } as Config
}
```

--------------------------------------------------------------------------------

---[FILE: plugin.ts]---
Location: payload-main/packages/payload-cloud/src/plugin.ts

```typescript
import type { Config, Payload } from 'payload'

import type { PluginOptions } from './types.js'

import { payloadCloudEmail } from './email.js'
import { getAfterDeleteHook } from './hooks/afterDelete.js'
import { getBeforeChangeHook } from './hooks/beforeChange.js'
import {
  getCacheUploadsAfterChangeHook,
  getCacheUploadsAfterDeleteHook,
} from './hooks/uploadCache.js'
import { getStaticHandler } from './staticHandler.js'

export const generateRandomString = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from({ length: 24 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

const DEFAULT_CRON = '* * * * *'
const DEFAULT_LIMIT = 10
const DEFAULT_CRON_JOB = {
  cron: DEFAULT_CRON,
  limit: DEFAULT_LIMIT,
  queue: 'default',
}

export const payloadCloudPlugin =
  (pluginOptions?: PluginOptions) =>
  async (incomingConfig: Config): Promise<Config> => {
    let config = { ...incomingConfig }

    if (process.env.PAYLOAD_CLOUD !== 'true') {
      return config
    }

    const cachingEnabled =
      pluginOptions?.uploadCaching !== false && !!process.env.PAYLOAD_CLOUD_CACHE_KEY

    const apiEndpoint = pluginOptions?.endpoint || 'https://cloud-api.payloadcms.com'

    // Configure cloud storage
    if (pluginOptions?.storage !== false) {
      config = {
        ...config,
        collections: (config.collections || []).map((collection) => {
          if (collection.upload) {
            return {
              ...collection,
              hooks: {
                ...(collection.hooks || {}),
                afterChange: [
                  ...(collection.hooks?.afterChange || []),
                  ...(cachingEnabled
                    ? [getCacheUploadsAfterChangeHook({ endpoint: apiEndpoint })]
                    : []),
                ],
                afterDelete: [
                  ...(collection.hooks?.afterDelete || []),
                  getAfterDeleteHook({ collection }),
                  ...(cachingEnabled
                    ? [getCacheUploadsAfterDeleteHook({ endpoint: apiEndpoint })]
                    : []),
                ],
                beforeChange: [
                  ...(collection.hooks?.beforeChange || []),
                  getBeforeChangeHook({ collection }),
                ],
              },
              upload: {
                ...(typeof collection.upload === 'object' ? collection.upload : {}),
                disableLocalStorage: true,
                handlers: [
                  ...(typeof collection.upload === 'object' &&
                  Array.isArray(collection.upload.handlers)
                    ? collection.upload.handlers
                    : []),
                  getStaticHandler({
                    cachingOptions: pluginOptions?.uploadCaching,
                    collection,
                    debug: pluginOptions?.debug,
                  }),
                ],
              },
            }
          }

          return collection
        }),
        upload: {
          ...(config.upload || {}),
          useTempFiles: true,
        },
      }
    }

    // Configure cloud email
    const apiKey = process.env.PAYLOAD_CLOUD_EMAIL_API_KEY
    const defaultDomain = process.env.PAYLOAD_CLOUD_DEFAULT_DOMAIN
    if (pluginOptions?.email !== false && apiKey && defaultDomain) {
      config.email = await payloadCloudEmail({
        apiKey,
        config,
        defaultDomain,
        defaultFromAddress: pluginOptions?.email?.defaultFromAddress,
        defaultFromName: pluginOptions?.email?.defaultFromName,
        skipVerify: pluginOptions?.email?.skipVerify,
      })
    }

    // We make sure to only run cronjobs on one instance using a instance identifier stored in a global.
    config.globals = [
      ...(config.globals || []),
      {
        slug: 'payload-cloud-instance',
        admin: {
          hidden: true,
        },
        fields: [
          {
            name: 'instance',
            type: 'text',
            required: true,
          },
        ],
      },
    ]

    if (pluginOptions?.enableAutoRun === false) {
      return config
    }

    const oldAutoRunCopy = config.jobs?.autoRun ?? []

    const hasExistingAutorun = Boolean(config.jobs?.autoRun)

    const newShouldAutoRun = async (payload: Payload) => {
      if (process.env.PAYLOAD_CLOUD_JOBS_INSTANCE) {
        const retrievedGlobal = await payload.findGlobal({
          slug: 'payload-cloud-instance',
        })

        if (retrievedGlobal.instance === process.env.PAYLOAD_CLOUD_JOBS_INSTANCE) {
          return true
        } else {
          process.env.PAYLOAD_CLOUD_JOBS_INSTANCE = ''
        }
      }

      return false
    }

    if (!config.jobs?.shouldAutoRun) {
      ;(config.jobs ??= {}).shouldAutoRun = newShouldAutoRun
    }

    const newAutoRun = async (payload: Payload) => {
      const instance = generateRandomString()

      process.env.PAYLOAD_CLOUD_JOBS_INSTANCE = instance

      await payload.updateGlobal({
        slug: 'payload-cloud-instance',
        data: {
          instance,
        },
      })

      if (!hasExistingAutorun) {
        return [DEFAULT_CRON_JOB]
      }

      return typeof oldAutoRunCopy === 'function' ? await oldAutoRunCopy(payload) : oldAutoRunCopy
    }

    config.jobs.autoRun = newAutoRun

    return config
  }
```

--------------------------------------------------------------------------------

---[FILE: staticHandler.ts]---
Location: payload-main/packages/payload-cloud/src/staticHandler.ts

```typescript
import type { CollectionConfig } from 'payload'
import type { Readable } from 'stream'

import type { CollectionCachingConfig, PluginOptions, StaticHandler } from './types.js'

import { createKey } from './utilities/createKey.js'
import { getStorageClient } from './utilities/getStorageClient.js'

interface Args {
  cachingOptions?: PluginOptions['uploadCaching']
  collection: CollectionConfig
  debug?: boolean
}

// Type guard for NodeJS.Readable streams
const isNodeReadableStream = (body: unknown): body is Readable => {
  return (
    typeof body === 'object' &&
    body !== null &&
    'pipe' in body &&
    typeof (body as any).pipe === 'function' &&
    'destroy' in body &&
    typeof (body as any).destroy === 'function'
  )
}

// Convert a stream into a promise that resolves with a Buffer
const streamToBuffer = async (readableStream: any) => {
  const chunks = []
  for await (const chunk of readableStream) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

export const getStaticHandler = ({ cachingOptions, collection, debug }: Args): StaticHandler => {
  let maxAge = 86400 // 24 hours default
  let collCacheConfig: CollectionCachingConfig | undefined
  if (cachingOptions !== false) {
    // Set custom maxAge for all collections
    maxAge = cachingOptions?.maxAge || maxAge
    collCacheConfig = cachingOptions?.collections?.[collection.slug] || {}
  }

  // Set maxAge using collection-specific override
  maxAge = collCacheConfig?.maxAge || maxAge

  const cachingEnabled =
    cachingOptions !== false &&
    !!process.env.PAYLOAD_CLOUD_CACHE_KEY &&
    collCacheConfig?.enabled !== false

  return async (req, { params }) => {
    let key = ''
    try {
      const { identityID, storageClient } = await getStorageClient()

      key = createKey({
        collection: collection.slug,
        filename: params.filename,
        identityID,
      })

      const object = await storageClient.getObject({
        Bucket: process.env.PAYLOAD_CLOUD_BUCKET,
        Key: key,
      })

      if (!object.Body || !object.ContentType || !object.ETag) {
        return new Response(null, { status: 404, statusText: 'Not Found' })
      }

      // On error, manually destroy stream to close socket
      if (object.Body && isNodeReadableStream(object.Body)) {
        const stream = object.Body
        stream.on('error', (err) => {
          req.payload.logger.error({
            err,
            key,
            msg: 'Error streaming S3 object, destroying stream',
          })
          stream.destroy()
        })
      }

      const bodyBuffer = await streamToBuffer(object.Body)

      return new Response(bodyBuffer, {
        headers: new Headers({
          'Content-Length': String(object.ContentLength),
          'Content-Type': object.ContentType,
          ...(cachingEnabled && { 'Cache-Control': `public, max-age=${maxAge}` }),
          ETag: object.ETag,
        }),
        status: 200,
      })
    } catch (err: unknown) {
      // Handle each error explicitly
      if (err instanceof Error) {
        /**
         * Note: If AccessDenied comes back, it typically means that the object key is not found.
         * The AWS SDK throws this because it attempts an s3:ListBucket operation under the hood
         * if it does not find the object key, which we have disallowed in our bucket policy.
         */
        if (err.name === 'AccessDenied') {
          req.payload.logger.warn({
            awsErr: debug ? err : err.name,
            collectionSlug: collection.slug,
            msg: `Requested file not found in cloud storage: ${params.filename}`,
            params,
            requestedKey: key,
          })
          return new Response(null, { status: 404, statusText: 'Not Found' })
        } else if (err.name === 'NoSuchKey') {
          req.payload.logger.warn({
            awsErr: debug ? err : err.name,
            collectionSlug: collection.slug,
            msg: `Requested file not found in cloud storage: ${params.filename}`,
            params,
            requestedKey: key,
          })
          return new Response(null, { status: 404, statusText: 'Not Found' })
        }
      }

      req.payload.logger.error({
        collectionSlug: collection.slug,
        err,
        msg: `Error getting file from cloud storage: ${params.filename}`,
        params,
        requestedKey: key,
      })
      return new Response('Internal Server Error', { status: 500 })
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/payload-cloud/src/types.ts

```typescript
import type {
  CollectionConfig,
  Config,
  FileData,
  PayloadRequest,
  TypeWithID,
  UploadCollectionSlug,
} from 'payload'

export interface File {
  buffer: Buffer
  filename: string
  filesize: number
  mimeType: string
  tempFilePath?: string
}

export type HandleUpload = (args: {
  collection: CollectionConfig
  data: any
  file: File
  req: PayloadRequest
}) => Promise<void> | void

export interface TypeWithPrefix {
  prefix?: string
}

export type HandleDelete = (args: {
  collection: CollectionConfig
  doc: FileData & TypeWithID & TypeWithPrefix
  filename: string
  req: PayloadRequest
}) => Promise<void> | void

export type GenerateURL = (args: {
  collection: CollectionConfig
  filename: string
  prefix?: string
}) => Promise<string> | string

export type StaticHandler = (
  req: PayloadRequest,
  args: { params: { collection: string; filename: string } },
) => Promise<Response> | Promise<void> | Response | void

export interface PayloadCloudEmailOptions {
  apiKey: string
  config: Config
  defaultDomain: string
  defaultFromAddress?: string
  defaultFromName?: string
  skipVerify?: boolean
}

export interface PluginOptions {
  /**
   * Enable additional debug logging
   *
   * @default false
   */
  debug?: boolean

  /** Payload Cloud Email
   * @default true
   */
  email?:
    | {
        defaultFromAddress: string
        defaultFromName: string
        skipVerify?: boolean
      }
    | false

  /**
   *
   * Configures whether cron jobs defined in config.jobs.autoRun will be run or not
   *
   * @default true
   */
  enableAutoRun?: boolean

  /**
   * Payload Cloud API endpoint
   *
   * @internal Endpoint override for developement
   */
  endpoint?: string

  /** Payload Cloud Storage
   * @default true
   */
  storage?: false

  /**
   * Upload caching. Defaults to 24 hours for all collections.
   *
   * Optionally configure caching per collection
   *
   * ```ts
   * {
   *   collSlug1: {
   *    maxAge: 3600 // Custom value in seconds
   *   },
   *   collSlug2: {
   *     enabled: false // Disable caching for this collection
   *   }
   * }
   * ```
   *
   * @default true
   */

  uploadCaching?:
    | {
        /**
         * Caching configuration per-collection
         */
        collections?: Partial<Record<UploadCollectionSlug, CollectionCachingConfig>>
        /** Caching in seconds override for all collections
         * @default 86400 (24 hours)
         */
        maxAge?: number
      }
    | false
}

export type CollectionCachingConfig = {
  /**
   * Enable/disable caching for this collection
   *
   * @default true
   */
  enabled?: boolean
  /** Caching in seconds override for this collection
   * @default 86400 (24 hours)
   */
  maxAge?: number
}
```

--------------------------------------------------------------------------------

---[FILE: afterDelete.ts]---
Location: payload-main/packages/payload-cloud/src/hooks/afterDelete.ts

```typescript
import type { CollectionAfterDeleteHook, CollectionConfig, FileData, TypeWithID } from 'payload'

import type { TypeWithPrefix } from '../types.js'

import { createKey } from '../utilities/createKey.js'
import { getStorageClient } from '../utilities/getStorageClient.js'

interface Args {
  collection: CollectionConfig
}

export const getAfterDeleteHook = ({
  collection,
}: Args): CollectionAfterDeleteHook<FileData & TypeWithID & TypeWithPrefix> => {
  return async ({ doc, req }) => {
    try {
      const { identityID, storageClient } = await getStorageClient()

      const filesToDelete: string[] = [
        doc.filename || '',
        ...Object.values(doc?.sizes || [])
          .map((resizedFileData) => resizedFileData.filename)
          .filter((filename): filename is string => filename !== null),
      ]

      const promises = filesToDelete.map(async (filename) => {
        await storageClient.deleteObject({
          Bucket: process.env.PAYLOAD_CLOUD_BUCKET,
          Key: createKey({ collection: collection.slug, filename, identityID }),
        })
      })

      await Promise.all(promises)
    } catch (err: unknown) {
      req.payload.logger.error(
        `There was an error while deleting files corresponding to the ${collection.labels?.singular} with ID ${doc.id}:`,
      )
      req.payload.logger.error(err)
    }
    return doc
  }
}
```

--------------------------------------------------------------------------------

---[FILE: beforeChange.ts]---
Location: payload-main/packages/payload-cloud/src/hooks/beforeChange.ts

```typescript
import type { CollectionBeforeChangeHook, CollectionConfig, FileData, TypeWithID } from 'payload'
import type stream from 'stream'

import { Upload } from '@aws-sdk/lib-storage'
import fs from 'fs'

import { createKey } from '../utilities/createKey.js'
import { getIncomingFiles } from '../utilities/getIncomingFiles.js'
import { getStorageClient } from '../utilities/getStorageClient.js'

interface Args {
  collection: CollectionConfig
}

const MB = 1024 * 1024

export const getBeforeChangeHook =
  ({ collection }: Args): CollectionBeforeChangeHook<FileData & TypeWithID> =>
  async ({ data, req }) => {
    try {
      const files = getIncomingFiles({ data, req })

      req.payload.logger.debug({
        msg: `Preparing to upload ${files.length} files`,
      })

      const { identityID, storageClient } = await getStorageClient()

      const promises = files.map(async (file) => {
        const fileKey = file.filename

        req.payload.logger.debug({
          fileKey,
          msg: `File buffer length: ${file.buffer.length / MB}MB`,
          tempFilePath: file.tempFilePath ?? 'undefined',
        })

        const fileBufferOrStream: Buffer | stream.Readable = file.tempFilePath
          ? fs.createReadStream(file.tempFilePath)
          : file.buffer

        if (file.buffer.length > 0) {
          req.payload.logger.debug({
            fileKey,
            msg: `Uploading ${fileKey} from buffer. Size: ${file.buffer.length / MB}MB`,
          })

          await storageClient.putObject({
            Body: fileBufferOrStream,
            Bucket: process.env.PAYLOAD_CLOUD_BUCKET,
            ContentType: file.mimeType,
            Key: createKey({ collection: collection.slug, filename: fileKey, identityID }),
          })
        }

        // This will buffer at max 4 * 5MB = 20MB. Default queueSize is 4 and default partSize is 5MB.
        const parallelUploadS3 = new Upload({
          client: storageClient,
          params: {
            Body: fileBufferOrStream,
            Bucket: process.env.PAYLOAD_CLOUD_BUCKET,
            ContentType: file.mimeType,
            Key: createKey({ collection: collection.slug, filename: fileKey, identityID }),
          },
        })

        parallelUploadS3.on('httpUploadProgress', (progress) => {
          if (progress.total) {
            req.payload.logger.debug({
              fileKey,
              msg: `Uploaded part ${progress.part} - ${(progress.loaded || 0) / MB}MB out of ${
                (progress.total || 0) / MB
              }MB`,
            })
          }
        })

        await parallelUploadS3.done()
      })

      await Promise.all(promises)
    } catch (err: unknown) {
      req.payload.logger.error(
        `There was an error while uploading files corresponding to the collection ${collection.slug} with filename ${data.filename}:`,
      )
      req.payload.logger.error(err)
    }
    return data
  }
```

--------------------------------------------------------------------------------

---[FILE: uploadCache.ts]---
Location: payload-main/packages/payload-cloud/src/hooks/uploadCache.ts

```typescript
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, PayloadRequest } from 'payload'

interface Args {
  endpoint: string
}

export const getCacheUploadsAfterChangeHook =
  ({ endpoint }: Args): CollectionAfterChangeHook =>
  ({ doc, operation, req }) => {
    if (!req || !process.env.PAYLOAD_CLOUD_CACHE_KEY) {
      return doc
    }

    // WARNING:
    // TODO: Test this for 3.0
    const { payloadAPI } = req
    if (payloadAPI !== 'local') {
      if (operation === 'update') {
        // Unawaited promise
        void purge({ doc, endpoint, operation, req })
      }
    }
    return doc
  }

export const getCacheUploadsAfterDeleteHook =
  ({ endpoint }: Args): CollectionAfterDeleteHook =>
  ({ doc, req }) => {
    if (!req || !process.env.PAYLOAD_CLOUD_CACHE_KEY) {
      return doc
    }

    const { payloadAPI } = req

    // WARNING:
    // TODO: Test this for 3.0
    if (payloadAPI !== 'local') {
      // Unawaited promise
      void purge({ doc, endpoint, operation: 'delete', req })
    }
    return doc
  }

type PurgeRequest = {
  doc: any
  endpoint: string
  operation: string
  req: PayloadRequest
}

async function purge({ doc, endpoint, operation, req }: PurgeRequest) {
  const filePath = doc.url

  if (!filePath) {
    req.payload.logger.error({
      msg: 'No url found on doc',
      project: {
        id: process.env.PAYLOAD_CLOUD_PROJECT_ID,
      },
    })
    return
  }

  const body = {
    cacheKey: process.env.PAYLOAD_CLOUD_CACHE_KEY,
    filepath: doc.url,
    projectID: process.env.PAYLOAD_CLOUD_PROJECT_ID,
  }
  req.payload.logger.debug({
    filepath: doc.url,
    msg: 'Attempting to purge cache',
    operation,
    project: {
      id: process.env.PAYLOAD_CLOUD_PROJECT_ID,
    },
  })

  try {
    const purgeRes = await fetch(`${endpoint}/api/purge-cache`, {
      body: JSON.stringify({
        ...body,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    req.payload.logger.debug({
      msg: 'Purge cache result',
      operation,
      statusCode: purgeRes.status,
    })
  } catch (err: unknown) {
    req.payload.logger.error({ body, err, msg: '/purge-cache call failed' })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: authAsCognitoUser.ts]---
Location: payload-main/packages/payload-cloud/src/utilities/authAsCognitoUser.ts

```typescript
import type { CognitoUserSession } from 'amazon-cognito-identity-js'

import { AuthenticationDetails, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js'

let sessionAndToken: CognitoUserSession | null = null

export const authAsCognitoUser = async (
  username: string,
  password: string,
): Promise<CognitoUserSession> => {
  // TODO: Check that isValid evaluates expiration
  if (sessionAndToken?.isValid()) {
    return sessionAndToken
  }

  if (!process.env.PAYLOAD_CLOUD_COGNITO_USER_POOL_CLIENT_ID) {
    throw new Error('PAYLOAD_CLOUD_COGNITO_USER_POOL_CLIENT_ID is required')
  }
  if (!process.env.PAYLOAD_CLOUD_COGNITO_USER_POOL_ID) {
    throw new Error('PAYLOAD_CLOUD_COGNITO_USER_POOL_ID is required')
  }

  const userPool = new CognitoUserPool({
    ClientId: process.env.PAYLOAD_CLOUD_COGNITO_USER_POOL_CLIENT_ID,
    UserPoolId: process.env.PAYLOAD_CLOUD_COGNITO_USER_POOL_ID,
  })

  const authenticationDetails = new AuthenticationDetails({
    Password: password,
    Username: username,
  })

  const cognitoUser = new CognitoUser({
    Pool: userPool,
    Username: username,
  })

  const result: CognitoUserSession = await new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onFailure: (err: Error) => {
        reject(err)
      },
      onSuccess: (res) => {
        resolve(res)
      },
    })
  })

  sessionAndToken = result

  return sessionAndToken
}
```

--------------------------------------------------------------------------------

---[FILE: createKey.ts]---
Location: payload-main/packages/payload-cloud/src/utilities/createKey.ts

```typescript
interface Args {
  collection: string
  filename: string
  identityID: string
}

export const createKey = ({ collection, filename, identityID }: Args): string =>
  `${identityID}/${process.env.PAYLOAD_CLOUD_ENVIRONMENT}/${collection}/${filename}`
```

--------------------------------------------------------------------------------

---[FILE: getIncomingFiles.ts]---
Location: payload-main/packages/payload-cloud/src/utilities/getIncomingFiles.ts

```typescript
import type { FileData, PayloadRequest } from 'payload'

import type { File } from '../types.js'

export function getIncomingFiles({
  data,
  req,
}: {
  data: Partial<FileData>
  req: PayloadRequest
}): File[] {
  const file = req.file

  let files: File[] = []

  if (file && data.filename && data.mimeType) {
    const mainFile: File = {
      buffer: file.data,
      filename: data.filename,
      filesize: file.size,
      mimeType: data.mimeType,
      tempFilePath: file.tempFilePath,
    }

    files = [mainFile]

    if (data?.sizes) {
      Object.entries(data.sizes).forEach(([key, resizedFileData]) => {
        if (req.payloadUploadSizes?.[key] && resizedFileData.mimeType) {
          files = files.concat([
            {
              buffer: req.payloadUploadSizes[key],
              filename: `${resizedFileData.filename}`,
              filesize: req.payloadUploadSizes[key].length,
              mimeType: resizedFileData.mimeType,
            },
          ])
        }
      })
    }
  }

  return files
}
```

--------------------------------------------------------------------------------

---[FILE: getStorageClient.ts]---
Location: payload-main/packages/payload-cloud/src/utilities/getStorageClient.ts

```typescript
import type * as AWS from '@aws-sdk/client-s3'
import type { CognitoUserSession } from 'amazon-cognito-identity-js'

import type { GetStorageClient } from './refreshSession.js'

import { refreshSession } from './refreshSession.js'

export let storageClient: AWS.S3 | null = null
export let session: CognitoUserSession | null = null
export let identityID: string

export const getStorageClient: GetStorageClient = async () => {
  if (storageClient && session?.isValid()) {
    return {
      identityID,
      storageClient,
    }
  }

  ;({ identityID, session, storageClient } = await refreshSession())

  if (!process.env.PAYLOAD_CLOUD_PROJECT_ID) {
    throw new Error('PAYLOAD_CLOUD_PROJECT_ID is required')
  }
  if (!process.env.PAYLOAD_CLOUD_COGNITO_PASSWORD) {
    throw new Error('PAYLOAD_CLOUD_COGNITO_PASSWORD is required')
  }
  if (!process.env.PAYLOAD_CLOUD_COGNITO_IDENTITY_POOL_ID) {
    throw new Error('PAYLOAD_CLOUD_COGNITO_IDENTITY_POOL_ID is required')
  }

  return {
    identityID,
    storageClient,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: refreshSession.ts]---
Location: payload-main/packages/payload-cloud/src/utilities/refreshSession.ts

```typescript
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity'
import { S3 } from '@aws-sdk/client-s3'
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers'

import { authAsCognitoUser } from './authAsCognitoUser.js'

export type GetStorageClient = () => Promise<{
  identityID: string
  storageClient: S3
}>

export const refreshSession = async () => {
  const session = await authAsCognitoUser(
    process.env.PAYLOAD_CLOUD_PROJECT_ID || '',
    process.env.PAYLOAD_CLOUD_COGNITO_PASSWORD || '',
  )

  const cognitoIdentity = new CognitoIdentityClient({
    credentials: fromCognitoIdentityPool({
      clientConfig: {
        region: 'us-east-1',
      },
      identityPoolId: process.env.PAYLOAD_CLOUD_COGNITO_IDENTITY_POOL_ID || '',
      logins: {
        [`cognito-idp.us-east-1.amazonaws.com/${process.env.PAYLOAD_CLOUD_COGNITO_USER_POOL_ID}`]:
          session.getIdToken().getJwtToken(),
      },
    }),
  })

  const credentials = await cognitoIdentity.config.credentials()

  // @ts-expect-error - Incorrect AWS types
  const identityID = credentials.identityId

  const storageClient = new S3({
    credentials,
    region: process.env.PAYLOAD_CLOUD_BUCKET_REGION,
  })

  return {
    identityID,
    session,
    storageClient,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: payload-main/packages/plugin-cloud-storage/.gitignore

```text
dev/tmp
dev/yarn.lock

# Created by https://www.gitignore.io/api/node,macos,windows,webstorm,sublimetext,visualstudiocode

### macOS ###
*.DS_Store
.AppleDouble
.LSOverride

# Thumbnails
._*

# Files that might appear in the root of a volume
.DocumentRevisions-V100
.fseventsd
.Spotlight-V100
.TemporaryItems
.Trashes
.VolumeIcon.icns
.com.apple.timemachine.donotpresent

# Directories potentially created on remote AFP share
.AppleDB
.AppleDesktop
Network Trash Folder
Temporary Items
.apdisk

### Node ###
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Directory for instrumented libs generated by jscoverage/JSCover
lib-cov

# Coverage directory used by tools like istanbul
coverage

# nyc test coverage
.nyc_output

# Grunt intermediate storage (http://gruntjs.com/creating-plugins#storing-task-files)
.grunt

# Bower dependency directory (https://bower.io/)
bower_components

# node-waf configuration
.lock-wscript

# Compiled binary addons (http://nodejs.org/api/addons.html)
build/Release

# Dependency directories
node_modules/
jspm_packages/

# Typescript v1 declaration files
typings/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# Yarn Berry
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/sdks
!.yarn/versions
.pnp.*

# dotenv environment variables file
.env


### SublimeText ###
# cache files for sublime text
*.tmlanguage.cache
*.tmPreferences.cache
*.stTheme.cache

# workspace files are user-specific
*.sublime-workspace

# project files should be checked into the repository, unless a significant
# proportion of contributors will probably not be using SublimeText
# *.sublime-project

# sftp configuration file
sftp-config.json

# Package control specific files
Package Control.last-run
Package Control.ca-list
Package Control.ca-bundle
Package Control.system-ca-bundle
Package Control.cache/
Package Control.ca-certs/
Package Control.merged-ca-bundle
Package Control.user-ca-bundle
oscrypto-ca-bundle.crt
bh_unicode_properties.cache

# Sublime-github package stores a github token in this file
# https://packagecontrol.io/packages/sublime-github
GitHub.sublime-settings

### VisualStudioCode ###
.vscode/*
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
.history

### WebStorm ###
# Covers JetBrains IDEs: IntelliJ, RubyMine, PhpStorm, AppCode, PyCharm, CLion, Android Studio and Webstorm
# Reference: https://intellij-support.jetbrains.com/hc/en-us/articles/206544839

.idea/*
# User-specific stuff:
.idea/**/workspace.xml
.idea/**/tasks.xml
.idea/dictionaries

# Sensitive or high-churn files:
.idea/**/dataSources/
.idea/**/dataSources.ids
.idea/**/dataSources.xml
.idea/**/dataSources.local.xml
.idea/**/sqlDataSources.xml
.idea/**/dynamic.xml
.idea/**/uiDesigner.xml

# Gradle:
.idea/**/gradle.xml
.idea/**/libraries

# CMake
cmake-build-debug/

# Mongo Explorer plugin:
.idea/**/mongoSettings.xml

## File-based project format:
*.iws

## Plugin-specific files:

# IntelliJ
/out/

# mpeltonen/sbt-idea plugin
.idea_modules/

# JIRA plugin
atlassian-ide-plugin.xml

# Cursive Clojure plugin
.idea/replstate.xml

# Ruby plugin and RubyMine
/.rakeTasks

# Crashlytics plugin (for Android Studio and IntelliJ)
com_crashlytics_export_strings.xml
crashlytics.properties
crashlytics-build.properties
fabric.properties

### WebStorm Patch ###
# Comment Reason: https://github.com/joeblau/gitignore.io/issues/186#issuecomment-215987721

# *.iml
# modules.xml
# .idea/misc.xml
# *.ipr

# Sonarlint plugin
.idea/sonarlint

### Windows ###
# Windows thumbnail cache files
Thumbs.db
ehthumbs.db
ehthumbs_vista.db

# Folder config file
Desktop.ini

# Recycle Bin used on file shares
$RECYCLE.BIN/

# Windows Installer files
*.cab
*.msi
*.msm
*.msp

# Windows shortcuts
*.lnk

# End of https://www.gitignore.io/api/node,macos,windows,webstorm,sublimetext,visualstudiocode

# Ignore all uploads
demo/upload
demo/media
demo/files

# Ignore build folder
build

# Ignore built components
components/index.js
components/styles.css

# Ignore generated
demo/generated-types.ts
demo/generated-schema.graphql

# Ignore dist, no need for git
dist

# Ignore emulator volumes
src/adapters/s3/emulator/.localstack/
```

--------------------------------------------------------------------------------

---[FILE: .prettierignore]---
Location: payload-main/packages/plugin-cloud-storage/.prettierignore

```text
.tmp
**/.git
**/.hg
**/.pnp.*
**/.svn
**/.yarn/**
**/build
**/dist/**
**/node_modules
**/temp
**/docs/**
tsconfig.json
```

--------------------------------------------------------------------------------

````
