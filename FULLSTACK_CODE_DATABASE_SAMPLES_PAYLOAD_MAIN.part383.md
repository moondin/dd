---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 383
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 383 of 695)

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

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/Table/DefaultCell/index.tsx
Signals: React

```typescript
'use client'
import type { DefaultCellComponentProps, UploadFieldClient } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import { fieldAffectsData, fieldIsID } from 'payload/shared'
import React from 'react' // TODO: abstract this out to support all routers

import { useConfig } from '../../../providers/Config/index.js'
import { useTranslation } from '../../../providers/Translation/index.js'
import { formatAdminURL } from '../../../utilities/formatAdminURL.js'
import { getDisplayedFieldValue } from '../../../utilities/getDisplayedFieldValue.js'
import { isValidReactElement } from '../../../utilities/isValidReactElement.js'
import { Link } from '../../Link/index.js'
import { CodeCell } from './fields/Code/index.js'
import { cellComponents } from './fields/index.js'

export const DefaultCell: React.FC<DefaultCellComponentProps> = (props) => {
  const {
    cellData,
    className: classNameFromProps,
    collectionSlug,
    field,
    field: { admin },
    link,
    linkURL,
    onClick: onClickFromProps,
    rowData,
    viewType,
  } = props

  const { i18n } = useTranslation()

  const {
    config: {
      routes: { admin: adminRoute },
      serverURL,
    },
    getEntityConfig,
  } = useConfig()

  const collectionConfig = getEntityConfig({ collectionSlug })

  const classNameFromConfigContext = admin && 'className' in admin ? admin.className : undefined

  const className =
    classNameFromProps ||
    (field.admin && 'className' in field.admin ? field.admin.className : null) ||
    classNameFromConfigContext

  const onClick = onClickFromProps

  let WrapElement: React.ComponentType<any> | string = 'span'

  const wrapElementProps: {
    className?: string
    href?: string
    onClick?: () => void
    prefetch?: false
    type?: 'button'
  } = {
    className,
  }

  if (link) {
    wrapElementProps.prefetch = false
    WrapElement = Link

    // Use custom linkURL if provided, otherwise use default URL generation
    if (linkURL) {
      wrapElementProps.href = linkURL
    } else {
      wrapElementProps.href = collectionConfig?.slug
        ? formatAdminURL({
            adminRoute,
            path: `/collections/${collectionConfig?.slug}${viewType === 'trash' ? '/trash' : ''}/${encodeURIComponent(rowData.id)}`,
            serverURL,
          })
        : ''
    }
  }

  if (typeof onClick === 'function') {
    WrapElement = 'button'
    wrapElementProps.type = 'button'
    wrapElementProps.onClick = () => {
      onClick({
        cellData,
        collectionSlug: collectionConfig?.slug,
        rowData,
      })
    }
  }

  if (fieldIsID(field)) {
    return (
      <WrapElement {...wrapElementProps}>
        <CodeCell
          cellData={`ID: ${cellData}`}
          collectionConfig={collectionConfig}
          collectionSlug={collectionSlug}
          field={{
            ...field,
            type: 'code',
          }}
          nowrap
          rowData={rowData}
        />
      </WrapElement>
    )
  }

  const displayedValue = getDisplayedFieldValue(cellData, field, i18n)

  const DefaultCellComponent: React.FC<DefaultCellComponentProps> =
    typeof cellData !== 'undefined' && cellComponents[field.type]

  let CellComponent: React.ReactNode = null

  // Handle JSX labels before using DefaultCellComponent
  if (isValidReactElement(displayedValue)) {
    CellComponent = displayedValue
  } else if (DefaultCellComponent) {
    CellComponent = <DefaultCellComponent cellData={cellData} rowData={rowData} {...props} />
  } else if (!DefaultCellComponent) {
    // DefaultCellComponent does not exist for certain field types like `text`
    if (
      collectionConfig?.upload &&
      fieldAffectsData(field) &&
      field.name === 'filename' &&
      field.type === 'text'
    ) {
      const FileCellComponent = cellComponents.File

      CellComponent = (
        <FileCellComponent
          cellData={cellData}
          rowData={rowData}
          {...(props as DefaultCellComponentProps<UploadFieldClient>)}
          collectionConfig={collectionConfig}
          field={field}
        />
      )
    } else {
      return (
        <WrapElement {...wrapElementProps}>
          {(displayedValue === '' ||
            typeof displayedValue === 'undefined' ||
            displayedValue === null) &&
            i18n.t('general:noLabel', {
              label: getTranslation(('label' in field ? field.label : null) || 'data', i18n),
            })}
          {typeof displayedValue === 'string' && displayedValue}
          {typeof displayedValue === 'number' && displayedValue}
          {typeof displayedValue === 'object' &&
            displayedValue !== null &&
            JSON.stringify(displayedValue)}
        </WrapElement>
      )
    }
  }

  if ((field.type === 'select' || field.type === 'radio') && field.options.length && cellData) {
    const classes = Array.isArray(cellData)
      ? cellData.map((value) => `selected--${value}`).join(' ')
      : `selected--${cellData}`

    const className = [wrapElementProps.className, classes].filter(Boolean).join(' ')

    return (
      <WrapElement {...wrapElementProps} className={className}>
        {CellComponent}
      </WrapElement>
    )
  }

  return <WrapElement {...wrapElementProps}>{CellComponent}</WrapElement>
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/Table/DefaultCell/fields/index.tsx

```typescript
'use client'
import { ArrayCell } from './Array/index.js'
import { BlocksCell } from './Blocks/index.js'
import { CheckboxCell } from './Checkbox/index.js'
import { CodeCell } from './Code/index.js'
import { DateCell } from './Date/index.js'
import { FileCell } from './File/index.js'
import { JSONCell } from './JSON/index.js'
import { RelationshipCell } from './Relationship/index.js'
import { SelectCell } from './Select/index.js'
import { TextareaCell } from './Textarea/index.js'

export const cellComponents = {
  array: ArrayCell,
  blocks: BlocksCell,
  checkbox: CheckboxCell,
  code: CodeCell,
  date: DateCell,
  File: FileCell,
  join: RelationshipCell,
  json: JSONCell,
  radio: SelectCell,
  relationship: RelationshipCell,
  select: SelectCell,
  textarea: TextareaCell,
  upload: RelationshipCell,
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/Table/DefaultCell/fields/Array/index.tsx
Signals: React

```typescript
'use client'
import type { ArrayFieldClient, DefaultCellComponentProps } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import React from 'react'

import { useTranslation } from '../../../../../providers/Translation/index.js'

export interface ArrayCellProps extends DefaultCellComponentProps<ArrayFieldClient> {}

export const ArrayCell: React.FC<ArrayCellProps> = ({ cellData, field: { labels } }) => {
  const { i18n } = useTranslation()

  const arrayFields = cellData ?? []

  const label =
    arrayFields.length === 1
      ? `${arrayFields.length} ${getTranslation(labels?.singular || i18n.t('general:rows'), i18n)}`
      : `${arrayFields.length} ${getTranslation(labels?.plural || i18n.t('general:rows'), i18n)}`

  return <span>{label}</span>
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/Table/DefaultCell/fields/Blocks/index.tsx
Signals: React

```typescript
'use client'
import type { BlocksFieldClient, DefaultCellComponentProps } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import React from 'react'

import { useConfig } from '../../../../../providers/Config/index.js'
import { useTranslation } from '../../../../../providers/Translation/index.js'

export interface BlocksCellProps extends DefaultCellComponentProps<BlocksFieldClient> {}

export const BlocksCell: React.FC<BlocksCellProps> = ({
  cellData,
  field: { blockReferences, blocks, labels },
}) => {
  const { i18n } = useTranslation()
  const { config } = useConfig()

  const selectedBlocks = Array.isArray(cellData) ? cellData.map(({ blockType }) => blockType) : []

  const translatedBlockLabels = (blockReferences ?? blocks)?.map((b) => {
    const block = typeof b === 'string' ? config.blocksMap[b] : b
    return {
      slug: block.slug,
      label: getTranslation(block.labels.singular, i18n),
    }
  })

  let label = `0 ${getTranslation(labels?.plural, i18n)}`

  const formatBlockList = (blocks) =>
    blocks
      .map((b) => {
        const filtered = translatedBlockLabels.filter((f) => f.slug === b)?.[0]
        return filtered?.label
      })
      .join(', ')

  const itemsToShow = 5

  if (selectedBlocks.length > itemsToShow) {
    const more = selectedBlocks.length - itemsToShow
    label = `${selectedBlocks.length} ${getTranslation(labels?.plural, i18n)} - ${i18n.t(
      'fields:itemsAndMore',
      { count: more, items: formatBlockList(selectedBlocks.slice(0, itemsToShow)) },
    )}`
  } else if (selectedBlocks.length > 0) {
    label = `${selectedBlocks.length} ${getTranslation(
      selectedBlocks.length === 1 ? labels?.singular : labels?.plural,
      i18n,
    )} - ${formatBlockList(selectedBlocks)}`
  }

  return <span>{label}</span>
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/Table/DefaultCell/fields/Checkbox/index.scss

```text
@import '../../../../../scss/styles.scss';

@layer payload-default {
  .bool-cell {
    font-size: 1rem;
    line-height: base(1);
    border: 0;
    display: inline-flex;
    vertical-align: middle;
    background: var(--theme-elevation-150);
    color: var(--theme-elevation-800);
    border-radius: $style-radius-s;
    padding: 0 base(0.25);
    [dir='ltr'] & {
      padding-left: base(0.0875 + 0.25);
    }
    [dir='rtl'] & {
      padding-right: base(0.0875 + 0.25);
    }

    background: var(--theme-elevation-100);
    color: var(--theme-elevation-800);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/Table/DefaultCell/fields/Checkbox/index.tsx
Signals: React

```typescript
'use client'
import type { CheckboxFieldClient, DefaultCellComponentProps } from 'payload'

import React from 'react'

import { useTranslation } from '../../../../../providers/Translation/index.js'
import './index.scss'

export const CheckboxCell: React.FC<DefaultCellComponentProps<CheckboxFieldClient>> = ({
  cellData,
}) => {
  const { t } = useTranslation()

  return (
    <code className="bool-cell">
      <span>{t(`general:${cellData}`).toLowerCase()}</span>
    </code>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/Table/DefaultCell/fields/Code/index.scss

```text
@import '../../../../../scss/styles.scss';

@layer payload-default {
  .code-cell {
    font-size: 1rem;
    line-height: base(1);
    border: 0;
    display: inline-flex;
    vertical-align: middle;
    background: var(--theme-elevation-150);
    color: var(--theme-elevation-800);
    border-radius: $style-radius-m;
    padding: 0 base(0.25);
    background: var(--theme-elevation-100);
    color: var(--theme-elevation-800);

    [dir='ltr'] & {
      padding-left: base(0.0875 + 0.25);
    }

    [dir='rtl'] & {
      padding-right: base(0.0875 + 0.25);
    }

    &:hover {
      text-decoration: inherit;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/Table/DefaultCell/fields/Code/index.tsx
Signals: React

```typescript
'use client'
import type { ClientCollectionConfig, CodeFieldClient, DefaultCellComponentProps } from 'payload'

import React from 'react'

import './index.scss'

export interface CodeCellProps extends DefaultCellComponentProps<CodeFieldClient> {
  readonly collectionConfig: ClientCollectionConfig
  readonly nowrap?: boolean
}

export const CodeCell: React.FC<CodeCellProps> = ({ cellData, nowrap }) => {
  const textToShow = cellData?.length > 100 ? `${cellData.substring(0, 100)}\u2026` : cellData

  const noWrapStyle: React.CSSProperties = nowrap ? { whiteSpace: 'nowrap' } : {}

  return (
    <code className="code-cell" style={noWrapStyle}>
      <span>{textToShow}</span>
    </code>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/Table/DefaultCell/fields/Date/index.tsx
Signals: React

```typescript
'use client'
import type { DateFieldClient, DefaultCellComponentProps } from 'payload'

import { getObjectDotNotation } from 'payload/shared'
import React from 'react'

import { useConfig } from '../../../../../providers/Config/index.js'
import { useTranslation } from '../../../../../providers/Translation/index.js'
import { formatDate } from '../../../../../utilities/formatDocTitle/formatDateTitle.js'

export const DateCell: React.FC<
  DefaultCellComponentProps<{ accessor?: string } & DateFieldClient>
> = (props) => {
  const {
    cellData,
    field: { name, accessor, admin: { date } = {}, timezone: timezoneFromField },
    rowData,
  } = props

  const {
    config: {
      admin: { dateFormat: dateFormatFromRoot },
    },
  } = useConfig()
  const { i18n } = useTranslation()

  const fieldPath = accessor || name

  const timezoneFieldName = `${fieldPath}_tz`
  const timezone =
    Boolean(timezoneFromField) && rowData
      ? getObjectDotNotation(rowData, timezoneFieldName, undefined)
      : undefined

  const dateFormat = date?.displayFormat || dateFormatFromRoot

  return (
    <span>
      {Boolean(cellData) && formatDate({ date: cellData, i18n, pattern: dateFormat, timezone })}
    </span>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/Table/DefaultCell/fields/File/index.scss

```text
@import '../../../../../scss/styles.scss';

@layer payload-default {
  .file {
    display: flex;
    flex-wrap: nowrap;

    &__thumbnail {
      display: inline-block;
      max-width: calc(var(--base) * 2);
      height: calc(var(--base) * 2);
      border-radius: var(--style-radius-s);
    }

    &__filename {
      align-self: center;
      [dir='ltr'] & {
        margin-left: var(--base);
      }
      [dir='rtl'] & {
        margin-right: var(--base);
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/Table/DefaultCell/fields/File/index.tsx
Signals: React

```typescript
'use client'
import type {
  ClientCollectionConfig,
  DefaultCellComponentProps,
  TextFieldClient,
  UploadFieldClient,
} from 'payload'

import { getBestFitFromSizes, isImage } from 'payload/shared'
import React from 'react'

import './index.scss'
import { Thumbnail } from '../../../../Thumbnail/index.js'

const baseClass = 'file'

export interface FileCellProps
  extends DefaultCellComponentProps<TextFieldClient | UploadFieldClient> {
  readonly collectionConfig: ClientCollectionConfig
}

export const FileCell: React.FC<FileCellProps> = ({
  cellData: filename,
  collectionConfig,
  field,
  rowData,
}) => {
  const fieldPreviewAllowed = 'displayPreview' in field ? field.displayPreview : undefined
  const previewAllowed = fieldPreviewAllowed ?? collectionConfig.upload?.displayPreview ?? true

  if (previewAllowed) {
    const isFileImage = isImage(rowData?.mimeType)
    let fileSrc: string | undefined = isFileImage
      ? rowData?.thumbnailURL || rowData?.url
      : rowData?.thumbnailURL

    if (isFileImage) {
      fileSrc = getBestFitFromSizes({
        sizes: rowData?.sizes,
        thumbnailURL: rowData?.thumbnailURL,
        url: rowData?.url,
        width: rowData?.width,
      })
    }

    return (
      <div className={baseClass}>
        <Thumbnail
          className={`${baseClass}__thumbnail`}
          collectionSlug={collectionConfig?.slug}
          doc={{
            ...rowData,
            filename,
          }}
          fileSrc={fileSrc}
          size="small"
          uploadConfig={collectionConfig?.upload}
        />
        <span className={`${baseClass}__filename`}>{String(filename)}</span>
      </div>
    )
  } else {
    return <>{String(filename)}</>
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/Table/DefaultCell/fields/JSON/index.scss

```text
@import '../../../../../scss/styles.scss';

@layer payload-default {
  .json-cell {
    font-size: 1rem;
    line-height: base(1);
    border: 0;
    display: inline-flex;
    vertical-align: middle;
    background: var(--theme-elevation-150);
    color: var(--theme-elevation-800);
    border-radius: $style-radius-m;
    padding: 0 base(0.25);
    [dir='ltr'] & {
      padding-left: base(0.0875 + 0.25);
    }
    [dir='rtl'] & {
      padding-right: base(0.0875 + 0.25);
    }

    background: var(--theme-elevation-100);
    color: var(--theme-elevation-800);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/Table/DefaultCell/fields/JSON/index.tsx
Signals: React

```typescript
'use client'
import type { DefaultCellComponentProps, JSONFieldClient } from 'payload'

import React from 'react'

import './index.scss'

export const JSONCell: React.FC<DefaultCellComponentProps<JSONFieldClient>> = ({ cellData }) => {
  const textToShow = cellData?.length > 100 ? `${cellData.substring(0, 100)}\u2026` : cellData

  return (
    <code className="json-cell">
      <span>{JSON.stringify(textToShow)}</span>
    </code>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/Table/DefaultCell/fields/Relationship/index.tsx
Signals: React

```typescript
'use client'
import type {
  DefaultCellComponentProps,
  JoinFieldClient,
  RelationshipFieldClient,
  UploadFieldClient,
} from 'payload'

import { getTranslation } from '@payloadcms/translations'
import React, { useEffect, useMemo, useState } from 'react'

import { useIntersect } from '../../../../../hooks/useIntersect.js'
import { useConfig } from '../../../../../providers/Config/index.js'
import { useTranslation } from '../../../../../providers/Translation/index.js'
import { canUseDOM } from '../../../../../utilities/canUseDOM.js'
import { formatDocTitle } from '../../../../../utilities/formatDocTitle/index.js'
import { useListRelationships } from '../../../RelationshipProvider/index.js'
import { FileCell } from '../File/index.js'
import './index.scss'

type Value = { relationTo: string; value: number | string }
const baseClass = 'relationship-cell'
const totalToShow = 3

export type RelationshipCellProps = DefaultCellComponentProps<
  JoinFieldClient | RelationshipFieldClient | UploadFieldClient
>

export const RelationshipCell: React.FC<RelationshipCellProps> = ({
  cellData: cellDataFromProps,
  customCellProps: customCellContext,
  field,
  field: { label },
}) => {
  // conditionally extract relationTo both both relationship and join fields
  const relationTo =
    ('relationTo' in field && field.relationTo) || ('collection' in field && field.collection)

  // conditionally extract docs from join fields
  const cellData = useMemo(() => {
    return 'collection' in field ? cellDataFromProps?.docs : cellDataFromProps
  }, [cellDataFromProps, field])

  const { config, getEntityConfig } = useConfig()
  const { collections, routes } = config
  const [intersectionRef, entry] = useIntersect()
  const [values, setValues] = useState<Value[]>([])
  const { documents, getRelationships } = useListRelationships()
  const [hasRequested, setHasRequested] = useState(false)
  const { i18n, t } = useTranslation()

  const isAboveViewport = canUseDOM ? entry?.boundingClientRect?.top < window.innerHeight : false

  useEffect(() => {
    if ((cellData || typeof cellData === 'number') && isAboveViewport && !hasRequested) {
      const formattedValues: Value[] = []
      const arrayCellData = Array.isArray(cellData) ? cellData : [cellData]
      arrayCellData
        .slice(0, arrayCellData.length < totalToShow ? arrayCellData.length : totalToShow)
        .forEach((cell) => {
          if (typeof cell === 'object' && 'relationTo' in cell && 'value' in cell) {
            formattedValues.push(cell)
          }
          if (
            (typeof cell === 'number' || typeof cell === 'string') &&
            typeof relationTo === 'string'
          ) {
            formattedValues.push({
              relationTo,
              value: cell,
            })
          }
        })
      getRelationships(formattedValues)
      setHasRequested(true)
      setValues(formattedValues)
    }
  }, [
    cellData,
    relationTo,
    collections,
    isAboveViewport,
    routes.api,
    hasRequested,
    getRelationships,
  ])

  useEffect(() => {
    if (hasRequested) {
      setHasRequested(false)
    }
  }, [cellData])

  return (
    <div className={baseClass} ref={intersectionRef}>
      {values.map(({ relationTo, value }, i) => {
        const document = documents[relationTo][value]
        const relatedCollection = getEntityConfig({
          collectionSlug: relationTo,
        })

        const label = formatDocTitle({
          collectionConfig: relatedCollection,
          data: document || null,
          dateFormat: config.admin.dateFormat,
          fallback: `${t('general:untitled')} - ID: ${value}`,
          i18n,
        })

        let fileField = null

        if (field.type === 'upload') {
          const fieldPreviewAllowed = 'displayPreview' in field ? field.displayPreview : undefined
          const previewAllowed =
            fieldPreviewAllowed ?? relatedCollection.upload?.displayPreview ?? true

          if (previewAllowed && document) {
            fileField = (
              <FileCell
                cellData={label}
                collectionConfig={relatedCollection}
                collectionSlug={relatedCollection.slug}
                customCellProps={customCellContext}
                field={field}
                rowData={document}
              />
            )
          }
        }

        return (
          <React.Fragment key={i}>
            {document === false && `${t('general:untitled')} - ID: ${value}`}
            {document === null && `${t('general:loading')}...`}
            {document ? fileField || label : null}
            {values.length > i + 1 && ', '}
          </React.Fragment>
        )
      })}
      {Array.isArray(cellData) &&
        cellData.length > totalToShow &&
        t('fields:itemsAndMore', { count: cellData.length - totalToShow, items: '' })}
      {values.length === 0 && t('general:noLabel', { label: getTranslation(label || '', i18n) })}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/Table/DefaultCell/fields/Select/index.tsx
Signals: React

```typescript
'use client'
import type { DefaultCellComponentProps, OptionObject, SelectFieldClient } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import { optionsAreObjects } from 'payload/shared'
import React from 'react'

import { useTranslation } from '../../../../../providers/Translation/index.js'

export interface SelectCellProps extends DefaultCellComponentProps<SelectFieldClient> {}

export const SelectCell: React.FC<SelectCellProps> = ({ cellData, field: { options } }) => {
  const { i18n } = useTranslation()

  const findLabel = (items: string[]) =>
    items
      .map((i) => {
        const found = (options as OptionObject[]).filter((f: OptionObject) => f.value === i)?.[0]
          ?.label
        return getTranslation(found, i18n)
      })
      .join(', ')

  let content = ''
  if (optionsAreObjects(options)) {
    content = Array.isArray(cellData)
      ? findLabel(cellData) // hasMany
      : findLabel([cellData])
  } else {
    content = Array.isArray(cellData)
      ? cellData.join(', ') // hasMany
      : cellData
  }

  return <span>{content}</span>
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/Table/DefaultCell/fields/Textarea/index.tsx
Signals: React

```typescript
'use client'
import type { DefaultCellComponentProps, TextareaFieldClient } from 'payload'

import React from 'react'

export const TextareaCell: React.FC<DefaultCellComponentProps<TextareaFieldClient>> = ({
  cellData,
}) => {
  const textToShow = cellData?.length > 100 ? `${cellData.substring(0, 100)}\u2026` : cellData
  return <span>{textToShow}</span>
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/Table/RelationshipProvider/index.tsx
Signals: React

```typescript
'use client'
import type { SelectType, TypeWithID } from 'payload'

import { appendUploadSelectFields } from 'payload/shared'
import * as qs from 'qs-esm'
import React, { createContext, use, useCallback, useEffect, useReducer, useRef } from 'react'

import { useDebounce } from '../../../hooks/useDebounce.js'
import { useConfig } from '../../../providers/Config/index.js'
import { useLocale } from '../../../providers/Locale/index.js'
import { useTranslation } from '../../../providers/Translation/index.js'
import { reducer } from './reducer.js'

// documents are first set to null when requested
// set to false when no doc is returned
// or set to the document returned
export type Documents = {
  [slug: string]: {
    [id: number | string]: false | null | TypeWithID
  }
}

type ListRelationshipContext = {
  documents: Documents
  getRelationships: (
    docs: {
      relationTo: string
      value: number | string
    }[],
  ) => void
}

const Context = createContext({} as ListRelationshipContext)

export const RelationshipProvider: React.FC<{ readonly children?: React.ReactNode }> = ({
  children,
}) => {
  const [documents, dispatchDocuments] = useReducer(reducer, {})
  const debouncedDocuments = useDebounce(documents, 100)

  const {
    config: {
      collections,
      routes: { api },
      serverURL,
    },
  } = useConfig()

  const { i18n } = useTranslation()
  const { code: locale } = useLocale()
  const prevLocale = useRef(locale)

  const loadRelationshipDocs = useCallback(
    (reloadAll = false) => {
      Object.entries(debouncedDocuments).forEach(async ([slug, docs]) => {
        const idsToLoad: (number | string)[] = []

        Object.entries(docs).forEach(([id, value]) => {
          if (value === null || reloadAll) {
            idsToLoad.push(id)
          }
        })

        if (idsToLoad.length > 0) {
          const url = `${serverURL}${api}/${slug}`

          const params = new URLSearchParams()
          const select: SelectType = {}

          params.append('depth', '0')
          params.append('limit', '250')

          const collection = collections.find((c) => c.slug === slug)
          if (collection.admin.enableListViewSelectAPI) {
            const fieldToSelect = collection.admin.useAsTitle ?? 'id'
            select[fieldToSelect] = true

            if (collection.upload) {
              appendUploadSelectFields({ collectionConfig: collection, select })
            }
          }

          if (locale) {
            params.append('locale', locale)
          }

          const idsToString = idsToLoad.map((id) => String(id))
          params.append('where[id][in]', idsToString.join(','))

          const query = `?${params.toString()}&${qs.stringify({ select })}`

          const result = await fetch(`${url}${query}`, {
            credentials: 'include',
            headers: {
              'Accept-Language': i18n.language,
            },
          })

          if (result.ok) {
            const json = await result.json()
            if (json.docs) {
              dispatchDocuments({
                type: 'ADD_LOADED',
                docs: json.docs,
                idsToLoad,
                relationTo: slug,
              })
            }
          } else {
            dispatchDocuments({ type: 'ADD_LOADED', docs: [], idsToLoad, relationTo: slug })
          }
        }
      })
    },
    [debouncedDocuments, serverURL, api, i18n, locale, collections],
  )

  useEffect(() => {
    void loadRelationshipDocs(locale && prevLocale.current !== locale)
    prevLocale.current = locale
  }, [locale, loadRelationshipDocs])

  const getRelationships = useCallback(
    (relationships: { relationTo: string; value: number | string }[]) => {
      dispatchDocuments({ type: 'REQUEST', docs: relationships })
    },
    [],
  )

  return <Context value={{ documents, getRelationships }}>{children}</Context>
}

export const useListRelationships = (): ListRelationshipContext => use(Context)
```

--------------------------------------------------------------------------------

---[FILE: reducer.ts]---
Location: payload-main/packages/ui/src/elements/Table/RelationshipProvider/reducer.ts

```typescript
import type { TypeWithID } from 'payload'

import type { Documents } from './index.js'

type RequestDocuments = {
  docs: { relationTo: string; value: number | string }[]
  type: 'REQUEST'
}

type AddLoadedDocuments = {
  docs: TypeWithID[]
  idsToLoad: (number | string)[]
  relationTo: string
  type: 'ADD_LOADED'
}

type Action = AddLoadedDocuments | RequestDocuments

export function reducer(state: Documents, action: Action): Documents {
  switch (action.type) {
    case 'ADD_LOADED': {
      const newState = { ...state }
      if (typeof newState[action.relationTo] !== 'object') {
        newState[action.relationTo] = {}
      }
      const unreturnedIDs = [...action.idsToLoad]

      if (Array.isArray(action.docs)) {
        action.docs.forEach((doc) => {
          unreturnedIDs.splice(unreturnedIDs.indexOf(doc.id), 1)
          newState[action.relationTo][doc.id] = doc
        })
      }

      unreturnedIDs.forEach((id) => {
        newState[action.relationTo][id] = false
      })

      return newState
    }

    case 'REQUEST': {
      const newState = { ...state }

      action.docs.forEach(({ relationTo, value }) => {
        if (typeof newState[relationTo] !== 'object') {
          newState[relationTo] = {}
        }
        newState[relationTo][value] = null
      })

      return newState
    }

    default: {
      return state
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: createThumbnail.ts]---
Location: payload-main/packages/ui/src/elements/Thumbnail/createThumbnail.ts

```typescript
/**
 * Create a thumbnail from a File object by drawing it onto an OffscreenCanvas
 */
export const createThumbnail = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = URL.createObjectURL(file) // Use Object URL directly

    img.onload = () => {
      const maxDimension = 280
      let drawHeight: number, drawWidth: number

      // Calculate aspect ratio
      const aspectRatio = img.width / img.height

      // Determine dimensions to fit within maxDimension while maintaining aspect ratio
      if (aspectRatio > 1) {
        // Image is wider than tall
        drawWidth = maxDimension
        drawHeight = maxDimension / aspectRatio
      } else {
        // Image is taller than wide, or square
        drawWidth = maxDimension * aspectRatio
        drawHeight = maxDimension
      }

      const canvas = new OffscreenCanvas(drawWidth, drawHeight) // Create an OffscreenCanvas
      const ctx = canvas.getContext('2d')

      // Determine output format based on input file type
      const outputFormat = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
      const quality = file.type === 'image/png' ? undefined : 0.8 // PNG doesn't use quality, use higher quality for JPEG

      // Draw the image onto the OffscreenCanvas with calculated dimensions
      ctx.drawImage(img, 0, 0, drawWidth, drawHeight)

      // Convert the OffscreenCanvas to a Blob and free up memory
      canvas
        .convertToBlob({ type: outputFormat, ...(quality && { quality }) })
        .then((blob) => {
          URL.revokeObjectURL(img.src) // Release the Object URL
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string) // Resolve as data URL
          reader.onerror = reject
          reader.readAsDataURL(blob)
        })
        .catch(reject)
    }

    img.onerror = (error) => {
      URL.revokeObjectURL(img.src) // Release Object URL on error
      // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
      reject(error)
    }
  })
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/Thumbnail/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .thumbnail {
    &:not(.thumbnail--size-none) {
      min-height: 100%;
      flex-shrink: 0;
      align-self: stretch;
      overflow: hidden;

      img,
      svg {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    &--size-expand {
      max-height: 100%;
      width: 100%;
      padding-top: 100%;
      position: relative;

      img,
      svg {
        position: absolute;
        top: 0;
      }
    }

    &--size-large {
      max-height: base(9);
      width: base(9);
    }

    &--size-medium {
      max-height: base(7);
      width: base(7);
    }

    &--size-small {
      max-height: base(5);
      width: base(5);
    }

    @include large-break {
      .thumbnail {
        width: base(5);
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/Thumbnail/index.tsx
Signals: React

```typescript
'use client'
import React from 'react'

import './index.scss'

const baseClass = 'thumbnail'

import type { SanitizedCollectionConfig } from 'payload'

import { File } from '../../graphics/File/index.js'
import { ShimmerEffect } from '../ShimmerEffect/index.js'

export type ThumbnailProps = {
  className?: string
  collectionSlug?: string
  doc?: Record<string, unknown>
  fileSrc?: string
  height?: number
  imageCacheTag?: string
  size?: 'expand' | 'large' | 'medium' | 'none' | 'small'
  uploadConfig?: SanitizedCollectionConfig['upload']
  width?: number
}

export const Thumbnail: React.FC<ThumbnailProps> = (props) => {
  const {
    className = '',
    doc: { filename } = {},
    fileSrc,
    height,
    imageCacheTag,
    size,
    width,
  } = props
  const [fileExists, setFileExists] = React.useState(undefined)

  const classNames = [baseClass, `${baseClass}--size-${size || 'medium'}`, className].join(' ')

  React.useEffect(() => {
    if (!fileSrc) {
      setFileExists(false)
      return
    }
    setFileExists(undefined)

    const img = new Image()
    img.src = fileSrc
    img.onload = () => {
      setFileExists(true)
    }
    img.onerror = () => {
      setFileExists(false)
    }
  }, [fileSrc])

  let src: null | string = null

  /**
   * If an imageCacheTag is provided, append it to the fileSrc
   * Check if the fileSrc already has a query string, if it does, append the imageCacheTag with an ampersand
   */
  if (fileSrc) {
    const queryChar = fileSrc?.includes('?') ? '&' : '?'
    src = imageCacheTag ? `${fileSrc}${queryChar}${encodeURIComponent(imageCacheTag)}` : fileSrc
  }

  return (
    <div className={classNames}>
      {fileExists === undefined && <ShimmerEffect height="100%" />}
      {fileExists && <img alt={filename as string} height={height} src={src} width={width} />}
      {fileExists === false && <File />}
    </div>
  )
}

type ThumbnailComponentProps = {
  readonly alt?: string
  readonly className?: string
  readonly filename: string
  readonly fileSrc: string
  readonly imageCacheTag?: string
  readonly size?: 'expand' | 'large' | 'medium' | 'none' | 'small'
}
export function ThumbnailComponent(props: ThumbnailComponentProps) {
  const { alt, className = '', filename, fileSrc, imageCacheTag, size } = props
  const [fileExists, setFileExists] = React.useState(undefined)

  const classNames = [baseClass, `${baseClass}--size-${size || 'medium'}`, className].join(' ')

  React.useEffect(() => {
    if (!fileSrc) {
      setFileExists(false)
      return
    }
    setFileExists(undefined)

    const img = new Image()
    img.src = fileSrc
    img.onload = () => {
      setFileExists(true)
    }
    img.onerror = () => {
      setFileExists(false)
    }
  }, [fileSrc])

  let src: string = ''

  /**
   * If an imageCacheTag is provided, append it to the fileSrc
   * Check if the fileSrc already has a query string, if it does, append the imageCacheTag with an ampersand
   */
  if (fileSrc) {
    const queryChar = fileSrc?.includes('?') ? '&' : '?'
    src = imageCacheTag ? `${fileSrc}${queryChar}${encodeURIComponent(imageCacheTag)}` : fileSrc
  }

  return (
    <div className={classNames}>
      {fileExists === undefined && <ShimmerEffect height="100%" />}
      {fileExists && <img alt={alt || filename} src={src} />}
      {fileExists === false && <File />}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/ThumbnailCard/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .thumbnail-card {
    @include btn-reset;
    @include shadow-m;
    width: 100%;
    background: var(--theme-input-bg);
    border: 1px solid var(--theme-border-color);
    border-radius: var(--style-radius-m);
    transition: border 100ms cubic-bezier(0, 0.2, 0.2, 1);
    padding: base(0.5);

    &__label {
      padding: base(0.75) base(0.5) base(0.25) base(0.5);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-weight: 600;
    }

    &--has-on-click {
      cursor: pointer;

      &:hover,
      &:focus,
      &:active {
        border: 1px solid var(--theme-elevation-350);
      }
    }

    &--align-label-center {
      text-align: center;
    }

    &__thumbnail {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
```

--------------------------------------------------------------------------------

````
