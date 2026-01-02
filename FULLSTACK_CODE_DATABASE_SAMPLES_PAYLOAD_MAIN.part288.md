---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 288
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 288 of 695)

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
Location: payload-main/packages/richtext-lexical/src/features/upload/client/plugin/index.tsx
Signals: React

```typescript
'use client'
import type { LexicalCommand } from 'lexical'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.js'
import { $dfsIterator, $insertNodeToNearestRoot, mergeRegister } from '@lexical/utils'
import { useBulkUpload, useEffectEvent, useModal } from '@payloadcms/ui'
import ObjectID from 'bson-objectid'
import {
  $createRangeSelection,
  $getPreviousSelection,
  $getSelection,
  $isParagraphNode,
  $isRangeSelection,
  $setSelection,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_LOW,
  createCommand,
  DROP_COMMAND,
  getDOMSelectionFromTarget,
  isHTMLElement,
  PASTE_COMMAND,
} from 'lexical'
import React, { useEffect } from 'react'

import type { PluginComponent } from '../../../typesClient.js'
import type { Internal_UploadData, UploadData } from '../../server/nodes/UploadNode.js'
import type { UploadFeaturePropsClient } from '../index.js'

import { useEnabledRelationships } from '../../../relationship/client/utils/useEnabledRelationships.js'
import { UploadDrawer } from '../drawer/index.js'
import { $createUploadNode, $isUploadNode, UploadNode } from '../nodes/UploadNode.js'

export type InsertUploadPayload = Readonly<Omit<UploadData, 'id'> & Partial<Pick<UploadData, 'id'>>>

declare global {
  interface DragEvent {
    rangeOffset?: number
    rangeParent?: Node
  }
}

function canDropImage(event: DragEvent): boolean {
  const target = event.target
  return !!(
    isHTMLElement(target) &&
    !target.closest('code, span.editor-image') &&
    isHTMLElement(target.parentElement) &&
    target.parentElement.closest('div.ContentEditable__root')
  )
}

function getDragSelection(event: DragEvent): null | Range | undefined {
  // Source: https://github.com/AlessioGr/lexical/blob/main/packages/lexical-playground/src/plugins/ImagesPlugin/index.tsx
  let range
  const domSelection = getDOMSelectionFromTarget(event.target)
  if (document.caretRangeFromPoint) {
    range = document.caretRangeFromPoint(event.clientX, event.clientY)
  } else if (event.rangeParent && domSelection !== null) {
    domSelection.collapse(event.rangeParent, event.rangeOffset || 0)
    range = domSelection.getRangeAt(0)
  } else {
    throw Error(`Cannot get the selection when dragging`)
  }

  return range
}

export const INSERT_UPLOAD_COMMAND: LexicalCommand<InsertUploadPayload> =
  createCommand('INSERT_UPLOAD_COMMAND')

type FileToUpload = {
  alt?: string
  file: File
  /**
   * Bulk Upload Form ID that should be created, which can then be matched
   * against the node formID if the upload is successful
   */
  formID: string
}

export const UploadPlugin: PluginComponent<UploadFeaturePropsClient> = ({ clientProps }) => {
  const [editor] = useLexicalComposerContext()

  const { enabledCollectionSlugs } = useEnabledRelationships({
    collectionSlugsBlacklist: clientProps?.disabledCollections,
    collectionSlugsWhitelist: clientProps?.enabledCollections,
    uploads: true,
  })

  const {
    drawerSlug: bulkUploadDrawerSlug,
    setCollectionSlug,
    setInitialForms,
    setOnCancel,
    setOnSuccess,
    setSelectableCollections,
  } = useBulkUpload()

  const { isModalOpen, openModal } = useModal()

  const openBulkUpload = useEffectEvent(({ files }: { files: FileToUpload[] }) => {
    if (files?.length === 0) {
      return
    }

    setInitialForms((initialForms) => [
      ...(initialForms ?? []),
      ...files.map((file) => ({
        file: file.file,
        formID: file.formID,
      })),
    ])

    if (!isModalOpen(bulkUploadDrawerSlug)) {
      if (!enabledCollectionSlugs.length || !enabledCollectionSlugs[0]) {
        return
      }

      setCollectionSlug(enabledCollectionSlugs[0])
      setSelectableCollections(enabledCollectionSlugs)

      setOnCancel(() => {
        // Remove all the pending upload nodes that were added but not uploaded
        editor.update(() => {
          for (const dfsNode of $dfsIterator()) {
            const node = dfsNode.node

            if ($isUploadNode(node)) {
              const nodeData = node.getData()
              if ((nodeData as Internal_UploadData)?.pending) {
                node.remove()
              }
            }
          }
        })
      })

      setOnSuccess((newDocs) => {
        const newDocsMap = new Map(newDocs.map((doc) => [doc.formID, doc]))
        editor.update(() => {
          for (const dfsNode of $dfsIterator()) {
            const node = dfsNode.node
            if ($isUploadNode(node)) {
              const nodeData: Internal_UploadData = node.getData()

              if (nodeData?.pending) {
                const newDoc = newDocsMap.get(nodeData.pending?.formID)
                if (newDoc) {
                  node.replace(
                    $createUploadNode({
                      data: {
                        id: new ObjectID.default().toHexString(),
                        fields: {},
                        relationTo: newDoc.collectionSlug,
                        value: newDoc.doc.id,
                      } as UploadData,
                    }),
                  )
                }
              }
            }
          }
        })
      })

      openModal(bulkUploadDrawerSlug)
    }
  })

  useEffect(() => {
    if (!editor.hasNodes([UploadNode])) {
      throw new Error('UploadPlugin: UploadNode not registered on editor')
    }

    return mergeRegister(
      /**
       * Handle auto-uploading files if you copy & paste an image dom element from the clipboard
       */
      editor.registerNodeTransform(UploadNode, (node) => {
        const nodeData: Internal_UploadData = node.getData()
        if (!nodeData?.pending) {
          return
        }

        async function upload() {
          let transformedImage: FileToUpload | null = null

          const src = nodeData?.pending?.src
          const formID = nodeData?.pending?.formID as string

          if (src?.startsWith('data:')) {
            // It's a base64-encoded image
            const mimeMatch = src.match(/data:(image\/[a-zA-Z]+);base64,/)
            const mimeType = mimeMatch ? mimeMatch[1] : 'image/png' // Default to PNG if MIME type not found
            const base64Data = src.replace(/^data:image\/[a-zA-Z]+;base64,/, '')
            const byteCharacters = atob(base64Data)
            const byteNumbers = new Array(byteCharacters.length)
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i)
            }
            const byteArray = new Uint8Array(byteNumbers)
            const file = new File([byteArray], 'pasted-image.' + mimeType?.split('/', 2)[1], {
              type: mimeType,
            })
            transformedImage = { alt: undefined, file, formID }
          } else if (src?.startsWith('http') || src?.startsWith('https')) {
            // It's an image URL
            const res = await fetch(src)
            const blob = await res.blob()
            const inferredFileName =
              src.split('/').pop() || 'pasted-image' + blob.type.split('/', 2)[1]
            const file = new File([blob], inferredFileName, {
              type: blob.type,
            })

            transformedImage = { alt: undefined, file, formID }
          }

          if (!transformedImage) {
            return
          }

          openBulkUpload({ files: [transformedImage] })
        }
        void upload()
      }),
      editor.registerCommand<InsertUploadPayload>(
        INSERT_UPLOAD_COMMAND,
        (payload: InsertUploadPayload) => {
          editor.update(() => {
            const selection = $getSelection() || $getPreviousSelection()

            if ($isRangeSelection(selection)) {
              const uploadNode = $createUploadNode({
                data: {
                  id: payload.id,
                  fields: payload.fields,
                  relationTo: payload.relationTo,
                  value: payload.value,
                },
              })
              // we need to get the focus node before inserting the block node, as $insertNodeToNearestRoot can change the focus node
              const { focus } = selection
              const focusNode = focus.getNode()
              // Insert upload node BEFORE potentially removing focusNode, as $insertNodeToNearestRoot errors if the focusNode doesn't exist
              $insertNodeToNearestRoot(uploadNode)

              // Delete the node it it's an empty paragraph
              if ($isParagraphNode(focusNode) && !focusNode.__first) {
                focusNode.remove()
              }
            }
          })

          return true
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand(
        PASTE_COMMAND,
        (event) => {
          // Pending UploadNodes are automatically created when importDOM is called. However, if you paste a file from your computer
          // directly, importDOM won't be called, as it's not a HTML dom element. So we need to handle that case here.

          if (!(event instanceof ClipboardEvent)) {
            return false
          }
          const clipboardData = event.clipboardData

          if (!clipboardData?.types?.length || clipboardData?.types?.includes('text/html')) {
            // HTML is handled through importDOM => registerNodeTransform for pending UploadNode
            return false
          }

          const files: FileToUpload[] = []
          if (clipboardData?.files?.length) {
            Array.from(clipboardData.files).forEach((file) => {
              files.push({
                alt: '',
                file,
                formID: new ObjectID.default().toHexString(),
              })
            })
          }

          if (files.length) {
            // Insert a pending UploadNode for each image
            editor.update(() => {
              const selection = $getSelection() || $getPreviousSelection()

              if ($isRangeSelection(selection)) {
                for (const file of files) {
                  const pendingUploadNode = $createUploadNode({
                    data: {
                      pending: {
                        formID: file.formID,
                        src: URL.createObjectURL(file.file),
                      },
                    } as Internal_UploadData,
                  })
                  // we need to get the focus node before inserting the upload node, as $insertNodeToNearestRoot can change the focus node
                  const { focus } = selection
                  const focusNode = focus.getNode()
                  // Insert upload node BEFORE potentially removing focusNode, as $insertNodeToNearestRoot errors if the focusNode doesn't exist
                  $insertNodeToNearestRoot(pendingUploadNode)

                  // Delete the node it it's an empty paragraph
                  if ($isParagraphNode(focusNode) && !focusNode.__first) {
                    focusNode.remove()
                  }
                }
              }
            })

            // Open the bulk drawer - the node transform will not open it for us, as it does not handle blob/file uploads
            openBulkUpload({ files })

            return true
          }

          return false
        },
        COMMAND_PRIORITY_LOW,
      ),
      // Handle drag & drop of files from the desktop into the editor
      editor.registerCommand(
        DROP_COMMAND,
        (event) => {
          if (!(event instanceof DragEvent)) {
            return false
          }

          const dt = event.dataTransfer

          if (!dt?.types?.length) {
            return false
          }

          const files: FileToUpload[] = []
          if (dt?.files?.length) {
            Array.from(dt.files).forEach((file) => {
              files.push({
                alt: '',
                file,
                formID: new ObjectID.default().toHexString(),
              })
            })
          }

          if (files.length) {
            // Prevent the default browser drop handling, which would open the file in the browser
            event.preventDefault()
            event.stopPropagation()

            // Insert a PendingUploadNode for each image
            editor.update(() => {
              if (canDropImage(event)) {
                const range = getDragSelection(event)
                const selection = $createRangeSelection()
                if (range !== null && range !== undefined) {
                  selection.applyDOMRange(range)
                }
                $setSelection(selection)

                for (const file of files) {
                  const pendingUploadNode = $createUploadNode({
                    data: {
                      pending: {
                        formID: file.formID,
                        src: URL.createObjectURL(file.file),
                      },
                    } as Internal_UploadData,
                  })
                  // we need to get the focus node before inserting the upload node, as $insertNodeToNearestRoot can change the focus node
                  const { focus } = selection
                  const focusNode = focus.getNode()
                  // Insert upload node BEFORE potentially removing focusNode, as $insertNodeToNearestRoot errors if the focusNode doesn't exist
                  $insertNodeToNearestRoot(pendingUploadNode)

                  // Delete the node it it's an empty paragraph
                  if ($isParagraphNode(focusNode) && !focusNode.__first) {
                    focusNode.remove()
                  }
                }
              }
            })

            // Open the bulk drawer - the node transform will not open it for us, as it does not handle blob/file uploads
            openBulkUpload({ files })

            return true
          }

          return false
        },
        COMMAND_PRIORITY_LOW,
      ),
    )
  }, [editor])

  return <UploadDrawer enabledCollectionSlugs={enabledCollectionSlugs} />
}
```

--------------------------------------------------------------------------------

---[FILE: graphQLPopulationPromise.ts]---
Location: payload-main/packages/richtext-lexical/src/features/upload/server/graphQLPopulationPromise.ts

```typescript
import type { PopulationPromise } from '../../typesServer.js'
import type { UploadFeatureProps } from './index.js'
import type { SerializedUploadNode } from './nodes/UploadNode.js'

import { populate } from '../../../populateGraphQL/populate.js'
import { recursivelyPopulateFieldsForGraphQL } from '../../../populateGraphQL/recursivelyPopulateFieldsForGraphQL.js'

export const uploadPopulationPromiseHOC = (
  props?: UploadFeatureProps,
): PopulationPromise<SerializedUploadNode> => {
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
    if (node?.value) {
      const collection = req.payload.collections[node?.relationTo]

      if (collection) {
        // @ts-expect-error
        const id = node?.value?.id || node?.value // for backwards-compatibility

        const populateDepth =
          props?.maxDepth !== undefined && props?.maxDepth < depth ? props?.maxDepth : depth

        populationPromises.push(
          populate({
            id,
            collectionSlug: collection.config.slug,
            currentDepth,
            data: node,
            depth: populateDepth,
            draft,
            key: 'value',
            overrideAccess,
            req,
            showHiddenFields,
          }),
        )

        const collectionFieldSchema = props?.collections?.[node?.relationTo]?.fields

        if (Array.isArray(collectionFieldSchema)) {
          if (!collectionFieldSchema?.length) {
            return
          }
          recursivelyPopulateFieldsForGraphQL({
            context,
            currentDepth,
            data: node.fields || {},
            depth,
            parentIsLocalized: parentIsLocalized || field.localized || false,

            draft,
            editorPopulationPromises,
            fieldPromises,
            fields: collectionFieldSchema,
            findMany,
            flattenLocales,
            overrideAccess,
            populationPromises,
            req,
            showHiddenFields,
            siblingDoc: node.fields || {},
          })
        }
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: i18n.ts]---
Location: payload-main/packages/richtext-lexical/src/features/upload/server/i18n.ts

```typescript
import type { GenericLanguages } from '@payloadcms/translations'

export const i18n: Partial<GenericLanguages> = {
  ar: {
    label: 'تحميل',
  },
  az: {
    label: 'Yükləyin',
  },
  bg: {
    label: 'Качване',
  },
  cs: {
    label: 'Nahrát',
  },
  da: {
    label: 'Upload',
  },
  de: {
    label: 'Datei',
  },
  en: {
    label: 'Upload',
  },
  es: {
    label: 'Subir',
  },
  et: {
    label: 'Lae üles',
  },
  fa: {
    label: 'بارگذاری',
  },
  fr: {
    label: 'Télécharger',
  },
  he: {
    label: 'העלה',
  },
  hr: {
    label: 'Prenesi',
  },
  hu: {
    label: 'Feltöltés',
  },
  is: {
    label: 'Hlaða upp',
  },
  it: {
    label: 'Carica',
  },
  ja: {
    label: 'アップロード',
  },
  ko: {
    label: '업로드',
  },
  my: {
    label: 'တင်ပြီး',
  },
  nb: {
    label: 'Last opp',
  },
  nl: {
    label: 'Uploaden',
  },
  pl: {
    label: 'Prześlij',
  },
  pt: {
    label: 'Carregar',
  },
  ro: {
    label: 'Încarcă',
  },
  rs: {
    label: 'Отпреми',
  },
  'rs-latin': {
    label: 'Otpremi',
  },
  ru: {
    label: 'Загрузить',
  },
  sk: {
    label: 'Nahrať',
  },
  sl: {
    label: 'Naloži',
  },
  sv: {
    label: 'Ladda upp',
  },
  ta: {
    label: 'பதிவேற்றம்',
  },
  th: {
    label: 'อัปโหลด',
  },
  tr: {
    label: 'Yükle',
  },
  uk: {
    label: 'Завантажити',
  },
  vi: {
    label: 'Tải lên',
  },
  zh: {
    label: '上传',
  },
  'zh-TW': {
    label: '上傳',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/richtext-lexical/src/features/upload/server/index.ts

```typescript
import type {
  Config,
  Field,
  FieldSchemaMap,
  FileData,
  FileSizeImproved,
  Payload,
  TypeWithID,
  UploadCollectionSlug,
} from 'payload'

import { sanitizeFields } from 'payload'

import type { UploadFeaturePropsClient } from '../client/index.js'

import { populate } from '../../../populateGraphQL/populate.js'
import { createServerFeature } from '../../../utilities/createServerFeature.js'
import { createNode } from '../../typeUtilities.js'
import { uploadPopulationPromiseHOC } from './graphQLPopulationPromise.js'
import { i18n } from './i18n.js'
import { UploadServerNode } from './nodes/UploadNode.js'
import { uploadValidation } from './validate.js'

export type ExclusiveUploadFeatureProps =
  | {
      /**
       * The collections that should be disabled. Overrides the `enableRichTextRelationship` property in the collection config.
       * When this property is set, `enabledCollections` will not be available.
       **/
      disabledCollections?: UploadCollectionSlug[]

      // Ensures that enabledCollections is not available when disabledCollections is set
      enabledCollections?: never
    }
  | {
      // Ensures that disabledCollections is not available when enabledCollections is set
      disabledCollections?: never

      /**
       * The collections that should be enabled. Overrides the `enableRichTextRelationship` property in the collection config
       * When this property is set, `disabledCollections` will not be available.
       **/
      enabledCollections?: UploadCollectionSlug[]
    }

export type UploadFeatureProps = {
  collections?: {
    [collection: UploadCollectionSlug]: {
      fields: Field[]
    }
  }
  /**
   * Sets a maximum population depth for this upload (not the fields for this upload), regardless of the remaining depth when the respective field is reached.
   * This behaves exactly like the maxDepth properties of relationship and upload fields.
   *
   * {@link https://payloadcms.com/docs/getting-started/concepts#field-level-max-depth}
   */
  maxDepth?: number
} & ExclusiveUploadFeatureProps

/**
 * Get the absolute URL for an upload URL by potentially prepending the serverURL
 */
function getAbsoluteURL(url: string, payload: Payload): string {
  return url?.startsWith('http') ? url : (payload?.config?.serverURL || '') + url
}

export const UploadFeature = createServerFeature<
  UploadFeatureProps,
  UploadFeatureProps,
  UploadFeaturePropsClient
>({
  feature: async ({ config: _config, isRoot, parentIsLocalized, props }) => {
    if (!props) {
      props = { collections: {} }
    }

    const clientProps: UploadFeaturePropsClient = {
      collections: {},
    }
    if (props.disabledCollections) {
      clientProps.disabledCollections = props.disabledCollections
    }
    if (props.enabledCollections) {
      clientProps.enabledCollections = props.enabledCollections
    }

    if (props.collections) {
      for (const collection in props.collections) {
        clientProps.collections[collection] = {
          hasExtraFields: props.collections[collection]!.fields.length >= 1,
        }
      }
    }

    const validRelationships = _config.collections.map((c) => c.slug) || []

    for (const collectionKey in props.collections) {
      const collection = props.collections[collectionKey]!
      if (collection.fields?.length) {
        collection.fields = await sanitizeFields({
          config: _config as unknown as Config,
          fields: collection.fields,
          parentIsLocalized,
          requireFieldLevelRichTextEditor: isRoot,
          validRelationships,
        })
      }
    }

    return {
      ClientFeature: '@payloadcms/richtext-lexical/client#UploadFeatureClient',
      clientFeatureProps: clientProps,
      generateSchemaMap: ({ props }) => {
        if (!props?.collections) {
          return null
        }

        const schemaMap: FieldSchemaMap = new Map()

        for (const collectionKey in props.collections) {
          const collection = props.collections[collectionKey]!
          if (collection.fields?.length) {
            schemaMap.set(collectionKey, {
              fields: collection.fields,
            })
          }
        }

        return schemaMap
      },
      i18n,
      nodes: [
        createNode({
          converters: {
            html: {
              converter: async ({
                currentDepth,
                depth,
                draft,
                node,
                overrideAccess,
                req,
                showHiddenFields,
              }) => {
                // @ts-expect-error - for backwards-compatibility
                const id = node?.value?.id || node?.value

                if (req?.payload) {
                  const uploadDocument: {
                    value?: FileData & TypeWithID
                  } = {}

                  try {
                    await populate({
                      id,
                      collectionSlug: node.relationTo,
                      currentDepth,
                      data: uploadDocument,
                      depth,
                      draft,
                      key: 'value',
                      overrideAccess,
                      req,
                      showHiddenFields,
                    })
                  } catch (ignored) {
                    // eslint-disable-next-line no-console
                    console.error(
                      'Lexical upload node HTML converter: error fetching upload file',
                      ignored,
                      'Node:',
                      node,
                    )
                    return `<img />`
                  }

                  const url = getAbsoluteURL(uploadDocument?.value?.url ?? '', req?.payload)

                  /**
                   * If the upload is not an image, return a link to the upload
                   */
                  if (!uploadDocument?.value?.mimeType?.startsWith('image')) {
                    return `<a href="${url}" rel="noopener noreferrer">${uploadDocument.value?.filename}</a>`
                  }

                  /**
                   * If the upload is a simple image with no different sizes, return a simple img tag
                   */
                  if (
                    !uploadDocument?.value?.sizes ||
                    !Object.keys(uploadDocument?.value?.sizes).length
                  ) {
                    return `<img src="${url}" alt="${uploadDocument?.value?.filename}" width="${uploadDocument?.value?.width}"  height="${uploadDocument?.value?.height}"/>`
                  }

                  /**
                   * If the upload is an image with different sizes, return a picture element
                   */
                  let pictureHTML = '<picture>'

                  // Iterate through each size in the data.sizes object
                  for (const size in uploadDocument.value?.sizes) {
                    const imageSize = uploadDocument.value.sizes[size] as FileSizeImproved

                    // Skip if any property of the size object is null
                    if (
                      !imageSize.width ||
                      !imageSize.height ||
                      !imageSize.mimeType ||
                      !imageSize.filesize ||
                      !imageSize.filename ||
                      !imageSize.url
                    ) {
                      continue
                    }
                    const imageSizeURL = getAbsoluteURL(imageSize?.url, req?.payload)

                    pictureHTML += `<source srcset="${imageSizeURL}" media="(max-width: ${imageSize.width}px)" type="${imageSize.mimeType}">`
                  }

                  // Add the default img tag
                  pictureHTML += `<img src="${url}" alt="Image" width="${uploadDocument.value?.width}" height="${uploadDocument.value?.height}">`
                  pictureHTML += '</picture>'
                  return pictureHTML
                } else {
                  return `<img src="${id}" />`
                }
              },
              nodeTypes: [UploadServerNode.getType()],
            },
          },
          getSubFields: ({ node, req }) => {
            if (!node) {
              let allSubFields: Field[] = []
              for (const collection in props?.collections) {
                const collectionFields = props.collections[collection]!.fields
                allSubFields = allSubFields.concat(collectionFields)
              }
              return allSubFields
            }
            const collection = req ? req.payload.collections[node?.relationTo] : null

            if (collection) {
              const collectionFieldSchema = props?.collections?.[node?.relationTo]?.fields

              if (Array.isArray(collectionFieldSchema)) {
                if (!collectionFieldSchema?.length) {
                  return null
                }
                return collectionFieldSchema
              }
            }
            return null
          },
          getSubFieldsData: ({ node }) => {
            return node?.fields
          },
          graphQLPopulationPromises: [uploadPopulationPromiseHOC(props)],
          hooks: {
            afterRead: [
              ({
                currentDepth,
                depth,
                draft,
                node,
                overrideAccess,
                populateArg,
                populationPromises,
                req,
                showHiddenFields,
              }) => {
                if (!node?.value) {
                  return node
                }
                const collection = req.payload.collections[node?.relationTo]

                if (!collection) {
                  return node
                }
                // @ts-expect-error - Fix in Payload v4
                const id = node?.value?.id || node?.value // for backwards-compatibility

                const populateDepth =
                  props?.maxDepth !== undefined && props?.maxDepth < depth ? props?.maxDepth : depth

                populationPromises.push(
                  populate({
                    id,
                    collectionSlug: collection.config.slug,
                    currentDepth,
                    data: node,
                    depth: populateDepth,
                    draft,
                    key: 'value',
                    overrideAccess,
                    req,
                    select:
                      populateArg?.[collection.config.slug] ?? collection.config.defaultPopulate,
                    showHiddenFields,
                  }),
                )

                return node
              },
            ],
          },
          node: UploadServerNode,
          validations: [uploadValidation(props)],
        }),
      ],
      sanitizedServerFeatureProps: props,
    }
  },
  key: 'upload',
})
```

--------------------------------------------------------------------------------

---[FILE: validate.ts]---
Location: payload-main/packages/richtext-lexical/src/features/upload/server/validate.ts

```typescript
import { fieldSchemasToFormState } from '@payloadcms/ui/forms/fieldSchemasToFormState'
import { isValidID } from 'payload'

import type { NodeValidation } from '../../typesServer.js'
import type { UploadFeatureProps } from './index.js'
import type { SerializedUploadNode } from './nodes/UploadNode.js'

export const uploadValidation = (
  props: UploadFeatureProps,
): NodeValidation<SerializedUploadNode> => {
  return async ({
    node,
    validation: {
      options: {
        id,
        data,
        operation,
        preferences,
        req,
        req: { payload, t },
      },
    },
  }) => {
    const idType = payload.collections[node.relationTo]?.customIDType || payload.db.defaultIDType
    // @ts-expect-error - Fix in Payload v4
    const nodeID = node?.value?.id || node?.value // for backwards-compatibility

    if (!isValidID(nodeID, idType)) {
      return t('validation:validUploadID')
    }

    if (!props?.collections) {
      return true
    }

    if (Object.keys(props?.collections).length === 0) {
      return true
    }

    const collection = props?.collections[node.relationTo]

    if (!collection?.fields?.length) {
      return true
    }

    const result = await fieldSchemasToFormState({
      id,
      collectionSlug: node.relationTo,
      data: node?.fields ?? {},
      documentData: data,
      fields: collection.fields,
      fieldSchemaMap: undefined,
      initialBlockData: node?.fields ?? {},
      operation: operation === 'create' || operation === 'update' ? operation : 'update',
      permissions: {},
      preferences,
      renderAllFields: false,
      req,
      schemaPath: '',
    })

    const errorPathsSet = new Set<string>()
    for (const fieldKey in result) {
      const fieldState = result[fieldKey]
      if (fieldState?.errorPaths?.length) {
        for (const errorPath of fieldState.errorPaths) {
          errorPathsSet.add(errorPath)
        }
      }
    }
    const errorPaths = Array.from(errorPathsSet)

    if (errorPaths.length) {
      return 'The following fields are invalid: ' + errorPaths.join(', ')
    }

    return true
  }
}
```

--------------------------------------------------------------------------------

---[FILE: conversions.ts]---
Location: payload-main/packages/richtext-lexical/src/features/upload/server/nodes/conversions.ts

```typescript
// This file contains functions used to convert dom elements to upload or pending upload lexical nodes. It requires the actual node
// creation functions to be passed in to stay compatible with both client and server code.
import type { DOMConversionOutput } from 'lexical'

import ObjectID from 'bson-objectid'

import type { $createUploadNode } from '../../client/nodes/UploadNode.js'
import type { $createUploadServerNode, Internal_UploadData } from './UploadNode.js'

export function isGoogleDocCheckboxImg(img: HTMLImageElement): boolean {
  return (
    img.parentElement != null &&
    img.parentElement.tagName === 'LI' &&
    img.previousSibling === null &&
    img.getAttribute('aria-roledescription') === 'checkbox'
  )
}

export function $convertUploadElement(
  domNode: HTMLImageElement,
  $createNode: typeof $createUploadNode | typeof $createUploadServerNode,
): DOMConversionOutput | null {
  if (domNode.hasAttribute('data-lexical-pending-upload-form-id')) {
    const formID = domNode.getAttribute('data-lexical-pending-upload-form-id')

    if (formID != null) {
      const node = $createNode({
        data: {
          pending: {
            formID,
            src: domNode.getAttribute('src') || '',
          },
        } as Internal_UploadData,
      })
      return { node }
    }
  }
  if (
    domNode.hasAttribute('data-lexical-upload-relation-to') &&
    domNode.hasAttribute('data-lexical-upload-id')
  ) {
    const id = domNode.getAttribute('data-lexical-upload-id')
    const relationTo = domNode.getAttribute('data-lexical-upload-relation-to')

    if (id != null && relationTo != null) {
      const node = $createNode({
        data: {
          fields: {},
          relationTo,
          value: id,
        },
      })
      return { node }
    }
  }

  // Create pending UploadNode. Auto-Upload functionality will then be handled by the node transform
  const node = $createNode({
    data: {
      pending: {
        formID: new ObjectID.default().toHexString(),
        src: domNode.getAttribute('src') || '',
      },
    } as Internal_UploadData,
  })

  return { node }
}
```

--------------------------------------------------------------------------------

---[FILE: UploadNode.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/upload/server/nodes/UploadNode.tsx
Signals: React

```typescript
import type { SerializedDecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode.js'
import type {
  DOMConversionMap,
  DOMExportOutput,
  EditorConfig,
  ElementFormatType,
  LexicalNode,
  NodeKey,
} from 'lexical'
import type {
  CollectionSlug,
  DataFromCollectionSlug,
  JsonObject,
  TypedUploadCollection,
  UploadCollectionSlug,
} from 'payload'
import type { JSX } from 'react'

import { DecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode.js'
import { addClassNamesToElement } from '@lexical/utils'
import ObjectID from 'bson-objectid'
import { $applyNodeReplacement } from 'lexical'

import type { StronglyTypedLeafNode } from '../../../../nodeTypes.js'

import { $convertUploadElement } from './conversions.js'

export type UploadData<TUploadExtraFieldsData extends JsonObject = JsonObject> = {
  [TCollectionSlug in CollectionSlug]: {
    fields: TUploadExtraFieldsData
    /**
     * Every lexical node that has sub-fields needs to have a unique ID. This is the ID of this upload node, not the ID of the linked upload document
     */
    id: string
    relationTo: TCollectionSlug
    /**
     * Value can be just the document ID, or the full, populated document
     */
    value: DataFromCollectionSlug<TCollectionSlug> | number | string
  }
}[CollectionSlug]

/**
 * Internal use only - UploadData type that can contain a pending state
 * @internal
 */
export type Internal_UploadData<TUploadExtraFieldsData extends JsonObject = JsonObject> = {
  pending?: {
    /**
     * ID that corresponds to the bulk upload form ID
     */
    formID: string
    /**
     * src value of the image dom element
     */
    src: string
  }
} & UploadData<TUploadExtraFieldsData>

/**
 * UploadDataImproved is a more precise type, and will replace UploadData in Payload v4.
 * This type is for internal use only as it will be deprecated in the future.
 * @internal
 *
 * @todo Replace UploadData with UploadDataImproved in 4.0
 */
export type UploadDataImproved<TUploadExtraFieldsData extends JsonObject = JsonObject> = {
  [TCollectionSlug in UploadCollectionSlug]: {
    fields: TUploadExtraFieldsData
    /**
     * Every lexical node that has sub-fields needs to have a unique ID. This is the ID of this upload node, not the ID of the linked upload document
     */
    id: string
    relationTo: TCollectionSlug
    /**
     * Value can be just the document ID, or the full, populated document
     */
    value: number | string | TypedUploadCollection[TCollectionSlug]
  }
}[UploadCollectionSlug]

export type SerializedUploadNode = StronglyTypedLeafNode<SerializedDecoratorBlockNode, 'upload'> &
  UploadData

export class UploadServerNode extends DecoratorBlockNode {
  __data: UploadData

  constructor({
    data,
    format,
    key,
  }: {
    data: UploadData
    format?: ElementFormatType
    key?: NodeKey
  }) {
    super(format, key)
    this.__data = data
  }

  static override clone(node: UploadServerNode): UploadServerNode {
    return new this({
      data: node.__data,
      format: node.__format,
      key: node.__key,
    })
  }

  static override getType(): string {
    return 'upload'
  }

  static override importDOM(): DOMConversionMap<HTMLImageElement> {
    return {
      img: (node) => ({
        conversion: (domNode) => $convertUploadElement(domNode, $createUploadServerNode),
        priority: 0,
      }),
    }
  }

  static override importJSON(serializedNode: SerializedUploadNode): UploadServerNode {
    if (serializedNode.version === 1 && (serializedNode?.value as unknown as { id: string })?.id) {
      serializedNode.value = (serializedNode.value as unknown as { id: string }).id
    }
    if (serializedNode.version === 2 && !serializedNode?.id) {
      serializedNode.id = new ObjectID.default().toHexString()
      serializedNode.version = 3
    }

    const importedData: Internal_UploadData = {
      id: serializedNode.id,
      fields: serializedNode.fields,
      pending: (serializedNode as Internal_UploadData).pending,
      relationTo: serializedNode.relationTo,
      value: serializedNode.value,
    }

    const node = $createUploadServerNode({ data: importedData })
    node.setFormat(serializedNode.format)

    return node
  }

  static isInline(): false {
    return false
  }

  override createDOM(config?: EditorConfig): HTMLElement {
    const element = document.createElement('div')
    addClassNamesToElement(element, config?.theme?.upload)
    return element
  }

  override decorate(): JSX.Element {
    return null as unknown as JSX.Element
  }

  override exportDOM(): DOMExportOutput {
    const element = document.createElement('img')
    const data = this.__data as Internal_UploadData
    if (data.pending) {
      element.setAttribute('data-lexical-pending-upload-form-id', String(data?.pending?.formID))
      element.setAttribute('src', data?.pending?.src || '')
    } else {
      element.setAttribute('data-lexical-upload-id', String(data?.value))
      element.setAttribute('data-lexical-upload-relation-to', data?.relationTo)
    }

    return { element }
  }

  override exportJSON(): SerializedUploadNode {
    return {
      ...super.exportJSON(),
      ...this.getData(),
      type: 'upload',
      version: 3,
    }
  }

  getData(): UploadData {
    return this.getLatest().__data
  }

  setData(data: UploadData): void {
    const writable = this.getWritable()
    writable.__data = data
  }

  override updateDOM(): false {
    return false
  }
}

export function $createUploadServerNode({
  data,
}: {
  data: Omit<UploadData, 'id'> & Partial<Pick<UploadData, 'id'>>
}): UploadServerNode {
  if (!data?.id) {
    data.id = new ObjectID.default().toHexString()
  }
  return $applyNodeReplacement(new UploadServerNode({ data: data as UploadData }))
}

export function $isUploadServerNode(
  node: LexicalNode | null | undefined,
): node is UploadServerNode {
  return node instanceof UploadServerNode
}
```

--------------------------------------------------------------------------------

````
