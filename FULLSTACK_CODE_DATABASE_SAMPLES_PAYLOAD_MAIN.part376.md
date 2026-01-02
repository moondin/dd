---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 376
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 376 of 695)

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

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/NavGroup/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .nav-group {
    width: 100%;
    margin-bottom: base(0.5);

    &__toggle {
      cursor: pointer;
      color: var(--theme-elevation-400);
      background: transparent;
      padding-left: 0;
      border: 0;
      margin-bottom: base(0.25);
      width: 100%;
      text-align: left;
      display: flex;
      align-items: flex-start;
      padding: 0;
      gap: base(0.5);
      justify-content: space-between;

      svg {
        flex-shrink: 0;
        margin-top: base(-0.2);
      }

      &:hover,
      &:focus-visible {
        color: var(--theme-elevation-1000);

        .stroke {
          stroke: var(--theme-elevation-1000);
        }
      }

      &:focus-visible {
        outline: none;
      }
    }

    &__indicator {
      position: relative;
      flex-shrink: 0;

      svg .stroke {
        stroke: var(--theme-elevation-200);
      }
    }

    &--collapsed {
      .collapsible__toggle {
        border-bottom-right-radius: $style-radius-m;
        border-bottom-left-radius: $style-radius-m;
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/NavGroup/index.tsx
Signals: React

```typescript
'use client'
import type { NavPreferences } from 'payload'

import React, { useState } from 'react'

import { ChevronIcon } from '../../icons/Chevron/index.js'
import { usePreferences } from '../../providers/Preferences/index.js'
import './index.scss'
import { AnimateHeight } from '../AnimateHeight/index.js'
import { useNav } from '../Nav/context.js'

const baseClass = 'nav-group'

type Props = {
  children: React.ReactNode
  isOpen?: boolean
  label: string
}

const preferencesKey = 'nav'

export const NavGroup: React.FC<Props> = ({ children, isOpen: isOpenFromProps, label }) => {
  const [collapsed, setCollapsed] = useState(
    typeof isOpenFromProps !== 'undefined' ? !isOpenFromProps : false,
  )

  const [animate, setAnimate] = useState(false)
  const { setPreference } = usePreferences()
  const { navOpen } = useNav()

  if (label) {
    const toggleCollapsed = () => {
      setAnimate(true)
      const newGroupPrefs: NavPreferences['groups'] = {}

      if (!newGroupPrefs?.[label]) {
        newGroupPrefs[label] = { open: Boolean(collapsed) }
      } else {
        newGroupPrefs[label].open = Boolean(collapsed)
      }

      void setPreference(preferencesKey, { groups: newGroupPrefs }, true)
      setCollapsed(!collapsed)
    }

    return (
      <div
        className={[`${baseClass}`, `${label}`, collapsed && `${baseClass}--collapsed`]
          .filter(Boolean)
          .join(' ')}
        id={`nav-group-${label}`}
      >
        <button
          className={[
            `${baseClass}__toggle`,
            `${baseClass}__toggle--${collapsed ? 'collapsed' : 'open'}`,
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={toggleCollapsed}
          tabIndex={!navOpen ? -1 : 0}
          type="button"
        >
          <div className={`${baseClass}__label`}>{label}</div>
          <div className={`${baseClass}__indicator`}>
            <ChevronIcon
              className={`${baseClass}__indicator`}
              direction={!collapsed ? 'up' : undefined}
            />
          </div>
        </button>
        <AnimateHeight duration={animate ? 200 : 0} height={collapsed ? 0 : 'auto'}>
          <div className={`${baseClass}__content`}>{children}</div>
        </AnimateHeight>
      </div>
    )
  }

  return <React.Fragment>{children}</React.Fragment>
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/NoListResults/index.scss

```text
.no-results {
  padding: calc(var(--base) * 2) var(--base);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px dashed var(--theme-border-color);
  border-radius: var(--style-radius-m);
  text-align: center;

  &__actions {
    display: flex;
    gap: calc(var(--base) / 2);
    margin-top: var(--base);

    .btn {
      margin: 0;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/NoListResults/index.tsx
Signals: React

```typescript
import React from 'react'

import './index.scss'

const baseClass = 'no-results'

type NoResultsProps = {
  Actions?: React.ReactNode[]
  Message: React.ReactNode
}
export function NoListResults({ Actions, Message }: NoResultsProps) {
  return (
    <div className={baseClass}>
      {Message}
      {Actions && Actions.length > 0 && (
        <div className={`${baseClass}__actions`}>
          {Actions.map((action, index) => (
            <React.Fragment key={index}>{action}</React.Fragment>
          ))}
        </div>
      )}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: GroupByPageControls.tsx]---
Location: payload-main/packages/ui/src/elements/PageControls/GroupByPageControls.tsx
Signals: React

```typescript
'use client'
import type { ClientCollectionConfig, PaginatedDocs } from 'payload'

import React, { useCallback } from 'react'

import type { IListQueryContext } from '../../providers/ListQuery/types.js'

import { useListQuery } from '../../providers/ListQuery/context.js'
import { PageControlsComponent } from './index.js'

/**
 * If `groupBy` is set in the query, multiple tables will render, one for each group.
 * In this case, each table needs its own `PageControls` to handle pagination.
 * These page controls, however, should not modify the global `ListQuery` state.
 * Instead, they should only handle the pagination for the current group.
 * To do this, build a wrapper around `PageControlsComponent` that handles the pagination logic for the current group.
 */
export const GroupByPageControls: React.FC<{
  AfterPageControls?: React.ReactNode
  collectionConfig: ClientCollectionConfig
  data: PaginatedDocs
  groupByValue?: number | string
}> = ({ AfterPageControls, collectionConfig, data, groupByValue }) => {
  const { refineListData } = useListQuery()

  const handlePageChange: IListQueryContext['handlePageChange'] = useCallback(
    async (page) => {
      await refineListData({
        queryByGroup: {
          [groupByValue]: {
            page,
          },
        },
      })
    },
    [refineListData, groupByValue],
  )

  const handlePerPageChange: IListQueryContext['handlePerPageChange'] = useCallback(
    async (limit) => {
      await refineListData({
        queryByGroup: {
          [groupByValue]: {
            limit,
            page: 1,
          },
        },
      })
    },
    [refineListData, groupByValue],
  )

  return (
    <PageControlsComponent
      AfterPageControls={AfterPageControls}
      collectionConfig={collectionConfig}
      data={data}
      handlePageChange={handlePageChange}
      handlePerPageChange={handlePerPageChange}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/PageControls/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .page-controls {
    width: 100%;
    display: flex;
    align-items: center;

    &__page-info {
      [dir='ltr'] & {
        margin-right: base(1);
        margin-left: auto;
      }

      [dir='rtl'] & {
        margin-left: base(1);
        margin-right: auto;
      }
    }

    @include small-break {
      flex-wrap: wrap;

      &__page-info {
        [dir='ltr'] & {
          margin-left: base(0.5);
        }

        [dir='rtl'] & {
          margin-right: 0;
        }
      }

      .paginator {
        width: 100%;
        margin-bottom: base(0.5);
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/PageControls/index.tsx
Signals: React

```typescript
'use client'
import type { ClientCollectionConfig, PaginatedDocs } from 'payload'

import { isNumber } from 'payload/shared'
import React, { Fragment } from 'react'

import type { IListQueryContext } from '../../providers/ListQuery/types.js'

import { Pagination } from '../../elements/Pagination/index.js'
import { PerPage } from '../../elements/PerPage/index.js'
import { useListQuery } from '../../providers/ListQuery/context.js'
import { useTranslation } from '../../providers/Translation/index.js'
import './index.scss'

const baseClass = 'page-controls'

/**
 * @internal
 */
export const PageControlsComponent: React.FC<{
  AfterPageControls?: React.ReactNode
  collectionConfig: ClientCollectionConfig
  data: PaginatedDocs
  handlePageChange?: IListQueryContext['handlePageChange']
  handlePerPageChange?: IListQueryContext['handlePerPageChange']
  limit?: number
}> = ({
  AfterPageControls,
  collectionConfig,
  data,
  handlePageChange,
  handlePerPageChange,
  limit,
}) => {
  const { i18n } = useTranslation()

  return (
    <div className={baseClass}>
      <Pagination
        hasNextPage={data.hasNextPage}
        hasPrevPage={data.hasPrevPage}
        limit={data.limit}
        nextPage={data.nextPage}
        numberOfNeighbors={1}
        onChange={handlePageChange}
        page={data.page}
        prevPage={data.prevPage}
        totalPages={data.totalPages}
      />
      {data.totalDocs > 0 && (
        <Fragment>
          <div className={`${baseClass}__page-info`}>
            {data.page * data.limit - (data.limit - 1)}-
            {data.totalPages > 1 && data.totalPages !== data.page
              ? data.limit * data.page
              : data.totalDocs}{' '}
            {i18n.t('general:of')} {data.totalDocs}
          </div>
          <PerPage
            handleChange={handlePerPageChange}
            limit={limit}
            limits={collectionConfig?.admin?.pagination?.limits}
            resetPage={data.totalDocs <= data.pagingCounter}
          />
          {AfterPageControls}
        </Fragment>
      )}
    </div>
  )
}

/**
 * These page controls are controlled by the global ListQuery state.
 * To override thi behavior, build your own wrapper around PageControlsComponent.
 *
 * @internal
 */
export const PageControls: React.FC<{
  AfterPageControls?: React.ReactNode
  collectionConfig: ClientCollectionConfig
}> = ({ AfterPageControls, collectionConfig }) => {
  const {
    data,
    defaultLimit: initialLimit,
    handlePageChange,
    handlePerPageChange,
    query,
  } = useListQuery()

  return (
    <PageControlsComponent
      AfterPageControls={AfterPageControls}
      collectionConfig={collectionConfig}
      data={data}
      handlePageChange={handlePageChange}
      handlePerPageChange={handlePerPageChange}
      limit={isNumber(query.limit) ? query.limit : initialLimit}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/Pagination/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .paginator {
    display: flex;

    &__page {
      cursor: pointer;

      &--is-current {
        background: var(--theme-elevation-100);
        color: var(--theme-elevation-400);
        cursor: default;
      }

      &--is-last-page {
        margin-right: 0;
      }
    }

    .clickable-arrow--right {
      margin-right: base(0.25);
    }

    &__page {
      @extend %btn-reset;
      width: base(1.5);
      height: base(1.5);
      display: flex;
      justify-content: center;
      align-content: center;
      outline: 0;
      border-radius: var(--style-radius-s);
      padding: base(0.5);
      color: var(--theme-elevation-800);
      line-height: 0.9;

      &:focus-visible {
        outline: var(--accessibility-outline);
      }
    }

    &__page,
    &__separator {
      margin-right: base(0.25);
    }

    &__separator {
      align-self: center;
      color: var(--theme-elevation-400);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/Pagination/index.tsx
Signals: React

```typescript
'use client'
import React from 'react'

import { ClickableArrow } from './ClickableArrow/index.js'
import './index.scss'
import { Page } from './Page/index.js'
import { Separator } from './Separator/index.js'

const nodeTypes = {
  ClickableArrow,
  Page,
  Separator,
}

const baseClass = 'paginator'

export type PaginationProps = {
  hasNextPage?: boolean
  hasPrevPage?: boolean
  limit?: number
  nextPage?: number
  numberOfNeighbors?: number
  onChange?: (page: number) => void
  page?: number
  prevPage?: number
  totalPages?: number
}

export type Node =
  | {
      props?: {
        direction?: 'left' | 'right'
        isDisabled?: boolean
        isFirstPage?: boolean
        isLastPage?: boolean
        page?: number
        updatePage: (page?: number) => void
      }
      type: 'ClickableArrow' | 'Page' | 'Separator'
    }
  | number

export const Pagination: React.FC<PaginationProps> = (props) => {
  const {
    hasNextPage = false,
    hasPrevPage = false,
    nextPage = null,
    numberOfNeighbors = 1,
    onChange,
    page: currentPage,
    prevPage = null,
    totalPages = null,
  } = props

  if (!hasPrevPage && !hasNextPage) {
    return null
  }

  const updatePage = (page) => {
    if (typeof onChange === 'function') {
      onChange(page)
    }
  }

  // Create array of integers for each page
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  // Assign indices for start and end of the range of pages that should be shown in paginator
  let rangeStartIndex = currentPage - 1 - numberOfNeighbors

  // Sanitize rangeStartIndex in case it is less than zero for safe split
  if (rangeStartIndex <= 0) {
    rangeStartIndex = 0
  }

  const rangeEndIndex = currentPage - 1 + numberOfNeighbors + 1

  // Slice out the range of pages that we want to render
  const nodes: Node[] = pages.slice(rangeStartIndex, rangeEndIndex)

  // Add prev separator if necessary
  if (currentPage - numberOfNeighbors - 1 >= 2) {
    nodes.unshift({ type: 'Separator' })
  }

  // Add first page if necessary
  if (currentPage > numberOfNeighbors + 1) {
    nodes.unshift({
      type: 'Page',
      props: {
        isFirstPage: true,
        page: 1,
        updatePage,
      },
    })
  }

  // Add next separator if necessary
  if (currentPage + numberOfNeighbors + 1 < totalPages) {
    nodes.push({ type: 'Separator' })
  }

  // Add last page if necessary
  if (rangeEndIndex < totalPages) {
    nodes.push({
      type: 'Page',
      props: {
        isLastPage: true,
        page: totalPages,
        updatePage,
      },
    })
  }

  // Add prev and next arrows based on necessity
  nodes.unshift({
    type: 'ClickableArrow',
    props: {
      direction: 'right',
      isDisabled: !hasNextPage,
      updatePage: () => updatePage(nextPage ?? currentPage + 1),
    },
  })

  nodes.unshift({
    type: 'ClickableArrow',
    props: {
      direction: 'left',
      isDisabled: !hasPrevPage,
      updatePage: () => updatePage(prevPage ?? Math.max(1, currentPage - 1)),
    },
  })

  return (
    <div className={baseClass}>
      {nodes.map((node, i) => {
        if (typeof node === 'number') {
          return (
            <Page isCurrent={currentPage === node} key={i} page={node} updatePage={updatePage} />
          )
        }

        const NodeType = nodeTypes[node.type]

        return <NodeType key={i} {...node.props} />
      })}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/Pagination/ClickableArrow/index.scss

```text
@import '../../../scss/styles.scss';

@layer payload-default {
  .clickable-arrow {
    cursor: pointer;
    @extend %btn-reset;
    width: base(1.5);
    height: base(1.5);
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    outline: 0;
    padding: base(0.25);
    color: var(--theme-elevation-800);
    line-height: base(1);

    &:not(.clickable-arrow--is-disabled) {
      &:hover,
      &:focus-visible {
        background: var(--theme-elevation-100);
      }
    }

    &:focus-visible {
      outline: var(--accessibility-outline);
    }

    &--right {
      .icon {
        transform: rotate(-90deg);
      }
    }

    &--left .icon {
      transform: rotate(90deg);
    }

    &--is-disabled {
      cursor: default;

      .icon .stroke {
        stroke: var(--theme-elevation-400);
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/Pagination/ClickableArrow/index.tsx
Signals: React

```typescript
'use client'
import React from 'react'

import { ChevronIcon } from '../../../icons/Chevron/index.js'
import './index.scss'

const baseClass = 'clickable-arrow'

export type ClickableArrowProps = {
  direction?: 'left' | 'right'
  isDisabled?: boolean
  updatePage?: () => void
}

export const ClickableArrow: React.FC<ClickableArrowProps> = (props) => {
  const { direction = 'right', isDisabled = false, updatePage } = props

  const classes = [
    baseClass,
    isDisabled && `${baseClass}--is-disabled`,
    direction && `${baseClass}--${direction}`,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      className={classes}
      disabled={isDisabled}
      onClick={!isDisabled ? updatePage : undefined}
      type="button"
    >
      <ChevronIcon />
    </button>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/Pagination/Page/index.tsx
Signals: React

```typescript
'use client'
import React from 'react'

export type PageProps = {
  isCurrent?: boolean
  isFirstPage?: boolean
  isLastPage?: boolean
  page?: number
  updatePage?: (page) => void
}

const baseClass = 'paginator__page'

export const Page: React.FC<PageProps> = ({
  isCurrent,
  isFirstPage = false,
  isLastPage = false,
  page = 1,
  updatePage,
}) => {
  const classes = [
    baseClass,
    isCurrent && `${baseClass}--is-current`,
    isFirstPage && `${baseClass}--is-first-page`,
    isLastPage && `${baseClass}--is-last-page`,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={classes} onClick={() => updatePage(page)} type="button">
      {page}
    </button>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/Pagination/Separator/index.tsx
Signals: React

```typescript
'use client'
import React from 'react'

export const Separator: React.FC = () => <span className="paginator__separator">&mdash;</span>
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/PermanentlyDeleteButton/index.tsx
Signals: React, Next.js

```typescript
'use client'

import type { SanitizedCollectionConfig } from 'payload'

import { useModal } from '@faceless-ui/modal'
import { getTranslation } from '@payloadcms/translations'
import { useRouter } from 'next/navigation.js'
import { formatAdminURL } from 'payload/shared'
import * as qs from 'qs-esm'
import React, { Fragment, useCallback } from 'react'
import { toast } from 'sonner'

import type { DocumentDrawerContextType } from '../DocumentDrawer/Provider.js'

import { useConfig } from '../../providers/Config/index.js'
import { useDocumentTitle } from '../../providers/DocumentTitle/index.js'
import { useRouteTransition } from '../../providers/RouteTransition/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { requests } from '../../utilities/api.js'
import { Button } from '../Button/index.js'
import { ConfirmationModal } from '../ConfirmationModal/index.js'
import { Translation } from '../Translation/index.js'

export type Props = {
  readonly buttonId?: string
  readonly collectionSlug: SanitizedCollectionConfig['slug']
  readonly id?: string
  readonly onDelete?: DocumentDrawerContextType['onDelete']
  readonly redirectAfterDelete?: boolean
  readonly singularLabel: SanitizedCollectionConfig['labels']['singular']
  readonly title?: string
}

export const PermanentlyDeleteButton: React.FC<Props> = (props) => {
  const {
    id,
    buttonId,
    collectionSlug,
    onDelete,
    redirectAfterDelete = true,
    singularLabel,
    title: titleFromProps,
  } = props

  const {
    config: {
      routes: { admin: adminRoute, api },
      serverURL,
    },
    getEntityConfig,
  } = useConfig()

  const collectionConfig = getEntityConfig({ collectionSlug })
  const router = useRouter()
  const { i18n, t } = useTranslation()
  const { title } = useDocumentTitle()
  const { startRouteTransition } = useRouteTransition()
  const { openModal } = useModal()

  const modalSlug = `perma-delete-${id}`

  const addDefaultError = useCallback(() => {
    toast.error(t('error:deletingTitle', { title }))
  }, [t, title])

  const handleDelete = useCallback(async () => {
    try {
      const url = `${serverURL}${api}/${collectionSlug}?${qs.stringify({
        trash: true,
        where: {
          and: [{ id: { equals: id } }, { deletedAt: { exists: true } }],
        },
      })}`

      const res = await requests.delete(url, {
        headers: {
          'Accept-Language': i18n.language,
          'Content-Type': 'application/json',
        },
      })

      const json = await res.json()

      if (res.status < 400) {
        toast.success(
          t('general:titleDeleted', {
            label: getTranslation(singularLabel, i18n),
            title,
          }) || json.message,
        )

        if (redirectAfterDelete) {
          return startRouteTransition(() =>
            router.push(
              formatAdminURL({
                adminRoute,
                path: `/collections/${collectionSlug}/trash`,
                serverURL,
              }),
            ),
          )
        }

        if (typeof onDelete === 'function') {
          await onDelete({ id, collectionConfig })
        }

        return
      }

      if (json.errors) {
        json.errors.forEach((error) => toast.error(error.message))
      } else {
        addDefaultError()
      }
    } catch (_err) {
      addDefaultError()
    }
  }, [
    serverURL,
    api,
    collectionSlug,
    id,
    t,
    singularLabel,
    addDefaultError,
    i18n,
    title,
    router,
    adminRoute,
    redirectAfterDelete,
    onDelete,
    collectionConfig,
    startRouteTransition,
  ])

  if (id) {
    return (
      <Fragment>
        <Button
          buttonStyle="secondary"
          id={buttonId}
          onClick={() => {
            openModal(modalSlug)
          }}
        >
          {t('general:permanentlyDelete')}
        </Button>
        <ConfirmationModal
          body={
            <Translation
              elements={{
                '1': ({ children }) => <strong>{children}</strong>,
              }}
              i18nKey="general:aboutToPermanentlyDelete"
              t={t}
              variables={{
                label: getTranslation(singularLabel, i18n),
                title: titleFromProps || title || id,
              }}
            />
          }
          confirmingLabel={t('general:deleting')}
          heading={t('general:confirmDeletion')}
          modalSlug={modalSlug}
          onConfirm={handleDelete}
        />
      </Fragment>
    )
  }

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/PerPage/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .per-page {
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: calc(var(--base) / 4);
    }

    &__base-button {
      display: flex;
      align-items: center;
      font-weight: bold;
    }

    &__button {
      @extend %btn-reset;
      cursor: pointer;
      text-align: left;
      width: 100%;
      display: flex;
      align-items: center;
      color: var(--theme-elevation-500);

      &:hover,
      &:focus-visible {
        text-decoration: underline;
      }

      svg .stroke {
        stroke: currentColor;
      }
    }

    &__button-active {
      font-weight: bold;
      color: var(--theme-text);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/PerPage/index.tsx
Signals: React

```typescript
'use client'
// TODO: abstract the `next/navigation` dependency out from this component
import { collectionDefaults, isNumber } from 'payload/shared'
import React from 'react'

import { ChevronIcon } from '../../icons/Chevron/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { Popup, PopupList } from '../Popup/index.js'
import './index.scss'

const baseClass = 'per-page'

const defaultLimits = collectionDefaults.admin.pagination.limits

export type PerPageProps = {
  readonly defaultLimit?: number
  readonly handleChange?: (limit: number) => void
  readonly limit: number
  readonly limits: number[]
  readonly resetPage?: boolean
}

export const PerPage: React.FC<PerPageProps> = ({
  defaultLimit = 10,
  handleChange,
  limit,
  limits = defaultLimits,
}) => {
  const { t } = useTranslation()

  const limitToUse = isNumber(limit) ? limit : defaultLimit

  return (
    <div className={baseClass}>
      <Popup
        button={
          <div className={`${baseClass}__base-button`}>
            <span>{t('general:perPage', { limit: limitToUse })}</span>
            &nbsp;
            <ChevronIcon className={`${baseClass}__icon`} />
          </div>
        }
        horizontalAlign="right"
        render={({ close }) => (
          <PopupList.ButtonGroup>
            {limits.map((limitNumber, i) => (
              <PopupList.Button
                className={[
                  `${baseClass}__button`,
                  limitNumber === limitToUse && `${baseClass}__button-active`,
                ]
                  .filter(Boolean)
                  .join(' ')}
                key={i}
                onClick={() => {
                  close()
                  if (handleChange) {
                    handleChange(limitNumber)
                  }
                }}
              >
                {limitNumber === limitToUse && (
                  <div className={`${baseClass}__chevron`}>
                    <ChevronIcon direction="right" size="small" />
                  </div>
                )}
                &nbsp;
                <span>{limitNumber}</span>
              </PopupList.Button>
            ))}
          </PopupList.ButtonGroup>
        )}
        size="small"
      />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/Pill/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .pill {
    --pill-padding-block-start: 0px;
    --pill-padding-inline-start: 0px;
    --pill-padding-block-end: 0px;
    --pill-padding-inline-end: 0px;
    font-size: 1rem;
    line-height: calc(var(--base) * 1.2);
    display: inline-flex;
    background: var(--theme-elevation-150);
    color: var(--theme-elevation-800);
    border-radius: $style-radius-s;
    cursor: inherit;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    border: 0;
    align-items: center;
    flex-shrink: 0;
    gap: base(0.2);
    padding: var(--pill-padding-block-start) var(--pill-padding-inline-end)
      var(--pill-padding-block-end) var(--pill-padding-inline-start);
    --pill-icon-size: calc(var(--base) * 1.2);

    &--rounded {
      border-radius: var(--style-radius-l);
      font-size: 12px;
    }

    &:active,
    &:focus:not(:focus-visible) {
      outline: none;
    }

    &:focus-visible {
      outline: var(--accessibility-outline);
      outline-offset: var(--accessibility-outline-offset);
    }

    &__icon .icon {
      flex-shrink: 0;
      width: var(--pill-icon-size);
      height: var(--pill-icon-size);
    }

    &__label {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &--has-action {
      cursor: pointer;
      text-decoration: none;
    }

    &--is-dragging {
      cursor: grabbing;
    }

    &--has-icon {
      gap: 0;
      --pill-padding-inline-start: base(0.4);
      --pill-padding-inline-end: base(0.1);

      svg {
        display: block;
      }
    }

    &--align-icon-left {
      flex-direction: row-reverse;
      padding-inline-start: base(0.1);
      padding-inline-end: base(0.4);
    }

    &--style-white {
      background: var(--theme-elevation-0);

      &.pill--has-action {
        &:hover,
        &:active {
          background: var(--theme-elevation-100);
        }
      }
    }

    &--style-always-white {
      background: var(--theme-elevation-850);
      color: var(--theme-elevation-0);

      &.pill--has-action {
        &:hover,
        &:active {
          background: var(--theme-elevation-750);
        }
      }
    }

    &--style-light {
      &.pill--has-action {
        &:hover,
        &:active {
          background: var(--theme-elevation-100);
        }
      }
    }

    &--style-light-gray {
      background: var(--theme-elevation-100);
      color: var(--theme-elevation-800);
    }

    &--style-warning {
      background: var(--theme-warning-150);
      color: var(--theme-warning-800);
    }

    &--style-success {
      background: var(--theme-success-150);
      color: var(--theme-success-800);
    }

    &--style-error {
      background: var(--theme-error-150);
      color: var(--theme-error-800);
    }

    &--style-dark {
      background: var(--theme-elevation-800);
      color: var(--theme-elevation-0);

      svg {
        @include color-svg(var(--theme-elevation-0));
      }

      &.pill--has-action {
        &:hover {
          background: var(--theme-elevation-750);
        }

        &:active {
          background: var(--theme-elevation-700);
        }
      }
    }

    &--size-medium {
      --pill-padding-block-start: calc(var(--base) * 0.2);
      --pill-padding-inline-end: calc(var(--base) * 0.6);
      --pill-padding-block-end: calc(var(--base) * 0.2);
      --pill-padding-inline-start: calc(var(--base) * 0.6);
    }

    &--size-small {
      --pill-icon-size: calc(var(--base) * 0.9);
      --pill-padding-block-start: 0;
      --pill-padding-inline-end: calc(var(--base) * 0.4);
      --pill-padding-inline-start: calc(var(--base) * 0.4);
      --pill-padding-block-end: 0;
    }
  }

  html[data-theme='light'] {
    .pill {
      &--style-always-white {
        background: var(--theme-elevation-0);
        color: var(--theme-elevation-800);
        border: 1px solid var(--theme-elevation-100);

        &.pill--has-action {
          &:hover,
          &:active {
            background: var(--theme-elevation-100);
          }
        }
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/Pill/index.tsx
Signals: React

```typescript
'use client'
import type { ElementType, HTMLAttributes } from 'react'

import React from 'react' // TODO: abstract this out to support all routers

import { Link } from '../Link/index.js'

export type PillStyle =
  | 'always-white'
  | 'dark'
  | 'error'
  | 'light'
  | 'light-gray'
  | 'success'
  | 'warning'
  | 'white'

export type PillProps = {
  alignIcon?: 'left' | 'right'
  'aria-checked'?: boolean
  'aria-controls'?: string
  'aria-expanded'?: boolean
  'aria-label'?: string
  children?: React.ReactNode
  className?: string
  draggable?: boolean
  elementProps?: {
    ref: React.RefCallback<HTMLElement>
  } & HTMLAttributes<HTMLElement>
  icon?: React.ReactNode
  id?: string
  onClick?: () => void
  /**
   * @default 'light'
   */
  pillStyle?: PillStyle
  rounded?: boolean
  size?: 'medium' | 'small'
  to?: string
}

export type RenderedTypeProps = {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  to: string
  type?: 'button'
}

import { useDraggableSortable } from '../DraggableSortable/useDraggableSortable/index.js'
import './index.scss'

const baseClass = 'pill'

const DraggablePill: React.FC<PillProps> = (props) => {
  const { id, className } = props

  const { attributes, isDragging, listeners, setNodeRef, transform } = useDraggableSortable({
    id,
  })

  return (
    <StaticPill
      {...props}
      className={[isDragging && `${baseClass}--is-dragging`, className].filter(Boolean).join(' ')}
      elementProps={{
        ...listeners,
        ...attributes,
        ref: setNodeRef,
        style: {
          transform,
        },
      }}
    />
  )
}

const StaticPill: React.FC<PillProps> = (props) => {
  const {
    id,
    alignIcon = 'right',
    'aria-checked': ariaChecked,
    'aria-controls': ariaControls,
    'aria-expanded': ariaExpanded,
    'aria-label': ariaLabel,
    children,
    className,
    draggable,
    elementProps,
    icon,
    onClick,
    pillStyle = 'light',
    rounded,
    size = 'medium',
    to,
  } = props

  const classes = [
    baseClass,
    `${baseClass}--style-${pillStyle}`,
    `${baseClass}--size-${size}`,
    className && className,
    to && `${baseClass}--has-link`,
    (to || onClick) && `${baseClass}--has-action`,
    icon && `${baseClass}--has-icon`,
    icon && `${baseClass}--align-icon-${alignIcon}`,
    draggable && `${baseClass}--draggable`,
    rounded && `${baseClass}--rounded`,
  ]
    .filter(Boolean)
    .join(' ')

  let Element: ElementType | React.FC<RenderedTypeProps> = 'div'

  if (onClick && !to) {
    Element = 'button'
  }

  if (to) {
    Element = Link
  }

  return (
    <Element
      {...elementProps}
      aria-checked={ariaChecked}
      aria-controls={ariaControls}
      aria-expanded={ariaExpanded}
      aria-label={ariaLabel}
      className={classes}
      href={to || null}
      id={id}
      onClick={onClick}
      type={Element === 'button' ? 'button' : undefined}
    >
      <span className={`${baseClass}__label`}>{children}</span>
      {Boolean(icon) && <span className={`${baseClass}__icon`}>{icon}</span>}
    </Element>
  )
}

export const Pill: React.FC<PillProps> = (props) => {
  const { draggable } = props

  if (draggable) {
    return <DraggablePill {...props} />
  }
  return <StaticPill {...props} />
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/PillSelector/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .pill-selector {
    display: flex;
    flex-wrap: wrap;
    background: var(--theme-elevation-50);
    padding: var(--base);
    gap: calc(var(--base) / 2);

    &__pill {
      background-color: transparent;
      box-shadow: 0 0 0 1px var(--theme-elevation-150);

      &.pill-selector__pill {
        cursor: pointer;

        &:hover {
          background-color: var(--theme-elevation-100);
        }
      }

      &.pill-selector__pill--selected {
        background-color: var(--theme-elevation-0);
        box-shadow:
          0 0px 1px 1px var(--theme-elevation-150),
          0 2px 4px -2px rgba(0, 0, 0, 0.1);

        &:hover {
          background-color: var(--theme-elevation-0);
          box-shadow:
            0 0px 1px 1px var(--theme-elevation-250),
            0 3px 4px -1px rgba(0, 0, 0, 0.1);
        }
      }
    }

    // TODO: delete this once all icons have been migrated to viewbox edge-to-edge
    .pill__icon {
      padding: 0;
    }

    @include small-break {
      padding: calc(var(--base) / 2);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/PillSelector/index.tsx
Signals: React

```typescript
'use client'

import React from 'react'

import { PlusIcon } from '../../icons/Plus/index.js'
import { XIcon } from '../../icons/X/index.js'
import { DraggableSortable } from '../DraggableSortable/index.js'
import { Pill } from '../Pill/index.js'
import './index.scss'

const baseClass = 'pill-selector'

export type SelectablePill = {
  key?: string
  Label?: React.ReactNode
  name: string
  selected: boolean
}

export type Props = {
  draggable?: {
    onDragEnd: (args: { moveFromIndex: number; moveToIndex: number }) => void
  }
  onClick?: (args: { pill: SelectablePill }) => Promise<void> | void
  pills: SelectablePill[]
}

/**
 * Displays a wrappable list of pills that can be selected or deselected.
 * If `draggable` is true, the pills can be reordered by dragging.
 */
export const PillSelector: React.FC<Props> = ({ draggable, onClick, pills }) => {
  // IMPORTANT: Do NOT wrap DraggableSortable in a dynamic component function using useMemo.
  // BAD: useMemo(() => ({ children }) => <DraggableSortable>...</DraggableSortable>, [deps])
  // This creates a new function reference on each recomputation, causing React to treat it as a
  // different component type, triggering unmount/mount cycles instead of just updating props.
  // GOOD: Use conditional rendering directly: draggable ? <DraggableSortable /> : <div />
  const pillElements = React.useMemo(() => {
    return pills.map((pill, i) => {
      return (
        <Pill
          alignIcon="left"
          aria-checked={pill.selected}
          className={[`${baseClass}__pill`, pill.selected && `${baseClass}__pill--selected`]
            .filter(Boolean)
            .join(' ')}
          draggable={Boolean(draggable)}
          icon={pill.selected ? <XIcon /> : <PlusIcon />}
          id={pill.name}
          key={pill.key ?? `${pill.name}-${i}`}
          onClick={() => {
            if (onClick) {
              void onClick({ pill })
            }
          }}
          size="small"
        >
          {pill.Label ?? <span className={`${baseClass}__pill-label`}>{pill.name}</span>}
        </Pill>
      )
    })
  }, [pills, onClick, draggable])

  if (draggable) {
    return (
      <DraggableSortable
        className={baseClass}
        ids={pills.map((pill) => pill.name)}
        onDragEnd={({ moveFromIndex, moveToIndex }) => {
          draggable.onDragEnd({
            moveFromIndex,
            moveToIndex,
          })
        }}
      >
        {pillElements}
      </DraggableSortable>
    )
  }

  return <div className={baseClass}>{pillElements}</div>
}
```

--------------------------------------------------------------------------------

````
