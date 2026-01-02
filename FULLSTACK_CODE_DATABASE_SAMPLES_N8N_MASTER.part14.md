---
source_txt: fullstack_samples/n8n-master
converted_utc: 2025-12-18T10:47:15Z
part: 14
parts_total: 51
---

# FULLSTACK CODE DATABASE SAMPLES n8n-master

## Extracted Reusable Patterns (Non-verbatim) (Part 14 of 51)

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

---[FILE: utils.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/OpenAi/helpers/utils.ts
Signals: Zod
Excerpt (<=80 chars): export function formatToOpenAIFunction(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- formatToOpenAIFunction
- formatToOpenAITool
- formatToOpenAIAssistantTool
- formatToOpenAIResponsesTool
```

--------------------------------------------------------------------------------

---[FILE: utils.test.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/OpenAi/test/utils.test.ts
Signals: Zod
Excerpt (<=80 chars): import { AIMessage, HumanMessage } from '@langchain/core/messages';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: OpenAiV1.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/OpenAi/v1/OpenAiV1.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class OpenAiV1 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OpenAiV1
```

--------------------------------------------------------------------------------

---[FILE: descriptions.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/OpenAi/v1/actions/descriptions.ts
Signals: N/A
Excerpt (<=80 chars):  export const modelRLC = (searchListMethod: string = 'modelSearch'): INodePro...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- modelRLC
```

--------------------------------------------------------------------------------

---[FILE: node.type.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/OpenAi/v1/actions/node.type.ts
Signals: N/A
Excerpt (<=80 chars):  export type OpenAiType = AllEntities<NodeMap>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OpenAiType
```

--------------------------------------------------------------------------------

---[FILE: create.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/OpenAi/v1/actions/assistant/create.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: deleteAssistant.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/OpenAi/v1/actions/assistant/deleteAssistant.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: list.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/OpenAi/v1/actions/assistant/list.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: message.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/OpenAi/v1/actions/assistant/message.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: update.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/OpenAi/v1/actions/assistant/update.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: generate.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/OpenAi/v1/actions/audio/generate.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: transcribe.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/OpenAi/v1/actions/audio/transcribe.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: translate.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/OpenAi/v1/actions/audio/translate.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: deleteFile.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/OpenAi/v1/actions/file/deleteFile.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: list.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/OpenAi/v1/actions/file/list.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: upload.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/OpenAi/v1/actions/file/upload.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: analyze.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/OpenAi/v1/actions/image/analyze.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: generate.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/OpenAi/v1/actions/image/generate.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: classify.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/OpenAi/v1/actions/text/classify.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: message.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/OpenAi/v1/actions/text/message.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: OpenAiV2.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/OpenAi/v2/OpenAiV2.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class OpenAiV2 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OpenAiV2
```

--------------------------------------------------------------------------------

---[FILE: descriptions.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/OpenAi/v2/actions/descriptions.ts
Signals: N/A
Excerpt (<=80 chars):  export const modelRLC = (searchListMethod: string = 'modelSearch'): INodePro...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- modelRLC
```

--------------------------------------------------------------------------------

---[FILE: node.type.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/OpenAi/v2/actions/node.type.ts
Signals: N/A
Excerpt (<=80 chars):  export type OpenAiType = AllEntities<NodeMap>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OpenAiType
```

--------------------------------------------------------------------------------

---[FILE: generate.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/OpenAi/v2/actions/audio/generate.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: transcribe.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/OpenAi/v2/actions/audio/transcribe.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: translate.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/OpenAi/v2/actions/audio/translate.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: create.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/OpenAi/v2/actions/conversation/create.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: get.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/OpenAi/v2/actions/conversation/get.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: remove.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/OpenAi/v2/actions/conversation/remove.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: update.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/OpenAi/v2/actions/conversation/update.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: deleteFile.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/OpenAi/v2/actions/file/deleteFile.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: list.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/OpenAi/v2/actions/file/list.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: upload.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/OpenAi/v2/actions/file/upload.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: analyze.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/OpenAi/v2/actions/image/analyze.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: edit.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/OpenAi/v2/actions/image/edit.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const properties: INodeProperties[] = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: generate.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/OpenAi/v2/actions/image/generate.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: classify.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/OpenAi/v2/actions/text/classify.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: response.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/OpenAi/v2/actions/text/response.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: generate.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/OpenAi/v2/actions/video/generate.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: generate-schema.d.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/types/generate-schema.d.ts
Signals: N/A
Excerpt (<=80 chars):  export interface SchemaObject {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- json
- SchemaObject
- SchemaArray
- SchemaProperty
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/types/types.ts
Signals: Zod
Excerpt (<=80 chars):  export type OpenAICompatibleCredential = { apiKey: string; url: string };

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OpenAICompatibleCredential
- ZodObjectAny
```

--------------------------------------------------------------------------------

---[FILE: zod.types.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/types/zod.types.ts
Signals: Zod
Excerpt (<=80 chars): export type DynamicZodObject = z.ZodObject<any, any, any, any>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DynamicZodObject
```

--------------------------------------------------------------------------------

---[FILE: descriptions.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/utils/descriptions.ts
Signals: N/A
Excerpt (<=80 chars):  export const schemaTypeField: INodeProperties = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- buildJsonSchemaExampleField
- buildJsonSchemaExampleNotice
- jsonSchemaExampleField
- buildInputSchemaField
- inputSchemaField
```

--------------------------------------------------------------------------------

---[FILE: fromAIToolFactory.test.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/utils/fromAIToolFactory.test.ts
Signals: Zod
Excerpt (<=80 chars): import { DynamicStructuredTool, DynamicTool } from '@langchain/core/tools';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: fromAIToolFactory.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/utils/fromAIToolFactory.ts
Signals: Zod
Excerpt (<=80 chars):  export type ToolFunc = (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- extractFromAIParameters
- createZodSchemaFromArgs
- createToolFromNode
- ToolFunc
- CreateToolOptions
```

--------------------------------------------------------------------------------

---[FILE: helpers.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/utils/helpers.ts
Signals: N/A
Excerpt (<=80 chars):  export function getMetadataFiltersValues(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getMetadataFiltersValues
- isBaseChatMemory
- isBaseChatMessageHistory
- isChatInstance
- isToolsInstance
- getPromptInputByType
- getSessionId
- logAiEvent
- serializeChatHistory
- escapeSingleCurlyBrackets
- unwrapNestedOutput
- hasLongSequentialRepeat
- getConnectedTools
```

--------------------------------------------------------------------------------

---[FILE: httpProxyAgent.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/utils/httpProxyAgent.ts
Signals: N/A
Excerpt (<=80 chars): export function getProxyAgent(targetUrl?: string) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getProxyAgent
- getNodeProxyAgent
```

--------------------------------------------------------------------------------

---[FILE: N8nBinaryLoader.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/utils/N8nBinaryLoader.ts
Signals: N/A
Excerpt (<=80 chars):  export class N8nBinaryLoader {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- N8nBinaryLoader
```

--------------------------------------------------------------------------------

---[FILE: N8nJsonLoader.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/utils/N8nJsonLoader.ts
Signals: N/A
Excerpt (<=80 chars):  export class N8nJsonLoader {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- N8nJsonLoader
```

--------------------------------------------------------------------------------

---[FILE: N8nTool.test.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/utils/N8nTool.test.ts
Signals: Zod
Excerpt (<=80 chars): import { DynamicStructuredTool, DynamicTool } from '@langchain/core/tools';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: N8nTool.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/utils/N8nTool.ts
Signals: Zod
Excerpt (<=80 chars):  export const prepareFallbackToolDescription = (toolDescription: string, sche...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- prepareFallbackToolDescription
- N8nTool
```

--------------------------------------------------------------------------------

---[FILE: schemaParsing.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/utils/schemaParsing.ts
Signals: Zod
Excerpt (<=80 chars):  export function generateSchemaFromExample(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- generateSchemaFromExample
- throwIfToolSchema
```

--------------------------------------------------------------------------------

---[FILE: sharedFields.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/utils/sharedFields.ts
Signals: N/A
Excerpt (<=80 chars):  export const metadataFilterField: INodeProperties = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getTemplateNoticeField
- getBatchingOptionFields
- getConnectionHintNoticeField
```

--------------------------------------------------------------------------------

---[FILE: tracing.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/utils/tracing.ts
Signals: N/A
Excerpt (<=80 chars):  export function getTracingConfig(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getTracingConfig
```

--------------------------------------------------------------------------------

---[FILE: buildSteps.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/utils/agent-execution/buildSteps.ts
Signals: N/A
Excerpt (<=80 chars): export function buildSteps(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- buildSteps
```

--------------------------------------------------------------------------------

---[FILE: memoryManagement.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/utils/agent-execution/memoryManagement.ts
Signals: N/A
Excerpt (<=80 chars): export function buildToolContext(steps: ToolCallData[]): string {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- buildToolContext
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/utils/agent-execution/types.ts
Signals: N/A
Excerpt (<=80 chars): export type ToolCallRequest = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isThinkingBlock
- isRedactedThinkingBlock
- isGeminiThoughtSignatureBlock
- ToolCallRequest
- ToolCallData
- AgentResult
- ThinkingContentBlock
- RedactedThinkingContentBlock
- ToolUseContentBlock
- GeminiThoughtSignatureBlock
- ContentBlock
- RequestResponseMetadata
```

--------------------------------------------------------------------------------

---[FILE: createEngineRequests.test.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/utils/agent-execution/test/createEngineRequests.test.ts
Signals: Zod
Excerpt (<=80 chars): import { DynamicStructuredTool } from '@langchain/classic/tools';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: embeddingInputValidation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/utils/embeddings/embeddingInputValidation.ts
Signals: N/A
Excerpt (<=80 chars): export function validateEmbedQueryInput(query: unknown, node: INode): string {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- validateEmbedQueryInput
- validateEmbedDocumentsInput
```

--------------------------------------------------------------------------------

---[FILE: N8nItemListOutputParser.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/utils/output_parsers/N8nItemListOutputParser.ts
Signals: N/A
Excerpt (<=80 chars):  export class N8nItemListOutputParser extends BaseOutputParser<string[]> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- N8nItemListOutputParser
```

--------------------------------------------------------------------------------

---[FILE: N8nOutputFixingParser.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/utils/output_parsers/N8nOutputFixingParser.ts
Signals: N/A
Excerpt (<=80 chars):  export class N8nOutputFixingParser extends BaseOutputParser {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- N8nOutputFixingParser
```

--------------------------------------------------------------------------------

---[FILE: N8nOutputParser.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/utils/output_parsers/N8nOutputParser.ts
Signals: N/A
Excerpt (<=80 chars):  export type N8nOutputParser =

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- N8nOutputParser
```

--------------------------------------------------------------------------------

---[FILE: N8nStructuredOutputParser.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/utils/output_parsers/N8nStructuredOutputParser.ts
Signals: Zod
Excerpt (<=80 chars):  export class N8nStructuredOutputParser extends StructuredOutputParser<

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- N8nStructuredOutputParser
```

--------------------------------------------------------------------------------

---[FILE: prompt.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/utils/output_parsers/prompt.ts
Signals: N/A
Excerpt (<=80 chars):  export const NAIVE_FIX_TEMPLATE = `Instructions:

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NAIVE_FIX_TEMPLATE
- NAIVE_FIX_PROMPT
```

--------------------------------------------------------------------------------

---[FILE: helpers.test.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/utils/tests/helpers.test.ts
Signals: Zod
Excerpt (<=80 chars): import { DynamicTool, type Tool } from '@langchain/core/tools';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: schemaParsing.test.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/utils/tests/schemaParsing.test.ts
Signals: Zod
Excerpt (<=80 chars): import type { JSONSchema7 } from 'json-schema';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: token-estimator.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/utils/tokenizer/token-estimator.ts
Signals: N/A
Excerpt (<=80 chars): export function estimateTokensByCharCount(text: string, model: string = 'cl10...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- estimateTokensByCharCount
- estimateTextSplitsByTokens
```

--------------------------------------------------------------------------------

---[FILE: constants.ee.ts]---
Location: n8n-master/packages/@n8n/permissions/src/constants.ee.ts
Signals: N/A
Excerpt (<=80 chars): export const DEFAULT_OPERATIONS = ['create', 'read', 'update', 'delete', 'lis...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DEFAULT_OPERATIONS
- RESOURCES
- API_KEY_RESOURCES
- PROJECT_OWNER_ROLE_SLUG
- PROJECT_ADMIN_ROLE_SLUG
- PROJECT_EDITOR_ROLE_SLUG
- PROJECT_VIEWER_ROLE_SLUG
- PROJECT_CHAT_USER_ROLE_SLUG
```

--------------------------------------------------------------------------------

---[FILE: public-api-permissions.ee.ts]---
Location: n8n-master/packages/@n8n/permissions/src/public-api-permissions.ee.ts
Signals: N/A
Excerpt (<=80 chars):  export const OWNER_API_KEY_SCOPES: ApiKeyScope[] = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getApiKeyScopesForRole
- getOwnerOnlyApiKeyScopes
```

--------------------------------------------------------------------------------

---[FILE: schemas.ee.ts]---
Location: n8n-master/packages/@n8n/permissions/src/schemas.ee.ts
Signals: Zod
Excerpt (<=80 chars):  export const roleNamespaceSchema = z.enum(['global', 'project', 'credential'...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- roleNamespaceSchema
- globalRoleSchema
- assignableGlobalRoleSchema
- personalRoleSchema
- teamRoleSchema
- customProjectRoleSchema
- systemProjectRoleSchema
- assignableProjectRoleSchema
- projectRoleSchema
- credentialSharingRoleSchema
- workflowSharingRoleSchema
- scopeSchema
- roleSchema
- Role
```

--------------------------------------------------------------------------------

---[FILE: scope-information.ts]---
Location: n8n-master/packages/@n8n/permissions/src/scope-information.ts
Signals: N/A
Excerpt (<=80 chars):  export const ALL_SCOPES = buildResourceScopes();

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ALL_SCOPES
- ALL_API_KEY_SCOPES
```

--------------------------------------------------------------------------------

---[FILE: types.ee.ts]---
Location: n8n-master/packages/@n8n/permissions/src/types.ee.ts
Signals: Zod
Excerpt (<=80 chars):  export type ScopeInformation = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isAssignableProjectRoleSlug
- isApiKeyScope
- ScopeInformation
- Resource
- Scope
- ScopeLevels
- MaskLevels
- ScopeOptions
- RoleNamespace
- GlobalRole
- AssignableGlobalRole
- CredentialSharingRole
- WorkflowSharingRole
- TeamProjectRole
- ProjectRole
- AssignableProjectRole
- AllRoleTypes
- AllRolesMap
```

--------------------------------------------------------------------------------

---[FILE: all-roles.ts]---
Location: n8n-master/packages/@n8n/permissions/src/roles/all-roles.ts
Signals: N/A
Excerpt (<=80 chars):  export const ALL_ROLES: AllRolesMap = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isBuiltInRole
```

--------------------------------------------------------------------------------

---[FILE: role-maps.ee.ts]---
Location: n8n-master/packages/@n8n/permissions/src/roles/role-maps.ee.ts
Signals: N/A
Excerpt (<=80 chars):  export const GLOBAL_SCOPE_MAP: Record<GlobalRole, Scope[]> = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ALL_ROLE_MAPS
```

--------------------------------------------------------------------------------

---[FILE: global-scopes.ee.ts]---
Location: n8n-master/packages/@n8n/permissions/src/roles/scopes/global-scopes.ee.ts
Signals: N/A
Excerpt (<=80 chars):  export const GLOBAL_OWNER_SCOPES: Scope[] = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GLOBAL_ADMIN_SCOPES
```

--------------------------------------------------------------------------------

---[FILE: combine-scopes.ee.ts]---
Location: n8n-master/packages/@n8n/permissions/src/utilities/combine-scopes.ee.ts
Signals: N/A
Excerpt (<=80 chars): export function combineScopes(userScopes: ScopeLevels, masks?: MaskLevels): S...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- combineScopes
```

--------------------------------------------------------------------------------

---[FILE: get-global-scopes.ee.ts]---
Location: n8n-master/packages/@n8n/permissions/src/utilities/get-global-scopes.ee.ts
Signals: N/A
Excerpt (<=80 chars): export const getGlobalScopes = (principal: AuthPrincipal) =>

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getGlobalScopes
```

--------------------------------------------------------------------------------

---[FILE: get-resource-permissions.ee.ts]---
Location: n8n-master/packages/@n8n/permissions/src/utilities/get-resource-permissions.ee.ts
Signals: N/A
Excerpt (<=80 chars): export type PermissionsRecord = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getResourcePermissions
- PermissionsRecord
```

--------------------------------------------------------------------------------

---[FILE: get-role-scopes.ee.ts]---
Location: n8n-master/packages/@n8n/permissions/src/utilities/get-role-scopes.ee.ts
Signals: N/A
Excerpt (<=80 chars):  export const COMBINED_ROLE_MAP = Object.fromEntries(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getRoleScopes
- getAuthPrincipalScopes
- COMBINED_ROLE_MAP
```

--------------------------------------------------------------------------------

---[FILE: has-global-scope.ee.ts]---
Location: n8n-master/packages/@n8n/permissions/src/utilities/has-global-scope.ee.ts
Signals: N/A
Excerpt (<=80 chars): export const hasGlobalScope = (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- hasGlobalScope
```

--------------------------------------------------------------------------------

---[FILE: has-scope.ee.ts]---
Location: n8n-master/packages/@n8n/permissions/src/utilities/has-scope.ee.ts
Signals: N/A
Excerpt (<=80 chars): export const hasScope = (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- hasScope
```

--------------------------------------------------------------------------------

---[FILE: static-roles-with-scope.ee.ts]---
Location: n8n-master/packages/@n8n/permissions/src/utilities/static-roles-with-scope.ee.ts
Signals: N/A
Excerpt (<=80 chars): export function staticRolesWithScope(namespace: RoleNamespace, scopes: Scope ...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- staticRolesWithScope
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/@n8n/permissions/src/utilities/__tests__/utils.ts
Signals: N/A
Excerpt (<=80 chars):  export function createAuthPrincipal(role: string, scopes: Scope[] = []): Aut...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createAuthPrincipal
```

--------------------------------------------------------------------------------

---[FILE: health-check-server.ts]---
Location: n8n-master/packages/@n8n/task-runner/src/health-check-server.ts
Signals: N/A
Excerpt (<=80 chars):  export class HealthCheckServer {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HealthCheckServer
```

--------------------------------------------------------------------------------

---[FILE: message-types.ts]---
Location: n8n-master/packages/@n8n/task-runner/src/message-types.ts
Signals: N/A
Excerpt (<=80 chars):  export interface InfoRequest {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- All
- InfoRequest
- RunnerRegistered
- TaskOfferAccept
- TaskCancel
- TaskSettings
- RPCResponse
- TaskDataResponse
- NodeTypes
- TaskReady
- TaskDone
- TaskError
- RequestExpired
- TaskDataRequest
- NodeTypesRequest
```

--------------------------------------------------------------------------------

---[FILE: node-types.ts]---
Location: n8n-master/packages/@n8n/task-runner/src/node-types.ts
Signals: N/A
Excerpt (<=80 chars):  export const DEFAULT_NODETYPE_VERSION = 1;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DEFAULT_NODETYPE_VERSION
- TaskRunnerNodeTypes
```

--------------------------------------------------------------------------------

---[FILE: runner-types.ts]---
Location: n8n-master/packages/@n8n/task-runner/src/runner-types.ts
Signals: N/A
Excerpt (<=80 chars):  export interface InputDataChunkDefinition {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EXPOSED_RPC_METHODS
- UNSUPPORTED_HELPER_FUNCTIONS
- AVAILABLE_RPC_METHODS
- NeededNodeType
- InputDataChunkDefinition
- InputDataRequestParams
- TaskDataRequestParams
- DataRequestResponse
- TaskResultData
- TaskData
- PartialAdditionalData
```

--------------------------------------------------------------------------------

---[FILE: task-runner-sentry.ts]---
Location: n8n-master/packages/@n8n/task-runner/src/task-runner-sentry.ts
Signals: N/A
Excerpt (<=80 chars): export class TaskRunnerSentry {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TaskRunnerSentry
```

--------------------------------------------------------------------------------

---[FILE: task-runner.ts]---
Location: n8n-master/packages/@n8n/task-runner/src/task-runner.ts
Signals: N/A
Excerpt (<=80 chars):  export interface TaskOffer {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- noOp
- TaskOffer
- TaskParams
- TaskRunnerOpts
```

--------------------------------------------------------------------------------

---[FILE: task-state.ts]---
Location: n8n-master/packages/@n8n/task-runner/src/task-state.ts
Signals: N/A
Excerpt (<=80 chars):  export type TaskStatus =

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TaskState
- TaskStatus
- TaskStateOpts
```

--------------------------------------------------------------------------------

---[FILE: base-runner-config.ts]---
Location: n8n-master/packages/@n8n/task-runner/src/config/base-runner-config.ts
Signals: N/A
Excerpt (<=80 chars): export class BaseRunnerConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BaseRunnerConfig
```

--------------------------------------------------------------------------------

---[FILE: js-runner-config.ts]---
Location: n8n-master/packages/@n8n/task-runner/src/config/js-runner-config.ts
Signals: N/A
Excerpt (<=80 chars): export class JsRunnerConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- JsRunnerConfig
```

--------------------------------------------------------------------------------

---[FILE: main-config.ts]---
Location: n8n-master/packages/@n8n/task-runner/src/config/main-config.ts
Signals: N/A
Excerpt (<=80 chars): export class MainConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MainConfig
```

--------------------------------------------------------------------------------

---[FILE: sentry-config.ts]---
Location: n8n-master/packages/@n8n/task-runner/src/config/sentry-config.ts
Signals: N/A
Excerpt (<=80 chars): export class SentryConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SentryConfig
```

--------------------------------------------------------------------------------

````
