---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 306
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 306 of 695)

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
Location: payload-main/packages/richtext-slate/src/field/elements/upload/Element/index.tsx
Signals: React

```typescript
'use client'

import type { ListDrawerProps } from '@payloadcms/ui'
import type { ClientCollectionConfig } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import {
  Button,
  DrawerToggler,
  File,
  useConfig,
  useDocumentDrawer,
  useDrawerSlug,
  useListDrawer,
  usePayloadAPI,
  useTranslation,
} from '@payloadcms/ui'
import React, { useCallback, useReducer, useState } from 'react'
import { Transforms } from 'slate'
import { ReactEditor, useFocused, useSelected, useSlateStatic } from 'slate-react'

import type { UploadElementType } from '../types.js'

import { useElement } from '../../../providers/ElementProvider.js'
import { EnabledRelationshipsCondition } from '../../EnabledRelationshipsCondition.js'
import { uploadFieldsSchemaPath, uploadName } from '../shared.js'
import { UploadDrawer } from './UploadDrawer/index.js'
import './index.scss'

const baseClass = 'rich-text-upload'

const initialParams = {
  depth: 0,
}

const UploadElementComponent: React.FC<{ enabledCollectionSlugs?: string[] }> = ({
  enabledCollectionSlugs,
}) => {
  const {
    attributes,
    children,
    element: { relationTo, value },
    element,
    fieldProps,
    schemaPath,
  } = useElement<UploadElementType>()

  const {
    config: {
      routes: { api },
      serverURL,
    },
    getEntityConfig,
  } = useConfig()
  const { i18n, t } = useTranslation()
  const [cacheBust, dispatchCacheBust] = useReducer((state) => state + 1, 0)
  const [relatedCollection, setRelatedCollection] = useState<ClientCollectionConfig>(() =>
    getEntityConfig({ collectionSlug: relationTo }),
  )

  const drawerSlug = useDrawerSlug('upload-drawer')

  const [ListDrawer, ListDrawerToggler, { closeDrawer: closeListDrawer }] = useListDrawer({
    collectionSlugs: enabledCollectionSlugs,
    selectedCollection: relatedCollection.slug,
  })

  const [DocumentDrawer, DocumentDrawerToggler, { closeDrawer }] = useDocumentDrawer({
    id: value?.id,
    collectionSlug: relatedCollection.slug,
  })

  const editor = useSlateStatic()
  const selected = useSelected()
  const focused = useFocused()

  // Get the referenced document
  const [{ data }, { setParams }] = usePayloadAPI(
    `${serverURL}${api}/${relatedCollection.slug}/${value?.id}`,
    { initialParams },
  )

  const thumbnailSRC = data?.thumbnailURL || data?.url

  const removeUpload = useCallback(() => {
    const elementPath = ReactEditor.findPath(editor, element)

    Transforms.removeNodes(editor, { at: elementPath })
  }, [editor, element])

  const updateUpload = useCallback(
    (json) => {
      const { doc } = json

      const newNode = {
        fields: doc,
      }

      const elementPath = ReactEditor.findPath(editor, element)

      Transforms.setNodes(editor, newNode, { at: elementPath })

      setParams({
        ...initialParams,
        cacheBust, // do this to get the usePayloadAPI to re-fetch the data even though the URL string hasn't changed
      })

      dispatchCacheBust()
      closeDrawer()
    },
    [editor, element, setParams, cacheBust, closeDrawer],
  )

  const swapUpload = useCallback<NonNullable<ListDrawerProps['onSelect']>>(
    ({ collectionSlug, doc }) => {
      const newNode = {
        type: uploadName,
        children: [{ text: ' ' }],
        relationTo: collectionSlug,
        value: { id: doc.id },
      }

      const elementPath = ReactEditor.findPath(editor, element)

      setRelatedCollection(getEntityConfig({ collectionSlug }))

      Transforms.setNodes(editor, newNode, { at: elementPath })

      dispatchCacheBust()
      closeListDrawer()
    },
    [closeListDrawer, editor, element, getEntityConfig],
  )

  const relatedFieldSchemaPath = `${uploadFieldsSchemaPath}.${relatedCollection.slug}`
  const customFieldsMap = fieldProps.componentMap[relatedFieldSchemaPath]

  return (
    <div
      className={[baseClass, selected && focused && `${baseClass}--selected`]
        .filter(Boolean)
        .join(' ')}
      contentEditable={false}
      {...attributes}
    >
      <div className={`${baseClass}__card`}>
        <div className={`${baseClass}__topRow`}>
          {/* TODO: migrate to use Thumbnail component */}
          <div className={`${baseClass}__thumbnail`}>
            {thumbnailSRC ? <img alt={data?.filename} src={thumbnailSRC} /> : <File />}
          </div>
          <div className={`${baseClass}__topRowRightPanel`}>
            <div className={`${baseClass}__collectionLabel`}>
              {getTranslation(relatedCollection.labels.singular, i18n)}
            </div>
            <div className={`${baseClass}__actions`}>
              {Boolean(customFieldsMap) && (
                <>
                  <DrawerToggler
                    className={`${baseClass}__upload-drawer-toggler`}
                    disabled={fieldProps?.field?.admin?.readOnly}
                    slug={drawerSlug}
                  >
                    <Button
                      buttonStyle="icon-label"
                      el="div"
                      icon="edit"
                      onClick={(e) => {
                        e.preventDefault()
                      }}
                      round
                      tooltip={t('fields:editRelationship')}
                    />
                  </DrawerToggler>
                  <UploadDrawer
                    {...{ drawerSlug, element, fieldProps, relatedCollection, schemaPath }}
                  />
                </>
              )}
              <ListDrawerToggler
                className={`${baseClass}__list-drawer-toggler`}
                disabled={fieldProps?.field?.admin?.readOnly}
              >
                <Button
                  buttonStyle="icon-label"
                  disabled={fieldProps?.field?.admin?.readOnly}
                  el="div"
                  icon="swap"
                  onClick={() => {
                    // do nothing
                  }}
                  round
                  tooltip={t('fields:swapUpload')}
                />
              </ListDrawerToggler>
              <Button
                buttonStyle="icon-label"
                className={`${baseClass}__removeButton`}
                disabled={fieldProps?.field?.admin?.readOnly}
                icon="x"
                onClick={(e) => {
                  e.preventDefault()
                  removeUpload()
                }}
                round
                tooltip={t('fields:removeUpload')}
              />
            </div>
          </div>
        </div>
        <div className={`${baseClass}__bottomRow`}>
          <DocumentDrawerToggler className={`${baseClass}__doc-drawer-toggler`}>
            <strong>{data?.filename}</strong>
          </DocumentDrawerToggler>
        </div>
      </div>
      {children}
      {value?.id && <DocumentDrawer onSave={updateUpload} />}
      <ListDrawer onSelect={swapUpload} />
    </div>
  )
}

export const UploadElement = (props: any): React.ReactNode => {
  return (
    <EnabledRelationshipsCondition {...props} uploads>
      <UploadElementComponent {...props} />
    </EnabledRelationshipsCondition>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/upload/Element/UploadDrawer/index.tsx
Signals: React

```typescript
'use client'

import type { FormProps } from '@payloadcms/ui'
import type { ClientCollectionConfig } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import {
  Drawer,
  EditDepthProvider,
  Form,
  FormSubmit,
  RenderFields,
  useConfig,
  useDocumentInfo,
  useLocale,
  useModal,
  useServerFunctions,
  useTranslation,
} from '@payloadcms/ui'
import { deepCopyObject } from 'payload/shared'
import React, { useCallback, useEffect, useState } from 'react'
import { Transforms } from 'slate'
import { ReactEditor, useSlateStatic } from 'slate-react'

import type { LoadedSlateFieldProps } from '../../../../types.js'
import type { UploadElementType } from '../../types.js'

import { uploadFieldsSchemaPath } from '../../shared.js'

export const UploadDrawer: React.FC<{
  readonly drawerSlug: string
  readonly element: UploadElementType
  readonly fieldProps: LoadedSlateFieldProps
  readonly relatedCollection: ClientCollectionConfig
  readonly schemaPath: string
}> = (props) => {
  const editor = useSlateStatic()

  const { drawerSlug, element, fieldProps, relatedCollection, schemaPath } = props

  const { i18n, t } = useTranslation()
  const { code: locale } = useLocale()
  const { closeModal } = useModal()
  const { id, collectionSlug, getDocPreferences, globalSlug } = useDocumentInfo()

  const { getFormState } = useServerFunctions()

  const [initialState, setInitialState] = useState({})
  const { componentMap } = fieldProps

  const relatedFieldSchemaPath = `${uploadFieldsSchemaPath}.${relatedCollection.slug}`
  const fields = componentMap[relatedFieldSchemaPath]

  const { config } = useConfig()

  const handleUpdateEditData = useCallback(
    (_, data) => {
      const newNode = {
        fields: data,
      }

      const elementPath = ReactEditor.findPath(editor, element)

      Transforms.setNodes(editor, newNode, { at: elementPath })
      closeModal(drawerSlug)
    },
    [closeModal, editor, element, drawerSlug],
  )

  useEffect(() => {
    const data = deepCopyObject(element?.fields || {})

    const awaitInitialState = async () => {
      const { state } = await getFormState({
        id,
        collectionSlug,
        data,
        docPermissions: {
          fields: true,
        },
        docPreferences: await getDocPreferences(),
        globalSlug,
        operation: 'update',
        renderAllFields: true,
        schemaPath: `${schemaPath}.${uploadFieldsSchemaPath}.${relatedCollection.slug}`,
      })

      setInitialState(state)
    }

    void awaitInitialState()
  }, [
    config,
    element?.fields,
    locale,
    t,
    collectionSlug,
    id,
    schemaPath,
    relatedCollection.slug,
    getFormState,
    globalSlug,
    getDocPreferences,
  ])

  const onChange: FormProps['onChange'][0] = useCallback(
    async ({ formState: prevFormState }) => {
      const { state } = await getFormState({
        id,
        collectionSlug,
        docPermissions: {
          fields: true,
        },
        docPreferences: await getDocPreferences(),
        formState: prevFormState,
        globalSlug,
        operation: 'update',
        schemaPath: `${schemaPath}.${uploadFieldsSchemaPath}.${relatedCollection.slug}`,
      })

      return state
    },

    [
      getFormState,
      id,
      collectionSlug,
      getDocPreferences,
      globalSlug,
      schemaPath,
      relatedCollection.slug,
    ],
  )

  return (
    <EditDepthProvider>
      <Drawer
        slug={drawerSlug}
        title={t('general:editLabel', {
          label: getTranslation(relatedCollection.labels.singular, i18n),
        })}
      >
        <Form
          beforeSubmit={[onChange]}
          disableValidationOnSubmit
          initialState={initialState}
          onChange={[onChange]}
          onSubmit={handleUpdateEditData}
        >
          <RenderFields
            fields={Array.isArray(fields) ? fields : []}
            parentIndexPath=""
            parentPath=""
            parentSchemaPath=""
            permissions={true}
            readOnly={false}
          />
          <FormSubmit>{t('fields:saveChanges')}</FormSubmit>
        </Form>
      </Drawer>
    </EditDepthProvider>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/icons/AlignCenter/index.tsx
Signals: React

```typescript
import React from 'react'

export const AlignCenterIcon: React.FC = () => (
  <svg fill="currentColor" height="1em" viewBox="0 0 1024 1024" width="1em">
    <path d="M264 230h496c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H264c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm496 424c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H264c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496zm144 140H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-424H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z" />
  </svg>
)
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/icons/AlignLeft/index.tsx
Signals: React

```typescript
import React from 'react'

export const AlignLeftIcon: React.FC = () => (
  <svg fill="currentColor" height="1em" viewBox="0 0 1024 1024" width="1em">
    <path d="M120 230h496c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm0 424h496c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm784 140H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-424H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z" />
  </svg>
)
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/icons/AlignRight/index.tsx
Signals: React

```typescript
import React from 'react'

export const AlignRightIcon: React.FC = () => (
  <svg fill="currentColor" height="1em" viewBox="0 0 1024 1024" width="1em">
    <path d="M904 158H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 424H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 212H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-424H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z" />
  </svg>
)
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/icons/Blockquote/index.tsx
Signals: React

```typescript
import React from 'react'

export const BlockquoteIcon: React.FC = () => (
  <svg
    aria-hidden="true"
    className="graphic blockquote-icon"
    fill="currentColor"
    focusable="false"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path className="fill" d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </svg>
)
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/icons/Bold/index.tsx
Signals: React

```typescript
import React from 'react'

export const BoldIcon: React.FC = () => (
  <svg
    aria-hidden="true"
    className="graphic bold-icon"
    fill="currentColor"
    focusable="false"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      className="fill"
      d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"
    />
    <path d="M0 0h24v24H0z" fill="none" />
  </svg>
)
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/icons/Code/index.tsx
Signals: React

```typescript
import React from 'react'

export const CodeIcon: React.FC = () => (
  <svg
    aria-hidden="true"
    className="graphic inline-code-icon"
    fill="currentColor"
    focusable="false"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      className="fill"
      d="M7.375 16.781l1.25-1.562L4.601 12l4.024-3.219-1.25-1.562-5 4a1 1 0 000 1.562l5 4zm9.25-9.562l-1.25 1.562L19.399 12l-4.024 3.219 1.25 1.562 5-4a1 1 0 000-1.562l-5-4zM14.976 3.216l-4 18-1.953-.434 4-18z"
    />
  </svg>
)
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/icons/headings/H1/index.tsx
Signals: React

```typescript
import React from 'react'

export const H1Icon: React.FC = () => (
  <svg
    aria-hidden="true"
    className="graphic h1-icon"
    fill="currentColor"
    focusable="false"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path
      className="fill"
      d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2V9h-2V7h4v10z"
    />
  </svg>
)
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/icons/headings/H2/index.tsx
Signals: React

```typescript
import React from 'react'

export const H2Icon: React.FC = () => (
  <svg
    aria-hidden="true"
    className="graphic h2-icon"
    fill="currentColor"
    focusable="false"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path
      className="fill"
      d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 8a2 2 0 01-2 2h-2v2h4v2H9v-4a2 2 0 012-2h2V9H9V7h4a2 2 0 012 2v2z"
    />
  </svg>
)
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/icons/headings/H3/index.tsx
Signals: React

```typescript
import React from 'react'

export const H3Icon: React.FC = () => (
  <svg
    aria-hidden="true"
    className="graphic h3-icon"
    fill="currentColor"
    focusable="false"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M.01 0h24v24h-24z" fill="none" />
    <path
      className="fill"
      d="M19.01 3h-14c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 7.5c0 .83-.67 1.5-1.5 1.5.83 0 1.5.67 1.5 1.5V15a2 2 0 01-2 2h-4v-2h4v-2h-2v-2h2V9h-4V7h4a2 2 0 012 2v1.5z"
    />
  </svg>
)
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/icons/headings/H4/index.tsx
Signals: React

```typescript
import React from 'react'

export const H4Icon: React.FC = () => (
  <svg
    aria-hidden="true"
    className="graphic h4-icon"
    fill="currentColor"
    focusable="false"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path
      className="fill"
      d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 14h-2v-4H9V7h2v4h2V7h2v10z"
    />
  </svg>
)
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/icons/headings/H5/index.tsx
Signals: React

```typescript
import React from 'react'

export const H5Icon: React.FC = () => (
  <svg
    aria-hidden="true"
    className="graphic h5-icon"
    fill="currentColor"
    focusable="false"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path
      className="fill"
      d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 6h-4v2h2a2 2 0 012 2v2a2 2 0 01-2 2H9v-2h4v-2H9V7h6v2z"
    />
  </svg>
)
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/icons/headings/H6/index.tsx
Signals: React

```typescript
import React from 'react'

export const H6Icon: React.FC = () => (
  <svg
    aria-hidden="true"
    className="graphic h6-icon"
    fill="currentColor"
    focusable="false"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path
      className="fill"
      d="M11 15h2v-2h-2v2zm8-12H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 6h-4v2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V9a2 2 0 012-2h4v2z"
    />
  </svg>
)
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/richtext-slate/src/field/icons/IndentLeft/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .icon--indent-left {
    height: $baseline;
    width: $baseline;

    .stroke {
      fill: none;
      stroke: var(--theme-elevation-800);
      stroke-width: $style-stroke-width-m;
    }

    .fill {
      fill: var(--theme-elevation-800);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/icons/IndentLeft/index.tsx
Signals: React

```typescript
import React from 'react'

import './index.scss'

export const IndentLeft: React.FC = () => (
  <svg className="icon icon--indent-left" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
    <path className="fill" d="M16.005 9.61502L21.005 13.1864L21.005 6.04361L16.005 9.61502Z" />
    <rect className="fill" height="2.15625" width="9.0675" x="5" y="5.68199" />
    <rect className="fill" height="2.15625" width="9.0675" x="5" y="11.4738" />
    <rect className="fill" height="2.15625" width="16.005" x="5" y="17.2656" />
  </svg>
)
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/richtext-slate/src/field/icons/IndentRight/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .icon--indent-right {
    height: $baseline;
    width: $baseline;

    .stroke {
      fill: none;
      stroke: var(--theme-elevation-800);
      stroke-width: $style-stroke-width-m;
    }

    .fill {
      fill: var(--theme-elevation-800);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/icons/IndentRight/index.tsx
Signals: React

```typescript
import React from 'react'

import './index.scss'

export const IndentRight: React.FC = () => (
  <svg className="icon icon--indent-right" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
    <path className="fill" d="M10 9.61502L5 6.04361L5 13.1864L10 9.61502Z" />
    <rect className="fill" height="2.15625" width="9.0675" x="11.9375" y="5.68199" />
    <rect className="fill" height="2.15625" width="9.0675" x="11.9375" y="11.4738" />
    <rect className="fill" height="2.15625" width="16.005" x="5" y="17.2656" />
  </svg>
)
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/icons/Italic/index.tsx
Signals: React

```typescript
import React from 'react'

export const ItalicIcon: React.FC = () => (
  <svg
    aria-hidden="true"
    className="graphic italic-icon"
    fill="currentColor"
    focusable="false"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path className="fill" d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z" />
  </svg>
)
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/richtext-slate/src/field/icons/Link/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .icon--link {
    width: $baseline;
    height: $baseline;

    .stroke {
      stroke: var(--theme-elevation-800);
      stroke-width: $style-stroke-width;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/icons/Link/index.tsx
Signals: React

```typescript
import React from 'react'

import './index.scss'

export const LinkIcon: React.FC = () => (
  <svg
    aria-hidden="true"
    className="graphic link icon icon--link"
    fill="currentColor"
    focusable="false"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path
      className="fill"
      d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"
    />
  </svg>
)
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/icons/OrderedList/index.tsx
Signals: React

```typescript
import React from 'react'

export const OLIcon: React.FC = () => (
  <svg
    aria-hidden="true"
    className="graphic ordered-list-icon"
    fill="currentColor"
    focusable="false"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      className="fill"
      d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"
    />
    <path d="M0 0h24v24H0z" fill="none" />
  </svg>
)
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/richtext-slate/src/field/icons/Relationship/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .icon--relationship {
    height: $baseline;
    width: $baseline;

    .stroke {
      fill: none;
      stroke: var(--theme-elevation-800);
      stroke-width: $style-stroke-width-m;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/icons/Relationship/index.tsx
Signals: React

```typescript
import React from 'react'

import './index.scss'

export const RelationshipIcon: React.FC = () => (
  <svg className="icon icon--relationship" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
    <path
      className="stroke"
      d="M19.0597 14.9691L19.0597 19.0946L6.01681 19.0946L6.01681 6.03028L10.0948 6.03028"
      strokeWidth="2"
    />
    <path className="stroke" d="M19.0597 11.0039L19.0597 6.00387L14.0597 6.00387" strokeWidth="2" />
    <line className="stroke" strokeWidth="2" x1="18.7061" x2="13.0493" y1="6.40767" y2="12.0645" />
  </svg>
)
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/icons/Strikethrough/index.tsx
Signals: React

```typescript
import React from 'react'

export const StrikethroughIcon: React.FC = () => (
  <svg
    aria-hidden="true"
    className="graphic strikethrough-icon"
    fill="currentColor"
    focusable="false"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path className="fill" d="M10 19h4v-3h-4v3zM5 4v3h5v3h4V7h5V4H5zM3 14h18v-2H3v2z" />
  </svg>
)
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/icons/Underline/index.tsx
Signals: React

```typescript
import React from 'react'

export const UnderlineIcon: React.FC = () => (
  <svg
    aria-hidden="true"
    className="graphic underline-icon"
    fill="currentColor"
    focusable="false"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path
      className="fill"
      d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"
    />
  </svg>
)
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/icons/UnorderedList/index.tsx
Signals: React

```typescript
import React from 'react'

export const ULIcon: React.FC = () => (
  <svg
    aria-hidden="true"
    className="graphic unordered-list-icon"
    fill="currentColor"
    focusable="false"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      className="fill"
      d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"
    />
    <path d="M0 0h24v24H0V0z" fill="none" />
  </svg>
)
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/richtext-slate/src/field/icons/Upload/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .icon--upload {
    height: $baseline;
    width: $baseline;

    .fill {
      fill: var(--theme-elevation-800);
      stroke: none;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/icons/Upload/index.tsx
Signals: React

```typescript
import React from 'react'

import './index.scss'

export const UploadIcon: React.FC = () => (
  <svg className="icon icon--upload" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
    <path
      className="fill"
      d="M20.06,5.12h-15v15h15Zm-2,2v7L15.37,11l-3.27,4.1-2-1.58-3,3.74V7.12Z"
    />
    <circle className="fill" cx="9.69" cy="9.47" r="0.97" />
  </svg>
)
```

--------------------------------------------------------------------------------

---[FILE: Button.tsx]---
Location: payload-main/packages/richtext-slate/src/field/leaves/Button.tsx
Signals: React

```typescript
'use client'
import React from 'react'
import { useSlate } from 'slate-react'

import '../buttons.scss'
import { isLeafActive } from './isActive.js'
import { toggleLeaf } from './toggle.js'

const baseClass = 'rich-text__button'

export const LeafButton = ({ children, format }) => {
  const editor = useSlate()

  return (
    <button
      className={[baseClass, isLeafActive(editor, format) && `${baseClass}__button--active`]
        .filter(Boolean)
        .join(' ')}
      onMouseDown={(event) => {
        event.preventDefault()
        toggleLeaf(editor, format)
      }}
      type="button"
    >
      {children}
    </button>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/leaves/index.tsx

```typescript
import type { RichTextCustomLeaf } from '../../types.js'

import { bold } from './bold/index.js'
import { code } from './code/index.js'
import { italic } from './italic/index.js'
import { strikethrough } from './strikethrough/index.js'
import { underline } from './underline/index.js'

export const defaultLeaves: Record<string, RichTextCustomLeaf> = {
  bold,
  code,
  italic,
  strikethrough,
  underline,
}
```

--------------------------------------------------------------------------------

---[FILE: isActive.tsx]---
Location: payload-main/packages/richtext-slate/src/field/leaves/isActive.tsx

```typescript
import { Editor } from 'slate'

export const isLeafActive = (editor, format) => {
  const leaves = Editor.marks(editor)
  return leaves ? leaves[format] === true : false
}
```

--------------------------------------------------------------------------------

---[FILE: toggle.tsx]---
Location: payload-main/packages/richtext-slate/src/field/leaves/toggle.tsx

```typescript
import { Editor } from 'slate'

import { isLeafActive } from './isActive.js'

export const toggleLeaf = (editor, format) => {
  const isActive = isLeafActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/leaves/bold/index.tsx

```typescript
import type { RichTextCustomLeaf } from '../../../types.js'

export const bold: RichTextCustomLeaf = {
  name: 'bold',
  Button: '@payloadcms/richtext-slate/client#BoldLeafButton',
  Leaf: '@payloadcms/richtext-slate/client#BoldLeaf',
}
```

--------------------------------------------------------------------------------

---[FILE: LeafButton.tsx]---
Location: payload-main/packages/richtext-slate/src/field/leaves/bold/LeafButton.tsx
Signals: React

```typescript
'use client'
import React from 'react'

import { BoldIcon } from '../../icons/Bold/index.js'
import { LeafButton } from '../Button.js'

export const BoldLeafButton = () => (
  <LeafButton format="bold">
    <BoldIcon />
  </LeafButton>
)
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/leaves/bold/Bold/index.tsx
Signals: React

```typescript
'use client'
import React from 'react'

import { useLeaf } from '../../../providers/LeafProvider.js'

export const BoldLeaf = () => {
  const { attributes, children } = useLeaf()
  return <strong {...attributes}>{children}</strong>
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/leaves/code/index.tsx

```typescript
import type { RichTextCustomLeaf } from '../../../types.js'

export const code: RichTextCustomLeaf = {
  name: 'code',
  Button: '@payloadcms/richtext-slate/client#CodeLeafButton',
  Leaf: '@payloadcms/richtext-slate/client#CodeLeaf',
}
```

--------------------------------------------------------------------------------

---[FILE: LeafButton.tsx]---
Location: payload-main/packages/richtext-slate/src/field/leaves/code/LeafButton.tsx
Signals: React

```typescript
'use client'
import React from 'react'

import { CodeIcon } from '../../icons/Code/index.js'
import { LeafButton } from '../Button.js'

export const CodeLeafButton = () => (
  <LeafButton format="code">
    <CodeIcon />
  </LeafButton>
)
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/leaves/code/Code/index.tsx
Signals: React

```typescript
'use client'
import React from 'react'

import { useLeaf } from '../../../providers/LeafProvider.js'

export const CodeLeaf = () => {
  const { attributes, children } = useLeaf()
  return <code {...attributes}>{children}</code>
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/leaves/italic/index.tsx

```typescript
import type { RichTextCustomLeaf } from '../../../types.js'

export const italic: RichTextCustomLeaf = {
  name: 'italic',
  Button: '@payloadcms/richtext-slate/client#ItalicLeafButton',
  Leaf: '@payloadcms/richtext-slate/client#ItalicLeaf',
}
```

--------------------------------------------------------------------------------

---[FILE: LeafButton.tsx]---
Location: payload-main/packages/richtext-slate/src/field/leaves/italic/LeafButton.tsx
Signals: React

```typescript
'use client'
import React from 'react'

import { ItalicIcon } from '../../icons/Italic/index.js'
import { LeafButton } from '../Button.js'

export const ItalicLeafButton = () => (
  <LeafButton format="italic">
    <ItalicIcon />
  </LeafButton>
)
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/leaves/italic/Italic/index.tsx
Signals: React

```typescript
'use client'
import React from 'react'

import { useLeaf } from '../../../providers/LeafProvider.js'

export const ItalicLeaf = () => {
  const { attributes, children } = useLeaf()
  return <em {...attributes}>{children}</em>
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/leaves/strikethrough/index.tsx

```typescript
import type { RichTextCustomLeaf } from '../../../types.js'

export const strikethrough: RichTextCustomLeaf = {
  name: 'strikethrough',
  Button: '@payloadcms/richtext-slate/client#StrikethroughLeafButton',
  Leaf: '@payloadcms/richtext-slate/client#StrikethroughLeaf',
}
```

--------------------------------------------------------------------------------

---[FILE: LeafButton.tsx]---
Location: payload-main/packages/richtext-slate/src/field/leaves/strikethrough/LeafButton.tsx
Signals: React

```typescript
'use client'
import React from 'react'

import { StrikethroughIcon } from '../../icons/Strikethrough/index.js'
import { LeafButton } from '../Button.js'

export const StrikethroughLeafButton = () => (
  <LeafButton format="strikethrough">
    <StrikethroughIcon />
  </LeafButton>
)
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/leaves/strikethrough/Strikethrough/index.tsx
Signals: React

```typescript
'use client'
import React from 'react'

import { useLeaf } from '../../../providers/LeafProvider.js'

export const StrikethroughLeaf = () => {
  const { attributes, children } = useLeaf()
  return <del {...attributes}>{children}</del>
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/leaves/underline/index.tsx

```typescript
import type { RichTextCustomLeaf } from '../../../types.js'

export const underline: RichTextCustomLeaf = {
  name: 'underline',
  Button: '@payloadcms/richtext-slate/client#UnderlineLeafButton',
  Leaf: '@payloadcms/richtext-slate/client#UnderlineLeaf',
}
```

--------------------------------------------------------------------------------

---[FILE: LeafButton.tsx]---
Location: payload-main/packages/richtext-slate/src/field/leaves/underline/LeafButton.tsx
Signals: React

```typescript
'use client'
import React from 'react'

import { UnderlineIcon } from '../../icons/Underline/index.js'
import { LeafButton } from '../Button.js'

export const UnderlineLeafButton = () => (
  <LeafButton format="underline">
    <UnderlineIcon />
  </LeafButton>
)
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/leaves/underline/Underline/index.tsx
Signals: React

```typescript
'use client'
import React from 'react'

import { useLeaf } from '../../../providers/LeafProvider.js'

export const UnderlineLeaf = () => {
  const { attributes, children } = useLeaf()
  return <u {...attributes}>{children}</u>
}
```

--------------------------------------------------------------------------------

---[FILE: withEnterBreakOut.ts]---
Location: payload-main/packages/richtext-slate/src/field/plugins/withEnterBreakOut.ts

```typescript
const enterBreakOutTypes = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'link']

export const withEnterBreakOut = (editor) => {
  const newEditor = editor
  newEditor.shouldBreakOutOnEnter = (element) => enterBreakOutTypes.includes(String(element.type))
  return newEditor
}
```

--------------------------------------------------------------------------------

````
