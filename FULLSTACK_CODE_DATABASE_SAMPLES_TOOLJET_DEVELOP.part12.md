---
source_txt: fullstack_samples/ToolJet-develop
converted_utc: 2025-12-18T10:37:21Z
part: 12
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES ToolJet-develop

## Extracted Reusable Patterns (Non-verbatim) (Part 12 of 37)

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

---[FILE: GenerateEachCellValue.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Table/GenerateEachCellValue.jsx
Signals: React
Excerpt (<=80 chars): import React, { useEffect, useRef, useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: GlobalFilter.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Table/GlobalFilter.jsx
Signals: React
Excerpt (<=80 chars): export const GlobalFilter = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GlobalFilter
```

--------------------------------------------------------------------------------

---[FILE: IndeterminateCheckbox.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Table/IndeterminateCheckbox.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Link.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Table/Link.jsx
Signals: React
Excerpt (<=80 chars):  export const Link = ({ cellValue, linkTarget, underline, underlineColor, lin...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Link
```

--------------------------------------------------------------------------------

---[FILE: OverlayTriggerComponent.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Table/OverlayTriggerComponent.jsx
Signals: React
Excerpt (<=80 chars): export const OverlayTriggerComponent = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OverlayTriggerComponent
```

--------------------------------------------------------------------------------

---[FILE: Pagination.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Table/Pagination.jsx
Signals: React
Excerpt (<=80 chars):  export const Pagination = function Pagination({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Pagination
```

--------------------------------------------------------------------------------

---[FILE: Radio.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Table/Radio.jsx
Signals: React
Excerpt (<=80 chars):  export const Radio = ({ options, value, onChange, readOnly, containerWidth, ...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Radio
```

--------------------------------------------------------------------------------

---[FILE: reducer.js]---
Location: ToolJet-develop/frontend/src/Editor/Components/Table/reducer.js
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
Location: ToolJet-develop/frontend/src/Editor/Components/Table/String.jsx
Signals: React
Excerpt (<=80 chars): import React, { useState, useEffect } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Table.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Table/Table.jsx
Signals: React
Excerpt (<=80 chars):  export function Table({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Table
```

--------------------------------------------------------------------------------

---[FILE: Tags.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Table/Tags.jsx
Signals: React
Excerpt (<=80 chars):  export const Tags = ({ value, onChange, readOnly, containerWidth = '' }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Tags
```

--------------------------------------------------------------------------------

---[FILE: Text.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Table/Text.jsx
Signals: React
Excerpt (<=80 chars): import React, { useState, useEffect, useRef } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Timepicker.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Table/Timepicker.jsx
Signals: React
Excerpt (<=80 chars):  export const TimePicker = ({ value, onChange, component }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TimePicker
```

--------------------------------------------------------------------------------

---[FILE: Toggle.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Table/Toggle.jsx
Signals: React
Excerpt (<=80 chars):  export const Toggle = ({ readOnly, value, onChange, activeColor }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Toggle
```

--------------------------------------------------------------------------------

---[FILE: actions.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Table/columns/actions.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Table/columns/index.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: EditorContextWrapper.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Context/EditorContextWrapper.jsx
Signals: React
Excerpt (<=80 chars): import React, { createContext, useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.jsx]---
Location: ToolJet-develop/frontend/src/Editor/FreezeVersionInfo/index.jsx
Signals: React
Excerpt (<=80 chars):  export const FreezeVersionInfo = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FreezeVersionInfo
```

--------------------------------------------------------------------------------

---[FILE: AppModeToggle.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Header/AppModeToggle.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: EditAppName.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Header/EditAppName.jsx
Signals: React
Excerpt (<=80 chars): import React, { useRef, useEffect, useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: GlobalSettings.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Header/GlobalSettings.jsx
Signals: React
Excerpt (<=80 chars):  export const GlobalSettings = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GlobalSettings
```

--------------------------------------------------------------------------------

---[FILE: HeaderActions.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Header/HeaderActions.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.js]---
Location: ToolJet-develop/frontend/src/Editor/Header/index.js
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: InfoOrErrorBox.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Header/InfoOrErrorBox.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: UpdatePresence.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Header/UpdatePresence.jsx
Signals: React
Excerpt (<=80 chars): import React, { useEffect } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: EnvironmentsManager.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Header/EnvironmentManager/EnvironmentsManager.jsx
Signals: React
Excerpt (<=80 chars): import { useEnvironmentsAndVersionsStore } from '@/_stores/environmentsAndVer...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Header/EnvironmentManager/EnvironmentSelectBox/index.jsx
Signals: React
Excerpt (<=80 chars): import React, { useState, useRef, useEffect } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ManageAppUsers.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Header/RightTopHeaderButtons/ManageAppUsers.jsx
Signals: React
Excerpt (<=80 chars):  export const ManageAppUsers = withTranslation()(ManageAppUsersComponent);

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ManageAppUsers
```

--------------------------------------------------------------------------------

---[FILE: PromoteVersionButton.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Header/RightTopHeaderButtons/PromoteVersionButton.jsx
Signals: React
Excerpt (<=80 chars): import React, { useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ReleaseVersionButton.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Header/RightTopHeaderButtons/ReleaseVersionButton.jsx
Signals: React
Excerpt (<=80 chars):  export const ReleaseVersionButton = function DeployVersionButton({ onVersion...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ReleaseVersionButton
```

--------------------------------------------------------------------------------

---[FILE: RightTopHeaderButtons.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Header/RightTopHeaderButtons/RightTopHeaderButtons.jsx
Signals: React
Excerpt (<=80 chars): import React, { useEffect } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Header/RightTopHeaderButtons/PromoteConfirmationModal/index.jsx
Signals: React
Excerpt (<=80 chars): import React, { useState, useEffect } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: EventManager.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Inspector/EventManager.jsx
Signals: React
Excerpt (<=80 chars):  export const EventManager = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EventManager
```

--------------------------------------------------------------------------------

---[FILE: Inspector.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Inspector/Inspector.jsx
Signals: React
Excerpt (<=80 chars):  export const Inspector = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Inspector
```

--------------------------------------------------------------------------------

---[FILE: ManageEventButton.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Inspector/ManageEventButton.jsx
Signals: React
Excerpt (<=80 chars): import React, { useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: QuerySelector.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Inspector/QuerySelector.jsx
Signals: React
Excerpt (<=80 chars):  export const QuerySelector = ({ param, definition, eventOptionUpdated, dataQ...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QuerySelector
```

--------------------------------------------------------------------------------

---[FILE: TypeMapping.js]---
Location: ToolJet-develop/frontend/src/Editor/Inspector/TypeMapping.js
Signals: N/A
Excerpt (<=80 chars): export const TypeMapping = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TypeMapping
```

--------------------------------------------------------------------------------

---[FILE: Utils.js]---
Location: ToolJet-develop/frontend/src/Editor/Inspector/Utils.js
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
Location: ToolJet-develop/frontend/src/Editor/Inspector/ActionConfigurationPanels/GotoApp.jsx
Signals: React
Excerpt (<=80 chars):  export function GotoApp({ getAllApps, event, handlerChanged, eventIndex, dar...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GotoApp
```

--------------------------------------------------------------------------------

---[FILE: RunjsParamters.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Inspector/ActionConfigurationPanels/RunjsParamters.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: SwitchPage.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Inspector/ActionConfigurationPanels/SwitchPage.jsx
Signals: React
Excerpt (<=80 chars):  export function SwitchPage({ getPages, event, handlerChanged, eventIndex, da...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SwitchPage
```

--------------------------------------------------------------------------------

---[FILE: Chart.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Inspector/Components/Chart.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: CustomComponent.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Inspector/Components/CustomComponent.jsx
Signals: React
Excerpt (<=80 chars):  export const CustomComponent = function CustomComponent({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CustomComponent
```

--------------------------------------------------------------------------------

---[FILE: DefaultComponent.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Inspector/Components/DefaultComponent.jsx
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
Location: ToolJet-develop/frontend/src/Editor/Inspector/Components/FilePicker.jsx
Signals: React
Excerpt (<=80 chars):  export const FilePicker = ({ componentMeta, darkMode, ...restProps }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FilePicker
```

--------------------------------------------------------------------------------

---[FILE: Form.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Inspector/Components/Form.jsx
Signals: React
Excerpt (<=80 chars):  export const Form = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Form
- baseComponentProperties
```

--------------------------------------------------------------------------------

---[FILE: Icon.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Inspector/Components/Icon.jsx
Signals: React
Excerpt (<=80 chars):  export function Icon({ componentMeta, darkMode, ...restProps }) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Icon
```

--------------------------------------------------------------------------------

---[FILE: Modal.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Inspector/Components/Modal.jsx
Signals: React
Excerpt (<=80 chars):  export const Modal = ({ componentMeta, darkMode, ...restProps }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Modal
```

--------------------------------------------------------------------------------

---[FILE: Select.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Inspector/Components/Select.jsx
Signals: React
Excerpt (<=80 chars):  export function Select({ componentMeta, darkMode, ...restProps }) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Select
```

--------------------------------------------------------------------------------

---[FILE: NoListItem.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Inspector/Components/Table/NoListItem.jsx
Signals: React
Excerpt (<=80 chars): import SolidIcon from '@/_ui/Icon/SolidIcons';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ProgramaticallyHandleProperties.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Inspector/Components/Table/ProgramaticallyHandleProperties.jsx
Signals: React
Excerpt (<=80 chars):  export const ProgramaticallyHandleProperties = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProgramaticallyHandleProperties
```

--------------------------------------------------------------------------------

---[FILE: Table.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Inspector/Components/Table/Table.jsx
Signals: React
Excerpt (<=80 chars):  export const Table = withTranslation()(TableComponent);

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Table
```

--------------------------------------------------------------------------------

---[FILE: ColumnPopover.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Inspector/Components/Table/ColumnManager/ColumnPopover.jsx
Signals: React
Excerpt (<=80 chars):  export const ColumnPopoverContent = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ColumnPopoverContent
```

--------------------------------------------------------------------------------

---[FILE: DatepickerProperties.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Inspector/Components/Table/ColumnManager/DatepickerProperties.jsx
Signals: React
Excerpt (<=80 chars): import React, { useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DeprecatedColumnTypeMsg.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Inspector/Components/Table/ColumnManager/DeprecatedColumnTypeMsg.jsx
Signals: React
Excerpt (<=80 chars):  export const DEPRECATED_COLUMN_TYPES = [

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DEPRECATED_COLUMN_TYPES
- checkIfTableColumnDeprecated
- TooltipBody
- DeprecatedColumnTooltip
```

--------------------------------------------------------------------------------

---[FILE: PropertiesTabElements.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Inspector/Components/Table/ColumnManager/PropertiesTabElements.jsx
Signals: React
Excerpt (<=80 chars):  export const PropertiesTabElements = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PropertiesTabElements
```

--------------------------------------------------------------------------------

---[FILE: StylesTabElements.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Inspector/Components/Table/ColumnManager/StylesTabElements.jsx
Signals: React
Excerpt (<=80 chars):  export const StylesTabElements = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- StylesTabElements
```

--------------------------------------------------------------------------------

---[FILE: ValidationProperties.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Inspector/Components/Table/ColumnManager/ValidationProperties.jsx
Signals: React
Excerpt (<=80 chars):  export const ValidationProperties = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ValidationProperties
```

--------------------------------------------------------------------------------

---[FILE: OptionsList.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Inspector/Components/Table/SelectOptionsList/OptionsList.jsx
Signals: React
Excerpt (<=80 chars): export const OptionsList = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OptionsList
```

--------------------------------------------------------------------------------

---[FILE: AlignButtons.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Inspector/Elements/AlignButtons.jsx
Signals: React
Excerpt (<=80 chars):  export const AlignButtons = ({ param, definition, onChange, paramType, compo...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AlignButtons
```

--------------------------------------------------------------------------------

---[FILE: Code.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Inspector/Elements/Code.jsx
Signals: React
Excerpt (<=80 chars):  export const Code = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Code
```

--------------------------------------------------------------------------------

---[FILE: Color.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Inspector/Elements/Color.jsx
Signals: React
Excerpt (<=80 chars):  export const Color = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Color
```

--------------------------------------------------------------------------------

---[FILE: Json.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Inspector/Elements/Json.jsx
Signals: React
Excerpt (<=80 chars):  export const Json = ({ param, definition, onChange, paramType, componentMeta...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Json
```

--------------------------------------------------------------------------------

---[FILE: Select.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Inspector/Elements/Select.jsx
Signals: React
Excerpt (<=80 chars):  export const Select = ({ param, definition, onChange, paramType, componentMe...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Select
```

--------------------------------------------------------------------------------

---[FILE: Text.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Inspector/Elements/Text.jsx
Signals: React
Excerpt (<=80 chars):  export const Text = ({ param, definition, onChange, paramType, componentMeta...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Text
```

--------------------------------------------------------------------------------

---[FILE: Toggle.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Inspector/Elements/Toggle.jsx
Signals: React
Excerpt (<=80 chars):  export const Toggle = ({ param, definition, onChange, paramType, componentMe...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Toggle
```

--------------------------------------------------------------------------------

---[FILE: utils.js]---
Location: ToolJet-develop/frontend/src/Editor/Inspector/Elements/utils.js
Signals: N/A
Excerpt (<=80 chars):  export const getDefinitionInitialValue = (paramType, param, definition, comp...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getDefinitionInitialValue
```

--------------------------------------------------------------------------------

---[FILE: ToolTip.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Inspector/Elements/Components/ToolTip.jsx
Signals: React
Excerpt (<=80 chars):  export const ToolTip = ({ label, meta, labelClass, bold = false }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ToolTip
```

--------------------------------------------------------------------------------

---[FILE: index.jsx]---
Location: ToolJet-develop/frontend/src/Editor/LeftSidebar/index.jsx
Signals: React, TypeORM
Excerpt (<=80 chars):  export const LeftSidebar = forwardRef((props, ref) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LeftSidebar
```

--------------------------------------------------------------------------------

---[FILE: SidebarComment.jsx]---
Location: ToolJet-develop/frontend/src/Editor/LeftSidebar/SidebarComment.jsx
Signals: React
Excerpt (<=80 chars):  export const LeftSidebarComment = forwardRef(

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LeftSidebarComment
```

--------------------------------------------------------------------------------

---[FILE: SidebarDatasources.jsx]---
Location: ToolJet-develop/frontend/src/Editor/LeftSidebar/SidebarDatasources.jsx
Signals: React, TypeORM
Excerpt (<=80 chars):  export const LeftSidebarDataSources = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LeftSidebarDataSources
```

--------------------------------------------------------------------------------

---[FILE: SidebarInspector.jsx]---
Location: ToolJet-develop/frontend/src/Editor/LeftSidebar/SidebarInspector.jsx
Signals: React
Excerpt (<=80 chars):  export const LeftSidebarInspector = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LeftSidebarInspector
```

--------------------------------------------------------------------------------

---[FILE: SidebarItem.jsx]---
Location: ToolJet-develop/frontend/src/Editor/LeftSidebar/SidebarItem.jsx
Signals: React
Excerpt (<=80 chars):  export const LeftSidebarItem = forwardRef(

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LeftSidebarItem
```

--------------------------------------------------------------------------------

---[FILE: Logs.jsx]---
Location: ToolJet-develop/frontend/src/Editor/LeftSidebar/SidebarDebugger/Logs.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: SidebarDebugger.jsx]---
Location: ToolJet-develop/frontend/src/Editor/LeftSidebar/SidebarDebugger/SidebarDebugger.jsx
Signals: React
Excerpt (<=80 chars):  export const LeftSidebarDebugger = ({ darkMode, errors, clearErrorLogs, setP...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LeftSidebarDebugger
```

--------------------------------------------------------------------------------

---[FILE: SidebarDebuggerHeader.jsx]---
Location: ToolJet-develop/frontend/src/Editor/LeftSidebar/SidebarDebugger/SidebarDebuggerHeader.jsx
Signals: React
Excerpt (<=80 chars):  export const SidebarDebuggerHeader = ({ darkMode, clearErrorLogs, setPinned,...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SidebarDebuggerHeader
```

--------------------------------------------------------------------------------

---[FILE: SidebarDebuggerTabs.jsx]---
Location: ToolJet-develop/frontend/src/Editor/LeftSidebar/SidebarDebugger/SidebarDebuggerTabs.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: useDebugger.js]---
Location: ToolJet-develop/frontend/src/Editor/LeftSidebar/SidebarDebugger/useDebugger.js
Signals: React
Excerpt (<=80 chars): import { useState, useEffect } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DeletePageConfirmationModal.jsx]---
Location: ToolJet-develop/frontend/src/Editor/LeftSidebar/SidebarPageSelector/DeletePageConfirmationModal.jsx
Signals: React
Excerpt (<=80 chars):  export function DeletePageConfirmationModal() {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeletePageConfirmationModal
```

--------------------------------------------------------------------------------

---[FILE: DeletePageGroupConfirmationModal.jsx]---
Location: ToolJet-develop/frontend/src/Editor/LeftSidebar/SidebarPageSelector/DeletePageGroupConfirmationModal.jsx
Signals: React
Excerpt (<=80 chars):  export const DeletePageGroupConfirmationModal = ({ onConfirm, onCancel, dark...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeletePageGroupConfirmationModal
```

--------------------------------------------------------------------------------

---[FILE: EditInput.jsx]---
Location: ToolJet-develop/frontend/src/Editor/LeftSidebar/SidebarPageSelector/EditInput.jsx
Signals: React
Excerpt (<=80 chars):  export const EditInput = ({ slug, error, setError, pageHandle, setPageHandle...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EditInput
```

--------------------------------------------------------------------------------

---[FILE: EditModal.jsx]---
Location: ToolJet-develop/frontend/src/Editor/LeftSidebar/SidebarPageSelector/EditModal.jsx
Signals: React
Excerpt (<=80 chars):  export const EditModal = ({ slug, page, show, handleClose, updatePageHandle,...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EditModal
```

--------------------------------------------------------------------------------

---[FILE: GlobalSettings.jsx]---
Location: ToolJet-develop/frontend/src/Editor/LeftSidebar/SidebarPageSelector/GlobalSettings.jsx
Signals: React
Excerpt (<=80 chars):  export const GlobalSettings = ({ darkMode, showHideViewerNavigationControls,...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GlobalSettings
```

--------------------------------------------------------------------------------

---[FILE: index.jsx]---
Location: ToolJet-develop/frontend/src/Editor/LeftSidebar/SidebarPageSelector/index.jsx
Signals: React
Excerpt (<=80 chars): import React, { useMemo, useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: PageHandler.jsx]---
Location: ToolJet-develop/frontend/src/Editor/LeftSidebar/SidebarPageSelector/PageHandler.jsx
Signals: React
Excerpt (<=80 chars):  export const PageHandler = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PageHandler
- AddingPageHandler
```

--------------------------------------------------------------------------------

---[FILE: PagehandlerMenu.jsx]---
Location: ToolJet-develop/frontend/src/Editor/LeftSidebar/SidebarPageSelector/PagehandlerMenu.jsx
Signals: React
Excerpt (<=80 chars):  export const PagehandlerMenu = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PagehandlerMenu
```

--------------------------------------------------------------------------------

---[FILE: RenameInput.jsx]---
Location: ToolJet-develop/frontend/src/Editor/LeftSidebar/SidebarPageSelector/RenameInput.jsx
Signals: React
Excerpt (<=80 chars):  export const RenameInput = ({ page, updaterCallback, updatePageEditMode }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RenameInput
```

--------------------------------------------------------------------------------

---[FILE: SettingsModal.jsx]---
Location: ToolJet-develop/frontend/src/Editor/LeftSidebar/SidebarPageSelector/SettingsModal.jsx
Signals: React
Excerpt (<=80 chars):  export const SettingsModal = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SettingsModal
```

--------------------------------------------------------------------------------

---[FILE: HydrateWithResolveReferences.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Middlewares/HydrateWithResolveReferences.jsx
Signals: React
Excerpt (<=80 chars): import React, { useEffect, useMemo } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: AddGlobalDataSourceButton.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/AddGlobalDataSourceButton.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: constants.js]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/constants.js
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
- workflowDefaultSources
```

--------------------------------------------------------------------------------

---[FILE: EmptyGlobalDataSources.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/EmptyGlobalDataSources.jsx
Signals: React, TypeORM
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: QueryManager.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/QueryManager.jsx
Signals: React, TypeORM
Excerpt (<=80 chars): import React, { useEffect, useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: AddGlobalDataSourceButton.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/Components/AddGlobalDataSourceButton.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ChangeDataSource.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/Components/ChangeDataSource.jsx
Signals: React, TypeORM
Excerpt (<=80 chars):  export const ChangeDataSource = ({ dataSources, onChange, value, isVersionRe...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ChangeDataSource
```

--------------------------------------------------------------------------------

---[FILE: CustomToggleSwitch.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/Components/CustomToggleSwitch.jsx
Signals: React
Excerpt (<=80 chars):  export const CustomToggleSwitch = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CustomToggleSwitch
```

--------------------------------------------------------------------------------

---[FILE: DataSourceIcon.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/Components/DataSourceIcon.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DataSourcePicker.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/Components/DataSourcePicker.jsx
Signals: React, TypeORM
Excerpt (<=80 chars): import React, { useState, useEffect } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DataSourceSelect.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/Components/DataSourceSelect.jsx
Signals: React, TypeORM
Excerpt (<=80 chars): import React, { useState, useEffect } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: EmptyGlobalDataSources.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/Components/EmptyGlobalDataSources.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

````
