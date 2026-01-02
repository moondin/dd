---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 367
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 367 of 695)

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
Location: payload-main/packages/ui/src/elements/Drawer/index.tsx
Signals: React

```typescript
'use client'
import { Modal, useModal } from '@faceless-ui/modal'
import React, { createContext, use, useCallback, useLayoutEffect, useState } from 'react'

import type { Props, TogglerProps } from './types.js'

import { XIcon } from '../../icons/X/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { Gutter } from '../Gutter/index.js'
import './index.scss'

const baseClass = 'drawer'

export const drawerZBase = 100

export const formatDrawerSlug = ({ slug, depth }: { depth: number; slug: string }): string =>
  `drawer_${depth}_${slug}`

export { useDrawerSlug } from './useDrawerSlug.js'

export const DrawerToggler: React.FC<TogglerProps> = ({
  slug,
  children,
  className,
  disabled,
  onClick,
  ...rest
}) => {
  const { openModal } = useModal()

  const handleClick = useCallback(
    (e) => {
      openModal(slug)
      if (typeof onClick === 'function') {
        onClick(e)
      }
    },
    [openModal, slug, onClick],
  )

  return (
    <button className={className} disabled={disabled} onClick={handleClick} type="button" {...rest}>
      {children}
    </button>
  )
}

export const Drawer: React.FC<Props> = ({
  slug,
  children,
  className,
  gutter = true,
  Header,
  hoverTitle,
  title,
}) => {
  const { t } = useTranslation()
  const { closeModal, modalState } = useModal()
  const drawerDepth = useDrawerDepth()

  const isOpen = !!modalState[slug]?.isOpen

  const [animateIn, setAnimateIn] = useState(isOpen)

  useLayoutEffect(() => {
    setAnimateIn(isOpen)
  }, [isOpen])

  if (isOpen) {
    // IMPORTANT: do not render the drawer until it is explicitly open, this is to avoid large html trees especially when nesting drawers
    return (
      <DrawerDepthProvider>
        <Modal
          className={[
            className,
            baseClass,
            animateIn && `${baseClass}--is-open`,
            drawerDepth > 1 && `${baseClass}--nested`,
          ]
            .filter(Boolean)
            .join(' ')}
          // Fixes https://github.com/payloadcms/payload/issues/13778
          closeOnBlur={false}
          slug={slug}
          style={{
            zIndex: drawerZBase + drawerDepth,
          }}
        >
          {(!drawerDepth || drawerDepth === 1) && <div className={`${baseClass}__blur-bg`} />}
          <button
            aria-label={t('general:close')}
            className={`${baseClass}__close`}
            id={`close-drawer__${slug}`}
            onClick={() => closeModal(slug)}
            type="button"
          />
          <div
            className={`${baseClass}__content`}
            style={{
              width: `calc(100% - (${drawerDepth} * var(--gutter-h)))`,
            }}
          >
            <div className={`${baseClass}__blur-bg-content`} />
            <Gutter className={`${baseClass}__content-children`} left={gutter} right={gutter}>
              {Header}
              {Header === undefined && (
                <div className={`${baseClass}__header`}>
                  <h2 className={`${baseClass}__header__title`} title={hoverTitle ? title : null}>
                    {title}
                  </h2>
                  {/* TODO: the `button` HTML element breaks CSS transitions on the drawer for some reason...
                    i.e. changing to a `div` element will fix the animation issue but will break accessibility
                  */}
                  <button
                    aria-label={t('general:close')}
                    className={`${baseClass}__header__close`}
                    id={`close-drawer__${slug}`}
                    onClick={() => closeModal(slug)}
                    type="button"
                  >
                    <XIcon />
                  </button>
                </div>
              )}
              {children}
            </Gutter>
          </div>
        </Modal>
      </DrawerDepthProvider>
    )
  }

  return null
}

export const DrawerDepthContext = createContext(1)

export const DrawerDepthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const parentDepth = useDrawerDepth()
  const depth = parentDepth + 1

  return <DrawerDepthContext value={depth}>{children}</DrawerDepthContext>
}

export const useDrawerDepth = (): number => use(DrawerDepthContext)
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/ui/src/elements/Drawer/types.ts
Signals: React

```typescript
import type { HTMLAttributes } from 'react'

export type Props = {
  readonly children: React.ReactNode
  readonly className?: string
  readonly gutter?: boolean
  readonly Header?: React.ReactNode
  readonly hoverTitle?: boolean
  readonly slug: string
  readonly title?: string
}

export type TogglerProps = {
  children: React.ReactNode
  className?: string
  disabled?: boolean
  slug: string
} & HTMLAttributes<HTMLButtonElement>
```

--------------------------------------------------------------------------------

---[FILE: useDrawerSlug.tsx]---
Location: payload-main/packages/ui/src/elements/Drawer/useDrawerSlug.tsx
Signals: React

```typescript
'use client'
import { useId } from 'react'

import { useEditDepth } from '../../providers/EditDepth/index.js'
import { formatDrawerSlug } from './index.js'

export const useDrawerSlug = (slug: string): string => {
  const uuid = useId()
  const editDepth = useEditDepth()
  return formatDrawerSlug({
    slug: `${slug}-${uuid}`,
    depth: editDepth,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/DrawerActionHeader/index.scss

```text
.drawer-action-header {
  padding-top: calc(var(--base) * 2);
  padding-bottom: calc(var(--base) * 1);
  border-bottom: 1px solid var(--theme-elevation-100);

  &__content {
    margin-left: var(--gutter-h);
    margin-right: var(--gutter-h);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__title {
    margin: 0;
  }

  &__actions {
    display: flex;
    margin-left: auto;
    padding-left: var(--base);
    gap: var(--base);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/DrawerActionHeader/index.tsx
Signals: React

```typescript
'use client'

import React from 'react'

import { FormSubmit } from '../../forms/Submit/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { Button } from '../Button/index.js'
import './index.scss'

const baseClass = 'drawer-action-header'

type DrawerActionHeaderArgs = {
  readonly cancelLabel?: string
  className?: string
  readonly onCancel?: () => void
  readonly onSave?: () => void
  readonly saveLabel?: string
  readonly title: React.ReactNode | string
}
export const DrawerActionHeader = ({
  cancelLabel,
  className,
  onCancel,
  onSave,
  saveLabel,
  title,
}: DrawerActionHeaderArgs) => {
  const { t } = useTranslation()

  return (
    <div className={[baseClass, className].filter(Boolean).join(' ')}>
      <div className={`${baseClass}__content`}>
        <h1 className={`${baseClass}__title`}>{title}</h1>

        <div className={`${baseClass}__actions`}>
          <Button aria-label={t('general:cancel')} buttonStyle="secondary" onClick={onCancel}>
            {cancelLabel || t('general:cancel')}
          </Button>

          <FormSubmit aria-label={t('general:applyChanges')} onClick={onSave}>
            {saveLabel || t('general:applyChanges')}
          </FormSubmit>
        </div>
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/DrawerContentContainer/index.scss

```text
.drawer-content-container {
  padding: calc(var(--base) * 2) var(--gutter-h);
  display: flex;
  flex-direction: column;
  overflow: auto;
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/DrawerContentContainer/index.tsx
Signals: React

```typescript
import React from 'react'

import './index.scss'

const baseClass = 'drawer-content-container'

type Props = {
  readonly children: React.ReactNode
  readonly className?: string
}
export function DrawerContentContainer({ children, className }: Props) {
  return <div className={[baseClass, className].filter(Boolean).join(' ')}>{children}</div>
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/Dropzone/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .dropzone {
    position: relative;
    display: flex;
    align-items: center;
    padding: calc(var(--base) * 0.9) var(--base);
    background: transparent;
    border: 1px dotted var(--theme-elevation-400);
    border-radius: var(--style-radius-s);
    height: 100%;
    width: 100%;
    box-shadow: 0 0 0 0 transparent;
    transition: all 100ms cubic-bezier(0, 0.2, 0.2, 1);

    .btn {
      margin: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &.dragging {
      border-color: var(--theme-success-500);
      background: var(--theme-success-150);
      @include shadow-m;

      * {
        pointer-events: none;
      }
    }

    @include mid-break {
      display: block;
      text-align: center;
    }

    &.dropzoneStyle--none {
      all: unset;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/Dropzone/index.tsx
Signals: React

```typescript
'use client'
import React from 'react'

import './index.scss'

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()
}

const baseClass = 'dropzone'

export type Props = {
  readonly children?: React.ReactNode
  readonly className?: string
  readonly disabled?: boolean
  readonly dropzoneStyle?: 'default' | 'none'
  readonly multipleFiles?: boolean
  readonly onChange: (e: FileList) => void
}

export function Dropzone({
  children,
  className,
  disabled = false,
  dropzoneStyle = 'default',
  multipleFiles,
  onChange,
}: Props) {
  const dropRef = React.useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = React.useState(false)

  const addFiles = React.useCallback(
    (files: FileList) => {
      if (!multipleFiles && files.length > 1) {
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(files[0])
        onChange(dataTransfer.files)
      } else {
        onChange(files)
      }
    },
    [multipleFiles, onChange],
  )

  const handlePaste = React.useCallback(
    (e: ClipboardEvent) => {
      e.preventDefault()
      e.stopPropagation()

      if (e.clipboardData.files && e.clipboardData.files.length > 0) {
        addFiles(e.clipboardData.files)
      }
    },
    [addFiles],
  )

  const handleDragEnter = React.useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(true)
  }, [])

  const handleDragLeave = React.useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(false)
  }, [])

  const handleDrop = React.useCallback(
    (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragging(false)

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files)
        setDragging(false)

        e.dataTransfer.clearData()
      }
    },
    [addFiles],
  )

  React.useEffect(() => {
    const div = dropRef.current

    if (div && !disabled) {
      div.addEventListener('dragenter', handleDragEnter)
      div.addEventListener('dragleave', handleDragLeave)
      div.addEventListener('dragover', handleDragOver)
      div.addEventListener('drop', handleDrop)
      div.addEventListener('paste', handlePaste)

      return () => {
        div.removeEventListener('dragenter', handleDragEnter)
        div.removeEventListener('dragleave', handleDragLeave)
        div.removeEventListener('dragover', handleDragOver)
        div.removeEventListener('drop', handleDrop)
        div.removeEventListener('paste', handlePaste)
      }
    }

    return () => null
  }, [disabled, handleDragEnter, handleDragLeave, handleDrop, handlePaste])

  const classes = [
    baseClass,
    className,
    dragging ? 'dragging' : '',
    `dropzoneStyle--${dropzoneStyle}`,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} ref={dropRef}>
      {children}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/DuplicateDocument/index.tsx
Signals: React, Next.js

```typescript
'use client'

import type { SanitizedCollectionConfig } from 'payload'

import { useModal } from '@faceless-ui/modal'
import { getTranslation } from '@payloadcms/translations'
import { useRouter } from 'next/navigation.js'
import { formatAdminURL, formatApiURL, hasDraftsEnabled } from 'payload/shared'
import * as qs from 'qs-esm'
import React, { useCallback, useMemo } from 'react'
import { toast } from 'sonner'

import type { DocumentDrawerContextType } from '../DocumentDrawer/Provider.js'

import { useForm, useFormModified } from '../../forms/Form/context.js'
import { useConfig } from '../../providers/Config/index.js'
import { useLocale } from '../../providers/Locale/index.js'
import { useRouteTransition } from '../../providers/RouteTransition/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { requests } from '../../utilities/api.js'
import { traverseForLocalizedFields } from '../../utilities/traverseForLocalizedFields.js'
import { ConfirmationModal } from '../ConfirmationModal/index.js'
import { PopupList } from '../Popup/index.js'
import { SelectLocalesDrawer } from './SelectLocalesDrawer/index.js'

export type Props = {
  readonly id: number | string
  readonly onDuplicate?: DocumentDrawerContextType['onDuplicate']
  readonly redirectAfterDuplicate?: boolean
  readonly selectLocales?: boolean
  readonly singularLabel: SanitizedCollectionConfig['labels']['singular']
  readonly slug: string
}

export const DuplicateDocument: React.FC<Props> = ({
  id,
  slug,
  onDuplicate,
  redirectAfterDuplicate = true,
  selectLocales,
  singularLabel,
}) => {
  const router = useRouter()
  const modified = useFormModified()
  const { openModal } = useModal()
  const { code: localeCode } = useLocale()
  const { setModified } = useForm()
  const { startRouteTransition } = useRouteTransition()

  const {
    config: {
      localization,
      routes: { admin: adminRoute, api: apiRoute },
      serverURL,
    },
    getEntityConfig,
  } = useConfig()

  const collectionConfig = getEntityConfig({ collectionSlug: slug })

  const { i18n, t } = useTranslation()

  const modalSlug = `duplicate-${id}`
  const drawerSlug = `duplicate-locales-${id}`

  const isDuplicateByLocaleEnabled = useMemo(() => {
    if (selectLocales && collectionConfig) {
      return traverseForLocalizedFields(collectionConfig.fields)
    }
    return false
  }, [collectionConfig, selectLocales])

  const handleDuplicate = useCallback(
    async (args?: { selectedLocales?: string[] }) => {
      const { selectedLocales } = args || {}
      const hasSelectedLocales = selectedLocales && selectedLocales.length > 0

      const queryParams: Record<string, string | string[]> = {}
      if (localeCode) {
        queryParams.locale = localeCode
      }
      if (hasSelectedLocales) {
        queryParams.selectedLocales = selectedLocales
      }

      const headers = {
        'Accept-Language': i18n.language,
        'Content-Type': 'application/json',
        credentials: 'include',
      }

      try {
        const res = await requests.post(
          formatApiURL({
            apiRoute,
            path: `/${slug}/${id}/duplicate${qs.stringify(queryParams, {
              addQueryPrefix: true,
            })}`,
            serverURL,
          }),
          {
            body: JSON.stringify(hasDraftsEnabled(collectionConfig) ? { _status: 'draft' } : {}),
            headers,
          },
        )

        const { doc, errors, message } = await res.json()

        if (res.status < 400) {
          toast.success(
            message ||
              t('general:successfullyDuplicated', { label: getTranslation(singularLabel, i18n) }),
          )

          setModified(false)

          if (redirectAfterDuplicate) {
            return startRouteTransition(() =>
              router.push(
                formatAdminURL({
                  adminRoute,
                  path: `/collections/${slug}/${doc.id}${localeCode ? `?locale=${localeCode}` : ''}`,
                  serverURL,
                }),
              ),
            )
          }

          if (typeof onDuplicate === 'function') {
            void onDuplicate({ collectionConfig, doc })
          }
        } else {
          toast.error(
            errors?.[0].message ||
              message ||
              t('error:unspecific', { label: getTranslation(singularLabel, i18n) }),
          )
        }
      } catch (_error) {
        toast.error(t('error:unspecific', { label: getTranslation(singularLabel, i18n) }))
      }
    },
    [
      adminRoute,
      apiRoute,
      collectionConfig,
      i18n,
      id,
      localeCode,
      onDuplicate,
      redirectAfterDuplicate,
      router,
      serverURL,
      setModified,
      singularLabel,
      slug,
      startRouteTransition,
      t,
    ],
  )

  const handleConfirmWithoutSaving = useCallback(async () => {
    if (selectLocales) {
      openModal(drawerSlug)
    } else {
      await handleDuplicate()
    }
  }, [handleDuplicate, drawerSlug, selectLocales, openModal])

  const buttonLabel = selectLocales
    ? `${t('general:duplicate')} ${t('localization:selectedLocales')}`
    : t('general:duplicate')

  if (!selectLocales || isDuplicateByLocaleEnabled) {
    return (
      <React.Fragment>
        <PopupList.Button
          id={`action-duplicate${isDuplicateByLocaleEnabled ? `-locales` : ''}`}
          onClick={() => {
            if (modified) {
              openModal(modalSlug)
            } else if (selectLocales) {
              openModal(drawerSlug)
            } else {
              void handleDuplicate()
            }
          }}
        >
          {buttonLabel}
        </PopupList.Button>
        <ConfirmationModal
          body={t('general:unsavedChangesDuplicate')}
          confirmLabel={t('general:duplicateWithoutSaving')}
          heading={t('general:unsavedChanges')}
          modalSlug={modalSlug}
          onConfirm={handleConfirmWithoutSaving}
        />
        {selectLocales && localization && (
          <SelectLocalesDrawer
            localization={localization}
            onConfirm={handleDuplicate}
            slug={drawerSlug}
          />
        )}
      </React.Fragment>
    )
  }

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/DuplicateDocument/SelectLocalesDrawer/index.scss

```text
@import '../../../scss/styles.scss';

.select-locales-drawer {
  &__sub-header {
    padding: 0 var(--gutter-h);
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--theme-border-color);
  }

  &__content {
    padding: calc(var(--base) * 1.5) var(--gutter-h);
    display: flex;
    flex-direction: column;
    gap: calc(var(--base));
  }

  &__item {
    display: flex;
    flex-direction: row;
    gap: calc(var(--base) * 0.5);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/DuplicateDocument/SelectLocalesDrawer/index.tsx
Signals: React

```typescript
'use client'

import type { I18nClient } from '@payloadcms/translations'
import type { ClientConfig } from 'payload'

import { useModal } from '@faceless-ui/modal'
import { getTranslation } from '@payloadcms/translations'
import { setsAreEqual } from 'payload/shared'
import React, { useCallback, useMemo, useState } from 'react'

import { CheckboxInput } from '../../../fields/Checkbox/index.js'
import { useTranslation } from '../../../providers/Translation/index.js'
import { DrawerHeader } from '../../BulkUpload/Header/index.js'
import { Button } from '../../Button/index.js'
import { Drawer } from '../../Drawer/index.js'
import './index.scss'

export type LocaleOption = {
  label: string
  value: string
}

export type SelectLocalesDrawerProps = {
  readonly localization: Exclude<ClientConfig['localization'], false>
  readonly onConfirm: (args: { selectedLocales: string[] }) => Promise<void> | void
  readonly slug: string
}

const getLocaleOptions = ({
  i18n,
  localization,
}: {
  i18n: I18nClient
  localization: SelectLocalesDrawerProps['localization']
}): LocaleOption[] => {
  return localization.locales.map((locale) => ({
    label: getTranslation(locale.label, i18n),
    value: locale.code,
  }))
}

const baseClass = 'select-locales-drawer'

export const SelectLocalesDrawer: React.FC<SelectLocalesDrawerProps> = ({
  slug,
  localization,
  onConfirm,
}) => {
  const { i18n, t } = useTranslation()
  const { toggleModal } = useModal()
  const [selectedLocales, setSelectedLocales] = useState<string[]>([])

  const localeOptions = useMemo(
    () => getLocaleOptions({ i18n, localization }),
    [localization, i18n],
  )
  const allLocales = useMemo(() => localeOptions.map((locale) => locale.value), [localeOptions])
  const allLocalesSelected = useMemo(
    () => setsAreEqual(new Set(selectedLocales), new Set(allLocales)),
    [selectedLocales, allLocales],
  )

  const handleSelectAll = useCallback(() => {
    setSelectedLocales(allLocalesSelected ? [] : [...allLocales])
  }, [allLocalesSelected, allLocales])

  const handleToggleLocale = useCallback((localeValue: string) => {
    setSelectedLocales((prev) =>
      prev.includes(localeValue) ? prev.filter((l) => l !== localeValue) : [...prev, localeValue],
    )
  }, [])

  const handleConfirm = useCallback(async () => {
    await onConfirm({ selectedLocales })
    toggleModal(slug)
  }, [onConfirm, selectedLocales, slug, toggleModal])

  return (
    <Drawer
      className={baseClass}
      gutter={false}
      Header={
        <DrawerHeader
          onClose={() => {
            toggleModal(slug)
          }}
          title={`${t('general:duplicate')} ${t('localization:selectedLocales')}`}
        />
      }
      slug={slug}
    >
      <div className={`${baseClass}__sub-header`}>
        <span>{t('localization:selectLocaleToDuplicate')}</span>
        <Button
          buttonStyle="primary"
          disabled={selectedLocales.length === 0}
          iconPosition="left"
          id="#action-duplicate-confirm"
          onClick={handleConfirm}
          size="medium"
        >
          {t('general:duplicate')}
        </Button>
      </div>
      <div className={`${baseClass}__content`}>
        <div className={`${baseClass}__item`}>
          <CheckboxInput
            checked={allLocalesSelected}
            id="select-locale-all"
            label={t('general:selectAll', {
              count: allLocales.length,
              label: t('general:locales'),
            })}
            onToggle={handleSelectAll}
          />
        </div>
        {localeOptions.map((locale) => (
          <div className={`${baseClass}__item`} key={locale.value}>
            <CheckboxInput
              checked={selectedLocales.includes(locale.value)}
              id={`select-locale-${locale.value}`}
              label={locale.label}
              onToggle={() => handleToggleLocale(locale.value)}
            />
          </div>
        ))}
      </div>
    </Drawer>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: DrawerContent.tsx]---
Location: payload-main/packages/ui/src/elements/EditMany/DrawerContent.tsx
Signals: React, Next.js

```typescript
'use client'

import type { SelectType, Where } from 'payload'

import { useModal } from '@faceless-ui/modal'
import { getTranslation } from '@payloadcms/translations'
import { useRouter, useSearchParams } from 'next/navigation.js'
import {
  combineWhereConstraints,
  formatApiURL,
  mergeListSearchAndWhere,
  unflatten,
} from 'payload/shared'
import * as qs from 'qs-esm'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import type { FormProps } from '../../forms/Form/index.js'
import type { OnFieldSelect } from '../FieldSelect/index.js'
import type { FieldOption } from '../FieldSelect/reduceFieldOptions.js'

import { useForm } from '../../forms/Form/context.js'
import { Form } from '../../forms/Form/index.js'
import { RenderField } from '../../forms/RenderFields/RenderField.js'
import { FormSubmit } from '../../forms/Submit/index.js'
import { XIcon } from '../../icons/X/index.js'
import { useAuth } from '../../providers/Auth/index.js'
import { useConfig } from '../../providers/Config/index.js'
import { DocumentInfoProvider } from '../../providers/DocumentInfo/index.js'
import { useLocale } from '../../providers/Locale/index.js'
import { OperationContext } from '../../providers/Operation/index.js'
import { useRouteCache } from '../../providers/RouteCache/index.js'
import { useServerFunctions } from '../../providers/ServerFunctions/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { abortAndIgnore, handleAbortRef } from '../../utilities/abortAndIgnore.js'
import { parseSearchParams } from '../../utilities/parseSearchParams.js'
import { FieldSelect } from '../FieldSelect/index.js'
import './index.scss'
import '../../forms/RenderFields/index.scss'
import { baseClass, type EditManyProps } from './index.js'

const Submit: React.FC<{
  readonly action: string
  readonly disabled: boolean
}> = ({ action, disabled }) => {
  const { submit } = useForm()
  const { t } = useTranslation()

  const save = useCallback(() => {
    void submit({
      action,
      method: 'PATCH',
      skipValidation: true,
    })
  }, [action, submit])

  return (
    <FormSubmit className={`${baseClass}__save`} disabled={disabled} onClick={save}>
      {t('general:save')}
    </FormSubmit>
  )
}

const PublishButton: React.FC<{
  action: string
  disabled: boolean
}> = ({ action, disabled }) => {
  const { submit } = useForm()
  const { t } = useTranslation()

  const save = useCallback(() => {
    void submit({
      action,
      method: 'PATCH',
      overrides: {
        _status: 'published',
      },
      skipValidation: true,
    })
  }, [action, submit])

  return (
    <FormSubmit className={`${baseClass}__publish`} disabled={disabled} onClick={save}>
      {t('version:publishChanges')}
    </FormSubmit>
  )
}

const SaveDraftButton: React.FC<{
  action: string
  disabled: boolean
}> = ({ action, disabled }) => {
  const { submit } = useForm()
  const { t } = useTranslation()

  const save = useCallback(() => {
    void submit({
      action,
      method: 'PATCH',
      overrides: {
        _status: 'draft',
      },
      skipValidation: true,
    })
  }, [action, submit])

  return (
    <FormSubmit
      buttonStyle="secondary"
      className={`${baseClass}__draft`}
      disabled={disabled}
      onClick={save}
    >
      {t('version:saveDraft')}
    </FormSubmit>
  )
}

type EditManyDrawerContentProps = {
  /**
   * The total count of selected items
   */
  count?: number
  /**
   * The slug of the drawer
   */
  drawerSlug: string
  /**
   * The IDs of the selected items
   */
  ids?: (number | string)[]
  /**
   * The function to call after a successful action
   */
  onSuccess?: () => void
  /**
   * Whether all items are selected
   */
  selectAll?: boolean
  /**
   * The fields that are selected to bulk edit
   */
  selectedFields: FieldOption[]
  /**
   * The function to set the selected fields to bulk edit
   */
  setSelectedFields: (fields: FieldOption[]) => void
  where?: Where
} & EditManyProps

export const EditManyDrawerContent: React.FC<EditManyDrawerContentProps> = (props) => {
  const {
    collection,
    collection: { fields, labels: { plural, singular } } = {},
    count,
    drawerSlug,
    ids,
    onSuccess: onSuccessFromProps,
    selectAll,
    selectedFields,
    setSelectedFields,
    where,
  } = props

  const { permissions, user } = useAuth()
  const { code: locale } = useLocale()

  const { closeModal } = useModal()

  const {
    config: {
      routes: { api: apiRoute },
      serverURL,
    },
  } = useConfig()

  const { getFormState } = useServerFunctions()

  const { i18n, t } = useTranslation()

  const [isInitializing, setIsInitializing] = useState(false)

  const router = useRouter()
  const abortFormStateRef = React.useRef<AbortController>(null)
  const { clearRouteCache } = useRouteCache()
  const collectionPermissions = permissions?.collections?.[collection.slug]
  const searchParams = useSearchParams()

  const select = useMemo<SelectType>(() => {
    return unflatten(
      selectedFields.reduce((acc, option) => {
        acc[option.value.path] = true
        return acc
      }, {} as SelectType),
    )
  }, [selectedFields])

  const onChange: FormProps['onChange'][0] = useCallback(
    async ({ formState: prevFormState, submitted }) => {
      const controller = handleAbortRef(abortFormStateRef)

      const { state } = await getFormState({
        collectionSlug: collection.slug,
        docPermissions: collectionPermissions,
        docPreferences: null,
        formState: prevFormState,
        operation: 'update',
        schemaPath: collection.slug,
        select,
        signal: controller.signal,
        skipValidation: !submitted,
      })

      abortFormStateRef.current = null

      return state
    },
    [getFormState, collection, collectionPermissions, select],
  )

  useEffect(() => {
    const abortFormState = abortFormStateRef.current

    return () => {
      abortAndIgnore(abortFormState)
    }
  }, [])

  const queryString = useMemo((): string => {
    const whereConstraints: Where[] = []

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

    if (selectAll) {
      // Match the current filter/search, or default to all docs
      whereConstraints.push(
        (parseSearchParams(searchParams)?.where as Where) || {
          id: {
            not_equals: '',
          },
        },
      )
    } else {
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

  const onSuccess = () => {
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
    closeModal(drawerSlug)

    if (typeof onSuccessFromProps === 'function') {
      onSuccessFromProps()
    }
  }

  const onFieldSelect = useCallback<OnFieldSelect>(
    async ({ dispatchFields, formState, selected }) => {
      setIsInitializing(true)

      setSelectedFields(selected || [])

      const { state } = await getFormState({
        collectionSlug: collection.slug,
        docPermissions: collectionPermissions,
        docPreferences: null,
        formState,
        operation: 'update',
        schemaPath: collection.slug,
        select: unflatten(
          selected.reduce((acc, option) => {
            acc[option.value.path] = true
            return acc
          }, {} as SelectType),
        ),
        skipValidation: true,
      })

      dispatchFields({
        type: 'UPDATE_MANY',
        formState: state,
      })

      setIsInitializing(false)
    },
    [getFormState, collection.slug, collectionPermissions, setSelectedFields],
  )

  return (
    <DocumentInfoProvider
      collectionSlug={collection.slug}
      currentEditor={user}
      hasPublishedDoc={false}
      id={null}
      initialData={{}}
      isLocked={false}
      lastUpdateTime={0}
      mostRecentVersionIsAutosaved={false}
      unpublishedVersionCount={0}
      versionCount={0}
    >
      <OperationContext value="update">
        <div className={`${baseClass}__main`}>
          <div className={`${baseClass}__header`}>
            <h2 className={`${baseClass}__header__title`}>
              {t('general:editingLabel', {
                count,
                label: getTranslation(count > 1 ? plural : singular, i18n),
              })}
            </h2>
            <button
              aria-label={t('general:close')}
              className={`${baseClass}__header__close`}
              id={`close-drawer__${drawerSlug}`}
              onClick={() => closeModal(drawerSlug)}
              type="button"
            >
              <XIcon />
            </button>
          </div>
          <Form
            className={`${baseClass}__form`}
            isInitializing={isInitializing}
            onChange={[onChange]}
            onSuccess={onSuccess}
          >
            <FieldSelect
              fields={fields}
              onChange={onFieldSelect}
              permissions={collectionPermissions.fields}
            />
            {selectedFields.length === 0 ? null : (
              <div className="render-fields">
                {selectedFields.map((option, i) => {
                  const {
                    value: { field, fieldPermissions, path },
                  } = option

                  return (
                    <RenderField
                      clientFieldConfig={field}
                      indexPath=""
                      key={`${path}-${i}`}
                      parentPath=""
                      parentSchemaPath=""
                      path={path}
                      permissions={fieldPermissions}
                    />
                  )
                })}
              </div>
            )}
            <div className={`${baseClass}__sidebar-wrap`}>
              <div className={`${baseClass}__sidebar`}>
                <div className={`${baseClass}__sidebar-sticky-wrap`}>
                  <div className={`${baseClass}__document-actions`}>
                    {collection?.versions?.drafts ? (
                      <React.Fragment>
                        <SaveDraftButton
                          action={formatApiURL({
                            apiRoute,
                            path: `/${collection.slug}${queryString}&draft=true`,
                            serverURL,
                          })}
                          disabled={selectedFields.length === 0}
                        />
                        <PublishButton
                          action={formatApiURL({
                            apiRoute,
                            path: `/${collection.slug}${queryString}&draft=true`,
                            serverURL,
                          })}
                          disabled={selectedFields.length === 0}
                        />
                      </React.Fragment>
                    ) : (
                      <Submit
                        action={formatApiURL({
                          apiRoute,
                          path: `/${collection.slug}${queryString}`,
                          serverURL,
                        })}
                        disabled={selectedFields.length === 0}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </OperationContext>
    </DocumentInfoProvider>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/EditMany/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .edit-many {
    &__form {
      height: 100%;
    }

    &__main {
      width: calc(100% - #{base(15)});
      display: flex;
      flex-direction: column;
      min-height: 100%;
    }

    &__header {
      display: flex;
      margin-top: base(2.5);
      margin-bottom: base(1);
      width: 100%;

      &__title {
        margin: 0;
        flex-grow: 1;
      }

      &__close {
        border: 0;
        background-color: transparent;
        padding: 0;
        cursor: pointer;
        overflow: hidden;
        width: base(1);
        height: base(1);

        svg {
          width: base(2);
          height: base(2);
          position: relative;
          inset-inline-start: base(-0.5);
          top: base(-0.5);

          .stroke {
            stroke-width: 2px;
            vector-effect: non-scaling-stroke;
          }
        }
      }
    }

    &__edit {
      padding-top: base(1);
      padding-bottom: base(2);
      flex-grow: 1;
    }
    [dir='rtl'] &__sidebar-wrap {
      left: 0;
      border-right: 1px solid var(--theme-elevation-100);
      right: auto;
    }

    &__sidebar-wrap {
      position: fixed;
      width: base(15);
      height: 100%;
      top: 0;
      right: 0;
      overflow: visible;
      border-left: 1px solid var(--theme-elevation-100);
    }

    &__sidebar {
      width: 100%;
      height: 100%;
      overflow-y: auto;
    }

    &__sidebar-sticky-wrap {
      display: flex;
      flex-direction: column;
      min-height: 100%;
    }

    &__collection-actions,
    &__meta,
    &__sidebar-fields {
      [dir='ltr'] & {
        padding-left: base(1.5);
      }
      [dir='rtl'] & {
        padding-right: base(1.5);
      }
    }

    &__document-actions {
      padding-right: $baseline;
      position: sticky;
      top: 0;
      z-index: var(--z-nav);

      > * {
        position: relative;
        z-index: 1;
      }

      @include mid-break {
        @include blur-bg;
      }
    }

    &__save {
      width: calc(50% - #{base(1)});

      @include mid-break {
        width: 100%;
      }
    }

    &__publish,
    &__draft {
      width: 100%;
    }

    &__document-actions {
      display: flex;
      padding: base(1);
      gap: base(0.5);

      .form-submit {
        width: 100%;

        @include mid-break {
          width: auto;
          flex-grow: 1;
        }

        .btn {
          padding-left: base(0.5);
          padding-right: base(0.5);
          margin-bottom: 0;
        }
      }
    }

    @include mid-break {
      &__main {
        width: 100%;
        min-height: initial;
      }

      &__sidebar-wrap {
        position: static;
        width: 100%;
        height: initial;
      }

      &__form {
        display: block;
      }

      &__edit {
        padding-top: 0;
        padding-bottom: 0;
      }

      &__document-actions {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        top: auto;
        z-index: var(--z-nav);
      }

      &__document-actions,
      &__sidebar-fields {
        padding-left: var(--gutter-h);
        padding-right: var(--gutter-h);
      }
    }
  }
}
```

--------------------------------------------------------------------------------

````
