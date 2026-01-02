---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 409
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 409 of 695)

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

---[FILE: findValueFromPath.ts]---
Location: payload-main/packages/ui/src/providers/TableColumns/buildColumnState/findValueFromPath.ts

```typescript
/**
 * Safely resolves a deeply nested value from a document using dot-notation accessor paths.
 *
 * Used in list views to retrieve field values, especially for fields hoisted from nested structures
 * like groups, where the accessor may be in the form of `group.someField`.
 *
 * @param doc - The document object to retrieve the value from.
 * @param path - A dot-separated accessor string (e.g., "group.someField").
 * @returns The resolved value at the specified path, or undefined if any segment is missing.
 */
export const findValueFromPath = (doc: Record<string, any>, path: string): any => {
  return path.split('.').reduce((acc, key) => acc?.[key], doc)
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/providers/TableColumns/buildColumnState/index.tsx
Signals: React

```typescript
import type { I18nClient } from '@payloadcms/translations'
import type {
  ClientComponentProps,
  ClientField,
  CollectionPreferences,
  CollectionSlug,
  Column,
  DefaultCellComponentProps,
  Document,
  Field,
  PaginatedDocs,
  Payload,
  PayloadRequest,
  SanitizedCollectionConfig,
  SanitizedFieldsPermissions,
  ServerComponentProps,
  StaticLabel,
  ViewTypes,
} from 'payload'

import {
  fieldIsHiddenOrDisabled,
  fieldIsID,
  fieldIsPresentationalOnly,
  flattenTopLevelFields,
} from 'payload/shared'
import React from 'react'

import type { SortColumnProps } from '../../../elements/SortColumn/index.js'

import { RenderServerComponent } from '../../../elements/RenderServerComponent/index.js'
import {
  SortColumn,
  // eslint-disable-next-line payload/no-imports-from-exports-dir -- MUST reference the exports dir: https://github.com/payloadcms/payload/issues/12002#issuecomment-2791493587
} from '../../../exports/client/index.js'
import { filterFieldsWithPermissions } from './filterFieldsWithPermissions.js'
import { isColumnActive } from './isColumnActive.js'
import { renderCell } from './renderCell.js'
import { sortFieldMap } from './sortFieldMap.js'

export type BuildColumnStateArgs = {
  beforeRows?: Column[]
  clientFields: ClientField[]
  columns?: CollectionPreferences['columns']
  customCellProps: DefaultCellComponentProps['customCellProps']
  enableLinkedCell?: boolean
  enableRowSelections: boolean
  enableRowTypes?: boolean
  fieldPermissions?: SanitizedFieldsPermissions
  i18n: I18nClient
  payload: Payload
  req?: PayloadRequest
  serverFields: Field[]
  sortColumnProps?: Partial<SortColumnProps>
  useAsTitle: SanitizedCollectionConfig['admin']['useAsTitle']
  viewType?: ViewTypes
} & (
  | {
      collectionSlug: CollectionSlug
      dataType: 'monomorphic'
      docs: PaginatedDocs['docs']
    }
  | {
      collectionSlug?: undefined
      dataType: 'polymorphic'
      docs: {
        relationTo: CollectionSlug
        value: Document
      }[]
    }
)

export const buildColumnState = (args: BuildColumnStateArgs): Column[] => {
  const {
    beforeRows,
    clientFields,
    collectionSlug,
    columns,
    customCellProps,
    dataType,
    docs,
    enableLinkedCell = true,
    enableRowSelections,
    fieldPermissions,
    i18n,
    payload,
    req,
    serverFields,
    sortColumnProps,
    useAsTitle,
    viewType,
  } = args

  // clientFields contains the fake `id` column
  let sortedFieldMap = flattenTopLevelFields(
    filterFieldsWithPermissions({ fieldPermissions, fields: clientFields }),
    {
      i18n,
      keepPresentationalFields: true,
      moveSubFieldsToTop: true,
    },
  ) as ClientField[]

  let _sortedFieldMap = flattenTopLevelFields(
    filterFieldsWithPermissions({
      fieldPermissions,
      fields: serverFields,
    }),
    {
      i18n,
      keepPresentationalFields: true,
      moveSubFieldsToTop: true,
    },
  ) as Field[] // TODO: think of a way to avoid this additional flatten

  // place the `ID` field first, if it exists
  // do the same for the `useAsTitle` field with precedence over the `ID` field
  // then sort the rest of the fields based on the `defaultColumns` or `columns`
  const idFieldIndex = sortedFieldMap?.findIndex((field) => fieldIsID(field))

  if (idFieldIndex > -1) {
    const idField = sortedFieldMap.splice(idFieldIndex, 1)[0]
    sortedFieldMap.unshift(idField)
  }

  const useAsTitleFieldIndex = useAsTitle
    ? sortedFieldMap.findIndex((field) => 'name' in field && field.name === useAsTitle)
    : -1

  if (useAsTitleFieldIndex > -1) {
    const useAsTitleField = sortedFieldMap.splice(useAsTitleFieldIndex, 1)[0]
    sortedFieldMap.unshift(useAsTitleField)
  }

  const sortTo = columns

  if (sortTo) {
    // sort the fields to the order of `defaultColumns` or `columns`
    sortedFieldMap = sortFieldMap<ClientField>(sortedFieldMap, sortTo)
    _sortedFieldMap = sortFieldMap<Field>(_sortedFieldMap, sortTo) // TODO: think of a way to avoid this additional sort
  }

  const activeColumnsIndices = []

  const sorted: Column[] = sortedFieldMap?.reduce((acc, clientField, colIndex) => {
    if (fieldIsHiddenOrDisabled(clientField) && !fieldIsID(clientField)) {
      return acc
    }

    const accessor =
      (clientField as any).accessor ?? ('name' in clientField ? clientField.name : undefined)

    const serverField = _sortedFieldMap.find((f) => {
      const fAccessor = (f as any).accessor ?? ('name' in f ? f.name : undefined)
      return fAccessor === accessor
    })

    const hasCustomCell =
      serverField?.admin &&
      'components' in serverField.admin &&
      serverField.admin.components &&
      'Cell' in serverField.admin.components &&
      serverField.admin.components.Cell

    if (serverField && serverField.type === 'group' && !hasCustomCell) {
      return acc // skip any group without a custom cell
    }

    const columnPref = columns?.find(
      (preference) => clientField && 'name' in clientField && preference.accessor === accessor,
    )

    const isActive = isColumnActive({
      accessor,
      activeColumnsIndices,
      column: columnPref,
      columns,
    })

    if (isActive && !activeColumnsIndices.includes(colIndex)) {
      activeColumnsIndices.push(colIndex)
    }

    let CustomLabel = undefined

    if (dataType === 'monomorphic') {
      const CustomLabelToRender =
        serverField &&
        'admin' in serverField &&
        'components' in serverField.admin &&
        'Label' in serverField.admin.components &&
        serverField.admin.components.Label !== undefined // let it return `null`
          ? serverField.admin.components.Label
          : undefined

      // TODO: customComponent will be optional in v4
      const clientProps: Omit<ClientComponentProps, 'customComponents'> = {
        field: clientField,
      }

      const customLabelServerProps: Pick<
        ServerComponentProps,
        'clientField' | 'collectionSlug' | 'field' | 'i18n' | 'payload'
      > = {
        clientField,
        collectionSlug,
        field: serverField,
        i18n,
        payload,
      }

      CustomLabel = CustomLabelToRender
        ? RenderServerComponent({
            clientProps,
            Component: CustomLabelToRender,
            importMap: payload.importMap,
            serverProps: customLabelServerProps,
          })
        : undefined
    }

    const fieldAffectsDataSubFields =
      clientField &&
      clientField.type &&
      (clientField.type === 'array' ||
        clientField.type === 'group' ||
        clientField.type === 'blocks')

    const label =
      clientField && 'labelWithPrefix' in clientField && clientField.labelWithPrefix !== undefined
        ? clientField.labelWithPrefix
        : 'label' in clientField
          ? clientField.label
          : undefined

    // Convert accessor to dot notation specifically for SortColumn sorting behavior
    const dotAccessor = accessor?.replace(/-/g, '.')

    const Heading = (
      <SortColumn
        disable={fieldAffectsDataSubFields || fieldIsPresentationalOnly(clientField) || undefined}
        Label={CustomLabel}
        label={label as StaticLabel}
        name={dotAccessor}
        {...(sortColumnProps || {})}
      />
    )

    const column: Column = {
      accessor,
      active: isActive,
      CustomLabel,
      field: clientField,
      Heading,
      renderedCells: isActive
        ? docs.map((doc, rowIndex) => {
            return renderCell({
              clientField,
              collectionSlug: dataType === 'monomorphic' ? collectionSlug : doc.relationTo,
              columnIndex: colIndex,
              customCellProps,
              doc: dataType === 'monomorphic' ? doc : doc.value,
              enableRowSelections,
              i18n,
              isLinkedColumn: enableLinkedCell && colIndex === activeColumnsIndices[0],
              payload,
              req,
              rowIndex,
              serverField,
              viewType,
            })
          })
        : [],
    }

    acc.push(column)

    return acc
  }, [])

  if (beforeRows) {
    sorted.unshift(...beforeRows)
  }

  return sorted
}
```

--------------------------------------------------------------------------------

---[FILE: isColumnActive.ts]---
Location: payload-main/packages/ui/src/providers/TableColumns/buildColumnState/isColumnActive.ts

```typescript
import type { ColumnPreference } from 'payload'

export function isColumnActive({
  accessor,
  activeColumnsIndices,
  column,
  columns,
}: {
  accessor: string
  activeColumnsIndices: number[]
  column: ColumnPreference
  columns: ColumnPreference[]
}) {
  if (column) {
    return column.active
  } else if (columns && Array.isArray(columns) && columns.length > 0) {
    return Boolean(columns.find((col) => col.accessor === accessor)?.active)
  } else if (activeColumnsIndices.length < 4) {
    return true
  }

  return false
}
```

--------------------------------------------------------------------------------

---[FILE: renderCell.tsx]---
Location: payload-main/packages/ui/src/providers/TableColumns/buildColumnState/renderCell.tsx

```typescript
import type { I18nClient } from '@payloadcms/translations'
import type {
  ClientField,
  DefaultCellComponentProps,
  DefaultServerCellComponentProps,
  Document,
  Field,
  Payload,
  PayloadRequest,
  ViewTypes,
} from 'payload'

import { MissingEditorProp } from 'payload'
import { formatAdminURL } from 'payload/shared'

import { RenderCustomComponent } from '../../../elements/RenderCustomComponent/index.js'
import { RenderServerComponent } from '../../../elements/RenderServerComponent/index.js'
import {
  DefaultCell,
  RenderDefaultCell,
  // eslint-disable-next-line payload/no-imports-from-exports-dir -- MUST reference the exports dir: https://github.com/payloadcms/payload/issues/12002#issuecomment-2791493587
} from '../../../exports/client/index.js'
import { hasOptionLabelJSXElement } from '../../../utilities/hasOptionLabelJSXElement.js'
import { findValueFromPath } from './findValueFromPath.js'

type RenderCellArgs = {
  readonly clientField: ClientField
  readonly collectionSlug: string
  readonly columnIndex: number
  readonly customCellProps: DefaultCellComponentProps['customCellProps']
  readonly doc: Document
  readonly enableRowSelections: boolean
  readonly i18n: I18nClient
  readonly isLinkedColumn: boolean
  readonly payload: Payload
  readonly req?: PayloadRequest
  readonly rowIndex: number
  readonly serverField: Field
  readonly viewType?: ViewTypes
}
export function renderCell({
  clientField,
  collectionSlug,
  columnIndex,
  customCellProps,
  doc,
  enableRowSelections,
  i18n,
  isLinkedColumn,
  payload,
  req,
  rowIndex,
  serverField,
  viewType,
}: RenderCellArgs) {
  const baseCellClientProps: DefaultCellComponentProps = {
    cellData: undefined,
    collectionSlug,
    customCellProps,
    field: clientField,
    rowData: undefined,
    viewType,
  }

  const accessor: string | undefined =
    ('accessor' in clientField ? (clientField.accessor as string) : undefined) ??
    ('name' in clientField ? clientField.name : undefined)

  // Check if there's a custom formatDocURL function for this linked column
  let shouldLink = isLinkedColumn
  let customLinkURL: string | undefined

  if (isLinkedColumn && req) {
    const collectionConfig = payload.collections[collectionSlug]?.config
    const formatDocURL = collectionConfig?.admin?.formatDocURL

    if (typeof formatDocURL === 'function') {
      // Generate the default URL that would normally be used
      const adminRoute = req.payload.config.routes?.admin || '/admin'
      const defaultURL = formatAdminURL({
        adminRoute,
        path: `/collections/${collectionSlug}${viewType === 'trash' ? '/trash' : ''}/${encodeURIComponent(String(doc.id))}`,
        serverURL: req.payload.config.serverURL,
      })

      const customURL = formatDocURL({
        collectionSlug,
        defaultURL,
        doc,
        req,
        viewType,
      })

      if (customURL === null) {
        // formatDocURL returned null = disable linking entirely
        shouldLink = false
      } else if (typeof customURL === 'string') {
        // formatDocURL returned a string = use custom URL
        shouldLink = true
        customLinkURL = customURL
      } else {
        // formatDocURL returned unexpected type = disable linking for safety
        shouldLink = false
      }
    }
  }

  // For _status field, use _displayStatus if available (for showing "changed" status in list view)
  const cellData =
    'name' in clientField && accessor === '_status' && '_displayStatus' in doc
      ? doc._displayStatus
      : 'name' in clientField
        ? findValueFromPath(doc, accessor)
        : undefined

  // For _status field, add 'changed' option for display purposes
  // The 'changed' status is computed at runtime
  let enrichedClientField = clientField
  if ('name' in clientField && accessor === '_status' && clientField.type === 'select') {
    const hasChangedOption = clientField.options?.some(
      (opt) => (typeof opt === 'object' ? opt.value : opt) === 'changed',
    )
    if (!hasChangedOption) {
      enrichedClientField = {
        ...clientField,
        options: [
          ...(clientField.options || []),
          {
            label: i18n.t('version:draftHasPublishedVersion'),
            value: 'changed',
          },
        ],
      }
    }
  }

  const cellClientProps: DefaultCellComponentProps = {
    ...baseCellClientProps,
    cellData,
    field: enrichedClientField,
    link: shouldLink,
    linkURL: customLinkURL,
    rowData: doc,
  }

  const cellServerProps: DefaultServerCellComponentProps = {
    cellData: cellClientProps.cellData,
    className: baseCellClientProps.className,
    collectionConfig: payload.collections[collectionSlug].config,
    collectionSlug,
    columnIndex,
    customCellProps: baseCellClientProps.customCellProps,
    field: serverField,
    i18n,
    link: shouldLink,
    linkURL: customLinkURL,
    onClick: baseCellClientProps.onClick,
    payload,
    rowData: doc,
  }

  let CustomCell = null

  if (serverField?.type === 'richText') {
    if (!serverField?.editor) {
      throw new MissingEditorProp(serverField) // while we allow disabling editor functionality, you should not have any richText fields defined if you do not have an editor
    }

    if (typeof serverField?.editor === 'function') {
      throw new Error('Attempted to access unsanitized rich text editor.')
    }

    if (!serverField.admin) {
      serverField.admin = {}
    }

    if (!serverField.admin.components) {
      serverField.admin.components = {}
    }

    CustomCell = RenderServerComponent({
      clientProps: cellClientProps,
      Component: serverField.editor.CellComponent,
      importMap: payload.importMap,
      serverProps: cellServerProps,
    })
  } else {
    const CustomCellComponent = serverField?.admin?.components?.Cell

    if (CustomCellComponent) {
      CustomCell = RenderServerComponent({
        clientProps: cellClientProps,
        Component: CustomCellComponent,
        importMap: payload.importMap,
        serverProps: cellServerProps,
      })
    } else if (
      cellClientProps.cellData &&
      cellClientProps.field &&
      hasOptionLabelJSXElement(cellClientProps)
    ) {
      CustomCell = RenderServerComponent({
        clientProps: cellClientProps,
        Component: DefaultCell,
        importMap: payload.importMap,
      })
    } else {
      const CustomCellComponent = serverField?.admin?.components?.Cell

      if (CustomCellComponent) {
        CustomCell = RenderServerComponent({
          clientProps: cellClientProps,
          Component: CustomCellComponent,
          importMap: payload.importMap,
          serverProps: cellServerProps,
        })
      } else {
        CustomCell = undefined
      }
    }
  }

  return (
    <RenderCustomComponent
      CustomComponent={CustomCell}
      Fallback={
        <RenderDefaultCell
          clientProps={cellClientProps}
          columnIndex={columnIndex}
          enableRowSelections={enableRowSelections}
          isLinkedColumn={isLinkedColumn}
        />
      }
      key={`${rowIndex}-${columnIndex}`}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: sortFieldMap.ts]---
Location: payload-main/packages/ui/src/providers/TableColumns/buildColumnState/sortFieldMap.ts

```typescript
import type { ClientField, ColumnPreference, Field } from 'payload'

function getAccessor(field) {
  return field.accessor ?? ('name' in field ? field.name : undefined)
}

export function sortFieldMap<T extends ClientField | Field>(
  fieldMap: T[],
  sortTo: ColumnPreference[],
): T[] {
  return fieldMap?.sort((a, b) => {
    const aIndex = sortTo.findIndex((column) => 'name' in a && column.accessor === getAccessor(a))
    const bIndex = sortTo.findIndex((column) => 'name' in b && column.accessor === getAccessor(b))

    if (aIndex === -1 && bIndex === -1) {
      return 0
    }

    if (aIndex === -1) {
      return 1
    }

    if (bIndex === -1) {
      return -1
    }

    return aIndex - bIndex
  })
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/providers/TableColumns/RenderDefaultCell/index.scss

```text
@import '../../../scss/styles.scss';

@layer payload-default {
  .default-cell {
    &__first-cell {
      border: 0;
      background-color: transparent;
      padding: 0;
      cursor: pointer;
      text-decoration: underline;
      text-align: left;
      white-space: nowrap;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/providers/TableColumns/RenderDefaultCell/index.tsx
Signals: React

```typescript
'use client'
import type { DefaultCellComponentProps } from 'payload'

import React from 'react'

import { useListDrawerContext } from '../../../elements/ListDrawer/Provider.js'
import { DefaultCell } from '../../../elements/Table/DefaultCell/index.js'
import { useTableColumns } from '../../../providers/TableColumns/index.js'
import './index.scss'

const baseClass = 'default-cell'

const CellPropsContext = React.createContext<DefaultCellComponentProps | null>(null)

export const useCellProps = (): DefaultCellComponentProps | null => React.use(CellPropsContext)

export const RenderDefaultCell: React.FC<{
  clientProps: DefaultCellComponentProps
  columnIndex: number
  enableRowSelections?: boolean
  isLinkedColumn?: boolean
}> = ({ clientProps, columnIndex, isLinkedColumn }) => {
  const { drawerSlug, onSelect } = useListDrawerContext()
  const { LinkedCellOverride } = useTableColumns()

  const propsToPass: DefaultCellComponentProps = {
    ...clientProps,
    columnIndex,
  }

  if (isLinkedColumn && drawerSlug) {
    propsToPass.className = `${baseClass}__first-cell`
    propsToPass.link = false
    propsToPass.onClick = ({ collectionSlug: rowColl, rowData }) => {
      if (typeof onSelect === 'function') {
        onSelect({
          collectionSlug: rowColl,
          doc: rowData,
          docID: rowData.id as string,
        })
      }
    }
  }

  return (
    <CellPropsContext value={propsToPass}>
      {isLinkedColumn && LinkedCellOverride ? LinkedCellOverride : <DefaultCell {...propsToPass} />}
    </CellPropsContext>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/providers/Theme/index.tsx
Signals: React

```typescript
'use client'
import React, { createContext, use, useCallback, useEffect, useState } from 'react'

import { useConfig } from '../Config/index.js'

export type Theme = 'dark' | 'light'

export type ThemeContext = {
  autoMode: boolean
  setTheme: (theme: Theme) => void
  theme: Theme
}

const initialContext: ThemeContext = {
  autoMode: true,
  setTheme: () => null,
  theme: 'light',
}

const Context = createContext(initialContext)

function setCookie(cname, cvalue, exdays) {
  const d = new Date()
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000)
  const expires = 'expires=' + d.toUTCString()
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/'
}

const getTheme = (
  cookieKey,
): {
  theme: Theme
  themeFromCookies: null | string
} => {
  let theme: Theme

  const themeFromCookies = window.document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${cookieKey}=`))
    ?.split('=')[1]

  if (themeFromCookies === 'light' || themeFromCookies === 'dark') {
    theme = themeFromCookies
  } else {
    theme =
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
  }

  document.documentElement.setAttribute('data-theme', theme)

  return { theme, themeFromCookies }
}

export const defaultTheme = 'light'

export const ThemeProvider: React.FC<{
  children?: React.ReactNode
  theme?: Theme
}> = ({ children, theme: initialTheme }) => {
  const { config } = useConfig()

  const preselectedTheme = config.admin.theme
  const cookieKey = `${config.cookiePrefix || 'payload'}-theme`

  const [theme, setThemeState] = useState<Theme>(initialTheme || defaultTheme)

  const [autoMode, setAutoMode] = useState<boolean>()

  useEffect(() => {
    if (preselectedTheme !== 'all') {
      return
    }

    const { theme, themeFromCookies } = getTheme(cookieKey)
    setThemeState(theme)
    setAutoMode(!themeFromCookies)
  }, [preselectedTheme, cookieKey])

  const setTheme = useCallback(
    (themeToSet: 'auto' | Theme) => {
      if (themeToSet === 'light' || themeToSet === 'dark') {
        setThemeState(themeToSet)
        setAutoMode(false)
        setCookie(cookieKey, themeToSet, 365)
        document.documentElement.setAttribute('data-theme', themeToSet)
      } else if (themeToSet === 'auto') {
        // to delete the cookie, we set an expired date
        setCookie(cookieKey, themeToSet, -1)
        const themeFromOS =
          window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light'
        document.documentElement.setAttribute('data-theme', themeFromOS)
        setAutoMode(true)
        setThemeState(themeFromOS)
      }
    },
    [cookieKey],
  )

  return <Context value={{ autoMode, setTheme, theme }}>{children}</Context>
}

export const useTheme = (): ThemeContext => use(Context)
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/providers/ToastContainer/index.tsx
Signals: React

```typescript
'use client'
import type { ClientConfig } from 'payload'

import React from 'react'
import { Toaster } from 'sonner'

import { Error } from './icons/Error.js'
import { Info } from './icons/Info.js'
import { Success } from './icons/Success.js'
import { Warning } from './icons/Warning.js'

export const ToastContainer: React.FC<{
  config: ClientConfig
}> = ({ config }) => {
  const { admin: { toast: { duration, expand, limit, position } = {} } = {} } = config

  return (
    <Toaster
      className="payload-toast-container"
      closeButton
      // @ts-expect-error
      dir="undefined"
      duration={duration ?? 4000}
      expand={expand ?? false}
      gap={8}
      icons={{
        error: <Error />,
        info: <Info />,
        success: <Success />,
        warning: <Warning />,
      }}
      offset="calc(var(--gutter-h) / 2)"
      position={position ?? 'bottom-right'}
      toastOptions={{
        classNames: {
          closeButton: 'payload-toast-close-button',
          content: 'toast-content',
          error: 'toast-error',
          icon: 'toast-icon',
          info: 'toast-info',
          success: 'toast-success',
          title: 'toast-title',
          toast: 'payload-toast-item',
          warning: 'toast-warning',
        },
        unstyled: true,
      }}
      visibleToasts={limit ?? 5}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: Error.tsx]---
Location: payload-main/packages/ui/src/providers/ToastContainer/icons/Error.tsx
Signals: React

```typescript
'use client'
import React from 'react'

export const Error: React.FC = () => {
  return (
    <svg fill="none" height="26" viewBox="0 0 26 26" width="26" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13 21C17.4183 21 21 17.4183 21 13C21 8.58172 17.4183 5 13 5C8.58172 5 5 8.58172 5 13C5 17.4183 8.58172 21 13 21Z"
        fill="var(--theme-error-500)"
      />
      <path
        d="M15.4001 10.5996L10.6001 15.3996M10.6001 10.5996L15.4001 15.3996"
        stroke="var(--theme-error-50)"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: Info.tsx]---
Location: payload-main/packages/ui/src/providers/ToastContainer/icons/Info.tsx
Signals: React

```typescript
'use client'
import React from 'react'

export const Info: React.FC = () => {
  return (
    <svg fill="none" height="26" viewBox="0 0 26 26" width="26" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13 21C17.4183 21 21 17.4183 21 13C21 8.58172 17.4183 5 13 5C8.58172 5 5 8.58172 5 13C5 17.4183 8.58172 21 13 21Z"
        fill="var(--theme-elevation-500)"
      />
      <path
        d="M13 16.1998V12.9998M13 9.7998H13.0077"
        stroke="var(--theme-elevation-50)"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: Success.tsx]---
Location: payload-main/packages/ui/src/providers/ToastContainer/icons/Success.tsx
Signals: React

```typescript
'use client'
import React from 'react'

export const Success: React.FC = () => {
  return (
    <svg fill="none" height="26" viewBox="0 0 26 26" width="26" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13 21C17.4183 21 21 17.4183 21 13C21 8.58172 17.4183 5 13 5C8.58172 5 5 8.58172 5 13C5 17.4183 8.58172 21 13 21Z"
        fill="var(--theme-success-500)"
      />
      <path
        d="M10.6001 13.0004L12.2001 14.6004L15.4001 11.4004"
        stroke="var(--theme-success-50)"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: Warning.tsx]---
Location: payload-main/packages/ui/src/providers/ToastContainer/icons/Warning.tsx
Signals: React

```typescript
'use client'
import React from 'react'

export const Warning: React.FC = () => {
  return (
    <svg fill="none" height="26" viewBox="0 0 26 26" width="26" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13 21C17.4183 21 21 17.4183 21 13C21 8.58172 17.4183 5 13 5C8.58172 5 5 8.58172 5 13C5 17.4183 8.58172 21 13 21Z"
        fill="var(--theme-warning-500)"
      />
      <path
        d="M13 10V13.2M13 16.4H13.008"
        stroke="var(--theme-warning-50)"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/providers/Translation/index.tsx
Signals: React, Next.js

```typescript
'use client'
import type {
  AcceptedLanguages,
  ClientTranslationKeys,
  ClientTranslationsObject,
  I18nClient,
  I18nOptions,
  Language,
  TFunction,
} from '@payloadcms/translations'
import type { Locale } from 'date-fns'
import type { LanguageOptions } from 'payload'

import { importDateFNSLocale, t } from '@payloadcms/translations'
import { enUS } from 'date-fns/locale/en-US'
import { useRouter } from 'next/navigation.js'
import React, { createContext, use, useEffect, useState } from 'react'

type ContextType<
  TAdditionalTranslations = {},
  TAdditionalClientTranslationKeys extends string = never,
> = {
  i18n: [TAdditionalClientTranslationKeys] extends [never]
    ? I18nClient
    : TAdditionalTranslations extends object
      ? I18nClient<TAdditionalTranslations, TAdditionalClientTranslationKeys>
      : I18nClient<ClientTranslationsObject, TAdditionalClientTranslationKeys>
  languageOptions: LanguageOptions
  switchLanguage?: (lang: AcceptedLanguages) => Promise<void>
  t: TFunction<ClientTranslationKeys | Extract<TAdditionalClientTranslationKeys, string>>
}

const Context = createContext<ContextType<any, any>>({
  // Use `any` here to be replaced later with a more specific type when used
  i18n: {
    dateFNS: enUS,
    dateFNSKey: 'en-US',
    fallbackLanguage: 'en',
    language: 'en',
    t: (key) => key,
    translations: {} as any,
  },
  languageOptions: undefined,
  switchLanguage: undefined,
  t: (key) => undefined,
})

type Props = {
  children: React.ReactNode
  dateFNSKey: Language['dateFNSKey']
  fallbackLang: I18nOptions['fallbackLanguage']
  language: string
  languageOptions: LanguageOptions
  switchLanguageServerAction: (lang: string) => Promise<void>
  translations: I18nClient['translations']
}

export const TranslationProvider: React.FC<Props> = ({
  children,
  dateFNSKey,
  fallbackLang,
  language,
  languageOptions,
  switchLanguageServerAction,
  translations,
}) => {
  const router = useRouter()
  const [dateFNS, setDateFNS] = useState<Locale>()

  const nextT: ContextType['t'] = React.useCallback(
    (key, vars): string =>
      t({
        key,
        translations,
        vars,
      }),
    [translations],
  )

  const switchLanguage = React.useCallback(
    async (lang: string) => {
      try {
        await switchLanguageServerAction(lang)
        router.refresh()
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Error loading language: "${lang}"`, error)
      }
    },
    [switchLanguageServerAction, router],
  )

  useEffect(() => {
    const loadDateFNS = async () => {
      const imported = await importDateFNSLocale(dateFNSKey)

      setDateFNS(imported)
    }

    void loadDateFNS()
  }, [dateFNSKey])

  return (
    <Context
      value={{
        i18n: {
          dateFNS,
          dateFNSKey,
          fallbackLanguage: fallbackLang,
          language,
          t: nextT,
          translations,
        },
        languageOptions,
        switchLanguage,
        t: nextT,
      }}
    >
      {children}
    </Context>
  )
}

export const useTranslation = <
  TAdditionalTranslations = {},
  TAdditionalClientTranslationKeys extends string = never,
>() => use<ContextType<TAdditionalTranslations, TAdditionalClientTranslationKeys>>(Context)
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/providers/UploadControls/index.tsx
Signals: React

```typescript
'use client'
import React, { createContext, use, useState } from 'react'

export type UploadControlsContext = {
  setUploadControlFile: (file: File) => void
  setUploadControlFileName: (name: string) => void
  setUploadControlFileUrl: (url: string) => void
  uploadControlFile: File | null
  uploadControlFileName: null | string
  uploadControlFileUrl: string
}

const Context = createContext<UploadControlsContext>(undefined)

export const UploadControlsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [uploadControlFileName, setUploadControlFileName] = useState<null | string>(null)
  const [uploadControlFileUrl, setUploadControlFileUrl] = useState<string>('')
  const [uploadControlFile, setUploadControlFile] = useState<File | null>(null)

  return (
    <Context
      value={{
        setUploadControlFile,
        setUploadControlFileName,
        setUploadControlFileUrl,
        uploadControlFile,
        uploadControlFileName,
        uploadControlFileUrl,
      }}
    >
      {children}
    </Context>
  )
}

export const useUploadControls = (): UploadControlsContext => {
  const context = use(Context)
  if (!context) {
    throw new Error('useUploadControls must be used within an UploadControlsProvider')
  }
  return context
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/providers/UploadEdits/index.tsx
Signals: React

```typescript
'use client'
import type { UploadEdits } from 'payload'

import React from 'react'

export type UploadEditsProviderProps = {
  children: React.ReactNode
  initialUploadEdits?: UploadEdits
}
export type UploadEditsContext = {
  getUploadEdits: () => UploadEdits
  resetUploadEdits: () => void
  updateUploadEdits: (edits: UploadEdits) => void
  uploadEdits: UploadEdits
}

const Context = React.createContext<UploadEditsContext>({
  getUploadEdits: () => undefined,
  resetUploadEdits: undefined,
  updateUploadEdits: undefined,
  uploadEdits: undefined,
})

export const UploadEditsProvider = ({ children, initialUploadEdits }: UploadEditsProviderProps) => {
  const [uploadEdits, setUploadEdits] = React.useState<UploadEdits>(initialUploadEdits || {})

  const resetUploadEdits = () => {
    setUploadEdits({})
  }

  const updateUploadEdits = (edits: UploadEdits) => {
    setUploadEdits((prevEdits) => ({
      ...(prevEdits || {}),
      ...(edits || {}),
    }))
  }

  const getUploadEdits = () => uploadEdits

  return (
    <Context value={{ getUploadEdits, resetUploadEdits, updateUploadEdits, uploadEdits }}>
      {children}
    </Context>
  )
}

export const useUploadEdits = (): UploadEditsContext => React.use(Context)
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/providers/UploadHandlers/index.tsx
Signals: React

```typescript
'use client'
import type { UploadCollectionSlug } from 'payload'

import React, { useState } from 'react'

type UploadHandler = (args: {
  file: File
  updateFilename: (filename: string) => void
}) => Promise<unknown>

export type UploadHandlersContext = {
  getUploadHandler: (args: { collectionSlug: UploadCollectionSlug }) => null | UploadHandler
  setUploadHandler: (args: {
    collectionSlug: UploadCollectionSlug
    handler: UploadHandler
  }) => unknown
}

const Context = React.createContext<null | UploadHandlersContext>(null)

export const UploadHandlersProvider = ({ children }) => {
  const [uploadHandlers, setUploadHandlers] = useState<Map<UploadCollectionSlug, UploadHandler>>(
    () => new Map(),
  )

  const getUploadHandler: UploadHandlersContext['getUploadHandler'] = ({ collectionSlug }) => {
    return uploadHandlers.get(collectionSlug)
  }

  const setUploadHandler: UploadHandlersContext['setUploadHandler'] = ({
    collectionSlug,
    handler,
  }) => {
    setUploadHandlers((uploadHandlers) => {
      const clone = new Map(uploadHandlers)
      clone.set(collectionSlug, handler)
      return clone
    })
  }

  return <Context value={{ getUploadHandler, setUploadHandler }}>{children}</Context>
}

export const useUploadHandlers = (): UploadHandlersContext => {
  const context = React.use(Context)

  if (context === null) {
    throw new Error('useUploadHandlers must be used within UploadHandlersProvider')
  }

  return context
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/providers/WindowInfo/index.tsx

```typescript
'use client'
import * as facelessUIImport from '@faceless-ui/window-info'
const { WindowInfoProvider } =
  facelessUIImport && 'WindowInfoProvider' in facelessUIImport
    ? facelessUIImport
    : { WindowInfoProvider: undefined }
const { useWindowInfo } =
  facelessUIImport && 'useWindowInfo' in facelessUIImport
    ? facelessUIImport
    : { useWindowInfo: undefined }
export { useWindowInfo, WindowInfoProvider }
```

--------------------------------------------------------------------------------

````
