---
source_txt: fullstack_samples/n8n-master
converted_utc: 2025-12-18T10:47:15Z
part: 40
parts_total: 51
---

# FULLSTACK CODE DATABASE SAMPLES n8n-master

## Extracted Reusable Patterns (Non-verbatim) (Part 40 of 51)

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

---[FILE: GoogleAnalytics.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Analytics/GoogleAnalytics.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class GoogleAnalytics extends VersionedNodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GoogleAnalytics
```

--------------------------------------------------------------------------------

---[FILE: GoogleAnalyticsV2.node.test.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Analytics/test/v2/GoogleAnalyticsV2.node.test.ts
Signals: TypeORM
Excerpt (<=80 chars): import { NodeTestHarness } from '@nodes-testing/node-test-harness';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Analytics/v1/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function simplify(responseData: any | [any]) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- simplify
- merge
```

--------------------------------------------------------------------------------

---[FILE: GoogleAnalyticsV1.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Analytics/v1/GoogleAnalyticsV1.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class GoogleAnalyticsV1 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GoogleAnalyticsV1
```

--------------------------------------------------------------------------------

---[FILE: Interfaces.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Analytics/v1/Interfaces.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IData {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IData
- IDimension
- IDimensionFilter
- IMetric
```

--------------------------------------------------------------------------------

---[FILE: GoogleAnalyticsV2.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Analytics/v2/GoogleAnalyticsV2.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class GoogleAnalyticsV2 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GoogleAnalyticsV2
```

--------------------------------------------------------------------------------

---[FILE: node.type.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Analytics/v2/actions/node.type.ts
Signals: N/A
Excerpt (<=80 chars):  export type GoogleAnalytics = AllEntities<GoogleAnalyticsMap>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GoogleAnalytics
- GoogleAnalyticsUserActivity
- GoogleAnalyticReport
- ReportBasedOnProperty
```

--------------------------------------------------------------------------------

---[FILE: Interfaces.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Analytics/v2/helpers/Interfaces.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IData {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IData
- IDimension
- IDimensionFilter
- IMetric
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Analytics/v2/helpers/utils.ts
Signals: N/A
Excerpt (<=80 chars): export function simplify(responseData: any | [any]) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- simplify
- merge
- simplifyGA4
- processFilters
- prepareDateRange
- checkDuplicates
- sortLoadOptions
- defaultStartDate
- defaultEndDate
```

--------------------------------------------------------------------------------

---[FILE: GoogleBigQuery.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/BigQuery/GoogleBigQuery.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class GoogleBigQuery extends VersionedNodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GoogleBigQuery
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/BigQuery/v1/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function simplify(rows: IDataObject[], fields: string[]) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- simplify
```

--------------------------------------------------------------------------------

---[FILE: GoogleBigQueryV1.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/BigQuery/v1/GoogleBigQueryV1.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class GoogleBigQueryV1 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GoogleBigQueryV1
```

--------------------------------------------------------------------------------

---[FILE: GoogleBigQueryV2.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/BigQuery/v2/GoogleBigQueryV2.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class GoogleBigQueryV2 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GoogleBigQueryV2
```

--------------------------------------------------------------------------------

---[FILE: node.type.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/BigQuery/v2/actions/node.type.ts
Signals: N/A
Excerpt (<=80 chars):  export type GoogleBigQuery = AllEntities<GoogleBigQueryMap>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GoogleBigQuery
- GoogleBigQueryDatabase
```

--------------------------------------------------------------------------------

---[FILE: executeQuery.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/BigQuery/v2/actions/database/executeQuery.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: insert.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/BigQuery/v2/actions/database/insert.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: interfaces.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/BigQuery/v2/helpers/interfaces.ts
Signals: N/A
Excerpt (<=80 chars):  export type SchemaField = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SchemaField
- TableSchema
- TableRawData
- JobReference
- ResponseWithJobReference
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/BigQuery/v2/helpers/utils.ts
Signals: N/A
Excerpt (<=80 chars):  export function wrapData(data: IDataObject | IDataObject[]): INodeExecutionD...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- wrapData
- simplify
- prepareOutput
- checkSchema
```

--------------------------------------------------------------------------------

---[FILE: GoogleBooks.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Books/GoogleBooks.node.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IGoogleAuthCredentials {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GoogleBooks
- IGoogleAuthCredentials
```

--------------------------------------------------------------------------------

---[FILE: GoogleBusinessProfile.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/BusinessProfile/GoogleBusinessProfile.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class GoogleBusinessProfile implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GoogleBusinessProfile
```

--------------------------------------------------------------------------------

---[FILE: GoogleBusinessProfileTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/BusinessProfile/GoogleBusinessProfileTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class GoogleBusinessProfileTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GoogleBusinessProfileTrigger
```

--------------------------------------------------------------------------------

---[FILE: Interfaces.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/BusinessProfile/Interfaces.ts
Signals: N/A
Excerpt (<=80 chars):  export interface ITimeInterval {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ITimeInterval
- IReviewReply
```

--------------------------------------------------------------------------------

---[FILE: EventInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Calendar/EventInterface.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IReminder {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RecurringEventInstance
- IReminder
- IConferenceData
- IEvent
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Calendar/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function encodeURIComponentOnce(uri: string) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- encodeURIComponentOnce
- addNextOccurrence
- addTimezoneToDate
- TIMEZONE_VALIDATION_REGEX
- eventExtendYearIntoFuture
- RecurrentEvent
```

--------------------------------------------------------------------------------

---[FILE: GoogleCalendar.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Calendar/GoogleCalendar.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class GoogleCalendar implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GoogleCalendar
```

--------------------------------------------------------------------------------

---[FILE: GoogleCalendarTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Calendar/GoogleCalendarTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class GoogleCalendarTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GoogleCalendarTrigger
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Chat/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function validateJSON(json: string | undefined): any {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- validateJSON
- getPagingParameters
- createSendAndWaitMessageBody
```

--------------------------------------------------------------------------------

---[FILE: GoogleChat.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Chat/GoogleChat.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class GoogleChat implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GoogleChat
```

--------------------------------------------------------------------------------

---[FILE: MessageInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Chat/MessageInterface.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IMessage {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Type
- IMessage
- IMessageUi
- IUser
```

--------------------------------------------------------------------------------

---[FILE: GoogleCloudNaturalLanguage.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/CloudNaturalLanguage/GoogleCloudNaturalLanguage.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class GoogleCloudNaturalLanguage implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GoogleCloudNaturalLanguage
```

--------------------------------------------------------------------------------

---[FILE: Interface.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/CloudNaturalLanguage/Interface.ts
Signals: N/A
Excerpt (<=80 chars): export interface IData {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IData
- IDocument
```

--------------------------------------------------------------------------------

---[FILE: GoogleCloudStorage.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/CloudStorage/GoogleCloudStorage.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class GoogleCloudStorage implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GoogleCloudStorage
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Contacts/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export const allFields = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- cleanData
- allFields
```

--------------------------------------------------------------------------------

---[FILE: GoogleContacts.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Contacts/GoogleContacts.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class GoogleContacts implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GoogleContacts
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Docs/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export const hasKeys = (obj = {}) => Object.keys(obj).length > 0;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- hasKeys
- extractID
- upperFirst
```

--------------------------------------------------------------------------------

---[FILE: GoogleDocs.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Docs/GoogleDocs.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class GoogleDocs implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GoogleDocs
```

--------------------------------------------------------------------------------

---[FILE: interfaces.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Docs/interfaces.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IUpdateBody extends IDataObject {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IUpdateFields
- IUpdateBody
```

--------------------------------------------------------------------------------

---[FILE: GoogleDrive.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Drive/GoogleDrive.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class GoogleDrive extends VersionedNodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GoogleDrive
```

--------------------------------------------------------------------------------

---[FILE: GoogleDriveTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Drive/GoogleDriveTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class GoogleDriveTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GoogleDriveTrigger
```

--------------------------------------------------------------------------------

---[FILE: helpers.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Drive/test/v2/node/helpers.ts
Signals: N/A
Excerpt (<=80 chars):  export const driveNode: INode = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createTestStream
- createMockExecuteFunction
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Drive/v1/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function extractId(url: string): string {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- extractId
```

--------------------------------------------------------------------------------

---[FILE: GoogleDriveV1.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Drive/v1/GoogleDriveV1.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class GoogleDriveV1 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GoogleDriveV1
```

--------------------------------------------------------------------------------

---[FILE: GoogleDriveV2.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Drive/v2/GoogleDriveV2.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class GoogleDriveV2 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GoogleDriveV2
```

--------------------------------------------------------------------------------

---[FILE: common.descriptions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Drive/v2/actions/common.descriptions.ts
Signals: N/A
Excerpt (<=80 chars):  export const fileRLC: INodeProperties = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- fileTypesOptions
```

--------------------------------------------------------------------------------

---[FILE: node.type.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Drive/v2/actions/node.type.ts
Signals: N/A
Excerpt (<=80 chars):  export type GoogleDriveType = AllEntities<NodeMap>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GoogleDriveType
```

--------------------------------------------------------------------------------

---[FILE: create.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Drive/v2/actions/drive/create.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: deleteDrive.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Drive/v2/actions/drive/deleteDrive.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: get.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Drive/v2/actions/drive/get.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: list.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Drive/v2/actions/drive/list.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: update.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Drive/v2/actions/drive/update.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: copy.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Drive/v2/actions/file/copy.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: createFromText.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Drive/v2/actions/file/createFromText.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: deleteFile.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Drive/v2/actions/file/deleteFile.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: download.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Drive/v2/actions/file/download.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: move.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Drive/v2/actions/file/move.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: share.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Drive/v2/actions/file/share.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: update.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Drive/v2/actions/file/update.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: upload.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Drive/v2/actions/file/upload.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: search.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Drive/v2/actions/fileFolder/search.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: create.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Drive/v2/actions/folder/create.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: deleteFolder.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Drive/v2/actions/folder/deleteFolder.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: share.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Drive/v2/actions/folder/share.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: interfaces.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Drive/v2/helpers/interfaces.ts
Signals: N/A
Excerpt (<=80 chars): export const UPLOAD_CHUNK_SIZE = 256 * 1024;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UPLOAD_CHUNK_SIZE
- RLC_DRIVE_DEFAULT
- RLC_FOLDER_DEFAULT
- DRIVE
- SearchFilter
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Drive/v2/helpers/utils.ts
Signals: N/A
Excerpt (<=80 chars):  export function prepareQueryString(fields: string[] | undefined) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- prepareQueryString
- setFileProperties
- setUpdateCommonParams
- updateDriveScopes
- setParentFolder
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Firebase/CloudFirestore/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars): export function jsonToDocument(value: string | number | IDataObject | IDataOb...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- jsonToDocument
- documentToJson
- fullDocumentToJson
```

--------------------------------------------------------------------------------

---[FILE: GoogleFirebaseCloudFirestore.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Firebase/CloudFirestore/GoogleFirebaseCloudFirestore.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class GoogleFirebaseCloudFirestore implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GoogleFirebaseCloudFirestore
```

--------------------------------------------------------------------------------

---[FILE: GoogleFirebaseRealtimeDatabase.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Firebase/RealtimeDatabase/GoogleFirebaseRealtimeDatabase.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class GoogleFirebaseRealtimeDatabase implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GoogleFirebaseRealtimeDatabase
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Gmail/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IAttachments {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- extractEmail
- prepareQuery
- prepareEmailsInput
- prepareEmailBody
- unescapeSnippets
- prepareTimestamp
- IAttachments
```

--------------------------------------------------------------------------------

---[FILE: Gmail.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Gmail/Gmail.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Gmail extends VersionedNodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Gmail
```

--------------------------------------------------------------------------------

---[FILE: GmailTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Gmail/GmailTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class GmailTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GmailTrigger
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Gmail/types.ts
Signals: N/A
Excerpt (<=80 chars): export type Message = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Message
- ListMessage
- MessageListResponse
- Label
- GmailWorkflowStaticData
- GmailWorkflowStaticDataDictionary
- GmailTriggerOptions
- GmailTriggerFilters
- GmailMessage
- GmailMessageMetadata
- GmailUserProfile
```

--------------------------------------------------------------------------------

---[FILE: GmailV1.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Gmail/v1/GmailV1.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class GmailV1 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GmailV1
```

--------------------------------------------------------------------------------

---[FILE: GmailV2.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Gmail/v2/GmailV2.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class GmailV2 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GmailV2
```

--------------------------------------------------------------------------------

---[FILE: GSuiteAdmin.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/GSuiteAdmin/GSuiteAdmin.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class GSuiteAdmin implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GSuiteAdmin
```

--------------------------------------------------------------------------------

---[FILE: GooglePerspective.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Perspective/GooglePerspective.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class GooglePerspective implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GooglePerspective
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Perspective/types.ts
Signals: N/A
Excerpt (<=80 chars): export type CommentAnalyzeBody = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CommentAnalyzeBody
- Language
- Comment
- RequestedAttributes
- AttributesValuesUi
```

--------------------------------------------------------------------------------

---[FILE: GoogleSheets.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Sheet/GoogleSheets.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class GoogleSheets extends VersionedNodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GoogleSheets
```

--------------------------------------------------------------------------------

---[FILE: GoogleSheetsTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Sheet/GoogleSheetsTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export const document: INodeProperties = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GoogleSheetsTrigger
```

--------------------------------------------------------------------------------

---[FILE: GoogleSheetsTrigger.utils.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Sheet/GoogleSheetsTrigger.utils.ts
Signals: N/A
Excerpt (<=80 chars):  export const BINARY_MIME_TYPE = 'application/vnd.openxmlformats-officedocume...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- sheetBinaryToArrayOfArrays
- arrayOfArraysToJson
- compareRevisions
- BINARY_MIME_TYPE
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Sheet/v1/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IGoogleAuthCredentials {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- hexToRgb
- IGoogleAuthCredentials
```

--------------------------------------------------------------------------------

---[FILE: GoogleSheet.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Sheet/v1/GoogleSheet.ts
Signals: N/A
Excerpt (<=80 chars):  export interface ISheetOptions {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GoogleSheet
- ValueInputOption
- ValueRenderOption
- ISheetOptions
- IGoogleAuthCredentials
- ISheetUpdateData
- ILookupValues
- IToDeleteRange
- IToDelete
```

--------------------------------------------------------------------------------

---[FILE: GoogleSheetsV1.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Sheet/v1/GoogleSheetsV1.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class GoogleSheetsV1 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GoogleSheetsV1
```

--------------------------------------------------------------------------------

---[FILE: GoogleSheetsV2.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Sheet/v2/GoogleSheetsV2.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class GoogleSheetsV2 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GoogleSheetsV2
```

--------------------------------------------------------------------------------

---[FILE: GoogleSheet.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Sheet/v2/helpers/GoogleSheet.ts
Signals: N/A
Excerpt (<=80 chars):  export class GoogleSheet {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GoogleSheet
```

--------------------------------------------------------------------------------

---[FILE: GoogleSheets.types.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Sheet/v2/helpers/GoogleSheets.types.ts
Signals: N/A
Excerpt (<=80 chars):  export const ROW_NUMBER = 'row_number';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ROW_NUMBER
- ResourceLocatorUiNames
- ValueInputOption
- ValueRenderOption
- RangeDetectionOptions
- SheetDataRow
- SheetRangeData
- GoogleSheets
- GoogleSheetsSpreadSheet
- GoogleSheetsSheet
- SpreadSheetProperties
- SheetProperties
- ResourceLocator
- SpreadSheetResponse
- SheetCellDecoded
- SheetRangeDecoded
- ISheetOptions
- IGoogleAuthCredentials
```

--------------------------------------------------------------------------------

---[FILE: GoogleSheets.utils.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Sheet/v2/helpers/GoogleSheets.utils.ts
Signals: N/A
Excerpt (<=80 chars):  export const untilSheetSelected = { sheetName: [''] };

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getSpreadsheetId
- getSheetId
- getColumnName
- getColumnNumber
- hexToRgb
- addRowNumber
- trimToFirstEmptyRow
- removeEmptyRows
- trimLeadingEmptyRows
- removeEmptyColumns
- prepareSheetData
- getRangeString
- mapFields
- sortLoadOptions
- cellFormatDefault
- checkForSchemaChanges
- untilSheetSelected
```

--------------------------------------------------------------------------------

---[FILE: GoogleSlides.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Slides/GoogleSlides.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class GoogleSlides implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GoogleSlides
```

--------------------------------------------------------------------------------

---[FILE: GoogleTasks.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Task/GoogleTasks.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class GoogleTasks implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GoogleTasks
```

--------------------------------------------------------------------------------

---[FILE: GoogleTranslate.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/Translate/GoogleTranslate.node.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IGoogleAuthCredentials {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GoogleTranslate
- IGoogleAuthCredentials
```

--------------------------------------------------------------------------------

---[FILE: YouTube.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Google/YouTube/YouTube.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class YouTube implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- YouTube
```

--------------------------------------------------------------------------------

---[FILE: Gotify.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Gotify/Gotify.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Gotify implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Gotify
```

--------------------------------------------------------------------------------

---[FILE: GoToWebinar.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/GoToWebinar/GoToWebinar.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class GoToWebinar implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GoToWebinar
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Grafana/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function tolerateTrailingSlash(baseUrl: string) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- tolerateTrailingSlash
- throwOnEmptyUpdate
- deriveUid
```

--------------------------------------------------------------------------------

---[FILE: Grafana.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Grafana/Grafana.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Grafana implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Grafana
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/nodes-base/nodes/Grafana/types.ts
Signals: N/A
Excerpt (<=80 chars): export type GrafanaCredentials = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GrafanaCredentials
- DashboardUpdatePayload
- DashboardUpdateFields
- LoadedDashboards
- LoadedFolders
- LoadedTeams
- LoadedUsers
```

--------------------------------------------------------------------------------

---[FILE: GraphQL.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/GraphQL/GraphQL.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class GraphQL implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GraphQL
```

--------------------------------------------------------------------------------

````
