---
source_txt: fullstack_samples/ToolJet-develop
converted_utc: 2025-12-18T10:37:21Z
part: 8
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES ToolJet-develop

## Extracted Reusable Patterns (Non-verbatim) (Part 8 of 37)

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

---[FILE: ValidationBar.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/FilePicker/Components/ValidationBar.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: fileProcessing.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/FilePicker/helpers/fileProcessing.js
Signals: N/A
Excerpt (<=80 chars): export const PARSE_FILE_TYPES = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PARSE_FILE_TYPES
- processCSV
- processXls
- processJson
- processFileContent
- DEPRECATED_processFileContent
- detectParserFile
- parseFileContentEnabled
```

--------------------------------------------------------------------------------

---[FILE: useFilePicker.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/FilePicker/hooks/useFilePicker.js
Signals: React
Excerpt (<=80 chars):  export const useFilePicker = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useFilePicker
```

--------------------------------------------------------------------------------

---[FILE: Form.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/Form/Form.jsx
Signals: React
Excerpt (<=80 chars): export const Form = React.memo(FormComponent, (prevProps, nextProps) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Form
```

--------------------------------------------------------------------------------

---[FILE: FormUtils.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/Form/FormUtils.js
Signals: N/A
Excerpt (<=80 chars):  export function generateUIComponents(JSONSchema, advanced, componentName = '...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- generateUIComponents
- getBodyHeight
```

--------------------------------------------------------------------------------

---[FILE: RenderSchema.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/Form/RenderSchema.jsx
Signals: React
Excerpt (<=80 chars): import React, { useMemo, useCallback } from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: HorizontalSlot.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/Form/Components/HorizontalSlot.jsx
Signals: React
Excerpt (<=80 chars):  export const HorizontalSlot = React.memo(

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HorizontalSlot
```

--------------------------------------------------------------------------------

---[FILE: Kanban.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/Kanban/Kanban.jsx
Signals: React
Excerpt (<=80 chars):  export const Kanban = (props) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Kanban
```

--------------------------------------------------------------------------------

---[FILE: KanbanBoard.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/Kanban/KanbanBoard.jsx
Signals: React
Excerpt (<=80 chars):  export function KanbanBoard({ widgetHeight, kanbanProps, parentRef, id }) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- KanbanBoard
```

--------------------------------------------------------------------------------

---[FILE: Container.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/Kanban/Components/Container.jsx
Signals: React
Excerpt (<=80 chars):  export const Container = ({ children, id, disabled, ...props }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Container
```

--------------------------------------------------------------------------------

---[FILE: Handle.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/Kanban/Components/Handle.jsx
Signals: React
Excerpt (<=80 chars):  export const Handle = forwardRef(({ style, ...props }, ref) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Handle
```

--------------------------------------------------------------------------------

---[FILE: Item.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/Kanban/Components/Item.jsx
Signals: React
Excerpt (<=80 chars):  export const Item = React.memo(

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Item
```

--------------------------------------------------------------------------------

---[FILE: Modal.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/Kanban/Components/Modal.jsx
Signals: React
Excerpt (<=80 chars):  export const Modal = function Modal({ darkMode, showModal, setShowModal, kan...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Modal
```

--------------------------------------------------------------------------------

---[FILE: Trash.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/Kanban/Components/Trash.jsx
Signals: React
Excerpt (<=80 chars):  export const Trash = ({ id }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Trash
```

--------------------------------------------------------------------------------

---[FILE: multipleContainersKeyboardCoordinates.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/Kanban/helpers/multipleContainersKeyboardCoordinates.js
Signals: N/A
Excerpt (<=80 chars):  export const coordinateGetter = (

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- coordinateGetter
```

--------------------------------------------------------------------------------

---[FILE: utils.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/Kanban/helpers/utils.js
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

---[FILE: ModalV2.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/ModalV2/ModalV2.jsx
Signals: React
Excerpt (<=80 chars):  export const ModalV2 = function Modal({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ModalV2
```

--------------------------------------------------------------------------------

---[FILE: Footer.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/ModalV2/Components/Footer.jsx
Signals: React
Excerpt (<=80 chars):  export const ModalFooter = React.memo(

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ModalFooter
```

--------------------------------------------------------------------------------

---[FILE: Header.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/ModalV2/Components/Header.jsx
Signals: React
Excerpt (<=80 chars):  export const ModalHeader = React.memo(

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ModalHeader
```

--------------------------------------------------------------------------------

---[FILE: Modal.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/ModalV2/Components/Modal.jsx
Signals: React
Excerpt (<=80 chars):  export const ModalWidget = ({ ...restProps }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ModalWidget
```

--------------------------------------------------------------------------------

---[FILE: sideEffects.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/ModalV2/helpers/sideEffects.js
Signals: N/A
Excerpt (<=80 chars):  export const onShowSideEffects = () => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- onShowSideEffects
- onHideSideEffects
```

--------------------------------------------------------------------------------

---[FILE: stylesFactory.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/ModalV2/helpers/stylesFactory.js
Signals: N/A
Excerpt (<=80 chars):  export function createModalStyles({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createModalStyles
```

--------------------------------------------------------------------------------

---[FILE: utils.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/ModalV2/helpers/utils.js
Signals: N/A
Excerpt (<=80 chars):  export const getCanvasHeight = (height) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isFalsyOrMultipleZeros
- getCanvasHeight
- getModalBodyHeight
- getModalHeaderHeight
- getModalFooterHeight
```

--------------------------------------------------------------------------------

---[FILE: useModalCSA.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/ModalV2/hooks/useModalCSA.js
Signals: React
Excerpt (<=80 chars):  export const useExposeState = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useExposeState
```

--------------------------------------------------------------------------------

---[FILE: useModalZIndex.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/ModalV2/hooks/useModalZIndex.js
Signals: React
Excerpt (<=80 chars): export const useResetZIndex = ({ showModal, id, mode }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useResetZIndex
```

--------------------------------------------------------------------------------

---[FILE: useResizeSideEffects.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/ModalV2/hooks/useResizeSideEffects.js
Signals: React
Excerpt (<=80 chars):  export function useModalEventSideEffects({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useModalEventSideEffects
```

--------------------------------------------------------------------------------

---[FILE: Table.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/Table.jsx
Signals: React
Excerpt (<=80 chars):  export const Table = memo(

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Table
```

--------------------------------------------------------------------------------

---[FILE: ActionButtons.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_components/ActionButtons/ActionButtons.jsx
Signals: React
Excerpt (<=80 chars): export const ActionButtons = ({ actions, row, cell, fireEvent, setExposedVari...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ActionButtons
```

--------------------------------------------------------------------------------

---[FILE: Boolean.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_components/DataTypes/Boolean.jsx
Signals: React
Excerpt (<=80 chars):  export const BooleanColumn = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BooleanColumn
```

--------------------------------------------------------------------------------

---[FILE: CustomDropdown.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_components/DataTypes/CustomDropdown.jsx
Signals: React
Excerpt (<=80 chars):  export const CustomDropdownColumn = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CustomDropdownColumn
```

--------------------------------------------------------------------------------

---[FILE: CustomSelect.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_components/DataTypes/CustomSelect.jsx
Signals: React
Excerpt (<=80 chars):  export const CustomSelectColumn = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CustomSelectColumn
```

--------------------------------------------------------------------------------

---[FILE: Datepicker.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_components/DataTypes/Datepicker.jsx
Signals: React
Excerpt (<=80 chars):  export const DatepickerColumn = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DatepickerColumn
```

--------------------------------------------------------------------------------

---[FILE: HTML.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_components/DataTypes/HTML.jsx
Signals: React
Excerpt (<=80 chars):  export const HTMLColumn = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HTMLColumn
```

--------------------------------------------------------------------------------

---[FILE: Image.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_components/DataTypes/Image.jsx
Signals: React
Excerpt (<=80 chars):  export const ImageColumn = ({ cellValue, width, height, borderRadius, object...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ImageColumn
```

--------------------------------------------------------------------------------

---[FILE: JSON.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_components/DataTypes/JSON.jsx
Signals: React
Excerpt (<=80 chars):  export const JsonColumn = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- JsonColumn
```

--------------------------------------------------------------------------------

---[FILE: Link.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_components/DataTypes/Link.jsx
Signals: React
Excerpt (<=80 chars):  export const LinkColumn = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LinkColumn
```

--------------------------------------------------------------------------------

---[FILE: Markdown.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_components/DataTypes/Markdown.jsx
Signals: React
Excerpt (<=80 chars):  export const MarkdownColumn = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MarkdownColumn
```

--------------------------------------------------------------------------------

---[FILE: MultiSelect.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_components/DataTypes/MultiSelect.jsx
Signals: React
Excerpt (<=80 chars):  export const MultiSelectColumn = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MultiSelectColumn
```

--------------------------------------------------------------------------------

---[FILE: Number.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_components/DataTypes/Number.jsx
Signals: React
Excerpt (<=80 chars):  export const NumberColumn = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NumberColumn
```

--------------------------------------------------------------------------------

---[FILE: Radio.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_components/DataTypes/Radio.jsx
Signals: React
Excerpt (<=80 chars):  export const RadioColumn = ({ options = [], value, onChange, readOnly, conta...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RadioColumn
```

--------------------------------------------------------------------------------

---[FILE: Select.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_components/DataTypes/Select.jsx
Signals: React
Excerpt (<=80 chars):  export const SelectColumn = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SelectColumn
```

--------------------------------------------------------------------------------

---[FILE: String.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_components/DataTypes/String.jsx
Signals: React
Excerpt (<=80 chars):  export const StringColumn = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- StringColumn
```

--------------------------------------------------------------------------------

---[FILE: Tags.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_components/DataTypes/Tags.jsx
Signals: React
Excerpt (<=80 chars):  export const TagsColumn = ({ value: initialValue, onChange, readOnly, contai...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TagsColumn
```

--------------------------------------------------------------------------------

---[FILE: Text.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_components/DataTypes/Text.jsx
Signals: React
Excerpt (<=80 chars):  export const TextColumn = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TextColumn
```

--------------------------------------------------------------------------------

---[FILE: Toggle.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_components/DataTypes/Toggle.jsx
Signals: React
Excerpt (<=80 chars):  export const ToggleColumn = ({ id, value, readOnly, onChange, activeColor, h...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ToggleColumn
```

--------------------------------------------------------------------------------

---[FILE: CustomDatePickerHeader.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_components/DataTypes/_components/CustomDatePickerHeader.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: Footer.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_components/Footer/Footer.jsx
Signals: React
Excerpt (<=80 chars):  export const Footer = memo(

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Footer
```

--------------------------------------------------------------------------------

---[FILE: AddNewRow.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_components/Footer/_components/AddNewRow.jsx
Signals: React
Excerpt (<=80 chars):  export function AddNewRow({ id, hideAddNewRowPopup, darkMode, allColumns, fi...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddNewRow
```

--------------------------------------------------------------------------------

---[FILE: ChangeSetUI.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_components/Footer/_components/ChangeSetUI.jsx
Signals: React
Excerpt (<=80 chars):  export const ChangeSetUI = memo(({ width, handleChangesSaved, handleChangesD...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ChangeSetUI
```

--------------------------------------------------------------------------------

---[FILE: ControlButtons.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_components/Footer/_components/ControlButtons.jsx
Signals: React
Excerpt (<=80 chars):  export const ControlButtons = memo(

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ControlButtons
```

--------------------------------------------------------------------------------

---[FILE: LoadingFooter.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_components/Footer/_components/LoadingFooter.jsx
Signals: React
Excerpt (<=80 chars):  export const LoadingFooter = memo(() => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LoadingFooter
```

--------------------------------------------------------------------------------

---[FILE: OverlayTriggerComponent.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_components/Footer/_components/OverlayTriggerComponent.jsx
Signals: React
Excerpt (<=80 chars): export const OverlayTriggerComponent = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OverlayTriggerComponent
```

--------------------------------------------------------------------------------

---[FILE: RowCount.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_components/Footer/_components/RowCount.jsx
Signals: React
Excerpt (<=80 chars):  export const RowCount = memo(({ dataLength, id }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RowCount
```

--------------------------------------------------------------------------------

---[FILE: Pagination.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_components/Footer/_components/Pagination/Pagination.jsx
Signals: React
Excerpt (<=80 chars):  export const Pagination = function Pagination({ id, pageIndex = 1, tableWidt...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Pagination
```

--------------------------------------------------------------------------------

---[FILE: PaginationButton.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_components/Footer/_components/Pagination/PaginationButton.jsx
Signals: React
Excerpt (<=80 chars):  export const PaginationButton = memo(({ onClick, disabled, icon, dataCy }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PaginationButton
```

--------------------------------------------------------------------------------

---[FILE: PaginationInput.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_components/Footer/_components/Pagination/PaginationInput.jsx
Signals: React
Excerpt (<=80 chars):  export const PaginationInput = memo(({ pageIndex, serverSidePagination, page...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PaginationInput
```

--------------------------------------------------------------------------------

---[FILE: Header.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_components/Header/Header.jsx
Signals: React
Excerpt (<=80 chars):  export const Header = memo(

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Header
```

--------------------------------------------------------------------------------

---[FILE: SearchBar.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_components/Header/_components/SearchBar.jsx
Signals: React
Excerpt (<=80 chars): export const SearchBar = memo(({ globalFilter = '', setGlobalFilter }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SearchBar
```

--------------------------------------------------------------------------------

---[FILE: Filter.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_components/Header/_components/Filter/Filter.jsx
Signals: React
Excerpt (<=80 chars):  export const Filter = memo(({ id, table, darkMode, setFilters, setShowFilter...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Filter
```

--------------------------------------------------------------------------------

---[FILE: filterConstants.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_components/Header/_components/Filter/filterConstants.js
Signals: N/A
Excerpt (<=80 chars): export const FILTER_OPTIONS = [

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FILTER_OPTIONS
```

--------------------------------------------------------------------------------

---[FILE: FilterFooter.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_components/Header/_components/Filter/FilterFooter.jsx
Signals: React
Excerpt (<=80 chars):  export const FilterFooter = memo(({ addFilter, clearFilters }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FilterFooter
```

--------------------------------------------------------------------------------

---[FILE: FilterHeader.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_components/Header/_components/Filter/FilterHeader.jsx
Signals: React
Excerpt (<=80 chars):  export const FilterHeader = memo(({ setShowFilter }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FilterHeader
```

--------------------------------------------------------------------------------

---[FILE: FilterRow.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_components/Header/_components/Filter/FilterRow.jsx
Signals: React
Excerpt (<=80 chars):  export const FilterRow = memo(

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FilterRow
```

--------------------------------------------------------------------------------

---[FILE: filterUtils.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_components/Header/_components/Filter/filterUtils.js
Signals: N/A
Excerpt (<=80 chars):  export const filterFunctions = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- filterFunctions
- findFilterDiff
- applyFilters
```

--------------------------------------------------------------------------------

---[FILE: HighLightSearch.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_components/HighLightSearch/HighLightSearch.jsx
Signals: React
Excerpt (<=80 chars):  export const HighLightSearch = React.memo(({ text, searchTerm }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HighLightSearch
```

--------------------------------------------------------------------------------

---[FILE: IndeterminateCheckbox.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_components/IndeterminateCheckbox/IndeterminateCheckbox.jsx
Signals: React
Excerpt (<=80 chars):  export const IndeterminateCheckbox = React.forwardRef(({ indeterminate, fire...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IndeterminateCheckbox
```

--------------------------------------------------------------------------------

---[FILE: Loader.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_components/Loader/Loader.jsx
Signals: React
Excerpt (<=80 chars):  export const Loader = React.memo(({ width, height }) => (

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Loader
```

--------------------------------------------------------------------------------

---[FILE: TableContainer.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_components/TableContainer/TableContainer.jsx
Signals: React
Excerpt (<=80 chars):  export const TableContainer = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TableContainer
```

--------------------------------------------------------------------------------

---[FILE: TableData.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_components/TableData/TableData.jsx
Signals: React
Excerpt (<=80 chars):  export const TableData = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TableData
```

--------------------------------------------------------------------------------

---[FILE: EmptyState.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_components/TableData/_components/EmptyState.jsx
Signals: React
Excerpt (<=80 chars):  export const EmptyState = memo(() => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EmptyState
```

--------------------------------------------------------------------------------

---[FILE: LoadingState.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_components/TableData/_components/LoadingState.jsx
Signals: React
Excerpt (<=80 chars):  export const LoadingState = React.memo(() => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LoadingState
```

--------------------------------------------------------------------------------

---[FILE: TableHeader.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_components/TableData/_components/TableHeader.jsx
Signals: React
Excerpt (<=80 chars):  export const TableHeader = ({ id, table, darkMode, columnOrder, setColumnOrd...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TableHeader
```

--------------------------------------------------------------------------------

---[FILE: TableRow.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_components/TableData/_components/TableRow.jsx
Signals: React
Excerpt (<=80 chars):  export const TableRow = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TableRow
```

--------------------------------------------------------------------------------

---[FILE: TableExposedVariables.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_components/TableExposedVariables/TableExposedVariables.jsx
Signals: React
Excerpt (<=80 chars): export const TableExposedVariables = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TableExposedVariables
```

--------------------------------------------------------------------------------

---[FILE: useTable.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_hooks/useTable.js
Signals: React
Excerpt (<=80 chars):  export function useTable({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useTable
```

--------------------------------------------------------------------------------

---[FILE: useTableProperties.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_hooks/useTableProperties.js
Signals: React
Excerpt (<=80 chars):  export function useTableProperties(properties) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useTableProperties
```

--------------------------------------------------------------------------------

---[FILE: useTableStyles.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_hooks/useTableStyles.js
Signals: React
Excerpt (<=80 chars):  export function useTableStyles(styles) {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useTableStyles
```

--------------------------------------------------------------------------------

---[FILE: helper.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_stores/helper.js
Signals: N/A
Excerpt (<=80 chars): export const removeNullValues = (arr = []) => arr.filter((element) => element...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- removeNullValues
- utilityForNestedNewRow
```

--------------------------------------------------------------------------------

---[FILE: columnSlice.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_stores/slices/columnSlice.js
Signals: N/A
Excerpt (<=80 chars): export const createColumnSlice = (set, get) => ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createColumnSlice
```

--------------------------------------------------------------------------------

---[FILE: initSlice.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_stores/slices/initSlice.js
Signals: N/A
Excerpt (<=80 chars):  export const createInitSlice = (set, get) => ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createInitSlice
```

--------------------------------------------------------------------------------

---[FILE: buildTableColumn.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_utils/buildTableColumn.js
Signals: React
Excerpt (<=80 chars):  export const buildTableColumn = (

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- buildTableColumn
```

--------------------------------------------------------------------------------

---[FILE: exportData.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_utils/exportData.js
Signals: N/A
Excerpt (<=80 chars): export const exportToCSV = (table, componentName) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- exportToCSV
- exportToExcel
- exportToPDF
```

--------------------------------------------------------------------------------

---[FILE: generateActionColumns.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_utils/generateActionColumns.js
Signals: React
Excerpt (<=80 chars):  export const generateActionColumns = ({ actions, fireEvent, setExposedVariab...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- generateActionColumns
```

--------------------------------------------------------------------------------

---[FILE: generateColumnsData.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_utils/generateColumnsData.js
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: helper.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_utils/helper.js
Signals: N/A
Excerpt (<=80 chars): export const getMaxHeight = (isMaxRowHeightAuto, maxRowHeightValue, cellHeigh...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getMaxHeight
```

--------------------------------------------------------------------------------

---[FILE: transformTableData.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/NewTable/_utils/transformTableData.js
Signals: N/A
Excerpt (<=80 chars):  export const transformTableData = (dataFromProps, transformations, getResolv...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- transformTableData
```

--------------------------------------------------------------------------------

---[FILE: constants.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/PhoneCurrency/constants.js
Signals: N/A
Excerpt (<=80 chars): export const CurrencyMap = {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CurrencyMap
```

--------------------------------------------------------------------------------

---[FILE: CountrySelect.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/PhoneCurrency/CountrySelect.jsx
Signals: React
Excerpt (<=80 chars):  export const CountrySelect = ({ value, onChange, options, ...rest }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CountrySelect
```

--------------------------------------------------------------------------------

---[FILE: CurrencyInput.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/PhoneCurrency/CurrencyInput.jsx
Signals: React
Excerpt (<=80 chars):  export const CurrencyInput = (props) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CurrencyInput
```

--------------------------------------------------------------------------------

---[FILE: CustomMenuList.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/PhoneCurrency/CustomMenuList.jsx
Signals: React
Excerpt (<=80 chars):  export const CustomMenuList = (props) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CustomMenuList
```

--------------------------------------------------------------------------------

---[FILE: CustomOption.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/PhoneCurrency/CustomOption.jsx
Signals: React
Excerpt (<=80 chars):  export const CustomOption = (props) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CustomOption
```

--------------------------------------------------------------------------------

---[FILE: CustomValueContainer.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/PhoneCurrency/CustomValueContainer.jsx
Signals: React
Excerpt (<=80 chars):  export const CustomValueContainer = ({ getValue, ...props }) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CustomValueContainer
```

--------------------------------------------------------------------------------

---[FILE: PhoneInput.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/PhoneCurrency/PhoneInput.jsx
Signals: React
Excerpt (<=80 chars):  export const PhoneInput = (props) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PhoneInput
```

--------------------------------------------------------------------------------

---[FILE: utils.js]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/PhoneCurrency/utils.js
Signals: N/A
Excerpt (<=80 chars):  export const getCountryCallingCodeSafe = (country) => {

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getCountryCallingCodeSafe
```

--------------------------------------------------------------------------------

---[FILE: RangeSliderV2.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/RangeSliderV2/RangeSliderV2.jsx
Signals: React
Excerpt (<=80 chars):  export const RangeSliderV2 = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RangeSliderV2
```

--------------------------------------------------------------------------------

---[FILE: AddNewRowComponent.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/Table/AddNewRowComponent.jsx
Signals: React
Excerpt (<=80 chars):  export function AddNewRowComponent({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddNewRowComponent
```

--------------------------------------------------------------------------------

---[FILE: Boolean.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/Table/Boolean.jsx
Signals: React
Excerpt (<=80 chars):  export const Boolean = ({ value = false, isEditable, onChange, toggleOnBg, t...

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Boolean
```

--------------------------------------------------------------------------------

---[FILE: CustomDatePickerHeader.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/Table/CustomDatePickerHeader.jsx
Signals: React
Excerpt (<=80 chars): import React from 'react';

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: CustomDropdown.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/Table/CustomDropdown.jsx
Signals: React
Excerpt (<=80 chars):  export const CustomDropdown = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CustomDropdown
```

--------------------------------------------------------------------------------

---[FILE: CustomSelect.jsx]---
Location: ToolJet-develop/frontend/src/AppBuilder/Widgets/Table/CustomSelect.jsx
Signals: React
Excerpt (<=80 chars):  export const CustomSelect = ({

```javascript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CustomSelect
- CustomMenuList
```

--------------------------------------------------------------------------------

````
