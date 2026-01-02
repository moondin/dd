---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 381
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 381 of 695)

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
Location: payload-main/packages/ui/src/elements/RenderTitle/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .render-title {
    display: inline-block;
    &__id {
      vertical-align: middle;
      position: relative;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/RenderTitle/index.tsx
Signals: React

```typescript
'use client'
import React, { Fragment } from 'react'

import { useDocumentInfo } from '../../providers/DocumentInfo/index.js'
import { useDocumentTitle } from '../../providers/DocumentTitle/index.js'
import { IDLabel } from '../IDLabel/index.js'
import './index.scss'

const baseClass = 'render-title'

export type RenderTitleProps = {
  className?: string
  element?: React.ElementType
  fallback?: string
  fallbackToID?: boolean
  title?: string
}

export const RenderTitle: React.FC<RenderTitleProps> = (props) => {
  const { className, element = 'h1', fallback, title: titleFromProps } = props

  const { id, isInitializing } = useDocumentInfo()
  const { title: titleFromContext } = useDocumentTitle()

  const title = titleFromProps || titleFromContext || fallback

  const idAsTitle = title === id

  const Tag = element

  // Render and invisible character to prevent layout shift when the title populates from context
  const EmptySpace = <Fragment>&nbsp;</Fragment>

  return (
    <Tag
      className={[className, baseClass, idAsTitle && `${baseClass}--has-id`]
        .filter(Boolean)
        .join(' ')}
      data-doc-id={id}
      title={title}
    >
      {isInitializing ? (
        EmptySpace
      ) : (
        <Fragment>
          {idAsTitle ? <IDLabel className={`${baseClass}__id`} id={id} /> : title || EmptySpace}
        </Fragment>
      )}
    </Tag>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/RestoreButton/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .restore-button {
    @include blur-bg;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    &__toggle {
      @extend %btn-reset;
    }

    &__checkbox {
      padding: calc(var(--base) * 0.5) 0;

      .checkbox-input {
        label {
          padding-bottom: 0;
        }
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/RestoreButton/index.tsx
Signals: React, Next.js

```typescript
'use client'

import type { SanitizedCollectionConfig } from 'payload'

import { useModal } from '@faceless-ui/modal'
import { getTranslation } from '@payloadcms/translations'
import { useRouter } from 'next/navigation.js'
import { formatAdminURL } from 'payload/shared'
import * as qs from 'qs-esm'
import React, { Fragment, useCallback, useState } from 'react'
import { toast } from 'sonner'

import type { DocumentDrawerContextType } from '../DocumentDrawer/Provider.js'

import { CheckboxInput } from '../../fields/Checkbox/Input.js'
import { useConfig } from '../../providers/Config/index.js'
import { useDocumentTitle } from '../../providers/DocumentTitle/index.js'
import { useRouteTransition } from '../../providers/RouteTransition/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { requests } from '../../utilities/api.js'
import { Button } from '../Button/index.js'
import { ConfirmationModal } from '../ConfirmationModal/index.js'
import { Translation } from '../Translation/index.js'
import './index.scss'

const baseClass = 'restore-button'

export type Props = {
  readonly buttonId?: string
  readonly collectionSlug: SanitizedCollectionConfig['slug']
  readonly id?: string
  readonly onRestore?: DocumentDrawerContextType['onRestore']
  readonly redirectAfterRestore?: boolean
  readonly singularLabel: SanitizedCollectionConfig['labels']['singular']
  readonly title?: string
}

export const RestoreButton: React.FC<Props> = (props) => {
  const {
    id,
    buttonId,
    collectionSlug,
    onRestore,
    redirectAfterRestore = true,
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

  const modalSlug = `restore-${id}`

  const [restoreAsPublished, setRestoreAsPublished] = useState(false)

  const addDefaultError = useCallback(() => {
    toast.error(t('error:restoringTitle', { title }))
  }, [t, title])

  const handleRestore = useCallback(async () => {
    try {
      const url = `${serverURL}${api}/${collectionSlug}?${qs.stringify({
        trash: true,
        where: {
          and: [{ id: { equals: id } }, { deletedAt: { exists: true } }],
        },
      })}`

      const body: Record<string, unknown> = {
        deletedAt: null,
      }

      // Only include _status if drafts are enabled
      if (collectionConfig?.versions?.drafts) {
        body._status = restoreAsPublished ? 'published' : 'draft'
      }

      const res = await requests.patch(url, {
        body: JSON.stringify(body),
        headers: {
          'Accept-Language': i18n.language,
          'Content-Type': 'application/json',
        },
      })

      const json = await res.json()

      if (res.status < 400) {
        toast.success(
          t('general:titleRestored', {
            label: getTranslation(singularLabel, i18n),
            title,
          }) || json.message,
        )

        if (redirectAfterRestore) {
          return startRouteTransition(() =>
            router.push(
              formatAdminURL({
                adminRoute,
                path: `/collections/${collectionSlug}/${id}`,
                serverURL,
              }),
            ),
          )
        }

        if (typeof onRestore === 'function') {
          await onRestore({ id, collectionConfig })
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
    redirectAfterRestore,
    onRestore,
    collectionConfig,
    startRouteTransition,
    restoreAsPublished,
  ])

  if (id) {
    return (
      <Fragment>
        <Button
          buttonStyle="primary"
          id={buttonId}
          key={buttonId}
          onClick={() => {
            openModal(modalSlug)
          }}
        >
          {t('general:restore')}
        </Button>
        <ConfirmationModal
          body={
            <Fragment>
              <Translation
                elements={{
                  '1': ({ children }) => <strong>{children}</strong>,
                }}
                i18nKey={
                  collectionConfig?.versions?.drafts
                    ? 'general:aboutToRestoreAsDraft'
                    : 'general:aboutToRestore'
                }
                t={t}
                variables={{
                  label: getTranslation(singularLabel, i18n),
                  title: titleFromProps || title || id,
                }}
              />
              {collectionConfig?.versions?.drafts && (
                <div className={`${baseClass}__checkbox`}>
                  <CheckboxInput
                    checked={restoreAsPublished}
                    id="restore-as-published"
                    label={t('general:restoreAsPublished')}
                    name="restore-as-published"
                    onToggle={(e) => setRestoreAsPublished(e.target.checked)}
                  />
                </div>
              )}
            </Fragment>
          }
          className={baseClass}
          confirmingLabel={t('general:restoring')}
          heading={t('general:confirmRestoration')}
          modalSlug={modalSlug}
          onConfirm={handleRestore}
        />
      </Fragment>
    )
  }

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/RestoreMany/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .restore-many {
    @include blur-bg;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    &__toggle {
      @extend %btn-reset;
    }

    &__checkbox {
      padding: calc(var(--base) * 0.5) 0;

      .checkbox-input {
        label {
          padding-bottom: 0;
        }
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/RestoreMany/index.tsx
Signals: React, Next.js

```typescript
'use client'
import type { ClientCollectionConfig, ViewTypes, Where } from 'payload'

import { useModal } from '@faceless-ui/modal'
import { getTranslation } from '@payloadcms/translations'
import { useRouter, useSearchParams } from 'next/navigation.js'
import { mergeListSearchAndWhere } from 'payload/shared'
import * as qs from 'qs-esm'
import React from 'react'
import { toast } from 'sonner'

import { CheckboxInput } from '../../fields/Checkbox/Input.js'
import { useAuth } from '../../providers/Auth/index.js'
import { useConfig } from '../../providers/Config/index.js'
import { useLocale } from '../../providers/Locale/index.js'
import { useRouteCache } from '../../providers/RouteCache/index.js'
import { SelectAllStatus, useSelection } from '../../providers/Selection/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { requests } from '../../utilities/api.js'
import { parseSearchParams } from '../../utilities/parseSearchParams.js'
import { ConfirmationModal } from '../ConfirmationModal/index.js'
import { ListSelectionButton } from '../ListSelection/index.js'
import './index.scss'

const confirmManyRestoreDrawerSlug = `confirm-restore-many-docs`

const baseClass = 'restore-many'

export type Props = {
  collection: ClientCollectionConfig
  viewType?: ViewTypes
}

export const RestoreMany: React.FC<Props> = (props) => {
  const { collection: { slug } = {}, viewType } = props

  const { permissions } = useAuth()
  const {
    config: { collections, routes, serverURL },
  } = useConfig()
  const { code: locale } = useLocale()
  const router = useRouter()
  const { clearRouteCache } = useRouteCache()
  const searchParams = useSearchParams()
  const { count, getSelectedIds, selectAll, toggleAll } = useSelection()
  const { openModal } = useModal()

  const { i18n, t } = useTranslation()

  const [restoreAsPublished, setRestoreAsPublished] = React.useState(false)

  const collectionPermissions = permissions?.collections?.[slug]
  const hasUpdatePermission = collectionPermissions?.update

  if (selectAll === SelectAllStatus.None || !hasUpdatePermission || viewType !== 'trash') {
    return null
  }

  const selectingAll = selectAll === SelectAllStatus.AllAvailable
  const selectedIDs = !selectingAll ? getSelectedIds() : []

  const baseWhere = parseSearchParams(searchParams)?.where as Where

  const finalWhere = {
    and: [
      ...(Array.isArray(baseWhere?.and) ? baseWhere.and : baseWhere ? [baseWhere] : []),
      { deletedAt: { exists: true } },
    ],
  }

  const handleRestore = async () => {
    const collectionConfig = collections.find((c) => c.slug === slug)
    if (!collectionConfig) {
      return
    }

    let whereConstraint: Where

    if (selectingAll) {
      whereConstraint = finalWhere
    } else {
      whereConstraint = {
        and: [{ id: { in: selectedIDs } }, { deletedAt: { exists: true } }],
      }
    }

    const url = `${serverURL}${routes.api}/${slug}${qs.stringify(
      {
        limit: 0,
        locale,
        select: {},
        trash: true, // Ensure trashed docs are returned
        where: mergeListSearchAndWhere({
          collectionConfig,
          search: parseSearchParams(searchParams)?.search as string,
          where: whereConstraint,
        }),
      },
      { addQueryPrefix: true },
    )}`

    const body: Record<string, unknown> = {
      deletedAt: null,
    }

    // Only include _status if drafts are enabled
    if (collectionConfig?.versions?.drafts) {
      body._status = restoreAsPublished ? 'published' : 'draft'
    }

    const restoreManyResponse = await requests.patch(url, {
      body: JSON.stringify(body),
      headers: {
        'Accept-Language': i18n.language,
        'Content-Type': 'application/json',
      },
    })

    try {
      const { plural, singular } = collectionConfig.labels
      const json = await restoreManyResponse.json()

      const restoredDocs = json?.docs?.length || 0
      const successLabel = restoredDocs > 1 ? plural : singular

      if (restoreManyResponse.status < 400 || restoredDocs > 0) {
        toast.success(
          t('general:restoredCountSuccessfully', {
            count: restoredDocs,
            label: getTranslation(successLabel, i18n),
          }),
        )
      }

      if (json?.errors?.length > 0) {
        toast.error(json.message, {
          description: json.errors.map((e) => e.message).join('\n'),
        })
      }
    } catch (err) {
      toast.error(t('error:unknown'))
    }

    toggleAll()

    router.replace(
      qs.stringify(
        {
          ...parseSearchParams(searchParams),
          page: selectingAll ? '1' : undefined,
        },
        { addQueryPrefix: true },
      ),
    )

    clearRouteCache()
  }

  const collectionConfig = collections.find(({ slug: s }) => s === slug)

  const labelString = getTranslation(
    count === 1 ? collectionConfig.labels.singular : collectionConfig.labels.plural,
    i18n,
  )

  return (
    <React.Fragment>
      <ListSelectionButton
        aria-label={t('general:restore')}
        className="restore-documents__toggle"
        onClick={() => {
          openModal(confirmManyRestoreDrawerSlug)
        }}
      >
        {t('general:restore')}
      </ListSelectionButton>
      <ConfirmationModal
        body={
          <React.Fragment>
            {t(
              collectionConfig?.versions?.drafts
                ? 'general:aboutToRestoreAsDraftCount'
                : 'general:aboutToRestoreCount',
              {
                count,
                label: labelString,
              },
            )}
            {collectionConfig?.versions?.drafts && (
              <div className={`${baseClass}__checkbox`}>
                <CheckboxInput
                  checked={restoreAsPublished}
                  id="restore-as-published-many"
                  label={t('general:restoreAsPublished')}
                  name="restore-as-published-many"
                  onToggle={(e) => setRestoreAsPublished(e.target.checked)}
                />
              </div>
            )}
          </React.Fragment>
        }
        className={baseClass}
        confirmingLabel={t('general:restoring')}
        heading={t('general:confirmRestoration')}
        modalSlug={confirmManyRestoreDrawerSlug}
        onConfirm={handleRestore}
      />
    </React.Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/SaveButton/index.tsx
Signals: React

```typescript
'use client'

import type { SaveButtonClientProps } from 'payload'

import React, { useRef } from 'react'

import { useForm, useFormModified } from '../../forms/Form/context.js'
import { FormSubmit } from '../../forms/Submit/index.js'
import { useHotkey } from '../../hooks/useHotkey.js'
import { useDocumentInfo } from '../../providers/DocumentInfo/index.js'
import { useEditDepth } from '../../providers/EditDepth/index.js'
import { useOperation } from '../../providers/Operation/index.js'
import { useTranslation } from '../../providers/Translation/index.js'

export function SaveButton({ label: labelProp }: SaveButtonClientProps) {
  const { uploadStatus } = useDocumentInfo()
  const { t } = useTranslation()
  const { submit } = useForm()
  const modified = useFormModified()
  const label = labelProp || t('general:save')
  const ref = useRef<HTMLButtonElement>(null)
  const editDepth = useEditDepth()
  const operation = useOperation()

  const disabled = (operation === 'update' && !modified) || uploadStatus === 'uploading'

  useHotkey({ cmdCtrlKey: true, editDepth, keyCodes: ['s'] }, (e) => {
    if (disabled) {
      // absorb the event
    }

    e.preventDefault()
    e.stopPropagation()
    if (ref?.current) {
      ref.current.click()
    }
  })

  const handleSubmit = () => {
    if (uploadStatus === 'uploading') {
      return
    }

    return void submit()
  }

  return (
    <FormSubmit
      buttonId="action-save"
      disabled={disabled}
      onClick={handleSubmit}
      ref={ref}
      size="medium"
      type="button"
    >
      {label}
    </FormSubmit>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/SaveDraftButton/index.tsx
Signals: React

```typescript
'use client'

import type { SaveDraftButtonClientProps } from 'payload'

import React, { useCallback, useRef } from 'react'

import { useForm, useFormModified } from '../../forms/Form/context.js'
import { FormSubmit } from '../../forms/Submit/index.js'
import { useHotkey } from '../../hooks/useHotkey.js'
import { useConfig } from '../../providers/Config/index.js'
import { useDocumentInfo } from '../../providers/DocumentInfo/index.js'
import { useEditDepth } from '../../providers/EditDepth/index.js'
import { useLocale } from '../../providers/Locale/index.js'
import { useOperation } from '../../providers/Operation/index.js'
import { useTranslation } from '../../providers/Translation/index.js'

const baseClass = 'save-draft'

export function SaveDraftButton(props: SaveDraftButtonClientProps) {
  const {
    config: {
      routes: { api },
      serverURL,
    },
  } = useConfig()

  const { id, collectionSlug, globalSlug, setUnpublishedVersionCount, uploadStatus } =
    useDocumentInfo()

  const modified = useFormModified()
  const { code: locale } = useLocale()
  const ref = useRef<HTMLButtonElement>(null)
  const editDepth = useEditDepth()
  const { t } = useTranslation()
  const { submit } = useForm()
  const operation = useOperation()

  const disabled = (operation === 'update' && !modified) || uploadStatus === 'uploading'

  const saveDraft = useCallback(async () => {
    if (disabled) {
      return
    }

    const search = `?locale=${locale}&depth=0&fallback-locale=null&draft=true`
    let action
    let method = 'POST'

    if (collectionSlug) {
      action = `${serverURL}${api}/${collectionSlug}${id ? `/${id}` : ''}${search}`
      if (id) {
        method = 'PATCH'
      }
    }

    if (globalSlug) {
      action = `${serverURL}${api}/globals/${globalSlug}${search}`
    }

    await submit({
      action,
      method,
      overrides: {
        _status: 'draft',
      },
      skipValidation: true,
    })

    setUnpublishedVersionCount((count) => count + 1)
  }, [
    submit,
    collectionSlug,
    globalSlug,
    serverURL,
    api,
    locale,
    id,
    disabled,
    setUnpublishedVersionCount,
  ])

  useHotkey({ cmdCtrlKey: true, editDepth, keyCodes: ['s'] }, (e) => {
    if (disabled) {
      // absorb the event
    }

    e.preventDefault()
    e.stopPropagation()
    if (ref?.current) {
      ref.current.click()
    }
  })

  return (
    <FormSubmit
      buttonId="action-save-draft"
      buttonStyle="secondary"
      className={baseClass}
      disabled={disabled}
      onClick={() => {
        return void saveDraft()
      }}
      ref={ref}
      size="medium"
      type="button"
    >
      {t('version:saveDraft')}
    </FormSubmit>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/SearchBar/index.scss

```text
@import '../../scss/styles';

@layer payload-default {
  .search-bar {
    --icon-width: 40px;
    --search-bg: var(--theme-elevation-50);

    display: grid;
    grid-template-columns: auto 1fr;
    width: 100%;
    background-color: var(--search-bg);
    border-radius: var(--style-radius-m);
    position: relative;
    min-height: 46px;
    isolation: isolate;

    &:has(.search-bar__actions) {
      grid-template-columns: auto 1fr auto;
    }

    &:has(.popup--active) {
      z-index: 1;
    }

    .icon--search {
      grid-column: 1/2;
      grid-row: 1/2;
      z-index: 1;
      align-self: center;
      justify-self: center;
      pointer-events: none;
      width: 40px;
    }

    .search-filter {
      grid-column: 1/3;
      grid-row: 1/2;
      background-color: transparent;
      border-radius: inherit;
      input {
        height: 100%;
        padding-bottom: calc(var(--base) * 0.5);
        padding-top: calc(var(--base) * 0.5);
        padding-inline-start: var(--icon-width);
        padding-inline-end: var(--base);
        background-color: transparent;
      }
    }

    &__actions {
      display: flex;
      align-items: center;
      gap: calc(var(--base) / 4);
      padding: calc(var(--base) * 0.5);
      grid-column: 3/4;
    }

    @include small-break {
      min-height: 40px;
      background-color: transparent;

      &:has(.search-bar__actions) {
        row-gap: calc(var(--base) / 2);
        grid-template-columns: auto 1fr;
        grid-template-rows: auto auto;
      }

      .search-filter {
        background-color: var(--search-bg);
      }

      &__actions {
        grid-row: 2/3;
        grid-column: 1/3;
        display: flex;
        align-items: center;
        gap: calc(var(--base) / 4);
        padding: 0;
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/SearchBar/index.tsx

```typescript
import { SearchIcon } from '../../icons/Search/index.js'
import { SearchFilter } from '../SearchFilter/index.js'
import './index.scss'

const baseClass = 'search-bar'

type SearchBarProps = {
  Actions?: React.ReactNode[]
  className?: string
  label?: string
  onSearchChange: (search: string) => void
  searchQueryParam?: string
}
export function SearchBar({
  Actions,
  className,
  label = 'Search...',
  onSearchChange,
  searchQueryParam,
}: SearchBarProps) {
  return (
    <div className={[baseClass, className].filter(Boolean).join(' ')}>
      <SearchIcon />
      <SearchFilter
        handleChange={onSearchChange}
        label={label}
        searchQueryParam={searchQueryParam}
      />
      {Actions && Actions.length > 0 ? (
        <div className={`${baseClass}__actions`}>{Actions}</div>
      ) : null}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/SearchFilter/index.scss

```text
@import '../../scss/styles';

@layer payload-default {
  [dir='rtl'] .search-filter {
    svg {
      right: base(0.5);
      left: 0;
    }
    &__input {
      padding-right: base(2);
      padding-left: 0;
    }
  }
  .search-filter {
    position: relative;

    svg {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: base(0.5);
    }

    &__input {
      @include formInput;
      height: auto;
      padding: 0;
      box-shadow: none;
      background-color: var(--theme-elevation-50);
      border: none;

      &:not(:disabled) {
        &:hover,
        &:focus {
          box-shadow: none;
        }
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/SearchFilter/index.tsx
Signals: React

```typescript
'use client'

import React, { useEffect, useRef, useState } from 'react'

import type { SearchFilterProps } from './types.js'

import { useDebounce } from '../../hooks/useDebounce.js'
import './index.scss'

const baseClass = 'search-filter'

export function SearchFilter(props: SearchFilterProps) {
  const { handleChange, initialParams, label, searchQueryParam } = props
  const searchParam = initialParams?.search || searchQueryParam
  const [search, setSearch] = useState(typeof searchParam === 'string' ? searchParam : undefined)

  /**
   * Tracks whether the state should be updated based on the search value.
   * If the value is updated from the URL, we don't want to update the state as it causes additional renders.
   */
  const shouldUpdateState = useRef(true)

  /**
   * Tracks the previous search value to compare with the current debounced search value.
   */
  const previousSearch = useRef(typeof searchParam === 'string' ? searchParam : undefined)

  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    if (searchParam !== previousSearch.current) {
      shouldUpdateState.current = false
      setSearch(searchParam as string)
      previousSearch.current = searchParam as string
    }

    return () => {
      shouldUpdateState.current = true
      previousSearch.current = undefined
    }
  }, [searchParam])

  useEffect(() => {
    if (debouncedSearch !== previousSearch.current && shouldUpdateState.current) {
      if (handleChange) {
        handleChange(debouncedSearch)
      }

      previousSearch.current = debouncedSearch
    }
  }, [debouncedSearch, handleChange])

  return (
    <div className={baseClass}>
      <input
        aria-label={label}
        className={`${baseClass}__input`}
        id="search-filter-input"
        onChange={(e) => {
          shouldUpdateState.current = true
          setSearch(e.target.value)
        }}
        placeholder={label}
        type="text"
        value={search || ''}
      />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/ui/src/elements/SearchFilter/types.ts

```typescript
import type { ParsedQs } from 'qs-esm'

export type SearchFilterProps = {
  /**
   * This prop is deprecated and will be removed in the next major version.
   *
   * @deprecated
   */
  fieldName?: string
  handleChange?: (search: string) => void
  /**
   * This prop is deprecated and will be removed in the next major version.
   *
   * Prefer passing in `searchString` instead.
   *
   * @deprecated
   */
  initialParams?: ParsedQs
  label: string
  searchQueryParam?: string
  /**
   * This prop is deprecated and will be removed in the next major version.
   *
   * @deprecated
   */
  setValue?: (arg: string) => void
  /**
   * This prop is deprecated and will be removed in the next major version.
   *
   * @deprecated
   */
  value?: string
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/SelectAll/index.scss

```text
@layer payload-default {
  .select-all {
    &__checkbox {
      display: block;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/SelectAll/index.tsx
Signals: React

```typescript
'use client'

import React from 'react'

import { CheckboxInput } from '../../fields/Checkbox/Input.js'
import { SelectAllStatus, useSelection } from '../../providers/Selection/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import './index.scss'

const baseClass = 'select-all'

export const SelectAll: React.FC = () => {
  const { selectAll, toggleAll } = useSelection()
  const { i18n } = useTranslation()

  return (
    <CheckboxInput
      aria-label={
        selectAll === SelectAllStatus.None
          ? i18n.t('general:selectAllRows')
          : i18n.t('general:deselectAllRows')
      }
      checked={
        selectAll === SelectAllStatus.AllInPage || selectAll === SelectAllStatus.AllAvailable
      }
      className={[baseClass, `${baseClass}__checkbox`].join(' ')}
      id="select-all"
      name="select-all"
      onToggle={() => toggleAll()}
      partialChecked={selectAll === SelectAllStatus.Some}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/SelectMany/index.tsx
Signals: React

```typescript
import React from 'react'

import { useSelection } from '../../providers/Selection/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { Pill } from '../Pill/index.js'

export const SelectMany: React.FC<{
  onClick?: (ids: ReturnType<typeof useSelection>['selected']) => void
}> = (props) => {
  const { onClick } = props

  const { count, selected } = useSelection()
  const { t } = useTranslation()

  if (!selected || !count) {
    return null
  }

  return (
    <Pill
      onClick={() => {
        if (typeof onClick === 'function') {
          onClick(selected)
        }
      }}
      pillStyle="white"
      size="small"
    >
      {t('general:select')} {count}
    </Pill>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/SelectRow/index.scss

```text
@layer payload-default {
  .select-row {
    &__checkbox {
      display: block;
      width: min-content;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/SelectRow/index.tsx
Signals: React

```typescript
'use client'
import type { ClientUser } from 'payload'

import React from 'react'

import { CheckboxInput } from '../../fields/Checkbox/Input.js'
import { useAuth } from '../../providers/Auth/index.js'
import { useSelection } from '../../providers/Selection/index.js'
import { Locked } from '../Locked/index.js'
import './index.scss'

const baseClass = 'select-row'

export const SelectRow: React.FC<{
  rowData: {
    _isLocked: boolean
    _userEditing: ClientUser
    id: string
  }
}> = ({ rowData }) => {
  const { user } = useAuth()
  const { selected, setSelection } = useSelection()
  const { _isLocked, _userEditing } = rowData || {}

  const documentIsLocked = _isLocked && _userEditing

  if (documentIsLocked && _userEditing.id !== user?.id) {
    return <Locked user={_userEditing} />
  }

  return (
    <CheckboxInput
      checked={Boolean(selected.get(rowData.id))}
      className={[baseClass, `${baseClass}__checkbox`].join(' ')}
      onToggle={() => setSelection(rowData.id)}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/ShimmerEffect/index.scss

```text
@layer payload-default {
  .shimmer-effect {
    position: relative;
    overflow: hidden;
    background-color: var(--theme-elevation-50);

    &__shine {
      position: absolute;
      scale: 1.5;
      width: 100%;
      height: 100%;
      transform: translateX(-100%);
      animation: shimmer 1.75s infinite;
      opacity: 0.75;
      background: linear-gradient(
        100deg,
        var(--theme-elevation-50) 0%,
        var(--theme-elevation-50) 15%,
        var(--theme-elevation-150) 50%,
        var(--theme-elevation-50) 85%,
        var(--theme-elevation-50) 100%
      );
    }
  }

  @keyframes shimmer {
    100% {
      transform: translate3d(100%, 0, 0);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/ShimmerEffect/index.tsx
Signals: React

```typescript
'use client'
import * as React from 'react'

import { useDelay } from '../../hooks/useDelay.js'
import './index.scss'

export type ShimmerEffectProps = {
  readonly animationDelay?: string
  readonly className?: string
  readonly disableInlineStyles?: boolean
  readonly height?: number | string
  readonly width?: number | string
}

export const ShimmerEffect: React.FC<ShimmerEffectProps> = ({
  animationDelay = '0ms',
  className,
  disableInlineStyles = false,
  height = '60px',
  width = '100%',
}) => {
  return (
    <div
      className={['shimmer-effect', className].filter(Boolean).join(' ')}
      style={{
        height: !disableInlineStyles && (typeof height === 'number' ? `${height}px` : height),
        width: !disableInlineStyles && (typeof width === 'number' ? `${width}px` : width),
      }}
    >
      <div
        className="shimmer-effect__shine"
        style={{
          animationDelay,
        }}
      />
    </div>
  )
}

export type StaggeredShimmersProps = {
  className?: string
  count: number
  height?: number | string
  renderDelay?: number
  shimmerDelay?: number | string
  shimmerItemClassName?: string
  width?: number | string
}

export const StaggeredShimmers: React.FC<StaggeredShimmersProps> = ({
  className,
  count,
  height,
  renderDelay = 500,
  shimmerDelay = 25,
  shimmerItemClassName,
  width,
}) => {
  const shimmerDelayToPass = typeof shimmerDelay === 'number' ? `${shimmerDelay}ms` : shimmerDelay
  const [hasDelayed] = useDelay(renderDelay, true)

  if (!hasDelayed) {
    return null
  }

  return (
    <div className={className}>
      {[...Array(count)].map((_, i) => (
        <div className={shimmerItemClassName} key={i}>
          <ShimmerEffect
            animationDelay={`calc(${i} * ${shimmerDelayToPass})`}
            height={height}
            width={width}
          />
        </div>
      ))}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/SortColumn/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .sort-column {
    display: flex;
    gap: calc(var(--base) / 2);
    align-items: center;

    &__label {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &__label,
    .btn {
      vertical-align: middle;
      display: inline-block;
    }

    &__label {
      cursor: default;
    }

    &__buttons {
      display: flex;
      align-items: center;
      gap: 0;
    }

    &__button {
      margin: 0;
      opacity: 0.3;
      padding: calc(var(--base) / 4) 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      cursor: pointer;

      &.sort-column--active {
        opacity: 1;
        visibility: visible;
      }

      &:hover {
        opacity: 0.7;
      }
    }

    &:hover {
      .btn {
        opacity: 0.4;
        visibility: visible;
      }
    }

    &--appearance-condensed {
      gap: calc(var(--base) / 4);

      .sort-column__buttons {
        gap: 0;
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/SortColumn/index.tsx
Signals: React

```typescript
'use client'
import type { StaticLabel } from 'payload'

import React from 'react'

import { FieldLabel } from '../../fields/FieldLabel/index.js'
import { ChevronIcon } from '../../icons/Chevron/index.js'
import { useListQuery } from '../../providers/ListQuery/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import './index.scss'

export type SortColumnProps = {
  readonly appearance?: 'condensed' | 'default'
  readonly disable?: boolean
  readonly Label: React.ReactNode
  readonly label?: StaticLabel
  readonly name: string
}

const baseClass = 'sort-column'

export const SortColumn: React.FC<SortColumnProps> = (props) => {
  const { name, appearance, disable = false, Label, label } = props
  const { handleSortChange, query } = useListQuery()
  const { t } = useTranslation()

  const { sort } = query

  const desc = `-${name}`
  const asc = name

  const ascClasses = [`${baseClass}__asc`]
  if (sort === asc) {
    ascClasses.push(`${baseClass}--active`)
  }

  const descClasses = [`${baseClass}__desc`]
  if (sort === desc) {
    descClasses.push(`${baseClass}--active`)
  }

  return (
    <div
      className={[baseClass, appearance && `${baseClass}--appearance-${appearance}`]
        .filter(Boolean)
        .join(' ')}
    >
      <span className={`${baseClass}__label`}>
        {Label ?? <FieldLabel hideLocale label={label} unstyled />}
      </span>
      {!disable && (
        <div className={`${baseClass}__buttons`}>
          <button
            aria-label={t('general:sortByLabelDirection', {
              direction: t('general:ascending'),
              label,
            })}
            className={[...ascClasses, `${baseClass}__button`].filter(Boolean).join(' ')}
            onClick={() => void handleSortChange(asc)}
            type="button"
          >
            <ChevronIcon direction="up" />
          </button>
          <button
            aria-label={t('general:sortByLabelDirection', {
              direction: t('general:descending'),
              label,
            })}
            className={[...descClasses, `${baseClass}__button`].filter(Boolean).join(' ')}
            onClick={() => void handleSortChange(desc)}
            type="button"
          >
            <ChevronIcon />
          </button>
        </div>
      )}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/SortComplex/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .sort-complex {
    background: var(--theme-elevation-100);
    padding: base(0.5);
    display: flex;

    &__wrap {
      width: 100%;
      display: flex;
      align-items: center;
    }

    &__select {
      width: 50%;
      margin-bottom: base(0.5);
      padding: 0 base(0.5);
      flex-grow: 1;
    }

    &__label {
      color: var(--theme-elevation-400);
      margin: base(0.5) 0;
    }

    @include mid-break {
      &__wrap {
        display: block;
      }

      &__select {
        margin: 0 0 base(0.5);
        width: 100%;
      }
    }
  }
}
```

--------------------------------------------------------------------------------

````
