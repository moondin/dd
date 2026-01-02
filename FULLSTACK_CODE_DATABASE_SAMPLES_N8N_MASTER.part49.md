---
source_txt: fullstack_samples/n8n-master
converted_utc: 2025-12-18T10:47:15Z
part: 49
parts_total: 51
---

# FULLSTACK CODE DATABASE SAMPLES n8n-master

## Extracted Reusable Patterns (Non-verbatim) (Part 49 of 51)

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

---[FILE: Webhook.test.ts]---
Location: n8n-master/packages/nodes-base/nodes/Webhook/test/Webhook.test.ts
Signals: Express
Excerpt (<=80 chars): import { NodeTestHarness } from '@nodes-testing/node-test-harness';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Wekan.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Wekan/Wekan.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Wekan implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Wekan
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/WhatsApp/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars): export const WHATSAPP_BASE_URL = 'https://graph.facebook.com/v13.0/';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WHATSAPP_BASE_URL
- createMessage
```

--------------------------------------------------------------------------------

---[FILE: MessageFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/WhatsApp/MessageFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export const sanitizePhoneNumber = (phoneNumber: string) => phoneNumber.repl...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- sanitizePhoneNumber
```

--------------------------------------------------------------------------------

---[FILE: MessagesDescription.ts]---
Location: n8n-master/packages/nodes-base/nodes/WhatsApp/MessagesDescription.ts
Signals: N/A
Excerpt (<=80 chars):  export const mediaTypes = ['image', 'video', 'audio', 'sticker', 'document'];

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mediaTypes
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/nodes-base/nodes/WhatsApp/types.ts
Signals: N/A
Excerpt (<=80 chars):  export type BaseFacebookResponse<TData> = { data: TData };

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BaseFacebookResponse
- BasePaginatedFacebookResponse
- WhatsAppAppWebhookSubscriptionsResponse
- FacebookPageListResponse
- FacebookFormListResponse
- WhatsAppEventChanges
- WhatsAppAppWebhookSubscription
- WhatsAppAppWebhookSubscriptionField
- CreateFacebookAppWebhookSubscription
- FacebookPage
- FacebookPageCategory
- FacebookFormQuestion
- FacebookForm
- WhatsAppPageEvent
- WhatsAppEventEntry
- FacebookFormLeadData
```

--------------------------------------------------------------------------------

---[FILE: WhatsApp.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/WhatsApp/WhatsApp.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class WhatsApp implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WhatsApp
```

--------------------------------------------------------------------------------

---[FILE: WhatsAppTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/WhatsApp/WhatsAppTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export const filterStatuses = (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- filterStatuses
- WhatsAppTrigger
```

--------------------------------------------------------------------------------

---[FILE: WhatsAppTrigger.node.test.ts]---
Location: n8n-master/packages/nodes-base/nodes/WhatsApp/tests/WhatsAppTrigger.node.test.ts
Signals: Express
Excerpt (<=80 chars): import crypto from 'crypto';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Wise/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function getTriggerName(eventName: string) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getTriggerName
- livePublicKey
- testPublicKey
- BorderlessAccount
- ExchangeRateAdditionalFields
- Profile
- Recipient
- StatementAdditionalFields
- TransferFilters
```

--------------------------------------------------------------------------------

---[FILE: Wise.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Wise/Wise.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Wise implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Wise
```

--------------------------------------------------------------------------------

---[FILE: WiseTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Wise/WiseTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class WiseTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WiseTrigger
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/WooCommerce/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars): export function getAutomaticSecret(credentials: ICredentialDataDecryptedObjec...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getAutomaticSecret
- setMetadata
- toSnakeCase
- setFields
- adjustMetadata
```

--------------------------------------------------------------------------------

---[FILE: OrderInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/WooCommerce/OrderInterface.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IAddress {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IAddress
- ILineItem
- IShoppingLine
- IFeeLine
- ICouponLine
- IOrder
```

--------------------------------------------------------------------------------

---[FILE: ProductInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/WooCommerce/ProductInterface.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IDimension {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IDimension
- IImage
- IProduct
```

--------------------------------------------------------------------------------

---[FILE: WooCommerce.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/WooCommerce/WooCommerce.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class WooCommerce implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WooCommerce
```

--------------------------------------------------------------------------------

---[FILE: WooCommerceTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/WooCommerce/WooCommerceTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class WooCommerceTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WooCommerceTrigger
```

--------------------------------------------------------------------------------

---[FILE: PageInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/Wordpress/PageInterface.ts
Signals: N/A
Excerpt (<=80 chars): export interface IPage {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IPage
```

--------------------------------------------------------------------------------

---[FILE: PostInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/Wordpress/PostInterface.ts
Signals: N/A
Excerpt (<=80 chars): export interface IPost {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IPost
```

--------------------------------------------------------------------------------

---[FILE: UserInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/Wordpress/UserInterface.ts
Signals: N/A
Excerpt (<=80 chars): export interface IUser {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IUser
```

--------------------------------------------------------------------------------

---[FILE: Wordpress.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Wordpress/Wordpress.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Wordpress implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Wordpress
```

--------------------------------------------------------------------------------

---[FILE: apiResponses.ts]---
Location: n8n-master/packages/nodes-base/nodes/Wordpress/__tests__/workflow/apiResponses.ts
Signals: N/A
Excerpt (<=80 chars): export const postGetMany = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- postGetMany
- postGet
- postUpdate
- postCreate
- userCreate
- userGet
- userGetMany
- userUpdate
- pageCreate
- pageGet
- pageGetMany
- pageUpdate
```

--------------------------------------------------------------------------------

---[FILE: credentials.ts]---
Location: n8n-master/packages/nodes-base/nodes/Wordpress/__tests__/workflow/credentials.ts
Signals: N/A
Excerpt (<=80 chars): export const credentials = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- credentials
```

--------------------------------------------------------------------------------

---[FILE: WorkableTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Workable/WorkableTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class WorkableTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkableTrigger
```

--------------------------------------------------------------------------------

---[FILE: WorkflowTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/WorkflowTrigger/WorkflowTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class WorkflowTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowTrigger
```

--------------------------------------------------------------------------------

---[FILE: WriteBinaryFile.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/WriteBinaryFile/WriteBinaryFile.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class WriteBinaryFile implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WriteBinaryFile
```

--------------------------------------------------------------------------------

---[FILE: Interface.ts]---
Location: n8n-master/packages/nodes-base/nodes/Wufoo/Interface.ts
Signals: N/A
Excerpt (<=80 chars): export interface IFormQuery {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IFormQuery
- IWebhook
- IField
```

--------------------------------------------------------------------------------

---[FILE: WufooTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Wufoo/WufooTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class WufooTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WufooTrigger
```

--------------------------------------------------------------------------------

---[FILE: IContactInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/Xero/IContactInterface.ts
Signals: N/A
Excerpt (<=80 chars): export interface IAddress {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IAddress
- IPhone
- IContact
- ITenantId
```

--------------------------------------------------------------------------------

---[FILE: InvoiceInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/Xero/InvoiceInterface.ts
Signals: N/A
Excerpt (<=80 chars):  export interface ILineItem {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ILineItem
- IInvoice
- ITenantId
```

--------------------------------------------------------------------------------

---[FILE: Xero.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Xero/Xero.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Xero implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Xero
```

--------------------------------------------------------------------------------

---[FILE: Xml.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Xml/Xml.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Xml implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Xml
```

--------------------------------------------------------------------------------

---[FILE: Yourls.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Yourls/Yourls.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Yourls implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Yourls
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Zammad/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function tolerateTrailingSlash(url: string) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- tolerateTrailingSlash
- throwOnEmptyUpdate
- prettifyDisplayName
- fieldToLoadOption
- isCustomer
- getGroupFields
- getOrganizationFields
- getUserFields
- getTicketFields
- getGroupCustomFields
- getOrganizationCustomFields
- getUserCustomFields
- getTicketCustomFields
- isNotZammadFoundation
- doesNotBelongToZammad
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/nodes-base/nodes/Zammad/types.ts
Signals: N/A
Excerpt (<=80 chars):  export type Resource = 'group' | 'organization' | 'ticket' | 'user';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Resource
- AuthMethod
- Credentials
- BasicAuthCredentials
- TokenAuthCredentials
- UserAdditionalFields
- UserUpdateFields
- UserFilterFields
- Organization
- Group
- GroupUpdateFields
- User
- Field
- UserField
- CustomFieldsUi
- SortUi
- AddressUi
- Article
```

--------------------------------------------------------------------------------

---[FILE: Zammad.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Zammad/Zammad.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Zammad implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Zammad
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Zendesk/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function validateJSON(json: string | undefined): any {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- validateJSON
```

--------------------------------------------------------------------------------

---[FILE: TicketInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/Zendesk/TicketInterface.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IComment {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IComment
- ITicket
```

--------------------------------------------------------------------------------

---[FILE: TriggerPlaceholders.ts]---
Location: n8n-master/packages/nodes-base/nodes/Zendesk/TriggerPlaceholders.ts
Signals: N/A
Excerpt (<=80 chars):  export const triggerPlaceholders = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- triggerPlaceholders
```

--------------------------------------------------------------------------------

---[FILE: Zendesk.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Zendesk/Zendesk.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Zendesk implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Zendesk
```

--------------------------------------------------------------------------------

---[FILE: ZendeskTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Zendesk/ZendeskTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class ZendeskTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ZendeskTrigger
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Zoho/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function throwOnErrorStatus(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- throwOnErrorStatus
- throwOnEmptyUpdate
- throwOnMissingProducts
- getModuleName
- adjustProductDetails
- adjustProductDetailsOnUpdate
- adjustAccountPayload
- adjustContactPayload
- adjustDealPayload
- adjustInvoicePayload
- adjustInvoicePayloadOnUpdate
- adjustLeadPayload
- adjustPurchaseOrderPayload
- adjustQuotePayload
- adjustSalesOrderPayload
- adjustVendorPayload
- adjustProductPayload
- toLoadOptions
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/nodes-base/nodes/Zoho/types.ts
Signals: N/A
Excerpt (<=80 chars):  export type CamelCaseResource = Resource | 'purchaseOrder' | 'salesOrder';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CamelCaseResource
- SnakeCaseResource
- GetAllFilterOptions
- ZohoOAuth2ApiCredentials
- IdType
- NameType
- LocationType
- DateType
- AllFields
- ProductDetails
- ResourceItems
- LoadedAccounts
- LoadedContacts
- LoadedDeals
- LoadedFields
- LoadedVendors
- LoadedProducts
- LoadedLayouts
```

--------------------------------------------------------------------------------

---[FILE: ZohoCrm.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Zoho/ZohoCrm.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class ZohoCrm implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ZohoCrm
```

--------------------------------------------------------------------------------

---[FILE: SharedFields.ts]---
Location: n8n-master/packages/nodes-base/nodes/Zoho/descriptions/SharedFields.ts
Signals: N/A
Excerpt (<=80 chars):  export const billingAddress: INodeProperties = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- makeGetAllFields
- makeCustomFieldsFixedCollection
- currencies
```

--------------------------------------------------------------------------------

---[FILE: Zoom.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Zoom/Zoom.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Zoom implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Zoom
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Zulip/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function validateJSON(json: string | undefined): any {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- validateJSON
```

--------------------------------------------------------------------------------

---[FILE: MessageInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/Zulip/MessageInterface.ts
Signals: N/A
Excerpt (<=80 chars): export interface IMessage {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IMessage
```

--------------------------------------------------------------------------------

---[FILE: StreamInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/Zulip/StreamInterface.ts
Signals: N/A
Excerpt (<=80 chars): export interface IStream {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IStream
- IPrincipal
```

--------------------------------------------------------------------------------

---[FILE: UserInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/Zulip/UserInterface.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IUser {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IUser
```

--------------------------------------------------------------------------------

---[FILE: Zulip.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Zulip/Zulip.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Zulip implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Zulip
```

--------------------------------------------------------------------------------

---[FILE: Helpers.ts]---
Location: n8n-master/packages/nodes-base/test/nodes/Helpers.ts
Signals: N/A
Excerpt (<=80 chars):  export const createMockExecuteFunction = <T = IExecuteFunctions>(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createMockExecuteFunction
```

--------------------------------------------------------------------------------

---[FILE: TriggerHelpers.ts]---
Location: n8n-master/packages/nodes-base/test/nodes/TriggerHelpers.ts
Signals: Express
Excerpt (<=80 chars): import type * as express from 'express';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: generate-schema.d.ts]---
Location: n8n-master/packages/nodes-base/types/generate-schema.d.ts
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

---[FILE: allCurrencies.ts]---
Location: n8n-master/packages/nodes-base/utils/allCurrencies.ts
Signals: N/A
Excerpt (<=80 chars): export const allCurrencies = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- allCurrencies
```

--------------------------------------------------------------------------------

---[FILE: binary.ts]---
Location: n8n-master/packages/nodes-base/utils/binary.ts
Signals: N/A
Excerpt (<=80 chars):  export type JsonToSpreadsheetBinaryFormat = 'csv' | 'html' | 'rtf' | 'ods' |...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- JsonToSpreadsheetBinaryFormat
- JsonToSpreadsheetBinaryOptions
- JsonToBinaryOptions
```

--------------------------------------------------------------------------------

---[FILE: connection-pool-manager.ts]---
Location: n8n-master/packages/nodes-base/utils/connection-pool-manager.ts
Signals: N/A
Excerpt (<=80 chars):  export class ConnectionPoolManager {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ConnectionPoolManager
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: n8n-master/packages/nodes-base/utils/constants.ts
Signals: N/A
Excerpt (<=80 chars): export const NODE_RAN_MULTIPLE_TIMES_WARNING =

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NODE_RAN_MULTIPLE_TIMES_WARNING
- LOCALHOST
- ENABLE_LESS_STRICT_TYPE_VALIDATION
```

--------------------------------------------------------------------------------

---[FILE: ISOCountryCodes.ts]---
Location: n8n-master/packages/nodes-base/utils/ISOCountryCodes.ts
Signals: N/A
Excerpt (<=80 chars): export interface ISOCountryCode {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ISOCountryCode
```

--------------------------------------------------------------------------------

---[FILE: utilities.ts]---
Location: n8n-master/packages/nodes-base/utils/utilities.ts
Signals: N/A
Excerpt (<=80 chars):  export function chunk<T>(array: T[], size = 1) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- updateDisplayOptions
- wrapData
- formatPrivateKey
- getResolvables
- flattenObject
- capitalize
- generatePairedItemData
- preparePairedItemDataArray
- escapeHtml
- sortItemKeysByPriorityList
- createUtmCampaignLink
- addExecutionHints
- shuffleArray
- flattenKeys
- compareItems
- fuzzyCompare
- keysToLowercase
- sanitizeDataPathKey
```

--------------------------------------------------------------------------------

---[FILE: workflow-backtracking.ts]---
Location: n8n-master/packages/nodes-base/utils/workflow-backtracking.ts
Signals: N/A
Excerpt (<=80 chars): export function previousTaskData(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- previousTaskData
- findPairedItemThroughWorkflowData
```

--------------------------------------------------------------------------------

---[FILE: configureWaitTillDate.util.ts]---
Location: n8n-master/packages/nodes-base/utils/sendAndWait/configureWaitTillDate.util.ts
Signals: N/A
Excerpt (<=80 chars):  export function configureWaitTillDate(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- configureWaitTillDate
```

--------------------------------------------------------------------------------

---[FILE: email-templates.ts]---
Location: n8n-master/packages/nodes-base/utils/sendAndWait/email-templates.ts
Signals: N/A
Excerpt (<=80 chars): export const BUTTON_STYLE_SECONDARY =

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createEmailBodyWithN8nAttribution
- createEmailBodyWithoutN8nAttribution
- BUTTON_STYLE_SECONDARY
- BUTTON_STYLE_PRIMARY
- ACTION_RECORDED_PAGE
```

--------------------------------------------------------------------------------

---[FILE: interfaces.ts]---
Location: n8n-master/packages/nodes-base/utils/sendAndWait/interfaces.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IEmail {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IEmail
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/nodes-base/utils/sendAndWait/utils.ts
Signals: N/A
Excerpt (<=80 chars):  export type SendAndWaitConfig = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getSendAndWaitProperties
- getSendAndWaitConfig
- createButton
- createEmail
- SEND_AND_WAIT_WAITING_TOOLTIP
- SendAndWaitConfig
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: n8n-master/packages/nodes-base/utils/workflowInputsResourceMapping/constants.ts
Signals: N/A
Excerpt (<=80 chars):  export const INPUT_SOURCE = 'inputSource';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- INPUT_SOURCE
- WORKFLOW_INPUTS
- VALUES
- JSON_EXAMPLE
- PASSTHROUGH
- FALLBACK_DEFAULT_VALUE
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/utils/workflowInputsResourceMapping/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function getFieldEntries(context: IWorkflowNodeContext): {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getFieldEntries
- getWorkflowInputValues
- getCurrentWorkflowInputData
```

--------------------------------------------------------------------------------

---[FILE: docker-image-not-found-error.ts]---
Location: n8n-master/packages/testing/containers/docker-image-not-found-error.ts
Signals: N/A
Excerpt (<=80 chars): export class DockerImageNotFoundError extends Error {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DockerImageNotFoundError
```

--------------------------------------------------------------------------------

---[FILE: docker-image.ts]---
Location: n8n-master/packages/testing/containers/docker-image.ts
Signals: N/A
Excerpt (<=80 chars): export function getDockerImageFromEnv(defaultImage = 'n8nio/n8n:local') {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getDockerImageFromEnv
```

--------------------------------------------------------------------------------

---[FILE: n8n-image-pull-policy.ts]---
Location: n8n-master/packages/testing/containers/n8n-image-pull-policy.ts
Signals: N/A
Excerpt (<=80 chars): export class N8nImagePullPolicy implements ImagePullPolicy {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- N8nImagePullPolicy
```

--------------------------------------------------------------------------------

---[FILE: n8n-test-container-creation.ts]---
Location: n8n-master/packages/testing/containers/n8n-test-container-creation.ts
Signals: N/A
Excerpt (<=80 chars):  export interface N8NConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- N8NConfig
- N8NStack
```

--------------------------------------------------------------------------------

---[FILE: n8n-test-container-helpers.ts]---
Location: n8n-master/packages/testing/containers/n8n-test-container-helpers.ts
Signals: N/A
Excerpt (<=80 chars):  export interface LogMatch {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ContainerTestHelpers
- LogMatch
```

--------------------------------------------------------------------------------

---[FILE: n8n-test-container-keycloak.ts]---
Location: n8n-master/packages/testing/containers/n8n-test-container-keycloak.ts
Signals: N/A
Excerpt (<=80 chars): export const KEYCLOAK_TEST_REALM = 'test';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getKeycloakN8nEnvironment
- KEYCLOAK_TEST_REALM
- KEYCLOAK_TEST_CLIENT_ID
- KEYCLOAK_TEST_CLIENT_SECRET
- KEYCLOAK_TEST_USER_EMAIL
- KEYCLOAK_TEST_USER_PASSWORD
- KEYCLOAK_TEST_USER_FIRSTNAME
- KEYCLOAK_TEST_USER_LASTNAME
- N8N_KEYCLOAK_CERT_PATH
- KeycloakSetupResult
```

--------------------------------------------------------------------------------

---[FILE: n8n-test-container-mailpit.ts]---
Location: n8n-master/packages/testing/containers/n8n-test-container-mailpit.ts
Signals: N/A
Excerpt (<=80 chars): export type MailpitMessageSummary = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getMailpitEnvironment
- getMailpitApiBaseUrl
- MailpitMessageSummary
- MailpitMessage
- MailpitQuery
- MailpitListResponse
```

--------------------------------------------------------------------------------

---[FILE: n8n-test-container-utils.ts]---
Location: n8n-master/packages/testing/containers/n8n-test-container-utils.ts
Signals: N/A
Excerpt (<=80 chars): export function createElapsedLogger(prefix: string) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createElapsedLogger
- createSilentLogConsumer
```

--------------------------------------------------------------------------------

---[FILE: performance-plans.ts]---
Location: n8n-master/packages/testing/containers/performance-plans.ts
Signals: N/A
Excerpt (<=80 chars): export interface BasePerformancePlan {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isValidPerformancePlan
- PerformancePlanName
- BasePerformancePlan
```

--------------------------------------------------------------------------------

---[FILE: test-containers.ts]---
Location: n8n-master/packages/testing/containers/test-containers.ts
Signals: N/A
Excerpt (<=80 chars):  export const TEST_CONTAINER_IMAGES = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TEST_CONTAINER_IMAGES
```

--------------------------------------------------------------------------------

---[FILE: playwright-projects.ts]---
Location: n8n-master/packages/testing/playwright/playwright-projects.ts
Signals: N/A
Excerpt (<=80 chars):  export function getProjects(): Project[] {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getProjects
```

--------------------------------------------------------------------------------

---[FILE: Types.ts]---
Location: n8n-master/packages/testing/playwright/Types.ts
Signals: N/A
Excerpt (<=80 chars):  export class TestError extends Error {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestError
- TestRequirements
- InterceptConfig
```

--------------------------------------------------------------------------------

---[FILE: CanvasComposer.ts]---
Location: n8n-master/packages/testing/playwright/composables/CanvasComposer.ts
Signals: N/A
Excerpt (<=80 chars):  export class CanvasComposer {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CanvasComposer
```

--------------------------------------------------------------------------------

---[FILE: CredentialsComposer.ts]---
Location: n8n-master/packages/testing/playwright/composables/CredentialsComposer.ts
Signals: N/A
Excerpt (<=80 chars):  export class CredentialsComposer {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CredentialsComposer
```

--------------------------------------------------------------------------------

---[FILE: DataTablesComposer.ts]---
Location: n8n-master/packages/testing/playwright/composables/DataTablesComposer.ts
Signals: N/A
Excerpt (<=80 chars):  export class DataTableComposer {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DataTableComposer
```

--------------------------------------------------------------------------------

---[FILE: ExecutionsComposer.ts]---
Location: n8n-master/packages/testing/playwright/composables/ExecutionsComposer.ts
Signals: N/A
Excerpt (<=80 chars): export class ExecutionsComposer {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExecutionsComposer
```

--------------------------------------------------------------------------------

---[FILE: MfaComposer.ts]---
Location: n8n-master/packages/testing/playwright/composables/MfaComposer.ts
Signals: N/A
Excerpt (<=80 chars):  export class MfaComposer {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MfaComposer
```

--------------------------------------------------------------------------------

---[FILE: NodeDetailsViewComposer.ts]---
Location: n8n-master/packages/testing/playwright/composables/NodeDetailsViewComposer.ts
Signals: N/A
Excerpt (<=80 chars): export class NodeDetailsViewComposer {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NodeDetailsViewComposer
```

--------------------------------------------------------------------------------

---[FILE: OidcComposer.ts]---
Location: n8n-master/packages/testing/playwright/composables/OidcComposer.ts
Signals: N/A
Excerpt (<=80 chars): export class OidcComposer {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OidcComposer
```

--------------------------------------------------------------------------------

---[FILE: PartialExecutionComposer.ts]---
Location: n8n-master/packages/testing/playwright/composables/PartialExecutionComposer.ts
Signals: N/A
Excerpt (<=80 chars): export class PartialExecutionComposer {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PartialExecutionComposer
```

--------------------------------------------------------------------------------

---[FILE: ProjectComposer.ts]---
Location: n8n-master/packages/testing/playwright/composables/ProjectComposer.ts
Signals: N/A
Excerpt (<=80 chars):  export class ProjectComposer {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProjectComposer
```

--------------------------------------------------------------------------------

---[FILE: TemplatesComposer.ts]---
Location: n8n-master/packages/testing/playwright/composables/TemplatesComposer.ts
Signals: N/A
Excerpt (<=80 chars): export class TemplatesComposer {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TemplatesComposer
```

--------------------------------------------------------------------------------

---[FILE: TestEntryComposer.ts]---
Location: n8n-master/packages/testing/playwright/composables/TestEntryComposer.ts
Signals: N/A
Excerpt (<=80 chars): export class TestEntryComposer {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestEntryComposer
```

--------------------------------------------------------------------------------

---[FILE: WorkflowComposer.ts]---
Location: n8n-master/packages/testing/playwright/composables/WorkflowComposer.ts
Signals: N/A
Excerpt (<=80 chars): export class WorkflowComposer {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowComposer
```

--------------------------------------------------------------------------------

---[FILE: ai-assistant-fixtures.ts]---
Location: n8n-master/packages/testing/playwright/config/ai-assistant-fixtures.ts
Signals: N/A
Excerpt (<=80 chars):  export const simpleAssistantResponse = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- simpleAssistantResponse
- codeDiffSuggestionResponse
- applyCodeDiffResponse
- nodeExecutionSucceededResponse
- codeSnippetAssistantResponse
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: n8n-master/packages/testing/playwright/config/constants.ts
Signals: N/A
Excerpt (<=80 chars): export const BACKEND_BASE_URL = 'http://localhost:5678';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BACKEND_BASE_URL
- N8N_AUTH_COOKIE
- DEFAULT_USER_PASSWORD
- MANUAL_TRIGGER_NODE_NAME
- MANUAL_TRIGGER_NODE_DISPLAY_NAME
- MANUAL_CHAT_TRIGGER_NODE_NAME
- CHAT_TRIGGER_NODE_DISPLAY_NAME
- SCHEDULE_TRIGGER_NODE_NAME
- CODE_NODE_NAME
- CODE_NODE_DISPLAY_NAME
- SET_NODE_NAME
- EDIT_FIELDS_SET_NODE_NAME
- LOOP_OVER_ITEMS_NODE_NAME
- IF_NODE_NAME
- MERGE_NODE_NAME
- SWITCH_NODE_NAME
- GMAIL_NODE_NAME
- TRELLO_NODE_NAME
```

--------------------------------------------------------------------------------

---[FILE: intercepts.ts]---
Location: n8n-master/packages/testing/playwright/config/intercepts.ts
Signals: N/A
Excerpt (<=80 chars):  export function setContextSettings(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- setContextSettings
- getContextSettings
```

--------------------------------------------------------------------------------

---[FILE: test-users.ts]---
Location: n8n-master/packages/testing/playwright/config/test-users.ts
Signals: N/A
Excerpt (<=80 chars):  export interface UserCredentials {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UserCredentials
```

--------------------------------------------------------------------------------

---[FILE: base.ts]---
Location: n8n-master/packages/testing/playwright/fixtures/base.ts
Signals: N/A
Excerpt (<=80 chars): export const test = base.extend<

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test
```

--------------------------------------------------------------------------------

---[FILE: ClipboardHelper.ts]---
Location: n8n-master/packages/testing/playwright/helpers/ClipboardHelper.ts
Signals: N/A
Excerpt (<=80 chars):  export class ClipboardHelper {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ClipboardHelper
```

--------------------------------------------------------------------------------

````
