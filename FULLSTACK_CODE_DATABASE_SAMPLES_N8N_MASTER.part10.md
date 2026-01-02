---
source_txt: fullstack_samples/n8n-master
converted_utc: 2025-12-18T10:47:15Z
part: 10
parts_total: 51
---

# FULLSTACK CODE DATABASE SAMPLES n8n-master

## Extracted Reusable Patterns (Non-verbatim) (Part 10 of 51)

````text
================================================================================
FULLSTACK SAMPLES PATTERN DATABASE - n8n-master
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/n8n-master
================================================================================

NOTES:
- This file intentionally avoids copying large verbatim third-party code.
- It captures reusable patterns, surfaces, and file references.
- Use the referenced file paths to view full implementations locally.

================================================================================

---[FILE: node-usable-as-tool.test.ts]---
Location: n8n-master/packages/@n8n/eslint-plugin-community-nodes/src/rules/node-usable-as-tool.test.ts
Signals: N/A
Excerpt (<=80 chars):  export class TestNode implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestNode
- RegularClass
```

--------------------------------------------------------------------------------

---[FILE: node-usable-as-tool.ts]---
Location: n8n-master/packages/@n8n/eslint-plugin-community-nodes/src/rules/node-usable-as-tool.ts
Signals: N/A
Excerpt (<=80 chars):  export const NodeUsableAsToolRule = createRule({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NodeUsableAsToolRule
```

--------------------------------------------------------------------------------

---[FILE: package-name-convention.ts]---
Location: n8n-master/packages/@n8n/eslint-plugin-community-nodes/src/rules/package-name-convention.ts
Signals: N/A
Excerpt (<=80 chars):  export const PackageNameConventionRule = createRule({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PackageNameConventionRule
```

--------------------------------------------------------------------------------

---[FILE: resource-operation-pattern.test.ts]---
Location: n8n-master/packages/@n8n/eslint-plugin-community-nodes/src/rules/resource-operation-pattern.test.ts
Signals: N/A
Excerpt (<=80 chars):  export class TestNode implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestNode
- NotANode
```

--------------------------------------------------------------------------------

---[FILE: resource-operation-pattern.ts]---
Location: n8n-master/packages/@n8n/eslint-plugin-community-nodes/src/rules/resource-operation-pattern.ts
Signals: N/A
Excerpt (<=80 chars):  export const ResourceOperationPatternRule = createRule({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ResourceOperationPatternRule
```

--------------------------------------------------------------------------------

---[FILE: ast-utils.ts]---
Location: n8n-master/packages/@n8n/eslint-plugin-community-nodes/src/utils/ast-utils.ts
Signals: N/A
Excerpt (<=80 chars):  export function isNodeTypeClass(node: TSESTree.ClassDeclaration): boolean {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isNodeTypeClass
- isCredentialTypeClass
- findClassProperty
- findObjectProperty
- getLiteralValue
- getStringLiteralValue
- getModulePath
- getBooleanLiteralValue
- findArrayLiteralProperty
- hasArrayLiteralValue
- getTopLevelObjectInJson
- isFileType
- isDirectRequireCall
- isRequireMemberCall
- extractCredentialInfoFromArray
- extractCredentialNameFromArray
- findSimilarStrings
```

--------------------------------------------------------------------------------

---[FILE: file-utils.ts]---
Location: n8n-master/packages/@n8n/eslint-plugin-community-nodes/src/utils/file-utils.ts
Signals: N/A
Excerpt (<=80 chars): export function isContainedWithin(parentPath: string, childPath: string): boo...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isContainedWithin
- safeJoinPath
- findPackageJson
- readPackageJsonCredentials
- extractCredentialNameFromFile
- validateIconPath
- readPackageJsonNodes
- areAllCredentialUsagesTestedByNodes
- findSimilarSvgFiles
```

--------------------------------------------------------------------------------

---[FILE: rule-creator.ts]---
Location: n8n-master/packages/@n8n/eslint-plugin-community-nodes/src/utils/rule-creator.ts
Signals: N/A
Excerpt (<=80 chars):  export const createRule = ESLintUtils.RuleCreator((name) => `${REPO_URL}/${D...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createRule
```

--------------------------------------------------------------------------------

---[FILE: create-json-schema.ts]---
Location: n8n-master/packages/@n8n/extension-sdk/scripts/create-json-schema.ts
Signals: Zod
Excerpt (<=80 chars): import { extensionManifestSchema } from '../src/schema';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: schema.ts]---
Location: n8n-master/packages/@n8n/extension-sdk/src/schema.ts
Signals: Zod
Excerpt (<=80 chars): export const extensionManifestSchema = z.object({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- extensionManifestSchema
- ExtensionManifest
```

--------------------------------------------------------------------------------

---[FILE: define.ts]---
Location: n8n-master/packages/@n8n/extension-sdk/src/backend/define.ts
Signals: N/A
Excerpt (<=80 chars):  export function defineBackendExtension(extension: BackendExtension): Backend...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- defineBackendExtension
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/@n8n/extension-sdk/src/backend/types.ts
Signals: N/A
Excerpt (<=80 chars): export type BackendExtensionContext = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BackendExtensionContext
- BackendExtensionSetupFn
- BackendExtension
```

--------------------------------------------------------------------------------

---[FILE: define.ts]---
Location: n8n-master/packages/@n8n/extension-sdk/src/frontend/define.ts
Signals: N/A
Excerpt (<=80 chars):  export function defineFrontendExtension(extension: FrontendExtension): Front...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- defineFrontendExtension
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/@n8n/extension-sdk/src/frontend/types.ts
Signals: N/A
Excerpt (<=80 chars):  export type FrontendExtensionContext = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FrontendExtensionContext
- FrontendExtensionSetupFn
- FrontendExtension
```

--------------------------------------------------------------------------------

---[FILE: errors.ts]---
Location: n8n-master/packages/@n8n/imap/src/errors.ts
Signals: N/A
Excerpt (<=80 chars): export class ConnectionTimeoutError extends ImapError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ConnectionTimeoutError
- ConnectionClosedError
- ConnectionEndedError
```

--------------------------------------------------------------------------------

---[FILE: imap-simple.ts]---
Location: n8n-master/packages/@n8n/imap/src/imap-simple.ts
Signals: N/A
Excerpt (<=80 chars):  export class ImapSimple extends EventEmitter {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ImapSimple
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: n8n-master/packages/@n8n/imap/src/index.ts
Signals: N/A
Excerpt (<=80 chars): export function getParts(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getParts
```

--------------------------------------------------------------------------------

---[FILE: part-data.ts]---
Location: n8n-master/packages/@n8n/imap/src/part-data.ts
Signals: N/A
Excerpt (<=80 chars):  export class Base64PartData extends PartData {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Base64PartData
- QuotedPrintablePartData
- SevenBitPartData
- BinaryPartData
- UuencodedPartData
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/@n8n/imap/src/types.ts
Signals: N/A
Excerpt (<=80 chars):  export interface ImapSimpleOptions {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SearchCriteria
- ImapSimpleOptions
- MessagePart
- MessageBodyPart
- Message
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: n8n-master/packages/@n8n/json-schema-to-zod/src/index.ts
Signals: Zod
Excerpt (<=80 chars): export type * from './types';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: json-schema-to-zod.ts]---
Location: n8n-master/packages/@n8n/json-schema-to-zod/src/json-schema-to-zod.ts
Signals: Zod
Excerpt (<=80 chars):  export const jsonSchemaToZod = <T extends z.ZodTypeAny = z.ZodTypeAny>(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- jsonSchemaToZod
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/@n8n/json-schema-to-zod/src/types.ts
Signals: Zod
Excerpt (<=80 chars):  export type Serializable =

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Serializable
- JsonSchema
- JsonSchemaObject
- ParserSelector
- ParserOverride
- JsonSchemaToZodOptions
- Refs
```

--------------------------------------------------------------------------------

---[FILE: parse-all-of.ts]---
Location: n8n-master/packages/@n8n/json-schema-to-zod/src/parsers/parse-all-of.ts
Signals: Zod
Excerpt (<=80 chars):  export function parseAllOf(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- parseAllOf
```

--------------------------------------------------------------------------------

---[FILE: parse-any-of.ts]---
Location: n8n-master/packages/@n8n/json-schema-to-zod/src/parsers/parse-any-of.ts
Signals: Zod
Excerpt (<=80 chars):  export const parseAnyOf = (jsonSchema: JsonSchemaObject & { anyOf: JsonSchem...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- parseAnyOf
```

--------------------------------------------------------------------------------

---[FILE: parse-array.ts]---
Location: n8n-master/packages/@n8n/json-schema-to-zod/src/parsers/parse-array.ts
Signals: Zod
Excerpt (<=80 chars):  export const parseArray = (jsonSchema: JsonSchemaObject & { type: 'array' },...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- parseArray
```

--------------------------------------------------------------------------------

---[FILE: parse-boolean.ts]---
Location: n8n-master/packages/@n8n/json-schema-to-zod/src/parsers/parse-boolean.ts
Signals: Zod
Excerpt (<=80 chars):  export const parseBoolean = (_jsonSchema: JsonSchemaObject & { type: 'boolea...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- parseBoolean
```

--------------------------------------------------------------------------------

---[FILE: parse-const.ts]---
Location: n8n-master/packages/@n8n/json-schema-to-zod/src/parsers/parse-const.ts
Signals: Zod
Excerpt (<=80 chars):  export const parseConst = (jsonSchema: JsonSchemaObject & { const: Serializa...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- parseConst
```

--------------------------------------------------------------------------------

---[FILE: parse-default.ts]---
Location: n8n-master/packages/@n8n/json-schema-to-zod/src/parsers/parse-default.ts
Signals: Zod
Excerpt (<=80 chars):  export const parseDefault = (_jsonSchema: JsonSchemaObject) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- parseDefault
```

--------------------------------------------------------------------------------

---[FILE: parse-enum.ts]---
Location: n8n-master/packages/@n8n/json-schema-to-zod/src/parsers/parse-enum.ts
Signals: Zod
Excerpt (<=80 chars):  export const parseEnum = (jsonSchema: JsonSchemaObject & { enum: Serializabl...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- parseEnum
```

--------------------------------------------------------------------------------

---[FILE: parse-if-then-else.ts]---
Location: n8n-master/packages/@n8n/json-schema-to-zod/src/parsers/parse-if-then-else.ts
Signals: Zod
Excerpt (<=80 chars):  export const parseIfThenElse = (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- parseIfThenElse
```

--------------------------------------------------------------------------------

---[FILE: parse-multiple-type.ts]---
Location: n8n-master/packages/@n8n/json-schema-to-zod/src/parsers/parse-multiple-type.ts
Signals: Zod
Excerpt (<=80 chars):  export const parseMultipleType = (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- parseMultipleType
```

--------------------------------------------------------------------------------

---[FILE: parse-not.ts]---
Location: n8n-master/packages/@n8n/json-schema-to-zod/src/parsers/parse-not.ts
Signals: Zod
Excerpt (<=80 chars):  export const parseNot = (jsonSchema: JsonSchemaObject & { not: JsonSchema },...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- parseNot
```

--------------------------------------------------------------------------------

---[FILE: parse-null.ts]---
Location: n8n-master/packages/@n8n/json-schema-to-zod/src/parsers/parse-null.ts
Signals: Zod
Excerpt (<=80 chars):  export const parseNull = (_jsonSchema: JsonSchemaObject & { type: 'null' }) ...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- parseNull
```

--------------------------------------------------------------------------------

---[FILE: parse-nullable.ts]---
Location: n8n-master/packages/@n8n/json-schema-to-zod/src/parsers/parse-nullable.ts
Signals: N/A
Excerpt (<=80 chars): export const parseNullable = (jsonSchema: JsonSchemaObject & { nullable: true...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- parseNullable
```

--------------------------------------------------------------------------------

---[FILE: parse-number.ts]---
Location: n8n-master/packages/@n8n/json-schema-to-zod/src/parsers/parse-number.ts
Signals: Zod
Excerpt (<=80 chars):  export const parseNumber = (jsonSchema: JsonSchemaObject & { type: 'number' ...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- parseNumber
```

--------------------------------------------------------------------------------

---[FILE: parse-object.ts]---
Location: n8n-master/packages/@n8n/json-schema-to-zod/src/parsers/parse-object.ts
Signals: Zod
Excerpt (<=80 chars):  export function parseObject(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- parseObject
```

--------------------------------------------------------------------------------

---[FILE: parse-one-of.ts]---
Location: n8n-master/packages/@n8n/json-schema-to-zod/src/parsers/parse-one-of.ts
Signals: Zod
Excerpt (<=80 chars):  export const parseOneOf = (jsonSchema: JsonSchemaObject & { oneOf: JsonSchem...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- parseOneOf
```

--------------------------------------------------------------------------------

---[FILE: parse-schema.ts]---
Location: n8n-master/packages/@n8n/json-schema-to-zod/src/parsers/parse-schema.ts
Signals: Zod
Excerpt (<=80 chars):  export const parseSchema = (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- parseSchema
```

--------------------------------------------------------------------------------

---[FILE: parse-string.ts]---
Location: n8n-master/packages/@n8n/json-schema-to-zod/src/parsers/parse-string.ts
Signals: Zod
Excerpt (<=80 chars):  export const parseString = (jsonSchema: JsonSchemaObject & { type: 'string' ...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- parseString
```

--------------------------------------------------------------------------------

---[FILE: extend-schema.ts]---
Location: n8n-master/packages/@n8n/json-schema-to-zod/src/utils/extend-schema.ts
Signals: Zod
Excerpt (<=80 chars):  export function extendSchemaWithMessage<

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: half.ts]---
Location: n8n-master/packages/@n8n/json-schema-to-zod/src/utils/half.ts
Signals: N/A
Excerpt (<=80 chars): export const half = <T>(arr: T[]): [T[], T[]] => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- half
```

--------------------------------------------------------------------------------

---[FILE: its.ts]---
Location: n8n-master/packages/@n8n/json-schema-to-zod/src/utils/its.ts
Signals: N/A
Excerpt (<=80 chars):  export const its = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- its
```

--------------------------------------------------------------------------------

---[FILE: omit.ts]---
Location: n8n-master/packages/@n8n/json-schema-to-zod/src/utils/omit.ts
Signals: N/A
Excerpt (<=80 chars): export const omit = <T extends object, K extends keyof T>(obj: T, ...keys: K[...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- omit
```

--------------------------------------------------------------------------------

---[FILE: extend-expect.ts]---
Location: n8n-master/packages/@n8n/json-schema-to-zod/test/extend-expect.ts
Signals: Zod
Excerpt (<=80 chars): import type { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: json-schema-to-zod.test.ts]---
Location: n8n-master/packages/@n8n/json-schema-to-zod/test/json-schema-to-zod.test.ts
Signals: Zod
Excerpt (<=80 chars): import type { JSONSchema4, JSONSchema6Definition, JSONSchema7Definition } fro...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: parse-all-of.test.ts]---
Location: n8n-master/packages/@n8n/json-schema-to-zod/test/parsers/parse-all-of.test.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: parse-any-of.test.ts]---
Location: n8n-master/packages/@n8n/json-schema-to-zod/test/parsers/parse-any-of.test.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: parse-array.test.ts]---
Location: n8n-master/packages/@n8n/json-schema-to-zod/test/parsers/parse-array.test.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: parse-const.test.ts]---
Location: n8n-master/packages/@n8n/json-schema-to-zod/test/parsers/parse-const.test.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: parse-enum.test.ts]---
Location: n8n-master/packages/@n8n/json-schema-to-zod/test/parsers/parse-enum.test.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: parse-not.test.ts]---
Location: n8n-master/packages/@n8n/json-schema-to-zod/test/parsers/parse-not.test.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: parse-nullable.test.ts]---
Location: n8n-master/packages/@n8n/json-schema-to-zod/test/parsers/parse-nullable.test.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: parse-number.test.ts]---
Location: n8n-master/packages/@n8n/json-schema-to-zod/test/parsers/parse-number.test.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: parse-object.test.ts]---
Location: n8n-master/packages/@n8n/json-schema-to-zod/test/parsers/parse-object.test.ts
Signals: Zod
Excerpt (<=80 chars): /* eslint-disable n8n-local-rules/no-skipped-tests */

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: parse-one-of.test.ts]---
Location: n8n-master/packages/@n8n/json-schema-to-zod/test/parsers/parse-one-of.test.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: parse-schema.test.ts]---
Location: n8n-master/packages/@n8n/json-schema-to-zod/test/parsers/parse-schema.test.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: parse-string.test.ts]---
Location: n8n-master/packages/@n8n/json-schema-to-zod/test/parsers/parse-string.test.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: n8n-master/packages/@n8n/node-cli/src/index.ts
Signals: N/A
Excerpt (<=80 chars):  export const commands = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- commands
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/@n8n/node-cli/src/commands/dev/utils.ts
Signals: N/A
Excerpt (<=80 chars):  export function createSpinner(text: string | (() => string)): () => string {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createSpinner
- openUrl
- runCommands
- createOpenN8nHandler
- buildHelpText
- CommandConfig
- KeyHandler
- CommandsConfig
```

--------------------------------------------------------------------------------

---[FILE: prompts.ts]---
Location: n8n-master/packages/@n8n/node-cli/src/commands/new/prompts.ts
Signals: N/A
Excerpt (<=80 chars):  export const nodeNamePrompt = async () =>

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- nodeNamePrompt
- nodeTypePrompt
- declarativeTemplatePrompt
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/@n8n/node-cli/src/commands/new/utils.ts
Signals: N/A
Excerpt (<=80 chars):  export const createIntro = async () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createIntro
```

--------------------------------------------------------------------------------

---[FILE: eslint.ts]---
Location: n8n-master/packages/@n8n/node-cli/src/configs/eslint.ts
Signals: N/A
Excerpt (<=80 chars): export const config = createConfig();

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- config
- configWithoutCloudSupport
```

--------------------------------------------------------------------------------

---[FILE: core.ts]---
Location: n8n-master/packages/@n8n/node-cli/src/template/core.ts
Signals: N/A
Excerpt (<=80 chars):  export type TemplateData<Config extends object = object> = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TemplateData
- Template
- TemplateWithRun
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: n8n-master/packages/@n8n/node-cli/src/template/templates/index.ts
Signals: N/A
Excerpt (<=80 chars):  export const templates = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isTemplateType
- templates
- TemplateMap
- TemplateType
- TemplateName
```

--------------------------------------------------------------------------------

---[FILE: ast.ts]---
Location: n8n-master/packages/@n8n/node-cli/src/template/templates/declarative/custom/ast.ts
Signals: N/A
Excerpt (<=80 chars):  export function updateNodeAst({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- updateNodeAst
- updateCredentialAst
- addCredentialToNode
```

--------------------------------------------------------------------------------

---[FILE: prompts.ts]---
Location: n8n-master/packages/@n8n/node-cli/src/template/templates/declarative/custom/prompts.ts
Signals: N/A
Excerpt (<=80 chars):  export const credentialTypePrompt = async () =>

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- credentialTypePrompt
- baseUrlPrompt
- oauthFlowPrompt
```

--------------------------------------------------------------------------------

---[FILE: template.ts]---
Location: n8n-master/packages/@n8n/node-cli/src/template/templates/declarative/custom/template.ts
Signals: N/A
Excerpt (<=80 chars):  export const customTemplate = createTemplate({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- customTemplate
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/@n8n/node-cli/src/template/templates/declarative/custom/types.ts
Signals: N/A
Excerpt (<=80 chars): export type CustomTemplateConfig =

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CustomTemplateConfig
- CredentialType
```

--------------------------------------------------------------------------------

---[FILE: Example.node.ts]---
Location: n8n-master/packages/@n8n/node-cli/src/template/templates/declarative/custom/template/nodes/Example/Example.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Example implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Example
```

--------------------------------------------------------------------------------

---[FILE: template.ts]---
Location: n8n-master/packages/@n8n/node-cli/src/template/templates/declarative/github-issues/template.ts
Signals: N/A
Excerpt (<=80 chars):  export const githubIssuesTemplate = createTemplate({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- githubIssuesTemplate
```

--------------------------------------------------------------------------------

---[FILE: GithubIssuesApi.credentials.ts]---
Location: n8n-master/packages/@n8n/node-cli/src/template/templates/declarative/github-issues/template/credentials/GithubIssuesApi.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class GithubIssuesApi implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GithubIssuesApi
```

--------------------------------------------------------------------------------

---[FILE: GithubIssuesOAuth2Api.credentials.ts]---
Location: n8n-master/packages/@n8n/node-cli/src/template/templates/declarative/github-issues/template/credentials/GithubIssuesOAuth2Api.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class GithubIssuesOAuth2Api implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GithubIssuesOAuth2Api
```

--------------------------------------------------------------------------------

---[FILE: GithubIssues.node.ts]---
Location: n8n-master/packages/@n8n/node-cli/src/template/templates/declarative/github-issues/template/nodes/GithubIssues/GithubIssues.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class GithubIssues implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GithubIssues
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/@n8n/node-cli/src/template/templates/declarative/github-issues/template/nodes/GithubIssues/shared/utils.ts
Signals: N/A
Excerpt (<=80 chars): export function parseLinkHeader(header?: string): { [rel: string]: string } {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- parseLinkHeader
```

--------------------------------------------------------------------------------

---[FILE: template.ts]---
Location: n8n-master/packages/@n8n/node-cli/src/template/templates/programmatic/example/template.ts
Signals: N/A
Excerpt (<=80 chars):  export const exampleTemplate = createTemplate({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- exampleTemplate
```

--------------------------------------------------------------------------------

---[FILE: Example.node.ts]---
Location: n8n-master/packages/@n8n/node-cli/src/template/templates/programmatic/example/template/nodes/Example/Example.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Example implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Example
```

--------------------------------------------------------------------------------

---[FILE: apiKey.credentials.ts]---
Location: n8n-master/packages/@n8n/node-cli/src/template/templates/shared/credentials/apiKey.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class ExampleApi implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExampleApi
```

--------------------------------------------------------------------------------

---[FILE: basicAuth.credentials.ts]---
Location: n8n-master/packages/@n8n/node-cli/src/template/templates/shared/credentials/basicAuth.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class ExampleApi implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExampleApi
```

--------------------------------------------------------------------------------

---[FILE: bearer.credentials.ts]---
Location: n8n-master/packages/@n8n/node-cli/src/template/templates/shared/credentials/bearer.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class ExampleApi implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExampleApi
```

--------------------------------------------------------------------------------

---[FILE: custom.credentials.ts]---
Location: n8n-master/packages/@n8n/node-cli/src/template/templates/shared/credentials/custom.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class ExampleApi implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExampleApi
```

--------------------------------------------------------------------------------

---[FILE: oauth2AuthorizationCode.credentials.ts]---
Location: n8n-master/packages/@n8n/node-cli/src/template/templates/shared/credentials/oauth2AuthorizationCode.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class ExampleOAuth2Api implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExampleOAuth2Api
```

--------------------------------------------------------------------------------

---[FILE: oauth2ClientCredentials.credentials.ts]---
Location: n8n-master/packages/@n8n/node-cli/src/template/templates/shared/credentials/oauth2ClientCredentials.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class ExampleOAuth2Api implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExampleOAuth2Api
```

--------------------------------------------------------------------------------

---[FILE: command-tester.ts]---
Location: n8n-master/packages/@n8n/node-cli/src/test-utils/command-tester.ts
Signals: N/A
Excerpt (<=80 chars):  export type LogLevel = 'success' | 'warning' | 'error' | 'info';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CommandTester
- LogLevel
- CommandResult
```

--------------------------------------------------------------------------------

---[FILE: matchers.ts]---
Location: n8n-master/packages/@n8n/node-cli/src/test-utils/matchers.ts
Signals: N/A
Excerpt (<=80 chars):  export function stripAnsiCodes(text: string): string {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- stripAnsiCodes
```

--------------------------------------------------------------------------------

---[FILE: mock-child-process.ts]---
Location: n8n-master/packages/@n8n/node-cli/src/test-utils/mock-child-process.ts
Signals: N/A
Excerpt (<=80 chars):  export interface MockChildProcess extends EventEmitter {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mockSpawn
- mockExecSync
- MockChildProcess
- MockSpawnOptions
- CommandMockConfig
- ExecSyncMockConfig
```

--------------------------------------------------------------------------------

---[FILE: mock-prompts.ts]---
Location: n8n-master/packages/@n8n/node-cli/src/test-utils/mock-prompts.ts
Signals: N/A
Excerpt (<=80 chars):  export class MockPrompt {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MockPrompt
```

--------------------------------------------------------------------------------

---[FILE: package-setup.ts]---
Location: n8n-master/packages/@n8n/node-cli/src/test-utils/package-setup.ts
Signals: N/A
Excerpt (<=80 chars):  export interface PackageSetupOptions {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PackageSetupOptions
```

--------------------------------------------------------------------------------

---[FILE: temp-fs.ts]---
Location: n8n-master/packages/@n8n/node-cli/src/test-utils/temp-fs.ts
Signals: N/A
Excerpt (<=80 chars):  export const tmpdirTest = test.extend<TmpDirFixture>({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- tmpdirTest
```

--------------------------------------------------------------------------------

---[FILE: ast.test.ts]---
Location: n8n-master/packages/@n8n/node-cli/src/utils/ast.test.ts
Signals: N/A
Excerpt (<=80 chars): export const config = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- config
```

--------------------------------------------------------------------------------

---[FILE: ast.ts]---
Location: n8n-master/packages/@n8n/node-cli/src/utils/ast.ts
Signals: N/A
Excerpt (<=80 chars):  export const loadSingleSourceFile = (path: string) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- loadSingleSourceFile
- updateStringProperty
- getChildObjectLiteral
```

--------------------------------------------------------------------------------

---[FILE: child-process.ts]---
Location: n8n-master/packages/@n8n/node-cli/src/utils/child-process.ts
Signals: N/A
Excerpt (<=80 chars):  export class ChildProcessError extends Error {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ChildProcessError
```

--------------------------------------------------------------------------------

---[FILE: command-suggestions.ts]---
Location: n8n-master/packages/@n8n/node-cli/src/utils/command-suggestions.ts
Signals: N/A
Excerpt (<=80 chars):  export function formatCommand(command: string): string {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- formatCommand
```

--------------------------------------------------------------------------------

---[FILE: git.ts]---
Location: n8n-master/packages/@n8n/node-cli/src/utils/git.ts
Signals: N/A
Excerpt (<=80 chars):  export function tryReadGitUser(): GitUser {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- tryReadGitUser
```

--------------------------------------------------------------------------------

---[FILE: package-manager.ts]---
Location: n8n-master/packages/@n8n/node-cli/src/utils/package-manager.ts
Signals: N/A
Excerpt (<=80 chars):  export function detectPackageManagerFromUserAgent(): PackageManager | null {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- detectPackageManagerFromUserAgent
```

--------------------------------------------------------------------------------

---[FILE: package.ts]---
Location: n8n-master/packages/@n8n/node-cli/src/utils/package.ts
Signals: N/A
Excerpt (<=80 chars):  export type N8nPackageJson = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- N8nPackageJson
```

--------------------------------------------------------------------------------

---[FILE: prompts.ts]---
Location: n8n-master/packages/@n8n/node-cli/src/utils/prompts.ts
Signals: N/A
Excerpt (<=80 chars):  export const onCancel = (message = 'Cancelled', code = 0) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- onCancel
```

--------------------------------------------------------------------------------

---[FILE: validation.ts]---
Location: n8n-master/packages/@n8n/node-cli/src/utils/validation.ts
Signals: N/A
Excerpt (<=80 chars): export const validateNodeName = (name: string): string | undefined => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isNodeErrnoException
- isEnoentError
- validateNodeName
```

--------------------------------------------------------------------------------

---[FILE: AnthropicApi.credentials.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/credentials/AnthropicApi.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class AnthropicApi implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AnthropicApi
```

--------------------------------------------------------------------------------

---[FILE: AzureAiSearchApi.credentials.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/credentials/AzureAiSearchApi.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class AzureAiSearchApi implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AzureAiSearchApi
```

--------------------------------------------------------------------------------

````
