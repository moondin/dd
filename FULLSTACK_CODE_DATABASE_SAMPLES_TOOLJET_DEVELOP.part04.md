---
source_txt: fullstack_samples/ToolJet-develop
converted_utc: 2025-12-18T10:37:21Z
part: 4
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES ToolJet-develop

## Extracted Reusable Patterns (Non-verbatim) (Part 4 of 37)

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
Location: ToolJet-develop/frontend/src/AppBuilder/CodeBuilder/Elements/Datepicker.jsx
Signals: React
Excerpt (<=80 chars):  export const Datepicker = ({ value, onChange, meta }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Datepicker
```

--------------------------------------------------------------------------------

---[FILE: FxButton.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/CodeBuilder/Elements/FxButton.jsx
Signals: React
Excerpt (<=80 chars): import Fx from '@/_ui/Icon/bulkIcons/Fx';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Icon.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/CodeBuilder/Elements/Icon.jsx
Signals: React
Excerpt (<=80 chars):  export const Icon = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Icon
```

--------------------------------------------------------------------------------

---[FILE: Input.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/CodeBuilder/Elements/Input.jsx
Signals: React
Excerpt (<=80 chars):  export const Input = ({ value, onChange, cyLabel, meta }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Input
```

--------------------------------------------------------------------------------

---[FILE: Json.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/CodeBuilder/Elements/Json.jsx
Signals: React
Excerpt (<=80 chars):  export const Json = ({ value, onChange }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Json
```

--------------------------------------------------------------------------------

---[FILE: Number.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/CodeBuilder/Elements/Number.jsx
Signals: React
Excerpt (<=80 chars):  export const Number = ({ value, onChange, cyLabel }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Number
```

--------------------------------------------------------------------------------

---[FILE: NumberInput.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/CodeBuilder/Elements/NumberInput.jsx
Signals: React
Excerpt (<=80 chars):  export const NumberInput = ({ value, onChange, cyLabel, meta }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NumberInput
```

--------------------------------------------------------------------------------

---[FILE: Query.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/CodeBuilder/Elements/Query.jsx
Signals: React
Excerpt (<=80 chars):  export const Query = ({ value, onChange, meta }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Query
```

--------------------------------------------------------------------------------

---[FILE: Select.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/CodeBuilder/Elements/Select.jsx
Signals: React
Excerpt (<=80 chars):  export const Option = (props) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Option
- Select
```

--------------------------------------------------------------------------------

---[FILE: Slider.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/CodeBuilder/Elements/Slider.jsx
Signals: React
Excerpt (<=80 chars): import React, { useState, useEffect } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Switch.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/CodeBuilder/Elements/Switch.jsx
Signals: React
Excerpt (<=80 chars): import ToggleGroup from '@/ToolJetUI/SwitchGroup/ToggleGroup';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: TableRowHeightInput.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/CodeBuilder/Elements/TableRowHeightInput.jsx
Signals: React
Excerpt (<=80 chars): import React, { useEffect, useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: TimePicker.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/CodeBuilder/Elements/TimePicker.jsx
Signals: React
Excerpt (<=80 chars):  export const TimePicker = ({ value, onChange, meta }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TimePicker
```

--------------------------------------------------------------------------------

---[FILE: Toggle.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/CodeBuilder/Elements/Toggle.jsx
Signals: React
Excerpt (<=80 chars):  export const Toggle = ({ value, onChange, cyLabel, meta }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Toggle
```

--------------------------------------------------------------------------------

---[FILE: utils.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/CodeBuilder/Elements/utils.js
Signals: N/A
Excerpt (<=80 chars):  export const getDate = (date, format) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getDate
```

--------------------------------------------------------------------------------

---[FILE: Visibility.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/CodeBuilder/Elements/Visibility.jsx
Signals: React
Excerpt (<=80 chars):  export const Visibility = ({ onVisibilityChange, styleDefinition }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Visibility
```

--------------------------------------------------------------------------------

---[FILE: ToolTip.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/CodeBuilder/Elements/Components/ToolTip.jsx
Signals: React
Excerpt (<=80 chars):  export const ToolTip = ({ label, meta, labelClass }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ToolTip
```

--------------------------------------------------------------------------------

---[FILE: DropdownMenu.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/CodeBuilder/Elements/DropdownMenu/DropdownMenu.jsx
Signals: React
Excerpt (<=80 chars):  export const DropdownMenu = (props) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DropdownMenu
```

--------------------------------------------------------------------------------

---[FILE: autocompleteExtensionConfig.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/CodeEditor/autocompleteExtensionConfig.js
Signals: N/A
Excerpt (<=80 chars):  export const getAutocompletion = (input, fieldType, hints, totalReferences =...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- findNearestSubstring
- getAutocompletion
- generateHints
```

--------------------------------------------------------------------------------

---[FILE: autocompleteUtils.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/CodeEditor/autocompleteUtils.js
Signals: N/A
Excerpt (<=80 chars): export function getLastSubstring(inputString) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getLastSubstring
- getLastDepth
```

--------------------------------------------------------------------------------

---[FILE: CodeHinter.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/CodeEditor/CodeHinter.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: CodehinterOverlayTriggers.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/CodeEditor/CodehinterOverlayTriggers.jsx
Signals: React
Excerpt (<=80 chars):  export const CodeHinterBtns = ({ view, isPanelOpen, renderCopilot }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CodeHinterBtns
```

--------------------------------------------------------------------------------

---[FILE: DynamicFxTypeRenderer.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/CodeEditor/DynamicFxTypeRenderer.jsx
Signals: React
Excerpt (<=80 chars):  export const DynamicFxTypeRenderer = ({ paramType, ...restProps }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DynamicFxTypeRenderer
```

--------------------------------------------------------------------------------

---[FILE: FixWithAi.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/CodeEditor/FixWithAi.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: MultiLineCodeEditor.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/CodeEditor/MultiLineCodeEditor.jsx
Signals: React
Excerpt (<=80 chars): /* eslint-disable import/no-unresolved */

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: PreviewBox.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/CodeEditor/PreviewBox.jsx
Signals: React
Excerpt (<=80 chars):  export const PreviewBox = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PreviewBox
```

--------------------------------------------------------------------------------

---[FILE: SearchBox.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/CodeEditor/SearchBox.jsx
Signals: React
Excerpt (<=80 chars):  export const handleSearchPanel = (view) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- handleSearchPanel
```

--------------------------------------------------------------------------------

---[FILE: SingleLineCodeEditor.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/CodeEditor/SingleLineCodeEditor.jsx
Signals: React
Excerpt (<=80 chars): /* eslint-disable import/no-unresolved */

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: TJDBHinter.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/CodeEditor/TJDBHinter.jsx
Signals: React
Excerpt (<=80 chars): /* eslint-disable import/no-unresolved */

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: useQueryPanelKeyHooks.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/CodeEditor/useQueryPanelKeyHooks.js
Signals: React
Excerpt (<=80 chars):  export const useQueryPanelKeyHooks = (onChange, value, type) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useQueryPanelKeyHooks
```

--------------------------------------------------------------------------------

---[FILE: utils.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/CodeEditor/utils.js
Signals: N/A
Excerpt (<=80 chars):  export const getCurrentNodeType = (node) => Object.prototype.toString.call(n...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- computeCoercion
- hasDeepChildren
- getCurrentNodeType
- isInsideParent
- createJavaScriptSuggestions
- resolveReferences
- paramValidation
- FxParamTypeMapping
- validateComponentProperty
```

--------------------------------------------------------------------------------

---[FILE: AppCanvasBanner.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Header/AppCanvasBanner.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: BuildSuggestions.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Header/BuildSuggestions.jsx
Signals: React
Excerpt (<=80 chars): import { useEffect, useRef } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: CreateVersionModal.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Header/CreateVersionModal.jsx
Signals: React
Excerpt (<=80 chars): import React, { useEffect, useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: CustomSelect.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Header/CustomSelect.jsx
Signals: React
Excerpt (<=80 chars):  export const SingleValue = ({ selectProps }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SingleValue
- CustomSelect
```

--------------------------------------------------------------------------------

---[FILE: EditAppName.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Header/EditAppName.jsx
Signals: React
Excerpt (<=80 chars): import React, { useRef, useEffect, useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: EditorHeader.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Header/EditorHeader.jsx
Signals: React
Excerpt (<=80 chars):  export const EditorHeader = ({ darkMode, isUserInZeroToOneFlow }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EditorHeader
```

--------------------------------------------------------------------------------

---[FILE: EditVersionModal.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Header/EditVersionModal.jsx
Signals: React
Excerpt (<=80 chars):  export const EditVersionModal = ({ setShowEditAppVersion, showEditAppVersion...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EditVersionModal
```

--------------------------------------------------------------------------------

---[FILE: EnvironmentSelectBox.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Header/EnvironmentSelectBox.jsx
Signals: React
Excerpt (<=80 chars): import React, { useState, useRef, useEffect } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: FreezeVersionInfo.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Header/FreezeVersionInfo.jsx
Signals: React
Excerpt (<=80 chars): import React, { useEffect, useCallback } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: GitSyncManager.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Header/GitSyncManager.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: HeaderActions.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Header/HeaderActions.jsx
Signals: React
Excerpt (<=80 chars): import React, { useMemo, useCallback } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: InfoOrErrorBox.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Header/InfoOrErrorBox.jsx
Signals: React
Excerpt (<=80 chars):  export const InfoOrErrorBox = ({ active, message, isError, isWarning, darkMo...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InfoOrErrorBox
```

--------------------------------------------------------------------------------

---[FILE: ReleaseConfirmation.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Header/ReleaseConfirmation.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ReleasedVersionError.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Header/ReleasedVersionError.jsx
Signals: React
Excerpt (<=80 chars):  export const ReleasedVersionError = () => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ReleasedVersionError
```

--------------------------------------------------------------------------------

---[FILE: Steps.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Header/Steps.jsx
Signals: React
Excerpt (<=80 chars): import React, { Children } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: UpdatePresenceMultiPlayer.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Header/UpdatePresenceMultiPlayer.jsx
Signals: React
Excerpt (<=80 chars): import React, { useEffect } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: AppVersionsManager.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Header/AppVersionsManager/AppVersionsManager.jsx
Signals: React
Excerpt (<=80 chars):  export const AppVersionsManager = function ({ darkMode }) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AppVersionsManager
```

--------------------------------------------------------------------------------

---[FILE: EnvironmentSelectBox.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Header/EnvironmentManager/EnvironmentSelectBox.jsx
Signals: React
Excerpt (<=80 chars): import React, { useState, useRef, useEffect, useCallback } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ManageAppUsers copy.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Header/RightTopHeaderButtons/ManageAppUsers copy.jsx
Signals: React
Excerpt (<=80 chars):  export const ManageAppUsers = withTranslation()(ManageAppUsersComponent);

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ManageAppUsers
```

--------------------------------------------------------------------------------

---[FILE: ManageAppUsers.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Header/RightTopHeaderButtons/ManageAppUsers.jsx
Signals: React
Excerpt (<=80 chars):  export const ManageAppUsers = withTranslation()(ManageAppUsersComponent);

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ManageAppUsers
```

--------------------------------------------------------------------------------

---[FILE: ReleaseVersionButton.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Header/RightTopHeaderButtons/ReleaseVersionButton.jsx
Signals: React
Excerpt (<=80 chars): import React, { useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RightTopHeaderButtons.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Header/RightTopHeaderButtons/RightTopHeaderButtons.jsx
Signals: React
Excerpt (<=80 chars): import React, { useEffect, useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: LeftSidebar.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/LeftSidebar/LeftSidebar.jsx
Signals: React, TypeORM
Excerpt (<=80 chars): export const BaseLeftSidebar = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BaseLeftSidebar
- LeftSidebar
```

--------------------------------------------------------------------------------

---[FILE: leftSidebarConstants.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/LeftSidebar/leftSidebarConstants.js
Signals: N/A
Excerpt (<=80 chars): export const staticDataSources = [

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- staticDataSources
```

--------------------------------------------------------------------------------

---[FILE: Debugger.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/LeftSidebar/Debugger/Debugger.jsx
Signals: React
Excerpt (<=80 chars): import React, { useMemo } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: AppExport.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/LeftSidebar/GlobalSettings/AppExport.jsx
Signals: React
Excerpt (<=80 chars): import React, { useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: AppModeToggle.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/LeftSidebar/GlobalSettings/AppModeToggle.jsx
Signals: React
Excerpt (<=80 chars):  export const APP_MODES = [

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- APP_MODES
```

--------------------------------------------------------------------------------

---[FILE: CanvasSettings.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/LeftSidebar/GlobalSettings/CanvasSettings.jsx
Signals: React
Excerpt (<=80 chars): import React, { useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: HideHeaderToggle.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/LeftSidebar/GlobalSettings/HideHeaderToggle.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/LeftSidebar/GlobalSettings/index.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: MaintenanceMode.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/LeftSidebar/GlobalSettings/MaintenanceMode.jsx
Signals: React
Excerpt (<=80 chars): import React, { useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: SlugInput.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/LeftSidebar/GlobalSettings/SlugInput.jsx
Signals: React
Excerpt (<=80 chars): import React, { useEffect, useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DefaultCopyIcon.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/LeftSidebar/LeftSidebarInspector/DefaultCopyIcon.jsx
Signals: React
Excerpt (<=80 chars):  export const DefaultCopyIcon = ({ height = 12, width = 12, fill = '#6A727C' ...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DefaultCopyIcon
```

--------------------------------------------------------------------------------

---[FILE: HiddenOptions.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/LeftSidebar/LeftSidebarInspector/HiddenOptions.jsx
Signals: React
Excerpt (<=80 chars):  export const HiddenOptions = (props) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HiddenOptions
```

--------------------------------------------------------------------------------

---[FILE: JSONTreeViewerV2.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/LeftSidebar/LeftSidebarInspector/JSONTreeViewerV2.jsx
Signals: React
Excerpt (<=80 chars): import React, { useMemo } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: JSONViewer.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/LeftSidebar/LeftSidebarInspector/JSONViewer.jsx
Signals: React
Excerpt (<=80 chars):  export const JSONViewer = (props) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- JSONViewer
```

--------------------------------------------------------------------------------

---[FILE: LeftSidebarInspector.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/LeftSidebar/LeftSidebarInspector/LeftSidebarInspector.jsx
Signals: React
Excerpt (<=80 chars): import React, { useEffect, useMemo, useRef, useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Node.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/LeftSidebar/LeftSidebarInspector/Node.jsx
Signals: React
Excerpt (<=80 chars):  export const Node = (props) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Node
```

--------------------------------------------------------------------------------

---[FILE: TreeViewHeader.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/LeftSidebar/LeftSidebarInspector/TreeViewHeader.jsx
Signals: React
Excerpt (<=80 chars):  export const TreeViewHeader = (props) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TreeViewHeader
```

--------------------------------------------------------------------------------

---[FILE: useIconList.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/LeftSidebar/LeftSidebarInspector/useIconList.js
Signals: React
Excerpt (<=80 chars): import React, { useMemo } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: utils.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/LeftSidebar/LeftSidebarInspector/utils.js
Signals: N/A
Excerpt (<=80 chars):  export const formatInspectorDataMisc = (obj, type, searchablePaths = new Set...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- formatInspectorDataMisc
- formatInspectorQueryData
- extractComponentName
- copyToClipboard
- formatPathForCopy
```

--------------------------------------------------------------------------------

---[FILE: CustomJSONViewer.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/LeftSidebar/LeftSidebarInspector/CustomJSONViewer/CustomJSONViewer.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ArrayNode.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/LeftSidebar/LeftSidebarInspector/CustomJSONViewer/Components/ArrayNode.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: BooleanNode.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/LeftSidebar/LeftSidebarInspector/CustomJSONViewer/Components/BooleanNode.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: FunctionNode.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/LeftSidebar/LeftSidebarInspector/CustomJSONViewer/Components/FunctionNode.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: NullNode.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/LeftSidebar/LeftSidebarInspector/CustomJSONViewer/Components/NullNode.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: NumberNode.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/LeftSidebar/LeftSidebarInspector/CustomJSONViewer/Components/NumberNode.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ObjectNode.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/LeftSidebar/LeftSidebarInspector/CustomJSONViewer/Components/ObjectNode.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Row.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/LeftSidebar/LeftSidebarInspector/CustomJSONViewer/Components/Row.jsx
Signals: React
Excerpt (<=80 chars): import React, { useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: StringNode.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/LeftSidebar/LeftSidebarInspector/CustomJSONViewer/Components/StringNode.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: SidebarItem.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/LeftSidebar/SidebarItem/SidebarItem.jsx
Signals: React
Excerpt (<=80 chars): export const SidebarItem = forwardRef(

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SidebarItem
```

--------------------------------------------------------------------------------

---[FILE: index.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/LeftSidebar/SupportButton/index.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Popups.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Popups/Popups.jsx
Signals: React
Excerpt (<=80 chars):  export const Popups = ({ darkMode }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Popups
```

--------------------------------------------------------------------------------

---[FILE: AddGlobalDataSourceButton.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/AddGlobalDataSourceButton.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: constants.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/constants.js
Signals: N/A
Excerpt (<=80 chars):  export const staticDataSources = allStaticDataSources.filter(

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- staticDataSources
- tabs
- getTheme
- customToggles
- RestAPIToggles
- mockDataQueryAsComponent
- schemaUnavailableOptions
- defaultSources
```

--------------------------------------------------------------------------------

---[FILE: EmptyGlobalDataSources.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/EmptyGlobalDataSources.jsx
Signals: React, TypeORM
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: QueryManager.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/QueryManager.jsx
Signals: React, TypeORM
Excerpt (<=80 chars): import React, { useEffect, useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: AddGlobalDataSourceButton.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/Components/AddGlobalDataSourceButton.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ChangeDataSource.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/Components/ChangeDataSource.jsx
Signals: React, TypeORM
Excerpt (<=80 chars):  export const ChangeDataSource = ({ dataSources, onChange, value, isVersionRe...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ChangeDataSource
```

--------------------------------------------------------------------------------

---[FILE: CustomToggleSwitch.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/Components/CustomToggleSwitch.jsx
Signals: React
Excerpt (<=80 chars):  export const CustomToggleSwitch = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CustomToggleSwitch
```

--------------------------------------------------------------------------------

---[FILE: DataSourceIcon.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/Components/DataSourceIcon.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DataSourcePicker.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/Components/DataSourcePicker.jsx
Signals: React, TypeORM
Excerpt (<=80 chars): import React, { useState, useEffect } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DataSourceSelect.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/Components/DataSourceSelect.jsx
Signals: React, TypeORM
Excerpt (<=80 chars): import React, { useState, useEffect } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: EmptyGlobalDataSources.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/Components/EmptyGlobalDataSources.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ParameterDetails.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/Components/ParameterDetails.jsx
Signals: React
Excerpt (<=80 chars):  export const PillButton = ({ name, onClick, onRemove, marginBottom, classNam...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PillButton
```

--------------------------------------------------------------------------------

---[FILE: ParameterForm.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/Components/ParameterForm.jsx
Signals: React
Excerpt (<=80 chars): import React, { useEffect, useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ParameterList.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/Components/ParameterList.jsx
Signals: React
Excerpt (<=80 chars): import React, { useEffect, useRef, useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

````
