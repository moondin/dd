---
source_txt: fullstack_samples/n8n-master
converted_utc: 2025-12-18T10:47:15Z
part: 13
parts_total: 51
---

# FULLSTACK CODE DATABASE SAMPLES n8n-master

## Extracted Reusable Patterns (Non-verbatim) (Part 13 of 51)

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

---[FILE: ToolSerpApi.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/tools/ToolSerpApi/ToolSerpApi.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class ToolSerpApi implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ToolSerpApi
```

--------------------------------------------------------------------------------

---[FILE: ToolThink.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/tools/ToolThink/ToolThink.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class ToolThink implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ToolThink
```

--------------------------------------------------------------------------------

---[FILE: ToolVectorStore.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/tools/ToolVectorStore/ToolVectorStore.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class ToolVectorStore implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ToolVectorStore
```

--------------------------------------------------------------------------------

---[FILE: ToolWikipedia.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/tools/ToolWikipedia/ToolWikipedia.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class ToolWikipedia implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ToolWikipedia
```

--------------------------------------------------------------------------------

---[FILE: ToolWolframAlpha.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/tools/ToolWolframAlpha/ToolWolframAlpha.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class ToolWolframAlpha implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ToolWolframAlpha
```

--------------------------------------------------------------------------------

---[FILE: ToolWorkflow.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/tools/ToolWorkflow/ToolWorkflow.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class ToolWorkflow extends VersionedNodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ToolWorkflow
```

--------------------------------------------------------------------------------

---[FILE: ToolWorkflowV1.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/tools/ToolWorkflow/v1/ToolWorkflowV1.node.ts
Signals: Zod
Excerpt (<=80 chars):  export class ToolWorkflowV1 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ToolWorkflowV1
```

--------------------------------------------------------------------------------

---[FILE: ToolWorkflowV2.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/tools/ToolWorkflow/v2/ToolWorkflowV2.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class ToolWorkflowV2 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ToolWorkflowV2
```

--------------------------------------------------------------------------------

---[FILE: WorkflowToolService.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/tools/ToolWorkflow/v2/utils/WorkflowToolService.ts
Signals: Zod
Excerpt (<=80 chars): export class WorkflowToolService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowToolService
```

--------------------------------------------------------------------------------

---[FILE: Chat.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/trigger/ChatTrigger/Chat.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Chat implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Chat
```

--------------------------------------------------------------------------------

---[FILE: ChatTrigger.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/trigger/ChatTrigger/ChatTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class ChatTrigger extends Node {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ChatTrigger
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/trigger/ChatTrigger/constants.ts
Signals: N/A
Excerpt (<=80 chars): export const cssVariables = `

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- cssVariables
```

--------------------------------------------------------------------------------

---[FILE: error.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/trigger/ChatTrigger/error.ts
Signals: N/A
Excerpt (<=80 chars):  export class ChatTriggerAuthorizationError extends ApplicationError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ChatTriggerAuthorizationError
```

--------------------------------------------------------------------------------

---[FILE: templates.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/trigger/ChatTrigger/templates.ts
Signals: N/A
Excerpt (<=80 chars):  export function getSanitizedInitialMessages(initialMessages: string): string...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getSanitizedInitialMessages
- getSanitizedI18nConfig
- createPage
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/trigger/ChatTrigger/types.ts
Signals: N/A
Excerpt (<=80 chars): export type AuthenticationChatOption = 'none' | 'basicAuth' | 'n8nUserAuth';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- assertValidLoadPreviousSessionOption
- AuthenticationChatOption
- LoadPreviousSessionChatOption
```

--------------------------------------------------------------------------------

---[FILE: util.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/trigger/ChatTrigger/util.ts
Signals: N/A
Excerpt (<=80 chars):  export function configureWaitTillDate(context: IExecuteFunctions) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- configureWaitTillDate
- configureInputs
```

--------------------------------------------------------------------------------

---[FILE: ChatTrigger.node.test.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/trigger/ChatTrigger/__test__/ChatTrigger.node.test.ts
Signals: Express
Excerpt (<=80 chars): import { jest } from '@jest/globals';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ManualChatTrigger.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/trigger/ManualChatTrigger/ManualChatTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class ManualChatTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ManualChatTrigger
```

--------------------------------------------------------------------------------

---[FILE: createVectorStoreNode.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vector_store/shared/createVectorStoreNode/createVectorStoreNode.ts
Signals: N/A
Excerpt (<=80 chars): export const createVectorStoreNode = <T extends VectorStore = VectorStore>(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createVectorStoreNode
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vector_store/shared/createVectorStoreNode/types.ts
Signals: N/A
Excerpt (<=80 chars):  export type NodeOperationMode = 'insert' | 'load' | 'retrieve' | 'update' | ...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NodeOperationMode
- NodeMeta
- VectorStoreNodeConstructorArgs
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vector_store/shared/createVectorStoreNode/utils.ts
Signals: N/A
Excerpt (<=80 chars): export function transformDescriptionForOperationMode(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- transformDescriptionForOperationMode
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vector_store/shared/MemoryManager/config.ts
Signals: N/A
Excerpt (<=80 chars): export function getConfig(): MemoryVectorStoreConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getConfig
- mbToBytes
- hoursToMs
```

--------------------------------------------------------------------------------

---[FILE: MemoryCalculator.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vector_store/shared/MemoryManager/MemoryCalculator.ts
Signals: N/A
Excerpt (<=80 chars): export class MemoryCalculator implements IMemoryCalculator {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MemoryCalculator
```

--------------------------------------------------------------------------------

---[FILE: MemoryVectorStoreManager.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vector_store/shared/MemoryManager/MemoryVectorStoreManager.ts
Signals: N/A
Excerpt (<=80 chars): export class MemoryVectorStoreManager {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MemoryVectorStoreManager
```

--------------------------------------------------------------------------------

---[FILE: StoreCleanupService.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vector_store/shared/MemoryManager/StoreCleanupService.ts
Signals: N/A
Excerpt (<=80 chars): export class StoreCleanupService implements IStoreCleanupService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- StoreCleanupService
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vector_store/shared/MemoryManager/types.ts
Signals: N/A
Excerpt (<=80 chars): export interface MemoryVectorStoreConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MemoryVectorStoreConfig
- VectorStoreMetadata
- StoreStats
- VectorStoreStats
- IMemoryCalculator
- IStoreCleanupService
```

--------------------------------------------------------------------------------

---[FILE: VectorStoreAzureAISearch.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vector_store/VectorStoreAzureAISearch/VectorStoreAzureAISearch.node.ts
Signals: N/A
Excerpt (<=80 chars):  export const AZURE_AI_SEARCH_CREDENTIALS = 'azureAiSearchApi';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AZURE_AI_SEARCH_CREDENTIALS
- INDEX_NAME
- QUERY_TYPE
- FILTER
- SEMANTIC_CONFIGURATION
- getIndexName
- VectorStoreAzureAISearch
```

--------------------------------------------------------------------------------

---[FILE: VectorStoreInMemory.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vector_store/VectorStoreInMemory/VectorStoreInMemory.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class VectorStoreInMemory extends createVectorStoreNode<MemoryVectorS...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VectorStoreInMemory
```

--------------------------------------------------------------------------------

---[FILE: VectorStoreInMemoryInsert.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vector_store/VectorStoreInMemoryInsert/VectorStoreInMemoryInsert.node.ts
Signals: N/A
Excerpt (<=80 chars): export class VectorStoreInMemoryInsert implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VectorStoreInMemoryInsert
```

--------------------------------------------------------------------------------

---[FILE: VectorStoreInMemoryLoad.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vector_store/VectorStoreInMemoryLoad/VectorStoreInMemoryLoad.node.ts
Signals: N/A
Excerpt (<=80 chars): export class VectorStoreInMemoryLoad implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VectorStoreInMemoryLoad
```

--------------------------------------------------------------------------------

---[FILE: VectorStoreMilvus.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vector_store/VectorStoreMilvus/VectorStoreMilvus.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class VectorStoreMilvus extends createVectorStoreNode<Milvus>({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VectorStoreMilvus
```

--------------------------------------------------------------------------------

---[FILE: VectorStoreMongoDBAtlas.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vector_store/VectorStoreMongoDBAtlas/VectorStoreMongoDBAtlas.node.ts
Signals: N/A
Excerpt (<=80 chars): export const MONGODB_CREDENTIALS = 'mongoDb';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getParameter
- MONGODB_CREDENTIALS
- MONGODB_COLLECTION_NAME
- VECTOR_INDEX_NAME
- EMBEDDING_NAME
- METADATA_FIELD_NAME
- PRE_FILTER_NAME
- POST_FILTER_NAME
- mongoConfig
- getCollectionName
- getVectorIndexName
- getEmbeddingFieldName
- getMetadataFieldName
- VectorStoreMongoDBAtlas
```

--------------------------------------------------------------------------------

---[FILE: VectorStorePGVector.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vector_store/VectorStorePGVector/VectorStorePGVector.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class VectorStorePGVector extends createVectorStoreNode<ExtendedPGVec...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VectorStorePGVector
```

--------------------------------------------------------------------------------

---[FILE: VectorStorePinecone.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vector_store/VectorStorePinecone/VectorStorePinecone.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class VectorStorePinecone extends createVectorStoreNode<PineconeStore>({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VectorStorePinecone
```

--------------------------------------------------------------------------------

---[FILE: VectorStorePineconeInsert.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vector_store/VectorStorePineconeInsert/VectorStorePineconeInsert.node.ts
Signals: N/A
Excerpt (<=80 chars): export class VectorStorePineconeInsert implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VectorStorePineconeInsert
```

--------------------------------------------------------------------------------

---[FILE: VectorStorePineconeLoad.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vector_store/VectorStorePineconeLoad/VectorStorePineconeLoad.node.ts
Signals: N/A
Excerpt (<=80 chars): export class VectorStorePineconeLoad implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VectorStorePineconeLoad
```

--------------------------------------------------------------------------------

---[FILE: Qdrant.utils.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vector_store/VectorStoreQdrant/Qdrant.utils.ts
Signals: N/A
Excerpt (<=80 chars):  export type QdrantCredential = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createQdrantClient
- QdrantCredential
```

--------------------------------------------------------------------------------

---[FILE: VectorStoreQdrant.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vector_store/VectorStoreQdrant/VectorStoreQdrant.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class VectorStoreQdrant extends createVectorStoreNode<ExtendedQdrantV...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VectorStoreQdrant
```

--------------------------------------------------------------------------------

---[FILE: VectorStoreRedis.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vector_store/VectorStoreRedis/VectorStoreRedis.node.ts
Signals: N/A
Excerpt (<=80 chars):  export const redisConfig = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getParameter
- getParameterAsNumber
- redisConfig
- VectorStoreRedis
```

--------------------------------------------------------------------------------

---[FILE: VectorStoreSupabase.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vector_store/VectorStoreSupabase/VectorStoreSupabase.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class VectorStoreSupabase extends createVectorStoreNode<SupabaseVecto...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VectorStoreSupabase
```

--------------------------------------------------------------------------------

---[FILE: VectorStoreSupabaseInsert.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vector_store/VectorStoreSupabaseInsert/VectorStoreSupabaseInsert.node.ts
Signals: N/A
Excerpt (<=80 chars): export class VectorStoreSupabaseInsert implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VectorStoreSupabaseInsert
```

--------------------------------------------------------------------------------

---[FILE: VectorStoreSupabaseLoad.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vector_store/VectorStoreSupabaseLoad/VectorStoreSupabaseLoad.node.ts
Signals: N/A
Excerpt (<=80 chars): export class VectorStoreSupabaseLoad implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VectorStoreSupabaseLoad
```

--------------------------------------------------------------------------------

---[FILE: VectorStoreWeaviate.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vector_store/VectorStoreWeaviate/VectorStoreWeaviate.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class VectorStoreWeaviate extends createVectorStoreNode<ExtendedWeavi...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VectorStoreWeaviate
```

--------------------------------------------------------------------------------

---[FILE: Weaviate.utils.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vector_store/VectorStoreWeaviate/Weaviate.utils.ts
Signals: N/A
Excerpt (<=80 chars):  export type WeaviateCredential = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- parseCompositeFilter
- WeaviateCredential
- WeaviateCompositeFilter
```

--------------------------------------------------------------------------------

---[FILE: VectorStoreZep.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vector_store/VectorStoreZep/VectorStoreZep.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class VectorStoreZep extends createVectorStoreNode<ZepVectorStore | Z...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VectorStoreZep
```

--------------------------------------------------------------------------------

---[FILE: VectorStoreZepInsert.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vector_store/VectorStoreZepInsert/VectorStoreZepInsert.node.ts
Signals: N/A
Excerpt (<=80 chars): export class VectorStoreZepInsert implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VectorStoreZepInsert
```

--------------------------------------------------------------------------------

---[FILE: VectorStoreZepLoad.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vector_store/VectorStoreZepLoad/VectorStoreZepLoad.node.ts
Signals: N/A
Excerpt (<=80 chars): export class VectorStoreZepLoad implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VectorStoreZepLoad
```

--------------------------------------------------------------------------------

---[FILE: Anthropic.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/Anthropic/Anthropic.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Anthropic implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Anthropic
```

--------------------------------------------------------------------------------

---[FILE: node.type.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/Anthropic/actions/node.type.ts
Signals: N/A
Excerpt (<=80 chars):  export type AnthropicType = AllEntities<NodeMap>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AnthropicType
```

--------------------------------------------------------------------------------

---[FILE: analyze.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/Anthropic/actions/document/analyze.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: delete.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/Anthropic/actions/file/delete.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const properties: INodeProperties[] = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: get.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/Anthropic/actions/file/get.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const properties: INodeProperties[] = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: list.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/Anthropic/actions/file/list.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const properties: INodeProperties[] = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: upload.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/Anthropic/actions/file/upload.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const properties: INodeProperties[] = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: analyze.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/Anthropic/actions/image/analyze.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: generate.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/Anthropic/actions/prompt/generate.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: improve.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/Anthropic/actions/prompt/improve.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: templatize.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/Anthropic/actions/prompt/templatize.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: message.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/Anthropic/actions/text/message.operation.ts
Signals: Zod
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: interfaces.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/Anthropic/helpers/interfaces.ts
Signals: Zod
Excerpt (<=80 chars):  export type FileSource =

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FileSource
- Content
- Tool
- Message
- File
- MessagesResponse
- PromptResponse
- TemplatizeResponse
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/Anthropic/helpers/utils.ts
Signals: N/A
Excerpt (<=80 chars):  export function getMimeType(contentType?: string) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getMimeType
- splitByComma
```

--------------------------------------------------------------------------------

---[FILE: GoogleGemini.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/GoogleGemini/GoogleGemini.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class GoogleGemini implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GoogleGemini
```

--------------------------------------------------------------------------------

---[FILE: descriptions.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/GoogleGemini/actions/descriptions.ts
Signals: N/A
Excerpt (<=80 chars):  export const modelRLC = (searchListMethod: string): INodeProperties => ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- modelRLC
```

--------------------------------------------------------------------------------

---[FILE: node.type.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/GoogleGemini/actions/node.type.ts
Signals: N/A
Excerpt (<=80 chars):  export type GoogleGeminiType = AllEntities<NodeMap>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GoogleGeminiType
```

--------------------------------------------------------------------------------

---[FILE: analyze.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/GoogleGemini/actions/audio/analyze.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: transcribe.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/GoogleGemini/actions/audio/transcribe.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: analyze.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/GoogleGemini/actions/document/analyze.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: upload.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/GoogleGemini/actions/file/upload.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const properties: INodeProperties[] = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: createStore.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/GoogleGemini/actions/fileSearch/createStore.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const properties: INodeProperties[] = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: deleteStore.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/GoogleGemini/actions/fileSearch/deleteStore.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const properties: INodeProperties[] = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: listStores.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/GoogleGemini/actions/fileSearch/listStores.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const properties: INodeProperties[] = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: uploadToStore.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/GoogleGemini/actions/fileSearch/uploadToStore.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const properties: INodeProperties[] = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: analyze.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/GoogleGemini/actions/image/analyze.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: edit.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/GoogleGemini/actions/image/edit.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: generate.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/GoogleGemini/actions/image/generate.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: message.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/GoogleGemini/actions/text/message.operation.ts
Signals: Zod
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: analyze.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/GoogleGemini/actions/video/analyze.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: download.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/GoogleGemini/actions/video/download.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: generate.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/GoogleGemini/actions/video/generate.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: interfaces.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/GoogleGemini/helpers/interfaces.ts
Signals: N/A
Excerpt (<=80 chars): export type GenerateContentGenerationConfig = Pick<

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GenerateContentGenerationConfig
- Part
- GenerateContentRequest
- GenerateContentResponse
- Content
- ImagenResponse
- VeoResponse
- FileSearchOperation
- BuiltInTools
- Tool
```

--------------------------------------------------------------------------------

---[FILE: Ollama.node.test.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/Ollama/Ollama.node.test.ts
Signals: Zod
Excerpt (<=80 chars): import { mockDeep } from 'jest-mock-extended';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Ollama.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/Ollama/Ollama.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Ollama implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Ollama
```

--------------------------------------------------------------------------------

---[FILE: node.type.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/Ollama/actions/node.type.ts
Signals: N/A
Excerpt (<=80 chars):  export type OllamaType = AllEntities<NodeMap>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OllamaType
```

--------------------------------------------------------------------------------

---[FILE: analyze.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/Ollama/actions/image/analyze.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: message.operation.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/Ollama/actions/text/message.operation.ts
Signals: Zod
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: interfaces.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/Ollama/helpers/interfaces.ts
Signals: N/A
Excerpt (<=80 chars): export interface OllamaMessage {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OllamaMessage
- ToolCall
- OllamaTool
- OllamaChatResponse
- OllamaModel
- OllamaTagsResponse
```

--------------------------------------------------------------------------------

---[FILE: OpenAi.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/OpenAi/OpenAi.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class OpenAi extends VersionedNodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OpenAi
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/OpenAi/helpers/constants.ts
Signals: N/A
Excerpt (<=80 chars): export const MODELS_NOT_SUPPORT_FUNCTION_CALLS = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MODELS_NOT_SUPPORT_FUNCTION_CALLS
```

--------------------------------------------------------------------------------

---[FILE: description.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/OpenAi/helpers/description.ts
Signals: N/A
Excerpt (<=80 chars):  export const prettifyOperation = (resource: string, operation: string) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- prettifyOperation
- configureNodeInputs
```

--------------------------------------------------------------------------------

---[FILE: error-handling.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/OpenAi/helpers/error-handling.ts
Signals: N/A
Excerpt (<=80 chars):  export function getCustomErrorMessage(errorCode: string): string | undefined {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getCustomErrorMessage
- isOpenAiError
- openAiFailedAttemptHandler
```

--------------------------------------------------------------------------------

---[FILE: interfaces.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/OpenAi/helpers/interfaces.ts
Signals: N/A
Excerpt (<=80 chars):  export type ChatResponse = OpenAIClient.Responses.Response;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ChatResponse
- ChatContent
- ChatInputItem
- WebSearchTool
- ChatTool
- ChatResponseRequest
- ChatCompletion
- ThreadMessage
- ExternalApiCallOptions
- VideoJob
```

--------------------------------------------------------------------------------

---[FILE: modelFiltering.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/vendors/OpenAi/helpers/modelFiltering.ts
Signals: N/A
Excerpt (<=80 chars): export function shouldIncludeModel(modelId: string, isCustomAPI: boolean): bo...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- shouldIncludeModel
```

--------------------------------------------------------------------------------

````
