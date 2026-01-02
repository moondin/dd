---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 210
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 210 of 695)

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

---[FILE: constraints.ts]---
Location: payload-main/packages/payload/src/query-presets/constraints.ts

```typescript
import { getTranslation } from '@payloadcms/translations'

import type { Config } from '../config/types.js'
import type { Field, Option } from '../fields/config/types.js'
import type { QueryPresetConstraint } from './types.js'

import { fieldAffectsData } from '../fields/config/types.js'
import { toWords } from '../utilities/formatLabels.js'
import { preventLockout } from './preventLockout.js'
import { operations } from './types.js'

const defaultConstraintOptions: Option[] = [
  {
    label: 'Everyone',
    value: 'everyone',
  },
  {
    label: 'Only Me',
    value: 'onlyMe',
  },
  {
    label: 'Specific Users',
    value: 'specificUsers',
  },
]

export const getConstraints = (config: Config): Field => ({
  name: 'access',
  type: 'group',
  admin: {
    components: {
      Cell: '@payloadcms/ui#QueryPresetsAccessCell',
    },
    condition: (data) => Boolean(data?.isShared),
  },
  fields: operations.map((constraintOperation) => ({
    type: 'collapsible',
    fields: [
      {
        name: constraintOperation,
        type: 'group',
        admin: {
          hideGutter: true,
        },
        fields: [
          {
            name: 'constraint',
            type: 'select',
            defaultValue: 'onlyMe',
            filterOptions: (args) =>
              typeof config?.queryPresets?.filterConstraints === 'function'
                ? config.queryPresets.filterConstraints(args)
                : args.options,
            label: ({ i18n }) =>
              `Specify who can ${constraintOperation} this ${getTranslation(config.queryPresets?.labels?.singular || 'Preset', i18n)}`,
            options: [
              ...defaultConstraintOptions,
              ...(config?.queryPresets?.constraints?.[constraintOperation]?.map(
                (option: QueryPresetConstraint) => ({
                  label: option.label,
                  value: option.value,
                }),
              ) || []),
            ],
          },
          {
            name: 'users',
            type: 'relationship',
            admin: {
              condition: (data) =>
                Boolean(data?.access?.[constraintOperation]?.constraint === 'specificUsers'),
            },
            hasMany: true,
            hooks: {
              beforeChange: [
                ({ data, req }) => {
                  if (data?.access?.[constraintOperation]?.constraint === 'onlyMe' && req.user) {
                    return [req.user.id]
                  }

                  if (
                    data?.access?.[constraintOperation]?.constraint === 'specificUsers' &&
                    req.user
                  ) {
                    return [...(data?.access?.[constraintOperation]?.users || []), req.user.id]
                  }
                },
              ],
            },
            relationTo: config.admin?.user ?? 'users', // TODO: remove this fallback when the args are properly typed as `SanitizedConfig`
          },
          ...(config?.queryPresets?.constraints?.[constraintOperation]?.reduce(
            (acc: Field[], option: QueryPresetConstraint) => {
              option.fields?.forEach((field, index) => {
                acc.push({ ...field })

                if (fieldAffectsData(field)) {
                  acc[index]!.admin = {
                    ...(acc[index]?.admin || {}),
                    condition: (data) =>
                      Boolean(data?.access?.[constraintOperation]?.constraint === option.value),
                  }
                }
              })

              return acc
            },
            [] as Field[],
          ) || []),
        ],
        label: false,
      },
    ],
    label: () => toWords(constraintOperation),
  })),
  label: 'Sharing settings',
  validate: preventLockout,
})
```

--------------------------------------------------------------------------------

---[FILE: preventLockout.ts]---
Location: payload-main/packages/payload/src/query-presets/preventLockout.ts

```typescript
import type { Validate } from '../fields/config/types.js'

import { APIError } from '../errors/APIError.js'
import { createLocalReq } from '../utilities/createLocalReq.js'
import { initTransaction } from '../utilities/initTransaction.js'
import { killTransaction } from '../utilities/killTransaction.js'
import { queryPresetsCollectionSlug } from './config.js'

/**
 * Prevents "accidental lockouts" where a user makes an update that removes their own access to the preset.
 * This is effectively an access control function proxied through a `validate` function.
 * How it works:
 *   1. Creates a temporary record with the incoming data
 *   2. Attempts to read and update that record with the incoming user
 *   3. If either of those fail, throws an error to the user
 *   4. Once finished, prevents the temp record from persisting to the database
 */
export const preventLockout: Validate = async (
  value,
  { data, overrideAccess, req: incomingReq },
) => {
  // Use context to ensure an infinite loop doesn't occur
  if (!incomingReq.context._preventLockout && !overrideAccess) {
    const req = await createLocalReq(
      {
        context: {
          _preventLockout: true,
        },
        req: {
          user: incomingReq.user,
        },
      },
      incomingReq.payload,
    )

    // Might be `null` if no transactions are enabled
    const transaction = await initTransaction(req)

    // create a temp record to validate the constraints, using the req
    const tempPreset = await req.payload.create({
      collection: queryPresetsCollectionSlug,
      data: {
        ...data,
        isTemp: true,
      },
      req,
    })

    let canUpdate = false
    let canRead = false

    try {
      await req.payload.findByID({
        id: tempPreset.id,
        collection: queryPresetsCollectionSlug,
        overrideAccess: false,
        req,
        user: req.user,
      })

      canRead = true

      await req.payload.update({
        id: tempPreset.id,
        collection: queryPresetsCollectionSlug,
        data: tempPreset,
        overrideAccess: false,
        req,
        user: req.user,
      })

      canUpdate = true
    } catch (_err) {
      if (!canRead || !canUpdate) {
        throw new APIError('This action will lock you out of this preset.', 403, {}, true)
      }
    } finally {
      if (transaction) {
        await killTransaction(req)
      } else {
        // delete the temp record
        await req.payload.delete({
          id: tempPreset.id,
          collection: queryPresetsCollectionSlug,
          req,
        })
      }
    }
  }

  return true as unknown as true
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/payload/src/query-presets/types.ts

```typescript
import type { Field } from '../fields/config/types.js'
import type { Access, CollectionSlug } from '../index.js'
import type { CollectionPreferences } from '../preferences/types.js'
import type { Where } from '../types/index.js'

// Note: order matters here as it will change the rendered order in the UI
export const operations = ['read', 'update', 'delete'] as const

export type ConstraintOperation = (typeof operations)[number]

export type DefaultConstraint = 'everyone' | 'onlyMe' | 'specificUsers'

export type Constraint = DefaultConstraint | string // TODO: type `string` as the custom constraints provided by the config

export type QueryPreset = {
  access: {
    [operation in ConstraintOperation]: {
      constraint: DefaultConstraint
      users?: string[]
    }
  }
  columns: CollectionPreferences['columns']
  groupBy?: string
  id: number | string
  isShared: boolean
  relatedCollection: CollectionSlug
  title: string
  where: Where
}

export type QueryPresetConstraint = {
  access: Access<QueryPreset>
  fields?: Field[]
  label: string
  value: string
}

export type QueryPresetConstraints = QueryPresetConstraint[]
```

--------------------------------------------------------------------------------

---[FILE: localAPI.ts]---
Location: payload-main/packages/payload/src/queues/localAPI.ts

```typescript
import type { BaseJob, RunningJobFromTask } from './config/types/workflowTypes.js'

import {
  createLocalReq,
  Forbidden,
  type Job,
  type Payload,
  type PayloadRequest,
  type Sort,
  type TypedJobs,
  type Where,
} from '../index.js'
import { jobAfterRead, jobsCollectionSlug } from './config/collection.js'
import { handleSchedules, type HandleSchedulesResult } from './operations/handleSchedules/index.js'
import { runJobs } from './operations/runJobs/index.js'
import { updateJob, updateJobs } from './utilities/updateJob.js'

export type RunJobsSilent =
  | {
      error?: boolean
      info?: boolean
    }
  | boolean
export const getJobsLocalAPI = (payload: Payload) => ({
  handleSchedules: async (args?: {
    /**
     * If you want to schedule jobs from all queues, set this to true.
     * If you set this to true, the `queue` property will be ignored.
     *
     * @default false
     */
    allQueues?: boolean
    // By default, schedule all queues - only scheduling jobs scheduled to be added to the `default` queue would not make sense
    // here, as you'd usually specify a different queue than `default` here, especially if this is used in combination with autorun.
    // The `queue` property for setting up schedules is required, and not optional.
    /**
     * If you want to only schedule jobs that are set to schedule in a specific queue, set this to the queue name.
     *
     * @default jobs from the `default` queue will be executed.
     */
    queue?: string
    req?: PayloadRequest
  }): Promise<HandleSchedulesResult> => {
    const newReq: PayloadRequest = args?.req ?? (await createLocalReq({}, payload))

    return await handleSchedules({
      allQueues: args?.allQueues,
      queue: args?.queue,
      req: newReq,
    })
  },
  queue: async <
    // eslint-disable-next-line @typescript-eslint/no-duplicate-type-constituents
    TTaskOrWorkflowSlug extends keyof TypedJobs['tasks'] | keyof TypedJobs['workflows'],
  >(
    args:
      | {
          input: TypedJobs['tasks'][TTaskOrWorkflowSlug]['input']
          meta?: BaseJob['meta']
          /**
           * If set to false, access control as defined in jobsConfig.access.queue will be run.
           * By default, this is true and no access control will be run.
           * If you set this to false and do not have jobsConfig.access.queue defined, the default access control will be
           * run (which is a function that returns `true` if the user is logged in).
           *
           * @default true
           */
          overrideAccess?: boolean
          queue?: string
          req?: PayloadRequest
          task: TTaskOrWorkflowSlug extends keyof TypedJobs['tasks'] ? TTaskOrWorkflowSlug : never
          waitUntil?: Date
          workflow?: never
        }
      | {
          input: TypedJobs['workflows'][TTaskOrWorkflowSlug]['input']
          meta?: BaseJob['meta']
          /**
           * If set to false, access control as defined in jobsConfig.access.queue will be run.
           * By default, this is true and no access control will be run.
           * If you set this to false and do not have jobsConfig.access.queue defined, the default access control will be
           * run (which is a function that returns `true` if the user is logged in).
           *
           * @default true
           */
          overrideAccess?: boolean
          queue?: string
          req?: PayloadRequest
          task?: never
          waitUntil?: Date
          workflow: TTaskOrWorkflowSlug extends keyof TypedJobs['workflows']
            ? TTaskOrWorkflowSlug
            : never
        },
  ): Promise<
    TTaskOrWorkflowSlug extends keyof TypedJobs['workflows']
      ? Job<TTaskOrWorkflowSlug>
      : RunningJobFromTask<TTaskOrWorkflowSlug>
  > => {
    const overrideAccess = args?.overrideAccess !== false
    const req: PayloadRequest = args.req ?? (await createLocalReq({}, payload))

    if (!overrideAccess) {
      /**
       * By default, jobsConfig.access.queue will be `defaultAccess` which is a function that returns `true` if the user is logged in.
       */
      const accessFn = payload.config.jobs?.access?.queue ?? (() => true)
      const hasAccess = await accessFn({ req })
      if (!hasAccess) {
        throw new Forbidden(req.t)
      }
    }

    let queue: string | undefined = undefined

    // If user specifies queue, use that
    if (args.queue) {
      queue = args.queue
    } else if (args.workflow) {
      // Otherwise, if there is a workflow specified, and it has a default queue to use,
      // use that
      const workflow = payload.config.jobs?.workflows?.find(({ slug }) => slug === args.workflow)
      if (workflow?.queue) {
        queue = workflow.queue
      }
    }

    const data: Partial<Job> = {
      input: args.input,
    }

    if (queue) {
      data.queue = queue
    }
    if (args.waitUntil) {
      data.waitUntil = args.waitUntil?.toISOString()
    }
    if (args.workflow) {
      data.workflowSlug = args.workflow as string
    }
    if (args.task) {
      data.taskSlug = args.task as string
    }

    if (args.meta) {
      data.meta = args.meta
    }

    type ReturnType = TTaskOrWorkflowSlug extends keyof TypedJobs['workflows']
      ? Job<TTaskOrWorkflowSlug>
      : RunningJobFromTask<TTaskOrWorkflowSlug> // Type assertion is still needed here

    if (payload?.config?.jobs?.depth || payload?.config?.jobs?.runHooks) {
      return (await payload.create({
        collection: jobsCollectionSlug,
        data,
        depth: payload.config.jobs.depth ?? 0,
        overrideAccess,
        req,
      })) as ReturnType
    } else {
      return jobAfterRead({
        config: payload.config,
        doc: await payload.db.create({
          collection: jobsCollectionSlug,
          data,
          req,
        }),
      }) as unknown as ReturnType
    }
  },

  run: async (args?: {
    /**
     * If you want to run jobs from all queues, set this to true.
     * If you set this to true, the `queue` property will be ignored.
     *
     * @default false
     */
    allQueues?: boolean
    /**
     * The maximum number of jobs to run in this invocation
     *
     * @default 10
     */
    limit?: number
    /**
     * If set to false, access control as defined in jobsConfig.access.run will be run.
     * By default, this is true and no access control will be run.
     * If you set this to false and do not have jobsConfig.access.run defined, the default access control will be
     * run (which is a function that returns `true` if the user is logged in).
     *
     * @default true
     */
    overrideAccess?: boolean
    /**
     * Adjust the job processing order using a Payload sort string.
     *
     * FIFO would equal `createdAt` and LIFO would equal `-createdAt`.
     */
    processingOrder?: Sort
    /**
     * If you want to run jobs from a specific queue, set this to the queue name.
     *
     * @default jobs from the `default` queue will be executed.
     */
    queue?: string
    req?: PayloadRequest
    /**
     * By default, jobs are run in parallel.
     * If you want to run them in sequence, set this to true.
     */
    sequential?: boolean
    /**
     * If set to true, the job system will not log any output to the console (for both info and error logs).
     * Can be an option for more granular control over logging.
     *
     * This will not automatically affect user-configured logs (e.g. if you call `console.log` or `payload.logger.info` in your job code).
     *
     * @default false
     */
    silent?: RunJobsSilent
    where?: Where
  }): Promise<ReturnType<typeof runJobs>> => {
    const newReq: PayloadRequest = args?.req ?? (await createLocalReq({}, payload))

    return await runJobs({
      allQueues: args?.allQueues,
      limit: args?.limit,
      overrideAccess: args?.overrideAccess !== false,
      processingOrder: args?.processingOrder,
      queue: args?.queue,
      req: newReq,
      sequential: args?.sequential,
      silent: args?.silent,
      where: args?.where,
    })
  },

  runByID: async (args: {
    id: number | string
    /**
     * If set to false, access control as defined in jobsConfig.access.run will be run.
     * By default, this is true and no access control will be run.
     * If you set this to false and do not have jobsConfig.access.run defined, the default access control will be
     * run (which is a function that returns `true` if the user is logged in).
     *
     * @default true
     */
    overrideAccess?: boolean
    req?: PayloadRequest
    /**
     * If set to true, the job system will not log any output to the console (for both info and error logs).
     * Can be an option for more granular control over logging.
     *
     * This will not automatically affect user-configured logs (e.g. if you call `console.log` or `payload.logger.info` in your job code).
     *
     * @default false
     */
    silent?: RunJobsSilent
  }): Promise<ReturnType<typeof runJobs>> => {
    const newReq: PayloadRequest = args.req ?? (await createLocalReq({}, payload))

    return await runJobs({
      id: args.id,
      overrideAccess: args.overrideAccess !== false,
      req: newReq,
      silent: args.silent,
    })
  },

  cancel: async (args: {
    /**
     * If set to false, access control as defined in jobsConfig.access.cancel will be run.
     * By default, this is true and no access control will be run.
     * If you set this to false and do not have jobsConfig.access.cancel defined, the default access control will be
     * run (which is a function that returns `true` if the user is logged in).
     *
     * @default true
     */
    overrideAccess?: boolean
    queue?: string
    req?: PayloadRequest
    where: Where
  }): Promise<void> => {
    const req: PayloadRequest = args.req ?? (await createLocalReq({}, payload))

    const overrideAccess = args.overrideAccess !== false
    if (!overrideAccess) {
      /**
       * By default, jobsConfig.access.cancel will be `defaultAccess` which is a function that returns `true` if the user is logged in.
       */
      const accessFn = payload.config.jobs?.access?.cancel ?? (() => true)
      const hasAccess = await accessFn({ req })
      if (!hasAccess) {
        throw new Forbidden(req.t)
      }
    }

    const and: Where[] = [
      args.where,
      {
        completedAt: {
          exists: false,
        },
      },
      {
        hasError: {
          not_equals: true,
        },
      },
    ]

    if (args.queue) {
      and.push({
        queue: {
          equals: args.queue,
        },
      })
    }

    await updateJobs({
      data: {
        completedAt: null,
        error: {
          cancelled: true,
        },
        hasError: true,
        processing: false,
        waitUntil: null,
      },
      depth: 0, // No depth, since we're not returning
      disableTransaction: true,
      req,
      returning: false,
      where: { and },
    })
  },

  cancelByID: async (args: {
    id: number | string
    /**
     * If set to false, access control as defined in jobsConfig.access.cancel will be run.
     * By default, this is true and no access control will be run.
     * If you set this to false and do not have jobsConfig.access.cancel defined, the default access control will be
     * run (which is a function that returns `true` if the user is logged in).
     *
     * @default true
     */
    overrideAccess?: boolean
    req?: PayloadRequest
  }): Promise<void> => {
    const req: PayloadRequest = args.req ?? (await createLocalReq({}, payload))

    const overrideAccess = args.overrideAccess !== false
    if (!overrideAccess) {
      /**
       * By default, jobsConfig.access.cancel will be `defaultAccess` which is a function that returns `true` if the user is logged in.
       */
      const accessFn = payload.config.jobs?.access?.cancel ?? (() => true)
      const hasAccess = await accessFn({ req })
      if (!hasAccess) {
        throw new Forbidden(req.t)
      }
    }

    await updateJob({
      id: args.id,
      data: {
        completedAt: null,
        error: {
          cancelled: true,
        },
        hasError: true,
        processing: false,
        waitUntil: null,
      },
      depth: 0, // No depth, since we're not returning
      disableTransaction: true,
      req,
      returning: false,
    })
  },
})
```

--------------------------------------------------------------------------------

---[FILE: collection.ts]---
Location: payload-main/packages/payload/src/queues/config/collection.ts

```typescript
import type { CollectionConfig } from '../../collections/config/types.js'
import type { SanitizedConfig } from '../../config/types.js'
import type { Field } from '../../fields/config/types.js'
import type { Job } from '../../index.js'

import { handleSchedulesJobsEndpoint } from '../endpoints/handleSchedules.js'
import { runJobsEndpoint } from '../endpoints/run.js'
import { getJobTaskStatus } from '../utilities/getJobTaskStatus.js'

export const jobsCollectionSlug = 'payload-jobs'

export const getDefaultJobsCollection: (jobsConfig: SanitizedConfig['jobs']) => CollectionConfig = (
  jobsConfig,
) => {
  const workflowSlugs: Set<string> = new Set()
  const taskSlugs: Set<string> = new Set(['inline'])

  if (jobsConfig.workflows?.length) {
    jobsConfig.workflows.forEach((workflow) => {
      workflowSlugs.add(workflow.slug)
    })
  }

  if (jobsConfig.tasks?.length) {
    jobsConfig.tasks.forEach((task) => {
      if (workflowSlugs.has(task.slug)) {
        throw new Error(
          `Task slug "${task.slug}" is already used by a workflow. No tasks are allowed to have the same slug as a workflow.`,
        )
      }
      taskSlugs.add(task.slug)
    })
  }

  const logFields: Field[] = [
    {
      name: 'executedAt',
      type: 'date',
      required: true,
    },
    {
      name: 'completedAt',
      type: 'date',
      required: true,
    },
    {
      name: 'taskSlug',
      type: 'select',
      options: [...taskSlugs],
      required: true,
    },
    {
      name: 'taskID',
      type: 'text',
      required: true,
    },
    /**
     * @todo make required in 4.0
     */
    {
      name: 'input',
      type: 'json',
    },
    {
      name: 'output',
      type: 'json',
    },
    {
      name: 'state',
      type: 'radio',
      options: ['failed', 'succeeded'],
      required: true,
    },
    {
      name: 'error',
      type: 'json',
      admin: {
        condition: (_, data) => data.state === 'failed',
      },
      required: true,
    },
  ]

  if (jobsConfig.addParentToTaskLog) {
    logFields.push({
      name: 'parent',
      type: 'group',
      fields: [
        {
          name: 'taskSlug',
          type: 'select',
          options: [...taskSlugs],
        },
        {
          name: 'taskID',
          type: 'text',
        },
      ],
    })
  }

  const jobsCollection: CollectionConfig = {
    slug: jobsCollectionSlug,
    admin: {
      group: 'System',
      hidden: true,
    },
    endpoints: [runJobsEndpoint, handleSchedulesJobsEndpoint],
    fields: [
      {
        name: 'input',
        type: 'json',
        admin: {
          description: 'Input data provided to the job',
        },
      },
      {
        name: 'taskStatus',
        type: 'json',
        virtual: true,
      },
      {
        type: 'tabs',
        tabs: [
          {
            fields: [
              {
                name: 'completedAt',
                type: 'date',
                index: true,
              },
              {
                name: 'totalTried',
                type: 'number',
                defaultValue: 0,
                index: true,
              },
              {
                name: 'hasError',
                type: 'checkbox',
                admin: {
                  description: 'If hasError is true this job will not be retried',
                },
                defaultValue: false,
                index: true,
              },
              {
                name: 'error',
                type: 'json',
                admin: {
                  condition: (data) => data.hasError,
                  description: 'If hasError is true, this is the error that caused it',
                },
              },
              {
                name: 'log',
                type: 'array',
                admin: {
                  description: 'Task execution log',
                },
                fields: logFields,
              },
            ],
            label: 'Status',
          },
        ],
      },
      // only include the workflowSlugs field if workflows exist
      ...((workflowSlugs.size > 0
        ? [
            {
              name: 'workflowSlug',
              type: 'select',
              admin: {
                position: 'sidebar',
              },
              index: true,
              options: [...workflowSlugs],
            },
          ]
        : []) as Field[]),
      {
        name: 'taskSlug',
        type: 'select',
        admin: {
          position: 'sidebar',
        },
        index: true,
        options: [...taskSlugs],
        required: false,
      },
      {
        name: 'queue',
        type: 'text',
        admin: {
          position: 'sidebar',
        },
        defaultValue: 'default',
        index: true,
      },
      {
        name: 'waitUntil',
        type: 'date',
        admin: {
          date: { pickerAppearance: 'dayAndTime' },
        },
        index: true,
      },
      {
        name: 'processing',
        type: 'checkbox',
        admin: {
          position: 'sidebar',
        },
        defaultValue: false,
        index: true,
      },
    ],
    hooks: {
      afterRead: [
        ({ doc, req }) => {
          // This hook is used to add the virtual `tasks` field to the document, that is computed from the `log` field

          return jobAfterRead({ config: req.payload.config, doc })
        },
      ],
      /**
       * If another update comes in after a job as already been cancelled, we need to make sure that update doesn't
       * change the state of the job.
       */
      beforeChange: [
        ({ data, originalDoc }) => {
          if (originalDoc?.error?.cancelled) {
            data.processing = false
            data.hasError = true
            delete data.completedAt
            delete data.waitUntil
          }
          return data
        },
      ],
    },
    lockDocuments: false,
  }

  if (jobsConfig.stats) {
    // TODO: In 4.0, this should be added by default.
    // The meta field can be used to store arbitrary data about the job. The scheduling system uses this to store
    // `scheduled: true` to indicate that the job was queued by the scheduling system.
    jobsCollection.fields.push({
      name: 'meta',
      type: 'json',
    })
  }
  return jobsCollection
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function jobAfterRead({ config, doc }: { config: SanitizedConfig; doc: Job }): Job {
  doc.taskStatus = getJobTaskStatus({
    jobLog: doc.log || [],
  })
  doc.input = doc.input || {}
  doc.taskStatus = doc.taskStatus || {}
  return doc
}
```

--------------------------------------------------------------------------------

---[FILE: generateJobsJSONSchemas.ts]---
Location: payload-main/packages/payload/src/queues/config/generateJobsJSONSchemas.ts

```typescript
import type { I18n } from '@payloadcms/translations'
import type { JSONSchema4 } from 'json-schema'

import type { SanitizedConfig } from '../../config/types.js'
import type { JobsConfig } from './types/index.js'

import { fieldsToJSONSchema } from '../../utilities/configToJSONSchema.js'
import { flattenAllFields } from '../../utilities/flattenAllFields.js'
export function generateJobsJSONSchemas(
  config: SanitizedConfig,
  jobsConfig: JobsConfig,
  interfaceNameDefinitions: Map<string, JSONSchema4>,
  /**
   * Used for relationship fields, to determine whether to use a string or number type for the ID.
   * While there is a default ID field type set by the db adapter, they can differ on a collection-level
   * if they have custom ID fields.
   */
  collectionIDFieldTypes: { [key: string]: 'number' | 'string' },
  i18n?: I18n,
): {
  definitions?: Map<string, JSONSchema4>
  properties?: { tasks: JSONSchema4 }
} {
  const properties: { tasks: JSONSchema4; workflows: JSONSchema4 } = {
    tasks: {},
    workflows: {},
  }
  const definitions: Map<string, JSONSchema4> = new Map()

  if (jobsConfig?.tasks?.length) {
    for (const task of jobsConfig.tasks) {
      const fullTaskJsonSchema: JSONSchema4 = {
        type: 'object',
        additionalProperties: false,
        properties: {
          input: {},
          output: {},
        },
        required: [],
      }
      if (task?.inputSchema?.length) {
        const inputJsonSchema = fieldsToJSONSchema(
          collectionIDFieldTypes,
          flattenAllFields({ fields: task.inputSchema }),
          interfaceNameDefinitions,
          config,
          i18n,
        )

        const fullInputJsonSchema: JSONSchema4 = {
          type: 'object',
          additionalProperties: false,
          properties: inputJsonSchema.properties,
          required: inputJsonSchema.required,
        }

        fullTaskJsonSchema.properties!.input = fullInputJsonSchema
        ;(fullTaskJsonSchema.required as string[]).push('input')
      }
      if (task?.outputSchema?.length) {
        const outputJsonSchema = fieldsToJSONSchema(
          collectionIDFieldTypes,
          flattenAllFields({ fields: task.outputSchema }),
          interfaceNameDefinitions,
          config,
          i18n,
        )

        const fullOutputJsonSchema: JSONSchema4 = {
          type: 'object',
          additionalProperties: false,
          properties: outputJsonSchema.properties,
          required: outputJsonSchema.required,
        }

        fullTaskJsonSchema.properties!.output = fullOutputJsonSchema
        ;(fullTaskJsonSchema.required as string[]).push('output')
      }

      const normalizedTaskSlug = task.slug[0].toUpperCase() + task.slug.slice(1)

      definitions.set(task.interfaceName ?? `Task${normalizedTaskSlug}`, fullTaskJsonSchema)
    }
    // Now add properties.tasks definition that references the types in definitions keyed by task slug:
    properties.tasks = {
      type: 'object',
      additionalProperties: false,
      properties: {
        ...Object.fromEntries(
          (jobsConfig.tasks ?? []).map((task) => {
            const normalizedTaskSlug = task.slug[0].toUpperCase() + task.slug.slice(1)

            const toReturn: JSONSchema4 = {
              $ref: task.interfaceName
                ? `#/definitions/${task.interfaceName}`
                : `#/definitions/Task${normalizedTaskSlug}`,
            }

            return [task.slug, toReturn]
          }),
        ),
        inline: {
          type: 'object',
          additionalProperties: false,
          properties: {
            input: {},
            output: {},
          },
          required: ['input', 'output'],
        },
      },
      required: [...(jobsConfig.tasks ?? []).map((task) => task.slug), 'inline'],
    }
  }

  if (jobsConfig?.workflows?.length) {
    for (const workflow of jobsConfig.workflows) {
      const fullWorkflowJsonSchema: JSONSchema4 = {
        type: 'object',
        additionalProperties: false,
        properties: {
          input: {},
        },
        required: [],
      }

      if (workflow?.inputSchema?.length) {
        const inputJsonSchema = fieldsToJSONSchema(
          collectionIDFieldTypes,
          flattenAllFields({ fields: workflow.inputSchema }),
          interfaceNameDefinitions,
          config,
          i18n,
        )

        const fullInputJsonSchema: JSONSchema4 = {
          type: 'object',
          additionalProperties: false,
          properties: inputJsonSchema.properties,
          required: inputJsonSchema.required,
        }

        fullWorkflowJsonSchema.properties!.input = fullInputJsonSchema
        ;(fullWorkflowJsonSchema.required as string[]).push('input')
      }
      const normalizedWorkflowSlug = workflow.slug[0].toUpperCase() + workflow.slug.slice(1)

      definitions.set(
        workflow.interfaceName ?? `Workflow${normalizedWorkflowSlug}`,
        fullWorkflowJsonSchema,
      )

      properties.workflows = {
        type: 'object',
        additionalProperties: false,
        properties: Object.fromEntries(
          jobsConfig.workflows.map((workflow) => {
            const normalizedWorkflowSlug = workflow.slug[0].toUpperCase() + workflow.slug.slice(1)

            const toReturn: JSONSchema4 = {
              $ref: workflow.interfaceName
                ? `#/definitions/${workflow.interfaceName}`
                : `#/definitions/Workflow${normalizedWorkflowSlug}`,
            }

            return [workflow.slug, toReturn]
          }),
        ),
        required: jobsConfig.workflows.map((workflow) => workflow.slug),
      }
    }
  }

  return {
    definitions,
    properties,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: global.ts]---
Location: payload-main/packages/payload/src/queues/config/global.ts

```typescript
import type { Config } from '../../config/types.js'
import type { GlobalConfig } from '../../globals/config/types.js'
import type { TaskType } from './types/taskTypes.js'
import type { WorkflowTypes } from './types/workflowTypes.js'

export const jobStatsGlobalSlug = 'payload-jobs-stats'

/**
 * Type for data stored in the payload-jobs-stats global.
 */
export type JobStats = {
  stats?: {
    scheduledRuns?: {
      queues?: {
        [queueSlug: string]: {
          tasks?: {
            [taskSlug: TaskType]: {
              lastScheduledRun: string
            }
          }
          workflows?: {
            [workflowSlug: WorkflowTypes]: {
              lastScheduledRun: string
            }
          }
        }
      }
    }
  }
}

/**
 * Global config for job statistics.
 */
export const getJobStatsGlobal: (config: Config) => GlobalConfig = (config) => {
  return {
    slug: jobStatsGlobalSlug,
    admin: {
      group: 'System',
      hidden: true,
    },
    fields: [
      {
        name: 'stats',
        type: 'json',
      },
    ],
  }
}
```

--------------------------------------------------------------------------------

````
