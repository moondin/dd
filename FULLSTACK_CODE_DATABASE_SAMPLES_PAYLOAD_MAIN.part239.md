---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 239
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 239 of 695)

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

---[FILE: package.json]---
Location: payload-main/packages/plugin-form-builder/package.json
Signals: React

```json
{
  "name": "@payloadcms/plugin-form-builder",
  "version": "3.68.5",
  "description": "Form builder plugin for Payload CMS",
  "keywords": [
    "payload",
    "cms",
    "plugin",
    "typescript",
    "react",
    "forms",
    "fields",
    "form builder",
    "payments"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/payloadcms/payload.git",
    "directory": "packages/plugin-form-builder"
  },
  "license": "MIT",
  "author": "Payload <dev@payloadcms.com> (https://payloadcms.com)",
  "maintainers": [
    {
      "name": "Payload",
      "email": "info@payloadcms.com",
      "url": "https://payloadcms.com"
    }
  ],
  "sideEffects": false,
  "type": "module",
  "exports": {
    ".": {
      "import": "./src/index.ts",
      "types": "./src/index.ts",
      "default": "./src/index.ts"
    },
    "./types": {
      "import": "./src/exports/types.ts",
      "types": "./src/exports/types.ts",
      "default": "./src/exports/types.ts"
    },
    "./client": {
      "import": "./src/exports/client.ts",
      "types": "./src/exports/client.ts",
      "default": "./src/exports/client.ts"
    }
  },
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "pnpm build:types && pnpm build:swc",
    "build:debug": "pnpm build",
    "build:swc": "swc ./src -d ./dist --config-file .swcrc --strip-leading-paths",
    "build:types": "tsc --emitDeclarationOnly --outDir dist",
    "clean": "rimraf -g {dist,*.tsbuildinfo}",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "test": "echo \"No tests available.\""
  },
  "dependencies": {
    "@payloadcms/ui": "workspace:*",
    "escape-html": "^1.0.3"
  },
  "devDependencies": {
    "@payloadcms/eslint-config": "workspace:*",
    "@types/escape-html": "^1.0.4",
    "@types/react": "19.2.1",
    "@types/react-dom": "19.2.1",
    "copyfiles": "^2.4.1",
    "cross-env": "^7.0.3",
    "payload": "workspace:*"
  },
  "peerDependencies": {
    "payload": "workspace:*",
    "react": "^19.0.1 || ^19.1.2 || ^19.2.1",
    "react-dom": "^19.0.1 || ^19.1.2 || ^19.2.1"
  },
  "publishConfig": {
    "exports": {
      ".": {
        "import": "./dist/index.js",
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      },
      "./types": {
        "import": "./dist/exports/types.js",
        "types": "./dist/exports/types.d.ts",
        "default": "./dist/exports/types.js"
      },
      "./client": {
        "import": "./dist/exports/client.js",
        "types": "./dist/exports/client.d.ts",
        "default": "./dist/exports/client.js"
      }
    },
    "main": "./dist/index.js",
    "registry": "https://registry.npmjs.org/",
    "types": "./dist/index.d.ts"
  },
  "homepage:": "https://payloadcms.com"
}
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: payload-main/packages/plugin-form-builder/README.md

```text
# Payload Form Builder Plugin

A plugin for [Payload](https://github.com/payloadcms/payload) to easily allow admin editors to build and manage forms within the admin panel.

- [Source code](https://github.com/payloadcms/payload/tree/main/packages/plugin-form-builder)
- [Documentation](https://payloadcms.com/docs/plugins/form-builder)
- [Documentation source](https://github.com/payloadcms/payload/tree/main/docs/plugins/form-builder.mdx)
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/packages/plugin-form-builder/tsconfig.json

```json
{
  "extends": "../../tsconfig.base.json",
  "references": [{ "path": "../payload" }, { "path": "../ui" }]
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/plugin-form-builder/src/index.ts

```typescript
import type { Config } from 'payload'

import type { FormBuilderPluginConfig } from './types.js'

import { generateFormCollection } from './collections/Forms/index.js'
import { generateSubmissionCollection } from './collections/FormSubmissions/index.js'

export { fields } from './collections/Forms/fields.js'
export { getPaymentTotal } from './utilities/getPaymentTotal.js'

export const formBuilderPlugin =
  (incomingFormConfig: FormBuilderPluginConfig) =>
  (config: Config): Config => {
    const formConfig: FormBuilderPluginConfig = {
      ...incomingFormConfig,
      fields: {
        checkbox: true,
        country: true,
        email: true,
        message: true,
        number: true,
        payment: false,
        select: true,
        state: true,
        text: true,
        textarea: true,
        ...incomingFormConfig.fields,
      },
    }

    return {
      ...config,
      collections: [
        ...(config?.collections || []),
        generateFormCollection(formConfig),
        generateSubmissionCollection(formConfig),
      ],
    }
  }
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/plugin-form-builder/src/types.ts

```typescript
import type {
  Block,
  CollectionBeforeChangeHook,
  CollectionConfig,
  Field,
  TypeWithID,
} from 'payload'

export interface BlockConfig {
  block: Block
  validate?: (value: unknown) => boolean | string
}

export function isValidBlockConfig(blockConfig: BlockConfig | string): blockConfig is BlockConfig {
  return (
    typeof blockConfig !== 'string' &&
    typeof blockConfig?.block?.slug === 'string' &&
    Array.isArray(blockConfig?.block?.fields)
  )
}

export interface FieldValues {
  [key: string]: boolean | null | number | string | undefined
}

export type PaymentFieldConfig = {
  paymentProcessor: Partial<SelectField>
} & Partial<Field>

export type FieldConfig = Partial<Field> | PaymentFieldConfig

export interface FieldsConfig {
  [key: string]: boolean | FieldConfig | undefined
  checkbox?: boolean | FieldConfig
  country?: boolean | FieldConfig
  date?: boolean | FieldConfig
  email?: boolean | FieldConfig
  message?: boolean | FieldConfig
  number?: boolean | FieldConfig
  payment?: boolean | FieldConfig
  select?: boolean | FieldConfig
  state?: boolean | FieldConfig
  text?: boolean | FieldConfig
  textarea?: boolean | FieldConfig
}

type BeforeChangeParams<T extends TypeWithID = any> = Parameters<CollectionBeforeChangeHook<T>>[0]
export type BeforeEmail<T extends TypeWithID = any> = (
  emails: FormattedEmail[],
  beforeChangeParams: BeforeChangeParams<T>,
) => FormattedEmail[] | Promise<FormattedEmail[]>
export type HandlePayment = (data: any) => void
export type FieldsOverride = (args: { defaultFields: Field[] }) => Field[]

export type FormBuilderPluginConfig = {
  beforeEmail?: BeforeEmail
  /**
   * Set a default email address to send form submissions to if no email is provided in the form configuration
   * Falls back to the defaultFromAddress in the email configuration
   */
  defaultToEmail?: string
  fields?: FieldsConfig
  formOverrides?: { fields?: FieldsOverride } & Partial<Omit<CollectionConfig, 'fields'>>
  formSubmissionOverrides?: { fields?: FieldsOverride } & Partial<Omit<CollectionConfig, 'fields'>>
  handlePayment?: HandlePayment
  redirectRelationships?: string[]
}

export interface TextField {
  blockName?: string
  blockType: 'text'
  defaultValue?: string
  label?: string
  name: string
  required?: boolean
  width?: number
}

export interface TextAreaField {
  blockName?: string
  blockType: 'textarea'
  defaultValue?: string
  label?: string
  name: string
  required?: boolean
  width?: number
}

export interface SelectFieldOption {
  label: string
  value: string
}

export interface SelectField {
  blockName?: string
  blockType: 'select'
  defaultValue?: string
  label?: string
  name: string
  options: SelectFieldOption[]
  placeholder?: string
  required?: boolean
  width?: number
}

export interface RadioField {
  blockName?: string
  blockType: 'radio'
  defaultValue?: string
  label?: string
  name: string
  options: SelectFieldOption[]
  placeholder?: string
  required?: boolean
  width?: number
}

export interface PriceCondition {
  condition: 'equals' | 'hasValue' | 'notEquals'
  fieldToUse: string
  operator: 'add' | 'divide' | 'multiply' | 'subtract'
  valueForCondition: string
  valueForOperator: number | string // TODO: make this a number, see ./collections/Forms/DynamicPriceSelector.tsx
  valueType: 'static' | 'valueOfField'
}

export interface PaymentField {
  basePrice: number
  blockName?: string
  blockType: 'payment'
  defaultValue?: string
  label?: string
  name: string
  paymentProcessor: string
  priceConditions: PriceCondition[]
  required?: boolean
  width?: number
}

export interface EmailField {
  blockName?: string
  blockType: 'email'
  defaultValue?: string
  label?: string
  name: string
  required?: boolean
  width?: number
}

export interface DateField {
  blockName?: string
  blockType: 'date'
  defaultValue?: string
  label?: string
  name: string
  required?: boolean
  width?: number
}

export interface StateField {
  blockName?: string
  blockType: 'state'
  defaultValue?: string
  label?: string
  name: string
  required?: boolean
  width?: number
}

export interface CountryField {
  blockName?: string
  blockType: 'country'
  defaultValue?: string
  label?: string
  name: string
  required?: boolean
  width?: number
}

export interface CheckboxField {
  blockName?: string
  blockType: 'checkbox'
  defaultValue?: boolean
  label?: string
  name: string
  required?: boolean
  width?: number
}

export interface MessageField {
  blockName?: string
  blockType: 'message'
  message: object
}

export type FormFieldBlock =
  | CheckboxField
  | CountryField
  | DateField
  | EmailField
  | MessageField
  | PaymentField
  | RadioField
  | SelectField
  | StateField
  | TextAreaField
  | TextField

export interface Email {
  bcc?: string
  cc?: string
  emailFrom: string
  emailTo: string
  message?: any // TODO: configure rich text type
  replyTo?: string
  subject: string
}

export interface FormattedEmail {
  bcc?: string
  cc?: string
  from: string
  html: string
  replyTo: string
  subject: string
  to: string
}

export interface Redirect {
  reference?: {
    relationTo: string
    value: string | unknown
  }
  type: 'custom' | 'reference'
  url: string
}

export interface Form {
  confirmationMessage?: any // TODO: configure rich text type
  confirmationType: 'message' | 'redirect'
  emails: Email[]
  fields: FormFieldBlock[]
  id: string
  redirect?: Redirect
  submitButtonLabel?: string
  title: string
}

export interface SubmissionValue {
  field: string
  value: unknown
}

export interface FormSubmission {
  form: Form | string
  submissionData: SubmissionValue[]
}
```

--------------------------------------------------------------------------------

---[FILE: DynamicFieldSelector.tsx]---
Location: payload-main/packages/plugin-form-builder/src/collections/Forms/DynamicFieldSelector.tsx
Signals: React

```typescript
'use client'

import type { SelectFieldClientProps, SelectFieldValidation } from 'payload'

import { SelectField, useForm } from '@payloadcms/ui'
import React, { useEffect, useState } from 'react'

import type { SelectFieldOption } from '../../types.js'

export const DynamicFieldSelector: React.FC<
  { validate: SelectFieldValidation } & SelectFieldClientProps
> = (props) => {
  const { fields, getDataByPath } = useForm()

  const [options, setOptions] = useState<SelectFieldOption[]>([])

  useEffect(() => {
    const fields: any[] = getDataByPath('fields')

    if (fields) {
      const allNonPaymentFields = fields
        .map((block): null | SelectFieldOption => {
          const { name, blockType, label } = block

          if (blockType !== 'payment') {
            return {
              label,
              value: name,
            }
          }

          return null
        })
        .filter((field) => field !== null)
      setOptions(allNonPaymentFields)
    }
  }, [fields, getDataByPath])

  return (
    <SelectField
      {...props}
      field={{
        ...(props.field || {}),
        options,
      }}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: DynamicPriceSelector.tsx]---
Location: payload-main/packages/plugin-form-builder/src/collections/Forms/DynamicPriceSelector.tsx
Signals: React

```typescript
'use client'

import type { Data, TextFieldClientComponent } from 'payload'

import { TextField, useLocale, useWatchForm } from '@payloadcms/ui'
import React, { useEffect, useState } from 'react'

type FieldWithID = {
  id: string
  name: string
}

export const DynamicPriceSelector: TextFieldClientComponent = (props) => {
  const { field, path } = props

  const { fields, getData, getDataByPath } = useWatchForm()

  const locale = useLocale()

  const [isNumberField, setIsNumberField] = useState<boolean>()
  const [valueType, setValueType] = useState<'static' | 'valueOfField'>()

  // only number fields can use 'valueOfField`
  useEffect(() => {
    if (path) {
      const parentPath = path.split('.').slice(0, -1).join('.')
      const paymentFieldData: any = getDataByPath(parentPath)

      if (paymentFieldData) {
        const { fieldToUse, valueType } = paymentFieldData

        setValueType(valueType)

        const { fields: allFields }: Data = getData()
        const field = allFields.find((field: FieldWithID) => field.name === fieldToUse)

        if (field) {
          const { blockType } = field
          setIsNumberField(blockType === 'number')
        }
      }
    }
  }, [fields, getDataByPath, getData, path])

  // TODO: make this a number field, block by Payload
  if (valueType === 'static') {
    return <TextField {...props} />
  }

  const localeCode = typeof locale === 'object' && 'code' in locale ? locale.code : locale

  const localLabels = typeof field.label === 'object' ? field.label : { [localeCode]: field.label }

  const labelValue = localLabels[localeCode] || localLabels['en'] || ''

  if (valueType === 'valueOfField' && !isNumberField) {
    return (
      <div>
        <div>{String(labelValue)}</div>
        <div
          style={{
            color: '#9A9A9A',
          }}
        >
          The selected field must be a number field.
        </div>
      </div>
    )
  }

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: fields.ts]---
Location: payload-main/packages/plugin-form-builder/src/collections/Forms/fields.ts

```typescript
import type { Block, Field } from 'payload'

import type { FieldConfig, PaymentFieldConfig } from '../../types.js'

const name: Field = {
  name: 'name',
  type: 'text',
  label: 'Name (lowercase, no special characters)',
  required: true,
}

const label: Field = {
  name: 'label',
  type: 'text',
  label: 'Label',
  localized: true,
}

const required: Field = {
  name: 'required',
  type: 'checkbox',
  label: 'Required',
}

const width: Field = {
  name: 'width',
  type: 'number',
  label: 'Field Width (percentage)',
}

const placeholder: Field = {
  name: 'placeholder',
  type: 'text',
  label: 'Placeholder',
}

const Radio: Block = {
  slug: 'radio',
  fields: [
    {
      type: 'row',
      fields: [
        {
          ...name,
          admin: {
            width: '50%',
          },
        },
        {
          ...label,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          ...width,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'defaultValue',
          type: 'text',
          admin: {
            width: '50%',
          },
          label: 'Default Value',
          localized: true,
        },
      ],
    },
    {
      name: 'options',
      type: 'array',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              admin: {
                width: '50%',
              },
              label: 'Label',
              localized: true,
              required: true,
            },
            {
              name: 'value',
              type: 'text',
              admin: {
                width: '50%',
              },
              label: 'Value',
              required: true,
            },
          ],
        },
      ],
      label: 'Radio Attribute Options',
      labels: {
        plural: 'Options',
        singular: 'Option',
      },
    },
    required,
  ],
  labels: {
    plural: 'Radio Fields',
    singular: 'Radio',
  },
}

const Select: Block = {
  slug: 'select',
  fields: [
    {
      type: 'row',
      fields: [
        {
          ...name,
          admin: {
            width: '50%',
          },
        },
        {
          ...label,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          ...width,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'defaultValue',
          type: 'text',
          admin: {
            width: '50%',
          },
          label: 'Default Value',
          localized: true,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          ...placeholder,
        },
      ],
    },
    {
      name: 'options',
      type: 'array',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              admin: {
                width: '50%',
              },
              label: 'Label',
              localized: true,
              required: true,
            },
            {
              name: 'value',
              type: 'text',
              admin: {
                width: '50%',
              },
              label: 'Value',
              required: true,
            },
          ],
        },
      ],
      label: 'Select Attribute Options',
      labels: {
        plural: 'Options',
        singular: 'Option',
      },
    },
    required,
  ],
  labels: {
    plural: 'Select Fields',
    singular: 'Select',
  },
}

const Text: Block = {
  slug: 'text',
  fields: [
    {
      type: 'row',
      fields: [
        {
          ...name,
          admin: {
            width: '50%',
          },
        },
        {
          ...label,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          ...width,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'defaultValue',
          type: 'text',
          admin: {
            width: '50%',
          },
          label: 'Default Value',
          localized: true,
        },
      ],
    },
    required,
  ],
  labels: {
    plural: 'Text Fields',
    singular: 'Text',
  },
}

const TextArea: Block = {
  slug: 'textarea',
  fields: [
    {
      type: 'row',
      fields: [
        {
          ...name,
          admin: {
            width: '50%',
          },
        },
        {
          ...label,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          ...width,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'defaultValue',
          type: 'text',
          admin: {
            width: '50%',
          },
          label: 'Default Value',
          localized: true,
        },
      ],
    },
    required,
  ],
  labels: {
    plural: 'Text Area Fields',
    singular: 'Text Area',
  },
}

const Number: Block = {
  slug: 'number',
  fields: [
    {
      type: 'row',
      fields: [
        {
          ...name,
          admin: {
            width: '50%',
          },
        },
        {
          ...label,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          ...width,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'defaultValue',
          type: 'number',
          admin: {
            width: '50%',
          },
          label: 'Default Value',
        },
      ],
    },
    required,
  ],
  labels: {
    plural: 'Number Fields',
    singular: 'Number',
  },
}

const Email: Block = {
  slug: 'email',
  fields: [
    {
      type: 'row',
      fields: [
        {
          ...name,
          admin: {
            width: '50%',
          },
        },
        {
          ...label,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    width,
    required,
  ],
  labels: {
    plural: 'Email Fields',
    singular: 'Email',
  },
}

const State: Block = {
  slug: 'state',
  fields: [
    {
      type: 'row',
      fields: [
        {
          ...name,
          admin: {
            width: '50%',
          },
        },
        {
          ...label,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    width,
    required,
  ],
  labels: {
    plural: 'State Fields',
    singular: 'State',
  },
}

const Country: Block = {
  slug: 'country',
  fields: [
    {
      type: 'row',
      fields: [
        {
          ...name,
          admin: {
            width: '50%',
          },
        },
        {
          ...label,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    width,
    required,
  ],
  labels: {
    plural: 'Country Fields',
    singular: 'Country',
  },
}

const Checkbox: Block = {
  slug: 'checkbox',
  fields: [
    {
      type: 'row',
      fields: [
        {
          ...name,
          admin: {
            width: '50%',
          },
        },
        {
          ...label,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          ...width,
          admin: {
            width: '50%',
          },
        },
        {
          ...required,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'defaultValue',
      type: 'checkbox',
      label: 'Default Value',
    },
  ],
  labels: {
    plural: 'Checkbox Fields',
    singular: 'Checkbox',
  },
}

const Date: Block = {
  slug: 'date',
  fields: [
    {
      type: 'row',
      fields: [
        {
          ...name,
          admin: {
            width: '50%',
          },
        },
        {
          ...label,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          ...width,
          admin: {
            width: '50%',
          },
        },
        {
          ...required,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'defaultValue',
      type: 'date',
      label: 'Default Value',
    },
  ],
  labels: {
    plural: 'Date Fields',
    singular: 'Date',
  },
}

const Payment = (fieldConfig: PaymentFieldConfig): Block => {
  let paymentProcessorField = null
  if (fieldConfig?.paymentProcessor) {
    paymentProcessorField = {
      name: 'paymentProcessor',
      type: 'select',
      label: 'Payment Processor',
      options: [],
      ...fieldConfig.paymentProcessor,
    }
  }

  const fields = {
    slug: 'payment',
    fields: [
      {
        type: 'row',
        fields: [
          {
            ...name,
            admin: {
              width: '50%',
            },
          },
          {
            ...label,
            admin: {
              width: '50%',
            },
          },
        ],
      },
      {
        type: 'row',
        fields: [
          {
            ...width,
            admin: {
              width: '50%',
            },
          },
          {
            name: 'basePrice',
            type: 'number',
            admin: {
              width: '50%',
            },
            label: 'Base Price',
          },
        ],
      },
      paymentProcessorField,
      {
        name: 'priceConditions',
        type: 'array',
        fields: [
          {
            name: 'fieldToUse',
            type: 'text',
            admin: {
              components: {
                Field: '@payloadcms/plugin-form-builder/client#DynamicFieldSelector',
              },
            },
          },
          {
            name: 'condition',
            type: 'select',
            defaultValue: 'hasValue',
            label: 'Condition',
            options: [
              {
                label: 'Has Any Value',
                value: 'hasValue',
              },
              {
                label: 'Equals',
                value: 'equals',
              },
              {
                label: 'Does Not Equal',
                value: 'notEquals',
              },
            ],
          },
          {
            name: 'valueForCondition',
            type: 'text',
            admin: {
              condition: (_: any, { condition }: any) =>
                condition === 'equals' || condition === 'notEquals',
            },
            label: 'Value',
          },
          {
            name: 'operator',
            type: 'select',
            defaultValue: 'add',
            options: [
              {
                label: 'Add',
                value: 'add',
              },
              {
                label: 'Subtract',
                value: 'subtract',
              },
              {
                label: 'Multiply',
                value: 'multiply',
              },
              {
                label: 'Divide',
                value: 'divide',
              },
            ],
          },
          {
            name: 'valueType',
            type: 'radio',
            admin: {
              width: '100%',
            },
            defaultValue: 'static',
            label: 'Value Type',
            options: [
              {
                label: 'Static Value',
                value: 'static',
              },
              {
                label: 'Value Of Field',
                value: 'valueOfField',
              },
            ],
          },
          {
            name: 'valueForOperator',
            type: 'text',
            admin: {
              components: {
                Field: '@payloadcms/plugin-form-builder/client#DynamicPriceSelector',
              },
            },
            label: 'Value',
          },
        ],
        label: 'Price Conditions',
        labels: {
          plural: 'Price Conditions',
          singular: 'Price Condition',
        },
      },
      required,
    ].filter(Boolean) as Field[],
    labels: {
      plural: 'Payment Fields',
      singular: 'Payment',
    },
  }

  return fields
}

const Message: Block = {
  slug: 'message',
  fields: [
    {
      name: 'message',
      type: 'richText',
      localized: true,
    },
  ],
  labels: {
    plural: 'Message Blocks',
    singular: 'Message',
  },
}

export const fields = {
  checkbox: Checkbox,
  country: Country,
  date: Date,
  email: Email,
  message: Message,
  number: Number,
  payment: Payment,
  radio: Radio,
  select: Select,
  state: State,
  text: Text,
  textarea: TextArea,
} as {
  [key: string]: ((fieldConfig?: boolean | FieldConfig) => Block) | Block
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/plugin-form-builder/src/collections/Forms/index.ts

```typescript
import type { Block, CollectionConfig, Field } from 'payload'

import { deepMergeWithSourceArrays } from 'payload'

import type { FormBuilderPluginConfig } from '../../types.js'

import { fields } from './fields.js'

// all settings can be overridden by the config
export const generateFormCollection = (formConfig: FormBuilderPluginConfig): CollectionConfig => {
  const redirect: Field = {
    name: 'redirect',
    type: 'group',
    admin: {
      condition: (_, siblingData) => siblingData?.confirmationType === 'redirect',
      hideGutter: true,
    },
    fields: [
      {
        name: 'url',
        type: 'text',
        label: 'URL to redirect to',
        required: true,
      },
    ],
  }

  if (formConfig.redirectRelationships) {
    redirect.fields.unshift({
      name: 'reference',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'reference',
      },
      label: 'Document to link to',
      maxDepth: 2,
      relationTo: formConfig.redirectRelationships,
      required: true,
    })

    redirect.fields.unshift({
      name: 'type',
      type: 'radio',
      admin: {
        layout: 'horizontal',
      },
      defaultValue: 'reference',
      options: [
        {
          label: 'Internal link',
          value: 'reference',
        },
        {
          label: 'Custom URL',
          value: 'custom',
        },
      ],
    })

    if (redirect.fields[2]!.type !== 'row') {
      redirect.fields[2]!.label = 'Custom URL'
    }

    redirect.fields[2]!.admin = {
      condition: (_, siblingData) => siblingData?.type === 'custom',
    }
  }

  const defaultFields: Field[] = [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'fields',
      type: 'blocks',
      blocks: Object.entries(formConfig?.fields || {})
        .map(([fieldKey, fieldConfig]) => {
          // let the config enable/disable fields with either boolean values or objects
          if (fieldConfig !== false) {
            const block = fields[fieldKey]

            if (block === undefined && typeof fieldConfig === 'object') {
              return fieldConfig
            }

            if (typeof block === 'object' && typeof fieldConfig === 'object') {
              return deepMergeWithSourceArrays(block, fieldConfig)
            }

            if (typeof block === 'function') {
              return block(fieldConfig)
            }

            return block
          }

          return null
        })
        .filter(Boolean) as Block[],
    },
    {
      name: 'submitButtonLabel',
      type: 'text',
      localized: true,
    },
    {
      name: 'confirmationType',
      type: 'radio',
      admin: {
        description:
          'Choose whether to display an on-page message or redirect to a different page after they submit the form.',
        layout: 'horizontal',
      },
      defaultValue: 'message',
      options: [
        {
          label: 'Message',
          value: 'message',
        },
        {
          label: 'Redirect',
          value: 'redirect',
        },
      ],
    },
    {
      name: 'confirmationMessage',
      type: 'richText',
      admin: {
        condition: (_, siblingData) => siblingData?.confirmationType === 'message',
      },
      localized: true,
      required: true,
    },
    redirect,
    {
      name: 'emails',
      type: 'array',
      access: {
        read: ({ req: { user } }) => !!user,
      },
      admin: {
        description:
          "Send custom emails when the form submits. Use comma separated lists to send the same email to multiple recipients. To reference a value from this form, wrap that field's name with double curly brackets, i.e. {{firstName}}. You can use a wildcard {{*}} to output all data and {{*:table}} to format it as an HTML table in the email.",
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'emailTo',
              type: 'text',
              admin: {
                placeholder: '"Email Sender" <sender@email.com>',
                width: '100%',
              },
              label: 'Email To',
            },
            {
              name: 'cc',
              type: 'text',
              admin: {
                style: {
                  maxWidth: '50%',
                },
              },
              label: 'CC',
            },
            {
              name: 'bcc',
              type: 'text',
              admin: {
                style: {
                  maxWidth: '50%',
                },
              },
              label: 'BCC',
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'replyTo',
              type: 'text',
              admin: {
                placeholder: '"Reply To" <reply-to@email.com>',
                width: '50%',
              },
              label: 'Reply To',
            },
            {
              name: 'emailFrom',
              type: 'text',
              admin: {
                placeholder: '"Email From" <email-from@email.com>',
                width: '50%',
              },
              label: 'Email From',
            },
          ],
        },
        {
          name: 'subject',
          type: 'text',
          defaultValue: "You've received a new message.",
          label: 'Subject',
          localized: true,
          required: true,
        },
        {
          name: 'message',
          type: 'richText',
          admin: {
            description: 'Enter the message that should be sent in this email.',
          },
          label: 'Message',
          localized: true,
        },
      ],
    },
  ]

  const config: CollectionConfig = {
    ...(formConfig?.formOverrides || {}),
    slug: formConfig?.formOverrides?.slug || 'forms',
    access: {
      read: () => true,
      ...(formConfig?.formOverrides?.access || {}),
    },
    admin: {
      enableRichTextRelationship: false,
      useAsTitle: 'title',
      ...(formConfig?.formOverrides?.admin || {}),
    },
    fields:
      formConfig?.formOverrides?.fields && typeof formConfig?.formOverrides?.fields === 'function'
        ? formConfig.formOverrides.fields({ defaultFields })
        : defaultFields,
  }

  return config
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/plugin-form-builder/src/collections/FormSubmissions/index.ts

```typescript
import type { CollectionConfig, Field } from 'payload'

import type { FormBuilderPluginConfig } from '../../types.js'

import { defaultPaymentFields } from './fields/defaultPaymentFields.js'
import { createCharge } from './hooks/createCharge.js'
import { sendEmail } from './hooks/sendEmail.js'

// all settings can be overridden by the config
export const generateSubmissionCollection = (
  formConfig: FormBuilderPluginConfig,
): CollectionConfig => {
  const formSlug = formConfig?.formOverrides?.slug || 'forms'

  const enablePaymentFields = Boolean(formConfig?.fields?.payment)

  const defaultFields: Field[] = [
    {
      name: 'form',
      type: 'relationship',
      relationTo: formSlug,
      required: true,
      // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
      validate: async (value, { req: { payload }, req }) => {
        /* Don't run in the client side */
        if (!payload) {
          return true
        }

        if (payload) {
          let _existingForm

          try {
            _existingForm = await payload.findByID({
              id: value,
              collection: formSlug,
              req,
            })

            return true
          } catch (_error) {
            return 'Cannot create this submission because this form does not exist.'
          }
        }
      },
    },
    {
      name: 'submissionData',
      type: 'array',
      fields: [
        {
          name: 'field',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          type: 'textarea',
          required: true,
          validate: (value: unknown) => {
            // TODO:
            // create a validation function that dynamically
            // relies on the field type and its options as configured.

            // How to access sibling data from this field?
            // Need the `name` of the field in order to validate it.

            // Might not be possible to use this validation function.
            // Instead, might need to do all validation in a `beforeValidate` collection hook.

            if (typeof value !== 'undefined') {
              return true
            }

            return 'This field is required.'
          },
        },
      ],
    },
    ...(enablePaymentFields ? [defaultPaymentFields] : []),
  ]

  const newConfig: CollectionConfig = {
    ...(formConfig?.formSubmissionOverrides || {}),
    slug: formConfig?.formSubmissionOverrides?.slug || 'form-submissions',
    access: {
      create: () => true,
      read: ({ req: { user } }) => !!user, // logged-in users,
      update: () => false,
      ...(formConfig?.formSubmissionOverrides?.access || {}),
    },
    admin: {
      ...(formConfig?.formSubmissionOverrides?.admin || {}),
      enableRichTextRelationship: false,
    },
    fields:
      formConfig?.formSubmissionOverrides?.fields &&
      typeof formConfig?.formSubmissionOverrides?.fields === 'function'
        ? formConfig.formSubmissionOverrides.fields({ defaultFields })
        : defaultFields,
    hooks: {
      ...(formConfig?.formSubmissionOverrides?.hooks || {}),
      afterChange: [
        (data) => sendEmail(data, formConfig),
        ...(formConfig?.formSubmissionOverrides?.hooks?.afterChange || []),
      ],
      beforeChange: [
        (data) => createCharge(data, formConfig),
        ...(formConfig?.formSubmissionOverrides?.hooks?.beforeChange || []),
      ],
    },
  }
  return newConfig
}
```

--------------------------------------------------------------------------------

---[FILE: defaultPaymentFields.ts]---
Location: payload-main/packages/plugin-form-builder/src/collections/FormSubmissions/fields/defaultPaymentFields.ts

```typescript
import type { Field } from 'payload'

export const defaultPaymentFields: Field = {
  name: 'payment',
  type: 'group',
  fields: [
    {
      name: 'field',
      type: 'text',
      label: 'Field',
    },
    {
      name: 'status',
      type: 'text',
      label: 'Status',
    },
    {
      name: 'amount',
      type: 'number',
      admin: {
        description: 'Amount in cents',
      },
    },
    {
      name: 'paymentProcessor',
      type: 'text',
    },
    {
      name: 'creditCard',
      type: 'group',
      fields: [
        {
          name: 'token',
          type: 'text',
          label: 'token',
        },
        {
          name: 'brand',
          type: 'text',
          label: 'Brand',
        },
        {
          name: 'number',
          type: 'text',
          label: 'Number',
        },
      ],
      label: 'Credit Card',
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: createCharge.ts]---
Location: payload-main/packages/plugin-form-builder/src/collections/FormSubmissions/hooks/createCharge.ts

```typescript
import type { FormBuilderPluginConfig } from '../../../types.js'

export const createCharge = async (
  beforeChangeData: any,
  formConfig: FormBuilderPluginConfig,
): Promise<any> => {
  const { data, operation } = beforeChangeData

  let dataWithPaymentDetails = data

  if (operation === 'create') {
    const { handlePayment } = formConfig || {}

    if (typeof handlePayment === 'function') {
      // eslint-disable-next-line @typescript-eslint/await-thenable
      dataWithPaymentDetails = await handlePayment(beforeChangeData)
    }
  }

  return dataWithPaymentDetails
}
```

--------------------------------------------------------------------------------

````
