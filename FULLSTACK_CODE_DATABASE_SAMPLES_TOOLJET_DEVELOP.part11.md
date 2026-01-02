---
source_txt: fullstack_samples/ToolJet-develop
converted_utc: 2025-12-18T10:37:21Z
part: 11
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES ToolJet-develop

## Extracted Reusable Patterns (Non-verbatim) (Part 11 of 37)

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

---[FILE: PreviewBox.jsx]---
Location: ToolJet-develop/frontend/src/Editor/CodeEditor/PreviewBox.jsx
Signals: React
Excerpt (<=80 chars):  export const PreviewBox = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PreviewBox
```

--------------------------------------------------------------------------------

---[FILE: SingleLineCodeEditor.jsx]---
Location: ToolJet-develop/frontend/src/Editor/CodeEditor/SingleLineCodeEditor.jsx
Signals: React
Excerpt (<=80 chars): /* eslint-disable import/no-unresolved */

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: utils.js]---
Location: ToolJet-develop/frontend/src/Editor/CodeEditor/utils.js
Signals: N/A
Excerpt (<=80 chars):  export const getCurrentNodeType = (node) => Object.prototype.toString.call(n...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- computeCoercion
- hasDeepChildren
- getCurrentNodeType
- createJavaScriptSuggestions
- resolveReferences
- paramValidation
- FxParamTypeMapping
- validateComponentProperty
```

--------------------------------------------------------------------------------

---[FILE: CommentActions.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Comment/CommentActions.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: CommentBody.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Comment/CommentBody.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: CommentFooter.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Comment/CommentFooter.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: CommentHeader.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Comment/CommentHeader.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Comment/index.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Content.jsx]---
Location: ToolJet-develop/frontend/src/Editor/CommentNotifications/Content.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.jsx]---
Location: ToolJet-develop/frontend/src/Editor/CommentNotifications/index.jsx
Signals: React
Excerpt (<=80 chars): import '@/_styles/editor/comment-notifications.scss';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Button.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Button.jsx
Signals: React
Excerpt (<=80 chars):  export const Button = function Button(props) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Button
```

--------------------------------------------------------------------------------

---[FILE: ButtonGroup.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/ButtonGroup.jsx
Signals: React
Excerpt (<=80 chars):  export const ButtonGroup = function Button({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ButtonGroup
```

--------------------------------------------------------------------------------

---[FILE: Calendar.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Calendar.jsx
Signals: React
Excerpt (<=80 chars):  export const Calendar = function ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Calendar
```

--------------------------------------------------------------------------------

---[FILE: CalendarPopover.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/CalendarPopover.jsx
Signals: React
Excerpt (<=80 chars):  export const CalendarEventPopover = function ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CalendarEventPopover
```

--------------------------------------------------------------------------------

---[FILE: Chart.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Chart.jsx
Signals: React
Excerpt (<=80 chars):  export const Chart = function Chart({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Chart
```

--------------------------------------------------------------------------------

---[FILE: Checkbox.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Checkbox.jsx
Signals: React
Excerpt (<=80 chars):  export const Checkbox = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Checkbox
```

--------------------------------------------------------------------------------

---[FILE: CirularProgressbar.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/CirularProgressbar.jsx
Signals: React
Excerpt (<=80 chars):  export const CircularProgressBar = function CircularProgressBar({ height, pr...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CircularProgressBar
```

--------------------------------------------------------------------------------

---[FILE: CodeEditor.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/CodeEditor.jsx
Signals: React
Excerpt (<=80 chars):  export const CodeEditor = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CodeEditor
```

--------------------------------------------------------------------------------

---[FILE: ColorPicker.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/ColorPicker.jsx
Signals: React
Excerpt (<=80 chars):  export const ColorPicker = function ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ColorPicker
```

--------------------------------------------------------------------------------

---[FILE: Container.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Container.jsx
Signals: React
Excerpt (<=80 chars):  export const Container = function Container({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Container
```

--------------------------------------------------------------------------------

---[FILE: Datepicker.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Datepicker.jsx
Signals: React
Excerpt (<=80 chars):  export const Datepicker = function Datepicker({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Datepicker
```

--------------------------------------------------------------------------------

---[FILE: DaterangePicker.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/DaterangePicker.jsx
Signals: React
Excerpt (<=80 chars):  export const DaterangePicker = function DaterangePicker({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DaterangePicker
```

--------------------------------------------------------------------------------

---[FILE: Divider.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Divider.jsx
Signals: React
Excerpt (<=80 chars):  export const Divider = function Divider({ dataCy, height, width, darkMode, s...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Divider
```

--------------------------------------------------------------------------------

---[FILE: DraftEditor.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/DraftEditor.jsx
Signals: React
Excerpt (<=80 chars): /* eslint-disable react/no-string-refs */

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DropDown.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/DropDown.jsx
Signals: React
Excerpt (<=80 chars):  export const DropDown = function DropDown({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DropDown
```

--------------------------------------------------------------------------------

---[FILE: FilePicker.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/FilePicker.jsx
Signals: React
Excerpt (<=80 chars): export const FilePicker = (props) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FilePicker
```

--------------------------------------------------------------------------------

---[FILE: Html.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Html.jsx
Signals: React
Excerpt (<=80 chars):  export const Html = function ({ height, properties, styles, darkMode, dataCy...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Html
```

--------------------------------------------------------------------------------

---[FILE: Icon.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Icon.jsx
Signals: React
Excerpt (<=80 chars):  export const Icon = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Icon
```

--------------------------------------------------------------------------------

---[FILE: IFrame.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/IFrame.jsx
Signals: React
Excerpt (<=80 chars):  export const IFrame = function IFrame({ width, height, properties, styles, d...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IFrame
```

--------------------------------------------------------------------------------

---[FILE: Listview.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Listview.jsx
Signals: React
Excerpt (<=80 chars):  export const Listview = function Listview({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Listview
```

--------------------------------------------------------------------------------

---[FILE: Modal.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Modal.jsx
Signals: React
Excerpt (<=80 chars):  export const Modal = function Modal({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Modal
```

--------------------------------------------------------------------------------

---[FILE: Multiselect.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Multiselect.jsx
Signals: React
Excerpt (<=80 chars):  export const Multiselect = function Multiselect({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Multiselect
```

--------------------------------------------------------------------------------

---[FILE: NumberInput.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/NumberInput.jsx
Signals: React
Excerpt (<=80 chars):  export const NumberInput = function NumberInput({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NumberInput
```

--------------------------------------------------------------------------------

---[FILE: Pagination.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Pagination.jsx
Signals: React
Excerpt (<=80 chars):  export const Pagination = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Pagination
```

--------------------------------------------------------------------------------

---[FILE: PasswordInput.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/PasswordInput.jsx
Signals: React
Excerpt (<=80 chars):  export const PasswordInput = function PasswordInput({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PasswordInput
```

--------------------------------------------------------------------------------

---[FILE: PDF.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/PDF.jsx
Signals: React
Excerpt (<=80 chars):  export const PDF = React.memo(({ styles, properties, width, height, componen...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PDF
```

--------------------------------------------------------------------------------

---[FILE: RadioButton.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/RadioButton.jsx
Signals: React
Excerpt (<=80 chars):  export const RadioButton = function RadioButton({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RadioButton
```

--------------------------------------------------------------------------------

---[FILE: RangeSlider.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/RangeSlider.jsx
Signals: React
Excerpt (<=80 chars): export const RangeSlider = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RangeSlider
```

--------------------------------------------------------------------------------

---[FILE: RichTextEditor.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/RichTextEditor.jsx
Signals: React
Excerpt (<=80 chars):  export const RichTextEditor = function RichTextEditor({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RichTextEditor
```

--------------------------------------------------------------------------------

---[FILE: Spinner.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Spinner.jsx
Signals: React
Excerpt (<=80 chars):  export const Spinner = ({ styles, height, dataCy }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Spinner
```

--------------------------------------------------------------------------------

---[FILE: Statistics.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Statistics.jsx
Signals: React
Excerpt (<=80 chars): export const Statistics = function Statistics({ width, height, properties, st...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Statistics
```

--------------------------------------------------------------------------------

---[FILE: Steps.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Steps.jsx
Signals: React
Excerpt (<=80 chars):  export const Steps = function Steps({ properties, styles, fireEvent, setExpo...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Steps
```

--------------------------------------------------------------------------------

---[FILE: SvgImage.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/SvgImage.jsx
Signals: React
Excerpt (<=80 chars):  export const SvgImage = function Timeline({ properties, styles, height, data...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SvgImage
```

--------------------------------------------------------------------------------

---[FILE: tableUtils.js]---
Location: ToolJet-develop/frontend/src/Editor/Components/tableUtils.js
Signals: N/A
Excerpt (<=80 chars):  export const isRowInValid = (cell, currentState, changeSet) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isRowInValid
```

--------------------------------------------------------------------------------

---[FILE: Tabs.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Tabs.jsx
Signals: React
Excerpt (<=80 chars):  export const Tabs = function Tabs({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Tabs
```

--------------------------------------------------------------------------------

---[FILE: Tags.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Tags.jsx
Signals: React
Excerpt (<=80 chars):  export const Tags = function Tags({ width, height, properties, styles, dataC...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Tags
```

--------------------------------------------------------------------------------

---[FILE: Text.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Text.jsx
Signals: React
Excerpt (<=80 chars):  export const Text = function Text({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Text
```

--------------------------------------------------------------------------------

---[FILE: TextInput.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/TextInput.jsx
Signals: React
Excerpt (<=80 chars):  export const TextInput = function TextInput({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TextInput
```

--------------------------------------------------------------------------------

---[FILE: Timeline.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Timeline.jsx
Signals: React
Excerpt (<=80 chars):  export const Timeline = function Timeline({ height, darkMode, properties, st...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Timeline
```

--------------------------------------------------------------------------------

---[FILE: Timer.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Timer.jsx
Signals: React
Excerpt (<=80 chars):  export const Timer = function Timer({ height, properties = {}, styles, setEx...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Timer
```

--------------------------------------------------------------------------------

---[FILE: Toggle.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Toggle.jsx
Signals: React
Excerpt (<=80 chars):  export const ToggleSwitch = ({ height, properties, styles, fireEvent, setExp...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ToggleSwitch
```

--------------------------------------------------------------------------------

---[FILE: ToggleV2.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/ToggleV2.jsx
Signals: React
Excerpt (<=80 chars):  export const ToggleSwitchV2 = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ToggleSwitchV2
```

--------------------------------------------------------------------------------

---[FILE: TreeSelect.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/TreeSelect.jsx
Signals: React
Excerpt (<=80 chars):  export const TreeSelect = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TreeSelect
```

--------------------------------------------------------------------------------

---[FILE: utils.js]---
Location: ToolJet-develop/frontend/src/Editor/Components/utils.js
Signals: N/A
Excerpt (<=80 chars):  export const getCssVarValue = (element, cssVarExpression) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getModifiedColor
- getSafeRenderableValue
- getCssVarValue
- getColorModeFromLuminance
- getFormattedSteps
```

--------------------------------------------------------------------------------

---[FILE: VerticalDivider.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/VerticalDivider.jsx
Signals: React
Excerpt (<=80 chars):  export const VerticalDivider = function Divider({ styles, height, width, dat...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VerticalDivider
```

--------------------------------------------------------------------------------

---[FILE: BoundedBox.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/BoundedBox/BoundedBox.jsx
Signals: React
Excerpt (<=80 chars):  export const BoundedBox = ({ properties, fireEvent, darkMode, setExposedVari...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BoundedBox
```

--------------------------------------------------------------------------------

---[FILE: Box.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/BoundedBox/Box.jsx
Signals: React
Excerpt (<=80 chars): export const Box = ({ children, geometry, style }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Box
```

--------------------------------------------------------------------------------

---[FILE: RenderEditor.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/BoundedBox/RenderEditor.jsx
Signals: React
Excerpt (<=80 chars):  export const RenderEditor = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RenderEditor
```

--------------------------------------------------------------------------------

---[FILE: RenderHighlight.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/BoundedBox/RenderHighlight.jsx
Signals: React
Excerpt (<=80 chars):  export const RenderHighlight = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RenderHighlight
```

--------------------------------------------------------------------------------

---[FILE: RenderSelector.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/BoundedBox/RenderSelector.jsx
Signals: React
Excerpt (<=80 chars): export const RenderSelector = ({ annotation, active, fireEvent }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RenderSelector
```

--------------------------------------------------------------------------------

---[FILE: CustomComponent.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/CustomComponent/CustomComponent.jsx
Signals: React
Excerpt (<=80 chars):  export const CustomComponent = (props) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CustomComponent
```

--------------------------------------------------------------------------------

---[FILE: CustomMenuList.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/DropdownV2/CustomMenuList.jsx
Signals: React
Excerpt (<=80 chars): import React, { useEffect, useRef } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: CustomOption.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/DropdownV2/CustomOption.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: CustomValueContainer.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/DropdownV2/CustomValueContainer.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: DropdownV2.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/DropdownV2/DropdownV2.jsx
Signals: React
Excerpt (<=80 chars):  export const CustomDropdownIndicator = (props) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CustomDropdownIndicator
- CustomClearIndicator
- DropdownV2
```

--------------------------------------------------------------------------------

---[FILE: utils.js]---
Location: ToolJet-develop/frontend/src/Editor/Components/DropdownV2/utils.js
Signals: React
Excerpt (<=80 chars):  export const getInputFocusedColor = ({ accentColor }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getInputFocusedColor
- getInputBorderColor
- getInputBackgroundColor
- highlightText
- sortArray
```

--------------------------------------------------------------------------------

---[FILE: Form.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Form/Form.jsx
Signals: React
Excerpt (<=80 chars): export const Form = function Form(props) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Form
```

--------------------------------------------------------------------------------

---[FILE: FormUtils.js]---
Location: ToolJet-develop/frontend/src/Editor/Components/Form/FormUtils.js
Signals: N/A
Excerpt (<=80 chars):  export function generateUIComponents(JSONSchema, advanced, componentName) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- generateUIComponents
```

--------------------------------------------------------------------------------

---[FILE: Image.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Image/Image.jsx
Signals: React
Excerpt (<=80 chars):  export const Image = function Image({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Image
```

--------------------------------------------------------------------------------

---[FILE: Kanban.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Kanban/Kanban.jsx
Signals: React
Excerpt (<=80 chars):  export const Kanban = (props) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Kanban
```

--------------------------------------------------------------------------------

---[FILE: KanbanBoard.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Kanban/KanbanBoard.jsx
Signals: React
Excerpt (<=80 chars):  export function KanbanBoard({ widgetHeight, kanbanProps, parentRef, mode, id...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- KanbanBoard
```

--------------------------------------------------------------------------------

---[FILE: Container.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Kanban/Components/Container.jsx
Signals: React
Excerpt (<=80 chars):  export const Container = ({ children, id, disabled, ...props }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Container
```

--------------------------------------------------------------------------------

---[FILE: Handle.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Kanban/Components/Handle.jsx
Signals: React
Excerpt (<=80 chars):  export const Handle = forwardRef(({ style, ...props }, ref) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Handle
```

--------------------------------------------------------------------------------

---[FILE: Item.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Kanban/Components/Item.jsx
Signals: React
Excerpt (<=80 chars):  export const Item = React.memo(

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Item
```

--------------------------------------------------------------------------------

---[FILE: Modal.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Kanban/Components/Modal.jsx
Signals: React
Excerpt (<=80 chars):  export const Modal = function Modal({ showModal, setShowModal, kanbanProps }) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Modal
```

--------------------------------------------------------------------------------

---[FILE: Trash.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Kanban/Components/Trash.jsx
Signals: React
Excerpt (<=80 chars):  export const Trash = ({ id }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Trash
```

--------------------------------------------------------------------------------

---[FILE: multipleContainersKeyboardCoordinates.js]---
Location: ToolJet-develop/frontend/src/Editor/Components/Kanban/helpers/multipleContainersKeyboardCoordinates.js
Signals: N/A
Excerpt (<=80 chars):  export const coordinateGetter = (

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- coordinateGetter
```

--------------------------------------------------------------------------------

---[FILE: utils.js]---
Location: ToolJet-develop/frontend/src/Editor/Components/Kanban/helpers/utils.js
Signals: N/A
Excerpt (<=80 chars):  export const convertArrayToObj = (data = []) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- convertArrayToObj
- getColumnData
- getCardData
- getData
- findContainer
```

--------------------------------------------------------------------------------

---[FILE: Board.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/KanbanBoard/Board.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Card.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/KanbanBoard/Card.jsx
Signals: React
Excerpt (<=80 chars):  export const Card = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Card
```

--------------------------------------------------------------------------------

---[FILE: CardPopover.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/KanbanBoard/CardPopover.jsx
Signals: React
Excerpt (<=80 chars):  export const CardEventPopover = function ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CardEventPopover
```

--------------------------------------------------------------------------------

---[FILE: Column.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/KanbanBoard/Column.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: KanbanBoard.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/KanbanBoard/KanbanBoard.jsx
Signals: React
Excerpt (<=80 chars):  export const BoardContext = React.createContext({});

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BoardContext
- KanbanBoard
```

--------------------------------------------------------------------------------

---[FILE: utils.js]---
Location: ToolJet-develop/frontend/src/Editor/Components/KanbanBoard/utils.js
Signals: N/A
Excerpt (<=80 chars):  export const getData = (columns, cards) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getData
- reorderCards
- moveCards
- updateColumnData
- updateCardData
- isCardColoumnIdUpdated
- isArray
- isValidCardData
```

--------------------------------------------------------------------------------

---[FILE: Link.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Link/Link.jsx
Signals: React
Excerpt (<=80 chars):  export const Link = ({ height, properties, styles, fireEvent, setExposedVari...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Link
```

--------------------------------------------------------------------------------

---[FILE: Map.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Map/Map.jsx
Signals: React
Excerpt (<=80 chars):  export const Map = function Map({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Map
```

--------------------------------------------------------------------------------

---[FILE: styles.js]---
Location: ToolJet-develop/frontend/src/Editor/Components/Map/styles.js
Signals: N/A
Excerpt (<=80 chars): export const darkModeStyles = [

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- darkModeStyles
```

--------------------------------------------------------------------------------

---[FILE: CustomOption.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/MultiselectV2/CustomOption.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: CustomValueContainer.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/MultiselectV2/CustomValueContainer.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: MultiselectV2.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/MultiselectV2/MultiselectV2.jsx
Signals: React
Excerpt (<=80 chars):  export const MultiselectV2 = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MultiselectV2
```

--------------------------------------------------------------------------------

---[FILE: ErrorModal.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/QrScanner/ErrorModal.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: QrScanner.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/QrScanner/QrScanner.jsx
Signals: React
Excerpt (<=80 chars):  export const QrScanner = function QrScanner({ styles, fireEvent, setExposedV...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QrScanner
```

--------------------------------------------------------------------------------

---[FILE: RadioButtonV2.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/RadioButtonV2/RadioButtonV2.jsx
Signals: React
Excerpt (<=80 chars):  export const RadioButtonV2 = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RadioButtonV2
```

--------------------------------------------------------------------------------

---[FILE: index.js]---
Location: ToolJet-develop/frontend/src/Editor/Components/StarRating/index.js
Signals: React
Excerpt (<=80 chars):  export const StarRating = function StarRating({ properties, styles, fireEven...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- StarRating
```

--------------------------------------------------------------------------------

---[FILE: star.js]---
Location: ToolJet-develop/frontend/src/Editor/Components/StarRating/star.js
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: half-star.js]---
Location: ToolJet-develop/frontend/src/Editor/Components/StarRating/icons/half-star.js
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: star-outline.js]---
Location: ToolJet-develop/frontend/src/Editor/Components/StarRating/icons/star-outline.js
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: star.js]---
Location: ToolJet-develop/frontend/src/Editor/Components/StarRating/icons/star.js
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: AddNewRowComponent.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Table/AddNewRowComponent.jsx
Signals: React
Excerpt (<=80 chars):  export function AddNewRowComponent({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddNewRowComponent
```

--------------------------------------------------------------------------------

---[FILE: Boolean.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Table/Boolean.jsx
Signals: React
Excerpt (<=80 chars):  export const Boolean = ({ value = false, isEditable, onChange, toggleOnBg, t...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Boolean
```

--------------------------------------------------------------------------------

---[FILE: CustomDatePickerHeader.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Table/CustomDatePickerHeader.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: CustomDropdown.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Table/CustomDropdown.jsx
Signals: React
Excerpt (<=80 chars):  export const CustomDropdown = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CustomDropdown
```

--------------------------------------------------------------------------------

---[FILE: CustomSelect.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Table/CustomSelect.jsx
Signals: React
Excerpt (<=80 chars):  export const CustomSelect = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CustomSelect
- CustomMenuList
```

--------------------------------------------------------------------------------

---[FILE: Datepicker.jsx]---
Location: ToolJet-develop/frontend/src/Editor/Components/Table/Datepicker.jsx
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
Location: ToolJet-develop/frontend/src/Editor/Components/Table/Filter.jsx
Signals: React
Excerpt (<=80 chars):  export function Filter(props) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Filter
```

--------------------------------------------------------------------------------

````
