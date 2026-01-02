---
source_txt: fullstack_samples/n8n-master
converted_utc: 2025-12-18T10:47:15Z
part: 47
parts_total: 51
---

# FULLSTACK CODE DATABASE SAMPLES n8n-master

## Extracted Reusable Patterns (Non-verbatim) (Part 47 of 51)

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

---[FILE: get.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Splunk/v2/actions/user/get.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: getAll.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Splunk/v2/actions/user/getAll.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: update.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Splunk/v2/actions/user/update.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: interfaces.ts]---
Location: n8n-master/packages/nodes-base/nodes/Splunk/v2/helpers/interfaces.ts
Signals: N/A
Excerpt (<=80 chars):  export type SplunkCredentials = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SplunkCredentials
- SplunkFeedResponse
- SplunkError
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/nodes-base/nodes/Splunk/v2/helpers/utils.ts
Signals: N/A
Excerpt (<=80 chars):  export function formatEntry(entry: any, doNotFormatContent = false): any {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- formatEntry
- extractErrorDescription
- toUnixEpoch
- formatFeed
- setReturnAllOrLimit
- populate
- getId
```

--------------------------------------------------------------------------------

---[FILE: Spotify.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Spotify/Spotify.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Spotify implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Spotify
```

--------------------------------------------------------------------------------

---[FILE: apiResponses.ts]---
Location: n8n-master/packages/nodes-base/nodes/Spotify/__tests__/workflow/apiResponses.ts
Signals: N/A
Excerpt (<=80 chars):  export const searchForAlbum = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- searchForAlbum
- getNewReleases
- getAlbumTracks
- getArtist
- getAlbum
```

--------------------------------------------------------------------------------

---[FILE: SpreadsheetFile.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/SpreadsheetFile/SpreadsheetFile.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class SpreadsheetFile extends VersionedNodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SpreadsheetFile
```

--------------------------------------------------------------------------------

---[FILE: SpreadsheetFileV1.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/SpreadsheetFile/v1/SpreadsheetFileV1.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class SpreadsheetFileV1 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SpreadsheetFileV1
```

--------------------------------------------------------------------------------

---[FILE: fromFile.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/SpreadsheetFile/v2/fromFile.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description: INodeProperties[] = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FromFileOptions
```

--------------------------------------------------------------------------------

---[FILE: SpreadsheetFileV2.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/SpreadsheetFile/v2/SpreadsheetFileV2.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class SpreadsheetFileV2 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SpreadsheetFileV2
```

--------------------------------------------------------------------------------

---[FILE: SseTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/SseTrigger/SseTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class SseTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SseTrigger
```

--------------------------------------------------------------------------------

---[FILE: Ssh.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Ssh/Ssh.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Ssh implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Ssh
```

--------------------------------------------------------------------------------

---[FILE: GenericFunction.ts]---
Location: n8n-master/packages/nodes-base/nodes/Stackby/GenericFunction.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IRecord {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IRecord
```

--------------------------------------------------------------------------------

---[FILE: Stackby.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Stackby/Stackby.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Stackby implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Stackby
```

--------------------------------------------------------------------------------

---[FILE: StickyNote.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/StickyNote/StickyNote.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class StickyNote implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- StickyNote
```

--------------------------------------------------------------------------------

---[FILE: StopAndError.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/StopAndError/StopAndError.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class StopAndError implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- StopAndError
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/nodes-base/nodes/StopAndError/utils.ts
Signals: N/A
Excerpt (<=80 chars):  export interface ErrorHandlerResult {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createErrorFromParameters
- ErrorHandlerResult
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Storyblok/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function validateJSON(json: string | undefined): any {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- validateJSON
```

--------------------------------------------------------------------------------

---[FILE: Storyblok.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Storyblok/Storyblok.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Storyblok implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Storyblok
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Strapi/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function validateJSON(json: string | undefined): any {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- validateJSON
```

--------------------------------------------------------------------------------

---[FILE: Strapi.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Strapi/Strapi.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Strapi implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Strapi
```

--------------------------------------------------------------------------------

---[FILE: Strava.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Strava/Strava.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Strava implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Strava
```

--------------------------------------------------------------------------------

---[FILE: StravaTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Strava/StravaTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class StravaTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- StravaTrigger
```

--------------------------------------------------------------------------------

---[FILE: helpers.ts]---
Location: n8n-master/packages/nodes-base/nodes/Stripe/helpers.ts
Signals: N/A
Excerpt (<=80 chars): export function adjustMetadata(fields: {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- adjustMetadata
- adjustChargeFields
- adjustCustomerFields
```

--------------------------------------------------------------------------------

---[FILE: Stripe.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Stripe/Stripe.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Stripe implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Stripe
```

--------------------------------------------------------------------------------

---[FILE: StripeTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Stripe/StripeTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class StripeTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- StripeTrigger
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Supabase/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function getSchemaHeader(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getSchemaHeader
- getFilters
- buildQuery
- buildOrQuery
- buildGetQuery
```

--------------------------------------------------------------------------------

---[FILE: Supabase.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Supabase/Supabase.node.ts
Signals: N/A
Excerpt (<=80 chars):  export type FieldsUiValues = Array<{

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Supabase
- FieldsUiValues
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/SurveyMonkey/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function idsExist(ids: string[], surveyIds: string[]) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- idsExist
```

--------------------------------------------------------------------------------

---[FILE: Interfaces.ts]---
Location: n8n-master/packages/nodes-base/nodes/SurveyMonkey/Interfaces.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IImage {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IImage
- IChoice
- IRow
- IOther
- IQuestion
- IAnswer
```

--------------------------------------------------------------------------------

---[FILE: SurveyMonkeyTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/SurveyMonkey/SurveyMonkeyTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class SurveyMonkeyTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SurveyMonkeyTrigger
```

--------------------------------------------------------------------------------

---[FILE: Switch.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Switch/Switch.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Switch extends VersionedNodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Switch
```

--------------------------------------------------------------------------------

---[FILE: SwitchV1.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Switch/V1/SwitchV1.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class SwitchV1 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SwitchV1
```

--------------------------------------------------------------------------------

---[FILE: SwitchV2.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Switch/V2/SwitchV2.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class SwitchV2 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SwitchV2
```

--------------------------------------------------------------------------------

---[FILE: SwitchV3.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Switch/V3/SwitchV3.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class SwitchV3 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SwitchV3
```

--------------------------------------------------------------------------------

---[FILE: SyncroMsp.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/SyncroMSP/SyncroMsp.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class SyncroMsp extends VersionedNodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SyncroMsp
```

--------------------------------------------------------------------------------

---[FILE: SyncroMspV1.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/SyncroMSP/v1/SyncroMspV1.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class SyncroMspV1 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SyncroMspV1
```

--------------------------------------------------------------------------------

---[FILE: Interfaces.ts]---
Location: n8n-master/packages/nodes-base/nodes/SyncroMSP/v1/actions/Interfaces.ts
Signals: N/A
Excerpt (<=80 chars):  export type SyncroMsp = AllEntities<SyncroMspMap>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SyncroMsp
- SyncroMspMapContact
- SyncroMspMapCustomer
- SyncroMspMapRmm
- SyncroMspMapTicket
- ContactProperties
- CustomerProperties
- RmmProperties
- TicketProperties
- IAttachment
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: n8n-master/packages/nodes-base/nodes/SyncroMSP/v1/actions/contact/index.ts
Signals: N/A
Excerpt (<=80 chars):  export const descriptions = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- descriptions
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: n8n-master/packages/nodes-base/nodes/SyncroMSP/v1/actions/customer/index.ts
Signals: N/A
Excerpt (<=80 chars):  export const descriptions = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- descriptions
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: n8n-master/packages/nodes-base/nodes/SyncroMSP/v1/actions/rmm/index.ts
Signals: N/A
Excerpt (<=80 chars):  export const descriptions = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- descriptions
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: n8n-master/packages/nodes-base/nodes/SyncroMSP/v1/actions/ticket/index.ts
Signals: N/A
Excerpt (<=80 chars):  export const descriptions = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- descriptions
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Taiga/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function getAutomaticSecret(credentials: ICredentialDataDecryptedObje...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getAutomaticSecret
- throwOnEmptyUpdate
- toOptions
```

--------------------------------------------------------------------------------

---[FILE: Taiga.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Taiga/Taiga.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Taiga implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Taiga
```

--------------------------------------------------------------------------------

---[FILE: TaigaTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Taiga/TaigaTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class TaigaTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TaigaTrigger
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/nodes-base/nodes/Taiga/types.ts
Signals: N/A
Excerpt (<=80 chars): export type Resource = 'epic' | 'issue' | 'task' | 'userStory';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Resource
- Operation
- LoadedResource
- LoadOption
- LoadedUser
- LoadedUserStory
- LoadedEpic
- LoadedTags
- Operations
- Resources
- WebhookPayload
```

--------------------------------------------------------------------------------

---[FILE: Tapfiliate.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Tapfiliate/Tapfiliate.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Tapfiliate implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Tapfiliate
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Telegram/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars): export interface IMarkupKeyboard {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- addAdditionalFields
- getImageBySize
- getPropertyName
- getSecretToken
- createSendAndWaitMessageBody
- IMarkupKeyboard
- IMarkupKeyboardRow
- IMarkupKeyboardButton
- ITelegramInlineReply
- ITelegramKeyboardButton
- ITelegramReplyKeyboard
- IMarkupForceReply
- IMarkupReplyKeyboardOptions
- IMarkupReplyKeyboardRemove
```

--------------------------------------------------------------------------------

---[FILE: IEvent.ts]---
Location: n8n-master/packages/nodes-base/nodes/Telegram/IEvent.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IEvent {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IEvent
```

--------------------------------------------------------------------------------

---[FILE: Telegram.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Telegram/Telegram.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Telegram implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Telegram
```

--------------------------------------------------------------------------------

---[FILE: TelegramTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Telegram/TelegramTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class TelegramTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TelegramTrigger
```

--------------------------------------------------------------------------------

---[FILE: Helpers.ts]---
Location: n8n-master/packages/nodes-base/nodes/Telegram/tests/Helpers.ts
Signals: N/A
Excerpt (<=80 chars):  export const telegramNode: INode = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createMockExecuteFunction
```

--------------------------------------------------------------------------------

---[FILE: apiResponses.ts]---
Location: n8n-master/packages/nodes-base/nodes/Telegram/tests/Workflow/apiResponses.ts
Signals: N/A
Excerpt (<=80 chars): export const getChatResponse = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getChatResponse
- sendMessageResponse
- sendMediaGroupResponse
- sendLocationMessageResponse
- okTrueResponse
- sendStickerResponse
- editMessageTextResponse
- chatAdministratorsResponse
- sendAnimationMessageResponse
- sendAudioResponse
- getMemberResponse
- sendMessageWithBinaryDataAndReplyMarkupResponse
```

--------------------------------------------------------------------------------

---[FILE: triggerUtils.ts]---
Location: n8n-master/packages/nodes-base/nodes/Telegram/util/triggerUtils.ts
Signals: N/A
Excerpt (<=80 chars):  export const downloadFile = async (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- downloadFile
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/TheHive/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars): export function mapResource(resource: string): string {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mapResource
- splitTags
- prepareOptional
- buildCustomFieldSearch
- prepareSortQuery
- prepareRangeQuery
```

--------------------------------------------------------------------------------

---[FILE: QueryFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/TheHive/QueryFunctions.ts
Signals: N/A
Excerpt (<=80 chars): export type IQueryObject = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Eq
- Gt
- Gte
- Lt
- Lte
- And
- Or
- Not
- In
- Contains
- Id
- Between
- ParentId
- Parent
- Child
- Type
- queryString
- Like
```

--------------------------------------------------------------------------------

---[FILE: TheHive.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/TheHive/TheHive.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class TheHive implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TheHive
```

--------------------------------------------------------------------------------

---[FILE: TheHiveTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/TheHive/TheHiveTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class TheHiveTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TheHiveTrigger
```

--------------------------------------------------------------------------------

---[FILE: AlertInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/TheHive/interfaces/AlertInterface.ts
Signals: N/A
Excerpt (<=80 chars):  export const AlertStatuses = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AlertStatuses
- TLPs
- AlertStatus
- TLP
- IAlert
```

--------------------------------------------------------------------------------

---[FILE: CaseInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/TheHive/interfaces/CaseInterface.ts
Signals: N/A
Excerpt (<=80 chars): export interface ICase {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CaseStatuses
- CaseResolutionStatuses
- CaseImpactStatuses
- CaseStatus
- CaseResolutionStatus
- CaseImpactStatus
- ICase
```

--------------------------------------------------------------------------------

---[FILE: LogInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/TheHive/interfaces/LogInterface.ts
Signals: N/A
Excerpt (<=80 chars):  export const LogStatuses = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LogStatuses
- LogStatus
- ILog
```

--------------------------------------------------------------------------------

---[FILE: ObservableInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/TheHive/interfaces/ObservableInterface.ts
Signals: N/A
Excerpt (<=80 chars):  export const ObservableStatuses = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ObservableStatuses
- ObservableDataTypes
- ObservableStatus
- ObservableDataType
- IAttachment
- IObservable
```

--------------------------------------------------------------------------------

---[FILE: TaskInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/TheHive/interfaces/TaskInterface.ts
Signals: N/A
Excerpt (<=80 chars): export interface ITask {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TaskStatuses
- TaskStatus
- ITask
```

--------------------------------------------------------------------------------

---[FILE: TheHiveProject.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/TheHiveProject/TheHiveProject.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class TheHiveProject implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TheHiveProject
```

--------------------------------------------------------------------------------

---[FILE: TheHiveProjectTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/TheHiveProject/TheHiveProjectTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class TheHiveProjectTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TheHiveProjectTrigger
```

--------------------------------------------------------------------------------

---[FILE: node.type.ts]---
Location: n8n-master/packages/nodes-base/nodes/TheHiveProject/actions/node.type.ts
Signals: N/A
Excerpt (<=80 chars):  export type TheHiveType = AllEntities<NodeMap>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TheHiveType
```

--------------------------------------------------------------------------------

---[FILE: create.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/TheHiveProject/actions/alert/create.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: deleteAlert.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/TheHiveProject/actions/alert/deleteAlert.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: executeResponder.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/TheHiveProject/actions/alert/executeResponder.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: get.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/TheHiveProject/actions/alert/get.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: merge.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/TheHiveProject/actions/alert/merge.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: promote.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/TheHiveProject/actions/alert/promote.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: search.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/TheHiveProject/actions/alert/search.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: status.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/TheHiveProject/actions/alert/status.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: update.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/TheHiveProject/actions/alert/update.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: addAttachment.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/TheHiveProject/actions/case/addAttachment.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: create.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/TheHiveProject/actions/case/create.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: deleteAttachment.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/TheHiveProject/actions/case/deleteAttachment.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: deleteCase.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/TheHiveProject/actions/case/deleteCase.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: executeResponder.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/TheHiveProject/actions/case/executeResponder.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: get.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/TheHiveProject/actions/case/get.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: getAttachment.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/TheHiveProject/actions/case/getAttachment.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: getTimeline.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/TheHiveProject/actions/case/getTimeline.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: search.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/TheHiveProject/actions/case/search.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: update.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/TheHiveProject/actions/case/update.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: add.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/TheHiveProject/actions/comment/add.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: deleteComment.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/TheHiveProject/actions/comment/deleteComment.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: search.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/TheHiveProject/actions/comment/search.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: update.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/TheHiveProject/actions/comment/update.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: addAttachment.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/TheHiveProject/actions/log/addAttachment.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: create.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/TheHiveProject/actions/log/create.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: deleteAttachment.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/TheHiveProject/actions/log/deleteAttachment.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: deleteLog.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/TheHiveProject/actions/log/deleteLog.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: executeResponder.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/TheHiveProject/actions/log/executeResponder.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: get.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/TheHiveProject/actions/log/get.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: search.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/TheHiveProject/actions/log/search.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: create.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/TheHiveProject/actions/observable/create.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

````
