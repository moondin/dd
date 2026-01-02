---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 174
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 174 of 695)

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

---[FILE: LanguageOptions.ts]---
Location: payload-main/packages/payload/src/admin/LanguageOptions.ts

```typescript
import type { AcceptedLanguages } from '@payloadcms/translations'

export type LanguageOptions = {
  label: string
  value: AcceptedLanguages
}[]
```

--------------------------------------------------------------------------------

---[FILE: RichText.ts]---
Location: payload-main/packages/payload/src/admin/RichText.ts

```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { GenericLanguages, I18n } from '@payloadcms/translations'
import type { JSONSchema4 } from 'json-schema'

import type { SanitizedCollectionConfig, TypeWithID } from '../collections/config/types.js'
import type { ImportMapGenerators, PayloadComponent, SanitizedConfig } from '../config/types.js'
import type { ValidationFieldError } from '../errors/ValidationError.js'
import type {
  FieldAffectingData,
  RichTextField,
  RichTextFieldClient,
  Validate,
} from '../fields/config/types.js'
import type { SanitizedGlobalConfig } from '../globals/config/types.js'
import type { RequestContext, TypedFallbackLocale } from '../index.js'
import type { JsonObject, PayloadRequest, PopulateType } from '../types/index.js'
import type { RichTextFieldClientProps, RichTextFieldServerProps } from './fields/RichText.js'
import type { FieldDiffClientProps, FieldDiffServerProps, FieldSchemaMap } from './types.js'

export type AfterReadRichTextHookArgs<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  TData extends TypeWithID = any,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  TValue = any,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  TSiblingData = any,
> = {
  currentDepth?: number

  depth?: number

  draft?: boolean

  fallbackLocale?: TypedFallbackLocale
  fieldPromises?: Promise<void>[]

  /** Boolean to denote if this hook is running against finding one, or finding many within the afterRead hook. */
  findMany?: boolean

  flattenLocales?: boolean

  locale?: string

  /** A string relating to which operation the field type is currently executing within. */
  operation?: 'create' | 'delete' | 'read' | 'update'

  overrideAccess?: boolean

  populate?: PopulateType

  populationPromises?: Promise<void>[]
  showHiddenFields?: boolean
  triggerAccessControl?: boolean
  triggerHooks?: boolean
}

export type AfterChangeRichTextHookArgs<
  TData extends TypeWithID = any,
  TValue = any,
  TSiblingData = any,
> = {
  /** A string relating to which operation the field type is currently executing within. */
  operation: 'create' | 'update'
  /** The document before changes were applied. */
  previousDoc?: TData
  /** The sibling data of the document before changes being applied. */
  previousSiblingDoc?: TSiblingData
  /** The previous value of the field, before changes */
  previousValue?: TValue
}

export type BeforeValidateRichTextHookArgs<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  TData extends TypeWithID = any,
  TValue = any,
  TSiblingData = any,
> = {
  /** A string relating to which operation the field type is currently executing within. */
  operation: 'create' | 'update'
  overrideAccess?: boolean
  /** The sibling data of the document before changes being applied. */
  previousSiblingDoc?: TSiblingData
  /** The previous value of the field, before changes */
  previousValue?: TValue
}

export type BeforeChangeRichTextHookArgs<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  TData extends TypeWithID = any,
  TValue = any,
  TSiblingData = any,
> = {
  /**
   * The original data with locales (not modified by any hooks). Only available in `beforeChange` and `beforeDuplicate` field hooks.
   */
  docWithLocales?: JsonObject

  duplicate?: boolean

  errors?: ValidationFieldError[]
  /**
   * Built up field label
   *
   * @example "Group Field > Tab Field > Rich Text Field"
   */
  fieldLabelPath: string
  /** Only available in `beforeChange` field hooks */
  mergeLocaleActions?: (() => Promise<void> | void)[]
  /** A string relating to which operation the field type is currently executing within. */
  operation?: 'create' | 'delete' | 'read' | 'update'
  overrideAccess: boolean
  /** The sibling data of the document before changes being applied. */
  previousSiblingDoc?: TSiblingData
  /** The previous value of the field, before changes */
  previousValue?: TValue
  /**
   * The original siblingData with locales (not modified by any hooks).
   */
  siblingDocWithLocales?: JsonObject
  skipValidation?: boolean
}

export type BaseRichTextHookArgs<
  TData extends TypeWithID = any,
  TValue = any,
  TSiblingData = any,
> = {
  /** The collection which the field belongs to. If the field belongs to a global, this will be null. */
  collection: null | SanitizedCollectionConfig
  context: RequestContext
  /** The data passed to update the document within create and update operations, and the full document itself in the afterRead hook. */
  data?: Partial<TData>
  /** The field which the hook is running against. */
  field: FieldAffectingData
  /** The global which the field belongs to. If the field belongs to a collection, this will be null. */
  global: null | SanitizedGlobalConfig
  indexPath: number[]
  /** The full original document in `update` operations. In the `afterChange` hook, this is the resulting document of the operation. */
  originalDoc?: TData
  parentIsLocalized: boolean
  /**
   * The path of the field, e.g. ["group", "myArray", 1, "textField"]. The path is the schemaPath but with indexes and would be used in the context of field data, not field schemas.
   */
  path: (number | string)[]
  /** The Express request object. It is mocked for Local API operations. */
  req: PayloadRequest
  /**
   * The schemaPath of the field, e.g. ["group", "myArray", "textField"]. The schemaPath is the path but without indexes and would be used in the context of field schemas, not field data.
   */
  schemaPath: string[]
  /** The sibling data passed to a field that the hook is running against. */
  siblingData: Partial<TSiblingData>
  /** The value of the field. */
  value?: TValue
}

export type AfterReadRichTextHook<
  TData extends TypeWithID = any,
  TValue = any,
  TSiblingData = any,
> = (
  args: AfterReadRichTextHookArgs<TData, TValue, TSiblingData> &
    BaseRichTextHookArgs<TData, TValue, TSiblingData>,
) => Promise<TValue> | TValue

export type AfterChangeRichTextHook<
  TData extends TypeWithID = any,
  TValue = any,
  TSiblingData = any,
> = (
  args: AfterChangeRichTextHookArgs<TData, TValue, TSiblingData> &
    BaseRichTextHookArgs<TData, TValue, TSiblingData>,
) => Promise<TValue> | TValue

export type BeforeChangeRichTextHook<
  TData extends TypeWithID = any,
  TValue = any,
  TSiblingData = any,
> = (
  args: BaseRichTextHookArgs<TData, TValue, TSiblingData> &
    BeforeChangeRichTextHookArgs<TData, TValue, TSiblingData>,
) => Promise<TValue> | TValue

export type BeforeValidateRichTextHook<
  TData extends TypeWithID = any,
  TValue = any,
  TSiblingData = any,
> = (
  args: BaseRichTextHookArgs<TData, TValue, TSiblingData> &
    BeforeValidateRichTextHookArgs<TData, TValue, TSiblingData>,
) => Promise<TValue> | TValue

export type RichTextHooks = {
  afterChange?: AfterChangeRichTextHook[]
  afterRead?: AfterReadRichTextHook[]
  beforeChange?: BeforeChangeRichTextHook[]
  beforeValidate?: BeforeValidateRichTextHook[]
}

type RichTextAdapterBase<
  Value extends object = object,
  AdapterProps = any,
  ExtraFieldProperties = {},
> = {
  /**
   * Provide a function that can be used to add items to the import map. This is useful for
   * making modules available to the client.
   */
  generateImportMap?: ImportMapGenerators[0]
  /**
   * Provide a function that can be used to add items to the schema map. This is useful for
   * richtext sub-fields the server needs to "know" about in order to do things like calculate form state.
   *
   * This function is run within `buildFieldSchemaMap`.
   */
  generateSchemaMap?: (args: {
    config: SanitizedConfig
    field: RichTextField
    i18n: I18n<any, any>
    schemaMap: FieldSchemaMap
    schemaPath: string
  }) => FieldSchemaMap
  /**
   * Like an afterRead hook, but runs only for the GraphQL resolver. For populating data, this should be used, as afterRead hooks do not have a depth in graphQL.
   *
   * To populate stuff / resolve field hooks, mutate the incoming populationPromises or fieldPromises array. They will then be awaited in the correct order within payload itself.
   * @param data
   */
  graphQLPopulationPromises?: (data: {
    context: RequestContext
    currentDepth?: number
    depth: number
    draft: boolean
    field: RichTextField<Value, AdapterProps, ExtraFieldProperties>
    fieldPromises: Promise<void>[]
    findMany: boolean
    flattenLocales: boolean
    overrideAccess?: boolean
    parentIsLocalized: boolean
    populateArg?: PopulateType
    populationPromises: Promise<void>[]
    req: PayloadRequest
    showHiddenFields: boolean
    siblingDoc: JsonObject
  }) => void
  hooks?: RichTextHooks
  /**
   * @deprecated - manually merge i18n translations into the config.i18n.translations object within the adapter provider instead.
   * This property will be removed in v4.
   */
  i18n?: Partial<GenericLanguages>
  /**
   * Return the JSON schema for the field value. The JSON schema is read by
   * `json-schema-to-typescript` which is used to generate types for this richtext field
   * payload-types.ts)
   */
  outputSchema?: (args: {
    collectionIDFieldTypes: { [key: string]: 'number' | 'string' }
    config?: SanitizedConfig
    field: RichTextField<Value, AdapterProps, ExtraFieldProperties>
    i18n?: I18n
    /**
     * Allows you to define new top-level interfaces that can be re-used in the output schema.
     */
    interfaceNameDefinitions: Map<string, JSONSchema4>
    isRequired: boolean
  }) => JSONSchema4
  /**
   * Provide validation function for the richText field. This function is run the same way
   * as other field validation functions.
   */
  validate: Validate<
    Value,
    Value,
    unknown,
    RichTextField<Value, AdapterProps, ExtraFieldProperties>
  >
}

export type RichTextAdapter<
  Value extends object = any,
  AdapterProps = any,
  ExtraFieldProperties = any,
> = {
  /**
   * Component that will be displayed in the list view. Can be typed as
   * `DefaultCellComponentProps` or `DefaultServerCellComponentProps`.
   */
  CellComponent: PayloadComponent<never>
  /**
   * Component that will be displayed in the version diff view.
   * If not provided, richtext content will be diffed as JSON.
   */
  DiffComponent?: PayloadComponent<
    FieldDiffServerProps<RichTextField, RichTextFieldClient>,
    FieldDiffClientProps<RichTextFieldClient>
  >
  /**
   * Component that will be displayed in the edit view.
   */
  FieldComponent: PayloadComponent<RichTextFieldServerProps, RichTextFieldClientProps>
} & RichTextAdapterBase<Value, AdapterProps, ExtraFieldProperties>

export type RichTextAdapterProvider<
  Value extends object = object,
  AdapterProps = any,
  ExtraFieldProperties = {},
> = ({
  config,
  isRoot,
  parentIsLocalized,
}: {
  config: SanitizedConfig
  /**
   * Whether or not this is the root richText editor, defined in the top-level `editor` property
   * of the Payload Config.
   *
   * @default false
   */
  isRoot?: boolean
  parentIsLocalized: boolean
}) =>
  | Promise<RichTextAdapter<Value, AdapterProps, ExtraFieldProperties>>
  | RichTextAdapter<Value, AdapterProps, ExtraFieldProperties>
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/payload/src/admin/types.ts
Signals: React

```typescript
import type { AcceptedLanguages, I18nClient } from '@payloadcms/translations'
import type React from 'react'

import type { ImportMap } from '../bin/generateImportMap/index.js'
import type { TypeWithID } from '../collections/config/types.js'
import type { SanitizedConfig } from '../config/types.js'
import type {
  Block,
  ClientBlock,
  ClientField,
  Field,
  FieldTypes,
  Tab,
} from '../fields/config/types.js'
import type { JsonObject } from '../types/index.js'
import type { ClientTab } from './fields/Tabs.js'
import type {
  BuildFormStateArgs,
  Data,
  FieldState,
  FieldStateWithoutComponents,
  FilterOptionsResult,
  FormState,
  FormStateWithoutComponents,
  Row,
} from './forms/Form.js'

export type {
  /**
   * @deprecated
   * The `CustomPreviewButton` type is deprecated and will be removed in the next major version.
   * This type is only used for the Payload Config. Use `PreviewButtonClientProps` instead.
   */
  CustomComponent as CustomPreviewButton,
  /**
   * @deprecated
   * The `CustomPublishButton` type is deprecated and will be removed in the next major version.
   * This type is only used for the Payload Config. Use `PreviewButtonClientProps` instead.
   */
  CustomComponent as CustomPublishButton,
  /**
   * @deprecated
   * The `CustomSaveButton` type is deprecated and will be removed in the next major version.
   * This type is only used for the Payload Config. Use `PreviewButtonClientProps` instead.
   */
  CustomComponent as CustomSaveButton,
  /**
   * @deprecated
   * The `CustomSaveDraftButton` type is deprecated and will be removed in the next major version.
   * This type is only used for the Payload Config. Use `PreviewButtonClientProps` instead.
   */
  CustomComponent as CustomSaveDraftButton,
} from '../config/types.js'
export type { DefaultCellComponentProps, DefaultServerCellComponentProps } from './elements/Cell.js'
export type { ConditionalDateProps } from './elements/DatePicker.js'
export type { DayPickerProps, SharedProps, TimePickerProps } from './elements/DatePicker.js'
export type {
  EditMenuItemsClientProps,
  EditMenuItemsServerProps,
  EditMenuItemsServerPropsOnly,
} from './elements/EditMenuItems.js'
export type { NavGroupPreferences, NavPreferences } from './elements/Nav.js'
export type {
  PreviewButtonClientProps,
  PreviewButtonServerProps,
  PreviewButtonServerPropsOnly,
} from './elements/PreviewButton.js'
export type {
  PublishButtonClientProps,
  PublishButtonServerProps,
  PublishButtonServerPropsOnly,
} from './elements/PublishButton.js'
export type {
  SaveButtonClientProps,
  SaveButtonServerProps,
  SaveButtonServerPropsOnly,
} from './elements/SaveButton.js'
export type {
  SaveDraftButtonClientProps,
  SaveDraftButtonServerProps,
  SaveDraftButtonServerPropsOnly,
} from './elements/SaveDraftButton.js'

export type { Column } from './elements/Table.js'

export type { CustomUpload } from './elements/Upload.js'

export type {
  WithServerSidePropsComponent,
  WithServerSidePropsComponentProps,
} from './elements/WithServerSideProps.js'

export type {
  ArrayFieldClientComponent,
  ArrayFieldClientProps,
  ArrayFieldDescriptionClientComponent,
  ArrayFieldDescriptionServerComponent,
  ArrayFieldDiffClientComponent,
  ArrayFieldDiffServerComponent,
  ArrayFieldErrorClientComponent,
  ArrayFieldErrorServerComponent,
  ArrayFieldLabelClientComponent,
  ArrayFieldLabelServerComponent,
  ArrayFieldServerComponent,
  ArrayFieldServerProps,
} from './fields/Array.js'

export type {
  BlockRowLabelClientComponent,
  BlockRowLabelServerComponent,
  BlocksFieldClientComponent,
  BlocksFieldClientProps,
  BlocksFieldDescriptionClientComponent,
  BlocksFieldDescriptionServerComponent,
  BlocksFieldDiffClientComponent,
  BlocksFieldDiffServerComponent,
  BlocksFieldErrorClientComponent,
  BlocksFieldErrorServerComponent,
  BlocksFieldLabelClientComponent,
  BlocksFieldLabelServerComponent,
  BlocksFieldServerComponent,
  BlocksFieldServerProps,
} from './fields/Blocks.js'

export type {
  CheckboxFieldClientComponent,
  CheckboxFieldClientProps,
  CheckboxFieldDescriptionClientComponent,
  CheckboxFieldDescriptionServerComponent,
  CheckboxFieldDiffClientComponent,
  CheckboxFieldDiffServerComponent,
  CheckboxFieldErrorClientComponent,
  CheckboxFieldErrorServerComponent,
  CheckboxFieldLabelClientComponent,
  CheckboxFieldLabelServerComponent,
  CheckboxFieldServerComponent,
  CheckboxFieldServerProps,
} from './fields/Checkbox.js'

export type {
  CodeFieldClientComponent,
  CodeFieldClientProps,
  CodeFieldDescriptionClientComponent,
  CodeFieldDescriptionServerComponent,
  CodeFieldDiffClientComponent,
  CodeFieldDiffServerComponent,
  CodeFieldErrorClientComponent,
  CodeFieldErrorServerComponent,
  CodeFieldLabelClientComponent,
  CodeFieldLabelServerComponent,
  CodeFieldServerComponent,
  CodeFieldServerProps,
} from './fields/Code.js'

export type {
  CollapsibleFieldClientComponent,
  CollapsibleFieldClientProps,
  CollapsibleFieldDescriptionClientComponent,
  CollapsibleFieldDescriptionServerComponent,
  CollapsibleFieldDiffClientComponent,
  CollapsibleFieldDiffServerComponent,
  CollapsibleFieldErrorClientComponent,
  CollapsibleFieldErrorServerComponent,
  CollapsibleFieldLabelClientComponent,
  CollapsibleFieldLabelServerComponent,
  CollapsibleFieldServerComponent,
  CollapsibleFieldServerProps,
} from './fields/Collapsible.js'

export type {
  DateFieldClientComponent,
  DateFieldClientProps,
  DateFieldDescriptionClientComponent,
  DateFieldDescriptionServerComponent,
  DateFieldDiffClientComponent,
  DateFieldDiffServerComponent,
  DateFieldErrorClientComponent,
  DateFieldErrorServerComponent,
  DateFieldLabelClientComponent,
  DateFieldLabelServerComponent,
  DateFieldServerComponent,
  DateFieldServerProps,
} from './fields/Date.js'

export type {
  EmailFieldClientComponent,
  EmailFieldClientProps,
  EmailFieldDescriptionClientComponent,
  EmailFieldDescriptionServerComponent,
  EmailFieldDiffClientComponent,
  EmailFieldDiffServerComponent,
  EmailFieldErrorClientComponent,
  EmailFieldErrorServerComponent,
  EmailFieldLabelClientComponent,
  EmailFieldLabelServerComponent,
  EmailFieldServerComponent,
  EmailFieldServerProps,
} from './fields/Email.js'

export type {
  GroupFieldClientComponent,
  GroupFieldClientProps,
  GroupFieldDescriptionClientComponent,
  GroupFieldDescriptionServerComponent,
  GroupFieldDiffClientComponent,
  GroupFieldDiffServerComponent,
  GroupFieldErrorClientComponent,
  GroupFieldErrorServerComponent,
  GroupFieldLabelClientComponent,
  GroupFieldLabelServerComponent,
  GroupFieldServerComponent,
  GroupFieldServerProps,
} from './fields/Group.js'

export type { HiddenFieldProps } from './fields/Hidden.js'

export type {
  JoinFieldClientComponent,
  JoinFieldClientProps,
  JoinFieldDescriptionClientComponent,
  JoinFieldDescriptionServerComponent,
  JoinFieldDiffClientComponent,
  JoinFieldDiffServerComponent,
  JoinFieldErrorClientComponent,
  JoinFieldErrorServerComponent,
  JoinFieldLabelClientComponent,
  JoinFieldLabelServerComponent,
  JoinFieldServerComponent,
  JoinFieldServerProps,
} from './fields/Join.js'

export type {
  JSONFieldClientComponent,
  JSONFieldClientProps,
  JSONFieldDescriptionClientComponent,
  JSONFieldDescriptionServerComponent,
  JSONFieldDiffClientComponent,
  JSONFieldDiffServerComponent,
  JSONFieldErrorClientComponent,
  JSONFieldErrorServerComponent,
  JSONFieldLabelClientComponent,
  JSONFieldLabelServerComponent,
  JSONFieldServerComponent,
  JSONFieldServerProps,
} from './fields/JSON.js'

export type {
  NumberFieldClientComponent,
  NumberFieldClientProps,
  NumberFieldDescriptionClientComponent,
  NumberFieldDescriptionServerComponent,
  NumberFieldDiffClientComponent,
  NumberFieldDiffServerComponent,
  NumberFieldErrorClientComponent,
  NumberFieldErrorServerComponent,
  NumberFieldLabelClientComponent,
  NumberFieldLabelServerComponent,
  NumberFieldServerComponent,
  NumberFieldServerProps,
} from './fields/Number.js'

export type {
  PointFieldClientComponent,
  PointFieldClientProps,
  PointFieldDescriptionClientComponent,
  PointFieldDescriptionServerComponent,
  PointFieldDiffClientComponent,
  PointFieldDiffServerComponent,
  PointFieldErrorClientComponent,
  PointFieldErrorServerComponent,
  PointFieldLabelClientComponent,
  PointFieldLabelServerComponent,
  PointFieldServerComponent,
  PointFieldServerProps,
} from './fields/Point.js'

export type {
  RadioFieldClientComponent,
  RadioFieldClientProps,
  RadioFieldDescriptionClientComponent,
  RadioFieldDescriptionServerComponent,
  RadioFieldDiffClientComponent,
  RadioFieldDiffServerComponent,
  RadioFieldErrorClientComponent,
  RadioFieldErrorServerComponent,
  RadioFieldLabelClientComponent,
  RadioFieldLabelServerComponent,
  RadioFieldServerComponent,
  RadioFieldServerProps,
} from './fields/Radio.js'

export type {
  RelationshipFieldClientComponent,
  RelationshipFieldClientProps,
  RelationshipFieldDescriptionClientComponent,
  RelationshipFieldDescriptionServerComponent,
  RelationshipFieldDiffClientComponent,
  RelationshipFieldDiffServerComponent,
  RelationshipFieldErrorClientComponent,
  RelationshipFieldErrorServerComponent,
  RelationshipFieldLabelClientComponent,
  RelationshipFieldLabelServerComponent,
  RelationshipFieldServerComponent,
  RelationshipFieldServerProps,
} from './fields/Relationship.js'

export type {
  RichTextFieldClientComponent,
  RichTextFieldClientProps,
  RichTextFieldDescriptionClientComponent,
  RichTextFieldDescriptionServerComponent,
  RichTextFieldDiffClientComponent,
  RichTextFieldDiffServerComponent,
  RichTextFieldErrorClientComponent,
  RichTextFieldErrorServerComponent,
  RichTextFieldLabelClientComponent,
  RichTextFieldLabelServerComponent,
  RichTextFieldServerComponent,
  RichTextFieldServerProps,
} from './fields/RichText.js'

export type {
  RowFieldClientComponent,
  RowFieldClientProps,
  RowFieldDescriptionClientComponent,
  RowFieldDescriptionServerComponent,
  RowFieldDiffClientComponent,
  RowFieldDiffServerComponent,
  RowFieldErrorClientComponent,
  RowFieldErrorServerComponent,
  RowFieldLabelClientComponent,
  RowFieldLabelServerComponent,
  RowFieldServerComponent,
  RowFieldServerProps,
} from './fields/Row.js'

export type {
  SelectFieldClientComponent,
  SelectFieldClientProps,
  SelectFieldDescriptionClientComponent,
  SelectFieldDescriptionServerComponent,
  SelectFieldDiffClientComponent,
  SelectFieldDiffServerComponent,
  SelectFieldErrorClientComponent,
  SelectFieldErrorServerComponent,
  SelectFieldLabelClientComponent,
  SelectFieldLabelServerComponent,
  SelectFieldServerComponent,
  SelectFieldServerProps,
} from './fields/Select.js'

export type {
  ClientTab,
  TabsFieldClientComponent,
  TabsFieldClientProps,
  TabsFieldDescriptionClientComponent,
  TabsFieldDescriptionServerComponent,
  TabsFieldDiffClientComponent,
  TabsFieldDiffServerComponent,
  TabsFieldErrorClientComponent,
  TabsFieldErrorServerComponent,
  TabsFieldLabelClientComponent,
  TabsFieldLabelServerComponent,
  TabsFieldServerComponent,
  TabsFieldServerProps,
} from './fields/Tabs.js'

export type {
  TextFieldClientComponent,
  TextFieldClientProps,
  TextFieldDescriptionClientComponent,
  TextFieldDescriptionServerComponent,
  TextFieldDiffClientComponent,
  TextFieldDiffServerComponent,
  TextFieldErrorClientComponent,
  TextFieldErrorServerComponent,
  TextFieldLabelClientComponent,
  TextFieldLabelServerComponent,
  TextFieldServerComponent,
  TextFieldServerProps,
} from './fields/Text.js'

export type {
  TextareaFieldClientComponent,
  TextareaFieldClientProps,
  TextareaFieldDescriptionClientComponent,
  TextareaFieldDescriptionServerComponent,
  TextareaFieldDiffClientComponent,
  TextareaFieldDiffServerComponent,
  TextareaFieldErrorClientComponent,
  TextareaFieldErrorServerComponent,
  TextareaFieldLabelClientComponent,
  TextareaFieldLabelServerComponent,
  TextareaFieldServerComponent,
  TextareaFieldServerProps,
} from './fields/Textarea.js'

export type {
  UIFieldClientComponent,
  UIFieldClientProps,
  UIFieldDiffClientComponent,
  UIFieldDiffServerComponent,
  UIFieldServerComponent,
  UIFieldServerProps,
} from './fields/UI.js'

export type {
  UploadFieldClientComponent,
  UploadFieldClientProps,
  UploadFieldDescriptionClientComponent,
  UploadFieldDescriptionServerComponent,
  UploadFieldDiffClientComponent,
  UploadFieldDiffServerComponent,
  UploadFieldErrorClientComponent,
  UploadFieldErrorServerComponent,
  UploadFieldLabelClientComponent,
  UploadFieldLabelServerComponent,
  UploadFieldServerComponent,
  UploadFieldServerProps,
} from './fields/Upload.js'

export type {
  Description,
  DescriptionFunction,
  FieldDescriptionClientComponent,
  FieldDescriptionClientProps,
  FieldDescriptionServerComponent,
  FieldDescriptionServerProps,
  GenericDescriptionProps,
  StaticDescription,
} from './forms/Description.js'

export type {
  BaseVersionField,
  DiffMethod,
  FieldDiffClientComponent,
  FieldDiffClientProps,
  FieldDiffServerComponent,
  FieldDiffServerProps,
  VersionField,
  VersionTab,
} from './forms/Diff.js'

export type {
  BuildFormStateArgs,
  Data,
  FieldState as FormField,
  FieldStateWithoutComponents as FormFieldWithoutComponents,
  FilterOptionsResult,
  FormState,
  FormStateWithoutComponents,
  Row,
}

export type {
  FieldErrorClientComponent,
  FieldErrorClientProps,
  FieldErrorServerComponent,
  FieldErrorServerProps,
  GenericErrorProps,
} from './forms/Error.js'

export type {
  ClientComponentProps,
  ClientFieldBase,
  ClientFieldWithOptionalType,
  FieldClientComponent,
  FieldPaths,
  FieldServerComponent,
  ServerComponentProps,
  ServerFieldBase,
} from './forms/Field.js'

export type {
  FieldLabelClientComponent,
  FieldLabelClientProps,
  FieldLabelServerComponent,
  FieldLabelServerProps,
  GenericLabelProps,
  SanitizedLabelProps,
} from './forms/Label.js'

export type { RowLabel, RowLabelComponent } from './forms/RowLabel.js'

export type MappedServerComponent<TComponentClientProps extends JsonObject = JsonObject> = {
  Component?: React.ComponentType<TComponentClientProps>
  props?: Partial<any>
  RenderedComponent: React.ReactNode
  type: 'server'
}

export type MappedClientComponent<TComponentClientProps extends JsonObject = JsonObject> = {
  Component?: React.ComponentType<TComponentClientProps>
  props?: Partial<TComponentClientProps>
  RenderedComponent?: React.ReactNode
  type: 'client'
}

export type MappedEmptyComponent = {
  type: 'empty'
}

export enum Action {
  RenderConfig = 'render-config',
}

export type RenderEntityConfigArgs = {
  collectionSlug?: string
  data?: Data
  globalSlug?: string
}

export type RenderRootConfigArgs = {}

export type RenderFieldConfigArgs = {
  collectionSlug?: string
  formState?: FormState
  globalSlug?: string
  schemaPath: string
}

export type RenderConfigArgs = {
  action: Action.RenderConfig
  config: Promise<SanitizedConfig> | SanitizedConfig
  i18n: I18nClient
  importMap: ImportMap
  languageCode: AcceptedLanguages
  serverProps?: any
} & (RenderEntityConfigArgs | RenderFieldConfigArgs | RenderRootConfigArgs)

export type PayloadServerAction = (
  args:
    | {
        [key: string]: any
        action: Action
        i18n: I18nClient
      }
    | RenderConfigArgs,
) => Promise<string>

export type RenderedField = {
  Field: React.ReactNode
  indexPath?: string
  initialSchemaPath?: string
  /**
   * @deprecated
   * This is a legacy property that will be removed in v4.
   * Please use `fieldIsSidebar(field)` from `payload` instead.
   * Or check `field.admin.position === 'sidebar'` directly.
   */
  isSidebar: boolean
  path: string
  schemaPath: string
  type: FieldTypes
}

export type FieldRow = {
  RowLabel?: React.ReactNode
}

export type DocumentSlots = {
  BeforeDocumentControls?: React.ReactNode
  Description?: React.ReactNode
  EditMenuItems?: React.ReactNode
  LivePreview?: React.ReactNode
  PreviewButton?: React.ReactNode
  PublishButton?: React.ReactNode
  SaveButton?: React.ReactNode
  SaveDraftButton?: React.ReactNode
  Upload?: React.ReactNode
  UploadControls?: React.ReactNode
}

export type {
  BuildCollectionFolderViewResult,
  BuildTableStateArgs,
  DefaultServerFunctionArgs,
  GetFolderResultsComponentAndDataArgs,
  ListQuery,
  ServerFunction,
  ServerFunctionArgs,
  ServerFunctionClient,
  ServerFunctionClientArgs,
  ServerFunctionConfig,
  ServerFunctionHandler,
  SlugifyServerFunctionArgs,
} from './functions/index.js'

export type { LanguageOptions } from './LanguageOptions.js'

export type { RichTextAdapter, RichTextAdapterProvider, RichTextHooks } from './RichText.js'

export type {
  BeforeDocumentControlsClientProps,
  BeforeDocumentControlsServerProps,
  BeforeDocumentControlsServerPropsOnly,
  DocumentSubViewTypes,
  DocumentTabClientProps,
  /**
   * @deprecated
   * The `DocumentTabComponent` type is deprecated and will be removed in the next major version.
   * Use `DocumentTabServerProps`or `DocumentTabClientProps` instead.
   */
  DocumentTabComponent,
  DocumentTabCondition,
  DocumentTabConfig,
  /**
   * @deprecated
   * The `DocumentTabProps` type is deprecated and will be removed in the next major version.
   * Use `DocumentTabServerProps` instead.
   */
  DocumentTabServerProps as DocumentTabProps,
  DocumentTabServerProps,
  DocumentTabServerPropsOnly,
  /**
   * @deprecated
   * The `ClientSideEditViewProps` type is deprecated and will be removed in the next major version.
   * Use `DocumentViewClientProps` instead.
   */
  DocumentViewClientProps as ClientSideEditViewProps,
  DocumentViewClientProps,
  /**
   * @deprecated
   * The `ServerSideEditViewProps` is deprecated and will be removed in the next major version.
   * Use `DocumentViewServerProps` instead.
   */
  DocumentViewServerProps as ServerSideEditViewProps,
  DocumentViewServerProps,
  DocumentViewServerPropsOnly,
  EditViewProps,
  RenderDocumentVersionsProperties,
} from './views/document.js'

export type {
  AfterFolderListClientProps,
  AfterFolderListServerProps,
  AfterFolderListServerPropsOnly,
  AfterFolderListTableClientProps,
  AfterFolderListTableServerProps,
  AfterFolderListTableServerPropsOnly,
  BeforeFolderListClientProps,
  BeforeFolderListServerProps,
  BeforeFolderListServerPropsOnly,
  BeforeFolderListTableClientProps,
  BeforeFolderListTableServerProps,
  BeforeFolderListTableServerPropsOnly,
  FolderListViewClientProps,
  FolderListViewServerProps,
  FolderListViewServerPropsOnly,
  FolderListViewSlots,
  FolderListViewSlotSharedClientProps,
} from './views/folderList.js'

export type {
  AdminViewClientProps,
  /**
   * @deprecated
   * The `AdminViewComponent` type is deprecated and will be removed in the next major version.
   * Type your component props directly instead.
   */
  AdminViewComponent,
  AdminViewConfig,
  /**
   * @deprecated
   * The `AdminViewProps` type is deprecated and will be removed in the next major version.
   * Use `AdminViewServerProps` instead.
   */
  AdminViewServerProps as AdminViewProps,
  AdminViewServerProps,
  AdminViewServerPropsOnly,
  InitPageResult,
  ServerPropsFromView,
  ViewDescriptionClientProps,
  ViewDescriptionServerProps,
  ViewDescriptionServerPropsOnly,
  ViewTypes,
  VisibleEntities,
} from './views/index.js'

export type {
  AfterListClientProps,
  AfterListServerProps,
  AfterListServerPropsOnly,
  AfterListTableClientProps,
  AfterListTableServerProps,
  AfterListTableServerPropsOnly,
  BeforeListClientProps,
  BeforeListServerProps,
  BeforeListServerPropsOnly,
  BeforeListTableClientProps,
  BeforeListTableServerProps,
  BeforeListTableServerPropsOnly,
  ListViewClientProps,
  ListViewServerProps,
  ListViewServerPropsOnly,
  ListViewSlots,
  ListViewSlotSharedClientProps,
} from './views/list.js'

type SchemaPath = {} & string
export type FieldSchemaMap = Map<
  SchemaPath,
  | {
      fields: Field[]
    }
  | Block
  | Field
  | Tab
>

export type ClientFieldSchemaMap = Map<
  SchemaPath,
  | {
      fields: ClientField[]
    }
  | ClientBlock
  | ClientField
  | ClientTab
>

export type DocumentEvent = {
  doc?: TypeWithID
  drawerSlug?: string
  entitySlug: string
  id?: number | string
  operation: 'create' | 'update'
  updatedAt: string
}
```

--------------------------------------------------------------------------------

---[FILE: Cell.ts]---
Location: payload-main/packages/payload/src/admin/elements/Cell.ts

```typescript
import type { I18nClient } from '@payloadcms/translations'

import type { SanitizedCollectionConfig } from '../../collections/config/types.js'
import type {
  ArrayFieldClient,
  BlocksFieldClient,
  CheckboxFieldClient,
  ClientField,
  CodeFieldClient,
  DateFieldClient,
  EmailFieldClient,
  Field,
  GroupFieldClient,
  JSONFieldClient,
  NumberFieldClient,
  PointFieldClient,
  RadioFieldClient,
  RelationshipFieldClient,
  SelectFieldClient,
  TextareaFieldClient,
  TextFieldClient,
  UploadFieldClient,
} from '../../fields/config/types.js'
import type { Payload } from '../../types/index.js'
import type { ViewTypes } from '../types.js'

export type RowData = Record<string, any>

export type DefaultCellComponentProps<
  TField extends ClientField = ClientField,
  TCellData = undefined,
> = {
  readonly cellData: TCellData extends undefined
    ? TField extends RelationshipFieldClient
      ? number | Record<string, any> | string
      : TField extends NumberFieldClient
        ? TField['hasMany'] extends true
          ? number[]
          : number
        : TField extends TextFieldClient
          ? TField['hasMany'] extends true
            ? string[]
            : string
          : TField extends
                | CodeFieldClient
                | EmailFieldClient
                | JSONFieldClient
                | RadioFieldClient
                | TextareaFieldClient
            ? string
            : TField extends BlocksFieldClient
              ? {
                  [key: string]: any
                  blockType: string
                }[]
              : TField extends CheckboxFieldClient
                ? boolean
                : TField extends DateFieldClient
                  ? Date | number | string
                  : TField extends GroupFieldClient
                    ? Record<string, any>
                    : TField extends UploadFieldClient
                      ? File | string
                      : TField extends ArrayFieldClient
                        ? Record<string, unknown>[]
                        : TField extends SelectFieldClient
                          ? TField['hasMany'] extends true
                            ? string[]
                            : string
                          : TField extends PointFieldClient
                            ? { x: number; y: number }
                            : any
    : TCellData
  className?: string
  collectionSlug: SanitizedCollectionConfig['slug']
  columnIndex?: number
  customCellProps?: Record<string, any>
  field: TField
  link?: boolean
  linkURL?: string
  onClick?: (args: {
    cellData: unknown
    collectionSlug: SanitizedCollectionConfig['slug']
    rowData: RowData
  }) => void
  rowData: RowData
  viewType?: ViewTypes
}

export type DefaultServerCellComponentProps<
  TField extends ClientField = ClientField,
  TCellData = any,
> = {
  collectionConfig: SanitizedCollectionConfig
  field: Field
  i18n: I18nClient
  payload: Payload
} & Omit<DefaultCellComponentProps<TField, TCellData>, 'field'>
```

--------------------------------------------------------------------------------

---[FILE: DatePicker.ts]---
Location: payload-main/packages/payload/src/admin/elements/DatePicker.ts

```typescript
import type { DatePickerProps } from 'react-datepicker'

export type SharedProps = {
  displayFormat?: string
  overrides?: DatePickerProps
  pickerAppearance?: 'dayAndTime' | 'dayOnly' | 'default' | 'monthOnly' | 'timeOnly'
}

export type TimePickerProps = {
  maxTime?: Date
  minTime?: Date
  timeFormat?: string
  timeIntervals?: number
}

export type DayPickerProps = {
  maxDate?: Date
  minDate?: Date
  monthsToShow?: 1 | 2
}

export type MonthPickerProps = {
  maxDate?: Date
  minDate?: Date
}

export type ConditionalDateProps =
  | ({
      pickerAppearance: 'dayOnly'
    } & DayPickerProps &
      SharedProps)
  | ({
      pickerAppearance: 'monthOnly'
    } & MonthPickerProps &
      SharedProps)
  | ({
      pickerAppearance: 'timeOnly'
    } & SharedProps &
      TimePickerProps)
  | ({
      pickerAppearance?: 'dayAndTime'
    } & DayPickerProps &
      SharedProps &
      TimePickerProps)
  | ({
      pickerAppearance?: 'default'
    } & SharedProps)
```

--------------------------------------------------------------------------------

---[FILE: EditMenuItems.ts]---
Location: payload-main/packages/payload/src/admin/elements/EditMenuItems.ts

```typescript
import type { ServerProps } from '../../config/types.js'

export type EditMenuItemsClientProps = {}

export type EditMenuItemsServerPropsOnly = {} & ServerProps

export type EditMenuItemsServerProps = EditMenuItemsClientProps & EditMenuItemsServerPropsOnly
```

--------------------------------------------------------------------------------

---[FILE: Nav.ts]---
Location: payload-main/packages/payload/src/admin/elements/Nav.ts

```typescript
export type NavPreferences = {
  groups: NavGroupPreferences
  open: boolean
}

export type NavGroupPreferences = {
  [key: string]: {
    open: boolean
  }
}
```

--------------------------------------------------------------------------------

---[FILE: PreviewButton.ts]---
Location: payload-main/packages/payload/src/admin/elements/PreviewButton.ts

```typescript
import type { ServerProps } from '../../config/types.js'

export type PreviewButtonClientProps = {}

export type PreviewButtonServerPropsOnly = {} & ServerProps

export type PreviewButtonServerProps = PreviewButtonClientProps & PreviewButtonServerPropsOnly
```

--------------------------------------------------------------------------------

---[FILE: PublishButton.ts]---
Location: payload-main/packages/payload/src/admin/elements/PublishButton.ts

```typescript
import type { ServerProps } from '../../config/types.js'

export type PublishButtonClientProps = {
  label?: string
}

export type PublishButtonServerPropsOnly = {} & ServerProps

export type PublishButtonServerProps = PublishButtonClientProps & PublishButtonServerPropsOnly
```

--------------------------------------------------------------------------------

---[FILE: SaveButton.ts]---
Location: payload-main/packages/payload/src/admin/elements/SaveButton.ts

```typescript
import type { ServerProps } from '../../config/types.js'

export type SaveButtonClientProps = {
  label?: string
}

export type SaveButtonServerPropsOnly = {} & ServerProps

export type SaveButtonServerProps = SaveButtonClientProps & SaveButtonServerPropsOnly
```

--------------------------------------------------------------------------------

---[FILE: SaveDraftButton.ts]---
Location: payload-main/packages/payload/src/admin/elements/SaveDraftButton.ts

```typescript
import type { ServerProps } from '../../config/types.js'

export type SaveDraftButtonClientProps = {}

export type SaveDraftButtonServerPropsOnly = {} & ServerProps

export type SaveDraftButtonServerProps = SaveDraftButtonClientProps & SaveDraftButtonServerPropsOnly
```

--------------------------------------------------------------------------------

---[FILE: Table.ts]---
Location: payload-main/packages/payload/src/admin/elements/Table.ts

```typescript
import type { ClientField } from '../../fields/config/types.js'

export type Column = {
  readonly accessor: string
  readonly active: boolean
  readonly CustomLabel?: React.ReactNode
  readonly field: ClientField
  readonly Heading: React.ReactNode
  readonly renderedCells: React.ReactNode[]
}
```

--------------------------------------------------------------------------------

---[FILE: Upload.ts]---
Location: payload-main/packages/payload/src/admin/elements/Upload.ts

```typescript
import type { CustomComponent } from '../../config/types.js'

export type CustomUpload = CustomComponent
```

--------------------------------------------------------------------------------

````
