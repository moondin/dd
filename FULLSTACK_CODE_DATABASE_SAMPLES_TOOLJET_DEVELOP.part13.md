---
source_txt: fullstack_samples/ToolJet-develop
converted_utc: 2025-12-18T10:37:21Z
part: 13
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES ToolJet-develop

## Extracted Reusable Patterns (Non-verbatim) (Part 13 of 37)

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

---[FILE: ParameterDetails.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/Components/ParameterDetails.jsx
Signals: React
Excerpt (<=80 chars):  export const PillButton = ({ name, onClick, onRemove, marginBottom, classNam...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PillButton
```

--------------------------------------------------------------------------------

---[FILE: ParameterForm.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/Components/ParameterForm.jsx
Signals: React
Excerpt (<=80 chars): import React, { useEffect, useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ParameterList.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/Components/ParameterList.jsx
Signals: React
Excerpt (<=80 chars): import React, { useEffect, useRef, useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Preview.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/Components/Preview.jsx
Signals: React
Excerpt (<=80 chars): import React, { useEffect, useLayoutEffect, useRef, useState, useMemo } from ...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: QueryManagerBody.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/Components/QueryManagerBody.jsx
Signals: React, TypeORM
Excerpt (<=80 chars):  export const QueryManagerBody = ({ darkMode, options, allComponents, apps, a...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QueryManagerBody
```

--------------------------------------------------------------------------------

---[FILE: QueryManagerHeader.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/Components/QueryManagerHeader.jsx
Signals: React
Excerpt (<=80 chars):  export const QueryManagerHeader = forwardRef(({ darkMode, options, editorRef...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QueryManagerHeader
```

--------------------------------------------------------------------------------

---[FILE: SuccessNotificationInputs.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/Components/SuccessNotificationInputs.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Transformation.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/Components/Transformation.jsx
Signals: React
Excerpt (<=80 chars):  export const Transformation = ({ changeOption, options, darkMode, queryId })...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Transformation
```

--------------------------------------------------------------------------------

---[FILE: BreadcrumbsIcon.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/Icons/BreadcrumbsIcon.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: CreateIcon.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/Icons/CreateIcon.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: PreviewIcon.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/Icons/PreviewIcon.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RenameIcon.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/Icons/RenameIcon.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RunIcon.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/Icons/RunIcon.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ToggleQueryEditorIcon.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/Icons/ToggleQueryEditorIcon.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: GRPC.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/QueryEditors/GRPC.jsx
Signals: React
Excerpt (<=80 chars):  export const BaseUrl = ({ dataSourceURL, theme }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BaseUrl
```

--------------------------------------------------------------------------------

---[FILE: index.js]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/QueryEditors/index.js
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
Location: ToolJet-develop/frontend/src/Editor/QueryManager/QueryEditors/Openapi.jsx
Signals: React
Excerpt (<=80 chars):  export const Openapi = withTranslation()(OpenapiComponent);

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Openapi
```

--------------------------------------------------------------------------------

---[FILE: Runpy.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/QueryEditors/Runpy.jsx
Signals: React
Excerpt (<=80 chars):  export class Runpy extends React.Component {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Runpy
```

--------------------------------------------------------------------------------

---[FILE: utils.js]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/QueryEditors/utils.js
Signals: N/A
Excerpt (<=80 chars): export function changeOption(_ref, option, value) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- changeOption
```

--------------------------------------------------------------------------------

---[FILE: Workflows.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/QueryEditors/Workflows.jsx
Signals: React
Excerpt (<=80 chars):  export function Workflows({ options, optionsChanged, currentState }) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Workflows
```

--------------------------------------------------------------------------------

---[FILE: BaseUrl.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/QueryEditors/Restapi/BaseUrl.jsx
Signals: React
Excerpt (<=80 chars):  export const BaseUrl = ({ dataSourceURL, theme }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BaseUrl
```

--------------------------------------------------------------------------------

---[FILE: GroupHeader.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/QueryEditors/Restapi/GroupHeader.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/QueryEditors/Restapi/index.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: TabBody.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/QueryEditors/Restapi/TabBody.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: TabContent.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/QueryEditors/Restapi/TabContent.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: TabCookies.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/QueryEditors/Restapi/TabCookies.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: TabHeaders.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/QueryEditors/Restapi/TabHeaders.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: TabParams.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/QueryEditors/Restapi/TabParams.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Tabs.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/QueryEditors/Restapi/Tabs.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Runjs.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/QueryEditors/Runjs/Runjs.jsx
Signals: React
Excerpt (<=80 chars): import React, { useState, useEffect } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Confirm.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/QueryEditors/TooljetDatabase/Confirm.jsx
Signals: React
Excerpt (<=80 chars): import React, { useCallback, useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: CreateRow.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/QueryEditors/TooljetDatabase/CreateRow.jsx
Signals: React
Excerpt (<=80 chars):  export const CreateRow = React.memo(({ optionchanged, options, darkMode }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateRow
```

--------------------------------------------------------------------------------

---[FILE: DeleteRows.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/QueryEditors/TooljetDatabase/DeleteRows.jsx
Signals: React
Excerpt (<=80 chars):  export const DeleteRows = React.memo(({ darkMode }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeleteRows
```

--------------------------------------------------------------------------------

---[FILE: DropDownSelect.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/QueryEditors/TooljetDatabase/DropDownSelect.jsx
Signals: React
Excerpt (<=80 chars): import React, { useEffect, useRef, useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: JoinConstraint.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/QueryEditors/TooljetDatabase/JoinConstraint.jsx
Signals: React
Excerpt (<=80 chars): import React, { useContext } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: JoinSelect.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/QueryEditors/TooljetDatabase/JoinSelect.jsx
Signals: React
Excerpt (<=80 chars): import React, { useContext } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: JoinSort.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/QueryEditors/TooljetDatabase/JoinSort.jsx
Signals: React
Excerpt (<=80 chars): import React, { useContext } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: JoinTable.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/QueryEditors/TooljetDatabase/JoinTable.jsx
Signals: React
Excerpt (<=80 chars):  export const JoinTable = React.memo(({ darkMode }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- JoinTable
```

--------------------------------------------------------------------------------

---[FILE: ListRows.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/QueryEditors/TooljetDatabase/ListRows.jsx
Signals: React
Excerpt (<=80 chars):  export const ListRows = React.memo(({ darkMode }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListRows
```

--------------------------------------------------------------------------------

---[FILE: NoConditionUI.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/QueryEditors/TooljetDatabase/NoConditionUI.jsx
Signals: React
Excerpt (<=80 chars): export const NoCondition = ({ text = 'There are no condition' }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NoCondition
```

--------------------------------------------------------------------------------

---[FILE: RenderColumnUI.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/QueryEditors/TooljetDatabase/RenderColumnUI.jsx
Signals: React
Excerpt (<=80 chars): import CodeHinter from '@/Editor/CodeEditor';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RenderFilterSectionUI.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/QueryEditors/TooljetDatabase/RenderFilterSectionUI.jsx
Signals: React
Excerpt (<=80 chars): import CodeHinter from '@/Editor/CodeEditor';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RenderSortUI.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/QueryEditors/TooljetDatabase/RenderSortUI.jsx
Signals: React
Excerpt (<=80 chars): import { ButtonSolid } from '@/_ui/AppButton/AppButton';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: SelectBox.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/QueryEditors/TooljetDatabase/SelectBox.jsx
Signals: React, TypeORM
Excerpt (<=80 chars): import React, { isValidElement, useCallback, useState, useRef, useEffect } fr...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ToolJetDbOperations.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/QueryEditors/TooljetDatabase/ToolJetDbOperations.jsx
Signals: React
Excerpt (<=80 chars): import React, { useState, useEffect, useMemo, useRef } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: UpdateRows.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/QueryEditors/TooljetDatabase/UpdateRows.jsx
Signals: React
Excerpt (<=80 chars):  export const UpdateRows = React.memo(({ darkMode }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateRows
```

--------------------------------------------------------------------------------

---[FILE: util.js]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/QueryEditors/TooljetDatabase/util.js
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
Location: ToolJet-develop/frontend/src/Editor/QueryManager/QueryEditors/TooljetDatabase/AggregateUI/index.jsx
Signals: React
Excerpt (<=80 chars): export const AggregateFilter = ({ darkMode, operation = '' }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AggregateFilter
```

--------------------------------------------------------------------------------

---[FILE: Select.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/QueryEditors/TooljetDatabase/AggregateUI/Select.jsx
Signals: React
Excerpt (<=80 chars):  export const SelectBox = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SelectBox
```

--------------------------------------------------------------------------------

---[FILE: DateTimePicker.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryManager/QueryEditors/TooljetDatabase/DateTimePicker/DateTimePicker.jsx
Signals: React
Excerpt (<=80 chars): export const DateTimePicker = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DateTimePicker
```

--------------------------------------------------------------------------------

---[FILE: FilterandSortPopup.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryPanel/FilterandSortPopup.jsx
Signals: React, TypeORM
Excerpt (<=80 chars): import React, { useEffect, useRef, useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: QueryCard.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryPanel/QueryCard.jsx
Signals: React
Excerpt (<=80 chars):  export const QueryCard = ({ dataQuery, darkMode = false, editorRef, appId, l...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QueryCard
```

--------------------------------------------------------------------------------

---[FILE: QueryDataPane.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryPanel/QueryDataPane.jsx
Signals: React, TypeORM
Excerpt (<=80 chars):  export const QueryDataPane = ({ darkMode, fetchDataQueries, editorRef, appId...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QueryDataPane
```

--------------------------------------------------------------------------------

---[FILE: QueryPanel.jsx]---
Location: ToolJet-develop/frontend/src/Editor/QueryPanel/QueryPanel.jsx
Signals: React
Excerpt (<=80 chars): import React, { useState, useRef, useCallback, useEffect } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.jsx]---
Location: ToolJet-develop/frontend/src/Editor/ReleaseConfirmation/index.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Confirm.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Viewer/Confirm.jsx
Signals: React
Excerpt (<=80 chars):  export function Confirm({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Confirm
```

--------------------------------------------------------------------------------

---[FILE: DesktopHeader.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Viewer/DesktopHeader.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Header.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Viewer/Header.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: MobileHeader.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Viewer/MobileHeader.jsx
Signals: React
Excerpt (<=80 chars): import React, { useMemo } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: MobileNavigationMenu.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Viewer/MobileNavigationMenu.jsx
Signals: React
Excerpt (<=80 chars): import React, { useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: PreviewSettings.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Viewer/PreviewSettings.jsx
Signals: React
Excerpt (<=80 chars): import React, { useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: TooljetBanner.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Viewer/TooljetBanner.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ViewerSidebarNavigation.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Viewer/ViewerSidebarNavigation.jsx
Signals: React
Excerpt (<=80 chars):  export const ViewerSidebarNavigation = ({ isMobileDevice, pages, currentPage...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ViewerSidebarNavigation
```

--------------------------------------------------------------------------------

---[FILE: components.js]---
Location: ToolJet-develop/frontend/src/Editor/WidgetManager/components.js
Signals: N/A
Excerpt (<=80 chars):  export const componentTypes = widgets.map((widget) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- componentTypes
```

--------------------------------------------------------------------------------

---[FILE: constants.js]---
Location: ToolJet-develop/frontend/src/Editor/WidgetManager/constants.js
Signals: N/A
Excerpt (<=80 chars): export const LEGACY_ITEMS = [

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LEGACY_ITEMS
```

--------------------------------------------------------------------------------

---[FILE: restrictedWidgetsConfig.js]---
Location: ToolJet-develop/frontend/src/Editor/WidgetManager/restrictedWidgetsConfig.js
Signals: N/A
Excerpt (<=80 chars): export const restrictedWidgetsObj = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- restrictedWidgetsObj
```

--------------------------------------------------------------------------------

---[FILE: widgetConfig.js]---
Location: ToolJet-develop/frontend/src/Editor/WidgetManager/widgetConfig.js
Signals: N/A
Excerpt (<=80 chars):  export const widgets = [

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- widgets
```

--------------------------------------------------------------------------------

---[FILE: boundedBox.js]---
Location: ToolJet-develop/frontend/src/Editor/WidgetManager/configs/boundedBox.js
Signals: N/A
Excerpt (<=80 chars): export const boundedBoxConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- boundedBoxConfig
```

--------------------------------------------------------------------------------

---[FILE: button.js]---
Location: ToolJet-develop/frontend/src/Editor/WidgetManager/configs/button.js
Signals: N/A
Excerpt (<=80 chars): export const buttonConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- buttonConfig
```

--------------------------------------------------------------------------------

---[FILE: buttonGroup.js]---
Location: ToolJet-develop/frontend/src/Editor/WidgetManager/configs/buttonGroup.js
Signals: N/A
Excerpt (<=80 chars): export const buttonGroupConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- buttonGroupConfig
```

--------------------------------------------------------------------------------

---[FILE: calendar.js]---
Location: ToolJet-develop/frontend/src/Editor/WidgetManager/configs/calendar.js
Signals: N/A
Excerpt (<=80 chars): export const calendarConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- calendarConfig
```

--------------------------------------------------------------------------------

---[FILE: chart.js]---
Location: ToolJet-develop/frontend/src/Editor/WidgetManager/configs/chart.js
Signals: N/A
Excerpt (<=80 chars): export const chartConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- chartConfig
```

--------------------------------------------------------------------------------

---[FILE: chat.js]---
Location: ToolJet-develop/frontend/src/Editor/WidgetManager/configs/chat.js
Signals: N/A
Excerpt (<=80 chars): export const chatConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- chatConfig
```

--------------------------------------------------------------------------------

---[FILE: checkbox.js]---
Location: ToolJet-develop/frontend/src/Editor/WidgetManager/configs/checkbox.js
Signals: N/A
Excerpt (<=80 chars): export const checkboxConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- checkboxConfig
```

--------------------------------------------------------------------------------

---[FILE: circularProgressbar.js]---
Location: ToolJet-develop/frontend/src/Editor/WidgetManager/configs/circularProgressbar.js
Signals: N/A
Excerpt (<=80 chars): export const circularProgressbarConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- circularProgressbarConfig
```

--------------------------------------------------------------------------------

---[FILE: codeEditor.js]---
Location: ToolJet-develop/frontend/src/Editor/WidgetManager/configs/codeEditor.js
Signals: N/A
Excerpt (<=80 chars): export const codeEditorConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- codeEditorConfig
```

--------------------------------------------------------------------------------

---[FILE: colorPicker.js]---
Location: ToolJet-develop/frontend/src/Editor/WidgetManager/configs/colorPicker.js
Signals: N/A
Excerpt (<=80 chars): export const colorPickerConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- colorPickerConfig
```

--------------------------------------------------------------------------------

---[FILE: container.js]---
Location: ToolJet-develop/frontend/src/Editor/WidgetManager/configs/container.js
Signals: N/A
Excerpt (<=80 chars): export const containerConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- containerConfig
```

--------------------------------------------------------------------------------

---[FILE: customComponent.js]---
Location: ToolJet-develop/frontend/src/Editor/WidgetManager/configs/customComponent.js
Signals: N/A
Excerpt (<=80 chars): export const customComponentConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- customComponentConfig
```

--------------------------------------------------------------------------------

---[FILE: datepicker.js]---
Location: ToolJet-develop/frontend/src/Editor/WidgetManager/configs/datepicker.js
Signals: N/A
Excerpt (<=80 chars): export const datepickerConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- datepickerConfig
```

--------------------------------------------------------------------------------

---[FILE: daterangepicker.js]---
Location: ToolJet-develop/frontend/src/Editor/WidgetManager/configs/daterangepicker.js
Signals: N/A
Excerpt (<=80 chars): export const daterangepickerConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- daterangepickerConfig
```

--------------------------------------------------------------------------------

---[FILE: divider.js]---
Location: ToolJet-develop/frontend/src/Editor/WidgetManager/configs/divider.js
Signals: N/A
Excerpt (<=80 chars): export const dividerConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- dividerConfig
```

--------------------------------------------------------------------------------

---[FILE: dropdown.js]---
Location: ToolJet-develop/frontend/src/Editor/WidgetManager/configs/dropdown.js
Signals: N/A
Excerpt (<=80 chars): export const dropdownConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- dropdownConfig
```

--------------------------------------------------------------------------------

---[FILE: dropdownV2.js]---
Location: ToolJet-develop/frontend/src/Editor/WidgetManager/configs/dropdownV2.js
Signals: N/A
Excerpt (<=80 chars): export const dropdownV2Config = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- dropdownV2Config
```

--------------------------------------------------------------------------------

---[FILE: form.js]---
Location: ToolJet-develop/frontend/src/Editor/WidgetManager/configs/form.js
Signals: N/A
Excerpt (<=80 chars): export const formConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- formConfig
```

--------------------------------------------------------------------------------

---[FILE: html.js]---
Location: ToolJet-develop/frontend/src/Editor/WidgetManager/configs/html.js
Signals: N/A
Excerpt (<=80 chars): export const htmlConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- htmlConfig
```

--------------------------------------------------------------------------------

---[FILE: icon.js]---
Location: ToolJet-develop/frontend/src/Editor/WidgetManager/configs/icon.js
Signals: N/A
Excerpt (<=80 chars): export const iconConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- iconConfig
```

--------------------------------------------------------------------------------

---[FILE: iframe.js]---
Location: ToolJet-develop/frontend/src/Editor/WidgetManager/configs/iframe.js
Signals: N/A
Excerpt (<=80 chars): export const iframeConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- iframeConfig
```

--------------------------------------------------------------------------------

---[FILE: image.js]---
Location: ToolJet-develop/frontend/src/Editor/WidgetManager/configs/image.js
Signals: N/A
Excerpt (<=80 chars): export const imageConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- imageConfig
```

--------------------------------------------------------------------------------

---[FILE: kanban.js]---
Location: ToolJet-develop/frontend/src/Editor/WidgetManager/configs/kanban.js
Signals: N/A
Excerpt (<=80 chars): export const kanbanConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- kanbanConfig
```

--------------------------------------------------------------------------------

---[FILE: kanbanBoard.js]---
Location: ToolJet-develop/frontend/src/Editor/WidgetManager/configs/kanbanBoard.js
Signals: N/A
Excerpt (<=80 chars):  export const kanbanBoardConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- kanbanBoardConfig
```

--------------------------------------------------------------------------------

---[FILE: link.js]---
Location: ToolJet-develop/frontend/src/Editor/WidgetManager/configs/link.js
Signals: N/A
Excerpt (<=80 chars): export const linkConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- linkConfig
```

--------------------------------------------------------------------------------

---[FILE: listview.js]---
Location: ToolJet-develop/frontend/src/Editor/WidgetManager/configs/listview.js
Signals: N/A
Excerpt (<=80 chars): export const listviewConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- listviewConfig
```

--------------------------------------------------------------------------------

---[FILE: map.js]---
Location: ToolJet-develop/frontend/src/Editor/WidgetManager/configs/map.js
Signals: N/A
Excerpt (<=80 chars): export const mapConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mapConfig
```

--------------------------------------------------------------------------------

---[FILE: modal.js]---
Location: ToolJet-develop/frontend/src/Editor/WidgetManager/configs/modal.js
Signals: N/A
Excerpt (<=80 chars): export const modalConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- modalConfig
```

--------------------------------------------------------------------------------

---[FILE: modalV2.js]---
Location: ToolJet-develop/frontend/src/Editor/WidgetManager/configs/modalV2.js
Signals: N/A
Excerpt (<=80 chars): export const modalV2Config = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- modalV2Config
```

--------------------------------------------------------------------------------

---[FILE: multiselect.js]---
Location: ToolJet-develop/frontend/src/Editor/WidgetManager/configs/multiselect.js
Signals: N/A
Excerpt (<=80 chars): export const multiselectConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- multiselectConfig
```

--------------------------------------------------------------------------------

---[FILE: multiselectV2.js]---
Location: ToolJet-develop/frontend/src/Editor/WidgetManager/configs/multiselectV2.js
Signals: N/A
Excerpt (<=80 chars): export const multiselectV2Config = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- multiselectV2Config
```

--------------------------------------------------------------------------------

---[FILE: numberinput.js]---
Location: ToolJet-develop/frontend/src/Editor/WidgetManager/configs/numberinput.js
Signals: N/A
Excerpt (<=80 chars): export const numberinputConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- numberinputConfig
```

--------------------------------------------------------------------------------

---[FILE: pagination.js]---
Location: ToolJet-develop/frontend/src/Editor/WidgetManager/configs/pagination.js
Signals: N/A
Excerpt (<=80 chars): export const paginationConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- paginationConfig
```

--------------------------------------------------------------------------------

---[FILE: passwordinput.js]---
Location: ToolJet-develop/frontend/src/Editor/WidgetManager/configs/passwordinput.js
Signals: N/A
Excerpt (<=80 chars): export const passinputConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- passinputConfig
```

--------------------------------------------------------------------------------

---[FILE: pdf.js]---
Location: ToolJet-develop/frontend/src/Editor/WidgetManager/configs/pdf.js
Signals: N/A
Excerpt (<=80 chars): export const pdfConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- pdfConfig
```

--------------------------------------------------------------------------------

---[FILE: qrscanner.js]---
Location: ToolJet-develop/frontend/src/Editor/WidgetManager/configs/qrscanner.js
Signals: N/A
Excerpt (<=80 chars): export const qrscannerConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- qrscannerConfig
```

--------------------------------------------------------------------------------

---[FILE: radiobutton.js]---
Location: ToolJet-develop/frontend/src/Editor/WidgetManager/configs/radiobutton.js
Signals: N/A
Excerpt (<=80 chars): export const radiobuttonConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- radiobuttonConfig
```

--------------------------------------------------------------------------------

````
