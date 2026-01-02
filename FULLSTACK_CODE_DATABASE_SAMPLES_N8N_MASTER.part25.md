---
source_txt: fullstack_samples/n8n-master
converted_utc: 2025-12-18T10:47:15Z
part: 25
parts_total: 51
---

# FULLSTACK CODE DATABASE SAMPLES n8n-master

## Extracted Reusable Patterns (Non-verbatim) (Part 25 of 51)

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

---[FILE: AskAssistantButton.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/AskAssistantButton/AskAssistantButton.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Button = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Button
- Notifications
```

--------------------------------------------------------------------------------

---[FILE: AskAssistantChat.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/AskAssistantChat/AskAssistantChat.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const DefaultPlaceholderChat = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DefaultPlaceholderChat
- WithSuggestions
- Chat
- JustSummary
- SummaryTitleStreaming
- SummaryContentStreaming
- ErrorChat
- EmptyStreamingChat
- StreamingChat
- EndOfSessionChat
- AssistantThinkingChat
- WithCodeSnippet
- RichTextMessage
- TextMessageWithRegularRating
- TextMessageWithMinimalRating
- MultipleMessagesWithRatings
- CodeDiffWithMinimalRating
- ToolMessageStates
```

--------------------------------------------------------------------------------

---[FILE: helpers.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/AskAssistantChat/messages/helpers.ts
Signals: N/A
Excerpt (<=80 chars):  export function getSupportedMessageComponent(type: ChatUI.AssistantMessage['...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getSupportedMessageComponent
```

--------------------------------------------------------------------------------

---[FILE: useMarkdown.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/AskAssistantChat/messages/useMarkdown.ts
Signals: N/A
Excerpt (<=80 chars):  export function useMarkdown() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useMarkdown
```

--------------------------------------------------------------------------------

---[FILE: AssistantIcon.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/AskAssistantIcon/AssistantIcon.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Default = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Default
- Blank
- Mini
- Small
- Medium
- Large
```

--------------------------------------------------------------------------------

---[FILE: AssistantLoadingMessage.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/AskAssistantLoadingMessage/AssistantLoadingMessage.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Default = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Default
- Thinking
- NarrowContainer
```

--------------------------------------------------------------------------------

---[FILE: DemoComponent.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/AskAssistantLoadingMessage/DemoComponent.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Default = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Default
- Horizontal
- Fade
```

--------------------------------------------------------------------------------

---[FILE: AssistantText.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/AskAssistantText/AssistantText.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Default = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Default
- Small
- Medium
- Large
```

--------------------------------------------------------------------------------

---[FILE: BetaTag.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/BetaTag/BetaTag.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Beta = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Beta
```

--------------------------------------------------------------------------------

---[FILE: BlinkingCursor.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/BlinkingCursor/BlinkingCursor.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Cursor = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Cursor
```

--------------------------------------------------------------------------------

---[FILE: CodeDiff.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/CodeDiff/CodeDiff.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Example = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Example
- Empty
- Code
- StreamingTitleEmpty
- StreamingTitle
- StreamingContentWithOneLine
- StreamingContentWithMultipleLines
- StreamingWithManyManyLines
- Replaced
- Replacing
- Error
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/DateRangePicker/index.ts
Signals: N/A
Excerpt (<=80 chars):  export type N8nDateRangePickerProps = DateRangePickerRootProps & {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- N8nDateRangePickerProps
- N8nDateRangePickerRootEmits
```

--------------------------------------------------------------------------------

---[FILE: InlineAskAssistantButton.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/InlineAskAssistantButton/InlineAskAssistantButton.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Default = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Default
- AskedButton
- Small
- Static
```

--------------------------------------------------------------------------------

---[FILE: ActionBox.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nActionBox/ActionBox.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const ActionBox = DefaultTemplate.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ActionBox
- ActionBoxWithIcon
- ActionBoxWithAdditionalContent
```

--------------------------------------------------------------------------------

---[FILE: ActionDropdown.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nActionDropdown/ActionDropdown.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const defaultActionDropdown = template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- defaultActionDropdown
- customStyling
- keyboardShortcuts
```

--------------------------------------------------------------------------------

---[FILE: ActionToggle.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nActionToggle/ActionToggle.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const ActionToggle = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ActionToggle
```

--------------------------------------------------------------------------------

---[FILE: Alert.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nAlert/Alert.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const ContentAsProps = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ContentAsProps
- ContentInSlots
```

--------------------------------------------------------------------------------

---[FILE: Avatar.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nAvatar/Avatar.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Avatar = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Avatar
```

--------------------------------------------------------------------------------

---[FILE: Badge.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nBadge/Badge.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Badge = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Badge
```

--------------------------------------------------------------------------------

---[FILE: BlockUi.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nBlockUi/BlockUi.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const BlockUi = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BlockUi
```

--------------------------------------------------------------------------------

---[FILE: Breadcrumbs.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nBreadcrumbs/Breadcrumbs.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Default = defaultTemplate.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Default
- CustomSeparator
- WithHiddenItems
- HiddenItemsDisabled
- AsyncLoading
- AsyncLoadingCacheTest
- SyncLoadingCacheTest
- WithSlots
- SmallVersion
- SmallWithSlots
- SmallAsyncLoading
- SmallWithHiddenItemsDisabled
```

--------------------------------------------------------------------------------

---[FILE: Button.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nButton/Button.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Button = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Button
- Primary
- Secondary
- Tertiary
- Success
- Warning
- Danger
- Outline
- Text
- WithIcon
- Highlight
- Square
```

--------------------------------------------------------------------------------

---[FILE: Callout.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nCallout/Callout.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const defaultCallout = template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- defaultCallout
- customCallout
- secondaryCallout
```

--------------------------------------------------------------------------------

---[FILE: Checkbox.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nCheckbox/Checkbox.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Default = DefaultTemplate.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Default
```

--------------------------------------------------------------------------------

---[FILE: CircleLoader.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nCircleLoader/CircleLoader.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const defaultCircleLoader = template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- defaultCircleLoader
```

--------------------------------------------------------------------------------

---[FILE: ColorPicker.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nColorPicker/ColorPicker.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Default = DefaultTemplate.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Default
```

--------------------------------------------------------------------------------

---[FILE: CommandBar.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nCommandBar/CommandBar.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Default = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Default
- WithItems
- WithContext
- CustomPlaceholder
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nCommandBar/types.ts
Signals: N/A
Excerpt (<=80 chars):  export interface CommandBarItem {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CommandBarItem
```

--------------------------------------------------------------------------------

---[FILE: data.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nDatatable/__tests__/data.ts
Signals: N/A
Excerpt (<=80 chars):  export const ActionComponent = defineComponent({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ActionComponent
```

--------------------------------------------------------------------------------

---[FILE: ExternalLink.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nExternalLink/ExternalLink.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const IconOnly = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IconOnly
- WithText
- Small
- Large
- SameWindow
- WithClickHandler
```

--------------------------------------------------------------------------------

---[FILE: FormBox.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nFormBox/FormBox.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const FormBox = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FormBox
```

--------------------------------------------------------------------------------

---[FILE: FormInput.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nFormInput/FormInput.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const FormInput = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FormInput
```

--------------------------------------------------------------------------------

---[FILE: validators.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nFormInput/validators.ts
Signals: N/A
Excerpt (<=80 chars):  export const emailRegex =

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- emailRegex
- VALIDATORS
- getValidationError
```

--------------------------------------------------------------------------------

---[FILE: FormInputs.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nFormInputs/FormInputs.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const FormInputs = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FormInputs
```

--------------------------------------------------------------------------------

---[FILE: Heading.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nHeading/Heading.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Heading = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Heading
```

--------------------------------------------------------------------------------

---[FILE: Icon.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nIcon/Icon.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Clock = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Clock
- Plus
- Stop
- WithColor
- WithDangerColor
- WithSize
- WithCustomSize
- WithSpin
- WithStrokeWidth
```

--------------------------------------------------------------------------------

---[FILE: icons.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nIcon/icons.ts
Signals: N/A
Excerpt (<=80 chars): export const deprecatedIconSet = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isSupportedIconName
- deprecatedIconSet
- updatedIconSet
- IconName
```

--------------------------------------------------------------------------------

---[FILE: IconButton.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nIconButton/IconButton.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Button = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Button
- Primary
- Outline
- Tertiary
- Text
```

--------------------------------------------------------------------------------

---[FILE: IconPicker.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nIconPicker/IconPicker.stories.ts
Signals: N/A
Excerpt (<=80 chars): export const Default = DefaultTemplate.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Default
- WithCustomIconAndTooltip
- OnlyEmojis
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nIconPicker/types.ts
Signals: N/A
Excerpt (<=80 chars):  export type IconOrEmoji =

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isIconOrEmoji
- IconOrEmoji
```

--------------------------------------------------------------------------------

---[FILE: InfoTip.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nInfoTip/InfoTip.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Note = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Note
- Tooltip
```

--------------------------------------------------------------------------------

---[FILE: InlineTextEdit.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nInlineTextEdit/InlineTextEdit.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const primary = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- primary
- placeholder
```

--------------------------------------------------------------------------------

---[FILE: Input.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nInput/Input.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Input = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Input
- Text
- TextArea
- WithPrefixIcon
- WithSuffixIcon
```

--------------------------------------------------------------------------------

---[FILE: InputLabel.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nInputLabel/InputLabel.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const InputLabel = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InputLabel
```

--------------------------------------------------------------------------------

---[FILE: InputNumber.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nInputNumber/InputNumber.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Input = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Input
- Sizes
- Controls
```

--------------------------------------------------------------------------------

---[FILE: KeyboardShortcut.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nKeyboardShortcut/KeyboardShortcut.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const defaultShortcut = template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- defaultShortcut
```

--------------------------------------------------------------------------------

---[FILE: Link.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nLink/Link.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Link = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Link
```

--------------------------------------------------------------------------------

---[FILE: Loading.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nLoading/Loading.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Loading = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Loading
```

--------------------------------------------------------------------------------

---[FILE: Logo.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nLogo/Logo.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Large = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Large
- SmallExpanded
- SmallCollapsed
- DevChannel
- BetaChannel
- NightlyChannel
```

--------------------------------------------------------------------------------

---[FILE: Markdown.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nMarkdown/Markdown.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Markdown = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Markdown
- WithCheckboxes
- WithYoutubeEmbed
```

--------------------------------------------------------------------------------

---[FILE: youtube.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nMarkdown/youtube.ts
Signals: N/A
Excerpt (<=80 chars):  export const YOUTUBE_EMBED_SRC_REGEX =

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- YOUTUBE_EMBED_SRC_REGEX
- markdownYoutubeEmbed
- YoutubeEmbedConfig
```

--------------------------------------------------------------------------------

---[FILE: MenuItem.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nMenuItem/MenuItem.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const defaultMenuItem = template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- defaultMenuItem
- withSecondaryIcon
- withSecondaryIconTooltip
- withBetaTag
- compact
- link
- withChildren
```

--------------------------------------------------------------------------------

---[FILE: routerUtil.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nMenuItem/routerUtil.ts
Signals: N/A
Excerpt (<=80 chars): export function doesMenuItemMatchCurrentRoute(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- doesMenuItemMatchCurrentRoute
```

--------------------------------------------------------------------------------

---[FILE: NavigationDropdown.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nNavigationDropdown/NavigationDropdown.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const primary = template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- primary
```

--------------------------------------------------------------------------------

---[FILE: NodeCreatorNode.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nNodeCreatorNode/NodeCreatorNode.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const WithTitle = DefaultTemplate.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WithTitle
- WithPanel
```

--------------------------------------------------------------------------------

---[FILE: NodeIcon.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nNodeIcon/NodeIcon.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const FileIcon = DefaultTemplate.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FileIcon
- FontIcon
- Hoverable
- Unknown
```

--------------------------------------------------------------------------------

---[FILE: Notice.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nNotice/Notice.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Warning = SlotTemplate.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Warning
- Danger
- Success
- Info
- Sanitized
- FullContent
- HtmlEdgeCase
```

--------------------------------------------------------------------------------

---[FILE: Popover.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nPopover/Popover.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const SimpleExample = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SimpleExample
- WithScrolling
- AlwaysVisibleScrollbars
```

--------------------------------------------------------------------------------

---[FILE: N8nPromptInput.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nPromptInput/N8nPromptInput.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Default = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Default
- SingleLine
- MultiLine
- Streaming
- Disabled
- WithInitialText
- AtCharacterLimit
- WithRefocusAfterSend
- Interactive
- DifferentSizes
```

--------------------------------------------------------------------------------

---[FILE: N8nPromptInputSuggestions.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nPromptInputSuggestions/N8nPromptInputSuggestions.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Default = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Default
- Disabled
- Streaming
- NoSuggestions
- WithCredits
```

--------------------------------------------------------------------------------

---[FILE: RadioButtons.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nRadioButtons/RadioButtons.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Example = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Example
- Disabled
```

--------------------------------------------------------------------------------

---[FILE: RecycleScroller.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nRecycleScroller/RecycleScroller.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const RecycleScroller = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RecycleScroller
```

--------------------------------------------------------------------------------

---[FILE: ResizeableSticky.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nResizeableSticky/ResizeableSticky.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const ResizeableSticky = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ResizeableSticky
```

--------------------------------------------------------------------------------

---[FILE: ResizeWrapper.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nResizeWrapper/ResizeWrapper.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Resize = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Resize
```

--------------------------------------------------------------------------------

---[FILE: N8nScrollArea.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nScrollArea/N8nScrollArea.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Default = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Default
- AlwaysVisible
- WithMaxHeight
- HorizontalScroll
- BothDirections
- InPopover
```

--------------------------------------------------------------------------------

---[FILE: Select.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nSelect/Select.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Input = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Input
- Filterable
- Sizes
- WithIcon
- LimitedWidth
```

--------------------------------------------------------------------------------

---[FILE: SelectableList.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nSelectableList/SelectableList.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const SelectableList = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SelectableList
```

--------------------------------------------------------------------------------

---[FILE: N8nSendStopButton.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nSendStopButton/N8nSendStopButton.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const SendButton = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SendButton
- SendButtonDisabled
- StopButton
- SmallSize
- MediumSize
- LargeSize
- AllSizes
- Interactive
- AllStates
- UsageExample
```

--------------------------------------------------------------------------------

---[FILE: Spinner.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nSpinner/Spinner.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Spinner = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Spinner
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nSticky/constants.ts
Signals: N/A
Excerpt (<=80 chars): export const defaultStickyProps = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- defaultStickyProps
```

--------------------------------------------------------------------------------

---[FILE: Sticky.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nSticky/Sticky.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Sticky = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Sticky
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nSticky/types.ts
Signals: N/A
Excerpt (<=80 chars): export interface StickyProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- StickyProps
```

--------------------------------------------------------------------------------

---[FILE: SuggestedActions.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nSuggestedActions/SuggestedActions.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Default = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Default
- InitiallyOpen
- WithoutMoreInfoLinks
- LongContent
- WithIgnoreAllOption
- SingleActionWithTurnOff
- PopoverAlignments
- MultipleActionsWithIgnoreAll
- ExternalControl
- WithNotice
```

--------------------------------------------------------------------------------

---[FILE: Tabs.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nTabs/Tabs.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Example = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Example
- TabVariants
- WithSmallSize
- WithModernVariant
- WithSmallAndModern
```

--------------------------------------------------------------------------------

---[FILE: Tag.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nTag/Tag.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Tag = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Tag
```

--------------------------------------------------------------------------------

---[FILE: Tags.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nTags/Tags.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Tags = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Tags
- Truncated
```

--------------------------------------------------------------------------------

---[FILE: Text.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nText/Text.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Text = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Text
```

--------------------------------------------------------------------------------

---[FILE: Tooltip.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nTooltip/Tooltip.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Tooltip = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Tooltip
- TooltipWithButtons
```

--------------------------------------------------------------------------------

---[FILE: UserInfo.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nUserInfo/UserInfo.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Member = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Member
- Current
- Invited
```

--------------------------------------------------------------------------------

---[FILE: UserSelect.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nUserSelect/UserSelect.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const UserSelect = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UserSelect
```

--------------------------------------------------------------------------------

---[FILE: UsersList.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nUsersList/UsersList.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const UsersList = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UsersList
```

--------------------------------------------------------------------------------

---[FILE: UserStack.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/N8nUserStack/UserStack.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const WithGroups = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WithGroups
- SingleGroup
- NoCutoff
```

--------------------------------------------------------------------------------

---[FILE: TableHeaderControlsButton.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/TableHeaderControlsButton/TableHeaderControlsButton.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const AllColumnsShown = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AllColumnsShown
- ALotOfColumnsShown
- SomeColumnsHidden
- MinimalColumns
```

--------------------------------------------------------------------------------

---[FILE: useCharacterLimit.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/composables/useCharacterLimit.ts
Signals: N/A
Excerpt (<=80 chars):  export function useCharacterLimit({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useCharacterLimit
```

--------------------------------------------------------------------------------

---[FILE: useI18n.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/composables/useI18n.ts
Signals: N/A
Excerpt (<=80 chars):  export function useI18n() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useI18n
```

--------------------------------------------------------------------------------

---[FILE: useParentScroll.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/composables/useParentScroll.ts
Signals: N/A
Excerpt (<=80 chars): export function useParentScroll(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useParentScroll
```

--------------------------------------------------------------------------------

---[FILE: useTooltipAppendTo.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/composables/useTooltipAppendTo.ts
Signals: N/A
Excerpt (<=80 chars):  export function useProvideTooltipAppendTo(el: Value) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useProvideTooltipAppendTo
- useInjectTooltipAppendTo
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/locale/index.ts
Signals: N/A
Excerpt (<=80 chars):  export const t = function (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- i18n
- t
```

--------------------------------------------------------------------------------

---[FILE: border.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/styleguide/border.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const BorderRadius = Template(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BorderRadius
- BorderWidth
- BorderStyle
```

--------------------------------------------------------------------------------

---[FILE: ColorCircles.utils.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/styleguide/ColorCircles.utils.ts
Signals: N/A
Excerpt (<=80 chars): export function hslToHex(h: number, s: number, l: number): string {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- hslToHex
- resolveHSLCalc
- getHex
```

--------------------------------------------------------------------------------

---[FILE: colors.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/styleguide/colors.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Primary = Template(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Primary
- Secondary
- Success
- Warning
- Danger
- Text
- Foreground
- Background
```

--------------------------------------------------------------------------------

---[FILE: colorsprimitives.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/styleguide/colorsprimitives.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Gray = Template(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Gray
- Primary
- Secondary
- AlternateA
- AlternateB
- AlternateC
- AlternateD
- AlternateE
- AlternateF
- AlternateG
- AlternateH
```

--------------------------------------------------------------------------------

````
