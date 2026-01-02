---
source_txt: fullstack_samples/n8n-master
converted_utc: 2025-12-18T10:47:15Z
part: 39
parts_total: 51
---

# FULLSTACK CODE DATABASE SAMPLES n8n-master

## Extracted Reusable Patterns (Non-verbatim) (Part 39 of 51)

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

---[FILE: types.ts]---
Location: n8n-master/packages/nodes-base/nodes/Elastic/ElasticSecurity/types.ts
Signals: N/A
Excerpt (<=80 chars): export type ElasticSecurityApiCredentials = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ElasticSecurityApiCredentials
- ConnectorType
- Connector
- ConnectorCreatePayload
```

--------------------------------------------------------------------------------

---[FILE: EmailReadImap.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/EmailReadImap/EmailReadImap.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class EmailReadImap extends VersionedNodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EmailReadImap
```

--------------------------------------------------------------------------------

---[FILE: EmailReadImapV1.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/EmailReadImap/v1/EmailReadImapV1.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class EmailReadImapV1 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EmailReadImapV1
```

--------------------------------------------------------------------------------

---[FILE: EmailReadImapV2.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/EmailReadImap/v2/EmailReadImapV2.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class EmailReadImapV2 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EmailReadImapV2
```

--------------------------------------------------------------------------------

---[FILE: EmailSend.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/EmailSend/EmailSend.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class EmailSend extends VersionedNodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EmailSend
```

--------------------------------------------------------------------------------

---[FILE: EmailSendV1.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/EmailSend/v1/EmailSendV1.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class EmailSendV1 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EmailSendV1
```

--------------------------------------------------------------------------------

---[FILE: EmailSendV2.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/EmailSend/v2/EmailSendV2.node.ts
Signals: N/A
Excerpt (<=80 chars):  export const versionDescription: INodeTypeDescription = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EmailSendV2
```

--------------------------------------------------------------------------------

---[FILE: send.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/EmailSend/v2/send.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/nodes-base/nodes/EmailSend/v2/utils.ts
Signals: N/A
Excerpt (<=80 chars):  export type EmailSendOptions = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- configureTransport
- EmailSendOptions
```

--------------------------------------------------------------------------------

---[FILE: Emelia.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Emelia/Emelia.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Emelia implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Emelia
```

--------------------------------------------------------------------------------

---[FILE: EmeliaTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Emelia/EmeliaTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class EmeliaTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EmeliaTrigger
```

--------------------------------------------------------------------------------

---[FILE: ERPNext.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/ERPNext/ERPNext.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class ERPNext implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ERPNext
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/nodes-base/nodes/ERPNext/utils.ts
Signals: N/A
Excerpt (<=80 chars):  export type DocumentProperties = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- processNames
- toSQL
- DocumentProperties
```

--------------------------------------------------------------------------------

---[FILE: ErrorTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/ErrorTrigger/ErrorTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class ErrorTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ErrorTrigger
```

--------------------------------------------------------------------------------

---[FILE: CannedMetricPrompts.ee.ts]---
Location: n8n-master/packages/nodes-base/nodes/Evaluation/Evaluation/CannedMetricPrompts.ee.ts
Signals: TypeORM
Excerpt (<=80 chars): export const CORRECTNESS_PROMPT = `You are an expert factual evaluator assess...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CORRECTNESS_PROMPT
- HELPFULNESS_PROMPT
```

--------------------------------------------------------------------------------

---[FILE: Evaluation.node.ee.ts]---
Location: n8n-master/packages/nodes-base/nodes/Evaluation/Evaluation/Evaluation.node.ee.ts
Signals: N/A
Excerpt (<=80 chars):  export class Evaluation implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Evaluation
```

--------------------------------------------------------------------------------

---[FILE: EvaluationTrigger.node.ee.ts]---
Location: n8n-master/packages/nodes-base/nodes/Evaluation/EvaluationTrigger/EvaluationTrigger.node.ee.ts
Signals: N/A
Excerpt (<=80 chars):  export const DEFAULT_STARTING_ROW = 2;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DEFAULT_STARTING_ROW
- EvaluationTrigger
```

--------------------------------------------------------------------------------

---[FILE: evaluationTriggerUtils.ts]---
Location: n8n-master/packages/nodes-base/nodes/Evaluation/utils/evaluationTriggerUtils.ts
Signals: N/A
Excerpt (<=80 chars):  export function getGoogleSheet(this: IExecuteFunctions) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getGoogleSheet
```

--------------------------------------------------------------------------------

---[FILE: evaluationUtils.ts]---
Location: n8n-master/packages/nodes-base/nodes/Evaluation/utils/evaluationUtils.ts
Signals: N/A
Excerpt (<=80 chars):  export function toDataTableValue(value: JsonValue): DataTableColumnJsType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- toDataTableValue
- setInputs
- getOutputConnectionTypes
- getInputConnectionTypes
```

--------------------------------------------------------------------------------

---[FILE: metricHandlers.ts]---
Location: n8n-master/packages/nodes-base/nodes/Evaluation/utils/metricHandlers.ts
Signals: Zod
Excerpt (<=80 chars):  export const metricHandlers = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- metricHandlers
```

--------------------------------------------------------------------------------

---[FILE: EventbriteTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Eventbrite/EventbriteTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class EventbriteTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EventbriteTrigger
```

--------------------------------------------------------------------------------

---[FILE: ExecuteCommand.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/ExecuteCommand/ExecuteCommand.node.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IExecReturnData {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExecuteCommand
- IExecReturnData
```

--------------------------------------------------------------------------------

---[FILE: ExecuteWorkflow.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/ExecuteWorkflow/ExecuteWorkflow/ExecuteWorkflow.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class ExecuteWorkflow implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExecuteWorkflow
```

--------------------------------------------------------------------------------

---[FILE: ExecuteWorkflowTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/ExecuteWorkflow/ExecuteWorkflowTrigger/ExecuteWorkflowTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class ExecuteWorkflowTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExecuteWorkflowTrigger
```

--------------------------------------------------------------------------------

---[FILE: ExecutionData.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/ExecutionData/ExecutionData.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class ExecutionData implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExecutionData
```

--------------------------------------------------------------------------------

---[FILE: FacebookGraphApi.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Facebook/FacebookGraphApi.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class FacebookGraphApi implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FacebookGraphApi
```

--------------------------------------------------------------------------------

---[FILE: FacebookTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Facebook/FacebookTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class FacebookTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FacebookTrigger
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Facebook/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function getFields(object: string) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getFields
- getAllFields
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/nodes-base/nodes/Facebook/types.ts
Signals: N/A
Excerpt (<=80 chars): export interface FacebookEvent {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FacebookEvent
- FacebookPageEventEntry
- FacebookWebhookSubscription
```

--------------------------------------------------------------------------------

---[FILE: FacebookLeadAdsTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/FacebookLeadAds/FacebookLeadAdsTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class FacebookLeadAdsTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FacebookLeadAdsTrigger
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/nodes-base/nodes/FacebookLeadAds/types.ts
Signals: N/A
Excerpt (<=80 chars):  export type BaseFacebookResponse<TData> = { data: TData };

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BaseFacebookResponse
- BasePaginatedFacebookResponse
- FacebookAppWebhookSubscriptionsResponse
- FacebookPageListResponse
- FacebookFormListResponse
- FacebookAppWebhookSubscription
- FacebookAppWebhookSubscriptionField
- CreateFacebookAppWebhookSubscription
- FacebookPage
- FacebookPageCategory
- FacebookFormQuestion
- FacebookForm
- FacebookPageEvent
- FacebookPageEventEntry
- FacebookFormLeadData
```

--------------------------------------------------------------------------------

---[FILE: FigmaTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Figma/FigmaTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class FigmaTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FigmaTrigger
```

--------------------------------------------------------------------------------

---[FILE: FileMaker.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/FileMaker/FileMaker.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class FileMaker implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FileMaker
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/FileMaker/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function parseSort(this: IExecuteFunctions, i: number): object | null {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- parseSort
- parseScripts
- parsePortals
- parseQuery
- parseFields
```

--------------------------------------------------------------------------------

---[FILE: ConvertToFile.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Files/ConvertToFile/ConvertToFile.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class ConvertToFile implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ConvertToFile
```

--------------------------------------------------------------------------------

---[FILE: spreadsheet.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Files/ConvertToFile/actions/spreadsheet.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const operations = ['csv', 'html', 'rtf', 'ods', 'xls', 'xlsx'];

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- operations
- description
```

--------------------------------------------------------------------------------

---[FILE: toBinary.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Files/ConvertToFile/actions/toBinary.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const properties: INodeProperties[] = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: toJson.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Files/ConvertToFile/actions/toJson.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const properties: INodeProperties[] = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: toText.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Files/ConvertToFile/actions/toText.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const properties: INodeProperties[] = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: ExtractFromFile.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Files/ExtractFromFile/ExtractFromFile.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class ExtractFromFile implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExtractFromFile
```

--------------------------------------------------------------------------------

---[FILE: moveTo.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Files/ExtractFromFile/actions/moveTo.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const properties: INodeProperties[] = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: pdf.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Files/ExtractFromFile/actions/pdf.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const properties: INodeProperties[] = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: spreadsheet.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Files/ExtractFromFile/actions/spreadsheet.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const operations = ['csv', 'html', 'rtf', 'ods', 'xls', 'xlsx'];

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- operations
```

--------------------------------------------------------------------------------

---[FILE: ReadWriteFile.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Files/ReadWriteFile/ReadWriteFile.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class ReadWriteFile implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ReadWriteFile
```

--------------------------------------------------------------------------------

---[FILE: read.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Files/ReadWriteFile/actions/read.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const properties: INodeProperties[] = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: write.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Files/ReadWriteFile/actions/write.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const properties: INodeProperties[] = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/nodes-base/nodes/Files/ReadWriteFile/helpers/utils.ts
Signals: N/A
Excerpt (<=80 chars):  export function errorMapper(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- errorMapper
- escapeSpecialCharacters
- normalizeFileSelector
```

--------------------------------------------------------------------------------

---[FILE: Filter.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Filter/Filter.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Filter extends VersionedNodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Filter
```

--------------------------------------------------------------------------------

---[FILE: FilterV1.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Filter/V1/FilterV1.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class FilterV1 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FilterV1
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Filter/V1/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export const compareOperationFunctions: {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- convertDateTime
```

--------------------------------------------------------------------------------

---[FILE: FilterV2.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Filter/V2/FilterV2.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class FilterV2 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FilterV2
```

--------------------------------------------------------------------------------

---[FILE: Flow.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Flow/Flow.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Flow implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Flow
```

--------------------------------------------------------------------------------

---[FILE: FlowTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Flow/FlowTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class FlowTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FlowTrigger
```

--------------------------------------------------------------------------------

---[FILE: TaskInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/Flow/TaskInterface.ts
Signals: N/A
Excerpt (<=80 chars): export interface ITask {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ITask
- TaskInfo
```

--------------------------------------------------------------------------------

---[FILE: common.descriptions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Form/common.descriptions.ts
Signals: N/A
Excerpt (<=80 chars):  export const placeholder: string = `

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- formTriggerPanel
```

--------------------------------------------------------------------------------

---[FILE: cssVariables.ts]---
Location: n8n-master/packages/nodes-base/nodes/Form/cssVariables.ts
Signals: N/A
Excerpt (<=80 chars): export const cssVariables = `

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- cssVariables
```

--------------------------------------------------------------------------------

---[FILE: Form.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Form/Form.node.ts
Signals: N/A
Excerpt (<=80 chars):  export const formFieldsProperties: INodeProperties[] = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Form
```

--------------------------------------------------------------------------------

---[FILE: FormTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Form/FormTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class FormTrigger extends VersionedNodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FormTrigger
```

--------------------------------------------------------------------------------

---[FILE: interfaces.ts]---
Location: n8n-master/packages/nodes-base/nodes/Form/interfaces.ts
Signals: N/A
Excerpt (<=80 chars):  export type FormField = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FORM_TRIGGER_AUTHENTICATION_PROPERTY
- FormField
- FormTriggerData
```

--------------------------------------------------------------------------------

---[FILE: Form.node.test.ts]---
Location: n8n-master/packages/nodes-base/nodes/Form/test/Form.node.test.ts
Signals: Express
Excerpt (<=80 chars): import type { Response, Request } from 'express';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: formCompletionUtils.test.ts]---
Location: n8n-master/packages/nodes-base/nodes/Form/test/formCompletionUtils.test.ts
Signals: Express
Excerpt (<=80 chars): import { type Response } from 'express';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: formNodeUtils.test.ts]---
Location: n8n-master/packages/nodes-base/nodes/Form/test/formNodeUtils.test.ts
Signals: Express
Excerpt (<=80 chars): import { type Response } from 'express';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: utils.test.ts]---
Location: n8n-master/packages/nodes-base/nodes/Form/test/utils.test.ts
Signals: Express
Excerpt (<=80 chars): import type { Request } from 'express';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: formCompletionUtils.ts]---
Location: n8n-master/packages/nodes-base/nodes/Form/utils/formCompletionUtils.ts
Signals: Express
Excerpt (<=80 chars):  export const binaryResponse = async (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- binaryResponse
- renderFormCompletion
```

--------------------------------------------------------------------------------

---[FILE: formNodeUtils.ts]---
Location: n8n-master/packages/nodes-base/nodes/Form/utils/formNodeUtils.ts
Signals: Express
Excerpt (<=80 chars):  export const renderFormNode = async (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getFormTriggerNode
- renderFormNode
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/nodes-base/nodes/Form/utils/utils.ts
Signals: Express
Excerpt (<=80 chars):  export function sanitizeHtml(text: string) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- sanitizeHtml
- sanitizeCustomCss
- validateSafeRedirectUrl
- createDescriptionMetadata
- prepareFormData
- addFormResponseDataToReturnItem
- renderForm
- resolveRawData
- prepareFormFields
- validateResponseModeConfiguration
- isFormConnected
```

--------------------------------------------------------------------------------

---[FILE: FormTriggerV1.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Form/v1/FormTriggerV1.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class FormTriggerV1 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FormTriggerV1
```

--------------------------------------------------------------------------------

---[FILE: FormTriggerV2.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Form/v2/FormTriggerV2.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class FormTriggerV2 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FormTriggerV2
```

--------------------------------------------------------------------------------

---[FILE: FormIoTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/FormIo/FormIoTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class FormIoTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FormIoTrigger
```

--------------------------------------------------------------------------------

---[FILE: FormstackTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Formstack/FormstackTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class FormstackTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FormstackTrigger
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Formstack/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IFormstackFieldDefinitionType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FormstackFieldFormats
- FormstackFieldFormat
- IFormstackFieldDefinitionType
- IFormstackWebhookResponseBody
- IFormstackSubmissionFieldContainer
```

--------------------------------------------------------------------------------

---[FILE: ContactInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/Freshdesk/ContactInterface.ts
Signals: N/A
Excerpt (<=80 chars):  export interface ICreateContactBody {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ICreateContactBody
```

--------------------------------------------------------------------------------

---[FILE: Freshdesk.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Freshdesk/Freshdesk.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Freshdesk implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Freshdesk
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Freshdesk/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function validateJSON(json: string | undefined): any {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- validateJSON
- capitalize
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: n8n-master/packages/nodes-base/nodes/Freshservice/constants.ts
Signals: N/A
Excerpt (<=80 chars):  export const LANGUAGES = Object.keys(RAW_LANGUAGES).map((key) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LANGUAGES
```

--------------------------------------------------------------------------------

---[FILE: Freshservice.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Freshservice/Freshservice.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Freshservice implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Freshservice
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Freshservice/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export const toOptions = (loadedResources: LoadedResource[]) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- validateAssignmentScopeGroup
- sanitizeAssignmentScopeGroup
- adjustAgentRoles
- formatFilters
- validateUpdateFields
- adjustAddress
- toOptions
- toUserOptions
- toArray
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/nodes-base/nodes/Freshservice/types.ts
Signals: N/A
Excerpt (<=80 chars):  export type FreshserviceCredentials = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FreshserviceCredentials
- LoadedResource
- LoadedUser
- RolesParameter
- AddressFixedCollection
```

--------------------------------------------------------------------------------

---[FILE: FreshworksCrm.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/FreshworksCrm/FreshworksCrm.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class FreshworksCrm implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FreshworksCrm
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/FreshworksCrm/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function adjustAttendees(attendees: [{ type: string; contactId: strin...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- adjustAttendees
- adjustAccounts
- throwOnEmptyUpdate
- throwOnEmptyFilter
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/nodes-base/nodes/FreshworksCrm/types.ts
Signals: N/A
Excerpt (<=80 chars): export type FreshworksCrmApiCredentials = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FreshworksCrmApiCredentials
- FreshworksConfigResponse
- LoadedResource
- LoadOption
- LoadedCurrency
- LoadedUser
- SalesAccounts
- ViewsResponse
- View
```

--------------------------------------------------------------------------------

---[FILE: Ftp.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Ftp/Ftp.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Ftp implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Ftp
```

--------------------------------------------------------------------------------

---[FILE: Function.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Function/Function.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Function implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Function
```

--------------------------------------------------------------------------------

---[FILE: FunctionItem.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/FunctionItem/FunctionItem.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class FunctionItem implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FunctionItem
```

--------------------------------------------------------------------------------

---[FILE: GetResponse.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/GetResponse/GetResponse.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class GetResponse implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetResponse
```

--------------------------------------------------------------------------------

---[FILE: GetResponseTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/GetResponse/GetResponseTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class GetResponseTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetResponseTrigger
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Ghost/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function validateJSON(json: string | undefined): any {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- validateJSON
```

--------------------------------------------------------------------------------

---[FILE: Ghost.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Ghost/Ghost.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Ghost implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Ghost
```

--------------------------------------------------------------------------------

---[FILE: Git.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Git/Git.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Git implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Git
```

--------------------------------------------------------------------------------

---[FILE: AddConfigDescription.ts]---
Location: n8n-master/packages/nodes-base/nodes/Git/descriptions/AddConfigDescription.ts
Signals: N/A
Excerpt (<=80 chars):  export const ALLOWED_CONFIG_KEYS = ['user.email', 'user.name', 'remote.origi...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ALLOWED_CONFIG_KEYS
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Github/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function isBase64(content: string) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isBase64
- validateJSON
```

--------------------------------------------------------------------------------

---[FILE: Github.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Github/Github.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Github implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Github
```

--------------------------------------------------------------------------------

---[FILE: GithubTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Github/GithubTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class GithubTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GithubTrigger
```

--------------------------------------------------------------------------------

---[FILE: Gitlab.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Gitlab/Gitlab.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Gitlab implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Gitlab
```

--------------------------------------------------------------------------------

---[FILE: GitlabTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Gitlab/GitlabTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class GitlabTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GitlabTrigger
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Gong/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export const extractCalls = (items: INodeExecutionData[]): INodeExecutionDat...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isValidNumberIds
- extractCalls
- extractUsers
- getCursorPaginatorCalls
- getCursorPaginatorUsers
```

--------------------------------------------------------------------------------

---[FILE: Gong.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Gong/Gong.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Gong implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Gong
```

--------------------------------------------------------------------------------

---[FILE: mocks.ts]---
Location: n8n-master/packages/nodes-base/nodes/Gong/test/mocks.ts
Signals: N/A
Excerpt (<=80 chars): export const gongApiResponse = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- gongApiResponse
- gongNodeResponse
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/constants.ts
Signals: N/A
Excerpt (<=80 chars): export const GOOGLE_DRIVE_FILE_URL_REGEX =

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GOOGLE_DRIVE_FILE_URL_REGEX
- GOOGLE_DRIVE_FOLDER_URL_REGEX
- GOOGLE_SHEETS_SHEET_URL_REGEX
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function validateAndSetDate(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- validateAndSetDate
```

--------------------------------------------------------------------------------

---[FILE: GoogleAds.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Ads/GoogleAds.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class GoogleAds implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GoogleAds
```

--------------------------------------------------------------------------------

````
