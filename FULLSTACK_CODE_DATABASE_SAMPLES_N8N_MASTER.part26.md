---
source_txt: fullstack_samples/n8n-master
converted_utc: 2025-12-18T10:47:15Z
part: 26
parts_total: 51
---

# FULLSTACK CODE DATABASE SAMPLES n8n-master

## Extracted Reusable Patterns (Non-verbatim) (Part 26 of 51)

````text
================================================================================
FULLSTACK SAMPLES PATTERN DATABASE - n8n-master
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/n8n-master
================================================================================

NOTES:
- This file intentionally avoids copying large verbatim third-party code.
- It captures reusable patterns, surfaces, and file references.
- Use the referenced file paths to view full implementations locally.

================================================================================

---[FILE: fonts.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/styleguide/fonts.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const FontSize: StoryFn = () => ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LineHeight
- FontWeight
- FontFamily
```

--------------------------------------------------------------------------------

---[FILE: float.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/styleguide/utilities/float.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const FloatLeft = Template(`<div>

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FloatLeft
- FloatRight
```

--------------------------------------------------------------------------------

---[FILE: lists.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/styleguide/utilities/lists.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const StyleNone = ListStyleNoneTemplate.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- StyleNone
- Inline
```

--------------------------------------------------------------------------------

---[FILE: spacing.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/styleguide/utilities/spacing.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Padding = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Padding
- PaddingTop
- PaddingRight
- PaddingBottom
- PaddingLeft
- Margin
- MarginTop
- MarginRight
- MarginBottom
- MarginLeft
```

--------------------------------------------------------------------------------

---[FILE: action-dropdown.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/types/action-dropdown.ts
Signals: N/A
Excerpt (<=80 chars):  export interface ActionDropdownItem<T extends string> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ActionDropdownItem
```

--------------------------------------------------------------------------------

---[FILE: assistant.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/types/assistant.ts
Signals: N/A
Excerpt (<=80 chars):  export interface TextMessage {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isTextMessage
- isTaskAbortedMessage
- isSummaryBlock
- isCodeDiffMessage
- isErrorMessage
- isEndSessionMessage
- isSessionTimeoutMessage
- isSessionErrorMessage
- isAgentSuggestionMessage
- isWorkflowUpdatedMessage
- isToolMessage
- isCustomMessage
- isThinkingGroupMessage
- AssistantMessage
- RatingFeedback
- TextMessage
- TaskAbortedMessage
- SummaryBlock
```

--------------------------------------------------------------------------------

---[FILE: badge.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/types/badge.ts
Signals: N/A
Excerpt (<=80 chars): export type BadgeTheme = (typeof BADGE_THEME)[number];

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BadgeTheme
```

--------------------------------------------------------------------------------

---[FILE: button.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/types/button.ts
Signals: N/A
Excerpt (<=80 chars): export type ButtonElement = (typeof BUTTON_ELEMENT)[number];

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ButtonElement
- ButtonType
- ButtonSize
- ButtonNativeType
- IN8nButton
- IconButtonProps
- ButtonProps
```

--------------------------------------------------------------------------------

---[FILE: callout.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/types/callout.ts
Signals: N/A
Excerpt (<=80 chars): export type CalloutTheme = (typeof CALLOUT_THEMES)[number];

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CalloutTheme
```

--------------------------------------------------------------------------------

---[FILE: datatable.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/types/datatable.ts
Signals: N/A
Excerpt (<=80 chars):  export type DatatableRowDataType = string | number | boolean | null | undefi...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DatatableRowDataType
- DatatableRow
- DatatableColumn
```

--------------------------------------------------------------------------------

---[FILE: form.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/types/form.ts
Signals: N/A
Excerpt (<=80 chars):  export type FormFieldValue = string | number | boolean | null | undefined;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FormFieldValue
- FormInputsToFormValues
- FormFieldValueUpdate
- Rule
- RuleGroup
- Validatable
- IValidator
- FormState
- IFormInput
- IFormInputs
- FormValues
- IFormBoxConfig
- CheckboxLabelSizePropType
- CheckboxModelValuePropType
- SwitchModelValuePropType
- InputModelValuePropType
- InputTypePropType
- InputAutocompletePropType
```

--------------------------------------------------------------------------------

---[FILE: i18n.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/types/i18n.ts
Signals: N/A
Excerpt (<=80 chars): export type N8nLocaleTranslateFnOptions = string[] | Record<string, unknown>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- N8nLocaleTranslateFnOptions
- N8nLocaleTranslateFn
- N8nLocale
```

--------------------------------------------------------------------------------

---[FILE: icon.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/types/icon.ts
Signals: N/A
Excerpt (<=80 chars): export type IconSize = (typeof ICON_SIZE)[number];

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IconSize
- IconColor
- IconOrientation
```

--------------------------------------------------------------------------------

---[FILE: input.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/types/input.ts
Signals: N/A
Excerpt (<=80 chars):  export type InputType = (typeof INPUT_TYPES)[number];

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InputType
- InputSize
```

--------------------------------------------------------------------------------

---[FILE: keyboardshortcut.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/types/keyboardshortcut.ts
Signals: N/A
Excerpt (<=80 chars): export interface KeyboardShortcut {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- KeyboardShortcut
```

--------------------------------------------------------------------------------

---[FILE: menu.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/types/menu.ts
Signals: N/A
Excerpt (<=80 chars):  export type IMenuItem = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isCustomMenuItem
- IMenuItem
- IMenuElement
- IRouteMenuItemProperties
- ILinkMenuItemProperties
- ICustomMenuItem
```

--------------------------------------------------------------------------------

---[FILE: node-creator-node.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/types/node-creator-node.ts
Signals: N/A
Excerpt (<=80 chars):  export type NodeCreatorTag = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NodeCreatorTag
```

--------------------------------------------------------------------------------

---[FILE: recycle-scroller.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/types/recycle-scroller.ts
Signals: N/A
Excerpt (<=80 chars): export type ItemWithKey<Key extends string> = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ItemWithKey
```

--------------------------------------------------------------------------------

---[FILE: resize.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/types/resize.ts
Signals: N/A
Excerpt (<=80 chars): export const directionsCursorMaps = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- directionsCursorMaps
- Direction
- ResizeData
```

--------------------------------------------------------------------------------

---[FILE: select.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/types/select.ts
Signals: N/A
Excerpt (<=80 chars): export type SelectSize = (typeof SELECT_SIZES)[number];

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SelectSize
```

--------------------------------------------------------------------------------

---[FILE: tabs.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/types/tabs.ts
Signals: N/A
Excerpt (<=80 chars):  export interface TabOptions<Value extends string | number> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TabOptions
```

--------------------------------------------------------------------------------

---[FILE: text.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/types/text.ts
Signals: N/A
Excerpt (<=80 chars): export type TextSize = (typeof TEXT_SIZE)[number];

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TextSize
- TextColor
- TextAlign
- TextFloat
```

--------------------------------------------------------------------------------

---[FILE: user.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/types/user.ts
Signals: N/A
Excerpt (<=80 chars): export type IUser = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IUser
- UserStackGroups
- UserAction
```

--------------------------------------------------------------------------------

---[FILE: form-event-bus.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/utils/form-event-bus.ts
Signals: N/A
Excerpt (<=80 chars):  export interface FormEventBusEvents {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createFormEventBus
- FormEventBus
- FormEventBusEvents
```

--------------------------------------------------------------------------------

---[FILE: labelUtil.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/utils/labelUtil.ts
Signals: N/A
Excerpt (<=80 chars): export const getInitials = (label: string): string => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getInitials
```

--------------------------------------------------------------------------------

---[FILE: markdown.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/utils/markdown.ts
Signals: N/A
Excerpt (<=80 chars): export const toggleCheckbox = (markdown: string, index: number) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- toggleCheckbox
```

--------------------------------------------------------------------------------

---[FILE: testUtils.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/utils/testUtils.ts
Signals: N/A
Excerpt (<=80 chars): export function removeDynamicAttributes(container: Element): void {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- removeDynamicAttributes
```

--------------------------------------------------------------------------------

---[FILE: typeguards.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/utils/typeguards.ts
Signals: N/A
Excerpt (<=80 chars): export function isEventBindingElementAttribute(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isEventBindingElementAttribute
```

--------------------------------------------------------------------------------

---[FILE: uid.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/utils/uid.ts
Signals: N/A
Excerpt (<=80 chars): export function uid(baseId?: string): string {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- uid
```

--------------------------------------------------------------------------------

---[FILE: Checkbox.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/v2/components/Checkbox/Checkbox.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Default = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Default
```

--------------------------------------------------------------------------------

---[FILE: Checkbox.types.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/v2/components/Checkbox/Checkbox.types.ts
Signals: N/A
Excerpt (<=80 chars):  export type CheckboxProps = Pick<

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CheckboxProps
- CheckboxSlots
- CheckboxEmits
```

--------------------------------------------------------------------------------

---[FILE: Input.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/v2/components/Input/Input.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Text = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Text
- Textarea
- Password
- WithSlots
- Clearable
- Disabled
- Sizes
```

--------------------------------------------------------------------------------

---[FILE: Input.types.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/v2/components/Input/Input.types.ts
Signals: N/A
Excerpt (<=80 chars): export type Input2Type = 'text' | 'textarea' | 'password';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Input2Type
- Input2Size
- InputProps
- InputEmits
- InputSlots
```

--------------------------------------------------------------------------------

---[FILE: InputNumber.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/v2/components/InputNumber/InputNumber.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Basic = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Basic
- WithControlsBoth
- WithControlsRight
- Sizes
- Precision
- MinMax
- Disabled
- CustomButtons
- ControlsSizes
```

--------------------------------------------------------------------------------

---[FILE: InputNumber.types.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/v2/components/InputNumber/InputNumber.types.ts
Signals: N/A
Excerpt (<=80 chars):  export type InputNumberSize = 'mini' | 'small' | 'medium' | 'large' | 'xlarge';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InputNumberSize
- InputNumberControlsPosition
- InputNumberProps
- InputNumberEmits
- InputNumberSlots
```

--------------------------------------------------------------------------------

---[FILE: Loading.types.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/v2/components/Loading/Loading.types.ts
Signals: N/A
Excerpt (<=80 chars): export const SKELETON_VARIANTS = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SKELETON_VARIANTS
- SkeletonVariant
- LoadingProps
```

--------------------------------------------------------------------------------

---[FILE: Pagination.types.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/v2/components/Pagination/Pagination.types.ts
Signals: N/A
Excerpt (<=80 chars):  export type PaginationSizes = 'small' | 'medium';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PaginationSizes
- PaginationVariants
- PaginationProps
- PaginationEmits
- PaginationSlots
```

--------------------------------------------------------------------------------

---[FILE: Select.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/v2/components/Select/Select.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Items = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Items
- ItemsObjectArray
- ItemsTypes
- WithIcons
- WithSlots
- Variants
- Sizes
```

--------------------------------------------------------------------------------

---[FILE: Select.types.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/v2/components/Select/Select.types.ts
Signals: N/A
Excerpt (<=80 chars):  export type SelectItemProps = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SelectItemProps
- SelectValue
- SelectItem
- SelectVariants
- SelectSizes
- SelectProps
- SelectEmits
- SelectSlots
```

--------------------------------------------------------------------------------

---[FILE: Tooltip.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/v2/components/Tooltip/Tooltip.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Default = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Default
- Placements
- HTMLContent
- CustomContentSlot
- DelayedShow
- ProgrammaticControl
- Disabled
- WithOffset
- WithIcon
- NotEnterable
```

--------------------------------------------------------------------------------

---[FILE: Tooltip.types.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/v2/components/Tooltip/Tooltip.types.ts
Signals: N/A
Excerpt (<=80 chars): export type Placement =

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Placement
- N8nTooltipProps
- N8nTooltipSlots
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/v2/utils/types.ts
Signals: N/A
Excerpt (<=80 chars):  export type DeepPartial<T> = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeepPartial
- DynamicSlotsKeys
- DynamicSlots
- GetObjectField
- AcceptableValue
- ArrayOrNested
- NestedItem
- MergeTypes
- GetItemKeys
- GetItemValue
- GetModelValue
- GetModelValueEmits
- StringOrVNode
- EmitsToProps
```

--------------------------------------------------------------------------------

---[FILE: render.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/__tests__/render.ts
Signals: N/A
Excerpt (<=80 chars):  export const createComponentRenderer = (component: Component) => (options: R...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createComponentRenderer
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: n8n-master/packages/frontend/@n8n/i18n/src/index.ts
Signals: N/A
Excerpt (<=80 chars):  export type * from './types';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- setLanguage
- loadLanguage
- addNodeTranslation
- updateLocaleMessages
- addCredentialTranslation
- addHeaders
- useI18n
- i18nInstance
- i18nVersion
- I18nClass
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/frontend/@n8n/i18n/src/types.ts
Signals: N/A
Excerpt (<=80 chars):  export type GetBaseTextKey<T> = T extends `_${string}` ? never : T;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetBaseTextKey
- BaseTextKey
- LocaleMessages
- INodeTranslationHeaders
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/frontend/@n8n/i18n/src/utils.ts
Signals: N/A
Excerpt (<=80 chars): export function deriveMiddleKey(path: string, parameter: { name: string; type...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- deriveMiddleKey
- isNestedInCollectionLike
- normalize
- insertOptionsAndValues
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/frontend/@n8n/rest-api-client/src/types.ts
Signals: N/A
Excerpt (<=80 chars): export interface IRestApiContext {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IRestApiContext
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/frontend/@n8n/rest-api-client/src/utils.ts
Signals: N/A
Excerpt (<=80 chars):  export const NO_NETWORK_ERROR_CODE = 999;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NO_NETWORK_ERROR_CODE
- STREAM_SEPARATOR
- MfaRequiredError
- ResponseError
```

--------------------------------------------------------------------------------

---[FILE: cloudPlans.ts]---
Location: n8n-master/packages/frontend/@n8n/rest-api-client/src/api/cloudPlans.ts
Signals: N/A
Excerpt (<=80 chars):  export interface PlanData {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UserAccount
- PlanData
- PlanMetadata
- InstanceUsage
- DynamicNotification
```

--------------------------------------------------------------------------------

---[FILE: consent.ts]---
Location: n8n-master/packages/frontend/@n8n/rest-api-client/src/api/consent.ts
Signals: N/A
Excerpt (<=80 chars):  export interface ConsentDetails {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ConsentDetails
- ConsentApprovalResponse
```

--------------------------------------------------------------------------------

---[FILE: dynamic-banners.ts]---
Location: n8n-master/packages/frontend/@n8n/rest-api-client/src/api/dynamic-banners.ts
Signals: N/A
Excerpt (<=80 chars):  export type DynamicBanner = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DynamicBanner
```

--------------------------------------------------------------------------------

---[FILE: eventbus.ee.ts]---
Location: n8n-master/packages/frontend/@n8n/rest-api-client/src/api/eventbus.ee.ts
Signals: N/A
Excerpt (<=80 chars):  export type ApiMessageEventBusDestinationOptions = MessageEventBusDestinatio...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- hasDestinationId
- ApiMessageEventBusDestinationOptions
```

--------------------------------------------------------------------------------

---[FILE: externalSecrets.ee.ts]---
Location: n8n-master/packages/frontend/@n8n/rest-api-client/src/api/externalSecrets.ee.ts
Signals: N/A
Excerpt (<=80 chars):  export const getExternalSecrets = async (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getExternalSecrets
- getExternalSecretsProviders
- getExternalSecretsProvider
- testExternalSecretsProviderConnection
- updateProvider
- reloadProvider
- connectProvider
```

--------------------------------------------------------------------------------

---[FILE: ldap.ts]---
Location: n8n-master/packages/frontend/@n8n/rest-api-client/src/api/ldap.ts
Signals: N/A
Excerpt (<=80 chars):  export interface LdapSyncData {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LdapSyncData
- LdapSyncTable
- LdapConfig
```

--------------------------------------------------------------------------------

---[FILE: mfa.ts]---
Location: n8n-master/packages/frontend/@n8n/rest-api-client/src/api/mfa.ts
Signals: N/A
Excerpt (<=80 chars):  export type DisableMfaParams = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DisableMfaParams
```

--------------------------------------------------------------------------------

---[FILE: orchestration.ts]---
Location: n8n-master/packages/frontend/@n8n/rest-api-client/src/api/orchestration.ts
Signals: N/A
Excerpt (<=80 chars):  export const sendGetWorkerStatus = async (context: IRestApiContext): Promise...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- sendGetWorkerStatus
```

--------------------------------------------------------------------------------

---[FILE: prompts.ts]---
Location: n8n-master/packages/frontend/@n8n/rest-api-client/src/api/prompts.ts
Signals: N/A
Excerpt (<=80 chars):  export interface N8nPrompts {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- N8nPrompts
- N8nPromptResponse
```

--------------------------------------------------------------------------------

---[FILE: provisioning.ts]---
Location: n8n-master/packages/frontend/@n8n/rest-api-client/src/api/provisioning.ts
Signals: N/A
Excerpt (<=80 chars):  export interface ProvisioningConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getProvisioningConfig
- saveProvisioningConfig
- ProvisioningConfig
```

--------------------------------------------------------------------------------

---[FILE: roles.ts]---
Location: n8n-master/packages/frontend/@n8n/rest-api-client/src/api/roles.ts
Signals: N/A
Excerpt (<=80 chars):  export const getRoles = async (context: IRestApiContext): Promise<AllRolesMa...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getRoles
- createProjectRole
- getRoleBySlug
- updateProjectRole
- deleteProjectRole
```

--------------------------------------------------------------------------------

---[FILE: sso.ts]---
Location: n8n-master/packages/frontend/@n8n/rest-api-client/src/api/sso.ts
Signals: N/A
Excerpt (<=80 chars):  export type SamlPreferencesExtractedData = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- initSSO
- getSamlMetadata
- getSamlConfig
- saveSamlConfig
- toggleSamlConfig
- testSamlConfig
- getOidcConfig
- saveOidcConfig
- initOidcLogin
- SamlPreferencesExtractedData
```

--------------------------------------------------------------------------------

---[FILE: tags.ts]---
Location: n8n-master/packages/frontend/@n8n/rest-api-client/src/api/tags.ts
Signals: N/A
Excerpt (<=80 chars): export interface ITag {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ITag
```

--------------------------------------------------------------------------------

---[FILE: templates.ts]---
Location: n8n-master/packages/frontend/@n8n/rest-api-client/src/api/templates.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IWorkflowTemplateNode

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TemplateSearchFacet
- IWorkflowTemplateNode
- IWorkflowTemplateNodeCredentials
- IWorkflowTemplate
- ITemplatesNode
- ITemplatesCollection
- ITemplatesCollectionFull
- ITemplatesCollectionResponse
- ITemplatesWorkflow
- ITemplatesWorkflowInfo
- ITemplatesWorkflowResponse
- ITemplatesWorkflowFull
- ITemplatesQuery
- ITemplatesCategory
```

--------------------------------------------------------------------------------

---[FILE: usage.ts]---
Location: n8n-master/packages/frontend/@n8n/rest-api-client/src/api/usage.ts
Signals: N/A
Excerpt (<=80 chars):  export const getLicense = async (context: IRestApiContext): Promise<UsageSta...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getLicense
- activateLicenseKey
- renewLicense
- requestLicenseTrial
- registerCommunityEdition
```

--------------------------------------------------------------------------------

---[FILE: users.ts]---
Location: n8n-master/packages/frontend/@n8n/rest-api-client/src/api/users.ts
Signals: N/A
Excerpt (<=80 chars):  export type IPersonalizationSurveyAnswersV1 = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IPersonalizationSurveyAnswersV1
- IPersonalizationSurveyAnswersV2
- IPersonalizationSurveyAnswersV3
- IPersonalizationLatestVersion
- IPersonalizationSurveyVersions
- IUserResponse
- CurrentUserResponse
- IUser
- UpdateGlobalRolePayload
```

--------------------------------------------------------------------------------

---[FILE: versions.ts]---
Location: n8n-master/packages/frontend/@n8n/rest-api-client/src/api/versions.ts
Signals: N/A
Excerpt (<=80 chars):  export interface VersionNode {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VersionNode
- Version
- WhatsNewSection
- WhatsNewArticle
```

--------------------------------------------------------------------------------

---[FILE: webhooks.ts]---
Location: n8n-master/packages/frontend/@n8n/rest-api-client/src/api/webhooks.ts
Signals: N/A
Excerpt (<=80 chars):  export const findWebhook = async (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- findWebhook
```

--------------------------------------------------------------------------------

---[FILE: workflowHistory.ts]---
Location: n8n-master/packages/frontend/@n8n/rest-api-client/src/api/workflowHistory.ts
Signals: N/A
Excerpt (<=80 chars):  export type WorkflowHistory = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getWorkflowHistory
- getWorkflowVersion
- WorkflowHistory
- WorkflowPublishHistory
- WorkflowVersionId
- WorkflowVersion
- WorkflowHistoryActionTypes
- WorkflowHistoryRequestParams
```

--------------------------------------------------------------------------------

---[FILE: workflows.ts]---
Location: n8n-master/packages/frontend/@n8n/rest-api-client/src/api/workflows.ts
Signals: N/A
Excerpt (<=80 chars):  export interface WorkflowMetadata {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowMetadata
- WorkflowData
- WorkflowDataUpdate
- WorkflowDataCreate
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: n8n-master/packages/frontend/@n8n/stores/src/constants.ts
Signals: N/A
Excerpt (<=80 chars): export const STORES = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- STORES
```

--------------------------------------------------------------------------------

---[FILE: metaTagConfig.ts]---
Location: n8n-master/packages/frontend/@n8n/stores/src/metaTagConfig.ts
Signals: N/A
Excerpt (<=80 chars): export function getConfigFromMetaTag(configName: string): string | null {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getConfigFromMetaTag
```

--------------------------------------------------------------------------------

---[FILE: useAgentRequestStore.ts]---
Location: n8n-master/packages/frontend/@n8n/stores/src/useAgentRequestStore.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IAgentRequest {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useAgentRequestStore
- IAgentRequest
- IAgentRequestStoreState
```

--------------------------------------------------------------------------------

---[FILE: useRootStore.ts]---
Location: n8n-master/packages/frontend/@n8n/stores/src/useRootStore.ts
Signals: N/A
Excerpt (<=80 chars):  export type RootStoreState = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useRootStore
- RootStoreState
```

--------------------------------------------------------------------------------

---[FILE: Interface.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/Interface.ts
Signals: N/A
Excerpt (<=80 chars):  export type EndpointStyle = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EndpointStyle
- XYPosition
- DraggableMode
- BaseResource
- FolderResource
- WorkflowResource
- VariableResource
- CredentialsResource
- CoreResource
- Resource
- BaseFilters
- SortingAndPaginationUpdates
- WorkflowListItem
- WorkflowListResource
- WorkflowCallerPolicyDefaultOption
- WorkflowTitleStatus
- ExtractActionKeys
- ActionsRecord
```

--------------------------------------------------------------------------------

---[FILE: shims-modules.d.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/shims-modules.d.ts
Signals: N/A
Excerpt (<=80 chars):  export interface Events {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IdState
- Events
- RecycleScrollerInstance
```

--------------------------------------------------------------------------------

---[FILE: init.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/init.ts
Signals: N/A
Excerpt (<=80 chars):  export const state = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- state
```

--------------------------------------------------------------------------------

---[FILE: becomeTemplateCreatorStore.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/components/BecomeTemplateCreatorCta/becomeTemplateCreatorStore.ts
Signals: N/A
Excerpt (<=80 chars):  export const useBecomeTemplateCreatorStore = defineStore(STORES.BECOME_TEMPL...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useBecomeTemplateCreatorStore
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/components/MainHeader/utils.ts
Signals: N/A
Excerpt (<=80 chars): export const getWorkflowId = (propId: string, routeName: string | string[]) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getWorkflowId
```

--------------------------------------------------------------------------------

---[FILE: useAutocompleteTelemetry.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useAutocompleteTelemetry.ts
Signals: N/A
Excerpt (<=80 chars):  export const useAutocompleteTelemetry = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useAutocompleteTelemetry
```

--------------------------------------------------------------------------------

---[FILE: useAutoScrollOnDrag.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useAutoScrollOnDrag.ts
Signals: N/A
Excerpt (<=80 chars):  export function useAutoScrollOnDrag(options: UseAutoScrollOnDragOptions) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useAutoScrollOnDrag
```

--------------------------------------------------------------------------------

---[FILE: useBeforeUnload.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useBeforeUnload.ts
Signals: N/A
Excerpt (<=80 chars):  export function useBeforeUnload({ route }: { route: ReturnType<typeof useRou...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useBeforeUnload
```

--------------------------------------------------------------------------------

---[FILE: useBugReporting.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useBugReporting.ts
Signals: N/A
Excerpt (<=80 chars):  export function useBugReporting() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useBugReporting
```

--------------------------------------------------------------------------------

---[FILE: useCalloutHelpers.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useCalloutHelpers.ts
Signals: N/A
Excerpt (<=80 chars):  export function useCalloutHelpers() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useCalloutHelpers
```

--------------------------------------------------------------------------------

---[FILE: useCanvasOperations.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useCanvasOperations.ts
Signals: N/A
Excerpt (<=80 chars):  export function useCanvasOperations() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useCanvasOperations
```

--------------------------------------------------------------------------------

---[FILE: useClipboard.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useClipboard.ts
Signals: N/A
Excerpt (<=80 chars):  export function useClipboard({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useClipboard
```

--------------------------------------------------------------------------------

---[FILE: useDataSchema.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useDataSchema.ts
Signals: N/A
Excerpt (<=80 chars):  export function useDataSchema() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useDataSchema
- useFlattenSchema
- SchemaNode
- RenderItem
- RenderHeader
- RenderIcon
- RenderNotice
- RenderEmpty
- Renders
```

--------------------------------------------------------------------------------

---[FILE: useDebounce.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useDebounce.ts
Signals: N/A
Excerpt (<=80 chars):  export interface DebounceOptions {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useDebounce
- DebounceOptions
```

--------------------------------------------------------------------------------

---[FILE: useDebugInfo.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useDebugInfo.ts
Signals: N/A
Excerpt (<=80 chars):  export function useDebugInfo() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useDebugInfo
```

--------------------------------------------------------------------------------

---[FILE: useDocumentTitle.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useDocumentTitle.ts
Signals: N/A
Excerpt (<=80 chars):  export function useDocumentTitle(windowRef?: Ref<Window | undefined>) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useDocumentTitle
```

--------------------------------------------------------------------------------

---[FILE: useDocumentVisibility.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useDocumentVisibility.ts
Signals: N/A
Excerpt (<=80 chars):  export function useDocumentVisibility(): DocumentVisibilityResult {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useDocumentVisibility
```

--------------------------------------------------------------------------------

---[FILE: useExecutingNode.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useExecutingNode.ts
Signals: N/A
Excerpt (<=80 chars): export function useExecutingNode() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useExecutingNode
```

--------------------------------------------------------------------------------

---[FILE: useExposeCssVar.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useExposeCssVar.ts
Signals: N/A
Excerpt (<=80 chars): export function useExposeCssVar(name: string, value: MaybeRef<string>) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useExposeCssVar
```

--------------------------------------------------------------------------------

---[FILE: useExternalHooks.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useExternalHooks.ts
Signals: N/A
Excerpt (<=80 chars):  export function useExternalHooks() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useExternalHooks
```

--------------------------------------------------------------------------------

---[FILE: useFloatingUiOffsets.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useFloatingUiOffsets.ts
Signals: N/A
Excerpt (<=80 chars):  export function useFloatingUiOffsets() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useFloatingUiOffsets
```

--------------------------------------------------------------------------------

````
