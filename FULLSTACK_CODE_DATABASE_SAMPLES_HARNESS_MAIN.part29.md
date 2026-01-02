---
source_txt: fullstack_samples/harness-main
converted_utc: 2025-12-18T10:36:50Z
part: 29
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES harness-main

## Extracted Reusable Patterns (Non-verbatim) (Part 29 of 37)

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

---[FILE: RepositoryProvider.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/context/RepositoryProvider.tsx
Signals: React
Excerpt (<=80 chars):  export interface RepositoryProviderProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RepositoryProviderContext
- RepositoryProviderProps
```

--------------------------------------------------------------------------------

---[FILE: DartRepositoryType.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/DartRepository/DartRepositoryType.tsx
Signals: React
Excerpt (<=80 chars):  export class DartRepositoryType extends RepositoryStep<VirtualRegistryReques...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DartRepositoryType
```

--------------------------------------------------------------------------------

---[FILE: DockerRepositoryType.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/DockerRepository/DockerRepositoryType.tsx
Signals: React
Excerpt (<=80 chars):  export class DockerRepositoryType extends RepositoryStep<VirtualRegistryRequ...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DockerRepositoryType
```

--------------------------------------------------------------------------------

---[FILE: DockerRedirectPage.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/DockerRepository/DockerRedirectPage/DockerRedirectPage.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: harness-main/web/src/ar/pages/repository-details/DockerRepository/DockerRedirectPage/types.ts
Signals: N/A
Excerpt (<=80 chars):  export interface DockerRedirectPageQueryParams extends RedirectPageQueryPara...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DockerRedirectPageQueryParams
```

--------------------------------------------------------------------------------

---[FILE: CreateDockerRegistry.test.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/DockerRepository/__tests__/CreateDockerRegistry.test.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: CreateDockerUpstreamRegistry.test.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/DockerRepository/__tests__/CreateDockerUpstreamRegistry.test.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: EditDockerRegistry.test.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/DockerRepository/__tests__/EditDockerRegistry.test.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: EditDockerUpstreamRegistry.test.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/DockerRepository/__tests__/EditDockerUpstreamRegistry.test.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: __mockData__.ts]---
Location: harness-main/web/src/ar/pages/repository-details/DockerRepository/__tests__/__mockData__.ts
Signals: N/A
Excerpt (<=80 chars):  export const MockGetDockerRegistryResponseWithAllData = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MockGetDockerRegistryResponseWithAllData
- MockGetSetupClientOnRegistryConfigPageResponse
- MockGetDockerUpstreamRegistryResponseWithDockerhubSourceAllData
```

--------------------------------------------------------------------------------

---[FILE: GenericRepositoryType.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/GenericRepository/GenericRepositoryType.tsx
Signals: React
Excerpt (<=80 chars):  export class GenericRepositoryType extends RepositoryStep<VirtualRegistryReq...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GenericRepositoryType
```

--------------------------------------------------------------------------------

---[FILE: CreateGenericRegistry.test.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/GenericRepository/__tests__/CreateGenericRegistry.test.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: EditGenericRegistry.test.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/GenericRepository/__tests__/EditGenericRegistry.test.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: __mockData__.ts]---
Location: harness-main/web/src/ar/pages/repository-details/GenericRepository/__tests__/__mockData__.ts
Signals: N/A
Excerpt (<=80 chars):  export const MockGetGenericRegistryResponseWithAllData = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MockGetGenericRegistryResponseWithAllData
- MockGetGenericSetupClientOnRegistryConfigPageResponse
```

--------------------------------------------------------------------------------

---[FILE: GoRepositoryType.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/GoRepository/GoRepositoryType.tsx
Signals: React
Excerpt (<=80 chars):  export class GoRepositoryType extends RepositoryStep<VirtualRegistryRequest> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GoRepositoryType
```

--------------------------------------------------------------------------------

---[FILE: HelmRepositoryType.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/HelmRepository/HelmRepositoryType.tsx
Signals: React
Excerpt (<=80 chars):  export class HelmRepositoryType extends RepositoryStep<VirtualRegistryReques...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HelmRepositoryType
```

--------------------------------------------------------------------------------

---[FILE: CreateHelmRegistry.test.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/HelmRepository/__tests__/CreateHelmRegistry.test.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: CreateHelmUpstreamRegistry.test.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/HelmRepository/__tests__/CreateHelmUpstreamRegistry.test.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: EditHelmRegistry.test.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/HelmRepository/__tests__/EditHelmRegistry.test.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: EditHelmUpstreamRegistry.test.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/HelmRepository/__tests__/EditHelmUpstreamRegistry.test.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: __mockData__.ts]---
Location: harness-main/web/src/ar/pages/repository-details/HelmRepository/__tests__/__mockData__.ts
Signals: N/A
Excerpt (<=80 chars):  export const MockGetHelmRegistryResponseWithAllData = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MockGetHelmRegistryResponseWithAllData
- MockGetHelmSetupClientOnRegistryConfigPageResponse
- MockGetHelmUpstreamRegistryResponseWithCustomSourceAllData
```

--------------------------------------------------------------------------------

---[FILE: useCreateRepositoryModal.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/hooks/useCreateRepositoryModal/useCreateRepositoryModal.tsx
Signals: React
Excerpt (<=80 chars):  export interface useCreateRepositoryModalProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useCreateRepositoryModal
- useCreateRepositoryModalProps
```

--------------------------------------------------------------------------------

---[FILE: useSetupClientModal.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/hooks/useSetupClientModal/useSetupClientModal.tsx
Signals: React
Excerpt (<=80 chars):  export interface useSetupClientModalProps extends Omit<RepositoySetupClientP...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useSetupClientModal
- useSetupClientModalProps
```

--------------------------------------------------------------------------------

---[FILE: CreateRepositoryModal.test.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/hooks/__tests__/CreateRepositoryModal.test.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: HuggingfaceRepositoryType.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/HuggingfaceRepositoryType/HuggingfaceRepositoryType.tsx
Signals: React
Excerpt (<=80 chars):  export class HuggingfaceRepositoryType extends RepositoryStep<VirtualRegistr...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HuggingfaceRepositoryType
```

--------------------------------------------------------------------------------

---[FILE: MavenRepository.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/MavenRepository/MavenRepository.tsx
Signals: React
Excerpt (<=80 chars):  export class MavenRepositoryType extends RepositoryStep<VirtualRegistryReque...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MavenRepositoryType
```

--------------------------------------------------------------------------------

---[FILE: CreateMavenRegistry.test.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/MavenRepository/__tests__/CreateMavenRegistry.test.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: CreateMavenUpstreamRegistry.test.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/MavenRepository/__tests__/CreateMavenUpstreamRegistry.test.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: EditMavenRegistry.test.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/MavenRepository/__tests__/EditMavenRegistry.test.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: EditMavenUpstreamRegistry.test.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/MavenRepository/__tests__/EditMavenUpstreamRegistry.test.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: __mockData__.ts]---
Location: harness-main/web/src/ar/pages/repository-details/MavenRepository/__tests__/__mockData__.ts
Signals: N/A
Excerpt (<=80 chars):  export const MockGetMavenRegistryResponseWithAllData = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MockGetMavenRegistryResponseWithAllData
- MockGetMavenSetupClientOnRegistryConfigPageResponse
- MockGetMavenUpstreamRegistryResponseWithMavenCentralSourceAllData
```

--------------------------------------------------------------------------------

---[FILE: NpmRepositoryType.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/NpmRepository/NpmRepositoryType.tsx
Signals: React
Excerpt (<=80 chars):  export class NpmRepositoryType extends RepositoryStep<VirtualRegistryRequest> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NpmRepositoryType
```

--------------------------------------------------------------------------------

---[FILE: CreateNpmRegistry.test.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/NpmRepository/__tests__/CreateNpmRegistry.test.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: CreateNpmUpstreamRegistry.test.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/NpmRepository/__tests__/CreateNpmUpstreamRegistry.test.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: EditNpmRegistry.test.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/NpmRepository/__tests__/EditNpmRegistry.test.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: EditNpmUpstreamRegistry.test.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/NpmRepository/__tests__/EditNpmUpstreamRegistry.test.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: __mockData__.ts]---
Location: harness-main/web/src/ar/pages/repository-details/NpmRepository/__tests__/__mockData__.ts
Signals: N/A
Excerpt (<=80 chars):  export const MockGetNpmRegistryResponseWithAllData = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MockGetNpmRegistryResponseWithAllData
- MockGetNpmSetupClientOnRegistryConfigPageResponse
- MockGetNpmUpstreamRegistryResponseWithNpmJsSourceAllData
```

--------------------------------------------------------------------------------

---[FILE: NuGetRepositoryType.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/NuGetRepository/NuGetRepositoryType.tsx
Signals: React
Excerpt (<=80 chars):  export class NuGetRepositoryType extends RepositoryStep<VirtualRegistryReque...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NuGetRepositoryType
```

--------------------------------------------------------------------------------

---[FILE: PythonRepositoryType.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/PythonRepository/PythonRepositoryType.tsx
Signals: React
Excerpt (<=80 chars):  export class PythonRepositoryType extends RepositoryStep<VirtualRegistryRequ...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PythonRepositoryType
```

--------------------------------------------------------------------------------

---[FILE: RPMRepositoryType.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/RPMRepository/RPMRepositoryType.tsx
Signals: React
Excerpt (<=80 chars):  export class RPMRepositoryType extends RepositoryStep<VirtualRegistryRequest> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RPMRepositoryType
```

--------------------------------------------------------------------------------

---[FILE: RepositoryDetailsPage.test.tsx]---
Location: harness-main/web/src/ar/pages/repository-details/__tests__/RepositoryDetailsPage.test.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: harness-main/web/src/ar/pages/repository-list/constants.ts
Signals: N/A
Excerpt (<=80 chars):  export interface TreeViewSortingOption {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TreeViewSortingOptions
- TreeViewSortingOption
```

--------------------------------------------------------------------------------

---[FILE: RepositoryListPage.tsx]---
Location: harness-main/web/src/ar/pages/repository-list/RepositoryListPage.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RepositoryListTreeViewPage.tsx]---
Location: harness-main/web/src/ar/pages/repository-list/RepositoryListTreeViewPage.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: harness-main/web/src/ar/pages/repository-list/utils.ts
Signals: React
Excerpt (<=80 chars):  export type ArtifactRepositoryListPageQueryParams = Omit<

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useArtifactRepositoriesQueryParamOptions
- useTreeViewRepositoriesQueryParamOptions
- ArtifactRepositoryListPageQueryParams
- TreeViewRepositoryQueryParams
```

--------------------------------------------------------------------------------

---[FILE: ButtonOption.tsx]---
Location: harness-main/web/src/ar/pages/repository-list/components/CreateRepository/ButtonOption.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: CreateRepository.tsx]---
Location: harness-main/web/src/ar/pages/repository-list/components/CreateRepository/CreateRepository.tsx
Signals: React
Excerpt (<=80 chars):  export function CreateRepository(): JSX.Element {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateRepository
```

--------------------------------------------------------------------------------

---[FILE: CreateRepositoryButton.tsx]---
Location: harness-main/web/src/ar/pages/repository-list/components/CreateRepository/CreateRepositoryButton.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: CreateRepository.test.tsx]---
Location: harness-main/web/src/ar/pages/repository-list/components/CreateRepository/__tests__/CreateRepository.test.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: CreateRepositoryButton.test.tsx]---
Location: harness-main/web/src/ar/pages/repository-list/components/CreateRepository/__tests__/CreateRepositoryButton.test.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: harness-main/web/src/ar/pages/repository-list/components/RepositoryListTable/index.tsx
Signals: React
Excerpt (<=80 chars):  export interface RepositoryListColumnActions {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RepositoryListTable
- RepositoryListColumnActions
- RepositoryListTableProps
```

--------------------------------------------------------------------------------

---[FILE: RepositoryListCells.tsx]---
Location: harness-main/web/src/ar/pages/repository-list/components/RepositoryListTable/RepositoryListCells.tsx
Signals: React
Excerpt (<=80 chars):  export const RepositoryNameCell: CellType = ({ value, row }) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: harness-main/web/src/ar/pages/repository-list/components/RepositoryListTable/types.ts
Signals: N/A
Excerpt (<=80 chars):  export interface RepositoryListSortBy {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RepositoryListSortBy
```

--------------------------------------------------------------------------------

---[FILE: RepositoryListTable.test.tsx]---
Location: harness-main/web/src/ar/pages/repository-list/components/RepositoryListTable/__tests__/RepositoryListTable.test.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RepositoryListTreeView.tsx]---
Location: harness-main/web/src/ar/pages/repository-list/components/RepositoryListTreeView/RepositoryListTreeView.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: harness-main/web/src/ar/pages/repository-list/components/RepositoryListTreeView/types.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IGlobalFilters {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IGlobalFilters
- APIQueryParams
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: harness-main/web/src/ar/pages/repository-list/components/RepositoryListTreeView/utils.ts
Signals: N/A
Excerpt (<=80 chars):  export function useRepositoryTreeViewUtils(queryParams: TreeViewRepositoryQu...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useRepositoryTreeViewUtils
```

--------------------------------------------------------------------------------

---[FILE: RepositoryScopeSelector.tsx]---
Location: harness-main/web/src/ar/pages/repository-list/components/RepositoryScopeSelector/RepositoryScopeSelector.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RepositoryTypeSelector.tsx]---
Location: harness-main/web/src/ar/pages/repository-list/components/RepositoryTypeSelector/RepositoryTypeSelector.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RepositoryListPage.test.tsx]---
Location: harness-main/web/src/ar/pages/repository-list/__tests__/RepositoryListPage.test.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: harness-main/web/src/ar/pages/upstream-proxy-details/types.ts
Signals: N/A
Excerpt (<=80 chars):  export type UpstreamRegistryRequest = Omit<RegistryRequest, 'config'> & {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpstreamRegistryRequest
- UpstreamRegistry
```

--------------------------------------------------------------------------------

---[FILE: AuthenticationFormInput.tsx]---
Location: harness-main/web/src/ar/pages/upstream-proxy-details/components/AuthenticationFormInput/AuthenticationFormInput.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: UpstreamProxyAuthenticationFormContent.tsx]---
Location: harness-main/web/src/ar/pages/upstream-proxy-details/components/FormContent/UpstreamProxyAuthenticationFormContent.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: UpstreamProxyCleanupPoliciesFormContent.tsx]---
Location: harness-main/web/src/ar/pages/upstream-proxy-details/components/FormContent/UpstreamProxyCleanupPoliciesFormContent.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: UpstreamProxyConfigurationFormContent.tsx]---
Location: harness-main/web/src/ar/pages/upstream-proxy-details/components/FormContent/UpstreamProxyConfigurationFormContent.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: UpstreamProxyCreateFormContent.tsx]---
Location: harness-main/web/src/ar/pages/upstream-proxy-details/components/FormContent/UpstreamProxyCreateFormContent.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: UpstreamProxyDetailsFormContent.tsx]---
Location: harness-main/web/src/ar/pages/upstream-proxy-details/components/FormContent/UpstreamProxyDetailsFormContent.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: UpstreamProxyIncludeExcludePatternFormContent.tsx]---
Location: harness-main/web/src/ar/pages/upstream-proxy-details/components/FormContent/UpstreamProxyIncludeExcludePatternFormContent.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: UpstreamProxyConfigurationForm.tsx]---
Location: harness-main/web/src/ar/pages/upstream-proxy-details/components/Forms/UpstreamProxyConfigurationForm.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: UpstreamProxyCreateForm.tsx]---
Location: harness-main/web/src/ar/pages/upstream-proxy-details/components/Forms/UpstreamProxyCreateForm.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: harness-main/web/src/ar/pages/upstream-proxy-details/components/Forms/utils.ts
Signals: N/A
Excerpt (<=80 chars):  export function getSecretSpacePath(referenceString: string, scope?: Scope) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getSecretSpacePath
- getReferenceStringFromSecretSpacePath
- getFormattedFormDataForAuthType
- getSecretScopeDetailsByIdentifier
- getFormattedInitialValuesForAuthType
- getValidationSchemaForUpstreamForm
```

--------------------------------------------------------------------------------

---[FILE: RepositoryUrlInput.tsx]---
Location: harness-main/web/src/ar/pages/upstream-proxy-details/components/RepositoryUrlInput/RepositoryUrlInput.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DeleteUpstreamProxy.tsx]---
Location: harness-main/web/src/ar/pages/upstream-proxy-details/components/UpstreamProxyActions/DeleteUpstreamProxy.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: type.ts]---
Location: harness-main/web/src/ar/pages/upstream-proxy-details/components/UpstreamProxyActions/type.ts
Signals: N/A
Excerpt (<=80 chars):  export interface UpstreamProxyActionProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpstreamProxyActionProps
```

--------------------------------------------------------------------------------

---[FILE: UpstreamProxyActions.tsx]---
Location: harness-main/web/src/ar/pages/upstream-proxy-details/components/UpstreamProxyActions/UpstreamProxyActions.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: UpstreamProxyDetailsHeader.tsx]---
Location: harness-main/web/src/ar/pages/upstream-proxy-details/components/UpstreamProxyDetailsHeader/UpstreamProxyDetailsHeader.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: UpstreamProxyDetailsHeaderContent.tsx]---
Location: harness-main/web/src/ar/pages/upstream-proxy-details/components/UpstreamProxyDetailsHeader/UpstreamProxyDetailsHeaderContent.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: useCreateUpstreamProxyModal.tsx]---
Location: harness-main/web/src/ar/pages/upstream-proxy-details/hooks/useCreateUpstreamProxyModal/useCreateUpstreamProxyModal.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: OSSVersionDetails.tsx]---
Location: harness-main/web/src/ar/pages/version-details/OSSVersionDetails.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: OSSVersionDetailsPage.tsx]---
Location: harness-main/web/src/ar/pages/version-details/OSSVersionDetailsPage.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: types.tsx]---
Location: harness-main/web/src/ar/pages/version-details/types.tsx
Signals: N/A
Excerpt (<=80 chars):  export type VersionDetailsQueryParams = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VersionDetailsQueryParams
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: harness-main/web/src/ar/pages/version-details/utils.ts
Signals: N/A
Excerpt (<=80 chars):  export const DEFAULT_LAYER_SIZE = '0 B'

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- prettifyManifestJSON
- DEFAULT_LAYER_SIZE
```

--------------------------------------------------------------------------------

---[FILE: VersionDetails.tsx]---
Location: harness-main/web/src/ar/pages/version-details/VersionDetails.tsx
Signals: React
Excerpt (<=80 chars):  export function VersionDetails(): JSX.Element {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VersionDetails
```

--------------------------------------------------------------------------------

---[FILE: VersionDetailsPage.tsx]---
Location: harness-main/web/src/ar/pages/version-details/VersionDetailsPage.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: CargoVersionType.tsx]---
Location: harness-main/web/src/ar/pages/version-details/CargoVersion/CargoVersionType.tsx
Signals: React
Excerpt (<=80 chars):  export class CargoVersionType extends VersionStep<ArtifactVersionSummary> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CargoVersionType
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: harness-main/web/src/ar/pages/version-details/CargoVersion/types.ts
Signals: N/A
Excerpt (<=80 chars): export interface CargoVersionDetailsQueryParams extends VersionDetailsQueryPa...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CargoArtifactDependency
- LocalCargoArtifactDetailConfig
- CargoArtifactDetails
- CargoVersionDetailsQueryParams
```

--------------------------------------------------------------------------------

---[FILE: CargoVersionArtifactDetailsPage.tsx]---
Location: harness-main/web/src/ar/pages/version-details/CargoVersion/pages/artifact-dertails/CargoVersionArtifactDetailsPage.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: CargoVersionDependencyContent.tsx]---
Location: harness-main/web/src/ar/pages/version-details/CargoVersion/pages/artifact-dertails/CargoVersionDependencyContent.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: CargoVersionGeneralInfo.tsx]---
Location: harness-main/web/src/ar/pages/version-details/CargoVersion/pages/overview/CargoVersionGeneralInfo.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: CargoVersionOverviewPage.tsx]---
Location: harness-main/web/src/ar/pages/version-details/CargoVersion/pages/overview/CargoVersionOverviewPage.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ArtifactDependencyListTable.tsx]---
Location: harness-main/web/src/ar/pages/version-details/components/ArtifactDependencyListTable/ArtifactDependencyListTable.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ArtifactDependencyListTableCells.tsx]---
Location: harness-main/web/src/ar/pages/version-details/components/ArtifactDependencyListTable/ArtifactDependencyListTableCells.tsx
Signals: React
Excerpt (<=80 chars):  export const DependencyNameCell: CellType = ({ value }) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: harness-main/web/src/ar/pages/version-details/components/ArtifactDependencyListTable/types.ts
Signals: N/A
Excerpt (<=80 chars):  export type IDependencyItem = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IDependencyItem
- IDependencyList
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: harness-main/web/src/ar/pages/version-details/components/ArtifactDependencyListTable/utils.ts
Signals: React
Excerpt (<=80 chars):  export type ArtifactDependencyListPageQueryParams = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useArtifactDependencyListQueryParamOptions
- ArtifactDependencyListPageQueryParams
```

--------------------------------------------------------------------------------

---[FILE: ArtifactFileListTable.tsx]---
Location: harness-main/web/src/ar/pages/version-details/components/ArtifactFileListTable/ArtifactFileListTable.tsx
Signals: React
Excerpt (<=80 chars):  export interface FileListSortBy {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FileListSortBy
```

--------------------------------------------------------------------------------

````
