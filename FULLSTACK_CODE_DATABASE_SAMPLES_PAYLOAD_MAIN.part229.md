---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 229
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 229 of 695)

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

---[FILE: saveVersion.ts]---
Location: payload-main/packages/payload/src/versions/saveVersion.ts

```typescript
import type { SanitizedCollectionConfig } from '../collections/config/types.js'
import type { SanitizedGlobalConfig } from '../globals/config/types.js'
import type { CreateGlobalVersionArgs, CreateVersionArgs, Payload } from '../index.js'
import type { JsonObject, PayloadRequest, SelectType } from '../types/index.js'

import { deepCopyObjectSimple } from '../index.js'
import { getVersionsMax } from '../utilities/getVersionsConfig.js'
import { sanitizeInternalFields } from '../utilities/sanitizeInternalFields.js'
import { getQueryDraftsSelect } from './drafts/getQueryDraftsSelect.js'
import { enforceMaxVersions } from './enforceMaxVersions.js'
import { saveSnapshot } from './saveSnapshot.js'

type Args<T extends JsonObject = JsonObject> = {
  autosave?: boolean
  collection?: SanitizedCollectionConfig
  docWithLocales: T
  draft?: boolean
  global?: SanitizedGlobalConfig
  id?: number | string
  operation?: 'create' | 'restoreVersion' | 'update'
  payload: Payload
  publishSpecificLocale?: string
  req?: PayloadRequest
  select?: SelectType
  snapshot?: any
}

export const saveVersion = async <TData extends JsonObject = JsonObject>({
  id,
  autosave,
  collection,
  docWithLocales,
  draft,
  global,
  operation,
  payload,
  publishSpecificLocale,
  req,
  select,
  snapshot,
}: Args<TData>): Promise<JsonObject> => {
  let result: JsonObject | undefined
  let createNewVersion = true
  const now = new Date().toISOString()
  const versionData: {
    _status?: 'draft'
    updatedAt?: string
  } & TData = deepCopyObjectSimple(docWithLocales)

  if (draft) {
    versionData._status = 'draft'
  }

  if (collection?.timestamps && draft) {
    versionData.updatedAt = now
  }

  if (versionData._id) {
    delete versionData._id
  }

  try {
    if (autosave) {
      let docs
      const findVersionArgs = {
        limit: 1,
        pagination: false,
        req,
        sort: '-updatedAt',
      }

      if (collection) {
        ;({ docs } = await payload.db.findVersions<TData>({
          ...findVersionArgs,
          collection: collection.slug,
          limit: 1,
          pagination: false,
          req,
          where: {
            parent: {
              equals: id,
            },
          },
        }))
      } else {
        ;({ docs } = await payload.db.findGlobalVersions<TData>({
          ...findVersionArgs,
          global: global!.slug,
          limit: 1,
          pagination: false,
          req,
        }))
      }
      const [latestVersion] = docs

      // overwrite the latest version if it's set to autosave
      if (latestVersion && 'autosave' in latestVersion && latestVersion.autosave === true) {
        createNewVersion = false

        const updateVersionArgs = {
          id: latestVersion.id,
          req,
          versionData: {
            createdAt: new Date(latestVersion.createdAt).toISOString(),
            latest: true,
            parent: id,
            updatedAt: now,
            version: {
              ...versionData,
            },
          },
        }

        if (collection) {
          result = await payload.db.updateVersion<TData>({
            ...updateVersionArgs,
            collection: collection.slug,
            req,
          })
        } else {
          result = await payload.db.updateGlobalVersion<TData>({
            ...updateVersionArgs,
            global: global!.slug,
            req,
          })
        }
      }
    }

    if (createNewVersion) {
      const createVersionArgs = {
        autosave: Boolean(autosave),
        collectionSlug: undefined as string | undefined,
        createdAt: operation === 'restoreVersion' ? versionData.createdAt : now,
        globalSlug: undefined as string | undefined,
        parent: collection ? id : undefined,
        publishedLocale: publishSpecificLocale || undefined,
        req,
        select: getQueryDraftsSelect({ select }),
        updatedAt: now,
        versionData,
      }

      if (collection) {
        createVersionArgs.collectionSlug = collection.slug
        result = await payload.db.createVersion(createVersionArgs as CreateVersionArgs)
      }

      if (global) {
        createVersionArgs.globalSlug = global.slug
        result = await payload.db.createGlobalVersion(createVersionArgs as CreateGlobalVersionArgs)
      }

      if (snapshot) {
        await saveSnapshot<TData>({
          id,
          autosave,
          collection,
          data: snapshot,
          global,
          payload,
          publishSpecificLocale,
          req,
          select,
        })
      }
    }
  } catch (err) {
    let errorMessage: string | undefined

    if (collection) {
      errorMessage = `There was an error while saving a version for the ${typeof collection.labels.singular === 'string' ? collection.labels.singular : collection.slug} with ID ${id}.`
    }
    if (global) {
      errorMessage = `There was an error while saving a version for the global ${typeof global.label === 'string' ? global.label : global.slug}.`
    }
    payload.logger.error({ err, msg: errorMessage })
    return undefined!
  }

  const max = getVersionsMax(collection || global!)

  if (createNewVersion && max > 0) {
    await enforceMaxVersions({
      id,
      collection,
      global,
      max,
      payload,
      req,
    })
  }

  let createdVersion = (result as any).version

  createdVersion = sanitizeInternalFields(createdVersion)
  createdVersion.id = (result as any).parent

  return createdVersion
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/payload/src/versions/types.ts

```typescript
export type Autosave = {
  /**
   * Define an `interval` in milliseconds to automatically save progress while documents are edited.
   * Document updates are "debounced" at this interval.
   *
   * @default 800
   */
  interval?: number
  /**
   * When set to `true`, the "Save as draft" button will be displayed even while autosave is enabled.
   * By default, this button is hidden to avoid redundancy with autosave behavior.
   *
   * @default false
   */
  showSaveDraftButton?: boolean
}

export type SchedulePublish = {
  /**
   * Define a date format to use for the time picker.
   *
   * @example 'hh:mm' will give a 24 hour clock
   *
   * @default 'h:mm aa' which is a 12 hour clock
   */
  timeFormat?: string
  /**
   * Intervals for the time picker.
   *
   * @default 5
   */
  timeIntervals?: number
}

export type IncomingDrafts = {
  /**
   * Enable autosave to automatically save progress while documents are edited.
   * To enable, set to true or pass an object with options.
   */
  autosave?: Autosave | boolean
  /**
   * Allow for editors to schedule publish / unpublish events in the future.
   */
  schedulePublish?: boolean | SchedulePublish
  /**
   * Set validate to true to validate draft documents when saved.
   *
   * @default false
   */
  validate?: boolean
}

export type SanitizedDrafts = {
  /**
   * Enable autosave to automatically save progress while documents are edited.
   * To enable, set to true or pass an object with options.
   */
  autosave: Autosave | false
  /**
   * Allow for editors to schedule publish / unpublish events in the future.
   */
  schedulePublish: boolean | SchedulePublish
  /**
   * Set validate to true to validate draft documents when saved.
   *
   * @default false
   */
  validate: boolean
}

export type IncomingCollectionVersions = {
  /**
   * Enable Drafts mode for this collection.
   * To enable, set to true or pass an object with draft options.
   */
  drafts?: boolean | IncomingDrafts
  /**
   * Use this setting to control how many versions to keep on a document by document basis.
   * Must be an integer. Use 0 to save all versions.
   *
   * @default 100
   */
  maxPerDoc?: number
}

export interface SanitizedCollectionVersions extends Omit<IncomingCollectionVersions, 'drafts'> {
  /**
   * Enable Drafts mode for this collection.
   * To enable, set to true or pass an object with draft options.
   */
  drafts: false | SanitizedDrafts
  /**
   * Use this setting to control how many versions to keep on a document by document basis.
   * Must be an integer. Use 0 to save all versions.
   *
   * @default 100
   */
  maxPerDoc: number
}

export type IncomingGlobalVersions = {
  drafts?: boolean | IncomingDrafts
  /**
   * Use this setting to control how many versions to keep on a global by global basis.
   * Must be an integer.
   */
  max?: number
}

export type SanitizedGlobalVersions = {
  /**
   * Enable Drafts mode for this global. To enable, set to true or pass an object with draft options
   */
  drafts: false | SanitizedDrafts
  /**
   * Use this setting to control how many versions to keep on a global by global basis.
   * Must be an integer.
   */
  max: number
}

export type TypeWithVersion<T> = {
  createdAt: string
  id: string
  latest?: boolean
  parent: number | string
  publishedLocale?: string
  snapshot?: boolean
  updatedAt: string
  version: T
}
```

--------------------------------------------------------------------------------

---[FILE: appendVersionToQueryKey.ts]---
Location: payload-main/packages/payload/src/versions/drafts/appendVersionToQueryKey.ts

```typescript
import type { Where } from '../../types/index.js'

export const appendVersionToQueryKey = (query: Where = {}): Where => {
  return Object.entries(query).reduce((res, [key, val]) => {
    if (['AND', 'and', 'OR', 'or'].includes(key) && Array.isArray(val)) {
      return {
        ...res,
        [key.toLowerCase()]: val.map((subQuery) => appendVersionToQueryKey(subQuery)),
      }
    }

    if (key !== 'id') {
      return {
        ...res,
        [`version.${key}`]: val,
      }
    }

    return {
      ...res,
      parent: val,
    }
  }, {})
}
```

--------------------------------------------------------------------------------

---[FILE: getQueryDraftsSelect.ts]---
Location: payload-main/packages/payload/src/versions/drafts/getQueryDraftsSelect.ts

```typescript
import type { SelectType } from '../../types/index.js'

import { getSelectMode } from '../../utilities/getSelectMode.js'

export const getQueryDraftsSelect = ({
  select,
}: {
  select?: SelectType
}): SelectType | undefined => {
  if (!select) {
    return
  }

  const mode = getSelectMode(select)

  if (mode === 'include') {
    return {
      parent: true,
      version: select,
    } as SelectType
  }

  return {
    version: select,
  } as SelectType
}
```

--------------------------------------------------------------------------------

---[FILE: getQueryDraftsSort.ts]---
Location: payload-main/packages/payload/src/versions/drafts/getQueryDraftsSort.ts

```typescript
import type { SanitizedCollectionConfig } from '../../collections/config/types.js'
import type { Sort } from '../../types/index.js'

/**
 * Takes the incoming sort argument and prefixes it with `versions.` and preserves any `-` prefixes for descending order
 * @param sort
 */
export const getQueryDraftsSort = ({
  collectionConfig,
  sort,
}: {
  collectionConfig: SanitizedCollectionConfig
  sort?: Sort
}): Sort => {
  if (!sort) {
    if (collectionConfig.defaultSort) {
      sort = collectionConfig.defaultSort
    } else {
      sort = '-createdAt'
    }
  }

  if (typeof sort === 'string') {
    sort = [sort]
  }

  return sort.map((field: string) => {
    let orderBy: string
    let direction = ''
    if (field[0] === '-') {
      orderBy = field.substring(1)
      direction = '-'
    } else {
      orderBy = field
    }

    if (orderBy === 'id') {
      return `${direction}parent`
    }

    return `${direction}version.${orderBy}`
  })
}
```

--------------------------------------------------------------------------------

---[FILE: replaceWithDraftIfAvailable.ts]---
Location: payload-main/packages/payload/src/versions/drafts/replaceWithDraftIfAvailable.ts

```typescript
// @ts-strict-ignore
import type { SanitizedCollectionConfig, TypeWithID } from '../../collections/config/types.js'
import type { AccessResult } from '../../config/types.js'
import type { FindGlobalVersionsArgs, FindVersionsArgs } from '../../database/types.js'
import type { SanitizedGlobalConfig } from '../../globals/config/types.js'
import type { PayloadRequest, SelectType, Where } from '../../types/index.js'

import { hasWhereAccessResult } from '../../auth/index.js'
import { combineQueries } from '../../database/combineQueries.js'
import { docHasTimestamps } from '../../types/index.js'
import { sanitizeInternalFields } from '../../utilities/sanitizeInternalFields.js'
import { appendVersionToQueryKey } from './appendVersionToQueryKey.js'
import { getQueryDraftsSelect } from './getQueryDraftsSelect.js'

type Arguments<T> = {
  accessResult: AccessResult
  doc: T
  entity: SanitizedCollectionConfig | SanitizedGlobalConfig
  entityType: 'collection' | 'global'
  overrideAccess: boolean
  req: PayloadRequest
  select?: SelectType
}

export const replaceWithDraftIfAvailable = async <T extends TypeWithID>({
  accessResult,
  doc,
  entity,
  entityType,
  req,
  select,
}: Arguments<T>): Promise<T> => {
  const { locale } = req

  const queryToBuild: Where = {
    and: [
      {
        'version._status': {
          equals: 'draft',
        },
      },
    ],
  }

  if (entityType === 'collection') {
    queryToBuild.and!.push({
      parent: {
        equals: doc.id,
      },
    })
  }

  if (docHasTimestamps(doc)) {
    queryToBuild.and!.push({
      or: [
        {
          updatedAt: {
            greater_than: doc.updatedAt,
          },
        },
        {
          latest: {
            equals: true,
          },
        },
      ],
    })
  }

  let versionAccessResult: undefined | Where

  if (hasWhereAccessResult(accessResult)) {
    versionAccessResult = appendVersionToQueryKey(accessResult)
  }

  const findVersionsArgs: FindGlobalVersionsArgs & FindVersionsArgs = {
    collection: entity.slug,
    global: entity.slug,
    limit: 1,
    locale: locale!,
    pagination: false,
    req,
    select: getQueryDraftsSelect({ select }),
    sort: '-updatedAt',
    where: combineQueries(queryToBuild, versionAccessResult!),
  }

  let versionDocs
  if (entityType === 'global') {
    versionDocs = (await req.payload.db.findGlobalVersions<T>(findVersionsArgs)).docs
  } else {
    versionDocs = (await req.payload.db.findVersions<T>(findVersionsArgs)).docs
  }

  let draft = versionDocs[0]

  if (!draft) {
    return doc
  }

  draft = sanitizeInternalFields(draft)

  // Patch globalType onto version doc
  if (entityType === 'global' && 'globalType' in doc) {
    // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
    draft.version.globalType = doc.globalType
  }

  // handle when .version wasn't selected due to projection
  if (!draft.version) {
    draft.version = {} as T
  }

  // Disregard all other draft content at this point,
  // Only interested in the version itself.
  // Operations will handle firing hooks, etc.

  draft.version.id = doc.id

  return draft.version
}
```

--------------------------------------------------------------------------------

---[FILE: job.ts]---
Location: payload-main/packages/payload/src/versions/schedule/job.ts

```typescript
import type { Field } from '../../fields/config/types.js'
import type { TypedUser } from '../../index.js'
import type { TaskConfig } from '../../queues/config/types/taskTypes.js'
import type { SchedulePublishTaskInput } from './types.js'

type Args = {
  adminUserSlug: string
  collections: string[]
  globals: string[]
}

export const getSchedulePublishTask = ({
  adminUserSlug,
  collections,
  globals,
}: Args): TaskConfig<{ input: SchedulePublishTaskInput; output: object }> => {
  return {
    slug: 'schedulePublish',
    handler: async ({ input, req }) => {
      const _status = input?.type === 'publish' || !input?.type ? 'published' : 'draft'

      const userID = input.user

      let user: null | TypedUser = null

      if (userID) {
        user = (await req.payload.findByID({
          id: userID,
          collection: adminUserSlug,
          depth: 0,
        })) as TypedUser

        user.collection = adminUserSlug
      }

      let publishSpecificLocale: string

      if (input?.type === 'publish' && input.locale && req.payload.config.localization) {
        const matchedLocale = req.payload.config.localization.locales.find(
          ({ code }) => code === input.locale,
        )

        if (matchedLocale) {
          publishSpecificLocale = input.locale
        }
      }

      if (input.doc) {
        await req.payload.update({
          id: input.doc.value,
          collection: input.doc.relationTo,
          data: {
            _status,
          },
          depth: 0,
          overrideAccess: user === null,
          publishSpecificLocale: publishSpecificLocale!,
          user,
        })
      }

      if (input.global) {
        await req.payload.updateGlobal({
          slug: input.global,
          data: {
            _status,
          },
          depth: 0,
          overrideAccess: user === null,
          publishSpecificLocale: publishSpecificLocale!,
          user,
        })
      }

      return {
        output: {},
      }
    },
    inputSchema: [
      {
        name: 'type',
        type: 'radio',
        defaultValue: 'publish',
        options: ['publish', 'unpublish'],
      },
      {
        name: 'locale',
        type: 'text',
      },
      ...(collections.length > 0
        ? [
            {
              name: 'doc',
              type: 'relationship',
              relationTo: collections,
            } satisfies Field,
          ]
        : []),
      {
        name: 'global',
        type: 'select',
        options: globals,
      },
      {
        name: 'user',
        type: 'relationship',
        relationTo: adminUserSlug,
      },
    ],
  }
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/payload/src/versions/schedule/types.ts

```typescript
import type { CollectionSlug, GlobalSlug } from '../../index.js'

export type SchedulePublishTaskInput = {
  doc?: {
    relationTo: CollectionSlug
    value: string
  }
  global?: GlobalSlug
  locale?: string
  type?: string
  user?: number | string
}
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: payload-main/packages/payload-cloud/.gitignore

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
Location: payload-main/packages/payload-cloud/.prettierignore

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
```

--------------------------------------------------------------------------------

---[FILE: .swcrc-build]---
Location: payload-main/packages/payload-cloud/.swcrc-build

```text
{
  "$schema": "https://json.schemastore.org/swcrc",
  "sourceMaps": true,
  "exclude": ["/**/mocks", "/**/*.spec.ts"],
  "jsc": {
    "target": "esnext",
    "parser": {
      "syntax": "typescript",
      "tsx": true,
      "dts": true
    },
    "transform": {
      "react": {
        "runtime": "automatic",
        "pragmaFrag": "React.Fragment",
        "throwIfNamespace": true,
        "development": false,
        "useBuiltins": true
      }
    }
  },
  "module": {
    "type": "es6"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: jest.config.js]---
Location: payload-main/packages/payload-cloud/jest.config.js

```javascript
import baseConfig from '../../jest.config.js'

/** @type {import('jest').Config} */
const customJestConfig = {
  ...baseConfig,
  setupFilesAfterEnv: null,
  testMatch: ['**/src/**/?(*.)+(spec|test|it-test).[tj]s?(x)'],
  testTimeout: 20000,
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        $schema: 'https://json.schemastore.org/swcrc',
        sourceMaps: true,
        exclude: ['/**/mocks'],
        jsc: {
          target: 'esnext',
          parser: {
            syntax: 'typescript',
            tsx: true,
            dts: true,
          },
        },
        module: {
          type: 'es6',
        },
      },
    ],
  },
}

export default customJestConfig
```

--------------------------------------------------------------------------------

---[FILE: LICENSE.md]---
Location: payload-main/packages/payload-cloud/LICENSE.md

```text
MIT License

Copyright (c) 2018-2025 Payload CMS, Inc. <info@payloadcms.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: payload-main/packages/payload-cloud/package.json

```json
{
  "name": "@payloadcms/payload-cloud",
  "version": "3.68.5",
  "description": "The official Payload Cloud plugin",
  "homepage": "https://payloadcms.com",
  "repository": {
    "type": "git",
    "url": "https://github.com/payloadcms/payload.git",
    "directory": "packages/payload-cloud"
  },
  "license": "MIT",
  "author": "Payload <dev@payloadcms.com> (https://payloadcms.com)",
  "maintainers": [
    {
      "name": "Payload",
      "email": "info@payloadcms.com",
      "url": "https://payloadcms.com"
    }
  ],
  "sideEffects": false,
  "type": "module",
  "exports": {
    ".": {
      "import": "./src/index.ts",
      "types": "./src/index.ts",
      "default": "./src/index.ts"
    }
  },
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "pnpm build:types && pnpm build:swc",
    "build:debug": "pnpm build",
    "build:swc": "swc ./src -d ./dist --config-file .swcrc-build --strip-leading-paths",
    "build:types": "tsc --emitDeclarationOnly --outDir dist",
    "clean": "rimraf -g {dist,*.tsbuildinfo}",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "test": "jest"
  },
  "dependencies": {
    "@aws-sdk/client-cognito-identity": "^3.614.0",
    "@aws-sdk/client-s3": "^3.614.0",
    "@aws-sdk/credential-providers": "^3.614.0",
    "@aws-sdk/lib-storage": "^3.614.0",
    "@payloadcms/email-nodemailer": "workspace:*",
    "amazon-cognito-identity-js": "^6.1.2",
    "nodemailer": "7.0.9"
  },
  "devDependencies": {
    "@types/jest": "29.5.12",
    "@types/nodemailer": "7.0.2",
    "payload": "workspace:*"
  },
  "peerDependencies": {
    "payload": "workspace:*"
  },
  "publishConfig": {
    "exports": {
      ".": {
        "import": "./dist/index.js",
        "types": "./dist/index.js",
        "default": "./dist/index.js"
      }
    },
    "main": "./dist/index.js",
    "types": "./dist/index.d.ts"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: payload-main/packages/payload-cloud/README.md

```text
# Payload Cloud Plugin

This is the official Payload Cloud plugin that connects your Payload instance to the resources that Payload Cloud provides.

## File storage

Payload Cloud gives you S3 file storage backed by Cloudflare as a CDN, and this plugin extends Payload so that all of your media will be stored in S3 rather than locally.

## Email delivery

Payload Cloud provides an email delivery service out-of-the-box for all Payload Cloud customers. Powered by [Resend](https://resend.com).

## Upload caching

Payload Cloud provides a caching for all upload collections by default through Cloudflare's CDN.

## How to use

Add the plugin to your Payload config

`yarn add @payloadcms/payload-cloud`

```ts
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { buildConfig } from 'payload'

export default buildConfig({
  plugins: [payloadCloudPlugin()],
  // rest of config
})
```

NOTE: If your Payload config already has an email with transport, this will take precedence over Payload Cloud's email service.

### From Domain

After configuring, ensure that the `from` email address is from a domain you have access to. Payload Cloud will automatically give you permissions to use your deployed domain with the value available in `process.env.PAYLOAD_CLOUD_DEFAULT_DOMAIN`. If you have custom domains, your custom domains will also be whitelisted. Attempting to send from a domain you do not have access to will not succeed.

### Optional configuration

If you wish to opt-out of any Payload cloud features, the plugin also accepts options to do so.

```ts
payloadCloudPlugin({
  storage: false, // Disable file storage
  email: false, // Disable email delivery
  uploadCaching: false, // Disable upload caching
})
```

#### Upload Caching Configuration

If you wish to configure upload caching on a per-collection basis, you can do so by passing in a keyed object of collection names. By default, all collections will be cached for 24 hours (86400 seconds). The cache is invalidated when an item is updated or deleted.

```ts
payloadCloudPlugin({
  uploadCaching: {
    maxAge: 604800, // Override default maxAge for all collections
    collection1Slug: {
      maxAge: 10, // Collection-specific maxAge, takes precedence over others
    },
    collection2Slug: {
      enabled: false, // Disable caching for this collection
    },
  },
})
```

### Accessing File Storage from Local Environment

This plugin works off of a specific set of environment variables in order to access your file resources. The following values must be set in your local environment in order to access your file resources:

```txt
PAYLOAD_CLOUD=true
PAYLOAD_CLOUD_ENVIRONMENT=prod
PAYLOAD_CLOUD_COGNITO_USER_POOL_CLIENT_ID=
PAYLOAD_CLOUD_COGNITO_USER_POOL_ID=
PAYLOAD_CLOUD_COGNITO_IDENTITY_POOL_ID=
PAYLOAD_CLOUD_PROJECT_ID=
PAYLOAD_CLOUD_BUCKET=
PAYLOAD_CLOUD_BUCKET_REGION=
PAYLOAD_CLOUD_COGNITO_PASSWORD=
```

## Future enhancements

### API CDN

In the future, this plugin will also ship with a way to dynamically cache API requests as well as purge them whenever a resource is updated.

## When it executes

This plugin will only execute if the required environment variables set by Payload Cloud are in place. If they are not, the plugin will not execute and your Payload instance will behave as normal.
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/packages/payload-cloud/tsconfig.json

```json
{
  "extends": "../../tsconfig.base.json",
  "references": [{ "path": "../payload" }],
  "compilerOptions": {
    // Do not include DOM and DOM.Iterable as this is a server-only package.
    "lib": ["ES2022"],
  }
}
```

--------------------------------------------------------------------------------

---[FILE: email.spec.ts]---
Location: payload-main/packages/payload-cloud/src/email.spec.ts

```typescript
import type { Config, Payload } from 'payload'

import { jest } from '@jest/globals'
import nodemailer from 'nodemailer'
import { defaults } from 'payload'

import { payloadCloudEmail } from './email.js'

describe('email', () => {
  let defaultConfig: Config
  const skipVerify = true
  const defaultDomain = 'test.com'
  const apiKey = 'test'

  const mockedPayload: Payload = jest.fn() as unknown as Payload

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
    defaultConfig = defaults as Config
  })

  describe('not in Payload Cloud', () => {
    it('should return undefined', async () => {
      const email = await payloadCloudEmail({
        apiKey,
        config: defaultConfig,
        defaultDomain,
        skipVerify,
      })

      expect(email).toBeUndefined()
    })
  })

  describe('in Payload Cloud', () => {
    beforeEach(() => {
      process.env.PAYLOAD_CLOUD = 'true'
    })

    it('should respect PAYLOAD_CLOUD env var', async () => {
      const email = await payloadCloudEmail({
        apiKey,
        config: defaultConfig,
        defaultDomain,
        skipVerify,
      })
      expect(email).toBeDefined()
    })

    it('should allow setting fromName and fromAddress', async () => {
      const defaultFromName = 'custom from name'
      const defaultFromAddress = 'custom@fromaddress.com'
      const configWithFrom: Config = {
        ...defaultConfig,
      }
      const email = await payloadCloudEmail({
        apiKey,
        config: configWithFrom,
        defaultDomain,
        defaultFromAddress,
        defaultFromName,
        skipVerify,
      })

      const initializedEmail = email({ payload: mockedPayload })

      expect(initializedEmail.defaultFromName).toStrictEqual(defaultFromName)
      expect(initializedEmail.defaultFromAddress).toStrictEqual(defaultFromAddress)
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: email.ts]---
Location: payload-main/packages/payload-cloud/src/email.ts

```typescript
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import nodemailer from 'nodemailer'

import type { PayloadCloudEmailOptions } from './types.js'

type NodemailerAdapter = ReturnType<typeof nodemailerAdapter>

export const payloadCloudEmail = async (
  args: PayloadCloudEmailOptions,
): Promise<NodemailerAdapter | undefined> => {
  if (process.env.PAYLOAD_CLOUD !== 'true' || !args) {
    return undefined
  }

  if (!args.apiKey) {
    throw new Error('apiKey must be provided to use Payload Cloud Email')
  }
  if (!args.defaultDomain) {
    throw new Error('defaultDomain must be provided to use Payload Cloud Email')
  }

  // Check if already has email configuration

  if (args.config.email) {
    // eslint-disable-next-line no-console
    console.log(
      'Payload Cloud Email is enabled but email configuration is already provided in Payload config. If this is intentional, set `email: false` in the Payload Cloud plugin options.',
    )
    return args.config.email
  }

  const { apiKey, defaultDomain, skipVerify } = args

  const customDomainEnvs = Object.keys(process.env).filter(
    (e) => e.startsWith('PAYLOAD_CLOUD_EMAIL_DOMAIN_') && !e.endsWith('API_KEY'),
  )

  const customDomains = customDomainEnvs.map((e) => process.env[e]).filter(Boolean)

  if (customDomains.length) {
    // eslint-disable-next-line no-console
    console.log(
      `Configuring Payload Cloud Email for ${[defaultDomain, ...(customDomains || [])].join(', ')}`,
    )
  }

  const defaultFromName = args.defaultFromName || 'Payload CMS'
  const defaultFromAddress =
    args.defaultFromAddress || `cms@${customDomains.length ? customDomains[0] : defaultDomain}`

  const emailAdapter = await nodemailerAdapter({
    defaultFromAddress,
    defaultFromName,
    skipVerify,
    transport: nodemailer.createTransport({
      auth: {
        pass: apiKey,
        user: 'resend',
      },
      host: 'smtp.resend.com',
      port: 465,
      secure: true,
    }),
  })

  return emailAdapter
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/payload-cloud/src/index.ts

```typescript
export { payloadCloudPlugin } from './plugin.js'
export { createKey } from './utilities/createKey.js'
export { getStorageClient } from './utilities/getStorageClient.js'
```

--------------------------------------------------------------------------------

````
