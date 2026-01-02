---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 446
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 446 of 552)

````text
================================================================================
FULLSTACK USER CREATED CODE DATABASE (VERBATIM) - vscode-main
================================================================================
Generated: December 18, 2025
Source: user_created_projects/vscode-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: src/vs/workbench/contrib/search/browser/search.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/browser/search.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import * as platform from '../../../../base/common/platform.js';
import { AbstractGotoLineQuickAccessProvider } from '../../../../editor/contrib/quickAccess/browser/gotoLineQuickAccess.js';
import * as nls from '../../../../nls.js';
import { ConfigurationScope, Extensions as ConfigurationExtensions, IConfigurationRegistry } from '../../../../platform/configuration/common/configurationRegistry.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { Extensions as QuickAccessExtensions, IQuickAccessRegistry } from '../../../../platform/quickinput/common/quickAccess.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { ViewPaneContainer } from '../../../browser/parts/views/viewPaneContainer.js';
import { defaultQuickAccessContextKeyValue } from '../../../browser/quickaccess.js';
import { Extensions as ViewExtensions, IViewContainersRegistry, IViewDescriptor, IViewsRegistry, ViewContainerLocation } from '../../../common/views.js';
import { GotoSymbolQuickAccessProvider } from '../../codeEditor/browser/quickaccess/gotoSymbolQuickAccess.js';
import { AnythingQuickAccessProvider } from './anythingQuickAccess.js';
import { registerContributions as replaceContributions } from './replaceContributions.js';
import { registerContributions as notebookSearchContributions } from './notebookSearch/notebookSearchContributions.js';
import { searchViewIcon } from './searchIcons.js';
import { SearchView } from './searchView.js';
import { registerContributions as searchWidgetContributions } from './searchWidget.js';
import { SymbolsQuickAccessProvider } from './symbolsQuickAccess.js';
import { ISearchHistoryService, SearchHistoryService } from '../common/searchHistoryService.js';
import { SearchViewModelWorkbenchService } from './searchTreeModel/searchModel.js';
import { ISearchViewModelWorkbenchService } from './searchTreeModel/searchViewModelWorkbenchService.js';
import { SearchSortOrder, SEARCH_EXCLUDE_CONFIG, VIEWLET_ID, ViewMode, VIEW_ID, DEFAULT_MAX_SEARCH_RESULTS, SemanticSearchBehavior } from '../../../services/search/common/search.js';
import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { assertType } from '../../../../base/common/types.js';
import { getWorkspaceSymbols, IWorkspaceSymbol } from '../common/search.js';
import * as Constants from '../common/constants.js';
import { SearchChatContextContribution } from './searchChatContext.js';

import './searchActionsCopy.js';
import './searchActionsFind.js';
import './searchActionsNav.js';
import './searchActionsRemoveReplace.js';
import './searchActionsSymbol.js';
import './searchActionsTopBar.js';
import './searchActionsTextQuickAccess.js';
import { TEXT_SEARCH_QUICK_ACCESS_PREFIX, TextSearchQuickAccess } from './quickTextSearch/textSearchQuickAccess.js';
import { Extensions, IConfigurationMigrationRegistry } from '../../../common/configuration.js';
import { registerWorkbenchContribution2, WorkbenchPhase } from '../../../common/contributions.js';

registerSingleton(ISearchViewModelWorkbenchService, SearchViewModelWorkbenchService, InstantiationType.Delayed);
registerSingleton(ISearchHistoryService, SearchHistoryService, InstantiationType.Delayed);

replaceContributions();
notebookSearchContributions();
searchWidgetContributions();

registerWorkbenchContribution2(SearchChatContextContribution.ID, SearchChatContextContribution, WorkbenchPhase.AfterRestored);

const SEARCH_MODE_CONFIG = 'search.mode';

const viewContainer = Registry.as<IViewContainersRegistry>(ViewExtensions.ViewContainersRegistry).registerViewContainer({
	id: VIEWLET_ID,
	title: nls.localize2('search', "Search"),
	ctorDescriptor: new SyncDescriptor(ViewPaneContainer, [VIEWLET_ID, { mergeViewWithContainerWhenSingleView: true }]),
	hideIfEmpty: true,
	icon: searchViewIcon,
	order: 1,
}, ViewContainerLocation.Sidebar, { doNotRegisterOpenCommand: true });

const viewDescriptor: IViewDescriptor = {
	id: VIEW_ID,
	containerIcon: searchViewIcon,
	name: nls.localize2('search', "Search"),
	ctorDescriptor: new SyncDescriptor(SearchView),
	canToggleVisibility: false,
	canMoveView: true,
	openCommandActionDescriptor: {
		id: viewContainer.id,
		mnemonicTitle: nls.localize({ key: 'miViewSearch', comment: ['&& denotes a mnemonic'] }, "&&Search"),
		keybindings: {
			primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyF,
			// Yes, this is weird. See #116188, #115556, #115511, and now #124146, for examples of what can go wrong here.
			when: ContextKeyExpr.regex('neverMatch', /doesNotMatch/)
		},
		order: 1
	}
};

// Register search default location to sidebar
Registry.as<IViewsRegistry>(ViewExtensions.ViewsRegistry).registerViews([viewDescriptor], viewContainer);

// Register Quick Access Handler
const quickAccessRegistry = Registry.as<IQuickAccessRegistry>(QuickAccessExtensions.Quickaccess);

quickAccessRegistry.registerQuickAccessProvider({
	ctor: AnythingQuickAccessProvider,
	prefix: AnythingQuickAccessProvider.PREFIX,
	placeholder: nls.localize('anythingQuickAccessPlaceholder', "Search files by name (append {0} to go to line or {1} to go to symbol)", AbstractGotoLineQuickAccessProvider.GO_TO_LINE_PREFIX, GotoSymbolQuickAccessProvider.PREFIX),
	contextKey: defaultQuickAccessContextKeyValue,
	helpEntries: [{
		description: nls.localize('anythingQuickAccess', "Go to File"),
		commandId: 'workbench.action.quickOpen',
		commandCenterOrder: 10
	}]
});

quickAccessRegistry.registerQuickAccessProvider({
	ctor: SymbolsQuickAccessProvider,
	prefix: SymbolsQuickAccessProvider.PREFIX,
	placeholder: nls.localize('symbolsQuickAccessPlaceholder', "Type the name of a symbol to open."),
	contextKey: 'inWorkspaceSymbolsPicker',
	helpEntries: [{ description: nls.localize('symbolsQuickAccess', "Go to Symbol in Workspace"), commandId: Constants.SearchCommandIds.ShowAllSymbolsActionId }]
});

quickAccessRegistry.registerQuickAccessProvider({
	ctor: TextSearchQuickAccess,
	prefix: TEXT_SEARCH_QUICK_ACCESS_PREFIX,
	contextKey: 'inTextSearchPicker',
	placeholder: nls.localize('textSearchPickerPlaceholder', "Search for text in your workspace files."),
	helpEntries: [
		{
			description: nls.localize('textSearchPickerHelp', "Search for Text"),
			commandId: Constants.SearchCommandIds.QuickTextSearchActionId,
			commandCenterOrder: 25,
		}
	]
});

// Configuration
const configurationRegistry = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration);
configurationRegistry.registerConfiguration({
	id: 'search',
	order: 13,
	title: nls.localize('searchConfigurationTitle', "Search"),
	type: 'object',
	properties: {
		[SEARCH_EXCLUDE_CONFIG]: {
			type: 'object',
			markdownDescription: nls.localize('exclude', "Configure [glob patterns](https://code.visualstudio.com/docs/editor/codebasics#_advanced-search-options) for excluding files and folders in fulltext searches and file search in quick open. To exclude files from the recently opened list in quick open, patterns must be absolute (for example `**/node_modules/**`). Inherits all glob patterns from the `#files.exclude#` setting."),
			default: { '**/node_modules': true, '**/bower_components': true, '**/*.code-search': true },
			additionalProperties: {
				anyOf: [
					{
						type: 'boolean',
						description: nls.localize('exclude.boolean', "The glob pattern to match file paths against. Set to true or false to enable or disable the pattern."),
					},
					{
						type: 'object',
						properties: {
							when: {
								type: 'string', // expression ({ "**/*.js": { "when": "$(basename).js" } })
								pattern: '\\w*\\$\\(basename\\)\\w*',
								default: '$(basename).ext',
								markdownDescription: nls.localize({ key: 'exclude.when', comment: ['\\$(basename) should not be translated'] }, 'Additional check on the siblings of a matching file. Use \\$(basename) as variable for the matching file name.')
							}
						}
					}
				]
			},
			scope: ConfigurationScope.RESOURCE
		},
		[SEARCH_MODE_CONFIG]: {
			type: 'string',
			enum: ['view', 'reuseEditor', 'newEditor'],
			default: 'view',
			markdownDescription: nls.localize('search.mode', "Controls where new `Search: Find in Files` and `Find in Folder` operations occur: either in the Search view, or in a search editor."),
			enumDescriptions: [
				nls.localize('search.mode.view', "Search in the Search view, either in the panel or side bars."),
				nls.localize('search.mode.reuseEditor', "Search in an existing search editor if present, otherwise in a new search editor."),
				nls.localize('search.mode.newEditor', "Search in a new search editor."),
			]
		},
		'search.useRipgrep': {
			type: 'boolean',
			description: nls.localize('useRipgrep', "This setting is deprecated and now falls back on \"search.usePCRE2\"."),
			deprecationMessage: nls.localize('useRipgrepDeprecated', "Deprecated. Consider \"search.usePCRE2\" for advanced regex feature support."),
			default: true
		},
		'search.maintainFileSearchCache': {
			type: 'boolean',
			deprecationMessage: nls.localize('maintainFileSearchCacheDeprecated', "The search cache is kept in the extension host which never shuts down, so this setting is no longer needed."),
			description: nls.localize('search.maintainFileSearchCache', "When enabled, the searchService process will be kept alive instead of being shut down after an hour of inactivity. This will keep the file search cache in memory."),
			default: false
		},
		'search.useIgnoreFiles': {
			type: 'boolean',
			markdownDescription: nls.localize('useIgnoreFiles', "Controls whether to use `.gitignore` and `.ignore` files when searching for files."),
			default: true,
			scope: ConfigurationScope.RESOURCE
		},
		'search.useGlobalIgnoreFiles': {
			type: 'boolean',
			markdownDescription: nls.localize('useGlobalIgnoreFiles', "Controls whether to use your global gitignore file (for example, from `$HOME/.config/git/ignore`) when searching for files. Requires {0} to be enabled.", '`#search.useIgnoreFiles#`'),
			default: false,
			scope: ConfigurationScope.RESOURCE
		},
		'search.useParentIgnoreFiles': {
			type: 'boolean',
			markdownDescription: nls.localize('useParentIgnoreFiles', "Controls whether to use `.gitignore` and `.ignore` files in parent directories when searching for files. Requires {0} to be enabled.", '`#search.useIgnoreFiles#`'),
			default: false,
			scope: ConfigurationScope.RESOURCE
		},
		'search.quickOpen.includeSymbols': {
			type: 'boolean',
			description: nls.localize('search.quickOpen.includeSymbols', "Whether to include results from a global symbol search in the file results for Quick Open."),
			default: false
		},
		'search.ripgrep.maxThreads': {
			type: 'number',
			description: nls.localize('search.ripgrep.maxThreads', "Number of threads to use for searching. When set to 0, the engine automatically determines this value."),
			default: 0
		},
		'search.quickOpen.includeHistory': {
			type: 'boolean',
			description: nls.localize('search.quickOpen.includeHistory', "Whether to include results from recently opened files in the file results for Quick Open."),
			default: true
		},
		'search.quickOpen.history.filterSortOrder': {
			type: 'string',
			enum: ['default', 'recency'],
			default: 'default',
			enumDescriptions: [
				nls.localize('filterSortOrder.default', 'History entries are sorted by relevance based on the filter value used. More relevant entries appear first.'),
				nls.localize('filterSortOrder.recency', 'History entries are sorted by recency. More recently opened entries appear first.')
			],
			description: nls.localize('filterSortOrder', "Controls sorting order of editor history in quick open when filtering.")
		},
		'search.followSymlinks': {
			type: 'boolean',
			description: nls.localize('search.followSymlinks', "Controls whether to follow symlinks while searching."),
			default: true
		},
		'search.smartCase': {
			type: 'boolean',
			description: nls.localize('search.smartCase', "Search case-insensitively if the pattern is all lowercase, otherwise, search case-sensitively."),
			default: false
		},
		'search.globalFindClipboard': {
			type: 'boolean',
			default: false,
			description: nls.localize('search.globalFindClipboard', "Controls whether the Search view should read or modify the shared find clipboard on macOS."),
			included: platform.isMacintosh
		},
		'search.location': {
			type: 'string',
			enum: ['sidebar', 'panel'],
			default: 'sidebar',
			description: nls.localize('search.location', "Controls whether the search will be shown as a view in the sidebar or as a panel in the panel area for more horizontal space."),
			deprecationMessage: nls.localize('search.location.deprecationMessage', "This setting is deprecated. You can drag the search icon to a new location instead.")
		},
		'search.maxResults': {
			type: ['number', 'null'],
			default: DEFAULT_MAX_SEARCH_RESULTS,
			markdownDescription: nls.localize('search.maxResults', "Controls the maximum number of search results, this can be set to `null` (empty) to return unlimited results.")
		},
		'search.collapseResults': {
			type: 'string',
			enum: ['auto', 'alwaysCollapse', 'alwaysExpand'],
			enumDescriptions: [
				nls.localize('search.collapseResults.auto', "Files with less than 10 results are expanded. Others are collapsed."),
				'',
				''
			],
			default: 'alwaysExpand',
			description: nls.localize('search.collapseAllResults', "Controls whether the search results will be collapsed or expanded."),
		},
		'search.useReplacePreview': {
			type: 'boolean',
			default: true,
			description: nls.localize('search.useReplacePreview', "Controls whether to open Replace Preview when selecting or replacing a match."),
		},
		'search.showLineNumbers': {
			type: 'boolean',
			default: false,
			description: nls.localize('search.showLineNumbers', "Controls whether to show line numbers for search results."),
		},
		'search.usePCRE2': {
			type: 'boolean',
			default: false,
			description: nls.localize('search.usePCRE2', "Whether to use the PCRE2 regex engine in text search. This enables using some advanced regex features like lookahead and backreferences. However, not all PCRE2 features are supported - only features that are also supported by JavaScript."),
			deprecationMessage: nls.localize('usePCRE2Deprecated', "Deprecated. PCRE2 will be used automatically when using regex features that are only supported by PCRE2."),
		},
		'search.actionsPosition': {
			type: 'string',
			enum: ['auto', 'right'],
			enumDescriptions: [
				nls.localize('search.actionsPositionAuto', "Position the actionbar to the right when the Search view is narrow, and immediately after the content when the Search view is wide."),
				nls.localize('search.actionsPositionRight', "Always position the actionbar to the right."),
			],
			default: 'right',
			description: nls.localize('search.actionsPosition', "Controls the positioning of the actionbar on rows in the Search view.")
		},
		'search.searchOnType': {
			type: 'boolean',
			default: true,
			description: nls.localize('search.searchOnType', "Search all files as you type.")
		},
		'search.seedWithNearestWord': {
			type: 'boolean',
			default: false,
			description: nls.localize('search.seedWithNearestWord', "Enable seeding search from the word nearest the cursor when the active editor has no selection.")
		},
		'search.seedOnFocus': {
			type: 'boolean',
			default: false,
			markdownDescription: nls.localize('search.seedOnFocus', "Update the search query to the editor's selected text when focusing the Search view. This happens either on click or when triggering the `workbench.views.search.focus` command.")
		},
		'search.searchOnTypeDebouncePeriod': {
			type: 'number',
			default: 300,
			markdownDescription: nls.localize('search.searchOnTypeDebouncePeriod', "When {0} is enabled, controls the timeout in milliseconds between a character being typed and the search starting. Has no effect when {0} is disabled.", '`#search.searchOnType#`')
		},
		'search.searchEditor.doubleClickBehaviour': {
			type: 'string',
			enum: ['selectWord', 'goToLocation', 'openLocationToSide'],
			default: 'goToLocation',
			enumDescriptions: [
				nls.localize('search.searchEditor.doubleClickBehaviour.selectWord', "Double-clicking selects the word under the cursor."),
				nls.localize('search.searchEditor.doubleClickBehaviour.goToLocation', "Double-clicking opens the result in the active editor group."),
				nls.localize('search.searchEditor.doubleClickBehaviour.openLocationToSide', "Double-clicking opens the result in the editor group to the side, creating one if it does not yet exist."),
			],
			markdownDescription: nls.localize('search.searchEditor.doubleClickBehaviour', "Configure effect of double-clicking a result in a search editor.")
		},
		'search.searchEditor.singleClickBehaviour': {
			type: 'string',
			enum: ['default', 'peekDefinition',],
			default: 'default',
			enumDescriptions: [
				nls.localize('search.searchEditor.singleClickBehaviour.default', "Single-clicking does nothing."),
				nls.localize('search.searchEditor.singleClickBehaviour.peekDefinition', "Single-clicking opens a Peek Definition window."),
			],
			markdownDescription: nls.localize('search.searchEditor.singleClickBehaviour', "Configure effect of single-clicking a result in a search editor.")
		},
		'search.searchEditor.reusePriorSearchConfiguration': {
			type: 'boolean',
			default: false,
			markdownDescription: nls.localize({ key: 'search.searchEditor.reusePriorSearchConfiguration', comment: ['"Search Editor" is a type of editor that can display search results. "includes, excludes, and flags" refers to the "files to include" and "files to exclude" input boxes, and the flags that control whether a query is case-sensitive or a regex.'] }, "When enabled, new Search Editors will reuse the includes, excludes, and flags of the previously opened Search Editor.")
		},
		'search.searchEditor.defaultNumberOfContextLines': {
			type: ['number', 'null'],
			default: 1,
			markdownDescription: nls.localize('search.searchEditor.defaultNumberOfContextLines', "The default number of surrounding context lines to use when creating new Search Editors. If using `#search.searchEditor.reusePriorSearchConfiguration#`, this can be set to `null` (empty) to use the prior Search Editor's configuration.")
		},
		'search.searchEditor.focusResultsOnSearch': {
			type: 'boolean',
			default: false,
			markdownDescription: nls.localize('search.searchEditor.focusResultsOnSearch', "When a search is triggered, focus the Search Editor results instead of the Search Editor input.")
		},
		'search.sortOrder': {
			type: 'string',
			enum: [SearchSortOrder.Default, SearchSortOrder.FileNames, SearchSortOrder.Type, SearchSortOrder.Modified, SearchSortOrder.CountDescending, SearchSortOrder.CountAscending],
			default: SearchSortOrder.Default,
			enumDescriptions: [
				nls.localize('searchSortOrder.default', "Results are sorted by folder and file names, in alphabetical order."),
				nls.localize('searchSortOrder.filesOnly', "Results are sorted by file names ignoring folder order, in alphabetical order."),
				nls.localize('searchSortOrder.type', "Results are sorted by file extensions, in alphabetical order."),
				nls.localize('searchSortOrder.modified', "Results are sorted by file last modified date, in descending order."),
				nls.localize('searchSortOrder.countDescending', "Results are sorted by count per file, in descending order."),
				nls.localize('searchSortOrder.countAscending', "Results are sorted by count per file, in ascending order.")
			],
			description: nls.localize('search.sortOrder', "Controls sorting order of search results.")
		},
		'search.decorations.colors': {
			type: 'boolean',
			description: nls.localize('search.decorations.colors', "Controls whether search file decorations should use colors."),
			default: true
		},
		'search.decorations.badges': {
			type: 'boolean',
			description: nls.localize('search.decorations.badges', "Controls whether search file decorations should use badges."),
			default: true
		},
		'search.defaultViewMode': {
			type: 'string',
			enum: [ViewMode.Tree, ViewMode.List],
			default: ViewMode.List,
			enumDescriptions: [
				nls.localize('scm.defaultViewMode.tree', "Shows search results as a tree."),
				nls.localize('scm.defaultViewMode.list', "Shows search results as a list.")
			],
			description: nls.localize('search.defaultViewMode', "Controls the default search result view mode.")
		},
		'search.quickAccess.preserveInput': {
			type: 'boolean',
			description: nls.localize('search.quickAccess.preserveInput', "Controls whether the last typed input to Quick Search should be restored when opening it the next time."),
			default: false
		},
		'search.experimental.closedNotebookRichContentResults': {
			type: 'boolean',
			description: nls.localize('search.experimental.closedNotebookResults', "Show notebook editor rich content results for closed notebooks. Please refresh your search results after changing this setting."),
			default: false
		},
		'search.searchView.semanticSearchBehavior': {
			type: 'string',
			description: nls.localize('search.searchView.semanticSearchBehavior', "Controls the behavior of the semantic search results displayed in the Search view."),
			enum: [SemanticSearchBehavior.Manual, SemanticSearchBehavior.RunOnEmpty, SemanticSearchBehavior.Auto],
			default: SemanticSearchBehavior.Manual,
			enumDescriptions: [
				nls.localize('search.searchView.semanticSearchBehavior.manual', "Only request semantic search results manually."),
				nls.localize('search.searchView.semanticSearchBehavior.runOnEmpty', "Request semantic results automatically only when text search results are empty."),
				nls.localize('search.searchView.semanticSearchBehavior.auto', "Request semantic results automatically with every search.")
			],
			tags: ['preview'],
		},
		'search.searchView.keywordSuggestions': {
			type: 'boolean',
			description: nls.localize('search.searchView.keywordSuggestions', "Enable keyword suggestions in the Search view."),
			default: false,
			tags: ['preview'],
		},
	}
});

CommandsRegistry.registerCommand('_executeWorkspaceSymbolProvider', async function (accessor, ...args): Promise<IWorkspaceSymbol[]> {
	const [query] = args;
	assertType(typeof query === 'string');
	const result = await getWorkspaceSymbols(query);
	return result.map(item => item.symbol);
});

// todo: @andreamah get rid of this after a few iterations
Registry.as<IConfigurationMigrationRegistry>(Extensions.ConfigurationMigration)
	.registerConfigurationMigrations([{
		key: 'search.experimental.quickAccess.preserveInput',
		migrateFn: (value, _accessor) => ([
			['search.quickAccess.preserveInput', { value }],
			['search.experimental.quickAccess.preserveInput', { value: undefined }]
		])
	}]);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/browser/searchActionsBase.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/browser/searchActionsBase.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from '../../../../base/browser/dom.js';
import { ResolvedKeybinding } from '../../../../base/common/keybindings.js';
import * as nls from '../../../../nls.js';
import { WorkbenchCompressibleAsyncDataTree } from '../../../../platform/list/browser/listService.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { SearchView } from './searchView.js';
import { ISearchConfigurationProperties, VIEW_ID } from '../../../services/search/common/search.js';
import { isSearchTreeMatch, RenderableMatch, ISearchResult, isSearchTreeFileMatch, isSearchTreeFolderMatch } from './searchTreeModel/searchTreeCommon.js';
import { searchComparer } from './searchCompare.js';

export const category = nls.localize2('search', "Search");

export function isSearchViewFocused(viewsService: IViewsService): boolean {
	const searchView = getSearchView(viewsService);
	return !!(searchView && DOM.isAncestorOfActiveElement(searchView.getContainer()));
}

export function appendKeyBindingLabel(label: string, inputKeyBinding: ResolvedKeybinding | undefined): string {
	return doAppendKeyBindingLabel(label, inputKeyBinding);
}

export function getSearchView(viewsService: IViewsService): SearchView | undefined {
	return viewsService.getActiveViewWithId(VIEW_ID) as SearchView;
}

export function getElementsToOperateOn(viewer: WorkbenchCompressibleAsyncDataTree<ISearchResult, RenderableMatch, void>, currElement: RenderableMatch | undefined, sortConfig: ISearchConfigurationProperties): RenderableMatch[] {
	let elements: RenderableMatch[] = viewer.getSelection().filter((x): x is RenderableMatch => x !== null).sort((a, b) => searchComparer(a, b, sortConfig.sortOrder));

	// if selection doesn't include multiple elements, just return current focus element.
	if (currElement && !(elements.length > 1 && elements.includes(currElement))) {
		elements = [currElement];
	}

	return elements;
}

/**
 * @param elements elements that are going to be removed
 * @param focusElement element that is focused
 * @returns whether we need to re-focus on a remove
 */
export function shouldRefocus(elements: RenderableMatch[], focusElement: RenderableMatch | undefined) {
	if (!focusElement) {
		return false;
	}
	return !focusElement || elements.includes(focusElement) || hasDownstreamMatch(elements, focusElement);
}

function hasDownstreamMatch(elements: RenderableMatch[], focusElement: RenderableMatch) {
	for (const elem of elements) {
		if ((isSearchTreeFileMatch(elem) && isSearchTreeMatch(focusElement) && elem.matches().includes(focusElement)) ||
			(isSearchTreeFolderMatch(elem) && (
				(isSearchTreeFileMatch(focusElement) && elem.getDownstreamFileMatch(focusElement.resource)) ||
				(isSearchTreeMatch(focusElement) && elem.getDownstreamFileMatch(focusElement.parent().resource))
			))) {
			return true;
		}
	}
	return false;

}

export function openSearchView(viewsService: IViewsService, focus?: boolean): Promise<SearchView | undefined> {
	return viewsService.openView(VIEW_ID, focus).then(view => (view as SearchView ?? undefined));
}

function doAppendKeyBindingLabel(label: string, keyBinding: ResolvedKeybinding | undefined): string {
	return keyBinding ? label + ' (' + keyBinding.getLabel() + ')' : label;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/browser/searchActionsCopy.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/browser/searchActionsCopy.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as nls from '../../../../nls.js';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import * as Constants from '../common/constants.js';
import { Action2, MenuId, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { category, getSearchView } from './searchActionsBase.js';
import { isWindows } from '../../../../base/common/platform.js';
import { searchMatchComparer } from './searchCompare.js';
import { RenderableMatch, ISearchTreeMatch, isSearchTreeMatch, ISearchTreeFileMatch, ISearchTreeFolderMatch, ISearchTreeFolderMatchWithResource, isSearchTreeFileMatch, isSearchTreeFolderMatch, isSearchTreeFolderMatchWithResource } from './searchTreeModel/searchTreeCommon.js';

//#region Actions
registerAction2(class CopyMatchCommandAction extends Action2 {

	constructor(
	) {
		super({
			id: Constants.SearchCommandIds.CopyMatchCommandId,
			title: nls.localize2('copyMatchLabel', "Copy"),
			category,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				when: Constants.SearchContext.FileMatchOrMatchFocusKey,
				primary: KeyMod.CtrlCmd | KeyCode.KeyC,
			},
			menu: [{
				id: MenuId.SearchContext,
				when: Constants.SearchContext.FileMatchOrMatchFocusKey,
				group: 'search_2',
				order: 1
			}]
		});

	}

	override async run(accessor: ServicesAccessor, match: RenderableMatch | undefined): Promise<any> {
		await copyMatchCommand(accessor, match);
	}
});

registerAction2(class CopyPathCommandAction extends Action2 {

	constructor(
	) {
		super({
			id: Constants.SearchCommandIds.CopyPathCommandId,
			title: nls.localize2('copyPathLabel', "Copy Path"),
			category,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				when: Constants.SearchContext.FileMatchOrFolderMatchWithResourceFocusKey,
				primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KeyC,
				win: {
					primary: KeyMod.Shift | KeyMod.Alt | KeyCode.KeyC
				},
			},
			menu: [{
				id: MenuId.SearchContext,
				when: Constants.SearchContext.FileMatchOrFolderMatchWithResourceFocusKey,
				group: 'search_2',
				order: 2
			}]
		});

	}

	override async run(accessor: ServicesAccessor, fileMatch: ISearchTreeFileMatch | ISearchTreeFolderMatchWithResource | undefined): Promise<any> {
		await copyPathCommand(accessor, fileMatch);
	}
});

registerAction2(class CopyAllCommandAction extends Action2 {

	constructor(
	) {
		super({
			id: Constants.SearchCommandIds.CopyAllCommandId,
			title: nls.localize2('copyAllLabel', "Copy All"),
			category,
			menu: [{
				id: MenuId.SearchContext,
				when: Constants.SearchContext.HasSearchResults,
				group: 'search_2',
				order: 3
			}]
		});

	}

	override async run(accessor: ServicesAccessor): Promise<any> {
		await copyAllCommand(accessor);
	}
});

registerAction2(class GetSearchResultsAction extends Action2 {
	constructor() {
		super({
			id: Constants.SearchCommandIds.GetSearchResultsActionId,
			title: nls.localize2('getSearchResultsLabel', "Get Search Results"),
			category,
			f1: false
		});
	}

	override async run(accessor: ServicesAccessor): Promise<any> {
		const viewsService = accessor.get(IViewsService);
		const labelService = accessor.get(ILabelService);

		const searchView = getSearchView(viewsService);
		if (searchView) {
			const root = searchView.searchResult;
			const textSearchResult = allFolderMatchesToString(root.folderMatches(), labelService);
			const aiSearchResult = allFolderMatchesToString(root.folderMatches(true), labelService);

			const text = `${textSearchResult}${lineDelimiter}${lineDelimiter}${aiSearchResult}`;

			return text;
		}

		return undefined;
	}
});

//#endregion

//#region Helpers
export const lineDelimiter = isWindows ? '\r\n' : '\n';

async function copyPathCommand(accessor: ServicesAccessor, fileMatch: ISearchTreeFileMatch | ISearchTreeFolderMatchWithResource | undefined) {
	if (!fileMatch) {
		const selection = getSelectedRow(accessor);
		if (!isSearchTreeFileMatch(selection) || isSearchTreeFolderMatchWithResource(selection)) {
			return;
		}

		fileMatch = selection;
	}

	const clipboardService = accessor.get(IClipboardService);
	const labelService = accessor.get(ILabelService);

	const text = labelService.getUriLabel(fileMatch.resource, { noPrefix: true });
	await clipboardService.writeText(text);
}

async function copyMatchCommand(accessor: ServicesAccessor, match: RenderableMatch | undefined) {
	if (!match) {
		const selection = getSelectedRow(accessor);
		if (!selection) {
			return;
		}

		match = selection;
	}

	const clipboardService = accessor.get(IClipboardService);
	const labelService = accessor.get(ILabelService);

	let text: string | undefined;
	if (isSearchTreeMatch(match)) {
		text = matchToString(match);
	} else if (isSearchTreeFileMatch(match)) {
		text = fileMatchToString(match, labelService).text;
	} else if (isSearchTreeFolderMatch(match)) {
		text = folderMatchToString(match, labelService).text;
	}

	if (text) {
		await clipboardService.writeText(text);
	}
}

async function copyAllCommand(accessor: ServicesAccessor) {
	const viewsService = accessor.get(IViewsService);
	const clipboardService = accessor.get(IClipboardService);
	const labelService = accessor.get(ILabelService);

	const searchView = getSearchView(viewsService);
	if (searchView) {
		const root = searchView.searchResult;

		const text = allFolderMatchesToString(root.folderMatches(), labelService);
		await clipboardService.writeText(text);
	}
}

function matchToString(match: ISearchTreeMatch, indent = 0): string {
	const getFirstLinePrefix = () => `${match.range().startLineNumber},${match.range().startColumn}`;
	const getOtherLinePrefix = (i: number) => match.range().startLineNumber + i + '';

	const fullMatchLines = match.fullPreviewLines();
	const largestPrefixSize = fullMatchLines.reduce((largest, _, i) => {
		const thisSize = i === 0 ?
			getFirstLinePrefix().length :
			getOtherLinePrefix(i).length;

		return Math.max(thisSize, largest);
	}, 0);

	const formattedLines = fullMatchLines
		.map((line, i) => {
			const prefix = i === 0 ?
				getFirstLinePrefix() :
				getOtherLinePrefix(i);

			const paddingStr = ' '.repeat(largestPrefixSize - prefix.length);
			const indentStr = ' '.repeat(indent);
			return `${indentStr}${prefix}: ${paddingStr}${line}`;
		});

	return formattedLines.join('\n');
}

function fileFolderMatchToString(match: ISearchTreeFileMatch | ISearchTreeFolderMatch | ISearchTreeFolderMatchWithResource, labelService: ILabelService): { text: string; count: number } {
	if (isSearchTreeFileMatch(match)) {
		return fileMatchToString(match, labelService);
	} else {
		return folderMatchToString(match, labelService);
	}
}

function fileMatchToString(fileMatch: ISearchTreeFileMatch, labelService: ILabelService): { text: string; count: number } {
	const matchTextRows = fileMatch.matches()
		.sort(searchMatchComparer)
		.map(match => matchToString(match, 2));
	const uriString = labelService.getUriLabel(fileMatch.resource, { noPrefix: true });
	return {
		text: `${uriString}${lineDelimiter}${matchTextRows.join(lineDelimiter)}`,
		count: matchTextRows.length
	};
}

function folderMatchToString(folderMatch: ISearchTreeFolderMatchWithResource | ISearchTreeFolderMatch, labelService: ILabelService): { text: string; count: number } {
	const results: string[] = [];
	let numMatches = 0;

	const matches = folderMatch.matches().sort(searchMatchComparer);

	matches.forEach(match => {
		const result = fileFolderMatchToString(match, labelService);
		numMatches += result.count;
		results.push(result.text);
	});

	return {
		text: results.join(lineDelimiter + lineDelimiter),
		count: numMatches
	};
}

function allFolderMatchesToString(folderMatches: Array<ISearchTreeFolderMatchWithResource | ISearchTreeFolderMatch>, labelService: ILabelService): string {
	const folderResults: string[] = [];
	folderMatches = folderMatches.sort(searchMatchComparer);
	for (let i = 0; i < folderMatches.length; i++) {
		const folderResult = folderMatchToString(folderMatches[i], labelService);
		if (folderResult.count) {
			folderResults.push(folderResult.text);
		}
	}

	return folderResults.join(lineDelimiter + lineDelimiter);
}

function getSelectedRow(accessor: ServicesAccessor): RenderableMatch | undefined | null {
	const viewsService = accessor.get(IViewsService);
	const searchView = getSearchView(viewsService);
	return searchView?.getControl().getSelection()[0];
}

//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/browser/searchActionsFind.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/browser/searchActionsFind.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { dirname } from '../../../../base/common/resources.js';
import * as nls from '../../../../nls.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IListService, WorkbenchCompressibleAsyncDataTree } from '../../../../platform/list/browser/listService.js';
import { ViewContainerLocation } from '../../../common/views.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import * as Constants from '../common/constants.js';
import * as SearchEditorConstants from '../../searchEditor/browser/constants.js';
import { OpenSearchEditorArgs } from '../../searchEditor/browser/searchEditor.contribution.js';
import { ISearchConfiguration, ISearchConfigurationProperties } from '../../../services/search/common/search.js';
import { URI } from '../../../../base/common/uri.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { Action2, MenuId, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { resolveResourcesForSearchIncludes } from '../../../services/search/common/queryBuilder.js';
import { getMultiSelectedResources, IExplorerService } from '../../files/browser/files.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { ExplorerFolderContext, ExplorerRootContext, FilesExplorerFocusCondition, VIEWLET_ID as VIEWLET_ID_FILES } from '../../files/common/files.js';
import { IPaneCompositePartService } from '../../../services/panecomposite/browser/panecomposite.js';
import { ExplorerViewPaneContainer } from '../../files/browser/explorerViewlet.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { category, getElementsToOperateOn, getSearchView, openSearchView } from './searchActionsBase.js';
import { IConfigurationResolverService } from '../../../services/configurationResolver/common/configurationResolver.js';
import { IHistoryService } from '../../../services/history/common/history.js';
import { Schemas } from '../../../../base/common/network.js';
import { IEditorGroupsService } from '../../../services/editor/common/editorGroupsService.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { forcedExpandRecursively } from './searchActionsTopBar.js';
import { RenderableMatch, ISearchTreeFileMatch, ISearchTreeFolderMatchWithResource, ISearchResult, isSearchTreeFileMatch, isSearchTreeMatch } from './searchTreeModel/searchTreeCommon.js';

//#region Interfaces
export interface IFindInFilesArgs {
	query?: string;
	replace?: string;
	preserveCase?: boolean;
	triggerSearch?: boolean;
	filesToInclude?: string;
	filesToExclude?: string;
	isRegex?: boolean;
	isCaseSensitive?: boolean;
	matchWholeWord?: boolean;
	useExcludeSettingsAndIgnoreFiles?: boolean;
	onlyOpenEditors?: boolean;
	showIncludesExcludes?: boolean;
}
//#endregion

registerAction2(class RestrictSearchToFolderAction extends Action2 {
	constructor() {
		super({
			id: Constants.SearchCommandIds.RestrictSearchToFolderId,
			title: nls.localize2('restrictResultsToFolder', "Restrict Search to Folder"),
			category,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				when: ContextKeyExpr.and(Constants.SearchContext.SearchViewVisibleKey, Constants.SearchContext.ResourceFolderFocusKey),
				primary: KeyMod.Shift | KeyMod.Alt | KeyCode.KeyF,
			},
			menu: [
				{
					id: MenuId.SearchContext,
					group: 'search',
					order: 3,
					when: ContextKeyExpr.and(Constants.SearchContext.ResourceFolderFocusKey)
				}
			]
		});
	}
	async run(accessor: ServicesAccessor, folderMatch?: ISearchTreeFolderMatchWithResource) {
		await searchWithFolderCommand(accessor, false, true, undefined, folderMatch);
	}
});


registerAction2(class ExpandSelectedTreeCommandAction extends Action2 {
	constructor(
	) {
		super({
			id: Constants.SearchCommandIds.ExpandRecursivelyCommandId,
			title: nls.localize('search.expandRecursively', "Expand Recursively"),
			category,
			menu: [{
				id: MenuId.SearchContext,
				when: ContextKeyExpr.and(
					Constants.SearchContext.FolderFocusKey,
					Constants.SearchContext.HasSearchResults
				),
				group: 'search',
				order: 4
			}]
		});
	}

	override async run(accessor: any) {
		return expandSelectSubtree(accessor);
	}
});

registerAction2(class ExcludeFolderFromSearchAction extends Action2 {
	constructor() {
		super({
			id: Constants.SearchCommandIds.ExcludeFolderFromSearchId,
			title: nls.localize2('excludeFolderFromSearch', "Exclude Folder from Search"),
			category,
			menu: [
				{
					id: MenuId.SearchContext,
					group: 'search',
					order: 4,
					when: Constants.SearchContext.ResourceFolderFocusKey
				}
			]
		});
	}
	async run(accessor: ServicesAccessor, folderMatch?: ISearchTreeFolderMatchWithResource) {
		await searchWithFolderCommand(accessor, false, false, undefined, folderMatch);
	}
});

registerAction2(class ExcludeFileTypeFromSearchAction extends Action2 {
	constructor() {
		super({
			id: Constants.SearchCommandIds.ExcludeFileTypeFromSearchId,
			title: nls.localize2('excludeFileTypeFromSearch', "Exclude File Type from Search"),
			category,
			menu: [
				{
					id: MenuId.SearchContext,
					group: 'search',
					order: 5,
					when: Constants.SearchContext.FileFocusKey
				}
			]
		});
	}
	async run(accessor: ServicesAccessor, fileMatch?: ISearchTreeFileMatch) {
		await modifySearchFileTypePattern(accessor, fileMatch, true);
	}
});

registerAction2(class IncludeFileTypeInSearchAction extends Action2 {
	constructor() {
		super({
			id: Constants.SearchCommandIds.IncludeFileTypeInSearchId,
			title: nls.localize2('includeFileTypeInSearch', "Include File Type from Search"),
			category,
			menu: [
				{
					id: MenuId.SearchContext,
					group: 'search',
					order: 6,
					when: Constants.SearchContext.FileFocusKey
				}
			]
		});
	}
	async run(accessor: ServicesAccessor, fileMatch?: ISearchTreeFileMatch) {
		await modifySearchFileTypePattern(accessor, fileMatch, false);
	}
});

registerAction2(class RevealInSideBarForSearchResultsAction extends Action2 {

	constructor(
	) {
		super({
			id: Constants.SearchCommandIds.RevealInSideBarForSearchResults,
			title: nls.localize2('revealInSideBar', "Reveal in Explorer View"),
			category,
			menu: [{
				id: MenuId.SearchContext,
				when: ContextKeyExpr.and(Constants.SearchContext.FileFocusKey, Constants.SearchContext.HasSearchResults),
				group: 'search_3',
				order: 1
			}]
		});

	}

	override async run(accessor: ServicesAccessor, args: any): Promise<any> {
		const paneCompositeService = accessor.get(IPaneCompositePartService);
		const explorerService = accessor.get(IExplorerService);
		const contextService = accessor.get(IWorkspaceContextService);

		const searchView = getSearchView(accessor.get(IViewsService));
		if (!searchView) {
			return;
		}

		let fileMatch: ISearchTreeFileMatch;
		if (isSearchTreeFileMatch(args)) {
			fileMatch = args;
		} else {
			args = searchView.getControl().getFocus()[0];
			return;
		}

		paneCompositeService.openPaneComposite(VIEWLET_ID_FILES, ViewContainerLocation.Sidebar, false).then((viewlet) => {
			if (!viewlet) {
				return;
			}

			const explorerViewContainer = viewlet.getViewPaneContainer() as ExplorerViewPaneContainer;
			const uri = fileMatch.resource;
			if (uri && contextService.isInsideWorkspace(uri)) {
				const explorerView = explorerViewContainer.getExplorerView();
				explorerView.setExpanded(true);
				explorerService.select(uri, true).then(() => explorerView.focus(), onUnexpectedError);
			}
		});
	}
});

// Find in Files by default is the same as View: Show Search, but can be configured to open a search editor instead with the `search.mode` binding
registerAction2(class FindInFilesAction extends Action2 {

	constructor(
	) {
		super({
			id: Constants.SearchCommandIds.FindInFilesActionId,
			title: {
				...nls.localize2('findInFiles', "Find in Files"),
				mnemonicTitle: nls.localize({ key: 'miFindInFiles', comment: ['&& denotes a mnemonic'] }, "Find &&in Files"),
			},
			metadata: {
				description: nls.localize('findInFiles.description', "Open a workspace search"),
				args: [
					{
						name: nls.localize('findInFiles.args', "A set of options for the search"),
						schema: {
							type: 'object',
							properties: {
								query: { 'type': 'string' },
								replace: { 'type': 'string' },
								preserveCase: { 'type': 'boolean' },
								triggerSearch: { 'type': 'boolean' },
								filesToInclude: { 'type': 'string' },
								filesToExclude: { 'type': 'string' },
								isRegex: { 'type': 'boolean' },
								isCaseSensitive: { 'type': 'boolean' },
								matchWholeWord: { 'type': 'boolean' },
								useExcludeSettingsAndIgnoreFiles: { 'type': 'boolean' },
								onlyOpenEditors: { 'type': 'boolean' },
								showIncludesExcludes: { 'type': 'boolean' }
							}
						}
					},
				]
			},
			category,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyF,
			},
			menu: [{
				id: MenuId.MenubarEditMenu,
				group: '4_find_global',
				order: 1,
			}],
			f1: true
		});

	}

	override async run(accessor: ServicesAccessor, args: IFindInFilesArgs = {}): Promise<any> {
		findInFilesCommand(accessor, args);
	}
});

registerAction2(class FindInFolderAction extends Action2 {
	// from explorer
	constructor() {
		super({
			id: Constants.SearchCommandIds.FindInFolderId,
			title: nls.localize2('findInFolder', "Find in Folder..."),
			category,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				when: ContextKeyExpr.and(FilesExplorerFocusCondition, ExplorerFolderContext),
				primary: KeyMod.Shift | KeyMod.Alt | KeyCode.KeyF,
			},
			menu: [
				{
					id: MenuId.ExplorerContext,
					group: '4_search',
					order: 10,
					when: ExplorerFolderContext
				}
			]
		});
	}
	async run(accessor: ServicesAccessor, resource?: URI) {
		await searchWithFolderCommand(accessor, true, true, resource);
	}
});

registerAction2(class FindInWorkspaceAction extends Action2 {
	// from explorer
	constructor() {
		super({
			id: Constants.SearchCommandIds.FindInWorkspaceId,
			title: nls.localize2('findInWorkspace', "Find in Workspace..."),
			category,
			menu: [
				{
					id: MenuId.ExplorerContext,
					group: '4_search',
					order: 10,
					when: ContextKeyExpr.and(ExplorerRootContext, ExplorerFolderContext.toNegated())

				}
			]
		});
	}
	async run(accessor: ServicesAccessor) {
		const searchConfig = accessor.get(IConfigurationService).getValue<ISearchConfiguration>().search;
		const mode = searchConfig.mode;

		if (mode === 'view') {
			const searchView = await openSearchView(accessor.get(IViewsService), true);
			searchView?.searchInFolders();
		}
		else {
			await accessor.get(ICommandService).executeCommand(SearchEditorConstants.OpenEditorCommandId, {
				location: mode === 'newEditor' ? 'new' : 'reuse',
				filesToInclude: '',
			});
		}
	}
});

//#region Helpers
async function expandSelectSubtree(accessor: ServicesAccessor) {
	const viewsService = accessor.get(IViewsService);
	const searchView = getSearchView(viewsService);
	if (searchView) {
		const viewer = searchView.getControl();
		const selected = viewer.getFocus()[0];
		await forcedExpandRecursively(viewer, selected);
	}
}

function extractSearchFilePattern(fileName: string): string {
	const parts = fileName.split('.');

	if (parts.length <= 1) {
		return fileName;
	}

	const extensionParts = parts.slice(1);
	return `*.${extensionParts.join('.')}`;
}

function mergeSearchPatternIfNotExists(currentPatterns: string, newPattern: string): string {
	if (!currentPatterns.trim()) {
		return newPattern;
	}

	const existingPatterns = currentPatterns.split(',').map(pattern => pattern.trim()).filter(pattern => pattern.length > 0);

	if (existingPatterns.includes(newPattern)) {
		return currentPatterns;
	}

	return `${currentPatterns}, ${newPattern}`;
}

async function searchWithFolderCommand(accessor: ServicesAccessor, isFromExplorer: boolean, isIncludes: boolean, resource?: URI, folderMatch?: ISearchTreeFolderMatchWithResource) {
	const fileService = accessor.get(IFileService);
	const viewsService = accessor.get(IViewsService);
	const contextService = accessor.get(IWorkspaceContextService);
	const commandService = accessor.get(ICommandService);
	const searchConfig = accessor.get(IConfigurationService).getValue<ISearchConfiguration>().search;
	const mode = searchConfig.mode;

	let resources: URI[];

	if (isFromExplorer) {
		resources = getMultiSelectedResources(resource, accessor.get(IListService), accessor.get(IEditorService), accessor.get(IEditorGroupsService), accessor.get(IExplorerService));
	} else {
		const searchView = getSearchView(viewsService);
		if (!searchView) {
			return;
		}
		resources = getMultiSelectedSearchResources(searchView.getControl(), folderMatch, searchConfig);
	}

	const resolvedResources = fileService.resolveAll(resources.map(resource => ({ resource }))).then(results => {
		const folders: URI[] = [];
		results.forEach(result => {
			if (result.success && result.stat) {
				folders.push(result.stat.isDirectory ? result.stat.resource : dirname(result.stat.resource));
			}
		});
		return resolveResourcesForSearchIncludes(folders, contextService);
	});

	if (mode === 'view') {
		const searchView = await openSearchView(viewsService, true);
		if (resources && resources.length && searchView) {
			if (isIncludes) {
				searchView.searchInFolders(await resolvedResources);
			} else {
				searchView.searchOutsideOfFolders(await resolvedResources);
			}
		}
		return undefined;
	} else {
		if (isIncludes) {
			return commandService.executeCommand(SearchEditorConstants.OpenEditorCommandId, {
				filesToInclude: (await resolvedResources).join(', '),
				showIncludesExcludes: true,
				location: mode === 'newEditor' ? 'new' : 'reuse',
			});
		}
		else {
			return commandService.executeCommand(SearchEditorConstants.OpenEditorCommandId, {
				filesToExclude: (await resolvedResources).join(', '),
				showIncludesExcludes: true,
				location: mode === 'newEditor' ? 'new' : 'reuse',
			});
		}
	}
}

function getMultiSelectedSearchResources(viewer: WorkbenchCompressibleAsyncDataTree<ISearchResult, RenderableMatch, void>, currElement: RenderableMatch | undefined, sortConfig: ISearchConfigurationProperties): URI[] {
	return getElementsToOperateOn(viewer, currElement, sortConfig)
		.map((renderableMatch) => ((isSearchTreeMatch(renderableMatch)) ? null : renderableMatch.resource))
		.filter((renderableMatch): renderableMatch is URI => (renderableMatch !== null));
}

export async function findInFilesCommand(accessor: ServicesAccessor, _args: IFindInFilesArgs = {}) {

	const searchConfig = accessor.get(IConfigurationService).getValue<ISearchConfiguration>().search;
	const viewsService = accessor.get(IViewsService);
	const commandService = accessor.get(ICommandService);
	const args: IFindInFilesArgs = {};
	if (Object.keys(_args).length !== 0) {
		// resolve variables in the same way as in
		// https://github.com/microsoft/vscode/blob/8b76efe9d317d50cb5b57a7658e09ce6ebffaf36/src/vs/workbench/contrib/searchEditor/browser/searchEditorActions.ts#L152-L158
		const configurationResolverService = accessor.get(IConfigurationResolverService);
		const historyService = accessor.get(IHistoryService);
		const workspaceContextService = accessor.get(IWorkspaceContextService);
		const activeWorkspaceRootUri = historyService.getLastActiveWorkspaceRoot();
		const filteredActiveWorkspaceRootUri = activeWorkspaceRootUri?.scheme === Schemas.file || activeWorkspaceRootUri?.scheme === Schemas.vscodeRemote ? activeWorkspaceRootUri : undefined;
		const lastActiveWorkspaceRoot = filteredActiveWorkspaceRootUri ? workspaceContextService.getWorkspaceFolder(filteredActiveWorkspaceRootUri) ?? undefined : undefined;

		for (const entry of Object.entries(_args)) {
			const name = entry[0];
			const value = entry[1];
			if (value !== undefined) {
				// eslint-disable-next-line local/code-no-any-casts
				(args as any)[name as any] = (typeof value === 'string') ? await configurationResolverService.resolveAsync(lastActiveWorkspaceRoot, value) : value;
			}
		}
	}

	const mode = searchConfig.mode;
	if (mode === 'view') {
		openSearchView(viewsService, false).then(openedView => {
			if (openedView) {
				const searchAndReplaceWidget = openedView.searchAndReplaceWidget;
				searchAndReplaceWidget.toggleReplace(typeof args.replace === 'string');
				let updatedText = false;
				if (typeof args.query !== 'string') {
					updatedText = openedView.updateTextFromFindWidgetOrSelection({ allowUnselectedWord: typeof args.replace !== 'string' });
				}
				openedView.setSearchParameters(args);
				if (typeof args.showIncludesExcludes === 'boolean') {
					openedView.toggleQueryDetails(false, args.showIncludesExcludes);
				}

				openedView.searchAndReplaceWidget.focus(undefined, updatedText, updatedText);
			}
		});
	} else {
		const convertArgs = (args: IFindInFilesArgs): OpenSearchEditorArgs => ({
			location: mode === 'newEditor' ? 'new' : 'reuse',
			query: args.query,
			filesToInclude: args.filesToInclude,
			filesToExclude: args.filesToExclude,
			matchWholeWord: args.matchWholeWord,
			isCaseSensitive: args.isCaseSensitive,
			isRegexp: args.isRegex,
			useExcludeSettingsAndIgnoreFiles: args.useExcludeSettingsAndIgnoreFiles,
			onlyOpenEditors: args.onlyOpenEditors,
			showIncludesExcludes: !!(args.filesToExclude || args.filesToExclude || !args.useExcludeSettingsAndIgnoreFiles),
		});
		commandService.executeCommand(SearchEditorConstants.OpenEditorCommandId, convertArgs(args));
	}
}

async function modifySearchFileTypePattern(accessor: ServicesAccessor, fileMatch: ISearchTreeFileMatch | undefined, isExclude: boolean) {
	const viewsService = accessor.get(IViewsService);
	const searchView = getSearchView(viewsService);

	if (!searchView || !fileMatch) {
		return;
	}

	const resource = fileMatch.resource;
	const fileName = resource.path.split('/').pop() || '';

	const newPattern = extractSearchFilePattern(fileName);
	const patternWidget = isExclude ? searchView.searchExcludePattern : searchView.searchIncludePattern;
	const currentPatterns = patternWidget.getValue();
	const updatedPatterns = mergeSearchPatternIfNotExists(currentPatterns, newPattern);

	if (updatedPatterns !== currentPatterns) {
		patternWidget.setValue(updatedPatterns);
		searchView.toggleQueryDetails(false, true);
		searchView.triggerQueryChange({ preserveFocus: false });
	}
}


//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/browser/searchActionsNav.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/browser/searchActionsNav.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isMacintosh } from '../../../../base/common/platform.js';
import * as nls from '../../../../nls.js';
import { ICommandHandler } from '../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { WorkbenchCompressibleAsyncDataTree } from '../../../../platform/list/browser/listService.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import * as Constants from '../common/constants.js';
import * as SearchEditorConstants from '../../searchEditor/browser/constants.js';
import { SearchEditor } from '../../searchEditor/browser/searchEditor.js';
import { SearchEditorInput } from '../../searchEditor/browser/searchEditorInput.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { ContextKeyExpr, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { assertReturnsDefined } from '../../../../base/common/types.js';
import { Action2, MenuId, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { ToggleCaseSensitiveKeybinding, TogglePreserveCaseKeybinding, ToggleRegexKeybinding, ToggleWholeWordKeybinding } from '../../../../editor/contrib/find/browser/findModel.js';
import { category, getSearchView, openSearchView } from './searchActionsBase.js';
import { CONTEXT_ACCESSIBILITY_MODE_ENABLED } from '../../../../platform/accessibility/common/accessibility.js';
import { getActiveElement } from '../../../../base/browser/dom.js';
import { FileMatchOrMatch, RenderableMatch, ISearchResult, isSearchTreeFolderMatch } from './searchTreeModel/searchTreeCommon.js';

//#region Actions: Changing Search Input Options
registerAction2(class ToggleQueryDetailsAction extends Action2 {
	constructor() {
		super({
			id: Constants.SearchCommandIds.ToggleQueryDetailsActionId,
			title: nls.localize2('ToggleQueryDetailsAction.label', "Toggle Query Details"),
			category,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				when: ContextKeyExpr.or(Constants.SearchContext.SearchViewFocusedKey, SearchEditorConstants.InSearchEditor),
				primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyJ,
			},
		});
	}
	run(accessor: ServicesAccessor, ...args: unknown[]) {
		const options = args[0] as { show?: boolean } | undefined;
		const contextService = accessor.get(IContextKeyService).getContext(getActiveElement());
		if (contextService.getValue(SearchEditorConstants.InSearchEditor.serialize())) {
			(accessor.get(IEditorService).activeEditorPane as SearchEditor).toggleQueryDetails(options?.show);
		} else if (contextService.getValue(Constants.SearchContext.SearchViewFocusedKey.serialize())) {
			const searchView = getSearchView(accessor.get(IViewsService));
			assertReturnsDefined(searchView).toggleQueryDetails(undefined, options?.show);
		}
	}
});

registerAction2(class CloseReplaceAction extends Action2 {
	constructor() {
		super({
			id: Constants.SearchCommandIds.CloseReplaceWidgetActionId,
			title: nls.localize2('CloseReplaceWidget.label', "Close Replace Widget"),
			category,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				when: ContextKeyExpr.and(Constants.SearchContext.SearchViewVisibleKey, Constants.SearchContext.ReplaceInputBoxFocusedKey),
				primary: KeyCode.Escape,
			},
		});
	}
	run(accessor: ServicesAccessor) {

		const searchView = getSearchView(accessor.get(IViewsService));
		if (searchView) {
			searchView.searchAndReplaceWidget.toggleReplace(false);
			searchView.searchAndReplaceWidget.focus();
		}
		return Promise.resolve(null);
	}
});

registerAction2(class ToggleCaseSensitiveCommandAction extends Action2 {

	constructor(
	) {

		super({
			id: Constants.SearchCommandIds.ToggleCaseSensitiveCommandId,
			title: nls.localize2('ToggleCaseSensitiveCommandId.label', "Toggle Case Sensitive"),
			category,
			keybinding: Object.assign({
				weight: KeybindingWeight.WorkbenchContrib,
				when: isMacintosh ? ContextKeyExpr.and(Constants.SearchContext.SearchViewFocusedKey, Constants.SearchContext.FileMatchOrFolderMatchFocusKey.toNegated()) : Constants.SearchContext.SearchViewFocusedKey,
			}, ToggleCaseSensitiveKeybinding)

		});

	}

	override async run(accessor: ServicesAccessor): Promise<any> {
		toggleCaseSensitiveCommand(accessor);
	}
});

registerAction2(class ToggleWholeWordCommandAction extends Action2 {
	constructor() {
		super({
			id: Constants.SearchCommandIds.ToggleWholeWordCommandId,
			title: nls.localize2('ToggleWholeWordCommandId.label', "Toggle Whole Word"),
			keybinding: Object.assign({
				weight: KeybindingWeight.WorkbenchContrib,
				when: Constants.SearchContext.SearchViewFocusedKey,
			}, ToggleWholeWordKeybinding),
			category,
		});
	}

	override async run(accessor: ServicesAccessor): Promise<any> {
		return toggleWholeWordCommand(accessor);
	}
});

registerAction2(class ToggleRegexCommandAction extends Action2 {
	constructor() {
		super({
			id: Constants.SearchCommandIds.ToggleRegexCommandId,
			title: nls.localize2('ToggleRegexCommandId.label', "Toggle Regex"),
			keybinding: Object.assign({
				weight: KeybindingWeight.WorkbenchContrib,
				when: Constants.SearchContext.SearchViewFocusedKey,
			}, ToggleRegexKeybinding),
			category,
		});
	}

	override async run(accessor: ServicesAccessor): Promise<any> {
		return toggleRegexCommand(accessor);
	}
});

registerAction2(class TogglePreserveCaseAction extends Action2 {
	constructor() {
		super({
			id: Constants.SearchCommandIds.TogglePreserveCaseId,
			title: nls.localize2('TogglePreserveCaseId.label', "Toggle Preserve Case"),
			keybinding: Object.assign({
				weight: KeybindingWeight.WorkbenchContrib,
				when: Constants.SearchContext.SearchViewFocusedKey,
			}, TogglePreserveCaseKeybinding),
			category,
		});
	}

	override async run(accessor: ServicesAccessor): Promise<any> {
		return togglePreserveCaseCommand(accessor);
	}
});

//#endregion
//#region Actions: Opening Matches
registerAction2(class OpenMatchAction extends Action2 {
	constructor() {
		super({
			id: Constants.SearchCommandIds.OpenMatch,
			title: nls.localize2('OpenMatch.label', "Open Match"),
			category,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				when: ContextKeyExpr.and(Constants.SearchContext.SearchViewVisibleKey, Constants.SearchContext.FileMatchOrMatchFocusKey),
				primary: KeyCode.Enter,
				mac: {
					primary: KeyCode.Enter,
					secondary: [KeyMod.CtrlCmd | KeyCode.DownArrow]
				},
			},
		});
	}
	run(accessor: ServicesAccessor) {
		const searchView = getSearchView(accessor.get(IViewsService));
		if (searchView) {
			const tree: WorkbenchCompressibleAsyncDataTree<ISearchResult, RenderableMatch> = searchView.getControl();
			const viewer = searchView.getControl();
			const focus = tree.getFocus()[0];

			if (isSearchTreeFolderMatch(focus)) {
				viewer.toggleCollapsed(focus);
			} else {
				searchView.open(<FileMatchOrMatch>tree.getFocus()[0], false, false, true);
			}
		}
	}
});

registerAction2(class OpenMatchToSideAction extends Action2 {
	constructor() {
		super({
			id: Constants.SearchCommandIds.OpenMatchToSide,
			title: nls.localize2('OpenMatchToSide.label', "Open Match To Side"),
			category,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				when: ContextKeyExpr.and(Constants.SearchContext.SearchViewVisibleKey, Constants.SearchContext.FileMatchOrMatchFocusKey),
				primary: KeyMod.CtrlCmd | KeyCode.Enter,
				mac: {
					primary: KeyMod.WinCtrl | KeyCode.Enter
				},
			},
		});
	}
	run(accessor: ServicesAccessor) {
		const searchView = getSearchView(accessor.get(IViewsService));
		if (searchView) {
			const tree: WorkbenchCompressibleAsyncDataTree<ISearchResult, RenderableMatch> = searchView.getControl();
			searchView.open(<FileMatchOrMatch>tree.getFocus()[0], false, true, true);
		}
	}
});

registerAction2(class AddCursorsAtSearchResultsAction extends Action2 {
	constructor() {
		super({
			id: Constants.SearchCommandIds.AddCursorsAtSearchResults,
			title: nls.localize2('AddCursorsAtSearchResults.label', "Add Cursors at Search Results"),
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				when: ContextKeyExpr.and(Constants.SearchContext.SearchViewVisibleKey, Constants.SearchContext.FileMatchOrMatchFocusKey),
				primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyL,
			},
			category,
		});
	}

	override async run(accessor: ServicesAccessor): Promise<any> {
		const searchView = getSearchView(accessor.get(IViewsService));
		if (searchView) {
			const tree: WorkbenchCompressibleAsyncDataTree<ISearchResult, RenderableMatch> = searchView.getControl();
			searchView.openEditorWithMultiCursor(<FileMatchOrMatch>tree.getFocus()[0]);
		}
	}
});

//#endregion
//#region Actions: Toggling Focus
registerAction2(class FocusNextInputAction extends Action2 {
	constructor() {
		super({
			id: Constants.SearchCommandIds.FocusNextInputActionId,
			title: nls.localize2('FocusNextInputAction.label', "Focus Next Input"),
			category,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				when: ContextKeyExpr.or(
					ContextKeyExpr.and(SearchEditorConstants.InSearchEditor, Constants.SearchContext.InputBoxFocusedKey),
					ContextKeyExpr.and(Constants.SearchContext.SearchViewVisibleKey, Constants.SearchContext.InputBoxFocusedKey)),
				primary: KeyMod.CtrlCmd | KeyCode.DownArrow,
			},
		});
	}

	override async run(accessor: ServicesAccessor): Promise<any> {
		const editorService = accessor.get(IEditorService);
		const input = editorService.activeEditor;
		if (input instanceof SearchEditorInput) {
			// cast as we cannot import SearchEditor as a value b/c cyclic dependency.
			(editorService.activeEditorPane as SearchEditor).focusNextInput();
		}

		const searchView = getSearchView(accessor.get(IViewsService));
		searchView?.focusNextInputBox();
	}
});

registerAction2(class FocusPreviousInputAction extends Action2 {
	constructor() {
		super({
			id: Constants.SearchCommandIds.FocusPreviousInputActionId,
			title: nls.localize2('FocusPreviousInputAction.label', "Focus Previous Input"),
			category,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				when: ContextKeyExpr.or(
					ContextKeyExpr.and(SearchEditorConstants.InSearchEditor, Constants.SearchContext.InputBoxFocusedKey),
					ContextKeyExpr.and(Constants.SearchContext.SearchViewVisibleKey, Constants.SearchContext.InputBoxFocusedKey, Constants.SearchContext.SearchInputBoxFocusedKey.toNegated())),
				primary: KeyMod.CtrlCmd | KeyCode.UpArrow,
			},
		});
	}

	override async run(accessor: ServicesAccessor): Promise<any> {
		const editorService = accessor.get(IEditorService);
		const input = editorService.activeEditor;
		if (input instanceof SearchEditorInput) {
			// cast as we cannot import SearchEditor as a value b/c cyclic dependency.
			(editorService.activeEditorPane as SearchEditor).focusPrevInput();
		}

		const searchView = getSearchView(accessor.get(IViewsService));
		searchView?.focusPreviousInputBox();
	}
});

registerAction2(class FocusSearchFromResultsAction extends Action2 {
	constructor() {
		super({
			id: Constants.SearchCommandIds.FocusSearchFromResults,
			title: nls.localize2('FocusSearchFromResults.label', "Focus Search From Results"),
			category,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				when: ContextKeyExpr.and(Constants.SearchContext.SearchViewVisibleKey, ContextKeyExpr.or(Constants.SearchContext.FirstMatchFocusKey, CONTEXT_ACCESSIBILITY_MODE_ENABLED)),
				primary: KeyMod.CtrlCmd | KeyCode.UpArrow,
			},
		});
	}
	run(accessor: ServicesAccessor) {
		const searchView = getSearchView(accessor.get(IViewsService));
		searchView?.focusPreviousInputBox();
	}
});

registerAction2(class ToggleSearchOnTypeAction extends Action2 {
	private static readonly searchOnTypeKey = 'search.searchOnType';

	constructor(
	) {
		super({
			id: Constants.SearchCommandIds.ToggleSearchOnTypeActionId,
			title: nls.localize2('toggleTabs', "Toggle Search on Type"),
			category,
		});

	}

	override async run(accessor: ServicesAccessor): Promise<any> {
		const configurationService = accessor.get(IConfigurationService);
		const searchOnType = configurationService.getValue<boolean>(ToggleSearchOnTypeAction.searchOnTypeKey);
		return configurationService.updateValue(ToggleSearchOnTypeAction.searchOnTypeKey, !searchOnType);
	}
});

registerAction2(class FocusSearchListCommandAction extends Action2 {

	constructor(
	) {
		super({
			id: Constants.SearchCommandIds.FocusSearchListCommandID,
			title: nls.localize2('focusSearchListCommandLabel', "Focus List"),
			category,
			f1: true
		});
	}

	override async run(accessor: ServicesAccessor): Promise<any> {
		focusSearchListCommand(accessor);
	}
});

registerAction2(class FocusNextSearchResultAction extends Action2 {
	constructor() {
		super({
			id: Constants.SearchCommandIds.FocusNextSearchResultActionId,
			title: nls.localize2('FocusNextSearchResult.label', "Focus Next Search Result"),
			keybinding: [{
				primary: KeyCode.F4,
				weight: KeybindingWeight.WorkbenchContrib,
			}],
			category,
			f1: true,
			precondition: ContextKeyExpr.or(Constants.SearchContext.HasSearchResults, SearchEditorConstants.InSearchEditor),
		});
	}

	override async run(accessor: ServicesAccessor): Promise<any> {
		return await focusNextSearchResult(accessor);
	}
});

registerAction2(class FocusPreviousSearchResultAction extends Action2 {
	constructor() {
		super({
			id: Constants.SearchCommandIds.FocusPreviousSearchResultActionId,
			title: nls.localize2('FocusPreviousSearchResult.label', "Focus Previous Search Result"),
			keybinding: [{
				primary: KeyMod.Shift | KeyCode.F4,
				weight: KeybindingWeight.WorkbenchContrib,
			}],
			category,
			f1: true,
			precondition: ContextKeyExpr.or(Constants.SearchContext.HasSearchResults, SearchEditorConstants.InSearchEditor),
		});
	}

	override async run(accessor: ServicesAccessor): Promise<any> {
		return await focusPreviousSearchResult(accessor);
	}
});

registerAction2(class ReplaceInFilesAction extends Action2 {
	constructor() {
		super({
			id: Constants.SearchCommandIds.ReplaceInFilesActionId,
			title: nls.localize2('replaceInFiles', "Replace in Files"),
			keybinding: [{
				primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyH,
				weight: KeybindingWeight.WorkbenchContrib,
			}],
			category,
			f1: true,
			menu: [{
				id: MenuId.MenubarEditMenu,
				group: '4_find_global',
				order: 2
			}],
		});
	}

	override async run(accessor: ServicesAccessor): Promise<any> {
		return await findOrReplaceInFiles(accessor, true);
	}
});

//#endregion

//#region Helpers
function toggleCaseSensitiveCommand(accessor: ServicesAccessor) {
	const searchView = getSearchView(accessor.get(IViewsService));
	searchView?.toggleCaseSensitive();
}

function toggleWholeWordCommand(accessor: ServicesAccessor) {
	const searchView = getSearchView(accessor.get(IViewsService));
	searchView?.toggleWholeWords();
}

function toggleRegexCommand(accessor: ServicesAccessor) {
	const searchView = getSearchView(accessor.get(IViewsService));
	searchView?.toggleRegex();
}

function togglePreserveCaseCommand(accessor: ServicesAccessor) {
	const searchView = getSearchView(accessor.get(IViewsService));
	searchView?.togglePreserveCase();
}

const focusSearchListCommand: ICommandHandler = accessor => {
	const viewsService = accessor.get(IViewsService);
	openSearchView(viewsService).then(searchView => {
		searchView?.moveFocusToResults();
	});
};

async function focusNextSearchResult(accessor: ServicesAccessor): Promise<any> {
	const editorService = accessor.get(IEditorService);
	const input = editorService.activeEditor;
	if (input instanceof SearchEditorInput) {
		// cast as we cannot import SearchEditor as a value b/c cyclic dependency.
		return (editorService.activeEditorPane as SearchEditor).focusNextResult();
	}

	return openSearchView(accessor.get(IViewsService)).then(searchView => searchView?.selectNextMatch());
}

async function focusPreviousSearchResult(accessor: ServicesAccessor): Promise<any> {
	const editorService = accessor.get(IEditorService);
	const input = editorService.activeEditor;
	if (input instanceof SearchEditorInput) {
		// cast as we cannot import SearchEditor as a value b/c cyclic dependency.
		return (editorService.activeEditorPane as SearchEditor).focusPreviousResult();
	}

	return openSearchView(accessor.get(IViewsService)).then(searchView => searchView?.selectPreviousMatch());
}

async function findOrReplaceInFiles(accessor: ServicesAccessor, expandSearchReplaceWidget: boolean): Promise<any> {
	return openSearchView(accessor.get(IViewsService), false).then(openedView => {
		if (openedView) {
			const searchAndReplaceWidget = openedView.searchAndReplaceWidget;
			searchAndReplaceWidget.toggleReplace(expandSearchReplaceWidget);

			const updatedText = openedView.updateTextFromFindWidgetOrSelection({ allowUnselectedWord: !expandSearchReplaceWidget });
			openedView.searchAndReplaceWidget.focus(undefined, updatedText, updatedText);
		}
	});
}
//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/browser/searchActionsRemoveReplace.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/browser/searchActionsRemoveReplace.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ITreeNavigator } from '../../../../base/browser/ui/tree/tree.js';
import * as nls from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { getSelectionKeyboardEvent, WorkbenchCompressibleAsyncDataTree } from '../../../../platform/list/browser/listService.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { searchRemoveIcon, searchReplaceIcon } from './searchIcons.js';
import { SearchView } from './searchView.js';
import * as Constants from '../common/constants.js';
import { IReplaceService } from './replace.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { ISearchConfiguration, ISearchConfigurationProperties } from '../../../services/search/common/search.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { Action2, MenuId, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { category, getElementsToOperateOn, getSearchView, shouldRefocus } from './searchActionsBase.js';
import { equals } from '../../../../base/common/arrays.js';
import { arrayContainsElementOrParent, RenderableMatch, ISearchResult, isSearchTreeFileMatch, isSearchTreeFolderMatch, isSearchTreeMatch, isSearchResult, isTextSearchHeading } from './searchTreeModel/searchTreeCommon.js';
import { MatchInNotebook } from './notebookSearch/notebookSearchModel.js';
import { AITextSearchHeadingImpl } from './AISearch/aiSearchModel.js';


//#region Interfaces
export interface ISearchActionContext {
	readonly viewer: WorkbenchCompressibleAsyncDataTree<ISearchResult, RenderableMatch>;
	readonly element: RenderableMatch;
}


export interface IFindInFilesArgs {
	query?: string;
	replace?: string;
	preserveCase?: boolean;
	triggerSearch?: boolean;
	filesToInclude?: string;
	filesToExclude?: string;
	isRegex?: boolean;
	isCaseSensitive?: boolean;
	matchWholeWord?: boolean;
	useExcludeSettingsAndIgnoreFiles?: boolean;
	onlyOpenEditors?: boolean;
}

//#endregion

//#region Actions
registerAction2(class RemoveAction extends Action2 {

	constructor(
	) {
		super({
			id: Constants.SearchCommandIds.RemoveActionId,
			title: nls.localize2('RemoveAction.label', "Dismiss"),
			category,
			icon: searchRemoveIcon,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				when: ContextKeyExpr.and(Constants.SearchContext.SearchViewVisibleKey, Constants.SearchContext.FileMatchOrMatchFocusKey),
				primary: KeyCode.Delete,
				mac: {
					primary: KeyMod.CtrlCmd | KeyCode.Backspace,
				},
			},
			menu: [
				{
					id: MenuId.SearchContext,
					group: 'search',
					order: 2,
				},
				{
					id: MenuId.SearchActionMenu,
					group: 'inline',
					when: ContextKeyExpr.or(Constants.SearchContext.FileFocusKey, Constants.SearchContext.MatchFocusKey, Constants.SearchContext.FolderFocusKey),
					order: 2,
				},
			]
		});
	}

	async run(accessor: ServicesAccessor, context: ISearchActionContext | undefined): Promise<void> {
		const viewsService = accessor.get(IViewsService);
		const configurationService = accessor.get(IConfigurationService);
		const searchView = getSearchView(viewsService);

		if (!searchView) {
			return;
		}

		let element = context?.element;
		let viewer = context?.viewer;
		if (!viewer) {
			viewer = searchView.getControl();
		}
		if (!element) {
			element = viewer.getFocus()[0] ?? undefined;
		}

		const elementsToRemove = getElementsToOperateOn(viewer, element, configurationService.getValue<ISearchConfigurationProperties>('search'));
		let focusElement = viewer.getFocus()[0] ?? undefined;

		if (elementsToRemove.length === 0) {
			return;
		}

		if (!focusElement || (isSearchResult(focusElement))) {
			focusElement = element;
		}

		let nextFocusElement;
		const shouldRefocusMatch = shouldRefocus(elementsToRemove, focusElement);
		if (focusElement && shouldRefocusMatch) {
			nextFocusElement = await getElementToFocusAfterRemoved(viewer, focusElement, elementsToRemove);
		}

		const searchResult = searchView.searchResult;

		if (searchResult) {
			searchResult.batchRemove(elementsToRemove);
		}

		await searchView.queueRefreshTree(); // wait for refreshTree to finish

		if (focusElement && shouldRefocusMatch) {
			if (!nextFocusElement) {
				// Ignore error if there are no elements left
				nextFocusElement = await getLastNodeFromSameType(viewer, focusElement).catch(() => { });
			}

			if (nextFocusElement && !arrayContainsElementOrParent(nextFocusElement, elementsToRemove)) {
				viewer.reveal(nextFocusElement);
				viewer.setFocus([nextFocusElement], getSelectionKeyboardEvent());
				viewer.setSelection([nextFocusElement], getSelectionKeyboardEvent());
			}
		} else if (!equals(viewer.getFocus(), viewer.getSelection())) {
			viewer.setSelection(viewer.getFocus());
		}

		viewer.domFocus();
		return;
	}
});

registerAction2(class ReplaceAction extends Action2 {
	constructor(
	) {
		super({
			id: Constants.SearchCommandIds.ReplaceActionId,
			title: nls.localize2('match.replace.label', "Replace"),
			category,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				when: ContextKeyExpr.and(Constants.SearchContext.SearchViewVisibleKey, Constants.SearchContext.ReplaceActiveKey, Constants.SearchContext.MatchFocusKey, Constants.SearchContext.IsEditableItemKey),
				primary: KeyMod.Shift | KeyMod.CtrlCmd | KeyCode.Digit1,
			},
			icon: searchReplaceIcon,
			menu: [
				{
					id: MenuId.SearchContext,
					when: ContextKeyExpr.and(Constants.SearchContext.ReplaceActiveKey, Constants.SearchContext.MatchFocusKey, Constants.SearchContext.IsEditableItemKey),
					group: 'search',
					order: 1
				},
				{
					id: MenuId.SearchActionMenu,
					when: ContextKeyExpr.and(Constants.SearchContext.ReplaceActiveKey, Constants.SearchContext.MatchFocusKey, Constants.SearchContext.IsEditableItemKey),
					group: 'inline',
					order: 1
				}
			]
		});
	}

	override async run(accessor: ServicesAccessor, context: ISearchActionContext | undefined): Promise<any> {
		return performReplace(accessor, context);
	}
});

registerAction2(class ReplaceAllAction extends Action2 {

	constructor(
	) {
		super({
			id: Constants.SearchCommandIds.ReplaceAllInFileActionId,
			title: nls.localize2('file.replaceAll.label', "Replace All"),
			category,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				when: ContextKeyExpr.and(Constants.SearchContext.SearchViewVisibleKey, Constants.SearchContext.ReplaceActiveKey, Constants.SearchContext.FileFocusKey, Constants.SearchContext.IsEditableItemKey),
				primary: KeyMod.Shift | KeyMod.CtrlCmd | KeyCode.Digit1,
				secondary: [KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.Enter],
			},
			icon: searchReplaceIcon,
			menu: [
				{
					id: MenuId.SearchContext,
					when: ContextKeyExpr.and(Constants.SearchContext.ReplaceActiveKey, Constants.SearchContext.FileFocusKey, Constants.SearchContext.IsEditableItemKey),
					group: 'search',
					order: 1
				},
				{
					id: MenuId.SearchActionMenu,
					when: ContextKeyExpr.and(Constants.SearchContext.ReplaceActiveKey, Constants.SearchContext.FileFocusKey, Constants.SearchContext.IsEditableItemKey),
					group: 'inline',
					order: 1
				}
			]
		});
	}

	override async run(accessor: ServicesAccessor, context: ISearchActionContext | undefined): Promise<any> {
		return performReplace(accessor, context);
	}
});

registerAction2(class ReplaceAllInFolderAction extends Action2 {
	constructor(
	) {
		super({
			id: Constants.SearchCommandIds.ReplaceAllInFolderActionId,
			title: nls.localize2('file.replaceAll.label', "Replace All"),
			category,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				when: ContextKeyExpr.and(Constants.SearchContext.SearchViewVisibleKey, Constants.SearchContext.ReplaceActiveKey, Constants.SearchContext.FolderFocusKey, Constants.SearchContext.IsEditableItemKey),
				primary: KeyMod.Shift | KeyMod.CtrlCmd | KeyCode.Digit1,
				secondary: [KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.Enter],
			},
			icon: searchReplaceIcon,
			menu: [
				{
					id: MenuId.SearchContext,
					when: ContextKeyExpr.and(Constants.SearchContext.ReplaceActiveKey, Constants.SearchContext.FolderFocusKey, Constants.SearchContext.IsEditableItemKey),
					group: 'search',
					order: 1
				},
				{
					id: MenuId.SearchActionMenu,
					when: ContextKeyExpr.and(Constants.SearchContext.ReplaceActiveKey, Constants.SearchContext.FolderFocusKey, Constants.SearchContext.IsEditableItemKey),
					group: 'inline',
					order: 1
				}
			]
		});
	}

	override async run(accessor: ServicesAccessor, context: ISearchActionContext | undefined): Promise<any> {
		return performReplace(accessor, context);
	}
});

//#endregion

//#region Helpers

async function performReplace(accessor: ServicesAccessor,
	context: ISearchActionContext | undefined) {
	const configurationService = accessor.get(IConfigurationService);
	const viewsService = accessor.get(IViewsService);

	const viewlet: SearchView | undefined = getSearchView(viewsService);
	const viewer: WorkbenchCompressibleAsyncDataTree<ISearchResult, RenderableMatch> | undefined = context?.viewer ?? viewlet?.getControl();

	if (!viewer) {
		return;
	}
	const element: RenderableMatch | null = context?.element ?? viewer.getFocus()[0];

	// since multiple elements can be selected, we need to check the type of the FolderMatch/FileMatch/Match before we perform the replace.
	const elementsToReplace = getElementsToOperateOn(viewer, element ?? undefined, configurationService.getValue<ISearchConfigurationProperties>('search'));
	let focusElement = viewer.getFocus()[0];

	if (!focusElement || (focusElement && !arrayContainsElementOrParent(focusElement, elementsToReplace)) || (isSearchResult(focusElement))) {
		focusElement = element;
	}

	if (elementsToReplace.length === 0) {
		return;
	}
	let nextFocusElement;
	if (focusElement) {
		nextFocusElement = await getElementToFocusAfterRemoved(viewer, focusElement, elementsToReplace);
	}

	const searchResult = viewlet?.searchResult;

	if (searchResult) {
		await searchResult.batchReplace(elementsToReplace);
	}

	await viewlet?.queueRefreshTree(); // wait for refreshTree to finish

	if (focusElement) {
		if (!nextFocusElement) {
			nextFocusElement = await getLastNodeFromSameType(viewer, focusElement);
		}

		if (nextFocusElement) {
			viewer.reveal(nextFocusElement);
			viewer.setFocus([nextFocusElement], getSelectionKeyboardEvent());
			viewer.setSelection([nextFocusElement], getSelectionKeyboardEvent());

			if (isSearchTreeMatch(nextFocusElement)) {
				const useReplacePreview = configurationService.getValue<ISearchConfiguration>().search.useReplacePreview;
				if (!useReplacePreview || hasToOpenFile(accessor, nextFocusElement) || nextFocusElement instanceof MatchInNotebook) {
					viewlet?.open(nextFocusElement, true);
				} else {
					accessor.get(IReplaceService).openReplacePreview(nextFocusElement, true);
				}
			} else if (isSearchTreeFileMatch(nextFocusElement)) {
				viewlet?.open(nextFocusElement, true);
			}
		}

	}

	viewer.domFocus();
}

function hasToOpenFile(accessor: ServicesAccessor, currBottomElem: RenderableMatch): boolean {
	if (!(isSearchTreeMatch(currBottomElem))) {
		return false;
	}
	const activeEditor = accessor.get(IEditorService).activeEditor;
	const file = activeEditor?.resource;
	if (file) {
		return accessor.get(IUriIdentityService).extUri.isEqual(file, currBottomElem.parent().resource);
	}
	return false;
}

function compareLevels(elem1: RenderableMatch, elem2: RenderableMatch) {
	if (isSearchTreeMatch(elem1)) {
		if (isSearchTreeMatch(elem2)) {
			return 0;
		} else {
			return -1;
		}

	} else if (isSearchTreeFileMatch(elem1)) {
		if (isSearchTreeMatch(elem2)) {
			return 1;
		} else if (isSearchTreeFileMatch(elem2)) {
			return 0;
		} else {
			return -1;
		}
	} else if (isSearchTreeFolderMatch(elem1)) {
		if (isTextSearchHeading(elem2)) {
			return -1;
		} else if (isSearchTreeFolderMatch(elem2)) {
			return 0;
		} else {
			return 1;
		}
	} else {
		if (isTextSearchHeading(elem2)) {
			return 0;
		} else {
			return 1;
		}
	}
}

/**
 * Returns element to focus after removing the given element
 */
export async function getElementToFocusAfterRemoved(viewer: WorkbenchCompressibleAsyncDataTree<ISearchResult, RenderableMatch>, element: RenderableMatch, elementsToRemove: RenderableMatch[]): Promise<RenderableMatch | undefined> {
	const navigator: ITreeNavigator<any> = viewer.navigate(element);
	if (isSearchTreeFolderMatch(element)) {
		while (!!navigator.next() && (!isSearchTreeFolderMatch(navigator.current()) || arrayContainsElementOrParent(navigator.current(), elementsToRemove))) { }
	} else if (isSearchTreeFileMatch(element)) {
		while (!!navigator.next() && (!isSearchTreeFileMatch(navigator.current()) || arrayContainsElementOrParent(navigator.current(), elementsToRemove))) {
			// Never expand AI search results by default
			if (navigator.current() instanceof AITextSearchHeadingImpl) {
				return navigator.current();
			}
			await viewer.expand(navigator.current());
		}
	} else {
		while (navigator.next() && (!isSearchTreeMatch(navigator.current()) || arrayContainsElementOrParent(navigator.current(), elementsToRemove))) {
			// Never expand AI search results by default
			if (navigator.current() instanceof AITextSearchHeadingImpl) {
				return navigator.current();
			}
			await viewer.expand(navigator.current());
		}
	}
	return navigator.current();
}

/***
 * Finds the last element in the tree with the same type as `element`
 */
export async function getLastNodeFromSameType(viewer: WorkbenchCompressibleAsyncDataTree<ISearchResult, RenderableMatch>, element: RenderableMatch): Promise<RenderableMatch | undefined> {
	let lastElem: RenderableMatch | null = viewer.lastVisibleElement ?? null;

	while (lastElem) {
		const compareVal = compareLevels(element, lastElem);
		if (compareVal === -1) {
			const expanded = await viewer.expand(lastElem);
			if (!expanded) {
				return lastElem;
			}
			lastElem = viewer.lastVisibleElement;
		} else if (compareVal === 1) {
			const potentialLastElem = viewer.getParentElement(lastElem);
			if (isSearchResult(potentialLastElem)) {
				break;
			} else {
				lastElem = potentialLastElem;
			}
		} else {
			return lastElem;
		}
	}

	return undefined;
}

//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/browser/searchActionsSymbol.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/browser/searchActionsSymbol.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import * as Constants from '../common/constants.js';
import { Action2, MenuId, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';

//#region Actions
registerAction2(class ShowAllSymbolsAction extends Action2 {

	static readonly ID = 'workbench.action.showAllSymbols';
	static readonly LABEL = nls.localize('showTriggerActions', "Go to Symbol in Workspace...");
	static readonly ALL_SYMBOLS_PREFIX = '#';

	constructor(
	) {
		super({
			id: Constants.SearchCommandIds.ShowAllSymbolsActionId,
			title: {
				...nls.localize2('showTriggerActions', "Go to Symbol in Workspace..."),
				mnemonicTitle: nls.localize({ key: 'miGotoSymbolInWorkspace', comment: ['&& denotes a mnemonic'] }, "Go to Symbol in &&Workspace..."),
			},
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.CtrlCmd | KeyCode.KeyT
			},
			menu: {
				id: MenuId.MenubarGoMenu,
				group: '3_global_nav',
				order: 2
			}
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		accessor.get(IQuickInputService).quickAccess.show(ShowAllSymbolsAction.ALL_SYMBOLS_PREFIX);
	}
});

//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/browser/searchActionsTextQuickAccess.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/browser/searchActionsTextQuickAccess.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as nls from '../../../../nls.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import * as Constants from '../common/constants.js';
import { Action2, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { category } from './searchActionsBase.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import { TEXT_SEARCH_QUICK_ACCESS_PREFIX } from './quickTextSearch/textSearchQuickAccess.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IEditor } from '../../../../editor/common/editorCommon.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { getSelectionTextFromEditor } from './searchView.js';
import { RenderableMatch } from './searchTreeModel/searchTreeCommon.js';

registerAction2(class TextSearchQuickAccessAction extends Action2 {

	constructor(
	) {
		super({
			id: Constants.SearchCommandIds.QuickTextSearchActionId,
			title: nls.localize2('quickTextSearch', "Quick Search"),
			category,
			f1: true
		});

	}

	override async run(accessor: ServicesAccessor, match: RenderableMatch | undefined): Promise<any> {
		const quickInputService = accessor.get(IQuickInputService);
		const searchText = getSearchText(accessor) ?? '';
		quickInputService.quickAccess.show(TEXT_SEARCH_QUICK_ACCESS_PREFIX + searchText, { preserveValue: !!searchText });
	}
});

function getSearchText(accessor: ServicesAccessor): string | null {
	const editorService = accessor.get(IEditorService);
	const configurationService = accessor.get(IConfigurationService);

	const activeEditor: IEditor = editorService.activeTextEditorControl as IEditor;
	if (!activeEditor) {
		return null;
	}
	if (!activeEditor.hasTextFocus()) {
		return null;
	}

	// only happen if it would also happen for the search view
	const seedSearchStringFromSelection = configurationService.getValue<boolean>('editor.find.seedSearchStringFromSelection');
	if (!seedSearchStringFromSelection) {
		return null;
	}

	return getSelectionTextFromEditor(false, activeEditor);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/browser/searchActionsTopBar.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/browser/searchActionsTopBar.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { ICommandHandler } from '../../../../platform/commands/common/commands.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { WorkbenchCompressibleAsyncDataTree, WorkbenchListFocusContextKey } from '../../../../platform/list/browser/listService.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { searchClearIcon, searchCollapseAllIcon, searchExpandAllIcon, searchRefreshIcon, searchShowAsList, searchShowAsTree, searchStopIcon } from './searchIcons.js';
import * as Constants from '../common/constants.js';
import { ISearchHistoryService } from '../common/searchHistoryService.js';
import { VIEW_ID } from '../../../services/search/common/search.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { Action2, MenuId, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { SearchStateKey, SearchUIState } from '../common/search.js';
import { category, getSearchView } from './searchActionsBase.js';
import { isSearchTreeMatch, RenderableMatch, ISearchResult, isSearchTreeFolderMatch, isSearchTreeFolderMatchNoRoot, isSearchTreeFolderMatchWorkspaceRoot, isSearchResult, isTextSearchHeading, isSearchTreeFileMatch } from './searchTreeModel/searchTreeCommon.js';

//#region Actions
registerAction2(class ClearSearchHistoryCommandAction extends Action2 {

	constructor(
	) {
		super({
			id: Constants.SearchCommandIds.ClearSearchHistoryCommandId,
			title: nls.localize2('clearSearchHistoryLabel', "Clear Search History"),
			category,
			f1: true
		});

	}

	override async run(accessor: ServicesAccessor): Promise<any> {
		clearHistoryCommand(accessor);
	}
});

registerAction2(class CancelSearchAction extends Action2 {
	constructor() {
		super({
			id: Constants.SearchCommandIds.CancelSearchActionId,
			title: nls.localize2('CancelSearchAction.label', "Cancel Search"),
			icon: searchStopIcon,
			category,
			f1: true,
			precondition: SearchStateKey.isEqualTo(SearchUIState.Idle).negate(),
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				when: ContextKeyExpr.and(Constants.SearchContext.SearchViewVisibleKey, WorkbenchListFocusContextKey),
				primary: KeyCode.Escape,
			},
			menu: [{
				id: MenuId.ViewTitle,
				group: 'navigation',
				order: 0,
				when: ContextKeyExpr.and(ContextKeyExpr.equals('view', VIEW_ID), SearchStateKey.isEqualTo(SearchUIState.SlowSearch)),
			}]
		});
	}
	run(accessor: ServicesAccessor) {
		return cancelSearch(accessor);
	}
});

registerAction2(class RefreshAction extends Action2 {
	constructor() {
		super({
			id: Constants.SearchCommandIds.RefreshSearchResultsActionId,
			title: nls.localize2('RefreshAction.label', "Refresh"),
			icon: searchRefreshIcon,
			precondition: Constants.SearchContext.ViewHasSearchPatternKey,
			category,
			f1: true,
			menu: [{
				id: MenuId.ViewTitle,
				group: 'navigation',
				order: 0,
				when: ContextKeyExpr.and(ContextKeyExpr.equals('view', VIEW_ID), SearchStateKey.isEqualTo(SearchUIState.SlowSearch).negate()),
			}]
		});
	}
	run(accessor: ServicesAccessor, ...args: unknown[]) {
		return refreshSearch(accessor);
	}
});

registerAction2(class CollapseDeepestExpandedLevelAction extends Action2 {
	constructor() {
		super({
			id: Constants.SearchCommandIds.CollapseSearchResultsActionId,
			title: nls.localize2('CollapseDeepestExpandedLevelAction.label', "Collapse All"),
			category,
			icon: searchCollapseAllIcon,
			f1: true,
			precondition: ContextKeyExpr.and(Constants.SearchContext.HasSearchResults, Constants.SearchContext.ViewHasSomeCollapsibleKey),
			menu: [{
				id: MenuId.ViewTitle,
				group: 'navigation',
				order: 4,
				when: ContextKeyExpr.and(ContextKeyExpr.equals('view', VIEW_ID), ContextKeyExpr.or(Constants.SearchContext.HasSearchResults.negate(), Constants.SearchContext.ViewHasSomeCollapsibleKey)),
			}]
		});
	}
	run(accessor: ServicesAccessor, ...args: unknown[]) {
		return collapseDeepestExpandedLevel(accessor);
	}
});

registerAction2(class ExpandAllAction extends Action2 {
	constructor() {
		super({
			id: Constants.SearchCommandIds.ExpandSearchResultsActionId,
			title: nls.localize2('ExpandAllAction.label', "Expand All"),
			category,
			icon: searchExpandAllIcon,
			f1: true,
			precondition: ContextKeyExpr.and(Constants.SearchContext.HasSearchResults, Constants.SearchContext.ViewHasSomeCollapsibleKey.toNegated()),
			menu: [{
				id: MenuId.ViewTitle,
				group: 'navigation',
				order: 4,
				when: ContextKeyExpr.and(ContextKeyExpr.equals('view', VIEW_ID), Constants.SearchContext.HasSearchResults, Constants.SearchContext.ViewHasSomeCollapsibleKey.toNegated()),
			}]
		});
	}
	async run(accessor: ServicesAccessor, ...args: unknown[]) {
		return expandAll(accessor);
	}
});

registerAction2(class ClearSearchResultsAction extends Action2 {
	constructor() {
		super({
			id: Constants.SearchCommandIds.ClearSearchResultsActionId,
			title: nls.localize2('ClearSearchResultsAction.label', "Clear Search Results"),
			category,
			icon: searchClearIcon,
			f1: true,
			precondition: ContextKeyExpr.or(Constants.SearchContext.HasSearchResults, Constants.SearchContext.ViewHasSearchPatternKey, Constants.SearchContext.ViewHasReplacePatternKey, Constants.SearchContext.ViewHasFilePatternKey),
			menu: [{
				id: MenuId.ViewTitle,
				group: 'navigation',
				order: 1,
				when: ContextKeyExpr.equals('view', VIEW_ID),
			}]
		});
	}
	run(accessor: ServicesAccessor, ...args: unknown[]) {
		return clearSearchResults(accessor);
	}
});


registerAction2(class ViewAsTreeAction extends Action2 {
	constructor() {
		super({
			id: Constants.SearchCommandIds.ViewAsTreeActionId,
			title: nls.localize2('ViewAsTreeAction.label', "View as Tree"),
			category,
			icon: searchShowAsList,
			f1: true,
			precondition: ContextKeyExpr.and(Constants.SearchContext.HasSearchResults, Constants.SearchContext.InTreeViewKey.toNegated()),
			menu: [{
				id: MenuId.ViewTitle,
				group: 'navigation',
				order: 2,
				when: ContextKeyExpr.and(ContextKeyExpr.equals('view', VIEW_ID), Constants.SearchContext.InTreeViewKey.toNegated()),
			}]
		});
	}
	async run(accessor: ServicesAccessor, ...args: unknown[]) {
		const searchView = getSearchView(accessor.get(IViewsService));
		if (searchView) {
			await searchView.setTreeView(true);
		}
	}
});

registerAction2(class ViewAsListAction extends Action2 {
	constructor() {
		super({
			id: Constants.SearchCommandIds.ViewAsListActionId,
			title: nls.localize2('ViewAsListAction.label', "View as List"),
			category,
			icon: searchShowAsTree,
			f1: true,
			precondition: ContextKeyExpr.and(Constants.SearchContext.HasSearchResults, Constants.SearchContext.InTreeViewKey),
			menu: [{
				id: MenuId.ViewTitle,
				group: 'navigation',
				order: 2,
				when: ContextKeyExpr.and(ContextKeyExpr.equals('view', VIEW_ID), Constants.SearchContext.InTreeViewKey),
			}]
		});
	}
	async run(accessor: ServicesAccessor, ...args: unknown[]) {
		const searchView = getSearchView(accessor.get(IViewsService));
		if (searchView) {
			await searchView.setTreeView(false);
		}
	}
});

registerAction2(class SearchWithAIAction extends Action2 {
	constructor() {
		super({
			id: Constants.SearchCommandIds.SearchWithAIActionId,
			title: nls.localize2('SearchWithAIAction.label', "Search with AI"),
			category,
			f1: true,
			precondition: Constants.SearchContext.hasAIResultProvider,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				when: ContextKeyExpr.and(Constants.SearchContext.hasAIResultProvider, Constants.SearchContext.SearchViewFocusedKey),
				primary: KeyMod.CtrlCmd | KeyCode.KeyI
			}
		});
	}

	async run(accessor: ServicesAccessor, ...args: unknown[]) {
		const searchView = getSearchView(accessor.get(IViewsService));
		if (searchView) {
			searchView.requestAIResults();
		}
	}
});

//#endregion

//#region Helpers
const clearHistoryCommand: ICommandHandler = accessor => {
	const searchHistoryService = accessor.get(ISearchHistoryService);
	searchHistoryService.clearHistory();
};

async function expandAll(accessor: ServicesAccessor) {
	const viewsService = accessor.get(IViewsService);
	const searchView = getSearchView(viewsService);
	if (searchView) {
		const viewer = searchView.getControl();
		await forcedExpandRecursively(viewer, undefined);
	}
}

/**
 * Recursively expand all nodes in the search results tree that are a child of `element`
 * If `element` is not provided, it is the root node.
 */
export async function forcedExpandRecursively(
	viewer: WorkbenchCompressibleAsyncDataTree<ISearchResult, RenderableMatch, void>,
	element: RenderableMatch | undefined
) {
	if (element) {
		if (!viewer.hasNode(element)) {
			return;
		}
		await viewer.expand(element, true);
	}

	const children = viewer.getNode(element)?.children;

	if (children) {
		for (const child of children) {
			if (isSearchResult(child.element)) {
				throw Error('SearchResult should not be a child of a RenderableMatch');
			}
			forcedExpandRecursively(viewer, child.element);
		}
	}
}

function clearSearchResults(accessor: ServicesAccessor) {
	const viewsService = accessor.get(IViewsService);
	const searchView = getSearchView(viewsService);
	searchView?.clearSearchResults();
}

function cancelSearch(accessor: ServicesAccessor) {
	const viewsService = accessor.get(IViewsService);
	const searchView = getSearchView(viewsService);
	searchView?.cancelSearch();
}

function refreshSearch(accessor: ServicesAccessor) {
	const viewsService = accessor.get(IViewsService);
	const searchView = getSearchView(viewsService);
	searchView?.triggerQueryChange({ preserveFocus: false, shouldUpdateAISearch: !searchView.model.searchResult.aiTextSearchResult.hidden });
}

function collapseDeepestExpandedLevel(accessor: ServicesAccessor) {

	const viewsService = accessor.get(IViewsService);
	const searchView = getSearchView(viewsService);
	if (searchView) {
		const viewer = searchView.getControl();

		/**
		 * one level to collapse so collapse everything. If FolderMatch, check if there are visible grandchildren,
		 * i.e. if Matches are returned by the navigator, and if so, collapse to them, otherwise collapse all levels.
		 */
		const navigator = viewer.navigate();
		let node = navigator.first();
		let canCollapseFileMatchLevel = false;
		let canCollapseFirstLevel = false;

		do {
			node = navigator.next();
		} while (isTextSearchHeading(node));
		// go to the first non-TextSearchResult node

		if (isSearchTreeFolderMatchWorkspaceRoot(node) || searchView.isTreeLayoutViewVisible) {
			while (node = navigator.next()) {
				if (isTextSearchHeading(node)) {
					continue;
				}
				if (isSearchTreeMatch(node)) {
					canCollapseFileMatchLevel = true;
					break;
				}
				if (searchView.isTreeLayoutViewVisible && !canCollapseFirstLevel) {
					let nodeToTest = node;

					if (isSearchTreeFolderMatch(node)) {
						const compressionStartNode = viewer.getCompressedTreeNode(node)?.elements[0].element;
						// Match elements should never be compressed, so `!(compressionStartNode instanceof Match)` should always be true here. Same with `!(compressionStartNode instanceof TextSearchResult)`
						nodeToTest = compressionStartNode && !(isSearchTreeMatch(compressionStartNode)) && !isTextSearchHeading(compressionStartNode) && !(isSearchResult(compressionStartNode)) ? compressionStartNode : node;
					}

					const immediateParent = nodeToTest.parent();

					if (!(isTextSearchHeading(immediateParent) || isSearchTreeFolderMatchWorkspaceRoot(immediateParent) || isSearchTreeFolderMatchNoRoot(immediateParent) || isSearchResult(immediateParent))) {
						canCollapseFirstLevel = true;
					}
				}
			}
		}

		if (canCollapseFileMatchLevel) {
			node = navigator.first();
			do {
				if (isSearchTreeFileMatch(node)) {
					viewer.collapse(node);
				}
			} while (node = navigator.next());
		} else if (canCollapseFirstLevel) {
			node = navigator.first();
			if (node) {
				do {

					let nodeToTest = node;

					if (isSearchTreeFolderMatch(node)) {
						const compressionStartNode = viewer.getCompressedTreeNode(node)?.elements[0].element;
						// Match elements should never be compressed, so !(compressionStartNode instanceof Match) should always be true here
						nodeToTest = (compressionStartNode && !(isSearchTreeMatch(compressionStartNode)) && !(isSearchResult(compressionStartNode)) ? compressionStartNode : node);
					}
					const immediateParent = nodeToTest.parent();

					if (isSearchTreeFolderMatchWorkspaceRoot(immediateParent) || isSearchTreeFolderMatchNoRoot(immediateParent)) {
						if (viewer.hasNode(node)) {
							viewer.collapse(node, true);
						} else {
							viewer.collapseAll();
						}
					}
				} while (node = navigator.next());
			}
		} else if (isTextSearchHeading(navigator.first())) {
			// if AI results are visible, just collapse everything under the TextSearchResult.
			node = navigator.first();
			do {
				if (!node) {
					break;

				}

				if (isTextSearchHeading(viewer.getParentElement(node))) {
					viewer.collapse(node);
				}
			} while (node = navigator.next());

		} else {
			viewer.collapseAll();
		}

		const firstFocusParent = viewer.getFocus()[0]?.parent();

		if (firstFocusParent && (isSearchTreeFolderMatch(firstFocusParent) || isSearchTreeFileMatch(firstFocusParent)) &&
			viewer.hasNode(firstFocusParent) && viewer.isCollapsed(firstFocusParent)) {
			viewer.domFocus();
			viewer.focusFirst();
			viewer.setSelection(viewer.getFocus());
		}
	}
}

//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/browser/searchChatContext.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/browser/searchChatContext.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../base/common/codicons.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { localize } from '../../../../nls.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { getExcludes, IFileQuery, ISearchComplete, ISearchConfiguration, ISearchService, QueryType, VIEW_ID } from '../../../services/search/common/search.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { IChatContextPickerItem, IChatContextPickerPickItem, IChatContextPickService, IChatContextValueItem, picksWithPromiseFn } from '../../chat/browser/chatContextPickService.js';
import { IChatRequestVariableEntry, ISymbolVariableEntry } from '../../chat/common/chatVariableEntries.js';
import { SearchContext } from '../common/constants.js';
import { SearchView } from './searchView.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { basename, dirname, joinPath, relativePath } from '../../../../base/common/resources.js';
import { compare } from '../../../../base/common/strings.js';
import { URI } from '../../../../base/common/uri.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { getIconClasses } from '../../../../editor/common/services/getIconClasses.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { FileKind, FileType, IFileService } from '../../../../platform/files/common/files.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { IHistoryService } from '../../../services/history/common/history.js';
import { isCancellationError } from '../../../../base/common/errors.js';
import * as glob from '../../../../base/common/glob.js';
import { ResourceSet } from '../../../../base/common/map.js';
import { SymbolsQuickAccessProvider } from './symbolsQuickAccess.js';
import { SymbolKinds } from '../../../../editor/common/languages.js';
import { isSupportedChatFileScheme } from '../../chat/common/constants.js';
import { IChatWidget } from '../../chat/browser/chat.js';

export class SearchChatContextContribution extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contributions.searchChatContextContribution';

	constructor(
		@IInstantiationService instantiationService: IInstantiationService,
		@IChatContextPickService chatContextPickService: IChatContextPickService
	) {
		super();
		this._store.add(chatContextPickService.registerChatContextItem(instantiationService.createInstance(SearchViewResultChatContextPick)));
		this._store.add(chatContextPickService.registerChatContextItem(instantiationService.createInstance(FilesAndFoldersPickerPick)));
		this._store.add(chatContextPickService.registerChatContextItem(this._store.add(instantiationService.createInstance(SymbolsContextPickerPick))));
	}
}

class SearchViewResultChatContextPick implements IChatContextValueItem {

	readonly type = 'valuePick';
	readonly label: string = localize('chatContext.searchResults', 'Search Results');
	readonly icon: ThemeIcon = Codicon.search;
	readonly ordinal = 500;

	constructor(
		@IContextKeyService private readonly _contextKeyService: IContextKeyService,
		@IViewsService private readonly _viewsService: IViewsService,
		@ILabelService private readonly _labelService: ILabelService,
	) { }

	isEnabled(widget: IChatWidget): Promise<boolean> | boolean {
		return !!SearchContext.HasSearchResults.getValue(this._contextKeyService) && !!widget.attachmentCapabilities.supportsSearchResultAttachments;
	}

	async asAttachment(): Promise<IChatRequestVariableEntry[]> {
		const searchView = this._viewsService.getViewWithId(VIEW_ID);
		if (!(searchView instanceof SearchView)) {
			return [];
		}

		return searchView.model.searchResult.matches().map(result => ({
			kind: 'file',
			id: result.resource.toString(),
			value: result.resource,
			name: this._labelService.getUriBasenameLabel(result.resource),
		}));
	}
}

class SymbolsContextPickerPick implements IChatContextPickerItem {

	readonly type = 'pickerPick';

	readonly label: string = localize('symbols', 'Symbols...');
	readonly icon: ThemeIcon = Codicon.symbolField;
	readonly ordinal = -200;

	private _provider: SymbolsQuickAccessProvider | undefined;

	constructor(
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
	) { }

	dispose(): void {
		this._provider?.dispose();
	}

	isEnabled(widget: IChatWidget): boolean {
		return !!widget.attachmentCapabilities.supportsSymbolAttachments;
	}
	asPicker() {

		return {
			placeholder: localize('select.symb', "Select a symbol"),
			picks: picksWithPromiseFn((query: string, token: CancellationToken) => {

				this._provider ??= this._instantiationService.createInstance(SymbolsQuickAccessProvider);

				return this._provider.getSymbolPicks(query, undefined, token).then(symbolItems => {
					const result: IChatContextPickerPickItem[] = [];
					for (const item of symbolItems) {
						if (!item.symbol) {
							continue;
						}

						const attachment: ISymbolVariableEntry = {
							kind: 'symbol',
							id: JSON.stringify(item.symbol.location),
							value: item.symbol.location,
							symbolKind: item.symbol.kind,
							icon: SymbolKinds.toIcon(item.symbol.kind),
							fullName: item.label,
							name: item.symbol.name,
						};

						result.push({
							label: item.symbol.name,
							iconClass: ThemeIcon.asClassName(SymbolKinds.toIcon(item.symbol.kind)),
							asAttachment() {
								return attachment;
							}
						});
					}
					return result;
				});
			}),
		};
	}
}

class FilesAndFoldersPickerPick implements IChatContextPickerItem {

	readonly type = 'pickerPick';
	readonly label = localize('chatContext.folder', 'Files & Folders...');
	readonly icon = Codicon.folder;
	readonly ordinal = 600;

	constructor(
		@ISearchService private readonly _searchService: ISearchService,
		@ILabelService private readonly _labelService: ILabelService,
		@IModelService private readonly _modelService: IModelService,
		@ILanguageService private readonly _languageService: ILanguageService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IWorkspaceContextService private readonly _workspaceService: IWorkspaceContextService,
		@IFileService private readonly _fileService: IFileService,
		@IHistoryService private readonly _historyService: IHistoryService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
	) { }

	asPicker() {

		return {
			placeholder: localize('chatContext.attach.files.placeholder', "Search file or folder by name"),
			picks: picksWithPromiseFn(async (value, token) => {

				const workspaces = this._workspaceService.getWorkspace().folders.map(folder => folder.uri);

				const defaultItems: IChatContextPickerPickItem[] = [];
				(await getTopLevelFolders(workspaces, this._fileService)).forEach(uri => defaultItems.push(this._createPickItem(uri, FileKind.FOLDER)));
				this._historyService.getHistory()
					.filter(a => a.resource && this._instantiationService.invokeFunction(accessor => isSupportedChatFileScheme(accessor, a.resource!.scheme)))
					.slice(0, 30)
					.forEach(uri => defaultItems.push(this._createPickItem(uri.resource!, FileKind.FILE)));

				if (value === '') {
					return defaultItems;
				}

				const result: IChatContextPickerPickItem[] = [];

				await Promise.all(workspaces.map(async workspace => {
					const { folders, files } = await searchFilesAndFolders(
						workspace,
						value,
						true,
						token,
						undefined,
						this._configurationService,
						this._searchService
					);

					for (const folder of folders) {
						result.push(this._createPickItem(folder, FileKind.FOLDER));
					}
					for (const file of files) {
						result.push(this._createPickItem(file, FileKind.FILE));
					}
				}));

				result.sort((a, b) => compare(a.label, b.label));

				return result;
			}),
		};
	}

	private _createPickItem(resource: URI, kind: FileKind): IChatContextPickerPickItem {
		return {
			label: basename(resource),
			description: this._labelService.getUriLabel(dirname(resource), { relative: true }),
			iconClasses: getIconClasses(this._modelService, this._languageService, resource, kind),
			asAttachment: () => {
				return {
					kind: kind === FileKind.FILE ? 'file' : 'directory',
					id: resource.toString(),
					value: resource,
					name: basename(resource),
				};
			}
		};
	}

}
export async function searchFilesAndFolders(
	workspace: URI,
	pattern: string,
	fuzzyMatch: boolean,
	token: CancellationToken | undefined,
	cacheKey: string | undefined,
	configurationService: IConfigurationService,
	searchService: ISearchService
): Promise<{ folders: URI[]; files: URI[] }> {
	const segmentMatchPattern = caseInsensitiveGlobPattern(fuzzyMatch ? fuzzyMatchingGlobPattern(pattern) : continousMatchingGlobPattern(pattern));

	const searchExcludePattern = getExcludes(configurationService.getValue<ISearchConfiguration>({ resource: workspace })) || {};
	const searchOptions: IFileQuery = {
		folderQueries: [{
			folder: workspace,
			disregardIgnoreFiles: configurationService.getValue<boolean>('explorer.excludeGitIgnore'),
		}],
		type: QueryType.File,
		shouldGlobMatchFilePattern: true,
		cacheKey,
		excludePattern: searchExcludePattern,
		sortByScore: true,
	};

	let searchResult: ISearchComplete | undefined;
	try {
		searchResult = await searchService.fileSearch({ ...searchOptions, filePattern: `{**/${segmentMatchPattern}/**,${pattern}}` }, token);
	} catch (e) {
		if (!isCancellationError(e)) {
			throw e;
		}
	}

	if (!searchResult || token?.isCancellationRequested) {
		return { files: [], folders: [] };
	}

	const fileResources = searchResult.results.map(result => result.resource);
	const folderResources = getMatchingFoldersFromFiles(fileResources, workspace, segmentMatchPattern);

	return { folders: folderResources, files: fileResources };
}

function fuzzyMatchingGlobPattern(pattern: string): string {
	if (!pattern) {
		return '*';
	}
	return '*' + pattern.split('').join('*') + '*';
}

function continousMatchingGlobPattern(pattern: string): string {
	if (!pattern) {
		return '*';
	}
	return '*' + pattern + '*';
}

function caseInsensitiveGlobPattern(pattern: string): string {
	let caseInsensitiveFilePattern = '';
	for (let i = 0; i < pattern.length; i++) {
		const char = pattern[i];
		if (/[a-zA-Z]/.test(char)) {
			caseInsensitiveFilePattern += `[${char.toLowerCase()}${char.toUpperCase()}]`;
		} else {
			caseInsensitiveFilePattern += char;
		}
	}
	return caseInsensitiveFilePattern;
}

// TODO: remove this and have support from the search service
function getMatchingFoldersFromFiles(resources: URI[], workspace: URI, segmentMatchPattern: string): URI[] {
	const uniqueFolders = new ResourceSet();
	for (const resource of resources) {
		const relativePathToRoot = relativePath(workspace, resource);
		if (!relativePathToRoot) {
			throw new Error('Resource is not a child of the workspace');
		}

		let dirResource = workspace;
		const stats = relativePathToRoot.split('/').slice(0, -1);
		for (const stat of stats) {
			dirResource = dirResource.with({ path: `${dirResource.path}/${stat}` });
			uniqueFolders.add(dirResource);
		}
	}

	const matchingFolders: URI[] = [];
	for (const folderResource of uniqueFolders) {
		const stats = folderResource.path.split('/');
		const dirStat = stats[stats.length - 1];
		if (!dirStat || !glob.match(segmentMatchPattern, dirStat)) {
			continue;
		}

		matchingFolders.push(folderResource);
	}

	return matchingFolders;
}

export async function getTopLevelFolders(workspaces: URI[], fileService: IFileService): Promise<URI[]> {
	const folders: URI[] = [];
	for (const workspace of workspaces) {
		const fileSystemProvider = fileService.getProvider(workspace.scheme);
		if (!fileSystemProvider) {
			continue;
		}

		const entries = await fileSystemProvider.readdir(workspace);
		for (const [name, type] of entries) {
			const entryResource = joinPath(workspace, name);
			if (type === FileType.Directory) {
				folders.push(entryResource);
			}
		}
	}

	return folders;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/browser/searchCompare.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/browser/searchCompare.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IMatchInNotebook, isIMatchInNotebook } from './notebookSearch/notebookSearchModelBase.js';
import { compareFileExtensions, compareFileNames, comparePaths } from '../../../../base/common/comparers.js';
import { SearchSortOrder } from '../../../services/search/common/search.js';
import { Range } from '../../../../editor/common/core/range.js';
import { createParentList, isSearchTreeFileMatch, isSearchTreeFolderMatch, isSearchTreeMatch, RenderableMatch } from './searchTreeModel/searchTreeCommon.js';
import { isSearchTreeAIFileMatch } from './AISearch/aiSearchModelBase.js';


let elemAIndex: number = -1;
let elemBIndex: number = -1;

/**
 * Compares instances of the same match type. Different match types should not be siblings
 * and their sort order is undefined.
 */
export function searchMatchComparer(elementA: RenderableMatch, elementB: RenderableMatch, sortOrder: SearchSortOrder = SearchSortOrder.Default): number {
	if (isSearchTreeFileMatch(elementA) && isSearchTreeFolderMatch(elementB)) {
		return 1;
	}

	if (isSearchTreeFileMatch(elementB) && isSearchTreeFolderMatch(elementA)) {
		return -1;
	}

	if (isSearchTreeFolderMatch(elementA) && isSearchTreeFolderMatch(elementB)) {
		elemAIndex = elementA.index();
		elemBIndex = elementB.index();
		if (elemAIndex !== -1 && elemBIndex !== -1) {
			return elemAIndex - elemBIndex;
		}

		if (isSearchTreeAIFileMatch(elementA) && isSearchTreeAIFileMatch(elementB)) {
			return elementA.rank - elementB.rank;
		}
		switch (sortOrder) {
			case SearchSortOrder.CountDescending:
				return elementB.count() - elementA.count();
			case SearchSortOrder.CountAscending:
				return elementA.count() - elementB.count();
			case SearchSortOrder.Type:
				return compareFileExtensions(elementA.name(), elementB.name());
			case SearchSortOrder.FileNames:
				return compareFileNames(elementA.name(), elementB.name());
			// Fall through otherwise
			default:
				if (!elementA.resource || !elementB.resource) {
					return 0;
				}
				return comparePaths(elementA.resource.fsPath, elementB.resource.fsPath) || compareFileNames(elementA.name(), elementB.name());
		}
	}

	if (isSearchTreeFileMatch(elementA) && isSearchTreeFileMatch(elementB)) {
		switch (sortOrder) {
			case SearchSortOrder.CountDescending:
				return elementB.count() - elementA.count();
			case SearchSortOrder.CountAscending:
				return elementA.count() - elementB.count();
			case SearchSortOrder.Type:
				return compareFileExtensions(elementA.name(), elementB.name());
			case SearchSortOrder.FileNames:
				return compareFileNames(elementA.name(), elementB.name());
			case SearchSortOrder.Modified: {
				const fileStatA = elementA.fileStat;
				const fileStatB = elementB.fileStat;
				if (fileStatA && fileStatB) {
					return fileStatB.mtime - fileStatA.mtime;

				}
			}
			// Fall through otherwise
			default:
				return comparePaths(elementA.resource.fsPath, elementB.resource.fsPath) || compareFileNames(elementA.name(), elementB.name());
		}
	}

	if (isIMatchInNotebook(elementA) && isIMatchInNotebook(elementB)) {
		return compareNotebookPos(elementA, elementB);
	}

	if (isSearchTreeMatch(elementA) && isSearchTreeMatch(elementB)) {
		return Range.compareRangesUsingStarts(elementA.range(), elementB.range());
	}

	return 0;
}

function compareNotebookPos(match1: IMatchInNotebook, match2: IMatchInNotebook): number {
	if (match1.cellIndex === match2.cellIndex) {

		if (match1.webviewIndex !== undefined && match2.webviewIndex !== undefined) {
			return match1.webviewIndex - match2.webviewIndex;
		} else if (match1.webviewIndex === undefined && match2.webviewIndex === undefined) {
			return Range.compareRangesUsingStarts(match1.range(), match2.range());
		} else {
			// webview matches should always be after content matches
			if (match1.webviewIndex !== undefined) {
				return 1;
			} else {
				return -1;
			}
		}
	} else if (match1.cellIndex < match2.cellIndex) {
		return -1;
	} else {
		return 1;
	}
}

export function searchComparer(elementA: RenderableMatch, elementB: RenderableMatch, sortOrder: SearchSortOrder = SearchSortOrder.Default): number {
	const elemAParents = createParentList(elementA);
	const elemBParents = createParentList(elementB);

	let i = elemAParents.length - 1;
	let j = elemBParents.length - 1;
	while (i >= 0 && j >= 0) {
		if (elemAParents[i].id() !== elemBParents[j].id()) {
			return searchMatchComparer(elemAParents[i], elemBParents[j], sortOrder);
		}
		i--;
		j--;
	}
	const elemAAtEnd = i === 0;
	const elemBAtEnd = j === 0;

	if (elemAAtEnd && !elemBAtEnd) {
		return 1;
	} else if (!elemAAtEnd && elemBAtEnd) {
		return -1;
	}
	return 0;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/browser/searchFindInput.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/browser/searchFindInput.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IContextViewProvider } from '../../../../base/browser/ui/contextview/contextview.js';
import { IFindInputOptions } from '../../../../base/browser/ui/findinput/findInput.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { ContextScopedFindInput } from '../../../../platform/history/browser/contextScopedHistoryWidget.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { NotebookFindFilters } from '../../notebook/browser/contrib/find/findFilters.js';
import { NotebookFindInputFilterButton } from '../../notebook/browser/contrib/find/notebookFindReplaceWidget.js';
import * as nls from '../../../../nls.js';
import { Emitter } from '../../../../base/common/event.js';


export class SearchFindInput extends ContextScopedFindInput {
	private _findFilter: NotebookFindInputFilterButton;
	private _filterChecked: boolean = false;
	private readonly _onDidChangeAIToggle = this._register(new Emitter<boolean>());
	public readonly onDidChangeAIToggle = this._onDidChangeAIToggle.event;

	constructor(
		container: HTMLElement | null,
		contextViewProvider: IContextViewProvider,
		options: IFindInputOptions,
		contextKeyService: IContextKeyService,
		readonly contextMenuService: IContextMenuService,
		readonly instantiationService: IInstantiationService,
		readonly filters: NotebookFindFilters,
		filterStartVisiblitity: boolean
	) {
		super(container, contextViewProvider, options, contextKeyService);
		this._findFilter = this._register(
			new NotebookFindInputFilterButton(
				filters,
				contextMenuService,
				instantiationService,
				options,
				nls.localize('searchFindInputNotebookFilter.label', "Notebook Find Filters")
			));


		this._updatePadding();

		this.controls.appendChild(this._findFilter.container);
		this._findFilter.container.classList.add('monaco-custom-toggle');
		this.filterVisible = filterStartVisiblitity;
	}

	private _updatePadding() {
		this.inputBox.paddingRight =
			(this.caseSensitive?.visible ? this.caseSensitive.width() : 0) +
			(this.wholeWords?.visible ? this.wholeWords.width() : 0) +
			(this.regex?.visible ? this.regex.width() : 0) +
			(this._findFilter.visible ? this._findFilter.width() : 0);
	}

	set filterVisible(visible: boolean) {
		this._findFilter.visible = visible;
		this.updateFilterStyles();
		this._updatePadding();
	}

	override setEnabled(enabled: boolean) {
		super.setEnabled(enabled);
		if (enabled && (!this._filterChecked || !this._findFilter.visible)) {
			this.regex?.enable();
		} else {
			this.regex?.disable();
		}
	}

	updateFilterStyles() {
		// filter is checked if it's in a non-default state
		this._filterChecked =
			!this.filters.markupInput ||
			!this.filters.markupPreview ||
			!this.filters.codeInput ||
			!this.filters.codeOutput;

		// TODO: find a way to express that searching notebook output and markdown preview don't support regex.
		this._findFilter.applyStyles(this._filterChecked);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/browser/searchIcons.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/browser/searchIcons.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../base/common/codicons.js';
import { localize } from '../../../../nls.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';

export const searchDetailsIcon = registerIcon('search-details', Codicon.ellipsis, localize('searchDetailsIcon', 'Icon to make search details visible.'));
export const searchActivityBarIcon = registerIcon('search-see-more', Codicon.goToSearch, localize('searchSeeMoreIcon', 'Icon to view more context in the search view.'));

export const searchShowContextIcon = registerIcon('search-show-context', Codicon.listSelection, localize('searchShowContextIcon', 'Icon for toggle the context in the search editor.'));
export const searchHideReplaceIcon = registerIcon('search-hide-replace', Codicon.chevronRight, localize('searchHideReplaceIcon', 'Icon to collapse the replace section in the search view.'));
export const searchShowReplaceIcon = registerIcon('search-show-replace', Codicon.chevronDown, localize('searchShowReplaceIcon', 'Icon to expand the replace section in the search view.'));
export const searchReplaceAllIcon = registerIcon('search-replace-all', Codicon.replaceAll, localize('searchReplaceAllIcon', 'Icon for replace all in the search view.'));
export const searchReplaceIcon = registerIcon('search-replace', Codicon.replace, localize('searchReplaceIcon', 'Icon for replace in the search view.'));
export const searchRemoveIcon = registerIcon('search-remove', Codicon.close, localize('searchRemoveIcon', 'Icon to remove a search result.'));

export const searchRefreshIcon = registerIcon('search-refresh', Codicon.refresh, localize('searchRefreshIcon', 'Icon for refresh in the search view.'));
export const searchCollapseAllIcon = registerIcon('search-collapse-results', Codicon.collapseAll, localize('searchCollapseAllIcon', 'Icon for collapse results in the search view.'));
export const searchExpandAllIcon = registerIcon('search-expand-results', Codicon.expandAll, localize('searchExpandAllIcon', 'Icon for expand results in the search view.'));
export const searchShowAsTree = registerIcon('search-tree', Codicon.listTree, localize('searchShowAsTree', 'Icon for viewing results as a tree in the search view.'));
export const searchShowAsList = registerIcon('search-list', Codicon.listFlat, localize('searchShowAsList', 'Icon for viewing results as a list in the search view.'));
export const searchClearIcon = registerIcon('search-clear-results', Codicon.clearAll, localize('searchClearIcon', 'Icon for clear results in the search view.'));
export const searchStopIcon = registerIcon('search-stop', Codicon.searchStop, localize('searchStopIcon', 'Icon for stop in the search view.'));

export const searchViewIcon = registerIcon('search-view-icon', Codicon.searchLarge, localize('searchViewIcon', 'View icon of the search view.'));

export const searchNewEditorIcon = registerIcon('search-new-editor', Codicon.newFile, localize('searchNewEditorIcon', 'Icon for the action to open a new search editor.'));
export const searchOpenInFileIcon = registerIcon('search-open-in-file', Codicon.goToFile, localize('searchOpenInFile', 'Icon for the action to go to the file of the current search result.'));

export const searchSparkleFilled = registerIcon('search-sparkle-filled', Codicon.sparkleFilled, localize('searchSparkleFilled', 'Icon to show AI results in search.'));
export const searchSparkleEmpty = registerIcon('search-sparkle-empty', Codicon.sparkle, localize('searchSparkleEmpty', 'Icon to hide AI results in search.'));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/browser/searchMessage.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/browser/searchMessage.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import * as dom from '../../../../base/browser/dom.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { parseLinkedText } from '../../../../base/common/linkedText.js';
import Severity from '../../../../base/common/severity.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { SeverityIcon } from '../../../../base/browser/ui/severityIcon/severityIcon.js';
import { TextSearchCompleteMessage, TextSearchCompleteMessageType } from '../../../services/search/common/searchExtTypes.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { Schemas } from '../../../../base/common/network.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { Link } from '../../../../platform/opener/browser/link.js';
import { URI } from '../../../../base/common/uri.js';

export const renderSearchMessage = (
	message: TextSearchCompleteMessage,
	instantiationService: IInstantiationService,
	notificationService: INotificationService,
	openerService: IOpenerService,
	commandService: ICommandService,
	disposableStore: DisposableStore,
	triggerSearch: () => void,
): HTMLElement => {
	const div = dom.$('div.providerMessage');
	const linkedText = parseLinkedText(message.text);
	dom.append(div,
		dom.$('.' +
			SeverityIcon.className(
				message.type === TextSearchCompleteMessageType.Information
					? Severity.Info
					: Severity.Warning)
				.split(' ')
				.join('.')));

	for (const node of linkedText.nodes) {
		if (typeof node === 'string') {
			dom.append(div, document.createTextNode(node));
		} else {
			const link = instantiationService.createInstance(Link, div, node, {
				opener: async href => {
					if (!message.trusted) { return; }
					const parsed = URI.parse(href, true);
					if (parsed.scheme === Schemas.command && message.trusted) {
						const result = await commandService.executeCommand(parsed.path);
						// eslint-disable-next-line local/code-no-any-casts
						if ((result as any)?.triggerSearch) {
							triggerSearch();
						}
					} else if (parsed.scheme === Schemas.https) {
						openerService.open(parsed);
					} else {
						if (parsed.scheme === Schemas.command && !message.trusted) {
							notificationService.error(nls.localize('unable to open trust', "Unable to open command link from untrusted source: {0}", href));
						} else {
							notificationService.error(nls.localize('unable to open', "Unable to open unknown link: {0}", href));
						}
					}
				}
			});
			disposableStore.add(link);
		}
	}
	return div;
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/browser/searchResultsView.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/browser/searchResultsView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from '../../../../base/browser/dom.js';
import { CountBadge } from '../../../../base/browser/ui/countBadge/countBadge.js';
import { IListVirtualDelegate } from '../../../../base/browser/ui/list/list.js';
import { IListAccessibilityProvider } from '../../../../base/browser/ui/list/listWidget.js';
import { ITreeNode } from '../../../../base/browser/ui/tree/tree.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import * as paths from '../../../../base/common/path.js';
import * as nls from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { FileKind } from '../../../../platform/files/common/files.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { ISearchConfigurationProperties } from '../../../services/search/common/search.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { IResourceLabel, ResourceLabels } from '../../../browser/labels.js';
import { SearchView } from './searchView.js';
import { isEqual } from '../../../../base/common/resources.js';
import { ICompressibleTreeRenderer } from '../../../../base/browser/ui/tree/objectTree.js';
import { ICompressedTreeNode } from '../../../../base/browser/ui/tree/compressedObjectTreeModel.js';
import { MenuId } from '../../../../platform/actions/common/actions.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { HiddenItemStrategy, MenuWorkbenchToolBar } from '../../../../platform/actions/browser/toolbar.js';
import { ISearchActionContext } from './searchActionsRemoveReplace.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { ServiceCollection } from '../../../../platform/instantiation/common/serviceCollection.js';
import { defaultCountBadgeStyles } from '../../../../platform/theme/browser/defaultStyles.js';
import { SearchContext } from '../common/constants.js';
import { getDefaultHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegateFactory.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { ISearchTreeMatch, isSearchTreeMatch, RenderableMatch, ITextSearchHeading, ISearchTreeFolderMatch, ISearchTreeFileMatch, isSearchTreeFileMatch, isSearchTreeFolderMatch, isTextSearchHeading, ISearchModel, isSearchTreeFolderMatchWorkspaceRoot, isSearchTreeFolderMatchNoRoot, isPlainTextSearchHeading } from './searchTreeModel/searchTreeCommon.js';
import { isSearchTreeAIFileMatch } from './AISearch/aiSearchModelBase.js';

interface IFolderMatchTemplate {
	label: IResourceLabel;
	badge: CountBadge;
	actions: MenuWorkbenchToolBar;
	disposables: DisposableStore;
	elementDisposables: DisposableStore;
	contextKeyService: IContextKeyService;
}

interface ITextSearchResultTemplate {
	label: IResourceLabel;
	disposables: DisposableStore;
	actions: MenuWorkbenchToolBar;
	contextKeyService: IContextKeyService;
}

interface IFileMatchTemplate {
	el: HTMLElement;
	label: IResourceLabel;
	badge: CountBadge;
	actions: MenuWorkbenchToolBar;
	disposables: DisposableStore;
	elementDisposables: DisposableStore;
	contextKeyService: IContextKeyService;
}

interface IMatchTemplate {
	lineNumber: HTMLElement;
	parent: HTMLElement;
	before: HTMLElement;
	match: HTMLElement;
	replace: HTMLElement;
	after: HTMLElement;
	actions: MenuWorkbenchToolBar;
	disposables: DisposableStore;
	contextKeyService: IContextKeyService;
}

export class SearchDelegate implements IListVirtualDelegate<RenderableMatch> {

	public static ITEM_HEIGHT = 22;

	getHeight(element: RenderableMatch): number {
		return SearchDelegate.ITEM_HEIGHT;
	}

	getTemplateId(element: RenderableMatch): string {
		if (isSearchTreeFolderMatch(element)) {
			return FolderMatchRenderer.TEMPLATE_ID;
		} else if (isSearchTreeFileMatch(element)) {
			return FileMatchRenderer.TEMPLATE_ID;
		} else if (isSearchTreeMatch(element)) {
			return MatchRenderer.TEMPLATE_ID;
		} else if (isTextSearchHeading(element)) {
			return TextSearchResultRenderer.TEMPLATE_ID;
		}

		console.error('Invalid search tree element', element);
		throw new Error('Invalid search tree element');
	}
}

export class TextSearchResultRenderer extends Disposable implements ICompressibleTreeRenderer<ITextSearchHeading, any, ITextSearchResultTemplate> {
	static readonly TEMPLATE_ID = 'textResultMatch';

	readonly templateId = TextSearchResultRenderer.TEMPLATE_ID;

	constructor(
		private labels: ResourceLabels,
		@IWorkspaceContextService protected contextService: IWorkspaceContextService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
	) {
		super();
	}
	renderTemplate(container: HTMLElement): ITextSearchResultTemplate {
		const disposables = new DisposableStore();
		const textSearchResultElement = DOM.append(container, DOM.$('.textsearchresult'));
		const label = this.labels.create(textSearchResultElement, { supportDescriptionHighlights: true, supportHighlights: true, supportIcons: true });
		disposables.add(label);

		const actionBarContainer = DOM.append(textSearchResultElement, DOM.$('.actionBarContainer'));
		const contextKeyServiceMain = disposables.add(this.contextKeyService.createScoped(container));

		const instantiationService = disposables.add(this.instantiationService.createChild(new ServiceCollection([IContextKeyService, contextKeyServiceMain])));
		const actions = disposables.add(instantiationService.createInstance(MenuWorkbenchToolBar, actionBarContainer, MenuId.SearchActionMenu, {
			menuOptions: {
				shouldForwardArgs: true
			},
			highlightToggledItems: true,
			hiddenItemStrategy: HiddenItemStrategy.Ignore,
			toolbarOptions: {
				primaryGroup: (g: string) => /^inline/.test(g),
			},
		}));
		return { label, disposables, actions, contextKeyService: contextKeyServiceMain };
	}

	async renderElement(node: ITreeNode<ITextSearchHeading, any>, index: number, templateData: IFolderMatchTemplate): Promise<void> {
		if (isPlainTextSearchHeading(node.element)) {
			templateData.label.setLabel(nls.localize('searchFolderMatch.plainText.label', "Text Results"));
			SearchContext.AIResultsTitle.bindTo(templateData.contextKeyService).set(false);
			SearchContext.MatchFocusKey.bindTo(templateData.contextKeyService).set(false);
			SearchContext.FileFocusKey.bindTo(templateData.contextKeyService).set(false);
			SearchContext.FolderFocusKey.bindTo(templateData.contextKeyService).set(false);
		} else {
			try {
				await node.element.parent().searchModel.getAITextResultProviderName();
			} catch {
				// ignore
			}

			const localizedLabel = nls.localize({
				key: 'searchFolderMatch.aiText.label',
				comment: ['This is displayed before the AI text search results, now always "AI-assisted results".']
			}, 'AI-assisted results');

			// todo: make icon extension-contributed.
			templateData.label.setLabel(`$(${Codicon.searchSparkle.id}) ${localizedLabel}`);

			SearchContext.AIResultsTitle.bindTo(templateData.contextKeyService).set(true);
			SearchContext.MatchFocusKey.bindTo(templateData.contextKeyService).set(false);
			SearchContext.FileFocusKey.bindTo(templateData.contextKeyService).set(false);
			SearchContext.FolderFocusKey.bindTo(templateData.contextKeyService).set(false);
		}
	}

	disposeTemplate(templateData: IFolderMatchTemplate): void {
		templateData.disposables.dispose();
	}

	renderCompressedElements(node: ITreeNode<ICompressedTreeNode<ITextSearchHeading>, any>, index: number, templateData: ITextSearchResultTemplate): void {
	}

}
export class FolderMatchRenderer extends Disposable implements ICompressibleTreeRenderer<ISearchTreeFolderMatch, any, IFolderMatchTemplate> {
	static readonly TEMPLATE_ID = 'folderMatch';

	readonly templateId = FolderMatchRenderer.TEMPLATE_ID;

	constructor(
		private searchView: SearchView,
		private labels: ResourceLabels,
		@IWorkspaceContextService protected contextService: IWorkspaceContextService,
		@ILabelService private readonly labelService: ILabelService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
	) {
		super();
	}

	renderCompressedElements(node: ITreeNode<ICompressedTreeNode<ISearchTreeFolderMatch>, any>, index: number, templateData: IFolderMatchTemplate): void {
		const compressed = node.element;
		const folder = compressed.elements[compressed.elements.length - 1];
		const label = compressed.elements.map(e => e.name());

		if (folder.resource) {
			const fileKind = (isSearchTreeFolderMatchWorkspaceRoot(folder)) ? FileKind.ROOT_FOLDER : FileKind.FOLDER;
			templateData.label.setResource({ resource: folder.resource, name: label }, {
				fileKind,
				separator: this.labelService.getSeparator(folder.resource.scheme),
			});
		} else {
			templateData.label.setLabel(nls.localize('searchFolderMatch.other.label', "Other files"));
		}

		this.renderFolderDetails(folder, templateData);
	}

	renderTemplate(container: HTMLElement): IFolderMatchTemplate {
		const disposables = new DisposableStore();

		const folderMatchElement = DOM.append(container, DOM.$('.foldermatch'));
		const label = this.labels.create(folderMatchElement, { supportDescriptionHighlights: true, supportHighlights: true });
		disposables.add(label);
		const badge = new CountBadge(DOM.append(folderMatchElement, DOM.$('.badge')), {}, defaultCountBadgeStyles);
		disposables.add(badge);
		const actionBarContainer = DOM.append(folderMatchElement, DOM.$('.actionBarContainer'));

		const elementDisposables = new DisposableStore();
		disposables.add(elementDisposables);

		const contextKeyServiceMain = disposables.add(this.contextKeyService.createScoped(container));
		SearchContext.AIResultsTitle.bindTo(contextKeyServiceMain).set(false);
		SearchContext.MatchFocusKey.bindTo(contextKeyServiceMain).set(false);
		SearchContext.FileFocusKey.bindTo(contextKeyServiceMain).set(false);
		SearchContext.FolderFocusKey.bindTo(contextKeyServiceMain).set(true);

		const instantiationService = disposables.add(this.instantiationService.createChild(new ServiceCollection([IContextKeyService, contextKeyServiceMain])));
		const actions = disposables.add(instantiationService.createInstance(MenuWorkbenchToolBar, actionBarContainer, MenuId.SearchActionMenu, {
			menuOptions: {
				shouldForwardArgs: true
			},
			hiddenItemStrategy: HiddenItemStrategy.Ignore,
			toolbarOptions: {
				primaryGroup: (g: string) => /^inline/.test(g),
			},
		}));

		return {
			label,
			badge,
			actions,
			disposables,
			elementDisposables,
			contextKeyService: contextKeyServiceMain
		};
	}

	renderElement(node: ITreeNode<ISearchTreeFolderMatch, any>, index: number, templateData: IFolderMatchTemplate): void {
		const folderMatch = node.element;
		if (folderMatch.resource) {
			const workspaceFolder = this.contextService.getWorkspaceFolder(folderMatch.resource);
			if (workspaceFolder && isEqual(workspaceFolder.uri, folderMatch.resource)) {
				templateData.label.setFile(folderMatch.resource, { fileKind: FileKind.ROOT_FOLDER, hidePath: true });
			} else {
				templateData.label.setFile(folderMatch.resource, { fileKind: FileKind.FOLDER, hidePath: this.searchView.isTreeLayoutViewVisible });
			}
		} else {
			templateData.label.setLabel(nls.localize('searchFolderMatch.other.label', "Other files"));
		}

		SearchContext.IsEditableItemKey.bindTo(templateData.contextKeyService).set(!folderMatch.hasOnlyReadOnlyMatches());

		templateData.elementDisposables.add(folderMatch.onChange(() => {
			SearchContext.IsEditableItemKey.bindTo(templateData.contextKeyService).set(!folderMatch.hasOnlyReadOnlyMatches());
		}));

		this.renderFolderDetails(folderMatch, templateData);
	}

	disposeElement(element: ITreeNode<RenderableMatch, any>, index: number, templateData: IFolderMatchTemplate): void {
		templateData.elementDisposables.clear();
	}

	disposeCompressedElements(node: ITreeNode<ICompressedTreeNode<ISearchTreeFolderMatch>, any>, index: number, templateData: IFolderMatchTemplate): void {
		templateData.elementDisposables.clear();
	}

	disposeTemplate(templateData: IFolderMatchTemplate): void {
		templateData.disposables.dispose();
	}

	private renderFolderDetails(folder: ISearchTreeFolderMatch, templateData: IFolderMatchTemplate) {
		const count = folder.recursiveMatchCount();
		templateData.badge.setCount(count);
		templateData.badge.setTitleFormat(count > 1 ? nls.localize('searchFileMatches', "{0} files found", count) : nls.localize('searchFileMatch', "{0} file found", count));

		templateData.actions.context = { viewer: this.searchView.getControl(), element: folder } satisfies ISearchActionContext;
	}
}

export class FileMatchRenderer extends Disposable implements ICompressibleTreeRenderer<ISearchTreeFileMatch, any, IFileMatchTemplate> {
	static readonly TEMPLATE_ID = 'fileMatch';

	readonly templateId = FileMatchRenderer.TEMPLATE_ID;

	constructor(
		private searchView: SearchView,
		private labels: ResourceLabels,
		@IWorkspaceContextService protected contextService: IWorkspaceContextService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
	) {
		super();
	}

	renderCompressedElements(node: ITreeNode<ICompressedTreeNode<ISearchTreeFileMatch>, any>, index: number, templateData: IFileMatchTemplate): void {
		throw new Error('Should never happen since node is incompressible.');
	}

	renderTemplate(container: HTMLElement): IFileMatchTemplate {
		const disposables = new DisposableStore();
		const elementDisposables = new DisposableStore();
		disposables.add(elementDisposables);
		const fileMatchElement = DOM.append(container, DOM.$('.filematch'));
		const label = this.labels.create(fileMatchElement);
		disposables.add(label);
		const badge = new CountBadge(DOM.append(fileMatchElement, DOM.$('.badge')), {}, defaultCountBadgeStyles);
		disposables.add(badge);
		const actionBarContainer = DOM.append(fileMatchElement, DOM.$('.actionBarContainer'));

		const contextKeyServiceMain = disposables.add(this.contextKeyService.createScoped(container));
		SearchContext.AIResultsTitle.bindTo(contextKeyServiceMain).set(false);
		SearchContext.MatchFocusKey.bindTo(contextKeyServiceMain).set(false);
		SearchContext.FileFocusKey.bindTo(contextKeyServiceMain).set(true);
		SearchContext.FolderFocusKey.bindTo(contextKeyServiceMain).set(false);

		const instantiationService = disposables.add(this.instantiationService.createChild(new ServiceCollection([IContextKeyService, contextKeyServiceMain])));
		const actions = disposables.add(instantiationService.createInstance(MenuWorkbenchToolBar, actionBarContainer, MenuId.SearchActionMenu, {
			menuOptions: {
				shouldForwardArgs: true
			},
			hiddenItemStrategy: HiddenItemStrategy.Ignore,
			toolbarOptions: {
				primaryGroup: (g: string) => /^inline/.test(g),
			},
		}));

		return {
			el: fileMatchElement,
			label,
			badge,
			actions,
			disposables,
			elementDisposables,
			contextKeyService: contextKeyServiceMain
		};
	}

	renderElement(node: ITreeNode<ISearchTreeFileMatch, any>, index: number, templateData: IFileMatchTemplate): void {
		const fileMatch = node.element;
		templateData.el.setAttribute('data-resource', fileMatch.resource.toString());

		const decorationConfig = this.configurationService.getValue<ISearchConfigurationProperties>('search').decorations;
		templateData.label.setFile(fileMatch.resource, { range: isSearchTreeAIFileMatch(fileMatch) ? fileMatch.getFullRange() : undefined, hidePath: this.searchView.isTreeLayoutViewVisible && !(isSearchTreeFolderMatchNoRoot(fileMatch.parent())), hideIcon: false, fileDecorations: { colors: decorationConfig.colors, badges: decorationConfig.badges } });
		const count = fileMatch.count();
		templateData.badge.setCount(count);
		templateData.badge.setTitleFormat(count > 1 ? nls.localize('searchMatches', "{0} matches found", count) : nls.localize('searchMatch', "{0} match found", count));

		templateData.actions.context = { viewer: this.searchView.getControl(), element: fileMatch } satisfies ISearchActionContext;

		SearchContext.IsEditableItemKey.bindTo(templateData.contextKeyService).set(!fileMatch.hasOnlyReadOnlyMatches());

		templateData.elementDisposables.add(fileMatch.onChange(() => {
			SearchContext.IsEditableItemKey.bindTo(templateData.contextKeyService).set(!fileMatch.hasOnlyReadOnlyMatches());
		}));

		// when hidesExplorerArrows: true, then the file nodes should still have a twistie because it would otherwise
		// be hard to tell whether the node is collapsed or expanded.
		// eslint-disable-next-line no-restricted-syntax
		const twistieContainer = templateData.el.parentElement?.parentElement?.querySelector('.monaco-tl-twistie');
		twistieContainer?.classList.add('force-twistie');
	}

	disposeElement(element: ITreeNode<RenderableMatch, any>, index: number, templateData: IFileMatchTemplate): void {
		templateData.elementDisposables.clear();
	}

	disposeTemplate(templateData: IFileMatchTemplate): void {
		templateData.disposables.dispose();
	}
}

export class MatchRenderer extends Disposable implements ICompressibleTreeRenderer<ISearchTreeMatch, void, IMatchTemplate> {
	static readonly TEMPLATE_ID = 'match';

	readonly templateId = MatchRenderer.TEMPLATE_ID;

	constructor(
		private searchView: SearchView,
		@IWorkspaceContextService protected contextService: IWorkspaceContextService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IHoverService private readonly hoverService: IHoverService
	) {
		super();
	}
	renderCompressedElements(node: ITreeNode<ICompressedTreeNode<ISearchTreeMatch>, void>, index: number, templateData: IMatchTemplate): void {
		throw new Error('Should never happen since node is incompressible.');
	}

	renderTemplate(container: HTMLElement): IMatchTemplate {
		container.classList.add('linematch');

		const lineNumber = DOM.append(container, DOM.$('span.matchLineNum'));
		const parent = DOM.append(container, DOM.$('a.plain.match'));
		const before = DOM.append(parent, DOM.$('span'));
		const match = DOM.append(parent, DOM.$('span.findInFileMatch'));
		const replace = DOM.append(parent, DOM.$('span.replaceMatch'));
		const after = DOM.append(parent, DOM.$('span'));
		const actionBarContainer = DOM.append(container, DOM.$('span.actionBarContainer'));

		const disposables = new DisposableStore();

		const contextKeyServiceMain = disposables.add(this.contextKeyService.createScoped(container));
		SearchContext.AIResultsTitle.bindTo(contextKeyServiceMain).set(false);
		SearchContext.MatchFocusKey.bindTo(contextKeyServiceMain).set(true);
		SearchContext.FileFocusKey.bindTo(contextKeyServiceMain).set(false);
		SearchContext.FolderFocusKey.bindTo(contextKeyServiceMain).set(false);

		const instantiationService = disposables.add(this.instantiationService.createChild(new ServiceCollection([IContextKeyService, contextKeyServiceMain])));
		const actions = disposables.add(instantiationService.createInstance(MenuWorkbenchToolBar, actionBarContainer, MenuId.SearchActionMenu, {
			menuOptions: {
				shouldForwardArgs: true
			},
			hiddenItemStrategy: HiddenItemStrategy.Ignore,
			toolbarOptions: {
				primaryGroup: (g: string) => /^inline/.test(g),
			},
		}));

		return {
			parent,
			before,
			match,
			replace,
			after,
			lineNumber,
			actions,
			disposables,
			contextKeyService: contextKeyServiceMain
		};
	}

	renderElement(node: ITreeNode<ISearchTreeMatch, any>, index: number, templateData: IMatchTemplate): void {
		const match = node.element;
		const preview = match.preview();
		const replace = this.searchView.model.isReplaceActive() &&
			!!this.searchView.model.replaceString &&
			!match.isReadonly;

		templateData.before.textContent = preview.before;
		templateData.match.textContent = preview.inside;
		templateData.match.classList.toggle('replace', replace);
		templateData.replace.textContent = replace ? match.replaceString : '';
		templateData.after.textContent = preview.after;

		const title = (preview.fullBefore + (replace ? match.replaceString : preview.inside) + preview.after).trim().substr(0, 999);
		templateData.disposables.add(this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), templateData.parent, title));

		SearchContext.IsEditableItemKey.bindTo(templateData.contextKeyService).set(!match.isReadonly);

		const numLines = match.range().endLineNumber - match.range().startLineNumber;
		const extraLinesStr = numLines > 0 ? `+${numLines}` : '';

		const showLineNumbers = this.configurationService.getValue<ISearchConfigurationProperties>('search').showLineNumbers;
		const lineNumberStr = showLineNumbers ? `${match.range().startLineNumber}:` : '';
		templateData.lineNumber.classList.toggle('show', (numLines > 0) || showLineNumbers);

		templateData.lineNumber.textContent = lineNumberStr + extraLinesStr;
		templateData.disposables.add(this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), templateData.lineNumber, this.getMatchTitle(match, showLineNumbers)));

		templateData.actions.context = { viewer: this.searchView.getControl(), element: match } satisfies ISearchActionContext;

	}

	disposeTemplate(templateData: IMatchTemplate): void {
		templateData.disposables.dispose();
	}

	private getMatchTitle(match: ISearchTreeMatch, showLineNumbers: boolean): string {
		const startLine = match.range().startLineNumber;
		const numLines = match.range().endLineNumber - match.range().startLineNumber;

		const lineNumStr = showLineNumbers ?
			nls.localize('lineNumStr', "From line {0}", startLine, numLines) + ' ' :
			'';

		const numLinesStr = numLines > 0 ?
			'+ ' + nls.localize('numLinesStr', "{0} more lines", numLines) :
			'';

		return lineNumStr + numLinesStr;
	}
}

export class SearchAccessibilityProvider implements IListAccessibilityProvider<RenderableMatch> {

	constructor(
		private searchView: SearchView,
		@ILabelService private readonly labelService: ILabelService
	) {
	}

	getWidgetAriaLabel(): string {
		return nls.localize('search', "Search");
	}

	getAriaLabel(element: RenderableMatch): string | null {
		if (isSearchTreeFolderMatch(element)) {
			const count = element.allDownstreamFileMatches().reduce((total, current) => total + current.count(), 0);
			return element.resource ?
				nls.localize('folderMatchAriaLabel', "{0} matches in folder root {1}, Search result", count, element.name()) :
				nls.localize('otherFilesAriaLabel', "{0} matches outside of the workspace, Search result", count);
		}

		if (isSearchTreeFileMatch(element)) {
			const path = this.labelService.getUriLabel(element.resource, { relative: true }) || element.resource.fsPath;

			return nls.localize('fileMatchAriaLabel', "{0} matches in file {1} of folder {2}, Search result", element.count(), element.name(), paths.dirname(path));
		}

		if (isSearchTreeMatch(element)) {
			const match = <ISearchTreeMatch>element;
			const searchModel: ISearchModel = this.searchView.model;
			const replace = searchModel.isReplaceActive() && !!searchModel.replaceString;
			const matchString = match.getMatchString();
			const range = match.range();
			const matchText = match.text().substr(0, range.endColumn + 150);
			if (replace) {
				return nls.localize('replacePreviewResultAria', "'{0}' at column {1} replace {2} with {3}", matchText, range.startColumn, matchString, match.replaceString);
			}

			return nls.localize('searchResultAria', "'{0}' at column {1} found {2}", matchText, range.startColumn, matchString);
		}
		return null;
	}
}
```

--------------------------------------------------------------------------------

````
