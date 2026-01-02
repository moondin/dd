---
source_txt: fullstack_samples/ToolJet-develop
converted_utc: 2025-12-18T10:37:21Z
part: 6
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES ToolJet-develop

## Extracted Reusable Patterns (Non-verbatim) (Part 6 of 37)

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

---[FILE: utils.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Form/utils/utils.js
Signals: React
Excerpt (<=80 chars):  export const buildOptions = (options = []) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- buildOptions
- ensureHandlebars
- isTrueValue
- isPropertyFxControlled
- isValidJSONObject
- getDataType
- buildFieldObject
- parseDataAndBuildFields
- findNextElementTop
- getComponentIcon
- getInputTypeOptions
- constructFeildForSave
- analyzeJsonDifferences
- mergeFieldsWithComponentDefinition
- mergeFormFieldsWithNewData
- cleanupFormFields
- findFirstKeyValuePairWithPath
- mergeArrays
```

--------------------------------------------------------------------------------

---[FILE: ColumnMappingComponent.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Form/_components/ColumnMappingComponent.jsx
Signals: React
Excerpt (<=80 chars): import React, { useState, useCallback, useMemo, useEffect, useRef } from 'rea...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DataSection.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Form/_components/DataSection.jsx
Signals: React
Excerpt (<=80 chars):  export const DataSection = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DataSection
```

--------------------------------------------------------------------------------

---[FILE: DataSectionUI.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Form/_components/DataSectionUI.jsx
Signals: React
Excerpt (<=80 chars): import React, { useState, useRef, useMemo, useCallback, useEffect } from 'rea...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DataSectionWrapper.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Form/_components/DataSectionWrapper.jsx
Signals: React
Excerpt (<=80 chars): import React, { useEffect } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: FieldPopoverContent.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Form/_components/FieldPopoverContent.jsx
Signals: React
Excerpt (<=80 chars): import React, { useState, useEffect, useMemo, useCallback } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: FormField.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Form/_components/FormField.jsx
Signals: React
Excerpt (<=80 chars):  export const FormField = ({ field, onDelete, activeMenu, onMenuToggle, onSav...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FormField
```

--------------------------------------------------------------------------------

---[FILE: FormFieldsList.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Form/_components/FormFieldsList.jsx
Signals: React
Excerpt (<=80 chars):  export const FormFieldsList = ({ fields, onDeleteField, currentStatusRef, on...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FormFieldsList
```

--------------------------------------------------------------------------------

---[FILE: LabeledDivider.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Form/_components/LabeledDivider.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: useColumnMapping.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Form/_components/hooks/useColumnMapping.js
Signals: React
Excerpt (<=80 chars): export const useColumnBuilder = (

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useColumnBuilder
- useGroupedColumns
- useCheckboxStates
```

--------------------------------------------------------------------------------

---[FILE: useDropdownState.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Form/_hooks/useDropdownState.js
Signals: React
Excerpt (<=80 chars):  export const useDropdownState = () => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useDropdownState
```

--------------------------------------------------------------------------------

---[FILE: useFormData.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Form/_hooks/useFormData.js
Signals: React
Excerpt (<=80 chars):  export const useFormData = (component) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useFormData
```

--------------------------------------------------------------------------------

---[FILE: useFormLogic.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Form/_hooks/useFormLogic.js
Signals: React
Excerpt (<=80 chars):  export const useFormLogic = (component, paramUpdated) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useFormLogic
```

--------------------------------------------------------------------------------

---[FILE: useFormState.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Form/_hooks/useFormState.js
Signals: React
Excerpt (<=80 chars):  export const useFormState = (component) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useFormState
```

--------------------------------------------------------------------------------

---[FILE: PhoneInput.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/PhoneInput/PhoneInput.jsx
Signals: React
Excerpt (<=80 chars):  export const PhoneInput = ({ componentMeta, darkMode, ...restProps }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PhoneInput
```

--------------------------------------------------------------------------------

---[FILE: NoListItem.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Table/NoListItem.jsx
Signals: React
Excerpt (<=80 chars): import SolidIcon from '@/_ui/Icon/SolidIcons';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ProgramaticallyHandleProperties.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Table/ProgramaticallyHandleProperties.jsx
Signals: React
Excerpt (<=80 chars):  export const ProgramaticallyHandleProperties = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProgramaticallyHandleProperties
```

--------------------------------------------------------------------------------

---[FILE: Table.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Table/Table.jsx
Signals: React
Excerpt (<=80 chars):  export const Table = withTranslation()(TableComponent);

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Table
```

--------------------------------------------------------------------------------

---[FILE: utils.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Table/utils.js
Signals: N/A
Excerpt (<=80 chars):  export const getColumnIcon = (columnType) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getColumnIcon
```

--------------------------------------------------------------------------------

---[FILE: ColumnPopover.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Table/ColumnManager/ColumnPopover.jsx
Signals: React
Excerpt (<=80 chars):  export const ColumnPopoverContent = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ColumnPopoverContent
```

--------------------------------------------------------------------------------

---[FILE: DatepickerProperties.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Table/ColumnManager/DatepickerProperties.jsx
Signals: React
Excerpt (<=80 chars): import React, { useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DeprecatedColumnTypeMsg.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Table/ColumnManager/DeprecatedColumnTypeMsg.jsx
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
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Table/ColumnManager/PropertiesTabElements.jsx
Signals: React
Excerpt (<=80 chars):  export const PropertiesTabElements = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PropertiesTabElements
```

--------------------------------------------------------------------------------

---[FILE: StylesTabElements.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Table/ColumnManager/StylesTabElements.jsx
Signals: React
Excerpt (<=80 chars):  export const StylesTabElements = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- StylesTabElements
```

--------------------------------------------------------------------------------

---[FILE: ValidationProperties.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Table/ColumnManager/ValidationProperties.jsx
Signals: React
Excerpt (<=80 chars):  export const ValidationProperties = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ValidationProperties
```

--------------------------------------------------------------------------------

---[FILE: OptionsList.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Table/SelectOptionsList/OptionsList.jsx
Signals: React
Excerpt (<=80 chars): export const OptionsList = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OptionsList
```

--------------------------------------------------------------------------------

---[FILE: BadgeTypeIcon.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Table/_assets/BadgeTypeIcon.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: BooleanTypeIcon.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Table/_assets/BooleanTypeIcon.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DatepickerTypeIcon.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Table/_assets/DatepickerTypeIcon.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: HTMLTypeIcon.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Table/_assets/HTMLTypeIcon.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ImageTypeIcon.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Table/_assets/ImageTypeIcon.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: JSONTypeIcon.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Table/_assets/JSONTypeIcon.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: LinkTypeIcon.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Table/_assets/LinkTypeIcon.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: MarkdownTypeIcon.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Table/_assets/MarkdownTypeIcon.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: MultiselectTypeIcon.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Table/_assets/MultiselectTypeIcon.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: NumberTypeIcon.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Table/_assets/NumberTypeIcon.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: RadioTypeIcon.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Table/_assets/RadioTypeIcon.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: SelectTypeIcon.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Table/_assets/SelectTypeIcon.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: StringTypeIcon.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Table/_assets/StringTypeIcon.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: TagsTypeIcon.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Table/_assets/TagsTypeIcon.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: TextTypeIcon.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Components/Table/_assets/TextTypeIcon.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: AlignButtons.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Elements/AlignButtons.jsx
Signals: React
Excerpt (<=80 chars):  export const AlignButtons = ({ param, definition, onChange, paramType, compo...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AlignButtons
```

--------------------------------------------------------------------------------

---[FILE: Code.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Elements/Code.jsx
Signals: React
Excerpt (<=80 chars):  export const Code = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Code
```

--------------------------------------------------------------------------------

---[FILE: Color.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Elements/Color.jsx
Signals: React
Excerpt (<=80 chars):  export const Color = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Color
```

--------------------------------------------------------------------------------

---[FILE: Json.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Elements/Json.jsx
Signals: React
Excerpt (<=80 chars):  export const Json = ({ param, definition, onChange, paramType, componentMeta...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Json
```

--------------------------------------------------------------------------------

---[FILE: Select.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Elements/Select.jsx
Signals: React
Excerpt (<=80 chars):  export const Select = ({ param, definition, onChange, paramType, componentMe...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Select
```

--------------------------------------------------------------------------------

---[FILE: Text.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Elements/Text.jsx
Signals: React
Excerpt (<=80 chars):  export const Text = ({ param, definition, onChange, paramType, componentMeta...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Text
```

--------------------------------------------------------------------------------

---[FILE: Toggle.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Elements/Toggle.jsx
Signals: React
Excerpt (<=80 chars):  export const Toggle = ({ param, definition, onChange, paramType, componentMe...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Toggle
```

--------------------------------------------------------------------------------

---[FILE: utils.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Elements/utils.js
Signals: N/A
Excerpt (<=80 chars):  export const getDefinitionInitialValue = (paramType, param, definition, comp...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getDefinitionInitialValue
```

--------------------------------------------------------------------------------

---[FILE: ToolTip.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/Inspector/Elements/Components/ToolTip.jsx
Signals: React
Excerpt (<=80 chars):  export const ToolTip = ({ label, meta, labelClass, bold = false }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ToolTip
```

--------------------------------------------------------------------------------

---[FILE: CollapsableToggle.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/PageSettingsTab/CollapsableToggle.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: LabelStyleToggle.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/PageSettingsTab/LabelStyleToggle.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: pageConfig.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/PageSettingsTab/pageConfig.js
Signals: N/A
Excerpt (<=80 chars): export const pageConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- pageConfig
```

--------------------------------------------------------------------------------

---[FILE: PageSettings.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/PageSettingsTab/PageSettings.jsx
Signals: React
Excerpt (<=80 chars):  export const PageSettings = () => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PageSettings
- AppHeaderMenu
```

--------------------------------------------------------------------------------

---[FILE: AddNewPageMenu.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/PageSettingsTab/PageMenu/AddNewPageMenu.jsx
Signals: React
Excerpt (<=80 chars):  export function AddNewPageMenu({ darkMode, isLicensed }) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddNewPageMenu
```

--------------------------------------------------------------------------------

---[FILE: AddNewPagePopup.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/PageSettingsTab/PageMenu/AddNewPagePopup.jsx
Signals: React
Excerpt (<=80 chars):  export const AddEditPagePopup = forwardRef(({ darkMode, ...props }, ref) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddEditPagePopup
```

--------------------------------------------------------------------------------

---[FILE: AddPageButton.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/PageSettingsTab/PageMenu/AddPageButton.jsx
Signals: React
Excerpt (<=80 chars):  export const PageGroupMenu = ({ darkMode, isLicensed, disabled }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PageGroupMenu
```

--------------------------------------------------------------------------------

---[FILE: DeletePageConfirmationModal.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/PageSettingsTab/PageMenu/DeletePageConfirmationModal.jsx
Signals: React
Excerpt (<=80 chars):  export function DeletePageConfirmationModal({ darkMode }) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeletePageConfirmationModal
```

--------------------------------------------------------------------------------

---[FILE: DeletePageGroupConfirmationModal.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/PageSettingsTab/PageMenu/DeletePageGroupConfirmationModal.jsx
Signals: React
Excerpt (<=80 chars):  export const DeletePageGroupConfirmationModal = ({ onConfirm, onCancel, dark...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeletePageGroupConfirmationModal
```

--------------------------------------------------------------------------------

---[FILE: EditInput.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/PageSettingsTab/PageMenu/EditInput.jsx
Signals: React
Excerpt (<=80 chars):  export const EditInput = ({ slug, error, setError, pageHandle, setPageHandle...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EditInput
```

--------------------------------------------------------------------------------

---[FILE: EditModal.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/PageSettingsTab/PageMenu/EditModal.jsx
Signals: React
Excerpt (<=80 chars):  export const EditModal = ({ darkMode }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EditModal
```

--------------------------------------------------------------------------------

---[FILE: IconSelector.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/PageSettingsTab/PageMenu/IconSelector.jsx
Signals: React
Excerpt (<=80 chars): import React, { useRef, useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: PageGroup.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/PageSettingsTab/PageMenu/PageGroup.jsx
Signals: React
Excerpt (<=80 chars):  export const RenderPage = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RenderPage
- RenderPageAndPageGroup
```

--------------------------------------------------------------------------------

---[FILE: PageGroupItem.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/PageSettingsTab/PageMenu/PageGroupItem.jsx
Signals: React
Excerpt (<=80 chars):  export const PageGroupItem = memo(({ page, index, collapsed, onCollapse, hig...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PageGroupItem
```

--------------------------------------------------------------------------------

---[FILE: PageHandlerMenu.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/PageSettingsTab/PageMenu/PageHandlerMenu.jsx
Signals: React
Excerpt (<=80 chars):  export const PageHandlerMenu = ({ darkMode }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PageHandlerMenu
```

--------------------------------------------------------------------------------

---[FILE: PageMenu.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/PageSettingsTab/PageMenu/PageMenu.jsx
Signals: React
Excerpt (<=80 chars):  export const PageMenu = ({ darkMode, switchPage, pinned, setPinned }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PageMenu
```

--------------------------------------------------------------------------------

---[FILE: PageMenuItem.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/PageSettingsTab/PageMenu/PageMenuItem.jsx
Signals: React
Excerpt (<=80 chars):  export const PAGE_TYPES = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PAGE_TYPES
- PageMenuItem
- AddingPageHandler
```

--------------------------------------------------------------------------------

---[FILE: PageMenuItemGhost.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/PageSettingsTab/PageMenu/PageMenuItemGhost.jsx
Signals: React
Excerpt (<=80 chars):  export const PageMenuItemGhost = memo(({ darkMode, page }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PageMenuItemGhost
```

--------------------------------------------------------------------------------

---[FILE: PageOptions.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/PageSettingsTab/PageMenu/PageOptions.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: PagesSidebarNavigation.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/PageSettingsTab/PageMenu/PagesSidebarNavigation.jsx
Signals: React
Excerpt (<=80 chars):  export const PagesSidebarNavigation = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PagesSidebarNavigation
```

--------------------------------------------------------------------------------

---[FILE: RenameInput.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/PageSettingsTab/PageMenu/RenameInput.jsx
Signals: React
Excerpt (<=80 chars):  export const RenameInput = ({ page, updaterCallback }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RenameInput
```

--------------------------------------------------------------------------------

---[FILE: SettingsModal.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/PageSettingsTab/PageMenu/SettingsModal.jsx
Signals: React
Excerpt (<=80 chars):  export const SettingsModal = ({ darkMode }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SettingsModal
```

--------------------------------------------------------------------------------

---[FILE: keyboardCoordinates.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/PageSettingsTab/PageMenu/Tree/keyboardCoordinates.js
Signals: N/A
Excerpt (<=80 chars):  export const sortableTreeKeyboardCoordinates =

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- sortableTreeKeyboardCoordinates
```

--------------------------------------------------------------------------------

---[FILE: SortableTree.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/PageSettingsTab/PageMenu/Tree/SortableTree.js
Signals: React
Excerpt (<=80 chars):  export function SortableTree({ collapsible, indicator = false, indentationWi...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SortableTree
```

--------------------------------------------------------------------------------

---[FILE: utilities.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/PageSettingsTab/PageMenu/Tree/utilities.js
Signals: N/A
Excerpt (<=80 chars):  export const iOS = /iPad|iPhone|iPod/.test(navigator.platform);

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getProjection
- flattenTree
- buildTree
- findItem
- findItemDeep
- removeItem
- setProperty
- getChildCount
- removeChildrenOf
- iOS
```

--------------------------------------------------------------------------------

---[FILE: CustomSensor.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/PageSettingsTab/PageMenu/Tree/components/TreeItem/CustomSensor.js
Signals: N/A
Excerpt (<=80 chars):  export class CustomPointerSensor extends PointerSensor {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CustomPointerSensor
```

--------------------------------------------------------------------------------

---[FILE: SortableTreeItem.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/PageSettingsTab/PageMenu/Tree/components/TreeItem/SortableTreeItem.js
Signals: React
Excerpt (<=80 chars):  export function SortableTreeItem({ id, depth, ...props }) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SortableTreeItem
```

--------------------------------------------------------------------------------

---[FILE: TreeItem.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/PageSettingsTab/PageMenu/Tree/components/TreeItem/TreeItem.js
Signals: React
Excerpt (<=80 chars):  export const TreeItem = forwardRef(

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TreeItem
```

--------------------------------------------------------------------------------

---[FILE: WidgetBox.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/RightSideBar/WidgetBox/WidgetBox.jsx
Signals: React
Excerpt (<=80 chars):  export const WidgetBox = ({ component, darkMode }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WidgetBox
```

--------------------------------------------------------------------------------

---[FILE: Confirm.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Viewer/Confirm.jsx
Signals: React
Excerpt (<=80 chars):  export function Confirm({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Confirm
```

--------------------------------------------------------------------------------

---[FILE: DesktopHeader.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Viewer/DesktopHeader.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Header.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Viewer/Header.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: MobileHeader.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Viewer/MobileHeader.jsx
Signals: React
Excerpt (<=80 chars): import React, { useMemo } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: MobileNavigationMenu.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Viewer/MobileNavigationMenu.jsx
Signals: React
Excerpt (<=80 chars): import React, { useEffect, useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: PreviewSettings.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Viewer/PreviewSettings.jsx
Signals: React
Excerpt (<=80 chars): import React, { useState, useEffect } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: TooljetBanner.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Viewer/TooljetBanner.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Viewer.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Viewer/Viewer.jsx
Signals: React
Excerpt (<=80 chars):  export const Viewer = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Viewer
```

--------------------------------------------------------------------------------

---[FILE: componentTypes.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/WidgetManager/componentTypes.js
Signals: N/A
Excerpt (<=80 chars):  export const componentTypes = widgets.map((widget) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- componentTypes
- componentTypeDefinitionMap
```

--------------------------------------------------------------------------------

---[FILE: restrictedWidgetsConfig.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/WidgetManager/configs/restrictedWidgetsConfig.js
Signals: N/A
Excerpt (<=80 chars): export const RESTRICTED_WIDGETS_CONFIG = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RESTRICTED_WIDGETS_CONFIG
- RESTRICTED_WIDGET_SLOTS_CONFIG
```

--------------------------------------------------------------------------------

---[FILE: widgetConfig.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/WidgetManager/configs/widgetConfig.js
Signals: N/A
Excerpt (<=80 chars):  export const widgets = [

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- widgets
```

--------------------------------------------------------------------------------

---[FILE: boundedBox.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/WidgetManager/widgets/boundedBox.js
Signals: N/A
Excerpt (<=80 chars): export const boundedBoxConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- boundedBoxConfig
```

--------------------------------------------------------------------------------

---[FILE: button.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/WidgetManager/widgets/button.js
Signals: N/A
Excerpt (<=80 chars): export const buttonConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- buttonConfig
```

--------------------------------------------------------------------------------

---[FILE: buttonGroup.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/WidgetManager/widgets/buttonGroup.js
Signals: N/A
Excerpt (<=80 chars): export const buttonGroupConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- buttonGroupConfig
```

--------------------------------------------------------------------------------

---[FILE: calendar.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/WidgetManager/widgets/calendar.js
Signals: N/A
Excerpt (<=80 chars): export const calendarConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- calendarConfig
```

--------------------------------------------------------------------------------

---[FILE: chart.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/WidgetManager/widgets/chart.js
Signals: N/A
Excerpt (<=80 chars): export const chartConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- chartConfig
```

--------------------------------------------------------------------------------

---[FILE: chat.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/WidgetManager/widgets/chat.js
Signals: N/A
Excerpt (<=80 chars): export const chatConfig = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- chatConfig
```

--------------------------------------------------------------------------------

````
