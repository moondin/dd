---
source_txt: fullstack_samples/n8n-master
converted_utc: 2025-12-18T10:47:15Z
part: 6
parts_total: 51
---

# FULLSTACK CODE DATABASE SAMPLES n8n-master

## Extracted Reusable Patterns (Non-verbatim) (Part 6 of 51)

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

---[FILE: 1720101653148-AddConstraintToExecutionMetadata.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1720101653148-AddConstraintToExecutionMetadata.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddConstraintToExecutionMetadata1720101653148 implements Revers...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddConstraintToExecutionMetadata1720101653148
```

--------------------------------------------------------------------------------

---[FILE: 1723627610222-CreateInvalidAuthTokenTable.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1723627610222-CreateInvalidAuthTokenTable.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateInvalidAuthTokenTable1723627610222 implements ReversibleM...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateInvalidAuthTokenTable1723627610222
```

--------------------------------------------------------------------------------

---[FILE: 1723796243146-RefactorExecutionIndices.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1723796243146-RefactorExecutionIndices.ts
Signals: N/A
Excerpt (<=80 chars): export class RefactorExecutionIndices1723796243146 implements ReversibleMigra...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RefactorExecutionIndices1723796243146
```

--------------------------------------------------------------------------------

---[FILE: 1724753530828-CreateExecutionAnnotationTables.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1724753530828-CreateExecutionAnnotationTables.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateAnnotationTables1724753530828 implements ReversibleMigrat...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateAnnotationTables1724753530828
```

--------------------------------------------------------------------------------

---[FILE: 1724951148974-AddApiKeysTable.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1724951148974-AddApiKeysTable.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddApiKeysTable1724951148974 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddApiKeysTable1724951148974
```

--------------------------------------------------------------------------------

---[FILE: 1726606152711-CreateProcessedDataTable.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1726606152711-CreateProcessedDataTable.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateProcessedDataTable1726606152711 implements ReversibleMigr...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateProcessedDataTable1726606152711
```

--------------------------------------------------------------------------------

---[FILE: 1727427440136-SeparateExecutionCreationFromStart.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1727427440136-SeparateExecutionCreationFromStart.ts
Signals: N/A
Excerpt (<=80 chars):  export class SeparateExecutionCreationFromStart1727427440136 implements Reve...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SeparateExecutionCreationFromStart1727427440136
```

--------------------------------------------------------------------------------

---[FILE: 1728659839644-AddMissingPrimaryKeyOnAnnotationTagMapping.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1728659839644-AddMissingPrimaryKeyOnAnnotationTagMapping.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddMissingPrimaryKeyOnAnnotationTagMapping1728659839644

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddMissingPrimaryKeyOnAnnotationTagMapping1728659839644
```

--------------------------------------------------------------------------------

---[FILE: 1729607673464-UpdateProcessedDataValueColumnToText.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1729607673464-UpdateProcessedDataValueColumnToText.ts
Signals: N/A
Excerpt (<=80 chars): export class UpdateProcessedDataValueColumnToText1729607673464 implements Rev...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateProcessedDataValueColumnToText1729607673464
```

--------------------------------------------------------------------------------

---[FILE: 1729607673469-AddProjectIcons.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1729607673469-AddProjectIcons.ts
Signals: N/A
Excerpt (<=80 chars): export class AddProjectIcons1729607673469 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddProjectIcons1729607673469
```

--------------------------------------------------------------------------------

---[FILE: 1730386903556-CreateTestDefinitionTable.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1730386903556-CreateTestDefinitionTable.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateTestDefinitionTable1730386903556 implements ReversibleMig...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateTestDefinitionTable1730386903556
```

--------------------------------------------------------------------------------

---[FILE: 1731404028106-AddDescriptionToTestDefinition.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1731404028106-AddDescriptionToTestDefinition.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddDescriptionToTestDefinition1731404028106 implements Reversib...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddDescriptionToTestDefinition1731404028106
```

--------------------------------------------------------------------------------

---[FILE: 1732271325258-CreateTestMetricTable.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1732271325258-CreateTestMetricTable.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateTestMetricTable1732271325258 implements ReversibleMigrati...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateTestMetricTable1732271325258
```

--------------------------------------------------------------------------------

---[FILE: 1732549866705-CreateTestRunTable.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1732549866705-CreateTestRunTable.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateTestRun1732549866705 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateTestRun1732549866705
```

--------------------------------------------------------------------------------

---[FILE: 1733133775640-AddMockedNodesColumnToTestDefinition.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1733133775640-AddMockedNodesColumnToTestDefinition.ts
Signals: N/A
Excerpt (<=80 chars): export class AddMockedNodesColumnToTestDefinition1733133775640 implements Rev...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddMockedNodesColumnToTestDefinition1733133775640
```

--------------------------------------------------------------------------------

---[FILE: 1734479635324-AddManagedColumnToCredentialsTable.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1734479635324-AddManagedColumnToCredentialsTable.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddManagedColumnToCredentialsTable1734479635324 implements Reve...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddManagedColumnToCredentialsTable1734479635324
```

--------------------------------------------------------------------------------

---[FILE: 1736172058779-AddStatsColumnsToTestRun.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1736172058779-AddStatsColumnsToTestRun.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddStatsColumnsToTestRun1736172058779 implements ReversibleMigr...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddStatsColumnsToTestRun1736172058779
```

--------------------------------------------------------------------------------

---[FILE: 1736947513045-CreateTestCaseExecutionTable.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1736947513045-CreateTestCaseExecutionTable.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateTestCaseExecutionTable1736947513045 implements Reversible...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateTestCaseExecutionTable1736947513045
```

--------------------------------------------------------------------------------

---[FILE: 1737715421462-AddErrorColumnsToTestRuns.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1737715421462-AddErrorColumnsToTestRuns.ts
Signals: N/A
Excerpt (<=80 chars): export class AddErrorColumnsToTestRuns1737715421462 implements ReversibleMigr...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddErrorColumnsToTestRuns1737715421462
```

--------------------------------------------------------------------------------

---[FILE: 1738709609940-CreateFolderTable.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1738709609940-CreateFolderTable.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateFolderTable1738709609940 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateFolderTable1738709609940
```

--------------------------------------------------------------------------------

---[FILE: 1739549398681-CreateAnalyticsTables.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1739549398681-CreateAnalyticsTables.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateAnalyticsTables1739549398681 implements ReversibleMigrati...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateAnalyticsTables1739549398681
```

--------------------------------------------------------------------------------

---[FILE: 1741167584277-RenameAnalyticsToInsights.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1741167584277-RenameAnalyticsToInsights.ts
Signals: N/A
Excerpt (<=80 chars):  export class RenameAnalyticsToInsights1741167584277 implements IrreversibleM...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RenameAnalyticsToInsights1741167584277
```

--------------------------------------------------------------------------------

---[FILE: 1742918400000-AddScopesColumnToApiKeys.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1742918400000-AddScopesColumnToApiKeys.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddScopesColumnToApiKeys1742918400000 implements ReversibleMigr...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddScopesColumnToApiKeys1742918400000
```

--------------------------------------------------------------------------------

---[FILE: 1745322634000-CleanEvaluations.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1745322634000-CleanEvaluations.ts
Signals: N/A
Excerpt (<=80 chars): export class ClearEvaluation1745322634000 implements IrreversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ClearEvaluation1745322634000
```

--------------------------------------------------------------------------------

---[FILE: 1745587087521-AddWorkflowStatisticsRootCount.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1745587087521-AddWorkflowStatisticsRootCount.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddWorkflowStatisticsRootCount1745587087521 implements Reversib...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddWorkflowStatisticsRootCount1745587087521
```

--------------------------------------------------------------------------------

---[FILE: 1745934666076-AddWorkflowArchivedColumn.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1745934666076-AddWorkflowArchivedColumn.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddWorkflowArchivedColumn1745934666076 implements ReversibleMig...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddWorkflowArchivedColumn1745934666076
```

--------------------------------------------------------------------------------

---[FILE: 1745934666077-DropRoleTable.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1745934666077-DropRoleTable.ts
Signals: N/A
Excerpt (<=80 chars): export class DropRoleTable1745934666077 implements IrreversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DropRoleTable1745934666077
```

--------------------------------------------------------------------------------

---[FILE: 1747824239000-AddProjectDescriptionColumn.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1747824239000-AddProjectDescriptionColumn.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddProjectDescriptionColumn1747824239000 implements ReversibleM...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddProjectDescriptionColumn1747824239000
```

--------------------------------------------------------------------------------

---[FILE: 1750252139166-AddLastActiveAtColumnToUser.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1750252139166-AddLastActiveAtColumnToUser.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddLastActiveAtColumnToUser1750252139166 implements ReversibleM...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddLastActiveAtColumnToUser1750252139166
```

--------------------------------------------------------------------------------

---[FILE: 1750252139166-AddScopeTables.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1750252139166-AddScopeTables.ts
Signals: N/A
Excerpt (<=80 chars): export class AddScopeTables1750252139166 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddScopeTables1750252139166
```

--------------------------------------------------------------------------------

---[FILE: 1750252139167-AddRolesTables.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1750252139167-AddRolesTables.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddRolesTables1750252139167 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddRolesTables1750252139167
```

--------------------------------------------------------------------------------

---[FILE: 1750252139168-LinkRoleToUserTable.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1750252139168-LinkRoleToUserTable.ts
Signals: N/A
Excerpt (<=80 chars): export class LinkRoleToUserTable1750252139168 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LinkRoleToUserTable1750252139168
```

--------------------------------------------------------------------------------

---[FILE: 1750252139170-RemoveOldRoleColumn.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1750252139170-RemoveOldRoleColumn.ts
Signals: N/A
Excerpt (<=80 chars): export class RemoveOldRoleColumn1750252139170 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RemoveOldRoleColumn1750252139170
```

--------------------------------------------------------------------------------

---[FILE: 1752669793000-AddInputsOutputsToTestCaseExecution.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1752669793000-AddInputsOutputsToTestCaseExecution.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddInputsOutputsToTestCaseExecution1752669793000 implements Rev...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddInputsOutputsToTestCaseExecution1752669793000
```

--------------------------------------------------------------------------------

---[FILE: 1753953244168-LinkRoleToProjectRelationTable.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1753953244168-LinkRoleToProjectRelationTable.ts
Signals: N/A
Excerpt (<=80 chars):  export class LinkRoleToProjectRelationTable1753953244168 implements Reversib...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LinkRoleToProjectRelationTable1753953244168
```

--------------------------------------------------------------------------------

---[FILE: 1754475614601-CreateDataStoreTables.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1754475614601-CreateDataStoreTables.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateDataStoreTables1754475614601 implements ReversibleMigrati...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateDataStoreTables1754475614601
```

--------------------------------------------------------------------------------

---[FILE: 1754475614602-ReplaceDataStoreTablesWithDataTables.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1754475614602-ReplaceDataStoreTablesWithDataTables.ts
Signals: N/A
Excerpt (<=80 chars):  export class ReplaceDataStoreTablesWithDataTables1754475614602 implements Re...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ReplaceDataStoreTablesWithDataTables1754475614602
```

--------------------------------------------------------------------------------

---[FILE: 1756906557570-AddTimestampsToRoleAndRoleIndexes.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1756906557570-AddTimestampsToRoleAndRoleIndexes.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddTimestampsToRoleAndRoleIndexes1756906557570 implements Irrev...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddTimestampsToRoleAndRoleIndexes1756906557570
```

--------------------------------------------------------------------------------

---[FILE: 1758731786132-AddAudienceColumnToApiKey.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1758731786132-AddAudienceColumnToApiKey.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddAudienceColumnToApiKeys1758731786132 implements ReversibleMi...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddAudienceColumnToApiKeys1758731786132
```

--------------------------------------------------------------------------------

---[FILE: 1759399811000-ChangeValueTypesForInsights.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1759399811000-ChangeValueTypesForInsights.ts
Signals: N/A
Excerpt (<=80 chars):  export class ChangeValueTypesForInsights1759399811000 implements Irreversibl...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ChangeValueTypesForInsights1759399811000
```

--------------------------------------------------------------------------------

---[FILE: 1760019379982-CreateChatHubTables.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1760019379982-CreateChatHubTables.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateChatHubTables1760019379982 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateChatHubTables1760019379982
```

--------------------------------------------------------------------------------

---[FILE: 1760020000000-CreateChatHubAgentTable.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1760020000000-CreateChatHubAgentTable.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateChatHubAgentTable1760020000000 implements ReversibleMigra...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateChatHubAgentTable1760020000000
```

--------------------------------------------------------------------------------

---[FILE: 1760020838000-UniqueRoleNames.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1760020838000-UniqueRoleNames.ts
Signals: N/A
Excerpt (<=80 chars):  export class UniqueRoleNames1760020838000 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UniqueRoleNames1760020838000
```

--------------------------------------------------------------------------------

---[FILE: 1760116750277-CreateOAuthEntities.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1760116750277-CreateOAuthEntities.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateOAuthEntities1760116750277 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateOAuthEntities1760116750277
```

--------------------------------------------------------------------------------

---[FILE: 1760314000000-CreateWorkflowDependencyTable.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1760314000000-CreateWorkflowDependencyTable.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateWorkflowDependencyTable1760314000000 implements Reversibl...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateWorkflowDependencyTable1760314000000
```

--------------------------------------------------------------------------------

---[FILE: 1760965142113-DropUnusedChatHubColumns.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1760965142113-DropUnusedChatHubColumns.ts
Signals: N/A
Excerpt (<=80 chars):  export class DropUnusedChatHubColumns1760965142113 implements ReversibleMigr...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DropUnusedChatHubColumns1760965142113
```

--------------------------------------------------------------------------------

---[FILE: 1761773155024-AddAttachmentsToChatHubMessages.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1761773155024-AddAttachmentsToChatHubMessages.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddAttachmentsToChatHubMessages1761773155024 implements Reversi...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddAttachmentsToChatHubMessages1761773155024
```

--------------------------------------------------------------------------------

---[FILE: 1761830340990-AddToolsColumnToChatHubTables.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1761830340990-AddToolsColumnToChatHubTables.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddToolsColumnToChatHubTables1761830340990 implements Reversibl...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddToolsColumnToChatHubTables1761830340990
```

--------------------------------------------------------------------------------

---[FILE: 1762177736257-AddWorkflowDescriptionColumn.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1762177736257-AddWorkflowDescriptionColumn.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddWorkflowDescriptionColumn1762177736257 implements Reversible...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddWorkflowDescriptionColumn1762177736257
```

--------------------------------------------------------------------------------

---[FILE: 1762763704614-BackfillMissingWorkflowHistoryRecords.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1762763704614-BackfillMissingWorkflowHistoryRecords.ts
Signals: N/A
Excerpt (<=80 chars):  export class BackfillMissingWorkflowHistoryRecords1762763704614 implements I...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BackfillMissingWorkflowHistoryRecords1762763704614
```

--------------------------------------------------------------------------------

---[FILE: 1762771954619-IsGlobalGlobalColumnToCredentialsTable.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1762771954619-IsGlobalGlobalColumnToCredentialsTable.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddIsGlobalColumnToCredentialsTable1762771954619 implements Rev...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddIsGlobalColumnToCredentialsTable1762771954619
```

--------------------------------------------------------------------------------

---[FILE: 1762847206508-AddWorkflowHistoryAutoSaveFields.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1762847206508-AddWorkflowHistoryAutoSaveFields.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddWorkflowHistoryAutoSaveFields1762847206508 implements Revers...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddWorkflowHistoryAutoSaveFields1762847206508
```

--------------------------------------------------------------------------------

---[FILE: 1763047800000-AddActiveVersionIdColumn.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1763047800000-AddActiveVersionIdColumn.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddActiveVersionIdColumn1763047800000 implements ReversibleMigr...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddActiveVersionIdColumn1763047800000
```

--------------------------------------------------------------------------------

---[FILE: 1763048000000-ActivateExecuteWorkflowTriggerWorkflows.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1763048000000-ActivateExecuteWorkflowTriggerWorkflows.ts
Signals: N/A
Excerpt (<=80 chars): export class ActivateExecuteWorkflowTriggerWorkflows1763048000000 implements ...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ActivateExecuteWorkflowTriggerWorkflows1763048000000
```

--------------------------------------------------------------------------------

---[FILE: 1763572724000-ChangeOAuthStateColumnToUnboundedVarchar.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1763572724000-ChangeOAuthStateColumnToUnboundedVarchar.ts
Signals: N/A
Excerpt (<=80 chars):  export class ChangeOAuthStateColumnToUnboundedVarchar1763572724000

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ChangeOAuthStateColumnToUnboundedVarchar1763572724000
```

--------------------------------------------------------------------------------

---[FILE: 1763716655000-CreateBinaryDataTable.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1763716655000-CreateBinaryDataTable.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateBinaryDataTable1763716655000 implements ReversibleMigrati...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateBinaryDataTable1763716655000
```

--------------------------------------------------------------------------------

---[FILE: 1764167920585-CreateWorkflowPublishHistoryTable.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1764167920585-CreateWorkflowPublishHistoryTable.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateWorkflowPublishHistoryTable1764167920585 implements Rever...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateWorkflowPublishHistoryTable1764167920585
```

--------------------------------------------------------------------------------

---[FILE: 1764276827837-AddCreatorIdToProjectTable.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1764276827837-AddCreatorIdToProjectTable.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddCreatorIdToProjectTable1764276827837 implements ReversibleMi...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddCreatorIdToProjectTable1764276827837
```

--------------------------------------------------------------------------------

---[FILE: 1764682447000-CreateCredentialResolverTable.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1764682447000-CreateCredentialResolverTable.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateDynamicCredentialResolverTable1764682447000 implements Re...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateDynamicCredentialResolverTable1764682447000
```

--------------------------------------------------------------------------------

---[FILE: 1764689388394-AddDynamicCredentialEntryTable.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1764689388394-AddDynamicCredentialEntryTable.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddDynamicCredentialEntryTable1764689388394 implements Reversib...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddDynamicCredentialEntryTable1764689388394
```

--------------------------------------------------------------------------------

---[FILE: 1765448186933-BackfillMissingWorkflowHistoryRecords.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1765448186933-BackfillMissingWorkflowHistoryRecords.ts
Signals: N/A
Excerpt (<=80 chars): export class BackfillMissingWorkflowHistoryRecords1765448186933 implements Ir...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BackfillMissingWorkflowHistoryRecords1765448186933
```

--------------------------------------------------------------------------------

---[FILE: 1765459448000-AddResolvableFieldsToCredentials.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1765459448000-AddResolvableFieldsToCredentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddResolvableFieldsToCredentials1765459448000 implements Revers...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddResolvableFieldsToCredentials1765459448000
```

--------------------------------------------------------------------------------

---[FILE: 1765788427674-AddIconToAgentTable.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1765788427674-AddIconToAgentTable.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddIconToAgentTable1765788427674 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddIconToAgentTable1765788427674
```

--------------------------------------------------------------------------------

---[FILE: 1765886667897-AddAgentIdForeignKeys.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1765886667897-AddAgentIdForeignKeys.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddAgentIdForeignKeys1765886667897 implements ReversibleMigrati...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddAgentIdForeignKeys1765886667897
```

--------------------------------------------------------------------------------

---[FILE: 1765892199653-AddVersionIdToExecutionData.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/common/1765892199653-AddVersionIdToExecutionData.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddWorkflowVersionIdToExecutionData1765892199653 implements Rev...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddWorkflowVersionIdToExecutionData1765892199653
```

--------------------------------------------------------------------------------

---[FILE: column.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/dsl/column.ts
Signals: N/A
Excerpt (<=80 chars):  export class Column {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Column
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/dsl/index.ts
Signals: N/A
Excerpt (<=80 chars):  export const createSchemaBuilder = (tablePrefix: string, queryRunner: QueryR...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createSchemaBuilder
```

--------------------------------------------------------------------------------

---[FILE: indices.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/dsl/indices.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateIndex extends IndexOperation {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateIndex
- DropIndex
```

--------------------------------------------------------------------------------

---[FILE: table.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/dsl/table.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateTable extends TableOperation {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateTable
- DropTable
- AddColumns
- DropColumns
- AddForeignKey
- DropForeignKey
- AddNotNull
- DropNotNull
```

--------------------------------------------------------------------------------

---[FILE: 1588157391238-InitialMigration.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1588157391238-InitialMigration.ts
Signals: N/A
Excerpt (<=80 chars):  export class InitialMigration1588157391238 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InitialMigration1588157391238
```

--------------------------------------------------------------------------------

---[FILE: 1592447867632-WebhookModel.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1592447867632-WebhookModel.ts
Signals: N/A
Excerpt (<=80 chars):  export class WebhookModel1592447867632 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebhookModel1592447867632
```

--------------------------------------------------------------------------------

---[FILE: 1594902918301-CreateIndexStoppedAt.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1594902918301-CreateIndexStoppedAt.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateIndexStoppedAt1594902918301 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateIndexStoppedAt1594902918301
```

--------------------------------------------------------------------------------

---[FILE: 1607431743767-MakeStoppedAtNullable.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1607431743767-MakeStoppedAtNullable.ts
Signals: N/A
Excerpt (<=80 chars):  export class MakeStoppedAtNullable1607431743767 implements ReversibleMigrati...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MakeStoppedAtNullable1607431743767
```

--------------------------------------------------------------------------------

---[FILE: 1611149998770-AddWebhookId.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1611149998770-AddWebhookId.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddWebhookId1611149998770 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddWebhookId1611149998770
```

--------------------------------------------------------------------------------

---[FILE: 1615306975123-ChangeDataSize.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1615306975123-ChangeDataSize.ts
Signals: N/A
Excerpt (<=80 chars):  export class ChangeDataSize1615306975123 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ChangeDataSize1615306975123
```

--------------------------------------------------------------------------------

---[FILE: 1617268711084-CreateTagEntity.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1617268711084-CreateTagEntity.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateTagEntity1617268711084 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateTagEntity1617268711084
```

--------------------------------------------------------------------------------

---[FILE: 1620729500000-ChangeCredentialDataSize.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1620729500000-ChangeCredentialDataSize.ts
Signals: N/A
Excerpt (<=80 chars):  export class ChangeCredentialDataSize1620729500000 implements ReversibleMigr...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ChangeCredentialDataSize1620729500000
```

--------------------------------------------------------------------------------

---[FILE: 1620826335440-UniqueWorkflowNames.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1620826335440-UniqueWorkflowNames.ts
Signals: N/A
Excerpt (<=80 chars):  export class UniqueWorkflowNames1620826335440 extends UniqueWorkflowNames162...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UniqueWorkflowNames1620826335440
```

--------------------------------------------------------------------------------

---[FILE: 1623936588000-CertifyCorrectCollation.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1623936588000-CertifyCorrectCollation.ts
Signals: N/A
Excerpt (<=80 chars):  export class CertifyCorrectCollation1623936588000 implements IrreversibleMig...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CertifyCorrectCollation1623936588000
```

--------------------------------------------------------------------------------

---[FILE: 1626183952959-AddWaitColumn.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1626183952959-AddWaitColumn.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddWaitColumnId1626183952959 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddWaitColumnId1626183952959
```

--------------------------------------------------------------------------------

---[FILE: 1630451444017-UpdateWorkflowCredentials.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1630451444017-UpdateWorkflowCredentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class UpdateWorkflowCredentials1630451444017 extends UpdateWorkflowCr...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateWorkflowCredentials1630451444017
```

--------------------------------------------------------------------------------

---[FILE: 1644424784709-AddExecutionEntityIndexes.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1644424784709-AddExecutionEntityIndexes.ts
Signals: N/A
Excerpt (<=80 chars):  export class AddExecutionEntityIndexes1644424784709 implements ReversibleMig...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddExecutionEntityIndexes1644424784709
```

--------------------------------------------------------------------------------

---[FILE: 1646992772331-CreateUserManagement.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1646992772331-CreateUserManagement.ts
Signals: N/A
Excerpt (<=80 chars):  export class CreateUserManagement1646992772331 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateUserManagement1646992772331
```

--------------------------------------------------------------------------------

---[FILE: 1648740597343-LowerCaseUserEmail.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1648740597343-LowerCaseUserEmail.ts
Signals: N/A
Excerpt (<=80 chars):  export class LowerCaseUserEmail1648740597343 implements IrreversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LowerCaseUserEmail1648740597343
```

--------------------------------------------------------------------------------

---[FILE: 1652254514003-CommunityNodes.ts]---
Location: n8n-master/packages/@n8n/db/src/migrations/mysqldb/1652254514003-CommunityNodes.ts
Signals: N/A
Excerpt (<=80 chars):  export class CommunityNodes1652254514003 implements ReversibleMigration {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CommunityNodes1652254514003
```

--------------------------------------------------------------------------------

````
