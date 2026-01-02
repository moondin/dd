---
source_txt: fullstack_samples/harness-main
converted_utc: 2025-12-18T10:36:50Z
part: 28
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES harness-main

## Extracted Reusable Patterns (Non-verbatim) (Part 28 of 37)

````text
================================================================================
FULLSTACK SAMPLES PATTERN DATABASE - harness-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/harness-main
================================================================================

NOTES:
- This file intentionally avoids copying large verbatim third-party code.
- It captures reusable patterns, surfaces, and file references.
- Use the referenced file paths to view full implementations locally.

================================================================================

---[FILE: ArtifactTreeNodeDetailsContent.tsx]---
Location: harness-main/web/src/ar/pages/artifact-details/components/ArtifactTreeNode/ArtifactTreeNodeDetailsContent.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ArtifactProvider.tsx]---
Location: harness-main/web/src/ar/pages/artifact-details/context/ArtifactProvider.tsx
Signals: React
Excerpt (<=80 chars):  export interface ArtifactProviderProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ArtifactProviderContext
- ArtifactProviderProps
```

--------------------------------------------------------------------------------

---[FILE: ArtifactDetailsPage.test.tsx]---
Location: harness-main/web/src/ar/pages/artifact-details/__tests__/ArtifactDetailsPage.test.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: __mockData__.ts]---
Location: harness-main/web/src/ar/pages/artifact-details/__tests__/__mockData__.ts
Signals: N/A
Excerpt (<=80 chars):  export const MOCK_GENERIC_ARTIFACT_SUMMARY = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MOCK_GENERIC_ARTIFACT_SUMMARY
```

--------------------------------------------------------------------------------

---[FILE: ArtifactListPage.tsx]---
Location: harness-main/web/src/ar/pages/artifact-list/ArtifactListPage.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RegistryArtifactListPage.tsx]---
Location: harness-main/web/src/ar/pages/artifact-list/RegistryArtifactListPage.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: harness-main/web/src/ar/pages/artifact-list/utils.ts
Signals: React
Excerpt (<=80 chars):  export type ArtifactListPageQueryParams = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useArtifactListQueryParamOptions
- ArtifactListPageQueryParams
```

--------------------------------------------------------------------------------

---[FILE: ArtifactListTable.tsx]---
Location: harness-main/web/src/ar/pages/artifact-list/components/ArtifactListTable/ArtifactListTable.tsx
Signals: React
Excerpt (<=80 chars):  export interface ArtifactListColumnActions {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ArtifactListColumnActions
- ArtifactListTableProps
```

--------------------------------------------------------------------------------

---[FILE: ArtifactListTableCell.tsx]---
Location: harness-main/web/src/ar/pages/artifact-list/components/ArtifactListTable/ArtifactListTableCell.tsx
Signals: React
Excerpt (<=80 chars):  export type ArtifactListExpandedColumnProps = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ArtifactListExpandedColumnProps
```

--------------------------------------------------------------------------------

---[FILE: ArtifactSearchInput.tsx]---
Location: harness-main/web/src/ar/pages/artifact-list/components/ArtifactSearchInput/ArtifactSearchInput.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: LabelsSelector.tsx]---
Location: harness-main/web/src/ar/pages/artifact-list/components/LabelsSelector/LabelsSelector.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RegistryArtifactListTable.tsx]---
Location: harness-main/web/src/ar/pages/artifact-list/components/RegistryArtifactListTable/RegistryArtifactListTable.tsx
Signals: React
Excerpt (<=80 chars):  export interface RegistryArtifactListColumnActions {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RegistryArtifactListColumnActions
- RegistryArtifactListTableProps
```

--------------------------------------------------------------------------------

---[FILE: RegistryArtifactListTableCell.tsx]---
Location: harness-main/web/src/ar/pages/artifact-list/components/RegistryArtifactListTable/RegistryArtifactListTableCell.tsx
Signals: React
Excerpt (<=80 chars):  export const RegistryArtifactNameCell: CellType = ({ row, value }) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: harness-main/web/src/ar/pages/artifact-list/components/RegistryArtifactListTable/utils.ts
Signals: React
Excerpt (<=80 chars):  export type RegistryArtifactListPageQueryParams = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useRegistryArtifactListQueryParamOptions
- RegistryArtifactListPageQueryParams
```

--------------------------------------------------------------------------------

---[FILE: RepositorySelector.tsx]---
Location: harness-main/web/src/ar/pages/artifact-list/components/RepositorySelector/RepositorySelector.tsx
Signals: React
Excerpt (<=80 chars):  export interface RepositorySelectorProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RepositorySelectorProps
```

--------------------------------------------------------------------------------

---[FILE: useLocalGetAllArtifactsByRegistryQuery.tsx]---
Location: harness-main/web/src/ar/pages/artifact-list/hooks/useLocalGetAllArtifactsByRegistryQuery.tsx
Signals: React
Excerpt (<=80 chars):  export const COLUMN_NAME_MAPPING_FROM_V2_TO_V1: Record<string, string> = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: useLocalGetAllHarnessArtifactsQuery.tsx]---
Location: harness-main/web/src/ar/pages/artifact-list/hooks/useLocalGetAllHarnessArtifactsQuery.tsx
Signals: React
Excerpt (<=80 chars):  export const COLUMN_NAME_MAPPING_FROM_V2_TO_V1: Record<string, string> = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ArtifactListPage.test.tsx]---
Location: harness-main/web/src/ar/pages/artifact-list/__tests__/ArtifactListPage.test.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RegistryArtifactListPage.test.tsx]---
Location: harness-main/web/src/ar/pages/artifact-list/__tests__/RegistryArtifactListPage.test.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: __mockData__.ts]---
Location: harness-main/web/src/ar/pages/artifact-list/__tests__/__mockData__.ts
Signals: N/A
Excerpt (<=80 chars):  export const mockEmptyUseGetAllHarnessArtifactsQueryResponse = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mockEmptyUseGetAllHarnessArtifactsQueryResponse
- mockErrorUseGetAllHarnessArtifactsQueryResponse
- mockUseGetAllHarnessArtifactsQueryResponse
- mockEmptyUseGetAllArtifactsByRegistryQuery
- mockErrorUseGetAllArtifactsByRegistryQuery
- mockUseGetAllArtifactsByRegistryQuery
- mockUseGetArtifactSummaryQueryResponse
```

--------------------------------------------------------------------------------

---[FILE: DigestListPage.tsx]---
Location: harness-main/web/src/ar/pages/digest-list/DigestListPage.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: harness-main/web/src/ar/pages/digest-list/utils.ts
Signals: N/A
Excerpt (<=80 chars):  export function getShortDigest(digest: string): string {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getShortDigest
```

--------------------------------------------------------------------------------

---[FILE: DigestActions.tsx]---
Location: harness-main/web/src/ar/pages/digest-list/components/DigestActions/DigestActions.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: QuarantineMenuItem.tsx]---
Location: harness-main/web/src/ar/pages/digest-list/components/DigestActions/QuarantineMenuItem.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RemoveQurantineMenuItem.tsx]---
Location: harness-main/web/src/ar/pages/digest-list/components/DigestActions/RemoveQurantineMenuItem.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: harness-main/web/src/ar/pages/digest-list/components/DigestActions/types.ts
Signals: N/A
Excerpt (<=80 chars):  export interface DigestActionProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DigestActionProps
```

--------------------------------------------------------------------------------

---[FILE: DigestListTable.tsx]---
Location: harness-main/web/src/ar/pages/digest-list/components/DigestListTable/DigestListTable.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DigestTableCells.tsx]---
Location: harness-main/web/src/ar/pages/digest-list/components/DigestListTable/DigestTableCells.tsx
Signals: React
Excerpt (<=80 chars):  export type DigestNameColumnProps = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DigestNameColumnProps
```

--------------------------------------------------------------------------------

---[FILE: LabelsListPage.tsx]---
Location: harness-main/web/src/ar/pages/labels-list/LabelsListPage.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: LabelsListTable.tsx]---
Location: harness-main/web/src/ar/pages/labels-list/LabelsListTable.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: harness-main/web/src/ar/pages/labels-list/types.ts
Signals: N/A
Excerpt (<=80 chars):  export type PaginationResponse = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PaginationResponse
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: harness-main/web/src/ar/pages/labels-list/utils.ts
Signals: React
Excerpt (<=80 chars):  export type LabelsListPageQueryParams = Omit<

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useLabelsQueryParamOptions
- LabelsListPageQueryParams
```

--------------------------------------------------------------------------------

---[FILE: CreateLabelButton.tsx]---
Location: harness-main/web/src/ar/pages/labels-list/components/CreateLabelButton/CreateLabelButton.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DeleteLabelActionItem.tsx]---
Location: harness-main/web/src/ar/pages/labels-list/components/LabelActions/DeleteLabelActionItem.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: EditLabelActionItem.tsx]---
Location: harness-main/web/src/ar/pages/labels-list/components/LabelActions/EditLabelActionItem.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: LabelActions.tsx]---
Location: harness-main/web/src/ar/pages/labels-list/components/LabelActions/LabelActions.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: type.ts]---
Location: harness-main/web/src/ar/pages/labels-list/components/LabelActions/type.ts
Signals: N/A
Excerpt (<=80 chars):  export interface LabelActionProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LabelActionProps
```

--------------------------------------------------------------------------------

---[FILE: CreateLabelForm.tsx]---
Location: harness-main/web/src/ar/pages/labels-list/components/LabelForm/CreateLabelForm.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: LabelForm.tsx]---
Location: harness-main/web/src/ar/pages/labels-list/components/LabelForm/LabelForm.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: LabelValuesListField.tsx]---
Location: harness-main/web/src/ar/pages/labels-list/components/LabelForm/LabelValuesListField.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: TextInputWithColorPicker.tsx]---
Location: harness-main/web/src/ar/pages/labels-list/components/LabelForm/TextInputWithColorPicker.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: harness-main/web/src/ar/pages/labels-list/components/LabelForm/types.ts
Signals: N/A
Excerpt (<=80 chars):  export interface LabelFormData extends Pick<TypesLabel, 'key' | 'type' | 'co...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LabelFormData
```

--------------------------------------------------------------------------------

---[FILE: UpdateLabelForm.tsx]---
Location: harness-main/web/src/ar/pages/labels-list/components/LabelForm/UpdateLabelForm.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: LabelValuesList.tsx]---
Location: harness-main/web/src/ar/pages/labels-list/components/LabelValuesList/LabelValuesList.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: LabelValuesListContent.tsx]---
Location: harness-main/web/src/ar/pages/labels-list/components/LabelValuesList/LabelValuesListContent.tsx
Signals: React
Excerpt (<=80 chars):  export function LabelValuesListContent(props: LabelValuesListContentProps) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LabelValuesListContent
```

--------------------------------------------------------------------------------

---[FILE: TableCells.tsx]---
Location: harness-main/web/src/ar/pages/labels-list/components/TableCells/TableCells.tsx
Signals: React
Excerpt (<=80 chars):  export type LabelListExpandedColumnProps = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LabelListExpandedColumnProps
- LabelListActionColumnProps
```

--------------------------------------------------------------------------------

---[FILE: useCreateLabelModal.tsx]---
Location: harness-main/web/src/ar/pages/labels-list/hooks/useCreateLabelModal.tsx
Signals: React
Excerpt (<=80 chars):  export interface useCreateLabelModalProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useCreateLabelModal
- useCreateLabelModalProps
```

--------------------------------------------------------------------------------

---[FILE: useUpdateLabelModal.tsx]---
Location: harness-main/web/src/ar/pages/labels-list/hooks/useUpdateLabelModal.tsx
Signals: React
Excerpt (<=80 chars):  export interface useUpdateLabelModalProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useUpdateLabelModal
- useUpdateLabelModalProps
```

--------------------------------------------------------------------------------

---[FILE: ManageRegistriesDetails.tsx]---
Location: harness-main/web/src/ar/pages/manage-registries/ManageRegistriesDetails.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ManageRegistriesHeader.tsx]---
Location: harness-main/web/src/ar/pages/manage-registries/ManageRegistriesHeader.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ManageRegistriesPage.tsx]---
Location: harness-main/web/src/ar/pages/manage-registries/ManageRegistriesPage.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ManageRegistriesTabs.tsx]---
Location: harness-main/web/src/ar/pages/manage-registries/ManageRegistriesTabs.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RedirectPage.tsx]---
Location: harness-main/web/src/ar/pages/redirect-page/RedirectPage.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: harness-main/web/src/ar/pages/repository-details/constants.ts
Signals: N/A
Excerpt (<=80 chars):  export const POLICY_TYPE = 'securityTests'

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- POLICY_TYPE
- POLICY_ACTION
- RepositoryVisibilityOptionType
- ScannerConfigSpec
```

--------------------------------------------------------------------------------

---[FILE: RepositoryDetails.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/RepositoryDetails.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RepositoryDetailsPage.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/RepositoryDetailsPage.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RepositoryDetailsTabPage.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/RepositoryDetailsTabPage.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RepositoryHeader.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/RepositoryHeader.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: harness-main/web/src/ar/pages/repository-details/types.ts
Signals: N/A
Excerpt (<=80 chars):  export type TypeConfig = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TypeConfig
- VirtualRegistryRequest
- VirtualRegistry
- RepositoryRequest
- Repository
```

--------------------------------------------------------------------------------

---[FILE: CargoRepositoryType.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/CargoRepository/CargoRepositoryType.tsx
Signals: React
Excerpt (<=80 chars):  export class CargoRepositoryType extends RepositoryStep<VirtualRegistryReque...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CargoRepositoryType
```

--------------------------------------------------------------------------------

---[FILE: DeleteRepository.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/components/Actions/DeleteRepository.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RepositoryActions.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/components/Actions/RepositoryActions.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: SetupClient.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/components/Actions/SetupClient.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: harness-main/web/src/ar/pages/repository-details/components/Actions/types.ts
Signals: N/A
Excerpt (<=80 chars):  export interface RepositoryActionsProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RepositoryActionsProps
```

--------------------------------------------------------------------------------

---[FILE: DeleteRepository.test.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/components/Actions/__tests__/DeleteRepository.test.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RepositoryActions.test.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/components/Actions/__tests__/RepositoryActions.test.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: SetupClient.test.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/components/Actions/__tests__/SetupClient.test.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RepositoryCleanupPoliciesFormContent.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/components/FormContent/RepositoryCleanupPoliciesFormContent.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RepositoryConfigurationFormContent.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/components/FormContent/RepositoryConfigurationFormContent.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RepositoryCreateFormContent.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/components/FormContent/RepositoryCreateFormContent.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RepositoryDetailsFormContent.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/components/FormContent/RepositoryDetailsFormContent.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RepositoryIncludeExcludePatternFormContent.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/components/FormContent/RepositoryIncludeExcludePatternFormContent.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RepositoryOpaPolicySelectorContent.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/components/FormContent/RepositoryOpaPolicySelectorContent.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RepositoryUpstreamProxiesFormContent.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/components/FormContent/RepositoryUpstreamProxiesFormContent.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RepositoryVisibilityContent.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/components/FormContent/RepositoryVisibilityContent.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: SelectContainerScannersFormSection.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/components/FormContent/SelectContainerScannersFormSection.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: SelectScannerFormSection.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/components/FormContent/SelectScannerFormSection.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RepositoryConfigurationFormContent.test.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/components/FormContent/__tests__/RepositoryConfigurationFormContent.test.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RepositoryUpstreamProxiesFormContent.test.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/components/FormContent/__tests__/RepositoryUpstreamProxiesFormContent.test.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: SelectContainerScannersFormSection.test.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/components/FormContent/__tests__/SelectContainerScannersFormSection.test.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: TestFormUtils.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/components/FormContent/__tests__/TestFormUtils.tsx
Signals: React
Excerpt (<=80 chars):  export const RepositoryFormComponent = (props: PropsWithChildren<RepositoryF...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RepositoryFormComponent
```

--------------------------------------------------------------------------------

---[FILE: __mockData__.ts]---
Location: harness-main/web/src/ar/pages/repository-details/components/FormContent/__tests__/__mockData__.ts
Signals: N/A
Excerpt (<=80 chars):  export const MockGetDockerRegistryResponseWithMinimumData = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MockGetDockerRegistryResponseWithMinimumData
- MockGetDockerRegistryResponseWithMinimumDataForOSS
- MockGetUpstreamProxyRegistryListResponse
```

--------------------------------------------------------------------------------

---[FILE: RepositoryConfigurationForm.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/components/Forms/RepositoryConfigurationForm.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RepositoryCreateForm.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/components/Forms/RepositoryCreateForm.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RepositoryCreateForm.test.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/components/Forms/__tests__/RepositoryCreateForm.test.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RedirectPageView.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/components/RedirectPageView/RedirectPageView.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RepositoryDetailsHeader.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/components/RepositoryDetailsHeader/RepositoryDetailsHeader.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RepositoryDetailsHeaderContent.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/components/RepositoryDetailsHeader/RepositoryDetailsHeaderContent.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RepositoryDetailsHeaderContent.test.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/components/RepositoryDetailsHeader/__tests__/RepositoryDetailsHeaderContent.test.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RepositoryTreeNode.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/components/RepositoryTreeNode/RepositoryTreeNode.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RepositoryTreeNodeDetails.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/components/RepositoryTreeNode/RepositoryTreeNodeDetails.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: GenerateTokenStep.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/components/SetupClientContent/GenerateTokenStep.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: InlineSectionContent.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/components/SetupClientContent/InlineSectionContent.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: SetupClientContent.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/components/SetupClientContent/SetupClientContent.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: SetupClientSectionContent.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/components/SetupClientContent/SetupClientSectionContent.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: GenerateTokenStep.test.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/components/SetupClientContent/__tests__/GenerateTokenStep.test.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/components/UpstreamProxiesSelect/index.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ComposerRepositoryType.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/ComposerRepository/ComposerRepositoryType.tsx
Signals: React
Excerpt (<=80 chars):  export class ComposerRepositoryType extends RepositoryStep<VirtualRegistryRe...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ComposerRepositoryType
```

--------------------------------------------------------------------------------

---[FILE: CondaRepositoryType.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/CondaRepository/CondaRepositoryType.tsx
Signals: React
Excerpt (<=80 chars):  export class CondaRepositoryType extends RepositoryStep<VirtualRegistryReque...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CondaRepositoryType
```

--------------------------------------------------------------------------------

````
