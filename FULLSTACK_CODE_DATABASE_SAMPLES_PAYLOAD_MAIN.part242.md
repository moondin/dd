---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 242
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 242 of 695)

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
Location: payload-main/packages/plugin-import-export/src/components/SortBy/index.tsx
Signals: React

```typescript
'use client'

import type { SelectFieldClientComponent } from 'payload'
import type { ReactNode } from 'react'

import {
  FieldLabel,
  ReactSelect,
  useConfig,
  useDocumentInfo,
  useField,
  useListQuery,
} from '@payloadcms/ui'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import { applySortOrder, normalizeQueryParam, stripSortDash } from '../../utilities/sortHelpers.js'
import { reduceFields } from '../FieldsToExport/reduceFields.js'
import { useImportExport } from '../ImportExportProvider/index.js'
import './index.scss'

const baseClass = 'sort-by-fields'

export const SortBy: SelectFieldClientComponent = (props) => {
  const { id } = useDocumentInfo()

  // The "sort" text field that stores 'title' or '-title'
  const { setValue: setSort, value: sortRaw } = useField<string>()

  // Sibling order field ('asc' | 'desc') used when writing sort on change
  const { value: sortOrder = 'asc' } = useField<string>({ path: 'sortOrder' })
  // Needed so we can initialize sortOrder when SortOrder component is hidden
  const { setValue: setSortOrder } = useField<'asc' | 'desc'>({ path: 'sortOrder' })

  const { value: collectionSlug } = useField<string>({ path: 'collectionSlug' })
  const { query } = useListQuery()
  const { getEntityConfig } = useConfig()
  const { collection } = useImportExport()

  // ReactSelect's displayed option
  const [displayedValue, setDisplayedValue] = useState<{
    id: string
    label: ReactNode
    value: string
  } | null>(null)

  const collectionConfig = getEntityConfig({ collectionSlug: collectionSlug ?? collection })
  const fieldOptions = useMemo(
    () => reduceFields({ fields: collectionConfig?.fields }),
    [collectionConfig?.fields],
  )

  // Normalize the stored value for display (strip the '-') and pick the option
  useEffect(() => {
    const clean = stripSortDash(sortRaw)
    if (!clean) {
      setDisplayedValue(null)
      return
    }

    const option = fieldOptions.find((f) => f.value === clean)
    if (option && (!displayedValue || displayedValue.value !== clean)) {
      setDisplayedValue(option)
    }
  }, [sortRaw, fieldOptions, displayedValue])

  // One-time init guard so clearing `sort` doesn't rehydrate from query again
  const didInitRef = useRef(false)

  // Sync the visible select from list-view query sort (preferred) or groupBy (fallback)
  // and initialize both `sort` and `sortOrder` here as SortOrder may be hidden by admin.condition.
  useEffect(() => {
    if (didInitRef.current) {
      return
    }
    if (id) {
      didInitRef.current = true
      return
    }
    if (typeof sortRaw === 'string' && sortRaw.length > 0) {
      // Already initialized elsewhere
      didInitRef.current = true
      return
    }

    const qsSort = normalizeQueryParam(query?.sort)
    const qsGroupBy = normalizeQueryParam(query?.groupBy)

    const source = qsSort ?? qsGroupBy
    if (!source) {
      didInitRef.current = true
      return
    }

    const isDesc = !!qsSort && qsSort.startsWith('-')
    const base = stripSortDash(source)
    const order: 'asc' | 'desc' = isDesc ? 'desc' : 'asc'

    // Write BOTH fields so preview/export have the right values even if SortOrder is hidden
    setSort(applySortOrder(base, order))
    setSortOrder(order)

    const option = fieldOptions.find((f) => f.value === base)
    if (option) {
      setDisplayedValue(option)
    }

    didInitRef.current = true
  }, [id, query?.groupBy, query?.sort, sortRaw, fieldOptions, setSort, setSortOrder])

  // When user selects a different field, store it with the current order applied
  const onChange = (option: { id: string; label: ReactNode; value: string } | null) => {
    if (!option) {
      setSort('')
      setDisplayedValue(null)
    } else {
      setDisplayedValue(option)
      const next = applySortOrder(option.value, String(sortOrder) as 'asc' | 'desc')
      setSort(next)
    }
  }

  return (
    <div className={baseClass}>
      <FieldLabel label={props.field.label} path={props.path} />
      <ReactSelect
        className={baseClass}
        disabled={props.readOnly}
        getOptionValue={(option) => String(option.value)}
        inputId={`field-${props.path.replace(/\./g, '__')}`}
        isClearable={true}
        isSortable={true}
        // @ts-expect-error react select option
        onChange={onChange}
        options={fieldOptions}
        // @ts-expect-error react select
        value={displayedValue}
      />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/plugin-import-export/src/components/SortOrder/index.scss

```text
.sort-order-field {
  --field-width: 25%;
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/plugin-import-export/src/components/SortOrder/index.tsx
Signals: React

```typescript
'use client'

import type { SelectFieldClientComponent } from 'payload'

import { FieldLabel, ReactSelect, useDocumentInfo, useField, useListQuery } from '@payloadcms/ui'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import { applySortOrder, normalizeQueryParam, stripSortDash } from '../../utilities/sortHelpers.js'
import './index.scss'

const baseClass = 'sort-order-field'

type Order = 'asc' | 'desc'
type OrderOption = { label: string; value: Order }

const options = [
  { label: 'Ascending', value: 'asc' as const },
  { label: 'Descending', value: 'desc' as const },
] as const

const defaultOption: OrderOption = options[0]

export const SortOrder: SelectFieldClientComponent = (props) => {
  const { id } = useDocumentInfo()
  const { query } = useListQuery()

  // 'sortOrder' select field: 'asc' | 'desc'
  const { setValue: setOrder, value: orderValueRaw } = useField<Order>()

  // 'sort' text field: 'title' | '-title'
  const { setValue: setSort, value: sortRaw } = useField<string>({ path: 'sort' })

  // The current order value, defaulting to 'asc' for UI
  const orderValue: Order = orderValueRaw || 'asc'

  // Map 'asc' | 'desc' to the option object for ReactSelect
  const currentOption = useMemo<OrderOption>(
    () => options.find((o) => o.value === orderValue) ?? defaultOption,
    [orderValue],
  )
  const [displayed, setDisplayed] = useState<null | OrderOption>(currentOption)

  // One-time init guard so clearing `sort` doesn't rehydrate from query again
  const didInitRef = useRef(false)

  // Derive from list-view query.sort if present; otherwise fall back to groupBy
  useEffect(() => {
    if (didInitRef.current) {
      return
    }

    // Existing export -> don't initialize here
    if (id) {
      didInitRef.current = true
      return
    }

    // If sort already has a value, treat as initialized
    if (typeof sortRaw === 'string' && sortRaw.length > 0) {
      didInitRef.current = true
      return
    }

    const qsSort = normalizeQueryParam(query?.sort)
    const qsGroupBy = normalizeQueryParam(query?.groupBy)

    if (qsSort) {
      const isDesc = qsSort.startsWith('-')
      const base = stripSortDash(qsSort)
      const order: Order = isDesc ? 'desc' : 'asc'
      setOrder(order)
      setSort(applySortOrder(base, order)) // combined: 'title' or '-title'
      didInitRef.current = true
      return
    }

    // Fallback: groupBy (always ascending)
    if (qsGroupBy) {
      setOrder('asc')
      setSort(applySortOrder(qsGroupBy, 'asc')) // write 'groupByField' (no dash)
      didInitRef.current = true
      return
    }

    // Nothing to initialize
    didInitRef.current = true
  }, [id, query?.sort, query?.groupBy, sortRaw, setOrder, setSort])

  // Keep the select's displayed option in sync with the stored order
  useEffect(() => {
    setDisplayed(currentOption ?? defaultOption)
  }, [currentOption])

  // Handle manual order changes via ReactSelect:
  //  - update the order field
  //  - rewrite the combined "sort" string to add/remove the leading '-'
  const onChange = (option: null | OrderOption) => {
    const next = option?.value ?? 'asc'
    setOrder(next)

    const base = stripSortDash(sortRaw)
    if (base) {
      setSort(applySortOrder(base, next))
    }

    setDisplayed(option ?? defaultOption)
  }

  return (
    <div className={baseClass}>
      <FieldLabel label={props.field.label} path={props.path} />
      <ReactSelect
        className={baseClass}
        disabled={props.readOnly}
        inputId={`field-${props.path.replace(/\./g, '__')}`}
        isClearable={false}
        isSearchable={false}
        // @ts-expect-error react-select option typing differs from our local type
        onChange={onChange}
        options={options as unknown as OrderOption[]}
        // @ts-expect-error react-select option typing differs from our local type
        value={displayed}
      />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: createExport.ts]---
Location: payload-main/packages/plugin-import-export/src/export/createExport.ts

```typescript
/* eslint-disable perfectionist/sort-objects */
import type { PayloadRequest, Sort, TypedUser, Where } from 'payload'

import { stringify } from 'csv-stringify/sync'
import { APIError } from 'payload'
import { Readable } from 'stream'

import { buildDisabledFieldRegex } from '../utilities/buildDisabledFieldRegex.js'
import { validateLimitValue } from '../utilities/validateLimitValue.js'
import { flattenObject } from './flattenObject.js'
import { getCustomFieldFunctions } from './getCustomFieldFunctions.js'
import { getFilename } from './getFilename.js'
import { getSelect } from './getSelect.js'

export type Export = {
  collectionSlug: string
  /**
   * If true, enables debug logging
   */
  debug?: boolean
  drafts?: 'no' | 'yes'
  exportsCollection: string
  fields?: string[]
  format: 'csv' | 'json'
  globals?: string[]
  id: number | string
  limit?: number
  locale?: string
  name: string
  page?: number
  slug: string
  sort: Sort
  where?: Where
}

export type CreateExportArgs = {
  /**
   * If true, stream the file instead of saving it
   */
  download?: boolean
  input: Export
  req: PayloadRequest
  user?: null | TypedUser
}

export const createExport = async (args: CreateExportArgs) => {
  const {
    download,
    input: {
      id,
      name: nameArg,
      collectionSlug,
      debug = false,
      drafts,
      exportsCollection,
      fields,
      format,
      locale: localeInput,
      sort,
      page,
      limit: incomingLimit,
      where,
    },
    req: { locale: localeArg, payload },
    req,
    user,
  } = args

  if (!user) {
    throw new APIError('User authentication is required to create exports')
  }

  if (debug) {
    req.payload.logger.debug({
      message: 'Starting export process with args:',
      collectionSlug,
      drafts,
      fields,
      format,
    })
  }

  const locale = localeInput ?? localeArg
  const collectionConfig = payload.config.collections.find(({ slug }) => slug === collectionSlug)
  if (!collectionConfig) {
    throw new APIError(`Collection with slug ${collectionSlug} not found`)
  }

  const name = `${nameArg ?? `${getFilename()}-${collectionSlug}`}.${format}`
  const isCSV = format === 'csv'
  const select = Array.isArray(fields) && fields.length > 0 ? getSelect(fields) : undefined

  if (debug) {
    req.payload.logger.debug({ message: 'Export configuration:', name, isCSV, locale })
  }

  const batchSize = 100 // fixed per request

  const hardLimit =
    typeof incomingLimit === 'number' && incomingLimit > 0 ? incomingLimit : undefined

  const { totalDocs } = await payload.count({
    collection: collectionSlug,
    user,
    locale,
    overrideAccess: false,
  })

  const totalPages = Math.max(1, Math.ceil(totalDocs / batchSize))
  const requestedPage = page || 1
  const adjustedPage = requestedPage > totalPages ? 1 : requestedPage

  const findArgs = {
    collection: collectionSlug,
    depth: 1,
    draft: drafts === 'yes',
    limit: batchSize,
    locale,
    overrideAccess: false,
    page: 0, // The page will be incremented manually in the loop
    select,
    sort,
    user,
    where,
  }

  if (debug) {
    req.payload.logger.debug({ message: 'Find arguments:', findArgs })
  }

  const toCSVFunctions = getCustomFieldFunctions({
    fields: collectionConfig.flattenedFields,
  })

  const disabledFields =
    collectionConfig.admin?.custom?.['plugin-import-export']?.disabledFields ?? []

  const disabledRegexes: RegExp[] = disabledFields.map(buildDisabledFieldRegex)

  const filterDisabledCSV = (row: Record<string, unknown>): Record<string, unknown> => {
    const filtered: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(row)) {
      const isDisabled = disabledRegexes.some((regex) => regex.test(key))
      if (!isDisabled) {
        filtered[key] = value
      }
    }

    return filtered
  }

  const filterDisabledJSON = (doc: any, parentPath = ''): any => {
    if (Array.isArray(doc)) {
      return doc.map((item) => filterDisabledJSON(item, parentPath))
    }

    if (typeof doc !== 'object' || doc === null) {
      return doc
    }

    const filtered: Record<string, any> = {}
    for (const [key, value] of Object.entries(doc)) {
      const currentPath = parentPath ? `${parentPath}.${key}` : key

      // Only remove if this exact path is disabled
      const isDisabled = disabledFields.includes(currentPath)

      if (!isDisabled) {
        filtered[key] = filterDisabledJSON(value, currentPath)
      }
    }

    return filtered
  }

  if (download) {
    if (debug) {
      req.payload.logger.debug('Pre-scanning all columns before streaming')
    }

    const limitErrorMsg = validateLimitValue(
      incomingLimit,
      req.t,
      batchSize, // step i.e. 100
    )
    if (limitErrorMsg) {
      throw new APIError(limitErrorMsg)
    }

    const allColumns: string[] = []

    if (isCSV) {
      const allColumnsSet = new Set<string>()

      // Use the incoming page value here, defaulting to 1 if undefined
      let scanPage = adjustedPage
      let hasMore = true
      let fetched = 0
      const maxDocs = typeof hardLimit === 'number' ? hardLimit : Number.POSITIVE_INFINITY

      while (hasMore) {
        const remaining = Math.max(0, maxDocs - fetched)
        if (remaining === 0) {
          break
        }

        const result = await payload.find({
          ...findArgs,
          page: scanPage,
          limit: Math.min(batchSize, remaining),
        })

        result.docs.forEach((doc) => {
          const flat = filterDisabledCSV(flattenObject({ doc, fields, toCSVFunctions }))
          Object.keys(flat).forEach((key) => {
            if (!allColumnsSet.has(key)) {
              allColumnsSet.add(key)
              allColumns.push(key)
            }
          })
        })

        fetched += result.docs.length
        scanPage += 1 // Increment page for next batch
        hasMore = result.hasNextPage && fetched < maxDocs
      }

      if (debug) {
        req.payload.logger.debug(`Discovered ${allColumns.length} columns`)
      }
    }

    const encoder = new TextEncoder()
    let isFirstBatch = true
    let streamPage = adjustedPage
    let fetched = 0
    const maxDocs = typeof hardLimit === 'number' ? hardLimit : Number.POSITIVE_INFINITY

    const stream = new Readable({
      async read() {
        const remaining = Math.max(0, maxDocs - fetched)

        if (remaining === 0) {
          if (!isCSV) {
            this.push(encoder.encode(']'))
          }
          this.push(null)
          return
        }

        const result = await payload.find({
          ...findArgs,
          page: streamPage,
          limit: Math.min(batchSize, remaining),
        })

        if (debug) {
          req.payload.logger.debug(`Streaming batch ${streamPage} with ${result.docs.length} docs`)
        }

        if (result.docs.length === 0) {
          // Close JSON array properly if JSON
          if (!isCSV) {
            this.push(encoder.encode(']'))
          }
          this.push(null)
          return
        }

        if (isCSV) {
          // --- CSV Streaming ---
          const batchRows = result.docs.map((doc) =>
            filterDisabledCSV(flattenObject({ doc, fields, toCSVFunctions })),
          )

          const paddedRows = batchRows.map((row) => {
            const fullRow: Record<string, unknown> = {}
            for (const col of allColumns) {
              fullRow[col] = row[col] ?? ''
            }
            return fullRow
          })

          const csvString = stringify(paddedRows, {
            header: isFirstBatch,
            columns: allColumns,
          })

          this.push(encoder.encode(csvString))
        } else {
          // --- JSON Streaming ---
          const batchRows = result.docs.map((doc) => filterDisabledJSON(doc))

          // Convert each filtered/flattened row into JSON string
          const batchJSON = batchRows.map((row) => JSON.stringify(row)).join(',')

          if (isFirstBatch) {
            this.push(encoder.encode('[' + batchJSON))
          } else {
            this.push(encoder.encode(',' + batchJSON))
          }
        }

        fetched += result.docs.length
        isFirstBatch = false
        streamPage += 1 // Increment stream page for the next batch

        if (!result.hasNextPage || fetched >= maxDocs) {
          if (debug) {
            req.payload.logger.debug('Stream complete - no more pages')
          }
          if (!isCSV) {
            this.push(encoder.encode(']'))
          }
          this.push(null) // End the stream
        }
      },
    })

    return new Response(stream as any, {
      headers: {
        'Content-Disposition': `attachment; filename="${name}"`,
        'Content-Type': isCSV ? 'text/csv' : 'application/json',
      },
    })
  }

  // Non-download path (buffered export)
  if (debug) {
    req.payload.logger.debug('Starting file generation')
  }

  const outputData: string[] = []
  const rows: Record<string, unknown>[] = []
  const columnsSet = new Set<string>()
  const columns: string[] = []

  // Start from the incoming page value, defaulting to 1 if undefined
  let currentPage = adjustedPage
  let fetched = 0
  let hasNextPage = true
  const maxDocs = typeof hardLimit === 'number' ? hardLimit : Number.POSITIVE_INFINITY

  while (hasNextPage) {
    const remaining = Math.max(0, maxDocs - fetched)

    if (remaining === 0) {
      break
    }

    const result = await payload.find({
      ...findArgs,
      page: currentPage,
      limit: Math.min(batchSize, remaining),
    })

    if (debug) {
      req.payload.logger.debug(
        `Processing batch ${currentPage} with ${result.docs.length} documents`,
      )
    }

    if (isCSV) {
      const batchRows = result.docs.map((doc) =>
        filterDisabledCSV(flattenObject({ doc, fields, toCSVFunctions })),
      )

      // Track discovered column keys
      batchRows.forEach((row) => {
        Object.keys(row).forEach((key) => {
          if (!columnsSet.has(key)) {
            columnsSet.add(key)
            columns.push(key)
          }
        })
      })

      rows.push(...batchRows)
    } else {
      const batchRows = result.docs.map((doc) => filterDisabledJSON(doc))
      outputData.push(batchRows.map((doc) => JSON.stringify(doc)).join(',\n'))
    }

    fetched += result.docs.length
    hasNextPage = result.hasNextPage && fetched < maxDocs
    currentPage += 1 // Increment page for next batch
  }

  // Prepare final output
  if (isCSV) {
    const paddedRows = rows.map((row) => {
      const fullRow: Record<string, unknown> = {}
      for (const col of columns) {
        fullRow[col] = row[col] ?? ''
      }
      return fullRow
    })

    outputData.push(
      stringify(paddedRows, {
        header: true,
        columns,
      }),
    )
  }

  const buffer = Buffer.from(format === 'json' ? `[${outputData.join(',')}]` : outputData.join(''))
  if (debug) {
    req.payload.logger.debug(`${format} file generation complete`)
  }

  if (!id) {
    if (debug) {
      req.payload.logger.debug('Creating new export file')
    }
    req.file = {
      name,
      data: buffer,
      mimetype: isCSV ? 'text/csv' : 'application/json',
      size: buffer.length,
    }
  } else {
    if (debug) {
      req.payload.logger.debug(`Updating existing export with id: ${id}`)
    }
    await req.payload.update({
      id,
      collection: exportsCollection,
      data: {},
      file: {
        name,
        data: buffer,
        mimetype: isCSV ? 'text/csv' : 'application/json',
        size: buffer.length,
      },
      user,
    })
  }
  if (debug) {
    req.payload.logger.debug('Export process completed successfully')
  }
}
```

--------------------------------------------------------------------------------

---[FILE: download.ts]---
Location: payload-main/packages/plugin-import-export/src/export/download.ts

```typescript
import type { PayloadRequest } from 'payload'

import { APIError } from 'payload'

import { createExport } from './createExport.js'

export const download = async (req: PayloadRequest, debug = false) => {
  try {
    let body
    if (typeof req?.json === 'function') {
      body = await req.json()
    }

    if (!body || !body.data) {
      throw new APIError('Request data is required.')
    }

    const { collectionSlug } = body.data || {}

    req.payload.logger.info(`Download request received ${collectionSlug}`)

    const res = await createExport({
      download: true,
      input: { ...body.data, debug },
      req,
      user: req.user,
    })

    return res as Response
  } catch (err) {
    // Return JSON for front-end toast
    return new Response(
      JSON.stringify({ errors: [{ message: (err as Error).message || 'Something went wrong' }] }),
      { headers: { 'Content-Type': 'application/json' }, status: 400 },
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: flattenObject.ts]---
Location: payload-main/packages/plugin-import-export/src/export/flattenObject.ts

```typescript
import type { Document } from 'payload'

import type { ToCSVFunction } from '../types.js'

type Args = {
  doc: Document
  fields?: string[]
  prefix?: string
  toCSVFunctions: Record<string, ToCSVFunction>
}

export const flattenObject = ({
  doc,
  fields,
  prefix,
  toCSVFunctions,
}: Args): Record<string, unknown> => {
  const row: Record<string, unknown> = {}

  const flatten = (siblingDoc: Document, prefix?: string) => {
    Object.entries(siblingDoc).forEach(([key, value]) => {
      const newKey = prefix ? `${prefix}_${key}` : key

      if (Array.isArray(value)) {
        // If a custom toCSV function exists for this array field, run it first.
        // If it produces output, skip per-item handling; otherwise, fall back.
        if (toCSVFunctions?.[newKey]) {
          try {
            const result = toCSVFunctions[newKey]({
              columnName: newKey,
              data: row,
              doc,
              row,
              siblingDoc,
              value, // whole array
            })

            if (typeof result !== 'undefined') {
              // Custom function returned a single value for this array field.
              row[newKey] = result
              return
            }

            // If the custom function wrote any keys for this field, consider it handled.
            for (const k in row) {
              if (k === newKey || k.startsWith(`${newKey}_`)) {
                return
              }
            }
            // Otherwise, fall through to per-item handling.
          } catch (error) {
            throw new Error(
              `Error in toCSVFunction for array "${newKey}": ${JSON.stringify(value)}\n${
                (error as Error).message
              }`,
            )
          }
        }

        value.forEach((item, index) => {
          if (typeof item === 'object' && item !== null) {
            const blockType = typeof item.blockType === 'string' ? item.blockType : undefined
            const itemPrefix = blockType ? `${newKey}_${index}_${blockType}` : `${newKey}_${index}`

            // Case: hasMany polymorphic relationships
            if (
              'relationTo' in item &&
              'value' in item &&
              typeof item.value === 'object' &&
              item.value !== null
            ) {
              row[`${itemPrefix}_relationTo`] = item.relationTo
              row[`${itemPrefix}_id`] = item.value.id
              return
            }

            // Fallback: deep-flatten nested objects
            flatten(item, itemPrefix)
          } else {
            // Primitive array item.
            row[`${newKey}_${index}`] = item
          }
        })
      } else if (typeof value === 'object' && value !== null) {
        // Object field: use custom toCSV if present, else recurse.
        if (!toCSVFunctions?.[newKey]) {
          flatten(value, newKey)
        } else {
          try {
            const result = toCSVFunctions[newKey]({
              columnName: newKey,
              data: row,
              doc,
              row,
              siblingDoc,
              value,
            })
            if (typeof result !== 'undefined') {
              row[newKey] = result
            }
          } catch (error) {
            throw new Error(
              `Error in toCSVFunction for nested object "${newKey}": ${JSON.stringify(value)}\n${
                (error as Error).message
              }`,
            )
          }
        }
      } else {
        if (toCSVFunctions?.[newKey]) {
          try {
            const result = toCSVFunctions[newKey]({
              columnName: newKey,
              data: row,
              doc,
              row,
              siblingDoc,
              value,
            })
            if (typeof result !== 'undefined') {
              row[newKey] = result
            }
          } catch (error) {
            throw new Error(
              `Error in toCSVFunction for field "${newKey}": ${JSON.stringify(value)}\n${
                (error as Error).message
              }`,
            )
          }
        } else {
          row[newKey] = value
        }
      }
    })
  }

  flatten(doc, prefix)

  if (Array.isArray(fields) && fields.length > 0) {
    const orderedResult: Record<string, unknown> = {}

    const fieldToRegex = (field: string): RegExp => {
      const parts = field.split('.').map((part) => `${part}(?:_\\d+)?`)
      const pattern = `^${parts.join('_')}`
      return new RegExp(pattern)
    }

    fields.forEach((field) => {
      if (row[field.replace(/\./g, '_')]) {
        const sanitizedField = field.replace(/\./g, '_')
        orderedResult[sanitizedField] = row[sanitizedField]
      } else {
        const regex = fieldToRegex(field)
        Object.keys(row).forEach((key) => {
          if (regex.test(key)) {
            orderedResult[key] = row[key]
          }
        })
      }
    })

    return orderedResult
  }

  return row
}
```

--------------------------------------------------------------------------------

---[FILE: getCreateExportCollectionTask.ts]---
Location: payload-main/packages/plugin-import-export/src/export/getCreateExportCollectionTask.ts

```typescript
import type { Config, PayloadRequest, TaskConfig, TypedUser } from 'payload'

import type { ImportExportPluginConfig } from '../types.js'
import type { Export } from './createExport.js'

import { createExport } from './createExport.js'
import { getFields } from './getFields.js'

/**
 * Export input type for job queue serialization.
 * When exports are queued as jobs, the user must be serialized as an ID string or number
 * along with the collection name so it can be rehydrated when the job runs.
 */
export type ExportJobInput = {
  user: number | string
  userCollection: string
} & Export

export const getCreateCollectionExportTask = (
  config: Config,
  pluginConfig?: ImportExportPluginConfig,
): TaskConfig<{
  input: ExportJobInput
  output: object
}> => {
  const inputSchema = getFields(config, pluginConfig).concat(
    {
      name: 'user',
      type: 'text',
    },
    {
      name: 'userCollection',
      type: 'text',
    },
    {
      name: 'exportsCollection',
      type: 'text',
    },
  )

  return {
    slug: 'createCollectionExport',
    handler: async ({ input, req }: { input: ExportJobInput; req: PayloadRequest }) => {
      let user: TypedUser | undefined

      if (input.userCollection && input.user) {
        user = (await req.payload.findByID({
          id: input.user,
          collection: input.userCollection,
        })) as TypedUser

        req.user = user
      }

      if (!user) {
        throw new Error('User not found')
      }

      // Strip out user and userCollection from input - they're only needed for rehydration
      const { user: _userId, userCollection: _userCollection, ...exportInput } = input

      await createExport({ input: exportInput, req, user })

      return {
        output: {},
      }
    },
    inputSchema,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: getCustomFieldFunctions.ts]---
Location: payload-main/packages/plugin-import-export/src/export/getCustomFieldFunctions.ts

```typescript
import { type FlattenedField, traverseFields, type TraverseFieldsCallback } from 'payload'

import type { ToCSVFunction } from '../types.js'

type Args = {
  fields: FlattenedField[]
}

export const getCustomFieldFunctions = ({ fields }: Args): Record<string, ToCSVFunction> => {
  const result: Record<string, ToCSVFunction> = {}

  const buildCustomFunctions: TraverseFieldsCallback = ({ field, parentRef, ref }) => {
    // @ts-expect-error ref is untyped
    ref.prefix = parentRef.prefix || ''
    if (field.type === 'group' || field.type === 'tab') {
      // @ts-expect-error ref is untyped
      const parentPrefix = parentRef?.prefix ? `${parentRef.prefix}_` : ''
      // @ts-expect-error ref is untyped
      ref.prefix = `${parentPrefix}${field.name}_`
    }

    if (typeof field.custom?.['plugin-import-export']?.toCSV === 'function') {
      // @ts-expect-error ref is untyped
      result[`${ref.prefix}${field.name}`] = field.custom['plugin-import-export']?.toCSV
    } else if (field.type === 'relationship' || field.type === 'upload') {
      if (field.hasMany !== true) {
        if (!Array.isArray(field.relationTo)) {
          // monomorphic single
          // @ts-expect-error ref is untyped
          result[`${ref.prefix}${field.name}`] = ({ value }) =>
            typeof value === 'object' && value && 'id' in value ? value.id : value
        } else {
          // polymorphic single
          // @ts-expect-error ref is untyped
          result[`${ref.prefix}${field.name}`] = ({ data, value }) => {
            if (value && typeof value === 'object' && 'relationTo' in value && 'value' in value) {
              const relationTo = (value as { relationTo: string; value: { id: number | string } })
                .relationTo
              const relatedDoc = (value as { relationTo: string; value: { id: number | string } })
                .value
              if (relatedDoc && typeof relatedDoc === 'object') {
                // @ts-expect-error ref is untyped
                data[`${ref.prefix}${field.name}_id`] = relatedDoc.id
                // @ts-expect-error ref is untyped
                data[`${ref.prefix}${field.name}_relationTo`] = relationTo
              }
            }
            return undefined // prevents further flattening
          }
        }
      } else {
        if (!Array.isArray(field.relationTo)) {
          // monomorphic many
          // @ts-expect-error ref is untyped
          result[`${ref.prefix}${field.name}`] = ({
            data,
            value,
          }: {
            data: Record<string, unknown>
            value: Array<number | Record<string, any> | string> | undefined
          }) => {
            if (Array.isArray(value)) {
              value.forEach((val, i) => {
                const id = typeof val === 'object' && val ? val.id : val
                // @ts-expect-error ref is untyped
                data[`${ref.prefix}${field.name}_${i}_id`] = id
              })
            }
            return undefined // prevents further flattening
          }
        } else {
          // polymorphic many
          // @ts-expect-error ref is untyped
          result[`${ref.prefix}${field.name}`] = ({
            data,
            value,
          }: {
            data: Record<string, unknown>
            value: Array<Record<string, any>> | undefined
          }) => {
            if (Array.isArray(value)) {
              value.forEach((val, i) => {
                if (val && typeof val === 'object') {
                  const relationTo = val.relationTo
                  const relatedDoc = val.value
                  if (relationTo && relatedDoc && typeof relatedDoc === 'object') {
                    // @ts-expect-error ref is untyped
                    data[`${ref.prefix}${field.name}_${i}_id`] = relatedDoc.id
                    // @ts-expect-error ref is untyped
                    data[`${ref.prefix}${field.name}_${i}_relationTo`] = relationTo
                  }
                }
              })
            }
            return undefined
          }
        }
      }
    }
  }

  traverseFields({ callback: buildCustomFunctions, fields })

  return result
}
```

--------------------------------------------------------------------------------

````
