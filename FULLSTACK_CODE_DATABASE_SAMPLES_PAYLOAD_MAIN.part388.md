---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 388
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 388 of 695)

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
Location: payload-main/packages/ui/src/fields/Array/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .array-field {
    display: flex;
    flex-direction: column;
    gap: calc(var(--base) / 2);

    &__header {
      display: flex;
      flex-direction: column;
      gap: calc(var(--base) / 2);

      &__header-content {
        display: flex;
        flex-direction: column;
        gap: calc(var(--base) / 4);
      }
    }

    &--has-no-error {
      > .array-field__header .array-field__header-content {
        color: var(--theme-text);
      }
    }

    &__header-content {
      display: flex;
      align-items: center;
      gap: base(0.5);
    }

    &__header-wrap {
      display: flex;
      align-items: flex-end;
      width: 100%;
      justify-content: space-between;
    }

    &__header-actions {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      color: var(--theme-elevation-800);
    }

    &__header-action {
      @extend %btn-reset;
      cursor: pointer;
      margin-left: base(0.5);

      &:hover,
      &:focus-visible {
        text-decoration: underline;
        color: var(--theme-elevation-600);
      }
    }

    &__row-header {
      display: flex;
      align-items: center;
      gap: base(0.5);
      pointer-events: none;
    }

    &__draggable-rows {
      display: flex;
      flex-direction: column;
      gap: calc(var(--base) / 2);
    }

    &__title {
      margin-bottom: 0;
    }

    &__add-row {
      align-self: flex-start;
      margin: 2px 0;
      --btn-color: var(--theme-elevation-400);

      &:hover:not(:disabled) {
        --btn-color: var(--theme-elevation-800);
      }

      &:disabled {
        --btn-color: var(--theme-elevation-300);
      }

      .btn__label {
        color: var(--btn-color);
      }
      .btn__icon {
        border-color: var(--btn-color);
        path {
          stroke: var(--btn-color);
        }
      }
    }
  }

  html[data-theme='light'] {
    .array-field {
      &--has-error {
        > .array-field__header .array-field__header-content {
          color: var(--theme-error-750);
        }
      }
    }
  }

  html[data-theme='dark'] {
    .array-field {
      &--has-error {
        > .array-field__header .array-field__header-content {
          color: var(--theme-error-500);
        }
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/fields/Array/index.tsx
Signals: React

```typescript
'use client'
import type {
  ArrayFieldClientComponent,
  ArrayFieldClientProps,
  ArrayField as ArrayFieldType,
} from 'payload'

import { getTranslation } from '@payloadcms/translations'
import React, { Fragment, useCallback, useMemo } from 'react'
import { toast } from 'sonner'

import type { ClipboardPasteData } from '../../elements/ClipboardAction/types.js'

import { Banner } from '../../elements/Banner/index.js'
import { Button } from '../../elements/Button/index.js'
import { clipboardCopy, clipboardPaste } from '../../elements/ClipboardAction/clipboardUtilities.js'
import { ClipboardAction } from '../../elements/ClipboardAction/index.js'
import {
  mergeFormStateFromClipboard,
  reduceFormStateByPath,
} from '../../elements/ClipboardAction/mergeFormStateFromClipboard.js'
import { DraggableSortableItem } from '../../elements/DraggableSortable/DraggableSortableItem/index.js'
import { DraggableSortable } from '../../elements/DraggableSortable/index.js'
import { ErrorPill } from '../../elements/ErrorPill/index.js'
import { RenderCustomComponent } from '../../elements/RenderCustomComponent/index.js'
import { FieldDescription } from '../../fields/FieldDescription/index.js'
import { FieldError } from '../../fields/FieldError/index.js'
import { FieldLabel } from '../../fields/FieldLabel/index.js'
import { useForm, useFormSubmitted } from '../../forms/Form/context.js'
import { extractRowsAndCollapsedIDs, toggleAllRows } from '../../forms/Form/rowHelpers.js'
import { NullifyLocaleField } from '../../forms/NullifyField/index.js'
import { useField } from '../../forms/useField/index.js'
import { withCondition } from '../../forms/withCondition/index.js'
import { useConfig } from '../../providers/Config/index.js'
import { useDocumentInfo } from '../../providers/DocumentInfo/index.js'
import { useLocale } from '../../providers/Locale/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { scrollToID } from '../../utilities/scrollToID.js'
import { mergeFieldStyles } from '../mergeFieldStyles.js'
import { fieldBaseClass } from '../shared/index.js'
import { ArrayRow } from './ArrayRow.js'
import './index.scss'

const baseClass = 'array-field'

export const ArrayFieldComponent: ArrayFieldClientComponent = (props) => {
  const {
    field,
    field: {
      name,
      type,
      admin: { className, description, isSortable = true } = {},
      fields,
      label,
      localized,
      maxRows,
      minRows: minRowsProp,
      required,
    },
    forceRender = false,
    path: pathFromProps,
    permissions,
    readOnly,
    schemaPath: schemaPathFromProps,
    validate,
  } = props

  const schemaPath = schemaPathFromProps ?? name

  const minRows = minRowsProp ?? (required ? 1 : 0)

  const { setDocFieldPreferences } = useDocumentInfo()
  const {
    addFieldRow,
    dispatchFields,
    getFields,
    moveFieldRow,
    removeFieldRow,
    replaceState,
    setModified,
  } = useForm()
  const submitted = useFormSubmitted()
  const { code: locale } = useLocale()
  const { i18n, t } = useTranslation()

  const {
    config: { localization },
  } = useConfig()

  const editingDefaultLocale = (() => {
    if (localization && localization.fallback) {
      const defaultLocale = localization.defaultLocale
      return locale === defaultLocale
    }

    return true
  })()

  // Handle labeling for Arrays, Global Arrays, and Blocks
  const getLabels = (p: ArrayFieldClientProps): Partial<ArrayFieldType['labels']> => {
    if ('labels' in p && p?.labels) {
      return p.labels
    }

    if ('labels' in p.field && p.field.labels) {
      return { plural: p.field.labels?.plural, singular: p.field.labels?.singular }
    }

    if ('label' in p.field && p.field.label) {
      return { plural: undefined, singular: p.field.label }
    }

    return { plural: t('general:rows'), singular: t('general:row') }
  }

  const labels = getLabels(props)

  const memoizedValidate = useCallback(
    (value, options) => {
      // alternative locales can be null
      if (!editingDefaultLocale && value === null) {
        return true
      }

      if (typeof validate === 'function') {
        return validate(value, { ...options, maxRows, minRows, required })
      }
    },
    [maxRows, minRows, required, validate, editingDefaultLocale],
  )

  const {
    customComponents: { AfterInput, BeforeInput, Description, Error, Label } = {},
    disabled,
    errorPaths,
    path,
    rows = [],
    showError,
    valid,
    value,
  } = useField<number>({
    hasRows: true,
    potentiallyStalePath: pathFromProps,
    validate: memoizedValidate,
  })

  const addRow = useCallback(
    (rowIndex: number) => {
      addFieldRow({
        path,
        rowIndex,
        schemaPath,
      })

      setTimeout(() => {
        scrollToID(`${path}-row-${rowIndex}`)
      }, 0)
    },
    [addFieldRow, path, schemaPath],
  )

  const duplicateRow = useCallback(
    (rowIndex: number) => {
      dispatchFields({ type: 'DUPLICATE_ROW', path, rowIndex })

      setModified(true)

      setTimeout(() => {
        scrollToID(`${path}-row-${rowIndex}`)
      }, 0)
    },
    [dispatchFields, path, setModified],
  )

  const removeRow = useCallback(
    (rowIndex: number) => {
      removeFieldRow({ path, rowIndex })
    },
    [removeFieldRow, path],
  )

  const moveRow = useCallback(
    (moveFromIndex: number, moveToIndex: number) => {
      moveFieldRow({
        moveFromIndex,
        moveToIndex,
        path,
      })
    },
    [path, moveFieldRow],
  )

  const toggleCollapseAll = useCallback(
    (collapsed: boolean) => {
      const { collapsedIDs, updatedRows } = toggleAllRows({
        collapsed,
        rows,
      })
      setDocFieldPreferences(path, { collapsed: collapsedIDs })
      dispatchFields({ type: 'SET_ALL_ROWS_COLLAPSED', path, updatedRows })
    },
    [dispatchFields, path, rows, setDocFieldPreferences],
  )

  const setCollapse = useCallback(
    (rowID: string, collapsed: boolean) => {
      const { collapsedIDs, updatedRows } = extractRowsAndCollapsedIDs({
        collapsed,
        rowID,
        rows,
      })

      dispatchFields({ type: 'SET_ROW_COLLAPSED', path, updatedRows })
      setDocFieldPreferences(path, { collapsed: collapsedIDs })
    },
    [dispatchFields, path, rows, setDocFieldPreferences],
  )

  const copyRow = useCallback(
    (rowIndex: number) => {
      const formState = { ...getFields() }
      const clipboardResult = clipboardCopy({
        type,
        fields,
        getDataToCopy: () =>
          reduceFormStateByPath({
            formState,
            path,
            rowIndex,
          }),
        path,
        rowIndex,
        t,
      })

      if (typeof clipboardResult === 'string') {
        toast.error(clipboardResult)
      } else {
        toast.success(t('general:copied'))
      }
    },
    [fields, getFields, path, t, type],
  )

  const pasteRow = useCallback(
    (rowIndex: number) => {
      const formState = { ...getFields() }
      const pasteArgs = {
        onPaste: (dataFromClipboard: ClipboardPasteData) => {
          const newState = mergeFormStateFromClipboard({
            dataFromClipboard,
            formState,
            path,
            rowIndex,
          })
          replaceState(newState)
          setModified(true)
        },
        path,
        schemaFields: fields,
        t,
      }

      const clipboardResult = clipboardPaste(pasteArgs)

      if (typeof clipboardResult === 'string') {
        toast.error(clipboardResult)
      }
    },
    [fields, getFields, path, replaceState, setModified, t],
  )

  const pasteField = useCallback(
    (dataFromClipboard: ClipboardPasteData) => {
      const formState = { ...getFields() }
      const newState = mergeFormStateFromClipboard({
        dataFromClipboard,
        formState,
        path,
      })
      replaceState(newState)
      setModified(true)
    },
    [getFields, path, replaceState, setModified],
  )

  const getDataToCopy = useCallback(
    () =>
      reduceFormStateByPath({
        formState: { ...getFields() },
        path,
      }),
    [getFields, path],
  )

  const hasMaxRows = maxRows && rows.length >= maxRows

  const fieldErrorCount = errorPaths.length
  const fieldHasErrors = submitted && errorPaths.length > 0

  const showRequired = (readOnly || disabled) && rows.length === 0
  const showMinRows = (rows.length && rows.length < minRows) || (required && rows.length === 0)

  const styles = useMemo(() => mergeFieldStyles(field), [field])

  return (
    <div
      className={[
        fieldBaseClass,
        baseClass,
        className,
        fieldHasErrors ? `${baseClass}--has-error` : `${baseClass}--has-no-error`,
      ]
        .filter(Boolean)
        .join(' ')}
      id={`field-${path.replace(/\./g, '__')}`}
      style={styles}
    >
      {showError && (
        <RenderCustomComponent
          CustomComponent={Error}
          Fallback={<FieldError path={path} showError={showError} />}
        />
      )}
      <header className={`${baseClass}__header`}>
        <div className={`${baseClass}__header-wrap`}>
          <div className={`${baseClass}__header-content`}>
            <h3 className={`${baseClass}__title`}>
              <RenderCustomComponent
                CustomComponent={Label}
                Fallback={
                  <FieldLabel
                    as="span"
                    label={label}
                    localized={localized}
                    path={path}
                    required={required}
                  />
                }
              />
            </h3>
            {fieldHasErrors && fieldErrorCount > 0 && (
              <ErrorPill count={fieldErrorCount} i18n={i18n} withMessage />
            )}
          </div>
          <ul className={`${baseClass}__header-actions`}>
            {rows?.length > 0 && (
              <Fragment>
                <li>
                  <button
                    className={`${baseClass}__header-action`}
                    onClick={() => toggleCollapseAll(true)}
                    type="button"
                  >
                    {t('fields:collapseAll')}
                  </button>
                </li>
                <li>
                  <button
                    className={`${baseClass}__header-action`}
                    onClick={() => toggleCollapseAll(false)}
                    type="button"
                  >
                    {t('fields:showAll')}
                  </button>
                </li>
              </Fragment>
            )}
            <li>
              <ClipboardAction
                allowCopy={rows?.length > 0}
                allowPaste={!readOnly}
                className={`${baseClass}__header-action`}
                disabled={disabled}
                fields={fields}
                getDataToCopy={getDataToCopy}
                onPaste={pasteField}
                path={path}
                type={type}
              />
            </li>
          </ul>
        </div>
        <RenderCustomComponent
          CustomComponent={Description}
          Fallback={<FieldDescription description={description} path={path} />}
        />
      </header>
      <NullifyLocaleField
        fieldValue={value}
        localized={localized}
        path={path}
        readOnly={readOnly}
      />
      {BeforeInput}
      {(rows?.length > 0 || (!valid && (showRequired || showMinRows))) && (
        <DraggableSortable
          className={`${baseClass}__draggable-rows`}
          ids={rows.map((row) => row.id)}
          onDragEnd={({ moveFromIndex, moveToIndex }) => moveRow(moveFromIndex, moveToIndex)}
        >
          {rows.map((rowData, i) => {
            const { id: rowID, isLoading } = rowData

            const rowPath = `${path}.${i}`

            const rowErrorCount = errorPaths?.filter((errorPath) =>
              errorPath.startsWith(rowPath + '.'),
            ).length

            return (
              <DraggableSortableItem
                disabled={readOnly || disabled || !isSortable}
                id={rowID}
                key={rowID}
              >
                {(draggableSortableItemProps) => (
                  <ArrayRow
                    {...draggableSortableItemProps}
                    addRow={addRow}
                    copyRow={copyRow}
                    CustomRowLabel={rows?.[i]?.customComponents?.RowLabel}
                    duplicateRow={duplicateRow}
                    errorCount={rowErrorCount}
                    fields={fields}
                    forceRender={forceRender}
                    hasMaxRows={hasMaxRows}
                    isLoading={isLoading}
                    isSortable={isSortable}
                    labels={labels}
                    moveRow={moveRow}
                    parentPath={path}
                    pasteRow={pasteRow}
                    path={rowPath}
                    permissions={permissions}
                    readOnly={readOnly || disabled}
                    removeRow={removeRow}
                    row={rowData}
                    rowCount={rows?.length}
                    rowIndex={i}
                    schemaPath={schemaPath}
                    setCollapse={setCollapse}
                  />
                )}
              </DraggableSortableItem>
            )
          })}
          {!valid && (
            <React.Fragment>
              {showRequired && (
                <Banner>
                  {t('validation:fieldHasNo', { label: getTranslation(labels.plural, i18n) })}
                </Banner>
              )}
              {showMinRows && (
                <Banner type="error">
                  {t('validation:requiresAtLeast', {
                    count: minRows,
                    label:
                      getTranslation(minRows > 1 ? labels.plural : labels.singular, i18n) ||
                      t(minRows > 1 ? 'general:rows' : 'general:row'),
                  })}
                </Banner>
              )}
            </React.Fragment>
          )}
        </DraggableSortable>
      )}
      {!hasMaxRows && !readOnly && (
        <Button
          buttonStyle="icon-label"
          className={`${baseClass}__add-row`}
          disabled={disabled}
          icon="plus"
          iconPosition="left"
          iconStyle="with-border"
          onClick={() => {
            void addRow(value || 0)
          }}
        >
          {t('fields:addLabel', { label: getTranslation(labels.singular, i18n) })}
        </Button>
      )}
      {AfterInput}
    </div>
  )
}

export const ArrayField = withCondition(ArrayFieldComponent)
```

--------------------------------------------------------------------------------

---[FILE: BlockRow.tsx]---
Location: payload-main/packages/ui/src/fields/Blocks/BlockRow.tsx
Signals: React

```typescript
'use client'
import type { ClientBlock, ClientField, Labels, Row, SanitizedFieldPermissions } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import React from 'react'

import type { UseDraggableSortableReturn } from '../../elements/DraggableSortable/useDraggableSortable/types.js'
import type { RenderFieldsProps } from '../../forms/RenderFields/types.js'

import { Collapsible } from '../../elements/Collapsible/index.js'
import { ErrorPill } from '../../elements/ErrorPill/index.js'
import { Pill } from '../../elements/Pill/index.js'
import { ShimmerEffect } from '../../elements/ShimmerEffect/index.js'
import { useFormSubmitted } from '../../forms/Form/context.js'
import { RenderFields } from '../../forms/RenderFields/index.js'
import { RowLabel } from '../../forms/RowLabel/index.js'
import { useThrottledValue } from '../../hooks/useThrottledValue.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { RowActions } from './RowActions.js'
import { SectionTitle } from './SectionTitle/index.js'

const baseClass = 'blocks-field'

type BlocksFieldProps = {
  addRow: (rowIndex: number, blockType: string) => Promise<void> | void
  block: ClientBlock
  blocks: (ClientBlock | string)[] | ClientBlock[]
  copyRow: (rowIndex: number) => void
  duplicateRow: (rowIndex: number) => void
  errorCount: number
  fields: ClientField[]
  hasMaxRows?: boolean
  isLoading?: boolean
  isSortable?: boolean
  Label?: React.ReactNode
  labels: Labels
  moveRow: (fromIndex: number, toIndex: number) => void
  parentPath: string
  pasteRow: (rowIndex: number) => void
  path: string
  permissions: SanitizedFieldPermissions
  readOnly: boolean
  removeRow: (rowIndex: number) => void
  row: Row
  rowCount: number
  rowIndex: number
  schemaPath: string
  setCollapse: (id: string, collapsed: boolean) => void
} & UseDraggableSortableReturn

export const BlockRow: React.FC<BlocksFieldProps> = ({
  addRow,
  attributes,
  block,
  blocks,
  copyRow,
  duplicateRow,
  errorCount,
  fields,
  hasMaxRows,
  isLoading: isLoadingFromProps,
  isSortable,
  Label,
  labels,
  listeners,
  moveRow,
  parentPath,
  pasteRow,
  path,
  permissions,
  readOnly,
  removeRow,
  row,
  rowCount,
  rowIndex,
  schemaPath,
  setCollapse,
  setNodeRef,
  transform,
}) => {
  const isLoading = useThrottledValue(isLoadingFromProps, 500)

  const { i18n } = useTranslation()
  const hasSubmitted = useFormSubmitted()

  const fieldHasErrors = hasSubmitted && errorCount > 0

  const showBlockName = !block.admin?.disableBlockName

  const classNames = [
    `${baseClass}__row`,
    fieldHasErrors ? `${baseClass}__row--has-errors` : `${baseClass}__row--no-errors`,
  ]
    .filter(Boolean)
    .join(' ')

  let blockPermissions: RenderFieldsProps['permissions'] = true

  if (permissions === true) {
    blockPermissions = true
  } else {
    const permissionsBlockSpecific = permissions?.blocks?.[block.slug] || permissions?.blocks
    if (permissionsBlockSpecific === true) {
      blockPermissions = true
    } else if (permissionsBlockSpecific?.fields) {
      blockPermissions = permissionsBlockSpecific.fields
    } else {
      // Check if we should fall back to read-only mode based on permission structure
      // This handles cases where field-level access control exists but block permissions were sanitized
      if (typeof permissions === 'object' && permissions && !permissionsBlockSpecific) {
        // If permissions object exists but has no block-specific permissions,
        // check if it has any restrictive characteristics
        const hasReadPermission = permissions.read === true
        const missingCreateOrUpdate = !permissions.create || !permissions.update
        const hasRestrictiveStructure =
          hasReadPermission &&
          (missingCreateOrUpdate ||
            (typeof permissions === 'object' &&
              Object.keys(permissions).length === 1 &&
              permissions.read))

        if (hasRestrictiveStructure) {
          blockPermissions = { read: true }
        } else {
          blockPermissions = permissionsBlockSpecific?.fields
        }
      } else {
        blockPermissions = permissionsBlockSpecific?.fields
      }
    }
  }

  return (
    <div
      id={`${parentPath?.split('.').join('-')}-row-${rowIndex}`}
      key={`${parentPath}-row-${rowIndex}`}
      ref={setNodeRef}
      style={{
        transform,
      }}
    >
      <Collapsible
        actions={
          !readOnly ? (
            <RowActions
              addRow={addRow}
              blocks={blocks}
              blockType={row.blockType}
              copyRow={copyRow}
              duplicateRow={duplicateRow}
              fields={block.fields}
              hasMaxRows={hasMaxRows}
              isSortable={isSortable}
              labels={labels}
              moveRow={moveRow}
              pasteRow={pasteRow}
              removeRow={removeRow}
              rowCount={rowCount}
              rowIndex={rowIndex}
            />
          ) : undefined
        }
        className={classNames}
        collapsibleStyle={fieldHasErrors ? 'error' : 'default'}
        dragHandleProps={
          isSortable
            ? {
                id: row.id,
                attributes,
                listeners,
              }
            : undefined
        }
        header={
          isLoading ? (
            <ShimmerEffect height="1rem" width="8rem" />
          ) : (
            <div className={`${baseClass}__block-header`}>
              <RowLabel
                CustomComponent={Label}
                label={
                  <>
                    <span className={`${baseClass}__block-number`}>
                      {String(rowIndex + 1).padStart(2, '0')}
                    </span>
                    <Pill
                      className={`${baseClass}__block-pill ${baseClass}__block-pill-${row.blockType}`}
                      pillStyle="white"
                      size="small"
                    >
                      {getTranslation(block.labels.singular, i18n)}
                    </Pill>
                    {showBlockName && (
                      <SectionTitle path={`${path}.blockName`} readOnly={readOnly} />
                    )}
                  </>
                }
                path={path}
                rowNumber={rowIndex}
              />
              {fieldHasErrors && <ErrorPill count={errorCount} i18n={i18n} withMessage />}
            </div>
          )
        }
        isCollapsed={row.collapsed}
        key={row.id}
        onToggle={(collapsed) => setCollapse(row.id, collapsed)}
      >
        {isLoading ? (
          <ShimmerEffect />
        ) : (
          <RenderFields
            className={`${baseClass}__fields`}
            fields={fields}
            margins="small"
            parentIndexPath=""
            parentPath={path}
            parentSchemaPath={schemaPath}
            permissions={blockPermissions}
            readOnly={readOnly}
          />
        )}
      </Collapsible>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/fields/Blocks/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .blocks-field {
    display: flex;
    flex-direction: column;
    gap: calc(var(--base) / 2);

    &__header {
      h3 {
        margin: 0;
      }
    }

    &__header-wrap {
      display: flex;
      align-items: flex-end;
      width: 100%;
      justify-content: space-between;
    }

    &__heading-with-error {
      display: flex;
      align-items: center;
      gap: base(0.5);
    }

    &--has-no-error {
      > .array-field__header .array-field__heading-with-error {
        color: var(--theme-text);
      }
    }

    &--has-error {
      > .array-field__header {
        color: var(--theme-error-500);
      }
    }

    &__error-pill {
      align-self: center;
    }

    &__header-actions {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
    }

    &__header-action {
      @extend %btn-reset;
      cursor: pointer;
      margin-left: base(0.5);

      &:hover,
      &:focus-visible {
        text-decoration: underline;
      }
    }

    &__block-header {
      display: inline-flex;
      max-width: 100%;
      width: 100%;
      overflow: hidden;
      gap: base(0.375);
    }

    &__block-number {
      flex-shrink: 0;
    }

    &__block-pill {
      flex-shrink: 0;
      display: block;
      line-height: unset;
    }

    &__rows {
      display: flex;
      flex-direction: column;
      gap: calc(var(--base) / 2);
    }

    &__drawer-toggler {
      background-color: transparent;
      margin: 0;
      padding: 0;
      border: none;
      align-self: flex-start;

      .btn {
        color: var(--theme-elevation-400);
        margin: 0;

        &:hover {
          color: var(--theme-elevation-800);
        }
      }
    }
  }

  html[data-theme='light'] {
    .blocks-field--has-error {
      .section-title__input,
      .blocks-field__heading-with-error {
        color: var(--theme-error-750);
      }

      .blocks-field__row--no-errors,
      .blocks-field--has-no-error {
        .section-title__input,
        .blocks-field__heading-with-error {
          color: var(--theme-text);
        }
      }
    }
  }

  html[data-theme='dark'] {
    .blocks-field--has-error {
      .section-title__input,
      .blocks-field__heading-with-error {
        color: var(--theme-error-500);
      }

      .blocks-field__row--no-errors,
      .blocks-field--has-no-error {
        .section-title__input,
        .blocks-field__heading-with-error {
          color: var(--theme-text);
        }
      }
    }
  }
}
```

--------------------------------------------------------------------------------

````
