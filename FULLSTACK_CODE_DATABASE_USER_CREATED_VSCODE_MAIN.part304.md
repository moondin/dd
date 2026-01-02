---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 304
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 304 of 552)

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

---[FILE: src/vs/workbench/api/browser/mainThreadTesting.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadTesting.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../base/common/buffer.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { Event } from '../../../base/common/event.js';
import { Disposable, DisposableStore, IDisposable, MutableDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { ISettableObservable, observableValue, transaction } from '../../../base/common/observable.js';
import { WellDefinedPrefixTree } from '../../../base/common/prefixTree.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { Range } from '../../../editor/common/core/range.js';
import { IUriIdentityService } from '../../../platform/uriIdentity/common/uriIdentity.js';
import { TestCoverage } from '../../contrib/testing/common/testCoverage.js';
import { TestId } from '../../contrib/testing/common/testId.js';
import { ITestProfileService } from '../../contrib/testing/common/testProfileService.js';
import { LiveTestResult } from '../../contrib/testing/common/testResult.js';
import { ITestResultService } from '../../contrib/testing/common/testResultService.js';
import { IMainThreadTestController, ITestService } from '../../contrib/testing/common/testService.js';
import { CoverageDetails, ExtensionRunTestsRequest, IFileCoverage, ITestItem, ITestMessage, ITestRunProfile, ITestRunTask, ResolvedTestRunRequest, TestControllerCapability, TestResultState, TestRunProfileBitset, TestsDiffOp } from '../../contrib/testing/common/testTypes.js';
import { IExtHostContext, extHostNamedCustomer } from '../../services/extensions/common/extHostCustomers.js';
import { ExtHostContext, ExtHostTestingShape, ILocationDto, ITestControllerPatch, MainContext, MainThreadTestingShape } from '../common/extHost.protocol.js';

@extHostNamedCustomer(MainContext.MainThreadTesting)
export class MainThreadTesting extends Disposable implements MainThreadTestingShape {
	private readonly proxy: ExtHostTestingShape;
	private readonly diffListener = this._register(new MutableDisposable());
	private readonly testProviderRegistrations = new Map<string, {
		instance: IMainThreadTestController;
		label: ISettableObservable<string>;
		capabilities: ISettableObservable<TestControllerCapability>;
		disposable: IDisposable;
	}>();

	constructor(
		extHostContext: IExtHostContext,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@ITestService private readonly testService: ITestService,
		@ITestProfileService private readonly testProfiles: ITestProfileService,
		@ITestResultService private readonly resultService: ITestResultService,
	) {
		super();
		this.proxy = extHostContext.getProxy(ExtHostContext.ExtHostTesting);

		this._register(this.testService.registerExtHost({
			provideTestFollowups: (req, token) => this.proxy.$provideTestFollowups(req, token),
			executeTestFollowup: id => this.proxy.$executeTestFollowup(id),
			disposeTestFollowups: ids => this.proxy.$disposeTestFollowups(ids),
			getTestsRelatedToCode: (uri, position, token) => this.proxy.$getTestsRelatedToCode(uri, position, token),
		}));

		this._register(this.testService.onDidCancelTestRun(({ runId, taskId }) => {
			this.proxy.$cancelExtensionTestRun(runId, taskId);
		}));

		this._register(Event.debounce(testProfiles.onDidChange, (_last, e) => e)(() => {
			const obj: Record</* controller id */string, /* profile id */ number[]> = {};
			for (const group of [TestRunProfileBitset.Run, TestRunProfileBitset.Debug, TestRunProfileBitset.Coverage]) {
				for (const profile of this.testProfiles.getGroupDefaultProfiles(group)) {
					obj[profile.controllerId] ??= [];
					obj[profile.controllerId].push(profile.profileId);
				}
			}

			this.proxy.$setDefaultRunProfiles(obj);
		}));

		this._register(resultService.onResultsChanged(evt => {
			if ('completed' in evt) {
				const serialized = evt.completed.toJSONWithMessages();
				if (serialized) {
					this.proxy.$publishTestResults([serialized]);
				}
			} else if ('removed' in evt) {
				evt.removed.forEach(r => {
					if (r instanceof LiveTestResult) {
						this.proxy.$disposeRun(r.id);
					}
				});
			}
		}));
	}

	/**
	 * @inheritdoc
	 */
	$markTestRetired(testIds: string[] | undefined): void {
		let tree: WellDefinedPrefixTree<undefined> | undefined;
		if (testIds) {
			tree = new WellDefinedPrefixTree();
			for (const id of testIds) {
				tree.insert(TestId.fromString(id).path, undefined);
			}
		}

		for (const result of this.resultService.results) {
			// all non-live results are already entirely outdated
			if (result instanceof LiveTestResult) {
				result.markRetired(tree);
			}
		}
	}

	/**
	 * @inheritdoc
	 */
	$publishTestRunProfile(profile: ITestRunProfile): void {
		const controller = this.testProviderRegistrations.get(profile.controllerId);
		if (controller) {
			this.testProfiles.addProfile(controller.instance, profile);
		}
	}

	/**
	 * @inheritdoc
	 */
	$updateTestRunConfig(controllerId: string, profileId: number, update: Partial<ITestRunProfile>): void {
		this.testProfiles.updateProfile(controllerId, profileId, update);
	}

	/**
	 * @inheritdoc
	 */
	$removeTestProfile(controllerId: string, profileId: number): void {
		this.testProfiles.removeProfile(controllerId, profileId);
	}

	/**
	 * @inheritdoc
	 */
	$addTestsToRun(controllerId: string, runId: string, tests: ITestItem.Serialized[]): void {
		this.withLiveRun(runId, r => r.addTestChainToRun(controllerId,
			tests.map(t => ITestItem.deserialize(this.uriIdentityService, t))));
	}

	/**
	 * @inheritdoc
	 */
	$appendCoverage(runId: string, taskId: string, coverage: IFileCoverage.Serialized): void {
		this.withLiveRun(runId, run => {
			const task = run.tasks.find(t => t.id === taskId);
			if (!task) {
				return;
			}

			const deserialized = IFileCoverage.deserialize(this.uriIdentityService, coverage);

			transaction(tx => {
				let value = task.coverage.read(undefined);
				if (!value) {
					value = new TestCoverage(run, taskId, this.uriIdentityService, {
						getCoverageDetails: (id, testId, token) => this.proxy.$getCoverageDetails(id, testId, token)
							.then(r => r.map(CoverageDetails.deserialize)),
					});
					value.append(deserialized, tx);
					(task.coverage as ISettableObservable<TestCoverage>).set(value, tx);
				} else {
					value.append(deserialized, tx);
				}
			});
		});
	}

	/**
	 * @inheritdoc
	 */
	$startedExtensionTestRun(req: ExtensionRunTestsRequest): void {
		this.resultService.createLiveResult(req);
	}

	/**
	 * @inheritdoc
	 */
	$startedTestRunTask(runId: string, task: ITestRunTask): void {
		this.withLiveRun(runId, r => r.addTask(task));
	}

	/**
	 * @inheritdoc
	 */
	$finishedTestRunTask(runId: string, taskId: string): void {
		this.withLiveRun(runId, r => r.markTaskComplete(taskId));
	}

	/**
	 * @inheritdoc
	 */
	$finishedExtensionTestRun(runId: string): void {
		this.withLiveRun(runId, r => r.markComplete());
	}

	/**
	 * @inheritdoc
	 */
	public $updateTestStateInRun(runId: string, taskId: string, testId: string, state: TestResultState, duration?: number): void {
		this.withLiveRun(runId, r => r.updateState(testId, taskId, state, duration));
	}

	/**
	 * @inheritdoc
	 */
	public $appendOutputToRun(runId: string, taskId: string, output: VSBuffer, locationDto?: ILocationDto, testId?: string): void {
		const location = locationDto && {
			uri: URI.revive(locationDto.uri),
			range: Range.lift(locationDto.range)
		};

		this.withLiveRun(runId, r => r.appendOutput(output, taskId, location, testId));
	}


	/**
	 * @inheritdoc
	 */
	public $appendTestMessagesInRun(runId: string, taskId: string, testId: string, messages: ITestMessage.Serialized[]): void {
		const r = this.resultService.getResult(runId);
		if (r && r instanceof LiveTestResult) {
			for (const message of messages) {
				r.appendMessage(testId, taskId, ITestMessage.deserialize(this.uriIdentityService, message));
			}
		}
	}

	/**
	 * @inheritdoc
	 */
	public $registerTestController(controllerId: string, _label: string, _capabilities: TestControllerCapability) {
		const disposable = new DisposableStore();
		const label = observableValue(`${controllerId}.label`, _label);
		const capabilities = observableValue(`${controllerId}.cap`, _capabilities);
		const controller: IMainThreadTestController = {
			id: controllerId,
			label,
			capabilities,
			syncTests: () => this.proxy.$syncTests(),
			refreshTests: token => this.proxy.$refreshTests(controllerId, token),
			configureRunProfile: id => this.proxy.$configureRunProfile(controllerId, id),
			runTests: (reqs, token) => this.proxy.$runControllerTests(reqs, token),
			startContinuousRun: (reqs, token) => this.proxy.$startContinuousRun(reqs, token),
			expandTest: (testId, levels) => this.proxy.$expandTest(testId, isFinite(levels) ? levels : -1),
			getRelatedCode: (testId, token) => this.proxy.$getCodeRelatedToTest(testId, token).then(locations =>
				locations.map(l => ({
					uri: URI.revive(l.uri),
					range: Range.lift(l.range)
				})),
			),
		};

		disposable.add(toDisposable(() => this.testProfiles.removeProfile(controllerId)));
		disposable.add(this.testService.registerTestController(controllerId, controller));

		this.testProviderRegistrations.set(controllerId, {
			instance: controller,
			label,
			capabilities,
			disposable
		});
	}

	/**
	 * @inheritdoc
	 */
	public $updateController(controllerId: string, patch: ITestControllerPatch) {
		const controller = this.testProviderRegistrations.get(controllerId);
		if (!controller) {
			return;
		}

		transaction(tx => {
			if (patch.label !== undefined) {
				controller.label.set(patch.label, tx);
			}

			if (patch.capabilities !== undefined) {
				controller.capabilities.set(patch.capabilities, tx);
			}
		});

	}

	/**
	 * @inheritdoc
	 */
	public $unregisterTestController(controllerId: string) {
		this.testProviderRegistrations.get(controllerId)?.disposable.dispose();
		this.testProviderRegistrations.delete(controllerId);
	}

	/**
	 * @inheritdoc
	 */
	public $subscribeToDiffs(): void {
		this.proxy.$acceptDiff(this.testService.collection.getReviverDiff().map(TestsDiffOp.serialize));
		this.diffListener.value = this.testService.onDidProcessDiff(this.proxy.$acceptDiff, this.proxy);
	}

	/**
	 * @inheritdoc
	 */
	public $unsubscribeFromDiffs(): void {
		this.diffListener.clear();
	}

	/**
	 * @inheritdoc
	 */
	public $publishDiff(controllerId: string, diff: TestsDiffOp.Serialized[]): void {
		this.testService.publishDiff(controllerId,
			diff.map(d => TestsDiffOp.deserialize(this.uriIdentityService, d)));
	}

	/**
	 * @inheritdoc
	 */
	public async $runTests(req: ResolvedTestRunRequest, token: CancellationToken): Promise<string> {
		const result = await this.testService.runResolvedTests(req, token);
		return result.id;
	}

	/**
	 * @inheritdoc
	 */
	public async $getCoverageDetails(resultId: string, taskIndex: number, uri: UriComponents, token: CancellationToken): Promise<CoverageDetails.Serialized[]> {
		const details = await this.resultService.getResult(resultId)
			?.tasks[taskIndex]
			?.coverage.get()
			?.getUri(URI.from(uri))
			?.details(token);

		// Return empty if nothing. Some failure is always possible here because
		// results might be cleared in the meantime.
		return details || [];
	}

	public override dispose() {
		super.dispose();
		for (const subscription of this.testProviderRegistrations.values()) {
			subscription.disposable.dispose();
		}
		this.testProviderRegistrations.clear();
	}

	private withLiveRun<T>(runId: string, fn: (run: LiveTestResult) => T): T | undefined {
		const r = this.resultService.getResult(runId);
		return r && r instanceof LiveTestResult ? fn(r) : undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadTheming.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadTheming.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { MainContext, ExtHostThemingShape, ExtHostContext, MainThreadThemingShape } from '../common/extHost.protocol.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { IDisposable } from '../../../base/common/lifecycle.js';
import { IThemeService } from '../../../platform/theme/common/themeService.js';

@extHostNamedCustomer(MainContext.MainThreadTheming)
export class MainThreadTheming implements MainThreadThemingShape {

	private readonly _themeService: IThemeService;
	private readonly _proxy: ExtHostThemingShape;
	private readonly _themeChangeListener: IDisposable;

	constructor(
		extHostContext: IExtHostContext,
		@IThemeService themeService: IThemeService
	) {
		this._themeService = themeService;
		this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostTheming);

		this._themeChangeListener = this._themeService.onDidColorThemeChange(e => {
			this._proxy.$onColorThemeChange(this._themeService.getColorTheme().type);
		});
		this._proxy.$onColorThemeChange(this._themeService.getColorTheme().type);
	}

	dispose(): void {
		this._themeChangeListener.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadTimeline.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadTimeline.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../base/common/event.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { URI } from '../../../base/common/uri.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { MainContext, MainThreadTimelineShape, ExtHostTimelineShape, ExtHostContext } from '../common/extHost.protocol.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { TimelineChangeEvent, TimelineOptions, TimelineProviderDescriptor, ITimelineService, Timeline } from '../../contrib/timeline/common/timeline.js';
import { revive } from '../../../base/common/marshalling.js';

@extHostNamedCustomer(MainContext.MainThreadTimeline)
export class MainThreadTimeline implements MainThreadTimelineShape {
	private readonly _proxy: ExtHostTimelineShape;
	private readonly _providerEmitters = new Map<string, Emitter<TimelineChangeEvent>>();

	constructor(
		context: IExtHostContext,
		@ILogService private readonly logService: ILogService,
		@ITimelineService private readonly _timelineService: ITimelineService
	) {
		this._proxy = context.getProxy(ExtHostContext.ExtHostTimeline);
	}

	$registerTimelineProvider(provider: TimelineProviderDescriptor): void {
		this.logService.trace(`MainThreadTimeline#registerTimelineProvider: id=${provider.id}`);

		const proxy = this._proxy;

		const emitters = this._providerEmitters;
		let onDidChange = emitters.get(provider.id);
		if (onDidChange === undefined) {
			onDidChange = new Emitter<TimelineChangeEvent>();
			emitters.set(provider.id, onDidChange);
		}

		this._timelineService.registerTimelineProvider({
			...provider,
			onDidChange: onDidChange.event,
			async provideTimeline(uri: URI, options: TimelineOptions, token: CancellationToken) {
				return revive<Timeline>(await proxy.$getTimeline(provider.id, uri, options, token));
			},
			dispose() {
				emitters.delete(provider.id);
				onDidChange?.dispose();
			}
		});
	}

	$unregisterTimelineProvider(id: string): void {
		this.logService.trace(`MainThreadTimeline#unregisterTimelineProvider: id=${id}`);

		this._timelineService.unregisterTimelineProvider(id);
	}

	$emitTimelineChangeEvent(e: TimelineChangeEvent): void {
		this.logService.trace(`MainThreadTimeline#emitChangeEvent: id=${e.id}, uri=${e.uri?.toString(true)}`);

		const emitter = this._providerEmitters.get(e.id);
		emitter?.fire(e);
	}

	dispose(): void {
		// noop
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadTreeViews.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadTreeViews.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, DisposableMap, DisposableStore } from '../../../base/common/lifecycle.js';
import { ExtHostContext, MainThreadTreeViewsShape, ExtHostTreeViewsShape, MainContext, CheckboxUpdate } from '../common/extHost.protocol.js';
import { ITreeItem, ITreeView, IViewsRegistry, ITreeViewDescriptor, IRevealOptions, Extensions, ResolvableTreeItem, ITreeViewDragAndDropController, IViewBadge, NoTreeViewError, ITreeViewDataProvider } from '../../common/views.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { distinct } from '../../../base/common/arrays.js';
import { INotificationService } from '../../../platform/notification/common/notification.js';
import { isUndefinedOrNull, isNumber } from '../../../base/common/types.js';
import { Registry } from '../../../platform/registry/common/platform.js';
import { IExtensionService } from '../../services/extensions/common/extensions.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { createStringDataTransferItem, VSDataTransfer } from '../../../base/common/dataTransfer.js';
import { VSBuffer } from '../../../base/common/buffer.js';
import { DataTransferFileCache } from '../common/shared/dataTransferCache.js';
import * as typeConvert from '../common/extHostTypeConverters.js';
import { IMarkdownString } from '../../../base/common/htmlContent.js';
import { IViewsService } from '../../services/views/common/viewsService.js';

@extHostNamedCustomer(MainContext.MainThreadTreeViews)
export class MainThreadTreeViews extends Disposable implements MainThreadTreeViewsShape {

	private readonly _proxy: ExtHostTreeViewsShape;
	private readonly _dataProviders: DisposableMap<string, { dataProvider: TreeViewDataProvider; dispose: () => void }> = this._register(new DisposableMap<string, { dataProvider: TreeViewDataProvider; dispose: () => void }>());
	private readonly _dndControllers = new Map<string, TreeViewDragAndDropController>();

	constructor(
		extHostContext: IExtHostContext,
		@IViewsService private readonly viewsService: IViewsService,
		@INotificationService private readonly notificationService: INotificationService,
		@IExtensionService private readonly extensionService: IExtensionService,
		@ILogService private readonly logService: ILogService
	) {
		super();
		this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostTreeViews);
	}

	async $registerTreeViewDataProvider(treeViewId: string, options: { showCollapseAll: boolean; canSelectMany: boolean; dropMimeTypes: string[]; dragMimeTypes: string[]; hasHandleDrag: boolean; hasHandleDrop: boolean; manuallyManageCheckboxes: boolean }): Promise<void> {
		this.logService.trace('MainThreadTreeViews#$registerTreeViewDataProvider', treeViewId, options);

		this.extensionService.whenInstalledExtensionsRegistered().then(() => {
			const dataProvider = new TreeViewDataProvider(treeViewId, this._proxy, this.notificationService);
			const disposables = new DisposableStore();
			this._dataProviders.set(treeViewId, { dataProvider, dispose: () => disposables.dispose() });
			const dndController = (options.hasHandleDrag || options.hasHandleDrop)
				? new TreeViewDragAndDropController(treeViewId, options.dropMimeTypes, options.dragMimeTypes, options.hasHandleDrag, this._proxy) : undefined;
			const viewer = this.getTreeView(treeViewId);
			if (viewer) {
				// Order is important here. The internal tree isn't created until the dataProvider is set.
				// Set all other properties first!
				viewer.showCollapseAllAction = options.showCollapseAll;
				viewer.canSelectMany = options.canSelectMany;
				viewer.manuallyManageCheckboxes = options.manuallyManageCheckboxes;
				viewer.dragAndDropController = dndController;
				if (dndController) {
					this._dndControllers.set(treeViewId, dndController);
				}
				viewer.dataProvider = dataProvider;
				this.registerListeners(treeViewId, viewer, disposables);
				this._proxy.$setVisible(treeViewId, viewer.visible);
			} else {
				this.notificationService.error('No view is registered with id: ' + treeViewId);
			}
		});
	}

	$reveal(treeViewId: string, itemInfo: { item: ITreeItem; parentChain: ITreeItem[] } | undefined, options: IRevealOptions): Promise<void> {
		this.logService.trace('MainThreadTreeViews#$reveal', treeViewId, itemInfo?.item, itemInfo?.parentChain, options);

		return this.viewsService.openView(treeViewId, options.focus)
			.then(() => {
				const viewer = this.getTreeView(treeViewId);
				if (viewer && itemInfo) {
					return this.reveal(viewer, this._dataProviders.get(treeViewId)!.dataProvider, itemInfo.item, itemInfo.parentChain, options);
				}
				return undefined;
			});
	}

	$refresh(treeViewId: string, itemsToRefreshByHandle: { [treeItemHandle: string]: ITreeItem }): Promise<void> {
		this.logService.trace('MainThreadTreeViews#$refresh', treeViewId, itemsToRefreshByHandle);

		const viewer = this.getTreeView(treeViewId);
		const dataProvider = this._dataProviders.get(treeViewId);
		if (viewer && dataProvider) {
			const itemsToRefresh = dataProvider.dataProvider.getItemsToRefresh(itemsToRefreshByHandle);
			return viewer.refresh(itemsToRefresh.items.length ? itemsToRefresh.items : undefined, itemsToRefresh.checkboxes.length ? itemsToRefresh.checkboxes : undefined);
		}
		return Promise.resolve();
	}

	$setMessage(treeViewId: string, message: string | IMarkdownString): void {
		this.logService.trace('MainThreadTreeViews#$setMessage', treeViewId, message.toString());

		const viewer = this.getTreeView(treeViewId);
		if (viewer) {
			viewer.message = message;
		}
	}

	$setTitle(treeViewId: string, title: string, description: string | undefined): void {
		this.logService.trace('MainThreadTreeViews#$setTitle', treeViewId, title, description);

		const viewer = this.getTreeView(treeViewId);
		if (viewer) {
			viewer.title = title;
			viewer.description = description;
		}
	}

	$setBadge(treeViewId: string, badge: IViewBadge | undefined): void {
		this.logService.trace('MainThreadTreeViews#$setBadge', treeViewId, badge?.value, badge?.tooltip);

		const viewer = this.getTreeView(treeViewId);
		if (viewer) {
			viewer.badge = badge;
		}
	}

	$resolveDropFileData(destinationViewId: string, requestId: number, dataItemId: string): Promise<VSBuffer> {
		const controller = this._dndControllers.get(destinationViewId);
		if (!controller) {
			throw new Error('Unknown tree');
		}
		return controller.resolveDropFileData(requestId, dataItemId);
	}

	public async $disposeTree(treeViewId: string): Promise<void> {
		const viewer = this.getTreeView(treeViewId);
		if (viewer) {
			viewer.dataProvider = undefined;
		}

		this._dataProviders.deleteAndDispose(treeViewId);
	}

	private async reveal(treeView: ITreeView, dataProvider: TreeViewDataProvider, itemIn: ITreeItem, parentChain: ITreeItem[], options: IRevealOptions): Promise<void> {
		options = options ? options : { select: false, focus: false };
		const select = isUndefinedOrNull(options.select) ? false : options.select;
		const focus = isUndefinedOrNull(options.focus) ? false : options.focus;
		let expand = Math.min(isNumber(options.expand) ? options.expand : options.expand === true ? 1 : 0, 3);

		if (dataProvider.isEmpty()) {
			// Refresh if empty
			await treeView.refresh();
		}
		for (const parent of parentChain) {
			const parentItem = dataProvider.getItem(parent.handle);
			if (parentItem) {
				await treeView.expand(parentItem);
			}
		}
		const item = dataProvider.getItem(itemIn.handle);
		if (item) {
			await treeView.reveal(item);
			if (select) {
				treeView.setSelection([item]);
			}
			if (focus === false) {
				treeView.setFocus();
			} else if (focus) {
				treeView.setFocus(item);
			}
			let itemsToExpand = [item];
			for (; itemsToExpand.length > 0 && expand > 0; expand--) {
				await treeView.expand(itemsToExpand);
				itemsToExpand = itemsToExpand.reduce((result, itemValue) => {
					const item = dataProvider.getItem(itemValue.handle);
					if (item && item.children && item.children.length) {
						result.push(...item.children);
					}
					return result;
				}, [] as ITreeItem[]);
			}
		}
	}

	private registerListeners(treeViewId: string, treeView: ITreeView, disposables: DisposableStore): void {
		disposables.add(treeView.onDidExpandItem(item => this._proxy.$setExpanded(treeViewId, item.handle, true)));
		disposables.add(treeView.onDidCollapseItem(item => this._proxy.$setExpanded(treeViewId, item.handle, false)));
		disposables.add(treeView.onDidChangeSelectionAndFocus(items => this._proxy.$setSelectionAndFocus(treeViewId, items.selection.map(({ handle }) => handle), items.focus.handle)));
		disposables.add(treeView.onDidChangeVisibility(isVisible => this._proxy.$setVisible(treeViewId, isVisible)));
		disposables.add(treeView.onDidChangeCheckboxState(items => {
			this._proxy.$changeCheckboxState(treeViewId, <CheckboxUpdate[]>items.map(item => {
				return { treeItemHandle: item.handle, newState: item.checkbox?.isChecked ?? false };
			}));
		}));
	}

	private getTreeView(treeViewId: string): ITreeView | null {
		const viewDescriptor: ITreeViewDescriptor = <ITreeViewDescriptor>Registry.as<IViewsRegistry>(Extensions.ViewsRegistry).getView(treeViewId);
		return viewDescriptor ? viewDescriptor.treeView : null;
	}

	override dispose(): void {
		for (const dataprovider of this._dataProviders) {
			const treeView = this.getTreeView(dataprovider[0]);
			if (treeView) {
				treeView.dataProvider = undefined;
			}
		}
		this._dataProviders.dispose();

		this._dndControllers.clear();

		super.dispose();
	}
}

type TreeItemHandle = string;

class TreeViewDragAndDropController implements ITreeViewDragAndDropController {

	private readonly dataTransfersCache = new DataTransferFileCache();

	constructor(private readonly treeViewId: string,
		readonly dropMimeTypes: string[],
		readonly dragMimeTypes: string[],
		readonly hasWillDrop: boolean,
		private readonly _proxy: ExtHostTreeViewsShape) { }

	async handleDrop(dataTransfer: VSDataTransfer, targetTreeItem: ITreeItem | undefined, token: CancellationToken,
		operationUuid?: string, sourceTreeId?: string, sourceTreeItemHandles?: string[]): Promise<void> {
		const request = this.dataTransfersCache.add(dataTransfer);
		try {
			const dataTransferDto = await typeConvert.DataTransfer.fromList(dataTransfer);
			if (token.isCancellationRequested) {
				return;
			}
			return await this._proxy.$handleDrop(this.treeViewId, request.id, dataTransferDto, targetTreeItem?.handle, token, operationUuid, sourceTreeId, sourceTreeItemHandles);
		} finally {
			request.dispose();
		}
	}

	async handleDrag(sourceTreeItemHandles: string[], operationUuid: string, token: CancellationToken): Promise<VSDataTransfer | undefined> {
		if (!this.hasWillDrop) {
			return;
		}
		const additionalDataTransferDTO = await this._proxy.$handleDrag(this.treeViewId, sourceTreeItemHandles, operationUuid, token);
		if (!additionalDataTransferDTO) {
			return;
		}

		const additionalDataTransfer = new VSDataTransfer();
		additionalDataTransferDTO.items.forEach(([type, item]) => {
			additionalDataTransfer.replace(type, createStringDataTransferItem(item.asString));
		});
		return additionalDataTransfer;
	}

	public resolveDropFileData(requestId: number, dataItemId: string): Promise<VSBuffer> {
		return this.dataTransfersCache.resolveFileData(requestId, dataItemId);
	}
}

class TreeViewDataProvider implements ITreeViewDataProvider {

	private readonly itemsMap: Map<TreeItemHandle, ITreeItem> = new Map<TreeItemHandle, ITreeItem>();
	private hasResolve: Promise<boolean>;

	constructor(private readonly treeViewId: string,
		private readonly _proxy: ExtHostTreeViewsShape,
		private readonly notificationService: INotificationService
	) {
		this.hasResolve = this._proxy.$hasResolve(this.treeViewId);
	}

	async getChildren(treeItem?: ITreeItem): Promise<ITreeItem[] | undefined> {
		const batches = await this.getChildrenBatch(treeItem ? [treeItem] : undefined);
		return batches?.[0];
	}

	getChildrenBatch(treeItems?: ITreeItem[]): Promise<ITreeItem[][] | undefined> {
		if (!treeItems) {
			this.itemsMap.clear();
		}
		return this._proxy.$getChildren(this.treeViewId, treeItems ? treeItems.map(item => item.handle) : undefined)
			.then(
				children => {
					const convertedChildren = this.convertTransferChildren(treeItems ?? [], children);
					return this.postGetChildren(convertedChildren);
				},
				err => {
					// It can happen that a tree view is disposed right as `getChildren` is called. This results in an error because the data provider gets removed.
					// The tree will shortly get cleaned up in this case. We just need to handle the error here.
					if (!NoTreeViewError.is(err)) {
						this.notificationService.error(err);
					}
					return [];
				});
	}

	private convertTransferChildren(parents: ITreeItem[], children: (number | ITreeItem)[][] | undefined) {
		const convertedChildren: (ITreeItem[] | undefined)[] = Array(parents.length);
		if (children) {
			for (const childGroup of children) {
				const childGroupIndex = childGroup[0] as number;
				convertedChildren[childGroupIndex] = childGroup.slice(1) as ITreeItem[];
			}
		}
		return convertedChildren;
	}

	getItemsToRefresh(itemsToRefreshByHandle: { [treeItemHandle: string]: ITreeItem }): { items: ITreeItem[]; checkboxes: ITreeItem[] } {
		const itemsToRefresh: ITreeItem[] = [];
		const checkboxesToRefresh: ITreeItem[] = [];
		if (itemsToRefreshByHandle) {
			for (const newTreeItemHandle of Object.keys(itemsToRefreshByHandle)) {
				const currentTreeItem = this.getItem(newTreeItemHandle);
				if (currentTreeItem) { // Refresh only if the item exists
					const newTreeItem = itemsToRefreshByHandle[newTreeItemHandle];
					if (currentTreeItem.checkbox?.isChecked !== newTreeItem.checkbox?.isChecked) {
						checkboxesToRefresh.push(currentTreeItem);
					}
					// Update the current item with refreshed item
					this.updateTreeItem(currentTreeItem, newTreeItem);
					if (newTreeItemHandle === newTreeItem.handle) {
						itemsToRefresh.push(currentTreeItem);
					} else {
						// Update maps when handle is changed and refresh parent
						this.itemsMap.delete(newTreeItemHandle);
						this.itemsMap.set(currentTreeItem.handle, currentTreeItem);
						const parent = newTreeItem.parentHandle ? this.itemsMap.get(newTreeItem.parentHandle) : null;
						if (parent) {
							itemsToRefresh.push(parent);
						}
					}
				}
			}
		}
		return { items: itemsToRefresh, checkboxes: checkboxesToRefresh };
	}

	getItem(treeItemHandle: string): ITreeItem | undefined {
		return this.itemsMap.get(treeItemHandle);
	}

	isEmpty(): boolean {
		return this.itemsMap.size === 0;
	}

	private async postGetChildren(elementGroups: (ITreeItem[] | undefined)[] | undefined): Promise<ResolvableTreeItem[][] | undefined> {
		if (elementGroups === undefined) {
			return undefined;
		}
		const resultGroups: ResolvableTreeItem[][] = [];
		const hasResolve = await this.hasResolve;
		if (elementGroups) {
			for (const elements of elementGroups) {
				const result: ResolvableTreeItem[] = [];
				resultGroups.push(result);
				if (!elements) {
					continue;
				}
				for (const element of elements) {
					const resolvable = new ResolvableTreeItem(element, hasResolve ? (token) => {
						return this._proxy.$resolve(this.treeViewId, element.handle, token);
					} : undefined);
					this.itemsMap.set(element.handle, resolvable);
					result.push(resolvable);
				}
			}
		}
		return resultGroups;
	}

	private updateTreeItem(current: ITreeItem, treeItem: ITreeItem): void {
		treeItem.children = treeItem.children ? treeItem.children : undefined;
		if (current) {
			const properties = distinct([...Object.keys(current instanceof ResolvableTreeItem ? current.asTreeItem() : current),
			...Object.keys(treeItem)]);
			for (const property of properties) {
				(current as unknown as { [key: string]: unknown })[property] = (treeItem as unknown as { [key: string]: unknown })[property];
			}
			if (current instanceof ResolvableTreeItem) {
				current.resetResolve();
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadTunnelService.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadTunnelService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../nls.js';
import { MainThreadTunnelServiceShape, MainContext, ExtHostContext, ExtHostTunnelServiceShape, CandidatePortSource, PortAttributesSelector, TunnelDto } from '../common/extHost.protocol.js';
import { TunnelDtoConverter } from '../common/extHostTunnelService.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { IRemoteExplorerService, PORT_AUTO_FORWARD_SETTING, PORT_AUTO_SOURCE_SETTING, PORT_AUTO_SOURCE_SETTING_HYBRID, PORT_AUTO_SOURCE_SETTING_OUTPUT, PortsEnablement } from '../../services/remote/common/remoteExplorerService.js';
import { ITunnelProvider, ITunnelService, TunnelCreationOptions, TunnelProviderFeatures, TunnelOptions, RemoteTunnel, ProvidedPortAttributes, PortAttributesProvider, TunnelProtocol } from '../../../platform/tunnel/common/tunnel.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import type { TunnelDescription } from '../../../platform/remote/common/remoteAuthorityResolver.js';
import { INotificationService, Severity } from '../../../platform/notification/common/notification.js';
import { IConfigurationService } from '../../../platform/configuration/common/configuration.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { IRemoteAgentService } from '../../services/remote/common/remoteAgentService.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { Registry } from '../../../platform/registry/common/platform.js';
import { IConfigurationRegistry, Extensions as ConfigurationExtensions } from '../../../platform/configuration/common/configurationRegistry.js';
import { IContextKeyService } from '../../../platform/contextkey/common/contextkey.js';
import { CandidatePort, TunnelCloseReason, TunnelSource, forwardedPortsFeaturesEnabled, makeAddress } from '../../services/remote/common/tunnelModel.js';

@extHostNamedCustomer(MainContext.MainThreadTunnelService)
export class MainThreadTunnelService extends Disposable implements MainThreadTunnelServiceShape, PortAttributesProvider {
	private readonly _proxy: ExtHostTunnelServiceShape;
	private elevateionRetry: boolean = false;
	private portsAttributesProviders: Map<number, PortAttributesSelector> = new Map();

	constructor(
		extHostContext: IExtHostContext,
		@IRemoteExplorerService private readonly remoteExplorerService: IRemoteExplorerService,
		@ITunnelService private readonly tunnelService: ITunnelService,
		@INotificationService private readonly notificationService: INotificationService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@ILogService private readonly logService: ILogService,
		@IRemoteAgentService private readonly remoteAgentService: IRemoteAgentService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService
	) {
		super();
		this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostTunnelService);
		this._register(tunnelService.onTunnelOpened(() => this._proxy.$onDidTunnelsChange()));
		this._register(tunnelService.onTunnelClosed(() => this._proxy.$onDidTunnelsChange()));
	}

	private processFindingEnabled(): boolean {
		return (!!this.configurationService.getValue(PORT_AUTO_FORWARD_SETTING) || this.tunnelService.hasTunnelProvider)
			&& (this.configurationService.getValue(PORT_AUTO_SOURCE_SETTING) !== PORT_AUTO_SOURCE_SETTING_OUTPUT);
	}

	async $setRemoteTunnelService(processId: number): Promise<void> {
		this.remoteExplorerService.namedProcesses.set(processId, 'Code Extension Host');
		if (this.remoteExplorerService.portsFeaturesEnabled === PortsEnablement.AdditionalFeatures) {
			this._proxy.$registerCandidateFinder(this.processFindingEnabled());
		} else {
			this._register(this.remoteExplorerService.onEnabledPortsFeatures(() => this._proxy.$registerCandidateFinder(this.processFindingEnabled())));
		}
		this._register(this.configurationService.onDidChangeConfiguration(async (e) => {
			if ((this.remoteExplorerService.portsFeaturesEnabled === PortsEnablement.AdditionalFeatures) && (e.affectsConfiguration(PORT_AUTO_FORWARD_SETTING) || e.affectsConfiguration(PORT_AUTO_SOURCE_SETTING))) {
				return this._proxy.$registerCandidateFinder(this.processFindingEnabled());
			}
		}));
		this._register(this.tunnelService.onAddedTunnelProvider(async () => {
			if (this.remoteExplorerService.portsFeaturesEnabled === PortsEnablement.AdditionalFeatures) {
				return this._proxy.$registerCandidateFinder(this.processFindingEnabled());
			}
		}));
	}

	private _alreadyRegistered: boolean = false;
	async $registerPortsAttributesProvider(selector: PortAttributesSelector, providerHandle: number): Promise<void> {
		this.portsAttributesProviders.set(providerHandle, selector);
		if (!this._alreadyRegistered) {
			this.remoteExplorerService.tunnelModel.addAttributesProvider(this);
			this._alreadyRegistered = true;
		}
	}

	async $unregisterPortsAttributesProvider(providerHandle: number): Promise<void> {
		this.portsAttributesProviders.delete(providerHandle);
	}

	async providePortAttributes(ports: number[], pid: number | undefined, commandLine: string | undefined, token: CancellationToken): Promise<ProvidedPortAttributes[]> {
		if (this.portsAttributesProviders.size === 0) {
			return [];
		}

		// Check all the selectors to make sure it's worth going to the extension host.
		const appropriateHandles = Array.from(this.portsAttributesProviders.entries()).filter(entry => {
			const selector = entry[1];
			const portRange = (typeof selector.portRange === 'number') ? [selector.portRange, selector.portRange + 1] : selector.portRange;
			const portInRange = portRange ? ports.some(port => portRange[0] <= port && port < portRange[1]) : true;
			const commandMatches = !selector.commandPattern || (commandLine && (commandLine.match(selector.commandPattern)));
			return portInRange && commandMatches;
		}).map(entry => entry[0]);

		if (appropriateHandles.length === 0) {
			return [];
		}
		return this._proxy.$providePortAttributes(appropriateHandles, ports, pid, commandLine, token);
	}

	async $openTunnel(tunnelOptions: TunnelOptions, source: string): Promise<TunnelDto | undefined> {
		const tunnel = await this.remoteExplorerService.forward({
			remote: tunnelOptions.remoteAddress,
			local: tunnelOptions.localAddressPort,
			name: tunnelOptions.label,
			source: {
				source: TunnelSource.Extension,
				description: source
			},
			elevateIfNeeded: false
		});
		if (!tunnel || (typeof tunnel === 'string')) {
			return undefined;
		}
		if (!this.elevateionRetry
			&& (tunnelOptions.localAddressPort !== undefined)
			&& (tunnel.tunnelLocalPort !== undefined)
			&& this.tunnelService.isPortPrivileged(tunnelOptions.localAddressPort)
			&& (tunnel.tunnelLocalPort !== tunnelOptions.localAddressPort)
			&& this.tunnelService.canElevate) {

			this.elevationPrompt(tunnelOptions, tunnel, source);
		}
		return TunnelDtoConverter.fromServiceTunnel(tunnel);
	}

	private async elevationPrompt(tunnelOptions: TunnelOptions, tunnel: RemoteTunnel, source: string) {
		return this.notificationService.prompt(Severity.Info,
			nls.localize('remote.tunnel.openTunnel', "The extension {0} has forwarded port {1}. You'll need to run as superuser to use port {2} locally.", source, tunnelOptions.remoteAddress.port, tunnelOptions.localAddressPort),
			[{
				label: nls.localize('remote.tunnelsView.elevationButton', "Use Port {0} as Sudo...", tunnel.tunnelRemotePort),
				run: async () => {
					this.elevateionRetry = true;
					await this.remoteExplorerService.close({ host: tunnel.tunnelRemoteHost, port: tunnel.tunnelRemotePort }, TunnelCloseReason.Other);
					await this.remoteExplorerService.forward({
						remote: tunnelOptions.remoteAddress,
						local: tunnelOptions.localAddressPort,
						name: tunnelOptions.label,
						source: {
							source: TunnelSource.Extension,
							description: source
						},
						elevateIfNeeded: true
					});
					this.elevateionRetry = false;
				}
			}]);
	}

	async $closeTunnel(remote: { host: string; port: number }): Promise<void> {
		return this.remoteExplorerService.close(remote, TunnelCloseReason.Other);
	}

	async $getTunnels(): Promise<TunnelDescription[]> {
		return (await this.tunnelService.tunnels).map(tunnel => {
			return {
				remoteAddress: { port: tunnel.tunnelRemotePort, host: tunnel.tunnelRemoteHost },
				localAddress: tunnel.localAddress,
				privacy: tunnel.privacy,
				protocol: tunnel.protocol
			};
		});
	}

	async $onFoundNewCandidates(candidates: CandidatePort[]): Promise<void> {
		this.remoteExplorerService.onFoundNewCandidates(candidates);
	}

	async $setTunnelProvider(features: TunnelProviderFeatures | undefined, isResolver: boolean): Promise<void> {
		const tunnelProvider: ITunnelProvider = {
			forwardPort: (tunnelOptions: TunnelOptions, tunnelCreationOptions: TunnelCreationOptions) => {
				const forward = this._proxy.$forwardPort(tunnelOptions, tunnelCreationOptions);
				return forward.then(tunnelOrError => {
					if (!tunnelOrError) {
						return undefined;
					} else if (typeof tunnelOrError === 'string') {
						return tunnelOrError;
					}
					const tunnel = tunnelOrError;
					this.logService.trace(`ForwardedPorts: (MainThreadTunnelService) New tunnel established by tunnel provider: ${tunnel?.remoteAddress.host}:${tunnel?.remoteAddress.port}`);

					return {
						tunnelRemotePort: tunnel.remoteAddress.port,
						tunnelRemoteHost: tunnel.remoteAddress.host,
						localAddress: typeof tunnel.localAddress === 'string' ? tunnel.localAddress : makeAddress(tunnel.localAddress.host, tunnel.localAddress.port),
						tunnelLocalPort: typeof tunnel.localAddress !== 'string' ? tunnel.localAddress.port : undefined,
						public: tunnel.public,
						privacy: tunnel.privacy,
						protocol: tunnel.protocol ?? TunnelProtocol.Http,
						dispose: async (silent?: boolean) => {
							this.logService.trace(`ForwardedPorts: (MainThreadTunnelService) Closing tunnel from tunnel provider: ${tunnel?.remoteAddress.host}:${tunnel?.remoteAddress.port}`);
							return this._proxy.$closeTunnel({ host: tunnel.remoteAddress.host, port: tunnel.remoteAddress.port }, silent);
						}
					};
				});
			}
		};
		if (features) {
			this.tunnelService.setTunnelFeatures(features);
		}
		this.tunnelService.setTunnelProvider(tunnelProvider);
		// At this point we clearly want the ports view/features since we have a tunnel factory
		if (isResolver) {
			this.contextKeyService.createKey(forwardedPortsFeaturesEnabled.key, true);
		}
	}

	async $hasTunnelProvider(): Promise<boolean> {
		return this.tunnelService.hasTunnelProvider;
	}

	async $setCandidateFilter(): Promise<void> {
		this.remoteExplorerService.setCandidateFilter((candidates: CandidatePort[]): Promise<CandidatePort[]> => {
			return this._proxy.$applyCandidateFilter(candidates);
		});
	}

	async $setCandidatePortSource(source: CandidatePortSource): Promise<void> {
		// Must wait for the remote environment before trying to set settings there.
		this.remoteAgentService.getEnvironment().then(() => {
			switch (source) {
				case CandidatePortSource.None: {
					Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration)
						.registerDefaultConfigurations([{ overrides: { 'remote.autoForwardPorts': false } }]);
					break;
				}
				case CandidatePortSource.Output: {
					Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration)
						.registerDefaultConfigurations([{ overrides: { 'remote.autoForwardPortsSource': PORT_AUTO_SOURCE_SETTING_OUTPUT } }]);
					break;
				}
				case CandidatePortSource.Hybrid: {
					Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration)
						.registerDefaultConfigurations([{ overrides: { 'remote.autoForwardPortsSource': PORT_AUTO_SOURCE_SETTING_HYBRID } }]);
					break;
				}
				default: // Do nothing, the defaults for these settings should be used.
			}
		}).catch(() => {
			// The remote failed to get setup. Errors from that area will already be surfaced to the user.
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadUriOpeners.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadUriOpeners.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Action } from '../../../base/common/actions.js';
import { isCancellationError } from '../../../base/common/errors.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { Schemas } from '../../../base/common/network.js';
import { URI } from '../../../base/common/uri.js';
import { localize } from '../../../nls.js';
import { ExtensionIdentifier } from '../../../platform/extensions/common/extensions.js';
import { INotificationService, Severity } from '../../../platform/notification/common/notification.js';
import { IOpenerService } from '../../../platform/opener/common/opener.js';
import { IStorageService } from '../../../platform/storage/common/storage.js';
import { ExtHostContext, ExtHostUriOpenersShape, MainContext, MainThreadUriOpenersShape } from '../common/extHost.protocol.js';
import { defaultExternalUriOpenerId } from '../../contrib/externalUriOpener/common/configuration.js';
import { ContributedExternalUriOpenersStore } from '../../contrib/externalUriOpener/common/contributedOpeners.js';
import { IExternalOpenerProvider, IExternalUriOpener, IExternalUriOpenerService } from '../../contrib/externalUriOpener/common/externalUriOpenerService.js';
import { IExtensionService } from '../../services/extensions/common/extensions.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';

interface RegisteredOpenerMetadata {
	readonly schemes: ReadonlySet<string>;
	readonly extensionId: ExtensionIdentifier;
	readonly label: string;
}

@extHostNamedCustomer(MainContext.MainThreadUriOpeners)
export class MainThreadUriOpeners extends Disposable implements MainThreadUriOpenersShape, IExternalOpenerProvider {

	private readonly proxy: ExtHostUriOpenersShape;
	private readonly _registeredOpeners = new Map<string, RegisteredOpenerMetadata>();
	private readonly _contributedExternalUriOpenersStore: ContributedExternalUriOpenersStore;

	constructor(
		context: IExtHostContext,
		@IStorageService storageService: IStorageService,
		@IExternalUriOpenerService externalUriOpenerService: IExternalUriOpenerService,
		@IExtensionService private readonly extensionService: IExtensionService,
		@IOpenerService private readonly openerService: IOpenerService,
		@INotificationService private readonly notificationService: INotificationService,
	) {
		super();
		this.proxy = context.getProxy(ExtHostContext.ExtHostUriOpeners);

		this._register(externalUriOpenerService.registerExternalOpenerProvider(this));

		this._contributedExternalUriOpenersStore = this._register(new ContributedExternalUriOpenersStore(storageService, extensionService));
	}

	public async *getOpeners(targetUri: URI): AsyncIterable<IExternalUriOpener> {

		// Currently we only allow openers for http and https urls
		if (targetUri.scheme !== Schemas.http && targetUri.scheme !== Schemas.https) {
			return;
		}

		await this.extensionService.activateByEvent(`onOpenExternalUri:${targetUri.scheme}`);

		for (const [id, openerMetadata] of this._registeredOpeners) {
			if (openerMetadata.schemes.has(targetUri.scheme)) {
				yield this.createOpener(id, openerMetadata);
			}
		}
	}

	private createOpener(id: string, metadata: RegisteredOpenerMetadata): IExternalUriOpener {
		return {
			id: id,
			label: metadata.label,
			canOpen: (uri, token) => {
				return this.proxy.$canOpenUri(id, uri, token);
			},
			openExternalUri: async (uri, ctx, token) => {
				try {
					await this.proxy.$openUri(id, { resolvedUri: uri, sourceUri: ctx.sourceUri }, token);
				} catch (e) {
					if (!isCancellationError(e)) {
						const openDefaultAction = new Action('default', localize('openerFailedUseDefault', "Open using default opener"), undefined, undefined, async () => {
							await this.openerService.open(uri, {
								allowTunneling: false,
								allowContributedOpeners: defaultExternalUriOpenerId,
							});
						});
						openDefaultAction.tooltip = uri.toString();

						this.notificationService.notify({
							severity: Severity.Error,
							message: localize({
								key: 'openerFailedMessage',
								comment: ['{0} is the id of the opener. {1} is the url being opened.'],
							}, 'Could not open uri with \'{0}\': {1}', id, e.toString()),
							actions: {
								primary: [
									openDefaultAction
								]
							}
						});
					}
				}
				return true;
			},
		};
	}

	async $registerUriOpener(
		id: string,
		schemes: readonly string[],
		extensionId: ExtensionIdentifier,
		label: string,
	): Promise<void> {
		if (this._registeredOpeners.has(id)) {
			throw new Error(`Opener with id '${id}' already registered`);
		}

		this._registeredOpeners.set(id, {
			schemes: new Set(schemes),
			label,
			extensionId,
		});

		this._contributedExternalUriOpenersStore.didRegisterOpener(id, extensionId.value);
	}

	async $unregisterUriOpener(id: string): Promise<void> {
		this._registeredOpeners.delete(id);
		this._contributedExternalUriOpenersStore.delete(id);
	}

	override dispose(): void {
		super.dispose();
		this._registeredOpeners.clear();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadUrls.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadUrls.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ExtHostContext, MainContext, MainThreadUrlsShape, ExtHostUrlsShape } from '../common/extHost.protocol.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { IURLService, IOpenURLOptions } from '../../../platform/url/common/url.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { Disposable, IDisposable } from '../../../base/common/lifecycle.js';
import { IExtensionContributedURLHandler, IExtensionUrlHandler } from '../../services/extensions/browser/extensionUrlHandler.js';
import { ExtensionIdentifier } from '../../../platform/extensions/common/extensions.js';
import { ITrustedDomainService } from '../../contrib/url/browser/trustedDomainService.js';

class ExtensionUrlHandler implements IExtensionContributedURLHandler {

	constructor(
		private readonly proxy: ExtHostUrlsShape,
		private readonly handle: number,
		readonly extensionId: ExtensionIdentifier,
		readonly extensionDisplayName: string
	) { }

	async handleURL(uri: URI, options?: IOpenURLOptions): Promise<boolean> {
		if (!ExtensionIdentifier.equals(this.extensionId, uri.authority)) {
			return false;
		}

		await this.proxy.$handleExternalUri(this.handle, uri);
		return true;
	}
}

@extHostNamedCustomer(MainContext.MainThreadUrls)
export class MainThreadUrls extends Disposable implements MainThreadUrlsShape {

	private readonly proxy: ExtHostUrlsShape;
	private readonly handlers = new Map<number, { extensionId: ExtensionIdentifier; disposable: IDisposable }>();

	constructor(
		context: IExtHostContext,
		@ITrustedDomainService trustedDomainService: ITrustedDomainService,
		@IURLService private readonly urlService: IURLService,
		@IExtensionUrlHandler private readonly extensionUrlHandler: IExtensionUrlHandler
	) {
		super();

		this.proxy = context.getProxy(ExtHostContext.ExtHostUrls);
	}

	async $registerUriHandler(handle: number, extensionId: ExtensionIdentifier, extensionDisplayName: string): Promise<void> {
		const handler = new ExtensionUrlHandler(this.proxy, handle, extensionId, extensionDisplayName);
		const disposable = this.urlService.registerHandler(handler);

		this.handlers.set(handle, { extensionId, disposable });
		this.extensionUrlHandler.registerExtensionHandler(extensionId, handler);

		return undefined;
	}

	async $unregisterUriHandler(handle: number): Promise<void> {
		const tuple = this.handlers.get(handle);

		if (!tuple) {
			return undefined;
		}

		const { extensionId, disposable } = tuple;

		this.extensionUrlHandler.unregisterExtensionHandler(extensionId);
		this.handlers.delete(handle);
		disposable.dispose();

		return undefined;
	}

	async $createAppUri(uri: UriComponents): Promise<URI> {
		return this.urlService.create(uri);
	}

	override dispose(): void {
		super.dispose();

		this.handlers.forEach(({ disposable }) => disposable.dispose());
		this.handlers.clear();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadWebviewManager.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadWebviewManager.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../base/common/lifecycle.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';
import { MainThreadCustomEditors } from './mainThreadCustomEditors.js';
import { MainThreadWebviewPanels } from './mainThreadWebviewPanels.js';
import { MainThreadWebviews } from './mainThreadWebviews.js';
import { MainThreadWebviewsViews } from './mainThreadWebviewViews.js';
import * as extHostProtocol from '../common/extHost.protocol.js';
import { extHostCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { MainThreadChatOutputRenderer } from './mainThreadChatOutputRenderer.js';

@extHostCustomer
export class MainThreadWebviewManager extends Disposable {
	constructor(
		context: IExtHostContext,
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		super();

		const webviews = this._register(instantiationService.createInstance(MainThreadWebviews, context));
		context.set(extHostProtocol.MainContext.MainThreadWebviews, webviews);

		const webviewPanels = this._register(instantiationService.createInstance(MainThreadWebviewPanels, context, webviews));
		context.set(extHostProtocol.MainContext.MainThreadWebviewPanels, webviewPanels);

		const customEditors = this._register(instantiationService.createInstance(MainThreadCustomEditors, context, webviews, webviewPanels));
		context.set(extHostProtocol.MainContext.MainThreadCustomEditors, customEditors);

		const webviewViews = this._register(instantiationService.createInstance(MainThreadWebviewsViews, context, webviews));
		context.set(extHostProtocol.MainContext.MainThreadWebviewViews, webviewViews);

		const chatOutputRenderers = this._register(instantiationService.createInstance(MainThreadChatOutputRenderer, context, webviews));
		context.set(extHostProtocol.MainContext.MainThreadChatOutputRenderer, chatOutputRenderers);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadWebviewPanels.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadWebviewPanels.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { onUnexpectedError } from '../../../base/common/errors.js';
import { Event } from '../../../base/common/event.js';
import { Disposable, DisposableMap } from '../../../base/common/lifecycle.js';
import { URI } from '../../../base/common/uri.js';
import { generateUuid } from '../../../base/common/uuid.js';
import { IConfigurationService } from '../../../platform/configuration/common/configuration.js';
import { IStorageService } from '../../../platform/storage/common/storage.js';
import { DiffEditorInput } from '../../common/editor/diffEditorInput.js';
import { EditorInput } from '../../common/editor/editorInput.js';
import { ExtensionKeyedWebviewOriginStore, WebviewOptions } from '../../contrib/webview/browser/webview.js';
import { WebviewIconPath, WebviewInput } from '../../contrib/webviewPanel/browser/webviewEditorInput.js';
import { IWebViewShowOptions, IWebviewWorkbenchService } from '../../contrib/webviewPanel/browser/webviewWorkbenchService.js';
import { editorGroupToColumn } from '../../services/editor/common/editorGroupColumn.js';
import { GroupLocation, GroupsOrder, IEditorGroup, IEditorGroupsService, preferredSideBySideGroupDirection } from '../../services/editor/common/editorGroupsService.js';
import { ACTIVE_GROUP, IEditorService, PreferredGroup, SIDE_GROUP } from '../../services/editor/common/editorService.js';
import { IExtensionService } from '../../services/extensions/common/extensions.js';
import { IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import * as extHostProtocol from '../common/extHost.protocol.js';
import { MainThreadWebviews, reviveWebviewContentOptions, reviveWebviewExtension } from './mainThreadWebviews.js';
import { ThemeIcon } from '../../../base/common/themables.js';

/**
 * Bi-directional map between webview handles and inputs.
 */
class WebviewInputStore {
	private readonly _handlesToInputs = new Map<string, WebviewInput>();
	private readonly _inputsToHandles = new Map<WebviewInput, string>();

	public add(handle: string, input: WebviewInput): void {
		this._handlesToInputs.set(handle, input);
		this._inputsToHandles.set(input, handle);
	}

	public getHandleForInput(input: WebviewInput): string | undefined {
		return this._inputsToHandles.get(input);
	}

	public getInputForHandle(handle: string): WebviewInput | undefined {
		return this._handlesToInputs.get(handle);
	}

	public delete(handle: string): void {
		const input = this.getInputForHandle(handle);
		this._handlesToInputs.delete(handle);
		if (input) {
			this._inputsToHandles.delete(input);
		}
	}

	public get size(): number {
		return this._handlesToInputs.size;
	}

	[Symbol.iterator](): Iterator<WebviewInput> {
		return this._handlesToInputs.values();
	}
}

class WebviewViewTypeTransformer {
	public constructor(
		public readonly prefix: string,
	) { }

	public fromExternal(viewType: string): string {
		return this.prefix + viewType;
	}

	public toExternal(viewType: string): string | undefined {
		return viewType.startsWith(this.prefix)
			? viewType.substr(this.prefix.length)
			: undefined;
	}
}

export class MainThreadWebviewPanels extends Disposable implements extHostProtocol.MainThreadWebviewPanelsShape {

	private readonly webviewPanelViewType = new WebviewViewTypeTransformer('mainThreadWebview-');

	private readonly _proxy: extHostProtocol.ExtHostWebviewPanelsShape;

	private readonly _webviewInputs = new WebviewInputStore();

	private readonly _revivers = this._register(new DisposableMap<string>());

	private readonly webviewOriginStore: ExtensionKeyedWebviewOriginStore;

	constructor(
		context: IExtHostContext,
		private readonly _mainThreadWebviews: MainThreadWebviews,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IEditorGroupsService private readonly _editorGroupService: IEditorGroupsService,
		@IEditorService private readonly _editorService: IEditorService,
		@IExtensionService extensionService: IExtensionService,
		@IStorageService storageService: IStorageService,
		@IWebviewWorkbenchService private readonly _webviewWorkbenchService: IWebviewWorkbenchService,
	) {
		super();

		this.webviewOriginStore = new ExtensionKeyedWebviewOriginStore('mainThreadWebviewPanel.origins', storageService);

		this._proxy = context.getProxy(extHostProtocol.ExtHostContext.ExtHostWebviewPanels);

		this._register(Event.any(
			_editorService.onDidActiveEditorChange,
			_editorService.onDidVisibleEditorsChange,
			_editorGroupService.onDidAddGroup,
			_editorGroupService.onDidRemoveGroup,
			_editorGroupService.onDidMoveGroup,
		)(() => {
			this.updateWebviewViewStates(this._editorService.activeEditor);
		}));

		this._register(_webviewWorkbenchService.onDidChangeActiveWebviewEditor(input => {
			this.updateWebviewViewStates(input);
		}));

		// This reviver's only job is to activate extensions.
		// This should trigger the real reviver to be registered from the extension host side.
		this._register(_webviewWorkbenchService.registerResolver({
			canResolve: (webview: WebviewInput) => {
				const viewType = this.webviewPanelViewType.toExternal(webview.viewType);
				if (typeof viewType === 'string') {
					extensionService.activateByEvent(`onWebviewPanel:${viewType}`);
				}
				return false;
			},
			resolveWebview: () => { throw new Error('not implemented'); }
		}));
	}

	public get webviewInputs(): Iterable<WebviewInput> { return this._webviewInputs; }

	public addWebviewInput(handle: extHostProtocol.WebviewHandle, input: WebviewInput, options: { serializeBuffersForPostMessage: boolean }): void {
		this._webviewInputs.add(handle, input);
		this._mainThreadWebviews.addWebview(handle, input.webview, options);

		const disposeSub = input.webview.onDidDispose(() => {
			disposeSub.dispose();

			this._proxy.$onDidDisposeWebviewPanel(handle).finally(() => {
				this._webviewInputs.delete(handle);
			});
		});
	}

	public $createWebviewPanel(
		extensionData: extHostProtocol.WebviewExtensionDescription,
		handle: extHostProtocol.WebviewHandle,
		viewType: string,
		initData: extHostProtocol.IWebviewInitData,
		showOptions: extHostProtocol.WebviewPanelShowOptions,
	): void {
		const targetGroup = this.getTargetGroupFromShowOptions(showOptions);
		const mainThreadShowOptions: IWebViewShowOptions = showOptions ? {
			preserveFocus: !!showOptions.preserveFocus,
			group: targetGroup
		} : {};

		const extension = reviveWebviewExtension(extensionData);
		const origin = this.webviewOriginStore.getOrigin(viewType, extension.id);

		const webview = this._webviewWorkbenchService.openWebview({
			origin,
			providedViewType: viewType,
			title: initData.title,
			options: reviveWebviewOptions(initData.panelOptions),
			contentOptions: reviveWebviewContentOptions(initData.webviewOptions),
			extension
		}, this.webviewPanelViewType.fromExternal(viewType), initData.title, undefined, mainThreadShowOptions);

		this.addWebviewInput(handle, webview, { serializeBuffersForPostMessage: initData.serializeBuffersForPostMessage });
	}

	public $disposeWebview(handle: extHostProtocol.WebviewHandle): void {
		const webview = this.tryGetWebviewInput(handle);
		if (!webview) {
			return;
		}
		webview.dispose();
	}

	public $setTitle(handle: extHostProtocol.WebviewHandle, value: string): void {
		this.tryGetWebviewInput(handle)?.setWebviewTitle(value);
	}

	public $setIconPath(handle: extHostProtocol.WebviewHandle, value: extHostProtocol.IWebviewIconPath | undefined): void {
		const webview = this.tryGetWebviewInput(handle);
		if (webview) {
			webview.iconPath = reviveWebviewIcon(value);
		}
	}

	public $reveal(handle: extHostProtocol.WebviewHandle, showOptions: extHostProtocol.WebviewPanelShowOptions): void {
		const webview = this.tryGetWebviewInput(handle);
		if (!webview || webview.isDisposed()) {
			return;
		}

		const targetGroup = this.getTargetGroupFromShowOptions(showOptions);
		this._webviewWorkbenchService.revealWebview(webview, targetGroup, !!showOptions.preserveFocus);
	}

	private getTargetGroupFromShowOptions(showOptions: extHostProtocol.WebviewPanelShowOptions): PreferredGroup {
		if (typeof showOptions.viewColumn === 'undefined'
			|| showOptions.viewColumn === ACTIVE_GROUP
			|| (this._editorGroupService.count === 1 && this._editorGroupService.activeGroup.isEmpty)
		) {
			return ACTIVE_GROUP;
		}

		if (showOptions.viewColumn === SIDE_GROUP) {
			return SIDE_GROUP;
		}

		if (showOptions.viewColumn >= 0) {
			// First check to see if an existing group exists
			const groupInColumn = this._editorGroupService.getGroups(GroupsOrder.GRID_APPEARANCE)[showOptions.viewColumn];
			if (groupInColumn) {
				return groupInColumn.id;
			}

			// We are dealing with an unknown group and therefore need a new group.
			// Note that the new group's id may not match the one requested. We only allow
			// creating a single new group, so if someone passes in `showOptions.viewColumn = 99`
			// and there are two editor groups open, we simply create a third editor group instead
			// of creating all the groups up to 99.
			const newGroup = this._editorGroupService.findGroup({ location: GroupLocation.LAST });
			if (newGroup) {
				const direction = preferredSideBySideGroupDirection(this._configurationService);
				return this._editorGroupService.addGroup(newGroup, direction);
			}
		}

		return ACTIVE_GROUP;
	}

	public $registerSerializer(viewType: string, options: { serializeBuffersForPostMessage: boolean }): void {
		if (this._revivers.has(viewType)) {
			throw new Error(`Reviver for ${viewType} already registered`);
		}

		this._revivers.set(viewType, this._webviewWorkbenchService.registerResolver({
			canResolve: (webviewInput) => {
				return webviewInput.viewType === this.webviewPanelViewType.fromExternal(viewType);
			},
			resolveWebview: async (webviewInput): Promise<void> => {
				const viewType = this.webviewPanelViewType.toExternal(webviewInput.viewType);
				if (!viewType) {
					webviewInput.webview.setHtml(this._mainThreadWebviews.getWebviewResolvedFailedContent(webviewInput.viewType));
					return;
				}

				const handle = generateUuid();

				this.addWebviewInput(handle, webviewInput, options);

				let state = undefined;
				if (webviewInput.webview.state) {
					try {
						state = JSON.parse(webviewInput.webview.state);
					} catch (e) {
						console.error('Could not load webview state', e, webviewInput.webview.state);
					}
				}

				try {
					await this._proxy.$deserializeWebviewPanel(handle, viewType, {
						title: webviewInput.getTitle(),
						state,
						panelOptions: webviewInput.webview.options,
						webviewOptions: webviewInput.webview.contentOptions,
						active: webviewInput === this._editorService.activeEditor,
					}, editorGroupToColumn(this._editorGroupService, webviewInput.group || 0));
				} catch (error) {
					onUnexpectedError(error);
					webviewInput.webview.setHtml(this._mainThreadWebviews.getWebviewResolvedFailedContent(viewType));
				}
			}
		}));
	}

	public $unregisterSerializer(viewType: string): void {
		if (!this._revivers.has(viewType)) {
			throw new Error(`No reviver for ${viewType} registered`);
		}

		this._revivers.deleteAndDispose(viewType);
	}

	private updateWebviewViewStates(activeEditorInput: EditorInput | undefined) {
		if (!this._webviewInputs.size) {
			return;
		}

		const viewStates: extHostProtocol.WebviewPanelViewStateData = {};

		const updateViewStatesForInput = (group: IEditorGroup, topLevelInput: EditorInput, editorInput: EditorInput) => {
			if (!(editorInput instanceof WebviewInput)) {
				return;
			}

			editorInput.updateGroup(group.id);

			const handle = this._webviewInputs.getHandleForInput(editorInput);
			if (handle) {
				viewStates[handle] = {
					visible: topLevelInput === group.activeEditor,
					active: editorInput === activeEditorInput,
					position: editorGroupToColumn(this._editorGroupService, group.id),
				};
			}
		};

		for (const group of this._editorGroupService.groups) {
			for (const input of group.editors) {
				if (input instanceof DiffEditorInput) {
					updateViewStatesForInput(group, input, input.primary);
					updateViewStatesForInput(group, input, input.secondary);
				} else {
					updateViewStatesForInput(group, input, input);
				}
			}
		}

		if (Object.keys(viewStates).length) {
			this._proxy.$onDidChangeWebviewPanelViewStates(viewStates);
		}
	}

	private tryGetWebviewInput(handle: extHostProtocol.WebviewHandle): WebviewInput | undefined {
		return this._webviewInputs.getInputForHandle(handle);
	}
}

function reviveWebviewIcon(value: extHostProtocol.IWebviewIconPath | undefined): WebviewIconPath | undefined {
	if (!value) {
		return undefined;
	}

	if (ThemeIcon.isThemeIcon(value)) {
		return value;
	}

	return {
		light: URI.revive(value.light),
		dark: URI.revive(value.dark),
	};
}

function reviveWebviewOptions(panelOptions: extHostProtocol.IWebviewPanelOptions): WebviewOptions {
	return {
		enableFindWidget: panelOptions.enableFindWidget,
		retainContextWhenHidden: panelOptions.retainContextWhenHidden,
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadWebviews.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadWebviews.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../base/common/buffer.js';
import { Disposable, DisposableStore } from '../../../base/common/lifecycle.js';
import { Schemas } from '../../../base/common/network.js';
import { isWeb } from '../../../base/common/platform.js';
import { escape } from '../../../base/common/strings.js';
import { URI } from '../../../base/common/uri.js';
import { localize } from '../../../nls.js';
import { ExtensionIdentifier } from '../../../platform/extensions/common/extensions.js';
import { IOpenerService } from '../../../platform/opener/common/opener.js';
import { IProductService } from '../../../platform/product/common/productService.js';
import { IWebview, WebviewContentOptions, WebviewExtensionDescription } from '../../contrib/webview/browser/webview.js';
import { IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { SerializableObjectWithBuffers } from '../../services/extensions/common/proxyIdentifier.js';
import * as extHostProtocol from '../common/extHost.protocol.js';
import { deserializeWebviewMessage, serializeWebviewMessage } from '../common/extHostWebviewMessaging.js';

export class MainThreadWebviews extends Disposable implements extHostProtocol.MainThreadWebviewsShape {

	private static readonly standardSupportedLinkSchemes = new Set([
		Schemas.http,
		Schemas.https,
		Schemas.mailto,
		Schemas.vscode,
		'vscode-insider',
	]);

	private readonly _proxy: extHostProtocol.ExtHostWebviewsShape;

	private readonly _webviews = new Map<string, IWebview>();

	constructor(
		context: IExtHostContext,
		@IOpenerService private readonly _openerService: IOpenerService,
		@IProductService private readonly _productService: IProductService,
	) {
		super();

		this._proxy = context.getProxy(extHostProtocol.ExtHostContext.ExtHostWebviews);
	}

	public addWebview(handle: extHostProtocol.WebviewHandle, webview: IWebview, options: { serializeBuffersForPostMessage: boolean }): void {
		if (this._webviews.has(handle)) {
			throw new Error('Webview already registered');
		}

		this._webviews.set(handle, webview);
		this.hookupWebviewEventDelegate(handle, webview, options);
	}

	public $setHtml(handle: extHostProtocol.WebviewHandle, value: string): void {
		this.tryGetWebview(handle)?.setHtml(value);
	}

	public $setOptions(handle: extHostProtocol.WebviewHandle, options: extHostProtocol.IWebviewContentOptions): void {
		const webview = this.tryGetWebview(handle);
		if (webview) {
			webview.contentOptions = reviveWebviewContentOptions(options);
		}
	}

	public async $postMessage(handle: extHostProtocol.WebviewHandle, jsonMessage: string, ...buffers: VSBuffer[]): Promise<boolean> {
		const webview = this.tryGetWebview(handle);
		if (!webview) {
			return false;
		}
		const { message, arrayBuffers } = deserializeWebviewMessage(jsonMessage, buffers);
		return webview.postMessage(message, arrayBuffers);
	}

	private hookupWebviewEventDelegate(handle: extHostProtocol.WebviewHandle, webview: IWebview, options: { serializeBuffersForPostMessage: boolean }) {
		const disposables = new DisposableStore();

		disposables.add(webview.onDidClickLink((uri) => this.onDidClickLink(handle, uri)));

		disposables.add(webview.onMessage((message) => {
			const serialized = serializeWebviewMessage(message.message, options);
			this._proxy.$onMessage(handle, serialized.message, new SerializableObjectWithBuffers(serialized.buffers));
		}));

		disposables.add(webview.onMissingCsp((extension: ExtensionIdentifier) => this._proxy.$onMissingCsp(handle, extension.value)));

		disposables.add(webview.onDidDispose(() => {
			disposables.dispose();
			this._webviews.delete(handle);
		}));
	}

	private onDidClickLink(handle: extHostProtocol.WebviewHandle, link: string): void {
		const webview = this.getWebview(handle);
		if (this.isSupportedLink(webview, URI.parse(link))) {
			this._openerService.open(link, { fromUserGesture: true, allowContributedOpeners: true, allowCommands: Array.isArray(webview.contentOptions.enableCommandUris) || webview.contentOptions.enableCommandUris === true, fromWorkspace: true });
		}
	}

	private isSupportedLink(webview: IWebview, link: URI): boolean {
		if (MainThreadWebviews.standardSupportedLinkSchemes.has(link.scheme)) {
			return true;
		}

		if (!isWeb && this._productService.urlProtocol === link.scheme) {
			return true;
		}

		if (link.scheme === Schemas.command) {
			if (Array.isArray(webview.contentOptions.enableCommandUris)) {
				return webview.contentOptions.enableCommandUris.includes(link.path);
			}

			return webview.contentOptions.enableCommandUris === true;
		}

		return false;
	}

	private tryGetWebview(handle: extHostProtocol.WebviewHandle): IWebview | undefined {
		return this._webviews.get(handle);
	}

	private getWebview(handle: extHostProtocol.WebviewHandle): IWebview {
		const webview = this.tryGetWebview(handle);
		if (!webview) {
			throw new Error(`Unknown webview handle:${handle}`);
		}
		return webview;
	}

	public getWebviewResolvedFailedContent(viewType: string) {
		return `<!DOCTYPE html>
		<html>
			<head>
				<meta http-equiv="Content-type" content="text/html;charset=UTF-8">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none';">
			</head>
			<body>${localize('errorMessage', "An error occurred while loading view: {0}", escape(viewType))}</body>
		</html>`;
	}
}

export function reviveWebviewExtension(extensionData: extHostProtocol.WebviewExtensionDescription): WebviewExtensionDescription {
	return {
		id: extensionData.id,
		location: URI.revive(extensionData.location),
	};
}

export function reviveWebviewContentOptions(webviewOptions: extHostProtocol.IWebviewContentOptions): WebviewContentOptions {
	return {
		allowScripts: webviewOptions.enableScripts,
		allowForms: webviewOptions.enableForms,
		enableCommandUris: webviewOptions.enableCommandUris,
		localResourceRoots: Array.isArray(webviewOptions.localResourceRoots) ? webviewOptions.localResourceRoots.map(r => URI.revive(r)) : undefined,
		portMapping: webviewOptions.portMapping,
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadWebviewViews.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadWebviewViews.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../base/common/cancellation.js';
import { onUnexpectedError } from '../../../base/common/errors.js';
import { Disposable, DisposableMap, DisposableStore } from '../../../base/common/lifecycle.js';
import { generateUuid } from '../../../base/common/uuid.js';
import { MainThreadWebviews, reviveWebviewExtension } from './mainThreadWebviews.js';
import * as extHostProtocol from '../common/extHost.protocol.js';
import { IViewBadge } from '../../common/views.js';
import { IWebviewViewService, WebviewView } from '../../contrib/webviewView/browser/webviewViewService.js';
import { ITelemetryService } from '../../../platform/telemetry/common/telemetry.js';
import { IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';


export class MainThreadWebviewsViews extends Disposable implements extHostProtocol.MainThreadWebviewViewsShape {

	private readonly _proxy: extHostProtocol.ExtHostWebviewViewsShape;

	private readonly _webviewViews = this._register(new DisposableMap<string, WebviewView>());
	private readonly _webviewViewProviders = this._register(new DisposableMap<string>());

	constructor(
		context: IExtHostContext,
		private readonly mainThreadWebviews: MainThreadWebviews,
		@ITelemetryService private readonly _telemetryService: ITelemetryService,
		@IWebviewViewService private readonly _webviewViewService: IWebviewViewService,
	) {
		super();

		this._proxy = context.getProxy(extHostProtocol.ExtHostContext.ExtHostWebviewViews);
	}

	public $setWebviewViewTitle(handle: extHostProtocol.WebviewHandle, value: string | undefined): void {
		const webviewView = this.getWebviewView(handle);
		webviewView.title = value;
	}

	public $setWebviewViewDescription(handle: extHostProtocol.WebviewHandle, value: string | undefined): void {
		const webviewView = this.getWebviewView(handle);
		webviewView.description = value;
	}

	public $setWebviewViewBadge(handle: string, badge: IViewBadge | undefined): void {
		const webviewView = this.getWebviewView(handle);
		webviewView.badge = badge;
	}

	public $show(handle: extHostProtocol.WebviewHandle, preserveFocus: boolean): void {
		const webviewView = this.getWebviewView(handle);
		webviewView.show(preserveFocus);
	}

	public $registerWebviewViewProvider(
		extensionData: extHostProtocol.WebviewExtensionDescription,
		viewType: string,
		options: { retainContextWhenHidden?: boolean; serializeBuffersForPostMessage: boolean }
	): void {
		if (this._webviewViewProviders.has(viewType)) {
			throw new Error(`View provider for ${viewType} already registered`);
		}

		const extension = reviveWebviewExtension(extensionData);

		const registration = this._webviewViewService.register(viewType, {
			resolve: async (webviewView: WebviewView, cancellation: CancellationToken) => {
				const handle = generateUuid();

				this._webviewViews.set(handle, webviewView);
				this.mainThreadWebviews.addWebview(handle, webviewView.webview, { serializeBuffersForPostMessage: options.serializeBuffersForPostMessage });

				let state = undefined;
				if (webviewView.webview.state) {
					try {
						state = JSON.parse(webviewView.webview.state);
					} catch (e) {
						console.error('Could not load webview state', e, webviewView.webview.state);
					}
				}

				webviewView.webview.extension = extension;

				if (options) {
					webviewView.webview.options = options;
				}

				const subscriptions = new DisposableStore();
				subscriptions.add(webviewView.onDidChangeVisibility(visible => {
					this._proxy.$onDidChangeWebviewViewVisibility(handle, visible);
				}));

				subscriptions.add(webviewView.onDispose(() => {
					this._proxy.$disposeWebviewView(handle);
					this._webviewViews.deleteAndDispose(handle);
					subscriptions.dispose();
				}));

				type CreateWebviewViewTelemetry = {
					extensionId: string;
					id: string;
				};
				type Classification = {
					extensionId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Id of the extension' };
					id: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Id of the view' };
					owner: 'digitarald';
					comment: 'Helps to gain insights on what extension contributed views are most popular';
				};
				this._telemetryService.publicLog2<CreateWebviewViewTelemetry, Classification>('webviews:createWebviewView', {
					extensionId: extension.id.value,
					id: viewType,
				});

				try {
					await this._proxy.$resolveWebviewView(handle, viewType, webviewView.title, state, cancellation);
				} catch (error) {
					onUnexpectedError(error);
					webviewView.webview.setHtml(this.mainThreadWebviews.getWebviewResolvedFailedContent(viewType));
				}
			}
		});

		this._webviewViewProviders.set(viewType, registration);
	}

	public $unregisterWebviewViewProvider(viewType: string): void {
		if (!this._webviewViewProviders.has(viewType)) {
			throw new Error(`No view provider for ${viewType} registered`);
		}

		this._webviewViewProviders.deleteAndDispose(viewType);
	}

	private getWebviewView(handle: string): WebviewView {
		const webviewView = this._webviewViews.get(handle);
		if (!webviewView) {
			throw new Error('unknown webview view');
		}
		return webviewView;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadWindow.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadWindow.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import { DisposableStore } from '../../../base/common/lifecycle.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { IOpenerService } from '../../../platform/opener/common/opener.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { ExtHostContext, ExtHostWindowShape, IOpenUriOptions, MainContext, MainThreadWindowShape } from '../common/extHost.protocol.js';
import { IHostService } from '../../services/host/browser/host.js';
import { IUserActivityService } from '../../services/userActivity/common/userActivityService.js';
import { encodeBase64 } from '../../../base/common/buffer.js';

@extHostNamedCustomer(MainContext.MainThreadWindow)
export class MainThreadWindow implements MainThreadWindowShape {

	private readonly proxy: ExtHostWindowShape;
	private readonly disposables = new DisposableStore();

	constructor(
		extHostContext: IExtHostContext,
		@IHostService private readonly hostService: IHostService,
		@IOpenerService private readonly openerService: IOpenerService,
		@IUserActivityService private readonly userActivityService: IUserActivityService,
	) {
		this.proxy = extHostContext.getProxy(ExtHostContext.ExtHostWindow);

		Event.latch(hostService.onDidChangeFocus)
			(this.proxy.$onDidChangeWindowFocus, this.proxy, this.disposables);
		userActivityService.onDidChangeIsActive(this.proxy.$onDidChangeWindowActive, this.proxy, this.disposables);
		this.registerNativeHandle();
	}

	dispose(): void {
		this.disposables.dispose();
	}

	registerNativeHandle(): void {
		Event.latch(this.hostService.onDidChangeActiveWindow)(
			async windowId => {
				const handle = await this.hostService.getNativeWindowHandle(windowId);
				this.proxy.$onDidChangeActiveNativeWindowHandle(handle ? encodeBase64(handle) : undefined);
			},
			this,
			this.disposables
		);
	}

	$getInitialState() {
		return Promise.resolve({
			isFocused: this.hostService.hasFocus,
			isActive: this.userActivityService.isActive,
		});
	}

	async $openUri(uriComponents: UriComponents, uriString: string | undefined, options: IOpenUriOptions): Promise<boolean> {
		const uri = URI.from(uriComponents);
		let target: URI | string;
		if (uriString && URI.parse(uriString).toString() === uri.toString()) {
			// called with string and no transformation happened -> keep string
			target = uriString;
		} else {
			// called with URI or transformed -> use uri
			target = uri;
		}
		return this.openerService.open(target, {
			openExternal: true,
			allowTunneling: options.allowTunneling,
			allowContributedOpeners: options.allowContributedOpeners,
		});
	}

	async $asExternalUri(uriComponents: UriComponents, options: IOpenUriOptions): Promise<UriComponents> {
		const result = await this.openerService.resolveExternalUri(URI.revive(uriComponents), options);
		return result.resolved;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadWorkspace.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadWorkspace.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken, CancellationTokenSource } from '../../../base/common/cancellation.js';
import { isCancellationError } from '../../../base/common/errors.js';
import { DisposableStore, IDisposable } from '../../../base/common/lifecycle.js';
import { isNative } from '../../../base/common/platform.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { localize } from '../../../nls.js';
import { IEnvironmentService } from '../../../platform/environment/common/environment.js';
import { IFileService } from '../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';
import { ILabelService } from '../../../platform/label/common/label.js';
import { INotificationService } from '../../../platform/notification/common/notification.js';
import { AuthInfo, Credentials, IRequestService } from '../../../platform/request/common/request.js';
import { WorkspaceTrustRequestOptions, IWorkspaceTrustManagementService, IWorkspaceTrustRequestService } from '../../../platform/workspace/common/workspaceTrust.js';
import { IWorkspace, IWorkspaceContextService, WorkbenchState, isUntitledWorkspace, WorkspaceFolder } from '../../../platform/workspace/common/workspace.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { checkGlobFileExists } from '../../services/extensions/common/workspaceContains.js';
import { IFileQueryBuilderOptions, ITextQueryBuilderOptions, QueryBuilder } from '../../services/search/common/queryBuilder.js';
import { IEditorService, ISaveEditorsResult } from '../../services/editor/common/editorService.js';
import { IFileMatch, IPatternInfo, ISearchProgressItem, ISearchService } from '../../services/search/common/search.js';
import { IWorkspaceEditingService } from '../../services/workspaces/common/workspaceEditing.js';
import { ExtHostContext, ExtHostWorkspaceShape, ITextSearchComplete, IWorkspaceData, MainContext, MainThreadWorkspaceShape } from '../common/extHost.protocol.js';
import { IEditSessionIdentityService } from '../../../platform/workspace/common/editSessions.js';
import { EditorResourceAccessor, SaveReason, SideBySideEditor } from '../../common/editor.js';
import { coalesce } from '../../../base/common/arrays.js';
import { ICanonicalUriService } from '../../../platform/workspace/common/canonicalUri.js';
import { revive } from '../../../base/common/marshalling.js';
import { ITextFileService } from '../../services/textfile/common/textfiles.js';

@extHostNamedCustomer(MainContext.MainThreadWorkspace)
export class MainThreadWorkspace implements MainThreadWorkspaceShape {

	private readonly _toDispose = new DisposableStore();
	private readonly _activeCancelTokens: { [id: number]: CancellationTokenSource } = Object.create(null);
	private readonly _proxy: ExtHostWorkspaceShape;
	private readonly _queryBuilder: QueryBuilder;

	constructor(
		extHostContext: IExtHostContext,
		@ISearchService private readonly _searchService: ISearchService,
		@IWorkspaceContextService private readonly _contextService: IWorkspaceContextService,
		@IEditSessionIdentityService private readonly _editSessionIdentityService: IEditSessionIdentityService,
		@ICanonicalUriService private readonly _canonicalUriService: ICanonicalUriService,
		@IEditorService private readonly _editorService: IEditorService,
		@IWorkspaceEditingService private readonly _workspaceEditingService: IWorkspaceEditingService,
		@INotificationService private readonly _notificationService: INotificationService,
		@IRequestService private readonly _requestService: IRequestService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@ILabelService private readonly _labelService: ILabelService,
		@IEnvironmentService private readonly _environmentService: IEnvironmentService,
		@IFileService fileService: IFileService,
		@IWorkspaceTrustManagementService private readonly _workspaceTrustManagementService: IWorkspaceTrustManagementService,
		@IWorkspaceTrustRequestService private readonly _workspaceTrustRequestService: IWorkspaceTrustRequestService,
		@ITextFileService private readonly _textFileService: ITextFileService,
	) {
		this._queryBuilder = this._instantiationService.createInstance(QueryBuilder);
		this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostWorkspace);
		const workspace = this._contextService.getWorkspace();
		// The workspace file is provided be a unknown file system provider. It might come
		// from the extension host. So initialize now knowing that `rootPath` is undefined.
		if (workspace.configuration && !isNative && !fileService.hasProvider(workspace.configuration)) {
			this._proxy.$initializeWorkspace(this.getWorkspaceData(workspace), this.isWorkspaceTrusted());
		} else {
			this._contextService.getCompleteWorkspace().then(workspace => this._proxy.$initializeWorkspace(this.getWorkspaceData(workspace), this.isWorkspaceTrusted()));
		}
		this._contextService.onDidChangeWorkspaceFolders(this._onDidChangeWorkspace, this, this._toDispose);
		this._contextService.onDidChangeWorkbenchState(this._onDidChangeWorkspace, this, this._toDispose);
		this._workspaceTrustManagementService.onDidChangeTrust(this._onDidGrantWorkspaceTrust, this, this._toDispose);
	}

	dispose(): void {
		this._toDispose.dispose();

		for (const requestId in this._activeCancelTokens) {
			const tokenSource = this._activeCancelTokens[requestId];
			tokenSource.cancel();
		}
	}

	// --- workspace ---

	$updateWorkspaceFolders(extensionName: string, index: number, deleteCount: number, foldersToAdd: { uri: UriComponents; name?: string }[]): Promise<void> {
		const workspaceFoldersToAdd = foldersToAdd.map(f => ({ uri: URI.revive(f.uri), name: f.name }));

		// Indicate in status message
		this._notificationService.status(this.getStatusMessage(extensionName, workspaceFoldersToAdd.length, deleteCount), { hideAfter: 10 * 1000 /* 10s */ });

		return this._workspaceEditingService.updateFolders(index, deleteCount, workspaceFoldersToAdd, true);
	}

	private getStatusMessage(extensionName: string, addCount: number, removeCount: number): string {
		let message: string;

		const wantsToAdd = addCount > 0;
		const wantsToDelete = removeCount > 0;

		// Add Folders
		if (wantsToAdd && !wantsToDelete) {
			if (addCount === 1) {
				message = localize('folderStatusMessageAddSingleFolder', "Extension '{0}' added 1 folder to the workspace", extensionName);
			} else {
				message = localize('folderStatusMessageAddMultipleFolders', "Extension '{0}' added {1} folders to the workspace", extensionName, addCount);
			}
		}

		// Delete Folders
		else if (wantsToDelete && !wantsToAdd) {
			if (removeCount === 1) {
				message = localize('folderStatusMessageRemoveSingleFolder', "Extension '{0}' removed 1 folder from the workspace", extensionName);
			} else {
				message = localize('folderStatusMessageRemoveMultipleFolders', "Extension '{0}' removed {1} folders from the workspace", extensionName, removeCount);
			}
		}

		// Change Folders
		else {
			message = localize('folderStatusChangeFolder', "Extension '{0}' changed folders of the workspace", extensionName);
		}

		return message;
	}

	private _onDidChangeWorkspace(): void {
		this._proxy.$acceptWorkspaceData(this.getWorkspaceData(this._contextService.getWorkspace()));
	}

	private getWorkspaceData(workspace: IWorkspace): IWorkspaceData | null {
		if (this._contextService.getWorkbenchState() === WorkbenchState.EMPTY) {
			return null;
		}
		return {
			configuration: workspace.configuration || undefined,
			isUntitled: workspace.configuration ? isUntitledWorkspace(workspace.configuration, this._environmentService) : false,
			folders: workspace.folders,
			id: workspace.id,
			name: this._labelService.getWorkspaceLabel(workspace),
			transient: workspace.transient
		};
	}

	// --- search ---

	$startFileSearch(_includeFolder: UriComponents | null, options: IFileQueryBuilderOptions<UriComponents>, token: CancellationToken): Promise<UriComponents[] | null> {
		const includeFolder = URI.revive(_includeFolder);
		const workspace = this._contextService.getWorkspace();

		const query = this._queryBuilder.file(
			includeFolder ? [includeFolder] : workspace.folders,
			revive(options)
		);

		return this._searchService.fileSearch(query, token).then(result => {
			return result.results.map(m => m.resource);
		}, err => {
			if (!isCancellationError(err)) {
				return Promise.reject(err);
			}
			return null;
		});
	}

	$startTextSearch(pattern: IPatternInfo, _folder: UriComponents | null, options: ITextQueryBuilderOptions<UriComponents>, requestId: number, token: CancellationToken): Promise<ITextSearchComplete | null> {
		const folder = URI.revive(_folder);
		const workspace = this._contextService.getWorkspace();
		const folders = folder ? [folder] : workspace.folders.map(folder => folder.uri);

		const query = this._queryBuilder.text(pattern, folders, revive(options));
		query._reason = 'startTextSearch';

		const onProgress = (p: ISearchProgressItem) => {
			if ((<IFileMatch>p).results) {
				this._proxy.$handleTextSearchResult(<IFileMatch>p, requestId);
			}
		};

		const search = this._searchService.textSearch(query, token, onProgress).then(
			result => {
				return { limitHit: result.limitHit };
			},
			err => {
				if (!isCancellationError(err)) {
					return Promise.reject(err);
				}

				return null;
			});

		return search;
	}

	$checkExists(folders: readonly UriComponents[], includes: string[], token: CancellationToken): Promise<boolean> {
		return this._instantiationService.invokeFunction((accessor) => checkGlobFileExists(accessor, folders, includes, token));
	}

	// --- save & edit resources ---

	async $save(uriComponents: UriComponents, options: { saveAs: boolean }): Promise<UriComponents | undefined> {
		const uri = URI.revive(uriComponents);

		const editors = [...this._editorService.findEditors(uri, { supportSideBySide: SideBySideEditor.PRIMARY })];
		const result = await this._editorService.save(editors, {
			reason: SaveReason.EXPLICIT,
			saveAs: options.saveAs,
			force: !options.saveAs
		});

		return this._saveResultToUris(result).at(0);
	}

	private _saveResultToUris(result: ISaveEditorsResult): URI[] {
		if (!result.success) {
			return [];
		}

		return coalesce(result.editors.map(editor => EditorResourceAccessor.getCanonicalUri(editor, { supportSideBySide: SideBySideEditor.PRIMARY })));
	}

	$saveAll(includeUntitled?: boolean): Promise<boolean> {
		return this._editorService.saveAll({ includeUntitled }).then(res => res.success);
	}

	$resolveProxy(url: string): Promise<string | undefined> {
		return this._requestService.resolveProxy(url);
	}

	$lookupAuthorization(authInfo: AuthInfo): Promise<Credentials | undefined> {
		return this._requestService.lookupAuthorization(authInfo);
	}

	$lookupKerberosAuthorization(url: string): Promise<string | undefined> {
		return this._requestService.lookupKerberosAuthorization(url);
	}

	$loadCertificates(): Promise<string[]> {
		return this._requestService.loadCertificates();
	}

	// --- trust ---

	$requestWorkspaceTrust(options?: WorkspaceTrustRequestOptions): Promise<boolean | undefined> {
		return this._workspaceTrustRequestService.requestWorkspaceTrust(options);
	}

	private isWorkspaceTrusted(): boolean {
		return this._workspaceTrustManagementService.isWorkspaceTrusted();
	}

	private _onDidGrantWorkspaceTrust(): void {
		this._proxy.$onDidGrantWorkspaceTrust();
	}

	// --- edit sessions ---
	private registeredEditSessionProviders = new Map<number, IDisposable>();

	$registerEditSessionIdentityProvider(handle: number, scheme: string) {
		const disposable = this._editSessionIdentityService.registerEditSessionIdentityProvider({
			scheme: scheme,
			getEditSessionIdentifier: async (workspaceFolder: WorkspaceFolder, token: CancellationToken) => {
				return this._proxy.$getEditSessionIdentifier(workspaceFolder.uri, token);
			},
			provideEditSessionIdentityMatch: async (workspaceFolder: WorkspaceFolder, identity1: string, identity2: string, token: CancellationToken) => {
				return this._proxy.$provideEditSessionIdentityMatch(workspaceFolder.uri, identity1, identity2, token);
			}
		});

		this.registeredEditSessionProviders.set(handle, disposable);
		this._toDispose.add(disposable);
	}

	$unregisterEditSessionIdentityProvider(handle: number) {
		const disposable = this.registeredEditSessionProviders.get(handle);
		disposable?.dispose();
		this.registeredEditSessionProviders.delete(handle);
	}

	// --- canonical uri identities ---
	private registeredCanonicalUriProviders = new Map<number, IDisposable>();

	$registerCanonicalUriProvider(handle: number, scheme: string) {
		const disposable = this._canonicalUriService.registerCanonicalUriProvider({
			scheme: scheme,
			provideCanonicalUri: async (uri: UriComponents, targetScheme: string, token: CancellationToken) => {
				const result = await this._proxy.$provideCanonicalUri(uri, targetScheme, token);
				if (result) {
					return URI.revive(result);
				}
				return result;
			}
		});

		this.registeredCanonicalUriProviders.set(handle, disposable);
		this._toDispose.add(disposable);
	}

	$unregisterCanonicalUriProvider(handle: number) {
		const disposable = this.registeredCanonicalUriProviders.get(handle);
		disposable?.dispose();
		this.registeredCanonicalUriProviders.delete(handle);
	}

	// --- encodings

	$resolveDecoding(resource: UriComponents | undefined, options?: { encoding: string }): Promise<{ preferredEncoding: string; guessEncoding: boolean; candidateGuessEncodings: string[] }> {
		return this._textFileService.resolveDecoding(URI.revive(resource), options);
	}

	$validateDetectedEncoding(resource: UriComponents | undefined, detectedEncoding: string, options?: { encoding?: string }): Promise<string> {
		return this._textFileService.validateDetectedEncoding(URI.revive(resource), detectedEncoding, options);
	}

	$resolveEncoding(resource: UriComponents | undefined, options?: { encoding: string }): Promise<{ encoding: string; addBOM: boolean }> {
		return this._textFileService.resolveEncoding(URI.revive(resource), options);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/statusBarExtensionPoint.ts]---
Location: vscode-main/src/vs/workbench/api/browser/statusBarExtensionPoint.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IJSONSchema, TypeFromJsonSchema } from '../../../base/common/jsonSchema.js';
import { DisposableStore, IDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { localize } from '../../../nls.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import { isProposedApiEnabled } from '../../services/extensions/common/extensions.js';
import { ExtensionsRegistry } from '../../services/extensions/common/extensionsRegistry.js';
import { IStatusbarService, StatusbarAlignment as MainThreadStatusBarAlignment, IStatusbarEntryAccessor, IStatusbarEntry, StatusbarAlignment, IStatusbarEntryPriority, StatusbarEntryKind } from '../../services/statusbar/browser/statusbar.js';
import { ThemeColor } from '../../../base/common/themables.js';
import { Command } from '../../../editor/common/languages.js';
import { IAccessibilityInformation, isAccessibilityInformation } from '../../../platform/accessibility/common/accessibility.js';
import { IMarkdownString, isMarkdownString } from '../../../base/common/htmlContent.js';
import { getCodiconAriaLabel } from '../../../base/common/iconLabels.js';
import { hash } from '../../../base/common/hash.js';
import { Event, Emitter } from '../../../base/common/event.js';
import { InstantiationType, registerSingleton } from '../../../platform/instantiation/common/extensions.js';
import { Iterable } from '../../../base/common/iterator.js';
import { ExtensionIdentifier } from '../../../platform/extensions/common/extensions.js';
import { asStatusBarItemIdentifier } from '../common/extHostTypes.js';
import { STATUS_BAR_ERROR_ITEM_BACKGROUND, STATUS_BAR_WARNING_ITEM_BACKGROUND } from '../../common/theme.js';
import { IManagedHoverTooltipMarkdownString } from '../../../base/browser/ui/hover/hover.js';


// --- service

export const IExtensionStatusBarItemService = createDecorator<IExtensionStatusBarItemService>('IExtensionStatusBarItemService');

export interface IExtensionStatusBarItemChangeEvent {
	readonly added?: ExtensionStatusBarEntry;
	readonly removed?: string;
}

export type ExtensionStatusBarEntry = [string, {
	entry: IStatusbarEntry;
	alignment: MainThreadStatusBarAlignment;
	priority: number;
}];

export const enum StatusBarUpdateKind {
	DidDefine,
	DidUpdate
}

export interface IExtensionStatusBarItemService {
	readonly _serviceBrand: undefined;

	readonly onDidChange: Event<IExtensionStatusBarItemChangeEvent>;

	setOrUpdateEntry(id: string, statusId: string, extensionId: string | undefined, name: string, text: string, tooltip: IMarkdownString | string | undefined | IManagedHoverTooltipMarkdownString, command: Command | undefined, color: string | ThemeColor | undefined, backgroundColor: ThemeColor | undefined, alignLeft: boolean, priority: number | undefined, accessibilityInformation: IAccessibilityInformation | undefined): StatusBarUpdateKind;

	unsetEntry(id: string): void;

	getEntries(): Iterable<ExtensionStatusBarEntry>;
}


class ExtensionStatusBarItemService implements IExtensionStatusBarItemService {

	declare readonly _serviceBrand: undefined;

	private readonly _entries: Map<string, { accessor: IStatusbarEntryAccessor; entry: IStatusbarEntry; alignment: MainThreadStatusBarAlignment; priority: number; disposable: IDisposable }> = new Map();

	private readonly _onDidChange = new Emitter<IExtensionStatusBarItemChangeEvent>();
	readonly onDidChange: Event<IExtensionStatusBarItemChangeEvent> = this._onDidChange.event;

	constructor(@IStatusbarService private readonly _statusbarService: IStatusbarService) { }

	dispose(): void {
		this._entries.forEach(entry => entry.accessor.dispose());
		this._entries.clear();
		this._onDidChange.dispose();
	}

	setOrUpdateEntry(entryId: string,
		id: string, extensionId: string | undefined, name: string, text: string,
		tooltip: IMarkdownString | string | undefined | IManagedHoverTooltipMarkdownString,
		command: Command | undefined, color: string | ThemeColor | undefined, backgroundColor: ThemeColor | undefined,
		alignLeft: boolean, priority: number | undefined, accessibilityInformation: IAccessibilityInformation | undefined
	): StatusBarUpdateKind {
		// if there are icons in the text use the tooltip for the aria label
		let ariaLabel: string;
		let role: string | undefined = undefined;
		if (accessibilityInformation) {
			ariaLabel = accessibilityInformation.label;
			role = accessibilityInformation.role;
		} else {
			ariaLabel = getCodiconAriaLabel(text);
			if (typeof tooltip === 'string' || isMarkdownString(tooltip)) {
				const tooltipString = typeof tooltip === 'string' ? tooltip : tooltip.value;
				ariaLabel += `, ${tooltipString}`;
			}
		}
		let kind: StatusbarEntryKind | undefined = undefined;
		switch (backgroundColor?.id) {
			case STATUS_BAR_ERROR_ITEM_BACKGROUND:
			case STATUS_BAR_WARNING_ITEM_BACKGROUND:
				// override well known colors that map to status entry kinds to support associated themable hover colors
				kind = backgroundColor.id === STATUS_BAR_ERROR_ITEM_BACKGROUND ? 'error' : 'warning';
				color = undefined;
				backgroundColor = undefined;
		}
		const entry: IStatusbarEntry = { name, text, tooltip, command, color, backgroundColor, ariaLabel, role, kind, extensionId };

		if (typeof priority === 'undefined') {
			priority = 0;
		}

		let alignment = alignLeft ? StatusbarAlignment.LEFT : StatusbarAlignment.RIGHT;

		// alignment and priority can only be set once (at creation time)
		const existingEntry = this._entries.get(entryId);
		if (existingEntry) {
			alignment = existingEntry.alignment;
			priority = existingEntry.priority;
		}

		// Create new entry if not existing
		if (!existingEntry) {
			let entryPriority: number | IStatusbarEntryPriority;
			if (typeof extensionId === 'string') {
				// We cannot enforce unique priorities across all extensions, so we
				// use the extension identifier as a secondary sort key to reduce
				// the likelyhood of collisions.
				// See https://github.com/microsoft/vscode/issues/177835
				// See https://github.com/microsoft/vscode/issues/123827
				entryPriority = { primary: priority, secondary: hash(extensionId) };
			} else {
				entryPriority = priority;
			}

			const accessor = this._statusbarService.addEntry(entry, id, alignment, entryPriority);
			this._entries.set(entryId, {
				accessor,
				entry,
				alignment,
				priority,
				disposable: toDisposable(() => {
					accessor.dispose();
					this._entries.delete(entryId);
					this._onDidChange.fire({ removed: entryId });
				})
			});

			this._onDidChange.fire({ added: [entryId, { entry, alignment, priority }] });
			return StatusBarUpdateKind.DidDefine;

		} else {
			// Otherwise update
			existingEntry.accessor.update(entry);
			existingEntry.entry = entry;
			return StatusBarUpdateKind.DidUpdate;
		}
	}

	unsetEntry(entryId: string): void {
		this._entries.get(entryId)?.disposable.dispose();
		this._entries.delete(entryId);
	}

	getEntries(): Iterable<[string, { entry: IStatusbarEntry; alignment: MainThreadStatusBarAlignment; priority: number }]> {
		return this._entries.entries();
	}
}

registerSingleton(IExtensionStatusBarItemService, ExtensionStatusBarItemService, InstantiationType.Delayed);

// --- extension point and reading of it

type IUserFriendlyStatusItemEntry = TypeFromJsonSchema<typeof statusBarItemSchema>;

function isUserFriendlyStatusItemEntry(candidate: unknown): candidate is IUserFriendlyStatusItemEntry {
	const obj = candidate as IUserFriendlyStatusItemEntry;
	return (typeof obj.id === 'string' && obj.id.length > 0)
		&& typeof obj.name === 'string'
		&& typeof obj.text === 'string'
		&& (obj.alignment === 'left' || obj.alignment === 'right')
		&& (obj.command === undefined || typeof obj.command === 'string')
		&& (obj.tooltip === undefined || typeof obj.tooltip === 'string')
		&& (obj.priority === undefined || typeof obj.priority === 'number')
		&& (obj.accessibilityInformation === undefined || isAccessibilityInformation(obj.accessibilityInformation))
		;
}

const statusBarItemSchema = {
	type: 'object',
	required: ['id', 'text', 'alignment', 'name'],
	properties: {
		id: {
			type: 'string',
			markdownDescription: localize('id', 'The identifier of the status bar entry. Must be unique within the extension. The same value must be used when calling the `vscode.window.createStatusBarItem(id, ...)`-API')
		},
		name: {
			type: 'string',
			description: localize('name', 'The name of the entry, like \'Python Language Indicator\', \'Git Status\' etc. Try to keep the length of the name short, yet descriptive enough that users can understand what the status bar item is about.')
		},
		text: {
			type: 'string',
			description: localize('text', 'The text to show for the entry. You can embed icons in the text by leveraging the `$(<name>)`-syntax, like \'Hello $(globe)!\'')
		},
		tooltip: {
			type: 'string',
			description: localize('tooltip', 'The tooltip text for the entry.')
		},
		command: {
			type: 'string',
			description: localize('command', 'The command to execute when the status bar entry is clicked.')
		},
		alignment: {
			type: 'string',
			enum: ['left', 'right'],
			description: localize('alignment', 'The alignment of the status bar entry.')
		},
		priority: {
			type: 'number',
			description: localize('priority', 'The priority of the status bar entry. Higher value means the item should be shown more to the left.')
		},
		accessibilityInformation: {
			type: 'object',
			description: localize('accessibilityInformation', 'Defines the role and aria label to be used when the status bar entry is focused.'),
			required: ['label'],
			properties: {
				role: {
					type: 'string',
					description: localize('accessibilityInformation.role', 'The role of the status bar entry which defines how a screen reader interacts with it. More about aria roles can be found here https://w3c.github.io/aria/#widget_roles')
				},
				label: {
					type: 'string',
					description: localize('accessibilityInformation.label', 'The aria label of the status bar entry. Defaults to the entry\'s text.')
				}
			}
		}
	}
} as const satisfies IJSONSchema;

const statusBarItemsSchema: IJSONSchema = {
	description: localize('vscode.extension.contributes.statusBarItems', "Contributes items to the status bar."),
	oneOf: [
		statusBarItemSchema,
		{
			type: 'array',
			items: statusBarItemSchema
		}
	]
};

const statusBarItemsExtensionPoint = ExtensionsRegistry.registerExtensionPoint<IUserFriendlyStatusItemEntry | IUserFriendlyStatusItemEntry[]>({
	extensionPoint: 'statusBarItems',
	jsonSchema: statusBarItemsSchema,
});

export class StatusBarItemsExtensionPoint {

	constructor(@IExtensionStatusBarItemService statusBarItemsService: IExtensionStatusBarItemService) {

		const contributions = new DisposableStore();

		statusBarItemsExtensionPoint.setHandler((extensions) => {

			contributions.clear();

			for (const entry of extensions) {

				if (!isProposedApiEnabled(entry.description, 'contribStatusBarItems')) {
					entry.collector.error(`The ${statusBarItemsExtensionPoint.name} is proposed API`);
					continue;
				}

				const { value, collector } = entry;

				for (const candidate of Iterable.wrap(value)) {
					if (!isUserFriendlyStatusItemEntry(candidate)) {
						collector.error(localize('invalid', "Invalid status bar item contribution."));
						continue;
					}

					const fullItemId = asStatusBarItemIdentifier(entry.description.identifier, candidate.id);

					const kind = statusBarItemsService.setOrUpdateEntry(
						fullItemId,
						fullItemId,
						ExtensionIdentifier.toKey(entry.description.identifier),
						candidate.name ?? entry.description.displayName ?? entry.description.name,
						candidate.text,
						candidate.tooltip,
						candidate.command ? { id: candidate.command, title: candidate.name } : undefined,
						undefined, undefined,
						candidate.alignment === 'left',
						candidate.priority,
						candidate.accessibilityInformation
					);

					if (kind === StatusBarUpdateKind.DidDefine) {
						contributions.add(toDisposable(() => statusBarItemsService.unsetEntry(fullItemId)));
					}
				}
			}
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/viewsExtensionPoint.ts]---
Location: vscode-main/src/vs/workbench/api/browser/viewsExtensionPoint.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { MarkdownString } from '../../../base/common/htmlContent.js';
import { IJSONSchema } from '../../../base/common/jsonSchema.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import * as resources from '../../../base/common/resources.js';
import { isFalsyOrWhitespace } from '../../../base/common/strings.js';
import { ThemeIcon } from '../../../base/common/themables.js';
import { URI } from '../../../base/common/uri.js';
import { localize } from '../../../nls.js';
import { ContextKeyExpr } from '../../../platform/contextkey/common/contextkey.js';
import { ExtensionIdentifier, ExtensionIdentifierSet, IExtensionDescription, IExtensionManifest } from '../../../platform/extensions/common/extensions.js';
import { SyncDescriptor } from '../../../platform/instantiation/common/descriptors.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { Registry } from '../../../platform/registry/common/platform.js';
import { PaneCompositeRegistry, Extensions as ViewletExtensions } from '../../browser/panecomposite.js';
import { CustomTreeView, TreeViewPane } from '../../browser/parts/views/treeView.js';
import { ViewPaneContainer } from '../../browser/parts/views/viewPaneContainer.js';
import { IWorkbenchContribution, WorkbenchPhase, registerWorkbenchContribution2 } from '../../common/contributions.js';
import { ICustomViewDescriptor, IViewContainersRegistry, IViewDescriptor, IViewsRegistry, ViewContainer, Extensions as ViewContainerExtensions, ViewContainerLocation } from '../../common/views.js';
import { VIEWLET_ID as DEBUG } from '../../contrib/debug/common/debug.js';
import { VIEWLET_ID as EXPLORER } from '../../contrib/files/common/files.js';
import { VIEWLET_ID as REMOTE } from '../../contrib/remote/browser/remoteExplorer.js';
import { VIEWLET_ID as SCM } from '../../contrib/scm/common/scm.js';
import { WebviewViewPane } from '../../contrib/webviewView/browser/webviewViewPane.js';
import { Extensions as ExtensionFeaturesRegistryExtensions, IExtensionFeatureTableRenderer, IExtensionFeaturesRegistry, IRenderedData, IRowData, ITableData } from '../../services/extensionManagement/common/extensionFeatures.js';
import { isProposedApiEnabled } from '../../services/extensions/common/extensions.js';
import { ExtensionMessageCollector, ExtensionsRegistry, IExtensionPoint, IExtensionPointUser } from '../../services/extensions/common/extensionsRegistry.js';

export interface IUserFriendlyViewsContainerDescriptor {
	id: string;
	title: string;
	icon: string;
}

const viewsContainerSchema: IJSONSchema = {
	type: 'object',
	properties: {
		id: {
			description: localize({ key: 'vscode.extension.contributes.views.containers.id', comment: ['Contribution refers to those that an extension contributes to VS Code through an extension/contribution point. '] }, "Unique id used to identify the container in which views can be contributed using 'views' contribution point"),
			type: 'string',
			pattern: '^[a-zA-Z0-9_-]+$'
		},
		title: {
			description: localize('vscode.extension.contributes.views.containers.title', 'Human readable string used to render the container'),
			type: 'string'
		},
		icon: {
			description: localize('vscode.extension.contributes.views.containers.icon', "Path to the container icon. Icons are 24x24 centered on a 50x40 block and have a fill color of 'rgb(215, 218, 224)' or '#d7dae0'. It is recommended that icons be in SVG, though any image file type is accepted."),
			type: 'string'
		}
	},
	required: ['id', 'title', 'icon']
};

export const viewsContainersContribution: IJSONSchema = {
	description: localize('vscode.extension.contributes.viewsContainers', 'Contributes views containers to the editor'),
	type: 'object',
	properties: {
		'activitybar': {
			description: localize('views.container.activitybar', "Contribute views containers to Activity Bar"),
			type: 'array',
			items: viewsContainerSchema
		},
		'panel': {
			description: localize('views.container.panel', "Contribute views containers to Panel"),
			type: 'array',
			items: viewsContainerSchema
		},
		'secondarySidebar': {
			description: localize('views.container.secondarySidebar', "Contribute views containers to Secondary Side Bar"),
			type: 'array',
			items: viewsContainerSchema
		}
	},
	additionalProperties: false
};

enum ViewType {
	Tree = 'tree',
	Webview = 'webview'
}


interface IUserFriendlyViewDescriptor {
	type?: ViewType;

	id: string;
	name: string;
	when?: string;

	icon?: string;
	contextualTitle?: string;
	visibility?: string;

	initialSize?: number;

	// From 'remoteViewDescriptor' type
	group?: string;
	remoteName?: string | string[];
	virtualWorkspace?: string;

	accessibilityHelpContent?: string;
}

enum InitialVisibility {
	Visible = 'visible',
	Hidden = 'hidden',
	Collapsed = 'collapsed'
}

const viewDescriptor: IJSONSchema = {
	type: 'object',
	required: ['id', 'name', 'icon'],
	defaultSnippets: [{ body: { id: '${1:id}', name: '${2:name}', icon: '${3:icon}' } }],
	properties: {
		type: {
			markdownDescription: localize('vscode.extension.contributes.view.type', "Type of the view. This can either be `tree` for a tree view based view or `webview` for a webview based view. The default is `tree`."),
			type: 'string',
			enum: [
				'tree',
				'webview',
			],
			markdownEnumDescriptions: [
				localize('vscode.extension.contributes.view.tree', "The view is backed by a `TreeView` created by `createTreeView`."),
				localize('vscode.extension.contributes.view.webview', "The view is backed by a `WebviewView` registered by `registerWebviewViewProvider`."),
			]
		},
		id: {
			markdownDescription: localize('vscode.extension.contributes.view.id', 'Identifier of the view. This should be unique across all views. It is recommended to include your extension id as part of the view id. Use this to register a data provider through `vscode.window.registerTreeDataProviderForView` API. Also to trigger activating your extension by registering `onView:${id}` event to `activationEvents`.'),
			type: 'string'
		},
		name: {
			description: localize('vscode.extension.contributes.view.name', 'The human-readable name of the view. Will be shown'),
			type: 'string'
		},
		when: {
			description: localize('vscode.extension.contributes.view.when', 'Condition which must be true to show this view'),
			type: 'string'
		},
		icon: {
			description: localize('vscode.extension.contributes.view.icon', "Path to the view icon. View icons are displayed when the name of the view cannot be shown. It is recommended that icons be in SVG, though any image file type is accepted."),
			type: 'string'
		},
		contextualTitle: {
			description: localize('vscode.extension.contributes.view.contextualTitle', "Human-readable context for when the view is moved out of its original location. By default, the view's container name will be used."),
			type: 'string'
		},
		visibility: {
			description: localize('vscode.extension.contributes.view.initialState', "Initial state of the view when the extension is first installed. Once the user has changed the view state by collapsing, moving, or hiding the view, the initial state will not be used again."),
			type: 'string',
			enum: [
				'visible',
				'hidden',
				'collapsed'
			],
			default: 'visible',
			enumDescriptions: [
				localize('vscode.extension.contributes.view.initialState.visible', "The default initial state for the view. In most containers the view will be expanded, however; some built-in containers (explorer, scm, and debug) show all contributed views collapsed regardless of the `visibility`."),
				localize('vscode.extension.contributes.view.initialState.hidden', "The view will not be shown in the view container, but will be discoverable through the views menu and other view entry points and can be un-hidden by the user."),
				localize('vscode.extension.contributes.view.initialState.collapsed', "The view will show in the view container, but will be collapsed.")
			]
		},
		initialSize: {
			type: 'number',
			description: localize('vscode.extension.contributs.view.size', "The initial size of the view. The size will behave like the css 'flex' property, and will set the initial size when the view is first shown. In the side bar, this is the height of the view. This value is only respected when the same extension owns both the view and the view container."),
		},
		accessibilityHelpContent: {
			type: 'string',
			markdownDescription: localize('vscode.extension.contributes.view.accessibilityHelpContent', "When the accessibility help dialog is invoked in this view, this content will be presented to the user as a markdown string. Keybindings will be resolved when provided in the format of <keybinding:commandId>. If there is no keybinding, that will be indicated and this command will be included in a quickpick for easy configuration.")
		}
	}
};

const remoteViewDescriptor: IJSONSchema = {
	type: 'object',
	required: ['id', 'name'],
	properties: {
		id: {
			description: localize('vscode.extension.contributes.view.id', 'Identifier of the view. This should be unique across all views. It is recommended to include your extension id as part of the view id. Use this to register a data provider through `vscode.window.registerTreeDataProviderForView` API. Also to trigger activating your extension by registering `onView:${id}` event to `activationEvents`.'),
			type: 'string'
		},
		name: {
			description: localize('vscode.extension.contributes.view.name', 'The human-readable name of the view. Will be shown'),
			type: 'string'
		},
		when: {
			description: localize('vscode.extension.contributes.view.when', 'Condition which must be true to show this view'),
			type: 'string'
		},
		group: {
			description: localize('vscode.extension.contributes.view.group', 'Nested group in the viewlet'),
			type: 'string'
		},
		remoteName: {
			description: localize('vscode.extension.contributes.view.remoteName', 'The name of the remote type associated with this view'),
			type: ['string', 'array'],
			items: {
				type: 'string'
			}
		}
	}
};
const viewsContribution: IJSONSchema = {
	description: localize('vscode.extension.contributes.views', "Contributes views to the editor"),
	type: 'object',
	properties: {
		'explorer': {
			description: localize('views.explorer', "Contributes views to Explorer container in the Activity bar"),
			type: 'array',
			items: viewDescriptor,
			default: []
		},
		'debug': {
			description: localize('views.debug', "Contributes views to Debug container in the Activity bar"),
			type: 'array',
			items: viewDescriptor,
			default: []
		},
		'scm': {
			description: localize('views.scm', "Contributes views to SCM container in the Activity bar"),
			type: 'array',
			items: viewDescriptor,
			default: []
		},
		'test': {
			description: localize('views.test', "Contributes views to Test container in the Activity bar"),
			type: 'array',
			items: viewDescriptor,
			default: []
		},
		'remote': {
			description: localize('views.remote', "Contributes views to Remote container in the Activity bar. To contribute to this container, the 'contribViewsRemote' API proposal must be enabled."),
			type: 'array',
			items: remoteViewDescriptor,
			default: []
		},
	},
	additionalProperties: {
		description: localize('views.contributed', "Contributes views to contributed views container"),
		type: 'array',
		items: viewDescriptor,
		default: []
	}
};

type ViewContainerExtensionPointType = { [loc: string]: IUserFriendlyViewsContainerDescriptor[] };
const viewsContainersExtensionPoint: IExtensionPoint<ViewContainerExtensionPointType> = ExtensionsRegistry.registerExtensionPoint<ViewContainerExtensionPointType>({
	extensionPoint: 'viewsContainers',
	jsonSchema: viewsContainersContribution
});

type ViewExtensionPointType = { [loc: string]: IUserFriendlyViewDescriptor[] };
const viewsExtensionPoint: IExtensionPoint<ViewExtensionPointType> = ExtensionsRegistry.registerExtensionPoint<ViewExtensionPointType>({
	extensionPoint: 'views',
	deps: [viewsContainersExtensionPoint],
	jsonSchema: viewsContribution,
	activationEventsGenerator: function* (viewExtensionPointTypeArray) {
		for (const viewExtensionPointType of viewExtensionPointTypeArray) {
			for (const viewDescriptors of Object.values(viewExtensionPointType)) {
				for (const viewDescriptor of viewDescriptors) {
					if (viewDescriptor.id) {
						yield `onView:${viewDescriptor.id}`;
					}
				}
			}
		}
	}
});

const CUSTOM_VIEWS_START_ORDER = 7;

class ViewsExtensionHandler implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.viewsExtensionHandler';

	private viewContainersRegistry: IViewContainersRegistry;
	private viewsRegistry: IViewsRegistry;

	constructor(
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@ILogService private readonly logService: ILogService
	) {
		this.viewContainersRegistry = Registry.as<IViewContainersRegistry>(ViewContainerExtensions.ViewContainersRegistry);
		this.viewsRegistry = Registry.as<IViewsRegistry>(ViewContainerExtensions.ViewsRegistry);
		this.handleAndRegisterCustomViewContainers();
		this.handleAndRegisterCustomViews();
	}

	private handleAndRegisterCustomViewContainers() {
		viewsContainersExtensionPoint.setHandler((extensions, { added, removed }) => {
			if (removed.length) {
				this.removeCustomViewContainers(removed);
			}
			if (added.length) {
				this.addCustomViewContainers(added, this.viewContainersRegistry.all);
			}
		});
	}

	private addCustomViewContainers(extensionPoints: readonly IExtensionPointUser<ViewContainerExtensionPointType>[], existingViewContainers: ViewContainer[]): void {
		const viewContainersRegistry = Registry.as<IViewContainersRegistry>(ViewContainerExtensions.ViewContainersRegistry);
		let activityBarOrder = CUSTOM_VIEWS_START_ORDER + viewContainersRegistry.all.filter(v => !!v.extensionId && viewContainersRegistry.getViewContainerLocation(v) === ViewContainerLocation.Sidebar).length;
		let panelOrder = 5 + viewContainersRegistry.all.filter(v => !!v.extensionId && viewContainersRegistry.getViewContainerLocation(v) === ViewContainerLocation.Panel).length + 1;
		// offset by 100 because the chat view container used to have order 100 (now 1). Due to caching, we still need to account for the original order value
		let auxiliaryBarOrder = 100 + viewContainersRegistry.all.filter(v => !!v.extensionId && viewContainersRegistry.getViewContainerLocation(v) === ViewContainerLocation.AuxiliaryBar).length + 1;
		for (const { value, collector, description } of extensionPoints) {
			Object.entries(value).forEach(([key, value]) => {
				if (!this.isValidViewsContainer(value, collector)) {
					return;
				}
				switch (key) {
					case 'activitybar':
						activityBarOrder = this.registerCustomViewContainers(value, description, activityBarOrder, existingViewContainers, ViewContainerLocation.Sidebar);
						break;
					case 'panel':
						panelOrder = this.registerCustomViewContainers(value, description, panelOrder, existingViewContainers, ViewContainerLocation.Panel);
						break;
					case 'secondarySidebar':
						auxiliaryBarOrder = this.registerCustomViewContainers(value, description, auxiliaryBarOrder, existingViewContainers, ViewContainerLocation.AuxiliaryBar);
						break;
				}
			});
		}
	}

	private removeCustomViewContainers(extensionPoints: readonly IExtensionPointUser<ViewContainerExtensionPointType>[]): void {
		const viewContainersRegistry = Registry.as<IViewContainersRegistry>(ViewContainerExtensions.ViewContainersRegistry);
		const removedExtensions: ExtensionIdentifierSet = extensionPoints.reduce((result, e) => { result.add(e.description.identifier); return result; }, new ExtensionIdentifierSet());
		for (const viewContainer of viewContainersRegistry.all) {
			if (viewContainer.extensionId && removedExtensions.has(viewContainer.extensionId)) {
				// move all views in this container into default view container
				const views = this.viewsRegistry.getViews(viewContainer);
				if (views.length) {
					this.viewsRegistry.moveViews(views, this.getDefaultViewContainer());
				}
				this.deregisterCustomViewContainer(viewContainer);
			}
		}
	}

	private isValidViewsContainer(viewsContainersDescriptors: IUserFriendlyViewsContainerDescriptor[], collector: ExtensionMessageCollector): boolean {
		if (!Array.isArray(viewsContainersDescriptors)) {
			collector.error(localize('viewcontainer requirearray', "views containers must be an array"));
			return false;
		}

		for (const descriptor of viewsContainersDescriptors) {
			if (typeof descriptor.id !== 'string' && isFalsyOrWhitespace(descriptor.id)) {
				collector.error(localize('requireidstring', "property `{0}` is mandatory and must be of type `string` with non-empty value. Only alphanumeric characters, '_', and '-' are allowed.", 'id'));
				return false;
			}
			if (!(/^[a-z0-9_-]+$/i.test(descriptor.id))) {
				collector.error(localize('requireidstring', "property `{0}` is mandatory and must be of type `string` with non-empty value. Only alphanumeric characters, '_', and '-' are allowed.", 'id'));
				return false;
			}
			if (typeof descriptor.title !== 'string') {
				collector.error(localize('requirestring', "property `{0}` is mandatory and must be of type `string`", 'title'));
				return false;
			}
			if (typeof descriptor.icon !== 'string') {
				collector.error(localize('requirestring', "property `{0}` is mandatory and must be of type `string`", 'icon'));
				return false;
			}
			if (isFalsyOrWhitespace(descriptor.title)) {
				collector.warn(localize('requirenonemptystring', "property `{0}` is mandatory and must be of type `string` with non-empty value", 'title'));
				return true;
			}
		}

		return true;
	}

	private registerCustomViewContainers(containers: IUserFriendlyViewsContainerDescriptor[], extension: IExtensionDescription, order: number, existingViewContainers: ViewContainer[], location: ViewContainerLocation): number {
		containers.forEach(descriptor => {
			const themeIcon = ThemeIcon.fromString(descriptor.icon);

			const icon = themeIcon || resources.joinPath(extension.extensionLocation, descriptor.icon);
			const id = `workbench.view.extension.${descriptor.id}`;
			const title = descriptor.title || id;
			const viewContainer = this.registerCustomViewContainer(id, title, icon, order++, extension.identifier, location);

			// Move those views that belongs to this container
			if (existingViewContainers.length) {
				const viewsToMove: IViewDescriptor[] = [];
				for (const existingViewContainer of existingViewContainers) {
					if (viewContainer !== existingViewContainer) {
						viewsToMove.push(...this.viewsRegistry.getViews(existingViewContainer).filter(view => (view as ICustomViewDescriptor).originalContainerId === descriptor.id));
					}
				}
				if (viewsToMove.length) {
					this.viewsRegistry.moveViews(viewsToMove, viewContainer);
				}
			}
		});
		return order;
	}

	private registerCustomViewContainer(id: string, title: string, icon: URI | ThemeIcon, order: number, extensionId: ExtensionIdentifier | undefined, location: ViewContainerLocation): ViewContainer {
		let viewContainer = this.viewContainersRegistry.get(id);

		if (!viewContainer) {

			viewContainer = this.viewContainersRegistry.registerViewContainer({
				id,
				title: { value: title, original: title },
				extensionId,
				ctorDescriptor: new SyncDescriptor(
					ViewPaneContainer,
					[id, { mergeViewWithContainerWhenSingleView: true }]
				),
				hideIfEmpty: true,
				order,
				icon,
			}, location);

		}

		return viewContainer;
	}

	private deregisterCustomViewContainer(viewContainer: ViewContainer): void {
		this.viewContainersRegistry.deregisterViewContainer(viewContainer);
		Registry.as<PaneCompositeRegistry>(ViewletExtensions.Viewlets).deregisterPaneComposite(viewContainer.id);
	}

	private handleAndRegisterCustomViews() {
		viewsExtensionPoint.setHandler((extensions, { added, removed }) => {
			if (removed.length) {
				this.removeViews(removed);
			}
			if (added.length) {
				this.addViews(added);
			}
		});
	}

	private addViews(extensions: readonly IExtensionPointUser<ViewExtensionPointType>[]): void {
		const viewIds: Set<string> = new Set<string>();
		const allViewDescriptors: { views: IViewDescriptor[]; viewContainer: ViewContainer }[] = [];

		for (const extension of extensions) {
			const { value, collector } = extension;

			Object.entries(value).forEach(([key, value]) => {
				if (!this.isValidViewDescriptors(value, collector)) {
					return;
				}

				if (key === 'remote' && !isProposedApiEnabled(extension.description, 'contribViewsRemote')) {
					collector.warn(localize('ViewContainerRequiresProposedAPI', "View container '{0}' requires 'enabledApiProposals: [\"contribViewsRemote\"]' to be added to 'Remote'.", key));
					return;
				}

				if (key === 'agentSessions' && !isProposedApiEnabled(extension.description, 'chatSessionsProvider')) {
					collector.warn(localize('RequiresChatSessionsProposedAPI', "View container '{0}' requires 'enabledApiProposals: [\"chatSessionsProvider\"]'.", key));
					return;
				}

				const viewContainer = this.getViewContainer(key);
				if (!viewContainer) {
					collector.warn(localize('ViewContainerDoesnotExist', "View container '{0}' does not exist and all views registered to it will be added to 'Explorer'.", key));
				}
				const container = viewContainer || this.getDefaultViewContainer();
				const viewDescriptors: ICustomViewDescriptor[] = [];

				for (let index = 0; index < value.length; index++) {
					const item = value[index];
					// validate
					if (viewIds.has(item.id)) {
						collector.error(localize('duplicateView1', "Cannot register multiple views with same id `{0}`", item.id));
						continue;
					}
					if (this.viewsRegistry.getView(item.id) !== null) {
						collector.error(localize('duplicateView2', "A view with id `{0}` is already registered.", item.id));
						continue;
					}

					const order = ExtensionIdentifier.equals(extension.description.identifier, container.extensionId)
						? index + 1
						: container.viewOrderDelegate
							? container.viewOrderDelegate.getOrder(item.group)
							: undefined;

					let icon: ThemeIcon | URI | undefined;
					if (typeof item.icon === 'string') {
						icon = ThemeIcon.fromString(item.icon) || resources.joinPath(extension.description.extensionLocation, item.icon);
					}

					const initialVisibility = this.convertInitialVisibility(item.visibility);

					const type = this.getViewType(item.type);
					if (!type) {
						collector.error(localize('unknownViewType', "Unknown view type `{0}`.", item.type));
						continue;
					}

					let weight: number | undefined = undefined;
					if (typeof item.initialSize === 'number') {
						if (container.extensionId?.value === extension.description.identifier.value) {
							weight = item.initialSize;
						} else {
							this.logService.warn(`${extension.description.identifier.value} tried to set the view size of ${item.id} but it was ignored because the view container does not belong to it.`);
						}
					}

					let accessibilityHelpContent;
					if (isProposedApiEnabled(extension.description, 'contribAccessibilityHelpContent') && item.accessibilityHelpContent) {
						accessibilityHelpContent = new MarkdownString(item.accessibilityHelpContent);
					}

					const viewDescriptor: ICustomViewDescriptor = {
						type: type,
						ctorDescriptor: type === ViewType.Tree ? new SyncDescriptor(TreeViewPane) : new SyncDescriptor(WebviewViewPane),
						id: item.id,
						name: { value: item.name, original: item.name },
						when: ContextKeyExpr.deserialize(item.when),
						containerIcon: icon || viewContainer?.icon,
						containerTitle: item.contextualTitle || (viewContainer && (typeof viewContainer.title === 'string' ? viewContainer.title : viewContainer.title.value)),
						canToggleVisibility: true,
						canMoveView: viewContainer?.id !== REMOTE,
						treeView: type === ViewType.Tree ? this.instantiationService.createInstance(CustomTreeView, item.id, item.name, extension.description.identifier.value) : undefined,
						collapsed: this.showCollapsed(container) || initialVisibility === InitialVisibility.Collapsed,
						order: order,
						extensionId: extension.description.identifier,
						originalContainerId: key,
						group: item.group,
						// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
						remoteAuthority: item.remoteName || (<any>item).remoteAuthority, // TODO@roblou - delete after remote extensions are updated
						virtualWorkspace: item.virtualWorkspace,
						hideByDefault: initialVisibility === InitialVisibility.Hidden,
						workspace: viewContainer?.id === REMOTE ? true : undefined,
						weight,
						accessibilityHelpContent
					};


					viewIds.add(viewDescriptor.id);
					viewDescriptors.push(viewDescriptor);
				}

				allViewDescriptors.push({ viewContainer: container, views: viewDescriptors });

			});
		}

		this.viewsRegistry.registerViews2(allViewDescriptors);
	}

	private getViewType(type: string | undefined): ViewType | undefined {
		if (type === ViewType.Webview) {
			return ViewType.Webview;
		}
		if (!type || type === ViewType.Tree) {
			return ViewType.Tree;
		}
		return undefined;
	}

	private getDefaultViewContainer(): ViewContainer {
		return this.viewContainersRegistry.get(EXPLORER)!;
	}

	private removeViews(extensions: readonly IExtensionPointUser<ViewExtensionPointType>[]): void {
		const removedExtensions: ExtensionIdentifierSet = extensions.reduce((result, e) => { result.add(e.description.identifier); return result; }, new ExtensionIdentifierSet());
		for (const viewContainer of this.viewContainersRegistry.all) {
			const removedViews = this.viewsRegistry.getViews(viewContainer).filter(v => (v as ICustomViewDescriptor).extensionId && removedExtensions.has((v as ICustomViewDescriptor).extensionId));
			if (removedViews.length) {
				this.viewsRegistry.deregisterViews(removedViews, viewContainer);
				for (const view of removedViews) {
					const anyView = view as ICustomViewDescriptor;
					if (anyView.treeView) {
						anyView.treeView.dispose();
					}
				}
			}
		}
	}

	private convertInitialVisibility(value: string | undefined): InitialVisibility | undefined {
		if (Object.values(InitialVisibility).includes(value as InitialVisibility)) {
			return value as InitialVisibility;
		}
		return undefined;
	}

	private isValidViewDescriptors(viewDescriptors: IUserFriendlyViewDescriptor[], collector: ExtensionMessageCollector): boolean {
		if (!Array.isArray(viewDescriptors)) {
			collector.error(localize('requirearray', "views must be an array"));
			return false;
		}

		for (const descriptor of viewDescriptors) {
			if (typeof descriptor.id !== 'string') {
				collector.error(localize('requirestring', "property `{0}` is mandatory and must be of type `string`", 'id'));
				return false;
			}
			if (typeof descriptor.name !== 'string') {
				collector.error(localize('requirestring', "property `{0}` is mandatory and must be of type `string`", 'name'));
				return false;
			}
			if (descriptor.when && typeof descriptor.when !== 'string') {
				collector.error(localize('optstring', "property `{0}` can be omitted or must be of type `string`", 'when'));
				return false;
			}
			if (descriptor.icon && typeof descriptor.icon !== 'string') {
				collector.error(localize('optstring', "property `{0}` can be omitted or must be of type `string`", 'icon'));
				return false;
			}
			if (descriptor.contextualTitle && typeof descriptor.contextualTitle !== 'string') {
				collector.error(localize('optstring', "property `{0}` can be omitted or must be of type `string`", 'contextualTitle'));
				return false;
			}
			if (descriptor.visibility && !this.convertInitialVisibility(descriptor.visibility)) {
				collector.error(localize('optenum', "property `{0}` can be omitted or must be one of {1}", 'visibility', Object.values(InitialVisibility).join(', ')));
				return false;
			}
		}

		return true;
	}

	private getViewContainer(value: string): ViewContainer | undefined {
		switch (value) {
			case 'explorer': return this.viewContainersRegistry.get(EXPLORER);
			case 'debug': return this.viewContainersRegistry.get(DEBUG);
			case 'scm': return this.viewContainersRegistry.get(SCM);
			case 'remote': return this.viewContainersRegistry.get(REMOTE);
			default: return this.viewContainersRegistry.get(`workbench.view.extension.${value}`);
		}
	}

	private showCollapsed(container: ViewContainer): boolean {
		switch (container.id) {
			case EXPLORER:
			case SCM:
			case DEBUG:
				return true;
		}
		return false;
	}
}

class ViewContainersDataRenderer extends Disposable implements IExtensionFeatureTableRenderer {

	readonly type = 'table';

	shouldRender(manifest: IExtensionManifest): boolean {
		return !!manifest.contributes?.viewsContainers;
	}

	render(manifest: IExtensionManifest): IRenderedData<ITableData> {
		const contrib = manifest.contributes?.viewsContainers || {};

		const viewContainers = Object.keys(contrib).reduce((result, location) => {
			const viewContainersForLocation = contrib[location];
			result.push(...viewContainersForLocation.map(viewContainer => ({ ...viewContainer, location })));
			return result;
		}, [] as Array<{ id: string; title: string; location: string }>);

		if (!viewContainers.length) {
			return { data: { headers: [], rows: [] }, dispose: () => { } };
		}

		const headers = [
			localize('view container id', "ID"),
			localize('view container title', "Title"),
			localize('view container location', "Where"),
		];

		const rows: IRowData[][] = viewContainers
			.sort((a, b) => a.id.localeCompare(b.id))
			.map(viewContainer => {
				return [
					viewContainer.id,
					viewContainer.title,
					viewContainer.location
				];
			});

		return {
			data: {
				headers,
				rows
			},
			dispose: () => { }
		};
	}
}

class ViewsDataRenderer extends Disposable implements IExtensionFeatureTableRenderer {

	readonly type = 'table';

	shouldRender(manifest: IExtensionManifest): boolean {
		return !!manifest.contributes?.views;
	}

	render(manifest: IExtensionManifest): IRenderedData<ITableData> {
		const contrib = manifest.contributes?.views || {};

		const views = Object.keys(contrib).reduce((result, location) => {
			const viewsForLocation = contrib[location];
			result.push(...viewsForLocation.map(view => ({ ...view, location })));
			return result;
		}, [] as Array<{ id: string; name: string; location: string }>);

		if (!views.length) {
			return { data: { headers: [], rows: [] }, dispose: () => { } };
		}

		const headers = [
			localize('view id', "ID"),
			localize('view name title', "Name"),
			localize('view container location', "Where"),
		];

		const rows: IRowData[][] = views
			.sort((a, b) => a.id.localeCompare(b.id))
			.map(view => {
				return [
					view.id,
					view.name,
					view.location
				];
			});

		return {
			data: {
				headers,
				rows
			},
			dispose: () => { }
		};
	}
}

Registry.as<IExtensionFeaturesRegistry>(ExtensionFeaturesRegistryExtensions.ExtensionFeaturesRegistry).registerExtensionFeature({
	id: 'viewsContainers',
	label: localize('viewsContainers', "View Containers"),
	access: {
		canToggle: false
	},
	renderer: new SyncDescriptor(ViewContainersDataRenderer),
});

Registry.as<IExtensionFeaturesRegistry>(ExtensionFeaturesRegistryExtensions.ExtensionFeaturesRegistry).registerExtensionFeature({
	id: 'views',
	label: localize('views', "Views"),
	access: {
		canToggle: false
	},
	renderer: new SyncDescriptor(ViewsDataRenderer),
});

registerWorkbenchContribution2(ViewsExtensionHandler.ID, ViewsExtensionHandler, WorkbenchPhase.BlockStartup);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/cache.ts]---
Location: vscode-main/src/vs/workbench/api/common/cache.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export class Cache<T> {

	private static readonly enableDebugLogging = false;

	private readonly _data = new Map<number, readonly T[]>();
	private _idPool = 1;

	constructor(
		private readonly id: string
	) { }

	add(item: readonly T[]): number {
		const id = this._idPool++;
		this._data.set(id, item);
		this.logDebugInfo();
		return id;
	}

	get(pid: number, id: number): T | undefined {
		return this._data.has(pid) ? this._data.get(pid)![id] : undefined;
	}

	delete(id: number) {
		this._data.delete(id);
		this.logDebugInfo();
	}

	private logDebugInfo() {
		if (!Cache.enableDebugLogging) {
			return;
		}
		console.log(`${this.id} cache size - ${this._data.size}`);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/configurationExtensionPoint.ts]---
Location: vscode-main/src/vs/workbench/api/common/configurationExtensionPoint.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../nls.js';
import * as objects from '../../../base/common/objects.js';
import { Registry } from '../../../platform/registry/common/platform.js';
import { IJSONSchema } from '../../../base/common/jsonSchema.js';
import { ExtensionsRegistry, IExtensionPointUser } from '../../services/extensions/common/extensionsRegistry.js';
import { IConfigurationNode, IConfigurationRegistry, Extensions, validateProperty, ConfigurationScope, OVERRIDE_PROPERTY_REGEX, IConfigurationDefaults, configurationDefaultsSchemaId, IConfigurationDelta, getDefaultValue, getAllConfigurationProperties, parseScope, EXTENSION_UNIFICATION_EXTENSION_IDS, overrideIdentifiersFromKey } from '../../../platform/configuration/common/configurationRegistry.js';
import { IJSONContributionRegistry, Extensions as JSONExtensions } from '../../../platform/jsonschemas/common/jsonContributionRegistry.js';
import { workspaceSettingsSchemaId, launchSchemaId, tasksSchemaId, mcpSchemaId } from '../../services/configuration/common/configuration.js';
import { isObject, isUndefined } from '../../../base/common/types.js';
import { ExtensionIdentifierMap, IExtensionManifest } from '../../../platform/extensions/common/extensions.js';
import { IStringDictionary } from '../../../base/common/collections.js';
import { Extensions as ExtensionFeaturesExtensions, IExtensionFeatureTableRenderer, IExtensionFeaturesRegistry, IRenderedData, IRowData, ITableData } from '../../services/extensionManagement/common/extensionFeatures.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { SyncDescriptor } from '../../../platform/instantiation/common/descriptors.js';
import { MarkdownString } from '../../../base/common/htmlContent.js';
import product from '../../../platform/product/common/product.js';

const jsonRegistry = Registry.as<IJSONContributionRegistry>(JSONExtensions.JSONContribution);
const configurationRegistry = Registry.as<IConfigurationRegistry>(Extensions.Configuration);

const configurationEntrySchema: IJSONSchema = {
	type: 'object',
	defaultSnippets: [{ body: { title: '', properties: {} } }],
	properties: {
		title: {
			description: nls.localize('vscode.extension.contributes.configuration.title', 'A title for the current category of settings. This label will be rendered in the Settings editor as a subheading. If the title is the same as the extension display name, then the category will be grouped under the main extension heading.'),
			type: 'string'
		},
		order: {
			description: nls.localize('vscode.extension.contributes.configuration.order', 'When specified, gives the order of this category of settings relative to other categories.'),
			type: 'integer'
		},
		properties: {
			description: nls.localize('vscode.extension.contributes.configuration.properties', 'Description of the configuration properties.'),
			type: 'object',
			propertyNames: {
				pattern: '\\S+',
				patternErrorMessage: nls.localize('vscode.extension.contributes.configuration.property.empty', 'Property should not be empty.'),
			},
			additionalProperties: {
				anyOf: [
					{
						title: nls.localize('vscode.extension.contributes.configuration.properties.schema', 'Schema of the configuration property.'),
						$ref: 'http://json-schema.org/draft-07/schema#'
					},
					{
						type: 'object',
						properties: {
							scope: {
								type: 'string',
								enum: ['application', 'machine', 'window', 'resource', 'language-overridable', 'machine-overridable'],
								default: 'window',
								enumDescriptions: [
									nls.localize('scope.application.description', "Configuration that can be configured only in the user settings."),
									nls.localize('scope.machine.description', "Configuration that can be configured only in the user settings or only in the remote settings."),
									nls.localize('scope.window.description', "Configuration that can be configured in the user, remote or workspace settings."),
									nls.localize('scope.resource.description', "Configuration that can be configured in the user, remote, workspace or folder settings."),
									nls.localize('scope.language-overridable.description', "Resource configuration that can be configured in language specific settings."),
									nls.localize('scope.machine-overridable.description', "Machine configuration that can be configured also in workspace or folder settings.")
								],
								markdownDescription: nls.localize('scope.description', "Scope in which the configuration is applicable. Available scopes are `application`, `machine`, `window`, `resource`, and `machine-overridable`.")
							},
							enumDescriptions: {
								type: 'array',
								items: {
									type: 'string',
								},
								description: nls.localize('scope.enumDescriptions', 'Descriptions for enum values')
							},
							markdownEnumDescriptions: {
								type: 'array',
								items: {
									type: 'string',
								},
								description: nls.localize('scope.markdownEnumDescriptions', 'Descriptions for enum values in the markdown format.')
							},
							enumItemLabels: {
								type: 'array',
								items: {
									type: 'string'
								},
								markdownDescription: nls.localize('scope.enumItemLabels', 'Labels for enum values to be displayed in the Settings editor. When specified, the {0} values still show after the labels, but less prominently.', '`enum`')
							},
							markdownDescription: {
								type: 'string',
								description: nls.localize('scope.markdownDescription', 'The description in the markdown format.')
							},
							deprecationMessage: {
								type: 'string',
								description: nls.localize('scope.deprecationMessage', 'If set, the property is marked as deprecated and the given message is shown as an explanation.')
							},
							markdownDeprecationMessage: {
								type: 'string',
								description: nls.localize('scope.markdownDeprecationMessage', 'If set, the property is marked as deprecated and the given message is shown as an explanation in the markdown format.')
							},
							editPresentation: {
								type: 'string',
								enum: ['singlelineText', 'multilineText'],
								enumDescriptions: [
									nls.localize('scope.singlelineText.description', 'The value will be shown in an inputbox.'),
									nls.localize('scope.multilineText.description', 'The value will be shown in a textarea.')
								],
								default: 'singlelineText',
								description: nls.localize('scope.editPresentation', 'When specified, controls the presentation format of the string setting.')
							},
							order: {
								type: 'integer',
								description: nls.localize('scope.order', 'When specified, gives the order of this setting relative to other settings within the same category. Settings with an order property will be placed before settings without this property set.')
							},
							ignoreSync: {
								type: 'boolean',
								description: nls.localize('scope.ignoreSync', 'When enabled, Settings Sync will not sync the user value of this configuration by default.')
							},
							tags: {
								type: 'array',
								items: {
									type: 'string',
									enum: [
										'accessibility',
										'advanced',
										'experimental',
										'telemetry',
										'usesOnlineServices',
									],
									enumDescriptions: [
										nls.localize('accessibility', 'Accessibility settings'),
										nls.localize('advanced', 'Advanced settings are hidden by default in the Settings editor unless the user chooses to show advanced settings.'),
										nls.localize('experimental', 'Experimental settings are subject to change and may be removed in future releases.'),
										nls.localize('preview', 'Preview settings can be used to try out new features before they are finalized.'),
										nls.localize('telemetry', 'Telemetry settings'),
										nls.localize('usesOnlineServices', 'Settings that use online services')
									],
								},
								additionalItems: true,
								markdownDescription: nls.localize('scope.tags', 'A list of tags under which to place the setting. The tag can then be searched up in the Settings editor. For example, specifying the `experimental` tag allows one to find the setting by searching `@tag:experimental`.'),
							}
						}
					}
				]
			}
		}
	}
};

// build up a delta across two ext points and only apply it once
let _configDelta: IConfigurationDelta | undefined;


// BEGIN VSCode extension point `configurationDefaults`
const defaultConfigurationExtPoint = ExtensionsRegistry.registerExtensionPoint<IStringDictionary<IStringDictionary<unknown>>>({
	extensionPoint: 'configurationDefaults',
	jsonSchema: {
		$ref: configurationDefaultsSchemaId,
	},
	canHandleResolver: true
});
defaultConfigurationExtPoint.setHandler((extensions, { added, removed }) => {

	if (_configDelta) {
		// HIGHLY unlikely, but just in case
		configurationRegistry.deltaConfiguration(_configDelta);
	}

	const configNow = _configDelta = {};
	// schedule a HIGHLY unlikely task in case only the default configurations EXT point changes
	queueMicrotask(() => {
		if (_configDelta === configNow) {
			configurationRegistry.deltaConfiguration(_configDelta);
			_configDelta = undefined;
		}
	});

	if (removed.length) {
		const removedDefaultConfigurations = removed.map<IConfigurationDefaults>(extension => ({ overrides: objects.deepClone(extension.value), source: { id: extension.description.identifier.value, displayName: extension.description.displayName } }));
		_configDelta.removedDefaults = removedDefaultConfigurations;
	}
	if (added.length) {
		const registeredProperties = configurationRegistry.getConfigurationProperties();
		const allowedScopes = [ConfigurationScope.MACHINE_OVERRIDABLE, ConfigurationScope.WINDOW, ConfigurationScope.RESOURCE, ConfigurationScope.LANGUAGE_OVERRIDABLE];
		const addedDefaultConfigurations = added.map<IConfigurationDefaults>(extension => {
			const overrides = objects.deepClone(extension.value);
			for (const key of Object.keys(overrides)) {
				const registeredPropertyScheme = registeredProperties[key];
				if (registeredPropertyScheme?.disallowConfigurationDefault) {
					extension.collector.warn(nls.localize('config.property.preventDefaultConfiguration.warning', "Cannot register configuration defaults for '{0}'. This setting does not allow contributing configuration defaults.", key));
					delete overrides[key];
					continue;
				}
				if (!OVERRIDE_PROPERTY_REGEX.test(key)) {
					if (registeredPropertyScheme?.scope && !allowedScopes.includes(registeredPropertyScheme.scope)) {
						extension.collector.warn(nls.localize('config.property.defaultConfiguration.warning', "Cannot register configuration defaults for '{0}'. Only defaults for machine-overridable, window, resource and language overridable scoped settings are supported.", key));
						delete overrides[key];
						continue;
					}
				}
			}
			return { overrides, source: { id: extension.description.identifier.value, displayName: extension.description.displayName } };
		});
		_configDelta.addedDefaults = addedDefaultConfigurations;
	}
});
// END VSCode extension point `configurationDefaults`


// BEGIN VSCode extension point `configuration`
const configurationExtPoint = ExtensionsRegistry.registerExtensionPoint<IConfigurationNode>({
	extensionPoint: 'configuration',
	deps: [defaultConfigurationExtPoint],
	jsonSchema: {
		description: nls.localize('vscode.extension.contributes.configuration', 'Contributes configuration settings.'),
		oneOf: [
			configurationEntrySchema,
			{
				type: 'array',
				items: configurationEntrySchema
			}
		]
	},
	canHandleResolver: true
});

const extensionConfigurations: ExtensionIdentifierMap<IConfigurationNode[]> = new ExtensionIdentifierMap<IConfigurationNode[]>();

configurationExtPoint.setHandler((extensions, { added, removed }) => {

	// HIGHLY unlikely (only configuration but not defaultConfiguration EXT point changes)
	_configDelta ??= {};

	if (removed.length) {
		const removedConfigurations: IConfigurationNode[] = [];
		for (const extension of removed) {
			removedConfigurations.push(...(extensionConfigurations.get(extension.description.identifier) || []));
			extensionConfigurations.delete(extension.description.identifier);
		}
		_configDelta.removedConfigurations = removedConfigurations;
	}

	const seenProperties = new Set<string>();

	function handleConfiguration(node: IConfigurationNode, extension: IExtensionPointUser<unknown>): IConfigurationNode {
		const configuration = objects.deepClone(node);

		if (configuration.title && (typeof configuration.title !== 'string')) {
			extension.collector.error(nls.localize('invalid.title', "'configuration.title' must be a string"));
		}

		validateProperties(configuration, extension);

		configuration.id = node.id || extension.description.identifier.value;
		configuration.extensionInfo = { id: extension.description.identifier.value, displayName: extension.description.displayName };
		configuration.restrictedProperties = extension.description.capabilities?.untrustedWorkspaces?.supported === 'limited' ? extension.description.capabilities?.untrustedWorkspaces.restrictedConfigurations : undefined;
		configuration.title = configuration.title || extension.description.displayName || extension.description.identifier.value;
		return configuration;
	}

	function validateProperties(configuration: IConfigurationNode, extension: IExtensionPointUser<unknown>): void {
		const properties = configuration.properties;
		const extensionConfigurationPolicy = product.extensionConfigurationPolicy;
		if (properties) {
			if (typeof properties !== 'object') {
				extension.collector.error(nls.localize('invalid.properties', "'configuration.properties' must be an object"));
				configuration.properties = {};
			}
			for (const key in properties) {
				const propertyConfiguration = properties[key];
				const message = validateProperty(key, propertyConfiguration, extension.description.identifier.value);
				if (message) {
					delete properties[key];
					extension.collector.warn(message);
					continue;
				}
				if (seenProperties.has(key) && !EXTENSION_UNIFICATION_EXTENSION_IDS.has(extension.description.identifier.value.toLowerCase())) {
					delete properties[key];
					extension.collector.warn(nls.localize('config.property.duplicate', "Cannot register '{0}'. This property is already registered.", key));
					continue;
				}
				if (!isObject(propertyConfiguration)) {
					delete properties[key];
					extension.collector.error(nls.localize('invalid.property', "configuration.properties property '{0}' must be an object", key));
					continue;
				}
				if (extensionConfigurationPolicy?.[key]) {
					propertyConfiguration.policy = extensionConfigurationPolicy?.[key];
				}
				if (propertyConfiguration.tags?.some(tag => tag.toLowerCase() === 'onexp')) {
					propertyConfiguration.experiment = {
						mode: 'startup'
					};
				}
				seenProperties.add(key);
				propertyConfiguration.scope = propertyConfiguration.scope ? parseScope(propertyConfiguration.scope.toString()) : ConfigurationScope.WINDOW;
			}
		}
		const subNodes = configuration.allOf;
		if (subNodes) {
			extension.collector.error(nls.localize('invalid.allOf', "'configuration.allOf' is deprecated and should no longer be used. Instead, pass multiple configuration sections as an array to the 'configuration' contribution point."));
			for (const node of subNodes) {
				validateProperties(node, extension);
			}
		}
	}

	if (added.length) {
		const addedConfigurations: IConfigurationNode[] = [];
		for (const extension of added) {
			const configurations: IConfigurationNode[] = [];
			const value = <IConfigurationNode | IConfigurationNode[]>extension.value;
			if (Array.isArray(value)) {
				value.forEach(v => configurations.push(handleConfiguration(v, extension)));
			} else {
				configurations.push(handleConfiguration(value, extension));
			}
			extensionConfigurations.set(extension.description.identifier, configurations);
			addedConfigurations.push(...configurations);
		}

		_configDelta.addedConfigurations = addedConfigurations;
	}

	configurationRegistry.deltaConfiguration(_configDelta);
	_configDelta = undefined;
});
// END VSCode extension point `configuration`

jsonRegistry.registerSchema('vscode://schemas/workspaceConfig', {
	allowComments: true,
	allowTrailingCommas: true,
	default: {
		folders: [
			{
				path: ''
			}
		],
		settings: {
		}
	},
	required: ['folders'],
	properties: {
		'folders': {
			minItems: 0,
			uniqueItems: true,
			description: nls.localize('workspaceConfig.folders.description', "List of folders to be loaded in the workspace."),
			items: {
				type: 'object',
				defaultSnippets: [{ body: { path: '$1' } }],
				oneOf: [{
					properties: {
						path: {
							type: 'string',
							description: nls.localize('workspaceConfig.path.description', "A file path. e.g. `/root/folderA` or `./folderA` for a relative path that will be resolved against the location of the workspace file.")
						},
						name: {
							type: 'string',
							description: nls.localize('workspaceConfig.name.description', "An optional name for the folder. ")
						}
					},
					required: ['path']
				}, {
					properties: {
						uri: {
							type: 'string',
							description: nls.localize('workspaceConfig.uri.description', "URI of the folder")
						},
						name: {
							type: 'string',
							description: nls.localize('workspaceConfig.name.description', "An optional name for the folder. ")
						}
					},
					required: ['uri']
				}]
			}
		},
		'settings': {
			type: 'object',
			default: {},
			description: nls.localize('workspaceConfig.settings.description', "Workspace settings"),
			$ref: workspaceSettingsSchemaId
		},
		'launch': {
			type: 'object',
			default: { configurations: [], compounds: [] },
			description: nls.localize('workspaceConfig.launch.description', "Workspace launch configurations"),
			$ref: launchSchemaId
		},
		'tasks': {
			type: 'object',
			default: { version: '2.0.0', tasks: [] },
			description: nls.localize('workspaceConfig.tasks.description', "Workspace task configurations"),
			$ref: tasksSchemaId
		},
		'mcp': {
			type: 'object',
			default: {
				inputs: [],
				servers: {
					'mcp-server-time': {
						command: 'uvx',
						args: ['mcp_server_time', '--local-timezone=America/Los_Angeles']
					}
				}
			},
			description: nls.localize('workspaceConfig.mcp.description', "Model Context Protocol server configurations"),
			$ref: mcpSchemaId
		},
		'extensions': {
			type: 'object',
			default: {},
			description: nls.localize('workspaceConfig.extensions.description', "Workspace extensions"),
			$ref: 'vscode://schemas/extensions'
		},
		'remoteAuthority': {
			type: 'string',
			doNotSuggest: true,
			description: nls.localize('workspaceConfig.remoteAuthority', "The remote server where the workspace is located."),
		},
		'transient': {
			type: 'boolean',
			doNotSuggest: true,
			description: nls.localize('workspaceConfig.transient', "A transient workspace will disappear when restarting or reloading."),
		}
	},
	errorMessage: nls.localize('unknownWorkspaceProperty', "Unknown workspace configuration property")
});


class SettingsTableRenderer extends Disposable implements IExtensionFeatureTableRenderer {

	readonly type = 'table';

	shouldRender(manifest: IExtensionManifest): boolean {
		return !!manifest.contributes?.configuration;
	}

	render(manifest: IExtensionManifest): IRenderedData<ITableData> {
		const configuration: IConfigurationNode[] = manifest.contributes?.configuration
			? Array.isArray(manifest.contributes.configuration) ? manifest.contributes.configuration : [manifest.contributes.configuration]
			: [];

		const properties = getAllConfigurationProperties(configuration);

		const contrib = properties ? Object.keys(properties) : [];
		const headers = [nls.localize('setting name', "ID"), nls.localize('description', "Description"), nls.localize('default', "Default")];
		const rows: IRowData[][] = contrib.sort((a, b) => a.localeCompare(b))
			.map(key => {
				return [
					new MarkdownString().appendMarkdown(`\`${key}\``),
					properties[key].markdownDescription ? new MarkdownString(properties[key].markdownDescription, false) : properties[key].description ?? '',
					new MarkdownString().appendCodeblock('json', JSON.stringify(isUndefined(properties[key].default) ? getDefaultValue(properties[key].type) : properties[key].default, null, 2)),
				];
			});

		return {
			data: {
				headers,
				rows
			},
			dispose: () => { }
		};
	}
}

Registry.as<IExtensionFeaturesRegistry>(ExtensionFeaturesExtensions.ExtensionFeaturesRegistry).registerExtensionFeature({
	id: 'configuration',
	label: nls.localize('settings', "Settings"),
	access: {
		canToggle: false
	},
	renderer: new SyncDescriptor(SettingsTableRenderer),
});

class ConfigurationDefaultsTableRenderer extends Disposable implements IExtensionFeatureTableRenderer {

	readonly type = 'table';

	shouldRender(manifest: IExtensionManifest): boolean {
		return !!manifest.contributes?.configurationDefaults;
	}

	render(manifest: IExtensionManifest): IRenderedData<ITableData> {
		const configurationDefaults = manifest.contributes?.configurationDefaults ?? {};

		const headers = [nls.localize('language', "Languages"), nls.localize('setting', "Setting"), nls.localize('default override value', "Override Value")];
		const rows: IRowData[][] = [];

		for (const key of Object.keys(configurationDefaults).sort((a, b) => a.localeCompare(b))) {
			const value = configurationDefaults[key];
			if (OVERRIDE_PROPERTY_REGEX.test(key)) {
				const languages = overrideIdentifiersFromKey(key);
				const languageMarkdown = new MarkdownString().appendMarkdown(`${languages.join(', ')}`);
				for (const key of Object.keys(value).sort((a, b) => a.localeCompare(b))) {
					const row: IRowData[] = [];
					row.push(languageMarkdown);
					row.push(new MarkdownString().appendMarkdown(`\`${key}\``));
					row.push(new MarkdownString().appendCodeblock('json', JSON.stringify(value[key], null, 2)));
					rows.push(row);
				}
			} else {
				const row: IRowData[] = [];
				row.push('');
				row.push(new MarkdownString().appendMarkdown(`\`${key}\``));
				row.push(new MarkdownString().appendCodeblock('json', JSON.stringify(value, null, 2)));
				rows.push(row);
			}
		}

		return {
			data: {
				headers,
				rows
			},
			dispose: () => { }
		};
	}
}

Registry.as<IExtensionFeaturesRegistry>(ExtensionFeaturesExtensions.ExtensionFeaturesRegistry).registerExtensionFeature({
	id: 'configurationDefaults',
	label: nls.localize('settings default overrides', "Settings Default Overrides"),
	access: {
		canToggle: false
	},
	renderer: new SyncDescriptor(ConfigurationDefaultsTableRenderer),
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extensionHostMain.ts]---
Location: vscode-main/src/vs/workbench/api/common/extensionHostMain.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as errors from '../../../base/common/errors.js';
import * as performance from '../../../base/common/performance.js';
import { URI } from '../../../base/common/uri.js';
import { IURITransformer } from '../../../base/common/uriIpc.js';
import { IMessagePassingProtocol } from '../../../base/parts/ipc/common/ipc.js';
import { MainContext, MainThreadConsoleShape } from './extHost.protocol.js';
import { IExtensionHostInitData } from '../../services/extensions/common/extensionHostProtocol.js';
import { RPCProtocol } from '../../services/extensions/common/rpcProtocol.js';
import { ExtensionError, ExtensionIdentifier, IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { getSingletonServiceDescriptors } from '../../../platform/instantiation/common/extensions.js';
import { ServiceCollection } from '../../../platform/instantiation/common/serviceCollection.js';
import { IExtHostInitDataService } from './extHostInitDataService.js';
import { InstantiationService } from '../../../platform/instantiation/common/instantiationService.js';
import { IInstantiationService, ServicesAccessor } from '../../../platform/instantiation/common/instantiation.js';
import { IExtHostRpcService, ExtHostRpcService } from './extHostRpcService.js';
import { IURITransformerService, URITransformerService } from './extHostUriTransformerService.js';
import { IExtHostExtensionService, IHostUtils } from './extHostExtensionService.js';
import { IExtHostTelemetry } from './extHostTelemetry.js';
import { Mutable } from '../../../base/common/types.js';
import { IExtHostApiDeprecationService } from './extHostApiDeprecationService.js';

export interface IExitFn {
	(code?: number): any;
}

export interface IConsolePatchFn {
	(mainThreadConsole: MainThreadConsoleShape): any;
}

export abstract class ErrorHandler {

	static async installEarlyHandler(accessor: ServicesAccessor): Promise<void> {

		// increase number of stack frames (from 10, https://github.com/v8/v8/wiki/Stack-Trace-API)
		Error.stackTraceLimit = 100;

		// does NOT dependent of extension information, can be installed immediately, and simply forwards
		// to the log service and main thread errors
		const logService = accessor.get(ILogService);
		const rpcService = accessor.get(IExtHostRpcService);
		const mainThreadErrors = rpcService.getProxy(MainContext.MainThreadErrors);

		errors.setUnexpectedErrorHandler(err => {
			logService.error(err);
			const data = errors.transformErrorForSerialization(err);
			mainThreadErrors.$onUnexpectedError(data);
		});
	}

	static async installFullHandler(accessor: ServicesAccessor): Promise<void> {
		// uses extension knowledges to correlate errors with extensions

		const logService = accessor.get(ILogService);
		const rpcService = accessor.get(IExtHostRpcService);
		const extensionService = accessor.get(IExtHostExtensionService);
		const extensionTelemetry = accessor.get(IExtHostTelemetry);
		const apiDeprecationService = accessor.get(IExtHostApiDeprecationService);

		const mainThreadExtensions = rpcService.getProxy(MainContext.MainThreadExtensionService);
		const mainThreadErrors = rpcService.getProxy(MainContext.MainThreadErrors);

		const extensionsRegistry = await extensionService.getExtensionRegistry();
		const extensionsMap = await extensionService.getExtensionPathIndex();
		const extensionErrors = new WeakMap<Error, { extensionIdentifier: ExtensionIdentifier | undefined; stack: string }>();

		// PART 1
		// set the prepareStackTrace-handle and use it as a side-effect to associate errors
		// with extensions - this works by looking up callsites in the extension path index
		function prepareStackTraceAndFindExtension(error: Error, stackTrace: errors.V8CallSite[]) {
			if (extensionErrors.has(error)) {
				return extensionErrors.get(error)!.stack;
			}
			let stackTraceMessage = '';
			let extension: IExtensionDescription | undefined;
			let fileName: string | null;
			for (const call of stackTrace) {
				stackTraceMessage += `\n\tat ${call.toString()}`;
				fileName = call.getFileName();
				if (!extension && fileName) {
					extension = extensionsMap.findSubstr(URI.file(fileName));
				}
			}
			const result = `${error.name || 'Error'}: ${error.message || ''}${stackTraceMessage}`;
			extensionErrors.set(error, { extensionIdentifier: extension?.identifier, stack: result });
			return result;
		}

		const _wasWrapped = Symbol('prepareStackTrace wrapped');
		let _prepareStackTrace = prepareStackTraceAndFindExtension;

		Object.defineProperty(Error, 'prepareStackTrace', {
			configurable: false,
			get() {
				return _prepareStackTrace;
			},
			set(v) {
				if (v === prepareStackTraceAndFindExtension || !v || v[_wasWrapped]) {
					_prepareStackTrace = v || prepareStackTraceAndFindExtension;
					return;
				}

				_prepareStackTrace = function (error, stackTrace) {
					prepareStackTraceAndFindExtension(error, stackTrace);
					return v.call(Error, error, stackTrace);
				};

				Object.assign(_prepareStackTrace, { [_wasWrapped]: true });
			},
		});

		// PART 2
		// set the unexpectedErrorHandler and check for extensions that have been identified as
		// having caused the error. Note that the runtime order is actually reversed, the code
		// below accesses the stack-property which triggers the code above
		errors.setUnexpectedErrorHandler(err => {

			if (!errors.PendingMigrationError.is(err)) {
				logService.error(err);
			}

			const errorData = errors.transformErrorForSerialization(err);

			let extension: ExtensionIdentifier | undefined;
			if (err instanceof ExtensionError) {
				extension = err.extension;
			} else {
				const stackData = extensionErrors.get(err);
				extension = stackData?.extensionIdentifier;
			}

			if (!extension) {
				return;
			}

			if (errors.PendingMigrationError.is(err)) {
				// report pending migration via the API deprecation service which (1) informs the extensions author during
				// dev-time and (2) collects telemetry so that we can reach out too
				const extensionDesc = extensionsRegistry.getExtensionDescription(extension);
				if (extensionDesc) {
					apiDeprecationService.report(err.name, extensionDesc, `${err.message}\n FROM: ${err.stack}`);
				}
			} else {
				mainThreadExtensions.$onExtensionRuntimeError(extension, errorData);
				const reported = extensionTelemetry.onExtensionError(extension, err);
				logService.trace('forwarded error to extension?', reported, extension);
			}
		});

		errors.errorHandler.addListener(err => {
			mainThreadErrors.$onUnexpectedError(err);
		});
	}
}

export class ExtensionHostMain {

	private readonly _hostUtils: IHostUtils;
	private readonly _rpcProtocol: RPCProtocol;
	private readonly _extensionService: IExtHostExtensionService;
	private readonly _logService: ILogService;

	constructor(
		protocol: IMessagePassingProtocol,
		initData: IExtensionHostInitData,
		hostUtils: IHostUtils,
		uriTransformer: IURITransformer | null,
		messagePorts?: ReadonlyMap<string, MessagePort>
	) {
		this._hostUtils = hostUtils;
		this._rpcProtocol = new RPCProtocol(protocol, null, uriTransformer);

		// ensure URIs are transformed and revived
		initData = ExtensionHostMain._transform(initData, this._rpcProtocol);

		// bootstrap services
		const services = new ServiceCollection(...getSingletonServiceDescriptors());
		services.set(IExtHostInitDataService, { _serviceBrand: undefined, ...initData, messagePorts });
		services.set(IExtHostRpcService, new ExtHostRpcService(this._rpcProtocol));
		services.set(IURITransformerService, new URITransformerService(uriTransformer));
		services.set(IHostUtils, hostUtils);

		const instaService: IInstantiationService = new InstantiationService(services, true);

		instaService.invokeFunction(ErrorHandler.installEarlyHandler);

		// ugly self - inject
		this._logService = instaService.invokeFunction(accessor => accessor.get(ILogService));

		performance.mark(`code/extHost/didCreateServices`);
		if (this._hostUtils.pid) {
			this._logService.info(`Extension host with pid ${this._hostUtils.pid} started`);
		} else {
			this._logService.info(`Extension host started`);
		}
		this._logService.trace('initData', initData);

		// ugly self - inject
		// must call initialize *after* creating the extension service
		// because `initialize` itself creates instances that depend on it
		this._extensionService = instaService.invokeFunction(accessor => accessor.get(IExtHostExtensionService));
		this._extensionService.initialize();

		// install error handler that is extension-aware
		instaService.invokeFunction(ErrorHandler.installFullHandler);
	}

	async asBrowserUri(uri: URI): Promise<URI> {
		const mainThreadExtensionsProxy = this._rpcProtocol.getProxy(MainContext.MainThreadExtensionService);
		return URI.revive(await mainThreadExtensionsProxy.$asBrowserUri(uri));
	}

	terminate(reason: string): void {
		this._extensionService.terminate(reason);
	}

	private static _transform(initData: IExtensionHostInitData, rpcProtocol: RPCProtocol): IExtensionHostInitData {
		initData.extensions.allExtensions.forEach((ext) => {
			(<Mutable<IExtensionDescription>>ext).extensionLocation = URI.revive(rpcProtocol.transformIncomingURIs(ext.extensionLocation));
		});
		initData.environment.appRoot = URI.revive(rpcProtocol.transformIncomingURIs(initData.environment.appRoot));
		const extDevLocs = initData.environment.extensionDevelopmentLocationURI;
		if (extDevLocs) {
			initData.environment.extensionDevelopmentLocationURI = extDevLocs.map(url => URI.revive(rpcProtocol.transformIncomingURIs(url)));
		}
		initData.environment.extensionTestsLocationURI = URI.revive(rpcProtocol.transformIncomingURIs(initData.environment.extensionTestsLocationURI));
		initData.environment.globalStorageHome = URI.revive(rpcProtocol.transformIncomingURIs(initData.environment.globalStorageHome));
		initData.environment.workspaceStorageHome = URI.revive(rpcProtocol.transformIncomingURIs(initData.environment.workspaceStorageHome));
		initData.nlsBaseUrl = URI.revive(rpcProtocol.transformIncomingURIs(initData.nlsBaseUrl));
		initData.logsLocation = URI.revive(rpcProtocol.transformIncomingURIs(initData.logsLocation));
		initData.workspace = rpcProtocol.transformIncomingURIs(initData.workspace);
		return initData;
	}
}
```

--------------------------------------------------------------------------------

````
