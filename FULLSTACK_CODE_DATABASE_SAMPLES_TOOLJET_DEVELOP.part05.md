---
source_txt: fullstack_samples/ToolJet-develop
converted_utc: 2025-12-18T10:37:21Z
part: 5
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES ToolJet-develop

## Extracted Reusable Patterns (Non-verbatim) (Part 5 of 37)

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

---[FILE: Preview.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/Components/Preview.jsx
Signals: React
Excerpt (<=80 chars): import React, { useEffect, useLayoutEffect, useRef, useState, useMemo } from ...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: QueryManagerBody.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/Components/QueryManagerBody.jsx
Signals: React, TypeORM
Excerpt (<=80 chars):  export const BaseQueryManagerBody = ({ darkMode, activeTab, renderCopilot = ...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BaseQueryManagerBody
```

--------------------------------------------------------------------------------

---[FILE: QueryManagerHeader.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/Components/QueryManagerHeader.jsx
Signals: React, TypeORM
Excerpt (<=80 chars):  export const QueryManagerHeader = forwardRef(({ darkMode, setActiveTab, acti...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QueryManagerHeader
```

--------------------------------------------------------------------------------

---[FILE: SuccessNotificationInputs.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/Components/SuccessNotificationInputs.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Transformation.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/Components/Transformation.jsx
Signals: React
Excerpt (<=80 chars):  export const Transformation = ({ changeOption, options, darkMode, queryId, r...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Transformation
```

--------------------------------------------------------------------------------

---[FILE: BreadcrumbsIcon.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/Icons/BreadcrumbsIcon.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: CreateIcon.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/Icons/CreateIcon.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: PreviewIcon.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/Icons/PreviewIcon.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RenameIcon.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/Icons/RenameIcon.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RunIcon.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/Icons/RunIcon.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ToggleQueryEditorIcon.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/Icons/ToggleQueryEditorIcon.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: GRPC.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/QueryEditors/GRPC.jsx
Signals: React
Excerpt (<=80 chars):  export const BaseUrl = ({ dataSourceURL, theme }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BaseUrl
```

--------------------------------------------------------------------------------

---[FILE: index.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/QueryEditors/index.js
Signals: React
Excerpt (<=80 chars):  export const allSources = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- allSources
- source
```

--------------------------------------------------------------------------------

---[FILE: Openapi.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/QueryEditors/Openapi.jsx
Signals: React
Excerpt (<=80 chars):  export const Openapi = withTranslation()(OpenapiComponent);

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Openapi
```

--------------------------------------------------------------------------------

---[FILE: Runpy.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/QueryEditors/Runpy.jsx
Signals: React
Excerpt (<=80 chars):  export class Runpy extends React.Component {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Runpy
```

--------------------------------------------------------------------------------

---[FILE: utils.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/QueryEditors/utils.js
Signals: N/A
Excerpt (<=80 chars): export function changeOption(_ref, option, value) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- changeOption
```

--------------------------------------------------------------------------------

---[FILE: Workflows.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/QueryEditors/Workflows.jsx
Signals: React
Excerpt (<=80 chars):  export function Workflows({ options, optionsChanged, currentState }) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Workflows
```

--------------------------------------------------------------------------------

---[FILE: BaseUrl.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/QueryEditors/Restapi/BaseUrl.jsx
Signals: React
Excerpt (<=80 chars):  export const BaseUrl = ({ dataSourceURL, theme, className = 'col-auto', styl...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BaseUrl
```

--------------------------------------------------------------------------------

---[FILE: EmptyTabContent.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/QueryEditors/Restapi/EmptyTabContent.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: GroupHeader.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/QueryEditors/Restapi/GroupHeader.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/QueryEditors/Restapi/index.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: TabBody.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/QueryEditors/Restapi/TabBody.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: TabContent.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/QueryEditors/Restapi/TabContent.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: TabCookies.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/QueryEditors/Restapi/TabCookies.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: TabHeaders.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/QueryEditors/Restapi/TabHeaders.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: TabParams.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/QueryEditors/Restapi/TabParams.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Tabs.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/QueryEditors/Restapi/Tabs.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Runjs.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/QueryEditors/Runjs/Runjs.jsx
Signals: React
Excerpt (<=80 chars): import React, { useState, useEffect } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: BulkUploadPrimaryKey.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/QueryEditors/TooljetDatabase/BulkUploadPrimaryKey.jsx
Signals: React
Excerpt (<=80 chars):  export const BulkUploadPrimaryKey = () => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BulkUploadPrimaryKey
```

--------------------------------------------------------------------------------

---[FILE: BulkUpsertPrimaryKey.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/QueryEditors/TooljetDatabase/BulkUpsertPrimaryKey.jsx
Signals: React
Excerpt (<=80 chars):  export const BulkUpsertPrimaryKey = () => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BulkUpsertPrimaryKey
```

--------------------------------------------------------------------------------

---[FILE: Confirm.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/QueryEditors/TooljetDatabase/Confirm.jsx
Signals: React
Excerpt (<=80 chars): import React, { useCallback, useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: CreateRow.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/QueryEditors/TooljetDatabase/CreateRow.jsx
Signals: React
Excerpt (<=80 chars):  export const CreateRow = React.memo(({ optionchanged, options, darkMode }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateRow
```

--------------------------------------------------------------------------------

---[FILE: DeleteRows.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/QueryEditors/TooljetDatabase/DeleteRows.jsx
Signals: React
Excerpt (<=80 chars):  export const DeleteRows = React.memo(({ darkMode }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeleteRows
```

--------------------------------------------------------------------------------

---[FILE: DropDownSelect.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/QueryEditors/TooljetDatabase/DropDownSelect.jsx
Signals: React
Excerpt (<=80 chars): import React, { useEffect, useRef, useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: JoinConstraint.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/QueryEditors/TooljetDatabase/JoinConstraint.jsx
Signals: React
Excerpt (<=80 chars): import React, { useContext } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: JoinSelect.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/QueryEditors/TooljetDatabase/JoinSelect.jsx
Signals: React
Excerpt (<=80 chars): import React, { useContext, useEffect, useRef, useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: JoinSort.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/QueryEditors/TooljetDatabase/JoinSort.jsx
Signals: React
Excerpt (<=80 chars): import React, { useContext } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: JoinTable.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/QueryEditors/TooljetDatabase/JoinTable.jsx
Signals: React
Excerpt (<=80 chars):  export const JoinTable = React.memo(({ darkMode }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- JoinTable
```

--------------------------------------------------------------------------------

---[FILE: ListRows.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/QueryEditors/TooljetDatabase/ListRows.jsx
Signals: React
Excerpt (<=80 chars):  export const ListRows = React.memo(({ darkMode }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListRows
```

--------------------------------------------------------------------------------

---[FILE: NoConditionUI.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/QueryEditors/TooljetDatabase/NoConditionUI.jsx
Signals: React
Excerpt (<=80 chars): export const NoCondition = ({ text = 'There are no condition' }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NoCondition
```

--------------------------------------------------------------------------------

---[FILE: RenderColumnUI.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/QueryEditors/TooljetDatabase/RenderColumnUI.jsx
Signals: React
Excerpt (<=80 chars): import CodeHinter from '@/AppBuilder/CodeEditor';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RenderFilterSectionUI.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/QueryEditors/TooljetDatabase/RenderFilterSectionUI.jsx
Signals: React
Excerpt (<=80 chars): import CodeHinter from '@/AppBuilder/CodeEditor';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RenderSortUI.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/QueryEditors/TooljetDatabase/RenderSortUI.jsx
Signals: React
Excerpt (<=80 chars): import CodeHinter from '@/AppBuilder/CodeEditor';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: SelectBox.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/QueryEditors/TooljetDatabase/SelectBox.jsx
Signals: React, TypeORM
Excerpt (<=80 chars): import React, { isValidElement, useCallback, useState, useRef, useEffect } fr...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ToolJetDbOperations.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/QueryEditors/TooljetDatabase/ToolJetDbOperations.jsx
Signals: React
Excerpt (<=80 chars): import React, { useState, useEffect, useMemo, useRef } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: UpdateRows.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/QueryEditors/TooljetDatabase/UpdateRows.jsx
Signals: React
Excerpt (<=80 chars):  export const UpdateRows = React.memo(({ darkMode }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateRows
```

--------------------------------------------------------------------------------

---[FILE: util.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/QueryEditors/TooljetDatabase/util.js
Signals: N/A
Excerpt (<=80 chars): export const hasNullValueInFilters = (queryOptions, operation) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- hasNullValueInFilters
- isOperatorOptions
- filterOperatorOptions
- nullOperatorOptions
- convertToDateType
- convertDateToTimeZoneFormatted
- formatDate
- getUTCOffset
- timeZonesWithOffsets
- getLocalTimeZone
```

--------------------------------------------------------------------------------

---[FILE: index.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/QueryEditors/TooljetDatabase/AggregateUI/index.jsx
Signals: React
Excerpt (<=80 chars): export const AggregateFilter = ({ darkMode, operation = '' }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AggregateFilter
```

--------------------------------------------------------------------------------

---[FILE: Select.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/QueryEditors/TooljetDatabase/AggregateUI/Select.jsx
Signals: React
Excerpt (<=80 chars):  export const SelectBox = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SelectBox
```

--------------------------------------------------------------------------------

---[FILE: DateTimePicker.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryManager/QueryEditors/TooljetDatabase/DateTimePicker/DateTimePicker.jsx
Signals: React
Excerpt (<=80 chars): export const DateTimePicker = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DateTimePicker
```

--------------------------------------------------------------------------------

---[FILE: FilterandSortPopup.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryPanel/FilterandSortPopup.jsx
Signals: React, TypeORM
Excerpt (<=80 chars): import React, { useEffect, useRef, useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: QueryCard.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryPanel/QueryCard.jsx
Signals: React
Excerpt (<=80 chars):  export const QueryCard = ({ dataQuery, darkMode = false, localDs }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QueryCard
```

--------------------------------------------------------------------------------

---[FILE: QueryCardMenu.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryPanel/QueryCardMenu.jsx
Signals: React
Excerpt (<=80 chars): import React, { useCallback } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: QueryDataPane.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryPanel/QueryDataPane.jsx
Signals: React, TypeORM
Excerpt (<=80 chars):  export const QueryDataPane = ({ darkMode }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QueryDataPane
```

--------------------------------------------------------------------------------

---[FILE: QueryKeyHooks.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryPanel/QueryKeyHooks.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: QueryPanel.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryPanel/QueryPanel.jsx
Signals: React
Excerpt (<=80 chars):  export const QueryPanel = ({ darkMode }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QueryPanel
```

--------------------------------------------------------------------------------

---[FILE: QueryRenameInput.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/QueryPanel/QueryRenameInput.jsx
Signals: React
Excerpt (<=80 chars):  export const QueryRenameInput = ({ dataQuery, darkMode, onUpdate }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QueryRenameInput
```

--------------------------------------------------------------------------------

---[FILE: RightSideBar.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/RightSideBar.jsx
Signals: React
Excerpt (<=80 chars):  export const RightSideBar = ({ darkMode }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RightSideBar
```

--------------------------------------------------------------------------------

---[FILE: rightSidebarConstants.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/rightSidebarConstants.js
Signals: N/A
Excerpt (<=80 chars): export const RIGHT_SIDE_BAR_TAB = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RIGHT_SIDE_BAR_TAB
```

--------------------------------------------------------------------------------

---[FILE: RightSidebarToggle.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/RightSidebarToggle.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: SidebarItem.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/SidebarItem.jsx
Signals: React
Excerpt (<=80 chars): export const SidebarItem = forwardRef(

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SidebarItem
```

--------------------------------------------------------------------------------

---[FILE: ComponentConfigurationTab.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/ComponentConfigurationTab/ComponentConfigurationTab.jsx
Signals: React
Excerpt (<=80 chars):  export const ComponentConfigurationTab = ({ darkMode, isModuleEditor }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ComponentConfigurationTab
```

--------------------------------------------------------------------------------

---[FILE: ComponentsManagerTab.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/ComponentManagerTab/ComponentsManagerTab.jsx
Signals: React
Excerpt (<=80 chars):  export const ComponentsManagerTab = ({ darkMode, isModuleEditor }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ComponentsManagerTab
```

--------------------------------------------------------------------------------

---[FILE: constants.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/ComponentManagerTab/constants.js
Signals: N/A
Excerpt (<=80 chars): export const LEGACY_ITEMS = [

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LEGACY_ITEMS
- IGNORED_ITEMS
```

--------------------------------------------------------------------------------

---[FILE: DragLayer.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/ComponentManagerTab/DragLayer.jsx
Signals: React
Excerpt (<=80 chars):  export const DragLayer = ({ index, component, isModuleTab = false, disabled ...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DragLayer
```

--------------------------------------------------------------------------------

---[FILE: ComponentModuleTab.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/ComponentManagerTab/ComponentModuleTab/ComponentModuleTab.jsx
Signals: React
Excerpt (<=80 chars):  export const ComponentModuleTab = ({ onChangeTab, hasModuleAccess }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ComponentModuleTab
```

--------------------------------------------------------------------------------

---[FILE: EventManager.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/EventManager.jsx
Signals: React
Excerpt (<=80 chars):  export const EventManager = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EventManager
```

--------------------------------------------------------------------------------

---[FILE: Inspector.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Inspector.jsx
Signals: React
Excerpt (<=80 chars):  export const Inspector = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Inspector
```

--------------------------------------------------------------------------------

---[FILE: ManageEventButton.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/ManageEventButton.jsx
Signals: React
Excerpt (<=80 chars): import React, { useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: QuerySelector.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/QuerySelector.jsx
Signals: React
Excerpt (<=80 chars):  export const QuerySelector = ({ param, definition, eventOptionUpdated, dataQ...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QuerySelector
```

--------------------------------------------------------------------------------

---[FILE: TypeMapping.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/TypeMapping.js
Signals: N/A
Excerpt (<=80 chars): export const TypeMapping = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TypeMapping
```

--------------------------------------------------------------------------------

---[FILE: Utils.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Utils.js
Signals: React
Excerpt (<=80 chars):  export function renderQuerySelector(component, dataQueries, eventOptionUpdat...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- renderQuerySelector
- renderCustomStyles
- renderElement
```

--------------------------------------------------------------------------------

---[FILE: GotoApp.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/ActionConfigurationPanels/GotoApp.jsx
Signals: React
Excerpt (<=80 chars):  export function GotoApp({ getAllApps, event, handlerChanged, eventIndex, dar...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GotoApp
```

--------------------------------------------------------------------------------

---[FILE: RunjsParamters.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/ActionConfigurationPanels/RunjsParamters.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: SwitchPage.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/ActionConfigurationPanels/SwitchPage.jsx
Signals: React
Excerpt (<=80 chars):  export function SwitchPage({ getPages, event, handlerChanged, eventIndex, da...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SwitchPage
```

--------------------------------------------------------------------------------

---[FILE: Chart.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Chart.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Chat.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Chat.jsx
Signals: React
Excerpt (<=80 chars):  export const Chat = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Chat
```

--------------------------------------------------------------------------------

---[FILE: CustomComponent.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/CustomComponent.jsx
Signals: React
Excerpt (<=80 chars):  export const CustomComponent = function CustomComponent({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CustomComponent
```

--------------------------------------------------------------------------------

---[FILE: DatetimePickerV2.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/DatetimePickerV2.jsx
Signals: React
Excerpt (<=80 chars):  export const DATE_FORMAT_OPTIONS = [

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DATE_FORMAT_OPTIONS
- TIME_FORMAT_OPTIONS
- TIMEZONE_OPTIONS
- TIMEZONE_OPTIONS_MAP
```

--------------------------------------------------------------------------------

---[FILE: DefaultComponent.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/DefaultComponent.jsx
Signals: React
Excerpt (<=80 chars):  export const DefaultComponent = ({ componentMeta, darkMode, ...restProps }) ...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DefaultComponent
- baseComponentProperties
```

--------------------------------------------------------------------------------

---[FILE: FilePicker.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/FilePicker.jsx
Signals: React
Excerpt (<=80 chars):  export const FilePicker = ({ componentMeta, darkMode, ...restProps }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FilePicker
```

--------------------------------------------------------------------------------

---[FILE: Icon.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Icon.jsx
Signals: React
Excerpt (<=80 chars):  export function Icon({ componentMeta, darkMode, ...restProps }) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Icon
```

--------------------------------------------------------------------------------

---[FILE: Modal.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Modal.jsx
Signals: React
Excerpt (<=80 chars):  export const Modal = ({ componentMeta, darkMode, ...restProps }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Modal
```

--------------------------------------------------------------------------------

---[FILE: ModalV2.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/ModalV2.jsx
Signals: React
Excerpt (<=80 chars):  export const ModalV2 = ({ componentMeta, darkMode, ...restProps }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ModalV2
```

--------------------------------------------------------------------------------

---[FILE: Select.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Select.jsx
Signals: React
Excerpt (<=80 chars):  export function Select({ componentMeta, darkMode, ...restProps }) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Select
```

--------------------------------------------------------------------------------

---[FILE: Steps.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Steps.jsx
Signals: React
Excerpt (<=80 chars):  export function Steps({ componentMeta, darkMode, ...restProps }) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Steps
```

--------------------------------------------------------------------------------

---[FILE: TabComponent.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/TabComponent.jsx
Signals: React
Excerpt (<=80 chars):  export function TabsLayout({ componentMeta, darkMode, ...restProps }) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TabsLayout
```

--------------------------------------------------------------------------------

---[FILE: CurrencyInput.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/CurrencyInput/CurrencyInput.jsx
Signals: React
Excerpt (<=80 chars):  export const CurrencyInput = ({ componentMeta, darkMode, ...restProps }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CurrencyInput
```

--------------------------------------------------------------------------------

---[FILE: constants.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Form/constants.js
Signals: N/A
Excerpt (<=80 chars): export const DATATYPE_TO_COMPONENT = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DATATYPE_TO_COMPONENT
- COMPONENT_WITH_OPTIONS
- INPUT_COMPONENTS_FOR_FORM
- JSON_DIFFERENCE
- FORM_STATUS
- COMPONENT_LAYOUT_DETAILS
```

--------------------------------------------------------------------------------

---[FILE: Form.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Form/Form.jsx
Signals: React
Excerpt (<=80 chars):  export const Form = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Form
```

--------------------------------------------------------------------------------

---[FILE: accordionConfig.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Form/config/accordionConfig.js
Signals: React
Excerpt (<=80 chars):  export const createAccordionItems = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createAccordionItems
```

--------------------------------------------------------------------------------

---[FILE: columnMappingHandlers.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Form/handlers/columnMappingHandlers.js
Signals: N/A
Excerpt (<=80 chars):  export const createColumnMappingHandler = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createColumnMappingHandler
```

--------------------------------------------------------------------------------

---[FILE: jsonDataHandlers.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Form/handlers/jsonDataHandlers.js
Signals: N/A
Excerpt (<=80 chars):  export const createJSONDataBlurHandler = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createJSONDataBlurHandler
```

--------------------------------------------------------------------------------

---[FILE: parameterHandlers.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Form/handlers/parameterHandlers.js
Signals: N/A
Excerpt (<=80 chars):  export const createParamUpdatedInterceptor = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createParamUpdatedInterceptor
```

--------------------------------------------------------------------------------

---[FILE: componentMetaUtils.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Form/utils/componentMetaUtils.js
Signals: N/A
Excerpt (<=80 chars):  export const processComponentMeta = (componentMeta, component, allComponents...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- processComponentMeta
```

--------------------------------------------------------------------------------

---[FILE: fieldOperations.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Form/utils/fieldOperations.js
Signals: N/A
Excerpt (<=80 chars):  export const createNewComponentFromMeta = (column, parentId, nextTop) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createNewComponentFromMeta
- updateFormFieldComponent
- getFieldDataFromComponent
```

--------------------------------------------------------------------------------

````
