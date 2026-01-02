---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 384
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 384 of 695)

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
Location: payload-main/packages/ui/src/elements/ThumbnailCard/index.tsx
Signals: React

```typescript
'use client'
import type { ClientCollectionConfig, TypeWithID } from 'payload'

import React from 'react'

import { useConfig } from '../../providers/Config/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { formatDocTitle } from '../../utilities/formatDocTitle/index.js'
import './index.scss'

export type ThumbnailCardProps = {
  alignLabel?: 'center' | 'left'
  className?: string
  collection?: ClientCollectionConfig
  doc?: { filename?: string } & TypeWithID
  label?: string
  onClick?: () => void
  onKeyDown?: () => void
  thumbnail: React.ReactNode
}

const baseClass = 'thumbnail-card'

export const ThumbnailCard: React.FC<ThumbnailCardProps> = (props) => {
  const {
    alignLabel,
    className,
    collection,
    doc,
    label: labelFromProps,
    onClick,
    thumbnail,
  } = props

  const { config } = useConfig()

  const { i18n } = useTranslation()

  const classes = [
    baseClass,
    className,
    typeof onClick === 'function' && `${baseClass}--has-on-click`,
    alignLabel && `${baseClass}--align-label-${alignLabel}`,
  ]
    .filter(Boolean)
    .join(' ')

  let title = labelFromProps

  if (!title) {
    title = formatDocTitle({
      collectionConfig: collection,
      data: doc,
      dateFormat: config.admin.dateFormat,
      fallback: doc?.filename,
      i18n,
    })
  }

  return (
    <button className={classes} onClick={onClick} title={title} type="button">
      <div className={`${baseClass}__thumbnail`}>{thumbnail}</div>
      <div className={`${baseClass}__label`}>{title}</div>
    </button>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/TimezonePicker/index.scss

```text
@layer payload-default {
  .timezone-picker-wrapper {
    display: flex;
    gap: calc(var(--base) / 4);
    margin-top: calc(var(--base) / 4);
    align-items: center;

    .field-label {
      margin-right: unset;
      color: var(--theme-elevation-400);
      flex-shrink: 0;
    }

    .timezone-picker {
      display: inline-block;

      .rs__menu {
        min-width: calc(var(--base) * 14);
        overflow: hidden;
        border-radius: calc(var(--base) * 0.25);
      }

      .rs__value-container {
        text-align: center;
      }

      .rs__control {
        background: none;
        border: none;
        padding: 0;
        padding-left: calc(var(--base) * 0.25);
        min-height: auto !important;
        position: relative;
        box-shadow: unset;
        min-width: var(--base);

        &:hover {
          cursor: pointer;
          box-shadow: unset;
        }

        &.rs__control--menu-is-open::before {
          display: block;
        }
      }

      .rs__indicators {
        margin-inline-start: calc(var(--base) * 0.25);
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/TimezonePicker/index.tsx
Signals: React

```typescript
'use client'

import type { OptionObject } from 'payload'
import type React from 'react'

import { useMemo } from 'react'

import type { Props } from './types.js'

import { FieldLabel } from '../../fields/FieldLabel/index.js'
import './index.scss'
import { useTranslation } from '../../providers/Translation/index.js'
import { ReactSelect } from '../ReactSelect/index.js'
import { formatOptions } from '../WhereBuilder/Condition/Select/formatOptions.js'

export const TimezonePicker: React.FC<Props> = (props) => {
  const {
    id,
    onChange: onChangeFromProps,
    options: optionsFromProps,
    readOnly: readOnlyFromProps,
    required,
    selectedTimezone: selectedTimezoneFromProps,
  } = props

  const { t } = useTranslation()

  const options = formatOptions(optionsFromProps)

  const selectedTimezone = useMemo(() => {
    return options.find((t) => {
      const value = typeof t === 'string' ? t : t.value
      return value === (selectedTimezoneFromProps || 'UTC')
    })
  }, [options, selectedTimezoneFromProps])

  const readOnly = Boolean(readOnlyFromProps) || options.length === 1

  return (
    <div className="timezone-picker-wrapper">
      <FieldLabel
        htmlFor={id}
        label={`${t('general:timezone')} ${required ? '*' : ''}`}
        required={required}
        unstyled
      />
      <ReactSelect
        className="timezone-picker"
        disabled={readOnly}
        inputId={id}
        isClearable={!required}
        isCreatable={false}
        onChange={(val: OptionObject) => {
          if (onChangeFromProps) {
            onChangeFromProps(val?.value || '')
          }
        }}
        options={options}
        value={selectedTimezone}
      />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/ui/src/elements/TimezonePicker/types.ts

```typescript
import type { SelectFieldClient } from 'payload'

export type Props = {
  id: string
  onChange?: (val: string) => void
  readOnly?: boolean
  required?: boolean
  selectedTimezone?: string
} & Pick<SelectFieldClient, 'options'>
```

--------------------------------------------------------------------------------

---[FILE: fieldErrors.tsx]---
Location: payload-main/packages/ui/src/elements/Toasts/fieldErrors.tsx
Signals: React

```typescript
'use client'

import React from 'react'

function groupSimilarErrors(items: string[]): string[] {
  const result: string[] = []

  for (const item of items) {
    if (item) {
      const parts = item.split(' → ')
      let inserted = false

      // Find a place where a similar path exists
      for (let i = 0; i < result.length; i++) {
        if (result[i].startsWith(parts[0])) {
          result.splice(i + 1, 0, item)
          inserted = true
          break
        }
      }

      // If no similar path was found, add to the end
      if (!inserted) {
        result.push(item)
      }
    }
  }

  return result
}

function createErrorsFromMessage(message: string): {
  errors?: string[]
  message: string
} {
  const [intro, errorsString] = message.split(':')

  if (!errorsString) {
    return {
      message: intro,
    }
  }

  const errors = errorsString.split(',').map((error) => error.replaceAll(' > ', ' → ').trim())

  if (errors.length === 1) {
    return {
      errors,
      message: `${intro}: `,
    }
  }

  return {
    errors: groupSimilarErrors(errors),
    message: `${intro} (${errors.length}):`,
  }
}

export function FieldErrorsToast({ errorMessage }) {
  const [{ errors, message }] = React.useState(() => createErrorsFromMessage(errorMessage))

  return (
    <div>
      {message}
      {Array.isArray(errors) && errors.length > 0 ? (
        errors.length === 1 ? (
          <span data-testid="field-error">{errors[0]}</span>
        ) : (
          <ul data-testid="field-errors">
            {errors.map((error, index) => {
              return <li key={index}>{error}</li>
            })}
          </ul>
        )
      ) : null}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/Tooltip/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .tooltip {
    --caret-size: 6px;

    opacity: 0;
    background-color: var(--theme-elevation-800);
    position: absolute;
    z-index: 3;
    left: 50%;
    padding: base(0.2) base(0.4);
    color: var(--theme-elevation-0);
    line-height: base(0.75);
    font-weight: normal;
    white-space: nowrap;
    border-radius: 2px;
    visibility: hidden;

    &::after {
      content: ' ';
      display: block;
      position: absolute;
      transform: translate3d(-50%, 100%, 0);
      width: 0;
      height: 0;
      border-left: var(--caret-size) solid transparent;
      border-right: var(--caret-size) solid transparent;
    }

    &--show {
      visibility: visible;
      opacity: 1;
      transition: opacity 0.2s ease-in-out;
      cursor: default;
    }

    &--caret-center {
      &::after {
        left: 50%;
      }
    }

    &--caret-left {
      &::after {
        left: calc(var(--base) * 0.5);
      }
    }

    &--caret-right {
      &::after {
        right: calc(var(--base) * 0.5);
      }
    }

    &--position-top {
      top: calc(var(--base) * -1.25);
      transform: translate3d(-50%, calc(var(--caret-size) * -1), 0);

      &::after {
        bottom: 1px;
        border-top: var(--caret-size) solid var(--theme-elevation-800);
      }
    }

    &--position-bottom {
      bottom: calc(var(--base) * -1.25);
      transform: translate3d(-50%, var(--caret-size), 0);

      &::after {
        bottom: calc(100% + var(--caret-size) - 1px);
        border-bottom: var(--caret-size) solid var(--theme-elevation-800);
      }
    }

    .tooltip-content {
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
    }

    @include mid-break {
      display: none;
    }
  }

  html[data-theme='light'] {
    .tooltip:not(.field-error) {
      background-color: var(--theme-elevation-100);
      color: var(--theme-elevation-1000);
    }

    .tooltip--position-top:not(.field-error):after {
      border-top-color: var(--theme-elevation-100);
    }

    .tooltip--position-bottom:not(.field-error):after {
      border-bottom-color: var(--theme-elevation-100);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/Tooltip/index.tsx
Signals: React

```typescript
'use client'
import React, { useEffect } from 'react'

import { useIntersect } from '../../hooks/useIntersect.js'
import './index.scss'

export type Props = {
  alignCaret?: 'center' | 'left' | 'right'
  boundingRef?: React.RefObject<HTMLElement | null>
  children: React.ReactNode
  className?: string
  delay?: number
  position?: 'bottom' | 'top'
  show?: boolean
  /**
   * If the tooltip position should not change depending on if the toolbar is outside the boundingRef. @default false
   */
  staticPositioning?: boolean
}

export const Tooltip: React.FC<Props> = (props) => {
  const {
    alignCaret = 'center',
    boundingRef,
    children,
    className,
    delay = 350,
    position: positionFromProps,
    show: showFromProps = true,
    staticPositioning = false,
  } = props

  const [show, setShow] = React.useState(showFromProps)
  const [position, setPosition] = React.useState<'bottom' | 'top'>('top')

  const getTitleAttribute = (content) => (typeof content === 'string' ? content : '')

  const [ref, intersectionEntry] = useIntersect(
    {
      root: boundingRef?.current || null,
      rootMargin: '-145px 0px 0px 100px',
      threshold: 0,
    },
    staticPositioning,
  )

  useEffect(() => {
    let timerID: NodeJS.Timeout

    // do not use the delay on transition-out
    if (delay && showFromProps) {
      timerID = setTimeout(() => {
        setShow(showFromProps)
      }, delay)
    } else {
      setShow(showFromProps)
    }

    return () => {
      if (timerID) {
        clearTimeout(timerID)
      }
    }
  }, [showFromProps, delay])

  useEffect(() => {
    if (staticPositioning) {
      return
    }
    setPosition(intersectionEntry?.isIntersecting ? 'top' : 'bottom')
  }, [intersectionEntry, staticPositioning])

  // The first aside is always on top. The purpose of that is that it can reliably be used for the interaction observer (as it's not moving around), to calculate the position of the actual tooltip.
  return (
    <React.Fragment>
      {!staticPositioning && (
        <aside
          aria-hidden="true"
          className={['tooltip', className, `tooltip--caret-${alignCaret}`, 'tooltip--position-top']
            .filter(Boolean)
            .join(' ')}
          ref={ref}
          style={{ opacity: '0' }}
        >
          <div className="tooltip-content">{children}</div>
        </aside>
      )}
      <aside
        className={[
          'tooltip',
          className,
          show && 'tooltip--show',
          `tooltip--caret-${alignCaret}`,
          `tooltip--position-${positionFromProps || position}`,
        ]
          .filter(Boolean)
          .join(' ')}
        title={getTitleAttribute(children)}
      >
        <div className="tooltip-content">{children}</div>
      </aside>
    </React.Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/Translation/index.tsx
Signals: React

```typescript
import type { ClientTranslationKeys, TFunction } from '@payloadcms/translations'

import * as React from 'react'

const RecursiveTranslation: React.FC<{
  elements?: Record<string, React.FC<{ children: React.ReactNode }>>
  translationString: string
}> = ({ elements, translationString }) => {
  const regex = /(<[^>]+>.*?<\/[^>]+>)/g
  const sections = translationString.split(regex)

  return (
    <span>
      {sections.map((section, index) => {
        if (elements && section.startsWith('<') && section.endsWith('>')) {
          const elementKey = section[1]
          const Element = elements[elementKey]

          if (Element) {
            const regex = new RegExp(`<${elementKey}>(.*?)<\/${elementKey}>`, 'g')
            const children = section.replace(regex, (_, group) => group)

            return (
              <Element key={index}>
                <RecursiveTranslation translationString={children} />
              </Element>
            )
          }
        }

        return section
      })}
    </span>
  )
}

export type TranslationProps = {
  elements?: Record<string, React.FC<{ children: React.ReactNode }>>
  i18nKey: ClientTranslationKeys
  t: TFunction
  variables?: Record<string, unknown>
}

export const Translation: React.FC<TranslationProps> = ({ elements, i18nKey, t, variables }) => {
  const stringWithVariables = t(i18nKey, variables || {})

  if (!elements) {
    return stringWithVariables
  }

  return <RecursiveTranslation elements={elements} translationString={stringWithVariables} />
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/TrashBanner/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .trash-banner {
    display: flex;
    align-items: center;
    gap: calc(var(--base) * 0.5);
    margin-bottom: var(--base);
    padding: calc(var(--base) * 0.5) calc(var(--base) * 0.75);
    border-radius: var(--style-radius-s);
    background: var(--theme-warning-100);
    color: var(--theme-warning-600);
  }

  html[data-theme='dark'] {
    .trash-banner {
      color: var(--theme-warning-800);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/TrashBanner/index.tsx
Signals: React

```typescript
'use client'

import { getTranslation } from '@payloadcms/translations'
import React from 'react'

import { TrashIcon } from '../../icons/Trash/index.js'
import { useConfig } from '../../providers/Config/index.js'
import { useDocumentInfo } from '../../providers/DocumentInfo/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import './index.scss'

const baseClass = 'trash-banner'

export const TrashBanner: React.FC = () => {
  const { getEntityConfig } = useConfig()
  const { collectionSlug } = useDocumentInfo()
  const collectionConfig = getEntityConfig({ collectionSlug })

  const { labels } = collectionConfig
  const { i18n } = useTranslation()
  return (
    <div className={baseClass}>
      <TrashIcon />
      <p>
        {i18n.t('general:documentIsTrashed', {
          label: `${getTranslation(labels?.singular, i18n)}`,
        })}
      </p>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: DrawerContent.tsx]---
Location: payload-main/packages/ui/src/elements/UnpublishMany/DrawerContent.tsx
Signals: React, Next.js

```typescript
import type { Where } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import { useRouter, useSearchParams } from 'next/navigation.js'
import { combineWhereConstraints, mergeListSearchAndWhere } from 'payload/shared'
import * as qs from 'qs-esm'
import React, { useCallback } from 'react'
import { toast } from 'sonner'

import type { UnpublishManyProps } from './index.js'

import { useConfig } from '../../providers/Config/index.js'
import { useLocale } from '../../providers/Locale/index.js'
import { useRouteCache } from '../../providers/RouteCache/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { requests } from '../../utilities/api.js'
import { parseSearchParams } from '../../utilities/parseSearchParams.js'
import { ConfirmationModal } from '../ConfirmationModal/index.js'

type UnpublishManyDrawerContentProps = {
  drawerSlug: string
  ids: (number | string)[]
  onSuccess?: () => void
  selectAll: boolean
  where?: Where
} & UnpublishManyProps

export function UnpublishManyDrawerContent(props: UnpublishManyDrawerContentProps) {
  const {
    collection,
    collection: { slug, labels: { plural, singular } } = {},
    drawerSlug,
    ids,
    onSuccess,
    selectAll,
    where,
  } = props

  const {
    config: {
      routes: { api },
      serverURL,
    },
  } = useConfig()
  const { code: locale } = useLocale()
  const { i18n, t } = useTranslation()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { clearRouteCache } = useRouteCache()
  const addDefaultError = useCallback(() => {
    toast.error(t('error:unknown'))
  }, [t])

  const queryString = React.useMemo((): string => {
    const whereConstraints: Where[] = [
      {
        _status: {
          not_equals: 'draft',
        },
      },
    ]

    if (where) {
      whereConstraints.push(where)
    }

    const queryWithSearch = mergeListSearchAndWhere({
      collectionConfig: collection,
      search: searchParams.get('search'),
    })

    if (queryWithSearch) {
      whereConstraints.push(queryWithSearch)
    }

    if (!selectAll) {
      // If we're not selecting all, we need to select specific docs
      whereConstraints.push({
        id: {
          in: ids || [],
        },
      })
    }

    return qs.stringify(
      {
        locale,
        select: {},
        where: combineWhereConstraints(whereConstraints),
      },
      { addQueryPrefix: true },
    )
  }, [collection, searchParams, selectAll, ids, locale, where])

  const handleUnpublish = useCallback(async () => {
    await requests
      .patch(`${serverURL}${api}/${slug}${queryString}`, {
        body: JSON.stringify({
          _status: 'draft',
        }),
        headers: {
          'Accept-Language': i18n.language,
          'Content-Type': 'application/json',
        },
      })
      .then(async (res) => {
        try {
          const json = await res.json()

          const deletedDocs = json?.docs.length || 0
          const successLabel = deletedDocs > 1 ? plural : singular

          if (res.status < 400 || deletedDocs > 0) {
            toast.success(
              t('general:updatedCountSuccessfully', {
                count: deletedDocs,
                label: getTranslation(successLabel, i18n),
              }),
            )

            if (json?.errors.length > 0) {
              toast.error(json.message, {
                description: json.errors.map((error) => error.message).join('\n'),
              })
            }

            router.replace(
              qs.stringify(
                {
                  ...parseSearchParams(searchParams),
                  page: selectAll ? '1' : undefined,
                },
                { addQueryPrefix: true },
              ),
            )

            clearRouteCache()

            if (typeof onSuccess === 'function') {
              onSuccess()
            }

            return null
          }

          if (json.errors) {
            json.errors.forEach((error) => toast.error(error.message))
          } else {
            addDefaultError()
          }
          return false
        } catch (_err) {
          return addDefaultError()
        }
      })
  }, [
    serverURL,
    api,
    slug,
    queryString,
    i18n,
    plural,
    singular,
    t,
    router,
    searchParams,
    selectAll,
    clearRouteCache,
    addDefaultError,
    onSuccess,
  ])

  return (
    <ConfirmationModal
      body={t('version:aboutToUnpublishSelection', { label: getTranslation(plural, i18n) })}
      confirmingLabel={t('version:unpublishing')}
      heading={t('version:confirmUnpublish')}
      modalSlug={drawerSlug}
      onConfirm={handleUnpublish}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/UnpublishMany/index.tsx
Signals: React

```typescript
'use client'
import type { ClientCollectionConfig, Where } from 'payload'

import { useModal } from '@faceless-ui/modal'
import React from 'react'

import { useAuth } from '../../providers/Auth/index.js'
import { SelectAllStatus, useSelection } from '../../providers/Selection/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { ListSelectionButton } from '../ListSelection/index.js'
import { UnpublishManyDrawerContent } from './DrawerContent.js'

export type UnpublishManyProps = {
  collection: ClientCollectionConfig
}

export const UnpublishMany: React.FC<UnpublishManyProps> = (props) => {
  const { count, selectAll, selectedIDs, toggleAll } = useSelection()

  return (
    <UnpublishMany_v4
      {...props}
      count={count}
      ids={selectedIDs}
      onSuccess={() => toggleAll()}
      selectAll={selectAll === SelectAllStatus.AllAvailable}
    />
  )
}

export const UnpublishMany_v4: React.FC<
  {
    count: number
    ids: (number | string)[]
    /**
     * When multiple UnpublishMany components are rendered on the page, this will differentiate them.
     */
    modalPrefix?: string
    onSuccess?: () => void
    selectAll: boolean
    where?: Where
  } & UnpublishManyProps
> = (props) => {
  const {
    collection,
    collection: { slug, versions } = {},
    count,
    ids,
    modalPrefix,
    onSuccess,
    selectAll,
    where,
  } = props

  const { t } = useTranslation()
  const { permissions } = useAuth()
  const { toggleModal } = useModal()

  const collectionPermissions = permissions?.collections?.[slug]
  const hasPermission = collectionPermissions?.update

  const drawerSlug = `${modalPrefix ? `${modalPrefix}-` : ''}unpublish-${slug}`

  if (!versions?.drafts || count === 0 || !hasPermission) {
    return null
  }

  return (
    <React.Fragment>
      <ListSelectionButton
        aria-label={t('version:unpublish')}
        onClick={() => {
          toggleModal(drawerSlug)
        }}
      >
        {t('version:unpublish')}
      </ListSelectionButton>
      <UnpublishManyDrawerContent
        collection={collection}
        drawerSlug={drawerSlug}
        ids={ids}
        onSuccess={onSuccess}
        selectAll={selectAll}
        where={where}
      />
    </React.Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/Upload/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .file-field {
    position: relative;
    margin-bottom: var(--base);
    background: var(--theme-elevation-50);
    border-radius: var(--style-radius-s);

    &__upload {
      display: flex;
    }

    .tooltip.error-message {
      z-index: 3;
      bottom: calc(100% - #{calc(var(--base) * 0.5)});
    }

    &__file-selected {
      display: flex;
    }

    &__thumbnail-wrap {
      position: relative;
      width: 150px;

      .thumbnail {
        position: relative;
        width: 100%;
        height: 100%;
        object-fit: contain;
        border-radius: var(--style-radius-s) 0 0 var(--style-radius-s);
      }
    }

    &__remove {
      margin: calc($baseline * 1.5) $baseline $baseline 0;
      place-self: flex-start;
    }

    &__file-adjustments,
    &__remote-file-wrap {
      padding: $baseline;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: calc(var(--base) / 2);
    }

    &__filename,
    &__remote-file {
      @include formInput;
      background-color: var(--theme-bg);
    }

    &__upload-actions,
    &__add-file-wrap {
      display: flex;
      gap: calc(var(--base) / 2);
      flex-wrap: wrap;
    }

    &__upload-actions {
      margin-top: calc(var(--base) * 0.5);
    }

    &__previewDrawer {
      & h2 {
        margin: 0 var(--base) 0 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: calc(100% - calc(var(--base) * 2));
      }
    }

    .dropzone {
      background-color: transparent;
      padding-block: calc(var(--base) * 2.25);
    }

    &__dropzoneContent {
      display: flex;
      flex-wrap: wrap;
      gap: calc(var(--base) * 0.4);
      justify-content: space-between;
      width: 100%;
    }

    &__dropzoneButtons {
      display: flex;
      gap: calc(var(--base) * 0.5);
      align-items: center;
    }

    &__orText {
      color: var(--theme-elevation-500);
      text-transform: lowercase;
    }

    &__dragAndDropText {
      flex-shrink: 0;
      margin: 0;
      text-transform: lowercase;
      align-self: center;
      color: var(--theme-elevation-500);
    }

    @include small-break {
      &__upload {
        flex-wrap: wrap;
        justify-content: space-between;
      }

      &__remove {
        margin: $baseline;
        order: 2;
      }

      &__file-adjustments {
        order: 3;
        border-top: 2px solid var(--theme-elevation-0);
        padding: calc($baseline * 0.5);
        gap: 0;
      }

      &__thumbnail-wrap {
        order: 1;
        width: 50%;

        .thumbnail {
          width: 100%;
        }
      }

      &__edit {
        display: none;
      }
    }
  }
}
```

--------------------------------------------------------------------------------

````
