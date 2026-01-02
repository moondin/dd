---
source_txt: fullstack_samples/insomnia-develop
converted_utc: 2025-12-18T10:36:55Z
part: 7
parts_total: 10
---

# FULLSTACK CODE DATABASE SAMPLES insomnia-develop

## Extracted Reusable Patterns (Non-verbatim) (Part 7 of 10)

````text
================================================================================
FULLSTACK SAMPLES PATTERN DATABASE - insomnia-develop
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/insomnia-develop
================================================================================

NOTES:
- This file intentionally avoids copying large verbatim third-party code.
- It captures reusable patterns, surfaces, and file references.
- Use the referenced file paths to view full implementations locally.

================================================================================

---[FILE: environment-editor.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/editors/environment-editor.tsx
Signals: React
Excerpt (<=80 chars):  export interface EnvironmentInfo {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EnvironmentEditor
- EnvironmentInfo
- EnvironmentEditorHandle
```

--------------------------------------------------------------------------------

---[FILE: environment-utils.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/editors/environment-utils.tsx
Signals: N/A
Excerpt (<=80 chars):  export const ensureKeyIsValid = (key: string, isRoot: boolean): string | nul...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- checkNestedKeys
- handleToggleEnvironmentType
- ensureKeyIsValid
```

--------------------------------------------------------------------------------

---[FILE: mock-response-extractor.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/editors/mock-response-extractor.tsx
Signals: React
Excerpt (<=80 chars):  export const MockResponseExtractor = () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MockResponseExtractor
```

--------------------------------------------------------------------------------

---[FILE: mock-response-headers-editor.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/editors/mock-response-headers-editor.tsx
Signals: React
Excerpt (<=80 chars):  export const MockResponseHeadersEditor: FC<Props> = ({ bulk, isDisabled, onB...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: request-headers-editor.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/editors/request-headers-editor.tsx
Signals: React
Excerpt (<=80 chars): export const readOnlyWebsocketPairs = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- readOnlyWebsocketPairs
- readOnlyHttpPairs
```

--------------------------------------------------------------------------------

---[FILE: request-parameters-editor.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/editors/request-parameters-editor.tsx
Signals: React
Excerpt (<=80 chars):  export const RequestParametersEditor: FC<Props> = ({ bulk, disabled = false ...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: request-script-editor.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/editors/request-script-editor.tsx
Signals: React
Excerpt (<=80 chars):  export const RequestScriptEditor: FC<Props> = ({ className, defaultValue, on...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: api-key-auth.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/editors/auth/api-key-auth.tsx
Signals: React
Excerpt (<=80 chars):  export const options = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- options
```

--------------------------------------------------------------------------------

---[FILE: asap-auth.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/editors/auth/asap-auth.tsx
Signals: React
Excerpt (<=80 chars):  export const AsapAuth: FC = () => (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: auth-wrapper.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/editors/auth/auth-wrapper.tsx
Signals: React
Excerpt (<=80 chars):  export const AuthWrapper: FC<{

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: aws-auth.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/editors/auth/aws-auth.tsx
Signals: React
Excerpt (<=80 chars):  export const AWSAuth: FC = () => (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: basic-auth.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/editors/auth/basic-auth.tsx
Signals: React
Excerpt (<=80 chars):  export const BasicAuth: FC<{ disabled?: boolean }> = ({ disabled = false }) ...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: bearer-auth.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/editors/auth/bearer-auth.tsx
Signals: React
Excerpt (<=80 chars):  export const BearerAuth: FC<{ disabled?: boolean }> = ({ disabled = false })...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: digest-auth.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/editors/auth/digest-auth.tsx
Signals: React
Excerpt (<=80 chars):  export const DigestAuth: FC<{ disabled?: boolean }> = ({ disabled = false })...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: hawk-auth.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/editors/auth/hawk-auth.tsx
Signals: React
Excerpt (<=80 chars):  export const HawkAuth: FC = () => (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: netrc-auth.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/editors/auth/netrc-auth.tsx
Signals: React
Excerpt (<=80 chars):  export const NetrcAuth: FC = () => (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ntlm-auth.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/editors/auth/ntlm-auth.tsx
Signals: React
Excerpt (<=80 chars):  export const NTLMAuth: FC = () => (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: o-auth-1-auth.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/editors/auth/o-auth-1-auth.tsx
Signals: React
Excerpt (<=80 chars): export const signatureMethodOptions: { name: OAuth1SignatureMethod; value: OA...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: o-auth-2-auth.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/editors/auth/o-auth-2-auth.tsx
Signals: React
Excerpt (<=80 chars):  export const OAuth2Auth = ({ showMcpAuthFlow, disabled }: { showMcpAuthFlow?...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- convertEpochToMilliseconds
- OAuth2Auth
```

--------------------------------------------------------------------------------

---[FILE: single-token-auth.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/editors/auth/single-token-auth.tsx
Signals: React
Excerpt (<=80 chars):  export const SingleTokenAuth: FC<{ disabled?: boolean }> = ({ disabled = fal...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: auth-accordion.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/editors/auth/components/auth-accordion.tsx
Signals: React
Excerpt (<=80 chars):  export const AuthAccordion: FC<PropsWithChildren<Props>> = ({ accordionKey, ...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: auth-enabled-row.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/editors/auth/components/auth-enabled-row.tsx
Signals: React
Excerpt (<=80 chars):  export const AuthEnabledRow: FC = () => <AuthToggleRow label="Enabled" prope...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: auth-input-row.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/editors/auth/components/auth-input-row.tsx
Signals: React
Excerpt (<=80 chars):  export const AuthInputRow: FC<Props> = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: auth-private-key-row.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/editors/auth/components/auth-private-key-row.tsx
Signals: React
Excerpt (<=80 chars):  export const AuthPrivateKeyRow: FC<Props> = ({ label, property, help }) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: auth-row.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/editors/auth/components/auth-row.tsx
Signals: React
Excerpt (<=80 chars):  export const AuthRow: FC<PropsWithChildren<Props>> = ({ labelFor, label, hel...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: auth-select-row.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/editors/auth/components/auth-select-row.tsx
Signals: React
Excerpt (<=80 chars):  export const AuthSelectRow: FC<Props> = ({ label, property, help, options, d...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: auth-table-body.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/editors/auth/components/auth-table-body.tsx
Signals: React
Excerpt (<=80 chars):  export const AuthTableBody: FC<{ children: ReactNode }> = ({ children }) => (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: auth-toggle-row.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/editors/auth/components/auth-toggle-row.tsx
Signals: React
Excerpt (<=80 chars):  export const AuthToggleRow: FC<Props> = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: body-editor.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/editors/body/body-editor.tsx
Signals: React
Excerpt (<=80 chars):  export const BodyEditor: FC<Props> = ({ request, environmentId }) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: file-editor.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/editors/body/file-editor.tsx
Signals: React
Excerpt (<=80 chars):  export const FileEditor: FC<Props> = ({ onChange, path }) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: form-editor.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/editors/body/form-editor.tsx
Signals: React
Excerpt (<=80 chars):  export const FormEditor: FC<Props> = ({ parameters, onChange }) => (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: graph-ql-editor.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/editors/body/graph-ql-editor.tsx
Signals: React
Excerpt (<=80 chars):  export const GraphQLEditor: FC<Props> = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: raw-editor.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/editors/body/raw-editor.tsx
Signals: React
Excerpt (<=80 chars):  export const RawEditor: FC<Props> = ({ className, content, contentType, onCh...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: url-encoded-editor.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/editors/body/url-encoded-editor.tsx
Signals: React
Excerpt (<=80 chars):  export const UrlEncodedEditor: FC<Props> = ({ parameters, onChange }) => (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: key-value-editor.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/editors/environment-key-value-editor/key-value-editor.tsx
Signals: React
Excerpt (<=80 chars):  export const EnvironmentKVEditor = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EnvironmentKVEditor
```

--------------------------------------------------------------------------------

---[FILE: password-input.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/editors/environment-key-value-editor/password-input.tsx
Signals: React
Excerpt (<=80 chars):  export interface PasswordInputProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PasswordInput
- PasswordInputProps
```

--------------------------------------------------------------------------------

---[FILE: connection-info.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/git/connection-info.tsx
Signals: N/A
Excerpt (<=80 chars):  export const GitConnectionInfo = ({ gitRepository }: { gitRepository?: GitRe...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GitConnectionInfo
```

--------------------------------------------------------------------------------

---[FILE: git-provider-tag.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/git/git-provider-tag.tsx
Signals: N/A
Excerpt (<=80 chars):  export const GitProviderTag = ({ provider }: { provider: OauthProviderName }...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GitProviderTag
```

--------------------------------------------------------------------------------

---[FILE: custom-repository-settings-form.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/git-credentials/custom-repository-settings-form.tsx
Signals: React
Excerpt (<=80 chars):  export interface Props {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Props
```

--------------------------------------------------------------------------------

---[FILE: git-remote-branch-select.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/git-credentials/git-remote-branch-select.tsx
Signals: React, Zod
Excerpt (<=80 chars):  export const GitRemoteBranchSelect = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GitRemoteBranchSelect
```

--------------------------------------------------------------------------------

---[FILE: github-repository-select.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/git-credentials/github-repository-select.tsx
Signals: React
Excerpt (<=80 chars):  export const GitHubRepositorySelect = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GitHubRepositorySelect
```

--------------------------------------------------------------------------------

---[FILE: github-repository-settings-form.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/git-credentials/github-repository-settings-form.tsx
Signals: React
Excerpt (<=80 chars):  export const GitHubRepositorySetupFormGroup = (props: Props) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GitHubRepositorySetupFormGroup
```

--------------------------------------------------------------------------------

---[FILE: gitlab-repository-settings-form.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/git-credentials/gitlab-repository-settings-form.tsx
Signals: React
Excerpt (<=80 chars):  export const GitLabRepositorySetupFormGroup = (props: Props) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GitLabRepositorySetupFormGroup
```

--------------------------------------------------------------------------------

---[FILE: graph-ql-default-value.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/graph-ql-explorer/graph-ql-default-value.tsx
Signals: React
Excerpt (<=80 chars):  export const GraphQLDefaultValue: FC<Props> = memo(({ field }) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: graph-ql-explorer-arg-links.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/graph-ql-explorer/graph-ql-explorer-arg-links.tsx
Signals: React
Excerpt (<=80 chars):  export const GraphQLExplorerArgLinks: FC<Props> = ({ args, onNavigate }) => (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: graph-ql-explorer-enum.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/graph-ql-explorer/graph-ql-explorer-enum.tsx
Signals: React
Excerpt (<=80 chars):  export const GraphQLExplorerEnum: FC<Props> = ({ type }) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: graph-ql-explorer-field-link.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/graph-ql-explorer/graph-ql-explorer-field-link.tsx
Signals: React
Excerpt (<=80 chars):  export const GraphQLExplorerFieldLink: FC<Props> = ({ field, onNavigate }) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: graph-ql-explorer-field.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/graph-ql-explorer/graph-ql-explorer-field.tsx
Signals: React
Excerpt (<=80 chars):  export class GraphQLExplorerField extends PureComponent<Props> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GraphQLExplorerField
```

--------------------------------------------------------------------------------

---[FILE: graph-ql-explorer-fields-list.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/graph-ql-explorer/graph-ql-explorer-fields-list.tsx
Signals: React
Excerpt (<=80 chars):  export const GraphQLExplorerFieldsList: FC<Props> = ({ fields, onNavigateTyp...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: graph-ql-explorer-schema.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/graph-ql-explorer/graph-ql-explorer-schema.tsx
Signals: React
Excerpt (<=80 chars):  export class GraphQLExplorerSchema extends PureComponent<Props> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GraphQLExplorerSchema
```

--------------------------------------------------------------------------------

---[FILE: graph-ql-explorer-search-results.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/graph-ql-explorer/graph-ql-explorer-search-results.tsx
Signals: React
Excerpt (<=80 chars):  export class GraphQLExplorerSearchResults extends PureComponent<Props, State> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GraphQLExplorerSearchResults
```

--------------------------------------------------------------------------------

---[FILE: graph-ql-explorer-type-link.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/graph-ql-explorer/graph-ql-explorer-type-link.tsx
Signals: React
Excerpt (<=80 chars):  export const GraphQLExplorerTypeLink: FC<Props> = ({ type, onNavigate }) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: graph-ql-explorer-type.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/graph-ql-explorer/graph-ql-explorer-type.tsx
Signals: React
Excerpt (<=80 chars): export const GraphQLExplorerType: FC<Props> = ({ schema, type, onNavigateType...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: graph-ql-explorer.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/graph-ql-explorer/graph-ql-explorer.tsx
Signals: React
Excerpt (<=80 chars):  export const GraphQLExplorer: FC<Props> = ({ schema, handleClose, visible, r...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: graph-ql-types.ts]---
Location: insomnia-develop/packages/insomnia/src/ui/components/graph-ql-explorer/graph-ql-types.ts
Signals: N/A
Excerpt (<=80 chars): export type GraphQLFieldWithOptionalArgs = Omit<GraphQLFieldAny, 'args'> & Pa...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GraphQLFieldWithOptionalArgs
- ActiveReference
- GraphQLFieldWithParentName
```

--------------------------------------------------------------------------------

---[FILE: key-value-editor.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/key-value-editor/key-value-editor.tsx
Signals: React
Excerpt (<=80 chars):  export const KeyValueEditor: FC<Props> = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: row.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/key-value-editor/row.tsx
Signals: React
Excerpt (<=80 chars):  export interface Pair {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AutocompleteHandler
- Pair
```

--------------------------------------------------------------------------------

---[FILE: elicitation-form.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/mcp/elicitation-form.tsx
Signals: React
Excerpt (<=80 chars):  export const ElicitationForm = ({ requestId, serverRequestId, schema }: Elic...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ElicitationForm
```

--------------------------------------------------------------------------------

---[FILE: event-view.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/mcp/event-view.tsx
Signals: React
Excerpt (<=80 chars):  export const MessageEventView = ({ event }: Props) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MessageEventView
- McpEventView
```

--------------------------------------------------------------------------------

---[FILE: mcp-notification-tab.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/mcp/mcp-notification-tab.tsx
Signals: React
Excerpt (<=80 chars):  export interface McpNotificationTabProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- McpNotificationTab
- McpNotificationTabProps
```

--------------------------------------------------------------------------------

---[FILE: mcp-pane.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/mcp/mcp-pane.tsx
Signals: React
Excerpt (<=80 chars):  export const McpPane = () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- McpPane
```

--------------------------------------------------------------------------------

---[FILE: mcp-request-pane.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/mcp/mcp-request-pane.tsx
Signals: React
Excerpt (<=80 chars): export type RequestPaneTabs = 'params' | 'auth' | 'headers' | 'roots';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RequestPaneTabs
```

--------------------------------------------------------------------------------

---[FILE: mcp-roots-panel.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/mcp/mcp-roots-panel.tsx
Signals: React
Excerpt (<=80 chars):  export const McpRootsPanel = ({ request, readyState }: McpRootsPanelProps) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- McpRootsPanel
```

--------------------------------------------------------------------------------

---[FILE: mcp-url-bar.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/mcp/mcp-url-bar.tsx
Signals: React
Excerpt (<=80 chars):  export const McpUrlActionBar = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- McpUrlActionBar
- MCPStdioAccessModal
- MCPStdioAccessModalHandle
```

--------------------------------------------------------------------------------

---[FILE: sampling-form.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/mcp/sampling-form.tsx
Signals: React
Excerpt (<=80 chars):  export const SamplingForm = ({ requestId, serverRequestId, samplingData }: S...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SamplingForm
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: insomnia-develop/packages/insomnia/src/ui/components/mcp/types.ts
Signals: N/A
Excerpt (<=80 chars):  export interface ToolItem extends Tool, CommonItemProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PrimitiveSubItem
- ToolItem
- ResourceItem
- ResourceTemplateItem
- PromptItem
- PrimitiveTypeItem
```

--------------------------------------------------------------------------------

---[FILE: mock-response-pane.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/mocks/mock-response-pane.tsx
Signals: React
Excerpt (<=80 chars):  export const MockResponsePane = () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MockResponsePane
```

--------------------------------------------------------------------------------

---[FILE: mock-url-bar.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/mocks/mock-url-bar.tsx
Signals: React
Excerpt (<=80 chars):  export const MockUrlBar = ({ onSend }: { onSend: (path: string) => void }) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MockUrlBar
```

--------------------------------------------------------------------------------

---[FILE: add-key-combination-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/add-key-combination-modal.tsx
Signals: React
Excerpt (<=80 chars):  export interface AddKeyCombinationModalOptions {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddKeyCombinationModal
- AddKeyCombinationModalOptions
- AddKeyCombinationModalHandle
```

--------------------------------------------------------------------------------

---[FILE: add-request-to-collection-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/add-request-to-collection-modal.tsx
Signals: React
Excerpt (<=80 chars):  export const AddRequestToCollectionModal: FC<AddRequestModalProps> = ({ onHi...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: alert-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/alert-modal.tsx
Signals: React
Excerpt (<=80 chars):  export interface AlertModalOptions {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AlertModal
- AlertModalOptions
- AlertModalHandle
```

--------------------------------------------------------------------------------

---[FILE: ask-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/ask-modal.tsx
Signals: React
Excerpt (<=80 chars): export interface AskModalOptions {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AskModal
- AskModalOptions
- AskModalHandle
```

--------------------------------------------------------------------------------

---[FILE: cli-preview-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/cli-preview-modal.tsx
Signals: N/A
Excerpt (<=80 chars):  export const CLIPreviewModal = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CLIPreviewModal
```

--------------------------------------------------------------------------------

---[FILE: code-prompt-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/code-prompt-modal.tsx
Signals: React
Excerpt (<=80 chars):  export interface CodePromptModalHandle {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CodePromptModal
- CodePromptModalHandle
```

--------------------------------------------------------------------------------

---[FILE: cookies-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/cookies-modal.tsx
Signals: React
Excerpt (<=80 chars):  export function chunkArray<T>(array: T[], chunkSize: number = ItemsPerPage):...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CookiesModal
- CookieListProps
```

--------------------------------------------------------------------------------

---[FILE: error-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/error-modal.tsx
Signals: React
Excerpt (<=80 chars): export interface ErrorModalOptions {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ErrorModal
- ErrorModalOptions
- ErrorModalHandle
```

--------------------------------------------------------------------------------

---[FILE: export-requests-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/export-requests-modal.tsx
Signals: React
Excerpt (<=80 chars):  export interface Node {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExportRequestsModal
- Node
```

--------------------------------------------------------------------------------

---[FILE: filter-help-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/filter-help-modal.tsx
Signals: React
Excerpt (<=80 chars):  export const FilterHelpModal: FC<FilterHelpModalOptions> = ({ isJSON }) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: generate-code-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/generate-code-modal.tsx
Signals: React
Excerpt (<=80 chars): export interface GenerateCodeModalOptions {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GenerateCodeModal
- GenerateCodeModalOptions
- State
- GenerateCodeModalHandle
```

--------------------------------------------------------------------------------

---[FILE: git-branches-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/git-branches-modal.tsx
Signals: React
Excerpt (<=80 chars):  export const GitBranchesModal: FC<Props> = ({ currentBranch, branches, onClo...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: git-log-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/git-log-modal.tsx
Signals: React
Excerpt (<=80 chars):  export const GitLogModal: FC<Props> = ({ onClose }) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: git-project-branches-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/git-project-branches-modal.tsx
Signals: React
Excerpt (<=80 chars):  export const GitProjectBranchesModal: FC<Props> = ({ currentBranch, branches...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: git-project-log-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/git-project-log-modal.tsx
Signals: React
Excerpt (<=80 chars):  export const GitProjectLogModal: FC<Props> = ({ onClose }) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: git-project-migration-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/git-project-migration-modal.tsx
Signals: React
Excerpt (<=80 chars):  export const GitProjectMigrationModal: FC<{

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: git-project-staging-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/git-project-staging-modal.tsx
Signals: React
Excerpt (<=80 chars):  export type StagingModalMode = 'default' | 'commit-and-pull';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- StagingModalModes
- StagingModalMode
```

--------------------------------------------------------------------------------

---[FILE: git-pull-required-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/git-pull-required-modal.tsx
Signals: React
Excerpt (<=80 chars):  export const GitPullRequiredModal = ({ title, message, okLabel, onConfirm, o...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GitPullRequiredModal
```

--------------------------------------------------------------------------------

---[FILE: git-staging-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/git-staging-modal.tsx
Signals: React
Excerpt (<=80 chars):  export const GitStagingModal: FC<{ onClose: () => void }> = ({ onClose }) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/index.ts
Signals: N/A
Excerpt (<=80 chars):  export function registerModal(instance: any, modalName?: string) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- registerModal
- showError
- hideAllModals
```

--------------------------------------------------------------------------------

---[FILE: input-vault-key-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/input-vault-key-modal.tsx
Signals: React
Excerpt (<=80 chars):  export interface InputVaultKeyModalProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InputVaultKeyModal
- InputVaultKeyModalProps
```

--------------------------------------------------------------------------------

---[FILE: logout-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/logout-modal.tsx
Signals: React
Excerpt (<=80 chars):  export interface LogoutModalHandle {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LogoutModal
- LogoutModalHandle
```

--------------------------------------------------------------------------------

---[FILE: mcp-certificates-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/mcp-certificates-modal.tsx
Signals: React
Excerpt (<=80 chars):  export const MCPCertificatesModal = ({ onClose }: { onClose: () => void }) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MCPCertificatesModal
```

--------------------------------------------------------------------------------

---[FILE: mock-route-modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/ui/components/modals/mock-route-modal.tsx
Signals: React
Excerpt (<=80 chars):  export interface MockRouteModalProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MockRouteModal
- MockRouteModalProps
```

--------------------------------------------------------------------------------

````
