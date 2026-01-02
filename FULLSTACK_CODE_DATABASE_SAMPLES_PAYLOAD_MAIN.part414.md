---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 414
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 414 of 695)

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

---[FILE: traverseFields.ts]---
Location: payload-main/packages/ui/src/utilities/buildFieldSchemaMap/traverseFields.ts

```typescript
import type { I18n } from '@payloadcms/translations'
import type { Field, FieldSchemaMap, SanitizedConfig } from 'payload'

import { MissingEditorProp } from 'payload'
import { fieldAffectsData, getFieldPaths, tabHasName } from 'payload/shared'

type Args = {
  config: SanitizedConfig
  fields: Field[]
  i18n: I18n<any, any>
  parentIndexPath: string
  parentSchemaPath: string
  schemaMap: FieldSchemaMap
}

export const traverseFields = ({
  config,
  fields,
  i18n,
  parentIndexPath,
  parentSchemaPath,
  schemaMap,
}: Args) => {
  for (const [index, field] of fields.entries()) {
    const { indexPath, schemaPath } = getFieldPaths({
      field,
      index,
      parentIndexPath: 'name' in field ? '' : parentIndexPath,
      parentPath: '',
      parentSchemaPath,
    })

    schemaMap.set(schemaPath, field)

    switch (field.type) {
      case 'array':
        traverseFields({
          config,
          fields: field.fields,
          i18n,
          parentIndexPath: '',
          parentSchemaPath: schemaPath,
          schemaMap,
        })

        break

      case 'blocks':
        ;(field.blockReferences ?? field.blocks).map((_block) => {
          // TODO: iterate over blocks mapped to block slug in v4, or pass through payload.blocks
          const block =
            typeof _block === 'string' ? config.blocks.find((b) => b.slug === _block) : _block

          const blockSchemaPath = `${schemaPath}.${block.slug}`

          schemaMap.set(blockSchemaPath, block)
          traverseFields({
            config,
            fields: block.fields,
            i18n,
            parentIndexPath: '',
            parentSchemaPath: blockSchemaPath,
            schemaMap,
          })
        })

        break

      case 'collapsible':
      case 'row':
        traverseFields({
          config,
          fields: field.fields,
          i18n,
          parentIndexPath: indexPath,
          parentSchemaPath,
          schemaMap,
        })

        break

      case 'group':
        if (fieldAffectsData(field)) {
          traverseFields({
            config,
            fields: field.fields,
            i18n,
            parentIndexPath: '',
            parentSchemaPath: schemaPath,
            schemaMap,
          })
        } else {
          traverseFields({
            config,
            fields: field.fields,
            i18n,
            parentIndexPath: indexPath,
            parentSchemaPath,
            schemaMap,
          })
        }

        break

      case 'richText':
        if (!field?.editor) {
          throw new MissingEditorProp(field) // while we allow disabling editor functionality, you should not have any richText fields defined if you do not have an editor
        }

        if (typeof field.editor === 'function') {
          throw new Error('Attempted to access unsanitized rich text editor.')
        }

        if (typeof field.editor.generateSchemaMap === 'function') {
          field.editor.generateSchemaMap({
            config,
            field,
            i18n,
            schemaMap,
            schemaPath,
          })
        }

        break

      case 'tabs':
        field.tabs.map((tab, tabIndex) => {
          const isNamedTab = tabHasName(tab)

          const { indexPath: tabIndexPath, schemaPath: tabSchemaPath } = getFieldPaths({
            field: {
              ...tab,
              type: 'tab',
            },
            index: tabIndex,
            parentIndexPath: indexPath,
            parentPath: '',
            parentSchemaPath,
          })

          schemaMap.set(tabSchemaPath, tab)

          traverseFields({
            config,
            fields: tab.fields,
            i18n,
            parentIndexPath: isNamedTab ? '' : tabIndexPath,
            parentSchemaPath: isNamedTab ? tabSchemaPath : parentSchemaPath,
            schemaMap,
          })
        })

        break
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: formatDateTitle.ts]---
Location: payload-main/packages/ui/src/utilities/formatDocTitle/formatDateTitle.ts

```typescript
import type { I18n, I18nClient } from '@payloadcms/translations'

import { TZDateMini as TZDate } from '@date-fns/tz/date/mini'
import { format, formatDistanceToNow, transpose } from 'date-fns'

export type FormatDateArgs = {
  date: Date | number | string | undefined
  i18n: I18n<unknown, unknown> | I18nClient<unknown>
  pattern: string
  timezone?: string
}

export const formatDate = ({ date, i18n, pattern, timezone }: FormatDateArgs): string => {
  const theDate = new TZDate(new Date(date))

  if (timezone) {
    const DateWithOriginalTz = TZDate.tz(timezone)

    const modifiedDate = theDate.withTimeZone(timezone)

    // Transpose the date to the selected timezone
    const dateWithTimezone = transpose(modifiedDate, DateWithOriginalTz)

    // Transpose the date to the user's timezone - this is necessary because the react-datepicker component insists on displaying the date in the user's timezone
    return i18n.dateFNS
      ? format(dateWithTimezone, pattern, { locale: i18n.dateFNS })
      : `${i18n.t('general:loading')}...`
  }

  return i18n.dateFNS
    ? format(theDate, pattern, { locale: i18n.dateFNS })
    : `${i18n.t('general:loading')}...`
}

type FormatTimeToNowArgs = {
  date: Date | number | string | undefined
  i18n: I18n<unknown, unknown> | I18nClient<unknown>
}

export const formatTimeToNow = ({ date, i18n }: FormatTimeToNowArgs): string => {
  const theDate = typeof date === 'string' ? new Date(date) : date
  return i18n?.dateFNS
    ? formatDistanceToNow(theDate, { locale: i18n.dateFNS })
    : `${i18n.t('general:loading')}...`
}
```

--------------------------------------------------------------------------------

---[FILE: formatLexicalDocTitle.ts]---
Location: payload-main/packages/ui/src/utilities/formatDocTitle/formatLexicalDocTitle.ts

```typescript
type SerializedLexicalEditor = {
  root: {
    children: Array<{ children?: Array<{ type: string }>; type: string }>
  }
}

export function isSerializedLexicalEditor(value: unknown): value is SerializedLexicalEditor {
  return typeof value === 'object' && 'root' in value
}

export function formatLexicalDocTitle(
  editorState: Array<{ children?: Array<{ type: string }>; type: string }>,
  textContent: string,
): string {
  for (const node of editorState) {
    if ('text' in node && node.text) {
      textContent += node.text as string
    } else {
      if (!('children' in node)) {
        textContent += `[${node.type}]`
      }
    }
    if ('children' in node && node.children) {
      textContent += formatLexicalDocTitle(node.children as Array<{ type: string }>, textContent)
    }
  }
  return textContent
}
```

--------------------------------------------------------------------------------

---[FILE: formatRelationshipTitle.ts]---
Location: payload-main/packages/ui/src/utilities/formatDocTitle/formatRelationshipTitle.ts

```typescript
export const formatRelationshipTitle = (data): string => {
  if (Array.isArray(data)) {
    return data
      .map((item) => {
        if (typeof item === 'object' && item !== null) {
          return item.id
        }
        return String(item)
      })
      .filter(Boolean)
      .join(', ')
  }

  if (typeof data === 'object' && data !== null) {
    return data.id || ''
  }

  return String(data)
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/ui/src/utilities/formatDocTitle/index.ts

```typescript
import type { I18n } from '@payloadcms/translations'
import type {
  ClientCollectionConfig,
  ClientGlobalConfig,
  SanitizedConfig,
  TypeWithID,
} from 'payload'

import { getTranslation } from '@payloadcms/translations'

import { formatDate } from './formatDateTitle.js'
import { formatLexicalDocTitle, isSerializedLexicalEditor } from './formatLexicalDocTitle.js'
import { formatRelationshipTitle } from './formatRelationshipTitle.js'

export const formatDocTitle = ({
  collectionConfig,
  data,
  dateFormat: dateFormatFromConfig,
  fallback,
  globalConfig,
  i18n,
}: {
  collectionConfig?: ClientCollectionConfig
  data: TypeWithID
  dateFormat: SanitizedConfig['admin']['dateFormat']
  fallback?: object | string
  globalConfig?: ClientGlobalConfig
  i18n: I18n<any, any>
}): string => {
  let title: string

  if (collectionConfig) {
    const useAsTitle = collectionConfig?.admin?.useAsTitle

    if (useAsTitle) {
      title = data?.[useAsTitle] as string

      if (title) {
        const fieldConfig = collectionConfig.fields.find(
          (f) => 'name' in f && f.name === useAsTitle,
        )

        const isDate = fieldConfig?.type === 'date'
        const isRelationship = fieldConfig?.type === 'relationship'

        if (isDate) {
          const dateFormat =
            ('date' in fieldConfig.admin && fieldConfig?.admin?.date?.displayFormat) ||
            dateFormatFromConfig

          title = formatDate({ date: title, i18n, pattern: dateFormat }) || title
        }

        if (isRelationship) {
          const formattedRelationshipTitle = formatRelationshipTitle(data[useAsTitle])
          title = formattedRelationshipTitle
        }
      }
    }
  }

  if (globalConfig) {
    title = getTranslation(globalConfig?.label, i18n) || globalConfig?.slug
  }

  // richtext lexical case. We convert the first child of root to plain text
  if (title && isSerializedLexicalEditor(title)) {
    title = formatLexicalDocTitle(title.root.children?.[0]?.children || [], '')
  }

  if (!title && isSerializedLexicalEditor(fallback)) {
    title = formatLexicalDocTitle(fallback.root.children?.[0]?.children || [], '')
  }

  if (!title) {
    title = typeof fallback === 'string' ? fallback : `[${i18n.t('general:untitled')}]`
  }

  return title
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/views/BrowseByFolder/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .folder-list {
    width: 100%;

    &__toggle-view-button {
      padding: 0;
      background-color: transparent &--active {
        background-color: var(--theme-elevation-150);
      }

      .btn__icon {
        border: none;
        padding: 0;
      }
    }

    &__step-nav-icon-label,
    &__step-nav-icon-label .btn__label {
      margin: 0;
      display: flex;
      align-items: center;
      gap: calc(var(--base) * 0.25);

      .icon {
        height: 18px;
      }
    }

    &__step-nav-droppable.droppable-button {
      &--hover {
        opacity: 0.3;
      }
    }

    &__wrap {
      padding-bottom: var(--spacing-view-bottom);

      & > *:not(:last-child) {
        margin-bottom: var(--base);
      }
    }

    .cell-with-icon {
      display: flex;
      align-items: center;
      gap: calc(var(--base) * 0.5);
    }

    .list-header {
      a {
        text-decoration: none;
      }
    }

    &__sub-header {
      flex-basis: 100%;
    }

    .table {
      table {
        width: 100%;
        overflow: auto;

        [class^='cell'] > p,
        [class^='cell'] > span,
        [class^='cell'] > a {
          line-clamp: 4;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 4;
          overflow: hidden;
          display: -webkit-box;
          max-width: 100vw;
        }
      }
    }

    &__no-results {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--base);

      & > * {
        margin: 0;
      }
    }

    &__page-controls {
      width: 100%;
      display: flex;
      align-items: center;
    }

    .paginator {
      margin-bottom: 0;
    }

    &__page-info {
      [dir='ltr'] & {
        margin-right: base(1);
        margin-left: auto;
      }
      [dir='rtl'] & {
        margin-left: base(1);
        margin-right: auto;
      }
    }

    &__shimmer {
      margin-top: base(1.75);
      width: 100%;
      > div {
        margin-top: 8px;
      }
    }

    @include mid-break {
      margin-top: base(0.25);

      &__wrap {
        padding-top: 0;
        padding-bottom: 0;
      }

      &__header {
        gap: base(0.5);
      }

      &__sub-header {
        margin-top: 0;
      }

      &__search-input {
        margin: 0;
      }

      // on mobile, extend the table all the way to the viewport edges
      // this is to visually indicate overflowing content
      .table {
        display: flex;
        width: calc(100% + calc(var(--gutter-h) * 2));
        max-width: unset;
        left: calc(var(--gutter-h) * -1);
        position: relative;
        padding-left: var(--gutter-h);

        &::after {
          content: '';
          height: 1px;
          padding-right: var(--gutter-h);
        }
      }

      &__page-controls {
        flex-wrap: wrap;
      }

      &__page-info {
        margin-left: 0;
      }

      .paginator {
        width: 100%;
        margin-bottom: $baseline;
      }
    }

    @include small-break {
      margin-bottom: base(2.4);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/views/BrowseByFolder/index.tsx
Signals: React, Next.js

```typescript
'use client'

import type { DragEndEvent } from '@dnd-kit/core'
import type { FolderListViewClientProps } from 'payload'

import { useDndMonitor } from '@dnd-kit/core'
import { getTranslation } from '@payloadcms/translations'
import { useRouter } from 'next/navigation.js'
import React, { Fragment } from 'react'

import { DroppableBreadcrumb } from '../../elements/FolderView/Breadcrumbs/index.js'
import { ColoredFolderIcon } from '../../elements/FolderView/ColoredFolderIcon/index.js'
import { CurrentFolderActions } from '../../elements/FolderView/CurrentFolderActions/index.js'
import { DragOverlaySelection } from '../../elements/FolderView/DragOverlaySelection/index.js'
import { FilterFolderTypePill } from '../../elements/FolderView/FilterFolderTypePill/index.js'
import { FolderFileTable } from '../../elements/FolderView/FolderFileTable/index.js'
import { ItemCardGrid } from '../../elements/FolderView/ItemCardGrid/index.js'
import { SortByPill } from '../../elements/FolderView/SortByPill/index.js'
import { ToggleViewButtons } from '../../elements/FolderView/ToggleViewButtons/index.js'
import { Gutter } from '../../elements/Gutter/index.js'
import { ListHeader } from '../../elements/ListHeader/index.js'
import { ListCreateNewDocInFolderButton } from '../../elements/ListHeader/TitleActions/index.js'
import { NoListResults } from '../../elements/NoListResults/index.js'
import { SearchBar } from '../../elements/SearchBar/index.js'
import { useStepNav } from '../../elements/StepNav/index.js'
import { useConfig } from '../../providers/Config/index.js'
import { useEditDepth } from '../../providers/EditDepth/index.js'
import { FolderProvider, useFolder } from '../../providers/Folders/index.js'
import { usePreferences } from '../../providers/Preferences/index.js'
import { useRouteCache } from '../../providers/RouteCache/index.js'
import { useRouteTransition } from '../../providers/RouteTransition/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { useWindowInfo } from '../../providers/WindowInfo/index.js'
import { ListSelection } from '../CollectionFolder/ListSelection/index.js'
import './index.scss'

const baseClass = 'folder-list'

export function DefaultBrowseByFolderView({
  activeCollectionFolderSlugs,
  allCollectionFolderSlugs,
  allowCreateCollectionSlugs,
  baseFolderPath,
  breadcrumbs,
  documents,
  folderFieldName,
  folderID,
  FolderResultsComponent,
  search,
  subfolders,
  ...restOfProps
}: FolderListViewClientProps) {
  return (
    <FolderProvider
      activeCollectionFolderSlugs={activeCollectionFolderSlugs}
      allCollectionFolderSlugs={allCollectionFolderSlugs}
      allowCreateCollectionSlugs={allowCreateCollectionSlugs}
      baseFolderPath={baseFolderPath}
      breadcrumbs={breadcrumbs}
      documents={documents}
      folderFieldName={folderFieldName}
      folderID={folderID}
      FolderResultsComponent={FolderResultsComponent}
      search={search}
      subfolders={subfolders}
    >
      <BrowseByFolderViewInContext {...restOfProps} />
    </FolderProvider>
  )
}

type BrowseByFolderViewInContextProps = Omit<
  FolderListViewClientProps,
  | 'activeCollectionFolderSlugs'
  | 'allCollectionFolderSlugs'
  | 'allowCreateCollectionSlugs'
  | 'baseFolderPath'
  | 'breadcrumbs'
  | 'documents'
  | 'folderFieldName'
  | 'folderID'
  | 'FolderResultsComponent'
  | 'subfolders'
>

function BrowseByFolderViewInContext(props: BrowseByFolderViewInContextProps) {
  const {
    AfterFolderList,
    AfterFolderListTable,
    BeforeFolderList,
    BeforeFolderListTable,
    Description,
    disableBulkDelete,
    disableBulkEdit,
    folderAssignedCollections,
    viewPreference,
  } = props

  const router = useRouter()
  const { getEntityConfig } = useConfig()
  const { i18n, t } = useTranslation()
  const drawerDepth = useEditDepth()
  const { setStepNav } = useStepNav()
  const { startRouteTransition } = useRouteTransition()
  const { clearRouteCache } = useRouteCache()
  const {
    breakpoints: { s: smallBreak },
  } = useWindowInfo()
  const { setPreference } = usePreferences()
  const {
    activeCollectionFolderSlugs: visibleCollectionSlugs,
    allowCreateCollectionSlugs,
    breadcrumbs,
    documents,
    dragOverlayItem,
    folderCollectionConfig,
    folderID,
    folderType,
    getFolderRoute,
    getSelectedItems,
    moveToFolder,
    refineFolderData,
    search,
    selectedItemKeys,
    setIsDragging,
    subfolders,
  } = useFolder()

  const [activeView, setActiveView] = React.useState<'grid' | 'list'>(viewPreference || 'grid')
  const [searchPlaceholder] = React.useState(() => {
    const locationLabel =
      breadcrumbs.length === 0
        ? getTranslation(folderCollectionConfig.labels?.plural, i18n)
        : breadcrumbs[breadcrumbs.length - 1].name
    return t('folder:searchByNameInFolder', {
      folderName: locationLabel,
    })
  })

  const onDragEnd = React.useCallback(
    async (event: DragEndEvent) => {
      if (!event.over) {
        return
      }

      if (event.over.data.current.type === 'folder' && 'id' in event.over.data.current) {
        await moveToFolder({
          itemsToMove: getSelectedItems(),
          toFolderID: event.over.data.current.id || null,
        })
        clearRouteCache()
      }
    },
    [moveToFolder, getSelectedItems, clearRouteCache],
  )

  const totalDocsAndSubfolders = documents.length + subfolders.length
  const listHeaderTitle = !breadcrumbs.length
    ? t('folder:browseByFolder')
    : breadcrumbs[breadcrumbs.length - 1].name
  const noResultsLabel = visibleCollectionSlugs.reduce((acc, slug, index, array) => {
    const collectionConfig = getEntityConfig({ collectionSlug: slug })
    if (index === 0) {
      return getTranslation(collectionConfig.labels?.plural, i18n)
    }
    if (index === array.length - 1) {
      return `${acc} ${t('general:or').toLowerCase()} ${getTranslation(collectionConfig.labels?.plural, i18n)}`
    }
    return `${acc}, ${getTranslation(collectionConfig.labels?.plural, i18n)}`
  }, '')

  const handleSetViewType = React.useCallback(
    (view: 'grid' | 'list') => {
      void setPreference('browse-by-folder', {
        viewPreference: view,
      })
      setActiveView(view)
    },
    [setPreference],
  )

  React.useEffect(() => {
    if (!drawerDepth) {
      setStepNav([
        !breadcrumbs.length
          ? {
              label: (
                <div className={`${baseClass}__step-nav-icon-label`} key="root">
                  <ColoredFolderIcon />
                  {t('folder:browseByFolder')}
                </div>
              ),
            }
          : {
              label: (
                <DroppableBreadcrumb
                  className={[
                    `${baseClass}__step-nav-droppable`,
                    `${baseClass}__step-nav-icon-label`,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  id={null}
                  key="root"
                  onClick={() => {
                    startRouteTransition(() => {
                      router.push(getFolderRoute(null))
                    })
                  }}
                >
                  <ColoredFolderIcon />
                  {t('folder:browseByFolder')}
                </DroppableBreadcrumb>
              ),
            },
        ...breadcrumbs.map((crumb, crumbIndex) => {
          return {
            label:
              crumbIndex === breadcrumbs.length - 1 ? (
                crumb.name
              ) : (
                <DroppableBreadcrumb
                  className={`${baseClass}__step-nav-droppable`}
                  id={crumb.id}
                  key={crumb.id}
                  onClick={() => {
                    startRouteTransition(() => {
                      router.push(getFolderRoute(crumb.id))
                    })
                  }}
                >
                  {crumb.name}
                </DroppableBreadcrumb>
              ),
          }
        }),
      ])
    }
  }, [breadcrumbs, drawerDepth, getFolderRoute, router, setStepNav, startRouteTransition, t])

  const nonFolderCollectionSlugs = allowCreateCollectionSlugs.filter(
    (slug) => slug !== folderCollectionConfig.slug,
  )

  return (
    <Fragment>
      <DndEventListener onDragEnd={onDragEnd} setIsDragging={setIsDragging} />
      <div className={`${baseClass} ${baseClass}--folders`}>
        {BeforeFolderList}
        <Gutter className={`${baseClass}__wrap`}>
          <ListHeader
            Actions={[
              !smallBreak && (
                <ListSelection
                  disableBulkDelete={disableBulkDelete}
                  disableBulkEdit={disableBulkEdit}
                  folderAssignedCollections={folderAssignedCollections}
                  key="list-selection"
                />
              ),
            ].filter(Boolean)}
            AfterListHeaderContent={Description}
            title={listHeaderTitle}
            TitleActions={[
              allowCreateCollectionSlugs.length && (
                <ListCreateNewDocInFolderButton
                  buttonLabel={
                    allowCreateCollectionSlugs.length > 1
                      ? t('general:createNew')
                      : `${t('general:create')} ${getTranslation(folderCollectionConfig.labels?.singular, i18n).toLowerCase()}`
                  }
                  collectionSlugs={allowCreateCollectionSlugs}
                  folderAssignedCollections={Array.isArray(folderType) ? folderType : []}
                  key="create-new-button"
                  onCreateSuccess={clearRouteCache}
                  slugPrefix="create-document--header-pill"
                />
              ),
            ].filter(Boolean)}
          />
          <SearchBar
            Actions={[
              <SortByPill key="sort-by-pill" />,
              folderID && <FilterFolderTypePill key="collection-type" />,
              <ToggleViewButtons
                activeView={activeView}
                key="toggle-view-buttons"
                setActiveView={handleSetViewType}
              />,
              <CurrentFolderActions key="current-folder-actions" />,
            ].filter(Boolean)}
            label={searchPlaceholder}
            onSearchChange={(search) => refineFolderData({ query: { search }, updateURL: true })}
            searchQueryParam={search}
          />
          {BeforeFolderListTable}
          {totalDocsAndSubfolders > 0 && (
            <>
              {activeView === 'grid' ? (
                <div>
                  {subfolders.length ? (
                    <>
                      <ItemCardGrid items={subfolders} title={'Folders'} type="folder" />
                    </>
                  ) : null}

                  {documents.length ? (
                    <>
                      <ItemCardGrid
                        items={documents}
                        subfolderCount={subfolders.length}
                        title={'Documents'}
                        type="file"
                      />
                    </>
                  ) : null}
                </div>
              ) : (
                <FolderFileTable />
              )}
            </>
          )}
          {totalDocsAndSubfolders === 0 && (
            <NoListResults
              Actions={[
                allowCreateCollectionSlugs.includes(folderCollectionConfig.slug) && (
                  <ListCreateNewDocInFolderButton
                    buttonLabel={`${t('general:create')} ${getTranslation(folderCollectionConfig.labels?.singular, i18n).toLowerCase()}`}
                    collectionSlugs={[folderCollectionConfig.slug]}
                    folderAssignedCollections={Array.isArray(folderType) ? folderType : []}
                    key="create-folder"
                    onCreateSuccess={clearRouteCache}
                    slugPrefix="create-folder--no-results"
                  />
                ),
                folderID && nonFolderCollectionSlugs.length > 0 && (
                  <ListCreateNewDocInFolderButton
                    buttonLabel={`${t('general:create')} ${t('general:document').toLowerCase()}`}
                    collectionSlugs={nonFolderCollectionSlugs}
                    folderAssignedCollections={Array.isArray(folderType) ? folderType : []}
                    key="create-document"
                    onCreateSuccess={clearRouteCache}
                    slugPrefix="create-document--no-results"
                  />
                ),
              ].filter(Boolean)}
              Message={
                <p>
                  {i18n.t('general:noResults', {
                    label: noResultsLabel,
                  })}
                </p>
              }
            />
          )}
          {AfterFolderListTable}
        </Gutter>
        {AfterFolderList}
      </div>
      {selectedItemKeys.size > 0 && dragOverlayItem && (
        <DragOverlaySelection item={dragOverlayItem} selectedCount={selectedItemKeys.size} />
      )}
    </Fragment>
  )
}
function DndEventListener({ onDragEnd, setIsDragging }) {
  useDndMonitor({
    onDragCancel() {
      setIsDragging(false)
    },
    onDragEnd(event) {
      setIsDragging(false)
      onDragEnd(event)
    },
    onDragStart() {
      setIsDragging(true)
    },
  })

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/views/CollectionFolder/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .collection-folder-list {
    width: 100%;

    &__step-nav-icon-label,
    &__step-nav-icon-label .btn__label {
      margin: 0;
      display: flex;
      align-items: center;
      gap: calc(var(--base) * 0.25);

      .icon {
        height: 18px;
      }
    }

    &__step-nav-droppable.droppable-button {
      &--hover {
        opacity: 0.3;
      }
    }

    &__wrap {
      padding-bottom: var(--spacing-view-bottom);

      & > *:not(:last-child) {
        margin-bottom: var(--base);
      }
    }

    .cell-with-icon {
      display: flex;
      align-items: center;
      gap: calc(var(--base) * 0.5);
    }

    .list-header {
      a {
        text-decoration: none;
      }
    }

    &__sub-header {
      flex-basis: 100%;
    }

    .table {
      table {
        width: 100%;
        overflow: auto;

        [class^='cell'] > p,
        [class^='cell'] > span,
        [class^='cell'] > a {
          line-clamp: 4;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 4;
          overflow: hidden;
          display: -webkit-box;
          max-width: 100vw;
        }
      }
    }

    &__no-results {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--base);

      & > * {
        margin: 0;
      }
    }

    &__page-controls {
      width: 100%;
      display: flex;
      align-items: center;
    }

    .paginator {
      margin-bottom: 0;
    }

    &__page-info {
      [dir='ltr'] & {
        margin-right: base(1);
        margin-left: auto;
      }
      [dir='rtl'] & {
        margin-left: base(1);
        margin-right: auto;
      }
    }

    &__shimmer {
      margin-top: base(1.75);
      width: 100%;
      > div {
        margin-top: 8px;
      }
    }

    @include mid-break {
      margin-top: base(0.25);

      &__wrap {
        padding-top: 0;
        padding-bottom: 0;
      }

      &__header {
        gap: base(0.5);
      }

      &__sub-header {
        margin-top: 0;
      }

      &__search-input {
        margin: 0;
      }

      // on mobile, extend the table all the way to the viewport edges
      // this is to visually indicate overflowing content
      .table {
        display: flex;
        width: calc(100% + calc(var(--gutter-h) * 2));
        max-width: unset;
        left: calc(var(--gutter-h) * -1);
        position: relative;
        padding-left: var(--gutter-h);

        &::after {
          content: '';
          height: 1px;
          padding-right: var(--gutter-h);
        }
      }

      &__page-controls {
        flex-wrap: wrap;
      }

      &__page-info {
        margin-left: 0;
      }

      .paginator {
        width: 100%;
        margin-bottom: $baseline;
      }
    }

    @include small-break {
      margin-bottom: base(2.4);
    }
  }
}
```

--------------------------------------------------------------------------------

````
