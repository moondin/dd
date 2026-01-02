---
source_txt: fullstack_samples/n8n-master
converted_utc: 2025-12-18T10:47:15Z
part: 46
parts_total: 51
---

# FULLSTACK CODE DATABASE SAMPLES n8n-master

## Extracted Reusable Patterns (Non-verbatim) (Part 46 of 51)

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

---[FILE: SalesforceTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Salesforce/SalesforceTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class SalesforceTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SalesforceTrigger
```

--------------------------------------------------------------------------------

---[FILE: TaskInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/Salesforce/TaskInterface.ts
Signals: N/A
Excerpt (<=80 chars): export interface ITask {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ITask
```

--------------------------------------------------------------------------------

---[FILE: UserInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/Salesforce/UserInterface.ts
Signals: N/A
Excerpt (<=80 chars): export interface IUser {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IUser
```

--------------------------------------------------------------------------------

---[FILE: ActivityInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/Salesmate/ActivityInterface.ts
Signals: N/A
Excerpt (<=80 chars): export interface IActivity {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IActivity
```

--------------------------------------------------------------------------------

---[FILE: CompanyInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/Salesmate/CompanyInterface.ts
Signals: N/A
Excerpt (<=80 chars): export interface ICompany {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ICompany
```

--------------------------------------------------------------------------------

---[FILE: DealInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/Salesmate/DealInterface.ts
Signals: N/A
Excerpt (<=80 chars): export interface IDeal {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IDeal
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Salesmate/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function validateJSON(json: string | undefined): any {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- validateJSON
- simplifySalesmateData
```

--------------------------------------------------------------------------------

---[FILE: Salesmate.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Salesmate/Salesmate.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Salesmate implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Salesmate
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Schedule/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function validateInterval(node: INode, itemIndex: number, interval: S...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- validateInterval
- recurrenceCheck
- intervalToRecurrence
- toCronExpression
```

--------------------------------------------------------------------------------

---[FILE: SchedulerInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/Schedule/SchedulerInterface.ts
Signals: N/A
Excerpt (<=80 chars):  export type IRecurrenceRule =

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IRecurrenceRule
- ScheduleInterval
- Rule
```

--------------------------------------------------------------------------------

---[FILE: ScheduleTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Schedule/ScheduleTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class ScheduleTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ScheduleTrigger
```

--------------------------------------------------------------------------------

---[FILE: SeaTable.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/SeaTable/SeaTable.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class SeaTable extends VersionedNodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SeaTable
```

--------------------------------------------------------------------------------

---[FILE: SeaTableTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/SeaTable/SeaTableTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class SeaTableTrigger extends VersionedNodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SeaTableTrigger
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/SeaTable/v1/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function resolveBaseUri(ctx: ICtx) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- resolveBaseUri
- simplify
- getColumns
- getDownloadableColumns
- columnNamesToArray
- columnNamesGlob
- rowsSequence
- rowDeleteInternalColumns
- rowFormatColumns
- rowsFormatColumns
- rowMapKeyToName
- rowExport
- nameOfPredicate
- split
- dtableSchemaIsColumn
- dtableSchemaColumns
- updateAble
```

--------------------------------------------------------------------------------

---[FILE: Interfaces.ts]---
Location: n8n-master/packages/nodes-base/nodes/SeaTable/v1/Interfaces.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IApi {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IApi
- IServerInfo
- IAppAccessToken
- IDtableMetadataColumn
- TDtableViewColumn
- IDtableMetadataTable
- IDtableMetadata
- IEndpointVariables
- IRowObject
- IRow
- IName
- ICredential
- ICtx
- IRowResponse
```

--------------------------------------------------------------------------------

---[FILE: Schema.ts]---
Location: n8n-master/packages/nodes-base/nodes/SeaTable/v1/Schema.ts
Signals: N/A
Excerpt (<=80 chars):  export type ColumnType = keyof typeof schema.columnTypes;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- schema
- ColumnType
```

--------------------------------------------------------------------------------

---[FILE: SeaTableTriggerV1.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/SeaTable/v1/SeaTableTriggerV1.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class SeaTableTriggerV1 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SeaTableTriggerV1
```

--------------------------------------------------------------------------------

---[FILE: SeaTableV1.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/SeaTable/v1/SeaTableV1.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class SeaTableV1 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SeaTableV1
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/nodes-base/nodes/SeaTable/v1/types.ts
Signals: N/A
Excerpt (<=80 chars):  export type TSeaTableServerVersion = '2.0.6';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TSeaTableServerVersion
- TSeaTableServerEdition
- TInheritColumnTypeTime
- TInheritColumnTypeUser
- TColumnType
- TInheritColumnKey
- TColumnValue
- TColumnKey
- TDtableMetadataTables
- TDtableMetadataColumns
- TDtableViewColumns
- TEndpointVariableName
- TMethod
- TEndpointExpr
- TEndpointResolvedExpr
- TDateTimeFormat
- TCredentials
- TTriggerOperation
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/SeaTable/v2/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function resolveBaseUri(ctx: ICtx) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- resolveBaseUri
- simplify_new
- enrichColumns
- splitStringColumnsToArrays
- rowExport
- nameOfPredicate
- split
- dtableSchemaIsColumn
- dtableSchemaColumns
- updateAble
```

--------------------------------------------------------------------------------

---[FILE: Schema.ts]---
Location: n8n-master/packages/nodes-base/nodes/SeaTable/v2/Schema.ts
Signals: N/A
Excerpt (<=80 chars):  export type ColumnType = keyof typeof schema.columnTypes;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- schema
- ColumnType
```

--------------------------------------------------------------------------------

---[FILE: SeaTableTriggerV2.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/SeaTable/v2/SeaTableTriggerV2.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class SeaTableTriggerV2 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SeaTableTriggerV2
```

--------------------------------------------------------------------------------

---[FILE: SeaTableV2.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/SeaTable/v2/SeaTableV2.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class SeaTableV2 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SeaTableV2
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/nodes-base/nodes/SeaTable/v2/types.ts
Signals: N/A
Excerpt (<=80 chars):  export type TSeaTableServerVersion = '2.0.6';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TSeaTableServerVersion
- TSeaTableServerEdition
- TColumnType
- TInheritColumnKey
- TColumnValue
- TColumnKey
- TDtableMetadataTables
- TDtableMetadataColumns
- TDtableViewColumns
- TEndpointVariableName
- TMethod
- TEndpointExpr
- TEndpointResolvedExpr
- TDateTimeFormat
- TCredentials
- TTriggerOperation
- TOperation
- TLoadedResource
```

--------------------------------------------------------------------------------

---[FILE: Interfaces.ts]---
Location: n8n-master/packages/nodes-base/nodes/SeaTable/v2/actions/Interfaces.ts
Signals: N/A
Excerpt (<=80 chars):  export type SeaTable = AllEntities<SeaTableMap>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SeaTable
- SeaTableRow
- SeaTableBase
- SeaTableLink
- SeaTableAsset
- RowProperties
- BaseProperties
- LinkProperties
- AssetProperties
- IApi
- IServerInfo
- IAppAccessToken
- IDtableMetadataColumn
- TDtableViewColumn
- IDtableMetadataTable
- IDtableMetadata
- IEndpointVariables
- IRowObject
```

--------------------------------------------------------------------------------

---[FILE: getPublicURL.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/SeaTable/v2/actions/asset/getPublicURL.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: upload.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/SeaTable/v2/actions/asset/upload.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: collaborator.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/SeaTable/v2/actions/base/collaborator.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const properties: INodeProperties[] = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: metadata.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/SeaTable/v2/actions/base/metadata.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const properties: INodeProperties[] = [];

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: snapshot.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/SeaTable/v2/actions/base/snapshot.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const properties: INodeProperties[] = [];

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: add.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/SeaTable/v2/actions/link/add.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const properties: INodeProperties[] = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: list.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/SeaTable/v2/actions/link/list.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const properties: INodeProperties[] = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: remove.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/SeaTable/v2/actions/link/remove.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const properties: INodeProperties[] = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: create.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/SeaTable/v2/actions/row/create.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const properties: INodeProperties[] = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: get.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/SeaTable/v2/actions/row/get.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const properties: INodeProperties[] = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: list.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/SeaTable/v2/actions/row/list.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const properties: INodeProperties[] = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: search.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/SeaTable/v2/actions/row/search.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const properties: INodeProperties[] = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: update.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/SeaTable/v2/actions/row/update.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const properties: INodeProperties[] = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/SecurityScorecard/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function simplify(data: IDataObject[]) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- simplify
```

--------------------------------------------------------------------------------

---[FILE: SecurityScorecard.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/SecurityScorecard/SecurityScorecard.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class SecurityScorecard implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SecurityScorecard
```

--------------------------------------------------------------------------------

---[FILE: IdentifyInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/Segment/IdentifyInterface.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IIdentify {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IIdentify
```

--------------------------------------------------------------------------------

---[FILE: Segment.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Segment/Segment.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Segment implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Segment
```

--------------------------------------------------------------------------------

---[FILE: TrackInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/Segment/TrackInterface.ts
Signals: N/A
Excerpt (<=80 chars):  export interface ITrack {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ITrack
- IGroup
```

--------------------------------------------------------------------------------

---[FILE: MailDescription.ts]---
Location: n8n-master/packages/nodes-base/nodes/SendGrid/MailDescription.ts
Signals: N/A
Excerpt (<=80 chars):  export const mailOperations: INodeProperties[] = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SendMailBody
```

--------------------------------------------------------------------------------

---[FILE: SendGrid.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/SendGrid/SendGrid.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class SendGrid implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SendGrid
```

--------------------------------------------------------------------------------

---[FILE: Sendy.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Sendy/Sendy.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Sendy implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Sendy
```

--------------------------------------------------------------------------------

---[FILE: Interface.ts]---
Location: n8n-master/packages/nodes-base/nodes/SentryIo/Interface.ts
Signals: N/A
Excerpt (<=80 chars): export interface ICommit {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ICommit
- IPatchSet
- IRef
```

--------------------------------------------------------------------------------

---[FILE: SentryIo.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/SentryIo/SentryIo.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class SentryIo implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SentryIo
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/ServiceNow/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export const mapEndpoint = (resource: string, _operation: string) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mapEndpoint
- sortData
```

--------------------------------------------------------------------------------

---[FILE: ServiceNow.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/ServiceNow/ServiceNow.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class ServiceNow implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ServiceNow
```

--------------------------------------------------------------------------------

---[FILE: Set.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Set/Set.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Set extends VersionedNodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Set
```

--------------------------------------------------------------------------------

---[FILE: utils.test.ts]---
Location: n8n-master/packages/nodes-base/nodes/Set/test/v2/utils.test.ts
Signals: N/A
Excerpt (<=80 chars):  export const node: INode = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createMockExecuteFunction
```

--------------------------------------------------------------------------------

---[FILE: SetV1.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Set/v1/SetV1.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class SetV1 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SetV1
```

--------------------------------------------------------------------------------

---[FILE: manual.mode.ts]---
Location: n8n-master/packages/nodes-base/nodes/Set/v2/manual.mode.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: raw.mode.ts]---
Location: n8n-master/packages/nodes-base/nodes/Set/v2/raw.mode.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: SetV2.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Set/v2/SetV2.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class SetV2 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SetV2
```

--------------------------------------------------------------------------------

---[FILE: interfaces.ts]---
Location: n8n-master/packages/nodes-base/nodes/Set/v2/helpers/interfaces.ts
Signals: N/A
Excerpt (<=80 chars):  export type SetNodeOptions = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- INCLUDE
- SetNodeOptions
- SetField
- AssignmentSetField
- IncludeMods
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/nodes-base/nodes/Set/v2/helpers/utils.ts
Signals: N/A
Excerpt (<=80 chars):  export function composeReturnItem(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- composeReturnItem
- resolveRawData
- prepareReturnItem
- parseJsonParameter
- validateEntry
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Shopify/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function keysToSnakeCase(elements: IDataObject[] | IDataObject): IDat...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- keysToSnakeCase
```

--------------------------------------------------------------------------------

---[FILE: OrderInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/Shopify/OrderInterface.ts
Signals: N/A
Excerpt (<=80 chars): export interface ILineItem {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ILineItem
- IDiscountCode
- IAddress
- IOrder
```

--------------------------------------------------------------------------------

---[FILE: ProductInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/Shopify/ProductInterface.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IImage {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IImage
- IPrice
- IPresentmentPrices
- IVariant
- IProduct
```

--------------------------------------------------------------------------------

---[FILE: Shopify.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Shopify/Shopify.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Shopify implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Shopify
```

--------------------------------------------------------------------------------

---[FILE: ShopifyTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Shopify/ShopifyTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class ShopifyTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ShopifyTrigger
```

--------------------------------------------------------------------------------

---[FILE: Signl4.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Signl4/Signl4.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Signl4 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Signl4
```

--------------------------------------------------------------------------------

---[FILE: Simulate.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Simulate/Simulate.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Simulate implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Simulate
```

--------------------------------------------------------------------------------

---[FILE: SimulateTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Simulate/SimulateTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class SimulateTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SimulateTrigger
```

--------------------------------------------------------------------------------

---[FILE: Slack.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Slack/Slack.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Slack extends VersionedNodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Slack
```

--------------------------------------------------------------------------------

---[FILE: SlackTrigger.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Slack/SlackTrigger.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class SlackTrigger implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SlackTrigger
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Slack/V1/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function validateJSON(json: string | undefined): any {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- validateJSON
```

--------------------------------------------------------------------------------

---[FILE: MessageInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/Slack/V1/MessageInterface.ts
Signals: N/A
Excerpt (<=80 chars): export interface IAttachment {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IAttachment
```

--------------------------------------------------------------------------------

---[FILE: SlackV1.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Slack/V1/SlackV1.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class SlackV1 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SlackV1
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Slack/V2/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function getMessageContent(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getMessageContent
- validateJSON
- getTarget
- processThreadOptions
- createSendAndWaitMessageBody
```

--------------------------------------------------------------------------------

---[FILE: MessageInterface.ts]---
Location: n8n-master/packages/nodes-base/nodes/Slack/V2/MessageInterface.ts
Signals: N/A
Excerpt (<=80 chars): export interface IAttachment {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IAttachment
- TextBlock
- SectionBlock
- DividerBlock
- ButtonElement
- ActionsBlock
- SendAndWaitMessageBody
```

--------------------------------------------------------------------------------

---[FILE: SlackV2.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Slack/V2/SlackV2.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class SlackV2 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SlackV2
```

--------------------------------------------------------------------------------

---[FILE: Sms77.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Sms77/Sms77.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Sms77 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Sms77
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Snowflake/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export type SnowflakeCredential = Pick<

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getConnectionOptions
- SnowflakeCredential
```

--------------------------------------------------------------------------------

---[FILE: Snowflake.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Snowflake/Snowflake.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Snowflake implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Snowflake
```

--------------------------------------------------------------------------------

---[FILE: SplitInBatches.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/SplitInBatches/SplitInBatches.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class SplitInBatches extends VersionedNodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SplitInBatches
```

--------------------------------------------------------------------------------

---[FILE: SplitInBatchesV1.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/SplitInBatches/v1/SplitInBatchesV1.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class SplitInBatchesV1 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SplitInBatchesV1
```

--------------------------------------------------------------------------------

---[FILE: SplitInBatchesV2.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/SplitInBatches/v2/SplitInBatchesV2.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class SplitInBatchesV2 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SplitInBatchesV2
```

--------------------------------------------------------------------------------

---[FILE: SplitInBatchesV3.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/SplitInBatches/v3/SplitInBatchesV3.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class SplitInBatchesV3 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SplitInBatchesV3
```

--------------------------------------------------------------------------------

---[FILE: Splunk.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Splunk/Splunk.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class Splunk extends VersionedNodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Splunk
```

--------------------------------------------------------------------------------

---[FILE: GenericFunctions.ts]---
Location: n8n-master/packages/nodes-base/nodes/Splunk/v1/GenericFunctions.ts
Signals: N/A
Excerpt (<=80 chars):  export function formatSearch(responseData: SplunkSearchResponse) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- formatSearch
- extractErrorDescription
- toUnixEpoch
- formatFeed
- formatResults
- setCount
- populate
- getId
```

--------------------------------------------------------------------------------

---[FILE: SplunkV1.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Splunk/v1/SplunkV1.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class SplunkV1 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SplunkV1
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/nodes-base/nodes/Splunk/v1/types.ts
Signals: N/A
Excerpt (<=80 chars): export type SplunkCredentials = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SPLUNK
- SplunkCredentials
- SplunkFeedResponse
- SplunkSearchResponse
- SplunkResultResponse
- SplunkError
```

--------------------------------------------------------------------------------

---[FILE: SplunkV2.node.ts]---
Location: n8n-master/packages/nodes-base/nodes/Splunk/v2/SplunkV2.node.ts
Signals: N/A
Excerpt (<=80 chars):  export class SplunkV2 implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SplunkV2
```

--------------------------------------------------------------------------------

---[FILE: node.type.ts]---
Location: n8n-master/packages/nodes-base/nodes/Splunk/v2/actions/node.type.ts
Signals: N/A
Excerpt (<=80 chars):  export type SplunkType = AllEntities<NodeMap>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SplunkType
```

--------------------------------------------------------------------------------

---[FILE: getMetrics.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Splunk/v2/actions/alert/getMetrics.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: getReport.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Splunk/v2/actions/alert/getReport.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: create.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Splunk/v2/actions/report/create.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: deleteReport.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Splunk/v2/actions/report/deleteReport.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: get.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Splunk/v2/actions/report/get.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: getAll.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Splunk/v2/actions/report/getAll.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: create.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Splunk/v2/actions/search/create.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: deleteJob.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Splunk/v2/actions/search/deleteJob.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: get.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Splunk/v2/actions/search/get.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: getAll.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Splunk/v2/actions/search/getAll.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: getResult.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Splunk/v2/actions/search/getResult.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: create.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Splunk/v2/actions/user/create.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

---[FILE: deleteUser.operation.ts]---
Location: n8n-master/packages/nodes-base/nodes/Splunk/v2/actions/user/deleteUser.operation.ts
Signals: N/A
Excerpt (<=80 chars):  export const description = updateDisplayOptions(displayOptions, properties);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- description
```

--------------------------------------------------------------------------------

````
