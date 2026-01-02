---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 259
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 259 of 695)

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

---[FILE: MetaDescriptionComponent.tsx]---
Location: payload-main/packages/plugin-seo/src/fields/MetaDescription/MetaDescriptionComponent.tsx
Signals: React

```typescript
'use client'

import type { FieldType } from '@payloadcms/ui'
import type { TextareaFieldClientProps } from 'payload'

import {
  FieldLabel,
  TextareaInput,
  useConfig,
  useDocumentInfo,
  useDocumentTitle,
  useField,
  useForm,
  useLocale,
  useTranslation,
} from '@payloadcms/ui'
import { reduceToSerializableFields } from '@payloadcms/ui/shared'
import React, { useCallback } from 'react'

import type { PluginSEOTranslationKeys, PluginSEOTranslations } from '../../translations/index.js'
import type { GenerateDescription } from '../../types.js'

import { defaults } from '../../defaults.js'
import { LengthIndicator } from '../../ui/LengthIndicator.js'

const { maxLength: maxLengthDefault, minLength: minLengthDefault } = defaults.description

type MetaDescriptionProps = {
  readonly hasGenerateDescriptionFn: boolean
} & TextareaFieldClientProps

export const MetaDescriptionComponent: React.FC<MetaDescriptionProps> = (props) => {
  const {
    field: {
      label,
      localized,
      maxLength: maxLengthFromProps,
      minLength: minLengthFromProps,
      required,
    },
    hasGenerateDescriptionFn,
    readOnly,
  } = props

  const {
    config: {
      routes: { api },
      serverURL,
    },
  } = useConfig()

  const { t } = useTranslation<PluginSEOTranslations, PluginSEOTranslationKeys>()

  const locale = useLocale()
  const { getData } = useForm()
  const docInfo = useDocumentInfo()
  const { title } = useDocumentTitle()

  const maxLength = maxLengthFromProps || maxLengthDefault
  const minLength = minLengthFromProps || minLengthDefault

  const {
    customComponents: { AfterInput, BeforeInput, Label } = {},
    errorMessage,
    path,
    setValue,
    showError,
    value,
  }: FieldType<string> = useField()

  const regenerateDescription = useCallback(async () => {
    if (!hasGenerateDescriptionFn) {
      return
    }

    const endpoint = `${serverURL}${api}/plugin-seo/generate-description`

    const genDescriptionResponse = await fetch(endpoint, {
      body: JSON.stringify({
        id: docInfo.id,
        collectionSlug: docInfo.collectionSlug,
        doc: getData(),
        docPermissions: docInfo.docPermissions,
        globalSlug: docInfo.globalSlug,
        hasPublishPermission: docInfo.hasPublishPermission,
        hasSavePermission: docInfo.hasSavePermission,
        initialData: docInfo.initialData,
        initialState: reduceToSerializableFields(docInfo.initialState ?? {}),
        locale: typeof locale === 'object' ? locale?.code : locale,
        title,
      } satisfies Omit<
        Parameters<GenerateDescription>[0],
        'collectionConfig' | 'globalConfig' | 'hasPublishedDoc' | 'req' | 'versionCount'
      >),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    const { result: generatedDescription } = await genDescriptionResponse.json()

    setValue(generatedDescription || '')
  }, [
    hasGenerateDescriptionFn,
    serverURL,
    api,
    docInfo.id,
    docInfo.collectionSlug,
    docInfo.docPermissions,
    docInfo.globalSlug,
    docInfo.hasPublishPermission,
    docInfo.hasSavePermission,
    docInfo.initialData,
    docInfo.initialState,
    getData,
    locale,
    setValue,
    title,
  ])

  return (
    <div
      style={{
        marginBottom: '20px',
      }}
    >
      <div
        style={{
          marginBottom: '5px',
          position: 'relative',
        }}
      >
        <div className="plugin-seo__field">
          {Label ?? (
            <FieldLabel label={label} localized={localized} path={path} required={required} />
          )}
          {hasGenerateDescriptionFn && (
            <React.Fragment>
              &nbsp; &mdash; &nbsp;
              <button
                disabled={readOnly}
                onClick={() => {
                  void regenerateDescription()
                }}
                style={{
                  background: 'none',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'currentcolor',
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline',
                }}
                type="button"
              >
                {t('plugin-seo:autoGenerate')}
              </button>
            </React.Fragment>
          )}
        </div>
        <div
          style={{
            color: '#9A9A9A',
          }}
        >
          {t('plugin-seo:lengthTipDescription', { maxLength, minLength })}
          <a
            href="https://developers.google.com/search/docs/advanced/appearance/snippet#meta-descriptions"
            rel="noopener noreferrer"
            target="_blank"
          >
            {t('plugin-seo:bestPractices')}
          </a>
        </div>
      </div>
      <div
        style={{
          marginBottom: '10px',
          position: 'relative',
        }}
      >
        <TextareaInput
          AfterInput={AfterInput}
          BeforeInput={BeforeInput}
          Error={errorMessage}
          onChange={setValue}
          path={path}
          readOnly={readOnly}
          required={required}
          showError={showError}
          style={{
            marginBottom: 0,
          }}
          value={value}
        />
      </div>
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          width: '100%',
        }}
      >
        <LengthIndicator maxLength={maxLength} minLength={minLength} text={value} />
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/plugin-seo/src/fields/MetaImage/index.ts

```typescript
import type { UploadField } from 'payload'

interface FieldFunctionProps {
  /**
   * Tell the component if the generate function is available as configured in the plugin config
   */
  hasGenerateFn?: boolean
  overrides?: Partial<UploadField>
  relationTo: string
}

type FieldFunction = ({ hasGenerateFn, overrides }: FieldFunctionProps) => UploadField

export const MetaImageField: FieldFunction = ({ hasGenerateFn = false, overrides, relationTo }) => {
  const imageField = {
    name: 'image',
    type: 'upload',
    admin: {
      components: {
        Field: {
          clientProps: {
            hasGenerateImageFn: hasGenerateFn,
          },
          path: '@payloadcms/plugin-seo/client#MetaImageComponent',
        },
      },
      description: 'Maximum upload file size: 12MB. Recommended file size for images is <500KB.',
    },
    label: 'Meta Image',
    localized: true,
    relationTo,
    ...((overrides ?? {}) as { hasMany: boolean } & Partial<UploadField>),
  } as UploadField

  return imageField
}
```

--------------------------------------------------------------------------------

---[FILE: MetaImageComponent.tsx]---
Location: payload-main/packages/plugin-seo/src/fields/MetaImage/MetaImageComponent.tsx
Signals: React

```typescript
'use client'

import type { FieldType } from '@payloadcms/ui'
import type { UploadFieldClientProps } from 'payload'

import {
  FieldLabel,
  RenderCustomComponent,
  UploadInput,
  useConfig,
  useDocumentInfo,
  useDocumentTitle,
  useField,
  useForm,
  useLocale,
  useTranslation,
} from '@payloadcms/ui'
import { reduceToSerializableFields } from '@payloadcms/ui/shared'
import React, { useCallback } from 'react'

import type { PluginSEOTranslationKeys, PluginSEOTranslations } from '../../translations/index.js'
import type { GenerateImage } from '../../types.js'

import { Pill } from '../../ui/Pill.js'

type MetaImageProps = {
  readonly hasGenerateImageFn: boolean
} & UploadFieldClientProps

export const MetaImageComponent: React.FC<MetaImageProps> = (props) => {
  const {
    field: { admin: { allowCreate } = {}, label, localized, relationTo, required },
    hasGenerateImageFn,
    readOnly,
  } = props

  const {
    config: {
      routes: { api },
      serverURL,
    },
    getEntityConfig,
  } = useConfig()

  const {
    customComponents: { Error, Label } = {},
    filterOptions,
    path,
    setValue,
    showError,
    value,
  }: FieldType<number | string> = useField()

  const { t } = useTranslation<PluginSEOTranslations, PluginSEOTranslationKeys>()

  const locale = useLocale()
  const { getData } = useForm()
  const docInfo = useDocumentInfo()

  const { title } = useDocumentTitle()

  const regenerateImage = useCallback(async () => {
    if (!hasGenerateImageFn) {
      return
    }

    const endpoint = `${serverURL}${api}/plugin-seo/generate-image`

    const genImageResponse = await fetch(endpoint, {
      body: JSON.stringify({
        id: docInfo.id,
        collectionSlug: docInfo.collectionSlug,
        doc: getData(),
        docPermissions: docInfo.docPermissions,
        globalSlug: docInfo.globalSlug,
        hasPublishPermission: docInfo.hasPublishPermission,
        hasSavePermission: docInfo.hasSavePermission,
        initialData: docInfo.initialData,
        initialState: reduceToSerializableFields(docInfo.initialState ?? {}),
        locale: typeof locale === 'object' ? locale?.code : locale,
        title,
      } satisfies Omit<
        Parameters<GenerateImage>[0],
        'collectionConfig' | 'globalConfig' | 'hasPublishedDoc' | 'req' | 'versionCount'
      >),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    const { result: generatedImage } = await genImageResponse.json()

    // string ids, number ids or nullish values
    let newValue: null | number | string | undefined = generatedImage
    // non-nullish resolved relations
    if (typeof generatedImage === 'object' && generatedImage && 'id' in generatedImage) {
      newValue = generatedImage.id
    }

    // coerce to an empty string for falsy (=empty) values
    setValue(newValue || '')
  }, [
    hasGenerateImageFn,
    serverURL,
    api,
    docInfo.id,
    docInfo.collectionSlug,
    docInfo.docPermissions,
    docInfo.globalSlug,
    docInfo.hasPublishPermission,
    docInfo.hasSavePermission,
    docInfo.initialData,
    docInfo.initialState,
    getData,
    locale,
    setValue,
    title,
  ])

  const hasImage = Boolean(value)

  const collection = getEntityConfig({ collectionSlug: relationTo })

  return (
    <div
      style={{
        marginBottom: '20px',
      }}
    >
      <div
        style={{
          marginBottom: '5px',
          position: 'relative',
        }}
      >
        <div className="plugin-seo__field">
          <RenderCustomComponent
            CustomComponent={Label}
            Fallback={
              <FieldLabel label={label} localized={localized} path={path} required={required} />
            }
          />
          {hasGenerateImageFn && (
            <React.Fragment>
              &nbsp; &mdash; &nbsp;
              <button
                disabled={readOnly}
                onClick={() => {
                  void regenerateImage()
                }}
                style={{
                  background: 'none',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'currentcolor',
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline',
                }}
                type="button"
              >
                {t('plugin-seo:autoGenerate')}
              </button>
            </React.Fragment>
          )}
        </div>
        {hasGenerateImageFn && (
          <div
            style={{
              color: '#9A9A9A',
            }}
          >
            {t('plugin-seo:imageAutoGenerationTip')}
          </div>
        )}
      </div>
      <div
        style={{
          marginBottom: '10px',
          position: 'relative',
        }}
      >
        <UploadInput
          allowCreate={allowCreate !== false}
          api={api}
          collection={collection}
          Error={Error}
          filterOptions={filterOptions}
          onChange={(incomingImage) => {
            if (incomingImage !== null) {
              if (typeof incomingImage === 'object') {
                const { id: incomingID } = incomingImage
                setValue(incomingID)
              } else {
                setValue(incomingImage)
              }
            } else {
              setValue(null)
            }
          }}
          path={path}
          readOnly={readOnly}
          relationTo={relationTo}
          required={required}
          serverURL={serverURL}
          showError={showError}
          style={{
            marginBottom: 0,
          }}
          value={value}
        />
      </div>
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          width: '100%',
        }}
      >
        <Pill
          backgroundColor={hasImage ? 'green' : 'red'}
          color="white"
          label={hasImage ? t('plugin-seo:good') : t('plugin-seo:noImage')}
        />
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/plugin-seo/src/fields/MetaTitle/index.ts

```typescript
import type { TextField } from 'payload'

interface FieldFunctionProps {
  /**
   * Tell the component if the generate function is available as configured in the plugin config
   */
  hasGenerateFn?: boolean
  overrides?: Partial<TextField>
}

type FieldFunction = ({ hasGenerateFn, overrides }: FieldFunctionProps) => TextField

export const MetaTitleField: FieldFunction = ({ hasGenerateFn = false, overrides }) => {
  return {
    name: 'title',
    type: 'text',
    admin: {
      components: {
        Field: {
          clientProps: {
            hasGenerateTitleFn: hasGenerateFn,
          },
          path: '@payloadcms/plugin-seo/client#MetaTitleComponent',
        },
      },
    },
    localized: true,
    ...((overrides ?? {}) as { hasMany: boolean } & Partial<TextField>),
  }
}
```

--------------------------------------------------------------------------------

---[FILE: MetaTitleComponent.tsx]---
Location: payload-main/packages/plugin-seo/src/fields/MetaTitle/MetaTitleComponent.tsx
Signals: React

```typescript
'use client'

import type { FieldType } from '@payloadcms/ui'
import type { TextFieldClientProps } from 'payload'

import {
  FieldLabel,
  TextInput,
  useConfig,
  useDocumentInfo,
  useDocumentTitle,
  useField,
  useForm,
  useLocale,
  useTranslation,
} from '@payloadcms/ui'
import { reduceToSerializableFields } from '@payloadcms/ui/shared'
import React, { useCallback } from 'react'

import type { PluginSEOTranslationKeys, PluginSEOTranslations } from '../../translations/index.js'
import type { GenerateTitle } from '../../types.js'

import { defaults } from '../../defaults.js'
import { LengthIndicator } from '../../ui/LengthIndicator.js'
import '../index.scss'

const { maxLength: maxLengthDefault, minLength: minLengthDefault } = defaults.title

type MetaTitleProps = {
  readonly hasGenerateTitleFn: boolean
} & TextFieldClientProps

export const MetaTitleComponent: React.FC<MetaTitleProps> = (props) => {
  const {
    field: {
      label,
      localized,
      maxLength: maxLengthFromProps,
      minLength: minLengthFromProps,
      required,
    },
    hasGenerateTitleFn,
    readOnly,
  } = props

  const { t } = useTranslation<PluginSEOTranslations, PluginSEOTranslationKeys>()

  const {
    config: {
      routes: { api },
      serverURL,
    },
  } = useConfig()

  const {
    customComponents: { AfterInput, BeforeInput, Label } = {},
    errorMessage,
    path,
    setValue,
    showError,
    value,
  }: FieldType<string> = useField()

  const locale = useLocale()
  const { getData } = useForm()
  const docInfo = useDocumentInfo()
  const { title } = useDocumentTitle()

  const minLength = minLengthFromProps || minLengthDefault
  const maxLength = maxLengthFromProps || maxLengthDefault

  const regenerateTitle = useCallback(async () => {
    if (!hasGenerateTitleFn) {
      return
    }

    const endpoint = `${serverURL}${api}/plugin-seo/generate-title`

    const genTitleResponse = await fetch(endpoint, {
      body: JSON.stringify({
        id: docInfo.id,
        collectionSlug: docInfo.collectionSlug,
        doc: getData(),
        docPermissions: docInfo.docPermissions,
        globalSlug: docInfo.globalSlug,
        hasPublishPermission: docInfo.hasPublishPermission,
        hasSavePermission: docInfo.hasSavePermission,
        initialData: docInfo.initialData,
        initialState: reduceToSerializableFields(docInfo.initialState ?? {}),
        locale: typeof locale === 'object' ? locale?.code : locale,
        title,
      } satisfies Omit<
        Parameters<GenerateTitle>[0],
        'collectionConfig' | 'globalConfig' | 'hasPublishedDoc' | 'req' | 'versionCount'
      >),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    const { result: generatedTitle } = await genTitleResponse.json()

    setValue(generatedTitle || '')
  }, [
    hasGenerateTitleFn,
    serverURL,
    api,
    docInfo.id,
    docInfo.collectionSlug,
    docInfo.docPermissions,
    docInfo.globalSlug,
    docInfo.hasPublishPermission,
    docInfo.hasSavePermission,
    docInfo.initialData,
    docInfo.initialState,
    getData,
    locale,
    setValue,
    title,
  ])

  return (
    <div
      style={{
        marginBottom: '20px',
      }}
    >
      <div
        style={{
          marginBottom: '5px',
          position: 'relative',
        }}
      >
        <div className="plugin-seo__field">
          {Label ?? (
            <FieldLabel label={label} localized={localized} path={path} required={required} />
          )}
          {hasGenerateTitleFn && (
            <React.Fragment>
              &nbsp; &mdash; &nbsp;
              <button
                disabled={readOnly}
                onClick={() => {
                  void regenerateTitle()
                }}
                style={{
                  background: 'none',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'currentcolor',
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline',
                }}
                type="button"
              >
                {t('plugin-seo:autoGenerate')}
              </button>
            </React.Fragment>
          )}
        </div>
        <div
          style={{
            color: '#9A9A9A',
          }}
        >
          {t('plugin-seo:lengthTipTitle', { maxLength, minLength })}
          <a
            href="https://developers.google.com/search/docs/advanced/appearance/title-link#page-titles"
            rel="noopener noreferrer"
            target="_blank"
          >
            {t('plugin-seo:bestPractices')}
          </a>
          .
        </div>
      </div>
      <div
        style={{
          marginBottom: '10px',
          position: 'relative',
        }}
      >
        <TextInput
          AfterInput={AfterInput}
          BeforeInput={BeforeInput}
          Error={errorMessage}
          onChange={setValue}
          path={path}
          readOnly={readOnly}
          required={required}
          showError={showError}
          style={{
            marginBottom: 0,
          }}
          value={value}
        />
      </div>
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          width: '100%',
        }}
      >
        <LengthIndicator maxLength={maxLength} minLength={minLength} text={value} />
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/plugin-seo/src/fields/Overview/index.tsx

```typescript
import type { UIField } from 'payload'

interface FieldFunctionProps {
  descriptionOverrides?: {
    maxLength?: number
    minLength?: number
  }
  /**
   * Path to the description field to use for the preview
   *
   * @default 'meta.description'
   */
  descriptionPath?: string
  /**
   * Path to the image field to use for the preview
   *
   * @default 'meta.image'
   */
  imagePath?: string
  overrides?: Partial<UIField>
  titleOverrides?: {
    maxLength?: number
    minLength?: number
  }
  /**
   * Path to the title field to use for the preview
   *
   * @default 'meta.title'
   */
  titlePath?: string
}

type FieldFunction = ({ overrides }: FieldFunctionProps) => UIField

export const OverviewField: FieldFunction = ({
  descriptionOverrides,
  descriptionPath,
  imagePath,
  overrides,
  titleOverrides,
  titlePath,
}) => {
  return {
    name: 'overview',
    type: 'ui',
    admin: {
      components: {
        Field: {
          clientProps: {
            descriptionOverrides,
            descriptionPath,
            imagePath,
            titleOverrides,
            titlePath,
          },
          path: '@payloadcms/plugin-seo/client#OverviewComponent',
        },
      },
    },
    label: 'Overview',
    ...(overrides ?? {}),
  }
}
```

--------------------------------------------------------------------------------

---[FILE: OverviewComponent.tsx]---
Location: payload-main/packages/plugin-seo/src/fields/Overview/OverviewComponent.tsx
Signals: React

```typescript
'use client'

import type { FormField, UIField } from 'payload'

import { useAllFormFields, useForm, useTranslation } from '@payloadcms/ui'
import React, { useCallback, useEffect, useState } from 'react'

import type { PluginSEOTranslationKeys, PluginSEOTranslations } from '../../translations/index.js'

import { defaults } from '../../defaults.js'

const {
  description: { maxLength: maxDescDefault, minLength: minDescDefault },
  title: { maxLength: maxTitleDefault, minLength: minTitleDefault },
} = defaults

type OverviewProps = {
  descriptionOverrides?: {
    maxLength?: number
    minLength?: number
  }
  descriptionPath?: string
  imagePath?: string
  titleOverrides?: {
    maxLength?: number
    minLength?: number
  }
  titlePath?: string
} & UIField

export const OverviewComponent: React.FC<OverviewProps> = ({
  descriptionOverrides,
  descriptionPath: descriptionPathFromContext,
  imagePath: imagePathFromContext,
  titleOverrides,
  titlePath: titlePathFromContext,
}) => {
  const { getFields } = useForm()

  const descriptionPath = descriptionPathFromContext || 'meta.description'
  const titlePath = titlePathFromContext || 'meta.title'
  const imagePath = imagePathFromContext || 'meta.image'

  const [
    {
      [descriptionPath]: { value: metaDesc } = {} as FormField,
      [imagePath]: { value: metaImage } = {} as FormField,
      [titlePath]: { value: metaTitle } = {} as FormField,
    },
  ] = useAllFormFields()
  const { t } = useTranslation<PluginSEOTranslations, PluginSEOTranslationKeys>()

  const [titleIsValid, setTitleIsValid] = useState<boolean | undefined>()
  const [descIsValid, setDescIsValid] = useState<boolean | undefined>()
  const [imageIsValid, setImageIsValid] = useState<boolean | undefined>()

  const minDesc = descriptionOverrides?.minLength || minDescDefault
  const maxDesc = descriptionOverrides?.maxLength || maxDescDefault
  const minTitle = titleOverrides?.minLength || minTitleDefault
  const maxTitle = titleOverrides?.maxLength || maxTitleDefault

  useEffect(() => {
    if (typeof metaTitle === 'string') {
      setTitleIsValid(metaTitle.length >= minTitle && metaTitle.length <= maxTitle)
    }
    if (typeof metaDesc === 'string') {
      setDescIsValid(metaDesc.length >= minDesc && metaDesc.length <= maxDesc)
    }
    setImageIsValid(Boolean(metaImage))
  }, [metaTitle, metaDesc, metaImage])

  const testResults = [titleIsValid, descIsValid, imageIsValid]

  const numberOfPasses = testResults.filter(Boolean).length

  return (
    <div
      style={{
        marginBottom: '20px',
      }}
    >
      <div>
        {t('plugin-seo:checksPassing', { current: numberOfPasses, max: testResults.length })}
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/plugin-seo/src/fields/Preview/index.tsx

```typescript
import type { UIField } from 'payload'

interface FieldFunctionProps {
  /**
   * Path to the description field to use for the preview
   *
   * @default 'meta.description'
   */
  descriptionPath?: string
  /**
   * Tell the component if the generate function is available as configured in the plugin config
   */
  hasGenerateFn?: boolean
  overrides?: Partial<UIField>
  /**
   * Path to the title field to use for the preview
   *
   * @default 'meta.title'
   */
  titlePath?: string
}

type FieldFunction = ({ hasGenerateFn, overrides }: FieldFunctionProps) => UIField

export const PreviewField: FieldFunction = ({
  descriptionPath,
  hasGenerateFn = false,
  overrides,
  titlePath,
}) => {
  return {
    name: 'preview',
    type: 'ui',
    admin: {
      components: {
        Field: {
          clientProps: {
            descriptionPath,
            hasGenerateURLFn: hasGenerateFn,
            titlePath,
          },
          path: '@payloadcms/plugin-seo/client#PreviewComponent',
        },
      },
    },
    label: 'Preview',
    ...(overrides ?? {}),
  }
}
```

--------------------------------------------------------------------------------

---[FILE: PreviewComponent.tsx]---
Location: payload-main/packages/plugin-seo/src/fields/Preview/PreviewComponent.tsx
Signals: React

```typescript
'use client'

import type { FormField, UIField } from 'payload'

import {
  useAllFormFields,
  useConfig,
  useDocumentInfo,
  useDocumentTitle,
  useForm,
  useLocale,
  useTranslation,
} from '@payloadcms/ui'
import { reduceToSerializableFields } from '@payloadcms/ui/shared'
import React, { useEffect, useState } from 'react'

import type { PluginSEOTranslationKeys, PluginSEOTranslations } from '../../translations/index.js'
import type { GenerateURL } from '../../types.js'

type PreviewProps = {
  readonly descriptionPath?: string
  readonly hasGenerateURLFn: boolean
  readonly titlePath?: string
} & UIField

export const PreviewComponent: React.FC<PreviewProps> = (props) => {
  const {
    descriptionPath: descriptionPathFromContext,
    hasGenerateURLFn,
    titlePath: titlePathFromContext,
  } = props

  const { t } = useTranslation<PluginSEOTranslations, PluginSEOTranslationKeys>()

  const {
    config: {
      routes: { api },
      serverURL,
    },
  } = useConfig()

  const locale = useLocale()
  const [fields] = useAllFormFields()
  const { getData } = useForm()
  const docInfo = useDocumentInfo()
  const { title } = useDocumentTitle()

  const descriptionPath = descriptionPathFromContext || 'meta.description'
  const titlePath = titlePathFromContext || 'meta.title'

  const {
    [descriptionPath]: { value: metaDescription } = {} as FormField,
    [titlePath]: { value: metaTitle } = {} as FormField,
  } = fields

  const [href, setHref] = useState<string>()

  useEffect(() => {
    const endpoint = `${serverURL}${api}/plugin-seo/generate-url`

    const getHref = async () => {
      const genURLResponse = await fetch(endpoint, {
        body: JSON.stringify({
          id: docInfo.id,
          collectionSlug: docInfo.collectionSlug,
          doc: getData(),
          docPermissions: docInfo.docPermissions,
          globalSlug: docInfo.globalSlug,
          hasPublishPermission: docInfo.hasPublishPermission,
          hasSavePermission: docInfo.hasSavePermission,
          initialData: docInfo.initialData,
          initialState: reduceToSerializableFields(docInfo.initialState ?? {}),
          locale: typeof locale === 'object' ? locale?.code : locale,
          title,
        } satisfies Omit<
          Parameters<GenerateURL>[0],
          'collectionConfig' | 'globalConfig' | 'hasPublishedDoc' | 'req' | 'versionCount'
        >),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      const { result: newHref } = await genURLResponse.json()

      setHref(newHref)
    }

    if (hasGenerateURLFn && !href) {
      void getHref()
    }
  }, [fields, href, locale, docInfo, hasGenerateURLFn, getData, serverURL, api, title])

  return (
    <div
      style={{
        marginBottom: '20px',
      }}
    >
      <div>{t('plugin-seo:preview')}</div>
      <div
        style={{
          color: '#9A9A9A',
          marginBottom: '5px',
        }}
      >
        {t('plugin-seo:previewDescription')}
      </div>
      <div
        style={{
          background: 'var(--theme-elevation-50)',
          borderRadius: '5px',
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
          maxWidth: '600px',
          padding: '20px',
          pointerEvents: 'none',
          width: '100%',
        }}
      >
        <div>
          <a
            href={href}
            style={{
              textDecoration: 'none',
            }}
          >
            {href || 'https://...'}
          </a>
        </div>
        <h4
          style={{
            margin: 0,
          }}
        >
          <a
            href="/"
            style={{
              textDecoration: 'none',
            }}
          >
            {metaTitle as string}
          </a>
        </h4>
        <p
          style={{
            margin: 0,
          }}
        >
          {metaDescription as string}
        </p>
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: ar.ts]---
Location: payload-main/packages/plugin-seo/src/translations/ar.ts

```typescript
import type { GenericTranslationsObject } from '@payloadcms/translations'

export const ar: GenericTranslationsObject = {
  $schema: './translation-schema.json',
  'plugin-seo': {
    almostThere: 'قريبًا',
    autoGenerate: 'توليد تلقائي',
    bestPractices: 'أفضل الممارسات',
    characterCount: '{{current}}/{{minLength}}-{{maxLength}} أحرف، ',
    charactersLeftOver: '{{characters}} متبقية',
    charactersToGo: '{{characters}} للمضي قدمًا',
    charactersTooMany: '{{characters}} أكثر من اللازم',
    checksPassing: '{{current}}/{{max}} التحقق تم بنجاح',
    good: 'جيد',
    imageAutoGenerationTip: 'سيقوم التوليد التلقائي باسترجاع الصورة الرئيسية المحددة.',
    lengthTipDescription:
      'يجب أن يتراوح هذا بين {{minLength}} و{{maxLength}} حرفًا. للحصول على مساعدة في كتابة أوصاف ميتا ذات جودة، راجع ',
    lengthTipTitle:
      'يجب أن يتراوح هذا بين {{minLength}} و{{maxLength}} حرفًا. للحصول على مساعدة في كتابة عناوين ميتا ذات جودة، راجع ',
    missing: 'مفقود',
    noImage: 'لا توجد صورة',
    preview: 'معاينة',
    previewDescription: 'قد تختلف النتائج الدقيقة بناءً على المحتوى وملاءمة البحث.',
    tooLong: 'طويل جدًا',
    tooShort: 'قصير جدًا',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: az.ts]---
Location: payload-main/packages/plugin-seo/src/translations/az.ts

```typescript
import type { GenericTranslationsObject } from '@payloadcms/translations'

export const az: GenericTranslationsObject = {
  $schema: './translation-schema.json',
  'plugin-seo': {
    almostThere: 'Demək olar ki, çatdıq',
    autoGenerate: 'Avtomatik yaradılacaq',
    bestPractices: 'ən yaxşı təcrübələr',
    characterCount: '{{current}}/{{minLength}}-{{maxLength}} simvol, ',
    charactersLeftOver: '{{characters}} qalan',
    charactersToGo: '{{characters}} qalan',
    charactersTooMany: '{{characters}} çox',
    checksPassing: '{{current}}/{{max}} yoxlamalar uğurla keçdi',
    good: 'Yaxşı',
    imageAutoGenerationTip: 'Avtomatik yaradılma seçilən başlıq şəkilini əldə edəcək.',
    lengthTipDescription:
      'Bu, {{minLength}} ilə {{maxLength}} simvol arasında olmalıdır. Keyfiyyətli meta təsvirləri yazmaq üçün kömək üçün baxın ',
    lengthTipTitle:
      'Bu, {{minLength}} ilə {{maxLength}} simvol arasında olmalıdır. Keyfiyyətli meta başlıqları yazmaq üçün kömək üçün baxın ',
    missing: 'Yoxdur',
    noImage: 'Şəkil yoxdur',
    preview: 'Önizləmə',
    previewDescription: 'Dəqiq nəticələr, məzmun və axtarış uyğunluğuna görə dəyişə bilər.',
    tooLong: 'Çox uzun',
    tooShort: 'Çox qısa',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: bg.ts]---
Location: payload-main/packages/plugin-seo/src/translations/bg.ts

```typescript
import type { GenericTranslationsObject } from '@payloadcms/translations'

export const bg: GenericTranslationsObject = {
  $schema: './translation-schema.json',
  'plugin-seo': {
    almostThere: 'Почти стигнахме',
    autoGenerate: 'Автоматично генериране',
    bestPractices: 'най-добри практики',
    characterCount: '{{current}}/{{minLength}}-{{maxLength}} знака, ',
    charactersLeftOver: '{{characters}} оставащи',
    charactersToGo: '{{characters}} за въвеждане',
    charactersTooMany: '{{characters}} твърде много',
    checksPassing: '{{current}}/{{max}} проверки преминали успешно',
    good: 'Добре',
    imageAutoGenerationTip: 'Автоматичното генериране ще извлече избраното основно изображение.',
    lengthTipDescription:
      'Това трябва да бъде между {{minLength}} и {{maxLength}} знака. За помощ при писането на качествени мета описания, вижте ',
    lengthTipTitle:
      'Това трябва да бъде между {{minLength}} и {{maxLength}} знака. За помощ при писането на качествени мета заглавия, вижте ',
    missing: 'Липсва',
    noImage: 'Няма изображение',
    preview: 'Предварителен преглед',
    previewDescription:
      'Точните резултати може да варират в зависимост от съдържанието и релевантността на търсенето.',
    tooLong: 'Твърде дълго',
    tooShort: 'Твърде късо',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: ca.ts]---
Location: payload-main/packages/plugin-seo/src/translations/ca.ts

```typescript
import type { GenericTranslationsObject } from '@payloadcms/translations'

export const ca: GenericTranslationsObject = {
  $schema: './translation-schema.json',
  'plugin-seo': {
    almostThere: 'Quasi hi som',
    autoGenerate: 'Generar automàticament',
    bestPractices: 'bones pràctiques',
    characterCount: '{{current}}/{{minLength}}-{{maxLength}} caràcters, ',
    charactersLeftOver: '{{characters}} restants',
    charactersToGo: '{{characters}} per escriure',
    charactersTooMany: '{{characters}} massa',
    checksPassing: '{{current}}/{{max}} comprovacions aprovades',
    good: 'Bé',
    imageAutoGenerationTip: 'La generació automàtica recuperarà la imatge destacada seleccionada.',
    lengthTipDescription:
      'Això hauria de ser entre {{minLength}} i {{maxLength}} caràcters. Per obtenir ajuda per escriure descripcions meta de qualitat, consulta ',
    lengthTipTitle:
      'Això hauria de ser entre {{minLength}} i {{maxLength}} caràcters. Per obtenir ajuda per escriure títols meta de qualitat, consulta ',
    missing: 'Falta',
    noImage: 'Sense imatge',
    preview: 'Previsualització',
    previewDescription:
      'Els resultats exactes poden variar segons el contingut i la rellevància de la cerca.',
    tooLong: 'Massa llarg',
    tooShort: 'Massa curt',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: cs.ts]---
Location: payload-main/packages/plugin-seo/src/translations/cs.ts

```typescript
import type { GenericTranslationsObject } from '@payloadcms/translations'

export const cs: GenericTranslationsObject = {
  $schema: './translation-schema.json',
  'plugin-seo': {
    almostThere: 'Skoro hotovo',
    autoGenerate: 'Generovat automaticky',
    bestPractices: 'osvědčené postupy',
    characterCount: '{{current}}/{{minLength}}-{{maxLength}} znaků, ',
    charactersLeftOver: '{{characters}} zbývá',
    charactersToGo: '{{characters}} zbývá',
    charactersTooMany: '{{characters}} navíc',
    checksPassing: '{{current}}/{{max}} kontrol úspěšně splněno',
    good: 'Dobré',
    imageAutoGenerationTip: 'Automatická generace načte vybraný hero obrázek.',
    lengthTipDescription:
      'Toto by mělo mít mezi {{minLength}} a {{maxLength}} znaky. Pomoc při psaní kvalitních meta popisů navštivte ',
    lengthTipTitle:
      'Toto by mělo mít mezi {{minLength}} a {{maxLength}} znaky. Pomoc při psaní kvalitních meta titulů navštivte ',
    missing: 'Chybí',
    noImage: 'Bez obrázku',
    preview: 'Náhled',
    previewDescription:
      'Přesný výsledek se může lišit v závislosti na obsahu a relevanci vyhledávání.',
    tooLong: 'Příliš dlouhé',
    tooShort: 'Příliš krátké',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: da.ts]---
Location: payload-main/packages/plugin-seo/src/translations/da.ts

```typescript
import type { GenericTranslationsObject } from '@payloadcms/translations'

export const da: GenericTranslationsObject = {
  $schema: './translation-schema.json',
  'plugin-seo': {
    almostThere: 'Næsten der',
    autoGenerate: 'Automatisk generering',
    bestPractices: 'bedste praksis',
    characterCount: '{{current}}/{{minLength}}-{{maxLength}} tegn, ',
    charactersLeftOver: '{{characters}} tilbage',
    charactersToGo: '{{characters}} tilbage at skrive',
    charactersTooMany: '{{characters}} for mange',
    checksPassing: '{{current}}/{{max}} kontroller er bestået',
    good: 'God',
    imageAutoGenerationTip: 'Automatisk generering vil hente det valgte hero-billede.',
    lengthTipDescription:
      'Dette bør være mellem {{minLength}} og {{maxLength}} tegn. For hjælp til at skrive kvalitetsmeta-beskrivelser, se ',
    lengthTipTitle:
      'Dette bør være mellem {{minLength}} og {{maxLength}} tegn. For hjælp til at skrive kvalitetsmeta-titler, se ',
    missing: 'Manglende',
    noImage: 'Ingen billede',
    preview: 'Forhåndsvisning',
    previewDescription: 'De præcise resultater kan variere afhængigt af indhold og søge relevans.',
    tooLong: 'For lang',
    tooShort: 'For kort',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: de.ts]---
Location: payload-main/packages/plugin-seo/src/translations/de.ts

```typescript
import type { GenericTranslationsObject } from '@payloadcms/translations'

export const de: GenericTranslationsObject = {
  $schema: './translation-schema.json',
  'plugin-seo': {
    almostThere: 'Fast da',
    autoGenerate: 'Automatisch generieren',
    bestPractices: 'Best Practices',
    characterCount: '{{current}}/{{minLength}}-{{maxLength}} Zeichen, ',
    charactersLeftOver: '{{characters}} verbleiben',
    charactersToGo: '{{characters}} übrig',
    charactersTooMany: '{{characters}} zu viel',
    checksPassing: '{{current}}/{{max}} Kontrollen erfolgreich',
    good: 'Gut',
    imageAutoGenerationTip: 'Die automatische Generierung ruft das ausgewählte Hauptbild ab.',
    lengthTipDescription:
      'Diese sollte zwischen {{minLength}} und {{maxLength}} Zeichen lang sein. Für Hilfe beim Schreiben von qualitativ hochwertigen Meta-Beschreibungen siehe ',
    lengthTipTitle:
      'Dieser sollte zwischen {{minLength}} und {{maxLength}} Zeichen lang sein. Für Hilfe beim Schreiben von qualitativ hochwertigen Meta-Titeln siehe ',
    missing: 'Fehlt',
    noImage: 'Kein Bild',
    preview: 'Vorschau',
    previewDescription:
      'Die genauen Ergebnislisten können je nach Inhalt und Suchrelevanz variieren.',
    tooLong: 'Zu lang',
    tooShort: 'Zu kurz',
  },
}
```

--------------------------------------------------------------------------------

````
