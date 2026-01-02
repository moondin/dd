---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 170
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 170 of 695)

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
Location: payload-main/packages/next/src/views/Version/SelectComparison/index.tsx
Signals: React

```typescript
'use client'

import { fieldBaseClass, ReactSelect, useTranslation } from '@payloadcms/ui'
import React, { memo, useCallback, useMemo } from 'react'

import type { CompareOption } from '../Default/types.js'

import './index.scss'

import type { Props } from './types.js'

import { useVersionDrawer } from './VersionDrawer/index.js'

const baseClass = 'compare-version'

export const SelectComparison: React.FC<Props> = memo((props) => {
  const {
    collectionSlug,
    docID,
    globalSlug,
    onChange: onChangeFromProps,
    versionFromID,
    versionFromOptions,
  } = props
  const { t } = useTranslation()

  const { Drawer, openDrawer } = useVersionDrawer({ collectionSlug, docID, globalSlug })

  const options = useMemo(() => {
    return [
      ...versionFromOptions,
      {
        label: <span className={`${baseClass}-moreVersions`}>{t('version:moreVersions')}</span>,
        value: 'more',
      },
    ]
  }, [t, versionFromOptions])

  const currentOption = useMemo(
    () => versionFromOptions.find((option) => option.value === versionFromID),
    [versionFromOptions, versionFromID],
  )

  const onChange = useCallback(
    (val: CompareOption) => {
      if (val.value === 'more') {
        openDrawer()
        return
      }
      onChangeFromProps(val)
    },
    [onChangeFromProps, openDrawer],
  )

  return (
    <div className={[fieldBaseClass, baseClass].filter(Boolean).join(' ')}>
      <ReactSelect
        isClearable={false}
        isSearchable={false}
        onChange={onChange}
        options={options}
        placeholder={t('version:selectVersionToCompare')}
        value={currentOption}
      />
      <Drawer />
    </div>
  )
})
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/next/src/views/Version/SelectComparison/types.ts

```typescript
import type { PaginatedDocs, SanitizedCollectionConfig } from 'payload'

import type { CompareOption } from '../Default/types.js'

export type Props = {
  collectionSlug?: string
  docID?: number | string
  globalSlug?: string
  onChange: (val: CompareOption) => void
  versionFromID?: string
  versionFromOptions: CompareOption[]
}

type CLEAR = {
  required: boolean
  type: 'CLEAR'
}

type ADD = {
  collection: SanitizedCollectionConfig
  data: PaginatedDocs<any>
  type: 'ADD'
}

export type Action = ADD | CLEAR

export type ValueWithRelation = {
  relationTo: string
  value: string
}
```

--------------------------------------------------------------------------------

---[FILE: CreatedAtCell.tsx]---
Location: payload-main/packages/next/src/views/Version/SelectComparison/VersionDrawer/CreatedAtCell.tsx
Signals: Next.js

```typescript
'use client'
import { useConfig, useModal, useRouteTransition, useTranslation } from '@payloadcms/ui'
import { formatDate } from '@payloadcms/ui/shared'
import { usePathname, useRouter, useSearchParams } from 'next/navigation.js'

import type { CreatedAtCellProps } from '../../../Versions/cells/CreatedAt/index.js'

export const VersionDrawerCreatedAtCell: React.FC<CreatedAtCellProps> = ({
  rowData: { id, updatedAt } = {},
}) => {
  const {
    config: {
      admin: { dateFormat },
    },
  } = useConfig()
  const { closeAllModals } = useModal()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { startRouteTransition } = useRouteTransition()

  const { i18n } = useTranslation()

  return (
    <button
      className="created-at-cell"
      onClick={() => {
        closeAllModals()
        const current = new URLSearchParams(Array.from(searchParams.entries()))

        if (id) {
          current.set('versionFrom', String(id))
        }

        const search = current.toString()
        const query = search ? `?${search}` : ''

        startRouteTransition(() => router.push(`${pathname}${query}`))
      }}
      type="button"
    >
      {formatDate({ date: updatedAt, i18n, pattern: dateFormat })}
    </button>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/next/src/views/Version/SelectComparison/VersionDrawer/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .version-drawer {
    .table {
      width: 100%;
    }

    .created-at-cell {
      // Button reset, + underline
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      text-decoration: underline;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/views/Version/SelectComparison/VersionDrawer/index.tsx
Signals: React, Next.js

```typescript
'use client'
import {
  Drawer,
  LoadingOverlay,
  toast,
  useDocumentInfo,
  useEditDepth,
  useModal,
  useServerFunctions,
  useTranslation,
} from '@payloadcms/ui'
import { useSearchParams } from 'next/navigation.js'

import './index.scss'

import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'

export const baseClass = 'version-drawer'
export const formatVersionDrawerSlug = ({
  depth,
  uuid,
}: {
  depth: number
  uuid: string // supply when creating a new document and no id is available
}) => `version-drawer_${depth}_${uuid}`

export const VersionDrawerContent: React.FC<{
  collectionSlug?: string
  docID?: number | string
  drawerSlug: string
  globalSlug?: string
}> = (props) => {
  const { collectionSlug, docID, drawerSlug, globalSlug } = props
  const { isTrashed } = useDocumentInfo()
  const { closeModal } = useModal()
  const searchParams = useSearchParams()
  const prevSearchParams = useRef(searchParams)

  const { renderDocument } = useServerFunctions()

  const [DocumentView, setDocumentView] = useState<React.ReactNode>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const hasRenderedDocument = useRef(false)
  const { t } = useTranslation()

  const getDocumentView = useCallback(
    (docID?: number | string) => {
      const fetchDocumentView = async () => {
        setIsLoading(true)

        try {
          const isGlobal = Boolean(globalSlug)
          const entitySlug = collectionSlug ?? globalSlug

          const result = await renderDocument({
            collectionSlug: entitySlug,
            docID,
            drawerSlug,
            paramsOverride: {
              segments: [
                isGlobal ? 'globals' : 'collections',
                entitySlug,
                ...(isTrashed ? ['trash'] : []),
                isGlobal ? undefined : String(docID),
                'versions',
              ].filter(Boolean),
            },
            redirectAfterDelete: false,
            redirectAfterDuplicate: false,
            searchParams: Object.fromEntries(searchParams.entries()),
            versions: {
              disableGutter: true,
              useVersionDrawerCreatedAtCell: true,
            },
          })

          if (result?.Document) {
            setDocumentView(result.Document)
            setIsLoading(false)
          }
        } catch (error) {
          toast.error(error?.message || t('error:unspecific'))
          closeModal(drawerSlug)
          // toast.error(data?.errors?.[0].message || t('error:unspecific'))
        }
      }

      void fetchDocumentView()
    },
    [
      closeModal,
      collectionSlug,
      drawerSlug,
      globalSlug,
      isTrashed,
      renderDocument,
      searchParams,
      t,
    ],
  )

  useEffect(() => {
    if (!hasRenderedDocument.current || prevSearchParams.current !== searchParams) {
      prevSearchParams.current = searchParams
      getDocumentView(docID)
      hasRenderedDocument.current = true
    }
  }, [docID, getDocumentView, searchParams])

  if (isLoading) {
    return <LoadingOverlay />
  }

  return DocumentView
}
export const VersionDrawer: React.FC<{
  collectionSlug?: string
  docID?: number | string
  drawerSlug: string
  globalSlug?: string
}> = (props) => {
  const { collectionSlug, docID, drawerSlug, globalSlug } = props
  const { t } = useTranslation()

  return (
    <Drawer
      className={baseClass}
      gutter={true}
      slug={drawerSlug}
      title={t('version:selectVersionToCompare')}
    >
      <VersionDrawerContent
        collectionSlug={collectionSlug}
        docID={docID}
        drawerSlug={drawerSlug}
        globalSlug={globalSlug}
      />
    </Drawer>
  )
}

export const useVersionDrawer = ({
  collectionSlug,
  docID,
  globalSlug,
}: {
  collectionSlug?: string
  docID?: number | string
  globalSlug?: string
}) => {
  const drawerDepth = useEditDepth()
  const uuid = useId()
  const { closeModal, modalState, openModal, toggleModal } = useModal()
  const [isOpen, setIsOpen] = useState(false)

  const drawerSlug = formatVersionDrawerSlug({
    depth: drawerDepth,
    uuid,
  })

  useEffect(() => {
    setIsOpen(Boolean(modalState[drawerSlug]?.isOpen))
  }, [modalState, drawerSlug])

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
    return () => (
      <VersionDrawer
        collectionSlug={collectionSlug}
        docID={docID}
        drawerSlug={drawerSlug}
        globalSlug={globalSlug}
      />
    )
  }, [collectionSlug, docID, drawerSlug, globalSlug])

  return useMemo(
    () => ({
      closeDrawer,
      Drawer: MemoizedDrawer,
      drawerDepth,
      drawerSlug,
      isDrawerOpen: isOpen,
      openDrawer,
      toggleDrawer,
    }),
    [MemoizedDrawer, closeDrawer, drawerDepth, drawerSlug, isOpen, openDrawer, toggleDrawer],
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/views/Version/SelectLocales/index.tsx
Signals: React

```typescript
'use client'

import { AnimateHeight } from '@payloadcms/ui'
import { PillSelector, type SelectablePill } from '@payloadcms/ui'
import React from 'react'

const baseClass = 'select-version-locales'

export type SelectedLocaleOnChange = (args: { locales: SelectablePill[] }) => void
export type Props = {
  locales: SelectablePill[]
  localeSelectorOpen: boolean
  onChange: SelectedLocaleOnChange
}

export const SelectLocales: React.FC<Props> = ({ locales, localeSelectorOpen, onChange }) => {
  return (
    <AnimateHeight
      className={baseClass}
      height={localeSelectorOpen ? 'auto' : 0}
      id={`${baseClass}-locales`}
    >
      <PillSelector
        onClick={({ pill }) => {
          const newLocales = locales.map((locale) => {
            if (locale.name === pill.name) {
              return {
                ...locale,
                selected: !pill.selected,
              }
            } else {
              return locale
            }
          })
          onChange({ locales: newLocales })
        }}
        pills={locales}
      />
    </AnimateHeight>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: getVersionLabel.ts]---
Location: payload-main/packages/next/src/views/Version/VersionPillLabel/getVersionLabel.ts

```typescript
import type { TFunction } from '@payloadcms/translations'
import type { Pill } from '@payloadcms/ui'

type Args = {
  currentlyPublishedVersion?: {
    id: number | string
    updatedAt: string
  }
  latestDraftVersion?: {
    id: number | string
    updatedAt: string
  }
  t: TFunction
  version: {
    id: number | string
    version: { _status?: string }
  }
}

/**
 * Gets the appropriate version label and version pill styling
 * given existing versions and the current version status.
 */
export function getVersionLabel({
  currentlyPublishedVersion,
  latestDraftVersion,
  t,
  version,
}: Args): {
  label: string
  name: 'currentDraft' | 'currentlyPublished' | 'draft' | 'previouslyPublished' | 'published'
  pillStyle: Parameters<typeof Pill>[0]['pillStyle']
} {
  const publishedNewerThanDraft =
    currentlyPublishedVersion?.updatedAt > latestDraftVersion?.updatedAt

  if (version.version._status === 'draft') {
    if (publishedNewerThanDraft) {
      return {
        name: 'draft',
        label: t('version:draft'),
        pillStyle: 'light',
      }
    } else {
      return {
        name: version.id === latestDraftVersion?.id ? 'currentDraft' : 'draft',
        label:
          version.id === latestDraftVersion?.id ? t('version:currentDraft') : t('version:draft'),
        pillStyle: 'light',
      }
    }
  } else {
    const isCurrentlyPublished = version.id === currentlyPublishedVersion?.id
    return {
      name: isCurrentlyPublished ? 'currentlyPublished' : 'previouslyPublished',
      label: isCurrentlyPublished
        ? t('version:currentlyPublished')
        : t('version:previouslyPublished'),
      pillStyle: isCurrentlyPublished ? 'success' : 'light',
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/next/src/views/Version/VersionPillLabel/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .version-pill-label {
    display: flex;
    align-items: center;
    gap: calc(var(--base) / 2);

    &-text {
      font-weight: 500;
    }

    &-date {
      color: var(--theme-elevation-500);
    }
  }

  @include small-break {
    .version-pill-label {
      // Column
      flex-direction: column;
      align-items: flex-start;
      gap: 0;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: VersionPillLabel.tsx]---
Location: payload-main/packages/next/src/views/Version/VersionPillLabel/VersionPillLabel.tsx
Signals: React

```typescript
'use client'

import { Pill, useConfig, useTranslation } from '@payloadcms/ui'
import { formatDate } from '@payloadcms/ui/shared'
import React from 'react'

import './index.scss'
import { getVersionLabel } from './getVersionLabel.js'

const baseClass = 'version-pill-label'

const renderPill = (label: React.ReactNode, pillStyle: Parameters<typeof Pill>[0]['pillStyle']) => {
  return (
    <Pill pillStyle={pillStyle} size="small">
      {label}
    </Pill>
  )
}

export const VersionPillLabel: React.FC<{
  currentlyPublishedVersion?: {
    id: number | string
    updatedAt: string
  }
  disableDate?: boolean

  doc: {
    [key: string]: unknown
    id: number | string
    publishedLocale?: string
    updatedAt?: string
    version: {
      [key: string]: unknown
      _status: string
    }
  }
  /**
   * By default, the date is displayed first, followed by the version label.
   * @default false
   */
  labelFirst?: boolean
  labelOverride?: React.ReactNode
  /**
   * @default 'pill'
   */
  labelStyle?: 'pill' | 'text'
  labelSuffix?: React.ReactNode
  latestDraftVersion?: {
    id: number | string
    updatedAt: string
  }
}> = ({
  currentlyPublishedVersion,
  disableDate = false,
  doc,
  labelFirst = false,
  labelOverride,
  labelStyle = 'pill',
  labelSuffix,
  latestDraftVersion,
}) => {
  const {
    config: {
      admin: { dateFormat },
      localization,
    },
  } = useConfig()
  const { i18n, t } = useTranslation()

  const { label, pillStyle } = getVersionLabel({
    currentlyPublishedVersion,
    latestDraftVersion,
    t,
    version: doc,
  })
  const labelText: React.ReactNode = (
    <span>
      {labelOverride || label}
      {labelSuffix}
    </span>
  )

  const showDate = !disableDate && doc.updatedAt
  const formattedDate = showDate
    ? formatDate({ date: doc.updatedAt, i18n, pattern: dateFormat })
    : null

  const localeCode = Array.isArray(doc.publishedLocale)
    ? doc.publishedLocale[0]
    : doc.publishedLocale

  const locale =
    localization && localization?.locales
      ? localization.locales.find((loc) => loc.code === localeCode)
      : null
  const localeLabel = locale ? locale?.label?.[i18n?.language] || locale?.label : null

  return (
    <div className={baseClass}>
      {labelFirst ? (
        <React.Fragment>
          {labelStyle === 'pill' ? (
            renderPill(labelText, pillStyle)
          ) : (
            <span className={`${baseClass}-text`}>{labelText}</span>
          )}
          {showDate && <span className={`${baseClass}-date`}>{formattedDate}</span>}
        </React.Fragment>
      ) : (
        <React.Fragment>
          {showDate && <span className={`${baseClass}-date`}>{formattedDate}</span>}
          {labelStyle === 'pill' ? (
            renderPill(labelText, pillStyle)
          ) : (
            <span className={`${baseClass}-text`}>{labelText}</span>
          )}
        </React.Fragment>
      )}
      {localeLabel && <Pill size="small">{localeLabel}</Pill>}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: buildColumns.tsx]---
Location: payload-main/packages/next/src/views/Versions/buildColumns.tsx
Signals: React

```typescript
import type { I18n } from '@payloadcms/translations'
import type {
  Column,
  PaginatedDocs,
  SanitizedCollectionConfig,
  SanitizedGlobalConfig,
  TypeWithVersion,
} from 'payload'

import { SortColumn } from '@payloadcms/ui'
import { hasDraftsEnabled } from 'payload/shared'
import React from 'react'

import { AutosaveCell } from './cells/AutosaveCell/index.js'
import { CreatedAtCell, type CreatedAtCellProps } from './cells/CreatedAt/index.js'
import { IDCell } from './cells/ID/index.js'

export const buildVersionColumns = ({
  collectionConfig,
  CreatedAtCellOverride,
  currentlyPublishedVersion,
  docID,
  docs,
  globalConfig,
  i18n: { t },
  isTrashed,
  latestDraftVersion,
}: {
  collectionConfig?: SanitizedCollectionConfig
  CreatedAtCellOverride?: React.ComponentType<CreatedAtCellProps>
  currentlyPublishedVersion?: {
    id: number | string
    updatedAt: string
  }
  docID?: number | string
  docs: PaginatedDocs<TypeWithVersion<any>>['docs']
  globalConfig?: SanitizedGlobalConfig
  i18n: I18n
  isTrashed?: boolean
  latestDraftVersion?: {
    id: number | string
    updatedAt: string
  }
}): Column[] => {
  const entityConfig = collectionConfig || globalConfig

  const CreatedAtCellComponent = CreatedAtCellOverride ?? CreatedAtCell

  const columns: Column[] = [
    {
      accessor: 'updatedAt',
      active: true,
      field: {
        name: '',
        type: 'date',
      },
      Heading: <SortColumn Label={t('general:updatedAt')} name="updatedAt" />,
      renderedCells: docs.map((doc, i) => {
        return (
          <CreatedAtCellComponent
            collectionSlug={collectionConfig?.slug}
            docID={docID}
            globalSlug={globalConfig?.slug}
            isTrashed={isTrashed}
            key={i}
            rowData={{
              id: doc.id,
              updatedAt: doc.updatedAt,
            }}
          />
        )
      }),
    },
    {
      accessor: 'id',
      active: true,
      field: {
        name: '',
        type: 'text',
      },
      Heading: <SortColumn disable Label={t('version:versionID')} name="id" />,
      renderedCells: docs.map((doc, i) => {
        return <IDCell id={doc.id} key={i} />
      }),
    },
  ]

  if (hasDraftsEnabled(entityConfig)) {
    columns.push({
      accessor: '_status',
      active: true,
      field: {
        name: '',
        type: 'checkbox',
      },
      Heading: <SortColumn disable Label={t('version:status')} name="status" />,
      renderedCells: docs.map((doc, i) => {
        return (
          <AutosaveCell
            currentlyPublishedVersion={currentlyPublishedVersion}
            key={i}
            latestDraftVersion={latestDraftVersion}
            rowData={doc}
          />
        )
      }),
    })
  }

  return columns
}
```

--------------------------------------------------------------------------------

---[FILE: index.client.tsx]---
Location: payload-main/packages/next/src/views/Versions/index.client.tsx
Signals: React, Next.js

```typescript
'use client'
import type { Column, SanitizedCollectionConfig } from 'payload'

import {
  LoadingOverlayToggle,
  Pagination,
  PerPage,
  Table,
  useListQuery,
  useTranslation,
} from '@payloadcms/ui'
import { useSearchParams } from 'next/navigation.js'
import React from 'react'

export const VersionsViewClient: React.FC<{
  readonly baseClass: string
  readonly columns: Column[]
  readonly fetchURL: string
  readonly paginationLimits?: SanitizedCollectionConfig['admin']['pagination']['limits']
}> = (props) => {
  const { baseClass, columns, paginationLimits } = props

  const { data, handlePageChange, handlePerPageChange } = useListQuery()

  const searchParams = useSearchParams()
  const limit = searchParams.get('limit')

  const { i18n } = useTranslation()

  const versionCount = data?.totalDocs || 0

  return (
    <React.Fragment>
      <LoadingOverlayToggle name="versions" show={!data} />
      {versionCount === 0 && (
        <div className={`${baseClass}__no-versions`}>
          {i18n.t('version:noFurtherVersionsFound')}
        </div>
      )}
      {versionCount > 0 && (
        <React.Fragment>
          <Table columns={columns} data={data?.docs} />
          <div className={`${baseClass}__page-controls`}>
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
            {data?.totalDocs > 0 && (
              <React.Fragment>
                <div className={`${baseClass}__page-info`}>
                  {data.page * data.limit - (data.limit - 1)}-
                  {data.totalPages > 1 && data.totalPages !== data.page
                    ? data.limit * data.page
                    : data.totalDocs}{' '}
                  {i18n.t('general:of')} {data.totalDocs}
                </div>
                <PerPage
                  handleChange={handlePerPageChange}
                  limit={limit ? Number(limit) : 10}
                  limits={paginationLimits}
                />
              </React.Fragment>
            )}
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/next/src/views/Versions/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .versions {
    width: 100%;
    margin-bottom: calc(var(--base) * 2);

    &__wrap {
      padding-top: 0;
      padding-bottom: var(--spacing-view-bottom);
      margin-top: calc(var(--base) * 0.75);
    }

    &__header {
      margin-bottom: var(--base);
    }

    &__no-versions {
      margin-top: calc(var(--base) * 1.5);
    }

    &__parent-doc {
      .banner__content {
        display: flex;
      }
    }

    &__parent-doc-pills {
      [dir='ltr'] & {
        margin-left: auto;
      }

      [dir='rtl'] & {
        margin-right: auto;
      }
    }

    .table {
      table {
        width: 100%;
        overflow: auto;
      }
    }

    &__page-controls {
      width: 100%;
      display: flex;
      align-items: center;
    }

    .paginator {
      margin-bottom: 0;
    }

    &__page-info {
      [dir='ltr'] & {
        margin-right: var(--base);
        margin-left: auto;
      }

      [dir='rtl'] & {
        margin-left: var(--base);
        margin-right: auto;
      }
    }

    @include mid-break {
      &__wrap {
        padding-top: 0;
        margin-top: 0;
      }

      // on mobile, extend the table all the way to the viewport edges
      // this is to visually indicate overflowing content
      .table {
        display: flex;
        width: calc(100% + calc(var(--gutter-h) * 2));
        max-width: unset;
        left: calc(var(--gutter-h) * -1);
        position: relative;
        padding-left: var(--gutter-h);

        &::after {
          content: '';
          height: 1px;
          padding-right: var(--gutter-h);
        }
      }

      &__page-controls {
        flex-wrap: wrap;
      }

      &__page-info {
        [dir='ltr'] & {
          margin-left: 0;
        }

        [dir='rtl'] & {
          margin-right: 0;
        }
      }

      .paginator {
        width: 100%;
        margin-bottom: var(--base);
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/views/Versions/index.tsx
Signals: React, Next.js

```typescript
import { Gutter, ListQueryProvider, SetDocumentStepNav } from '@payloadcms/ui'
import { notFound } from 'next/navigation.js'
import { type DocumentViewServerProps, type PaginatedDocs, type Where } from 'payload'
import { formatApiURL, hasDraftsEnabled, isNumber } from 'payload/shared'
import React from 'react'

import { fetchLatestVersion, fetchVersions } from '../Version/fetchVersions.js'
import { VersionDrawerCreatedAtCell } from '../Version/SelectComparison/VersionDrawer/CreatedAtCell.js'
import { buildVersionColumns } from './buildColumns.js'
import { VersionsViewClient } from './index.client.js'
import './index.scss'

const baseClass = 'versions'

export async function VersionsView(props: DocumentViewServerProps) {
  const {
    hasPublishedDoc,
    initPageResult: {
      collectionConfig,
      docID: id,
      globalConfig,
      req,
      req: {
        i18n,
        payload: { config },
        t,
        user,
      },
    },
    routeSegments: segments,
    searchParams: { limit, page, sort },
    versions: { disableGutter = false, useVersionDrawerCreatedAtCell = false } = {},
  } = props

  const draftsEnabled = hasDraftsEnabled(collectionConfig || globalConfig)

  const collectionSlug = collectionConfig?.slug
  const globalSlug = globalConfig?.slug

  const isTrashed = segments[2] === 'trash'

  const {
    localization,
    routes: { api: apiRoute },
    serverURL,
  } = config

  const whereQuery: {
    and: Array<{ parent?: { equals: number | string }; snapshot?: { not_equals: boolean } }>
  } & Where = {
    and: [],
  }
  if (localization && draftsEnabled) {
    whereQuery.and.push({
      snapshot: {
        not_equals: true,
      },
    })
  }

  const defaultLimit = collectionSlug ? collectionConfig?.admin?.pagination?.defaultLimit : 10

  const limitToUse = isNumber(limit) ? Number(limit) : defaultLimit

  const versionsData: PaginatedDocs = await fetchVersions({
    collectionSlug,
    depth: 0,
    globalSlug,
    limit: limitToUse,
    overrideAccess: false,
    page: page ? parseInt(page.toString(), 10) : undefined,
    parentID: id,
    req,
    sort: sort as string,
    user,
    where: whereQuery,
  })

  if (!versionsData) {
    return notFound()
  }

  const [currentlyPublishedVersion, latestDraftVersion] = await Promise.all([
    hasPublishedDoc
      ? fetchLatestVersion({
          collectionSlug,
          depth: 0,
          globalSlug,
          overrideAccess: false,
          parentID: id,
          req,
          select: {
            id: true,
            updatedAt: true,
          },
          status: 'published',
          user,
        })
      : Promise.resolve(null),
    draftsEnabled
      ? fetchLatestVersion({
          collectionSlug,
          depth: 0,
          globalSlug,
          overrideAccess: false,
          parentID: id,
          req,
          select: {
            id: true,
            updatedAt: true,
          },
          status: 'draft',
          user,
        })
      : Promise.resolve(null),
  ])

  const fetchURL = formatApiURL({
    apiRoute,
    path: collectionSlug ? `/${collectionSlug}/versions` : `/${globalSlug}/versions`,
    serverURL,
  })

  const columns = buildVersionColumns({
    collectionConfig,
    CreatedAtCellOverride: useVersionDrawerCreatedAtCell ? VersionDrawerCreatedAtCell : undefined,
    currentlyPublishedVersion,
    docID: id,
    docs: versionsData?.docs,
    globalConfig,
    i18n,
    isTrashed,
    latestDraftVersion,
  })

  const pluralLabel =
    typeof collectionConfig?.labels?.plural === 'function'
      ? collectionConfig.labels.plural({ i18n, t })
      : (collectionConfig?.labels?.plural ?? globalConfig?.label)

  const GutterComponent = disableGutter ? React.Fragment : Gutter

  return (
    <React.Fragment>
      <SetDocumentStepNav
        collectionSlug={collectionSlug}
        globalSlug={globalSlug}
        id={id}
        isTrashed={isTrashed}
        pluralLabel={pluralLabel}
        useAsTitle={collectionConfig?.admin?.useAsTitle || globalSlug}
        view={i18n.t('version:versions')}
      />
      <main className={baseClass}>
        <GutterComponent className={`${baseClass}__wrap`}>
          <ListQueryProvider
            data={versionsData}
            modifySearchParams
            orderableFieldName={collectionConfig?.orderable === true ? '_order' : undefined}
            query={{
              limit: limitToUse,
              sort: sort as string,
            }}
          >
            <VersionsViewClient
              baseClass={baseClass}
              columns={columns}
              fetchURL={fetchURL}
              paginationLimits={collectionConfig?.admin?.pagination?.limits}
            />
          </ListQueryProvider>
        </GutterComponent>
      </main>
    </React.Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: metadata.ts]---
Location: payload-main/packages/next/src/views/Versions/metadata.ts
Signals: Next.js

```typescript
import type { Metadata } from 'next'
import type { MetaConfig } from 'payload'

import { getTranslation } from '@payloadcms/translations'

import type { GenerateEditViewMetadata } from '../Document/getMetaBySegment.js'

import { generateMetadata } from '../../utilities/meta.js'

/**
 * @todo Remove the `MetaConfig` type assertions. They are currently required because of how the `Metadata` type from `next` consumes the `URL` type.
 */
export const generateVersionsViewMetadata: GenerateEditViewMetadata = async ({
  collectionConfig,
  config,
  globalConfig,
  i18n,
}): Promise<Metadata> => {
  const { t } = i18n

  const entityLabel = collectionConfig
    ? getTranslation(collectionConfig.labels.singular, i18n)
    : globalConfig
      ? getTranslation(globalConfig.label, i18n)
      : ''

  let metaToUse: MetaConfig = {
    ...(config.admin.meta || {}),
  }

  const data: any = {} // TODO: figure this out

  if (collectionConfig) {
    const useAsTitle = collectionConfig?.admin?.useAsTitle || 'id'
    const titleFromData = data?.[useAsTitle]

    metaToUse = {
      ...(config.admin.meta || {}),
      description: t('version:viewingVersions', {
        documentTitle: data?.[useAsTitle],
        entitySlug: collectionConfig.slug,
      }),
      title: `${t('version:versions')}${titleFromData ? ` - ${titleFromData}` : ''} - ${entityLabel}`,
      ...(collectionConfig?.admin.meta || {}),
      ...(collectionConfig?.admin?.components?.views?.edit?.versions?.meta || {}),
    }
  }

  if (globalConfig) {
    metaToUse = {
      ...(config.admin.meta || {}),
      description: t('version:viewingVersionsGlobal', { entitySlug: globalConfig.slug }),
      title: `${t('version:versions')} - ${entityLabel}`,
      ...((globalConfig?.admin.meta || {}) as MetaConfig),
      ...((globalConfig?.admin?.components?.views?.edit?.versions?.meta || {}) as MetaConfig),
    }
  }

  return generateMetadata({
    ...metaToUse,
    serverURL: config.serverURL,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/next/src/views/Versions/types.ts

```typescript
import type { I18n } from '@payloadcms/translations'
import type {
  PaginatedDocs,
  SanitizedCollectionConfig,
  SanitizedConfig,
  SanitizedGlobalConfig,
  TypedUser,
} from 'payload'

export type DefaultVersionsViewProps = {
  canAccessAdmin: boolean
  collectionConfig?: SanitizedCollectionConfig
  config: SanitizedConfig
  data: Document
  editURL: string
  entityLabel: string
  globalConfig?: SanitizedGlobalConfig
  i18n: I18n
  id: number | string
  limit: number
  user: TypedUser
  versionsData: PaginatedDocs<Document>
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/next/src/views/Versions/cells/AutosaveCell/index.scss

```text
@layer payload-default {
  .autosave-cell {
    &__items {
      display: flex;
      align-items: center;
      gap: calc(var(--base) * 0.5);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/views/Versions/cells/AutosaveCell/index.tsx
Signals: React

```typescript
'use client'
import { Pill, useTranslation } from '@payloadcms/ui'
import React from 'react'

import './index.scss'
import { VersionPillLabel } from '../../../Version/VersionPillLabel/VersionPillLabel.js'

const baseClass = 'autosave-cell'

type AutosaveCellProps = {
  currentlyPublishedVersion?: {
    id: number | string
    updatedAt: string
  }
  latestDraftVersion?: {
    id: number | string
    updatedAt: string
  }
  rowData: {
    autosave?: boolean
    id: number | string
    publishedLocale?: string
    version: {
      _status: string
    }
  }
}

export const AutosaveCell: React.FC<AutosaveCellProps> = ({
  currentlyPublishedVersion,
  latestDraftVersion,
  rowData,
}) => {
  const { t } = useTranslation()

  return (
    <div className={`${baseClass}__items`}>
      {rowData?.autosave && <Pill size="small">{t('version:autosave')}</Pill>}
      <VersionPillLabel
        currentlyPublishedVersion={currentlyPublishedVersion}
        disableDate={true}
        doc={rowData}
        labelFirst={false}
        labelStyle="pill"
        latestDraftVersion={latestDraftVersion}
      />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/views/Versions/cells/CreatedAt/index.tsx
Signals: React

```typescript
'use client'
import { Link, useConfig, useTranslation } from '@payloadcms/ui'
import { formatDate } from '@payloadcms/ui/shared'
import { formatAdminURL } from 'payload/shared'
import React from 'react'

export type CreatedAtCellProps = {
  collectionSlug?: string
  docID?: number | string
  globalSlug?: string
  isTrashed?: boolean
  rowData?: {
    id: number | string
    updatedAt: Date | number | string
  }
}

export const CreatedAtCell: React.FC<CreatedAtCellProps> = ({
  collectionSlug,
  docID,
  globalSlug,
  isTrashed,
  rowData: { id, updatedAt } = {},
}) => {
  const {
    config: {
      admin: { dateFormat },
      routes: { admin: adminRoute },
      serverURL,
    },
  } = useConfig()

  const { i18n } = useTranslation()

  const trashedDocPrefix = isTrashed ? 'trash/' : ''

  let to: string

  if (collectionSlug) {
    to = formatAdminURL({
      adminRoute,
      path: `/collections/${collectionSlug}/${trashedDocPrefix}${docID}/versions/${id}`,
      serverURL,
    })
  }

  if (globalSlug) {
    to = formatAdminURL({
      adminRoute,
      path: `/globals/${globalSlug}/versions/${id}`,
      serverURL,
    })
  }

  return (
    <Link href={to} prefetch={false}>
      {formatDate({ date: updatedAt, i18n, pattern: dateFormat })}
    </Link>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/views/Versions/cells/ID/index.tsx
Signals: React

```typescript
'use client'
import React, { Fragment } from 'react'

export function IDCell({ id }: { id: number | string }) {
  return <Fragment>{id}</Fragment>
}
```

--------------------------------------------------------------------------------

````
