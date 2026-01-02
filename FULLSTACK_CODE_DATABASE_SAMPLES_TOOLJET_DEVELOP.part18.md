---
source_txt: fullstack_samples/ToolJet-develop
converted_utc: 2025-12-18T10:37:21Z
part: 18
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES ToolJet-develop

## Extracted Reusable Patterns (Non-verbatim) (Part 18 of 37)

````text
================================================================================
FULLSTACK SAMPLES PATTERN DATABASE - ToolJet-develop
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/ToolJet-develop
================================================================================

NOTES:
- This file intentionally avoids copying large verbatim third-party code.
- It captures reusable patterns, surfaces, and file references.
- Use the referenced file paths to view full implementations locally.

================================================================================

---[FILE: withProfiler.jsx]---
Location: ToolJet-develop/frontend/src/_hoc/withProfiler.jsx
Signals: React
Excerpt (<=80 chars):  export const withProfiler = (WrappedComponent) => (props) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- withProfiler
```

--------------------------------------------------------------------------------

---[FILE: withRouter.jsx]---
Location: ToolJet-develop/frontend/src/_hoc/withRouter.jsx
Signals: React
Excerpt (<=80 chars):  export const withRouter = (WrappedComponent) => (props) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- withRouter
```

--------------------------------------------------------------------------------

---[FILE: use-event-listener.jsx]---
Location: ToolJet-develop/frontend/src/_hooks/use-event-listener.jsx
Signals: React
Excerpt (<=80 chars):  export function useEventListener(eventName, handler, element = window) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useEventListener
```

--------------------------------------------------------------------------------

---[FILE: use-focus.jsx]---
Location: ToolJet-develop/frontend/src/_hooks/use-focus.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: use-height-transition.jsx]---
Location: ToolJet-develop/frontend/src/_hooks/use-height-transition.jsx
Signals: React
Excerpt (<=80 chars): import { useRef, useState, useLayoutEffect } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: use-local-storage.jsx]---
Location: ToolJet-develop/frontend/src/_hooks/use-local-storage.jsx
Signals: React
Excerpt (<=80 chars):  export const useLocalStorageState = (

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useLocalStorageState
```

--------------------------------------------------------------------------------

---[FILE: use-mount.jsx]---
Location: ToolJet-develop/frontend/src/_hooks/use-mount.jsx
Signals: React
Excerpt (<=80 chars):  export const useMounted = () => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useMounted
```

--------------------------------------------------------------------------------

---[FILE: use-popover.jsx]---
Location: ToolJet-develop/frontend/src/_hooks/use-popover.jsx
Signals: React
Excerpt (<=80 chars): /* eslint-disable react-hooks/exhaustive-deps */

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: use-portal.jsx]---
Location: ToolJet-develop/frontend/src/_hooks/use-portal.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: use-router.jsx]---
Location: ToolJet-develop/frontend/src/_hooks/use-router.jsx
Signals: React
Excerpt (<=80 chars): import { useMemo } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: use-socket-open.jsx]---
Location: ToolJet-develop/frontend/src/_hooks/use-socket-open.jsx
Signals: React
Excerpt (<=80 chars): export const useSocketOpen = (socket) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useSocketOpen
```

--------------------------------------------------------------------------------

---[FILE: useAppDarkMode.js]---
Location: ToolJet-develop/frontend/src/_hooks/useAppDarkMode.js
Signals: React
Excerpt (<=80 chars): import { useMemo } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: useDebounce.js]---
Location: ToolJet-develop/frontend/src/_hooks/useDebounce.js
Signals: React
Excerpt (<=80 chars): import { useEffect, useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: useDebouncedArrowKeyPress.js]---
Location: ToolJet-develop/frontend/src/_hooks/useDebouncedArrowKeyPress.js
Signals: React
Excerpt (<=80 chars): import { useEffect, useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: useDraggableInPortal.js]---
Location: ToolJet-develop/frontend/src/_hooks/useDraggableInPortal.js
Signals: React
Excerpt (<=80 chars): import { useRef, useEffect } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: useDynamicHeight.jsx]---
Location: ToolJet-develop/frontend/src/_hooks/useDynamicHeight.jsx
Signals: React
Excerpt (<=80 chars):  export const useDynamicHeight = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useDynamicHeight
```

--------------------------------------------------------------------------------

---[FILE: useGlobalDatasourceUnsavedChanges.js]---
Location: ToolJet-develop/frontend/src/_hooks/useGlobalDatasourceUnsavedChanges.js
Signals: React
Excerpt (<=80 chars): import { useCallback, useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: useHeightObserver.jsx]---
Location: ToolJet-develop/frontend/src/_hooks/useHeightObserver.jsx
Signals: React
Excerpt (<=80 chars):  export const useHeightObserver = (ref, dynamicHeight = false) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useHeightObserver
```

--------------------------------------------------------------------------------

---[FILE: useHover.js]---
Location: ToolJet-develop/frontend/src/_hooks/useHover.js
Signals: React
Excerpt (<=80 chars): import { useState, useEffect, useRef } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: useMountTransition.js]---
Location: ToolJet-develop/frontend/src/_hooks/useMountTransition.js
Signals: React
Excerpt (<=80 chars): import { useEffect, useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: usePageSettings.js]---
Location: ToolJet-develop/frontend/src/_hooks/usePageSettings.js
Signals: React
Excerpt (<=80 chars): import { useMemo } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: useRenderCount.jsx]---
Location: ToolJet-develop/frontend/src/_hooks/useRenderCount.jsx
Signals: React
Excerpt (<=80 chars): import { useRef, useEffect } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: useSessionManagement.js]---
Location: ToolJet-develop/frontend/src/_hooks/useSessionManagement.js
Signals: React
Excerpt (<=80 chars): export const useSessionManagement = (initialState = defaultState) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useSessionManagement
```

--------------------------------------------------------------------------------

---[FILE: useShowPopover.jsx]---
Location: ToolJet-develop/frontend/src/_hooks/useShowPopover.jsx
Signals: React
Excerpt (<=80 chars): import { useState, useEffect } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: useWindowResize.js]---
Location: ToolJet-develop/frontend/src/_hooks/useWindowResize.js
Signals: React
Excerpt (<=80 chars): import { useState, useEffect, useRef } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: reserved-keyword-replacer.js]---
Location: ToolJet-develop/frontend/src/_lib/reserved-keyword-replacer.js
Signals: N/A
Excerpt (<=80 chars): export function reservedKeywordReplacer(key, value) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- reservedKeywordReplacer
```

--------------------------------------------------------------------------------

---[FILE: ai-onboarding.service.js]---
Location: ToolJet-develop/frontend/src/_services/ai-onboarding.service.js
Signals: N/A
Excerpt (<=80 chars):  export const aiOnboardingService = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- aiOnboardingService
```

--------------------------------------------------------------------------------

---[FILE: ai.service.js]---
Location: ToolJet-develop/frontend/src/_services/ai.service.js
Signals: TypeORM
Excerpt (<=80 chars):  export const aiService = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- aiService
```

--------------------------------------------------------------------------------

---[FILE: app.service.js]---
Location: ToolJet-develop/frontend/src/_services/app.service.js
Signals: N/A
Excerpt (<=80 chars):  export const appService = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- appService
```

--------------------------------------------------------------------------------

---[FILE: appPermission.service.js]---
Location: ToolJet-develop/frontend/src/_services/appPermission.service.js
Signals: N/A
Excerpt (<=80 chars):  export const appPermissionService = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- appPermissionService
```

--------------------------------------------------------------------------------

---[FILE: apps.service.js]---
Location: ToolJet-develop/frontend/src/_services/apps.service.js
Signals: N/A
Excerpt (<=80 chars):  export const appsService = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- appsService
```

--------------------------------------------------------------------------------

---[FILE: appVersion.service.js]---
Location: ToolJet-develop/frontend/src/_services/appVersion.service.js
Signals: N/A
Excerpt (<=80 chars):  export const appVersionService = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- appVersionService
```

--------------------------------------------------------------------------------

---[FILE: app_environment.service.js]---
Location: ToolJet-develop/frontend/src/_services/app_environment.service.js
Signals: N/A
Excerpt (<=80 chars):  export const appEnvironmentService = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- appEnvironmentService
```

--------------------------------------------------------------------------------

---[FILE: auditLogsService.js]---
Location: ToolJet-develop/frontend/src/_services/auditLogsService.js
Signals: N/A
Excerpt (<=80 chars):  export const auditLogsService = { index, getLicenseTerms, getMaxDurationForA...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- auditLogsService
```

--------------------------------------------------------------------------------

---[FILE: authentication.service.js]---
Location: ToolJet-develop/frontend/src/_services/authentication.service.js
Signals: N/A
Excerpt (<=80 chars):  export const authenticationService = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- authenticationService
```

--------------------------------------------------------------------------------

---[FILE: commentNotifications.service.js]---
Location: ToolJet-develop/frontend/src/_services/commentNotifications.service.js
Signals: N/A
Excerpt (<=80 chars):  export const commentNotificationsService = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- commentNotificationsService
```

--------------------------------------------------------------------------------

---[FILE: comments.service.js]---
Location: ToolJet-develop/frontend/src/_services/comments.service.js
Signals: N/A
Excerpt (<=80 chars):  export const commentsService = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- commentsService
```

--------------------------------------------------------------------------------

---[FILE: copilot.service.js]---
Location: ToolJet-develop/frontend/src/_services/copilot.service.js
Signals: N/A
Excerpt (<=80 chars):  export const copilotService = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- copilotService
```

--------------------------------------------------------------------------------

---[FILE: custom_styles.service.js]---
Location: ToolJet-develop/frontend/src/_services/custom_styles.service.js
Signals: N/A
Excerpt (<=80 chars):  export const customStylesService = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- customStylesService
```

--------------------------------------------------------------------------------

---[FILE: dataquery.service.js]---
Location: ToolJet-develop/frontend/src/_services/dataquery.service.js
Signals: N/A
Excerpt (<=80 chars):  export const dataqueryService = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- dataqueryService
```

--------------------------------------------------------------------------------

---[FILE: datasource.service.js]---
Location: ToolJet-develop/frontend/src/_services/datasource.service.js
Signals: N/A
Excerpt (<=80 chars):  export const datasourceService = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- datasourceService
```

--------------------------------------------------------------------------------

---[FILE: folder.service.js]---
Location: ToolJet-develop/frontend/src/_services/folder.service.js
Signals: N/A
Excerpt (<=80 chars):  export const folderService = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- folderService
```

--------------------------------------------------------------------------------

---[FILE: git_sync.service.js]---
Location: ToolJet-develop/frontend/src/_services/git_sync.service.js
Signals: N/A
Excerpt (<=80 chars):  export const gitSyncService = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- gitSyncService
```

--------------------------------------------------------------------------------

---[FILE: globalDatasource.service.js]---
Location: ToolJet-develop/frontend/src/_services/globalDatasource.service.js
Signals: N/A
Excerpt (<=80 chars):  export const globalDatasourceService = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- globalDatasourceService
```

--------------------------------------------------------------------------------

---[FILE: groupPermission.v2.service.js]---
Location: ToolJet-develop/frontend/src/_services/groupPermission.v2.service.js
Signals: N/A
Excerpt (<=80 chars):  export const groupPermissionV2Service = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- groupPermissionV2Service
```

--------------------------------------------------------------------------------

---[FILE: index.js]---
Location: ToolJet-develop/frontend/src/_services/index.js
Signals: TypeORM
Excerpt (<=80 chars): export * from './authentication.service';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: instance_settings.service.js]---
Location: ToolJet-develop/frontend/src/_services/instance_settings.service.js
Signals: N/A
Excerpt (<=80 chars):  export const instanceSettingsService = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- instanceSettingsService
```

--------------------------------------------------------------------------------

---[FILE: library-app.service.js]---
Location: ToolJet-develop/frontend/src/_services/library-app.service.js
Signals: N/A
Excerpt (<=80 chars):  export const libraryAppService = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- libraryAppService
```

--------------------------------------------------------------------------------

---[FILE: license.service.js]---
Location: ToolJet-develop/frontend/src/_services/license.service.js
Signals: N/A
Excerpt (<=80 chars):  export const licenseService = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- licenseService
```

--------------------------------------------------------------------------------

---[FILE: login_configs.service.js]---
Location: ToolJet-develop/frontend/src/_services/login_configs.service.js
Signals: N/A
Excerpt (<=80 chars):  export const loginConfigsService = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- loginConfigsService
```

--------------------------------------------------------------------------------

---[FILE: marketplace.service.js]---
Location: ToolJet-develop/frontend/src/_services/marketplace.service.js
Signals: N/A
Excerpt (<=80 chars):  export const marketplaceService = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- marketplaceService
```

--------------------------------------------------------------------------------

---[FILE: openapi.service.js]---
Location: ToolJet-develop/frontend/src/_services/openapi.service.js
Signals: N/A
Excerpt (<=80 chars):  export const openapiService = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- openapiService
```

--------------------------------------------------------------------------------

---[FILE: organization.service.js]---
Location: ToolJet-develop/frontend/src/_services/organization.service.js
Signals: N/A
Excerpt (<=80 chars):  export const organizationService = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- organizationService
```

--------------------------------------------------------------------------------

---[FILE: organization_constants.service.js]---
Location: ToolJet-develop/frontend/src/_services/organization_constants.service.js
Signals: N/A
Excerpt (<=80 chars):  export const orgEnvironmentConstantService = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- orgEnvironmentConstantService
```

--------------------------------------------------------------------------------

---[FILE: organization_user.service.js]---
Location: ToolJet-develop/frontend/src/_services/organization_user.service.js
Signals: N/A
Excerpt (<=80 chars):  export const organizationUserService = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- organizationUserService
```

--------------------------------------------------------------------------------

---[FILE: org_environment_variable.service.js]---
Location: ToolJet-develop/frontend/src/_services/org_environment_variable.service.js
Signals: N/A
Excerpt (<=80 chars):  export const orgEnvironmentVariableService = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- orgEnvironmentVariableService
```

--------------------------------------------------------------------------------

---[FILE: plugins.service.js]---
Location: ToolJet-develop/frontend/src/_services/plugins.service.js
Signals: N/A
Excerpt (<=80 chars):  export const pluginsService = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- pluginsService
```

--------------------------------------------------------------------------------

---[FILE: session.service.js]---
Location: ToolJet-develop/frontend/src/_services/session.service.js
Signals: N/A
Excerpt (<=80 chars):  export const sessionService = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- sessionService
```

--------------------------------------------------------------------------------

---[FILE: tooljet.service.js]---
Location: ToolJet-develop/frontend/src/_services/tooljet.service.js
Signals: N/A
Excerpt (<=80 chars):  export const tooljetService = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- tooljetService
```

--------------------------------------------------------------------------------

---[FILE: tooljetDatabase.service.js]---
Location: ToolJet-develop/frontend/src/_services/tooljetDatabase.service.js
Signals: N/A
Excerpt (<=80 chars):  export const tooljetDatabaseService = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- tooljetDatabaseService
```

--------------------------------------------------------------------------------

---[FILE: user.service.js]---
Location: ToolJet-develop/frontend/src/_services/user.service.js
Signals: N/A
Excerpt (<=80 chars):  export const userService = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- userService
```

--------------------------------------------------------------------------------

---[FILE: white-labelling.service.js]---
Location: ToolJet-develop/frontend/src/_services/white-labelling.service.js
Signals: N/A
Excerpt (<=80 chars):  export const whiteLabellingService = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- whiteLabellingService
```

--------------------------------------------------------------------------------

---[FILE: workflow_executions.service.js]---
Location: ToolJet-develop/frontend/src/_services/workflow_executions.service.js
Signals: N/A
Excerpt (<=80 chars):  export const workflowExecutionsService = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- workflowExecutionsService
```

--------------------------------------------------------------------------------

---[FILE: workflow_schedules.service.js]---
Location: ToolJet-develop/frontend/src/_services/workflow_schedules.service.js
Signals: N/A
Excerpt (<=80 chars):  export const workflowSchedulesService = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- workflowSchedulesService
```

--------------------------------------------------------------------------------

---[FILE: appDataStore.js]---
Location: ToolJet-develop/frontend/src/_stores/appDataStore.js
Signals: N/A
Excerpt (<=80 chars): export const useAppDataStore = create(

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useAppDataStore
- useEditingVersion
- useIsSaving
- useUpdateEditingVersion
- useCurrentUser
- useAppInfo
- useAppDataActions
```

--------------------------------------------------------------------------------

---[FILE: appVersionStore.js]---
Location: ToolJet-develop/frontend/src/_stores/appVersionStore.js
Signals: N/A
Excerpt (<=80 chars):  export const useAppVersionStore = create(

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useAppVersionStore
- useAppVersionActions
- useAppVersionState
```

--------------------------------------------------------------------------------

---[FILE: currentSessionStore.js]---
Location: ToolJet-develop/frontend/src/_stores/currentSessionStore.js
Signals: N/A
Excerpt (<=80 chars): export const useCurrentSessionStore = create(

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useCurrentSessionStore
- useCurrentSessionStoreActions
```

--------------------------------------------------------------------------------

---[FILE: currentStateStore.js]---
Location: ToolJet-develop/frontend/src/_stores/currentStateStore.js
Signals: N/A
Excerpt (<=80 chars):  export const useCurrentStateStore = create(

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useCurrentStateStore
- useCurrentState
- useSelectedQueryLoadingState
- getCurrentState
```

--------------------------------------------------------------------------------

---[FILE: dataQueriesStore.js]---
Location: ToolJet-develop/frontend/src/_stores/dataQueriesStore.js
Signals: N/A
Excerpt (<=80 chars):  export const useDataQueriesStore = create(

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useDataQueriesStore
- useDataQueries
- useDataQueriesActions
- useQueryCreationLoading
- useQueryUpdationLoading
```

--------------------------------------------------------------------------------

---[FILE: dataSourcesStore.js]---
Location: ToolJet-develop/frontend/src/_stores/dataSourcesStore.js
Signals: N/A
Excerpt (<=80 chars):  export const useDataSourcesStore = create(

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useDataSourcesStore
- useDataSources
- useGlobalDataSources
- useSampleDataSource
- useLoadingDataSources
- useDataSourcesActions
- useGlobalDataSourcesStatus
```

--------------------------------------------------------------------------------

---[FILE: editorStore.js]---
Location: ToolJet-develop/frontend/src/_stores/editorStore.js
Signals: Redux/RTK
Excerpt (<=80 chars):  export const EMPTY_ARRAY = [];

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EMPTY_ARRAY
- useEditorStore
- useEditorActions
- useEditorState
- getComponentsToRenders
- flushComponentsToRender
```

--------------------------------------------------------------------------------

---[FILE: environmentsAndVersionsStore.js]---
Location: ToolJet-develop/frontend/src/_stores/environmentsAndVersionsStore.js
Signals: N/A
Excerpt (<=80 chars):  export const useEnvironmentsAndVersionsStore = create(

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useEnvironmentsAndVersionsStore
- useEnvironmentsAndVersionsActions
```

--------------------------------------------------------------------------------

---[FILE: gridStore.js]---
Location: ToolJet-develop/frontend/src/_stores/gridStore.js
Signals: N/A
Excerpt (<=80 chars):  export const useGridStore = create(

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useGridStore
- useIsGroupHandleHoverd
- useOpenModalWidgetId
```

--------------------------------------------------------------------------------

---[FILE: handleReferenceTransactions.js]---
Location: ToolJet-develop/frontend/src/_stores/handleReferenceTransactions.js
Signals: N/A
Excerpt (<=80 chars):  export function removeAppSuggestions(suggestionsArray, deleteAndReplaceArray) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- removeAppSuggestions
- dfs
- handleReferenceTransactions
```

--------------------------------------------------------------------------------

---[FILE: keyboardShortcutStore.js]---
Location: ToolJet-develop/frontend/src/_stores/keyboardShortcutStore.js
Signals: N/A
Excerpt (<=80 chars):  export const useKeyboardShortcutStore = create(

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useKeyboardShortcutStore
```

--------------------------------------------------------------------------------

---[FILE: licenseStore.js]---
Location: ToolJet-develop/frontend/src/_stores/licenseStore.js
Signals: N/A
Excerpt (<=80 chars):  export const useLicenseStore = create(

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useLicenseStore
- useLicenseState
```

--------------------------------------------------------------------------------

---[FILE: queryPanelStore.js]---
Location: ToolJet-develop/frontend/src/_stores/queryPanelStore.js
Signals: TypeORM
Excerpt (<=80 chars):  export const useQueryPanelStore = create(

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useQueryPanelStore
- usePanelHeight
- usePreviewPanelHeight
- useSelectedQuery
- useSelectedDataSource
- useQueryToBeRun
- usePreviewLoading
- usePreviewData
- useQueryPanelActions
- useShowCreateQuery
- useNameInputFocussed
- usePreviewPanelExpanded
```

--------------------------------------------------------------------------------

---[FILE: resolverStore.js]---
Location: ToolJet-develop/frontend/src/_stores/resolverStore.js
Signals: N/A
Excerpt (<=80 chars):  export const useResolveStore = create(

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useResolveStore
- useResolverStoreActions
```

--------------------------------------------------------------------------------

---[FILE: storeHelper.js]---
Location: ToolJet-develop/frontend/src/_stores/storeHelper.js
Signals: N/A
Excerpt (<=80 chars):  export const getDefaultOptions = (source) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getDefaultOptions
```

--------------------------------------------------------------------------------

---[FILE: utils.js]---
Location: ToolJet-develop/frontend/src/_stores/utils.js
Signals: N/A
Excerpt (<=80 chars):  export const zustandDevTools = (fn, options = {}) =>

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isParamFromTableColumn
- createReferencesLookup
- findAllEntityReferences
- findEntityId
- zustandDevTools
- create
- resetAllStores
- computeAppDiff
- computeComponentPropertyDiff
```

--------------------------------------------------------------------------------

---[FILE: whiteLabellingStore.js]---
Location: ToolJet-develop/frontend/src/_stores/whiteLabellingStore.js
Signals: N/A
Excerpt (<=80 chars):  export const useWhiteLabellingStore = create(

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useWhiteLabellingStore
- useWhiteLabelText
- useWhiteLabelLogo
- useWhiteLabelFavicon
- useWhiteLabellingActions
```

--------------------------------------------------------------------------------

---[FILE: AiBanner.jsx]---
Location: ToolJet-develop/frontend/src/_ui/AiBanner.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Label.jsx]---
Location: ToolJet-develop/frontend/src/_ui/Label.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: AccordionItem.js]---
Location: ToolJet-develop/frontend/src/_ui/Accordion/AccordionItem.js
Signals: React
Excerpt (<=80 chars): import React, { useEffect } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.js]---
Location: ToolJet-develop/frontend/src/_ui/Accordion/index.js
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Alert.jsx]---
Location: ToolJet-develop/frontend/src/_ui/Alert/Alert.jsx
Signals: React
Excerpt (<=80 chars):  export const Alert = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Alert
```

--------------------------------------------------------------------------------

---[FILE: index.jsx]---
Location: ToolJet-develop/frontend/src/_ui/AlertDialog/index.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: AppButton.jsx]---
Location: ToolJet-develop/frontend/src/_ui/AppButton/AppButton.jsx
Signals: React
Excerpt (<=80 chars):  export const ButtonBase = function ButtonBase(props) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ButtonBase
- ButtonSolid
```

--------------------------------------------------------------------------------

---[FILE: AppInput.jsx]---
Location: ToolJet-develop/frontend/src/_ui/AppInput/AppInput.jsx
Signals: React
Excerpt (<=80 chars): import React, { useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.jsx]---
Location: ToolJet-develop/frontend/src/_ui/Avatar/index.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.jsx]---
Location: ToolJet-develop/frontend/src/_ui/Beta/index.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.jsx]---
Location: ToolJet-develop/frontend/src/_ui/Breadcrumbs/index.jsx
Signals: React
Excerpt (<=80 chars):  export const Breadcrumbs = ({ darkMode, dataCy }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Breadcrumbs
```

--------------------------------------------------------------------------------

---[FILE: index.js]---
Location: ToolJet-develop/frontend/src/_ui/Button/index.js
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Card.jsx]---
Location: ToolJet-develop/frontend/src/_ui/Card/Card.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: CheckBox.jsx]---
Location: ToolJet-develop/frontend/src/_ui/CheckBox/CheckBox.jsx
Signals: React
Excerpt (<=80 chars):  export const Checkbox = ({ label, isChecked, onChange, key = '', value }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Checkbox
- CheckboxGroup
```

--------------------------------------------------------------------------------

---[FILE: index.jsx]---
Location: ToolJet-develop/frontend/src/_ui/CustomAvatar/index.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.js]---
Location: ToolJet-develop/frontend/src/_ui/CustomInput/index.js
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.jsx]---
Location: ToolJet-develop/frontend/src/_ui/Drawer/index.jsx
Signals: React
Excerpt (<=80 chars): import React, { useRef, useEffect } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.jsx]---
Location: ToolJet-develop/frontend/src/_ui/Drawer/DrawerFooter/index.jsx
Signals: React
Excerpt (<=80 chars): import React, { useEffect } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.jsx]---
Location: ToolJet-develop/frontend/src/_ui/ErrorBoundary/index.jsx
Signals: React
Excerpt (<=80 chars): import React, { Component } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.jsx]---
Location: ToolJet-develop/frontend/src/_ui/Fade/index.jsx
Signals: React
Excerpt (<=80 chars):  export function Fade({ children, visible, ...rest }) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Fade
```

--------------------------------------------------------------------------------

---[FILE: FolderList.jsx]---
Location: ToolJet-develop/frontend/src/_ui/FolderList/FolderList.jsx
Signals: React
Excerpt (<=80 chars): import React, { useState, useRef, useEffect } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: FolderSkeleton.jsx]---
Location: ToolJet-develop/frontend/src/_ui/FolderSkeleton/FolderSkeleton.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: HeaderSkeleton.jsx]---
Location: ToolJet-develop/frontend/src/_ui/FolderSkeleton/HeaderSkeleton.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

````
