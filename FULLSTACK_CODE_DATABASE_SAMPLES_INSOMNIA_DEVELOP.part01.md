---
source_txt: fullstack_samples/insomnia-develop
converted_utc: 2025-12-18T10:36:55Z
part: 1
parts_total: 10
---

# FULLSTACK CODE DATABASE SAMPLES insomnia-develop

## Extracted Reusable Patterns (Non-verbatim) (Part 1 of 10)

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

---[FILE: svgr.config.js]---
Location: insomnia-develop/packages/insomnia/svgr.config.js
Signals: React
Excerpt (<=80 chars):  export const ${variables.componentName} = memo<SVGProps<SVGSVGElement>>(prop...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: vite-plugin-electron-node-require.ts]---
Location: insomnia-develop/packages/insomnia/vite-plugin-electron-node-require.ts
Signals: N/A
Excerpt (<=80 chars):  export interface Options {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- electronNodeRequire
- clipboard
- contextBridge
- crashReporter
- ipcRenderer
- nativeImage
- shell
- webFrame
- deprecate
- Options
```

--------------------------------------------------------------------------------

---[FILE: vite.config.ts]---
Location: insomnia-develop/packages/insomnia/vite.config.ts
Signals: N/A
Excerpt (<=80 chars): export const externalDependencies = ['@apidevtools/swagger-parser', 'mocha', ...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- externalDependencies
```

--------------------------------------------------------------------------------

---[FILE: build.ts]---
Location: insomnia-develop/packages/insomnia/scripts/build.ts
Signals: N/A
Excerpt (<=80 chars):  export const start = async () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- start
```

--------------------------------------------------------------------------------

---[FILE: verify-bundle-plugins.ts]---
Location: insomnia-develop/packages/insomnia/scripts/verify-bundle-plugins.ts
Signals: N/A
Excerpt (<=80 chars):  export const verifyBundlePlugins = () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- verifyBundlePlugins
```

--------------------------------------------------------------------------------

---[FILE: entry.client.tsx]---
Location: insomnia-develop/packages/insomnia/src/entry.client.tsx
Signals: React
Excerpt (<=80 chars): import './ui/renderer-listeners';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: entry.hidden-window-preload.ts]---
Location: insomnia-develop/packages/insomnia/src/entry.hidden-window-preload.ts
Signals: N/A
Excerpt (<=80 chars):  export interface HiddenBrowserWindowToMainBridgeAPI {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HiddenBrowserWindowToMainBridgeAPI
```

--------------------------------------------------------------------------------

---[FILE: entry.hidden-window.ts]---
Location: insomnia-develop/packages/insomnia/src/entry.hidden-window.ts
Signals: N/A
Excerpt (<=80 chars):  export interface HiddenBrowserWindowBridgeAPI {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HiddenBrowserWindowBridgeAPI
```

--------------------------------------------------------------------------------

---[FILE: entry.server.tsx]---
Location: insomnia-develop/packages/insomnia/src/entry.server.tsx
Signals: N/A
Excerpt (<=80 chars):  export const streamTimeout = 5000;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- streamTimeout
```

--------------------------------------------------------------------------------

---[FILE: require-interceptor.ts]---
Location: insomnia-develop/packages/insomnia/src/require-interceptor.ts
Signals: N/A
Excerpt (<=80 chars):  export const requireInterceptor = (moduleName: string): any => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- requireInterceptor
```

--------------------------------------------------------------------------------

---[FILE: root.tsx]---
Location: insomnia-develop/packages/insomnia/src/root.tsx
Signals: React
Excerpt (<=80 chars):  export const links: Route.LinksFunction = () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useRootLoaderData
- Layout
- HydrateFallback
- RootLoaderData
```

--------------------------------------------------------------------------------

---[FILE: script-executor.ts]---
Location: insomnia-develop/packages/insomnia/src/script-executor.ts
Signals: N/A
Excerpt (<=80 chars):  export const runScript = async ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- runScript
```

--------------------------------------------------------------------------------

---[FILE: crypt.ts]---
Location: insomnia-develop/packages/insomnia/src/account/crypt.ts
Signals: N/A
Excerpt (<=80 chars):  export interface AESMessage {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- encryptRSAWithJWK
- decryptRSAWithJWK
- encryptAESBuffer
- encryptAES
- decryptAES
- decryptAESToBuffer
- AESMessage
```

--------------------------------------------------------------------------------

---[FILE: session.ts]---
Location: insomnia-develop/packages/insomnia/src/account/session.ts
Signals: N/A
Excerpt (<=80 chars):  export interface SessionData {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- onLoginLogout
- SessionData
```

--------------------------------------------------------------------------------

---[FILE: banner.tsx]---
Location: insomnia-develop/packages/insomnia/src/basic-components/banner.tsx
Signals: N/A
Excerpt (<=80 chars): export const Banner = ({ type, title, message, footer, className }: BannerPro...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Banner
```

--------------------------------------------------------------------------------

---[FILE: button.tsx]---
Location: insomnia-develop/packages/insomnia/src/basic-components/button.tsx
Signals: React
Excerpt (<=80 chars):  export type ButtonProps = Props & Slots & RAButtonProps;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Button
- ButtonProps
```

--------------------------------------------------------------------------------

---[FILE: divider.tsx]---
Location: insomnia-develop/packages/insomnia/src/basic-components/divider.tsx
Signals: N/A
Excerpt (<=80 chars):  export const Divider = ({ className }: DividerProps) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Divider
```

--------------------------------------------------------------------------------

---[FILE: link.tsx]---
Location: insomnia-develop/packages/insomnia/src/basic-components/link.tsx
Signals: N/A
Excerpt (<=80 chars): export const LearnMoreLink = ({ href, children = 'Learn more', className }: L...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LearnMoreLink
```

--------------------------------------------------------------------------------

---[FILE: modal.tsx]---
Location: insomnia-develop/packages/insomnia/src/basic-components/modal.tsx
Signals: React
Excerpt (<=80 chars):  export const Modal: React.FC<React.PropsWithChildren<Props>> = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: progress.tsx]---
Location: insomnia-develop/packages/insomnia/src/basic-components/progress.tsx
Signals: N/A
Excerpt (<=80 chars):  export const Progress = ({ className, percent, status }: Props) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Progress
```

--------------------------------------------------------------------------------

---[FILE: tabs.tsx]---
Location: insomnia-develop/packages/insomnia/src/basic-components/tabs.tsx
Signals: N/A
Excerpt (<=80 chars):  export const Tab = ({ children, ...props }: TabProps) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Tab
- Tabs
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: insomnia-develop/packages/insomnia/src/basic-components/utils.ts
Signals: N/A
Excerpt (<=80 chars): export type Size = 'sm' | 'md' | 'lg';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getSizeClasses
- getStateClasses
- getTextColorClasses
- getBorderColorClasses
- getBackgroundColorClasses
- Size
- ButtonColor
```

--------------------------------------------------------------------------------

---[FILE: api-specs.ts]---
Location: insomnia-develop/packages/insomnia/src/common/api-specs.ts
Signals: N/A
Excerpt (<=80 chars):  export interface ParsedApiSpec {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- parseApiSpec
- resolveComponentSchemaRefs
- ParsedApiSpec
```

--------------------------------------------------------------------------------

---[FILE: async-array-helpers.ts]---
Location: insomnia-develop/packages/insomnia/src/common/async-array-helpers.ts
Signals: N/A
Excerpt (<=80 chars): export const asyncFilter = async <T>(arr: T[], predicate: (value: T, index: n...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- asyncFilter
```

--------------------------------------------------------------------------------

---[FILE: common-headers.ts]---
Location: insomnia-develop/packages/insomnia/src/common/common-headers.ts
Signals: N/A
Excerpt (<=80 chars):  export const SINGLE_VALUE_HEADERS = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SINGLE_VALUE_HEADERS
- getCommonHeaderValues
- getCommonHeaderNames
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: insomnia-develop/packages/insomnia/src/common/constants.ts
Signals: N/A
Excerpt (<=80 chars):  export const INSOMNIA_GITLAB_REDIRECT_URI = env.INSOMNIA_GITLAB_REDIRECT_URI;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- updatesSupported
- getPreviewModeName
- getMimeTypeFromContentType
- getContentTypeName
- getContentTypeFromHeaders
- INSOMNIA_GITLAB_REDIRECT_URI
- INSOMNIA_GITLAB_CLIENT_ID
- INSOMNIA_GITLAB_API_URL
- PLAYWRIGHT
- getSkipOnboarding
- getInsomniaSession
- getInsomniaSecretKey
- getInsomniaPublicKey
- getInsomniaVaultSalt
- getInsomniaVaultKey
- getInsomniaVaultSrpSecret
- getAppVersion
- getProductName
```

--------------------------------------------------------------------------------

---[FILE: cookies.ts]---
Location: insomnia-develop/packages/insomnia/src/common/cookies.ts
Signals: N/A
Excerpt (<=80 chars): export const cookiesFromJar = (cookieJar: CookieJar): Promise<CookieJSON[]> => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- cookiesFromJar
- jarFromCookies
- cookieToString
```

--------------------------------------------------------------------------------

---[FILE: database.ts]---
Location: insomnia-develop/packages/insomnia/src/common/database.ts
Signals: N/A
Excerpt (<=80 chars):  export interface Operation {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- database
- Query
- ChangeType
- ChangeBufferEvent
- Operation
- SpecificQuery
```

--------------------------------------------------------------------------------

---[FILE: documentation.ts]---
Location: insomnia-develop/packages/insomnia/src/common/documentation.ts
Signals: N/A
Excerpt (<=80 chars):  export const docsBase = insomniaDocs('/');

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- docsBase
- docsGitSync
- docsTemplateTags
- docsVersionControl
- docsPlugins
- docsImportExport
- docsKeyMaps
- docsIntroductionInsomnia
- docsWorkingWithDesignDocs
- docsUnitTesting
- docsIntroductionToInsoCLI
- docsPreRequestScript
- docsAfterResponseScript
- docsMcpClient
- docsMcpAuthentication
- docsPricingLearnMoreLink
- docsGitAccessToken
- documentationLinks
```

--------------------------------------------------------------------------------

---[FILE: get-workspace-label.ts]---
Location: insomnia-develop/packages/insomnia/src/common/get-workspace-label.ts
Signals: N/A
Excerpt (<=80 chars):  export const getWorkspaceLabel = (workspace: Workspace) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getWorkspaceLabel
```

--------------------------------------------------------------------------------

---[FILE: har.ts]---
Location: insomnia-develop/packages/insomnia/src/common/har.ts
Signals: N/A
Excerpt (<=80 chars): export interface ExportRequest {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getResponseCookiesFromHeaders
- ExportRequest
```

--------------------------------------------------------------------------------

---[FILE: hotkeys.ts]---
Location: insomnia-develop/packages/insomnia/src/common/hotkeys.ts
Signals: N/A
Excerpt (<=80 chars): export const keyboardShortcutDescriptions: Record<KeyboardShortcut, string> = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- newDefaultRegistry
- getPlatformKeyCombinations
- areSameKeyCombinations
- getChar
- isModifierKeyCode
- constructKeyCombinationDisplay
```

--------------------------------------------------------------------------------

---[FILE: import-v5-parser.ts]---
Location: insomnia-develop/packages/insomnia/src/common/import-v5-parser.ts
Signals: Zod
Excerpt (<=80 chars): export const LiteralSchema = z.union([z.string(), z.number(), z.boolean(), z....

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LiteralSchema
- KeyLiteralSchema
- MetaSchema
- MetaGroupSchema
- HeadersSchema
- CookieJarSchema
- EnvironmentSchema
- GRPCRequestSchema
- MockRouteSchema
- ScriptsSchema
- RequestSettingsSchema
- WebSocketRequestSettingsSchema
- SocketIORequestSettingsSchema
- RequestPathParametersSchema
- RequestGroupSchema
- RequestSchema
- WebsocketRequestSchema
- SocketIOEventListenerSchema
```

--------------------------------------------------------------------------------

---[FILE: import.ts]---
Location: insomnia-develop/packages/insomnia/src/common/import.ts
Signals: Zod
Excerpt (<=80 chars):  export type AllExportTypes =

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- extractErrorMessages
- isInsomniaV4Import
- importResourcesToWorkspace
- isApiSpecImport
- importResourcesToNewWorkspace
- AllExportTypes
- ExportedModel
- PostmanDataDumpRawData
- ScanResult
```

--------------------------------------------------------------------------------

---[FILE: insomnia-v5.ts]---
Location: insomnia-develop/packages/insomnia/src/common/insomnia-v5.ts
Signals: Zod
Excerpt (<=80 chars): export function insomniaSchemaTypeToScope(type: InsomniaFile['type']): Worksp...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- insomniaSchemaTypeToScope
- tryImportV5Data
- importInsomniaV5Data
```

--------------------------------------------------------------------------------

---[FILE: markdown-to-html.ts]---
Location: insomnia-develop/packages/insomnia/src/common/markdown-to-html.ts
Signals: N/A
Excerpt (<=80 chars):  export const markdownToHTML = (input: string) => dompurify.sanitize(marked.p...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- markdownToHTML
```

--------------------------------------------------------------------------------

---[FILE: mcp-utils.ts]---
Location: insomnia-develop/packages/insomnia/src/common/mcp-utils.ts
Signals: N/A
Excerpt (<=80 chars): export const METHOD_INITIALIZE = InitializeRequestSchema.shape.method.value;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- METHOD_INITIALIZE
- METHOD_LIST_TOOLS
- METHOD_LIST_RESOURCES
- METHOD_LIST_RESOURCE_TEMPLATES
- METHOD_LIST_PROMPTS
- METHOD_CALL_TOOL
- METHOD_READ_RESOURCE
- METHOD_GET_PROMPT
- METHOD_SUBSCRIBE_RESOURCE
- METHOD_UNSUBSCRIBE_RESOURCE
- METHOD_SAMPLING_CREATE_MESSAGE
- METHOD_LIST_ROOTS
- METHOD_ELICITATION_CREATE_MESSAGE
- METHOD_NOTIFICATION_CANCELLED
- METHOD_NOTIFICATION_PROGRESS
- METHOD_NOTIFICATION_LOGGING_MESSAGE
- METHOD_NOTIFICATION_RESOURCE_UPDATED
- METHOD_NOTIFICATION_RESOURCE_LIST_CHANGED
```

--------------------------------------------------------------------------------

---[FILE: misc.ts]---
Location: insomnia-develop/packages/insomnia/src/common/misc.ts
Signals: N/A
Excerpt (<=80 chars):  export function filterHeaders<T extends { name: string; value: string }>(hea...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getSetCookieHeaders
- generateId
- delay
- describeByteSize
- fnOrString
- compressObject
- escapeRegex
- fuzzyMatch
- fuzzyMatchAll
- unescapeForwardSlash
- cannotAccessPathError
- debounce
- toKebabCase
- DefaultBrowserRedirectParam
- FuzzyMatchOptions
```

--------------------------------------------------------------------------------

---[FILE: project.ts]---
Location: insomnia-develop/packages/insomnia/src/common/project.ts
Signals: N/A
Excerpt (<=80 chars): export const projectLock = lockGenerator();

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- projectLock
```

--------------------------------------------------------------------------------

---[FILE: select-file-or-folder.ts]---
Location: insomnia-develop/packages/insomnia/src/common/select-file-or-folder.ts
Signals: N/A
Excerpt (<=80 chars):  export const selectFileOrFolder = async ({ itemTypes, extensions }: Options)...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- selectFileOrFolder
```

--------------------------------------------------------------------------------

---[FILE: sentry.ts]---
Location: insomnia-develop/packages/insomnia/src/common/sentry.ts
Signals: N/A
Excerpt (<=80 chars):  export const APP_START_TIME = performance.now();

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- APP_START_TIME
```

--------------------------------------------------------------------------------

---[FILE: settings.ts]---
Location: insomnia-develop/packages/insomnia/src/common/settings.ts
Signals: N/A
Excerpt (<=80 chars): export interface KeyboardShortcutDefinition {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HttpVersions
- KeyboardShortcut
- HotKeyRegistry
- HttpVersion
- SettingsOfType
- PluginConfigMap
- KeyboardShortcutDefinition
- KeyCombination
- PlatformKeyCombinations
- PluginConfig
- Settings
```

--------------------------------------------------------------------------------

---[FILE: significant-diff-detection.ts]---
Location: insomnia-develop/packages/insomnia/src/common/significant-diff-detection.ts
Signals: N/A
Excerpt (<=80 chars): export function hasSignificantChanges(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- hasSignificantChanges
```

--------------------------------------------------------------------------------

---[FILE: strings.ts]---
Location: insomnia-develop/packages/insomnia/src/common/strings.ts
Signals: N/A
Excerpt (<=80 chars): export interface StringInfo {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- StringInfo
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: insomnia-develop/packages/insomnia/src/common/insomnia-schema-migrations/index.ts
Signals: N/A
Excerpt (<=80 chars): export function migrateToLatestYaml(yamlContent?: string, referenceContent?: ...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- migrateToLatestYaml
```

--------------------------------------------------------------------------------

---[FILE: schema-version.ts]---
Location: insomnia-develop/packages/insomnia/src/common/insomnia-schema-migrations/schema-version.ts
Signals: N/A
Excerpt (<=80 chars): export const INSOMNIA_SCHEMA_VERSION = '5.1';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- INSOMNIA_SCHEMA_VERSION
```

--------------------------------------------------------------------------------

---[FILE: v5.1.ts]---
Location: insomnia-develop/packages/insomnia/src/common/insomnia-schema-migrations/v5.1.ts
Signals: N/A
Excerpt (<=80 chars): export function normalizeScripts(scripts: any): any {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- normalizeScripts
- cleanHeadersAndParameters
```

--------------------------------------------------------------------------------

---[FILE: import-v5-parser.test.ts]---
Location: insomnia-develop/packages/insomnia/src/common/__tests__/import-v5-parser.test.ts
Signals: Zod
Excerpt (<=80 chars): import { beforeAll, describe, expect, it } from 'vitest';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: api.protocol.ts]---
Location: insomnia-develop/packages/insomnia/src/main/api.protocol.ts
Signals: N/A
Excerpt (<=80 chars):  export interface RegisterProtocolOptions {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RegisterProtocolOptions
```

--------------------------------------------------------------------------------

---[FILE: authorize-user-in-default-browser.ts]---
Location: insomnia-develop/packages/insomnia/src/main/authorize-user-in-default-browser.ts
Signals: N/A
Excerpt (<=80 chars):  export function onDefaultBrowserOAuthRedirect(param: DefaultBrowserRedirectP...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- onDefaultBrowserOAuthRedirect
- cancelAuthorizationInDefaultBrowser
```

--------------------------------------------------------------------------------

---[FILE: authorize-user-in-window.ts]---
Location: insomnia-develop/packages/insomnia/src/main/authorize-user-in-window.ts
Signals: N/A
Excerpt (<=80 chars):  export function authorizeUserInWindow({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- authorizeUserInWindow
```

--------------------------------------------------------------------------------

---[FILE: git-service.ts]---
Location: insomnia-develop/packages/insomnia/src/main/git-service.ts
Signals: N/A
Excerpt (<=80 chars): export function getErrorMessage(error: unknown): string {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getErrorMessage
- vcsSegmentEventProperties
- parseGitToHttpsURL
- getGitBranches
- gitFetchAction
- gitLogLoader
- gitChangesLoader
- canPushLoader
- initGitRepoCloneAction
- cloneGitRepoAction
- updateGitRepoAction
- resetGitRepoAction
- commitToGitRepoAction
- multipleCommitToGitRepoAction
- migrateLegacyInsomniaFolderToFile
- commitAndPushToGitRepoAction
- createNewGitBranchAction
- checkoutGitBranchAction
```

--------------------------------------------------------------------------------

---[FILE: install-plugin.ts]---
Location: insomnia-develop/packages/insomnia/src/main/install-plugin.ts
Signals: N/A
Excerpt (<=80 chars): export const execFilePromise = promisify(execFile);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- containsOnlyDeprecationWarnings
- hasUnexpectedBinaryData
- safeTrim
- buildProxyEnv
- isValidProxyUrl
- execFilePromise
```

--------------------------------------------------------------------------------

---[FILE: llm-config-service.ts]---
Location: insomnia-develop/packages/insomnia/src/main/llm-config-service.ts
Signals: N/A
Excerpt (<=80 chars):  export type LLMBackend = (typeof LLM_BACKENDS)[number];

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getActiveBackend
- setActiveBackend
- clearActiveBackend
- getBackendConfig
- updateBackendConfig
- getAllConfigurations
- getCurrentConfig
- getAIFeatureEnabled
- setAIFeatureEnabled
- registerLLMConfigServiceAPI
- LLMBackend
- AIFeatureNames
- LLMConfig
- LLMConfigServiceAPI
```

--------------------------------------------------------------------------------

---[FILE: log.ts]---
Location: insomnia-develop/packages/insomnia/src/main/log.ts
Signals: N/A
Excerpt (<=80 chars):  export const initializeLogging = () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getLogDirectory
- initializeLogging
```

--------------------------------------------------------------------------------

---[FILE: multipart-buffer-to-array.ts]---
Location: insomnia-develop/packages/insomnia/src/main/multipart-buffer-to-array.ts
Signals: N/A
Excerpt (<=80 chars):  export interface Part {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- multipartBufferToArray
- Part
```

--------------------------------------------------------------------------------

---[FILE: secure-read-file.ts]---
Location: insomnia-develop/packages/insomnia/src/main/secure-read-file.ts
Signals: N/A
Excerpt (<=80 chars):  export const isPathAllowed = (filePath: string, userAllowList: string[]) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isPathAllowed
- secureReadFile
- insecureReadFile
- insecureReadFileWithEncoding
```

--------------------------------------------------------------------------------

---[FILE: sentry.ts]---
Location: insomnia-develop/packages/insomnia/src/main/sentry.ts
Signals: N/A
Excerpt (<=80 chars): export function sentryWatchAnalyticsEnabled() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- sentryWatchAnalyticsEnabled
- initializeSentry
```

--------------------------------------------------------------------------------

---[FILE: squirrel-startup.ts]---
Location: insomnia-develop/packages/insomnia/src/main/squirrel-startup.ts
Signals: N/A
Excerpt (<=80 chars):  export function checkIfRestartNeeded() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- checkIfRestartNeeded
```

--------------------------------------------------------------------------------

---[FILE: templating-worker-database.ts]---
Location: insomnia-develop/packages/insomnia/src/main/templating-worker-database.ts
Signals: N/A
Excerpt (<=80 chars):  export const resolveDbByKey = async (request: Request) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- resolveDbByKey
```

--------------------------------------------------------------------------------

---[FILE: updates.ts]---
Location: insomnia-develop/packages/insomnia/src/main/updates.ts
Signals: N/A
Excerpt (<=80 chars): export const getUpdateUrl = (updateChannel: string): string | null => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getUpdateUrl
- init
```

--------------------------------------------------------------------------------

---[FILE: window-utils.ts]---
Location: insomnia-develop/packages/insomnia/src/main/window-utils.ts
Signals: N/A
Excerpt (<=80 chars):  export function init() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- init
- stopHiddenBrowserWindow
- createWindow
- initElectronStorage
- createWindowsAndReturnMain
- setZoom
```

--------------------------------------------------------------------------------

---[FILE: convert.ts]---
Location: insomnia-develop/packages/insomnia/src/main/importers/convert.ts
Signals: N/A
Excerpt (<=80 chars):  export interface InsomniaImporter {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- dotInKeyNameInvariant
- convert
- InsomniaImporter
- ConvertResult
```

--------------------------------------------------------------------------------

---[FILE: entities.ts]---
Location: insomnia-develop/packages/insomnia/src/main/importers/entities.ts
Signals: N/A
Excerpt (<=80 chars):  export interface Comment {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Variable
- Body
- ImportRequestType
- Converter
- FilePathConverter
- Importer
- Comment
- Authentication
- Parameter
- PathParameters
- Cookie
- Header
- QueryString
- ImportRequest
- ImportEntry
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: insomnia-develop/packages/insomnia/src/main/importers/utils.ts
Signals: N/A
Excerpt (<=80 chars):  export const setDefaults = (obj: ImportRequest | null) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- setDefaults
- unthrowableParseJson
```

--------------------------------------------------------------------------------

---[FILE: curl.ts]---
Location: insomnia-develop/packages/insomnia/src/main/importers/importers/curl.ts
Signals: N/A
Excerpt (<=80 chars):  export const id = 'curl';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- id
- name
- description
```

--------------------------------------------------------------------------------

---[FILE: har.ts]---
Location: insomnia-develop/packages/insomnia/src/main/importers/importers/har.ts
Signals: N/A
Excerpt (<=80 chars):  export const id = 'har';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- id
- name
- description
```

--------------------------------------------------------------------------------

---[FILE: insomnia-1.ts]---
Location: insomnia-develop/packages/insomnia/src/main/importers/importers/insomnia-1.ts
Signals: N/A
Excerpt (<=80 chars):  export const id = 'insomnia-1';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- id
- name
- description
- Insomnia1Data
```

--------------------------------------------------------------------------------

---[FILE: insomnia-2.ts]---
Location: insomnia-develop/packages/insomnia/src/main/importers/importers/insomnia-2.ts
Signals: N/A
Excerpt (<=80 chars):  export const id = 'insomnia-2';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- id
- name
- description
- Insomnia2Data
```

--------------------------------------------------------------------------------

---[FILE: insomnia-3.ts]---
Location: insomnia-develop/packages/insomnia/src/main/importers/importers/insomnia-3.ts
Signals: N/A
Excerpt (<=80 chars):  export const id = 'insomnia-3';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- id
- name
- description
- Insomnia3Data
```

--------------------------------------------------------------------------------

---[FILE: insomnia-4.ts]---
Location: insomnia-develop/packages/insomnia/src/main/importers/importers/insomnia-4.ts
Signals: N/A
Excerpt (<=80 chars):  export const id = 'insomnia-4';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- id
- name
- description
- Insomnia4Data
```

--------------------------------------------------------------------------------

---[FILE: openapi-3.ts]---
Location: insomnia-develop/packages/insomnia/src/main/importers/importers/openapi-3.ts
Signals: N/A
Excerpt (<=80 chars):  export const id = 'openapi3';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- id
- name
- description
- SpecExtension
```

--------------------------------------------------------------------------------

---[FILE: postman-2.0.types.ts]---
Location: insomnia-develop/packages/insomnia/src/main/importers/importers/postman-2.0.types.ts
Signals: N/A
Excerpt (<=80 chars): export type NameOfTheCollection = string;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NameOfTheCollection
- DefinitionsDescription
- CollectionVersion
- Items
- Variable
- Variable1
- VariableList
- Url
- Host
- EventList
- Request
- HeaderList
- FormParameter
- ResponseTime
- ResponseTimings
- Headers
- Header2
- Header1
```

--------------------------------------------------------------------------------

---[FILE: postman-2.1.types.ts]---
Location: insomnia-develop/packages/insomnia/src/main/importers/importers/postman-2.1.types.ts
Signals: N/A
Excerpt (<=80 chars): export type NameOfTheCollection = string;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NameOfTheCollection
- DefinitionsDescription
- CollectionVersion
- Items
- Variable
- Variable1
- VariableList
- Url
- Host
- EventList
- Request
- APIKeyAuthentication
- AWSSignatureV4
- BasicAuthentication
- BearerTokenAuthentication
- DigestAuthentication
- EdgeGridAuthentication
- HawkAuthentication
```

--------------------------------------------------------------------------------

---[FILE: postman-env.ts]---
Location: insomnia-develop/packages/insomnia/src/main/importers/importers/postman-env.ts
Signals: N/A
Excerpt (<=80 chars):  export const id = 'postman-environment';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- id
- name
- description
```

--------------------------------------------------------------------------------

---[FILE: postman.ts]---
Location: insomnia-develop/packages/insomnia/src/main/importers/importers/postman.ts
Signals: N/A
Excerpt (<=80 chars):  export const id = 'postman';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- id
- name
- description
- transformPostmanToNunjucksString
- normaliseJsonPath
- ImportPostman
```

--------------------------------------------------------------------------------

---[FILE: swagger-2.ts]---
Location: insomnia-develop/packages/insomnia/src/main/importers/importers/swagger-2.ts
Signals: N/A
Excerpt (<=80 chars): export const id = 'swagger2';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- id
- name
- description
```

--------------------------------------------------------------------------------

---[FILE: translate-postman-script.ts]---
Location: insomnia-develop/packages/insomnia/src/main/importers/importers/translate-postman-script.ts
Signals: N/A
Excerpt (<=80 chars): export interface TransformRule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- translateHandlersInScript
- TransformRule
```

--------------------------------------------------------------------------------

---[FILE: wsdl.ts]---
Location: insomnia-develop/packages/insomnia/src/main/importers/importers/wsdl.ts
Signals: N/A
Excerpt (<=80 chars):  export const id = 'wsdl';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- id
- name
- description
- acceptFilePath
```

--------------------------------------------------------------------------------

---[FILE: automock.ts]---
Location: insomnia-develop/packages/insomnia/src/main/ipc/automock.ts
Signals: N/A
Excerpt (<=80 chars):  export interface MethodPayload {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mockResponseMethods
- mockRequestMethods
- ServiceMethodsPayload
- MethodPayload
```

--------------------------------------------------------------------------------

---[FILE: electron.ts]---
Location: insomnia-develop/packages/insomnia/src/main/ipc/electron.ts
Signals: N/A
Excerpt (<=80 chars):  export type HandleChannels =

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- registerElectronHandlers
- ipcMainHandle
- ipcMainOn
- ipcMainOnce
- HandleChannels
- MainOnChannels
- RendererOnChannels
- OnceChannels
```

--------------------------------------------------------------------------------

---[FILE: grpc.ts]---
Location: insomnia-develop/packages/insomnia/src/main/ipc/grpc.ts
Signals: N/A
Excerpt (<=80 chars):  export interface GrpcIpcRequestParams {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- registergRPCHandlers
- loadMethodsFromReflection
- getMethodType
- getSelectedMethod
- getMethodsFromPackageDefinition
- start
- sendMessage
- commit
- cancel
- GrpcMethodType
- GrpcIpcRequestParams
- GrpcIpcMessageParams
- gRPCBridgeAPI
- GrpcMethodInfo
```

--------------------------------------------------------------------------------

---[FILE: main.ts]---
Location: insomnia-develop/packages/insomnia/src/main/ipc/main.ts
Signals: N/A
Excerpt (<=80 chars):  export const openInBrowser = (href: string) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- registerMainHandlers
- openInBrowser
- RendererToMainBridgeAPI
```

--------------------------------------------------------------------------------

---[FILE: path.ts]---
Location: insomnia-develop/packages/insomnia/src/main/ipc/path.ts
Signals: N/A
Excerpt (<=80 chars):  export function registerPathHandlers() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- registerPathHandlers
```

--------------------------------------------------------------------------------

---[FILE: secret-storage.ts]---
Location: insomnia-develop/packages/insomnia/src/main/ipc/secret-storage.ts
Signals: N/A
Excerpt (<=80 chars):  export interface secretStorageBridgeAPI {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- registerSecretStorageHandlers
- secretStorageBridgeAPI
```

--------------------------------------------------------------------------------

---[FILE: client-requests.ts]---
Location: insomnia-develop/packages/insomnia/src/main/mcp/client-requests.ts
Signals: N/A
Excerpt (<=80 chars):  export const listTools = async (options: CommonMcpOptions) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- listTools
- callTool
- listPrompts
- getPrompt
- listResources
- listResourceTemplates
- readResource
- subscribeResource
- unsubscribeResource
- sendRootListChangeNotification
- responseElicitationRequest
- responseSamplingRequest
```

--------------------------------------------------------------------------------

---[FILE: common.ts]---
Location: insomnia-develop/packages/insomnia/src/main/mcp/common.ts
Signals: N/A
Excerpt (<=80 chars):  export const protocol = 'mcp';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- updateMcpConnectionState
- protocol
- activeConnectionContexts
- isContextReady
- createConnectionContext
- clearConnectionContext
- getReadyActiveMcpConnectionContext
- isActiveConnectionContext
- getActiveMcpClient
- writeTimeline
- writeEventLogAndNotify
- parseAndLogMcpRequest
- findMany
- findNotifications
- findPendingEvents
- getMcpReadyState
- hasRequestResponded
- setAbortControllerForMcpRequest
```

--------------------------------------------------------------------------------

---[FILE: oauth-client-provider.ts]---
Location: insomnia-develop/packages/insomnia/src/main/mcp/oauth-client-provider.ts
Signals: N/A
Excerpt (<=80 chars):  export class MCPAuthError extends Error {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isMCPAuthError
- MCPAuthError
- McpOAuthClientProvider
```

--------------------------------------------------------------------------------

---[FILE: transport-stdio.ts]---
Location: insomnia-develop/packages/insomnia/src/main/mcp/transport-stdio.ts
Signals: N/A
Excerpt (<=80 chars):  export const createStdioTransport = async (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createStdioTransport
```

--------------------------------------------------------------------------------

---[FILE: transport-streamable-http.ts]---
Location: insomnia-develop/packages/insomnia/src/main/mcp/transport-streamable-http.ts
Signals: N/A
Excerpt (<=80 chars):  export const createStreamableHTTPTransport = async (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createStreamableHTTPTransport
```

--------------------------------------------------------------------------------

````
