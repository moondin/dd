---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 300
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 300 of 695)

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

---[FILE: generateImportMap.tsx]---
Location: payload-main/packages/richtext-lexical/src/utilities/generateImportMap.tsx

```typescript
import type { RichTextAdapter } from 'payload'

import { genImportMapIterateFields } from 'payload'

import type { ResolvedServerFeatureMap } from '../features/typesServer.js'
import type { LexicalEditorProps } from '../types.js'

export const getGenerateImportMap =
  (args: {
    lexicalEditorArgs?: LexicalEditorProps
    resolvedFeatureMap: ResolvedServerFeatureMap
  }): RichTextAdapter['generateImportMap'] =>
  ({ addToImportMap, baseDir, config, importMap, imports }) => {
    addToImportMap('@payloadcms/richtext-lexical/rsc#RscEntryLexicalCell')
    addToImportMap('@payloadcms/richtext-lexical/rsc#RscEntryLexicalField')
    addToImportMap('@payloadcms/richtext-lexical/rsc#LexicalDiffComponent')

    for (const resolvedFeature of args.resolvedFeatureMap.values()) {
      if ('componentImports' in resolvedFeature) {
        if (typeof resolvedFeature.componentImports === 'function') {
          resolvedFeature.componentImports({
            addToImportMap,
            baseDir,
            config,
            importMap,
            imports,
          })
        } else if (Array.isArray(resolvedFeature.componentImports)) {
          addToImportMap(resolvedFeature.componentImports)
        } else if (typeof resolvedFeature.componentImports === 'object') {
          addToImportMap(Object.values(resolvedFeature.componentImports))
        }
      }

      addToImportMap(resolvedFeature.ClientFeature)

      /*
       * Now run for all possible sub-fields
       */
      if (resolvedFeature.nodes?.length) {
        for (const node of resolvedFeature.nodes) {
          if (typeof node?.getSubFields !== 'function') {
            continue
          }
          const subFields = node.getSubFields({})
          if (subFields?.length) {
            genImportMapIterateFields({
              addToImportMap,
              baseDir,
              config,
              fields: subFields,
              importMap,
              imports,
            })
          }
        }
      }
    }
  }
```

--------------------------------------------------------------------------------

---[FILE: generateSchemaMap.ts]---
Location: payload-main/packages/richtext-lexical/src/utilities/generateSchemaMap.ts

```typescript
import type { RichTextAdapter } from 'payload'

import { traverseFields } from '@payloadcms/ui/utilities/buildFieldSchemaMap/traverseFields'

import type { ResolvedServerFeatureMap } from '../features/typesServer.js'

export const getGenerateSchemaMap =
  (args: { resolvedFeatureMap: ResolvedServerFeatureMap }): RichTextAdapter['generateSchemaMap'] =>
  ({ config, field, i18n, schemaMap, schemaPath }) => {
    for (const [featureKey, resolvedFeature] of args.resolvedFeatureMap.entries()) {
      if (
        !('generateSchemaMap' in resolvedFeature) ||
        typeof resolvedFeature.generateSchemaMap !== 'function'
      ) {
        continue
      }
      const schemas = resolvedFeature.generateSchemaMap({
        config,
        field,
        i18n,
        props: resolvedFeature.sanitizedServerFeatureProps,
        schemaMap,
        schemaPath,
      })

      if (schemas) {
        for (const [schemaKey, field] of schemas.entries()) {
          if ('fields' in field) {
            // generate schema map entries for sub-fields using traverseFields
            traverseFields({
              config,
              fields: field.fields,
              i18n,
              parentIndexPath: '',
              parentSchemaPath: `${schemaPath}.lexical_internal_feature.${featureKey}.${schemaKey}`,
              schemaMap,
            })
          }

          schemaMap.set(`${schemaPath}.lexical_internal_feature.${featureKey}.${schemaKey}`, field)
        }
      }
    }

    return schemaMap
  }
```

--------------------------------------------------------------------------------

---[FILE: getDefaultSanitizedEditorConfig.ts]---
Location: payload-main/packages/richtext-lexical/src/utilities/getDefaultSanitizedEditorConfig.ts

```typescript
import type { SanitizedConfig } from 'payload'

import { type SanitizedServerEditorConfig } from '../index.js'
import { defaultEditorConfig } from '../lexical/config/server/default.js'
import { sanitizeServerEditorConfig } from '../lexical/config/server/sanitize.js'

let cachedDefaultSanitizedServerEditorConfig:
  | null
  | Promise<SanitizedServerEditorConfig>
  | SanitizedServerEditorConfig = (global as any)
  ._payload_lexical_defaultSanitizedServerEditorConfig

if (!cachedDefaultSanitizedServerEditorConfig) {
  cachedDefaultSanitizedServerEditorConfig = (
    global as any
  )._payload_lexical_defaultSanitizedServerEditorConfig = null
}

export const getDefaultSanitizedEditorConfig = async (args: {
  config: SanitizedConfig
  parentIsLocalized: boolean
}): Promise<SanitizedServerEditorConfig> => {
  const { config, parentIsLocalized } = args

  if (cachedDefaultSanitizedServerEditorConfig) {
    return await cachedDefaultSanitizedServerEditorConfig
  }

  cachedDefaultSanitizedServerEditorConfig = sanitizeServerEditorConfig(
    defaultEditorConfig,
    config,
    parentIsLocalized,
  )
  ;(global as any).payload_lexical_defaultSanitizedServerEditorConfig =
    cachedDefaultSanitizedServerEditorConfig

  cachedDefaultSanitizedServerEditorConfig = await cachedDefaultSanitizedServerEditorConfig
  ;(global as any).payload_lexical_defaultSanitizedServerEditorConfig =
    cachedDefaultSanitizedServerEditorConfig

  return cachedDefaultSanitizedServerEditorConfig
}
```

--------------------------------------------------------------------------------

---[FILE: initLexicalFeatures.ts]---
Location: payload-main/packages/richtext-lexical/src/utilities/initLexicalFeatures.ts

```typescript
import type { I18nClient } from '@payloadcms/translations'

import { type ClientFieldSchemaMap, type FieldSchemaMap, type Payload } from 'payload'
import { getFromImportMap } from 'payload/shared'

import type {
  BaseClientFeatureProps,
  FeatureProviderProviderClient,
} from '../features/typesClient.js'
import type { SanitizedServerEditorConfig } from '../lexical/config/types.js'
import type { FeatureClientSchemaMap, LexicalRichTextFieldProps } from '../types.js'
type Args = {
  clientFieldSchemaMap: ClientFieldSchemaMap
  fieldSchemaMap: FieldSchemaMap
  i18n: I18nClient
  path: string
  payload: Payload
  sanitizedEditorConfig: SanitizedServerEditorConfig
  schemaPath: string
}

export function initLexicalFeatures(args: Args): {
  clientFeatures: LexicalRichTextFieldProps['clientFeatures']
  featureClientImportMap: Record<string, any>
  featureClientSchemaMap: FeatureClientSchemaMap
} {
  const clientFeatures: LexicalRichTextFieldProps['clientFeatures'] = {}

  // turn args.resolvedFeatureMap into an array of [key, value] pairs, ordered by value.order, lowest order first:
  const resolvedFeatureMapArray = [...args.sanitizedEditorConfig.resolvedFeatureMap].sort(
    (a, b) => a[1].order - b[1].order,
  )

  const featureClientSchemaMap: FeatureClientSchemaMap = {}

  /**
   * All modules added to the import map, keyed by the provided key, if feature.componentImports with type object is used
   */
  const featureClientImportMap: Record<string, any> | undefined = {}

  for (const [featureKey, resolvedFeature] of resolvedFeatureMapArray) {
    clientFeatures[featureKey] = {}

    /**
     * Handle client features
     */
    const ClientFeaturePayloadComponent = resolvedFeature.ClientFeature

    if (ClientFeaturePayloadComponent) {
      const clientFeatureProvider = getFromImportMap<FeatureProviderProviderClient>({
        importMap: args.payload.importMap,
        PayloadComponent: ClientFeaturePayloadComponent,
        schemaPath: 'lexical-clientComponent',
        silent: true,
      })

      if (!clientFeatureProvider) {
        continue
      }

      const clientFeatureProps: BaseClientFeatureProps<Record<string, any>> =
        resolvedFeature.clientFeatureProps ?? {}
      clientFeatureProps.featureKey = resolvedFeature.key
      clientFeatureProps.order = resolvedFeature.order
      if (
        typeof ClientFeaturePayloadComponent === 'object' &&
        ClientFeaturePayloadComponent.clientProps
      ) {
        clientFeatureProps.clientProps = ClientFeaturePayloadComponent.clientProps
      }
      // As clientFeatureProvider is a client function, we cannot execute it on the server here. Thus, the client will have to execute clientFeatureProvider with its props
      clientFeatures[featureKey] = { clientFeatureProps, clientFeatureProvider }
    }

    /**
     * Handle sub-fields (formstate of those)
     */
    // The args.fieldSchemaMap generated before in buildFormState should contain all of lexical features' sub-field schemas
    // as well, as it already called feature.generateSchemaMap for each feature.
    // We will check for the existance resolvedFeature.generateSchemaMap to skip unnecessary loops for constructing featureSchemaMap, but we don't run it here
    if (resolvedFeature.generateSchemaMap) {
      const featureSchemaPath = `${args.schemaPath}.lexical_internal_feature.${featureKey}`

      featureClientSchemaMap[featureKey] = {}

      // Like args.fieldSchemaMap, we only want to include the sub-fields of the current feature
      for (const [key, entry] of args.clientFieldSchemaMap.entries()) {
        if (key.startsWith(featureSchemaPath)) {
          featureClientSchemaMap[featureKey][key] = 'fields' in entry ? entry.fields : [entry]
        }
      }
    }

    if (
      resolvedFeature.componentImports &&
      typeof resolvedFeature.componentImports === 'object' &&
      !Array.isArray(resolvedFeature.componentImports)
    ) {
      for (const [key, payloadComponent] of Object.entries(resolvedFeature.componentImports)) {
        const resolvedComponent = getFromImportMap({
          importMap: args.payload.importMap,
          PayloadComponent: payloadComponent,
          schemaPath: 'lexical-clientComponent',
          silent: true,
        })

        featureClientImportMap[`${resolvedFeature.key}.${key}`] = resolvedComponent
      }
    }
  }
  return {
    clientFeatures,
    featureClientImportMap,
    featureClientSchemaMap,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: recurseNodeTree.ts]---
Location: payload-main/packages/richtext-lexical/src/utilities/recurseNodeTree.ts

```typescript
import type { SerializedLexicalNode } from 'lexical'

// Initialize both flattenedNodes and nodeIDMap
export const recurseNodeTree = ({
  flattenedNodes,
  nodeIDMap,
  nodes,
}: {
  flattenedNodes?: SerializedLexicalNode[]
  nodeIDMap?: {
    [key: string]: SerializedLexicalNode
  }
  nodes: SerializedLexicalNode[]
}): void => {
  if (!nodes?.length) {
    return
  }

  for (const node of nodes) {
    if (flattenedNodes) {
      flattenedNodes.push(node)
    }
    if (nodeIDMap) {
      if (node && 'id' in node && node.id) {
        nodeIDMap[node.id as string] = node
      } else if (
        'fields' in node &&
        typeof node.fields === 'object' &&
        node.fields &&
        'id' in node.fields &&
        node?.fields?.id
      ) {
        nodeIDMap[node.fields.id as string] = node
      }
    }

    if ('children' in node && Array.isArray(node?.children) && node?.children?.length) {
      recurseNodeTree({
        flattenedNodes,
        nodeIDMap,
        nodes: node.children as SerializedLexicalNode[],
      })
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: useLexicalFeature.tsx]---
Location: payload-main/packages/richtext-lexical/src/utilities/useLexicalFeature.tsx

```typescript
'use client'

import { useAddClientFunction } from '@payloadcms/ui'

import type { FeatureProviderClient } from '../features/typesClient.js'

import { useEditorConfigContext } from '../lexical/config/client/EditorConfigProvider.js'

export const useLexicalFeature = <ClientFeatureProps,>(
  featureKey: string,
  feature: FeatureProviderClient<ClientFeatureProps>,
) => {
  const {
    fieldProps: { schemaPath: schemaPathFromFieldProps },
  } = useEditorConfigContext()
  const tableCell = { cellProps: { schemaPath: [] } } // TODO: get tableCell from props
  // const tableCell = useTableCell()

  const schemaPathFromCellProps = tableCell?.cellProps?.schemaPath
    ? tableCell?.cellProps?.schemaPath.join('.')
    : null

  const schemaPath = schemaPathFromCellProps || schemaPathFromFieldProps // schemaPathFromCellProps needs to have priority, as there can be cells within fields (e.g. list drawers) and the cell schemaPath needs to be used there - not the parent field schemaPath. There cannot be fields within cells.

  useAddClientFunction(`lexicalFeature.${schemaPath}.${featureKey}`, feature)
}
```

--------------------------------------------------------------------------------

---[FILE: useRunDeprioritized.ts]---
Location: payload-main/packages/richtext-lexical/src/utilities/useRunDeprioritized.ts
Signals: React

```typescript
'use client'
import { useCallback, useRef } from 'react'

/**
 * Simple hook that lets you run any callback once the main thread is idle
 * (via `requestIdleCallback`) or when that API is missing (Safari) - after the
 * next animation frame (`interactionResponse`).
 *
 * This will help you to avoid blocking the main thread with heavy work.
 *
 * The latest invocation wins: if a new run is queued before the previous one
 * executes, the previous task is cancelled.
 *
 * Usage:
 * ```ts
 * const runDeprioritized = useRunDeprioritized();
 *
 * const onEditorChange = (state: EditorState) => {
 *   runDeprioritized(() => {
 *     // heavy work here …
 *   });
 * };
 * ```
 *
 * @param timeout  Optional timeout (ms) for `requestIdleCallback`; defaults to 500 ms.
 * @returns        A `runDeprioritized(fn)` helper.
 */

export function useRunDeprioritized(timeout = 500) {
  const idleHandleRef = useRef<number>(undefined)

  /**
   * Schedule `fn` and resolve when it has executed.
   */
  const runDeprioritized = useCallback(
    (fn: () => void): Promise<void> => {
      return new Promise<void>((resolve) => {
        const exec = () => {
          fn()
          resolve()
        }

        if ('requestIdleCallback' in window) {
          // Cancel any previously queued task so only the latest runs.
          if ('cancelIdleCallback' in window && idleHandleRef.current !== undefined) {
            // Cancel earlier scheduled value updates,
            // so that a CPU-limited event loop isn't flooded with n callbacks for n keystrokes into the rich text field,
            // but that there's only ever the latest one state update
            // dispatch task, to be executed with the next idle time,
            // or the deadline of 500ms.
            cancelIdleCallback(idleHandleRef.current)
          }
          // Schedule the state update to happen the next time the browser has sufficient resources,
          // or the latest after 500ms.
          idleHandleRef.current = requestIdleCallback(exec, { timeout })
        } else {
          // Safari fallback: rAF + setTimeout shim.
          void interactionResponse().then(exec)
        }
      })
    },
    [timeout],
  )

  return runDeprioritized
}

function interactionResponse(): Promise<unknown> {
  // Taken from https://github.com/vercel-labs/await-interaction-response/tree/main/packages/await-interaction-response/src

  return new Promise((resolve) => {
    setTimeout(resolve, 100) // Fallback for the case where the animation frame never fires.
    requestAnimationFrame(() => {
      setTimeout(resolve, 0)
    })
  })
}
```

--------------------------------------------------------------------------------

---[FILE: Drawer.tsx]---
Location: payload-main/packages/richtext-lexical/src/utilities/fieldsDrawer/Drawer.tsx
Signals: React

```typescript
'use client'
import type { ClientField, Data, FormState, JsonObject } from 'payload'

import { Drawer, EditDepthProvider, useModal } from '@payloadcms/ui'
import React from 'react'

import { DrawerContent } from './DrawerContent.js'

export type FieldsDrawerProps = {
  readonly className?: string
  readonly data?: Data
  readonly drawerSlug: string
  readonly drawerTitle?: string
  readonly featureKey: string
  readonly fieldMapOverride?: ClientField[]
  readonly handleDrawerSubmit: (fields: FormState, data: JsonObject) => void
  readonly schemaFieldsPathOverride?: string
  readonly schemaPath: string
  readonly schemaPathSuffix?: string
}

/**
 * This FieldsDrawer component can be used to easily create a Drawer that contains a form with fields within your feature.
 * The fields are taken directly from the schema map based on your `featureKey` and `schemaPathSuffix`. Thus, this can only
 * be used if you provide your field schema inside the `generateSchemaMap` prop of your feature.server.ts.
 */
export const FieldsDrawer: React.FC<FieldsDrawerProps> = ({
  className,
  data,
  drawerSlug,
  drawerTitle,
  featureKey,
  fieldMapOverride,
  handleDrawerSubmit,
  schemaFieldsPathOverride,
  schemaPath,
  schemaPathSuffix,
}) => {
  const { closeModal } = useModal()
  // The Drawer only renders its children (and itself) if it's open. Thus, by extracting the main content
  // to DrawerContent, this should be faster
  return (
    <EditDepthProvider>
      <Drawer className={className} slug={drawerSlug} title={drawerTitle ?? ''}>
        <DrawerContent
          data={data}
          featureKey={featureKey}
          fieldMapOverride={fieldMapOverride}
          handleDrawerSubmit={(args, args2) => {
            // Simply close drawer - no need for useLexicalDrawer here as at this point,
            // we don't need to restore the cursor position. This is handled by the useEffect in useLexicalDrawer.
            closeModal(drawerSlug)

            // Actual drawer submit logic needs to be triggered after the drawer is closed.
            // That's because the lexical selection / cursor restore logic that is striggerer by
            // `useLexicalDrawer` neeeds to be triggered before any editor.update calls that may happen
            // in the `handleDrawerSubmit` function.
            setTimeout(() => {
              handleDrawerSubmit(args, args2)
            }, 1)
          }}
          schemaFieldsPathOverride={schemaFieldsPathOverride}
          schemaPath={schemaPath}
          schemaPathSuffix={schemaPathSuffix}
        />
      </Drawer>
    </EditDepthProvider>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: DrawerContent.tsx]---
Location: payload-main/packages/richtext-lexical/src/utilities/fieldsDrawer/DrawerContent.tsx
Signals: React

```typescript
'use client'
import type { FormState } from 'payload'

import { useLexicalEditable } from '@lexical/react/useLexicalEditable'
import {
  Form,
  FormSubmit,
  RenderFields,
  useDocumentForm,
  useDocumentInfo,
  useServerFunctions,
  useTranslation,
} from '@payloadcms/ui'
import { abortAndIgnore } from '@payloadcms/ui/shared'
import { deepCopyObjectSimpleWithoutReactComponents } from 'payload/shared'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'

import type { FieldsDrawerProps } from './Drawer.js'

import { useEditorConfigContext } from '../../lexical/config/client/EditorConfigProvider.js'

export const DrawerContent: React.FC<Omit<FieldsDrawerProps, 'drawerSlug' | 'drawerTitle'>> = ({
  data,
  featureKey,
  fieldMapOverride,
  handleDrawerSubmit,
  schemaFieldsPathOverride,
  schemaPath,
  schemaPathSuffix,
}) => {
  const { t } = useTranslation()
  const { id, collectionSlug, getDocPreferences, globalSlug } = useDocumentInfo()
  const { fields: parentDocumentFields } = useDocumentForm()
  const isEditable = useLexicalEditable()

  const onChangeAbortControllerRef = useRef(new AbortController())

  const [initialState, setInitialState] = useState<false | FormState | undefined>(false)

  const {
    fieldProps: { featureClientSchemaMap },
  } = useEditorConfigContext()

  const { getFormState } = useServerFunctions()

  const schemaFieldsPath =
    schemaFieldsPathOverride ??
    `${schemaPath}.lexical_internal_feature.${featureKey}${schemaPathSuffix ? `.${schemaPathSuffix}` : ''}`

  const fields: any = fieldMapOverride ?? featureClientSchemaMap[featureKey]?.[schemaFieldsPath] // Field Schema

  useEffect(() => {
    const controller = new AbortController()

    const awaitInitialState = async () => {
      const { state } = await getFormState({
        id,
        collectionSlug,
        data: data ?? {},
        docPermissions: {
          fields: true,
        },
        docPreferences: await getDocPreferences(),
        documentFormState: deepCopyObjectSimpleWithoutReactComponents(parentDocumentFields),
        globalSlug,
        initialBlockData: data,
        operation: 'update',
        readOnly: !isEditable,
        renderAllFields: true,
        schemaPath: schemaFieldsPath,
        signal: controller.signal,
      })

      setInitialState(state)
    }

    void awaitInitialState()

    return () => {
      abortAndIgnore(controller)
    }
  }, [
    schemaFieldsPath,
    id,
    data,
    getFormState,
    collectionSlug,
    isEditable,
    globalSlug,
    getDocPreferences,
    parentDocumentFields,
  ])

  const onChange = useCallback(
    async ({ formState: prevFormState }: { formState: FormState }) => {
      abortAndIgnore(onChangeAbortControllerRef.current)

      const controller = new AbortController()
      onChangeAbortControllerRef.current = controller

      const { state } = await getFormState({
        id,
        collectionSlug,
        docPermissions: {
          fields: true,
        },
        docPreferences: await getDocPreferences(),
        documentFormState: deepCopyObjectSimpleWithoutReactComponents(parentDocumentFields),
        formState: prevFormState,
        globalSlug,
        initialBlockFormState: prevFormState,
        operation: 'update',
        readOnly: !isEditable,
        schemaPath: schemaFieldsPath,
        signal: controller.signal,
      })

      if (!state) {
        return prevFormState
      }

      return state
    },
    [
      getFormState,
      id,
      isEditable,
      collectionSlug,
      getDocPreferences,
      parentDocumentFields,
      globalSlug,
      schemaFieldsPath,
    ],
  )

  // cleanup effect
  useEffect(() => {
    return () => {
      abortAndIgnore(onChangeAbortControllerRef.current)
    }
  }, [])

  if (initialState === false) {
    return null
  }

  return (
    <Form
      beforeSubmit={[onChange]}
      disableValidationOnSubmit
      fields={Array.isArray(fields) ? fields : []}
      initialState={initialState}
      onChange={[onChange]}
      onSubmit={handleDrawerSubmit}
      uuid={uuid()}
    >
      <RenderFields
        fields={Array.isArray(fields) ? fields : []}
        forceRender
        parentIndexPath=""
        parentPath="" // See Blocks feature path for details as for why this is empty
        parentSchemaPath={schemaFieldsPath}
        permissions={true}
        readOnly={!isEditable}
      />
      <FormSubmit>{t('fields:saveChanges')}</FormSubmit>
    </Form>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: useLexicalDocumentDrawer.tsx]---
Location: payload-main/packages/richtext-lexical/src/utilities/fieldsDrawer/useLexicalDocumentDrawer.tsx
Signals: React

```typescript
'use client'
import type { UseDocumentDrawer } from '@payloadcms/ui'
import type { BaseSelection } from 'lexical'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useDocumentDrawer, useModal } from '@payloadcms/ui'
import { $getPreviousSelection, $getSelection, $setSelection } from 'lexical'
import { useCallback, useEffect, useState } from 'react'

/**
 *
 * Wrapper around useDocumentDrawer that restores and saves selection state (cursor position) when opening and closing the drawer.
 * By default, the lexical cursor position may be lost when opening a drawer and clicking somewhere on that drawer.
 */
export const useLexicalDocumentDrawer = (
  args: Parameters<UseDocumentDrawer>[0],
): {
  closeDocumentDrawer: () => void
  DocumentDrawer: ReturnType<UseDocumentDrawer>[0]
  documentDrawerSlug: string
  DocumentDrawerToggler: ReturnType<UseDocumentDrawer>[1]
} => {
  const [editor] = useLexicalComposerContext()
  const [selectionState, setSelectionState] = useState<BaseSelection | null>(null)
  const [wasOpen, setWasOpen] = useState<boolean>(false)

  const [
    DocumentDrawer,
    DocumentDrawerToggler,
    { closeDrawer: closeDrawer, drawerSlug: documentDrawerSlug },
  ] = useDocumentDrawer(args)
  const { modalState } = useModal()

  const storeSelection = useCallback(() => {
    editor.read(() => {
      const selection = $getSelection() ?? $getPreviousSelection()
      setSelectionState(selection)
    })
    setWasOpen(true)
  }, [editor])

  const restoreSelection = useCallback(() => {
    if (selectionState) {
      editor.update(
        () => {
          $setSelection(selectionState.clone())
        },
        { discrete: true, skipTransforms: true },
      )
    }
  }, [editor, selectionState])

  const closeDocumentDrawer = () => {
    //restoreSelection() // Should already be stored by the useEffect below
    closeDrawer()
  }

  // We need to handle drawer closing via a useEffect, as toggleDrawer / closeDrawer will not be triggered if the drawer
  // is closed by clicking outside of the drawer. This useEffect will handle everything.
  useEffect(() => {
    if (!wasOpen) {
      return
    }

    const thisModalState = modalState[documentDrawerSlug]
    // Exists in modalState (thus has opened at least once before) and is closed
    if (thisModalState && !thisModalState?.isOpen) {
      setWasOpen(false)
      setTimeout(() => {
        restoreSelection()
      }, 1)
    }
  }, [modalState, documentDrawerSlug, restoreSelection, wasOpen])

  return {
    closeDocumentDrawer,
    DocumentDrawer,
    documentDrawerSlug,
    DocumentDrawerToggler: (props) => <DocumentDrawerToggler {...props} onClick={storeSelection} />,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: useLexicalDrawer.tsx]---
Location: payload-main/packages/richtext-lexical/src/utilities/fieldsDrawer/useLexicalDrawer.tsx
Signals: React

```typescript
'use client'
import type { BaseSelection } from 'lexical'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useModal } from '@payloadcms/ui'
import { $getPreviousSelection, $getSelection, $setSelection } from 'lexical'
import { useCallback, useEffect, useState } from 'react'

/**
 *
 * Wrapper around useModal that restores and saves selection state (cursor position) when opening and closing the drawer.
 * By default, the lexical cursor position may be lost when opening a drawer and clicking somewhere on that drawer.
 */
export const useLexicalDrawer = (slug: string, restoreLate?: boolean) => {
  const [editor] = useLexicalComposerContext()
  const [selectionState, setSelectionState] = useState<BaseSelection | null>(null)
  const [wasOpen, setWasOpen] = useState<boolean>(false)

  const { closeModal: closeBaseModal, modalState, toggleModal: toggleBaseModal } = useModal()

  const storeSelection = useCallback(() => {
    editor.read(() => {
      const selection = $getSelection() ?? $getPreviousSelection()
      setSelectionState(selection)
    })
  }, [editor])

  const restoreSelection = useCallback(() => {
    if (selectionState) {
      editor.update(
        () => {
          $setSelection(selectionState.clone())
        },
        { discrete: true, skipTransforms: true },
      )
    }
  }, [editor, selectionState])

  const closeDrawer = useCallback(() => {
    //restoreSelection() // Should already be stored by the useEffect below
    closeBaseModal(slug)
  }, [closeBaseModal, slug])
  const isModalOpen = modalState?.[slug]?.isOpen

  const toggleDrawer = useCallback(() => {
    if (!isModalOpen) {
      storeSelection()
    } else {
      restoreSelection()
    }
    setWasOpen(true)
    toggleBaseModal(slug)
  }, [slug, storeSelection, toggleBaseModal, restoreSelection, isModalOpen])

  // We need to handle drawer closing via a useEffect, as toggleDrawer / closeDrawer will not be triggered if the drawer
  // is closed by clicking outside of the drawer. This useEffect will handle everything.
  useEffect(() => {
    if (!wasOpen) {
      return
    }

    const thisModalState = modalState[slug]
    // Exists in modalState (thus has opened at least once before) and is closed
    if (thisModalState && !thisModalState?.isOpen) {
      setWasOpen(false)

      if (restoreLate) {
        // restoreLate is used for upload extra field drawers. For some reason, the selection is not restored if we call restoreSelection immediately.
        setTimeout(() => {
          restoreSelection()
        }, 0)
      } else {
        restoreSelection()
      }
    }
  }, [modalState, slug, restoreSelection, wasOpen, restoreLate])

  return {
    closeDrawer,
    toggleDrawer,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: useLexicalListDrawer.tsx]---
Location: payload-main/packages/richtext-lexical/src/utilities/fieldsDrawer/useLexicalListDrawer.tsx
Signals: React

```typescript
'use client'
import type { UseListDrawer } from '@payloadcms/ui'
import type { BaseSelection } from 'lexical'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useListDrawer, useModal } from '@payloadcms/ui'
import {
  $getNodeByKey,
  $getPreviousSelection,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $setSelection,
} from 'lexical'
import { useCallback, useEffect, useState } from 'react'

/**
 *
 * Wrapper around useListDrawer that restores and saves selection state (cursor position) when opening and closing the drawer.
 * By default, the lexical cursor position may be lost when opening a drawer and clicking somewhere on that drawer.
 */
export const useLexicalListDrawer = (
  args: Parameters<UseListDrawer>[0],
): {
  closeListDrawer: () => void
  isListDrawerOpen: boolean
  ListDrawer: ReturnType<UseListDrawer>[0]
  listDrawerSlug: string
  ListDrawerToggler: ReturnType<UseListDrawer>[1]
  openListDrawer: (selection?: BaseSelection) => void
} => {
  const [editor] = useLexicalComposerContext()
  const [selectionState, setSelectionState] = useState<BaseSelection | null>(null)
  const [wasOpen, setWasOpen] = useState<boolean>(false)

  const [
    BaseListDrawer,
    BaseListDrawerToggler,
    {
      closeDrawer: baseCloseDrawer,
      drawerSlug: listDrawerSlug,
      isDrawerOpen,
      openDrawer: baseOpenDrawer,
    },
  ] = useListDrawer(args)
  const { modalState } = useModal()

  const $storeSelection = useCallback(() => {
    // editor.read() causes an error here when creating a new upload node from the slash menu. It seems like we can omit it here though, as all
    // invocations of that functions are wrapped in editor.read() or editor.update() somewhere in the call stack.
    const selection = $getSelection() ?? $getPreviousSelection()
    setSelectionState(selection)
  }, [])

  const restoreSelection = useCallback(() => {
    if (selectionState) {
      editor.update(
        () => {
          if ($isRangeSelection(selectionState)) {
            const { anchor, focus } = selectionState
            if ($getNodeByKey(anchor.key) && $getNodeByKey(focus.key)) {
              $setSelection(selectionState.clone())
            }
          } else {
            // not ideal, but better than losing the selection. Try to set the selection
            // in a valid place if you remove selected nodes!
            $getRoot().selectEnd()
          }
        },
        { discrete: true, skipTransforms: true },
      )
    }
  }, [editor, selectionState])

  const closeListDrawer = () => {
    //restoreSelection() // Should already be stored by the useEffect below
    baseCloseDrawer()
  }

  // We need to handle drawer closing via a useEffect, as toggleDrawer / closeDrawer will not be triggered if the drawer
  // is closed by clicking outside of the drawer. This useEffect will handle everything.
  useEffect(() => {
    if (!wasOpen) {
      return
    }

    const thisModalState = modalState[listDrawerSlug]
    // Exists in modalState (thus has opened at least once before) and is closed
    if (thisModalState && !thisModalState?.isOpen) {
      setWasOpen(false)
      setTimeout(() => {
        restoreSelection()
      }, 1)
    }
  }, [modalState, listDrawerSlug, restoreSelection, wasOpen])

  return {
    closeListDrawer,
    isListDrawerOpen: isDrawerOpen,
    ListDrawer: BaseListDrawer,
    listDrawerSlug,
    ListDrawerToggler: (props) => (
      <BaseListDrawerToggler
        {...props}
        onClick={() => {
          $storeSelection()
        }}
      />
    ),
    openListDrawer: () => {
      $storeSelection()
      baseOpenDrawer()
      setWasOpen(true)
    },
  }
}
```

--------------------------------------------------------------------------------

---[FILE: collectTopLevelJSXInLines.ts]---
Location: payload-main/packages/richtext-lexical/src/utilities/jsx/collectTopLevelJSXInLines.ts

```typescript
import { linesFromStartToContentAndPropsString } from '../../features/blocks/server/markdown/linesFromMatchToContentAndPropsString.js'
import { createTagRegexes } from '../../features/blocks/server/markdown/markdownTransformer.js'

/**
 * Helpful utility for parsing out all matching top-level JSX tags in a given string.
 * This will collect them in a list, that contains the content of the JSX tag and the props string.
 *
 * While this is not used within payload, this can be used for certain payload blocks that need to
 * be serializable and deserializable to and from JSX.
 *
 * @example:
 *
 * Say you have Steps block that contains a steps array. Its JSX representation may look like this:
 *
 * <Steps>
 *   <Step title="Step1">
 *     <h1>Step 1</h1>
 *   </Step>
 *   <Step title="Step2">
 *     <h1>Step 2</h1>
 *   </Step>
 * </Steps>
 *
 * In this case, the Steps block would have the following content as its children string:
 * <Step title="Step1">
 *   <h1>Step 1</h1>
 * </Step>
 * <Step title="Step2">
 *   <h1>Step 2</h1>
 * </Step>
 *
 * It could then use this function to collect all the top-level JSX tags (= the steps):
 *
 * collectTopLevelJSXInLines(children.split('\n'), 'Step')
 *
 * This will return:
 *
 * [
 *   {
 *     content: '<h1>Step 1</h1>',
 *     propsString: 'title="Step1"',
 *   },
 *   {
 *     content: '<h1>Step 2</h1>',
 *     propsString: 'title="Step2"',
 *   },
 * ]
 *
 * You can then map this data to construct the data for this blocks array field.
 */
export function collectTopLevelJSXInLines(
  lines: Array<string>,
  jsxToMatch: string,
): {
  content: string
  propsString: string
}[] {
  const finds: {
    content: string
    propsString: string
  }[] = []
  const regex = createTagRegexes(jsxToMatch)

  const linesLength = lines.length

  for (let i = 0; i < linesLength; i++) {
    const line = lines[i]!
    const startMatch = line.match(regex.regExpStart)
    if (!startMatch) {
      continue // Try next transformer
    }

    const { content, endLineIndex, propsString } = linesFromStartToContentAndPropsString({
      isEndOptional: false,
      lines,
      regexpEndRegex: regex.regExpEnd,
      startLineIndex: i,
      startMatch,
    })

    finds.push({
      content,
      propsString,
    })

    i = endLineIndex
    continue
  }

  return finds
}
```

--------------------------------------------------------------------------------

---[FILE: declare.d.ts]---
Location: payload-main/packages/richtext-lexical/src/utilities/jsx/declare.d.ts

```typescript
declare module 'jsox' {
  export const JSOX: any
}
```

--------------------------------------------------------------------------------

---[FILE: extractPropsFromJSXPropsString.ts]---
Location: payload-main/packages/richtext-lexical/src/utilities/jsx/extractPropsFromJSXPropsString.ts

```typescript
import { JSOX } from 'jsox'

/**
 * Turns a JSX props string into an object.
 *
 * @example
 *
 * Input: type="info" hello={{heyyy: 'test', someNumber: 2}}
 * Output: { type: 'info', hello: { heyyy: 'test', someNumber: 2 } }
 */
export function extractPropsFromJSXPropsString({
  propsString,
}: {
  propsString: string
}): Record<string, any> {
  const props: Record<string, any> = {}
  let key = ''
  let collectingKey = true

  for (let i = 0; i < propsString.length; i++) {
    const char = propsString[i]

    if (collectingKey) {
      if (char === '=' || char === ' ') {
        if (key) {
          if (char === ' ') {
            props[key] = true
            key = ''
          } else {
            collectingKey = false
          }
        }
      } else {
        key += char
      }
    } else {
      const result = handleValue(propsString, i)
      props[key] = result.value
      i = result.newIndex
      key = ''
      collectingKey = true
    }
  }

  if (key) {
    props[key] = true
  }

  return props
}

function handleValue(propsString: string, startIndex: number): { newIndex: number; value: any } {
  const char = propsString[startIndex]

  if (char === '"') {
    return handleQuotedString(propsString, startIndex)
  } else if (char === "'") {
    return handleQuotedString(propsString, startIndex, true)
  } else if (char === '{') {
    return handleObject(propsString, startIndex)
  } else if (char === '[') {
    return handleArray(propsString, startIndex)
  } else {
    return handleUnquotedString(propsString, startIndex)
  }
}

function handleArray(propsString: string, startIndex: number): { newIndex: number; value: any } {
  let bracketCount = 1
  let value = ''
  let i = startIndex + 1

  while (i < propsString.length && bracketCount > 0) {
    if (propsString[i] === '[') {
      bracketCount++
    } else if (propsString[i] === ']') {
      bracketCount--
    }
    if (bracketCount > 0) {
      value += propsString[i]
    }
    i++
  }

  return { newIndex: i, value: JSOX.parse(`[${value}]`) }
}

function handleQuotedString(
  propsString: string,
  startIndex: number,
  isSingleQuoted = false,
): { newIndex: number; value: string } {
  let value = ''
  let i = startIndex + 1
  while (
    i < propsString.length &&
    (propsString[i] !== (isSingleQuoted ? "'" : '"') || propsString[i - 1] === '\\')
  ) {
    value += propsString[i]
    i++
  }
  return { newIndex: i, value }
}

function handleObject(propsString: string, startIndex: number): { newIndex: number; value: any } {
  let bracketCount = 1
  let value = ''
  let i = startIndex + 1

  while (i < propsString.length && bracketCount > 0) {
    if (propsString[i] === '{') {
      bracketCount++
    } else if (propsString[i] === '}') {
      bracketCount--
    }
    if (bracketCount > 0) {
      value += propsString[i]
    }
    i++
  }

  return { newIndex: i, value: parseObject(value) }
}

function parseObject(objString: string): Record<string, any> {
  if (objString[0] !== '{') {
    return JSOX.parse(objString)
  }

  const result = JSOX.parse(objString.replace(/(\w+):/g, '"$1":'))

  return result
}

function handleUnquotedString(
  propsString: string,
  startIndex: number,
): { newIndex: number; value: string } {
  let value = ''
  let i = startIndex
  while (i < propsString.length && propsString[i] !== ' ') {
    value += propsString[i]
    i++
  }
  return { newIndex: i - 1, value }
}
```

--------------------------------------------------------------------------------

````
