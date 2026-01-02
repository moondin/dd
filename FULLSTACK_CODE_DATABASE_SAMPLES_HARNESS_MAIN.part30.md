---
source_txt: fullstack_samples/harness-main
converted_utc: 2025-12-18T10:36:50Z
part: 30
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES harness-main

## Extracted Reusable Patterns (Non-verbatim) (Part 30 of 37)

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

---[FILE: ArtifactFilesContent.tsx]---
Location: harness-main/web/src/ar/pages/version-details/components/ArtifactFileListTable/ArtifactFilesContent.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ArtifactListTableCells.tsx]---
Location: harness-main/web/src/ar/pages/version-details/components/ArtifactFileListTable/ArtifactListTableCells.tsx
Signals: React
Excerpt (<=80 chars):  export const FileNameCell: CellType = ({ value }) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: harness-main/web/src/ar/pages/version-details/components/ArtifactFileListTable/utils.ts
Signals: React
Excerpt (<=80 chars):  export type ArtifactFileListPageQueryParams = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useArtifactFileListQueryParamOptions
- ArtifactFileListPageQueryParams
```

--------------------------------------------------------------------------------

---[FILE: DeploymentsCard.tsx]---
Location: harness-main/web/src/ar/pages/version-details/components/DeploymentsCard/DeploymentsCard.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DeploymentsContent.tsx]---
Location: harness-main/web/src/ar/pages/version-details/components/DeploymentsContent/DeploymentsContent.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: harness-main/web/src/ar/pages/version-details/components/DeploymentsContent/types.ts
Signals: N/A
Excerpt (<=80 chars):  export interface DeploymentsListSortBy {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeploymentsListSortBy
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: harness-main/web/src/ar/pages/version-details/components/DeploymentsContent/utils.ts
Signals: React
Excerpt (<=80 chars):  export type ArtifactVersionDeploymentsTableQueryParams = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useArtifactVersionDeploymentsTableQueryParamOptions
- ArtifactVersionDeploymentsTableQueryParams
```

--------------------------------------------------------------------------------

---[FILE: DeploymentOverviewCards.tsx]---
Location: harness-main/web/src/ar/pages/version-details/components/DeploymentsContent/DeploymentOverviewCards/DeploymentOverviewCards.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DeploymentsTable.tsx]---
Location: harness-main/web/src/ar/pages/version-details/components/DeploymentsContent/DeploymentsTable/DeploymentsTable.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DeploymentsTableCells.tsx]---
Location: harness-main/web/src/ar/pages/version-details/components/DeploymentsContent/DeploymentsTable/DeploymentsTableCells.tsx
Signals: React
Excerpt (<=80 chars):  export const EnvironmentNameCell: CellType = ({ row }) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: LabelValueContent.tsx]---
Location: harness-main/web/src/ar/pages/version-details/components/LabelValueContent/LabelValueContent.tsx
Signals: React
Excerpt (<=80 chars):  export function CopyText(props: CopyTextProps): JSX.Element {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CopyText
- LabelValueContent
```

--------------------------------------------------------------------------------

---[FILE: ManifestDetails.tsx]---
Location: harness-main/web/src/ar/pages/version-details/components/ManifestDetails/ManifestDetails.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DigestListSelector.tsx]---
Location: harness-main/web/src/ar/pages/version-details/components/OCIVersionSelector/DigestListSelector.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: MenuItemLabel.tsx]---
Location: harness-main/web/src/ar/pages/version-details/components/OCIVersionSelector/MenuItemLabel.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: OCIVersionSelector.tsx]---
Location: harness-main/web/src/ar/pages/version-details/components/OCIVersionSelector/OCIVersionSelector.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: TagListSelector.tsx]---
Location: harness-main/web/src/ar/pages/version-details/components/OCIVersionSelector/TagListSelector.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: TagOrDigestListSelector.tsx]---
Location: harness-main/web/src/ar/pages/version-details/components/OCIVersionSelector/TagOrDigestListSelector.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: type.ts]---
Location: harness-main/web/src/ar/pages/version-details/components/OCIVersionSelector/type.ts
Signals: N/A
Excerpt (<=80 chars):  export interface OCIVersionValue {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OCIVersionValue
- ListProps
```

--------------------------------------------------------------------------------

---[FILE: OverviewCards.tsx]---
Location: harness-main/web/src/ar/pages/version-details/components/OverviewCards/OverviewCards.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: QuarantineForm.tsx]---
Location: harness-main/web/src/ar/pages/version-details/components/QuarantineForm/QuarantineForm.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: type.ts]---
Location: harness-main/web/src/ar/pages/version-details/components/QuarantineForm/type.ts
Signals: N/A
Excerpt (<=80 chars):  export interface QuarantineVersionFormData {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QuarantineVersionFormData
```

--------------------------------------------------------------------------------

---[FILE: ReadmeFileContent.tsx]---
Location: harness-main/web/src/ar/pages/version-details/components/ReadmeFileContent/ReadmeFileContent.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: SecurityItem.tsx]---
Location: harness-main/web/src/ar/pages/version-details/components/SecurityTestsCard/SecurityItem.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: SecurityTestsCard.tsx]---
Location: harness-main/web/src/ar/pages/version-details/components/SecurityTestsCard/SecurityTestsCard.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: harness-main/web/src/ar/pages/version-details/components/SecurityTestsCard/types.ts
Signals: N/A
Excerpt (<=80 chars):  export interface SecurityTestItem {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SecurityTestItem
```

--------------------------------------------------------------------------------

---[FILE: SupplyChainCard.tsx]---
Location: harness-main/web/src/ar/pages/version-details/components/SupplyChainCard/SupplyChainCard.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DeleteVersionMenuItem.tsx]---
Location: harness-main/web/src/ar/pages/version-details/components/VersionActions/DeleteVersionMenuItem.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: QuarantineMenuItem.tsx]---
Location: harness-main/web/src/ar/pages/version-details/components/VersionActions/QuarantineMenuItem.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RemoveQurantineMenuItem.tsx]---
Location: harness-main/web/src/ar/pages/version-details/components/VersionActions/RemoveQurantineMenuItem.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: SetupClientMenuItem.tsx]---
Location: harness-main/web/src/ar/pages/version-details/components/VersionActions/SetupClientMenuItem.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: harness-main/web/src/ar/pages/version-details/components/VersionActions/types.ts
Signals: N/A
Excerpt (<=80 chars):  export interface VersionActionProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VersionActionProps
```

--------------------------------------------------------------------------------

---[FILE: VersionActions.tsx]---
Location: harness-main/web/src/ar/pages/version-details/components/VersionActions/VersionActions.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: VersionDetailsHeader.tsx]---
Location: harness-main/web/src/ar/pages/version-details/components/VersionDetailsHeader/VersionDetailsHeader.tsx
Signals: React
Excerpt (<=80 chars):  export function VersionDetailsHeader(props: VersionDetailsHeaderProps): JSX....

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VersionDetailsHeader
```

--------------------------------------------------------------------------------

---[FILE: VersionDetailsHeaderContent.tsx]---
Location: harness-main/web/src/ar/pages/version-details/components/VersionDetailsHeaderContent/VersionDetailsHeaderContent.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: VersionNameContent.tsx]---
Location: harness-main/web/src/ar/pages/version-details/components/VersionDetailsHeaderContent/VersionNameContent.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: VersionDetailsTabs.tsx]---
Location: harness-main/web/src/ar/pages/version-details/components/VersionDetailsTabs/VersionDetailsTabs.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: VersionSelector.tsx]---
Location: harness-main/web/src/ar/pages/version-details/components/VersionSelector/VersionSelector.tsx
Signals: React
Excerpt (<=80 chars):  export interface VersionSelectorProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VersionSelectorProps
```

--------------------------------------------------------------------------------

---[FILE: VersionTreeNode.tsx]---
Location: harness-main/web/src/ar/pages/version-details/components/VersionTreeNode/VersionTreeNode.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: VersionTreeNodeDetails.tsx]---
Location: harness-main/web/src/ar/pages/version-details/components/VersionTreeNode/VersionTreeNodeDetails.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ComposerVersionType.tsx]---
Location: harness-main/web/src/ar/pages/version-details/ComposerVersion/ComposerVersionType.tsx
Signals: React
Excerpt (<=80 chars):  export class ComposerVersionType extends VersionStep<ArtifactVersionSummary> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ComposerVersionType
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: harness-main/web/src/ar/pages/version-details/ComposerVersion/types.ts
Signals: N/A
Excerpt (<=80 chars): export interface ComposerVersionDetailsQueryParams extends VersionDetailsQuer...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LocalComposerArtifactDetailConfig
- ComposerArtifactDetails
- ComposerVersionDetailsQueryParams
```

--------------------------------------------------------------------------------

---[FILE: ComposerVersionArtifactDetailsPage.tsx]---
Location: harness-main/web/src/ar/pages/version-details/ComposerVersion/pages/artifact-details/ComposerVersionArtifactDetailsPage.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ComposerVersionDependencyContent.tsx]---
Location: harness-main/web/src/ar/pages/version-details/ComposerVersion/pages/artifact-details/ComposerVersionDependencyContent.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ComposerVersionGeneralInfo.tsx]---
Location: harness-main/web/src/ar/pages/version-details/ComposerVersion/pages/overview/ComposerVersionGeneralInfo.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ComposerVersionOverviewPage.tsx]---
Location: harness-main/web/src/ar/pages/version-details/ComposerVersion/pages/overview/ComposerVersionOverviewPage.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: CondaVersionType.tsx]---
Location: harness-main/web/src/ar/pages/version-details/CondaVersion/CondaVersionType.tsx
Signals: React
Excerpt (<=80 chars):  export class CondaVersionType extends VersionStep<ArtifactVersionSummary> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CondaVersionType
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: harness-main/web/src/ar/pages/version-details/CondaVersion/types.ts
Signals: N/A
Excerpt (<=80 chars): export interface CondaVersionDetailsQueryParams extends VersionDetailsQueryPa...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LocalCondaArtifactDetailConfig
- CondaArtifactDetails
- CondaVersionDetailsQueryParams
```

--------------------------------------------------------------------------------

---[FILE: CondaVersionArtifactDetailsPage.tsx]---
Location: harness-main/web/src/ar/pages/version-details/CondaVersion/pages/artifact-dertails/CondaVersionArtifactDetailsPage.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: CondaVersionDependencyContent.tsx]---
Location: harness-main/web/src/ar/pages/version-details/CondaVersion/pages/artifact-dertails/CondaVersionDependencyContent.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: CondaVersionGeneralInfo.tsx]---
Location: harness-main/web/src/ar/pages/version-details/CondaVersion/pages/overview/CondaVersionGeneralInfo.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: CondaVersionOverviewPage.tsx]---
Location: harness-main/web/src/ar/pages/version-details/CondaVersion/pages/overview/CondaVersionOverviewPage.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: mock.ts]---
Location: harness-main/web/src/ar/pages/version-details/context/mock.ts
Signals: N/A
Excerpt (<=80 chars):  export const mockArtifactVersionDetails = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mockArtifactVersionDetails
```

--------------------------------------------------------------------------------

---[FILE: VersionDependencyListProvider.tsx]---
Location: harness-main/web/src/ar/pages/version-details/context/VersionDependencyListProvider.tsx
Signals: React
Excerpt (<=80 chars):  export const VersionDependencyListContext = createContext<VersionDependencyL...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VersionDependencyListContext
```

--------------------------------------------------------------------------------

---[FILE: VersionFilesProvider.tsx]---
Location: harness-main/web/src/ar/pages/version-details/context/VersionFilesProvider.tsx
Signals: React
Excerpt (<=80 chars):  export const VersionFilesContext = createContext<VersionFilesProviderProps>(...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VersionFilesContext
```

--------------------------------------------------------------------------------

---[FILE: VersionOverviewProvider.tsx]---
Location: harness-main/web/src/ar/pages/version-details/context/VersionOverviewProvider.tsx
Signals: React
Excerpt (<=80 chars):  export const VersionOverviewContext = createContext<VersionOverviewProviderP...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VersionOverviewContext
- useVersionOverview
```

--------------------------------------------------------------------------------

---[FILE: VersionProvider.tsx]---
Location: harness-main/web/src/ar/pages/version-details/context/VersionProvider.tsx
Signals: React
Excerpt (<=80 chars):  export const VersionProviderContext = createContext<VersionProviderProps>({}...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VersionProviderContext
```

--------------------------------------------------------------------------------

---[FILE: DartVersionType.tsx]---
Location: harness-main/web/src/ar/pages/version-details/DartVersion/DartVersionType.tsx
Signals: React
Excerpt (<=80 chars):  export class DartVersionType extends VersionStep<ArtifactVersionSummary> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DartVersionType
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: harness-main/web/src/ar/pages/version-details/DartVersion/types.ts
Signals: N/A
Excerpt (<=80 chars): export interface DartVersionDetailsQueryParams extends VersionDetailsQueryPar...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LocalDartArtifactDetailConfig
- DartArtifactDetails
- DartVersionDetailsQueryParams
```

--------------------------------------------------------------------------------

---[FILE: DartVersionArtifactDetailsPage.tsx]---
Location: harness-main/web/src/ar/pages/version-details/DartVersion/pages/artifact-details/DartVersionArtifactDetailsPage.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DartVersionDependencyContent.tsx]---
Location: harness-main/web/src/ar/pages/version-details/DartVersion/pages/artifact-details/DartVersionDependencyContent.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DartVersionGeneralInfo.tsx]---
Location: harness-main/web/src/ar/pages/version-details/DartVersion/pages/overview/DartVersionGeneralInfo.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DartVersionOverviewPage.tsx]---
Location: harness-main/web/src/ar/pages/version-details/DartVersion/pages/overview/DartVersionOverviewPage.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DockerArtifactDetailsContent.tsx]---
Location: harness-main/web/src/ar/pages/version-details/DockerVersion/DockerArtifactDetailsContent.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DockerArtifactSecurityTestsContent.tsx]---
Location: harness-main/web/src/ar/pages/version-details/DockerVersion/DockerArtifactSecurityTestsContent.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DockerArtifactSSCAContent.tsx]---
Location: harness-main/web/src/ar/pages/version-details/DockerVersion/DockerArtifactSSCAContent.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DockerManifestDetailsContent.tsx]---
Location: harness-main/web/src/ar/pages/version-details/DockerVersion/DockerManifestDetailsContent.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DockerVersionHeader.tsx]---
Location: harness-main/web/src/ar/pages/version-details/DockerVersion/DockerVersionHeader.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DockerVersionLayersContent.tsx]---
Location: harness-main/web/src/ar/pages/version-details/DockerVersion/DockerVersionLayersContent.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DockerVersionOverviewContent.tsx]---
Location: harness-main/web/src/ar/pages/version-details/DockerVersion/DockerVersionOverviewContent.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DockerVersionType.tsx]---
Location: harness-main/web/src/ar/pages/version-details/DockerVersion/DockerVersionType.tsx
Signals: React
Excerpt (<=80 chars):  export class DockerVersionType extends VersionStep<ArtifactVersionSummary> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DockerVersionType
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: harness-main/web/src/ar/pages/version-details/DockerVersion/types.ts
Signals: N/A
Excerpt (<=80 chars):  export interface DockerVersionDetailsQueryParams extends VersionDetailsQuery...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DockerVersionDetailsQueryParams
```

--------------------------------------------------------------------------------

---[FILE: ArchitectureSelector.tsx]---
Location: harness-main/web/src/ar/pages/version-details/DockerVersion/components/ArchitectureSelector/ArchitectureSelector.tsx
Signals: React
Excerpt (<=80 chars):  export interface ArchitectureSelectorProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ArchitectureSelectorProps
```

--------------------------------------------------------------------------------

---[FILE: DockerVersionName.tsx]---
Location: harness-main/web/src/ar/pages/version-details/DockerVersion/components/DockerVersionName/DockerVersionName.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DockerVersionTreeNodeDetailsContent.tsx]---
Location: harness-main/web/src/ar/pages/version-details/DockerVersion/components/DockerVersionTreeNodeDetailsContent/DockerVersionTreeNodeDetailsContent.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: LayersTable.tsx]---
Location: harness-main/web/src/ar/pages/version-details/DockerVersion/components/LayersTable/LayersTable.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: LayersTableCells.tsx]---
Location: harness-main/web/src/ar/pages/version-details/DockerVersion/components/LayersTable/LayersTableCells.tsx
Signals: React
Excerpt (<=80 chars):  export const LayerIndexCell: CellType = ({ value }) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DockerDeploymentsCards.tsx]---
Location: harness-main/web/src/ar/pages/version-details/DockerVersion/DockerDeploymentsContent/DockerDeploymentsCards.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DockerDeploymentsContent.tsx]---
Location: harness-main/web/src/ar/pages/version-details/DockerVersion/DockerDeploymentsContent/DockerDeploymentsContent.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DockerVersionOSSContent.tsx]---
Location: harness-main/web/src/ar/pages/version-details/DockerVersion/DockerVersionOSSContent/DockerVersionOSSContent.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DockerVersionOSSGeneralInfo.tsx]---
Location: harness-main/web/src/ar/pages/version-details/DockerVersion/DockerVersionOSSContent/DockerVersionOSSGeneralInfo.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DockerArtifactListPage.test.tsx]---
Location: harness-main/web/src/ar/pages/version-details/DockerVersion/__tests__/DockerArtifactListPage.test.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DockerVersionArtifactDetailsPage.test.tsx]---
Location: harness-main/web/src/ar/pages/version-details/DockerVersion/__tests__/DockerVersionArtifactDetailsPage.test.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DockerVersionDeploymentsTab.test.tsx]---
Location: harness-main/web/src/ar/pages/version-details/DockerVersion/__tests__/DockerVersionDeploymentsTab.test.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DockerVersionDetailsOSS.test.tsx]---
Location: harness-main/web/src/ar/pages/version-details/DockerVersion/__tests__/DockerVersionDetailsOSS.test.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DockerVersionHeader.test.tsx]---
Location: harness-main/web/src/ar/pages/version-details/DockerVersion/__tests__/DockerVersionHeader.test.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DockerVersionListPage.test.tsx]---
Location: harness-main/web/src/ar/pages/version-details/DockerVersion/__tests__/DockerVersionListPage.test.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DockerVersionOverviewPage.test.tsx]---
Location: harness-main/web/src/ar/pages/version-details/DockerVersion/__tests__/DockerVersionOverviewPage.test.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: __mockData__.ts]---
Location: harness-main/web/src/ar/pages/version-details/DockerVersion/__tests__/__mockData__.ts
Signals: N/A
Excerpt (<=80 chars):  export const mockDockerLatestVersionListTableData: ListArtifactVersion = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mockDockerSbomData
```

--------------------------------------------------------------------------------

---[FILE: GenericVersionType.tsx]---
Location: harness-main/web/src/ar/pages/version-details/GenericVersion/GenericVersionType.tsx
Signals: React
Excerpt (<=80 chars):  export class GenericVersionType extends VersionStep<ArtifactVersionSummary> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GenericVersionType
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: harness-main/web/src/ar/pages/version-details/GenericVersion/types.ts
Signals: N/A
Excerpt (<=80 chars):  export type GenericArtifactDetails = ArtifactDetail & GenericArtifactDetailC...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GenericArtifactDetails
```

--------------------------------------------------------------------------------

---[FILE: GenericArtifactDetailsPage.tsx]---
Location: harness-main/web/src/ar/pages/version-details/GenericVersion/pages/artifact-details/GenericArtifactDetailsPage.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: OSSArtifactDetailsContent.tsx]---
Location: harness-main/web/src/ar/pages/version-details/GenericVersion/pages/oss-details/OSSArtifactDetailsContent.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: OSSContentPage.tsx]---
Location: harness-main/web/src/ar/pages/version-details/GenericVersion/pages/oss-details/OSSContentPage.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: OSSGeneralInfoContent.tsx]---
Location: harness-main/web/src/ar/pages/version-details/GenericVersion/pages/oss-details/OSSGeneralInfoContent.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: GeneralInformationCard.tsx]---
Location: harness-main/web/src/ar/pages/version-details/GenericVersion/pages/overview/GeneralInformationCard.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: OverviewPage.tsx]---
Location: harness-main/web/src/ar/pages/version-details/GenericVersion/pages/overview/OverviewPage.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: GenericArtifactListPage.test.tsx]---
Location: harness-main/web/src/ar/pages/version-details/GenericVersion/__tests__/GenericArtifactListPage.test.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: GenericVersionArtifactDetailsPage.test.tsx]---
Location: harness-main/web/src/ar/pages/version-details/GenericVersion/__tests__/GenericVersionArtifactDetailsPage.test.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

````
