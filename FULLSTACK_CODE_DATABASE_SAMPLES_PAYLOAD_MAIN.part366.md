---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 366
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 366 of 695)

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
Location: payload-main/packages/ui/src/elements/DocumentDrawer/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .doc-drawer {
    &__toggler {
      background: transparent;
      border: 0;
      margin: 0;
      padding: 0;
      cursor: pointer;
      color: inherit;

      &:focus,
      &:focus-within {
        outline: none;
      }

      &:disabled {
        pointer-events: none;
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/DocumentDrawer/index.tsx
Signals: React

```typescript
'use client'
import { useModal } from '@faceless-ui/modal'
import React, { useCallback, useEffect, useId, useMemo, useState } from 'react'

import type {
  DocumentDrawerProps,
  DocumentTogglerProps,
  UseDocumentDrawer,
  UseDocumentDrawerContext,
} from './types.js'

import { useRelatedCollections } from '../../hooks/useRelatedCollections.js'
import { useEditDepth } from '../../providers/EditDepth/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { Drawer, DrawerToggler } from '../Drawer/index.js'
import { DocumentDrawerContent } from './DrawerContent.js'
import './index.scss'

export const documentDrawerBaseClass = 'doc-drawer'

const formatDocumentDrawerSlug = ({
  id,
  collectionSlug,
  depth,
  uuid,
}: {
  collectionSlug: string
  depth: number
  id?: number | string
  uuid: string
}) => `doc-drawer_${collectionSlug}_${depth}${id ? `_${id}` : ''}_${uuid}`

export const DocumentDrawerToggler: React.FC<DocumentTogglerProps> = ({
  children,
  className,
  collectionSlug,
  disabled,
  drawerSlug,
  onClick,
  operation,
  ...rest
}) => {
  const { t } = useTranslation()
  const [collectionConfig] = useRelatedCollections(collectionSlug)

  return (
    <DrawerToggler
      aria-label={t(operation === 'create' ? 'fields:addNewLabel' : 'general:editLabel', {
        label: collectionConfig?.labels.singular,
      })}
      className={[className, `${documentDrawerBaseClass}__toggler`].filter(Boolean).join(' ')}
      disabled={disabled}
      onClick={onClick}
      slug={drawerSlug}
      {...rest}
    >
      {children}
    </DrawerToggler>
  )
}

export const DocumentDrawer: React.FC<DocumentDrawerProps> = (props) => {
  const { drawerSlug } = props

  return (
    <Drawer className={documentDrawerBaseClass} gutter={false} Header={null} slug={drawerSlug}>
      <DocumentDrawerContent {...props} />
    </Drawer>
  )
}

/**
 * A hook to manage documents from a drawer modal.
 * It provides the components and methods needed to open, close, and interact with the drawer.
 * @example
 * const [DocumentDrawer, DocumentDrawerToggler, { openDrawer, closeDrawer }] = useDocumentDrawer({
 *   collectionSlug: 'posts',
 *   id: postId, // optional, if not provided, it will render the "create new" view
 * })
 *
 * // ...
 *
 * return (
 *   <div>
 *     <DocumentDrawerToggler collectionSlug="posts" id={postId}>
 *       Edit Post
 *    </DocumentDrawerToggler>
 *    <DocumentDrawer collectionSlug="posts" id={postId} />
 *  </div>
 */
export const useDocumentDrawer: UseDocumentDrawer = ({
  id,
  collectionSlug,
  overrideEntityVisibility,
}) => {
  const editDepth = useEditDepth()
  const uuid = useId()
  const { closeModal, modalState, openModal, toggleModal } = useModal()
  const [isOpen, setIsOpen] = useState(false)

  const drawerSlug = formatDocumentDrawerSlug({
    id,
    collectionSlug,
    depth: editDepth,
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
  }, [closeModal, drawerSlug])

  const openDrawer = useCallback(() => {
    openModal(drawerSlug)
  }, [openModal, drawerSlug])

  const MemoizedDrawer = useMemo<React.FC<DocumentDrawerProps>>(() => {
    return (props) => (
      <DocumentDrawer
        {...props}
        collectionSlug={collectionSlug}
        drawerSlug={drawerSlug}
        id={id}
        key={drawerSlug}
        overrideEntityVisibility={overrideEntityVisibility}
      />
    )
  }, [id, drawerSlug, collectionSlug, overrideEntityVisibility])

  const MemoizedDrawerToggler = useMemo<React.FC<DocumentTogglerProps>>(() => {
    return (props) => (
      <DocumentDrawerToggler
        {...props}
        collectionSlug={collectionSlug}
        drawerSlug={drawerSlug}
        operation={!id ? 'create' : 'update'}
      />
    )
  }, [id, drawerSlug, collectionSlug])

  const MemoizedDrawerState = useMemo<UseDocumentDrawerContext>(
    () => ({
      closeDrawer,
      drawerDepth: editDepth,
      drawerSlug,
      isDrawerOpen: isOpen,
      openDrawer,
      toggleDrawer,
    }),
    [editDepth, drawerSlug, isOpen, toggleDrawer, closeDrawer, openDrawer],
  )

  return [MemoizedDrawer, MemoizedDrawerToggler, MemoizedDrawerState]
}
```

--------------------------------------------------------------------------------

---[FILE: Provider.tsx]---
Location: payload-main/packages/ui/src/elements/DocumentDrawer/Provider.tsx
Signals: React

```typescript
import type { ClientCollectionConfig, Data, FormState, TypeWithID } from 'payload'

import { createContext, use } from 'react'

export type DocumentDrawerContextProps = {
  readonly clearDoc?: () => void
  readonly drawerSlug: string
  readonly onDelete?: (args: {
    collectionConfig?: ClientCollectionConfig
    id: string
  }) => Promise<void> | void
  /* only available if `redirectAfterDuplicate` is `false` */
  readonly onDuplicate?: (args: {
    collectionConfig?: ClientCollectionConfig
    doc: TypeWithID
  }) => Promise<void> | void
  readonly onRestore?: (args: {
    collectionConfig?: ClientCollectionConfig
    id: string
  }) => Promise<void> | void
  readonly onSave?: (args: {
    collectionConfig?: ClientCollectionConfig
    /**
     * If you want to pass additional data to the onSuccess callback, you can use this context object.
     *
     * @experimental This property is experimental and may change in the future. Use at your own risk.
     */
    context?: Record<string, unknown>
    doc: TypeWithID
    operation: 'create' | 'update'
    result: Data
  }) => Promise<FormState | void> | void
}

export type DocumentDrawerContextType = {} & DocumentDrawerContextProps

export const DocumentDrawerCallbacksContext = createContext({} as DocumentDrawerContextType)

export const DocumentDrawerContextProvider: React.FC<
  {
    children: React.ReactNode
  } & DocumentDrawerContextProps
> = ({ children, ...rest }) => {
  return (
    <DocumentDrawerCallbacksContext value={{ ...rest }}>{children}</DocumentDrawerCallbacksContext>
  )
}

export const useDocumentDrawerContext = (): DocumentDrawerContextType => {
  const context = use(DocumentDrawerCallbacksContext)

  if (!context) {
    throw new Error('useDocumentDrawerContext must be used within a DocumentDrawerProvider')
  }

  return context
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/ui/src/elements/DocumentDrawer/types.ts
Signals: React

```typescript
import type { Data, DefaultDocumentIDType, FormState, Operation } from 'payload'
import type React from 'react'
import type { HTMLAttributes } from 'react'

import type { Props as DrawerProps } from '../Drawer/types.js'
import type { DocumentDrawerContextProps } from './Provider.js'

export type DocumentDrawerProps = {
  readonly AfterFields?: React.ReactNode
  /**
   * The slug of the collection to which the document belongs.
   */
  readonly collectionSlug: string
  readonly disableActions?: boolean
  readonly drawerSlug?: string
  /**
   * The ID of the document to be edited.
   * When provided, will be fetched and displayed in the drawer.
   * If omitted, will render the "create new" view for the given collection.
   */
  readonly id?: DefaultDocumentIDType | null
  readonly initialData?: Data
  /**
   * @deprecated
   */
  readonly initialState?: FormState
  readonly overrideEntityVisibility?: boolean
  readonly redirectAfterCreate?: boolean
  readonly redirectAfterDelete?: boolean
  readonly redirectAfterDuplicate?: boolean
  readonly redirectAfterRestore?: boolean
} & Pick<DocumentDrawerContextProps, 'onDelete' | 'onDuplicate' | 'onSave'> &
  Pick<DrawerProps, 'Header'>

export type DocumentTogglerProps = {
  readonly children?: React.ReactNode
  readonly className?: string
  readonly collectionSlug: string
  readonly disabled?: boolean
  readonly drawerSlug?: string
  readonly onClick?: () => void
  readonly operation: Operation
} & Readonly<HTMLAttributes<HTMLButtonElement>>

export type UseDocumentDrawerContext = {
  closeDrawer: () => void
  drawerDepth: number
  drawerSlug: string
  isDrawerOpen: boolean
  openDrawer: () => void
  toggleDrawer: () => void
}

export type UseDocumentDrawer = (
  args: Pick<DocumentDrawerProps, 'collectionSlug' | 'id' | 'overrideEntityVisibility'>,
) => [
  // drawer
  React.FC<
    {
      children?: React.ReactNode
    } & Omit<DocumentDrawerProps, 'collectionSlug' | 'operation'>
  >,
  // toggler
  React.FC<
    {
      children?: React.ReactNode
    } & Omit<DocumentTogglerProps, 'collectionSlug' | 'operation'>
  >,
  // context
  UseDocumentDrawerContext,
]
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/DocumentDrawer/DrawerHeader/index.scss

```text
@import '../../../scss/styles.scss';

@layer payload-default {
  .doc-drawer {
    &__header {
      width: 100%;
      margin-top: calc(var(--base) * 2);
      display: flex;
      flex-direction: column;
      gap: calc(var(--base) * 0.5);
      border-bottom: 1px solid var(--theme-elevation-100);
      padding-bottom: var(--base);
    }

    &__header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      width: 100%;
    }

    &__header-text {
      margin: 0;
    }

    &__header-toggler {
      background: transparent;
      border: 0;
      margin: 0;
      padding: 0;
      cursor: pointer;
      color: inherit;

      &:focus,
      &:focus-within {
        outline: none;
      }

      &:disabled {
        pointer-events: none;
      }
    }

    &__header-close {
      border: 0;
      background-color: transparent;
      padding: 0;
      cursor: pointer;
      overflow: hidden;
      width: calc(var(--base) * 2);
      height: calc(var(--base) * 2);

      svg {
        width: calc(var(--base) * 2);
        height: calc(var(--base) * 2);
        position: relative;

        .stroke {
          stroke-width: 2px;
          vector-effect: non-scaling-stroke;
        }
      }
    }

    &__after-header {
      padding-top: calc(var(--base) / 4);
    }

    &__divider {
      height: 1px;
      background: var(--theme-elevation-100);
      width: 100%;
    }

    @include mid-break {
      .doc-drawer__header {
        margin-top: calc(var(--base) * 1.5);
        margin-bottom: calc(var(--base) * 0.5);
        padding-left: var(--gutter-h);
        padding-right: var(--gutter-h);
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/DocumentDrawer/DrawerHeader/index.tsx
Signals: React

```typescript
'use client'

import { useCallback } from 'react'

import { Gutter } from '../../../elements/Gutter/index.js'
import { useModal } from '../../../elements/Modal/index.js'
import { RenderTitle } from '../../../elements/RenderTitle/index.js'
import { useFormModified } from '../../../forms/Form/index.js'
import { XIcon } from '../../../icons/X/index.js'
import { useDocumentInfo } from '../../../providers/DocumentInfo/index.js'
import { useDocumentTitle } from '../../../providers/DocumentTitle/index.js'
import { useTranslation } from '../../../providers/Translation/index.js'
import { IDLabel } from '../../IDLabel/index.js'
import { LeaveWithoutSavingModal } from '../../LeaveWithoutSaving/index.js'
import { documentDrawerBaseClass } from '../index.js'
import './index.scss'

const leaveWithoutSavingModalSlug = 'leave-without-saving-doc-drawer'

export const DocumentDrawerHeader: React.FC<{
  AfterHeader?: React.ReactNode
  drawerSlug: string
  showDocumentID?: boolean
}> = ({ AfterHeader, drawerSlug, showDocumentID = true }) => {
  const { closeModal, openModal } = useModal()
  const { t } = useTranslation()
  const isModified = useFormModified()

  const handleOnClose = useCallback(() => {
    if (isModified) {
      openModal(leaveWithoutSavingModalSlug)
    } else {
      closeModal(drawerSlug)
    }
  }, [isModified, openModal, closeModal, drawerSlug])

  return (
    <Gutter className={`${documentDrawerBaseClass}__header`}>
      <div className={`${documentDrawerBaseClass}__header-content`}>
        <h2 className={`${documentDrawerBaseClass}__header-text`}>
          {<RenderTitle element="span" />}
        </h2>
        <button
          aria-label={t('general:close')}
          className={`${documentDrawerBaseClass}__header-close`}
          onClick={handleOnClose}
          type="button"
        >
          <XIcon />
        </button>
      </div>
      {showDocumentID && <DocumentID />}
      {AfterHeader ? (
        <div className={`${documentDrawerBaseClass}__after-header`}>{AfterHeader}</div>
      ) : null}

      <LeaveWithoutSavingModal
        modalSlug={leaveWithoutSavingModalSlug}
        onConfirm={() => closeModal(drawerSlug)}
      />
    </Gutter>
  )
}

const DocumentID: React.FC = () => {
  const { id } = useDocumentInfo()
  const { title } = useDocumentTitle()
  return id && id !== title ? <IDLabel id={id.toString()} /> : null
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/DocumentFields/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .document-fields {
    width: 100%;
    display: flex;
    --doc-sidebar-width: 325px;
    --sidebar-gutter-h-right: var(--gutter-h);
    --sidebar-gutter-h-left: calc(var(--base) * 2);
    --main-gutter-h-left: var(--gutter-h);
    --main-gutter-h-right: calc(var(--base) * 2);

    [dir='rtl'] &:not(&--force-sidebar-wrap) {
      --sidebar-gutter-h-left: var(--gutter-h);
      --sidebar-gutter-h-right: calc(var(--base) * 2);
      --main-gutter-h-left: calc(var(--base) * 2);
      --main-gutter-h-right: var(--gutter-h);
    }

    &--force-sidebar-wrap,
    &:has(.document-fields__sidebar-wrap .document-fields__sidebar-fields > .render-fields:empty) {
      --sidebar-gutter-h-left: var(--gutter-h);
      --sidebar-gutter-h-right: var(--gutter-h);
      --main-gutter-h-left: var(--gutter-h);
      --main-gutter-h-right: var(--gutter-h);
    }

    &--has-sidebar {
      --main-width: 66.66%;
      --main-border: 1px solid var(--theme-elevation-100);
      --main-field-margin: calc(var(--base) * -2);

      &:has(
          .document-fields__sidebar-wrap .document-fields__sidebar-fields > .render-fields:empty
        ) {
        --main-width: 100%;
        --main-border: none;
        --main-field-margin: initial;
      }

      .document-fields {
        &__main {
          width: var(--main-width);
        }

        &__edit {
          padding-left: var(--main-gutter-h-left);
          padding-right: var(--main-gutter-h-right);
          [dir='ltr'] & {
            top: 0;
            right: 0;
            border-right: var(--main-border);
          }

          [dir='rtl'] & {
            top: 0;
            left: 0;
            border-left: var(--main-border);
          }
        }

        &__fields {
          & > .tabs-field,
          & > .group-field {
            margin-right: var(--main-field-margin);
          }
        }
      }
    }

    &__main {
      width: 100%;
      display: flex;
      flex-direction: column;
      min-height: 100%;
      flex-grow: 1;
    }

    &__edit {
      padding-top: calc(var(--base) * 1.5);
      padding-bottom: var(--spacing-view-bottom);
      flex-grow: 1;
    }

    &__sidebar-wrap {
      &:has(.document-fields__sidebar-fields > .render-fields:empty) {
        --sidebar-wrap-width: 0;
        --sidebar-wrap-min-width: 0;
        --sidebar-wrap-position: initial;
        --sidebar-wrap-top: initial;
        --sidebar-wrap-height: initial;
        --sidebar-wrap-flex-shrink: initial;
      }

      position: var(--sidebar-wrap-position, sticky);
      top: var(--sidebar-wrap-top, var(--doc-controls-height));
      width: var(--sidebar-wrap-width, 33.33%);
      height: var(--sidebar-wrap-height, calc(100vh - var(--doc-controls-height)));
      min-width: var(--sidebar-wrap-min-width, var(--doc-sidebar-width));
      flex-shrink: var(--sidebar-wrap-flex-shrink, 0);
    }

    &__sidebar {
      width: 100%;
      height: 100%;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      min-height: 100%;
    }

    &__sidebar-fields {
      display: flex;
      flex-direction: column;
      gap: var(--base);
      padding-top: calc(var(--base) * 1.5);
      padding-left: var(--sidebar-gutter-h-left);
      padding-right: var(--sidebar-gutter-h-right);
      padding-bottom: var(--spacing-view-bottom);
    }

    &__label {
      color: var(--theme-elevation-400);
    }

    &--force-sidebar-wrap {
      display: block;
      isolation: isolate;

      .document-fields {
        &__main {
          width: 100%;
          min-height: initial;
        }

        &__sidebar-wrap {
          position: static;
          width: 100%;
          height: initial;
          border-left: 0;
        }

        &__sidebar {
          padding-bottom: base(3.5);
          overflow: visible;
        }

        &__sidebar-fields {
          padding-top: 0;
          padding-bottom: 0;
        }
      }
    }

    @include mid-break {
      display: block;
      [dir='rtl'] &:not(&--force-sidebar-wrap) {
        --sidebar-gutter-h-left: var(--gutter-h);
        --sidebar-gutter-h-right: var(--gutter-h);
        --main-gutter-h-left: var(--gutter-h);
        --main-gutter-h-right: var(--gutter-h);
      }
      --main-gutter-h-left: var(--gutter-h);
      --main-gutter-h-right: var(--gutter-h);
      --sidebar-gutter-h-left: var(--gutter-h);
      --sidebar-gutter-h-right: var(--gutter-h);

      &--has-sidebar {
        .document-fields {
          &__main {
            width: 100%;
          }

          &__edit {
            [dir='ltr'] & {
              border-right: 0;
            }

            [dir='rtl'] & {
              border-left: 0;
            }
          }

          &__fields {
            & > .tabs-field,
            & > .group-field {
              margin-right: calc(var(--gutter-h) * -1);
            }
          }
        }
      }

      &__main {
        width: 100%;
        min-height: initial;
      }

      &__sidebar-wrap {
        position: static;
        width: 100%;
        height: initial;
        border-left: 0;
      }

      &__form {
        display: block;
      }

      &__sidebar-fields {
        padding-top: 0;
        padding-bottom: 0;
        gap: base(0.5);
      }

      &__sidebar {
        padding-bottom: base(3.5);
        overflow: visible;
      }
    }

    @include small-break {
      &__sidebar-wrap {
        min-width: initial;
        width: 100%;
      }

      &__edit {
        padding-top: calc(var(--base) / 2);
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/DocumentFields/index.tsx
Signals: React

```typescript
'use client'
import type { ClientField, SanitizedDocumentPermissions } from 'payload'

import { fieldIsSidebar } from 'payload/shared'
import React, { useMemo } from 'react'

import { RenderFields } from '../../forms/RenderFields/index.js'
import { Gutter } from '../Gutter/index.js'
import { TrashBanner } from '../TrashBanner/index.js'
import './index.scss'

const baseClass = 'document-fields'

type Args = {
  readonly AfterFields?: React.ReactNode
  readonly BeforeFields?: React.ReactNode
  readonly Description?: React.ReactNode
  readonly docPermissions: SanitizedDocumentPermissions
  readonly fields: ClientField[]
  readonly forceSidebarWrap?: boolean
  readonly isTrashed?: boolean
  readonly readOnly?: boolean
  readonly schemaPathSegments: string[]
}

export const DocumentFields: React.FC<Args> = ({
  AfterFields,
  BeforeFields,
  docPermissions,
  fields,
  forceSidebarWrap,
  isTrashed = false,
  readOnly,
  schemaPathSegments,
}) => {
  const { hasSidebarFields, mainFields, sidebarFields } = useMemo(() => {
    return fields.reduce(
      (acc, field) => {
        if (fieldIsSidebar(field)) {
          acc.sidebarFields.push(field)
          acc.mainFields.push(null)
          acc.hasSidebarFields = true
        } else {
          acc.mainFields.push(field)
          acc.sidebarFields.push(null)
        }
        return acc
      },
      {
        hasSidebarFields: false,
        mainFields: [] as ClientField[],
        sidebarFields: [] as ClientField[],
      },
    )
  }, [fields])

  return (
    <div
      className={[
        baseClass,
        hasSidebarFields ? `${baseClass}--has-sidebar` : `${baseClass}--no-sidebar`,
        forceSidebarWrap && `${baseClass}--force-sidebar-wrap`,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={`${baseClass}__main`}>
        <Gutter className={`${baseClass}__edit`}>
          {isTrashed && <TrashBanner />}
          {BeforeFields}
          <RenderFields
            className={`${baseClass}__fields`}
            fields={mainFields}
            forceRender
            parentIndexPath=""
            parentPath=""
            parentSchemaPath={schemaPathSegments.join('.')}
            permissions={docPermissions?.fields}
            readOnly={readOnly}
          />
          {AfterFields}
        </Gutter>
      </div>
      {hasSidebarFields ? (
        <div className={`${baseClass}__sidebar-wrap`}>
          <div className={`${baseClass}__sidebar`}>
            <div className={`${baseClass}__sidebar-fields`}>
              <RenderFields
                fields={sidebarFields}
                forceRender
                parentIndexPath=""
                parentPath=""
                parentSchemaPath={schemaPathSegments.join('.')}
                permissions={docPermissions?.fields}
                readOnly={readOnly}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/DocumentLocked/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .document-locked {
    @include blur-bg;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    &__wrapper {
      z-index: 1;
      position: relative;
      display: flex;
      flex-direction: column;
      gap: var(--base);
      padding: base(2);
    }

    &__content {
      display: flex;
      flex-direction: column;
      gap: var(--base);
      max-width: base(36);

      > * {
        margin: 0;
      }
    }

    &__controls {
      display: flex;
      gap: var(--base);

      .btn {
        margin: 0;
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/DocumentLocked/index.tsx
Signals: React

```typescript
'use client'
import type { ClientUser } from 'payload'

import React, { useEffect } from 'react'

import { useRouteCache } from '../../providers/RouteCache/index.js'
import { useRouteTransition } from '../../providers/RouteTransition/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { isClientUserObject } from '../../utilities/isClientUserObject.js'
import { Button } from '../Button/index.js'
import { Modal, useModal } from '../Modal/index.js'
import './index.scss'

const modalSlug = 'document-locked'

const baseClass = 'document-locked'

const formatDate = (date) => {
  if (!date) {
    return ''
  }
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    hour: 'numeric',
    hour12: true,
    minute: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export const DocumentLocked: React.FC<{
  handleGoBack: () => void
  isActive: boolean
  onReadOnly: () => void
  onTakeOver: () => void
  updatedAt?: null | number
  user?: ClientUser | number | string
}> = ({ handleGoBack, isActive, onReadOnly, onTakeOver, updatedAt, user }) => {
  const { closeModal, openModal } = useModal()
  const { t } = useTranslation()
  const { clearRouteCache } = useRouteCache()
  const { startRouteTransition } = useRouteTransition()

  useEffect(() => {
    if (isActive) {
      openModal(modalSlug)
    } else {
      closeModal(modalSlug)
    }
  }, [isActive, openModal, closeModal])

  return (
    <Modal
      className={baseClass}
      // Fixes https://github.com/payloadcms/payload/issues/13778
      closeOnBlur={false}
      onClose={() => {
        startRouteTransition(() => handleGoBack())
      }}
      slug={modalSlug}
    >
      <div className={`${baseClass}__wrapper`}>
        <div className={`${baseClass}__content`}>
          <h1>{t('general:documentLocked')}</h1>
          <p>
            <strong>
              {isClientUserObject(user) ? (user.email ?? user.id) : `${t('general:user')}: ${user}`}
            </strong>{' '}
            {t('general:currentlyEditing')}
          </p>
          <p>
            {t('general:editedSince')} <strong>{formatDate(updatedAt)}</strong>
          </p>
        </div>
        <div className={`${baseClass}__controls`}>
          <Button
            buttonStyle="secondary"
            id={`${modalSlug}-go-back`}
            onClick={() => {
              closeModal(modalSlug)
              startRouteTransition(() => handleGoBack())
            }}
            size="large"
          >
            {t('general:goBack')}
          </Button>
          <Button
            buttonStyle="secondary"
            id={`${modalSlug}-view-read-only`}
            onClick={() => {
              onReadOnly()
              closeModal(modalSlug)
              clearRouteCache()
            }}
            size="large"
          >
            {t('general:viewReadOnly')}
          </Button>
          <Button
            buttonStyle="primary"
            id={`${modalSlug}-take-over`}
            onClick={() => {
              onTakeOver()
              closeModal(modalSlug)
            }}
            size="large"
          >
            {t('general:takeOver')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/DocumentTakeOver/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .document-take-over {
    @include blur-bg;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    &__wrapper {
      z-index: 1;
      position: relative;
      display: flex;
      flex-direction: column;
      gap: var(--base);
      padding: base(2);
    }

    &__content {
      display: flex;
      flex-direction: column;
      gap: var(--base);

      > * {
        margin: 0;
      }
    }

    &__controls {
      display: flex;
      gap: var(--base);

      .btn {
        margin: 0;
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/DocumentTakeOver/index.tsx
Signals: React

```typescript
'use client'
import React, { useEffect } from 'react'

import { useRouteCache } from '../../providers/RouteCache/index.js'
import { useRouteTransition } from '../../providers/RouteTransition/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { Button } from '../Button/index.js'
import { Modal, useModal } from '../Modal/index.js'
import './index.scss'

const modalSlug = 'document-take-over'

const baseClass = 'document-take-over'

export const DocumentTakeOver: React.FC<{
  handleBackToDashboard: () => void
  isActive: boolean
  onReadOnly: () => void
}> = ({ handleBackToDashboard, isActive, onReadOnly }) => {
  const { closeModal, openModal } = useModal()
  const { t } = useTranslation()
  const { startRouteTransition } = useRouteTransition()
  const { clearRouteCache } = useRouteCache()

  useEffect(() => {
    if (isActive) {
      openModal(modalSlug)
    } else {
      closeModal(modalSlug)
    }
  }, [isActive, openModal, closeModal])

  return (
    <Modal
      className={baseClass}
      // // Fixes https://github.com/payloadcms/payload/issues/13778
      closeOnBlur={false}
      slug={modalSlug}
    >
      <div className={`${baseClass}__wrapper`}>
        <div className={`${baseClass}__content`}>
          <h1>{t('general:editingTakenOver')}</h1>
          <p>{t('general:anotherUserTakenOver')}</p>
        </div>
        <div className={`${baseClass}__controls`}>
          <Button
            buttonStyle="primary"
            id={`${modalSlug}-back-to-dashboard`}
            onClick={() => {
              startRouteTransition(() => handleBackToDashboard())
            }}
            size="large"
          >
            {t('general:backToDashboard')}
          </Button>
          <Button
            buttonStyle="secondary"
            id={`${modalSlug}-view-read-only`}
            onClick={() => {
              onReadOnly()
              closeModal(modalSlug)
              clearRouteCache()
            }}
            size="large"
          >
            {t('general:viewReadOnly')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/DraggableSortable/index.tsx
Signals: React

```typescript
'use client'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import React, { useCallback, useId } from 'react'

import type { Props } from './types.js'

export { Props }

export const DraggableSortable: React.FC<Props> = (props) => {
  const { children, className, ids, onDragEnd, onDragStart } = props

  const id = useId()

  const { setNodeRef } = useDroppable({
    id,
  })

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      event.activatorEvent.stopPropagation()

      if (!active || !over) {
        return
      }

      if (typeof onDragEnd === 'function') {
        onDragEnd({
          event,
          moveFromIndex: ids.findIndex((_id) => _id === active.id),
          moveToIndex: ids.findIndex((_id) => _id === over.id),
        })
      }
    },
    [onDragEnd, ids],
  )

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event

      if (!active) {
        return
      }

      if (typeof onDragStart === 'function') {
        onDragStart({ id: active.id, event })
      }
    },
    [onDragStart],
  )

  return (
    <DndContext
      collisionDetection={closestCenter}
      id={id}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      sensors={sensors}
    >
      <SortableContext items={ids}>
        <div className={className} ref={setNodeRef}>
          {children}
        </div>
      </SortableContext>
    </DndContext>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/ui/src/elements/DraggableSortable/types.ts
Signals: React

```typescript
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import type { Ref } from 'react'

export type Props = {
  children: React.ReactNode
  className?: string
  droppableRef?: Ref<HTMLElement>
  ids: string[]
  onDragEnd: (e: { event: DragEndEvent; moveFromIndex: number; moveToIndex: number }) => void
  onDragStart?: (e: { event: DragStartEvent; id: number | string }) => void
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/DraggableSortable/DraggableSortableItem/index.tsx
Signals: React

```typescript
'use client'
import type { UseDraggableArguments } from '@dnd-kit/core'

import React, { Fragment } from 'react'

import type { ChildFunction } from './types.js'

import { useDraggableSortable } from '../useDraggableSortable/index.js'

export const DraggableSortableItem: React.FC<
  {
    children: ChildFunction
  } & UseDraggableArguments
> = (props) => {
  const { id, children, disabled } = props

  const { attributes, isDragging, listeners, setNodeRef, transform, transition } =
    useDraggableSortable({
      id,
      disabled,
    })

  return (
    <Fragment>
      {children({
        attributes: {
          ...attributes,
          style: {
            cursor: isDragging ? 'grabbing' : 'grab',
          },
        },
        isDragging,
        listeners,
        setNodeRef,
        transform,
        transition,
      })}
    </Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/ui/src/elements/DraggableSortable/DraggableSortableItem/types.ts
Signals: React

```typescript
import type { UseDraggableArguments } from '@dnd-kit/core'
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'
import type React from 'react'

import type { UseDraggableSortableReturn } from '../useDraggableSortable/types.js'

export type DragHandleProps = {
  attributes: UseDraggableArguments['attributes']
  listeners: SyntheticListenerMap
} & UseDraggableArguments

export type ChildFunction = (args: UseDraggableSortableReturn) => React.ReactNode

export type Props = {
  children: ChildFunction
} & UseDraggableArguments
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/DraggableSortable/useDraggableSortable/index.tsx

```typescript
'use client'
import type { UseDraggableArguments } from '@dnd-kit/core'

import { useSortable } from '@dnd-kit/sortable'

import type { UseDraggableSortableReturn } from './types.js'

export const useDraggableSortable = (props: UseDraggableArguments): UseDraggableSortableReturn => {
  const { id, disabled } = props

  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({
    id,
    disabled,
    transition: {
      duration: 250,
      easing: 'cubic-bezier(0, 0.2, 0.2, 1)',
    },
  })

  return {
    attributes: {
      ...attributes,
      style: {
        cursor: isDragging ? 'grabbing' : 'grab',
        transition,
      },
    },
    isDragging,
    listeners,
    setNodeRef,
    transform: transform && `translate3d(${transform.x}px, ${transform.y}px, 0)`, // translate3d is faster than translate in most browsers
    transition,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/ui/src/elements/DraggableSortable/useDraggableSortable/types.ts
Signals: React

```typescript
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'
import type { HTMLAttributes } from 'react'

export type UseDraggableSortableReturn = {
  readonly attributes: HTMLAttributes<unknown>
  readonly isDragging?: boolean
  readonly listeners: SyntheticListenerMap
  readonly setNodeRef: (node: HTMLElement | null) => void
  readonly transform: string
  readonly transition: string
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/Drawer/index.scss

```text
@import '../../scss/styles.scss';

$transTime: 200;

@layer payload-default {
  .drawer {
    display: flex;
    overflow: hidden;
    position: fixed;
    height: 100vh;

    &__blur-bg {
      @include blur-bg;
      position: absolute;
      z-index: 1;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      opacity: 0;
      transition: all #{$transTime}ms linear;
    }

    &__content {
      opacity: 0;
      transform: translateX(calc(var(--base) * 4));
      position: relative;
      z-index: 2;
      // NOTE: width is controlled by js
      // width: calc(100% - var(--gutter-h));
      overflow: hidden;
      transition: all #{$transTime}ms linear;
      background-color: var(--theme-bg);
    }

    &__content-children {
      position: relative;
      z-index: 1;
      overflow: auto;
      height: 100%;
    }

    &--is-open {
      .drawer {
        &__content,
        &__blur-bg {
          opacity: 1;
        }

        &__close {
          opacity: 0.1;
          transition: opacity #{$transTime}ms linear;
          transition-delay: #{calc($transTime / 2)}ms;
        }

        &__content {
          transform: translateX(0);
        }
      }
    }

    &__close {
      @extend %btn-reset;
      position: relative;
      z-index: 2;
      flex-shrink: 0;
      text-indent: -9999px;
      cursor: pointer;
      opacity: 0;
      will-change: opacity;
      transition: none;
      transition-delay: 0ms;
      flex-grow: 1;
      background: var(--theme-elevation-800);

      &:active,
      &:focus {
        outline: 0;
      }
    }

    &__header {
      display: flex;
      align-items: center;
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
        direction: ltr;
        display: flex;
        align-items: center;
        justify-content: center;
        width: base(1.2);
        height: base(1.2);

        svg {
          margin: base(-1.2);
          width: base(2.4);
          height: base(2.4);

          position: relative;

          .stroke {
            stroke-width: 1px;
            vector-effect: non-scaling-stroke;
          }
        }
      }
    }

    @include mid-break {
      &__header {
        margin-top: base(1.5);
      }
    }
  }

  html[data-theme='dark'] {
    .drawer {
      &__close {
        background: var(--color-base-1000);
      }

      &--is-open {
        .drawer__close {
          opacity: 0.25;
        }
      }
    }
  }
}
```

--------------------------------------------------------------------------------

````
