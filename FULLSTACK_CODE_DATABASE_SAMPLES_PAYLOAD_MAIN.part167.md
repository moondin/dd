---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 167
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 167 of 695)

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

---[FILE: buildVersionFields.tsx]---
Location: payload-main/packages/next/src/views/Version/RenderFieldsToDiff/buildVersionFields.tsx

```typescript
import type { I18nClient } from '@payloadcms/translations'

import { RenderServerComponent } from '@payloadcms/ui/elements/RenderServerComponent'
import { dequal } from 'dequal/lite'
import {
  type BaseVersionField,
  type ClientField,
  type ClientFieldSchemaMap,
  type Field,
  type FieldDiffClientProps,
  type FieldDiffServerProps,
  type FieldTypes,
  type FlattenedBlock,
  MissingEditorProp,
  type PayloadComponent,
  type PayloadRequest,
  type SanitizedFieldPermissions,
  type SanitizedFieldsPermissions,
  type VersionField,
} from 'payload'
import {
  fieldIsID,
  fieldShouldBeLocalized,
  getFieldPaths,
  getUniqueListBy,
  tabHasName,
} from 'payload/shared'

import { diffComponents } from './fields/index.js'

export type BuildVersionFieldsArgs = {
  clientSchemaMap: ClientFieldSchemaMap
  customDiffComponents: Partial<
    Record<FieldTypes, PayloadComponent<FieldDiffServerProps, FieldDiffClientProps>>
  >
  entitySlug: string
  fields: Field[]
  fieldsPermissions: SanitizedFieldsPermissions
  i18n: I18nClient
  modifiedOnly: boolean
  nestingLevel?: number
  parentIndexPath: string
  parentIsLocalized: boolean
  parentPath: string
  parentSchemaPath: string
  req: PayloadRequest
  selectedLocales: string[]
  versionFromSiblingData: object
  versionToSiblingData: object
}

/**
 * Build up an object that contains rendered diff components for each field.
 * This is then sent to the client to be rendered.
 *
 * Here, the server is responsible for traversing through the document data and building up this
 * version state object.
 */
export const buildVersionFields = ({
  clientSchemaMap,
  customDiffComponents,
  entitySlug,
  fields,
  fieldsPermissions,
  i18n,
  modifiedOnly,
  nestingLevel = 0,
  parentIndexPath,
  parentIsLocalized,
  parentPath,
  parentSchemaPath,
  req,
  selectedLocales,
  versionFromSiblingData,
  versionToSiblingData,
}: BuildVersionFieldsArgs): {
  versionFields: VersionField[]
} => {
  const versionFields: VersionField[] = []
  let fieldIndex = -1

  for (const field of fields) {
    fieldIndex++

    if (fieldIsID(field)) {
      continue
    }

    const { indexPath, path, schemaPath } = getFieldPaths({
      field,
      index: fieldIndex,
      parentIndexPath,
      parentPath,
      parentSchemaPath,
    })

    const clientField = clientSchemaMap.get(entitySlug + '.' + schemaPath)

    if (!clientField) {
      req.payload.logger.error({
        clientFieldKey: entitySlug + '.' + schemaPath,
        clientSchemaMapKeys: Array.from(clientSchemaMap.keys()),
        msg: 'No client field found for ' + entitySlug + '.' + schemaPath,
        parentPath,
        parentSchemaPath,
        path,
        schemaPath,
      })
      throw new Error('No client field found for ' + entitySlug + '.' + schemaPath)
    }

    const versionField: VersionField = {}
    const isLocalized = fieldShouldBeLocalized({ field, parentIsLocalized })

    const fieldName: null | string = 'name' in field ? field.name : null

    const valueFrom = fieldName ? versionFromSiblingData?.[fieldName] : versionFromSiblingData
    const valueTo = fieldName ? versionToSiblingData?.[fieldName] : versionToSiblingData

    if (isLocalized) {
      versionField.fieldByLocale = {}

      for (const locale of selectedLocales) {
        const localizedVersionField = buildVersionField({
          clientField: clientField as ClientField,
          clientSchemaMap,
          customDiffComponents,
          entitySlug,
          field,
          i18n,
          indexPath,
          locale,
          modifiedOnly,
          nestingLevel,
          parentFieldsPermissions: fieldsPermissions,
          parentIsLocalized: true,
          parentPath,
          parentSchemaPath,
          path,
          req,
          schemaPath,
          selectedLocales,
          valueFrom: valueFrom?.[locale],
          valueTo: valueTo?.[locale],
        })
        if (localizedVersionField) {
          versionField.fieldByLocale[locale] = localizedVersionField
        }
      }
    } else {
      const baseVersionField = buildVersionField({
        clientField: clientField as ClientField,
        clientSchemaMap,
        customDiffComponents,
        entitySlug,
        field,
        i18n,
        indexPath,
        modifiedOnly,
        nestingLevel,
        parentFieldsPermissions: fieldsPermissions,
        parentIsLocalized: parentIsLocalized || ('localized' in field && field.localized),
        parentPath,
        parentSchemaPath,
        path,
        req,
        schemaPath,
        selectedLocales,
        valueFrom,
        valueTo,
      })

      if (baseVersionField) {
        versionField.field = baseVersionField
      }
    }

    if (
      versionField.field ||
      (versionField.fieldByLocale && Object.keys(versionField.fieldByLocale).length)
    ) {
      versionFields.push(versionField)
    }
  }

  return {
    versionFields,
  }
}

const buildVersionField = ({
  clientField,
  clientSchemaMap,
  customDiffComponents,
  entitySlug,
  field,
  i18n,
  indexPath,
  locale,
  modifiedOnly,
  nestingLevel,
  parentFieldsPermissions,
  parentIsLocalized,
  parentPath,
  parentSchemaPath,
  path,
  req,
  schemaPath,
  selectedLocales,
  valueFrom,
  valueTo,
}: {
  clientField: ClientField
  field: Field
  indexPath: string
  locale?: string
  modifiedOnly?: boolean
  nestingLevel: number
  parentFieldsPermissions: SanitizedFieldsPermissions
  parentIsLocalized: boolean
  path: string
  schemaPath: string
  valueFrom: unknown
  valueTo: unknown
} & Omit<
  BuildVersionFieldsArgs,
  | 'fields'
  | 'fieldsPermissions'
  | 'parentIndexPath'
  | 'versionFromSiblingData'
  | 'versionToSiblingData'
>): BaseVersionField | null => {
  let hasReadPermission: boolean = false
  let fieldPermissions: SanitizedFieldPermissions | undefined = undefined

  if (typeof parentFieldsPermissions === 'boolean') {
    hasReadPermission = parentFieldsPermissions
    fieldPermissions = parentFieldsPermissions
  } else {
    if ('name' in field) {
      fieldPermissions = parentFieldsPermissions?.[field.name]
      if (typeof fieldPermissions === 'boolean') {
        hasReadPermission = fieldPermissions
      } else if (typeof fieldPermissions?.read === 'boolean') {
        hasReadPermission = fieldPermissions.read
      }
    } else {
      // If the field is unnamed and parentFieldsPermissions is an object, its sub-fields will decide their read permissions state.
      // As far as this field is concerned, we are allowed to read it, as we need to reach its sub-fields to determine their read permissions.
      hasReadPermission = true
    }
  }

  if (!hasReadPermission) {
    // HasReadPermission is only valid if the field has a name. E.g. for a tabs field it would incorrectly return `false`.
    return null
  }

  if (modifiedOnly && dequal(valueFrom, valueTo)) {
    return null
  }

  let CustomComponent = customDiffComponents?.[field.type]
  if (field?.type === 'richText') {
    if (!field?.editor) {
      throw new MissingEditorProp(field) // while we allow disabling editor functionality, you should not have any richText fields defined if you do not have an editor
    }

    if (typeof field?.editor === 'function') {
      throw new Error('Attempted to access unsanitized rich text editor.')
    }

    if (field.editor.CellComponent) {
      CustomComponent = field.editor.DiffComponent
    }
  }
  if (field?.admin?.components?.Diff) {
    CustomComponent = field.admin.components.Diff
  }

  const DefaultComponent = diffComponents?.[field.type]

  const baseVersionField: BaseVersionField = {
    type: field.type,
    fields: [],
    path,
    schemaPath,
  }

  if (field.type === 'tabs' && 'tabs' in field) {
    baseVersionField.tabs = []
    let tabIndex = -1
    for (const tab of field.tabs) {
      tabIndex++
      const isNamedTab = tabHasName(tab)

      const tabAsField = { ...tab, type: 'tab' }

      const {
        indexPath: tabIndexPath,
        path: tabPath,
        schemaPath: tabSchemaPath,
      } = getFieldPaths({
        field: tabAsField,
        index: tabIndex,
        parentIndexPath: indexPath,
        parentPath,
        parentSchemaPath,
      })

      let tabFieldsPermissions: SanitizedFieldsPermissions = undefined

      // The tabs field does not have its own permissions as it's unnamed => use parentFieldsPermissions
      if (typeof parentFieldsPermissions === 'boolean') {
        tabFieldsPermissions = parentFieldsPermissions
      } else {
        if ('name' in tab) {
          const tabPermissions = parentFieldsPermissions?.[tab.name]
          if (typeof tabPermissions === 'boolean') {
            tabFieldsPermissions = tabPermissions
          } else {
            tabFieldsPermissions = tabPermissions?.fields
          }
        } else {
          tabFieldsPermissions = parentFieldsPermissions
        }
      }

      const tabVersion = {
        name: 'name' in tab ? tab.name : null,
        fields: buildVersionFields({
          clientSchemaMap,
          customDiffComponents,
          entitySlug,
          fields: tab.fields,
          fieldsPermissions: tabFieldsPermissions,
          i18n,
          modifiedOnly,
          nestingLevel: nestingLevel + 1,
          parentIndexPath: isNamedTab ? '' : tabIndexPath,
          parentIsLocalized: parentIsLocalized || tab.localized,
          parentPath: isNamedTab ? tabPath : 'name' in field ? path : parentPath,
          parentSchemaPath: isNamedTab
            ? tabSchemaPath
            : 'name' in field
              ? schemaPath
              : parentSchemaPath,
          req,
          selectedLocales,
          versionFromSiblingData: 'name' in tab ? valueFrom?.[tab.name] : valueFrom,
          versionToSiblingData: 'name' in tab ? valueTo?.[tab.name] : valueTo,
        }).versionFields,
        label: typeof tab.label === 'function' ? tab.label({ i18n, t: i18n.t }) : tab.label,
      }
      if (tabVersion?.fields?.length) {
        baseVersionField.tabs.push(tabVersion)
      }
    }

    if (modifiedOnly && !baseVersionField.tabs.length) {
      return null
    }
  } // At this point, we are dealing with a `row`, `collapsible`, array`, etc
  else if ('fields' in field) {
    let subFieldsPermissions: SanitizedFieldsPermissions = undefined

    if ('name' in field && typeof fieldPermissions !== 'undefined') {
      // Named fields like arrays
      subFieldsPermissions =
        typeof fieldPermissions === 'boolean' ? fieldPermissions : fieldPermissions.fields
    } else {
      // Unnamed fields like collapsible and row inherit directly from parent permissions
      subFieldsPermissions = parentFieldsPermissions
    }

    if (field.type === 'array' && (valueTo || valueFrom)) {
      const maxLength = Math.max(
        Array.isArray(valueTo) ? valueTo.length : 0,
        Array.isArray(valueFrom) ? valueFrom.length : 0,
      )
      baseVersionField.rows = []

      for (let i = 0; i < maxLength; i++) {
        const fromRow = (Array.isArray(valueFrom) && valueFrom?.[i]) || {}
        const toRow = (Array.isArray(valueTo) && valueTo?.[i]) || {}

        const versionFields = buildVersionFields({
          clientSchemaMap,
          customDiffComponents,
          entitySlug,
          fields: field.fields,
          fieldsPermissions: subFieldsPermissions,
          i18n,
          modifiedOnly,
          nestingLevel: nestingLevel + 1,
          parentIndexPath: 'name' in field ? '' : indexPath,
          parentIsLocalized: parentIsLocalized || field.localized,
          parentPath: ('name' in field ? path : parentPath) + '.' + i,
          parentSchemaPath: 'name' in field ? schemaPath : parentSchemaPath,
          req,
          selectedLocales,
          versionFromSiblingData: fromRow,
          versionToSiblingData: toRow,
        }).versionFields

        if (versionFields?.length) {
          baseVersionField.rows[i] = versionFields
        }
      }

      if (!baseVersionField.rows?.length && modifiedOnly) {
        return null
      }
    } else {
      baseVersionField.fields = buildVersionFields({
        clientSchemaMap,
        customDiffComponents,
        entitySlug,
        fields: field.fields,
        fieldsPermissions: subFieldsPermissions,
        i18n,
        modifiedOnly,
        nestingLevel: field.type !== 'row' ? nestingLevel + 1 : nestingLevel,
        parentIndexPath: 'name' in field ? '' : indexPath,
        parentIsLocalized: parentIsLocalized || ('localized' in field && field.localized),
        parentPath: 'name' in field ? path : parentPath,
        parentSchemaPath: 'name' in field ? schemaPath : parentSchemaPath,
        req,
        selectedLocales,
        versionFromSiblingData: valueFrom as object,
        versionToSiblingData: valueTo as object,
      }).versionFields

      if (modifiedOnly && !baseVersionField.fields?.length) {
        return null
      }
    }
  } else if (field.type === 'blocks') {
    baseVersionField.rows = []

    const maxLength = Math.max(
      Array.isArray(valueTo) ? valueTo.length : 0,
      Array.isArray(valueFrom) ? valueFrom.length : 0,
    )

    for (let i = 0; i < maxLength; i++) {
      const fromRow = (Array.isArray(valueFrom) && valueFrom?.[i]) || {}
      const toRow = (Array.isArray(valueTo) && valueTo?.[i]) || {}

      const blockSlugToMatch: string = toRow?.blockType ?? fromRow?.blockType
      const toBlock =
        req.payload.blocks[blockSlugToMatch] ??
        ((field.blockReferences ?? field.blocks).find(
          (block) => typeof block !== 'string' && block.slug === blockSlugToMatch,
        ) as FlattenedBlock | undefined)

      let fields = []

      if (toRow.blockType === fromRow.blockType) {
        fields = toBlock.fields
      } else {
        const fromBlockSlugToMatch: string = toRow?.blockType ?? fromRow?.blockType

        const fromBlock =
          req.payload.blocks[fromBlockSlugToMatch] ??
          ((field.blockReferences ?? field.blocks).find(
            (block) => typeof block !== 'string' && block.slug === fromBlockSlugToMatch,
          ) as FlattenedBlock | undefined)

        if (fromBlock) {
          fields = getUniqueListBy<Field>([...toBlock.fields, ...fromBlock.fields], 'name')
        } else {
          fields = toBlock.fields
        }
      }

      let blockFieldsPermissions: SanitizedFieldsPermissions = undefined

      // fieldPermissions will be set here, as the blocks field has a name
      if (typeof fieldPermissions === 'boolean') {
        blockFieldsPermissions = fieldPermissions
      } else if (typeof fieldPermissions?.blocks === 'boolean') {
        blockFieldsPermissions = fieldPermissions.blocks
      } else {
        const permissionsBlockSpecific = fieldPermissions?.blocks?.[blockSlugToMatch]
        if (typeof permissionsBlockSpecific === 'boolean') {
          blockFieldsPermissions = permissionsBlockSpecific
        } else {
          blockFieldsPermissions = permissionsBlockSpecific?.fields
        }
      }

      const versionFields = buildVersionFields({
        clientSchemaMap,
        customDiffComponents,
        entitySlug,
        fields,
        fieldsPermissions: blockFieldsPermissions,
        i18n,
        modifiedOnly,
        nestingLevel: nestingLevel + 1,
        parentIndexPath: 'name' in field ? '' : indexPath,
        parentIsLocalized: parentIsLocalized || ('localized' in field && field.localized),
        parentPath: ('name' in field ? path : parentPath) + '.' + i,
        parentSchemaPath: ('name' in field ? schemaPath : parentSchemaPath) + '.' + toBlock.slug,
        req,
        selectedLocales,
        versionFromSiblingData: fromRow,
        versionToSiblingData: toRow,
      }).versionFields

      if (versionFields?.length) {
        baseVersionField.rows[i] = versionFields
      }
    }

    if (!baseVersionField.rows?.length && modifiedOnly) {
      return null
    }
  }

  const clientDiffProps: FieldDiffClientProps = {
    baseVersionField: {
      ...baseVersionField,
      CustomComponent: undefined,
    },
    /**
     * TODO: Change to valueFrom in 4.0
     */
    comparisonValue: valueFrom,
    /**
     * @deprecated remove in 4.0. Each field should handle its own diffing logic
     */
    diffMethod: 'diffWordsWithSpace',
    field: clientField,
    fieldPermissions:
      typeof fieldPermissions === 'undefined' ? parentFieldsPermissions : fieldPermissions,
    parentIsLocalized,

    nestingLevel: nestingLevel ? nestingLevel : undefined,
    /**
     * TODO: Change to valueTo in 4.0
     */
    versionValue: valueTo,
  }
  if (locale) {
    clientDiffProps.locale = locale
  }

  const serverDiffProps: FieldDiffServerProps = {
    ...clientDiffProps,
    clientField,
    field,
    i18n,
    req,
    selectedLocales,
  }

  baseVersionField.CustomComponent = RenderServerComponent({
    clientProps: clientDiffProps,
    Component: CustomComponent,
    Fallback: DefaultComponent,
    importMap: req.payload.importMap,
    key: 'diff component',
    serverProps: serverDiffProps,
  })

  return baseVersionField
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/next/src/views/Version/RenderFieldsToDiff/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .render-field-diffs {
    display: flex;
    flex-direction: column;
    gap: var(--base);

    [role='banner'] {
      display: none !important;
    }

    &__field {
      overflow-wrap: anywhere;
      display: flex;
      flex-direction: column;
      gap: var(--base);
    }

    @include small-break {
      gap: calc(var(--base) / 2);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/views/Version/RenderFieldsToDiff/index.tsx

```typescript
import { buildVersionFields, type BuildVersionFieldsArgs } from './buildVersionFields.js'
import { RenderVersionFieldsToDiff } from './RenderVersionFieldsToDiff.js'

export const RenderDiff = (args: BuildVersionFieldsArgs): React.ReactNode => {
  const { versionFields } = buildVersionFields(args)

  return <RenderVersionFieldsToDiff parent={true} versionFields={versionFields} />
}
```

--------------------------------------------------------------------------------

---[FILE: RenderVersionFieldsToDiff.tsx]---
Location: payload-main/packages/next/src/views/Version/RenderFieldsToDiff/RenderVersionFieldsToDiff.tsx
Signals: React

```typescript
'use client'
const baseClass = 'render-field-diffs'
import type { VersionField } from 'payload'

import './index.scss'

import { ShimmerEffect } from '@payloadcms/ui'
import React, { Fragment, useEffect } from 'react'

export const RenderVersionFieldsToDiff = ({
  parent = false,
  versionFields,
}: {
  /**
   * If true, this is the parent render version fields component, not one nested in
   * a field with children (e.g. group)
   */
  parent?: boolean
  versionFields: VersionField[]
}): React.ReactNode => {
  const [hasMounted, setHasMounted] = React.useState(false)

  // defer rendering until after the first mount as the CSS is loaded with Emotion
  // this will ensure that the CSS is loaded before rendering the diffs and prevent CLS
  useEffect(() => {
    setHasMounted(true)
  }, [])

  return (
    <div className={`${baseClass}${parent ? ` ${baseClass}--parent` : ''}`}>
      {!hasMounted ? (
        <Fragment>
          <ShimmerEffect height="8rem" width="100%" />
        </Fragment>
      ) : (
        versionFields?.map((field, fieldIndex) => {
          if (field.fieldByLocale) {
            const LocaleComponents: React.ReactNode[] = []
            for (const [locale, baseField] of Object.entries(field.fieldByLocale)) {
              LocaleComponents.push(
                <div
                  className={`${baseClass}__locale`}
                  data-field-path={baseField.path}
                  data-locale={locale}
                  key={[locale, fieldIndex].join('-')}
                >
                  <div className={`${baseClass}__locale-value`}>{baseField.CustomComponent}</div>
                </div>,
              )
            }
            return (
              <div className={`${baseClass}__field`} key={fieldIndex}>
                {LocaleComponents}
              </div>
            )
          } else if (field.field) {
            return (
              <div
                className={`${baseClass}__field field__${field.field.type}`}
                data-field-path={field.field.path}
                key={fieldIndex}
              >
                {field.field.CustomComponent}
              </div>
            )
          }

          return null
        })
      )}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/next/src/views/Version/RenderFieldsToDiff/DiffCollapser/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .diff-collapser {
    &__toggle-button {
      all: unset;
      cursor: pointer;
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;

      .icon {
        color: var(--theme-elevation-500);
      }

      &:hover {
        // Apply background color but with padding, thus we use after
        &::before {
          content: '';
          position: absolute;
          top: -(base(0.15));
          left: -(base(0.15));
          right: -(base(0.15));
          bottom: -(base(0.15));
          background-color: var(--theme-elevation-50);
          border-radius: var(--style-radius-s);
          z-index: -1;
        }

        .iterable-diff__label {
          background-color: var(--theme-elevation-50);
          z-index: 1;
        }
      }
    }

    &__label {
      // Add space between label, chevron, and change count
      margin: 0 calc(var(--base) * 0.3) 0 0;
      display: inline-flex;
      height: 100%;
    }

    &__field-change-count {
      // Reset the font weight of the change count to normal
      font-weight: normal;
      margin-left: calc(var(--base) * 0.3);
      padding: calc(var(--base) * 0.1) calc(var(--base) * 0.2);
      background: var(--theme-elevation-100);
      border-radius: var(--style-radius-s);
      font-size: 0.8rem;
    }

    &__content:not(.diff-collapser__content--hide-gutter) {
      [dir='ltr'] & {
        // Vertical gutter
        border-left: 2px solid var(--theme-elevation-100);
        // Center-align the gutter with the chevron
        margin-left: 3px;
        // Content indentation
        padding-left: calc(var(--base) * 0.5);
      }
      [dir='rtl'] & {
        // Vertical gutter
        border-right: 2px solid var(--theme-elevation-100);
        // Center-align the gutter with the chevron
        margin-right: 3px;
        // Content indentation
        padding-right: calc(var(--base) * 0.5);
      }
    }

    &__content--is-collapsed {
      // Hide the content when collapsed. We use display: none instead of
      // conditional rendering to avoid loosing children's collapsed state when
      // remounting.
      display: none;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/views/Version/RenderFieldsToDiff/DiffCollapser/index.tsx
Signals: React

```typescript
'use client'
import type { ClientField } from 'payload'

import { ChevronIcon, FieldDiffLabel, useConfig, useTranslation } from '@payloadcms/ui'
import { fieldIsArrayType, fieldIsBlockType } from 'payload/shared'
import React, { useState } from 'react'

import './index.scss'
import { countChangedFields, countChangedFieldsInRows } from '../utilities/countChangedFields.js'

const baseClass = 'diff-collapser'

type Props = {
  hideGutter?: boolean
  initCollapsed?: boolean
  Label: React.ReactNode
  locales: string[] | undefined
  parentIsLocalized: boolean
  valueTo: unknown
} & (
  | {
      // fields collapser
      children: React.ReactNode
      field?: never
      fields: ClientField[]
      isIterable?: false
      valueFrom: unknown
    }
  | {
      // iterable collapser
      children: React.ReactNode
      field: ClientField
      fields?: never
      isIterable: true
      valueFrom?: unknown
    }
)

export const DiffCollapser: React.FC<Props> = ({
  children,
  field,
  fields,
  hideGutter = false,
  initCollapsed = false,
  isIterable = false,
  Label,
  locales,
  parentIsLocalized,
  valueFrom,
  valueTo,
}) => {
  const { t } = useTranslation()
  const [isCollapsed, setIsCollapsed] = useState(initCollapsed)
  const { config } = useConfig()

  let changeCount = 0

  if (isIterable) {
    if (!fieldIsArrayType(field) && !fieldIsBlockType(field)) {
      throw new Error(
        'DiffCollapser: field must be an array or blocks field when isIterable is true',
      )
    }
    const valueFromRows = valueFrom ?? []
    const valueToRows = valueTo ?? []

    if (!Array.isArray(valueFromRows) || !Array.isArray(valueToRows)) {
      throw new Error(
        'DiffCollapser: valueFrom and valueTro must be arrays when isIterable is true',
      )
    }

    changeCount = countChangedFieldsInRows({
      config,
      field,
      locales,
      parentIsLocalized,
      valueFromRows,
      valueToRows,
    })
  } else {
    changeCount = countChangedFields({
      config,
      fields,
      locales,
      parentIsLocalized,
      valueFrom,
      valueTo,
    })
  }

  const contentClassNames = [
    `${baseClass}__content`,
    isCollapsed && `${baseClass}__content--is-collapsed`,
    hideGutter && `${baseClass}__content--hide-gutter`,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={baseClass}>
      <FieldDiffLabel>
        <button
          aria-label={isCollapsed ? 'Expand' : 'Collapse'}
          className={`${baseClass}__toggle-button`}
          onClick={() => setIsCollapsed(!isCollapsed)}
          type="button"
        >
          <div className={`${baseClass}__label`}>{Label}</div>

          <ChevronIcon direction={isCollapsed ? 'right' : 'down'} size={'small'} />
        </button>
        {changeCount > 0 && isCollapsed && (
          <span className={`${baseClass}__field-change-count`}>
            {t('version:changedFieldsCount', { count: changeCount })}
          </span>
        )}
      </FieldDiffLabel>
      <div className={contentClassNames}>{children}</div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/next/src/views/Version/RenderFieldsToDiff/fields/index.ts

```typescript
import type { FieldDiffClientProps, FieldDiffServerProps, FieldTypes } from 'payload'

import { Collapsible } from './Collapsible/index.js'
import { DateDiffComponent } from './Date/index.js'
import { Group } from './Group/index.js'
import { Iterable } from './Iterable/index.js'
import { Relationship } from './Relationship/index.js'
import { Row } from './Row/index.js'
import { Select } from './Select/index.js'
import { Tabs } from './Tabs/index.js'
import { Text } from './Text/index.js'
import { Upload } from './Upload/index.js'

export const diffComponents: Record<
  FieldTypes,
  React.ComponentType<FieldDiffClientProps | FieldDiffServerProps>
> = {
  array: Iterable,
  blocks: Iterable,
  checkbox: Text,
  code: Text,
  collapsible: Collapsible,
  date: DateDiffComponent,
  email: Text,
  group: Group,
  join: null,
  json: Text,
  number: Text,
  point: Text,
  radio: Select,
  relationship: Relationship,
  richText: Text,
  row: Row,
  select: Select,
  tabs: Tabs,
  text: Text,
  textarea: Text,
  ui: null,
  upload: Upload,
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/views/Version/RenderFieldsToDiff/fields/Collapsible/index.tsx
Signals: React

```typescript
'use client'
import type { CollapsibleFieldDiffClientComponent } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import { useTranslation } from '@payloadcms/ui'
import React from 'react'

import { useSelectedLocales } from '../../../Default/SelectedLocalesContext.js'
import { DiffCollapser } from '../../DiffCollapser/index.js'
import { RenderVersionFieldsToDiff } from '../../RenderVersionFieldsToDiff.js'

const baseClass = 'collapsible-diff'

export const Collapsible: CollapsibleFieldDiffClientComponent = ({
  baseVersionField,
  comparisonValue: valueFrom,
  field,
  parentIsLocalized,
  versionValue: valueTo,
}) => {
  const { i18n } = useTranslation()
  const { selectedLocales } = useSelectedLocales()

  if (!baseVersionField.fields?.length) {
    return null
  }

  return (
    <div className={baseClass}>
      <DiffCollapser
        fields={field.fields}
        Label={
          'label' in field &&
          field.label &&
          typeof field.label !== 'function' && <span>{getTranslation(field.label, i18n)}</span>
        }
        locales={selectedLocales}
        parentIsLocalized={parentIsLocalized || field.localized}
        valueFrom={valueFrom}
        valueTo={valueTo}
      >
        <RenderVersionFieldsToDiff versionFields={baseVersionField.fields} />
      </DiffCollapser>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/next/src/views/Version/RenderFieldsToDiff/fields/Date/index.scss

```text
@layer payload-default {
  .date-diff {
    p *[data-match-type='delete'] {
      color: unset !important;
      background-color: unset !important;
    }
    p *[data-match-type='create'] {
      color: unset !important;
      background-color: unset !important;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/views/Version/RenderFieldsToDiff/fields/Date/index.tsx
Signals: React

```typescript
'use client'
import type { DateFieldDiffClientComponent } from 'payload'

import {
  FieldDiffContainer,
  getHTMLDiffComponents,
  useConfig,
  useTranslation,
} from '@payloadcms/ui'
import { formatDate } from '@payloadcms/ui/shared'

import './index.scss'

import React from 'react'

const baseClass = 'date-diff'

export const DateDiffComponent: DateFieldDiffClientComponent = ({
  comparisonValue: valueFrom,
  field,
  locale,
  nestingLevel,
  versionValue: valueTo,
}) => {
  const { i18n } = useTranslation()
  const {
    config: {
      admin: { dateFormat },
    },
  } = useConfig()

  const formattedFromDate = valueFrom
    ? formatDate({
        date: typeof valueFrom === 'string' ? new Date(valueFrom) : (valueFrom as Date),
        i18n,
        pattern: dateFormat,
      })
    : ''

  const formattedToDate = valueTo
    ? formatDate({
        date: typeof valueTo === 'string' ? new Date(valueTo) : (valueTo as Date),
        i18n,
        pattern: dateFormat,
      })
    : ''

  const { From, To } = getHTMLDiffComponents({
    fromHTML:
      `<div class="${baseClass}" data-enable-match="true" data-date="${formattedFromDate}"><p>` +
      formattedFromDate +
      '</p></div>',
    toHTML:
      `<div class="${baseClass}" data-enable-match="true" data-date="${formattedToDate}"><p>` +
      formattedToDate +
      '</p></div>',
    tokenizeByCharacter: false,
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
Location: payload-main/packages/next/src/views/Version/RenderFieldsToDiff/fields/Group/index.scss

```text
@layer payload-default {
  .group-diff {
    &__locale-label {
      &--no-label {
        color: var(--theme-elevation-600);
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/views/Version/RenderFieldsToDiff/fields/Group/index.tsx
Signals: React

```typescript
'use client'
import type { GroupFieldDiffClientComponent } from 'payload'

import { getTranslation } from '@payloadcms/translations'

import './index.scss'

import { useTranslation } from '@payloadcms/ui'
import React from 'react'

import { useSelectedLocales } from '../../../Default/SelectedLocalesContext.js'
import { DiffCollapser } from '../../DiffCollapser/index.js'
import { RenderVersionFieldsToDiff } from '../../RenderVersionFieldsToDiff.js'

const baseClass = 'group-diff'

export const Group: GroupFieldDiffClientComponent = ({
  baseVersionField,
  comparisonValue: valueFrom,
  field,
  locale,
  parentIsLocalized,
  versionValue: valueTo,
}) => {
  const { i18n } = useTranslation()
  const { selectedLocales } = useSelectedLocales()

  return (
    <div className={baseClass}>
      <DiffCollapser
        fields={field.fields}
        Label={
          'label' in field && field.label && typeof field.label !== 'function' ? (
            <span>
              {locale && <span className={`${baseClass}__locale-label`}>{locale}</span>}
              {getTranslation(field.label, i18n)}
            </span>
          ) : (
            <span className={`${baseClass}__locale-label ${baseClass}__locale-label--no-label`}>
              &lt;{i18n.t('version:noLabelGroup')}&gt;
            </span>
          )
        }
        locales={selectedLocales}
        parentIsLocalized={parentIsLocalized || field.localized}
        valueFrom={valueFrom}
        valueTo={valueTo}
      >
        <RenderVersionFieldsToDiff versionFields={baseVersionField.fields} />
      </DiffCollapser>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/next/src/views/Version/RenderFieldsToDiff/fields/Iterable/index.scss

```text
@layer payload-default {
  .iterable-diff {
    &-label-container {
      position: relative;
      height: 20px;
      display: flex;
      flex-direction: row;
      height: 100%;
    }

    &-label-prefix {
      background-color: var(--theme-bg);
      position: relative;
      width: calc(var(--base) * 0.5);
      height: 16px;
      margin-left: calc((var(--base) * -0.5) - 5px);
      margin-right: calc(var(--base) * 0.5);

      &::before {
        content: '';
        position: absolute;
        left: 1px;
        top: 8px;
        transform: translateY(-50%);
        width: 6px;
        height: 6px;
        background-color: var(--theme-elevation-200);
        border-radius: 50%;
        margin-right: 5px;
      }
    }
    &__label {
      font-weight: 400;
      color: var(--theme-elevation-600);
    }

    &__locale-label {
      background: var(--theme-elevation-100);
      border-radius: var(--style-radius-s);
      padding: calc(var(--base) * 0.2);
      // border-radius: $style-radius-m;
      [dir='ltr'] & {
        margin-right: calc(var(--base) * 0.25);
      }
      [dir='rtl'] & {
        margin-left: calc(var(--base) * 0.25);
      }
    }

    // Space between each row
    &__row:not(:first-of-type) {
      margin-top: calc(var(--base) * 0.5);
    }

    &__no-rows {
      color: var(--theme-elevation-400);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/views/Version/RenderFieldsToDiff/fields/Iterable/index.tsx
Signals: React

```typescript
'use client'

import type { FieldDiffClientProps } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import { useConfig, useTranslation } from '@payloadcms/ui'

import './index.scss'

import { fieldIsArrayType, fieldIsBlockType } from 'payload/shared'
import React from 'react'

import { useSelectedLocales } from '../../../Default/SelectedLocalesContext.js'
import { DiffCollapser } from '../../DiffCollapser/index.js'
import { RenderVersionFieldsToDiff } from '../../RenderVersionFieldsToDiff.js'
import { getFieldsForRowComparison } from '../../utilities/getFieldsForRowComparison.js'

const baseClass = 'iterable-diff'

export const Iterable: React.FC<FieldDiffClientProps> = ({
  baseVersionField,
  comparisonValue: valueFrom,
  field,
  locale,
  parentIsLocalized,
  versionValue: valueTo,
}) => {
  const { i18n, t } = useTranslation()
  const { selectedLocales } = useSelectedLocales()
  const { config } = useConfig()

  if (!fieldIsArrayType(field) && !fieldIsBlockType(field)) {
    throw new Error(`Expected field to be an array or blocks type but got: ${field.type}`)
  }

  const valueToRowCount = Array.isArray(valueTo) ? valueTo.length : 0
  const valueFromRowCount = Array.isArray(valueFrom) ? valueFrom.length : 0
  const maxRows = Math.max(valueToRowCount, valueFromRowCount)

  return (
    <div className={baseClass}>
      <DiffCollapser
        field={field}
        isIterable
        Label={
          'label' in field &&
          field.label &&
          typeof field.label !== 'function' && (
            <span>
              {locale && <span className={`${baseClass}__locale-label`}>{locale}</span>}
              {getTranslation(field.label, i18n)}
            </span>
          )
        }
        locales={selectedLocales}
        parentIsLocalized={parentIsLocalized}
        valueFrom={valueFrom}
        valueTo={valueTo}
      >
        {maxRows > 0 && (
          <div className={`${baseClass}__rows`}>
            {Array.from({ length: maxRows }, (_, i) => {
              const valueToRow = valueTo?.[i] || {}
              const valueFromRow = valueFrom?.[i] || {}

              const { fields, versionFields } = getFieldsForRowComparison({
                baseVersionField,
                config,
                field,
                row: i,
                valueFromRow,
                valueToRow,
              })

              if (!versionFields?.length) {
                // Rows without a diff create "holes" in the baseVersionField.rows (=versionFields) array - this is to maintain the correct row indexes.
                // It does mean that this row has no diff and should not be rendered => skip it.
                return null
              }

              const rowNumber = String(i + 1).padStart(2, '0')
              const rowLabel = fieldIsArrayType(field)
                ? `${t('general:item')} ${rowNumber}`
                : `${t('fields:block')} ${rowNumber}`

              return (
                <div className={`${baseClass}__row`} key={i}>
                  <DiffCollapser
                    fields={fields}
                    hideGutter={true}
                    Label={
                      <div className={`${baseClass}-label-container`}>
                        <div className={`${baseClass}-label-prefix`}></div>
                        <span className={`${baseClass}__label`}>{rowLabel}</span>
                      </div>
                    }
                    locales={selectedLocales}
                    parentIsLocalized={parentIsLocalized || field.localized}
                    valueFrom={valueFromRow}
                    valueTo={valueToRow}
                  >
                    <RenderVersionFieldsToDiff versionFields={versionFields} />
                  </DiffCollapser>
                </div>
              )
            })}
          </div>
        )}
        {maxRows === 0 && (
          <div className={`${baseClass}__no-rows`}>
            {i18n.t('version:noRowsFound', {
              label:
                'labels' in field && field.labels?.plural
                  ? getTranslation(field.labels.plural, i18n)
                  : i18n.t('general:rows'),
            })}
          </div>
        )}
      </DiffCollapser>
    </div>
  )
}
```

--------------------------------------------------------------------------------

````
