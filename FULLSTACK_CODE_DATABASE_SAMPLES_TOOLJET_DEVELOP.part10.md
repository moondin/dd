---
source_txt: fullstack_samples/ToolJet-develop
converted_utc: 2025-12-18T10:37:21Z
part: 10
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES ToolJet-develop

## Extracted Reusable Patterns (Non-verbatim) (Part 10 of 37)

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

---[FILE: FileTypeIcons.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/FileUploader/FileUploaderUtils/FileTypeIcons.jsx
Signals: React
Excerpt (<=80 chars):  export const FileTypeIcons = ({ filetype }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FileTypeIcons
- PdfFile
- SvgFile
- JpgFile
- AiFile
- PsdFile
- DocFile
- XlsFile
- PptFile
- ZipFile
- TxtFile
- AviFile
- CsvFile
```

--------------------------------------------------------------------------------

---[FILE: FileUploaderUtils.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/FileUploader/FileUploaderUtils/FileUploaderUtils.jsx
Signals: React
Excerpt (<=80 chars):  export const RequiredIndicator = ({ disabled }) => (

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RequiredIndicator
- InputFileLabel
- Constraints
- FileUploadIcon
- UploadIcon
- UploadTreyIcon
- FileTypeIcon
- ProgressBar
- RetryIcon
- RemoveIcon
```

--------------------------------------------------------------------------------

---[FILE: Index.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/Input/Index.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Input.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/Input/Input.jsx
Signals: React
Excerpt (<=80 chars): import * as React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Input.stories.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/Input/Input.stories.jsx
Signals: React
Excerpt (<=80 chars):  export const RocketInput = Template.bind({});

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RocketInput
- RocketInputWithLeadingVisual
- RocketInputWithTrailingAction
- RocketInputWithHelperText
- RocketNumberInput
- RocketEditableTitleInput
```

--------------------------------------------------------------------------------

---[FILE: Index.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/Input/CommonInput/Index.jsx
Signals: React, TypeORM
Excerpt (<=80 chars): import React, { useEffect, useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: NumberInput.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/Input/CommonInput/NumberInput.jsx
Signals: React
Excerpt (<=80 chars): import SolidIcon from '@/_ui/Icon/SolidIcons';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: TextInput.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/Input/CommonInput/TextInput.jsx
Signals: React
Excerpt (<=80 chars): import SolidIcon from '@/_ui/Icon/SolidIcons';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Index.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/Input/EditableTitleInput/Index.jsx
Signals: React
Excerpt (<=80 chars): import SolidIcon from '@/_ui/Icon/SolidIcons';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: HelperIcon.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/Input/InputUtils/HelperIcon.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: InputUtils.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/Input/InputUtils/InputUtils.jsx
Signals: React
Excerpt (<=80 chars):  export const ValidationMessage = ({ response, validationMessage, className }...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ValidationMessage
- HelperMessage
- RequiredIndicator
- InputLabel
```

--------------------------------------------------------------------------------

---[FILE: TrailingBtn.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/Input/InputUtils/TrailingBtn.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ValidationIcon.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/Input/InputUtils/ValidationIcon.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Variants.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/Input/InputUtils/Variants.jsx
Signals: N/A
Excerpt (<=80 chars):  export const inputVariants = cva('', {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- inputVariants
```

--------------------------------------------------------------------------------

---[FILE: Label.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/Label/Label.jsx
Signals: React
Excerpt (<=80 chars): import * as React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Index.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/ListItems/Index.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ListItems.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/ListItems/ListItems.jsx
Signals: React
Excerpt (<=80 chars): import React, { useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ListItems.stories.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/ListItems/ListItems.stories.jsx
Signals: React
Excerpt (<=80 chars):  export const RocketListItems = Template.bind({});

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RocketListItems
- RocketListItemsIndexed
- RocketListItemsWithBackground
- RocketListItemsWithBackgroundIndexed
- RocketListItemsWithAddon
- RocketListItemsWithTrailingAction
```

--------------------------------------------------------------------------------

---[FILE: ListItemsUtils.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/ListItems/ListItemsUtils/ListItemsUtils.jsx
Signals: React
Excerpt (<=80 chars):  export const Indentation = () => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Indentation
- ListItemsContent
- ListItemsAddon
- SupportingText
- Input
- ErrorIcon
- InfoIcon
- TrailingAction
- EditTrailingAction
```

--------------------------------------------------------------------------------

---[FILE: Index.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/Switch/Index.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Switch.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/Switch/Switch.jsx
Signals: React
Excerpt (<=80 chars): /* eslint-disable import/no-unresolved */

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Switch.stories.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/Switch/Switch.stories.jsx
Signals: React
Excerpt (<=80 chars):  export const RocketSwitch = Template.bind({});

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RocketSwitch
- RocketSwitchWithLabel
- RocketSwitchWithLeadingLabel
- RocketSwitchWithLabelAndHelper
- RocketSwitchWithLeadingLabelAndHelper
```

--------------------------------------------------------------------------------

---[FILE: SwitchUtils.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/Switch/SwitchUtils/SwitchUtils.jsx
Signals: React
Excerpt (<=80 chars):  export const SwitchLabel = ({ label, size, disabled }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SwitchLabel
- HelperText
```

--------------------------------------------------------------------------------

---[FILE: Index.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/Text Area/Index.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Textarea.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/Text Area/Textarea.jsx
Signals: React
Excerpt (<=80 chars): import * as React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Textarea.stories.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/Text Area/Textarea.stories.jsx
Signals: React
Excerpt (<=80 chars):  export const RocketTextArea = Template.bind({});

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RocketTextArea
- RocketTextAreaWithLabel
- RocketTextAreaWithLabelAndHelperText
```

--------------------------------------------------------------------------------

---[FILE: HelperIcon.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/Text Area/TextareaUtils/HelperIcon.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: TextareaUtils.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/Text Area/TextareaUtils/TextareaUtils.jsx
Signals: React
Excerpt (<=80 chars):  export const ValidationMessage = ({ response, validationMessage, className }...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ValidationMessage
- HelperMessage
- RequiredIndicator
- InputLabel
```

--------------------------------------------------------------------------------

---[FILE: ValidationIcon.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/Text Area/TextareaUtils/ValidationIcon.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Tooltip.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/Tooltip/Tooltip.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Tooltip.stories.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/Tooltip/Tooltip.stories.jsx
Signals: N/A
Excerpt (<=80 chars):  export const RocketTooltip = {};

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RocketTooltip
```

--------------------------------------------------------------------------------

---[FILE: Arrow.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/Tooltip/TooltipUtils/Arrow.jsx
Signals: React
Excerpt (<=80 chars):  export const Arrow = ({ side, theme }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Arrow
- BottomRightArrow
- BottomCenterArrow
- BottomLeftArrow
- TopCenterArrow
- LeftArrow
- RightArrow
```

--------------------------------------------------------------------------------

---[FILE: TooltipUtils.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/Tooltip/TooltipUtils/TooltipUtils.jsx
Signals: N/A
Excerpt (<=80 chars):  export const arrowVariants = cva('tw-flex', {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- arrowVariants
- tooltipVariants
```

--------------------------------------------------------------------------------

---[FILE: loader.jsx]---
Location: ToolJet-develop/frontend/src/components/ui/utilComponents/loader.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: LinkExpiredPage.jsx]---
Location: ToolJet-develop/frontend/src/ConfirmationPage/LinkExpiredPage.jsx
Signals: React
Excerpt (<=80 chars):  export const LinkExpiredPage = () => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LinkExpiredPage
```

--------------------------------------------------------------------------------

---[FILE: OrganizationInvitationPage.jsx]---
Location: ToolJet-develop/frontend/src/ConfirmationPage/OrganizationInvitationPage.jsx
Signals: React
Excerpt (<=80 chars):  export const OrganizationInvitationPage = withTranslation()(withRouter(Organ...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OrganizationInvitationPage
```

--------------------------------------------------------------------------------

---[FILE: ActionTypes.js]---
Location: ToolJet-develop/frontend/src/Editor/ActionTypes.js
Signals: N/A
Excerpt (<=80 chars): export const ActionTypes = [

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ActionTypes
```

--------------------------------------------------------------------------------

---[FILE: AutoLayoutAlert.jsx]---
Location: ToolJet-develop/frontend/src/Editor/AutoLayoutAlert.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Box.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Box.jsx
Signals: React
Excerpt (<=80 chars):  export const Box = React.memo((props) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Box
```

--------------------------------------------------------------------------------

---[FILE: BoxDragPreview.jsx]---
Location: ToolJet-develop/frontend/src/Editor/BoxDragPreview.jsx
Signals: React
Excerpt (<=80 chars):  export const BoxDragPreview = memo(function BoxDragPreview({ item, canvasWid...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BoxDragPreview
```

--------------------------------------------------------------------------------

---[FILE: BoxUI.jsx]---
Location: ToolJet-develop/frontend/src/Editor/BoxUI.jsx
Signals: React
Excerpt (<=80 chars): import React, { useContext, useEffect } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Comments.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Comments.jsx
Signals: React
Excerpt (<=80 chars): import '@/_styles/editor/comments.scss';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: component-properties-resolution.js]---
Location: ToolJet-develop/frontend/src/Editor/component-properties-resolution.js
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
Location: ToolJet-develop/frontend/src/Editor/component-properties-validation.js
Signals: N/A
Excerpt (<=80 chars):  export const generateSchemaFromValidationDefinition = (definition, recursion...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- generateSchemaFromValidationDefinition
- validate
- validateProperties
- validateProperty
```

--------------------------------------------------------------------------------

---[FILE: ConfigHandle.jsx]---
Location: ToolJet-develop/frontend/src/Editor/ConfigHandle.jsx
Signals: React
Excerpt (<=80 chars):  export const ConfigHandle = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ConfigHandle
```

--------------------------------------------------------------------------------

---[FILE: constants.js]---
Location: ToolJet-develop/frontend/src/Editor/constants.js
Signals: N/A
Excerpt (<=80 chars): export const SUBCONTAINER_WITH_SCROLL = new Set(['Modal', 'Form', 'Container']);

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SUBCONTAINER_WITH_SCROLL
```

--------------------------------------------------------------------------------

---[FILE: Container.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Container.jsx
Signals: React, TypeORM
Excerpt (<=80 chars):  export const Container = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Container
```

--------------------------------------------------------------------------------

---[FILE: ControlledComponentToRender.jsx]---
Location: ToolJet-develop/frontend/src/Editor/ControlledComponentToRender.jsx
Signals: React
Excerpt (<=80 chars):  export const shouldUpdate = (prevProps, nextProps) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- shouldUpdate
```

--------------------------------------------------------------------------------

---[FILE: Cursor.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Cursor.jsx
Signals: React
Excerpt (<=80 chars): export const Cursor = React.memo(({ x, y, color, name }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Cursor
```

--------------------------------------------------------------------------------

---[FILE: CustomDragLayer.jsx]---
Location: ToolJet-develop/frontend/src/Editor/CustomDragLayer.jsx
Signals: React
Excerpt (<=80 chars): export const CustomDragLayer = ({ canvasWidth, onDragging }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CustomDragLayer
```

--------------------------------------------------------------------------------

---[FILE: DragContainer.jsx]---
Location: ToolJet-develop/frontend/src/Editor/DragContainer.jsx
Signals: React
Excerpt (<=80 chars):  export function findHighestLevelofSelection(selectedComponents) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- findHighestLevelofSelection
```

--------------------------------------------------------------------------------

---[FILE: DraggableBox.jsx]---
Location: ToolJet-develop/frontend/src/Editor/DraggableBox.jsx
Signals: React
Excerpt (<=80 chars): /* eslint-disable react-hooks/exhaustive-deps */

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Editor.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Editor.jsx
Signals: React
Excerpt (<=80 chars):  export const Editor = withTranslation()(withRouter(EditorComponent));

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Editor
```

--------------------------------------------------------------------------------

---[FILE: editorConstants.js]---
Location: ToolJet-develop/frontend/src/Editor/editorConstants.js
Signals: N/A
Excerpt (<=80 chars): export const ItemTypes = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ItemTypes
- EditorConstants
- decimalToHex
- maskedWorkspaceConstantStr
```

--------------------------------------------------------------------------------

---[FILE: EditorKeyHooks.jsx]---
Location: ToolJet-develop/frontend/src/Editor/EditorKeyHooks.jsx
Signals: React
Excerpt (<=80 chars):  export const EditorKeyHooks = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EditorKeyHooks
```

--------------------------------------------------------------------------------

---[FILE: EditorSelecto.jsx]---
Location: ToolJet-develop/frontend/src/Editor/EditorSelecto.jsx
Signals: React
Excerpt (<=80 chars): import React, { useCallback, memo } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ErrorBoundary.jsx]---
Location: ToolJet-develop/frontend/src/Editor/ErrorBoundary.jsx
Signals: React
Excerpt (<=80 chars): import React, { Component } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: GhostWidget.jsx]---
Location: ToolJet-develop/frontend/src/Editor/GhostWidget.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: gridUtils.js]---
Location: ToolJet-develop/frontend/src/Editor/gridUtils.js
Signals: N/A
Excerpt (<=80 chars):  export function correctBounds(layout, bounds) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- correctBounds
- compact
- getStatics
- cloneLayoutItem
- bottom
- individualGroupableProps
- handleWidgetResize
```

--------------------------------------------------------------------------------

---[FILE: RealtimeAvatars.jsx]---
Location: ToolJet-develop/frontend/src/Editor/RealtimeAvatars.jsx
Signals: React
Excerpt (<=80 chars): import React, { useEffect } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RealtimeCursors.jsx]---
Location: ToolJet-develop/frontend/src/Editor/RealtimeCursors.jsx
Signals: React
Excerpt (<=80 chars): /* eslint-disable import/no-unresolved */

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RealtimeEditor.jsx]---
Location: ToolJet-develop/frontend/src/Editor/RealtimeEditor.jsx
Signals: React
Excerpt (<=80 chars):  export const RealtimeEditor = (props) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RealtimeEditor
```

--------------------------------------------------------------------------------

---[FILE: RightSidebarTabManager.jsx]---
Location: ToolJet-develop/frontend/src/Editor/RightSidebarTabManager.jsx
Signals: React
Excerpt (<=80 chars): import { useEditorStore } from '@/_stores/editorStore';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: SubContainer.jsx]---
Location: ToolJet-develop/frontend/src/Editor/SubContainer.jsx
Signals: React
Excerpt (<=80 chars):  export const SubContainer = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SubContainer
```

--------------------------------------------------------------------------------

---[FILE: SubCustomDragLayer.jsx]---
Location: ToolJet-develop/frontend/src/Editor/SubCustomDragLayer.jsx
Signals: React
Excerpt (<=80 chars): export const SubCustomDragLayer = ({ parentRef, parent, currentLayout }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SubCustomDragLayer
```

--------------------------------------------------------------------------------

---[FILE: Viewer.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Viewer.jsx
Signals: React
Excerpt (<=80 chars):  export const Viewer = withTranslation()(withStore(withRouter(ViewerComponent...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Viewer
```

--------------------------------------------------------------------------------

---[FILE: WidgetBox.jsx]---
Location: ToolJet-develop/frontend/src/Editor/WidgetBox.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: WidgetManager.jsx]---
Location: ToolJet-develop/frontend/src/Editor/WidgetManager.jsx
Signals: React
Excerpt (<=80 chars):  export const WidgetManager = function WidgetManager({ componentTypes, zoomLe...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WidgetManager
```

--------------------------------------------------------------------------------

---[FILE: AppVersionsManager.jsx]---
Location: ToolJet-develop/frontend/src/Editor/AppVersionsManager/AppVersionsManager.jsx
Signals: React
Excerpt (<=80 chars):  export const AppVersionsManager = function ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AppVersionsManager
```

--------------------------------------------------------------------------------

---[FILE: CreateVersionModal.jsx]---
Location: ToolJet-develop/frontend/src/Editor/AppVersionsManager/CreateVersionModal.jsx
Signals: React
Excerpt (<=80 chars):  export const CreateVersion = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CreateVersion
```

--------------------------------------------------------------------------------

---[FILE: CustomSelect.jsx]---
Location: ToolJet-develop/frontend/src/Editor/AppVersionsManager/CustomSelect.jsx
Signals: React
Excerpt (<=80 chars):  export const SingleValue = ({ selectProps }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SingleValue
- CustomSelect
```

--------------------------------------------------------------------------------

---[FILE: EditVersionModal.jsx]---
Location: ToolJet-develop/frontend/src/Editor/AppVersionsManager/EditVersionModal.jsx
Signals: React
Excerpt (<=80 chars):  export const EditVersion = ({ appId, setShowEditAppVersion, showEditAppVersi...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EditVersion
```

--------------------------------------------------------------------------------

---[FILE: ReleasedVersionError.jsx]---
Location: ToolJet-develop/frontend/src/Editor/AppVersionsManager/ReleasedVersionError.jsx
Signals: React
Excerpt (<=80 chars):  export const ReleasedVersionError = () => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ReleasedVersionError
```

--------------------------------------------------------------------------------

---[FILE: CodeBuilder.jsx]---
Location: ToolJet-develop/frontend/src/Editor/CodeBuilder/CodeBuilder.jsx
Signals: React
Excerpt (<=80 chars):  export function CodeBuilder({ initialValue, onChange, components }) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CodeBuilder
```

--------------------------------------------------------------------------------

---[FILE: CodeHinterContext.js]---
Location: ToolJet-develop/frontend/src/Editor/CodeBuilder/CodeHinterContext.js
Signals: React
Excerpt (<=80 chars):  export const CodeHinterContext = createContext({});

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CodeHinterContext
```

--------------------------------------------------------------------------------

---[FILE: TypeMapping.js]---
Location: ToolJet-develop/frontend/src/Editor/CodeBuilder/TypeMapping.js
Signals: N/A
Excerpt (<=80 chars): export const TypeMapping = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TypeMapping
```

--------------------------------------------------------------------------------

---[FILE: utils.js]---
Location: ToolJet-develop/frontend/src/Editor/CodeBuilder/utils.js
Signals: N/A
Excerpt (<=80 chars):  export function getSuggestionKeys(refState) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getSuggestionKeys
- attachCustomResolvables
- generateHints
- computeCurrentWord
- makeOverlay
- onBeforeChange
- canShowHint
- handleChange
```

--------------------------------------------------------------------------------

---[FILE: AlignButtons.jsx]---
Location: ToolJet-develop/frontend/src/Editor/CodeBuilder/Elements/AlignButtons.jsx
Signals: React
Excerpt (<=80 chars):  export const AlignButtons = ({ value, onChange, forceCodeBox, meta }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AlignButtons
```

--------------------------------------------------------------------------------

---[FILE: BoxShadow.jsx]---
Location: ToolJet-develop/frontend/src/Editor/CodeBuilder/Elements/BoxShadow.jsx
Signals: React
Excerpt (<=80 chars):  export const BoxShadow = ({ value, onChange, cyLabel }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BoxShadow
```

--------------------------------------------------------------------------------

---[FILE: Checkbox.jsx]---
Location: ToolJet-develop/frontend/src/Editor/CodeBuilder/Elements/Checkbox.jsx
Signals: React
Excerpt (<=80 chars): import React, { useState, useEffect } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ClientServerSwitch.jsx]---
Location: ToolJet-develop/frontend/src/Editor/CodeBuilder/Elements/ClientServerSwitch.jsx
Signals: React
Excerpt (<=80 chars): import ToggleGroup from '@/ToolJetUI/SwitchGroup/ToggleGroup';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Color.jsx]---
Location: ToolJet-develop/frontend/src/Editor/CodeBuilder/Elements/Color.jsx
Signals: React
Excerpt (<=80 chars):  export const Color = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Color
```

--------------------------------------------------------------------------------

---[FILE: FxButton.jsx]---
Location: ToolJet-develop/frontend/src/Editor/CodeBuilder/Elements/FxButton.jsx
Signals: React
Excerpt (<=80 chars): import Fx from '@/_ui/Icon/bulkIcons/Fx';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Icon.jsx]---
Location: ToolJet-develop/frontend/src/Editor/CodeBuilder/Elements/Icon.jsx
Signals: React
Excerpt (<=80 chars):  export const Icon = ({ value, onChange, onVisibilityChange, styleDefinition,...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Icon
```

--------------------------------------------------------------------------------

---[FILE: Input.jsx]---
Location: ToolJet-develop/frontend/src/Editor/CodeBuilder/Elements/Input.jsx
Signals: React
Excerpt (<=80 chars):  export const Input = ({ value, onChange, cyLabel, meta }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Input
```

--------------------------------------------------------------------------------

---[FILE: Json.jsx]---
Location: ToolJet-develop/frontend/src/Editor/CodeBuilder/Elements/Json.jsx
Signals: React
Excerpt (<=80 chars):  export const Json = ({ value, onChange }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Json
```

--------------------------------------------------------------------------------

---[FILE: Number.jsx]---
Location: ToolJet-develop/frontend/src/Editor/CodeBuilder/Elements/Number.jsx
Signals: React
Excerpt (<=80 chars):  export const Number = ({ value, onChange, cyLabel }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Number
```

--------------------------------------------------------------------------------

---[FILE: NumberInput.jsx]---
Location: ToolJet-develop/frontend/src/Editor/CodeBuilder/Elements/NumberInput.jsx
Signals: React
Excerpt (<=80 chars):  export const NumberInput = ({ value, onChange, cyLabel, meta }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NumberInput
```

--------------------------------------------------------------------------------

---[FILE: Select.jsx]---
Location: ToolJet-develop/frontend/src/Editor/CodeBuilder/Elements/Select.jsx
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
Location: ToolJet-develop/frontend/src/Editor/CodeBuilder/Elements/Slider.jsx
Signals: React
Excerpt (<=80 chars): import React, { useState, useEffect } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Switch.jsx]---
Location: ToolJet-develop/frontend/src/Editor/CodeBuilder/Elements/Switch.jsx
Signals: React
Excerpt (<=80 chars): import ToggleGroup from '@/ToolJetUI/SwitchGroup/ToggleGroup';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: TableRowHeightInput.jsx]---
Location: ToolJet-develop/frontend/src/Editor/CodeBuilder/Elements/TableRowHeightInput.jsx
Signals: React
Excerpt (<=80 chars): import React, { useEffect, useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Toggle.jsx]---
Location: ToolJet-develop/frontend/src/Editor/CodeBuilder/Elements/Toggle.jsx
Signals: React
Excerpt (<=80 chars):  export const Toggle = ({ value, onChange, cyLabel, meta }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Toggle
```

--------------------------------------------------------------------------------

---[FILE: Visibility.jsx]---
Location: ToolJet-develop/frontend/src/Editor/CodeBuilder/Elements/Visibility.jsx
Signals: React
Excerpt (<=80 chars):  export const Visibility = ({ onVisibilityChange, styleDefinition }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Visibility
```

--------------------------------------------------------------------------------

---[FILE: ToolTip.jsx]---
Location: ToolJet-develop/frontend/src/Editor/CodeBuilder/Elements/Components/ToolTip.jsx
Signals: React
Excerpt (<=80 chars):  export const ToolTip = ({ label, meta, labelClass }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ToolTip
```

--------------------------------------------------------------------------------

---[FILE: autocompleteExtensionConfig.js]---
Location: ToolJet-develop/frontend/src/Editor/CodeEditor/autocompleteExtensionConfig.js
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
Location: ToolJet-develop/frontend/src/Editor/CodeEditor/autocompleteUtils.js
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
Location: ToolJet-develop/frontend/src/Editor/CodeEditor/CodeHinter.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DynamicFxTypeRenderer.jsx]---
Location: ToolJet-develop/frontend/src/Editor/CodeEditor/DynamicFxTypeRenderer.jsx
Signals: React
Excerpt (<=80 chars):  export const DynamicFxTypeRenderer = ({ paramType, ...restProps }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DynamicFxTypeRenderer
```

--------------------------------------------------------------------------------

---[FILE: MultiLineCodeEditor.jsx]---
Location: ToolJet-develop/frontend/src/Editor/CodeEditor/MultiLineCodeEditor.jsx
Signals: React
Excerpt (<=80 chars): /* eslint-disable import/no-unresolved */

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

````
