---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 281
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 281 of 695)

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
Location: payload-main/packages/richtext-lexical/src/features/link/client/plugins/floatingLinkEditor/LinkEditor/index.tsx
Signals: React

```typescript
'use client'
import type { ElementNode, LexicalNode } from 'lexical'
import type { Data, FormState } from 'payload'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.js'
import { useLexicalEditable } from '@lexical/react/useLexicalEditable'
import { $findMatchingParent, mergeRegister } from '@lexical/utils'
import { getTranslation } from '@payloadcms/translations'
import {
  CloseMenuIcon,
  EditIcon,
  ExternalLinkIcon,
  formatDrawerSlug,
  useConfig,
  useEditDepth,
  useLocale,
  useTranslation,
} from '@payloadcms/ui'
import { requests } from '@payloadcms/ui/shared'
import {
  $getSelection,
  $isLineBreakNode,
  $isRangeSelection,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  getDOMSelection,
  KEY_ESCAPE_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from 'lexical'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import type { LinkNode } from '../../../../nodes/LinkNode.js'
import type { LinkFields } from '../../../../nodes/types.js'
import type { LinkPayload } from '../types.js'

import { useEditorConfigContext } from '../../../../../../lexical/config/client/EditorConfigProvider.js'
import { getSelectedNode } from '../../../../../../lexical/utils/getSelectedNode.js'
import { setFloatingElemPositionForLinkEditor } from '../../../../../../lexical/utils/setFloatingElemPositionForLinkEditor.js'
import { FieldsDrawer } from '../../../../../../utilities/fieldsDrawer/Drawer.js'
import { useLexicalDrawer } from '../../../../../../utilities/fieldsDrawer/useLexicalDrawer.js'
import { $isAutoLinkNode } from '../../../../nodes/AutoLinkNode.js'
import { $createLinkNode, $isLinkNode, TOGGLE_LINK_COMMAND } from '../../../../nodes/LinkNode.js'
import { TOGGLE_LINK_WITH_MODAL_COMMAND } from './commands.js'

function preventDefault(
  event: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLElement>,
): void {
  event.preventDefault()
}

export function LinkEditor({ anchorElem }: { anchorElem: HTMLElement }): React.ReactNode {
  const [editor] = useLexicalComposerContext()
  // TO-DO: There are several states that should not be state, because they
  // are derived from linkNode (linkUrl, linkLabel, stateData, isLink, isAutoLink...)
  const [linkNode, setLinkNode] = useState<LinkNode>()

  const editorRef = useRef<HTMLDivElement | null>(null)
  const [linkUrl, setLinkUrl] = useState<null | string>(null)
  const [linkLabel, setLinkLabel] = useState<null | string>(null)

  const {
    fieldProps: { schemaPath },
    uuid,
  } = useEditorConfigContext()
  const isEditable = useLexicalEditable()

  const { config, getEntityConfig } = useConfig()

  const { i18n, t } = useTranslation<object, 'lexical:link:loadingWithEllipsis'>()

  const [stateData, setStateData] = useState<
    ({ id?: string; text: string } & LinkFields) | undefined
  >()

  const editDepth = useEditDepth()
  const [isLink, setIsLink] = useState(false)
  const [selectedNodes, setSelectedNodes] = useState<LexicalNode[]>([])
  const locale = useLocale()

  const [isAutoLink, setIsAutoLink] = useState(false)

  const drawerSlug = formatDrawerSlug({
    slug: `lexical-rich-text-link-` + uuid,
    depth: editDepth,
  })

  const { toggleDrawer } = useLexicalDrawer(drawerSlug)

  const setNotLink = useCallback(() => {
    setIsLink(false)
    if (editorRef && editorRef.current) {
      editorRef.current.style.opacity = '0'
      editorRef.current.style.transform = 'translate(-10000px, -10000px)'
    }
    setIsAutoLink(false)
    setLinkUrl(null)
    setLinkLabel(null)
    setSelectedNodes([])
    setStateData(undefined)
  }, [setIsLink, setLinkUrl, setLinkLabel, setSelectedNodes])

  const $updateLinkEditor = useCallback(() => {
    const selection = $getSelection()
    let selectedNodeDomRect: DOMRect | undefined

    if (!$isRangeSelection(selection) || !selection) {
      void setNotLink()
      return
    }

    // Handle the data displayed in the floating link editor & drawer when you click on a link node

    const focusNode = getSelectedNode(selection)
    selectedNodeDomRect = editor.getElementByKey(focusNode.getKey())?.getBoundingClientRect()
    const focusLinkParent = $findMatchingParent(focusNode, $isLinkNode)

    // Prevent link modal from showing if selection spans further than the link: https://github.com/facebook/lexical/issues/4064
    const badNode = selection
      .getNodes()
      .filter((node) => !$isLineBreakNode(node))
      .find((node) => {
        const linkNode = $findMatchingParent(node, $isLinkNode)
        return (
          (focusLinkParent && !focusLinkParent.is(linkNode)) ||
          (linkNode && !linkNode.is(focusLinkParent))
        )
      })

    if (focusLinkParent == null || badNode) {
      setNotLink()
      return
    }
    setLinkNode(focusLinkParent)

    const fields = focusLinkParent.getFields()

    // Initial state:
    const data: { text: string } & LinkFields = {
      ...fields,
      id: focusLinkParent.getID(),
      text: focusLinkParent.getTextContent(),
    }

    if (fields?.linkType === 'custom') {
      setLinkUrl(fields?.url ?? null)
      setLinkLabel(null)
    } else {
      // internal link
      setLinkUrl(
        `${config.routes.admin === '/' ? '' : config.routes.admin}/collections/${fields?.doc?.relationTo}/${
          fields?.doc?.value
        }`,
      )

      const relatedField = fields?.doc?.relationTo
        ? getEntityConfig({ collectionSlug: fields?.doc?.relationTo })
        : undefined
      if (!relatedField) {
        // Usually happens if the user removed all default fields. In this case, we let them specify the label or do not display the label at all.
        // label could be a virtual field the user added. This is useful if they want to use the link feature for things other than links.
        setLinkLabel(fields?.label ? String(fields?.label) : null)
        setLinkUrl(fields?.url ? String(fields?.url) : null)
      } else {
        const id = typeof fields.doc?.value === 'object' ? fields.doc.value.id : fields.doc?.value
        const collection = fields.doc?.relationTo
        if (!id || !collection) {
          throw new Error(`Focus link parent is missing doc.value or doc.relationTo`)
        }

        const loadingLabel = t('fields:linkedTo', {
          label: `${getTranslation(relatedField.labels.singular, i18n)} - ${t('lexical:link:loadingWithEllipsis', i18n)}`,
        }).replace(/<[^>]*>?/g, '')
        setLinkLabel(loadingLabel)

        requests
          .get(`${config.serverURL}${config.routes.api}/${collection}/${id}`, {
            headers: {
              'Accept-Language': i18n.language,
            },
            params: {
              depth: 0,
              locale: locale?.code,
            },
          })
          .then(async (res) => {
            if (!res.ok) {
              throw new Error(`HTTP error! Status: ${res.status}`)
            }
            const data = await res.json()
            const useAsTitle = relatedField?.admin?.useAsTitle || 'id'
            const title = data[useAsTitle]
            const label = t('fields:linkedTo', {
              label: `${getTranslation(relatedField.labels.singular, i18n)} - ${title}`,
            }).replace(/<[^>]*>?/g, '')
            setLinkLabel(label)
          })
          .catch(() => {
            const label = t('fields:linkedTo', {
              label: `${getTranslation(relatedField.labels.singular, i18n)} - ${t('general:untitled', i18n)} - ID: ${id}`,
            }).replace(/<[^>]*>?/g, '')
            setLinkLabel(label)
          })
      }
    }

    setStateData(data)
    setIsLink(true)
    setSelectedNodes(selection ? selection?.getNodes() : [])

    if ($isAutoLinkNode(focusLinkParent)) {
      setIsAutoLink(true)
    } else {
      setIsAutoLink(false)
    }

    const editorElem = editorRef.current
    const nativeSelection = getDOMSelection(editor._window)
    const { activeElement } = document

    if (editorElem === null) {
      return
    }

    const rootElement = editor.getRootElement()

    if (
      nativeSelection !== null &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      if (!selectedNodeDomRect) {
        // Get the DOM rect of the selected node using the native selection. This sometimes produces the wrong
        // result, which is why we use lexical's selection preferably.
        selectedNodeDomRect = nativeSelection.getRangeAt(0).getBoundingClientRect()
      }

      if (selectedNodeDomRect != null) {
        selectedNodeDomRect.y += 40
        setFloatingElemPositionForLinkEditor(selectedNodeDomRect, editorElem, anchorElem)
      }
    } else if (activeElement == null || activeElement.className !== 'link-input') {
      if (rootElement !== null) {
        setFloatingElemPositionForLinkEditor(null, editorElem, anchorElem)
      }
      setLinkUrl(null)
      setLinkLabel(null)
    }

    return true
  }, [
    editor,
    setNotLink,
    config.routes.admin,
    config.routes.api,
    config.serverURL,
    getEntityConfig,
    t,
    i18n,
    locale?.code,
    anchorElem,
  ])

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        TOGGLE_LINK_WITH_MODAL_COMMAND,
        (payload: LinkPayload) => {
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, payload)

          // Now, open the modal
          $updateLinkEditor()
          toggleDrawer()

          return true
        },
        COMMAND_PRIORITY_LOW,
      ),
    )
  }, [editor, $updateLinkEditor, toggleDrawer, drawerSlug])

  useEffect(() => {
    const scrollerElem = anchorElem.parentElement

    const update = (): void => {
      editor.getEditorState().read(() => {
        void $updateLinkEditor()
      })
    }

    window.addEventListener('resize', update)

    if (scrollerElem != null) {
      scrollerElem.addEventListener('scroll', update)
    }

    return () => {
      window.removeEventListener('resize', update)

      if (scrollerElem != null) {
        scrollerElem.removeEventListener('scroll', update)
      }
    }
  }, [anchorElem.parentElement, editor, $updateLinkEditor])

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          void $updateLinkEditor()
        })
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          void $updateLinkEditor()
          return true
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_ESCAPE_COMMAND,
        () => {
          if (isLink) {
            setNotLink()

            return true
          }
          return false
        },
        COMMAND_PRIORITY_HIGH,
      ),
    )
  }, [editor, $updateLinkEditor, isLink, setNotLink])

  useEffect(() => {
    editor.getEditorState().read(() => {
      void $updateLinkEditor()
    })
  }, [editor, $updateLinkEditor])

  return (
    <React.Fragment>
      <div className="link-editor" ref={editorRef}>
        <div className="link-input">
          {linkUrl && linkUrl.length > 0 ? (
            <a href={linkUrl} rel="noopener noreferrer" target="_blank">
              {linkNode?.__fields.newTab ? <ExternalLinkIcon /> : null}
              {linkLabel != null && linkLabel.length > 0 ? linkLabel : linkUrl}
            </a>
          ) : linkLabel != null && linkLabel.length > 0 ? (
            <>
              {linkNode?.__fields.newTab ? <ExternalLinkIcon /> : null}
              <span className="link-input__label-pure">{linkLabel}</span>
            </>
          ) : null}

          {isEditable && (
            <React.Fragment>
              <button
                aria-label="Edit link"
                className="link-edit"
                onClick={(event) => {
                  event.preventDefault()
                  toggleDrawer()
                }}
                onMouseDown={preventDefault}
                tabIndex={0}
                type="button"
              >
                <EditIcon />
              </button>
              {!isAutoLink && (
                <button
                  aria-label="Remove link"
                  className="link-trash"
                  onClick={() => {
                    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
                  }}
                  onMouseDown={preventDefault}
                  tabIndex={0}
                  type="button"
                >
                  <CloseMenuIcon />
                </button>
              )}
            </React.Fragment>
          )}
        </div>
      </div>
      <FieldsDrawer
        className="lexical-link-edit-drawer"
        data={stateData}
        drawerSlug={drawerSlug}
        drawerTitle={t('fields:editLink')}
        featureKey="link"
        handleDrawerSubmit={(fields: FormState, data: Data) => {
          const newLinkPayload = data as { text: string } & LinkFields

          const bareLinkFields: LinkFields = {
            ...newLinkPayload,
          }
          delete bareLinkFields.text

          // See: https://github.com/facebook/lexical/pull/5536. This updates autolink nodes to link nodes whenever a change was made (which is good!).
          editor.update(() => {
            const selection = $getSelection()
            let linkParent: ElementNode | null = null
            if ($isRangeSelection(selection)) {
              linkParent = getSelectedNode(selection).getParent()
            } else {
              if (selectedNodes.length) {
                linkParent = selectedNodes[0]?.getParent() ?? null
              }
            }

            if (linkParent && $isAutoLinkNode(linkParent)) {
              const linkNode = $createLinkNode({
                fields: bareLinkFields,
              })
              linkParent.replace(linkNode, true)
            }
          })

          // Needs to happen AFTER a potential auto link => link node conversion, as otherwise, the updated text to display may be lost due to
          // it being applied to the auto link node instead of the link node.
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, {
            fields: bareLinkFields,
            selectedNodes,
            text: newLinkPayload.text,
          })
        }}
        schemaPath={schemaPath}
        schemaPathSuffix="fields"
      />
    </React.Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/link/client/plugins/link/index.tsx
Signals: React

```typescript
'use client'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.js'
import { mergeRegister } from '@lexical/utils'
import {
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  PASTE_COMMAND,
} from 'lexical'
import { useEffect } from 'react'

import type { PluginComponent } from '../../../../typesClient.js'
import type { LinkFields } from '../../../nodes/types.js'
import type { ClientProps } from '../../index.js'
import type { LinkPayload } from '../floatingLinkEditor/types.js'

import { validateUrl } from '../../../../../lexical/utils/url.js'
import { $toggleLink, LinkNode, TOGGLE_LINK_COMMAND } from '../../../nodes/LinkNode.js'

export const LinkPlugin: PluginComponent<ClientProps> = ({ clientProps }) => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (!editor.hasNodes([LinkNode])) {
      throw new Error('LinkPlugin: LinkNode not registered on editor')
    }
    return mergeRegister(
      editor.registerCommand(
        TOGGLE_LINK_COMMAND,
        (payload: LinkPayload) => {
          if (payload === null) {
            $toggleLink(null)
            return true
          }
          if (!payload.fields?.linkType) {
            payload.fields.linkType = clientProps.defaultLinkType as any
          }
          if (!payload.fields?.url) {
            payload.fields.url = clientProps.defaultLinkURL as any
          }
          $toggleLink(payload as { fields: LinkFields } & LinkPayload)
          return true
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        PASTE_COMMAND,
        (event) => {
          const selection = $getSelection()
          if (
            !$isRangeSelection(selection) ||
            selection.isCollapsed() ||
            !(event instanceof ClipboardEvent) ||
            event.clipboardData == null
          ) {
            return false
          }
          const clipboardText = event.clipboardData.getData('text')
          if (!validateUrl(clipboardText)) {
            return false
          }
          // If we select nodes that are elements then avoid applying the link.
          if (!selection.getNodes().some((node) => $isElementNode(node))) {
            const linkFields: LinkFields = {
              doc: null,
              linkType: 'custom',
              newTab: false,
              url: clipboardText,
            }
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, {
              fields: linkFields,
              text: null,
            })
            event.preventDefault()
            return true
          }
          return false
        },
        COMMAND_PRIORITY_LOW,
      ),
    )
  }, [clientProps.defaultLinkType, clientProps.defaultLinkURL, editor])

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: AutoLinkNode.ts]---
Location: payload-main/packages/richtext-lexical/src/features/link/nodes/AutoLinkNode.ts

```typescript
import type { ElementNode, LexicalNode, LexicalUpdateJSON, RangeSelection } from 'lexical'

import { $applyNodeReplacement, $isElementNode } from 'lexical'

import type { LinkFields, SerializedAutoLinkNode } from './types.js'

import { LinkNode } from './LinkNode.js'

// Custom node type to override `canInsertTextAfter` that will
// allow typing within the link

export class AutoLinkNode extends LinkNode {
  static override clone(node: AutoLinkNode): AutoLinkNode {
    return new this({ id: '', fields: node.__fields, key: node.__key })
  }

  static override getType(): string {
    return 'autolink'
  }

  static override importDOM(): null {
    // TODO: Should link node should handle the import over autolink?
    return null
  }

  static override importJSON(serializedNode: SerializedAutoLinkNode): AutoLinkNode {
    const node = $createAutoLinkNode({}).updateFromJSON(serializedNode)

    /**
     * @todo remove in 4.0
     */
    if (
      serializedNode.version === 1 &&
      typeof serializedNode.fields?.doc?.value === 'object' &&
      serializedNode.fields?.doc?.value?.id
    ) {
      serializedNode.fields.doc.value = serializedNode.fields.doc.value.id
      serializedNode.version = 2
    }

    return node
  }

  // @ts-expect-error
  exportJSON(): SerializedAutoLinkNode {
    const serialized = super.exportJSON()
    return {
      type: 'autolink',
      children: serialized.children,
      direction: serialized.direction,
      fields: serialized.fields,
      format: serialized.format,
      indent: serialized.indent,
      version: 2,
    }
  }

  override insertNewAfter(selection: RangeSelection, restoreSelection = true): ElementNode | null {
    const element = this.getParentOrThrow().insertNewAfter(selection, restoreSelection)
    if ($isElementNode(element)) {
      const linkNode = $createAutoLinkNode({ fields: this.__fields })
      element.append(linkNode)
      return linkNode
    }
    return null
  }

  override updateFromJSON(serializedNode: LexicalUpdateJSON<SerializedAutoLinkNode>): this {
    return super.updateFromJSON(serializedNode).setFields(serializedNode.fields)
  }
}

export function $createAutoLinkNode({ fields }: { fields?: LinkFields }): AutoLinkNode {
  return $applyNodeReplacement(new AutoLinkNode({ id: '', fields }))
}
export function $isAutoLinkNode(node: LexicalNode | null | undefined): node is AutoLinkNode {
  return node instanceof AutoLinkNode
}
```

--------------------------------------------------------------------------------

---[FILE: LinkNode.ts]---
Location: payload-main/packages/richtext-lexical/src/features/link/nodes/LinkNode.ts

```typescript
import type {
  BaseSelection,
  DOMConversionMap,
  DOMConversionOutput,
  EditorConfig,
  ElementNode as ElementNodeType,
  LexicalCommand,
  LexicalNode,
  LexicalUpdateJSON,
  NodeKey,
  RangeSelection,
} from 'lexical'

import { addClassNamesToElement, isHTMLAnchorElement } from '@lexical/utils'
import ObjectID from 'bson-objectid'
import {
  $applyNodeReplacement,
  $createTextNode,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  createCommand,
  ElementNode,
} from 'lexical'

import type { LinkPayload } from '../client/plugins/floatingLinkEditor/types.js'
import type { LinkFields, SerializedLinkNode } from './types.js'

const SUPPORTED_URL_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'sms:', 'tel:'])

/** @noInheritDoc */
export class LinkNode extends ElementNode {
  __fields: LinkFields
  __id: string

  constructor({
    id,
    fields = {
      linkType: 'custom',
      newTab: false,
    },
    key,
  }: {
    fields?: LinkFields
    id: string
    key?: NodeKey
  }) {
    super(key)
    this.__fields = fields
    this.__id = id
  }

  static override clone(node: LinkNode): LinkNode {
    return new this({
      id: node.__id,
      fields: node.__fields,
      key: node.__key,
    })
  }

  static override getType(): string {
    return 'link'
  }

  static override importDOM(): DOMConversionMap | null {
    return {
      a: (node: Node) => ({
        conversion: $convertAnchorElement,
        priority: 1,
      }),
    }
  }

  static override importJSON(serializedNode: SerializedLinkNode): LinkNode {
    const node = $createLinkNode({}).updateFromJSON(serializedNode)

    /**
     * @todo remove this in 4.0
     */
    if (
      serializedNode.version === 1 &&
      typeof serializedNode.fields?.doc?.value === 'object' &&
      serializedNode.fields?.doc?.value?.id
    ) {
      serializedNode.fields.doc.value = serializedNode.fields.doc.value.id
      serializedNode.version = 2
    }

    if (serializedNode.version === 2 && !serializedNode.id) {
      serializedNode.id = new ObjectID.default().toHexString()
      serializedNode.version = 3
    }
    return node
  }

  override canBeEmpty(): false {
    return false
  }

  override canInsertTextAfter(): false {
    return false
  }

  override canInsertTextBefore(): false {
    return false
  }

  override createDOM(config: EditorConfig): HTMLAnchorElement {
    const element = document.createElement('a')
    if (this.__fields?.linkType === 'custom') {
      element.href = this.sanitizeUrl(this.__fields.url ?? '')
    }
    if (this.__fields?.newTab ?? false) {
      element.target = '_blank'
    }

    if (this.__fields?.newTab === true && this.__fields?.linkType === 'custom') {
      element.rel = manageRel(element.rel, 'add', 'noopener')
    }

    addClassNamesToElement(element, config.theme.link)
    return element
  }

  override exportJSON(): SerializedLinkNode {
    const fields = this.getFields()

    if (fields?.linkType === 'internal') {
      delete fields.url
    } else if (fields?.linkType === 'custom') {
      delete fields.doc
    }

    const returnObject: SerializedLinkNode = {
      ...super.exportJSON(),
      type: 'link',
      fields,
      version: 3,
    }
    const id = this.getID()
    if (id) {
      returnObject.id = id
    }
    return returnObject
  }

  override extractWithChild(
    child: LexicalNode,
    selection: BaseSelection,
    destination: 'clone' | 'html',
  ): boolean {
    if (!$isRangeSelection(selection)) {
      return false
    }

    const anchorNode = selection.anchor.getNode()
    const focusNode = selection.focus.getNode()

    return (
      this.isParentOf(anchorNode) &&
      this.isParentOf(focusNode) &&
      selection.getTextContent().length > 0
    )
  }

  getFields(): LinkFields {
    return this.getLatest().__fields
  }

  getID(): string {
    return this.getLatest().__id
  }

  override insertNewAfter(
    selection: RangeSelection,
    restoreSelection = true,
  ): ElementNodeType | null {
    const element = this.getParentOrThrow().insertNewAfter(selection, restoreSelection)
    if ($isElementNode(element)) {
      const linkNode = $createLinkNode({ fields: this.__fields })
      element.append(linkNode)
      return linkNode
    }
    return null
  }

  override isInline(): true {
    return true
  }

  sanitizeUrl(url: string): string {
    try {
      const parsedUrl = new URL(url)

      if (!SUPPORTED_URL_PROTOCOLS.has(parsedUrl.protocol)) {
        return 'about:blank'
      }
    } catch (e) {
      return 'https://'
    }
    return url
  }

  setFields(fields: LinkFields): this {
    const writable = this.getWritable()
    writable.__fields = fields
    return writable
  }

  setID(id: string): this {
    const writable = this.getWritable()
    writable.__id = id
    return writable
  }

  override updateDOM(prevNode: this, anchor: HTMLAnchorElement, config: EditorConfig): boolean {
    const url = this.__fields?.url
    const newTab = this.__fields?.newTab
    if (url != null && url !== prevNode.__fields?.url && this.__fields?.linkType === 'custom') {
      anchor.href = url
    }
    if (this.__fields?.linkType === 'internal' && prevNode.__fields?.linkType === 'custom') {
      anchor.removeAttribute('href')
    }

    // TODO: not 100% sure why we're settign rel to '' - revisit
    // Start rel config here, then check newTab below
    if (anchor.rel == null) {
      anchor.rel = ''
    }

    if (newTab !== prevNode.__fields?.newTab) {
      if (newTab ?? false) {
        anchor.target = '_blank'
        if (this.__fields?.linkType === 'custom') {
          anchor.rel = manageRel(anchor.rel, 'add', 'noopener')
        }
      } else {
        anchor.removeAttribute('target')
        anchor.rel = manageRel(anchor.rel, 'remove', 'noopener')
      }
    }

    return false
  }

  override updateFromJSON(serializedNode: LexicalUpdateJSON<SerializedLinkNode>): this {
    return super
      .updateFromJSON(serializedNode)
      .setFields(serializedNode.fields)
      .setID(serializedNode.id as string)
  }
}

function $convertAnchorElement(domNode: Node): DOMConversionOutput {
  let node: LinkNode | null = null
  if (isHTMLAnchorElement(domNode)) {
    const content = domNode.textContent
    if (content !== null && content !== '') {
      node = $createLinkNode({
        id: new ObjectID.default().toHexString(),
        fields: {
          doc: null,
          linkType: 'custom',
          newTab: domNode.getAttribute('target') === '_blank',
          url: domNode.getAttribute('href') ?? '',
        },
      })
    }
  }
  return { node }
}

export function $createLinkNode({ id, fields }: { fields?: LinkFields; id?: string }): LinkNode {
  return $applyNodeReplacement(
    new LinkNode({
      id: id ?? new ObjectID.default().toHexString(),
      fields,
    }),
  )
}

export function $isLinkNode(node: LexicalNode | null | undefined): node is LinkNode {
  return node instanceof LinkNode
}

export const TOGGLE_LINK_COMMAND: LexicalCommand<LinkPayload | null> =
  createCommand('TOGGLE_LINK_COMMAND')

export function $toggleLink(payload: ({ fields: LinkFields } & LinkPayload) | null): void {
  const selection = $getSelection()

  if (!$isRangeSelection(selection) && (payload === null || !payload.selectedNodes?.length)) {
    return
  }
  const nodes = $isRangeSelection(selection)
    ? selection.extract()
    : payload === null
      ? []
      : payload.selectedNodes

  if (payload === null) {
    // Remove LinkNodes
    nodes?.forEach((node) => {
      const parent = node.getParent()

      if ($isLinkNode(parent)) {
        const children = parent.getChildren()

        children.forEach((child) => {
          parent.insertBefore(child)
        })

        parent.remove()
      }
    })

    return
  }
  // Add or merge LinkNodes
  if (nodes?.length === 1) {
    const firstNode = nodes[0]!
    // if the first node is a LinkNode or if its
    // parent is a LinkNode, we update the URL, target and rel.
    const linkNode: LinkNode | null = $isLinkNode(firstNode)
      ? firstNode
      : $getLinkAncestor(firstNode)
    if (linkNode !== null) {
      linkNode.setFields(payload.fields)

      if (payload.text != null && payload.text !== linkNode.getTextContent()) {
        // remove all children and add child with new textcontent:
        linkNode.append($createTextNode(payload.text))
        linkNode.getChildren().forEach((child) => {
          if (child !== linkNode.getLastChild()) {
            child.remove()
          }
        })
      }
      return
    }
  }

  let prevParent: ElementNodeType | LinkNode | null = null
  let linkNode: LinkNode | null = null

  nodes?.forEach((node) => {
    const parent = node.getParent()

    if (parent === linkNode || parent === null || ($isElementNode(node) && !node.isInline())) {
      return
    }

    if ($isLinkNode(parent)) {
      linkNode = parent
      parent.setFields(payload.fields)
      if (payload.text != null && payload.text !== parent.getTextContent()) {
        // remove all children and add child with new textcontent:
        parent.append($createTextNode(payload.text))
        parent.getChildren().forEach((child) => {
          if (child !== parent.getLastChild()) {
            child.remove()
          }
        })
      }
      return
    }

    if (!parent.is(prevParent)) {
      prevParent = parent
      linkNode = $createLinkNode({ fields: payload.fields })

      if ($isLinkNode(parent)) {
        if (node.getPreviousSibling() === null) {
          parent.insertBefore(linkNode)
        } else {
          parent.insertAfter(linkNode)
        }
      } else {
        node.insertBefore(linkNode)
      }
    }

    if ($isLinkNode(node)) {
      if (node.is(linkNode)) {
        return
      }
      if (linkNode !== null) {
        const children = node.getChildren()
        linkNode.append(...children)
      }

      node.remove()
      return
    }

    if (linkNode !== null) {
      linkNode.append(node)
    }
  })
}

function $getLinkAncestor(node: LexicalNode): LinkNode | null {
  return $getAncestor(node, (ancestor) => $isLinkNode(ancestor)) as LinkNode
}

function $getAncestor(
  node: LexicalNode,
  predicate: (ancestor: LexicalNode) => boolean,
): LexicalNode | null {
  let parent: LexicalNode | null = node
  while (parent !== null) {
    parent = parent.getParent()
    if (parent === null || predicate(parent)) {
      break
    }
  }
  return parent
}

function manageRel(input: string, action: 'add' | 'remove', value: string): string {
  let result: string
  let mutableInput = `${input}`
  if (action === 'add') {
    // if we somehow got out of sync - clean up
    if (mutableInput.includes(value)) {
      const re = new RegExp(value, 'g')
      mutableInput = mutableInput.replace(re, '').trim()
    }
    mutableInput = mutableInput.trim()
    result = mutableInput.length === 0 ? `${value}` : `${mutableInput} ${value}`
  } else {
    const re = new RegExp(value, 'g')
    result = mutableInput.replace(re, '').trim()
  }
  return result
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/richtext-lexical/src/features/link/nodes/types.ts

```typescript
import type { SerializedElementNode, SerializedLexicalNode } from 'lexical'
import type { DefaultDocumentIDType, JsonValue } from 'payload'

import type { StronglyTypedElementNode } from '../../../nodeTypes.js'

export type LinkFields = {
  [key: string]: JsonValue
  doc?: {
    relationTo: string
    value:
      | {
          // Actual doc data, populated in afterRead hook
          [key: string]: JsonValue
          id: DefaultDocumentIDType
        }
      | DefaultDocumentIDType
  } | null
  linkType: 'custom' | 'internal'
  newTab: boolean
  url?: string
}

export type SerializedLinkNode<T extends SerializedLexicalNode = SerializedLexicalNode> = {
  fields: LinkFields
  /**
   * @todo make required in 4.0 and type AutoLinkNode differently
   */
  id?: string // optional if AutoLinkNode
} & StronglyTypedElementNode<SerializedElementNode, 'link', T>

export type SerializedAutoLinkNode<T extends SerializedLexicalNode = SerializedLexicalNode> = {
  fields: LinkFields
} & StronglyTypedElementNode<SerializedElementNode, 'autolink', T>
```

--------------------------------------------------------------------------------

---[FILE: baseFields.ts]---
Location: payload-main/packages/richtext-lexical/src/features/link/server/baseFields.ts

```typescript
import type {
  CollectionSlug,
  FieldAffectingData,
  RadioField,
  SanitizedConfig,
  TextField,
  TextFieldSingleValidation,
  TypedUser,
} from 'payload'

import type { LinkFields } from '../nodes/types.js'

import { validateUrl, validateUrlMinimal } from '../../../lexical/utils/url.js'

export const getBaseFields = (
  config: SanitizedConfig,
  enabledCollections?: CollectionSlug[],
  disabledCollections?: CollectionSlug[],
  maxDepth?: number,
): FieldAffectingData[] => {
  let enabledRelations: CollectionSlug[]

  /**
   * Figure out which relations should be enabled (enabledRelations) based on a collection's admin.enableRichTextLink property,
   * or the Link Feature's enabledCollections and disabledCollections properties which override it.
   */
  if (enabledCollections) {
    enabledRelations = enabledCollections
  } else if (disabledCollections) {
    enabledRelations = config.collections
      .filter(({ slug }) => !disabledCollections.includes(slug))
      .map(({ slug }) => slug)
  } else {
    enabledRelations = config.collections
      .filter(({ admin: { enableRichTextLink, hidden } }) => {
        if (typeof hidden !== 'function' && hidden) {
          return false
        }
        return enableRichTextLink
      })
      .map(({ slug }) => slug)
  }

  const baseFields: FieldAffectingData[] = [
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
      ],
      required: true,
    } as RadioField,
    {
      name: 'url',
      type: 'text',
      hooks: {
        beforeChange: [
          ({ value }) => {
            if (!value) {
              return
            }

            if (!validateUrl(value)) {
              return encodeURIComponent(value)
            }
            return value
          },
        ],
      },
      label: ({ t }) => t('fields:enterURL'),
      required: true,
      validate: ((value: string, options) => {
        if ((options?.siblingData as LinkFields)?.linkType === 'internal') {
          return // no validation needed, as no url should exist for internal links
        }
        if (!validateUrlMinimal(value)) {
          return 'Invalid URL'
        }
      }) as TextFieldSingleValidation,
    },
  ]

  // Only display internal link-specific fields / options / conditions if there are enabled relations
  if (enabledRelations?.length) {
    ;(baseFields[1] as RadioField).options.push({
      label: ({ t }) => t('fields:internalLink'),
      value: 'internal',
    })
    ;(baseFields[2] as TextField).admin = {
      condition: (_data, _siblingData) => {
        return _siblingData.linkType !== 'internal'
      },
    }

    baseFields.push({
      name: 'doc',
      admin: {
        condition: (_data, _siblingData) => {
          return _siblingData.linkType === 'internal'
        },
      },
      // when admin.hidden is a function we need to dynamically call hidden with the user to know if the collection should be shown
      type: 'relationship',
      filterOptions:
        !enabledCollections && !disabledCollections
          ? async ({ relationTo, req, user }) => {
              const admin = config.collections.find(({ slug }) => slug === relationTo)?.admin

              const hidden = admin?.hidden
              if (typeof hidden === 'function' && hidden({ user } as { user: TypedUser })) {
                return false
              }

              const baseFilter = admin?.baseFilter ?? admin?.baseListFilter
              return (
                (await baseFilter?.({
                  limit: 0,
                  page: 1,
                  req,
                  sort: 'id',
                })) ?? true
              )
            }
          : null,
      label: ({ t }) => t('fields:chooseDocumentToLink'),
      maxDepth,
      relationTo: enabledRelations,
      required: true,
    })
  }

  baseFields.push({
    name: 'newTab',
    type: 'checkbox',
    label: ({ t }) => t('fields:openInNewTab'),
  })

  return baseFields
}
```

--------------------------------------------------------------------------------

---[FILE: graphQLPopulationPromise.ts]---
Location: payload-main/packages/richtext-lexical/src/features/link/server/graphQLPopulationPromise.ts

```typescript
import type { PopulationPromise } from '../../typesServer.js'
import type { SerializedLinkNode } from '../nodes/types.js'
import type { LinkFeatureServerProps } from './index.js'

import { recursivelyPopulateFieldsForGraphQL } from '../../../populateGraphQL/recursivelyPopulateFieldsForGraphQL.js'

export const linkPopulationPromiseHOC = (
  props: LinkFeatureServerProps,
): PopulationPromise<SerializedLinkNode> => {
  return ({
    context,
    currentDepth,
    depth,
    draft,
    editorPopulationPromises,
    field,
    fieldPromises,
    findMany,
    flattenLocales,
    node,
    overrideAccess,
    parentIsLocalized,
    populationPromises,
    req,
    showHiddenFields,
  }) => {
    if (!props.fields?.length) {
      return
    }

    /**
     * Should populate all fields, including the doc field (for internal links), as it's treated like a normal field
     */
    if (Array.isArray(props.fields)) {
      recursivelyPopulateFieldsForGraphQL({
        context,
        currentDepth,
        data: node.fields,
        depth,
        draft,
        editorPopulationPromises,
        fieldPromises,
        fields: props.fields,
        findMany,
        flattenLocales,
        overrideAccess,
        parentIsLocalized: parentIsLocalized || field.localized || false,
        populationPromises,
        req,
        showHiddenFields,
        siblingDoc: node.fields,
      })
    }
  }
}
```

--------------------------------------------------------------------------------

````
