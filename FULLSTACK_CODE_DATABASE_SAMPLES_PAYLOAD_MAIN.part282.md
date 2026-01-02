---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 282
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 282 of 695)

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

---[FILE: i18n.ts]---
Location: payload-main/packages/richtext-lexical/src/features/link/server/i18n.ts

```typescript
import type { GenericLanguages } from '@payloadcms/translations'

export const i18n: Partial<GenericLanguages> = {
  ar: {
    label: 'رابط',
    loadingWithEllipsis: 'جار التحميل...',
  },
  az: {
    label: 'Keçid',
    loadingWithEllipsis: 'Yüklənir...',
  },
  bg: {
    label: 'Връзка',
    loadingWithEllipsis: 'Зарежда се...',
  },
  cs: {
    label: 'Odkaz',
    loadingWithEllipsis: 'Načítání...',
  },
  da: {
    label: 'Link',
    loadingWithEllipsis: 'Indlæser...',
  },
  de: {
    label: 'Verknüpfung',
    loadingWithEllipsis: 'Laden...',
  },
  en: {
    label: 'Link',
    loadingWithEllipsis: 'Loading...',
  },
  es: {
    label: 'Enlace',
    loadingWithEllipsis: 'Cargando...',
  },
  et: {
    label: 'Link',
    loadingWithEllipsis: 'Laadimine...',
  },
  fa: {
    label: 'پیوند',
    loadingWithEllipsis: 'در حال بارگذاری...',
  },
  fr: {
    label: 'Lien',
    loadingWithEllipsis: 'Chargement...',
  },
  he: {
    label: 'קישור',
    loadingWithEllipsis: 'טוען...',
  },
  hr: {
    label: 'Poveznica',
    loadingWithEllipsis: 'Učitavanje...',
  },
  hu: {
    label: 'Hivatkozás',
    loadingWithEllipsis: 'Betöltés...',
  },
  is: {
    label: 'Hlekkur',
    loadingWithEllipsis: 'Hleð...',
  },
  it: {
    label: 'Collegamento',
    loadingWithEllipsis: 'Caricamento...',
  },
  ja: {
    label: 'リンク',
    loadingWithEllipsis: '読み込み中...',
  },
  ko: {
    label: '링크',
    loadingWithEllipsis: '로딩 중...',
  },
  my: {
    label: 'လင့်',
    loadingWithEllipsis: 'ဖွင့်နေသည်...',
  },
  nb: {
    label: 'Lenke',
    loadingWithEllipsis: 'Laster...',
  },
  nl: {
    label: 'Link',
    loadingWithEllipsis: 'Laden...',
  },
  pl: {
    label: 'Łącze',
    loadingWithEllipsis: 'Ładowanie...',
  },
  pt: {
    label: 'Ligação',
    loadingWithEllipsis: 'Carregando...',
  },
  ro: {
    label: 'Legătură',
    loadingWithEllipsis: 'Se încarcă...',
  },
  rs: {
    label: 'Веза',
    loadingWithEllipsis: 'Учитавање...',
  },
  'rs-latin': {
    label: 'Veza',
    loadingWithEllipsis: 'Učitavanje...',
  },
  ru: {
    label: 'Ссылка',
    loadingWithEllipsis: 'Загрузка...',
  },
  sk: {
    label: 'Odkaz',
    loadingWithEllipsis: 'Načítava sa...',
  },
  sl: {
    label: 'Povezava',
    loadingWithEllipsis: 'Nalaganje...',
  },
  sv: {
    label: 'Länk',
    loadingWithEllipsis: 'Laddar...',
  },
  ta: {
    label: 'இணைப்பு',
    loadingWithEllipsis: 'போர்த்துவருகிறது...',
  },
  th: {
    label: 'ลิงค์',
    loadingWithEllipsis: 'กำลังโหลด...',
  },
  tr: {
    label: 'Bağlantı',
    loadingWithEllipsis: 'Yükleniyor...',
  },
  uk: {
    label: 'Посилання',
    loadingWithEllipsis: 'Завантаження...',
  },
  vi: {
    label: 'Liên kết',
    loadingWithEllipsis: 'Đang tải...',
  },
  zh: {
    label: '链接',
    loadingWithEllipsis: '加载中...',
  },
  'zh-TW': {
    label: '連結',
    loadingWithEllipsis: '載入中...',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/richtext-lexical/src/features/link/server/index.ts

```typescript
import type {
  CollectionSlug,
  Config,
  Field,
  FieldAffectingData,
  FieldSchemaMap,
  SanitizedConfig,
} from 'payload'

import escapeHTML from 'escape-html'
import { sanitizeFields } from 'payload'

import type { NodeWithHooks } from '../../typesServer.js'
import type { ClientProps } from '../client/index.js'

import { createServerFeature } from '../../../utilities/createServerFeature.js'
import { convertLexicalNodesToHTML } from '../../converters/lexicalToHtml_deprecated/converter/index.js'
import { createNode } from '../../typeUtilities.js'
import { LinkMarkdownTransformer } from '../markdownTransformer.js'
import { AutoLinkNode } from '../nodes/AutoLinkNode.js'
import { LinkNode } from '../nodes/LinkNode.js'
import { linkPopulationPromiseHOC } from './graphQLPopulationPromise.js'
import { i18n } from './i18n.js'
import { transformExtraFields } from './transformExtraFields.js'
import { linkValidation } from './validate.js'

export type ExclusiveLinkCollectionsProps =
  | {
      /**
       * The collections that should be disabled for internal linking. Overrides the `enableRichTextLink` property in the collection config.
       * When this property is set, `enabledCollections` will not be available.
       **/
      disabledCollections?: CollectionSlug[]

      // Ensures that enabledCollections is not available when disabledCollections is set
      enabledCollections?: never
    }
  | {
      // Ensures that disabledCollections is not available when enabledCollections is set
      disabledCollections?: never

      /**
       * The collections that should be enabled for internal linking. Overrides the `enableRichTextLink` property in the collection config
       * When this property is set, `disabledCollections` will not be available.
       **/
      enabledCollections?: CollectionSlug[]
    }

export type LinkFeatureServerProps = {
  /**
   * Disables the automatic creation of links from URLs pasted into the editor, as well
   * as auto link nodes.
   *
   * If set to 'creationOnly', only the creation of new auto link nodes will be disabled.
   * Existing auto link nodes will still be editable.
   *
   * @default false
   */
  disableAutoLinks?: 'creationOnly' | true
  /**
   * A function or array defining additional fields for the link feature. These will be
   * displayed in the link editor drawer.
   */
  fields?:
    | ((args: {
        config: SanitizedConfig
        defaultFields: FieldAffectingData[]
      }) => (Field | FieldAffectingData)[])
    | Field[]
  /**
   * Sets a maximum population depth for the internal doc default field of link, regardless of the remaining depth when the field is reached.
   * This behaves exactly like the maxDepth properties of relationship and upload fields.
   *
   * {@link https://payloadcms.com/docs/getting-started/concepts#field-level-max-depth}
   */
  maxDepth?: number
} & ExclusiveLinkCollectionsProps

export const LinkFeature = createServerFeature<
  LinkFeatureServerProps,
  LinkFeatureServerProps,
  ClientProps
>({
  feature: async ({ config: _config, isRoot, parentIsLocalized, props }) => {
    if (!props) {
      props = {}
    }
    const validRelationships = _config.collections.map((c) => c.slug) || []

    const _transformedFields = transformExtraFields(
      props.fields ? props.fields : null,
      _config,
      props.enabledCollections,
      props.disabledCollections,
      props.maxDepth,
    )

    const sanitizedFields = await sanitizeFields({
      config: _config as unknown as Config,
      fields: _transformedFields,
      parentIsLocalized,
      requireFieldLevelRichTextEditor: isRoot,
      validRelationships,
    })
    props.fields = sanitizedFields

    // the text field is not included in the node data.
    // Thus, for tasks like validation, we do not want to pass it a text field in the schema which will never have data.
    // Otherwise, it will cause a validation error (field is required).
    const sanitizedFieldsWithoutText = sanitizedFields.filter(
      (field) => !('name' in field) || field.name !== 'text',
    )

    let linkTypeField: Field | null = null
    let linkURLField: Field | null = null

    for (const field of sanitizedFields) {
      if ('name' in field && field.name === 'linkType') {
        linkTypeField = field
      }

      if ('name' in field && field.name === 'url') {
        linkURLField = field
      }
    }

    const defaultLinkType = linkTypeField
      ? 'defaultValue' in linkTypeField && typeof linkTypeField.defaultValue === 'string'
        ? linkTypeField.defaultValue
        : 'custom'
      : undefined

    const defaultLinkURL = linkURLField
      ? 'defaultValue' in linkURLField && typeof linkURLField.defaultValue === 'string'
        ? linkURLField.defaultValue
        : 'https://'
      : undefined

    return {
      ClientFeature: '@payloadcms/richtext-lexical/client#LinkFeatureClient',
      clientFeatureProps: {
        defaultLinkType,
        defaultLinkURL,
        disableAutoLinks: props.disableAutoLinks,
        disabledCollections: props.disabledCollections,
        enabledCollections: props.enabledCollections,
      } as ClientProps,
      generateSchemaMap: () => {
        if (!sanitizedFields || !Array.isArray(sanitizedFields) || sanitizedFields.length === 0) {
          return null
        }

        const schemaMap: FieldSchemaMap = new Map()
        schemaMap.set('fields', {
          fields: sanitizedFields,
        })

        return schemaMap
      },
      i18n,
      markdownTransformers: [LinkMarkdownTransformer],
      nodes: [
        props?.disableAutoLinks === true
          ? null
          : createNode({
              converters: {
                html: {
                  converter: async ({
                    converters,
                    currentDepth,
                    depth,
                    draft,
                    node,
                    overrideAccess,
                    parent,
                    req,
                    showHiddenFields,
                  }) => {
                    const childrenText = await convertLexicalNodesToHTML({
                      converters,
                      currentDepth,
                      depth,
                      draft,
                      lexicalNodes: node.children,
                      overrideAccess,
                      parent: {
                        ...node,
                        parent,
                      },
                      req,
                      showHiddenFields,
                    })

                    let href: string = node.fields.url ?? ''
                    if (node.fields.linkType === 'internal') {
                      href =
                        typeof node.fields.doc?.value !== 'object'
                          ? String(node.fields.doc?.value)
                          : String(node.fields.doc?.value?.id)
                    }

                    return `<a href="${href}"${node.fields.newTab ? ' rel="noopener noreferrer" target="_blank"' : ''}>${childrenText}</a>`
                  },
                  nodeTypes: [AutoLinkNode.getType()],
                },
              },
              node: AutoLinkNode,
              // Since AutoLinkNodes are just internal links, they need no hooks or graphQL population promises
              validations: [linkValidation(props, sanitizedFieldsWithoutText)],
            }),
        createNode({
          converters: {
            html: {
              converter: async ({
                converters,
                currentDepth,
                depth,
                draft,
                node,
                overrideAccess,
                parent,
                req,
                showHiddenFields,
              }) => {
                const childrenText = await convertLexicalNodesToHTML({
                  converters,
                  currentDepth,
                  depth,
                  draft,
                  lexicalNodes: node.children,
                  overrideAccess,
                  parent: {
                    ...node,
                    parent,
                  },
                  req,
                  showHiddenFields,
                })

                const href: string =
                  node.fields.linkType === 'custom'
                    ? escapeHTML(node.fields.url)
                    : (node.fields.doc?.value as string)

                return `<a href="${href}"${node.fields.newTab ? ' rel="noopener noreferrer" target="_blank"' : ''}>${childrenText}</a>`
              },
              nodeTypes: [LinkNode.getType()],
            },
          },
          getSubFields: () => {
            return sanitizedFieldsWithoutText
          },
          getSubFieldsData: ({ node }) => {
            return node?.fields
          },
          graphQLPopulationPromises: [linkPopulationPromiseHOC(props)],
          node: LinkNode,
          validations: [linkValidation(props, sanitizedFieldsWithoutText)],
        }),
      ].filter(Boolean) as Array<NodeWithHooks>,
      sanitizedServerFeatureProps: props,
    }
  },
  key: 'link',
})
```

--------------------------------------------------------------------------------

---[FILE: transformExtraFields.ts]---
Location: payload-main/packages/richtext-lexical/src/features/link/server/transformExtraFields.ts

```typescript
import type { CollectionSlug, Field, FieldAffectingData, SanitizedConfig } from 'payload'

import { getBaseFields } from './baseFields.js'

/**
 * This function is run to enrich the basefields which every link has with potential, custom user-added fields.
 */
export function transformExtraFields(
  customFieldSchema:
    | ((args: {
        config: SanitizedConfig
        defaultFields: FieldAffectingData[]
      }) => (Field | FieldAffectingData)[])
    | Field[]
    | null,
  config: SanitizedConfig,
  enabledCollections?: CollectionSlug[],
  disabledCollections?: CollectionSlug[],
  maxDepth?: number,
): Field[] {
  const baseFields: FieldAffectingData[] = getBaseFields(
    config,
    enabledCollections,
    disabledCollections,
    maxDepth,
  )

  let fields: (Field | FieldAffectingData)[]

  if (typeof customFieldSchema === 'function') {
    fields = customFieldSchema({ config, defaultFields: baseFields })
  } else if (Array.isArray(customFieldSchema)) {
    fields = customFieldSchema
  } else {
    fields = baseFields
  }

  return fields as Field[]
}
```

--------------------------------------------------------------------------------

---[FILE: validate.ts]---
Location: payload-main/packages/richtext-lexical/src/features/link/server/validate.ts

```typescript
import type { Field } from 'payload'

import { fieldSchemasToFormState } from '@payloadcms/ui/forms/fieldSchemasToFormState'

import type { NodeValidation } from '../../typesServer.js'
import type { SerializedAutoLinkNode, SerializedLinkNode } from '../nodes/types.js'
import type { LinkFeatureServerProps } from './index.js'

export const linkValidation = (
  props: LinkFeatureServerProps,
  sanitizedFieldsWithoutText: Field[],
): NodeValidation<SerializedAutoLinkNode | SerializedLinkNode> => {
  return async ({
    node,
    validation: {
      options: { id, collectionSlug, data, operation, preferences, req },
    },
  }) => {
    /**
     * Run fieldSchemasToFormState as that properly validates link fields and link sub-fields
     */

    const result = await fieldSchemasToFormState({
      id,
      collectionSlug,
      data: node.fields,
      documentData: data,
      fields: sanitizedFieldsWithoutText, // Sanitized in feature.server.ts
      fieldSchemaMap: undefined,
      initialBlockData: node.fields,
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

---[FILE: htmlConverter.ts]---
Location: payload-main/packages/richtext-lexical/src/features/lists/htmlConverter.ts

```typescript
import { ListItemNode, ListNode } from '@lexical/list'
import { v4 as uuidv4 } from 'uuid'

import type { HTMLConverter } from '../converters/lexicalToHtml_deprecated/converter/types.js'
import type { SerializedListItemNode, SerializedListNode } from './plugin/index.js'

import { convertLexicalNodesToHTML } from '../converters/lexicalToHtml_deprecated/converter/index.js'

export const ListHTMLConverter: HTMLConverter<SerializedListNode> = {
  converter: async ({
    converters,
    currentDepth,
    depth,
    draft,
    node,
    overrideAccess,
    parent,
    req,
    showHiddenFields,
  }) => {
    const childrenText = await convertLexicalNodesToHTML({
      converters,
      currentDepth,
      depth,
      draft,
      lexicalNodes: node.children,
      overrideAccess,
      parent: {
        ...node,
        parent,
      },
      req,
      showHiddenFields,
    })

    return `<${node?.tag} class="list-${node?.listType}">${childrenText}</${node?.tag}>`
  },
  nodeTypes: [ListNode.getType()],
}

export const ListItemHTMLConverter: HTMLConverter<SerializedListItemNode> = {
  converter: async ({
    converters,
    currentDepth,
    depth,
    draft,
    node,
    overrideAccess,
    parent,
    req,
    showHiddenFields,
  }) => {
    const hasSubLists = node.children.some((child) => child.type === 'list')

    const childrenText = await convertLexicalNodesToHTML({
      converters,
      currentDepth,
      depth,
      draft,
      lexicalNodes: node.children,
      overrideAccess,
      parent: {
        ...node,
        parent,
      },
      req,
      showHiddenFields,
    })

    if ('listType' in parent && parent?.listType === 'check') {
      const uuid = uuidv4()

      return `<li aria-checked=${node.checked ? 'true' : 'false'} class="${
        'list-item-checkbox' +
        (node.checked ? ' list-item-checkbox-checked' : ' list-item-checkbox-unchecked') +
        (hasSubLists ? ' nestedListItem' : '')
      }"
          role="checkbox"
          tabIndex=${-1}
          value=${node?.value}
      >
      ${
        hasSubLists
          ? childrenText
          : `
        <input type="checkbox" id="${uuid}"${node.checked ? ' checked' : ''}>
        <label for="${uuid}">${childrenText}</label><br>
      `
      }


          </li>`
    } else {
      return `<li ${hasSubLists ? `class="nestedListItem" ` : ''}value=${node?.value}>${childrenText}</li>`
    }
  },
  nodeTypes: [ListItemNode.getType()],
}
```

--------------------------------------------------------------------------------

---[FILE: markdownTransformers.ts]---
Location: payload-main/packages/richtext-lexical/src/features/lists/checklist/markdownTransformers.ts

```typescript
import { $isListNode, ListItemNode, ListNode } from '@lexical/list'

import type { ElementTransformer } from '../../../packages/@lexical/markdown/MarkdownTransformers.js'

import { listExport, listReplace } from '../shared/markdown.js'

export const CHECK_LIST: ElementTransformer = {
  type: 'element',
  dependencies: [ListNode, ListItemNode],
  export: (node, exportChildren) => {
    return $isListNode(node) ? listExport(node, exportChildren, 0) : null
  },
  regExp: /^(\s*)(?:-\s)?\s?(\[(\s|x)?\])\s/i,
  replace: listReplace('check'),
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/lists/checklist/client/index.tsx

```typescript
'use client'
import { $isListNode, INSERT_CHECK_LIST_COMMAND, ListItemNode, ListNode } from '@lexical/list'
import { $isRangeSelection } from 'lexical'

import type { ToolbarGroup } from '../../../toolbars/types.js'
import type { ClientFeature } from '../../../typesClient.js'

import { ChecklistIcon } from '../../../../lexical/ui/icons/Checklist/index.js'
import { createClientFeature } from '../../../../utilities/createClientFeature.js'
import { toolbarTextDropdownGroupWithItems } from '../../../shared/toolbar/textDropdownGroup.js'
import { LexicalListPlugin } from '../../plugin/index.js'
import { shouldRegisterListBaseNodes } from '../../shared/shouldRegisterListBaseNodes.js'
import { slashMenuListGroupWithItems } from '../../shared/slashMenuListGroup.js'
import { CHECK_LIST } from '../markdownTransformers.js'
import { LexicalCheckListPlugin } from './plugin/index.js'

const toolbarGroups: ToolbarGroup[] = [
  toolbarTextDropdownGroupWithItems([
    {
      ChildComponent: ChecklistIcon,
      isActive: ({ selection }) => {
        if (!$isRangeSelection(selection)) {
          return false
        }
        for (const node of selection.getNodes()) {
          if ($isListNode(node) && node.getListType() === 'check') {
            continue
          }

          const parent = node.getParent()

          if ($isListNode(parent) && parent.getListType() === 'check') {
            continue
          }

          const parentParent = parent?.getParent()
          // Example scenario: Node = textNode, parent = listItemNode, parentParent = listNode
          if ($isListNode(parentParent) && parentParent.getListType() === 'check') {
            continue
          }

          return false
        }
        return true
      },
      key: 'checklist',
      label: ({ i18n }) => {
        return i18n.t('lexical:checklist:label')
      },
      onSelect: ({ editor }) => {
        editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined)
      },
      order: 12,
    },
  ]),
]

export const ChecklistFeatureClient = createClientFeature(({ featureProviderMap }) => {
  const plugins: ClientFeature<undefined>['plugins'] = [
    {
      Component: LexicalCheckListPlugin,
      position: 'normal',
    },
  ]

  const shouldRegister = shouldRegisterListBaseNodes('checklist', featureProviderMap)
  if (shouldRegister) {
    plugins.push({
      Component: LexicalListPlugin,
      position: 'normal',
    })
  }

  return {
    markdownTransformers: [CHECK_LIST],
    nodes: shouldRegister ? [ListNode, ListItemNode] : [],
    plugins,
    slashMenu: {
      groups: [
        slashMenuListGroupWithItems([
          {
            Icon: ChecklistIcon,
            key: 'checklist',
            keywords: ['check list', 'check', 'checklist', 'cl'],
            label: ({ i18n }) => {
              return i18n.t('lexical:checklist:label')
            },
            onSelect: ({ editor }) => {
              editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined)
            },
          },
        ]),
      ],
    },
    toolbarFixed: {
      groups: toolbarGroups,
    },
    toolbarInline: {
      groups: toolbarGroups,
    },
  }
})
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/lists/checklist/client/plugin/index.tsx
Signals: React

```typescript
'use client'
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin.js'
import React from 'react'

import type { PluginComponent } from '../../../../typesClient.js'

export const LexicalCheckListPlugin: PluginComponent<undefined> = () => {
  return <CheckListPlugin />
}
```

--------------------------------------------------------------------------------

---[FILE: i18n.ts]---
Location: payload-main/packages/richtext-lexical/src/features/lists/checklist/server/i18n.ts

```typescript
import type { GenericLanguages } from '@payloadcms/translations'

export const i18n: Partial<GenericLanguages> = {
  ar: {
    label: 'قائمة التحقق',
  },
  az: {
    label: 'Yoxlama Siyahısı',
  },
  bg: {
    label: 'Списък за проверка',
  },
  cs: {
    label: 'Seznam kontrol',
  },
  da: {
    label: 'Tjekliste',
  },
  de: {
    label: 'Checkliste',
  },
  en: {
    label: 'Check List',
  },
  es: {
    label: 'Lista de comprobación',
  },
  et: {
    label: '',
  },
  fa: {
    label: 'لیست بررسی',
  },
  fr: {
    label: 'Liste de contrôle',
  },
  he: {
    label: 'רשימת בדיקה',
  },
  hr: {
    label: 'Kontrolni popis',
  },
  hu: {
    label: 'Ellenőrzőlista',
  },
  is: {
    label: 'Gátlisti',
  },
  it: {
    label: 'Lista di controllo',
  },
  ja: {
    label: 'チェックリスト',
  },
  ko: {
    label: '체크 리스트',
  },
  my: {
    label: 'Senarai Semak',
  },
  nb: {
    label: 'Sjekkliste',
  },
  nl: {
    label: 'Checklist',
  },
  pl: {
    label: 'Lista kontrolna',
  },
  pt: {
    label: 'Lista de Verificação',
  },
  ro: {
    label: 'Listă de verificare',
  },
  rs: {
    label: 'Контролна листа',
  },
  'rs-latin': {
    label: 'Kontrolna lista',
  },
  ru: {
    label: 'Список Проверки',
  },
  sk: {
    label: 'Kontrolný zoznam',
  },
  sl: {
    label: 'Nimekiri',
  },
  sv: {
    label: 'Kontrollista',
  },
  ta: {
    label: 'சரிபார்ப்பு பட்டியல்',
  },
  th: {
    label: 'รายการตรวจสอบ',
  },
  tr: {
    label: 'Kontrol Listesi',
  },
  uk: {
    label: 'Список перевірки',
  },
  vi: {
    label: 'Danh sách kiểm tra',
  },
  zh: {
    label: '检查清单',
  },
  'zh-TW': {
    label: '檢查清單',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/richtext-lexical/src/features/lists/checklist/server/index.ts

```typescript
import { ListItemNode, ListNode } from '@lexical/list'

import { createServerFeature } from '../../../../utilities/createServerFeature.js'
import { createNode } from '../../../typeUtilities.js'
import { ListHTMLConverter, ListItemHTMLConverter } from '../../htmlConverter.js'
import { shouldRegisterListBaseNodes } from '../../shared/shouldRegisterListBaseNodes.js'
import { CHECK_LIST } from '../markdownTransformers.js'
import { i18n } from './i18n.js'

export const ChecklistFeature = createServerFeature({
  feature: ({ featureProviderMap }) => {
    return {
      ClientFeature: '@payloadcms/richtext-lexical/client#ChecklistFeatureClient',
      i18n,
      markdownTransformers: [CHECK_LIST],
      nodes: shouldRegisterListBaseNodes('checklist', featureProviderMap)
        ? [
            createNode({
              converters: {
                html: ListHTMLConverter as any, // ListHTMLConverter uses a different generic type than ListNode[exportJSON], thus we need to cast as any
              },
              node: ListNode,
            }),
            createNode({
              converters: {
                html: ListItemHTMLConverter as any,
              },
              node: ListItemNode,
            }),
          ]
        : [],
    }
  },
  key: 'checklist',
})
```

--------------------------------------------------------------------------------

---[FILE: markdownTransformer.ts]---
Location: payload-main/packages/richtext-lexical/src/features/lists/orderedList/markdownTransformer.ts

```typescript
import { $isListNode, ListItemNode, ListNode } from '@lexical/list'

import type { ElementTransformer } from '../../../packages/@lexical/markdown/MarkdownTransformers.js'

import { listExport, listReplace } from '../shared/markdown.js'

export const ORDERED_LIST: ElementTransformer = {
  type: 'element',
  dependencies: [ListNode, ListItemNode],
  export: (node, exportChildren) => {
    return $isListNode(node) ? listExport(node, exportChildren, 0) : null
  },
  regExp: /^(\s*)(\d+)\.\s/,
  replace: listReplace('number'),
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/lists/orderedList/client/index.tsx

```typescript
'use client'
import { $isListNode, INSERT_ORDERED_LIST_COMMAND, ListItemNode, ListNode } from '@lexical/list'
import { $isRangeSelection } from 'lexical'

import type { ToolbarGroup } from '../../../toolbars/types.js'

import { OrderedListIcon } from '../../../../lexical/ui/icons/OrderedList/index.js'
import { createClientFeature } from '../../../../utilities/createClientFeature.js'
import { toolbarTextDropdownGroupWithItems } from '../../../shared/toolbar/textDropdownGroup.js'
import { LexicalListPlugin } from '../../plugin/index.js'
import { shouldRegisterListBaseNodes } from '../../shared/shouldRegisterListBaseNodes.js'
import { slashMenuListGroupWithItems } from '../../shared/slashMenuListGroup.js'
import { ORDERED_LIST } from '../markdownTransformer.js'

const toolbarGroups: ToolbarGroup[] = [
  toolbarTextDropdownGroupWithItems([
    {
      ChildComponent: OrderedListIcon,
      isActive: ({ selection }) => {
        if (!$isRangeSelection(selection)) {
          return false
        }
        for (const node of selection.getNodes()) {
          if ($isListNode(node) && node.getListType() === 'number') {
            continue
          }

          const parent = node.getParent()

          if ($isListNode(parent) && parent.getListType() === 'number') {
            continue
          }

          const parentParent = parent?.getParent()
          // Example scenario: Node = textNode, parent = listItemNode, parentParent = listNode
          if ($isListNode(parentParent) && parentParent.getListType() === 'number') {
            continue
          }

          return false
        }
        return true
      },
      key: 'orderedList',
      label: ({ i18n }) => {
        return i18n.t('lexical:orderedList:label')
      },
      onSelect: ({ editor }) => {
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
      },
      order: 10,
    },
  ]),
]

export const OrderedListFeatureClient = createClientFeature(({ featureProviderMap }) => {
  const shouldRegister = shouldRegisterListBaseNodes('ordered', featureProviderMap)
  return {
    markdownTransformers: [ORDERED_LIST],
    nodes: shouldRegister ? [ListNode, ListItemNode] : [],
    plugins: shouldRegister
      ? [
          {
            Component: LexicalListPlugin,
            position: 'normal',
          },
        ]
      : [],
    slashMenu: {
      groups: [
        slashMenuListGroupWithItems([
          {
            Icon: OrderedListIcon,
            key: 'orderedList',
            keywords: ['ordered list', 'ol'],
            label: ({ i18n }) => {
              return i18n.t('lexical:orderedList:label')
            },
            onSelect: ({ editor }) => {
              editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
            },
          },
        ]),
      ],
    },
    toolbarFixed: {
      groups: toolbarGroups,
    },
    toolbarInline: {
      groups: toolbarGroups,
    },
  }
})
```

--------------------------------------------------------------------------------

---[FILE: i18n.ts]---
Location: payload-main/packages/richtext-lexical/src/features/lists/orderedList/server/i18n.ts

```typescript
import type { GenericLanguages } from '@payloadcms/translations'

export const i18n: Partial<GenericLanguages> = {
  ar: {
    label: 'قائمة مرتبة',
  },
  az: {
    label: 'Sıralı Siyahı',
  },
  bg: {
    label: 'Подреден списък',
  },
  cs: {
    label: 'Seřazený seznam',
  },
  da: {
    label: 'Ordnet Liste',
  },
  de: {
    label: 'Geordnete Liste',
  },
  en: {
    label: 'Ordered List',
  },
  es: {
    label: 'Lista ordenada',
  },
  et: {
    label: 'Sorteeritud loend',
  },
  fa: {
    label: 'لیست مرتب شده',
  },
  fr: {
    label: 'Liste ordonnée',
  },
  he: {
    label: 'רשימה ממוינת',
  },
  hr: {
    label: 'Naručeni popis',
  },
  hu: {
    label: 'Rendelt lista',
  },
  is: {
    label: 'Raðaður listi',
  },
  it: {
    label: 'Elenco ordinato',
  },
  ja: {
    label: '順序付きリスト',
  },
  ko: {
    label: '주문된 목록',
  },
  my: {
    label: 'စီစဉ်ထားသော စာရင်း',
  },
  nb: {
    label: 'Ordnet Liste',
  },
  nl: {
    label: 'Geordende Lijst',
  },
  pl: {
    label: 'Uporządkowana lista',
  },
  pt: {
    label: 'Lista Ordenada',
  },
  ro: {
    label: 'Lista ordonată',
  },
  rs: {
    label: 'Уређена листа',
  },
  'rs-latin': {
    label: 'Uređena lista',
  },
  ru: {
    label: 'Упорядоченный список',
  },
  sk: {
    label: 'Zoradený zoznam',
  },
  sl: {
    label: 'Urejen seznam',
  },
  sv: {
    label: 'Ordnad Lista',
  },
  ta: {
    label: 'வரிசைப்படுத்தப்பட்ட பட்டியல்',
  },
  th: {
    label: 'รายการที่ถูกจัดลำดับ',
  },
  tr: {
    label: 'Sıralı Liste',
  },
  uk: {
    label: 'Впорядкований список',
  },
  vi: {
    label: 'Danh sách đã sắp xếp',
  },
  zh: {
    label: '有序列表',
  },
  'zh-TW': {
    label: '有序列表',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/richtext-lexical/src/features/lists/orderedList/server/index.ts

```typescript
import { ListItemNode, ListNode } from '@lexical/list'

import { createServerFeature } from '../../../../utilities/createServerFeature.js'
import { createNode } from '../../../typeUtilities.js'
import { ListHTMLConverter, ListItemHTMLConverter } from '../../htmlConverter.js'
import { shouldRegisterListBaseNodes } from '../../shared/shouldRegisterListBaseNodes.js'
import { ORDERED_LIST } from '../markdownTransformer.js'
import { i18n } from './i18n.js'

export const OrderedListFeature = createServerFeature({
  feature: ({ featureProviderMap }) => {
    return {
      ClientFeature: '@payloadcms/richtext-lexical/client#OrderedListFeatureClient',
      i18n,
      markdownTransformers: [ORDERED_LIST],
      nodes: shouldRegisterListBaseNodes('ordered', featureProviderMap)
        ? [
            createNode({
              converters: {
                html: ListHTMLConverter as any, // ListHTMLConverter uses a different generic type than ListNode[exportJSON], thus we need to cast as any
              },
              node: ListNode,
            }),
            createNode({
              converters: {
                html: ListItemHTMLConverter as any,
              },
              node: ListItemNode,
            }),
          ]
        : [],
    }
  },
  key: 'orderedList',
})
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/lists/plugin/index.tsx
Signals: React

```typescript
'use client'
import type {
  SerializedListItemNode as _SerializedListItemNode,
  SerializedListNode as _SerializedListNode,
} from '@lexical/list'
import type { SerializedLexicalNode } from 'lexical'

import { ListPlugin } from '@lexical/react/LexicalListPlugin.js'
import React from 'react'

import type { StronglyTypedElementNode } from '../../../nodeTypes.js'
import type { PluginComponent } from '../../typesClient.js'

export type SerializedListItemNode<T extends SerializedLexicalNode = SerializedLexicalNode> = {
  checked?: boolean
} & StronglyTypedElementNode<_SerializedListItemNode, 'listitem', T>

export type SerializedListNode<T extends SerializedLexicalNode = SerializedLexicalNode> = {
  checked?: boolean
} & StronglyTypedElementNode<_SerializedListNode, 'list', T>

export const LexicalListPlugin: PluginComponent<undefined> = () => {
  return <ListPlugin />
}
```

--------------------------------------------------------------------------------

---[FILE: markdown.ts]---
Location: payload-main/packages/richtext-lexical/src/features/lists/shared/markdown.ts

```typescript
// Copied from https://github.com/facebook/lexical/blob/176b8cf16ecb332ee5efe2c75219e223b7b019f2/packages/lexical-markdown/src/MarkdownTransformers.ts#L97C1-L172C1

import type { ListNode, ListType } from '@lexical/list'
import type { ElementNode } from 'lexical'

import { $createListItemNode, $createListNode, $isListItemNode, $isListNode } from '@lexical/list'

import type { ElementTransformer } from '../../../packages/@lexical/markdown/MarkdownTransformers.js'

// Amount of spaces that define indentation level
const LIST_INDENT_SIZE = 4

export const listReplace = (listType: ListType): ElementTransformer['replace'] => {
  return (parentNode, children, match) => {
    const previousNode = parentNode.getPreviousSibling()
    const nextNode = parentNode.getNextSibling()
    const listItem = $createListItemNode(listType === 'check' ? match[3] === 'x' : undefined)
    if ($isListNode(nextNode) && nextNode.getListType() === listType) {
      const firstChild = nextNode.getFirstChild()
      if (firstChild !== null) {
        firstChild.insertBefore(listItem)
      } else {
        // should never happen, but let's handle gracefully, just in case.
        nextNode.append(listItem)
      }
      parentNode.remove()
    } else if ($isListNode(previousNode) && previousNode.getListType() === listType) {
      previousNode.append(listItem)
      parentNode.remove()
    } else {
      const list = $createListNode(listType, listType === 'number' ? Number(match[2]) : undefined)
      list.append(listItem)
      parentNode.replace(list)
    }
    listItem.append(...children)
    listItem.select(0, 0)
    const indent = Math.floor(match[1]!.length / LIST_INDENT_SIZE)
    if (indent) {
      listItem.setIndent(indent)
    }
  }
}

export const listExport = (
  listNode: ListNode,
  exportChildren: (node: ElementNode) => string,
  depth: number,
): string => {
  const output: string[] = []
  const children = listNode.getChildren()
  let index = 0
  for (const listItemNode of children) {
    if ($isListItemNode(listItemNode)) {
      if (listItemNode.getChildrenSize() === 1) {
        const firstChild = listItemNode.getFirstChild()
        if ($isListNode(firstChild)) {
          output.push(listExport(firstChild, exportChildren, depth + 1))
          continue
        }
      }
      const indent = ' '.repeat(depth * LIST_INDENT_SIZE)
      const listType = listNode.getListType()
      const prefix =
        listType === 'number'
          ? `${listNode.getStart() + index}. `
          : listType === 'check'
            ? `- [${listItemNode.getChecked() ? 'x' : ' '}] `
            : '- '
      output.push(indent + prefix + exportChildren(listItemNode))
      index++
    }
  }

  return output.join('\n')
}
```

--------------------------------------------------------------------------------

---[FILE: shouldRegisterListBaseNodes.ts]---
Location: payload-main/packages/richtext-lexical/src/features/lists/shared/shouldRegisterListBaseNodes.ts

```typescript
// Priority order: unordered > ordered > checklist.
// That's why we don't include unordered among the parameter options. It registers by default.
export function shouldRegisterListBaseNodes(
  type: 'checklist' | 'ordered',
  featureProviderMap: Map<string, unknown>,
) {
  if (type === 'ordered') {
    // OrderedList only registers if UnorderedList is NOT present
    return !featureProviderMap.has('unorderedList')
  }

  if (type === 'checklist') {
    // Checklist only registers if neither UnorderedList nor OrderedList are present
    return !featureProviderMap.has('unorderedList') && !featureProviderMap.has('orderedList')
  }

  return false
}
```

--------------------------------------------------------------------------------

---[FILE: slashMenuListGroup.ts]---
Location: payload-main/packages/richtext-lexical/src/features/lists/shared/slashMenuListGroup.ts

```typescript
import type {
  SlashMenuGroup,
  SlashMenuItem,
} from '../../../lexical/plugins/SlashMenu/LexicalTypeaheadMenuPlugin/types.js'

export function slashMenuListGroupWithItems(items: SlashMenuItem[]): SlashMenuGroup {
  return {
    items,
    key: 'lists',
    label: ({ i18n }) => {
      return i18n.t('lexical:general:slashMenuListGroupLabel')
    },
  }
}
```

--------------------------------------------------------------------------------

---[FILE: markdownTransformer.ts]---
Location: payload-main/packages/richtext-lexical/src/features/lists/unorderedList/markdownTransformer.ts

```typescript
import { $isListNode, ListItemNode, ListNode } from '@lexical/list'

import type { ElementTransformer } from '../../../packages/@lexical/markdown/MarkdownTransformers.js'

import { listExport, listReplace } from '../shared/markdown.js'

export const UNORDERED_LIST: ElementTransformer = {
  type: 'element',
  dependencies: [ListNode, ListItemNode],
  export: (node, exportChildren) => {
    return $isListNode(node) ? listExport(node, exportChildren, 0) : null
  },
  regExp: /^(\s*)[-*+]\s/,
  replace: listReplace('bullet'),
}
```

--------------------------------------------------------------------------------

````
