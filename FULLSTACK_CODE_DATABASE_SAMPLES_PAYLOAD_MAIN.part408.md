---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 408
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 408 of 695)

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

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/providers/RouteTransition/index.tsx
Signals: React, Next.js

```typescript
'use client'
import React, { startTransition, useCallback, useEffect, useOptimistic, useRef } from 'react'

/**
 * Route transitions are useful in showing immediate visual feedback to the user when navigating between pages. This is especially useful on slow networks when navigating to data heavy or process intensive pages.
 * To use route transitions, place the `RouteTransitionProvider` at the root of your application, outside of the `ProgressBar` component.
 * To trigger a route transition, use the `Link` component from `@payloadcms/ui`,
 * or wrap a callback function with the `startRouteTransition` method.
 * To gain access to the `RouteTransitionContext`, call the `useRouteTransition` hook in your component.
 * @returns A context provider with methods and state for transitioning between routes, including `isTransitioning`, `startRouteTransition`, and `transitionProgress`.
 * @example
 * import { RouteTransitionProvider, ProgressBar, Link } from '@payloadcms/ui'
 * const App = () => (
 *  <RouteTransitionProvider>
 *   <ProgressBar />
 *   <Link href="/somewhere">Go Somewhere</Link>
 *  </RouteTransitionProvider>
 * )
 */
export const RouteTransitionProvider: React.FC<RouteTransitionProps> = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useOptimistic(false)
  const [transitionProgress, setTransitionProgress] = React.useState<number>(0)

  const transitionProgressRef = useRef(transitionProgress)

  const timerID = useRef(null)

  const initiateProgress = useCallback(() => {
    timerID.current = setInterval(() => {
      // randomly update progress using an exponential curve
      // cap the progress to ensure it never fully reaches completion
      // accelerate quickly then decelerate slowly
      const maxProgress = 0.93
      const jumpFactor = 0.2 // lower to reduce jumps in progress
      const growthFactor = 0.75 // adjust to control acceleration
      const slowdownFactor = 0.75 // adjust to control deceleration

      const newProgress =
        transitionProgressRef.current +
        (maxProgress - transitionProgressRef.current) *
          Math.random() *
          jumpFactor *
          Math.pow(Math.log(1 + (1 - transitionProgressRef.current) * growthFactor), slowdownFactor)

      setTransitionProgress(newProgress)
      transitionProgressRef.current = newProgress
    }, 250) // every n ms, update progress
  }, [])

  useEffect(() => {
    setTransitionProgress(0)
    transitionProgressRef.current = 0

    if (isTransitioning) {
      initiateProgress()
    } else {
      if (timerID.current) {
        clearInterval(timerID.current)
      }
    }
  }, [isTransitioning, initiateProgress])

  const startRouteTransition: StartRouteTransition = useCallback(
    (callback?: () => void) => {
      startTransition(() => {
        setIsTransitioning(true)

        if (typeof callback === 'function') {
          callback()
        }
      })
    },
    [setIsTransitioning],
  )

  return (
    <RouteTransitionContext value={{ isTransitioning, startRouteTransition, transitionProgress }}>
      {children}
    </RouteTransitionContext>
  )
}

type RouteTransitionProps = {
  children: React.ReactNode
}

type StartRouteTransition = (callback?: () => void) => void

type RouteTransitionContextValue = {
  isTransitioning: boolean
  startRouteTransition: StartRouteTransition
  transitionProgress: number
}

const RouteTransitionContext = React.createContext<RouteTransitionContextValue>({
  isTransitioning: false,
  startRouteTransition: () => undefined,
  transitionProgress: 0,
})

/**
 * Use this hook to access the `RouteTransitionContext` provided by the `RouteTransitionProvider`.
 * To start a transition, fire the `startRouteTransition` method with a provided callback to run while the transition takes place.
 * @returns The `RouteTransitionContext` needed for transitioning between routes, including `isTransitioning`, `startRouteTransition`, and `transitionProgress`.
 * @example
 * 'use client'
 * import React, { useCallback } from 'react'
 * import { useTransition } from '@payloadcms/ui'
 * import { useRouter } from 'next/navigation'
 *
 * const MyComponent: React.FC = () => {
 *   const router = useRouter()
 *   const { startRouteTransition } = useRouteTransition()
 *
 *   const redirectSomewhere = useCallback(() => {
 *     startRouteTransition(() => router.push('/somewhere'))
 *   }, [startRouteTransition, router])
 *
 *   // ...
 * }
 */
export const useRouteTransition = () => React.use(RouteTransitionContext)
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/providers/RouteTransition/ProgressBar/index.scss

```text
@layer payload-default {
  .progress-bar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    z-index: 9999;
    opacity: 1;

    &__progress {
      height: 100%;
      background-color: var(--theme-elevation-1000);
      transition: width ease-in var(--transition-duration);
    }

    &--fade-out {
      opacity: 0;
      transition: opacity linear var(--transition-duration);
      transition-delay: var(--transition-duration);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/providers/RouteTransition/ProgressBar/index.tsx
Signals: React

```typescript
'use client'
import React, { useEffect, useRef } from 'react'

import { useRouteTransition } from '../index.js'
import './index.scss'

const transitionDuration = 200
const baseClass = 'progress-bar'
const initialDelay = 150

/**
 * Renders a progress bar that shows the progress of a route transition.
 * Place this at the root of your application, inside of the `RouteTransitionProvider`.
 * When a transition is triggered, the progress bar will show the progress of that transition and exit when the transition is complete.
 * @returns A progress bar that shows the progress of a route transition
 * @example
 * import { RouteTransitionProvider, ProgressBar, Link } from '@payloadcms/ui'
 * const App = () => (
 * <RouteTransitionProvider>
 *  <ProgressBar />
 *  <Link href="/somewhere">Go Somewhere</Link>
 * </RouteTransitionProvider>
 */
export const ProgressBar = () => {
  const { isTransitioning, transitionProgress } = useRouteTransition()
  const [progressToShow, setProgressToShow] = React.useState<null | number>(null)
  const shouldDelayProgress = useRef(true)

  useEffect(() => {
    let clearTimerID: NodeJS.Timeout
    let delayTimerID: NodeJS.Timeout

    if (isTransitioning) {
      if (shouldDelayProgress.current) {
        delayTimerID = setTimeout(() => {
          setProgressToShow(transitionProgress)
          shouldDelayProgress.current = false
        }, initialDelay)
      } else {
        setProgressToShow(transitionProgress)
      }
    } else {
      shouldDelayProgress.current = true

      // Fast forward to 100% when the transition is complete
      // Then fade out the progress bar directly after
      setProgressToShow(1)

      // Wait for CSS transition to finish before hiding the progress bar
      // This includes both the fast-forward to 100% and the subsequent fade-out
      clearTimerID = setTimeout(() => {
        setProgressToShow(null)
      }, transitionDuration * 2)
    }

    return () => {
      clearTimeout(clearTimerID)
      clearTimeout(delayTimerID)
    }
  }, [isTransitioning, transitionProgress])

  if (typeof progressToShow === 'number') {
    return (
      <div
        className={[baseClass, progressToShow === 1 && `${baseClass}--fade-out`]
          .filter(Boolean)
          .join(' ')}
        style={{
          // @ts-expect-error - TS doesn't like custom CSS properties
          '--transition-duration': `${transitionDuration}ms`,
        }}
      >
        <div
          className={`${baseClass}__progress`}
          style={{
            width: `${(progressToShow || 0) * 100}%`,
          }}
        />
      </div>
    )
  }

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/providers/ScrollInfo/index.tsx

```typescript
'use client'
export { ScrollInfoProvider, useScrollInfo } from '@faceless-ui/scroll-info'
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/providers/SearchParams/index.tsx
Signals: React, Next.js

```typescript
'use client'

import { useSearchParams as useNextSearchParams } from 'next/navigation.js'
import * as qs from 'qs-esm'
import React, { createContext, use } from 'react'

export type SearchParamsContext = {
  searchParams: qs.ParsedQs
  stringifyParams: ({ params, replace }: { params: qs.ParsedQs; replace?: boolean }) => string
}

const initialContext: SearchParamsContext = {
  searchParams: {},
  stringifyParams: () => '',
}

const Context = createContext(initialContext)

/**
 * @deprecated
 * The SearchParamsProvider is deprecated and will be removed in the next major release. Instead, use the `useSearchParams` hook from `next/navigation` directly. See https://github.com/payloadcms/payload/pull/9581.
 * @example
 * ```tsx
 * import { useSearchParams } from 'next/navigation'
 * ```
 */
export const SearchParamsProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const nextSearchParams = useNextSearchParams()
  const searchString = nextSearchParams.toString()

  const searchParams = React.useMemo(
    () =>
      qs.parse(searchString, {
        depth: 10,
        ignoreQueryPrefix: true,
      }),
    [searchString],
  )

  const stringifyParams = React.useCallback(
    ({ params, replace = false }: { params: qs.ParsedQs; replace?: boolean }) => {
      return qs.stringify(
        {
          ...(replace ? {} : searchParams),
          ...params,
        },
        { addQueryPrefix: true },
      )
    },
    [searchParams],
  )

  return <Context value={{ searchParams, stringifyParams }}>{children}</Context>
}

/**
 * @deprecated
 * The `useSearchParams` hook is deprecated and will be removed in the next major release. Instead, use the `useSearchParams` hook from `next/navigation` directly. See https://github.com/payloadcms/payload/pull/9581.
 * @example
 * ```tsx
 * import { useSearchParams } from 'next/navigation'
 * ```
 * If you need to parse the `where` query, you can do so with the `parseSearchParams` utility.
 * ```tsx
 * import { parseSearchParams } from '@payloadcms/ui'
 * const parsedSearchParams = parseSearchParams(searchParams)
 * ```
 */
export const useSearchParams = (): SearchParamsContext => use(Context)
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/providers/Selection/index.tsx
Signals: React, Next.js

```typescript
'use client'
import type { Where } from 'payload'

import { useSearchParams } from 'next/navigation.js'
import * as qs from 'qs-esm'
import React, { createContext, use, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { parseSearchParams } from '../../utilities/parseSearchParams.js'
import { useAuth } from '../Auth/index.js'
import { useListQuery } from '../ListQuery/index.js'
import { useLocale } from '../Locale/index.js'

export enum SelectAllStatus {
  AllAvailable = 'allAvailable',
  AllInPage = 'allInPage',
  None = 'none',
  Some = 'some',
}

type SelectionContext = {
  count: number
  disableBulkDelete?: boolean
  disableBulkEdit?: boolean
  getQueryParams: (additionalParams?: Where) => string
  getSelectedIds: () => (number | string)[]
  selectAll: SelectAllStatus
  selected: Map<number | string, boolean>
  selectedIDs: (number | string)[]
  setSelection: (id: number | string) => void
  /**
   * Selects all rows on the current page within the current query.
   * If `allAvailable` is true, does not select specific IDs so that the query itself affects all rows across all pages.
   */
  toggleAll: (allAvailable?: boolean) => void
  totalDocs: number
}

const Context = createContext({
  count: undefined,
  getQueryParams: (additionalParams?: Where) => '',
  getSelectedIds: () => [],
  selectAll: undefined,
  selected: new Map(),
  selectedIDs: [],
  setSelection: (id: number | string) => {},
  toggleAll: (toggleAll: boolean) => {},
  totalDocs: undefined,
} satisfies SelectionContext)

type Props = {
  readonly children: React.ReactNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly docs: any[]
  readonly totalDocs: number
}

const reduceActiveSelections = (selected: Map<number | string, boolean>): (number | string)[] => {
  const ids = []

  for (const [key, value] of selected) {
    if (value) {
      ids.push(key)
    }
  }

  return ids
}

export const SelectionProvider: React.FC<Props> = ({ children, docs = [], totalDocs }) => {
  const contextRef = useRef({} as SelectionContext)
  const { user } = useAuth()

  const { code: locale } = useLocale()

  const [selected, setSelected] = useState<SelectionContext['selected']>(() => {
    const rows = new Map()

    docs.forEach(({ id }) => {
      rows.set(id, false)
    })

    return rows
  })

  const [selectAll, setSelectAll] = useState<SelectAllStatus>(SelectAllStatus.None)
  const [count, setCount] = useState(0)
  const searchParams = useSearchParams()
  const { query } = useListQuery()

  const toggleAll: SelectionContext['toggleAll'] = useCallback(
    (allAvailable = false) => {
      const rows = new Map()
      if (allAvailable) {
        setSelectAll(SelectAllStatus.AllAvailable)

        docs.forEach(({ id, _isLocked, _userEditing }) => {
          if (!_isLocked || _userEditing?.id === user?.id) {
            rows.set(id, true)
          }
        })
      } else if (
        // Reset back to `None` if we previously had any type of selection
        selectAll === SelectAllStatus.AllAvailable ||
        selectAll === SelectAllStatus.AllInPage
      ) {
        setSelectAll(SelectAllStatus.None)
      } else {
        docs.forEach(({ id, _isLocked, _userEditing }) => {
          if (!_isLocked || _userEditing?.id === user?.id) {
            rows.set(id, selectAll !== SelectAllStatus.Some)
          }
        })
      }

      setSelected(rows)
    },
    [docs, selectAll, user?.id],
  )

  const setSelection: SelectionContext['setSelection'] = useCallback(
    (id) => {
      const doc = docs.find((doc) => doc.id === id)

      if (doc?._isLocked && user?.id !== doc?._userEditing.id) {
        return // Prevent selection if the document is locked
      }

      const existingValue = selected.get(id)
      const isSelected = typeof existingValue === 'boolean' ? !existingValue : true

      const newMap = new Map(selected.set(id, isSelected))

      // If previously selected all and now deselecting, adjust status
      if (selectAll === SelectAllStatus.AllAvailable && !isSelected) {
        setSelectAll(SelectAllStatus.Some)
      }

      setSelected(newMap)
    },
    [selected, docs, selectAll, user?.id],
  )

  const getQueryParams = useCallback(
    (additionalWhereParams?: Where): string => {
      let where: Where

      if (selectAll === SelectAllStatus.AllAvailable) {
        const params = parseSearchParams(searchParams)?.where as Where

        where = params || {
          id: {
            not_equals: '',
          },
        }
      } else {
        const ids = []

        for (const [key, value] of selected) {
          if (value) {
            ids.push(key)
          }
        }

        where = {
          id: {
            in: ids,
          },
        }
      }

      if (additionalWhereParams) {
        where = {
          and: [{ ...additionalWhereParams }, where],
        }
      }

      return qs.stringify(
        {
          locale,
          where,
        },
        { addQueryPrefix: true },
      )
    },
    [selectAll, selected, locale, searchParams],
  )

  const getSelectedIds = useCallback(() => reduceActiveSelections(selected), [selected])

  useEffect(() => {
    if (selectAll === SelectAllStatus.AllAvailable) {
      return
    }
    let some = false
    let all = true

    if (!selected.size) {
      all = false
      some = false
    } else {
      for (const [_, value] of selected) {
        all = all && value
        some = some || value
      }
    }

    if (all && selected.size === docs.length) {
      setSelectAll(SelectAllStatus.AllInPage)
    } else if (some) {
      setSelectAll(SelectAllStatus.Some)
    } else {
      setSelectAll(SelectAllStatus.None)
    }
  }, [selectAll, selected, totalDocs, docs])

  useEffect(() => {
    let newCount = 0

    if (selectAll === SelectAllStatus.AllAvailable) {
      newCount = totalDocs
    } else {
      for (const [_, value] of selected) {
        if (value) {
          newCount++
        }
      }
    }

    setCount(newCount)
  }, [selectAll, selected, totalDocs])

  useEffect(() => {
    setSelectAll(SelectAllStatus.None)
    setSelected(new Map())
  }, [query])

  const selectedIDs = useMemo(() => reduceActiveSelections(selected), [selected])

  contextRef.current = {
    count,
    getQueryParams,
    getSelectedIds,
    selectAll,
    selected,
    selectedIDs,
    setSelection,
    toggleAll,
    totalDocs,
  }

  return <Context value={contextRef.current}>{children}</Context>
}

export const useSelection = (): SelectionContext => use(Context)
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/providers/ServerFunctions/index.tsx
Signals: React

```typescript
import type {
  AdminViewServerPropsOnly,
  BuildFormStateArgs,
  BuildTableStateArgs,
  Data,
  DocumentPreferences,
  DocumentSlots,
  FormState,
  GetFolderResultsComponentAndDataArgs,
  Locale,
  Params,
  RenderDocumentVersionsProperties,
  ServerFunction,
  ServerFunctionClient,
  SlugifyServerFunctionArgs,
} from 'payload'
import type { Slugify } from 'payload/shared'

import React, { createContext, useCallback } from 'react'

import type {
  RenderFieldServerFnArgs,
  RenderFieldServerFnReturnType,
} from '../../forms/fieldSchemasToFormState/serverFunctions/renderFieldServerFn.js'
import type { buildFormStateHandler } from '../../utilities/buildFormState.js'
import type { buildTableStateHandler } from '../../utilities/buildTableState.js'
import type { CopyDataFromLocaleArgs } from '../../utilities/copyDataFromLocale.js'
import type { getFolderResultsComponentAndDataHandler } from '../../utilities/getFolderResultsComponentAndData.js'
import type {
  schedulePublishHandler,
  SchedulePublishHandlerArgs,
} from '../../utilities/schedulePublishHandler.js'

type GetFormStateClient = (
  args: {
    signal?: AbortSignal
  } & Omit<BuildFormStateArgs, 'clientConfig' | 'req'>,
) => ReturnType<typeof buildFormStateHandler>

type SchedulePublishClient = (
  args: {
    signal?: AbortSignal
  } & Omit<SchedulePublishHandlerArgs, 'clientConfig' | 'req'>,
) => ReturnType<typeof schedulePublishHandler>

type GetTableStateClient = (
  args: {
    signal?: AbortSignal
  } & Omit<BuildTableStateArgs, 'clientConfig' | 'req'>,
) => ReturnType<typeof buildTableStateHandler>

type SlugifyClient = (
  args: {
    signal?: AbortSignal
  } & Omit<SlugifyServerFunctionArgs, 'clientConfig' | 'req'>,
) => ReturnType<Slugify>

export type RenderDocumentResult = {
  data: any
  Document: React.ReactNode
  preferences: DocumentPreferences
}

type RenderDocumentBaseArgs = {
  collectionSlug: string
  disableActions?: boolean
  docID: number | string
  drawerSlug?: string
  initialData?: Data
  initialState?: FormState
  locale?: Locale
  overrideEntityVisibility?: boolean
  paramsOverride?: AdminViewServerPropsOnly['params']
  redirectAfterCreate?: boolean
  redirectAfterDelete: boolean
  redirectAfterDuplicate: boolean
  redirectAfterRestore?: boolean
  searchParams?: Params
  /**
   * Properties specific to the versions view
   */
  versions?: RenderDocumentVersionsProperties
}

export type RenderDocumentServerFunction = ServerFunction<
  RenderDocumentBaseArgs,
  Promise<RenderDocumentResult>
>

type RenderDocumentServerFunctionHookFn = (
  // No req or importMap - those are augmented by handleServerFunctions
  args: {
    signal?: AbortSignal
  } & RenderDocumentBaseArgs,
) => Promise<RenderDocumentResult>

type CopyDataFromLocaleClient = (
  args: {
    signal?: AbortSignal
  } & Omit<CopyDataFromLocaleArgs, 'req'>,
) => Promise<{ data: Data }>

type GetDocumentSlots = (args: {
  collectionSlug: string
  id?: number | string
  signal?: AbortSignal
}) => Promise<DocumentSlots>

type GetFolderResultsComponentAndDataClient = (
  args: {
    signal?: AbortSignal
  } & Omit<GetFolderResultsComponentAndDataArgs, 'req'>,
) => ReturnType<typeof getFolderResultsComponentAndDataHandler>

type RenderFieldClient = (args: RenderFieldServerFnArgs) => Promise<RenderFieldServerFnReturnType>

export type ServerFunctionsContextType = {
  _internal_renderField: RenderFieldClient
  copyDataFromLocale: CopyDataFromLocaleClient
  getDocumentSlots: GetDocumentSlots
  getFolderResultsComponentAndData: GetFolderResultsComponentAndDataClient
  getFormState: GetFormStateClient
  getTableState: GetTableStateClient
  renderDocument: RenderDocumentServerFunctionHookFn
  schedulePublish: SchedulePublishClient
  serverFunction: ServerFunctionClient
  slugify: SlugifyClient
}

export const ServerFunctionsContext = createContext<ServerFunctionsContextType | undefined>(
  undefined,
)

export const useServerFunctions = () => {
  const context = React.use(ServerFunctionsContext)
  if (context === undefined) {
    throw new Error('useServerFunctions must be used within a ServerFunctionsProvider')
  }
  return context
}

export const ServerFunctionsProvider: React.FC<{
  children: React.ReactNode
  serverFunction: ServerFunctionClient
}> = ({ children, serverFunction }) => {
  if (!serverFunction) {
    throw new Error('ServerFunctionsProvider requires a serverFunction prop')
  }

  const getDocumentSlots = useCallback<GetDocumentSlots>(
    async (args) =>
      await serverFunction({
        name: 'render-document-slots',
        args,
      }),
    [serverFunction],
  )

  const schedulePublish = useCallback<SchedulePublishClient>(
    async (args) => {
      const { signal: remoteSignal, ...rest } = args

      try {
        if (!remoteSignal?.aborted) {
          const result = (await serverFunction({
            name: 'schedule-publish',
            args: { ...rest },
          })) as Awaited<ReturnType<typeof schedulePublishHandler>> // TODO: infer this type when `strictNullChecks` is enabled

          if (!remoteSignal?.aborted) {
            return result
          }
        }
      } catch (_err) {
        console.error(_err) // eslint-disable-line no-console
      }

      let error = `Error scheduling ${rest.type}`

      if (rest.doc) {
        error += ` for document with ID ${rest.doc.value} in collection ${rest.doc.relationTo}`
      }

      return { error }
    },
    [serverFunction],
  )

  const getFormState = useCallback<GetFormStateClient>(
    async (args) => {
      const { signal: remoteSignal, ...rest } = args || {}

      try {
        if (!remoteSignal?.aborted) {
          const result = (await serverFunction({
            name: 'form-state',
            args: { fallbackLocale: false, ...rest },
          })) as Awaited<ReturnType<typeof buildFormStateHandler>> // TODO: infer this type when `strictNullChecks` is enabled

          if (!remoteSignal?.aborted) {
            return result
          }
        }
      } catch (_err) {
        console.error(_err) // eslint-disable-line no-console
      }

      return { state: null }
    },
    [serverFunction],
  )

  const getTableState = useCallback<GetTableStateClient>(
    async (args) => {
      const { signal: remoteSignal, ...rest } = args || {}

      try {
        if (!remoteSignal?.aborted) {
          const result = (await serverFunction({
            name: 'table-state',
            args: { fallbackLocale: false, ...rest },
          })) as Awaited<ReturnType<typeof buildTableStateHandler>> // TODO: infer this type when `strictNullChecks` is enabled

          if (!remoteSignal?.aborted) {
            return result
          }
        }
      } catch (_err) {
        console.error(_err) // eslint-disable-line no-console
      }

      // return { state: args.formState }
    },
    [serverFunction],
  )

  const renderDocument = useCallback<RenderDocumentServerFunctionHookFn>(
    async (args) => {
      const { signal: remoteSignal, ...rest } = args || {}
      try {
        const result = (await serverFunction({
          name: 'render-document',
          args: {
            fallbackLocale: false,
            ...rest,
          } as Parameters<RenderDocumentServerFunctionHookFn>[0],
        })) as Awaited<ReturnType<RenderDocumentServerFunctionHookFn>> // TODO: infer this type when `strictNullChecks` is enabled

        return result
      } catch (_err) {
        console.error(_err) // eslint-disable-line no-console
      }
    },
    [serverFunction],
  )

  const copyDataFromLocale = useCallback<CopyDataFromLocaleClient>(
    async (args) => {
      const { signal: remoteSignal, ...rest } = args || {}

      try {
        const result = (await serverFunction({
          name: 'copy-data-from-locale',
          args: rest,
        })) as { data: Data }

        if (!remoteSignal?.aborted) {
          return result
        }
      } catch (_err) {
        console.error(_err) // eslint-disable-line no-console
      }
    },
    [serverFunction],
  )

  const getFolderResultsComponentAndData = useCallback<GetFolderResultsComponentAndDataClient>(
    async (args) => {
      const { signal: remoteSignal, ...rest } = args || {}

      try {
        const result = (await serverFunction({
          name: 'get-folder-results-component-and-data',
          args: rest,
        })) as Awaited<ReturnType<typeof getFolderResultsComponentAndDataHandler>>

        if (!remoteSignal?.aborted) {
          return result
        }
      } catch (_err) {
        console.error(_err) // eslint-disable-line no-console
      }
    },
    [serverFunction],
  )

  const _internal_renderField = useCallback<RenderFieldClient>(
    async (args) => {
      try {
        const result = (await serverFunction({
          name: 'render-field',
          args,
        })) as RenderFieldServerFnReturnType

        return result
      } catch (_err) {
        console.error(_err) // eslint-disable-line no-console
      }
    },
    [serverFunction],
  )

  const slugify = useCallback<SlugifyClient>(
    async (args) => {
      const { signal: remoteSignal, ...rest } = args || {}

      try {
        const result = (await serverFunction({
          name: 'slugify',
          args: { ...rest },
        })) as Awaited<ReturnType<Slugify>> // TODO: infer this type when `strictNullChecks` is enabled

        return result
      } catch (_err) {
        console.error(_err) // eslint-disable-line no-console
      }
    },
    [serverFunction],
  )

  return (
    <ServerFunctionsContext
      value={{
        _internal_renderField,
        copyDataFromLocale,
        getDocumentSlots,
        getFolderResultsComponentAndData,
        getFormState,
        getTableState,
        renderDocument,
        schedulePublish,
        serverFunction,
        slugify,
      }}
    >
      {children}
    </ServerFunctionsContext>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: context.ts]---
Location: payload-main/packages/ui/src/providers/TableColumns/context.ts
Signals: React

```typescript
import { createContext, use } from 'react'

import type { ITableColumns } from './types.js'

export const TableColumnContext = createContext<ITableColumns>({} as ITableColumns)

export const useTableColumns = (): ITableColumns => use(TableColumnContext)
```

--------------------------------------------------------------------------------

---[FILE: getInitialColumns.ts]---
Location: payload-main/packages/ui/src/providers/TableColumns/getInitialColumns.ts

```typescript
import type { ClientField, CollectionConfig, CollectionPreferences, Field } from 'payload'

import { fieldAffectsData } from 'payload/shared'

const getRemainingColumns = <T extends ClientField[] | Field[]>(
  fields: T,
  useAsTitle: string,
): CollectionPreferences['columns'] =>
  fields?.reduce((remaining, field) => {
    if (fieldAffectsData(field) && field.name === useAsTitle) {
      return remaining
    }

    if (!fieldAffectsData(field) && 'fields' in field) {
      return [...remaining, ...getRemainingColumns(field.fields, useAsTitle)]
    }

    if (field.type === 'tabs' && 'tabs' in field) {
      return [
        ...remaining,
        ...field.tabs.reduce(
          (tabFieldColumns, tab) => [
            ...tabFieldColumns,
            ...('name' in tab ? [tab.name] : getRemainingColumns(tab.fields, useAsTitle)),
          ],
          [],
        ),
      ]
    }

    return [...remaining, field.name]
  }, [])

/**
 * Returns the initial columns to display in the table based on the following criteria:
 * 1. If `defaultColumns` is set in the collection config, use those columns
 * 2. Otherwise take `useAtTitle, if set, and the next 3 fields that are not hidden or disabled
 */
export const getInitialColumns = <T extends ClientField[] | Field[]>(
  fields: T,
  useAsTitle: CollectionConfig['admin']['useAsTitle'],
  defaultColumns: CollectionConfig['admin']['defaultColumns'],
): CollectionPreferences['columns'] => {
  let initialColumns = []

  if (Array.isArray(defaultColumns) && defaultColumns.length >= 1) {
    initialColumns = defaultColumns
  } else {
    if (useAsTitle) {
      initialColumns.push(useAsTitle)
    }

    const remainingColumns = getRemainingColumns(fields, useAsTitle)

    initialColumns = initialColumns.concat(remainingColumns)
    initialColumns = initialColumns.slice(0, 4)
  }

  return initialColumns.map((column) => ({
    accessor: column,
    active: true,
  }))
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/providers/TableColumns/index.tsx
Signals: React

```typescript
'use client'
import { type Column } from 'payload'
import { transformColumnsToSearchParams } from 'payload/shared'
import React, { startTransition, useCallback, useRef } from 'react'

import type { ITableColumns, TableColumnsProviderProps } from './types.js'

import { useConfig } from '../../providers/Config/index.js'
import { useListQuery } from '../../providers/ListQuery/index.js'
import { TableColumnContext } from './context.js'

export { useTableColumns } from './context.js'

export const TableColumnsProvider: React.FC<TableColumnsProviderProps> = ({
  children,
  collectionSlug,
  columnState: columnStateFromProps,
  LinkedCellOverride,
}) => {
  const { getEntityConfig } = useConfig()
  const { query: currentQuery, refineListData } = useListQuery()

  const { admin: { defaultColumns } = {} } = getEntityConfig({
    collectionSlug,
  })

  const [columnState, setOptimisticColumnState] = React.useOptimistic(
    columnStateFromProps,
    (state, action: Column[]) => action,
  )

  const contextRef = useRef({} as ITableColumns)

  const toggleColumn = useCallback(
    async (column: string) => {
      const newColumnState = (columnState || []).map((col) => {
        if (col.accessor === column) {
          return { ...col, active: !col.active }
        }
        return col
      })

      startTransition(() => {
        setOptimisticColumnState(newColumnState)
      })

      await refineListData({
        columns: transformColumnsToSearchParams(newColumnState),
      })
    },
    [refineListData, columnState, setOptimisticColumnState],
  )

  const moveColumn = useCallback(
    async (args: { fromIndex: number; toIndex: number }) => {
      const { fromIndex, toIndex } = args
      const newColumnState = [...(columnState || [])]
      const [columnToMove] = newColumnState.splice(fromIndex, 1)
      newColumnState.splice(toIndex, 0, columnToMove)

      startTransition(() => {
        setOptimisticColumnState(newColumnState)
      })

      await refineListData({
        columns: transformColumnsToSearchParams(newColumnState),
      })
    },
    [columnState, refineListData, setOptimisticColumnState],
  )

  const setActiveColumns = useCallback(
    async (columns: string[]) => {
      const newColumnState = currentQuery.columns

      columns.forEach((colName) => {
        const colIndex = newColumnState.findIndex((c) => colName === c)

        // ensure the name does not begin with a `-` which denotes an inactive column
        if (colIndex !== undefined && newColumnState[colIndex][0] === '-') {
          newColumnState[colIndex] = colName.slice(1)
        }
      })

      await refineListData({ columns: newColumnState })
    },
    [currentQuery, refineListData],
  )

  const resetColumnsState = React.useCallback(async () => {
    await refineListData({ columns: defaultColumns || [] })
  }, [defaultColumns, refineListData])

  return (
    <TableColumnContext
      value={{
        columns: columnState,
        LinkedCellOverride,
        moveColumn,
        resetColumnsState,
        setActiveColumns,
        toggleColumn,
        ...contextRef.current,
      }}
    >
      {children}
    </TableColumnContext>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/ui/src/providers/TableColumns/types.ts

```typescript
import type { CollectionPreferences, Column } from 'payload'

import type { SortColumnProps } from '../../elements/SortColumn/index.js'

export interface ITableColumns {
  columns: Column[]
  LinkedCellOverride?: React.ReactNode
  moveColumn: (args: { fromIndex: number; toIndex: number }) => Promise<void>
  resetColumnsState: () => Promise<void>
  setActiveColumns: (columns: string[]) => Promise<void>
  toggleColumn: (column: string) => Promise<void>
}

export type TableColumnsProviderProps = {
  readonly children: React.ReactNode
  readonly collectionSlug: string | string[]
  readonly columnState: Column[]
  /**
   * @deprecated
   */
  readonly docs?: any[]
  /**
   * @deprecated
   */
  readonly enableRowSelections?: boolean
  readonly LinkedCellOverride?: React.ReactNode
  /**
   * @deprecated
   */
  readonly listPreferences?: CollectionPreferences
  /**
   * @deprecated
   */
  readonly preferenceKey?: string
  /**
   * @deprecated
   */
  readonly renderRowTypes?: boolean
  /**
   * @deprecated
   */
  readonly setTable?: (Table: React.ReactNode) => void
  /**
   * @deprecated
   */
  readonly sortColumnProps?: Partial<SortColumnProps>
  /**
   * @deprecated
   */
  readonly tableAppearance?: 'condensed' | 'default'
}
```

--------------------------------------------------------------------------------

---[FILE: filterFields.tsx]---
Location: payload-main/packages/ui/src/providers/TableColumns/buildColumnState/filterFields.tsx

```typescript
import type { ClientField, Field } from 'payload'

import { fieldIsHiddenOrDisabled, fieldIsID } from 'payload/shared'

/**
 * Filters fields that are hidden, disabled, or have `disableListColumn` set to `true`.
 * Recurses through `tabs` and any container with `.fields` (e.g., `row`, `group`, `collapsible`).
 */
export const filterFields = <T extends ClientField | Field>(incomingFields: T[]): T[] => {
  const shouldSkipField = (field: T): boolean =>
    (field.type !== 'ui' && fieldIsHiddenOrDisabled(field) && !fieldIsID(field)) ||
    field?.admin?.disableListColumn === true

  return (incomingFields ?? []).reduce<T[]>((acc, field) => {
    if (shouldSkipField(field)) {
      return acc
    }

    // handle tabs
    if (field.type === 'tabs' && 'tabs' in field) {
      const formattedField: T = {
        ...field,
        tabs: field.tabs.map((tab) => ({
          ...tab,
          fields: filterFields(tab.fields as T[]),
        })),
      }
      acc.push(formattedField)
      return acc
    }

    // handle fields with subfields (row, group, collapsible, etc.)
    if ('fields' in field && Array.isArray(field.fields)) {
      const formattedField: T = {
        ...field,
        fields: filterFields(field.fields as T[]),
      }
      acc.push(formattedField)
      return acc
    }

    // leaf
    acc.push(field)
    return acc
  }, [])
}
```

--------------------------------------------------------------------------------

---[FILE: filterFieldsWithPermissions.tsx]---
Location: payload-main/packages/ui/src/providers/TableColumns/buildColumnState/filterFieldsWithPermissions.tsx

```typescript
import type {
  ClientField,
  Field,
  SanitizedFieldPermissions,
  SanitizedFieldsPermissions,
} from 'payload'

import { fieldAffectsData, fieldIsHiddenOrDisabled, fieldIsID } from 'payload/shared'

const shouldSkipField = (field: ClientField | Field): boolean =>
  (field.type !== 'ui' && fieldIsHiddenOrDisabled(field) && !fieldIsID(field)) ||
  field?.admin?.disableListColumn === true

export const filterFieldsWithPermissions = <T extends ClientField | Field = ClientField>({
  fieldPermissions,
  fields,
}: {
  fieldPermissions?: SanitizedFieldPermissions | SanitizedFieldsPermissions
  fields: (ClientField | Field)[]
}): T[] => {
  return (fields ?? []).reduce((acc, field) => {
    if (shouldSkipField(field)) {
      return acc
    }

    // handle tabs
    if (field.type === 'tabs' && 'tabs' in field) {
      const formattedField = {
        ...field,
        tabs: field.tabs.map((tab) => ({
          ...tab,
          fields: filterFieldsWithPermissions<T>({
            fieldPermissions:
              typeof fieldPermissions === 'boolean'
                ? fieldPermissions
                : 'name' in tab && tab.name
                  ? fieldPermissions[tab.name]?.fields || fieldPermissions[tab.name]
                  : fieldPermissions,
            fields: tab.fields,
          }),
        })),
      } as ClientField | Field
      acc.push(formattedField)
      return acc
    }

    // handle fields with subfields (row, group, collapsible, etc.)
    if ('fields' in field && Array.isArray(field.fields)) {
      const formattedField = {
        ...field,
        fields: filterFieldsWithPermissions<T>({
          fieldPermissions:
            typeof fieldPermissions === 'boolean'
              ? fieldPermissions
              : 'name' in field && field.name
                ? fieldPermissions?.[field.name]?.fields || fieldPermissions?.[field.name]
                : fieldPermissions,
          fields: field.fields,
        }),
      } as ClientField | Field
      acc.push(formattedField)
      return acc
    }

    if (fieldPermissions === true) {
      acc.push(field)
      return acc
    }

    if (fieldAffectsData(field)) {
      const fieldPermission = fieldPermissions?.[field.name]
      // Always allow ID fields, or if explicitly granted (true or { read: true })
      // undefined means field is not in permissions object = denied
      if (fieldIsID(field) || fieldPermission === true || fieldPermission?.read === true) {
        acc.push(field)
      }
      return acc
    }

    // leaf
    acc.push(field)
    return acc
  }, [])
}
```

--------------------------------------------------------------------------------

````
