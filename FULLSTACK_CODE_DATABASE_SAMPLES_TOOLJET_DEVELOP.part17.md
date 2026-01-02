---
source_txt: fullstack_samples/ToolJet-develop
converted_utc: 2025-12-18T10:37:21Z
part: 17
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES ToolJet-develop

## Extracted Reusable Patterns (Non-verbatim) (Part 17 of 37)

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

---[FILE: index.jsx]---
Location: ToolJet-develop/frontend/src/TooljetDatabase/Sort/index.jsx
Signals: React
Excerpt (<=80 chars): import React, { useEffect, useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Footer.jsx]---
Location: ToolJet-develop/frontend/src/TooljetDatabase/Table/Footer.jsx
Signals: React
Excerpt (<=80 chars): import React, { useContext } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Header.jsx]---
Location: ToolJet-develop/frontend/src/TooljetDatabase/Table/Header.jsx
Signals: React
Excerpt (<=80 chars): import React, { useState, useContext, useEffect } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.jsx]---
Location: ToolJet-develop/frontend/src/TooljetDatabase/Table/index.jsx
Signals: React
Excerpt (<=80 chars): import React, { useEffect, useState, useContext, useRef, useMemo } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: AddNewDataPopOver.jsx]---
Location: ToolJet-develop/frontend/src/TooljetDatabase/Table/ActionsPopover/AddNewDataPopOver.jsx
Signals: React
Excerpt (<=80 chars):  export const AddNewDataPopOver = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddNewDataPopOver
```

--------------------------------------------------------------------------------

---[FILE: index.jsx]---
Location: ToolJet-develop/frontend/src/TooljetDatabase/Table/ActionsPopover/index.jsx
Signals: React
Excerpt (<=80 chars): export const TablePopover = ({ disabled, children, onEdit, onDelete, show, da...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TablePopover
```

--------------------------------------------------------------------------------

---[FILE: UniqueConstraintPopOver.jsx]---
Location: ToolJet-develop/frontend/src/TooljetDatabase/Table/ActionsPopover/UniqueConstraintPopOver.jsx
Signals: React
Excerpt (<=80 chars): export const UniqueConstraintPopOver = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UniqueConstraintPopOver
```

--------------------------------------------------------------------------------

---[FILE: index.jsx]---
Location: ToolJet-develop/frontend/src/TooljetDatabase/TableList/index.jsx
Signals: React
Excerpt (<=80 chars): import React, { useState, useEffect, useContext } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.jsx]---
Location: ToolJet-develop/frontend/src/TooljetDatabase/TableListItem/index.jsx
Signals: React
Excerpt (<=80 chars):  export const ListItem = ({ active, onClick, text = '', onDeleteCallback }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListItem
```

--------------------------------------------------------------------------------

---[FILE: index.jsx]---
Location: ToolJet-develop/frontend/src/TooljetDatabase/TableListItem/ActionsPopover/index.jsx
Signals: React
Excerpt (<=80 chars):  export const ListItemPopover = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListItemPopover
```

--------------------------------------------------------------------------------

---[FILE: index.jsx]---
Location: ToolJet-develop/frontend/src/TooljetDatabase/TooljetDatabasePage/index.jsx
Signals: React
Excerpt (<=80 chars): import React, { useContext, useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: AddNewButton.jsx]---
Location: ToolJet-develop/frontend/src/ToolJetUI/Buttons/AddNewButton/AddNewButton.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.jsx]---
Location: ToolJet-develop/frontend/src/ToolJetUI/DateRangepicker/index.jsx
Signals: React
Excerpt (<=80 chars): /* eslint-disable import/no-unresolved */

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: List.jsx]---
Location: ToolJet-develop/frontend/src/ToolJetUI/List/List.jsx
Signals: React
Excerpt (<=80 chars): import React, { useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Loader.jsx]---
Location: ToolJet-develop/frontend/src/ToolJetUI/Loader/Loader.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ToggleGroup.jsx]---
Location: ToolJet-develop/frontend/src/ToolJetUI/SwitchGroup/ToggleGroup.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ToggleGroup.stories.jsx]---
Location: ToolJet-develop/frontend/src/ToolJetUI/SwitchGroup/ToggleGroup.stories.jsx
Signals: React
Excerpt (<=80 chars): export const ClientServerToggle = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ClientServerToggle
- Default
```

--------------------------------------------------------------------------------

---[FILE: ToggleGroupItem.jsx]---
Location: ToolJet-develop/frontend/src/ToolJetUI/SwitchGroup/ToggleGroupItem.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Tab.jsx]---
Location: ToolJet-develop/frontend/src/ToolJetUI/Tabs/Tab.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Tabs.jsx]---
Location: ToolJet-develop/frontend/src/ToolJetUI/Tabs/Tabs.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.jsx]---
Location: ToolJet-develop/frontend/src/ToolJetUI/Tag/index.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Timepicker.jsx]---
Location: ToolJet-develop/frontend/src/ToolJetUI/Timepicker/Timepicker.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.jsx]---
Location: ToolJet-develop/frontend/src/WorkspaceConstants/index.jsx
Signals: React
Excerpt (<=80 chars): import React, { useEffect } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: AccordionForm.jsx]---
Location: ToolJet-develop/frontend/src/_components/AccordionForm.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ApiEndpointInput.jsx]---
Location: ToolJet-develop/frontend/src/_components/ApiEndpointInput.jsx
Signals: React
Excerpt (<=80 chars): import React, { useEffect, useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: AppButton.jsx]---
Location: ToolJet-develop/frontend/src/_components/AppButton.jsx
Signals: React
Excerpt (<=80 chars):  export const ButtonBase = function ButtonBase(props) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ButtonBase
- ButtonSolid
- IconButton
```

--------------------------------------------------------------------------------

---[FILE: AppLogo.jsx]---
Location: ToolJet-develop/frontend/src/_components/AppLogo.jsx
Signals: React
Excerpt (<=80 chars): import React, { useEffect } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: AppModal.jsx]---
Location: ToolJet-develop/frontend/src/_components/AppModal.jsx
Signals: React
Excerpt (<=80 chars):  export function AppModal({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AppModal
```

--------------------------------------------------------------------------------

---[FILE: ConfirmDialog.jsx]---
Location: ToolJet-develop/frontend/src/_components/ConfirmDialog.jsx
Signals: React
Excerpt (<=80 chars):  export function ConfirmDialog({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ConfirmDialog
```

--------------------------------------------------------------------------------

---[FILE: ConfirmDisableAutoSSOLoginModal.jsx]---
Location: ToolJet-develop/frontend/src/_components/ConfirmDisableAutoSSOLoginModal.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ConfirmDisableLastSSOModal.jsx]---
Location: ToolJet-develop/frontend/src/_components/ConfirmDisableLastSSOModal.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DarkModeToggle.jsx]---
Location: ToolJet-develop/frontend/src/_components/DarkModeToggle.jsx
Signals: React
Excerpt (<=80 chars):  export const DarkModeToggle = function DarkModeToggle({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DarkModeToggle
```

--------------------------------------------------------------------------------

---[FILE: DynamicForm.jsx]---
Location: ToolJet-develop/frontend/src/_components/DynamicForm.jsx
Signals: React, TypeORM
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DynamicFormV2.jsx]---
Location: ToolJet-develop/frontend/src/_components/DynamicFormV2.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: EnableAutomaticSSOLoginModal.jsx]---
Location: ToolJet-develop/frontend/src/_components/EnableAutomaticSSOLoginModal.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: EncyrptedFieldWrapper.jsx]---
Location: ToolJet-develop/frontend/src/_components/EncyrptedFieldWrapper.jsx
Signals: React, TypeORM
Excerpt (<=80 chars): import React, { useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: FilterPreview.jsx]---
Location: ToolJet-develop/frontend/src/_components/FilterPreview.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: FormWrapper.jsx]---
Location: ToolJet-develop/frontend/src/_components/FormWrapper.jsx
Signals: React
Excerpt (<=80 chars): export const FormWrapper = ({ callback, id, classnames, children }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FormWrapper
- textAreaEnterOnSave
```

--------------------------------------------------------------------------------

---[FILE: Googlesheets.jsx]---
Location: ToolJet-develop/frontend/src/_components/Googlesheets.jsx
Signals: React
Excerpt (<=80 chars): import React, { useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ImageWithSpinner.jsx]---
Location: ToolJet-develop/frontend/src/_components/ImageWithSpinner.jsx
Signals: React
Excerpt (<=80 chars):  export const ImageWithSpinner = ({ src, className, spinnerClassName, useSmal...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ImageWithSpinner
```

--------------------------------------------------------------------------------

---[FILE: LanguageSelection.jsx]---
Location: ToolJet-develop/frontend/src/_components/LanguageSelection.jsx
Signals: React
Excerpt (<=80 chars):  export const LanguageSelection = ({ darkMode = false, tooltipPlacement = 'bo...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LanguageSelection
```

--------------------------------------------------------------------------------

---[FILE: LegalReasonsErrorModal.jsx]---
Location: ToolJet-develop/frontend/src/_components/LegalReasonsErrorModal.jsx
Signals: React
Excerpt (<=80 chars): import React, { useEffect, useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: LoginLoader.jsx]---
Location: ToolJet-develop/frontend/src/_components/LoginLoader.jsx
Signals: React
Excerpt (<=80 chars):  export const ShowLoading = () => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ShowLoading
```

--------------------------------------------------------------------------------

---[FILE: Menu.jsx]---
Location: ToolJet-develop/frontend/src/_components/Menu.jsx
Signals: React
Excerpt (<=80 chars):  export function Menu({ isLoading, onChange, items, selected }) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Menu
```

--------------------------------------------------------------------------------

---[FILE: MultiConditions.jsx]---
Location: ToolJet-develop/frontend/src/_components/MultiConditions.jsx
Signals: React
Excerpt (<=80 chars):  export const ConditionFilter = ({ operators = [], value, onChange, placehold...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ConditionFilter
- CondtionSort
- MultiColumn
```

--------------------------------------------------------------------------------

---[FILE: MultiSelectUser.jsx]---
Location: ToolJet-develop/frontend/src/_components/MultiSelectUser.jsx
Signals: React
Excerpt (<=80 chars): import React, { useState, useEffect, useCallback, useRef } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: OAuthWrapper.jsx]---
Location: ToolJet-develop/frontend/src/_components/OAuthWrapper.jsx
Signals: React
Excerpt (<=80 chars): import OAuth from '@/_ui/OAuth';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: OnboardingCta.jsx]---
Location: ToolJet-develop/frontend/src/_components/OnboardingCta.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: OnboardingNavbar.jsx]---
Location: ToolJet-develop/frontend/src/_components/OnboardingNavbar.jsx
Signals: React
Excerpt (<=80 chars): import { redirectToDashboard } from '@/_helpers/routes';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: OverflowTooltip.jsx]---
Location: ToolJet-develop/frontend/src/_components/OverflowTooltip.jsx
Signals: React
Excerpt (<=80 chars): import React, { useEffect, useRef, useState, useCallback } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: PageSearchBox.jsx]---
Location: ToolJet-develop/frontend/src/_components/PageSearchBox.jsx
Signals: React
Excerpt (<=80 chars):  export const SearchBox = forwardRef(

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SearchBox
```

--------------------------------------------------------------------------------

---[FILE: Pagination.jsx]---
Location: ToolJet-develop/frontend/src/_components/Pagination.jsx
Signals: React
Excerpt (<=80 chars):  export const Pagination = function Pagination({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Pagination
```

--------------------------------------------------------------------------------

---[FILE: PluginsListForAppModal.jsx]---
Location: ToolJet-develop/frontend/src/_components/PluginsListForAppModal.jsx
Signals: React
Excerpt (<=80 chars):  export const PluginsListForAppModal = ({ dependentPlugins, dependentPluginsD...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PluginsListForAppModal
```

--------------------------------------------------------------------------------

---[FILE: ResetPasswordModal.jsx]---
Location: ToolJet-develop/frontend/src/_components/ResetPasswordModal.jsx
Signals: React
Excerpt (<=80 chars):  export function ResetPasswordModal({ darkMode = false, closeModal, show, use...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ResetPasswordModal
```

--------------------------------------------------------------------------------

---[FILE: SearchBox.jsx]---
Location: ToolJet-develop/frontend/src/_components/SearchBox.jsx
Signals: React
Excerpt (<=80 chars):  export const SearchBox = forwardRef(

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SearchBox
```

--------------------------------------------------------------------------------

---[FILE: Sharepoint.jsx]---
Location: ToolJet-develop/frontend/src/_components/Sharepoint.jsx
Signals: React
Excerpt (<=80 chars): import React, { useState } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Slack.jsx]---
Location: ToolJet-develop/frontend/src/_components/Slack.jsx
Signals: React, TypeORM
Excerpt (<=80 chars): import React, { useState, useEffect } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ToolTip.jsx]---
Location: ToolJet-develop/frontend/src/_components/ToolTip.jsx
Signals: React
Excerpt (<=80 chars):  export function ToolTip({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ToolTip
```

--------------------------------------------------------------------------------

---[FILE: WorkspaceSSOEnableModal.jsx]---
Location: ToolJet-develop/frontend/src/_components/WorkspaceSSOEnableModal.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: WrappedCta.jsx]---
Location: ToolJet-develop/frontend/src/_components/WrappedCta.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Zendesk.jsx]---
Location: ToolJet-develop/frontend/src/_components/Zendesk.jsx
Signals: React
Excerpt (<=80 chars): import React, { useState, useEffect } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: CopyToClipboard.jsx]---
Location: ToolJet-develop/frontend/src/_components/CopyToClipboard/CopyToClipboard.jsx
Signals: React
Excerpt (<=80 chars):  export const CopyToClipboardComponent = ({ children, data, callback, useCopy...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CopyToClipboardComponent
```

--------------------------------------------------------------------------------

---[FILE: ErrorPage.jsx]---
Location: ToolJet-develop/frontend/src/_components/ErrorComponents/ErrorPage.jsx
Signals: React
Excerpt (<=80 chars):  export const ErrorModal = ({ errorMsg, appSlug, ...props }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ErrorModal
```

--------------------------------------------------------------------------------

---[FILE: LicenseUpgradeErrorModal.jsx]---
Location: ToolJet-develop/frontend/src/_components/ErrorComponents/LicenseUpgradeErrorModal.jsx
Signals: React
Excerpt (<=80 chars):  export const LicenseUpgradeErrorModal = ({ errorMsg, onHide, ...props }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LicenseUpgradeErrorModal
```

--------------------------------------------------------------------------------

---[FILE: NotificationBanner.jsx]---
Location: ToolJet-develop/frontend/src/_components/NotificationBanner/NotificationBanner.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.jsx]---
Location: ToolJet-develop/frontend/src/_components/NotificationCenter/index.jsx
Signals: React
Excerpt (<=80 chars):  export const NotificationCenter = ({ darkMode }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NotificationCenter
```

--------------------------------------------------------------------------------

---[FILE: Notification.jsx]---
Location: ToolJet-develop/frontend/src/_components/NotificationCenter/Notification.jsx
Signals: React
Excerpt (<=80 chars):  export const Notification = ({ id, creator, comment, updatedAt, commentLink,...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Notification
```

--------------------------------------------------------------------------------

---[FILE: DisablePasswordLoginModal.jsx]---
Location: ToolJet-develop/frontend/src/_components/OrganizationLogin/DisablePasswordLoginModal.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: WorkspaceSSOEnableModal.jsx]---
Location: ToolJet-develop/frontend/src/_components/OrganizationLogin/WorkspaceSSOEnableModal.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: OrgConstantsVariablesPreviewBox.jsx]---
Location: ToolJet-develop/frontend/src/_components/OrgConstantsVariablesResolver/OrgConstantsVariablesPreviewBox.jsx
Signals: React
Excerpt (<=80 chars):  export const OrgConstantVariablesPreviewBox = ({ workspaceVariables, workspa...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OrgConstantVariablesPreviewBox
```

--------------------------------------------------------------------------------

---[FILE: Portal.jsx]---
Location: ToolJet-develop/frontend/src/_components/Portal/Portal.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ReactPortal.js]---
Location: ToolJet-develop/frontend/src/_components/Portal/ReactPortal.js
Signals: React
Excerpt (<=80 chars):  export function ReactPortal({ children, parent, className, componentName }) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ReactPortal
```

--------------------------------------------------------------------------------

---[FILE: index.js]---
Location: ToolJet-develop/frontend/src/_components/SortableList/index.js
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: keyboardCoordinates.js]---
Location: ToolJet-develop/frontend/src/_components/SortableList/keyboardCoordinates.js
Signals: N/A
Excerpt (<=80 chars):  export const sortableTreeKeyboardCoordinates =

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- sortableTreeKeyboardCoordinates
```

--------------------------------------------------------------------------------

---[FILE: SortableList.jsx]---
Location: ToolJet-develop/frontend/src/_components/SortableList/SortableList.jsx
Signals: React
Excerpt (<=80 chars):  export function SortableList({ items, onChange, renderItem }) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SortableList
```

--------------------------------------------------------------------------------

---[FILE: SortableTree.jsx]---
Location: ToolJet-develop/frontend/src/_components/SortableList/SortableTree.jsx
Signals: React
Excerpt (<=80 chars):  export function SortableTree({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SortableTree
```

--------------------------------------------------------------------------------

---[FILE: utilities.js]---
Location: ToolJet-develop/frontend/src/_components/SortableList/utilities.js
Signals: N/A
Excerpt (<=80 chars):  export function getProjection(items, activeId, overId, dragOffset, indentati...

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
```

--------------------------------------------------------------------------------

---[FILE: SortableItem.jsx]---
Location: ToolJet-develop/frontend/src/_components/SortableList/components/SortableItem.jsx
Signals: React
Excerpt (<=80 chars):  export function SortableItem({ children, id, classNames }) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SortableItem
- DragHandle
- withDraggable
```

--------------------------------------------------------------------------------

---[FILE: SortableOverlay.jsx]---
Location: ToolJet-develop/frontend/src/_components/SortableList/components/SortableOverlay.jsx
Signals: React
Excerpt (<=80 chars):  export function SortableOverlay({ children }) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SortableOverlay
```

--------------------------------------------------------------------------------

---[FILE: Pagination.test.js]---
Location: ToolJet-develop/frontend/src/_components/__tests__/Pagination.test.js
Signals: React
Excerpt (<=80 chars): import '@testing-library/jest-dom';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: appUtils.js]---
Location: ToolJet-develop/frontend/src/_helpers/appUtils.js
Signals: React
Excerpt (<=80 chars):  export function setStateAsync(_ref, state) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- setStateAsync
- setCurrentStateAsync
- onComponentOptionsChanged
- onComponentOptionChanged
- fetchOAuthToken
- addToLocalStorage
- getDataFromLocalStorage
- onComponentClick
- onQueryConfirmOrCancel
- getQueryVariables
- previewQuery
- runQuery
- setTablePageIndex
- renderTooltip
- computeComponentState
- snapToGrid
- fetchOauthTokenForSlackAndGSheet
- isPDFSupported
```

--------------------------------------------------------------------------------

---[FILE: auth-header.js]---
Location: ToolJet-develop/frontend/src/_helpers/auth-header.js
Signals: N/A
Excerpt (<=80 chars):  export function authHeader(isMultipartData = false, current_organization_id) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- authHeader
```

--------------------------------------------------------------------------------

---[FILE: authorizeWorkspace.js]---
Location: ToolJet-develop/frontend/src/_helpers/authorizeWorkspace.js
Signals: N/A
Excerpt (<=80 chars):  export const authorizeWorkspace = () => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- authorizeWorkspace
- updateCurrentSession
- authorizeUserAndHandleErrors
```

--------------------------------------------------------------------------------

---[FILE: constants.js]---
Location: ToolJet-develop/frontend/src/_helpers/constants.js
Signals: N/A
Excerpt (<=80 chars): export const USER_COLORS = [

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- USER_COLORS
- ON_BOARDING_SIZE
- ON_BOARDING_ROLES
- ERROR_TYPES
- ERROR_MESSAGES
- DEFAULT_ERROR_MESSAGE
- TOOLTIP_MESSAGES
- DATA_SOURCE_TYPE
- SAMPLE_DB_KIND
- PLANS
```

--------------------------------------------------------------------------------

---[FILE: cookie.js]---
Location: ToolJet-develop/frontend/src/_helpers/cookie.js
Signals: N/A
Excerpt (<=80 chars): export function setCookie(name, value, inIFrame = false, expiryMinutes) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- setCookie
- getCookie
- eraseCookie
```

--------------------------------------------------------------------------------

---[FILE: createWalkThrough.js]---
Location: ToolJet-develop/frontend/src/_helpers/createWalkThrough.js
Signals: N/A
Excerpt (<=80 chars):  export const initEditorWalkThrough = () => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- initEditorWalkThrough
```

--------------------------------------------------------------------------------

---[FILE: editorHelpers.js]---
Location: ToolJet-develop/frontend/src/_helpers/editorHelpers.js
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
- updateCanvasBackground
```

--------------------------------------------------------------------------------

---[FILE: error_constants.js]---
Location: ToolJet-develop/frontend/src/_helpers/error_constants.js
Signals: N/A
Excerpt (<=80 chars): export const APP_ERROR_TYPE = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- APP_ERROR_TYPE
```

--------------------------------------------------------------------------------

---[FILE: global-datasources.js]---
Location: ToolJet-develop/frontend/src/_helpers/global-datasources.js
Signals: N/A
Excerpt (<=80 chars):  export const canAnyGroupPerformAction = (action, id) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- canAnyGroupPerformAction
- canUseDataSourceForQuery
- canCreateDataSource
- canDeleteDataSource
- canReadDataSource
- canUpdateDataSource
```

--------------------------------------------------------------------------------

---[FILE: handle-response.js]---
Location: ToolJet-develop/frontend/src/_helpers/handle-response.js
Signals: React
Excerpt (<=80 chars):  export function handleResponse(response, avoidRedirection = false, queryPara...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- handleResponse
- handleResponseWithoutValidation
```

--------------------------------------------------------------------------------

---[FILE: handleAppAccess.js]---
Location: ToolJet-develop/frontend/src/_helpers/handleAppAccess.js
Signals: N/A
Excerpt (<=80 chars): export const handleAppAccess = async (componentType, slug, version_id, enviro...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- handleAppAccess
- handleError
```

--------------------------------------------------------------------------------

---[FILE: messages.js]---
Location: ToolJet-develop/frontend/src/_helpers/messages.js
Signals: N/A
Excerpt (<=80 chars):  export const ssoConfMessages = (sso, action, dynamic_parts) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ssoConfMessages
```

--------------------------------------------------------------------------------

---[FILE: routes.js]---
Location: ToolJet-develop/frontend/src/_helpers/routes.js
Signals: N/A
Excerpt (<=80 chars):  export const getPrivateRoute = (page, params = {}) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getQueryParams
- getPrivateRoute
- replaceEditorURL
- pathnameToArray
- getPathname
- getHostURL
- dashboardUrl
- redirectToDashboard
- redirectToSwitchOrArchivedAppPage
- appendWorkspaceId
- getWorkspaceIdOrSlugFromURL
- excludeWorkspaceIdFromURL
- getSubpath
- returnWorkspaceIdIfNeed
- getRedirectURL
- getRedirectTo
- getPreviewQueryParams
- getRedirectToWithParams
```

--------------------------------------------------------------------------------

---[FILE: utility.js]---
Location: ToolJet-develop/frontend/src/_helpers/utility.js
Signals: N/A
Excerpt (<=80 chars):  export function validateMultilineCode(code, isMultiLine = false) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- validateMultilineCode
- updateParentNodes
```

--------------------------------------------------------------------------------

---[FILE: utils.js]---
Location: ToolJet-develop/frontend/src/_helpers/utils.js
Signals: N/A
Excerpt (<=80 chars):  export const reservedKeyword = ['app', 'window'];

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- formatFileSize
- findProp
- stripTrailingSlash
- resolve
- resolveCode
- resolveString
- resolveReferences
- getDynamicVariables
- computeComponentName
- computeActionName
- validateQueryName
- validateKebabCase
- resolveWidgetFieldValue
- validateWidget
- validateDates
- validateEmail
- constructSearchParams
- toQuery
```

--------------------------------------------------------------------------------

---[FILE: websocketConnection.js]---
Location: ToolJet-develop/frontend/src/_helpers/websocketConnection.js
Signals: N/A
Excerpt (<=80 chars):  export const createWebsocketConnection = (appId) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createWebsocketConnection
```

--------------------------------------------------------------------------------

---[FILE: auth.utils.js]---
Location: ToolJet-develop/frontend/src/_helpers/platform/utils/auth.utils.js
Signals: N/A
Excerpt (<=80 chars):  export const onInvitedUserSignUpSuccess = (response, navigate) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- onInvitedUserSignUpSuccess
- onLoginSuccess
- extractErrorObj
```

--------------------------------------------------------------------------------

---[FILE: utils.helpers.js]---
Location: ToolJet-develop/frontend/src/_helpers/utilities/utils.helpers.js
Signals: N/A
Excerpt (<=80 chars):  export const deepClone = (obj) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- deepClone
```

--------------------------------------------------------------------------------

---[FILE: whiteLabelling.js]---
Location: ToolJet-develop/frontend/src/_helpers/white-label/whiteLabelling.js
Signals: N/A
Excerpt (<=80 chars): export const whiteLabellingOptions = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- retrieveWhiteLabelFavicon
- retrieveWhiteLabelText
- retrieveWhiteLabelLogo
- checkWhiteLabelsDefaultState
- whiteLabellingOptions
- defaultWhiteLabellingSettings
- pageTitles
```

--------------------------------------------------------------------------------

````
