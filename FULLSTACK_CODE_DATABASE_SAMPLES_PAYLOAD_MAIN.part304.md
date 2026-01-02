---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 304
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 304 of 695)

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

---[FILE: toggleList.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/toggleList.tsx

```typescript
import { Editor, Element, Node, Text, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'

import { getCommonBlock } from './getCommonBlock.js'
import { isListActive } from './isListActive.js'
import { listTypes } from './listTypes.js'
import { unwrapList } from './unwrapList.js'

export const toggleList = (editor: Editor, format: string): void => {
  let currentListFormat: string

  if (isListActive(editor, 'ol')) {
    currentListFormat = 'ol'
  }
  if (isListActive(editor, 'ul')) {
    currentListFormat = 'ul'
  }

  // If the format is currently active,
  // remove the list
  if (currentListFormat === format) {
    const selectedLeaf = Node.descendant(editor, editor.selection.anchor.path)

    // If on an empty bullet, leave the above list alone
    // and unwrap only the active bullet
    if (Text.isText(selectedLeaf) && String(selectedLeaf.text).length === 0) {
      Transforms.unwrapNodes(editor, {
        match: (n) => Element.isElement(n) && listTypes.includes(n.type),
        mode: 'lowest',
        split: true,
      })

      Transforms.setNodes(editor, { type: undefined })
    } else {
      // Otherwise, we need to unset li on all lis in the parent list
      // and unwrap the parent list itself
      const [, listPath] = getCommonBlock(editor, (n) => Element.isElement(n) && n.type === format)
      unwrapList(editor, listPath)
    }

    // Otherwise, if a list is active and we are changing it,
    // change it
  } else if (currentListFormat && currentListFormat !== format) {
    Transforms.setNodes(
      editor,
      {
        type: format,
      },
      {
        match: (node) => Element.isElement(node) && listTypes.includes(node.type),
        mode: 'lowest',
      },
    )
    // Otherwise we can assume that we should just activate the list
  } else {
    Transforms.wrapNodes(editor, { type: format, children: [] })

    const [, parentNodePath] = getCommonBlock(
      editor,
      (node) => Element.isElement(node) && node.type === format,
    )

    // Only set li on nodes that don't have type
    Transforms.setNodes(
      editor,
      { type: 'li' },
      {
        match: (node, path) => {
          const match =
            Element.isElement(node) &&
            typeof node.type === 'undefined' &&
            path.length === parentNodePath.length + 1

          return match
        },
        voids: true,
      },
    )

    // Wrap nodes that do have a type with an li
    // so as to not lose their existing formatting
    const nodesToWrap = Array.from(
      Editor.nodes(editor, {
        match: (node, path) => {
          const match =
            Element.isElement(node) &&
            typeof node.type !== 'undefined' &&
            node.type !== 'li' &&
            path.length === parentNodePath.length + 1

          return match
        },
      }),
    )

    nodesToWrap.forEach(([, path]) => {
      Transforms.wrapNodes(editor, { type: 'li', children: [] }, { at: path })
    })
  }

  ReactEditor.focus(editor)
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/richtext-slate/src/field/elements/types.ts
Signals: React

```typescript
import type { ElementType } from 'react'

export type ButtonProps = {
  children?: React.ReactNode
  className?: string
  disabled?: boolean
  el?: ElementType
  format: string
  onClick?: (e: React.MouseEvent) => void
  tooltip?: string
  type?: string
}
```

--------------------------------------------------------------------------------

---[FILE: unwrapList.ts]---
Location: payload-main/packages/richtext-slate/src/field/elements/unwrapList.ts

```typescript
import type { Path } from 'slate'

import { Editor, Element, Transforms } from 'slate'

import { areAllChildrenElements } from './areAllChildrenElements.js'
import { listTypes } from './listTypes.js'

export const unwrapList = (editor: Editor, atPath: Path): void => {
  // Remove type for any nodes that have text children -
  // this means that the node should remain
  Transforms.setNodes(
    editor,
    { type: undefined },
    {
      at: atPath,
      match: (node, path) => {
        const childrenAreAllElements = areAllChildrenElements(node)

        const matches =
          !Editor.isEditor(node) &&
          Element.isElement(node) &&
          !childrenAreAllElements &&
          node.type === 'li' &&
          path.length === atPath.length + 1

        return matches
      },
    },
  )

  // For nodes have all element children, unwrap it instead
  // because the li is a duplicative wrapper
  Transforms.unwrapNodes(editor, {
    at: atPath,
    match: (node, path) => {
      const childrenAreAllElements = areAllChildrenElements(node)

      const matches =
        !Editor.isEditor(node) &&
        Element.isElement(node) &&
        childrenAreAllElements &&
        node.type === 'li' &&
        path.length === atPath.length + 1

      return matches
    },
  })

  // Finally, unwrap the UL itself
  Transforms.unwrapNodes(editor, {
    match: (n) => Element.isElement(n) && listTypes.includes(n.type),
    mode: 'lowest',
  })
}
```

--------------------------------------------------------------------------------

---[FILE: Button.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/blockquote/Button.tsx
Signals: React

```typescript
'use client'
import React from 'react'

import { BlockquoteIcon } from '../../icons/Blockquote/index.js'
import { ElementButton } from '../Button.js'

export const BlockquoteElementButton = ({ format }: { format: string }) => (
  <ElementButton format={format}>
    <BlockquoteIcon />
  </ElementButton>
)
```

--------------------------------------------------------------------------------

---[FILE: Element.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/blockquote/Element.tsx
Signals: React

```typescript
'use client'

import React from 'react'

import { useElement } from '../../providers/ElementProvider.js'
import './index.scss'

export const BlockquoteElement = () => {
  const { attributes, children } = useElement()

  return (
    <blockquote className="rich-text-blockquote" {...attributes}>
      {children}
    </blockquote>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/richtext-slate/src/field/elements/blockquote/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .rich-text-blockquote {
    &[data-slate-node='element'] {
      margin: base(0.625) 0;
      padding-left: base(0.625);
      border-left: 1px solid var(--theme-elevation-200);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/blockquote/index.tsx

```typescript
import type { RichTextCustomElement } from '../../../types.js'

const name = 'blockquote'

export const blockquote: RichTextCustomElement = {
  name,
  Button: {
    clientProps: {
      format: name,
    },
    path: '@payloadcms/richtext-slate/client#BlockquoteElementButton',
  },
  Element: '@payloadcms/richtext-slate/client#BlockquoteElement',
}
```

--------------------------------------------------------------------------------

---[FILE: Button.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/h1/Button.tsx
Signals: React

```typescript
'use client'
import React from 'react'

import { H1Icon } from '../../icons/headings/H1/index.js'
import { ElementButton } from '../Button.js'

export const H1ElementButton = ({ format }: { format: string }) => (
  <ElementButton format={format}>
    <H1Icon />
  </ElementButton>
)
```

--------------------------------------------------------------------------------

---[FILE: Heading1.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/h1/Heading1.tsx
Signals: React

```typescript
'use client'

import React from 'react'

import { useElement } from '../../providers/ElementProvider.js'

export const Heading1Element = () => {
  const { attributes, children } = useElement()

  return <h1 {...attributes}>{children}</h1>
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/h1/index.tsx

```typescript
import type { RichTextCustomElement } from '../../../types.js'

const name = 'h1'

export const h1: RichTextCustomElement = {
  name,
  Button: {
    clientProps: {
      format: name,
    },
    path: '@payloadcms/richtext-slate/client#H1ElementButton',
  },
  Element: '@payloadcms/richtext-slate/client#Heading1Element',
}
```

--------------------------------------------------------------------------------

---[FILE: Button.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/h2/Button.tsx
Signals: React

```typescript
'use client'
import React from 'react'

import { H2Icon } from '../../icons/headings/H2/index.js'
import { ElementButton } from '../Button.js'

export const H2ElementButton = ({ format }: { format: string }) => (
  <ElementButton format={format}>
    <H2Icon />
  </ElementButton>
)
```

--------------------------------------------------------------------------------

---[FILE: Heading2.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/h2/Heading2.tsx
Signals: React

```typescript
'use client'

import React from 'react'

import { useElement } from '../../providers/ElementProvider.js'

export const Heading2Element = () => {
  const { attributes, children } = useElement()

  return <h2 {...attributes}>{children}</h2>
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/h2/index.tsx

```typescript
import type { RichTextCustomElement } from '../../../types.js'

const name = 'h2'

export const h2: RichTextCustomElement = {
  name,
  Button: {
    clientProps: {
      format: name,
    },
    path: '@payloadcms/richtext-slate/client#H2ElementButton',
  },
  Element: '@payloadcms/richtext-slate/client#Heading2Element',
}
```

--------------------------------------------------------------------------------

---[FILE: Button.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/h3/Button.tsx
Signals: React

```typescript
'use client'
import React from 'react'

import { H3Icon } from '../../icons/headings/H3/index.js'
import { ElementButton } from '../Button.js'

export const H3ElementButton = ({ format }: { format: string }) => (
  <ElementButton format={format}>
    <H3Icon />
  </ElementButton>
)
```

--------------------------------------------------------------------------------

---[FILE: Heading3.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/h3/Heading3.tsx
Signals: React

```typescript
'use client'

import React from 'react'

import { useElement } from '../../providers/ElementProvider.js'

export const Heading3Element = () => {
  const { attributes, children } = useElement()

  return <h3 {...attributes}>{children}</h3>
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/h3/index.tsx

```typescript
import type { RichTextCustomElement } from '../../../types.js'

const name = 'h3'

export const h3: RichTextCustomElement = {
  name,
  Button: {
    clientProps: {
      format: name,
    },
    path: '@payloadcms/richtext-slate/client#H3ElementButton',
  },
  Element: '@payloadcms/richtext-slate/client#Heading3Element',
}
```

--------------------------------------------------------------------------------

---[FILE: Button.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/h4/Button.tsx
Signals: React

```typescript
'use client'
import React from 'react'

import { H4Icon } from '../../icons/headings/H4/index.js'
import { ElementButton } from '../Button.js'

export const H4ElementButton = ({ format }: { format: string }) => (
  <ElementButton format={format}>
    <H4Icon />
  </ElementButton>
)
```

--------------------------------------------------------------------------------

---[FILE: Heading4.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/h4/Heading4.tsx
Signals: React

```typescript
'use client'

import React from 'react'

import { useElement } from '../../providers/ElementProvider.js'

export const Heading4Element = () => {
  const { attributes, children } = useElement()

  return <h4 {...attributes}>{children}</h4>
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/h4/index.tsx

```typescript
import type { RichTextCustomElement } from '../../../types.js'

const name = 'h4'

export const h4: RichTextCustomElement = {
  name,
  Button: {
    clientProps: {
      format: name,
    },
    path: '@payloadcms/richtext-slate/client#H4ElementButton',
  },
  Element: '@payloadcms/richtext-slate/client#Heading4Element',
}
```

--------------------------------------------------------------------------------

---[FILE: Button.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/h5/Button.tsx
Signals: React

```typescript
'use client'
import React from 'react'

import { H5Icon } from '../../icons/headings/H5/index.js'
import { ElementButton } from '../Button.js'

export const H5ElementButton = ({ format }: { format: string }) => (
  <ElementButton format={format}>
    <H5Icon />
  </ElementButton>
)
```

--------------------------------------------------------------------------------

---[FILE: Heading5.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/h5/Heading5.tsx
Signals: React

```typescript
'use client'

import React from 'react'

import { useElement } from '../../providers/ElementProvider.js'

export const Heading5Element = () => {
  const { attributes, children } = useElement()

  return <h5 {...attributes}>{children}</h5>
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/h5/index.tsx

```typescript
import type { RichTextCustomElement } from '../../../types.js'

const name = 'h5'

export const h5: RichTextCustomElement = {
  name,
  Button: {
    clientProps: {
      format: name,
    },
    path: '@payloadcms/richtext-slate/client#H5ElementButton',
  },
  Element: '@payloadcms/richtext-slate/client#Heading5Element',
}
```

--------------------------------------------------------------------------------

---[FILE: Button.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/h6/Button.tsx
Signals: React

```typescript
'use client'
import React from 'react'

import { H6Icon } from '../../icons/headings/H6/index.js'
import { ElementButton } from '../Button.js'

export const H6ElementButton = ({ format }: { format: string }) => (
  <ElementButton format={format}>
    <H6Icon />
  </ElementButton>
)
```

--------------------------------------------------------------------------------

---[FILE: Heading6.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/h6/Heading6.tsx
Signals: React

```typescript
'use client'

import React from 'react'

import { useElement } from '../../providers/ElementProvider.js'

export const Heading6Element = () => {
  const { attributes, children } = useElement()

  return <h6 {...attributes}>{children}</h6>
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/h6/index.tsx

```typescript
import type { RichTextCustomElement } from '../../../types.js'

const name = 'h6'

export const h6: RichTextCustomElement = {
  name,
  Button: {
    clientProps: {
      format: name,
    },
    path: '@payloadcms/richtext-slate/client#H6ElementButton',
  },
  Element: '@payloadcms/richtext-slate/client#Heading6Element',
}
```

--------------------------------------------------------------------------------

---[FILE: Button.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/indent/Button.tsx
Signals: React

```typescript
'use client'

import React, { useCallback } from 'react'
import { Editor, Element, Text, Transforms } from 'slate'
import { ReactEditor, useSlate } from 'slate-react'

import type { ElementNode } from '../../../types.js'

import { IndentLeft } from '../../icons/IndentLeft/index.js'
import { IndentRight } from '../../icons/IndentRight/index.js'
import { baseClass } from '../Button.js'
import { getCommonBlock } from '../getCommonBlock.js'
import { isElementActive } from '../isActive.js'
import { isBlockElement } from '../isBlockElement.js'
import { listTypes } from '../listTypes.js'
import { unwrapList } from '../unwrapList.js'
import { indentType } from './shared.js'

export const IndentButton: React.FC = () => {
  const editor = useSlate()
  const handleIndent = useCallback(
    (e, dir) => {
      e.preventDefault()

      if (dir === 'left') {
        if (isElementActive(editor, 'li')) {
          const [, listPath] = getCommonBlock(
            editor,
            (n) => Element.isElement(n) && listTypes.includes(n.type),
          )

          const matchedParentList = Editor.above(editor, {
            at: listPath,
            match: (n: ElementNode) => !Editor.isEditor(n) && isBlockElement(editor, n),
          })

          if (matchedParentList) {
            const [parentListItem, parentListItemPath] = matchedParentList

            if (parentListItem.children.length > 1) {
              // Remove nested list
              Transforms.unwrapNodes(editor, {
                at: parentListItemPath,
                match: (node, path) => {
                  const matches =
                    !Editor.isEditor(node) &&
                    Element.isElement(node) &&
                    listTypes.includes(node.type) &&
                    path.length === parentListItemPath.length + 1

                  return matches
                },
              })

              // Set li type on any children that don't have a type
              Transforms.setNodes(
                editor,
                { type: 'li' },
                {
                  at: parentListItemPath,
                  match: (node, path) => {
                    const matches =
                      !Editor.isEditor(node) &&
                      Element.isElement(node) &&
                      node.type !== 'li' &&
                      path.length === parentListItemPath.length + 1

                    return matches
                  },
                },
              )

              // Parent list item path has changed at this point
              // so we need to re-fetch the parent node
              const [newParentNode] = Editor.node(editor, parentListItemPath)

              // If the parent node is an li,
              // lift all li nodes within
              if (Element.isElement(newParentNode) && newParentNode.type === 'li') {
                // Lift the nested lis
                Transforms.liftNodes(editor, {
                  at: parentListItemPath,
                  match: (node, path) => {
                    const matches =
                      !Editor.isEditor(node) &&
                      Element.isElement(node) &&
                      path.length === parentListItemPath.length + 1 &&
                      node.type === 'li'

                    return matches
                  },
                })
              }
            } else {
              Transforms.unwrapNodes(editor, {
                at: parentListItemPath,
                match: (node, path) => {
                  return (
                    Element.isElement(node) &&
                    node.type === 'li' &&
                    path.length === parentListItemPath.length
                  )
                },
              })

              Transforms.unwrapNodes(editor, {
                match: (n) => Element.isElement(n) && listTypes.includes(n.type),
              })
            }
          } else {
            unwrapList(editor, listPath)
          }
        } else {
          Transforms.unwrapNodes(editor, {
            match: (n) => Element.isElement(n) && n.type === indentType,
            mode: 'lowest',
            split: true,
          })
        }
      }

      if (dir === 'right') {
        const isCurrentlyOL = isElementActive(editor, 'ol')
        const isCurrentlyUL = isElementActive(editor, 'ul')

        if (isCurrentlyOL || isCurrentlyUL) {
          // Get the path of the first selected li -
          // Multiple lis could be selected
          // and the selection may start in the middle of the first li
          const [[, firstSelectedLIPath]] = Array.from(
            Editor.nodes(editor, {
              match: (node) => Element.isElement(node) && node.type === 'li',
              mode: 'lowest',
            }),
          )

          // Is the first selected li the first in its list?
          const hasPrecedingLI = firstSelectedLIPath[firstSelectedLIPath.length - 1] > 0

          // If the first selected li is NOT the first in its list,
          // we need to inject it into the prior li
          if (hasPrecedingLI) {
            const [, precedingLIPath] = Editor.previous(editor, {
              at: firstSelectedLIPath,
            })

            const [precedingLIChildren] = Editor.node(editor, [...precedingLIPath, 0])
            const precedingLIChildrenIsText = Text.isText(precedingLIChildren)

            if (precedingLIChildrenIsText) {
              // Wrap the prior li text content so that it can be nested next to a list
              Transforms.wrapNodes(editor, { children: [] }, { at: [...precedingLIPath, 0] })
            }

            // Move the selected lis after the prior li contents
            Transforms.moveNodes(editor, {
              match: (node) => Element.isElement(node) && node.type === 'li',
              mode: 'lowest',
              to: [...precedingLIPath, 1],
            })

            // Wrap the selected lis in a new list
            Transforms.wrapNodes(
              editor,
              {
                type: isCurrentlyOL ? 'ol' : 'ul',
                children: [],
              },
              {
                match: (node) => Element.isElement(node) && node.type === 'li',
                mode: 'lowest',
              },
            )
          } else {
            // Otherwise, just wrap the node in a list / li
            Transforms.wrapNodes(
              editor,
              {
                type: isCurrentlyOL ? 'ol' : 'ul',
                children: [{ type: 'li', children: [] }],
              },
              {
                match: (node) => Element.isElement(node) && node.type === 'li',
                mode: 'lowest',
              },
            )
          }
        } else {
          Transforms.wrapNodes(editor, { type: indentType, children: [] })
        }
      }

      ReactEditor.focus(editor)
    },
    [editor],
  )

  const canDeIndent = isElementActive(editor, 'li') || isElementActive(editor, indentType)

  return (
    <React.Fragment>
      <button
        className={[baseClass, !canDeIndent && `${baseClass}--disabled`].filter(Boolean).join(' ')}
        onClick={canDeIndent ? (e) => handleIndent(e, 'left') : undefined}
        type="button"
      >
        <IndentLeft />
      </button>
      <button className={baseClass} onClick={(e) => handleIndent(e, 'right')} type="button">
        <IndentRight />
      </button>
    </React.Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: Element.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/indent/Element.tsx
Signals: React

```typescript
'use client'

import React from 'react'

import { useElement } from '../../providers/ElementProvider.js'

export const IndentElement: React.FC = () => {
  const { attributes, children } = useElement()

  return (
    <div style={{ paddingLeft: 25 }} {...attributes}>
      {children}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/richtext-slate/src/field/elements/indent/index.ts

```typescript
import type { RichTextCustomElement } from '../../../types.js'

import { indentType } from './shared.js'

export const indent: RichTextCustomElement = {
  name: indentType,
  Button: '@payloadcms/richtext-slate/client#IndentButton',
  Element: '@payloadcms/richtext-slate/client#IndentElement',
}
```

--------------------------------------------------------------------------------

---[FILE: shared.ts]---
Location: payload-main/packages/richtext-slate/src/field/elements/indent/shared.ts

```typescript
export const indentType = 'indent'
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/li/index.tsx

```typescript
import type { RichTextCustomElement } from '../../../types.js'

export const li: RichTextCustomElement = {
  name: 'li',
  Element: '@payloadcms/richtext-slate/client#ListItemElement',
}
```

--------------------------------------------------------------------------------

---[FILE: ListItem.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/li/ListItem.tsx
Signals: React

```typescript
'use client'

import type { Element } from 'slate'

import React from 'react'

import { useElement } from '../../providers/ElementProvider.js'
import { listTypes } from '../listTypes.js'

export const ListItemElement: React.FC = () => {
  const { attributes, children, element } = useElement<Element>()

  const listType = typeof element.children?.[0]?.type === 'string' ? element.children[0].type : ''
  const disableListStyle = element.children.length >= 1 && listTypes.includes(listType)

  return (
    <li
      style={{
        listStyle: disableListStyle ? 'none' : undefined,
        listStylePosition: disableListStyle ? 'outside' : undefined,
      }}
      {...attributes}
    >
      {children}
    </li>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/richtext-slate/src/field/elements/link/index.ts

```typescript
import type { RichTextCustomElement } from '../../../types.js'

export const link: RichTextCustomElement = {
  name: 'link',
  Button: '@payloadcms/richtext-slate/client#LinkButton',
  Element: '@payloadcms/richtext-slate/client#LinkElement',
  plugins: ['@payloadcms/richtext-slate/client#WithLinks'],
}
```

--------------------------------------------------------------------------------

---[FILE: shared.ts]---
Location: payload-main/packages/richtext-slate/src/field/elements/link/shared.ts

```typescript
export const modalSlug = 'rich-text-link-modal'
export const linkFieldsSchemaPath = 'link.fields'
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/richtext-slate/src/field/elements/link/types.ts

```typescript
import type { Element } from 'slate'

export type LinkElementType = {
  doc: Record<string, unknown>
  fields: Record<string, unknown>
  linkType: string
  newTab: boolean
  url: string
} & Element
```

--------------------------------------------------------------------------------

---[FILE: utilities.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/link/utilities.tsx

```typescript
import type { Field, SanitizedConfig } from 'payload'
import type { Editor } from 'slate'

import { Element, Range, Transforms } from 'slate'

import { getBaseFields } from './LinkDrawer/baseFields.js'

export const unwrapLink = (editor: Editor): void => {
  Transforms.unwrapNodes(editor, { match: (n) => Element.isElement(n) && n.type === 'link' })
}

export const wrapLink = (editor: Editor): void => {
  const { selection } = editor
  const isCollapsed = selection && Range.isCollapsed(selection)

  const link = {
    type: 'link',
    children: isCollapsed ? [{ text: '' }] : [],
    newTab: false,
    url: undefined,
  }

  if (isCollapsed) {
    Transforms.insertNodes(editor, link)
  } else {
    Transforms.wrapNodes(editor, link, { split: true })
    Transforms.collapse(editor, { edge: 'end' })
  }
}

/**
 * This function is run to enrich the basefields which every link has with potential, custom user-added fields.
 */
export function transformExtraFields(
  customFieldSchema:
    | ((args: { config: SanitizedConfig; defaultFields: Field[] }) => Field[])
    | Field[],
  config: SanitizedConfig,
): Field[] {
  const baseFields: Field[] = getBaseFields(config)

  const fields =
    typeof customFieldSchema === 'function'
      ? customFieldSchema({ config, defaultFields: baseFields })
      : baseFields

  // Wrap fields which are not part of the base schema in a group named 'fields' - otherwise they will be rendered but not saved
  const extraFields = []
  for (let i = fields.length - 1; i >= 0; i--) {
    const field = fields[i]

    if ('name' in field) {
      if (
        !baseFields.find((baseField) => !('name' in baseField) || baseField.name === field.name)
      ) {
        if (field.name !== 'fields' && field.type !== 'group') {
          extraFields.push(field)
          // Remove from fields from now, as they need to be part of the fields group below
          fields.splice(fields.indexOf(field), 1)
        }
      }
    }
  }

  if ((Array.isArray(customFieldSchema) && customFieldSchema?.length) || extraFields?.length) {
    fields.push({
      name: 'fields',
      type: 'group',
      admin: {
        style: {
          borderBottom: 0,
          borderTop: 0,
          margin: 0,
          padding: 0,
        },
      },
      fields: Array.isArray(customFieldSchema)
        ? customFieldSchema.concat(extraFields)
        : extraFields,
    })
  }
  return fields
}
```

--------------------------------------------------------------------------------

---[FILE: WithLinks.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/link/WithLinks.tsx
Signals: React

```typescript
'use client'

import type React from 'react'
import type { Editor } from 'slate'

import { useSlatePlugin } from '../../../utilities/useSlatePlugin.js'

const plugin = (incomingEditor: Editor): Editor => {
  const editor = incomingEditor
  const { isInline } = editor

  editor.isInline = (element) => {
    if (element.type === 'link') {
      return true
    }

    return isInline(element)
  }

  return editor
}

export const WithLinks: React.FC = () => {
  useSlatePlugin('withLinks', plugin)
  return null
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-slate/src/field/elements/link/Button/index.tsx
Signals: React

```typescript
'use client'

import type { FormState } from 'payload'

import {
  useDocumentInfo,
  useDrawerSlug,
  useModal,
  useServerFunctions,
  useTranslation,
} from '@payloadcms/ui'
import { reduceFieldsToValues } from 'payload/shared'
import React, { Fragment, useState } from 'react'
import { Editor, Range, Transforms } from 'slate'
import { ReactEditor, useSlate } from 'slate-react'

import { LinkIcon } from '../../../icons/Link/index.js'
import { useElementButton } from '../../../providers/ElementButtonProvider.js'
import { ElementButton } from '../../Button.js'
import { isElementActive } from '../../isActive.js'
import { LinkDrawer } from '../LinkDrawer/index.js'
import { linkFieldsSchemaPath } from '../shared.js'
import { unwrapLink } from '../utilities.js'

/**
 * This function is called when a new link is created - not when an existing link is edited.
 */
const insertLink = (editor, fields) => {
  const isCollapsed = editor.selection && Range.isCollapsed(editor.selection)
  const data = reduceFieldsToValues(fields, true)

  const newLink = {
    type: 'link',
    children: [],
    doc: data.doc,
    fields: data.fields, // Any custom user-added fields are part of data.fields
    linkType: data.linkType,
    newTab: data.newTab,
    url: data.url,
  }

  if (isCollapsed || !editor.selection) {
    // If selection anchor and focus are the same,
    // Just inject a new node with children already set
    Transforms.insertNodes(editor, {
      ...newLink,
      children: [{ text: String(data.text) }],
    })
  } else if (editor.selection) {
    // Otherwise we need to wrap the selected node in a link,
    // Delete its old text,
    // Move the selection one position forward into the link,
    // And insert the text back into the new link
    Transforms.wrapNodes(editor, newLink, { split: true })
    Transforms.delete(editor, { at: editor.selection.focus.path, unit: 'word' })
    Transforms.move(editor, { distance: 1, unit: 'offset' })
    Transforms.insertText(editor, String(data.text), { at: editor.selection.focus.path })
  }

  ReactEditor.focus(editor)
}

export const LinkButton: React.FC<{
  schemaPath: string
}> = ({ schemaPath }) => {
  const { fieldProps } = useElementButton()
  const [initialState, setInitialState] = useState<FormState>({})

  const { t } = useTranslation()
  const editor = useSlate()
  const { getFormState } = useServerFunctions()
  const { collectionSlug, getDocPreferences, globalSlug } = useDocumentInfo()

  const { closeModal, openModal } = useModal()
  const drawerSlug = useDrawerSlug('rich-text-link')

  const { componentMap } = fieldProps

  const fields = componentMap[linkFieldsSchemaPath]

  return (
    <Fragment>
      <ElementButton
        className="link"
        format="link"
        onClick={async () => {
          if (isElementActive(editor, 'link')) {
            unwrapLink(editor)
          } else {
            openModal(drawerSlug)
            const isCollapsed = editor.selection && Range.isCollapsed(editor.selection)

            if (!isCollapsed) {
              const data = {
                text: editor.selection ? Editor.string(editor, editor.selection) : '',
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
                schemaPath: [...schemaPath.split('.'), ...linkFieldsSchemaPath.split('.')].join(
                  '.',
                ),
              })

              setInitialState(state)
            }
          }
        }}
        tooltip={t('fields:addLink')}
      >
        <LinkIcon />
      </ElementButton>
      <LinkDrawer
        drawerSlug={drawerSlug}
        fields={Array.isArray(fields) ? fields : []}
        handleClose={() => {
          closeModal(drawerSlug)
        }}
        handleModalSubmit={(fields) => {
          insertLink(editor, fields)
          closeModal(drawerSlug)
        }}
        initialState={initialState}
        schemaPath={schemaPath}
      />
    </Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/richtext-slate/src/field/elements/link/Element/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .rich-text-link {
    position: relative;

    .popup {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;

      .popup__hide-scrollbar,
      .popup__scroll-container {
        overflow: visible;
      }

      .popup__scroll-content {
        white-space: pre;
      }
    }

    .icon--x line {
      stroke-width: 2px;
    }

    &__popup {
      @extend %body;
      font-family: var(--font-body);
      display: flex;

      button {
        @extend %btn-reset;
        font-weight: 600;
        cursor: pointer;
        margin: 0;
      }
    }

    &__link-label {
      max-width: base(8);
      overflow: hidden;
      text-overflow: ellipsis;
      border-radius: 2px;

      &:hover {
        background-color: var(--popup-button-highlight);
      }
    }
  }

  .rich-text-link__popup {
    display: flex;
    gap: calc(var(--base) * 0.25);
    button {
      &:hover {
        .btn__icon {
          background-color: var(--popup-button-highlight);
          .fill {
            fill: var(--theme-text);
          }
          .stroke {
            stroke: var(--theme-text);
          }
        }
      }
    }
  }

  .rich-text-link__popup-toggler {
    position: relative;
    border: 0;
    background-color: transparent;
    padding: 0;
    color: var(--theme-success-600);
    text-decoration: none;
    border-bottom: 1px dotted;
    cursor: text;

    &:focus,
    &:focus-within {
      outline: none;
    }

    &--open {
      z-index: var(--z-popup);
    }
  }
}
```

--------------------------------------------------------------------------------

````
