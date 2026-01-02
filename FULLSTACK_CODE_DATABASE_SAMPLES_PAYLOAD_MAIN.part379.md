---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 379
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 379 of 695)

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

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/QueryPresets/fields/ColumnsField/index.scss

```text
@import '../../../../scss/styles';

@layer payload-default {
  .query-preset-columns-field {
    .field-label {
      margin-bottom: calc(var(--base) / 2);
    }

    .value-wrapper {
      background-color: var(--theme-elevation-50);
      padding: var(--base);
      display: flex;
      flex-wrap: wrap;
      gap: calc(var(--base) / 2);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/QueryPresets/fields/ColumnsField/index.tsx
Signals: React

```typescript
'use client'
import type { ColumnPreference, JSONFieldClientComponent } from 'payload'

import { toWords, transformColumnsToSearchParams } from 'payload/shared'
import React from 'react'

import { FieldLabel } from '../../../../fields/FieldLabel/index.js'
import { useField } from '../../../../forms/useField/index.js'
import { Pill } from '../../../Pill/index.js'
import './index.scss'

export const QueryPresetsColumnField: JSONFieldClientComponent = ({
  field: { label, required },
}) => {
  const { path, value } = useField()

  return (
    <div className="field-type query-preset-columns-field">
      <FieldLabel as="h3" label={label} path={path} required={required} />
      <div className="value-wrapper">
        {value
          ? transformColumnsToSearchParams(value as ColumnPreference[]).map((column, i) => {
              const isColumnActive = !column.startsWith('-')

              return (
                <Pill
                  key={i}
                  pillStyle={isColumnActive ? 'always-white' : 'light-gray'}
                  size="small"
                >
                  {toWords(column)}
                </Pill>
              )
            })
          : 'No columns selected'}
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/QueryPresets/fields/GroupByField/index.scss

```text
@import '../../../../scss/styles';

@layer payload-default {
  .query-preset-group-by-field {
    .field-label {
      margin-bottom: calc(var(--base) / 2);
    }

    .value-wrapper {
      background-color: var(--theme-elevation-50);
      padding: var(--base);
      display: flex;
      flex-wrap: wrap;
      gap: calc(var(--base) / 2);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/QueryPresets/fields/GroupByField/index.tsx
Signals: React

```typescript
'use client'
import type { TextFieldClientComponent } from 'payload'

import { toWords } from 'payload/shared'
import React, { useMemo } from 'react'

import { FieldLabel } from '../../../../fields/FieldLabel/index.js'
import { useField } from '../../../../forms/useField/index.js'
import { useAuth } from '../../../../providers/Auth/index.js'
import { useConfig } from '../../../../providers/Config/index.js'
import { useTranslation } from '../../../../providers/Translation/index.js'
import { reduceFieldsToOptions } from '../../../../utilities/reduceFieldsToOptions.js'
import { Pill } from '../../../Pill/index.js'
import './index.scss'

export const QueryPresetsGroupByField: TextFieldClientComponent = ({
  field: { label, required },
}) => {
  const { path, value } = useField()
  const { i18n } = useTranslation()
  const { permissions } = useAuth()
  const { config } = useConfig()

  // Get the relatedCollection from the document data
  const relatedCollectionField = useField({ path: 'relatedCollection' })
  const relatedCollection = relatedCollectionField.value as string

  // Get the collection config for the related collection
  const collectionConfig = useMemo(() => {
    if (!relatedCollection) {
      return null
    }

    return config.collections?.find((col) => col.slug === relatedCollection)
  }, [relatedCollection, config.collections])

  // Reduce fields to options to get proper labels
  const reducedFields = useMemo(() => {
    if (!collectionConfig) {
      return []
    }

    const fieldPermissions = permissions?.collections?.[relatedCollection]?.fields

    return reduceFieldsToOptions({
      fieldPermissions,
      fields: collectionConfig.fields,
      i18n,
    })
  }, [collectionConfig, permissions, relatedCollection, i18n])

  const renderGroupBy = (groupByValue: string) => {
    if (!groupByValue) {
      return 'No group by selected'
    }

    const isDescending = groupByValue.startsWith('-')
    const fieldName = isDescending ? groupByValue.slice(1) : groupByValue
    const direction = isDescending ? 'descending' : 'ascending'

    // Find the field option to get the proper label
    const fieldOption = reducedFields.find((field) => field.value === fieldName)
    const displayLabel = fieldOption?.label || toWords(fieldName)

    return (
      <Pill pillStyle="always-white" size="small">
        <b>{displayLabel}</b> ({direction})
      </Pill>
    )
  }

  return (
    <div className="field-type query-preset-group-by-field">
      <FieldLabel as="h3" label={label} path={path} required={required} />
      <div className="value-wrapper">{renderGroupBy(value as string)}</div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/QueryPresets/fields/WhereField/index.scss

```text
@import '../../../../scss/styles';

@layer payload-default {
  .query-preset-where-field {
    .field-label {
      margin-bottom: calc(var(--base) / 2);
    }

    .value-wrapper {
      background-color: var(--theme-elevation-50);
      padding: var(--base);
    }
  }

  .query-preset-where-field {
    .pill {
      &--style-always-white {
        background: var(--theme-elevation-250);
        color: var(--theme-elevation-1000);
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/QueryPresets/fields/WhereField/index.tsx
Signals: React

```typescript
'use client'
import type { JSONFieldClientComponent, Where } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import { toWords } from 'payload/shared'
import React from 'react'

import { FieldLabel } from '../../../../fields/FieldLabel/index.js'
import { useField } from '../../../../forms/useField/index.js'
import { useConfig } from '../../../../providers/Config/index.js'
import { useListQuery } from '../../../../providers/ListQuery/index.js'
import { useTranslation } from '../../../../providers/Translation/index.js'
import { Pill } from '../../../Pill/index.js'
import './index.scss'

/** @todo: improve this */
const transformWhereToNaturalLanguage = (
  where: Where,
  collectionLabel: string,
): React.ReactNode => {
  if (!where) {
    return null
  }

  const renderCondition = (condition: any): React.ReactNode => {
    if (!condition || typeof condition !== 'object') {
      return 'No where query'
    }

    const key = Object.keys(condition)[0]

    if (!key || !condition[key] || typeof condition[key] !== 'object') {
      return 'No where query'
    }

    const operator = Object.keys(condition[key])[0]
    const operatorValue = condition[key][operator]

    // Format value - ideally would use field schema for proper typing
    const formatValue = (val: any): string => {
      if (typeof val === 'object' && val != null) {
        try {
          return new Date(val).toLocaleDateString()
        } catch {
          return 'Unknown error has occurred'
        }
      }
      return val?.toString() ?? ''
    }

    const value = Array.isArray(operatorValue)
      ? operatorValue.map(formatValue).join(', ')
      : formatValue(operatorValue)

    return (
      <Pill pillStyle="always-white" size="small">
        <b>{toWords(key)}</b> {operator} <b>{toWords(value)}</b>
      </Pill>
    )
  }

  const renderWhere = (where: Where, collectionLabel: string): React.ReactNode => {
    if (where.or && where.or.length > 0) {
      return (
        <div className="or-condition">
          {where.or.map((orCondition, orIndex) => (
            <React.Fragment key={orIndex}>
              {orCondition.and && orCondition.and.length > 0 ? (
                <div className="and-condition">
                  {orIndex === 0 && (
                    <span className="label">{`Filter ${collectionLabel} where `}</span>
                  )}
                  {orIndex > 0 && <span className="label"> or </span>}
                  {orCondition.and.map((andCondition, andIndex) => (
                    <React.Fragment key={andIndex}>
                      {renderCondition(andCondition)}
                      {andIndex < orCondition.and.length - 1 && (
                        <span className="label"> and </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                renderCondition(orCondition)
              )}
            </React.Fragment>
          ))}
        </div>
      )
    }

    return renderCondition(where)
  }

  return renderWhere(where, collectionLabel)
}

export const QueryPresetsWhereField: JSONFieldClientComponent = ({
  field: { label, required },
}) => {
  const { path, value } = useField()
  const { collectionSlug } = useListQuery()
  const { getEntityConfig } = useConfig()

  const collectionConfig = getEntityConfig({ collectionSlug })

  const { i18n } = useTranslation()

  return (
    <div className="field-type query-preset-where-field">
      <FieldLabel as="h3" label={label} path={path} required={required} />
      <div className="value-wrapper">
        {value
          ? transformWhereToNaturalLanguage(
              value as Where,
              getTranslation(collectionConfig?.labels?.plural, i18n),
            )
          : 'No where query'}
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/QueryPresets/QueryPresetBar/index.scss

```text
@import '../../../scss/styles';

@layer payload-default {
  .query-preset-bar {
    display: flex;
    gap: base(0.5);
    justify-content: space-between;
    background-color: var(--theme-elevation-50);
    border-radius: var(--style-radius-m);
    padding: base(0.5);

    &__menu {
      display: flex;
      align-items: center;
      gap: 4px;
      flex-grow: 1;
    }

    &__create-new-preset {
      height: 100%;
      padding: 0 3px;
      background: transparent;
      box-shadow: inset 0 0 0 1px var(--theme-elevation-150);

      &:hover {
        background: transparent;
      }
    }

    &__menu-items {
      overflow: auto;
      display: flex;
      gap: base(0.5);

      button {
        color: var(--theme-elevation-500);
        margin: 0;
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/QueryPresets/QueryPresetBar/index.tsx
Signals: React

```typescript
import type { QueryPreset, SanitizedCollectionPermission } from 'payload'

import { useModal } from '@faceless-ui/modal'
import { getTranslation } from '@payloadcms/translations'
import {
  formatApiURL,
  transformColumnsToPreferences,
  transformColumnsToSearchParams,
} from 'payload/shared'
import React, { Fragment, useCallback, useMemo } from 'react'
import { toast } from 'sonner'

import { PlusIcon } from '../../../icons/Plus/index.js'
import { useConfig } from '../../../providers/Config/index.js'
import { useListQuery } from '../../../providers/ListQuery/context.js'
import { useTranslation } from '../../../providers/Translation/index.js'
import { ConfirmationModal } from '../../ConfirmationModal/index.js'
import { useDocumentDrawer } from '../../DocumentDrawer/index.js'
import { useListDrawer } from '../../ListDrawer/index.js'
import { ListSelectionButton } from '../../ListSelection/index.js'
import { Pill } from '../../Pill/index.js'
import { Translation } from '../../Translation/index.js'
import { QueryPresetToggler } from '../QueryPresetToggler/index.js'
import './index.scss'

const confirmDeletePresetModalSlug = 'confirm-delete-preset'

const queryPresetsSlug = 'payload-query-presets'

const baseClass = 'query-preset-bar'

export const QueryPresetBar: React.FC<{
  activePreset: QueryPreset
  collectionSlug?: string
  queryPresetPermissions: SanitizedCollectionPermission
}> = ({ activePreset, collectionSlug, queryPresetPermissions }) => {
  const { modified, query, refineListData, setModified: setQueryModified } = useListQuery()

  const { i18n, t } = useTranslation()
  const { openModal } = useModal()

  const {
    config: {
      routes: { api: apiRoute },
      serverURL,
    },
    getEntityConfig,
  } = useConfig()

  const presetConfig = getEntityConfig({ collectionSlug: queryPresetsSlug })

  const [PresetDocumentDrawer, , { openDrawer: openDocumentDrawer }] = useDocumentDrawer({
    id: activePreset?.id,
    collectionSlug: queryPresetsSlug,
  })

  const [
    CreateNewPresetDrawer,
    ,
    { closeDrawer: closeCreateNewDrawer, openDrawer: openCreateNewDrawer },
  ] = useDocumentDrawer({
    collectionSlug: queryPresetsSlug,
  })

  const filterOptions = useMemo(
    () => ({
      'payload-query-presets': {
        isTemp: {
          not_equals: true,
        },
        relatedCollection: {
          equals: collectionSlug,
        },
      },
    }),
    [collectionSlug],
  )

  const [ListDrawer, , { closeDrawer: closeListDrawer, openDrawer: openListDrawer }] =
    useListDrawer({
      collectionSlugs: [queryPresetsSlug],
      filterOptions,
      selectedCollection: queryPresetsSlug,
    })

  const handlePresetChange = useCallback(
    async (preset: QueryPreset) => {
      await refineListData(
        {
          columns: preset.columns ? transformColumnsToSearchParams(preset.columns) : undefined,
          groupBy: preset.groupBy || '',
          preset: preset.id,
          where: preset.where,
        },
        false,
      )
    },
    [refineListData],
  )

  const resetQueryPreset = useCallback(async () => {
    await refineListData(
      {
        columns: [],
        groupBy: '',
        preset: '',
        where: {},
      },
      false,
    )
  }, [refineListData])

  const handleDeletePreset = useCallback(async () => {
    try {
      await fetch(
        formatApiURL({
          apiRoute,
          path: `/${queryPresetsSlug}/${activePreset.id}`,
          serverURL,
        }),
        {
          method: 'DELETE',
        },
      ).then(async (res) => {
        try {
          const json = await res.json()

          if (res.status < 400) {
            toast.success(
              t('general:titleDeleted', {
                label: getTranslation(presetConfig?.labels?.singular, i18n),
                title: activePreset.title,
              }),
            )

            await resetQueryPreset()
          } else {
            if (json.errors) {
              json.errors.forEach((error) => toast.error(error.message))
            } else {
              toast.error(t('error:deletingTitle', { title: activePreset.title }))
            }
          }
        } catch (_err) {
          toast.error(t('error:deletingTitle', { title: activePreset.title }))
        }
      })
    } catch (_err) {
      toast.error(t('error:deletingTitle', { title: activePreset.title }))
    }
  }, [
    apiRoute,
    activePreset?.id,
    activePreset?.title,
    t,
    presetConfig,
    i18n,
    resetQueryPreset,
    serverURL,
  ])

  const saveCurrentChanges = useCallback(async () => {
    try {
      await fetch(
        formatApiURL({
          apiRoute,
          path: `/${queryPresetsSlug}/${activePreset.id}`,
          serverURL,
        }),
        {
          body: JSON.stringify({
            columns: transformColumnsToPreferences(query.columns),
            groupBy: query.groupBy,
            where: query.where,
          }),
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
        },
      ).then(async (res) => {
        try {
          const json = await res.json()

          if (res.status < 400) {
            toast.success(
              t('general:updatedLabelSuccessfully', {
                label: getTranslation(presetConfig?.labels?.singular, i18n),
              }),
            )

            setQueryModified(false)
          } else {
            if (json.errors) {
              json.errors.forEach((error) => toast.error(error.message))
            } else {
              toast.error(t('error:unknown'))
            }
          }
        } catch (_err) {
          toast.error(t('error:unknown'))
        }
      })
    } catch (_err) {
      toast.error(t('error:unknown'))
    }
  }, [
    apiRoute,
    activePreset?.id,
    query.columns,
    query.groupBy,
    query.where,
    t,
    presetConfig?.labels?.singular,
    i18n,
    setQueryModified,
    serverURL,
  ])

  const hasModifiedPreset = activePreset && modified

  return (
    <Fragment>
      <div className={baseClass}>
        <div className={`${baseClass}__menu`}>
          <QueryPresetToggler
            activePreset={activePreset}
            openPresetListDrawer={openListDrawer}
            resetPreset={resetQueryPreset}
          />
          <Pill
            aria-label={t('general:newLabel', { label: presetConfig?.labels?.singular })}
            className={`${baseClass}__create-new-preset`}
            icon={<PlusIcon />}
            id="create-new-preset"
            onClick={() => {
              openCreateNewDrawer()
            }}
            size="small"
          />
        </div>
        <div className={`${baseClass}__menu-items`}>
          {hasModifiedPreset && (
            <ListSelectionButton
              id="reset-preset"
              key="reset"
              onClick={async () => {
                await refineListData(
                  {
                    columns: transformColumnsToSearchParams(activePreset.columns),
                    groupBy: activePreset.groupBy || '',
                    where: activePreset.where,
                  },
                  false,
                )
              }}
              type="button"
            >
              {t('general:reset')}
            </ListSelectionButton>
          )}
          {hasModifiedPreset && queryPresetPermissions.update && (
            <ListSelectionButton
              id="save-preset"
              key="save"
              onClick={async () => {
                await saveCurrentChanges()
              }}
              type="button"
            >
              {activePreset?.isShared ? t('general:updateForEveryone') : t('fields:saveChanges')}
            </ListSelectionButton>
          )}
          {activePreset && queryPresetPermissions?.delete && (
            <Fragment>
              <ListSelectionButton
                id="delete-preset"
                onClick={() => openModal(confirmDeletePresetModalSlug)}
                type="button"
              >
                {t('general:deleteLabel', { label: presetConfig?.labels?.singular })}
              </ListSelectionButton>
              <ListSelectionButton
                id="edit-preset"
                onClick={() => {
                  openDocumentDrawer()
                }}
                type="button"
              >
                {t('general:editLabel', { label: presetConfig?.labels?.singular })}
              </ListSelectionButton>
            </Fragment>
          )}
        </div>
      </div>
      <CreateNewPresetDrawer
        initialData={{
          columns: transformColumnsToPreferences(query.columns),
          groupBy: query.groupBy,
          relatedCollection: collectionSlug,
          where: query.where,
        }}
        onSave={async ({ doc }) => {
          closeCreateNewDrawer()
          await handlePresetChange(doc as QueryPreset)
        }}
        redirectAfterCreate={false}
      />
      <ConfirmationModal
        body={
          <Translation
            elements={{
              '1': ({ children }) => <strong>{children}</strong>,
            }}
            i18nKey="general:aboutToDelete"
            t={t}
            variables={{
              label: presetConfig?.labels?.singular,
              title: activePreset?.title,
            }}
          />
        }
        confirmingLabel={t('general:deleting')}
        heading={t('general:confirmDeletion')}
        modalSlug={confirmDeletePresetModalSlug}
        onConfirm={handleDeletePreset}
      />
      <PresetDocumentDrawer
        onDelete={() => {
          // setSelectedPreset(undefined)
        }}
        onDuplicate={async ({ doc }) => {
          await handlePresetChange(doc as QueryPreset)
        }}
        onSave={async ({ doc }) => {
          await handlePresetChange(doc as QueryPreset)
        }}
      />
      <ListDrawer
        allowCreate={false}
        disableQueryPresets
        onSelect={async ({ doc }) => {
          closeListDrawer()
          await handlePresetChange(doc as QueryPreset)
        }}
      />
    </Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/QueryPresets/QueryPresetToggler/index.scss

```text
@import '../../../scss/styles';

@layer payload-default {
  .active-query-preset {
    &__label {
      display: flex;
      align-items: center;
    }

    &__label-text-max-width {
      max-width: 100px;
      overflow: hidden;
    }

    &__label-text {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    &__label-and-clear-wrap {
      display: flex;
      align-items: center;
    }

    &__shared {
      margin-right: 2px;
    }

    &__clear {
      display: flex;
      align-items: center;
      width: var(--pill-icon-size);
      height: var(--pill-icon-size);
    }

    &--active {
      box-shadow: inset 0 0 0 1px var(--theme-elevation-200);
      background-color: var(--theme-elevation-0);
      padding-right: 4px;

      &:hover {
        background-color: var(--theme-elevation-100);
      }
    }
  }

  html[data-theme='dark'] {
    .active-query-preset {
      &--active {
        box-shadow: inset 0 0 0 1px var(--theme-elevation-300);
        color: var(--theme-elevation-0);
        background-color: var(--theme-elevation-800);

        &:hover {
          background-color: var(--theme-elevation-700);
        }
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/QueryPresets/QueryPresetToggler/index.tsx

```typescript
'use client'
import type { QueryPreset } from 'payload'

import { getTranslation } from '@payloadcms/translations'

import { PeopleIcon } from '../../../icons/People/index.js'
import { XIcon } from '../../../icons/X/index.js'
import { useConfig } from '../../../providers/Config/index.js'
import { useTranslation } from '../../../providers/Translation/index.js'
import { Pill } from '../../Pill/index.js'
import './index.scss'

const baseClass = 'active-query-preset'

export function QueryPresetToggler({
  activePreset,
  openPresetListDrawer,
  resetPreset,
}: {
  activePreset: QueryPreset
  openPresetListDrawer: () => void
  resetPreset: () => Promise<void>
}) {
  const { i18n, t } = useTranslation()
  const { getEntityConfig } = useConfig()

  const presetsConfig = getEntityConfig({
    collectionSlug: 'payload-query-presets',
  })

  return (
    <Pill
      className={[baseClass, activePreset && `${baseClass}--active`].filter(Boolean).join(' ')}
      id="select-preset"
      onClick={() => {
        openPresetListDrawer()
      }}
      pillStyle="light"
      size="small"
    >
      <div className={`${baseClass}__label`}>
        {activePreset?.isShared && <PeopleIcon className={`${baseClass}__shared`} />}
        <div className={`${baseClass}__label-text-max-width`}>
          <div className={`${baseClass}__label-text`}>
            {activePreset?.title ||
              t('general:selectLabel', {
                label: getTranslation(presetsConfig.labels.singular, i18n),
              })}
          </div>
        </div>
        {activePreset ? (
          <div
            className={`${baseClass}__clear`}
            id="clear-preset"
            onClick={async (e) => {
              e.stopPropagation()
              await resetPreset()
            }}
            onKeyDown={async (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation()
                await resetPreset()
              }
            }}
            role="button"
            tabIndex={0}
          >
            <XIcon />
          </div>
        ) : null}
      </div>
    </Pill>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/ReactSelect/index.scss

```text
@import '../../scss/styles';

@layer payload-default {
  .react-select-container {
    width: 100%;
  }

  .react-select {
    .rs__control {
      @include formInput;
      height: auto;
      padding: base(0.35) base(0.6);
      flex-wrap: nowrap;
    }

    .rs__menu-notice {
      padding: base(0.5) base(0.6);
    }

    .rs__indicator {
      padding: 0px 4px;
      cursor: pointer;
    }

    .rs__indicator-separator {
      display: none;
    }

    .rs__input-container {
      color: var(--theme-elevation-1000);
    }

    .rs__input {
      font-family: var(--font-body);
      width: 10px;
    }

    .rs__menu {
      z-index: 4;
      border-radius: 0;
      @include shadow-lg;
      background: var(--theme-input-bg);
    }

    .rs__group-heading {
      color: var(--theme-elevation-800);
      padding-left: base(0.5);
      margin-top: base(0.25);
      margin-bottom: base(0.25);
    }

    .rs__option {
      font-family: var(--font-body);
      font-size: $baseline-body-size;
      padding: base(0.375) base(0.75);
      color: var(--theme-elevation-800);

      &--is-focused {
        background-color: var(--theme-elevation-100);
      }

      &--is-selected {
        background-color: var(--theme-elevation-300);
      }
    }

    &--error,
    &--error:hover,
    &--error:focus-within {
      div.rs__control {
        background-color: var(--theme-error-50);
        border: 1px solid var(--theme-error-500);

        & > div.rs__indicator > button.dropdown-indicator[type='button'] {
          border: none;
        }
      }
    }

    &.rs--is-disabled .rs__control {
      @include readOnly;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/ReactSelect/index.tsx
Signals: React

```typescript
'use client'
import type { KeyboardEventHandler } from 'react'

import { arrayMove } from '@dnd-kit/sortable'
import { getTranslation } from '@payloadcms/translations'
import React, { useEffect, useId } from 'react'
import Select, { type StylesConfig } from 'react-select'
import CreatableSelect from 'react-select/creatable'

import type { Option, ReactSelectAdapterProps } from './types.js'
export type { Option } from './types.js'

import { useTranslation } from '../../providers/Translation/index.js'
import { DraggableSortable } from '../DraggableSortable/index.js'
import { ShimmerEffect } from '../ShimmerEffect/index.js'
import { ClearIndicator } from './ClearIndicator/index.js'
import { Control } from './Control/index.js'
import { DropdownIndicator } from './DropdownIndicator/index.js'
import './index.scss'
import { Input } from './Input/index.js'
import { generateMultiValueDraggableID, MultiValue } from './MultiValue/index.js'
import { MultiValueLabel } from './MultiValueLabel/index.js'
import { MultiValueRemove } from './MultiValueRemove/index.js'
import { SingleValue } from './SingleValue/index.js'
import { ValueContainer } from './ValueContainer/index.js'

const createOption = (label: string) => ({
  label,
  value: label,
})

const SelectAdapter: React.FC<ReactSelectAdapterProps> = (props) => {
  const { i18n, t } = useTranslation()
  const [inputValue, setInputValue] = React.useState('') // for creatable select
  const uuid = useId()
  const [hasMounted, setHasMounted] = React.useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  const {
    className,
    components,
    customProps,
    disabled = false,
    filterOption = undefined,
    getOptionValue,
    isClearable = true,
    isCreatable,
    isLoading,
    isSearchable = true,
    noOptionsMessage = () => t('general:noOptions'),
    numberOnly = false,
    onChange,
    onMenuClose,
    onMenuOpen,
    options,
    placeholder = t('general:selectValue'),
    showError,
    value,
  } = props

  const loadingMessage = () => t('general:loading') + '...'

  const classes = [className, 'react-select', showError && 'react-select--error']
    .filter(Boolean)
    .join(' ')

  const styles: StylesConfig<Option> = {
    // Remove the default react-select z-index from the menu so that our custom
    // z-index in the "payload-default" css layer can take effect, in such a way
    // that end users can easily override it as with other styles.
    menu: (rsStyles) => ({ ...rsStyles, zIndex: undefined }),
  }

  if (!hasMounted) {
    return <ShimmerEffect height="calc(var(--base) * 2 + 2px)" />
  }

  if (!isCreatable) {
    return (
      <Select
        captureMenuScroll
        customProps={customProps}
        isLoading={isLoading}
        {...props}
        className={classes}
        classNamePrefix="rs"
        components={{
          ClearIndicator,
          Control,
          DropdownIndicator,
          Input,
          MultiValue,
          MultiValueLabel,
          MultiValueRemove,
          SingleValue,
          ValueContainer,
          ...components,
        }}
        filterOption={filterOption}
        getOptionValue={getOptionValue}
        instanceId={uuid}
        isClearable={isClearable}
        isDisabled={disabled}
        isSearchable={isSearchable}
        loadingMessage={loadingMessage}
        menuPlacement="auto"
        noOptionsMessage={noOptionsMessage}
        onChange={onChange}
        onMenuClose={onMenuClose}
        onMenuOpen={onMenuOpen}
        options={options}
        placeholder={getTranslation(placeholder, i18n)}
        styles={styles}
        unstyled={true}
        value={value}
      />
    )
  }
  const handleKeyDown: KeyboardEventHandler = (event) => {
    if (numberOnly === true) {
      const acceptableKeys = [
        'Tab',
        'Escape',
        'Backspace',
        'Enter',
        'ArrowRight',
        'ArrowLeft',
        'ArrowUp',
        'ArrowDown',
      ]
      const isNumber = !/\D/.test(event.key)
      const isActionKey = acceptableKeys.includes(event.key)
      if (!isNumber && !isActionKey) {
        event.preventDefault()
        return
      }
    }
    if (!value || !inputValue || inputValue.trim() === '') {
      return
    }
    if (filterOption && !filterOption(null, inputValue)) {
      return
    }
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        onChange([...(value as Option[]), createOption(inputValue)])
        setInputValue('')
        event.preventDefault()
        break
      default:
        break
    }
  }

  return (
    <CreatableSelect
      captureMenuScroll
      isLoading={isLoading}
      {...props}
      className={classes}
      classNamePrefix="rs"
      components={{
        ClearIndicator,
        Control,
        DropdownIndicator,
        Input,
        MultiValue,
        MultiValueLabel,
        MultiValueRemove,
        SingleValue,
        ValueContainer,
        ...components,
      }}
      filterOption={filterOption}
      inputValue={inputValue}
      instanceId={uuid}
      isClearable={isClearable}
      isDisabled={disabled}
      isSearchable={isSearchable}
      loadingMessage={loadingMessage}
      menuPlacement="auto"
      noOptionsMessage={noOptionsMessage}
      onChange={onChange}
      onInputChange={(newValue) => setInputValue(newValue)}
      onKeyDown={handleKeyDown}
      onMenuClose={onMenuClose}
      onMenuOpen={onMenuOpen}
      options={options}
      placeholder={getTranslation(placeholder, i18n)}
      styles={styles}
      unstyled={true}
      value={value}
    />
  )
}

const SortableSelect: React.FC<ReactSelectAdapterProps> = (props) => {
  const { getOptionValue, onChange, value } = props

  let draggableIDs: string[] = []
  if (value) {
    draggableIDs = (Array.isArray(value) ? value : [value]).map((optionValue) => {
      return generateMultiValueDraggableID(optionValue, getOptionValue)
    })
  }

  return (
    <DraggableSortable
      className="react-select-container"
      ids={draggableIDs}
      onDragEnd={({ moveFromIndex, moveToIndex }) => {
        let sorted = value
        if (value && Array.isArray(value)) {
          sorted = arrayMove(value, moveFromIndex, moveToIndex)
        }
        onChange(sorted)
      }}
    >
      <SelectAdapter {...props} />
    </DraggableSortable>
  )
}

export const ReactSelect: React.FC<ReactSelectAdapterProps> = (props) => {
  const { isMulti, isSortable } = props

  if (isMulti && isSortable) {
    return <SortableSelect {...props} />
  }

  return <SelectAdapter {...props} />
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/ui/src/elements/ReactSelect/types.ts

```typescript
import type { LabelFunction } from 'payload'
import type { CommonProps, GroupBase, Props as ReactSelectStateManagerProps } from 'react-select'

import type { DocumentDrawerProps } from '../DocumentDrawer/types.js'

type CustomSelectProps = {
  disableKeyDown?: boolean
  disableMouseDown?: boolean
  draggableProps?: any
  droppableRef?: React.RefObject<HTMLDivElement | null>
  editableProps?: (
    data: Option<{ label: string; value: string }>,
    className: string,
    selectProps: ReactSelectStateManagerProps,
  ) => any
  onDelete?: DocumentDrawerProps['onDelete']
  onDocumentOpen?: (args: {
    collectionSlug: string
    hasReadPermission: boolean
    id: number | string
    openInNewTab?: boolean
  }) => void
  onDuplicate?: DocumentDrawerProps['onSave']
  onSave?: DocumentDrawerProps['onSave']
  valueContainerLabel?: string
}

// augment the types for the `Select` component from `react-select`
// this is to include the `selectProps` prop at the top-level `Select` component
// @ts-expect-error-next-line // TODO Fix this - moduleResolution 16 breaks our declare module
declare module 'react-select/dist/declarations/src/Select' {
  export interface Props<Option, IsMulti extends boolean, Group extends GroupBase<Option>> {
    customProps?: CustomSelectProps
  }
}

// augment the types for the `CommonPropsAndClassName` from `react-select`
// this will include the `selectProps` prop to every `react-select` component automatically
// @ts-expect-error-next-line // TODO Fix this - moduleResolution 16 breaks our declare module
declare module 'react-select/dist/declarations/src' {
  export interface CommonPropsAndClassName<
    Option,
    IsMulti extends boolean,
    Group extends GroupBase<Option>,
  > extends CommonProps<Option, IsMulti, Group> {
    customProps?: CustomSelectProps & ReactSelectStateManagerProps<Option, IsMulti, Group>
  }
}

export type Option<TValue = unknown> = {
  [key: string]: unknown
  //* The ID is used to identify the option in the UI. If it doesn't exist and value cannot be transformed into a string, sorting won't work */
  id?: string
  value: TValue
}

export type OptionGroup = {
  label: string
  options: Option[]
}

export type ReactSelectAdapterProps = {
  backspaceRemovesValue?: boolean
  blurInputOnSelect?: boolean
  className?: string
  components?: {
    [key: string]: React.FC<any>
  }
  customProps?: CustomSelectProps
  disabled?: boolean
  filterOption?:
    | ((
        {
          allowEdit,
          data,
          label,
          value,
        }: { allowEdit: boolean; data: Option; label: string; value: string },
        search: string,
      ) => boolean)
    | undefined
  getOptionValue?: ReactSelectStateManagerProps<
    Option,
    boolean,
    GroupBase<Option>
  >['getOptionValue']
  id?: string
  inputId?: string
  isClearable?: boolean
  /** Allows you to create own values in the UI despite them not being pre-specified */
  isCreatable?: boolean
  isLoading?: boolean
  /** Allows you to specify multiple values instead of just one */
  isMulti?: boolean
  isOptionSelected?: any
  isSearchable?: boolean
  isSortable?: boolean
  menuIsOpen?: boolean
  noOptionsMessage?: (obj: { inputValue: string }) => string
  numberOnly?: boolean
  onChange?: (value: Option | Option[]) => void
  onInputChange?: (val: string) => void
  onMenuClose?: () => void
  onMenuOpen?: () => void
  onMenuScrollToBottom?: () => void
  options: Option[] | OptionGroup[]
  placeholder?: LabelFunction | string
  showError?: boolean
  value?: Option | Option[]
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/ReactSelect/ClearIndicator/index.scss

```text
@import '../../../scss/styles.scss';

@layer payload-default {
  .clear-indicator {
    cursor: pointer;
    display: flex;

    &:focus-visible {
      outline: var(--accessibility-outline);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/ReactSelect/ClearIndicator/index.tsx
Signals: React

```typescript
'use client'
import type { ClearIndicatorProps } from 'react-select'

import React from 'react'

import type { Option as OptionType } from '../types.js'

import { XIcon } from '../../../icons/X/index.js'
import './index.scss'

const baseClass = 'clear-indicator'

export const ClearIndicator: React.FC<ClearIndicatorProps<OptionType, true>> = (props) => {
  const {
    clearValue,
    innerProps: { ref, ...restInnerProps },
  } = props

  return (
    <div
      className={baseClass}
      // TODO Fix this - Broke with React 19 types
      ref={typeof ref === 'string' ? null : ref}
      {...restInnerProps}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          clearValue()
          e.stopPropagation()
        }
      }}
      role="button"
      tabIndex={0}
    >
      <XIcon className={`${baseClass}__icon`} />
    </div>
  )
}
```

--------------------------------------------------------------------------------

````
