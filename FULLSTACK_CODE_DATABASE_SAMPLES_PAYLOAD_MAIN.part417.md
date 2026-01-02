---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 417
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 417 of 695)

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
Location: payload-main/packages/ui/src/views/Edit/Auth/index.tsx
Signals: React

```typescript
'use client'

import type { SanitizedFieldPermissions } from 'payload'

import { getFieldPermissions } from 'payload/shared'
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import type { Props } from './types.js'

import { Button } from '../../../elements/Button/index.js'
import { EmailAndUsernameFields } from '../../../elements/EmailAndUsername/index.js'
import { CheckboxField } from '../../../fields/Checkbox/index.js'
import { ConfirmPasswordField } from '../../../fields/ConfirmPassword/index.js'
import { PasswordField } from '../../../fields/Password/index.js'
import { useFormFields, useFormModified } from '../../../forms/Form/context.js'
import { useConfig } from '../../../providers/Config/index.js'
import { useDocumentInfo } from '../../../providers/DocumentInfo/index.js'
import { useTranslation } from '../../../providers/Translation/index.js'
import './index.scss'
import { APIKey } from './APIKey.js'

const baseClass = 'auth-fields'

export const Auth: React.FC<Props> = (props) => {
  const {
    className,
    collectionSlug,
    disableLocalStrategy,
    email,
    loginWithUsername,
    operation,
    readOnly,
    requirePassword,
    setValidateBeforeSubmit,
    useAPIKey,
    username,
    verify,
  } = props

  const [changingPassword, setChangingPassword] = useState(requirePassword)
  const enableAPIKey = useFormFields(([fields]) => (fields && fields?.enableAPIKey) || null)
  const dispatchFields = useFormFields((reducer) => reducer[1])
  const modified = useFormModified()
  const { i18n, t } = useTranslation()
  const { docPermissions, isEditing, isInitializing, isTrashed } = useDocumentInfo()

  const {
    config: {
      routes: { api },
      serverURL,
    },
  } = useConfig()

  let showPasswordFields: SanitizedFieldPermissions = true
  let showUnlock = true
  const hasPasswordFieldOverride =
    typeof docPermissions.fields === 'object' && 'password' in docPermissions.fields
  const hasLoginFieldOverride =
    typeof docPermissions.fields === 'object' &&
    ('username' in docPermissions.fields || 'email' in docPermissions.fields)

  if (hasPasswordFieldOverride) {
    const { permissions: passwordPermissions } = getFieldPermissions({
      field: { name: 'password', type: 'text' },
      operation,
      parentName: '',
      permissions: docPermissions?.fields,
    })

    if (operation === 'create') {
      showPasswordFields =
        passwordPermissions === true ||
        ((typeof passwordPermissions === 'object' &&
          passwordPermissions.create) as SanitizedFieldPermissions)
    } else {
      showPasswordFields =
        passwordPermissions === true ||
        ((typeof passwordPermissions === 'object' &&
          passwordPermissions.update) as SanitizedFieldPermissions)
    }
  }

  if (hasLoginFieldOverride) {
    const hasEmailAndUsernameFields =
      loginWithUsername && (loginWithUsername.requireEmail || loginWithUsername.allowEmailLogin)

    const { operation: emailPermission } = getFieldPermissions({
      field: { name: 'email', type: 'text' },
      operation: 'read',
      parentName: '',
      permissions: docPermissions?.fields,
    })

    const { operation: usernamePermission } = getFieldPermissions({
      field: { name: 'username', type: 'text' },
      operation: 'read',
      parentName: '',
      permissions: docPermissions?.fields,
    })

    if (hasEmailAndUsernameFields) {
      showUnlock = usernamePermission || emailPermission
    } else if (loginWithUsername && !hasEmailAndUsernameFields) {
      showUnlock = usernamePermission
    } else {
      showUnlock = emailPermission
    }
  }

  const enableFields =
    (!disableLocalStrategy ||
      (typeof disableLocalStrategy === 'object' && disableLocalStrategy.enableFields === true)) &&
    (showUnlock || showPasswordFields)

  const disabled = readOnly || isInitializing || isTrashed

  const apiKeyPermissions =
    docPermissions?.fields === true ? true : docPermissions?.fields?.enableAPIKey

  const apiKeyReadOnly =
    readOnly ||
    apiKeyPermissions === true ||
    (apiKeyPermissions && typeof apiKeyPermissions === 'object' && !apiKeyPermissions?.update)

  const enableAPIKeyReadOnly =
    readOnly || (apiKeyPermissions !== true && !apiKeyPermissions?.update)

  const canReadApiKey = apiKeyPermissions === true || apiKeyPermissions?.read

  const hasPermissionToUnlock: boolean = useMemo(() => {
    if (docPermissions) {
      return Boolean('unlock' in docPermissions ? docPermissions.unlock : undefined)
    }

    return false
  }, [docPermissions])

  const handleChangePassword = useCallback(
    (changingPassword: boolean) => {
      if (changingPassword) {
        setValidateBeforeSubmit(true)

        dispatchFields({
          type: 'UPDATE',
          errorMessage: t('validation:required'),
          path: 'password',
          valid: false,
        })

        dispatchFields({
          type: 'UPDATE',
          errorMessage: t('validation:required'),
          path: 'confirm-password',
          valid: false,
        })
      } else {
        setValidateBeforeSubmit(false)
        dispatchFields({ type: 'REMOVE', path: 'password' })
        dispatchFields({ type: 'REMOVE', path: 'confirm-password' })
      }

      setChangingPassword(changingPassword)
    },
    [dispatchFields, t, setValidateBeforeSubmit],
  )

  const unlock = useCallback(async () => {
    const url = `${serverURL}${api}/${collectionSlug}/unlock`
    const response = await fetch(url, {
      body:
        loginWithUsername && username ? JSON.stringify({ username }) : JSON.stringify({ email }),
      credentials: 'include',
      headers: {
        'Accept-Language': i18n.language,
        'Content-Type': 'application/json',
      },
      method: 'post',
    })

    if (response.status === 200) {
      toast.success(t('authentication:successfullyUnlocked'))
    } else {
      toast.error(t('authentication:failedToUnlock'))
    }
  }, [i18n, serverURL, api, collectionSlug, email, username, t, loginWithUsername])

  useEffect(() => {
    if (!modified) {
      setChangingPassword(false)
    }
  }, [modified])

  const showAuthBlock = enableFields
  const showAPIKeyBlock = useAPIKey && canReadApiKey
  const showVerifyBlock = verify && isEditing

  if (!(showAuthBlock || showAPIKeyBlock || showVerifyBlock)) {
    return null
  }

  return (
    <div className={[baseClass, className].filter(Boolean).join(' ')}>
      {enableFields && (
        <React.Fragment>
          <EmailAndUsernameFields
            loginWithUsername={loginWithUsername}
            operation={operation}
            permissions={docPermissions?.fields}
            readOnly={readOnly || isTrashed}
            t={t}
          />
          {(changingPassword || requirePassword) && (!disableLocalStrategy || !enableFields) && (
            <div className={`${baseClass}__changing-password`}>
              <PasswordField
                autoComplete="new-password"
                field={{
                  name: 'password',
                  label: t('authentication:newPassword'),
                  required: true,
                }}
                indexPath=""
                parentPath=""
                parentSchemaPath=""
                path="password"
                schemaPath="password"
              />
              <ConfirmPasswordField disabled={readOnly || isTrashed} />
            </div>
          )}
          <div className={`${baseClass}__controls`}>
            {changingPassword && !requirePassword && (
              <Button
                buttonStyle="secondary"
                disabled={disabled}
                id="cancel-change-password"
                onClick={() => handleChangePassword(false)}
                size="medium"
              >
                {t('general:cancel')}
              </Button>
            )}
            {!changingPassword &&
              !requirePassword &&
              !disableLocalStrategy &&
              showPasswordFields && (
                <Button
                  buttonStyle="secondary"
                  disabled={disabled}
                  id="change-password"
                  onClick={() => handleChangePassword(true)}
                  size="medium"
                >
                  {t('authentication:changePassword')}
                </Button>
              )}
            {!changingPassword && operation === 'update' && hasPermissionToUnlock && (
              <Button
                buttonStyle="secondary"
                disabled={disabled || !showUnlock}
                id="force-unlock"
                onClick={() => void unlock()}
                size="medium"
              >
                {t('authentication:forceUnlock')}
              </Button>
            )}
          </div>
        </React.Fragment>
      )}
      {useAPIKey && (
        <div className={`${baseClass}__api-key`}>
          {canReadApiKey && (
            <Fragment>
              <CheckboxField
                field={{
                  name: 'enableAPIKey',
                  admin: { disabled, readOnly: enableAPIKeyReadOnly },
                  label: t('authentication:enableAPIKey'),
                }}
                path="enableAPIKey"
                schemaPath={`${collectionSlug}.enableAPIKey`}
              />
              <APIKey enabled={!!enableAPIKey?.value} readOnly={apiKeyReadOnly} />
            </Fragment>
          )}
        </div>
      )}
      {verify && isEditing && (
        <CheckboxField
          field={{
            name: '_verified',
            admin: { disabled, readOnly },
            label: t('authentication:verified'),
          }}
          path="_verified"
          schemaPath={`${collectionSlug}._verified`}
        />
      )}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/ui/src/views/Edit/Auth/types.ts

```typescript
import type { SanitizedCollectionConfig } from 'payload'

export type Props = {
  className?: string
  collectionSlug: SanitizedCollectionConfig['slug']
  disableLocalStrategy?: SanitizedCollectionConfig['auth']['disableLocalStrategy']
  email: string
  loginWithUsername: SanitizedCollectionConfig['auth']['loginWithUsername']
  operation: 'create' | 'update'
  readOnly: boolean
  requirePassword?: boolean
  setValidateBeforeSubmit: (validate: boolean) => void
  useAPIKey?: boolean
  username: string
  verify?: boolean
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/views/Edit/SetDocumentStepNav/index.tsx
Signals: React

```typescript
'use client'
import type { SanitizedCollectionConfig, SanitizedGlobalConfig } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import { formatAdminURL } from 'payload/shared'
import { useEffect } from 'react'

import type { StepNavItem } from '../../../elements/StepNav/index.js'

import { useStepNav } from '../../../elements/StepNav/index.js'
import { useConfig } from '../../../providers/Config/index.js'
import { useDocumentInfo } from '../../../providers/DocumentInfo/index.js'
import { useDocumentTitle } from '../../../providers/DocumentTitle/index.js'
import { useEntityVisibility } from '../../../providers/EntityVisibility/index.js'
import { useTranslation } from '../../../providers/Translation/index.js'

export const SetDocumentStepNav: React.FC<{
  collectionSlug?: SanitizedCollectionConfig['slug']
  globalLabel?: SanitizedGlobalConfig['label']
  globalSlug?: SanitizedGlobalConfig['slug']
  id?: number | string
  isTrashed?: boolean
  pluralLabel?: SanitizedCollectionConfig['labels']['plural']
  useAsTitle?: SanitizedCollectionConfig['admin']['useAsTitle']
  view?: string
}> = (props) => {
  const { id, collectionSlug, globalSlug, isTrashed, pluralLabel, useAsTitle } = props

  const view: string | undefined = props?.view || undefined

  const { isEditing, isInitializing } = useDocumentInfo()
  const { title } = useDocumentTitle()

  const { isEntityVisible } = useEntityVisibility()
  const isVisible = isEntityVisible({ collectionSlug, globalSlug })

  const { setStepNav } = useStepNav()

  const { i18n, t } = useTranslation()

  const {
    config: {
      routes: { admin: adminRoute },
      serverURL,
    },
  } = useConfig()

  useEffect(() => {
    const nav: StepNavItem[] = []

    if (!isInitializing) {
      if (collectionSlug) {
        // Collection label
        nav.push({
          label: getTranslation(pluralLabel, i18n),
          url: isVisible
            ? formatAdminURL({
                adminRoute,
                path: `/collections/${collectionSlug}`,
                serverURL,
              })
            : undefined,
        })

        // Trash breadcrumb (if in trash view)
        if (isTrashed) {
          nav.push({
            label: t('general:trash'),
            url: isVisible
              ? formatAdminURL({
                  adminRoute,
                  path: `/collections/${collectionSlug}/trash`,
                  serverURL,
                })
              : undefined,
          })
        }

        // Document label
        if (isEditing) {
          nav.push({
            label: (useAsTitle && useAsTitle !== 'id' && title) || `${id}`,
            url: isVisible
              ? formatAdminURL({
                  adminRoute,
                  path: isTrashed
                    ? `/collections/${collectionSlug}/trash/${id}`
                    : `/collections/${collectionSlug}/${id}`,
                  serverURL,
                })
              : undefined,
          })
        } else {
          nav.push({
            label: t('general:createNew'),
          })
        }
      } else if (globalSlug) {
        nav.push({
          label: title,
          url: isVisible
            ? formatAdminURL({
                adminRoute,
                path: `/globals/${globalSlug}`,
                serverURL,
              })
            : undefined,
        })
      }

      // Fallback view (used for versions, previews, etc.)
      if (view) {
        nav.push({
          label: view,
        })
      }

      setStepNav(nav)
    }
  }, [
    setStepNav,
    isInitializing,
    isEditing,
    pluralLabel,
    id,
    isTrashed,
    useAsTitle,
    adminRoute,
    t,
    i18n,
    title,
    collectionSlug,
    globalSlug,
    serverURL,
    view,
    isVisible,
  ])

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/views/Edit/SetDocumentTitle/index.tsx
Signals: React

```typescript
'use client'
import type { ClientCollectionConfig, ClientConfig, ClientGlobalConfig } from 'payload'

import { useEffect, useRef } from 'react'

import { useFormFields } from '../../../forms/Form/context.js'
import { useDocumentTitle } from '../../../providers/DocumentTitle/index.js'
import { useTranslation } from '../../../providers/Translation/index.js'
import { formatDocTitle } from '../../../utilities/formatDocTitle/index.js'

export const SetDocumentTitle: React.FC<{
  collectionConfig?: ClientCollectionConfig
  config?: ClientConfig
  fallback: string
  globalConfig?: ClientGlobalConfig
}> = (props) => {
  const { collectionConfig, config, fallback, globalConfig } = props

  const useAsTitle = collectionConfig?.admin?.useAsTitle

  const field = useFormFields(([fields]) => (useAsTitle && fields && fields?.[useAsTitle]) || null)

  const hasInitialized = useRef(false)

  const { i18n } = useTranslation()

  const { setDocumentTitle } = useDocumentTitle()

  const dateFormatFromConfig = config?.admin?.dateFormat

  const title = formatDocTitle({
    collectionConfig,
    data: { id: '', [useAsTitle]: field?.value || '' },
    dateFormat: dateFormatFromConfig,
    fallback,
    globalConfig,
    i18n,
  })

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true
      return
    }

    setDocumentTitle(title)
  }, [setDocumentTitle, title])

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/views/List/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .collection-list {
    width: 100%;

    &__wrap {
      padding-bottom: var(--spacing-view-bottom);

      & > *:not(:last-child) {
        margin-bottom: var(--base);
      }
    }

    .list-header {
      a {
        text-decoration: none;
      }
    }

    &__sub-header {
      flex-basis: 100%;
      padding-top: calc(var(--base) * 0.75);
    }

    &__tables {
      .table-wrap:not(:last-child) {
        margin-bottom: calc(var(--base) * 2);
      }

      .table-wrap--group-by:first-child {
        margin-top: calc(var(--base) * 2);
      }
    }

    .table {
      table {
        width: 100%;
        overflow: auto;

        [class^='cell'] > p,
        [class^='cell'] > span,
        [class^='cell'] > a {
          line-clamp: 4;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 4;
          overflow: hidden;
          display: -webkit-box;
          max-width: 100vw;
        }

        #heading-_select,
        .cell-_select {
          min-width: unset;
        }

        #heading-_dragHandle,
        .cell-_dragHandle {
          width: 20px;
          min-width: 0;
        }
      }
    }

    &__no-results {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--base);

      & > * {
        margin: 0;
      }
    }

    &__list-selection {
      position: fixed;
      bottom: 0;
      z-index: 10;
      padding: base(0.8) 0;
      width: 100%;
      background-color: var(--theme-bg);

      .btn {
        margin: 0 0 0 base(0.4);
      }

      .btn {
        background-color: var(--theme-elevation-100);
        cursor: pointer;
        padding: 0 base(0.4);
        border-radius: $style-radius-s;

        &:hover {
          background-color: var(--theme-elevation-200);
        }
      }
    }

    &__list-selection-actions {
      display: flex;
      gap: base(0.25);
    }

    &__shimmer {
      margin-top: base(1.75);
      width: 100%;
      > div {
        margin-top: 8px;
      }
    }

    @include mid-break {
      margin-top: base(0.25);

      &__wrap {
        padding-top: 0;
        padding-bottom: 0;
      }

      &__header {
        gap: base(0.5);
      }

      &__sub-header {
        margin-top: 0;
      }

      &__search-input {
        margin: 0;
      }

      // on mobile, extend the table all the way to the viewport edges
      // this is to visually indicate overflowing content
      .table {
        display: flex;
        flex-direction: column;
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
    }

    @include small-break {
      margin-bottom: base(4);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/views/List/index.tsx
Signals: React, Next.js

```typescript
'use client'

import type { ListViewClientProps } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import { useRouter } from 'next/navigation.js'
import { formatAdminURL, formatFilesize } from 'payload/shared'
import React, { Fragment, useEffect } from 'react'

import { useBulkUpload } from '../../elements/BulkUpload/index.js'
import { Button } from '../../elements/Button/index.js'
import { Gutter } from '../../elements/Gutter/index.js'
import { ListControls } from '../../elements/ListControls/index.js'
import { useListDrawerContext } from '../../elements/ListDrawer/Provider.js'
import { useModal } from '../../elements/Modal/index.js'
import { PageControls } from '../../elements/PageControls/index.js'
import { RenderCustomComponent } from '../../elements/RenderCustomComponent/index.js'
import { SelectMany } from '../../elements/SelectMany/index.js'
import { useStepNav } from '../../elements/StepNav/index.js'
import { StickyToolbar } from '../../elements/StickyToolbar/index.js'
import { RelationshipProvider } from '../../elements/Table/RelationshipProvider/index.js'
import { ViewDescription } from '../../elements/ViewDescription/index.js'
import { useControllableState } from '../../hooks/useControllableState.js'
import { useConfig } from '../../providers/Config/index.js'
import { useListQuery } from '../../providers/ListQuery/index.js'
import { SelectionProvider } from '../../providers/Selection/index.js'
import { TableColumnsProvider } from '../../providers/TableColumns/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { useWindowInfo } from '../../providers/WindowInfo/index.js'
import { ListSelection } from '../../views/List/ListSelection/index.js'
import { CollectionListHeader } from './ListHeader/index.js'
import './index.scss'

const baseClass = 'collection-list'

export function DefaultListView(props: ListViewClientProps) {
  const {
    AfterList,
    AfterListTable,
    beforeActions,
    BeforeList,
    BeforeListTable,
    collectionSlug,
    columnState,
    Description,
    disableBulkDelete,
    disableBulkEdit,
    disableQueryPresets,
    enableRowSelections,
    hasCreatePermission: hasCreatePermissionFromProps,
    hasDeletePermission,
    listMenuItems,
    newDocumentURL,
    queryPreset,
    queryPresetPermissions,
    renderedFilters,
    resolvedFilterOptions,
    Table: InitialTable,
    viewType,
  } = props

  const [Table] = useControllableState(InitialTable)

  const { allowCreate, createNewDrawerSlug, isInDrawer, onBulkSelect } = useListDrawerContext()

  const hasCreatePermission =
    allowCreate !== undefined
      ? allowCreate && hasCreatePermissionFromProps
      : hasCreatePermissionFromProps

  const {
    config: {
      routes: { admin: adminRoute },
      serverURL,
    },
    getEntityConfig,
  } = useConfig()
  const router = useRouter()

  const { data, isGroupingBy } = useListQuery()

  const { openModal } = useModal()
  const { drawerSlug: bulkUploadDrawerSlug, setCollectionSlug, setOnSuccess } = useBulkUpload()

  const collectionConfig = getEntityConfig({ collectionSlug })

  const { labels, upload } = collectionConfig

  const isUploadCollection = Boolean(upload)

  const isBulkUploadEnabled = isUploadCollection && collectionConfig.upload.bulkUpload

  const isTrashEnabled = Boolean(collectionConfig.trash)

  const { i18n } = useTranslation()

  const { setStepNav } = useStepNav()

  const {
    breakpoints: { s: smallBreak },
  } = useWindowInfo()

  const docs = React.useMemo(() => {
    if (isUploadCollection) {
      return data.docs.map((doc) => {
        return {
          ...doc,
          filesize: formatFilesize(doc.filesize),
        }
      })
    } else {
      return data?.docs
    }
  }, [data?.docs, isUploadCollection])

  const openBulkUpload = React.useCallback(() => {
    setCollectionSlug(collectionSlug)
    openModal(bulkUploadDrawerSlug)
    setOnSuccess(() => router.refresh())
  }, [router, collectionSlug, bulkUploadDrawerSlug, openModal, setCollectionSlug, setOnSuccess])

  useEffect(() => {
    if (!isInDrawer) {
      const baseLabel = {
        label: getTranslation(labels?.plural, i18n),
        url:
          isTrashEnabled && viewType === 'trash'
            ? formatAdminURL({
                adminRoute,
                path: `/collections/${collectionSlug}`,
                serverURL,
              })
            : undefined,
      }

      const trashLabel = {
        label: i18n.t('general:trash'),
      }

      const navItems =
        isTrashEnabled && viewType === 'trash' ? [baseLabel, trashLabel] : [baseLabel]

      setStepNav(navItems)
    }
  }, [
    adminRoute,
    setStepNav,
    serverURL,
    labels,
    isInDrawer,
    isTrashEnabled,
    viewType,
    i18n,
    collectionSlug,
  ])

  return (
    <Fragment>
      <TableColumnsProvider collectionSlug={collectionSlug} columnState={columnState}>
        <div className={`${baseClass} ${baseClass}--${collectionSlug}`}>
          <SelectionProvider docs={docs} totalDocs={data?.totalDocs}>
            {BeforeList}
            <Gutter className={`${baseClass}__wrap`}>
              <CollectionListHeader
                collectionConfig={collectionConfig}
                Description={
                  <div className={`${baseClass}__sub-header`}>
                    <RenderCustomComponent
                      CustomComponent={Description}
                      Fallback={
                        <ViewDescription
                          collectionSlug={collectionSlug}
                          description={collectionConfig?.admin?.description}
                        />
                      }
                    />
                  </div>
                }
                disableBulkDelete={disableBulkDelete}
                disableBulkEdit={disableBulkEdit}
                hasCreatePermission={hasCreatePermission}
                hasDeletePermission={hasDeletePermission}
                i18n={i18n}
                isBulkUploadEnabled={isBulkUploadEnabled && !upload.hideFileInputOnCreate}
                isTrashEnabled={isTrashEnabled}
                newDocumentURL={newDocumentURL}
                openBulkUpload={openBulkUpload}
                smallBreak={smallBreak}
                viewType={viewType}
              />
              <ListControls
                beforeActions={
                  enableRowSelections && typeof onBulkSelect === 'function'
                    ? beforeActions
                      ? [...beforeActions, <SelectMany key="select-many" onClick={onBulkSelect} />]
                      : [<SelectMany key="select-many" onClick={onBulkSelect} />]
                    : beforeActions
                }
                collectionConfig={collectionConfig}
                collectionSlug={collectionSlug}
                disableQueryPresets={
                  collectionConfig?.enableQueryPresets !== true || disableQueryPresets
                }
                listMenuItems={listMenuItems}
                queryPreset={queryPreset}
                queryPresetPermissions={queryPresetPermissions}
                renderedFilters={renderedFilters}
                resolvedFilterOptions={resolvedFilterOptions}
              />
              {BeforeListTable}
              {docs?.length > 0 && (
                <div className={`${baseClass}__tables`}>
                  <RelationshipProvider>{Table}</RelationshipProvider>
                </div>
              )}
              {docs?.length === 0 && (
                <div className={`${baseClass}__no-results`}>
                  <p>
                    {i18n.t(viewType === 'trash' ? 'general:noTrashResults' : 'general:noResults', {
                      label: getTranslation(labels?.plural, i18n),
                    })}
                  </p>
                  {hasCreatePermission && newDocumentURL && viewType !== 'trash' && (
                    <Fragment>
                      {isInDrawer ? (
                        <Button el="button" onClick={() => openModal(createNewDrawerSlug)}>
                          {i18n.t('general:createNewLabel', {
                            label: getTranslation(labels?.singular, i18n),
                          })}
                        </Button>
                      ) : (
                        <Button el="link" to={newDocumentURL}>
                          {i18n.t('general:createNewLabel', {
                            label: getTranslation(labels?.singular, i18n),
                          })}
                        </Button>
                      )}
                    </Fragment>
                  )}
                </div>
              )}
              {AfterListTable}
              {docs?.length > 0 && !isGroupingBy && (
                <PageControls
                  AfterPageControls={
                    smallBreak ? (
                      <div className={`${baseClass}__list-selection`}>
                        <ListSelection
                          collectionConfig={collectionConfig}
                          disableBulkDelete={disableBulkDelete}
                          disableBulkEdit={disableBulkEdit}
                          label={getTranslation(collectionConfig.labels.plural, i18n)}
                          showSelectAllAcrossPages={!isGroupingBy}
                        />
                        <div className={`${baseClass}__list-selection-actions`}>
                          {enableRowSelections && typeof onBulkSelect === 'function'
                            ? beforeActions
                              ? [
                                  ...beforeActions,
                                  <SelectMany key="select-many" onClick={onBulkSelect} />,
                                ]
                              : [<SelectMany key="select-many" onClick={onBulkSelect} />]
                            : beforeActions}
                        </div>
                      </div>
                    ) : null
                  }
                  collectionConfig={collectionConfig}
                />
              )}
            </Gutter>
            {AfterList}
          </SelectionProvider>
        </div>
      </TableColumnsProvider>
      {docs?.length > 0 && isGroupingBy && data.totalPages > 1 && (
        <StickyToolbar>
          <PageControls collectionConfig={collectionConfig} />
        </StickyToolbar>
      )}
    </Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/ui/src/views/List/types.ts

```typescript
import type { SanitizedCollectionConfig } from 'payload'

export type DefaultListViewProps = {
  collectionSlug: SanitizedCollectionConfig['slug']
  listSearchableFields: SanitizedCollectionConfig['admin']['listSearchableFields']
}

export type ListIndexProps = {
  collection: SanitizedCollectionConfig
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/views/List/GroupByHeader/index.scss

```text
@import '../../../scss/styles.scss';

@layer payload-default {
  .group-by-header {
    display: flex;
    gap: var(--base);

    &__heading {
      margin: 0;
      flex-grow: 1;
    }

    .list-selection__actions button {
      margin: 0;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/views/List/GroupByHeader/index.tsx
Signals: React

```typescript
import type { ClientCollectionConfig } from 'payload'

import React from 'react'

import { ListSelection } from '../ListSelection/index.js'
import './index.scss'

const baseClass = 'group-by-header'

export const GroupByHeader: React.FC<{
  collectionConfig?: ClientCollectionConfig
  groupByFieldPath: string
  groupByValue: string
  heading: string
}> = ({ collectionConfig, groupByFieldPath, groupByValue, heading }) => {
  return (
    <header className={baseClass}>
      <h4 className={`${baseClass}__heading`} data-group-id={groupByValue}>
        {heading}
      </h4>
      <ListSelection
        collectionConfig={collectionConfig}
        label={heading}
        modalPrefix={groupByValue}
        where={{
          [groupByFieldPath]: {
            equals: groupByValue,
          },
        }}
      />
    </header>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/views/List/ListHeader/index.scss

```text
@import '../../../scss/styles.scss';

@layer payload-default {
  .list-drawer {
    .list-header__title {
      @extend %h2;
    }

    &__header {
      margin-top: base(2.5);
      width: 100%;

      @include mid-break {
        margin-top: base(1.5);
      }
    }

    .doc-drawer__toggler.list-header__create-new-button {
      background: transparent;
      border: 0;
      padding: 0;
      cursor: pointer;
      color: inherit;
      border-radius: var(--style-radius-s);

      &:hover .pill {
        background: var(--theme-elevation-250);
      }

      &:focus:not(:focus-visible),
      &:focus-within:not(:focus-visible) {
        outline: none;
      }

      &:focus-visible {
        outline: var(--accessibility-outline);
        outline-offset: var(--accessibility-outline-offset);
      }

      &:disabled {
        pointer-events: none;
      }

      .pill {
        cursor: inherit;
      }
    }

    &__select-collection-wrap {
      margin-top: base(1);
    }

    @include mid-break {
      .collection-list__header {
        margin-bottom: base(0.5);
      }

      &__select-collection-wrap {
        margin-top: calc(var(--base) / 2);
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/views/List/ListHeader/index.tsx
Signals: React

```typescript
import type { I18nClient, TFunction } from '@payloadcms/translations'
import type { ClientCollectionConfig, ViewTypes } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import React from 'react'

import { CloseModalButton } from '../../../elements/CloseModalButton/index.js'
import { DefaultListViewTabs } from '../../../elements/DefaultListViewTabs/index.js'
import { useListDrawerContext } from '../../../elements/ListDrawer/Provider.js'
import { DrawerRelationshipSelect } from '../../../elements/ListHeader/DrawerRelationshipSelect/index.js'
import { ListDrawerCreateNewDocButton } from '../../../elements/ListHeader/DrawerTitleActions/index.js'
import { ListHeader } from '../../../elements/ListHeader/index.js'
import {
  ListBulkUploadButton,
  ListCreateNewButton,
  ListEmptyTrashButton,
} from '../../../elements/ListHeader/TitleActions/index.js'
import { useConfig } from '../../../providers/Config/index.js'
import { useListQuery } from '../../../providers/ListQuery/index.js'
import { ListSelection } from '../ListSelection/index.js'
import './index.scss'

const drawerBaseClass = 'list-drawer'

export type ListHeaderProps = {
  Actions?: React.ReactNode[]
  className?: string
  collectionConfig: ClientCollectionConfig
  Description?: React.ReactNode
  disableBulkDelete?: boolean
  disableBulkEdit?: boolean
  hasCreatePermission: boolean
  hasDeletePermission?: boolean
  i18n: I18nClient
  isBulkUploadEnabled: boolean
  isTrashEnabled?: boolean
  newDocumentURL: string
  onBulkUploadSuccess?: () => void
  /** @deprecated This prop will be removed in the next major version.
   *
   * Opening of the bulk upload modal is handled internally.
   *
   * Prefer `onBulkUploadSuccess` usage to handle the success of the bulk upload.
   */
  openBulkUpload: () => void
  smallBreak: boolean
  /** @deprecated This prop will be removed in the next major version. */
  t?: TFunction
  TitleActions?: React.ReactNode[]
  viewType?: ViewTypes
}

export const CollectionListHeader: React.FC<ListHeaderProps> = ({
  className,
  collectionConfig,
  Description,
  disableBulkDelete,
  disableBulkEdit,
  hasCreatePermission,
  hasDeletePermission,
  i18n,
  isBulkUploadEnabled,
  isTrashEnabled,
  newDocumentURL,
  onBulkUploadSuccess,
  openBulkUpload,
  smallBreak,
  viewType,
}) => {
  const { config, getEntityConfig } = useConfig()
  const { drawerSlug, isInDrawer, selectedOption } = useListDrawerContext()
  const isTrashRoute = viewType === 'trash'
  const { isGroupingBy } = useListQuery()

  if (isInDrawer) {
    return (
      <ListHeader
        Actions={[
          <CloseModalButton
            className={`${drawerBaseClass}__header-close`}
            key="close-button"
            slug={drawerSlug}
          />,
        ]}
        AfterListHeaderContent={
          <>
            {Description}
            {<DrawerRelationshipSelect />}
          </>
        }
        className={`${drawerBaseClass}__header`}
        title={getTranslation(
          getEntityConfig({ collectionSlug: selectedOption.value })?.labels?.plural,
          i18n,
        )}
        TitleActions={[
          <ListDrawerCreateNewDocButton
            hasCreatePermission={hasCreatePermission}
            key="list-drawer-create-new-doc"
          />,
        ].filter(Boolean)}
      />
    )
  }

  return (
    <ListHeader
      Actions={[
        !smallBreak && !isGroupingBy && (
          <ListSelection
            collectionConfig={collectionConfig}
            disableBulkDelete={disableBulkDelete}
            disableBulkEdit={disableBulkEdit}
            key="list-selection"
            label={getTranslation(collectionConfig?.labels?.plural, i18n)}
            showSelectAllAcrossPages={!isGroupingBy}
            viewType={viewType}
          />
        ),
        <DefaultListViewTabs
          collectionConfig={collectionConfig}
          config={config}
          key="default-list-actions"
          viewType={viewType}
        />,
      ].filter(Boolean)}
      AfterListHeaderContent={Description}
      className={className}
      title={getTranslation(collectionConfig?.labels?.plural, i18n)}
      TitleActions={[
        hasCreatePermission && !isTrashRoute && (
          <ListCreateNewButton
            collectionConfig={collectionConfig}
            hasCreatePermission={hasCreatePermission}
            key="list-header-create-new-doc"
            newDocumentURL={newDocumentURL}
          />
        ),
        hasCreatePermission && isBulkUploadEnabled && !isTrashRoute && (
          <ListBulkUploadButton
            collectionSlug={collectionConfig.slug}
            hasCreatePermission={hasCreatePermission}
            isBulkUploadEnabled={isBulkUploadEnabled}
            key="list-header-bulk-upload"
            onBulkUploadSuccess={onBulkUploadSuccess}
            openBulkUpload={openBulkUpload}
          />
        ),
        hasDeletePermission && isTrashEnabled && viewType === 'trash' && (
          <ListEmptyTrashButton
            collectionConfig={collectionConfig}
            hasDeletePermission={hasDeletePermission}
            key="list-header-empty-trash"
          />
        ),
      ].filter(Boolean)}
    />
  )
}
```

--------------------------------------------------------------------------------

````
