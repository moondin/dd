---
source_txt: fullstack_samples/ToolJet-develop
converted_utc: 2025-12-18T10:37:21Z
part: 9
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES ToolJet-develop

## Extracted Reusable Patterns (Non-verbatim) (Part 9 of 37)

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

---[FILE: Datepicker.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/Table/Datepicker.jsx
Signals: React
Excerpt (<=80 chars):  export const getDateTimeFormat = (

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getDateTimeFormat
- Datepicker
```

--------------------------------------------------------------------------------

---[FILE: Filter.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/Table/Filter.jsx
Signals: React
Excerpt (<=80 chars):  export function Filter(props) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Filter
```

--------------------------------------------------------------------------------

---[FILE: GenerateEachCellValue.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/Table/GenerateEachCellValue.jsx
Signals: React
Excerpt (<=80 chars): import React, { useEffect, useRef, useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: GlobalFilter.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/Table/GlobalFilter.jsx
Signals: React
Excerpt (<=80 chars): export const GlobalFilter = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GlobalFilter
```

--------------------------------------------------------------------------------

---[FILE: IndeterminateCheckbox.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/Table/IndeterminateCheckbox.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Json.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/Table/Json.jsx
Signals: React
Excerpt (<=80 chars): /* eslint-disable no-undef */

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Link.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/Table/Link.jsx
Signals: React
Excerpt (<=80 chars):  export const Link = ({ cellValue, linkTarget, underline, underlineColor, lin...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Link
```

--------------------------------------------------------------------------------

---[FILE: OverlayTriggerComponent.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/Table/OverlayTriggerComponent.jsx
Signals: React
Excerpt (<=80 chars): export const OverlayTriggerComponent = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OverlayTriggerComponent
```

--------------------------------------------------------------------------------

---[FILE: Pagination.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/Table/Pagination.jsx
Signals: React
Excerpt (<=80 chars):  export const Pagination = function Pagination({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Pagination
```

--------------------------------------------------------------------------------

---[FILE: Radio.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/Table/Radio.jsx
Signals: React
Excerpt (<=80 chars):  export const Radio = ({ options, value, onChange, readOnly, containerWidth, ...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Radio
```

--------------------------------------------------------------------------------

---[FILE: reducer.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/Table/reducer.js
Signals: N/A
Excerpt (<=80 chars): export const initialState = () => ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- initialState
- reducerActions
- reducer
```

--------------------------------------------------------------------------------

---[FILE: String.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/Table/String.jsx
Signals: React
Excerpt (<=80 chars): import React, { useState, useEffect } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Table.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/Table/Table.jsx
Signals: React
Excerpt (<=80 chars):  export const Table = React.memo(

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Table
```

--------------------------------------------------------------------------------

---[FILE: tableUtils.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/Table/tableUtils.js
Signals: N/A
Excerpt (<=80 chars): export const isRowInValid = (cell, currentState, changeSet, validateWidget, v...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isRowInValid
- textWrapActions
```

--------------------------------------------------------------------------------

---[FILE: Tags.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/Table/Tags.jsx
Signals: React
Excerpt (<=80 chars):  export const Tags = ({ value, onChange, readOnly, containerWidth = '' }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Tags
```

--------------------------------------------------------------------------------

---[FILE: Text.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/Table/Text.jsx
Signals: React
Excerpt (<=80 chars): import React, { useState, useEffect, useRef } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Timepicker.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/Table/Timepicker.jsx
Signals: React
Excerpt (<=80 chars):  export const TimePicker = ({ value, onChange, component }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TimePicker
```

--------------------------------------------------------------------------------

---[FILE: Toggle.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/Table/Toggle.jsx
Signals: React
Excerpt (<=80 chars):  export const Toggle = ({ readOnly, value, onChange, activeColor }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Toggle
```

--------------------------------------------------------------------------------

---[FILE: actions.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/Table/columns/actions.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/Table/columns/index.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: EmptyState.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/Table/Components/EmptyState.jsx
Signals: React
Excerpt (<=80 chars):  export const EmptyState = React.memo(() => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EmptyState
```

--------------------------------------------------------------------------------

---[FILE: Footer.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/Table/Components/Footer.jsx
Signals: React
Excerpt (<=80 chars):  export const Footer = React.memo(

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Footer
```

--------------------------------------------------------------------------------

---[FILE: Header.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/Table/Components/Header.jsx
Signals: React
Excerpt (<=80 chars):  export const Header = React.memo(

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Header
```

--------------------------------------------------------------------------------

---[FILE: LoadingState.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/Table/Components/LoadingState.jsx
Signals: React
Excerpt (<=80 chars):  export const LoadingState = React.memo(() => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LoadingState
```

--------------------------------------------------------------------------------

---[FILE: TableHeader.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/Table/Components/TableHeader.jsx
Signals: React
Excerpt (<=80 chars):  export const TableHeader = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TableHeader
```

--------------------------------------------------------------------------------

---[FILE: TableRow.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/Table/Components/TableRow.jsx
Signals: React
Excerpt (<=80 chars):  export const TableRow = React.memo(

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TableRow
```

--------------------------------------------------------------------------------

---[FILE: ModuleContext.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/_contexts/ModuleContext.jsx
Signals: React
Excerpt (<=80 chars):  export const ModuleContext = createContext();

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ModuleContext
- ModuleProvider
- useModuleContext
- useModuleId
- useIsModuleMode
- useAppType
- useIsModuleEditor
```

--------------------------------------------------------------------------------

---[FILE: createWalkThrough.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/_helpers/createWalkThrough.js
Signals: N/A
Excerpt (<=80 chars):  export const initEditorWalkThrough = () => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- initEditorWalkThrough
```

--------------------------------------------------------------------------------

---[FILE: editorHelpers.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/_helpers/editorHelpers.js
Signals: N/A
Excerpt (<=80 chars):  export function memoizeFunction(func) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- memoizeFunction
- isOnlyLayoutUpdate
- findComponentsWithReferences
- handleLowPriorityWork
- clearAllQueuedTasks
- generatePath
- checkAndExtractEntityId
- AllComponents
- getComponentToRender
- updateCanvasBackground
- computeCanvasContainerHeight
```

--------------------------------------------------------------------------------

---[FILE: useActiveSlot.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/_hooks/useActiveSlot.js
Signals: React
Excerpt (<=80 chars):  export const useActiveSlot = (widgetId) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useActiveSlot
```

--------------------------------------------------------------------------------

---[FILE: useAppData.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/_hooks/useAppData.js
Signals: React
Excerpt (<=80 chars): import { useEffect, useRef, useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: useExposeVariables.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/_hooks/useExposeVariables.js
Signals: React
Excerpt (<=80 chars):  export const useExposeState = (loadingState, visibleState, disabledState, se...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useExposeState
```

--------------------------------------------------------------------------------

---[FILE: usePopoverObserver.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/_hooks/usePopoverObserver.js
Signals: React
Excerpt (<=80 chars): import { useEffect, useRef } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: useSortedComponents.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/_hooks/useSortedComponents.js
Signals: React
Excerpt (<=80 chars): import { useMemo, useRef } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: useSubContainerResizable.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/_hooks/useSubContainerResizable.js
Signals: React
Excerpt (<=80 chars):  export const useSubContainerResizable = (options = {}) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useSubContainerResizable
```

--------------------------------------------------------------------------------

---[FILE: ast.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/_stores/ast.js
Signals: N/A
Excerpt (<=80 chars):  export function extractAndReplaceReferencesFromString(input, componentIdName...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- extractAndReplaceReferencesFromString
```

--------------------------------------------------------------------------------

---[FILE: utils.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/_stores/utils.js
Signals: N/A
Excerpt (<=80 chars):  export function debounce(func) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- debounce
- findAllEntityReferences
- replaceQueryOptionsEntityReferencesWithIds
- createReferencesLookup
- convertAllKeysToSnakeCase
- convertKeysToCamelCase
- zustandDevTools
- create
- resetAllStores
- resolveDynamicValues
- resolveCode
- getDynamicVariables
- removeNestedDoubleCurlyBraces
- extractAndReplaceReferencesFromString
- checkSubstringRegex
- normalizePattern
- replaceEntityReferencesWithIds
- isProperNumber
```

--------------------------------------------------------------------------------

---[FILE: appSlice.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/_stores/slices/appSlice.js
Signals: N/A
Excerpt (<=80 chars):  export const createAppSlice = (set, get) => ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createAppSlice
```

--------------------------------------------------------------------------------

---[FILE: appVersionSlice.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/_stores/slices/appVersionSlice.js
Signals: N/A
Excerpt (<=80 chars):  export const createAppVersionSlice = (set, get) => ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createAppVersionSlice
```

--------------------------------------------------------------------------------

---[FILE: codeHinterSlice.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/_stores/slices/codeHinterSlice.js
Signals: N/A
Excerpt (<=80 chars):  export const createCodeHinterSlice = (set, get) => ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createCodeHinterSlice
```

--------------------------------------------------------------------------------

---[FILE: componentsSlice.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/_stores/slices/componentsSlice.js
Signals: N/A
Excerpt (<=80 chars):  export const createComponentsSlice = (set, get) => ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createComponentsSlice
```

--------------------------------------------------------------------------------

---[FILE: dataQuerySlice.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/_stores/slices/dataQuerySlice.js
Signals: N/A
Excerpt (<=80 chars):  export const createDataQuerySlice = (set, get) => ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createDataQuerySlice
```

--------------------------------------------------------------------------------

---[FILE: dataSourceSlice.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/_stores/slices/dataSourceSlice.js
Signals: N/A
Excerpt (<=80 chars):  export const createDataSourceSlice = (set) => ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createDataSourceSlice
```

--------------------------------------------------------------------------------

---[FILE: debuggerSlice.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/_stores/slices/debuggerSlice.js
Signals: N/A
Excerpt (<=80 chars):  export const createDebuggerSlice = (set, get) => ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createDebuggerSlice
```

--------------------------------------------------------------------------------

---[FILE: dependencySlice.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/_stores/slices/dependencySlice.js
Signals: N/A
Excerpt (<=80 chars):  export const createDependencySlice = (set, get) => ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createDependencySlice
```

--------------------------------------------------------------------------------

---[FILE: editorLicenseSlice.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/_stores/slices/editorLicenseSlice.js
Signals: N/A
Excerpt (<=80 chars):  export const createEditorLicenseSlice = (set) => ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createEditorLicenseSlice
```

--------------------------------------------------------------------------------

---[FILE: environmentsAndVersionsSlice.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/_stores/slices/environmentsAndVersionsSlice.js
Signals: N/A
Excerpt (<=80 chars):  export const createEnvironmentsAndVersionsSlice = (set, get) => ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createEnvironmentsAndVersionsSlice
```

--------------------------------------------------------------------------------

---[FILE: eventsSlice.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/_stores/slices/eventsSlice.js
Signals: React
Excerpt (<=80 chars):  export const useEvents = (moduleId = 'canvas') => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useEvents
- useEventActions
- createEventsSlice
```

--------------------------------------------------------------------------------

---[FILE: formComponentSlice.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/_stores/slices/formComponentSlice.js
Signals: N/A
Excerpt (<=80 chars):  export const createFormComponentSlice = (set, get) => ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createFormComponentSlice
```

--------------------------------------------------------------------------------

---[FILE: gitSyncSlice.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/_stores/slices/gitSyncSlice.js
Signals: N/A
Excerpt (<=80 chars): export const createGitSyncSlice = (set, get) => ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createGitSyncSlice
```

--------------------------------------------------------------------------------

---[FILE: gridSlice.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/_stores/slices/gridSlice.js
Signals: N/A
Excerpt (<=80 chars):  export const createGridSlice = (set, get) => ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createGridSlice
```

--------------------------------------------------------------------------------

---[FILE: inspectorSlice.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/_stores/slices/inspectorSlice.js
Signals: N/A
Excerpt (<=80 chars):  export const createInspectorSlice = (set, get) => ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createInspectorSlice
```

--------------------------------------------------------------------------------

---[FILE: layoutSlice.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/_stores/slices/layoutSlice.js
Signals: N/A
Excerpt (<=80 chars):  export const createLayoutSlice = (set, get) => ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createLayoutSlice
```

--------------------------------------------------------------------------------

---[FILE: leftSideBarSlice.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/_stores/slices/leftSideBarSlice.js
Signals: N/A
Excerpt (<=80 chars):  export const createLeftSideBarSlice = (set, get) => ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createLeftSideBarSlice
```

--------------------------------------------------------------------------------

---[FILE: licenseSlice.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/_stores/slices/licenseSlice.js
Signals: N/A
Excerpt (<=80 chars):  export const createLicenseSlice = (set, get) => ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createLicenseSlice
```

--------------------------------------------------------------------------------

---[FILE: loaderSlice.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/_stores/slices/loaderSlice.js
Signals: N/A
Excerpt (<=80 chars):  export const createLoaderSlice = (set, get) => ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createLoaderSlice
```

--------------------------------------------------------------------------------

---[FILE: modeSlice.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/_stores/slices/modeSlice.js
Signals: N/A
Excerpt (<=80 chars):  export const createModeSlice = (set, get) => ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createModeSlice
```

--------------------------------------------------------------------------------

---[FILE: multiplayerSlice.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/_stores/slices/multiplayerSlice.js
Signals: N/A
Excerpt (<=80 chars):  export const createMultiplayerSlice = (set, get) => ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createMultiplayerSlice
```

--------------------------------------------------------------------------------

---[FILE: organizationSlice.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/_stores/slices/organizationSlice.js
Signals: N/A
Excerpt (<=80 chars):  export const createOrganizationSlice = (set) => ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createOrganizationSlice
```

--------------------------------------------------------------------------------

---[FILE: pageMenuSlice.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/_stores/slices/pageMenuSlice.js
Signals: N/A
Excerpt (<=80 chars):  export const savePageChanges = async (appId, versionId, pageId, diff, operat...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- savePageChanges
- createPageMenuSlice
```

--------------------------------------------------------------------------------

---[FILE: queryPanelSlice.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/_stores/slices/queryPanelSlice.js
Signals: TypeORM
Excerpt (<=80 chars):  export const createQueryPanelSlice = (set, get) => ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createQueryPanelSlice
```

--------------------------------------------------------------------------------

---[FILE: resolvedSlice.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/_stores/slices/resolvedSlice.js
Signals: N/A
Excerpt (<=80 chars):  export const DEFAULT_COMPONENT_STRUCTURE = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DEFAULT_COMPONENT_STRUCTURE
- createResolvedSlice
```

--------------------------------------------------------------------------------

---[FILE: rightSideBarSlice.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/_stores/slices/rightSideBarSlice.js
Signals: N/A
Excerpt (<=80 chars):  export const createRightSideBarSlice = (set, get) => ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createRightSideBarSlice
```

--------------------------------------------------------------------------------

---[FILE: undoRedoSlice.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/_stores/slices/undoRedoSlice.js
Signals: N/A
Excerpt (<=80 chars):  export const createUndoRedoSlice = (set, get) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createUndoRedoSlice
```

--------------------------------------------------------------------------------

---[FILE: userSlice.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/_stores/slices/userSlice.js
Signals: N/A
Excerpt (<=80 chars):  export const createUserSlice = (set) => ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createUserSlice
```

--------------------------------------------------------------------------------

---[FILE: whiteLabellingSlice.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/_stores/slices/whiteLabellingSlice.js
Signals: N/A
Excerpt (<=80 chars):  export const createWhiteLabellingSlice = (set) => ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createWhiteLabellingSlice
```

--------------------------------------------------------------------------------

---[FILE: async-query-handler.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/_utils/async-query-handler.js
Signals: N/A
Excerpt (<=80 chars): export class AsyncQueryHandler {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AsyncQueryHandler
```

--------------------------------------------------------------------------------

---[FILE: auth.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/_utils/auth.js
Signals: N/A
Excerpt (<=80 chars):  export function fetchOAuthToken(authUrl, dataSourceId) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- fetchOAuthToken
- logoutAction
- fetchOauthTokenForSlackAndGSheet
```

--------------------------------------------------------------------------------

---[FILE: component-properties-resolution.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/_utils/component-properties-resolution.js
Signals: N/A
Excerpt (<=80 chars):  export const resolveProperties = (component, currentState, defaultValue, cus...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- resolveProperties
- resolveStyles
- resolveGeneralProperties
- resolveGeneralStyles
```

--------------------------------------------------------------------------------

---[FILE: component-properties-validation.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/_utils/component-properties-validation.js
Signals: N/A
Excerpt (<=80 chars):  export const generateSchemaFromValidationDefinition = (definition, recursion...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- findDefault
- generateSchemaFromValidationDefinition
- validate
- validateProperties
- validateProperty
```

--------------------------------------------------------------------------------

---[FILE: misc.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/_utils/misc.js
Signals: N/A
Excerpt (<=80 chars):  export const navigate = (url, options = {}) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- setTablePageIndex
- navigate
- extractEnvironmentConstantsFromConstantsList
```

--------------------------------------------------------------------------------

---[FILE: queryPanel.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/_utils/queryPanel.js
Signals: N/A
Excerpt (<=80 chars):  export function getQueryVariables(options, state, mappings) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getQueryVariables
- convertMapSet
```

--------------------------------------------------------------------------------

---[FILE: AppLoader.jsx]---
Location: ToolJet-develop/frontend/src/AppLoader/AppLoader.jsx
Signals: React
Excerpt (<=80 chars): import React, { useLayoutEffect } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RenderAppBuilder.jsx]---
Location: ToolJet-develop/frontend/src/AppLoader/RenderAppBuilder.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: avatar.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/Avatar/avatar.jsx
Signals: React
Excerpt (<=80 chars): import * as React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Button.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/Button/Button.jsx
Signals: React
Excerpt (<=80 chars): import React, { forwardRef } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Button.stories.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/Button/Button.stories.jsx
Signals: React
Excerpt (<=80 chars): export const RocketButton = Template.bind({});

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RocketButton
- RocketButtonWithIcon
- RocketButtonWithTrailingIcon
- Icon
```

--------------------------------------------------------------------------------

---[FILE: ButtonUtils.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/Button/ButtonUtils.jsx
Signals: N/A
Excerpt (<=80 chars): export const getDefaultIconFillColor = (variant) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getDefaultIconFillColor
- defaultButtonFillColour
- getIconSize
```

--------------------------------------------------------------------------------

---[FILE: Index.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/Card/Index.jsx
Signals: React
Excerpt (<=80 chars): import * as React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Checkbox.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/Checkbox/Checkbox.jsx
Signals: React
Excerpt (<=80 chars): /* eslint-disable import/no-unresolved */

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Checkbox.stories.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/Checkbox/Checkbox.stories.jsx
Signals: React
Excerpt (<=80 chars):  export const RocketCheckbox = Template.bind({});

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RocketCheckbox
- RocketRadio
- RocketCheckmark
- RocketCheckboxWithLabelAndHelper
- RocketCheckboxWithLeadingLabelAndHelper
- RocketRadioWithLabelAndHelper
- RocketRadioWithLeadingLabelAndHelper
- RocketCheckmarkWithLabelAndHelper
- RocketCheckmarkWithLeadingLabelAndHelper
```

--------------------------------------------------------------------------------

---[FILE: Index.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/Checkbox/Index.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: CheckboxUtils.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/Checkbox/CheckboxUtils/CheckboxUtils.jsx
Signals: React
Excerpt (<=80 chars):  export const CheckboxLabel = ({ label, size, disabled }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CheckboxLabel
- HelperText
```

--------------------------------------------------------------------------------

---[FILE: CheckIcon.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/Checkbox/CheckboxUtils/CheckIcon.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: IntermediateIcon.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/Checkbox/CheckboxUtils/IntermediateIcon.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RadioIcon.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/Checkbox/CheckboxUtils/RadioIcon.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Dropdown.stories.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/Dropdown/Dropdown.stories.jsx
Signals: React
Excerpt (<=80 chars):  export const RocketDropdown = Template.bind({});

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RocketDropdown
- RocketDropdownWithLeadingIcon
- RocketDropdownWithTrailingIcon
- RocketDropdownWithTrailingCounter
- RocketDropdownWithHelperText
```

--------------------------------------------------------------------------------

---[FILE: DropdownProvider.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/Dropdown/DropdownProvider.jsx
Signals: React
Excerpt (<=80 chars): export const DropdownProvider = ({ children }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DropdownProvider
- useDropdownContext
```

--------------------------------------------------------------------------------

---[FILE: Index.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/Dropdown/Index.jsx
Signals: React
Excerpt (<=80 chars): import React, { useState, useRef, useEffect, useCallback } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Select.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/Dropdown/Select.jsx
Signals: React
Excerpt (<=80 chars): import * as React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DropdownUtils.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/Dropdown/DropdownUtils/DropdownUtils.jsx
Signals: React
Excerpt (<=80 chars):  export const dropdownVariants = cva('', {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- dropdownVariants
- LeadingIcon
- TrailingAction
- DropdownArrowIcon
- CheckIcon
- Badge
- ValidationMessage
- HelperMessage
- RequiredIndicator
- DropdownLabel
```

--------------------------------------------------------------------------------

---[FILE: HelperIcon.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/Dropdown/DropdownUtils/HelperIcon.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ValidationIcon.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/Dropdown/DropdownUtils/ValidationIcon.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Fileuploader.stories.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/FileUploader/Fileuploader.stories.jsx
Signals: React
Excerpt (<=80 chars):  export const RocketFileUploader = Template.bind({});

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RocketFileUploader
```

--------------------------------------------------------------------------------

---[FILE: FileList.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/FileUploader/FileList/FileList.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Index.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/FileUploader/FileList/Index.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: FileUpload.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/FileUploader/FileUpload/FileUpload.jsx
Signals: React
Excerpt (<=80 chars): import React, { useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Index.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/FileUploader/FileUpload/Index.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

````
