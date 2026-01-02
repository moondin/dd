---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 303
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 303 of 695)

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
Location: payload-main/packages/richtext-slate/src/field/index.tsx
Signals: React

```typescript
'use client'

import { ShimmerEffect, useClientFunctions } from '@payloadcms/ui'
import React, { lazy, Suspense, useEffect, useState } from 'react'

import type { RichTextPlugin, SlateFieldProps } from '../types.js'
import type { EnabledFeatures } from './types.js'

import { SlatePropsProvider } from '../utilities/SlatePropsProvider.js'
import { createFeatureMap } from './createFeatureMap.js'

const RichTextEditor = lazy(() =>
  import('./RichText.js').then((module) => ({
    default: module.RichText,
  })),
)

export const RichTextField: React.FC<SlateFieldProps> = (props) => {
  const { componentMap, schemaPath } = props

  const clientFunctions = useClientFunctions()
  const [hasLoadedPlugins, setHasLoadedPlugins] = useState(false)

  const [features] = useState<EnabledFeatures>(() => {
    return createFeatureMap(new Map(Object.entries(componentMap)))
  })

  const [plugins, setPlugins] = useState<RichTextPlugin[]>([])

  useEffect(() => {
    if (!hasLoadedPlugins) {
      const plugins: RichTextPlugin[] = []

      Object.entries(clientFunctions).forEach(([key, plugin]) => {
        if (key.startsWith(`slatePlugin.${schemaPath}.`)) {
          plugins.push(plugin)
        }
      })

      if (plugins.length === features.plugins.length) {
        setPlugins(plugins)
        setHasLoadedPlugins(true)
      }
    }
  }, [hasLoadedPlugins, clientFunctions, schemaPath, features.plugins.length])

  if (!hasLoadedPlugins) {
    return (
      <SlatePropsProvider schemaPath={schemaPath}>
        {Array.isArray(features.plugins) &&
          features.plugins.map((Plugin, i) => {
            return <React.Fragment key={i}>{Plugin}</React.Fragment>
          })}
      </SlatePropsProvider>
    )
  }

  return (
    <Suspense fallback={<ShimmerEffect height="35vh" />}>
      <SlatePropsProvider schemaPath={schemaPath}>
        <RichTextEditor
          {...props}
          elements={features.elements}
          leaves={features.leaves}
          plugins={plugins}
        />
      </SlatePropsProvider>
    </Suspense>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: mergeCustomFunctions.tsx]---
Location: payload-main/packages/richtext-slate/src/field/mergeCustomFunctions.tsx

```typescript
export default (enabledFunctions, builtInFunctions) => {
  const formattedEnabledFunctions = [...enabledFunctions]

  if (enabledFunctions.indexOf('ul') > -1 || enabledFunctions.indexOf('ol') > -1) {
    formattedEnabledFunctions.push('li')
  }

  return formattedEnabledFunctions.reduce((resultingFunctions, func) => {
    if (typeof func === 'object' && func.name) {
      return {
        ...resultingFunctions,
        [func.name]: func,
      }
    }

    if (typeof func === 'string' && builtInFunctions[func]) {
      return {
        ...resultingFunctions,
        [func]: builtInFunctions[func],
      }
    }

    return resultingFunctions
  }, {})
}
```

--------------------------------------------------------------------------------

---[FILE: RichText.tsx]---
Location: payload-main/packages/richtext-slate/src/field/RichText.tsx
Signals: React

```typescript
'use client'

import type { PayloadRequest } from 'payload'
import type { BaseEditor, BaseOperation } from 'slate'
import type { HistoryEditor } from 'slate-history'
import type { ReactEditor } from 'slate-react'

import { getTranslation } from '@payloadcms/translations'
import {
  FieldDescription,
  FieldError,
  FieldLabel,
  RenderCustomComponent,
  useEditDepth,
  useField,
  useTranslation,
} from '@payloadcms/ui'
import { mergeFieldStyles } from '@payloadcms/ui/shared'
import { isHotkey } from 'is-hotkey'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { createEditor, Node, Element as SlateElement, Text, Transforms } from 'slate'
import { withHistory } from 'slate-history'
import { Editable, Slate, withReact } from 'slate-react'

import type { ElementNode, TextNode } from '../types.js'
import type { LoadedSlateFieldProps } from './types.js'

import { defaultRichTextValue } from '../data/defaultValue.js'
import { richTextValidate } from '../data/validation.js'
import { listTypes } from './elements/listTypes.js'
import { hotkeys } from './hotkeys.js'
import { toggleLeaf } from './leaves/toggle.js'
import { withEnterBreakOut } from './plugins/withEnterBreakOut.js'
import { withHTML } from './plugins/withHTML.js'
import { ElementButtonProvider } from './providers/ElementButtonProvider.js'
import { ElementProvider } from './providers/ElementProvider.js'
import { LeafButtonProvider } from './providers/LeafButtonProvider.js'
import { LeafProvider } from './providers/LeafProvider.js'
import './index.scss'

const baseClass = 'rich-text'

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & HistoryEditor & ReactEditor
    Element: ElementNode
    Text: TextNode
  }
}

const RichTextField: React.FC<LoadedSlateFieldProps> = (props) => {
  const {
    elements,
    field,
    field: {
      name,
      admin: { className, description, placeholder, readOnly: readOnlyFromAdmin } = {},
      label,
      required,
    },
    leaves,
    path: pathFromProps,
    plugins,
    readOnly: readOnlyFromTopLevelProps,
    schemaPath: schemaPathFromProps,
    validate = richTextValidate,
  } = props

  const schemaPath = schemaPathFromProps ?? name

  const readOnlyFromProps = readOnlyFromTopLevelProps || readOnlyFromAdmin

  const { i18n } = useTranslation()
  const editorRef = useRef(null)
  const toolbarRef = useRef(null)

  const drawerDepth = useEditDepth()
  const drawerIsOpen = drawerDepth > 1

  const memoizedValidate = useCallback(
    (value, validationOptions) => {
      if (typeof validate === 'function') {
        return validate(value, {
          ...validationOptions,
          req: {
            t: i18n.t,
          } as PayloadRequest,
          required,
        })
      }
    },
    [validate, required, i18n],
  )

  const {
    customComponents: { Description, Error, Label } = {},
    disabled: disabledFromField,
    initialValue,
    path,
    setValue,
    showError,
    value,
  } = useField({
    potentiallyStalePath: pathFromProps,
    validate: memoizedValidate,
  })

  const disabled = readOnlyFromProps || disabledFromField

  const editor = useMemo(() => {
    let CreatedEditor = withEnterBreakOut(withHistory(withReact(createEditor())))

    CreatedEditor = withHTML(CreatedEditor)

    if (plugins.length) {
      CreatedEditor = plugins.reduce((editorWithPlugins, plugin) => {
        return plugin(editorWithPlugins)
      }, CreatedEditor)
    }

    return CreatedEditor
  }, [plugins])

  const renderElement = useCallback(
    ({ attributes, children, element }) => {
      // return <div {...attributes}>{children}</div>

      const matchedElement = elements[element.type]
      const Element = matchedElement?.Element

      let attr = { ...attributes }

      // this converts text alignment to margin when dealing with void elements
      if (element.textAlign) {
        if (element.type === 'relationship' || element.type === 'upload') {
          switch (element.textAlign) {
            case 'center':
              attr = { ...attr, style: { marginLeft: 'auto', marginRight: 'auto' } }
              break
            case 'left':
              attr = { ...attr, style: { marginRight: 'auto' } }
              break
            case 'right':
              attr = { ...attr, style: { marginLeft: 'auto' } }
              break
            default:
              attr = { ...attr, style: { textAlign: element.textAlign } }
              break
          }
        } else if (element.type === 'li') {
          switch (element.textAlign) {
            case 'center':
              attr = { ...attr, style: { listStylePosition: 'inside', textAlign: 'center' } }
              break
            case 'right':
              attr = { ...attr, style: { listStylePosition: 'inside', textAlign: 'right' } }
              break
            case 'left':
            default:
              attr = { ...attr, style: { listStylePosition: 'outside', textAlign: 'left' } }
              break
          }
        } else {
          attr = { ...attr, style: { textAlign: element.textAlign } }
        }
      }

      if (Element) {
        const el = (
          <ElementProvider
            attributes={attr}
            childNodes={children}
            editorRef={editorRef}
            element={element}
            fieldProps={props}
            path={path}
            schemaPath={schemaPath}
          >
            {Element}
          </ElementProvider>
        )

        return el
      }

      return <div {...attr}>{children}</div>
    },
    [elements, path, props, schemaPath],
  )

  const renderLeaf = useCallback(
    ({ attributes, children, leaf }) => {
      const matchedLeaves = Object.entries(leaves).filter(([leafName]) => leaf[leafName])

      if (matchedLeaves.length > 0) {
        return matchedLeaves.reduce(
          (result, [, leafConfig], i) => {
            if (leafConfig?.Leaf) {
              const Leaf = leafConfig.Leaf

              return (
                <LeafProvider
                  attributes={attributes}
                  editorRef={editorRef}
                  fieldProps={props}
                  key={i}
                  leaf={leaf}
                  path={path}
                  result={result}
                  schemaPath={schemaPath}
                >
                  {Leaf}
                </LeafProvider>
              )
            }

            return result
          },
          <span {...attributes}>{children}</span>,
        )
      }

      return <span {...attributes}>{children}</span>
    },
    [path, props, schemaPath, leaves],
  )

  // All slate changes fire the onChange event
  // including selection changes
  // so we will filter the set_selection operations out
  // and only fire setValue when onChange is because of value
  const handleChange = useCallback(
    (val: unknown) => {
      const ops = editor?.operations.filter((o: BaseOperation) => {
        if (o) {
          return o.type !== 'set_selection'
        }
        return false
      })

      if (ops && Array.isArray(ops) && ops.length > 0) {
        if (!disabled && val !== defaultRichTextValue && val !== value) {
          setValue(val)
        }
      }
    },
    [editor?.operations, disabled, setValue, value],
  )

  useEffect(() => {
    function setClickableState(clickState: 'disabled' | 'enabled') {
      const selectors = 'button, a, [role="button"]'
      const toolbarButtons: (HTMLAnchorElement | HTMLButtonElement)[] =
        toolbarRef.current?.querySelectorAll(selectors)

      ;(toolbarButtons || []).forEach((child) => {
        const isButton = child.tagName === 'BUTTON'
        const isDisabling = clickState === 'disabled'
        child.setAttribute('tabIndex', isDisabling ? '-1' : '0')
        if (isButton) {
          child.setAttribute('disabled', isDisabling ? 'disabled' : null)
        }
      })
    }

    if (disabled) {
      setClickableState('disabled')
    }

    return () => {
      if (disabled) {
        setClickableState('enabled')
      }
    }
  }, [disabled])

  // useEffect(() => {
  //   // If there is a change to the initial value, we need to reset Slate history
  //   // and clear selection because the old selection may no longer be valid
  //   // as returned JSON may be modified in hooks and have a different shape
  //   if (editor.selection) {
  //     console.log('deselecting');
  //     ReactEditor.deselect(editor);
  //   }
  // }, [path, editor]);

  const styles = useMemo(() => mergeFieldStyles(field), [field])

  const classes = [
    baseClass,
    'field-type',
    className,
    showError && 'error',
    disabled && `${baseClass}--read-only`,
  ]
    .filter(Boolean)
    .join(' ')

  let valueToRender = value

  if (typeof valueToRender === 'string') {
    try {
      const parsedJSON = JSON.parse(valueToRender)
      valueToRender = parsedJSON
    } catch (err) {
      valueToRender = null
    }
  }

  if (!valueToRender) {
    valueToRender = defaultRichTextValue
  }

  return (
    <div className={classes} style={styles}>
      {Label || <FieldLabel label={label} path={path} required={required} />}
      <div className={`${baseClass}__wrap`}>
        <RenderCustomComponent
          CustomComponent={Error}
          Fallback={<FieldError path={path} showError={showError} />}
        />
        <Slate
          editor={editor}
          key={JSON.stringify({ initialValue, path })} // makes sure slate is completely re-rendered when initialValue changes, bypassing the slate-internal value memoization. That way, external changes to the form will update the editor
          onChange={handleChange}
          value={valueToRender as any[]}
        >
          <div className={`${baseClass}__wrapper`}>
            {Object.keys(elements)?.length + Object.keys(leaves)?.length > 0 && (
              <div
                className={[`${baseClass}__toolbar`, drawerIsOpen && `${baseClass}__drawerIsOpen`]
                  .filter(Boolean)
                  .join(' ')}
                ref={toolbarRef}
              >
                <div className={`${baseClass}__toolbar-wrap`}>
                  {Object.values(elements).map((element) => {
                    const Button = element?.Button

                    if (Button) {
                      return (
                        <ElementButtonProvider
                          disabled={disabled}
                          fieldProps={props}
                          key={element.name}
                          path={path}
                          schemaPath={schemaPath}
                        >
                          {Button}
                        </ElementButtonProvider>
                      )
                    }

                    return null
                  })}
                  {Object.values(leaves).map((leaf) => {
                    const Button = leaf?.Button

                    if (Button) {
                      return (
                        <LeafButtonProvider
                          fieldProps={props}
                          key={leaf.name}
                          path={path}
                          schemaPath={schemaPath}
                        >
                          {Button}
                        </LeafButtonProvider>
                      )
                    }

                    return null
                  })}
                </div>
              </div>
            )}
            <div className={`${baseClass}__editor`} ref={editorRef}>
              <Editable
                className={`${baseClass}__input`}
                id={`field-${path.replace(/\./g, '__')}`}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    if (event.shiftKey) {
                      event.preventDefault()
                      editor.insertText('\n')
                    } else {
                      const selectedElement = Node.descendant(
                        editor,
                        editor.selection.anchor.path.slice(0, -1),
                      )

                      if (SlateElement.isElement(selectedElement)) {
                        // Allow hard enter to "break out" of certain elements
                        if (editor.shouldBreakOutOnEnter(selectedElement)) {
                          event.preventDefault()
                          const selectedLeaf = Node.descendant(editor, editor.selection.anchor.path)

                          if (
                            Text.isText(selectedLeaf) &&
                            String(selectedLeaf.text).length === editor.selection.anchor.offset
                          ) {
                            Transforms.insertNodes(editor, { children: [{ text: '' }] })
                          } else {
                            Transforms.splitNodes(editor)
                            Transforms.setNodes(editor, {})
                          }
                        }
                      }
                    }
                  }

                  if (event.key === 'Backspace') {
                    const selectedElement = Node.descendant(
                      editor,
                      editor.selection.anchor.path.slice(0, -1),
                    )

                    if (SlateElement.isElement(selectedElement) && selectedElement.type === 'li') {
                      const selectedLeaf = Node.descendant(editor, editor.selection.anchor.path)
                      if (Text.isText(selectedLeaf) && String(selectedLeaf.text).length === 0) {
                        event.preventDefault()
                        Transforms.unwrapNodes(editor, {
                          match: (n) => SlateElement.isElement(n) && listTypes.includes(n.type),
                          mode: 'lowest',
                          split: true,
                        })

                        Transforms.setNodes(editor, { type: undefined })
                      }
                    } else if (editor.isVoid(selectedElement)) {
                      Transforms.removeNodes(editor)
                    }
                  }

                  Object.keys(hotkeys).forEach((hotkey) => {
                    if (isHotkey(hotkey, event as any)) {
                      event.preventDefault()
                      const mark = hotkeys[hotkey]
                      toggleLeaf(editor, mark)
                    }
                  })
                }}
                placeholder={getTranslation(placeholder, i18n)}
                readOnly={disabled}
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                spellCheck
              />
            </div>
          </div>
        </Slate>
        <RenderCustomComponent
          CustomComponent={Description}
          Fallback={<FieldDescription description={description} path={path} />}
        />
      </div>
    </div>
  )
}

export const RichText = RichTextField
```

--------------------------------------------------------------------------------

---[FILE: rscEntry.tsx]---
Location: payload-main/packages/richtext-slate/src/field/rscEntry.tsx
Signals: React

```typescript
import type {
  ClientComponentProps,
  ClientField,
  Field,
  FieldPaths,
  RichTextFieldClient,
  ServerComponentProps,
} from 'payload'

import { RenderServerComponent } from '@payloadcms/ui/elements/RenderServerComponent'
import { createClientFields } from 'payload'
import React from 'react'

import type { AdapterArguments, RichTextCustomElement, RichTextCustomLeaf } from '../types.js'

// eslint-disable-next-line payload/no-imports-from-exports-dir
import { RichTextField } from '../exports/client/index.js'
import { elements as elementTypes } from '../field/elements/index.js'
import { defaultLeaves as leafTypes } from '../field/leaves/index.js'
import { linkFieldsSchemaPath } from './elements/link/shared.js'
import { uploadFieldsSchemaPath } from './elements/upload/shared.js'

/**
 * @deprecated - slate will be removed in 4.0. Please [migrate our new, lexical-based rich text editor](https://payloadcms.com/docs/rich-text/migration#migrating-from-slate).
 */
export const RscEntrySlateField: React.FC<
  {
    args: AdapterArguments
  } & ClientComponentProps &
    Pick<FieldPaths, 'path'> &
    ServerComponentProps
> = ({
  args,
  clientField,
  forceRender,
  i18n,
  path,
  payload,
  readOnly,
  renderedBlocks,
  schemaPath,
}) => {
  const componentMap: Map<string, ClientField[] | React.ReactNode> = new Map()

  const clientProps = {
    schemaPath,
  }

  ;(args?.admin?.leaves || Object.values(leafTypes)).forEach((leaf) => {
    let leafObject: RichTextCustomLeaf

    if (typeof leaf === 'object' && leaf !== null) {
      leafObject = leaf
    } else if (typeof leaf === 'string' && leafTypes[leaf]) {
      leafObject = leafTypes[leaf]
    }

    if (leafObject) {
      const LeafButton = leafObject.Button
      const LeafComponent = leafObject.Leaf

      componentMap.set(
        `leaf.button.${leafObject.name}`,
        RenderServerComponent({
          clientProps,
          Component: LeafButton,
          importMap: payload.importMap,
        }),
      )

      componentMap.set(
        `leaf.component.${leafObject.name}`,
        RenderServerComponent({
          clientProps,
          Component: LeafComponent,
          importMap: payload.importMap,
        }),
      )

      if (Array.isArray(leafObject.plugins)) {
        leafObject.plugins.forEach((Plugin, i) => {
          componentMap.set(
            `leaf.plugin.${leafObject.name}.${i}`,
            RenderServerComponent({
              clientProps,
              Component: Plugin,
              importMap: payload.importMap,
            }),
          )
        })
      }
    }
  })
  ;(args?.admin?.elements || Object.values(elementTypes)).forEach((el) => {
    let element: RichTextCustomElement

    if (typeof el === 'object' && el !== null) {
      element = el
    } else if (typeof el === 'string' && elementTypes[el]) {
      element = elementTypes[el]
    }

    if (element) {
      const ElementButton = element.Button
      const ElementComponent = element.Element

      if (ElementButton) {
        componentMap.set(
          `element.button.${element.name}`,
          RenderServerComponent({
            clientProps,
            Component: ElementButton,
            importMap: payload.importMap,
          }),
        )
      }
      componentMap.set(
        `element.component.${element.name}`,
        RenderServerComponent({
          clientProps,
          Component: ElementComponent,
          importMap: payload.importMap,
        }),
      )

      if (Array.isArray(element.plugins)) {
        element.plugins.forEach((Plugin, i) => {
          componentMap.set(
            `element.plugin.${element.name}.${i}`,
            RenderServerComponent({
              clientProps,
              Component: Plugin,
              importMap: payload.importMap,
            }),
          )
        })
      }

      switch (element.name) {
        case 'link': {
          const clientFields = createClientFields({
            defaultIDType: payload.config.db.defaultIDType,
            fields: args.admin?.link?.fields as Field[],
            i18n,
            importMap: payload.importMap,
          })

          componentMap.set(linkFieldsSchemaPath, clientFields)

          break
        }

        case 'relationship':
          break

        case 'upload': {
          const uploadEnabledCollections = payload.config.collections.filter(
            ({ admin: { enableRichTextRelationship, hidden }, upload }) => {
              if (hidden === true) {
                return false
              }

              return enableRichTextRelationship && Boolean(upload) === true
            },
          )

          uploadEnabledCollections.forEach((collection) => {
            if (args?.admin?.upload?.collections[collection.slug]?.fields) {
              const clientFields = createClientFields({
                defaultIDType: payload.config.db.defaultIDType,
                fields: args?.admin?.upload?.collections[collection.slug]?.fields,
                i18n,
                importMap: payload.importMap,
              })

              componentMap.set(`${uploadFieldsSchemaPath}.${collection.slug}`, clientFields)
            }
          })

          break
        }
      }
    }
  })

  return (
    <RichTextField
      componentMap={Object.fromEntries(componentMap)}
      field={clientField as RichTextFieldClient}
      forceRender={forceRender}
      path={path}
      readOnly={readOnly}
      renderedBlocks={renderedBlocks}
      schemaPath={schemaPath}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/richtext-slate/src/field/types.ts

```typescript
import type { RichTextPlugin, SlateFieldProps } from '../types.js'

export type EnabledFeatures = {
  elements: {
    [name: string]: {
      Button: React.ReactNode
      Element: React.ReactNode
      name: string
    }
  }
  leaves: {
    [name: string]: {
      Button: React.ReactNode
      Leaf: React.ReactNode
      name: string
    }
  }
  plugins: React.ReactNode[]
}

export type LoadedSlateFieldProps = {
  elements: EnabledFeatures['elements']
  leaves: EnabledFeatures['leaves']
  plugins: RichTextPlugin[]
} & SlateFieldProps
```

--------------------------------------------------------------------------------

---[FILE: areAllChildrenElements.ts]---
Location: payload-main/packages/richtext-slate/src/field/elements/areAllChildrenElements.ts

```typescript
import type { Node } from 'slate'

import { Element } from 'slate'

export const areAllChildrenElements = (node: Node): boolean => {
  return Array.isArray(node.children) && node.children.every((child) => Element.isElement(child))
}
```

--------------------------------------------------------------------------------

---[FILE: Button.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/Button.tsx
Signals: React

```typescript
'use client'
import type { ElementType } from 'react'

import { Tooltip } from '@payloadcms/ui'
import React, { useCallback, useState } from 'react'
import { useSlate } from 'slate-react'

import type { ButtonProps } from './types.js'

import '../buttons.scss'
import { useElementButton } from '../providers/ElementButtonProvider.js'
import { isElementActive } from './isActive.js'
import { toggleElement } from './toggle.js'

export const baseClass = 'rich-text__button'

export const ElementButton: React.FC<ButtonProps> = (props) => {
  const {
    type = 'type',
    children,
    className,
    disabled: disabledFromProps,
    el = 'button',
    format,
    onClick,
    tooltip,
  } = props

  const editor = useSlate()
  const { disabled: disabledFromContext } = useElementButton()
  const [showTooltip, setShowTooltip] = useState(false)

  const defaultOnClick = useCallback(
    (event) => {
      event.preventDefault()
      setShowTooltip(false)
      toggleElement(editor, format, type)
    },
    [editor, format, type],
  )

  const Tag: ElementType = el

  const disabled = disabledFromProps || disabledFromContext

  return (
    <Tag
      {...(el === 'button' && { type: 'button', disabled })}
      className={[
        baseClass,
        className,
        isElementActive(editor, format, type) && `${baseClass}__button--active`,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick || defaultOnClick}
      onPointerEnter={() => setShowTooltip(true)}
      onPointerLeave={() => setShowTooltip(false)}
    >
      {tooltip && <Tooltip show={showTooltip}>{tooltip}</Tooltip>}
      {children}
    </Tag>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: EnabledRelationshipsCondition.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/EnabledRelationshipsCondition.tsx
Signals: React

```typescript
'use client'

import type { ClientCollectionConfig, ClientUser, VisibleEntities } from 'payload'

import { useAuth, useConfig, useEntityVisibility } from '@payloadcms/ui'
import * as React from 'react'

type Options = {
  uploads: boolean
  user: ClientUser
  visibleEntities: VisibleEntities
}

type FilteredCollectionsT = (
  collections: ClientCollectionConfig[],
  options?: Options,
) => ClientCollectionConfig[]

const filterRichTextCollections: FilteredCollectionsT = (collections, options) => {
  return collections.filter(({ slug, admin: { enableRichTextRelationship }, upload }) => {
    if (!options.visibleEntities.collections.includes(slug)) {
      return false
    }

    if (options?.uploads) {
      return enableRichTextRelationship && Boolean(upload) === true
    }

    return upload ? false : enableRichTextRelationship
  })
}

export const EnabledRelationshipsCondition: React.FC<any> = (props) => {
  const { children, uploads = false, ...rest } = props
  const {
    config: { collections },
  } = useConfig()
  const { user } = useAuth()
  const { visibleEntities } = useEntityVisibility()

  const [enabledCollectionSlugs] = React.useState(() =>
    filterRichTextCollections(collections, { uploads, user, visibleEntities }).map(
      ({ slug }) => slug,
    ),
  )

  if (!enabledCollectionSlugs.length) {
    return null
  }

  return React.cloneElement(children, { ...rest, enabledCollectionSlugs })
}
```

--------------------------------------------------------------------------------

---[FILE: getCommonBlock.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/getCommonBlock.tsx

```typescript
import type { NodeEntry, NodeMatch } from 'slate'

import { Editor, Node } from 'slate'

import type { ElementNode } from '../../types.js'

import { isBlockElement } from './isBlockElement.js'

export const getCommonBlock = (editor: Editor, match?: NodeMatch<Node>): NodeEntry<Node> => {
  const range = Editor.unhangRange(editor, editor.selection, { voids: true })

  const [common, path] = Node.common(editor, range.anchor.path, range.focus.path)

  if (isBlockElement(editor, common) || Editor.isEditor(common)) {
    return [common, path]
  }

  return Editor.above(editor, {
    at: path,
    match: match || ((n: ElementNode) => isBlockElement(editor, n) || Editor.isEditor(n)),
  })
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/index.tsx

```typescript
import type { RichTextCustomElement } from '../../types.js'

import { blockquote } from './blockquote/index.js'
import { h1 } from './h1/index.js'
import { h2 } from './h2/index.js'
import { h3 } from './h3/index.js'
import { h4 } from './h4/index.js'
import { h5 } from './h5/index.js'
import { h6 } from './h6/index.js'
import { indent } from './indent/index.js'
import { li } from './li/index.js'
import { link } from './link/index.js'
import { ol } from './ol/index.js'
import { relationship } from './relationship/index.js'
import { textAlign } from './textAlign/index.js'
import { ul } from './ul/index.js'
import { upload } from './upload/index.js'

export const elements: Record<string, RichTextCustomElement> = {
  blockquote,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  indent,
  li,
  link,
  ol,
  relationship,
  textAlign,
  ul,
  upload,
}
```

--------------------------------------------------------------------------------

---[FILE: injectVoid.ts]---
Location: payload-main/packages/richtext-slate/src/field/elements/injectVoid.ts

```typescript
import type { Element } from 'slate'

import { Editor, Transforms } from 'slate'

import type { ElementNode } from '../../types.js'

import { isLastSelectedElementEmpty } from './isLastSelectedElementEmpty.js'

export const injectVoidElement = (editor: Editor, element: Element): void => {
  const lastSelectedElementIsEmpty = isLastSelectedElementEmpty(editor)
  const previous = Editor.previous<ElementNode>(editor)

  if (lastSelectedElementIsEmpty) {
    // If previous node is void
    if (previous?.[0] && Editor.isVoid(editor, previous[0])) {
      // Insert a blank element between void nodes
      // so user can place cursor between void nodes
      Transforms.insertNodes(editor, { children: [{ text: '' }] })
      Transforms.setNodes(editor, element)
      // Otherwise just set the empty node equal to new void
    } else {
      Transforms.setNodes(editor, element)
    }
  } else {
    Transforms.insertNodes(editor, element)
  }

  // Add an empty node after the new void
  Transforms.insertNodes(editor, { children: [{ text: '' }] })
}
```

--------------------------------------------------------------------------------

---[FILE: isActive.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/isActive.tsx

```typescript
import { Editor, Element } from 'slate'

export const isElementActive = (editor: Editor, format: string, blockType = 'type'): boolean => {
  if (!editor.selection) {
    return false
  }

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, editor.selection),
      match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n[blockType] === format,
    }),
  )

  return !!match
}
```

--------------------------------------------------------------------------------

---[FILE: isBlockElement.ts]---
Location: payload-main/packages/richtext-slate/src/field/elements/isBlockElement.ts

```typescript
import { Editor, Element } from 'slate'

/**
 * Returns true, if the provided node is an Element (optionally of a specific type)
 */
const isElement = (node: any, specificType?: string | string[]): node is Element => {
  if (Editor.isEditor(node) || !Element.isElement(node)) {
    return false
  }
  if (undefined === specificType) {
    return true
  }
  if (typeof specificType === 'string') {
    return node.type === specificType
  }
  return specificType.includes(node.type)
}

/**
 * Returns true, if the provided node is a Block Element.
 * Note: Using Editor.isBlock() is not sufficient, as since slate 0.90 it returns `true` for Text nodes and the editor as well.
 *
 * Related Issue: https://github.com/ianstormtaylor/slate/issues/5287
 */

export const isBlockElement = (editor: Editor, node: any): node is Element =>
  Editor.isBlock(editor, node) && isElement(node)
```

--------------------------------------------------------------------------------

---[FILE: isLastSelectedElementEmpty.ts]---
Location: payload-main/packages/richtext-slate/src/field/elements/isLastSelectedElementEmpty.ts

```typescript
import { Editor, Element } from 'slate'

import { nodeIsTextNode } from '../../types.js'

export const isLastSelectedElementEmpty = (editor: Editor): boolean => {
  if (!editor.selection) {
    return false
  }

  const currentlySelectedNodes = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, editor.selection),
      match: (n) => !Editor.isEditor(n) && Element.isElement(n) && (!n.type || n.type === 'p'),
    }),
  )

  const lastSelectedNode = currentlySelectedNodes?.[currentlySelectedNodes?.length - 1]

  return (
    lastSelectedNode &&
    Element.isElement(lastSelectedNode[0]) &&
    (!lastSelectedNode[0].type || lastSelectedNode[0].type === 'p') &&
    nodeIsTextNode(lastSelectedNode[0].children?.[0]) &&
    lastSelectedNode[0].children?.[0].text === ''
  )
}
```

--------------------------------------------------------------------------------

---[FILE: isListActive.ts]---
Location: payload-main/packages/richtext-slate/src/field/elements/isListActive.ts

```typescript
import { Editor, Element } from 'slate'

import { getCommonBlock } from './getCommonBlock.js'

export const isListActive = (editor: Editor, format: string): boolean => {
  if (!editor.selection) {
    return false
  }
  const [topmostSelectedNode, topmostSelectedNodePath] = getCommonBlock(editor)

  if (Editor.isEditor(topmostSelectedNode)) {
    return false
  }

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: topmostSelectedNodePath,
      match: (node, path) => {
        return (
          !Editor.isEditor(node) &&
          Element.isElement(node) &&
          node.type === format &&
          path.length >= topmostSelectedNodePath.length - 2
        )
      },
      mode: 'lowest',
    }),
  )

  return !!match
}
```

--------------------------------------------------------------------------------

---[FILE: isWithinListItem.ts]---
Location: payload-main/packages/richtext-slate/src/field/elements/isWithinListItem.ts

```typescript
import type { Ancestor, NodeEntry } from 'slate'

import { Editor, Element } from 'slate'

export const isWithinListItem = (editor: Editor): boolean => {
  let parentLI: NodeEntry<Ancestor>

  try {
    parentLI = Editor.parent(editor, editor.selection)
  } catch (e) {
    // swallow error, Slate
  }

  if (Element.isElement(parentLI?.[0]) && parentLI?.[0]?.type === 'li') {
    return true
  }

  return false
}
```

--------------------------------------------------------------------------------

---[FILE: ListButton.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/ListButton.tsx
Signals: React

```typescript
'use client'

import React, { useCallback } from 'react'
import { useSlate } from 'slate-react'

import type { ButtonProps } from './types.js'

import '../buttons.scss'
import { isListActive } from './isListActive.js'
import { toggleList } from './toggleList.js'

export const baseClass = 'rich-text__button'

export const ListButton: React.FC<ButtonProps> = ({ children, className, format, onClick }) => {
  const editor = useSlate()

  const defaultOnClick = useCallback(
    (event) => {
      event.preventDefault()
      toggleList(editor, format)
    },
    [editor, format],
  )

  return (
    <button
      className={[
        baseClass,
        className,
        isListActive(editor, format) && `${baseClass}__button--active`,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick || defaultOnClick}
      type="button"
    >
      {children}
    </button>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: listTypes.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/listTypes.tsx

```typescript
export const listTypes = ['ol', 'ul']
```

--------------------------------------------------------------------------------

---[FILE: toggle.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/toggle.tsx

```typescript
'use client'
import { Editor, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'

import { isElementActive } from './isActive.js'
import { isWithinListItem } from './isWithinListItem.js'

export const toggleElement = (editor: Editor, format: string, blockType = 'type'): void => {
  const isActive = isElementActive(editor, format, blockType)

  const formatByBlockType = {
    [blockType]: format,
  }

  const isWithinLI = isWithinListItem(editor)

  if (isActive) {
    formatByBlockType[blockType] = undefined
  }

  if (!isActive && isWithinLI && blockType !== 'textAlign') {
    const block = { type: 'li', children: [] }
    Transforms.wrapNodes(editor, block, {
      at: Editor.unhangRange(editor, editor.selection),
    })
  }

  Transforms.setNodes(
    editor,
    { [blockType]: formatByBlockType[blockType] },
    {
      at: Editor.unhangRange(editor, editor.selection),
    },
  )

  ReactEditor.focus(editor)
}
```

--------------------------------------------------------------------------------

````
