---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 387
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 387 of 695)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - payload-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/payload-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/withMergedProps/index.tsx
Signals: React

```typescript
import { isReactServerComponentOrFunction, serverProps } from 'payload/shared'
import React from 'react'

/**
 * Creates a higher-order component (HOC) that merges predefined properties (`toMergeIntoProps`)
 * with any properties passed to the resulting component.
 *
 * Use this when you want to pre-specify some props for a component, while also allowing users to
 * pass in their own props. The HOC ensures the passed props and predefined props are combined before
 * rendering the original component.
 *
 * @example
 * const PredefinedComponent = getMergedPropsComponent({
 *   Component: OriginalComponent,
 *   toMergeIntoProps: { someExtraValue: 5 }
 * });
 * // Using <PredefinedComponent customProp="value" /> will result in
 * // <OriginalComponent customProp="value" someExtraValue={5} />
 *
 * @returns A higher-order component with combined properties.
 *
 * @param Component - The original component to wrap.
 * @param sanitizeServerOnlyProps - If true, server-only props will be removed from the merged props. @default true if the component is not a server component, false otherwise.
 * @param toMergeIntoProps - The properties to merge into the passed props.
 */
export function withMergedProps<ToMergeIntoProps, CompleteReturnProps>({
  Component,
  sanitizeServerOnlyProps,
  toMergeIntoProps,
}: {
  Component: React.FC<CompleteReturnProps>
  sanitizeServerOnlyProps?: boolean
  toMergeIntoProps: ToMergeIntoProps
}): React.FC<CompleteReturnProps> {
  if (sanitizeServerOnlyProps === undefined) {
    sanitizeServerOnlyProps = !isReactServerComponentOrFunction(Component)
  }
  // A wrapper around the args.Component to inject the args.toMergeArgs as props, which are merged with the passed props
  const MergedPropsComponent: React.FC<CompleteReturnProps> = (passedProps) => {
    const mergedProps = simpleMergeProps(passedProps, toMergeIntoProps) as CompleteReturnProps

    if (sanitizeServerOnlyProps) {
      serverProps.forEach((prop) => {
        delete mergedProps[prop]
      })
    }

    return <Component {...mergedProps} />
  }

  return MergedPropsComponent
}

function simpleMergeProps(props, toMerge) {
  return { ...props, ...toMerge }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/WithServerSideProps/index.tsx
Signals: React

```typescript
import type { WithServerSidePropsComponent } from 'payload'

import { isReactServerComponentOrFunction } from 'payload/shared'
import React from 'react'

export const WithServerSideProps: WithServerSidePropsComponent = ({
  Component,
  serverOnlyProps,
  ...rest
}) => {
  if (Component) {
    const WithServerSideProps: React.FC = (passedProps) => {
      const propsWithServerOnlyProps = {
        ...passedProps,
        ...(isReactServerComponentOrFunction(Component) ? (serverOnlyProps ?? {}) : {}),
      }

      return <Component {...propsWithServerOnlyProps} />
    }

    return WithServerSideProps(rest)
  }

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/ui/src/exports/client/index.ts

```typescript
/* eslint-disable perfectionist/sort-exports */
'use client'

// IMPORTANT: this file cannot use any wildcard exports because it is wrapped in a `use client` boundary
// IMPORTANT: do _not_ alias any of the exports in this file, this will cause a mismatch between the unbundled exports

// hooks

export { fieldComponents } from '../../fields/index.js'

export { useDebounce } from '../../hooks/useDebounce.js'
export { useDebouncedCallback } from '../../hooks/useDebouncedCallback.js'
export { useDebouncedEffect } from '../../hooks/useDebouncedEffect.js'
export { useDelay } from '../../hooks/useDelay.js'
export { useDelayedRender } from '../../hooks/useDelayedRender.js'
export { useHotkey } from '../../hooks/useHotkey.js'
export { useIntersect } from '../../hooks/useIntersect.js'
export { usePayloadAPI } from '../../hooks/usePayloadAPI.js'
export { useResize } from '../../hooks/useResize.js'
export { useThrottledEffect } from '../../hooks/useThrottledEffect.js'
export { useEffectEvent } from '../../hooks/useEffectEvent.js'
export { FieldPathContext, useFieldPath } from '../../forms/RenderFields/context.js'
export { useQueue } from '../../hooks/useQueue.js'

export { useUseTitleField } from '../../hooks/useUseAsTitle.js'

export { SortHeader } from '../../elements/SortHeader/index.js'
export { SortRow } from '../../elements/SortRow/index.js'
export { OrderableTable } from '../../elements/Table/OrderableTable.js'

// query preset elements
export { QueryPresetsColumnsCell } from '../../elements/QueryPresets/cells/ColumnsCell/index.js'
export { QueryPresetsWhereCell } from '../../elements/QueryPresets/cells/WhereCell/index.js'
export { QueryPresetsAccessCell } from '../../elements/QueryPresets/cells/AccessCell/index.js'
export { QueryPresetsGroupByCell } from '../../elements/QueryPresets/cells/GroupByCell/index.js'
export { QueryPresetsColumnField } from '../../elements/QueryPresets/fields/ColumnsField/index.js'
export { QueryPresetsWhereField } from '../../elements/QueryPresets/fields/WhereField/index.js'
export { QueryPresetsGroupByField } from '../../elements/QueryPresets/fields/GroupByField/index.js'

// elements
export { ConfirmationModal } from '../../elements/ConfirmationModal/index.js'
export type { OnCancel } from '../../elements/ConfirmationModal/index.js'
export { Link } from '../../elements/Link/index.js'
export { LeaveWithoutSaving } from '../../elements/LeaveWithoutSaving/index.js'
export { DocumentTakeOver } from '../../elements/DocumentTakeOver/index.js'
export { DocumentLocked } from '../../elements/DocumentLocked/index.js'
export { TableColumnsProvider, useTableColumns } from '../../providers/TableColumns/index.js'
export {
  RenderDefaultCell,
  useCellProps,
} from '../../providers/TableColumns/RenderDefaultCell/index.js'
export { DateCell } from '../../elements/Table/DefaultCell/fields/Date/index.js'

export { Translation } from '../../elements/Translation/index.js'
export { default as DatePicker } from '../../elements/DatePicker/DatePicker.js'
export { ViewDescription } from '../../elements/ViewDescription/index.js'
export { AppHeader } from '../../elements/AppHeader/index.js'
export { RenderCustomComponent } from '../../elements/RenderCustomComponent/index.js'
export {
  BulkUploadDrawer,
  BulkUploadProvider,
  useBulkUpload,
  useBulkUploadDrawerSlug,
} from '../../elements/BulkUpload/index.js'
export { DrawerContentContainer } from '../../elements/DrawerContentContainer/index.js'
export type { BulkUploadProps } from '../../elements/BulkUpload/index.js'
export { Banner } from '../../elements/Banner/index.js'
export { Button } from '../../elements/Button/index.js'
export { AnimateHeight } from '../../elements/AnimateHeight/index.js'
export { PillSelector, type SelectablePill } from '../../elements/PillSelector/index.js'
export { Card } from '../../elements/Card/index.js'
export { Collapsible, useCollapsible } from '../../elements/Collapsible/index.js'
export { CopyLocaleData } from '../../elements/CopyLocaleData/index.js'
export { CopyToClipboard } from '../../elements/CopyToClipboard/index.js'
export { DeleteMany } from '../../elements/DeleteMany/index.js'
export { DocumentControls } from '../../elements/DocumentControls/index.js'
export { Dropzone } from '../../elements/Dropzone/index.js'
export { documentDrawerBaseClass, useDocumentDrawer } from '../../elements/DocumentDrawer/index.js'
export { getHTMLDiffComponents } from '../../elements/HTMLDiff/index.js'
export type {
  DocumentDrawerProps,
  DocumentTogglerProps,
  UseDocumentDrawer,
} from '../../elements/DocumentDrawer/types.js'
export { useClickOutside } from '../../hooks/useClickOutside.js'
export { useClickOutsideContext } from '../../providers/ClickOutside/index.js'
export { useDocumentDrawerContext } from '../../elements/DocumentDrawer/Provider.js'
export { DocumentFields } from '../../elements/DocumentFields/index.js'
export { Drawer, DrawerToggler, formatDrawerSlug } from '../../elements/Drawer/index.js'
export { useDrawerSlug } from '../../elements/Drawer/useDrawerSlug.js'
export { EditMany } from '../../elements/EditMany/index.js'
export { ErrorPill } from '../../elements/ErrorPill/index.js'
export { FullscreenModal } from '../../elements/FullscreenModal/index.js'
export { GenerateConfirmation } from '../../elements/GenerateConfirmation/index.js'
export { Gutter } from '../../elements/Gutter/index.js'
export { Hamburger } from '../../elements/Hamburger/index.js'
export { HydrateAuthProvider } from '../../elements/HydrateAuthProvider/index.js'
export { Locked } from '../../elements/Locked/index.js'
export { ListControls } from '../../elements/ListControls/index.js'
export { useListDrawer } from '../../elements/ListDrawer/index.js'
export type {
  ListDrawerProps,
  ListTogglerProps,
  RenderListServerFnArgs,
  RenderListServerFnReturnType,
  UseListDrawer,
} from '../../elements/ListDrawer/types.js'
export { ListSelection } from '../../views/List/ListSelection/index.js'
export { CollectionListHeader as ListHeader } from '../../views/List/ListHeader/index.js'
export { GroupByHeader } from '../../views/List/GroupByHeader/index.js'
export { PageControls, PageControlsComponent } from '../../elements/PageControls/index.js'
export { StickyToolbar } from '../../elements/StickyToolbar/index.js'

export { GroupByPageControls } from '../../elements/PageControls/GroupByPageControls.js'
export { LoadingOverlayToggle } from '../../elements/Loading/index.js'
export { FormLoadingOverlayToggle } from '../../elements/Loading/index.js'
export { LoadingOverlay } from '../../elements/Loading/index.js'
export { Logout } from '../../elements/Logout/index.js'
export { Modal, useModal } from '../../elements/Modal/index.js'
export { NavToggler } from '../../elements/Nav/NavToggler/index.js'
export { NavContext, NavProvider, useNav } from '../../elements/Nav/context.js'
export { NavGroup } from '../../elements/NavGroup/index.js'
export { Pagination } from '../../elements/Pagination/index.js'
export { PerPage } from '../../elements/PerPage/index.js'
export { Pill } from '../../elements/Pill/index.js'
import * as PopupList from '../../elements/Popup/PopupButtonList/index.js'
export { PopupList }
export { Popup } from '../../elements/Popup/index.js'
export { Combobox } from '../../elements/Combobox/index.js'
export type { ComboboxEntry, ComboboxProps } from '../../elements/Combobox/index.js'
export { PublishMany } from '../../elements/PublishMany/index.js'
export { PublishButton } from '../../elements/PublishButton/index.js'
export { SaveButton } from '../../elements/SaveButton/index.js'
export { SaveDraftButton } from '../../elements/SaveDraftButton/index.js'

// folder elements
export { FolderProvider, useFolder } from '../../providers/Folders/index.js'
export { BrowseByFolderButton } from '../../elements/FolderView/BrowseByFolderButton/index.js'
export { FolderTypeField } from '../../elements/FolderView/FolderTypeField/index.js'
export { FolderFileTable } from '../../elements/FolderView/FolderFileTable/index.js'
export { ItemCardGrid } from '../../elements/FolderView/ItemCardGrid/index.js'

export { type Option as ReactSelectOption, ReactSelect } from '../../elements/ReactSelect/index.js'
export { ReactSelect as Select } from '../../elements/ReactSelect/index.js'
export { RenderTitle } from '../../elements/RenderTitle/index.js'
export { ShimmerEffect } from '../../elements/ShimmerEffect/index.js'
export { StaggeredShimmers } from '../../elements/ShimmerEffect/index.js'
export { SortColumn } from '../../elements/SortColumn/index.js'
export { SetStepNav } from '../../elements/StepNav/SetStepNav.js'
export { useStepNav } from '../../elements/StepNav/index.js'
export type { StepNavItem } from '../../elements/StepNav/types.js'
export {
  RelationshipProvider,
  useListRelationships,
} from '../../elements/Table/RelationshipProvider/index.js'
export { Table } from '../../elements/Table/index.js'
export type {
  /**
   * @deprecated
   * This export will be removed in the next major version.
   * Use `import { Column } from 'payload'` instead.
   */
  Column,
} from 'payload'
export { DefaultCell } from '../../elements/Table/DefaultCell/index.js'
export { Thumbnail } from '../../elements/Thumbnail/index.js'
export { Tooltip } from '../../elements/Tooltip/index.js'
import { toast } from 'sonner'
export { toast }
export { UnpublishMany } from '../../elements/UnpublishMany/index.js'
export { Upload } from '../../elements/Upload/index.js'
export { SearchFilter } from '../../elements/SearchFilter/index.js'
export { EditUpload } from '../../elements/EditUpload/index.js'
export { FileDetails } from '../../elements/FileDetails/index.js'
export { PreviewSizes } from '../../elements/PreviewSizes/index.js'
export { PreviewButton } from '../../elements/PreviewButton/index.js'
export { RelationshipTable } from '../../elements/RelationshipTable/index.js'
export { TimezonePicker } from '../../elements/TimezonePicker/index.js'
export {
  MoveDocToFolder,
  MoveDocToFolderButton,
} from '../../elements/FolderView/MoveDocToFolder/index.js'

export { BlocksDrawer } from '../../fields/Blocks/BlocksDrawer/index.js'
export { BlockSelector } from '../../fields/Blocks/BlockSelector/index.js'
export { SectionTitle } from '../../fields/Blocks/SectionTitle/index.js'

// fields
export { HiddenField } from '../../fields/Hidden/index.js'
export { ArrayField } from '../../fields/Array/index.js'
export { BlocksField } from '../../fields/Blocks/index.js'
export { CheckboxField, CheckboxInput } from '../../fields/Checkbox/index.js'
export { CodeField } from '../../fields/Code/index.js'
export { CodeEditor as CodeEditorLazy } from '../../elements/CodeEditor/index.js'
export { default as CodeEdiftor } from '../../elements/CodeEditor/CodeEditor.js'

export { CollapsibleField } from '../../fields/Collapsible/index.js'
export { ConfirmPasswordField } from '../../fields/ConfirmPassword/index.js'
export { DateTimeField } from '../../fields/DateTime/index.js'
export { EmailField } from '../../fields/Email/index.js'
export { FieldDescription } from '../../fields/FieldDescription/index.js'
export { FieldError } from '../../fields/FieldError/index.js'
export { FieldLabel } from '../../fields/FieldLabel/index.js'
export { GroupField } from '../../fields/Group/index.js'
export { JSONField } from '../../fields/JSON/index.js'
export { NumberField } from '../../fields/Number/index.js'
export { PasswordField } from '../../fields/Password/index.js'
export { PointField } from '../../fields/Point/index.js'
export { RadioGroupField } from '../../fields/RadioGroup/index.js'
export { RelationshipField, RelationshipInput } from '../../fields/Relationship/index.js'
export { RichTextField } from '../../fields/RichText/index.js'
export { RowField } from '../../fields/Row/index.js'
export { SelectField, SelectInput } from '../../fields/Select/index.js'
export { TabsField, TabsProvider } from '../../fields/Tabs/index.js'
export { TabComponent } from '../../fields/Tabs/Tab/index.js'
export { SlugField } from '../../fields/Slug/index.js'

export { TextField, TextInput } from '../../fields/Text/index.js'
export { JoinField } from '../../fields/Join/index.js'
export type { TextInputProps } from '../../fields/Text/index.js'
export { allFieldComponents } from '../../fields/index.js'

export { TextareaField, TextareaInput } from '../../fields/Textarea/index.js'
export type { TextAreaInputProps } from '../../fields/Textarea/index.js'

export { UIField } from '../../fields/UI/index.js'
export { UploadField, UploadInput } from '../../fields/Upload/index.js'
export type { UploadInputProps } from '../../fields/Upload/index.js'

export { fieldBaseClass } from '../../fields/shared/index.js'

// forms

export {
  useAllFormFields,
  useDocumentForm,
  useForm,
  useFormBackgroundProcessing,
  useFormFields,
  useFormInitializing,
  useFormModified,
  useFormProcessing,
  useFormSubmitted,
  useWatchForm,
} from '../../forms/Form/context.js'
export { Form, type FormProps } from '../../forms/Form/index.js'
export type { FieldAction } from '../../forms/Form/types.js'
export { fieldReducer } from '../../forms/Form/fieldReducer.js'
export { NullifyLocaleField } from '../../forms/NullifyField/index.js'
export { RenderFields } from '../../forms/RenderFields/index.js'

export { RowLabel, type RowLabelProps } from '../../forms/RowLabel/index.js'
export { RowLabelProvider, useRowLabel } from '../../forms/RowLabel/Context/index.js'

export { FormSubmit } from '../../forms/Submit/index.js'
export { WatchChildErrors } from '../../forms/WatchChildErrors/index.js'
export { FieldContext, useField } from '../../forms/useField/index.js'
export type { FieldType, Options } from '../../forms/useField/types.js'

export { withCondition } from '../../forms/withCondition/index.js'
export { WatchCondition } from '../../forms/withCondition/WatchCondition.js'

// graphics
export { Account } from '../../graphics/Account/index.js'
export { PayloadIcon } from '../../graphics/Icon/index.js'

export { DefaultBlockImage } from '../../graphics/DefaultBlockImage/index.js'
export { File } from '../../graphics/File/index.js'

// icons
export { CalendarIcon } from '../../icons/Calendar/index.js'
export { CheckIcon } from '../../icons/Check/index.js'
export { ChevronIcon } from '../../icons/Chevron/index.js'
export { CloseMenuIcon } from '../../icons/CloseMenu/index.js'
export { CodeBlockIcon } from '../../icons/CodeBlock/index.js'
export { CopyIcon } from '../../icons/Copy/index.js'
export { DragHandleIcon } from '../../icons/DragHandle/index.js'
export { EditIcon } from '../../icons/Edit/index.js'
export { ExternalLinkIcon } from '../../icons/ExternalLink/index.js'
export { LineIcon } from '../../icons/Line/index.js'
export { LinkIcon } from '../../icons/Link/index.js'
export { LogOutIcon } from '../../icons/LogOut/index.js'
export { MenuIcon } from '../../icons/Menu/index.js'
export { MinimizeMaximizeIcon } from '../../icons/MinimizeMaximize/index.js'
export { MoreIcon } from '../../icons/More/index.js'
export { PlusIcon } from '../../icons/Plus/index.js'
export { SearchIcon } from '../../icons/Search/index.js'
export { SwapIcon } from '../../icons/Swap/index.js'
export { XIcon } from '../../icons/X/index.js'
export { FolderIcon } from '../../icons/Folder/index.js'
export { GearIcon } from '../../icons/Gear/index.js'
export { DocumentIcon } from '../../icons/Document/index.js'
export { MoveFolderIcon } from '../../icons/MoveFolder/index.js'
export { GridViewIcon } from '../../icons/GridView/index.js'
export { ListViewIcon } from '../../icons/ListView/index.js'
export { Error as ErrorIcon } from '../../providers/ToastContainer/icons/Error.js'
export { Info as InfoIcon } from '../../providers/ToastContainer/icons/Info.js'
export { Success as SuccessIcon } from '../../providers/ToastContainer/icons/Success.js'
export { Warning as WarningIcon } from '../../providers/ToastContainer/icons/Warning.js'

// providers
export {
  type RenderDocumentResult,
  type RenderDocumentServerFunction,
  ServerFunctionsContext,
  type ServerFunctionsContextType,
  ServerFunctionsProvider,
  useServerFunctions,
} from '../../providers/ServerFunctions/index.js'
export { ActionsProvider, useActions } from '../../providers/Actions/index.js'
export { AuthProvider, useAuth } from '../../providers/Auth/index.js'
export type { UserWithToken } from '../../providers/Auth/index.js'
export { ClientFunctionProvider, useClientFunctions } from '../../providers/ClientFunction/index.js'
export { useAddClientFunction } from '../../providers/ClientFunction/index.js'

export { LivePreviewProvider } from '../../providers/LivePreview/index.js'

export { ProgressBar } from '../../providers/RouteTransition/ProgressBar/index.js'
export {
  RouteTransitionProvider,
  useRouteTransition,
} from '../../providers/RouteTransition/index.js'
export { ConfigProvider, PageConfigProvider, useConfig } from '../../providers/Config/index.js'
export { DocumentEventsProvider, useDocumentEvents } from '../../providers/DocumentEvents/index.js'
export { DocumentInfoProvider, useDocumentInfo } from '../../providers/DocumentInfo/index.js'
export { useDocumentTitle } from '../../providers/DocumentTitle/index.js'
export type { DocumentInfoContext, DocumentInfoProps } from '../../providers/DocumentInfo/index.js'
export { useUploadControls } from '../../providers/UploadControls/index.js'
export { EditDepthProvider, useEditDepth } from '../../providers/EditDepth/index.js'
export {
  EntityVisibilityProvider,
  useEntityVisibility,
} from '../../providers/EntityVisibility/index.js'
export { UploadEditsProvider, useUploadEdits } from '../../providers/UploadEdits/index.js'
export {
  ListDrawerContextProvider,
  useListDrawerContext,
} from '../../elements/ListDrawer/Provider.js'
export { ListQueryProvider, useListQuery } from '../../providers/ListQuery/index.js'
export { LocaleProvider, useLocale } from '../../providers/Locale/index.js'
export { OperationProvider, useOperation } from '../../providers/Operation/index.js'
export { ParamsProvider, useParams } from '../../providers/Params/index.js'
export { PreferencesProvider, usePreferences } from '../../providers/Preferences/index.js'
export { RootProvider } from '../../providers/Root/index.js'
export {
  RouteCache as RouteCacheProvider,
  useRouteCache,
} from '../../providers/RouteCache/index.js'
export { ScrollInfoProvider, useScrollInfo } from '../../providers/ScrollInfo/index.js'
export { SearchParamsProvider, useSearchParams } from '../../providers/SearchParams/index.js'
export { SelectionProvider, useSelection } from '../../providers/Selection/index.js'
export { UploadHandlersProvider, useUploadHandlers } from '../../providers/UploadHandlers/index.js'
export type { UploadHandlersContext } from '../../providers/UploadHandlers/index.js'
export { defaultTheme, type Theme, ThemeProvider, useTheme } from '../../providers/Theme/index.js'
export { TranslationProvider, useTranslation } from '../../providers/Translation/index.js'
export { useWindowInfo, WindowInfoProvider } from '../../providers/WindowInfo/index.js'
export { useControllableState } from '../../hooks/useControllableState.js'

export { Text as TextCondition } from '../../elements/WhereBuilder/Condition/Text/index.js'
export { Select as SelectCondition } from '../../elements/WhereBuilder/Condition/Select/index.js'
export { RelationshipFilter as RelationshipCondition } from '../../elements/WhereBuilder/Condition/Relationship/index.js'
export { NumberFilter as NumberCondition } from '../../elements/WhereBuilder/Condition/Number/index.js'
export { DateFilter as DateCondition } from '../../elements/WhereBuilder/Condition/Date/index.js'
export { EmailAndUsernameFields } from '../../elements/EmailAndUsername/index.js'
export { SelectAll } from '../../elements/SelectAll/index.js'
export { SelectRow } from '../../elements/SelectRow/index.js'
export { SelectMany } from '../../elements/SelectMany/index.js'

export { DefaultListView } from '../../views/List/index.js'
export { DefaultCollectionFolderView } from '../../views/CollectionFolder/index.js'
export { DefaultBrowseByFolderView } from '../../views/BrowseByFolder/index.js'

export type {
  /**
   * @deprecated
   * This export will be removed in the next major version.
   * Use `import type { ListViewSlots } from 'payload'` instead.
   */
  ListViewSlots,
} from 'payload'

export type {
  /**
   * @deprecated
   * This export will be removed in the next major version.
   * Use `import type { ListViewClientProps } from 'payload'` instead.
   */
  ListViewClientProps,
} from 'payload'

export type {
  /**
   * @deprecated
   * This export will be removed in the next major version.
   * Use `import type { ListViewClientProps } from 'payload'` instead.
   */
  ListViewClientProps as ListComponentClientProps,
} from 'payload'

export type {
  /**
   * @deprecated
   * This export will be removed in the next major version.
   * Use `import type { ListViewServerProps } from 'payload'` instead.
   */
  ListViewServerProps as ListComponentServerProps,
} from 'payload'

export type {
  /**
   * @deprecated
   * This export will be removed in the next major version.
   * Use `import type { CollectionPreferences } from 'payload'` instead.
   */
  ListPreferences,
} from 'payload'

export type { ListHeaderProps } from '../../views/List/ListHeader/index.js'

export { DefaultEditView } from '../../views/Edit/index.js'
export { SetDocumentStepNav } from '../../views/Edit/SetDocumentStepNav/index.js'
export { SetDocumentTitle } from '../../views/Edit/SetDocumentTitle/index.js'

export { parseSearchParams } from '../../utilities/parseSearchParams.js'
export { FieldDiffLabel } from '../../elements/FieldDiffLabel/index.js'
export { FieldDiffContainer } from '../../elements/FieldDiffContainer/index.js'
export { formatTimeToNow } from '../../utilities/formatDocTitle/formatDateTitle.js'
export type {
  RenderFieldServerFnArgs,
  RenderFieldServerFnReturnType,
} from '../../forms/fieldSchemasToFormState/serverFunctions/renderFieldServerFn.js'

export { useLivePreviewContext } from '../../providers/LivePreview/context.js'
export { LivePreviewWindow } from '../../elements/LivePreview/Window/index.js'
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/ui/src/exports/rsc/index.ts

```typescript
export { FieldDiffContainer } from '../../elements/FieldDiffContainer/index.js'
export { FieldDiffLabel } from '../../elements/FieldDiffLabel/index.js'
export { FolderTableCell } from '../../elements/FolderView/Cell/index.server.js'
export { FolderField } from '../../elements/FolderView/FolderField/index.server.js'
export { getHTMLDiffComponents } from '../../elements/HTMLDiff/index.js'
export { SlugField } from '../../fields/Slug/index.js'
export { _internal_renderFieldHandler } from '../../forms/fieldSchemasToFormState/serverFunctions/renderFieldServerFn.js'
export { File } from '../../graphics/File/index.js'
export { CheckIcon } from '../../icons/Check/index.js'
export { copyDataFromLocaleHandler } from '../../utilities/copyDataFromLocale.js'
export { getColumns } from '../../utilities/getColumns.js'
export { getFolderResultsComponentAndData } from '../../utilities/getFolderResultsComponentAndData.js'
export { handleLivePreview } from '../../utilities/handleLivePreview.js'
export { handlePreview } from '../../utilities/handlePreview.js'
export { renderFilters, renderTable } from '../../utilities/renderTable.js'
export { resolveFilterOptions } from '../../utilities/resolveFilterOptions.js'
export { upsertPreferences } from '../../utilities/upsertPreferences.js'
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/ui/src/exports/shared/index.ts

```typescript
export { Translation } from '../../elements/Translation/index.js'
export { withMergedProps } from '../../elements/withMergedProps/index.js' // cannot be within a 'use client', thus we export this from shared
export { WithServerSideProps } from '../../elements/WithServerSideProps/index.js'
export { mergeFieldStyles } from '../../fields/mergeFieldStyles.js'
export { reduceToSerializableFields } from '../../forms/Form/reduceToSerializableFields.js'
export { PayloadIcon } from '../../graphics/Icon/index.js'
export { PayloadLogo } from '../../graphics/Logo/index.js'
// IMPORTANT: the shared.ts file CANNOT contain any Server Components _that import client components_.
export { filterFields } from '../../providers/TableColumns/buildColumnState/filterFields.js'
export { getInitialColumns } from '../../providers/TableColumns/getInitialColumns.js'
export { abortAndIgnore, handleAbortRef } from '../../utilities/abortAndIgnore.js'
export { requests } from '../../utilities/api.js'
export { findLocaleFromCode } from '../../utilities/findLocaleFromCode.js'
export { formatAdminURL } from '../../utilities/formatAdminURL.js'
export { formatDate } from '../../utilities/formatDocTitle/formatDateTitle.js'
export { formatDocTitle } from '../../utilities/formatDocTitle/index.js'
export {
  type EntityToGroup,
  EntityType,
  groupNavItems,
  type NavGroupType,
} from '../../utilities/groupNavItems.js'
export { handleBackToDashboard } from '../../utilities/handleBackToDashboard.js'
export { handleGoBack } from '../../utilities/handleGoBack.js'
export { handleTakeOver } from '../../utilities/handleTakeOver.js'
export { hasSavePermission } from '../../utilities/hasSavePermission.js'
export { isClientUserObject } from '../../utilities/isClientUserObject.js'
export { isEditing } from '../../utilities/isEditing.js'
export { sanitizeID } from '../../utilities/sanitizeID.js'
/**
 * @deprecated
 * The `mergeListSearchAndWhere` function is deprecated.
 * Import this from `payload/shared` instead.
 */
export { mergeListSearchAndWhere } from 'payload/shared'
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/fields/index.tsx
Signals: React

```typescript
'use client'
import type {
  ClientFieldBase,
  FieldTypes,
  GenericDescriptionProps,
  GenericErrorProps,
  GenericLabelProps,
  HiddenFieldProps,
} from 'payload'
import type React from 'react'

import type { ConfirmPasswordFieldProps } from './ConfirmPassword/index.js'

import { RowLabel } from '../forms/RowLabel/index.js'
import { ArrayField } from './Array/index.js'
import { BlocksField } from './Blocks/index.js'
import { CheckboxField } from './Checkbox/index.js'
import { CodeField } from './Code/index.js'
import { CollapsibleField } from './Collapsible/index.js'
import { ConfirmPasswordField } from './ConfirmPassword/index.js'
import { DateTimeField } from './DateTime/index.js'
import { EmailField } from './Email/index.js'
import { FieldDescription } from './FieldDescription/index.js'
import { FieldError } from './FieldError/index.js'
import { FieldLabel } from './FieldLabel/index.js'
import { GroupField } from './Group/index.js'
import { HiddenField } from './Hidden/index.js'
import { JoinField } from './Join/index.js'
import { JSONField } from './JSON/index.js'
import { NumberField } from './Number/index.js'
import { PasswordField } from './Password/index.js'
import { PointField } from './Point/index.js'
import { RadioGroupField } from './RadioGroup/index.js'
import { RelationshipField } from './Relationship/index.js'
import { RichTextField } from './RichText/index.js'
import { RowField } from './Row/index.js'
import { SelectField } from './Select/index.js'
import { TabsField } from './Tabs/index.js'
import { TextField } from './Text/index.js'
import { TextareaField } from './Textarea/index.js'
import { UIField } from './UI/index.js'
import { UploadField } from './Upload/index.js'

export * from './shared/index.js'

export type FieldTypesComponents = {
  [K in 'password' | FieldTypes]: React.FC<ClientFieldBase>
} & {
  confirmPassword: React.FC<ConfirmPasswordFieldProps>
  hidden: React.FC<HiddenFieldProps>
}

export const fieldComponents: FieldTypesComponents = {
  array: ArrayField,
  blocks: BlocksField,
  checkbox: CheckboxField,
  code: CodeField,
  collapsible: CollapsibleField,
  confirmPassword: ConfirmPasswordField,
  date: DateTimeField,
  email: EmailField,
  group: GroupField,
  hidden: HiddenField,
  join: JoinField,
  json: JSONField,
  number: NumberField,
  password: PasswordField,
  point: PointField,
  radio: RadioGroupField,
  relationship: RelationshipField,
  richText: RichTextField,
  row: RowField,
  select: SelectField,
  tabs: TabsField,
  text: TextField,
  textarea: TextareaField,
  ui: UIField,
  upload: UploadField,
}

export type FieldComponentsWithSlots = {
  Description: React.FC<GenericDescriptionProps>
  Error: React.FC<GenericErrorProps>
  Label: React.FC<GenericLabelProps>
  RowLabel: React.FC
} & FieldTypesComponents

export const allFieldComponents: FieldComponentsWithSlots = {
  ...fieldComponents,
  Description: FieldDescription,
  Error: FieldError,
  Label: FieldLabel,
  RowLabel,
}
```

--------------------------------------------------------------------------------

---[FILE: mergeFieldStyles.ts]---
Location: payload-main/packages/ui/src/fields/mergeFieldStyles.ts

```typescript
import type { ClientField } from 'payload'

export const mergeFieldStyles = (
  field: ClientField | Omit<ClientField, 'type'>,
): React.CSSProperties => ({
  ...(field?.admin?.style || {}),
  ...(field?.admin?.width
    ? {
        '--field-width': field.admin.width,
      }
    : {
        flex: '1 1 auto',
      }),
  // allow flex overrides to still take precedence over the fallback
  ...(field?.admin?.style?.flex
    ? {
        flex: field.admin.style.flex,
      }
    : {}),
})
```

--------------------------------------------------------------------------------

---[FILE: ArrayRow.tsx]---
Location: payload-main/packages/ui/src/fields/Array/ArrayRow.tsx
Signals: React

```typescript
'use client'
import type {
  ArrayField,
  ClientComponentProps,
  ClientField,
  Row,
  SanitizedFieldPermissions,
} from 'payload'

import { getTranslation } from '@payloadcms/translations'
import React from 'react'

import type { UseDraggableSortableReturn } from '../../elements/DraggableSortable/useDraggableSortable/types.js'

import { ArrayAction } from '../../elements/ArrayAction/index.js'
import { Collapsible } from '../../elements/Collapsible/index.js'
import { ErrorPill } from '../../elements/ErrorPill/index.js'
import { ShimmerEffect } from '../../elements/ShimmerEffect/index.js'
import { useFormSubmitted } from '../../forms/Form/context.js'
import { RenderFields } from '../../forms/RenderFields/index.js'
import { RowLabel } from '../../forms/RowLabel/index.js'
import { useThrottledValue } from '../../hooks/useThrottledValue.js'
import { useTranslation } from '../../providers/Translation/index.js'
import './index.scss'

const baseClass = 'array-field'

type ArrayRowProps = {
  readonly addRow: (rowIndex: number) => Promise<void> | void
  readonly copyRow: (rowIndex: number) => void
  readonly CustomRowLabel?: React.ReactNode
  readonly duplicateRow: (rowIndex: number) => void
  readonly errorCount: number
  readonly fields: ClientField[]
  readonly hasMaxRows?: boolean
  readonly isLoading?: boolean
  readonly isSortable?: boolean
  readonly labels: Partial<ArrayField['labels']>
  readonly moveRow: (fromIndex: number, toIndex: number) => void
  readonly parentPath: string
  readonly pasteRow: (rowIndex: number) => void
  readonly path: string
  readonly permissions: SanitizedFieldPermissions
  readonly readOnly?: boolean
  readonly removeRow: (rowIndex: number) => void
  readonly row: Row
  readonly rowCount: number
  readonly rowIndex: number
  readonly schemaPath: string
  readonly setCollapse: (rowID: string, collapsed: boolean) => void
} & Pick<ClientComponentProps, 'forceRender'> &
  UseDraggableSortableReturn

export const ArrayRow: React.FC<ArrayRowProps> = ({
  addRow,
  attributes,
  copyRow,
  CustomRowLabel,
  duplicateRow,
  errorCount,
  fields,
  forceRender = false,
  hasMaxRows,
  isDragging,
  isLoading: isLoadingFromProps,
  isSortable,
  labels,
  listeners,
  moveRow,
  parentPath,
  pasteRow,
  path,
  permissions,
  readOnly,
  removeRow,
  row,
  rowCount,
  rowIndex,
  schemaPath,
  setCollapse,
  setNodeRef,
  transform,
  transition,
}) => {
  const isLoading = useThrottledValue(isLoadingFromProps, 500)

  const { i18n } = useTranslation()
  const hasSubmitted = useFormSubmitted()

  const fallbackLabel = `${getTranslation(labels.singular, i18n)} ${String(rowIndex + 1).padStart(
    2,
    '0',
  )}`

  const fieldHasErrors = errorCount > 0 && hasSubmitted

  const classNames = [
    `${baseClass}__row`,
    fieldHasErrors ? `${baseClass}__row--has-errors` : `${baseClass}__row--no-errors`,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      id={`${parentPath.split('.').join('-')}-row-${rowIndex}`}
      key={`${parentPath}-row-${row.id}`}
      ref={setNodeRef}
      style={{
        transform,
        transition,
        zIndex: isDragging ? 1 : undefined,
      }}
    >
      <Collapsible
        actions={
          !readOnly ? (
            <ArrayAction
              addRow={addRow}
              copyRow={copyRow}
              duplicateRow={duplicateRow}
              hasMaxRows={hasMaxRows}
              index={rowIndex}
              isSortable={isSortable}
              moveRow={moveRow}
              pasteRow={pasteRow}
              removeRow={removeRow}
              rowCount={rowCount}
            />
          ) : undefined
        }
        className={classNames}
        collapsibleStyle={fieldHasErrors ? 'error' : 'default'}
        dragHandleProps={
          isSortable
            ? {
                id: row.id,
                attributes,
                listeners,
              }
            : undefined
        }
        header={
          <div className={`${baseClass}__row-header`}>
            {isLoading ? (
              <ShimmerEffect height="1rem" width="8rem" />
            ) : (
              <RowLabel
                CustomComponent={CustomRowLabel}
                label={fallbackLabel}
                path={path}
                rowNumber={rowIndex}
              />
            )}
            {fieldHasErrors && <ErrorPill count={errorCount} i18n={i18n} withMessage />}
          </div>
        }
        isCollapsed={row.collapsed}
        onToggle={(collapsed) => setCollapse(row.id, collapsed)}
      >
        {isLoading ? (
          <ShimmerEffect />
        ) : (
          <RenderFields
            className={`${baseClass}__fields`}
            fields={fields}
            forceRender={forceRender}
            margins="small"
            parentIndexPath=""
            parentPath={path}
            parentSchemaPath={schemaPath}
            permissions={permissions === true ? permissions : permissions?.fields}
            readOnly={readOnly}
          />
        )}
      </Collapsible>
    </div>
  )
}
```

--------------------------------------------------------------------------------

````
