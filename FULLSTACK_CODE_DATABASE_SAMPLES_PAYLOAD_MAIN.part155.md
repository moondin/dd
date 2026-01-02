---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 155
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 155 of 695)

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

---[FILE: withOperators.ts]---
Location: payload-main/packages/graphql/src/schema/withOperators.ts

```typescript
import type { GraphQLType } from 'graphql'
import type { FieldAffectingData, NumberField, RadioField, SelectField } from 'payload'

import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLString,
} from 'graphql'
import { DateTimeResolver, EmailAddressResolver } from 'graphql-scalars'
import { optionIsObject } from 'payload/shared'

import { GraphQLJSON } from '../packages/graphql-type-json/index.js'
import { combineParentName } from '../utilities/combineParentName.js'
import { formatName } from '../utilities/formatName.js'
import { operators } from './operators.js'

type staticTypes =
  | 'checkbox'
  | 'code'
  | 'date'
  | 'email'
  | 'json'
  | 'number'
  | 'point'
  | 'relationship'
  | 'richText'
  | 'text'
  | 'textarea'
  | 'upload'

type dynamicTypes = 'radio' | 'select'

const GeoJSONObject = new GraphQLInputObjectType({
  name: 'GeoJSONObject',
  fields: {
    type: { type: GraphQLString },
    coordinates: {
      type: GraphQLJSON,
    },
  },
})

type DefaultsType = {
  [key in dynamicTypes]: {
    operators: {
      name: string
      type: (field: FieldAffectingData, parentName: string) => GraphQLType
    }[]
  }
} & {
  [key in staticTypes]: {
    operators: {
      name: string
      type: ((field: FieldAffectingData, parentName: string) => GraphQLType) | GraphQLType
    }[]
  }
}

const defaults: DefaultsType = {
  checkbox: {
    operators: [
      ...operators.equality.map((operator) => ({
        name: operator,
        type: GraphQLBoolean,
      })),
    ],
  },
  code: {
    operators: [
      ...[...operators.equality, ...operators.partial].map((operator) => ({
        name: operator,
        type: GraphQLString,
      })),
    ],
  },
  date: {
    operators: [
      ...[...operators.equality, ...operators.comparison, 'like'].map((operator) => ({
        name: operator,
        type: DateTimeResolver,
      })),
    ],
  },
  email: {
    operators: [
      ...[...operators.equality, ...operators.partial, ...operators.contains].map((operator) => ({
        name: operator,
        type: EmailAddressResolver,
      })),
    ],
  },
  json: {
    operators: [
      ...[...operators.equality, ...operators.partial, ...operators.geojson].map((operator) => ({
        name: operator,
        type: GraphQLJSON,
      })),
    ],
  },
  number: {
    operators: [
      ...[...operators.equality, ...operators.comparison].map((operator) => ({
        name: operator,
        type: (field: NumberField): GraphQLType => {
          return field?.name === 'id' ? GraphQLInt : GraphQLFloat
        },
      })),
    ],
  },
  point: {
    operators: [
      ...[...operators.equality, ...operators.comparison, ...operators.geo].map((operator) => ({
        name: operator,
        type: new GraphQLList(GraphQLFloat),
      })),
      ...operators.geojson.map((operator) => ({
        name: operator,
        /**
         * @example:
         * within: {
         *  type: "Polygon",
         *  coordinates: [[
         *   [0.0, 0.0],
         *   [1.0, 1.0],
         *   [1.0, 0.0],
         *   [0.0, 0.0],
         *  ]],
         * }
         * @example
         * intersects: {
         *  type: "Point",
         *  coordinates: [ 0.5, 0.5 ]
         * }
         */
        type: GeoJSONObject,
      })),
    ],
  },
  radio: {
    operators: [
      ...[...operators.equality, ...operators.partial].map((operator) => ({
        name: operator,
        type: (field: RadioField, parentName): GraphQLType =>
          new GraphQLEnumType({
            name: `${combineParentName(parentName, field.name)}_Input`,
            values: field.options.reduce((values, option) => {
              if (optionIsObject(option)) {
                return {
                  ...values,
                  [formatName(option.value)]: {
                    value: option.value,
                  },
                }
              }

              return {
                ...values,
                [formatName(option)]: {
                  value: option,
                },
              }
            }, {}),
          }),
      })),
    ],
  },
  relationship: {
    operators: [
      ...[...operators.equality, ...operators.contains].map((operator) => ({
        name: operator,
        type: GraphQLJSON,
      })),
    ],
  },
  richText: {
    operators: [
      ...[...operators.equality, ...operators.partial].map((operator) => ({
        name: operator,
        type: GraphQLJSON,
      })),
    ],
  },
  select: {
    operators: [
      ...[...operators.equality, ...operators.contains].map((operator) => ({
        name: operator,
        type: (field: SelectField, parentName): GraphQLType =>
          new GraphQLEnumType({
            name: `${combineParentName(parentName, field.name)}_Input`,
            values: field.options.reduce((values, option) => {
              if (optionIsObject(option)) {
                return {
                  ...values,
                  [formatName(option.value)]: {
                    value: option.value,
                  },
                }
              }

              return {
                ...values,
                [formatName(option)]: {
                  value: option,
                },
              }
            }, {}),
          }),
      })),
    ],
  },
  text: {
    operators: [
      ...[...operators.equality, ...operators.partial, ...operators.contains].map((operator) => ({
        name: operator,
        type: GraphQLString,
      })),
    ],
  },
  textarea: {
    operators: [
      ...[...operators.equality, ...operators.partial].map((operator) => ({
        name: operator,
        type: GraphQLString,
      })),
    ],
  },
  upload: {
    operators: [
      ...[...operators.equality, ...operators.contains].map((operator) => ({
        name: operator,
        type: GraphQLJSON,
      })),
    ],
  },
  // array: n/a
  // group: n/a
  // row: n/a
  // collapsible: n/a
  // tabs: n/a
}

const listOperators = ['in', 'not_in', 'all']

const gqlTypeCache: Record<string, GraphQLType> = {}

/**
 * In GraphQL, you can use "where" as an argument to filter a collection. Example:
 * { Posts(where: { title: { equals: "Hello" } }) { text } }
 * This function defines the operators for a field's condition in the "where" argument of the collection (it thus gets called for every field).
 * For example, in the example above, it would control that
 * - "equals" is a valid operator for the "title" field
 * - the accepted type of the "equals" argument has to be a string.
 *
 * @param field the field for which their valid operators inside a "where" argument is being defined
 * @param parentName the name of the parent field (if any)
 * @returns all the operators (including their types) which can be used as a condition for a given field inside a where
 */
export const withOperators = (
  field: FieldAffectingData,
  parentName: string,
): GraphQLInputObjectType => {
  if (!defaults?.[field.type]) {
    throw new Error(`Error: ${field.type} has no defaults configured.`)
  }

  const name = `${combineParentName(parentName, field.name)}_operator`

  // Get the default operators for the field type which are hard-coded above
  const fieldOperators = [...defaults[field.type].operators]

  if (!('required' in field) || !field.required) {
    fieldOperators.push({
      name: 'exists',
      type: fieldOperators[0].type,
    })
  }

  return new GraphQLInputObjectType({
    name,
    fields: fieldOperators.reduce((objectTypeFields, operator) => {
      // Get the type of the operator. It can be either static, or dynamic (=> a function)
      let gqlType: GraphQLType =
        typeof operator.type === 'function' ? operator.type(field, parentName) : operator.type

      // GraphQL does not allow types with duplicate names, so we use this cache to avoid that.
      // Without this, select and radio fields would have the same name, and GraphQL would throw an error
      // This usually only happens if a custom type is returned from the operator.type function
      if (typeof operator.type === 'function' && 'name' in gqlType) {
        if (gqlTypeCache[gqlType.name]) {
          gqlType = gqlTypeCache[gqlType.name]
        } else {
          gqlTypeCache[gqlType.name] = gqlType
        }
      }

      if (listOperators.includes(operator.name)) {
        gqlType = new GraphQLList(gqlType)
      } else if (operator.name === 'exists') {
        gqlType = GraphQLBoolean
      }

      return {
        ...objectTypeFields,
        [operator.name]: {
          type: gqlType,
        },
      }
    }, {}),
  })
}
```

--------------------------------------------------------------------------------

---[FILE: combineParentName.ts]---
Location: payload-main/packages/graphql/src/utilities/combineParentName.ts

```typescript
import { formatName } from './formatName.js'

export const combineParentName = (parent: string, name: string): string =>
  formatName(`${parent ? `${parent}_` : ''}${name}`)
```

--------------------------------------------------------------------------------

---[FILE: formatName.spec.ts]---
Location: payload-main/packages/graphql/src/utilities/formatName.spec.ts

```typescript
/* eslint-disable jest/prefer-strict-equal */
import { formatName } from './formatName'

describe('formatName', () => {
  it.each`
    char   | expected
    ${'á'} | ${'a'}
    ${'è'} | ${'e'}
    ${'í'} | ${'i'}
    ${'ó'} | ${'o'}
    ${'ú'} | ${'u'}
    ${'ñ'} | ${'n'}
    ${'ü'} | ${'u'}
  `('should convert accented character: $char', ({ char, expected }) => {
    expect(formatName(char)).toEqual(expected)
  })
})
```

--------------------------------------------------------------------------------

---[FILE: formatName.ts]---
Location: payload-main/packages/graphql/src/utilities/formatName.ts

```typescript
const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

export const formatName = (string: string): string => {
  let sanitizedString = String(string)

  const firstLetter = sanitizedString.substring(0, 1)

  if (numbers.indexOf(firstLetter) > -1) {
    sanitizedString = `_${sanitizedString}`
  }

  const formatted = sanitizedString
    // Convert accented characters
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')

    .replace(/\./g, '_')
    .replace(/-|\//g, '_')
    .replace(/\+/g, '_')
    .replace(/,/g, '_')
    .replace(/\(/g, '_')
    .replace(/\)/g, '_')
    .replace(/'/g, '_')
    .replace(/ /g, '')
    .replace(/\[|\]/g, '_')

  return formatted || '_'
}
```

--------------------------------------------------------------------------------

---[FILE: formatOptions.ts]---
Location: payload-main/packages/graphql/src/utilities/formatOptions.ts

```typescript
import type { RadioField, SelectField } from 'payload'

import { formatName } from './formatName.js'

export const formatOptions = (field: RadioField | SelectField) => {
  return field.options.reduce((values, option) => {
    if (typeof option === 'object') {
      return {
        ...values,
        [formatName(option.value)]: {
          value: option.value,
        },
      }
    }

    return {
      ...values,
      [formatName(option)]: {
        value: option,
      },
    }
  }, {})
}
```

--------------------------------------------------------------------------------

---[FILE: groupOrTabHasRequiredSubfield.ts]---
Location: payload-main/packages/graphql/src/utilities/groupOrTabHasRequiredSubfield.ts

```typescript
import type { Field, Tab } from 'payload'

import { fieldAffectsData } from 'payload/shared'

export const groupOrTabHasRequiredSubfield = (entity: Field | Tab): boolean => {
  if ('type' in entity && entity.type === 'group') {
    return entity.fields.some((subField) => {
      return (
        (fieldAffectsData(subField) && 'required' in subField && subField.required) ||
        groupOrTabHasRequiredSubfield(subField)
      )
    })
  }

  if ('fields' in entity && 'name' in entity) {
    return (entity as Tab).fields.some((subField) => groupOrTabHasRequiredSubfield(subField))
  }

  return false
}
```

--------------------------------------------------------------------------------

---[FILE: select.ts]---
Location: payload-main/packages/graphql/src/utilities/select.ts

```typescript
import type { GraphQLObjectType, GraphQLResolveInfo, SelectionSetNode} from 'graphql'
import type { FieldBase, JoinField, RelationshipField, TypedCollectionSelect } from 'payload'

import { getNamedType, isInterfaceType, isObjectType, isUnionType, Kind } from 'graphql'

export function buildSelectForCollection(info: GraphQLResolveInfo): SelectType {
  return buildSelect(info)
}
export function buildSelectForCollectionMany(info: GraphQLResolveInfo): SelectType {
  return buildSelect(info).docs as SelectType
}

export function resolveSelect(info: GraphQLResolveInfo, select: SelectType): SelectType {
  if (select) {
    const traversePath: string[] = []
    const traverseTree = (path: GraphQLResolveInfo['path']) => {
      const pathKey = path.key
      const pathType = info.schema.getType(path.typename) as GraphQLObjectType

      if (pathType) {
        const field = pathType?.getFields()?.[pathKey]?.extensions?.field as JoinField | RelationshipField

        if (field?.type === 'join') {
          path = path.prev
          traversePath.unshift('docs')
        }
        if (field?.type === 'relationship' && Array.isArray(field.relationTo)) {
          path = path.prev
          traversePath.unshift('value')
        }
        if (field) {
          traversePath.unshift(field.name)
        }
      }

      if (path.prev) {
        traverseTree(path.prev)
      }
    }

    traverseTree(info.path)
    traversePath.forEach(key => { select = select?.[key] as SelectType })
  }

  return select
}

function buildSelect(info: GraphQLResolveInfo) {
  const returnType = getNamedType(info.returnType) as GraphQLObjectType
  const selectionSet = info.fieldNodes[0].selectionSet

  if (!returnType) return

  return buildSelectTree(info, selectionSet, returnType)
}
function buildSelectTree(
  info: GraphQLResolveInfo,
  selectionSet: SelectionSetNode,
  type: GraphQLObjectType
): SelectType {
  const fieldMap = type.getFields?.()
  const fieldTree: SelectType = {}

  for (const selection of selectionSet.selections) {
    switch (selection.kind) {
      case Kind.FIELD: {
        const fieldName = selection.name.value
        const fieldSchema = fieldMap?.[fieldName]

        const field = fieldSchema?.extensions?.field as FieldBase
        const fieldNameOriginal = field?.name || fieldName

        if (fieldName === '__typename') continue
        if (fieldSchema == undefined) continue

        if (selection.selectionSet) {
          const type = getNamedType(fieldSchema.type) as GraphQLObjectType

          if (isObjectType(type) || isInterfaceType(type) || isUnionType(type)) {
            fieldTree[fieldNameOriginal] = buildSelectTree(info, selection.selectionSet, type)
            continue
          }
        }

        fieldTree[fieldNameOriginal] = true
        break
      }

      case Kind.FRAGMENT_SPREAD: {
        const fragmentName = selection.name.value
        const fragment = info.fragments[fragmentName]
        const fragmentType = fragment && info.schema.getType(fragment.typeCondition.name.value) as GraphQLObjectType

        if (fragmentType) {
          Object.assign(fieldTree, buildSelectTree(info, fragment.selectionSet, fragmentType))
        }
        break
      }

      case Kind.INLINE_FRAGMENT: {
        const fragmentType = selection.typeCondition
          ? info.schema.getType(selection.typeCondition.name.value) as GraphQLObjectType
          : type


        if (fragmentType) {
          Object.assign(fieldTree, buildSelectTree(info, selection.selectionSet, fragmentType))
        }
        break
      }
    }
  }

  return fieldTree
}

type SelectType = TypedCollectionSelect['any']
```

--------------------------------------------------------------------------------

---[FILE: wrapCustomResolver.ts]---
Location: payload-main/packages/graphql/src/utilities/wrapCustomResolver.ts

```typescript
import type { ObjMap } from 'graphql/jsutils/ObjMap.js'
import type { GraphQLFieldConfig, GraphQLFieldResolver } from 'graphql/type/definition.js'
import type { PayloadRequest } from 'payload'

import { isolateObjectProperty } from 'payload'

type PayloadContext = { req: PayloadRequest }

function wrapCustomResolver<TSource, TArgs, TResult>(
  resolver: GraphQLFieldResolver<TSource, PayloadContext, TArgs, TResult>,
): GraphQLFieldResolver<TSource, PayloadContext, TArgs, TResult> {
  return (source, args, context, info) => {
    return resolver(
      source,
      args,
      { ...context, req: isolateObjectProperty(context.req, 'transactionID') },
      info,
    )
  }
}

export function wrapCustomFields<TSource>(
  fields: ObjMap<GraphQLFieldConfig<TSource, PayloadContext>>,
): ObjMap<GraphQLFieldConfig<TSource, PayloadContext>> {
  for (const key in fields) {
    if (fields[key].resolve) {
      fields[key].resolve = wrapCustomResolver(fields[key].resolve)
    }
  }
  return fields
}
```

--------------------------------------------------------------------------------

---[FILE: .prettierignore]---
Location: payload-main/packages/kv-redis/.prettierignore

```text
.tmp
**/.git
**/.hg
**/.pnp.*
**/.svn
**/.yarn/**
**/build
**/dist/**
**/node_modules
**/temp
```

--------------------------------------------------------------------------------

---[FILE: .swcrc]---
Location: payload-main/packages/kv-redis/.swcrc

```text
{
  "$schema": "https://json.schemastore.org/swcrc",
  "sourceMaps": true,
  "jsc": {
    "target": "esnext",
    "parser": {
      "syntax": "typescript",
      "tsx": true,
      "dts": true
    }
  },
  "module": {
    "type": "es6"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: eslint.config.js]---
Location: payload-main/packages/kv-redis/eslint.config.js

```javascript
import { rootEslintConfig, rootParserOptions } from '../../eslint.config.js'

/** @typedef {import('eslint').Linter.Config} Config */

/** @type {Config[]} */
export const index = [
  ...rootEslintConfig,
  {
    languageOptions: {
      parserOptions: {
        ...rootParserOptions,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]

export default index
```

--------------------------------------------------------------------------------

---[FILE: LICENSE.md]---
Location: payload-main/packages/kv-redis/LICENSE.md

```text
MIT License

Copyright (c) 2018-2024 Payload CMS, Inc. <info@payloadcms.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: payload-main/packages/kv-redis/package.json

```json
{
  "name": "@payloadcms/kv-redis",
  "version": "3.68.5",
  "description": "Redis KV adapter for Payload",
  "homepage": "https://payloadcms.com",
  "repository": {
    "type": "git",
    "url": "https://github.com/payloadcms/payload.git",
    "directory": "packages/kv-redis"
  },
  "license": "MIT",
  "author": "Payload <dev@payloadcms.com> (https://payloadcms.com)",
  "maintainers": [
    {
      "name": "Payload",
      "email": "info@payloadcms.com",
      "url": "https://payloadcms.com"
    }
  ],
  "type": "module",
  "exports": {
    ".": {
      "import": "./src/index.ts",
      "types": "./src/index.ts",
      "default": "./src/index.ts"
    }
  },
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "pnpm build:types && pnpm build:swc",
    "build:clean": "find . \\( -type d \\( -name build -o -name dist -o -name .cache \\) -o -type f -name tsconfig.tsbuildinfo \\) -exec rm -rf {} + && pnpm build",
    "build:debug": "pnpm build",
    "build:swc": "swc ./src -d ./dist --config-file .swcrc --strip-leading-paths",
    "build:types": "tsc --emitDeclarationOnly --outDir dist",
    "clean": "rimraf {dist,*.tsbuildinfo}",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  },
  "dependencies": {
    "ioredis": "^5.4.1"
  },
  "devDependencies": {
    "payload": "workspace:*"
  },
  "peerDependencies": {
    "payload": "workspace:*"
  },
  "engines": {
    "node": "^18.20.2 || >=20.9.0"
  },
  "publishConfig": {
    "exports": {
      ".": {
        "import": "./dist/index.js",
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      }
    },
    "main": "./dist/index.js",
    "types": "./dist/index.d.ts"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: payload-main/packages/kv-redis/README.md

```text
# Redis KV Adapter for Payload (beta)

This package provides a way to use [Redis](https://redis.io) as a KV adapter with Payload.

## Installation

```sh
pnpm add @payloadcms/kv-redis
```

## Usage

```ts
import { redisKVAdapter } from '@payloadcms/kv-redis'

export default buildConfig({
  collections: [Media],
  kv: redisKVAdapter({
    // Redis connection URL. Defaults to process.env.REDIS_URL
    redisURL: 'redis://localhost:6379',
    // Optional prefix for Redis keys to isolate the store. Defaults to 'payload-kv'
    keyPrefix: 'kv-storage',
  }),
})
```

Then you can access the KV storage using `payload.kv`:

```ts
await payload.kv.set('key', { value: 1 })
const data = await payload.kv.get('key')
payload.logger.info(data)
```
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/packages/kv-redis/tsconfig.json

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "composite": true, // Make sure typescript knows that this module depends on their references
    "noEmit": false /* Do not emit outputs. */,
    "emitDeclarationOnly": true,
    "outDir": "./dist" /* Specify an output folder for all emitted files. */,
    "rootDir": "./src" /* Specify the root folder within your source files. */,
    "strict": true
  },
  "exclude": ["dist", "node_modules"],
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.d.ts", "src/**/*.json"],
  "references": [{ "path": "../payload" }]
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/kv-redis/src/index.ts

```typescript
import type { KVAdapter, KVAdapterResult, KVStoreValue } from 'payload'

import { Redis } from 'ioredis'

export class RedisKVAdapter implements KVAdapter {
  redisClient: Redis

  constructor(
    readonly keyPrefix: string,
    redisURL: string,
  ) {
    this.redisClient = new Redis(redisURL)
  }

  async clear(): Promise<void> {
    const keys = await this.redisClient.keys(`${this.keyPrefix}*`)

    if (keys.length > 0) {
      await this.redisClient.del(keys)
    }
  }

  async delete(key: string): Promise<void> {
    await this.redisClient.del(`${this.keyPrefix}${key}`)
  }

  async get<T extends KVStoreValue>(key: string): Promise<null | T> {
    const data = await this.redisClient.get(`${this.keyPrefix}${key}`)

    if (data === null) {
      return null
    }

    return JSON.parse(data)
  }

  async has(key: string): Promise<boolean> {
    const exists = await this.redisClient.exists(`${this.keyPrefix}${key}`)
    return exists === 1
  }

  async keys(): Promise<string[]> {
    const prefixedKeys = await this.redisClient.keys(`${this.keyPrefix}*`)

    if (this.keyPrefix) {
      return prefixedKeys.map((key) => key.replace(this.keyPrefix, ''))
    }

    return prefixedKeys
  }

  async set(key: string, data: KVStoreValue): Promise<void> {
    await this.redisClient.set(`${this.keyPrefix}${key}`, JSON.stringify(data))
  }
}

export type RedisKVAdapterOptions = {
  /**
   * Optional prefix for Redis keys to isolate the store
   *
   * @default 'payload-kv:'
   */
  keyPrefix?: string
  /** Redis connection URL (e.g., 'redis://localhost:6379'). Defaults to process.env.REDIS_URL */
  redisURL?: string
}

export const redisKVAdapter = (options: RedisKVAdapterOptions = {}): KVAdapterResult => {
  const keyPrefix = options.keyPrefix ?? 'payload-kv:'
  const redisURL = options.redisURL ?? process.env.REDIS_URL

  if (!redisURL) {
    throw new Error('redisURL or REDIS_URL env variable is required')
  }

  return {
    init: () => new RedisKVAdapter(keyPrefix, redisURL),
  }
}
```

--------------------------------------------------------------------------------

---[FILE: .prettierignore]---
Location: payload-main/packages/live-preview/.prettierignore

```text
.tmp
**/.git
**/.hg
**/.pnp.*
**/.svn
**/.yarn/**
**/build
**/dist/**
**/node_modules
**/temp
```

--------------------------------------------------------------------------------

---[FILE: .swcrc]---
Location: payload-main/packages/live-preview/.swcrc

```text
{
  "$schema": "https://json.schemastore.org/swcrc",
  "sourceMaps": true,
  "jsc": {
    "target": "esnext",
    "parser": {
      "syntax": "typescript",
      "tsx": true,
      "dts": true
    },
    "transform": {
      "react": {
        "runtime": "automatic",
        "pragmaFrag": "React.Fragment",
        "throwIfNamespace": true,
        "development": false,
        "useBuiltins": true
      }
    }
  },
  "module": {
    "type": "es6"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: LICENSE.md]---
Location: payload-main/packages/live-preview/LICENSE.md

```text
MIT License

Copyright (c) 2018-2025 Payload CMS, Inc. <info@payloadcms.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: payload-main/packages/live-preview/package.json

```json
{
  "name": "@payloadcms/live-preview",
  "version": "3.68.5",
  "description": "The official live preview JavaScript SDK for Payload",
  "homepage": "https://payloadcms.com",
  "repository": {
    "type": "git",
    "url": "https://github.com/payloadcms/payload.git",
    "directory": "packages/live-preview"
  },
  "license": "MIT",
  "author": "Payload <dev@payloadcms.com> (https://payloadcms.com)",
  "maintainers": [
    {
      "name": "Payload",
      "email": "info@payloadcms.com",
      "url": "https://payloadcms.com"
    }
  ],
  "sideEffects": false,
  "type": "module",
  "exports": {
    ".": {
      "import": "./src/index.ts",
      "types": "./src/index.ts",
      "default": "./src/index.ts"
    }
  },
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "pnpm copyfiles && pnpm build:types && pnpm build:swc",
    "build:debug": "pnpm build",
    "build:swc": "swc ./src -d ./dist --config-file .swcrc --strip-leading-paths",
    "build:types": "tsc --emitDeclarationOnly --outDir dist",
    "clean": "rimraf -g {dist,*.tsbuildinfo}",
    "copyfiles": "copyfiles -u 1 \"src/**/*.{html,css,scss,ttf,woff,woff2,eot,svg,jpg,png,json}\" dist/",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  },
  "devDependencies": {
    "@payloadcms/eslint-config": "workspace:*",
    "payload": "workspace:*"
  },
  "publishConfig": {
    "exports": {
      ".": {
        "import": "./dist/index.js",
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      }
    },
    "main": "./dist/index.js",
    "registry": "https://registry.npmjs.org/",
    "types": "./dist/index.d.ts"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/packages/live-preview/tsconfig.json

```json
{
  "extends": "../../tsconfig.base.json",
  "references": [{ "path": "../payload" }]
}
```

--------------------------------------------------------------------------------

---[FILE: handleMessage.ts]---
Location: payload-main/packages/live-preview/src/handleMessage.ts

```typescript
import type { CollectionPopulationRequestHandler, LivePreviewMessageEvent } from './types.js'

import { isLivePreviewEvent } from './isLivePreviewEvent.js'
import { mergeData } from './mergeData.js'

const _payloadLivePreview: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  previousData: any
} = {
  /**
   * Each time the data is merged, cache the result as a `previousData` variable
   * This will ensure changes compound overtop of each other
   */
  previousData: undefined,
}

// Reset the internal cached merged data. This is useful when navigating
// between routes where a new subscription should not inherit prior data.
export const resetCache = (): void => {
  _payloadLivePreview.previousData = undefined
}

export const handleMessage = async <T extends Record<string, any>>(args: {
  apiRoute?: string
  depth?: number
  event: LivePreviewMessageEvent<T>
  initialData: T
  requestHandler?: CollectionPopulationRequestHandler
  serverURL: string
}): Promise<T> => {
  const { apiRoute, depth, event, initialData, requestHandler, serverURL } = args

  if (isLivePreviewEvent(event, serverURL)) {
    const { collectionSlug, data, globalSlug, locale } = event.data

    // Only attempt to merge when we have a clear target
    // Either a collectionSlug or a globalSlug must be present
    if (!collectionSlug && !globalSlug) {
      return initialData
    }

    const mergedData = await mergeData<T>({
      apiRoute,
      collectionSlug,
      depth,
      globalSlug,
      incomingData: data,
      initialData: _payloadLivePreview?.previousData || initialData,
      locale,
      requestHandler,
      serverURL,
    })

    _payloadLivePreview.previousData = mergedData

    return mergedData
  }

  if (!_payloadLivePreview.previousData) {
    _payloadLivePreview.previousData = initialData
  }

  return _payloadLivePreview.previousData as T
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/live-preview/src/index.ts

```typescript
export { handleMessage } from './handleMessage.js'
export { isDocumentEvent } from './isDocumentEvent.js'
export { isLivePreviewEvent } from './isLivePreviewEvent.js'
export { mergeData } from './mergeData.js'
export { ready } from './ready.js'
export { subscribe } from './subscribe.js'
export type { LivePreviewMessageEvent } from './types.js'
export { unsubscribe } from './unsubscribe.js'
```

--------------------------------------------------------------------------------

---[FILE: isDocumentEvent.ts]---
Location: payload-main/packages/live-preview/src/isDocumentEvent.ts

```typescript
export const isDocumentEvent = (event: MessageEvent, serverURL: string): boolean =>
  event.origin === serverURL &&
  event.data &&
  typeof event.data === 'object' &&
  event.data.type === 'payload-document-event'
```

--------------------------------------------------------------------------------

---[FILE: isLivePreviewEvent.ts]---
Location: payload-main/packages/live-preview/src/isLivePreviewEvent.ts

```typescript
export const isLivePreviewEvent = (event: MessageEvent, serverURL: string): boolean =>
  event.origin === serverURL &&
  event.data &&
  typeof event.data === 'object' &&
  event.data.type === 'payload-live-preview'
```

--------------------------------------------------------------------------------

---[FILE: mergeData.ts]---
Location: payload-main/packages/live-preview/src/mergeData.ts

```typescript
import type { CollectionPopulationRequestHandler } from './types.js'

const defaultRequestHandler: CollectionPopulationRequestHandler = ({
  apiPath,
  data,
  endpoint,
  serverURL,
}) => {
  const url = `${serverURL}${apiPath}/${endpoint}`

  return fetch(url, {
    body: JSON.stringify(data),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Payload-HTTP-Method-Override': 'GET',
    },
    method: 'POST',
  })
}

export const mergeData = async <T extends Record<string, any>>(args: {
  apiRoute?: string
  collectionSlug?: string
  depth?: number
  globalSlug?: string
  incomingData: Partial<T>
  initialData: T
  locale?: string
  requestHandler?: CollectionPopulationRequestHandler
  serverURL: string
}): Promise<T> => {
  const {
    apiRoute,
    collectionSlug,
    depth,
    globalSlug,
    incomingData,
    initialData,
    locale,
    serverURL,
  } = args

  const requestHandler = args.requestHandler || defaultRequestHandler

  const result = await requestHandler({
    apiPath: apiRoute || '/api',
    data: {
      data: incomingData,
      depth,
      // The incoming data already has had its locales flattened
      flattenLocales: false,
      locale,
    },
    endpoint: encodeURI(
      `${globalSlug ? 'globals/' : ''}${collectionSlug ?? globalSlug}${collectionSlug ? `/${initialData.id}` : ''}`,
    ),
    serverURL,
  }).then((res) => res.json())

  return result
}
```

--------------------------------------------------------------------------------

---[FILE: ready.ts]---
Location: payload-main/packages/live-preview/src/ready.ts

```typescript
export const ready = (args: { serverURL: string }): void => {
  const { serverURL } = args

  if (typeof window !== 'undefined') {
    // This subscription may have been from either an iframe or a popup
    // We need to report 'ready' to the parent window, whichever it may be
    // i.e. `window?.opener` for popups, `window?.parent` for iframes
    const windowToPostTo: Window = window?.opener || window?.parent

    windowToPostTo?.postMessage(
      {
        type: 'payload-live-preview',
        ready: true,
      },
      serverURL,
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: subscribe.ts]---
Location: payload-main/packages/live-preview/src/subscribe.ts

```typescript
import type { CollectionPopulationRequestHandler } from './types.js'

import { handleMessage, resetCache } from './handleMessage.js'

export const subscribe = <T extends Record<string, any>>(args: {
  apiRoute?: string
  callback: (data: T) => void
  depth?: number
  initialData: T
  requestHandler?: CollectionPopulationRequestHandler
  serverURL: string
}): ((event: MessageEvent) => Promise<void> | void) => {
  const { apiRoute, callback, depth, initialData, requestHandler, serverURL } = args

  // Ensure previous subscription state does not leak across navigations
  // by clearing the internal cached data before subscribing.
  resetCache()

  const onMessage = async (event: MessageEvent) => {
    const mergedData = await handleMessage<T>({
      apiRoute,
      depth,
      event,
      initialData,
      requestHandler,
      serverURL,
    })

    callback(mergedData)
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('message', onMessage)
  }

  return onMessage
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/live-preview/src/types.ts

```typescript
import type { DocumentEvent } from 'payload'

export type CollectionPopulationRequestHandler = ({
  apiPath,
  data,
  endpoint,
  serverURL,
}: {
  apiPath: string
  data: Record<string, any>
  endpoint: string
  serverURL: string
}) => Promise<Response>

export type LivePreviewArgs = {}

export type LivePreview = void

export type LivePreviewMessageEvent<T> = MessageEvent<{
  collectionSlug?: string
  data: T
  externallyUpdatedRelationship?: DocumentEvent
  globalSlug?: string
  locale?: string
  type: 'payload-live-preview'
}>
```

--------------------------------------------------------------------------------

---[FILE: unsubscribe.ts]---
Location: payload-main/packages/live-preview/src/unsubscribe.ts

```typescript
export const unsubscribe = (callback: (event: MessageEvent) => void) => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('message', callback)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: .prettierignore]---
Location: payload-main/packages/live-preview-react/.prettierignore

```text
.tmp
**/.git
**/.hg
**/.pnp.*
**/.svn
**/.yarn/**
**/build
**/dist/**
**/node_modules
**/temp
```

--------------------------------------------------------------------------------

---[FILE: .swcrc]---
Location: payload-main/packages/live-preview-react/.swcrc

```text
{
  "$schema": "https://json.schemastore.org/swcrc",
  "sourceMaps": true,
  "jsc": {
    "target": "esnext",
    "parser": {
      "syntax": "typescript",
      "tsx": true,
      "dts": true
    },
    "transform": {
      "react": {
        "runtime": "automatic",
        "pragmaFrag": "React.Fragment",
        "throwIfNamespace": true,
        "development": false,
        "useBuiltins": true
      }
    }
  },
  "module": {
    "type": "es6"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: LICENSE.md]---
Location: payload-main/packages/live-preview-react/LICENSE.md

```text
MIT License

Copyright (c) 2018-2025 Payload CMS, Inc. <info@payloadcms.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

--------------------------------------------------------------------------------

````
