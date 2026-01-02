---
source_txt: fullstack_samples/n8n-master
converted_utc: 2025-12-18T10:47:15Z
part: 42
parts_total: 51
---

# FULLSTACK CODE DATABASE SAMPLES n8n-master

## Extracted Reusable Patterns (Non-verbatim) (Part 42 of 51)

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

---[FILE: KoBoToolboxTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/KoBoToolbox/KoBoToolboxTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class KoBoToolboxTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- KoBoToolboxTrigger
```

--------------------------------------------------------------------------------

---[FILE: Options.ts]---
Location: n8n-master/packages/nodes-base/nodes/KoBoToolbox/Options.ts
Signals: N/A
Excerpt (<=80 chars):  export const options = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- options
```

--------------------------------------------------------------------------------

---[FILE: Helpers.ts]---
Location: n8n-master/packages/nodes-base/nodes/Ldap/Helpers.ts
Signals: N/A
Excerpt (<=80 chars): export const BINARY_AD_ATTRIBUTES = ['objectGUID', 'objectSid'];

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BINARY_AD_ATTRIBUTES
- resolveBinaryAttributes
```

--------------------------------------------------------------------------------

---[FILE: Ldap.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Ldap/Ldap.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Ldap implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Ldap
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Lemlist/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function getEvents() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getEvents
```

--------------------------------------------------------------------------------

---[FILE: Lemlist.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Lemlist/Lemlist.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Lemlist extends VersionedNodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Lemlist
```

--------------------------------------------------------------------------------

---[FILE: LemlistTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Lemlist/LemlistTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class LemlistTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LemlistTrigger
```

--------------------------------------------------------------------------------

---[FILE: LemlistV1.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Lemlist/v1/LemlistV1.node.ts
Signals: N/A
Excerpt (<=80 chars): export class LemlistV1 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LemlistV1
```

--------------------------------------------------------------------------------

---[FILE: LemlistV2.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Lemlist/v2/LemlistV2.node.ts
Signals: N/A
Excerpt (<=80 chars): export class LemlistV2 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LemlistV2
```

--------------------------------------------------------------------------------

---[FILE: Line.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Line/Line.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Line implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Line
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Linear/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function capitalizeFirstLetter(data: string) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- capitalizeFirstLetter
- sort
```

--------------------------------------------------------------------------------

---[FILE: Linear.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Linear/Linear.node.ts
Signals: N/A
Excerpt (<=80 chars): export class Linear implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Linear
```

--------------------------------------------------------------------------------

---[FILE: LinearTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Linear/LinearTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class LinearTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LinearTrigger
```

--------------------------------------------------------------------------------

---[FILE: Queries.ts]---
Location: n8n-master/packages/nodes-base/nodes/Linear/Queries.ts
Signals: N/A
Excerpt (<=80 chars): export const query = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- query
```

--------------------------------------------------------------------------------

---[FILE: apiRequest.ts]---
Location: n8n-master/packages/nodes-base/nodes/Linear/test/workflow/apiRequest.ts
Signals: N/A
Excerpt (<=80 chars): export const addCommentRequest = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- addCommentRequest
- addCommentWithParentRequest
- addCommentLink
- issueCreateRequest
- getIssueRequest
- getManyIssuesRequest
- updateIssueRequest
- deleteIssueRequest
```

--------------------------------------------------------------------------------

---[FILE: apiResponses.ts]---
Location: n8n-master/packages/nodes-base/nodes/Linear/test/workflow/apiResponses.ts
Signals: N/A
Excerpt (<=80 chars): export const commentCreateResponse = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- commentCreateResponse
- commentCreateWithParentResponse
- attachmentLinkURLResponse
- issueCreateResponse
- getIssueResponse
- getManyIssueResponse
- issueUpdateResponse
- deleteIssueResponse
```

--------------------------------------------------------------------------------

---[FILE: LingvaNex.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/LingvaNex/LingvaNex.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class LingvaNex implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LingvaNex
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/LinkedIn/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function validateJSON(json: string | undefined): any {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- validateJSON
```

--------------------------------------------------------------------------------

---[FILE: LinkedIn.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/LinkedIn/LinkedIn.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class LinkedIn implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LinkedIn
```

--------------------------------------------------------------------------------

---[FILE: LocalFileTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/LocalFileTrigger/LocalFileTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class LocalFileTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LocalFileTrigger
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: n8n-master/packages/nodes-base/nodes/LoneScale/constants.ts
Signals: N/A
Excerpt (<=80 chars): export const BASE_URL = 'https://public-api.lonescale.com';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BASE_URL
```

--------------------------------------------------------------------------------

---[FILE: LoneScale.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/LoneScale/LoneScale.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class LoneScale implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LoneScale
```

--------------------------------------------------------------------------------

---[FILE: LoneScaleTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/LoneScale/LoneScaleTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class LoneScaleTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LoneScaleTrigger
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Magento/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function getAddressesUi(): INodeProperties {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getAddressesUi
- adjustAddresses
- getSearchFilters
- getFilterQuery
- validateJSON
- getCustomerOptionalFields
- getProductOptionalFields
- getOrderFields
- sort
```

--------------------------------------------------------------------------------

---[FILE: Magento2.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Magento/Magento2.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Magento2 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Magento2
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/nodes-base/nodes/Magento/types.ts
Signals: N/A
Excerpt (<=80 chars):  export interface NewCustomer {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NewCustomer
- Customer
- Address
- CustomAttribute
- AddressExtensionAttributes
- Region
- CustomerExtensionAttributes
- CompanyAttributes
- CustomerAttributeMetadata
- CustomerAttributeMetadataOption
- ValidationRule
- Search
- SearchCriteria
- FilterGroup
- Filter
- SortOrder
- NewProduct
- Product
```

--------------------------------------------------------------------------------

---[FILE: Mailcheck.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Mailcheck/Mailcheck.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Mailcheck implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Mailcheck
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Mailchimp/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function validateJSON(json: string | undefined): any {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- validateJSON
- campaignFieldsMetadata
```

--------------------------------------------------------------------------------

---[FILE: Mailchimp.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Mailchimp/Mailchimp.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Mailchimp implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Mailchimp
```

--------------------------------------------------------------------------------

---[FILE: MailchimpTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Mailchimp/MailchimpTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class MailchimpTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MailchimpTrigger
```

--------------------------------------------------------------------------------

---[FILE: MailerLite.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/MailerLite/MailerLite.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class MailerLite extends VersionedNodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MailerLite
```

--------------------------------------------------------------------------------

---[FILE: MailerLiteTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/MailerLite/MailerLiteTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class MailerLiteTrigger extends VersionedNodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MailerLiteTrigger
```

--------------------------------------------------------------------------------

---[FILE: apiResponses.ts]---
Location: n8n-master/packages/nodes-base/nodes/MailerLite/tests/apiResponses.ts
Signals: N/A
Excerpt (<=80 chars): export const getUpdateSubscriberResponseClassic = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getUpdateSubscriberResponseClassic
- getSubscriberResponseClassic
- getCreateResponseClassic
- getAllSubscribersResponseClassic
- getUpdateSubscriberResponseV2
- getCreateResponseV2
- getSubscriberResponseV2
- getAllSubscribersResponseV2
```

--------------------------------------------------------------------------------

---[FILE: MailerLiteTriggerV1.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/MailerLite/v1/MailerLiteTriggerV1.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class MailerLiteTriggerV1 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MailerLiteTriggerV1
```

--------------------------------------------------------------------------------

---[FILE: MailerLiteV1.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/MailerLite/v1/MailerLiteV1.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class MailerLiteV1 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MailerLiteV1
```

--------------------------------------------------------------------------------

---[FILE: MailerLite.Interface.ts]---
Location: n8n-master/packages/nodes-base/nodes/MailerLite/v2/MailerLite.Interface.ts
Signals: N/A
Excerpt (<=80 chars): export interface CustomField {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CustomField
- SubscriberFields
- Subscriber
```

--------------------------------------------------------------------------------

---[FILE: MailerLiteTriggerV2.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/MailerLite/v2/MailerLiteTriggerV2.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class MailerLiteTriggerV2 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MailerLiteTriggerV2
```

--------------------------------------------------------------------------------

---[FILE: MailerLiteV2.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/MailerLite/v2/MailerLiteV2.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class MailerLiteV2 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MailerLiteV2
```

--------------------------------------------------------------------------------

---[FILE: Mailgun.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Mailgun/Mailgun.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Mailgun implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Mailgun
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Mailjet/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function validateJSON(json: string | undefined): IDataObject | undefi...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- validateJSON
- IMessage
```

--------------------------------------------------------------------------------

---[FILE: Mailjet.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Mailjet/Mailjet.node.ts
Signals: N/A
Excerpt (<=80 chars): export class Mailjet implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Mailjet
```

--------------------------------------------------------------------------------

---[FILE: MailjetTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Mailjet/MailjetTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class MailjetTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MailjetTrigger
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Mandrill/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function getToEmailArray(toEmail: string): any {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getToEmailArray
- getGoogleAnalyticsDomainsArray
- getTags
- validateJSON
```

--------------------------------------------------------------------------------

---[FILE: Mandrill.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Mandrill/Mandrill.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Mandrill implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Mandrill
```

--------------------------------------------------------------------------------

---[FILE: ManualTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/ManualTrigger/ManualTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class ManualTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ManualTrigger
```

--------------------------------------------------------------------------------

---[FILE: Markdown.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Markdown/Markdown.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Markdown implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Markdown
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Marketstack/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export const format = (datetime?: string) => datetime?.split('T')[0];

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- validateTimeOptions
- format
```

--------------------------------------------------------------------------------

---[FILE: Marketstack.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Marketstack/Marketstack.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Marketstack implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Marketstack
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/nodes-base/nodes/Marketstack/types.ts
Signals: N/A
Excerpt (<=80 chars): export type Resource = 'endOfDayData' | 'exchange' | 'ticker';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Resource
- Operation
- EndOfDayDataFilters
```

--------------------------------------------------------------------------------

---[FILE: Matrix.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Matrix/Matrix.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Matrix implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Matrix
```

--------------------------------------------------------------------------------

---[FILE: Mattermost.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Mattermost/Mattermost.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Mattermost extends VersionedNodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Mattermost
```

--------------------------------------------------------------------------------

---[FILE: MattermostV1.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Mattermost/v1/MattermostV1.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class MattermostV1 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MattermostV1
```

--------------------------------------------------------------------------------

---[FILE: Interfaces.ts]---
Location: n8n-master/packages/nodes-base/nodes/Mattermost/v1/actions/Interfaces.ts
Signals: N/A
Excerpt (<=80 chars):  export type Mattermost = AllEntities<MattermostMap>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Mattermost
- MattermostChannel
- MattermostMessage
- MattermostReaction
- MattermostUser
- ChannelProperties
- MessageProperties
- ReactionProperties
- UserProperties
- IAttachment
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Mautic/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function validateJSON(json: string | undefined): any {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- validateJSON
```

--------------------------------------------------------------------------------

---[FILE: Mautic.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Mautic/Mautic.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Mautic implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Mautic
```

--------------------------------------------------------------------------------

---[FILE: MauticTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Mautic/MauticTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class MauticTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MauticTrigger
```

--------------------------------------------------------------------------------

---[FILE: Medium.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Medium/Medium.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Medium implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Medium
```

--------------------------------------------------------------------------------

---[FILE: Merge.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Merge/Merge.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Merge extends VersionedNodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Merge
```

--------------------------------------------------------------------------------

---[FILE: MergeV1.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Merge/v1/MergeV1.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class MergeV1 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MergeV1
```

--------------------------------------------------------------------------------

---[FILE: interfaces.ts]---
Location: n8n-master/packages/nodes-base/nodes/Merge/v2/interfaces.ts
Signals: N/A
Excerpt (<=80 chars):  export type MatchFieldsOptions = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MatchFieldsOptions
- ClashResolveOptions
- MatchFieldsOutput
- MatchFieldsJoinMode
```

--------------------------------------------------------------------------------

---[FILE: MergeV2.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Merge/v2/MergeV2.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class MergeV2 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MergeV2
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/nodes-base/nodes/Merge/v2/utils.ts
Signals: N/A
Excerpt (<=80 chars):  export function addSuffixToEntriesKeys(data: INodeExecutionData[], suffix: s...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- addSuffixToEntriesKeys
- findMatches
- selectMergeMethod
- mergeMatched
- checkMatchFieldsInput
- checkInput
- addSourceField
```

--------------------------------------------------------------------------------

---[FILE: MergeV3.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Merge/v3/MergeV3.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class MergeV3 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MergeV3
```

--------------------------------------------------------------------------------

---[FILE: node.type.ts]---
Location: n8n-master/packages/nodes-base/nodes/Merge/v3/actions/node.type.ts
Signals: N/A
Excerpt (<=80 chars): export type MergeType =

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MergeType
```

--------------------------------------------------------------------------------

---[FILE: append.ts]---
Location: n8n-master/packages/nodes-base/nodes/Merge/v3/actions/mode/append.ts
Signals: N/A
Excerpt (<=80 chars):  export const properties: INodeProperties[] = [numberInputsProperty];

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: chooseBranch.ts]---
Location: n8n-master/packages/nodes-base/nodes/Merge/v3/actions/mode/chooseBranch.ts
Signals: N/A
Excerpt (<=80 chars):  export const properties: INodeProperties[] = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: combineAll.ts]---
Location: n8n-master/packages/nodes-base/nodes/Merge/v3/actions/mode/combineAll.ts
Signals: N/A
Excerpt (<=80 chars):  export const properties: INodeProperties[] = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: combineByFields.ts]---
Location: n8n-master/packages/nodes-base/nodes/Merge/v3/actions/mode/combineByFields.ts
Signals: N/A
Excerpt (<=80 chars):  export const properties: INodeProperties[] = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: combineByPosition.ts]---
Location: n8n-master/packages/nodes-base/nodes/Merge/v3/actions/mode/combineByPosition.ts
Signals: N/A
Excerpt (<=80 chars):  export const properties: INodeProperties[] = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: combineBySql.ts]---
Location: n8n-master/packages/nodes-base/nodes/Merge/v3/actions/mode/combineBySql.ts
Signals: N/A
Excerpt (<=80 chars):  export const properties: INodeProperties[] = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: interfaces.ts]---
Location: n8n-master/packages/nodes-base/nodes/Merge/v3/helpers/interfaces.ts
Signals: N/A
Excerpt (<=80 chars):  export type MatchFieldsOptions = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MatchFieldsOptions
- ClashResolveOptions
- MatchFieldsOutput
- MatchFieldsJoinMode
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/nodes-base/nodes/Merge/v3/helpers/utils.ts
Signals: N/A
Excerpt (<=80 chars):  export function addSuffixToEntriesKeys(data: INodeExecutionData[], suffix: s...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- addSuffixToEntriesKeys
- findMatches
- selectMergeMethod
- mergeMatched
- checkMatchFieldsInput
- checkInput
- addSourceField
- getNodeInputsData
- modifySelectQuery
- configuredInputs
- rowToExecutionData
```

--------------------------------------------------------------------------------

---[FILE: MessageBird.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/MessageBird/MessageBird.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class MessageBird implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MessageBird
```

--------------------------------------------------------------------------------

---[FILE: DatabasesDescription.ts]---
Location: n8n-master/packages/nodes-base/nodes/Metabase/DatabasesDescription.ts
Signals: TypeORM
Excerpt (<=80 chars):  export const databasesOperations: INodeProperties[] = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Metabase.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Metabase/Metabase.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Metabase implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Metabase
```

--------------------------------------------------------------------------------

---[FILE: AzureCosmosDb.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Microsoft/AzureCosmosDb/AzureCosmosDb.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class AzureCosmosDb implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AzureCosmosDb
```

--------------------------------------------------------------------------------

---[FILE: create.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Microsoft/AzureCosmosDb/descriptions/container/create.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: delete.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Microsoft/AzureCosmosDb/descriptions/container/delete.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: get.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Microsoft/AzureCosmosDb/descriptions/container/get.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: getAll.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Microsoft/AzureCosmosDb/descriptions/container/getAll.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: create.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Microsoft/AzureCosmosDb/descriptions/item/create.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: delete.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Microsoft/AzureCosmosDb/descriptions/item/delete.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: get.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Microsoft/AzureCosmosDb/descriptions/item/get.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: getAll.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Microsoft/AzureCosmosDb/descriptions/item/getAll.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: query.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Microsoft/AzureCosmosDb/descriptions/item/query.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: update.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Microsoft/AzureCosmosDb/descriptions/item/update.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: n8n-master/packages/nodes-base/nodes/Microsoft/AzureCosmosDb/helpers/constants.ts
Signals: N/A
Excerpt (<=80 chars): export const RESOURCE_TYPES = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RESOURCE_TYPES
- CURRENT_VERSION
- HeaderConstants
```

--------------------------------------------------------------------------------

---[FILE: errorHandler.ts]---
Location: n8n-master/packages/nodes-base/nodes/Microsoft/AzureCosmosDb/helpers/errorHandler.ts
Signals: N/A
Excerpt (<=80 chars):  export const ErrorMap = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ErrorMap
```

--------------------------------------------------------------------------------

---[FILE: interfaces.ts]---
Location: n8n-master/packages/nodes-base/nodes/Microsoft/AzureCosmosDb/helpers/interfaces.ts
Signals: N/A
Excerpt (<=80 chars): export interface ICosmosDbCredentials {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ICosmosDbCredentials
- IErrorResponse
- IContainer
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/nodes-base/nodes/Microsoft/AzureCosmosDb/helpers/utils.ts
Signals: N/A
Excerpt (<=80 chars):  export function processJsonInput<T>(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- untilContainerSelected
- untilItemSelected
```

--------------------------------------------------------------------------------

---[FILE: credentials.ts]---
Location: n8n-master/packages/nodes-base/nodes/Microsoft/AzureCosmosDb/test/credentials.ts
Signals: N/A
Excerpt (<=80 chars): export const credentials = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- credentials
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Microsoft/Dynamics/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function adjustAddresses(addresses: [{ [key: string]: string }]) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- adjustAddresses
- getAccountFields
- sort
- IField
```

--------------------------------------------------------------------------------

---[FILE: MicrosoftDynamicsCrm.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Microsoft/Dynamics/MicrosoftDynamicsCrm.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class MicrosoftDynamicsCrm implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MicrosoftDynamicsCrm
```

--------------------------------------------------------------------------------

---[FILE: MicrosoftEntra.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Microsoft/Entra/MicrosoftEntra.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class MicrosoftEntra implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MicrosoftEntra
```

--------------------------------------------------------------------------------

---[FILE: mocks.ts]---
Location: n8n-master/packages/nodes-base/nodes/Microsoft/Entra/test/mocks.ts
Signals: N/A
Excerpt (<=80 chars):  export const microsoftEntraApiResponse = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- microsoftEntraApiResponse
- microsoftEntraNodeResponse
```

--------------------------------------------------------------------------------

---[FILE: MicrosoftExcel.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Microsoft/Excel/MicrosoftExcel.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class MicrosoftExcel extends VersionedNodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MicrosoftExcel
```

--------------------------------------------------------------------------------

---[FILE: credentials.ts]---
Location: n8n-master/packages/nodes-base/nodes/Microsoft/Excel/test/credentials.ts
Signals: N/A
Excerpt (<=80 chars): export const credentials = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- credentials
```

--------------------------------------------------------------------------------

---[FILE: MicrosoftExcelV1.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Microsoft/Excel/v1/MicrosoftExcelV1.node.ts
Signals: N/A
Excerpt (<=80 chars): export class MicrosoftExcelV1 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MicrosoftExcelV1
```

--------------------------------------------------------------------------------

---[FILE: MicrosoftExcelV2.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Microsoft/Excel/v2/MicrosoftExcelV2.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class MicrosoftExcelV2 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MicrosoftExcelV2
```

--------------------------------------------------------------------------------

---[FILE: node.type.ts]---
Location: n8n-master/packages/nodes-base/nodes/Microsoft/Excel/v2/actions/node.type.ts
Signals: N/A
Excerpt (<=80 chars):  export type MicrosoftExcel = AllEntities<MicrosoftExcelMap>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MicrosoftExcel
- MicrosoftExcelChannel
- MicrosoftExcelMessage
- MicrosoftExcelMember
```

--------------------------------------------------------------------------------

````
