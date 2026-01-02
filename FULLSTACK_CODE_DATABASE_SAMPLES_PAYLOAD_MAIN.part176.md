---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 176
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 176 of 695)

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

---[FILE: Row.ts]---
Location: payload-main/packages/payload/src/admin/fields/Row.ts

```typescript
import type { MarkOptional } from 'ts-essentials'

import type { RowField, RowFieldClient } from '../../fields/config/types.js'
import type {
  ClientComponentProps,
  ClientFieldBase,
  FieldClientComponent,
  FieldPaths,
  FieldServerComponent,
  ServerFieldBase,
} from '../forms/Field.js'
import type {
  FieldDescriptionClientComponent,
  FieldDescriptionServerComponent,
  FieldDiffClientComponent,
  FieldDiffServerComponent,
  FieldErrorClientComponent,
  FieldErrorServerComponent,
  FieldLabelClientComponent,
  FieldLabelServerComponent,
} from '../types.js'

type RowFieldClientWithoutType = MarkOptional<RowFieldClient, 'type'>

type RowFieldBaseClientProps = Omit<FieldPaths, 'path'> & Pick<ClientComponentProps, 'forceRender'>

export type RowFieldClientProps = Omit<ClientFieldBase<RowFieldClientWithoutType>, 'path'> &
  RowFieldBaseClientProps

export type RowFieldServerProps = ServerFieldBase<RowField, RowFieldClientWithoutType>

export type RowFieldServerComponent = FieldServerComponent<RowField, RowFieldClientWithoutType>

export type RowFieldClientComponent = FieldClientComponent<
  RowFieldClientWithoutType,
  RowFieldBaseClientProps
>

export type RowFieldLabelServerComponent = FieldLabelServerComponent<
  RowField,
  RowFieldClientWithoutType
>

export type RowFieldLabelClientComponent = FieldLabelClientComponent<RowFieldClientWithoutType>

export type RowFieldDescriptionServerComponent = FieldDescriptionServerComponent<
  RowField,
  RowFieldClientWithoutType
>

export type RowFieldDescriptionClientComponent =
  FieldDescriptionClientComponent<RowFieldClientWithoutType>

export type RowFieldErrorServerComponent = FieldErrorServerComponent<
  RowField,
  RowFieldClientWithoutType
>

export type RowFieldErrorClientComponent = FieldErrorClientComponent<RowFieldClientWithoutType>

export type RowFieldDiffServerComponent = FieldDiffServerComponent<RowField, RowFieldClient>

export type RowFieldDiffClientComponent = FieldDiffClientComponent<RowFieldClient>
```

--------------------------------------------------------------------------------

---[FILE: Select.ts]---
Location: payload-main/packages/payload/src/admin/fields/Select.ts

```typescript
import type { MarkOptional } from 'ts-essentials'

import type { SelectField, SelectFieldClient } from '../../fields/config/types.js'
import type { SelectFieldValidation } from '../../fields/validations.js'
import type { FieldErrorClientComponent, FieldErrorServerComponent } from '../forms/Error.js'
import type {
  ClientFieldBase,
  FieldClientComponent,
  FieldPaths,
  FieldServerComponent,
  ServerFieldBase,
} from '../forms/Field.js'
import type {
  FieldDescriptionClientComponent,
  FieldDescriptionServerComponent,
  FieldDiffClientComponent,
  FieldDiffServerComponent,
  FieldLabelClientComponent,
  FieldLabelServerComponent,
} from '../types.js'

type SelectFieldClientWithoutType = MarkOptional<SelectFieldClient, 'type'>

type SelectFieldBaseClientProps = {
  readonly onChange?: (e: string | string[]) => void
  readonly path: string
  readonly validate?: SelectFieldValidation
  readonly value?: string | string[]
}

type SelectFieldBaseServerProps = Pick<FieldPaths, 'path'>

export type SelectFieldClientProps = ClientFieldBase<SelectFieldClientWithoutType> &
  SelectFieldBaseClientProps

export type SelectFieldServerProps = SelectFieldBaseServerProps &
  ServerFieldBase<SelectField, SelectFieldClientWithoutType>

export type SelectFieldServerComponent = FieldServerComponent<
  SelectField,
  SelectFieldClientWithoutType,
  SelectFieldBaseServerProps
>

export type SelectFieldClientComponent = FieldClientComponent<
  SelectFieldClientWithoutType,
  SelectFieldBaseClientProps
>

export type SelectFieldLabelServerComponent = FieldLabelServerComponent<
  SelectField,
  SelectFieldClientWithoutType
>

export type SelectFieldLabelClientComponent =
  FieldLabelClientComponent<SelectFieldClientWithoutType>

export type SelectFieldDescriptionServerComponent = FieldDescriptionServerComponent<
  SelectField,
  SelectFieldClientWithoutType
>

export type SelectFieldDescriptionClientComponent =
  FieldDescriptionClientComponent<SelectFieldClientWithoutType>

export type SelectFieldErrorServerComponent = FieldErrorServerComponent<
  SelectField,
  SelectFieldClientWithoutType
>

export type SelectFieldErrorClientComponent =
  FieldErrorClientComponent<SelectFieldClientWithoutType>

export type SelectFieldDiffServerComponent = FieldDiffServerComponent<
  SelectField,
  SelectFieldClient
>

export type SelectFieldDiffClientComponent = FieldDiffClientComponent<SelectFieldClient>
```

--------------------------------------------------------------------------------

---[FILE: Tabs.ts]---
Location: payload-main/packages/payload/src/admin/fields/Tabs.ts

```typescript
import type { MarkOptional } from 'ts-essentials'

import type {
  ClientField,
  NamedTab,
  TabsField,
  TabsFieldClient,
  UnnamedTab,
} from '../../fields/config/types.js'
import type { FieldErrorClientComponent, FieldErrorServerComponent } from '../forms/Error.js'
import type {
  ClientFieldBase,
  FieldClientComponent,
  FieldPaths,
  FieldServerComponent,
  ServerFieldBase,
} from '../forms/Field.js'
import type {
  FieldDescriptionClientComponent,
  FieldDescriptionServerComponent,
  FieldDiffClientComponent,
  FieldDiffServerComponent,
  FieldLabelClientComponent,
  FieldLabelServerComponent,
} from '../types.js'

export type ClientTab =
  | ({ fields: ClientField[]; passesCondition?: boolean; readonly path?: string } & Omit<
      NamedTab,
      'fields'
    >)
  | ({ fields: ClientField[]; passesCondition?: boolean } & Omit<UnnamedTab, 'fields'>)

type TabsFieldBaseClientProps = FieldPaths

type TabsFieldClientWithoutType = MarkOptional<TabsFieldClient, 'type'>

export type TabsFieldClientProps = ClientFieldBase<TabsFieldClientWithoutType> &
  TabsFieldBaseClientProps

export type TabsFieldServerProps = ServerFieldBase<TabsField, TabsFieldClientWithoutType>

export type TabsFieldServerComponent = FieldServerComponent<TabsField, TabsFieldClientWithoutType>

export type TabsFieldClientComponent = FieldClientComponent<
  TabsFieldClientWithoutType,
  TabsFieldBaseClientProps
>

export type TabsFieldLabelServerComponent = FieldLabelServerComponent<
  TabsField,
  TabsFieldClientWithoutType
>

export type TabsFieldLabelClientComponent = FieldLabelClientComponent<TabsFieldClientWithoutType>

export type TabsFieldDescriptionServerComponent = FieldDescriptionServerComponent<
  TabsField,
  TabsFieldClientWithoutType
>

export type TabsFieldDescriptionClientComponent =
  FieldDescriptionClientComponent<TabsFieldClientWithoutType>

export type TabsFieldErrorServerComponent = FieldErrorServerComponent<
  TabsField,
  TabsFieldClientWithoutType
>

export type TabsFieldErrorClientComponent = FieldErrorClientComponent<TabsFieldClientWithoutType>

export type TabsFieldDiffServerComponent = FieldDiffServerComponent<TabsField, TabsFieldClient>

export type TabsFieldDiffClientComponent = FieldDiffClientComponent<TabsFieldClient>
```

--------------------------------------------------------------------------------

---[FILE: Text.ts]---
Location: payload-main/packages/payload/src/admin/fields/Text.ts
Signals: React

```typescript
import type React from 'react'
import type { MarkOptional } from 'ts-essentials'

import type { TextField, TextFieldClient } from '../../fields/config/types.js'
import type { TextFieldValidation } from '../../fields/validations.js'
import type { FieldErrorClientComponent, FieldErrorServerComponent } from '../forms/Error.js'
import type {
  ClientFieldBase,
  FieldClientComponent,
  FieldPaths,
  FieldServerComponent,
  ServerFieldBase,
} from '../forms/Field.js'
import type {
  FieldDescriptionClientComponent,
  FieldDescriptionServerComponent,
  FieldDiffClientComponent,
  FieldDiffServerComponent,
  FieldLabelClientComponent,
  FieldLabelServerComponent,
} from '../types.js'

type TextFieldClientWithoutType = MarkOptional<TextFieldClient, 'type'>

type TextFieldBaseClientProps = {
  readonly inputRef?: React.RefObject<HTMLInputElement>
  readonly onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>
  readonly path: string
  readonly validate?: TextFieldValidation
}

type TextFieldBaseServerProps = Pick<FieldPaths, 'path'>

export type TextFieldClientProps = ClientFieldBase<TextFieldClientWithoutType> &
  TextFieldBaseClientProps

export type TextFieldServerProps = ServerFieldBase<TextField, TextFieldClientWithoutType> &
  TextFieldBaseServerProps

export type TextFieldServerComponent = FieldServerComponent<
  TextField,
  TextFieldClientWithoutType,
  TextFieldBaseServerProps
>

export type TextFieldClientComponent = FieldClientComponent<
  TextFieldClientWithoutType,
  TextFieldBaseClientProps
>

export type TextFieldLabelServerComponent = FieldLabelServerComponent<
  TextField,
  TextFieldClientWithoutType
>

export type TextFieldLabelClientComponent = FieldLabelClientComponent<TextFieldClientWithoutType>

export type TextFieldDescriptionServerComponent = FieldDescriptionServerComponent<
  TextField,
  TextFieldClientWithoutType
>

export type TextFieldDescriptionClientComponent =
  FieldDescriptionClientComponent<TextFieldClientWithoutType>

export type TextFieldErrorServerComponent = FieldErrorServerComponent<
  TextField,
  TextFieldClientWithoutType
>

export type TextFieldErrorClientComponent = FieldErrorClientComponent<TextFieldClientWithoutType>

export type TextFieldDiffServerComponent = FieldDiffServerComponent<TextField, TextFieldClient>

export type TextFieldDiffClientComponent = FieldDiffClientComponent<TextFieldClient>
```

--------------------------------------------------------------------------------

---[FILE: Textarea.ts]---
Location: payload-main/packages/payload/src/admin/fields/Textarea.ts
Signals: React

```typescript
import type React from 'react'
import type { MarkOptional } from 'ts-essentials'

import type { TextareaField, TextareaFieldClient } from '../../fields/config/types.js'
import type { TextareaFieldValidation } from '../../fields/validations.js'
import type { FieldErrorClientComponent, FieldErrorServerComponent } from '../forms/Error.js'
import type {
  ClientFieldBase,
  FieldClientComponent,
  FieldPaths,
  FieldServerComponent,
  ServerFieldBase,
} from '../forms/Field.js'
import type {
  FieldDescriptionClientComponent,
  FieldDescriptionServerComponent,
  FieldDiffClientComponent,
  FieldDiffServerComponent,
  FieldLabelClientComponent,
  FieldLabelServerComponent,
} from '../types.js'

type TextareaFieldClientWithoutType = MarkOptional<TextareaFieldClient, 'type'>

type TextareaFieldBaseClientProps = {
  readonly inputRef?: React.Ref<HTMLInputElement>
  readonly onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>
  readonly path: string
  readonly validate?: TextareaFieldValidation
}

type TextareaFieldBaseServerProps = Pick<FieldPaths, 'path'>

export type TextareaFieldClientProps = ClientFieldBase<TextareaFieldClientWithoutType> &
  TextareaFieldBaseClientProps

export type TextareaFieldServerProps = ServerFieldBase<
  TextareaField,
  TextareaFieldClientWithoutType
> &
  TextareaFieldBaseServerProps

export type TextareaFieldServerComponent = FieldServerComponent<
  TextareaField,
  TextareaFieldClientWithoutType,
  TextareaFieldBaseServerProps
>

export type TextareaFieldClientComponent = FieldClientComponent<
  TextareaFieldClientWithoutType,
  TextareaFieldBaseClientProps
>

export type TextareaFieldLabelServerComponent = FieldLabelServerComponent<
  TextareaField,
  TextareaFieldClientWithoutType
>

export type TextareaFieldLabelClientComponent =
  FieldLabelClientComponent<TextareaFieldClientWithoutType>

export type TextareaFieldDescriptionServerComponent = FieldDescriptionServerComponent<
  TextareaField,
  TextareaFieldClientWithoutType
>

export type TextareaFieldDescriptionClientComponent =
  FieldDescriptionClientComponent<TextareaFieldClientWithoutType>

export type TextareaFieldErrorServerComponent = FieldErrorServerComponent<
  TextareaField,
  TextareaFieldClientWithoutType
>

export type TextareaFieldErrorClientComponent =
  FieldErrorClientComponent<TextareaFieldClientWithoutType>

export type TextareaFieldDiffServerComponent = FieldDiffServerComponent<
  TextareaField,
  TextareaFieldClient
>

export type TextareaFieldDiffClientComponent = FieldDiffClientComponent<TextareaFieldClient>
```

--------------------------------------------------------------------------------

---[FILE: UI.ts]---
Location: payload-main/packages/payload/src/admin/fields/UI.ts

```typescript
import type { MarkOptional } from 'ts-essentials'

import type { UIField, UIFieldClient } from '../../fields/config/types.js'
import type {
  ClientFieldBase,
  FieldClientComponent,
  FieldDiffClientComponent,
  FieldDiffServerComponent,
  FieldPaths,
  FieldServerComponent,
  ServerFieldBase,
} from '../types.js'

type UIFieldClientWithoutType = MarkOptional<UIFieldClient, 'type'>

type UIFieldBaseClientProps = {
  readonly path: string
}

type UIFieldBaseServerProps = Pick<FieldPaths, 'path'>

export type UIFieldClientProps = ClientFieldBase<UIFieldClientWithoutType> & UIFieldBaseClientProps

export type UIFieldServerProps = ServerFieldBase<UIField, UIFieldClientWithoutType> &
  UIFieldBaseServerProps

export type UIFieldClientComponent = FieldClientComponent<
  UIFieldClientWithoutType,
  UIFieldBaseClientProps
>

export type UIFieldServerComponent = FieldServerComponent<
  UIField,
  UIFieldClientWithoutType,
  UIFieldBaseServerProps
>

export type UIFieldDiffServerComponent = FieldDiffServerComponent<UIField, UIFieldClient>

export type UIFieldDiffClientComponent = FieldDiffClientComponent<UIFieldClient>
```

--------------------------------------------------------------------------------

---[FILE: Upload.ts]---
Location: payload-main/packages/payload/src/admin/fields/Upload.ts

```typescript
import type { MarkOptional } from 'ts-essentials'

import type { UploadField, UploadFieldClient } from '../../fields/config/types.js'
import type { UploadFieldValidation } from '../../fields/validations.js'
import type { FieldErrorClientComponent, FieldErrorServerComponent } from '../forms/Error.js'
import type {
  ClientFieldBase,
  FieldClientComponent,
  FieldPaths,
  FieldServerComponent,
  ServerFieldBase,
} from '../forms/Field.js'
import type {
  FieldDescriptionClientComponent,
  FieldDescriptionServerComponent,
  FieldDiffClientComponent,
  FieldDiffServerComponent,
  FieldLabelClientComponent,
  FieldLabelServerComponent,
} from '../types.js'

type UploadFieldClientWithoutType = MarkOptional<UploadFieldClient, 'type'>

type UploadFieldBaseClientProps = {
  readonly path: string
  readonly validate?: UploadFieldValidation
}

type UploadFieldBaseServerProps = Pick<FieldPaths, 'path'>

export type UploadFieldClientProps = ClientFieldBase<UploadFieldClientWithoutType> &
  UploadFieldBaseClientProps

export type UploadFieldServerProps = ServerFieldBase<UploadField, UploadFieldClientWithoutType> &
  UploadFieldBaseServerProps

export type UploadFieldServerComponent = FieldServerComponent<
  UploadField,
  UploadFieldClientWithoutType,
  UploadFieldBaseServerProps
>

export type UploadFieldClientComponent = FieldClientComponent<
  UploadFieldClientWithoutType,
  UploadFieldBaseClientProps
>

export type UploadFieldLabelServerComponent = FieldLabelServerComponent<
  UploadField,
  UploadFieldClientWithoutType
>

export type UploadFieldLabelClientComponent =
  FieldLabelClientComponent<UploadFieldClientWithoutType>

export type UploadFieldDescriptionServerComponent = FieldDescriptionServerComponent<
  UploadField,
  UploadFieldClientWithoutType
>

export type UploadFieldDescriptionClientComponent =
  FieldDescriptionClientComponent<UploadFieldClientWithoutType>

export type UploadFieldErrorServerComponent = FieldErrorServerComponent<
  UploadField,
  UploadFieldClientWithoutType
>

export type UploadFieldErrorClientComponent =
  FieldErrorClientComponent<UploadFieldClientWithoutType>

export type UploadFieldDiffServerComponent = FieldDiffServerComponent<
  UploadField,
  UploadFieldClient
>

export type UploadFieldDiffClientComponent = FieldDiffClientComponent<UploadFieldClient>
```

--------------------------------------------------------------------------------

---[FILE: Description.ts]---
Location: payload-main/packages/payload/src/admin/forms/Description.ts

```typescript
import type { I18nClient, TFunction } from '@payloadcms/translations'

import type { Field } from '../../fields/config/types.js'
import type { ClientFieldWithOptionalType, ServerComponentProps } from './Field.js'

export type DescriptionFunction = (args: { i18n: I18nClient; t: TFunction }) => string

export type FieldDescriptionClientComponent<
  TFieldClient extends ClientFieldWithOptionalType = ClientFieldWithOptionalType,
> = React.ComponentType<FieldDescriptionClientProps<TFieldClient>>

export type FieldDescriptionServerComponent<
  TFieldServer extends Field = Field,
  TFieldClient extends ClientFieldWithOptionalType = ClientFieldWithOptionalType,
> = React.ComponentType<FieldDescriptionServerProps<TFieldServer, TFieldClient>>

export type StaticDescription = Record<string, string> | string

export type Description = DescriptionFunction | StaticDescription

export type GenericDescriptionProps = {
  readonly className?: string
  readonly description?: StaticDescription
  readonly marginPlacement?: 'bottom' | 'top'
  readonly path: string
}

export type FieldDescriptionServerProps<
  TFieldServer extends Field = Field,
  TFieldClient extends ClientFieldWithOptionalType = ClientFieldWithOptionalType,
> = {
  clientField: TFieldClient
  readonly field: TFieldServer
} & GenericDescriptionProps &
  ServerComponentProps

export type FieldDescriptionClientProps<
  TFieldClient extends ClientFieldWithOptionalType = ClientFieldWithOptionalType,
> = {
  field: TFieldClient
} & GenericDescriptionProps
```

--------------------------------------------------------------------------------

---[FILE: Diff.ts]---
Location: payload-main/packages/payload/src/admin/forms/Diff.ts

```typescript
import type { I18nClient } from '@payloadcms/translations'

import type { ClientField, Field, FieldTypes, Tab } from '../../fields/config/types.js'
import type {
  ClientFieldWithOptionalType,
  PayloadRequest,
  SanitizedFieldPermissions,
  SanitizedFieldsPermissions,
} from '../../index.js'

export type VersionTab = {
  fields: VersionField[]
  name?: string
} & Pick<Tab, 'label'>

export type BaseVersionField = {
  CustomComponent?: React.ReactNode
  fields: VersionField[]
  path: string
  rows?: VersionField[][]
  schemaPath: string
  tabs?: VersionTab[]
  type: FieldTypes
}

export type VersionField = {
  field?: BaseVersionField
  fieldByLocale?: Record<string, BaseVersionField>
}

/**
 * Taken from react-diff-viewer-continued
 *
 * @deprecated remove in 4.0 - react-diff-viewer-continued is no longer a dependency
 */
export declare enum DiffMethod {
  CHARS = 'diffChars',
  CSS = 'diffCss',
  JSON = 'diffJson',
  LINES = 'diffLines',
  SENTENCES = 'diffSentences',
  TRIMMED_LINES = 'diffTrimmedLines',
  WORDS = 'diffWords',
  WORDS_WITH_SPACE = 'diffWordsWithSpace',
}

export type FieldDiffClientProps<TClientField extends ClientFieldWithOptionalType = ClientField> = {
  baseVersionField: BaseVersionField
  /**
   * Field value from the version being compared from
   */
  comparisonValue: unknown // TODO: change to valueFrom in 4.0
  /**
   * @deprecated remove in 4.0. react-diff-viewer-continued is no longer a dependency
   */
  diffMethod: any
  field: TClientField
  /**
   * Permissions at this level of the field. If this field is unnamed, this will be `SanitizedFieldsPermissions` - if it is named, it will be `SanitizedFieldPermissions`
   */
  fieldPermissions: SanitizedFieldPermissions | SanitizedFieldsPermissions
  /**
   * If this field is localized, this will be the locale of the field
   */
  locale?: string
  nestingLevel?: number
  parentIsLocalized: boolean
  /**
   * Field value from the version being compared to
   *
   */
  versionValue: unknown // TODO: change to valueTo in 4.0
}

export type FieldDiffServerProps<
  TField extends Field = Field,
  TClientField extends ClientFieldWithOptionalType = ClientField,
> = {
  clientField: TClientField
  field: TField
  i18n: I18nClient
  req: PayloadRequest
  selectedLocales: string[]
} & Omit<FieldDiffClientProps, 'field'>

export type FieldDiffClientComponent<
  TFieldClient extends ClientFieldWithOptionalType = ClientFieldWithOptionalType,
> = React.ComponentType<FieldDiffClientProps<TFieldClient>>

export type FieldDiffServerComponent<
  TFieldServer extends Field = Field,
  TFieldClient extends ClientFieldWithOptionalType = ClientFieldWithOptionalType,
> = React.ComponentType<FieldDiffServerProps<TFieldServer, TFieldClient>>
```

--------------------------------------------------------------------------------

---[FILE: Error.ts]---
Location: payload-main/packages/payload/src/admin/forms/Error.ts

```typescript
import type { Field } from '../../fields/config/types.js'
import type { ClientFieldWithOptionalType, ServerComponentProps } from './Field.js'

export type GenericErrorProps = {
  readonly alignCaret?: 'center' | 'left' | 'right'
  readonly message?: string
  readonly path?: string
  readonly showError?: boolean
}

export type FieldErrorClientProps<
  TFieldClient extends ClientFieldWithOptionalType = ClientFieldWithOptionalType,
> = {
  field: TFieldClient
} & GenericErrorProps

export type FieldErrorServerProps<
  TFieldServer extends Field,
  TFieldClient extends ClientFieldWithOptionalType = ClientFieldWithOptionalType,
> = {
  clientField: TFieldClient
  readonly field: TFieldServer
} & GenericErrorProps &
  ServerComponentProps

export type FieldErrorClientComponent<
  TFieldClient extends ClientFieldWithOptionalType = ClientFieldWithOptionalType,
> = React.ComponentType<FieldErrorClientProps<TFieldClient>>

export type FieldErrorServerComponent<
  TFieldServer extends Field = Field,
  TFieldClient extends ClientFieldWithOptionalType = ClientFieldWithOptionalType,
> = React.ComponentType<FieldErrorServerProps<TFieldServer, TFieldClient>>
```

--------------------------------------------------------------------------------

---[FILE: Field.ts]---
Location: payload-main/packages/payload/src/admin/forms/Field.ts

```typescript
import type { I18nClient } from '@payloadcms/translations'
import type { MarkOptional } from 'ts-essentials'

import type { SanitizedFieldPermissions } from '../../auth/types.js'
import type { ClientBlock, ClientField, Field } from '../../fields/config/types.js'
import type { TypedUser } from '../../index.js'
import type { DocumentPreferences } from '../../preferences/types.js'
import type { Operation, Payload, PayloadRequest } from '../../types/index.js'
import type {
  ClientFieldSchemaMap,
  ClientTab,
  Data,
  FieldSchemaMap,
  FormField,
  FormState,
  RenderedField,
} from '../types.js'

export type ClientFieldWithOptionalType = MarkOptional<ClientField, 'type'>

export type ClientComponentProps = {
  customComponents?: FormField['customComponents']
  field: ClientBlock | ClientField | ClientTab
  /**
   * Controls the rendering behavior of the fields, i.e. defers rendering until they intersect with the viewport using the Intersection Observer API.
   *
   * If true, the fields will be rendered immediately, rather than waiting for them to intersect with the viewport.
   *
   * If a number is provided, will immediately render fields _up to that index_.
   */
  forceRender?: boolean
  permissions?: SanitizedFieldPermissions
  readOnly?: boolean
  renderedBlocks?: RenderedField[]
  /**
   * Used to extract field configs from a schemaMap.
   * Does not include indexes.
   *
   * @default field.name
   **/
  schemaPath?: string
}

// TODO: maybe we can come up with a better name?
export type FieldPaths = {
  /**
   * @default ''
   */
  indexPath?: string
  /**
   * @default ''
   */
  parentPath?: string
  /**
   * The path built up to the point of the field
   * excluding the field name.
   *
   * @default ''
   */
  parentSchemaPath?: string
  /**
   * A built up path to access FieldState in the form state.
   * Nested fields will have a path that includes the parent field names
   * if they are nested within a group, array, block or named tab.
   *
   * Collapsibles and unnamed tabs will have arbitrary paths
   * that look like _index-0, _index-1, etc.
   *
   * Row fields will not have a path.
   *
   * @example 'parentGroupField.childTextField'
   *
   * @default field.name
   */
  path: string
}

/**
 * TODO: This should be renamed to `FieldComponentServerProps` or similar
 */
export type ServerComponentProps = {
  clientField: ClientFieldWithOptionalType
  clientFieldSchemaMap: ClientFieldSchemaMap
  collectionSlug: string
  data: Data
  field: Field
  /**
   * The fieldSchemaMap that is created before form state is built is made available here.
   */
  fieldSchemaMap: FieldSchemaMap
  /**
   * Server Components will also have available to the entire form state.
   * We cannot add it to ClientComponentProps as that would blow up the size of the props sent to the client.
   */
  formState: FormState
  i18n: I18nClient
  id?: number | string
  operation: Operation
  payload: Payload
  permissions: SanitizedFieldPermissions
  preferences: DocumentPreferences
  req: PayloadRequest
  siblingData: Data
  user: TypedUser
  value?: unknown
}

export type ClientFieldBase<
  TFieldClient extends ClientFieldWithOptionalType = ClientFieldWithOptionalType,
> = {
  readonly field: TFieldClient
} & Omit<ClientComponentProps, 'customComponents' | 'field'>

export type ServerFieldBase<
  TFieldServer extends Field = Field,
  TFieldClient extends ClientFieldWithOptionalType = ClientFieldWithOptionalType,
> = {
  readonly clientField: TFieldClient
  readonly field: TFieldServer
} & Omit<ClientComponentProps, 'field'> &
  Omit<ServerComponentProps, 'clientField' | 'field'>

export type FieldClientComponent<
  TFieldClient extends ClientFieldWithOptionalType = ClientFieldWithOptionalType,
  AdditionalProps extends Record<string, unknown> = Record<string, unknown>,
> = React.ComponentType<AdditionalProps & ClientFieldBase<TFieldClient>>

export type FieldServerComponent<
  TFieldServer extends Field = Field,
  TFieldClient extends ClientFieldWithOptionalType = ClientFieldWithOptionalType,
  AdditionalProps extends Record<string, unknown> = Record<string, unknown>,
> = React.ComponentType<AdditionalProps & ServerFieldBase<TFieldServer, TFieldClient>>
```

--------------------------------------------------------------------------------

---[FILE: Form.ts]---
Location: payload-main/packages/payload/src/admin/forms/Form.ts

```typescript
import { type SupportedLanguages } from '@payloadcms/translations'

import type { SanitizedDocumentPermissions } from '../../auth/types.js'
import type { Field, Option, Validate } from '../../fields/config/types.js'
import type { TypedLocale } from '../../index.js'
import type { DocumentPreferences } from '../../preferences/types.js'
import type { PayloadRequest, SelectType, Where } from '../../types/index.js'

export type Data = {
  [key: string]: any
}

export type Row = {
  addedByServer?: FieldState['addedByServer']
  blockType?: string
  collapsed?: boolean
  customComponents?: {
    RowLabel?: React.ReactNode
  }
  id: string
  isLoading?: boolean
  lastRenderedPath?: string
}

export type FilterOptionsResult = {
  [relation: string]: boolean | Where
}

export type FieldState = {
  /**
   * This is used to determine if the field was added by the server.
   * This ensures the field is not ignored by the client when merging form state.
   * This can happen because the current local state is treated as the source of truth.
   * See `mergeServerFormState` for more details.
   */
  addedByServer?: boolean
  /**
   * If the field is a `blocks` field, this will contain the slugs of blocks that are allowed, based on the result of `field.filterOptions`.
   * If this is undefined, all blocks are allowed.
   * If this is an empty array, no blocks are allowed.
   */
  blocksFilterOptions?: string[]
  customComponents?: {
    /**
     * This is used by UI fields, as they can have arbitrary components defined if used
     * as a vessel to bring in custom components.
     */
    [key: string]: React.ReactNode | React.ReactNode[] | undefined
    AfterInput?: React.ReactNode
    BeforeInput?: React.ReactNode
    Description?: React.ReactNode
    Error?: React.ReactNode
    Field?: React.ReactNode
    Label?: React.ReactNode
  }
  disableFormData?: boolean
  errorMessage?: string
  errorPaths?: string[]
  /**
   * The fieldSchema may be part of the form state if `includeSchema: true` is passed to buildFormState.
   * This will never be in the form state of the client.
   */
  fieldSchema?: Field
  filterOptions?: FilterOptionsResult
  initialValue?: unknown
  /**
   * Every time a field is changed locally, this flag is set to true. Prevents form state from server from overwriting local changes.
   * After merging server form state, this flag is reset.
   *
   * @experimental This property is experimental and may change in the future. Use at your own risk.
   */
  isModified?: boolean
  /**
   * The path of the field when its custom components were last rendered.
   * This is used to denote if a field has been rendered, and if so,
   * what path it was rendered under last.
   *
   * If this path is undefined, or, if it is different
   * from the current path of a given field, the field's components will be re-rendered.
   */
  lastRenderedPath?: string
  passesCondition?: boolean
  rows?: Row[]
  /**
   * The result of running `field.filterOptions` on select fields.
   */
  selectFilterOptions?: Option[]
  valid?: boolean
  validate?: Validate
  value?: unknown
}

export type FieldStateWithoutComponents = Omit<FieldState, 'customComponents'>

export type FormState = {
  [path: string]: FieldState
}

export type FormStateWithoutComponents = {
  [path: string]: FieldStateWithoutComponents
}

export type BuildFormStateArgs = {
  data?: Data
  docPermissions: SanitizedDocumentPermissions | undefined
  docPreferences: DocumentPreferences
  /**
   * In case `formState` is not the top-level, document form state, this can be passed to
   * provide the top-level form state.
   */
  documentFormState?: FormState
  fallbackLocale?: false | TypedLocale
  formState?: FormState
  id?: number | string
  initialBlockData?: Data
  initialBlockFormState?: FormState
  /*
    If not i18n was passed, the language can be passed to init i18n
  */
  language?: keyof SupportedLanguages
  locale?: string
  /**
   * If true, will not render RSCs and instead return a simple string in their place.
   * This is useful for environments that lack RSC support, such as Jest.
   * Form state can still be built, but any server components will be omitted.
   * @default false
   */
  mockRSCs?: boolean
  operation?: 'create' | 'update'
  readOnly?: boolean
  /**
   * If true, will render field components within their state object.
   * Performance optimization: Setting to `false` ensures that only fields that have changed paths will re-render, e.g. new array rows, etc.
   * For example, you only need to render ALL fields on initial render, not on every onChange.
   */
  renderAllFields?: boolean
  req: PayloadRequest
  /**
   * If true, will return a fresh URL for live preview based on the current form state.
   * Note: this will run on every form state event, so if your `livePreview.url` function is long running or expensive,
   * ensure it caches itself as needed.
   */
  returnLivePreviewURL?: boolean
  returnLockStatus?: boolean
  /**
   * If true, will return a fresh URL for preview based on the current form state.
   * Note: this will run on every form state event, so if your `preview` function is long running or expensive,
   * ensure it caches itself as needed.
   */
  returnPreviewURL?: boolean
  schemaPath: string
  select?: SelectType
  /**
   * When true, sets `user: true` when calling `getClientConfig`.
   * This will retrieve the client config in its entirety, even when unauthenticated.
   * For example, the create-first-user view needs the entire config, but there is no user yet.
   *
   * @experimental This property is experimental and may change in the future. Use at your own risk.
   */
  skipClientConfigAuth?: boolean
  skipValidation?: boolean
  updateLastEdited?: boolean
} & (
  | {
      collectionSlug: string
      // Do not type it as never. This still makes it so that either collectionSlug or globalSlug is required, but makes it easier to provide both collectionSlug and globalSlug if it's
      // unclear which one is actually available.
      globalSlug?: string
    }
  | {
      collectionSlug?: string
      globalSlug: string
    }
)
```

--------------------------------------------------------------------------------

---[FILE: Label.ts]---
Location: payload-main/packages/payload/src/admin/forms/Label.ts

```typescript
import type { StaticLabel } from '../../config/types.js'
import type { Field } from '../../fields/config/types.js'
import type { ClientFieldWithOptionalType, ServerComponentProps } from './Field.js'

export type GenericLabelProps = {
  readonly as?: 'h3' | 'label' | 'span'
  readonly hideLocale?: boolean
  readonly htmlFor?: string
  readonly label?: StaticLabel
  readonly localized?: boolean
  readonly path?: string
  readonly required?: boolean
  readonly unstyled?: boolean
}

export type FieldLabelClientProps<
  TFieldClient extends Partial<ClientFieldWithOptionalType> = Partial<ClientFieldWithOptionalType>,
> = {
  field?: TFieldClient
} & GenericLabelProps

export type FieldLabelServerProps<
  TFieldServer extends Field,
  TFieldClient extends ClientFieldWithOptionalType = ClientFieldWithOptionalType,
> = {
  clientField: TFieldClient
  readonly field: TFieldServer
} & GenericLabelProps &
  ServerComponentProps

export type SanitizedLabelProps<TFieldClient extends ClientFieldWithOptionalType> = Omit<
  FieldLabelClientProps<TFieldClient>,
  'label' | 'required'
>

export type FieldLabelClientComponent<
  TFieldClient extends ClientFieldWithOptionalType = ClientFieldWithOptionalType,
> = React.ComponentType<FieldLabelClientProps<TFieldClient>>

export type FieldLabelServerComponent<
  TFieldServer extends Field = Field,
  TFieldClient extends ClientFieldWithOptionalType = ClientFieldWithOptionalType,
> = React.ComponentType<FieldLabelServerProps<TFieldServer, TFieldClient>>
```

--------------------------------------------------------------------------------

---[FILE: RowLabel.ts]---
Location: payload-main/packages/payload/src/admin/forms/RowLabel.ts

```typescript
import type { CustomComponent } from '../../config/types.js'

export type RowLabelComponent = CustomComponent

export type RowLabel = Record<string, string> | string
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/payload/src/admin/functions/index.ts

```typescript
import type { ImportMap } from '../../bin/generateImportMap/index.js'
import type { SanitizedConfig } from '../../config/types.js'
import type { PaginatedDocs } from '../../database/types.js'
import type { Slugify } from '../../fields/baseFields/slug/index.js'
import type {
  CollectionSlug,
  ColumnPreference,
  FieldPaths,
  FolderSortKeys,
  GlobalSlug,
} from '../../index.js'
import type { PayloadRequest, Sort, Where } from '../../types/index.js'
import type { ColumnsFromURL } from '../../utilities/transformColumnPreferences.js'

export type DefaultServerFunctionArgs = {
  importMap: ImportMap
  req: PayloadRequest
}

export type ServerFunctionArgs = {
  args: Record<string, unknown>
  name: string
}

export type ServerFunctionClientArgs = {
  args: Record<string, unknown>
  name: string
}

export type ServerFunctionClient = (args: ServerFunctionClientArgs) => Promise<unknown> | unknown

export type ServerFunction<
  TArgs extends object = Record<string, unknown>,
  TReturnType = Promise<unknown> | unknown,
> = (args: DefaultServerFunctionArgs & TArgs) => TReturnType

export type ServerFunctionConfig = {
  fn: ServerFunction
  name: string
}

export type ServerFunctionHandler = (
  args: {
    config: Promise<SanitizedConfig> | SanitizedConfig
    importMap: ImportMap
    /**
     * A map of server function names to their implementations. These are
     * registered alongside the base server functions and can be called
     * using the useServerFunctions() hook.
     *
     * @example
     * const { serverFunction } = useServerFunctions()
     *
     * const callServerFunction = useCallback(() => {
     *
     *  async function call() {
     *   const result = (await serverFunction({
     *    name: 'record-key',
     *    args: {
     *     // Your args
     *    },
     *   }))
     *
     *   // Do someting with the result
     *  }
     *
     *  void call()
     * }, [serverFunction])
     */
    serverFunctions?: Record<string, ServerFunction<any, any>>
  } & ServerFunctionClientArgs,
) => Promise<unknown>

export type ListQuery = {
  /*
   * This is an of strings, i.e. `['title', '-slug']`
   * Use `transformColumnsToPreferences` and `transformColumnsToSearchParams` to convert it back and forth
   */
  columns?: ColumnsFromURL
  /*
   * A string representing the field to group by, e.g. `category`
   * A leading hyphen represents descending order, e.g. `-category`
   */
  groupBy?: string
  limit?: number
  page?: number
  preset?: number | string
  queryByGroup?: Record<string, ListQuery>
  /*
    When provided, is automatically injected into the `where` object
  */
  search?: string
  sort?: Sort
  where?: Where
} & Record<string, unknown>

export type BuildTableStateArgs = {
  /**
   * If an array is provided, the table will be built to support polymorphic collections.
   */
  collectionSlug: string | string[]
  columns?: ColumnPreference[]
  data?: PaginatedDocs
  /**
   * @deprecated Use `data` instead
   */
  docs?: PaginatedDocs['docs']
  enableRowSelections?: boolean
  orderableFieldName: string
  parent?: {
    collectionSlug: CollectionSlug
    id: number | string
    joinPath: string
  }
  query?: ListQuery
  renderRowTypes?: boolean
  req: PayloadRequest
  tableAppearance?: 'condensed' | 'default'
}

export type BuildCollectionFolderViewResult = {
  View: React.ReactNode
}

export type GetFolderResultsComponentAndDataArgs = {
  /**
   * If true and no folderID is provided, only folders will be returned.
   * If false, the results will include documents from the active collections.
   */
  browseByFolder: boolean
  /**
   * Used to filter document types to include in the results/display.
   *
   * i.e. ['folders', 'posts'] will only include folders and posts in the results.
   *
   * collectionsToQuery?
   */
  collectionsToDisplay: CollectionSlug[]
  /**
   * Used to determine how the results should be displayed.
   */
  displayAs: 'grid' | 'list'
  /**
   * Used to filter folders by the collections they are assigned to.
   *
   * i.e. ['posts'] will only include folders that are assigned to the posts collections.
   */
  folderAssignedCollections: CollectionSlug[]
  /**
   * The ID of the folder to filter results by.
   */
  folderID: number | string | undefined
  req: PayloadRequest
  /**
   * The sort order for the results.
   */
  sort: FolderSortKeys
}

export type SlugifyServerFunctionArgs = {
  collectionSlug?: CollectionSlug
  globalSlug?: GlobalSlug
  path?: FieldPaths['path']
} & Omit<Parameters<Slugify>[0], 'req'>
```

--------------------------------------------------------------------------------

````
