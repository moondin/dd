---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 97
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 97 of 695)

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

---[FILE: config.ts]---
Location: payload-main/examples/localization/src/blocks/ArchiveBlock/config.ts

```typescript
import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const Archive: Block = {
  slug: 'archive',
  interfaceName: 'ArchiveBlock',
  fields: [
    {
      name: 'introContent',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: 'Intro Content',
    },
    {
      name: 'populateBy',
      type: 'select',
      defaultValue: 'collection',
      options: [
        {
          label: 'Collection',
          value: 'collection',
        },
        {
          label: 'Individual Selection',
          value: 'selection',
        },
      ],
    },
    {
      name: 'relationTo',
      type: 'select',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
      },
      defaultValue: 'posts',
      label: 'Collections To Show',
      options: [
        {
          label: 'Posts',
          value: 'posts',
        },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
      },
      hasMany: true,
      label: 'Categories To Show',
      relationTo: 'categories',
    },
    {
      name: 'limit',
      type: 'number',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
        step: 1,
      },
      defaultValue: 10,
      label: 'Limit',
    },
    {
      name: 'selectedDocs',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'selection',
      },
      hasMany: true,
      label: 'Selection',
      relationTo: ['posts'],
    },
  ],
  labels: {
    plural: 'Archives',
    singular: 'Archive',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: Component.tsx]---
Location: payload-main/examples/localization/src/blocks/Banner/Component.tsx
Signals: React

```typescript
import type { BannerBlock as BannerBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

type Props = {
  className?: string
} & BannerBlockProps

export const BannerBlock: React.FC<Props> = ({ className, content, style }) => {
  return (
    <div className={cn('mx-auto my-8 w-full', className)}>
      <div
        className={cn('border py-3 px-6 flex items-center rounded', {
          'border-border bg-card': style === 'info',
          'border-error bg-error/30': style === 'error',
          'border-success bg-success/30': style === 'success',
          'border-warning bg-warning/30': style === 'warning',
        })}
      >
        <RichText content={content} enableGutter={false} enableProse={false} />
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: payload-main/examples/localization/src/blocks/Banner/config.ts

```typescript
import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const Banner: Block = {
  slug: 'banner',
  fields: [
    {
      name: 'style',
      type: 'select',
      defaultValue: 'info',
      options: [
        { label: 'Info', value: 'info' },
        { label: 'Warning', value: 'warning' },
        { label: 'Error', value: 'error' },
        { label: 'Success', value: 'success' },
      ],
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
      label: false,
      required: true,
    },
  ],
  interfaceName: 'BannerBlock',
}
```

--------------------------------------------------------------------------------

---[FILE: Component.tsx]---
Location: payload-main/examples/localization/src/blocks/CallToAction/Component.tsx
Signals: React

```typescript
import React from 'react'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'

type Props = Extract<Page['layout'][0], { blockType: 'cta' }>

export const CallToActionBlock: React.FC<
  Props & {
    id?: string
  }
> = ({ links, richText }) => {
  return (
    <div className="container">
      <div className="bg-card rounded border-border border p-4 flex flex-col gap-8 md:flex-row md:justify-between md:items-center">
        <div className="max-w-[48rem] flex items-center">
          {richText && <RichText className="mb-0" content={richText} enableGutter={false} />}
        </div>
        <div className="flex flex-col gap-8">
          {(links || []).map(({ link }, i) => {
            return <CMSLink key={i} size="lg" {...link} />
          })}
        </div>
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: payload-main/examples/localization/src/blocks/CallToAction/config.ts

```typescript
import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '../../fields/linkGroup'

export const CallToAction: Block = {
  slug: 'cta',
  interfaceName: 'CallToActionBlock',
  fields: [
    {
      name: 'richText',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
    },
    linkGroup({
      appearances: ['default', 'outline'],
      overrides: {
        maxRows: 2,
      },
    }),
  ],
  labels: {
    plural: 'Calls to Action',
    singular: 'Call to Action',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: Component.client.tsx]---
Location: payload-main/examples/localization/src/blocks/Code/Component.client.tsx
Signals: React

```typescript
'use client'
import { Highlight, themes } from 'prism-react-renderer'
import React from 'react'

type Props = {
  code: string
  language?: string
}

export const Code: React.FC<Props> = ({ code, language = '' }) => {
  if (!code) return null

  return (
    <Highlight code={code} language={language} theme={themes.vsDark}>
      {({ getLineProps, getTokenProps, tokens }) => (
        <pre className="bg-black p-4 border text-xs border-border rounded overflow-x-auto">
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ className: 'table-row', line })}>
              <span className="table-cell select-none text-right text-white/25">{i + 1}</span>
              <span className="table-cell pl-4">
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </span>
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: Component.tsx]---
Location: payload-main/examples/localization/src/blocks/Code/Component.tsx
Signals: React

```typescript
import React from 'react'

import { Code } from './Component.client'

export type CodeBlockProps = {
  code: string
  language?: string
  blockType: 'code'
}

type Props = CodeBlockProps & {
  className?: string
}

export const CodeBlock: React.FC<Props> = ({ className, code, language }) => {
  return (
    <div className={[className, 'not-prose'].filter(Boolean).join(' ')}>
      <Code code={code} language={language} />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: payload-main/examples/localization/src/blocks/Code/config.ts

```typescript
import type { Block } from 'payload'

export const Code: Block = {
  slug: 'code',
  interfaceName: 'CodeBlock',
  fields: [
    {
      name: 'language',
      type: 'select',
      defaultValue: 'typescript',
      options: [
        {
          label: 'Typescript',
          value: 'typescript',
        },
        {
          label: 'Javascript',
          value: 'javascript',
        },
        {
          label: 'CSS',
          value: 'css',
        },
      ],
    },
    {
      name: 'code',
      type: 'code',
      label: false,
      required: true,
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: Component.tsx]---
Location: payload-main/examples/localization/src/blocks/Content/Component.tsx
Signals: React

```typescript
import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

import type { Page } from '@/payload-types'

import { CMSLink } from '../../components/Link'

type Props = Extract<Page['layout'][0], { blockType: 'content' }>

export const ContentBlock: React.FC<
  {
    id?: string
  } & Props
> = (props) => {
  const { columns } = props

  const colsSpanClasses = {
    full: '12',
    half: '6',
    oneThird: '4',
    twoThirds: '8',
  }

  return (
    <div className="container my-16">
      <div className="grid grid-cols-4 lg:grid-cols-12 gap-y-8 gap-x-16">
        {columns &&
          columns.length > 0 &&
          columns.map((col, index) => {
            const { enableLink, link, richText, size } = col

            return (
              <div
                className={cn(`col-span-4 lg:col-span-${colsSpanClasses[size!]}`, {
                  'md:col-span-2': size !== 'full',
                })}
                key={index}
              >
                {richText && <RichText content={richText} enableGutter={false} />}

                {enableLink && <CMSLink {...link} />}
              </div>
            )
          })}
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: payload-main/examples/localization/src/blocks/Content/config.ts

```typescript
import type { Block, Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'

const columnFields: Field[] = [
  {
    name: 'size',
    type: 'select',
    defaultValue: 'oneThird',
    options: [
      {
        label: 'One Third',
        value: 'oneThird',
      },
      {
        label: 'Half',
        value: 'half',
      },
      {
        label: 'Two Thirds',
        value: 'twoThirds',
      },
      {
        label: 'Full',
        value: 'full',
      },
    ],
  },
  {
    name: 'richText',
    type: 'richText',
    localized: true,
    editor: lexicalEditor({
      features: ({ rootFeatures }) => {
        return [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ]
      },
    }),
    label: false,
  },
  {
    name: 'enableLink',
    type: 'checkbox',
  },
  link({
    overrides: {
      admin: {
        condition: (_, { enableLink }) => Boolean(enableLink),
      },
    },
  }),
]

export const Content: Block = {
  slug: 'content',
  interfaceName: 'ContentBlock',
  fields: [
    {
      name: 'columns',
      type: 'array',
      fields: columnFields,
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: buildInitialFormState.tsx]---
Location: payload-main/examples/localization/src/blocks/Form/buildInitialFormState.tsx

```typescript
import type { FormFieldBlock } from '@payloadcms/plugin-form-builder/types'

export const buildInitialFormState = (fields: FormFieldBlock[]) => {
  return fields?.reduce((initialSchema, field) => {
    if (field.blockType === 'checkbox') {
      return {
        ...initialSchema,
        [field.name]: field.defaultValue,
      }
    }
    if (field.blockType === 'country') {
      return {
        ...initialSchema,
        [field.name]: '',
      }
    }
    if (field.blockType === 'email') {
      return {
        ...initialSchema,
        [field.name]: '',
      }
    }
    if (field.blockType === 'text') {
      return {
        ...initialSchema,
        [field.name]: '',
      }
    }
    if (field.blockType === 'select') {
      return {
        ...initialSchema,
        [field.name]: '',
      }
    }
    if (field.blockType === 'state') {
      return {
        ...initialSchema,
        [field.name]: '',
      }
    }

    return initialSchema
  }, {})
}
```

--------------------------------------------------------------------------------

---[FILE: Component.tsx]---
Location: payload-main/examples/localization/src/blocks/Form/Component.tsx
Signals: React, Next.js

```typescript
'use client'
import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'

import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import RichText from '@/components/RichText'
import { Button } from '@/components/ui/button'

import { buildInitialFormState } from './buildInitialFormState'
import { fields } from './fields'
import { useTranslations } from 'next-intl'

export type Value = unknown

export interface Property {
  [key: string]: Value
}

export interface Data {
  [key: string]: Property | Property[]
}

export type FormBlockType = {
  blockName?: string
  blockType?: 'formBlock'
  enableIntro: boolean
  form: FormType
  introContent?: {
    [k: string]: unknown
  }[]
}

export const FormBlock: React.FC<
  {
    id?: string
  } & FormBlockType
> = (props) => {
  const {
    enableIntro,
    form: formFromProps,
    form: { id: formID, confirmationMessage, confirmationType, redirect, submitButtonLabel } = {},
    introContent,
  } = props

  const formMethods = useForm({
    defaultValues: buildInitialFormState(formFromProps.fields),
  })
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const router = useRouter()
  const t = useTranslations()

  const onSubmit = useCallback(
    (data: Data) => {
      let loadingTimerID: ReturnType<typeof setTimeout>
      const submitForm = async () => {
        setError(undefined)

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        // delay loading indicator by 1s
        loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 1000)

        try {
          const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/form-submissions`, {
            body: JSON.stringify({
              form: formID,
              submissionData: dataToSend,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })

          const res = await req.json()

          clearTimeout(loadingTimerID)

          if (req.status >= 400) {
            setIsLoading(false)

            setError({
              message: res.errors?.[0]?.message || 'Internal Server Error',
              status: res.status,
            })

            return
          }

          setIsLoading(false)
          setHasSubmitted(true)

          if (confirmationType === 'redirect' && redirect) {
            const { url } = redirect

            const redirectUrl = url

            if (redirectUrl) router.push(redirectUrl)
          }
        } catch (err) {
          console.warn(err)
          setIsLoading(false)
          setError({
            message: 'Something went wrong.',
          })
        }
      }

      void submitForm()
    },
    [router, formID, redirect, confirmationType],
  )

  return (
    <div className="container lg:max-w-[48rem] pb-20">
      <FormProvider {...formMethods}>
        {enableIntro && introContent && !hasSubmitted && (
          <RichText className="mb-8" content={introContent} enableGutter={false} />
        )}
        {!isLoading && hasSubmitted && confirmationType === 'message' && (
          <RichText content={confirmationMessage} />
        )}
        {isLoading && !hasSubmitted && <p>{t('loading')}</p>}
        {error && <div>{`${error.status || '500'}: ${error.message || ''}`}</div>}
        {!hasSubmitted && (
          <form id={formID} onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4 last:mb-0">
              {formFromProps &&
                formFromProps.fields &&
                formFromProps.fields?.map((field, index) => {
                  const Field: React.FC<any> = fields?.[field.blockType]
                  if (Field) {
                    return (
                      <div className="mb-6 last:mb-0" key={index}>
                        <Field
                          form={formFromProps}
                          {...field}
                          {...formMethods}
                          control={control}
                          errors={errors}
                          register={register}
                        />
                      </div>
                    )
                  }
                  return null
                })}
            </div>

            <Button form={formID} type="submit" variant="default">
              {submitButtonLabel}
            </Button>
          </form>
        )}
      </FormProvider>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: payload-main/examples/localization/src/blocks/Form/config.ts

```typescript
import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const FormBlock: Block = {
  slug: 'formBlock',
  interfaceName: 'FormBlock',
  fields: [
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
    },
    {
      name: 'enableIntro',
      type: 'checkbox',
      label: 'Enable Intro Content',
    },
    {
      name: 'introContent',
      type: 'richText',
      localized: true,
      admin: {
        condition: (_, { enableIntro }) => Boolean(enableIntro),
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: 'Intro Content',
    },
  ],
  graphQL: {
    singularName: 'FormBlock',
  },
  labels: {
    plural: 'Form Blocks',
    singular: 'Form Block',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: fields.tsx]---
Location: payload-main/examples/localization/src/blocks/Form/fields.tsx

```typescript
import { Checkbox } from './Checkbox'
import { Country } from './Country'
import { Email } from './Email'
import { Message } from './Message'
import { Number } from './Number'
import { Select } from './Select'
import { State } from './State'
import { Text } from './Text'
import { Textarea } from './Textarea'

export const fields = {
  checkbox: Checkbox,
  country: Country,
  email: Email,
  message: Message,
  number: Number,
  select: Select,
  state: State,
  text: Text,
  textarea: Textarea,
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/examples/localization/src/blocks/Form/Checkbox/index.tsx
Signals: React

```typescript
import type { CheckboxField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { useFormContext } from 'react-hook-form'

import { Checkbox as CheckboxUi } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import React from 'react'

import { Error } from '../Error'
import { Width } from '../Width'

export const Checkbox: React.FC<
  CheckboxField & {
    errors: Partial<
      FieldErrorsImpl<{
        [x: string]: any
      }>
    >
    getValues: any
    register: UseFormRegister<FieldValues>
    setValue: any
  }
> = ({ name, defaultValue, errors, label, register, required: requiredFromProps, width }) => {
  const props = register(name, { required: requiredFromProps })
  const { setValue } = useFormContext()

  return (
    <Width width={width}>
      <div className="flex items-center gap-2">
        <CheckboxUi
          defaultChecked={defaultValue}
          id={name}
          {...props}
          onCheckedChange={(checked) => {
            setValue(props.name, checked)
          }}
        />
        <Label htmlFor={name}>{label}</Label>
      </div>
      {requiredFromProps && errors[name] && <Error />}
    </Width>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/examples/localization/src/blocks/Form/Country/index.tsx
Signals: React

```typescript
import type { CountryField } from '@payloadcms/plugin-form-builder/types'
import type { Control, FieldErrorsImpl, FieldValues } from 'react-hook-form'

import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import React from 'react'
import { Controller } from 'react-hook-form'

import { Error } from '../Error'
import { Width } from '../Width'
import { countryOptions } from './options'

export const Country: React.FC<
  CountryField & {
    control: Control<FieldValues, any>
    errors: Partial<
      FieldErrorsImpl<{
        [x: string]: any
      }>
    >
  }
> = ({ name, control, errors, label, required, width }) => {
  return (
    <Width width={width}>
      <Label className="" htmlFor={name}>
        {label}
      </Label>
      <Controller
        control={control}
        defaultValue=""
        name={name}
        render={({ field: { onChange, value } }) => {
          const controlledValue = countryOptions.find((t) => t.value === value)

          return (
            <Select onValueChange={(val) => onChange(val)} value={controlledValue?.value}>
              <SelectTrigger className="w-full" id={name}>
                <SelectValue placeholder={label} />
              </SelectTrigger>
              <SelectContent>
                {countryOptions.map(({ label, value }) => {
                  return (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          )
        }}
        rules={{ required }}
      />
      {required && errors[name] && <Error />}
    </Width>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: options.ts]---
Location: payload-main/examples/localization/src/blocks/Form/Country/options.ts

```typescript
export const countryOptions = [
  {
    label: 'Afghanistan',
    value: 'AF',
  },
  {
    label: 'Åland Islands',
    value: 'AX',
  },
  {
    label: 'Albania',
    value: 'AL',
  },
  {
    label: 'Algeria',
    value: 'DZ',
  },
  {
    label: 'American Samoa',
    value: 'AS',
  },
  {
    label: 'Andorra',
    value: 'AD',
  },
  {
    label: 'Angola',
    value: 'AO',
  },
  {
    label: 'Anguilla',
    value: 'AI',
  },
  {
    label: 'Antarctica',
    value: 'AQ',
  },
  {
    label: 'Antigua and Barbuda',
    value: 'AG',
  },
  {
    label: 'Argentina',
    value: 'AR',
  },
  {
    label: 'Armenia',
    value: 'AM',
  },
  {
    label: 'Aruba',
    value: 'AW',
  },
  {
    label: 'Australia',
    value: 'AU',
  },
  {
    label: 'Austria',
    value: 'AT',
  },
  {
    label: 'Azerbaijan',
    value: 'AZ',
  },
  {
    label: 'Bahamas',
    value: 'BS',
  },
  {
    label: 'Bahrain',
    value: 'BH',
  },
  {
    label: 'Bangladesh',
    value: 'BD',
  },
  {
    label: 'Barbados',
    value: 'BB',
  },
  {
    label: 'Belarus',
    value: 'BY',
  },
  {
    label: 'Belgium',
    value: 'BE',
  },
  {
    label: 'Belize',
    value: 'BZ',
  },
  {
    label: 'Benin',
    value: 'BJ',
  },
  {
    label: 'Bermuda',
    value: 'BM',
  },
  {
    label: 'Bhutan',
    value: 'BT',
  },
  {
    label: 'Bolivia',
    value: 'BO',
  },
  {
    label: 'Bosnia and Herzegovina',
    value: 'BA',
  },
  {
    label: 'Botswana',
    value: 'BW',
  },
  {
    label: 'Bouvet Island',
    value: 'BV',
  },
  {
    label: 'Brazil',
    value: 'BR',
  },
  {
    label: 'British Indian Ocean Territory',
    value: 'IO',
  },
  {
    label: 'Brunei Darussalam',
    value: 'BN',
  },
  {
    label: 'Bulgaria',
    value: 'BG',
  },
  {
    label: 'Burkina Faso',
    value: 'BF',
  },
  {
    label: 'Burundi',
    value: 'BI',
  },
  {
    label: 'Cambodia',
    value: 'KH',
  },
  {
    label: 'Cameroon',
    value: 'CM',
  },
  {
    label: 'Canada',
    value: 'CA',
  },
  {
    label: 'Cape Verde',
    value: 'CV',
  },
  {
    label: 'Cayman Islands',
    value: 'KY',
  },
  {
    label: 'Central African Republic',
    value: 'CF',
  },
  {
    label: 'Chad',
    value: 'TD',
  },
  {
    label: 'Chile',
    value: 'CL',
  },
  {
    label: 'China',
    value: 'CN',
  },
  {
    label: 'Christmas Island',
    value: 'CX',
  },
  {
    label: 'Cocos (Keeling) Islands',
    value: 'CC',
  },
  {
    label: 'Colombia',
    value: 'CO',
  },
  {
    label: 'Comoros',
    value: 'KM',
  },
  {
    label: 'Congo',
    value: 'CG',
  },
  {
    label: 'Congo, The Democratic Republic of the',
    value: 'CD',
  },
  {
    label: 'Cook Islands',
    value: 'CK',
  },
  {
    label: 'Costa Rica',
    value: 'CR',
  },
  {
    label: "Cote D'Ivoire",
    value: 'CI',
  },
  {
    label: 'Croatia',
    value: 'HR',
  },
  {
    label: 'Cuba',
    value: 'CU',
  },
  {
    label: 'Cyprus',
    value: 'CY',
  },
  {
    label: 'Czech Republic',
    value: 'CZ',
  },
  {
    label: 'Denmark',
    value: 'DK',
  },
  {
    label: 'Djibouti',
    value: 'DJ',
  },
  {
    label: 'Dominica',
    value: 'DM',
  },
  {
    label: 'Dominican Republic',
    value: 'DO',
  },
  {
    label: 'Ecuador',
    value: 'EC',
  },
  {
    label: 'Egypt',
    value: 'EG',
  },
  {
    label: 'El Salvador',
    value: 'SV',
  },
  {
    label: 'Equatorial Guinea',
    value: 'GQ',
  },
  {
    label: 'Eritrea',
    value: 'ER',
  },
  {
    label: 'Estonia',
    value: 'EE',
  },
  {
    label: 'Ethiopia',
    value: 'ET',
  },
  {
    label: 'Falkland Islands (Malvinas)',
    value: 'FK',
  },
  {
    label: 'Faroe Islands',
    value: 'FO',
  },
  {
    label: 'Fiji',
    value: 'FJ',
  },
  {
    label: 'Finland',
    value: 'FI',
  },
  {
    label: 'France',
    value: 'FR',
  },
  {
    label: 'French Guiana',
    value: 'GF',
  },
  {
    label: 'French Polynesia',
    value: 'PF',
  },
  {
    label: 'French Southern Territories',
    value: 'TF',
  },
  {
    label: 'Gabon',
    value: 'GA',
  },
  {
    label: 'Gambia',
    value: 'GM',
  },
  {
    label: 'Georgia',
    value: 'GE',
  },
  {
    label: 'Germany',
    value: 'DE',
  },
  {
    label: 'Ghana',
    value: 'GH',
  },
  {
    label: 'Gibraltar',
    value: 'GI',
  },
  {
    label: 'Greece',
    value: 'GR',
  },
  {
    label: 'Greenland',
    value: 'GL',
  },
  {
    label: 'Grenada',
    value: 'GD',
  },
  {
    label: 'Guadeloupe',
    value: 'GP',
  },
  {
    label: 'Guam',
    value: 'GU',
  },
  {
    label: 'Guatemala',
    value: 'GT',
  },
  {
    label: 'Guernsey',
    value: 'GG',
  },
  {
    label: 'Guinea',
    value: 'GN',
  },
  {
    label: 'Guinea-Bissau',
    value: 'GW',
  },
  {
    label: 'Guyana',
    value: 'GY',
  },
  {
    label: 'Haiti',
    value: 'HT',
  },
  {
    label: 'Heard Island and Mcdonald Islands',
    value: 'HM',
  },
  {
    label: 'Holy See (Vatican City State)',
    value: 'VA',
  },
  {
    label: 'Honduras',
    value: 'HN',
  },
  {
    label: 'Hong Kong',
    value: 'HK',
  },
  {
    label: 'Hungary',
    value: 'HU',
  },
  {
    label: 'Iceland',
    value: 'IS',
  },
  {
    label: 'India',
    value: 'IN',
  },
  {
    label: 'Indonesia',
    value: 'ID',
  },
  {
    label: 'Iran, Islamic Republic Of',
    value: 'IR',
  },
  {
    label: 'Iraq',
    value: 'IQ',
  },
  {
    label: 'Ireland',
    value: 'IE',
  },
  {
    label: 'Isle of Man',
    value: 'IM',
  },
  {
    label: 'Israel',
    value: 'IL',
  },
  {
    label: 'Italy',
    value: 'IT',
  },
  {
    label: 'Jamaica',
    value: 'JM',
  },
  {
    label: 'Japan',
    value: 'JP',
  },
  {
    label: 'Jersey',
    value: 'JE',
  },
  {
    label: 'Jordan',
    value: 'JO',
  },
  {
    label: 'Kazakhstan',
    value: 'KZ',
  },
  {
    label: 'Kenya',
    value: 'KE',
  },
  {
    label: 'Kiribati',
    value: 'KI',
  },
  {
    label: "Democratic People's Republic of Korea",
    value: 'KP',
  },
  {
    label: 'Korea, Republic of',
    value: 'KR',
  },
  {
    label: 'Kosovo',
    value: 'XK',
  },
  {
    label: 'Kuwait',
    value: 'KW',
  },
  {
    label: 'Kyrgyzstan',
    value: 'KG',
  },
  {
    label: "Lao People's Democratic Republic",
    value: 'LA',
  },
  {
    label: 'Latvia',
    value: 'LV',
  },
  {
    label: 'Lebanon',
    value: 'LB',
  },
  {
    label: 'Lesotho',
    value: 'LS',
  },
  {
    label: 'Liberia',
    value: 'LR',
  },
  {
    label: 'Libyan Arab Jamahiriya',
    value: 'LY',
  },
  {
    label: 'Liechtenstein',
    value: 'LI',
  },
  {
    label: 'Lithuania',
    value: 'LT',
  },
  {
    label: 'Luxembourg',
    value: 'LU',
  },
  {
    label: 'Macao',
    value: 'MO',
  },
  {
    label: 'Macedonia, The Former Yugoslav Republic of',
    value: 'MK',
  },
  {
    label: 'Madagascar',
    value: 'MG',
  },
  {
    label: 'Malawi',
    value: 'MW',
  },
  {
    label: 'Malaysia',
    value: 'MY',
  },
  {
    label: 'Maldives',
    value: 'MV',
  },
  {
    label: 'Mali',
    value: 'ML',
  },
  {
    label: 'Malta',
    value: 'MT',
  },
  {
    label: 'Marshall Islands',
    value: 'MH',
  },
  {
    label: 'Martinique',
    value: 'MQ',
  },
  {
    label: 'Mauritania',
    value: 'MR',
  },
  {
    label: 'Mauritius',
    value: 'MU',
  },
  {
    label: 'Mayotte',
    value: 'YT',
  },
  {
    label: 'Mexico',
    value: 'MX',
  },
  {
    label: 'Micronesia, Federated States of',
    value: 'FM',
  },
  {
    label: 'Moldova, Republic of',
    value: 'MD',
  },
  {
    label: 'Monaco',
    value: 'MC',
  },
  {
    label: 'Mongolia',
    value: 'MN',
  },
  {
    label: 'Montenegro',
    value: 'ME',
  },
  {
    label: 'Montserrat',
    value: 'MS',
  },
  {
    label: 'Morocco',
    value: 'MA',
  },
  {
    label: 'Mozambique',
    value: 'MZ',
  },
  {
    label: 'Myanmar',
    value: 'MM',
  },
  {
    label: 'Namibia',
    value: 'NA',
  },
  {
    label: 'Nauru',
    value: 'NR',
  },
  {
    label: 'Nepal',
    value: 'NP',
  },
  {
    label: 'Netherlands',
    value: 'NL',
  },
  {
    label: 'Netherlands Antilles',
    value: 'AN',
  },
  {
    label: 'New Caledonia',
    value: 'NC',
  },
  {
    label: 'New Zealand',
    value: 'NZ',
  },
  {
    label: 'Nicaragua',
    value: 'NI',
  },
  {
    label: 'Niger',
    value: 'NE',
  },
  {
    label: 'Nigeria',
    value: 'NG',
  },
  {
    label: 'Niue',
    value: 'NU',
  },
  {
    label: 'Norfolk Island',
    value: 'NF',
  },
  {
    label: 'Northern Mariana Islands',
    value: 'MP',
  },
  {
    label: 'Norway',
    value: 'NO',
  },
  {
    label: 'Oman',
    value: 'OM',
  },
  {
    label: 'Pakistan',
    value: 'PK',
  },
  {
    label: 'Palau',
    value: 'PW',
  },
  {
    label: 'Palestinian Territory, Occupied',
    value: 'PS',
  },
  {
    label: 'Panama',
    value: 'PA',
  },
  {
    label: 'Papua New Guinea',
    value: 'PG',
  },
  {
    label: 'Paraguay',
    value: 'PY',
  },
  {
    label: 'Peru',
    value: 'PE',
  },
  {
    label: 'Philippines',
    value: 'PH',
  },
  {
    label: 'Pitcairn',
    value: 'PN',
  },
  {
    label: 'Poland',
    value: 'PL',
  },
  {
    label: 'Portugal',
    value: 'PT',
  },
  {
    label: 'Puerto Rico',
    value: 'PR',
  },
  {
    label: 'Qatar',
    value: 'QA',
  },
  {
    label: 'Reunion',
    value: 'RE',
  },
  {
    label: 'Romania',
    value: 'RO',
  },
  {
    label: 'Russian Federation',
    value: 'RU',
  },
  {
    label: 'Rwanda',
    value: 'RW',
  },
  {
    label: 'Saint Helena',
    value: 'SH',
  },
  {
    label: 'Saint Kitts and Nevis',
    value: 'KN',
  },
  {
    label: 'Saint Lucia',
    value: 'LC',
  },
  {
    label: 'Saint Pierre and Miquelon',
    value: 'PM',
  },
  {
    label: 'Saint Vincent and the Grenadines',
    value: 'VC',
  },
  {
    label: 'Samoa',
    value: 'WS',
  },
  {
    label: 'San Marino',
    value: 'SM',
  },
  {
    label: 'Sao Tome and Principe',
    value: 'ST',
  },
  {
    label: 'Saudi Arabia',
    value: 'SA',
  },
  {
    label: 'Senegal',
    value: 'SN',
  },
  {
    label: 'Serbia',
    value: 'RS',
  },
  {
    label: 'Seychelles',
    value: 'SC',
  },
  {
    label: 'Sierra Leone',
    value: 'SL',
  },
  {
    label: 'Singapore',
    value: 'SG',
  },
  {
    label: 'Slovakia',
    value: 'SK',
  },
  {
    label: 'Slovenia',
    value: 'SI',
  },
  {
    label: 'Solomon Islands',
    value: 'SB',
  },
  {
    label: 'Somalia',
    value: 'SO',
  },
  {
    label: 'South Africa',
    value: 'ZA',
  },
  {
    label: 'South Georgia and the South Sandwich Islands',
    value: 'GS',
  },
  {
    label: 'Spain',
    value: 'ES',
  },
  {
    label: 'Sri Lanka',
    value: 'LK',
  },
  {
    label: 'Sudan',
    value: 'SD',
  },
  {
    label: 'Suriname',
    value: 'SR',
  },
  {
    label: 'Svalbard and Jan Mayen',
    value: 'SJ',
  },
  {
    label: 'Swaziland',
    value: 'SZ',
  },
  {
    label: 'Sweden',
    value: 'SE',
  },
  {
    label: 'Switzerland',
    value: 'CH',
  },
  {
    label: 'Syrian Arab Republic',
    value: 'SY',
  },
  {
    label: 'Taiwan',
    value: 'TW',
  },
  {
    label: 'Tajikistan',
    value: 'TJ',
  },
  {
    label: 'Tanzania, United Republic of',
    value: 'TZ',
  },
  {
    label: 'Thailand',
    value: 'TH',
  },
  {
    label: 'Timor-Leste',
    value: 'TL',
  },
  {
    label: 'Togo',
    value: 'TG',
  },
  {
    label: 'Tokelau',
    value: 'TK',
  },
  {
    label: 'Tonga',
    value: 'TO',
  },
  {
    label: 'Trinidad and Tobago',
    value: 'TT',
  },
  {
    label: 'Tunisia',
    value: 'TN',
  },
  {
    label: 'Turkey',
    value: 'TR',
  },
  {
    label: 'Turkmenistan',
    value: 'TM',
  },
  {
    label: 'Turks and Caicos Islands',
    value: 'TC',
  },
  {
    label: 'Tuvalu',
    value: 'TV',
  },
  {
    label: 'Uganda',
    value: 'UG',
  },
  {
    label: 'Ukraine',
    value: 'UA',
  },
  {
    label: 'United Arab Emirates',
    value: 'AE',
  },
  {
    label: 'United Kingdom',
    value: 'GB',
  },
  {
    label: 'United States',
    value: 'US',
  },
  {
    label: 'United States Minor Outlying Islands',
    value: 'UM',
  },
  {
    label: 'Uruguay',
    value: 'UY',
  },
  {
    label: 'Uzbekistan',
    value: 'UZ',
  },
  {
    label: 'Vanuatu',
    value: 'VU',
  },
  {
    label: 'Venezuela',
    value: 'VE',
  },
  {
    label: 'Viet Nam',
    value: 'VN',
  },
  {
    label: 'Virgin Islands, British',
    value: 'VG',
  },
  {
    label: 'Virgin Islands, U.S.',
    value: 'VI',
  },
  {
    label: 'Wallis and Futuna',
    value: 'WF',
  },
  {
    label: 'Western Sahara',
    value: 'EH',
  },
  {
    label: 'Yemen',
    value: 'YE',
  },
  {
    label: 'Zambia',
    value: 'ZM',
  },
  {
    label: 'Zimbabwe',
    value: 'ZW',
  },
]
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/examples/localization/src/blocks/Form/Email/index.tsx
Signals: React

```typescript
import type { EmailField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'

import { Error } from '../Error'
import { Width } from '../Width'

export const Email: React.FC<
  EmailField & {
    errors: Partial<
      FieldErrorsImpl<{
        [x: string]: any
      }>
    >
    register: UseFormRegister<FieldValues>
  }
> = ({ name, defaultValue, errors, label, register, required: requiredFromProps, width }) => {
  return (
    <Width width={width}>
      <Label htmlFor={name}>{label}</Label>
      <Input
        defaultValue={defaultValue}
        id={name}
        type="text"
        {...register(name, { pattern: /^\S[^\s@]*@\S+$/, required: requiredFromProps })}
      />

      {requiredFromProps && errors[name] && <Error />}
    </Width>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/examples/localization/src/blocks/Form/Error/index.tsx
Signals: React

```typescript
import * as React from 'react'

export const Error: React.FC = () => {
  return <div className="mt-2 text-red-500 text-sm">This field is required</div>
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/examples/localization/src/blocks/Form/Message/index.tsx
Signals: React

```typescript
import RichText from '@/components/RichText'
import React from 'react'

import { Width } from '../Width'

export const Message: React.FC = ({ message }: { message: Record<string, any> }) => {
  return (
    <Width className="my-12" width="100">
      {message && <RichText content={message} />}
    </Width>
  )
}
```

--------------------------------------------------------------------------------

````
