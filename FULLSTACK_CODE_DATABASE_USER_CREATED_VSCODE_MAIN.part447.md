---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 447
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 447 of 552)

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

---[FILE: src/vs/workbench/contrib/search/browser/searchView.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/browser/searchView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { StandardKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import * as aria from '../../../../base/browser/ui/aria/aria.js';
import { MessageType } from '../../../../base/browser/ui/inputbox/inputBox.js';
import { IIdentityProvider } from '../../../../base/browser/ui/list/list.js';
import { IAsyncDataSource, ITreeContextMenuEvent, ObjectTreeElementCollapseState } from '../../../../base/browser/ui/tree/tree.js';
import { Delayer, RunOnceScheduler, Throttler } from '../../../../base/common/async.js';
import * as errors from '../../../../base/common/errors.js';
import { Event } from '../../../../base/common/event.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { Disposable, DisposableStore, IDisposable } from '../../../../base/common/lifecycle.js';
import * as strings from '../../../../base/common/strings.js';
import { URI } from '../../../../base/common/uri.js';
import * as network from '../../../../base/common/network.js';
import './media/searchview.css';
import { getCodeEditor, isCodeEditor, isDiffEditor } from '../../../../editor/browser/editorBrowser.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { EmbeddedCodeEditorWidget } from '../../../../editor/browser/widget/codeEditor/embeddedCodeEditorWidget.js';
import { IEditorOptions } from '../../../../editor/common/config/editorOptions.js';
import { Selection } from '../../../../editor/common/core/selection.js';
import { IEditor } from '../../../../editor/common/editorCommon.js';
import { CommonFindController } from '../../../../editor/contrib/find/browser/findController.js';
import { MultiCursorSelectionController } from '../../../../editor/contrib/multicursor/browser/multicursor.js';
import * as nls from '../../../../nls.js';
import { IAccessibilityService } from '../../../../platform/accessibility/common/accessibility.js';
import { MenuId } from '../../../../platform/actions/common/actions.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IConfigurationChangeEvent, IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService, IContextViewService } from '../../../../platform/contextview/browser/contextView.js';
import { IConfirmation, IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { FileChangesEvent, FileChangeType, IFileService } from '../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ServiceCollection } from '../../../../platform/instantiation/common/serviceCollection.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { getSelectionKeyboardEvent, WorkbenchCompressibleAsyncDataTree } from '../../../../platform/list/browser/listService.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IOpenerService, withSelection } from '../../../../platform/opener/common/opener.js';
import { IProgress, IProgressService, IProgressStep } from '../../../../platform/progress/common/progress.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { defaultInputBoxStyles, defaultToggleStyles } from '../../../../platform/theme/browser/defaultStyles.js';
import { IFileIconTheme, IThemeService } from '../../../../platform/theme/common/themeService.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { IWorkspaceContextService, WorkbenchState } from '../../../../platform/workspace/common/workspace.js';
import { OpenFolderAction } from '../../../browser/actions/workspaceActions.js';
import { ResourceListDnDHandler } from '../../../browser/dnd.js';
import { ResourceLabels } from '../../../browser/labels.js';
import { IViewPaneOptions, ViewPane } from '../../../browser/parts/views/viewPane.js';
import { IEditorPane } from '../../../common/editor.js';
import { Memento } from '../../../common/memento.js';
import { IViewDescriptorService } from '../../../common/views.js';
import { NotebookEditor } from '../../notebook/browser/notebookEditor.js';
import { ExcludePatternInputWidget, IncludePatternInputWidget } from './patternInputWidget.js';
import { appendKeyBindingLabel } from './searchActionsBase.js';
import { IFindInFilesArgs } from './searchActionsFind.js';
import { searchDetailsIcon } from './searchIcons.js';
import { renderSearchMessage } from './searchMessage.js';
import { FileMatchRenderer, FolderMatchRenderer, MatchRenderer, SearchAccessibilityProvider, SearchDelegate, TextSearchResultRenderer } from './searchResultsView.js';
import { SearchWidget } from './searchWidget.js';
import * as Constants from '../common/constants.js';
import { IReplaceService } from './replace.js';
import { getOutOfWorkspaceEditorResources, SearchStateKey, SearchUIState } from '../common/search.js';
import { ISearchHistoryService, ISearchHistoryValues, SearchHistoryService } from '../common/searchHistoryService.js';
import { createEditorFromSearchResult } from '../../searchEditor/browser/searchEditorActions.js';
import { ACTIVE_GROUP, IEditorService, SIDE_GROUP } from '../../../services/editor/common/editorService.js';
import { IPreferencesService, ISettingsEditorOptions } from '../../../services/preferences/common/preferences.js';
import { ITextQueryBuilderOptions, QueryBuilder } from '../../../services/search/common/queryBuilder.js';
import { SemanticSearchBehavior, IPatternInfo, ISearchComplete, ISearchConfiguration, ISearchConfigurationProperties, ITextQuery, SearchCompletionExitCode, SearchSortOrder, TextSearchCompleteMessageType, ViewMode, isAIKeyword } from '../../../services/search/common/search.js';
import { AISearchKeyword, TextSearchCompleteMessage } from '../../../services/search/common/searchExtTypes.js';
import { ITextFileService } from '../../../services/textfile/common/textfiles.js';
import { INotebookService } from '../../notebook/common/notebookService.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { AccessibilitySignal, IAccessibilitySignalService } from '../../../../platform/accessibilitySignal/browser/accessibilitySignalService.js';
import { getDefaultHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegateFactory.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { ISearchViewModelWorkbenchService } from './searchTreeModel/searchViewModelWorkbenchService.js';
import { ISearchTreeMatch, isSearchTreeMatch, RenderableMatch, SearchModelLocation, IChangeEvent, FileMatchOrMatch, ISearchTreeFileMatch, ISearchTreeFolderMatch, ISearchModel, ISearchResult, isSearchTreeFileMatch, isSearchTreeFolderMatch, isSearchTreeFolderMatchNoRoot, isSearchTreeFolderMatchWithResource, isSearchTreeFolderMatchWorkspaceRoot, isSearchResult, isTextSearchHeading, ITextSearchHeading, isSearchHeader } from './searchTreeModel/searchTreeCommon.js';
import { INotebookFileInstanceMatch, isIMatchInNotebook } from './notebookSearch/notebookSearchModelBase.js';
import { searchMatchComparer } from './searchCompare.js';
import { AIFolderMatchWorkspaceRootImpl } from './AISearch/aiSearchModel.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { forcedExpandRecursively } from './searchActionsTopBar.js';

const $ = dom.$;

export enum SearchViewPosition {
	SideBar,
	Panel
}

interface ISearchViewStateQuery {
	contentPattern?: string;
	replaceText?: string | false;
	regex?: boolean;
	wholeWords?: boolean;
	caseSensitive?: boolean;
	filePatterns?: string;
	folderExclusions?: string;
	folderIncludes?: string;
	onlyOpenEditors?: boolean;
	queryDetailsExpanded?: string | boolean;
	useExcludesAndIgnoreFiles?: boolean;
	preserveCase?: boolean;
	searchHistory?: string[];
	replaceHistory?: string[];
	isInNotebookMarkdownInput?: boolean;
	isInNotebookMarkdownPreview?: boolean;
	isInNotebookCellInput?: boolean;
	isInNotebookCellOutput?: boolean;
}

interface ISearchViewState {
	query?: ISearchViewStateQuery;
	view?: {
		showReplace?: boolean;
		treeLayout?: boolean;
	};
}

const SEARCH_CANCELLED_MESSAGE = nls.localize('searchCanceled', "Search was canceled before any results could be found - ");
const DEBOUNCE_DELAY = 75;
export class SearchView extends ViewPane {

	private static readonly ACTIONS_RIGHT_CLASS_NAME = 'actions-right';

	private isDisposed = false;

	private container!: HTMLElement;
	private queryBuilder: QueryBuilder;
	private viewModel: ISearchModel;
	private memento: Memento<ISearchViewState>;

	private viewletVisible: IContextKey<boolean>;
	private inputBoxFocused: IContextKey<boolean>;
	private inputPatternIncludesFocused: IContextKey<boolean>;
	private inputPatternExclusionsFocused: IContextKey<boolean>;
	private firstMatchFocused: IContextKey<boolean>;
	private fileMatchOrMatchFocused: IContextKey<boolean>;
	private fileMatchOrFolderMatchFocus: IContextKey<boolean>;
	private fileMatchOrFolderMatchWithResourceFocus: IContextKey<boolean>;
	private fileMatchFocused: IContextKey<boolean>;
	private folderMatchFocused: IContextKey<boolean>;
	private folderMatchWithResourceFocused: IContextKey<boolean>;
	private matchFocused: IContextKey<boolean>;
	private searchResultHeaderFocused: IContextKey<boolean>;
	private isEditableItem: IContextKey<boolean>;
	private hasSearchResultsKey: IContextKey<boolean>;
	private lastFocusState: 'input' | 'tree' = 'input';

	private searchStateKey: IContextKey<SearchUIState>;
	private hasSearchPatternKey: IContextKey<boolean>;
	private hasReplacePatternKey: IContextKey<boolean>;
	private hasFilePatternKey: IContextKey<boolean>;
	private hasSomeCollapsibleResultKey: IContextKey<boolean>;

	private tree!: WorkbenchCompressibleAsyncDataTree<ISearchResult, RenderableMatch>;
	private treeLabels!: ResourceLabels;
	private viewletState: ISearchViewState;
	private messagesElement!: HTMLElement;
	private readonly messageDisposables: DisposableStore = new DisposableStore();
	private searchWidgetsContainerElement!: HTMLElement;
	private searchWidget!: SearchWidget;
	private size!: dom.Dimension;
	private queryDetails!: HTMLElement;
	private toggleQueryDetailsButton!: HTMLElement;
	private inputPatternExcludes!: ExcludePatternInputWidget;
	private inputPatternIncludes!: IncludePatternInputWidget;
	private resultsElement!: HTMLElement;

	private currentSelectedFileMatch: ISearchTreeFileMatch | undefined;

	private delayedRefresh: Delayer<void>;
	private changedWhileHidden: boolean;

	private searchWithoutFolderMessageElement: HTMLElement | undefined;

	private currentSearchQ = Promise.resolve();
	private addToSearchHistoryDelayer: Delayer<void>;

	private toggleCollapseStateDelayer: Delayer<void>;

	private triggerQueryDelayer: Delayer<void>;
	private pauseSearching = false;

	private treeAccessibilityProvider: SearchAccessibilityProvider;

	private treeViewKey: IContextKey<boolean>;

	private _visibleMatches: number = 0;

	private _refreshResultsScheduler: RunOnceScheduler;

	private _onSearchResultChangedDisposable: IDisposable | undefined;
	private _onAIResultChangedDisposable: IDisposable | undefined;

	private searchDataSource: SearchViewDataSource | undefined;

	private refreshTreeController: RefreshTreeController;

	private _cachedResults: ISearchComplete | undefined;
	private _cachedKeywords: string[] = [];
	public _pendingSemanticSearchPromise: Promise<ISearchComplete> | undefined;
	constructor(
		options: IViewPaneOptions,
		@IFileService private readonly fileService: IFileService,
		@IEditorService private readonly editorService: IEditorService,
		@ICodeEditorService private readonly codeEditorService: ICodeEditorService,
		@IProgressService private readonly progressService: IProgressService,
		@INotificationService private readonly notificationService: INotificationService,
		@IDialogService private readonly dialogService: IDialogService,
		@ICommandService private readonly commandService: ICommandService,
		@IContextViewService private readonly contextViewService: IContextViewService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IConfigurationService configurationService: IConfigurationService,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@ISearchViewModelWorkbenchService private readonly searchViewModelWorkbenchService: ISearchViewModelWorkbenchService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IReplaceService private readonly replaceService: IReplaceService,
		@ITextFileService private readonly textFileService: ITextFileService,
		@IPreferencesService private readonly preferencesService: IPreferencesService,
		@IThemeService themeService: IThemeService,
		@ISearchHistoryService private readonly searchHistoryService: ISearchHistoryService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IAccessibilityService private readonly accessibilityService: IAccessibilityService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IStorageService private readonly storageService: IStorageService,
		@IOpenerService openerService: IOpenerService,
		@IHoverService hoverService: IHoverService,
		@INotebookService private readonly notebookService: INotebookService,
		@ILogService private readonly logService: ILogService,
		@IAccessibilitySignalService private readonly accessibilitySignalService: IAccessibilitySignalService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
	) {

		super(options, keybindingService, contextMenuService, configurationService, contextKeyService, viewDescriptorService, instantiationService, openerService, themeService, hoverService);

		this.container = dom.$('.search-view');

		// globals
		this.viewletVisible = Constants.SearchContext.SearchViewVisibleKey.bindTo(this.contextKeyService);
		this.firstMatchFocused = Constants.SearchContext.FirstMatchFocusKey.bindTo(this.contextKeyService);
		this.fileMatchOrMatchFocused = Constants.SearchContext.FileMatchOrMatchFocusKey.bindTo(this.contextKeyService);
		this.fileMatchOrFolderMatchFocus = Constants.SearchContext.FileMatchOrFolderMatchFocusKey.bindTo(this.contextKeyService);
		this.fileMatchOrFolderMatchWithResourceFocus = Constants.SearchContext.FileMatchOrFolderMatchWithResourceFocusKey.bindTo(this.contextKeyService);
		this.fileMatchFocused = Constants.SearchContext.FileFocusKey.bindTo(this.contextKeyService);
		this.folderMatchFocused = Constants.SearchContext.FolderFocusKey.bindTo(this.contextKeyService);
		this.folderMatchWithResourceFocused = Constants.SearchContext.ResourceFolderFocusKey.bindTo(this.contextKeyService);
		this.searchResultHeaderFocused = Constants.SearchContext.SearchResultHeaderFocused.bindTo(this.contextKeyService);
		this.hasSearchResultsKey = Constants.SearchContext.HasSearchResults.bindTo(this.contextKeyService);
		this.matchFocused = Constants.SearchContext.MatchFocusKey.bindTo(this.contextKeyService);
		this.searchStateKey = SearchStateKey.bindTo(this.contextKeyService);
		this.hasSearchPatternKey = Constants.SearchContext.ViewHasSearchPatternKey.bindTo(this.contextKeyService);
		this.hasReplacePatternKey = Constants.SearchContext.ViewHasReplacePatternKey.bindTo(this.contextKeyService);
		this.hasFilePatternKey = Constants.SearchContext.ViewHasFilePatternKey.bindTo(this.contextKeyService);
		this.hasSomeCollapsibleResultKey = Constants.SearchContext.ViewHasSomeCollapsibleKey.bindTo(this.contextKeyService);
		this.treeViewKey = Constants.SearchContext.InTreeViewKey.bindTo(this.contextKeyService);
		this.refreshTreeController = this._register(this.instantiationService.createInstance(RefreshTreeController, this, () => this.searchConfig));

		this._register(this.contextKeyService.onDidChangeContext(e => {
			const keys = Constants.SearchContext.hasAIResultProvider.keys();
			if (e.affectsSome(new Set(keys))) {
				this.refreshHasAISetting();
			}
		}));

		// scoped
		this.contextKeyService = this._register(this.contextKeyService.createScoped(this.container));
		Constants.SearchContext.SearchViewFocusedKey.bindTo(this.contextKeyService).set(true);
		this.inputBoxFocused = Constants.SearchContext.InputBoxFocusedKey.bindTo(this.contextKeyService);
		this.inputPatternIncludesFocused = Constants.SearchContext.PatternIncludesFocusedKey.bindTo(this.contextKeyService);
		this.inputPatternExclusionsFocused = Constants.SearchContext.PatternExcludesFocusedKey.bindTo(this.contextKeyService);
		this.isEditableItem = Constants.SearchContext.IsEditableItemKey.bindTo(this.contextKeyService);

		this.instantiationService = this._register(this.instantiationService.createChild(
			new ServiceCollection([IContextKeyService, this.contextKeyService])));

		this._register(this.configurationService.onDidChangeConfiguration(async e => {
			if (e.affectsConfiguration('search.sortOrder')) {
				if (this.searchConfig.sortOrder === SearchSortOrder.Modified) {
					// If changing away from modified, remove all fileStats
					// so that updated files are re-retrieved next time.
					this.removeFileStats();
				}
				await this.refreshTreeController.queue();
			}
		}));

		this.viewModel = this.searchViewModelWorkbenchService.searchModel;
		this.queryBuilder = this.instantiationService.createInstance(QueryBuilder);
		this.memento = new Memento(this.id, storageService);
		this.viewletState = this.memento.getMemento(StorageScope.WORKSPACE, StorageTarget.MACHINE);

		this._register(this.fileService.onDidFilesChange(e => this.onFilesChanged(e)));
		this._register(this.textFileService.untitled.onWillDispose(model => this.onUntitledDidDispose(model.resource)));
		this._register(this.contextService.onDidChangeWorkbenchState(() => this.onDidChangeWorkbenchState()));
		this._register(this.searchHistoryService.onDidClearHistory(() => this.clearHistory()));
		this._register(this.configurationService.onDidChangeConfiguration(e => this.onConfigurationUpdated(e)));

		this.delayedRefresh = this._register(new Delayer<void>(250));

		this.addToSearchHistoryDelayer = this._register(new Delayer<void>(2000));
		this.toggleCollapseStateDelayer = this._register(new Delayer<void>(100));
		this.triggerQueryDelayer = this._register(new Delayer<void>(0));

		this.treeAccessibilityProvider = this.instantiationService.createInstance(SearchAccessibilityProvider, this);
		this.isTreeLayoutViewVisible = this.viewletState.view?.treeLayout ?? (this.searchConfig.defaultViewMode === ViewMode.Tree);

		this._refreshResultsScheduler = this._register(new RunOnceScheduler(this._updateResults.bind(this), 80));

		// storage service listener for for roaming changes
		this._register(this.storageService.onWillSaveState(() => {
			this._saveSearchHistoryService();
		}));

		this._register(this.storageService.onDidChangeValue(StorageScope.WORKSPACE, SearchHistoryService.SEARCH_HISTORY_KEY, this._store)(() => {
			const restoredHistory = this.searchHistoryService.load();

			if (restoredHistory.include) {
				this.inputPatternIncludes.prependHistory(restoredHistory.include);
			}
			if (restoredHistory.exclude) {
				this.inputPatternExcludes.prependHistory(restoredHistory.exclude);
			}
			if (restoredHistory.search) {
				this.searchWidget.prependSearchHistory(restoredHistory.search);
			}
			if (restoredHistory.replace) {
				this.searchWidget.prependReplaceHistory(restoredHistory.replace);
			}
		}));

		this.changedWhileHidden = this.hasSearchResults();
	}

	public get cachedResults() {
		return this._cachedResults;
	}

	async queueRefreshTree(): Promise<void> {
		return this.refreshTreeController.queue();
	}
	get isTreeLayoutViewVisible(): boolean {
		return this.treeViewKey.get() ?? false;
	}

	private set isTreeLayoutViewVisible(visible: boolean) {
		this.treeViewKey.set(visible);
	}

	async setTreeView(visible: boolean): Promise<void> {
		if (visible === this.isTreeLayoutViewVisible) {
			return;
		}
		this.isTreeLayoutViewVisible = visible;
		this.updateIndentStyles(this.themeService.getFileIconTheme());
		return this.refreshTreeController.queue();
	}

	private get state(): SearchUIState {
		return this.searchStateKey.get() ?? SearchUIState.Idle;
	}

	private set state(v: SearchUIState) {
		this.searchStateKey.set(v);
	}

	getContainer(): HTMLElement {
		return this.container;
	}

	get searchResult(): ISearchResult {
		return this.viewModel && this.viewModel.searchResult;
	}

	get model(): ISearchModel {
		return this.viewModel;
	}

	private async refreshHasAISetting(): Promise<void> {
		const shouldShowAI = this.shouldShowAIResults();
		if (!this.tree || !this.tree.hasNode(this.searchResult)) {
			return;
		}
		if (shouldShowAI && !this.tree.hasNode(this.searchResult.aiTextSearchResult)) {
			if (this.model.searchResult.getCachedSearchComplete(false)) {
				return this.refreshAndUpdateCount();
			}
		} else if (!shouldShowAI && this.tree.hasNode(this.searchResult.aiTextSearchResult)) {
			return this.refreshAndUpdateCount();
		}
	}

	private onDidChangeWorkbenchState(): void {
		if (this.contextService.getWorkbenchState() !== WorkbenchState.EMPTY && this.searchWithoutFolderMessageElement) {
			dom.hide(this.searchWithoutFolderMessageElement);
		}
	}

	private refreshInputs() {
		this.pauseSearching = true;
		this.searchWidget.setValue(this.viewModel.searchResult.query?.contentPattern.pattern ?? '');
		this.searchWidget.setReplaceAllActionState(false);
		this.searchWidget.toggleReplace(true);
		this.inputPatternIncludes.setOnlySearchInOpenEditors(this.viewModel.searchResult.query?.onlyOpenEditors || false);
		this.inputPatternExcludes.setUseExcludesAndIgnoreFiles(!this.viewModel.searchResult.query?.userDisabledExcludesAndIgnoreFiles || true);
		this.searchIncludePattern.setValue('');
		this.searchExcludePattern.setValue('');
		this.pauseSearching = false;
	}

	public async replaceSearchModel(searchModel: ISearchModel, asyncResults: Promise<ISearchComplete>): Promise<void> {
		let progressComplete: () => void;
		this.progressService.withProgress({ location: this.getProgressLocation(), delay: 0 }, _progress => {
			return new Promise<void>(resolve => progressComplete = resolve);
		});

		const slowTimer = setTimeout(() => {
			this.state = SearchUIState.SlowSearch;
		}, 2000);

		this._refreshResultsScheduler.schedule();

		// remove old model and use the new searchModel
		searchModel.location = SearchModelLocation.PANEL;
		searchModel.replaceActive = this.viewModel.isReplaceActive();
		searchModel.replaceString = this.searchWidget.getReplaceValue();
		this._onSearchResultChangedDisposable?.dispose();
		this._onSearchResultChangedDisposable = this._register(searchModel.onSearchResultChanged(async (event) => this.onSearchResultsChanged(event)));

		// this call will also dispose of the old model
		this.searchViewModelWorkbenchService.searchModel = searchModel;
		this.viewModel = searchModel;
		this.tree.setInput(this.viewModel.searchResult);

		await this.onSearchResultsChanged();
		this.refreshInputs();

		asyncResults.then((complete) => {
			clearTimeout(slowTimer);
			return this.onSearchComplete(progressComplete, undefined, undefined, complete);
		}, (e) => {
			clearTimeout(slowTimer);
			return this.onSearchError(e, progressComplete, undefined, undefined);
		});

		await this.expandIfSingularResult();
	}

	protected override renderBody(parent: HTMLElement): void {
		super.renderBody(parent);
		this.container = dom.append(parent, dom.$('.search-view'));

		this.searchWidgetsContainerElement = dom.append(this.container, $('.search-widgets-container'));
		this.createSearchWidget(this.searchWidgetsContainerElement);

		const history = this.searchHistoryService.load();
		const filePatterns = this.viewletState.query?.filePatterns || '';
		const patternExclusions = this.viewletState.query?.folderExclusions || '';
		const patternExclusionsHistory: string[] = history.exclude || [];
		const patternIncludes = this.viewletState.query?.folderIncludes || '';
		const patternIncludesHistory: string[] = history.include || [];
		const onlyOpenEditors = this.viewletState.query?.onlyOpenEditors || false;

		const queryDetailsExpanded = this.viewletState.query?.queryDetailsExpanded || '';
		const useExcludesAndIgnoreFiles = typeof this.viewletState.query?.useExcludesAndIgnoreFiles === 'boolean' ?
			this.viewletState.query.useExcludesAndIgnoreFiles : true;

		this.queryDetails = dom.append(this.searchWidgetsContainerElement, $('.query-details'));

		// Toggle query details button
		const toggleQueryDetailsLabel = nls.localize('moreSearch', "Toggle Search Details");
		this.toggleQueryDetailsButton = dom.append(this.queryDetails,
			$('.more' + ThemeIcon.asCSSSelector(searchDetailsIcon), { tabindex: 0, role: 'button', 'aria-label': toggleQueryDetailsLabel }));
		this._register(this.hoverService.setupManagedHover(getDefaultHoverDelegate('element'), this.toggleQueryDetailsButton, toggleQueryDetailsLabel));

		this._register(dom.addDisposableListener(this.toggleQueryDetailsButton, dom.EventType.CLICK, e => {
			dom.EventHelper.stop(e);
			this.toggleQueryDetails(!this.accessibilityService.isScreenReaderOptimized());
		}));
		this._register(dom.addDisposableListener(this.toggleQueryDetailsButton, dom.EventType.KEY_UP, (e: KeyboardEvent) => {
			const event = new StandardKeyboardEvent(e);

			if (event.equals(KeyCode.Enter) || event.equals(KeyCode.Space)) {
				dom.EventHelper.stop(e);
				this.toggleQueryDetails(false);
			}
		}));
		this._register(dom.addDisposableListener(this.toggleQueryDetailsButton, dom.EventType.KEY_DOWN, (e: KeyboardEvent) => {
			const event = new StandardKeyboardEvent(e);

			if (event.equals(KeyMod.Shift | KeyCode.Tab)) {
				if (this.searchWidget.isReplaceActive()) {
					this.searchWidget.focusReplaceAllAction();
				} else {
					this.searchWidget.isReplaceShown() ? this.searchWidget.replaceInput?.focusOnPreserve() : this.searchWidget.focusRegexAction();
				}
				dom.EventHelper.stop(e);
			}
		}));

		// folder includes list
		const folderIncludesList = dom.append(this.queryDetails, $('.file-types.includes'));
		const filesToIncludeTitle = nls.localize('searchScope.includes', "files to include");
		dom.append(folderIncludesList, $('h4', undefined, filesToIncludeTitle));

		this.inputPatternIncludes = this._register(this.instantiationService.createInstance(IncludePatternInputWidget, folderIncludesList, this.contextViewService, {
			ariaLabel: filesToIncludeTitle,
			placeholder: nls.localize('placeholder.includes', "e.g. *.ts, src/**/include"),
			showPlaceholderOnFocus: true,
			history: patternIncludesHistory,
			inputBoxStyles: defaultInputBoxStyles
		}));

		this.inputPatternIncludes.setValue(patternIncludes);
		this.inputPatternIncludes.setOnlySearchInOpenEditors(onlyOpenEditors);

		this._register(this.inputPatternIncludes.onCancel(() => this.cancelSearch(false)));
		this._register(this.inputPatternIncludes.onChangeSearchInEditorsBox(() => this.triggerQueryChange()));

		this.trackInputBox(this.inputPatternIncludes.inputFocusTracker, this.inputPatternIncludesFocused);

		// excludes list
		const excludesList = dom.append(this.queryDetails, $('.file-types.excludes'));
		const excludesTitle = nls.localize('searchScope.excludes', "files to exclude");
		dom.append(excludesList, $('h4', undefined, excludesTitle));
		this.inputPatternExcludes = this._register(this.instantiationService.createInstance(ExcludePatternInputWidget, excludesList, this.contextViewService, {
			ariaLabel: excludesTitle,
			placeholder: nls.localize('placeholder.excludes', "e.g. *.ts, src/**/exclude"),
			showPlaceholderOnFocus: true,
			history: patternExclusionsHistory,
			inputBoxStyles: defaultInputBoxStyles
		}));

		this.inputPatternExcludes.setValue(patternExclusions);
		this.inputPatternExcludes.setUseExcludesAndIgnoreFiles(useExcludesAndIgnoreFiles);

		this._register(this.inputPatternExcludes.onCancel(() => this.cancelSearch(false)));
		this._register(this.inputPatternExcludes.onChangeIgnoreBox(() => this.triggerQueryChange()));
		this.trackInputBox(this.inputPatternExcludes.inputFocusTracker, this.inputPatternExclusionsFocused);

		const updateHasFilePatternKey = () => this.hasFilePatternKey.set(this.inputPatternIncludes.getValue().length > 0 || this.inputPatternExcludes.getValue().length > 0);
		updateHasFilePatternKey();
		const onFilePatternSubmit = (triggeredOnType: boolean) => {
			this.triggerQueryChange({ triggeredOnType, delay: this.searchConfig.searchOnTypeDebouncePeriod });
			if (triggeredOnType) {
				updateHasFilePatternKey();
			}
		};
		this._register(this.inputPatternIncludes.onSubmit(onFilePatternSubmit));
		this._register(this.inputPatternExcludes.onSubmit(onFilePatternSubmit));

		this.messagesElement = dom.append(this.container, $('.messages.text-search-provider-messages'));
		if (this.contextService.getWorkbenchState() === WorkbenchState.EMPTY) {
			this.showSearchWithoutFolderMessage();
		}

		this.createSearchResultsView(this.container);

		if (filePatterns !== '' || patternExclusions !== '' || patternIncludes !== '' || queryDetailsExpanded !== '' || !useExcludesAndIgnoreFiles) {
			this.toggleQueryDetails(true, true, true);
		}

		this._onSearchResultChangedDisposable = this._register(this.viewModel.onSearchResultChanged(async (event) => await this.onSearchResultsChanged(event)));

		// Subscribe to AI search result changes and update the tree when new AI results are reported
		this._onAIResultChangedDisposable?.dispose();
		this._onAIResultChangedDisposable = this._register(
			this.viewModel.searchResult.aiTextSearchResult.onChange((e) => {
				// Only refresh the AI node, not the whole tree
				if (this.tree && this.tree.hasNode(this.searchResult.aiTextSearchResult) && !e.removed) {
					this.tree.updateChildren(this.searchResult.aiTextSearchResult);
				}
			})
		);

		this._register(this.onDidChangeBodyVisibility(visible => this.onVisibilityChanged(visible)));

		this.updateIndentStyles(this.themeService.getFileIconTheme());
		this._register(this.themeService.onDidFileIconThemeChange(this.updateIndentStyles, this));
	}

	private updateIndentStyles(theme: IFileIconTheme): void {
		this.resultsElement.classList.toggle('hide-arrows', this.isTreeLayoutViewVisible && theme.hidesExplorerArrows);
	}

	private async onVisibilityChanged(visible: boolean): Promise<void> {
		this.viewletVisible.set(visible);
		if (visible) {
			if (this.changedWhileHidden) {
				// Render if results changed while viewlet was hidden - #37818
				await this.refreshAndUpdateCount();
				this.changedWhileHidden = false;
			}
		} else {
			// Reset last focus to input to preserve opening the viewlet always focusing the query editor.
			this.lastFocusState = 'input';
		}

		// Enable highlights if there are searchresults
		this.viewModel?.searchResult.toggleHighlights(visible);
	}

	get searchAndReplaceWidget(): SearchWidget {
		return this.searchWidget;
	}

	get searchIncludePattern(): IncludePatternInputWidget {
		return this.inputPatternIncludes;
	}

	get searchExcludePattern(): ExcludePatternInputWidget {
		return this.inputPatternExcludes;
	}

	private createSearchWidget(container: HTMLElement): void {
		const contentPattern = this.viewletState.query?.contentPattern || '';
		const replaceText = this.viewletState.query?.replaceText || '';
		const isRegex = this.viewletState.query?.regex === true;
		const isWholeWords = this.viewletState.query?.wholeWords === true;
		const isCaseSensitive = this.viewletState.query?.caseSensitive === true;
		const history = this.searchHistoryService.load();
		const searchHistory = history.search || this.viewletState.query?.searchHistory || [];
		const replaceHistory = history.replace || this.viewletState.query?.replaceHistory || [];
		const showReplace = typeof this.viewletState.view?.showReplace === 'boolean' ? this.viewletState.view.showReplace : true;
		const preserveCase = this.viewletState.query?.preserveCase === true;

		const isInNotebookMarkdownInput = this.viewletState.query?.isInNotebookMarkdownInput ?? true;
		const isInNotebookMarkdownPreview = this.viewletState.query?.isInNotebookMarkdownPreview ?? true;
		const isInNotebookCellInput = this.viewletState.query?.isInNotebookCellInput ?? true;
		const isInNotebookCellOutput = this.viewletState.query?.isInNotebookCellOutput ?? true;

		this.searchWidget = this._register(this.instantiationService.createInstance(SearchWidget, container, {
			value: contentPattern,
			replaceValue: replaceText,
			isRegex: isRegex,
			isCaseSensitive: isCaseSensitive,
			isWholeWords: isWholeWords,
			searchHistory: searchHistory,
			replaceHistory: replaceHistory,
			preserveCase: preserveCase,
			inputBoxStyles: defaultInputBoxStyles,
			toggleStyles: defaultToggleStyles,
			notebookOptions: {
				isInNotebookMarkdownInput,
				isInNotebookMarkdownPreview,
				isInNotebookCellInput,
				isInNotebookCellOutput,
			}
		}));

		if (!this.searchWidget.searchInput || !this.searchWidget.replaceInput) {
			this.logService.warn(`Cannot fully create search widget. Search or replace input undefined. SearchInput: ${this.searchWidget.searchInput}, ReplaceInput: ${this.searchWidget.replaceInput}`);
			return;
		}

		if (showReplace) {
			this.searchWidget.toggleReplace(true);
		}

		this._register(this.searchWidget.onSearchSubmit(options => {
			const shouldRenderAIResults = this.configurationService.getValue<ISearchConfigurationProperties>('search').searchView.semanticSearchBehavior;
			if (shouldRenderAIResults === SemanticSearchBehavior.Auto) {
				this.logService.info(`SearchView: Automatically rendering AI results`);
			}
			this.triggerQueryChange({
				...options,
				shouldKeepAIResults: false,
				shouldUpdateAISearch: shouldRenderAIResults === SemanticSearchBehavior.Auto,
			});
		}));
		this._register(this.searchWidget.onSearchCancel(({ focus }) => this.cancelSearch(focus)));
		this._register(this.searchWidget.searchInput.onDidOptionChange(() => {
			this.triggerQueryChange({ shouldKeepAIResults: true });
		}));

		this._register(this.searchWidget.getNotebookFilters().onDidChange(() => this.triggerQueryChange({ shouldKeepAIResults: true })));

		const updateHasPatternKey = () => this.hasSearchPatternKey.set(this.searchWidget.searchInput ? (this.searchWidget.searchInput.getValue().length > 0) : false);
		updateHasPatternKey();
		this._register(this.searchWidget.searchInput.onDidChange(() => updateHasPatternKey()));

		const updateHasReplacePatternKey = () => this.hasReplacePatternKey.set(this.searchWidget.getReplaceValue().length > 0);
		updateHasReplacePatternKey();
		this._register(this.searchWidget.replaceInput.inputBox.onDidChange(() => updateHasReplacePatternKey()));

		this._register(this.searchWidget.onDidHeightChange(() => this.reLayout()));

		this._register(this.searchWidget.onReplaceToggled(() => this.reLayout()));
		this._register(this.searchWidget.onReplaceStateChange(async (state) => {
			this.viewModel.replaceActive = state;
			await this.refreshTreeController.queue();
		}));

		this._register(this.searchWidget.onPreserveCaseChange(async (state) => {
			this.viewModel.preserveCase = state;
			await this.refreshTreeController.queue();
		}));

		this._register(this.searchWidget.onReplaceValueChanged(() => {
			this.viewModel.replaceString = this.searchWidget.getReplaceValue();
			this.delayedRefresh.trigger(async () => this.refreshTreeController.queue());
		}));

		this._register(this.searchWidget.onBlur(() => {
			this.toggleQueryDetailsButton.focus();
		}));

		this._register(this.searchWidget.onReplaceAll(() => this.replaceAll()));

		this.trackInputBox(this.searchWidget.searchInputFocusTracker);
		this.trackInputBox(this.searchWidget.replaceInputFocusTracker);
	}

	public shouldShowAIResults(): boolean {
		const hasProvider = Constants.SearchContext.hasAIResultProvider.getValue(this.contextKeyService);
		return !!hasProvider;
	}
	private async onConfigurationUpdated(event?: IConfigurationChangeEvent): Promise<void> {
		if (event && (event.affectsConfiguration('search.decorations.colors') || event.affectsConfiguration('search.decorations.badges'))) {
			return this.refreshTreeController.queue();
		}
	}

	private trackInputBox(inputFocusTracker: dom.IFocusTracker | undefined, contextKey?: IContextKey<boolean>): void {
		if (!inputFocusTracker) {
			return;
		}

		this._register(inputFocusTracker.onDidFocus(() => {
			this.lastFocusState = 'input';
			this.inputBoxFocused.set(true);
			contextKey?.set(true);
		}));
		this._register(inputFocusTracker.onDidBlur(() => {
			this.inputBoxFocused.set(this.searchWidget.searchInputHasFocus()
				|| this.searchWidget.replaceInputHasFocus()
				|| this.inputPatternIncludes.inputHasFocus()
				|| this.inputPatternExcludes.inputHasFocus());
			contextKey?.set(false);
		}));
	}

	private async onSearchResultsChanged(event?: IChangeEvent): Promise<void> {
		if (this.isVisible()) {
			return this.refreshAndUpdateCount(event);
		} else {
			this.changedWhileHidden = true;
		}
	}

	private async refreshAndUpdateCount(event?: IChangeEvent): Promise<void> {
		this.searchWidget.setReplaceAllActionState(!this.viewModel.searchResult.isEmpty());
		this.updateSearchResultCount(this.viewModel.searchResult.query!.userDisabledExcludesAndIgnoreFiles, this.viewModel.searchResult.query?.onlyOpenEditors, event?.clearingAll);
		return this.refreshTreeController.queue(event);
	}

	private originalShouldCollapse(match: RenderableMatch) {
		const collapseResults = this.searchConfig.collapseResults;
		return (collapseResults === 'alwaysCollapse' ||
			(!(isSearchTreeMatch(match)) && match.count() > 10 && collapseResults !== 'alwaysExpand')) ?
			ObjectTreeElementCollapseState.PreserveOrCollapsed : ObjectTreeElementCollapseState.PreserveOrExpanded;
	}

	private shouldCollapseAccordingToConfig(match: RenderableMatch): boolean {
		const collapseResults = this.originalShouldCollapse(match);
		if (collapseResults === ObjectTreeElementCollapseState.PreserveOrCollapsed) {
			return true;
		}
		return false;
	}

	private replaceAll(): void {
		if (this.viewModel.searchResult.count() === 0) {
			return;
		}

		const occurrences = this.viewModel.searchResult.count();
		const fileCount = this.viewModel.searchResult.fileCount();
		const replaceValue = this.searchWidget.getReplaceValue() || '';
		const afterReplaceAllMessage = this.buildAfterReplaceAllMessage(occurrences, fileCount, replaceValue);

		let progressComplete: () => void;
		let progressReporter: IProgress<IProgressStep>;

		this.progressService.withProgress({ location: this.getProgressLocation(), delay: 100, total: occurrences }, p => {
			progressReporter = p;

			return new Promise<void>(resolve => progressComplete = resolve);
		});

		const confirmation: IConfirmation = {
			title: nls.localize('replaceAll.confirmation.title', "Replace All"),
			message: this.buildReplaceAllConfirmationMessage(occurrences, fileCount, replaceValue),
			primaryButton: nls.localize({ key: 'replaceAll.confirm.button', comment: ['&& denotes a mnemonic'] }, "&&Replace")
		};

		this.dialogService.confirm(confirmation).then(res => {
			if (res.confirmed) {
				this.searchWidget.setReplaceAllActionState(false);
				this.viewModel.searchResult.replaceAll(progressReporter).then(() => {
					progressComplete();
					const messageEl = this.clearMessage();
					dom.append(messageEl, afterReplaceAllMessage);
					this.reLayout();
				}, (error) => {
					progressComplete();
					errors.isCancellationError(error);
					this.notificationService.error(error);
				});
			} else {
				progressComplete();
			}
		});
	}

	private buildAfterReplaceAllMessage(occurrences: number, fileCount: number, replaceValue?: string) {
		if (occurrences === 1) {
			if (fileCount === 1) {
				if (replaceValue) {
					return nls.localize('replaceAll.occurrence.file.message', "Replaced {0} occurrence across {1} file with '{2}'.", occurrences, fileCount, replaceValue);
				}

				return nls.localize('removeAll.occurrence.file.message', "Replaced {0} occurrence across {1} file.", occurrences, fileCount);
			}

			if (replaceValue) {
				return nls.localize('replaceAll.occurrence.files.message', "Replaced {0} occurrence across {1} files with '{2}'.", occurrences, fileCount, replaceValue);
			}

			return nls.localize('removeAll.occurrence.files.message', "Replaced {0} occurrence across {1} files.", occurrences, fileCount);
		}

		if (fileCount === 1) {
			if (replaceValue) {
				return nls.localize('replaceAll.occurrences.file.message', "Replaced {0} occurrences across {1} file with '{2}'.", occurrences, fileCount, replaceValue);
			}

			return nls.localize('removeAll.occurrences.file.message', "Replaced {0} occurrences across {1} file.", occurrences, fileCount);
		}

		if (replaceValue) {
			return nls.localize('replaceAll.occurrences.files.message', "Replaced {0} occurrences across {1} files with '{2}'.", occurrences, fileCount, replaceValue);
		}

		return nls.localize('removeAll.occurrences.files.message', "Replaced {0} occurrences across {1} files.", occurrences, fileCount);
	}

	private buildReplaceAllConfirmationMessage(occurrences: number, fileCount: number, replaceValue?: string) {
		// Helper to truncate long values to 10 lines max
		const truncateValue = (value: string | undefined): string | undefined => {
			if (!value) {
				return value;
			}
			const lines = value.split('\n');
			if (lines.length > 10) {
				return lines.slice(0, 10).join('\n') + '\n...';
			}
			return value;
		};

		const displayReplaceValue = truncateValue(replaceValue);

		if (occurrences === 1) {
			if (fileCount === 1) {
				if (displayReplaceValue) {
					return nls.localize('removeAll.occurrence.file.confirmation.message', "Replace {0} occurrence across {1} file with '{2}'?", occurrences, fileCount, displayReplaceValue);
				}

				return nls.localize('replaceAll.occurrence.file.confirmation.message', "Replace {0} occurrence across {1} file?", occurrences, fileCount);
			}

			if (displayReplaceValue) {
				return nls.localize('removeAll.occurrence.files.confirmation.message', "Replace {0} occurrence across {1} files with '{2}'?", occurrences, fileCount, displayReplaceValue);
			}

			return nls.localize('replaceAll.occurrence.files.confirmation.message', "Replace {0} occurrence across {1} files?", occurrences, fileCount);
		}

		if (fileCount === 1) {
			if (displayReplaceValue) {
				return nls.localize('removeAll.occurrences.file.confirmation.message', "Replace {0} occurrences across {1} file with '{2}'?", occurrences, fileCount, displayReplaceValue);
			}

			return nls.localize('replaceAll.occurrences.file.confirmation.message', "Replace {0} occurrences across {1} file?", occurrences, fileCount);
		}

		if (displayReplaceValue) {
			return nls.localize('removeAll.occurrences.files.confirmation.message', "Replace {0} occurrences across {1} files with '{2}'?", occurrences, fileCount, displayReplaceValue);
		}

		return nls.localize('replaceAll.occurrences.files.confirmation.message', "Replace {0} occurrences across {1} files?", occurrences, fileCount);
	}

	private clearMessage(): HTMLElement {
		this.searchWithoutFolderMessageElement = undefined;

		const wasHidden = this.messagesElement.style.display === 'none';
		dom.clearNode(this.messagesElement);
		dom.show(this.messagesElement);
		this.messageDisposables.clear();

		const newMessage = dom.append(this.messagesElement, $('.message'));
		if (wasHidden) {
			this.reLayout();
		}

		return newMessage;
	}

	private createSearchResultsView(container: HTMLElement): void {
		this.resultsElement = dom.append(container, $('.results.show-file-icons.file-icon-themable-tree'));
		const delegate = this.instantiationService.createInstance(SearchDelegate);

		const identityProvider: IIdentityProvider<RenderableMatch> = {
			getId(element: RenderableMatch) {
				return element.id();
			}
		};

		this.searchDataSource = this.instantiationService.createInstance(SearchViewDataSource, this);
		this.treeLabels = this._register(this.instantiationService.createInstance(ResourceLabels, { onDidChangeVisibility: this.onDidChangeBodyVisibility }));
		this.tree = this._register(this.instantiationService.createInstance(WorkbenchCompressibleAsyncDataTree<ISearchResult, RenderableMatch>,
			'SearchView',
			this.resultsElement,
			delegate,
			{
				isIncompressible: (element: RenderableMatch) => {

					if (isSearchTreeFolderMatch(element) && !isTextSearchHeading(element.parent()) && !(isSearchTreeFolderMatchWorkspaceRoot(element.parent())) && !(isSearchTreeFolderMatchNoRoot(element.parent()))) {
						return false;
					}
					return true;
				}
			},
			[
				this._register(this.instantiationService.createInstance(FolderMatchRenderer, this, this.treeLabels)),
				this._register(this.instantiationService.createInstance(FileMatchRenderer, this, this.treeLabels)),
				this._register(this.instantiationService.createInstance(TextSearchResultRenderer, this.treeLabels)),
				this._register(this.instantiationService.createInstance(MatchRenderer, this)),
			],
			this.searchDataSource,
			{
				identityProvider,
				accessibilityProvider: this.treeAccessibilityProvider,
				dnd: this.instantiationService.createInstance(ResourceListDnDHandler, element => {
					if (isSearchTreeFileMatch(element)) {
						return element.resource;
					}
					if (isSearchTreeMatch(element)) {
						return withSelection(element.parent().resource, element.range());
					}
					return null;
				}),
				multipleSelectionSupport: true,
				selectionNavigation: true,
				overrideStyles: this.getLocationBasedColors().listOverrideStyles,
				paddingBottom: SearchDelegate.ITEM_HEIGHT,
				collapseByDefault: (e: RenderableMatch) => {
					if (isTextSearchHeading(e)) {
						// always collapse the ai text search result, but always expand the text result
						return e.isAIContributed;
					}

					// always expand compressed nodes
					if (isSearchTreeFolderMatch(e) && e.matches().length === 1 && isSearchTreeFolderMatch(e.matches()[0])) {
						return false;
					}
					return this.shouldCollapseAccordingToConfig(e);
				}
			}));

		Constants.SearchContext.SearchResultListFocusedKey.bindTo(this.tree.contextKeyService);

		this.tree.setInput(this.viewModel.searchResult);
		this._register(this.tree.onContextMenu(e => this.onContextMenu(e)));
		const updateHasSomeCollapsible = () => this.toggleCollapseStateDelayer.trigger(() => this.hasSomeCollapsibleResultKey.set(this.hasSomeCollapsible()));
		updateHasSomeCollapsible();
		this._register(this.tree.onDidChangeCollapseState(() => updateHasSomeCollapsible()));
		this._register(this.tree.onDidChangeModel(() => updateHasSomeCollapsible()));

		this._register(Event.debounce(this.tree.onDidOpen, (last, event) => event, DEBOUNCE_DELAY, true)(options => {
			if (isSearchTreeMatch(options.element)) {
				const selectedMatch: ISearchTreeMatch = options.element;
				this.currentSelectedFileMatch?.setSelectedMatch(null);
				this.currentSelectedFileMatch = selectedMatch.parent();
				this.currentSelectedFileMatch.setSelectedMatch(selectedMatch);

				this.onFocus(selectedMatch, options.editorOptions.preserveFocus, options.sideBySide, options.editorOptions.pinned);
			}
		}));

		this._register(Event.debounce(this.tree.onDidChangeFocus, (last, event) => event, DEBOUNCE_DELAY, true)(() => {
			const selection = this.tree.getSelection();
			const focus = this.tree.getFocus()[0];
			if (selection.length > 1 && isSearchTreeMatch(focus)) {
				this.onFocus(focus, true);
			}
		}));

		this._register(Event.any<any>(this.tree.onDidFocus, this.tree.onDidChangeFocus)(() => {
			const focus = this.tree.getFocus()[0];

			if (this.tree.isDOMFocused()) {
				const firstElem = this.tree.getFirstElementChild(this.tree.getInput());
				this.firstMatchFocused.set(firstElem === focus);
				this.fileMatchOrMatchFocused.set(!!focus);
				this.fileMatchFocused.set(isSearchTreeFileMatch(focus));
				this.folderMatchFocused.set(isSearchTreeFolderMatch(focus));
				this.matchFocused.set(isSearchTreeMatch(focus));
				this.fileMatchOrFolderMatchFocus.set(isSearchTreeFileMatch(focus) || isSearchTreeFolderMatch(focus));
				this.fileMatchOrFolderMatchWithResourceFocus.set(isSearchTreeFileMatch(focus) || isSearchTreeFolderMatchWithResource(focus));
				this.folderMatchWithResourceFocused.set(isSearchTreeFolderMatchWithResource(focus));
				this.searchResultHeaderFocused.set(isSearchHeader(focus));
				this.lastFocusState = 'tree';
			}

			let editable = false;
			if (isSearchTreeMatch(focus)) {
				editable = !focus.isReadonly;
			} else if (isSearchTreeFileMatch(focus)) {
				editable = !focus.hasOnlyReadOnlyMatches();
			} else if (isSearchTreeFolderMatch(focus)) {
				editable = !focus.hasOnlyReadOnlyMatches();
			}
			this.isEditableItem.set(editable);
		}));

		this._register(this.tree.onDidBlur(() => {
			this.firstMatchFocused.reset();
			this.fileMatchOrMatchFocused.reset();
			this.fileMatchFocused.reset();
			this.folderMatchFocused.reset();
			this.matchFocused.reset();
			this.fileMatchOrFolderMatchFocus.reset();
			this.fileMatchOrFolderMatchWithResourceFocus.reset();
			this.folderMatchWithResourceFocused.reset();
			this.searchResultHeaderFocused.reset();
			this.isEditableItem.reset();
		}));
	}

	private onContextMenu(e: ITreeContextMenuEvent<RenderableMatch | null>): void {

		e.browserEvent.preventDefault();
		e.browserEvent.stopPropagation();
		const selection = this.tree.getSelection();
		let arg: any;
		let context: any;
		if (selection && selection.length > 0) {
			arg = e.element;
			context = selection;
		} else {
			context = e.element;
		}

		this.contextMenuService.showContextMenu({
			menuId: MenuId.SearchContext,
			menuActionOptions: { shouldForwardArgs: true, arg },
			contextKeyService: this.contextKeyService,
			getAnchor: () => e.anchor,
			getActionsContext: () => context,
		});
	}

	private hasSomeCollapsible(): boolean {
		const viewer = this.getControl();
		const navigator = viewer.navigate();
		let node = navigator.first();
		const shouldShowAI = this.shouldShowAIResults();
		do {
			if (node && !viewer.isCollapsed(node) && (!shouldShowAI || !(isTextSearchHeading(node)))) {
				// ignore the ai text search result id
				return true;
			}
		} while (node = navigator.next());

		return false;
	}

	async selectNextMatch(): Promise<void> {
		if (!this.hasSearchResults()) {
			return;
		}

		const [selected] = this.tree.getSelection();

		// Expand the initial selected node, if needed
		if (selected && !(isSearchTreeMatch(selected))) {
			if (this.tree.isCollapsed(selected)) {
				await this.tree.expand(selected);
			}
		}

		const navigator = this.tree.navigate(selected);

		let next = navigator.next();
		if (!next) {
			next = navigator.first();
		}

		// Expand until first child is a Match
		while (next && !(isSearchTreeMatch(next))) {
			if (this.tree.isCollapsed(next)) {
				await this.tree.expand(next);
			}

			// Select the first child
			next = navigator.next();
		}

		// Reveal the newly selected element
		if (next) {
			if (next === selected) {
				this.tree.setFocus([]);
			}
			const event = getSelectionKeyboardEvent(undefined, false, false);
			this.tree.setFocus([next], event);
			this.tree.setSelection([next], event);
			this.tree.reveal(next);
			const ariaLabel = this.treeAccessibilityProvider.getAriaLabel(next);
			if (ariaLabel) { aria.status(ariaLabel); }
		}
	}

	async selectPreviousMatch(): Promise<void> {
		if (!this.hasSearchResults()) {
			return;
		}

		const [selected] = this.tree.getSelection();
		let navigator = this.tree.navigate(selected);

		let prev = navigator.previous();

		// Select previous until find a Match or a collapsed item
		while (!prev || (!(isSearchTreeMatch(prev)) && !this.tree.isCollapsed(prev))) {
			const nextPrev = prev ? navigator.previous() : navigator.last();

			if (!prev && !nextPrev) {
				return;
			}

			prev = nextPrev;
		}

		// Expand until last child is a Match
		while (prev && !(isSearchTreeMatch(prev))) {
			const nextItem = navigator.next();
			if (!nextItem) {
				break;
			}
			await this.tree.expand(prev);
			navigator = this.tree.navigate(nextItem); // recreate navigator because modifying the tree can invalidate it
			prev = nextItem ? navigator.previous() : navigator.last(); // select last child
		}

		// Reveal the newly selected element
		if (prev) {
			if (prev === selected) {
				this.tree.setFocus([]);
			}
			const event = getSelectionKeyboardEvent(undefined, false, false);
			this.tree.setFocus([prev], event);
			this.tree.setSelection([prev], event);
			this.tree.reveal(prev);
			const ariaLabel = this.treeAccessibilityProvider.getAriaLabel(prev);
			if (ariaLabel) { aria.status(ariaLabel); }
		}
	}

	moveFocusToResults(): void {
		this.tree.domFocus();
	}

	override focus(): void {
		super.focus();
		if (this.lastFocusState === 'input' || !this.hasSearchResults()) {
			const updatedText = this.searchConfig.seedOnFocus ? this.updateTextFromSelection({ allowSearchOnType: false }) : false;
			this.searchWidget.focus(undefined, undefined, updatedText);
		} else {
			this.tree.domFocus();
		}
	}

	updateTextFromFindWidgetOrSelection({ allowUnselectedWord = true, allowSearchOnType = true }): boolean {
		let activeEditor = this.editorService.activeTextEditorControl;
		if (isCodeEditor(activeEditor) && !activeEditor?.hasTextFocus()) {
			const controller = CommonFindController.get(activeEditor);
			if (controller && controller.isFindInputFocused()) {
				return this.updateTextFromFindWidget(controller, { allowSearchOnType });
			}

			const editors = this.codeEditorService.listCodeEditors();
			activeEditor = editors.find(editor => editor instanceof EmbeddedCodeEditorWidget && editor.getParentEditor() === activeEditor && editor.hasTextFocus())
				?? activeEditor;
		}

		return this.updateTextFromSelection({ allowUnselectedWord, allowSearchOnType }, activeEditor);
	}

	private updateTextFromFindWidget(controller: CommonFindController, { allowSearchOnType = true }): boolean {
		if (!this.searchConfig.seedWithNearestWord && (dom.getActiveWindow().getSelection()?.toString() ?? '') === '') {
			return false;
		}

		const searchString = controller.getState().searchString;
		if (searchString === '') {
			return false;
		}

		this.searchWidget.searchInput?.setCaseSensitive(controller.getState().matchCase);
		this.searchWidget.searchInput?.setWholeWords(controller.getState().wholeWord);
		this.searchWidget.searchInput?.setRegex(controller.getState().isRegex);
		this.updateText(searchString, allowSearchOnType);

		return true;
	}

	private updateTextFromSelection({ allowUnselectedWord = true, allowSearchOnType = true }, editor?: IEditor): boolean {
		const seedSearchStringFromSelection = this.configurationService.getValue<IEditorOptions>('editor').find!.seedSearchStringFromSelection;
		if (!seedSearchStringFromSelection || seedSearchStringFromSelection === 'never') {
			return false;
		}

		let selectedText = this.getSearchTextFromEditor(allowUnselectedWord, editor);
		if (selectedText === null) {
			return false;
		}

		if (this.searchWidget.searchInput?.getRegex()) {
			selectedText = strings.escapeRegExpCharacters(selectedText);
		}

		this.updateText(selectedText, allowSearchOnType);
		return true;
	}

	private updateText(text: string, allowSearchOnType: boolean = true) {
		if (allowSearchOnType && !this.viewModel.searchResult.isDirty) {
			this.searchWidget.setValue(text);
		} else {
			this.pauseSearching = true;
			this.searchWidget.setValue(text);
			this.pauseSearching = false;
		}
	}

	focusNextInputBox(): void {
		if (this.searchWidget.searchInputHasFocus()) {
			if (this.searchWidget.isReplaceShown()) {
				this.searchWidget.focus(true, true);
			} else {
				this.moveFocusFromSearchOrReplace();
			}
			return;
		}

		if (this.searchWidget.replaceInputHasFocus()) {
			this.moveFocusFromSearchOrReplace();
			return;
		}

		if (this.inputPatternIncludes.inputHasFocus()) {
			this.inputPatternExcludes.focus();
			this.inputPatternExcludes.select();
			return;
		}

		if (this.inputPatternExcludes.inputHasFocus()) {
			this.selectTreeIfNotSelected();
			return;
		}
	}

	private moveFocusFromSearchOrReplace() {
		if (this.showsFileTypes()) {
			this.toggleQueryDetails(true, this.showsFileTypes());
		} else {
			this.selectTreeIfNotSelected();
		}
	}

	focusPreviousInputBox(): void {
		if (this.searchWidget.searchInputHasFocus()) {
			return;
		}

		if (this.searchWidget.replaceInputHasFocus()) {
			this.searchWidget.focus(true);
			return;
		}

		if (this.inputPatternIncludes.inputHasFocus()) {
			this.searchWidget.focus(true, true);
			return;
		}

		if (this.inputPatternExcludes.inputHasFocus()) {
			this.inputPatternIncludes.focus();
			this.inputPatternIncludes.select();
			return;
		}

		if (this.tree.isDOMFocused()) {
			this.moveFocusFromResults();
			return;
		}
	}

	private moveFocusFromResults(): void {
		if (this.showsFileTypes()) {
			this.toggleQueryDetails(true, true, false, true);
		} else {
			this.searchWidget.focus(true, true);
		}
	}

	private reLayout(): void {
		if (this.isDisposed || !this.size) {
			return;
		}

		const actionsPosition = this.searchConfig.actionsPosition;
		this.getContainer().classList.toggle(SearchView.ACTIONS_RIGHT_CLASS_NAME, actionsPosition === 'right');

		this.searchWidget.setWidth(this.size.width - 28 /* container margin */);

		this.inputPatternExcludes.setWidth(this.size.width - 28 /* container margin */);
		this.inputPatternIncludes.setWidth(this.size.width - 28 /* container margin */);

		const widgetHeight = dom.getTotalHeight(this.searchWidgetsContainerElement);
		const messagesHeight = dom.getTotalHeight(this.messagesElement);
		this.tree.layout(this.size.height - widgetHeight - messagesHeight, this.size.width - 28);
	}

	protected override layoutBody(height: number, width: number): void {
		super.layoutBody(height, width);
		this.size = new dom.Dimension(width, height);
		this.reLayout();
	}

	getControl() {
		return this.tree;
	}

	allSearchFieldsClear(): boolean {
		return this.searchWidget.getReplaceValue() === '' &&
			(!this.searchWidget.searchInput || this.searchWidget.searchInput.getValue() === '');
	}

	allFilePatternFieldsClear(): boolean {
		return this.searchExcludePattern.getValue() === '' &&
			this.searchIncludePattern.getValue() === '';
	}

	hasSearchResults(): boolean {
		return !this.viewModel.searchResult.isEmpty();
	}

	clearSearchResults(clearInput = true): void {
		this.viewModel.searchResult.clear();
		this.showEmptyStage(true);
		if (this.contextService.getWorkbenchState() === WorkbenchState.EMPTY) {
			this.showSearchWithoutFolderMessage();
		}
		if (clearInput) {
			if (this.allSearchFieldsClear()) {
				this.clearFilePatternFields();
			}
			this.searchWidget.clear();
		}
		this.viewModel.cancelSearch();
		this.viewModel.cancelAISearch();
		this.tree.ariaLabel = nls.localize('emptySearch', "Empty Search");

		this.accessibilitySignalService.playSignal(AccessibilitySignal.clear);
		this.reLayout();
	}

	clearFilePatternFields(): void {
		this.searchExcludePattern.clear();
		this.searchIncludePattern.clear();
	}

	cancelSearch(focus: boolean = true): boolean {
		if (this.viewModel.cancelSearch() && this.viewModel.cancelAISearch()) {
			if (focus) { this.searchWidget.focus(); }
			return true;
		}
		return false;
	}

	private selectTreeIfNotSelected(): void {
		if (this.tree.getNode(undefined)) {
			this.tree.domFocus();
			const selection = this.tree.getSelection();
			if (selection.length === 0) {
				const event = getSelectionKeyboardEvent();
				this.tree.focusNext(undefined, undefined, event);
				this.tree.setSelection(this.tree.getFocus(), event);
			}
		}
	}

	private getSearchTextFromEditor(allowUnselectedWord: boolean, editor?: IEditor): string | null {
		if (dom.isAncestorOfActiveElement(this.getContainer())) {
			return null;
		}

		editor = editor ?? this.editorService.activeTextEditorControl;

		if (!editor) {
			return null;
		}

		const allowUnselected = this.searchConfig.seedWithNearestWord && allowUnselectedWord;
		return getSelectionTextFromEditor(allowUnselected, editor);
	}

	private showsFileTypes(): boolean {
		return this.queryDetails.classList.contains('more');
	}

	toggleCaseSensitive(): void {
		this.searchWidget.searchInput?.setCaseSensitive(!this.searchWidget.searchInput.getCaseSensitive());
		this.triggerQueryChange({ shouldKeepAIResults: true });
	}

	toggleWholeWords(): void {
		this.searchWidget.searchInput?.setWholeWords(!this.searchWidget.searchInput.getWholeWords());
		this.triggerQueryChange({ shouldKeepAIResults: true });
	}

	toggleRegex(): void {
		this.searchWidget.searchInput?.setRegex(!this.searchWidget.searchInput.getRegex());
		this.triggerQueryChange({ shouldKeepAIResults: true });
	}

	togglePreserveCase(): void {
		this.searchWidget.replaceInput?.setPreserveCase(!this.searchWidget.replaceInput.getPreserveCase());
		this.triggerQueryChange({ shouldKeepAIResults: true });
	}

	setSearchParameters(args: IFindInFilesArgs = {}): void {
		if (typeof args.isCaseSensitive === 'boolean') {
			this.searchWidget.searchInput?.setCaseSensitive(args.isCaseSensitive);
		}
		if (typeof args.matchWholeWord === 'boolean') {
			this.searchWidget.searchInput?.setWholeWords(args.matchWholeWord);
		}
		if (typeof args.isRegex === 'boolean') {
			this.searchWidget.searchInput?.setRegex(args.isRegex);
		}
		if (typeof args.filesToInclude === 'string') {
			this.searchIncludePattern.setValue(String(args.filesToInclude));
		}
		if (typeof args.filesToExclude === 'string') {
			this.searchExcludePattern.setValue(String(args.filesToExclude));
		}
		if (typeof args.query === 'string') {
			this.searchWidget.searchInput?.setValue(args.query);
		}
		if (typeof args.replace === 'string') {
			this.searchWidget.replaceInput?.setValue(args.replace);
		} else {
			if (this.searchWidget.replaceInput && this.searchWidget.replaceInput.getValue() !== '') {
				this.searchWidget.replaceInput.setValue('');
			}
		}
		if (typeof args.triggerSearch === 'boolean' && args.triggerSearch) {
			this.triggerQueryChange();
		}
		if (typeof args.preserveCase === 'boolean') {
			this.searchWidget.replaceInput?.setPreserveCase(args.preserveCase);
		}
		if (typeof args.useExcludeSettingsAndIgnoreFiles === 'boolean') {
			this.inputPatternExcludes.setUseExcludesAndIgnoreFiles(args.useExcludeSettingsAndIgnoreFiles);
		}
		if (typeof args.onlyOpenEditors === 'boolean') {
			this.searchIncludePattern.setOnlySearchInOpenEditors(args.onlyOpenEditors);
		}
	}

	toggleQueryDetails(moveFocus = true, show?: boolean, skipLayout?: boolean, reverse?: boolean): void {
		show = typeof show === 'undefined' ? !this.queryDetails.classList.contains('more') : Boolean(show);
		if (!this.viewletState.query) {
			this.viewletState.query = {};
		}
		this.viewletState.query.queryDetailsExpanded = show;
		skipLayout = Boolean(skipLayout);
		if (show) {
			this.toggleQueryDetailsButton.setAttribute('aria-expanded', 'true');
			this.queryDetails.classList.add('more');
			if (moveFocus) {
				if (reverse) {
					this.inputPatternExcludes.focus();
					this.inputPatternExcludes.select();
				} else {
					this.inputPatternIncludes.focus();
					this.inputPatternIncludes.select();
				}
			}
		} else {
			this.toggleQueryDetailsButton.setAttribute('aria-expanded', 'false');
			this.queryDetails.classList.remove('more');
			if (moveFocus) {
				this.searchWidget.focus();
			}
		}

		if (!skipLayout && this.size) {
			this.reLayout();
		}
	}

	searchInFolders(folderPaths: string[] = []): void {
		this._searchWithIncludeOrExclude(true, folderPaths);
	}

	searchOutsideOfFolders(folderPaths: string[] = []): void {
		this._searchWithIncludeOrExclude(false, folderPaths);
	}

	private _searchWithIncludeOrExclude(include: boolean, folderPaths: string[]) {
		if (!folderPaths.length || folderPaths.some(folderPath => folderPath === '.')) {
			this.inputPatternIncludes.setValue('');
			this.searchWidget.focus();
			return;
		}

		// Show 'files to include' box
		if (!this.showsFileTypes()) {
			this.toggleQueryDetails(true, true);
		}

		(include ? this.inputPatternIncludes : this.inputPatternExcludes).setValue(folderPaths.join(', '));
		this.searchWidget.focus(false);
	}

	triggerQueryChange(_options?: { preserveFocus?: boolean; triggeredOnType?: boolean; delay?: number; shouldKeepAIResults?: boolean; shouldUpdateAISearch?: boolean }): void {
		const options = { preserveFocus: true, triggeredOnType: false, delay: 0, ..._options };

		if (options.triggeredOnType && !this.searchConfig.searchOnType) { return; }

		if (!this.pauseSearching) {

			const delay = options.triggeredOnType ? options.delay : 0;
			this.triggerQueryDelayer.trigger(() => {
				this._onQueryChanged(options.preserveFocus, options.triggeredOnType, options.shouldKeepAIResults, options.shouldUpdateAISearch);
			}, delay);
		}
	}

	private _getExcludePattern(): string {
		return this.inputPatternExcludes.getValue().trim();
	}

	private _getIncludePattern(): string {
		return this.inputPatternIncludes.getValue().trim();
	}

	private _onQueryChanged(preserveFocus: boolean, triggeredOnType = false, shouldKeepAIResults = false, shouldUpdateAISearch = false): void {
		if (!(this.searchWidget.searchInput?.inputBox.isInputValid())) {
			return;
		}

		const isRegex = this.searchWidget.searchInput.getRegex();
		const isInNotebookMarkdownInput = this.searchWidget.getNotebookFilters().markupInput;
		const isInNotebookMarkdownPreview = this.searchWidget.getNotebookFilters().markupPreview;
		const isInNotebookCellInput = this.searchWidget.getNotebookFilters().codeInput;
		const isInNotebookCellOutput = this.searchWidget.getNotebookFilters().codeOutput;

		const isWholeWords = this.searchWidget.searchInput.getWholeWords();
		const isCaseSensitive = this.searchWidget.searchInput.getCaseSensitive();
		const contentPattern = this.searchWidget.searchInput.getValue();
		const excludePatternText = this._getExcludePattern();
		const includePatternText = this._getIncludePattern();
		const useExcludesAndIgnoreFiles = this.inputPatternExcludes.useExcludesAndIgnoreFiles();
		const onlySearchInOpenEditors = this.inputPatternIncludes.onlySearchInOpenEditors();

		if (contentPattern.length === 0) {
			this.clearSearchResults(false);
			this.clearMessage();
			this.clearAIResults();
			return;
		}

		const content: IPatternInfo = {
			pattern: contentPattern,
			isRegExp: isRegex,
			isCaseSensitive: isCaseSensitive,
			isWordMatch: isWholeWords,
			notebookInfo: {
				isInNotebookMarkdownInput,
				isInNotebookMarkdownPreview,
				isInNotebookCellInput,
				isInNotebookCellOutput
			}
		};

		const excludePattern = [{ pattern: this.inputPatternExcludes.getValue() }];
		const includePattern = this.inputPatternIncludes.getValue();

		// Need the full match line to correctly calculate replace text, if this is a search/replace with regex group references ($1, $2, ...).
		// 10000 chars is enough to avoid sending huge amounts of text around, if you do a replace with a longer match, it may or may not resolve the group refs correctly.
		// https://github.com/microsoft/vscode/issues/58374
		const charsPerLine = content.isRegExp ? 10000 : 1000;

		const options: ITextQueryBuilderOptions = {
			_reason: 'searchView',
			extraFileResources: this.instantiationService.invokeFunction(getOutOfWorkspaceEditorResources),
			maxResults: this.searchConfig.maxResults ?? undefined,
			disregardIgnoreFiles: !useExcludesAndIgnoreFiles || undefined,
			disregardExcludeSettings: !useExcludesAndIgnoreFiles || undefined,
			onlyOpenEditors: onlySearchInOpenEditors,
			excludePattern,
			includePattern,
			previewOptions: {
				matchLines: 1,
				charsPerLine
			},
			isSmartCase: this.searchConfig.smartCase,
			expandPatterns: true
		};
		const folderResources = this.contextService.getWorkspace().folders;

		const onQueryValidationError = (err: Error) => {
			this.searchWidget.searchInput?.showMessage({ content: err.message, type: MessageType.ERROR });
			this.viewModel.searchResult.clear();
		};

		let query: ITextQuery;
		try {
			query = this.queryBuilder.text(content, folderResources.map(folder => folder.uri), options);
		} catch (err) {
			onQueryValidationError(err);
			return;
		}

		this.validateQuery(query).then(() => {
			if (!shouldKeepAIResults && shouldUpdateAISearch && this.tree.hasNode(this.searchResult.aiTextSearchResult)) {
				this.tree.collapse(this.searchResult.aiTextSearchResult);
			}

			this.onQueryTriggered(query, options, excludePatternText, includePatternText, triggeredOnType, shouldKeepAIResults, shouldUpdateAISearch);

			if (!preserveFocus) {
				this.searchWidget.focus(false, undefined, true); // focus back to input field
			}
		}, onQueryValidationError);
	}

	private validateQuery(query: ITextQuery): Promise<void> {
		// Validate folderQueries
		const folderQueriesExistP =
			query.folderQueries.map(fq => {
				return this.fileService.exists(fq.folder).catch(() => false);
			});

		return Promise.all(folderQueriesExistP).then(existResults => {
			// If no folders exist, show an error message about the first one
			const existingFolderQueries = query.folderQueries.filter((folderQuery, i) => existResults[i]);
			if (!query.folderQueries.length || existingFolderQueries.length) {
				query.folderQueries = existingFolderQueries;
			} else {
				const nonExistantPath = query.folderQueries[0].folder.fsPath;
				const searchPathNotFoundError = nls.localize('searchPathNotFoundError', "Search path not found: {0}", nonExistantPath);
				return Promise.reject(new Error(searchPathNotFoundError));
			}

			return undefined;
		});
	}

	private onQueryTriggered(query: ITextQuery, options: ITextQueryBuilderOptions, excludePatternText: string, includePatternText: string, triggeredOnType: boolean, shouldKeepAIResults: boolean, shouldUpdateAISearch: boolean): void {
		this.addToSearchHistoryDelayer.trigger(() => {
			this.searchWidget.searchInput?.onSearchSubmit();
			this.inputPatternExcludes.onSearchSubmit();
			this.inputPatternIncludes.onSearchSubmit();
		});

		this.viewModel.cancelSearch(true);
		if (!shouldKeepAIResults) {
			this.clearAIResults();
		}

		this.currentSearchQ = this.currentSearchQ
			.then(() => this.doSearch(query, excludePatternText, includePatternText, triggeredOnType, shouldKeepAIResults, shouldUpdateAISearch))
			.then(() => undefined, () => undefined);
	}


	private async _updateResults() {
		if (this.state === SearchUIState.Idle) {
			return;
		}
		try {
			// Search result tree update
			const fileCount = this.viewModel.searchResult.fileCount();
			if (this._visibleMatches !== fileCount) {
				this._visibleMatches = fileCount;
				await this.refreshAndUpdateCount();
			}
		} finally {
			// show frequent progress and results by scheduling updates 80 ms after the last one
			this._refreshResultsScheduler.schedule();
		}
	}

	private async expandIfSingularResult() {
		// expand if just 1 file with less than 50 matches

		const collapseResults = this.searchConfig.collapseResults;
		if (collapseResults !== 'alwaysCollapse' && this.viewModel.searchResult.matches().length === 1) {
			const onlyMatch = this.viewModel.searchResult.matches()[0];
			await this.tree.expandTo(onlyMatch);
			if (onlyMatch.count() < 50) {
				await this.tree.expand(onlyMatch);
			}
		}
	}

	private appendSearchWithAIButton(messageEl: HTMLElement) {
		const searchWithAIButtonTooltip = appendKeyBindingLabel(
			nls.localize('triggerAISearch.tooltip', "Search with AI."),
			this.keybindingService.lookupKeybinding(Constants.SearchCommandIds.SearchWithAIActionId)
		);
		const searchWithAIButtonText = nls.localize('searchWithAIButtonTooltip', "Search with AI");
		const searchWithAIButton = this.messageDisposables.add(new SearchLinkButton(
			searchWithAIButtonText,
			() => {
				this.commandService.executeCommand(Constants.SearchCommandIds.SearchWithAIActionId);
			}, this.hoverService, searchWithAIButtonTooltip));
		dom.append(messageEl, searchWithAIButton.element);
	}

	private async onSearchComplete(
		progressComplete: () => void,
		excludePatternText?: string,
		includePatternText?: string,
		completed?: ISearchComplete,
		shouldDoFinalRefresh = true,
		keywords?: AISearchKeyword[],
	) {

		this.state = SearchUIState.Idle;

		// Complete up to 100% as needed
		progressComplete();

		if (shouldDoFinalRefresh) {
			// anything that gets called from `getChildren` should not do this, since the tree will refresh anyways.
			await this.refreshAndUpdateCount();
		}

		const allResults = !this.viewModel.searchResult.isEmpty();
		const aiResults = this.searchResult.getCachedSearchComplete(true);
		if (completed?.exit === SearchCompletionExitCode.NewSearchStarted) {
			return;
		}

		// Special case for when we have an AI provider registered
		Constants.SearchContext.AIResultsRequested.bindTo(this.contextKeyService).set(this.shouldShowAIResults() && !!aiResults);

		// Expand AI results if the node is collapsed
		if (completed && this.tree.hasNode(this.searchResult.aiTextSearchResult) && this.tree.isCollapsed(this.searchResult.aiTextSearchResult)) {
			this.tree.expand(this.searchResult.aiTextSearchResult);
			return;
		}


		if (!allResults) {
			const hasExcludes = !!excludePatternText;
			const hasIncludes = !!includePatternText;
			let message: string;

			if (!completed) {
				message = SEARCH_CANCELLED_MESSAGE;
			} else if (this.inputPatternIncludes.onlySearchInOpenEditors()) {
				if (hasIncludes && hasExcludes) {
					message = nls.localize('noOpenEditorResultsIncludesExcludes', "No results found in open editors matching '{0}' excluding '{1}' - ", includePatternText, excludePatternText);
				} else if (hasIncludes) {
					message = nls.localize('noOpenEditorResultsIncludes', "No results found in open editors matching '{0}' - ", includePatternText);
				} else if (hasExcludes) {
					message = nls.localize('noOpenEditorResultsExcludes', "No results found in open editors excluding '{0}' - ", excludePatternText);
				} else {
					message = nls.localize('noOpenEditorResultsFound', "No results found in open editors. Review your configured exclusions and check your gitignore files - ");
				}
			} else {
				if (hasIncludes && hasExcludes) {
					message = nls.localize('noResultsIncludesExcludes', "No results found in '{0}' excluding '{1}' - ", includePatternText, excludePatternText);
				} else if (hasIncludes) {
					message = nls.localize('noResultsIncludes', "No results found in '{0}' - ", includePatternText);
				} else if (hasExcludes) {
					message = nls.localize('noResultsExcludes', "No results found excluding '{0}' - ", excludePatternText);
				} else {
					message = nls.localize('noResultsFound', "No results found. Review your configured exclusions and check your gitignore files - ");
				}
			}

			// Indicate as status to ARIA
			aria.status(message);

			const messageEl = this.clearMessage();
			dom.append(messageEl, message);

			if (this.shouldShowAIResults()) {
				this.appendSearchWithAIButton(messageEl);
				dom.append(messageEl, $('span', undefined, ' - '));
			}

			if (!completed) {
				const searchAgainButton = this.messageDisposables.add(new SearchLinkButton(
					nls.localize('rerunSearch.message', "Search again"),
					() => this.triggerQueryChange({ preserveFocus: false }), this.hoverService));
				dom.append(messageEl, searchAgainButton.element);
			} else if (hasIncludes || hasExcludes) {
				const searchAgainButton = this.messageDisposables.add(new SearchLinkButton(nls.localize('rerunSearchInAll.message', "Search again in all files"), this.onSearchAgain.bind(this), this.hoverService));
				dom.append(messageEl, searchAgainButton.element);
			} else {
				const openSettingsButton = this.messageDisposables.add(new SearchLinkButton(nls.localize('openSettings.message', "Open Settings"), this.onOpenSettings.bind(this), this.hoverService));
				dom.append(messageEl, openSettingsButton.element);
			}

			if (this.contextService.getWorkbenchState() === WorkbenchState.EMPTY) {
				this.showSearchWithoutFolderMessage();
			}
			this.reLayout();
		} else {
			this.viewModel.searchResult.toggleHighlights(this.isVisible()); // show highlights

			// Indicate final search result count for ARIA
			aria.status(nls.localize('ariaSearchResultsStatus', "Search returned {0} results in {1} files", this.viewModel.searchResult.count(), this.viewModel.searchResult.fileCount()));
		}


		if (completed && completed.limitHit) {
			completed.messages.push({ type: TextSearchCompleteMessageType.Warning, text: nls.localize('searchMaxResultsWarning', "The result set only contains a subset of all matches. Be more specific in your search to narrow down the results.") });
		}

		if (completed && completed.messages) {
			for (const message of completed.messages) {
				this.addMessage(message);
			}
		}

		this.reLayout();
	}

	private async onSearchError(e: any, progressComplete: () => void, excludePatternText?: string, includePatternText?: string, completed?: ISearchComplete, shouldDoFinalRefresh = true) {
		this.state = SearchUIState.Idle;
		if (errors.isCancellationError(e)) {
			return this.onSearchComplete(progressComplete, excludePatternText, includePatternText, completed, shouldDoFinalRefresh);
		} else {
			progressComplete();
			this.searchWidget.searchInput?.showMessage({ content: e.message, type: MessageType.ERROR });
			this.viewModel.searchResult.clear();

			return Promise.resolve();
		}
	}

	public clearAIResults() {
		this.model.searchResult.aiTextSearchResult.hidden = true;
		this.refreshTreeController.clearAllPending();
		this._pendingSemanticSearchPromise = undefined;
		this._cachedResults = undefined;
		this._cachedKeywords = [];
		this.model.cancelAISearch(true);
		this.model.clearAiSearchResults();
	}

	public async requestAIResults() {
		this.logService.info(`SearchView: Requesting semantic results from keybinding. Cached: ${!!this.cachedResults}`);
		if ((!this.cachedResults || this.cachedResults.results.length === 0) && !this._pendingSemanticSearchPromise) {
			this.clearAIResults();
		}
		this.model.searchResult.aiTextSearchResult.hidden = false;
		await this.queueRefreshTree();
		await forcedExpandRecursively(this.getControl(), this.model.searchResult.aiTextSearchResult);
	}

	public async addAIResults() {
		const excludePatternText = this._getExcludePattern();
		const includePatternText = this._getIncludePattern();

		this.searchWidget.searchInput?.clearMessage();
		this.showEmptyStage();
		this._visibleMatches = 0;
		this.tree.setSelection([]);
		this.tree.setFocus([]);

		this.viewModel.replaceString = this.searchWidget.getReplaceValue();
		// Reuse pending aiSearch if available
		let aiSearchPromise = this._pendingSemanticSearchPromise;
		if (!aiSearchPromise) {
			this.viewModel.searchResult.setAIQueryUsingTextQuery();
			aiSearchPromise = this._pendingSemanticSearchPromise = this.viewModel.aiSearch(() => {
				// Clear pending promise when first result comes in
				if (this._pendingSemanticSearchPromise === aiSearchPromise) {
					this._pendingSemanticSearchPromise = undefined;
				}
			});
		}

		aiSearchPromise.then((complete) => {
			this.updateSearchResultCount(this.viewModel.searchResult.query?.userDisabledExcludesAndIgnoreFiles, this.viewModel.searchResult.query?.onlyOpenEditors, false);
			return this.onSearchComplete(() => { }, excludePatternText, includePatternText, complete, false, complete.aiKeywords);
		}, (e) => {
			return this.onSearchError(e, () => { }, excludePatternText, includePatternText, undefined, false);
		});
	}

	private doSearch(query: ITextQuery, excludePatternText: string, includePatternText: string, triggeredOnType: boolean, shouldKeepAIResults: boolean, shouldUpdateAISearch: boolean): Thenable<void> {
		let progressComplete: () => void;
		this.progressService.withProgress({ location: this.getProgressLocation(), delay: triggeredOnType ? 300 : 0 }, _progress => {
			return new Promise<void>(resolve => progressComplete = resolve);
		});

		this.searchWidget.searchInput?.clearMessage();
		this.state = SearchUIState.Searching;
		this.showEmptyStage();
		if (this.model.searchResult.aiTextSearchResult.hidden && shouldUpdateAISearch) {
			this.logService.info(`SearchView: Semantic search visible. Keep semantic results: ${shouldKeepAIResults}. Update semantic search: ${shouldUpdateAISearch}`);
			this.model.searchResult.aiTextSearchResult.hidden = false;
		}

		const slowTimer = setTimeout(() => {
			this.state = SearchUIState.SlowSearch;
		}, 2000);

		this._visibleMatches = 0;

		this._refreshResultsScheduler.schedule();

		this.searchWidget.setReplaceAllActionState(false);

		this.tree.setSelection([]);
		this.tree.setFocus([]);

		this.viewModel.replaceString = this.searchWidget.getReplaceValue();
		const result = this.viewModel.search(query);

		if (!shouldKeepAIResults || shouldUpdateAISearch) {
			this.viewModel.searchResult.setAIQueryUsingTextQuery(query);
		}

		if (this.configurationService.getValue<ISearchConfigurationProperties>('search').searchView.keywordSuggestions) {
			this.getKeywordSuggestions();
		}

		return result.asyncResults.then((complete) => {
			clearTimeout(slowTimer);
			const config = this.configurationService.getValue<ISearchConfigurationProperties>('search').searchView.semanticSearchBehavior;
			if (complete.results.length === 0 && config === SemanticSearchBehavior.RunOnEmpty) {
				this.logService.info(`SearchView: Requesting semantic results on empty search.`);
				this.model.searchResult.aiTextSearchResult.hidden = false;
			}
			return this.onSearchComplete(progressComplete, excludePatternText, includePatternText, complete);
		}, (e) => {
			clearTimeout(slowTimer);
			return this.onSearchError(e, progressComplete, excludePatternText, includePatternText);
		});
	}

	private onOpenSettings(e: dom.EventLike): void {
		dom.EventHelper.stop(e, false);
		this.openSettings('@id:files.exclude,search.exclude,search.useParentIgnoreFiles,search.useGlobalIgnoreFiles,search.useIgnoreFiles');
	}

	private openSettings(query: string): Promise<IEditorPane | undefined> {
		const options: ISettingsEditorOptions = { query };
		return this.contextService.getWorkbenchState() !== WorkbenchState.EMPTY ?
			this.preferencesService.openWorkspaceSettings(options) :
			this.preferencesService.openUserSettings(options);
	}

	private onSearchAgain(): void {
		this.inputPatternExcludes.setValue('');
		this.inputPatternIncludes.setValue('');
		this.inputPatternIncludes.setOnlySearchInOpenEditors(false);

		this.triggerQueryChange({ preserveFocus: false });
	}

	private onEnableExcludes(): void {
		this.toggleQueryDetails(false, true);
		this.searchExcludePattern.setUseExcludesAndIgnoreFiles(true);
	}

	private onDisableSearchInOpenEditors(): void {
		this.toggleQueryDetails(false, true);
		this.inputPatternIncludes.setOnlySearchInOpenEditors(false);
	}

	private updateSearchResultCount(disregardExcludesAndIgnores?: boolean, onlyOpenEditors?: boolean, clear: boolean = false): void {
		if (this._cachedKeywords.length > 0) {
			return;
		}
		const fileCount = this.viewModel.searchResult.fileCount(this.viewModel.searchResult.aiTextSearchResult.hidden);
		const resultCount = this.viewModel.searchResult.count(this.viewModel.searchResult.aiTextSearchResult.hidden);
		this.hasSearchResultsKey.set(fileCount > 0);

		const msgWasHidden = this.messagesElement.style.display === 'none';

		const messageEl = this.clearMessage();
		const resultMsg = clear ? '' : this.buildResultCountMessage(resultCount, fileCount);
		this.tree.ariaLabel = resultMsg + nls.localize('forTerm', " - Search: {0}", this.searchResult.query?.contentPattern.pattern ?? '');
		dom.append(messageEl, resultMsg);

		if (fileCount > 0) {
			if (disregardExcludesAndIgnores) {
				const excludesDisabledMessage = ' - ' + nls.localize('useIgnoresAndExcludesDisabled', "exclude settings and ignore files are disabled") + ' ';
				const enableExcludesButton = this.messageDisposables.add(new SearchLinkButton(nls.localize('excludes.enable', "enable"), this.onEnableExcludes.bind(this), this.hoverService, nls.localize('useExcludesAndIgnoreFilesDescription', "Use Exclude Settings and Ignore Files")));
				dom.append(messageEl, $('span', undefined, excludesDisabledMessage, '(', enableExcludesButton.element, ')'));
			}

			if (onlyOpenEditors) {
				const searchingInOpenMessage = ' - ' + nls.localize('onlyOpenEditors', "searching only in open files") + ' ';
				const disableOpenEditorsButton = this.messageDisposables.add(new SearchLinkButton(nls.localize('openEditors.disable', "disable"), this.onDisableSearchInOpenEditors.bind(this), this.hoverService, nls.localize('disableOpenEditors', "Search in entire workspace")));
				dom.append(messageEl, $('span', undefined, searchingInOpenMessage, '(', disableOpenEditorsButton.element, ')'));
			}

			dom.append(messageEl, ' - ');

			const openInEditorTooltip = appendKeyBindingLabel(
				nls.localize('openInEditor.tooltip', "Copy current search results to an editor"),
				this.keybindingService.lookupKeybinding(Constants.SearchCommandIds.OpenInEditorCommandId));
			const openInEditorButton = this.messageDisposables.add(new SearchLinkButton(
				nls.localize('openInEditor.message', "Open in editor"),
				() => this.instantiationService.invokeFunction(createEditorFromSearchResult, this.searchResult, this.searchIncludePattern.getValue(), this.searchExcludePattern.getValue(), this.searchIncludePattern.onlySearchInOpenEditors()), this.hoverService,
				openInEditorTooltip));
			dom.append(messageEl, openInEditorButton.element);

			dom.append(messageEl, ' - ');
			this.appendSearchWithAIButton(messageEl);

			this.reLayout();
		} else if (!msgWasHidden) {
			dom.hide(this.messagesElement);
		}
	}

	private handleKeywordClick(keyword: string, index: number) {
		this.searchWidget.searchInput?.setValue(keyword);
		this.triggerQueryChange({ preserveFocus: false, triggeredOnType: false, shouldKeepAIResults: false });
		type KeywordClickClassification = {
			owner: 'osortega';
			comment: 'Fired when the user clicks on a keyword suggestion';
			index: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; isMeasurement: true; comment: 'The index of the keyword clicked' };
			maxKeywords: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; isMeasurement: true; comment: 'The total number of suggested keywords' };
		};
		type KeywordClickEvent = {
			index: number;
			maxKeywords: number;
		};
		this.telemetryService.publicLog2<KeywordClickEvent, KeywordClickClassification>('searchKeywordClick', {
			index,
			maxKeywords: this._cachedKeywords.length
		});
	}

	private updateKeywordSuggestionUI(keyword: AISearchKeyword) {
		const element = this.messagesElement.firstChild as HTMLDivElement;
		if (this._cachedKeywords.length > 0) {
			if (this._cachedKeywords.length >= 3) {
				// If we already have 3 keywords, just return
				return;
			}
			dom.append(element, ', ');
			const index = this._cachedKeywords.length;
			const button = this.messageDisposables.add(new SearchLinkButton(
				keyword.keyword,
				() => this.handleKeywordClick(keyword.keyword, index),
				this.hoverService
			));
			dom.append(element, button.element);
		} else {
			const messageEl = this.clearMessage();
			messageEl.classList.add('ai-keywords');

			// Add unclickable message
			const resultMsg = nls.localize('keywordSuggestion.message', "Search instead for: ");
			dom.append(messageEl, resultMsg);

			const button = this.messageDisposables.add(new SearchLinkButton(
				keyword.keyword,
				() => this.handleKeywordClick(keyword.keyword, 0),
				this.hoverService
			));
			dom.append(messageEl, button.element);
		}
		this._cachedKeywords.push(keyword.keyword);
	}

	private async getKeywordSuggestions() {
		// Reuse pending aiSearch if available
		let aiSearchPromise = this._pendingSemanticSearchPromise;
		if (!aiSearchPromise) {
			this.viewModel.searchResult.setAIQueryUsingTextQuery();
			aiSearchPromise = this._pendingSemanticSearchPromise = this.viewModel.aiSearch(result => {
				if (result && isAIKeyword(result)) {
					this.updateKeywordSuggestionUI(result);
					return;
				}
				// Clear pending promise when first result comes in
				if (this._pendingSemanticSearchPromise === aiSearchPromise) {
					this._pendingSemanticSearchPromise = undefined;
				}
			});
		}
		this._cachedResults = await aiSearchPromise;
	}

	private addMessage(message: TextSearchCompleteMessage) {
		const messageBox = this.messagesElement.firstChild as HTMLDivElement;
		if (!messageBox) { return; }
		dom.append(messageBox, renderSearchMessage(message, this.instantiationService, this.notificationService, this.openerService, this.commandService, this.messageDisposables, () => this.triggerQueryChange()));
	}

	private buildResultCountMessage(resultCount: number, fileCount: number): string {
		if (resultCount === 1 && fileCount === 1) {
			return nls.localize('search.file.result', "{0} result in {1} file", resultCount, fileCount);
		} else if (resultCount === 1) {
			return nls.localize('search.files.result', "{0} result in {1} files", resultCount, fileCount);
		} else if (fileCount === 1) {
			return nls.localize('search.file.results', "{0} results in {1} file", resultCount, fileCount);
		} else {
			return nls.localize('search.files.results', "{0} results in {1} files", resultCount, fileCount);
		}
	}

	private showSearchWithoutFolderMessage(): void {
		this.searchWithoutFolderMessageElement = this.clearMessage();

		const textEl = dom.append(this.searchWithoutFolderMessageElement,
			$('p', undefined, nls.localize('searchWithoutFolder', "You have not opened or specified a folder. Only open files are currently searched - ")));

		const openFolderButton = this.messageDisposables.add(new SearchLinkButton(
			nls.localize('openFolder', "Open Folder"),
			() => {
				this.commandService.executeCommand(OpenFolderAction.ID).catch(err => errors.onUnexpectedError(err));
			}, this.hoverService));
		dom.append(textEl, openFolderButton.element);
	}

	private showEmptyStage(forceHideMessages = false): void {
		const showingCancelled = (this.messagesElement.firstChild?.textContent?.indexOf(SEARCH_CANCELLED_MESSAGE) ?? -1) > -1;

		// clean up ui
		// this.replaceService.disposeAllReplacePreviews();
		if (showingCancelled || forceHideMessages || !this.configurationService.getValue<ISearchConfiguration>().search.searchOnType) {
			// when in search to type, don't preemptively hide, as it causes flickering and shifting of the live results
			dom.hide(this.messagesElement);
		}

		dom.show(this.resultsElement);
		this.currentSelectedFileMatch = undefined;
	}

	private shouldOpenInNotebookEditor(match: ISearchTreeMatch, uri: URI): boolean {
		// Untitled files will return a false positive for getContributedNotebookTypes.
		// Since untitled files are already open, then untitled notebooks should return NotebookMatch results.
		return isIMatchInNotebook(match) || (uri.scheme !== network.Schemas.untitled && this.notebookService.getContributedNotebookTypes(uri).length > 0);
	}

	private onFocus(lineMatch: ISearchTreeMatch, preserveFocus?: boolean, sideBySide?: boolean, pinned?: boolean): Promise<any> {
		const useReplacePreview = this.configurationService.getValue<ISearchConfiguration>().search.useReplacePreview;

		const resource = isSearchTreeMatch(lineMatch) ? lineMatch.parent().resource : (<ISearchTreeFileMatch>lineMatch).resource;
		return (useReplacePreview && this.viewModel.isReplaceActive() && !!this.viewModel.replaceString && !(this.shouldOpenInNotebookEditor(lineMatch, resource))) ?
			this.replaceService.openReplacePreview(lineMatch, preserveFocus, sideBySide, pinned) :
			this.open(lineMatch, preserveFocus, sideBySide, pinned, resource);
	}

	async open(element: FileMatchOrMatch, preserveFocus?: boolean, sideBySide?: boolean, pinned?: boolean, resourceInput?: URI): Promise<void> {
		const selection = getEditorSelectionFromMatch(element, this.viewModel);
		const oldParentMatches = isSearchTreeMatch(element) ? element.parent().matches() : [];
		const resource = resourceInput ?? (isSearchTreeMatch(element) ? element.parent().resource : (<ISearchTreeFileMatch>element).resource);
		let editor: IEditorPane | undefined;

		const options = {
			preserveFocus,
			pinned,
			selection,
			revealIfVisible: true,
		};

		try {
			editor = await this.editorService.openEditor({
				resource: resource,
				options,
			}, sideBySide ? SIDE_GROUP : ACTIVE_GROUP);

			const editorControl = editor?.getControl();
			if (isSearchTreeMatch(element) && preserveFocus && isCodeEditor(editorControl)) {
				this.viewModel.searchResult.getRangeHighlightDecorations().highlightRange(
					editorControl.getModel()!,
					element.range()
				);
			} else {
				this.viewModel.searchResult.getRangeHighlightDecorations().removeHighlightRange();
			}
		} catch (err) {
			errors.onUnexpectedError(err);
			return;
		}

		if (editor instanceof NotebookEditor) {
			const elemParent = element.parent() as INotebookFileInstanceMatch;
			if (isSearchTreeMatch(element)) {
				if (isIMatchInNotebook(element)) {
					element.parent().showMatch(element);
				} else {
					const editorWidget = editor.getControl();
					if (editorWidget) {
						// Ensure that the editor widget is binded. If if is, then this should return immediately.
						// Otherwise, it will bind the widget.
						elemParent.bindNotebookEditorWidget(editorWidget);
						await elemParent.updateMatchesForEditorWidget();

						const matchIndex = oldParentMatches.findIndex(e => e.id() === element.id());
						const matches = elemParent.matches();
						const match = matchIndex >= matches.length ? matches[matches.length - 1] : matches[matchIndex];

						if (isIMatchInNotebook(match)) {
							elemParent.showMatch(match);
							if (!this.tree.getFocus().includes(match) || !this.tree.getSelection().includes(match)) {
								this.tree.setSelection([match], getSelectionKeyboardEvent());
								this.tree.setFocus([match]);
							}
						}
					}
				}
			}
		}
	}

	openEditorWithMultiCursor(element: FileMatchOrMatch): Promise<void> {
		const resource = isSearchTreeMatch(element) ? element.parent().resource : (<ISearchTreeFileMatch>element).resource;
		return this.editorService.openEditor({
			resource: resource,
			options: {
				preserveFocus: false,
				pinned: true,
				revealIfVisible: true
			}
		}).then(editor => {
			if (editor) {
				let fileMatch = null;
				if (isSearchTreeFileMatch(element)) {
					fileMatch = element;
				}
				else if (isSearchTreeMatch(element)) {
					fileMatch = element.parent();
				}

				if (fileMatch) {
					const selections = fileMatch.matches().map(m => new Selection(m.range().startLineNumber, m.range().startColumn, m.range().endLineNumber, m.range().endColumn));
					const codeEditor = getCodeEditor(editor.getControl());
					if (codeEditor) {
						const multiCursorController = MultiCursorSelectionController.get(codeEditor);
						multiCursorController?.selectAllUsingSelections(selections);
					}
				}
			}
			this.viewModel.searchResult.getRangeHighlightDecorations().removeHighlightRange();
		}, errors.onUnexpectedError);
	}

	private onUntitledDidDispose(resource: URI): void {
		if (!this.viewModel) {
			return;
		}

		// remove search results from this resource as it got disposed
		let matches = this.viewModel.searchResult.matches();
		for (let i = 0, len = matches.length; i < len; i++) {
			if (resource.toString() === matches[i].resource.toString()) {
				this.viewModel.searchResult.remove(matches[i]);
			}
		}
		matches = this.viewModel.searchResult.matches(true);
		for (let i = 0, len = matches.length; i < len; i++) {
			if (resource.toString() === matches[i].resource.toString()) {
				this.viewModel.searchResult.remove(matches[i]);
			}
		}
	}

	private onFilesChanged(e: FileChangesEvent): void {
		if (!this.viewModel || (this.searchConfig.sortOrder !== SearchSortOrder.Modified && !e.gotDeleted())) {
			return;
		}

		const matches = this.viewModel.searchResult.matches();
		if (e.gotDeleted()) {
			const deletedMatches = matches.filter(m => e.contains(m.resource, FileChangeType.DELETED));

			this.viewModel.searchResult.remove(deletedMatches);
		} else {
			// Check if the changed file contained matches
			const changedMatches = matches.filter(m => e.contains(m.resource));
			if (changedMatches.length && this.searchConfig.sortOrder === SearchSortOrder.Modified) {
				// No matches need to be removed, but modified files need to have their file stat updated.
				this.updateFileStats(changedMatches).then(async () => this.refreshTreeController.queue());
			}
		}
	}

	private get searchConfig(): ISearchConfigurationProperties {
		return this.configurationService.getValue<ISearchConfigurationProperties>('search');
	}

	private clearHistory(): void {
		this.searchWidget.clearHistory();
		this.inputPatternExcludes.clearHistory();
		this.inputPatternIncludes.clearHistory();
	}

	public override saveState(): void {
		// This can be called before renderBody() method gets called for the first time
		// if we move the searchView inside another viewPaneContainer
		if (!this.searchWidget) {
			return;
		}

		const patternExcludes = this.inputPatternExcludes?.getValue().trim() ?? '';
		const patternIncludes = this.inputPatternIncludes?.getValue().trim() ?? '';
		const onlyOpenEditors = this.inputPatternIncludes?.onlySearchInOpenEditors() ?? false;
		const useExcludesAndIgnoreFiles = this.inputPatternExcludes?.useExcludesAndIgnoreFiles() ?? true;
		const preserveCase = this.viewModel.preserveCase;

		if (!this.viewletState.query) {
			this.viewletState.query = {};
		}

		if (this.searchWidget.searchInput) {
			const isRegex = this.searchWidget.searchInput.getRegex();
			const isWholeWords = this.searchWidget.searchInput.getWholeWords();
			const isCaseSensitive = this.searchWidget.searchInput.getCaseSensitive();
			const contentPattern = this.searchWidget.searchInput.getValue();

			const isInNotebookCellInput = this.searchWidget.getNotebookFilters().codeInput;
			const isInNotebookCellOutput = this.searchWidget.getNotebookFilters().codeOutput;
			const isInNotebookMarkdownInput = this.searchWidget.getNotebookFilters().markupInput;
			const isInNotebookMarkdownPreview = this.searchWidget.getNotebookFilters().markupPreview;

			this.viewletState.query.contentPattern = contentPattern;
			this.viewletState.query.regex = isRegex;
			this.viewletState.query.wholeWords = isWholeWords;
			this.viewletState.query.caseSensitive = isCaseSensitive;

			this.viewletState.query.isInNotebookMarkdownInput = isInNotebookMarkdownInput;
			this.viewletState.query.isInNotebookMarkdownPreview = isInNotebookMarkdownPreview;
			this.viewletState.query.isInNotebookCellInput = isInNotebookCellInput;
			this.viewletState.query.isInNotebookCellOutput = isInNotebookCellOutput;
		}

		this.viewletState.query.folderExclusions = patternExcludes;
		this.viewletState.query.folderIncludes = patternIncludes;
		this.viewletState.query.useExcludesAndIgnoreFiles = useExcludesAndIgnoreFiles;
		this.viewletState.query.preserveCase = preserveCase;
		this.viewletState.query.onlyOpenEditors = onlyOpenEditors;

		const isReplaceShown = this.searchAndReplaceWidget.isReplaceShown();

		if (!this.viewletState.view) {
			this.viewletState.view = {};
		}

		this.viewletState.view.showReplace = isReplaceShown;
		this.viewletState.view.treeLayout = this.isTreeLayoutViewVisible;
		this.viewletState.query.replaceText = isReplaceShown && this.searchWidget.getReplaceValue();

		this._saveSearchHistoryService();

		this.memento.saveMemento();

		super.saveState();
	}

	private _saveSearchHistoryService() {
		if (this.searchWidget === undefined) {
			return;
		}
		const history: ISearchHistoryValues = Object.create(null);

		const searchHistory = this.searchWidget.getSearchHistory();
		if (searchHistory && searchHistory.length) {
			history.search = searchHistory;
		}

		const replaceHistory = this.searchWidget.getReplaceHistory();
		if (replaceHistory && replaceHistory.length) {
			history.replace = replaceHistory;
		}

		const patternExcludesHistory = this.inputPatternExcludes.getHistory();
		if (patternExcludesHistory && patternExcludesHistory.length) {
			history.exclude = patternExcludesHistory;
		}

		const patternIncludesHistory = this.inputPatternIncludes.getHistory();
		if (patternIncludesHistory && patternIncludesHistory.length) {
			history.include = patternIncludesHistory;
		}

		this.searchHistoryService.save(history);
	}


	private async updateFileStats(elements: ISearchTreeFileMatch[]): Promise<void> {
		const files = elements.map(f => f.resolveFileStat(this.fileService));
		await Promise.all(files);
	}

	private removeFileStats(): void {
		for (const fileMatch of this.searchResult.matches()) {
			fileMatch.fileStat = undefined;
		}
		for (const fileMatch of this.searchResult.matches(true)) {
			fileMatch.fileStat = undefined;
		}
	}

	override dispose(): void {
		this.isDisposed = true;
		this.saveState();
		super.dispose();
	}
}


class SearchLinkButton extends Disposable {
	public readonly element: HTMLElement;

	constructor(label: string, handler: (e: dom.EventLike) => unknown, hoverService: IHoverService, tooltip?: string) {
		super();
		this.element = $('a.pointer', { tabindex: 0 }, label);
		this._register(hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), this.element, tooltip));
		this.addEventHandlers(handler);
	}

	private addEventHandlers(handler: (e: dom.EventLike) => unknown): void {
		const wrappedHandler = (e: dom.EventLike) => {
			dom.EventHelper.stop(e, false);
			handler(e);
		};

		this._register(dom.addDisposableListener(this.element, dom.EventType.CLICK, wrappedHandler));
		this._register(dom.addDisposableListener(this.element, dom.EventType.KEY_DOWN, e => {
			const event = new StandardKeyboardEvent(e);
			if (event.equals(KeyCode.Space) || event.equals(KeyCode.Enter)) {
				wrappedHandler(e);
				event.preventDefault();
				event.stopPropagation();
			}
		}));
	}
}

export function getEditorSelectionFromMatch(element: FileMatchOrMatch, viewModel: ISearchModel) {
	let match: ISearchTreeMatch | null = null;
	if (isSearchTreeMatch(element)) {
		match = element;
	}
	if (isSearchTreeFileMatch(element) && element.count() > 0) {
		match = element.matches()[element.matches().length - 1];
	}
	if (match) {
		const range = match.range();
		if (viewModel.isReplaceActive() && !!viewModel.replaceString) {
			const replaceString = match.replaceString;
			return {
				startLineNumber: range.startLineNumber,
				startColumn: range.startColumn,
				endLineNumber: range.startLineNumber,
				endColumn: range.startColumn + replaceString.length
			};
		}
		return range;
	}
	return undefined;
}

export function getSelectionTextFromEditor(allowUnselectedWord: boolean, activeEditor: IEditor): string | null {

	let editor = activeEditor;

	if (isDiffEditor(editor)) {
		if (editor.getOriginalEditor().hasTextFocus()) {
			editor = editor.getOriginalEditor();
		} else {
			editor = editor.getModifiedEditor();
		}
	}

	if (!isCodeEditor(editor) || !editor.hasModel()) {
		return null;
	}

	const range = editor.getSelection();
	if (!range) {
		return null;
	}

	if (range.isEmpty()) {
		if (allowUnselectedWord) {
			const wordAtPosition = editor.getModel().getWordAtPosition(range.getStartPosition());
			return wordAtPosition?.word ?? null;
		} else {
			return null;
		}
	}

	let searchText = '';
	for (let i = range.startLineNumber; i <= range.endLineNumber; i++) {
		let lineText = editor.getModel().getLineContent(i);
		if (i === range.endLineNumber) {
			lineText = lineText.substring(0, range.endColumn - 1);
		}

		if (i === range.startLineNumber) {
			lineText = lineText.substring(range.startColumn - 1);
		}

		if (i !== range.startLineNumber) {
			lineText = '\n' + lineText;
		}

		searchText += lineText;
	}

	return searchText;
}

class SearchViewDataSource implements IAsyncDataSource<ISearchResult, RenderableMatch> {

	constructor(
		private searchView: SearchView,
		@IConfigurationService private configurationService: IConfigurationService,
	) { }


	private get searchConfig(): ISearchConfigurationProperties {
		return this.configurationService.getValue<ISearchConfigurationProperties>('search');
	}

	private createSearchResultIterator(searchResult: ISearchResult): Iterable<RenderableMatch> {

		const ret: ITextSearchHeading[] = [];

		if (this.searchView.shouldShowAIResults() && searchResult.searchModel.hasPlainResults && !searchResult.aiTextSearchResult.hidden) {
			// as long as there is a query present, we can load AI results
			ret.push(searchResult.aiTextSearchResult);
		}

		if (!searchResult.plainTextSearchResult.isEmpty()) {
			if (!this.searchView.shouldShowAIResults() || searchResult.aiTextSearchResult.hidden) {
				// only one root, so just return the children
				return this.createTextSearchResultIterator(searchResult.plainTextSearchResult);
			}
			ret.push(searchResult.plainTextSearchResult);

		}

		return ret;

	}

	private createTextSearchResultIterator(textSearchResult: ITextSearchHeading): Iterable<ISearchTreeFolderMatch | ISearchTreeFileMatch> {
		const folderMatches = textSearchResult.folderMatches()
			.filter(fm => !fm.isEmpty())
			.sort(searchMatchComparer);

		if (folderMatches.length === 1) {
			return this.createFolderIterator(folderMatches[0]);
		}
		return folderMatches;
	}

	private createFolderIterator(folderMatch: ISearchTreeFolderMatch): Iterable<ISearchTreeFolderMatch | ISearchTreeFileMatch> {
		const matchArray = this.searchView.isTreeLayoutViewVisible ? folderMatch.matches() : folderMatch.allDownstreamFileMatches();
		let matches = matchArray;
		if (!(folderMatch instanceof AIFolderMatchWorkspaceRootImpl)) {
			matches = matchArray.sort((a, b) => searchMatchComparer(a, b, this.searchConfig.sortOrder));
		}

		return matches;
	}

	private createFileIterator(fileMatch: ISearchTreeFileMatch): Iterable<ISearchTreeMatch> {
		const matches = fileMatch.matches().sort(searchMatchComparer);
		return matches;
	}

	hasChildren(element: RenderableMatch): boolean {
		if (isSearchTreeMatch(element)) {
			return false;
		}

		if (isTextSearchHeading(element) && element.isAIContributed) {
			return true;
		}

		const hasChildren = element.hasChildren;
		return hasChildren;
	}

	getChildren(element: RenderableMatch | ISearchResult): Iterable<RenderableMatch> | Promise<Iterable<RenderableMatch>> {
		if (isSearchResult(element)) {
			return this.createSearchResultIterator(element);
		} else if (isTextSearchHeading(element)) {
			if (element.isAIContributed && (!this.searchView.model.hasAIResults || !!this.searchView._pendingSemanticSearchPromise)) {
				if (this.searchView.cachedResults) {
					return this.createTextSearchResultIterator(element);
				}
				this.searchView.addAIResults();
				return new Promise<Iterable<RenderableMatch>>(resolve => {
					const disposable = element.onChange(() => {
						disposable.dispose(); // Clean up listener after first result
						resolve(this.createTextSearchResultIterator(element));
					});
				});
			}
			return this.createTextSearchResultIterator(element);
		} else if (isSearchTreeFolderMatch(element)) {
			return this.createFolderIterator(element);
		} else if (isSearchTreeFileMatch(element)) {
			return this.createFileIterator(element);
		}

		return [];

	}
	getParent(element: RenderableMatch): RenderableMatch {
		const parent = element.parent();
		if (isSearchResult(parent)) {
			throw new Error('Invalid element passed to getParent');
		}
		return parent;
	}
}

class RefreshTreeController extends Disposable {

	private refreshTreeThrottler: Throttler;

	constructor(
		private readonly searchView: SearchView,
		private readonly geSearchConfig: () => ISearchConfigurationProperties,
		@IFileService private readonly fileService: IFileService,
	) {
		super();
		this.refreshTreeThrottler = this._register(new Throttler());
	}

	private queuedIChangeEvents: IChangeEvent[] = [];

	public clearAllPending(): void {
		this.searchView.getControl().cancelAllRefreshPromises(true);
	}

	public async queue(e?: IChangeEvent): Promise<void> {
		if (e) {
			this.queuedIChangeEvents.push(e);
		}
		return this.refreshTreeThrottler.queue(this.refreshTreeUsingQueue.bind(this));
	}

	private async refreshTreeUsingQueue(): Promise<void> {
		const aggregateChangeEvent: IChangeEvent | undefined = this.queuedIChangeEvents.length === 0 ? undefined : {
			elements: this.queuedIChangeEvents.map(e => e.elements).flat(),
			added: this.queuedIChangeEvents.some(e => e.added),
			removed: this.queuedIChangeEvents.some(e => e.removed),
			clearingAll: this.queuedIChangeEvents.some(e => e.clearingAll),
		};
		this.queuedIChangeEvents = [];
		return this.refreshTree(aggregateChangeEvent);
	}

	private async retrieveFileStats(): Promise<void> {
		const files = this.searchView.model.searchResult.matches().filter(f => !f.fileStat).map(f => f.resolveFileStat(this.fileService));
		await Promise.all(files);
	}

	private async refreshTree(event?: IChangeEvent): Promise<void> {
		const searchConfig = this.geSearchConfig();
		if (!event || event.added || event.removed) {
			// Refresh whole tree
			if (searchConfig.sortOrder === SearchSortOrder.Modified) {
				// Ensure all matches have retrieved their file stat
				await this.retrieveFileStats()
					.then(() => this.searchView.getControl().updateChildren(undefined));
			} else {
				await this.searchView.getControl().updateChildren(undefined);
			}
		} else {
			// If updated counts affect our search order, re-sort the view.
			if (searchConfig.sortOrder === SearchSortOrder.CountAscending ||
				searchConfig.sortOrder === SearchSortOrder.CountDescending) {

				await this.searchView.getControl().updateChildren(undefined);
			} else {
				const treeHasAllElements = event.elements.every(elem => this.searchView.getControl().hasNode(elem));
				if (treeHasAllElements) {
					// IFileMatchInstance modified, refresh those elements
					await Promise.all(event.elements.map(async element => {
						await this.searchView.getControl().updateChildren(element);
						this.searchView.getControl().rerender(element);
					}));
				} else {
					this.searchView.getControl().updateChildren(undefined);
				}
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/browser/searchWidget.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/browser/searchWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import * as dom from '../../../../base/browser/dom.js';
import { IKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import { ActionBar } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { Button, IButtonOptions } from '../../../../base/browser/ui/button/button.js';
import { IFindInputOptions } from '../../../../base/browser/ui/findinput/findInput.js';
import { ReplaceInput } from '../../../../base/browser/ui/findinput/replaceInput.js';
import { IInputBoxStyles, IMessage, InputBox } from '../../../../base/browser/ui/inputbox/inputBox.js';
import { Widget } from '../../../../base/browser/ui/widget.js';
import { Action } from '../../../../base/common/actions.js';
import { Delayer } from '../../../../base/common/async.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { CONTEXT_FIND_WIDGET_NOT_VISIBLE } from '../../../../editor/contrib/find/browser/findModel.js';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr, IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService, IContextViewService } from '../../../../platform/contextview/browser/contextView.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { KeybindingsRegistry, KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ISearchConfigurationProperties } from '../../../services/search/common/search.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { ContextScopedReplaceInput } from '../../../../platform/history/browser/contextScopedHistoryWidget.js';
import { appendKeyBindingLabel, isSearchViewFocused, getSearchView } from './searchActionsBase.js';
import * as Constants from '../common/constants.js';
import { IAccessibilityService } from '../../../../platform/accessibility/common/accessibility.js';
import { isMacintosh } from '../../../../base/common/platform.js';
import { IToggleStyles, Toggle } from '../../../../base/browser/ui/toggle/toggle.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { searchReplaceAllIcon, searchHideReplaceIcon, searchShowContextIcon, searchShowReplaceIcon } from './searchIcons.js';
import { ToggleSearchEditorContextLinesCommandId } from '../../searchEditor/browser/constants.js';
import { showHistoryKeybindingHint } from '../../../../platform/history/browser/historyWidgetKeybindingHint.js';
import { defaultInputBoxStyles, defaultToggleStyles } from '../../../../platform/theme/browser/defaultStyles.js';
import { NotebookFindFilters } from '../../notebook/browser/contrib/find/findFilters.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { NotebookEditorInput } from '../../notebook/common/notebookEditorInput.js';
import { GroupModelChangeKind } from '../../../common/editor.js';
import { SearchFindInput } from './searchFindInput.js';
import { getDefaultHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegateFactory.js';
import { IDisposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { NotebookFindScopeType } from '../../notebook/common/notebookCommon.js';

/** Specified in searchview.css */
const SingleLineInputHeight = 26;

export interface ISearchWidgetOptions {
	value?: string;
	replaceValue?: string;
	isRegex?: boolean;
	isCaseSensitive?: boolean;
	isWholeWords?: boolean;
	searchHistory?: string[];
	replaceHistory?: string[];
	preserveCase?: boolean;
	_hideReplaceToggle?: boolean; // TODO: Search Editor's replace experience
	showContextToggle?: boolean;
	inputBoxStyles: IInputBoxStyles;
	toggleStyles: IToggleStyles;
	notebookOptions?: NotebookToggleState;
}

interface NotebookToggleState {
	isInNotebookMarkdownInput: boolean;
	isInNotebookMarkdownPreview: boolean;
	isInNotebookCellInput: boolean;
	isInNotebookCellOutput: boolean;
}

class ReplaceAllAction extends Action {

	static readonly ID: string = 'search.action.replaceAll';

	constructor(private _searchWidget: SearchWidget) {
		super(ReplaceAllAction.ID, '', ThemeIcon.asClassName(searchReplaceAllIcon), false);
	}

	set searchWidget(searchWidget: SearchWidget) {
		this._searchWidget = searchWidget;
	}

	override run(): Promise<void> {
		if (this._searchWidget) {
			return this._searchWidget.triggerReplaceAll();
		}
		return Promise.resolve();
	}
}

const hoverLifecycleOptions = { groupId: 'search-widget' };
const ctrlKeyMod = (isMacintosh ? KeyMod.WinCtrl : KeyMod.CtrlCmd);

function stopPropagationForMultiLineUpwards(event: IKeyboardEvent, value: string, textarea: HTMLTextAreaElement | null) {
	const isMultiline = !!value.match(/\n/);
	if (textarea && (isMultiline || textarea.clientHeight > SingleLineInputHeight) && textarea.selectionStart > 0) {
		event.stopPropagation();
		return;
	}
}

function stopPropagationForMultiLineDownwards(event: IKeyboardEvent, value: string, textarea: HTMLTextAreaElement | null) {
	const isMultiline = !!value.match(/\n/);
	if (textarea && (isMultiline || textarea.clientHeight > SingleLineInputHeight) && textarea.selectionEnd < textarea.value.length) {
		event.stopPropagation();
		return;
	}
}


export class SearchWidget extends Widget {
	private static readonly INPUT_MAX_HEIGHT = 134;

	private static readonly REPLACE_ALL_DISABLED_LABEL = nls.localize('search.action.replaceAll.disabled.label', "Replace All (Submit Search to Enable)");
	private static readonly REPLACE_ALL_ENABLED_LABEL = (keyBindingService2: IKeybindingService): string => {
		const kb = keyBindingService2.lookupKeybinding(ReplaceAllAction.ID);
		return appendKeyBindingLabel(nls.localize('search.action.replaceAll.enabled.label', "Replace All"), kb);
	};

	domNode: HTMLElement | undefined;

	searchInput: SearchFindInput | undefined;
	searchInputFocusTracker: dom.IFocusTracker | undefined;
	private searchInputBoxFocused: IContextKey<boolean>;

	private replaceContainer: HTMLElement | undefined;
	replaceInput: ReplaceInput | undefined;
	replaceInputFocusTracker: dom.IFocusTracker | undefined;
	private replaceInputBoxFocused: IContextKey<boolean>;
	private toggleReplaceButton: Button | undefined;
	private replaceAllAction: ReplaceAllAction | undefined;
	private replaceActive: IContextKey<boolean>;
	private replaceActionBar: ActionBar | undefined;
	private _replaceHistoryDelayer: Delayer<void>;
	private ignoreGlobalFindBufferOnNextFocus = false;
	private previousGlobalFindBufferValue: string | null = null;

	private _onSearchSubmit = this._register(new Emitter<{ triggeredOnType: boolean; delay: number }>());
	readonly onSearchSubmit: Event<{ triggeredOnType: boolean; delay: number }> = this._onSearchSubmit.event;

	private _onSearchCancel = this._register(new Emitter<{ focus: boolean }>());
	readonly onSearchCancel: Event<{ focus: boolean }> = this._onSearchCancel.event;

	private _onReplaceToggled = this._register(new Emitter<void>());
	readonly onReplaceToggled: Event<void> = this._onReplaceToggled.event;

	private _onReplaceStateChange = this._register(new Emitter<boolean>());
	readonly onReplaceStateChange: Event<boolean> = this._onReplaceStateChange.event;

	private _onPreserveCaseChange = this._register(new Emitter<boolean>());
	readonly onPreserveCaseChange: Event<boolean> = this._onPreserveCaseChange.event;

	private _onReplaceValueChanged = this._register(new Emitter<void>());
	readonly onReplaceValueChanged: Event<void> = this._onReplaceValueChanged.event;

	private _onReplaceAll = this._register(new Emitter<void>());
	readonly onReplaceAll: Event<void> = this._onReplaceAll.event;

	private _onBlur = this._register(new Emitter<void>());
	readonly onBlur: Event<void> = this._onBlur.event;

	private _onDidHeightChange = this._register(new Emitter<void>());
	readonly onDidHeightChange: Event<void> = this._onDidHeightChange.event;

	private readonly _onDidToggleContext = new Emitter<void>();
	readonly onDidToggleContext: Event<void> = this._onDidToggleContext.event;

	private showContextToggle!: Toggle;
	public contextLinesInput!: InputBox;

	private _notebookFilters: NotebookFindFilters;
	private readonly _toggleReplaceButtonListener: MutableDisposable<IDisposable>;

	constructor(
		container: HTMLElement,
		options: ISearchWidgetOptions,
		@IContextViewService private readonly contextViewService: IContextViewService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IKeybindingService private readonly keybindingService: IKeybindingService,
		@IClipboardService private readonly clipboardServce: IClipboardService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IAccessibilityService private readonly accessibilityService: IAccessibilityService,
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IEditorService private readonly editorService: IEditorService,
	) {
		super();
		this.replaceActive = Constants.SearchContext.ReplaceActiveKey.bindTo(this.contextKeyService);
		this.searchInputBoxFocused = Constants.SearchContext.SearchInputBoxFocusedKey.bindTo(this.contextKeyService);
		this.replaceInputBoxFocused = Constants.SearchContext.ReplaceInputBoxFocusedKey.bindTo(this.contextKeyService);

		const notebookOptions = options.notebookOptions ??
		{
			isInNotebookMarkdownInput: true,
			isInNotebookMarkdownPreview: true,
			isInNotebookCellInput: true,
			isInNotebookCellOutput: true
		};
		this._notebookFilters = this._register(
			new NotebookFindFilters(
				notebookOptions.isInNotebookMarkdownInput,
				notebookOptions.isInNotebookMarkdownPreview,
				notebookOptions.isInNotebookCellInput,
				notebookOptions.isInNotebookCellOutput,
				{ findScopeType: NotebookFindScopeType.None }
			));

		this._register(
			this._notebookFilters.onDidChange(() => {
				if (this.searchInput) {
					this.searchInput.updateFilterStyles();
				}
			}));
		this._register(this.editorService.onDidEditorsChange((e) => {
			if (this.searchInput &&
				e.event.editor instanceof NotebookEditorInput &&
				(e.event.kind === GroupModelChangeKind.EDITOR_OPEN || e.event.kind === GroupModelChangeKind.EDITOR_CLOSE)) {
				this.searchInput.filterVisible = this._hasNotebookOpen();
			}
		}));

		this._replaceHistoryDelayer = new Delayer<void>(500);
		this._toggleReplaceButtonListener = this._register(new MutableDisposable<IDisposable>());

		this.render(container, options);

		this._register(this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('editor.accessibilitySupport')) {
				this.updateAccessibilitySupport();
			}
		}));

		this._register(this.accessibilityService.onDidChangeScreenReaderOptimized(() => this.updateAccessibilitySupport()));
		this.updateAccessibilitySupport();
	}

	private _hasNotebookOpen(): boolean {
		const editors = this.editorService.editors;
		return editors.some(editor => editor instanceof NotebookEditorInput);
	}

	getNotebookFilters() {
		return this._notebookFilters;
	}

	focus(select: boolean = true, focusReplace: boolean = false, suppressGlobalSearchBuffer = false): void {
		this.ignoreGlobalFindBufferOnNextFocus = suppressGlobalSearchBuffer;

		if (focusReplace && this.isReplaceShown()) {
			if (this.replaceInput) {
				this.replaceInput.focus();
				if (select) {
					this.replaceInput.select();
				}
			}
		} else {
			if (this.searchInput) {
				this.searchInput.focus();
				if (select) {
					this.searchInput.select();
				}
			}
		}
	}

	setWidth(width: number) {
		this.searchInput?.inputBox.layout();
		if (this.replaceInput) {
			this.replaceInput.width = width - 28;
			this.replaceInput.inputBox.layout();
		}
	}

	clear() {
		this.searchInput?.clear();
		this.replaceInput?.setValue('');
		this.setReplaceAllActionState(false);
	}

	isReplaceShown(): boolean {
		return this.replaceContainer ? !this.replaceContainer.classList.contains('disabled') : false;
	}

	isReplaceActive(): boolean {
		return !!this.replaceActive.get();
	}

	getReplaceValue(): string {
		return this.replaceInput?.getValue() ?? '';
	}

	toggleReplace(show?: boolean): void {
		if (show === undefined || show !== this.isReplaceShown()) {
			this.onToggleReplaceButton();
		}
	}

	getSearchHistory(): string[] {
		return this.searchInput?.inputBox.getHistory() ?? [];
	}

	getReplaceHistory(): string[] {
		return this.replaceInput?.inputBox.getHistory() ?? [];
	}

	prependSearchHistory(history: string[]): void {
		this.searchInput?.inputBox.prependHistory(history);
	}

	prependReplaceHistory(history: string[]): void {
		this.replaceInput?.inputBox.prependHistory(history);
	}

	clearHistory(): void {
		this.searchInput?.inputBox.clearHistory();
		this.replaceInput?.inputBox.clearHistory();
	}

	showNextSearchTerm() {
		this.searchInput?.inputBox.showNextValue();
	}

	showPreviousSearchTerm() {
		this.searchInput?.inputBox.showPreviousValue();
	}

	showNextReplaceTerm() {
		this.replaceInput?.inputBox.showNextValue();
	}

	showPreviousReplaceTerm() {
		this.replaceInput?.inputBox.showPreviousValue();
	}

	searchInputHasFocus(): boolean {
		return !!this.searchInputBoxFocused.get();
	}

	replaceInputHasFocus(): boolean {
		return !!this.replaceInput?.inputBox.hasFocus();
	}

	focusReplaceAllAction(): void {
		this.replaceActionBar?.focus(true);
	}

	focusRegexAction(): void {
		this.searchInput?.focusOnRegex();
	}

	set replaceButtonVisibility(val: boolean) {
		if (this.toggleReplaceButton) {
			this.toggleReplaceButton.element.style.display = val ? '' : 'none';
		}
	}

	private render(container: HTMLElement, options: ISearchWidgetOptions): void {
		this.domNode = dom.append(container, dom.$('.search-widget'));
		this.domNode.style.position = 'relative';

		if (!options._hideReplaceToggle) {
			this.renderToggleReplaceButton(this.domNode);
		}

		this.renderSearchInput(this.domNode, options);
		this.renderReplaceInput(this.domNode, options);
	}

	private updateAccessibilitySupport(): void {
		this.searchInput?.setFocusInputOnOptionClick(!this.accessibilityService.isScreenReaderOptimized());
	}

	private renderToggleReplaceButton(parent: HTMLElement): void {
		const opts: IButtonOptions = {
			buttonBackground: undefined,
			buttonBorder: undefined,
			buttonForeground: undefined,
			buttonHoverBackground: undefined,
			buttonSecondaryBackground: undefined,
			buttonSecondaryForeground: undefined,
			buttonSecondaryHoverBackground: undefined,
			buttonSeparator: undefined,
			title: nls.localize('search.replace.toggle.button.title', "Toggle Replace"),
			hoverDelegate: getDefaultHoverDelegate('element'),
		};
		this.toggleReplaceButton = this._register(new Button(parent, opts));
		this.toggleReplaceButton.element.setAttribute('aria-expanded', 'false');
		this.toggleReplaceButton.element.classList.add('toggle-replace-button');
		this.toggleReplaceButton.icon = searchHideReplaceIcon;
		this._toggleReplaceButtonListener.value = this.toggleReplaceButton.onDidClick(() => this.onToggleReplaceButton());
	}

	private renderSearchInput(parent: HTMLElement, options: ISearchWidgetOptions): void {
		const history = options.searchHistory || [];
		const inputOptions: IFindInputOptions = {
			label: nls.localize('label.Search', 'Search: Type Search Term and press Enter to search'),
			validation: (value: string) => this.validateSearchInput(value),
			placeholder: nls.localize('search.placeHolder', "Search"),
			appendCaseSensitiveLabel: appendKeyBindingLabel('', this.keybindingService.lookupKeybinding(Constants.SearchCommandIds.ToggleCaseSensitiveCommandId)),
			appendWholeWordsLabel: appendKeyBindingLabel('', this.keybindingService.lookupKeybinding(Constants.SearchCommandIds.ToggleWholeWordCommandId)),
			appendRegexLabel: appendKeyBindingLabel('', this.keybindingService.lookupKeybinding(Constants.SearchCommandIds.ToggleRegexCommandId)),
			history: new Set(history),
			showHistoryHint: () => showHistoryKeybindingHint(this.keybindingService),
			flexibleHeight: true,
			flexibleMaxHeight: SearchWidget.INPUT_MAX_HEIGHT,
			showCommonFindToggles: true,
			inputBoxStyles: options.inputBoxStyles,
			toggleStyles: options.toggleStyles,
			hoverLifecycleOptions,
		};

		const searchInputContainer = dom.append(parent, dom.$('.search-container.input-box'));

		this.searchInput = this._register(
			new SearchFindInput(
				searchInputContainer,
				this.contextViewService,
				inputOptions,
				this.contextKeyService,
				this.contextMenuService,
				this.instantiationService,
				this._notebookFilters,
				this._hasNotebookOpen()
			)
		);

		this._register(this.searchInput.onKeyDown((keyboardEvent: IKeyboardEvent) => this.onSearchInputKeyDown(keyboardEvent)));
		this.searchInput.setValue(options.value || '');
		this.searchInput.setRegex(!!options.isRegex);
		this.searchInput.setCaseSensitive(!!options.isCaseSensitive);
		this.searchInput.setWholeWords(!!options.isWholeWords);
		this._register(this.searchInput.onCaseSensitiveKeyDown((keyboardEvent: IKeyboardEvent) => this.onCaseSensitiveKeyDown(keyboardEvent)));
		this._register(this.searchInput.onRegexKeyDown((keyboardEvent: IKeyboardEvent) => this.onRegexKeyDown(keyboardEvent)));
		this._register(this.searchInput.inputBox.onDidChange(() => this.onSearchInputChanged()));
		this._register(this.searchInput.inputBox.onDidHeightChange(() => this._onDidHeightChange.fire()));

		this._register(this.onReplaceValueChanged(() => {
			this._replaceHistoryDelayer.trigger(() => this.replaceInput?.inputBox.addToHistory());
		}));

		this.searchInputFocusTracker = this._register(dom.trackFocus(this.searchInput.inputBox.inputElement));
		this._register(this.searchInputFocusTracker.onDidFocus(async () => {
			this.searchInputBoxFocused.set(true);

			const useGlobalFindBuffer = this.searchConfiguration.globalFindClipboard;
			if (!this.ignoreGlobalFindBufferOnNextFocus && useGlobalFindBuffer) {
				const globalBufferText = await this.clipboardServce.readFindText();
				if (globalBufferText && this.previousGlobalFindBufferValue !== globalBufferText) {
					this.searchInput?.inputBox.addToHistory();
					this.searchInput?.setValue(globalBufferText);
					this.searchInput?.select();
				}

				this.previousGlobalFindBufferValue = globalBufferText;
			}

			this.ignoreGlobalFindBufferOnNextFocus = false;
		}));
		this._register(this.searchInputFocusTracker.onDidBlur(() => this.searchInputBoxFocused.set(false)));


		this.showContextToggle = new Toggle({
			isChecked: false,
			title: appendKeyBindingLabel(nls.localize('showContext', "Toggle Context Lines"), this.keybindingService.lookupKeybinding(ToggleSearchEditorContextLinesCommandId)),
			icon: searchShowContextIcon,
			hoverLifecycleOptions,
			...defaultToggleStyles
		});
		this._register(this.showContextToggle.onChange(() => this.onContextLinesChanged()));

		if (options.showContextToggle) {
			this.contextLinesInput = new InputBox(searchInputContainer, this.contextViewService, { type: 'number', inputBoxStyles: defaultInputBoxStyles });
			this.contextLinesInput.element.classList.add('context-lines-input');
			this.contextLinesInput.value = '' + (this.configurationService.getValue<ISearchConfigurationProperties>('search').searchEditor.defaultNumberOfContextLines ?? 1);
			this._register(this.contextLinesInput.onDidChange((value: string) => {
				if (value !== '0') {
					this.showContextToggle.checked = true;
				}
				this.onContextLinesChanged();
			}));
			dom.append(searchInputContainer, this.showContextToggle.domNode);
		}
	}

	private onContextLinesChanged() {
		this._onDidToggleContext.fire();

		if (this.contextLinesInput.value.includes('-')) {
			this.contextLinesInput.value = '0';
		}

		this._onDidToggleContext.fire();
	}

	public setContextLines(lines: number) {
		if (!this.contextLinesInput) { return; }
		if (lines === 0) {
			this.showContextToggle.checked = false;
		} else {
			this.showContextToggle.checked = true;
			this.contextLinesInput.value = '' + lines;
		}
	}

	private renderReplaceInput(parent: HTMLElement, options: ISearchWidgetOptions): void {
		this.replaceContainer = dom.append(parent, dom.$('.replace-container.disabled'));
		const replaceBox = dom.append(this.replaceContainer, dom.$('.replace-input'));

		this.replaceInput = this._register(new ContextScopedReplaceInput(replaceBox, this.contextViewService, {
			label: nls.localize('label.Replace', 'Replace: Type replace term and press Enter to preview'),
			placeholder: nls.localize('search.replace.placeHolder', "Replace"),
			appendPreserveCaseLabel: appendKeyBindingLabel('', this.keybindingService.lookupKeybinding(Constants.SearchCommandIds.TogglePreserveCaseId)),
			history: new Set(options.replaceHistory),
			showHistoryHint: () => showHistoryKeybindingHint(this.keybindingService),
			flexibleHeight: true,
			flexibleMaxHeight: SearchWidget.INPUT_MAX_HEIGHT,
			inputBoxStyles: options.inputBoxStyles,
			toggleStyles: options.toggleStyles,
			hoverLifecycleOptions
		}, this.contextKeyService, true));

		this._register(this.replaceInput.onDidOptionChange(viaKeyboard => {
			if (!viaKeyboard) {
				if (this.replaceInput) {
					this._onPreserveCaseChange.fire(this.replaceInput.getPreserveCase());
				}
			}
		}));

		this._register(this.replaceInput.onKeyDown((keyboardEvent) => this.onReplaceInputKeyDown(keyboardEvent)));
		this.replaceInput.setValue(options.replaceValue || '');
		this._register(this.replaceInput.inputBox.onDidChange(() => this._onReplaceValueChanged.fire()));
		this._register(this.replaceInput.inputBox.onDidHeightChange(() => this._onDidHeightChange.fire()));

		this.replaceAllAction = new ReplaceAllAction(this);
		this.replaceAllAction.label = SearchWidget.REPLACE_ALL_DISABLED_LABEL;
		this.replaceActionBar = this._register(new ActionBar(this.replaceContainer));
		this.replaceActionBar.push([this.replaceAllAction], { icon: true, label: false });
		this.onkeydown(this.replaceActionBar.domNode, (keyboardEvent) => this.onReplaceActionbarKeyDown(keyboardEvent));

		this.replaceInputFocusTracker = this._register(dom.trackFocus(this.replaceInput.inputBox.inputElement));
		this._register(this.replaceInputFocusTracker.onDidFocus(() => this.replaceInputBoxFocused.set(true)));
		this._register(this.replaceInputFocusTracker.onDidBlur(() => this.replaceInputBoxFocused.set(false)));
		this._register(this.replaceInput.onPreserveCaseKeyDown((keyboardEvent: IKeyboardEvent) => this.onPreserveCaseKeyDown(keyboardEvent)));
	}

	triggerReplaceAll(): Promise<void> {
		this._onReplaceAll.fire();
		return Promise.resolve();
	}

	private onToggleReplaceButton(): void {
		this.replaceContainer?.classList.toggle('disabled');
		if (this.isReplaceShown()) {
			this.toggleReplaceButton?.element.classList.remove(...ThemeIcon.asClassNameArray(searchHideReplaceIcon));
			this.toggleReplaceButton?.element.classList.add(...ThemeIcon.asClassNameArray(searchShowReplaceIcon));
		} else {
			this.toggleReplaceButton?.element.classList.remove(...ThemeIcon.asClassNameArray(searchShowReplaceIcon));
			this.toggleReplaceButton?.element.classList.add(...ThemeIcon.asClassNameArray(searchHideReplaceIcon));
		}
		this.toggleReplaceButton?.element.setAttribute('aria-expanded', this.isReplaceShown() ? 'true' : 'false');
		this.updateReplaceActiveState();
		this._onReplaceToggled.fire();
	}

	setValue(value: string) {
		this.searchInput?.setValue(value);
	}

	setReplaceAllActionState(enabled: boolean): void {
		if (this.replaceAllAction && (this.replaceAllAction.enabled !== enabled)) {
			this.replaceAllAction.enabled = enabled;
			this.replaceAllAction.label = enabled ? SearchWidget.REPLACE_ALL_ENABLED_LABEL(this.keybindingService) : SearchWidget.REPLACE_ALL_DISABLED_LABEL;
			this.updateReplaceActiveState();
		}
	}

	private updateReplaceActiveState(): void {
		const currentState = this.isReplaceActive();
		const newState = this.isReplaceShown() && !!this.replaceAllAction?.enabled;
		if (currentState !== newState) {
			this.replaceActive.set(newState);
			this._onReplaceStateChange.fire(newState);
			this.replaceInput?.inputBox.layout();
		}
	}

	private validateSearchInput(value: string): IMessage | null {
		if (value.length === 0) {
			return null;
		}
		if (!(this.searchInput?.getRegex())) {
			return null;
		}
		try {
			new RegExp(value, 'u');
		} catch (e) {
			return { content: e.message };
		}

		return null;
	}

	private onSearchInputChanged(): void {
		this.searchInput?.clearMessage();
		this.setReplaceAllActionState(false);

		if (this.searchConfiguration.searchOnType) {
			if (this.searchInput?.getRegex()) {
				try {
					const regex = new RegExp(this.searchInput.getValue(), 'ug');
					const matchienessHeuristic = `
								~!@#$%^&*()_+
								\`1234567890-=
								qwertyuiop[]\\
								QWERTYUIOP{}|
								asdfghjkl;'
								ASDFGHJKL:"
								zxcvbnm,./
								ZXCVBNM<>? `.match(regex)?.length ?? 0;

					const delayMultiplier =
						matchienessHeuristic < 50 ? 1 :
							matchienessHeuristic < 100 ? 5 : // expressions like `.` or `\w`
								10; // only things matching empty string


					this.submitSearch(true, this.searchConfiguration.searchOnTypeDebouncePeriod * delayMultiplier);
				} catch {
					// pass
				}
			} else {
				this.submitSearch(true, this.searchConfiguration.searchOnTypeDebouncePeriod);
			}
		}
	}

	private onSearchInputKeyDown(keyboardEvent: IKeyboardEvent) {
		if (keyboardEvent.equals(ctrlKeyMod | KeyCode.Enter)) {
			this.searchInput?.inputBox.insertAtCursor('\n');
			keyboardEvent.preventDefault();
		}

		if (keyboardEvent.equals(KeyCode.Enter)) {
			this.searchInput?.onSearchSubmit();
			this.submitSearch();
			keyboardEvent.preventDefault();
		}

		else if (keyboardEvent.equals(KeyCode.Escape)) {
			this._onSearchCancel.fire({ focus: true });
			keyboardEvent.preventDefault();
		}

		else if (keyboardEvent.equals(KeyCode.Tab)) {
			if (this.isReplaceShown()) {
				this.replaceInput?.focus();
			} else {
				this.searchInput?.focusOnCaseSensitive();
			}
			keyboardEvent.preventDefault();
		}

		else if (keyboardEvent.equals(KeyCode.UpArrow)) {
			// eslint-disable-next-line no-restricted-syntax
			stopPropagationForMultiLineUpwards(keyboardEvent, this.searchInput?.getValue() ?? '', this.searchInput?.domNode.querySelector('textarea') ?? null);
		}

		else if (keyboardEvent.equals(KeyCode.DownArrow)) {
			// eslint-disable-next-line no-restricted-syntax
			stopPropagationForMultiLineDownwards(keyboardEvent, this.searchInput?.getValue() ?? '', this.searchInput?.domNode.querySelector('textarea') ?? null);
		}

		else if (keyboardEvent.equals(KeyCode.PageUp)) {
			const inputElement = this.searchInput?.inputBox.inputElement;
			if (inputElement) {
				inputElement.setSelectionRange(0, 0);
				inputElement.focus();
				keyboardEvent.preventDefault();
			}
		}

		else if (keyboardEvent.equals(KeyCode.PageDown)) {
			const inputElement = this.searchInput?.inputBox.inputElement;
			if (inputElement) {
				const endOfText = inputElement.value.length;
				inputElement.setSelectionRange(endOfText, endOfText);
				inputElement.focus();
				keyboardEvent.preventDefault();
			}
		}
	}

	private onCaseSensitiveKeyDown(keyboardEvent: IKeyboardEvent) {
		if (keyboardEvent.equals(KeyMod.Shift | KeyCode.Tab)) {
			if (this.isReplaceShown()) {
				this.replaceInput?.focus();
				keyboardEvent.preventDefault();
			}
		}
	}

	private onRegexKeyDown(keyboardEvent: IKeyboardEvent) {
		if (keyboardEvent.equals(KeyCode.Tab)) {
			if (this.isReplaceShown()) {
				this.replaceInput?.focusOnPreserve();
				keyboardEvent.preventDefault();
			}
		}
	}

	private onPreserveCaseKeyDown(keyboardEvent: IKeyboardEvent) {
		if (keyboardEvent.equals(KeyCode.Tab)) {
			if (this.isReplaceActive()) {
				this.focusReplaceAllAction();
			} else {
				this._onBlur.fire();
			}
			keyboardEvent.preventDefault();
		}
		else if (keyboardEvent.equals(KeyMod.Shift | KeyCode.Tab)) {
			this.focusRegexAction();
			keyboardEvent.preventDefault();
		}
	}

	private onReplaceInputKeyDown(keyboardEvent: IKeyboardEvent) {
		if (keyboardEvent.equals(ctrlKeyMod | KeyCode.Enter)) {
			this.replaceInput?.inputBox.insertAtCursor('\n');
			keyboardEvent.preventDefault();
		}

		if (keyboardEvent.equals(KeyCode.Enter)) {
			this.submitSearch();
			keyboardEvent.preventDefault();
		}

		else if (keyboardEvent.equals(KeyCode.Tab)) {
			this.searchInput?.focusOnCaseSensitive();
			keyboardEvent.preventDefault();
		}

		else if (keyboardEvent.equals(KeyMod.Shift | KeyCode.Tab)) {
			this.searchInput?.focus();
			keyboardEvent.preventDefault();
		}

		else if (keyboardEvent.equals(KeyCode.UpArrow)) {
			// eslint-disable-next-line no-restricted-syntax
			stopPropagationForMultiLineUpwards(keyboardEvent, this.replaceInput?.getValue() ?? '', this.replaceInput?.domNode.querySelector('textarea') ?? null);
		}

		else if (keyboardEvent.equals(KeyCode.DownArrow)) {
			// eslint-disable-next-line no-restricted-syntax
			stopPropagationForMultiLineDownwards(keyboardEvent, this.replaceInput?.getValue() ?? '', this.replaceInput?.domNode.querySelector('textarea') ?? null);
		}
	}

	private onReplaceActionbarKeyDown(keyboardEvent: IKeyboardEvent) {
		if (keyboardEvent.equals(KeyMod.Shift | KeyCode.Tab)) {
			this.focusRegexAction();
			keyboardEvent.preventDefault();
		}
	}

	private async submitSearch(triggeredOnType = false, delay: number = 0): Promise<void> {
		this.searchInput?.validate();
		if (!this.searchInput?.inputBox.isInputValid()) {
			return;
		}

		const value = this.searchInput.getValue();
		const useGlobalFindBuffer = this.searchConfiguration.globalFindClipboard;
		if (value && useGlobalFindBuffer) {
			await this.clipboardServce.writeFindText(value);
		}
		this._onSearchSubmit.fire({ triggeredOnType, delay });
	}

	getContextLines() {
		return this.showContextToggle.checked ? +this.contextLinesInput.value : 0;
	}

	modifyContextLines(increase: boolean) {
		const current = +this.contextLinesInput.value;
		const modified = current + (increase ? 1 : -1);
		this.showContextToggle.checked = modified !== 0;
		this.contextLinesInput.value = '' + modified;
	}

	toggleContextLines() {
		this.showContextToggle.checked = !this.showContextToggle.checked;
		this.onContextLinesChanged();
	}

	override dispose(): void {
		this.setReplaceAllActionState(false);
		super.dispose();
	}

	private get searchConfiguration(): ISearchConfigurationProperties {
		return this.configurationService.getValue<ISearchConfigurationProperties>('search');
	}
}

export function registerContributions() {
	KeybindingsRegistry.registerCommandAndKeybindingRule({
		id: ReplaceAllAction.ID,
		weight: KeybindingWeight.WorkbenchContrib,
		when: ContextKeyExpr.and(Constants.SearchContext.SearchViewVisibleKey, Constants.SearchContext.ReplaceActiveKey, CONTEXT_FIND_WIDGET_NOT_VISIBLE),
		primary: KeyMod.Alt | KeyMod.CtrlCmd | KeyCode.Enter,
		handler: accessor => {
			const viewsService = accessor.get(IViewsService);
			if (isSearchViewFocused(viewsService)) {
				const searchView = getSearchView(viewsService);
				if (searchView) {
					new ReplaceAllAction(searchView.searchAndReplaceWidget).run();
				}
			}
		}
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/browser/symbolsQuickAccess.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/browser/symbolsQuickAccess.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { IPickerQuickAccessItem, PickerQuickAccessProvider, TriggerAction } from '../../../../platform/quickinput/browser/pickerQuickAccess.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { ThrottledDelayer } from '../../../../base/common/async.js';
import { getWorkspaceSymbols, IWorkspaceSymbol, IWorkspaceSymbolProvider } from '../common/search.js';
import { SymbolKinds, SymbolTag, SymbolKind } from '../../../../editor/common/languages.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { Schemas } from '../../../../base/common/network.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IEditorService, SIDE_GROUP, ACTIVE_GROUP } from '../../../services/editor/common/editorService.js';
import { Range } from '../../../../editor/common/core/range.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IWorkbenchEditorConfiguration } from '../../../common/editor.js';
import { IKeyMods, IQuickPickItemWithResource } from '../../../../platform/quickinput/common/quickInput.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { getSelectionSearchString } from '../../../../editor/contrib/find/browser/findController.js';
import { prepareQuery, IPreparedQuery, scoreFuzzy2, pieceToQuery } from '../../../../base/common/fuzzyScorer.js';
import { IMatch } from '../../../../base/common/filters.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { ThemeIcon } from '../../../../base/common/themables.js';

export interface ISymbolQuickPickItem extends IPickerQuickAccessItem, IQuickPickItemWithResource {
	score?: number;
	symbol?: IWorkspaceSymbol;
}

export class SymbolsQuickAccessProvider extends PickerQuickAccessProvider<ISymbolQuickPickItem> {

	static PREFIX = '#';

	private static readonly TYPING_SEARCH_DELAY = 200; // this delay accommodates for the user typing a word and then stops typing to start searching

	private static TREAT_AS_GLOBAL_SYMBOL_TYPES = new Set<SymbolKind>([
		SymbolKind.Class,
		SymbolKind.Enum,
		SymbolKind.File,
		SymbolKind.Interface,
		SymbolKind.Namespace,
		SymbolKind.Package,
		SymbolKind.Module
	]);

	private delayer = this._register(new ThrottledDelayer<ISymbolQuickPickItem[]>(SymbolsQuickAccessProvider.TYPING_SEARCH_DELAY));

	get defaultFilterValue(): string | undefined {

		// Prefer the word under the cursor in the active editor as default filter
		const editor = this.codeEditorService.getFocusedCodeEditor();
		if (editor) {
			return getSelectionSearchString(editor) ?? undefined;
		}

		return undefined;
	}

	constructor(
		@ILabelService private readonly labelService: ILabelService,
		@IOpenerService private readonly openerService: IOpenerService,
		@IEditorService private readonly editorService: IEditorService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@ICodeEditorService private readonly codeEditorService: ICodeEditorService
	) {
		super(SymbolsQuickAccessProvider.PREFIX, {
			canAcceptInBackground: true,
			noResultsPick: {
				label: localize('noSymbolResults', "No matching workspace symbols")
			}
		});
	}

	private get configuration() {
		const editorConfig = this.configurationService.getValue<IWorkbenchEditorConfiguration>().workbench?.editor;

		return {
			openEditorPinned: !editorConfig?.enablePreviewFromQuickOpen || !editorConfig?.enablePreview,
			openSideBySideDirection: editorConfig?.openSideBySideDirection
		};
	}

	protected _getPicks(filter: string, disposables: DisposableStore, token: CancellationToken): Promise<Array<ISymbolQuickPickItem>> {
		return this.getSymbolPicks(filter, undefined, token);
	}

	async getSymbolPicks(filter: string, options: { skipLocal?: boolean; skipSorting?: boolean; delay?: number } | undefined, token: CancellationToken): Promise<Array<ISymbolQuickPickItem>> {
		return this.delayer.trigger(async () => {
			if (token.isCancellationRequested) {
				return [];
			}

			return this.doGetSymbolPicks(prepareQuery(filter), options, token);
		}, options?.delay);
	}

	private async doGetSymbolPicks(query: IPreparedQuery, options: { skipLocal?: boolean; skipSorting?: boolean } | undefined, token: CancellationToken): Promise<Array<ISymbolQuickPickItem>> {

		// Split between symbol and container query
		let symbolQuery: IPreparedQuery;
		let containerQuery: IPreparedQuery | undefined;
		if (query.values && query.values.length > 1) {
			symbolQuery = pieceToQuery(query.values[0]); 		  // symbol: only match on first part
			containerQuery = pieceToQuery(query.values.slice(1)); // container: match on all but first parts
		} else {
			symbolQuery = query;
		}

		// Run the workspace symbol query
		const workspaceSymbols = await getWorkspaceSymbols(symbolQuery.original, token);
		if (token.isCancellationRequested) {
			return [];
		}

		const symbolPicks: Array<ISymbolQuickPickItem> = [];

		// Convert to symbol picks and apply filtering
		const openSideBySideDirection = this.configuration.openSideBySideDirection;
		for (const { symbol, provider } of workspaceSymbols) {

			// Depending on the workspace symbols filter setting, skip over symbols that:
			// - do not have a container
			// - and are not treated explicitly as global symbols (e.g. classes)
			if (options?.skipLocal && !SymbolsQuickAccessProvider.TREAT_AS_GLOBAL_SYMBOL_TYPES.has(symbol.kind) && !!symbol.containerName) {
				continue;
			}

			const symbolLabel = symbol.name;

			// Score by symbol label if searching
			let symbolScore: number | undefined = undefined;
			let symbolMatches: IMatch[] | undefined = undefined;
			let skipContainerQuery = false;
			if (symbolQuery.original.length > 0) {

				// First: try to score on the entire query, it is possible that
				// the symbol matches perfectly (e.g. searching for "change log"
				// can be a match on a markdown symbol "change log"). In that
				// case we want to skip the container query altogether.
				if (symbolQuery !== query) {
					[symbolScore, symbolMatches] = scoreFuzzy2(symbolLabel, { ...query, values: undefined /* disable multi-query support */ }, 0, 0);
					if (typeof symbolScore === 'number') {
						skipContainerQuery = true; // since we consumed the query, skip any container matching
					}
				}

				// Otherwise: score on the symbol query and match on the container later
				if (typeof symbolScore !== 'number') {
					[symbolScore, symbolMatches] = scoreFuzzy2(symbolLabel, symbolQuery, 0, 0);
					if (typeof symbolScore !== 'number') {
						continue;
					}
				}
			}

			const symbolUri = symbol.location.uri;
			let containerLabel: string | undefined = undefined;
			if (symbolUri) {
				const containerPath = this.labelService.getUriLabel(symbolUri, { relative: true });
				if (symbol.containerName) {
					containerLabel = `${symbol.containerName} • ${containerPath}`;
				} else {
					containerLabel = containerPath;
				}
			}

			// Score by container if specified and searching
			let containerScore: number | undefined = undefined;
			let containerMatches: IMatch[] | undefined = undefined;
			if (!skipContainerQuery && containerQuery && containerQuery.original.length > 0) {
				if (containerLabel) {
					[containerScore, containerMatches] = scoreFuzzy2(containerLabel, containerQuery);
				}

				if (typeof containerScore !== 'number') {
					continue;
				}

				if (typeof symbolScore === 'number') {
					symbolScore += containerScore; // boost symbolScore by containerScore
				}
			}

			const deprecated = symbol.tags ? symbol.tags.indexOf(SymbolTag.Deprecated) >= 0 : false;

			symbolPicks.push({
				symbol,
				resource: symbolUri,
				score: symbolScore,
				iconClass: ThemeIcon.asClassName(SymbolKinds.toIcon(symbol.kind)),
				label: symbolLabel,
				ariaLabel: symbolLabel,
				highlights: deprecated ? undefined : {
					label: symbolMatches,
					description: containerMatches
				},
				description: containerLabel,
				strikethrough: deprecated,
				buttons: [
					{
						iconClass: openSideBySideDirection === 'right' ? ThemeIcon.asClassName(Codicon.splitHorizontal) : ThemeIcon.asClassName(Codicon.splitVertical),
						tooltip: openSideBySideDirection === 'right' ? localize('openToSide', "Open to the Side") : localize('openToBottom', "Open to the Bottom")
					}
				],
				trigger: (buttonIndex, keyMods) => {
					this.openSymbol(provider, symbol, token, { keyMods, forceOpenSideBySide: true });

					return TriggerAction.CLOSE_PICKER;
				},
				accept: async (keyMods, event) => this.openSymbol(provider, symbol, token, { keyMods, preserveFocus: event.inBackground, forcePinned: event.inBackground }),
			});

		}

		// Sort picks (unless disabled)
		if (!options?.skipSorting) {
			symbolPicks.sort((symbolA, symbolB) => this.compareSymbols(symbolA, symbolB));
		}

		return symbolPicks;
	}

	private async openSymbol(provider: IWorkspaceSymbolProvider, symbol: IWorkspaceSymbol, token: CancellationToken, options: { keyMods: IKeyMods; forceOpenSideBySide?: boolean; preserveFocus?: boolean; forcePinned?: boolean }): Promise<void> {

		// Resolve actual symbol to open for providers that can resolve
		let symbolToOpen = symbol;
		if (typeof provider.resolveWorkspaceSymbol === 'function') {
			symbolToOpen = await provider.resolveWorkspaceSymbol(symbol, token) || symbol;

			if (token.isCancellationRequested) {
				return;
			}
		}

		// Open HTTP(s) links with opener service
		if (symbolToOpen.location.uri.scheme === Schemas.http || symbolToOpen.location.uri.scheme === Schemas.https) {
			await this.openerService.open(symbolToOpen.location.uri, { fromUserGesture: true, allowContributedOpeners: true });
		}

		// Otherwise open as editor
		else {
			await this.editorService.openEditor({
				resource: symbolToOpen.location.uri,
				options: {
					preserveFocus: options?.preserveFocus,
					pinned: options.keyMods.ctrlCmd || options.forcePinned || this.configuration.openEditorPinned,
					selection: symbolToOpen.location.range ? Range.collapseToStart(symbolToOpen.location.range) : undefined
				}
			}, options.keyMods.alt || (this.configuration.openEditorPinned && options.keyMods.ctrlCmd) || options?.forceOpenSideBySide ? SIDE_GROUP : ACTIVE_GROUP);
		}
	}

	private compareSymbols(symbolA: ISymbolQuickPickItem, symbolB: ISymbolQuickPickItem): number {

		// By score
		if (typeof symbolA.score === 'number' && typeof symbolB.score === 'number') {
			if (symbolA.score > symbolB.score) {
				return -1;
			}

			if (symbolA.score < symbolB.score) {
				return 1;
			}
		}

		// By name
		if (symbolA.symbol && symbolB.symbol) {
			const symbolAName = symbolA.symbol.name.toLowerCase();
			const symbolBName = symbolB.symbol.name.toLowerCase();
			const res = symbolAName.localeCompare(symbolBName);
			if (res !== 0) {
				return res;
			}
		}

		// By kind
		if (symbolA.symbol && symbolB.symbol) {
			const symbolAKind = SymbolKinds.toIcon(symbolA.symbol.kind).id;
			const symbolBKind = SymbolKinds.toIcon(symbolB.symbol.kind).id;
			return symbolAKind.localeCompare(symbolBKind);
		}

		return 0;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/browser/AISearch/aiSearchModel.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/browser/AISearch/aiSearchModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../../base/common/event.js';
import { Lazy } from '../../../../../base/common/lazy.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { URI } from '../../../../../base/common/uri.js';
import { IPosition } from '../../../../../editor/common/core/position.js';
import { ITextModel } from '../../../../../editor/common/model.js';
import { IModelService } from '../../../../../editor/common/services/model.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { ILabelService } from '../../../../../platform/label/common/label.js';
import { IUriIdentityService } from '../../../../../platform/uriIdentity/common/uriIdentity.js';
import { IAITextQuery, IFileMatch, ITextSearchPreviewOptions, resultIsMatch } from '../../../../services/search/common/search.js';
import { NotebookEditorWidget } from '../../../notebook/browser/notebookEditorWidget.js';
import { IReplaceService } from '../replace.js';

import { FileMatchImpl } from '../searchTreeModel/fileMatch.js';
import { ISearchResult, TEXT_SEARCH_HEADING_PREFIX, AI_TEXT_SEARCH_RESULT_ID, ISearchTreeFolderMatchWorkspaceRoot, ISearchTreeFolderMatch, ISearchTreeFolderMatchWithResource, ITextSearchHeading, IChangeEvent, ISearchModel, ISearchTreeFileMatch, FOLDER_MATCH_PREFIX, getFileMatches, FILE_MATCH_PREFIX } from '../searchTreeModel/searchTreeCommon.js';
import { TextSearchHeadingImpl } from '../searchTreeModel/textSearchHeading.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { textSearchResultToMatches } from '../searchTreeModel/match.js';
import { ISearchTreeAIFileMatch } from './aiSearchModelBase.js';
import { ResourceSet } from '../../../../../base/common/map.js';

export class AITextSearchHeadingImpl extends TextSearchHeadingImpl<IAITextQuery> {
	public override hidden: boolean;
	constructor(
		parent: ISearchResult,
		@IInstantiationService instantiationService: IInstantiationService,
		@IUriIdentityService uriIdentityService: IUriIdentityService
	) {
		super(false, parent, instantiationService, uriIdentityService);

		this.hidden = true;
	}

	override name(): string {
		return 'AI';
	}

	id(): string {
		return TEXT_SEARCH_HEADING_PREFIX + AI_TEXT_SEARCH_RESULT_ID;
	}

	get isAIContributed(): boolean {
		return true;
	}

	override get query(): IAITextQuery | null {
		return this._query;
	}

	override set query(query: IAITextQuery | null) {
		this.clearQuery();
		if (!query) {
			return;
		}

		this._folderMatches = (query && query.folderQueries || [])
			.map(fq => fq.folder)
			.map((resource, index) => <ISearchTreeFolderMatchWorkspaceRoot>this._createBaseFolderMatch(resource, resource.toString(), index, query));

		this._folderMatches.forEach(fm => this._folderMatchesMap.set(fm.resource, fm));

		this._query = query;
	}

	override fileCount(): number {
		const uniqueFileUris = new ResourceSet();
		for (const folderMatch of this.folderMatches()) {
			if (folderMatch.isEmpty()) {
				continue;
			}
			for (const fileMatch of folderMatch.allDownstreamFileMatches()) {
				uniqueFileUris.add(fileMatch.resource);
			}
		}

		return uniqueFileUris.size;
	}

	private _createBaseFolderMatch(resource: URI, id: string, index: number, query: IAITextQuery): ISearchTreeFolderMatch {
		const folderMatch: ISearchTreeFolderMatch = this._register(this.createWorkspaceRootWithResourceImpl(resource, id, index, query));
		const disposable = folderMatch.onChange((event) => this._onChange.fire(event));
		this._register(folderMatch.onDispose(() => disposable.dispose()));
		return folderMatch;
	}

	private createWorkspaceRootWithResourceImpl(resource: URI, id: string, index: number, query: IAITextQuery): ISearchTreeFolderMatchWorkspaceRoot {
		return this.instantiationService.createInstance(AIFolderMatchWorkspaceRootImpl, resource, id, index, query, this);
	}
}

export class AIFolderMatchWorkspaceRootImpl extends Disposable implements ISearchTreeFolderMatchWorkspaceRoot {
	protected _onChange = this._register(new Emitter<IChangeEvent>());
	readonly onChange: Event<IChangeEvent> = this._onChange.event;

	private _onDispose = this._register(new Emitter<void>());
	readonly onDispose: Event<void> = this._onDispose.event;
	private readonly _id: string;
	private _name: Lazy<string>;
	protected _unDisposedFileMatches: Map<string, ISearchTreeFileMatch>; // id to fileMatch

	protected _fileMatches: Map<string, ISearchTreeFileMatch>; // id to fileMatch

	constructor(private _resource: URI,
		_id: string,
		private _index: number,
		private _query: IAITextQuery,
		private _parent: ITextSearchHeading,
		@IInstantiationService private instantiationService: IInstantiationService,
		@ILabelService labelService: ILabelService,
	) {
		super();
		this._fileMatches = new Map<string, ISearchTreeFileMatch>();

		this._id = FOLDER_MATCH_PREFIX + _id;
		this._name = new Lazy(() => this.resource ? labelService.getUriBasenameLabel(this.resource) : '');
		this._unDisposedFileMatches = new Map<string, ISearchTreeFileMatch>();
	}
	get resource(): URI {
		return this._resource;
	}
	id(): string {
		return this._id;
	}

	index(): number {
		return this._index;
	}
	name(): string {
		return this._name.value;
	}
	count(): number {
		return this._fileMatches.size;
	}

	doAddFile(fileMatch: ISearchTreeFileMatch): void {
		this._fileMatches.set(fileMatch.id(), fileMatch);
	}

	private latestRank = 0;
	createAndConfigureFileMatch(rawFileMatch: IFileMatch<URI>, searchInstanceID: string): FileMatchImpl {

		const fileMatch =
			this.instantiationService.createInstance(
				AIFileMatch,
				this._query.contentPattern,
				this._query.previewOptions,
				this._query.maxResults,
				this,
				rawFileMatch,
				this,
				rawFileMatch.resource.toString() + '_' + Date.now().toString(),
				this.latestRank++,
			);
		fileMatch.createMatches();
		this.doAddFile(fileMatch);
		const disposable = fileMatch.onChange(({ didRemove }) => this.onFileChange(fileMatch, didRemove));
		this._register(fileMatch.onDispose(() => disposable.dispose()));
		return fileMatch;
	}

	isAIContributed(): boolean {
		return true;
	}

	private onFileChange(fileMatch: ISearchTreeFileMatch, removed = false): void {
		let added = false;
		if (!this._fileMatches.has(fileMatch.id())) {
			this.doAddFile(fileMatch);
			added = true;
		}
		if (fileMatch.count() === 0) {
			this.doRemoveFile([fileMatch], false, false);
			added = false;
			removed = true;
		}
		this._onChange.fire({ elements: [fileMatch], added: added, removed: removed });

	}

	get hasChildren(): boolean {
		return this._fileMatches.size > 0;
	}

	parent(): ISearchTreeFolderMatch | ITextSearchHeading {
		return this._parent;
	}
	matches(): (ISearchTreeFileMatch | ISearchTreeFolderMatchWithResource)[] {
		return [...this._fileMatches.values()];
	}
	allDownstreamFileMatches(): ISearchTreeFileMatch[] {
		return [...this._fileMatches.values()];
	}

	remove(matches: ISearchTreeFileMatch | ISearchTreeFolderMatchWithResource | (ISearchTreeFileMatch | ISearchTreeFolderMatchWithResource)[]): void {
		if (!Array.isArray(matches)) {
			matches = [matches];
		}
		const allMatches = getFileMatches(matches);
		this.doRemoveFile(allMatches);
	}
	addFileMatch(raw: IFileMatch[], silent: boolean, searchInstanceID: string): void {
		// when adding a fileMatch that has intermediate directories
		const added: ISearchTreeFileMatch[] = [];
		const updated: ISearchTreeFileMatch[] = [];

		raw.forEach(rawFileMatch => {
			const fileMatch = this.createAndConfigureFileMatch(rawFileMatch, searchInstanceID);
			added.push(fileMatch);
		});

		const elements = [...added, ...updated];
		if (!silent && elements.length) {
			this._onChange.fire({ elements, added: !!added.length });
		}
	}
	isEmpty(): boolean {
		return this.recursiveFileCount() === 0;
	}
	clear(clearingAll?: boolean): void {
		const changed: ISearchTreeFileMatch[] = this.allDownstreamFileMatches();
		if (changed.length > 0) {
			this.disposeMatches();
			this._onChange.fire({ elements: changed, removed: true, added: false, clearingAll });
		}
	}

	get showHighlights(): boolean {
		return this._parent.showHighlights;
	}

	get searchModel(): ISearchModel {
		return this._searchResult.searchModel;
	}

	get _searchResult(): ISearchResult {
		return this._parent.parent();
	}

	get query(): IAITextQuery | null {
		return this._query;
	}
	getDownstreamFileMatch(uri: URI): ISearchTreeFileMatch | null {
		for (const fileMatch of this._fileMatches.values()) {
			if (fileMatch.resource.toString() === uri.toString()) {
				return fileMatch;
			}
		}
		return null;
	}
	replaceAll(): Promise<any> {
		throw new Error('Cannot replace in AI search');
	}
	recursiveFileCount(): number {
		return this._fileMatches.size;
	}

	doRemoveFile(fileMatches: ISearchTreeFileMatch[], dispose: boolean = true, trigger: boolean = true, keepReadonly = false): void {

		const removed = [];
		for (const match of fileMatches as ISearchTreeFileMatch[]) {
			if (this._fileMatches.get(match.id())) {
				if (keepReadonly && match.hasReadonlyMatches()) {
					continue;
				}
				this._fileMatches.delete(match.id());
				if (dispose) {
					match.dispose();
				} else {
					this._unDisposedFileMatches.set(match.id(), match);
				}
				removed.push(match);
			}
		}

		if (trigger) {
			this._onChange.fire({ elements: removed, removed: true });
		}
	}

	replace(match: ISearchTreeFileMatch): Promise<any> {
		throw new Error('Cannot replace in AI search');
	}
	replacingAll: boolean = false;

	bindModel(model: ITextModel): void {
		// no op
	}
	unbindNotebookEditorWidget(editor: NotebookEditorWidget, resource: URI): void {
		//no op
	}
	bindNotebookEditorWidget(editor: NotebookEditorWidget, resource: URI): Promise<void> {
		//no op
		return Promise.resolve();
	}

	hasOnlyReadOnlyMatches(): boolean {
		return Array.from(this._fileMatches.values()).every(fm => fm.hasOnlyReadOnlyMatches());
	}
	fileMatchesIterator(): IterableIterator<ISearchTreeFileMatch> {
		return this._fileMatches.values();
	}
	folderMatchesIterator(): IterableIterator<ISearchTreeFolderMatchWithResource> {
		return [].values();
	}
	recursiveMatchCount(): number {
		return this._fileMatches.size;
	}

	private disposeMatches(): void {
		[...this._fileMatches.values()].forEach((fileMatch: ISearchTreeFileMatch) => fileMatch.dispose());
		[...this._unDisposedFileMatches.values()].forEach((fileMatch: ISearchTreeFileMatch) => fileMatch.dispose());
		this._fileMatches.clear();
	}

	override dispose(): void {
		this.disposeMatches();
		this._onDispose.fire();
		super.dispose();
	}
}

class AIFileMatch extends FileMatchImpl implements ISearchTreeAIFileMatch {
	constructor(
		_query: string,
		_previewOptions: ITextSearchPreviewOptions | undefined,
		_maxResults: number | undefined,
		_parent: ISearchTreeFolderMatch,
		rawMatch: IFileMatch,
		_closestRoot: ISearchTreeFolderMatchWorkspaceRoot | null,
		private readonly _id: string,
		public readonly rank: number,
		@IModelService modelService: IModelService,
		@IReplaceService replaceService: IReplaceService,
		@ILabelService labelService: ILabelService,
	) {
		super({ pattern: _query }, _previewOptions, _maxResults, _parent, rawMatch, _closestRoot, modelService, replaceService, labelService);
	}

	override id() {
		return FILE_MATCH_PREFIX + this._id;
	}
	getFullRange(): Range | undefined {

		let earliestStart: IPosition | undefined = undefined;
		let latestEnd: IPosition | undefined = undefined;

		for (const match of this.matches()) {
			const matchStart = match.range().getStartPosition();
			const matchEnd = match.range().getEndPosition();
			if (earliestStart === undefined) {
				earliestStart = matchStart;
			} else if (matchStart.isBefore(earliestStart)) {
				earliestStart = matchStart;
			}

			if (latestEnd === undefined) {
				latestEnd = matchEnd;
			} else if (!matchEnd.isBefore(latestEnd)) {
				latestEnd = matchEnd;
			}
		}

		if (earliestStart === undefined || latestEnd === undefined) {
			return undefined;
		}
		return new Range(earliestStart.lineNumber, earliestStart.column, latestEnd.lineNumber, latestEnd.column);

	}

	private rangeAsString(): undefined | string {
		const range = this.getFullRange();
		if (!range) {
			return undefined;
		}
		return range.startLineNumber + ':' + range.startColumn + '-' + range.endLineNumber + ':' + range.endColumn;
	}

	override name(): string {
		const range = this.rangeAsString();
		return super.name() + range ? ' ' + range : '';
	}

	override createMatches(): void {
		if (this.rawMatch.results) {
			this.rawMatch.results
				.filter(resultIsMatch)
				.forEach(rawMatch => {
					textSearchResultToMatches(rawMatch, this, true)
						.forEach(m => this.add(m));
				});
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/browser/AISearch/aiSearchModelBase.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/browser/AISearch/aiSearchModelBase.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ISearchTreeFileMatch } from '../searchTreeModel/searchTreeCommon.js';
import { Range } from '../../../../../editor/common/core/range.js';

export interface ISearchTreeAIFileMatch extends ISearchTreeFileMatch {
	getFullRange(): Range | undefined;
	readonly rank: number;
}

export function isSearchTreeAIFileMatch(obj: any): obj is ISearchTreeAIFileMatch {
	return obj && obj.getFullRange && obj.getFullRange() instanceof Range;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/browser/media/anythingQuickAccess.css]---
Location: vscode-main/src/vs/workbench/contrib/search/browser/media/anythingQuickAccess.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.quick-input-list .quick-input-list-entry.has-actions:hover .quick-input-list-entry-action-bar .action-label.dirty-anything::before {
	/* Close icon flips between black dot and "X" for dirty open editors */
	content: var(--vscode-icon-x-content);
	font-family: var(--vscode-icon-x-font-family);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/browser/media/searchview.css]---
Location: vscode-main/src/vs/workbench/contrib/search/browser/media/searchview.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.search-view {
	display: flex;
	flex-direction: column;
	height: 100%;
}

.search-view .results {
	flex-grow: 1;
	min-height: 0;
	/* Allow it to be smaller than its contents */
}

.search-view .search-widgets-container {
	margin: 0px 12px 0 2px;
	padding-top: 6px;
	padding-bottom: 6px;
}

.search-view .search-widget .toggle-replace-button {
	position: absolute;
	top: 0;
	left: 0;
	width: 16px;
	height: 100%;
	color: inherit;
	box-sizing: border-box;
	background-position: center center;
	background-repeat: no-repeat;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: unset;
}

.monaco-workbench .search-view .search-widget .toggle-replace-button:hover {
	background-color: var(--vscode-toolbar-hoverBackground)
}

.monaco-workbench .search-view .search-widget .toggle-replace-button:active {
	background-color: var(--vscode-toolbar-activeBackground)
}

.search-view .search-widget .search-container,
.search-view .search-widget .replace-container {
	margin-left: 18px;
}

.search-view .search-widget .monaco-inputbox > .ibwrapper {
	height: 100%;
}

.search-view .search-widget .monaco-inputbox > .ibwrapper > .mirror,
.search-view .search-widget .monaco-inputbox > .ibwrapper > textarea.input {
	padding: 3px 0px 3px 6px;
}

/* NOTE: height is also used in searchWidget.ts as a constant*/
.search-view .search-widget .monaco-inputbox > .ibwrapper > textarea.input {
	overflow: initial;
	/* set initial height before measure */
	height: 26px;
}

.search-view .search-widget .monaco-findInput .monaco-scrollable-element .scrollbar {
	opacity: 0;
}

.search-view .monaco-inputbox > .ibwrapper > textarea.input {
	/* Firefox: hide scrollbar */
	scrollbar-width: none;
}

.search-view .monaco-inputbox > .ibwrapper > textarea.input::-webkit-scrollbar {
	display: none;
}

.search-view .monaco-findInput {
	display: inline-block;
	vertical-align: middle;
	width: 100%;
}

.search-view .search-widget .replace-container {
	margin-top: 6px;
	position: relative;
	display: inline-flex;
}

.search-view .search-widget .replace-input {
	position: relative;
	display: flex;
	vertical-align: middle;
	width: auto !important;
}

.search-view .search-widget .replace-input > .controls {
	position: absolute;
	top: 3px;
	right: 2px;
}

.search-view .search-widget .replace-container.disabled {
	display: none;
}

.search-view .search-widget .replace-container .monaco-action-bar {
	height: 25px;
	margin-left: 4px;
}

.search-view .query-details {
	min-height: 1em;
	position: relative;
	margin: 0 0 0 18px;
}

.search-view .query-details .more {
	position: absolute;
	right: -2px;
	cursor: pointer;
	width: 25px;
	height: 16px;
	color: inherit;
	/* Force it above the search results message, which has a negative top margin */
	z-index: 2;
}

.search-view .query-details .file-types {
	display: none;
}

.search-view .query-details .file-types > .monaco-inputbox {
	width: 100%;
	height: 25px;
}

.search-view .query-details.more .file-types {
	display: inherit;
}

.search-view .query-details.more .file-types:last-child {
	padding-bottom: 4px;
}

.search-view .query-details.more h4 {
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	padding: 4px 0 0;
	margin: 0;
	font-size: 11px;
	font-weight: normal;
}

.search-view .messages {
	margin-top: -5px;
	cursor: default;
	color: var(--vscode-search-resultsInfoForeground);
}

.search-view .message {
	padding: 0 22px 8px;
	overflow-wrap: break-word;
}

.search-view .message.ai-keywords {
	display: -webkit-box;
	-webkit-box-orient: vertical;
	line-clamp: 2;
	-webkit-line-clamp: 2;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: normal;
	margin: 0 22px 8px;
	padding: 0px;
}

.search-view .message p:first-child {
	margin-top: 0px;
	margin-bottom: 0px;
	padding-bottom: 4px;
	user-select: text;
	-webkit-user-select: text;
}

.search-view .message a {
	color: var(--vscode-textLink-foreground);
}

.search-view .message a:hover,
.search-view .message a:active {
	color: var(--vscode-textLink-activeForeground);
}

.search-view .message .keyword-refresh {
	vertical-align: sub;
	margin-right: 4px;
	cursor: pointer;
}

.search-view .message .keyword-refresh:hover,
.search-view .message .keyword-refresh:active {
	color:  var(--vscode-textLink-activeForeground);
}


.search-view .foldermatch,
.search-view .filematch {
	display: flex;
	position: relative;
	line-height: 22px;
	padding: 0;
	height: 100%;
}

.search-view .textsearchresult {
	display: flex;
	position: relative;
	line-height: 22px;
	padding: 0;
	height: 100%;
	font-weight: 500;
}

.search-view .textsearchresult .actionBarContainer {
	flex: 1 0 auto;
	text-align: right;
}

.search-view .textsearchresult .monaco-icon-label .codicon {
	position: relative;
	top: 3px;
	padding-right: 3px;
}

.pane-body:not(.wide) .search-view .foldermatch .monaco-icon-label,
.pane-body:not(.wide) .search-view .filematch .monaco-icon-label {
	flex: 1;
}

.pane-body:not(.wide) .search-view .monaco-list .monaco-list-row:hover:not(.highlighted) .foldermatch .monaco-icon-label,
.pane-body:not(.wide) .search-view .monaco-list .monaco-list-row.focused .foldermatch .monaco-icon-label,
.pane-body:not(.wide) .search-view .monaco-list .monaco-list-row:hover:not(.highlighted) .filematch .monaco-icon-label,
.pane-body:not(.wide) .search-view .monaco-list .monaco-list-row.focused .filematch .monaco-icon-label {
	flex: 1;
}

.pane-body.wide .search-view .foldermatch .badge,
.pane-body.wide .search-view .filematch .badge {
	margin-left: 10px;
}

.search-view .linematch {
	position: relative;
	line-height: 22px;
	display: flex;
	overflow: hidden;
}

.search-view .linematch > .match {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: pre;
}

.search-view .linematch .matchLineNum {
	margin-left: 7px;
	margin-right: 4px;
	opacity: .7;
	font-size: 0.9em;
	display: none;
}

.search-view .linematch .matchLineNum.show {
	display: block;
}

.pane-body.wide .search-view .monaco-list .monaco-list-row .foldermatch .actionBarContainer,
.pane-body.wide .search-view .monaco-list .monaco-list-row .filematch .actionBarContainer,
.search-view .monaco-list .monaco-list-row .linematch .actionBarContainer {
	flex: 1 0 auto;
}

.pane-body:not(.wide) .search-view .monaco-list .monaco-list-row .foldermatch .actionBarContainer,
.pane-body:not(.wide) .search-view .monaco-list .monaco-list-row .filematch .actionBarContainer {
	flex: 0 0 auto;
}

.search-view.actions-right .monaco-list .monaco-list-row .foldermatch .actionBarContainer,
.search-view.actions-right .monaco-list .monaco-list-row .filematch .actionBarContainer,
.search-view.actions-right .monaco-list .monaco-list-row .linematch .actionBarContainer,
.pane-body:not(.wide) .search-view .monaco-list .monaco-list-row .linematch .actionBarContainer {
	text-align: right;
}

.search-view .monaco-list .monaco-list-row .monaco-action-bar {
	line-height: 1em;
	display: none;
	padding: 0 0.8em 0 0.4em;
}

.search-view .monaco-list .monaco-list-row .monaco-action-bar .action-item {
	margin: 0;
}

.search-view .monaco-list .monaco-list-row:hover:not(.highlighted) .monaco-action-bar,
.search-view .monaco-list .monaco-list-row.selected .monaco-action-bar,
.search-view .monaco-list .monaco-list-row.focused .monaco-action-bar {
	display: inline-block;
}

.search-view .monaco-list .monaco-list-row .monaco-action-bar .action-item {
	margin-right: 0.2em;
}

.search-view .monaco-list .monaco-list-row .monaco-action-bar .action-label {
	padding: 2px;
}

/* Adjusts spacing in high contrast mode so that actions are vertically centered */
.monaco-workbench.hc-black .search-view .monaco-list .monaco-list-row .monaco-action-bar .action-label,
.monaco-workbench.hc-light .search-view .monaco-list .monaco-list-row .monaco-action-bar .action-label {
	margin-top: 2px;
}

.search-view .monaco-count-badge {
	margin-right: 12px;
}

.pane-body:not(.wide) .search-view > .results > .monaco-list .monaco-list-row:hover .filematch .monaco-count-badge,
.pane-body:not(.wide) .search-view > .results > .monaco-list .monaco-list-row:hover .foldermatch .monaco-count-badge,
.pane-body:not(.wide) .search-view > .results > .monaco-list .monaco-list-row:hover .linematch .monaco-count-badge,
.pane-body:not(.wide) .search-view > .results > .monaco-list .monaco-list-row.focused .filematch .monaco-count-badge,
.pane-body:not(.wide) .search-view > .results > .monaco-list .monaco-list-row.focused .foldermatch .monaco-count-badge,
.pane-body:not(.wide) .search-view > .results > .monaco-list .monaco-list-row.focused .linematch .monaco-count-badge {
	display: none;
}

.search-view .replace.findInFileMatch {
	text-decoration: line-through;
	background-color: var(--vscode-diffEditor-removedTextBackground);
	border: 1px solid var(--vscode-diffEditor-removedTextBackground);
}

/* High Contrast Theming */
.monaco-workbench.hc-light .search-view .replace.findInFileMatch,
.monaco-workbench.hc-dark .search-view .replace.findInFileMatch {
	border: 1px dashed var(--vscode-diffEditor-removedTextBackground);
}

.search-view .findInFileMatch,
.search-view .replaceMatch {
	white-space: pre;
}

.search-view .findInFileMatch {
	background-color: var(--vscode-editor-findMatchHighlightBackground);
	border: 1px solid var(--vscode-editor-findMatchHighlightBorder);
}

/* High Contrast Theming */
.monaco-workbench.hc-light .search-view .findInFileMatch,
.monaco-workbench.hc-dark .search-view .findInFileMatch {
	border: 1px dashed var(--vscode-editor-findMatchHighlightBorder);
}

.search-view .replaceMatch {
	background-color: var(--vscode-diffEditor-insertedTextBackground);
}

/* High Contrast Theming */
.monaco-workbench.hc-black .search-view .replaceMatch,
.monaco-workbench.hc-black .search-view .findInFileMatch,
.monaco-workbench.hc-light .search-view .replaceMatch,
.monaco-workbench.hc-light .search-view .findInFileMatch {
	background: none !important;
	box-sizing: border-box;
}

.search-view .replaceMatch:not(:empty) {
	border: 1px solid var(--vscode-diffEditor-insertedLineBackground);
}

/* High Contrast Theming */
.monaco-workbench.hc-light .search-view .replaceMatch:not(:empty),
.monaco-workbench.hc-dark .search-view .replaceMatch:not(:empty) {
	border: 1px dashed var(--vscode-diffEditor-insertedLineBackground);
}

/* High Contrast Theming */
.monaco-workbench.hc-black .search-view .foldermatch,
.monaco-workbench.hc-black .search-view .filematch,
.monaco-workbench.hc-black .search-view .linematch,
.monaco-workbench.hc-light .search-view .foldermatch,
.monaco-workbench.hc-light .search-view .filematch,
.monaco-workbench.hc-light .search-view .linematch {
	line-height: 20px;
}

.monaco-workbench.vs .search-panel .search-view .monaco-inputbox {
	border: 1px solid transparent;
}

/* shared with search editor's message element */
.text-search-provider-messages .providerMessage {
	padding-top: 4px;
}

.text-search-provider-messages .providerMessage .codicon {
	position: relative;
	top: 3px;
	padding-right: 3px;
}

.monaco-workbench .search-view .monaco-list.element-focused .monaco-list-row.focused.selected:not(.highlighted) .action-label:focus {
	outline-color: var(--vscode-list-activeSelectionForeground)
}

.monaco-workbench .search-container .monaco-custom-toggle.disabled {
	opacity: 0.3;
	cursor: default;
	user-select: none;
	-webkit-user-select: none;
	pointer-events: none;
	background-color: inherit !important;
}

.monaco-workbench .search-container .find-filter-button {
	color: inherit;
	margin-left: 2px;
	float: left;
	cursor: pointer;
	box-sizing: border-box;
	user-select: none;
	-webkit-user-select: none;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/browser/notebookSearch/notebookSearchContributions.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/browser/notebookSearch/notebookSearchContributions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { InstantiationType, registerSingleton } from '../../../../../platform/instantiation/common/extensions.js';
import { INotebookSearchService } from '../../common/notebookSearch.js';
import { NotebookSearchService } from './notebookSearchService.js';

export function registerContributions(): void {
	registerSingleton(INotebookSearchService, NotebookSearchService, InstantiationType.Delayed);
}
```

--------------------------------------------------------------------------------

````
