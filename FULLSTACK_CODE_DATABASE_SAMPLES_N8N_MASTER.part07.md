---
source_txt: fullstack_samples/n8n-master
converted_utc: 2025-12-18T10:47:15Z
part: 7
parts_total: 51
---

# FULLSTACK CODE DATABASE SAMPLES n8n-master

## Extracted Reusable Patterns (Non-verbatim) (Part 7 of 51)

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

---[FILE: 1652367743993-AddUserSettings.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1652367743993-AddUserSettings.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddUserSettings1652367743993 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddUserSettings1652367743993
```

--------------------------------------------------------------------------------

---[FILE: 1652905585850-AddAPIKeyColumn.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1652905585850-AddAPIKeyColumn.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddAPIKeyColumn1652905585850 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddAPIKeyColumn1652905585850
```

--------------------------------------------------------------------------------

---[FILE: 1654090101303-IntroducePinData.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1654090101303-IntroducePinData.ts
Signals: N/A
Excerpt (<=80 chars):  export class IntroducePinData1654090101303 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IntroducePinData1654090101303
```

--------------------------------------------------------------------------------

---[FILE: 1658932910559-AddNodeIds.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1658932910559-AddNodeIds.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddNodeIds1658932910559 extends AddNodeIds1658930531669 {}

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddNodeIds1658932910559
```

--------------------------------------------------------------------------------

---[FILE: 1659895550980-AddJsonKeyPinData.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1659895550980-AddJsonKeyPinData.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddJsonKeyPinData1659895550980 extends AddJsonKeyPinData1659888...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddJsonKeyPinData1659895550980
```

--------------------------------------------------------------------------------

---[FILE: 1660062385367-CreateCredentialsUserRole.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1660062385367-CreateCredentialsUserRole.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateCredentialsUserRole1660062385367 implements ReversibleMig...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateCredentialsUserRole1660062385367
```

--------------------------------------------------------------------------------

---[FILE: 1663755770894-CreateWorkflowsEditorRole.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1663755770894-CreateWorkflowsEditorRole.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateWorkflowsEditorRole1663755770894 implements ReversibleMig...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateWorkflowsEditorRole1663755770894
```

--------------------------------------------------------------------------------

---[FILE: 1664196174002-WorkflowStatistics.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1664196174002-WorkflowStatistics.ts
Signals: N/A
Excerpt (<=80 chars):  export class WorkflowStatistics1664196174002 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowStatistics1664196174002
```

--------------------------------------------------------------------------------

---[FILE: 1665484192213-CreateCredentialUsageTable.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1665484192213-CreateCredentialUsageTable.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateCredentialUsageTable1665484192213 implements ReversibleMi...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateCredentialUsageTable1665484192213
```

--------------------------------------------------------------------------------

---[FILE: 1665754637026-RemoveCredentialUsageTable.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1665754637026-RemoveCredentialUsageTable.ts
Signals: N/A
Excerpt (<=80 chars):  export class RemoveCredentialUsageTable1665754637026 implements ReversibleMi...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RemoveCredentialUsageTable1665754637026
```

--------------------------------------------------------------------------------

---[FILE: 1669739707125-AddWorkflowVersionIdColumn.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1669739707125-AddWorkflowVersionIdColumn.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddWorkflowVersionIdColumn1669739707125 extends AddWorkflowVers...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddWorkflowVersionIdColumn1669739707125
```

--------------------------------------------------------------------------------

---[FILE: 1669823906994-AddTriggerCountColumn.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1669823906994-AddTriggerCountColumn.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddTriggerCountColumn1669823906994 implements ReversibleMigrati...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddTriggerCountColumn1669823906994
```

--------------------------------------------------------------------------------

---[FILE: 1671535397530-MessageEventBusDestinations.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1671535397530-MessageEventBusDestinations.ts
Signals: N/A
Excerpt (<=80 chars):  export class MessageEventBusDestinations1671535397530 implements ReversibleM...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MessageEventBusDestinations1671535397530
```

--------------------------------------------------------------------------------

---[FILE: 1671726148420-RemoveWorkflowDataLoadedFlag.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1671726148420-RemoveWorkflowDataLoadedFlag.ts
Signals: N/A
Excerpt (<=80 chars):  export class RemoveWorkflowDataLoadedFlag1671726148420 extends RemoveWorkflo...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RemoveWorkflowDataLoadedFlag1671726148420
```

--------------------------------------------------------------------------------

---[FILE: 1673268682475-DeleteExecutionsWithWorkflows.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1673268682475-DeleteExecutionsWithWorkflows.ts
Signals: N/A
Excerpt (<=80 chars):  export class DeleteExecutionsWithWorkflows1673268682475 implements Reversibl...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeleteExecutionsWithWorkflows1673268682475
```

--------------------------------------------------------------------------------

---[FILE: 1674138566000-AddStatusToExecutions.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1674138566000-AddStatusToExecutions.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddStatusToExecutions1674138566000 implements ReversibleMigrati...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddStatusToExecutions1674138566000
```

--------------------------------------------------------------------------------

---[FILE: 1676996103000-MigrateExecutionStatus.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1676996103000-MigrateExecutionStatus.ts
Signals: N/A
Excerpt (<=80 chars):  export class MigrateExecutionStatus1676996103000 implements IrreversibleMigr...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MigrateExecutionStatus1676996103000
```

--------------------------------------------------------------------------------

---[FILE: 1677236788851-UpdateRunningExecutionStatus.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1677236788851-UpdateRunningExecutionStatus.ts
Signals: N/A
Excerpt (<=80 chars):  export class UpdateRunningExecutionStatus1677236788851 implements Irreversib...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateRunningExecutionStatus1677236788851
```

--------------------------------------------------------------------------------

---[FILE: 1677501636753-CreateVariables.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1677501636753-CreateVariables.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateVariables1677501636753 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateVariables1677501636753
```

--------------------------------------------------------------------------------

---[FILE: 1679416281779-CreateExecutionMetadataTable.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1679416281779-CreateExecutionMetadataTable.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateExecutionMetadataTable1679416281779 implements Reversible...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateExecutionMetadataTable1679416281779
```

--------------------------------------------------------------------------------

---[FILE: 1681134145996-AddUserActivatedProperty.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1681134145996-AddUserActivatedProperty.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddUserActivatedProperty1681134145996 implements ReversibleMigr...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddUserActivatedProperty1681134145996
```

--------------------------------------------------------------------------------

---[FILE: 1681134145997-RemoveSkipOwnerSetup.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1681134145997-RemoveSkipOwnerSetup.ts
Signals: N/A
Excerpt (<=80 chars):  export class RemoveSkipOwnerSetup1681134145997 implements IrreversibleMigrat...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RemoveSkipOwnerSetup1681134145997
```

--------------------------------------------------------------------------------

---[FILE: 1690000000001-MigrateIntegerKeysToString.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1690000000001-MigrateIntegerKeysToString.ts
Signals: N/A
Excerpt (<=80 chars):  export class MigrateIntegerKeysToString1690000000001 implements Irreversible...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MigrateIntegerKeysToString1690000000001
```

--------------------------------------------------------------------------------

---[FILE: 1690000000030-SeparateExecutionData.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1690000000030-SeparateExecutionData.ts
Signals: N/A
Excerpt (<=80 chars):  export class SeparateExecutionData1690000000030 implements ReversibleMigrati...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SeparateExecutionData1690000000030
```

--------------------------------------------------------------------------------

---[FILE: 1690000000031-FixExecutionDataType.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1690000000031-FixExecutionDataType.ts
Signals: N/A
Excerpt (<=80 chars):  export class FixExecutionDataType1690000000031 implements IrreversibleMigrat...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FixExecutionDataType1690000000031
```

--------------------------------------------------------------------------------

---[FILE: 1717498465931-AddActivatedAtUserSetting.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1717498465931-AddActivatedAtUserSetting.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddActivatedAtUserSetting1717498465931 implements ReversibleMig...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddActivatedAtUserSetting1717498465931
```

--------------------------------------------------------------------------------

---[FILE: 1731582748663-MigrateTestDefinitionKeyToString.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1731582748663-MigrateTestDefinitionKeyToString.ts
Signals: N/A
Excerpt (<=80 chars):  export class MigrateTestDefinitionKeyToString1731582748663 implements Irreve...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MigrateTestDefinitionKeyToString1731582748663
```

--------------------------------------------------------------------------------

---[FILE: 1732271325258-CreateTestMetricTable.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1732271325258-CreateTestMetricTable.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateTestMetricTable1732271325258 implements ReversibleMigrati...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateTestMetricTable1732271325258
```

--------------------------------------------------------------------------------

---[FILE: 1736172058779-AddStatsColumnsToTestRun.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1736172058779-AddStatsColumnsToTestRun.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddStatsColumnsToTestRun1736172058779 implements ReversibleMigr...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddStatsColumnsToTestRun1736172058779
```

--------------------------------------------------------------------------------

---[FILE: 1739873751194-FixTestDefinitionPrimaryKey.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1739873751194-FixTestDefinitionPrimaryKey.ts
Signals: N/A
Excerpt (<=80 chars):  export class FixTestDefinitionPrimaryKey1739873751194 implements Irreversibl...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FixTestDefinitionPrimaryKey1739873751194
```

--------------------------------------------------------------------------------

---[FILE: 1740445074052-UpdateParentFolderIdColumn.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1740445074052-UpdateParentFolderIdColumn.ts
Signals: N/A
Excerpt (<=80 chars):  export class UpdateParentFolderIdColumn1740445074052 implements BaseMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateParentFolderIdColumn1740445074052
```

--------------------------------------------------------------------------------

---[FILE: 1758794506893-AddProjectIdToVariableTable.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1758794506893-AddProjectIdToVariableTable.ts
Signals: N/A
Excerpt (<=80 chars): export class AddProjectIdToVariableTable1758794506893 implements ReversibleMi...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddProjectIdToVariableTable1758794506893
```

--------------------------------------------------------------------------------

---[FILE: 1760965142113-DropUnusedChatHubColumns.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1760965142113-DropUnusedChatHubColumns.ts
Signals: N/A
Excerpt (<=80 chars):  export class DropUnusedChatHubColumns1760965142113 implements ReversibleMigr...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DropUnusedChatHubColumns1760965142113
```

--------------------------------------------------------------------------------

---[FILE: 1761047826451-AddWorkflowVersionColumn.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1761047826451-AddWorkflowVersionColumn.ts
Signals: N/A
Excerpt (<=80 chars): export class AddWorkflowVersionColumn1761047826451 implements ReversibleMigra...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddWorkflowVersionColumn1761047826451
```

--------------------------------------------------------------------------------

---[FILE: 1761655473000-ChangeDependencyInfoToJson.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1761655473000-ChangeDependencyInfoToJson.ts
Signals: N/A
Excerpt (<=80 chars): export class ChangeDependencyInfoToJson1761655473000 implements IrreversibleM...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ChangeDependencyInfoToJson1761655473000
```

--------------------------------------------------------------------------------

---[FILE: 1761830340990-AddToolsColumnToChatHubTables.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1761830340990-AddToolsColumnToChatHubTables.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddToolsColumnToChatHubTables1761830340990 implements Reversibl...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddToolsColumnToChatHubTables1761830340990
```

--------------------------------------------------------------------------------

---[FILE: 1587669153312-InitialMigration.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/postgresdb/1587669153312-InitialMigration.ts
Signals: N/A
Excerpt (<=80 chars):  export class InitialMigration1587669153312 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InitialMigration1587669153312
```

--------------------------------------------------------------------------------

---[FILE: 1589476000887-WebhookModel.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/postgresdb/1589476000887-WebhookModel.ts
Signals: N/A
Excerpt (<=80 chars):  export class WebhookModel1589476000887 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebhookModel1589476000887
```

--------------------------------------------------------------------------------

---[FILE: 1594828256133-CreateIndexStoppedAt.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/postgresdb/1594828256133-CreateIndexStoppedAt.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateIndexStoppedAt1594828256133 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateIndexStoppedAt1594828256133
```

--------------------------------------------------------------------------------

---[FILE: 1607431743768-MakeStoppedAtNullable.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/postgresdb/1607431743768-MakeStoppedAtNullable.ts
Signals: N/A
Excerpt (<=80 chars):  export class MakeStoppedAtNullable1607431743768 implements IrreversibleMigra...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MakeStoppedAtNullable1607431743768
```

--------------------------------------------------------------------------------

---[FILE: 1611144599516-AddWebhookId.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/postgresdb/1611144599516-AddWebhookId.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddWebhookId1611144599516 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddWebhookId1611144599516
```

--------------------------------------------------------------------------------

---[FILE: 1617270242566-CreateTagEntity.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/postgresdb/1617270242566-CreateTagEntity.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateTagEntity1617270242566 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateTagEntity1617270242566
```

--------------------------------------------------------------------------------

---[FILE: 1620824779533-UniqueWorkflowNames.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/postgresdb/1620824779533-UniqueWorkflowNames.ts
Signals: N/A
Excerpt (<=80 chars):  export class UniqueWorkflowNames1620824779533 extends UniqueWorkflowNames162...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UniqueWorkflowNames1620824779533
```

--------------------------------------------------------------------------------

---[FILE: 1626176912946-AddwaitTill.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/postgresdb/1626176912946-AddwaitTill.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddwaitTill1626176912946 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddwaitTill1626176912946
```

--------------------------------------------------------------------------------

---[FILE: 1630419189837-UpdateWorkflowCredentials.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/postgresdb/1630419189837-UpdateWorkflowCredentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class UpdateWorkflowCredentials1630419189837 extends UpdateWorkflowCr...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateWorkflowCredentials1630419189837
```

--------------------------------------------------------------------------------

---[FILE: 1644422880309-AddExecutionEntityIndexes.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/postgresdb/1644422880309-AddExecutionEntityIndexes.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddExecutionEntityIndexes1644422880309 implements ReversibleMig...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddExecutionEntityIndexes1644422880309
```

--------------------------------------------------------------------------------

---[FILE: 1646834195327-IncreaseTypeVarcharLimit.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/postgresdb/1646834195327-IncreaseTypeVarcharLimit.ts
Signals: N/A
Excerpt (<=80 chars):  export class IncreaseTypeVarcharLimit1646834195327 implements IrreversibleMi...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IncreaseTypeVarcharLimit1646834195327
```

--------------------------------------------------------------------------------

---[FILE: 1646992772331-CreateUserManagement.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/postgresdb/1646992772331-CreateUserManagement.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateUserManagement1646992772331 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateUserManagement1646992772331
```

--------------------------------------------------------------------------------

---[FILE: 1648740597343-LowerCaseUserEmail.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/postgresdb/1648740597343-LowerCaseUserEmail.ts
Signals: N/A
Excerpt (<=80 chars):  export class LowerCaseUserEmail1648740597343 implements IrreversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LowerCaseUserEmail1648740597343
```

--------------------------------------------------------------------------------

---[FILE: 1652254514002-CommunityNodes.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/postgresdb/1652254514002-CommunityNodes.ts
Signals: N/A
Excerpt (<=80 chars):  export class CommunityNodes1652254514002 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CommunityNodes1652254514002
```

--------------------------------------------------------------------------------

---[FILE: 1652367743993-AddUserSettings.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/postgresdb/1652367743993-AddUserSettings.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddUserSettings1652367743993 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddUserSettings1652367743993
```

--------------------------------------------------------------------------------

---[FILE: 1652905585850-AddAPIKeyColumn.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/postgresdb/1652905585850-AddAPIKeyColumn.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddAPIKeyColumn1652905585850 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddAPIKeyColumn1652905585850
```

--------------------------------------------------------------------------------

---[FILE: 1654090467022-IntroducePinData.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/postgresdb/1654090467022-IntroducePinData.ts
Signals: N/A
Excerpt (<=80 chars):  export class IntroducePinData1654090467022 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IntroducePinData1654090467022
```

--------------------------------------------------------------------------------

---[FILE: 1658932090381-AddNodeIds.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/postgresdb/1658932090381-AddNodeIds.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddNodeIds1658932090381 extends AddNodeIds1658930531669 {}

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddNodeIds1658932090381
```

--------------------------------------------------------------------------------

---[FILE: 1659902242948-AddJsonKeyPinData.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/postgresdb/1659902242948-AddJsonKeyPinData.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddJsonKeyPinData1659902242948 extends AddJsonKeyPinData1659888...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddJsonKeyPinData1659902242948
```

--------------------------------------------------------------------------------

---[FILE: 1660062385367-CreateCredentialsUserRole.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/postgresdb/1660062385367-CreateCredentialsUserRole.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateCredentialsUserRole1660062385367 implements ReversibleMig...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateCredentialsUserRole1660062385367
```

--------------------------------------------------------------------------------

---[FILE: 1663755770893-CreateWorkflowsEditorRole.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/postgresdb/1663755770893-CreateWorkflowsEditorRole.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateWorkflowsEditorRole1663755770893 implements ReversibleMig...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateWorkflowsEditorRole1663755770893
```

--------------------------------------------------------------------------------

---[FILE: 1664196174001-WorkflowStatistics.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/postgresdb/1664196174001-WorkflowStatistics.ts
Signals: N/A
Excerpt (<=80 chars):  export class WorkflowStatistics1664196174001 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowStatistics1664196174001
```

--------------------------------------------------------------------------------

---[FILE: 1665484192212-CreateCredentialUsageTable.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/postgresdb/1665484192212-CreateCredentialUsageTable.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateCredentialUsageTable1665484192212 implements ReversibleMi...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateCredentialUsageTable1665484192212
```

--------------------------------------------------------------------------------

---[FILE: 1665754637025-RemoveCredentialUsageTable.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/postgresdb/1665754637025-RemoveCredentialUsageTable.ts
Signals: N/A
Excerpt (<=80 chars):  export class RemoveCredentialUsageTable1665754637025 implements ReversibleMi...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RemoveCredentialUsageTable1665754637025
```

--------------------------------------------------------------------------------

---[FILE: 1669739707126-AddWorkflowVersionIdColumn.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/postgresdb/1669739707126-AddWorkflowVersionIdColumn.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddWorkflowVersionIdColumn1669739707126 extends AddWorkflowVers...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddWorkflowVersionIdColumn1669739707126
```

--------------------------------------------------------------------------------

---[FILE: 1669823906995-AddTriggerCountColumn.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/postgresdb/1669823906995-AddTriggerCountColumn.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddTriggerCountColumn1669823906995 implements ReversibleMigrati...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddTriggerCountColumn1669823906995
```

--------------------------------------------------------------------------------

---[FILE: 1671535397530-MessageEventBusDestinations.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/postgresdb/1671535397530-MessageEventBusDestinations.ts
Signals: N/A
Excerpt (<=80 chars):  export class MessageEventBusDestinations1671535397530 implements ReversibleM...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MessageEventBusDestinations1671535397530
```

--------------------------------------------------------------------------------

---[FILE: 1671726148421-RemoveWorkflowDataLoadedFlag.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/postgresdb/1671726148421-RemoveWorkflowDataLoadedFlag.ts
Signals: N/A
Excerpt (<=80 chars):  export class RemoveWorkflowDataLoadedFlag1671726148421 extends RemoveWorkflo...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RemoveWorkflowDataLoadedFlag1671726148421
```

--------------------------------------------------------------------------------

---[FILE: 1673268682475-DeleteExecutionsWithWorkflows.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/postgresdb/1673268682475-DeleteExecutionsWithWorkflows.ts
Signals: N/A
Excerpt (<=80 chars):  export class DeleteExecutionsWithWorkflows1673268682475 implements Reversibl...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeleteExecutionsWithWorkflows1673268682475
```

--------------------------------------------------------------------------------

---[FILE: 1674138566000-AddStatusToExecutions.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/postgresdb/1674138566000-AddStatusToExecutions.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddStatusToExecutions1674138566000 implements ReversibleMigrati...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddStatusToExecutions1674138566000
```

--------------------------------------------------------------------------------

---[FILE: 1676996103000-MigrateExecutionStatus.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/postgresdb/1676996103000-MigrateExecutionStatus.ts
Signals: N/A
Excerpt (<=80 chars):  export class MigrateExecutionStatus1676996103000 implements IrreversibleMigr...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MigrateExecutionStatus1676996103000
```

--------------------------------------------------------------------------------

---[FILE: 1677236854063-UpdateRunningExecutionStatus.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/postgresdb/1677236854063-UpdateRunningExecutionStatus.ts
Signals: N/A
Excerpt (<=80 chars):  export class UpdateRunningExecutionStatus1677236854063 implements Irreversib...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateRunningExecutionStatus1677236854063
```

--------------------------------------------------------------------------------

---[FILE: 1677501636754-CreateVariables.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/postgresdb/1677501636754-CreateVariables.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateVariables1677501636754 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateVariables1677501636754
```

--------------------------------------------------------------------------------

---[FILE: 1679416281778-CreateExecutionMetadataTable.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/postgresdb/1679416281778-CreateExecutionMetadataTable.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateExecutionMetadataTable1679416281778 implements Reversible...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateExecutionMetadataTable1679416281778
```

--------------------------------------------------------------------------------

---[FILE: 1681134145996-AddUserActivatedProperty.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/postgresdb/1681134145996-AddUserActivatedProperty.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddUserActivatedProperty1681134145996 implements ReversibleMigr...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddUserActivatedProperty1681134145996
```

--------------------------------------------------------------------------------

---[FILE: 1681134145997-RemoveSkipOwnerSetup.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/postgresdb/1681134145997-RemoveSkipOwnerSetup.ts
Signals: N/A
Excerpt (<=80 chars):  export class RemoveSkipOwnerSetup1681134145997 implements IrreversibleMigrat...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RemoveSkipOwnerSetup1681134145997
```

--------------------------------------------------------------------------------

---[FILE: 1690000000000-MigrateIntegerKeysToString.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/postgresdb/1690000000000-MigrateIntegerKeysToString.ts
Signals: N/A
Excerpt (<=80 chars):  export class MigrateIntegerKeysToString1690000000000 implements Irreversible...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MigrateIntegerKeysToString1690000000000
```

--------------------------------------------------------------------------------

---[FILE: 1690000000020-SeparateExecutionData.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/postgresdb/1690000000020-SeparateExecutionData.ts
Signals: N/A
Excerpt (<=80 chars):  export class SeparateExecutionData1690000000020 implements ReversibleMigrati...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SeparateExecutionData1690000000020
```

--------------------------------------------------------------------------------

---[FILE: 1690787606731-AddMissingPrimaryKeyOnExecutionData.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/postgresdb/1690787606731-AddMissingPrimaryKeyOnExecutionData.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddMissingPrimaryKeyOnExecutionData1690787606731 implements Irr...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddMissingPrimaryKeyOnExecutionData1690787606731
```

--------------------------------------------------------------------------------

---[FILE: 1694091729095-MigrateToTimestampTz.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/postgresdb/1694091729095-MigrateToTimestampTz.ts
Signals: N/A
Excerpt (<=80 chars):  export class MigrateToTimestampTz1694091729095 implements IrreversibleMigrat...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MigrateToTimestampTz1694091729095
```

--------------------------------------------------------------------------------

---[FILE: 1717498465931-AddActivatedAtUserSetting.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/postgresdb/1717498465931-AddActivatedAtUserSetting.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddActivatedAtUserSetting1717498465931 implements ReversibleMig...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddActivatedAtUserSetting1717498465931
```

--------------------------------------------------------------------------------

---[FILE: 1721377157740-FixExecutionMetadataSequence.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/postgresdb/1721377157740-FixExecutionMetadataSequence.ts
Signals: N/A
Excerpt (<=80 chars):  export class FixExecutionMetadataSequence1721377157740 implements Irreversib...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FixExecutionMetadataSequence1721377157740
```

--------------------------------------------------------------------------------

---[FILE: 1731582748663-MigrateTestDefinitionKeyToString.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/postgresdb/1731582748663-MigrateTestDefinitionKeyToString.ts
Signals: N/A
Excerpt (<=80 chars):  export class MigrateTestDefinitionKeyToString1731582748663 implements Irreve...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MigrateTestDefinitionKeyToString1731582748663
```

--------------------------------------------------------------------------------

---[FILE: 1740445074052-UpdateParentFolderIdColumn.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/postgresdb/1740445074052-UpdateParentFolderIdColumn.ts
Signals: N/A
Excerpt (<=80 chars):  export class UpdateParentFolderIdColumn1740445074052 implements BaseMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateParentFolderIdColumn1740445074052
```

--------------------------------------------------------------------------------

---[FILE: 1758794506893-AddProjectIdToVariableTable.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/postgresdb/1758794506893-AddProjectIdToVariableTable.ts
Signals: N/A
Excerpt (<=80 chars): export class AddProjectIdToVariableTable1758794506893 implements ReversibleMi...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddProjectIdToVariableTable1758794506893
```

--------------------------------------------------------------------------------

---[FILE: 1761047826451-AddWorkflowVersionColumn.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/postgresdb/1761047826451-AddWorkflowVersionColumn.ts
Signals: N/A
Excerpt (<=80 chars): export class AddWorkflowVersionColumn1761047826451 implements ReversibleMigra...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddWorkflowVersionColumn1761047826451
```

--------------------------------------------------------------------------------

---[FILE: 1761655473000-ChangeDependencyInfoToJson.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/postgresdb/1761655473000-ChangeDependencyInfoToJson.ts
Signals: N/A
Excerpt (<=80 chars): export class ChangeDependencyInfoToJson1761655473000 implements IrreversibleM...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ChangeDependencyInfoToJson1761655473000
```

--------------------------------------------------------------------------------

---[FILE: 1762771264000-ChangeDefaultForIdInUserTable.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/postgresdb/1762771264000-ChangeDefaultForIdInUserTable.ts
Signals: N/A
Excerpt (<=80 chars): export class ChangeDefaultForIdInUserTable1762771264000 implements Irreversib...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ChangeDefaultForIdInUserTable1762771264000
```

--------------------------------------------------------------------------------

---[FILE: 1765804780000-ConvertAgentIdToUuid.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/postgresdb/1765804780000-ConvertAgentIdToUuid.ts
Signals: N/A
Excerpt (<=80 chars):  export class ConvertAgentIdToUuid1765804780000 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ConvertAgentIdToUuid1765804780000
```

--------------------------------------------------------------------------------

````
