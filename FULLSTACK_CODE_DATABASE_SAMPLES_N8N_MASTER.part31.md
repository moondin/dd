---
source_txt: fullstack_samples/n8n-master
converted_utc: 2025-12-18T10:47:15Z
part: 31
parts_total: 51
---

# FULLSTACK CODE DATABASE SAMPLES n8n-master

## Extracted Reusable Patterns (Non-verbatim) (Part 31 of 51)

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

---[FILE: theme.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/components/CodeNodeEditor/theme.ts
Signals: N/A
Excerpt (<=80 chars):  export const codeEditorTheme = ({ isReadOnly, minHeight, maxHeight, rows }: ...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- codeEditorTheme
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/components/CodeNodeEditor/types.ts
Signals: N/A
Excerpt (<=80 chars):  export type RangeNode = Node & { range: [number, number] };

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RangeNode
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/components/CodeNodeEditor/utils.ts
Signals: N/A
Excerpt (<=80 chars):  export function walk<T extends RangeNode>(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- escape
- toVariableOption
- addInfoRenderer
- valueToInsert
```

--------------------------------------------------------------------------------

---[FILE: base.completions.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/components/CodeNodeEditor/completions/base.completions.ts
Signals: N/A
Excerpt (<=80 chars):  export function useBaseCompletions(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useBaseCompletions
```

--------------------------------------------------------------------------------

---[FILE: execution.completions.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/components/CodeNodeEditor/completions/execution.completions.ts
Signals: N/A
Excerpt (<=80 chars):  export function useExecutionCompletions() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useExecutionCompletions
```

--------------------------------------------------------------------------------

---[FILE: itemField.completions.test.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/components/CodeNodeEditor/completions/itemField.completions.test.ts
Signals: N/A
Excerpt (<=80 chars):  export function createContext(docWithCursor: string) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createContext
```

--------------------------------------------------------------------------------

---[FILE: itemField.completions.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/components/CodeNodeEditor/completions/itemField.completions.ts
Signals: N/A
Excerpt (<=80 chars):  export function useItemFieldCompletions(language: 'python' | 'javaScript') {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useItemFieldCompletions
```

--------------------------------------------------------------------------------

---[FILE: itemIndex.completions.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/components/CodeNodeEditor/completions/itemIndex.completions.ts
Signals: N/A
Excerpt (<=80 chars):  export function useItemIndexCompletions(mode: MaybeRefOrGetter<CodeExecution...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useItemIndexCompletions
```

--------------------------------------------------------------------------------

---[FILE: js.snippets.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/components/CodeNodeEditor/completions/js.snippets.ts
Signals: N/A
Excerpt (<=80 chars): export const jsSnippets = completeFromList([

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- jsSnippets
```

--------------------------------------------------------------------------------

---[FILE: luxon.completions.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/components/CodeNodeEditor/completions/luxon.completions.ts
Signals: N/A
Excerpt (<=80 chars):  export function useLuxonCompletions() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useLuxonCompletions
```

--------------------------------------------------------------------------------

---[FILE: prevNode.completions.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/components/CodeNodeEditor/completions/prevNode.completions.ts
Signals: N/A
Excerpt (<=80 chars):  export function usePrevNodeCompletions(matcher = DEFAULT_MATCHER) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- usePrevNodeCompletions
```

--------------------------------------------------------------------------------

---[FILE: require.completions.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/components/CodeNodeEditor/completions/require.completions.ts
Signals: N/A
Excerpt (<=80 chars):  export function useRequireCompletions() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useRequireCompletions
```

--------------------------------------------------------------------------------

---[FILE: secrets.completions.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/components/CodeNodeEditor/completions/secrets.completions.ts
Signals: N/A
Excerpt (<=80 chars):  export function useSecretsCompletions() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useSecretsCompletions
```

--------------------------------------------------------------------------------

---[FILE: workflow.completions.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/components/CodeNodeEditor/completions/workflow.completions.ts
Signals: N/A
Excerpt (<=80 chars):  export function useWorkflowCompletions() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useWorkflowCompletions
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/components/HtmlEditor/types.ts
Signals: N/A
Excerpt (<=80 chars): export type Range = [number, number];

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Range
- Section
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/components/HtmlEditor/utils.ts
Signals: N/A
Excerpt (<=80 chars): export function nonTakenRanges(fullRange: Range, takenRanges: Range[]) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- nonTakenRanges
- pasteHandler
```

--------------------------------------------------------------------------------

---[FILE: theme.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/components/InlineExpressionEditor/theme.ts
Signals: N/A
Excerpt (<=80 chars):  export const inputTheme = ({ rows, isReadOnly } = { rows: 5, isReadOnly: fal...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- inputTheme
- outputTheme
```

--------------------------------------------------------------------------------

---[FILE: useCodeEditor.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/composables/useCodeEditor.ts
Signals: N/A
Excerpt (<=80 chars):  export type CodeEditorLanguageParamsMap = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useCodeEditor
- CodeEditorLanguageParamsMap
```

--------------------------------------------------------------------------------

---[FILE: useExpressionEditor.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/composables/useExpressionEditor.ts
Signals: N/A
Excerpt (<=80 chars):  export const useExpressionEditor = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useExpressionEditor
```

--------------------------------------------------------------------------------

---[FILE: dragAndDrop.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/plugins/codemirror/dragAndDrop.ts
Signals: N/A
Excerpt (<=80 chars):  export function mappingDropCursor(): Extension {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mappingDropCursor
```

--------------------------------------------------------------------------------

---[FILE: expressionCloseBrackets.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/plugins/codemirror/expressionCloseBrackets.ts
Signals: N/A
Excerpt (<=80 chars):  export const expressionCloseBracketsConfig: CloseBracketConfig = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- expressionCloseBrackets
```

--------------------------------------------------------------------------------

---[FILE: format.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/plugins/codemirror/format.ts
Signals: N/A
Excerpt (<=80 chars):  export type CodeEditorLanguage = 'json' | 'html' | 'javaScript' | 'python';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- formatDocument
- languageFacet
- CodeEditorLanguage
```

--------------------------------------------------------------------------------

---[FILE: multiCursor.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/plugins/codemirror/multiCursor.ts
Signals: N/A
Excerpt (<=80 chars):  export const addCursorUp = createAddCursor('up');

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- addCursorUp
- addCursorDown
```

--------------------------------------------------------------------------------

---[FILE: n8nLang.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/plugins/codemirror/n8nLang.ts
Signals: N/A
Excerpt (<=80 chars):  export function n8nLang() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- n8nLang
- n8nAutocompletion
```

--------------------------------------------------------------------------------

---[FILE: resolvableHighlighter.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/plugins/codemirror/resolvableHighlighter.ts
Signals: N/A
Excerpt (<=80 chars):  export const highlighter = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- highlighter
```

--------------------------------------------------------------------------------

---[FILE: addCompletions.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/plugins/codemirror/completions/addCompletions.ts
Signals: N/A
Excerpt (<=80 chars):  export function n8nCompletionSources() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- n8nCompletionSources
```

--------------------------------------------------------------------------------

---[FILE: base.completions.test.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/plugins/codemirror/completions/base.completions.test.ts
Signals: N/A
Excerpt (<=80 chars):  export function completions(docWithCursor: string, explicit = false) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- completions
```

--------------------------------------------------------------------------------

---[FILE: blank.completions.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/plugins/codemirror/completions/blank.completions.ts
Signals: N/A
Excerpt (<=80 chars): export function blankCompletions(context: CompletionContext): CompletionResul...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- blankCompletions
```

--------------------------------------------------------------------------------

---[FILE: bracketAccess.completions.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/plugins/codemirror/completions/bracketAccess.completions.ts
Signals: N/A
Excerpt (<=80 chars): export function bracketAccessCompletions(context: CompletionContext): Complet...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- bracketAccessCompletions
```

--------------------------------------------------------------------------------

---[FILE: completions.test.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/plugins/codemirror/completions/completions.test.ts
Signals: N/A
Excerpt (<=80 chars):  export function completions(docWithCursor: string, explicit = false) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- completions
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/plugins/codemirror/completions/constants.ts
Signals: N/A
Excerpt (<=80 chars):  export const FIELDS_SECTION: CompletionSection = withSectionHeader({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- STRING_RECOMMENDED_OPTIONS
- LUXON_RECOMMENDED_OPTIONS
- OBJECT_RECOMMENDED_OPTIONS
- ARRAY_RECOMMENDED_OPTIONS
- ARRAY_NUMBER_ONLY_METHODS
- TARGET_NODE_PARAMETER_FACET
```

--------------------------------------------------------------------------------

---[FILE: datatype.completions.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/plugins/codemirror/completions/datatype.completions.ts
Signals: N/A
Excerpt (<=80 chars): export function datatypeCompletions(context: CompletionContext): CompletionRe...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- datatypeCompletions
- sortCompletionsByInput
- natives
- extensions
- isInputData
- isItem
- isBinary
- getDetail
- toOptions
- variablesOptions
- responseOptions
- executionOptions
- customDataOptions
- nodeRefOptions
- inputOptions
- prevNodeOptions
- itemOptions
- binaryOptions
```

--------------------------------------------------------------------------------

---[FILE: dollar.completions.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/plugins/codemirror/completions/dollar.completions.ts
Signals: N/A
Excerpt (<=80 chars): export function dollarCompletions(context: CompletionContext): CompletionResu...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- dollarCompletions
- dollarOptions
```

--------------------------------------------------------------------------------

---[FILE: infoBoxRenderer.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/plugins/codemirror/completions/infoBoxRenderer.ts
Signals: N/A
Excerpt (<=80 chars):  export const createInfoBoxRenderer =

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createInfoBoxRenderer
```

--------------------------------------------------------------------------------

---[FILE: jsonField.completions.test.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/plugins/codemirror/completions/jsonField.completions.test.ts
Signals: N/A
Excerpt (<=80 chars):  export function completions(docWithCursor: string, explicit = false) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- completions
```

--------------------------------------------------------------------------------

---[FILE: nonDollar.completions.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/plugins/codemirror/completions/nonDollar.completions.ts
Signals: N/A
Excerpt (<=80 chars): export function nonDollarCompletions(context: CompletionContext): CompletionR...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- nonDollarCompletions
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/plugins/codemirror/completions/types.ts
Signals: N/A
Excerpt (<=80 chars):  export type Resolved = unknown;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Resolved
- ExtensionTypeName
- FnToDoc
- FunctionOptionType
- KeywordOptionType
- AutocompleteOptionType
- AutocompleteInput
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/plugins/codemirror/completions/utils.ts
Signals: N/A
Excerpt (<=80 chars): export function splitBaseTail(syntaxTree: Tree, userInput: string): [string, ...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- splitBaseTail
- expressionWithFirstItem
- longestCommonPrefix
- receivesNoBinaryData
- hasNoParams
- resolveAutocompleteExpression
- autocompletableNodeNames
- getPreviousNodes
- prefixMatch
- isPseudoParam
- isAllowedInDotNotation
- isCredentialsModalOpen
- isInHttpNodePagination
- hasActiveNode
- isSplitInBatchesAbsent
- stripExcessParens
- getDefaultArgs
- insertDefaultArgs
```

--------------------------------------------------------------------------------

---[FILE: mock.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/plugins/codemirror/completions/__tests__/mock.ts
Signals: N/A
Excerpt (<=80 chars):  export const mockProxy = dataProxy.getDataProxy();

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mockProxy
```

--------------------------------------------------------------------------------

---[FILE: InfoBoxTooltip.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/plugins/codemirror/tooltips/InfoBoxTooltip.ts
Signals: N/A
Excerpt (<=80 chars):  export const hoverTooltipSource = (view: EditorView, pos: number) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- hoverTooltipSource
- infoBoxTooltips
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/plugins/codemirror/typescript/types.ts
Signals: N/A
Excerpt (<=80 chars):  export interface HoverInfo {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkerInitOptions
- NodeData
- NodeDataFetcher
- LanguageServiceWorker
- LanguageServiceWorkerInit
- RemoteLanguageServiceWorkerInit
- HoverInfo
```

--------------------------------------------------------------------------------

---[FILE: completions.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/plugins/codemirror/typescript/client/completions.ts
Signals: N/A
Excerpt (<=80 chars):  export const matchText = (context: CompletionContext) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- matchText
```

--------------------------------------------------------------------------------

---[FILE: facet.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/plugins/codemirror/typescript/client/facet.ts
Signals: N/A
Excerpt (<=80 chars):  export const typescriptWorkerFacet = Facet.define<

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- typescriptWorkerFacet
```

--------------------------------------------------------------------------------

---[FILE: snippets.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/plugins/codemirror/typescript/client/snippets.ts
Signals: N/A
Excerpt (<=80 chars):  export const blockCommentSnippet = snippetCompletion('/**\n * #{}\n */', {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- blockCommentSnippet
- snippets
```

--------------------------------------------------------------------------------

---[FILE: useTypescript.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/plugins/codemirror/typescript/client/useTypescript.ts
Signals: N/A
Excerpt (<=80 chars):  export function useTypescript(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useTypescript
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/plugins/codemirror/typescript/worker/constants.ts
Signals: N/A
Excerpt (<=80 chars):  export const TS_COMPLETE_BLOCKLIST: ts.ScriptElementKind[] = [ts.ScriptEleme...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TYPESCRIPT_AUTOCOMPLETE_THRESHOLD
- TYPESCRIPT_FILES
- LUXON_VERSION
```

--------------------------------------------------------------------------------

---[FILE: dynamicTypes.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/plugins/codemirror/typescript/worker/dynamicTypes.ts
Signals: N/A
Excerpt (<=80 chars):  export function schemaToTypescriptTypes(schema: Schema, interfaceName: strin...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- schemaToTypescriptTypes
```

--------------------------------------------------------------------------------

---[FILE: env.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/plugins/codemirror/typescript/worker/env.ts
Signals: N/A
Excerpt (<=80 chars):  export function removeUnusedLibs(fsMap: Map<string, string>) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- removeUnusedLibs
```

--------------------------------------------------------------------------------

---[FILE: hoverTooltip.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/plugins/codemirror/typescript/worker/hoverTooltip.ts
Signals: N/A
Excerpt (<=80 chars):  export function getHoverTooltip({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getHoverTooltip
```

--------------------------------------------------------------------------------

---[FILE: linter.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/plugins/codemirror/typescript/worker/linter.ts
Signals: N/A
Excerpt (<=80 chars): export function tsCategoryToSeverity(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- tsCategoryToSeverity
- getDiagnostics
```

--------------------------------------------------------------------------------

---[FILE: npmTypesLoader.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/plugins/codemirror/typescript/worker/npmTypesLoader.ts
Signals: N/A
Excerpt (<=80 chars):  export const loadTypes = async (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- loadTypes
- loadTypesFileTree
- loadFileContent
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/plugins/codemirror/typescript/worker/utils.ts
Signals: N/A
Excerpt (<=80 chars):  export const fnPrefix = (mode: CodeExecutionMode) => `(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- wrapInFunction
- globalTypeDefinition
- returnTypeForMode
- bufferChangeSets
- fnPrefix
```

--------------------------------------------------------------------------------

---[FILE: useEnvFeatureFlag.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/envFeatureFlag/useEnvFeatureFlag.ts
Signals: N/A
Excerpt (<=80 chars):  export const useEnvFeatureFlag = () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useEnvFeatureFlag
```

--------------------------------------------------------------------------------

---[FILE: nodeCreator.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/nodeCreator/nodeCreator.store.ts
Signals: N/A
Excerpt (<=80 chars):  export const useNodeCreatorStore = defineStore(STORES.NODE_CREATOR, () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useNodeCreatorStore
```

--------------------------------------------------------------------------------

---[FILE: nodeCreator.utils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/nodeCreator/nodeCreator.utils.ts
Signals: N/A
Excerpt (<=80 chars):  export function transformNodeType(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- transformNodeType
- subcategorizeItems
- sortNodeCreateElements
- removeTrailingTrigger
- searchNodes
- flattenCreateElements
- isAINode
- groupItemsInSections
- finalizeItems
- prepareCommunityNodeDetailsViewStack
- getRagStarterCallout
- getPreBuiltAgentsCallout
- getPreBuiltAgentsCalloutWithDivider
- getAiTemplatesCallout
- getRootSearchCallouts
- getActiveViewCallouts
- getHumanInTheLoopActions
- formatTriggerActionName
```

--------------------------------------------------------------------------------

---[FILE: useActions.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/nodeCreator/composables/useActions.ts
Signals: N/A
Excerpt (<=80 chars):  export const useActions = () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useActions
```

--------------------------------------------------------------------------------

---[FILE: useActionsGeneration.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/nodeCreator/composables/useActionsGeneration.ts
Signals: N/A
Excerpt (<=80 chars):  export function useActionsGenerator() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useActionsGenerator
```

--------------------------------------------------------------------------------

---[FILE: useKeyboardNavigation.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/nodeCreator/composables/useKeyboardNavigation.ts
Signals: N/A
Excerpt (<=80 chars):  export type KeyboardKey = (typeof WATCHED_KEYS)[number];

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- KEYBOARD_ID_ATTR
- WATCHED_KEYS
- useKeyboardNavigation
- KeyboardKey
```

--------------------------------------------------------------------------------

---[FILE: useViewStacks.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/nodeCreator/composables/useViewStacks.ts
Signals: N/A
Excerpt (<=80 chars):  export type CommunityNodeDetails = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useViewStacks
- CommunityNodeDetails
- ViewStack
```

--------------------------------------------------------------------------------

---[FILE: viewsData.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/nodeCreator/views/viewsData.ts
Signals: N/A
Excerpt (<=80 chars):  export interface NodeViewItemSection {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AIView
- AINodesView
- TriggerView
- RegularView
- NodeViewItemSection
- NodeViewItem
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/nodeCreator/__tests__/utils.ts
Signals: N/A
Excerpt (<=80 chars):  export const mockSimplifiedNodeType = (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mockSimplifiedNodeType
- mockActionTypeDescription
- mockNodeCreateElement
- mockSubcategoryCreateElement
- mockSectionCreateElement
- mockViewCreateElement
- mockLabelCreateElement
- mockActionCreateElement
```

--------------------------------------------------------------------------------

---[FILE: tags.api.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/tags/tags.api.ts
Signals: N/A
Excerpt (<=80 chars):  export function createTagsApi(endpoint: TagsApiEndpoint) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createTagsApi
```

--------------------------------------------------------------------------------

---[FILE: tags.constants.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/tags/tags.constants.ts
Signals: N/A
Excerpt (<=80 chars): export const MAX_TAG_NAME_LENGTH = 24;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MAX_TAG_NAME_LENGTH
- TAGS_MANAGER_MODAL_KEY
- ANNOTATION_TAGS_MANAGER_MODAL_KEY
```

--------------------------------------------------------------------------------

---[FILE: tags.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/tags/tags.store.ts
Signals: N/A
Excerpt (<=80 chars):  export const useTagsStore = createTagsStore(STORES.TAGS);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useTagsStore
- useAnnotationTagsStore
```

--------------------------------------------------------------------------------

---[FILE: tags.types.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/tags/tags.types.ts
Signals: N/A
Excerpt (<=80 chars):  export interface ITagRow {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ITagRow
```

--------------------------------------------------------------------------------

---[FILE: canvas.eventBus.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/workflows/canvas/canvas.eventBus.ts
Signals: N/A
Excerpt (<=80 chars):  export const canvasEventBus = createEventBus<CanvasEventBusEvents>();

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- canvasEventBus
```

--------------------------------------------------------------------------------

---[FILE: canvas.types.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/workflows/canvas/canvas.types.ts
Signals: N/A
Excerpt (<=80 chars):  export const enum CanvasConnectionMode {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- canvasConnectionModes
- CanvasNodeDirtiness
- CanvasConnectionPort
- CanvasNodeDefaultRenderLabelSize
- CanvasNodeDirtinessType
- CanvasNodeDefaultRender
- CanvasNodeAddNodesRender
- CanvasNodeChoicePromptRender
- CanvasNodeStickyNoteRender
- CanvasNode
- CanvasConnection
- CanvasConnectionCreateData
- CanvasNodeEventBusEvents
- CanvasEventBusEvents
- ConnectStartEvent
- CanvasNodeMoveEvent
- ExecutionOutputMapData
- ExecutionOutputMap
```

--------------------------------------------------------------------------------

---[FILE: canvas.utils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/workflows/canvas/canvas.utils.ts
Signals: N/A
Excerpt (<=80 chars): export function mapLegacyConnectionsToCanvasConnections(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mapLegacyConnectionsToCanvasConnections
- mapLegacyConnectionToCanvasConnection
- parseCanvasConnectionHandleString
- createCanvasConnectionHandleString
- createCanvasConnectionId
- mapCanvasConnectionToLegacyConnection
- mapLegacyEndpointsToCanvasConnectionPort
- checkOverlap
- shouldIgnoreCanvasShortcut
```

--------------------------------------------------------------------------------

---[FILE: getEdgeRenderData.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/workflows/canvas/components/elements/edges/utils/getEdgeRenderData.ts
Signals: N/A
Excerpt (<=80 chars):  export function getEdgeRenderData(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getEdgeRenderData
```

--------------------------------------------------------------------------------

---[FILE: useCanvas.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/workflows/canvas/composables/useCanvas.ts
Signals: N/A
Excerpt (<=80 chars):  export function useCanvas() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useCanvas
```

--------------------------------------------------------------------------------

---[FILE: useCanvasLayout.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/workflows/canvas/composables/useCanvasLayout.ts
Signals: N/A
Excerpt (<=80 chars):  export type CanvasLayoutTarget = 'selection' | 'all';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useCanvasLayout
- CanvasLayoutTarget
- CanvasLayoutSource
- CanvasLayoutTargetData
- NodeLayoutResult
- CanvasLayoutResult
- CanvasLayoutEvent
- CanvasNodeDictionary
```

--------------------------------------------------------------------------------

---[FILE: useCanvasMapping.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/workflows/canvas/composables/useCanvasMapping.ts
Signals: N/A
Excerpt (<=80 chars):  export function useCanvasMapping({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useCanvasMapping
```

--------------------------------------------------------------------------------

---[FILE: useCanvasNode.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/workflows/canvas/composables/useCanvasNode.ts
Signals: N/A
Excerpt (<=80 chars):  export function useCanvasNode() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useCanvasNode
```

--------------------------------------------------------------------------------

---[FILE: useCanvasNodeHandle.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/workflows/canvas/composables/useCanvasNodeHandle.ts
Signals: N/A
Excerpt (<=80 chars):  export function useCanvasNodeHandle() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useCanvasNodeHandle
```

--------------------------------------------------------------------------------

---[FILE: useCanvasNodeHover.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/workflows/canvas/composables/useCanvasNodeHover.ts
Signals: N/A
Excerpt (<=80 chars): export function useCanvasNodeHover(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useCanvasNodeHover
```

--------------------------------------------------------------------------------

---[FILE: useCanvasTraversal.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/workflows/canvas/composables/useCanvasTraversal.ts
Signals: N/A
Excerpt (<=80 chars):  export function useCanvasTraversal({ getIncomers, getOutgoers }: VueFlowStor...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useCanvasTraversal
```

--------------------------------------------------------------------------------

---[FILE: useViewportAutoAdjust.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/workflows/canvas/composables/useViewportAutoAdjust.ts
Signals: N/A
Excerpt (<=80 chars): export function useViewportAutoAdjust(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useViewportAutoAdjust
```

--------------------------------------------------------------------------------

---[FILE: useZoomAdjustedValues.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/workflows/canvas/composables/useZoomAdjustedValues.ts
Signals: N/A
Excerpt (<=80 chars): export function useZoomAdjustedValues(viewport: Ref<ViewportTransform>) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useZoomAdjustedValues
```

--------------------------------------------------------------------------------

---[FILE: experimentalNdv.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/workflows/canvas/experimental/experimentalNdv.store.ts
Signals: N/A
Excerpt (<=80 chars):  export const useExperimentalNdvStore = defineStore('experimentalNdv', () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useExperimentalNdvStore
```

--------------------------------------------------------------------------------

---[FILE: experimentalNdv.utils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/workflows/canvas/experimental/experimentalNdv.utils.ts
Signals: N/A
Excerpt (<=80 chars):  export function getNodeSubTitleText(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getNodeSubTitleText
```

--------------------------------------------------------------------------------

---[FILE: useExpressionResolveCtx.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/workflows/canvas/experimental/composables/useExpressionResolveCtx.ts
Signals: N/A
Excerpt (<=80 chars):  export function useExpressionResolveCtx(node: ComputedRef<INodeUi | null | u...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useExpressionResolveCtx
```

--------------------------------------------------------------------------------

---[FILE: useIsInExperimentalNdv.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/workflows/canvas/experimental/composables/useIsInExperimentalNdv.ts
Signals: N/A
Excerpt (<=80 chars):  export function useIsInExperimentalNdv() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useIsInExperimentalNdv
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/workflows/canvas/__tests__/utils.ts
Signals: N/A
Excerpt (<=80 chars):  export function createCanvasNodeData({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createCanvasNodeData
- createCanvasNodeElement
- createCanvasGraphNode
- createCanvasNodeProps
- createCanvasProvide
- createCanvasNodeProvide
- createCanvasHandleProvide
- createCanvasConnection
- createCanvasGraphEdge
```

--------------------------------------------------------------------------------

---[FILE: useEmptyStateDetection.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/workflows/readyToRun/composables/useEmptyStateDetection.ts
Signals: N/A
Excerpt (<=80 chars): export function useEmptyStateDetection() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useEmptyStateDetection
```

--------------------------------------------------------------------------------

---[FILE: readyToRun.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/workflows/readyToRun/stores/readyToRun.store.ts
Signals: N/A
Excerpt (<=80 chars):  export const useReadyToRunStore = defineStore(STORES.READY_TO_RUN, () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useReadyToRunStore
```

--------------------------------------------------------------------------------

---[FILE: setupTemplate.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/workflows/templates/setupTemplate.store.ts
Signals: N/A
Excerpt (<=80 chars):  export type NodeAndType = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useSetupTemplateStore
- NodeAndType
- RequiredCredentials
- AppCredentialCount
```

--------------------------------------------------------------------------------

---[FILE: templates.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/workflows/templates/templates.store.ts
Signals: N/A
Excerpt (<=80 chars):  export interface ITemplateState {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useTemplatesStore
- TemplatesStore
- ITemplateState
```

--------------------------------------------------------------------------------

````
