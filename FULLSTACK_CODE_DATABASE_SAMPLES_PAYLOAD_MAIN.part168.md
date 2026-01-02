---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 168
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 168 of 695)

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

---[FILE: generateLabelFromValue.ts]---
Location: payload-main/packages/next/src/views/Version/RenderFieldsToDiff/fields/Relationship/generateLabelFromValue.ts

```typescript
import type { PayloadRequest, RelationshipField, TypeWithID } from 'payload'

import {
  fieldAffectsData,
  fieldIsPresentationalOnly,
  fieldShouldBeLocalized,
  flattenTopLevelFields,
} from 'payload/shared'

import type { RelationshipValue } from './index.js'

export const generateLabelFromValue = ({
  field,
  locale,
  parentIsLocalized,
  req,
  value,
}: {
  field: RelationshipField
  locale: string
  parentIsLocalized: boolean
  req: PayloadRequest
  value: RelationshipValue
}): string => {
  let relatedDoc: number | string | TypeWithID
  let relationTo: string = field.relationTo as string
  let valueToReturn: string = ''

  if (typeof value === 'object' && 'relationTo' in value) {
    relatedDoc = value.value
    relationTo = value.relationTo
  } else {
    // Non-polymorphic relationship or deleted document
    relatedDoc = value
  }

  const relatedCollection = req.payload.collections[relationTo].config

  const useAsTitle = relatedCollection?.admin?.useAsTitle

  const flattenedRelatedCollectionFields = flattenTopLevelFields(relatedCollection.fields, {
    moveSubFieldsToTop: true,
  })

  const useAsTitleField = flattenedRelatedCollectionFields.find(
    (f) => fieldAffectsData(f) && !fieldIsPresentationalOnly(f) && f.name === useAsTitle,
  )
  let titleFieldIsLocalized = false

  if (useAsTitleField && fieldAffectsData(useAsTitleField)) {
    titleFieldIsLocalized = fieldShouldBeLocalized({ field: useAsTitleField, parentIsLocalized })
  }

  if (typeof relatedDoc?.[useAsTitle] !== 'undefined') {
    valueToReturn = relatedDoc[useAsTitle]
  } else {
    valueToReturn = String(
      typeof relatedDoc === 'object'
        ? relatedDoc.id
        : `${req.i18n.t('general:untitled')} - ID: ${relatedDoc}`,
    )
  }

  if (
    typeof valueToReturn === 'object' &&
    valueToReturn &&
    titleFieldIsLocalized &&
    valueToReturn?.[locale]
  ) {
    valueToReturn = valueToReturn[locale]
  }

  if (
    (valueToReturn && typeof valueToReturn === 'object' && valueToReturn !== null) ||
    typeof valueToReturn !== 'string'
  ) {
    valueToReturn = JSON.stringify(valueToReturn)
  }

  return valueToReturn
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/next/src/views/Version/RenderFieldsToDiff/fields/Relationship/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .relationship-diff-container .field-diff-content {
    padding: 0;
    background: unset;
  }

  .relationship-diff-container--hasOne {
    .relationship-diff {
      min-width: 100%;
      max-width: fit-content;
    }
  }

  .relationship-diff-container--hasMany .field-diff-content {
    background: var(--theme-elevation-50);
    padding: 10px;

    .html-diff {
      display: flex;
      min-width: 0;
      max-width: max-content;
      flex-wrap: wrap;
      gap: calc(var(--base) * 0.5);
    }

    .relationship-diff {
      padding: calc(var(--base) * 0.15) calc(var(--base) * 0.3);
    }
  }

  .relationship-diff {
    @extend %body;
    display: flex;
    align-items: center;
    border-radius: $style-radius-s;
    border: 1px solid var(--theme-elevation-150);
    position: relative;
    font-family: var(--font-body);
    max-height: calc(var(--base) * 3);
    padding: calc(var(--base) * 0.35);

    &[data-match-type='create'] {
      border-color: var(--diff-create-pill-border);
      color: var(--diff-create-parent-color);

      * {
        color: var(--diff-create-parent-color);
      }
    }

    &[data-match-type='delete'] {
      border-color: var(--diff-delete-pill-border);
      color: var(--diff-delete-parent-color);
      background-color: var(--diff-delete-pill-bg);
      text-decoration-line: none !important;

      * {
        color: var(--diff-delete-parent-color);
        text-decoration-line: none;
      }

      .relationship-diff__info {
        text-decoration-line: line-through;
      }
    }

    &__info {
      font-weight: 500;
    }

    &__pill {
      border-radius: $style-radius-s;
      margin: 0 calc(var(--base) * 0.4) 0 calc(var(--base) * 0.2);
      padding: 0 calc(var(--base) * 0.1);
      background-color: var(--theme-elevation-150);
      color: var(--theme-elevation-750);
    }

    &[data-match-type='create'] .relationship-diff__pill {
      background-color: var(--diff-create-parent-bg);
      color: var(--diff-create-pill-color);
    }

    &[data-match-type='delete'] .relationship-diff__pill {
      background-color: var(--diff-delete-parent-bg);
      color: var(--diff-delete-pill-color);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/views/Version/RenderFieldsToDiff/fields/Relationship/index.tsx
Signals: React

```typescript
import type {
  PayloadRequest,
  RelationshipField,
  RelationshipFieldDiffServerComponent,
  TypeWithID,
} from 'payload'

import { getTranslation, type I18nClient } from '@payloadcms/translations'
import { FieldDiffContainer, getHTMLDiffComponents } from '@payloadcms/ui/rsc'

import './index.scss'

import React from 'react'

import { generateLabelFromValue } from './generateLabelFromValue.js'

const baseClass = 'relationship-diff'

export type RelationshipValue =
  | { relationTo: string; value: number | string | TypeWithID }
  | (number | string | TypeWithID)

export const Relationship: RelationshipFieldDiffServerComponent = ({
  comparisonValue: valueFrom,
  field,
  i18n,
  locale,
  nestingLevel,
  parentIsLocalized,
  req,
  versionValue: valueTo,
}) => {
  const hasMany = 'hasMany' in field && field.hasMany
  const polymorphic = Array.isArray(field.relationTo)

  if (hasMany) {
    return (
      <ManyRelationshipDiff
        field={field}
        i18n={i18n}
        locale={locale}
        nestingLevel={nestingLevel}
        parentIsLocalized={parentIsLocalized}
        polymorphic={polymorphic}
        req={req}
        valueFrom={valueFrom as RelationshipValue[] | undefined}
        valueTo={valueTo as RelationshipValue[] | undefined}
      />
    )
  }

  return (
    <SingleRelationshipDiff
      field={field}
      i18n={i18n}
      locale={locale}
      nestingLevel={nestingLevel}
      parentIsLocalized={parentIsLocalized}
      polymorphic={polymorphic}
      req={req}
      valueFrom={valueFrom as RelationshipValue}
      valueTo={valueTo as RelationshipValue}
    />
  )
}

export const SingleRelationshipDiff: React.FC<{
  field: RelationshipField
  i18n: I18nClient
  locale: string
  nestingLevel?: number
  parentIsLocalized: boolean
  polymorphic: boolean
  req: PayloadRequest
  valueFrom: RelationshipValue
  valueTo: RelationshipValue
}> = async (args) => {
  const {
    field,
    i18n,
    locale,
    nestingLevel,
    parentIsLocalized,
    polymorphic,
    req,
    valueFrom,
    valueTo,
  } = args

  const ReactDOMServer = (await import('react-dom/server')).default

  const FromComponent = valueFrom ? (
    <RelationshipDocumentDiff
      field={field}
      i18n={i18n}
      locale={locale}
      parentIsLocalized={parentIsLocalized}
      polymorphic={polymorphic}
      relationTo={
        polymorphic
          ? (valueFrom as { relationTo: string; value: TypeWithID }).relationTo
          : (field.relationTo as string)
      }
      req={req}
      showPill={true}
      value={valueFrom}
    />
  ) : null
  const ToComponent = valueTo ? (
    <RelationshipDocumentDiff
      field={field}
      i18n={i18n}
      locale={locale}
      parentIsLocalized={parentIsLocalized}
      polymorphic={polymorphic}
      relationTo={
        polymorphic
          ? (valueTo as { relationTo: string; value: TypeWithID }).relationTo
          : (field.relationTo as string)
      }
      req={req}
      showPill={true}
      value={valueTo}
    />
  ) : null

  const fromHTML = FromComponent ? ReactDOMServer.renderToStaticMarkup(FromComponent) : `<p></p>`
  const toHTML = ToComponent ? ReactDOMServer.renderToStaticMarkup(ToComponent) : `<p></p>`

  const diff = getHTMLDiffComponents({
    fromHTML,
    toHTML,
    tokenizeByCharacter: false,
  })

  return (
    <FieldDiffContainer
      className={`${baseClass}-container ${baseClass}-container--hasOne`}
      From={diff.From}
      i18n={i18n}
      label={{ label: field.label, locale }}
      nestingLevel={nestingLevel}
      To={diff.To}
    />
  )
}

const ManyRelationshipDiff: React.FC<{
  field: RelationshipField
  i18n: I18nClient
  locale: string
  nestingLevel?: number
  parentIsLocalized: boolean
  polymorphic: boolean
  req: PayloadRequest
  valueFrom: RelationshipValue[] | undefined
  valueTo: RelationshipValue[] | undefined
}> = async ({
  field,
  i18n,
  locale,
  nestingLevel,
  parentIsLocalized,
  polymorphic,
  req,
  valueFrom,
  valueTo,
}) => {
  const ReactDOMServer = (await import('react-dom/server')).default

  const fromArr = Array.isArray(valueFrom) ? valueFrom : []
  const toArr = Array.isArray(valueTo) ? valueTo : []

  const makeNodes = (list: RelationshipValue[]) =>
    list.map((val, idx) => (
      <RelationshipDocumentDiff
        field={field}
        i18n={i18n}
        key={idx}
        locale={locale}
        parentIsLocalized={parentIsLocalized}
        polymorphic={polymorphic}
        relationTo={
          polymorphic
            ? (val as { relationTo: string; value: TypeWithID }).relationTo
            : (field.relationTo as string)
        }
        req={req}
        showPill={polymorphic}
        value={val}
      />
    ))

  const fromNodes =
    fromArr.length > 0 ? makeNodes(fromArr) : <p className={`${baseClass}__empty`}></p>

  const toNodes = toArr.length > 0 ? makeNodes(toArr) : <p className={`${baseClass}__empty`}></p>

  const fromHTML = ReactDOMServer.renderToStaticMarkup(fromNodes)
  const toHTML = ReactDOMServer.renderToStaticMarkup(toNodes)

  const diff = getHTMLDiffComponents({
    fromHTML,
    toHTML,
    tokenizeByCharacter: false,
  })

  return (
    <FieldDiffContainer
      className={`${baseClass}-container ${baseClass}-container--hasMany`}
      From={diff.From}
      i18n={i18n}
      label={{ label: field.label, locale }}
      nestingLevel={nestingLevel}
      To={diff.To}
    />
  )
}

const RelationshipDocumentDiff = ({
  field,
  i18n,
  locale,
  parentIsLocalized,
  polymorphic,
  relationTo,
  req,
  showPill = false,
  value,
}: {
  field: RelationshipField
  i18n: I18nClient
  locale: string
  parentIsLocalized: boolean
  polymorphic: boolean
  relationTo: string
  req: PayloadRequest
  showPill?: boolean
  value: RelationshipValue
}) => {
  const localeToUse =
    locale ??
    (req.payload.config?.localization && req.payload.config?.localization?.defaultLocale) ??
    'en'

  const title = generateLabelFromValue({
    field,
    locale: localeToUse,
    parentIsLocalized,
    req,
    value,
  })

  let pillLabel: null | string = null
  if (showPill) {
    const collectionConfig = req.payload.collections[relationTo].config
    pillLabel = collectionConfig.labels?.singular
      ? getTranslation(collectionConfig.labels.singular, i18n)
      : collectionConfig.slug
  }

  return (
    <div
      className={`${baseClass}`}
      data-enable-match="true"
      data-id={
        polymorphic
          ? (value as { relationTo: string; value: TypeWithID }).value.id
          : (value as TypeWithID).id
      }
      data-relation-to={relationTo}
    >
      {pillLabel && (
        <span className={`${baseClass}__pill`} data-enable-match="false">
          {pillLabel}
        </span>
      )}
      <strong className={`${baseClass}__info`} data-enable-match="false">
        {title}
      </strong>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/views/Version/RenderFieldsToDiff/fields/Row/index.tsx
Signals: React

```typescript
'use client'
import type { RowFieldDiffClientComponent } from 'payload'

import React from 'react'

import { RenderVersionFieldsToDiff } from '../../RenderVersionFieldsToDiff.js'

const baseClass = 'row-diff'

export const Row: RowFieldDiffClientComponent = ({ baseVersionField }) => {
  return (
    <div className={baseClass}>
      <RenderVersionFieldsToDiff versionFields={baseVersionField.fields} />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/next/src/views/Version/RenderFieldsToDiff/fields/Select/index.scss

```text
@layer payload-default {
  .select-diff {
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/views/Version/RenderFieldsToDiff/fields/Select/index.tsx
Signals: React

```typescript
'use client'
import type { I18nClient } from '@payloadcms/translations'
import type { Option, SelectField, SelectFieldDiffClientComponent } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import { FieldDiffContainer, getHTMLDiffComponents, useTranslation } from '@payloadcms/ui'
import React from 'react'

import './index.scss'

const baseClass = 'select-diff'

const getOptionsToRender = (
  value: string,
  options: SelectField['options'],
  hasMany: boolean,
): Option | Option[] => {
  if (hasMany && Array.isArray(value)) {
    return value.map(
      (val) =>
        options.find((option) => (typeof option === 'string' ? option : option.value) === val) ||
        String(val),
    )
  }
  return (
    options.find((option) => (typeof option === 'string' ? option : option.value) === value) ||
    String(value)
  )
}

/**
 * Translates option labels while ensuring they are strings.
 * If `options.label` is a JSX element, it falls back to `options.value` because `DiffViewer`
 * expects all values to be strings.
 */
const getTranslatedOptions = (options: Option | Option[], i18n: I18nClient): string => {
  if (Array.isArray(options)) {
    return options
      .map((option) => {
        if (typeof option === 'string') {
          return option
        }
        const translatedLabel = getTranslation(option.label, i18n)

        // Ensure the result is a string, otherwise use option.value
        return typeof translatedLabel === 'string' ? translatedLabel : option.value
      })
      .join(', ')
  }

  if (typeof options === 'string') {
    return options
  }

  const translatedLabel = getTranslation(options.label, i18n)

  return typeof translatedLabel === 'string' ? translatedLabel : options.value
}

export const Select: SelectFieldDiffClientComponent = ({
  comparisonValue: valueFrom,
  diffMethod,
  field,
  locale,
  nestingLevel,
  versionValue: valueTo,
}) => {
  const { i18n } = useTranslation()

  const options = 'options' in field && field.options

  const renderedValueFrom =
    typeof valueFrom !== 'undefined'
      ? getTranslatedOptions(
          getOptionsToRender(
            typeof valueFrom === 'string' ? valueFrom : JSON.stringify(valueFrom),
            options,
            field.hasMany,
          ),
          i18n,
        )
      : ''

  const renderedValueTo =
    typeof valueTo !== 'undefined'
      ? getTranslatedOptions(
          getOptionsToRender(
            typeof valueTo === 'string' ? valueTo : JSON.stringify(valueTo),
            options,
            field.hasMany,
          ),
          i18n,
        )
      : ''

  const { From, To } = getHTMLDiffComponents({
    fromHTML: '<p>' + renderedValueFrom + '</p>',
    toHTML: '<p>' + renderedValueTo + '</p>',
    tokenizeByCharacter: true,
  })

  return (
    <FieldDiffContainer
      className={baseClass}
      From={From}
      i18n={i18n}
      label={{
        label: field.label,
        locale,
      }}
      nestingLevel={nestingLevel}
      To={To}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/next/src/views/Version/RenderFieldsToDiff/fields/Tabs/index.scss

```text
@layer payload-default {
  .tabs-diff {
    // Space between each tab or tab locale
    &__tab:not(:first-of-type),
    &__tab-locale:not(:first-of-type) {
      margin-top: var(--base);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/views/Version/RenderFieldsToDiff/fields/Tabs/index.tsx
Signals: React

```typescript
'use client'
import type {
  ClientTab,
  FieldDiffClientProps,
  TabsFieldClient,
  TabsFieldDiffClientComponent,
  VersionTab,
} from 'payload'

import { getTranslation } from '@payloadcms/translations'
import { useTranslation } from '@payloadcms/ui'
import React from 'react'

import './index.scss'
import { useSelectedLocales } from '../../../Default/SelectedLocalesContext.js'
import { DiffCollapser } from '../../DiffCollapser/index.js'
import { RenderVersionFieldsToDiff } from '../../RenderVersionFieldsToDiff.js'

const baseClass = 'tabs-diff'

export const Tabs: TabsFieldDiffClientComponent = (props) => {
  const { baseVersionField, comparisonValue: valueFrom, field, versionValue: valueTo } = props
  const { selectedLocales } = useSelectedLocales()

  return (
    <div className={baseClass}>
      {baseVersionField.tabs.map((tab, i) => {
        if (!tab?.fields?.length) {
          return null
        }
        const fieldTab = field.tabs?.[i]
        return (
          <div className={`${baseClass}__tab`} key={i}>
            {(() => {
              if ('name' in fieldTab && selectedLocales && fieldTab.localized) {
                // Named localized tab
                return selectedLocales.map((locale, index) => {
                  const localizedTabProps: TabProps = {
                    ...props,
                    comparisonValue: valueFrom?.[tab.name]?.[locale],
                    fieldTab,
                    locale,
                    tab,
                    versionValue: valueTo?.[tab.name]?.[locale],
                  }
                  return (
                    <div className={`${baseClass}__tab-locale`} key={[locale, index].join('-')}>
                      <div className={`${baseClass}__tab-locale-value`}>
                        <Tab key={locale} {...localizedTabProps} />
                      </div>
                    </div>
                  )
                })
              } else if ('name' in tab && tab.name) {
                // Named tab
                const namedTabProps: TabProps = {
                  ...props,
                  comparisonValue: valueFrom?.[tab.name],
                  fieldTab,
                  tab,
                  versionValue: valueTo?.[tab.name],
                }
                return <Tab key={i} {...namedTabProps} />
              } else {
                // Unnamed tab
                return <Tab fieldTab={fieldTab} key={i} {...props} tab={tab} />
              }
            })()}
          </div>
        )
      })}
    </div>
  )
}

type TabProps = {
  fieldTab: ClientTab
  tab: VersionTab
} & FieldDiffClientProps<TabsFieldClient>

const Tab: React.FC<TabProps> = ({
  comparisonValue: valueFrom,
  fieldTab,
  locale,
  parentIsLocalized,
  tab,
  versionValue: valueTo,
}) => {
  const { i18n } = useTranslation()
  const { selectedLocales } = useSelectedLocales()

  if (!tab.fields?.length) {
    return null
  }

  return (
    <DiffCollapser
      fields={fieldTab.fields}
      Label={
        'label' in tab &&
        tab.label &&
        typeof tab.label !== 'function' && (
          <span>
            {locale && <span className={`${baseClass}__locale-label`}>{locale}</span>}
            {getTranslation(tab.label, i18n)}
          </span>
        )
      }
      locales={selectedLocales}
      parentIsLocalized={parentIsLocalized || fieldTab.localized}
      valueFrom={valueFrom}
      valueTo={valueTo}
    >
      <RenderVersionFieldsToDiff versionFields={tab.fields} />
    </DiffCollapser>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/next/src/views/Version/RenderFieldsToDiff/fields/Text/index.scss

```text
@layer payload-default {
  .text-diff {
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/views/Version/RenderFieldsToDiff/fields/Text/index.tsx
Signals: React

```typescript
'use client'
import type { TextFieldDiffClientComponent } from 'payload'

import { FieldDiffContainer, getHTMLDiffComponents, useTranslation } from '@payloadcms/ui'

import './index.scss'

import React from 'react'

const baseClass = 'text-diff'

function formatValue(value: unknown): {
  tokenizeByCharacter: boolean
  value: string
} {
  if (typeof value === 'string') {
    return { tokenizeByCharacter: true, value }
  }
  if (typeof value === 'number') {
    return {
      tokenizeByCharacter: true,
      value: String(value),
    }
  }
  if (typeof value === 'boolean') {
    return {
      tokenizeByCharacter: false,
      value: String(value),
    }
  }

  if (value && typeof value === 'object') {
    return {
      tokenizeByCharacter: false,
      value: `<pre>${JSON.stringify(value, null, 2)}</pre>`,
    }
  }

  return {
    tokenizeByCharacter: true,
    value: undefined,
  }
}

export const Text: TextFieldDiffClientComponent = ({
  comparisonValue: valueFrom,
  field,
  locale,
  nestingLevel,
  versionValue: valueTo,
}) => {
  const { i18n } = useTranslation()

  let placeholder = ''

  if (valueTo == valueFrom) {
    placeholder = `<span class="html-diff-no-value"><span>`
  }

  const formattedValueFrom = formatValue(valueFrom)
  const formattedValueTo = formatValue(valueTo)

  let tokenizeByCharacter = true
  if (formattedValueFrom.value?.length) {
    tokenizeByCharacter = formattedValueFrom.tokenizeByCharacter
  } else if (formattedValueTo.value?.length) {
    tokenizeByCharacter = formattedValueTo.tokenizeByCharacter
  }

  const renderedValueFrom = formattedValueFrom.value ?? placeholder
  const renderedValueTo: string = formattedValueTo.value ?? placeholder

  const { From, To } = getHTMLDiffComponents({
    fromHTML: '<p>' + renderedValueFrom + '</p>',
    toHTML: '<p>' + renderedValueTo + '</p>',
    tokenizeByCharacter,
  })

  return (
    <FieldDiffContainer
      className={baseClass}
      From={From}
      i18n={i18n}
      label={{
        label: field.label,
        locale,
      }}
      nestingLevel={nestingLevel}
      To={To}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/next/src/views/Version/RenderFieldsToDiff/fields/Upload/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .upload-diff-container .field-diff-content {
    padding: 0;
    background: unset;
  }

  .upload-diff-hasMany {
    display: flex;
    flex-direction: column;
    gap: calc(var(--base) * 0.4);
  }

  .upload-diff {
    @extend %body;
    min-width: 100%;
    max-width: fit-content;
    display: flex;
    align-items: center;
    background-color: var(--theme-elevation-50);
    border-radius: $style-radius-s;
    border: 1px solid var(--theme-elevation-150);
    position: relative;
    font-family: var(--font-body);
    max-height: calc(var(--base) * 3);
    padding: calc(var(--base) * 0.1);

    &[data-match-type='create'] {
      border-color: var(--diff-create-pill-border);
      color: var(--diff-create-parent-color);

      * {
        color: var(--diff-create-parent-color);
      }

      .upload-diff__thumbnail {
        border-radius: 0px;
        border-color: var(--diff-create-pill-border);
        background-color: none;
      }
    }

    &[data-match-type='delete'] {
      border-color: var(--diff-delete-pill-border);
      text-decoration-line: none;
      color: var(--diff-delete-parent-color);
      background-color: var(--diff-delete-pill-bg);

      * {
        text-decoration-line: none;
        color: var(--diff-delete-parent-color);
      }

      .upload-diff__thumbnail {
        border-radius: 0px;
        border-color: var(--diff-delete-pill-border);
        background-color: none;
      }
    }

    &__card {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;
    }

    &__thumbnail {
      width: calc(var(--base) * 3 - base(0.8) * 2);
      height: calc(var(--base) * 3 - base(0.8) * 2);
      position: relative;
      overflow: hidden;
      flex-shrink: 0;
      border-radius: 0px;
      border: 1px solid var(--theme-elevation-100);

      img,
      svg {
        position: absolute;
        object-fit: cover;
        width: 100%;
        height: 100%;
        border-radius: 0px;
      }
    }

    &__info {
      flex-grow: 1;
      display: flex;
      align-items: flex-start;
      flex-direction: column;
      padding: calc(var(--base) * 0.25) calc(var(--base) * 0.6);
      justify-content: space-between;
      font-weight: 400;

      strong {
        font-weight: 500;
      }
    }

    &__pill {
      border-radius: $style-radius-s;
      margin-left: calc(var(--base) * 0.6);
      padding: 0 calc(var(--base) * 0.1);

      background-color: var(--theme-elevation-150);
      color: var(--theme-elevation-750);
    }

    &[data-match-type='create'] .upload-diff__pill {
      background-color: var(--diff-create-parent-bg);
      color: var(--diff-create-pill-color);
    }

    &[data-match-type='delete'] .upload-diff__pill {
      background-color: var(--diff-delete-parent-bg);
      color: var(--diff-delete-pill-color);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/views/Version/RenderFieldsToDiff/fields/Upload/index.tsx
Signals: React

```typescript
import type {
  FileData,
  PayloadRequest,
  TypeWithID,
  UploadField,
  UploadFieldDiffServerComponent,
} from 'payload'

import { getTranslation, type I18nClient } from '@payloadcms/translations'
import { FieldDiffContainer, File, getHTMLDiffComponents } from '@payloadcms/ui/rsc'

import './index.scss'

import React from 'react'

const baseClass = 'upload-diff'

type NonPolyUploadDoc = (FileData & TypeWithID) | number | string
type PolyUploadDoc = { relationTo: string; value: (FileData & TypeWithID) | number | string }

type UploadDoc = NonPolyUploadDoc | PolyUploadDoc

export const Upload: UploadFieldDiffServerComponent = (args) => {
  const {
    comparisonValue: valueFrom,
    field,
    i18n,
    locale,
    nestingLevel,
    req,
    versionValue: valueTo,
  } = args
  const hasMany = 'hasMany' in field && field.hasMany && Array.isArray(valueTo)
  const polymorphic = Array.isArray(field.relationTo)

  if (hasMany) {
    return (
      <HasManyUploadDiff
        field={field}
        i18n={i18n}
        locale={locale}
        nestingLevel={nestingLevel}
        polymorphic={polymorphic}
        req={req}
        valueFrom={valueFrom as UploadDoc[]}
        valueTo={valueTo as UploadDoc[]}
      />
    )
  }

  return (
    <SingleUploadDiff
      field={field}
      i18n={i18n}
      locale={locale}
      nestingLevel={nestingLevel}
      polymorphic={polymorphic}
      req={req}
      valueFrom={valueFrom as UploadDoc}
      valueTo={valueTo as UploadDoc}
    />
  )
}

export const HasManyUploadDiff: React.FC<{
  field: UploadField
  i18n: I18nClient
  locale: string
  nestingLevel?: number
  polymorphic: boolean
  req: PayloadRequest
  valueFrom: Array<UploadDoc>
  valueTo: Array<UploadDoc>
}> = async (args) => {
  const { field, i18n, locale, nestingLevel, polymorphic, req, valueFrom, valueTo } = args
  const ReactDOMServer = (await import('react-dom/server')).default

  let From: React.ReactNode = ''
  let To: React.ReactNode = ''

  const showCollectionSlug = Array.isArray(field.relationTo)

  const getUploadDocKey = (uploadDoc: UploadDoc): number | string => {
    if (typeof uploadDoc === 'object' && 'relationTo' in uploadDoc) {
      // Polymorphic case
      const value = uploadDoc.value
      return typeof value === 'object' ? value.id : value
    }
    // Non-polymorphic case
    return typeof uploadDoc === 'object' ? uploadDoc.id : uploadDoc
  }

  const FromComponents = valueFrom
    ? valueFrom.map((uploadDoc) => (
        <UploadDocumentDiff
          i18n={i18n}
          key={getUploadDocKey(uploadDoc)}
          polymorphic={polymorphic}
          relationTo={field.relationTo}
          req={req}
          showCollectionSlug={showCollectionSlug}
          uploadDoc={uploadDoc}
        />
      ))
    : null
  const ToComponents = valueTo
    ? valueTo.map((uploadDoc) => (
        <UploadDocumentDiff
          i18n={i18n}
          key={getUploadDocKey(uploadDoc)}
          polymorphic={polymorphic}
          relationTo={field.relationTo}
          req={req}
          showCollectionSlug={showCollectionSlug}
          uploadDoc={uploadDoc}
        />
      ))
    : null

  const diffResult = getHTMLDiffComponents({
    fromHTML:
      `<div class="${baseClass}-hasMany">` +
      (FromComponents
        ? FromComponents.map(
            (component) => `<div>${ReactDOMServer.renderToStaticMarkup(component)}</div>`,
          ).join('')
        : '') +
      '</div>',
    toHTML:
      `<div class="${baseClass}-hasMany">` +
      (ToComponents
        ? ToComponents.map(
            (component) => `<div>${ReactDOMServer.renderToStaticMarkup(component)}</div>`,
          ).join('')
        : '') +
      '</div>',
    tokenizeByCharacter: false,
  })
  From = diffResult.From
  To = diffResult.To

  return (
    <FieldDiffContainer
      className={`${baseClass}-container ${baseClass}-container--hasMany`}
      From={From}
      i18n={i18n}
      label={{
        label: field.label,
        locale,
      }}
      nestingLevel={nestingLevel}
      To={To}
    />
  )
}

export const SingleUploadDiff: React.FC<{
  field: UploadField
  i18n: I18nClient
  locale: string
  nestingLevel?: number
  polymorphic: boolean
  req: PayloadRequest
  valueFrom: UploadDoc
  valueTo: UploadDoc
}> = async (args) => {
  const { field, i18n, locale, nestingLevel, polymorphic, req, valueFrom, valueTo } = args

  const ReactDOMServer = (await import('react-dom/server')).default

  let From: React.ReactNode = ''
  let To: React.ReactNode = ''

  const showCollectionSlug = Array.isArray(field.relationTo)

  const FromComponent = valueFrom ? (
    <UploadDocumentDiff
      i18n={i18n}
      polymorphic={polymorphic}
      relationTo={field.relationTo}
      req={req}
      showCollectionSlug={showCollectionSlug}
      uploadDoc={valueFrom}
    />
  ) : null
  const ToComponent = valueTo ? (
    <UploadDocumentDiff
      i18n={i18n}
      polymorphic={polymorphic}
      relationTo={field.relationTo}
      req={req}
      showCollectionSlug={showCollectionSlug}
      uploadDoc={valueTo}
    />
  ) : null

  const fromHtml = FromComponent
    ? ReactDOMServer.renderToStaticMarkup(FromComponent)
    : '<p>' + '' + '</p>'
  const toHtml = ToComponent
    ? ReactDOMServer.renderToStaticMarkup(ToComponent)
    : '<p>' + '' + '</p>'

  const diffResult = getHTMLDiffComponents({
    fromHTML: fromHtml,
    toHTML: toHtml,
    tokenizeByCharacter: false,
  })
  From = diffResult.From
  To = diffResult.To

  return (
    <FieldDiffContainer
      className={`${baseClass}-container ${baseClass}-container--hasOne`}
      From={From}
      i18n={i18n}
      label={{
        label: field.label,
        locale,
      }}
      nestingLevel={nestingLevel}
      To={To}
    />
  )
}

const UploadDocumentDiff = (args: {
  i18n: I18nClient
  polymorphic: boolean
  relationTo: string | string[]
  req: PayloadRequest
  showCollectionSlug?: boolean
  uploadDoc: UploadDoc
}) => {
  const { i18n, polymorphic, relationTo, req, showCollectionSlug, uploadDoc } = args

  let thumbnailSRC: string = ''

  const value = polymorphic
    ? (uploadDoc as { relationTo: string; value: FileData & TypeWithID }).value
    : (uploadDoc as FileData & TypeWithID)

  if (value && typeof value === 'object' && 'thumbnailURL' in value) {
    thumbnailSRC =
      (typeof value.thumbnailURL === 'string' && value.thumbnailURL) ||
      (typeof value.url === 'string' && value.url) ||
      ''
  }

  let filename: string
  if (value && typeof value === 'object') {
    filename = value.filename
  } else {
    filename = `${i18n.t('general:untitled')} - ID: ${uploadDoc as number | string}`
  }

  let pillLabel: null | string = null

  if (showCollectionSlug) {
    let collectionSlug: string
    if (polymorphic && typeof uploadDoc === 'object' && 'relationTo' in uploadDoc) {
      collectionSlug = uploadDoc.relationTo
    } else {
      collectionSlug = typeof relationTo === 'string' ? relationTo : relationTo[0]
    }
    const uploadConfig = req.payload.collections[collectionSlug].config
    pillLabel = uploadConfig.labels?.singular
      ? getTranslation(uploadConfig.labels.singular, i18n)
      : uploadConfig.slug
  }

  let id: number | string | undefined
  if (polymorphic && typeof uploadDoc === 'object' && 'relationTo' in uploadDoc) {
    const polyValue = uploadDoc.value
    id = typeof polyValue === 'object' ? polyValue.id : polyValue
  } else if (typeof uploadDoc === 'object' && 'id' in uploadDoc) {
    id = uploadDoc.id
  } else if (typeof uploadDoc === 'string' || typeof uploadDoc === 'number') {
    id = uploadDoc
  }

  return (
    <div
      className={`${baseClass}`}
      data-enable-match="true"
      data-id={id}
      data-relation-to={relationTo}
    >
      <div className={`${baseClass}__card`}>
        <div className={`${baseClass}__thumbnail`}>
          {thumbnailSRC?.length ? <img alt={filename} src={thumbnailSRC} /> : <File />}
        </div>
        {pillLabel && (
          <div className={`${baseClass}__pill`} data-enable-match="false">
            <span>{pillLabel}</span>
          </div>
        )}
        <div className={`${baseClass}__info`} data-enable-match="false">
          <strong>{filename}</strong>
        </div>
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

````
