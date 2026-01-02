---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 475
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 475 of 552)

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

---[FILE: src/vs/workbench/contrib/testing/browser/testingExplorerView.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/browser/testingExplorerView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { IKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import { IActionViewItemOptions } from '../../../../base/browser/ui/actionbar/actionViewItems.js';
import { ActionBar, IActionViewItem } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { Button } from '../../../../base/browser/ui/button/button.js';
import type { IManagedHover } from '../../../../base/browser/ui/hover/hover.js';
import { getDefaultHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegateFactory.js';
import { renderLabelWithIcons } from '../../../../base/browser/ui/iconLabel/iconLabels.js';
import { IIdentityProvider, IKeyboardNavigationLabelProvider, IListVirtualDelegate } from '../../../../base/browser/ui/list/list.js';
import { DefaultKeyboardNavigationDelegate, IListAccessibilityProvider } from '../../../../base/browser/ui/list/listWidget.js';
import { ITreeContextMenuEvent, ITreeFilter, ITreeNode, ITreeRenderer, ITreeSorter, TreeFilterResult, TreeVisibility } from '../../../../base/browser/ui/tree/tree.js';
import { Action, ActionRunner, IAction, Separator, toAction } from '../../../../base/common/actions.js';
import { mapFindFirst } from '../../../../base/common/arraysFind.js';
import { RunOnceScheduler, disposableTimeout } from '../../../../base/common/async.js';
import { groupBy } from '../../../../base/common/collections.js';
import { Color, RGBA } from '../../../../base/common/color.js';
import { compareFileNames } from '../../../../base/common/comparers.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { FuzzyScore } from '../../../../base/common/filters.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { KeyCode } from '../../../../base/common/keyCodes.js';
import { Disposable, DisposableStore, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { autorun, observableFromEvent } from '../../../../base/common/observable.js';
import { fuzzyContains } from '../../../../base/common/strings.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { isDefined } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { IMarkdownRendererService } from '../../../../platform/markdown/browser/markdownRenderer.js';
import { localize } from '../../../../nls.js';
import { DropdownWithPrimaryActionViewItem } from '../../../../platform/actions/browser/dropdownWithPrimaryActionViewItem.js';
import { MenuEntryActionViewItem, createActionViewItem, getActionBarActions, getFlatContextMenuActions } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { IMenuService, MenuId, MenuItemAction } from '../../../../platform/actions/common/actions.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { UnmanagedProgress } from '../../../../platform/progress/common/progress.js';
import { IStorageService, StorageScope, StorageTarget, WillSaveStateReason } from '../../../../platform/storage/common/storage.js';
import { defaultButtonStyles } from '../../../../platform/theme/browser/defaultStyles.js';
import { foreground } from '../../../../platform/theme/common/colorRegistry.js';
import { spinningLoading } from '../../../../platform/theme/common/iconRegistry.js';
import { IThemeService, registerThemingParticipant } from '../../../../platform/theme/common/themeService.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { registerNavigableContainer } from '../../../browser/actions/widgetNavigationCommands.js';
import { ViewPane } from '../../../browser/parts/views/viewPane.js';
import { IViewletViewOptions } from '../../../browser/parts/views/viewsViewlet.js';
import { DiffEditorInput } from '../../../common/editor/diffEditorInput.js';
import { IViewDescriptorService } from '../../../common/views.js';
import { IActivityService, IconBadge, NumberBadge } from '../../../services/activity/common/activity.js';
import { IEditorGroupsService } from '../../../services/editor/common/editorGroupsService.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { TestingConfigKeys, TestingCountBadge, getTestingConfiguration } from '../common/configuration.js';
import { TestCommandId, TestExplorerViewMode, TestExplorerViewSorting, Testing, labelForTestInState } from '../common/constants.js';
import { StoredValue } from '../common/storedValue.js';
import { ITestExplorerFilterState, TestExplorerFilterState, TestFilterTerm } from '../common/testExplorerFilterState.js';
import { TestId } from '../common/testId.js';
import { ITestProfileService, canUseProfileWithTest } from '../common/testProfileService.js';
import { LiveTestResult, TestResultItemChangeReason } from '../common/testResult.js';
import { ITestResultService } from '../common/testResultService.js';
import { IMainThreadTestCollection, ITestService, testCollectionIsEmpty } from '../common/testService.js';
import { ITestRunProfile, InternalTestItem, TestControllerCapability, TestItemExpandState, TestResultState, TestRunProfileBitset, testProfileBitset, testResultStateToContextValues } from '../common/testTypes.js';
import { TestingContextKeys } from '../common/testingContextKeys.js';
import { ITestingContinuousRunService } from '../common/testingContinuousRunService.js';
import { ITestingPeekOpener } from '../common/testingPeekOpener.js';
import { CountSummary, collectTestStateCounts, getTestProgressText } from '../common/testingProgressMessages.js';
import { cmpPriority, isFailedState, isStateWithResult, statesInOrder } from '../common/testingStates.js';
import { ITestTreeProjection, TestExplorerTreeElement, TestItemTreeElement, TestTreeErrorMessage } from './explorerProjections/index.js';
import { ListProjection } from './explorerProjections/listProjection.js';
import { getTestItemContextOverlay } from './explorerProjections/testItemContextOverlay.js';
import { TestingObjectTree } from './explorerProjections/testingObjectTree.js';
import { ISerializedTestTreeCollapseState } from './explorerProjections/testingViewState.js';
import { TreeProjection } from './explorerProjections/treeProjection.js';
import * as icons from './icons.js';
import './media/testing.css';
import { DebugLastRun, ReRunLastRun } from './testExplorerActions.js';
import { TestingExplorerFilter } from './testingExplorerFilter.js';

const enum LastFocusState {
	Input,
	Tree,
}

export class TestingExplorerView extends ViewPane {
	public viewModel!: TestingExplorerViewModel;
	private readonly filterActionBar = this._register(new MutableDisposable());
	private container!: HTMLElement;
	private treeHeader!: HTMLElement;
	private readonly discoveryProgress = this._register(new MutableDisposable<UnmanagedProgress>());
	private readonly filter = this._register(new MutableDisposable<TestingExplorerFilter>());
	private readonly filterFocusListener = this._register(new MutableDisposable());
	private readonly dimensions = { width: 0, height: 0 };
	private lastFocusState = LastFocusState.Input;

	public get focusedTreeElements() {
		return this.viewModel.tree.getFocus().filter(isDefined);
	}

	constructor(
		options: IViewletViewOptions,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IConfigurationService configurationService: IConfigurationService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IOpenerService openerService: IOpenerService,
		@IThemeService themeService: IThemeService,
		@ITestService private readonly testService: ITestService,
		@IHoverService hoverService: IHoverService,
		@ITestProfileService private readonly testProfileService: ITestProfileService,
		@ICommandService private readonly commandService: ICommandService,
		@IMenuService private readonly menuService: IMenuService,
		@ITestingContinuousRunService private readonly crService: ITestingContinuousRunService,
	) {
		super(options, keybindingService, contextMenuService, configurationService, contextKeyService, viewDescriptorService, instantiationService, openerService, themeService, hoverService);

		const relayout = this._register(new RunOnceScheduler(() => this.layoutBody(), 1));
		this._register(this.onDidChangeViewWelcomeState(() => {
			if (!this.shouldShowWelcome()) {
				relayout.schedule();
			}
		}));

		this._register(Event.any(crService.onDidChange, testProfileService.onDidChange)(() => {
			this.updateActions();
		}));

		this._register(testService.collection.onBusyProvidersChange(busy => {
			this.updateDiscoveryProgress(busy);
		}));

		this._register(testProfileService.onDidChange(() => this.updateActions()));
	}

	public override shouldShowWelcome() {
		return this.viewModel?.welcomeExperience === WelcomeExperience.ForWorkspace;
	}

	public override focus() {
		super.focus();
		if (this.lastFocusState === LastFocusState.Tree) {
			this.viewModel.tree.domFocus();
		} else {
			this.filter.value?.focus();
		}
	}

	/**
	 * Gets include/exclude items in the tree, based either on visible tests
	 * or a use selection. If a profile is given, only tests in that profile
	 * are collected. If a bitset is given, any test that can run in that
	 * bitset is collected.
	 */
	public getTreeIncludeExclude(profileOrBitset: ITestRunProfile | TestRunProfileBitset, withinItems?: InternalTestItem[], filterToType: 'visible' | 'selected' = 'visible') {
		const projection = this.viewModel.projection.value;
		if (!projection) {
			return { include: [], exclude: [] };
		}

		// To calculate includes and excludes, we include the first children that
		// have a majority of their items included too, and then apply exclusions.
		const include = new Set<InternalTestItem>();
		const exclude: InternalTestItem[] = [];

		const runnableWithProfileOrBitset = new Map<InternalTestItem, boolean>();
		const isRunnableWithProfileOrBitset = (item: InternalTestItem) => {
			let value = runnableWithProfileOrBitset.get(item);
			if (value === undefined) {
				value = typeof profileOrBitset === 'number'
					? !!this.testProfileService.getDefaultProfileForTest(profileOrBitset, item)
					: canUseProfileWithTest(profileOrBitset, item);
				runnableWithProfileOrBitset.set(item, value);
			}
			return value;
		};


		const attempt = (element: TestExplorerTreeElement, alreadyIncluded: boolean) => {
			// sanity check hasElement since updates are debounced and they may exist
			// but not be rendered yet
			if (!(element instanceof TestItemTreeElement) || !this.viewModel.tree.hasElement(element)) {
				return;
			}

			// If the current node is not visible or runnable in the current profile, it's excluded
			const inTree = this.viewModel.tree.getNode(element);
			if (!inTree.visible) {
				if (alreadyIncluded) { exclude.push(element.test); }
				return;
			}

			// Only count relevant children when deciding whether to include this node, #229120
			const visibleRunnableChildren = inTree.children.filter(
				c => c.visible
					&& c.element instanceof TestItemTreeElement
					&& isRunnableWithProfileOrBitset(c.element.test),
			).length;

			// If it's not already included but most of its children are, then add it
			// if it can be run under the current profile (when specified)
			if (
				// If it's not already included...
				!alreadyIncluded
				// And it can be run using the current profile (if any)
				&& isRunnableWithProfileOrBitset(element.test)
				// And either it's a leaf node or most children are included, then include it.
				&& (visibleRunnableChildren === 0 || visibleRunnableChildren * 2 >= inTree.children.length)
				// And not if we're only showing a single of its children, since it
				// probably fans out later. (Worse case we'll directly include its single child)
				&& visibleRunnableChildren !== 1
			) {
				include.add(element.test);
				alreadyIncluded = true;
			}

			// Recurse ✨
			for (const child of element.children) {
				attempt(child, alreadyIncluded);
			}
		};

		if (filterToType === 'selected') {
			const sel = this.viewModel.tree.getSelection().filter(isDefined);
			if (sel.length) {

				L:
				for (const node of sel) {
					if (node instanceof TestItemTreeElement) {
						// avoid adding an item if its parent is already included
						for (let i: TestItemTreeElement | null = node; i; i = i.parent) {
							if (include.has(i.test)) {
								continue L;
							}
						}

						include.add(node.test);
						node.children.forEach(c => attempt(c, true));
					}
				}

				return { include: [...include], exclude };
			}
		}

		for (const root of withinItems || this.testService.collection.rootItems) {
			const element = projection.getElementByTestId(root.item.extId);
			if (!element) {
				continue;
			}

			if (typeof profileOrBitset === 'object' && !canUseProfileWithTest(profileOrBitset, root)) {
				continue;
			}

			include.add(element.test);
			element.children.forEach(c => attempt(c, true));
		}

		return { include: [...include], exclude };
	}

	override render(): void {
		super.render();
		this._register(registerNavigableContainer({
			name: 'testingExplorerView',
			focusNotifiers: [this],
			focusNextWidget: () => {
				if (!this.viewModel.tree.isDOMFocused()) {
					this.viewModel.tree.domFocus();
				}
			},
			focusPreviousWidget: () => {
				if (this.viewModel.tree.isDOMFocused()) {
					this.filter.value?.focus();
				}
			}
		}));
	}

	/**
	 * @override
	 */
	protected override renderBody(container: HTMLElement): void {
		super.renderBody(container);

		this.container = dom.append(container, dom.$('.test-explorer'));
		this.treeHeader = dom.append(this.container, dom.$('.test-explorer-header'));
		this.filterActionBar.value = this.createFilterActionBar();

		const messagesContainer = dom.append(this.treeHeader, dom.$('.result-summary-container'));
		this._register(this.instantiationService.createInstance(ResultSummaryView, messagesContainer));

		const listContainer = dom.append(this.container, dom.$('.test-explorer-tree'));
		this.viewModel = this.instantiationService.createInstance(TestingExplorerViewModel, listContainer, this.onDidChangeBodyVisibility);
		this._register(this.viewModel.tree.onDidFocus(() => this.lastFocusState = LastFocusState.Tree));
		this._register(this.viewModel.onChangeWelcomeVisibility(() => this._onDidChangeViewWelcomeState.fire()));
		this._register(this.viewModel);
		this._onDidChangeViewWelcomeState.fire();
	}

	/** @override  */
	public override createActionViewItem(action: IAction, options: IActionViewItemOptions): IActionViewItem | undefined {
		switch (action.id) {
			case TestCommandId.FilterAction:
				this.filter.value = this.instantiationService.createInstance(TestingExplorerFilter, action, options);
				this.filterFocusListener.value = this.filter.value.onDidFocus(() => this.lastFocusState = LastFocusState.Input);
				return this.filter.value;
			case TestCommandId.RunSelectedAction:
				return this.getRunGroupDropdown(TestRunProfileBitset.Run, action, options);
			case TestCommandId.DebugSelectedAction:
				return this.getRunGroupDropdown(TestRunProfileBitset.Debug, action, options);
			case TestCommandId.StartContinousRun:
			case TestCommandId.StopContinousRun:
				return this.getContinuousRunDropdown(action, options);
			default:
				return super.createActionViewItem(action, options);
		}
	}

	/** @inheritdoc */
	private getTestConfigGroupActions(group: TestRunProfileBitset) {
		const profileActions: IAction[] = [];

		let participatingGroups = 0;
		let participatingProfiles = 0;
		let hasConfigurable = false;
		const defaults = this.testProfileService.getGroupDefaultProfiles(group);
		for (const { profiles, controller } of this.testProfileService.all()) {
			let hasAdded = false;

			for (const profile of profiles) {
				if (profile.group !== group) {
					continue;
				}

				if (!hasAdded) {
					hasAdded = true;
					participatingGroups++;
					profileActions.push(toAction({ id: `${controller.id}.$root`, label: controller.label.get(), enabled: false, checked: false, run: () => { } }));
				}

				hasConfigurable = hasConfigurable || profile.hasConfigurationHandler;
				participatingProfiles++;
				profileActions.push(toAction({
					id: `${controller.id}.${profile.profileId}`,
					label: defaults.includes(profile) ? localize('defaultTestProfile', '{0} (Default)', profile.label) : profile.label,
					run: () => {
						const { include, exclude } = this.getTreeIncludeExclude(profile);
						this.testService.runResolvedTests({
							exclude: exclude.map(e => e.item.extId),
							group: profile.group,
							targets: [{
								profileId: profile.profileId,
								controllerId: profile.controllerId,
								testIds: include.map(i => i.item.extId),
							}]
						});
					},
				}));
			}
		}

		const contextKeys: [string, unknown][] = [];
		// allow extension author to define context for when to show the test menu actions for run or debug menus
		if (group === TestRunProfileBitset.Run) {
			contextKeys.push(['testing.profile.context.group', 'run']);
		}
		if (group === TestRunProfileBitset.Debug) {
			contextKeys.push(['testing.profile.context.group', 'debug']);
		}
		if (group === TestRunProfileBitset.Coverage) {
			contextKeys.push(['testing.profile.context.group', 'coverage']);
		}
		const key = this.contextKeyService.createOverlay(contextKeys);
		const menu = this.menuService.getMenuActions(MenuId.TestProfilesContext, key);

		// fill if there are any actions
		const menuActions = getFlatContextMenuActions(menu);

		const postActions: IAction[] = [];
		if (participatingProfiles > 1) {
			postActions.push(toAction({
				id: 'selectDefaultTestConfigurations',
				label: localize('selectDefaultConfigs', 'Select Default Profile'),
				run: () => this.commandService.executeCommand<ITestRunProfile>(TestCommandId.SelectDefaultTestProfiles, group),
			}));
		}

		if (hasConfigurable) {
			postActions.push(toAction({
				id: 'configureTestProfiles',
				label: localize('configureTestProfiles', 'Configure Test Profiles'),
				run: () => this.commandService.executeCommand<ITestRunProfile>(TestCommandId.ConfigureTestProfilesAction, group),
			}));
		}

		// show menu actions if there are any otherwise don't
		return {
			numberOfProfiles: participatingProfiles,
			actions: menuActions.length > 0
				? Separator.join(profileActions, menuActions, postActions)
				: Separator.join(profileActions, postActions),
		};
	}

	/**
	 * @override
	 */
	public override saveState() {
		this.filter.value?.saveState();
		super.saveState();
	}

	private getRunGroupDropdown(group: TestRunProfileBitset, defaultAction: IAction, options: IActionViewItemOptions) {
		const dropdownActions = this.getTestConfigGroupActions(group);
		if (dropdownActions.numberOfProfiles < 2) {
			return super.createActionViewItem(defaultAction, options);
		}

		const primaryAction = this.instantiationService.createInstance(MenuItemAction, {
			id: defaultAction.id,
			title: defaultAction.label,
			icon: group === TestRunProfileBitset.Run
				? icons.testingRunAllIcon
				: icons.testingDebugAllIcon,
		}, undefined, undefined, undefined, undefined);

		return this.instantiationService.createInstance(
			DropdownWithPrimaryActionViewItem,
			primaryAction, this.getDropdownAction(), dropdownActions.actions,
			'',
			options
		);
	}

	private getDropdownAction() {
		return new Action('selectRunConfig', localize('testingSelectConfig', 'Select Configuration...'), 'codicon-chevron-down', true);
	}

	private getContinuousRunDropdown(defaultAction: IAction, options: IActionViewItemOptions) {
		const allProfiles = [...Iterable.flatMap(this.testProfileService.all(), (cr): Iterable<ITestRunProfile> => {
			if (this.testService.collection.getNodeById(cr.controller.id)?.children.size) {
				return Iterable.filter(cr.profiles, p => p.supportsContinuousRun);
			}
			return Iterable.empty();
		})];

		if (allProfiles.length <= 1) {
			return super.createActionViewItem(defaultAction, options);
		}

		const primaryAction = this.instantiationService.createInstance(MenuItemAction, {
			id: defaultAction.id,
			title: defaultAction.label,
			icon: defaultAction.id === TestCommandId.StartContinousRun ? icons.testingTurnContinuousRunOn : icons.testingTurnContinuousRunOff,
		}, undefined, undefined, undefined, undefined);

		const dropdownActions: IAction[] = [];
		const groups = groupBy(allProfiles, p => p.group);
		const crService = this.crService;
		for (const group of [TestRunProfileBitset.Run, TestRunProfileBitset.Debug, TestRunProfileBitset.Coverage] as const) {
			const profiles = groups[group];
			if (!profiles) {
				continue;
			}

			if (Object.keys(groups).length > 1) {
				dropdownActions.push({
					id: `${group}.label`,
					label: testProfileBitset[group],
					enabled: false,
					class: undefined,
					tooltip: testProfileBitset[group],
					run: () => { },
				});
			}

			for (const profile of profiles) {
				dropdownActions.push({
					id: `${group}.${profile.profileId}`,
					label: profile.label,
					enabled: true,
					class: undefined,
					tooltip: profile.label,
					checked: crService.isEnabledForProfile(profile),
					run: () => crService.isEnabledForProfile(profile)
						? crService.stopProfile(profile)
						: crService.start([profile]),
				});
			}
		}

		return this.instantiationService.createInstance(
			DropdownWithPrimaryActionViewItem,
			primaryAction, this.getDropdownAction(), dropdownActions,
			'',
			options
		);
	}

	private createFilterActionBar() {
		const bar = new ActionBar(this.treeHeader, {
			actionViewItemProvider: (action, options) => this.createActionViewItem(action, options),
			triggerKeys: { keyDown: false, keys: [] },
		});
		bar.push(new Action(TestCommandId.FilterAction));
		bar.getContainer().classList.add('testing-filter-action-bar');
		return bar;
	}

	private updateDiscoveryProgress(busy: number) {
		if (!busy && this.discoveryProgress) {
			this.discoveryProgress.clear();
		} else if (busy && !this.discoveryProgress.value) {
			this.discoveryProgress.value = this.instantiationService.createInstance(UnmanagedProgress, { location: this.getProgressLocation() });
		}
	}

	/**
	 * @override
	 */
	protected override layoutBody(height = this.dimensions.height, width = this.dimensions.width): void {
		super.layoutBody(height, width);
		this.dimensions.height = height;
		this.dimensions.width = width;
		this.container.style.height = `${height}px`;
		this.viewModel?.layout(height - this.treeHeader.clientHeight, width);
		this.filter.value?.layout(width);
	}
}

const SUMMARY_RENDER_INTERVAL = 200;

class ResultSummaryView extends Disposable {
	private elementsWereAttached = false;
	private badgeType: TestingCountBadge;
	private lastBadge?: NumberBadge | IconBadge;
	private countHover: IManagedHover;
	private readonly badgeDisposable = this._register(new MutableDisposable());
	private readonly renderLoop = this._register(new RunOnceScheduler(() => this.render(), SUMMARY_RENDER_INTERVAL));
	private readonly elements = dom.h('div.result-summary', [
		dom.h('div@status'),
		dom.h('div@count'),
		dom.h('div@count'),
		dom.h('span'),
		dom.h('duration@duration'),
		dom.h('a@rerun'),
	]);

	constructor(
		private readonly container: HTMLElement,
		@ITestResultService private readonly resultService: ITestResultService,
		@IActivityService private readonly activityService: IActivityService,
		@ITestingContinuousRunService private readonly crService: ITestingContinuousRunService,
		@IConfigurationService configurationService: IConfigurationService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IHoverService hoverService: IHoverService,
	) {
		super();

		this.badgeType = configurationService.getValue<TestingCountBadge>(TestingConfigKeys.CountBadge);
		this._register(resultService.onResultsChanged(this.render, this));
		this._register(configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(TestingConfigKeys.CountBadge)) {
				this.badgeType = configurationService.getValue(TestingConfigKeys.CountBadge);
				this.render();
			}
		}));

		this.countHover = this._register(hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), this.elements.count, ''));

		const ab = this._register(new ActionBar(this.elements.rerun, {
			actionViewItemProvider: (action, options) => createActionViewItem(instantiationService, action, options),
		}));
		ab.push(instantiationService.createInstance(MenuItemAction,
			{ ...new ReRunLastRun().desc, icon: icons.testingRerunIcon },
			{ ...new DebugLastRun().desc, icon: icons.testingDebugIcon },
			{},
			undefined, undefined
		), { icon: true, label: false });

		this.render();
	}

	private render() {
		const { results } = this.resultService;
		const { count, root, status, duration, rerun } = this.elements;
		if (!results.length) {
			if (this.elementsWereAttached) {
				root.remove();
				this.elementsWereAttached = false;
			}
			this.container.innerText = localize('noResults', 'No test results yet.');
			this.badgeDisposable.clear();
			return;
		}

		const live = results.filter(r => !r.completedAt) as LiveTestResult[];
		let counts: CountSummary;
		if (live.length) {
			status.className = ThemeIcon.asClassName(spinningLoading);
			counts = collectTestStateCounts(true, live);
			this.renderLoop.schedule();

			const last = live[live.length - 1];
			duration.textContent = formatDuration(Date.now() - last.startedAt);
			rerun.style.display = 'none';
		} else {
			const last = results[0];
			const dominantState = mapFindFirst(statesInOrder, s => last.counts[s] > 0 ? s : undefined);
			status.className = ThemeIcon.asClassName(icons.testingStatesToIcons.get(dominantState ?? TestResultState.Unset)!);
			counts = collectTestStateCounts(false, [last]);
			duration.textContent = last instanceof LiveTestResult ? formatDuration(last.completedAt! - last.startedAt) : '';
			rerun.style.display = 'block';
		}

		count.textContent = `${counts.passed}/${counts.totalWillBeRun}`;
		this.countHover.update(getTestProgressText(counts));
		this.renderActivityBadge(counts);

		if (!this.elementsWereAttached) {
			dom.clearNode(this.container);
			this.container.appendChild(root);
			this.elementsWereAttached = true;
		}
	}

	private renderActivityBadge(countSummary: CountSummary) {
		if (countSummary && this.badgeType !== TestingCountBadge.Off && countSummary[this.badgeType] !== 0) {
			if (this.lastBadge instanceof NumberBadge && this.lastBadge.number === countSummary[this.badgeType]) {
				return;
			}

			this.lastBadge = new NumberBadge(countSummary[this.badgeType], num => this.getLocalizedBadgeString(this.badgeType, num));
		} else if (this.crService.isEnabled()) {
			if (this.lastBadge instanceof IconBadge && this.lastBadge.icon === icons.testingContinuousIsOn) {
				return;
			}

			this.lastBadge = new IconBadge(icons.testingContinuousIsOn, () => localize('testingContinuousBadge', 'Tests are being watched for changes'));
		} else {
			if (!this.lastBadge) {
				return;
			}

			this.lastBadge = undefined;
		}

		this.badgeDisposable.value = this.lastBadge && this.activityService.showViewActivity(Testing.ExplorerViewId, { badge: this.lastBadge });
	}

	private getLocalizedBadgeString(countBadgeType: TestingCountBadge, count: number): string {
		switch (countBadgeType) {
			case TestingCountBadge.Passed:
				return localize('testingCountBadgePassed', '{0} passed tests', count);
			case TestingCountBadge.Skipped:
				return localize('testingCountBadgeSkipped', '{0} skipped tests', count);
			default:
				return localize('testingCountBadgeFailed', '{0} failed tests', count);
		}
	}
}

const enum WelcomeExperience {
	None,
	ForWorkspace,
	ForDocument,
}

class TestingExplorerViewModel extends Disposable {
	public tree: TestingObjectTree<FuzzyScore>;
	private filter: TestsFilter;
	public readonly projection = this._register(new MutableDisposable<ITestTreeProjection>());

	private readonly revealTimeout = new MutableDisposable();
	private readonly _viewMode: IContextKey<TestExplorerViewMode>;
	private readonly _viewSorting: IContextKey<TestExplorerViewSorting>;
	private readonly welcomeVisibilityEmitter = new Emitter<WelcomeExperience>();
	private readonly actionRunner = this._register(new TestExplorerActionRunner(() => this.tree.getSelection().filter(isDefined)));
	private readonly lastViewState: StoredValue<ISerializedTestTreeCollapseState>;
	private readonly noTestForDocumentWidget: NoTestsForDocumentWidget;

	/**
	 * Whether there's a reveal request which has not yet been delivered. This
	 * can happen if the user asks to reveal before the test tree is loaded.
	 * We check to see if the reveal request is present on each tree update,
	 * and do it then if so.
	 */
	private hasPendingReveal = false;
	/**
	 * Fires when the visibility of the placeholder state changes.
	 */
	public readonly onChangeWelcomeVisibility = this.welcomeVisibilityEmitter.event;

	/**
	 * Gets whether the welcome should be visible.
	 */
	public welcomeExperience = WelcomeExperience.None;

	public get viewMode() {
		return this._viewMode.get() ?? TestExplorerViewMode.Tree;
	}

	public set viewMode(newMode: TestExplorerViewMode) {
		if (newMode === this._viewMode.get()) {
			return;
		}

		this._viewMode.set(newMode);
		this.updatePreferredProjection();
		this.storageService.store('testing.viewMode', newMode, StorageScope.WORKSPACE, StorageTarget.MACHINE);
	}


	public get viewSorting() {
		return this._viewSorting.get() ?? TestExplorerViewSorting.ByStatus;
	}

	public set viewSorting(newSorting: TestExplorerViewSorting) {
		if (newSorting === this._viewSorting.get()) {
			return;
		}

		this._viewSorting.set(newSorting);
		this.tree.resort(null);
		this.storageService.store('testing.viewSorting', newSorting, StorageScope.WORKSPACE, StorageTarget.MACHINE);
	}

	constructor(
		listContainer: HTMLElement,
		onDidChangeVisibility: Event<boolean>,
		@IConfigurationService configurationService: IConfigurationService,
		@IEditorService editorService: IEditorService,
		@IEditorGroupsService editorGroupsService: IEditorGroupsService,
		@IMenuService private readonly menuService: IMenuService,
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
		@ITestService private readonly testService: ITestService,
		@ITestExplorerFilterState private readonly filterState: TestExplorerFilterState,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IStorageService private readonly storageService: IStorageService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@ITestResultService private readonly testResults: ITestResultService,
		@ITestingPeekOpener private readonly peekOpener: ITestingPeekOpener,
		@ITestProfileService private readonly testProfileService: ITestProfileService,
		@ITestingContinuousRunService private readonly crService: ITestingContinuousRunService,
		@ICommandService commandService: ICommandService,
	) {
		super();

		this.hasPendingReveal = !!filterState.reveal.get();
		this.noTestForDocumentWidget = this._register(instantiationService.createInstance(NoTestsForDocumentWidget, listContainer));
		this.lastViewState = this._register(new StoredValue<ISerializedTestTreeCollapseState>({
			key: 'testing.treeState',
			scope: StorageScope.WORKSPACE,
			target: StorageTarget.MACHINE,
		}, this.storageService));
		this._viewMode = TestingContextKeys.viewMode.bindTo(contextKeyService);
		this._viewSorting = TestingContextKeys.viewSorting.bindTo(contextKeyService);
		this._viewMode.set(this.storageService.get('testing.viewMode', StorageScope.WORKSPACE, TestExplorerViewMode.Tree) as TestExplorerViewMode);
		this._viewSorting.set(this.storageService.get('testing.viewSorting', StorageScope.WORKSPACE, TestExplorerViewSorting.ByLocation) as TestExplorerViewSorting);

		this.reevaluateWelcomeState();
		this.filter = this.instantiationService.createInstance(TestsFilter, testService.collection);
		this.tree = instantiationService.createInstance(
			TestingObjectTree,
			'Test Explorer List',
			listContainer,
			new ListDelegate(),
			[
				instantiationService.createInstance(TestItemRenderer, this.actionRunner),
				instantiationService.createInstance(ErrorRenderer),
			],
			{
				identityProvider: instantiationService.createInstance(IdentityProvider),
				hideTwistiesOfChildlessElements: false,
				sorter: instantiationService.createInstance(TreeSorter, this),
				keyboardNavigationLabelProvider: instantiationService.createInstance(TreeKeyboardNavigationLabelProvider),
				accessibilityProvider: instantiationService.createInstance(ListAccessibilityProvider),
				filter: this.filter,
				findWidgetEnabled: false,
			}) as TestingObjectTree<FuzzyScore>;


		// saves the collapse state so that if items are removed or refreshed, they
		// retain the same state (#170169)
		const collapseStateSaver = this._register(new RunOnceScheduler(() => {
			// reuse the last view state to avoid making a bunch of object garbage:
			const state = this.tree.getOptimizedViewState(this.lastViewState.get({}));
			const projection = this.projection.value;
			if (projection) {
				projection.lastState = state;
			}
		}, 3000));

		this._register(this.tree.onDidChangeCollapseState(evt => {
			if (evt.node.element instanceof TestItemTreeElement) {
				if (!evt.node.collapsed) {
					this.projection.value?.expandElement(evt.node.element, evt.deep ? Infinity : 0);
				}
				collapseStateSaver.schedule();
			}
		}));

		this._register(this.crService.onDidChange(testId => {
			if (testId) {
				// a continuous run test will sort to the top:
				const elem = this.projection.value?.getElementByTestId(testId);
				this.tree.resort(elem?.parent && this.tree.hasElement(elem.parent) ? elem.parent : null, false);
			}
		}));

		this._register(onDidChangeVisibility(visible => {
			if (visible) {
				this.ensureProjection();
			}
		}));

		this._register(this.tree.onContextMenu(e => this.onContextMenu(e)));

		this._register(Event.any(
			filterState.text.onDidChange,
			filterState.fuzzy.onDidChange,
			testService.excluded.onTestExclusionsChanged,
		)(() => {
			if (!filterState.text.value) {
				return this.tree.refilter();
			}

			const items = this.filter.lastIncludedTests = new Set();
			this.tree.refilter();
			this.filter.lastIncludedTests = undefined;

			for (const test of items) {
				this.tree.expandTo(test);
			}
		}));

		this._register(this.tree.onDidOpen(e => {
			if (!(e.element instanceof TestItemTreeElement)) {
				return;
			}

			filterState.didSelectTestInExplorer(e.element.test.item.extId);

			if (!e.element.children.size && e.element.test.item.uri) {
				if (!this.tryPeekError(e.element)) {
					commandService.executeCommand('vscode.revealTest', e.element.test.item.extId, {
						openToSide: e.sideBySide,
						preserveFocus: true,
					});
				}
			}
		}));

		this._register(this.tree);

		this._register(this.onChangeWelcomeVisibility(e => {
			this.noTestForDocumentWidget.setVisible(e === WelcomeExperience.ForDocument);
		}));

		this._register(dom.addStandardDisposableListener(this.tree.getHTMLElement(), 'keydown', evt => {
			if (evt.equals(KeyCode.Enter)) {
				this.handleExecuteKeypress(evt);
			} else if (DefaultKeyboardNavigationDelegate.mightProducePrintableCharacter(evt)) {
				filterState.text.value = evt.browserEvent.key;
				filterState.focusInput();
			}
		}));

		this._register(autorun(reader => {
			this.revealById(filterState.reveal.read(reader), undefined, false);
		}));

		this._register(onDidChangeVisibility(visible => {
			if (visible) {
				filterState.focusInput();
			}
		}));

		let followRunningTests = getTestingConfiguration(configurationService, TestingConfigKeys.FollowRunningTest);
		this._register(configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(TestingConfigKeys.FollowRunningTest)) {
				followRunningTests = getTestingConfiguration(configurationService, TestingConfigKeys.FollowRunningTest);
			}
		}));

		let alwaysRevealTestAfterStateChange = getTestingConfiguration(configurationService, TestingConfigKeys.AlwaysRevealTestOnStateChange);
		this._register(configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(TestingConfigKeys.AlwaysRevealTestOnStateChange)) {
				alwaysRevealTestAfterStateChange = getTestingConfiguration(configurationService, TestingConfigKeys.AlwaysRevealTestOnStateChange);
			}
		}));

		this._register(testResults.onTestChanged(evt => {
			if (!followRunningTests) {
				return;
			}

			if (evt.reason !== TestResultItemChangeReason.OwnStateChange) {
				return;
			}

			if (this.tree.selectionSize > 1) {
				return; // don't change a multi-selection #180950
			}

			// follow running tests, or tests whose state changed. Tests that
			// complete very fast may not enter the running state at all.
			if (evt.item.ownComputedState !== TestResultState.Running && !(evt.previousState === TestResultState.Queued && isStateWithResult(evt.item.ownComputedState))) {
				return;
			}

			this.revealById(evt.item.item.extId, alwaysRevealTestAfterStateChange, false);
		}));

		this._register(testResults.onResultsChanged(() => {
			this.tree.resort(null);
		}));

		this._register(this.testProfileService.onDidChange(() => {
			this.tree.rerender();
		}));

		const allOpenEditorInputs = observableFromEvent(this,
			editorService.onDidEditorsChange,
			() => new Set(editorGroupsService.groups.flatMap(g => g.editors).map(e => e.resource).filter(isDefined)),
		);

		const activeResource = observableFromEvent(this, editorService.onDidActiveEditorChange, () => {
			if (editorService.activeEditor instanceof DiffEditorInput) {
				return editorService.activeEditor.primary.resource;
			} else {
				return editorService.activeEditor?.resource;
			}
		});

		const filterText = observableFromEvent(this.filterState.text.onDidChange, () => this.filterState.text);
		this._register(autorun(reader => {
			filterText.read(reader);
			if (this.filterState.isFilteringFor(TestFilterTerm.OpenedFiles)) {
				this.filter.filterToDocumentUri([...allOpenEditorInputs.read(reader)]);
			} else {
				this.filter.filterToDocumentUri([activeResource.read(reader)].filter(isDefined));
			}

			if (this.filterState.isFilteringFor(TestFilterTerm.CurrentDoc) || this.filterState.isFilteringFor(TestFilterTerm.OpenedFiles)) {
				this.tree.refilter();
			}
		}));

		this._register(this.storageService.onWillSaveState(({ reason, }) => {
			if (reason === WillSaveStateReason.SHUTDOWN) {
				this.lastViewState.store(this.tree.getOptimizedViewState());
			}
		}));
	}

	/**
	 * Re-layout the tree.
	 */
	public layout(height?: number, width?: number): void {
		this.tree.layout(height, width);
	}

	/**
	 * Tries to reveal by extension ID. Queues the request if the extension
	 * ID is not currently available.
	 */
	private revealById(id: string | undefined, expand = true, focus = true) {
		if (!id) {
			this.hasPendingReveal = false;
			return;
		}

		const projection = this.ensureProjection();

		// If the item itself is visible in the tree, show it. Otherwise, expand
		// its closest parent.
		let expandToLevel = 0;
		const idPath = [...TestId.fromString(id).idsFromRoot()];
		for (let i = idPath.length - 1; i >= expandToLevel; i--) {
			const element = projection.getElementByTestId(idPath[i].toString());
			// Skip all elements that aren't in the tree.
			if (!element || !this.tree.hasElement(element)) {
				continue;
			}

			// If this 'if' is true, we're at the closest-visible parent to the node
			// we want to expand. Expand that, and then start the loop again because
			// we might already have children for it.
			if (i < idPath.length - 1) {
				if (expand) {
					this.tree.expand(element);
					expandToLevel = i + 1; // avoid an infinite loop if the test does not exist
					i = idPath.length - 1; // restart the loop since new children may now be visible
					continue;
				}
			}

			// Otherwise, we've arrived!

			// If the node or any of its children are excluded, flip on the 'show
			// excluded tests' checkbox automatically. If we didn't expand, then set
			// target focus target to the first collapsed element.

			let focusTarget = element;
			for (let n: TestItemTreeElement | null = element; n instanceof TestItemTreeElement; n = n.parent) {
				if (n.test && this.testService.excluded.contains(n.test)) {
					this.filterState.toggleFilteringFor(TestFilterTerm.Hidden, true);
					break;
				}

				if (!expand && (this.tree.hasElement(n) && this.tree.isCollapsed(n))) {
					focusTarget = n;
				}
			}

			this.filterState.reveal.set(undefined, undefined);
			this.hasPendingReveal = false;
			if (focus) {
				this.tree.domFocus();
			}

			if (this.tree.getRelativeTop(focusTarget) === null) {
				this.tree.reveal(focusTarget, 0.5);
			}

			this.revealTimeout.value = disposableTimeout(() => {
				this.tree.setFocus([focusTarget]);
				this.tree.setSelection([focusTarget]);
			}, 1);

			return;
		}

		// If here, we've expanded all parents we can. Waiting on data to come
		// in to possibly show the revealed test.
		this.hasPendingReveal = true;
	}

	/**
	 * Collapse all items in the tree.
	 */
	public async collapseAll() {
		this.tree.collapseAll();
	}

	/**
	 * Tries to peek the first test error, if the item is in a failed state.
	 */
	private tryPeekError(item: TestItemTreeElement) {
		const lookup = item.test && this.testResults.getStateById(item.test.item.extId);
		return lookup && lookup[1].tasks.some(s => isFailedState(s.state))
			? this.peekOpener.tryPeekFirstError(lookup[0], lookup[1], { preserveFocus: true })
			: false;
	}

	private onContextMenu(evt: ITreeContextMenuEvent<TestExplorerTreeElement | null>) {
		const element = evt.element;
		if (!(element instanceof TestItemTreeElement)) {
			return;
		}

		const { actions } = getActionableElementActions(this.contextKeyService, this.menuService, this.testService, this.crService, this.testProfileService, element);
		this.contextMenuService.showContextMenu({
			getAnchor: () => evt.anchor,
			getActions: () => actions.secondary,
			getActionsContext: () => element,
			actionRunner: this.actionRunner,
		});
	}

	private handleExecuteKeypress(evt: IKeyboardEvent) {
		const focused = this.tree.getFocus();
		const selected = this.tree.getSelection();
		let targeted: (TestExplorerTreeElement | null)[];
		if (focused.length === 1 && selected.includes(focused[0])) {
			evt.browserEvent?.preventDefault();
			targeted = selected;
		} else {
			targeted = focused;
		}

		const toRun = targeted
			.filter((e): e is TestItemTreeElement => e instanceof TestItemTreeElement);

		if (toRun.length) {
			this.testService.runTests({
				group: TestRunProfileBitset.Run,
				tests: toRun.map(t => t.test),
			});
		}
	}

	private reevaluateWelcomeState() {
		const shouldShowWelcome = this.testService.collection.busyProviders === 0 && testCollectionIsEmpty(this.testService.collection);
		const welcomeExperience = shouldShowWelcome
			? (this.filterState.isFilteringFor(TestFilterTerm.CurrentDoc) ? WelcomeExperience.ForDocument : WelcomeExperience.ForWorkspace)
			: WelcomeExperience.None;

		if (welcomeExperience !== this.welcomeExperience) {
			this.welcomeExperience = welcomeExperience;
			this.welcomeVisibilityEmitter.fire(welcomeExperience);
		}
	}

	private ensureProjection() {
		return this.projection.value ?? this.updatePreferredProjection();
	}

	private updatePreferredProjection() {
		this.projection.clear();

		const lastState = this.lastViewState.get({});
		if (this._viewMode.get() === TestExplorerViewMode.List) {
			this.projection.value = this.instantiationService.createInstance(ListProjection, lastState);
		} else {
			this.projection.value = this.instantiationService.createInstance(TreeProjection, lastState);
		}

		const scheduler = this._register(new RunOnceScheduler(() => this.applyProjectionChanges(), 200));
		this.projection.value.onUpdate(() => {
			if (!scheduler.isScheduled()) {
				scheduler.schedule();
			}
		});

		this.applyProjectionChanges();
		return this.projection.value;
	}

	private applyProjectionChanges() {
		this.reevaluateWelcomeState();
		this.projection.value?.applyTo(this.tree);

		this.tree.refilter();

		if (this.hasPendingReveal) {
			this.revealById(this.filterState.reveal.get());
		}
	}

	/**
	 * Gets the selected tests from the tree.
	 */
	public getSelectedTests() {
		return this.tree.getSelection();
	}
}

const enum FilterResult {
	Exclude,
	Inherit,
	Include,
}

const hasNodeInOrParentOfUri = (collection: IMainThreadTestCollection, ident: IUriIdentityService, testUri: URI, fromNode?: string) => {
	const queue: Iterable<string>[] = [fromNode ? [fromNode] : collection.rootIds];
	while (queue.length) {
		for (const id of queue.pop()!) {
			const node = collection.getNodeById(id);
			if (!node) {
				continue;
			}

			if (!node.item.uri || !ident.extUri.isEqualOrParent(testUri, node.item.uri)) {
				continue;
			}

			// Only show nodes that can be expanded (and might have a child with
			// a range) or ones that have a physical location.
			if (node.item.range || node.expand === TestItemExpandState.Expandable) {
				return true;
			}

			queue.push(node.children);
		}
	}

	return false;
};

class TestsFilter implements ITreeFilter<TestExplorerTreeElement> {
	private documentUris: URI[] = [];

	public lastIncludedTests?: Set<TestExplorerTreeElement>;

	constructor(
		private readonly collection: IMainThreadTestCollection,
		@ITestExplorerFilterState private readonly state: ITestExplorerFilterState,
		@ITestService private readonly testService: ITestService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
	) { }

	/**
	 * @inheritdoc
	 */
	public filter(element: TestItemTreeElement): TreeFilterResult<void> {
		if (element instanceof TestTreeErrorMessage) {
			return TreeVisibility.Visible;
		}

		if (
			element.test
			&& !this.state.isFilteringFor(TestFilterTerm.Hidden)
			&& this.testService.excluded.contains(element.test)
		) {
			return TreeVisibility.Hidden;
		}

		switch (Math.min(this.testFilterText(element), this.testLocation(element), this.testState(element), this.testTags(element))) {
			case FilterResult.Exclude:
				return TreeVisibility.Hidden;
			case FilterResult.Include:
				this.lastIncludedTests?.add(element);
				return TreeVisibility.Visible;
			default:
				return TreeVisibility.Recurse;
		}
	}

	public filterToDocumentUri(uris: readonly URI[]) {
		this.documentUris = [...uris];
	}

	private testTags(element: TestItemTreeElement): FilterResult {
		if (!this.state.includeTags.size && !this.state.excludeTags.size) {
			return FilterResult.Include;
		}

		return (this.state.includeTags.size ?
			element.test.item.tags.some(t => this.state.includeTags.has(t)) :
			true) && element.test.item.tags.every(t => !this.state.excludeTags.has(t))
			? FilterResult.Include
			: FilterResult.Inherit;
	}

	private testState(element: TestItemTreeElement): FilterResult {
		if (this.state.isFilteringFor(TestFilterTerm.Failed)) {
			return isFailedState(element.state) ? FilterResult.Include : FilterResult.Inherit;
		}

		if (this.state.isFilteringFor(TestFilterTerm.Executed)) {
			return element.state !== TestResultState.Unset ? FilterResult.Include : FilterResult.Inherit;
		}

		return FilterResult.Include;
	}

	private testLocation(element: TestItemTreeElement): FilterResult {
		if (this.documentUris.length === 0) {
			return FilterResult.Include;
		}

		if ((!this.state.isFilteringFor(TestFilterTerm.CurrentDoc) && !this.state.isFilteringFor(TestFilterTerm.OpenedFiles)) || !(element instanceof TestItemTreeElement)) {
			return FilterResult.Include;
		}

		if (this.documentUris.some(uri => hasNodeInOrParentOfUri(this.collection, this.uriIdentityService, uri, element.test.item.extId))) {
			return FilterResult.Include;
		}

		return FilterResult.Inherit;
	}

	private testFilterText(element: TestItemTreeElement) {
		if (this.state.globList.length === 0) {
			return FilterResult.Include;
		}

		const fuzzy = this.state.fuzzy.value;
		for (let e: TestItemTreeElement | null = element; e; e = e.parent) {
			// start as included if the first glob is a negation
			let included = this.state.globList[0].include === false ? FilterResult.Include : FilterResult.Inherit;
			const data = e.test.item.label.toLowerCase();

			for (const { include, text } of this.state.globList) {
				if (fuzzy ? fuzzyContains(data, text) : data.includes(text)) {
					included = include ? FilterResult.Include : FilterResult.Exclude;
				}
			}

			if (included !== FilterResult.Inherit) {
				return included;
			}
		}

		return FilterResult.Inherit;
	}
}

class TreeSorter implements ITreeSorter<TestExplorerTreeElement> {
	constructor(
		private readonly viewModel: TestingExplorerViewModel,
	) { }

	public compare(a: TestExplorerTreeElement, b: TestExplorerTreeElement): number {
		if (a instanceof TestTreeErrorMessage || b instanceof TestTreeErrorMessage) {
			return (a instanceof TestTreeErrorMessage ? -1 : 0) + (b instanceof TestTreeErrorMessage ? 1 : 0);
		}

		const durationDelta = (b.duration || 0) - (a.duration || 0);
		if (this.viewModel.viewSorting === TestExplorerViewSorting.ByDuration && durationDelta !== 0) {
			return durationDelta;
		}

		const stateDelta = cmpPriority(a.state, b.state);
		if (this.viewModel.viewSorting === TestExplorerViewSorting.ByStatus && stateDelta !== 0) {
			return stateDelta;
		}

		let inSameLocation = false;
		if (a instanceof TestItemTreeElement && b instanceof TestItemTreeElement && a.test.item.uri && b.test.item.uri && a.test.item.uri.toString() === b.test.item.uri.toString() && a.test.item.range && b.test.item.range) {
			inSameLocation = true;

			const delta = a.test.item.range.startLineNumber - b.test.item.range.startLineNumber;
			if (delta !== 0) {
				return delta;
			}
		}

		const sa = a.test.item.sortText;
		const sb = b.test.item.sortText;
		// If tests are in the same location and there's no preferred sortText,
		// keep the extension's insertion order (#163449).
		return inSameLocation && !sa && !sb
			? 0
			: compareFileNames(sa || a.test.item.label, sb || b.test.item.label);
	}
}

class NoTestsForDocumentWidget extends Disposable {
	private readonly el: HTMLElement;
	constructor(
		container: HTMLElement,
		@ITestExplorerFilterState filterState: ITestExplorerFilterState
	) {
		super();
		const el = this.el = dom.append(container, dom.$('.testing-no-test-placeholder'));
		const emptyParagraph = dom.append(el, dom.$('p'));
		emptyParagraph.innerText = localize('testingNoTest', 'No tests were found in this file.');
		const buttonLabel = localize('testingFindExtension', 'Show Workspace Tests');
		const button = this._register(new Button(el, { title: buttonLabel, ...defaultButtonStyles }));
		button.label = buttonLabel;
		this._register(button.onDidClick(() => filterState.toggleFilteringFor(TestFilterTerm.CurrentDoc, false)));
	}

	public setVisible(isVisible: boolean) {
		this.el.classList.toggle('visible', isVisible);
	}
}

class TestExplorerActionRunner extends ActionRunner {
	constructor(private getSelectedTests: () => ReadonlyArray<TestExplorerTreeElement>) {
		super();
	}

	protected override async runAction(action: IAction, context: TestExplorerTreeElement): Promise<void> {
		if (!(action instanceof MenuItemAction)) {
			return super.runAction(action, context);
		}

		const selection = this.getSelectedTests();
		const contextIsSelected = selection.some(s => s === context);
		const actualContext = contextIsSelected ? selection : [context];
		const actionable = actualContext.filter((t): t is TestItemTreeElement => t instanceof TestItemTreeElement);
		await action.run(...actionable);
	}
}

const getLabelForTestTreeElement = (element: TestItemTreeElement) => {
	let label = labelForTestInState(element.description || element.test.item.label, element.state);

	if (element instanceof TestItemTreeElement) {
		if (element.duration !== undefined) {
			label = localize({
				key: 'testing.treeElementLabelDuration',
				comment: ['{0} is the original label in testing.treeElementLabel, {1} is a duration'],
			}, '{0}, in {1}', label, formatDuration(element.duration));
		}

		if (element.retired) {
			label = localize({
				key: 'testing.treeElementLabelOutdated',
				comment: ['{0} is the original label in testing.treeElementLabel'],
			}, '{0}, outdated result', label);
		}
	}

	return label;
};

class ListAccessibilityProvider implements IListAccessibilityProvider<TestExplorerTreeElement> {
	getWidgetAriaLabel(): string {
		return localize('testExplorer', "Test Explorer");
	}

	getAriaLabel(element: TestExplorerTreeElement): string {
		return element instanceof TestTreeErrorMessage
			? element.description
			: getLabelForTestTreeElement(element);
	}
}

class TreeKeyboardNavigationLabelProvider implements IKeyboardNavigationLabelProvider<TestExplorerTreeElement> {
	getKeyboardNavigationLabel(element: TestExplorerTreeElement) {
		return element instanceof TestTreeErrorMessage ? element.message : element.test.item.label;
	}
}

class ListDelegate implements IListVirtualDelegate<TestExplorerTreeElement> {
	getHeight(element: TestExplorerTreeElement) {
		return element instanceof TestTreeErrorMessage ? 17 + 10 : 22;
	}

	getTemplateId(element: TestExplorerTreeElement) {
		if (element instanceof TestTreeErrorMessage) {
			return ErrorRenderer.ID;
		}

		return TestItemRenderer.ID;
	}
}

class IdentityProvider implements IIdentityProvider<TestExplorerTreeElement> {
	public getId(element: TestExplorerTreeElement) {
		return element.treeId;
	}
}

interface IErrorTemplateData {
	label: HTMLElement;
	disposable: DisposableStore;
}

class ErrorRenderer implements ITreeRenderer<TestTreeErrorMessage, FuzzyScore, IErrorTemplateData> {
	static readonly ID = 'error';


	constructor(
		@IHoverService private readonly hoverService: IHoverService,
		@IMarkdownRendererService private readonly markdownRendererService: IMarkdownRendererService,
	) { }

	get templateId(): string {
		return ErrorRenderer.ID;
	}

	renderTemplate(container: HTMLElement): IErrorTemplateData {
		const label = dom.append(container, dom.$('.error'));
		return { label, disposable: new DisposableStore() };
	}

	renderElement({ element }: ITreeNode<TestTreeErrorMessage, FuzzyScore>, _: number, data: IErrorTemplateData): void {
		dom.clearNode(data.label);

		if (typeof element.message === 'string') {
			data.label.innerText = element.message;
		} else {
			const result = this.markdownRendererService.render(element.message, undefined, document.createElement('span'));
			data.label.appendChild(result.element);
		}
		data.disposable.add(this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), data.label, element.description));
	}

	disposeTemplate(data: IErrorTemplateData): void {
		data.disposable.dispose();
	}
}

interface ITestElementTemplateData {
	current?: TestItemTreeElement;
	label: HTMLElement;
	icon: HTMLElement;
	wrapper: HTMLElement;
	actionBar: ActionBar;
	elementDisposable: DisposableStore;
	templateDisposable: DisposableStore;
}

class TestItemRenderer extends Disposable
	implements ITreeRenderer<TestItemTreeElement, FuzzyScore, ITestElementTemplateData> {
	public static readonly ID = 'testItem';

	constructor(
		private readonly actionRunner: TestExplorerActionRunner,
		@IMenuService private readonly menuService: IMenuService,
		@ITestService protected readonly testService: ITestService,
		@ITestProfileService protected readonly profiles: ITestProfileService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@ITestingContinuousRunService private readonly crService: ITestingContinuousRunService,
		@IHoverService private readonly hoverService: IHoverService,
	) {
		super();
	}

	/**
	 * @inheritdoc
	 */
	public readonly templateId = TestItemRenderer.ID;

	/**
	 * @inheritdoc
	 */
	public renderTemplate(wrapper: HTMLElement): ITestElementTemplateData {
		wrapper.classList.add('testing-stdtree-container');

		const icon = dom.append(wrapper, dom.$('.computed-state'));
		const label = dom.append(wrapper, dom.$('.label'));
		const disposable = new DisposableStore();

		dom.append(wrapper, dom.$(ThemeIcon.asCSSSelector(icons.testingHiddenIcon)));
		const actionBar = disposable.add(new ActionBar(wrapper, {
			actionRunner: this.actionRunner,
			actionViewItemProvider: (action, options) =>
				action instanceof MenuItemAction
					? this.instantiationService.createInstance(MenuEntryActionViewItem, action, { hoverDelegate: options.hoverDelegate })
					: undefined
		}));

		disposable.add(this.profiles.onDidChange(() => {
			if (templateData.current) {
				this.fillActionBar(templateData.current, templateData);
			}
		}));

		disposable.add(this.crService.onDidChange(changed => {
			const id = templateData.current?.test.item.extId;
			if (id && (!changed || changed === id || TestId.isChild(id, changed))) {
				this.fillActionBar(templateData.current!, templateData);
			}
		}));

		const templateData: ITestElementTemplateData = { wrapper, label, actionBar, icon, elementDisposable: new DisposableStore(), templateDisposable: disposable };
		return templateData;
	}

	/**
	 * @inheritdoc
	 */
	disposeTemplate(templateData: ITestElementTemplateData): void {
		templateData.templateDisposable.clear();
	}

	/**
	 * @inheritdoc
	 */
	disposeElement(_element: ITreeNode<TestItemTreeElement, FuzzyScore>, _: number, templateData: ITestElementTemplateData): void {
		templateData.elementDisposable.clear();
	}

	private fillActionBar(element: TestItemTreeElement, data: ITestElementTemplateData) {
		const { actions, contextOverlay } = getActionableElementActions(this.contextKeyService, this.menuService, this.testService, this.crService, this.profiles, element);
		const crSelf = !!contextOverlay.getContextKeyValue(TestingContextKeys.isContinuousModeOn.key);
		const crChild = !crSelf && this.crService.isEnabledForAChildOf(element.test.item.extId);
		data.actionBar.domNode.classList.toggle('testing-is-continuous-run', crSelf || crChild);
		data.actionBar.clear();
		data.actionBar.context = element;
		data.actionBar.push(actions.primary, { icon: true, label: false });
	}

	/**
	 * @inheritdoc
	 */
	public renderElement(node: ITreeNode<TestItemTreeElement, FuzzyScore>, _depth: number, data: ITestElementTemplateData): void {
		data.elementDisposable.clear();
		data.current = node.element;

		data.elementDisposable.add(node.element.onChange(() => this._renderElement(node, data)));
		this._renderElement(node, data);
	}

	public _renderElement(node: ITreeNode<TestItemTreeElement, FuzzyScore>, data: ITestElementTemplateData): void {
		this.fillActionBar(node.element, data);

		const testHidden = this.testService.excluded.contains(node.element.test);
		data.wrapper.classList.toggle('test-is-hidden', testHidden);

		const icon = icons.testingStatesToIcons.get(
			node.element.test.expand === TestItemExpandState.BusyExpanding || node.element.test.item.busy
				? TestResultState.Running
				: node.element.state);

		data.icon.className = 'computed-state ' + (icon ? ThemeIcon.asClassName(icon) : '');
		if (node.element.retired) {
			data.icon.className += ' retired';
		}

		data.elementDisposable.add(this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), data.label, getLabelForTestTreeElement(node.element)));
		if (node.element.test.item.label.trim()) {
			dom.reset(data.label, ...renderLabelWithIcons(node.element.test.item.label));
		} else {
			data.label.textContent = String.fromCharCode(0xA0); // &nbsp;
		}

		let description = node.element.description;
		if (node.element.duration !== undefined) {
			description = description
				? `${description}: ${formatDuration(node.element.duration)}`
				: formatDuration(node.element.duration);
		}

		if (description) {
			dom.append(data.label, dom.$('span.test-label-description', {}, description));
		}
	}
}

const formatDuration = (ms: number) => {
	if (ms < 10) {
		return `${ms.toFixed(1)}ms`;
	}

	if (ms < 1_000) {
		return `${ms.toFixed(0)}ms`;
	}

	return `${(ms / 1000).toFixed(1)}s`;
};

const getActionableElementActions = (
	contextKeyService: IContextKeyService,
	menuService: IMenuService,
	testService: ITestService,
	crService: ITestingContinuousRunService,
	profiles: ITestProfileService,
	element: TestItemTreeElement,
) => {
	const test = element instanceof TestItemTreeElement ? element.test : undefined;
	const contextKeys: [string, unknown][] = getTestItemContextOverlay(test, test ? profiles.capabilitiesForTest(test.item) : 0);
	contextKeys.push(['view', Testing.ExplorerViewId]);
	if (test) {
		const ctrl = testService.getTestController(test.controllerId);
		const supportsCr = !!ctrl && profiles.getControllerProfiles(ctrl.id).some(p =>
			p.supportsContinuousRun && canUseProfileWithTest(p, test));
		contextKeys.push([
			TestingContextKeys.canRefreshTests.key,
			ctrl && !!(ctrl.capabilities.get() & TestControllerCapability.Refresh) && TestId.isRoot(test.item.extId),
		], [
			TestingContextKeys.testItemIsHidden.key,
			testService.excluded.contains(test)
		], [
			TestingContextKeys.isContinuousModeOn.key,
			supportsCr && crService.isSpecificallyEnabledFor(test.item.extId)
		], [
			TestingContextKeys.isParentRunningContinuously.key,
			supportsCr && crService.isEnabledForAParentOf(test.item.extId)
		], [
			TestingContextKeys.supportsContinuousRun.key,
			supportsCr,
		], [
			TestingContextKeys.testResultOutdated.key,
			element.retired,
		], [
			TestingContextKeys.testResultState.key,
			testResultStateToContextValues[element.state],
		]);
	}

	const contextOverlay = contextKeyService.createOverlay(contextKeys);
	const menu = menuService.getMenuActions(MenuId.TestItem, contextOverlay, {
		shouldForwardArgs: true,
	});

	const actions = getActionBarActions(menu, 'inline');

	return { actions, contextOverlay };
};

registerThemingParticipant((theme, collector) => {
	if (theme.type === 'dark') {
		const foregroundColor = theme.getColor(foreground);
		if (foregroundColor) {
			const fgWithOpacity = new Color(new RGBA(foregroundColor.rgba.r, foregroundColor.rgba.g, foregroundColor.rgba.b, 0.65));
			collector.addRule(`.test-explorer .test-explorer-messages { color: ${fgWithOpacity}; }`);
		}
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/browser/testingOutputPeek.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/browser/testingOutputPeek.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { alert } from '../../../../base/browser/ui/aria/aria.js';
import { IAction } from '../../../../base/common/actions.js';
import { RunOnceScheduler } from '../../../../base/common/async.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { Color } from '../../../../base/common/color.js';
import { Event } from '../../../../base/common/event.js';
import { stripIcons } from '../../../../base/common/iconLabels.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { Lazy } from '../../../../base/common/lazy.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { derived, disposableObservableValue, observableValue } from '../../../../base/common/observable.js';
import { URI } from '../../../../base/common/uri.js';
import { ICodeEditor, isCodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { EditorAction2 } from '../../../../editor/browser/editorExtensions.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { EmbeddedCodeEditorWidget } from '../../../../editor/browser/widget/codeEditor/embeddedCodeEditorWidget.js';
import { EmbeddedDiffEditorWidget } from '../../../../editor/browser/widget/diffEditor/embeddedDiffEditorWidget.js';
import { EditorOption } from '../../../../editor/common/config/editorOptions.js';
import { Position } from '../../../../editor/common/core/position.js';
import { Range } from '../../../../editor/common/core/range.js';
import { IEditor, IEditorContribution, ScrollType } from '../../../../editor/common/editorCommon.js';
import { EditorContextKeys } from '../../../../editor/common/editorContextKeys.js';
import { ITextModelService } from '../../../../editor/common/services/resolverService.js';
import { IPeekViewService, PeekViewWidget, peekViewTitleForeground, peekViewTitleInfoForeground } from '../../../../editor/contrib/peekView/browser/peekView.js';
import { localize, localize2 } from '../../../../nls.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { fillInActionBarActions } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { Action2, IMenuService, MenuId } from '../../../../platform/actions/common/actions.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr, IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { ITextEditorOptions, TextEditorSelectionRevealType } from '../../../../platform/editor/common/editor.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { ServiceCollection } from '../../../../platform/instantiation/common/serviceCollection.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { bindContextKey } from '../../../../platform/observable/common/platformObservableUtils.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { editorBackground } from '../../../../platform/theme/common/colorRegistry.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IViewPaneOptions, ViewPane } from '../../../browser/parts/views/viewPane.js';
import { IViewDescriptorService } from '../../../common/views.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { AutoOpenPeekViewWhen, TestingConfigKeys, getTestingConfiguration } from '../common/configuration.js';
import { Testing } from '../common/constants.js';
import { MutableObservableValue, staticObservableValue } from '../common/observableValue.js';
import { StoredValue } from '../common/storedValue.js';
import { ITestResult, TestResultItemChange, TestResultItemChangeReason, resultItemParents } from '../common/testResult.js';
import { ITestResultService, ResultChangeEvent } from '../common/testResultService.js';
import { ITestService } from '../common/testService.js';
import { IRichLocation, ITestMessage, TestMessageType, TestResultItem } from '../common/testTypes.js';
import { TestingContextKeys } from '../common/testingContextKeys.js';
import { IShowResultOptions, ITestingPeekOpener } from '../common/testingPeekOpener.js';
import { isFailedState } from '../common/testingStates.js';
import { ParsedTestUri, TestUriType, buildTestUri, parseTestUri } from '../common/testingUri.js';
import { renderTestMessageAsText } from './testMessageColorizer.js';
import { InspectSubject, MessageSubject, TaskSubject, TestOutputSubject, inspectSubjectHasStack, mapFindTestMessage } from './testResultsView/testResultsSubject.js';
import { TestResultsViewContent } from './testResultsView/testResultsViewContent.js';
import { testingMessagePeekBorder, testingPeekBorder, testingPeekHeaderBackground, testingPeekMessageHeaderBackground } from './theme.js';


/** Iterates through every message in every result */
function* allMessages([result]: readonly ITestResult[]) {
	if (!result) {
		return;
	}

	for (const test of result.tests) {
		for (let taskIndex = 0; taskIndex < test.tasks.length; taskIndex++) {
			const messages = test.tasks[taskIndex].messages;
			for (let messageIndex = 0; messageIndex < messages.length; messageIndex++) {

				if (messages[messageIndex].type === TestMessageType.Error) {
					yield { result, test, taskIndex, messageIndex };
				}
			}
		}
	}
}

interface IMessageIteratedReference {
	messageIndex: number;
	taskIndex: number;
	result: ITestResult;
	test: TestResultItem;
}

function messageItReferenceToUri({ result, test, taskIndex, messageIndex }: IMessageIteratedReference) {
	return buildTestUri({
		type: TestUriType.ResultMessage,
		resultId: result.id,
		testExtId: test.item.extId,
		taskIndex,
		messageIndex,
	});
}

type TestUriWithDocument = ParsedTestUri & { documentUri: URI };

export class TestingPeekOpener extends Disposable implements ITestingPeekOpener {
	public static readonly ID = 'workbench.contrib.testing.peekOpener';

	declare _serviceBrand: undefined;

	private lastUri?: TestUriWithDocument;

	/** @inheritdoc */
	public readonly historyVisible: MutableObservableValue<boolean>;

	constructor(
		@IConfigurationService private readonly configuration: IConfigurationService,
		@IEditorService private readonly editorService: IEditorService,
		@ICodeEditorService private readonly codeEditorService: ICodeEditorService,
		@ITestResultService private readonly testResults: ITestResultService,
		@ITestService private readonly testService: ITestService,
		@IStorageService storageService: IStorageService,
		@IViewsService private readonly viewsService: IViewsService,
		@ICommandService private readonly commandService: ICommandService,
		@INotificationService private readonly notificationService: INotificationService,
	) {
		super();
		this._register(testResults.onTestChanged(this.openPeekOnFailure, this));
		this.historyVisible = this._register(MutableObservableValue.stored(new StoredValue<boolean>({
			key: 'testHistoryVisibleInPeek',
			scope: StorageScope.PROFILE,
			target: StorageTarget.USER,
		}, storageService), false));
	}

	/** @inheritdoc */
	public async open() {
		let uri: TestUriWithDocument | undefined;
		const active = this.editorService.activeTextEditorControl;
		if (isCodeEditor(active) && active.getModel()?.uri) {
			const modelUri = active.getModel()?.uri;
			if (modelUri) {
				uri = await this.getFileCandidateMessage(modelUri, active.getPosition());
			}
		}

		if (!uri) {
			uri = this.lastUri;
		}

		if (!uri) {
			uri = this.getAnyCandidateMessage();
		}

		if (!uri) {
			return false;
		}

		return this.showPeekFromUri(uri);
	}

	/** @inheritdoc */
	public tryPeekFirstError(result: ITestResult, test: TestResultItem, options?: Partial<ITextEditorOptions>) {
		const candidate = this.getFailedCandidateMessage(test);
		if (!candidate) {
			return false;
		}

		this.showPeekFromUri({
			type: TestUriType.ResultMessage,
			documentUri: candidate.location.uri,
			taskIndex: candidate.taskId,
			messageIndex: candidate.index,
			resultId: result.id,
			testExtId: test.item.extId,
		}, undefined, { selection: candidate.location.range, selectionRevealType: TextEditorSelectionRevealType.NearTopIfOutsideViewport, ...options });
		return true;
	}

	/** @inheritdoc */
	public peekUri(uri: URI, options: IShowResultOptions = {}) {
		const parsed = parseTestUri(uri);
		const result = parsed && this.testResults.getResult(parsed.resultId);
		if (!parsed || !result || !('testExtId' in parsed)) {
			return false;
		}

		if (!('messageIndex' in parsed)) {
			return false;
		}

		const message = result.getStateById(parsed.testExtId)?.tasks[parsed.taskIndex].messages[parsed.messageIndex];
		if (!message?.location) {
			return false;
		}

		this.showPeekFromUri({
			type: TestUriType.ResultMessage,
			documentUri: message.location.uri,
			taskIndex: parsed.taskIndex,
			messageIndex: parsed.messageIndex,
			resultId: result.id,
			testExtId: parsed.testExtId,
		}, options.inEditor, { selection: message.location.range, ...options.options });
		return true;
	}

	/** @inheritdoc */
	public closeAllPeeks() {
		for (const editor of this.codeEditorService.listCodeEditors()) {
			TestingOutputPeekController.get(editor)?.removePeek();
		}
	}

	public openCurrentInEditor(): void {
		const current = this.getActiveControl();
		if (!current) {
			return;
		}

		const options = { pinned: false, revealIfOpened: true };
		if (current instanceof TaskSubject || current instanceof TestOutputSubject) {
			this.editorService.openEditor({ resource: current.outputUri, options });
			return;
		}

		if (current instanceof TestOutputSubject) {
			this.editorService.openEditor({ resource: current.outputUri, options });
			return;
		}

		const message = current.message;
		if (current.isDiffable) {
			this.editorService.openEditor({
				original: { resource: current.expectedUri },
				modified: { resource: current.actualUri },
				options,
			});
		} else if (typeof message.message === 'string') {
			this.editorService.openEditor({ resource: current.messageUri, options });
		} else {
			this.commandService.executeCommand('markdown.showPreview', current.messageUri).catch(err => {
				this.notificationService.error(localize('testing.markdownPeekError', 'Could not open markdown preview: {0}.\n\nPlease make sure the markdown extension is enabled.', err.message));
			});
		}
	}

	private getActiveControl(): InspectSubject | undefined {
		const editor = getPeekedEditorFromFocus(this.codeEditorService);
		const controller = editor && TestingOutputPeekController.get(editor);
		return controller?.subject.get() ?? this.viewsService.getActiveViewWithId<TestResultsView>(Testing.ResultsViewId)?.subject;
	}

	/** @inheritdoc */
	private async showPeekFromUri(uri: TestUriWithDocument, editor?: IEditor, options?: ITextEditorOptions) {
		if (isCodeEditor(editor)) {
			this.lastUri = uri;
			TestingOutputPeekController.get(editor)?.show(buildTestUri(this.lastUri));
			return true;
		}

		const pane = await this.editorService.openEditor({
			resource: uri.documentUri,
			options: { revealIfOpened: true, ...options }
		});

		const control = pane?.getControl();
		if (!isCodeEditor(control)) {
			return false;
		}

		this.lastUri = uri;
		TestingOutputPeekController.get(control)?.show(buildTestUri(this.lastUri));
		return true;
	}

	/**
	 * Opens the peek view on a test failure, based on user preferences.
	 */
	private openPeekOnFailure(evt: TestResultItemChange) {
		if (evt.reason !== TestResultItemChangeReason.OwnStateChange) {
			return;
		}

		const candidate = this.getFailedCandidateMessage(evt.item);
		if (!candidate) {
			return;
		}

		if (evt.result.request.continuous && !getTestingConfiguration(this.configuration, TestingConfigKeys.AutoOpenPeekViewDuringContinuousRun)) {
			return;
		}

		const editors = this.codeEditorService.listCodeEditors();
		const cfg = getTestingConfiguration(this.configuration, TestingConfigKeys.AutoOpenPeekView);

		// don't show the peek if the user asked to only auto-open peeks for visible tests,
		// and this test is not in any of the editors' models.
		switch (cfg) {
			case AutoOpenPeekViewWhen.FailureVisible: {
				const visibleEditors = this.editorService.visibleTextEditorControls;
				const editorUris = new Set(visibleEditors.filter(isCodeEditor).map(e => e.getModel()?.uri.toString()));
				if (!Iterable.some(resultItemParents(evt.result, evt.item), i => i.item.uri && editorUris.has(i.item.uri.toString()))) {
					return;
				}
				break; //continue
			}
			case AutoOpenPeekViewWhen.FailureAnywhere:
				break; //continue

			default:
				return; // never show
		}

		const controllers = editors.map(TestingOutputPeekController.get);
		if (controllers.some(c => c?.subject.get())) {
			return;
		}

		this.tryPeekFirstError(evt.result, evt.item);
	}

	/**
	 * Gets the message closest to the given position from a test in the file.
	 */
	private async getFileCandidateMessage(uri: URI, position: Position | null) {
		let best: TestUriWithDocument | undefined;
		let bestDistance = Infinity;

		// Get all tests for the document. In those, find one that has a test
		// message closest to the cursor position.
		const demandedUriStr = uri.toString();
		for (const test of this.testService.collection.all) {
			const result = this.testResults.getStateById(test.item.extId);
			if (!result) {
				continue;
			}

			mapFindTestMessage(result[1], (_task, message, messageIndex, taskIndex) => {
				if (message.type !== TestMessageType.Error || !message.location || message.location.uri.toString() !== demandedUriStr) {
					return;
				}

				const distance = position ? Math.abs(position.lineNumber - message.location.range.startLineNumber) : 0;
				if (!best || distance <= bestDistance) {
					bestDistance = distance;
					best = {
						type: TestUriType.ResultMessage,
						testExtId: result[1].item.extId,
						resultId: result[0].id,
						taskIndex,
						messageIndex,
						documentUri: uri,
					};
				}
			});
		}

		return best;
	}

	/**
	 * Gets any possible still-relevant message from the results.
	 */
	private getAnyCandidateMessage() {
		const seen = new Set<string>();
		for (const result of this.testResults.results) {
			for (const test of result.tests) {
				if (seen.has(test.item.extId)) {
					continue;
				}

				seen.add(test.item.extId);
				const found = mapFindTestMessage(test, (task, message, messageIndex, taskIndex) => (
					message.location && {
						type: TestUriType.ResultMessage,
						testExtId: test.item.extId,
						resultId: result.id,
						taskIndex,
						messageIndex,
						documentUri: message.location.uri,
					}
				));

				if (found) {
					return found;
				}
			}
		}

		return undefined;
	}

	/**
	 * Gets the first failed message that can be displayed from the result.
	 */
	private getFailedCandidateMessage(test: TestResultItem) {
		const fallbackLocation = test.item.uri && test.item.range
			? { uri: test.item.uri, range: test.item.range }
			: undefined;

		let best: { taskId: number; index: number; message: ITestMessage; location: IRichLocation } | undefined;
		mapFindTestMessage(test, (task, message, messageIndex, taskId) => {
			const location = message.location || fallbackLocation;
			if (!isFailedState(task.state) || !location) {
				return;
			}

			if (best && message.type !== TestMessageType.Error) {
				return;
			}

			best = { taskId, index: messageIndex, message, location };
		});

		return best;
	}
}

/**
 * Adds output/message peek functionality to code editors.
 */
export class TestingOutputPeekController extends Disposable implements IEditorContribution {
	/**
	 * Gets the controller associated with the given code editor.
	 */
	public static get(editor: ICodeEditor): TestingOutputPeekController | null {
		return editor.getContribution<TestingOutputPeekController>(Testing.OutputPeekContributionId);
	}

	/**
	 * Currently-shown peek view.
	 */
	private readonly peek = this._register(disposableObservableValue<TestResultsPeek | undefined>('TestingOutputPeek', undefined));

	/**
	 * Context key updated when the peek is visible/hidden.
	 */
	private readonly visible: IContextKey<boolean>;

	/**
	 * Gets the currently display subject. Undefined if the peek is not open.
	 */
	public readonly subject = derived(reader => this.peek.read(reader)?.current.read(reader));

	constructor(
		private readonly editor: ICodeEditor,
		@ICodeEditorService private readonly codeEditorService: ICodeEditorService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@ITestResultService private readonly testResults: ITestResultService,
		@IContextKeyService contextKeyService: IContextKeyService,
	) {

		super();
		this.visible = TestingContextKeys.isPeekVisible.bindTo(contextKeyService);
		this._register(editor.onDidChangeModel(() => this.peek.set(undefined, undefined)));
		this._register(testResults.onResultsChanged(this.closePeekOnCertainResultEvents, this));
		this._register(testResults.onTestChanged(this.closePeekOnTestChange, this));
	}

	/**
	 * Shows a peek for the message in the editor.
	 */
	public async show(uri: URI) {
		const subject = this.retrieveTest(uri);
		if (subject) {
			this.showSubject(subject);
		}
	}

	/**
	 * Shows a peek for the existing inspect subject.
	 */
	public async showSubject(subject: InspectSubject) {
		if (!this.peek.get()) {
			const peek = this.instantiationService.createInstance(TestResultsPeek, this.editor);
			this.peek.set(peek, undefined);
			peek.onDidClose(() => {
				this.visible.set(false);
				this.peek.set(undefined, undefined);
			});

			this.visible.set(true);
			peek.create();
		}

		if (subject instanceof MessageSubject) {
			alert(renderTestMessageAsText(subject.message.message));
		}

		this.peek.get()!.setModel(subject);
	}

	public async openAndShow(uri: URI) {
		const subject = this.retrieveTest(uri);
		if (!subject) {
			return;
		}

		if (!subject.revealLocation || subject.revealLocation.uri.toString() === this.editor.getModel()?.uri.toString()) {
			return this.show(uri);
		}

		const otherEditor = await this.codeEditorService.openCodeEditor({
			resource: subject.revealLocation.uri,
			options: { pinned: false, revealIfOpened: true }
		}, this.editor);

		if (otherEditor) {
			TestingOutputPeekController.get(otherEditor)?.removePeek();
			return TestingOutputPeekController.get(otherEditor)?.show(uri);
		}
	}

	/**
	 * Disposes the peek view, if any.
	 */
	public removePeek() {
		this.peek.set(undefined, undefined);
	}

	/**
	 * Collapses all displayed stack frames.
	 */
	public collapseStack() {
		this.peek.get()?.collapseStack();
	}

	/**
	 * Shows the next message in the peek, if possible.
	 */
	public next() {
		const subject = this.peek.get()?.current.get();
		if (!subject) {
			return;
		}

		let first: IMessageIteratedReference | undefined;

		let found = false;
		for (const m of allMessages(this.testResults.results)) {
			first ??= m;
			if (subject instanceof TaskSubject && m.result.id === subject.result.id) {
				found = true; // open the first message found in the current result
			}

			if (found) {
				this.openAndShow(messageItReferenceToUri(m));
				return;
			}

			if (subject instanceof TestOutputSubject && subject.test.item.extId === m.test.item.extId && subject.taskIndex === m.taskIndex && subject.result.id === m.result.id) {
				found = true;
			}

			if (subject instanceof MessageSubject && subject.test.extId === m.test.item.extId && subject.messageIndex === m.messageIndex && subject.taskIndex === m.taskIndex && subject.result.id === m.result.id) {
				found = true;
			}
		}

		if (first) {
			this.openAndShow(messageItReferenceToUri(first));
		}
	}

	/**
	 * Shows the previous message in the peek, if possible.
	 */
	public previous() {
		const subject = this.subject.get();
		if (!subject) {
			return;
		}

		let previous: IMessageIteratedReference | undefined; // pointer to the last message
		let previousLockedIn = false; // whether the last message was verified as previous to the current subject
		let last: IMessageIteratedReference | undefined; // overall last message
		for (const m of allMessages(this.testResults.results)) {
			last = m;

			if (!previousLockedIn) {
				if (subject instanceof TaskSubject) {
					if (m.result.id === subject.result.id) {
						previousLockedIn = true;
					}
					continue;
				}

				if (subject instanceof TestOutputSubject) {
					if (m.test.item.extId === subject.test.item.extId && m.result.id === subject.result.id && m.taskIndex === subject.taskIndex) {
						previousLockedIn = true;
					}
					continue;
				}

				if (subject.test.extId === m.test.item.extId && subject.messageIndex === m.messageIndex && subject.taskIndex === m.taskIndex && subject.result.id === m.result.id) {
					previousLockedIn = true;
					continue;
				}

				previous = m;
			}
		}

		const target = previous || last;
		if (target) {
			this.openAndShow(messageItReferenceToUri(target));
		}
	}

	/**
	 * Removes the peek view if it's being displayed on the given test ID.
	 */
	public removeIfPeekingForTest(testId: string) {
		const c = this.subject.get();
		if (c && c instanceof MessageSubject && c.test.extId === testId) {
			this.peek.set(undefined, undefined);
		}
	}

	/**
	 * If the test we're currently showing has its state change to something
	 * else, then clear the peek.
	 */
	private closePeekOnTestChange(evt: TestResultItemChange) {
		if (evt.reason !== TestResultItemChangeReason.OwnStateChange || evt.previousState === evt.item.ownComputedState) {
			return;
		}

		this.removeIfPeekingForTest(evt.item.item.extId);
	}

	private closePeekOnCertainResultEvents(evt: ResultChangeEvent) {
		if ('started' in evt) {
			this.peek.set(undefined, undefined); // close peek when runs start
		}

		if ('removed' in evt && this.testResults.results.length === 0) {
			this.peek.set(undefined, undefined); // close the peek if results are cleared
		}
	}

	private retrieveTest(uri: URI): InspectSubject | undefined {
		const parts = parseTestUri(uri);
		if (!parts) {
			return undefined;
		}

		const result = this.testResults.results.find(r => r.id === parts.resultId);
		if (!result) {
			return;
		}

		if (parts.type === TestUriType.TaskOutput) {
			return new TaskSubject(result, parts.taskIndex);
		}

		if (parts.type === TestUriType.TestOutput) {
			const test = result.getStateById(parts.testExtId);
			if (!test) { return; }
			return new TestOutputSubject(result, parts.taskIndex, test);
		}

		const { testExtId, taskIndex, messageIndex } = parts;
		const test = result?.getStateById(testExtId);
		if (!test || !test.tasks[parts.taskIndex]) {
			return;
		}

		return new MessageSubject(result, test, taskIndex, messageIndex);
	}
}


class TestResultsPeek extends PeekViewWidget {
	public readonly current = observableValue<InspectSubject | undefined>('testPeekCurrent', undefined);
	private resizeOnNextContentHeightUpdate = false;
	private content!: TestResultsViewContent;
	private scopedContextKeyService!: IContextKeyService;
	private dimension?: dom.Dimension;

	constructor(
		editor: ICodeEditor,
		@IThemeService private readonly themeService: IThemeService,
		@IPeekViewService peekViewService: IPeekViewService,
		@ITestingPeekOpener private readonly testingPeek: ITestingPeekOpener,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IMenuService private readonly menuService: IMenuService,
		@IInstantiationService instantiationService: IInstantiationService,
		@ITextModelService protected readonly modelService: ITextModelService,
		@ICodeEditorService protected readonly codeEditorService: ICodeEditorService,
		@IUriIdentityService protected readonly uriIdentityService: IUriIdentityService,
	) {
		super(editor, { showFrame: true, frameWidth: 1, showArrow: true, isResizeable: true, isAccessible: true, className: 'test-output-peek' }, instantiationService);

		this._disposables.add(themeService.onDidColorThemeChange(this.applyTheme, this));
		peekViewService.addExclusiveWidget(editor, this);
	}

	protected override _getMaximumHeightInLines(): number | undefined {
		const defaultMaxHeight = super._getMaximumHeightInLines();
		const contentHeight = this.content?.contentHeight;
		if (!contentHeight) { // undefined or 0
			return defaultMaxHeight;
		}

		if (this.testingPeek.historyVisible.value) { // don't cap height with the history split
			return defaultMaxHeight;
		}

		const lineHeight = this.editor.getOption(EditorOption.lineHeight);
		// 41 is experimentally determined to be the overhead of the peek view itself
		// to avoid showing scrollbars by default in its content.
		const basePeekOverhead = 41;

		return Math.min(defaultMaxHeight || Infinity, (contentHeight + basePeekOverhead) / lineHeight + 1);
	}

	private applyTheme() {
		const theme = this.themeService.getColorTheme();
		const current = this.current.get();
		const isError = current instanceof MessageSubject && current.message.type === TestMessageType.Error;
		const borderColor = (isError ? theme.getColor(testingPeekBorder) : theme.getColor(testingMessagePeekBorder)) || Color.transparent;
		const headerBg = (isError ? theme.getColor(testingPeekHeaderBackground) : theme.getColor(testingPeekMessageHeaderBackground)) || Color.transparent;
		const editorBg = theme.getColor(editorBackground);
		this.style({
			arrowColor: borderColor,
			frameColor: borderColor,
			headerBackgroundColor: editorBg && headerBg ? headerBg.makeOpaque(editorBg) : headerBg,
			primaryHeadingColor: theme.getColor(peekViewTitleForeground),
			secondaryHeadingColor: theme.getColor(peekViewTitleInfoForeground)
		});
	}

	protected override _fillContainer(container: HTMLElement): void {
		if (!this.scopedContextKeyService) {
			this.scopedContextKeyService = this._disposables.add(this.contextKeyService.createScoped(container));
			TestingContextKeys.isInPeek.bindTo(this.scopedContextKeyService).set(true);
			const instaService = this._disposables.add(this.instantiationService.createChild(new ServiceCollection([IContextKeyService, this.scopedContextKeyService])));
			this.content = this._disposables.add(instaService.createInstance(TestResultsViewContent, this.editor, { historyVisible: this.testingPeek.historyVisible, showRevealLocationOnMessages: false, locationForProgress: Testing.ResultsViewId }));

			this._disposables.add(this.content.onClose(() => {
				TestingOutputPeekController.get(this.editor)?.removePeek();
			}));
		}

		super._fillContainer(container);
	}

	protected override _fillHead(container: HTMLElement): void {
		super._fillHead(container);

		const menuContextKeyService = this._disposables.add(this.contextKeyService.createScoped(container));
		this._disposables.add(bindContextKey(
			TestingContextKeys.peekHasStack,
			menuContextKeyService,
			reader => inspectSubjectHasStack(this.current.read(reader)),
		));

		const menu = this.menuService.createMenu(MenuId.TestPeekTitle, menuContextKeyService);
		const actionBar = this._actionbarWidget!;
		this._disposables.add(menu.onDidChange(() => {
			actions.length = 0;
			fillInActionBarActions(menu.getActions(), actions);
			while (actionBar.getAction(1)) {
				actionBar.pull(0); // remove all but the view's default "close" button
			}
			actionBar.push(actions, { label: false, icon: true, index: 0 });
		}));

		const actions: IAction[] = [];
		fillInActionBarActions(menu.getActions(), actions);
		actionBar.push(actions, { label: false, icon: true, index: 0 });
	}

	protected override _fillBody(containerElement: HTMLElement): void {
		this.content.fillBody(containerElement);

		// Resize on height updates for a short time to allow any heights made
		// by editor contributions to come into effect before.
		const contentHeightSettleTimer = this._disposables.add(new RunOnceScheduler(() => {
			this.resizeOnNextContentHeightUpdate = false;
		}, 500));

		this._disposables.add(this.content.onDidChangeContentHeight(height => {
			if (!this.resizeOnNextContentHeightUpdate || !height) {
				return;
			}

			const displayed = this._getMaximumHeightInLines();
			if (displayed) {
				this._relayout(Math.min(displayed, this.getVisibleEditorLines() / 2), true);
				if (!contentHeightSettleTimer.isScheduled()) {
					contentHeightSettleTimer.schedule();
				}
			}
		}));

		this._disposables.add(this.content.onDidRequestReveal(sub => {
			TestingOutputPeekController.get(this.editor)?.show(sub instanceof MessageSubject
				? sub.messageUri
				: sub.outputUri);
		}));
	}

	/**
	 * Updates the test to be shown.
	 */
	public setModel(subject: InspectSubject): Promise<void> {
		if (subject instanceof TaskSubject || subject instanceof TestOutputSubject) {
			this.current.set(subject, undefined);
			return this.showInPlace(subject);
		}

		const previous = this.current;
		const revealLocation = subject.revealLocation?.range.getStartPosition();
		if (!revealLocation && !previous) {
			return Promise.resolve();
		}

		this.current.set(subject, undefined);
		if (!revealLocation) {
			return this.showInPlace(subject);
		}

		this.resizeOnNextContentHeightUpdate = true;
		this.show(revealLocation, 10); // 10 is just a random number, we resize once content is available
		this.editor.revealRangeNearTopIfOutsideViewport(Range.fromPositions(revealLocation), ScrollType.Smooth);

		return this.showInPlace(subject);
	}

	/**
	 * Collapses all displayed stack frames.
	 */
	public collapseStack() {
		this.content.collapseStack();
	}

	private getVisibleEditorLines() {
		// note that we don't use the view ranges because we don't want to get
		// thrown off by large wrapping lines. Being approximate here is okay.
		return Math.round(this.editor.getDomNode()!.clientHeight / this.editor.getOption(EditorOption.lineHeight));
	}

	/**
	 * Shows a message in-place without showing or changing the peek location.
	 * This is mostly used if peeking a message without a location.
	 */
	public async showInPlace(subject: InspectSubject) {
		if (subject instanceof MessageSubject) {
			const message = subject.message;
			this.setTitle(firstLine(renderTestMessageAsText(message.message)), stripIcons(subject.test.label));
		} else {
			this.setTitle(localize('testOutputTitle', 'Test Output'));
		}
		this.applyTheme();
		await this.content.reveal({ subject, preserveFocus: false });
	}

	/** @override */
	protected override _doLayoutBody(height: number, width: number) {
		super._doLayoutBody(height, width);
		this.content.onLayoutBody(height, width);
	}

	/** @override */
	protected override _onWidth(width: number) {
		super._onWidth(width);
		if (this.dimension) {
			this.dimension = new dom.Dimension(width, this.dimension.height);
		}

		this.content.onWidth(width);
	}
}

export class TestResultsView extends ViewPane {
	private readonly content = new Lazy(() => this._register(this.instantiationService.createInstance(TestResultsViewContent, undefined, {
		historyVisible: staticObservableValue(true),
		showRevealLocationOnMessages: true,
		locationForProgress: Testing.ExplorerViewId,
	})));

	constructor(
		options: IViewPaneOptions,
		@IKeybindingService keybindingService: IKeybindingService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IConfigurationService configurationService: IConfigurationService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IOpenerService openerService: IOpenerService,
		@IThemeService themeService: IThemeService,
		@IHoverService hoverService: IHoverService,
		@ITestResultService private readonly resultService: ITestResultService,
	) {
		super(options, keybindingService, contextMenuService, configurationService, contextKeyService, viewDescriptorService, instantiationService, openerService, themeService, hoverService);
	}

	public get subject() {
		return this.content.rawValue?.current;
	}

	public showLatestRun(preserveFocus = false) {
		const result = this.resultService.results.find(r => r.tasks.length);
		if (!result) {
			return;
		}

		this.content.rawValue?.reveal({ preserveFocus, subject: new TaskSubject(result, 0) });
	}

	protected override renderBody(container: HTMLElement): void {
		super.renderBody(container);
		// Avoid rendering into the body until it's attached the DOM, as it can
		// result in rendering issues in the terminal (#194156)
		if (this.isBodyVisible()) {
			this.renderContent(container);
		} else {
			this._register(Event.once(Event.filter(this.onDidChangeBodyVisibility, Boolean))(() => this.renderContent(container)));
		}
	}

	protected override layoutBody(height: number, width: number): void {
		super.layoutBody(height, width);
		this.content.rawValue?.onLayoutBody(height, width);
	}

	private renderContent(container: HTMLElement) {
		const content = this.content.value;
		content.fillBody(container);
		this._register(content.onDidRequestReveal(subject => content.reveal({ preserveFocus: true, subject })));

		const [lastResult] = this.resultService.results;
		if (lastResult && lastResult.tasks.length) {
			content.reveal({ preserveFocus: true, subject: new TaskSubject(lastResult, 0) });
		}
	}
}

const firstLine = (str: string) => {
	const index = str.indexOf('\n');
	return index === -1 ? str : str.slice(0, index);
};

function getOuterEditorFromDiffEditor(codeEditorService: ICodeEditorService): ICodeEditor | null {
	const diffEditors = codeEditorService.listDiffEditors();

	for (const diffEditor of diffEditors) {
		if (diffEditor.hasTextFocus() && diffEditor instanceof EmbeddedDiffEditorWidget) {
			return diffEditor.getParentEditor();
		}
	}

	return null;
}

export class CloseTestPeek extends EditorAction2 {
	constructor() {
		super({
			id: 'editor.closeTestPeek',
			title: localize2('close', 'Close'),
			icon: Codicon.close,
			precondition: ContextKeyExpr.or(TestingContextKeys.isInPeek, TestingContextKeys.isPeekVisible),
			keybinding: {
				weight: KeybindingWeight.EditorContrib - 101,
				primary: KeyCode.Escape,
				when: ContextKeyExpr.not('config.editor.stablePeek')
			}
		});
	}

	runEditorCommand(accessor: ServicesAccessor, editor: ICodeEditor): void {
		const parent = getPeekedEditorFromFocus(accessor.get(ICodeEditorService));
		TestingOutputPeekController.get(parent ?? editor)?.removePeek();
	}
}


const navWhen = ContextKeyExpr.and(
	EditorContextKeys.focus,
	TestingContextKeys.isPeekVisible,
);

/**
 * Gets the appropriate editor for peeking based on the currently focused editor.
 */
const getPeekedEditorFromFocus = (codeEditorService: ICodeEditorService) => {
	const editor = codeEditorService.getFocusedCodeEditor() || codeEditorService.getActiveCodeEditor();
	return editor && getPeekedEditor(codeEditorService, editor);
};

/**
 * Gets the editor where the peek may be shown, bubbling upwards if the given
 * editor is embedded (i.e. inside a peek already).
 */
const getPeekedEditor = (codeEditorService: ICodeEditorService, editor: ICodeEditor) => {
	if (TestingOutputPeekController.get(editor)?.subject.get()) {
		return editor;
	}

	if (editor instanceof EmbeddedCodeEditorWidget) {
		return editor.getParentEditor();
	}

	const outer = getOuterEditorFromDiffEditor(codeEditorService);
	if (outer) {
		return outer;
	}

	return editor;
};

export class GoToNextMessageAction extends Action2 {
	public static readonly ID = 'testing.goToNextMessage';
	constructor() {
		super({
			id: GoToNextMessageAction.ID,
			f1: true,
			title: localize2('testing.goToNextMessage', 'Go to Next Test Failure'),
			metadata: {
				description: localize2('testing.goToNextMessage.description', 'Shows the next failure message in your file')
			},
			icon: Codicon.arrowDown,
			category: Categories.Test,
			keybinding: {
				primary: KeyMod.Alt | KeyCode.F8,
				weight: KeybindingWeight.EditorContrib + 1,
				when: navWhen,
			},
			menu: [{
				id: MenuId.TestPeekTitle,
				group: 'navigation',
				order: 2,
			}, {
				id: MenuId.CommandPalette,
				when: navWhen
			}],
		});
	}

	public override run(accessor: ServicesAccessor) {
		const editor = getPeekedEditorFromFocus(accessor.get(ICodeEditorService));
		if (editor) {
			TestingOutputPeekController.get(editor)?.next();
		}
	}
}

export class GoToPreviousMessageAction extends Action2 {
	public static readonly ID = 'testing.goToPreviousMessage';
	constructor() {
		super({
			id: GoToPreviousMessageAction.ID,
			f1: true,
			title: localize2('testing.goToPreviousMessage', 'Go to Previous Test Failure'),
			metadata: {
				description: localize2('testing.goToPreviousMessage.description', 'Shows the previous failure message in your file')
			},
			icon: Codicon.arrowUp,
			category: Categories.Test,
			keybinding: {
				primary: KeyMod.Shift | KeyMod.Alt | KeyCode.F8,
				weight: KeybindingWeight.EditorContrib + 1,
				when: navWhen
			},
			menu: [{
				id: MenuId.TestPeekTitle,
				group: 'navigation',
				order: 1,
			}, {
				id: MenuId.CommandPalette,
				when: navWhen
			}],
		});
	}

	public override run(accessor: ServicesAccessor) {
		const editor = getPeekedEditorFromFocus(accessor.get(ICodeEditorService));
		if (editor) {
			TestingOutputPeekController.get(editor)?.previous();
		}
	}
}

export class CollapsePeekStack extends Action2 {
	public static readonly ID = 'testing.collapsePeekStack';
	constructor() {
		super({
			id: CollapsePeekStack.ID,
			title: localize2('testing.collapsePeekStack', 'Collapse Stack Frames'),
			icon: Codicon.collapseAll,
			category: Categories.Test,
			menu: [{
				id: MenuId.TestPeekTitle,
				when: TestingContextKeys.peekHasStack,
				group: 'navigation',
				order: 4,
			}],
		});
	}

	public override run(accessor: ServicesAccessor) {
		const editor = getPeekedEditorFromFocus(accessor.get(ICodeEditorService));
		if (editor) {
			TestingOutputPeekController.get(editor)?.collapseStack();
		}
	}
}

export class OpenMessageInEditorAction extends Action2 {
	public static readonly ID = 'testing.openMessageInEditor';
	constructor() {
		super({
			id: OpenMessageInEditorAction.ID,
			f1: false,
			title: localize2('testing.openMessageInEditor', 'Open in Editor'),
			icon: Codicon.goToFile,
			category: Categories.Test,
			menu: [{ id: MenuId.TestPeekTitle }],
		});
	}

	public override run(accessor: ServicesAccessor) {
		accessor.get(ITestingPeekOpener).openCurrentInEditor();
	}
}

export class ToggleTestingPeekHistory extends Action2 {
	public static readonly ID = 'testing.toggleTestingPeekHistory';
	constructor() {
		super({
			id: ToggleTestingPeekHistory.ID,
			f1: true,
			title: localize2('testing.toggleTestingPeekHistory', 'Toggle Test History in Peek'),
			metadata: {
				description: localize2('testing.toggleTestingPeekHistory.description', 'Shows or hides the history of test runs in the peek view')
			},
			icon: Codicon.history,
			category: Categories.Test,
			menu: [{
				id: MenuId.TestPeekTitle,
				group: 'navigation',
				order: 3,
			}],
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.Alt | KeyCode.KeyH,
				when: TestingContextKeys.isPeekVisible.isEqualTo(true),
			},
		});
	}

	public override run(accessor: ServicesAccessor) {
		const opener = accessor.get(ITestingPeekOpener);
		opener.historyVisible.value = !opener.historyVisible.value;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/browser/testingProgressUiService.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/browser/testingProgressUiService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { autorun } from '../../../../base/common/observable.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { AutoOpenTesting, getTestingConfiguration, TestingConfigKeys } from '../common/configuration.js';
import { Testing } from '../common/constants.js';
import { ITestCoverageService } from '../common/testCoverageService.js';
import { isFailedState } from '../common/testingStates.js';
import { LiveTestResult, TestResultItemChangeReason } from '../common/testResult.js';
import { ITestResultService } from '../common/testResultService.js';
import { ExplorerTestCoverageBars } from './testCoverageBars.js';

/** Workbench contribution that triggers updates in the TestingProgressUi service */
export class TestingProgressTrigger extends Disposable {
	public static readonly ID = 'workbench.contrib.testing.progressTrigger';

	constructor(
		@ITestResultService resultService: ITestResultService,
		@ITestCoverageService testCoverageService: ITestCoverageService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IViewsService private readonly viewsService: IViewsService,
	) {
		super();

		this._register(resultService.onResultsChanged((e) => {
			if ('started' in e) {
				this.attachAutoOpenForNewResults(e.started);
			}
		}));

		const barContributionRegistration = autorun(reader => {
			const hasCoverage = !!testCoverageService.selected.read(reader);
			if (!hasCoverage) {
				return;
			}

			barContributionRegistration.dispose();
			ExplorerTestCoverageBars.register();
		});

		this._register(barContributionRegistration);
	}

	private attachAutoOpenForNewResults(result: LiveTestResult) {
		if (result.request.preserveFocus === true) {
			return;
		}

		const cfg = getTestingConfiguration(this.configurationService, TestingConfigKeys.OpenResults);
		if (cfg === AutoOpenTesting.NeverOpen) {
			return;
		}

		if (cfg === AutoOpenTesting.OpenExplorerOnTestStart) {
			return this.openExplorerView();
		}

		if (cfg === AutoOpenTesting.OpenOnTestStart) {
			return this.openResultsView();
		}

		// open on failure
		const disposable = new DisposableStore();
		disposable.add(result.onComplete(() => disposable.dispose()));
		disposable.add(result.onChange(e => {
			if (e.reason === TestResultItemChangeReason.OwnStateChange && isFailedState(e.item.ownComputedState)) {
				this.openResultsView();
				disposable.dispose();
			}
		}));
	}

	private openExplorerView() {
		this.viewsService.openView(Testing.ExplorerViewId, false);
	}

	private openResultsView() {
		this.viewsService.openView(Testing.ResultsViewId, false);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/browser/testingViewPaneContainer.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/browser/testingViewPaneContainer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { ViewPaneContainer } from '../../../browser/parts/views/viewPaneContainer.js';
import { IViewDescriptorService } from '../../../common/views.js';
import { Testing } from '../common/constants.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { IWorkbenchLayoutService } from '../../../services/layout/browser/layoutService.js';
import { ILogService } from '../../../../platform/log/common/log.js';

export class TestingViewPaneContainer extends ViewPaneContainer {

	constructor(
		@IWorkbenchLayoutService layoutService: IWorkbenchLayoutService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IThemeService themeService: IThemeService,
		@IStorageService storageService: IStorageService,
		@IConfigurationService configurationService: IConfigurationService,
		@IExtensionService extensionService: IExtensionService,
		@IWorkspaceContextService contextService: IWorkspaceContextService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@ILogService logService: ILogService,
	) {
		super(Testing.ViewletId, { mergeViewWithContainerWhenSingleView: true }, instantiationService, configurationService, layoutService, contextMenuService, telemetryService, extensionService, themeService, storageService, contextService, viewDescriptorService, logService);
	}

	override create(parent: HTMLElement): void {
		super.create(parent);
		parent.classList.add('testing-view-pane');
	}

	override getOptimalWidth(): number {
		return 400;
	}

	override getTitle(): string {
		return localize('testing', "Testing");
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/browser/testMessageColorizer.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/browser/testMessageColorizer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { renderAsPlaintext } from '../../../../base/browser/markdownRenderer.js';
import { IMarkdownString } from '../../../../base/common/htmlContent.js';
import { IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { GraphemeIterator, forAnsiStringParts, removeAnsiEscapeCodes } from '../../../../base/common/strings.js';
import './media/testMessageColorizer.css';
import { CodeEditorWidget } from '../../../../editor/browser/widget/codeEditor/codeEditorWidget.js';
import { Position } from '../../../../editor/common/core/position.js';
import { Range } from '../../../../editor/common/core/range.js';

const colorAttrRe = /^\x1b\[([0-9]+)m$/;

const enum Classes {
	Prefix = 'tstm-ansidec-',
	ForegroundPrefix = Classes.Prefix + 'fg',
	BackgroundPrefix = Classes.Prefix + 'bg',
	Bold = Classes.Prefix + '1',
	Faint = Classes.Prefix + '2',
	Italic = Classes.Prefix + '3',
	Underline = Classes.Prefix + '4',
}

export const renderTestMessageAsText = (tm: string | IMarkdownString) =>
	typeof tm === 'string' ? removeAnsiEscapeCodes(tm) : renderAsPlaintext(tm);


/**
 * Applies decorations based on ANSI styles from the test message in the editor.
 * ANSI sequences are stripped from the text displayed in editor, and this
 * re-applies their colorization.
 *
 * This uses decorations rather than language features because the string
 * rendered in the editor lacks the ANSI codes needed to actually apply the
 * colorization.
 *
 * Note: does not support TrueColor.
 */
export const colorizeTestMessageInEditor = (message: string, editor: CodeEditorWidget): IDisposable => {
	const decos: string[] = [];

	editor.changeDecorations(changeAccessor => {
		let start = new Position(1, 1);
		let cls: string[] = [];
		for (const part of forAnsiStringParts(message)) {
			if (part.isCode) {
				const colorAttr = colorAttrRe.exec(part.str)?.[1];
				if (!colorAttr) {
					continue;
				}

				const n = Number(colorAttr);
				if (n === 0) {
					cls.length = 0;
				} else if (n === 22) {
					cls = cls.filter(c => c !== Classes.Bold && c !== Classes.Italic);
				} else if (n === 23) {
					cls = cls.filter(c => c !== Classes.Italic);
				} else if (n === 24) {
					cls = cls.filter(c => c !== Classes.Underline);
				} else if ((n >= 30 && n <= 39) || (n >= 90 && n <= 99)) {
					cls = cls.filter(c => !c.startsWith(Classes.ForegroundPrefix));
					cls.push(Classes.ForegroundPrefix + colorAttr);
				} else if ((n >= 40 && n <= 49) || (n >= 100 && n <= 109)) {
					cls = cls.filter(c => !c.startsWith(Classes.BackgroundPrefix));
					cls.push(Classes.BackgroundPrefix + colorAttr);
				} else {
					cls.push(Classes.Prefix + colorAttr);
				}
			} else {
				let line = start.lineNumber;
				let col = start.column;

				const graphemes = new GraphemeIterator(part.str);
				for (let i = 0; !graphemes.eol(); i += graphemes.nextGraphemeLength()) {
					if (part.str[i] === '\n') {
						line++;
						col = 1;
					} else {
						col++;
					}
				}

				const end = new Position(line, col);
				if (cls.length) {
					decos.push(changeAccessor.addDecoration(Range.fromPositions(start, end), {
						inlineClassName: cls.join(' '),
						description: 'test-message-colorized',
					}));
				}
				start = end;
			}
		}
	});

	return toDisposable(() => editor.removeDecorations(decos));
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/browser/theme.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/browser/theme.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { activityErrorBadgeBackground, activityErrorBadgeForeground, badgeBackground, badgeForeground, chartsGreen, chartsRed, contrastBorder, diffInserted, diffRemoved, editorBackground, editorErrorForeground, editorForeground, editorInfoForeground, opaque, registerColor, transparent } from '../../../../platform/theme/common/colorRegistry.js';
import { registerThemingParticipant } from '../../../../platform/theme/common/themeService.js';
import { TestResultState } from '../common/testTypes.js';

export const testingColorIconFailed = registerColor('testing.iconFailed', {
	dark: '#f14c4c',
	light: '#f14c4c',
	hcDark: '#f14c4c',
	hcLight: '#B5200D'
}, localize('testing.iconFailed', "Color for the 'failed' icon in the test explorer."));

export const testingColorIconErrored = registerColor('testing.iconErrored', {
	dark: '#f14c4c',
	light: '#f14c4c',
	hcDark: '#f14c4c',
	hcLight: '#B5200D'
}, localize('testing.iconErrored', "Color for the 'Errored' icon in the test explorer."));

export const testingColorIconPassed = registerColor('testing.iconPassed', {
	dark: '#73c991',
	light: '#73c991',
	hcDark: '#73c991',
	hcLight: '#007100'
}, localize('testing.iconPassed', "Color for the 'passed' icon in the test explorer."));

export const testingColorRunAction = registerColor('testing.runAction', testingColorIconPassed, localize('testing.runAction', "Color for 'run' icons in the editor."));

export const testingColorIconQueued = registerColor('testing.iconQueued', '#cca700', localize('testing.iconQueued', "Color for the 'Queued' icon in the test explorer."));

export const testingColorIconUnset = registerColor('testing.iconUnset', '#848484', localize('testing.iconUnset', "Color for the 'Unset' icon in the test explorer."));

export const testingColorIconSkipped = registerColor('testing.iconSkipped', '#848484', localize('testing.iconSkipped', "Color for the 'Skipped' icon in the test explorer."));

export const testingPeekBorder = registerColor('testing.peekBorder', {
	dark: editorErrorForeground,
	light: editorErrorForeground,
	hcDark: contrastBorder,
	hcLight: contrastBorder
}, localize('testing.peekBorder', 'Color of the peek view borders and arrow.'));

export const testingMessagePeekBorder = registerColor('testing.messagePeekBorder', {
	dark: editorInfoForeground,
	light: editorInfoForeground,
	hcDark: contrastBorder,
	hcLight: contrastBorder
}, localize('testing.messagePeekBorder', 'Color of the peek view borders and arrow when peeking a logged message.'));

export const testingPeekHeaderBackground = registerColor('testing.peekHeaderBackground', {
	dark: transparent(editorErrorForeground, 0.1),
	light: transparent(editorErrorForeground, 0.1),
	hcDark: null,
	hcLight: null
}, localize('testing.peekBorder', 'Color of the peek view borders and arrow.'));

export const testingPeekMessageHeaderBackground = registerColor('testing.messagePeekHeaderBackground', {
	dark: transparent(editorInfoForeground, 0.1),
	light: transparent(editorInfoForeground, 0.1),
	hcDark: null,
	hcLight: null
}, localize('testing.messagePeekHeaderBackground', 'Color of the peek view borders and arrow when peeking a logged message.'));

export const testingCoveredBackground = registerColor('testing.coveredBackground', {
	dark: diffInserted,
	light: diffInserted,
	hcDark: null,
	hcLight: null
}, localize('testing.coveredBackground', 'Background color of text that was covered.'));

export const testingCoveredBorder = registerColor('testing.coveredBorder', {
	dark: transparent(testingCoveredBackground, 0.75),
	light: transparent(testingCoveredBackground, 0.75),
	hcDark: contrastBorder,
	hcLight: contrastBorder
}, localize('testing.coveredBorder', 'Border color of text that was covered.'));

export const testingCoveredGutterBackground = registerColor('testing.coveredGutterBackground', {
	dark: transparent(diffInserted, 0.6),
	light: transparent(diffInserted, 0.6),
	hcDark: chartsGreen,
	hcLight: chartsGreen
}, localize('testing.coveredGutterBackground', 'Gutter color of regions where code was covered.'));

export const testingUncoveredBranchBackground = registerColor('testing.uncoveredBranchBackground', {
	dark: opaque(transparent(diffRemoved, 2), editorBackground),
	light: opaque(transparent(diffRemoved, 2), editorBackground),
	hcDark: null,
	hcLight: null
}, localize('testing.uncoveredBranchBackground', 'Background of the widget shown for an uncovered branch.'));

export const testingUncoveredBackground = registerColor('testing.uncoveredBackground', {
	dark: diffRemoved,
	light: diffRemoved,
	hcDark: null,
	hcLight: null
}, localize('testing.uncoveredBackground', 'Background color of text that was not covered.'));

export const testingUncoveredBorder = registerColor('testing.uncoveredBorder', {
	dark: transparent(testingUncoveredBackground, 0.75),
	light: transparent(testingUncoveredBackground, 0.75),
	hcDark: contrastBorder,
	hcLight: contrastBorder
}, localize('testing.uncoveredBorder', 'Border color of text that was not covered.'));

export const testingUncoveredGutterBackground = registerColor('testing.uncoveredGutterBackground', {
	dark: transparent(diffRemoved, 1.5),
	light: transparent(diffRemoved, 1.5),
	hcDark: chartsRed,
	hcLight: chartsRed
}, localize('testing.uncoveredGutterBackground', 'Gutter color of regions where code not covered.'));

export const testingCoverCountBadgeBackground = registerColor('testing.coverCountBadgeBackground', badgeBackground, localize('testing.coverCountBadgeBackground', 'Background for the badge indicating execution count'));

export const testingCoverCountBadgeForeground = registerColor('testing.coverCountBadgeForeground', badgeForeground, localize('testing.coverCountBadgeForeground', 'Foreground for the badge indicating execution count'));


const messageBadgeBackground = registerColor(
	'testing.message.error.badgeBackground',
	activityErrorBadgeBackground,
	localize('testing.message.error.badgeBackground', 'Background color of test error messages shown inline in the editor.')
);
registerColor(
	'testing.message.error.badgeBorder',
	messageBadgeBackground,
	localize('testing.message.error.badgeBorder', 'Border color of test error messages shown inline in the editor.')
);
registerColor(
	'testing.message.error.badgeForeground',
	activityErrorBadgeForeground,
	localize('testing.message.error.badgeForeground', 'Text color of test error messages shown inline in the editor.')
);
registerColor(
	'testing.message.error.lineBackground',
	null,
	localize('testing.message.error.marginBackground', 'Margin color beside error messages shown inline in the editor.')
);
registerColor(
	'testing.message.info.decorationForeground',
	transparent(editorForeground, 0.5),
	localize('testing.message.info.decorationForeground', 'Text color of test info messages shown inline in the editor.')
);
registerColor(
	'testing.message.info.lineBackground',
	null,
	localize('testing.message.info.marginBackground', 'Margin color beside info messages shown inline in the editor.')
);

export const testStatesToIconColors: { [K in TestResultState]?: string } = {
	[TestResultState.Errored]: testingColorIconErrored,
	[TestResultState.Failed]: testingColorIconFailed,
	[TestResultState.Passed]: testingColorIconPassed,
	[TestResultState.Queued]: testingColorIconQueued,
	[TestResultState.Unset]: testingColorIconUnset,
	[TestResultState.Skipped]: testingColorIconSkipped,
};

export const testingRetiredColorIconErrored = registerColor('testing.iconErrored.retired', transparent(testingColorIconErrored, 0.7), localize('testing.iconErrored.retired', "Retired color for the 'Errored' icon in the test explorer."));

export const testingRetiredColorIconFailed = registerColor('testing.iconFailed.retired', transparent(testingColorIconFailed, 0.7), localize('testing.iconFailed.retired', "Retired color for the 'failed' icon in the test explorer."));

export const testingRetiredColorIconPassed = registerColor('testing.iconPassed.retired', transparent(testingColorIconPassed, 0.7), localize('testing.iconPassed.retired', "Retired color for the 'passed' icon in the test explorer."));

export const testingRetiredColorIconQueued = registerColor('testing.iconQueued.retired', transparent(testingColorIconQueued, 0.7), localize('testing.iconQueued.retired', "Retired color for the 'Queued' icon in the test explorer."));

export const testingRetiredColorIconUnset = registerColor('testing.iconUnset.retired', transparent(testingColorIconUnset, 0.7), localize('testing.iconUnset.retired', "Retired color for the 'Unset' icon in the test explorer."));

export const testingRetiredColorIconSkipped = registerColor('testing.iconSkipped.retired', transparent(testingColorIconSkipped, 0.7), localize('testing.iconSkipped.retired', "Retired color for the 'Skipped' icon in the test explorer."));

export const testStatesToRetiredIconColors: { [K in TestResultState]?: string } = {
	[TestResultState.Errored]: testingRetiredColorIconErrored,
	[TestResultState.Failed]: testingRetiredColorIconFailed,
	[TestResultState.Passed]: testingRetiredColorIconPassed,
	[TestResultState.Queued]: testingRetiredColorIconQueued,
	[TestResultState.Unset]: testingRetiredColorIconUnset,
	[TestResultState.Skipped]: testingRetiredColorIconSkipped,
};

registerThemingParticipant((theme, collector) => {

	const editorBg = theme.getColor(editorBackground);

	collector.addRule(`
	.coverage-deco-inline.coverage-deco-hit.coverage-deco-hovered {
		background: ${theme.getColor(testingCoveredBackground)?.transparent(1.3)};
		outline-color: ${theme.getColor(testingCoveredBorder)?.transparent(2)};
	}
	.coverage-deco-inline.coverage-deco-miss.coverage-deco-hovered {
		background: ${theme.getColor(testingUncoveredBackground)?.transparent(1.3)};
		outline-color: ${theme.getColor(testingUncoveredBorder)?.transparent(2)};
	}
		`);

	if (editorBg) {
		const missBadgeBackground = theme.getColor(testingUncoveredBackground)?.transparent(2).makeOpaque(editorBg);
		const errorBadgeBackground = theme.getColor(messageBadgeBackground)?.makeOpaque(editorBg);
		collector.addRule(`
			.coverage-deco-branch-miss-indicator::before {
				border-color: ${missBadgeBackground?.transparent(1.3)};
				background-color: ${missBadgeBackground};
			}
			.monaco-workbench .test-error-content-widget .inner{
				background: ${errorBadgeBackground};
			}
			.monaco-workbench .test-error-content-widget .inner .arrow svg {
				fill: ${errorBadgeBackground};
			}
		`);
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/browser/explorerProjections/display.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/browser/explorerProjections/display.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const flatTestItemDelimiter = ' \u203A ';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/browser/explorerProjections/index.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/browser/explorerProjections/index.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IIdentityProvider } from '../../../../../base/browser/ui/list/list.js';
import { ObjectTree } from '../../../../../base/browser/ui/tree/objectTree.js';
import { IObjectTreeElement, ObjectTreeElementCollapseState } from '../../../../../base/browser/ui/tree/tree.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { FuzzyScore } from '../../../../../base/common/filters.js';
import { IMarkdownString } from '../../../../../base/common/htmlContent.js';
import { Iterable } from '../../../../../base/common/iterator.js';
import { IDisposable } from '../../../../../base/common/lifecycle.js';
import { MarshalledId } from '../../../../../base/common/marshallingIds.js';
import { ISerializedTestTreeCollapseState, isCollapsedInSerializedTestTree } from './testingViewState.js';
import { ITestItemContext, InternalTestItem, TestItemExpandState, TestResultState } from '../../common/testTypes.js';

/**
 * Describes a rendering of tests in the explorer view. Different
 * implementations of this are used for trees and lists, and groupings.
 * Originally this was implemented as inline logic within the ViewModel and
 * using a single IncrementalTestChangeCollector, but this became hairy
 * with status projections.
 */
export interface ITestTreeProjection extends IDisposable {
	/**
	 * Event that fires when the projection changes.
	 */
	readonly onUpdate: Event<void>;

	/**
	 * State to use for applying default collapse state of items.
	 */
	lastState: ISerializedTestTreeCollapseState;

	/**
	 * Fired when an element in the tree is expanded.
	 */
	expandElement(element: TestItemTreeElement, depth: number): void;

	/**
	 * Gets an element by its extension-assigned ID.
	 */
	getElementByTestId(testId: string): TestItemTreeElement | undefined;

	/**
	 * Applies pending update to the tree.
	 */
	applyTo(tree: ObjectTree<TestExplorerTreeElement, FuzzyScore>): void;
}

let idCounter = 0;

const getId = () => String(idCounter++);

export abstract class TestItemTreeElement {
	protected readonly changeEmitter = new Emitter<void>();

	/**
	 * Fired whenever the element or test properties change.
	 */
	public readonly onChange = this.changeEmitter.event;

	/**
	 * Tree children of this item.
	 */
	public readonly children = new Set<TestExplorerTreeElement>();

	/**
	 * Unique ID of the element in the tree.
	 */
	public readonly treeId = getId();

	/**
	 * Depth of the element in the tree.
	 */
	public depth: number;

	/**
	 * Whether the node's test result is 'retired' -- from an outdated test run.
	 */
	public retired = false;

	/**
	 * State to show on the item. This is generally the item's computed state
	 * from its children.
	 */
	public state = TestResultState.Unset;

	/**
	 * Time it took this test/item to run.
	 */
	public duration: number | undefined;

	/**
	 * Tree element description.
	 */
	public abstract description: string | null;

	constructor(
		public readonly test: InternalTestItem,
		/**
		 * Parent tree item. May not actually be the test item who owns this one
		 * in a 'flat' projection.
		 */
		public readonly parent: TestItemTreeElement | null = null,
	) {
		this.depth = parent ? parent.depth + 1 : 0;
	}

	public toJSON() {
		if (this.depth === 0) {
			return { controllerId: this.test.controllerId };
		}

		const context: ITestItemContext = {
			$mid: MarshalledId.TestItemContext,
			tests: [InternalTestItem.serialize(this.test)],
		};

		for (let p = this.parent; p && p.depth > 0; p = p.parent) {
			context.tests.unshift(InternalTestItem.serialize(p.test));
		}

		return context;
	}
}

export class TestTreeErrorMessage {
	public readonly treeId = getId();
	public readonly children = new Set<never>();

	public get description() {
		return typeof this.message === 'string' ? this.message : this.message.value;
	}

	constructor(
		public readonly message: string | IMarkdownString,
		public readonly parent: TestExplorerTreeElement,
	) { }
}

export type TestExplorerTreeElement = TestItemTreeElement | TestTreeErrorMessage;

export const testIdentityProvider: IIdentityProvider<TestExplorerTreeElement> = {
	getId(element) {
		// For "not expandable" elements, whether they have children is part of the
		// ID so they're rerendered if that changes (#204805)
		const expandComponent = element instanceof TestTreeErrorMessage
			? 'error'
			: element.test.expand === TestItemExpandState.NotExpandable
				? !!element.children.size
				: element.test.expand;

		return element.treeId + '\0' + expandComponent;
	}
};

export const getChildrenForParent = (serialized: ISerializedTestTreeCollapseState, rootsWithChildren: Iterable<TestExplorerTreeElement>, node: TestExplorerTreeElement | null): Iterable<IObjectTreeElement<TestExplorerTreeElement>> => {
	let it: Iterable<TestExplorerTreeElement>;
	if (node === null) { // roots
		const rootsWithChildrenArr = [...rootsWithChildren];
		if (rootsWithChildrenArr.length === 1) {
			return getChildrenForParent(serialized, rootsWithChildrenArr, rootsWithChildrenArr[0]);
		}
		it = rootsWithChildrenArr;
	} else {
		it = node.children;
	}

	return Iterable.map(it, element => (
		element instanceof TestTreeErrorMessage
			? { element }
			: {
				element,
				collapsible: element.test.expand !== TestItemExpandState.NotExpandable,
				collapsed: element.test.item.error
					? ObjectTreeElementCollapseState.PreserveOrExpanded
					: (isCollapsedInSerializedTestTree(serialized, element.test.item.extId) ?? element.depth > 0
						? ObjectTreeElementCollapseState.PreserveOrCollapsed
						: ObjectTreeElementCollapseState.PreserveOrExpanded),
				children: getChildrenForParent(serialized, rootsWithChildren, element),
			}
	));
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/browser/explorerProjections/listProjection.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/browser/explorerProjections/listProjection.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ObjectTree } from '../../../../../base/browser/ui/tree/objectTree.js';
import { Emitter } from '../../../../../base/common/event.js';
import { FuzzyScore } from '../../../../../base/common/filters.js';
import { Iterable } from '../../../../../base/common/iterator.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { flatTestItemDelimiter } from './display.js';
import { ITestTreeProjection, TestExplorerTreeElement, TestItemTreeElement, TestTreeErrorMessage, getChildrenForParent, testIdentityProvider } from './index.js';
import { ISerializedTestTreeCollapseState, isCollapsedInSerializedTestTree } from './testingViewState.js';
import { TestId } from '../../common/testId.js';
import { TestResultItemChangeReason } from '../../common/testResult.js';
import { ITestResultService } from '../../common/testResultService.js';
import { ITestService } from '../../common/testService.js';
import { ITestItemUpdate, InternalTestItem, TestDiffOpType, TestItemExpandState, TestResultState, TestsDiff, applyTestItemUpdate } from '../../common/testTypes.js';

/**
 * Test tree element element that groups be hierarchy.
 */
class ListTestItemElement extends TestItemTreeElement {
	private errorChild?: TestTreeErrorMessage;

	public descriptionParts: string[] = [];

	public override get description() {
		return this.chain.map(c => c.item.label).join(flatTestItemDelimiter);
	}

	constructor(
		test: InternalTestItem,
		parent: null | ListTestItemElement,
		private readonly chain: InternalTestItem[],
	) {
		super({ ...test, item: { ...test.item } }, parent);
		this.updateErrorVisibility();
	}

	public update(patch: ITestItemUpdate) {
		applyTestItemUpdate(this.test, patch);
		this.updateErrorVisibility(patch);
		this.fireChange();
	}

	public fireChange() {
		this.changeEmitter.fire();
	}

	private updateErrorVisibility(patch?: ITestItemUpdate) {
		if (this.errorChild && (!this.test.item.error || patch?.item?.error)) {
			this.children.delete(this.errorChild);
			this.errorChild = undefined;
		}
		if (this.test.item.error && !this.errorChild) {
			this.errorChild = new TestTreeErrorMessage(this.test.item.error, this);
			this.children.add(this.errorChild);
		}
	}
}


/**
 * Projection that lists tests in their traditional tree view.
 */
export class ListProjection extends Disposable implements ITestTreeProjection {
	private readonly updateEmitter = new Emitter<void>();
	private readonly items = new Map<string, ListTestItemElement>();

	/**
	 * Gets root elements of the tree.
	 */
	private get rootsWithChildren(): Iterable<ListTestItemElement> {
		const rootsIt = Iterable.map(this.testService.collection.rootItems, r => this.items.get(r.item.extId));
		return Iterable.filter(rootsIt, (r): r is ListTestItemElement => !!r?.children.size);
	}

	/**
	 * @inheritdoc
	 */
	public readonly onUpdate = this.updateEmitter.event;

	constructor(
		public lastState: ISerializedTestTreeCollapseState,
		@ITestService private readonly testService: ITestService,
		@ITestResultService private readonly results: ITestResultService,
	) {
		super();
		this._register(testService.onDidProcessDiff((diff) => this.applyDiff(diff)));

		// when test results are cleared, recalculate all state
		this._register(results.onResultsChanged((evt) => {
			if (!('removed' in evt)) {
				return;
			}

			for (const inTree of this.items.values()) {
				// Simple logic here, because we know in this projection states
				// are never inherited.
				const lookup = this.results.getStateById(inTree.test.item.extId)?.[1];
				inTree.duration = lookup?.ownDuration;
				inTree.state = lookup?.ownComputedState || TestResultState.Unset;
				inTree.fireChange();
			}
		}));

		// when test states change, reflect in the tree
		this._register(results.onTestChanged(ev => {
			if (ev.reason === TestResultItemChangeReason.NewMessage) {
				return; // no effect in the tree
			}

			let result = ev.item;
			// if the state is unset, or the latest run is not making the change,
			// double check that it's valid. Retire calls might cause previous
			// emit a state change for a test run that's already long completed.
			if (result.ownComputedState === TestResultState.Unset || ev.result !== results.results[0]) {
				const fallback = results.getStateById(result.item.extId);
				if (fallback) {
					result = fallback[1];
				}
			}

			const item = this.items.get(result.item.extId);
			if (!item) {
				return;
			}

			item.retired = !!result.retired;
			item.state = result.computedState;
			item.duration = result.ownDuration;
			item.fireChange();
		}));

		for (const test of testService.collection.all) {
			this.storeItem(test);
		}
	}

	/**
	 * @inheritdoc
	 */
	public getElementByTestId(testId: string): TestItemTreeElement | undefined {
		return this.items.get(testId);
	}

	/**
	 * @inheritdoc
	 */
	private applyDiff(diff: TestsDiff) {
		for (const op of diff) {
			switch (op.op) {
				case TestDiffOpType.Add: {
					this.storeItem(op.item);
					break;
				}

				case TestDiffOpType.Update: {
					this.items.get(op.item.extId)?.update(op.item);
					break;
				}

				case TestDiffOpType.Remove: {
					for (const [id, item] of this.items) {
						if (id === op.itemId || TestId.isChild(op.itemId, id)) {
							this.unstoreItem(item);
						}
					}
					break;
				}
			}
		}

		if (diff.length !== 0) {
			this.updateEmitter.fire();
		}
	}

	/**
	 * @inheritdoc
	 */
	public applyTo(tree: ObjectTree<TestExplorerTreeElement, FuzzyScore>) {
		// We don't bother doing a very specific update like we do in the TreeProjection.
		// It's a flat list, so chances are we need to render everything anyway.
		// Let the diffIdentityProvider handle that.
		tree.setChildren(null, getChildrenForParent(this.lastState, this.rootsWithChildren, null), {
			diffIdentityProvider: testIdentityProvider,
			diffDepth: Infinity
		});
	}

	/**
	 * @inheritdoc
	 */
	public expandElement(element: TestItemTreeElement, depth: number): void {
		if (!(element instanceof ListTestItemElement)) {
			return;
		}

		if (element.test.expand === TestItemExpandState.NotExpandable) {
			return;
		}

		this.testService.collection.expand(element.test.item.extId, depth);
	}

	private unstoreItem(treeElement: ListTestItemElement) {
		this.items.delete(treeElement.test.item.extId);
		treeElement.parent?.children.delete(treeElement);

		const parentId = TestId.fromString(treeElement.test.item.extId).parentId;
		if (!parentId) {
			return;
		}

		// create the parent if it's now its own leaf
		for (const id of parentId.idsToRoot()) {
			const parentTest = this.testService.collection.getNodeById(id.toString());
			if (parentTest) {
				if (parentTest.children.size === 0 && !this.items.has(id.toString())) {
					this._storeItem(parentId, parentTest);
				}
				break;
			}
		}
	}

	private _storeItem(testId: TestId, item: InternalTestItem) {
		const displayedParent = testId.isRoot ? null : this.items.get(item.controllerId)!;
		const chain = [...testId.idsFromRoot()].slice(1, -1).map(id => this.testService.collection.getNodeById(id.toString())!);
		const treeElement = new ListTestItemElement(item, displayedParent, chain);
		displayedParent?.children.add(treeElement);
		this.items.set(treeElement.test.item.extId, treeElement);

		if (treeElement.depth === 0 || isCollapsedInSerializedTestTree(this.lastState, treeElement.test.item.extId) === false) {
			this.expandElement(treeElement, Infinity);
		}

		const prevState = this.results.getStateById(treeElement.test.item.extId)?.[1];
		if (prevState) {
			treeElement.retired = !!prevState.retired;
			treeElement.state = prevState.computedState;
			treeElement.duration = prevState.ownDuration;
		}
	}

	private storeItem(item: InternalTestItem) {
		const testId = TestId.fromString(item.item.extId);

		// Remove any non-root parent of this item which is no longer a leaf.
		for (const parentId of testId.idsToRoot()) {
			if (!parentId.isRoot) {
				const prevParent = this.items.get(parentId.toString());
				if (prevParent) {
					this.unstoreItem(prevParent);
					break;
				}
			}
		}

		this._storeItem(testId, item);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/browser/explorerProjections/testingObjectTree.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/browser/explorerProjections/testingObjectTree.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ITreeNode } from '../../../../../base/browser/ui/tree/tree.js';
import { WorkbenchObjectTree } from '../../../../../platform/list/browser/listService.js';
import { TestExplorerTreeElement, TestItemTreeElement } from './index.js';
import { ISerializedTestTreeCollapseState } from './testingViewState.js';
import { TestId } from '../../common/testId.js';


export class TestingObjectTree<TFilterData = void> extends WorkbenchObjectTree<TestExplorerTreeElement, TFilterData> {

	/**
	 * Gets a serialized view state for the tree, optimized for storage.
	 *
	 * @param updatePreviousState Optional previous state to mutate and update
	 * instead of creating a new one.
	 */
	public getOptimizedViewState(updatePreviousState?: ISerializedTestTreeCollapseState): ISerializedTestTreeCollapseState {
		const root: ISerializedTestTreeCollapseState = updatePreviousState || {};

		/**
		 * Recursive builder function. Returns whether the subtree has any non-default
		 * value. Adds itself to the parent children if it does.
		 */
		const build = (node: ITreeNode<TestExplorerTreeElement | null, unknown>, parent: ISerializedTestTreeCollapseState): boolean => {
			if (!(node.element instanceof TestItemTreeElement)) {
				return false;
			}

			const localId = TestId.localId(node.element.test.item.extId);
			const inTree = parent.children?.[localId] || {};
			// only saved collapsed state if it's not the default (not collapsed, or a root depth)
			inTree.collapsed = node.depth === 0 || !node.collapsed ? node.collapsed : undefined;

			let hasAnyNonDefaultValue = inTree.collapsed !== undefined;
			if (node.children.length) {
				for (const child of node.children) {
					hasAnyNonDefaultValue = build(child, inTree) || hasAnyNonDefaultValue;
				}
			}

			if (hasAnyNonDefaultValue) {
				parent.children ??= {};
				parent.children[localId] = inTree;
			} else if (parent.children?.hasOwnProperty(localId)) {
				delete parent.children[localId];
			}

			return hasAnyNonDefaultValue;
		};

		root.children ??= {};

		// Controller IDs are hidden if there's only a single test controller, but
		// make sure they're added when the tree is built if this is the case, so
		// that the later ID lookup works.
		for (const node of this.getNode().children) {
			if (node.element instanceof TestItemTreeElement) {
				if (node.element.test.controllerId === node.element.test.item.extId) {
					build(node, root);
				} else {
					const ctrlNode = root.children[node.element.test.controllerId] ??= { children: {} };
					build(node, ctrlNode);
				}
			}
		}

		return root;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/browser/explorerProjections/testingViewState.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/browser/explorerProjections/testingViewState.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TestId } from '../../common/testId.js';

export interface ISerializedTestTreeCollapseState {
	collapsed?: boolean;
	children?: { [localId: string]: ISerializedTestTreeCollapseState };
}

/**
 * Gets whether the given test ID is collapsed.
 */
export function isCollapsedInSerializedTestTree(serialized: ISerializedTestTreeCollapseState, id: TestId | string): boolean | undefined {
	if (!(id instanceof TestId)) {
		id = TestId.fromString(id);
	}

	let node = serialized;
	for (const part of id.path) {
		if (!node.children?.hasOwnProperty(part)) {
			return undefined;
		}

		node = node.children[part];
	}

	return node.collapsed;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/browser/explorerProjections/testItemContextOverlay.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/browser/explorerProjections/testItemContextOverlay.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { InternalTestItem } from '../../common/testTypes.js';
import { capabilityContextKeys } from '../../common/testProfileService.js';
import { TestId } from '../../common/testId.js';
import { TestingContextKeys } from '../../common/testingContextKeys.js';

export const getTestItemContextOverlay = (test: InternalTestItem | undefined, capabilities: number): [string, unknown][] => {
	if (!test) {
		return [];
	}

	const testId = TestId.fromString(test.item.extId);

	return [
		[TestingContextKeys.testItemExtId.key, testId.localId],
		[TestingContextKeys.controllerId.key, test.controllerId],
		[TestingContextKeys.testItemHasUri.key, !!test.item.uri],
		...capabilityContextKeys(capabilities),
	];
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/browser/explorerProjections/treeProjection.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/browser/explorerProjections/treeProjection.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ObjectTree } from '../../../../../base/browser/ui/tree/objectTree.js';
import { Emitter } from '../../../../../base/common/event.js';
import { FuzzyScore } from '../../../../../base/common/filters.js';
import { Iterable } from '../../../../../base/common/iterator.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { ITestTreeProjection, TestExplorerTreeElement, TestItemTreeElement, TestTreeErrorMessage, getChildrenForParent, testIdentityProvider } from './index.js';
import { ISerializedTestTreeCollapseState, isCollapsedInSerializedTestTree } from './testingViewState.js';
import { IComputedStateAndDurationAccessor, refreshComputedState } from '../../common/getComputedState.js';
import { TestId } from '../../common/testId.js';
import { TestResultItemChangeReason } from '../../common/testResult.js';
import { ITestResultService } from '../../common/testResultService.js';
import { ITestService } from '../../common/testService.js';
import { ITestItemUpdate, InternalTestItem, TestDiffOpType, TestItemExpandState, TestResultState, TestsDiff, applyTestItemUpdate } from '../../common/testTypes.js';

const computedStateAccessor: IComputedStateAndDurationAccessor<TreeTestItemElement> = {
	getOwnState: i => i instanceof TestItemTreeElement ? i.ownState : TestResultState.Unset,
	getCurrentComputedState: i => i.state,
	setComputedState: (i, s) => i.state = s,

	getCurrentComputedDuration: i => i.duration,
	getOwnDuration: i => i instanceof TestItemTreeElement ? i.ownDuration : undefined,
	setComputedDuration: (i, d) => i.duration = d,

	getChildren: i => Iterable.filter(
		i.children.values(),
		(t): t is TreeTestItemElement => t instanceof TreeTestItemElement,
	),
	*getParents(i) {
		for (let parent = i.parent; parent; parent = parent.parent) {
			yield parent as TreeTestItemElement;
		}
	},
};

/**
 * Test tree element element that groups be hierarchy.
 */
class TreeTestItemElement extends TestItemTreeElement {
	/**
	 * Own, non-computed state.
	 * @internal
	 */
	public ownState = TestResultState.Unset;

	/**
	 * Own, non-computed duration.
	 * @internal
	 */
	public ownDuration: number | undefined;

	public override get description() {
		return this.test.item.description;
	}

	private errorChild?: TestTreeErrorMessage;

	constructor(
		test: InternalTestItem,
		parent: null | TreeTestItemElement,
		protected readonly addedOrRemoved: (n: TestItemTreeElement) => void,
	) {
		super({ ...test, item: { ...test.item } }, parent);
		this.updateErrorVisibility();
	}

	public update(patch: ITestItemUpdate) {
		applyTestItemUpdate(this.test, patch);
		this.updateErrorVisibility(patch);
		this.fireChange();
	}

	public fireChange() {
		this.changeEmitter.fire();
	}

	private updateErrorVisibility(patch?: ITestItemUpdate) {
		if (this.errorChild && (!this.test.item.error || patch?.item?.error)) {
			this.addedOrRemoved(this);
			this.children.delete(this.errorChild);
			this.errorChild = undefined;
		}
		if (this.test.item.error && !this.errorChild) {
			this.errorChild = new TestTreeErrorMessage(this.test.item.error, this);
			this.children.add(this.errorChild);
			this.addedOrRemoved(this);
		}
	}
}

/**
 * Projection that lists tests in their traditional tree view.
 */
export class TreeProjection extends Disposable implements ITestTreeProjection {
	private readonly updateEmitter = new Emitter<void>();

	private readonly changedParents = new Set<TestItemTreeElement | null>();
	private readonly resortedParents = new Set<TestItemTreeElement | null>();

	private readonly items = new Map<string, TreeTestItemElement>();

	/**
	 * Gets root elements of the tree.
	 */
	private get rootsWithChildren(): Iterable<TreeTestItemElement> {
		const rootsIt = Iterable.map(this.testService.collection.rootItems, r => this.items.get(r.item.extId));
		return Iterable.filter(rootsIt, (r): r is TreeTestItemElement => !!r?.children.size);
	}

	/**
	 * @inheritdoc
	 */
	public readonly onUpdate = this.updateEmitter.event;

	constructor(
		public lastState: ISerializedTestTreeCollapseState,
		@ITestService private readonly testService: ITestService,
		@ITestResultService private readonly results: ITestResultService,
	) {
		super();
		this._register(testService.onDidProcessDiff((diff) => this.applyDiff(diff)));

		// when test results are cleared, recalculate all state
		this._register(results.onResultsChanged((evt) => {
			if (!('removed' in evt)) {
				return;
			}

			for (const inTree of [...this.items.values()].sort((a, b) => b.depth - a.depth)) {
				const lookup = this.results.getStateById(inTree.test.item.extId)?.[1];
				inTree.ownDuration = lookup?.ownDuration;
				refreshComputedState(computedStateAccessor, inTree, lookup?.ownComputedState ?? TestResultState.Unset).forEach(i => i.fireChange());
			}
		}));

		// when test states change, reflect in the tree
		this._register(results.onTestChanged(ev => {
			if (ev.reason === TestResultItemChangeReason.NewMessage) {
				return; // no effect in the tree
			}

			let result = ev.item;
			// if the state is unset, or the latest run is not making the change,
			// double check that it's valid. Retire calls might cause previous
			// emit a state change for a test run that's already long completed.
			if (result.ownComputedState === TestResultState.Unset || ev.result !== results.results[0]) {
				const fallback = results.getStateById(result.item.extId);
				if (fallback) {
					result = fallback[1];
				}
			}

			const item = this.items.get(result.item.extId);
			if (!item) {
				return;
			}

			// Skip refreshing the duration if we can trivially tell it didn't change.
			const refreshDuration = ev.reason === TestResultItemChangeReason.OwnStateChange && ev.previousOwnDuration !== result.ownDuration;
			// For items without children, always use the computed state. They are
			// either leaves (for which it's fine) or nodes where we haven't expanded
			// children and should trust whatever the result service gives us.
			const explicitComputed = item.children.size ? undefined : result.computedState;

			item.retired = !!result.retired;
			item.ownState = result.ownComputedState;
			item.ownDuration = result.ownDuration;
			item.fireChange();

			refreshComputedState(computedStateAccessor, item, explicitComputed, refreshDuration).forEach(i => i.fireChange());
		}));

		for (const test of testService.collection.all) {
			this.storeItem(this.createItem(test));
		}
	}

	/**
	 * @inheritdoc
	 */
	public getElementByTestId(testId: string): TestItemTreeElement | undefined {
		return this.items.get(testId);
	}

	/**
	 * @inheritdoc
	 */
	private applyDiff(diff: TestsDiff) {
		for (const op of diff) {
			switch (op.op) {
				case TestDiffOpType.Add: {
					const item = this.createItem(op.item);
					this.storeItem(item);
					break;
				}

				case TestDiffOpType.Update: {
					const patch = op.item;
					const existing = this.items.get(patch.extId);
					if (!existing) {
						break;
					}

					// parent needs to be re-rendered on an expand update, so that its
					// children are rewritten.
					const needsParentUpdate = existing.test.expand === TestItemExpandState.NotExpandable && patch.expand;
					existing.update(patch);
					if (needsParentUpdate) {
						this.changedParents.add(existing.parent);
					} else {
						this.resortedParents.add(existing.parent);
					}
					break;
				}

				case TestDiffOpType.Remove: {
					const toRemove = this.items.get(op.itemId);
					if (!toRemove) {
						break;
					}

					// Removing the first element will cause the root to be hidden.
					// Changing first-level elements will need the root to re-render if
					// there are no other controllers with items.
					const parent = toRemove.parent;
					const affectsRootElement = toRemove.depth === 1 && (parent?.children.size === 1 || !Iterable.some(this.rootsWithChildren, (_, i) => i === 1));
					this.changedParents.add(affectsRootElement ? null : parent);

					const queue: Iterable<TestExplorerTreeElement>[] = [[toRemove]];
					while (queue.length) {
						for (const item of queue.pop()!) {
							if (item instanceof TreeTestItemElement) {
								queue.push(this.unstoreItem(item));
							}
						}
					}

					if (parent instanceof TreeTestItemElement) {
						refreshComputedState(computedStateAccessor, parent, undefined, !!parent.duration).forEach(i => i.fireChange());
					}
				}
			}
		}

		if (diff.length !== 0) {
			this.updateEmitter.fire();
		}
	}

	/**
	 * @inheritdoc
	 */
	public applyTo(tree: ObjectTree<TestExplorerTreeElement, FuzzyScore>) {
		for (const parent of this.changedParents) {
			if (!parent || tree.hasElement(parent)) {
				tree.setChildren(parent, getChildrenForParent(this.lastState, this.rootsWithChildren, parent), { diffIdentityProvider: testIdentityProvider });
			}
		}

		for (const parent of this.resortedParents) {
			if (!parent || tree.hasElement(parent)) {
				tree.resort(parent, false);
			}
		}

		this.changedParents.clear();
		this.resortedParents.clear();
	}

	/**
	 * @inheritdoc
	 */
	public expandElement(element: TestItemTreeElement, depth: number): void {
		if (!(element instanceof TreeTestItemElement)) {
			return;
		}

		if (element.test.expand === TestItemExpandState.NotExpandable) {
			return;
		}

		this.testService.collection.expand(element.test.item.extId, depth);
	}

	private createItem(item: InternalTestItem): TreeTestItemElement {
		const parentId = TestId.parentId(item.item.extId);
		const parent = parentId ? this.items.get(parentId)! : null;
		return new TreeTestItemElement(item, parent, n => this.changedParents.add(n));
	}

	private unstoreItem(treeElement: TreeTestItemElement) {
		const parent = treeElement.parent;
		parent?.children.delete(treeElement);
		this.items.delete(treeElement.test.item.extId);
		return treeElement.children;
	}

	private storeItem(treeElement: TreeTestItemElement) {
		treeElement.parent?.children.add(treeElement);
		this.items.set(treeElement.test.item.extId, treeElement);

		// The first element will cause the root to be shown. The first element of
		// a parent may need to re-render it for #204805.
		const affectsParent = treeElement.parent?.children.size === 1;
		const affectedParent = affectsParent ? treeElement.parent.parent : treeElement.parent;
		this.changedParents.add(affectedParent);
		if (affectedParent?.depth === 0) {
			this.changedParents.add(null);
		}

		if (treeElement.depth === 0 || isCollapsedInSerializedTestTree(this.lastState, treeElement.test.item.extId) === false) {
			this.expandElement(treeElement, 0);
		}

		const prevState = this.results.getStateById(treeElement.test.item.extId)?.[1];
		if (prevState) {
			treeElement.retired = !!prevState.retired;
			treeElement.ownState = prevState.computedState;
			treeElement.ownDuration = prevState.ownDuration;

			refreshComputedState(computedStateAccessor, treeElement, undefined, !!treeElement.ownDuration).forEach(i => i.fireChange());
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/browser/media/testing.css]---
Location: vscode-main/src/vs/workbench/contrib/testing/browser/media/testing.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/** -- icons */

.monaco-workbench {
	.codicon-testing-error-icon {
		color: var(--vscode-testing-iconErrored);
	}

	.codicon-testing-failed-icon {
		color: var(--vscode-testing-iconFailed);
	}

	.codicon-testing-passed-icon {
		color: var(--vscode-testing-iconPassed);
	}

	.codicon-testing-queued-icon {
		color: var(--vscode-testing-iconQueued);
	}

	.codicon-testing-skipped-icon {
		color: var(--vscode-testing-iconSkipped);
	}

	.codicon-testing-unset-icon {
		color: var(--vscode-testing-iconUnset);
	}
}

/** -- explorer */
.test-explorer {
	display: flex;
	flex-direction: column;
}

.test-explorer > .test-explorer-tree {
	flex-grow: 1;
	height: 0px;
	position: relative;
}

.testing-stdtree-container {
	display: flex;
	align-items: center;

	.label {
		flex-grow: 1;
		width: 0;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;

		.codicon {
			vertical-align: middle;
			font-size: 1em;
			transform: scale(1.25);
			margin: 0 0.125em;
		}

		.monaco-list.horizontal-scrolling & {
			width: auto;
			overflow: visible;
		}
	}

	.monaco-action-bar {
		display: none;
		flex-shrink: 0;
		margin-right: 0.8em;
	}

	&:hover, &.focused {
		.monaco-action-bar {
			display: initial;
		}
	}
}

.test-output-peek-tree {
	color: var(--vscode-editor-foreground);
	border-left: 1px solid var(--vscode-panelSection-border);
}

.test-explorer .monaco-list-row .codicon-testing-hidden {
	display: none;
	flex-shrink: 0;
	margin-right: 0.8em;
}

.test-explorer .monaco-list-row .monaco-action-bar.testing-is-continuous-run {
	display: initial;
}

.test-explorer .monaco-list-row .monaco-action-bar .codicon-testing-continuous-is-on {
	color: var(--vscode-inputOption-activeForeground);
	border-color: var(--vscode-inputOption-activeBorder);
	background: var(--vscode-inputOption-activeBackground);
	border: 1px solid var(--vscode-inputOption-activeBorder);
	border-radius: 3px;
}

.test-explorer .monaco-list-row:not(.focused, :hover) .monaco-action-bar.testing-is-continuous-run .action-item {
	display: none;
}

.test-explorer .monaco-list-row .monaco-action-bar.testing-is-continuous-run .action-item:last-child {
	display: block !important;
}

.test-explorer .monaco-list-row .test-is-hidden .codicon-testing-hidden {
	display: block;
	margin-right: 9px;
}

.test-explorer .monaco-list-row:hover .codicon-testing-hidden,
.test-explorer .monaco-list-row.focused .codicon-testing-hidden {
	display: none;
}

.test-explorer .monaco-list-row .error {
	outline: 1px solid var(--vscode-inputValidation-errorBorder);
	background: var(--vscode-inputValidation-errorBackground);
	padding: 2px 4px;
	border-radius: 2px;
	margin: 3px 12px 3px 3px;
	line-height: 17px;
	font-size: 12px;
	height: 17px;
	overflow: hidden;
}

.test-explorer .monaco-list-row .error p {
	margin: 0;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
}

.test-explorer .monaco-list-row .error a {
	color: var(--vscode-textLink-foreground);
}

.test-explorer .monaco-list-row .error a:hover {
	color: var(--vscode-textLink-activeForeground);
}

.test-explorer .computed-state,
.test-output-peek-tree .computed-state {
	margin-right: 0.25em;
}

.test-explorer .test-is-hidden {
	opacity: 0.8;
}

.test-explorer .result-summary-container {
	padding: 0 12px 8px;
	font-variant-numeric: tabular-nums;
	height: 27px;
	box-sizing: border-box;
}

.test-explorer .result-summary {
	display: flex;
	align-items: center;
	gap: 2px;
}

.test-explorer .result-summary > span {
	flex-grow: 1;
}

.monaco-workbench .test-explorer .monaco-action-bar .action-item > .action-label {
	padding: 1px 2px;
	margin-right: 2px;
}

.monaco-workbench .part > .title > .title-actions .action-label.codicon-testing-autorun::after {
	content: '';
	display: none;
	position: absolute;
	width: 0.4em;
	height: 0.4em;
	top: 50%;
	left: 50%;
	margin: 0.1em 0 0 0.05em;
	border-radius: 100%;
}

.monaco-workbench .part > .title > .title-actions .action-label.codicon-testing-autorun.checked::after {
	display: block;
}

.codicon-testing-loading-icon::before {
	/* Use steps to throttle FPS to reduce CPU usage */
	animation: codicon-spin 1.25s steps(30) infinite;
}

.testing-no-test-placeholder {
	display: none;
	padding: 0 20px;
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	z-index: 1;
}

.testing-no-test-placeholder.visible {
	display: block;
}

/** -- peek */
.monaco-editor .zone-widget.test-output-peek .zone-widget-container.peekview-widget {
	border-top-width: 2px;
	border-bottom-width: 2px;
}

.monaco-editor .zone-widget.test-output-peek .type-decoration {
	background-color: var(--vscode-peekViewEditor-matchHighlightBackground);
	border: 2px solid var(--vscode-peekViewEditor-matchHighlightBorder);
	box-sizing: border-box;
}

.monaco-editor .zone-widget.test-output-peek .monaco-editor .monaco-editor-background,
.monaco-editor .zone-widget.test-output-peek .monaco-editor .inputarea.ime-input,
.monaco-editor .zone-widget.test-output-peek .test-output-peek-message-container {
	background-color: var(--vscode-peekViewEditor-background);
}

.monaco-editor .zone-widget.test-output-peek .monaco-editor .margin {
	background-color: var(--vscode-peekViewEditorGutter-background);
}

.test-output-peek-message-container {
	overflow: hidden;
}

.test-output-peek-message-container .floating-click-widget {
	position: absolute;
	right: 20px;
	bottom: 10px;
}

.test-output-peek-message-container,
.test-output-peek-tree {
	height: 100%;
}

.test-output-peek-message-container .preview-text {
	padding: 8px 12px 8px 20px;
	line-height: normal;
	white-space: normal;
}

.test-output-peek-message-container .preview-text p:first-child {
	margin-top: 0;
}

.test-output-peek-message-container .preview-text p:last-child {
	margin-bottom: 0;
}

.test-output-peek-message-container .preview-text a {
	cursor: pointer;
}

.testing-followup-action {
	line-height: 25px;
	overflow: hidden;
	pointer-events: none;
	display: flex;
	align-items: center;
	gap: 14px;

	&.animated {
		animation: fadeIn 150ms ease-out;
	}

	> a {
		display: flex;
		align-items: center;
		gap: 4px;
		cursor: pointer;
		pointer-events: auto;
		width: fit-content;
		flex-shrink: 0;

		&,
		.codicon {
			color: var(--vscode-textLink-foreground);
		}

		&:hover {
			color: var(--vscode-textLink-activeForeground);
		}

		&[aria-disabled="true"] {
			color: inherit;
			cursor: default;

			.codicon {
				color: inherit;
			}
		}
	}
}

.test-output-call-stack {
	height: 100%;
}

/** -- filter  */
.monaco-action-bar.testing-filter-action-bar {
	flex-shrink: 0;
	margin: 4px 12px;
	height: auto;
}

.testing-filter-action-item {
	display: flex !important;
	flex-grow: 1;
	max-width: 400px;
	align-items: center;
}

.testing-filter-action-item > .monaco-action-bar .testing-filter-button.checked {
	border-color: var(--vscode-inputOption-activeBorder);
	color: var(--vscode-inputOption-activeForeground);
	background-color: var(--vscode-inputOption-activeBackground);
}

.testing-filter-action-bar .testing-filter-action-item {
	max-width: none;
}

.testing-filter-action-item .testing-filter-wrapper {
	flex-grow: 1;
}

.testing-filter-action-item .testing-filter-wrapper input {
	padding-right: 30px !important;
}

.testing-filter-action-item .monaco-action-bar {
	position: absolute;
	top: 0;
	bottom: 0;
	right: 3px;
	display: flex;
	align-items: center;
}

/** -- decorations  */

.monaco-editor .testing-run-glyph {
	cursor: pointer;
}

.testing-diff-title-widget {
	line-height: 19px;
	font-size: 12px;
	padding-right: 6px;

	overflow: hidden;
	display: inline-block;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.test-message-inline-content {
	font-family: var(--testMessageDecorationFontFamily);
	font-size: var(--testMessageDecorationFontSize);
}

.test-message-inline-content-clickable {
	cursor: pointer;
}

.test-label-description {
	opacity: .7;
	margin-left: 0.5em;
	font-size: .9em;
	white-space: pre;
}

.testing-diff-lens-widget {
	color: var(--vscode-editorCodeLens-foreground);
}

.test-message-inline-content {
	margin-left: 4em;

	+ .test-message-inline-content {
		margin-left: 0;

		&::before {
			display: none;
		}
	}
}

.test-message-inline-content-s1 {
	color: var(--vscode-testing-message-info-decorationForeground) !important;
}

.monaco-workbench .test-error-content-widget {
	z-index: 0;
}

.monaco-workbench .test-error-content-widget .inner {
	margin-left: 20px;
	color: var(--vscode-testing-message-error-badgeForeground) !important;
	border-top-right-radius: 2px;
	border-bottom-right-radius: 2px;
	padding-right: 3px;
	display: flex !important;
	align-items: center;
	font-size: 11px;
	gap: 3px;
	user-select: none;
	cursor: pointer;
	box-sizing: border-box;
	position: relative;
	border: 1px solid var(--vscode-testing-message-error-badgeBorder);
	border-left: none;

	&.is-current {
		display: none !important;
	}

	.codicon.codicon-testing-failed-icon {
		color: currentColor !important;
		font-size: 11px;
		margin: 1px 0 0 -4px;
		z-index: 1;
	}

	.content {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.arrow svg {
		position: absolute;
		height: calc(100% + 2px);
		top: -1px;
		width: 15px;
		left: -10px;
		z-index: -1;
		stroke-width: 0.71px; /* 1 / sqrt(2) */
		stroke: var(--vscode-testing-message-error-badgeBorder);
	}
}

.monaco-editor .testing-inline-message-severity-0 {
	background: var(--vscode-testing-message-error-lineBackground) !important;
}

.monaco-editor .testing-inline-message-severity-1 {
	background: var(--vscode-testing-message-info-lineBackground) !important;
}

/** -- coverage  */

.test-coverage-bars {
	display: flex;
	align-items: center;
	gap: 4px;
	font-size: 11px;
	margin-right: 12px;
}

.test-coverage-bars .bar {
	height: 8px;
	border: 1px solid currentColor;
	border-radius: 2px;
	position: relative;
	overflow: hidden;
}

.test-coverage-bars .bar::before {
	content: '';
	background: currentColor;
	width: var(--test-bar-width);
	height: 100%;
	position: absolute;
	opacity: 0.7;
}

.test-coverage-list-item .icon {
	margin-right: 0.2em;
}

.test-coverage-list-item.not-covered .name {
	opacity: 0.7;
}

.coverage-summary-widget {
	color: var(--vscode-editor-foreground);
	z-index: 1;
	background: var(--vscode-editor-background);
	left: 0;
	width: 100%;
	box-shadow: var(--vscode-editorStickyScroll-shadow) 0 3px 2px -2px;

	> div {
		display: flex;
		align-items: center;
		padding: 0 22px;
		height: 25px;
	}

	.btn {
		position: relative;
		margin: 0 4px;
		padding: 0 4px;

		&:first-child {
			margin-left: 0;
		}

		&:last-child {
			margin-right: 0;
		}
	}

	.stat,
	.action-label {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		margin: 0 3px;
	}

	.action-label {
		display: flex;
		align-items: center;
		font-size: 13px;
		padding: 0 4px;

		.codicon {
			margin-right: 4px;
		}
	}

}

.test-coverage-tree-per-test-switcher {
	display: flex;
	background-color: var(--vscode-dropdown-background);
	color: var(--vscode-dropdown-foreground);
	border: 1px solid var(--vscode-dropdown-border);

	margin: 3px 0;
	cursor: pointer;
	margin-right: 22px;
	line-height: 20px;
	padding: 0 6px;
	width: fit-content;
	max-width: calc(100% - 44px);

	span {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	&::after {
		content: '';
		content: var(--vscode-icon-chevron-right-content);
		font-family: var(--vscode-icon-chevron-right-font-family);
		font-size: 18px;
		padding-left: 22px;
	}
}

/** -- coverage in the explorer  */

.explorer-item-with-test-coverage {
	display: flex;
}

.explorer-item-with-test-coverage .explorer-item {
	flex-grow: 1;
}

.explorer-item-with-test-coverage .monaco-icon-label::after {
	margin-right: 12px;
	/* slightly reduce because the bars handle the scrollbar margin */
}

/** -- coverage decorations  */

.coverage-deco-gutter {
	z-index: 0;
}

.coverage-deco-gutter::before {
	content: '';
	position: absolute;
	inset: 0;
	z-index: -1;
}

.coverage-deco-gutter.coverage-deco-hit::before {
	background: var(--vscode-testing-coveredGutterBackground);
	border-color: var(--vscode-testing-coveredGutterBackground);
}

.coverage-deco-gutter.coverage-deco-miss::before {
	background: var(--vscode-testing-uncoveredGutterBackground);
	border-color: var(--vscode-testing-uncoveredGutterBackground);
}

.hc-light .coverage-deco-gutter::before,
.hc-black .coverage-deco-gutter::before {
	border-width: 3px 0 3px 5px;
	border-style: solid;
	background: none;
}

.coverage-deco-gutter.coverage-deco-miss.coverage-deco-hit::before {
	background-image: linear-gradient(45deg,
			var(--vscode-testing-coveredGutterBackground) 25%,
			var(--vscode-testing-uncoveredGutterBackground) 25%,
			var(--vscode-testing-uncoveredGutterBackground) 50%,
			var(--vscode-testing-coveredGutterBackground) 50%,
			75%,
			var(--vscode-testing-uncoveredGutterBackground) 75%,
			var(--vscode-testing-uncoveredGutterBackground) 100%);
	background-size: 6px 6px;
	background-color: transparent;
}

.coverage-deco-inline {
	outline-offset: -1px;
}

.monaco-editor {
	.coverage-deco-inline.coverage-deco-hit {
		background: var(--vscode-testing-coveredBackground);
		outline: 1px solid var(--vscode-testing-coveredBorder);
	}

	.coverage-deco-inline.coverage-deco-miss {
		background: var(--vscode-testing-uncoveredBackground);
		outline: 1px solid var(--vscode-testing-uncoveredBorder);
	}

	.hc-light .coverage-deco-inline.coverage-deco-hit,
	.hc-black .coverage-deco-inline.coverage-deco-hit {
		outline-style: dashed;
	}

	.coverage-deco-branch-miss-indicator {
		height: 100%;
		width: 4ch;
		position: relative;
		display: inline-block;
		font: inherit !important;
	}

	.coverage-deco-branch-miss-indicator::before {
		position: absolute;
		top: 50%;
		left: 50%;
		text-align: center;
		transform: translate(-50%, -50%);
		padding: calc(var(--vscode-testing-coverage-lineHeight) / 10);
		border-radius: 2px;
		font: normal normal normal calc(var(--vscode-testing-coverage-lineHeight) / 2)/1 codicon;
		border: 1px solid;
	}

	.coverage-deco-inline-count {
		position: relative;
		background: var(--vscode-testing-coverCountBadgeBackground);
		color: var(--vscode-testing-coverCountBadgeForeground);
		font-size: 0.7em;
		margin: 0 0.7em 0 0.4em;
		padding: 0.2em 0 0.2em 0.2em;
		/* display: inline-block; */
		border-top-left-radius: 2px;
		border-bottom-left-radius: 2px;

		&::after {
			content: '';
			display: block;
			position: absolute;
			left: 100%;
			top: 0;
			bottom: 0;
			width: 0.5em;
			background-image:
				linear-gradient(to bottom left, transparent 50%, var(--vscode-testing-coverCountBadgeBackground) 0),
				linear-gradient(to bottom right, var(--vscode-testing-coverCountBadgeBackground) 50%, transparent 0);
			background-size: 100% 50%;
			background-repeat: no-repeat;
			background-position: top, bottom;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/browser/media/testMessageColorizer.css]---
Location: vscode-main/src/vs/workbench/contrib/testing/browser/media/testMessageColorizer.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.test-output-peek-message-container {
	.tstm-ansidec-1 {
		font-weight: bold;
	}
	.tstm-ansidec-2 {
		opacity: 0.7
	}
	.tstm-ansidec-3 {
		font-style: italic;
	}
	.tstm-ansidec-4 {
		text-decoration: underline;
	}

	.tstm-ansidec-fg30 { color: var(--vscode-terminal-ansiBlack); }
	.tstm-ansidec-fg31 { color: var(--vscode-terminal-ansiRed); }
	.tstm-ansidec-fg32 { color: var(--vscode-terminal-ansiGreen); }
	.tstm-ansidec-fg33 { color: var(--vscode-terminal-ansiYellow); }
	.tstm-ansidec-fg34 { color: var(--vscode-terminal-ansiBlue); }
	.tstm-ansidec-fg35 { color: var(--vscode-terminal-ansiMagenta); }
	.tstm-ansidec-fg36 { color: var(--vscode-terminal-ansiCyan); }
	.tstm-ansidec-fg37 { color: var(--vscode-terminal-ansiWhite); }

	.tstm-ansidec-fg90 { color: var(--vscode-terminal-ansiBrightBlack); }
	.tstm-ansidec-fg91 { color: var(--vscode-terminal-ansiBrightRed); }
	.tstm-ansidec-fg92 { color: var(--vscode-terminal-ansiBrightGreen); }
	.tstm-ansidec-fg93 { color: var(--vscode-terminal-ansiBrightYellow); }
	.tstm-ansidec-fg94 { color: var(--vscode-terminal-ansiBrightBlue); }
	.tstm-ansidec-fg95 { color: var(--vscode-terminal-ansiBrightMagenta); }
	.tstm-ansidec-fg96 { color: var(--vscode-terminal-ansiBrightCyan); }
	.tstm-ansidec-fg97 { color: var(--vscode-terminal-ansiBrightWhite); }

	.tstm-ansidec-bg30 { background-color: var(--vscode-terminal-ansiBlack); }
	.tstm-ansidec-bg31 { background-color: var(--vscode-terminal-ansiRed); }
	.tstm-ansidec-bg32 { background-color: var(--vscode-terminal-ansiGreen); }
	.tstm-ansidec-bg33 { background-color: var(--vscode-terminal-ansiYellow); }
	.tstm-ansidec-bg34 { background-color: var(--vscode-terminal-ansiBlue); }
	.tstm-ansidec-bg35 { background-color: var(--vscode-terminal-ansiMagenta); }
	.tstm-ansidec-bg36 { background-color: var(--vscode-terminal-ansiCyan); }
	.tstm-ansidec-bg37 { background-color: var(--vscode-terminal-ansiWhite); }

	.tstm-ansidec-bg100 { background-color: var(--vscode-terminal-ansiBrightBlack); }
	.tstm-ansidec-bg101 { background-color: var(--vscode-terminal-ansiBrightRed); }
	.tstm-ansidec-bg102 { background-color: var(--vscode-terminal-ansiBrightGreen); }
	.tstm-ansidec-bg103 { background-color: var(--vscode-terminal-ansiBrightYellow); }
	.tstm-ansidec-bg104 { background-color: var(--vscode-terminal-ansiBrightBlue); }
	.tstm-ansidec-bg105 { background-color: var(--vscode-terminal-ansiBrightMagenta); }
	.tstm-ansidec-bg106 { background-color: var(--vscode-terminal-ansiBrightCyan); }
	.tstm-ansidec-bg107 { background-color: var(--vscode-terminal-ansiBrightWhite); }
}
```

--------------------------------------------------------------------------------

````
