---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 291
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 291 of 695)

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

---[FILE: sanitize.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical/config/client/sanitize.ts

```typescript
'use client'

import type { EditorConfig as LexicalEditorConfig } from 'lexical'

import { deepMerge } from 'payload/shared'

import type { ToolbarGroup } from '../../../features/toolbars/types.js'
import type {
  ResolvedClientFeatureMap,
  SanitizedClientFeatures,
} from '../../../features/typesClient.js'
import type { LexicalFieldAdminClientProps } from '../../../types.js'
import type { SanitizedClientEditorConfig } from '../types.js'

export const sanitizeClientFeatures = (
  features: ResolvedClientFeatureMap,
): SanitizedClientFeatures => {
  const sanitized: SanitizedClientFeatures = {
    enabledFeatures: [],
    enabledFormats: [],
    markdownTransformers: [],
    nodes: [],
    plugins: [],
    providers: [],
    slashMenu: {
      dynamicGroups: [],
      groups: [],
    },
    toolbarFixed: {
      groups: [],
    },
    toolbarInline: {
      groups: [],
    },
  }

  // Allow customization of groups for toolbarFixed
  let customGroups: Record<string, Partial<ToolbarGroup>> = {}
  features.forEach((feature) => {
    if (feature.key === 'toolbarFixed' && feature.sanitizedClientFeatureProps?.customGroups) {
      customGroups = {
        ...customGroups,
        ...feature.sanitizedClientFeatureProps.customGroups,
      }
    }
  })

  if (!features?.size) {
    return sanitized
  }

  features.forEach((feature) => {
    if (feature.providers?.length) {
      sanitized.providers = sanitized.providers.concat(feature.providers)
    }

    if (feature.enableFormats?.length) {
      sanitized.enabledFormats.push(...feature.enableFormats)
    }

    if (feature.nodes?.length) {
      // Important: do not use concat
      for (const node of feature.nodes) {
        sanitized.nodes.push(node)
      }
    }
    if (feature.plugins?.length) {
      feature.plugins.forEach((plugin, i) => {
        sanitized.plugins?.push({
          clientProps: feature.sanitizedClientFeatureProps,
          Component: plugin.Component as any, // Appeases strict: true
          key: feature.key + i,
          position: plugin.position,
        })
      })
    }

    if (feature.toolbarInline?.groups?.length) {
      for (const group of feature.toolbarInline.groups) {
        // 1. find the group with the same key or create new one
        let foundGroup = sanitized.toolbarInline.groups.find(
          (sanitizedGroup) => sanitizedGroup.key === group.key,
        )
        if (!foundGroup) {
          foundGroup = {
            ...group,
            items: [],
          }
        } else {
          sanitized.toolbarInline.groups = sanitized.toolbarInline.groups.filter(
            (sanitizedGroup) => sanitizedGroup.key !== group.key,
          )
        }

        // 2. Add options to group options array and add to sanitized.slashMenu.groupsWithOptions
        if (group?.items?.length) {
          foundGroup.items = foundGroup.items.concat(group.items)
        }
        sanitized.toolbarInline?.groups.push(foundGroup)
      }
    }

    if (feature.toolbarFixed?.groups?.length) {
      for (const group of feature.toolbarFixed.groups) {
        // 1. find the group with the same key or create new one
        let foundGroup = sanitized.toolbarFixed.groups.find(
          (sanitizedGroup) => sanitizedGroup.key === group.key,
        )
        if (!foundGroup) {
          foundGroup = {
            ...group,
            items: [],
          }
        } else {
          sanitized.toolbarFixed.groups = sanitized.toolbarFixed.groups.filter(
            (sanitizedGroup) => sanitizedGroup.key !== group.key,
          )
        }

        // 2. Add options to group options array and add to sanitized.slashMenu.groupsWithOptions
        if (group?.items?.length) {
          foundGroup.items = foundGroup.items.concat(group.items)
        }
        sanitized.toolbarFixed?.groups.push(foundGroup)
      }
    }

    if (feature.slashMenu?.groups) {
      if (feature.slashMenu.dynamicGroups?.length) {
        sanitized.slashMenu.dynamicGroups = sanitized.slashMenu.dynamicGroups.concat(
          feature.slashMenu.dynamicGroups,
        )
      }

      for (const optionGroup of feature.slashMenu.groups) {
        // 1. find the group with the same name or create new one
        let group = sanitized.slashMenu.groups.find((group) => group.key === optionGroup.key)
        if (!group) {
          group = {
            ...optionGroup,
            items: [],
          }
        } else {
          sanitized.slashMenu.groups = sanitized.slashMenu.groups.filter(
            (group) => group.key !== optionGroup.key,
          )
        }

        // 2. Add options to group options array and add to sanitized.slashMenu.groupsWithOptions
        if (optionGroup?.items?.length) {
          group.items = group.items.concat(optionGroup.items)
        }
        sanitized.slashMenu.groups.push(group)
      }
    }

    if (feature.markdownTransformers?.length) {
      // Important: do not use concat
      for (const transformer of feature.markdownTransformers) {
        if (typeof transformer === 'function') {
          sanitized.markdownTransformers.push(
            transformer({
              allNodes: sanitized.nodes,
              allTransformers: sanitized.markdownTransformers,
            }),
          )
        } else {
          sanitized.markdownTransformers.push(transformer)
        }
      }
    }
    sanitized.enabledFeatures.push(feature.key)
  })

  // Apply custom group configurations to toolbarFixed groups
  if (Object.keys(customGroups).length > 0) {
    sanitized.toolbarFixed.groups = sanitized.toolbarFixed.groups.map((group) => {
      const customConfig = customGroups[group.key]
      if (customConfig) {
        return deepMerge(group, customConfig)
      }
      return group
    })
  }

  // Sort sanitized.toolbarInline.groups by order property
  sanitized.toolbarInline.groups.sort((a, b) => {
    if (a.order && b.order) {
      return a.order - b.order
    } else if (a.order) {
      return -1
    } else if (b.order) {
      return 1
    } else {
      return 0
    }
  })
  // Sort sanitized.toolbarFixed.groups by order property
  sanitized.toolbarFixed.groups.sort((a, b) => {
    if (a.order && b.order) {
      return a.order - b.order
    } else if (a.order) {
      return -1
    } else if (b.order) {
      return 1
    } else {
      return 0
    }
  })

  // Sort sanitized.toolbarInline.groups.[group].entries by order property
  for (const group of sanitized.toolbarInline.groups) {
    group.items.sort((a, b) => {
      if (a.order && b.order) {
        return a.order - b.order
      } else if (a.order) {
        return -1
      } else if (b.order) {
        return 1
      } else {
        return 0
      }
    })
  }

  // Sort sanitized.toolbarFixed.groups.[group].entries by order property
  for (const group of sanitized.toolbarFixed.groups) {
    group.items.sort((a, b) => {
      if (a.order && b.order) {
        return a.order - b.order
      } else if (a.order) {
        return -1
      } else if (b.order) {
        return 1
      } else {
        return 0
      }
    })
  }

  return sanitized
}

export function sanitizeClientEditorConfig(
  resolvedClientFeatureMap: ResolvedClientFeatureMap,
  lexical?: LexicalEditorConfig,
  admin?: LexicalFieldAdminClientProps,
): SanitizedClientEditorConfig {
  return {
    admin,
    features: sanitizeClientFeatures(resolvedClientFeatureMap),
    lexical: lexical!,
    resolvedFeatureMap: resolvedClientFeatureMap,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: default.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical/config/server/default.ts

```typescript
import type { EditorConfig as LexicalEditorConfig } from 'lexical'

import type { FeatureProviderServer } from '../../../features/typesServer.js'
import type { ServerEditorConfig } from '../types.js'

import { AlignFeature } from '../../../features/align/server/index.js'
import { BlockquoteFeature } from '../../../features/blockquote/server/index.js'
import { BoldFeature } from '../../../features/format/bold/feature.server.js'
import { InlineCodeFeature } from '../../../features/format/inlineCode/feature.server.js'
import { ItalicFeature } from '../../../features/format/italic/feature.server.js'
import { StrikethroughFeature } from '../../../features/format/strikethrough/feature.server.js'
import { SubscriptFeature } from '../../../features/format/subscript/feature.server.js'
import { SuperscriptFeature } from '../../../features/format/superscript/feature.server.js'
import { UnderlineFeature } from '../../../features/format/underline/feature.server.js'
import { HeadingFeature } from '../../../features/heading/server/index.js'
import { HorizontalRuleFeature } from '../../../features/horizontalRule/server/index.js'
import { IndentFeature } from '../../../features/indent/server/index.js'
import { LinkFeature } from '../../../features/link/server/index.js'
import { ChecklistFeature } from '../../../features/lists/checklist/server/index.js'
import { OrderedListFeature } from '../../../features/lists/orderedList/server/index.js'
import { UnorderedListFeature } from '../../../features/lists/unorderedList/server/index.js'
import { ParagraphFeature } from '../../../features/paragraph/server/index.js'
import { RelationshipFeature } from '../../../features/relationship/server/index.js'
import { InlineToolbarFeature } from '../../../features/toolbars/inline/server/index.js'
import { UploadFeature } from '../../../features/upload/server/index.js'
import { LexicalEditorTheme } from '../../theme/EditorTheme.js'

export const defaultEditorLexicalConfig: LexicalEditorConfig = {
  namespace: 'lexical',
  theme: LexicalEditorTheme,
}

export const defaultEditorFeatures: FeatureProviderServer<any, any, any>[] = [
  BoldFeature(),
  ItalicFeature(),
  UnderlineFeature(),
  StrikethroughFeature(),
  SubscriptFeature(),
  SuperscriptFeature(),
  InlineCodeFeature(),
  ParagraphFeature(),
  HeadingFeature(),
  AlignFeature(),
  IndentFeature(),
  UnorderedListFeature(),
  OrderedListFeature(),
  ChecklistFeature(),
  LinkFeature(),
  RelationshipFeature(),
  BlockquoteFeature(),
  UploadFeature(),
  HorizontalRuleFeature(),
  InlineToolbarFeature(),
]

export const defaultEditorConfig: ServerEditorConfig = {
  features: defaultEditorFeatures,
  lexical: defaultEditorLexicalConfig,
}
```

--------------------------------------------------------------------------------

---[FILE: loader.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical/config/server/loader.ts

```typescript
import type { SanitizedConfig } from 'payload'

import type {
  FeatureProviderServer,
  ResolvedServerFeature,
  ResolvedServerFeatureMap,
  ServerFeatureProviderMap,
} from '../../../features/typesServer.js'
import type { ServerEditorConfig } from '../types.js'

type DependencyGraph = {
  [key: string]: {
    dependencies: string[]
    dependenciesPriority: string[]
    dependenciesSoft: string[]
    featureProvider: FeatureProviderServer<unknown, unknown, unknown>
  }
}

function createDependencyGraph(
  featureProviders: FeatureProviderServer<unknown, unknown, unknown>[],
): DependencyGraph {
  const graph: DependencyGraph = {}
  for (const fp of featureProviders) {
    graph[fp.key] = {
      dependencies: fp.dependencies || [],
      dependenciesPriority: fp.dependenciesPriority || [],
      dependenciesSoft: fp.dependenciesSoft || [],
      featureProvider: fp,
    }
  }
  return graph
}

function topologicallySortFeatures(
  featureProviders: FeatureProviderServer<unknown, unknown, unknown>[],
): FeatureProviderServer<unknown, unknown, unknown>[] {
  const graph = createDependencyGraph(featureProviders)
  const visited: { [key: string]: boolean } = {}
  const stack: FeatureProviderServer<unknown, unknown, unknown>[] = []

  for (const key in graph) {
    if (!visited[key]) {
      visit(graph, key, visited, stack)
    }
  }

  return stack.reverse()
}

function visit(
  graph: DependencyGraph,
  key: string,
  visited: { [key: string]: boolean },
  stack: FeatureProviderServer<unknown, unknown, unknown>[],
  currentPath: string[] = [],
) {
  if (!graph[key]) {
    throw new Error(`Feature key ${key} is not present in the dependency graph.`)
  }

  if (currentPath.includes(key)) {
    throw new Error(`Circular dependency detected: ${currentPath.join(' -> ')} -> ${key}`)
  }

  if (visited[key]) {
    return
  }

  visited[key] = true
  currentPath.push(key)

  // First process the hard priority dependencies
  for (const dep of graph[key].dependenciesPriority) {
    if (!visited[dep]) {
      visit(graph, dep, visited, stack, currentPath)
    }
  }

  // Then process the normal dependencies, but make sure to not violate hard dependencies
  for (const dep of graph[key].dependencies) {
    if (!visited[dep] && !graph[key].dependenciesPriority.includes(dep)) {
      visit(graph, dep, visited, stack, currentPath)
    }
  }

  // Then process the soft dependencies. Make sure to not violate hard and normal dependencies.
  for (const dep of graph[key].dependenciesSoft) {
    if (
      graph[dep] &&
      !visited[dep] &&
      !graph[key].dependenciesPriority.includes(dep) &&
      !graph[key].dependencies.includes(dep)
    ) {
      visit(graph, dep, visited, stack, currentPath)
    }
  }

  stack.push(graph[key].featureProvider)
  currentPath.pop()
}

export function sortFeaturesForOptimalLoading(
  featureProviders: FeatureProviderServer<unknown, unknown, unknown>[],
): FeatureProviderServer<unknown, unknown, unknown>[] {
  return topologicallySortFeatures(featureProviders)
}

export async function loadFeatures({
  config,
  isRoot,
  parentIsLocalized,
  unSanitizedEditorConfig,
}: {
  config: SanitizedConfig
  isRoot?: boolean
  parentIsLocalized: boolean
  unSanitizedEditorConfig: ServerEditorConfig
}): Promise<ResolvedServerFeatureMap> {
  // First remove all duplicate features. The LAST feature with a given key wins.
  unSanitizedEditorConfig.features = unSanitizedEditorConfig.features
    .reverse()
    .filter((f, i, arr) => {
      const firstIndex = arr.findIndex((f2) => f2.key === f.key)
      return firstIndex === i
    })
    .reverse()

  unSanitizedEditorConfig.features = sortFeaturesForOptimalLoading(unSanitizedEditorConfig.features)

  const featureProviderMap: ServerFeatureProviderMap = new Map(
    unSanitizedEditorConfig.features.map(
      (f) => [f.key, f] as [string, FeatureProviderServer<unknown, unknown, unknown>],
    ),
  )

  const resolvedFeatures: ResolvedServerFeatureMap = new Map()

  // Make sure all dependencies declared in the respective features exist
  let loaded = 0
  for (const featureProvider of unSanitizedEditorConfig.features) {
    if (!featureProvider.key) {
      throw new Error(
        `A Feature you've added does not have a key. Please add a key to the feature. This is used to uniquely identify the feature.`,
      )
    }
    if (featureProvider.dependencies?.length) {
      for (const dependencyKey of featureProvider.dependencies) {
        const found = unSanitizedEditorConfig.features.find((f) => f.key === dependencyKey)
        if (!found) {
          throw new Error(
            `Feature ${featureProvider.key} has a dependency ${dependencyKey} which does not exist.`,
          )
        }
      }
    }

    if (featureProvider.dependenciesPriority?.length) {
      for (const priorityDependencyKey of featureProvider.dependenciesPriority) {
        // look in the resolved features instead of the editorConfig.features, as a dependency requires the feature to be loaded before it, contrary to a soft-dependency
        const found = resolvedFeatures.get(priorityDependencyKey)
        if (!found) {
          const existsInEditorConfig = unSanitizedEditorConfig.features.find(
            (f) => f.key === priorityDependencyKey,
          )
          if (!existsInEditorConfig) {
            throw new Error(
              `Feature ${featureProvider.key} has a priority dependency ${priorityDependencyKey} which does not exist.`,
            )
          } else {
            throw new Error(
              `Feature ${featureProvider.key} has a priority dependency ${priorityDependencyKey} which is not loaded before it.`,
            )
          }
        }
      }
    }

    const feature =
      typeof featureProvider.feature === 'function'
        ? await featureProvider.feature({
            config,
            featureProviderMap,
            isRoot,
            parentIsLocalized,
            resolvedFeatures,
            unSanitizedEditorConfig,
          })
        : featureProvider.feature

    const resolvedFeature: ResolvedServerFeature<any, any> = feature as ResolvedServerFeature<
      any,
      any
    >

    // All these new properties would be added to the feature, as it's mutated. However, this does not cause any damage and allows
    // us to prevent an unnecessary spread operation.
    resolvedFeature.key = featureProvider.key
    resolvedFeature.order = loaded
    resolvedFeature.dependencies = featureProvider.dependencies!
    resolvedFeature.dependenciesPriority = featureProvider.dependenciesPriority!
    resolvedFeature.dependenciesSoft = featureProvider.dependenciesSoft!

    resolvedFeatures.set(featureProvider.key, resolvedFeature)

    loaded++
  }

  return resolvedFeatures
}
```

--------------------------------------------------------------------------------

---[FILE: sanitize.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical/config/server/sanitize.ts

```typescript
import type { SanitizedConfig } from 'payload'

import type {
  ResolvedServerFeatureMap,
  SanitizedServerFeatures,
} from '../../../features/typesServer.js'
import type { SanitizedServerEditorConfig, ServerEditorConfig } from '../types.js'

import { loadFeatures } from './loader.js'

export const sanitizeServerFeatures = (
  features: ResolvedServerFeatureMap,
): SanitizedServerFeatures => {
  const sanitized: SanitizedServerFeatures = {
    converters: {
      html: [],
    },
    enabledFeatures: [],
    generatedTypes: {
      modifyOutputSchemas: [],
    },
    getSubFields: new Map(),
    getSubFieldsData: new Map(),
    graphQLPopulationPromises: new Map(),
    hooks: {
      afterChange: [],
      afterRead: [],
      beforeChange: [],
      beforeValidate: [],
    },
    i18n: {},
    markdownTransformers: [],
    nodeHooks: {
      afterChange: new Map(),
      afterRead: new Map(),
      beforeChange: new Map(),
      beforeValidate: new Map(),
    },
    nodes: [],

    validations: new Map(),
  }

  if (!features?.size) {
    return sanitized
  }

  features.forEach((feature) => {
    if (feature?.generatedTypes?.modifyOutputSchema) {
      sanitized.generatedTypes.modifyOutputSchemas.push(feature.generatedTypes.modifyOutputSchema)
    }

    if (feature?.hooks?.beforeValidate?.length) {
      sanitized.hooks.beforeValidate = sanitized.hooks.beforeValidate?.concat(
        feature.hooks.beforeValidate,
      )
    }
    if (feature?.hooks?.beforeChange?.length) {
      sanitized.hooks.beforeChange = sanitized.hooks.beforeChange?.concat(
        feature.hooks.beforeChange,
      )
    }
    if (feature?.hooks?.afterRead?.length) {
      sanitized.hooks.afterRead = sanitized.hooks.afterRead?.concat(feature.hooks.afterRead)
    }
    if (feature?.hooks?.afterChange?.length) {
      sanitized.hooks.afterChange = sanitized.hooks.afterChange?.concat(feature.hooks.afterChange)
    }

    if (feature?.i18n) {
      for (const lang in feature.i18n) {
        if (!sanitized.i18n[lang as keyof typeof sanitized.i18n]) {
          sanitized.i18n[lang as keyof typeof sanitized.i18n] = {
            lexical: {},
          }
        }
        // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
        sanitized.i18n[lang].lexical[feature.key] = feature.i18n[lang]
      }
    }

    if (feature.nodes?.length) {
      // Do not concat here. We need to keep the object reference of sanitized.nodes so that function markdown transformers of features automatically get the updated nodes
      for (const node of feature.nodes) {
        sanitized.nodes.push(node)
      }
      feature.nodes.forEach((node) => {
        const nodeType = 'with' in node.node ? node.node.replace.getType() : node.node.getType() // TODO: Idk if this works for node replacements
        if (node?.graphQLPopulationPromises?.length) {
          sanitized.graphQLPopulationPromises.set(nodeType, node.graphQLPopulationPromises)
        }
        if (node?.validations?.length) {
          sanitized.validations.set(nodeType, node.validations)
        }
        if (node?.converters?.html) {
          sanitized.converters.html.push(node.converters.html)
        }
        if (node?.hooks?.afterChange) {
          sanitized.nodeHooks?.afterChange?.set(nodeType, node.hooks.afterChange)
        }
        if (node?.hooks?.afterRead) {
          sanitized.nodeHooks?.afterRead?.set(nodeType, node.hooks.afterRead)
        }
        if (node?.hooks?.beforeChange) {
          sanitized.nodeHooks?.beforeChange?.set(nodeType, node.hooks.beforeChange)
        }
        if (node?.hooks?.beforeValidate) {
          sanitized.nodeHooks?.beforeValidate?.set(nodeType, node.hooks.beforeValidate)
        }
        if (node?.getSubFields) {
          sanitized.getSubFields?.set(nodeType, node.getSubFields)
        }
        if (node?.getSubFieldsData) {
          sanitized.getSubFieldsData?.set(nodeType, node.getSubFieldsData)
        }
      })
    }

    if (feature.markdownTransformers?.length) {
      // Do not concat here. We need to keep the object reference of feature.markdownTransformers

      for (const transformer of feature.markdownTransformers) {
        if (typeof transformer === 'function') {
          sanitized.markdownTransformers.push(
            transformer({
              allNodes: sanitized.nodes,
              allTransformers: sanitized.markdownTransformers,
            }),
          )
        } else {
          sanitized.markdownTransformers.push(transformer)
        }
      }
    }

    sanitized.enabledFeatures.push(feature.key)
  })

  return sanitized
}

export async function sanitizeServerEditorConfig(
  editorConfig: ServerEditorConfig,
  config: SanitizedConfig,
  parentIsLocalized?: boolean,
): Promise<SanitizedServerEditorConfig> {
  const resolvedFeatureMap = await loadFeatures({
    config,
    parentIsLocalized: parentIsLocalized!,
    unSanitizedEditorConfig: editorConfig,
  })

  return {
    features: sanitizeServerFeatures(resolvedFeatureMap),
    lexical: editorConfig.lexical!,
    resolvedFeatureMap,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical/nodes/index.ts

```typescript
import type { Klass, LexicalNode, LexicalNodeReplacement } from 'lexical'

import type { NodeWithHooks } from '../../features/typesServer.js'
import type { SanitizedClientEditorConfig, SanitizedServerEditorConfig } from '../config/types.js'

export function getEnabledNodes({
  editorConfig,
}: {
  editorConfig: SanitizedClientEditorConfig | SanitizedServerEditorConfig
}): Array<Klass<LexicalNode> | LexicalNodeReplacement> {
  return getEnabledNodesFromServerNodes({
    nodes: editorConfig.features.nodes,
  })
}

export function getEnabledNodesFromServerNodes({
  nodes,
}: {
  nodes: Array<Klass<LexicalNode> | LexicalNodeReplacement> | Array<NodeWithHooks>
}): Array<Klass<LexicalNode> | LexicalNodeReplacement> {
  return nodes.map((node) => {
    if ('node' in node) {
      return node.node
    }
    return node
  })
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/lexical/plugins/ClipboardPlugin/index.tsx
Signals: React

```typescript
'use client'

import { copyToClipboard } from '@lexical/clipboard'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.js'
import { objectKlassEquals } from '@lexical/utils'
import ObjectID from 'bson-objectid'
import { $getSelection, $isNodeSelection, COMMAND_PRIORITY_LOW, COPY_COMMAND } from 'lexical'
import { useEffect } from 'react'

type SerializedUnknownLexicalNode = {
  children?: SerializedUnknownLexicalNode[]
  type: string
}

type LexicalClipboardData = {
  namespace: string
  nodes: SerializedUnknownLexicalNode[]
}

const changeIds = (node: SerializedUnknownLexicalNode) => {
  if (
    'fields' in node &&
    typeof node.fields === 'object' &&
    node.fields !== null &&
    'id' in node.fields
  ) {
    node.fields.id = new ObjectID.default().toHexString()
  } else if ('id' in node) {
    node.id = new ObjectID.default().toHexString()
  }

  if (node.children) {
    for (const child of node.children) {
      changeIds(child)
    }
  }
}

export function ClipboardPlugin() {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    // Remove duplicated ids from clipboard. We do it here because:
    // 1. Browsers do not allow setting the clipboardData in paste event for security reasons.
    // 2. If you cut instead of paste, the id will be kept, which is a good thing.
    return editor.registerCommand(
      COPY_COMMAND,
      (event) => {
        // Handle decorator node case
        const selection = $getSelection()
        if ($isNodeSelection(selection)) {
          const node = selection.getNodes()[0]

          const serializedNode = node?.exportJSON() as SerializedUnknownLexicalNode
          const deepCloneSerializedNode = JSON.parse(JSON.stringify(serializedNode))
          changeIds(deepCloneSerializedNode)

          const lexicalClipboardData: LexicalClipboardData = {
            namespace: editor._config.namespace,
            nodes: [deepCloneSerializedNode],
          }

          const stringifiedLexicalClipboardData = JSON.stringify(lexicalClipboardData)

          copyToClipboard(editor, null, {
            'application/x-lexical-editor': stringifiedLexicalClipboardData,
            'text/plain': '',
          }).catch((error) => {
            throw error
          })
          return true
        }

        // Handle range selection case
        copyToClipboard(editor, objectKlassEquals(event, ClipboardEvent) ? event : null)
          .then(() => {
            if (!(event instanceof ClipboardEvent) || !event.clipboardData) {
              throw new Error('No clipboard event')
            }
            const lexicalStringified = event.clipboardData.getData('application/x-lexical-editor')
            if (!lexicalStringified) {
              return true
            }

            const lexical = JSON.parse(lexicalStringified) as {
              nodes: SerializedUnknownLexicalNode[]
            }

            for (const node of lexical.nodes) {
              changeIds(node)
            }
            const stringified = JSON.stringify(lexical)
            event.clipboardData.setData('application/x-lexical-editor', stringified)
          })
          .catch((error) => {
            if (event instanceof ClipboardEvent) {
              event.clipboardData?.setData('application/x-lexical-editor', '')
            }
            throw error
          })
        return true
      },
      COMMAND_PRIORITY_LOW,
    )
  }, [editor])

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/richtext-lexical/src/lexical/plugins/DecoratorPlugin/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  [data-lexical-decorator='true'] {
    width: fit-content;
    border-radius: $style-radius-m;
  }

  .decorator-selected {
    box-shadow: $focus-box-shadow !important;
    outline: none !important;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/lexical/plugins/DecoratorPlugin/index.tsx
Signals: React

```typescript
'use client'

import type { DecoratorNode, ElementNode, LexicalNode } from 'lexical'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $findMatchingParent, mergeRegister } from '@lexical/utils'
import {
  $createNodeSelection,
  $getEditor,
  $getNearestNodeFromDOMNode,
  $getSelection,
  $isDecoratorNode,
  $isElementNode,
  $isLineBreakNode,
  $isNodeSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  $isTextNode,
  $setSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  KEY_ARROW_DOWN_COMMAND,
  KEY_ARROW_UP_COMMAND,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from 'lexical'
import { useEffect } from 'react'

import './index.scss'

// TODO: This should ideally be fixed in Lexical. See
// https://github.com/facebook/lexical/pull/7072
export function DecoratorPlugin() {
  const [editor] = useLexicalComposerContext()

  const $onDelete = (event: KeyboardEvent) => {
    const selection = $getSelection()
    if (!$isNodeSelection(selection)) {
      return false
    }
    event.preventDefault()
    selection.getNodes().forEach((node) => {
      node.remove()
    })
    return true
  }

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        CLICK_COMMAND,
        (event) => {
          document.querySelector('.decorator-selected')?.classList.remove('decorator-selected')
          const decorator = $getDecoratorByMouseEvent(event)
          if (!decorator) {
            return true
          }
          const { target } = event
          const isInteractive =
            !(target instanceof HTMLElement) ||
            target.isContentEditable ||
            target.closest(
              'button, textarea, input, .react-select, .code-editor, .no-select-decorator, [role="button"]',
            )
          if (isInteractive) {
            $setSelection(null)
          } else {
            $selectDecorator(decorator)
          }
          return true
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(KEY_DELETE_COMMAND, $onDelete, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_BACKSPACE_COMMAND, $onDelete, COMMAND_PRIORITY_LOW),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          const decorator = $getSelectedDecorator()
          document.querySelector('.decorator-selected')?.classList.remove('decorator-selected')
          if (decorator) {
            decorator.element?.classList.add('decorator-selected')
            return true
          }
          return false
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_ARROW_UP_COMMAND,
        (event) => {
          // CASE 1: Node selection
          const selection = $getSelection()
          if ($isNodeSelection(selection)) {
            const prevSibling = selection.getNodes()[0]?.getPreviousSibling()
            if ($isDecoratorNode(prevSibling)) {
              const element = $getEditor().getElementByKey(prevSibling.getKey())
              if (element) {
                $selectDecorator({ element, node: prevSibling })
                event.preventDefault()
                return true
              }
              return false
            }
            if (!$isElementNode(prevSibling)) {
              return false
            }
            const lastDescendant = prevSibling.getLastDescendant() ?? prevSibling
            if (!lastDescendant) {
              return false
            }
            const block = $findMatchingParent(lastDescendant, INTERNAL_$isBlock)
            block?.selectStart()
            event.preventDefault()
            return true
          }
          if (!$isRangeSelection(selection)) {
            return false
          }

          // CASE 2: Range selection
          // Get first selected block
          const firstPoint = selection.isBackward() ? selection.anchor : selection.focus
          const firstNode = firstPoint.getNode()
          const firstSelectedBlock = $findMatchingParent(firstNode, (node) => {
            return findFirstSiblingBlock(node) !== null
          })
          const prevBlock = firstSelectedBlock?.getPreviousSibling()
          if (!firstSelectedBlock || prevBlock !== findFirstSiblingBlock(firstSelectedBlock)) {
            return false
          }

          if ($isDecoratorNode(prevBlock)) {
            const prevBlockElement = $getEditor().getElementByKey(prevBlock.getKey())
            if (prevBlockElement) {
              $selectDecorator({ element: prevBlockElement, node: prevBlock })
              event.preventDefault()
              return true
            }
          }

          return false
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_ARROW_DOWN_COMMAND,
        (event) => {
          // CASE 1: Node selection
          const selection = $getSelection()
          if ($isNodeSelection(selection)) {
            event.preventDefault()
            const nextSibling = selection.getNodes()[0]?.getNextSibling()
            if ($isDecoratorNode(nextSibling)) {
              const element = $getEditor().getElementByKey(nextSibling.getKey())
              if (element) {
                $selectDecorator({ element, node: nextSibling })
              }
              return true
            }
            if (!$isElementNode(nextSibling)) {
              return true
            }
            const firstDescendant = nextSibling.getFirstDescendant() ?? nextSibling
            if (!firstDescendant) {
              return true
            }
            const block = $findMatchingParent(firstDescendant, INTERNAL_$isBlock)
            block?.selectEnd()
            event.preventDefault()
            return true
          }
          if (!$isRangeSelection(selection)) {
            return false
          }

          // CASE 2: Range selection
          // Get last selected block
          const lastPoint = selection.isBackward() ? selection.anchor : selection.focus
          const lastNode = lastPoint.getNode()
          const lastSelectedBlock = $findMatchingParent(lastNode, (node) => {
            return findLaterSiblingBlock(node) !== null
          })
          const nextBlock = lastSelectedBlock?.getNextSibling()
          if (!lastSelectedBlock || nextBlock !== findLaterSiblingBlock(lastSelectedBlock)) {
            return false
          }

          if ($isDecoratorNode(nextBlock)) {
            const nextBlockElement = $getEditor().getElementByKey(nextBlock.getKey())
            if (nextBlockElement) {
              $selectDecorator({ element: nextBlockElement, node: nextBlock })
              event.preventDefault()
              return true
            }
          }

          return false
        },
        COMMAND_PRIORITY_LOW,
      ),
    )
  }, [editor])

  return null
}

function $getDecoratorByMouseEvent(
  event: MouseEvent,
): { element: HTMLElement; node: DecoratorNode<unknown> } | undefined {
  if (!(event.target instanceof HTMLElement)) {
    return undefined
  }
  const element = event.target.closest('[data-lexical-decorator="true"]')
  if (!(element instanceof HTMLElement)) {
    return undefined
  }
  const node = $getNearestNodeFromDOMNode(element)
  return $isDecoratorNode(node) ? { element, node } : undefined
}

function $getSelectedDecorator() {
  const selection = $getSelection()
  if (!$isNodeSelection(selection)) {
    return undefined
  }
  const nodes = selection.getNodes()
  if (nodes.length !== 1) {
    return undefined
  }
  const node = nodes[0]
  return $isDecoratorNode(node)
    ? {
        decorator: node,
        element: $getEditor().getElementByKey(node.getKey()),
      }
    : undefined
}

function $selectDecorator({
  element,
  node,
}: {
  element: HTMLElement
  node: DecoratorNode<unknown>
}) {
  document.querySelector('.decorator-selected')?.classList.remove('decorator-selected')
  const selection = $createNodeSelection()
  selection.add(node.getKey())
  $setSelection(selection)
  element.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  element.classList.add('decorator-selected')
}

/**
 * Copied from https://github.com/facebook/lexical/blob/main/packages/lexical/src/LexicalUtils.ts
 *
 * This function returns true for a DecoratorNode that is not inline OR
 * an ElementNode that is:
 * - not a root or shadow root
 * - not inline
 * - can't be empty
 * - has no children or an inline first child
 */
export function INTERNAL_$isBlock(node: LexicalNode): node is DecoratorNode<unknown> | ElementNode {
  if ($isDecoratorNode(node) && !node.isInline()) {
    return true
  }
  if (!$isElementNode(node) || $isRootOrShadowRoot(node)) {
    return false
  }

  const firstChild = node.getFirstChild()
  const isLeafElement =
    firstChild === null ||
    $isLineBreakNode(firstChild) ||
    $isTextNode(firstChild) ||
    firstChild.isInline()

  return !node.isInline() && node.canBeEmpty() !== false && isLeafElement
}

function findLaterSiblingBlock(node: LexicalNode): LexicalNode | null {
  let current = node.getNextSibling()
  while (current !== null) {
    if (INTERNAL_$isBlock(current)) {
      return current
    }
    current = current.getNextSibling()
  }
  return null
}

function findFirstSiblingBlock(node: LexicalNode): LexicalNode | null {
  let current = node.getPreviousSibling()
  while (current !== null) {
    if (INTERNAL_$isBlock(current)) {
      return current
    }
    current = current.getPreviousSibling()
  }
  return null
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/richtext-lexical/src/lexical/plugins/handles/AddBlockHandlePlugin/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .add-block-menu {
    all: unset; // reset all default button styles
    border-radius: $style-radius-m;
    padding: 0;
    cursor: pointer;
    opacity: 0;
    position: absolute;
    left: 0;
    top: 0;
    will-change: transform;

    &:hover {
      background-color: var(--theme-elevation-100);
      .icon {
        opacity: 1;
      }
    }

    .icon {
      width: 18px;
      height: 24px;
      opacity: 0.3;
      background-image: url(../../../ui/icons/Add/index.svg);
    }

    html[data-theme='dark'] & {
      .icon {
        background-image: url(../../../ui/icons/Add/light.svg);
      }
    }
  }
}
```

--------------------------------------------------------------------------------

````
