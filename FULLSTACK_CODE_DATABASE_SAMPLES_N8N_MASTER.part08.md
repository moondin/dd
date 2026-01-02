---
source_txt: fullstack_samples/n8n-master
converted_utc: 2025-12-18T10:47:15Z
part: 8
parts_total: 51
---

# FULLSTACK CODE DATABASE SAMPLES n8n-master

## Extracted Reusable Patterns (Non-verbatim) (Part 8 of 51)

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

---[FILE: 1588102412422-InitialMigration.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1588102412422-InitialMigration.ts
Signals: N/A
Excerpt (<=80 chars):  export class InitialMigration1588102412422 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InitialMigration1588102412422
```

--------------------------------------------------------------------------------

---[FILE: 1592445003908-WebhookModel.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1592445003908-WebhookModel.ts
Signals: N/A
Excerpt (<=80 chars):  export class WebhookModel1592445003908 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebhookModel1592445003908
```

--------------------------------------------------------------------------------

---[FILE: 1594825041918-CreateIndexStoppedAt.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1594825041918-CreateIndexStoppedAt.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateIndexStoppedAt1594825041918 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateIndexStoppedAt1594825041918
```

--------------------------------------------------------------------------------

---[FILE: 1607431743769-MakeStoppedAtNullable.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1607431743769-MakeStoppedAtNullable.ts
Signals: N/A
Excerpt (<=80 chars):  export class MakeStoppedAtNullable1607431743769 implements IrreversibleMigra...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MakeStoppedAtNullable1607431743769
```

--------------------------------------------------------------------------------

---[FILE: 1611071044839-AddWebhookId.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1611071044839-AddWebhookId.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddWebhookId1611071044839 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddWebhookId1611071044839
```

--------------------------------------------------------------------------------

---[FILE: 1617213344594-CreateTagEntity.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1617213344594-CreateTagEntity.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateTagEntity1617213344594 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateTagEntity1617213344594
```

--------------------------------------------------------------------------------

---[FILE: 1621707690587-AddWaitColumn.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1621707690587-AddWaitColumn.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddWaitColumn1621707690587 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddWaitColumn1621707690587
```

--------------------------------------------------------------------------------

---[FILE: 1644421939510-AddExecutionEntityIndexes.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1644421939510-AddExecutionEntityIndexes.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddExecutionEntityIndexes1644421939510 implements ReversibleMig...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddExecutionEntityIndexes1644421939510
```

--------------------------------------------------------------------------------

---[FILE: 1646992772331-CreateUserManagement.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1646992772331-CreateUserManagement.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateUserManagement1646992772331 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateUserManagement1646992772331
```

--------------------------------------------------------------------------------

---[FILE: 1648740597343-LowerCaseUserEmail.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1648740597343-LowerCaseUserEmail.ts
Signals: N/A
Excerpt (<=80 chars):  export class LowerCaseUserEmail1648740597343 implements IrreversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LowerCaseUserEmail1648740597343
```

--------------------------------------------------------------------------------

---[FILE: 1652254514001-CommunityNodes.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1652254514001-CommunityNodes.ts
Signals: N/A
Excerpt (<=80 chars):  export class CommunityNodes1652254514001 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CommunityNodes1652254514001
```

--------------------------------------------------------------------------------

---[FILE: 1652367743993-AddUserSettings.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1652367743993-AddUserSettings.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddUserSettings1652367743993 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddUserSettings1652367743993
```

--------------------------------------------------------------------------------

---[FILE: 1652905585850-AddAPIKeyColumn.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1652905585850-AddAPIKeyColumn.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddAPIKeyColumn1652905585850 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddAPIKeyColumn1652905585850
```

--------------------------------------------------------------------------------

---[FILE: 1654089251344-IntroducePinData.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1654089251344-IntroducePinData.ts
Signals: N/A
Excerpt (<=80 chars):  export class IntroducePinData1654089251344 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IntroducePinData1654089251344
```

--------------------------------------------------------------------------------

---[FILE: 1660062385367-CreateCredentialsUserRole.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1660062385367-CreateCredentialsUserRole.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateCredentialsUserRole1660062385367 implements ReversibleMig...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateCredentialsUserRole1660062385367
```

--------------------------------------------------------------------------------

---[FILE: 1663755770892-CreateWorkflowsUserRole.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1663755770892-CreateWorkflowsUserRole.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateWorkflowsEditorRole1663755770892 implements ReversibleMig...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateWorkflowsEditorRole1663755770892
```

--------------------------------------------------------------------------------

---[FILE: 1664196174000-WorkflowStatistics.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1664196174000-WorkflowStatistics.ts
Signals: N/A
Excerpt (<=80 chars):  export class WorkflowStatistics1664196174000 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowStatistics1664196174000
```

--------------------------------------------------------------------------------

---[FILE: 1665484192211-CreateCredentialUsageTable.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1665484192211-CreateCredentialUsageTable.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateCredentialUsageTable1665484192211 implements ReversibleMi...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateCredentialUsageTable1665484192211
```

--------------------------------------------------------------------------------

---[FILE: 1665754637024-RemoveCredentialUsageTable.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1665754637024-RemoveCredentialUsageTable.ts
Signals: N/A
Excerpt (<=80 chars):  export class RemoveCredentialUsageTable1665754637024 implements ReversibleMi...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RemoveCredentialUsageTable1665754637024
```

--------------------------------------------------------------------------------

---[FILE: 1669823906993-AddTriggerCountColumn.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1669823906993-AddTriggerCountColumn.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddTriggerCountColumn1669823906993 implements ReversibleMigrati...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddTriggerCountColumn1669823906993
```

--------------------------------------------------------------------------------

---[FILE: 1671535397530-MessageEventBusDestinations.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1671535397530-MessageEventBusDestinations.ts
Signals: N/A
Excerpt (<=80 chars):  export class MessageEventBusDestinations1671535397530 implements ReversibleM...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MessageEventBusDestinations1671535397530
```

--------------------------------------------------------------------------------

---[FILE: 1673268682475-DeleteExecutionsWithWorkflows.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1673268682475-DeleteExecutionsWithWorkflows.ts
Signals: N/A
Excerpt (<=80 chars):  export class DeleteExecutionsWithWorkflows1673268682475 implements Reversibl...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeleteExecutionsWithWorkflows1673268682475
```

--------------------------------------------------------------------------------

---[FILE: 1674138566000-AddStatusToExecutions.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1674138566000-AddStatusToExecutions.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddStatusToExecutions1674138566000 implements ReversibleMigrati...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddStatusToExecutions1674138566000
```

--------------------------------------------------------------------------------

---[FILE: 1676996103000-MigrateExecutionStatus.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1676996103000-MigrateExecutionStatus.ts
Signals: N/A
Excerpt (<=80 chars):  export class MigrateExecutionStatus1676996103000 implements IrreversibleMigr...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MigrateExecutionStatus1676996103000
```

--------------------------------------------------------------------------------

---[FILE: 1677237073720-UpdateRunningExecutionStatus.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1677237073720-UpdateRunningExecutionStatus.ts
Signals: N/A
Excerpt (<=80 chars):  export class UpdateRunningExecutionStatus1677237073720 implements Irreversib...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateRunningExecutionStatus1677237073720
```

--------------------------------------------------------------------------------

---[FILE: 1677501636752-CreateVariables.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1677501636752-CreateVariables.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateVariables1677501636752 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateVariables1677501636752
```

--------------------------------------------------------------------------------

---[FILE: 1679416281777-CreateExecutionMetadataTable.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1679416281777-CreateExecutionMetadataTable.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateExecutionMetadataTable1679416281777 implements Reversible...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateExecutionMetadataTable1679416281777
```

--------------------------------------------------------------------------------

---[FILE: 1681134145996-AddUserActivatedProperty.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1681134145996-AddUserActivatedProperty.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddUserActivatedProperty1681134145996 implements ReversibleMigr...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddUserActivatedProperty1681134145996
```

--------------------------------------------------------------------------------

---[FILE: 1681134145997-RemoveSkipOwnerSetup.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1681134145997-RemoveSkipOwnerSetup.ts
Signals: N/A
Excerpt (<=80 chars):  export class RemoveSkipOwnerSetup1681134145997 implements IrreversibleMigrat...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RemoveSkipOwnerSetup1681134145997
```

--------------------------------------------------------------------------------

---[FILE: 1690000000002-MigrateIntegerKeysToString.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1690000000002-MigrateIntegerKeysToString.ts
Signals: N/A
Excerpt (<=80 chars):  export class MigrateIntegerKeysToString1690000000002 implements Irreversible...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MigrateIntegerKeysToString1690000000002
```

--------------------------------------------------------------------------------

---[FILE: 1690000000010-SeparateExecutionData.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1690000000010-SeparateExecutionData.ts
Signals: N/A
Excerpt (<=80 chars):  export class SeparateExecutionData1690000000010 implements ReversibleMigrati...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SeparateExecutionData1690000000010
```

--------------------------------------------------------------------------------

---[FILE: 1690000000020-FixMissingIndicesFromStringIdMigration.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1690000000020-FixMissingIndicesFromStringIdMigration.ts
Signals: N/A
Excerpt (<=80 chars):  export class FixMissingIndicesFromStringIdMigration1690000000020 implements ...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FixMissingIndicesFromStringIdMigration1690000000020
```

--------------------------------------------------------------------------------

---[FILE: 1690000000030-RemoveResetPasswordColumns.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1690000000030-RemoveResetPasswordColumns.ts
Signals: N/A
Excerpt (<=80 chars):  export class RemoveResetPasswordColumns1690000000030 extends BaseMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RemoveResetPasswordColumns1690000000030
```

--------------------------------------------------------------------------------

---[FILE: 1690000000040-AddMfaColumns.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1690000000040-AddMfaColumns.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddMfaColumns1690000000030 extends BaseMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddMfaColumns1690000000030
```

--------------------------------------------------------------------------------

---[FILE: 1693491613982-ExecutionSoftDelete.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1693491613982-ExecutionSoftDelete.ts
Signals: N/A
Excerpt (<=80 chars):  export class ExecutionSoftDelete1693491613982 extends BaseMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExecutionSoftDelete1693491613982
```

--------------------------------------------------------------------------------

---[FILE: 1695128658538-AddWorkflowMetadata.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1695128658538-AddWorkflowMetadata.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddWorkflowMetadata1695128658538 extends BaseMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddWorkflowMetadata1695128658538
```

--------------------------------------------------------------------------------

---[FILE: 1705429061930-DropRoleMapping.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1705429061930-DropRoleMapping.ts
Signals: N/A
Excerpt (<=80 chars):  export class DropRoleMapping1705429061930 extends BaseMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DropRoleMapping1705429061930
```

--------------------------------------------------------------------------------

---[FILE: 1717498465931-AddActivatedAtUserSetting.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1717498465931-AddActivatedAtUserSetting.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddActivatedAtUserSetting1717498465931 implements ReversibleMig...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddActivatedAtUserSetting1717498465931
```

--------------------------------------------------------------------------------

---[FILE: 1724951148974-AddApiKeysTable.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1724951148974-AddApiKeysTable.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddApiKeysTable1724951148974 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddApiKeysTable1724951148974
```

--------------------------------------------------------------------------------

---[FILE: 1728659839644-AddMissingPrimaryKeyOnAnnotationTagMapping.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1728659839644-AddMissingPrimaryKeyOnAnnotationTagMapping.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddMissingPrimaryKeyOnAnnotationTagMapping1728659839644

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddMissingPrimaryKeyOnAnnotationTagMapping1728659839644
```

--------------------------------------------------------------------------------

---[FILE: 1729607673469-AddProjectIcons.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1729607673469-AddProjectIcons.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddProjectIcons1729607673469 extends BaseMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddProjectIcons1729607673469
```

--------------------------------------------------------------------------------

---[FILE: 1731404028106-AddDescriptionToTestDefinition.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1731404028106-AddDescriptionToTestDefinition.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddDescriptionToTestDefinition1731404028106 extends BaseMigrati...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddDescriptionToTestDefinition1731404028106
```

--------------------------------------------------------------------------------

---[FILE: 1731582748663-MigrateTestDefinitionKeyToString.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1731582748663-MigrateTestDefinitionKeyToString.ts
Signals: N/A
Excerpt (<=80 chars):  export class MigrateTestDefinitionKeyToString1731582748663 implements Irreve...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MigrateTestDefinitionKeyToString1731582748663
```

--------------------------------------------------------------------------------

---[FILE: 1738709609940-CreateFolderTable.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1738709609940-CreateFolderTable.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateFolderTable1738709609940 extends BaseMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateFolderTable1738709609940
```

--------------------------------------------------------------------------------

---[FILE: 1740445074052-UpdateParentFolderIdColumn.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1740445074052-UpdateParentFolderIdColumn.ts
Signals: N/A
Excerpt (<=80 chars):  export class UpdateParentFolderIdColumn1740445074052 implements BaseMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateParentFolderIdColumn1740445074052
```

--------------------------------------------------------------------------------

---[FILE: 1742918400000-AddScopesColumnToApiKeys.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1742918400000-AddScopesColumnToApiKeys.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddScopesColumnToApiKeys1742918400000 extends BaseMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddScopesColumnToApiKeys1742918400000
```

--------------------------------------------------------------------------------

---[FILE: 1758794506893-AddProjectIdToVariableTable.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1758794506893-AddProjectIdToVariableTable.ts
Signals: N/A
Excerpt (<=80 chars): export class AddProjectIdToVariableTable1758794506893 implements ReversibleMi...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddProjectIdToVariableTable1758794506893
```

--------------------------------------------------------------------------------

---[FILE: 1761047826451-AddWorkflowVersionColumn.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1761047826451-AddWorkflowVersionColumn.ts
Signals: N/A
Excerpt (<=80 chars): export class AddWorkflowVersionColumn1761047826451 implements ReversibleMigra...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddWorkflowVersionColumn1761047826451
```

--------------------------------------------------------------------------------

---[FILE: 1761655473000-ChangeDependencyInfoToJson.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1761655473000-ChangeDependencyInfoToJson.ts
Signals: N/A
Excerpt (<=80 chars): export class ChangeDependencyInfoToJson1761655473000 implements IrreversibleM...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ChangeDependencyInfoToJson1761655473000
```

--------------------------------------------------------------------------------

---[FILE: 1764276827837-AddCreatorIdToProjectTable.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1764276827837-AddCreatorIdToProjectTable.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddCreatorIdToProjectTable1764276827837 implements ReversibleMi...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddCreatorIdToProjectTable1764276827837
```

--------------------------------------------------------------------------------

---[FILE: 1764689448000-AddResolvableFieldsToCredentials.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1764689448000-AddResolvableFieldsToCredentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddResolvableFieldsToCredentials1764689448000 implements Revers...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddResolvableFieldsToCredentials1764689448000
```

--------------------------------------------------------------------------------

---[FILE: 1765886667897-AddAgentIdForeignKeys.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/sqlite/1765886667897-AddAgentIdForeignKeys.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddAgentIdForeignKeys1765886667897 extends BaseMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddAgentIdForeignKeys1765886667897
```

--------------------------------------------------------------------------------

---[FILE: annotation-tag-mapping.repository.ee.ts]---
Location: n8n-master/packages/@n8n/db/src/repositories/annotation-tag-mapping.repository.ee.ts
Signals: TypeORM
Excerpt (<=80 chars): export class AnnotationTagMappingRepository extends Repository<AnnotationTagM...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AnnotationTagMappingRepository
```

--------------------------------------------------------------------------------

---[FILE: annotation-tag.repository.ee.ts]---
Location: n8n-master/packages/@n8n/db/src/repositories/annotation-tag.repository.ee.ts
Signals: TypeORM
Excerpt (<=80 chars): export class AnnotationTagRepository extends Repository<AnnotationTagEntity> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AnnotationTagRepository
```

--------------------------------------------------------------------------------

---[FILE: api-key.repository.ts]---
Location: n8n-master/packages/@n8n/db/src/repositories/api-key.repository.ts
Signals: TypeORM
Excerpt (<=80 chars): export class ApiKeyRepository extends Repository<ApiKey> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ApiKeyRepository
```

--------------------------------------------------------------------------------

---[FILE: auth-identity.repository.ts]---
Location: n8n-master/packages/@n8n/db/src/repositories/auth-identity.repository.ts
Signals: TypeORM
Excerpt (<=80 chars): export class AuthIdentityRepository extends Repository<AuthIdentity> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AuthIdentityRepository
```

--------------------------------------------------------------------------------

---[FILE: auth-provider-sync-history.repository.ts]---
Location: n8n-master/packages/@n8n/db/src/repositories/auth-provider-sync-history.repository.ts
Signals: TypeORM
Excerpt (<=80 chars): export class AuthProviderSyncHistoryRepository extends Repository<AuthProvide...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AuthProviderSyncHistoryRepository
```

--------------------------------------------------------------------------------

---[FILE: binary-data.repository.ts]---
Location: n8n-master/packages/@n8n/db/src/repositories/binary-data.repository.ts
Signals: TypeORM
Excerpt (<=80 chars): export class BinaryDataRepository extends Repository<BinaryDataFile> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BinaryDataRepository
```

--------------------------------------------------------------------------------

---[FILE: credentials.repository.ts]---
Location: n8n-master/packages/@n8n/db/src/repositories/credentials.repository.ts
Signals: TypeORM
Excerpt (<=80 chars): export class CredentialsRepository extends Repository<CredentialsEntity> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CredentialsRepository
```

--------------------------------------------------------------------------------

---[FILE: event-destinations.repository.ts]---
Location: n8n-master/packages/@n8n/db/src/repositories/event-destinations.repository.ts
Signals: TypeORM
Excerpt (<=80 chars): export class EventDestinationsRepository extends Repository<EventDestinations> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EventDestinationsRepository
```

--------------------------------------------------------------------------------

---[FILE: execution-annotation.repository.ts]---
Location: n8n-master/packages/@n8n/db/src/repositories/execution-annotation.repository.ts
Signals: TypeORM
Excerpt (<=80 chars): export class ExecutionAnnotationRepository extends Repository<ExecutionAnnota...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExecutionAnnotationRepository
```

--------------------------------------------------------------------------------

---[FILE: execution-data.repository.ts]---
Location: n8n-master/packages/@n8n/db/src/repositories/execution-data.repository.ts
Signals: TypeORM
Excerpt (<=80 chars): export class ExecutionDataRepository extends Repository<ExecutionData> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExecutionDataRepository
```

--------------------------------------------------------------------------------

---[FILE: execution-metadata.repository.ts]---
Location: n8n-master/packages/@n8n/db/src/repositories/execution-metadata.repository.ts
Signals: TypeORM
Excerpt (<=80 chars): export class ExecutionMetadataRepository extends Repository<ExecutionMetadata> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExecutionMetadataRepository
```

--------------------------------------------------------------------------------

---[FILE: execution.repository.ts]---
Location: n8n-master/packages/@n8n/db/src/repositories/execution.repository.ts
Signals: TypeORM
Excerpt (<=80 chars):  export interface IGetExecutionsQueryFilter {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExecutionRepository
- IGetExecutionsQueryFilter
```

--------------------------------------------------------------------------------

---[FILE: folder-tag-mapping.repository.ts]---
Location: n8n-master/packages/@n8n/db/src/repositories/folder-tag-mapping.repository.ts
Signals: TypeORM
Excerpt (<=80 chars): export class FolderTagMappingRepository extends Repository<FolderTagMapping> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FolderTagMappingRepository
```

--------------------------------------------------------------------------------

---[FILE: folder.repository.ts]---
Location: n8n-master/packages/@n8n/db/src/repositories/folder.repository.ts
Signals: TypeORM
Excerpt (<=80 chars): export class FolderRepository extends Repository<Folder> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FolderRepository
```

--------------------------------------------------------------------------------

---[FILE: invalid-auth-token.repository.ts]---
Location: n8n-master/packages/@n8n/db/src/repositories/invalid-auth-token.repository.ts
Signals: TypeORM
Excerpt (<=80 chars): export class InvalidAuthTokenRepository extends Repository<InvalidAuthToken> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InvalidAuthTokenRepository
```

--------------------------------------------------------------------------------

---[FILE: license-metrics.repository.ts]---
Location: n8n-master/packages/@n8n/db/src/repositories/license-metrics.repository.ts
Signals: TypeORM
Excerpt (<=80 chars): export class LicenseMetrics {}

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LicenseMetrics
- LicenseMetricsRepository
```

--------------------------------------------------------------------------------

---[FILE: processed-data.repository.ts]---
Location: n8n-master/packages/@n8n/db/src/repositories/processed-data.repository.ts
Signals: TypeORM
Excerpt (<=80 chars): export class ProcessedDataRepository extends Repository<ProcessedData> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProcessedDataRepository
```

--------------------------------------------------------------------------------

---[FILE: project-relation.repository.ts]---
Location: n8n-master/packages/@n8n/db/src/repositories/project-relation.repository.ts
Signals: TypeORM
Excerpt (<=80 chars): export class ProjectRelationRepository extends Repository<ProjectRelation> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProjectRelationRepository
```

--------------------------------------------------------------------------------

---[FILE: project.repository.ts]---
Location: n8n-master/packages/@n8n/db/src/repositories/project.repository.ts
Signals: TypeORM
Excerpt (<=80 chars): export class ProjectRepository extends Repository<Project> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProjectRepository
```

--------------------------------------------------------------------------------

---[FILE: role.repository.ts]---
Location: n8n-master/packages/@n8n/db/src/repositories/role.repository.ts
Signals: TypeORM
Excerpt (<=80 chars): export class RoleRepository extends Repository<Role> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RoleRepository
```

--------------------------------------------------------------------------------

---[FILE: scope.repository.ts]---
Location: n8n-master/packages/@n8n/db/src/repositories/scope.repository.ts
Signals: TypeORM
Excerpt (<=80 chars): export class ScopeRepository extends Repository<Scope> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ScopeRepository
```

--------------------------------------------------------------------------------

---[FILE: settings.repository.ts]---
Location: n8n-master/packages/@n8n/db/src/repositories/settings.repository.ts
Signals: TypeORM
Excerpt (<=80 chars): export class SettingsRepository extends Repository<Settings> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SettingsRepository
```

--------------------------------------------------------------------------------

---[FILE: shared-credentials.repository.ts]---
Location: n8n-master/packages/@n8n/db/src/repositories/shared-credentials.repository.ts
Signals: TypeORM
Excerpt (<=80 chars): export class SharedCredentialsRepository extends Repository<SharedCredentials> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SharedCredentialsRepository
```

--------------------------------------------------------------------------------

---[FILE: shared-workflow.repository.ts]---
Location: n8n-master/packages/@n8n/db/src/repositories/shared-workflow.repository.ts
Signals: TypeORM
Excerpt (<=80 chars): export class SharedWorkflowRepository extends Repository<SharedWorkflow> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SharedWorkflowRepository
```

--------------------------------------------------------------------------------

---[FILE: tag.repository.ts]---
Location: n8n-master/packages/@n8n/db/src/repositories/tag.repository.ts
Signals: TypeORM
Excerpt (<=80 chars): export class TagRepository extends Repository<TagEntity> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TagRepository
```

--------------------------------------------------------------------------------

---[FILE: test-case-execution.repository.ee.ts]---
Location: n8n-master/packages/@n8n/db/src/repositories/test-case-execution.repository.ee.ts
Signals: TypeORM
Excerpt (<=80 chars): export class TestCaseExecutionRepository extends Repository<TestCaseExecution> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestCaseExecutionRepository
```

--------------------------------------------------------------------------------

---[FILE: test-run.repository.ee.ts]---
Location: n8n-master/packages/@n8n/db/src/repositories/test-run.repository.ee.ts
Signals: TypeORM
Excerpt (<=80 chars):  export type TestRunSummary = TestRun & {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestRunRepository
- TestRunSummary
```

--------------------------------------------------------------------------------

---[FILE: user.repository.ts]---
Location: n8n-master/packages/@n8n/db/src/repositories/user.repository.ts
Signals: TypeORM
Excerpt (<=80 chars): export class UserRepository extends Repository<User> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UserRepository
```

--------------------------------------------------------------------------------

---[FILE: variables.repository.ts]---
Location: n8n-master/packages/@n8n/db/src/repositories/variables.repository.ts
Signals: TypeORM
Excerpt (<=80 chars): export class VariablesRepository extends Repository<Variables> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VariablesRepository
```

--------------------------------------------------------------------------------

---[FILE: webhook.repository.ts]---
Location: n8n-master/packages/@n8n/db/src/repositories/webhook.repository.ts
Signals: TypeORM
Excerpt (<=80 chars): export class WebhookRepository extends Repository<WebhookEntity> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebhookRepository
```

--------------------------------------------------------------------------------

---[FILE: workflow-dependency.repository.ts]---
Location: n8n-master/packages/@n8n/db/src/repositories/workflow-dependency.repository.ts
Signals: TypeORM
Excerpt (<=80 chars): export class WorkflowDependencies {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowDependencies
- WorkflowDependencyRepository
```

--------------------------------------------------------------------------------

---[FILE: workflow-history.repository.ts]---
Location: n8n-master/packages/@n8n/db/src/repositories/workflow-history.repository.ts
Signals: TypeORM
Excerpt (<=80 chars): export class WorkflowHistoryRepository extends Repository<WorkflowHistory> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowHistoryRepository
```

--------------------------------------------------------------------------------

---[FILE: workflow-publish-history.repository.ts]---
Location: n8n-master/packages/@n8n/db/src/repositories/workflow-publish-history.repository.ts
Signals: TypeORM
Excerpt (<=80 chars): export class WorkflowPublishHistoryRepository extends Repository<WorkflowPubl...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowPublishHistoryRepository
```

--------------------------------------------------------------------------------

---[FILE: workflow-statistics.repository.ts]---
Location: n8n-master/packages/@n8n/db/src/repositories/workflow-statistics.repository.ts
Signals: TypeORM
Excerpt (<=80 chars): export class WorkflowStatisticsRepository extends Repository<WorkflowStatisti...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowStatisticsRepository
```

--------------------------------------------------------------------------------

---[FILE: workflow-tag-mapping.repository.ts]---
Location: n8n-master/packages/@n8n/db/src/repositories/workflow-tag-mapping.repository.ts
Signals: TypeORM
Excerpt (<=80 chars): export class WorkflowTagMappingRepository extends Repository<WorkflowTagMappi...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowTagMappingRepository
```

--------------------------------------------------------------------------------

---[FILE: workflow.repository.ts]---
Location: n8n-master/packages/@n8n/db/src/repositories/workflow.repository.ts
Signals: TypeORM
Excerpt (<=80 chars):  export type WorkflowFolderUnionFull = (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowRepository
- WorkflowFolderUnionFull
```

--------------------------------------------------------------------------------

---[FILE: auth.roles.service.ts]---
Location: n8n-master/packages/@n8n/db/src/services/auth.roles.service.ts
Signals: N/A
Excerpt (<=80 chars): export class AuthRolesService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AuthRolesService
```

--------------------------------------------------------------------------------

````
