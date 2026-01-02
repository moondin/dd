---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 193
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 193 of 695)

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

---[FILE: fractional-indexing.js]---
Location: payload-main/packages/payload/src/config/orderable/fractional-indexing.js

```javascript
// @ts-no-check

/**
 * THIS FILE IS COPIED FROM:
 * https://github.com/rocicorp/fractional-indexing/blob/main/src/index.js
 *
 * I AM NOT INSTALLING THAT LIBRARY BECAUSE JEST COMPLAINS ABOUT THE ESM MODULE AND THE TESTS FAIL.
 * DO NOT MODIFY IT
 * ALSO, I'M DISABLING TS WITH `@ts-no-check` BECAUSE THEY DON'T USE STRICT NULL CHECKS IN THAT REPOSITORY
 */

// License: CC0 (no rights reserved).

// This is based on https://observablehq.com/@dgreensp/implementing-fractional-indexing

export const BASE_36_DIGITS = '0123456789abcdefghijklmnopqrstuvwxyz'

// `a` may be empty string, `b` is null or non-empty string.
// `a < b` lexicographically if `b` is non-null.
// no trailing zeros allowed.
// digits is a string such as '0123456789' for base 10.  Digits must be in
// ascending character code order!
/**
 * @param {string} a
 * @param {string | null | undefined} b
 * @param {string} digits
 * @returns {string}
 */
function midpoint(a, b, digits) {
  const zero = digits[0]
  if (b != null && a >= b) {
    throw new Error(a + ' >= ' + b)
  }
  if (a.slice(-1) === zero || (b && b.slice(-1) === zero)) {
    throw new Error('trailing zero')
  }
  if (b) {
    // remove longest common prefix.  pad `a` with 0s as we
    // go.  note that we don't need to pad `b`, because it can't
    // end before `a` while traversing the common prefix.
    let n = 0
    while ((a[n] || zero) === b[n]) {
      n++
    }
    if (n > 0) {
      return b.slice(0, n) + midpoint(a.slice(n), b.slice(n), digits)
    }
  }
  // first digits (or lack of digit) are different
  const digitA = a ? digits.indexOf(a[0]) : 0
  const digitB = b != null ? digits.indexOf(b[0]) : digits.length
  if (digitB - digitA > 1) {
    const midDigit = Math.round(0.5 * (digitA + digitB))
    return digits[midDigit]
  } else {
    // first digits are consecutive
    if (b && b.length > 1) {
      return b.slice(0, 1)
    } else {
      // `b` is null or has length 1 (a single digit).
      // the first digit of `a` is the previous digit to `b`,
      // or 9 if `b` is null.
      // given, for example, midpoint('49', '5'), return
      // '4' + midpoint('9', null), which will become
      // '4' + '9' + midpoint('', null), which is '495'
      return digits[digitA] + midpoint(a.slice(1), null, digits)
    }
  }
}

/**
 * @param {string} int
 * @return {void}
 */

function validateInteger(int) {
  if (int.length !== getIntegerLength(int[0])) {
    throw new Error('invalid integer part of order key: ' + int)
  }
}

/**
 * @param {string} head
 * @return {number}
 */

function getIntegerLength(head) {
  if (head >= 'a' && head <= 'z') {
    return head.charCodeAt(0) - 'a'.charCodeAt(0) + 2
  } else if (head >= 'A' && head <= 'Z') {
    return 'Z'.charCodeAt(0) - head.charCodeAt(0) + 2
  } else {
    throw new Error('invalid order key head: ' + head)
  }
}

/**
 * @param {string} key
 * @return {string}
 */

function getIntegerPart(key) {
  const integerPartLength = getIntegerLength(key[0])
  if (integerPartLength > key.length) {
    throw new Error('invalid order key: ' + key)
  }
  return key.slice(0, integerPartLength)
}

/**
 * @param {string} key
 * @param {string} digits
 * @return {void}
 */

function validateOrderKey(key, digits) {
  if (key === 'A' + digits[0].repeat(26)) {
    throw new Error('invalid order key: ' + key)
  }
  // getIntegerPart will throw if the first character is bad,
  // or the key is too short.  we'd call it to check these things
  // even if we didn't need the result
  const i = getIntegerPart(key)
  const f = key.slice(i.length)
  if (f.slice(-1) === digits[0]) {
    throw new Error('invalid order key: ' + key)
  }
}

// note that this may return null, as there is a largest integer
/**
 * @param {string} x
 * @param {string} digits
 * @return {string | null}
 */
function incrementInteger(x, digits) {
  validateInteger(x)
  const [head, ...digs] = x.split('')
  let carry = true
  for (let i = digs.length - 1; carry && i >= 0; i--) {
    const d = digits.indexOf(digs[i]) + 1
    if (d === digits.length) {
      digs[i] = digits[0]
    } else {
      digs[i] = digits[d]
      carry = false
    }
  }
  if (carry) {
    if (head === 'Z') {
      return 'a' + digits[0]
    }
    if (head === 'z') {
      return null
    }
    const h = String.fromCharCode(head.charCodeAt(0) + 1)
    if (h > 'a') {
      digs.push(digits[0])
    } else {
      digs.pop()
    }
    return h + digs.join('')
  } else {
    return head + digs.join('')
  }
}

// note that this may return null, as there is a smallest integer
/**
 * @param {string} x
 * @param {string} digits
 * @return {string | null}
 */

function decrementInteger(x, digits) {
  validateInteger(x)
  const [head, ...digs] = x.split('')
  let borrow = true
  for (let i = digs.length - 1; borrow && i >= 0; i--) {
    const d = digits.indexOf(digs[i]) - 1
    if (d === -1) {
      digs[i] = digits.slice(-1)
    } else {
      digs[i] = digits[d]
      borrow = false
    }
  }
  if (borrow) {
    if (head === 'a') {
      return 'Z' + digits.slice(-1)
    }
    if (head === 'A') {
      return null
    }
    const h = String.fromCharCode(head.charCodeAt(0) - 1)
    if (h < 'Z') {
      digs.push(digits.slice(-1))
    } else {
      digs.pop()
    }
    return h + digs.join('')
  } else {
    return head + digs.join('')
  }
}

// `a` is an order key or null (START).
// `b` is an order key or null (END).
// `a < b` lexicographically if both are non-null.
// digits is a string such as '0123456789' for base 10.  Digits must be in
// ascending character code order!
/**
 * @param {string | null | undefined} a
 * @param {string | null | undefined} b
 * @param {string=} digits
 * @return {string}
 */
export function generateKeyBetween(a, b, digits = BASE_36_DIGITS) {
  if (a != null) {
    validateOrderKey(a, digits)
  }
  if (b != null) {
    validateOrderKey(b, digits)
  }
  if (a != null && b != null && a >= b) {
    throw new Error(a + ' >= ' + b)
  }
  if (a == null) {
    if (b == null) {
      return 'a' + digits[0]
    }

    const ib = getIntegerPart(b)
    const fb = b.slice(ib.length)
    if (ib === 'A' + digits[0].repeat(26)) {
      return ib + midpoint('', fb, digits)
    }
    if (ib < b) {
      return ib
    }
    const res = decrementInteger(ib, digits)
    if (res == null) {
      throw new Error('cannot decrement any more')
    }
    return res
  }

  if (b == null) {
    const ia = getIntegerPart(a)
    const fa = a.slice(ia.length)
    const i = incrementInteger(ia, digits)
    return i == null ? ia + midpoint(fa, null, digits) : i
  }

  const ia = getIntegerPart(a)
  const fa = a.slice(ia.length)
  const ib = getIntegerPart(b)
  const fb = b.slice(ib.length)
  if (ia === ib) {
    return ia + midpoint(fa, fb, digits)
  }
  const i = incrementInteger(ia, digits)
  if (i == null) {
    throw new Error('cannot increment any more')
  }
  if (i < b) {
    return i
  }
  return ia + midpoint(fa, null, digits)
}

/**
 * same preconditions as generateKeysBetween.
 * n >= 0.
 * Returns an array of n distinct keys in sorted order.
 * If a and b are both null, returns [a0, a1, ...]
 * If one or the other is null, returns consecutive "integer"
 * keys.  Otherwise, returns relatively short keys between
 * a and b.
 * @param {string | null | undefined} a
 * @param {string | null | undefined} b
 * @param {number} n
 * @param {string} digits
 * @return {string[]}
 */
export function generateNKeysBetween(a, b, n, digits = BASE_36_DIGITS) {
  if (n === 0) {
    return []
  }
  if (n === 1) {
    return [generateKeyBetween(a, b, digits)]
  }
  if (b == null) {
    let c = generateKeyBetween(a, b, digits)
    const result = [c]
    for (let i = 0; i < n - 1; i++) {
      c = generateKeyBetween(c, b, digits)
      result.push(c)
    }
    return result
  }
  if (a == null) {
    let c = generateKeyBetween(a, b, digits)
    const result = [c]
    for (let i = 0; i < n - 1; i++) {
      c = generateKeyBetween(a, c, digits)
      result.push(c)
    }
    result.reverse()
    return result
  }
  const mid = Math.floor(n / 2)
  const c = generateKeyBetween(a, b, digits)
  return [
    ...generateNKeysBetween(a, c, mid, digits),
    c,
    ...generateNKeysBetween(c, b, n - mid - 1, digits),
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/payload/src/config/orderable/index.ts

```typescript
import { status as httpStatus } from 'http-status'

import type { BeforeChangeHook, CollectionConfig } from '../../collections/config/types.js'
import type { Field } from '../../fields/config/types.js'
import type { Endpoint, PayloadHandler, SanitizedConfig } from '../types.js'

import { executeAccess } from '../../auth/executeAccess.js'
import { APIError } from '../../errors/index.js'
import { commitTransaction } from '../../utilities/commitTransaction.js'
import { initTransaction } from '../../utilities/initTransaction.js'
import { killTransaction } from '../../utilities/killTransaction.js'
import { traverseFields } from '../../utilities/traverseFields.js'
import { generateKeyBetween, generateNKeysBetween } from './fractional-indexing.js'

/**
 * This function creates:
 * - N fields per collection, named `_order` or `_<collection>_<joinField>_order`
 * - 1 hook per collection
 * - 1 endpoint per app
 *
 * Also, if collection.defaultSort or joinField.defaultSort is not set, it will be set to the orderable field.
 */
export const setupOrderable = (config: SanitizedConfig) => {
  const fieldsToAdd = new Map<CollectionConfig, string[]>()

  config.collections.forEach((collection) => {
    if (collection.orderable) {
      const currentFields = fieldsToAdd.get(collection) || []
      fieldsToAdd.set(collection, [...currentFields, '_order'])
      collection.defaultSort = collection.defaultSort ?? '_order'
    }

    traverseFields({
      callback: ({ field, parentRef, ref }) => {
        if (field.type === 'array' || field.type === 'blocks') {
          return false
        }
        if (field.type === 'group' || field.type === 'tab') {
          // @ts-expect-error ref is untyped
          const parentPrefix = parentRef?.prefix ? `${parentRef.prefix}_` : ''
          // @ts-expect-error ref is untyped
          ref.prefix = `${parentPrefix}${field.name}`
        }
        if (field.type === 'join' && field.orderable === true) {
          if (Array.isArray(field.collection)) {
            throw new APIError(
              'Orderable joins must target a single collection',
              httpStatus.BAD_REQUEST,
              {},
              true,
            )
          }
          const relationshipCollection = config.collections.find((c) => c.slug === field.collection)
          if (!relationshipCollection) {
            return false
          }
          field.defaultSort = field.defaultSort ?? `_${field.collection}_${field.name}_order`
          const currentFields = fieldsToAdd.get(relationshipCollection) || []
          // @ts-expect-error ref is untyped
          const prefix = parentRef?.prefix ? `${parentRef.prefix}_` : ''
          fieldsToAdd.set(relationshipCollection, [
            ...currentFields,
            `_${field.collection}_${prefix}${field.name}_order`,
          ])
        }
      },
      fields: collection.fields,
    })
  })

  Array.from(fieldsToAdd.entries()).forEach(([collection, orderableFields]) => {
    addOrderableFieldsAndHook(collection, orderableFields)
  })

  if (fieldsToAdd.size > 0) {
    addOrderableEndpoint(config)
  }
}

export const addOrderableFieldsAndHook = (
  collection: CollectionConfig,
  orderableFieldNames: string[],
) => {
  // 1. Add field
  orderableFieldNames.forEach((orderableFieldName) => {
    const orderField: Field = {
      name: orderableFieldName,
      type: 'text',
      admin: {
        disableBulkEdit: true,
        disabled: true,
        disableGroupBy: true,
        disableListColumn: true,
        disableListFilter: true,
        hidden: true,
        readOnly: true,
      },
      hooks: {
        beforeDuplicate: [
          ({ siblingData }) => {
            delete siblingData[orderableFieldName]
          },
        ],
      },
      index: true,
    }

    collection.fields.unshift(orderField)
  })

  // 2. Add hook
  if (!collection.hooks) {
    collection.hooks = {}
  }
  if (!collection.hooks.beforeChange) {
    collection.hooks.beforeChange = []
  }

  const orderBeforeChangeHook: BeforeChangeHook = async ({ data, originalDoc, req }) => {
    for (const orderableFieldName of orderableFieldNames) {
      if (!data[orderableFieldName] && !originalDoc?.[orderableFieldName]) {
        const lastDoc = await req.payload.find({
          collection: collection.slug,
          depth: 0,
          limit: 1,
          pagination: false,
          req,
          select: { [orderableFieldName]: true },
          sort: `-${orderableFieldName}`,
          where: {
            [orderableFieldName]: {
              exists: true,
            },
          },
        })

        const lastOrderValue = lastDoc.docs[0]?.[orderableFieldName] || null
        data[orderableFieldName] = generateKeyBetween(lastOrderValue, null)
      }
    }

    return data
  }

  collection.hooks.beforeChange.push(orderBeforeChangeHook)
}

/**
 * The body of the reorder endpoint.
 * @internal
 */
export type OrderableEndpointBody = {
  collectionSlug: string
  docsToMove: string[]
  newKeyWillBe: 'greater' | 'less'
  orderableFieldName: string
  target: {
    id: string
    key: string
  }
}

export const addOrderableEndpoint = (config: SanitizedConfig) => {
  // 3. Add endpoint
  const reorderHandler: PayloadHandler = async (req) => {
    const body = (await req.json?.()) as OrderableEndpointBody

    const { collectionSlug, docsToMove, newKeyWillBe, orderableFieldName, target } = body

    if (!Array.isArray(docsToMove) || docsToMove.length === 0) {
      return new Response(JSON.stringify({ error: 'docsToMove must be a non-empty array' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      })
    }
    if (newKeyWillBe !== 'greater' && newKeyWillBe !== 'less') {
      return new Response(JSON.stringify({ error: 'newKeyWillBe must be "greater" or "less"' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      })
    }
    const collection = config.collections.find((c) => c.slug === collectionSlug)
    if (!collection) {
      return new Response(JSON.stringify({ error: `Collection ${collectionSlug} not found` }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      })
    }
    if (typeof orderableFieldName !== 'string') {
      return new Response(JSON.stringify({ error: 'orderableFieldName must be a string' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // Prevent reordering if user doesn't have editing permissions
    if (collection.access?.update) {
      await executeAccess(
        {
          // Currently only one doc can be moved at a time. We should review this if we want to allow
          // multiple docs to be moved at once in the future.
          id: docsToMove[0],
          data: {},
          req,
        },
        collection.access.update,
      )
    }
    /**
     * If there is no target.key, we can assume the user enabled `orderable`
     * on a collection with existing documents, and that this is the first
     * time they tried to reorder them. Therefore, we perform a one-time
     * migration by setting the key value for all documents. We do this
     * instead of enforcing `required` and `unique` at the database schema
     * level, so that users don't have to run a migration when they enable
     * `orderable` on a collection with existing documents.
     */
    if (!target.key) {
      const { docs } = await req.payload.find({
        collection: collection.slug,
        depth: 0,
        limit: 0,
        req,
        select: { [orderableFieldName]: true },
        where: {
          [orderableFieldName]: {
            exists: false,
          },
        },
      })
      await initTransaction(req)
      // We cannot update all documents in a single operation with `payload.update`,
      // because they would all end up with the same order key (`a0`).
      try {
        for (const doc of docs) {
          await req.payload.update({
            id: doc.id,
            collection: collection.slug,
            data: {
              // no data needed since the order hooks will handle this
            },
            depth: 0,
            req,
          })
          await commitTransaction(req)
        }
      } catch (e) {
        await killTransaction(req)
        if (e instanceof Error) {
          throw new APIError(e.message, httpStatus.INTERNAL_SERVER_ERROR)
        }
      }

      return new Response(JSON.stringify({ message: 'initial migration', success: true }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    if (
      typeof target !== 'object' ||
      typeof target.id === 'undefined' ||
      typeof target.key !== 'string'
    ) {
      return new Response(JSON.stringify({ error: 'target must be an object with id' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    const targetId = target.id
    let targetKey = target.key

    // If targetKey = pending, we need to find its current key.
    // This can only happen if the user reorders rows quickly with a slow connection.
    if (targetKey === 'pending') {
      const beforeDoc = await req.payload.findByID({
        id: targetId,
        collection: collection.slug,
        depth: 0,
        select: { [orderableFieldName]: true },
      })
      targetKey = beforeDoc?.[orderableFieldName] || null
    }

    // The reason the endpoint does not receive this docId as an argument is that there
    // are situations where the user may not see or know what the next or previous one is. For
    // example, access control restrictions, if docBefore is the last one on the page, etc.
    const adjacentDoc = await req.payload.find({
      collection: collection.slug,
      depth: 0,
      limit: 1,
      pagination: false,
      select: { [orderableFieldName]: true },
      sort: newKeyWillBe === 'greater' ? orderableFieldName : `-${orderableFieldName}`,
      where: {
        [orderableFieldName]: {
          [newKeyWillBe === 'greater' ? 'greater_than' : 'less_than']: targetKey,
        },
      },
    })
    const adjacentDocKey = adjacentDoc.docs?.[0]?.[orderableFieldName] || null

    // Currently N (= docsToMove.length) is always 1. Maybe in the future we will
    // allow dragging and reordering multiple documents at once via the UI.
    const orderValues =
      newKeyWillBe === 'greater'
        ? generateNKeysBetween(targetKey, adjacentDocKey, docsToMove.length)
        : generateNKeysBetween(adjacentDocKey, targetKey, docsToMove.length)

    // Update each document with its new order value
    for (const [index, id] of docsToMove.entries()) {
      await req.payload.update({
        id,
        collection: collection.slug,
        data: {
          [orderableFieldName]: orderValues[index],
        },
        depth: 0,
        req,
      })
    }

    return new Response(JSON.stringify({ orderValues, success: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  }

  const reorderEndpoint: Endpoint = {
    handler: reorderHandler,
    method: 'post',
    path: '/reorder',
  }

  if (!config.endpoints) {
    config.endpoints = []
  }

  config.endpoints.push(reorderEndpoint)
}
```

--------------------------------------------------------------------------------

---[FILE: combineQueries.ts]---
Location: payload-main/packages/payload/src/database/combineQueries.ts

```typescript
import type { Where } from '../types/index.js'

import { hasWhereAccessResult } from '../auth/index.js'

/**
 * Combines two queries into a single query, using an AND operator
 */
export const combineQueries = (where: Where, access: boolean | Where): Where => {
  if (!where && !access) {
    return {}
  }

  const and: Where[] = where ? [where] : []

  if (hasWhereAccessResult(access)) {
    and.push(access)
  }

  return {
    and,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: createDatabaseAdapter.ts]---
Location: payload-main/packages/payload/src/database/createDatabaseAdapter.ts

```typescript
import type { MarkOptional } from 'ts-essentials'

import type {
  BaseDatabaseAdapter,
  BeginTransaction,
  CommitTransaction,
  RollbackTransaction,
} from './types.js'

import { defaultUpdateJobs } from './defaultUpdateJobs.js'
import { createMigration } from './migrations/createMigration.js'
import { migrate } from './migrations/migrate.js'
import { migrateDown } from './migrations/migrateDown.js'
import { migrateRefresh } from './migrations/migrateRefresh.js'
import { migrateReset } from './migrations/migrateReset.js'
import { migrateStatus } from './migrations/migrateStatus.js'

const beginTransaction: BeginTransaction = () => Promise.resolve(null)
// @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
const rollbackTransaction: RollbackTransaction = () => Promise.resolve(null)
// @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
const commitTransaction: CommitTransaction = () => Promise.resolve(null)

export function createDatabaseAdapter<T extends BaseDatabaseAdapter>(
  args: MarkOptional<
    T,
    | 'allowIDOnCreate'
    | 'createMigration'
    | 'migrate'
    | 'migrateDown'
    | 'migrateFresh'
    | 'migrateRefresh'
    | 'migrateReset'
    | 'migrateStatus'
    | 'migrationDir'
    | 'updateJobs'
  >,
): T {
  return {
    // Default 'null' transaction functions
    // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
    beginTransaction,
    // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
    commitTransaction,
    createMigration,
    migrate,
    migrateDown,
    migrateFresh: () => Promise.resolve(null),
    migrateRefresh,
    migrateReset,
    migrateStatus,
    // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
    rollbackTransaction,
    updateJobs: defaultUpdateJobs,

    ...args,
    // Ensure migrationDir is set
    migrationDir: args.migrationDir || 'migrations',
  } as T
}
```

--------------------------------------------------------------------------------

---[FILE: defaultBeginTransaction.ts]---
Location: payload-main/packages/payload/src/database/defaultBeginTransaction.ts

```typescript
import type { BeginTransaction } from './types.js'

/**
 * Default implementation of `beginTransaction` that returns a resolved promise of null
 */
export function defaultBeginTransaction(): BeginTransaction {
  const promiseSingleton: Promise<null> = Promise.resolve(null)
  return () => promiseSingleton
}
```

--------------------------------------------------------------------------------

---[FILE: defaultUpdateJobs.ts]---
Location: payload-main/packages/payload/src/database/defaultUpdateJobs.ts

```typescript
import type { DatabaseAdapter, Job } from '../index.js'
import type { UpdateJobs } from './types.js'

import { jobsCollectionSlug } from '../queues/config/collection.js'

export const defaultUpdateJobs: UpdateJobs = async function updateMany(
  this: DatabaseAdapter,
  { id, data, limit, req, returning, where },
) {
  const updatedJobs: Job[] | null = []

  const jobsToUpdate: Job[] = (
    id
      ? [
          await this.findOne({
            collection: jobsCollectionSlug,
            req,
            where: { id: { equals: id } },
          }),
        ]
      : (
          await this.find({
            collection: jobsCollectionSlug,
            limit,
            pagination: false,
            req,
            where,
          })
        ).docs
  ).filter(Boolean) as Job[]

  if (!jobsToUpdate) {
    return null
  }

  for (const job of jobsToUpdate) {
    const updateData = {
      ...job,
      ...data,
    }
    const updatedJob = await this.updateOne({
      id: job.id,
      collection: jobsCollectionSlug,
      data: updateData,
      req,
      returning,
    })
    updatedJobs.push(updatedJob)
  }

  return updatedJobs
}
```

--------------------------------------------------------------------------------

---[FILE: flattenWhereToOperators.ts]---
Location: payload-main/packages/payload/src/database/flattenWhereToOperators.ts

```typescript
import type { Where, WhereField } from '../types/index.js'

/**
 * Take a where query and flatten it to all top-level operators
 */
export function flattenWhereToOperators(query: Where): WhereField[] {
  const result: WhereField[] = []

  for (const [key, value] of Object.entries(query)) {
    if ((key === 'and' || key === 'or') && Array.isArray(value)) {
      for (const subQuery of value) {
        const flattenedSub = flattenWhereToOperators(subQuery)
        result.push(...flattenedSub)
      }
    } else {
      result.push(value as WhereField)
    }
  }

  return result
}
```

--------------------------------------------------------------------------------

---[FILE: getLocalizedPaths.ts]---
Location: payload-main/packages/payload/src/database/getLocalizedPaths.ts

```typescript
import type { PathToQuery } from './queryValidation/types.js'

import {
  type Field,
  fieldShouldBeLocalized,
  type FlattenedBlock,
  type FlattenedField,
} from '../fields/config/types.js'
import { APIError, type Payload, type SanitizedCollectionConfig } from '../index.js'

export function getLocalizedPaths({
  collectionSlug,
  fields,
  globalSlug,
  incomingPath,
  locale,
  overrideAccess = false,
  parentIsLocalized,
  payload,
}: {
  collectionSlug?: string
  fields: FlattenedField[]
  globalSlug?: string
  incomingPath: string
  locale?: string
  overrideAccess?: boolean
  /**
   * @todo make required in v4.0. Usually, you'd wanna pass this through
   */
  parentIsLocalized?: boolean
  payload: Payload
}): PathToQuery[] {
  const pathSegments = incomingPath.split('.')
  const localizationConfig = payload.config.localization

  let paths: PathToQuery[] = [
    {
      collectionSlug,
      complete: false,
      // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
      field: undefined,
      fields,
      globalSlug,
      invalid: false,
      parentIsLocalized: parentIsLocalized!,
      path: '',
    },
  ]

  for (let i = 0; i < pathSegments.length; i += 1) {
    const segment = pathSegments[i]

    const lastIncompletePath = paths.find(({ complete }) => !complete)

    if (lastIncompletePath) {
      const { path } = lastIncompletePath
      let currentPath = path ? `${path}.${segment}` : segment

      let fieldsToSearch: FlattenedField[]
      let _parentIsLocalized = parentIsLocalized

      let matchedField!: FlattenedField

      if (lastIncompletePath?.field?.type === 'blocks') {
        if (segment === 'blockType') {
          matchedField = {
            name: 'blockType',
            type: 'text',
          }
        } else {
          for (const _block of lastIncompletePath.field.blockReferences ??
            lastIncompletePath.field.blocks) {
            let block: FlattenedBlock
            if (typeof _block === 'string') {
              block = payload.blocks[_block]!
            } else {
              block = _block
            }

            matchedField = block.flattenedFields.find((field) => field.name === segment)!
            if (matchedField) {
              break
            }
          }
        }
      } else {
        if (lastIncompletePath?.field && 'flattenedFields' in lastIncompletePath.field) {
          fieldsToSearch = lastIncompletePath.field.flattenedFields
        } else {
          fieldsToSearch = lastIncompletePath.fields!
        }
        _parentIsLocalized = parentIsLocalized || lastIncompletePath.field?.localized

        matchedField = fieldsToSearch.find((field) => field.name === segment)!
      }

      lastIncompletePath.field = matchedField!

      if (currentPath === 'globalType' && globalSlug) {
        lastIncompletePath.path = currentPath
        lastIncompletePath.complete = true
        lastIncompletePath.field = {
          name: 'globalType',
          type: 'text',
        }

        return paths
      }

      if (currentPath === 'relationTo') {
        lastIncompletePath.path = currentPath
        lastIncompletePath.complete = true
        lastIncompletePath.field = {
          name: 'relationTo',
          type: 'select',
          options: Object.keys(payload.collections),
        }

        return paths
      }

      if (!matchedField && currentPath === 'id' && i === pathSegments.length - 1) {
        lastIncompletePath.path = currentPath
        const idField: Field = {
          name: 'id',
          type: payload.db.defaultIDType as 'text',
        }
        lastIncompletePath.field = idField
        lastIncompletePath.complete = true
        return paths
      }

      if (matchedField) {
        if ('hidden' in matchedField && matchedField.hidden && !overrideAccess) {
          lastIncompletePath.invalid = true
        }

        const nextSegment = pathSegments[i + 1]!
        const currentFieldIsLocalized = fieldShouldBeLocalized({
          field: matchedField,
          parentIsLocalized: _parentIsLocalized!,
        })

        const nextSegmentIsLocale =
          localizationConfig &&
          localizationConfig.localeCodes.includes(nextSegment) &&
          currentFieldIsLocalized

        if (nextSegmentIsLocale) {
          // Skip the next iteration, because it's a locale
          i += 1
          currentPath = `${currentPath}.${nextSegment}`
        } else if (localizationConfig && currentFieldIsLocalized) {
          currentPath = `${currentPath}.${locale}`
        }

        switch (matchedField.type) {
          case 'join':
          case 'relationship':
          case 'upload': {
            // If this is a polymorphic relation,
            // We only support querying directly (no nested querying)
            if (matchedField.type !== 'join' && typeof matchedField.relationTo !== 'string') {
              lastIncompletePath.path = pathSegments.join('.')
              if (![matchedField.name, 'relationTo', 'value'].includes(pathSegments.at(-1)!)) {
                lastIncompletePath.invalid = true
              } else {
                lastIncompletePath.complete = true
              }
            } else {
              lastIncompletePath.complete = true
              lastIncompletePath.path = currentPath!

              const nestedPathToQuery = pathSegments
                .slice(nextSegmentIsLocale ? i + 2 : i + 1)
                .join('.')

              if (nestedPathToQuery) {
                let relatedCollection: SanitizedCollectionConfig
                if (matchedField.type === 'join') {
                  if (Array.isArray(matchedField.collection)) {
                    throw new APIError('Not supported')
                  }

                  relatedCollection = payload.collections[matchedField.collection]!.config
                } else {
                  relatedCollection = payload.collections[matchedField.relationTo as string]!.config
                }

                const remainingPaths = getLocalizedPaths({
                  collectionSlug: relatedCollection.slug,
                  fields: relatedCollection.flattenedFields,
                  globalSlug,
                  incomingPath: nestedPathToQuery,
                  locale,
                  parentIsLocalized: false,
                  payload,
                })

                paths = [...paths, ...remainingPaths]
              }

              return paths
            }

            break
          }
          case 'json':
          case 'richText': {
            const upcomingSegments = pathSegments.slice(i + 1).join('.')
            pathSegments.forEach((path) => {
              if (!/^\w+(?:\.\w+)*$/.test(path)) {
                lastIncompletePath.invalid = true
              }
            })
            lastIncompletePath.complete = true
            lastIncompletePath.path = upcomingSegments
              ? `${currentPath}.${upcomingSegments}`
              : currentPath!
            return paths
          }

          default: {
            if (i + 1 === pathSegments.length) {
              lastIncompletePath.complete = true
            }
            lastIncompletePath.path = currentPath!
          }
        }
      } else {
        lastIncompletePath.invalid = true
        lastIncompletePath.path = currentPath!
        return paths
      }
    }
  }

  return paths
}
```

--------------------------------------------------------------------------------

---[FILE: sanitizeJoinQuery.ts]---
Location: payload-main/packages/payload/src/database/sanitizeJoinQuery.ts

```typescript
import type { SanitizedCollectionConfig, SanitizedJoin } from '../collections/config/types.js'
import type { JoinQuery, PayloadRequest } from '../types/index.js'

import { executeAccess } from '../auth/executeAccess.js'
import { QueryError } from '../errors/QueryError.js'
import { combineQueries } from './combineQueries.js'
import { validateQueryPaths } from './queryValidation/validateQueryPaths.js'

type Args = {
  collectionConfig: SanitizedCollectionConfig
  joins?: JoinQuery
  overrideAccess: boolean
  req: PayloadRequest
}

const sanitizeJoinFieldQuery = async ({
  collectionSlug,
  errors,
  join,
  joinsQuery,
  overrideAccess,
  promises,
  req,
}: {
  collectionSlug: string
  errors: { path: string }[]
  join: SanitizedJoin
  joinsQuery: JoinQuery
  overrideAccess: boolean
  promises: Promise<void>[]
  req: PayloadRequest
}) => {
  const { joinPath } = join

  // TODO: fix any's in joinsQuery[joinPath]

  if ((joinsQuery as any)[joinPath] === false) {
    return
  }

  const joinCollectionConfig = req.payload.collections[collectionSlug]!.config

  const accessResult = !overrideAccess
    ? await executeAccess({ disableErrors: true, req }, joinCollectionConfig.access.read)
    : true

  if (accessResult === false) {
    ;(joinsQuery as any)[joinPath] = false
    return
  }

  if (!(joinsQuery as any)[joinPath]) {
    ;(joinsQuery as any)[joinPath] = {}
  }

  const joinQuery = (joinsQuery as any)[joinPath]

  if (!joinQuery.where) {
    joinQuery.where = {}
  }

  if (join.field.where) {
    joinQuery.where = combineQueries(joinQuery.where, join.field.where)
  }

  promises.push(
    validateQueryPaths({
      collectionConfig: joinCollectionConfig,
      errors,
      overrideAccess,
      polymorphicJoin: Array.isArray(join.field.collection),
      req,
      // incoming where input, but we shouldn't validate generated from the access control.
      where: joinQuery.where,
    }),
  )

  if (typeof accessResult === 'object') {
    joinQuery.where = combineQueries(joinQuery.where, accessResult)
  }
}

/**
 * * Validates `where` for each join
 * * Combines the access result for joined collection
 * * Combines the default join's `where`
 */
export const sanitizeJoinQuery = async ({
  collectionConfig,
  joins: joinsQuery,
  overrideAccess,
  req,
}: Args) => {
  if (joinsQuery === false) {
    return false
  }

  if (!joinsQuery) {
    joinsQuery = {}
  }

  const errors: { path: string }[] = []
  const promises: Promise<void>[] = []

  for (const collectionSlug in collectionConfig.joins) {
    for (const join of collectionConfig.joins[collectionSlug]!) {
      await sanitizeJoinFieldQuery({
        collectionSlug,
        errors,
        join,
        joinsQuery,
        overrideAccess,
        promises,
        req,
      })
    }
  }

  for (const join of collectionConfig.polymorphicJoins) {
    for (const collectionSlug of join.field.collection) {
      await sanitizeJoinFieldQuery({
        collectionSlug,
        errors,
        join,
        joinsQuery,
        overrideAccess,
        promises,
        req,
      })
    }
  }

  await Promise.all(promises)

  if (errors.length > 0) {
    throw new QueryError(errors)
  }

  return joinsQuery
}
```

--------------------------------------------------------------------------------

---[FILE: sanitizeWhereQuery.ts]---
Location: payload-main/packages/payload/src/database/sanitizeWhereQuery.ts

```typescript
import type { FlattenedField } from '../fields/config/types.js'
import type { Payload, Where } from '../types/index.js'

/**
 * Currently used only for virtual fields linked with relationships
 */
export const sanitizeWhereQuery = ({
  fields,
  payload,
  where,
}: {
  fields: FlattenedField[]
  payload: Payload
  where: Where
}) => {
  for (const key in where) {
    const value = where[key]

    if (['and', 'or'].includes(key.toLowerCase()) && Array.isArray(value)) {
      for (const where of value) {
        sanitizeWhereQuery({ fields, payload, where })
      }
      continue
    }

    const paths = key.split('.')
    let pathHasChanged = false

    let currentFields = fields

    for (let i = 0; i < paths.length; i++) {
      const path = paths[i]!
      const field = currentFields.find((each) => each.name === path)

      if (!field) {
        break
      }

      if ('virtual' in field && field.virtual && typeof field.virtual === 'string') {
        paths[i] = field.virtual
        pathHasChanged = true
      }

      if ('flattenedFields' in field) {
        currentFields = field.flattenedFields
      }

      if (
        (field.type === 'relationship' || field.type === 'upload') &&
        typeof field.relationTo === 'string'
      ) {
        const relatedCollection = payload.collections[field.relationTo]
        if (relatedCollection) {
          currentFields = relatedCollection.config.flattenedFields
        }
      }
    }

    if (pathHasChanged) {
      where[paths.join('.')] = where[key]!
      delete where[key]
    }
  }
}
```

--------------------------------------------------------------------------------

````
