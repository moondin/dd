---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 150
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 150 of 695)

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

---[FILE: package.json]---
Location: payload-main/packages/graphql/package.json

```json
{
  "name": "@payloadcms/graphql",
  "version": "3.68.5",
  "homepage": "https://payloadcms.com",
  "repository": {
    "type": "git",
    "url": "https://github.com/payloadcms/payload.git",
    "directory": "packages/graphql"
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
    },
    "./types": {
      "import": "./src/exports/types.ts",
      "types": "./src/exports/types.ts",
      "default": "./src/exports/types.ts"
    },
    "./utilities": {
      "import": "./src/exports/utilities.ts",
      "types": "./src/exports/utilities.ts",
      "default": "./src/exports/utilities.ts"
    }
  },
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "bin": {
    "payload-graphql": "bin.js"
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "pnpm build:types && pnpm build:swc",
    "build:debug": "pnpm build",
    "build:swc": "swc ./src -d ./dist --config-file .swcrc --strip-leading-paths",
    "build:types": "tsc --emitDeclarationOnly --outDir dist",
    "clean": "rimraf -g {dist,*.tsbuildinfo}",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  },
  "dependencies": {
    "graphql-scalars": "1.22.2",
    "pluralize": "8.0.0",
    "ts-essentials": "10.0.3",
    "tsx": "4.20.6"
  },
  "devDependencies": {
    "@payloadcms/eslint-config": "workspace:*",
    "@types/pluralize": "^0.0.33",
    "graphql-http": "^1.22.0",
    "payload": "workspace:*"
  },
  "peerDependencies": {
    "graphql": "^16.8.1",
    "payload": "workspace:*"
  },
  "publishConfig": {
    "exports": {
      ".": {
        "import": "./dist/index.js",
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      },
      "./types": {
        "import": "./dist/exports/types.js",
        "types": "./dist/exports/types.d.ts",
        "default": "./dist/exports/types.js"
      },
      "./utilities": {
        "import": "./dist/exports/utilities.js",
        "types": "./dist/exports/utilities.d.ts",
        "default": "./dist/exports/utilities.js"
      }
    },
    "main": "./dist/index.js",
    "types": "./dist/index.d.ts"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/packages/graphql/tsconfig.json

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    /* TODO: remove the following lines */
    "strict": false,
    "noUncheckedIndexedAccess": false,
    // Do not include DOM and DOM.Iterable as this is a server-only package.
    "lib": ["ES2022"],
  },
  "references": [{ "path": "../payload" }]
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/graphql/src/index.ts

```typescript
import type { OperationArgs } from 'graphql-http'
import type { GraphQLInfo, SanitizedConfig } from 'payload'

import * as GraphQL from 'graphql'

import {
  createComplexityRule,
  fieldExtensionsEstimator,
  simpleEstimator,
} from './packages/graphql-query-complexity/index.js'
import { accessResolver } from './resolvers/auth/access.js'
import { buildFallbackLocaleInputType } from './schema/buildFallbackLocaleInputType.js'
import { buildLocaleInputType } from './schema/buildLocaleInputType.js'
import { buildPoliciesType } from './schema/buildPoliciesType.js'
import { initCollections } from './schema/initCollections.js'
import { initGlobals } from './schema/initGlobals.js'
import { wrapCustomFields } from './utilities/wrapCustomResolver.js'

export function configToSchema(config: SanitizedConfig): {
  schema: GraphQL.GraphQLSchema
  validationRules: (args: OperationArgs<any>) => GraphQL.ValidationRule[]
} {
  const collections = config.collections.reduce((acc, collection) => {
    acc[collection.slug] = {
      config: collection,
    }

    return acc
  }, {})

  const globals = {
    config: config.globals,
  }

  const graphqlResult: GraphQLInfo = {
    collections,
    globals,
    Mutation: {
      name: 'Mutation',
      fields: {},
    },
    Query: {
      name: 'Query',
      fields: {},
    },
    types: {
      arrayTypes: {},
      blockInputTypes: {},
      blockTypes: {},
      groupTypes: {},
      tabTypes: {},
    },
  }

  if (config.localization) {
    graphqlResult.types['localeInputType'] = buildLocaleInputType(config.localization)
    graphqlResult.types['fallbackLocaleInputType'] = buildFallbackLocaleInputType(
      config.localization,
    )
  }

  initCollections({ config, graphqlResult })
  initGlobals({ config, graphqlResult })

  graphqlResult.Query.fields['Access'] = {
    type: buildPoliciesType(config),
    resolve: accessResolver(config),
  }

  if (typeof config.graphQL.queries === 'function') {
    const customQueries = config.graphQL.queries(GraphQL, {
      ...graphqlResult,
      config,
    })
    graphqlResult.Query = {
      ...graphqlResult.Query,
      fields: {
        ...graphqlResult.Query.fields,
        ...wrapCustomFields((customQueries || {}) as never),
      },
    }
  }

  if (typeof config.graphQL.mutations === 'function') {
    const customMutations = config.graphQL.mutations(GraphQL, {
      ...graphqlResult,
      config,
    })
    graphqlResult.Mutation = {
      ...graphqlResult.Mutation,
      fields: {
        ...graphqlResult.Mutation.fields,
        ...wrapCustomFields((customMutations || {}) as never),
      },
    }
  }

  const query = new GraphQL.GraphQLObjectType(graphqlResult.Query)
  const mutation = new GraphQL.GraphQLObjectType(graphqlResult.Mutation)

  const schema = new GraphQL.GraphQLSchema({
    mutation,
    query,
  })

  const validationRules = (args): GraphQL.ValidationRule[] => [
    createComplexityRule({
      estimators: [
        fieldExtensionsEstimator(),
        simpleEstimator({ defaultComplexity: 1 }), // Fallback if complexity not set
      ],
      maximumComplexity: config.graphQL.maxComplexity,
      variables: args.variableValues,
      // onComplete: (complexity) => { console.log('Query Complexity:', complexity); },
    }),
    ...(config.graphQL.disableIntrospectionInProduction ? [NoProductionIntrospection] : []),
    ...(typeof config?.graphQL?.validationRules === 'function'
      ? config.graphQL.validationRules(args)
      : []),
  ]

  return {
    schema,
    validationRules,
  }
}

const NoProductionIntrospection: GraphQL.ValidationRule = (context) => ({
  Field(node) {
    if (process.env.NODE_ENV === 'production') {
      if (node.name.value === '__schema' || node.name.value === '__type') {
        context.reportError(
          new GraphQL.GraphQLError(
            'GraphQL introspection is not allowed, but the query contained __schema or __type',
            { nodes: [node] },
          ),
        )
      }
    }
  },
})
```

--------------------------------------------------------------------------------

---[FILE: generateSchema.ts]---
Location: payload-main/packages/graphql/src/bin/generateSchema.ts

```typescript
import type { SanitizedConfig } from 'payload'

import fs from 'fs'
import { printSchema } from 'graphql'

import { configToSchema } from '../index.js'
export function generateSchema(config: SanitizedConfig): void {
  const outputFile = process.env.PAYLOAD_GRAPHQL_SCHEMA_PATH || config.graphQL.schemaOutputFile

  const { schema } = configToSchema(config)

  fs.writeFileSync(outputFile, printSchema(schema))
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/graphql/src/bin/index.ts

```typescript
/* eslint-disable no-console */
import minimist from 'minimist'
import { pathToFileURL } from 'node:url'
import { findConfig, loadEnv } from 'payload/node'

import { generateSchema } from './generateSchema.js'

export const bin = async () => {
  loadEnv()
  const configPath = findConfig()
  const config = await (await import(pathToFileURL(configPath).toString())).default

  const args = minimist(process.argv.slice(2))
  const script = (typeof args._[0] === 'string' ? args._[0] : '').toLowerCase()

  if (script === 'generate:schema') {
    return generateSchema(config)
  }

  console.log(`Unknown script: "${script}".`)
  process.exit(1)
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/graphql/src/exports/types.ts

```typescript
export { GraphQLJSON, GraphQLJSONObject } from '../packages/graphql-type-json/index.js'
export { buildPaginatedListType } from '../schema/buildPaginatedListType.js'
export * as GraphQL from 'graphql'
```

--------------------------------------------------------------------------------

---[FILE: utilities.ts]---
Location: payload-main/packages/graphql/src/exports/utilities.ts

```typescript
export { generateSchema } from '../bin/generateSchema.js'
export { buildObjectType } from '../schema/buildObjectType.js'
```

--------------------------------------------------------------------------------

---[FILE: createComplexityRule.ts]---
Location: payload-main/packages/graphql/src/packages/graphql-query-complexity/createComplexityRule.ts

```typescript
import type { ValidationContext } from 'graphql'

import type { QueryComplexityOptions } from './QueryComplexity.js'

import { QueryComplexity } from './QueryComplexity.js'

export function createComplexityRule(
  options: QueryComplexityOptions,
): (context: ValidationContext) => QueryComplexity {
  return (context: ValidationContext): QueryComplexity => {
    return new QueryComplexity(context, options)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/graphql/src/packages/graphql-query-complexity/index.ts

```typescript
export { createComplexityRule } from './createComplexityRule.js'
export { fieldExtensionsEstimator } from './estimators/fieldExtensions/index.js'
export { simpleEstimator } from './estimators/simple/index.js'
```

--------------------------------------------------------------------------------

---[FILE: LICENSE]---
Location: payload-main/packages/graphql/src/packages/graphql-query-complexity/LICENSE

```text
MIT License

Copyright (c) 2017 Ivo Meißner

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

[Package Link](https://github.com/slicknode/graphql-query-complexity)
```

--------------------------------------------------------------------------------

---[FILE: QueryComplexity.ts]---
Location: payload-main/packages/graphql/src/packages/graphql-query-complexity/QueryComplexity.ts

```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
/**
 * Created by Ivo Meißner on 28.07.17.
 */

import type {
  DocumentNode,
  FieldNode,
  FragmentDefinitionNode,
  FragmentSpreadNode,
  GraphQLCompositeType,
  GraphQLDirective,
  GraphQLField,
  GraphQLFieldMap,
  GraphQLNamedType,
  GraphQLSchema,
  GraphQLUnionType,
  InlineFragmentNode,
  OperationDefinitionNode,
} from 'graphql'

import {
  getNamedType,
  GraphQLError,
  GraphQLInterfaceType,
  GraphQLObjectType,
  isAbstractType,
  isCompositeType,
  Kind,
  TypeInfo,
  ValidationContext,
  visit,
  visitWithTypeInfo,
} from 'graphql'
import {
  getArgumentValues,
  getDirectiveValues,
  getVariableValues,
} from 'graphql/execution/values.js'

export type ComplexityEstimatorArgs = {
  args: { [key: string]: any }
  childComplexity: number
  context?: Record<string, any>
  field: GraphQLField<any, any>
  node: FieldNode
  type: GraphQLCompositeType
}

export type ComplexityEstimator = (options: ComplexityEstimatorArgs) => number | void

// Complexity can be anything that is supported by the configured estimators
export type Complexity = any

// Map of complexities for possible types (of Union, Interface types)
type ComplexityMap = {
  [typeName: string]: number
}

export interface QueryComplexityOptions {
  // Pass request context to the estimators via estimationContext
  context?: Record<string, any>

  // The query variables. This is needed because the variables are not available
  // Optional function to create a custom error
  createError?: (max: number, actual: number) => GraphQLError

  // An array of complexity estimators to use for estimating the complexity
  estimators: Array<ComplexityEstimator>

  // Optional callback function to retrieve the determined query complexity
  // Will be invoked whether the query is rejected or not
  // The maximum allowed query complexity, queries above this threshold will be rejected
  maximumComplexity: number

  // This can be used for logging or to implement rate limiting
  onComplete?: (complexity: number) => void

  // specify operation name only when pass multi-operation documents
  operationName?: string

  // in the visitor of the graphql-js library
  variables?: Record<string, any>
}

function queryComplexityMessage(max: number, actual: number): string {
  return `The query exceeds the maximum complexity of ${max}. ` + `Actual complexity is ${actual}`
}

export function getComplexity(options: {
  context?: Record<string, any>
  estimators: ComplexityEstimator[]
  operationName?: string
  query: DocumentNode
  schema: GraphQLSchema
  variables?: Record<string, any>
}): number {
  const typeInfo = new TypeInfo(options.schema)

  const errors: GraphQLError[] = []
  const context = new ValidationContext(options.schema, options.query, typeInfo, (error) =>
    errors.push(error),
  )
  const visitor = new QueryComplexity(context, {
    // Maximum complexity does not matter since we're only interested in the calculated complexity.
    context: options.context,
    estimators: options.estimators,
    maximumComplexity: Infinity,
    operationName: options.operationName,
    variables: options.variables,
  })

  visit(options.query, visitWithTypeInfo(typeInfo, visitor))

  // Throw first error if any
  if (errors.length) {
    throw errors.pop()
  }

  return visitor.complexity
}

export class QueryComplexity {
  complexity: number
  context: ValidationContext
  estimators: Array<ComplexityEstimator>
  includeDirectiveDef: GraphQLDirective
  OperationDefinition: Record<string, any>
  options: QueryComplexityOptions
  requestContext?: Record<string, any>
  skipDirectiveDef: GraphQLDirective
  variableValues: Record<string, any>

  constructor(context: ValidationContext, options: QueryComplexityOptions) {
    if (!(typeof options.maximumComplexity === 'number' && options.maximumComplexity > 0)) {
      throw new Error('Maximum query complexity must be a positive number')
    }

    this.context = context
    this.complexity = 0
    this.options = options

    this.includeDirectiveDef = this.context.getSchema().getDirective('include')
    this.skipDirectiveDef = this.context.getSchema().getDirective('skip')
    this.estimators = options.estimators
    this.variableValues = {}
    this.requestContext = options.context

    this.OperationDefinition = {
      enter: this.onOperationDefinitionEnter,
      leave: this.onOperationDefinitionLeave,
    }
  }

  createError(): GraphQLError {
    if (typeof this.options.createError === 'function') {
      return this.options.createError(this.options.maximumComplexity, this.complexity)
    }
    return new GraphQLError(queryComplexityMessage(this.options.maximumComplexity, this.complexity))
  }

  nodeComplexity(
    node: FieldNode | FragmentDefinitionNode | InlineFragmentNode | OperationDefinitionNode,
    typeDef: GraphQLInterfaceType | GraphQLObjectType | GraphQLUnionType,
  ): number {
    if (node.selectionSet) {
      let fields: GraphQLFieldMap<any, any> = {}
      if (typeDef instanceof GraphQLObjectType || typeDef instanceof GraphQLInterfaceType) {
        fields = typeDef.getFields()
      }

      // Determine all possible types of the current node
      let possibleTypeNames: string[]
      if (isAbstractType(typeDef)) {
        possibleTypeNames = this.context
          .getSchema()
          .getPossibleTypes(typeDef)
          .map((t) => t.name)
      } else {
        possibleTypeNames = [typeDef.name]
      }

      // Collect complexities for all possible types individually
      const selectionSetComplexities: ComplexityMap = node.selectionSet.selections.reduce(
        (
          complexities: ComplexityMap,
          childNode: FieldNode | FragmentSpreadNode | InlineFragmentNode,
        ): ComplexityMap => {
          // let nodeComplexity = 0;
          let innerComplexities = complexities

          let includeNode = true
          let skipNode = false

          for (const directive of childNode.directives ?? []) {
            const directiveName = directive.name.value
            switch (directiveName) {
              case 'include': {
                const values = getDirectiveValues(
                  this.includeDirectiveDef,
                  childNode,
                  this.variableValues || {},
                )
                if (typeof values.if === 'boolean') {
                  includeNode = values.if
                }
                break
              }
              case 'skip': {
                const values = getDirectiveValues(
                  this.skipDirectiveDef,
                  childNode,
                  this.variableValues || {},
                )
                if (typeof values.if === 'boolean') {
                  skipNode = values.if
                }
                break
              }
            }
          }

          if (!includeNode || skipNode) {
            return complexities
          }

          switch (childNode.kind) {
            case Kind.FIELD: {
              const field = fields[childNode.name.value]
              // Invalid field, should be caught by other validation rules
              if (!field) {
                break
              }
              const fieldType = getNamedType(field.type)

              // Get arguments
              let args: { [key: string]: any }
              try {
                args = getArgumentValues(field, childNode, this.variableValues || {})
              } catch (e) {
                this.context.reportError(e)
                return complexities
              }

              // Check if we have child complexity
              let childComplexity = 0
              if (isCompositeType(fieldType)) {
                childComplexity = this.nodeComplexity(childNode, fieldType)
              }

              // Run estimators one after another and return first valid complexity
              // score
              const estimatorArgs: ComplexityEstimatorArgs = {
                type: typeDef,
                args,
                childComplexity,
                context: this.requestContext,
                field,
                node: childNode,
              }
              const validScore = this.estimators.find((estimator) => {
                const tmpComplexity = estimator(estimatorArgs)

                if (typeof tmpComplexity === 'number' && !isNaN(tmpComplexity)) {
                  innerComplexities = addComplexities(
                    tmpComplexity,
                    complexities,
                    possibleTypeNames,
                  )
                  return true
                }

                return false
              })
              if (!validScore) {
                this.context.reportError(
                  new GraphQLError(
                    `No complexity could be calculated for field ${typeDef.name}.${field.name}. ` +
                      'At least one complexity estimator has to return a complexity score.',
                  ),
                )
                return complexities
              }
              break
            }
            case Kind.FRAGMENT_SPREAD: {
              const fragment = this.context.getFragment(childNode.name.value)
              // Unknown fragment, should be caught by other validation rules
              if (!fragment) {
                break
              }
              const fragmentType = this.context
                .getSchema()
                .getType(fragment.typeCondition.name.value)
              // Invalid fragment type, ignore. Should be caught by other validation rules
              if (!isCompositeType(fragmentType)) {
                break
              }
              const nodeComplexity = this.nodeComplexity(fragment, fragmentType)
              if (isAbstractType(fragmentType)) {
                // Add fragment complexity for all possible types
                innerComplexities = addComplexities(
                  nodeComplexity,
                  complexities,
                  this.context
                    .getSchema()
                    .getPossibleTypes(fragmentType)
                    .map((t) => t.name),
                )
              } else {
                // Add complexity for object type
                innerComplexities = addComplexities(nodeComplexity, complexities, [
                  fragmentType.name,
                ])
              }
              break
            }
            case Kind.INLINE_FRAGMENT: {
              let inlineFragmentType: GraphQLNamedType = typeDef
              if (childNode.typeCondition && childNode.typeCondition.name) {
                inlineFragmentType = this.context
                  .getSchema()
                  .getType(childNode.typeCondition.name.value)
                if (!isCompositeType(inlineFragmentType)) {
                  break
                }
              }

              const nodeComplexity = this.nodeComplexity(childNode, inlineFragmentType)
              if (isAbstractType(inlineFragmentType)) {
                // Add fragment complexity for all possible types
                innerComplexities = addComplexities(
                  nodeComplexity,
                  complexities,
                  this.context
                    .getSchema()
                    .getPossibleTypes(inlineFragmentType)
                    .map((t) => t.name),
                )
              } else {
                // Add complexity for object type
                innerComplexities = addComplexities(nodeComplexity, complexities, [
                  inlineFragmentType.name,
                ])
              }
              break
            }
            default: {
              innerComplexities = addComplexities(
                this.nodeComplexity(childNode, typeDef),
                complexities,
                possibleTypeNames,
              )
              break
            }
          }

          return innerComplexities
        },
        {},
      )
      // Only return max complexity of all possible types
      if (!selectionSetComplexities) {
        return NaN
      }
      return Math.max(...Object.values(selectionSetComplexities), 0)
    }
    return 0
  }

  onOperationDefinitionEnter(operation: OperationDefinitionNode): void {
    if (
      typeof this.options.operationName === 'string' &&
      this.options.operationName !== operation.name.value
    ) {
      return
    }

    // Get variable values from variables that are passed from options, merged
    // with default values defined in the operation
    const { coerced, errors } = getVariableValues(
      this.context.getSchema(),
      // We have to create a new array here because input argument is not readonly in graphql ~14.6.0
      operation.variableDefinitions ? [...operation.variableDefinitions] : [],
      this.options.variables ?? {},
    )
    if (errors && errors.length) {
      // We have input validation errors, report errors and abort
      errors.forEach((error) => this.context.reportError(error))
      return
    }
    this.variableValues = coerced

    switch (operation.operation) {
      case 'mutation':
        this.complexity += this.nodeComplexity(
          operation,
          this.context.getSchema().getMutationType(),
        )
        break
      case 'query':
        this.complexity += this.nodeComplexity(operation, this.context.getSchema().getQueryType())
        break
      case 'subscription':
        this.complexity += this.nodeComplexity(
          operation,
          this.context.getSchema().getSubscriptionType(),
        )
        break
      default:
        throw new Error(
          `Query complexity could not be calculated for operation of type ${operation.operation}`,
        )
    }
  }

  onOperationDefinitionLeave(operation: OperationDefinitionNode): GraphQLError | void {
    if (
      typeof this.options.operationName === 'string' &&
      this.options.operationName !== operation.name.value
    ) {
      return
    }

    if (this.options.onComplete) {
      this.options.onComplete(this.complexity)
    }

    if (this.complexity > this.options.maximumComplexity) {
      return this.context.reportError(this.createError())
    }
  }
}

/**
 * Adds a complexity to the complexity map for all possible types
 * @param complexity
 * @param complexityMap
 * @param possibleTypes
 */
function addComplexities(
  complexity: number,
  complexityMap: ComplexityMap,
  possibleTypes: string[],
): ComplexityMap {
  for (const type of possibleTypes) {
    if (Object.prototype.hasOwnProperty.call(complexityMap, type)) {
      complexityMap[type] += complexity
    } else {
      complexityMap[type] = complexity
    }
  }
  return complexityMap
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/graphql/src/packages/graphql-query-complexity/estimators/fieldExtensions/index.ts

```typescript
import type { ComplexityEstimator, ComplexityEstimatorArgs } from '../../QueryComplexity.js'

export const fieldExtensionsEstimator = (): ComplexityEstimator => {
  return (args: ComplexityEstimatorArgs): number | void => {
    if (args.field.extensions) {
      // Calculate complexity score
      if (typeof args.field.extensions.complexity === 'number') {
        return args.childComplexity + args.field.extensions.complexity
      } else if (typeof args.field.extensions.complexity === 'function') {
        return args.field.extensions.complexity(args)
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/graphql/src/packages/graphql-query-complexity/estimators/simple/index.ts

```typescript
import type { ComplexityEstimator, ComplexityEstimatorArgs } from '../../QueryComplexity.js'

export const simpleEstimator = (options?: { defaultComplexity?: number }): ComplexityEstimator => {
  const defaultComplexity =
    options && typeof options.defaultComplexity === 'number' ? options.defaultComplexity : 1
  return (args: ComplexityEstimatorArgs): number | void => {
    return defaultComplexity + args.childComplexity
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/graphql/src/packages/graphql-type-json/index.ts

```typescript
import { GraphQLScalarType } from 'graphql'
import { Kind, print } from 'graphql/language/index.js'

function identity(value) {
  return value
}

function ensureObject(value) {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new TypeError(`JSONObject cannot represent non-object value: ${value}`)
  }

  return value
}

function parseObject(typeName, ast, variables) {
  const value = Object.create(null)
  ast.fields.forEach((field) => {
    value[field.name.value] = parseLiteral(typeName, field.value, variables)
  })

  return value
}

function parseLiteral(typeName, ast, variables) {
  switch (ast.kind) {
    case Kind.BOOLEAN:
    case Kind.STRING:
      return ast.value
    case Kind.FLOAT:
    case Kind.INT:
      return parseFloat(ast.value)
    case Kind.LIST:
      return ast.values.map((n) => parseLiteral(typeName, n, variables))
    case Kind.NULL:
      return null
    case Kind.OBJECT:
      return parseObject(typeName, ast, variables)
    case Kind.VARIABLE:
      return variables ? variables[ast.name.value] : undefined
    default:
      throw new TypeError(`${typeName} cannot represent value: ${print(ast)}`)
  }
}

// This named export is intended for users of CommonJS. Users of ES modules
//  should instead use the default export.
export const GraphQLJSON = new GraphQLScalarType({
  name: 'JSON',
  description:
    'The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).',
  parseLiteral: (ast, variables) => parseLiteral('JSON', ast, variables),
  parseValue: identity,
  serialize: identity,
  specifiedByURL: 'http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf',
})

export const GraphQLJSONObject = new GraphQLScalarType({
  name: 'JSONObject',
  description:
    'The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).',
  parseLiteral: (ast, variables) => {
    if (ast.kind !== Kind.OBJECT) {
      throw new TypeError(`JSONObject cannot represent non-object value: ${print(ast)}`)
    }

    return parseObject('JSONObject', ast, variables)
  },
  parseValue: ensureObject,
  serialize: ensureObject,
  specifiedByURL: 'http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf',
})
```

--------------------------------------------------------------------------------

---[FILE: LICENSE]---
Location: payload-main/packages/graphql/src/packages/graphql-type-json/LICENSE

```text
The MIT License (MIT)

Copyright (c) 2016 Jimmy Jia

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

[Package Link](https://github.com/taion/graphql-type-json/tree/master)
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/graphql/src/resolvers/types.ts

```typescript
import type { PayloadRequest, SelectType } from 'payload'

export type Context = {
  headers: {
    [key: string]: string
  }
  req: PayloadRequest
  select: SelectType
}
```

--------------------------------------------------------------------------------

---[FILE: access.ts]---
Location: payload-main/packages/graphql/src/resolvers/auth/access.ts

```typescript
import type { SanitizedConfig } from 'payload'

import { accessOperation, isolateObjectProperty } from 'payload'

import type { Context } from '../types.js'

import { formatName } from '../../utilities/formatName.js'
const formatConfigNames = (results, configs) => {
  const formattedResults = { ...results }

  configs.forEach(({ slug }) => {
    const result = { ...(formattedResults[slug] || {}) }
    delete formattedResults[slug]
    formattedResults[formatName(slug)] = result
  })

  return formattedResults
}

export function accessResolver(config: SanitizedConfig) {
  async function resolver(_, args, context: Context) {
    const options = {
      req: isolateObjectProperty<any>(context.req, 'transactionID'),
    }

    const accessResults = await accessOperation(options)

    return {
      ...accessResults,
      ...formatConfigNames(accessResults.collections, config.collections),
      ...formatConfigNames(accessResults.globals, config.globals),
    }
  }

  return resolver
}
```

--------------------------------------------------------------------------------

---[FILE: forgotPassword.ts]---
Location: payload-main/packages/graphql/src/resolvers/auth/forgotPassword.ts

```typescript
import type { Collection } from 'payload'

import { forgotPasswordOperation, isolateObjectProperty } from 'payload'

import type { Context } from '../types.js'

export function forgotPassword(collection: Collection): any {
  async function resolver(_, args, context: Context) {
    const options = {
      collection,
      data: {
        email: args.email,
        username: args.username,
      },
      disableEmail: args.disableEmail,
      expiration: args.expiration,
      req: isolateObjectProperty(context.req, 'transactionID'),
    }

    await forgotPasswordOperation(options)
    return true
  }

  return resolver
}
```

--------------------------------------------------------------------------------

---[FILE: init.ts]---
Location: payload-main/packages/graphql/src/resolvers/auth/init.ts

```typescript
import { initOperation, isolateObjectProperty } from 'payload'

import type { Context } from '../types.js'

export function init(collection: string) {
  async function resolver(_, args, context: Context) {
    const options = {
      collection,
      req: isolateObjectProperty(context.req, 'transactionID'),
    }

    return initOperation(options)
  }

  return resolver
}
```

--------------------------------------------------------------------------------

---[FILE: login.ts]---
Location: payload-main/packages/graphql/src/resolvers/auth/login.ts

```typescript
import type { Collection } from 'payload'

import { generatePayloadCookie, isolateObjectProperty, loginOperation } from 'payload'

import type { Context } from '../types.js'

export function login(collection: Collection): any {
  async function resolver(_, args, context: Context) {
    const options = {
      collection,
      data: {
        email: args.email,
        password: args.password,
        username: args.username,
      },
      depth: 0,
      req: isolateObjectProperty(context.req, 'transactionID'),
    }

    const result = await loginOperation(options)
    const cookie = generatePayloadCookie({
      collectionAuthConfig: collection.config.auth,
      cookiePrefix: context.req.payload.config.cookiePrefix,
      token: result.token,
    })

    context.headers['Set-Cookie'] = cookie

    if (collection.config.auth.removeTokenFromResponses) {
      delete result.token
    }

    return result
  }

  return resolver
}
```

--------------------------------------------------------------------------------

---[FILE: logout.ts]---
Location: payload-main/packages/graphql/src/resolvers/auth/logout.ts

```typescript
import type { Collection } from 'payload'

import { generateExpiredPayloadCookie, isolateObjectProperty, logoutOperation } from 'payload'

import type { Context } from '../types.js'

export function logout(collection: Collection): any {
  async function resolver(_, args, context: Context) {
    const options = {
      allSessions: args.allSessions,
      collection,
      req: isolateObjectProperty(context.req, 'transactionID'),
    }

    const result = await logoutOperation(options)
    const expiredCookie = generateExpiredPayloadCookie({
      collectionAuthConfig: collection.config.auth,
      config: context.req.payload.config,
      cookiePrefix: context.req.payload.config.cookiePrefix,
    })
    context.headers['Set-Cookie'] = expiredCookie
    return result
  }

  return resolver
}
```

--------------------------------------------------------------------------------

---[FILE: me.ts]---
Location: payload-main/packages/graphql/src/resolvers/auth/me.ts

```typescript
import type { Collection } from 'payload'

import { extractJWT, isolateObjectProperty, meOperation } from 'payload'

import type { Context } from '../types.js'

export function me(collection: Collection): any {
  async function resolver(_, args, context: Context) {
    const currentToken = extractJWT(context.req)

    const options = {
      collection,
      currentToken,
      depth: 0,
      req: isolateObjectProperty(context.req, 'transactionID'),
    }

    const result = await meOperation(options)

    if (collection.config.auth.removeTokenFromResponses) {
      delete result.token
    }

    return result
  }

  return resolver
}
```

--------------------------------------------------------------------------------

---[FILE: refresh.ts]---
Location: payload-main/packages/graphql/src/resolvers/auth/refresh.ts

```typescript
import type { Collection } from 'payload'

import { generatePayloadCookie, isolateObjectProperty, refreshOperation } from 'payload'

import type { Context } from '../types.js'

export function refresh(collection: Collection): any {
  async function resolver(_, __, context: Context) {
    const options = {
      collection,
      depth: 0,
      req: isolateObjectProperty(context.req, 'transactionID'),
    }

    const result = await refreshOperation(options)
    const cookie = generatePayloadCookie({
      collectionAuthConfig: collection.config.auth,
      cookiePrefix: context.req.payload.config.cookiePrefix,
      token: result.refreshedToken,
    })
    context.headers['Set-Cookie'] = cookie

    if (collection.config.auth.removeTokenFromResponses) {
      delete result.refreshedToken
    }

    return result
  }

  return resolver
}
```

--------------------------------------------------------------------------------

---[FILE: resetPassword.ts]---
Location: payload-main/packages/graphql/src/resolvers/auth/resetPassword.ts

```typescript
import type { Collection } from 'payload'

import { generatePayloadCookie, isolateObjectProperty, resetPasswordOperation } from 'payload'

import type { Context } from '../types.js'

export function resetPassword(collection: Collection): any {
  async function resolver(_, args, context: Context) {
    if (args.locale) {
      context.req.locale = args.locale
    }
    if (args.fallbackLocale) {
      context.req.fallbackLocale = args.fallbackLocale
    }

    const options = {
      api: 'GraphQL',
      collection,
      data: args,
      depth: 0,
      req: isolateObjectProperty(context.req, 'transactionID'),
    }

    const result = await resetPasswordOperation(options)
    const cookie = generatePayloadCookie({
      collectionAuthConfig: collection.config.auth,
      cookiePrefix: context.req.payload.config.cookiePrefix,
      token: result.token,
    })
    context.headers['Set-Cookie'] = cookie

    if (collection.config.auth.removeTokenFromResponses) {
      delete result.token
    }

    return result
  }

  return resolver
}
```

--------------------------------------------------------------------------------

````
