---
source_txt: fullstack_samples/n8n-master
converted_utc: 2025-12-18T10:47:15Z
part: 41
parts_total: 51
---

# FULLSTACK CODE DATABASE SAMPLES n8n-master

## Extracted Reusable Patterns (Non-verbatim) (Part 41 of 51)

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

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Grist/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function parseSortProperties(sortProperties: GristSortProperties) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- parseSortProperties
- isSafeInteger
- parseFilterProperties
- parseDefinedFields
- parseAutoMappedInputs
- throwOnZeroDefinedFields
```

--------------------------------------------------------------------------------

---[FILE: Grist.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Grist/Grist.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Grist implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Grist
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/nodes-base/nodes/Grist/types.ts
Signals: N/A
Excerpt (<=80 chars): export type GristCredentials = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GristCredentials
- GristColumns
- GristSortProperties
- GristFilterProperties
- GristGetAllOptions
- GristDefinedFields
- GristCreateRowPayload
- GristUpdateRowPayload
- SendingOptions
- FieldsToSend
```

--------------------------------------------------------------------------------

---[FILE: GumroadTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Gumroad/GumroadTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class GumroadTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GumroadTrigger
```

--------------------------------------------------------------------------------

---[FILE: HackerNews.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/HackerNews/HackerNews.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class HackerNews implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HackerNews
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/HaloPSA/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function simplifyHaloPSAGetOutput(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- simplifyHaloPSAGetOutput
- qsSetStatus
```

--------------------------------------------------------------------------------

---[FILE: HaloPSA.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/HaloPSA/HaloPSA.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class HaloPSA implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HaloPSA
```

--------------------------------------------------------------------------------

---[FILE: Harvest.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Harvest/Harvest.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Harvest implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Harvest
```

--------------------------------------------------------------------------------

---[FILE: TimeEntryDescription.ts]---
Location: n8n-master/packages/nodes-base/nodes/Harvest/TimeEntryDescription.ts
Signals: N/A
Excerpt (<=80 chars):  export const resource = ['timeEntry'];

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- resource
```

--------------------------------------------------------------------------------

---[FILE: ConversationInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/HelpScout/ConversationInterface.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IConversation {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IConversation
```

--------------------------------------------------------------------------------

---[FILE: CustomerInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/HelpScout/CustomerInterface.ts
Signals: N/A
Excerpt (<=80 chars):  export interface ICustomer {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ICustomer
```

--------------------------------------------------------------------------------

---[FILE: HelpScout.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/HelpScout/HelpScout.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class HelpScout implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HelpScout
```

--------------------------------------------------------------------------------

---[FILE: HelpScoutTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/HelpScout/HelpScoutTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class HelpScoutTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HelpScoutTrigger
```

--------------------------------------------------------------------------------

---[FILE: ThreadInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/HelpScout/ThreadInterface.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IAttachment {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IAttachment
- IThread
```

--------------------------------------------------------------------------------

---[FILE: HighLevel.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/HighLevel/HighLevel.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class HighLevel extends VersionedNodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HighLevel
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/HighLevel/v1/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function isEmailValid(email: string): boolean {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isEmailValid
- isPhoneValid
```

--------------------------------------------------------------------------------

---[FILE: HighLevelV1.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/HighLevel/v1/HighLevelV1.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class HighLevelV1 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HighLevelV1
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/HighLevel/v2/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function isEmailValid(email: string): boolean {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isEmailValid
- isPhoneValid
- dateToIsoSupressMillis
- addNotePostReceiveAction
```

--------------------------------------------------------------------------------

---[FILE: HighLevelV2.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/HighLevel/v2/HighLevelV2.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class HighLevelV2 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HighLevelV2
```

--------------------------------------------------------------------------------

---[FILE: HomeAssistant.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/HomeAssistant/HomeAssistant.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class HomeAssistant implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HomeAssistant
```

--------------------------------------------------------------------------------

---[FILE: Html.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Html/Html.node.ts
Signals: N/A
Excerpt (<=80 chars):  export const capitalizeHeader = (header: string, capitalize?: boolean) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- capitalizeHeader
- Html
```

--------------------------------------------------------------------------------

---[FILE: placeholder.ts]---
Location: n8n-master/packages/nodes-base/nodes/Html/placeholder.ts
Signals: N/A
Excerpt (<=80 chars): export const placeholder = `

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- placeholder
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/nodes-base/nodes/Html/types.ts
Signals: N/A
Excerpt (<=80 chars):  export type Cheerio = ReturnType<typeof cheerio>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Cheerio
- IValueData
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/nodes-base/nodes/Html/utils.ts
Signals: N/A
Excerpt (<=80 chars): export function getValue(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getValue
```

--------------------------------------------------------------------------------

---[FILE: HtmlExtract.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/HtmlExtract/HtmlExtract.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class HtmlExtract implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HtmlExtract
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/HttpRequest/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export type BodyParameter = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- sanitizeUiMessage
- getSecrets
- replaceNullValues
- REDACTED
- getOAuth2AdditionalParameters
- binaryContentTypes
- prepareRequestBody
- setAgentOptions
- updadeQueryParameterConfig
- BodyParameter
- IAuthDataSanitizeKeys
- BodyParametersReducer
```

--------------------------------------------------------------------------------

---[FILE: HttpRequest.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/HttpRequest/HttpRequest.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class HttpRequest extends VersionedNodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HttpRequest
```

--------------------------------------------------------------------------------

---[FILE: interfaces.ts]---
Location: n8n-master/packages/nodes-base/nodes/HttpRequest/interfaces.ts
Signals: N/A
Excerpt (<=80 chars): export type HttpSslAuthCredentials = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HttpSslAuthCredentials
```

--------------------------------------------------------------------------------

---[FILE: optimizeResponse.ts]---
Location: n8n-master/packages/nodes-base/nodes/HttpRequest/shared/optimizeResponse.ts
Signals: N/A
Excerpt (<=80 chars):  export const configureResponseOptimizer = (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- configureResponseOptimizer
```

--------------------------------------------------------------------------------

---[FILE: HttpRequestV1.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/HttpRequest/V1/HttpRequestV1.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class HttpRequestV1 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HttpRequestV1
```

--------------------------------------------------------------------------------

---[FILE: HttpRequestV2.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/HttpRequest/V2/HttpRequestV2.node.ts
Signals: N/A
Excerpt (<=80 chars): export class HttpRequestV2 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HttpRequestV2
```

--------------------------------------------------------------------------------

---[FILE: HttpRequestV3.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/HttpRequest/V3/HttpRequestV3.node.ts
Signals: N/A
Excerpt (<=80 chars): export class HttpRequestV3 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HttpRequestV3
```

--------------------------------------------------------------------------------

---[FILE: binaryData.ts]---
Location: n8n-master/packages/nodes-base/nodes/HttpRequest/V3/utils/binaryData.ts
Signals: N/A
Excerpt (<=80 chars):  export const setFilename = (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- setFilename
```

--------------------------------------------------------------------------------

---[FILE: parse.ts]---
Location: n8n-master/packages/nodes-base/nodes/HttpRequest/V3/utils/parse.ts
Signals: N/A
Excerpt (<=80 chars): export const mimeTypeFromResponse = (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mimeTypeFromResponse
```

--------------------------------------------------------------------------------

---[FILE: Hubspot.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Hubspot/Hubspot.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Hubspot extends VersionedNodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Hubspot
```

--------------------------------------------------------------------------------

---[FILE: HubspotTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Hubspot/HubspotTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class HubspotTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HubspotTrigger
```

--------------------------------------------------------------------------------

---[FILE: DealInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/Hubspot/V1/DealInterface.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IAssociation {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IAssociation
- IDeal
```

--------------------------------------------------------------------------------

---[FILE: FormInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/Hubspot/V1/FormInterface.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IContext {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IContext
- IForm
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Hubspot/V1/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars): export function validateJSON(json: string | undefined): any {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- validateJSON
- clean
- propertyEvents
- contactFields
- companyFields
- dealFields
- getEmailMetadata
- getTaskMetadata
- getMeetingMetadata
- getCallMetadata
- getAssociations
```

--------------------------------------------------------------------------------

---[FILE: HubspotV1.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Hubspot/V1/HubspotV1.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class HubspotV1 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HubspotV1
```

--------------------------------------------------------------------------------

---[FILE: DealInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/Hubspot/V2/DealInterface.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IAssociation {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IAssociation
- IDeal
```

--------------------------------------------------------------------------------

---[FILE: FormInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/Hubspot/V2/FormInterface.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IContext {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IContext
- IForm
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Hubspot/V2/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function validateJSON(json: string | undefined): any {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- validateJSON
- clean
- propertyEvents
- contactFields
- companyFields
- dealFields
- getEmailMetadata
- getTaskMetadata
- getMeetingMetadata
- getCallMetadata
- getAssociations
```

--------------------------------------------------------------------------------

---[FILE: HubspotV2.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Hubspot/V2/HubspotV2.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class HubspotV2 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HubspotV2
```

--------------------------------------------------------------------------------

---[FILE: parseToTimestamp.ts]---
Location: n8n-master/packages/nodes-base/nodes/Hubspot/V2/utils/parseToTimestamp.ts
Signals: N/A
Excerpt (<=80 chars):  export function parseToTimestamp(dateString: unknown): number {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- parseToTimestamp
```

--------------------------------------------------------------------------------

---[FILE: HumanticAi.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/HumanticAI/HumanticAi.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class HumanticAi implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HumanticAi
```

--------------------------------------------------------------------------------

---[FILE: Hunter.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Hunter/Hunter.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Hunter implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Hunter
```

--------------------------------------------------------------------------------

---[FILE: ICalendar.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/ICalendar/ICalendar.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class ICalendar implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ICalendar
```

--------------------------------------------------------------------------------

---[FILE: If.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/If/If.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class If extends VersionedNodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- If
```

--------------------------------------------------------------------------------

---[FILE: IfV1.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/If/V1/IfV1.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class IfV1 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IfV1
```

--------------------------------------------------------------------------------

---[FILE: IfV2.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/If/V2/IfV2.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class IfV2 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IfV2
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/nodes-base/nodes/If/V2/utils.ts
Signals: N/A
Excerpt (<=80 chars):  export const getTypeValidationStrictness = (version: number) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getTypeValidationStrictness
- getTypeValidationParameter
```

--------------------------------------------------------------------------------

---[FILE: CompanyInteface.ts]---
Location: n8n-master/packages/nodes-base/nodes/Intercom/CompanyInteface.ts
Signals: N/A
Excerpt (<=80 chars):  export interface ICompany {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ICompany
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Intercom/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function validateJSON(json: string | undefined): any {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- validateJSON
```

--------------------------------------------------------------------------------

---[FILE: Intercom.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Intercom/Intercom.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Intercom implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Intercom
```

--------------------------------------------------------------------------------

---[FILE: LeadInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/Intercom/LeadInterface.ts
Signals: N/A
Excerpt (<=80 chars):  export interface ILeadCompany {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ILeadCompany
- IAvatar
- ILead
```

--------------------------------------------------------------------------------

---[FILE: UserInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/Intercom/UserInterface.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IUserCompany {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IUserCompany
- IAvatar
- IUser
```

--------------------------------------------------------------------------------

---[FILE: Interval.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Interval/Interval.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Interval implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Interval
```

--------------------------------------------------------------------------------

---[FILE: BankTransactionInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/InvoiceNinja/BankTransactionInterface.ts
Signals: N/A
Excerpt (<=80 chars): export interface IBankTransaction {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IBankTransaction
- IBankTransactions
```

--------------------------------------------------------------------------------

---[FILE: ClientInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/InvoiceNinja/ClientInterface.ts
Signals: N/A
Excerpt (<=80 chars): export interface IContact {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IContact
- IClient
```

--------------------------------------------------------------------------------

---[FILE: ExpenseInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/InvoiceNinja/ExpenseInterface.ts
Signals: N/A
Excerpt (<=80 chars): export interface IExpense {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IExpense
```

--------------------------------------------------------------------------------

---[FILE: invoiceInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/InvoiceNinja/invoiceInterface.ts
Signals: N/A
Excerpt (<=80 chars): export interface IItem {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IItem
- IInvoice
```

--------------------------------------------------------------------------------

---[FILE: InvoiceNinja.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/InvoiceNinja/InvoiceNinja.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class InvoiceNinja implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InvoiceNinja
```

--------------------------------------------------------------------------------

---[FILE: InvoiceNinjaTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/InvoiceNinja/InvoiceNinjaTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class InvoiceNinjaTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InvoiceNinjaTrigger
```

--------------------------------------------------------------------------------

---[FILE: PaymentInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/InvoiceNinja/PaymentInterface.ts
Signals: N/A
Excerpt (<=80 chars): export interface IPayment {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IPayment
- IInvoice
```

--------------------------------------------------------------------------------

---[FILE: QuoteInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/InvoiceNinja/QuoteInterface.ts
Signals: N/A
Excerpt (<=80 chars): export interface IItem {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IItem
- IQuote
```

--------------------------------------------------------------------------------

---[FILE: TaskInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/InvoiceNinja/TaskInterface.ts
Signals: N/A
Excerpt (<=80 chars): export interface ITask {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ITask
```

--------------------------------------------------------------------------------

---[FILE: ItemLists.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/ItemLists/ItemLists.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class ItemLists extends VersionedNodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ItemLists
```

--------------------------------------------------------------------------------

---[FILE: ItemListsV1.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/ItemLists/V1/ItemListsV1.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class ItemListsV1 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ItemListsV1
```

--------------------------------------------------------------------------------

---[FILE: ItemListsV2.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/ItemLists/V2/ItemListsV2.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class ItemListsV2 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ItemListsV2
```

--------------------------------------------------------------------------------

---[FILE: ItemListsV3.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/ItemLists/V3/ItemListsV3.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class ItemListsV3 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ItemListsV3
```

--------------------------------------------------------------------------------

---[FILE: node.type.ts]---
Location: n8n-master/packages/nodes-base/nodes/ItemLists/V3/actions/node.type.ts
Signals: N/A
Excerpt (<=80 chars):  export type ItemListsType = AllEntities<NodeMap>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ItemListsType
```

--------------------------------------------------------------------------------

---[FILE: concatenateItems.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/ItemLists/V3/actions/itemList/concatenateItems.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: limit.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/ItemLists/V3/actions/itemList/limit.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: removeDuplicates.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/ItemLists/V3/actions/itemList/removeDuplicates.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: sort.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/ItemLists/V3/actions/itemList/sort.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: splitOutItems.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/ItemLists/V3/actions/itemList/splitOutItems.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: summarize.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/ItemLists/V3/actions/itemList/summarize.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const properties: INodeProperties[] = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/nodes-base/nodes/ItemLists/V3/helpers/utils.ts
Signals: N/A
Excerpt (<=80 chars):  export const prepareFieldsArray = (fields: string | string[], fieldName = 'F...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- sortByCode
- addBinariesToItem
- typeToNumber
- prepareFieldsArray
```

--------------------------------------------------------------------------------

---[FILE: Iterable.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Iterable/Iterable.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Iterable implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Iterable
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Jenkins/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function tolerateTrailingSlash(baseUrl: string) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- tolerateTrailingSlash
```

--------------------------------------------------------------------------------

---[FILE: Jenkins.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Jenkins/Jenkins.node.ts
Signals: N/A
Excerpt (<=80 chars):  export type JenkinsApiCredentials = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Jenkins
- JenkinsApiCredentials
```

--------------------------------------------------------------------------------

---[FILE: JinaAi.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/JinaAI/JinaAi.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class JinaAi implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- JinaAi
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Jira/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function handlePagination(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- handlePagination
- validateJSON
- eventExists
- getWebhookId
- simplifyIssueOutput
- filterSortSearchListItems
- allEvents
```

--------------------------------------------------------------------------------

---[FILE: IssueInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/Jira/IssueInterface.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IFields {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IFields
- IIssue
- INotify
- INotificationRecipients
- NotificationRecipientsRestrictions
```

--------------------------------------------------------------------------------

---[FILE: Jira.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Jira/Jira.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Jira implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Jira
```

--------------------------------------------------------------------------------

---[FILE: JiraTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Jira/JiraTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class JiraTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- JiraTrigger
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/nodes-base/nodes/Jira/types.ts
Signals: N/A
Excerpt (<=80 chars): export type JiraWebhook = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- JiraWebhook
- JiraServerInfo
```

--------------------------------------------------------------------------------

---[FILE: JotFormTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/JotForm/JotFormTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class JotFormTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- JotFormTrigger
```

--------------------------------------------------------------------------------

---[FILE: Jwt.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Jwt/Jwt.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Jwt implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Jwt
```

--------------------------------------------------------------------------------

---[FILE: Kafka.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Kafka/Kafka.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Kafka implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Kafka
```

--------------------------------------------------------------------------------

---[FILE: KafkaTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Kafka/KafkaTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class KafkaTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- KafkaTrigger
```

--------------------------------------------------------------------------------

---[FILE: CompanyInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/Keap/CompanyInterface.ts
Signals: N/A
Excerpt (<=80 chars):  export interface ICompany {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ICompany
```

--------------------------------------------------------------------------------

---[FILE: ConctactInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/Keap/ConctactInterface.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IAddress {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IAddress
- ICustomField
- IEmailContact
- IFax
- IPhone
- ISocialAccount
- IContact
```

--------------------------------------------------------------------------------

---[FILE: ContactNoteInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/Keap/ContactNoteInterface.ts
Signals: N/A
Excerpt (<=80 chars): export interface INote {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- INote
```

--------------------------------------------------------------------------------

---[FILE: EcommerceOrderInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/Keap/EcommerceOrderInterface.ts
Signals: N/A
Excerpt (<=80 chars): export interface IItem {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IItem
- IShippingAddress
- IEcommerceOrder
```

--------------------------------------------------------------------------------

---[FILE: EcommerceProductInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/Keap/EcommerceProductInterface.ts
Signals: N/A
Excerpt (<=80 chars): export interface IEcommerceProduct {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IEcommerceProduct
```

--------------------------------------------------------------------------------

---[FILE: EmaiIInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/Keap/EmaiIInterface.ts
Signals: N/A
Excerpt (<=80 chars): export interface IAttachment {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IAttachment
- IEmail
```

--------------------------------------------------------------------------------

---[FILE: FileInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/Keap/FileInterface.ts
Signals: N/A
Excerpt (<=80 chars): export interface IFile {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IFile
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Keap/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function keysToSnakeCase(elements: IDataObject[] | IDataObject): IDat...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- keysToSnakeCase
```

--------------------------------------------------------------------------------

---[FILE: Keap.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Keap/Keap.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Keap implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Keap
```

--------------------------------------------------------------------------------

---[FILE: KeapTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Keap/KeapTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class KeapTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- KeapTrigger
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/KoBoToolbox/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function parseStringList(value: string): string[] {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- parseStringList
- formatSubmission
```

--------------------------------------------------------------------------------

---[FILE: KoBoToolbox.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/KoBoToolbox/KoBoToolbox.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class KoBoToolbox implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- KoBoToolbox
```

--------------------------------------------------------------------------------

````
