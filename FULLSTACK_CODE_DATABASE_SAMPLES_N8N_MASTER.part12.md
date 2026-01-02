---
source_txt: fullstack_samples/n8n-master
converted_utc: 2025-12-18T10:47:15Z
part: 12
parts_total: 51
---

# FULLSTACK CODE DATABASE SAMPLES n8n-master

## Extracted Reusable Patterns (Non-verbatim) (Part 12 of 51)

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

---[FILE: Guardrails.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/Guardrails/Guardrails.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Guardrails extends VersionedNodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Guardrails
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/Guardrails/actions/types.ts
Signals: N/A
Excerpt (<=80 chars):  export interface GuardrailResult<TInfo extends Record<string, unknown> = Rec...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GuardrailError
- LLMConfig
- CheckFn
- CreateCheckFn
- CustomRegex
- GroupedGuardrailResults
- GuardrailResult
- GuardrailsOptions
- GuardrailUserResult
- StageGuardRails
```

--------------------------------------------------------------------------------

---[FILE: jailbreak.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/Guardrails/actions/checks/jailbreak.ts
Signals: N/A
Excerpt (<=80 chars): export const JAILBREAK_PROMPT = `You are a security system designed to detect...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- JAILBREAK_PROMPT
```

--------------------------------------------------------------------------------

---[FILE: nsfw.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/Guardrails/actions/checks/nsfw.ts
Signals: N/A
Excerpt (<=80 chars):  export const NSFW_SYSTEM_PROMPT = `

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NSFW_SYSTEM_PROMPT
```

--------------------------------------------------------------------------------

---[FILE: pii.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/Guardrails/actions/checks/pii.ts
Signals: N/A
Excerpt (<=80 chars):  export type PIIConfig = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PIIConfig
- CustomRegexConfig
```

--------------------------------------------------------------------------------

---[FILE: secretKeys.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/Guardrails/actions/checks/secretKeys.ts
Signals: N/A
Excerpt (<=80 chars):  export type SecretKeysConfig = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- secretKeysCheck
- SecretKeysConfig
```

--------------------------------------------------------------------------------

---[FILE: topicalAlignment.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/Guardrails/actions/checks/topicalAlignment.ts
Signals: N/A
Excerpt (<=80 chars):  export const TOPICAL_ALIGNMENT_SYSTEM_PROMPT = `You are a content analysis s...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TOPICAL_ALIGNMENT_SYSTEM_PROMPT
```

--------------------------------------------------------------------------------

---[FILE: urls.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/Guardrails/actions/checks/urls.ts
Signals: N/A
Excerpt (<=80 chars):  export type UrlsConfig = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- urls
- UrlsConfig
```

--------------------------------------------------------------------------------

---[FILE: common.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/Guardrails/helpers/common.ts
Signals: N/A
Excerpt (<=80 chars): export const splitByComma = (str: string) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- splitByComma
- parseRegex
```

--------------------------------------------------------------------------------

---[FILE: configureNodeInputs.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/Guardrails/helpers/configureNodeInputs.ts
Signals: N/A
Excerpt (<=80 chars):  export const hasLLMGuardrails = (guardrails: GuardrailsOptions) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- hasLLMGuardrails
- configureNodeInputsV2
- configureNodeInputsV1
```

--------------------------------------------------------------------------------

---[FILE: mappers.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/Guardrails/helpers/mappers.ts
Signals: N/A
Excerpt (<=80 chars):  export const mapGuardrailResultToUserResult = (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mapGuardrailResultToUserResult
- mapGuardrailErrorsToMessage
- wrapResultsToNodeExecutionData
```

--------------------------------------------------------------------------------

---[FILE: model.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/Guardrails/helpers/model.ts
Signals: Zod
Excerpt (<=80 chars):  export const LLM_SYSTEM_RULES = `Only respond with the json object and nothi...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LLM_SYSTEM_RULES
- createLLMCheckFn
```

--------------------------------------------------------------------------------

---[FILE: preflight.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/Guardrails/helpers/preflight.ts
Signals: N/A
Excerpt (<=80 chars):  export function applyPreflightModifications(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- applyPreflightModifications
```

--------------------------------------------------------------------------------

---[FILE: GuardrailsV1.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/Guardrails/v1/GuardrailsV1.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class GuardrailsV1 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GuardrailsV1
```

--------------------------------------------------------------------------------

---[FILE: GuardrailsV2.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/Guardrails/v2/GuardrailsV2.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class GuardrailsV2 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GuardrailsV2
```

--------------------------------------------------------------------------------

---[FILE: n8nDefaultFailedAttemptHandler.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/llms/n8nDefaultFailedAttemptHandler.ts
Signals: N/A
Excerpt (<=80 chars): export const n8nDefaultFailedAttemptHandler = (error: any) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- n8nDefaultFailedAttemptHandler
```

--------------------------------------------------------------------------------

---[FILE: n8nLlmFailedAttemptHandler.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/llms/n8nLlmFailedAttemptHandler.ts
Signals: N/A
Excerpt (<=80 chars): export const makeN8nLlmFailedAttemptHandler = (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- makeN8nLlmFailedAttemptHandler
```

--------------------------------------------------------------------------------

---[FILE: N8nLlmTracing.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/llms/N8nLlmTracing.ts
Signals: N/A
Excerpt (<=80 chars): export class N8nLlmTracing extends BaseCallbackHandler {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- N8nLlmTracing
```

--------------------------------------------------------------------------------

---[FILE: N8nNonEstimatingTracing.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/llms/N8nNonEstimatingTracing.ts
Signals: N/A
Excerpt (<=80 chars):  export class N8nNonEstimatingTracing extends BaseCallbackHandler {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- N8nNonEstimatingTracing
```

--------------------------------------------------------------------------------

---[FILE: additional-options.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/llms/gemini-common/additional-options.ts
Signals: N/A
Excerpt (<=80 chars):  export function getAdditionalOptions({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getAdditionalOptions
```

--------------------------------------------------------------------------------

---[FILE: LmChatAnthropic.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/llms/LMChatAnthropic/LmChatAnthropic.node.ts
Signals: N/A
Excerpt (<=80 chars): export class LmChatAnthropic implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LmChatAnthropic
```

--------------------------------------------------------------------------------

---[FILE: searchModels.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/llms/LMChatAnthropic/methods/searchModels.ts
Signals: N/A
Excerpt (<=80 chars):  export interface AnthropicModel {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AnthropicModel
```

--------------------------------------------------------------------------------

---[FILE: LmChatAwsBedrock.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/llms/LmChatAwsBedrock/LmChatAwsBedrock.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class LmChatAwsBedrock implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LmChatAwsBedrock
```

--------------------------------------------------------------------------------

---[FILE: LmChatAzureOpenAi.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/llms/LmChatAzureOpenAi/LmChatAzureOpenAi.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class LmChatAzureOpenAi implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LmChatAzureOpenAi
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/llms/LmChatAzureOpenAi/types.ts
Signals: N/A
Excerpt (<=80 chars): export interface AzureOpenAIConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AzureEntraCognitiveServicesOAuth2ApiCredential
- AzureOpenAIConfig
- AzureOpenAIApiKeyConfig
- AzureOpenAIOptions
- AzureOpenAIBaseModelConfig
- AzureOpenAIApiKeyModelConfig
- AzureOpenAIOAuth2ModelConfig
```

--------------------------------------------------------------------------------

---[FILE: N8nOAuth2TokenCredential.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/llms/LmChatAzureOpenAi/credentials/N8nOAuth2TokenCredential.ts
Signals: N/A
Excerpt (<=80 chars): export class N8nOAuth2TokenCredential implements TokenCredential {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- N8nOAuth2TokenCredential
```

--------------------------------------------------------------------------------

---[FILE: LmChatCohere.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/llms/LmChatCohere/LmChatCohere.node.ts
Signals: N/A
Excerpt (<=80 chars):  export function tokensUsageParser(result: LLMResult): {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- tokensUsageParser
- LmChatCohere
```

--------------------------------------------------------------------------------

---[FILE: LmChatDeepSeek.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/llms/LmChatDeepSeek/LmChatDeepSeek.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class LmChatDeepSeek implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LmChatDeepSeek
```

--------------------------------------------------------------------------------

---[FILE: LmChatGoogleGemini.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/llms/LmChatGoogleGemini/LmChatGoogleGemini.node.ts
Signals: N/A
Excerpt (<=80 chars): export class LmChatGoogleGemini implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LmChatGoogleGemini
```

--------------------------------------------------------------------------------

---[FILE: error-handling.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/llms/LmChatGoogleVertex/error-handling.ts
Signals: N/A
Excerpt (<=80 chars): export interface ErrorLike {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- makeErrorFromStatus
- ErrorLike
- ErrorContext
```

--------------------------------------------------------------------------------

---[FILE: LmChatGoogleVertex.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/llms/LmChatGoogleVertex/LmChatGoogleVertex.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class LmChatGoogleVertex implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LmChatGoogleVertex
```

--------------------------------------------------------------------------------

---[FILE: LmChatGroq.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/llms/LmChatGroq/LmChatGroq.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class LmChatGroq implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LmChatGroq
```

--------------------------------------------------------------------------------

---[FILE: LmChatLemonade.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/llms/LMChatLemonade/LmChatLemonade.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class LmChatLemonade implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LmChatLemonade
```

--------------------------------------------------------------------------------

---[FILE: LmChatMistralCloud.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/llms/LmChatMistralCloud/LmChatMistralCloud.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class LmChatMistralCloud implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LmChatMistralCloud
```

--------------------------------------------------------------------------------

---[FILE: LmChatOllama.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/llms/LMChatOllama/LmChatOllama.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class LmChatOllama implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LmChatOllama
```

--------------------------------------------------------------------------------

---[FILE: common.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/llms/LMChatOpenAi/common.ts
Signals: N/A
Excerpt (<=80 chars):  export const formatBuiltInTools = (builtInTools: BuiltInTools) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- formatBuiltInTools
- prepareAdditionalResponsesParams
```

--------------------------------------------------------------------------------

---[FILE: LmChatOpenAi.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/llms/LMChatOpenAi/LmChatOpenAi.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class LmChatOpenAi implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LmChatOpenAi
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/llms/LMChatOpenAi/types.ts
Signals: N/A
Excerpt (<=80 chars):  export type BuiltInTools = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BuiltInTools
- ModelOptions
- PromptOptions
- TextOptions
- ChatResponseRequest
```

--------------------------------------------------------------------------------

---[FILE: LmChatOpenRouter.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/llms/LmChatOpenRouter/LmChatOpenRouter.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class LmChatOpenRouter implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LmChatOpenRouter
```

--------------------------------------------------------------------------------

---[FILE: LmChatVercelAiGateway.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/llms/LmChatVercelAiGateway/LmChatVercelAiGateway.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class LmChatVercelAiGateway implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LmChatVercelAiGateway
```

--------------------------------------------------------------------------------

---[FILE: LmChatXAiGrok.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/llms/LmChatXAiGrok/LmChatXAiGrok.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class LmChatXAiGrok implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LmChatXAiGrok
```

--------------------------------------------------------------------------------

---[FILE: LmCohere.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/llms/LMCohere/LmCohere.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class LmCohere implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LmCohere
```

--------------------------------------------------------------------------------

---[FILE: LmLemonade.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/llms/LMLemonade/LmLemonade.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class LmLemonade implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LmLemonade
```

--------------------------------------------------------------------------------

---[FILE: LmOllama.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/llms/LMOllama/LmOllama.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class LmOllama implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LmOllama
```

--------------------------------------------------------------------------------

---[FILE: LmOpenAi.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/llms/LMOpenAi/LmOpenAi.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class LmOpenAi implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LmOpenAi
```

--------------------------------------------------------------------------------

---[FILE: LmOpenHuggingFaceInference.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/llms/LMOpenHuggingFaceInference/LmOpenHuggingFaceInference.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class LmOpenHuggingFaceInference implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LmOpenHuggingFaceInference
```

--------------------------------------------------------------------------------

---[FILE: McpClient.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/mcp/McpClient/McpClient.node.ts
Signals: Zod
Excerpt (<=80 chars):  export class McpClient implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- McpClient
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/mcp/McpClient/utils.ts
Signals: N/A
Excerpt (<=80 chars):  export function jsonSchemaTypeToDefaultValue(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- jsonSchemaTypeToDefaultValue
- jsonSchemaTypeToFieldType
- convertJsonSchemaToResourceMapperFields
```

--------------------------------------------------------------------------------

---[FILE: McpClientTool.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/mcp/McpClientTool/McpClientTool.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class McpClientTool implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- McpClientTool
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/mcp/McpClientTool/types.ts
Signals: N/A
Excerpt (<=80 chars): export type McpToolIncludeMode = 'all' | 'selected' | 'except';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- McpToolIncludeMode
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/mcp/McpClientTool/utils.ts
Signals: Zod
Excerpt (<=80 chars):  export function getSelectedTools({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getSelectedTools
- mcpToolToDynamicTool
- getErrorDescriptionFromToolCall
- createCallTool
- McpToolkit
```

--------------------------------------------------------------------------------

---[FILE: FlushingTransport.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/mcp/McpTrigger/FlushingTransport.ts
Signals: Express
Excerpt (<=80 chars):  export type CompressionResponse = Response & {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FlushingSSEServerTransport
- FlushingStreamableHTTPTransport
- CompressionResponse
```

--------------------------------------------------------------------------------

---[FILE: McpServer.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/mcp/McpTrigger/McpServer.ts
Signals: Express, Zod
Excerpt (<=80 chars): export class McpServerManager {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- McpServerManager
```

--------------------------------------------------------------------------------

---[FILE: McpTrigger.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/mcp/McpTrigger/McpTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class McpTrigger extends Node {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- McpTrigger
```

--------------------------------------------------------------------------------

---[FILE: McpServer.test.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/mcp/McpTrigger/__test__/McpServer.test.ts
Signals: Express
Excerpt (<=80 chars): import type { Tool } from '@langchain/core/tools';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: McpTrigger.node.test.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/mcp/McpTrigger/__test__/McpTrigger.node.test.ts
Signals: Express
Excerpt (<=80 chars): import type { Tool } from '@langchain/core/tools';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: descriptions.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/mcp/shared/descriptions.ts
Signals: N/A
Excerpt (<=80 chars):  export const transportSelect = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- transportSelect
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/mcp/shared/types.ts
Signals: N/A
Excerpt (<=80 chars):  export type McpTool = { name: string; description?: string; inputSchema: JSO...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- McpTool
- McpServerTransport
- McpAuthenticationOption
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/mcp/shared/utils.ts
Signals: N/A
Excerpt (<=80 chars):  export function mapToNodeOperationError(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mapToNodeOperationError
```

--------------------------------------------------------------------------------

---[FILE: descriptions.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/memory/descriptions.ts
Signals: N/A
Excerpt (<=80 chars):  export const sessionIdOption: INodeProperties = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- expressionSessionKeyProperty
```

--------------------------------------------------------------------------------

---[FILE: MemoryBufferWindow.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/memory/MemoryBufferWindow/MemoryBufferWindow.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class MemoryBufferWindow implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MemoryBufferWindow
```

--------------------------------------------------------------------------------

---[FILE: MemoryChatRetriever.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/memory/MemoryChatRetriever/MemoryChatRetriever.node.ts
Signals: N/A
Excerpt (<=80 chars): export class MemoryChatRetriever implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MemoryChatRetriever
```

--------------------------------------------------------------------------------

---[FILE: MemoryManager.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/memory/MemoryManager/MemoryManager.node.ts
Signals: N/A
Excerpt (<=80 chars):  export function simplifyMessages(messages: BaseMessage[]): Array<Record<stri...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- simplifyMessages
- MemoryManager
```

--------------------------------------------------------------------------------

---[FILE: MemoryMongoDbChat.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/memory/MemoryMongoDbChat/MemoryMongoDbChat.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class MemoryMongoDbChat implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MemoryMongoDbChat
```

--------------------------------------------------------------------------------

---[FILE: MemoryMotorhead.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/memory/MemoryMotorhead/MemoryMotorhead.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class MemoryMotorhead implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MemoryMotorhead
```

--------------------------------------------------------------------------------

---[FILE: MemoryPostgresChat.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/memory/MemoryPostgresChat/MemoryPostgresChat.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class MemoryPostgresChat implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MemoryPostgresChat
```

--------------------------------------------------------------------------------

---[FILE: MemoryRedisChat.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/memory/MemoryRedisChat/MemoryRedisChat.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class MemoryRedisChat implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MemoryRedisChat
```

--------------------------------------------------------------------------------

---[FILE: MemoryXata.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/memory/MemoryXata/MemoryXata.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class MemoryXata implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MemoryXata
```

--------------------------------------------------------------------------------

---[FILE: MemoryZep.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/memory/MemoryZep/MemoryZep.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class MemoryZep implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MemoryZep
```

--------------------------------------------------------------------------------

---[FILE: helpers.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/ModelSelector/helpers.ts
Signals: N/A
Excerpt (<=80 chars):  export const numberInputsProperty: INodeProperties = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- configuredInputs
```

--------------------------------------------------------------------------------

---[FILE: ModelSelector.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/ModelSelector/ModelSelector.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class ModelSelector implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ModelSelector
```

--------------------------------------------------------------------------------

---[FILE: OutputParserAutofixing.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/output_parser/OutputParserAutofixing/OutputParserAutofixing.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class OutputParserAutofixing implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OutputParserAutofixing
```

--------------------------------------------------------------------------------

---[FILE: prompt.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/output_parser/OutputParserAutofixing/prompt.ts
Signals: N/A
Excerpt (<=80 chars): export const NAIVE_FIX_PROMPT = `Instructions:

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NAIVE_FIX_PROMPT
```

--------------------------------------------------------------------------------

---[FILE: OutputParserItemList.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/output_parser/OutputParserItemList/OutputParserItemList.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class OutputParserItemList implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OutputParserItemList
```

--------------------------------------------------------------------------------

---[FILE: OutputParserStructured.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/output_parser/OutputParserStructured/OutputParserStructured.node.ts
Signals: Zod
Excerpt (<=80 chars):  export class OutputParserStructured implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OutputParserStructured
```

--------------------------------------------------------------------------------

---[FILE: prompt.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/output_parser/OutputParserStructured/prompt.ts
Signals: N/A
Excerpt (<=80 chars): export const NAIVE_FIX_PROMPT = `Instructions:

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NAIVE_FIX_PROMPT
```

--------------------------------------------------------------------------------

---[FILE: RerankerCohere.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/rerankers/RerankerCohere/RerankerCohere.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class RerankerCohere implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RerankerCohere
```

--------------------------------------------------------------------------------

---[FILE: RetrieverContextualCompression.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/retrievers/RetrieverContextualCompression/RetrieverContextualCompression.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class RetrieverContextualCompression implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RetrieverContextualCompression
```

--------------------------------------------------------------------------------

---[FILE: RetrieverMultiQuery.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/retrievers/RetrieverMultiQuery/RetrieverMultiQuery.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class RetrieverMultiQuery implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RetrieverMultiQuery
```

--------------------------------------------------------------------------------

---[FILE: RetrieverVectorStore.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/retrievers/RetrieverVectorStore/RetrieverVectorStore.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class RetrieverVectorStore implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RetrieverVectorStore
```

--------------------------------------------------------------------------------

---[FILE: RetrieverWorkflow.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/retrievers/RetrieverWorkflow/RetrieverWorkflow.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class RetrieverWorkflow implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RetrieverWorkflow
```

--------------------------------------------------------------------------------

---[FILE: TextSplitterCharacterTextSplitter.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/text_splitters/TextSplitterCharacterTextSplitter/TextSplitterCharacterTextSplitter.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class TextSplitterCharacterTextSplitter implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TextSplitterCharacterTextSplitter
```

--------------------------------------------------------------------------------

---[FILE: TextSplitterRecursiveCharacterTextSplitter.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/text_splitters/TextSplitterRecursiveCharacterTextSplitter/TextSplitterRecursiveCharacterTextSplitter.node.ts
Signals: N/A
Excerpt (<=80 chars): export class TextSplitterRecursiveCharacterTextSplitter implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TextSplitterRecursiveCharacterTextSplitter
```

--------------------------------------------------------------------------------

---[FILE: TextSplitterTokenSplitter.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/text_splitters/TextSplitterTokenSplitter/TextSplitterTokenSplitter.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class TextSplitterTokenSplitter implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TextSplitterTokenSplitter
```

--------------------------------------------------------------------------------

---[FILE: TokenTextSplitter.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/text_splitters/TextSplitterTokenSplitter/TokenTextSplitter.ts
Signals: N/A
Excerpt (<=80 chars): export class TokenTextSplitter extends TextSplitter implements TokenTextSplit...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TokenTextSplitter
```

--------------------------------------------------------------------------------

---[FILE: ToolExecutor.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/ToolExecutor/ToolExecutor.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class ToolExecutor implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ToolExecutor
```

--------------------------------------------------------------------------------

---[FILE: convertToSchema.test.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/ToolExecutor/test/convertToSchema.test.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ToolExecutor.node.test.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/ToolExecutor/test/ToolExecutor.node.test.ts
Signals: Zod
Excerpt (<=80 chars): import { DynamicTool, DynamicStructuredTool } from '@langchain/core/tools';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: convertToSchema.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/ToolExecutor/utils/convertToSchema.ts
Signals: Zod
Excerpt (<=80 chars):  export const convertValueBySchema = (value: unknown, schema: any): unknown => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- convertValueBySchema
- convertObjectBySchema
```

--------------------------------------------------------------------------------

---[FILE: ToolCalculator.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/tools/ToolCalculator/ToolCalculator.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class ToolCalculator implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ToolCalculator
```

--------------------------------------------------------------------------------

---[FILE: ToolCode.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/tools/ToolCode/ToolCode.node.ts
Signals: Zod
Excerpt (<=80 chars):  export class ToolCode implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ToolCode
```

--------------------------------------------------------------------------------

---[FILE: interfaces.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/tools/ToolHttpRequest/interfaces.ts
Signals: N/A
Excerpt (<=80 chars): export type ToolParameter = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ToolParameter
- PlaceholderDefinition
- ParametersValues
- ParameterInputType
- SendIn
```

--------------------------------------------------------------------------------

---[FILE: ToolHttpRequest.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/tools/ToolHttpRequest/ToolHttpRequest.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class ToolHttpRequest implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ToolHttpRequest
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/tools/ToolHttpRequest/utils.ts
Signals: Zod
Excerpt (<=80 chars):  export const configureHttpRequestFunction = async (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- makeToolInputSchema
- configureHttpRequestFunction
- configureResponseOptimizer
- extractParametersFromText
- updateParametersAndOptions
- prepareToolDescription
- configureToolFunction
```

--------------------------------------------------------------------------------

---[FILE: ToolSearXng.node.ts]---
Location: n8n-master/packages/@n8n/nodes-langchain/nodes/tools/ToolSearXng/ToolSearXng.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class ToolSearXng implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ToolSearXng
```

--------------------------------------------------------------------------------

````
