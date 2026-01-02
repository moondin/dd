---
source_txt: fullstack_samples/insomnia-develop
converted_utc: 2025-12-18T10:36:55Z
part: 10
parts_total: 10
---

# FULLSTACK CODE DATABASE SAMPLES insomnia-develop

## Extracted Reusable Patterns (Non-verbatim) (Part 10 of 10)

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

---[FILE: index.ts]---
Location: insomnia-develop/packages/insomnia-component-docs/src/theme/ReactLiveScope/index.ts
Signals: React
Excerpt (<=80 chars): import { Banner } from 'insomnia/src/basic-components/banner';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: cli.test.ts]---
Location: insomnia-develop/packages/insomnia-inso/src/cli.test.ts
Signals: N/A
Excerpt (<=80 chars): export const runCliFromRoot = (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- runCliFromRoot
```

--------------------------------------------------------------------------------

---[FILE: cli.ts]---
Location: insomnia-develop/packages/insomnia-inso/src/cli.ts
Signals: N/A
Excerpt (<=80 chars):  export interface GlobalOptions {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getAppDataDir
- tryToReadInsoConfigFile
- logger
- getDefaultProductName
- getAbsoluteFilePath
- logErrorAndExit
- go
- InsoError
- LogsByType
- ModifiedConsola
- GlobalOptions
```

--------------------------------------------------------------------------------

---[FILE: lint-specification.ts]---
Location: insomnia-develop/packages/insomnia-inso/src/commands/lint-specification.ts
Signals: N/A
Excerpt (<=80 chars): export const getRuleSetFileFromFolderByFilename = async (filePath: string) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getRuleSetFileFromFolderByFilename
```

--------------------------------------------------------------------------------

---[FILE: result-report.ts]---
Location: insomnia-develop/packages/insomnia-inso/src/commands/run-collection/result-report.ts
Signals: N/A
Excerpt (<=80 chars):  export class RunCollectionResultReport {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RunCollectionResultReport
```

--------------------------------------------------------------------------------

---[FILE: insomnia-send-request.ts]---
Location: insomnia-develop/packages/insomnia-inso/src/commands/__mocks__/insomnia-send-request.ts
Signals: N/A
Excerpt (<=80 chars):  export const getSendRequestCallbackMemDb = vi.fn().mockResolvedValue(vi.fn());

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getSendRequestCallbackMemDb
```

--------------------------------------------------------------------------------

---[FILE: insomnia-testing.ts]---
Location: insomnia-develop/packages/insomnia-inso/src/commands/__mocks__/insomnia-testing.ts
Signals: N/A
Excerpt (<=80 chars):  export const generate = vi.fn();

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- generate
- generateToFile
- runTests
- runTestsCli
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: insomnia-develop/packages/insomnia-inso/src/db/index.ts
Signals: N/A
Excerpt (<=80 chars):  export interface Database {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- emptyDb
- isFile
- loadDb
- DbAdapter
- Database
```

--------------------------------------------------------------------------------

---[FILE: insomnia-adapter.ts]---
Location: insomnia-develop/packages/insomnia-inso/src/db/adapters/insomnia-adapter.ts
Signals: N/A
Excerpt (<=80 chars): export const insomniaExportAdapter = insomniaAdapter;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- insomniaExportAdapter
```

--------------------------------------------------------------------------------

---[FILE: api-spec.ts]---
Location: insomnia-develop/packages/insomnia-inso/src/db/models/api-spec.ts
Signals: N/A
Excerpt (<=80 chars):  export const loadApiSpec = (db: Database, identifier: string): ApiSpec | nul...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- loadApiSpec
- promptApiSpec
```

--------------------------------------------------------------------------------

---[FILE: environment.ts]---
Location: insomnia-develop/packages/insomnia-inso/src/db/models/environment.ts
Signals: N/A
Excerpt (<=80 chars):  export const loadEnvironment = (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- loadEnvironment
- promptEnvironment
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: insomnia-develop/packages/insomnia-inso/src/db/models/types.ts
Signals: N/A
Excerpt (<=80 chars):  export interface BaseModel {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ApiSpec
- UnitTestSuite
- UnitTest
- Environment
- WorkspaceMeta
- Workspace
- InsomniaRequest
- BaseModel
- BaseApiSpec
```

--------------------------------------------------------------------------------

---[FILE: unit-test-suite.ts]---
Location: insomnia-develop/packages/insomnia-inso/src/db/models/unit-test-suite.ts
Signals: N/A
Excerpt (<=80 chars):  export const loadUnitTestSuite = (db: Database, identifier: string): UnitTes...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- loadUnitTestSuite
- loadTestSuites
- promptTestSuites
```

--------------------------------------------------------------------------------

---[FILE: util.ts]---
Location: insomnia-develop/packages/insomnia-inso/src/db/models/util.ts
Signals: N/A
Excerpt (<=80 chars):  export const matchIdIsh = ({ _id }: BaseModel, identifier: string) => _id.st...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- matchIdIsh
- generateIdIsh
- getDbChoice
- ensureSingleOrNone
- ensureSingle
```

--------------------------------------------------------------------------------

---[FILE: workspace.ts]---
Location: insomnia-develop/packages/insomnia-inso/src/db/models/workspace.ts
Signals: N/A
Excerpt (<=80 chars): export const loadWorkspace = (db: Database, identifier: string) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- loadWorkspace
- promptWorkspace
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: insomnia-develop/packages/insomnia-inso/src/reporter/index.ts
Signals: N/A
Excerpt (<=80 chars):  export const reporterTypes = ['dot', 'list', 'min', 'progress', 'spec', 'tap...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- reporterTypes
- logTestResult
- logTestResultSummary
- TestReporter
```

--------------------------------------------------------------------------------

---[FILE: docs.ts]---
Location: insomnia-develop/packages/insomnia-inso/src/scripts/docs.ts
Signals: N/A
Excerpt (<=80 chars):  export function generateCommandMarkdown(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- generateCommandMarkdown
- generateDocumentation
```

--------------------------------------------------------------------------------

---[FILE: async-objects.ts]---
Location: insomnia-develop/packages/insomnia-scripting-environment/src/objects/async-objects.ts
Signals: N/A
Excerpt (<=80 chars): export const OriginalPromise = Promise;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OriginalPromise
- asyncTasksAllSettled
- stopMonitorAsyncTasks
- resetAsyncTasks
- ProxiedPromise
```

--------------------------------------------------------------------------------

---[FILE: auth.ts]---
Location: insomnia-develop/packages/insomnia-scripting-environment/src/objects/auth.ts
Signals: N/A
Excerpt (<=80 chars):  export type AuthOptionTypes =

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- authOptionsToParams
- fromPreRequestAuth
- toPreRequestAuth
- AuthTypes
- RequestAuth
- AuthOptionTypes
- AuthOption
- OAuth2AuthOption
- BasicOptions
- BearerOptions
- JWTOptions
- DigestOptions
- OAuth1Options
- OAuth2Param
- OAuth2Options
- HAWKOptions
- AWSV4Options
- NTLMOptions
```

--------------------------------------------------------------------------------

---[FILE: certificates.ts]---
Location: insomnia-develop/packages/insomnia-scripting-environment/src/objects/certificates.ts
Signals: N/A
Excerpt (<=80 chars):  export interface SrcRef {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Certificate
- SrcRef
- CertificateOptions
```

--------------------------------------------------------------------------------

---[FILE: console.ts]---
Location: insomnia-develop/packages/insomnia-scripting-environment/src/objects/console.ts
Signals: N/A
Excerpt (<=80 chars): export interface Row {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getExistingConsole
- getNewConsole
- Console
- Row
```

--------------------------------------------------------------------------------

---[FILE: cookies.ts]---
Location: insomnia-develop/packages/insomnia-scripting-environment/src/objects/cookies.ts
Signals: N/A
Excerpt (<=80 chars):  export interface InsomniaCookieExtensions {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mergeCookieJar
- Cookie
- CookieList
- CookieObject
- CookieJar
- InsomniaCookieExtensions
- CookieOptions
```

--------------------------------------------------------------------------------

---[FILE: environments.ts]---
Location: insomnia-develop/packages/insomnia-scripting-environment/src/objects/environments.ts
Signals: N/A
Excerpt (<=80 chars): export class Environment {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Environment
- Variables
- Vault
```

--------------------------------------------------------------------------------

---[FILE: execution.ts]---
Location: insomnia-develop/packages/insomnia-scripting-environment/src/objects/execution.ts
Signals: N/A
Excerpt (<=80 chars): export interface ExecutionOption {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Execution
- ExecutionOption
```

--------------------------------------------------------------------------------

---[FILE: folders.ts]---
Location: insomnia-develop/packages/insomnia-scripting-environment/src/objects/folders.ts
Signals: N/A
Excerpt (<=80 chars): export class Folder {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Folder
- ParentFolders
```

--------------------------------------------------------------------------------

---[FILE: headers.ts]---
Location: insomnia-develop/packages/insomnia-scripting-environment/src/objects/headers.ts
Signals: N/A
Excerpt (<=80 chars): export interface HeaderDefinition {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Header
- HeaderList
- HeaderDefinition
```

--------------------------------------------------------------------------------

---[FILE: insomnia.ts]---
Location: insomnia-develop/packages/insomnia-scripting-environment/src/objects/insomnia.ts
Signals: N/A
Excerpt (<=80 chars):  export class InsomniaObject {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InsomniaObject
```

--------------------------------------------------------------------------------

---[FILE: interfaces.ts]---
Location: insomnia-develop/packages/insomnia-scripting-environment/src/objects/interfaces.ts
Signals: N/A
Excerpt (<=80 chars): export interface IEnvironment {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IEnvironment
- RequestContext
```

--------------------------------------------------------------------------------

---[FILE: interpolator.ts]---
Location: insomnia-develop/packages/insomnia-scripting-environment/src/objects/interpolator.ts
Signals: N/A
Excerpt (<=80 chars): export function getInterpolator() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getInterpolator
```

--------------------------------------------------------------------------------

---[FILE: properties.ts]---
Location: insomnia-develop/packages/insomnia-scripting-environment/src/objects/properties.ts
Signals: N/A
Excerpt (<=80 chars):  export const unsupportedError = (featureName: string, alternative?: string) ...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- unsupportedError
- PropertyBase
- Property
- PropertyList
```

--------------------------------------------------------------------------------

---[FILE: proxy-configs.ts]---
Location: insomnia-develop/packages/insomnia-scripting-environment/src/objects/proxy-configs.ts
Signals: N/A
Excerpt (<=80 chars): export interface ProxyConfigOptions {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- transformToSdkProxyOptions
- ProxyConfig
- ProxyConfigList
- ProxyConfigOptions
```

--------------------------------------------------------------------------------

---[FILE: request-info.ts]---
Location: insomnia-develop/packages/insomnia-scripting-environment/src/objects/request-info.ts
Signals: N/A
Excerpt (<=80 chars): export type EventName = 'prerequest' | 'test';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RequestInfo
- EventName
- RequestInfoOption
```

--------------------------------------------------------------------------------

---[FILE: request.ts]---
Location: insomnia-develop/packages/insomnia-scripting-environment/src/objects/request.ts
Signals: N/A
Excerpt (<=80 chars):  export type RequestBodyMode = undefined | 'formdata' | 'urlencoded' | 'raw' ...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mergeSettings
- mergeClientCertificates
- toScriptRequestBody
- mergeRequestBody
- mergeRequests
- calculatePayloadSize
- calculateHeadersSize
- FormParam
- RequestBody
- Request
- RequestBodyMode
- RequestBodyOptions
- RequestOptions
- RequestSize
```

--------------------------------------------------------------------------------

---[FILE: response.ts]---
Location: insomnia-develop/packages/insomnia-scripting-environment/src/objects/response.ts
Signals: N/A
Excerpt (<=80 chars):  export interface ResponseOptions {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- toScriptResponse
- Response
- ResponseOptions
- ResponseContentInfo
```

--------------------------------------------------------------------------------

---[FILE: test.ts]---
Location: insomnia-develop/packages/insomnia-scripting-environment/src/objects/test.ts
Signals: N/A
Excerpt (<=80 chars): export type TestStatus = 'passed' | 'failed' | 'skipped';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestStatus
- TestCategory
- RequestTestResult
- TestHandler
```

--------------------------------------------------------------------------------

---[FILE: urls.ts]---
Location: insomnia-develop/packages/insomnia-scripting-environment/src/objects/urls.ts
Signals: N/A
Excerpt (<=80 chars): export function setUrlSearchParams(provider: any) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- setUrlSearchParams
- toUrlObject
- QueryParam
- Url
- UrlMatchPattern
- UrlMatchPatternList
- QueryParamOptions
- UrlOptions
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: insomnia-develop/packages/insomnia-scripting-environment/src/objects/utils.ts
Signals: N/A
Excerpt (<=80 chars): export function checkIfUrlIncludesTag(url: string): boolean {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- checkIfUrlIncludesTag
```

--------------------------------------------------------------------------------

---[FILE: variables.ts]---
Location: insomnia-develop/packages/insomnia-scripting-environment/src/objects/variables.ts
Signals: N/A
Excerpt (<=80 chars): export interface VariableDefinition {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Variable
- VariableList
- VariableDefinition
```

--------------------------------------------------------------------------------

---[FILE: execution.test.ts]---
Location: insomnia-develop/packages/insomnia-scripting-environment/src/objects/__tests__/execution.test.ts
Signals: Next.js
Excerpt (<=80 chars): import { describe, expect, it } from 'vitest';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: insomnia-develop/packages/insomnia-smoke-test/fixtures/constants.ts
Signals: N/A
Excerpt (<=80 chars):  export const basicAuthCreds = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- basicAuthCreds
```

--------------------------------------------------------------------------------

---[FILE: paths.ts]---
Location: insomnia-develop/packages/insomnia-smoke-test/playwright/paths.ts
Signals: N/A
Excerpt (<=80 chars): export const bundleType = () => process.env.BUNDLE || 'dev';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- bundleType
- getFixturePath
- loadFixture
- copyFixtureDatabase
- randomDataPath
- INSOMNIA_DATA_PATH
- cwd
- executablePath
- mainPath
```

--------------------------------------------------------------------------------

---[FILE: test.ts]---
Location: insomnia-develop/packages/insomnia-smoke-test/playwright/test.ts
Signals: N/A
Excerpt (<=80 chars): export function invariant(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- invariant
- test
```

--------------------------------------------------------------------------------

---[FILE: basic-auth.ts]---
Location: insomnia-develop/packages/insomnia-smoke-test/server/basic-auth.ts
Signals: Express
Excerpt (<=80 chars):  export const basicAuthRouter = express.Router();

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- basicAuthRouter
```

--------------------------------------------------------------------------------

---[FILE: github-api.ts]---
Location: insomnia-develop/packages/insomnia-smoke-test/server/github-api.ts
Signals: Express
Excerpt (<=80 chars): import type { Application } from 'express';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: gitlab-api.ts]---
Location: insomnia-develop/packages/insomnia-smoke-test/server/gitlab-api.ts
Signals: Express
Excerpt (<=80 chars): import type { Application } from 'express';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: graphql.ts]---
Location: insomnia-develop/packages/insomnia-smoke-test/server/graphql.ts
Signals: N/A
Excerpt (<=80 chars):  export const schema = new GraphQLSchema({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- schema
```

--------------------------------------------------------------------------------

---[FILE: grpc.ts]---
Location: insomnia-develop/packages/insomnia-smoke-test/server/grpc.ts
Signals: N/A
Excerpt (<=80 chars): export const startGRPCServer = (port: number) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- startGRPCServer
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: insomnia-develop/packages/insomnia-smoke-test/server/index.ts
Signals: Express
Excerpt (<=80 chars): import crypto from 'node:crypto';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: insomnia-api.ts]---
Location: insomnia-develop/packages/insomnia-smoke-test/server/insomnia-api.ts
Signals: Express
Excerpt (<=80 chars): import { randomUUID } from 'node:crypto';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: mtls.ts]---
Location: insomnia-develop/packages/insomnia-smoke-test/server/mtls.ts
Signals: Express
Excerpt (<=80 chars):  export const mtlsRouter = express.Router();

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mtlsRouter
```

--------------------------------------------------------------------------------

---[FILE: oauth.ts]---
Location: insomnia-develop/packages/insomnia-smoke-test/server/oauth.ts
Signals: Express
Excerpt (<=80 chars):  export const oauthRoutes = async (port: number) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- oauthRoutes
```

--------------------------------------------------------------------------------

---[FILE: simple-crud.ts]---
Location: insomnia-develop/packages/insomnia-smoke-test/server/simple-crud.ts
Signals: Express
Excerpt (<=80 chars): import express from 'express';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: socket-io.ts]---
Location: insomnia-develop/packages/insomnia-smoke-test/server/socket-io.ts
Signals: Express
Excerpt (<=80 chars):  export function startSocketIOServer() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- startSocketIOServer
```

--------------------------------------------------------------------------------

---[FILE: websocket.ts]---
Location: insomnia-develop/packages/insomnia-smoke-test/server/websocket.ts
Signals: N/A
Excerpt (<=80 chars): export function startWebSocketServer(server: Server) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- startWebSocketServer
```

--------------------------------------------------------------------------------

---[FILE: test-utils.ts]---
Location: insomnia-develop/packages/insomnia-smoke-test/tests/smoke/test-utils.ts
Signals: N/A
Excerpt (<=80 chars): export function getUserEmail() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getUserEmail
- getRandomId
- getTeamName
```

--------------------------------------------------------------------------------

---[FILE: generate.ts]---
Location: insomnia-develop/packages/insomnia-testing/src/generate/generate.ts
Signals: N/A
Excerpt (<=80 chars):  export interface Test {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- generate
- generateToFile
- Test
- TestSuite
```

--------------------------------------------------------------------------------

---[FILE: util.ts]---
Location: insomnia-develop/packages/insomnia-testing/src/generate/util.ts
Signals: N/A
Excerpt (<=80 chars): export const escapeJsStr = (s: string) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- escapeJsStr
- indent
```

--------------------------------------------------------------------------------

---[FILE: entities.ts]---
Location: insomnia-develop/packages/insomnia-testing/src/run/entities.ts
Signals: N/A
Excerpt (<=80 chars):  export interface TestResult {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestResult
- TestResults
```

--------------------------------------------------------------------------------

---[FILE: insomnia.ts]---
Location: insomnia-develop/packages/insomnia-testing/src/run/insomnia.ts
Signals: N/A
Excerpt (<=80 chars): export type SendRequestCallback<TResponse> = (requestId: string) => Promise<T...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Insomnia
- SendRequestCallback
- InsomniaOptions
```

--------------------------------------------------------------------------------

---[FILE: javascript-reporter.ts]---
Location: insomnia-develop/packages/insomnia-testing/src/run/javascript-reporter.ts
Signals: N/A
Excerpt (<=80 chars):  export class JavaScriptReporter extends reporters.Base {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- JavaScriptReporter
```

--------------------------------------------------------------------------------

---[FILE: run.ts]---
Location: insomnia-develop/packages/insomnia-testing/src/run/run.ts
Signals: N/A
Excerpt (<=80 chars): export const runTestsCli = async <TNetworkResponse>(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- runTestsCli
- runTests
```

--------------------------------------------------------------------------------

````
