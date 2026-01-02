---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 382
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 382 of 695)

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
Location: payload-main/packages/ui/src/elements/SortComplex/index.tsx
Signals: React, Next.js

```typescript
'use client'
import type { OptionObject, SanitizedCollectionConfig } from 'payload'

import { getTranslation } from '@payloadcms/translations'
// TODO: abstract the `next/navigation` dependency out from this component
import { usePathname, useRouter, useSearchParams } from 'next/navigation.js'
import { sortableFieldTypes } from 'payload'
import { fieldAffectsData } from 'payload/shared'
import * as qs from 'qs-esm'
import React, { useEffect, useState } from 'react'

export type SortComplexProps = {
  collection: SanitizedCollectionConfig
  handleChange?: (sort: string) => void
  modifySearchQuery?: boolean
  sort?: string
}

import type { Option } from '../ReactSelect/index.js'

import { useTranslation } from '../../providers/Translation/index.js'
import { ReactSelect } from '../ReactSelect/index.js'
import './index.scss'

const baseClass = 'sort-complex'

export const SortComplex: React.FC<SortComplexProps> = (props) => {
  const { collection, handleChange, modifySearchQuery = true } = props

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { i18n, t } = useTranslation()
  const [sortOptions, setSortOptions] = useState<OptionObject[]>()

  const [sortFields] = useState(() =>
    collection.fields.reduce((fields, field) => {
      if (fieldAffectsData(field) && sortableFieldTypes.indexOf(field.type) > -1) {
        return [
          ...fields,
          { label: getTranslation(field.label || field.name, i18n), value: field.name },
        ]
      }
      return fields
    }, []),
  )

  const [sortField, setSortField] = useState(sortFields[0])
  const [initialSort] = useState<Option>(() => ({ label: t('general:descending'), value: '-' }))
  const [sortOrder, setSortOrder] = useState(initialSort)

  useEffect(() => {
    if (sortField?.value) {
      const newSortValue = `${sortOrder.value}${sortField.value}`

      if (handleChange) {
        handleChange(newSortValue)
      }

      if (searchParams.get('sort') !== newSortValue && modifySearchQuery) {
        const search = qs.stringify(
          {
            ...searchParams,
            sort: newSortValue,
          },
          { addQueryPrefix: true },
        )

        router.replace(`${pathname}${search}`)
      }
    }
  }, [pathname, router, searchParams, sortField, sortOrder, modifySearchQuery, handleChange])

  useEffect(() => {
    setSortOptions([
      { label: t('general:ascending'), value: '' },
      { label: t('general:descending'), value: '-' },
    ])
  }, [i18n, t])

  return (
    <div className={baseClass}>
      <React.Fragment>
        <div className={`${baseClass}__wrap`}>
          <div className={`${baseClass}__select`}>
            <div className={`${baseClass}__label`}>{t('general:columnToSort')}</div>
            <ReactSelect onChange={setSortField} options={sortFields} value={sortField} />
          </div>
          <div className={`${baseClass}__select`}>
            <div className={`${baseClass}__label`}>{t('general:order')}</div>
            <ReactSelect
              onChange={(incomingSort: Option) => {
                setSortOrder(incomingSort || initialSort)
              }}
              options={sortOptions}
              value={sortOrder}
            />
          </div>
        </div>
      </React.Fragment>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/SortHeader/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .sort-header {
    display: flex;
    gap: calc(var(--base) / 2);
    align-items: center;

    &__buttons {
      display: flex;
      align-items: center;
      gap: calc(var(--base) / 4);
    }

    &__button {
      margin: 0;
      padding: 0 !important;
      opacity: 0.3;
      padding: calc(var(--base) / 4);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      cursor: pointer;

      &.sort-header--active {
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

      .sort-header__buttons {
        gap: 0;
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/SortHeader/index.tsx
Signals: React

```typescript
'use client'

import React from 'react'

import { SortDownIcon } from '../../icons/Sort/index.js'
import { useListQuery } from '../../providers/ListQuery/index.js'
import './index.scss'
import { useTranslation } from '../../providers/Translation/index.js'

export type SortHeaderProps = {
  readonly appearance?: 'condensed' | 'default'
  readonly disable?: boolean
}

const baseClass = 'sort-header'

function useSort() {
  const { handleSortChange, orderableFieldName, query } = useListQuery()
  const querySort = Array.isArray(query.sort) ? query.sort[0] : query.sort
  const isActive = querySort === orderableFieldName

  const handleSortPress = () => {
    // If it's already sorted by the "_order" field, do nothing
    if (isActive) {
      return
    }
    // If NOT sorted by the "_order" field, sort by that field.
    void handleSortChange(orderableFieldName)
  }

  return { handleSortPress, isActive }
}

export const SortHeader: React.FC<SortHeaderProps> = (props) => {
  const { appearance } = props
  const { handleSortPress, isActive } = useSort()
  const { t } = useTranslation()

  return (
    <div
      className={[baseClass, appearance && `${baseClass}--appearance-${appearance}`]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={`${baseClass}__buttons`}>
        <button
          aria-label={t('general:sortByLabelDirection', {
            direction: t('general:ascending'),
            label: 'Order',
          })}
          className={`${baseClass}__button ${isActive ? `${baseClass}--active` : ''}`}
          onClick={handleSortPress}
          type="button"
        >
          <SortDownIcon />
        </button>
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/SortRow/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .sort-row {
    opacity: 0.3;
    cursor: not-allowed;

    &.active {
      cursor: grab;
      opacity: 1;
    }

    &__icon {
      height: 22px;
      width: 22px;
      margin-left: -2px;
      margin-top: -2px;
      display: block;
      width: min-content;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/SortRow/index.tsx
Signals: React

```typescript
'use client'

import React from 'react'

import { DragHandleIcon } from '../../icons/DragHandle/index.js'
import './index.scss'
import { useListQuery } from '../../providers/ListQuery/index.js'

const baseClass = 'sort-row'

export const SortRow = () => {
  const { orderableFieldName, query } = useListQuery()
  const isActive = query.sort === orderableFieldName || query.sort === `-${orderableFieldName}`

  return (
    <div className={`${baseClass} ${isActive ? 'active' : ''}`} role="button" tabIndex={0}>
      <DragHandleIcon className={`${baseClass}__icon`} />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/Status/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .status {
    &__label {
      color: var(--theme-elevation-500);
    }

    &__value {
      font-weight: 600;
    }

    &__value-wrap {
      white-space: nowrap;
    }

    &__action {
      text-decoration: underline;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/Status/index.tsx
Signals: React

```typescript
'use client'
import { useModal } from '@faceless-ui/modal'
import React, { useCallback } from 'react'
import { toast } from 'sonner'

import { useForm } from '../../forms/Form/context.js'
import { useConfig } from '../../providers/Config/index.js'
import { useDocumentInfo } from '../../providers/DocumentInfo/index.js'
import { useLocale } from '../../providers/Locale/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { requests } from '../../utilities/api.js'
import { Button } from '../Button/index.js'
import { ConfirmationModal } from '../ConfirmationModal/index.js'
import './index.scss'

const baseClass = 'status'

export const Status: React.FC = () => {
  const {
    id,
    collectionSlug,
    docPermissions,
    globalSlug,
    hasPublishedDoc,
    incrementVersionCount,
    isTrashed,
    setHasPublishedDoc,
    setMostRecentVersionIsAutosaved,
    setUnpublishedVersionCount,
    unpublishedVersionCount,
  } = useDocumentInfo()

  const { toggleModal } = useModal()

  const {
    config: {
      routes: { api },
      serverURL,
    },
  } = useConfig()

  const { reset: resetForm } = useForm()
  const { code: locale } = useLocale()
  const { i18n, t } = useTranslation()

  const unPublishModalSlug = `confirm-un-publish-${id}`
  const revertModalSlug = `confirm-revert-${id}`

  let statusToRender: 'changed' | 'draft' | 'published'

  if (unpublishedVersionCount > 0 && hasPublishedDoc) {
    statusToRender = 'changed'
  } else if (!hasPublishedDoc) {
    statusToRender = 'draft'
  } else if (hasPublishedDoc && unpublishedVersionCount <= 0) {
    statusToRender = 'published'
  }

  const displayStatusKey = isTrashed
    ? hasPublishedDoc
      ? 'previouslyPublished'
      : 'previouslyDraft'
    : statusToRender

  const performAction = useCallback(
    async (action: 'revert' | 'unpublish') => {
      let url
      let method
      let body

      if (action === 'unpublish') {
        body = {
          _status: 'draft',
        }
      }

      if (collectionSlug) {
        url = `${serverURL}${api}/${collectionSlug}/${id}?locale=${locale}&fallback-locale=null&depth=0`
        method = 'patch'
      }

      if (globalSlug) {
        url = `${serverURL}${api}/globals/${globalSlug}?locale=${locale}&fallback-locale=null&depth=0`
        method = 'post'
      }

      if (action === 'revert') {
        const publishedDoc = await requests
          .get(url, {
            headers: {
              'Accept-Language': i18n.language,
              'Content-Type': 'application/json',
            },
          })
          .then((res) => res.json())

        body = publishedDoc
      }

      const res = await requests[method](url, {
        body: JSON.stringify(body),
        headers: {
          'Accept-Language': i18n.language,
          'Content-Type': 'application/json',
        },
      })

      if (res.status === 200) {
        let data
        const json = await res.json()

        if (globalSlug) {
          data = json.result
        } else if (collectionSlug) {
          data = json.doc
        }

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        resetForm(data)
        toast.success(json.message)
        incrementVersionCount()
        setMostRecentVersionIsAutosaved(false)

        if (action === 'unpublish') {
          setHasPublishedDoc(false)
        } else if (action === 'revert') {
          setUnpublishedVersionCount(0)
        }
      } else {
        try {
          const json = await res.json()
          if (json.errors?.[0]?.message) {
            toast.error(json.errors[0].message)
          } else if (json.error) {
            toast.error(json.error)
          } else {
            toast.error(t('error:unPublishingDocument'))
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
          toast.error(t('error:unPublishingDocument'))
        }
      }
    },
    [
      api,
      collectionSlug,
      globalSlug,
      id,
      i18n.language,
      incrementVersionCount,
      locale,
      resetForm,
      serverURL,
      setUnpublishedVersionCount,
      setMostRecentVersionIsAutosaved,
      t,
      setHasPublishedDoc,
    ],
  )

  const canUpdate = docPermissions?.update

  if (statusToRender) {
    return (
      <div
        className={baseClass}
        title={`${t('version:status')}: ${t(`version:${displayStatusKey}`)}`}
      >
        <div className={`${baseClass}__value-wrap`}>
          <span className={`${baseClass}__label`}>{t('version:status')}:&nbsp;</span>
          <span className={`${baseClass}__value`}>{t(`version:${displayStatusKey}`)}</span>
          {!isTrashed && canUpdate && statusToRender === 'published' && (
            <React.Fragment>
              &nbsp;&mdash;&nbsp;
              <Button
                buttonStyle="none"
                className={`${baseClass}__action`}
                id={`action-unpublish`}
                onClick={() => toggleModal(unPublishModalSlug)}
              >
                {t('version:unpublish')}
              </Button>
              <ConfirmationModal
                body={t('version:aboutToUnpublish')}
                confirmingLabel={t('version:unpublishing')}
                heading={t('version:confirmUnpublish')}
                modalSlug={unPublishModalSlug}
                onConfirm={() => performAction('unpublish')}
              />
            </React.Fragment>
          )}
          {!isTrashed &&
            canUpdate &&
            hasPublishedDoc &&
            statusToRender === 'changed' && (
              <React.Fragment>
                &nbsp;&mdash;&nbsp;
                <Button
                  buttonStyle="none"
                  className={`${baseClass}__action`}
                  id="action-revert-to-published"
                  onClick={() => toggleModal(revertModalSlug)}
                >
                  {t('version:revertToPublished')}
                </Button>
                <ConfirmationModal
                  body={t('version:aboutToRevertToPublished')}
                  confirmingLabel={t('version:reverting')}
                  heading={t('version:confirmRevertToSaved')}
                  modalSlug={revertModalSlug}
                  onConfirm={() => performAction('revert')}
                />
              </React.Fragment>
            )}
        </div>
      </div>
    )
  }

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/StayLoggedIn/index.tsx
Signals: React, Next.js

```typescript
'use client'
import { useRouter } from 'next/navigation.js'
import { formatAdminURL } from 'payload/shared'
import React, { useCallback } from 'react'

import type { OnCancel } from '../ConfirmationModal/index.js'

import { useAuth } from '../../providers/Auth/index.js'
import { useConfig } from '../../providers/Config/index.js'
import { useRouteTransition } from '../../providers/RouteTransition/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { ConfirmationModal } from '../ConfirmationModal/index.js'

export const stayLoggedInModalSlug = 'stay-logged-in'

export const StayLoggedInModal: React.FC = () => {
  const { refreshCookie } = useAuth()

  const router = useRouter()
  const { config } = useConfig()

  const {
    admin: {
      routes: { logout: logoutRoute },
    },
    routes: { admin: adminRoute },
    serverURL,
  } = config

  const { t } = useTranslation()
  const { startRouteTransition } = useRouteTransition()

  const onConfirm = useCallback(() => {
    return startRouteTransition(() =>
      router.push(
        formatAdminURL({
          adminRoute,
          path: logoutRoute,
          serverURL,
        }),
      ),
    )
  }, [router, startRouteTransition, adminRoute, logoutRoute, serverURL])

  const onCancel: OnCancel = useCallback(() => {
    refreshCookie()
  }, [refreshCookie])

  return (
    <ConfirmationModal
      body={t('authentication:youAreInactive')}
      cancelLabel={t('authentication:stayLoggedIn')}
      confirmLabel={t('authentication:logOut')}
      heading={t('authentication:stayLoggedIn')}
      modalSlug={stayLoggedInModalSlug}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: context.tsx]---
Location: payload-main/packages/ui/src/elements/StepNav/context.tsx
Signals: React

```typescript
'use client'
import React, { createContext, use, useState } from 'react'

import type { ContextType } from './types.js'

export const useStepNav = (): ContextType => use(Context)

export const Context = createContext({} as ContextType)

export const StepNavProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [stepNav, setStepNav] = useState([])

  return (
    <Context
      value={{
        setStepNav,
        stepNav,
      }}
    >
      {children}
    </Context>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/StepNav/index.scss

```text
@import '../../scss/styles.scss';
@layer payload-default {
  .step-nav {
    display: flex;
    align-items: center;
    gap: calc(var(--base) / 2);

    &::after {
      content: ' ';
      position: sticky;
      top: 0;
      right: 0;
      width: var(--base);
      background: linear-gradient(to right, transparent, var(--theme-bg));
    }

    // Use a pseudo element for the accessability so that it doesn't take up DOM space
    // Also because the parent element has `overflow: hidden` which would clip an outline
    &__home {
      width: 18px;
      height: 18px;
      position: relative;

      &:focus-visible {
        outline: none;

        &::after {
          content: '';
          border: var(--accessibility-outline);
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          pointer-events: none;
        }
      }
    }

    * {
      display: block;
    }

    a {
      border: 0;
      display: flex;
      align-items: center;
      font-weight: 600;
      text-decoration: none;

      label {
        cursor: pointer;
      }

      &:hover,
      &:focus-visible {
        text-decoration: underline;
      }
    }

    span {
      max-width: base(8);
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    @include mid-break {
      .step-nav {
        &__home {
          width: 16px;
          height: 16px;
        }
      }
    }

    @include small-break {
      gap: base(0.4);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/StepNav/index.tsx
Signals: React

```typescript
'use client'

import { getTranslation } from '@payloadcms/translations'
import React, { Fragment } from 'react'

import type { StepNavItem } from './types.js'

import { PayloadIcon } from '../../graphics/Icon/index.js'
import { useConfig } from '../../providers/Config/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { Link } from '../Link/index.js'
import { RenderCustomComponent } from '../RenderCustomComponent/index.js'
import { StepNavProvider, useStepNav } from './context.js'
import './index.scss'

export { SetStepNav } from './SetStepNav.js'

const baseClass = 'step-nav'

const StepNav: React.FC<{
  readonly className?: string
  readonly CustomIcon?: React.ReactNode
  /**
   * @deprecated
   * This prop is deprecated and will be removed in the next major version.
   * Components now import their own `Link` directly from `next/link`.
   */
  readonly Link?: React.ComponentType
}> = ({ className, CustomIcon }) => {
  const { i18n } = useTranslation()

  const { stepNav } = useStepNav()

  const {
    config: {
      routes: { admin },
    },
  } = useConfig()

  const { t } = useTranslation()

  return (
    <Fragment>
      {stepNav.length > 0 ? (
        <nav className={[baseClass, className].filter(Boolean).join(' ')}>
          <Link className={`${baseClass}__home`} href={admin} prefetch={false} tabIndex={0}>
            <span title={t('general:dashboard')}>
              <RenderCustomComponent CustomComponent={CustomIcon} Fallback={<PayloadIcon />} />
            </span>
          </Link>
          <span>/</span>
          {stepNav.map((item, i) => {
            const StepLabel = getTranslation(item.label, i18n)
            const isLast = stepNav.length === i + 1

            const Step = isLast ? (
              <span className={`${baseClass}__last`} key={i}>
                {StepLabel}
              </span>
            ) : (
              <Fragment key={i}>
                {item.url ? (
                  <Link href={item.url} prefetch={false}>
                    <span key={i}>{StepLabel}</span>
                  </Link>
                ) : (
                  <span key={i}>{StepLabel}</span>
                )}
                <span>/</span>
              </Fragment>
            )

            return Step
          })}
        </nav>
      ) : (
        <div className={[baseClass, className].filter(Boolean).join(' ')}>
          <div className={`${baseClass}__home`}>
            <span title={t('general:dashboard')}>
              <RenderCustomComponent CustomComponent={CustomIcon} Fallback={<PayloadIcon />} />
            </span>
          </div>
        </div>
      )}
    </Fragment>
  )
}

export { StepNav, StepNavItem, StepNavProvider, useStepNav }
```

--------------------------------------------------------------------------------

---[FILE: SetStepNav.tsx]---
Location: payload-main/packages/ui/src/elements/StepNav/SetStepNav.tsx
Signals: React

```typescript
'use client'
import { useEffect } from 'react'

import type { StepNavItem } from './types.js'

import { useStepNav } from './context.js'

export const SetStepNav: React.FC<{
  nav: StepNavItem[]
}> = ({ nav }) => {
  const { setStepNav } = useStepNav()

  useEffect(() => {
    setStepNav(nav)
  }, [setStepNav, nav])

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/ui/src/elements/StepNav/types.ts
Signals: React

```typescript
import type { LabelFunction, StaticLabel } from 'payload'
import type React from 'react'

export type StepNavItem = {
  label: LabelFunction | React.JSX.Element | StaticLabel
  url?: string
}

export type ContextType = {
  setStepNav: (items: StepNavItem[]) => void
  stepNav: StepNavItem[]
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/StickyToolbar/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .sticky-toolbar {
    padding: base(0.5);
    position: sticky;
    bottom: var(--base);
    background-color: var(--theme-bg);
    border: 1px solid var(--theme-elevation-100);
    max-width: 500px;
    z-index: 1;
    margin-left: 50%;
    transform: translate3d(-50%, 0, 0);
    border-radius: var(--style-radius-m);
    box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.1);
    margin-top: base(2);

    @include small-break {
      width: calc(100% - var(--base) * 2);
      margin-left: var(--base);
      transform: none;
      position: relative;
      max-width: unset;
      margin-bottom: base(4);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/StickyToolbar/index.tsx
Signals: React

```typescript
import React from 'react'

import './index.scss'

const baseClass = 'sticky-toolbar'

/**
 * @internal
 */
export const StickyToolbar: React.FC<{
  children: React.ReactNode
}> = ({ children }) => <div className={baseClass}>{children}</div>
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/Table/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .table {
    margin-bottom: $baseline;
    overflow: auto;
    max-width: 100%;
    isolation: isolate;

    table {
      min-width: 100%;
    }

    thead {
      color: var(--theme-elevation-400);

      th {
        font-weight: normal;
        text-align: left;
        vertical-align: middle;
        [dir='rtl'] & {
          text-align: right;
        }
      }
    }

    th,
    td {
      vertical-align: top;
      padding: calc(var(--base) * 0.6);
      min-width: 150px;
      position: relative;
      z-index: 1;

      &:first-child {
        padding-inline-start: base(0.8);
      }

      &:last-child {
        padding-inline-end: base(0.8);
      }

      &.cell-_select,
      &.cell-_dragHandle {
        width: var(--base);
      }
    }

    tbody {
      tr {
        position: relative;
        &:nth-child(odd) {
          background: var(--theme-elevation-50);
          border-radius: var(--style-radius-s);
          td:first-child {
            border-top-left-radius: inherit;
            border-bottom-left-radius: inherit;
          }
          td:last-child {
            border-top-right-radius: inherit;
            border-bottom-right-radius: inherit;
          }
        }
      }
    }

    a:focus-visible {
      outline: var(--accessibility-outline);
      outline-offset: var(--accessibility-outline-offset);
    }

    &--appearance-condensed {
      border-radius: var(--style-radius-s);
      table {
        border-collapse: collapse;
      }
      thead {
        th:first-child {
          border-top-left-radius: var(--style-radius-s);
        }

        th:last-child {
          border-top-right-radius: var(--style-radius-s);
        }

        background: var(--theme-elevation-50);
      }

      tbody {
        tr {
          &:nth-child(odd) {
            &:after {
              display: none;
            }
          }

          &:last-child {
            td:first-child {
              border-bottom-left-radius: var(--style-radius-s);
            }

            td:last-child {
              border-bottom-right-radius: var(--style-radius-s);
            }
          }
        }
      }

      th,
      td {
        padding: base(0.3) base(0.3);

        &:first-child {
          padding-inline-start: base(0.6);
        }

        &:last-child {
          padding-inline-end: base(0.6);
        }
      }

      th {
        padding: base(0.3);
      }

      tr td,
      th {
        border: 0.5px solid var(--theme-elevation-100);
      }
    }

    &--drag-preview {
      cursor: grabbing;
      z-index: var(--z-popup);
    }

    @include mid-break {
      th,
      td {
        max-width: 70vw;
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/Table/index.tsx
Signals: React

```typescript
'use client'

import type { Column } from 'payload'

import React from 'react'

import './index.scss'

const baseClass = 'table'

export type Props = {
  readonly appearance?: 'condensed' | 'default'
  readonly BeforeTable?: React.ReactNode
  readonly columns?: Column[]
  readonly data: Record<string, unknown>[]
}

export const Table: React.FC<Props> = ({ appearance, BeforeTable, columns, data }) => {
  const activeColumns = columns?.filter((col) => col?.active)

  if (!activeColumns || activeColumns.length === 0) {
    return <div>No columns selected</div>
  }

  return (
    <div
      className={[baseClass, appearance && `${baseClass}--appearance-${appearance}`]
        .filter(Boolean)
        .join(' ')}
    >
      {BeforeTable}
      <table cellPadding="0" cellSpacing="0">
        <thead>
          <tr>
            {activeColumns.map((col, i) => (
              <th id={`heading-${col.accessor.replace(/\./g, '__')}`} key={i}>
                {col.Heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data &&
            data?.map((row, rowIndex) => {
              return (
                <tr
                  className={`row-${rowIndex + 1}`}
                  data-id={row.id}
                  key={
                    typeof row.id === 'string' || typeof row.id === 'number'
                      ? String(row.id)
                      : rowIndex
                  }
                >
                  {activeColumns.map((col, colIndex) => {
                    const { accessor } = col

                    return (
                      <td className={`cell-${accessor.replace(/\./g, '__')}`} key={colIndex}>
                        {col.renderedCells[rowIndex]}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
        </tbody>
      </table>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: OrderableRow.tsx]---
Location: payload-main/packages/ui/src/elements/Table/OrderableRow.tsx
Signals: React

```typescript
import type { DraggableSyntheticListeners } from '@dnd-kit/core'
import type { Column } from 'payload'
import type { HTMLAttributes, Ref } from 'react'

export type Props = {
  readonly cellMap: Record<string, number>
  readonly columns: Column[]
  readonly dragAttributes?: HTMLAttributes<unknown>
  readonly dragListeners?: DraggableSyntheticListeners
  readonly ref?: Ref<HTMLTableRowElement>
  readonly rowId: number | string
} & HTMLAttributes<HTMLTableRowElement>

export const OrderableRow = ({
  cellMap,
  columns,
  dragAttributes = {},
  dragListeners = {},
  rowId,
  ...rest
}: Props) => (
  <tr {...rest}>
    {columns.map((col, colIndex) => {
      const { accessor } = col

      // Use the cellMap to find which index in the renderedCells to use
      const cell = col.renderedCells[cellMap[rowId]]

      // For drag handles, wrap in div with drag attributes
      if (accessor === '_dragHandle') {
        return (
          <td className={`cell-${accessor}`} key={colIndex}>
            <div {...dragAttributes} {...dragListeners}>
              {cell}
            </div>
          </td>
        )
      }

      return (
        <td className={`cell-${accessor}`} key={colIndex}>
          {cell}
        </td>
      )
    })}
  </tr>
)
```

--------------------------------------------------------------------------------

---[FILE: OrderableRowDragPreview.tsx]---
Location: payload-main/packages/ui/src/elements/Table/OrderableRowDragPreview.tsx
Signals: React

```typescript
import type { ReactNode } from 'react'

export type Props = {
  readonly children: ReactNode
  readonly className?: string
  readonly rowId?: number | string
}

export const OrderableRowDragPreview = ({ children, className, rowId }: Props) =>
  typeof rowId === 'undefined' ? null : (
    <div className={className}>
      <table cellPadding={0} cellSpacing={0}>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
```

--------------------------------------------------------------------------------

---[FILE: OrderableTable.tsx]---
Location: payload-main/packages/ui/src/elements/Table/OrderableTable.tsx
Signals: React

```typescript
'use client'

import type { ClientCollectionConfig, Column, OrderableEndpointBody } from 'payload'

import './index.scss'

import { DragOverlay } from '@dnd-kit/core'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { useConfig } from '../../providers/Config/index.js'
import { useListQuery } from '../../providers/ListQuery/index.js'
import { DraggableSortableItem } from '../DraggableSortable/DraggableSortableItem/index.js'
import { DraggableSortable } from '../DraggableSortable/index.js'
import { OrderableRow } from './OrderableRow.js'
import { OrderableRowDragPreview } from './OrderableRowDragPreview.js'

const baseClass = 'table'

export type Props = {
  readonly appearance?: 'condensed' | 'default'
  readonly BeforeTable?: React.ReactNode
  readonly collection: ClientCollectionConfig
  readonly columns?: Column[]
  readonly data: Record<string, unknown>[]
  readonly heading?: React.ReactNode
}

export const OrderableTable: React.FC<Props> = ({
  appearance = 'default',
  BeforeTable,
  collection,
  columns,
  data: initialData,
}) => {
  const { config } = useConfig()
  const { data: listQueryData, orderableFieldName, query } = useListQuery()
  // Use the data from ListQueryProvider if available, otherwise use the props
  const serverData = listQueryData?.docs || initialData

  // Local state to track the current order of rows
  const [localData, setLocalData] = useState(serverData)

  // id -> index for each column
  const [cellMap, setCellMap] = useState<Record<string, number>>({})

  const [dragActiveRowId, setDragActiveRowId] = useState<number | string | undefined>()

  // Update local data when server data changes
  useEffect(() => {
    setLocalData(serverData)
    setCellMap(
      Object.fromEntries(serverData.map((item, index) => [String(item.id ?? item._id), index])),
    )
  }, [serverData])

  const activeColumns = columns?.filter((col) => col?.active)

  if (
    !activeColumns ||
    activeColumns.filter((col) => !['_dragHandle', '_select'].includes(col.accessor)).length === 0
  ) {
    return <div>No columns selected</div>
  }

  const handleDragEnd = async ({ moveFromIndex, moveToIndex }) => {
    if (query.sort !== orderableFieldName && query.sort !== `-${orderableFieldName}`) {
      toast.warning('To reorder the rows you must first sort them by the "Order" column')
      setDragActiveRowId(undefined)
      return
    }

    if (moveFromIndex === moveToIndex) {
      setDragActiveRowId(undefined)
      return
    }

    const movedId = localData[moveFromIndex].id ?? localData[moveFromIndex]._id
    const newBeforeRow =
      moveToIndex > moveFromIndex ? localData[moveToIndex] : localData[moveToIndex - 1]
    const newAfterRow =
      moveToIndex > moveFromIndex ? localData[moveToIndex + 1] : localData[moveToIndex]

    // Store the original data for rollback
    const previousData = [...localData]

    // Optimisitc update of local state to reorder the rows
    setLocalData((currentData) => {
      const newData = [...currentData]
      // Update the rendered cell for the moved row to show "pending"
      newData[moveFromIndex][orderableFieldName] = `pending`
      // Move the item in the array
      newData.splice(moveToIndex, 0, newData.splice(moveFromIndex, 1)[0])
      return newData
    })

    try {
      const target: OrderableEndpointBody['target'] = newBeforeRow
        ? {
            id: newBeforeRow.id ?? newBeforeRow._id,
            key: newBeforeRow[orderableFieldName],
          }
        : {
            id: newAfterRow.id ?? newAfterRow._id,
            key: newAfterRow[orderableFieldName],
          }

      const newKeyWillBe =
        (newBeforeRow && query.sort === orderableFieldName) ||
        (!newBeforeRow && query.sort === `-${orderableFieldName}`)
          ? 'greater'
          : 'less'

      const jsonBody: OrderableEndpointBody = {
        collectionSlug: collection.slug,
        docsToMove: [movedId],
        newKeyWillBe,
        orderableFieldName,
        target,
      }

      const response = await fetch(`${config.serverURL}${config.routes.api}/reorder`, {
        body: JSON.stringify(jsonBody),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (response.status === 403) {
        throw new Error('You do not have permission to reorder these rows')
      }

      if (!response.ok) {
        throw new Error(
          'Failed to reorder. This can happen if you reorder several rows too quickly. Please try again.',
        )
      }

      if (response.status === 200 && (await response.json())['message'] === 'initial migration') {
        throw new Error(
          'You have enabled "orderable" on a collection with existing documents' +
            'and this is the first time you have sorted documents. We have run an automatic migration ' +
            'to add an initial order to the documents. Please refresh the page and try again.',
        )
      }
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err)
      // Rollback to previous state if the request fails
      setLocalData(previousData)
      toast.error(error)
    } finally {
      setDragActiveRowId(undefined)
    }
  }

  const handleDragStart = ({ id }) => {
    setDragActiveRowId(id)
  }

  const rowIds = localData.map((row) => row.id ?? row._id)

  return (
    <div
      className={[baseClass, appearance && `${baseClass}--appearance-${appearance}`]
        .filter(Boolean)
        .join(' ')}
    >
      {BeforeTable}
      <DraggableSortable ids={rowIds} onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <table cellPadding="0" cellSpacing="0">
          <thead>
            <tr>
              {activeColumns.map((col, i) => (
                <th id={`heading-${col.accessor}`} key={i}>
                  {col.Heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {localData.map((row, rowIndex) => (
              <DraggableSortableItem id={rowIds[rowIndex]} key={rowIds[rowIndex]}>
                {({ attributes, isDragging, listeners, setNodeRef, transform, transition }) => (
                  <OrderableRow
                    cellMap={cellMap}
                    className={`row-${rowIndex + 1}`}
                    columns={activeColumns}
                    dragAttributes={attributes}
                    dragListeners={listeners}
                    ref={setNodeRef}
                    rowId={row.id ?? row._id}
                    style={{
                      opacity: isDragging ? 0 : 1,
                      transform,
                      transition,
                    }}
                  />
                )}
              </DraggableSortableItem>
            ))}
          </tbody>
        </table>

        <DragOverlay>
          <OrderableRowDragPreview
            className={[baseClass, `${baseClass}--drag-preview`].join(' ')}
            rowId={dragActiveRowId}
          >
            <OrderableRow cellMap={cellMap} columns={activeColumns} rowId={dragActiveRowId} />
          </OrderableRowDragPreview>
        </DragOverlay>
      </DraggableSortable>
    </div>
  )
}
```

--------------------------------------------------------------------------------

````
