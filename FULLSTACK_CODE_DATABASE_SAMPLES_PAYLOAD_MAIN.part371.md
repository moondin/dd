---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 371
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 371 of 695)

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
Location: payload-main/packages/ui/src/elements/FolderView/FolderFileTable/index.tsx
Signals: React

```typescript
'use client'

import { getTranslation } from '@payloadcms/translations'
import { extractID } from 'payload/shared'
import React from 'react'

import { DocumentIcon } from '../../../icons/Document/index.js'
import { useConfig } from '../../../providers/Config/index.js'
import { useFolder } from '../../../providers/Folders/index.js'
import { useTranslation } from '../../../providers/Translation/index.js'
import { formatDate } from '../../../utilities/formatDocTitle/formatDateTitle.js'
import { ColoredFolderIcon } from '../ColoredFolderIcon/index.js'
import { DraggableTableRow } from '../DraggableTableRow/index.js'
import { SimpleTable, TableHeader } from '../SimpleTable/index.js'
import './index.scss'

const baseClass = 'folder-file-table'

type Props = {
  showRelationCell?: boolean
}

export function FolderFileTable({ showRelationCell = true }: Props) {
  const {
    checkIfItemIsDisabled,
    documents,
    focusedRowIndex,
    onItemClick,
    onItemKeyPress,
    selectedItemKeys,
    subfolders,
  } = useFolder()
  const { config } = useConfig()
  const { i18n, t } = useTranslation()

  const [relationToMap] = React.useState(() => {
    const map: Record<string, { plural: string; singular: string }> = {}
    config.collections.forEach((collection) => {
      map[collection.slug] = {
        plural: getTranslation(collection.labels?.plural, i18n),
        singular: getTranslation(collection.labels?.singular, i18n),
      }
    })
    return map
  })

  const [columns] = React.useState(() => {
    const columnsToShow = [
      {
        name: 'name',
        label: t('general:name'),
      },
      {
        name: 'createdAt',
        label: t('general:createdAt'),
      },
      {
        name: 'updatedAt',
        label: t('general:updatedAt'),
      },
    ]

    if (showRelationCell) {
      columnsToShow.push({
        name: 'type',
        label: t('version:type'),
      })
    }

    return columnsToShow
  })

  return (
    <SimpleTable
      headerCells={columns.map(({ name, label }) => (
        <TableHeader key={name}>{label}</TableHeader>
      ))}
      tableRows={[
        ...subfolders.map((subfolder, rowIndex) => {
          const { itemKey, relationTo, value } = subfolder
          const subfolderID = extractID(value)

          return (
            <DraggableTableRow
              columns={columns.map(({ name }, index) => {
                let cellValue: React.ReactNode = '—'
                if (name === 'name' && value._folderOrDocumentTitle !== undefined) {
                  cellValue = value._folderOrDocumentTitle
                }

                if ((name === 'createdAt' || name === 'updatedAt') && value[name]) {
                  cellValue = formatDate({
                    date: value[name],
                    i18n,
                    pattern: config.admin.dateFormat,
                  })
                }

                if (name === 'type') {
                  cellValue = (
                    <>
                      {relationToMap[relationTo]?.singular || relationTo}
                      {Array.isArray(subfolder.value?.folderType)
                        ? subfolder.value?.folderType.reduce((acc, slug, index) => {
                            if (index === 0) {
                              return ` — ${relationToMap[slug]?.plural || slug}`
                            }
                            if (index > 0) {
                              return `${acc}, ${relationToMap[slug]?.plural || slug}`
                            }
                            return acc
                          }, '')
                        : ''}
                    </>
                  )
                }

                if (index === 0) {
                  return (
                    <span className={`${baseClass}__cell-with-icon`} key={`${itemKey}-${name}`}>
                      <ColoredFolderIcon />
                      {cellValue}
                    </span>
                  )
                } else {
                  return cellValue
                }
              })}
              disabled={checkIfItemIsDisabled(subfolder)}
              dragData={{
                id: subfolderID,
                type: 'folder',
              }}
              id={subfolderID}
              isDroppable
              isFocused={focusedRowIndex === rowIndex}
              isSelected={selectedItemKeys.has(itemKey)}
              isSelecting={selectedItemKeys.size > 0}
              itemKey={itemKey}
              key={`${rowIndex}-${itemKey}`}
              onClick={(event) => {
                void onItemClick({
                  event,
                  index: rowIndex,
                  item: subfolder,
                })
              }}
              onKeyDown={(event) => {
                void onItemKeyPress({
                  event,
                  index: rowIndex,
                  item: subfolder,
                })
              }}
            />
          )
        }),

        ...documents.map((document, unadjustedIndex) => {
          const { itemKey, relationTo, value } = document
          const documentID = extractID(value)
          const rowIndex = unadjustedIndex + subfolders.length

          return (
            <DraggableTableRow
              columns={columns.map(({ name }, index) => {
                let cellValue: React.ReactNode = '—'
                if (name === 'name' && value._folderOrDocumentTitle !== undefined) {
                  cellValue = value._folderOrDocumentTitle
                }

                if ((name === 'createdAt' || name === 'updatedAt') && value[name]) {
                  cellValue = formatDate({
                    date: value[name],
                    i18n,
                    pattern: config.admin.dateFormat,
                  })
                }

                if (name === 'type') {
                  cellValue = relationToMap[relationTo]?.singular || relationTo
                }

                if (index === 0) {
                  return (
                    <span className={`${baseClass}__cell-with-icon`} key={`${itemKey}-${name}`}>
                      <DocumentIcon />
                      {cellValue}
                    </span>
                  )
                } else {
                  return cellValue
                }
              })}
              disabled={checkIfItemIsDisabled(document)}
              dragData={{
                id: documentID,
                type: 'document',
              }}
              id={documentID}
              isFocused={focusedRowIndex === rowIndex}
              isSelected={selectedItemKeys.has(itemKey)}
              isSelecting={selectedItemKeys.size > 0}
              itemKey={itemKey}
              key={`${rowIndex}-${itemKey}`}
              onClick={(event) => {
                void onItemClick({
                  event,
                  index: rowIndex,
                  item: document,
                })
              }}
              onKeyDown={(event) => {
                void onItemKeyPress({
                  event,
                  index: rowIndex,
                  item: document,
                })
              }}
            />
          )
        }),
      ]}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/FolderView/FolderTypeField/index.tsx
Signals: React

```typescript
import type { Option, OptionObject, SelectFieldClientProps } from 'payload'

import React from 'react'

import type { ReactSelectAdapterProps } from '../../ReactSelect/types.js'

import { mergeFieldStyles } from '../../../fields/mergeFieldStyles.js'
import { formatOptions } from '../../../fields/Select/index.js'
import { SelectInput } from '../../../fields/Select/Input.js'
import { useField } from '../../../forms/useField/index.js'
import { useFolder } from '../../../providers/Folders/index.js'
import { useTranslation } from '../../../providers/Translation/index.js'

export const FolderTypeField = ({
  options: allSelectOptions,
  ...props
}: { options: Option[] } & SelectFieldClientProps) => {
  const {
    field,
    field: {
      name,
      admin: {
        className,
        isClearable = true,
        isSortable = true,
        placeholder,
      } = {} as SelectFieldClientProps['field']['admin'],
      hasMany = false,
      label,
      localized,
      required,
    },
    onChange: onChangeFromProps,
    path: pathFromProps,
    readOnly,
    validate,
  } = props
  const { t } = useTranslation()

  const { folderType } = useFolder()

  const options = React.useMemo(() => {
    if (!folderType || folderType.length === 0) {
      return formatOptions(allSelectOptions)
    }
    return formatOptions(
      allSelectOptions.filter((option) => {
        if (typeof option === 'object' && option.value) {
          return folderType.includes(option.value)
        }
        return true
      }),
    )
  }, [allSelectOptions, folderType])

  const memoizedValidate = React.useCallback(
    (value, validationOptions) => {
      if (typeof validate === 'function') {
        return validate(value, { ...validationOptions, hasMany, options, required })
      }
    },
    [validate, required, hasMany, options],
  )

  const {
    customComponents: { AfterInput, BeforeInput, Description, Error, Label } = {},
    disabled,
    path,
    selectFilterOptions,
    setValue,
    showError,
    value,
  } = useField({
    potentiallyStalePath: pathFromProps,
    validate: memoizedValidate,
  })

  const onChange: ReactSelectAdapterProps['onChange'] = React.useCallback(
    (selectedOption: OptionObject | OptionObject[]) => {
      if (!readOnly || disabled) {
        let newValue: string | string[] = null
        if (selectedOption && hasMany) {
          if (Array.isArray(selectedOption) && selectedOption.length > 0) {
            newValue = selectedOption.map((option) => option.value)
          } else {
            newValue = null
          }
        } else if (selectedOption && !Array.isArray(selectedOption)) {
          newValue = selectedOption.value
        }

        if (typeof onChangeFromProps === 'function') {
          onChangeFromProps(newValue)
        }

        setValue(newValue)
      }
    },
    [readOnly, disabled, hasMany, setValue, onChangeFromProps],
  )

  const styles = React.useMemo(() => mergeFieldStyles(field), [field])

  return (
    <SelectInput
      AfterInput={AfterInput}
      BeforeInput={BeforeInput}
      className={className}
      Description={Description}
      description={t('folder:folderTypeDescription')}
      Error={Error}
      filterOption={
        selectFilterOptions
          ? ({ value }) =>
              selectFilterOptions?.some(
                (option) => (typeof option === 'string' ? option : option.value) === value,
              )
          : undefined
      }
      hasMany={hasMany}
      isClearable={isClearable}
      isSortable={isSortable}
      Label={Label}
      label={label}
      localized={localized}
      name={name}
      onChange={onChange}
      options={options}
      path={path}
      placeholder={placeholder}
      readOnly={readOnly || disabled}
      required={required || (Array.isArray(folderType) && folderType.length > 0)}
      showError={showError}
      style={styles}
      value={value as string | string[]}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/FolderView/ItemCardGrid/index.scss

```text
@import '../../../scss/styles.scss';

@layer payload-default {
  .item-card-grid {
    --gap: var(--base);
    gap: var(--gap);
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    margin-bottom: var(--base);

    &__title {
      color: var(--theme-elevation-400);
      margin-bottom: calc(var(--base) / 2);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/FolderView/ItemCardGrid/index.tsx
Signals: React

```typescript
'use client'

import type { FolderOrDocument } from 'payload/shared'

import React from 'react'

import { ContextFolderFileCard } from '../FolderFileCard/index.js'
import './index.scss'

const baseClass = 'item-card-grid'

type ItemCardGridProps = {
  items: FolderOrDocument[]
  title?: string
} & (
  | {
      subfolderCount: number
      type: 'file'
    }
  | {
      subfolderCount?: never
      type: 'folder'
    }
)
export function ItemCardGrid({ type, items, subfolderCount, title }: ItemCardGridProps) {
  return (
    <>
      {title && <p className={`${baseClass}__title`}>{title}</p>}
      <div className={baseClass}>
        {!items || items?.length === 0
          ? null
          : items.map((item, _index) => {
              const index = _index + (subfolderCount || 0)
              const { itemKey } = item

              return <ContextFolderFileCard index={index} item={item} key={itemKey} type={type} />
            })}
      </div>
    </>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/FolderView/MoveDocToFolder/index.scss

```text
@layer payload-default {
  .move-doc-to-folder {
    margin: 0;
    .btn__icon {
      color: var(--theme-elevation-300);
    }

    .btn__label {
      font-weight: 600;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/FolderView/MoveDocToFolder/index.tsx
Signals: React

```typescript
'use client'

import type { CollectionSlug } from 'payload'
import type { FolderOrDocument } from 'payload/shared'

import { useModal } from '@faceless-ui/modal'
import { getTranslation } from '@payloadcms/translations'
import React, { useId } from 'react'
import { toast } from 'sonner'

import type { Props as ButtonProps } from '../../Button/types.js'

import { useForm, useFormFields } from '../../../forms/Form/context.js'
import { FolderIcon } from '../../../icons/Folder/index.js'
import { useConfig } from '../../../providers/Config/index.js'
import { useDocumentInfo } from '../../../providers/DocumentInfo/index.js'
import { useTranslation } from '../../../providers/Translation/index.js'
import { Button } from '../../Button/index.js'
import { formatDrawerSlug, useDrawerDepth } from '../../Drawer/index.js'
import './index.scss'
import { MoveItemsToFolderDrawer } from '../Drawers/MoveToFolder/index.js'

const baseClass = 'move-doc-to-folder'

/**
 * This is the button shown on the edit document view. It uses the more generic `MoveDocToFolderButton` component.
 */
export function MoveDocToFolder({
  buttonProps,
  className = '',
  folderCollectionSlug,
  folderFieldName,
}: {
  readonly buttonProps?: Partial<ButtonProps>
  readonly className?: string
  readonly folderCollectionSlug: string
  readonly folderFieldName: string
}) {
  const { t } = useTranslation()
  const dispatchField = useFormFields(([_, dispatch]) => dispatch)
  const currentParentFolder = useFormFields(
    ([fields]) => (fields && fields?.[folderFieldName]) || null,
  )
  const fromFolderID = currentParentFolder?.value
  const { id, collectionSlug, initialData, title } = useDocumentInfo()
  const { setModified } = useForm()
  const [fromFolderName, setFromFolderName] = React.useState(() => `${t('general:loading')}...`)

  const { config } = useConfig()
  const modalID = useId()

  React.useEffect(() => {
    async function fetchFolderLabel() {
      if (fromFolderID && (typeof fromFolderID === 'string' || typeof fromFolderID === 'number')) {
        const response = await fetch(`${config.routes.api}/${folderCollectionSlug}/${fromFolderID}`)
        const folderData = await response.json()
        setFromFolderName(folderData?.name || t('folder:noFolder'))
      } else {
        setFromFolderName(t('folder:noFolder'))
      }
    }

    void fetchFolderLabel()
  }, [folderCollectionSlug, config.routes.api, fromFolderID, t])

  return (
    <MoveDocToFolderButton
      buttonProps={buttonProps}
      className={className}
      collectionSlug={collectionSlug}
      docData={initialData as FolderOrDocument['value']}
      docID={id}
      docTitle={title}
      folderCollectionSlug={folderCollectionSlug}
      folderFieldName={folderFieldName}
      fromFolderID={fromFolderID as number | string}
      fromFolderName={fromFolderName}
      modalSlug={`move-to-folder-${modalID}`}
      onConfirm={({ id }) => {
        if (currentParentFolder.value !== id) {
          dispatchField({
            type: 'UPDATE',
            path: folderFieldName,
            value: id,
          })
          setModified(true)
        }
      }}
      skipConfirmModal={!currentParentFolder?.value}
    />
  )
}

type MoveDocToFolderButtonProps = {
  readonly buttonProps?: Partial<ButtonProps>
  readonly className?: string
  readonly collectionSlug: string
  readonly docData: FolderOrDocument['value']
  readonly docID: number | string
  readonly docTitle?: string
  readonly folderCollectionSlug: string
  readonly folderFieldName: string
  readonly fromFolderID?: number | string
  readonly fromFolderName: string
  readonly modalSlug: string
  readonly onConfirm?: (args: { id: number | string; name: string }) => Promise<void> | void
  readonly skipConfirmModal?: boolean
}

/**
 * This is a more generic button that can be used in other contexts, such as table cells and the edit view.
 */
export const MoveDocToFolderButton = ({
  buttonProps,
  className,
  collectionSlug,
  docData,
  docID,
  docTitle,
  folderCollectionSlug,
  folderFieldName,
  fromFolderID,
  fromFolderName,
  modalSlug,
  onConfirm,
  skipConfirmModal,
}: MoveDocToFolderButtonProps) => {
  const { getEntityConfig } = useConfig()
  const { i18n, t } = useTranslation()
  const { closeModal, openModal } = useModal()
  const drawerDepth = useDrawerDepth()
  const drawerSlug = formatDrawerSlug({ slug: modalSlug, depth: drawerDepth })

  const titleToRender =
    docTitle || getTranslation(getEntityConfig({ collectionSlug }).labels.singular, i18n)

  return (
    <>
      <Button
        buttonStyle="subtle"
        className={[baseClass, className].filter(Boolean).join(' ')}
        icon={<FolderIcon />}
        iconPosition="left"
        onClick={() => {
          openModal(drawerSlug)
        }}
        {...buttonProps}
      >
        {fromFolderName}
      </Button>

      <MoveItemsToFolderDrawer
        action="moveItemToFolder"
        drawerSlug={drawerSlug}
        //todo this should inherit
        folderAssignedCollections={[collectionSlug]}
        folderCollectionSlug={folderCollectionSlug}
        folderFieldName={folderFieldName}
        fromFolderID={fromFolderID}
        fromFolderName={fromFolderName}
        itemsToMove={[
          {
            itemKey: `${collectionSlug}-${docID}`,
            relationTo: collectionSlug,
            value: { ...docData, id: docID },
          },
        ]}
        onConfirm={async (args) => {
          if (fromFolderID !== args.id && typeof onConfirm === 'function') {
            try {
              await onConfirm(args)

              if (args.id) {
                // moved to folder
                toast.success(
                  t('folder:itemHasBeenMoved', {
                    folderName: `"${args.name}"`,
                    title: titleToRender,
                  }),
                )
              } else {
                // moved to root
                toast.success(
                  t('folder:itemHasBeenMovedToRoot', {
                    title: titleToRender,
                  }),
                )
              }
            } catch (_) {
              // todo: add error toast?
            }
          }

          closeModal(drawerSlug)
        }}
        skipConfirmModal={skipConfirmModal}
        title={titleToRender}
      />
    </>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/FolderView/SimpleTable/index.scss

```text
@import '../../../scss/styles.scss';

@layer payload-default {
  .simple-table {
    margin-bottom: var(--base);
    overflow: auto;
    max-width: 100%;

    &__table {
      min-width: 100%;
      border-collapse: collapse;
    }

    &__thead {
      color: var(--theme-elevation-400);
    }

    &__th {
      font-weight: normal;
      text-align: left;
      [dir='rtl'] & {
        text-align: right;
      }
    }

    &__th,
    &__td {
      vertical-align: top;
      padding: calc(var(--base) * 0.6);
      min-width: 150px;
      position: relative;

      &:first-child {
        padding-inline-start: calc(var(--base) * (0.8));
      }
      &:last-child {
        padding-inline-end: calc(var(--base) * (0.8));
      }
    }

    .simple-table__thead .simple-table__tr {
      &:after {
        background-color: transparent;
      }
    }

    &__hidden-cell {
      position: absolute;
      padding: 0;
    }

    @include mid-break {
      &__th,
      &__td {
        max-width: 70vw;
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/FolderView/SimpleTable/index.tsx
Signals: React

```typescript
'use client'

import React from 'react'

import './index.scss'

const baseClass = 'simple-table'

type TableProps = {
  readonly appearance?: 'condensed' | 'default'
  readonly className?: string
  readonly headerCells: React.ReactNode[]
  readonly tableRows: React.ReactNode[]
}
export const SimpleTable = ({
  appearance,
  className,
  headerCells: headers,
  tableRows: rows,
}: TableProps) => {
  return (
    <div
      className={[className, baseClass, appearance && `${baseClass}--appearance-${appearance}`]
        .filter(Boolean)
        .join(' ')}
    >
      <table cellPadding={0} cellSpacing={0} className={`${baseClass}__table`}>
        <TableHead>
          <TableRow>{headers}</TableRow>
        </TableHead>

        <TableBody>{rows}</TableBody>
      </table>
    </div>
  )
}

export const TableHead = ({
  children,
  className,
  ...rest
}: React.HTMLAttributes<HTMLTableSectionElement>) => {
  return (
    <thead className={`${baseClass}__thead ${className || ''}`.trim()} {...rest}>
      {children}
    </thead>
  )
}

export const TableBody = ({
  children,
  className,
  ...rest
}: React.HTMLAttributes<HTMLTableSectionElement>) => {
  return (
    <tbody className={`${baseClass}__tbody ${className || ''}`.trim()} {...rest}>
      {children}
    </tbody>
  )
}

export const TableRow = ({
  children,
  className,
  ...rest
}: React.HTMLAttributes<HTMLTableRowElement>) => {
  return (
    <tr className={`${baseClass}__tr ${className || ''}`.trim()} {...rest}>
      {children}
    </tr>
  )
}

export const TableCell = ({
  children,
  className,
  ...rest
}: React.TdHTMLAttributes<HTMLTableCellElement>) => {
  return (
    <td className={`${baseClass}__td ${className || ''}`.trim()} {...rest}>
      {children}
    </td>
  )
}

export const TableHeader = ({
  children,
  className,
  ...rest
}: React.ThHTMLAttributes<HTMLTableCellElement>) => {
  return (
    <th className={`${baseClass}__th ${className || ''}`.trim()} {...rest}>
      {children}
    </th>
  )
}

export const HiddenCell = ({
  children,
  className,
  ...rest
}: { children?: React.ReactNode } & React.TdHTMLAttributes<HTMLTableCellElement>) => {
  return (
    <td className={`${baseClass}__hidden-cell ${className || ''}`.trim()} {...rest}>
      {children}
    </td>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/FolderView/SortByPill/index.scss

```text
@layer payload-default {
  .sort-by-pill {
    &__order-option {
      display: flex;
      gap: calc(var(--base) * 0.25);
    }

    &__trigger {
      .pill__label {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/FolderView/SortByPill/index.tsx
Signals: React

```typescript
import type { TFunction } from '@payloadcms/translations'
import type { FolderSortKeys } from 'payload'

import React from 'react'

import { ChevronIcon } from '../../../icons/Chevron/index.js'
import { SortDownIcon, SortUpIcon } from '../../../icons/Sort/index.js'
import { useFolder } from '../../../providers/Folders/index.js'
import { useTranslation } from '../../../providers/Translation/index.js'
import { Pill } from '../../Pill/index.js'
import { Popup, PopupList } from '../../Popup/index.js'
import './index.scss'

const baseClass = 'sort-by-pill'

const sortOnOptions: {
  label: (t: TFunction) => React.ReactNode
  value: FolderSortKeys
}[] = [
  { label: (t) => t('general:name'), value: 'name' },
  { label: (t) => t('general:createdAt'), value: 'createdAt' },
  { label: (t) => t('general:updatedAt'), value: 'updatedAt' },
]
const orderOnOptions: {
  label: (t: TFunction) => React.ReactNode
  value: 'asc' | 'desc'
}[] = [
  {
    label: (t) => (
      <>
        <SortUpIcon />
        {t('general:ascending')}
      </>
    ),
    value: 'asc',
  },
  {
    label: (t) => (
      <>
        <SortDownIcon />
        {t('general:descending')}
      </>
    ),
    value: 'desc',
  },
]
export function SortByPill() {
  const { refineFolderData, sort } = useFolder()
  const { t } = useTranslation()
  const sortDirection = sort.startsWith('-') ? 'desc' : 'asc'
  const [selectedSortOption] =
    sortOnOptions.filter(({ value }) => value === (sort.startsWith('-') ? sort.slice(1) : sort)) ||
    sortOnOptions
  const [selectedOrderOption] = orderOnOptions.filter(({ value }) => value === sortDirection)

  return (
    <Popup
      button={
        <Pill className={`${baseClass}__trigger`} icon={<ChevronIcon />} size="small">
          {sortDirection === 'asc' ? (
            <SortUpIcon className={`${baseClass}__sort-icon`} />
          ) : (
            <SortDownIcon className={`${baseClass}__sort-icon`} />
          )}
          {selectedSortOption?.label(t)}
        </Pill>
      }
      className={baseClass}
      horizontalAlign="right"
      render={({ close }) => (
        <>
          <PopupList.GroupLabel label="Sort by" />
          <PopupList.ButtonGroup>
            {sortOnOptions.map(({ label, value }) => (
              <PopupList.Button
                active={selectedSortOption?.value === value}
                key={value}
                onClick={() => {
                  refineFolderData({
                    query: {
                      page: '1',
                      sort: sortDirection === 'desc' ? `-${value}` : value,
                    },
                    updateURL: true,
                  })
                  close()
                }}
              >
                {label(t)}
              </PopupList.Button>
            ))}
          </PopupList.ButtonGroup>
          <PopupList.Divider />
          <PopupList.GroupLabel label="Order" />
          <PopupList.ButtonGroup>
            {orderOnOptions.map(({ label, value }) => (
              <PopupList.Button
                active={selectedOrderOption?.value === value}
                className={`${baseClass}__order-option`}
                key={value}
                onClick={() => {
                  if (sortDirection !== value) {
                    refineFolderData({
                      query: {
                        page: '1',
                        sort:
                          value === 'desc'
                            ? `-${selectedSortOption?.value}`
                            : selectedSortOption?.value,
                      },
                      updateURL: true,
                    })
                    close()
                  }
                }}
              >
                {label(t)}
              </PopupList.Button>
            ))}
          </PopupList.ButtonGroup>
        </>
      )}
      showScrollbar
      verticalAlign="bottom"
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/FolderView/ToggleViewButtons/index.scss

```text
@import '../../../scss/styles.scss';

@layer payload-default {
  .folder-view-toggle-button {
    padding: 0;
    background-color: transparent;

    &--active {
      background-color: var(--theme-elevation-150);
    }

    .btn__icon {
      border: none;
      padding: 0;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/FolderView/ToggleViewButtons/index.tsx

```typescript
import { GridViewIcon } from '../../../icons/GridView/index.js'
import { ListViewIcon } from '../../../icons/ListView/index.js'
import { Button } from '../../Button/index.js'
import './index.scss'

const baseClass = 'folder-view-toggle-button'

type Props = {
  activeView: 'grid' | 'list'
  setActiveView: (view: 'grid' | 'list') => void
}
export function ToggleViewButtons({ activeView, setActiveView }: Props) {
  return (
    <>
      <Button
        buttonStyle="pill"
        className={[baseClass, activeView === 'grid' && `${baseClass}--active`]
          .filter(Boolean)
          .join(' ')}
        icon={<GridViewIcon />}
        margin={false}
        onClick={() => {
          setActiveView('grid')
        }}
      />
      <Button
        buttonStyle="pill"
        className={[baseClass, activeView === 'list' && `${baseClass}--active`]
          .filter(Boolean)
          .join(' ')}
        icon={<ListViewIcon />}
        margin={false}
        onClick={() => {
          setActiveView('list')
        }}
      />
    </>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/FullscreenModal/index.tsx
Signals: React

```typescript
'use client'
import type { Modal as ModalType } from '@faceless-ui/modal'

import { Modal } from '@faceless-ui/modal'
import React from 'react'

import { useEditDepth } from '../../providers/EditDepth/index.js'

export function FullscreenModal(props: Parameters<typeof ModalType>[0]) {
  const currentDepth = useEditDepth()

  return (
    <Modal
      // Fixes https://github.com/payloadcms/payload/issues/13778
      closeOnBlur={false}
      {...props}
      style={{
        ...(props.style || {}),
        zIndex: `calc(100 + ${currentDepth || 0} + 1)`,
      }}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/GenerateConfirmation/index.tsx
Signals: React

```typescript
'use client'
import { useModal } from '@faceless-ui/modal'
import React, { useCallback } from 'react'
import { toast } from 'sonner'

import { useDocumentInfo } from '../../providers/DocumentInfo/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { Button } from '../Button/index.js'
import { ConfirmationModal } from '../ConfirmationModal/index.js'
import { Translation } from '../Translation/index.js'

export type GenerateConfirmationProps = {
  highlightField: (Boolean) => void
  setKey: () => void
}

export function GenerateConfirmation(props: GenerateConfirmationProps) {
  const { highlightField, setKey } = props

  const { id } = useDocumentInfo()
  const { toggleModal } = useModal()
  const { t } = useTranslation()

  const modalSlug = `generate-confirmation-${id}`

  const handleGenerate = useCallback(() => {
    setKey()
    toast.success(t('authentication:newAPIKeyGenerated'))
    highlightField(true)
  }, [highlightField, setKey, t])

  return (
    <React.Fragment>
      <Button
        buttonStyle="secondary"
        onClick={() => {
          toggleModal(modalSlug)
        }}
        size="small"
      >
        {t('authentication:generateNewAPIKey')}
      </Button>
      <ConfirmationModal
        body={
          <Translation
            elements={{
              1: ({ children }) => <strong>{children}</strong>,
            }}
            i18nKey="authentication:generatingNewAPIKeyWillInvalidate"
            t={t}
          />
        }
        confirmLabel={t('authentication:generate')}
        heading={t('authentication:confirmGeneration')}
        modalSlug={modalSlug}
        onConfirm={handleGenerate}
      />
    </React.Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/GroupByBuilder/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .group-by-builder {
    background: var(--theme-elevation-50);
    padding: var(--base);
    display: flex;
    flex-direction: column;
    gap: calc(var(--base) / 2);

    &__header {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }

    &__clear-button {
      background: transparent;
      border: none;
      color: var(--theme-elevation-500);
      line-height: inherit;
      cursor: pointer;
      font-size: inherit;
      padding: 0;
      text-decoration: underline;
    }

    &__inputs {
      width: 100%;
      display: flex;
      gap: base(1);

      & > * {
        flex-grow: 1;
        width: 50%;
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/GroupByBuilder/index.tsx
Signals: React

```typescript
'use client'
import type { ClientField, Field, SanitizedCollectionConfig } from 'payload'

import './index.scss'

import React, { useMemo } from 'react'

import { SelectInput } from '../../fields/Select/Input.js'
import { useAuth } from '../../providers/Auth/index.js'
import { useListQuery } from '../../providers/ListQuery/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { reduceFieldsToOptions } from '../../utilities/reduceFieldsToOptions.js'
import { ReactSelect } from '../ReactSelect/index.js'

export type Props = {
  readonly collectionSlug: SanitizedCollectionConfig['slug']
  fields: ClientField[]
}

const baseClass = 'group-by-builder'

/**
 * Note: Some fields are already omitted from the list of fields:
 * - fields with nested field, e.g. `tabs`, `groups`, etc.
 * - fields that don't affect data, i.e. `row`, `collapsible`, `ui`, etc.
 * So we don't technically need to omit them here, but do anyway.
 * But some remaining fields still need an additional check, e.g. `richText`, etc.
 */
const supportedFieldTypes: Field['type'][] = [
  'text',
  'textarea',
  'number',
  'select',
  'relationship',
  'date',
  'checkbox',
  'radio',
  'email',
  'number',
  'upload',
]

export const GroupByBuilder: React.FC<Props> = ({ collectionSlug, fields }) => {
  const { i18n, t } = useTranslation()
  const { permissions } = useAuth()

  const fieldPermissions = permissions?.collections?.[collectionSlug]?.fields

  const reducedFields = useMemo(
    () =>
      reduceFieldsToOptions({
        fieldPermissions,
        fields,
        i18n,
      }),
    [fields, fieldPermissions, i18n],
  )

  const { query, refineListData } = useListQuery()

  const groupByFieldName = query.groupBy?.replace(/^-/, '')

  const groupByField = reducedFields.find((field) => field.value === groupByFieldName)

  return (
    <div className={baseClass}>
      <div className={`${baseClass}__header`}>
        <p>
          {t('general:groupByLabel', {
            label: '',
          })}
        </p>
        {query.groupBy && (
          <button
            className={`${baseClass}__clear-button`}
            id="group-by--reset"
            onClick={async () => {
              await refineListData({
                groupBy: '',
              })
            }}
            type="button"
          >
            {t('general:clear')}
          </button>
        )}
      </div>
      <div className={`${baseClass}__inputs`}>
        <ReactSelect
          filterOption={(option, inputValue) =>
            ((option?.data?.plainTextLabel as string) || option.label)
              .toLowerCase()
              .includes(inputValue.toLowerCase())
          }
          id="group-by--field-select"
          isClearable
          isMulti={false}
          onChange={async (v: { value: string } | null) => {
            const value = v === null ? undefined : v.value

            // value is being cleared
            if (v === null) {
              await refineListData({
                groupBy: '',
                page: 1,
              })
            }

            await refineListData({
              groupBy: value ? (query.groupBy?.startsWith('-') ? `-${value}` : value) : undefined,
              page: 1,
            })
          }}
          options={reducedFields.filter(
            (field) =>
              !field.field.admin.disableGroupBy &&
              field.value !== 'id' &&
              supportedFieldTypes.includes(field.field.type),
          )}
          value={{
            label: groupByField?.label || t('general:selectValue'),
            value: groupByFieldName || '',
          }}
        />
        <SelectInput
          id="group-by--sort"
          isClearable={false}
          name="direction"
          onChange={async ({ value }: { value: string }) => {
            if (!groupByFieldName) {
              return
            }

            await refineListData({
              groupBy: value === 'asc' ? groupByFieldName : `-${groupByFieldName}`,
              page: 1,
            })
          }}
          options={[
            { label: t('general:ascending'), value: 'asc' },
            { label: t('general:descending'), value: 'desc' },
          ]}
          path="direction"
          readOnly={!groupByFieldName}
          value={
            !query.groupBy
              ? 'asc'
              : typeof query.groupBy === 'string'
                ? `${query.groupBy.startsWith('-') ? 'desc' : 'asc'}`
                : ''
          }
        />
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/Gutter/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .gutter {
    &--left {
      padding-left: var(--gutter-h);
    }

    &--right {
      padding-right: var(--gutter-h);
    }

    &--negative-left {
      margin-left: calc(-1 * var(--gutter-h));
    }

    &--negative-right {
      margin-right: calc(-1 * var(--gutter-h));
    }
  }
}
```

--------------------------------------------------------------------------------

````
