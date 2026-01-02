---
source_txt: fullstack_samples/harness-main
converted_utc: 2025-12-18T10:36:50Z
part: 26
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES harness-main

## Extracted Reusable Patterns (Non-verbatim) (Part 26 of 37)

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

---[FILE: membership_role.go]---
Location: harness-main/types/enum/membership_role.go
Signals: N/A
Excerpt (<=80 chars): type MembershipRole string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Enum
- Sanitize
- GetAllMembershipRoles
- init
- Permissions
```

--------------------------------------------------------------------------------

---[FILE: order.go]---
Location: harness-main/types/enum/order.go
Signals: N/A
Excerpt (<=80 chars): type Order int

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- String
- ParseOrder
```

--------------------------------------------------------------------------------

---[FILE: order_test.go]---
Location: harness-main/types/enum/order_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestParseOrder(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestParseOrder
- TestOrderString
- TestOrderConstants
- TestOrderStringRoundTrip
- TestOrderComparison
- TestOrderType
- BenchmarkParseOrder
- BenchmarkParseOrderDesc
- BenchmarkParseOrderInvalid
- BenchmarkOrderString
- BenchmarkOrderStringDesc
- BenchmarkOrderStringDefault
```

--------------------------------------------------------------------------------

---[FILE: principal.go]---
Location: harness-main/types/enum/principal.go
Signals: N/A
Excerpt (<=80 chars): type PrincipalType string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Enum
- Sanitize
- GetAllPrincipalTypes
```

--------------------------------------------------------------------------------

---[FILE: provisioning_type.go]---
Location: harness-main/types/enum/provisioning_type.go
Signals: N/A
Excerpt (<=80 chars):  type InfraProvisioningType string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Enum
```

--------------------------------------------------------------------------------

---[FILE: public_key.go]---
Location: harness-main/types/enum/public_key.go
Signals: N/A
Excerpt (<=80 chars):  type PublicKeyScheme string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Enum
- Sanitize
- GetAllPublicKeySchemes
- GetAllPublicKeyUsages
- GetAllPublicKeySorts
- GetAllRevocationReasons
```

--------------------------------------------------------------------------------

---[FILE: public_resource.go]---
Location: harness-main/types/enum/public_resource.go
Signals: N/A
Excerpt (<=80 chars): type PublicResourceType string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Enum
- GetAllPublicResourceTypes
```

--------------------------------------------------------------------------------

---[FILE: pullreq.go]---
Location: harness-main/types/enum/pullreq.go
Signals: N/A
Excerpt (<=80 chars): type PullReqState string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Enum
- Sanitize
- GetAllPullReqStates
- GetAllPullReqSorts
- GetAllPullReqActivityTypes
- GetAllPullReqActivityKinds
- GetAllPullReqCommentStatuses
- GetAllPullReqReviewDecisions
```

--------------------------------------------------------------------------------

---[FILE: repo.go]---
Location: harness-main/types/enum/repo.go
Signals: N/A
Excerpt (<=80 chars): type RepoAttr int

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ParseRepoAttr
- String
```

--------------------------------------------------------------------------------

---[FILE: resolver_kind.go]---
Location: harness-main/types/enum/resolver_kind.go
Signals: N/A
Excerpt (<=80 chars): type ResolverKind string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ParseResolverKind
- String
```

--------------------------------------------------------------------------------

---[FILE: resolver_type.go]---
Location: harness-main/types/enum/resolver_type.go
Signals: N/A
Excerpt (<=80 chars): type ResolverType string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ParseResolverType
- String
```

--------------------------------------------------------------------------------

---[FILE: resource.go]---
Location: harness-main/types/enum/resource.go
Signals: N/A
Excerpt (<=80 chars): type ResourceType string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Enum
- Sanitize
- GetAllResourceTypes
- GetAllParentResourceTypes
```

--------------------------------------------------------------------------------

---[FILE: rule.go]---
Location: harness-main/types/enum/rule.go
Signals: N/A
Excerpt (<=80 chars): type RuleType string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Enum
- Sanitize
- GetAllRuleTypes
- GetAllRuleStates
- GetAllRuleSorts
- ParseRuleSortAttr
```

--------------------------------------------------------------------------------

---[FILE: scm.go]---
Location: harness-main/types/enum/scm.go
Signals: N/A
Excerpt (<=80 chars): type ScmType string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Enum
- AllSCMTypeStrings
```

--------------------------------------------------------------------------------

---[FILE: settings.go]---
Location: harness-main/types/enum/settings.go
Signals: N/A
Excerpt (<=80 chars): type SettingsScope string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Enum
- GetAllSettingsScopes
```

--------------------------------------------------------------------------------

---[FILE: space.go]---
Location: harness-main/types/enum/space.go
Signals: N/A
Excerpt (<=80 chars): type SpaceAttr int

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ParseSpaceAttr
- String
```

--------------------------------------------------------------------------------

---[FILE: trigger_actions.go]---
Location: harness-main/types/enum/trigger_actions.go
Signals: N/A
Excerpt (<=80 chars): type TriggerAction string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Enum
- Sanitize
- GetTriggerEvent
- GetAllTriggerActions
```

--------------------------------------------------------------------------------

---[FILE: trigger_events.go]---
Location: harness-main/types/enum/trigger_events.go
Signals: N/A
Excerpt (<=80 chars): type TriggerEvent string

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Enum
- Sanitize
- GetAllTriggerEvents
```

--------------------------------------------------------------------------------

---[FILE: user.go]---
Location: harness-main/types/enum/user.go
Signals: N/A
Excerpt (<=80 chars): type UserAttr int

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ParseUserAttr
```

--------------------------------------------------------------------------------

---[FILE: user_test.go]---
Location: harness-main/types/enum/user_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestParseUserAttr(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestParseUserAttr
```

--------------------------------------------------------------------------------

---[FILE: webhook.go]---
Location: harness-main/types/enum/webhook.go
Signals: N/A
Excerpt (<=80 chars): type WebhookAttr int

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ParseWebhookAttr
- String
- Enum
- Sanitize
- GetAllWebhookTriggers
```

--------------------------------------------------------------------------------

---[FILE: version.go]---
Location: harness-main/version/version.go
Signals: N/A
Excerpt (<=80 chars):  func parseVersionNumber(versionNum string) int64 {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- parseVersionNumber
```

--------------------------------------------------------------------------------

---[FILE: version_test.go]---
Location: harness-main/version/version_test.go
Signals: N/A
Excerpt (<=80 chars):  func TestParseVersionNumber(t *testing.T) {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestParseVersionNumber
- TestParseVersionNumberPanic
- TestVersionStructure
- TestVersionString
- TestGitVariables
- TestVersionComparison
- TestVersionWithPrerelease
- TestVersionWithMetadata
- TestVersionWithBothPrereleaseAndMetadata
- BenchmarkParseVersionNumber
- BenchmarkVersionString
```

--------------------------------------------------------------------------------

---[FILE: dist.go]---
Location: harness-main/web/dist.go
Signals: N/A
Excerpt (<=80 chars): func Handler(uiSourceOverride string) http.HandlerFunc {

```go
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- renderPublicAccessKey
- Handler
- readRemoteEntryJSContent
- createFileMapForDistFolder
- RenderPublicAccessFrom
- WithRenderPublicAccess
```

--------------------------------------------------------------------------------

---[FILE: typed-scss-modules.config.js]---
Location: harness-main/web/typed-scss-modules.config.js
Signals: N/A
Excerpt (<=80 chars): export const config = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- config
```

--------------------------------------------------------------------------------

---[FILE: server.js]---
Location: harness-main/web/cypress/server.js
Signals: Express
Excerpt (<=80 chars): /*

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: harness-main/web/cypress/integration/signup/constants.ts
Signals: N/A
Excerpt (<=80 chars): export const CreateUserResponse = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateUserResponse
- GetUserResponse
- signupPostCall
- userGetCall
- membershipGetCall
- membershipQueryGetCall
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: harness-main/web/cypress/server/index.ts
Signals: Express
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: commands.ts]---
Location: harness-main/web/cypress/support/commands.ts
Signals: N/A
Excerpt (<=80 chars):  export const activeTabClassName = '.TabNavigation--active'

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- activeTabClassName
```

--------------------------------------------------------------------------------

---[FILE: generateRequestObject.ts]---
Location: harness-main/web/cypress/utils/generateRequestObject.ts
Signals: N/A
Excerpt (<=80 chars):  export const generateHeaders = (headers: RequestInit['headers'] = {}): Reque...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- generateHeaders
- generateRequestObject
```

--------------------------------------------------------------------------------

---[FILE: getIdentifierFromName.ts]---
Location: harness-main/web/cypress/utils/getIdentifierFromName.ts
Signals: N/A
Excerpt (<=80 chars):  export const getIdentifierFromName = (str: string): string => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getIdentifierFromName
```

--------------------------------------------------------------------------------

---[FILE: getRandomNameByType.ts]---
Location: harness-main/web/cypress/utils/getRandomNameByType.ts
Signals: N/A
Excerpt (<=80 chars):  export const getRandomNameByType = (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getRandomNameByType
```

--------------------------------------------------------------------------------

---[FILE: getRequestBodies.ts]---
Location: harness-main/web/cypress/utils/getRequestBodies.ts
Signals: N/A
Excerpt (<=80 chars):  export function getRandomCreateRegistryBody(name: string, packageType: PACKA...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getRandomCreateRegistryBody
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: harness-main/web/cypress/utils/types.ts
Signals: N/A
Excerpt (<=80 chars):  export type EntityType = 'project' | 'registry' | 'upstreamProxy'

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EntityType
- AUTOMATION_PROJECT_PREFIX
- PACKAGE_TYPE
- REGISTRY_TYPE
```

--------------------------------------------------------------------------------

---[FILE: App.tsx]---
Location: harness-main/web/src/App.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: AppContext.tsx]---
Location: harness-main/web/src/AppContext.tsx
Signals: React
Excerpt (<=80 chars):  export const defaultCurrentUser: Required<TypesUser> = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: AppProps.ts]---
Location: harness-main/web/src/AppProps.ts
Signals: React
Excerpt (<=80 chars): export interface AppProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AppProps
```

--------------------------------------------------------------------------------

---[FILE: AppUtils.ts]---
Location: harness-main/web/src/AppUtils.ts
Signals: N/A
Excerpt (<=80 chars): export function handle401() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- handle401
- buildRestfulReactRequestOptions
```

--------------------------------------------------------------------------------

---[FILE: bootstrap.tsx]---
Location: harness-main/web/src/bootstrap.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: global.d.ts]---
Location: harness-main/web/src/global.d.ts
Signals: React
Excerpt (<=80 chars):  export const ILanguageFeaturesService: { documentSymbolProvider: unknown }

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RouteDefinitions.ts]---
Location: harness-main/web/src/RouteDefinitions.ts
Signals: N/A
Excerpt (<=80 chars):  export interface CODEProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CODEProps
- CODEQueryProps
- CODERoutes
```

--------------------------------------------------------------------------------

---[FILE: RouteDestinations.tsx]---
Location: harness-main/web/src/RouteDestinations.tsx
Signals: React
Excerpt (<=80 chars):  export const RouteDestinations: React.FC = React.memo(function RouteDestinat...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: bootstrap.tsx]---
Location: harness-main/web/src/ar/bootstrap.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: harness-main/web/src/ar/constants.ts
Signals: N/A
Excerpt (<=80 chars):  export const MODULE_NAME = 'har'

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MODULE_NAME
- DEFAULT_PAGE_INDEX
- DEFAULT_PAGE_SIZE
- PAGE_SIZE_OPTIONS
- DEFAULT_PIPELINE_LIST_TABLE_SORT
- DEFAULT_FILE_LIST_TABLE_SORT
- DEFAULT_GLOBAL_ARTIFACT_LIST_TABLE_SORT
- DEFAULT_PACKAGE_LIST_TABLE_SORT
- DEFAULT_REPOSITORY_LIST_TABLE_SORT
- DEFAULT_ARTIFACT_LIST_TABLE_SORT
- DEFAULT_UPSTREAM_PROXY_LIST_TABLE_SORT
- DEFAULT_DEPLOYMENTS_LIST_TABLE_SORT
- DEFAULT_DATE_FORMAT
- DEFAULT_TIME_FORMAT
- DEFAULT_DATE_TIME_FORMAT
- REPO_KEY_REGEX
- URL_REGEX
- GENERIC_URL_REGEX
```

--------------------------------------------------------------------------------

---[FILE: MFEAppTypes.ts]---
Location: harness-main/web/src/ar/MFEAppTypes.ts
Signals: React
Excerpt (<=80 chars):  export interface Scope {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FeatureFlagMap
- Scope
- PipelineExecutionPathProps
- ServiceDetailsPathProps
- PermissionsRequest
- AppstoreContext
- ParentContextObj
- Components
- Hooks
- CustomHooks
- CustomComponents
- GenerateTokenResponse
- CustomUtils
- MFEAppProps
```

--------------------------------------------------------------------------------

---[FILE: App.tsx]---
Location: harness-main/web/src/ar/app/App.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: EnterpriseApp.tsx]---
Location: harness-main/web/src/ar/app/EnterpriseApp.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: GitnessApp.tsx]---
Location: harness-main/web/src/ar/app/GitnessApp.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: useOpenApiClient.ts]---
Location: harness-main/web/src/ar/app/useOpenApiClient.ts
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: dateUtils.ts]---
Location: harness-main/web/src/ar/common/dateUtils.ts
Signals: N/A
Excerpt (<=80 chars):  export const getReadableDateTime = (timestamp?: number, formatString = 'MMM ...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getReadableDateTime
```

--------------------------------------------------------------------------------

---[FILE: LicenseTypes.ts]---
Location: harness-main/web/src/ar/common/LicenseTypes.ts
Signals: N/A
Excerpt (<=80 chars):  export interface LicenseStoreContextProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LicenseStoreContextProps
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: harness-main/web/src/ar/common/types.ts
Signals: N/A
Excerpt (<=80 chars):  export interface FormikExtended<T> extends FormikContextType<T> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FormikRef
- FormikFowardRef
- FormikExtended
- FormikContextProps
- CardSelectOption
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: harness-main/web/src/ar/common/utils.ts
Signals: React
Excerpt (<=80 chars):  export function setFormikRef<T = unknown, U = unknown>(ref: FormikFowardRef<...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getIdentifierStringForBreadcrumb
- killEvent
- getPackageTypesForApiQueryParams
```

--------------------------------------------------------------------------------

---[FILE: ActionButton.tsx]---
Location: harness-main/web/src/ar/components/ActionButton/ActionButton.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: AddPatternList.tsx]---
Location: harness-main/web/src/ar/components/AddPatternList/AddPatternList.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: AISearchInput.tsx]---
Location: harness-main/web/src/ar/components/AISearchInput/AISearchInput.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: harness-main/web/src/ar/components/AISearchInput/types.ts
Signals: N/A
Excerpt (<=80 chars):  export interface AIOption {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AIOption
```

--------------------------------------------------------------------------------

---[FILE: AppErrorBoundary.tsx]---
Location: harness-main/web/src/ar/components/AppErrorBoundary/AppErrorBoundary.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ArtifactRegistryBadge.tsx]---
Location: harness-main/web/src/ar/components/Badge/ArtifactRegistryBadge.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Badge.tsx]---
Location: harness-main/web/src/ar/components/Badge/Badge.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: OCITag.tsx]---
Location: harness-main/web/src/ar/components/Badge/OCITag.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: QuarantineBadge.tsx]---
Location: harness-main/web/src/ar/components/Badge/QuarantineBadge.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RepositoryLocationBadge.tsx]---
Location: harness-main/web/src/ar/components/Badge/RepositoryLocationBadge.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RepositoryVisibilityBadge.tsx]---
Location: harness-main/web/src/ar/components/Badge/RepositoryVisibilityBadge.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ScopeBadge.tsx]---
Location: harness-main/web/src/ar/components/Badge/ScopeBadge.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: UpstreamProxyBadge.tsx]---
Location: harness-main/web/src/ar/components/Badge/UpstreamProxyBadge.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Breadcrumbs.tsx]---
Location: harness-main/web/src/ar/components/Breadcrumbs/Breadcrumbs.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ButtonTabs.tsx]---
Location: harness-main/web/src/ar/components/ButtonTabs/ButtonTabs.tsx
Signals: React
Excerpt (<=80 chars):  export function ButtonTab<T>(props: ButtonTabProps<T>): JSX.Element {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: harness-main/web/src/ar/components/Charts/types.ts
Signals: N/A
Excerpt (<=80 chars):  export interface PieChartItem {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PieChartItem
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: harness-main/web/src/ar/components/Charts/utils.ts
Signals: N/A
Excerpt (<=80 chars):  export const getParsedOptions = (defaultOptions: Highcharts.Options, options...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getParsedOptions
```

--------------------------------------------------------------------------------

---[FILE: DonutChart.tsx]---
Location: harness-main/web/src/ar/components/Charts/DonutChart/DonutChart.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: LegendList.tsx]---
Location: harness-main/web/src/ar/components/Charts/DonutChart/LegendList.tsx
Signals: React
Excerpt (<=80 chars):  export const LegendList = ({ items }: { items: PieChartItem[] }) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LegendList
```

--------------------------------------------------------------------------------

---[FILE: CleanupPolicy.tsx]---
Location: harness-main/web/src/ar/components/CleanupPolicyList/CleanupPolicy.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: CleanupPolicyList.tsx]---
Location: harness-main/web/src/ar/components/CleanupPolicyList/CleanupPolicyList.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: utils.tsx]---
Location: harness-main/web/src/ar/components/CleanupPolicyList/utils.tsx
Signals: N/A
Excerpt (<=80 chars):  export function getFormattedFormDataForCleanupPolicy(values: RepositoryReque...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getFormattedFormDataForCleanupPolicy
- getFormattedIntialValuesForCleanupPolicy
```

--------------------------------------------------------------------------------

---[FILE: CollapseContainer.tsx]---
Location: harness-main/web/src/ar/components/CollapseContainer/CollapseContainer.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: CommandBlock.tsx]---
Location: harness-main/web/src/ar/components/CommandBlock/CommandBlock.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: CopyButton.tsx]---
Location: harness-main/web/src/ar/components/CopyButton/CopyButton.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DescriptionPopover.tsx]---
Location: harness-main/web/src/ar/components/DescriptionPopover/DescriptionPopover.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: EnvironmentTypeSelector.tsx]---
Location: harness-main/web/src/ar/components/EnvironmentTypeSelector/EnvironmentTypeSelector.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: CheckboxGroup.tsx]---
Location: harness-main/web/src/ar/components/Form/CheckboxGroup/CheckboxGroup.tsx
Signals: React
Excerpt (<=80 chars):  export interface CheckboxGroupProps extends Omit<IFormGroupProps, 'labelFor'> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CheckboxGroupProps
```

--------------------------------------------------------------------------------

---[FILE: CheckboxWithInput.tsx]---
Location: harness-main/web/src/ar/components/Form/CheckboxWithMultitypeInput/CheckboxWithInput.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: CheckboxWithPatternInput.tsx]---
Location: harness-main/web/src/ar/components/Form/CheckboxWithMultitypeInput/CheckboxWithPatternInput.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: PatternInput.tsx]---
Location: harness-main/web/src/ar/components/Form/PatternInput/PatternInput.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Title.tsx]---
Location: harness-main/web/src/ar/components/Header/Title.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: IncludeExcludePatterns.tsx]---
Location: harness-main/web/src/ar/components/IncludeExcludePatterns/IncludeExcludePatterns.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: LabelsPopover.tsx]---
Location: harness-main/web/src/ar/components/LabelsPopover/LabelsPopover.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DropdownLabelSelector.tsx]---
Location: harness-main/web/src/ar/components/ManageMetadata/DropdownLabelSelector.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DropdownList.tsx]---
Location: harness-main/web/src/ar/components/ManageMetadata/DropdownList.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ManageMetadataLabels.tsx]---
Location: harness-main/web/src/ar/components/ManageMetadata/ManageMetadataLabels.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: PopoverContent.tsx]---
Location: harness-main/web/src/ar/components/ManageMetadata/PopoverContent.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: SearchInput.tsx]---
Location: harness-main/web/src/ar/components/ManageMetadata/SearchInput.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: CopyMenuItem.tsx]---
Location: harness-main/web/src/ar/components/MenuItemTypes/CopyMenuItem.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: LinkMenuItem.tsx]---
Location: harness-main/web/src/ar/components/MenuItemTypes/LinkMenuItem.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: MetadataFilterSelector.tsx]---
Location: harness-main/web/src/ar/components/MetadataFilterSelector/MetadataFilterSelector.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: PopoverContent.tsx]---
Location: harness-main/web/src/ar/components/MetadataFilterSelector/PopoverContent.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: useMetadataFilterFromQuery.ts]---
Location: harness-main/web/src/ar/components/MetadataFilterSelector/useMetadataFilterFromQuery.ts
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: MultiDropdownSelect.tsx]---
Location: harness-main/web/src/ar/components/MultiDropdownSelect/MultiDropdownSelect.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: MultiTagsInput.tsx]---
Location: harness-main/web/src/ar/components/MultiTagsInput/MultiTagsInput.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: TagIcon.tsx]---
Location: harness-main/web/src/ar/components/MultiTagsInput/TagIcon.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: MultiTypeSecretInput.tsx]---
Location: harness-main/web/src/ar/components/MultiTypeSecretInput/MultiTypeSecretInput.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: harness-main/web/src/ar/components/NameDescriptionTags/index.tsx
Signals: React
Excerpt (<=80 chars):  export const Description = (props: DescriptionComponentProps): JSX.Element => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Description
- Tags
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: harness-main/web/src/ar/components/NameDescriptionTags/types.ts
Signals: N/A
Excerpt (<=80 chars):  export interface DescriptionProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DescriptionProps
- DescriptionComponentProps
- TagsProps
- TagsComponentProps
```

--------------------------------------------------------------------------------

---[FILE: PackageTypeSelector.tsx]---
Location: harness-main/web/src/ar/components/PackageTypeSelector/PackageTypeSelector.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: PageContent.tsx]---
Location: harness-main/web/src/ar/components/PageContent/PageContent.tsx
Signals: React
Excerpt (<=80 chars): import React from 'react'

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ArtifactTags.tsx]---
Location: harness-main/web/src/ar/components/PageTitle/ArtifactTags.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: CreatedAndModifiedAt.tsx]---
Location: harness-main/web/src/ar/components/PageTitle/CreatedAndModifiedAt.tsx
Signals: React
Excerpt (<=80 chars): /*

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

````
