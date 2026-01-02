---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 289
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 289 of 695)

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

---[FILE: Field.tsx]---
Location: payload-main/packages/richtext-lexical/src/field/Field.tsx
Signals: React

```typescript
'use client'
import type { EditorState, SerializedEditorState } from 'lexical'

import {
  BulkUploadProvider,
  FieldDescription,
  FieldError,
  FieldLabel,
  RenderCustomComponent,
  useEditDepth,
  useEffectEvent,
  useField,
} from '@payloadcms/ui'
import { mergeFieldStyles } from '@payloadcms/ui/shared'
import { dequal } from 'dequal/lite'
import { type Validate } from 'payload'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import type { SanitizedClientEditorConfig } from '../lexical/config/types.js'

import '../lexical/theme/EditorTheme.scss'
import './bundled.css'
import './index.scss'

import type { LexicalRichTextFieldProps } from '../types.js'

import { LexicalProvider } from '../lexical/LexicalProvider.js'
import { useRunDeprioritized } from '../utilities/useRunDeprioritized.js'

const baseClass = 'rich-text-lexical'

const RichTextComponent: React.FC<
  {
    readonly editorConfig: SanitizedClientEditorConfig // With rendered features n stuff
  } & LexicalRichTextFieldProps
> = (props) => {
  const {
    editorConfig,
    field,
    field: {
      admin: { className, description, readOnly: readOnlyFromAdmin } = {},
      label,
      localized,
      required,
    },
    path: pathFromProps,
    readOnly: readOnlyFromTopLevelProps,
    validate, // Users can pass in client side validation if they WANT to, but it's not required anymore
  } = props

  const readOnlyFromProps = readOnlyFromTopLevelProps || readOnlyFromAdmin

  const editDepth = useEditDepth()

  const memoizedValidate = useCallback<Validate>(
    (value, validationOptions) => {
      if (typeof validate === 'function') {
        // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
        return validate(value, { ...validationOptions, required })
      }
      return true
    },
    // Important: do not add props to the dependencies array.
    // This would cause an infinite loop and endless re-rendering.
    // Removing props from the dependencies array fixed this issue: https://github.com/payloadcms/payload/issues/3709
    [validate, required],
  )

  const {
    customComponents: { AfterInput, BeforeInput, Description, Error, Label } = {},
    disabled: disabledFromField,
    initialValue,
    path,
    setValue,
    showError,
    value,
  } = useField<SerializedEditorState>({
    potentiallyStalePath: pathFromProps,
    validate: memoizedValidate,
  })

  const disabled = readOnlyFromProps || disabledFromField

  const [isSmallWidthViewport, setIsSmallWidthViewport] = useState<boolean>(false)
  const [rerenderProviderKey, setRerenderProviderKey] = useState<Date>()

  const prevInitialValueRef = React.useRef<SerializedEditorState | undefined>(initialValue)
  const prevValueRef = React.useRef<SerializedEditorState | undefined>(value)

  useEffect(() => {
    const updateViewPortWidth = () => {
      const isNextSmallWidthViewport = window.matchMedia('(max-width: 768px)').matches

      if (isNextSmallWidthViewport !== isSmallWidthViewport) {
        setIsSmallWidthViewport(isNextSmallWidthViewport)
      }
    }
    updateViewPortWidth()
    window.addEventListener('resize', updateViewPortWidth)

    return () => {
      window.removeEventListener('resize', updateViewPortWidth)
    }
  }, [isSmallWidthViewport])

  const classes = [
    baseClass,
    'field-type',
    className,
    showError && 'error',
    disabled && `${baseClass}--read-only`,
    editorConfig?.admin?.hideGutter !== true && !isSmallWidthViewport
      ? `${baseClass}--show-gutter`
      : null,
  ]
    .filter(Boolean)
    .join(' ')

  const pathWithEditDepth = `${path}.${editDepth}`

  const runDeprioritized = useRunDeprioritized() // defaults to 500 ms timeout

  const handleChange = useCallback(
    (editorState: EditorState) => {
      // Capture `editorState` in the closure so we can safely run later.
      const updateFieldValue = () => {
        const newState = editorState.toJSON()
        prevValueRef.current = newState
        setValue(newState)
      }

      // Queue the update for the browser’s idle time (or Safari shim)
      // and let the hook handle debouncing/cancellation.
      void runDeprioritized(updateFieldValue)
    },
    [setValue, runDeprioritized], // `runDeprioritized` is stable (useCallback inside hook)
  )

  const styles = useMemo(() => mergeFieldStyles(field), [field])

  const handleInitialValueChange = useEffectEvent(
    (initialValue: SerializedEditorState | undefined) => {
      // Object deep equality check here, as re-mounting the editor if
      // the new value is the same as the old one is not necessary.
      // In postgres, the order of keys in JSON objects is not guaranteed to be preserved,
      // so we need to do a deep equality check here that does not care about key order => we use dequal.
      // If we used JSON.stringify, the editor would re-mount every time you save the document, as the order of keys changes => change detected => re-mount.
      if (
        prevValueRef.current !== value &&
        !dequal(
          prevValueRef.current != null
            ? JSON.parse(JSON.stringify(prevValueRef.current))
            : prevValueRef.current,
          value,
        )
      ) {
        prevInitialValueRef.current = initialValue
        prevValueRef.current = value
        setRerenderProviderKey(new Date())
      }
    },
  )

  useEffect(() => {
    // Needs to trigger for object reference changes - otherwise,
    // reacting to the same initial value change twice will cause
    // the second change to be ignored, even though the value has changed.
    // That's because initialValue is not kept up-to-date
    if (!Object.is(initialValue, prevInitialValueRef.current)) {
      handleInitialValueChange(initialValue)
    }
  }, [initialValue])

  return (
    <div className={classes} key={pathWithEditDepth} style={styles}>
      <RenderCustomComponent
        CustomComponent={Error}
        Fallback={<FieldError path={path} showError={showError} />}
      />
      {Label || <FieldLabel label={label} localized={localized} path={path} required={required} />}
      <div className={`${baseClass}__wrap`}>
        <ErrorBoundary fallbackRender={fallbackRender} onReset={() => {}}>
          {BeforeInput}
          {/* Lexical may be in a drawer. We need to define another BulkUploadProvider to ensure that the bulk upload drawer
          is rendered in the correct depth (not displayed *behind* the current drawer)*/}
          <BulkUploadProvider drawerSlugPrefix={path}>
            <LexicalProvider
              composerKey={pathWithEditDepth}
              editorConfig={editorConfig}
              fieldProps={props}
              isSmallWidthViewport={isSmallWidthViewport}
              key={JSON.stringify({ path, rerenderProviderKey })} // makes sure lexical is completely re-rendered when initialValue changes, bypassing the lexical-internal value memoization. That way, external changes to the form will update the editor. More infos in PR description (https://github.com/payloadcms/payload/pull/5010)
              onChange={handleChange}
              readOnly={disabled}
              value={value}
            />
          </BulkUploadProvider>
          {AfterInput}
        </ErrorBoundary>
        <RenderCustomComponent
          CustomComponent={Description}
          Fallback={<FieldDescription description={description} path={path} />}
        />
      </div>
    </div>
  )
}

function fallbackRender({ error }: { error: Error }) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  return (
    <div className="errorBoundary" role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  )
}

export const RichText: typeof RichTextComponent = RichTextComponent
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/richtext-lexical/src/field/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .rich-text-lexical {
    & > .field-error.tooltip {
      right: auto;
      position: static;
      margin-bottom: 0.2em;
      max-width: fit-content;
    }

    .errorBoundary {
      pre {
        text-wrap: unset;
      }
    }

    &__wrap {
      width: 100%;
      position: relative;
    }

    &--read-only {
      .editor-container {
        .editor {
          @keyframes fadeInBackground {
            from {
              background-color: transparent;
            }
            to {
              background-color: var(--theme-elevation-100);
            }
          }

          animation: fadeInBackground 0.5s ease forwards;
          color: var(--theme-elevation-450);
        }
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/field/index.tsx
Signals: React

```typescript
'use client'

import type { RichTextFieldClient } from 'payload'

import { ShimmerEffect, useConfig } from '@payloadcms/ui'
import React, { lazy, Suspense, useEffect, useState } from 'react'

import type { FeatureProviderClient } from '../features/typesClient.js'
import type { SanitizedClientEditorConfig } from '../lexical/config/types.js'
import type { LexicalRichTextFieldProps } from '../types.js'

import { defaultEditorLexicalConfig } from '../lexical/config/client/default.js'
import { loadClientFeatures } from '../lexical/config/client/loader.js'
import { sanitizeClientEditorConfig } from '../lexical/config/client/sanitize.js'

const RichTextEditor = lazy(() =>
  import('./Field.js').then((module) => ({ default: module.RichText })),
)

export const RichTextField: React.FC<LexicalRichTextFieldProps> = (props) => {
  const {
    admin = {},
    clientFeatures,
    featureClientImportMap = {},
    featureClientSchemaMap,
    field,
    lexicalEditorConfig = defaultEditorLexicalConfig,
    schemaPath,
  } = props

  const { config } = useConfig()

  const [finalSanitizedEditorConfig, setFinalSanitizedEditorConfig] =
    useState<null | SanitizedClientEditorConfig>(null)

  useEffect(() => {
    if (finalSanitizedEditorConfig) {
      return
    }

    const featureProvidersLocal: FeatureProviderClient<any, any>[] = []
    for (const clientFeature of Object.values(clientFeatures)) {
      if (!clientFeature.clientFeatureProvider) {
        continue
      }
      featureProvidersLocal.push(
        clientFeature.clientFeatureProvider(clientFeature.clientFeatureProps),
      ) // Execute the clientFeatureProvider function here, as the server cannot execute functions imported from use client files
    }

    const resolvedClientFeatures = loadClientFeatures({
      config,
      featureClientImportMap,
      featureClientSchemaMap,
      field: field as RichTextFieldClient,
      schemaPath: schemaPath ?? field.name,
      unSanitizedEditorConfig: {
        features: featureProvidersLocal,
        lexical: lexicalEditorConfig,
      },
    })

    setFinalSanitizedEditorConfig(
      sanitizeClientEditorConfig(resolvedClientFeatures, lexicalEditorConfig, admin),
    )
  }, [
    admin,
    clientFeatures,
    config,
    featureClientImportMap,
    featureClientSchemaMap,
    field,
    finalSanitizedEditorConfig,
    lexicalEditorConfig,
    schemaPath,
  ]) // TODO: Optimize this and use useMemo for this in the future. This might break sub-richtext-blocks from the blocks feature. Need to investigate

  return (
    <Suspense fallback={<ShimmerEffect height="35vh" />}>
      {finalSanitizedEditorConfig && (
        <RichTextEditor {...props} editorConfig={finalSanitizedEditorConfig} />
      )}
    </Suspense>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: rscEntry.tsx]---
Location: payload-main/packages/richtext-lexical/src/field/rscEntry.tsx
Signals: React

```typescript
import type { SerializedLexicalNode } from 'lexical'
import type {
  ClientComponentProps,
  FieldPaths,
  RichTextFieldClient,
  RichTextField as RichTextFieldType,
  ServerComponentProps,
} from 'payload'

import { getTranslation } from '@payloadcms/translations'
import { renderField } from '@payloadcms/ui/forms/renderField'
import React from 'react'

import type { SanitizedServerEditorConfig } from '../lexical/config/types.js'
import type {
  LexicalEditorProps,
  LexicalFieldAdminClientProps,
  LexicalRichTextFieldProps,
} from '../types.js'

// eslint-disable-next-line payload/no-imports-from-exports-dir
import { RichTextField } from '../exports/client/index.js'
import { buildInitialState } from '../utilities/buildInitialState.js'
import { initLexicalFeatures } from '../utilities/initLexicalFeatures.js'

export const RscEntryLexicalField: React.FC<
  {
    sanitizedEditorConfig: SanitizedServerEditorConfig
  } & ClientComponentProps &
    Pick<FieldPaths, 'path'> &
    Pick<LexicalEditorProps, 'admin'> &
    ServerComponentProps
> = async (args) => {
  const field: RichTextFieldType = args.field as RichTextFieldType
  const path = args.path ?? (args.clientField as RichTextFieldClient).name
  const schemaPath = args.schemaPath ?? path

  const disabled = args?.readOnly || field?.admin?.readOnly

  if (!(args?.clientField as RichTextFieldClient)?.name) {
    throw new Error('Initialized lexical RSC field without a field name')
  }

  const { clientFeatures, featureClientImportMap, featureClientSchemaMap } = initLexicalFeatures({
    clientFieldSchemaMap: args.clientFieldSchemaMap,
    fieldSchemaMap: args.fieldSchemaMap,
    i18n: args.i18n,
    path,
    payload: args.payload,
    sanitizedEditorConfig: args.sanitizedEditorConfig,
    schemaPath,
  })

  let initialLexicalFormState = {}
  if (args.siblingData?.[field.name]?.root?.children?.length) {
    initialLexicalFormState = await buildInitialState({
      context: {
        id: args.id,
        clientFieldSchemaMap: args.clientFieldSchemaMap,
        collectionSlug: args.collectionSlug,
        disabled,
        documentData: args.data,
        field,
        fieldSchemaMap: args.fieldSchemaMap,
        lexicalFieldSchemaPath: schemaPath,
        operation: args.operation,
        permissions: args.permissions,
        preferences: args.preferences,
        renderFieldFn: renderField,
        req: args.req,
      },
      nodeData: args.siblingData?.[field.name]?.root?.children as SerializedLexicalNode[],
    })
  }

  const placeholderFromArgs = args.admin?.placeholder
  const placeholder = placeholderFromArgs
    ? getTranslation(placeholderFromArgs, args.i18n)
    : undefined

  const admin: LexicalFieldAdminClientProps = {}
  if (placeholder) {
    admin.placeholder = placeholder
  }
  if (args.admin?.hideGutter) {
    admin.hideGutter = true
  }
  if (args.admin?.hideInsertParagraphAtEnd) {
    admin.hideInsertParagraphAtEnd = true
  }
  if (args.admin?.hideAddBlockButton) {
    admin.hideAddBlockButton = true
  }
  if (args.admin?.hideDraggableBlockElement) {
    admin.hideDraggableBlockElement = true
  }

  const props: LexicalRichTextFieldProps = {
    clientFeatures,
    featureClientSchemaMap, // TODO: Does client need this? Why cant this just live in the server
    field: args.clientField as RichTextFieldClient,
    forceRender: args.forceRender,
    initialLexicalFormState,
    lexicalEditorConfig: args.sanitizedEditorConfig.lexical,
    path,
    permissions: args.permissions,
    readOnly: args.readOnly,
    renderedBlocks: args.renderedBlocks,
    schemaPath,
  }
  if (Object.keys(admin).length) {
    props.admin = admin
  }
  if (Object.keys(featureClientImportMap).length) {
    props.featureClientImportMap = featureClientImportMap
  }

  for (const key in props) {
    if (props[key as keyof LexicalRichTextFieldProps] === undefined) {
      delete props[key as keyof LexicalRichTextFieldProps]
    }
  }

  return <RichTextField {...props} />
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/richtext-lexical/src/field/Diff/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .lexical-diff .field-diff-content {
    .html-diff {
      font-family: var(--font-serif);
      font-size: base(0.8);
      letter-spacing: 0.02em;
    }

    blockquote {
      font-size: base(0.8);
      margin-block: base(0.8);
      margin-inline: 0;
      padding-inline-start: base(0.6);
      padding-block: base(0.2);
      position: relative; // Required for absolute positioning of ::after

      &::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        inset-inline-start: 0;
        width: base(0.2);
        background-color: var(--theme-elevation-150);
      }

      &:has([data-match-type='create'])::after {
        background-color: var(--theme-success-150);
      }

      &:has([data-match-type='delete'])::after {
        background-color: var(--theme-error-150);
      }
    }

    a {
      border-bottom: 1px dotted;
      text-decoration: none;
    }

    h1 {
      padding: base(0.7) 0px base(0.55);
      line-height: base(1.5);
      font-weight: 600;
      font-size: base(1.4);
      font-family: var(--font-body);
    }
    h2 {
      padding: base(0.7) 0px base(0.5);
      line-height: base(1.4);
      font-weight: 600;
      font-size: base(1.25);
      font-family: var(--font-body);
    }
    h3 {
      padding: base(0.6) 0px base(0.45);
      line-height: base(1.4);
      font-weight: 600;
      font-size: base(1.1);
      font-family: var(--font-body);
    }
    h4 {
      padding: base(0.4) 0px base(0.35);
      line-height: base(1.5);
      font-weight: 600;
      font-size: base(1.05);
      font-family: var(--font-body);
    }
    h5 {
      padding: base(0.3) 0px base(0.3);
      line-height: base(1.4);
      font-weight: 600;
      font-size: base(0.9);
      font-family: var(--font-body);
    }

    h6 {
      padding: base(0.55) 0px base(0.25);
      line-height: base(0.5);
      font-weight: 600;
      font-size: base(0.75);
      font-family: var(--font-body);
    }

    p {
      padding: base(0.4) 0 base(0.4);

      // First paraagraph has no top padding
      &:first-child {
        padding: 0 0 base(0.4);
      }
    }

    ul,
    ol {
      padding-top: base(0.4);
      padding-bottom: base(0.4);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/field/Diff/index.tsx
Signals: React

```typescript
import type { SerializedEditorState } from 'lexical'
import type { RichTextFieldDiffServerComponent } from 'payload'

import { FieldDiffContainer, getHTMLDiffComponents } from '@payloadcms/ui/rsc'

import './index.scss'
import '../bundled.css'

import React from 'react'

import type { HTMLConvertersFunctionAsync } from '../../features/converters/lexicalToHtml/async/types.js'

import { convertLexicalToHTMLAsync } from '../../features/converters/lexicalToHtml/async/index.js'
import { getPayloadPopulateFn } from '../../features/converters/utilities/payloadPopulateFn.js'
import { LinkDiffHTMLConverterAsync } from './converters/link.js'
import { ListItemDiffHTMLConverterAsync } from './converters/listitem/index.js'
import { RelationshipDiffHTMLConverterAsync } from './converters/relationship/index.js'
import { UnknownDiffHTMLConverterAsync } from './converters/unknown/index.js'
import { UploadDiffHTMLConverterAsync } from './converters/upload/index.js'

const baseClass = 'lexical-diff'

export const LexicalDiffComponent: RichTextFieldDiffServerComponent = async (args) => {
  const {
    comparisonValue: valueFrom,
    field,
    i18n,
    locale,
    nestingLevel,
    req,
    versionValue: valueTo,
  } = args

  const converters: HTMLConvertersFunctionAsync = ({ defaultConverters }) => ({
    ...defaultConverters,
    ...LinkDiffHTMLConverterAsync({}),
    ...ListItemDiffHTMLConverterAsync,
    ...UploadDiffHTMLConverterAsync({ i18n, req }),
    ...RelationshipDiffHTMLConverterAsync({ i18n, req }),
    ...UnknownDiffHTMLConverterAsync({ i18n, req }),
  })

  const payloadPopulateFn = await getPayloadPopulateFn({
    currentDepth: 0,
    depth: 1,
    req,
  })
  const fromHTML = await convertLexicalToHTMLAsync({
    converters,
    data: valueFrom as SerializedEditorState,
    disableContainer: true,
    populate: payloadPopulateFn,
  })

  const toHTML = await convertLexicalToHTMLAsync({
    converters,
    data: valueTo as SerializedEditorState,
    disableContainer: true,
    populate: payloadPopulateFn,
  })

  const { From, To } = getHTMLDiffComponents({
    // Ensure empty paragraph is displayed for empty rich text fields - otherwise, toHTML may be displayed in the wrong column
    fromHTML: fromHTML?.length ? fromHTML : '<p></p>',
    toHTML: toHTML?.length ? toHTML : '<p></p>',
  })

  return (
    <FieldDiffContainer
      className={baseClass}
      From={From}
      i18n={i18n}
      label={{
        label: field.label,
        locale,
      }}
      nestingLevel={nestingLevel}
      To={To}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: link.ts]---
Location: payload-main/packages/richtext-lexical/src/field/Diff/converters/link.ts

```typescript
import { createHash } from 'crypto'

import type {
  HTMLConvertersAsync,
  HTMLPopulateFn,
} from '../../../features/converters/lexicalToHtml/async/types.js'
import type { SerializedAutoLinkNode, SerializedLinkNode } from '../../../nodeTypes.js'

export const LinkDiffHTMLConverterAsync: (args: {
  internalDocToHref?: (args: {
    linkNode: SerializedLinkNode
    populate?: HTMLPopulateFn
  }) => Promise<string> | string
}) => HTMLConvertersAsync<SerializedAutoLinkNode | SerializedLinkNode> = ({
  internalDocToHref,
}) => ({
  autolink: async ({ node, nodesToHTML, providedStyleTag }) => {
    const children = (
      await nodesToHTML({
        nodes: node.children,
      })
    ).join('')

    // hash fields to ensure they are diffed if they change
    const nodeFieldsHash = createHash('sha256').update(JSON.stringify(node.fields)).digest('hex')

    return `<a${providedStyleTag} data-fields-hash="${nodeFieldsHash}" data-enable-match="true" href="${node.fields.url}"${node.fields.newTab ? ' rel="noopener noreferrer" target="_blank"' : ''}>
        ${children}
      </a>`
  },
  link: async ({ node, nodesToHTML, populate, providedStyleTag }) => {
    const children = (
      await nodesToHTML({
        nodes: node.children,
      })
    ).join('')

    let href: string = node.fields.url ?? ''
    if (node.fields.linkType === 'internal') {
      if (internalDocToHref) {
        href = await internalDocToHref({ linkNode: node, populate })
      } else {
        console.error(
          'Lexical => HTML converter: Link converter: found internal link, but internalDocToHref is not provided',
        )
        href = '#' // fallback
      }
    }

    // hash fields to ensure they are diffed if they change
    const nodeFieldsHash = createHash('sha256')
      .update(JSON.stringify(node.fields ?? {}))
      .digest('hex')

    return `<a${providedStyleTag} data-fields-hash="${nodeFieldsHash}" data-enable-match="true" href="${href}"${node.fields.newTab ? ' rel="noopener noreferrer" target="_blank"' : ''}>
        ${children}
      </a>`
  },
})
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/richtext-lexical/src/field/Diff/converters/listitem/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .lexical-diff {
    ul.list-check {
      padding-left: 0;
    }

    .checkboxItem {
      list-style-type: none;

      &__wrapper {
        display: flex;
        align-items: center;
      }

      &__icon {
        width: 16px;
        height: 16px;
        margin-right: 8px; // Spacing before label text
        border: 1px solid var(--theme-text);
        border-radius: 3px;
        display: flex;
        align-items: center;
        justify-content: center;
        // Because the checkbox is non-interactive:
        pointer-events: none;

        .icon--check {
          height: 11px;
        }

        &[data-match-type='create'] {
          border-color: var(--diff-create-pill-color);
        }

        &[data-match-type='delete'] {
          border-color: var(--diff-delete-pill-color);
        }
      }

      &--nested {
        margin-left: 1.5rem;
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/field/Diff/converters/listitem/index.tsx

```typescript
import { CheckIcon } from '@payloadcms/ui/rsc'

import type { HTMLConvertersAsync } from '../../../../features/converters/lexicalToHtml/async/types.js'
import type { SerializedListItemNode } from '../../../../nodeTypes.js'

import './index.scss'

export const ListItemDiffHTMLConverterAsync: HTMLConvertersAsync<SerializedListItemNode> = {
  listitem: async ({ node, nodesToHTML, parent, providedCSSString }) => {
    const hasSubLists = node.children.some((child) => child.type === 'list')

    const children = (
      await nodesToHTML({
        nodes: node.children,
      })
    ).join('')

    if ('listType' in parent && parent?.listType === 'check') {
      const ReactDOMServer = (await import('react-dom/server')).default

      const JSX = (
        <li
          aria-checked={node.checked ? true : false}
          className={`checkboxItem ${node.checked ? 'checkboxItem--checked' : 'checkboxItem--unchecked'}${
            hasSubLists ? ' checkboxItem--nested' : ''
          }`}
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
          role="checkbox"
          tabIndex={-1}
          value={node.value}
        >
          {hasSubLists ? (
            // When sublists exist, just render them safely as HTML
            <div dangerouslySetInnerHTML={{ __html: children }} />
          ) : (
            // Otherwise, show our custom styled checkbox
            <div className="checkboxItem__wrapper">
              <div
                className="checkboxItem__icon"
                data-checked={node.checked}
                data-enable-match="true"
              >
                {node.checked && <CheckIcon />}
              </div>
              <span className="checkboxItem__label">{children}</span>
            </div>
          )}
        </li>
      )

      const html = ReactDOMServer.renderToStaticMarkup(JSX)

      // Add style="list-style-type: none;${providedCSSString}" to html
      const styleIndex = html.indexOf('class="list-item-checkbox')
      const classIndex = html.indexOf('class="list-item-checkbox', styleIndex)
      const classEndIndex = html.indexOf('"', classIndex + 6)
      const className = html.substring(classIndex, classEndIndex)
      const classNameWithStyle = `${className} style="list-style-type: none;${providedCSSString}"`
      const htmlWithStyle = html.replace(className, classNameWithStyle)

      return htmlWithStyle
    } else {
      return `<li
          class="${hasSubLists ? 'nestedListItem' : ''}"
          style="${hasSubLists ? `list-style-type: none;${providedCSSString}` : providedCSSString}"
          value="${node.value}"
          data-enable-match="true"
        >${children}</li>`
    }
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/richtext-lexical/src/field/Diff/converters/relationship/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .lexical-diff .lexical-relationship-diff {
    @extend %body;
    @include shadow-sm;
    min-width: calc(var(--base) * 8);
    max-width: fit-content;

    display: flex;
    align-items: center;
    background-color: var(--theme-input-bg);
    border-radius: $style-radius-s;
    border: 1px solid var(--theme-elevation-100);
    position: relative;
    font-family: var(--font-body);
    margin-block: base(0.5);
    max-height: calc(var(--base) * 4);
    padding: base(0.6);

    &[data-match-type='create'] {
      border-color: var(--diff-create-pill-border);
      color: var(--diff-create-parent-color);

      .lexical-relationship-diff__collectionLabel {
        color: var(--diff-create-link-color);
      }

      .lexical-relationship-diff__title * {
        color: var(--diff-create-parent-color);
      }
    }

    &[data-match-type='delete'] {
      border-color: var(--diff-delete-pill-border);
      color: var(--diff-delete-parent-color);
      text-decoration-line: none;
      background-color: var(--diff-delete-pill-bg);

      .lexical-relationship-diff__collectionLabel {
        color: var(--diff-delete-link-color);
      }

      * {
        text-decoration-line: none;
        color: var(--diff-delete-parent-color);
      }
    }

    &__card {
      display: flex;
      flex-direction: column;
      width: 100%;
      flex-grow: 1;
      display: flex;
      align-items: flex-start;
      flex-direction: column;
      justify-content: space-between;
    }

    &__title {
      display: flex;
      flex-direction: row;
      font-weight: 600;
    }

    &__collectionLabel {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/field/Diff/converters/relationship/index.tsx

```typescript
import type { FileData, PayloadRequest, TypeWithID } from 'payload'

import { getTranslation, type I18nClient } from '@payloadcms/translations'

import './index.scss'

import { formatAdminURL } from 'payload/shared'

import type { HTMLConvertersAsync } from '../../../../features/converters/lexicalToHtml/async/types.js'
import type { SerializedRelationshipNode } from '../../../../nodeTypes.js'

const baseClass = 'lexical-relationship-diff'

export const RelationshipDiffHTMLConverterAsync: (args: {
  i18n: I18nClient
  req: PayloadRequest
}) => HTMLConvertersAsync<SerializedRelationshipNode> = ({ i18n, req }) => {
  return {
    relationship: async ({ node, populate, providedCSSString }) => {
      let data: (Record<string, any> & TypeWithID) | undefined = undefined

      const id = typeof node.value === 'object' ? node.value.id : node.value

      // If there's no valid upload data, populate return an empty string
      if (typeof node.value !== 'object') {
        if (!populate) {
          return ''
        }
        data = await populate<FileData & TypeWithID>({
          id,
          collectionSlug: node.relationTo,
        })
      } else {
        data = node.value as unknown as FileData & TypeWithID
      }

      const relatedCollection = req.payload.collections[node.relationTo]?.config

      const ReactDOMServer = (await import('react-dom/server')).default

      const JSX = (
        <div
          className={`${baseClass}${providedCSSString}`}
          data-enable-match="true"
          data-id={id}
          data-slug={node.relationTo}
        >
          <div className={`${baseClass}__card`}>
            <div className={`${baseClass}__collectionLabel`}>
              {i18n.t('fields:labelRelationship', {
                label: relatedCollection?.labels?.singular
                  ? getTranslation(relatedCollection?.labels?.singular, i18n)
                  : relatedCollection?.slug,
              })}
            </div>
            {data &&
            relatedCollection?.admin?.useAsTitle &&
            data[relatedCollection.admin.useAsTitle] ? (
              <strong className={`${baseClass}__title`} data-enable-match="false">
                <a
                  className={`${baseClass}__link`}
                  data-enable-match="false"
                  href={formatAdminURL({
                    adminRoute: req.payload.config.routes.admin,
                    path: `/collections/${relatedCollection?.slug}/${data.id}`,
                    serverURL: req.payload.config.serverURL,
                  })}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {data[relatedCollection.admin.useAsTitle]}
                </a>
              </strong>
            ) : (
              <strong>{id as string}</strong>
            )}
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

---[FILE: index.scss]---
Location: payload-main/packages/richtext-lexical/src/field/Diff/converters/unknown/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .lexical-diff .lexical-unknown-diff {
    @extend %body;
    @include shadow-sm;
    max-width: fit-content;
    display: flex;
    align-items: center;
    background: var(--theme-input-bg);
    border-radius: $style-radius-s;
    border: 1px solid var(--theme-elevation-100);
    position: relative;
    font-family: var(--font-body);
    margin-block: base(0.5);
    max-height: calc(var(--base) * 4);
    padding: base(0.25);

    &__specifier {
      font-family: 'SF Mono', Menlo, Consolas, Monaco, monospace;
    }

    &[data-match-type='create'] {
      border-color: var(--diff-create-pill-border);
      color: var(--diff-create-parent-color);
    }

    &[data-match-type='delete'] {
      border-color: var(--diff-delete-pill-border);
      color: var(--diff-delete-parent-color);
      text-decoration-line: none;
      background-color: var(--diff-delete-pill-bg);

      * {
        text-decoration-line: none;
        color: var(--diff-delete-parent-color);
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/field/Diff/converters/unknown/index.tsx

```typescript
import type { LexicalNode } from 'lexical'
import type { PayloadRequest } from 'payload'

import { type I18nClient } from '@payloadcms/translations'

import './index.scss'

import { createHash } from 'crypto'

import type { HTMLConvertersAsync } from '../../../../features/converters/lexicalToHtml/async/types.js'
import type { SerializedBlockNode } from '../../../../nodeTypes.js'

const baseClass = 'lexical-unknown-diff'

export const UnknownDiffHTMLConverterAsync: (args: {
  i18n: I18nClient
  req: PayloadRequest
}) => HTMLConvertersAsync<LexicalNode> = ({ i18n, req }) => {
  return {
    unknown: async ({ node, providedCSSString }) => {
      const ReactDOMServer = (await import('react-dom/server')).default

      // hash fields to ensure they are diffed if they change
      const nodeFieldsHash = createHash('sha256')
        .update(JSON.stringify(node ?? {}))
        .digest('hex')

      let nodeType = node.type

      let nodeTypeSpecifier: null | string = null

      if (node.type === 'block') {
        nodeTypeSpecifier = (node as SerializedBlockNode).fields.blockType
        nodeType = 'Block'
      } else if (node.type === 'inlineBlock') {
        nodeTypeSpecifier = (node as SerializedBlockNode).fields.blockType
        nodeType = 'InlineBlock'
      }

      const JSX = (
        <div
          className={`${baseClass}${providedCSSString}`}
          data-enable-match="true"
          data-fields-hash={`${nodeFieldsHash}`}
        >
          {nodeTypeSpecifier && (
            <span className={`${baseClass}__specifier`}>{nodeTypeSpecifier}&nbsp;</span>
          )}
          <span>{nodeType}</span>
          <div className={`${baseClass}__meta`}>
            <br />
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

---[FILE: index.scss]---
Location: payload-main/packages/richtext-lexical/src/field/Diff/converters/upload/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .lexical-diff {
    .lexical-upload-diff {
      @extend %body;
      @include shadow-sm;
      min-width: calc(var(--base) * 10);
      max-width: fit-content;
      display: flex;
      align-items: center;
      background-color: var(--theme-input-bg);
      border-radius: $style-radius-s;
      border: 1px solid var(--theme-elevation-100);
      position: relative;
      font-family: var(--font-body);
      margin-block: base(0.5);
      max-height: calc(var(--base) * 3);
      padding: base(0.6);

      &[data-match-type='create'] {
        border-color: var(--diff-create-pill-border);
        color: var(--diff-create-parent-color);

        * {
          color: var(--diff-create-parent-color);
        }

        .lexical-upload-diff__meta {
          color: var(--diff-create-link-color);
          * {
            color: var(--diff-create-link-color);
          }
        }

        .lexical-upload-diff__thumbnail {
          border-radius: 0px;
          border-color: var(--diff-create-pill-border);
          background-color: none;
        }
      }

      &[data-match-type='delete'] {
        border-color: var(--diff-delete-pill-border);
        text-decoration-line: none;
        color: var(--diff-delete-parent-color);
        background-color: var(--diff-delete-pill-bg);

        .lexical-upload-diff__meta {
          color: var(--diff-delete-link-color);
          * {
            color: var(--diff-delete-link-color);
          }
        }

        * {
          text-decoration-line: none;
          color: var(--diff-delete-parent-color);
        }

        .lexical-upload-diff__thumbnail {
          border-radius: 0px;
          border-color: var(--diff-delete-pill-border);
          background-color: none;
        }
      }

      &__card {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
      }

      &__thumbnail {
        width: calc(var(--base) * 3 - base(0.6) * 2);
        height: calc(var(--base) * 3 - base(0.6) * 2);
        position: relative;
        overflow: hidden;
        flex-shrink: 0;
        border-radius: 0px;
        border: 1px solid var(--theme-elevation-100);

        img,
        svg {
          position: absolute;
          object-fit: cover;
          width: 100%;
          height: 100%;
          border-radius: 0px;
        }
      }

      &__info {
        flex-grow: 1;
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        padding: calc(var(--base) * 0.25) calc(var(--base) * 0.75);
        justify-content: space-between;
        font-weight: 400;

        strong {
          font-weight: 600;
        }
      }

      &__meta {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
```

--------------------------------------------------------------------------------

````
