---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 285
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 285 of 695)

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
Location: payload-main/packages/richtext-lexical/src/features/relationship/server/i18n.ts

```typescript
import type { GenericLanguages } from '@payloadcms/translations'

export const i18n: Partial<GenericLanguages> = {
  ar: {
    label: 'العلاقة',
  },
  az: {
    label: 'Münasibət',
  },
  bg: {
    label: 'Връзка',
  },
  cs: {
    label: 'Vztah',
  },
  da: {
    label: 'Forhold',
  },
  de: {
    label: 'Beziehung',
  },
  en: {
    label: 'Relationship',
  },
  es: {
    label: 'Relación',
  },
  et: {
    label: 'Seos',
  },
  fa: {
    label: 'روابط',
  },
  fr: {
    label: 'Relation',
  },
  he: {
    label: 'יחסים',
  },
  hr: {
    label: 'Odnos',
  },
  hu: {
    label: 'Kapcsolat',
  },
  is: {
    label: 'Tengingar',
  },
  it: {
    label: 'Relazione',
  },
  ja: {
    label: '関係性',
  },
  ko: {
    label: '관계',
  },
  my: {
    label: 'Hubungan',
  },
  nb: {
    label: 'Forhold',
  },
  nl: {
    label: 'Relatie',
  },
  pl: {
    label: 'Relacja',
  },
  pt: {
    label: 'Relacionamento',
  },
  ro: {
    label: 'Relație',
  },
  rs: {
    label: 'Релација',
  },
  'rs-latin': {
    label: 'Relacija',
  },
  ru: {
    label: 'Отношения',
  },
  sk: {
    label: 'Vzťah',
  },
  sl: {
    label: 'Odnos',
  },
  sv: {
    label: 'Relation',
  },
  ta: {
    label: 'உறவு',
  },
  th: {
    label: 'ความสัมพันธ์',
  },
  tr: {
    label: 'İlişki',
  },
  uk: {
    label: 'Стосунки',
  },
  vi: {
    label: 'Mối quan hệ',
  },
  zh: {
    label: '关系',
  },
  'zh-TW': {
    label: '關係',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/richtext-lexical/src/features/relationship/server/index.ts

```typescript
import type { CollectionSlug } from 'payload'

import { populate } from '../../../populateGraphQL/populate.js'
import { createServerFeature } from '../../../utilities/createServerFeature.js'
import { createNode } from '../../typeUtilities.js'
import { relationshipPopulationPromiseHOC } from './graphQLPopulationPromise.js'
import { i18n } from './i18n.js'
import { RelationshipServerNode } from './nodes/RelationshipNode.js'

export type ExclusiveRelationshipFeatureProps =
  | {
      /**
       * The collections that should be disabled. Overrides the `enableRichTextRelationship` property in the collection config.
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
       * The collections that should be enabled. Overrides the `enableRichTextRelationship` property in the collection config
       * When this property is set, `disabledCollections` will not be available.
       **/
      enabledCollections?: CollectionSlug[]
    }

export type RelationshipFeatureProps = {
  /**
   * Sets a maximum population depth for this relationship, regardless of the remaining depth when the respective field is reached.
   * This behaves exactly like the maxDepth properties of relationship and upload fields.
   *
   * {@link https://payloadcms.com/docs/getting-started/concepts#field-level-max-depth}
   */
  maxDepth?: number
} & ExclusiveRelationshipFeatureProps

export const RelationshipFeature = createServerFeature<
  RelationshipFeatureProps,
  RelationshipFeatureProps,
  ExclusiveRelationshipFeatureProps
>({
  feature: ({ props }) => {
    // we don't need to pass maxDepth to the client, it's only used on the server
    const { maxDepth, ...clientFeatureProps } = props ?? {}
    return {
      ClientFeature: '@payloadcms/richtext-lexical/client#RelationshipFeatureClient',
      clientFeatureProps,
      i18n,
      nodes: [
        createNode({
          graphQLPopulationPromises: [relationshipPopulationPromiseHOC(props)],
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
                // @ts-expect-error
                const id = node?.value?.id || node?.value // for backwards-compatibility

                const populateDepth = maxDepth !== undefined && maxDepth < depth ? maxDepth : depth

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
          node: RelationshipServerNode,
        }),
      ],
    }
  },
  key: 'relationship',
})
```

--------------------------------------------------------------------------------

---[FILE: RelationshipNode.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/relationship/server/nodes/RelationshipNode.tsx
Signals: React

```typescript
import type { SerializedDecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode.js'
import type { CollectionSlug, DataFromCollectionSlug } from 'payload'
import type { JSX } from 'react'

import { DecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode.js'
import { addClassNamesToElement } from '@lexical/utils'
import {
  $applyNodeReplacement,
  type DOMConversionMap,
  type DOMConversionOutput,
  type DOMExportOutput,
  type EditorConfig,
  type ElementFormatType,
  type LexicalEditor,
  type LexicalNode,
  type NodeKey,
} from 'lexical'

import type { StronglyTypedLeafNode } from '../../../../nodeTypes.js'

export type RelationshipData = {
  [TCollectionSlug in CollectionSlug]: {
    relationTo: TCollectionSlug
    value: DataFromCollectionSlug<TCollectionSlug> | number | string
  }
}[CollectionSlug]

export type SerializedRelationshipNode = RelationshipData &
  StronglyTypedLeafNode<SerializedDecoratorBlockNode, 'relationship'>

function $relationshipElementToServerNode(domNode: HTMLDivElement): DOMConversionOutput | null {
  const id = domNode.getAttribute('data-lexical-relationship-id')
  const relationTo = domNode.getAttribute('data-lexical-relationship-relationTo')

  if (id != null && relationTo != null) {
    const node = $createServerRelationshipNode({
      relationTo,
      value: id,
    })
    return { node }
  }
  return null
}

export class RelationshipServerNode extends DecoratorBlockNode {
  __data: RelationshipData

  constructor({
    data,
    format,
    key,
  }: {
    data: RelationshipData
    format?: ElementFormatType
    key?: NodeKey
  }) {
    super(format, key)
    this.__data = data
  }

  static override clone(node: RelationshipServerNode): RelationshipServerNode {
    return new this({
      data: node.__data,
      format: node.__format,
      key: node.__key,
    })
  }

  static override getType(): string {
    return 'relationship'
  }

  static override importDOM(): DOMConversionMap<HTMLDivElement> | null {
    return {
      div: (domNode: HTMLDivElement) => {
        if (
          !domNode.hasAttribute('data-lexical-relationship-relationTo') ||
          !domNode.hasAttribute('data-lexical-relationship-id')
        ) {
          return null
        }
        return {
          conversion: $relationshipElementToServerNode,
          priority: 2,
        }
      },
    }
  }

  static override importJSON(serializedNode: SerializedRelationshipNode): RelationshipServerNode {
    if (serializedNode.version === 1 && (serializedNode?.value as unknown as { id: string })?.id) {
      serializedNode.value = (serializedNode.value as unknown as { id: string }).id
    }

    const importedData: RelationshipData = {
      relationTo: serializedNode.relationTo,
      value: serializedNode.value,
    }
    const node = $createServerRelationshipNode(importedData)
    node.setFormat(serializedNode.format)
    return node
  }

  static isInline(): false {
    return false
  }

  override createDOM(config?: EditorConfig): HTMLElement {
    const element = document.createElement('div')
    addClassNamesToElement(element, config?.theme?.relationship)
    return element
  }

  override decorate(_editor: LexicalEditor, _config: EditorConfig): JSX.Element {
    return null as unknown as JSX.Element
  }

  override exportDOM(): DOMExportOutput {
    const element = document.createElement('div')
    element.setAttribute(
      'data-lexical-relationship-id',
      String(typeof this.__data?.value === 'object' ? this.__data?.value?.id : this.__data?.value),
    )
    element.setAttribute('data-lexical-relationship-relationTo', this.__data?.relationTo)

    const text = document.createTextNode(this.getTextContent())
    element.append(text)
    return { element }
  }

  override exportJSON(): SerializedRelationshipNode {
    return {
      ...super.exportJSON(),
      ...this.getData(),
      type: 'relationship',
      version: 2,
    }
  }

  getData(): RelationshipData {
    return this.getLatest().__data
  }

  override getTextContent(): string {
    return `${this.__data?.relationTo} relation to ${typeof this.__data?.value === 'object' ? this.__data?.value?.id : this.__data?.value}`
  }

  setData(data: RelationshipData): void {
    const writable = this.getWritable()
    writable.__data = data
  }
}

export function $createServerRelationshipNode(data: RelationshipData): RelationshipServerNode {
  return $applyNodeReplacement(
    new RelationshipServerNode({
      data,
    }),
  )
}

export function $isServerRelationshipNode(
  node: LexicalNode | null | RelationshipServerNode | undefined,
): node is RelationshipServerNode {
  return node instanceof RelationshipServerNode
}
```

--------------------------------------------------------------------------------

---[FILE: basicGroup.ts]---
Location: payload-main/packages/richtext-lexical/src/features/shared/slashMenu/basicGroup.ts

```typescript
import type {
  SlashMenuGroup,
  SlashMenuItem,
} from '../../../lexical/plugins/SlashMenu/LexicalTypeaheadMenuPlugin/types.js'

export function slashMenuBasicGroupWithItems(items: SlashMenuItem[]): SlashMenuGroup {
  return {
    items,
    key: 'basic',
    label: ({ i18n }) => {
      return i18n.t('lexical:general:slashMenuBasicGroupLabel')
    },
  }
}
```

--------------------------------------------------------------------------------

---[FILE: addDropdownGroup.ts]---
Location: payload-main/packages/richtext-lexical/src/features/shared/toolbar/addDropdownGroup.ts

```typescript
import type { ToolbarGroup, ToolbarGroupItem } from '../../toolbars/types.js'

import { AddIcon } from '../../../lexical/ui/icons/Add/index.js'

export const toolbarAddDropdownGroupWithItems = (items: ToolbarGroupItem[]): ToolbarGroup => {
  return {
    type: 'dropdown',
    ChildComponent: AddIcon,
    items,
    key: 'add',
    order: 10,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: featureButtonsGroup.ts]---
Location: payload-main/packages/richtext-lexical/src/features/shared/toolbar/featureButtonsGroup.ts

```typescript
import type { ToolbarGroup, ToolbarGroupItem } from '../../toolbars/types.js'

export const toolbarFeatureButtonsGroupWithItems = (items: ToolbarGroupItem[]): ToolbarGroup => {
  return {
    type: 'buttons',
    items,
    key: 'features',
    order: 50,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: textDropdownGroup.ts]---
Location: payload-main/packages/richtext-lexical/src/features/shared/toolbar/textDropdownGroup.ts

```typescript
import type { ToolbarGroup, ToolbarGroupItem } from '../../toolbars/types.js'

import { TextIcon } from '../../../lexical/ui/icons/Text/index.js'

export const toolbarTextDropdownGroupWithItems = (items: ToolbarGroupItem[]): ToolbarGroup => {
  return {
    type: 'dropdown',
    ChildComponent: TextIcon,
    items,
    key: 'text',
    order: 25,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: defaultColors.ts]---
Location: payload-main/packages/richtext-lexical/src/features/textState/defaultColors.ts

```typescript
import type { StateValues } from './feature.server.js'

const tailwindColors = {
  amber: {
    '50': 'oklch(0.987 0.022 95.277)',
    '100': 'oklch(0.962 0.059 95.617)',
    '200': 'oklch(0.924 0.12 95.746)',
    '300': 'oklch(0.879 0.169 91.605)',
    '400': 'oklch(0.828 0.189 84.429)',
    '500': 'oklch(0.769 0.188 70.08)',
    '600': 'oklch(0.666 0.179 58.318)',
    '700': 'oklch(0.555 0.163 48.998)',
    '800': 'oklch(0.473 0.137 46.201)',
    '900': 'oklch(0.414 0.112 45.904)',
    '950': 'oklch(0.279 0.077 45.635)',
  },
  black: '#000',
  blue: {
    '50': 'oklch(0.97 0.014 254.604)',
    '100': 'oklch(0.932 0.032 255.585)',
    '200': 'oklch(0.882 0.059 254.128)',
    '300': 'oklch(0.809 0.105 251.813)',
    '400': 'oklch(0.707 0.165 254.624)',
    '500': 'oklch(0.623 0.214 259.815)',
    '600': 'oklch(0.546 0.245 262.881)',
    '700': 'oklch(0.488 0.243 264.376)',
    '800': 'oklch(0.424 0.199 265.638)',
    '900': 'oklch(0.379 0.146 265.522)',
    '950': 'oklch(0.282 0.091 267.935)',
  },
  current: 'currentColor',
  cyan: {
    '50': 'oklch(0.984 0.019 200.873)',
    '100': 'oklch(0.956 0.045 203.388)',
    '200': 'oklch(0.917 0.08 205.041)',
    '300': 'oklch(0.865 0.127 207.078)',
    '400': 'oklch(0.789 0.154 211.53)',
    '500': 'oklch(0.715 0.143 215.221)',
    '600': 'oklch(0.609 0.126 221.723)',
    '700': 'oklch(0.52 0.105 223.128)',
    '800': 'oklch(0.45 0.085 224.283)',
    '900': 'oklch(0.398 0.07 227.392)',
    '950': 'oklch(0.302 0.056 229.695)',
  },
  emerald: {
    '50': 'oklch(0.979 0.021 166.113)',
    '100': 'oklch(0.95 0.052 163.051)',
    '200': 'oklch(0.905 0.093 164.15)',
    '300': 'oklch(0.845 0.143 164.978)',
    '400': 'oklch(0.765 0.177 163.223)',
    '500': 'oklch(0.696 0.17 162.48)',
    '600': 'oklch(0.596 0.145 163.225)',
    '700': 'oklch(0.508 0.118 165.612)',
    '800': 'oklch(0.432 0.095 166.913)',
    '900': 'oklch(0.378 0.077 168.94)',
    '950': 'oklch(0.262 0.051 172.552)',
  },
  fuchsia: {
    '50': 'oklch(0.977 0.017 320.058)',
    '100': 'oklch(0.952 0.037 318.852)',
    '200': 'oklch(0.903 0.076 319.62)',
    '300': 'oklch(0.833 0.145 321.434)',
    '400': 'oklch(0.74 0.238 322.16)',
    '500': 'oklch(0.667 0.295 322.15)',
    '600': 'oklch(0.591 0.293 322.896)',
    '700': 'oklch(0.518 0.253 323.949)',
    '800': 'oklch(0.452 0.211 324.591)',
    '900': 'oklch(0.401 0.17 325.612)',
    '950': 'oklch(0.293 0.136 325.661)',
  },
  gray: {
    '50': 'oklch(0.985 0.002 247.839)',
    '100': 'oklch(0.967 0.003 264.542)',
    '200': 'oklch(0.928 0.006 264.531)',
    '300': 'oklch(0.872 0.01 258.338)',
    '400': 'oklch(0.707 0.022 261.325)',
    '500': 'oklch(0.551 0.027 264.364)',
    '600': 'oklch(0.446 0.03 256.802)',
    '700': 'oklch(0.373 0.034 259.733)',
    '800': 'oklch(0.278 0.033 256.848)',
    '900': 'oklch(0.21 0.034 264.665)',
    '950': 'oklch(0.13 0.028 261.692)',
  },
  green: {
    '50': 'oklch(0.982 0.018 155.826)',
    '100': 'oklch(0.962 0.044 156.743)',
    '200': 'oklch(0.925 0.084 155.995)',
    '300': 'oklch(0.871 0.15 154.449)',
    '400': 'oklch(0.792 0.209 151.711)',
    '500': 'oklch(0.723 0.219 149.579)',
    '600': 'oklch(0.627 0.194 149.214)',
    '700': 'oklch(0.527 0.154 150.069)',
    '800': 'oklch(0.448 0.119 151.328)',
    '900': 'oklch(0.393 0.095 152.535)',
    '950': 'oklch(0.266 0.065 152.934)',
  },
  indigo: {
    '50': 'oklch(0.962 0.018 272.314)',
    '100': 'oklch(0.93 0.034 272.788)',
    '200': 'oklch(0.87 0.065 274.039)',
    '300': 'oklch(0.785 0.115 274.713)',
    '400': 'oklch(0.673 0.182 276.935)',
    '500': 'oklch(0.585 0.233 277.117)',
    '600': 'oklch(0.511 0.262 276.966)',
    '700': 'oklch(0.457 0.24 277.023)',
    '800': 'oklch(0.398 0.195 277.366)',
    '900': 'oklch(0.359 0.144 278.697)',
    '950': 'oklch(0.257 0.09 281.288)',
  },
  inherit: 'inherit',
  lime: {
    '50': 'oklch(0.986 0.031 120.757)',
    '100': 'oklch(0.967 0.067 122.328)',
    '200': 'oklch(0.938 0.127 124.321)',
    '300': 'oklch(0.897 0.196 126.665)',
    '400': 'oklch(0.841 0.238 128.85)',
    '500': 'oklch(0.768 0.233 130.85)',
    '600': 'oklch(0.648 0.2 131.684)',
    '700': 'oklch(0.532 0.157 131.589)',
    '800': 'oklch(0.453 0.124 130.933)',
    '900': 'oklch(0.405 0.101 131.063)',
    '950': 'oklch(0.274 0.072 132.109)',
  },
  neutral: {
    '50': 'oklch(0.985 0 0)',
    '100': 'oklch(0.97 0 0)',
    '200': 'oklch(0.922 0 0)',
    '300': 'oklch(0.87 0 0)',
    '400': 'oklch(0.708 0 0)',
    '500': 'oklch(0.556 0 0)',
    '600': 'oklch(0.439 0 0)',
    '700': 'oklch(0.371 0 0)',
    '800': 'oklch(0.269 0 0)',
    '900': 'oklch(0.205 0 0)',
    '950': 'oklch(0.145 0 0)',
  },
  orange: {
    '50': 'oklch(0.98 0.016 73.684)',
    '100': 'oklch(0.954 0.038 75.164)',
    '200': 'oklch(0.901 0.076 70.697)',
    '300': 'oklch(0.837 0.128 66.29)',
    '400': 'oklch(0.75 0.183 55.934)',
    '500': 'oklch(0.705 0.213 47.604)',
    '600': 'oklch(0.646 0.222 41.116)',
    '700': 'oklch(0.553 0.195 38.402)',
    '800': 'oklch(0.47 0.157 37.304)',
    '900': 'oklch(0.408 0.123 38.172)',
    '950': 'oklch(0.266 0.079 36.259)',
  },
  pink: {
    '50': 'oklch(0.971 0.014 343.198)',
    '100': 'oklch(0.948 0.028 342.258)',
    '200': 'oklch(0.899 0.061 343.231)',
    '300': 'oklch(0.823 0.12 346.018)',
    '400': 'oklch(0.718 0.202 349.761)',
    '500': 'oklch(0.656 0.241 354.308)',
    '600': 'oklch(0.592 0.249 0.584)',
    '700': 'oklch(0.525 0.223 3.958)',
    '800': 'oklch(0.459 0.187 3.815)',
    '900': 'oklch(0.408 0.153 2.432)',
    '950': 'oklch(0.284 0.109 3.907)',
  },
  purple: {
    '50': 'oklch(0.977 0.014 308.299)',
    '100': 'oklch(0.946 0.033 307.174)',
    '200': 'oklch(0.902 0.063 306.703)',
    '300': 'oklch(0.827 0.119 306.383)',
    '400': 'oklch(0.714 0.203 305.504)',
    '500': 'oklch(0.627 0.265 303.9)',
    '600': 'oklch(0.558 0.288 302.321)',
    '700': 'oklch(0.496 0.265 301.924)',
    '800': 'oklch(0.438 0.218 303.724)',
    '900': 'oklch(0.381 0.176 304.987)',
    '950': 'oklch(0.291 0.149 302.717)',
  },
  red: {
    '50': 'oklch(0.971 0.013 17.38)',
    '100': 'oklch(0.936 0.032 17.717)',
    '200': 'oklch(0.885 0.062 18.334)',
    '300': 'oklch(0.808 0.114 19.571)',
    '400': 'oklch(0.704 0.191 22.216)',
    '500': 'oklch(0.637 0.237 25.331)',
    '600': 'oklch(0.577 0.245 27.325)',
    '700': 'oklch(0.505 0.213 27.518)',
    '800': 'oklch(0.444 0.177 26.899)',
    '900': 'oklch(0.396 0.141 25.723)',
    '950': 'oklch(0.258 0.092 26.042)',
  },
  rose: {
    '50': 'oklch(0.969 0.015 12.422)',
    '100': 'oklch(0.941 0.03 12.58)',
    '200': 'oklch(0.892 0.058 10.001)',
    '300': 'oklch(0.81 0.117 11.638)',
    '400': 'oklch(0.712 0.194 13.428)',
    '500': 'oklch(0.645 0.246 16.439)',
    '600': 'oklch(0.586 0.253 17.585)',
    '700': 'oklch(0.514 0.222 16.935)',
    '800': 'oklch(0.455 0.188 13.697)',
    '900': 'oklch(0.41 0.159 10.272)',
    '950': 'oklch(0.271 0.105 12.094)',
  },
  sky: {
    '50': 'oklch(0.977 0.013 236.62)',
    '100': 'oklch(0.951 0.026 236.824)',
    '200': 'oklch(0.901 0.058 230.902)',
    '300': 'oklch(0.828 0.111 230.318)',
    '400': 'oklch(0.746 0.16 232.661)',
    '500': 'oklch(0.685 0.169 237.323)',
    '600': 'oklch(0.588 0.158 241.966)',
    '700': 'oklch(0.5 0.134 242.749)',
    '800': 'oklch(0.443 0.11 240.79)',
    '900': 'oklch(0.391 0.09 240.876)',
    '950': 'oklch(0.293 0.066 243.157)',
  },
  slate: {
    '50': 'oklch(0.984 0.003 247.858)',
    '100': 'oklch(0.968 0.007 247.896)',
    '200': 'oklch(0.929 0.013 255.508)',
    '300': 'oklch(0.869 0.022 252.894)',
    '400': 'oklch(0.704 0.04 256.788)',
    '500': 'oklch(0.554 0.046 257.417)',
    '600': 'oklch(0.446 0.043 257.281)',
    '700': 'oklch(0.372 0.044 257.287)',
    '800': 'oklch(0.279 0.041 260.031)',
    '900': 'oklch(0.208 0.042 265.755)',
    '950': 'oklch(0.129 0.042 264.695)',
  },
  stone: {
    '50': 'oklch(0.985 0.001 106.423)',
    '100': 'oklch(0.97 0.001 106.424)',
    '200': 'oklch(0.923 0.003 48.717)',
    '300': 'oklch(0.869 0.005 56.366)',
    '400': 'oklch(0.709 0.01 56.259)',
    '500': 'oklch(0.553 0.013 58.071)',
    '600': 'oklch(0.444 0.011 73.639)',
    '700': 'oklch(0.374 0.01 67.558)',
    '800': 'oklch(0.268 0.007 34.298)',
    '900': 'oklch(0.216 0.006 56.043)',
    '950': 'oklch(0.147 0.004 49.25)',
  },
  teal: {
    '50': 'oklch(0.984 0.014 180.72)',
    '100': 'oklch(0.953 0.051 180.801)',
    '200': 'oklch(0.91 0.096 180.426)',
    '300': 'oklch(0.855 0.138 181.071)',
    '400': 'oklch(0.777 0.152 181.912)',
    '500': 'oklch(0.704 0.14 182.503)',
    '600': 'oklch(0.6 0.118 184.704)',
    '700': 'oklch(0.511 0.096 186.391)',
    '800': 'oklch(0.437 0.078 188.216)',
    '900': 'oklch(0.386 0.063 188.416)',
    '950': 'oklch(0.277 0.046 192.524)',
  },
  transparent: 'transparent',
  violet: {
    '50': 'oklch(0.969 0.016 293.756)',
    '100': 'oklch(0.943 0.029 294.588)',
    '200': 'oklch(0.894 0.057 293.283)',
    '300': 'oklch(0.811 0.111 293.571)',
    '400': 'oklch(0.702 0.183 293.541)',
    '500': 'oklch(0.606 0.25 292.717)',
    '600': 'oklch(0.541 0.281 293.009)',
    '700': 'oklch(0.491 0.27 292.581)',
    '800': 'oklch(0.432 0.232 292.759)',
    '900': 'oklch(0.38 0.189 293.745)',
    '950': 'oklch(0.283 0.141 291.089)',
  },
  white: '#fff',
  yellow: {
    '50': 'oklch(0.987 0.026 102.212)',
    '100': 'oklch(0.973 0.071 103.193)',
    '200': 'oklch(0.945 0.129 101.54)',
    '300': 'oklch(0.905 0.182 98.111)',
    '400': 'oklch(0.852 0.199 91.936)',
    '500': 'oklch(0.795 0.184 86.047)',
    '600': 'oklch(0.681 0.162 75.834)',
    '700': 'oklch(0.554 0.135 66.442)',
    '800': 'oklch(0.476 0.114 61.907)',
    '900': 'oklch(0.421 0.095 57.708)',
    '950': 'oklch(0.286 0.066 53.813)',
  },
  zinc: {
    '50': 'oklch(0.985 0 0)',
    '100': 'oklch(0.967 0.001 286.375)',
    '200': 'oklch(0.92 0.004 286.32)',
    '300': 'oklch(0.871 0.006 286.286)',
    '400': 'oklch(0.705 0.015 286.067)',
    '500': 'oklch(0.552 0.016 285.938)',
    '600': 'oklch(0.442 0.017 285.786)',
    '700': 'oklch(0.37 0.013 285.805)',
    '800': 'oklch(0.274 0.006 286.033)',
    '900': 'oklch(0.21 0.006 285.885)',
    '950': 'oklch(0.141 0.005 285.823)',
  },
}

// prettier-ignore
/* eslint-disable perfectionist/sort-objects */
export const defaultColors = {
    text: {
      'text-red': { css: { 'color': `light-dark(${tailwindColors.red[600]}, ${tailwindColors.red[400]})`, }, label: 'Red' },
      'text-orange': { css: { 'color': `light-dark(${tailwindColors.orange[600]}, ${tailwindColors.orange[400]})`, }, label: 'Orange' },
      'text-yellow': { css: { 'color': `light-dark(${tailwindColors.yellow[700]}, ${tailwindColors.yellow[300]})`, }, label: 'Yellow' },
      'text-green': { css: { 'color': `light-dark(${tailwindColors.green[700]}, ${tailwindColors.green[400]})`, }, label: 'Green' },
      'text-blue': { css: { 'color': `light-dark(${tailwindColors.blue[600]}, ${tailwindColors.blue[400]})`, }, label: 'Blue' },
      'text-purple': { css: { 'color': `light-dark(${tailwindColors.purple[600]}, ${tailwindColors.purple[400]})`, }, label: 'Purple' },
      'text-pink': { css: { 'color': `light-dark(${tailwindColors.pink[600]}, ${tailwindColors.pink[400]})`, }, label: 'Pink' },
    } satisfies StateValues,
    background: {
      'bg-red': { css: { 'background-color': `light-dark(${tailwindColors.red[400]}, ${tailwindColors.red[600]})`, }, label: 'Red' },
      'bg-orange': { css: { 'background-color': `light-dark(${tailwindColors.orange[400]}, ${tailwindColors.orange[600]})`, }, label: 'Orange' },
      'bg-yellow': { css: { 'background-color': `light-dark(${tailwindColors.yellow[300]}, ${tailwindColors.yellow[700]})`, }, label: 'Yellow' },
      'bg-green': { css: { 'background-color': `light-dark(${tailwindColors.green[400]}, ${tailwindColors.green[700]})`, }, label: 'Green' },
      'bg-blue': { css: { 'background-color': `light-dark(${tailwindColors.blue[400]}, ${tailwindColors.blue[600]})`, }, label: 'Blue' },
      'bg-purple': { css: { 'background-color': `light-dark(${tailwindColors.purple[400]}, ${tailwindColors.purple[600]})`, }, label: 'Purple' },
      'bg-pink': { css: { 'background-color': `light-dark(${tailwindColors.pink[400]}, ${tailwindColors.pink[600]})`, }, label: 'Pink' },
    } satisfies StateValues
  }
```

--------------------------------------------------------------------------------

---[FILE: feature.client.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/textState/feature.client.tsx

```typescript
'use client'

import type { ToolbarDropdownGroup, ToolbarGroup } from '../toolbars/types.js'
import type { TextStateFeatureProps } from './feature.server.js'

import { TextStateIcon } from '../../lexical/ui/icons/TextState/index.js'
import { createClientFeature } from '../../utilities/createClientFeature.js'
import { registerTextStates, setTextState, type StateMap, StatePlugin } from './textState.js'

const toolbarGroups = (props: TextStateFeatureProps, stateMap: StateMap): ToolbarGroup[] => {
  const items: ToolbarDropdownGroup['items'] = []

  for (const stateKey in props.state) {
    const key = props.state[stateKey]!
    for (const stateValue in key) {
      const meta = key[stateValue]!
      items.push({
        ChildComponent: () => <TextStateIcon css={meta.css} />,
        key: stateValue,
        label: meta.label,
        onSelect: ({ editor }) => {
          setTextState(editor, stateMap, stateKey, stateValue)
        },
      })
    }
  }

  const clearStyle: ToolbarDropdownGroup['items'] = [
    {
      ChildComponent: () => <TextStateIcon />,
      key: `clear-style`,
      label: ({ i18n }) => i18n.t('lexical:textState:defaultStyle'),
      onSelect: ({ editor }) => {
        for (const stateKey in props.state) {
          setTextState(editor, stateMap, stateKey, undefined)
        }
      },
      order: 1,
    },
  ]

  return [
    {
      type: 'dropdown',
      ChildComponent: () => <TextStateIcon css={{ color: 'var(--theme-elevation-600)' }} />,
      items: [...clearStyle, ...items],
      key: 'textState',
      order: 30,
    },
  ]
}

export const TextStateFeatureClient = createClientFeature<TextStateFeatureProps>(({ props }) => {
  const stateMap = registerTextStates(props.state)
  return {
    plugins: [
      {
        Component: () => StatePlugin({ stateMap }),
        position: 'normal',
      },
    ],
    toolbarFixed: {
      groups: toolbarGroups(props, stateMap),
    },
    toolbarInline: {
      groups: toolbarGroups(props, stateMap),
    },
  }
})
```

--------------------------------------------------------------------------------

---[FILE: feature.server.ts]---
Location: payload-main/packages/richtext-lexical/src/features/textState/feature.server.ts

```typescript
import type { PropertiesHyphenFallback } from 'csstype'
import type { Prettify } from 'ts-essentials'

import { createServerFeature } from '../../utilities/createServerFeature.js'
import { i18n } from './i18n.js'

// extracted from https://github.com/facebook/lexical/pull/7294
export type StyleObject = Prettify<{
  [K in keyof PropertiesHyphenFallback]?:
    | Extract<PropertiesHyphenFallback[K], string>
    // This is simplified to not deal with arrays or numbers.
    // This is an example after all!
    | undefined
}>

export type StateValues = { [stateValue: string]: { css: StyleObject; label: string } }

export type TextStateFeatureProps = {
  /**
   * The keys of the top-level object (stateKeys) represent the attributes that the textNode can have (e.g., color).
   * The values of the top-level object (stateValues) represent the values that the attribute can have (e.g., red, blue, etc.).
   * Within the stateValue, you can define inline styles and labels.
   *
   * @note Because this is a common use case, we provide a defaultColors object with colors that
   * look good in both dark and light mode, which you can use or adapt to your liking.
   *
   *
   *
   * @example
   * import { defaultColors } from '@payloadcms/richtext-lexical'
   *
   * state: {
   *   color: {
   *     ...defaultColors.background,
   *     ...defaultColors.text,
   *     // fancy gradients!
   *     galaxy: { label: 'Galaxy', css: { background: 'linear-gradient(to right, #0000ff, #ff0000)', color: 'white' } },
   *     sunset: { label: 'Sunset', css: { background: 'linear-gradient(to top, #ff5f6d, #6a3093)' } },
   *    },
   *    // You can have both colored and underlined text at the same time.
   *    // If you don't want that, you should group them within the same key.
   *    // (just like I did with defaultColors and my fancy gradients)
   *    underline: {
   *      'solid': { label: 'Solid', css: { 'text-decoration': 'underline', 'text-underline-offset': '4px' } },
   *      // You'll probably want to use the CSS light-dark() utility.
   *      'yellow-dashed': { label: 'Yellow Dashed', css: { 'text-decoration': 'underline dashed', 'text-decoration-color': 'light-dark(#EAB308,yellow)', 'text-underline-offset': '4px' } },
   *    },
   * }
   *
   */
  state: { [stateKey: string]: StateValues }
}

/**
 * Allows you to store key-value attributes within TextNodes and define inline styles for each combination.
 * Inline styles are not part of the editorState, reducing the JSON size and allowing you to easily migrate or adapt styles later.
 *
 * This feature can be used, among other things, to add colors to text.
 *
 * For more information and examples, see the JSdocs for the "state" property that this feature receives as a parameter.
 *
 * @experimental There may be breaking changes to this API
 */
export const TextStateFeature = createServerFeature<
  TextStateFeatureProps,
  TextStateFeatureProps,
  TextStateFeatureProps
>({
  feature: ({ props }) => {
    return {
      ClientFeature: '@payloadcms/richtext-lexical/client#TextStateFeatureClient',
      clientFeatureProps: {
        state: props?.state,
      },
      i18n,
    }
  },
  key: 'textState',
})
```

--------------------------------------------------------------------------------

---[FILE: i18n.ts]---
Location: payload-main/packages/richtext-lexical/src/features/textState/i18n.ts

```typescript
import type { GenericLanguages } from '@payloadcms/translations'

export const i18n: Partial<GenericLanguages> = {
  ar: { defaultStyle: 'النمط الافتراضي' },
  az: { defaultStyle: 'Defolt üslub' },
  bg: { defaultStyle: 'Стандартен стил' },
  cs: { defaultStyle: 'Výchozí styl' },
  da: { defaultStyle: 'Standardstil' },
  de: { defaultStyle: 'Standardstil' },
  en: { defaultStyle: 'Default style' },
  es: { defaultStyle: 'Estilo predeterminado' },
  et: { defaultStyle: 'Vaikimisi stiil' },
  fa: { defaultStyle: 'سبک پیش‌فرض' },
  fr: { defaultStyle: 'Style par défaut' },
  he: { defaultStyle: 'סגנון ברירת מחדל' },
  hr: { defaultStyle: 'Zadani stil' },
  hu: { defaultStyle: 'Alapértelmezett stílus' },
  is: { defaultStyle: 'Sjálfgefinn stíll' },
  it: { defaultStyle: 'Stile predefinito' },
  ja: { defaultStyle: 'デフォルトスタイル' },
  ko: { defaultStyle: '기본 스타일' },
  my: { defaultStyle: 'Gaya lalai' },
  nb: { defaultStyle: 'Standardstil' },
  nl: { defaultStyle: 'Standaardstijl' },
  pl: { defaultStyle: 'Domyślny styl' },
  pt: { defaultStyle: 'Estilo padrão' },
  ro: { defaultStyle: 'Stil implicit' },
  rs: { defaultStyle: 'Подразумевани стил' },
  'rs-latin': { defaultStyle: 'Podrazumevani stil' },
  ru: { defaultStyle: 'Стиль по умолчанию' },
  sk: { defaultStyle: 'Predvolený štýl' },
  sl: { defaultStyle: 'Privzeti slog' },
  sv: { defaultStyle: 'Standardstil' },
  ta: { defaultStyle: 'பொது பாணி' },
  th: { defaultStyle: 'สไตล์เริ่มต้น' },
  tr: { defaultStyle: 'Varsayılan stil' },
  uk: { defaultStyle: 'Стиль за замовчуванням' },
  vi: { defaultStyle: 'Kiểu mặc định' },
  zh: { defaultStyle: '默认样式' },
  'zh-TW': { defaultStyle: '預設樣式' },
}
```

--------------------------------------------------------------------------------

---[FILE: textState.ts]---
Location: payload-main/packages/richtext-lexical/src/features/textState/textState.ts
Signals: React

```typescript
import type { LexicalEditor, StateConfig } from 'lexical'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $forEachSelectedTextNode } from '@lexical/selection'
import { $getNodeByKey, $getState, $setState, createState, TextNode } from 'lexical'
import { useEffect } from 'react'

import { type StateValues, type TextStateFeatureProps } from './feature.server.js'

export type StateMap = Map<
  string,
  {
    stateConfig: StateConfig<string, string | undefined>
    stateValues: StateValues
  }
>

export function registerTextStates(state: TextStateFeatureProps['state']) {
  const stateMap: StateMap = new Map()

  for (const stateKey in state) {
    const stateValues = state[stateKey]!
    const stateConfig = createState(stateKey, {
      parse: (value) =>
        typeof value === 'string' && Object.keys(stateValues).includes(value) ? value : undefined,
    })
    stateMap.set(stateKey, { stateConfig, stateValues })
  }
  return stateMap
}

export function setTextState(
  editor: LexicalEditor,
  stateMap: StateMap,
  stateKey: string,
  value: string | undefined,
) {
  editor.update(() => {
    $forEachSelectedTextNode((textNode) => {
      const stateMapEntry = stateMap.get(stateKey)
      if (!stateMapEntry) {
        throw new Error(`State config for ${stateKey} not found`)
      }
      $setState(textNode, stateMapEntry.stateConfig, value)
    })
  })
}

export function StatePlugin({ stateMap }: { stateMap: StateMap }) {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerMutationListener(TextNode, (mutatedNodes) => {
      editor.getEditorState().read(() => {
        for (const [nodeKey, mutation] of mutatedNodes) {
          if (mutation === 'destroyed') {
            continue
          }
          const node = $getNodeByKey(nodeKey)
          const dom = editor.getElementByKey(nodeKey)
          if (!node || !dom) {
            continue
          }

          const mergedStyles: Record<string, string> = Object.create(null)
          // Examples:
          // stateKey: 'color'
          // stateValue: 'bg-red'
          stateMap.forEach((stateEntry, stateKey) => {
            const stateValue = $getState(node, stateEntry.stateConfig)
            if (!stateValue) {
              // clear the previous dataset value for this key
              delete dom.dataset[stateKey]
              return
            } // skip - nothing else to do

            dom.dataset[stateKey] = stateValue

            const css = stateEntry.stateValues[stateValue]?.css
            if (css) {
              // merge existing styles with the new ones
              Object.assign(mergedStyles, css)
            }
          })

          // wipe previous inline styles once, then set the merged ones
          dom.style.cssText = ''
          Object.assign(dom.style, mergedStyles)
        }
      })
    })
  }, [editor])

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/richtext-lexical/src/features/toolbars/types.ts
Signals: React

```typescript
import type { I18nClient } from '@payloadcms/translations'
import type { BaseSelection, LexicalEditor } from 'lexical'
import type React from 'react'

import type { EditorConfigContextType } from '../../lexical/config/client/EditorConfigProvider.js'
import type { FeatureClientSchemaMap } from '../../types.js'

export type ToolbarGroup = ToolbarButtonsGroup | ToolbarDropdownGroup

export type ToolbarDropdownGroup = {
  /**
   * The dropdown toolbar ChildComponent allows you to pass in a React Component which will be displayed within the dropdown button.
   */
  ChildComponent?: React.FC
  /**
   * This is optional and controls if the toolbar group is highlighted or not.
   */
  isEnabled?: ({
    editor,
    editorConfigContext,
    selection,
  }: {
    editor: LexicalEditor
    editorConfigContext: EditorConfigContextType
    selection: BaseSelection
  }) => boolean
  /**
   * All toolbar items part of this toolbar group need to be added here.
   */
  items: Array<ToolbarGroupItem>
  /**
   * Each toolbar group needs to have a unique key. Groups with the same keys will have their items merged together.
   */
  key: string
  /**
   * The maximum number of active items that can be selected at once.
   * Increasing this will hurt performance, as more nodes need to be checked for their active state.
   *
   * E.g. if this is 1, we can stop checking nodes once we find an active node.
   *
   * @default 1
   */
  maxActiveItems?: number
  /**
   * Determines where the toolbar group will be.
   */
  order?: number
  /**
   * Controls the toolbar group type. Set to `dropdown` to create a buttons toolbar group, which displays toolbar items vertically using their icons and labels, if the dropdown is open.
   */
  type: 'dropdown'
}

export type ToolbarButtonsGroup = {
  /**
   * All toolbar items part of this toolbar group need to be added here.
   */
  items: Array<ToolbarGroupItem>
  /**
   * Each toolbar group needs to have a unique key. Groups with the same keys will have their items merged together.
   */
  key: string
  /**
   * Determines where the toolbar group will be.
   */
  order?: number
  /**
   * Controls the toolbar group type. Set to `buttons` to create a buttons toolbar group, which displays toolbar items horizontally using only their icons.
   */
  type: 'buttons'
}

export type ToolbarGroupItem = {
  /** A React component which is rendered within your toolbar item's default button component. Usually, you want this to be an icon. */
  ChildComponent?: React.FC
  /** A React component which is rendered in place of the toolbar item's default button component, thus completely replacing it. The `ChildComponent` and `onSelect` properties will be ignored. */
  Component?: React.FC<{
    active?: boolean
    anchorElem: HTMLElement
    editor: LexicalEditor
    enabled?: boolean
    item: ToolbarGroupItem
  }>
  /** This is optional and controls if the toolbar item is highlighted or not. */
  isActive?: ({
    editor,
    editorConfigContext,
    selection,
  }: {
    editor: LexicalEditor
    editorConfigContext: EditorConfigContextType
    selection: BaseSelection
  }) => boolean
  /** This is optional and controls if the toolbar item is clickable or not. If `false` is returned here, it will be grayed out and unclickable. */
  isEnabled?: ({
    editor,
    editorConfigContext,
    selection,
  }: {
    editor: LexicalEditor
    editorConfigContext: EditorConfigContextType
    selection: BaseSelection
  }) => boolean
  /** Each toolbar item needs to have a unique key. */
  key: string
  /** The label will be displayed in your toolbar item, if it's within a dropdown group. In order to make use of i18n, this can be a function. */
  label?:
    | ((args: {
        featureClientSchemaMap: FeatureClientSchemaMap
        i18n: I18nClient<{}, string>
        schemaPath: string
      }) => string)
    | string
  /** Each toolbar item needs to have a unique key. */
  onSelect?: ({ editor, isActive }: { editor: LexicalEditor; isActive: boolean }) => void
  order?: number
}

export type CustomGroups = Record<
  string,
  | Partial<Omit<ToolbarButtonsGroup, 'items' | 'key'>>
  | Partial<Omit<ToolbarDropdownGroup, 'isEnabled' | 'items' | 'key'>>
>
```

--------------------------------------------------------------------------------

````
