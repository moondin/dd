---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 290
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 290 of 695)

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
Location: payload-main/packages/richtext-lexical/src/field/Diff/converters/upload/index.tsx
Signals: React

```typescript
import type { FileData, PayloadRequest, TypeWithID } from 'payload'

import { type I18nClient } from '@payloadcms/translations'
import { File } from '@payloadcms/ui/rsc'
import { createHash } from 'crypto'

import './index.scss'

import { formatFilesize } from 'payload/shared'
import React from 'react'

import type { HTMLConvertersAsync } from '../../../../features/converters/lexicalToHtml/async/types.js'
import type { UploadDataImproved } from '../../../../features/upload/server/nodes/UploadNode.js'
import type { SerializedUploadNode } from '../../../../nodeTypes.js'

const baseClass = 'lexical-upload-diff'

export const UploadDiffHTMLConverterAsync: (args: {
  i18n: I18nClient
  req: PayloadRequest
}) => HTMLConvertersAsync<SerializedUploadNode> = ({ i18n, req }) => {
  return {
    upload: async ({ node, populate, providedCSSString }) => {
      const uploadNode = node as UploadDataImproved

      let uploadDoc: (FileData & TypeWithID) | undefined = undefined

      // If there's no valid upload data, populate return an empty string
      if (typeof uploadNode.value !== 'object') {
        if (!populate) {
          return ''
        }
        uploadDoc = await populate<FileData & TypeWithID>({
          id: uploadNode.value,
          collectionSlug: uploadNode.relationTo,
        })
      } else {
        uploadDoc = uploadNode.value as unknown as FileData & TypeWithID
      }

      if (!uploadDoc) {
        return ''
      }

      const relatedCollection = req.payload.collections[uploadNode.relationTo]?.config

      const thumbnailSRC: string =
        ('thumbnailURL' in uploadDoc && (uploadDoc?.thumbnailURL as string)) || uploadDoc?.url || ''

      const ReactDOMServer = (await import('react-dom/server')).default

      // hash fields to ensure they are diffed if they change
      const nodeFieldsHash = createHash('sha256')
        .update(JSON.stringify(node.fields ?? {}))
        .digest('hex')

      const JSX = (
        <div
          className={`${baseClass}${providedCSSString}`}
          data-enable-match="true"
          data-fields-hash={`${nodeFieldsHash}`}
          data-filename={uploadDoc?.filename}
          data-lexical-upload-id={uploadNode.value}
          data-lexical-upload-relation-to={uploadNode.relationTo}
          data-src={thumbnailSRC}
        >
          <div className={`${baseClass}__card`}>
            <div className={`${baseClass}__thumbnail`}>
              {thumbnailSRC?.length ? (
                <img alt={uploadDoc?.filename} src={thumbnailSRC} />
              ) : (
                <File />
              )}
            </div>
            <div className={`${baseClass}__info`} data-enable-match="false">
              <strong>{uploadDoc?.filename}</strong>
              <div className={`${baseClass}__meta`}>
                {formatFilesize(uploadDoc?.filesize)}
                {typeof uploadDoc?.width === 'number' && typeof uploadDoc?.height === 'number' && (
                  <React.Fragment>
                    &nbsp;-&nbsp;
                    {uploadDoc?.width}x{uploadDoc?.height}
                  </React.Fragment>
                )}
                {uploadDoc?.mimeType && (
                  <React.Fragment>
                    &nbsp;-&nbsp;
                    {uploadDoc?.mimeType}
                  </React.Fragment>
                )}
              </div>
            </div>
          </div>
        </div>
      )

      // Render to HTML
      const html = ReactDOMServer.renderToStaticMarkup(JSX)

      return html
    },
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/field/RenderLexical/index.tsx
Signals: React

```typescript
'use client'
import type { RichTextField } from 'payload'

import {
  FieldContext,
  FieldPathContext,
  type FieldType,
  type RenderFieldServerFnArgs,
  ServerFunctionsContext,
  type ServerFunctionsContextType,
  ShimmerEffect,
  useServerFunctions,
} from '@payloadcms/ui'
import React, { useCallback, useEffect, useRef } from 'react'

import type { DefaultTypedEditorState } from '../../nodeTypes.js'
import type { LexicalRichTextField } from '../../types.js'

/**
 * Utility to render a lexical editor on the client.
 *
 * @experimental - may break in minor releases
 * @todo - replace this with a general utility that works for all fields. Maybe merge with packages/ui/src/forms/RenderFields/RenderField.tsx
 */
export const RenderLexical: React.FC<
  /**
   * If value or setValue, or both, is provided, this component will manage its own value.
   * If neither is passed, it will rely on the parent form to manage the value.
   */
  {
    /**
     * Override the loading state while the field component is being fetched and rendered.
     */
    Loading?: React.ReactElement

    setValue?: FieldType<DefaultTypedEditorState | undefined>['setValue']
    value?: FieldType<DefaultTypedEditorState | undefined>['value']
  } & RenderFieldServerFnArgs<LexicalRichTextField>
> = (args) => {
  const { field, initialValue, Loading, path, schemaPath, setValue, value } = args
  const [Component, setComponent] = React.useState<null | React.ReactNode>(null)
  const serverFunctionContext = useServerFunctions()
  const { _internal_renderField } = serverFunctionContext

  const [entityType, entitySlug] = schemaPath.split('.', 2)

  const fieldPath = path ?? (field && 'name' in field ? field?.name : '') ?? ''

  const renderLexical = useCallback(() => {
    async function render() {
      const { Field } = await _internal_renderField({
        field: {
          ...((field as RichTextField) || {}),
          type: 'richText',
          admin: {
            ...((field as RichTextField)?.admin || {}),
            // When using "fake" anchor fields, hidden is often set to true. We need to override that here to ensure the field is rendered.
            hidden: false,
          },
        },
        initialValue: initialValue ?? undefined,
        path,
        schemaPath,
      })

      setComponent(Field)
    }
    void render()
  }, [_internal_renderField, schemaPath, path, field, initialValue])

  const mounted = useRef(false)

  useEffect(() => {
    if (mounted.current) {
      return
    }
    mounted.current = true
    void renderLexical()
  }, [renderLexical])

  if (!Component) {
    return typeof Loading !== 'undefined' ? Loading : <ShimmerEffect />
  }

  /**
   * By default, the lexical will make form state requests (e.g. to get drawer fields), passing in the arguments
   * of the current field. However, we need to override those arguments to get it to make requests based on the
   * *target* field. The server only knows the schema map of the target field.
   */
  const adjustedServerFunctionContext: ServerFunctionsContextType = {
    ...serverFunctionContext,
    getFormState: async (getFormStateArgs) => {
      return serverFunctionContext.getFormState({
        ...getFormStateArgs,
        collectionSlug: entityType === 'collection' ? entitySlug : undefined,
        globalSlug: entityType === 'global' ? entitySlug : undefined,
      })
    },
  }

  if (typeof value === 'undefined' && !setValue) {
    return (
      <ServerFunctionsContext value={{ ...adjustedServerFunctionContext }}>
        <FieldPathContext key={fieldPath} value={fieldPath}>
          {Component}
        </FieldPathContext>
      </ServerFunctionsContext>
    )
  }

  const fieldValue: FieldType<DefaultTypedEditorState | undefined> = {
    disabled: false,
    formInitializing: false,
    formProcessing: false,
    formSubmitted: false,
    initialValue: value,
    path: fieldPath,
    setValue: setValue ?? (() => undefined),
    showError: false,
    value,
  }

  return (
    <ServerFunctionsContext value={{ ...adjustedServerFunctionContext }}>
      <FieldPathContext key={fieldPath} value={fieldPath}>
        <FieldContext value={fieldValue}>{Component}</FieldContext>
      </FieldPathContext>
    </ServerFunctionsContext>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: EditorPlugin.tsx]---
Location: payload-main/packages/richtext-lexical/src/lexical/EditorPlugin.tsx
Signals: React

```typescript
'use client'
import React from 'react'

import type { SanitizedPlugin } from '../features/typesClient.js'

export const EditorPlugin: React.FC<{
  anchorElem?: HTMLDivElement
  clientProps: unknown
  plugin: SanitizedPlugin
}> = ({ anchorElem, clientProps, plugin }) => {
  if (plugin.position === 'floatingAnchorElem' && anchorElem) {
    return (
      plugin.Component && <plugin.Component anchorElem={anchorElem} clientProps={clientProps} />
    )
  }

  // @ts-expect-error - ts is not able to infer that plugin.Component is of type PluginComponent
  return plugin.Component && <plugin.Component clientProps={clientProps} />
}
```

--------------------------------------------------------------------------------

---[FILE: LexicalEditor.scss]---
Location: payload-main/packages/richtext-lexical/src/lexical/LexicalEditor.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .rich-text-lexical {
    .editor {
      position: relative;
    }

    .editor-container {
      position: relative;

      font-family: var(--font-serif);
      font-size: base(0.8);
      letter-spacing: 0.02em;
    }

    &--show-gutter {
      > .rich-text-lexical__wrap
        > .editor-container
        > .editor-scroller
        > .editor
        > div
        > .LexicalEditorTheme__placeholder {
        left: 3rem;
      }
    }

    &:not(&--show-gutter)
      > .rich-text-lexical__wrap
      > .editor-container
      > .editor-scroller
      > .editor
      > div
      > .LexicalEditorTheme__placeholder {
      left: 0;
    }

    .LexicalEditorTheme__placeholder {
      position: absolute;
      top: 8px;
      font-size: base(0.8);
      line-height: 1.5;
      color: var(--theme-elevation-500);
      /* Prevent text selection */
      user-select: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;

      /* Make it behave more like a background element (no interaction) */
      pointer-events: none;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: LexicalEditor.tsx]---
Location: payload-main/packages/richtext-lexical/src/lexical/LexicalEditor.tsx
Signals: React

```typescript
'use client'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.js'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary.js'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin.js'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin.js'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin.js'
import { useLexicalEditable } from '@lexical/react/useLexicalEditable'
import { BLUR_COMMAND, COMMAND_PRIORITY_LOW, FOCUS_COMMAND } from 'lexical'
import * as React from 'react'
import { useEffect, useState } from 'react'

import type { LexicalProviderProps } from './LexicalProvider.js'

import { useEditorConfigContext } from './config/client/EditorConfigProvider.js'
import './LexicalEditor.scss'
import { EditorPlugin } from './EditorPlugin.js'
import { ClipboardPlugin } from './plugins/ClipboardPlugin/index.js'
import { DecoratorPlugin } from './plugins/DecoratorPlugin/index.js'
import { AddBlockHandlePlugin } from './plugins/handles/AddBlockHandlePlugin/index.js'
import { DraggableBlockPlugin } from './plugins/handles/DraggableBlockPlugin/index.js'
import { InsertParagraphAtEndPlugin } from './plugins/InsertParagraphAtEnd/index.js'
import { MarkdownShortcutPlugin } from './plugins/MarkdownShortcut/index.js'
import { NormalizeSelectionPlugin } from './plugins/NormalizeSelection/index.js'
import { SelectAllPlugin } from './plugins/SelectAllPlugin/index.js'
import { SlashMenuPlugin } from './plugins/SlashMenu/index.js'
import { TextPlugin } from './plugins/TextPlugin/index.js'
import { LexicalContentEditable } from './ui/ContentEditable.js'

export const LexicalEditor: React.FC<
  {
    editorContainerRef: React.RefObject<HTMLDivElement | null>
    isSmallWidthViewport: boolean
  } & Pick<LexicalProviderProps, 'editorConfig' | 'onChange'>
> = (props) => {
  const { editorConfig, editorContainerRef, isSmallWidthViewport, onChange } = props
  const editorConfigContext = useEditorConfigContext()
  const [editor] = useLexicalComposerContext()
  const isEditable = useLexicalEditable()

  const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null)
  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem)
    }
  }

  useEffect(() => {
    if (!editorConfigContext?.uuid) {
      console.error('Lexical Editor must be used within an EditorConfigProvider')
      return
    }
    if (editorConfigContext?.parentEditor?.uuid) {
      editorConfigContext.parentEditor?.registerChild(editorConfigContext.uuid, editorConfigContext)
    }

    const handleFocus = () => {
      editorConfigContext.focusEditor(editorConfigContext)
    }

    const handleBlur = () => {
      editorConfigContext.blurEditor(editorConfigContext)
    }

    const unregisterFocus = editor.registerCommand<MouseEvent>(
      FOCUS_COMMAND,
      () => {
        handleFocus()
        return true
      },
      COMMAND_PRIORITY_LOW,
    )

    const unregisterBlur = editor.registerCommand<MouseEvent>(
      BLUR_COMMAND,
      () => {
        handleBlur()
        return true
      },
      COMMAND_PRIORITY_LOW,
    )

    return () => {
      unregisterFocus()
      unregisterBlur()
      editorConfigContext.parentEditor?.unregisterChild?.(editorConfigContext.uuid)
    }
  }, [editor, editorConfigContext])

  return (
    <React.Fragment>
      {editorConfig.features.plugins?.map((plugin) => {
        if (plugin.position === 'aboveContainer') {
          return <EditorPlugin clientProps={plugin.clientProps} key={plugin.key} plugin={plugin} />
        }
      })}
      <div className="editor-container" ref={editorContainerRef}>
        {editorConfig.features.plugins?.map((plugin) => {
          if (plugin.position === 'top') {
            return (
              <EditorPlugin clientProps={plugin.clientProps} key={plugin.key} plugin={plugin} />
            )
          }
        })}
        <RichTextPlugin
          contentEditable={
            <div className="editor-scroller">
              <div className="editor" ref={onRef}>
                <LexicalContentEditable editorConfig={editorConfig} />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <NormalizeSelectionPlugin />
        {isEditable && <InsertParagraphAtEndPlugin />}
        <DecoratorPlugin />
        <ClipboardPlugin />
        <TextPlugin features={editorConfig.features} />
        <SelectAllPlugin />
        {isEditable && (
          <OnChangePlugin
            // Selection changes can be ignored here, reducing the
            // frequency that the FieldComponent and Payload receive updates.
            // Selection changes are only needed if you are saving selection state
            ignoreSelectionChange
            onChange={(editorState, editor, tags) => {
              // Ignore any onChange event triggered by focus only
              if (!tags.has('focus') || tags.size > 1) {
                if (onChange != null) {
                  onChange(editorState, editor, tags)
                }
              }
            }}
          />
        )}
        {floatingAnchorElem && (
          <React.Fragment>
            {!isSmallWidthViewport && isEditable && (
              <React.Fragment>
                {editorConfig.admin?.hideDraggableBlockElement ? null : (
                  <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
                )}
                {editorConfig.admin?.hideAddBlockButton ? null : (
                  <AddBlockHandlePlugin anchorElem={floatingAnchorElem} />
                )}
              </React.Fragment>
            )}
            {editorConfig.features.plugins?.map((plugin) => {
              if (
                plugin.position === 'floatingAnchorElem' &&
                !(plugin.desktopOnly === true && isSmallWidthViewport)
              ) {
                return (
                  <EditorPlugin
                    anchorElem={floatingAnchorElem}
                    clientProps={plugin.clientProps}
                    key={plugin.key}
                    plugin={plugin}
                  />
                )
              }
            })}
            {isEditable && (
              <React.Fragment>
                <SlashMenuPlugin anchorElem={floatingAnchorElem} />
              </React.Fragment>
            )}
          </React.Fragment>
        )}
        {isEditable && (
          <React.Fragment>
            <HistoryPlugin />
            {editorConfig?.features?.markdownTransformers?.length > 0 && <MarkdownShortcutPlugin />}
          </React.Fragment>
        )}
        {editorConfig.features.plugins?.map((plugin) => {
          if (plugin.position === 'normal') {
            return (
              <EditorPlugin clientProps={plugin.clientProps} key={plugin.key} plugin={plugin} />
            )
          }
        })}
        {editorConfig.features.plugins?.map((plugin) => {
          if (plugin.position === 'bottom') {
            return (
              <EditorPlugin clientProps={plugin.clientProps} key={plugin.key} plugin={plugin} />
            )
          }
        })}
      </div>
      {editorConfig.features.plugins?.map((plugin) => {
        if (plugin.position === 'belowContainer') {
          return <EditorPlugin clientProps={plugin.clientProps} key={plugin.key} plugin={plugin} />
        }
      })}
    </React.Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: LexicalProvider.tsx]---
Location: payload-main/packages/richtext-lexical/src/lexical/LexicalProvider.tsx
Signals: React

```typescript
'use client'
import type { InitialConfigType } from '@lexical/react/LexicalComposer.js'
import type { EditorState, LexicalEditor, SerializedEditorState } from 'lexical'

import { LexicalComposer } from '@lexical/react/LexicalComposer.js'
import { useEditDepth } from '@payloadcms/ui'
import * as React from 'react'
import { useMemo } from 'react'

import type { LexicalRichTextFieldProps } from '../types.js'
import type { SanitizedClientEditorConfig } from './config/types.js'

import {
  EditorConfigProvider,
  useEditorConfigContext,
} from './config/client/EditorConfigProvider.js'
import { LexicalEditor as LexicalEditorComponent } from './LexicalEditor.js'
import { getEnabledNodes } from './nodes/index.js'

export type LexicalProviderProps = {
  composerKey: string
  editorConfig: SanitizedClientEditorConfig
  fieldProps: LexicalRichTextFieldProps
  isSmallWidthViewport: boolean
  onChange: (editorState: EditorState, editor: LexicalEditor, tags: Set<string>) => void
  readOnly: boolean
  value: SerializedEditorState
}

const NestProviders = ({
  children,
  providers,
}: {
  children: React.ReactNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  providers: any[]
}) => {
  if (!providers?.length) {
    return children
  }
  const Component = providers[0]
  if (providers.length > 1) {
    return (
      <Component>
        <NestProviders providers={providers.slice(1)}>{children}</NestProviders>
      </Component>
    )
  }
  return <Component>{children}</Component>
}

export const LexicalProvider: React.FC<LexicalProviderProps> = (props) => {
  const { composerKey, editorConfig, fieldProps, isSmallWidthViewport, onChange, readOnly, value } =
    props

  const parentContext = useEditorConfigContext()

  const editDepth = useEditDepth()

  const editorContainerRef = React.useRef<HTMLDivElement>(null)

  // useMemo for the initialConfig that depends on readOnly and value
  const initialConfig = useMemo<InitialConfigType>(() => {
    if (value && typeof value !== 'object') {
      throw new Error(
        'The value passed to the Lexical editor is not an object. This is not supported. Please remove the data from the field and start again. This is the value that was passed in: ' +
          JSON.stringify(value),
      )
    }

    if (value && Array.isArray(value) && !('root' in value)) {
      throw new Error(
        'You have tried to pass in data from the old Slate editor to the new Lexical editor. The data structure is different, thus you will have to migrate your data. We offer a one-line migration script which migrates all your rich text fields: https://payloadcms.com/docs/lexical/migration#migration-via-migration-script-recommended',
      )
    }

    if (value && 'jsonContent' in value) {
      throw new Error(
        'You have tried to pass in data from payload-plugin-lexical. The data structure is different, thus you will have to migrate your data. Migration guide: https://payloadcms.com/docs/lexical/migration#migrating-from-payload-plugin-lexical',
      )
    }

    return {
      editable: readOnly !== true,
      editorState: value != null ? JSON.stringify(value) : undefined,
      namespace: editorConfig.lexical.namespace,
      nodes: getEnabledNodes({ editorConfig }),
      onError: (error: Error) => {
        throw error
      },
      theme: editorConfig.lexical.theme,
    }
    // Important: do not add readOnly and value to the dependencies array. This will cause the entire lexical editor to re-render if the document is saved, which will
    // cause the editor to lose focus.
  }, [editorConfig])

  if (!initialConfig) {
    return <p>Loading...</p>
  }

  // We need to add initialConfig.editable to the key to force a re-render when the readOnly prop changes.
  // Without it, there were cases where lexical editors inside drawers turn readOnly initially - a few miliseconds later they turn editable, but the editor does not re-render and stays readOnly.
  return (
    <LexicalComposer initialConfig={initialConfig} key={composerKey + initialConfig.editable}>
      <EditorConfigProvider
        editorConfig={editorConfig}
        editorContainerRef={editorContainerRef}
        fieldProps={fieldProps}
        /**
         * Parent editor is not truly the parent editor, if the current editor is part of a drawer and the parent editor is the main editor.
         */
        parentContext={parentContext?.editDepth === editDepth ? parentContext : undefined}
      >
        <NestProviders providers={editorConfig.features.providers}>
          <LexicalEditorComponent
            editorConfig={editorConfig}
            editorContainerRef={editorContainerRef}
            isSmallWidthViewport={isSmallWidthViewport}
            onChange={onChange}
          />
        </NestProviders>
      </EditorConfigProvider>
    </LexicalComposer>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical/config/types.ts

```typescript
import type { EditorConfig as LexicalEditorConfig } from 'lexical'

import type {
  FeatureProviderClient,
  ResolvedClientFeatureMap,
  SanitizedClientFeatures,
} from '../../features/typesClient.js'
import type {
  FeatureProviderServer,
  ResolvedServerFeatureMap,
  SanitizedServerFeatures,
} from '../../features/typesServer.js'
import type { LexicalFieldAdminClientProps } from '../../types.js'

export type ServerEditorConfig = {
  features: FeatureProviderServer<any, any, any>[]
  lexical?: LexicalEditorConfig | undefined // If undefined, the default lexical editor config will be used. This can be undefined so that we do not send the default lexical editor config to the client.
}

export type SanitizedServerEditorConfig = {
  features: SanitizedServerFeatures
  lexical: LexicalEditorConfig | undefined // If undefined, the default lexical editor config will be used. This can be undefined so that we do not send the default lexical editor config to the client.
  resolvedFeatureMap: ResolvedServerFeatureMap
}

export type ClientEditorConfig = {
  features: FeatureProviderClient<any, any>[]
  lexical?: LexicalEditorConfig
}

export type SanitizedClientEditorConfig = {
  admin?: LexicalFieldAdminClientProps
  features: SanitizedClientFeatures
  lexical: LexicalEditorConfig
  resolvedFeatureMap: ResolvedClientFeatureMap
}
```

--------------------------------------------------------------------------------

---[FILE: default.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical/config/client/default.ts

```typescript
'use client'
import type { EditorConfig as LexicalEditorConfig } from 'lexical'

import { LexicalEditorTheme } from '../../theme/EditorTheme.js'

export const defaultEditorLexicalConfig: LexicalEditorConfig = {
  namespace: 'lexical',
  theme: LexicalEditorTheme,
}
```

--------------------------------------------------------------------------------

---[FILE: EditorConfigProvider.tsx]---
Location: payload-main/packages/richtext-lexical/src/lexical/config/client/EditorConfigProvider.tsx
Signals: React

```typescript
'use client'

import type { LexicalEditor } from 'lexical'
import type { MarkRequired } from 'ts-essentials'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.js'
import { useEditDepth } from '@payloadcms/ui'
import * as React from 'react'
import { createContext, use, useMemo, useRef, useState } from 'react'

import type { InlineBlockNode } from '../../../features/blocks/client/nodes/InlineBlocksNode.js'
import type { LexicalRichTextFieldProps } from '../../../types.js'
import type { SanitizedClientEditorConfig } from '../types.js'

// Should always produce a 20 character pseudo-random string
function generateQuickGuid(): string {
  return Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 12)
}

export interface EditorConfigContextType {
  // Editor focus handling
  blurEditor: (editorContext: EditorConfigContextType) => void
  childrenEditors: React.RefObject<Map<string, EditorConfigContextType>>
  createdInlineBlock?: InlineBlockNode
  editDepth: number
  editor: LexicalEditor
  editorConfig: SanitizedClientEditorConfig
  editorContainerRef: React.RefObject<HTMLDivElement>
  fieldProps: MarkRequired<LexicalRichTextFieldProps, 'path' | 'schemaPath'>
  focusedEditor: EditorConfigContextType | null
  // Editor focus handling
  focusEditor: (editorContext: EditorConfigContextType) => void
  parentEditor: EditorConfigContextType
  registerChild: (uuid: string, editorContext: EditorConfigContextType) => void
  setCreatedInlineBlock?: React.Dispatch<React.SetStateAction<InlineBlockNode | undefined>>
  unregisterChild?: (uuid: string) => void
  uuid: string
}

// @ts-expect-error: TODO: Fix this
const Context: React.Context<EditorConfigContextType> = createContext({
  editorConfig: null,
  fieldProps: null,
  uuid: null,
})

export const EditorConfigProvider = ({
  children,
  editorConfig,
  editorContainerRef,
  fieldProps,
  parentContext,
}: {
  children: React.ReactNode
  editorConfig: SanitizedClientEditorConfig
  editorContainerRef: React.RefObject<HTMLDivElement | null>

  fieldProps: LexicalRichTextFieldProps
  parentContext?: EditorConfigContextType
}): React.ReactNode => {
  const [editor] = useLexicalComposerContext()
  // State to store the UUID
  const [uuid] = useState(() => generateQuickGuid())

  const childrenEditors = useRef<Map<string, EditorConfigContextType>>(new Map())
  const [focusedEditor, setFocusedEditor] = useState<EditorConfigContextType | null>(null)
  const focusHistory = useRef<Set<string>>(new Set())
  const [createdInlineBlock, setCreatedInlineBlock] = useState<InlineBlockNode>()

  const editDepth = useEditDepth()

  const editorContext = useMemo(
    () =>
      ({
        blurEditor: (editorContext: EditorConfigContextType) => {
          //setFocusedEditor(null) // Clear focused editor
          focusHistory.current.clear() // Reset focus history when focus is lost
        },
        childrenEditors,
        createdInlineBlock,
        editDepth,
        editor,
        editorConfig,
        editorContainerRef,
        fieldProps,
        focusedEditor,
        focusEditor: (editorContext: EditorConfigContextType) => {
          const editorUUID = editorContext.uuid

          // Avoid recursion by checking if this editor is already focused in this cycle
          if (focusHistory.current.has(editorUUID)) {
            return
          }

          // Add this editor to the history to prevent future recursions in this cycle
          focusHistory.current.add(editorUUID)
          setFocusedEditor(editorContext)

          // Propagate focus event to parent and children, ensuring they do not refocus this editor
          if (parentContext?.uuid) {
            parentContext.focusEditor(editorContext)
          }
          childrenEditors.current.forEach((childEditor) => {
            childEditor.focusEditor(editorContext)
          })

          focusHistory.current.clear()
        },
        parentEditor: parentContext,
        registerChild: (childUUID, childEditorContext) => {
          if (!childrenEditors.current.has(childUUID)) {
            const newMap = new Map(childrenEditors.current)
            newMap.set(childUUID, childEditorContext)
            childrenEditors.current = newMap
          }
        },
        setCreatedInlineBlock,
        unregisterChild: (childUUID) => {
          if (childrenEditors.current.has(childUUID)) {
            const newMap = new Map(childrenEditors.current)
            newMap.delete(childUUID)
            childrenEditors.current = newMap
          }
        },

        uuid,
      }) as EditorConfigContextType,
    [
      createdInlineBlock,
      setCreatedInlineBlock,
      editor,
      childrenEditors,
      editorConfig,
      editorContainerRef,
      editDepth,
      fieldProps,
      focusedEditor,
      parentContext,
      uuid,
    ],
  )

  return <Context value={editorContext}>{children}</Context>
}

export const useEditorConfigContext = (): EditorConfigContextType => {
  const context = use(Context)
  if (context === undefined) {
    throw new Error('useEditorConfigContext must be used within an EditorConfigProvider')
  }
  return context
}
```

--------------------------------------------------------------------------------

---[FILE: loader.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical/config/client/loader.ts

```typescript
'use client'

import type { ClientConfig, RichTextFieldClient } from 'payload'

import type {
  ClientFeatureProviderMap,
  ResolvedClientFeature,
  ResolvedClientFeatureMap,
} from '../../../features/typesClient.js'
import type { FeatureClientSchemaMap } from '../../../types.js'
import type { ClientEditorConfig } from '../types.js'

/**
 * This function expects client functions to ALREADY be ordered & dependencies checked on the server
 * @param unSanitizedEditorConfig
 */
export function loadClientFeatures({
  config,
  featureClientImportMap,
  featureClientSchemaMap,
  field,
  schemaPath,
  unSanitizedEditorConfig,
}: {
  config: ClientConfig
  featureClientImportMap: Record<string, any>
  featureClientSchemaMap: FeatureClientSchemaMap
  field?: RichTextFieldClient
  schemaPath: string
  unSanitizedEditorConfig: ClientEditorConfig
}): ResolvedClientFeatureMap {
  const featureProviderMap: ClientFeatureProviderMap = new Map()

  for (const featureProvider of unSanitizedEditorConfig.features) {
    if (
      !featureProvider?.clientFeatureProps?.featureKey ||
      featureProvider?.clientFeatureProps?.order === undefined ||
      featureProvider?.clientFeatureProps?.order === null
    ) {
      throw new Error(
        'A Feature you have installed does not return the client props as clientFeatureProps. Please make sure to always return those props, even if they are null, as other important props like order and featureKey are later on injected.',
      )
    }
    featureProviderMap.set(featureProvider.clientFeatureProps.featureKey, featureProvider)
  }

  // sort unSanitizedEditorConfig.features by order
  unSanitizedEditorConfig.features = unSanitizedEditorConfig.features.sort(
    (a, b) => a.clientFeatureProps.order - b.clientFeatureProps.order,
  )

  const resolvedFeatures: ResolvedClientFeatureMap = new Map()

  // Make sure all dependencies declared in the respective features exist
  let loaded = 0
  for (const featureProvider of unSanitizedEditorConfig.features) {
    const feature: Partial<ResolvedClientFeature<any>> =
      typeof featureProvider.feature === 'function'
        ? featureProvider.feature({
            config,
            featureClientImportMap,
            featureClientSchemaMap,
            featureProviderMap,
            field,
            resolvedFeatures,
            schemaPath,
            unSanitizedEditorConfig,
          })
        : featureProvider.feature

    feature.key = featureProvider.clientFeatureProps.featureKey
    feature.order = loaded

    resolvedFeatures.set(
      featureProvider.clientFeatureProps.featureKey,
      feature as ResolvedClientFeature<any>,
    )

    loaded++
  }

  return resolvedFeatures
}
```

--------------------------------------------------------------------------------

````
