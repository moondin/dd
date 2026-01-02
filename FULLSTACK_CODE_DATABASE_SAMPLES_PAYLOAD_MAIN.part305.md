---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 305
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 305 of 695)

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
Location: payload-main/packages/richtext-slate/src/field/elements/link/Element/index.tsx
Signals: React

```typescript
'use client'
import type { FormState } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import {
  Button,
  Popup,
  Translation,
  useConfig,
  useDocumentInfo,
  useDrawerSlug,
  useLocale,
  useModal,
  useServerFunctions,
  useTranslation,
} from '@payloadcms/ui'
import { deepCopyObject, reduceFieldsToValues } from 'payload/shared'
import { useCallback, useEffect, useState } from 'react'
import { Editor, Node, Transforms } from 'slate'
import { ReactEditor, useSlate } from 'slate-react'

import type { LinkElementType } from '../types.js'

import { useElement } from '../../../providers/ElementProvider.js'
import { LinkDrawer } from '../LinkDrawer/index.js'
import { linkFieldsSchemaPath } from '../shared.js'
import { unwrapLink } from '../utilities.js'
import './index.scss'

const baseClass = 'rich-text-link'

/**
 * This function is called when an existing link is edited.
 * When a link is first created, another function is called: {@link ../Button/index.tsx#insertLink}
 */
const insertChange = (editor, fields) => {
  const data = reduceFieldsToValues(fields, true)

  const [, parentPath] = Editor.above(editor)

  const newNode: Record<string, unknown> = {
    doc: data.doc,
    linkType: data.linkType,
    newTab: data.newTab,
    url: data.url,
  }

  if (data.fields) {
    newNode.fields = data.fields
  }

  Transforms.setNodes(editor, newNode, { at: parentPath })

  Transforms.delete(editor, { at: editor.selection.focus.path, unit: 'block' })
  Transforms.move(editor, { distance: 1, unit: 'offset' })
  Transforms.insertText(editor, String(data.text), { at: editor.selection.focus.path })

  ReactEditor.focus(editor)
}

export const LinkElement = () => {
  const { attributes, children, editorRef, element, fieldProps, schemaPath } =
    useElement<LinkElementType>()

  const fieldMapPath = `${schemaPath}.${linkFieldsSchemaPath}`

  const { componentMap } = fieldProps
  const fields = componentMap[linkFieldsSchemaPath]
  const { id, collectionSlug, docPermissions, getDocPreferences, globalSlug } = useDocumentInfo()

  const editor = useSlate()
  const { config, getEntityConfig } = useConfig()
  const { code: locale } = useLocale()
  const { i18n, t } = useTranslation()
  const { closeModal, openModal, toggleModal } = useModal()
  const [renderModal, setRenderModal] = useState(false)
  const [renderPopup, setRenderPopup] = useState(false)
  const [initialState, setInitialState] = useState<FormState>({})

  const { getFormState } = useServerFunctions()

  const drawerSlug = useDrawerSlug('rich-text-link')

  const handleTogglePopup = useCallback((render) => {
    if (!render) {
      setRenderPopup(render)
    }
  }, [])

  useEffect(() => {
    const awaitInitialState = async () => {
      const data = {
        doc: element.doc,
        fields: deepCopyObject(element.fields),
        linkType: element.linkType,
        newTab: element.newTab,
        text: Node.string(element),
        url: element.url,
      }

      const { state } = await getFormState({
        collectionSlug,
        data,
        docPermissions: {
          fields: true,
        },
        docPreferences: await getDocPreferences(),
        globalSlug,
        operation: 'update',
        renderAllFields: true,
        schemaPath: fieldMapPath ?? '',
      })

      setInitialState(state)
    }

    if (renderModal) {
      void awaitInitialState()
    }
  }, [
    renderModal,
    element,
    locale,
    t,
    collectionSlug,
    config,
    id,
    fieldMapPath,
    getFormState,
    globalSlug,
    getDocPreferences,
    docPermissions,
  ])

  return (
    <span className={baseClass} {...attributes}>
      <span contentEditable={false} style={{ userSelect: 'none' }}>
        {renderModal && (
          <LinkDrawer
            drawerSlug={drawerSlug}
            fields={Array.isArray(fields) ? fields : []}
            handleClose={() => {
              toggleModal(drawerSlug)
              setRenderModal(false)
            }}
            handleModalSubmit={(fields) => {
              insertChange(editor, fields)
              closeModal(drawerSlug)
              setRenderModal(false)
            }}
            initialState={initialState}
            schemaPath={schemaPath}
          />
        )}
        <Popup
          boundingRef={editorRef}
          buttonType="none"
          forceOpen={renderPopup}
          horizontalAlign="left"
          onToggleOpen={handleTogglePopup}
          render={() => (
            <div className={`${baseClass}__popup`}>
              {element.linkType === 'internal' && element.doc?.relationTo && element.doc?.value && (
                <Translation
                  elements={{
                    '0': ({ children }) => (
                      <a
                        className={`${baseClass}__link-label`}
                        href={`${config.routes.admin}/collections/${element.doc.relationTo}/${element.doc.value}`}
                        rel="noreferrer"
                        target="_blank"
                        title={`${config.routes.admin}/collections/${element.doc.relationTo}/${element.doc.value}`}
                      >
                        {children}
                      </a>
                    ),
                  }}
                  i18nKey="fields:linkedTo"
                  t={t}
                  variables={{
                    label: getTranslation(
                      getEntityConfig({ collectionSlug: element.doc.relationTo })?.labels?.singular,
                      i18n,
                    ),
                  }}
                />
              )}
              {(element.linkType === 'custom' || !element.linkType) && (
                <a
                  className={`${baseClass}__link-label`}
                  href={element.url}
                  rel="noreferrer"
                  target="_blank"
                  title={element.url}
                >
                  {element.url}
                </a>
              )}
              <Button
                buttonStyle="icon-label"
                className={`${baseClass}__link-edit`}
                icon="edit"
                onClick={(e) => {
                  e.preventDefault()
                  setRenderPopup(false)
                  openModal(drawerSlug)
                  setRenderModal(true)
                }}
                round
                tooltip={t('general:edit')}
              />
              <Button
                buttonStyle="icon-label"
                className={`${baseClass}__link-close`}
                icon="x"
                onClick={(e) => {
                  e.preventDefault()
                  unwrapLink(editor)
                }}
                round
                tooltip={t('general:remove')}
              />
            </div>
          )}
          size="fit-content"
          verticalAlign="bottom"
        />
      </span>
      <span
        className={[`${baseClass}__popup-toggler`].filter(Boolean).join(' ')}
        onClick={() => setRenderPopup(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setRenderPopup(true)
          }
        }}
        role="button"
        tabIndex={0}
      >
        {children}
      </span>
    </span>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: baseFields.ts]---
Location: payload-main/packages/richtext-slate/src/field/elements/link/LinkDrawer/baseFields.ts

```typescript
import type { Field, SanitizedConfig, TypedUser } from 'payload'

export const getBaseFields = (config: SanitizedConfig): Field[] => [
  {
    name: 'text',
    type: 'text',
    label: ({ t }) => t('fields:textToDisplay'),
    required: true,
  },
  {
    name: 'linkType',
    type: 'radio',
    admin: {
      description: ({ t }) => t('fields:chooseBetweenCustomTextOrDocument'),
    },
    defaultValue: 'custom',
    label: ({ t }) => t('fields:linkType'),
    options: [
      {
        label: ({ t }) => t('fields:customURL'),
        value: 'custom',
      },
      {
        label: ({ t }) => t('fields:internalLink'),
        value: 'internal',
      },
    ],
    required: true,
  },
  {
    name: 'url',
    type: 'text',
    admin: {
      condition: ({ linkType }) => linkType !== 'internal',
    },
    label: ({ t }) => t('fields:enterURL'),
    required: true,
  },
  {
    name: 'doc',
    admin: {
      condition: ({ linkType }) => {
        return linkType === 'internal'
      },
    },
    // when admin.hidden is a function we need to dynamically call hidden with the user to know if the collection should be shown
    type: 'relationship',
    filterOptions: ({ relationTo, user }) => {
      const hidden = config.collections.find(({ slug }) => slug === relationTo).admin.hidden
      if (typeof hidden === 'function' && hidden({ user } as { user: TypedUser })) {
        return false
      }
    },
    label: ({ t }) => t('fields:chooseDocumentToLink'),
    relationTo: config.collections
      .filter(({ admin: { enableRichTextLink, hidden } }) => {
        if (typeof hidden !== 'function' && hidden) {
          return false
        }
        return enableRichTextLink
      })
      .map(({ slug }) => slug),
    required: true,
  },
  {
    name: 'newTab',
    type: 'checkbox',
    label: ({ t }) => t('fields:openInNewTab'),
  },
]
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/richtext-slate/src/field/elements/link/LinkDrawer/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .rich-text-link-edit-modal {
    &__template {
      position: relative;
      z-index: 1;
      padding-top: base(1);
      padding-bottom: base(2);
    }

    &__header {
      width: 100%;
      margin-bottom: $baseline;
      display: flex;
      justify-content: space-between;
      margin-top: base(2.5);
      margin-bottom: base(1);

      @include mid-break {
        margin-top: base(1.5);
      }
    }

    &__header-text {
      margin: 0;
    }

    &__header-close {
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
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/link/LinkDrawer/index.tsx
Signals: React

```typescript
'use client'

import type { FormProps } from '@payloadcms/ui'

import {
  Drawer,
  EditDepthProvider,
  Form,
  FormSubmit,
  RenderFields,
  useDocumentInfo,
  useEditDepth,
  useHotkey,
  useServerFunctions,
  useTranslation,
} from '@payloadcms/ui'
import React, { useCallback, useRef } from 'react'

import type { Props } from './types.js'

import { linkFieldsSchemaPath } from '../shared.js'
import './index.scss'

const baseClass = 'rich-text-link-edit-modal'

export const LinkDrawer: React.FC<Props> = ({
  drawerSlug,
  fields,
  handleModalSubmit,
  initialState,
  schemaPath,
}) => {
  const { t } = useTranslation()
  const fieldMapPath = `${schemaPath}.${linkFieldsSchemaPath}`

  const { id, collectionSlug, getDocPreferences, globalSlug } = useDocumentInfo()

  const { getFormState } = useServerFunctions()

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
        schemaPath: fieldMapPath ?? '',
      })

      return state
    },

    [getFormState, id, collectionSlug, getDocPreferences, globalSlug, fieldMapPath],
  )

  return (
    <EditDepthProvider>
      <Drawer className={baseClass} slug={drawerSlug} title={t('fields:editLink')}>
        <Form
          beforeSubmit={[onChange]}
          disableValidationOnSubmit
          initialState={initialState}
          onChange={[onChange]}
          onSubmit={handleModalSubmit}
        >
          <RenderFields
            fields={fields}
            forceRender
            parentIndexPath=""
            parentPath={''}
            parentSchemaPath=""
            permissions={true}
            readOnly={false}
          />
          <LinkSubmit />
        </Form>
      </Drawer>
    </EditDepthProvider>
  )
}

const LinkSubmit: React.FC = () => {
  const { t } = useTranslation()
  const ref = useRef<HTMLButtonElement>(null)
  const editDepth = useEditDepth()

  useHotkey({ cmdCtrlKey: true, editDepth, keyCodes: ['s'] }, (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (ref?.current) {
      ref.current.click()
    }
  })

  return <FormSubmit ref={ref}>{t('general:submit')}</FormSubmit>
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/richtext-slate/src/field/elements/link/LinkDrawer/types.ts

```typescript
import type { ClientField, FormState } from 'payload'

export type Props = {
  readonly drawerSlug: string
  readonly fields: ClientField[]
  readonly handleClose: () => void
  readonly handleModalSubmit: (fields: FormState, data: Record<string, unknown>) => void
  readonly initialState?: FormState
  readonly schemaPath: string
}
```

--------------------------------------------------------------------------------

---[FILE: Button.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/ol/Button.tsx
Signals: React

```typescript
'use client'
import React from 'react'

import { OLIcon } from '../../icons/OrderedList/index.js'
import { ListButton } from '../ListButton.js'

export const OLElementButton = ({ format }: { format: string }) => (
  <ListButton format={format}>
    <OLIcon />
  </ListButton>
)
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/richtext-slate/src/field/elements/ol/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .rich-text-ol {
    &[data-slate-node='element'] {
      margin: base(0.625) 0;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/ol/index.tsx

```typescript
import type { RichTextCustomElement } from '../../../types.js'

const name = 'ol'

export const ol: RichTextCustomElement = {
  name,
  Button: {
    clientProps: {
      format: name,
    },
    path: '@payloadcms/richtext-slate/client#OLElementButton',
  },
  Element: '@payloadcms/richtext-slate/client#OrderedListElement',
}
```

--------------------------------------------------------------------------------

---[FILE: OrderedList.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/ol/OrderedList.tsx
Signals: React

```typescript
'use client'

import React from 'react'

import { useElement } from '../../providers/ElementProvider.js'
import './index.scss'

export const OrderedListElement: React.FC = () => {
  const { attributes, children } = useElement()

  return (
    <ol className="rich-text-ol" {...attributes}>
      {children}
    </ol>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/richtext-slate/src/field/elements/relationship/index.ts

```typescript
import type { RichTextCustomElement } from '../../../types.js'

import { relationshipName } from './shared.js'

export const relationship: RichTextCustomElement = {
  name: relationshipName,
  Button: '@payloadcms/richtext-slate/client#RelationshipButton',
  Element: '@payloadcms/richtext-slate/client#RelationshipElement',
  plugins: ['@payloadcms/richtext-slate/client#WithRelationship'],
}
```

--------------------------------------------------------------------------------

---[FILE: plugin.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/relationship/plugin.tsx
Signals: React

```typescript
'use client'

import type React from 'react'

import { useSlatePlugin } from '../../../utilities/useSlatePlugin.js'
import { relationshipName } from './shared.js'

export const WithRelationship: React.FC = () => {
  useSlatePlugin('withRelationship', (incomingEditor) => {
    const editor = incomingEditor
    const { isVoid } = editor

    editor.isVoid = (element) => (element.type === relationshipName ? true : isVoid(element))

    return editor
  })
  return null
}
```

--------------------------------------------------------------------------------

---[FILE: shared.ts]---
Location: payload-main/packages/richtext-slate/src/field/elements/relationship/shared.ts

```typescript
export const relationshipName = 'relationship'
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/richtext-slate/src/field/elements/relationship/types.ts

```typescript
import type { Element } from 'slate'

export type RelationshipElementType = {
  relationTo: string
  value: {
    id: number | string
  } | null
} & Element
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/richtext-slate/src/field/elements/relationship/Button/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .relationship-rich-text-button {
    display: flex;
    align-items: center;
    height: 100%;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/relationship/Button/index.tsx
Signals: React

```typescript
'use client'
import type { ListDrawerProps } from '@payloadcms/ui'

import { useListDrawer, useTranslation } from '@payloadcms/ui'
import React, { Fragment, useCallback, useState } from 'react'
import { ReactEditor, useSlate } from 'slate-react'

import { RelationshipIcon } from '../../../icons/Relationship/index.js'
import { ElementButton } from '../../Button.js'
import { EnabledRelationshipsCondition } from '../../EnabledRelationshipsCondition.js'
import { injectVoidElement } from '../../injectVoid.js'
import './index.scss'

const baseClass = 'relationship-rich-text-button'

const insertRelationship = (editor, { relationTo, value }) => {
  const text = { text: ' ' }

  const relationship = {
    type: 'relationship',
    children: [text],
    relationTo,
    value,
  }

  injectVoidElement(editor, relationship)

  ReactEditor.focus(editor)
}

type Props = {
  enabledCollectionSlugs: string[]
  path: string
}
const RelationshipButtonComponent: React.FC<Props> = ({ enabledCollectionSlugs }) => {
  const { t } = useTranslation()
  const editor = useSlate()
  const [selectedCollectionSlug] = useState(() => enabledCollectionSlugs[0])
  const [ListDrawer, ListDrawerToggler, { closeDrawer }] = useListDrawer({
    collectionSlugs: enabledCollectionSlugs,
    selectedCollection: selectedCollectionSlug,
  })

  const onSelect = useCallback<NonNullable<ListDrawerProps['onSelect']>>(
    ({ collectionSlug, docID }) => {
      insertRelationship(editor, {
        relationTo: collectionSlug,
        value: {
          id: docID,
        },
      })
      closeDrawer()
    },
    [editor, closeDrawer],
  )

  return (
    <Fragment>
      <ListDrawerToggler>
        <ElementButton
          className={baseClass}
          el="div"
          format="relationship"
          onClick={() => {
            // do nothing
          }}
          tooltip={t('fields:addRelationship')}
        >
          <RelationshipIcon />
        </ElementButton>
      </ListDrawerToggler>
      <ListDrawer onSelect={onSelect} />
    </Fragment>
  )
}

export const RelationshipButton = (props: Props): React.ReactNode => {
  return (
    <EnabledRelationshipsCondition {...props}>
      <RelationshipButtonComponent {...props} />
    </EnabledRelationshipsCondition>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/richtext-slate/src/field/elements/relationship/Element/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .rich-text-relationship {
    @extend %body;
    @include shadow-sm;
    padding: base(0.75);
    display: flex;
    align-items: center;
    background: var(--theme-input-bg);
    border: 1px solid var(--theme-elevation-100);
    max-width: base(15);
    font-family: var(--font-body);

    &:hover {
      border: 1px solid var(--theme-elevation-150);
    }

    &[data-slate-node='element'] {
      margin: base(0.625) 0;
    }

    &__label {
      margin-bottom: base(0.25);
    }

    &__title {
      margin: 0;
    }

    &__label,
    &__title {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      line-height: 1 !important;
    }

    &__title {
      font-weight: bold;
    }

    &__wrap {
      flex-grow: 1;
      overflow: hidden;
    }

    &--selected {
      box-shadow: $focus-box-shadow;
      outline: none;
    }

    .rich-text-relationship__doc-drawer-toggler {
      text-decoration: underline;
      pointer-events: all;
      line-height: inherit;
    }

    &__actions {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      margin-left: base(0.5);

      & > *:not(:last-child) {
        margin-right: base(0.25);
      }
    }

    &__removeButton {
      margin: 0;

      line {
        stroke-width: $style-stroke-width-m;
      }

      &:disabled {
        color: var(--theme-elevation-300);
        pointer-events: none;
      }
    }

    &__doc-drawer-toggler,
    &__list-drawer-toggler {
      & > * {
        margin: 0;
      }

      &:disabled {
        color: var(--theme-elevation-300);
        pointer-events: none;
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/relationship/Element/index.tsx
Signals: React

```typescript
'use client'

import type { ListDrawerProps } from '@payloadcms/ui'

import { getTranslation } from '@payloadcms/translations'
import {
  Button,
  useConfig,
  useDocumentDrawer,
  useListDrawer,
  usePayloadAPI,
  useTranslation,
} from '@payloadcms/ui'
import React, { useCallback, useReducer, useState } from 'react'
import { Transforms } from 'slate'
import { ReactEditor, useFocused, useSelected, useSlateStatic } from 'slate-react'

import type { RelationshipElementType } from '../types.js'

import { useElement } from '../../../providers/ElementProvider.js'
import { EnabledRelationshipsCondition } from '../../EnabledRelationshipsCondition.js'
import './index.scss'

const baseClass = 'rich-text-relationship'

const initialParams = {
  depth: 0,
}

const RelationshipElementComponent: React.FC = () => {
  const {
    attributes,
    children,
    element,
    element: { relationTo, value },
    fieldProps,
  } = useElement<RelationshipElementType>()

  const {
    config: {
      collections,
      routes: { api },
      serverURL,
    },
    getEntityConfig,
  } = useConfig()
  const [enabledCollectionSlugs] = useState(() =>
    collections
      .filter(({ admin: { enableRichTextRelationship } }) => enableRichTextRelationship)
      .map(({ slug }) => slug),
  )
  const [relatedCollection, setRelatedCollection] = useState(() =>
    getEntityConfig({ collectionSlug: relationTo }),
  )

  const selected = useSelected()
  const focused = useFocused()
  const { i18n, t } = useTranslation()
  const editor = useSlateStatic()
  const [cacheBust, dispatchCacheBust] = useReducer((state) => state + 1, 0)
  const [{ data }, { setParams }] = usePayloadAPI(
    `${serverURL}${api}/${relatedCollection.slug}/${value?.id}`,
    { initialParams },
  )

  const [DocumentDrawer, DocumentDrawerToggler, { closeDrawer }] = useDocumentDrawer({
    id: value?.id,
    collectionSlug: relatedCollection.slug,
  })

  const [ListDrawer, ListDrawerToggler, { closeDrawer: closeListDrawer }] = useListDrawer({
    collectionSlugs: enabledCollectionSlugs,
    selectedCollection: relatedCollection.slug,
  })

  const removeRelationship = useCallback(() => {
    const elementPath = ReactEditor.findPath(editor, element)

    Transforms.removeNodes(editor, { at: elementPath })
  }, [editor, element])

  const updateRelationship = React.useCallback(
    ({ doc }) => {
      const elementPath = ReactEditor.findPath(editor, element)

      Transforms.setNodes(
        editor,
        {
          type: 'relationship',
          children: [{ text: ' ' }],
          relationTo: relatedCollection.slug,
          value: { id: doc.id },
        },
        { at: elementPath },
      )

      setParams({
        ...initialParams,
        cacheBust, // do this to get the usePayloadAPI to re-fetch the data even though the URL string hasn't changed
      })

      closeDrawer()
      dispatchCacheBust()
    },
    [editor, element, relatedCollection, cacheBust, setParams, closeDrawer],
  )

  const swapRelationship = useCallback<NonNullable<ListDrawerProps['onSelect']>>(
    ({ collectionSlug, doc }) => {
      const elementPath = ReactEditor.findPath(editor, element)

      Transforms.setNodes(
        editor,
        {
          type: 'relationship',
          children: [{ text: ' ' }],
          relationTo: collectionSlug,
          value: { id: doc.id },
        },
        { at: elementPath },
      )

      setRelatedCollection(getEntityConfig({ collectionSlug }))

      setParams({
        ...initialParams,
        cacheBust, // do this to get the usePayloadAPI to re-fetch the data even though the URL string hasn't changed
      })

      closeListDrawer()
      dispatchCacheBust()
    },
    [closeListDrawer, editor, element, cacheBust, setParams, getEntityConfig],
  )

  return (
    <div
      className={[baseClass, selected && focused && `${baseClass}--selected`]
        .filter(Boolean)
        .join(' ')}
      contentEditable={false}
      {...attributes}
    >
      <div className={`${baseClass}__wrap`}>
        <p className={`${baseClass}__label`}>
          {t('fields:labelRelationship', {
            label: getTranslation(relatedCollection.labels.singular, i18n),
          })}
        </p>
        <DocumentDrawerToggler className={`${baseClass}__doc-drawer-toggler`}>
          <p className={`${baseClass}__title`}>
            {data[relatedCollection?.admin?.useAsTitle || 'id']}
          </p>
        </DocumentDrawerToggler>
      </div>
      <div className={`${baseClass}__actions`}>
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
            tooltip={t('fields:swapRelationship')}
          />
        </ListDrawerToggler>
        <Button
          buttonStyle="icon-label"
          className={`${baseClass}__removeButton`}
          disabled={fieldProps?.field?.admin?.readOnly}
          icon="x"
          onClick={(e) => {
            e.preventDefault()
            removeRelationship()
          }}
          round
          tooltip={t('fields:removeRelationship')}
        />
      </div>
      {value?.id && <DocumentDrawer onSave={updateRelationship} />}
      <ListDrawer onSelect={swapRelationship} />
      {children}
    </div>
  )
}

export const RelationshipElement = (props: any): React.ReactNode => {
  return (
    <EnabledRelationshipsCondition {...props}>
      <RelationshipElementComponent {...props} />
    </EnabledRelationshipsCondition>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: Button.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/textAlign/Button.tsx
Signals: React

```typescript
'use client'
import React from 'react'

import { AlignCenterIcon } from '../../icons/AlignCenter/index.js'
import { AlignLeftIcon } from '../../icons/AlignLeft/index.js'
import { AlignRightIcon } from '../../icons/AlignRight/index.js'
import { ElementButton } from '../Button.js'

export const TextAlignElementButton = () => (
  <React.Fragment>
    <ElementButton format="left" type="textAlign">
      <AlignLeftIcon />
    </ElementButton>
    <ElementButton format="center" type="textAlign">
      <AlignCenterIcon />
    </ElementButton>
    <ElementButton format="right" type="textAlign">
      <AlignRightIcon />
    </ElementButton>
  </React.Fragment>
)
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/textAlign/index.tsx

```typescript
import type { RichTextCustomElement } from '../../../types.js'

export const textAlign: RichTextCustomElement = {
  name: 'alignment',
  Button: '@payloadcms/richtext-slate/client#TextAlignElementButton',
  Element: false,
}
```

--------------------------------------------------------------------------------

---[FILE: Button.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/ul/Button.tsx
Signals: React

```typescript
'use client'
import React from 'react'

import { ULIcon } from '../../icons/UnorderedList/index.js'
import { ListButton } from '../ListButton.js'

export const ULElementButton = ({ format }: { format: string }) => (
  <ListButton format={format}>
    <ULIcon />
  </ListButton>
)
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/richtext-slate/src/field/elements/ul/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .rich-text-ul {
    &[data-slate-node='element'] {
      margin: base(0.625) 0;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/ul/index.tsx

```typescript
import type { RichTextCustomElement } from '../../../types.js'

const name = 'ul'

export const ul: RichTextCustomElement = {
  name,
  Button: {
    clientProps: {
      format: name,
    },
    path: '@payloadcms/richtext-slate/client#ULElementButton',
  },
  Element: '@payloadcms/richtext-slate/client#UnorderedListElement',
}
```

--------------------------------------------------------------------------------

---[FILE: UnorderedList.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/ul/UnorderedList.tsx
Signals: React

```typescript
'use client'

import React from 'react'

import { useElement } from '../../providers/ElementProvider.js'
import './index.scss'

export const UnorderedListElement: React.FC = () => {
  const { attributes, children } = useElement()

  return (
    <ul className="rich-text-ul" {...attributes}>
      {children}
    </ul>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/richtext-slate/src/field/elements/upload/index.ts

```typescript
import type { RichTextCustomElement } from '../../../types.js'

import { uploadName } from './shared.js'

export const upload: RichTextCustomElement = {
  name: uploadName,
  Button: '@payloadcms/richtext-slate/client#UploadElementButton',
  Element: '@payloadcms/richtext-slate/client#UploadElement',
  plugins: ['@payloadcms/richtext-slate/client#WithUpload'],
}
```

--------------------------------------------------------------------------------

---[FILE: plugin.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/upload/plugin.tsx
Signals: React

```typescript
'use client'

import type React from 'react'

import { useSlatePlugin } from '../../../utilities/useSlatePlugin.js'
import { uploadName } from './shared.js'

export const WithUpload: React.FC = () => {
  useSlatePlugin('withUpload', (incomingEditor) => {
    const editor = incomingEditor
    const { isVoid } = editor

    editor.isVoid = (element) => (element.type === uploadName ? true : isVoid(element))

    return editor
  })
  return null
}
```

--------------------------------------------------------------------------------

---[FILE: shared.ts]---
Location: payload-main/packages/richtext-slate/src/field/elements/upload/shared.ts

```typescript
export const uploadName = 'upload'
export const uploadFieldsSchemaPath = 'upload.fields'
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/richtext-slate/src/field/elements/upload/types.ts

```typescript
import type { Element } from 'slate'

export type UploadElementType = {
  fields: Record<string, unknown>
  relationTo: string
  value: {
    id: number | string
  } | null
} & Element
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/richtext-slate/src/field/elements/upload/Button/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .upload-rich-text-button {
    display: flex;
    align-items: center;
    height: 100%;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/upload/Button/index.tsx
Signals: React

```typescript
'use client'

import type { ListDrawerProps } from '@payloadcms/ui'

import { useListDrawer, useTranslation } from '@payloadcms/ui'
import React, { Fragment, useCallback } from 'react'
import { ReactEditor, useSlate } from 'slate-react'

import { UploadIcon } from '../../../icons/Upload/index.js'
import { ElementButton } from '../../Button.js'
import { EnabledRelationshipsCondition } from '../../EnabledRelationshipsCondition.js'
import { injectVoidElement } from '../../injectVoid.js'
import './index.scss'

const baseClass = 'upload-rich-text-button'

const insertUpload = (editor, { relationTo, value }) => {
  const text = { text: ' ' }

  const upload = {
    type: 'upload',
    children: [text],
    relationTo,
    value,
  }

  injectVoidElement(editor, upload)

  ReactEditor.focus(editor)
}

type ButtonProps = {
  enabledCollectionSlugs: string[]
  path: string
}

const UploadButton: React.FC<ButtonProps> = ({ enabledCollectionSlugs }) => {
  const { t } = useTranslation()
  const editor = useSlate()

  const [ListDrawer, ListDrawerToggler, { closeDrawer }] = useListDrawer({
    collectionSlugs: enabledCollectionSlugs,
    uploads: true,
  })

  const onSelect = useCallback<NonNullable<ListDrawerProps['onSelect']>>(
    ({ collectionSlug, doc }) => {
      insertUpload(editor, {
        relationTo: collectionSlug,
        value: {
          id: doc.id,
        },
      })
      closeDrawer()
    },
    [editor, closeDrawer],
  )

  return (
    <Fragment>
      <ListDrawerToggler>
        <ElementButton
          className={baseClass}
          el="div"
          format="upload"
          onClick={() => {
            // do nothing
          }}
          tooltip={t('fields:addUpload')}
        >
          <UploadIcon />
        </ElementButton>
      </ListDrawerToggler>
      <ListDrawer onSelect={onSelect} />
    </Fragment>
  )
}

export const UploadElementButton = (props: ButtonProps): React.ReactNode => {
  return (
    <EnabledRelationshipsCondition {...props} uploads>
      <UploadButton {...props} />
    </EnabledRelationshipsCondition>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/richtext-slate/src/field/elements/upload/Element/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .rich-text-upload {
    @extend %body;
    @include shadow-sm;
    max-width: base(15);
    display: flex;
    align-items: center;
    background: var(--theme-input-bg);
    border: 1px solid var(--theme-elevation-100);
    position: relative;
    font-family: var(--font-body);

    &:hover {
      border: 1px solid var(--theme-elevation-150);
    }

    &[data-slate-node='element'] {
      margin: base(0.625) 0;
    }

    &__card {
      @include soft-shadow-bottom;
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    &__topRow {
      display: flex;
    }

    &__thumbnail {
      width: base(3.25);
      height: auto;
      position: relative;
      overflow: hidden;
      flex-shrink: 0;

      img,
      svg {
        position: absolute;
        object-fit: cover;
        width: 100%;
        height: 100%;
        background-color: var(--theme-elevation-800);
      }
    }

    &__topRowRightPanel {
      flex-grow: 1;
      display: flex;
      align-items: center;
      padding: base(0.75);
      justify-content: space-between;
      max-width: calc(100% - #{base(3.25)});
    }

    &__actions {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      margin-left: base(0.5);

      .rich-text-upload__doc-drawer-toggler {
        pointer-events: all;
      }

      & > *:not(:last-child) {
        margin-right: base(0.25);
      }
    }

    &__removeButton {
      margin: 0;

      line {
        stroke-width: $style-stroke-width-m;
      }

      &:disabled {
        color: var(--theme-elevation-300);
        pointer-events: none;
      }
    }

    &__upload-drawer-toggler {
      background-color: transparent;
      border: none;
      padding: 0;
      margin: 0;
      outline: none;
      line-height: inherit;
    }

    &__doc-drawer-toggler {
      text-decoration: underline;
    }

    &__doc-drawer-toggler,
    &__list-drawer-toggler,
    &__upload-drawer-toggler {
      & > * {
        margin: 0;
      }

      &:disabled {
        color: var(--theme-elevation-300);
        pointer-events: none;
      }
    }

    &__collectionLabel {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &__bottomRow {
      padding: base(0.5);
      border-top: 1px solid var(--theme-elevation-100);
    }

    h5 {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    &__wrap {
      padding: base(0.5) base(0.5) base(0.5) base(1);
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &--selected {
      box-shadow: $focus-box-shadow;
      outline: none;
    }

    @include small-break {
      &__topRowRightPanel {
        padding: base(0.75) base(0.5);
      }
    }
  }
}
```

--------------------------------------------------------------------------------

````
