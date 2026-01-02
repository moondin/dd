---
source_txt: fullstack_samples/insomnia-develop
converted_utc: 2025-12-18T10:36:55Z
part: 2
parts_total: 10
---

# FULLSTACK CODE DATABASE SAMPLES insomnia-develop

## Extracted Reusable Patterns (Non-verbatim) (Part 2 of 10)

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

---[FILE: types.ts]---
Location: insomnia-develop/packages/insomnia/src/main/mcp/types.ts
Signals: Zod
Excerpt (<=80 chars): export type McpClient = Client & { transport: StreamableHTTPClientTransport |...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- McpClient
- McpMessageEvent
- McpNotificationEvent
- McpEventWithoutBase
- McpEvent
- OpenMcpClientConnectionOptions
- McpReadyState
- McpEventDirection
- McpRequestOptions
- McpEventBase
- McpCloseEventWithoutBase
- McpMessageEventWithoutBase
- McpErrorEventWithoutBase
- McpRequestEventWithoutBase
- McpNotificationEventWithoutBase
- McpAuthEventWithoutBase
- CommonMcpOptions
- OpenMcpStdioClientConnectionOptions
```

--------------------------------------------------------------------------------

---[FILE: curl.ts]---
Location: insomnia-develop/packages/insomnia/src/main/network/curl.ts
Signals: N/A
Excerpt (<=80 chars):  export interface CurlConnection extends Curl {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- registerCurlHandlers
- CurlEvent
- CurlConnection
- CurlOpenEvent
- CurlMessageEvent
- CurlErrorEvent
- CurlCloseEvent
- CurlBridgeAPI
```

--------------------------------------------------------------------------------

---[FILE: libcurl-promise.ts]---
Location: insomnia-develop/packages/insomnia/src/main/network/libcurl-promise.ts
Signals: N/A
Excerpt (<=80 chars): export interface CurlRequestOptions {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- _parseHeaders
- cancelCurlRequest
- curlRequest
- createConfiguredCurlInstance
- getHttpVersion
- setDefaultProtocol
- CurlRequestOptions
- ResponseTimelineEntry
- CurlRequestOutput
- ResponsePatch
- HeaderResult
```

--------------------------------------------------------------------------------

---[FILE: mcp.ts]---
Location: insomnia-develop/packages/insomnia/src/main/network/mcp.ts
Signals: Zod
Excerpt (<=80 chars):  export const isOpenMcpHTTPClientConnectionOptions = (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isOpenMcpHTTPClientConnectionOptions
- registerMcpHandlers
- McpBridgeAPI
```

--------------------------------------------------------------------------------

---[FILE: multipart.ts]---
Location: insomnia-develop/packages/insomnia/src/main/network/multipart.ts
Signals: N/A
Excerpt (<=80 chars):  export const DEFAULT_BOUNDARY = 'X-INSOMNIA-BOUNDARY';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DEFAULT_BOUNDARY
```

--------------------------------------------------------------------------------

---[FILE: parse-header-strings.ts]---
Location: insomnia-develop/packages/insomnia/src/main/network/parse-header-strings.ts
Signals: N/A
Excerpt (<=80 chars): export const parseHeaderStrings = ({ req, finalUrl, requestBody, requestBodyP...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- _getAwsAuthHeaders
- parseHeaderStrings
```

--------------------------------------------------------------------------------

---[FILE: request-timing.ts]---
Location: insomnia-develop/packages/insomnia/src/main/network/request-timing.ts
Signals: N/A
Excerpt (<=80 chars):  export interface TimingStep {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- addExecutionStep
- completeExecutionStep
- updateLatestStepName
- executions
- getExecution
- startExecution
- TimingStep
```

--------------------------------------------------------------------------------

---[FILE: socket-io.ts]---
Location: insomnia-develop/packages/insomnia/src/main/network/socket-io.ts
Signals: N/A
Excerpt (<=80 chars):  export interface SocketIOpenEvent {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- registerSocketIOHandlers
- SocketIOEvent
- SocketIOEventLog
- SocketIOpenEvent
- SocketIOMessageEvent
- SocketIOErrorEvent
- SocketIOCloseEvent
- SocketIOListenEvent
- SocketIOInfoEvent
- SocketIOBridgeAPI
```

--------------------------------------------------------------------------------

---[FILE: websocket.ts]---
Location: insomnia-develop/packages/insomnia/src/main/network/websocket.ts
Signals: N/A
Excerpt (<=80 chars):  export interface WebSocketConnection extends WebSocket {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- registerWebSocketHandlers
- WebSocketOpenEvent
- WebSocketMessageEvent
- WebSocketErrorEvent
- WebSocketCloseEvent
- WebSocketEvent
- WebSocketEventLog
- WebSocketConnection
- WebSocketBridgeAPI
```

--------------------------------------------------------------------------------

---[FILE: api-spec.ts]---
Location: insomnia-develop/packages/insomnia/src/models/api-spec.ts
Signals: N/A
Excerpt (<=80 chars):  export const name = 'ApiSpec';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- init
- migrate
- getByParentId
- update
- removeWhere
- name
- type
- prefix
- canDuplicate
- canSync
- isApiSpec
- ApiSpec
- BaseApiSpec
```

--------------------------------------------------------------------------------

---[FILE: ca-certificate.ts]---
Location: insomnia-develop/packages/insomnia/src/models/ca-certificate.ts
Signals: N/A
Excerpt (<=80 chars):  export const name = 'CA Certificate';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- init
- migrate
- create
- update
- getById
- findByParentId
- removeWhere
- all
- name
- type
- prefix
- canDuplicate
- canSync
- isCaCertificate
- CaCertificate
```

--------------------------------------------------------------------------------

---[FILE: client-certificate.ts]---
Location: insomnia-develop/packages/insomnia/src/models/client-certificate.ts
Signals: N/A
Excerpt (<=80 chars):  export const name = 'Client Certificate';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- init
- migrate
- create
- update
- getById
- findByParentId
- remove
- all
- name
- type
- prefix
- canDuplicate
- canSync
- isClientCertificate
- ClientCertificate
```

--------------------------------------------------------------------------------

---[FILE: cloud-credential.ts]---
Location: insomnia-develop/packages/insomnia/src/models/cloud-credential.ts
Signals: N/A
Excerpt (<=80 chars):  export type CloudProviderName = 'aws' | 'azure' | 'gcp' | 'hashicorp';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getProviderDisplayName
- init
- migrate
- create
- update
- remove
- getByName
- all
- name
- type
- prefix
- canDuplicate
- canSync
- isCloudCredential
- CloudProviderName
- CloudProviderCredential
- AWSTemporaryCredential
- AWSFileCredential
```

--------------------------------------------------------------------------------

---[FILE: cookie-jar.ts]---
Location: insomnia-develop/packages/insomnia/src/models/cookie-jar.ts
Signals: N/A
Excerpt (<=80 chars): export const name = 'Cookie Jar';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- init
- migrate
- name
- type
- prefix
- canDuplicate
- canSync
- isCookieJar
- CookieJar
- Cookie
- BaseCookieJar
```

--------------------------------------------------------------------------------

---[FILE: environment.ts]---
Location: insomnia-develop/packages/insomnia/src/models/environment.ts
Signals: N/A
Excerpt (<=80 chars):  export const name = 'Environment';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getKVPairFromData
- getDataFromKVPair
- init
- migrate
- create
- update
- findByParentId
- getById
- getByParentId
- remove
- all
- name
- type
- prefix
- vaultEnvironmentPath
- vaultEnvironmentRuntimePath
- vaultEnvironmentMaskValue
- canDuplicate
```

--------------------------------------------------------------------------------

---[FILE: git-credentials.ts]---
Location: insomnia-develop/packages/insomnia/src/models/git-credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export type OauthProviderName = 'gitlab' | 'github';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- init
- migrate
- create
- update
- remove
- all
- removeAll
- name
- type
- prefix
- canDuplicate
- canSync
- OauthProviderName
- GitCredentials
```

--------------------------------------------------------------------------------

---[FILE: git-repository.ts]---
Location: insomnia-develop/packages/insomnia/src/models/git-repository.ts
Signals: N/A
Excerpt (<=80 chars):  export type OauthProviderName = 'gitlab' | 'github' | 'custom';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- init
- migrate
- create
- update
- remove
- all
- name
- type
- prefix
- canDuplicate
- canSync
- isGitRepository
- isGitCredentialsOAuth
- OauthProviderName
- GitRepository
- GitCredentials
- BaseGitRepository
- GitAuthor
```

--------------------------------------------------------------------------------

---[FILE: grpc-request-meta.ts]---
Location: insomnia-develop/packages/insomnia/src/models/grpc-request-meta.ts
Signals: N/A
Excerpt (<=80 chars):  export const name = 'gRPC Request Meta';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- init
- migrate
- create
- update
- getByParentId
- all
- name
- type
- prefix
- canDuplicate
- canSync
- isGrpcRequestMeta
- GrpcRequestMeta
```

--------------------------------------------------------------------------------

---[FILE: grpc-request.ts]---
Location: insomnia-develop/packages/insomnia/src/models/grpc-request.ts
Signals: Next.js
Excerpt (<=80 chars):  export const name = 'gRPC Request';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- init
- migrate
- create
- remove
- update
- getById
- findByProtoFileId
- findByParentId
- all
- name
- type
- prefix
- canDuplicate
- canSync
- isGrpcRequest
- isGrpcRequestId
- GrpcRequest
- GrpcRequestBody
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: insomnia-develop/packages/insomnia/src/models/index.ts
Signals: N/A
Excerpt (<=80 chars):  export interface BaseModel {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- all
- types
- canSync
- getModel
- mustGetModel
- canDuplicate
- apiSpec
- clientCertificate
- caCertificate
- cookieJar
- environment
- gitCredentials
- gitRepository
- mockServer
- mockRoute
- oAuth2Token
- pluginData
- request
```

--------------------------------------------------------------------------------

---[FILE: mcp-request-payload.ts]---
Location: insomnia-develop/packages/insomnia/src/models/mcp-request-payload.ts
Signals: N/A
Excerpt (<=80 chars):  export const name = 'MCP Payload';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- name
- type
- prefix
- canDuplicate
- canSync
- isSocketIOPayload
- isMcpPayloadId
- init
- migrate
- create
- remove
- update
- getById
- getByParentId
- getByParentIdAndUrl
- all
- McpPayload
- BaseMcpPayload
```

--------------------------------------------------------------------------------

---[FILE: mcp-request.ts]---
Location: insomnia-develop/packages/insomnia/src/models/mcp-request.ts
Signals: N/A
Excerpt (<=80 chars):  export const name = 'MCP Request';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- init
- migrate
- create
- remove
- all
- getByParentId
- getById
- update
- name
- type
- prefix
- canDuplicate
- canSync
- TRANSPORT_TYPES
- isMcpRequest
- isMcpRequestId
- TransportType
- McpServerPrimitiveTypes
```

--------------------------------------------------------------------------------

---[FILE: mcp-response.ts]---
Location: insomnia-develop/packages/insomnia/src/models/mcp-response.ts
Signals: N/A
Excerpt (<=80 chars):  export const name = 'Mcp Response';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- init
- migrate
- getById
- findByParentId
- remove
- name
- type
- prefix
- canDuplicate
- canSync
- isMcpResponse
- McpResponse
- BaseMcpResponse
```

--------------------------------------------------------------------------------

---[FILE: mock-route.ts]---
Location: insomnia-develop/packages/insomnia/src/models/mock-route.ts
Signals: N/A
Excerpt (<=80 chars):  export const name = 'Mock Route';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- init
- migrate
- create
- update
- getById
- findByParentId
- removeWhere
- remove
- all
- name
- type
- prefix
- canDuplicate
- canSync
- isMockRoute
- MockRoute
```

--------------------------------------------------------------------------------

---[FILE: mock-server.ts]---
Location: insomnia-develop/packages/insomnia/src/models/mock-server.ts
Signals: N/A
Excerpt (<=80 chars):  export const name = 'Mock Server';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- init
- migrate
- create
- update
- getById
- getByParentId
- removeWhere
- remove
- all
- name
- type
- prefix
- canDuplicate
- canSync
- isMockServer
- MockServer
```

--------------------------------------------------------------------------------

---[FILE: o-auth-2-token.ts]---
Location: insomnia-develop/packages/insomnia/src/models/o-auth-2-token.ts
Signals: N/A
Excerpt (<=80 chars):  export type OAuth2Token = BaseModel & BaseOAuth2Token;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- init
- migrate
- create
- update
- remove
- getByParentId
- all
- name
- type
- prefix
- canDuplicate
- canSync
- isOAuth2Token
- OAuth2Token
- BaseOAuth2Token
```

--------------------------------------------------------------------------------

---[FILE: organization.ts]---
Location: insomnia-develop/packages/insomnia/src/models/organization.ts
Signals: N/A
Excerpt (<=80 chars):  export interface Metadata {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SCRATCHPAD_ORGANIZATION_ID
- isScratchpadOrganizationId
- isPersonalOrganization
- isOwnerOfOrganization
- findPersonalOrganization
- formatCurrentPlanType
- Metadata
- Organization
- StorageRules
- OrganizationsResponse
```

--------------------------------------------------------------------------------

---[FILE: plugin-data.ts]---
Location: insomnia-develop/packages/insomnia/src/models/plugin-data.ts
Signals: N/A
Excerpt (<=80 chars):  export const name = 'PluginData';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- init
- migrate
- create
- name
- type
- prefix
- canDuplicate
- canSync
- isPluginData
- PluginData
```

--------------------------------------------------------------------------------

---[FILE: project.ts]---
Location: insomnia-develop/packages/insomnia/src/models/project.ts
Signals: N/A
Excerpt (<=80 chars):  export const name = 'Project';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isEmptyGitProject
- init
- migrate
- createId
- create
- getById
- getByRemoteId
- remove
- update
- isDefaultOrganizationProject
- getDefaultProjectStorageType
- getProjectStorageTypeLabel
- name
- type
- prefix
- canDuplicate
- canSync
- SCRATCHPAD_PROJECT_ID
```

--------------------------------------------------------------------------------

---[FILE: proto-directory.ts]---
Location: insomnia-develop/packages/insomnia/src/models/proto-directory.ts
Signals: N/A
Excerpt (<=80 chars):  export const name = 'Proto Directory';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- init
- migrate
- createId
- create
- getById
- getByParentId
- findByParentId
- remove
- all
- name
- type
- prefix
- canDuplicate
- canSync
- isProtoDirectory
- ProtoDirectory
```

--------------------------------------------------------------------------------

---[FILE: proto-file.ts]---
Location: insomnia-develop/packages/insomnia/src/models/proto-file.ts
Signals: N/A
Excerpt (<=80 chars):  export const name = 'Proto File';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- init
- migrate
- create
- remove
- update
- getById
- getByParentId
- findByParentId
- all
- name
- type
- prefix
- canDuplicate
- canSync
- isProtoFile
- ProtoFile
```

--------------------------------------------------------------------------------

---[FILE: request-group-meta.ts]---
Location: insomnia-develop/packages/insomnia/src/models/request-group-meta.ts
Signals: N/A
Excerpt (<=80 chars):  export const name = 'Folder Meta';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- init
- migrate
- create
- update
- getByParentId
- all
- name
- type
- prefix
- canDuplicate
- canSync
- isRequestGroupMeta
- RequestGroupMeta
```

--------------------------------------------------------------------------------

---[FILE: request-group.ts]---
Location: insomnia-develop/packages/insomnia/src/models/request-group.ts
Signals: N/A
Excerpt (<=80 chars):  export const name = 'Folder';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- init
- migrate
- create
- update
- getById
- findByParentId
- remove
- all
- name
- type
- prefix
- canDuplicate
- canSync
- optionalKeys
- isRequestGroup
- isRequestGroupId
- RequestGroup
```

--------------------------------------------------------------------------------

---[FILE: request-meta.ts]---
Location: insomnia-develop/packages/insomnia/src/models/request-meta.ts
Signals: N/A
Excerpt (<=80 chars):  export const name = 'Request Meta';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- init
- migrate
- create
- update
- getByParentId
- all
- name
- type
- prefix
- canDuplicate
- canSync
- isRequestMeta
- RequestAccordionKeys
- RequestMeta
- BaseRequestMeta
```

--------------------------------------------------------------------------------

---[FILE: request-version.ts]---
Location: insomnia-develop/packages/insomnia/src/models/request-version.ts
Signals: N/A
Excerpt (<=80 chars):  export const name = 'Request Version';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- init
- migrate
- getById
- findByParentId
- all
- name
- type
- prefix
- canDuplicate
- canSync
- isRequestVersion
- RequestVersion
```

--------------------------------------------------------------------------------

---[FILE: request.ts]---
Location: insomnia-develop/packages/insomnia/src/models/request.ts
Signals: Next.js
Excerpt (<=80 chars):  export const name = 'Request';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- init
- migrate
- create
- getById
- getByParentId
- findByParentId
- update
- remove
- name
- type
- prefix
- canDuplicate
- canSync
- PATH_PARAMETER_REGEX
- getPathParametersFromUrl
- getCombinedPathParametersFromUrl
- isRequest
- isRequestId
```

--------------------------------------------------------------------------------

---[FILE: response.ts]---
Location: insomnia-develop/packages/insomnia/src/models/response.ts
Signals: N/A
Excerpt (<=80 chars):  export const name = 'Response';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- init
- migrate
- getById
- findByParentId
- remove
- getTimeline
- name
- type
- prefix
- canDuplicate
- canSync
- isResponse
- getBodyStream
- readCurlResponse
- getBodyBuffer
- Compression
- Response
- ResponseHeader
```

--------------------------------------------------------------------------------

---[FILE: runner-test-result.ts]---
Location: insomnia-develop/packages/insomnia/src/models/runner-test-result.ts
Signals: N/A
Excerpt (<=80 chars):  export const name = 'Runner Test Result';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- init
- migrate
- create
- update
- getByParentId
- getById
- all
- remove
- findByParentId
- name
- type
- prefix
- canDuplicate
- canSync
- isRunnerTestResult
- RunnerResultPerRequestPerIteration
- RunnerTestResult
- RunnerResultPerRequest
```

--------------------------------------------------------------------------------

---[FILE: settings.ts]---
Location: insomnia-develop/packages/insomnia/src/models/settings.ts
Signals: N/A
Excerpt (<=80 chars):  export type Settings = BaseModel & BaseSettings;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- init
- migrate
- name
- type
- prefix
- canDuplicate
- canSync
- isSettings
- Settings
- ThemeSettings
```

--------------------------------------------------------------------------------

---[FILE: socket-io-payload.ts]---
Location: insomnia-develop/packages/insomnia/src/models/socket-io-payload.ts
Signals: N/A
Excerpt (<=80 chars):  export const name = 'SocketIO Payload';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- name
- type
- prefix
- canDuplicate
- canSync
- isSocketIOPayload
- isSocketIOPayloadId
- init
- migrate
- create
- remove
- update
- getById
- getByParentId
- all
- SocketIOPayload
- SocketIOArg
- BaseSocketIOPayload
```

--------------------------------------------------------------------------------

---[FILE: socket-io-request.ts]---
Location: insomnia-develop/packages/insomnia/src/models/socket-io-request.ts
Signals: Next.js
Excerpt (<=80 chars):  export const name = 'Socket.IO Request';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- name
- type
- prefix
- canDuplicate
- canSync
- isSocketIORequest
- isSocketIORequestId
- init
- create
- getById
- migrate
- remove
- update
- SocketIORequest
- SocketIOEventListener
- BaseSocketIORequest
```

--------------------------------------------------------------------------------

---[FILE: socket-io-response.ts]---
Location: insomnia-develop/packages/insomnia/src/models/socket-io-response.ts
Signals: N/A
Excerpt (<=80 chars):  export const name = 'SocketIO Response';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- init
- migrate
- update
- getById
- findByParentId
- remove
- name
- type
- prefix
- canDuplicate
- canSync
- isSocketIOResponse
- SocketIOResponse
- BaseSocketIOResponse
```

--------------------------------------------------------------------------------

---[FILE: stats.ts]---
Location: insomnia-develop/packages/insomnia/src/models/stats.ts
Signals: N/A
Excerpt (<=80 chars):  export const name = 'Stats';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- init
- migrate
- create
- all
- name
- type
- prefix
- canDuplicate
- canSync
- isStats
- Stats
- BaseStats
```

--------------------------------------------------------------------------------

---[FILE: unit-test-result.ts]---
Location: insomnia-develop/packages/insomnia/src/models/unit-test-result.ts
Signals: N/A
Excerpt (<=80 chars):  export const name = 'Unit Test Result';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- init
- migrate
- create
- update
- getByParentId
- getById
- all
- name
- type
- prefix
- canDuplicate
- canSync
- isUnitTestResult
- UnitTestResult
- BaseUnitTestResult
```

--------------------------------------------------------------------------------

---[FILE: unit-test-suite.ts]---
Location: insomnia-develop/packages/insomnia/src/models/unit-test-suite.ts
Signals: N/A
Excerpt (<=80 chars):  export const name = 'Unit Test Suite';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- init
- migrate
- create
- update
- remove
- getByParentId
- findByParentId
- all
- name
- type
- prefix
- canDuplicate
- canSync
- isUnitTestSuite
- getById
- UnitTestSuite
- BaseUnitTestSuite
```

--------------------------------------------------------------------------------

---[FILE: unit-test.ts]---
Location: insomnia-develop/packages/insomnia/src/models/unit-test.ts
Signals: N/A
Excerpt (<=80 chars):  export const name = 'Unit Test';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- init
- migrate
- create
- remove
- update
- getByParentId
- all
- name
- type
- prefix
- canDuplicate
- canSync
- isUnitTest
- UnitTest
```

--------------------------------------------------------------------------------

---[FILE: user-session.ts]---
Location: insomnia-develop/packages/insomnia/src/models/user-session.ts
Signals: N/A
Excerpt (<=80 chars):  export interface BaseUserSession {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- init
- migrate
- name
- type
- prefix
- canDuplicate
- canSync
- UserSession
- BaseUserSession
- HashedUserSession
```

--------------------------------------------------------------------------------

---[FILE: websocket-payload.ts]---
Location: insomnia-develop/packages/insomnia/src/models/websocket-payload.ts
Signals: N/A
Excerpt (<=80 chars):  export const name = 'WebSocket Payload';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- name
- type
- prefix
- canDuplicate
- canSync
- isWebSocketPayload
- isWebSocketPayloadId
- init
- migrate
- create
- remove
- update
- getById
- getByParentId
- all
- WebSocketPayload
- BaseWebSocketPayload
```

--------------------------------------------------------------------------------

---[FILE: websocket-request.ts]---
Location: insomnia-develop/packages/insomnia/src/models/websocket-request.ts
Signals: Next.js
Excerpt (<=80 chars):  export const name = 'WebSocket Request';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- name
- type
- prefix
- canDuplicate
- canSync
- isWebSocketRequest
- isWebSocketRequestId
- optionalKeys
- init
- migrate
- create
- remove
- update
- getById
- findByParentId
- all
- WebSocketRequest
- BaseWebSocketRequest
```

--------------------------------------------------------------------------------

---[FILE: websocket-response.ts]---
Location: insomnia-develop/packages/insomnia/src/models/websocket-response.ts
Signals: N/A
Excerpt (<=80 chars):  export const name = 'WebSocket Response';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- init
- migrate
- getById
- findByParentId
- remove
- name
- type
- prefix
- canDuplicate
- canSync
- isWebSocketResponse
- WebSocketResponse
- BaseWebSocketResponse
```

--------------------------------------------------------------------------------

---[FILE: workspace-meta.ts]---
Location: insomnia-develop/packages/insomnia/src/models/workspace-meta.ts
Signals: N/A
Excerpt (<=80 chars):  export const name = 'Workspace Meta';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- init
- migrate
- create
- update
- all
- name
- type
- prefix
- canDuplicate
- canSync
- isWorkspaceMeta
- WorkspaceMeta
- BaseWorkspaceMeta
```

--------------------------------------------------------------------------------

---[FILE: workspace.ts]---
Location: insomnia-develop/packages/insomnia/src/models/workspace.ts
Signals: N/A
Excerpt (<=80 chars):  export const name = 'Workspace';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- migrate
- getById
- findByParentId
- count
- update
- remove
- isScratchpad
- name
- type
- prefix
- canDuplicate
- canSync
- WorkspaceScopeKeys
- isWorkspace
- isDesign
- isCollection
- isMockServer
- isEnvironment
```

--------------------------------------------------------------------------------

---[FILE: project.ts]---
Location: insomnia-develop/packages/insomnia/src/models/helpers/project.ts
Signals: N/A
Excerpt (<=80 chars): export const sortProjects = (projects: Project[]) => [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- sortProjects
```

--------------------------------------------------------------------------------

---[FILE: query-all-workspace-urls.ts]---
Location: insomnia-develop/packages/insomnia/src/models/helpers/query-all-workspace-urls.ts
Signals: N/A
Excerpt (<=80 chars):  export const queryAllWorkspaceUrls = async (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- queryAllWorkspaceUrls
```

--------------------------------------------------------------------------------

---[FILE: request-operations.ts]---
Location: insomnia-develop/packages/insomnia/src/models/helpers/request-operations.ts
Signals: N/A
Excerpt (<=80 chars):  export function getById(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getById
- remove
```

--------------------------------------------------------------------------------

---[FILE: uuid.ts]---
Location: insomnia-develop/packages/insomnia/src/models/__mocks__/uuid.ts
Signals: N/A
Excerpt (<=80 chars):  export function v4Mock() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- v4Mock
```

--------------------------------------------------------------------------------

---[FILE: authentication.ts]---
Location: insomnia-develop/packages/insomnia/src/network/authentication.ts
Signals: N/A
Excerpt (<=80 chars):  export function getAuthQueryParams(authentication: RequestAuthentication) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getAuthQueryParams
- _buildBearerHeader
- isAuthEnabled
- getAuthObjectOrNull
```

--------------------------------------------------------------------------------

---[FILE: cancellation.ts]---
Location: insomnia-develop/packages/insomnia/src/network/cancellation.ts
Signals: N/A
Excerpt (<=80 chars):  export const cancellableExecution = async (options: { id: string; fn: Promis...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- cancellableExecution
- cancellableRunScript
- cancellableCurlRequest
- cancellablePromise
```

--------------------------------------------------------------------------------

---[FILE: certificate.ts]---
Location: insomnia-develop/packages/insomnia/src/network/certificate.ts
Signals: N/A
Excerpt (<=80 chars):  export function filterClientCertificates(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- filterClientCertificates
```

--------------------------------------------------------------------------------

---[FILE: concurrency.ts]---
Location: insomnia-develop/packages/insomnia/src/network/concurrency.ts
Signals: N/A
Excerpt (<=80 chars):  export interface ExecuteScriptContext {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- runScriptConcurrently
- ExecuteScriptContext
- TransformedExecuteScriptContext
```

--------------------------------------------------------------------------------

---[FILE: is-url-matched-in-no-proxy-rule.ts]---
Location: insomnia-develop/packages/insomnia/src/network/is-url-matched-in-no-proxy-rule.ts
Signals: N/A
Excerpt (<=80 chars):  export function isUrlMatchedInNoProxyRule(url: string | undefined, noProxyRu...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isUrlMatchedInNoProxyRule
```

--------------------------------------------------------------------------------

---[FILE: network.ts]---
Location: insomnia-develop/packages/insomnia/src/network/network.ts
Signals: N/A
Excerpt (<=80 chars):  export interface SendActionRuntime {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getOrInheritHeaders
- getOrInheritAuthentication
- fetchRequestGroupData
- fetchRequestData
- fetchMcpRequestData
- tryToExecutePreRequestScript
- tryToInterpolateRequest
- tryToTransformRequestWithPlugins
- responseTransform
- transformUrl
- getSetCookiesFromResponseHeaders
- getCurrentUrl
- defaultSendActionRuntime
- SendActionRuntime
- sendCurlAndWriteTimelineError
- sendCurlAndWriteTimelineResponse
```

--------------------------------------------------------------------------------

---[FILE: set-cookie-util.ts]---
Location: insomnia-develop/packages/insomnia/src/network/set-cookie-util.ts
Signals: N/A
Excerpt (<=80 chars):  export const addSetCookiesToToughCookieJar = async ({ setCookieStrings, curr...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- addSetCookiesToToughCookieJar
```

--------------------------------------------------------------------------------

---[FILE: unit-test-feature.ts]---
Location: insomnia-develop/packages/insomnia/src/network/unit-test-feature.ts
Signals: N/A
Excerpt (<=80 chars):  export function getSendRequestCallback() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getSendRequestCallback
```

--------------------------------------------------------------------------------

---[FILE: url-matches-cert-host.ts]---
Location: insomnia-develop/packages/insomnia/src/network/url-matches-cert-host.ts
Signals: N/A
Excerpt (<=80 chars):  export function urlMatchesCertHost(certificateHost: string, requestUrl: stri...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- urlMatchesCertHost
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: insomnia-develop/packages/insomnia/src/network/api-key/constants.ts
Signals: N/A
Excerpt (<=80 chars): export type ApiKeyAuthType = 'header' | 'queryParams' | 'cookie';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ApiKeyAuthType
```

--------------------------------------------------------------------------------

---[FILE: get-header.ts]---
Location: insomnia-develop/packages/insomnia/src/network/basic-auth/get-header.ts
Signals: N/A
Excerpt (<=80 chars):  export function getBasicAuthHeader(username?: string | null, password?: stri...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getBasicAuthHeader
```

--------------------------------------------------------------------------------

---[FILE: get-header.ts]---
Location: insomnia-develop/packages/insomnia/src/network/bearer-auth/get-header.ts
Signals: N/A
Excerpt (<=80 chars):  export function getBearerAuthHeader(token: string, prefix?: string) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getBearerAuthHeader
```

--------------------------------------------------------------------------------

---[FILE: parse-grpc-url.ts]---
Location: insomnia-develop/packages/insomnia/src/network/grpc/parse-grpc-url.ts
Signals: N/A
Excerpt (<=80 chars): export const parseGrpcUrl = (grpcUrl: string): { url: string; enableTls: bool...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- parseGrpcUrl
```

--------------------------------------------------------------------------------

---[FILE: proto-directory-loader.tsx]---
Location: insomnia-develop/packages/insomnia/src/network/grpc/proto-directory-loader.tsx
Signals: N/A
Excerpt (<=80 chars):  export class ProtoDirectoryLoader {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProtoDirectoryLoader
```

--------------------------------------------------------------------------------

---[FILE: write-proto-file.ts]---
Location: insomnia-develop/packages/insomnia/src/network/grpc/write-proto-file.ts
Signals: N/A
Excerpt (<=80 chars):  export const writeProtoFile = async (protoFile: ProtoFile): Promise<WriteRes...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- writeProtoFile
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: insomnia-develop/packages/insomnia/src/network/o-auth-1/constants.ts
Signals: N/A
Excerpt (<=80 chars): export type OAuth1SignatureMethod = 'HMAC-SHA1' | 'RSA-SHA1' | 'HMAC-SHA256' ...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OAuth1SignatureMethod
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: insomnia-develop/packages/insomnia/src/network/o-auth-2/constants.ts
Signals: N/A
Excerpt (<=80 chars): export const GRANT_TYPE_AUTHORIZATION_CODE = 'authorization_code';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GRANT_TYPE_AUTHORIZATION_CODE
- GRANT_TYPE_IMPLICIT
- GRANT_TYPE_PASSWORD
- GRANT_TYPE_CLIENT_CREDENTIALS
- GRANT_TYPE_REFRESH
- GRANT_TYPE_MCP_AUTH_FLOW
- PKCE_CHALLENGE_S256
- PKCE_CHALLENGE_PLAIN
- AuthKeys
- OAuth2AuthorizationStatusType
```

--------------------------------------------------------------------------------

---[FILE: get-token.ts]---
Location: insomnia-develop/packages/insomnia/src/network/o-auth-2/get-token.ts
Signals: N/A
Excerpt (<=80 chars):  export function initNewOAuthSession() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- initNewOAuthSession
- getOAuthSession
- getOAuth2Token
- oauthResponseToAccessToken
- encodePKCE
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: insomnia-develop/packages/insomnia/src/network/o-auth-2/utils.ts
Signals: N/A
Excerpt (<=80 chars):  export const encryptOAuthUrl = (authCodeUrlStr: string) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- encryptOAuthUrl
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: insomnia-develop/packages/insomnia/src/plugins/index.ts
Signals: N/A
Excerpt (<=80 chars):  export interface Plugin {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getBundlePluginMap
- getPluginCommonContext
- TemplateTag
- RequestGroupAction
- RequestAction
- WorkspaceAction
- DocumentAction
- PluginAction
- RequestHook
- ResponseHook
- Theme
- ColorScheme
- Plugin
```

--------------------------------------------------------------------------------

---[FILE: misc.ts]---
Location: insomnia-develop/packages/insomnia/src/plugins/misc.ts
Signals: N/A
Excerpt (<=80 chars):  export type HexColor = `#${string}`;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getColorScheme
- applyColorScheme
- validateThemeName
- containsNunjucks
- validateTheme
- generateThemeCSS
- HexColor
- RGBColor
- RGBAColor
- ThemeColor
- ThemeInner
- ThemeBlock
- CompleteStyleBlock
- StylesThemeBlocks
- PluginTheme
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: insomnia-develop/packages/insomnia/src/plugins/types.ts
Signals: N/A
Excerpt (<=80 chars):  export interface ModelConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GenerateCommitsFromDiffFunction
- GenerateMcpSamplingResponseFunction
- ModelConfig
- MultiTurnMessage
- MockRouteData
```

--------------------------------------------------------------------------------

---[FILE: app.ts]---
Location: insomnia-develop/packages/insomnia/src/plugins/context/app.ts
Signals: N/A
Excerpt (<=80 chars):  export const init = (renderPurpose: RenderPurpose = 'general'): { app: AppCo...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- init
```

--------------------------------------------------------------------------------

---[FILE: data.ts]---
Location: insomnia-develop/packages/insomnia/src/plugins/context/data.ts
Signals: N/A
Excerpt (<=80 chars): export const init = (activeProjectId?: string) => ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- init
```

--------------------------------------------------------------------------------

---[FILE: network.ts]---
Location: insomnia-develop/packages/insomnia/src/plugins/context/network.ts
Signals: N/A
Excerpt (<=80 chars): export interface NodeCurlRequestOptions {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- init
- NodeCurlRequestOptions
- NodeCurlResponseType
```

--------------------------------------------------------------------------------

````
