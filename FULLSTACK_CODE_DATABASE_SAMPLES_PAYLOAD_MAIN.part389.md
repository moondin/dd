---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 389
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 389 of 695)

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
Location: payload-main/packages/ui/src/fields/Blocks/index.tsx
Signals: React

```typescript
'use client'
import type { BlocksFieldClientComponent, ClientBlock } from 'payload'

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
import { DrawerToggler } from '../../elements/Drawer/index.js'
import { useDrawerSlug } from '../../elements/Drawer/useDrawerSlug.js'
import { ErrorPill } from '../../elements/ErrorPill/index.js'
import { RenderCustomComponent } from '../../elements/RenderCustomComponent/index.js'
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
import './index.scss'
import { FieldDescription } from '../FieldDescription/index.js'
import { FieldError } from '../FieldError/index.js'
import { FieldLabel } from '../FieldLabel/index.js'
import { mergeFieldStyles } from '../mergeFieldStyles.js'
import { fieldBaseClass } from '../shared/index.js'
import { BlockRow } from './BlockRow.js'
import { BlocksDrawer } from './BlocksDrawer/index.js'

const baseClass = 'blocks-field'

const BlocksFieldComponent: BlocksFieldClientComponent = (props) => {
  const { i18n, t } = useTranslation()

  const {
    field,
    field: {
      name,
      type,
      admin: { className, description, isSortable = true } = {},
      blockReferences,
      blocks,
      label,
      labels: labelsFromProps,
      localized,
      maxRows,
      minRows: minRowsProp,
      required,
    },
    path: pathFromProps,
    permissions,
    readOnly,
    schemaPath: schemaPathFromProps,
    validate,
  } = props

  const schemaPath = schemaPathFromProps ?? name

  const minRows = (minRowsProp ?? required) ? 1 : 0

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
  const { code: locale } = useLocale()
  const {
    config: { localization },
    config,
  } = useConfig()
  const drawerSlug = useDrawerSlug('blocks-drawer')
  const submitted = useFormSubmitted()

  const labels = {
    plural: t('fields:blocks'),
    singular: t('fields:block'),
    ...labelsFromProps,
  }

  const editingDefaultLocale = (() => {
    if (localization && localization.fallback) {
      const defaultLocale = localization.defaultLocale
      return locale === defaultLocale
    }

    return true
  })()

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
    blocksFilterOptions,
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

  const { clientBlocks, clientBlocksAfterFilter } = useMemo(() => {
    let resolvedBlocks: ClientBlock[] = []

    if (!blockReferences) {
      resolvedBlocks = blocks
    } else {
      for (const blockReference of blockReferences) {
        const block =
          typeof blockReference === 'string' ? config.blocksMap[blockReference] : blockReference
        if (block) {
          resolvedBlocks.push(block)
        }
      }
    }

    if (Array.isArray(blocksFilterOptions)) {
      const clientBlocksAfterFilter = resolvedBlocks.filter((block) => {
        const blockSlug = typeof block === 'string' ? block : block.slug
        return blocksFilterOptions.includes(blockSlug)
      })

      return {
        clientBlocks: resolvedBlocks,
        clientBlocksAfterFilter,
      }
    }
    return {
      clientBlocks: resolvedBlocks,
      clientBlocksAfterFilter: resolvedBlocks,
    }
  }, [blockReferences, blocks, blocksFilterOptions, config.blocksMap])

  const addRow = useCallback(
    (rowIndex: number, blockType: string) => {
      addFieldRow({
        blockType,
        path,
        rowIndex,
        schemaPath,
      })

      setTimeout(() => {
        scrollToID(`${path}-row-${rowIndex + 1}`)
      }, 0)
    },
    [addFieldRow, path, schemaPath],
  )

  const duplicateRow = useCallback(
    (rowIndex: number) => {
      dispatchFields({ type: 'DUPLICATE_ROW', path, rowIndex })
      setModified(true)

      setTimeout(() => {
        scrollToID(`${path}-row-${rowIndex + 1}`)
      }, 0)
    },
    [dispatchFields, path, setModified],
  )

  const removeRow = useCallback(
    (rowIndex: number) => {
      removeFieldRow({
        path,
        rowIndex,
      })
    },
    [path, removeFieldRow],
  )

  const moveRow = useCallback(
    (moveFromIndex: number, moveToIndex: number) => {
      moveFieldRow({ moveFromIndex, moveToIndex, path })
    },
    [moveFieldRow, path],
  )

  const toggleCollapseAll = useCallback(
    (collapsed: boolean) => {
      const { collapsedIDs, updatedRows } = toggleAllRows({
        collapsed,
        rows,
      })

      dispatchFields({ type: 'SET_ALL_ROWS_COLLAPSED', path, updatedRows })
      setDocFieldPreferences(path, { collapsed: collapsedIDs })
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
      const clipboardResult = clipboardCopy({
        type,
        blocks: clientBlocks,
        getDataToCopy: () =>
          reduceFormStateByPath({
            formState: { ...getFields() },
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
    [clientBlocks, path, t, type, getFields],
  )

  const pasteRow = useCallback(
    (rowIndex: number) => {
      const pasteArgs = {
        onPaste: (dataFromClipboard: ClipboardPasteData) => {
          const formState = { ...getFields() }
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
        schemaBlocks: clientBlocks,
        t,
      }

      const clipboardResult = clipboardPaste(pasteArgs)

      if (typeof clipboardResult === 'string') {
        toast.error(clipboardResult)
      }
    },
    [clientBlocks, getFields, path, replaceState, setModified, t],
  )

  const pasteBlocks = useCallback(
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

  const hasMaxRows = maxRows && rows.length >= maxRows

  const fieldErrorCount = errorPaths.length
  const fieldHasErrors = submitted && fieldErrorCount + (valid ? 0 : 1) > 0

  const showMinRows = rows.length < minRows || (required && rows.length === 0)
  const showRequired = readOnly && rows.length === 0

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
      id={`field-${path?.replace(/\./g, '__')}`}
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
          <div className={`${baseClass}__heading-with-error`}>
            <h3>
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
            {rows.length > 0 && (
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
                blocks={clientBlocks}
                className={`${baseClass}__header-action`}
                disabled={disabled}
                getDataToCopy={() =>
                  reduceFormStateByPath({
                    formState: { ...getFields() },
                    path,
                  })
                }
                onPaste={pasteBlocks}
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
      {BeforeInput}
      <NullifyLocaleField
        fieldValue={value}
        localized={localized}
        path={path}
        readOnly={readOnly}
      />
      {(rows.length > 0 || (!valid && (showRequired || showMinRows))) && (
        <DraggableSortable
          className={`${baseClass}__rows`}
          ids={rows.map((row) => row.id)}
          onDragEnd={({ moveFromIndex, moveToIndex }) => moveRow(moveFromIndex, moveToIndex)}
        >
          {rows.map((row, i) => {
            const { blockType, isLoading } = row

            const blockConfig: ClientBlock =
              config.blocksMap[blockType] ?? clientBlocks.find((block) => block.slug === blockType)

            if (blockConfig) {
              const rowPath = `${path}.${i}`

              const rowErrorCount = errorPaths.filter((errorPath) =>
                errorPath.startsWith(rowPath + '.'),
              ).length

              return (
                <DraggableSortableItem
                  disabled={readOnly || disabled || !isSortable}
                  id={row.id}
                  key={row.id}
                >
                  {(draggableSortableItemProps) => (
                    <BlockRow
                      {...draggableSortableItemProps}
                      addRow={addRow}
                      block={blockConfig}
                      // Pass all blocks, not just clientBlocksAfterFilter, as existing blocks should still be displayed even if they don't match the new filter
                      blocks={clientBlocks}
                      copyRow={copyRow}
                      duplicateRow={duplicateRow}
                      errorCount={rowErrorCount}
                      fields={blockConfig.fields}
                      hasMaxRows={hasMaxRows}
                      isLoading={isLoading}
                      isSortable={isSortable}
                      Label={rows?.[i]?.customComponents?.RowLabel}
                      labels={labels}
                      moveRow={moveRow}
                      parentPath={path}
                      pasteRow={pasteRow}
                      path={rowPath}
                      permissions={permissions}
                      readOnly={readOnly || disabled}
                      removeRow={removeRow}
                      row={row}
                      rowCount={rows.length}
                      rowIndex={i}
                      schemaPath={schemaPath + blockConfig.slug}
                      setCollapse={setCollapse}
                    />
                  )}
                </DraggableSortableItem>
              )
            }

            return null
          })}
          {!editingDefaultLocale && (
            <React.Fragment>
              {showMinRows && (
                <Banner type="error">
                  {t('validation:requiresAtLeast', {
                    count: minRows,
                    label:
                      getTranslation(minRows > 1 ? labels.plural : labels.singular, i18n) ||
                      t(minRows > 1 ? 'general:row' : 'general:rows'),
                  })}
                </Banner>
              )}
              {showRequired && (
                <Banner>
                  {t('validation:fieldHasNo', { label: getTranslation(labels.plural, i18n) })}
                </Banner>
              )}
            </React.Fragment>
          )}
        </DraggableSortable>
      )}
      {!hasMaxRows && (
        <Fragment>
          <DrawerToggler
            className={`${baseClass}__drawer-toggler`}
            disabled={readOnly || disabled}
            slug={drawerSlug}
          >
            <Button
              buttonStyle="icon-label"
              disabled={readOnly || disabled}
              el="span"
              icon="plus"
              iconPosition="left"
              iconStyle="with-border"
            >
              {t('fields:addLabel', { label: getTranslation(labels.singular, i18n) })}
            </Button>
          </DrawerToggler>
          <BlocksDrawer
            addRow={addRow}
            addRowIndex={rows?.length || 0}
            // Only allow choosing filtered blocks
            blocks={clientBlocksAfterFilter}
            drawerSlug={drawerSlug}
            labels={labels}
          />
        </Fragment>
      )}
      {AfterInput}
    </div>
  )
}

export const BlocksField = withCondition(BlocksFieldComponent)
```

--------------------------------------------------------------------------------

---[FILE: RowActions.tsx]---
Location: payload-main/packages/ui/src/fields/Blocks/RowActions.tsx
Signals: React

```typescript
'use client'
import type { ClientBlock, ClientField, Labels } from 'payload'

import { useModal } from '@faceless-ui/modal'
import React from 'react'

import { ArrayAction } from '../../elements/ArrayAction/index.js'
import { useDrawerSlug } from '../../elements/Drawer/useDrawerSlug.js'
import { BlocksDrawer } from './BlocksDrawer/index.js'

export const RowActions: React.FC<{
  readonly addRow: (rowIndex: number, blockType: string) => Promise<void> | void
  readonly blocks: (ClientBlock | string)[]
  readonly blockType: string
  readonly copyRow: (rowIndex: number) => void
  readonly duplicateRow: (rowIndex: number, blockType: string) => void
  readonly fields: ClientField[]
  readonly hasMaxRows?: boolean
  readonly isSortable?: boolean
  readonly labels: Labels
  readonly moveRow: (fromIndex: number, toIndex: number) => void
  readonly pasteRow: (rowIndex: number) => void
  readonly removeRow: (rowIndex: number) => void
  readonly rowCount: number
  readonly rowIndex: number
}> = (props) => {
  const {
    addRow,
    blocks,
    blockType,
    copyRow,
    duplicateRow,
    hasMaxRows,
    isSortable,
    labels,
    moveRow,
    pasteRow,
    removeRow,
    rowCount,
    rowIndex,
  } = props

  const { closeModal, openModal } = useModal()
  const drawerSlug = useDrawerSlug('blocks-drawer')

  const [indexToAdd, setIndexToAdd] = React.useState<null | number>(null)

  return (
    <React.Fragment>
      <BlocksDrawer
        addRow={(_, rowBlockType) => {
          if (typeof addRow === 'function') {
            void addRow(indexToAdd, rowBlockType)
          }
          closeModal(drawerSlug)
        }}
        addRowIndex={rowIndex}
        blocks={blocks}
        drawerSlug={drawerSlug}
        labels={labels}
      />
      <ArrayAction
        addRow={(index) => {
          setIndexToAdd(index)
          openModal(drawerSlug)
        }}
        copyRow={copyRow}
        duplicateRow={() => duplicateRow(rowIndex, blockType)}
        hasMaxRows={hasMaxRows}
        index={rowIndex}
        isSortable={isSortable}
        moveRow={moveRow}
        pasteRow={pasteRow}
        removeRow={removeRow}
        rowCount={rowCount}
      />
    </React.Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/fields/Blocks/BlocksDrawer/index.tsx
Signals: React

```typescript
'use client'
import type { ClientBlock, Labels } from 'payload'

import { useModal } from '@faceless-ui/modal'
import { getTranslation } from '@payloadcms/translations'
import React, { useEffect } from 'react'

import { Drawer } from '../../../elements/Drawer/index.js'
import { useTranslation } from '../../../providers/Translation/index.js'
import { BlockSelector } from '../BlockSelector/index.js'

export type Props = {
  readonly addRow: (index: number, blockType?: string) => Promise<void> | void
  readonly addRowIndex: number
  readonly blocks: (ClientBlock | string)[]
  readonly drawerSlug: string
  readonly labels: Labels
}

export const BlocksDrawer: React.FC<Props> = (props) => {
  const { addRow, addRowIndex, blocks, drawerSlug, labels } = props

  const { closeModal, isModalOpen } = useModal()
  const { i18n, t } = useTranslation()
  const [searchTermOverride, setSearchTermOverride] = React.useState('')

  useEffect(() => {
    if (!isModalOpen(drawerSlug)) {
      setSearchTermOverride('')
    }
  }, [isModalOpen, drawerSlug])

  return (
    <Drawer
      slug={drawerSlug}
      title={t('fields:addLabel', { label: getTranslation(labels.singular, i18n) })}
    >
      <BlockSelector
        blocks={blocks}
        onSelect={(slug) => {
          void addRow(addRowIndex, slug)
          closeModal(drawerSlug)
        }}
        searchTerm={searchTermOverride}
      />
    </Drawer>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/fields/Blocks/BlockSelector/index.scss

```text
@import '../../../scss/styles.scss';

@layer payload-default {
  .blocks-drawer {
    &__blocks-wrapper {
      padding-top: base(1.5);
    }

    &__blocks {
      position: relative;
      padding: 0;
      list-style: none;
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: base(1);
    }

    &__default-image {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      aspect-ratio: 3 / 2;
      overflow: hidden;

      img,
      svg {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    &__block-groups {
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: base(1.5);
    }

    &__block-group {
      list-style: none;
    }

    &__block-group-label {
      padding-bottom: base(0.5);
    }

    &__block-group-none {
      order: 1;
      padding-top: base(1.5);
      border-top: 1px solid var(--theme-border-color);

      &:only-child {
        padding-top: 0;
        border-top: 0;
      }
    }

    @include large-break {
      &__blocks {
        grid-template-columns: repeat(5, 1fr);
      }
    }

    @include mid-break {
      &__blocks-wrapper {
        padding-top: base(1.75);
      }

      &__blocks {
        grid-template-columns: repeat(3, 1fr);
      }

      &__block-groups {
        gap: base(1.75);
      }

      &__block-group-none {
        padding-top: base(1.75);
      }
    }

    @include small-break {
      &__blocks-wrapper {
        padding-top: base(0.75);
      }

      &__blocks {
        grid-template-columns: repeat(2, 1fr);
      }

      &__block-groups {
        gap: base(0.75);
      }

      &__block-group-none {
        padding-top: base(0.75);
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/fields/Blocks/BlockSelector/index.tsx
Signals: React

```typescript
'use client'
import type { I18nClient } from '@payloadcms/translations'
import type { ClientBlock } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import React, { Fragment, useEffect, useMemo, useState } from 'react'

import { ThumbnailCard } from '../../../elements/ThumbnailCard/index.js'
import { DefaultBlockImage } from '../../../graphics/DefaultBlockImage/index.js'
import { useControllableState } from '../../../hooks/useControllableState.js'
import { useConfig } from '../../../providers/Config/index.js'
import { useTranslation } from '../../../providers/Translation/index.js'
import { BlockSearch } from './BlockSearch/index.js'
import './index.scss'

export type Props = {
  readonly blocks: (ClientBlock | string)[]
  readonly onSelect?: (blockType: string) => void
  /**
   * Control the search term state externally
   */
  searchTerm?: string
}

const baseClass = 'blocks-drawer'

const getBlockLabel = (block: ClientBlock, i18n: I18nClient) => {
  if (typeof block.labels.singular === 'string') {
    return block.labels.singular.toLowerCase()
  }
  if (typeof block.labels.singular === 'object') {
    return getTranslation(block.labels.singular, i18n).toLowerCase()
  }
  return ''
}

export const BlockSelector: React.FC<Props> = (props) => {
  const { blocks, onSelect, searchTerm: searchTermFromProps } = props

  const [searchTerm, setSearchTerm] = useControllableState(searchTermFromProps ?? '')

  const [filteredBlocks, setFilteredBlocks] = useState(blocks)
  const { i18n } = useTranslation()
  const { config } = useConfig()

  const blockGroups = useMemo(() => {
    const groups: Record<string, (ClientBlock | string)[]> = {
      _none: [],
    }

    filteredBlocks.forEach((block) => {
      if (typeof block === 'object' && block.admin?.group) {
        const group = block.admin.group
        const label = typeof group === 'string' ? group : getTranslation(group, i18n)

        if (Object.hasOwn(groups, label)) {
          groups[label].push(block)
        } else {
          groups[label] = [block]
        }
      } else {
        groups._none.push(block)
      }
    })

    return groups
  }, [filteredBlocks, i18n])

  useEffect(() => {
    const searchTermToUse = searchTerm.toLowerCase()

    const matchingBlocks = blocks?.reduce((matchedBlocks, _block) => {
      const block = typeof _block === 'string' ? config.blocksMap[_block] : _block
      const blockLabel = getBlockLabel(block, i18n)
      if (blockLabel.includes(searchTermToUse)) {
        matchedBlocks.push(block)
      }
      return matchedBlocks
    }, [])

    setFilteredBlocks(matchingBlocks)
  }, [searchTerm, blocks, i18n, config.blocksMap])

  return (
    <Fragment>
      <BlockSearch setSearchTerm={setSearchTerm} />
      <div className={`${baseClass}__blocks-wrapper`}>
        <ul className={`${baseClass}__block-groups`}>
          {Object.entries(blockGroups).map(([groupLabel, groupBlocks]) =>
            !groupBlocks.length ? null : (
              <li
                className={[
                  `${baseClass}__block-group`,
                  groupLabel === '_none' && `${baseClass}__block-group-none`,
                ]
                  .filter(Boolean)
                  .join(' ')}
                key={groupLabel}
              >
                {groupLabel !== '_none' && (
                  <h3 className={`${baseClass}__block-group-label`}>{groupLabel}</h3>
                )}
                <ul className={`${baseClass}__blocks`}>
                  {groupBlocks.map((_block, index) => {
                    const block = typeof _block === 'string' ? config.blocksMap[_block] : _block

                    const { slug, imageAltText, imageURL, labels: blockLabels } = block

                    return (
                      <li className={`${baseClass}__block`} key={index}>
                        <ThumbnailCard
                          alignLabel="center"
                          label={getTranslation(blockLabels?.singular, i18n)}
                          onClick={() => {
                            if (typeof onSelect === 'function') {
                              onSelect(slug)
                            }
                          }}
                          thumbnail={
                            <div className={`${baseClass}__default-image`}>
                              {imageURL ? (
                                <img alt={imageAltText} src={imageURL} />
                              ) : (
                                <DefaultBlockImage />
                              )}
                            </div>
                          }
                        />
                      </li>
                    )
                  })}
                </ul>
              </li>
            ),
          )}
        </ul>
      </div>
    </Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/fields/Blocks/BlockSelector/BlockSearch/index.scss

```text
@import '../../../../scss/styles.scss';

$icon-width: base(2);
$icon-margin: base(0.25);

@layer payload-default {
  .block-search {
    position: sticky;
    top: 0;
    display: flex;
    width: 100%;
    align-items: center;
    z-index: 1;

    &__input {
      @include formInput;
    }

    .icon--search {
      position: absolute;
      top: 50%;
      transform: translate3d(0, -50%, 0);
      right: 0;
      width: $icon-width;
      margin: 0 $icon-margin;

      .stroke {
        stroke: var(--theme-elevation-300);
      }
    }

    @include mid-break {
      &__input {
        margin-bottom: 0;
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/fields/Blocks/BlockSelector/BlockSearch/index.tsx
Signals: React

```typescript
'use client'
import React from 'react'

import { SearchIcon } from '../../../../icons/Search/index.js'
import { useTranslation } from '../../../../providers/Translation/index.js'
import './index.scss'

const baseClass = 'block-search'

export const BlockSearch: React.FC<{ setSearchTerm: (term: string) => void }> = (props) => {
  const { setSearchTerm } = props
  const { t } = useTranslation()

  const handleChange = (e) => {
    setSearchTerm(e.target.value)
  }

  return (
    <div className={baseClass}>
      <input
        className={`${baseClass}__input`}
        onChange={handleChange}
        placeholder={t('fields:searchForBlock')}
      />
      <SearchIcon />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/fields/Blocks/SectionTitle/index.scss

```text
@import '../../../scss/styles.scss';

@layer payload-default {
  .section-title {
    position: relative;
    min-width: base(4);
    max-width: 100%;
    pointer-events: all;
    display: flex;
    overflow: hidden;

    &:after {
      display: block;
      content: attr(data-value) ' ';
      visibility: hidden;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }

    &:after,
    &__input {
      font-family: var(--font-body);
      font-weight: 600;
      font-size: base(0.625);
      padding: 0;
      width: 100%;
    }

    &__input {
      color: var(--theme-elevation-800);
      background-color: transparent;
      border: none;
      min-width: min-content;
      width: 100%;
      max-width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      resize: none;
      appearance: none;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;

      &:hover {
        box-shadow: inset 0px -2px 0px -1px var(--theme-elevation-150);
      }

      &:hover,
      &:focus {
        outline: 0;
      }

      &:focus {
        box-shadow: none;
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/fields/Blocks/SectionTitle/index.tsx
Signals: React

```typescript
'use client'
import React from 'react'

import { useField } from '../../../forms/useField/index.js'
import { useTranslation } from '../../../providers/Translation/index.js'
import './index.scss'

const baseClass = 'section-title'

export type Props = {
  customOnChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  customValue?: string
  path: string
  readOnly: boolean
}

/**
 * An input field representing the block's `blockName` property - responsible for reading and saving the `blockName`
 * property from/into the provided path.
 */
export const SectionTitle: React.FC<Props> = (props) => {
  const { customOnChange, customValue, path, readOnly } = props

  const { setValue, value } = useField({ path })
  const { t } = useTranslation()

  const classes = [baseClass].filter(Boolean).join(' ')

  const onChange =
    customOnChange ||
    ((e) => {
      e.stopPropagation()
      e.preventDefault()
      setValue(e.target.value)
    })

  return (
    <div className={classes} data-value={customValue || value}>
      <input
        className={`${baseClass}__input`}
        id={path}
        name={path}
        onChange={onChange}
        placeholder={t('general:untitled')}
        readOnly={readOnly}
        type="text"
        value={customValue || (value as string) || ''}
      />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/fields/Checkbox/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .checkbox {
    position: relative;
    margin-bottom: $baseline;

    .tooltip:not([aria-hidden='true']) {
      right: auto;
      position: static;
      transform: translateY(calc(var(--caret-size) * -1));
      margin-bottom: 0.2em;
      max-width: fit-content;
    }
  }

  .checkbox-input {
    display: inline-flex;
    &:hover:not(&--read-only) {
      label,
      input {
        cursor: pointer;
      }
    }

    label.field-label {
      padding-bottom: 0;
      padding-left: base(0.5);
    }

    [dir='rtl'] &__input {
      margin-right: 0;
      margin-left: base(0.5);
    }

    &__input {
      @include formInput;
      display: flex;
      padding: 0;
      line-height: 0;
      position: relative;
      width: $baseline;
      height: $baseline;

      & input[type='checkbox'] {
        position: absolute;
        // Without the extra 4px, there is an uncheckable area due to the border of the parent element
        width: calc(100% + 4px);
        height: calc(100% + 4px);
        padding: 0;
        margin: 0;
        margin-left: -2px;
        margin-top: -2px;
        opacity: 0;
        border-radius: 0;
        z-index: 1;
      }
    }

    &__icon {
      position: absolute;

      svg {
        opacity: 0;
      }
    }

    &:not(&--read-only) {
      &:active,
      &:focus-within,
      &:focus {
        .checkbox-input__input,
        & input[type='checkbox'] {
          outline: 0;
          box-shadow: 0 0 3px 3px var(--theme-success-400) !important;
          border: 1px solid var(--theme-elevation-150);
        }
      }

      &:hover {
        .checkbox-input__input,
        & input[type='checkbox'] {
          border-color: var(--theme-elevation-250);
        }
      }
    }

    &:not(&--read-only):not(&--checked) {
      &:hover {
        cursor: pointer;

        svg {
          opacity: 0.2;
        }
      }
    }

    &--checked {
      .checkbox-input__icon {
        svg {
          opacity: 1;
        }
      }
    }

    .checkbox-input__icon {
      .icon--line {
        width: 1.4rem;
        height: 1.4rem;
      }

      &.partial {
        svg {
          opacity: 1;
        }
      }
    }

    &--read-only {
      .checkbox-input__input {
        @include readOnly;
      }

      label {
        color: var(--theme-elevation-400);
      }
    }
  }

  html[data-theme='light'] {
    .checkbox {
      &.error {
        .checkbox-input__input {
          @include lightInputError;
        }
      }
    }
  }

  html[data-theme='dark'] {
    .checkbox {
      &.error {
        .checkbox-input__input {
          @include darkInputError;
        }
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/fields/Checkbox/index.tsx
Signals: React

```typescript
'use client'
import type {
  CheckboxFieldClientComponent,
  CheckboxFieldClientProps,
  CheckboxFieldValidation,
} from 'payload'

import { rtlLanguages } from '@payloadcms/translations'
import React, { useCallback, useMemo } from 'react'

import type { CheckboxInputProps } from './Input.js'

import { RenderCustomComponent } from '../../elements/RenderCustomComponent/index.js'
import { FieldDescription } from '../../fields/FieldDescription/index.js'
import { FieldError } from '../../fields/FieldError/index.js'
import { useForm } from '../../forms/Form/context.js'
import { useField } from '../../forms/useField/index.js'
import { withCondition } from '../../forms/withCondition/index.js'
import { useEditDepth } from '../../providers/EditDepth/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { generateFieldID } from '../../utilities/generateFieldID.js'
import { mergeFieldStyles } from '../mergeFieldStyles.js'
import { fieldBaseClass } from '../shared/index.js'
import { CheckboxInput } from './Input.js'
import './index.scss'

const baseClass = 'checkbox'

export { CheckboxFieldClientProps, CheckboxInput, type CheckboxInputProps }

const CheckboxFieldComponent: CheckboxFieldClientComponent = (props) => {
  const {
    id,
    checked: checkedFromProps,
    disableFormData,
    field,
    field: {
      admin: { className, description } = {} as CheckboxFieldClientProps['field']['admin'],
      label,
      required,
    } = {} as CheckboxFieldClientProps['field'],
    onChange: onChangeFromProps,
    partialChecked,
    path: pathFromProps,
    readOnly,
    validate,
  } = props

  const { uuid } = useForm()

  const editDepth = useEditDepth()

  const {
    i18n: { language },
  } = useTranslation()
  const isRTL = (rtlLanguages as readonly string[]).includes(language)

  const memoizedValidate: CheckboxFieldValidation = useCallback(
    (value, options) => {
      if (typeof validate === 'function') {
        return validate(value, { ...options, required })
      }
    },
    [validate, required],
  )

  const {
    customComponents: { AfterInput, BeforeInput, Description, Error, Label } = {},
    disabled,
    path,
    setValue,
    showError,
    value,
  } = useField({
    disableFormData,
    potentiallyStalePath: pathFromProps,
    validate: memoizedValidate,
  })

  const onToggle = useCallback(() => {
    if (!readOnly) {
      setValue(!value)
      if (typeof onChangeFromProps === 'function') {
        onChangeFromProps(!value)
      }
    }
  }, [onChangeFromProps, readOnly, setValue, value])

  const checked = checkedFromProps || Boolean(value)

  const fieldID = id || generateFieldID(path, editDepth, uuid)

  const styles = useMemo(() => mergeFieldStyles(field), [field])

  return (
    <div
      className={[
        fieldBaseClass,
        baseClass,
        showError && 'error',
        className,
        value && `${baseClass}--checked`,
        (readOnly || disabled) && `${baseClass}--read-only`,
      ]
        .filter(Boolean)
        .join(' ')}
      style={styles}
    >
      <RenderCustomComponent
        CustomComponent={Error}
        Fallback={
          <FieldError alignCaret={isRTL ? 'right' : 'left'} path={path} showError={showError} />
        }
      />
      <CheckboxInput
        AfterInput={AfterInput}
        BeforeInput={BeforeInput}
        checked={checked}
        id={fieldID}
        inputRef={null}
        Label={Label}
        label={label}
        name={path}
        onToggle={onToggle}
        partialChecked={partialChecked}
        readOnly={readOnly || disabled}
        required={required}
      />
      <RenderCustomComponent
        CustomComponent={Description}
        Fallback={<FieldDescription description={description} path={path} />}
      />
    </div>
  )
}

export const CheckboxField = withCondition(CheckboxFieldComponent)
```

--------------------------------------------------------------------------------

````
