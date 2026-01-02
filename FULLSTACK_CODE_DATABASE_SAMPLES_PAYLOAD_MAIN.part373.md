---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 373
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 373 of 695)

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

---[FILE: usePreventLeave.tsx]---
Location: payload-main/packages/ui/src/elements/LeaveWithoutSaving/usePreventLeave.tsx
Signals: React, Next.js

```typescript
'use client'
// Credit: @Taiki92777
//    - Source: https://github.com/vercel/next.js/discussions/32231#discussioncomment-7284386
// Credit: `react-use` maintainers
//    -  Source: https://github.com/streamich/react-use/blob/ade8d3905f544305515d010737b4ae604cc51024/src/useBeforeUnload.ts#L2
import { useRouter } from 'next/navigation.js'
import { useCallback, useEffect, useRef } from 'react'

import { useRouteTransition } from '../../providers/RouteTransition/index.js'

function on<T extends Document | EventTarget | HTMLElement | Window>(
  obj: null | T,
  ...args: [string, (() => void) | null, ...any] | Parameters<T['addEventListener']>
): void {
  if (obj && obj.addEventListener) {
    obj.addEventListener(...(args as Parameters<HTMLElement['addEventListener']>))
  }
}

function off<T extends Document | EventTarget | HTMLElement | Window>(
  obj: null | T,
  ...args: [string, (() => void) | null, ...any] | Parameters<T['removeEventListener']>
): void {
  if (obj && obj.removeEventListener) {
    obj.removeEventListener(...(args as Parameters<HTMLElement['removeEventListener']>))
  }
}

export const useBeforeUnload = (enabled: (() => boolean) | boolean = true, message?: string) => {
  const handler = useCallback(
    (event: BeforeUnloadEvent) => {
      const finalEnabled = typeof enabled === 'function' ? enabled() : true

      if (!finalEnabled) {
        return
      }

      event.preventDefault()

      if (message) {
        event.returnValue = message
      }

      return message
    },
    [enabled, message],
  )

  useEffect(() => {
    if (!enabled) {
      return
    }

    on(window, 'beforeunload', handler)

    return () => off(window, 'beforeunload', handler)
  }, [enabled, handler])
}

export const usePreventLeave = ({
  hasAccepted = false,
  message = 'Are you sure want to leave this page?',
  onAccept,
  onPrevent,
  prevent = true,
}: {
  hasAccepted: boolean
  // if no `onPrevent` is provided, the message will be displayed in a confirm dialog
  message?: string
  onAccept?: () => void
  // to use a custom confirmation dialog, provide a function that returns a boolean
  onPrevent?: () => void
  prevent: boolean
}) => {
  // check when page is about to be reloaded
  useBeforeUnload(prevent, message)
  const { startRouteTransition } = useRouteTransition()

  const router = useRouter()
  const cancelledURL = useRef<string>('')

  // check when page is about to be changed
  useEffect(() => {
    function isAnchorOfCurrentUrl(currentUrl: string, newUrl: string) {
      try {
        const currentUrlObj = new URL(currentUrl)
        const newUrlObj = new URL(newUrl)
        // Compare hostname, pathname, and search parameters
        if (
          currentUrlObj.hostname === newUrlObj.hostname &&
          currentUrlObj.pathname === newUrlObj.pathname &&
          currentUrlObj.search === newUrlObj.search
        ) {
          // Check if the new URL is just an anchor of the current URL page
          const currentHash = currentUrlObj.hash
          const newHash = newUrlObj.hash
          return (
            currentHash !== newHash &&
            currentUrlObj.href.replace(currentHash, '') === newUrlObj.href.replace(newHash, '')
          )
        }
      } catch (err) {
        console.log('Unexpected exception thrown in LeaveWithoutSaving:isAnchorOfCurrentUrl', err)
      }
      return false
    }

    function findClosestAnchor(element: HTMLElement | null): HTMLAnchorElement | null {
      while (element && element.tagName.toLowerCase() !== 'a') {
        element = element.parentElement
      }
      return element as HTMLAnchorElement
    }

    function handleClick(event: MouseEvent) {
      try {
        const target = event.target as HTMLElement
        const anchor = findClosestAnchor(target)
        if (anchor) {
          const currentUrl = window.location.href
          const newUrl = anchor.href
          const isAnchor = isAnchorOfCurrentUrl(currentUrl, newUrl)
          const isDownloadLink = anchor.download !== ''
          const isNewTab = anchor.target === '_blank' || event.metaKey || event.ctrlKey

          const isPageLeaving = !(newUrl === currentUrl || isAnchor || isDownloadLink || isNewTab)

          if (isPageLeaving && prevent && (!onPrevent ? !window.confirm(message) : true)) {
            // Keep a reference of the href
            cancelledURL.current = newUrl

            // Cancel the route change
            event.preventDefault()
            event.stopPropagation()

            if (typeof onPrevent === 'function') {
              onPrevent()
            }
          }
        }
      } catch (err) {
        console.log('Unexpected exception thrown in LeaveWithoutSaving:usePreventLeave', err)
      }
    }

    if (prevent) {
      // Add the global click event listener
      document.addEventListener('click', handleClick, true)
    }

    // Clean up the global click event listener when the component is unmounted
    return () => {
      document.removeEventListener('click', handleClick, true)
    }
  }, [onPrevent, prevent, message])

  useEffect(() => {
    if (hasAccepted && cancelledURL.current) {
      if (onAccept) {
        onAccept()
      }

      startRouteTransition(() => router.push(cancelledURL.current))
    }
  }, [hasAccepted, onAccept, router, startRouteTransition])
}
```

--------------------------------------------------------------------------------

---[FILE: formatUrl.ts]---
Location: payload-main/packages/ui/src/elements/Link/formatUrl.ts

```typescript
// Format function modified from nodejs
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

import type { UrlObject } from 'url'

const slashedProtocols = /https?|ftp|gopher|file/

function stringifyUrlQueryParam(param: unknown): string {
  if (
    typeof param === 'string' ||
    (typeof param === 'number' && !isNaN(param)) ||
    typeof param === 'boolean'
  ) {
    return String(param)
  } else {
    return ''
  }
}

export function urlQueryToSearchParams(urlQuery: UrlObject['query']): URLSearchParams {
  const result = new URLSearchParams()
  Object.entries(urlQuery).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => result.append(key, stringifyUrlQueryParam(item)))
    } else {
      result.set(key, stringifyUrlQueryParam(value))
    }
  })
  return result
}

export function formatUrl(urlObj: UrlObject) {
  let { auth } = urlObj
  const { hostname } = urlObj
  let protocol = urlObj.protocol || ''
  let pathname = urlObj.pathname || ''
  let hash = urlObj.hash || ''
  let query = urlObj.query || ''
  let host: false | string = false

  auth = auth ? encodeURIComponent(auth).replace(/%3A/i, ':') + '@' : ''

  if (urlObj.host) {
    host = auth + urlObj.host
  } else if (hostname) {
    host = auth + (~hostname.indexOf(':') ? `[${hostname}]` : hostname)
    if (urlObj.port) {
      host += ':' + urlObj.port
    }
  }

  if (query && typeof query === 'object') {
    query = String(urlQueryToSearchParams(query))
  }

  let search = urlObj.search || (query && `?${query}`) || ''

  if (protocol && !protocol.endsWith(':')) {
    protocol += ':'
  }

  if (urlObj.slashes || ((!protocol || slashedProtocols.test(protocol)) && host !== false)) {
    host = '//' + (host || '')
    if (pathname && pathname[0] !== '/') {
      pathname = '/' + pathname
    }
  } else if (!host) {
    host = ''
  }

  if (hash && hash[0] !== '#') {
    hash = '#' + hash
  }
  if (search && search[0] !== '?') {
    search = '?' + search
  }

  pathname = pathname.replace(/[?#]/g, encodeURIComponent)
  search = search.replace('#', '%23')

  return `${protocol}${host}${pathname}${search}${hash}`
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/Link/index.tsx
Signals: React, Next.js

```typescript
'use client'
import NextLinkImport from 'next/link.js'
import { useRouter } from 'next/navigation.js'
import React from 'react'

import { useRouteTransition } from '../../providers/RouteTransition/index.js'
import { formatUrl } from './formatUrl.js'

const NextLink = 'default' in NextLinkImport ? NextLinkImport.default : NextLinkImport

// Copied from  https://github.com/vercel/next.js/blob/canary/packages/next/src/client/link.tsx#L180-L191
function isModifiedEvent(event: React.MouseEvent): boolean {
  const eventTarget = event.currentTarget as HTMLAnchorElement | SVGAElement
  const target = eventTarget.getAttribute('target')
  return (
    (target && target !== '_self') ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey || // triggers resource download
    (event.nativeEvent && event.nativeEvent.which === 2)
  )
}

type Props = {
  /**
   * Disable the e.preventDefault() call on click if you want to handle it yourself via onClick
   *
   * @default true
   */
  preventDefault?: boolean
} & Parameters<typeof NextLink>[0]

export const Link: React.FC<Props> = ({
  children,
  href,
  onClick,
  preventDefault = true,
  ref,
  replace,
  scroll,
  ...rest
}) => {
  const router = useRouter()
  const { startRouteTransition } = useRouteTransition()

  return (
    <NextLink
      href={href}
      onClick={(e) => {
        if (isModifiedEvent(e)) {
          return
        }

        if (onClick) {
          onClick(e)
        }

        // We need a preventDefault here so that a clicked link doesn't trigger twice,
        // once for default browser navigation and once for startRouteTransition
        if (preventDefault) {
          e.preventDefault()
        }

        startRouteTransition(() => {
          const url = typeof href === 'string' ? href : formatUrl(href)

          if (replace) {
            void router.replace(url, { scroll })
          } else {
            void router.push(url, { scroll })
          }
        })
      }}
      ref={ref}
      {...rest}
    >
      {children}
    </NextLink>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: getTextFieldsToBeSearched.ts]---
Location: payload-main/packages/ui/src/elements/ListControls/getTextFieldsToBeSearched.ts

```typescript
'use client'
import type { I18nClient } from '@payloadcms/translations'
import type { ClientField } from 'payload'

import { fieldAffectsData, flattenTopLevelFields } from 'payload/shared'

export const getTextFieldsToBeSearched = (
  listSearchableFields: string[],
  fields: ClientField[],
  i18n: I18nClient,
): ClientField[] => {
  if (listSearchableFields) {
    const flattenedFields = flattenTopLevelFields(fields, {
      i18n,
      moveSubFieldsToTop: true,
    }) as ClientField[]

    const searchableFieldNames = new Set(listSearchableFields)
    const matchingFields: typeof flattenedFields = []

    for (const field of flattenedFields) {
      if (fieldAffectsData(field) && searchableFieldNames.has(field.name)) {
        matchingFields.push(field)
        searchableFieldNames.delete(field.name)
      }
    }

    return matchingFields
  }

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/ListControls/index.scss

```text
@import '../../scss/styles';

@layer payload-default {
  .list-controls {
    display: flex;
    flex-direction: column;
    gap: 2px;

    .pill-selector,
    .where-builder,
    .sort-complex,
    .group-by-builder {
      margin-top: calc(var(--base) / 2);
    }

    @include small-break {
      .search-bar__actions {
        .pill {
          padding: base(0.2) base(0.2) base(0.2) base(0.4);
          justify-content: space-between;
        }
      }

      &__toggle-columns,
      &__toggle-where,
      &__toggle-sort,
      &__toggle-group-by {
        flex: 1;
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/ListControls/index.tsx
Signals: React

```typescript
'use client'

import { useWindowInfo } from '@faceless-ui/window-info'
import { getTranslation } from '@payloadcms/translations'
import { validateWhereQuery } from 'payload/shared'
import React, { Fragment, useEffect, useRef, useState } from 'react'

import type { ListControlsProps } from './types.js'

import { Popup, PopupList } from '../../elements/Popup/index.js'
import { useUseTitleField } from '../../hooks/useUseAsTitle.js'
import { ChevronIcon } from '../../icons/Chevron/index.js'
import { Dots } from '../../icons/Dots/index.js'
import { useListQuery } from '../../providers/ListQuery/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { AnimateHeight } from '../AnimateHeight/index.js'
import { ColumnSelector } from '../ColumnSelector/index.js'
import { GroupByBuilder } from '../GroupByBuilder/index.js'
import { Pill } from '../Pill/index.js'
import { QueryPresetBar } from '../QueryPresets/QueryPresetBar/index.js'
import { SearchBar } from '../SearchBar/index.js'
import { WhereBuilder } from '../WhereBuilder/index.js'
import { getTextFieldsToBeSearched } from './getTextFieldsToBeSearched.js'
import './index.scss'

const baseClass = 'list-controls'

/**
 * The ListControls component is used to render the controls (search, filter, where)
 * for a collection's list view. You can find those directly above the table which lists
 * the collection's documents.
 */
export const ListControls: React.FC<ListControlsProps> = (props) => {
  const {
    beforeActions,
    collectionConfig,
    collectionSlug,
    disableQueryPresets,
    enableColumns = true,
    enableFilters = true,
    enableSort = false,
    listMenuItems,
    queryPreset: activePreset,
    queryPresetPermissions,
    renderedFilters,
    resolvedFilterOptions,
  } = props

  const { handleSearchChange, query } = useListQuery()

  const titleField = useUseTitleField(collectionConfig)
  const { i18n, t } = useTranslation()

  const {
    breakpoints: { s: smallBreak },
  } = useWindowInfo()

  const searchLabel =
    (titleField &&
      getTranslation(
        'label' in titleField &&
          (typeof titleField.label === 'string' || typeof titleField.label === 'object')
          ? titleField.label
          : 'name' in titleField
            ? titleField.name
            : null,
        i18n,
      )) ??
    'ID'

  const listSearchableFields = getTextFieldsToBeSearched(
    collectionConfig.admin.listSearchableFields,
    collectionConfig.fields,
    i18n,
  )

  const searchLabelTranslated = useRef(
    t('general:searchBy', { label: getTranslation(searchLabel, i18n) }),
  )

  const hasWhereParam = useRef(Boolean(query?.where))

  const shouldInitializeWhereOpened = validateWhereQuery(query?.where)

  const [visibleDrawer, setVisibleDrawer] = useState<'columns' | 'group-by' | 'sort' | 'where'>(
    shouldInitializeWhereOpened ? 'where' : undefined,
  )

  useEffect(() => {
    if (hasWhereParam.current && !query?.where) {
      hasWhereParam.current = false
    } else if (query?.where) {
      hasWhereParam.current = true
    }
  }, [setVisibleDrawer, query?.where])

  useEffect(() => {
    if (listSearchableFields?.length > 0) {
      searchLabelTranslated.current = listSearchableFields.reduce(
        (placeholderText: string, field, i: number) => {
          const label =
            'label' in field && field.label ? field.label : 'name' in field ? field.name : null

          if (i === 0) {
            return `${t('general:searchBy', {
              label: getTranslation(label, i18n),
            })}`
          }

          if (i === listSearchableFields.length - 1) {
            return `${placeholderText} ${t('general:or')} ${getTranslation(label, i18n)}`
          }

          return `${placeholderText}, ${getTranslation(label, i18n)}`
        },
        '',
      )
    } else {
      searchLabelTranslated.current = t('general:searchBy', {
        label: getTranslation(searchLabel, i18n),
      })
    }
  }, [t, listSearchableFields, i18n, searchLabel])

  return (
    <div className={baseClass}>
      {collectionConfig?.enableQueryPresets && !disableQueryPresets && (
        <QueryPresetBar
          activePreset={activePreset}
          collectionSlug={collectionSlug}
          queryPresetPermissions={queryPresetPermissions}
        />
      )}
      <SearchBar
        Actions={[
          !smallBreak && (
            <React.Fragment key="before-actions">{beforeActions && beforeActions}</React.Fragment>
          ),
          enableColumns && (
            <Pill
              aria-controls={`${baseClass}-columns`}
              aria-expanded={visibleDrawer === 'columns'}
              className={`${baseClass}__toggle-columns`}
              icon={<ChevronIcon direction={visibleDrawer === 'columns' ? 'up' : 'down'} />}
              id="toggle-list-columns"
              key="toggle-list-columns"
              onClick={() => setVisibleDrawer(visibleDrawer !== 'columns' ? 'columns' : undefined)}
              pillStyle="light"
              size="small"
            >
              {t('general:columns')}
            </Pill>
          ),
          enableFilters && (
            <Pill
              aria-controls={`${baseClass}-where`}
              aria-expanded={visibleDrawer === 'where'}
              className={`${baseClass}__toggle-where`}
              icon={<ChevronIcon direction={visibleDrawer === 'where' ? 'up' : 'down'} />}
              id="toggle-list-filters"
              key="toggle-list-filters"
              onClick={() => setVisibleDrawer(visibleDrawer !== 'where' ? 'where' : undefined)}
              pillStyle="light"
              size="small"
            >
              {t('general:filters')}
            </Pill>
          ),
          enableSort && (
            <Pill
              aria-controls={`${baseClass}-sort`}
              aria-expanded={visibleDrawer === 'sort'}
              className={`${baseClass}__toggle-sort`}
              icon={<ChevronIcon />}
              id="toggle-list-sort"
              key="toggle-list-sort"
              onClick={() => setVisibleDrawer(visibleDrawer !== 'sort' ? 'sort' : undefined)}
              pillStyle="light"
              size="small"
            >
              {t('general:sort')}
            </Pill>
          ),
          collectionConfig.admin.groupBy && (
            <Pill
              aria-controls={`${baseClass}-group-by`}
              aria-expanded={visibleDrawer === 'group-by'}
              className={`${baseClass}__toggle-group-by`}
              icon={<ChevronIcon direction={visibleDrawer === 'group-by' ? 'up' : 'down'} />}
              id="toggle-group-by"
              key="toggle-group-by"
              onClick={() =>
                setVisibleDrawer(visibleDrawer !== 'group-by' ? 'group-by' : undefined)
              }
              pillStyle="light"
              size="small"
            >
              {t('general:groupByLabel', {
                label: '',
              })}
            </Pill>
          ),
          listMenuItems && Array.isArray(listMenuItems) && listMenuItems.length > 0 && (
            <Popup
              button={<Dots ariaLabel={t('general:moreOptions')} />}
              className={`${baseClass}__popup`}
              horizontalAlign="right"
              id="list-menu"
              key="list-menu"
              size="small"
              verticalAlign="bottom"
            >
              <PopupList.ButtonGroup>
                {listMenuItems.map((item, i) => (
                  <Fragment key={`list-menu-item-${i}`}>{item}</Fragment>
                ))}
              </PopupList.ButtonGroup>
            </Popup>
          ),
        ].filter(Boolean)}
        key={collectionSlug}
        label={searchLabelTranslated.current}
        onSearchChange={handleSearchChange}
        searchQueryParam={query?.search}
      />
      {enableColumns && (
        <AnimateHeight
          className={`${baseClass}__columns`}
          height={visibleDrawer === 'columns' ? 'auto' : 0}
          id={`${baseClass}-columns`}
        >
          <ColumnSelector collectionSlug={collectionConfig.slug} />
        </AnimateHeight>
      )}
      <AnimateHeight
        className={`${baseClass}__where`}
        height={visibleDrawer === 'where' ? 'auto' : 0}
        id={`${baseClass}-where`}
      >
        <WhereBuilder
          collectionPluralLabel={collectionConfig?.labels?.plural}
          collectionSlug={collectionConfig.slug}
          fields={collectionConfig?.fields}
          renderedFilters={renderedFilters}
          resolvedFilterOptions={resolvedFilterOptions}
        />
      </AnimateHeight>
      {collectionConfig.admin.groupBy && (
        <AnimateHeight
          className={`${baseClass}__group-by`}
          height={visibleDrawer === 'group-by' ? 'auto' : 0}
          id={`${baseClass}-group-by`}
        >
          <GroupByBuilder collectionSlug={collectionConfig.slug} fields={collectionConfig.fields} />
        </AnimateHeight>
      )}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/ui/src/elements/ListControls/types.ts

```typescript
import type {
  ClientCollectionConfig,
  QueryPreset,
  ResolvedFilterOptions,
  SanitizedCollectionPermission,
  Where,
} from 'payload'

export type ListControlsProps = {
  readonly beforeActions?: React.ReactNode[]
  readonly collectionConfig: ClientCollectionConfig
  readonly collectionSlug: string
  /**
   * @deprecated
   * These are now handled by the `ListSelection` component
   */
  readonly disableBulkDelete?: boolean
  /**
   * @deprecated
   * These are now handled by the `ListSelection` component
   */
  readonly disableBulkEdit?: boolean
  readonly disableQueryPresets?: boolean
  readonly enableColumns?: boolean
  readonly enableFilters?: boolean
  readonly enableSort?: boolean
  readonly handleSearchChange?: (search: string) => void
  readonly handleSortChange?: (sort: string) => void
  readonly handleWhereChange?: (where: Where) => void
  readonly listMenuItems?: React.ReactNode[]
  readonly queryPreset?: QueryPreset
  readonly queryPresetPermissions?: SanitizedCollectionPermission
  readonly renderedFilters?: Map<string, React.ReactNode>
  readonly resolvedFilterOptions?: Map<string, ResolvedFilterOptions>
}
```

--------------------------------------------------------------------------------

---[FILE: DrawerContent.tsx]---
Location: payload-main/packages/ui/src/elements/ListDrawer/DrawerContent.tsx
Signals: React

```typescript
'use client'
import type { CollectionSlug, ListQuery } from 'payload'

import { useModal } from '@faceless-ui/modal'
import { hoistQueryParamsToAnd } from 'payload/shared'
import React, { useCallback, useEffect, useState } from 'react'

import type { ListDrawerContextProps, ListDrawerContextType } from '../ListDrawer/Provider.js'
import type {
  ListDrawerProps,
  RenderListServerFnArgs,
  RenderListServerFnReturnType,
} from './types.js'

import { useDocumentDrawer } from '../../elements/DocumentDrawer/index.js'
import { useEffectEvent } from '../../hooks/useEffectEvent.js'
import { useConfig } from '../../providers/Config/index.js'
import { useServerFunctions } from '../../providers/ServerFunctions/index.js'
import { ListDrawerContextProvider } from '../ListDrawer/Provider.js'
import { LoadingOverlay } from '../Loading/index.js'
import { type Option } from '../ReactSelect/index.js'

export const ListDrawerContent: React.FC<ListDrawerProps> = ({
  allowCreate = true,
  collectionSlugs,
  disableQueryPresets,
  drawerSlug,
  enableRowSelections,
  filterOptions,
  onBulkSelect,
  onSelect,
  overrideEntityVisibility = true,
  selectedCollection: collectionSlugFromProps,
}) => {
  const { closeModal, isModalOpen } = useModal()

  const { serverFunction } = useServerFunctions()
  const [ListView, setListView] = useState<React.ReactNode>(undefined)
  const [isLoading, setIsLoading] = useState(true)

  const {
    config: { collections },
    getEntityConfig,
  } = useConfig()

  const isOpen = isModalOpen(drawerSlug)

  const enabledCollections = collections.filter(({ slug }) => {
    return collectionSlugs.includes(slug)
  })

  const [selectedOption, setSelectedOption] = useState<Option<string>>(() => {
    const initialSelection = collectionSlugFromProps || enabledCollections[0]?.slug
    const found = getEntityConfig({ collectionSlug: initialSelection })

    return found
      ? {
          label: found.labels,
          value: found.slug,
        }
      : undefined
  })

  const [DocumentDrawer, DocumentDrawerToggler, { drawerSlug: documentDrawerSlug }] =
    useDocumentDrawer({
      collectionSlug: selectedOption.value,
    })

  const updateSelectedOption = useEffectEvent((collectionSlug: CollectionSlug) => {
    if (collectionSlug && collectionSlug !== selectedOption?.value) {
      setSelectedOption({
        label: getEntityConfig({ collectionSlug })?.labels,
        value: collectionSlug,
      })
    }
  })

  useEffect(() => {
    updateSelectedOption(collectionSlugFromProps)
  }, [collectionSlugFromProps])

  /**
   * This performs a full server round trip to get the list view for the selected collection.
   * On the server, the data is freshly queried for the list view and all components are fully rendered.
   * This work includes building column state, rendering custom components, etc.
   */
  const refresh = useCallback(
    async ({ slug, query }: { query?: ListQuery; slug: string }) => {
      try {
        const newQuery: ListQuery = { ...(query || {}), where: { ...(query?.where || {}) } }

        const filterOption = filterOptions?.[slug]

        if (filterOptions && typeof filterOption !== 'boolean') {
          newQuery.where = hoistQueryParamsToAnd(newQuery.where, filterOption)
        }

        if (slug) {
          const result: RenderListServerFnReturnType = (await serverFunction({
            name: 'render-list',
            args: {
              collectionSlug: slug,
              disableBulkDelete: true,
              disableBulkEdit: true,
              disableQueryPresets,
              drawerSlug,
              enableRowSelections,
              overrideEntityVisibility,
              query: newQuery,
            } satisfies RenderListServerFnArgs,
          })) as RenderListServerFnReturnType

          setListView(result?.List || null)
        } else {
          setListView(null)
        }
        setIsLoading(false)
      } catch (_err) {
        console.error('Error rendering List View: ', _err) // eslint-disable-line no-console

        if (isOpen) {
          closeModal(drawerSlug)
        }
      }
    },
    [
      serverFunction,
      closeModal,
      drawerSlug,
      isOpen,
      enableRowSelections,
      filterOptions,
      overrideEntityVisibility,
      disableQueryPresets,
    ],
  )

  useEffect(() => {
    if (!ListView) {
      void refresh({ slug: selectedOption?.value })
    }
  }, [refresh, ListView, selectedOption.value])

  const onCreateNew = useCallback(
    ({ doc }) => {
      if (typeof onSelect === 'function') {
        onSelect({
          collectionSlug: selectedOption?.value,
          doc,
          docID: doc.id,
        })
      }

      closeModal(documentDrawerSlug)
      closeModal(drawerSlug)
    },
    [closeModal, documentDrawerSlug, drawerSlug, onSelect, selectedOption.value],
  )

  const onQueryChange: ListDrawerContextProps['onQueryChange'] = useCallback(
    (query) => {
      void refresh({ slug: selectedOption?.value, query })
    },
    [refresh, selectedOption.value],
  )

  const setMySelectedOption: ListDrawerContextProps['setSelectedOption'] = useCallback(
    (incomingSelection) => {
      setSelectedOption(incomingSelection)
      void refresh({ slug: incomingSelection?.value })
    },
    [refresh],
  )

  const refreshSelf: ListDrawerContextType['refresh'] = useCallback(
    async (incomingCollectionSlug) => {
      if (incomingCollectionSlug) {
        setSelectedOption({
          label: getEntityConfig({ collectionSlug: incomingCollectionSlug })?.labels,
          value: incomingCollectionSlug,
        })
      }

      await refresh({ slug: selectedOption.value || incomingCollectionSlug })
    },
    [getEntityConfig, refresh, selectedOption.value],
  )

  if (isLoading) {
    return <LoadingOverlay />
  }

  return (
    <ListDrawerContextProvider
      allowCreate={allowCreate}
      createNewDrawerSlug={documentDrawerSlug}
      DocumentDrawerToggler={DocumentDrawerToggler}
      drawerSlug={drawerSlug}
      enabledCollections={collectionSlugs}
      onBulkSelect={onBulkSelect}
      onQueryChange={onQueryChange}
      onSelect={onSelect}
      refresh={refreshSelf}
      selectedOption={selectedOption}
      setSelectedOption={setMySelectedOption}
    >
      {ListView}
      <DocumentDrawer onSave={onCreateNew} />
    </ListDrawerContextProvider>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/ListDrawer/index.tsx
Signals: React

```typescript
'use client'
import { useModal } from '@faceless-ui/modal'
import React, { useCallback, useEffect, useId, useMemo, useState } from 'react'

import type { ListDrawerProps, ListTogglerProps, UseListDrawer } from './types.js'

export * from './types.js'

import { useConfig } from '../../providers/Config/index.js'
import { useEditDepth } from '../../providers/EditDepth/index.js'
import { Drawer, DrawerToggler } from '../Drawer/index.js'
import { ListDrawerContent } from './DrawerContent.js'

export const baseClass = 'list-drawer'
export const formatListDrawerSlug = ({
  depth,
  uuid,
}: {
  depth: number
  uuid: string // supply when creating a new document and no id is available
}) => `list-drawer_${depth}_${uuid}`

export const ListDrawerToggler: React.FC<ListTogglerProps> = ({
  children,
  className,
  disabled,
  drawerSlug,
  onClick,
  ...rest
}) => {
  return (
    <DrawerToggler
      className={[className, `${baseClass}__toggler`].filter(Boolean).join(' ')}
      disabled={disabled}
      onClick={onClick}
      slug={drawerSlug}
      {...rest}
    >
      {children}
    </DrawerToggler>
  )
}

export const ListDrawer: React.FC<ListDrawerProps> = (props) => {
  const { drawerSlug } = props

  return (
    <Drawer className={baseClass} gutter={false} Header={null} slug={drawerSlug}>
      <ListDrawerContent {...props} />
    </Drawer>
  )
}

/**
 * Returns an array containing the ListDrawer component, the ListDrawerToggler component, and an object with state and methods for controlling the drawer.
 * @example
 * import { useListDrawer } from '@payloadcms/ui'
 *
 * // inside a React component
 * const [ListDrawer, ListDrawerToggler, { closeDrawer, openDrawer }] = useListDrawer({
 *   collectionSlugs: ['users'],
 *   selectedCollection: 'users',
 * })
 *
 * // inside the return statement
 * return (
 *    <>
 *      <ListDrawer />
 *      <ListDrawerToggler onClick={openDrawer}>Open List Drawer</ListDrawerToggler>
 *    </>
 * )
 */
export const useListDrawer: UseListDrawer = ({
  collectionSlugs: collectionSlugsFromProps,
  filterOptions,
  selectedCollection,
  uploads,
}) => {
  const {
    config: { collections },
  } = useConfig()
  const drawerDepth = useEditDepth()
  const uuid = useId()
  const { closeModal, modalState, openModal, toggleModal } = useModal()
  const [isOpen, setIsOpen] = useState(false)
  const [collectionSlugs, setCollectionSlugs] = useState(collectionSlugsFromProps)

  const drawerSlug = formatListDrawerSlug({
    depth: drawerDepth,
    uuid,
  })

  useEffect(() => {
    setIsOpen(Boolean(modalState[drawerSlug]?.isOpen))
  }, [modalState, drawerSlug])

  useEffect(() => {
    if (!collectionSlugs || collectionSlugs.length === 0) {
      const filteredCollectionSlugs = collections.filter(({ upload }) => {
        if (uploads) {
          return Boolean(upload) === true
        }
        return true
      })

      setCollectionSlugs(filteredCollectionSlugs.map(({ slug }) => slug))
    }
  }, [collectionSlugs, uploads, collections])

  const toggleDrawer = useCallback(() => {
    toggleModal(drawerSlug)
  }, [toggleModal, drawerSlug])

  const closeDrawer = useCallback(() => {
    closeModal(drawerSlug)
  }, [drawerSlug, closeModal])

  const openDrawer = useCallback(() => {
    openModal(drawerSlug)
  }, [drawerSlug, openModal])

  const MemoizedDrawer = useMemo(() => {
    return (props) => (
      <ListDrawer
        {...props}
        closeDrawer={closeDrawer}
        collectionSlugs={collectionSlugs}
        drawerSlug={drawerSlug}
        filterOptions={filterOptions}
        key={drawerSlug}
        selectedCollection={selectedCollection}
        uploads={uploads}
      />
    )
  }, [drawerSlug, collectionSlugs, uploads, closeDrawer, selectedCollection, filterOptions])

  const MemoizedDrawerToggler = useMemo(() => {
    return (props) => <ListDrawerToggler {...props} drawerSlug={drawerSlug} />
  }, [drawerSlug])

  const MemoizedDrawerState = useMemo(
    () => ({
      closeDrawer,
      collectionSlugs,
      drawerDepth,
      drawerSlug,
      isDrawerOpen: isOpen,
      openDrawer,
      setCollectionSlugs,
      toggleDrawer,
    }),
    [
      drawerDepth,
      drawerSlug,
      isOpen,
      toggleDrawer,
      closeDrawer,
      openDrawer,
      setCollectionSlugs,
      collectionSlugs,
    ],
  )

  return [MemoizedDrawer, MemoizedDrawerToggler, MemoizedDrawerState]
}
```

--------------------------------------------------------------------------------

---[FILE: Provider.tsx]---
Location: payload-main/packages/ui/src/elements/ListDrawer/Provider.tsx
Signals: React

```typescript
import type { CollectionSlug, Data, ListQuery } from 'payload'

import { createContext, use } from 'react'

import type { useSelection } from '../../providers/Selection/index.js'
import type { UseDocumentDrawer } from '../DocumentDrawer/types.js'
import type { Option } from '../ReactSelect/index.js'

export type ListDrawerContextProps = {
  readonly allowCreate?: boolean
  readonly createNewDrawerSlug?: string
  readonly DocumentDrawerToggler?: ReturnType<UseDocumentDrawer>[1]
  readonly drawerSlug?: string
  readonly enabledCollections?: CollectionSlug[]
  readonly onBulkSelect?: (selected: ReturnType<typeof useSelection>['selected']) => void
  readonly onQueryChange?: (query: ListQuery) => void
  readonly onSelect?: (args: {
    collectionSlug: CollectionSlug
    doc: Data
    /**
     * @deprecated
     * The `docID` property is deprecated and will be removed in the next major version of Payload.
     * Use `doc.id` instead.
     */
    docID: string
  }) => void
  readonly selectedOption?: Option<CollectionSlug>
  readonly setSelectedOption?: (option: Option<CollectionSlug>) => void
}

export type ListDrawerContextType = {
  readonly isInDrawer: boolean
  /**
   * When called, will either refresh the list view with its currently selected collection.
   * If an collection slug is provided, will use that instead of the currently selected one.
   */
  readonly refresh: (collectionSlug?: CollectionSlug) => Promise<void>
} & ListDrawerContextProps

export const ListDrawerContext = createContext({} as ListDrawerContextType)

export const ListDrawerContextProvider: React.FC<
  {
    children: React.ReactNode
    refresh: ListDrawerContextType['refresh']
  } & ListDrawerContextProps
> = ({ children, ...rest }) => {
  return (
    <ListDrawerContext value={{ isInDrawer: Boolean(rest.drawerSlug), ...rest }}>
      {children}
    </ListDrawerContext>
  )
}

export const useListDrawerContext = (): ListDrawerContextType => {
  const context = use(ListDrawerContext)

  if (!context) {
    throw new Error('useListDrawerContext must be used within a ListDrawerContextProvider')
  }

  return context
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/ui/src/elements/ListDrawer/types.ts
Signals: React

```typescript
import type {
  CollectionPreferences,
  FilterOptionsResult,
  ListQuery,
  SanitizedCollectionConfig,
} from 'payload'
import type React from 'react'
import type { HTMLAttributes } from 'react'

import type { ListDrawerContextProps } from './Provider.js'

/**
 * @internal - this may change in a minor release
 */
export type RenderListServerFnArgs = {
  collectionSlug: string
  disableActions?: boolean
  disableBulkDelete?: boolean
  disableBulkEdit?: boolean
  disableQueryPresets?: boolean
  drawerSlug?: string
  enableRowSelections: boolean
  overrideEntityVisibility?: boolean
  query: ListQuery
  redirectAfterDelete?: boolean
  redirectAfterDuplicate?: boolean
}

/**
 * @internal - this may change in a minor release
 */
export type RenderListServerFnReturnType = {
  List: React.ReactNode
  preferences: CollectionPreferences
}

export type ListDrawerProps = {
  readonly allowCreate?: boolean
  readonly collectionSlugs: SanitizedCollectionConfig['slug'][]
  readonly disableQueryPresets?: boolean
  readonly drawerSlug?: string
  readonly enableRowSelections?: boolean
  readonly filterOptions?: FilterOptionsResult
  readonly overrideEntityVisibility?: boolean
  readonly selectedCollection?: string
} & ListDrawerContextProps

export type ListTogglerProps = {
  children?: React.ReactNode
  className?: string
  disabled?: boolean
  drawerSlug?: string
} & HTMLAttributes<HTMLButtonElement>

export type UseListDrawer = (args: {
  collectionSlugs?: SanitizedCollectionConfig['slug'][]
  filterOptions?: FilterOptionsResult
  overrideEntityVisibility?: boolean
  selectedCollection?: SanitizedCollectionConfig['slug']
  uploads?: boolean // finds all collections with upload: true
}) => [
  React.FC<Omit<ListDrawerProps, 'collectionSlugs'>>,
  React.FC<Omit<ListTogglerProps, 'drawerSlug'>>,
  {
    closeDrawer: () => void
    collectionSlugs: SanitizedCollectionConfig['slug'][]
    drawerDepth: number
    drawerSlug: string
    isDrawerOpen: boolean
    openDrawer: () => void
    setCollectionSlugs: React.Dispatch<React.SetStateAction<SanitizedCollectionConfig['slug'][]>>
    toggleDrawer: () => void
  },
]
```

--------------------------------------------------------------------------------

````
