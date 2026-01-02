---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 175
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 175 of 695)

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

---[FILE: WithServerSideProps.ts]---
Location: payload-main/packages/payload/src/admin/elements/WithServerSideProps.ts
Signals: React

```typescript
import type React from 'react'

import type { ServerProps } from '../../config/types.js'

export type WithServerSidePropsComponentProps = {
  [key: string]: any
  Component: React.ComponentType<any>
  serverOnlyProps: ServerProps
}

export type WithServerSidePropsComponent = React.FC<WithServerSidePropsComponentProps>
```

--------------------------------------------------------------------------------

---[FILE: Array.ts]---
Location: payload-main/packages/payload/src/admin/fields/Array.ts

```typescript
import type { MarkOptional } from 'ts-essentials'

import type { ArrayField, ArrayFieldClient } from '../../fields/config/types.js'
import type { ArrayFieldValidation } from '../../fields/validations.js'
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

type ArrayFieldClientWithoutType = MarkOptional<ArrayFieldClient, 'type'>

type ArrayFieldBaseClientProps = {
  readonly validate?: ArrayFieldValidation
} & FieldPaths

type ArrayFieldBaseServerProps = Pick<FieldPaths, 'path'>

export type ArrayFieldClientProps = ArrayFieldBaseClientProps &
  ClientFieldBase<ArrayFieldClientWithoutType>

export type ArrayFieldServerProps = ArrayFieldBaseServerProps &
  ServerFieldBase<ArrayField, ArrayFieldClientWithoutType>

export type ArrayFieldServerComponent = FieldServerComponent<
  ArrayField,
  ArrayFieldClientWithoutType,
  ArrayFieldBaseServerProps
>

export type ArrayFieldClientComponent = FieldClientComponent<
  ArrayFieldClientWithoutType,
  ArrayFieldBaseClientProps
>

export type ArrayFieldLabelServerComponent = FieldLabelServerComponent<
  ArrayField,
  ArrayFieldClientWithoutType
>

export type ArrayFieldLabelClientComponent = FieldLabelClientComponent<ArrayFieldClientWithoutType>

export type ArrayFieldDescriptionServerComponent = FieldDescriptionServerComponent<
  ArrayField,
  ArrayFieldClientWithoutType
>
export type ArrayFieldDescriptionClientComponent =
  FieldDescriptionClientComponent<ArrayFieldClientWithoutType>

export type ArrayFieldErrorServerComponent = FieldErrorServerComponent<
  ArrayField,
  ArrayFieldClientWithoutType
>
export type ArrayFieldErrorClientComponent = FieldErrorClientComponent<ArrayFieldClientWithoutType>

export type ArrayFieldDiffServerComponent = FieldDiffServerComponent<ArrayField, ArrayFieldClient>
export type ArrayFieldDiffClientComponent = FieldDiffClientComponent<ArrayFieldClient>
```

--------------------------------------------------------------------------------

---[FILE: Blocks.ts]---
Location: payload-main/packages/payload/src/admin/fields/Blocks.ts
Signals: React

```typescript
import type React from 'react'
import type { MarkOptional } from 'ts-essentials'

import type { BlocksField, BlocksFieldClient } from '../../fields/config/types.js'
import type { BlocksFieldValidation } from '../../fields/validations.js'
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

type BlocksFieldClientWithoutType = MarkOptional<BlocksFieldClient, 'type'>

type BlocksFieldBaseClientProps = {
  readonly validate?: BlocksFieldValidation
} & FieldPaths

type BlocksFieldBaseServerProps = Pick<FieldPaths, 'path'>

export type BlocksFieldClientProps = BlocksFieldBaseClientProps &
  ClientFieldBase<BlocksFieldClientWithoutType>

export type BlocksFieldServerProps = BlocksFieldBaseServerProps &
  ServerFieldBase<BlocksField, BlocksFieldClientWithoutType>

export type BlocksFieldServerComponent = FieldServerComponent<
  BlocksField,
  BlocksFieldClientWithoutType,
  BlocksFieldBaseServerProps
>

export type BlocksFieldClientComponent = FieldClientComponent<
  BlocksFieldClientWithoutType,
  BlocksFieldBaseClientProps
>

export type BlocksFieldLabelServerComponent = FieldLabelServerComponent<
  BlocksField,
  BlocksFieldClientWithoutType
>

export type BlocksFieldLabelClientComponent =
  FieldLabelClientComponent<BlocksFieldClientWithoutType>

type BlockRowLabelBase = {
  blockType: string
  rowLabel: string
  rowNumber: number
}

export type BlockRowLabelClientComponent = React.ComponentType<
  BlockRowLabelBase & ClientFieldBase<BlocksFieldClientWithoutType>
>

export type BlockRowLabelServerComponent = React.ComponentType<
  BlockRowLabelBase & ServerFieldBase<BlocksField, BlocksFieldClientWithoutType>
>

export type BlocksFieldDescriptionServerComponent = FieldDescriptionServerComponent<
  BlocksField,
  BlocksFieldClientWithoutType
>

export type BlocksFieldDescriptionClientComponent =
  FieldDescriptionClientComponent<BlocksFieldClientWithoutType>

export type BlocksFieldErrorServerComponent = FieldErrorServerComponent<
  BlocksField,
  BlocksFieldClientWithoutType
>

export type BlocksFieldErrorClientComponent =
  FieldErrorClientComponent<BlocksFieldClientWithoutType>

export type BlocksFieldDiffServerComponent = FieldDiffServerComponent<
  BlocksField,
  BlocksFieldClient
>

export type BlocksFieldDiffClientComponent = FieldDiffClientComponent<BlocksFieldClient>
```

--------------------------------------------------------------------------------

---[FILE: Checkbox.ts]---
Location: payload-main/packages/payload/src/admin/fields/Checkbox.ts

```typescript
import type { MarkOptional } from 'ts-essentials'

import type { CheckboxField, CheckboxFieldClient } from '../../fields/config/types.js'
import type { CheckboxFieldValidation } from '../../fields/validations.js'
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

type CheckboxFieldClientWithoutType = MarkOptional<CheckboxFieldClient, 'type'>

type CheckboxFieldBaseClientProps = {
  readonly checked?: boolean
  readonly disableFormData?: boolean
  readonly id?: string
  readonly onChange?: (value: boolean) => void
  readonly partialChecked?: boolean
  readonly path: string
  readonly validate?: CheckboxFieldValidation
}

type CheckboxFieldBaseServerProps = Pick<FieldPaths, 'path'>

export type CheckboxFieldClientProps = CheckboxFieldBaseClientProps &
  ClientFieldBase<CheckboxFieldClientWithoutType>

export type CheckboxFieldServerProps = CheckboxFieldBaseServerProps &
  ServerFieldBase<CheckboxField, CheckboxFieldClientWithoutType>

export type CheckboxFieldServerComponent = FieldServerComponent<
  CheckboxField,
  CheckboxFieldClientWithoutType,
  CheckboxFieldBaseServerProps
>

export type CheckboxFieldClientComponent = FieldClientComponent<
  CheckboxFieldClientWithoutType,
  CheckboxFieldBaseClientProps
>

export type CheckboxFieldLabelServerComponent = FieldLabelServerComponent<
  CheckboxField,
  CheckboxFieldClientWithoutType
>

export type CheckboxFieldLabelClientComponent =
  FieldLabelClientComponent<CheckboxFieldClientWithoutType>

export type CheckboxFieldDescriptionServerComponent = FieldDescriptionServerComponent<
  CheckboxField,
  CheckboxFieldClientWithoutType
>

export type CheckboxFieldDescriptionClientComponent =
  FieldDescriptionClientComponent<CheckboxFieldClientWithoutType>

export type CheckboxFieldErrorServerComponent = FieldErrorServerComponent<
  CheckboxField,
  CheckboxFieldClientWithoutType
>

export type CheckboxFieldErrorClientComponent =
  FieldErrorClientComponent<CheckboxFieldClientWithoutType>

export type CheckboxFieldDiffServerComponent = FieldDiffServerComponent<
  CheckboxField,
  CheckboxFieldClient
>

export type CheckboxFieldDiffClientComponent = FieldDiffClientComponent<CheckboxFieldClient>
```

--------------------------------------------------------------------------------

---[FILE: Code.ts]---
Location: payload-main/packages/payload/src/admin/fields/Code.ts

```typescript
import type { EditorProps } from '@monaco-editor/react'
import type { MarkOptional } from 'ts-essentials'

import type { CodeField, CodeFieldClient } from '../../fields/config/types.js'
import type { CodeFieldValidation } from '../../fields/validations.js'
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

type CodeFieldClientWithoutType = MarkOptional<CodeFieldClient, 'type'>

type CodeFieldBaseClientProps = {
  readonly autoComplete?: string
  readonly onMount?: EditorProps['onMount']
  readonly path: string
  readonly validate?: CodeFieldValidation
}

type CodeFieldBaseServerProps = Pick<FieldPaths, 'path'>

export type CodeFieldClientProps = ClientFieldBase<CodeFieldClientWithoutType> &
  CodeFieldBaseClientProps

export type CodeFieldServerProps = CodeFieldBaseServerProps &
  ServerFieldBase<CodeField, CodeFieldClientWithoutType>

export type CodeFieldServerComponent = FieldServerComponent<
  CodeField,
  CodeFieldClientWithoutType,
  CodeFieldBaseServerProps
>

export type CodeFieldClientComponent = FieldClientComponent<
  CodeFieldClientWithoutType,
  CodeFieldBaseClientProps
>

export type CodeFieldLabelServerComponent = FieldLabelServerComponent<
  CodeField,
  CodeFieldClientWithoutType
>

export type CodeFieldLabelClientComponent = FieldLabelClientComponent<CodeFieldClientWithoutType>

export type CodeFieldDescriptionServerComponent = FieldDescriptionServerComponent<
  CodeField,
  CodeFieldClientWithoutType
>

export type CodeFieldDescriptionClientComponent =
  FieldDescriptionClientComponent<CodeFieldClientWithoutType>

export type CodeFieldErrorServerComponent = FieldErrorServerComponent<
  CodeField,
  CodeFieldClientWithoutType
>

export type CodeFieldErrorClientComponent = FieldErrorClientComponent<CodeFieldClientWithoutType>

export type CodeFieldDiffServerComponent = FieldDiffServerComponent<CodeField, CodeFieldClient>

export type CodeFieldDiffClientComponent = FieldDiffClientComponent<CodeFieldClient>
```

--------------------------------------------------------------------------------

---[FILE: Collapsible.ts]---
Location: payload-main/packages/payload/src/admin/fields/Collapsible.ts

```typescript
import type { MarkOptional } from 'ts-essentials'

import type { CollapsibleField, CollapsibleFieldClient } from '../../fields/config/types.js'
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

type CollapsibleFieldBaseClientProps = FieldPaths

type CollapsibleFieldClientWithoutType = MarkOptional<CollapsibleFieldClient, 'type'>

export type CollapsibleFieldClientProps = ClientFieldBase<CollapsibleFieldClientWithoutType> &
  CollapsibleFieldBaseClientProps

export type CollapsibleFieldServerProps = ServerFieldBase<
  CollapsibleField,
  CollapsibleFieldClientWithoutType
>

export type CollapsibleFieldServerComponent = FieldServerComponent<
  CollapsibleField,
  CollapsibleFieldClientWithoutType
>

export type CollapsibleFieldClientComponent = FieldClientComponent<
  CollapsibleFieldClientWithoutType,
  CollapsibleFieldBaseClientProps
>

export type CollapsibleFieldLabelServerComponent = FieldLabelServerComponent<
  CollapsibleField,
  CollapsibleFieldClientWithoutType
>

export type CollapsibleFieldLabelClientComponent =
  FieldLabelClientComponent<CollapsibleFieldClientWithoutType>

export type CollapsibleFieldDescriptionServerComponent = FieldDescriptionServerComponent<
  CollapsibleField,
  CollapsibleFieldClientWithoutType
>

export type CollapsibleFieldDescriptionClientComponent =
  FieldDescriptionClientComponent<CollapsibleFieldClientWithoutType>

export type CollapsibleFieldErrorServerComponent = FieldErrorServerComponent<
  CollapsibleField,
  CollapsibleFieldClientWithoutType
>

export type CollapsibleFieldErrorClientComponent =
  FieldErrorClientComponent<CollapsibleFieldClientWithoutType>

export type CollapsibleFieldDiffServerComponent = FieldDiffServerComponent<
  CollapsibleField,
  CollapsibleFieldClient
>

export type CollapsibleFieldDiffClientComponent = FieldDiffClientComponent<CollapsibleFieldClient>
```

--------------------------------------------------------------------------------

---[FILE: Date.ts]---
Location: payload-main/packages/payload/src/admin/fields/Date.ts

```typescript
import type { MarkOptional } from 'ts-essentials'

import type { DateField, DateFieldClient } from '../../fields/config/types.js'
import type { DateFieldValidation } from '../../fields/validations.js'
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

type DateFieldClientWithoutType = MarkOptional<DateFieldClient, 'type'>

type DateFieldBaseClientProps = {
  readonly path: string
  readonly validate?: DateFieldValidation
}

type DateFieldBaseServerProps = Pick<FieldPaths, 'path'>

export type DateFieldClientProps = ClientFieldBase<DateFieldClientWithoutType> &
  DateFieldBaseClientProps

export type DateFieldServerProps = DateFieldBaseServerProps &
  ServerFieldBase<DateField, DateFieldClientWithoutType>

export type DateFieldServerComponent = FieldServerComponent<
  DateField,
  DateFieldClientWithoutType,
  DateFieldBaseServerProps
>

export type DateFieldClientComponent = FieldClientComponent<
  DateFieldClientWithoutType,
  DateFieldBaseClientProps
>

export type DateFieldLabelServerComponent = FieldLabelServerComponent<
  DateField,
  DateFieldClientWithoutType
>

export type DateFieldLabelClientComponent = FieldLabelClientComponent<DateFieldClientWithoutType>

export type DateFieldDescriptionServerComponent = FieldDescriptionServerComponent<
  DateField,
  DateFieldClientWithoutType
>

export type DateFieldDescriptionClientComponent =
  FieldDescriptionClientComponent<DateFieldClientWithoutType>

export type DateFieldErrorServerComponent = FieldErrorServerComponent<
  DateField,
  DateFieldClientWithoutType
>

export type DateFieldErrorClientComponent = FieldErrorClientComponent<DateFieldClientWithoutType>

export type DateFieldDiffServerComponent = FieldDiffServerComponent<DateField, DateFieldClient>

export type DateFieldDiffClientComponent = FieldDiffClientComponent<DateFieldClient>
```

--------------------------------------------------------------------------------

---[FILE: Email.ts]---
Location: payload-main/packages/payload/src/admin/fields/Email.ts

```typescript
import type { MarkOptional } from 'ts-essentials'

import type { EmailField, EmailFieldClient } from '../../fields/config/types.js'
import type { EmailFieldValidation } from '../../fields/validations.js'
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

type EmailFieldClientWithoutType = MarkOptional<EmailFieldClient, 'type'>

type EmailFieldBaseClientProps = {
  readonly path: string
  readonly validate?: EmailFieldValidation
}

type EmailFieldBaseServerProps = Pick<FieldPaths, 'path'>

export type EmailFieldClientProps = ClientFieldBase<EmailFieldClientWithoutType> &
  EmailFieldBaseClientProps

export type EmailFieldServerProps = EmailFieldBaseServerProps &
  ServerFieldBase<EmailField, EmailFieldClientWithoutType>

export type EmailFieldServerComponent = FieldServerComponent<
  EmailField,
  EmailFieldClientWithoutType,
  EmailFieldBaseServerProps
>

export type EmailFieldClientComponent = FieldClientComponent<
  EmailFieldClientWithoutType,
  EmailFieldBaseClientProps
>

export type EmailFieldLabelServerComponent = FieldLabelServerComponent<
  EmailField,
  EmailFieldClientWithoutType
>

export type EmailFieldLabelClientComponent = FieldLabelClientComponent<EmailFieldClientWithoutType>

export type EmailFieldDescriptionServerComponent = FieldDescriptionServerComponent<
  EmailField,
  EmailFieldClientWithoutType
>

export type EmailFieldDescriptionClientComponent =
  FieldDescriptionClientComponent<EmailFieldClientWithoutType>

export type EmailFieldErrorServerComponent = FieldErrorServerComponent<
  EmailField,
  EmailFieldClientWithoutType
>

export type EmailFieldErrorClientComponent = FieldErrorClientComponent<EmailFieldClientWithoutType>

export type EmailFieldDiffServerComponent = FieldDiffServerComponent<EmailField, EmailFieldClient>

export type EmailFieldDiffClientComponent = FieldDiffClientComponent<EmailFieldClient>
```

--------------------------------------------------------------------------------

---[FILE: Group.ts]---
Location: payload-main/packages/payload/src/admin/fields/Group.ts

```typescript
import type { MarkOptional } from 'ts-essentials'

import type { GroupField, GroupFieldClient } from '../../fields/config/types.js'
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

type GroupFieldClientWithoutType = MarkOptional<GroupFieldClient, 'type'>

type GroupFieldBaseServerProps = Pick<FieldPaths, 'path'>

export type GroupFieldBaseClientProps = FieldPaths

export type GroupFieldClientProps = ClientFieldBase<GroupFieldClientWithoutType> &
  GroupFieldBaseClientProps

export type GroupFieldServerProps = GroupFieldBaseServerProps &
  ServerFieldBase<GroupField, GroupFieldClientWithoutType>

export type GroupFieldServerComponent = FieldServerComponent<
  GroupField,
  GroupFieldClientWithoutType,
  GroupFieldBaseServerProps
>

export type GroupFieldClientComponent = FieldClientComponent<
  GroupFieldClientWithoutType,
  GroupFieldBaseClientProps
>

export type GroupFieldLabelServerComponent = FieldLabelServerComponent<
  GroupField,
  GroupFieldClientWithoutType
>

export type GroupFieldLabelClientComponent = FieldLabelClientComponent<GroupFieldClientWithoutType>

export type GroupFieldDescriptionServerComponent = FieldDescriptionServerComponent<
  GroupField,
  GroupFieldClientWithoutType
>

export type GroupFieldDescriptionClientComponent =
  FieldDescriptionClientComponent<GroupFieldClientWithoutType>

export type GroupFieldErrorServerComponent = FieldErrorServerComponent<
  GroupField,
  GroupFieldClientWithoutType
>

export type GroupFieldErrorClientComponent = FieldErrorClientComponent<GroupFieldClientWithoutType>

export type GroupFieldDiffServerComponent = FieldDiffServerComponent<GroupField, GroupFieldClient>

export type GroupFieldDiffClientComponent = FieldDiffClientComponent<GroupFieldClient>
```

--------------------------------------------------------------------------------

---[FILE: Hidden.ts]---
Location: payload-main/packages/payload/src/admin/fields/Hidden.ts

```typescript
import type { ClientFieldBase } from '../types.js'

type HiddenFieldBaseClientProps = {
  readonly disableModifyingForm?: false
  readonly field?: never
  readonly path: string
  readonly value?: unknown
}

export type HiddenFieldProps = HiddenFieldBaseClientProps &
  Pick<ClientFieldBase, 'forceRender' | 'schemaPath'>
```

--------------------------------------------------------------------------------

---[FILE: Join.ts]---
Location: payload-main/packages/payload/src/admin/fields/Join.ts

```typescript
import type { MarkOptional } from 'ts-essentials'

import type { JoinField, JoinFieldClient } from '../../fields/config/types.js'
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

type JoinFieldClientWithoutType = MarkOptional<JoinFieldClient, 'type'>

type JoinFieldBaseClientProps = {
  readonly path: string
}

type JoinFieldBaseServerProps = Pick<FieldPaths, 'path'>

export type JoinFieldClientProps = ClientFieldBase<JoinFieldClientWithoutType> &
  JoinFieldBaseClientProps

export type JoinFieldServerProps = JoinFieldBaseServerProps & ServerFieldBase<JoinField>

export type JoinFieldServerComponent = FieldServerComponent<
  JoinField,
  JoinFieldClientWithoutType,
  JoinFieldBaseServerProps
>

export type JoinFieldClientComponent = FieldClientComponent<
  JoinFieldClientWithoutType,
  JoinFieldBaseClientProps
>

export type JoinFieldLabelServerComponent = FieldLabelServerComponent<JoinField>

export type JoinFieldLabelClientComponent = FieldLabelClientComponent<JoinFieldClientWithoutType>

export type JoinFieldDescriptionServerComponent = FieldDescriptionServerComponent<
  JoinField,
  JoinFieldClientWithoutType
>

export type JoinFieldDescriptionClientComponent =
  FieldDescriptionClientComponent<JoinFieldClientWithoutType>

export type JoinFieldErrorServerComponent = FieldErrorServerComponent<
  JoinField,
  JoinFieldClientWithoutType
>

export type JoinFieldErrorClientComponent = FieldErrorClientComponent<JoinFieldClientWithoutType>

export type JoinFieldDiffServerComponent = FieldDiffServerComponent<JoinField, JoinFieldClient>

export type JoinFieldDiffClientComponent = FieldDiffClientComponent<JoinFieldClient>
```

--------------------------------------------------------------------------------

---[FILE: JSON.ts]---
Location: payload-main/packages/payload/src/admin/fields/JSON.ts

```typescript
import type { MarkOptional } from 'ts-essentials'

import type { JSONField, JSONFieldClient } from '../../fields/config/types.js'
import type { JSONFieldValidation } from '../../fields/validations.js'
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

type JSONFieldClientWithoutType = MarkOptional<JSONFieldClient, 'type'>

type JSONFieldBaseClientProps = {
  readonly path: string
  readonly validate?: JSONFieldValidation
}

type JSONFieldBaseServerProps = Pick<FieldPaths, 'path'>

export type JSONFieldClientProps = ClientFieldBase<JSONFieldClientWithoutType> &
  JSONFieldBaseClientProps

export type JSONFieldServerProps = JSONFieldBaseServerProps &
  ServerFieldBase<JSONField, JSONFieldClientWithoutType>

export type JSONFieldServerComponent = FieldServerComponent<
  JSONField,
  JSONFieldClientWithoutType,
  JSONFieldBaseServerProps
>

export type JSONFieldClientComponent = FieldClientComponent<
  JSONFieldClientWithoutType,
  JSONFieldBaseClientProps
>

export type JSONFieldLabelServerComponent = FieldLabelServerComponent<
  JSONField,
  JSONFieldClientWithoutType
>

export type JSONFieldLabelClientComponent = FieldLabelClientComponent<JSONFieldClientWithoutType>

export type JSONFieldDescriptionServerComponent = FieldDescriptionServerComponent<
  JSONField,
  JSONFieldClientWithoutType
>

export type JSONFieldDescriptionClientComponent =
  FieldDescriptionClientComponent<JSONFieldClientWithoutType>

export type JSONFieldErrorServerComponent = FieldErrorServerComponent<
  JSONField,
  JSONFieldClientWithoutType
>

export type JSONFieldErrorClientComponent = FieldErrorClientComponent<JSONFieldClientWithoutType>

export type JSONFieldDiffServerComponent = FieldDiffServerComponent<JSONField, JSONFieldClient>

export type JSONFieldDiffClientComponent = FieldDiffClientComponent<JSONFieldClient>
```

--------------------------------------------------------------------------------

---[FILE: Number.ts]---
Location: payload-main/packages/payload/src/admin/fields/Number.ts

```typescript
import type { MarkOptional } from 'ts-essentials'

import type { NumberField, NumberFieldClient } from '../../fields/config/types.js'
import type { NumberFieldValidation } from '../../fields/validations.js'
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

type NumberFieldClientWithoutType = MarkOptional<NumberFieldClient, 'type'>

type NumberFieldBaseClientProps = {
  readonly onChange?: (e: number) => void
  readonly path: string
  readonly validate?: NumberFieldValidation
}

type NumberFieldBaseServerProps = Pick<FieldPaths, 'path'>

export type NumberFieldClientProps = ClientFieldBase<NumberFieldClientWithoutType> &
  NumberFieldBaseClientProps

export type NumberFieldServerProps = NumberFieldBaseServerProps &
  ServerFieldBase<NumberField, NumberFieldClientWithoutType>

export type NumberFieldServerComponent = FieldServerComponent<
  NumberField,
  NumberFieldClientWithoutType,
  NumberFieldBaseServerProps
>

export type NumberFieldClientComponent = FieldClientComponent<
  NumberFieldClientWithoutType,
  NumberFieldBaseClientProps
>

export type NumberFieldLabelServerComponent = FieldLabelServerComponent<
  NumberField,
  NumberFieldClientWithoutType
>

export type NumberFieldLabelClientComponent =
  FieldLabelClientComponent<NumberFieldClientWithoutType>

export type NumberFieldDescriptionServerComponent = FieldDescriptionServerComponent<
  NumberField,
  NumberFieldClientWithoutType
>

export type NumberFieldDescriptionClientComponent =
  FieldDescriptionClientComponent<NumberFieldClientWithoutType>

export type NumberFieldErrorServerComponent = FieldErrorServerComponent<
  NumberField,
  NumberFieldClientWithoutType
>

export type NumberFieldErrorClientComponent =
  FieldErrorClientComponent<NumberFieldClientWithoutType>

export type NumberFieldDiffServerComponent = FieldDiffServerComponent<
  NumberField,
  NumberFieldClient
>

export type NumberFieldDiffClientComponent = FieldDiffClientComponent<NumberFieldClient>
```

--------------------------------------------------------------------------------

---[FILE: Point.ts]---
Location: payload-main/packages/payload/src/admin/fields/Point.ts

```typescript
import type { MarkOptional } from 'ts-essentials'

import type { PointField, PointFieldClient } from '../../fields/config/types.js'
import type { PointFieldValidation } from '../../fields/validations.js'
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

type PointFieldClientWithoutType = MarkOptional<PointFieldClient, 'type'>

type PointFieldBaseClientProps = {
  readonly path: string
  readonly validate?: PointFieldValidation
}

type PointFieldBaseServerProps = Pick<FieldPaths, 'path'>

export type PointFieldClientProps = ClientFieldBase<PointFieldClientWithoutType> &
  PointFieldBaseClientProps

export type PointFieldServerProps = PointFieldBaseServerProps &
  ServerFieldBase<PointField, PointFieldClientWithoutType>

export type PointFieldServerComponent = FieldServerComponent<
  PointField,
  PointFieldClientWithoutType,
  PointFieldBaseServerProps
>

export type PointFieldClientComponent = FieldClientComponent<
  PointFieldClientWithoutType,
  PointFieldBaseClientProps
>

export type PointFieldLabelServerComponent = FieldLabelServerComponent<
  PointField,
  PointFieldClientWithoutType
>

export type PointFieldLabelClientComponent = FieldLabelClientComponent<PointFieldClientWithoutType>

export type PointFieldDescriptionServerComponent = FieldDescriptionServerComponent<
  PointField,
  PointFieldClientWithoutType
>

export type PointFieldDescriptionClientComponent =
  FieldDescriptionClientComponent<PointFieldClientWithoutType>

export type PointFieldErrorServerComponent = FieldErrorServerComponent<
  PointField,
  PointFieldClientWithoutType
>

export type PointFieldErrorClientComponent = FieldErrorClientComponent<PointFieldClientWithoutType>

export type PointFieldDiffServerComponent = FieldDiffServerComponent<PointField, PointFieldClient>

export type PointFieldDiffClientComponent = FieldDiffClientComponent<PointFieldClient>
```

--------------------------------------------------------------------------------

---[FILE: Radio.ts]---
Location: payload-main/packages/payload/src/admin/fields/Radio.ts

```typescript
import type { MarkOptional } from 'ts-essentials'

import type { RadioField, RadioFieldClient } from '../../fields/config/types.js'
import type { RadioFieldValidation } from '../../fields/validations.js'
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

type RadioFieldClientWithoutType = MarkOptional<RadioFieldClient, 'type'>

type RadioFieldBaseClientProps = {
  /**
   * Threaded through to the setValue function from the form context when the value changes
   */
  readonly disableModifyingForm?: boolean
  readonly onChange?: OnChange
  readonly path: string
  readonly validate?: RadioFieldValidation
  readonly value?: string
}

type RadioFieldBaseServerProps = Pick<FieldPaths, 'path'>

export type RadioFieldClientProps = ClientFieldBase<RadioFieldClientWithoutType> &
  RadioFieldBaseClientProps

export type RadioFieldServerProps = RadioFieldBaseServerProps &
  ServerFieldBase<RadioField, RadioFieldClientWithoutType>

export type RadioFieldServerComponent = FieldServerComponent<
  RadioField,
  RadioFieldClientWithoutType,
  RadioFieldBaseServerProps
>

export type RadioFieldClientComponent = FieldClientComponent<
  RadioFieldClientWithoutType,
  RadioFieldBaseClientProps
>

type OnChange<T = string> = (value: T) => void

export type RadioFieldLabelServerComponent = FieldLabelServerComponent<
  RadioField,
  RadioFieldClientWithoutType
>

export type RadioFieldLabelClientComponent = FieldLabelClientComponent<RadioFieldClientWithoutType>

export type RadioFieldDescriptionServerComponent = FieldDescriptionServerComponent<
  RadioField,
  RadioFieldClientWithoutType
>

export type RadioFieldDescriptionClientComponent =
  FieldDescriptionClientComponent<RadioFieldClientWithoutType>

export type RadioFieldErrorServerComponent = FieldErrorServerComponent<
  RadioField,
  RadioFieldClientWithoutType
>

export type RadioFieldErrorClientComponent = FieldErrorClientComponent<RadioFieldClientWithoutType>

export type RadioFieldDiffServerComponent = FieldDiffServerComponent<RadioField, RadioFieldClient>

export type RadioFieldDiffClientComponent = FieldDiffClientComponent<RadioFieldClient>
```

--------------------------------------------------------------------------------

---[FILE: Relationship.ts]---
Location: payload-main/packages/payload/src/admin/fields/Relationship.ts

```typescript
import type { MarkOptional } from 'ts-essentials'

import type { RelationshipField, RelationshipFieldClient } from '../../fields/config/types.js'
import type { RelationshipFieldValidation } from '../../fields/validations.js'
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

type RelationshipFieldClientWithoutType = MarkOptional<RelationshipFieldClient, 'type'>

type RelationshipFieldBaseClientProps = {
  readonly path: string
  readonly validate?: RelationshipFieldValidation
}

type RelationshipFieldBaseServerProps = Pick<FieldPaths, 'path'>

export type RelationshipFieldClientProps = ClientFieldBase<RelationshipFieldClientWithoutType> &
  RelationshipFieldBaseClientProps

export type RelationshipFieldServerProps = RelationshipFieldBaseServerProps &
  ServerFieldBase<RelationshipField, RelationshipFieldClientWithoutType>

export type RelationshipFieldServerComponent = FieldServerComponent<
  RelationshipField,
  RelationshipFieldClientWithoutType,
  RelationshipFieldBaseServerProps
>

export type RelationshipFieldClientComponent = FieldClientComponent<
  RelationshipFieldClientWithoutType,
  RelationshipFieldBaseClientProps
>

export type RelationshipFieldLabelServerComponent = FieldLabelServerComponent<
  RelationshipField,
  RelationshipFieldClientWithoutType
>

export type RelationshipFieldLabelClientComponent =
  FieldLabelClientComponent<RelationshipFieldClientWithoutType>

export type RelationshipFieldDescriptionServerComponent = FieldDescriptionServerComponent<
  RelationshipField,
  RelationshipFieldClientWithoutType
>

export type RelationshipFieldDescriptionClientComponent =
  FieldDescriptionClientComponent<RelationshipFieldClientWithoutType>

export type RelationshipFieldErrorServerComponent = FieldErrorServerComponent<
  RelationshipField,
  RelationshipFieldClientWithoutType
>

export type RelationshipFieldErrorClientComponent =
  FieldErrorClientComponent<RelationshipFieldClientWithoutType>

export type RelationshipFieldDiffServerComponent = FieldDiffServerComponent<
  RelationshipField,
  RelationshipFieldClient
>

export type RelationshipFieldDiffClientComponent = FieldDiffClientComponent<RelationshipFieldClient>
```

--------------------------------------------------------------------------------

---[FILE: RichText.ts]---
Location: payload-main/packages/payload/src/admin/fields/RichText.ts

```typescript
import type { MarkOptional } from 'ts-essentials'

import type { RichTextField, RichTextFieldClient } from '../../fields/config/types.js'
import type { RichTextFieldValidation } from '../../fields/validations.js'
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

type RichTextFieldClientWithoutType<
  TValue extends object = any,
  TAdapterProps = any,
  TExtraProperties = object,
> = MarkOptional<RichTextFieldClient<TValue, TAdapterProps, TExtraProperties>, 'type'>

type RichTextFieldBaseClientProps<
  TValue extends object = any,
  TAdapterProps = any,
  TExtraProperties = object,
> = {
  readonly path: string
  readonly validate?: RichTextFieldValidation
}

type RichTextFieldBaseServerProps = Pick<FieldPaths, 'path'>

export type RichTextFieldClientProps<
  TValue extends object = any,
  TAdapterProps = any,
  TExtraProperties = object,
> = ClientFieldBase<RichTextFieldClientWithoutType<TValue, TAdapterProps, TExtraProperties>> &
  RichTextFieldBaseClientProps<TValue, TAdapterProps, TExtraProperties>

export type RichTextFieldServerProps = RichTextFieldBaseServerProps &
  ServerFieldBase<RichTextField, RichTextFieldClientWithoutType>

export type RichTextFieldServerComponent = FieldServerComponent<
  RichTextField,
  RichTextFieldClientWithoutType,
  RichTextFieldBaseServerProps
>

export type RichTextFieldClientComponent = FieldClientComponent<
  RichTextFieldClientWithoutType,
  RichTextFieldBaseClientProps
>

export type RichTextFieldLabelServerComponent = FieldLabelServerComponent<
  RichTextField,
  RichTextFieldClientWithoutType
>

export type RichTextFieldLabelClientComponent =
  FieldLabelClientComponent<RichTextFieldClientWithoutType>

export type RichTextFieldDescriptionServerComponent = FieldDescriptionServerComponent<
  RichTextField,
  RichTextFieldClientWithoutType
>

export type RichTextFieldDescriptionClientComponent =
  FieldDescriptionClientComponent<RichTextFieldClientWithoutType>

export type RichTextFieldErrorServerComponent = FieldErrorServerComponent<
  RichTextField,
  RichTextFieldClientWithoutType
>

export type RichTextFieldErrorClientComponent =
  FieldErrorClientComponent<RichTextFieldClientWithoutType>

export type RichTextFieldDiffServerComponent = FieldDiffServerComponent<
  RichTextField,
  RichTextFieldClient
>

export type RichTextFieldDiffClientComponent = FieldDiffClientComponent<RichTextFieldClient>
```

--------------------------------------------------------------------------------

````
