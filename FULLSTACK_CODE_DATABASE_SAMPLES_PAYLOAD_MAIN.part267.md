---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 267
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 267 of 695)

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

---[FILE: typesClient.ts]---
Location: payload-main/packages/richtext-lexical/src/features/typesClient.ts
Signals: React

```typescript
import type {
  Klass,
  LexicalEditor,
  LexicalNode,
  LexicalNodeReplacement,
  TextFormatType,
} from 'lexical'
import type { ClientConfig, RichTextFieldClient } from 'payload'
import type React from 'react'
import type { JSX } from 'react'

import type { ClientEditorConfig } from '../lexical/config/types.js'
import type { SlashMenuGroup } from '../lexical/plugins/SlashMenu/LexicalTypeaheadMenuPlugin/types.js'
import type { Transformer } from '../packages/@lexical/markdown/index.js'
import type { FeatureClientSchemaMap } from '../types.js'
import type { ToolbarGroup } from './toolbars/types.js'

export type FeatureProviderProviderClient<
  UnSanitizedClientFeatureProps = undefined,
  ClientFeatureProps = UnSanitizedClientFeatureProps,
> = (props: BaseClientFeatureProps<ClientFeatureProps>) => FeatureProviderClient<ClientFeatureProps>

/**
 * No dependencies => Features need to be sorted on the server first, then sent to client in right order
 */
export type FeatureProviderClient<
  UnSanitizedClientFeatureProps = undefined,
  ClientFeatureProps = UnSanitizedClientFeatureProps,
> = {
  /**
   * Return props, to make it easy to retrieve passed in props to this Feature for the client if anyone wants to
   */
  clientFeatureProps: BaseClientFeatureProps<UnSanitizedClientFeatureProps>
  feature:
    | ((props: {
        config: ClientConfig
        featureClientImportMap: Record<string, any>
        featureClientSchemaMap: FeatureClientSchemaMap
        /** unSanitizedEditorConfig.features, but mapped */
        featureProviderMap: ClientFeatureProviderMap
        field?: RichTextFieldClient
        // other resolved features, which have been loaded before this one. All features declared in 'dependencies' should be available here
        resolvedFeatures: ResolvedClientFeatureMap
        schemaPath: string
        // unSanitized EditorConfig,
        unSanitizedEditorConfig: ClientEditorConfig
      }) => ClientFeature<ClientFeatureProps>)
    | ClientFeature<ClientFeatureProps>
}

export type PluginComponent<ClientFeatureProps = any> = React.FC<{
  clientProps: ClientFeatureProps
}>
export type PluginComponentWithAnchor<ClientFeatureProps = any> = React.FC<{
  anchorElem: HTMLElement
  clientProps: ClientFeatureProps
}>

/**
 * Plugins are react components which get added to the editor. You can use them to interact with lexical, e.g. to create a command which creates a node, or opens a modal, or some other more "outside" functionality
 */
export type SanitizedPlugin =
  | {
      clientProps: any
      // plugins are anything which is not directly part of the editor. Like, creating a command which creates a node, or opens a modal, or some other more "outside" functionality
      Component: PluginComponent
      key: string
      position: 'bottom' // Determines at which position the Component will be added.
    }
  | {
      clientProps: any
      // plugins are anything which is not directly part of the editor. Like, creating a command which creates a node, or opens a modal, or some other more "outside" functionality
      Component: PluginComponent
      key: string
      position: 'normal' // Determines at which position the Component will be added.
    }
  | {
      clientProps: any
      // plugins are anything which is not directly part of the editor. Like, creating a command which creates a node, or opens a modal, or some other more "outside" functionality
      Component: PluginComponent
      key: string
      position: 'top' // Determines at which position the Component will be added.
    }
  | {
      clientProps: any
      // plugins are anything which is not directly part of the editor. Like, creating a command which creates a node, or opens a modal, or some other more "outside" functionality
      Component: PluginComponentWithAnchor
      desktopOnly?: boolean
      key: string
      position: 'floatingAnchorElem' // Determines at which position the Component will be added.
    }
  | {
      clientProps: any
      Component: PluginComponent
      key: string
      position: 'aboveContainer'
    }
  | {
      clientProps: any
      Component: PluginComponent
      key: string
      position: 'belowContainer'
    }

export type ClientFeature<ClientFeatureProps> = {
  /**
   * The text formats which are enabled by this feature.
   */
  enableFormats?: TextFormatType[]
  markdownTransformers?: (
    | ((props: {
        allNodes: Array<Klass<LexicalNode> | LexicalNodeReplacement>
        allTransformers: Transformer[]
      }) => Transformer)
    | Transformer
  )[]
  nodes?: Array<Klass<LexicalNode> | LexicalNodeReplacement>
  /**
   * Plugins are react components which get added to the editor. You can use them to interact with lexical, e.g. to create a command which creates a node, or opens a modal, or some other more "outside" functionality
   */
  plugins?: Array<
    | {
        // plugins are anything which is not directly part of the editor. Like, creating a command which creates a node, or opens a modal, or some other more "outside" functionality
        Component: PluginComponent<ClientFeatureProps>
        position: 'aboveContainer' // Determines at which position the Component will be added.
      }
    | {
        // plugins are anything which is not directly part of the editor. Like, creating a command which creates a node, or opens a modal, or some other more "outside" functionality
        Component: PluginComponent<ClientFeatureProps>
        position: 'bottom' // Determines at which position the Component will be added.
      }
    | {
        // plugins are anything which is not directly part of the editor. Like, creating a command which creates a node, or opens a modal, or some other more "outside" functionality
        Component: PluginComponent<ClientFeatureProps>
        position: 'normal' // Determines at which position the Component will be added.
      }
    | {
        // plugins are anything which is not directly part of the editor. Like, creating a command which creates a node, or opens a modal, or some other more "outside" functionality
        Component: PluginComponent<ClientFeatureProps>
        position: 'top' // Determines at which position the Component will be added.
      }
    | {
        // plugins are anything which is not directly part of the editor. Like, creating a command which creates a node, or opens a modal, or some other more "outside" functionality
        Component: PluginComponentWithAnchor<ClientFeatureProps>
        position: 'floatingAnchorElem' // Determines at which position the Component will be added.
      }
    | {
        Component: PluginComponent<ClientFeatureProps>
        position: 'belowContainer' // Determines at which position the Component will be added.
      }
  >
  /**
   * Client Features can register their own providers, which will be nested below the EditorConfigProvider
   */
  providers?: Array<React.FC<{ children: JSX.Element }>>
  /**
   * Return props, to make it easy to retrieve passed in props to this Feature for the client if anyone wants to
   */
  sanitizedClientFeatureProps?: BaseClientFeatureProps<ClientFeatureProps>
  slashMenu?: {
    /**
     * Dynamic groups allow you to add different groups depending on the query string (so, the text after the slash).
     * Thus, to re-calculate the available groups, this function will be called every time you type after the /.
     *
     * The groups provided by dynamicGroups will be merged with the static groups provided by the groups property.
     */
    dynamicGroups?: ({
      editor,
      queryString,
    }: {
      editor: LexicalEditor
      queryString: string
    }) => SlashMenuGroup[]
    /**
     * Static array of groups together with the items in them. These will always be present.
     * While typing after the /, they will be filtered by the query string and the keywords, key and display name of the items.
     */
    groups?: SlashMenuGroup[]
  }
  /**
   * An opt-in, classic fixed toolbar which stays at the top of the editor
   */
  toolbarFixed?: {
    groups: ToolbarGroup[]
  }
  /**
   * The default, floating toolbar which appears when you select text.
   */
  toolbarInline?: {
    /**
     * Array of toolbar groups / sections. Each section can contain multiple toolbar items.
     */
    groups: ToolbarGroup[]
  }
}

export type BaseClientFeatureProps<ClientFeatureProps> = ClientFeatureProps extends undefined
  ? {
      featureKey: string
      order: number
    }
  : {
      featureKey: string
      order: number
    } & ClientFeatureProps

export type ResolvedClientFeature<ClientFeatureProps> = {
  key: string
  order: number
} & ClientFeature<ClientFeatureProps>

export type ResolvedClientFeatureMap = Map<string, ResolvedClientFeature<any>>

export type ClientFeatureProviderMap = Map<string, FeatureProviderClient<any, any>>

export type SanitizedClientFeatures = {
  /** The keys of all enabled features */
  enabledFeatures: string[]
  enabledFormats: TextFormatType[]
  markdownTransformers: Transformer[]

  /**
   * Plugins are react components which get added to the editor. You can use them to interact with lexical, e.g. to create a command which creates a node, or opens a modal, or some other more "outside" functionality
   */
  plugins?: Array<SanitizedPlugin>
  slashMenu: {
    /**
     * Dynamic groups allow you to add different groups depending on the query string (so, the text after the slash).
     * Thus, to re-calculate the available groups, this function will be called every time you type after the /.
     *
     * The groups provided by dynamicGroups will be merged with the static groups provided by the groups property.
     */
    dynamicGroups: Array<
      ({ editor, queryString }: { editor: LexicalEditor; queryString: string }) => SlashMenuGroup[]
    >
    /**
     * Static array of groups together with the items in them. These will always be present.
     * While typing after the /, they will be filtered by the query string and the keywords, key and display name of the items.
     */
    groups: SlashMenuGroup[]
  }
} & Required<
  Pick<ResolvedClientFeature<unknown>, 'nodes' | 'providers' | 'toolbarFixed' | 'toolbarInline'>
>
```

--------------------------------------------------------------------------------

---[FILE: typesServer.ts]---
Location: payload-main/packages/richtext-lexical/src/features/typesServer.ts

```typescript
import type { GenericLanguages, I18n, I18nClient } from '@payloadcms/translations'
import type { JSONSchema4 } from 'json-schema'
import type {
  Klass,
  LexicalNode,
  LexicalNodeReplacement,
  SerializedEditorState,
  SerializedLexicalNode,
} from 'lexical'
import type {
  Field,
  FieldSchemaMap,
  ImportMapGenerators,
  JsonObject,
  PayloadComponent,
  PayloadRequest,
  PopulateType,
  ReplaceAny,
  RequestContext,
  RichTextField,
  RichTextHooks,
  SanitizedConfig,
  TypedFallbackLocale,
  ValidateOptions,
  ValidationFieldError,
} from 'payload'

import type { ServerEditorConfig } from '../lexical/config/types.js'
import type { Transformer } from '../packages/@lexical/markdown/index.js'
import type { LexicalRichTextField } from '../types.js'
import type { HTMLConverter } from './converters/lexicalToHtml_deprecated/converter/types.js'
import type { BaseClientFeatureProps } from './typesClient.js'

export type PopulationPromise<T extends SerializedLexicalNode = SerializedLexicalNode> = (args: {
  context: RequestContext
  currentDepth: number
  depth: number
  draft: boolean
  /**
   * This maps all population promises to the node type
   */
  editorPopulationPromises: Map<string, Array<PopulationPromise>>
  field: LexicalRichTextField
  /**
   * fieldPromises are used for things like field hooks. They will be awaited before awaiting populationPromises
   */
  fieldPromises: Promise<void>[]
  findMany: boolean
  flattenLocales: boolean
  node: T
  overrideAccess: boolean
  parentIsLocalized: boolean
  populationPromises: Promise<void>[]
  req: PayloadRequest
  showHiddenFields: boolean
  siblingDoc: JsonObject
}) => void

export type NodeValidation<T extends SerializedLexicalNode = SerializedLexicalNode> = ({
  node,
  nodeValidations,
  validation,
}: {
  node: T
  nodeValidations: Map<string, Array<NodeValidation>>
  validation: {
    options: ValidateOptions<unknown, unknown, RichTextField, SerializedEditorState>
    value: SerializedEditorState
  }
}) => Promise<string | true> | string | true

export type FeatureProviderProviderServer<
  UnSanitizedServerFeatureProps = undefined,
  ServerFeatureProps = UnSanitizedServerFeatureProps,
  ClientFeatureProps = undefined,
> = (
  props?: UnSanitizedServerFeatureProps,
) => FeatureProviderServer<UnSanitizedServerFeatureProps, ServerFeatureProps, ClientFeatureProps>

export type FeatureProviderServer<
  UnSanitizedServerFeatureProps = undefined,
  ServerFeatureProps = UnSanitizedServerFeatureProps,
  ClientFeatureProps = undefined,
> = {
  /** Keys of dependencies needed for this feature. These dependencies do not have to be loaded first, but they have to exist, otherwise an error will be thrown. */
  dependencies?: string[]
  /**  Keys of priority dependencies needed for this feature. These dependencies have to be loaded first AND have to exist, otherwise an error will be thrown. They will be available in the `feature` property. */
  dependenciesPriority?: string[]
  /** Keys of soft-dependencies needed for this feature. These are optional. Payload will attempt to load them before this feature, but doesn't throw an error if that's not possible. */
  dependenciesSoft?: string[]

  /**
   * This is being called during the payload sanitization process
   */
  feature:
    | ((props: {
        config: SanitizedConfig
        /** unSanitizedEditorConfig.features, but mapped */
        featureProviderMap: ServerFeatureProviderMap
        isRoot?: boolean
        parentIsLocalized: boolean
        // other resolved features, which have been loaded before this one. All features declared in 'dependencies' should be available here
        resolvedFeatures: ResolvedServerFeatureMap
        // unSanitized EditorConfig,
        unSanitizedEditorConfig: ServerEditorConfig
      }) =>
        | Promise<ServerFeature<ServerFeatureProps, ClientFeatureProps>>
        | ServerFeature<ServerFeatureProps, ClientFeatureProps>)
    | ServerFeature<ServerFeatureProps, ClientFeatureProps>
  key: string
  /** Props which were passed into your feature will have to be passed here. This will allow them to be used / read in other places of the code, e.g. wherever you can use useEditorConfigContext */
  serverFeatureProps: UnSanitizedServerFeatureProps
}

export type AfterReadNodeHookArgs<T extends SerializedLexicalNode> = {
  /**
   * Only available in `afterRead` hooks.
   */
  currentDepth: number
  /**
   * Only available in `afterRead` hooks.
   */
  depth: number
  draft: boolean
  fallbackLocale: TypedFallbackLocale
  /**
   *  Only available in `afterRead` field hooks.
   */
  fieldPromises: Promise<void>[]
  /** Boolean to denote if this hook is running against finding one, or finding many within the afterRead hook. */
  findMany: boolean
  flattenLocales: boolean
  /**
   * The requested locale.
   */
  locale: string
  overrideAccess: boolean
  /**
   * Only available in `afterRead` hooks.
   */
  populateArg?: PopulateType
  /**
   *  Only available in `afterRead` field hooks.
   */
  populationPromises: Promise<void>[]
  /**
   * Only available in `afterRead` hooks.
   */
  showHiddenFields: boolean
  /**
   * Only available in `afterRead` hooks.
   */
  triggerAccessControl: boolean
  /**
   * Only available in `afterRead` hooks.
   */
  triggerHooks: boolean
}

export type AfterChangeNodeHookArgs<T extends SerializedLexicalNode> = {
  /** A string relating to which operation the field type is currently executing within. Useful within beforeValidate, beforeChange, and afterChange hooks to differentiate between create and update operations. */
  operation: 'create' | 'delete' | 'read' | 'update'
  /** The value of the node before any changes. Not available in afterRead hooks */
  originalNode: T
  previousNode: T
}
export type BeforeValidateNodeHookArgs<T extends SerializedLexicalNode> = {
  /** A string relating to which operation the field type is currently executing within. Useful within beforeValidate, beforeChange, and afterChange hooks to differentiate between create and update operations. */
  operation: 'create' | 'delete' | 'read' | 'update'
  /** The value of the node before any changes. Not available in afterRead hooks */
  originalNode: T
  overrideAccess: boolean
}

export type BeforeChangeNodeHookArgs<T extends SerializedLexicalNode> = {
  /**
   * Only available in `beforeChange` hooks.
   */
  errors: ValidationFieldError[]
  mergeLocaleActions: (() => Promise<void> | void)[]
  /** A string relating to which operation the field type is currently executing within. Useful within beforeValidate, beforeChange, and afterChange hooks to differentiate between create and update operations. */
  operation: 'create' | 'delete' | 'read' | 'update'
  /** The value of the node before any changes. Not available in afterRead hooks */
  originalNode: T
  /**
   * The original node with locales (not modified by any hooks).
   */
  originalNodeWithLocales?: T
  previousNode: T

  skipValidation: boolean
}

export type BaseNodeHookArgs<T extends SerializedLexicalNode> = {
  context: RequestContext
  /** The value of the node. */
  node: T
  parentRichTextFieldPath: (number | string)[]
  parentRichTextFieldSchemaPath: string[]
  /** The payload request object. It is mocked for Local API operations. */
  req: PayloadRequest
}

export type AfterReadNodeHook<T extends SerializedLexicalNode> = (
  args: AfterReadNodeHookArgs<T> & BaseNodeHookArgs<T>,
) => Promise<T> | T

export type AfterChangeNodeHook<T extends SerializedLexicalNode> = (
  args: AfterChangeNodeHookArgs<T> & BaseNodeHookArgs<T>,
) => Promise<T> | T

export type BeforeChangeNodeHook<T extends SerializedLexicalNode> = (
  args: BaseNodeHookArgs<T> & BeforeChangeNodeHookArgs<T>,
) => Promise<T> | T

export type BeforeValidateNodeHook<T extends SerializedLexicalNode> = (
  args: BaseNodeHookArgs<T> & BeforeValidateNodeHookArgs<T>,
) => Promise<T> | T

// Define the node with hooks that use the node's exportJSON return type
export type NodeWithHooks<T extends LexicalNode = any> = {
  /**
   * Allows you to define how a node can be serialized into different formats. Currently, only supports html.
   * Markdown converters are defined in `markdownTransformers` and not here.
   *
   * @deprecated - will be removed in 4.0
   */
  converters?: {
    /**
     * @deprecated - will be removed in 4.0
     */
    html?: HTMLConverter<ReturnType<ReplaceAny<T, LexicalNode>['exportJSON']>>
  }
  /**
   * If a node includes sub-fields (e.g. block and link nodes), passing those subFields here will make payload
   * automatically populate, run hooks, and generate component import maps for them
   */
  getSubFields?: (args: {
    /**
     * Optional. If not provided, all possible sub-fields should be returned.
     */
    node?: ReturnType<ReplaceAny<T, LexicalNode>['exportJSON']>
    req?: PayloadRequest
  }) => Field[] | null
  /**
   * If a node includes sub-fields, the sub-fields data needs to be returned here, alongside `getSubFields` which returns their schema.
   */
  getSubFieldsData?: (args: {
    node: ReturnType<ReplaceAny<T, LexicalNode>['exportJSON']>
    req: PayloadRequest
  }) => JsonObject
  /**
   * Allows you to run population logic when a node's data was requested from graphQL.
   * While `getSubFields` and `getSubFieldsData` automatically handle populating sub-fields (since they run hooks on them), those are only populated in the Rest API.
   * This is because the Rest API hooks do not have access to the 'depth' property provided by graphQL.
   * In order for them to be populated correctly in graphQL, the population logic needs to be provided here.
   */
  graphQLPopulationPromises?: Array<
    PopulationPromise<ReturnType<ReplaceAny<T, LexicalNode>['exportJSON']>>
  >
  /**
   * Just like payload fields, you can provide hooks which are run for this specific node. These are called Node Hooks.
   */
  hooks?: {
    afterChange?: Array<AfterChangeNodeHook<ReturnType<ReplaceAny<T, LexicalNode>['exportJSON']>>>
    afterRead?: Array<AfterReadNodeHook<ReturnType<ReplaceAny<T, LexicalNode>['exportJSON']>>>
    beforeChange?: Array<BeforeChangeNodeHook<ReturnType<ReplaceAny<T, LexicalNode>['exportJSON']>>>
    beforeValidate?: Array<
      BeforeValidateNodeHook<ReturnType<ReplaceAny<T, LexicalNode>['exportJSON']>>
    >
  }
  /**
   * The actual lexical node needs to be provided here. This also supports [lexical node replacements](https://lexical.dev/docs/concepts/node-replacement).
   */
  node: Klass<T> | LexicalNodeReplacement
  /**
   * This allows you to provide node validations, which are run when your document is being validated, alongside other payload fields.
   * You can use it to throw a validation error for a specific node in case its data is incorrect.
   */
  validations?: Array<NodeValidation<ReturnType<ReplaceAny<T, LexicalNode>['exportJSON']>>>
}

export type ServerFeature<ServerProps, ClientFeatureProps> = {
  ClientFeature?: PayloadComponent<never, BaseClientFeatureProps<ClientFeatureProps>>
  /**
   * This determines what props will be available on the Client.
   */
  clientFeatureProps?: ClientFeatureProps
  /**
   * Adds payload components to the importMap.
   *
   * If an object is provided, the imported components will automatically be made available to the client feature, keyed by the object's keys.
   */
  componentImports?:
    | {
        [key: string]: PayloadComponent
      }
    | ImportMapGenerators[0]
    | PayloadComponent[]
  generatedTypes?: {
    modifyOutputSchema: (args: {
      collectionIDFieldTypes: { [key: string]: 'number' | 'string' }
      config?: SanitizedConfig
      /**
       * Current schema which will be modified by this function.
       */
      currentSchema: JSONSchema4
      field: LexicalRichTextField
      i18n?: I18n
      /**
       * Allows you to define new top-level interfaces that can be re-used in the output schema.
       */
      interfaceNameDefinitions: Map<string, JSONSchema4>
      isRequired: boolean
    }) => JSONSchema4
  }
  generateSchemaMap?: (args: {
    config: SanitizedConfig
    field: RichTextField
    i18n: I18nClient
    props: ServerProps
    schemaMap: FieldSchemaMap
    schemaPath: string
  }) => FieldSchemaMap | null
  hooks?: RichTextHooks
  /**
   * Here you can provide i18n translations for your feature. These will only be available on the server and client.
   *
   * Translations here are automatically scoped to `lexical.featureKey.yourKey`
   *
   * @Example
   * ```ts
   * i18n: {
   *   en: {
   *     label: 'Horizontal Rule',
   *   },
   *   de: {
   *     label: 'Trennlinie',
   *   },
   * }
   * ```
   * In order to access these translations, you would use `i18n.t('lexical:horizontalRule:label')`.
   */
  i18n?: Partial<GenericLanguages>
  markdownTransformers?: (
    | ((props: { allNodes: Array<NodeWithHooks>; allTransformers: Transformer[] }) => Transformer)
    | Transformer
  )[]
  nodes?: Array<NodeWithHooks>

  /** Props which were passed into your feature will have to be passed here. This will allow them to be used / read in other places of the code, e.g. wherever you can use useEditorConfigContext */
  sanitizedServerFeatureProps?: ServerProps
}

export type ResolvedServerFeature<ServerProps, ClientFeatureProps> = {
  order: number
} & Required<
  Pick<
    FeatureProviderServer<ServerProps, ClientFeatureProps>,
    'dependencies' | 'dependenciesPriority' | 'dependenciesSoft' | 'key'
  >
> &
  ServerFeature<ServerProps, ClientFeatureProps>

export type ResolvedServerFeatureMap = Map<string, ResolvedServerFeature<any, any>>

export type ServerFeatureProviderMap = Map<string, FeatureProviderServer<any, any, any>>

export type SanitizedServerFeatures = {
  /**  The node types mapped to their converters */
  converters: {
    html: HTMLConverter[]
  }
  /** The keys of all enabled features */
  enabledFeatures: string[]
  generatedTypes: {
    modifyOutputSchemas: Array<
      (args: {
        collectionIDFieldTypes: { [key: string]: 'number' | 'string' }
        config?: SanitizedConfig
        /**
         * Current schema which will be modified by this function.
         */
        currentSchema: JSONSchema4
        field: LexicalRichTextField
        i18n?: I18n
        /**
         * Allows you to define new top-level interfaces that can be re-used in the output schema.
         */
        interfaceNameDefinitions: Map<string, JSONSchema4>
        isRequired: boolean
      }) => JSONSchema4
    >
  }
  /**  The node types mapped to their hooks */

  getSubFields?: Map<
    string,
    (args: { node: SerializedLexicalNode; req: PayloadRequest }) => Field[] | null
  >
  getSubFieldsData?: Map<
    string,
    (args: { node: SerializedLexicalNode; req: PayloadRequest }) => JsonObject
  >
  graphQLPopulationPromises: Map<string, Array<PopulationPromise>>
  hooks: RichTextHooks
  markdownTransformers: Transformer[]
  nodeHooks?: {
    afterChange?: Map<string, Array<AfterChangeNodeHook<SerializedLexicalNode>>>
    afterRead?: Map<string, Array<AfterReadNodeHook<SerializedLexicalNode>>>
    beforeChange?: Map<string, Array<BeforeChangeNodeHook<SerializedLexicalNode>>>
    beforeValidate?: Map<string, Array<BeforeValidateNodeHook<SerializedLexicalNode>>>
  } /**  The node types mapped to their populationPromises */
  /**  The node types mapped to their validations */
  validations: Map<string, Array<NodeValidation>>
} & Required<Pick<ResolvedServerFeature<any, any>, 'i18n' | 'nodes'>>
```

--------------------------------------------------------------------------------

---[FILE: typeUtilities.ts]---
Location: payload-main/packages/richtext-lexical/src/features/typeUtilities.ts

```typescript
import type { LexicalNode } from 'lexical'

import type { NodeWithHooks } from './typesServer.js'

/**
 * Utility function to create a node with hooks. You don't have to use this utility, but it improves type inference
 * @param node the node
 */
export function createNode<Node extends LexicalNode>(
  node: NodeWithHooks<Node>,
): NodeWithHooks<Node> {
  return node
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/align/client/index.tsx
Signals: React

```typescript
'use client'

import type { DecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode'
import type { ElementFormatType, ElementNode } from 'lexical'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $isDecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode'
import { $findMatchingParent } from '@lexical/utils'
import {
  $getSelection,
  $isElementNode,
  $isNodeSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  FORMAT_ELEMENT_COMMAND,
} from 'lexical'
import { useEffect } from 'react'

import type { ToolbarGroup } from '../../toolbars/types.js'

import { AlignCenterIcon } from '../../../lexical/ui/icons/AlignCenter/index.js'
import { AlignJustifyIcon } from '../../../lexical/ui/icons/AlignJustify/index.js'
import { AlignLeftIcon } from '../../../lexical/ui/icons/AlignLeft/index.js'
import { AlignRightIcon } from '../../../lexical/ui/icons/AlignRight/index.js'
import { createClientFeature } from '../../../utilities/createClientFeature.js'
import { toolbarAlignGroupWithItems } from './toolbarAlignGroup.js'

// DecoratorBlockNode has format, but Lexical forgot
// to add the getters like ElementNode does.
const getFormatType = (node: DecoratorBlockNode | ElementNode): ElementFormatType => {
  if ($isElementNode(node)) {
    return node.getFormatType()
  }
  return node.__format
}

const toolbarGroups: ToolbarGroup[] = [
  toolbarAlignGroupWithItems([
    {
      ChildComponent: AlignLeftIcon,
      isActive: ({ selection }) => {
        if (!$isRangeSelection(selection)) {
          return false
        }
        for (const node of selection.getNodes()) {
          if ($isElementNode(node) || $isDecoratorBlockNode(node)) {
            if (getFormatType(node) === 'left') {
              continue
            }
          }

          const parent = node.getParent()
          if ($isElementNode(parent) || $isDecoratorBlockNode(parent)) {
            if (getFormatType(parent) === 'left') {
              continue
            }
          }

          return false
        }
        return true
      },
      key: 'alignLeft',
      label: ({ i18n }) => {
        return i18n.t('lexical:align:alignLeftLabel')
      },
      onSelect: ({ editor }) => {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')
      },
      order: 1,
    },
    {
      ChildComponent: AlignCenterIcon,
      isActive: ({ selection }) => {
        if (!$isRangeSelection(selection)) {
          return false
        }
        for (const node of selection.getNodes()) {
          if ($isElementNode(node) || $isDecoratorBlockNode(node)) {
            if (getFormatType(node) === 'center') {
              continue
            }
          }

          const parent = node.getParent()
          if ($isElementNode(parent) || $isDecoratorBlockNode(parent)) {
            if (getFormatType(parent) === 'center') {
              continue
            }
          }

          return false
        }
        return true
      },
      key: 'alignCenter',
      label: ({ i18n }) => {
        return i18n.t('lexical:align:alignCenterLabel')
      },
      onSelect: ({ editor }) => {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')
      },
      order: 2,
    },
    {
      ChildComponent: AlignRightIcon,
      isActive: ({ selection }) => {
        if (!$isRangeSelection(selection)) {
          return false
        }
        for (const node of selection.getNodes()) {
          if ($isElementNode(node) || $isDecoratorBlockNode(node)) {
            if (getFormatType(node) === 'right') {
              continue
            }
          }

          const parent = node.getParent()
          if ($isElementNode(parent) || $isDecoratorBlockNode(parent)) {
            if (getFormatType(parent) === 'right') {
              continue
            }
          }

          return false
        }
        return true
      },
      key: 'alignRight',
      label: ({ i18n }) => {
        return i18n.t('lexical:align:alignRightLabel')
      },
      onSelect: ({ editor }) => {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')
      },
      order: 3,
    },
    {
      ChildComponent: AlignJustifyIcon,
      isActive: ({ selection }) => {
        if (!$isRangeSelection(selection)) {
          return false
        }
        for (const node of selection.getNodes()) {
          if ($isElementNode(node) || $isDecoratorBlockNode(node)) {
            if (getFormatType(node) === 'justify') {
              continue
            }
          }

          const parent = node.getParent()
          if ($isElementNode(parent) || $isDecoratorBlockNode(parent)) {
            if (getFormatType(parent) === 'justify') {
              continue
            }
          }

          return false
        }
        return true
      },
      key: 'alignJustify',
      label: ({ i18n }) => {
        return i18n.t('lexical:align:alignJustifyLabel')
      },
      onSelect: ({ editor }) => {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')
      },
      order: 4,
    },
  ]),
]

const AlignPlugin = () => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    // Just like the default Lexical configuration, but in
    // addition to ElementNode we also set DecoratorBlocks
    return editor.registerCommand(
      FORMAT_ELEMENT_COMMAND,
      (format) => {
        const selection = $getSelection()
        if (!$isRangeSelection(selection) && !$isNodeSelection(selection)) {
          return false
        }
        const nodes = selection.getNodes()
        for (const node of nodes) {
          const element = $findMatchingParent(
            node,
            (parentNode): parentNode is DecoratorBlockNode | ElementNode =>
              ($isElementNode(parentNode) || $isDecoratorBlockNode(parentNode)) &&
              !parentNode.isInline(),
          )
          if (element !== null) {
            element.setFormat(format)
          }
        }
        return true
      },
      COMMAND_PRIORITY_LOW,
    )
  }, [editor])
  return null
}

export const AlignFeatureClient = createClientFeature({
  plugins: [
    {
      Component: AlignPlugin,
      position: 'normal',
    },
  ],
  toolbarFixed: {
    groups: toolbarGroups,
  },
  toolbarInline: {
    groups: toolbarGroups,
  },
})
```

--------------------------------------------------------------------------------

---[FILE: toolbarAlignGroup.ts]---
Location: payload-main/packages/richtext-lexical/src/features/align/client/toolbarAlignGroup.ts

```typescript
'use client'
import type { ToolbarGroup, ToolbarGroupItem } from '../../toolbars/types.js'

import { AlignLeftIcon } from '../../../lexical/ui/icons/AlignLeft/index.js'

export const toolbarAlignGroupWithItems = (items: ToolbarGroupItem[]): ToolbarGroup => {
  return {
    type: 'dropdown',
    ChildComponent: AlignLeftIcon,
    items,
    key: 'align',
    order: 30,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: i18n.ts]---
Location: payload-main/packages/richtext-lexical/src/features/align/server/i18n.ts

```typescript
import type { GenericLanguages } from '@payloadcms/translations'

export const i18n: Partial<GenericLanguages> = {
  ar: {
    alignCenterLabel: 'محاذاة في الوسط',
    alignJustifyLabel: 'محاذاة التبرير',
    alignLeftLabel: 'محاذاة إلى اليسار',
    alignRightLabel: 'محاذاة إلى اليمين',
  },
  az: {
    alignCenterLabel: 'Mərkəzə Düzəlt',
    alignJustifyLabel: 'Düzəldin Səsləndirin',
    alignLeftLabel: 'Sola Doğru Hizalama',
    alignRightLabel: 'Sağa Doğru Hizalama',
  },
  bg: {
    alignCenterLabel: 'Центрирай',
    alignJustifyLabel: 'Подравняване по двата края',
    alignLeftLabel: 'Подравняване отляво',
    alignRightLabel: 'Подравняване вдясно',
  },
  cs: {
    alignCenterLabel: 'Zarovnat na střed',
    alignJustifyLabel: 'Zarovnat do bloku',
    alignLeftLabel: 'Zarovnat vlevo',
    alignRightLabel: 'Zarovnat vpravo',
  },
  da: {
    alignCenterLabel: 'Centrer teksten',
    alignJustifyLabel: 'Justér til begge sider',
    alignLeftLabel: 'Justér til venstre',
    alignRightLabel: 'Juster til højre',
  },
  de: {
    alignCenterLabel: 'Zentrieren',
    alignJustifyLabel: 'Blocksatz',
    alignLeftLabel: 'Linksbündig',
    alignRightLabel: 'Rechtsbündig',
  },
  en: {
    alignCenterLabel: 'Align Center',
    alignJustifyLabel: 'Align Justify',
    alignLeftLabel: 'Align Left',
    alignRightLabel: 'Align Right',
  },
  es: {
    alignCenterLabel: 'Alinear al centro',
    alignJustifyLabel: 'Alinear Justificar',
    alignLeftLabel: 'Alinear a la izquierda',
    alignRightLabel: 'Alinear a la derecha',
  },
  et: {
    alignCenterLabel: 'Keskjoondus',
    alignJustifyLabel: 'Rööpjoondus',
    alignLeftLabel: 'Vasakjoondus',
    alignRightLabel: 'Paremjoondus',
  },
  fa: {
    alignCenterLabel: 'تراز در مرکز',
    alignJustifyLabel: 'تراز کردن از دو طرف',
    alignLeftLabel: 'چپ تراز',
    alignRightLabel: 'راست چین',
  },
  fr: {
    alignCenterLabel: 'Aligner au centre',
    alignJustifyLabel: 'Aligner Justifier',
    alignLeftLabel: 'Aligner à gauche',
    alignRightLabel: 'Aligner à droite',
  },
  he: {
    alignCenterLabel: 'ממורכז',
    alignJustifyLabel: 'יישור דו-צדדי',
    alignLeftLabel: 'הסב לשמאל',
    alignRightLabel: 'יישור לימין',
  },
  hr: {
    alignCenterLabel: 'Poravnaj središnje',
    alignJustifyLabel: 'Poravnaj opravdaj',
    alignLeftLabel: 'Poravnaj lijevo',
    alignRightLabel: 'Poravnaj desno',
  },
  hu: {
    alignCenterLabel: 'Középre igazítás',
    alignJustifyLabel: 'Igazítás Sorkizárás',
    alignLeftLabel: 'Igazítás balra',
    alignRightLabel: 'Igazítás jobbra',
  },
  is: {
    alignCenterLabel: 'Miðju jöfnun',
    alignJustifyLabel: 'Samræmd jöfnun',
    alignLeftLabel: 'Vinstri jöfnun',
    alignRightLabel: 'Hægri jöfnun',
  },
  it: {
    alignCenterLabel: 'Allinea al centro',
    alignJustifyLabel: 'Allinea Giustifica',
    alignLeftLabel: 'Allinea a sinistra',
    alignRightLabel: 'Allinea a destra',
  },
  ja: {
    alignCenterLabel: '中央揃え',
    alignJustifyLabel: '両端揃え',
    alignLeftLabel: '左揃え',
    alignRightLabel: '右揃え',
  },
  ko: {
    alignCenterLabel: '중앙 정렬',
    alignJustifyLabel: '정렬 맞춤',
    alignLeftLabel: '왼쪽 정렬',
    alignRightLabel: '오른쪽 정렬',
  },
  my: {
    alignCenterLabel: 'Pusat Selaras',
    alignJustifyLabel: 'Penjajaran Justify',
    alignLeftLabel: 'ဘယ်ဘက်ဦးတည်ခြင်း',
    alignRightLabel: 'Penjajaran Kanan',
  },
  nb: {
    alignCenterLabel: 'Sentrer tekst',
    alignJustifyLabel: 'Juster linje',
    alignLeftLabel: 'Juster til venstre',
    alignRightLabel: 'Juster til høyre',
  },
  nl: {
    alignCenterLabel: 'Centreer uitlijnen',
    alignJustifyLabel: 'Uitlijnen Rechtvaardigen',
    alignLeftLabel: 'Links uitlijnen',
    alignRightLabel: 'Rechts uitlijnen',
  },
  pl: {
    alignCenterLabel: 'Wyśrodkuj',
    alignJustifyLabel: 'Wyjustuj wyrównanie',
    alignLeftLabel: 'Wyrównaj do lewej',
    alignRightLabel: 'Wyrównaj do prawej',
  },
  pt: {
    alignCenterLabel: 'Alinhar ao Centro',
    alignJustifyLabel: 'Alinhar Justificar',
    alignLeftLabel: 'Alinhar à Esquerda',
    alignRightLabel: 'Alinhar à Direita',
  },
  ro: {
    alignCenterLabel: 'Aliniați Centrul',
    alignJustifyLabel: 'Aliniaza Justifica',
    alignLeftLabel: 'Aliniați la stânga',
    alignRightLabel: 'Aliniați la dreapta',
  },
  rs: {
    alignCenterLabel: 'Поравнај по средини',
    alignJustifyLabel: 'Поравнај обострано',
    alignLeftLabel: 'Поравнај лево',
    alignRightLabel: 'Поравнај десно',
  },
  'rs-latin': {
    alignCenterLabel: 'Poravnaj po sredini',
    alignJustifyLabel: 'Poravnaj obostrano',
    alignLeftLabel: 'Poravnaj levo',
    alignRightLabel: 'Poravnaj desno',
  },
  ru: {
    alignCenterLabel: 'Выровнять по центру',
    alignJustifyLabel: 'Выровнять по ширине',
    alignLeftLabel: 'Выровнять по левому краю',
    alignRightLabel: 'Выровнять по правому краю',
  },
  sk: {
    alignCenterLabel: 'Vycentrovať',
    alignJustifyLabel: 'Zarovnať do bloku',
    alignLeftLabel: 'Zarovnať doľava',
    alignRightLabel: 'Zarovnať doprava',
  },
  sl: {
    alignCenterLabel: 'Poravnaj na sredino',
    alignJustifyLabel: 'Poravnaj Obojestransko',
    alignLeftLabel: 'Poravnaj na levo',
    alignRightLabel: 'Poravnaj na desno',
  },
  sv: {
    alignCenterLabel: 'Centrera',
    alignJustifyLabel: 'Justera Justify',
    alignLeftLabel: 'Justera till vänster',
    alignRightLabel: 'Justera till höger',
  },
  ta: {
    alignCenterLabel: 'மையத்தில் ஒழுங்குபடுத்து',
    alignJustifyLabel: 'இருபுறமும் ஒழுங்குபடுத்து',
    alignLeftLabel: 'இடப்புறத்தில் ஒழுங்குபடுத்து',
    alignRightLabel: 'வலப்புறத்தில் ஒழுங்குபடுத்து',
  },
  th: {
    alignCenterLabel: 'จัดแนวกึ่งกลาง',
    alignJustifyLabel: 'จัดแนวตรง',
    alignLeftLabel: 'จัดชิดซ้าย',
    alignRightLabel: 'จัดชิดขวา',
  },
  tr: {
    alignCenterLabel: 'Ortaya Hizala',
    alignJustifyLabel: 'Hizala Yasla',
    alignLeftLabel: 'Sola Hizala',
    alignRightLabel: 'Sağa Hizala',
  },
  uk: {
    alignCenterLabel: 'Вирівняти по центру',
    alignJustifyLabel: 'Вирівняти за шириною',
    alignLeftLabel: 'Вирівняти по лівому краю',
    alignRightLabel: 'Вирівняти по правому краю',
  },
  vi: {
    alignCenterLabel: 'Căn giữa',
    alignJustifyLabel: 'Căn đều',
    alignLeftLabel: 'Căn lề trái',
    alignRightLabel: 'Căn phải',
  },
  zh: {
    alignCenterLabel: '居中对齐',
    alignJustifyLabel: '对齐调整',
    alignLeftLabel: '向左对齐',
    alignRightLabel: '向右对齐',
  },
  'zh-TW': {
    alignCenterLabel: '對齊中心',
    alignJustifyLabel: '對齊並排列',
    alignLeftLabel: '向左對齊',
    alignRightLabel: '向右對齊',
  },
}
```

--------------------------------------------------------------------------------

````
