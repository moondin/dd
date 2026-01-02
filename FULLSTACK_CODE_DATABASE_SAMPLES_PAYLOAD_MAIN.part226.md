---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 226
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 226 of 695)

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
Location: payload-main/packages/payload/src/utilities/traverseFields.ts

```typescript
import type { Config, SanitizedConfig } from '../config/types.js'
import type { ArrayField, Block, BlocksField, Field, TabAsField } from '../fields/config/types.js'

import {
  fieldAffectsData,
  fieldHasSubFields,
  fieldShouldBeLocalized,
  tabHasName,
} from '../fields/config/types.js'

const traverseArrayOrBlocksField = ({
  callback,
  callbackStack,
  config,
  data,
  field,
  fillEmpty,
  leavesFirst,
  parentIsLocalized,
  parentPath,
  parentRef,
}: {
  callback: TraverseFieldsCallback
  callbackStack: (() => ReturnType<TraverseFieldsCallback>)[]
  config?: Config | SanitizedConfig
  data: Record<string, unknown>[]
  field: ArrayField | BlocksField
  fillEmpty: boolean
  leavesFirst: boolean
  parentIsLocalized: boolean
  parentPath: string
  parentRef?: unknown
}) => {
  if (fillEmpty) {
    if (field.type === 'array') {
      traverseFields({
        callback,
        callbackStack,
        config,
        fields: field.fields,
        isTopLevel: false,
        leavesFirst,
        parentIsLocalized: parentIsLocalized || field.localized,
        parentPath: `${parentPath}${field.name}.`,
        parentRef,
      })
    }
    if (field.type === 'blocks') {
      for (const _block of field.blockReferences ?? field.blocks) {
        // TODO: iterate over blocks mapped to block slug in v4, or pass through payload.blocks
        const block =
          typeof _block === 'string' ? config?.blocks?.find((b) => b.slug === _block) : _block
        if (block) {
          traverseFields({
            callback,
            callbackStack,
            config,
            fields: block.fields,
            isTopLevel: false,
            leavesFirst,
            parentIsLocalized: parentIsLocalized || field.localized,
            parentPath: `${parentPath}${field.name}.`,
            parentRef,
          })
        }
      }
    }
    return
  }
  for (const ref of data) {
    let fields!: Field[]
    if (field.type === 'blocks' && typeof ref?.blockType === 'string') {
      // TODO: iterate over blocks mapped to block slug in v4, or pass through payload.blocks
      const block = field.blockReferences
        ? ((config?.blocks?.find((b) => b.slug === ref.blockType) ??
            field.blockReferences.find(
              (b) => typeof b !== 'string' && b.slug === ref.blockType,
            )) as Block)
        : field.blocks.find((b) => b.slug === ref.blockType)

      fields = block?.fields as Field[]
    } else if (field.type === 'array') {
      fields = field.fields
    }

    if (fields) {
      traverseFields({
        callback,
        callbackStack,
        config,
        fields,
        fillEmpty,
        isTopLevel: false,
        leavesFirst,
        parentIsLocalized: parentIsLocalized || field.localized,
        parentPath: `${parentPath}${field.name}.`,
        parentRef,
        ref,
      })
    }
  }
}

export type TraverseFieldsCallback = (args: {
  /**
   * The current field
   */
  field: Field | TabAsField
  /**
   * Function that when called will skip the current field and continue to the next
   */
  next?: () => void
  parentIsLocalized: boolean
  parentPath: string
  /**
   * The parent reference object
   */
  parentRef?: Record<string, unknown> | unknown
  /**
   * The current reference object
   */
  ref?: Record<string, unknown> | unknown
}) => boolean | void

type TraverseFieldsArgs = {
  callback: TraverseFieldsCallback
  callbackStack?: (() => ReturnType<TraverseFieldsCallback>)[]
  config?: Config | SanitizedConfig
  fields: (Field | TabAsField)[]
  fillEmpty?: boolean
  isTopLevel?: boolean
  /**
   * @default false
   *
   * if this is `true`, the callback functions of the leaf fields will be called before the parent fields.
   * The return value of the callback function will be ignored.
   */
  leavesFirst?: boolean
  parentIsLocalized?: boolean
  parentPath?: string
  parentRef?: Record<string, unknown> | unknown
  ref?: Record<string, unknown> | unknown
}

/**
 * Iterate a recurse an array of fields, calling a callback for each field
 *
 * @param fields
 * @param callback callback called for each field, discontinue looping if callback returns truthy
 * @param fillEmpty fill empty properties to use this without data
 * @param ref the data or any artifacts assigned in the callback during field recursion
 * @param parentRef the data or any artifacts assigned in the callback during field recursion one level up
 */
export const traverseFields = ({
  callback,
  callbackStack: _callbackStack = [],
  config,
  fields,
  fillEmpty = true,
  isTopLevel = true,
  leavesFirst = false,
  parentIsLocalized,
  parentPath = '',
  parentRef = {},
  ref = {},
}: TraverseFieldsArgs): void => {
  const fieldsMatched = fields.some((field) => {
    let callbackStack: (() => ReturnType<TraverseFieldsCallback>)[] = []
    if (!isTopLevel) {
      callbackStack = _callbackStack
    }
    let skip = false
    const next = () => {
      skip = true
    }

    if (!ref || typeof ref !== 'object') {
      return
    }

    if (
      !leavesFirst &&
      callback &&
      callback({ field, next, parentIsLocalized: parentIsLocalized!, parentPath, parentRef, ref })
    ) {
      return true
    } else if (leavesFirst) {
      callbackStack.push(() =>
        callback({
          field,
          next,
          parentIsLocalized: parentIsLocalized!,
          parentPath,
          parentRef,
          ref,
        }),
      )
    }

    if (skip) {
      return false
    }

    // avoid mutation of ref for all fields
    let currentRef = ref
    let currentParentRef = parentRef

    if (field.type === 'tabs' && 'tabs' in field) {
      for (const tab of field.tabs) {
        let tabRef = ref

        if (skip) {
          return false
        }

        if ('name' in tab && tab.name) {
          if (
            !ref[tab.name as keyof typeof ref] ||
            typeof ref[tab.name as keyof typeof ref] !== 'object'
          ) {
            if (fillEmpty) {
              if (tab.localized) {
                ;(ref as Record<string, any>)[tab.name] = { en: {} }
              } else {
                ;(ref as Record<string, any>)[tab.name] = {}
              }
            } else {
              continue
            }
          }

          if (
            callback &&
            !leavesFirst &&
            callback({
              field: { ...tab, type: 'tab' },
              next,
              parentIsLocalized: parentIsLocalized!,
              parentPath,
              parentRef: currentParentRef,
              ref: tabRef,
            })
          ) {
            return true
          } else if (leavesFirst) {
            callbackStack.push(() =>
              callback({
                field: { ...tab, type: 'tab' },
                next,
                parentIsLocalized: parentIsLocalized!,
                parentPath,
                parentRef: currentParentRef,
                ref: tabRef,
              }),
            )
          }

          tabRef = tabRef[tab.name as keyof typeof tabRef]

          if (tab.localized) {
            for (const key in tabRef as Record<string, unknown>) {
              if (
                tabRef[key as keyof typeof tabRef] &&
                typeof tabRef[key as keyof typeof tabRef] === 'object'
              ) {
                traverseFields({
                  callback,
                  callbackStack,
                  config,
                  fields: tab.fields,
                  fillEmpty,
                  isTopLevel: false,
                  leavesFirst,
                  parentIsLocalized: true,
                  parentPath: `${parentPath}${tab.name}.`,
                  parentRef: currentParentRef,
                  ref: tabRef[key as keyof typeof tabRef],
                })
              }
            }
          }
        } else {
          if (
            callback &&
            !leavesFirst &&
            callback({
              field: { ...tab, type: 'tab' },
              next,
              parentIsLocalized: parentIsLocalized!,
              parentPath,
              parentRef: currentParentRef,
              ref: tabRef,
            })
          ) {
            return true
          } else if (leavesFirst) {
            callbackStack.push(() =>
              callback({
                field: { ...tab, type: 'tab' },
                next,
                parentIsLocalized: parentIsLocalized!,
                parentPath,
                parentRef: currentParentRef,
                ref: tabRef,
              }),
            )
          }
        }

        if (!tab.localized) {
          traverseFields({
            callback,
            callbackStack,
            config,
            fields: tab.fields,
            fillEmpty,
            isTopLevel: false,
            leavesFirst,
            parentIsLocalized: false,
            parentPath: tabHasName(tab) ? `${parentPath}${tab.name}` : parentPath,
            parentRef: currentParentRef,
            ref: tabRef,
          })
        }

        if (skip) {
          return false
        }
      }

      return
    }

    if (field.type === 'tab' || fieldHasSubFields(field) || field.type === 'blocks') {
      if ('name' in field && field.name) {
        currentParentRef = currentRef
        if (!ref[field.name as keyof typeof ref]) {
          if (fillEmpty) {
            if (field.type === 'group' || field.type === 'tab') {
              if (fieldShouldBeLocalized({ field, parentIsLocalized: parentIsLocalized! })) {
                ;(ref as Record<string, any>)[field.name] = { en: {} }
              } else {
                ;(ref as Record<string, any>)[field.name] = {}
              }
            } else if (field.type === 'array' || field.type === 'blocks') {
              if (fieldShouldBeLocalized({ field, parentIsLocalized: parentIsLocalized! })) {
                ;(ref as Record<string, any>)[field.name] = { en: [] }
              } else {
                ;(ref as Record<string, any>)[field.name] = []
              }
            }
          } else {
            return
          }
        }
        currentRef = ref[field.name as keyof typeof ref]
      }

      if (
        (field.type === 'tab' || field.type === 'group') &&
        fieldShouldBeLocalized({ field, parentIsLocalized: parentIsLocalized! }) &&
        currentRef &&
        typeof currentRef === 'object'
      ) {
        if (fieldAffectsData(field)) {
          for (const key in currentRef as Record<string, unknown>) {
            if (currentRef[key as keyof typeof currentRef]) {
              traverseFields({
                callback,
                callbackStack,
                config,
                fields: field.fields,
                fillEmpty,
                isTopLevel: false,
                leavesFirst,
                parentIsLocalized: true,
                parentPath: field.name ? `${parentPath}${field.name}.` : parentPath,
                parentRef: currentParentRef,
                ref: currentRef[key as keyof typeof currentRef],
              })
            }
          }
        } else {
          traverseFields({
            callback,
            callbackStack,
            config,
            fields: field.fields,
            fillEmpty,
            isTopLevel: false,
            leavesFirst,
            parentIsLocalized,
            parentRef: currentParentRef,
            ref: currentRef,
          })
        }

        return
      }

      if (
        (field.type === 'blocks' || field.type === 'array') &&
        currentRef &&
        typeof currentRef === 'object'
      ) {
        // TODO: `?? field.localized ?? false` shouldn't be necessary, but right now it
        // is so that all fields are correctly traversed in copyToLocale and
        // therefore pass the localization integration tests.
        // I tried replacing the `!parentIsLocalized` condition with `parentIsLocalized === false`
        // in `fieldShouldBeLocalized`, but several tests failed. We must be calling it with incorrect
        // parameters somewhere.
        if (
          fieldShouldBeLocalized({
            field,
            parentIsLocalized: parentIsLocalized ?? false,
          })
        ) {
          if (Array.isArray(currentRef)) {
            traverseArrayOrBlocksField({
              callback,
              callbackStack,
              config,
              data: currentRef,
              field,
              fillEmpty,
              leavesFirst,
              parentIsLocalized: true,
              parentPath,
              parentRef: currentParentRef,
            })
          } else {
            for (const key in currentRef as Record<string, unknown>) {
              const localeData = currentRef[key as keyof typeof currentRef]
              if (!Array.isArray(localeData)) {
                continue
              }

              traverseArrayOrBlocksField({
                callback,
                callbackStack,
                config,
                data: localeData,
                field,
                fillEmpty,
                leavesFirst,
                parentIsLocalized: true,
                parentPath,
                parentRef: currentParentRef,
              })
            }
          }
        } else if (Array.isArray(currentRef)) {
          traverseArrayOrBlocksField({
            callback,
            callbackStack,
            config,
            data: currentRef as Record<string, unknown>[],
            field,
            fillEmpty,
            leavesFirst,
            parentIsLocalized: parentIsLocalized!,
            parentPath,
            parentRef: currentParentRef,
          })
        }
      } else if (currentRef && typeof currentRef === 'object' && 'fields' in field) {
        traverseFields({
          callback,
          callbackStack,
          config,
          fields: field.fields,
          fillEmpty,
          isTopLevel: false,
          leavesFirst,
          parentIsLocalized,
          parentPath: 'name' in field && field.name ? `${parentPath}${field.name}.` : parentPath,
          parentRef: currentParentRef,
          ref: currentRef,
        })
      }
    }

    if (isTopLevel) {
      callbackStack.reverse().forEach((cb) => {
        cb()
      })
    }
  })

  // Fallback: Handle dot-notation paths when no fields matched
  if (!fieldsMatched && ref && typeof ref === 'object') {
    Object.keys(ref).forEach((key) => {
      if (key.includes('.')) {
        // Split on first dot only
        const firstDotIndex = key.indexOf('.')
        const fieldName = key.substring(0, firstDotIndex)
        const remainingPath = key.substring(firstDotIndex + 1)

        // Create nested structure for this field
        if (!ref[fieldName as keyof typeof ref]) {
          ;(ref as Record<string, unknown>)[fieldName] = {}
        }

        const nestedRef = ref[fieldName as keyof typeof ref] as Record<string, unknown>

        // Move the value to the nested structure
        nestedRef[remainingPath] = (ref as Record<string, unknown>)[key]
        delete (ref as Record<string, unknown>)[key]

        // Recursively process the newly created nested structure
        // The field traversal will naturally handle it if the field exists in the schema
        traverseFields({
          callback,
          callbackStack: _callbackStack,
          config,
          fields,
          fillEmpty,
          isTopLevel: false,
          leavesFirst,
          parentIsLocalized,
          parentPath,
          parentRef,
          ref,
        })
      }
    })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: unflatten.ts]---
Location: payload-main/packages/payload/src/utilities/unflatten.ts

```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * Copyright (c) 2014, Hugh Kennedy
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 * 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/*
 * Copyright (c) 2020, Feross Aboukhadijeh <https://feross.org>
 * Reference: https://www.npmjs.com/package/is-buffer
 * All rights reserved.
 */
function isBuffer(obj: any) {
  return (
    obj != null &&
    obj.constructor != null &&
    typeof obj.constructor.isBuffer === 'function' &&
    obj.constructor.isBuffer(obj)
  )
}

interface Opts {
  delimiter?: string
  object?: any
  overwrite?: boolean
  recursive?: boolean
}

export const unflatten = (target: any, opts?: Opts) => {
  opts = opts || {}

  const delimiter = opts.delimiter || '.'
  const overwrite = opts.overwrite || false
  const recursive = opts.recursive || false
  const result = {}

  const isbuffer = isBuffer(target)

  if (isbuffer || Object.prototype.toString.call(target) !== '[object Object]') {
    return target
  }

  // safely ensure that the key is an integer.
  const getkey = (key: any) => {
    const parsedKey = Number(key)
    return isNaN(parsedKey) || key.indexOf('.') !== -1 || opts.object ? key : parsedKey
  }

  const sortedKeys = Object.keys(target).sort((keyA, keyB) => keyA.length - keyB.length)

  sortedKeys.forEach((key) => {
    const split = key.split(delimiter)
    let key1 = getkey(split.shift())
    let key2 = getkey(split[0])
    let recipient = result as Record<string, any>

    while (key2 !== undefined) {
      if (key1 === '__proto__') {
        return
      }

      const type = Object.prototype.toString.call(recipient[key1])
      const isobject = type === '[object Object]' || type === '[object Array]'

      // do not write over falsey, non-undefined values if overwrite is false
      if (!overwrite && !isobject && typeof recipient[key1] !== 'undefined') {
        return
      }

      if ((overwrite && !isobject) || (!overwrite && recipient[key1] == null)) {
        recipient[key1] = typeof key2 === 'number' && !opts.object ? [] : {}
      }

      recipient = recipient[key1]

      if (split.length > 0) {
        key1 = getkey(split.shift())
        key2 = getkey(split[0])
      }
    }

    // unflatten again for 'messy objects'
    recipient[key1] = recursive ? unflatten(target[key], opts) : target[key]
  })

  return result
}
```

--------------------------------------------------------------------------------

---[FILE: validateMimeType.ts]---
Location: payload-main/packages/payload/src/utilities/validateMimeType.ts

```typescript
export const validateMimeType = (mimeType: string, allowedMimeTypes: string[]): boolean => {
  const cleanedMimeTypes = allowedMimeTypes.map((v) => v.replace('*', ''))
  return cleanedMimeTypes.some((cleanedMimeType) => mimeType.startsWith(cleanedMimeType))
}
```

--------------------------------------------------------------------------------

---[FILE: validatePDF.ts]---
Location: payload-main/packages/payload/src/utilities/validatePDF.ts

```typescript
export function validatePDF(buffer: Buffer) {
  // Check for PDF header
  const header = buffer.subarray(0, 8).toString('latin1')
  if (!header.startsWith('%PDF-')) {
    return false
  }

  // Check for EOF marker and xref table
  const endSize = Math.min(1024, buffer.length)
  const end = buffer.subarray(buffer.length - endSize).toString('latin1')

  if (!end.includes('%%EOF') || !end.includes('xref')) {
    return false
  }

  return true
}
```

--------------------------------------------------------------------------------

---[FILE: validateWhereQuery.ts]---
Location: payload-main/packages/payload/src/utilities/validateWhereQuery.ts

```typescript
import type { Operator, Where } from '../types/index.js'

import { validOperatorSet } from '../types/constants.js'

/**
 * Validates that a "where" query is in a format in which the "where builder" can understand.
 * Even though basic queries are valid, we need to hoist them into the "and" / "or" format.
 * Use this function alongside `transformWhereQuery` to perform a transformation if the query is not valid.
 * @example
 * Inaccurate: [text][equals]=example%20post
 * Accurate: [or][0][and][0][text][equals]=example%20post
 */
export const validateWhereQuery = (whereQuery: Where): whereQuery is Where => {
  if (
    whereQuery?.or &&
    (whereQuery?.or?.length === 0 ||
      (whereQuery?.or?.length > 0 &&
        whereQuery?.or?.[0]?.and &&
        whereQuery?.or?.[0]?.and?.length > 0))
  ) {
    // At this point we know that the whereQuery has 'or' and 'and' fields,
    // now let's check the structure and content of these fields.

    const isValid = whereQuery.or.every((orQuery) => {
      if (orQuery.and && Array.isArray(orQuery.and)) {
        return orQuery.and.every((andQuery) => {
          if (typeof andQuery !== 'object') {
            return false
          }

          const andKeys = Object.keys(andQuery)

          // If there are no keys, it's not a valid WhereField.
          if (andKeys.length === 0) {
            return false
          }

          for (const key of andKeys) {
            const operator = Object.keys(andQuery[key]!)[0]
            // Check if the key is a valid Operator.
            if (!operator || !validOperatorSet.has(operator as Operator)) {
              return false
            }
          }
          return true
        })
      }
      return false
    })

    return isValid
  }

  return false
}
```

--------------------------------------------------------------------------------

---[FILE: wait.ts]---
Location: payload-main/packages/payload/src/utilities/wait.ts

```typescript
export async function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
```

--------------------------------------------------------------------------------

---[FILE: wordBoundariesRegex.ts]---
Location: payload-main/packages/payload/src/utilities/wordBoundariesRegex.ts

```typescript
export const wordBoundariesRegex = (input: string): RegExp => {
  const words = input.split(' ')

  // Regex word boundaries that work for cyrillic characters - https://stackoverflow.com/a/47062016/1717697
  const wordBoundaryBefore = '(?:(?:[^\\p{L}\\p{N}])|^)' // Converted to a non-matching group instead of positive lookbehind for Safari
  const wordBoundaryAfter = '(?=[^\\p{L}\\p{N}]|$)'
  const regex = words.reduce((pattern, word, i) => {
    const escapedWord = word.replace(/[\\^$*+?.()|[\]{}]/g, '\\$&')
    return `${pattern}(?=.*${wordBoundaryBefore}.*${escapedWord}.*${wordBoundaryAfter})${
      i + 1 === words.length ? '.+' : ''
    }`
  }, '')
  return new RegExp(regex, 'i')
}
```

--------------------------------------------------------------------------------

---[FILE: wrapInternalEndpoints.ts]---
Location: payload-main/packages/payload/src/utilities/wrapInternalEndpoints.ts

```typescript
import type { Endpoint } from '../config/types.js'

import { addDataAndFileToRequest } from './addDataAndFileToRequest.js'
import { addLocalesToRequestFromData } from './addLocalesToRequest.js'

export const wrapInternalEndpoints = (endpoints: Endpoint[]): Endpoint[] => {
  return endpoints.map((endpoint) => {
    const handler = endpoint.handler

    if (['patch', 'post'].includes(endpoint.method)) {
      endpoint.handler = async (req) => {
        await addDataAndFileToRequest(req)
        addLocalesToRequestFromData(req)
        return handler(req)
      }
    }

    return endpoint
  })
}
```

--------------------------------------------------------------------------------

---[FILE: dependencyChecker.ts]---
Location: payload-main/packages/payload/src/utilities/dependencies/dependencyChecker.ts

```typescript
import path from 'path'
import { fileURLToPath } from 'url'

import { getDependencies } from '../../index.js'
import { compareVersions } from './versionUtils.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export type CustomVersionParser = (version: string) => { parts: number[]; preReleases: string[] }

export type DependencyCheckerArgs = {
  /**
   * Define dependency groups to ensure that all dependencies within that group are on the same version, and that no dependencies in that group with different versions are found
   */
  dependencyGroups?: {
    dependencies: string[]
    /**
     * Name of the dependency group to be displayed in the error message
     */
    name: string
    targetVersion?: string
    targetVersionDependency?: string
  }[]
  /**
   * Dependency package names keyed to their required versions. Supports >= (greater or equal than version) as a prefix, or no prefix for the exact version
   */
  dependencyVersions?: {
    [dependency: string]: {
      customVersionParser?: CustomVersionParser
      required?: boolean
      version?: string
    }
  }
}

export async function checkDependencies({
  dependencyGroups,
  dependencyVersions,
}: DependencyCheckerArgs): Promise<void> {
  if (dependencyGroups?.length) {
    for (const dependencyGroup of dependencyGroups) {
      const resolvedDependencies = await getDependencies(dirname, dependencyGroup.dependencies)

      // Go through each resolved dependency. If any dependency has a mismatching version, throw an error
      const foundVersions: {
        [version: string]: string
      } = {}
      for (const [_pkg, { version }] of resolvedDependencies.resolved) {
        if (!Object.keys(foundVersions).includes(version)) {
          foundVersions[version] = _pkg
        }
      }
      if (Object.keys(foundVersions).length > 1) {
        const targetVersion =
          dependencyGroup.targetVersion ??
          resolvedDependencies.resolved.get(dependencyGroup.targetVersionDependency!)?.version
        if (targetVersion) {
          const formattedVersionsWithPackageNameString = Object.entries(foundVersions)
            .filter(([version]) => version !== targetVersion)
            .map(([version, pkg]) => `${pkg}@${version} (Please change this to ${targetVersion})`)
            .join(', ')
          throw new Error(
            `Mismatching "${dependencyGroup.name}" dependency versions found: ${formattedVersionsWithPackageNameString}. All "${dependencyGroup.name}" packages must have the same version. This is an error with your set-up, not a bug in Payload. Please go to your package.json and ensure all "${dependencyGroup.name}" packages have the same version.`,
          )
        } else {
          const formattedVersionsWithPackageNameString = Object.entries(foundVersions)
            .map(([version, pkg]) => `${pkg}@${version}`)
            .join(', ')
          throw new Error(
            `Mismatching "${dependencyGroup.name}" dependency versions found: ${formattedVersionsWithPackageNameString}. All "${dependencyGroup.name}" packages must have the same version. This is an error with your set-up, not a bug in Payload. Please go to your package.json and ensure all "${dependencyGroup.name}" packages have the same version.`,
          )
        }
      }
    }
  }

  if (dependencyVersions && Object.keys(dependencyVersions).length) {
    const resolvedDependencies = await getDependencies(dirname, Object.keys(dependencyVersions))
    for (const [dependency, settings] of Object.entries(dependencyVersions)) {
      const resolvedDependency = resolvedDependencies.resolved.get(dependency)
      if (!resolvedDependency) {
        if (!settings.required) {
          continue
        }
        throw new Error(`Dependency ${dependency} not found. Please ensure it is installed.`)
      }

      if (settings.version) {
        const settingsVersionToCheck = settings.version.startsWith('>=')
          ? settings.version.slice(2)
          : settings.version

        const versionCompareResult = compareVersions(
          resolvedDependency.version,
          settingsVersionToCheck,
          settings.customVersionParser,
        )

        if (settings.version.startsWith('>=')) {
          if (versionCompareResult === 'lower') {
            throw new Error(
              `Dependency ${dependency} is on version ${resolvedDependency.version}, but ${settings.version} or greater is required. Please update this dependency.`,
            )
          }
        } else if (versionCompareResult === 'lower' || versionCompareResult === 'greater') {
          throw new Error(
            `Dependency ${dependency} is on version ${resolvedDependency.version}, but ${settings.version} is required. Please update this dependency.`,
          )
        }
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: getDependencies.ts]---
Location: payload-main/packages/payload/src/utilities/dependencies/getDependencies.ts

```typescript
/*
  This source code has been taken and modified from https://github.com/vercel/next.js/blob/41a80533f900467e1b788bd2673abe2dca20be6a/packages/next/src/lib/has-necessary-dependencies.ts

  License:

  The MIT License (MIT)

  Copyright (c) 2024 Vercel, Inc.

  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import { findUp } from '../findUp.js'
import { resolveFrom } from './resolveFrom.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const payloadPkgDirname = path.resolve(dirname, '../../../') // pkg dir (outside src)

const resolvedCwd = path.resolve(process.cwd())

export type NecessaryDependencies = {
  missing: string[]
  resolved: Map<
    string,
    {
      path: string
      version: string
    }
  >
}

export async function getDependencies(
  baseDir: string,
  requiredPackages: string[],
): Promise<NecessaryDependencies> {
  const resolutions = new Map<
    string,
    {
      path: string
      version: string
    }
  >()
  const missingPackages: string[] = []

  await Promise.all(
    requiredPackages.map(async (pkg) => {
      try {
        const pkgPath = await fs.realpath(resolveFrom(baseDir, pkg))
        const pkgDir = path.dirname(pkgPath)

        let packageJsonFilePath: null | string = null

        const foundPackageJsonDir = await findUp({
          dir: pkgDir,
          fileNames: ['package.json'],
        })

        if (foundPackageJsonDir) {
          const resolvedFoundPath = path.resolve(foundPackageJsonDir)

          if (
            resolvedFoundPath.startsWith(resolvedCwd) ||
            resolvedFoundPath.startsWith(payloadPkgDirname)
          ) {
            // We don't want to match node modules outside the user's project. Checking for both process.cwd and dirname is a reliable way to do this.
            packageJsonFilePath = resolvedFoundPath
          }
        }

        // No need to check if packageJsonFilePath exists - findUp checks that for us
        if (packageJsonFilePath) {
          // parse version
          const packageJson = JSON.parse(await fs.readFile(packageJsonFilePath, 'utf8'))
          const version = packageJson.version

          resolutions.set(pkg, {
            path: packageJsonFilePath,
            version,
          })
        } else {
          return missingPackages.push(pkg)
        }
      } catch (_) {
        return missingPackages.push(pkg)
      }
    }),
  )

  return {
    missing: missingPackages,
    resolved: resolutions,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: isError.ts]---
Location: payload-main/packages/payload/src/utilities/dependencies/isError.ts

```typescript
/*
  This source code has been taken and modified from https://github.com/vercel/next.js/blob/be87132327ea28acd4bf7af09a401bac2374cb64/packages/next/src/lib/is-error.ts

  License:

  The MIT License (MIT)

  Copyright (c) 2024 Vercel, Inc.

  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

export interface ErrorWithCode extends Error {
  code?: number | string
}

export function isError(err: unknown): err is ErrorWithCode {
  return typeof err === 'object' && err !== null && 'name' in err && 'message' in err
}
```

--------------------------------------------------------------------------------

---[FILE: realPath.ts]---
Location: payload-main/packages/payload/src/utilities/dependencies/realPath.ts

```typescript
/*
  This source code has been taken from https://github.com/vercel/next.js/blob/39498d604c3b25d92a483153fe648a7ee456fbda/packages/next/src/lib/realpath.ts

  License:

  The MIT License (MIT)

  Copyright (c) 2024 Vercel, Inc.

  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import fs from 'fs'

const isWindows = process.platform === 'win32'

// Interesting learning from this, that fs.realpathSync is 70x slower than fs.realpathSync.native:
// https://sun0day.github.io/blog/vite/why-vite4_3-is-faster.html#fs-realpathsync-issue
// https://github.com/nodejs/node/issues/2680
// However, we can't use fs.realpathSync.native on Windows due to behavior differences.
export const realpathSync = isWindows ? fs.realpathSync : fs.realpathSync.native
```

--------------------------------------------------------------------------------

---[FILE: resolveFrom.ts]---
Location: payload-main/packages/payload/src/utilities/dependencies/resolveFrom.ts

```typescript
/*
  This source code has been taken and modified from https://github.com/vercel/next.js/blob/39498d604c3b25d92a483153fe648a7ee456fbda/packages/next/src/lib/resolve-from.ts

  License:

  The MIT License (MIT)

  Copyright (c) 2024 Vercel, Inc.

  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// source: https://github.com/sindresorhus/resolve-from
import { createRequire } from 'module'
import path from 'path'

import { isError } from './isError.js'
import { realpathSync } from './realPath.js'

export const resolveFrom = (fromDirectory: string, moduleId: string, silent?: boolean) => {
  if (typeof fromDirectory !== 'string') {
    throw new TypeError(
      `Expected \`fromDir\` to be of type \`string\`, got \`${typeof fromDirectory}\``,
    )
  }

  if (typeof moduleId !== 'string') {
    throw new TypeError(
      `Expected \`moduleId\` to be of type \`string\`, got \`${typeof moduleId}\``,
    )
  }

  try {
    fromDirectory = realpathSync(fromDirectory)
  } catch (error: unknown) {
    if (isError(error) && error.code === 'ENOENT') {
      fromDirectory = path.resolve(fromDirectory)
    } else if (silent) {
      return
    } else {
      throw error
    }
  }

  const fromFile = path.join(fromDirectory, 'noop.js')

  const require = createRequire(import.meta.url)

  const Module = require('module')

  const resolveFileName = () => {
    return Module._resolveFilename(moduleId, {
      id: fromFile,
      filename: fromFile,
      paths: Module._nodeModulePaths(fromDirectory),
    })
  }

  if (silent) {
    try {
      return resolveFileName()
    } catch (ignore) {
      return
    }
  }

  return resolveFileName()
}
```

--------------------------------------------------------------------------------

````
