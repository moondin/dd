---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 649
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 649 of 695)

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
Location: payload-main/test/query-presets/seed.ts

```typescript
import type { Payload, QueryPreset } from 'payload'

import { devUser as devCredentials, regularUser as regularCredentials } from '../credentials.js'
import { executePromises } from '../helpers/executePromises.js'
import { pagesSlug, postsSlug, usersSlug } from './slugs.js'

type SeededQueryPreset = {
  relatedCollection: 'pages'
} & Omit<QueryPreset, 'id' | 'relatedCollection'>

export const seedData: {
  everyone: () => SeededQueryPreset
  onlyMe: () => SeededQueryPreset
  specificUsers: (args: { adminUserID: string }) => SeededQueryPreset
} = {
  onlyMe: () => ({
    relatedCollection: pagesSlug,
    isShared: false,
    title: 'Only Me',
    columns: [
      {
        accessor: 'text',
        active: true,
      },
    ],
    access: {
      delete: {
        constraint: 'onlyMe',
      },
      update: {
        constraint: 'onlyMe',
      },
      read: {
        constraint: 'onlyMe',
      },
    },
    where: {
      text: {
        equals: 'example page',
      },
    },
  }),
  everyone: () => ({
    relatedCollection: pagesSlug,
    isShared: true,
    title: 'Everyone',
    access: {
      delete: {
        constraint: 'everyone',
      },
      update: {
        constraint: 'everyone',
      },
      read: {
        constraint: 'everyone',
      },
    },
    columns: [
      {
        accessor: 'text',
        active: true,
      },
    ],
    where: {
      text: {
        equals: 'example page',
      },
    },
  }),
  specificUsers: ({ adminUserID }: { adminUserID: string }) => ({
    title: 'Specific Users',
    isShared: true,
    where: {
      text: {
        equals: 'example page',
      },
    },
    access: {
      read: {
        constraint: 'specificUsers',
        users: [adminUserID],
      },
      update: {
        constraint: 'specificUsers',
        users: [adminUserID],
      },
      delete: {
        constraint: 'specificUsers',
        users: [adminUserID],
      },
    },
    columns: [
      {
        accessor: 'text',
        active: true,
      },
    ],
    relatedCollection: pagesSlug,
  }),
}

export const seed = async (_payload: Payload) => {
  const [adminUser] = await executePromises(
    [
      () =>
        _payload.create({
          collection: usersSlug,
          data: {
            email: devCredentials.email,
            password: devCredentials.password,
            name: 'Admin',
            roles: ['admin'],
          },
        }),
      () =>
        _payload.create({
          collection: usersSlug,
          data: {
            email: regularCredentials.email,
            password: regularCredentials.password,
            name: 'Editor',
            roles: ['editor'],
          },
        }),
      () =>
        _payload.create({
          collection: usersSlug,
          data: {
            email: 'public@email.com',
            password: regularCredentials.password,
            name: 'Public User',
            roles: ['user'],
          },
        }),
    ],
    false,
  )

  // Create posts first, then pages with relationships
  const [post1, post2] = await executePromises(
    [
      () =>
        _payload.create({
          collection: postsSlug,
          data: {
            text: 'Test Post 1',
          },
        }),
      () =>
        _payload.create({
          collection: postsSlug,
          data: {
            text: 'Test Post 2',
          },
        }),
    ],
    false,
  )

  await executePromises(
    [
      () =>
        _payload.create({
          collection: pagesSlug,
          data: {
            text: 'example page',
            postsRelationship: [post1?.id, post2?.id],
          },
        }),
      () =>
        _payload.create({
          collection: 'payload-query-presets',
          user: adminUser,
          overrideAccess: false,
          data: seedData.specificUsers({
            adminUserID: adminUser?.id || '',
          }),
        }),
      () =>
        _payload.create({
          collection: 'payload-query-presets',
          user: adminUser,
          overrideAccess: false,
          data: seedData.everyone(),
        }),
      () =>
        _payload.create({
          collection: 'payload-query-presets',
          user: adminUser,
          overrideAccess: false,
          data: seedData.onlyMe(),
        }),
      () =>
        _payload.create({
          collection: 'payload-query-presets',
          user: adminUser,
          data: {
            relatedCollection: 'pages',
            title: 'Noone',
            access: {
              read: {
                constraint: 'noone',
              },
            },
          },
        }),
    ],
    false,
  )
}
```

--------------------------------------------------------------------------------

---[FILE: slugs.ts]---
Location: payload-main/test/query-presets/slugs.ts

```typescript
export const usersSlug = 'users'

export const pagesSlug = 'pages'

export const postsSlug = 'posts'

export const collectionSlugs = [usersSlug, pagesSlug, postsSlug]
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.eslint.json]---
Location: payload-main/test/query-presets/tsconfig.eslint.json

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
Location: payload-main/test/query-presets/tsconfig.json

```json
{
  "extends": "../tsconfig.json"
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/query-presets/collections/Pages/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { pagesSlug } from '../../slugs.js'

export const Pages: CollectionConfig = {
  slug: pagesSlug,
  admin: {
    useAsTitle: 'text',
  },
  enableQueryPresets: true,
  lockDocuments: false,
  fields: [
    {
      name: 'text',
      type: 'text',
    },
    {
      name: 'postsRelationship',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/query-presets/collections/Posts/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { postsSlug } from '../../slugs.js'

export const Posts: CollectionConfig = {
  slug: postsSlug,
  admin: {
    useAsTitle: 'text',
    groupBy: true,
  },
  enableQueryPresets: true,
  lockDocuments: false,
  fields: [
    {
      name: 'text',
      type: 'text',
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/query-presets/collections/Users/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { roles } from '../../fields/roles.js'
import { usersSlug } from '../../slugs.js'

export const Users: CollectionConfig = {
  slug: usersSlug,
  admin: {
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    roles,
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: roles.ts]---
Location: payload-main/test/query-presets/fields/roles.ts

```typescript
import type { Field } from 'payload'

export const roles: Field = {
  name: 'roles',
  type: 'select',
  hasMany: true,
  options: [
    {
      label: 'Admin',
      value: 'admin',
    },
    {
      label: 'Editor',
      value: 'editor',
    },
    {
      label: 'User',
      value: 'user',
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: assertURLParams.ts]---
Location: payload-main/test/query-presets/helpers/assertURLParams.ts

```typescript
import type { Page } from '@playwright/test'
import type { ColumnPreference, Where } from 'payload'

// import { transformColumnsToSearchParams, transformWhereQuery } from 'payload/shared'
// import * as qs from 'qs-esm'

import { transformColumnsToSearchParams } from 'payload/shared'

export async function assertURLParams({
  page,
  columns,
  where,
  preset,
}: {
  columns?: ColumnPreference[]
  page: Page
  preset?: string | undefined
  where?: Where
}) {
  if (where) {
    // TODO: can't get columns to encode correctly
    // const whereQuery = qs.stringify(transformWhereQuery(where))
    // const encodedWhere = encodeURIComponent(whereQuery)
  }

  if (columns) {
    const escapedColumns = encodeURIComponent(
      JSON.stringify(transformColumnsToSearchParams(columns)),
    )

    const columnsRegex = new RegExp(`columns=${escapedColumns}`)
    await page.waitForURL(columnsRegex)
  }

  if (preset) {
    const presetRegex = new RegExp(`preset=${preset}`)
    await page.waitForURL(presetRegex)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: openQueryPresetDrawer.ts]---
Location: payload-main/test/query-presets/helpers/openQueryPresetDrawer.ts

```typescript
import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'

export async function openQueryPresetDrawer({ page }: { page: Page }): Promise<Locator> {
  await page.click('button#select-preset')
  const drawer = page.locator('dialog[id^="list-drawer_0_"]')
  await expect(drawer).toBeVisible()
  await expect(drawer.locator('.collection-list--payload-query-presets')).toBeVisible()
  return drawer
}
```

--------------------------------------------------------------------------------

---[FILE: togglePreset.ts]---
Location: payload-main/test/query-presets/helpers/togglePreset.ts

```typescript
import type { Page } from '@playwright/test'

import { expect } from '@playwright/test'
import { exactText } from 'helpers.js'
import { TEST_TIMEOUT_LONG } from 'playwright.config.js'

import { openQueryPresetDrawer } from './openQueryPresetDrawer.js'

export async function selectPreset({ page, presetTitle }: { page: Page; presetTitle: string }) {
  await openQueryPresetDrawer({ page })
  const modal = page.locator('[id^=list-drawer_0_]')
  await expect(modal).toBeVisible()

  const currentURL = page.url()

  await modal
    .locator('tbody tr td button', {
      hasText: exactText(presetTitle),
    })
    .first()
    .click()

  await page.waitForURL(() => page.url() !== currentURL)

  await expect(
    page.locator('button#select-preset', {
      hasText: exactText(presetTitle),
    }),
  ).toBeVisible()
}

export async function clearSelectedPreset({ page }: { page: Page }) {
  const queryPresetsControl = page.locator('button#select-preset')
  const clearButton = queryPresetsControl.locator('#clear-preset')

  // Wait for the clear button to be visible and click it
  await expect(clearButton).toBeVisible()
  await clearButton.click()

  // Wait for preset parameter to be cleared from URL
  // Other params like columns, groupBy may be temporarily empty strings before being removed
  const regex = /preset=/
  await page.waitForURL((url) => !regex.test(url.search), {
    timeout: TEST_TIMEOUT_LONG,
  })

  await expect(queryPresetsControl.locator('#clear-preset')).toBeHidden()

  await expect(
    page.locator('button#select-preset', {
      hasText: exactText('Select Preset'),
    }),
  ).toBeVisible()
}
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: payload-main/test/queues/.gitignore

```text
/media
/media-gif
```

--------------------------------------------------------------------------------

---[FILE: cli.int.spec.ts]---
Location: payload-main/test/queues/cli.int.spec.ts

```typescript
import path from 'path'
import {
  _internal_jobSystemGlobals,
  _internal_resetJobSystemGlobals,
  getPayload,
  migrateCLI,
  type SanitizedConfig,
} from 'payload'
import { wait } from 'payload/shared'
import { fileURLToPath } from 'url'

import { initPayloadInt } from '../helpers/initPayloadInt.js'
import { waitUntilAutorunIsDone } from './utilities.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

describe('Queues - CLI', () => {
  let config: SanitizedConfig
  beforeAll(async () => {
    ;({ config } = await initPayloadInt(dirname, undefined, false))
  })

  it('ensure consecutive getPayload call with cron: true will autorun jobs', async () => {
    const payload = await getPayload({
      config,
    })

    await payload.jobs.queue({
      workflow: 'inlineTaskTest',
      queue: 'autorunSecond',
      input: {
        message: 'hello!',
      },
    })

    process.env.PAYLOAD_DROP_DATABASE = 'false'

    // Second instance of payload with the only purpose of running cron jobs
    const _payload2 = await getPayload({
      config,
      cron: true,
    })

    await waitUntilAutorunIsDone({
      payload,
      queue: 'autorunSecond',
    })

    const allSimples = await payload.find({
      collection: 'simple',
      limit: 100,
    })

    expect(allSimples.totalDocs).toBe(1)
    expect(allSimples?.docs?.[0]?.title).toBe('hello!')

    // Shut down safely:
    // Ensure no new crons are scheduled
    _internal_jobSystemGlobals.shouldAutoRun = false
    _internal_jobSystemGlobals.shouldAutoSchedule = false
    // Wait 3 seconds to ensure all currently-running crons are done. If we shut down the db while a function is running, it can cause issues
    // Cron function runs may persist after a test has finished
    await wait(3000)
    // Now we can destroy the payload instance
    await _payload2.destroy()
    await payload.destroy()
    _internal_resetJobSystemGlobals()
  })

  it('can run migrate CLI without jobs attempting to run', async () => {
    await migrateCLI({
      config,
      parsedArgs: {
        _: ['migrate'],
      },
    })

    // Wait 3 seconds to let potential autorun crons trigger
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Expect no errors. Previously, this would throw an "error: relation "payload_jobs" does not exist" error
    expect(true).toBe(true)
  })
})
```

--------------------------------------------------------------------------------

---[FILE: config.postgreslogs.ts]---
Location: payload-main/test/queues/config.postgreslogs.ts

```typescript
/* eslint-disable no-restricted-exports */
import { buildConfigWithDefaults } from '../buildConfigWithDefaults.js'
import { getConfig } from './getConfig.js'

const config = getConfig()

import { postgresAdapter } from '@payloadcms/db-postgres'

export const databaseAdapter = postgresAdapter({
  pool: {
    connectionString: process.env.POSTGRES_URL || 'postgres://127.0.0.1:5432/payloadtests',
  },
  logger: true,
})

export default buildConfigWithDefaults({
  ...config,
  db: databaseAdapter,
})
```

--------------------------------------------------------------------------------

---[FILE: config.schedules-autocron.ts]---
Location: payload-main/test/queues/config.schedules-autocron.ts

```typescript
/* eslint-disable no-restricted-exports */
import { buildConfigWithDefaults } from '../buildConfigWithDefaults.js'
import { getConfig } from './getConfig.js'
import { EverySecondMax2Task } from './tasks/EverySecondMax2Task.js'
import { EverySecondTask } from './tasks/EverySecondTask.js'

const config = getConfig()

export default buildConfigWithDefaults({
  ...config,
  jobs: {
    ...config.jobs,
    tasks: [...(config?.jobs?.tasks || []), EverySecondTask, EverySecondMax2Task],
    autoRun: [
      {
        // @ts-expect-error not undefined
        ...config.jobs.autoRun[0],
        disableScheduling: false,
      },
    ],
  },
})
```

--------------------------------------------------------------------------------

---[FILE: config.schedules.ts]---
Location: payload-main/test/queues/config.schedules.ts

```typescript
/* eslint-disable no-restricted-exports */
import { buildConfigWithDefaults } from '../buildConfigWithDefaults.js'
import { getConfig } from './getConfig.js'
import { EverySecondMax2Task } from './tasks/EverySecondMax2Task.js'
import { EverySecondTask } from './tasks/EverySecondTask.js'

const config = getConfig()

export default buildConfigWithDefaults({
  ...config,
  jobs: {
    ...config.jobs,
    tasks: [...(config?.jobs?.tasks || []), EverySecondTask, EverySecondMax2Task],
    autoRun: [
      {
        // @ts-expect-error not undefined
        ...config.jobs.autoRun[0],
        disableScheduling: true,
      },
    ],
  },
})
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: payload-main/test/queues/config.ts

```typescript
import { buildConfigWithDefaults } from '../buildConfigWithDefaults.js'
import { getConfig } from './getConfig.js'

export default buildConfigWithDefaults(getConfig())
```

--------------------------------------------------------------------------------

---[FILE: getConfig.ts]---
Location: payload-main/test/queues/getConfig.ts

```typescript
import type { Config } from 'payload'

import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { fileURLToPath } from 'node:url'
import path from 'path'

import { devUser } from '../credentials.js'
import { seed } from './seed.js'
import { CreateSimpleRetries0Task } from './tasks/CreateSimpleRetries0Task.js'
import { CreateSimpleRetriesUndefinedTask } from './tasks/CreateSimpleRetriesUndefinedTask.js'
import { CreateSimpleTask } from './tasks/CreateSimpleTask.js'
import { CreateSimpleWithDuplicateMessageTask } from './tasks/CreateSimpleWithDuplicateMessageTask.js'
import { DoNothingTask } from './tasks/DoNothingTask.js'
import { ExternalTask } from './tasks/ExternalTask.js'
import { ReturnCustomErrorTask } from './tasks/ReturnCustomErrorTask.js'
import { ReturnErrorTask } from './tasks/ReturnErrorTask.js'
import { ThrowErrorTask } from './tasks/ThrowErrorTask.js'
import { UpdatePostStep2Task } from './tasks/UpdatePostStep2Task.js'
import { UpdatePostTask } from './tasks/UpdatePostTask.js'
import { externalWorkflow } from './workflows/externalWorkflow.js'
import { failsImmediatelyWorkflow } from './workflows/failsImmediately.js'
import { fastParallelTaskWorkflow } from './workflows/fastParallelTaskWorkflow.js'
import { inlineTaskTestWorkflow } from './workflows/inlineTaskTest.js'
import { inlineTaskTestDelayedWorkflow } from './workflows/inlineTaskTestDelayed.js'
import { longRunningWorkflow } from './workflows/longRunning.js'
import { noRetriesSetWorkflow } from './workflows/noRetriesSet.js'
import { parallelTaskWorkflow } from './workflows/parallelTaskWorkflow.js'
import { retries0Workflow } from './workflows/retries0.js'
import { retriesBackoffTestWorkflow } from './workflows/retriesBackoffTest.js'
import { retriesRollbackTestWorkflow } from './workflows/retriesRollbackTest.js'
import { retriesTestWorkflow } from './workflows/retriesTest.js'
import { retriesWorkflowLevelTestWorkflow } from './workflows/retriesWorkflowLevelTest.js'
import { subTaskWorkflow } from './workflows/subTask.js'
import { subTaskFailsWorkflow } from './workflows/subTaskFails.js'
import { updatePostWorkflow } from './workflows/updatePost.js'
import { updatePostJSONWorkflow } from './workflows/updatePostJSON.js'
import { workflowAndTasksRetriesUndefinedWorkflow } from './workflows/workflowAndTasksRetriesUndefined.js'
import { workflowRetries2TasksRetries0Workflow } from './workflows/workflowRetries2TasksRetries0.js'
import { workflowRetries2TasksRetriesUndefinedWorkflow } from './workflows/workflowRetries2TasksRetriesUndefined.js'

const dirname = path.dirname(fileURLToPath(import.meta.url))

// Needs to be a function to prevent object reference issues due to duplicative configs
export const getConfig: () => Partial<Config> = () => ({
  collections: [
    {
      slug: 'posts',
      admin: {
        useAsTitle: 'title',
      },
      hooks: {
        afterChange: [
          async ({ req, doc, context }) => {
            await req.payload.jobs.queue({
              workflow: context.useJSONWorkflow ? 'updatePostJSONWorkflow' : 'updatePost',
              input: {
                post: doc.id,
                message: 'hello',
              },
              req,
            })
          },
        ],
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'content',
          type: 'richText',
        },
        {
          name: 'jobStep1Ran',
          type: 'text',
        },
        {
          name: 'jobStep2Ran',
          type: 'text',
        },
      ],
    },
    {
      slug: 'simple',
      admin: {
        useAsTitle: 'title',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
    autoLogin: {
      prefillOnly: true,
      email: devUser.email,
      password: devUser.password,
    },
  },
  jobs: {
    autoRun: [
      {
        silent: true,
        // Every second
        cron: '* * * * * *',
        limit: 100,
        queue: 'autorunSecond',
      },
      // add as many cron jobs as you want
    ],
    shouldAutoRun: () => true,
    jobsCollectionOverrides: ({ defaultJobsCollection }) => {
      return {
        ...defaultJobsCollection,
        admin: {
          ...(defaultJobsCollection?.admin || {}),
          hidden: false,
        },
      }
    },
    processingOrder: {
      queues: {
        lifo: '-createdAt',
      },
    },
    tasks: [
      UpdatePostTask,
      UpdatePostStep2Task,
      CreateSimpleTask,
      CreateSimpleRetriesUndefinedTask,
      CreateSimpleRetries0Task,
      CreateSimpleWithDuplicateMessageTask,
      ExternalTask,
      ThrowErrorTask,
      ReturnErrorTask,
      ReturnCustomErrorTask,
      DoNothingTask,
    ],
    workflows: [
      updatePostWorkflow,
      updatePostJSONWorkflow,
      retriesTestWorkflow,
      retriesRollbackTestWorkflow,
      retriesWorkflowLevelTestWorkflow,
      noRetriesSetWorkflow,
      retries0Workflow,
      workflowAndTasksRetriesUndefinedWorkflow,
      workflowRetries2TasksRetriesUndefinedWorkflow,
      workflowRetries2TasksRetries0Workflow,
      inlineTaskTestWorkflow,
      failsImmediatelyWorkflow,
      fastParallelTaskWorkflow,
      inlineTaskTestDelayedWorkflow,
      externalWorkflow,
      retriesBackoffTestWorkflow,
      subTaskWorkflow,
      subTaskFailsWorkflow,
      longRunningWorkflow,
      parallelTaskWorkflow,
    ],
  },
  editor: lexicalEditor(),
  onInit: async (payload) => {
    if (process.env.SEED_IN_CONFIG_ONINIT !== 'false') {
      await seed(payload)
    }
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
```

--------------------------------------------------------------------------------

````
