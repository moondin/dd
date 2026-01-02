---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 228
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 228 of 695)

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

---[FILE: index.ts]---
Location: payload-main/packages/payload/src/utilities/telemetry/index.ts

```typescript
import { execSync } from 'child_process'
import ciInfo from 'ci-info'
import { randomBytes } from 'crypto'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import type { Payload } from '../../types/index.js'
import type { AdminInitEvent } from './events/adminInit.js'
import type { ServerInitEvent } from './events/serverInit.js'

import { findUp } from '../findUp.js'
import { Conf } from './conf/index.js'
import { oneWayHash } from './oneWayHash.js'

export type BaseEvent = {
  ciName: null | string
  dbAdapter: string
  emailAdapter: null | string
  envID: string
  isCI: boolean
  locales: string[]
  localizationDefaultLocale: null | string
  localizationEnabled: boolean
  nodeEnv: string
  nodeVersion: string
  payloadVersion: string
  projectID: string
  projectIDSource: 'cwd' | 'git' | 'packageJSON' | 'serverURL'
  uploadAdapters: string[]
}

type PackageJSON = {
  dependencies: Record<string, string | undefined>
  name: string
}

type TelemetryEvent = AdminInitEvent | ServerInitEvent

type Args = {
  event: TelemetryEvent
  payload: Payload
}

let baseEvent: BaseEvent | null = null

export const sendEvent = async ({ event, payload }: Args): Promise<void> => {
  try {
    if (payload.config.telemetry !== false) {
      const { packageJSON, packageJSONPath } = await getPackageJSON()

      // Only generate the base event once
      if (!baseEvent) {
        const { projectID, source: projectIDSource } = getProjectID(payload, packageJSON!)
        baseEvent = {
          ciName: ciInfo.isCI ? ciInfo.name : null,
          envID: getEnvID(),
          isCI: ciInfo.isCI,
          nodeEnv: process.env.NODE_ENV || 'development',
          nodeVersion: process.version,
          payloadVersion: getPayloadVersion(packageJSON!),
          projectID,
          projectIDSource,
          ...getLocalizationInfo(payload),
          dbAdapter: payload.db.name,
          emailAdapter: payload.email?.name || null,
          uploadAdapters: payload.config.upload.adapters,
        }
      }

      if (process.env.PAYLOAD_TELEMETRY_DEBUG) {
        payload.logger.info({
          event: { ...baseEvent, ...event, packageJSONPath },
          msg: 'Telemetry Event',
        })
        return
      }

      await fetch('https://telemetry.payloadcms.com/events', {
        body: JSON.stringify({ ...baseEvent, ...event }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'post',
      })
    }
  } catch (_) {
    // Eat any errors in sending telemetry event
  }
}

/**
 * This is a quasi-persistent identifier used to dedupe recurring events. It's
 * generated from random data and completely anonymous.
 */
const getEnvID = (): string => {
  const conf = new Conf()
  const ENV_ID = 'envID'

  const val = conf.get(ENV_ID)
  if (val) {
    return val as string
  }

  const generated = randomBytes(32).toString('hex')
  conf.set(ENV_ID, generated)
  return generated
}

const getProjectID = (
  payload: Payload,
  packageJSON: PackageJSON,
): { projectID: string; source: BaseEvent['projectIDSource'] } => {
  const gitID = getGitID(payload)
  if (gitID) {
    return { projectID: oneWayHash(gitID, payload.secret), source: 'git' }
  }

  const packageJSONID = getPackageJSONID(payload, packageJSON)
  if (packageJSONID) {
    return { projectID: oneWayHash(packageJSONID, payload.secret), source: 'packageJSON' }
  }

  const serverURL = payload.config.serverURL
  if (serverURL) {
    return { projectID: oneWayHash(serverURL, payload.secret), source: 'serverURL' }
  }

  const cwd = process.cwd()
  return { projectID: oneWayHash(cwd, payload.secret), source: 'cwd' }
}

const getGitID = (payload: Payload) => {
  try {
    const originBuffer = execSync('git config --local --get remote.origin.url', {
      stdio: 'pipe',
      timeout: 1000,
    })

    return oneWayHash(String(originBuffer).trim(), payload.secret)
  } catch (_) {
    return null
  }
}

const getPackageJSON = async (): Promise<{
  packageJSON?: PackageJSON
  packageJSONPath: string
}> => {
  let packageJSONPath = path.resolve(process.cwd(), 'package.json')

  if (!fs.existsSync(packageJSONPath)) {
    // Old logic
    const filename = fileURLToPath(import.meta.url)
    const dirname = path.dirname(filename)
    packageJSONPath = (await findUp({
      dir: dirname,
      fileNames: ['package.json'],
    }))!
  }

  const jsonContentString = await fs.promises.readFile(packageJSONPath, 'utf-8')
  const jsonContent: PackageJSON = JSON.parse(jsonContentString)
  return { packageJSON: jsonContent, packageJSONPath }
}

const getPackageJSONID = (payload: Payload, packageJSON: PackageJSON): string => {
  return oneWayHash(packageJSON.name, payload.secret)
}

export const getPayloadVersion = (packageJSON: PackageJSON): string => {
  return packageJSON?.dependencies?.payload ?? ''
}

export const getLocalizationInfo = (
  payload: Payload,
): Pick<BaseEvent, 'locales' | 'localizationDefaultLocale' | 'localizationEnabled'> => {
  if (!payload.config.localization) {
    return {
      locales: [],
      localizationDefaultLocale: null,
      localizationEnabled: false,
    }
  }

  return {
    locales: payload.config.localization.localeCodes,
    localizationDefaultLocale: payload.config.localization.defaultLocale,
    localizationEnabled: true,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: oneWayHash.ts]---
Location: payload-main/packages/payload/src/utilities/telemetry/oneWayHash.ts

```typescript
import type { BinaryLike } from 'crypto'

import { createHash } from 'crypto'

export const oneWayHash = (data: BinaryLike, secret: string): string => {
  const hash = createHash('sha256')

  // prepend value with payload secret. This ensure one-way.
  hash.update(secret)

  // Update is an append operation, not a replacement. The secret from the prior
  // update is still present!
  hash.update(data)
  return hash.digest('hex')
}
```

--------------------------------------------------------------------------------

---[FILE: envPaths.ts]---
Location: payload-main/packages/payload/src/utilities/telemetry/conf/envPaths.ts

```typescript
// @ts-strict-ignore
/**
 * Taken from https://github.com/sindresorhus/env-paths/blob/main/index.js
 *
 * MIT License
 *
 * Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import os from 'node:os'
import path from 'node:path'
import process from 'node:process'

const homedir = os.homedir()
const tmpdir = os.tmpdir()
const { env } = process

const macos = (name: string) => {
  const library = path.join(homedir, 'Library')

  return {
    cache: path.join(library, 'Caches', name),
    config: path.join(library, 'Preferences', name),
    data: path.join(library, 'Application Support', name),
    log: path.join(library, 'Logs', name),
    temp: path.join(tmpdir, name),
  }
}

const windows = (name: string) => {
  const appData = env.APPDATA || path.join(homedir, 'AppData', 'Roaming')
  const localAppData = env.LOCALAPPDATA || path.join(homedir, 'AppData', 'Local')

  return {
    // Data/config/cache/log are invented by me as Windows isn't opinionated about this
    cache: path.join(localAppData, name, 'Cache'),
    config: path.join(appData, name, 'Config'),
    data: path.join(localAppData, name, 'Data'),
    log: path.join(localAppData, name, 'Log'),
    temp: path.join(tmpdir, name),
  }
}

// https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html
const linux = (name: string) => {
  const username = path.basename(homedir)

  return {
    cache: path.join(env.XDG_CACHE_HOME || path.join(homedir, '.cache'), name),
    config: path.join(env.XDG_CONFIG_HOME || path.join(homedir, '.config'), name),
    data: path.join(env.XDG_DATA_HOME || path.join(homedir, '.local', 'share'), name),
    // https://wiki.debian.org/XDGBaseDirectorySpecification#state
    log: path.join(env.XDG_STATE_HOME || path.join(homedir, '.local', 'state'), name),
    temp: path.join(tmpdir, username, name),
  }
}

export function envPaths(name: string, { suffix = 'nodejs' } = {}) {
  if (typeof name !== 'string') {
    throw new TypeError(`Expected a string, got ${typeof name}`)
  }

  if (suffix) {
    // Add suffix to prevent possible conflict with native apps
    name += `-${suffix}`
  }

  if (process.platform === 'darwin') {
    return macos(name)
  }

  if (process.platform === 'win32') {
    return windows(name)
  }

  return linux(name)
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/payload/src/utilities/telemetry/conf/index.ts

```typescript
/**
 * Taken & simplified from https://github.com/sindresorhus/conf/blob/main/source/index.ts
 *
 * MIT License
 *
 * Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'

import { envPaths } from './envPaths.js'

const createPlainObject = <T = Record<string, unknown>>(): T => Object.create(null)

const checkValueType = (key: string, value: unknown): void => {
  const nonJsonTypes = new Set(['function', 'symbol', 'undefined'])

  const type = typeof value

  if (nonJsonTypes.has(type)) {
    throw new TypeError(
      `Setting a value of type \`${type}\` for key \`${key}\` is not allowed as it's not supported by JSON`,
    )
  }
}

export class Conf<T extends Record<string, any> = Record<string, unknown>>
  implements Iterable<[keyof T, T[keyof T]]>
{
  readonly #options: Readonly<Partial<Options>>
  private readonly _deserialize: Deserialize<T> = (value) => JSON.parse(value)
  private readonly _serialize: Serialize<T> = (value) => JSON.stringify(value, undefined, '\t')

  readonly events: EventTarget

  readonly path: string

  constructor() {
    const options: Partial<Options> = {
      configFileMode: 0o666,
      configName: 'config',
      fileExtension: 'json',
      projectSuffix: 'nodejs',
    }

    const cwd = envPaths('payload', { suffix: options.projectSuffix }).config

    this.#options = options

    this.events = new EventTarget()

    const fileExtension = options.fileExtension ? `.${options.fileExtension}` : ''
    this.path = path.resolve(cwd, `${options.configName ?? 'config'}${fileExtension}`)

    const fileStore = this.store
    const store = Object.assign(createPlainObject(), fileStore)

    try {
      assert.deepEqual(fileStore, store)
    } catch {
      this.store = store
    }
  }

  private _ensureDirectory(): void {
    // Ensure the directory exists as it could have been deleted in the meantime.
    fs.mkdirSync(path.dirname(this.path), { recursive: true })
  }

  private _write(value: T): void {
    const data: string | Uint8Array = this._serialize(value)

    fs.writeFileSync(this.path, data, { mode: this.#options.configFileMode })
  }

  /**
   Delete an item.

   @param key - The key of the item to delete.
   */
  delete(key: string): void {
    const { store } = this
    delete store[key]

    this.store = store
  }

  /**
   Get an item.

   @param key - The key of the item to get.
   */
  get<Key extends keyof T>(key: Key): T[Key] {
    const { store } = this
    return store[key]
  }

  /**
   Set an item or multiple items at once.

   @param key - You can use [dot-notation](https://github.com/sindresorhus/dot-prop) in a key to access nested properties. Or a hashmap of items to set at once.
   @param value - Must be JSON serializable. Trying to set the type `undefined`, `function`, or `symbol` will result in a `TypeError`.
   */
  set<Key extends keyof T>(key: string, value?: T[Key] | unknown): void {
    if (typeof key !== 'string' && typeof key !== 'object') {
      throw new TypeError(
        `Expected \`key\` to be of type \`string\` or \`object\`, got ${typeof key}`,
      )
    }

    if (typeof key !== 'object' && value === undefined) {
      throw new TypeError('Use `delete()` to clear values')
    }

    const { store } = this

    const set = (key: string, value?: T | T[Key] | unknown): void => {
      checkValueType(key, value)
      store[key as Key] = value as T[Key]
    }

    if (typeof key === 'object') {
      const object = key
      for (const [key, value] of Object.entries(object)) {
        set(key, value)
      }
    } else {
      set(key, value)
    }

    this.store = store
  }

  *[Symbol.iterator](): IterableIterator<[keyof T, T[keyof T]]> {
    for (const [key, value] of Object.entries(this.store)) {
      yield [key, value]
    }
  }
  get size(): number {
    return Object.keys(this.store).length
  }
  get store(): T {
    try {
      const dataString = fs.readFileSync(this.path, 'utf8')
      const deserializedData = this._deserialize(dataString)
      return Object.assign(createPlainObject(), deserializedData)
    } catch (error: unknown) {
      if ((error as any)?.code === 'ENOENT') {
        this._ensureDirectory()
        return createPlainObject()
      }

      throw error
    }
  }

  set store(value: T) {
    this._ensureDirectory()

    this._write(value)

    this.events.dispatchEvent(new Event('change'))
  }
}

export type Options = {
  /**
   The config is cleared if reading the config file causes a `SyntaxError`. This is a good behavior for unimportant data, as the config file is not intended to be hand-edited, so it usually means the config is corrupt and there's nothing the user can do about it anyway. However, if you let the user edit the config file directly, mistakes might happen and it could be more useful to throw an error when the config is invalid instead of clearing.

   @default false
   */
  clearInvalidConfig?: boolean

  /**
   The [mode](https://en.wikipedia.org/wiki/File-system_permissions#Numeric_notation) that will be used for the config file.

   You would usually not need this, but it could be useful if you want to restrict the permissions of the config file. Setting a permission such as `0o600` would result in a config file that can only be accessed by the user running the program.

   Note that setting restrictive permissions can cause problems if different users need to read the file. A common problem is a user running your tool with and without `sudo` and then not being able to access the config the second time.

   @default 0o666
   */
  readonly configFileMode?: number

  /**
   Name of the config file (without extension).

   Useful if you need multiple config files for your app or module. For example, different config files between two major versions.

   @default 'config'
   */
  configName?: string

  /**
   Extension of the config file.

   You would usually not need this, but could be useful if you want to interact with a file with a custom file extension that can be associated with your app. These might be simple save/export/preference files that are intended to be shareable or saved outside of the app.

   @default 'json'
   */
  fileExtension?: string

  readonly projectSuffix?: string
}

export type Serialize<T> = (value: T) => string
export type Deserialize<T> = (text: string) => T
```

--------------------------------------------------------------------------------

---[FILE: adminInit.ts]---
Location: payload-main/packages/payload/src/utilities/telemetry/events/adminInit.ts

```typescript
import type { Payload } from '../../../index.js'
import type { PayloadRequest } from '../../../types/index.js'

import { sendEvent } from '../index.js'
import { oneWayHash } from '../oneWayHash.js'

export type AdminInitEvent = {
  domainID?: string
  type: 'admin-init'
  userID?: string
}

type Args = {
  headers: Request['headers']
  payload: Payload
  user: PayloadRequest['user']
}
export const adminInit = ({ headers, payload, user }: Args): void => {
  const host = headers.get('host')

  let domainID: string
  let userID: string

  if (host) {
    domainID = oneWayHash(host, payload.secret)
  }

  if (user?.id) {
    userID = oneWayHash(String(user.id), payload.secret)
  }

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  sendEvent({
    event: {
      type: 'admin-init',
      domainID: domainID!,
      userID: userID!,
    },
    payload,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: serverInit.ts]---
Location: payload-main/packages/payload/src/utilities/telemetry/events/serverInit.ts

```typescript
import type { Payload } from '../../../index.js'

import { sendEvent } from '../index.js'

export type ServerInitEvent = {
  type: 'server-init'
}

export const serverInit = (payload: Payload): void => {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  sendEvent({
    event: {
      type: 'server-init',
    },
    payload,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: baseFields.ts]---
Location: payload-main/packages/payload/src/versions/baseFields.ts

```typescript
// @ts-strict-ignore
import type { CheckboxField, Field, Option } from '../fields/config/types.js'

export const statuses: Option[] = [
  {
    label: ({ t }) => t('version:draft'),
    value: 'draft',
  },
  {
    label: ({ t }) => t('version:published'),
    value: 'published',
  },
]

export const baseVersionFields: Field[] = [
  {
    name: '_status',
    type: 'select',
    admin: {
      components: {
        Field: false,
      },
      disableBulkEdit: true,
    },
    defaultValue: 'draft',
    index: true,
    label: ({ t }) => t('version:status'),
    options: statuses,
  },
]

// When publishing a specific locale,
// we need to create a new draft which acts as a
// "snapshot" to retain all existing draft data.
// This field will be used to exclude any snapshot versions
// from the admin Versions list
export const versionSnapshotField: CheckboxField = {
  name: 'snapshot',
  type: 'checkbox',
  admin: {
    disableBulkEdit: true,
    disabled: true,
  },
  index: true,
}
```

--------------------------------------------------------------------------------

---[FILE: buildCollectionFields.ts]---
Location: payload-main/packages/payload/src/versions/buildCollectionFields.ts

```typescript
import type { SanitizedCollectionConfig } from '../collections/config/types.js'
import type { SanitizedConfig } from '../config/types.js'
import type { Field, FlattenedField } from '../fields/config/types.js'

import { hasAutosaveEnabled, hasDraftsEnabled } from '../utilities/getVersionsConfig.js'
import { versionSnapshotField } from './baseFields.js'

export const buildVersionCollectionFields = <T extends boolean = false>(
  config: SanitizedConfig,
  collection: SanitizedCollectionConfig,
  flatten?: T,
): true extends T ? FlattenedField[] : Field[] => {
  const fields: FlattenedField[] = [
    {
      name: 'parent',
      type: 'relationship',
      index: true,
      relationTo: collection.slug,
    },
    {
      name: 'version',
      type: 'group',
      fields: collection.fields.filter((field) => !('name' in field) || field.name !== 'id'),
      ...(flatten && {
        flattenedFields: collection.flattenedFields.filter((each) => each.name !== 'id'),
      })!,
    },
    {
      name: 'createdAt',
      type: 'date',
      admin: {
        disabled: true,
      },
      index: true,
    },
    {
      name: 'updatedAt',
      type: 'date',
      admin: {
        disabled: true,
      },
      index: true,
    },
  ]

  if (hasDraftsEnabled(collection)) {
    if (config.localization) {
      fields.push(versionSnapshotField)

      fields.push({
        name: 'publishedLocale',
        type: 'select',
        admin: {
          disableBulkEdit: true,
          disabled: true,
        },
        index: true,
        options: config.localization.locales.map((locale) => {
          if (typeof locale === 'string') {
            return locale
          }

          return locale.code
        }),
      })
    }

    fields.push({
      name: 'latest',
      type: 'checkbox',
      admin: {
        disabled: true,
      },
      index: true,
    })

    if (hasAutosaveEnabled(collection)) {
      fields.push({
        name: 'autosave',
        type: 'checkbox',
        index: true,
      })
    }
  }

  return fields as true extends T ? FlattenedField[] : Field[]
}
```

--------------------------------------------------------------------------------

---[FILE: buildGlobalFields.ts]---
Location: payload-main/packages/payload/src/versions/buildGlobalFields.ts

```typescript
import type { SanitizedConfig } from '../config/types.js'
import type { Field, FlattenedField } from '../fields/config/types.js'
import type { SanitizedGlobalConfig } from '../globals/config/types.js'

import { hasAutosaveEnabled, hasDraftsEnabled } from '../utilities/getVersionsConfig.js'
import { versionSnapshotField } from './baseFields.js'

export const buildVersionGlobalFields = <T extends boolean = false>(
  config: SanitizedConfig,
  global: SanitizedGlobalConfig,
  flatten?: T,
): true extends T ? FlattenedField[] : Field[] => {
  const fields: FlattenedField[] = [
    {
      name: 'version',
      type: 'group',
      fields: global.fields,
      ...(flatten && {
        flattenedFields: global.flattenedFields,
      })!,
    },
    {
      name: 'createdAt',
      type: 'date',
      admin: {
        disabled: true,
      },
      index: true,
    },
    {
      name: 'updatedAt',
      type: 'date',
      admin: {
        disabled: true,
      },
      index: true,
    },
  ]

  if (hasDraftsEnabled(global)) {
    if (config.localization) {
      fields.push(versionSnapshotField)

      fields.push({
        name: 'publishedLocale',
        type: 'select',
        admin: {
          disableBulkEdit: true,
          disabled: true,
        },
        index: true,
        options: config.localization.locales.map((locale) => {
          if (typeof locale === 'string') {
            return locale
          }

          return locale.code
        }),
      })
    }

    fields.push({
      name: 'latest',
      type: 'checkbox',
      admin: {
        disabled: true,
      },
      index: true,
    })

    if (hasAutosaveEnabled(global)) {
      fields.push({
        name: 'autosave',
        type: 'checkbox',
        index: true,
      })
    }
  }

  return fields as true extends T ? FlattenedField[] : Field[]
}
```

--------------------------------------------------------------------------------

---[FILE: buildVersionCompoundIndexes.ts]---
Location: payload-main/packages/payload/src/versions/buildVersionCompoundIndexes.ts

```typescript
import type { SanitizedCompoundIndex } from '../collections/config/types.js'

export const buildVersionCompoundIndexes = ({
  indexes,
}: {
  indexes: SanitizedCompoundIndex[]
}): SanitizedCompoundIndex[] => {
  return indexes.map((each) => ({
    fields: each.fields.map(({ field, localizedPath, path, pathHasLocalized }) => ({
      field,
      localizedPath: `version.${localizedPath}`,
      path: `version.${path}`,
      pathHasLocalized,
    })),
    unique: false,
  }))
}
```

--------------------------------------------------------------------------------

---[FILE: defaults.ts]---
Location: payload-main/packages/payload/src/versions/defaults.ts

```typescript
export const versionDefaults = {
  autosaveInterval: 2000,
}
```

--------------------------------------------------------------------------------

---[FILE: deleteCollectionVersions.ts]---
Location: payload-main/packages/payload/src/versions/deleteCollectionVersions.ts

```typescript
import type { PayloadRequest } from '../types/index.js'

import { type Payload } from '../index.js'

type Args = {
  id?: number | string
  payload: Payload
  req?: PayloadRequest
  slug: string
}

export const deleteCollectionVersions = async ({ id, slug, payload, req }: Args): Promise<void> => {
  try {
    await payload.db.deleteVersions({
      collection: slug,
      req,
      where: {
        parent: {
          equals: id,
        },
      },
    })
  } catch (err) {
    payload.logger.error({
      err,
      msg: `There was an error removing versions for the deleted ${slug} document with ID ${id}.`,
    })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: deleteScheduledPublishJobs.ts]---
Location: payload-main/packages/payload/src/versions/deleteScheduledPublishJobs.ts

```typescript
import type { PayloadRequest } from '../types/index.js'

import { type Payload } from '../index.js'
import { jobsCollectionSlug } from '../queues/config/collection.js'

type Args = {
  id?: number | string
  payload: Payload
  req?: PayloadRequest
  slug: string
}

export const deleteScheduledPublishJobs = async ({
  id,
  slug,
  payload,
  req,
}: Args): Promise<void> => {
  try {
    await payload.db.deleteMany({
      collection: jobsCollectionSlug,
      req,
      where: {
        and: [
          // only want to delete jobs have not run yet
          {
            completedAt: {
              exists: false,
            },
          },
          {
            processing: {
              equals: false,
            },
          },
          {
            'input.doc.value': {
              equals: id,
            },
          },
          {
            'input.doc.relationTo': {
              equals: slug,
            },
          },
          // data.type narrows scheduled publish jobs in case of another job having input.doc.value
          {
            taskSlug: {
              equals: 'schedulePublish',
            },
          },
        ],
      },
    })
  } catch (err) {
    payload.logger.error({
      err,
      msg: `There was an error deleting scheduled publish jobs from the queue for ${slug} document with ID ${id}.`,
    })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: enforceMaxVersions.ts]---
Location: payload-main/packages/payload/src/versions/enforceMaxVersions.ts

```typescript
import type { SanitizedCollectionConfig } from '../collections/config/types.js'
import type { DeleteVersionsArgs } from '../database/types.js'
import type { SanitizedGlobalConfig } from '../globals/config/types.js'
import type { Payload, PayloadRequest, Where } from '../types/index.js'

type Args = {
  collection?: SanitizedCollectionConfig
  global?: SanitizedGlobalConfig
  id?: number | string
  max: number
  payload: Payload
  req?: PayloadRequest
}

export const enforceMaxVersions = async ({
  id,
  collection,
  global: globalConfig,
  max,
  payload,
  req,
}: Args): Promise<void> => {
  const entityType = collection ? 'collection' : 'global'
  const slug = collection ? collection.slug : globalConfig?.slug

  try {
    const where: Where = {}
    let oldestAllowedDoc

    if (collection) {
      where.parent = {
        equals: id,
      }

      const query = await payload.db.findVersions({
        collection: collection.slug,
        limit: 1,
        pagination: false,
        req,
        skip: max,
        sort: '-updatedAt',
        where,
      })

      ;[oldestAllowedDoc] = query.docs
    } else if (globalConfig) {
      const query = await payload.db.findGlobalVersions({
        global: globalConfig.slug,
        limit: 1,
        pagination: false,
        req,
        skip: max,
        sort: '-updatedAt',
        where,
      })

      ;[oldestAllowedDoc] = query.docs
    }

    if (oldestAllowedDoc?.updatedAt) {
      const deleteQuery: Where = {
        updatedAt: {
          less_than_equal: oldestAllowedDoc.updatedAt,
        },
      }

      if (collection) {
        deleteQuery.parent = {
          equals: id,
        }
      }

      const deleteVersionsArgs: DeleteVersionsArgs = { req, where: deleteQuery }

      if (globalConfig) {
        deleteVersionsArgs.globalSlug = slug
      } else {
        deleteVersionsArgs.collection = slug
      }

      await payload.db.deleteVersions(deleteVersionsArgs)
    }
  } catch (err) {
    payload.logger.error(err)
    payload.logger.error(
      `There was an error cleaning up old versions for the ${entityType} ${slug}`,
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: getLatestCollectionVersion.ts]---
Location: payload-main/packages/payload/src/versions/getLatestCollectionVersion.ts

```typescript
import type { SanitizedCollectionConfig, TypeWithID } from '../collections/config/types.js'
import type { FindOneArgs } from '../database/types.js'
import type { Payload, PayloadRequest, Where } from '../types/index.js'
import type { TypeWithVersion } from './types.js'

import { combineQueries } from '../database/combineQueries.js'
import { hasDraftsEnabled } from '../utilities/getVersionsConfig.js'
import { appendVersionToQueryKey } from './drafts/appendVersionToQueryKey.js'

type Args = {
  config: SanitizedCollectionConfig
  id: number | string
  payload: Payload
  published?: boolean
  query: FindOneArgs
  req?: PayloadRequest
}

export const getLatestCollectionVersion = async <T extends TypeWithID = any>({
  id,
  config,
  payload,
  published,
  query,
  req,
}: Args): Promise<T | undefined> => {
  let latestVersion!: TypeWithVersion<T>

  const whereQuery = published
    ? { and: [{ parent: { equals: id } }, { 'version._status': { equals: 'published' } }] }
    : { and: [{ parent: { equals: id } }, { latest: { equals: true } }] }

  if (hasDraftsEnabled(config)) {
    const { docs } = await payload.db.findVersions<T>({
      collection: config.slug,
      limit: 1,
      locale: req?.locale || query.locale,
      pagination: false,
      req,
      sort: '-updatedAt',
      where: combineQueries(appendVersionToQueryKey(query.where), whereQuery as unknown as Where),
    })
    latestVersion = docs[0]!
  }

  if (!latestVersion) {
    if (!published) {
      const doc = await payload.db.findOne<T>({ ...query, req })

      return doc ?? undefined
    }

    return undefined
  }

  latestVersion.version.id = id

  return latestVersion.version
}
```

--------------------------------------------------------------------------------

---[FILE: getLatestGlobalVersion.ts]---
Location: payload-main/packages/payload/src/versions/getLatestGlobalVersion.ts

```typescript
import type { SanitizedGlobalConfig } from '../globals/config/types.js'
import type { Document, Payload, PayloadRequest, Where } from '../types/index.js'
import type { TypeWithVersion } from './types.js'

import { hasDraftsEnabled } from '../utilities/getVersionsConfig.js'

type Args = {
  config: SanitizedGlobalConfig
  locale?: string
  payload: Payload
  published?: boolean
  req?: PayloadRequest
  slug: string
  where: Where
}

export const getLatestGlobalVersion = async ({
  slug,
  config,
  locale,
  payload,
  published,
  req,
  where,
}: Args): Promise<{ global: Document; globalExists: boolean }> => {
  let latestVersion: TypeWithVersion<Document> | undefined

  const whereQuery = published
    ? { 'version._status': { equals: 'published' } }
    : { latest: { equals: true } }

  if (hasDraftsEnabled(config)) {
    latestVersion = (
      await payload.db.findGlobalVersions({
        global: slug,
        limit: 1,
        locale: locale || req?.locale || undefined,
        pagination: false,
        req,
        where: whereQuery as unknown as Where,
      })
    ).docs[0]
  }

  const global = await payload.db.findGlobal({
    slug,
    locale,
    req,
    where,
  })
  const globalExists = Boolean(global)

  if (!latestVersion) {
    return {
      global,
      globalExists,
    }
  }

  if (!latestVersion.version.createdAt) {
    latestVersion.version.createdAt = latestVersion.createdAt
  }

  if (!latestVersion.version.updatedAt) {
    latestVersion.version.updatedAt = latestVersion.updatedAt
  }

  return {
    global: latestVersion.version,
    globalExists,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: payloadPackageList.ts]---
Location: payload-main/packages/payload/src/versions/payloadPackageList.ts

```typescript
export const PAYLOAD_PACKAGE_LIST = [
  'payload',
  '@payloadcms/bundler-vite',
  '@payloadcms/bundler-webpack',
  '@payloadcms/db-d1-sqlite',
  '@payloadcms/db-mongodb',
  '@payloadcms/db-postgres',
  '@payloadcms/db-sqlite',
  '@payloadcms/db-vercel-postgres',
  '@payloadcms/drizzle',
  '@payloadcms/ecommerce',
  '@payloadcms/email-nodemailer',
  '@payloadcms/email-resend',
  '@payloadcms/graphql',
  '@payloadcms/live-preview',
  '@payloadcms/live-preview-react',
  '@payloadcms/live-preview-vue',
  '@payloadcms/kv-redis',
  '@payloadcms/next/utilities',
  '@payloadcms/payload-cloud',
  '@payloadcms/plugin-cloud-storage',
  '@payloadcms/plugin-form-builder',
  '@payloadcms/plugin-import-export',
  '@payloadcms/plugin-mcp',
  '@payloadcms/plugin-multi-tenant',
  '@payloadcms/plugin-nested-docs',
  '@payloadcms/plugin-redirects',
  '@payloadcms/plugin-search',
  '@payloadcms/plugin-seo',
  '@payloadcms/plugin-stripe',
  '@payloadcms/plugin-zapier',
  '@payloadcms/richtext-lexical',
  '@payloadcms/richtext-slate',
  '@payloadcms/sdk',
  '@payloadcms/storage-azure',
  '@payloadcms/storage-gcs',
  '@payloadcms/storage-r2',
  '@payloadcms/storage-s3',
  '@payloadcms/storage-uploadthing',
  '@payloadcms/storage-vercel-blob',
  '@payloadcms/translations',
  '@payloadcms/ui/shared',
]
```

--------------------------------------------------------------------------------

---[FILE: saveSnapshot.ts]---
Location: payload-main/packages/payload/src/versions/saveSnapshot.ts

```typescript
import type { SanitizedCollectionConfig } from '../collections/config/types.js'
import type { SanitizedGlobalConfig } from '../globals/config/types.js'
import type { Payload, TypeWithVersion } from '../index.js'
import type { JsonObject, PayloadRequest, SelectType } from '../types/index.js'

import { deepCopyObjectSimple } from '../index.js'
import { getQueryDraftsSelect } from './drafts/getQueryDraftsSelect.js'

type Args<T extends JsonObject = JsonObject> = {
  autosave?: boolean
  collection?: SanitizedCollectionConfig
  data?: T
  global?: SanitizedGlobalConfig
  id?: number | string
  payload: Payload
  publishSpecificLocale?: string
  req?: PayloadRequest
  select?: SelectType
}

export const saveSnapshot = async <T extends JsonObject = JsonObject>({
  id,
  autosave,
  collection,
  data,
  global,
  payload,
  publishSpecificLocale,
  req,
  select,
}: Args<T>): Promise<Omit<TypeWithVersion<T>, 'parent'> | TypeWithVersion<T> | undefined> => {
  const docData: {
    _status?: 'draft'
  } & T = deepCopyObjectSimple<T>(data || ({} as T))
  docData._status = 'draft'

  if (docData._id) {
    delete docData._id
  }

  const snapshotDate = new Date().toISOString()

  const sharedCreateVersionArgs = {
    autosave: Boolean(autosave),
    createdAt: snapshotDate,
    publishedLocale: publishSpecificLocale || undefined,
    req,
    returning: false,
    select: getQueryDraftsSelect({ select }),
    updatedAt: snapshotDate,
    versionData: docData,
  }

  if (collection && id) {
    return payload.db.createVersion<T>({
      ...sharedCreateVersionArgs,
      collectionSlug: collection.slug,
      parent: id,
      snapshot: true,
    })
  }
  if (global) {
    return payload.db.createGlobalVersion<T>({
      ...sharedCreateVersionArgs,
      globalSlug: global.slug,
      snapshot: true,
    })
  }
}
```

--------------------------------------------------------------------------------

````
