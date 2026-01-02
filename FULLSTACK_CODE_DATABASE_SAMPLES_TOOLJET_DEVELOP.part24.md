---
source_txt: fullstack_samples/ToolJet-develop
converted_utc: 2025-12-18T10:37:21Z
part: 24
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES ToolJet-develop

## Extracted Reusable Patterns (Non-verbatim) (Part 24 of 37)

````text
================================================================================
FULLSTACK SAMPLES PATTERN DATABASE - ToolJet-develop
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/ToolJet-develop
================================================================================

NOTES:
- This file intentionally avoids copying large verbatim third-party code.
- It captures reusable patterns, surfaces, and file references.
- Use the referenced file paths to view full implementations locally.

================================================================================

---[FILE: operations.ts]---
Location: ToolJet-develop/plugins/packages/dynamodb/lib/operations.ts
Signals: N/A
Excerpt (<=80 chars): export function listTables(client): Promise<object> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- listTables
- getItem
- deleteItem
- queryTable
- scanTable
- updateItem
- describeTable
- createTable
- putItem
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: ToolJet-develop/plugins/packages/dynamodb/lib/types.ts
Signals: N/A
Excerpt (<=80 chars): export type SourceOptions = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceOptions
- QueryOptions
- AssumeRoleCredentials
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: ToolJet-develop/plugins/packages/elasticsearch/lib/types.ts
Signals: N/A
Excerpt (<=80 chars): export type SourceOptions = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceOptions
- QueryOptions
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: ToolJet-develop/plugins/packages/firestore/lib/types.ts
Signals: N/A
Excerpt (<=80 chars): export type SourceOptions = { gcp_key: string };

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceOptions
- QueryOptions
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: ToolJet-develop/plugins/packages/gcs/lib/types.ts
Signals: N/A
Excerpt (<=80 chars): export type SourceOptions = { private_key: string };

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceOptions
- QueryOptions
```

--------------------------------------------------------------------------------

---[FILE: operations.ts]---
Location: ToolJet-develop/plugins/packages/googlesheets/lib/operations.ts
Signals: N/A
Excerpt (<=80 chars):  export const makeRequestBodyToBatchUpdate = (requestBody, filterCondition, f...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- makeRequestBodyToBatchUpdate
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: ToolJet-develop/plugins/packages/googlesheets/lib/types.ts
Signals: N/A
Excerpt (<=80 chars): export type SourceOptions = { access_token: string };

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceOptions
- QueryOptions
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: ToolJet-develop/plugins/packages/graphql/lib/types.ts
Signals: N/A
Excerpt (<=80 chars): export type SourceOptions = { url: string; headers: any; url_params: any };

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceOptions
- QueryOptions
```

--------------------------------------------------------------------------------

---[FILE: graphql.test.js]---
Location: ToolJet-develop/plugins/packages/graphql/__tests__/graphql.test.js
Signals: TypeORM
Excerpt (<=80 chars): 'use strict';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: ToolJet-develop/plugins/packages/grpc/lib/types.ts
Signals: N/A
Excerpt (<=80 chars): export type SourceOptions = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceOptions
- QueryOptions
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: ToolJet-develop/plugins/packages/influxdb/lib/types.ts
Signals: N/A
Excerpt (<=80 chars): export type SourceOptions = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceOptions
- QueryOptions
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: ToolJet-develop/plugins/packages/mailgun/lib/types.ts
Signals: N/A
Excerpt (<=80 chars): export interface EmailOptions {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceOptions
- QueryOptions
- EmailOptions
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: ToolJet-develop/plugins/packages/mariadb/lib/types.ts
Signals: N/A
Excerpt (<=80 chars): export type SourceOptions = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceOptions
- QueryOptions
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: ToolJet-develop/plugins/packages/minio/lib/types.ts
Signals: N/A
Excerpt (<=80 chars): export type SourceOptions = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceOptions
- QueryOptions
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: ToolJet-develop/plugins/packages/mongodb/lib/types.ts
Signals: N/A
Excerpt (<=80 chars): export type SourceOptions = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceOptions
- QueryOptions
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: ToolJet-develop/plugins/packages/mssql/lib/types.ts
Signals: N/A
Excerpt (<=80 chars): export type SourceOptions = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceOptions
- QueryOptions
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: ToolJet-develop/plugins/packages/mysql/lib/types.ts
Signals: N/A
Excerpt (<=80 chars): export type SourceOptions = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceOptions
- QueryOptions
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: ToolJet-develop/plugins/packages/n8n/lib/types.ts
Signals: N/A
Excerpt (<=80 chars): export type SourceOptions = { auth_type: string; username: string; password: ...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceOptions
- QueryOptions
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: ToolJet-develop/plugins/packages/nocodb/lib/types.ts
Signals: N/A
Excerpt (<=80 chars): export type SourceOptions = { api_token: string; nocodb_host: string; base_ur...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceOptions
- QueryOptions
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: ToolJet-develop/plugins/packages/notion/lib/types.ts
Signals: N/A
Excerpt (<=80 chars): export type SourceOptions = { token: string };

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceOptions
- QueryOptions
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: ToolJet-develop/plugins/packages/openapi/lib/types.ts
Signals: N/A
Excerpt (<=80 chars): export type SourceOptions = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceOptions
- QueryOptions
- RestAPIResult
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: ToolJet-develop/plugins/packages/oracledb/lib/types.ts
Signals: N/A
Excerpt (<=80 chars): export type SourceOptions = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceOptions
- QueryOptions
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: ToolJet-develop/plugins/packages/postgresql/lib/types.ts
Signals: N/A
Excerpt (<=80 chars): export type SourceOptions = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceOptions
- QueryOptions
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: ToolJet-develop/plugins/packages/redis/lib/types.ts
Signals: N/A
Excerpt (<=80 chars): export type SourceOptions = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceOptions
- QueryOptions
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: ToolJet-develop/plugins/packages/restapi/lib/types.ts
Signals: N/A
Excerpt (<=80 chars): export type SourceOptions = { api_key: string };

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceOptions
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: ToolJet-develop/plugins/packages/rethinkdb/lib/types.ts
Signals: N/A
Excerpt (<=80 chars): export type SourceOptions = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceOptions
- QueryOptions
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: ToolJet-develop/plugins/packages/s3/lib/types.ts
Signals: N/A
Excerpt (<=80 chars): export type SourceOptions = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceOptions
- QueryOptions
- AssumeRoleCredentials
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: ToolJet-develop/plugins/packages/saphana/lib/types.ts
Signals: N/A
Excerpt (<=80 chars): export type SourceOptions = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceOptions
- QueryOptions
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: ToolJet-develop/plugins/packages/sendgrid/lib/types.ts
Signals: N/A
Excerpt (<=80 chars): export interface EmailOptions {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceOptions
- QueryOptions
- EmailOptions
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: ToolJet-develop/plugins/packages/slack/lib/types.ts
Signals: N/A
Excerpt (<=80 chars): export type SourceOptions = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceOptions
- QueryOptions
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: ToolJet-develop/plugins/packages/smtp/lib/types.ts
Signals: N/A
Excerpt (<=80 chars): export type SourceOptions = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceOptions
- QueryOptions
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: ToolJet-develop/plugins/packages/snowflake/lib/types.ts
Signals: N/A
Excerpt (<=80 chars): export type SourceOptions = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceOptions
- QueryOptions
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: ToolJet-develop/plugins/packages/stripe/lib/types.ts
Signals: N/A
Excerpt (<=80 chars): export type SourceOptions = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceOptions
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: ToolJet-develop/plugins/packages/twilio/lib/types.ts
Signals: N/A
Excerpt (<=80 chars): export type SourceOptions = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceOptions
- QueryOptions
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: ToolJet-develop/plugins/packages/typesense/lib/types.ts
Signals: N/A
Excerpt (<=80 chars): export type SourceOptions = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceOptions
- QueryOptions
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: ToolJet-develop/plugins/packages/woocommerce/lib/types.ts
Signals: N/A
Excerpt (<=80 chars): export type SourceOptions = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceOptions
- QueryOptions
```

--------------------------------------------------------------------------------

---[FILE: definitions.ts]---
Location: ToolJet-develop/plugins/packages/woocommerce/lib/operations/definitions.ts
Signals: N/A
Excerpt (<=80 chars): export const body = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- body
- customer_id
- product_id
- order_id
- context
- page
- search
- per_page
- exclude
- include
- offset
- order
- orderby
- email
- role
- slug
- status
- type
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: ToolJet-develop/plugins/packages/woocommerce/lib/operations/index.ts
Signals: TypeORM
Excerpt (<=80 chars): import properties from './properties';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: ToolJet-develop/plugins/packages/zendesk/lib/types.ts
Signals: N/A
Excerpt (<=80 chars): export type SourceOptions = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceOptions
- QueryOptions
```

--------------------------------------------------------------------------------

---[FILE: queryEditorRegression.cy.js]---
Location: ToolJet-develop/queryPanel/queryEditorRegression.cy.js
Signals: TypeORM
Excerpt (<=80 chars): import {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: data-migration-config.ts]---
Location: ToolJet-develop/server/data-migration-config.ts
Signals: NestJS
Excerpt (<=80 chars): import { TypeOrmModuleOptions } from '@nestjs/typeorm';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ormconfig.ts]---
Location: ToolJet-develop/server/ormconfig.ts
Signals: NestJS
Excerpt (<=80 chars): import { TypeOrmModuleOptions } from '@nestjs/typeorm';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: 1625814801430-UpdateDefinitionsForEvents.ts]---
Location: ToolJet-develop/server/data-migrations/1625814801430-UpdateDefinitionsForEvents.ts
Signals: TypeORM
Excerpt (<=80 chars):  export class UpdateDefinitionsForEvents1625814801430 implements MigrationInt...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateDefinitionsForEvents1625814801430
```

--------------------------------------------------------------------------------

---[FILE: 1629971478272-UpdateDefinitionsForTableActionEvent.ts]---
Location: ToolJet-develop/server/data-migrations/1629971478272-UpdateDefinitionsForTableActionEvent.ts
Signals: TypeORM
Excerpt (<=80 chars):  export class UpdateDefinitionsForTableActionEvent1629971478272 implements Mi...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateDefinitionsForTableActionEvent1629971478272
```

--------------------------------------------------------------------------------

---[FILE: 1630003364070-TurnOnSSLForEveryPostgresDataSource.ts]---
Location: ToolJet-develop/server/data-migrations/1630003364070-TurnOnSSLForEveryPostgresDataSource.ts
Signals: TypeORM
Excerpt (<=80 chars):  export class TurnOnSSLForEveryPostgresDataSource1630003364070 implements Mig...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TurnOnSSLForEveryPostgresDataSource1630003364070
```

--------------------------------------------------------------------------------

---[FILE: 1632468258787-PopulateUserGroupsFromOrganizationRoles.ts]---
Location: ToolJet-develop/server/data-migrations/1632468258787-PopulateUserGroupsFromOrganizationRoles.ts
Signals: TypeORM
Excerpt (<=80 chars):  export class PopulateUserGroupsFromOrganizationRoles1632468258787 implements...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PopulateUserGroupsFromOrganizationRoles1632468258787
```

--------------------------------------------------------------------------------

---[FILE: 1633370361564-SetShowBulkSelectorToTrue.ts]---
Location: ToolJet-develop/server/data-migrations/1633370361564-SetShowBulkSelectorToTrue.ts
Signals: TypeORM
Excerpt (<=80 chars):  export class SetShowBulkSelectorToTrue1633370361564 implements MigrationInte...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SetShowBulkSelectorToTrue1633370361564
```

--------------------------------------------------------------------------------

---[FILE: 1633431766605-SetHighlightSelectedRowToFalseForExistingTables.ts]---
Location: ToolJet-develop/server/data-migrations/1633431766605-SetHighlightSelectedRowToFalseForExistingTables.ts
Signals: TypeORM
Excerpt (<=80 chars):  export class SetHighlightSelectedRowToFalseForExistingTables1633431766605 im...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SetHighlightSelectedRowToFalseForExistingTables1633431766605
```

--------------------------------------------------------------------------------

---[FILE: 1634729050892-BackfillAppCreateAndAppDeletePermissionsAsTruthyForAdminGroup.ts]---
Location: ToolJet-develop/server/data-migrations/1634729050892-BackfillAppCreateAndAppDeletePermissionsAsTruthyForAdminGroup.ts
Signals: TypeORM
Excerpt (<=80 chars):  export class BackfillAppCreatePermissionsAsTruthyForAdminGroup1634729050892 ...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BackfillAppCreatePermissionsAsTruthyForAdminGroup1634729050892
```

--------------------------------------------------------------------------------

---[FILE: 1634848932643-SetTableCellSpacingToCompact.ts]---
Location: ToolJet-develop/server/data-migrations/1634848932643-SetTableCellSpacingToCompact.ts
Signals: TypeORM
Excerpt (<=80 chars):  export class SetTablecellSizeToCompact1634848932643 implements MigrationInte...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SetTablecellSizeToCompact1634848932643
```

--------------------------------------------------------------------------------

---[FILE: 1636372753632-RebaseWidgetWidthAndLeftOffsetForResponsiveCanvas.ts]---
Location: ToolJet-develop/server/data-migrations/1636372753632-RebaseWidgetWidthAndLeftOffsetForResponsiveCanvas.ts
Signals: TypeORM
Excerpt (<=80 chars):  export class RebaseWidgetWidthAndLeftOffsetForResponsiveCanvas1636372753632 ...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RebaseWidgetWidthAndLeftOffsetForResponsiveCanvas1636372753632
```

--------------------------------------------------------------------------------

---[FILE: 1636609569079-BackfillFolderCreatePermissionsAsTruthyForAdminGroup.ts]---
Location: ToolJet-develop/server/data-migrations/1636609569079-BackfillFolderCreatePermissionsAsTruthyForAdminGroup.ts
Signals: TypeORM
Excerpt (<=80 chars):  export class BackfillFolderCreatePermissionsAsTruthyForAdminGroup16366095690...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BackfillFolderCreatePermissionsAsTruthyForAdminGroup1636609569079
```

--------------------------------------------------------------------------------

---[FILE: 1638255797809-SetLoadingStateToFalseForExistingTables.ts]---
Location: ToolJet-develop/server/data-migrations/1638255797809-SetLoadingStateToFalseForExistingTables.ts
Signals: TypeORM
Excerpt (<=80 chars):  export class SetLoadingStateToFalseForExistingTables1638255797809 implements...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SetLoadingStateToFalseForExistingTables1638255797809
```

--------------------------------------------------------------------------------

---[FILE: 1638796825499-BackfillFolderCreatePermissionsAsTruthyForMissedAdminGroup.ts]---
Location: ToolJet-develop/server/data-migrations/1638796825499-BackfillFolderCreatePermissionsAsTruthyForMissedAdminGroup.ts
Signals: TypeORM
Excerpt (<=80 chars):  export class BackfillFolderCreatePermissionsAsTruthyForMissedAdminGroup16387...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BackfillFolderCreatePermissionsAsTruthyForMissedAdminGroup1638796825499
```

--------------------------------------------------------------------------------

---[FILE: 1638941376844-SetMultiselectProperties.ts]---
Location: ToolJet-develop/server/data-migrations/1638941376844-SetMultiselectProperties.ts
Signals: TypeORM
Excerpt (<=80 chars):  export class SetMultiselectProperties1635788669976 implements MigrationInter...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SetMultiselectProperties1635788669976
```

--------------------------------------------------------------------------------

---[FILE: 1639038616546-UpdateDefinitionsForGlobalSettings.ts]---
Location: ToolJet-develop/server/data-migrations/1639038616546-UpdateDefinitionsForGlobalSettings.ts
Signals: TypeORM
Excerpt (<=80 chars):  export class UpdateDefinitionsForGlobalSettings1639038616546 implements Migr...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateDefinitionsForGlobalSettings1639038616546
```

--------------------------------------------------------------------------------

---[FILE: 1639734070615-BackfillDataSourcesAndQueriesForAppVersions.ts]---
Location: ToolJet-develop/server/data-migrations/1639734070615-BackfillDataSourcesAndQueriesForAppVersions.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars):  export class BackfillDataSourcesAndQueriesForAppVersions1639734070615 implem...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BackfillDataSourcesAndQueriesForAppVersions1639734070615
```

--------------------------------------------------------------------------------

---[FILE: 1640683693031-BackfillCalendarWeekDateFormat.ts]---
Location: ToolJet-develop/server/data-migrations/1640683693031-BackfillCalendarWeekDateFormat.ts
Signals: TypeORM
Excerpt (<=80 chars):  export class BackfillCalendarWeekDateFormat1640683693031 implements Migratio...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BackfillCalendarWeekDateFormat1640683693031
```

--------------------------------------------------------------------------------

---[FILE: 1641446596775-SetImageBorderTypeToNone.ts]---
Location: ToolJet-develop/server/data-migrations/1641446596775-SetImageBorderTypeToNone.ts
Signals: TypeORM
Excerpt (<=80 chars):  export class SetImageBorderTypeToNone1641446596775 implements MigrationInter...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SetImageBorderTypeToNone1641446596775
```

--------------------------------------------------------------------------------

---[FILE: 1644229722021-SetFxActiveToTrueForFxFieldsConvertedToUI.ts]---
Location: ToolJet-develop/server/data-migrations/1644229722021-SetFxActiveToTrueForFxFieldsConvertedToUI.ts
Signals: TypeORM
Excerpt (<=80 chars):  export class SetFxActiveToTrueForFxFieldsConvertedToUI1644229722021 implemen...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SetFxActiveToTrueForFxFieldsConvertedToUI1644229722021
```

--------------------------------------------------------------------------------

---[FILE: 1650485473528-PopulateSSOConfigs.ts]---
Location: ToolJet-develop/server/data-migrations/1650485473528-PopulateSSOConfigs.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars):  export class PopulateSSOConfigs1650485473528 implements MigrationInterface {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PopulateSSOConfigs1650485473528
```

--------------------------------------------------------------------------------

---[FILE: 1651820577708-PopulateTextSize.ts]---
Location: ToolJet-develop/server/data-migrations/1651820577708-PopulateTextSize.ts
Signals: TypeORM
Excerpt (<=80 chars):  export class PopulateTextSize1651820577708 implements MigrationInterface {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PopulateTextSize1651820577708
```

--------------------------------------------------------------------------------

---[FILE: 1653472569828-addedInstructionTextPropInFilePickerWidget.ts]---
Location: ToolJet-develop/server/data-migrations/1653472569828-addedInstructionTextPropInFilePickerWidget.ts
Signals: TypeORM
Excerpt (<=80 chars):  export class addedInstructionTextPropInFilePickerWidget1653472569828 impleme...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- addedInstructionTextPropInFilePickerWidget1653472569828
```

--------------------------------------------------------------------------------

---[FILE: 1653474337657-BackfillFolderDeleteFolderUpdatePermissionsAsTruthyForAdminGroup.ts]---
Location: ToolJet-develop/server/data-migrations/1653474337657-BackfillFolderDeleteFolderUpdatePermissionsAsTruthyForAdminGroup.ts
Signals: TypeORM
Excerpt (<=80 chars):  export class BackfillFolderDeleteFolderUpdatePermissionsAsTruthyForAdminGrou...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BackfillFolderDeleteFolderUpdatePermissionsAsTruthyForAdminGroup1653474337657
```

--------------------------------------------------------------------------------

---[FILE: 1654150855780-BackfillAddOrgEnvironmentVariablesGroupPermissions.ts]---
Location: ToolJet-develop/server/data-migrations/1654150855780-BackfillAddOrgEnvironmentVariablesGroupPermissions.ts
Signals: TypeORM
Excerpt (<=80 chars):  export class BackfillAddOrgEnvironmentVariablesGroupPermissions1654150855780...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BackfillAddOrgEnvironmentVariablesGroupPermissions1654150855780
```

--------------------------------------------------------------------------------

---[FILE: 1654596810662-ConvertAllUserEmailsToLowercaseAndDeleteDuplicateUsers.ts]---
Location: ToolJet-develop/server/data-migrations/1654596810662-ConvertAllUserEmailsToLowercaseAndDeleteDuplicateUsers.ts
Signals: TypeORM
Excerpt (<=80 chars):  export class ConvertAllUserEmailsToLowercaseAndDeleteDuplicateUsers165459681...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ConvertAllUserEmailsToLowercaseAndDeleteDuplicateUsers1654596810662
```

--------------------------------------------------------------------------------

---[FILE: 1655279771926-listViewWidgetAddingBorderRadiusProperty.ts]---
Location: ToolJet-develop/server/data-migrations/1655279771926-listViewWidgetAddingBorderRadiusProperty.ts
Signals: TypeORM
Excerpt (<=80 chars):  export class listViewWidgetAddingBorderRadiusProperty1655279771926 implement...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- listViewWidgetAddingBorderRadiusProperty1655279771926
```

--------------------------------------------------------------------------------

---[FILE: 1656061763136-modal-properties.ts]---
Location: ToolJet-develop/server/data-migrations/1656061763136-modal-properties.ts
Signals: TypeORM
Excerpt (<=80 chars):  export class modalProperties1656061763136 implements MigrationInterface {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- modalProperties1656061763136
```

--------------------------------------------------------------------------------

---[FILE: 1656924847186-addingCssPropsToTextWidget.ts]---
Location: ToolJet-develop/server/data-migrations/1656924847186-addingCssPropsToTextWidget.ts
Signals: TypeORM
Excerpt (<=80 chars):  export class addingCssPropsToTextWidget1656924847186 implements MigrationInt...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- addingCssPropsToTextWidget1656924847186
```

--------------------------------------------------------------------------------

---[FILE: 1661331234770-RestructureTableColumnSizesAndActionsToHaveAValueKeyThatPointsToItsContents.ts]---
Location: ToolJet-develop/server/data-migrations/1661331234770-RestructureTableColumnSizesAndActionsToHaveAValueKeyThatPointsToItsContents.ts
Signals: TypeORM
Excerpt (<=80 chars):  export class RestructureTableColumnSizesAndActionsToHaveAValueKeyThatPointsT...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RestructureTableColumnSizesAndActionsToHaveAValueKeyThatPointsToItsContents1661331234770
```

--------------------------------------------------------------------------------

---[FILE: 1663581777527-ModalWidget-size.ts]---
Location: ToolJet-develop/server/data-migrations/1663581777527-ModalWidget-size.ts
Signals: TypeORM
Excerpt (<=80 chars):  export class ModalWidgetSize1663581777527 implements MigrationInterface {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ModalWidgetSize1663581777527
```

--------------------------------------------------------------------------------

---[FILE: 1663689836425-instanceSettings.ts]---
Location: ToolJet-develop/server/data-migrations/1663689836425-instanceSettings.ts
Signals: TypeORM
Excerpt (<=80 chars):  export class instanceSettings1663689836425 implements MigrationInterface {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- instanceSettings1663689836425
```

--------------------------------------------------------------------------------

---[FILE: 1666814745413-updateUserStatus.ts]---
Location: ToolJet-develop/server/data-migrations/1666814745413-updateUserStatus.ts
Signals: TypeORM
Excerpt (<=80 chars):  export class updateUserStatus1666814745413 implements MigrationInterface {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- updateUserStatus1666814745413
```

--------------------------------------------------------------------------------

---[FILE: 1667076251897-BackfillDataSources.ts]---
Location: ToolJet-develop/server/data-migrations/1667076251897-BackfillDataSources.ts
Signals: TypeORM
Excerpt (<=80 chars):  export class BackfillDataSources1667076251897 implements MigrationInterface {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BackfillDataSources1667076251897
```

--------------------------------------------------------------------------------

---[FILE: 1668521091918-ChangeDefinitionStructureForMultiPage.ts]---
Location: ToolJet-develop/server/data-migrations/1668521091918-ChangeDefinitionStructureForMultiPage.ts
Signals: TypeORM
Excerpt (<=80 chars):  export class ChangeDefinitionStructureForMultiPage1668521091918 implements M...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ChangeDefinitionStructureForMultiPage1668521091918
```

--------------------------------------------------------------------------------

---[FILE: 1669054493160-moveDataSourceOptionsToEnvironment.ts]---
Location: ToolJet-develop/server/data-migrations/1669054493160-moveDataSourceOptionsToEnvironment.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars):  export class moveDataSourceOptionsToEnvironment1669054493160 implements Migr...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- moveDataSourceOptionsToEnvironment1669054493160
```

--------------------------------------------------------------------------------

---[FILE: 1669055405494-removePluginFromDataQuery.ts]---
Location: ToolJet-develop/server/data-migrations/1669055405494-removePluginFromDataQuery.ts
Signals: TypeORM
Excerpt (<=80 chars):  export class removePluginFromDataQuery1669055405494 implements MigrationInte...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- removePluginFromDataQuery1669055405494
```

--------------------------------------------------------------------------------

---[FILE: 1669293520796-ConnectExistingCommentThreadsToPageIds.ts]---
Location: ToolJet-develop/server/data-migrations/1669293520796-ConnectExistingCommentThreadsToPageIds.ts
Signals: TypeORM
Excerpt (<=80 chars):  export class ConnectExistingCommentThreadsToPageIds1669293520796 implements ...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ConnectExistingCommentThreadsToPageIds1669293520796
```

--------------------------------------------------------------------------------

---[FILE: 1669919175280-removeRepetitionInDataSourceAndQuery.ts]---
Location: ToolJet-develop/server/data-migrations/1669919175280-removeRepetitionInDataSourceAndQuery.ts
Signals: TypeORM
Excerpt (<=80 chars):  export class removeRepetitionInDataSourceAndQuery1669919175280 implements Mi...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- removeRepetitionInDataSourceAndQuery1669919175280
```

--------------------------------------------------------------------------------

---[FILE: 1675368628629-AddAppVersionIdColumnToDataQueries.ts]---
Location: ToolJet-develop/server/data-migrations/1675368628629-AddAppVersionIdColumnToDataQueries.ts
Signals: TypeORM
Excerpt (<=80 chars):  export class AddAppVersionIdColumnToDataQueries1675368628629 implements Migr...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddAppVersionIdColumnToDataQueries1675368628629
```

--------------------------------------------------------------------------------

---[FILE: 1675368628726-BackfillAppVersionToDataQueries.ts]---
Location: ToolJet-develop/server/data-migrations/1675368628726-BackfillAppVersionToDataQueries.ts
Signals: TypeORM
Excerpt (<=80 chars):  export class BackfillAppVersionToDataQueries1675368628727 implements Migrati...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BackfillAppVersionToDataQueries1675368628727
```

--------------------------------------------------------------------------------

---[FILE: 1675844361117-CleanupDataSourceOptionData.ts]---
Location: ToolJet-develop/server/data-migrations/1675844361117-CleanupDataSourceOptionData.ts
Signals: TypeORM
Excerpt (<=80 chars): export class CleanupDataSourceOptionData1675844361117 implements MigrationInt...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CleanupDataSourceOptionData1675844361117
```

--------------------------------------------------------------------------------

---[FILE: 1675844361118-MigrateEnvironmentsUnderWorkspace.ts]---
Location: ToolJet-develop/server/data-migrations/1675844361118-MigrateEnvironmentsUnderWorkspace.ts
Signals: TypeORM
Excerpt (<=80 chars):  export class MigrateEnvironmentsUnderWorkspace1675844361118 implements Migra...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MigrateEnvironmentsUnderWorkspace1675844361118
```

--------------------------------------------------------------------------------

---[FILE: 1676545162064-BackfillRunpyDatasources.ts]---
Location: ToolJet-develop/server/data-migrations/1676545162064-BackfillRunpyDatasources.ts
Signals: TypeORM
Excerpt (<=80 chars):  export class BackfillRunpyDatasources1676545162064 implements MigrationInter...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BackfillRunpyDatasources1676545162064
```

--------------------------------------------------------------------------------

---[FILE: 1677822012965-AlterOrganizationIdInAppEnvironments.ts]---
Location: ToolJet-develop/server/data-migrations/1677822012965-AlterOrganizationIdInAppEnvironments.ts
Signals: TypeORM
Excerpt (<=80 chars):  export class AlterOrganizationIdInAppEnvironments1677822012965 implements Mi...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AlterOrganizationIdInAppEnvironments1677822012965
```

--------------------------------------------------------------------------------

---[FILE: 1679604241777-ReplaceTooljetDbTableNamesWithId.ts]---
Location: ToolJet-develop/server/data-migrations/1679604241777-ReplaceTooljetDbTableNamesWithId.ts
Signals: TypeORM
Excerpt (<=80 chars):  export class ReplaceTooljetDbTableNamesWithId1679604241777 implements Migrat...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ReplaceTooljetDbTableNamesWithId1679604241777
```

--------------------------------------------------------------------------------

---[FILE: 1680789366109-backfillDatasourceAdminPermissions.ts]---
Location: ToolJet-develop/server/data-migrations/1680789366109-backfillDatasourceAdminPermissions.ts
Signals: TypeORM
Excerpt (<=80 chars):  export class backfillDatasourceAdminPermissions1680789366109 implements Migr...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- backfillDatasourceAdminPermissions1680789366109
```

--------------------------------------------------------------------------------

---[FILE: 1681463532466-addMultipleEnvForCEcreatedApps.ts]---
Location: ToolJet-develop/server/data-migrations/1681463532466-addMultipleEnvForCEcreatedApps.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars):  export class addMultipleEnvForCEcreatedApps1681463532466 implements Migratio...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- addMultipleEnvForCEcreatedApps1681463532466
```

--------------------------------------------------------------------------------

---[FILE: 1682011503431-AddNewColumnsToInstanceSettings.ts]---
Location: ToolJet-develop/server/data-migrations/1682011503431-AddNewColumnsToInstanceSettings.ts
Signals: TypeORM
Excerpt (<=80 chars):  export class AddNewColumnsToInstanceSettings1682011503431 implements Migrati...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddNewColumnsToInstanceSettings1682011503431
```

--------------------------------------------------------------------------------

---[FILE: 1682045191971-BackfillInstanceSettingsColumns.ts]---
Location: ToolJet-develop/server/data-migrations/1682045191971-BackfillInstanceSettingsColumns.ts
Signals: TypeORM
Excerpt (<=80 chars):  export class BackfillInstanceSettingsColumns1682045191971 implements Migrati...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BackfillInstanceSettingsColumns1682045191971
```

--------------------------------------------------------------------------------

---[FILE: 1683022868045-environmentDataSourceMappingFix.ts]---
Location: ToolJet-develop/server/data-migrations/1683022868045-environmentDataSourceMappingFix.ts
Signals: NestJS, TypeORM
Excerpt (<=80 chars):  export class environmentDataSourceMappingFix1683022868045 implements Migrati...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- environmentDataSourceMappingFix1683022868045
```

--------------------------------------------------------------------------------

````
