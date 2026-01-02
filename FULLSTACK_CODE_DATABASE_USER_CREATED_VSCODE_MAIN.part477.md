---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 477
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 477 of 552)

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

---[FILE: src/vs/workbench/contrib/testing/common/testingContinuousRunService.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/common/testingContinuousRunService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as arrays from '../../../../base/common/arrays.js';
import { CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable, DisposableMap, DisposableStore, toDisposable } from '../../../../base/common/lifecycle.js';
import { autorunIterableDelta, ISettableObservable, observableValue } from '../../../../base/common/observable.js';
import { WellDefinedPrefixTree } from '../../../../base/common/prefixTree.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { StoredValue } from './storedValue.js';
import { TestId } from './testId.js';
import { TestingContextKeys } from './testingContextKeys.js';
import { ITestProfileService } from './testProfileService.js';
import { ITestService } from './testService.js';
import { ITestRunProfile, TestRunProfileBitset } from './testTypes.js';

export const ITestingContinuousRunService = createDecorator<ITestingContinuousRunService>('testingContinuousRunService');

export interface ITestingContinuousRunService {
	readonly _serviceBrand: undefined;

	/**
	 * Gets a list of the last test profiles that were continuously run in the workspace.
	 */
	readonly lastRunProfileIds: ReadonlySet<number>;

	/**
	 * Fired when a test is added or removed from continous run, or when
	 * enablement is changed globally.
	 */
	readonly onDidChange: Event<string | undefined>;

	/**
	 * Gets whether continous run is specifically enabled for the given test ID.
	 */
	isSpecificallyEnabledFor(testId: string): boolean;

	/**
	 * Gets whether continous run is specifically enabled for
	 * the given test ID, or any of its parents.
	 */
	isEnabledForAParentOf(testId: string): boolean;

	/**
	 * Gets whether continous run is specifically enabled for
	 * the given test ID, or any of its parents.
	 */
	isEnabledForAChildOf(testId: string): boolean;

	/**
	 * Gets whether continuous run is turned on for the given profile.
	 */
	isEnabledForProfile(profile: ITestRunProfile): boolean;

	/**
	 * Gets whether it's enabled at all.
	 */
	isEnabled(): boolean;

	/**
	 * Starts a continuous auto run with a specific set of profiles, or all
	 * default profiles in a group. Globally if no test is given,
	 * for a specific test otherwise.
	 */
	start(profile: ITestRunProfile[] | TestRunProfileBitset, testId?: string): void;

	/**
	 * Stops a continuous run for the given test profile.
	 */
	stopProfile(profile: ITestRunProfile): void;

	/**
	 * Stops any continuous run
	 * Globally if no test is given, for a specific test otherwise.
	 */
	stop(testId?: string): void;
}

type RunningRef = { path: readonly string[]; profiles: ISettableObservable<ITestRunProfile[]>; autoSetDefault?: boolean; handle: DisposableStore };

export class TestingContinuousRunService extends Disposable implements ITestingContinuousRunService {
	declare readonly _serviceBrand: undefined;

	private readonly changeEmitter = new Emitter<string | undefined>();
	private readonly running = new WellDefinedPrefixTree<RunningRef>();
	private readonly lastRun: StoredValue<Set<number>>;

	public readonly onDidChange = this.changeEmitter.event;

	public get lastRunProfileIds() {
		return this.lastRun.get(new Set());
	}

	constructor(
		@ITestService private readonly testService: ITestService,
		@IStorageService storageService: IStorageService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@ITestProfileService private readonly testProfileService: ITestProfileService,
	) {
		super();
		const isGloballyOn = TestingContextKeys.isContinuousModeOn.bindTo(contextKeyService);
		this._register(this.onDidChange(() => {
			isGloballyOn.set(!!this.running.root.value);
		}));
		this.lastRun = this._register(new StoredValue<Set<number>>({
			key: 'lastContinuousRunProfileIds',
			scope: StorageScope.WORKSPACE,
			target: StorageTarget.MACHINE,
			serialization: {
				deserialize: v => new Set(JSON.parse(v)),
				serialize: v => JSON.stringify([...v])
			},
		}, storageService));

		this._register(toDisposable(() => {
			for (const cts of this.running.values()) {
				cts.handle.dispose();
			}
		}));
	}

	/** @inheritdoc */
	public isSpecificallyEnabledFor(testId: string): boolean {
		return this.running.size > 0 && this.running.hasKey(TestId.fromString(testId).path);
	}

	/** @inheritdoc */
	public isEnabledForAParentOf(testId: string): boolean {
		return !!this.running.root.value || (this.running.size > 0 && this.running.hasKeyOrParent(TestId.fromString(testId).path));
	}

	/** @inheritdoc */
	public isEnabledForProfile({ profileId, controllerId }: ITestRunProfile): boolean {
		for (const node of this.running.values()) {
			if (node.profiles.get().some(p => p.profileId === profileId && p.controllerId === controllerId)) {
				return true;
			}
		}

		return false;
	}

	/** @inheritdoc */
	public isEnabledForAChildOf(testId: string): boolean {
		return !!this.running.root.value || (this.running.size > 0 && this.running.hasKeyOrChildren(TestId.fromString(testId).path));
	}

	/** @inheritdoc */
	public isEnabled(): boolean {
		return !!this.running.root.value || this.running.size > 0;
	}

	/** @inheritdoc */
	public start(profiles: ITestRunProfile[] | TestRunProfileBitset, testId?: string): void {
		const store = new DisposableStore();

		let actualProfiles: ISettableObservable<ITestRunProfile[]>;
		if (profiles instanceof Array) {
			actualProfiles = observableValue('crProfiles', profiles);
		} else {
			// restart the continuous run when default profiles change, if we were
			// asked to run for a group
			const getRelevant = () => this.testProfileService.getGroupDefaultProfiles(profiles)
				.filter(p => p.supportsContinuousRun && (!testId || TestId.root(testId) === p.controllerId));
			actualProfiles = observableValue('crProfiles', getRelevant());
			store.add(this.testProfileService.onDidChange(() => {
				if (ref.autoSetDefault) {
					const newRelevant = getRelevant();
					if (!arrays.equals(newRelevant, actualProfiles.get())) {
						actualProfiles.set(getRelevant(), undefined);
					}
				}
			}));
		}

		const path = testId ? TestId.fromString(testId).path : [];
		const ref: RunningRef = { profiles: actualProfiles, handle: store, path, autoSetDefault: typeof profiles === 'number' };

		// If we're already running this specific test, then add the profile and turn
		// off the auto-addition of bitset-based profiles.
		const existing = this.running.find(path);
		if (existing) {
			store.dispose();
			ref.autoSetDefault = existing.autoSetDefault = false;
			existing.profiles.set([...new Set([...actualProfiles.get(), ...existing.profiles.get()])], undefined);
			this.changeEmitter.fire(testId);
			return;
		}

		this.running.insert(path, ref);

		const cancellationStores = new DisposableMap<ITestRunProfile, CancellationTokenSource>();
		store.add(toDisposable(() => {
			for (const cts of cancellationStores.values()) {
				cts.cancel();
			}
			cancellationStores.dispose();
		}));
		store.add(autorunIterableDelta(reader => actualProfiles.read(reader), ({ addedValues, removedValues }) => {
			for (const profile of addedValues) {
				const cts = new CancellationTokenSource();
				this.testService.startContinuousRun({
					continuous: true,
					group: profile.group,
					targets: [{
						testIds: [testId ?? profile.controllerId],
						controllerId: profile.controllerId,
						profileId: profile.profileId
					}],
				}, cts.token);
				cancellationStores.set(profile, cts);
			}

			for (const profile of removedValues) {
				cancellationStores.get(profile)?.cancel();
				cancellationStores.deleteAndDispose(profile);
			}

			this.lastRun.store(new Set([...cancellationStores.keys()].map(p => p.profileId)));
		}));

		this.changeEmitter.fire(testId);
	}

	/** Stops a continuous run for the profile across all test items that are running it. */
	stopProfile({ profileId, controllerId }: ITestRunProfile): void {
		const toDelete: RunningRef[] = [];
		for (const node of this.running.values()) {
			const profs = node.profiles.get();
			const filtered = profs.filter(p => p.profileId !== profileId || p.controllerId !== controllerId);
			if (filtered.length === profs.length) {
				continue;
			} else if (filtered.length === 0) {
				toDelete.push(node);
			} else {
				node.profiles.set(filtered, undefined);
			}
		}

		for (let i = toDelete.length - 1; i >= 0; i--) {
			toDelete[i].handle.dispose();
			this.running.delete(toDelete[i].path);
		}

		this.changeEmitter.fire(undefined);
	}

	/** @inheritdoc */
	public stop(testId?: string): void {
		const cancellations = [...this.running.deleteRecursive(testId ? TestId.fromString(testId).path : [])];
		// deleteRecursive returns a BFS order, reverse it so children are cancelled before parents
		for (let i = cancellations.length - 1; i >= 0; i--) {
			cancellations[i].handle.dispose();
		}

		this.changeEmitter.fire(testId);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/common/testingDecorations.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/common/testingDecorations.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IAction } from '../../../../base/common/actions.js';
import { binarySearch } from '../../../../base/common/arrays.js';
import { Event } from '../../../../base/common/event.js';
import { URI } from '../../../../base/common/uri.js';
import { Position } from '../../../../editor/common/core/position.js';
import { IModelDeltaDecoration } from '../../../../editor/common/model.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { ITestMessage } from './testTypes.js';

export interface ITestingDecorationsService {
	_serviceBrand: undefined;

	/**
	 * Fires when something happened to change decorations in an editor.
	 * Interested consumers should call {@link syncDecorations} to update them.
	 */
	readonly onDidChange: Event<void>;

	/**
	 * Signals the code underlying a test message has changed, and it should
	 * no longer be decorated in the source.
	 */
	invalidateResultMessage(message: ITestMessage): void;

	/**
	 * Ensures decorations in the given document URI are up to date,
	 * and returns them.
	 */
	syncDecorations(resource: URI): Iterable<ITestDecoration> & {
		readonly size: number;
		getById(decorationId: string): ITestDecoration | undefined;
	};

	/**
	 * Gets the range where a test ID is displayed, in the given URI.
	 * Returns undefined if there's no such decoration.
	 */
	getDecoratedTestPosition(resource: URI, testId: string): Position | undefined;

	/**
	 * Sets that alternative actions are displayed on the model.
	 */
	updateDecorationsAlternateAction(resource: URI, isAlt: boolean): void;
}

export interface ITestDecoration {
	/**
	 * ID of the decoration after being added to the editor, set after the
	 * decoration is applied.
	 */
	readonly id: string;

	/**
	 * Original decoration line number.
	 */
	readonly line: number;

	/**
	 * Editor decoration instance.
	 */
	readonly editorDecoration: IModelDeltaDecoration;

	getContextMenuActions(): { object: IAction[]; dispose(): void };
}

export class TestDecorations<T extends { id: string; line: number } = ITestDecoration> {
	public value: T[] = [];
	/**
	 * Adds a new value to the decorations.
	 */
	public push(value: T) {
		const searchIndex = binarySearch(this.value, value, (a, b) => a.line - b.line);
		this.value.splice(searchIndex < 0 ? ~searchIndex : searchIndex, 0, value);
	}

	/**
	 * Gets decorations on each line.
	 */
	public *lines(): Iterable<[number, T[]]> {
		if (!this.value.length) {
			return;
		}

		let startIndex = 0;
		let startLine = this.value[0].line;
		for (let i = 1; i < this.value.length; i++) {
			const v = this.value[i];
			if (v.line !== startLine) {
				yield [startLine, this.value.slice(startIndex, i)];
				startLine = v.line;
				startIndex = i;
			}
		}

		yield [startLine, this.value.slice(startIndex)];
	}
}

export const ITestingDecorationsService = createDecorator<ITestingDecorationsService>('testingDecorationService');
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/common/testingPeekOpener.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/common/testingPeekOpener.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { ITextEditorOptions } from '../../../../platform/editor/common/editor.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { TestResultItem } from './testTypes.js';
import { ITestResult } from './testResult.js';
import { IEditor } from '../../../../editor/common/editorCommon.js';
import { MutableObservableValue } from './observableValue.js';

export interface IShowResultOptions {
	/** Reveal the peek, if configured, in the given editor */
	inEditor?: IEditor;
	/** Editor options, if a new editor is opened */
	options?: Partial<ITextEditorOptions>;
}

export interface ITestingPeekOpener {
	_serviceBrand: undefined;

	/** Whether test history should be shown in the results output. */
	historyVisible: MutableObservableValue<boolean>;

	/**
	 * Tries to peek the first test error, if the item is in a failed state.
	 * @returns a boolean indicating whether a peek was opened
	 */
	tryPeekFirstError(result: ITestResult, test: TestResultItem, options?: Partial<ITextEditorOptions>): boolean;

	/**
	 * Peeks at the given test message uri.
	 * @returns a boolean indicating whether a peek was opened
	 */
	peekUri(uri: URI, options?: IShowResultOptions): boolean;

	/**
	 * Opens the currently selected message in an editor.
	 */
	openCurrentInEditor(): void;

	/**
	 * Opens the peek. Shows any available message.
	 */
	open(): void;

	/**
	 * Closes peeks for all visible editors.
	 */
	closeAllPeeks(): void;
}

export const ITestingPeekOpener = createDecorator<ITestingPeekOpener>('testingPeekOpener');
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/common/testingProgressMessages.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/common/testingProgressMessages.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { ITestResult } from './testResult.js';
import { TestResultState } from './testTypes.js';

export type CountSummary = ReturnType<typeof collectTestStateCounts>;

export const collectTestStateCounts = (isRunning: boolean, results: ReadonlyArray<ITestResult>) => {
	let passed = 0;
	let failed = 0;
	let skipped = 0;
	let running = 0;
	let queued = 0;

	for (const result of results) {
		const count = result.counts;
		failed += count[TestResultState.Errored] + count[TestResultState.Failed];
		passed += count[TestResultState.Passed];
		skipped += count[TestResultState.Skipped];
		running += count[TestResultState.Running];
		queued += count[TestResultState.Queued];
	}

	return {
		isRunning,
		passed,
		failed,
		runSoFar: passed + failed,
		totalWillBeRun: passed + failed + queued + running,
		skipped,
	};
};

export const getTestProgressText = ({ isRunning, passed, runSoFar, totalWillBeRun, skipped, failed }: CountSummary) => {
	let percent = passed / runSoFar * 100;
	if (failed > 0) {
		// fix: prevent from rounding to 100 if there's any failed test
		percent = Math.min(percent, 99.9);
	} else if (runSoFar === 0) {
		percent = 0;
	}

	if (isRunning) {
		if (runSoFar === 0) {
			return localize('testProgress.runningInitial', 'Running tests...');
		} else if (skipped === 0) {
			return localize('testProgress.running', 'Running tests, {0}/{1} passed ({2}%)', passed, totalWillBeRun, percent.toPrecision(3));
		} else {
			return localize('testProgressWithSkip.running', 'Running tests, {0}/{1} tests passed ({2}%, {3} skipped)', passed, totalWillBeRun, percent.toPrecision(3), skipped);
		}
	} else {
		if (skipped === 0) {
			return localize('testProgress.completed', '{0}/{1} tests passed ({2}%)', passed, runSoFar, percent.toPrecision(3));
		} else {
			return localize('testProgressWithSkip.completed', '{0}/{1} tests passed ({2}%, {3} skipped)', passed, runSoFar, percent.toPrecision(3), skipped);
		}
	}
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/common/testingStates.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/common/testingStates.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { mapValues } from '../../../../base/common/objects.js';
import { TestResultState } from './testTypes.js';

export type TreeStateNode = { statusNode: true; state: TestResultState; priority: number };

/**
 * List of display priorities for different run states. When tests update,
 * the highest-priority state from any of their children will be the state
 * reflected in the parent node.
 */
export const statePriority: { [K in TestResultState]: number } = {
	[TestResultState.Running]: 6,
	[TestResultState.Errored]: 5,
	[TestResultState.Failed]: 4,
	[TestResultState.Queued]: 3,
	[TestResultState.Passed]: 2,
	[TestResultState.Unset]: 0,
	[TestResultState.Skipped]: 1,
};

export const isFailedState = (s: TestResultState) => s === TestResultState.Errored || s === TestResultState.Failed;
export const isStateWithResult = (s: TestResultState) => s === TestResultState.Errored || s === TestResultState.Failed || s === TestResultState.Passed;

export const stateNodes: { [K in TestResultState]: TreeStateNode } = mapValues(statePriority, (priority, stateStr): TreeStateNode => {
	const state = Number(stateStr) as TestResultState;
	return { statusNode: true, state, priority };
});

export const cmpPriority = (a: TestResultState, b: TestResultState) => statePriority[b] - statePriority[a];

export const maxPriority = (...states: TestResultState[]) => {
	switch (states.length) {
		case 0:
			return TestResultState.Unset;
		case 1:
			return states[0];
		case 2:
			return statePriority[states[0]] > statePriority[states[1]] ? states[0] : states[1];
		default: {
			let max = states[0];
			for (let i = 1; i < states.length; i++) {
				if (statePriority[max] < statePriority[states[i]]) {
					max = states[i];
				}
			}

			return max;
		}
	}
};

export const statesInOrder = Object.keys(statePriority).map(s => Number(s) as TestResultState).sort(cmpPriority);

/**
 * Some states are considered terminal; once these are set for a given test run, they
 * are not reset back to a non-terminal state, or to a terminal state with lower
 * priority.
 */
export const terminalStatePriorities: { [key in TestResultState]?: number } = {
	[TestResultState.Passed]: 0,
	[TestResultState.Skipped]: 1,
	[TestResultState.Failed]: 2,
	[TestResultState.Errored]: 3,
};

/**
 * Count of the number of tests in each run state.
 */
export type TestStateCount = { [K in TestResultState]: number };

export const makeEmptyCounts = (): TestStateCount => {
	// shh! don't tell anyone this is actually an array!
	return new Uint32Array(statesInOrder.length) as unknown as TestStateCount;
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/common/testingUri.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/common/testingUri.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { assertNever } from '../../../../base/common/assert.js';
import { URI } from '../../../../base/common/uri.js';

export const TEST_DATA_SCHEME = 'vscode-test-data';

export const enum TestUriType {
	/** All console output for a task */
	TaskOutput,
	/** All console output for a test in a task */
	TestOutput,
	/** Specific message in a test */
	ResultMessage,
	/** Specific actual output message in a test */
	ResultActualOutput,
	/** Specific expected output message in a test */
	ResultExpectedOutput,
}

interface IAllOutputReference {
	type: TestUriType.TaskOutput;
	resultId: string;
	taskIndex: number;
}

interface IResultTestUri {
	resultId: string;
	taskIndex: number;
	testExtId: string;
}

interface ITestOutputReference extends IResultTestUri {
	type: TestUriType.TestOutput;
}

interface IResultTestMessageReference extends IResultTestUri {
	type: TestUriType.ResultMessage;
	messageIndex: number;
}

interface ITestDiffOutputReference extends IResultTestUri {
	type: TestUriType.ResultActualOutput | TestUriType.ResultExpectedOutput;
	messageIndex: number;
}

export type ParsedTestUri =
	| IAllOutputReference
	| IResultTestMessageReference
	| ITestDiffOutputReference
	| ITestOutputReference;

const enum TestUriParts {
	Results = 'results',

	AllOutput = 'output',
	Messages = 'message',
	Text = 'TestFailureMessage',
	ActualOutput = 'ActualOutput',
	ExpectedOutput = 'ExpectedOutput',
}

export const parseTestUri = (uri: URI): ParsedTestUri | undefined => {
	const type = uri.authority;
	const [resultId, ...request] = uri.path.slice(1).split('/');

	if (request[0] === TestUriParts.Messages) {
		const taskIndex = Number(request[1]);
		const testExtId = uri.query;
		const index = Number(request[2]);
		const part = request[3];
		if (type === TestUriParts.Results) {
			switch (part) {
				case TestUriParts.Text:
					return { resultId, taskIndex, testExtId, messageIndex: index, type: TestUriType.ResultMessage };
				case TestUriParts.ActualOutput:
					return { resultId, taskIndex, testExtId, messageIndex: index, type: TestUriType.ResultActualOutput };
				case TestUriParts.ExpectedOutput:
					return { resultId, taskIndex, testExtId, messageIndex: index, type: TestUriType.ResultExpectedOutput };
				case TestUriParts.Messages:
			}
		}
	}

	if (request[0] === TestUriParts.AllOutput) {
		const testExtId = uri.query;
		const taskIndex = Number(request[1]);
		return testExtId
			? { resultId, taskIndex, testExtId, type: TestUriType.TestOutput }
			: { resultId, taskIndex, type: TestUriType.TaskOutput };
	}

	return undefined;
};

export const buildTestUri = (parsed: ParsedTestUri): URI => {
	const uriParts = {
		scheme: TEST_DATA_SCHEME,
		authority: TestUriParts.Results
	};

	if (parsed.type === TestUriType.TaskOutput) {
		return URI.from({
			...uriParts,
			path: ['', parsed.resultId, TestUriParts.AllOutput, parsed.taskIndex].join('/'),
		});
	}

	const msgRef = (resultId: string, ...remaining: (string | number)[]) =>
		URI.from({
			...uriParts,
			query: parsed.testExtId,
			path: ['', resultId, TestUriParts.Messages, ...remaining].join('/'),
		});

	switch (parsed.type) {
		case TestUriType.ResultActualOutput:
			return msgRef(parsed.resultId, parsed.taskIndex, parsed.messageIndex, TestUriParts.ActualOutput);
		case TestUriType.ResultExpectedOutput:
			return msgRef(parsed.resultId, parsed.taskIndex, parsed.messageIndex, TestUriParts.ExpectedOutput);
		case TestUriType.ResultMessage:
			return msgRef(parsed.resultId, parsed.taskIndex, parsed.messageIndex, TestUriParts.Text);
		case TestUriType.TestOutput:
			return URI.from({
				...uriParts,
				query: parsed.testExtId,
				path: ['', parsed.resultId, TestUriParts.AllOutput, parsed.taskIndex].join('/'),
			});
		default:
			assertNever(parsed, 'Invalid test uri');
	}
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/common/testItemCollection.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/common/testItemCollection.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Barrier, isThenable, RunOnceScheduler } from '../../../../base/common/async.js';
import { Emitter } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { assertNever } from '../../../../base/common/assert.js';
import { applyTestItemUpdate, ITestItem, ITestTag, namespaceTestTag, TestDiffOpType, TestItemExpandState, TestsDiff, TestsDiffOp } from './testTypes.js';
import { TestId } from './testId.js';
import { URI } from '../../../../base/common/uri.js';

/**
 * @private
 */
interface CollectionItem<T> {
	readonly fullId: TestId;
	actual: T;
	expand: TestItemExpandState;
	/**
	 * Number of levels of items below this one that are expanded. May be infinite.
	 */
	expandLevels?: number;
	resolveBarrier?: Barrier;
}

export const enum TestItemEventOp {
	Upsert,
	SetTags,
	UpdateCanResolveChildren,
	RemoveChild,
	SetProp,
	Bulk,
	DocumentSynced,
}

export interface ITestItemUpsertChild {
	op: TestItemEventOp.Upsert;
	item: ITestItemLike;
}

export interface ITestItemUpdateCanResolveChildren {
	op: TestItemEventOp.UpdateCanResolveChildren;
	state: boolean;
}

export interface ITestItemSetTags {
	op: TestItemEventOp.SetTags;
	new: ITestTag[];
	old: ITestTag[];
}

export interface ITestItemRemoveChild {
	op: TestItemEventOp.RemoveChild;
	id: string;
}

export interface ITestItemSetProp {
	op: TestItemEventOp.SetProp;
	update: Partial<ITestItem>;
}
export interface ITestItemBulkReplace {
	op: TestItemEventOp.Bulk;
	ops: (ITestItemUpsertChild | ITestItemRemoveChild)[];
}

export interface ITestItemDocumentSynced {
	op: TestItemEventOp.DocumentSynced;
}

export type ExtHostTestItemEvent =
	| ITestItemSetTags
	| ITestItemUpsertChild
	| ITestItemRemoveChild
	| ITestItemUpdateCanResolveChildren
	| ITestItemSetProp
	| ITestItemBulkReplace
	| ITestItemDocumentSynced;

export interface ITestItemApi<T> {
	controllerId: string;
	parent?: T;
	listener?: (evt: ExtHostTestItemEvent) => void;
}

export interface ITestItemCollectionOptions<T> {
	/** Controller ID to use to prefix these test items. */
	controllerId: string;

	/** Gets the document version at the given URI, if it's open */
	getDocumentVersion(uri: URI | undefined): number | undefined;

	/** Gets API for the given test item, used to listen for events and set parents. */
	getApiFor(item: T): ITestItemApi<T>;

	/** Converts the full test item to the common interface. */
	toITestItem(item: T): ITestItem;

	/** Gets children for the item. */
	getChildren(item: T): ITestChildrenLike<T>;

	/** Root to use for the new test collection. */
	root: T;
}

const strictEqualComparator = <T>(a: T, b: T) => a === b;
const diffableProps: { [K in keyof ITestItem]?: (a: ITestItem[K], b: ITestItem[K]) => boolean } = {
	range: (a, b) => {
		if (a === b) { return true; }
		if (!a || !b) { return false; }
		return a.equalsRange(b);
	},
	busy: strictEqualComparator,
	label: strictEqualComparator,
	description: strictEqualComparator,
	error: strictEqualComparator,
	sortText: strictEqualComparator,
	tags: (a, b) => {
		if (a.length !== b.length) {
			return false;
		}

		if (a.some(t1 => !b.includes(t1))) {
			return false;
		}

		return true;
	},
};

const diffableEntries = Object.entries(diffableProps) as readonly [keyof ITestItem, (a: unknown, b: unknown) => boolean][];

const diffTestItems = (a: ITestItem, b: ITestItem) => {
	let output: Record<string, unknown> | undefined;
	for (const [key, cmp] of diffableEntries) {
		if (!cmp(a[key], b[key])) {
			if (output) {
				output[key] = b[key];
			} else {
				output = { [key]: b[key] };
			}
		}
	}

	return output as Partial<ITestItem> | undefined;
};

export interface ITestChildrenLike<T> extends Iterable<[string, T]> {
	get(id: string): T | undefined;
	delete(id: string): void;
}

export interface ITestItemLike {
	id: string;
	tags: readonly ITestTag[];
	uri?: URI;
	canResolveChildren: boolean;
}

/**
 * Maintains a collection of test items for a single controller.
 */
export class TestItemCollection<T extends ITestItemLike> extends Disposable {
	private readonly debounceSendDiff = this._register(new RunOnceScheduler(() => this.flushDiff(), 200));
	private readonly diffOpEmitter = this._register(new Emitter<TestsDiff>());
	private _resolveHandler?: (item: T | undefined) => Promise<void> | void;

	public get root() {
		return this.options.root;
	}

	public readonly tree = new Map</* full test id */string, CollectionItem<T>>();
	private readonly tags = new Map<string, { label?: string; refCount: number }>();

	protected diff: TestsDiff = [];

	constructor(private readonly options: ITestItemCollectionOptions<T>) {
		super();
		this.root.canResolveChildren = true;
		this.upsertItem(this.root, undefined);
	}

	/**
	 * Handler used for expanding test items.
	 */
	public set resolveHandler(handler: undefined | ((item: T | undefined) => void)) {
		this._resolveHandler = handler;
		for (const test of this.tree.values()) {
			this.updateExpandability(test);
		}
	}

	public get resolveHandler() {
		return this._resolveHandler;
	}

	/**
	 * Fires when an operation happens that should result in a diff.
	 */
	public readonly onDidGenerateDiff = this.diffOpEmitter.event;

	/**
	 * Gets a diff of all changes that have been made, and clears the diff queue.
	 */
	public collectDiff() {
		const diff = this.diff;
		this.diff = [];
		return diff;
	}

	/**
	 * Pushes a new diff entry onto the collected diff list.
	 */
	public pushDiff(diff: TestsDiffOp) {
		switch (diff.op) {
			case TestDiffOpType.DocumentSynced: {
				for (const existing of this.diff) {
					if (existing.op === TestDiffOpType.DocumentSynced && existing.uri === diff.uri) {
						existing.docv = diff.docv;
						return;
					}
				}

				break;
			}
			case TestDiffOpType.Update: {
				// Try to merge updates, since they're invoked per-property
				const last = this.diff[this.diff.length - 1];
				if (last) {
					if (last.op === TestDiffOpType.Update && last.item.extId === diff.item.extId) {
						applyTestItemUpdate(last.item, diff.item);
						return;
					}

					if (last.op === TestDiffOpType.Add && last.item.item.extId === diff.item.extId) {
						applyTestItemUpdate(last.item, diff.item);
						return;
					}
				}
				break;
			}
		}

		this.diff.push(diff);

		if (!this.debounceSendDiff.isScheduled()) {
			this.debounceSendDiff.schedule();
		}
	}

	/**
	 * Expands the test and the given number of `levels` of children. If levels
	 * is < 0, then all children will be expanded. If it's 0, then only this
	 * item will be expanded.
	 */
	public expand(testId: string, levels: number): Promise<void> | void {
		const internal = this.tree.get(testId);
		if (!internal) {
			return;
		}

		if (internal.expandLevels === undefined || levels > internal.expandLevels) {
			internal.expandLevels = levels;
		}

		// try to avoid awaiting things if the provider returns synchronously in
		// order to keep everything in a single diff and DOM update.
		if (internal.expand === TestItemExpandState.Expandable) {
			const r = this.resolveChildren(internal);
			return !r.isOpen()
				? r.wait().then(() => this.expandChildren(internal, levels - 1))
				: this.expandChildren(internal, levels - 1);
		} else if (internal.expand === TestItemExpandState.Expanded) {
			return internal.resolveBarrier?.isOpen() === false
				? internal.resolveBarrier.wait().then(() => this.expandChildren(internal, levels - 1))
				: this.expandChildren(internal, levels - 1);
		}
	}

	public override dispose() {
		for (const item of this.tree.values()) {
			this.options.getApiFor(item.actual).listener = undefined;
		}

		this.tree.clear();
		this.diff = [];
		super.dispose();
	}

	private onTestItemEvent(internal: CollectionItem<T>, evt: ExtHostTestItemEvent) {
		switch (evt.op) {
			case TestItemEventOp.RemoveChild:
				this.removeItem(TestId.joinToString(internal.fullId, evt.id));
				break;

			case TestItemEventOp.Upsert:
				this.upsertItem(evt.item as T, internal);
				break;

			case TestItemEventOp.Bulk:
				for (const op of evt.ops) {
					this.onTestItemEvent(internal, op);
				}
				break;

			case TestItemEventOp.SetTags:
				this.diffTagRefs(evt.new, evt.old, internal.fullId.toString());
				break;

			case TestItemEventOp.UpdateCanResolveChildren:
				this.updateExpandability(internal);
				break;

			case TestItemEventOp.SetProp:
				this.pushDiff({
					op: TestDiffOpType.Update,
					item: {
						extId: internal.fullId.toString(),
						item: evt.update,
					}
				});
				break;

			case TestItemEventOp.DocumentSynced:
				this.documentSynced(internal.actual.uri);
				break;

			default:
				assertNever(evt);
		}
	}

	private documentSynced(uri: URI | undefined) {
		if (uri) {
			this.pushDiff({
				op: TestDiffOpType.DocumentSynced,
				uri,
				docv: this.options.getDocumentVersion(uri)
			});
		}
	}

	private upsertItem(actual: T, parent: CollectionItem<T> | undefined): void {
		const fullId = TestId.fromExtHostTestItem(actual, this.root.id, parent?.actual);

		// If this test item exists elsewhere in the tree already (exists at an
		// old ID with an existing parent), remove that old item.
		const privateApi = this.options.getApiFor(actual);
		if (privateApi.parent && privateApi.parent !== parent?.actual) {
			this.options.getChildren(privateApi.parent).delete(actual.id);
		}

		let internal = this.tree.get(fullId.toString());
		// Case 1: a brand new item
		if (!internal) {
			internal = {
				fullId,
				actual,
				expandLevels: parent?.expandLevels /* intentionally undefined or 0 */ ? parent.expandLevels - 1 : undefined,
				expand: TestItemExpandState.NotExpandable, // updated by `connectItemAndChildren`
			};

			actual.tags.forEach(this.incrementTagRefs, this);
			this.tree.set(internal.fullId.toString(), internal);
			this.setItemParent(actual, parent);
			this.pushDiff({
				op: TestDiffOpType.Add,
				item: {
					controllerId: this.options.controllerId,
					expand: internal.expand,
					item: this.options.toITestItem(actual),
				},
			});

			this.connectItemAndChildren(actual, internal, parent);
			return;
		}

		// Case 2: re-insertion of an existing item, no-op
		if (internal.actual === actual) {
			this.connectItem(actual, internal, parent); // re-connect in case the parent changed
			return; // no-op
		}

		// Case 3: upsert of an existing item by ID, with a new instance
		if (internal.actual.uri?.toString() !== actual.uri?.toString()) {
			// If the item has a new URI, re-insert it; we don't support updating
			// URIs on existing test items.
			this.removeItem(fullId.toString());
			return this.upsertItem(actual, parent);
		}
		const oldChildren = this.options.getChildren(internal.actual);
		const oldActual = internal.actual;
		const update = diffTestItems(this.options.toITestItem(oldActual), this.options.toITestItem(actual));
		this.options.getApiFor(oldActual).listener = undefined;

		internal.actual = actual;
		internal.resolveBarrier = undefined;
		internal.expand = TestItemExpandState.NotExpandable; // updated by `connectItemAndChildren`

		if (update) {
			// tags are handled in a special way
			if (update.hasOwnProperty('tags')) {
				this.diffTagRefs(actual.tags, oldActual.tags, fullId.toString());
				delete update.tags;
			}
			this.onTestItemEvent(internal, { op: TestItemEventOp.SetProp, update });
		}

		this.connectItemAndChildren(actual, internal, parent);

		// Remove any orphaned children.
		for (const [_, child] of oldChildren) {
			if (!this.options.getChildren(actual).get(child.id)) {
				this.removeItem(TestId.joinToString(fullId, child.id));
			}
		}

		// Re-expand the element if it was previous expanded (#207574)
		const expandLevels = internal.expandLevels;
		if (expandLevels !== undefined) {
			// Wait until a microtask to allow the extension to finish setting up
			// properties of the element and children before we ask it to expand.
			queueMicrotask(() => {
				if (internal.expand === TestItemExpandState.Expandable) {
					internal.expandLevels = undefined;
					this.expand(fullId.toString(), expandLevels);
				}
			});
		}

		// Mark ranges in the document as synced (#161320)
		this.documentSynced(internal.actual.uri);
	}

	private diffTagRefs(newTags: readonly ITestTag[], oldTags: readonly ITestTag[], extId: string) {
		const toDelete = new Set(oldTags.map(t => t.id));
		for (const tag of newTags) {
			if (!toDelete.delete(tag.id)) {
				this.incrementTagRefs(tag);
			}
		}

		this.pushDiff({
			op: TestDiffOpType.Update,
			item: { extId, item: { tags: newTags.map(v => namespaceTestTag(this.options.controllerId, v.id)) } }
		});

		toDelete.forEach(this.decrementTagRefs, this);
	}

	private incrementTagRefs(tag: ITestTag) {
		const existing = this.tags.get(tag.id);
		if (existing) {
			existing.refCount++;
		} else {
			this.tags.set(tag.id, { refCount: 1 });
			this.pushDiff({
				op: TestDiffOpType.AddTag, tag: {
					id: namespaceTestTag(this.options.controllerId, tag.id),
				}
			});
		}
	}

	private decrementTagRefs(tagId: string) {
		const existing = this.tags.get(tagId);
		if (existing && !--existing.refCount) {
			this.tags.delete(tagId);
			this.pushDiff({ op: TestDiffOpType.RemoveTag, id: namespaceTestTag(this.options.controllerId, tagId) });
		}
	}

	private setItemParent(actual: T, parent: CollectionItem<T> | undefined) {
		this.options.getApiFor(actual).parent = parent && parent.actual !== this.root ? parent.actual : undefined;
	}

	private connectItem(actual: T, internal: CollectionItem<T>, parent: CollectionItem<T> | undefined) {
		this.setItemParent(actual, parent);
		const api = this.options.getApiFor(actual);
		api.parent = parent?.actual;
		api.listener = evt => this.onTestItemEvent(internal, evt);
		this.updateExpandability(internal);
	}

	private connectItemAndChildren(actual: T, internal: CollectionItem<T>, parent: CollectionItem<T> | undefined) {
		this.connectItem(actual, internal, parent);

		// Discover any existing children that might have already been added
		for (const [_, child] of this.options.getChildren(actual)) {
			this.upsertItem(child, internal);
		}
	}

	/**
	 * Updates the `expand` state of the item. Should be called whenever the
	 * resolved state of the item changes. Can automatically expand the item
	 * if requested by a consumer.
	 */
	private updateExpandability(internal: CollectionItem<T>) {
		let newState: TestItemExpandState;
		if (!this._resolveHandler) {
			newState = TestItemExpandState.NotExpandable;
		} else if (internal.resolveBarrier) {
			newState = internal.resolveBarrier.isOpen()
				? TestItemExpandState.Expanded
				: TestItemExpandState.BusyExpanding;
		} else {
			newState = internal.actual.canResolveChildren
				? TestItemExpandState.Expandable
				: TestItemExpandState.NotExpandable;
		}

		if (newState === internal.expand) {
			return;
		}

		internal.expand = newState;
		this.pushDiff({ op: TestDiffOpType.Update, item: { extId: internal.fullId.toString(), expand: newState } });

		if (newState === TestItemExpandState.Expandable && internal.expandLevels !== undefined) {
			this.resolveChildren(internal);
		}
	}

	/**
	 * Expands all children of the item, "levels" deep. If levels is 0, only
	 * the children will be expanded. If it's 1, the children and their children
	 * will be expanded. If it's <0, it's a no-op.
	 */
	private expandChildren(internal: CollectionItem<T>, levels: number): Promise<void> | void {
		if (levels < 0) {
			return;
		}

		const expandRequests: Promise<void>[] = [];
		for (const [_, child] of this.options.getChildren(internal.actual)) {
			const promise = this.expand(TestId.joinToString(internal.fullId, child.id), levels);
			if (isThenable(promise)) {
				expandRequests.push(promise);
			}
		}

		if (expandRequests.length) {
			return Promise.all(expandRequests).then(() => { });
		}
	}

	/**
	 * Calls `discoverChildren` on the item, refreshing all its tests.
	 */
	private resolveChildren(internal: CollectionItem<T>) {
		if (internal.resolveBarrier) {
			return internal.resolveBarrier;
		}

		if (!this._resolveHandler) {
			const b = new Barrier();
			b.open();
			return b;
		}

		internal.expand = TestItemExpandState.BusyExpanding;
		this.pushExpandStateUpdate(internal);

		const barrier = internal.resolveBarrier = new Barrier();
		const applyError = (err: Error) => {
			console.error(`Unhandled error in resolveHandler of test controller "${this.options.controllerId}"`, err);
		};

		let r: Thenable<void> | undefined | void;
		try {
			r = this._resolveHandler(internal.actual === this.root ? undefined : internal.actual);
		} catch (err) {
			applyError(err);
		}

		if (isThenable(r)) {
			r.catch(applyError).then(() => {
				barrier.open();
				this.updateExpandability(internal);
			});
		} else {
			barrier.open();
			this.updateExpandability(internal);
		}

		return internal.resolveBarrier;
	}

	private pushExpandStateUpdate(internal: CollectionItem<T>) {
		this.pushDiff({ op: TestDiffOpType.Update, item: { extId: internal.fullId.toString(), expand: internal.expand } });
	}

	private removeItem(childId: string) {
		const childItem = this.tree.get(childId);
		if (!childItem) {
			throw new Error('attempting to remove non-existent child');
		}

		this.pushDiff({ op: TestDiffOpType.Remove, itemId: childId });

		const queue: (CollectionItem<T> | undefined)[] = [childItem];
		while (queue.length) {
			const item = queue.pop();
			if (!item) {
				continue;
			}

			this.options.getApiFor(item.actual).listener = undefined;

			for (const tag of item.actual.tags) {
				this.decrementTagRefs(tag.id);
			}

			this.tree.delete(item.fullId.toString());
			for (const [_, child] of this.options.getChildren(item.actual)) {
				queue.push(this.tree.get(TestId.joinToString(item.fullId, child.id)));
			}
		}
	}

	/**
	 * Immediately emits any pending diffs on the collection.
	 */
	public flushDiff() {
		const diff = this.collectDiff();
		if (diff.length) {
			this.diffOpEmitter.fire(diff);
		}
	}
}

/** Implementation of vscode.TestItemCollection */
export interface ITestItemChildren<T extends ITestItemLike> extends Iterable<[string, T]> {
	readonly size: number;
	replace(items: readonly T[]): void;
	forEach(callback: (item: T, collection: this) => unknown, thisArg?: unknown): void;
	add(item: T): void;
	delete(itemId: string): void;
	get(itemId: string): T | undefined;

	toJSON(): readonly T[];
}

export class DuplicateTestItemError extends Error {
	constructor(id: string) {
		super(`Attempted to insert a duplicate test item ID ${id}`);
	}
}

export class InvalidTestItemError extends Error {
	constructor(id: string) {
		super(`TestItem with ID "${id}" is invalid. Make sure to create it from the createTestItem method.`);
	}
}

export class MixedTestItemController extends Error {
	constructor(id: string, ctrlA: string, ctrlB: string) {
		super(`TestItem with ID "${id}" is from controller "${ctrlA}" and cannot be added as a child of an item from controller "${ctrlB}".`);
	}
}

export const createTestItemChildren = <T extends ITestItemLike>(api: ITestItemApi<T>, getApi: (item: T) => ITestItemApi<T>, checkCtor: Function): ITestItemChildren<T> => {
	let mapped = new Map<string, T>();

	return {
		/** @inheritdoc */
		get size() {
			return mapped.size;
		},

		/** @inheritdoc */
		forEach(callback: (item: T, collection: ITestItemChildren<T>) => unknown, thisArg?: unknown) {
			for (const item of mapped.values()) {
				callback.call(thisArg, item, this);
			}
		},

		/** @inheritdoc */
		[Symbol.iterator](): IterableIterator<[string, T]> {
			return mapped.entries();
		},

		/** @inheritdoc */
		replace(items: Iterable<T>) {
			const newMapped = new Map<string, T>();
			const toDelete = new Set(mapped.keys());
			const bulk: ITestItemBulkReplace = { op: TestItemEventOp.Bulk, ops: [] };

			for (const item of items) {
				if (!(item instanceof checkCtor)) {
					throw new InvalidTestItemError((item as ITestItemLike).id);
				}

				const itemController = getApi(item).controllerId;
				if (itemController !== api.controllerId) {
					throw new MixedTestItemController(item.id, itemController, api.controllerId);
				}

				if (newMapped.has(item.id)) {
					throw new DuplicateTestItemError(item.id);
				}

				newMapped.set(item.id, item);
				toDelete.delete(item.id);
				bulk.ops.push({ op: TestItemEventOp.Upsert, item });
			}

			for (const id of toDelete.keys()) {
				bulk.ops.push({ op: TestItemEventOp.RemoveChild, id });
			}

			api.listener?.(bulk);

			// important mutations come after firing, so if an error happens no
			// changes will be "saved":
			mapped = newMapped;
		},


		/** @inheritdoc */
		add(item: T) {
			if (!(item instanceof checkCtor)) {
				throw new InvalidTestItemError((item as ITestItemLike).id);
			}

			mapped.set(item.id, item);
			api.listener?.({ op: TestItemEventOp.Upsert, item });
		},

		/** @inheritdoc */
		delete(id: string) {
			if (mapped.delete(id)) {
				api.listener?.({ op: TestItemEventOp.RemoveChild, id });
			}
		},

		/** @inheritdoc */
		get(itemId: string) {
			return mapped.get(itemId);
		},

		/** JSON serialization function. */
		toJSON() {
			return Array.from(mapped.values());
		},
	};
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/common/testProfileService.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/common/testProfileService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../base/common/event.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { deepClone } from '../../../../base/common/objects.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { StoredValue } from './storedValue.js';
import { TestId } from './testId.js';
import { IMainThreadTestController } from './testService.js';
import { ITestItem, ITestRunProfile, InternalTestItem, TestRunProfileBitset, testRunProfileBitsetList } from './testTypes.js';
import { TestingContextKeys } from './testingContextKeys.js';

export const ITestProfileService = createDecorator<ITestProfileService>('testProfileService');

export interface ITestProfileService {
	readonly _serviceBrand: undefined;

	/**
	 * Fired when any profile changes.
	 */
	readonly onDidChange: Event<void>;

	/**
	 * Publishes a new test profile.
	 */
	addProfile(controller: IMainThreadTestController, profile: ITestRunProfile): void;

	/**
	 * Updates an existing test run profile
	 */
	updateProfile(controllerId: string, profileId: number, update: Partial<ITestRunProfile>): void;

	/**
	 * Removes a profile. If profileId is not given, all profiles
	 * for the given controller will be removed.
	 */
	removeProfile(controllerId: string, profileId?: number): void;

	/**
	 * Gets capabilities for the given test, indicating whether
	 * there's any usable profiles available for those groups.
	 * @returns a bitset to use with {@link TestRunProfileBitset}
	 */
	capabilitiesForTest(test: ITestItem): number;

	/**
	 * Configures a test profile.
	 */
	configure(controllerId: string, profileId: number): void;

	/**
	 * Gets all registered controllers, grouping by controller.
	 */
	all(): Iterable<Readonly<{
		controller: IMainThreadTestController;
		profiles: ITestRunProfile[];
	}>>;

	/**
	 * Gets the default profiles to be run for a given run group.
	 */
	getGroupDefaultProfiles(group: TestRunProfileBitset, controllerId?: string): ITestRunProfile[];

	/**
	 * Sets the default profiles to be run for a given run group.
	 */
	setGroupDefaultProfiles(group: TestRunProfileBitset, profiles: ITestRunProfile[]): void;

	/**
	 * Gets the profiles for a controller, in priority order.
	 */
	getControllerProfiles(controllerId: string): ITestRunProfile[];

	/**
	 * Gets the preferred profile, if any, to run the test.
	 */
	getDefaultProfileForTest(group: TestRunProfileBitset, test: InternalTestItem): ITestRunProfile | undefined;
}

/**
 * Gets whether the given profile can be used to run the test.
 */
export const canUseProfileWithTest = (profile: ITestRunProfile, test: InternalTestItem) =>
	profile.controllerId === test.controllerId && (TestId.isRoot(test.item.extId) || !profile.tag || test.item.tags.includes(profile.tag));

const sorter = (a: ITestRunProfile, b: ITestRunProfile) => {
	if (a.isDefault !== b.isDefault) {
		return a.isDefault ? -1 : 1;
	}

	return a.label.localeCompare(b.label);
};

interface IExtendedTestRunProfile extends ITestRunProfile {
	wasInitiallyDefault: boolean;
}

/**
 * Given a capabilities bitset, returns a map of context keys representing
 * them.
 */
export const capabilityContextKeys = (capabilities: number): [key: string, value: boolean][] => [
	[TestingContextKeys.hasRunnableTests.key, (capabilities & TestRunProfileBitset.Run) !== 0],
	[TestingContextKeys.hasDebuggableTests.key, (capabilities & TestRunProfileBitset.Debug) !== 0],
	[TestingContextKeys.hasCoverableTests.key, (capabilities & TestRunProfileBitset.Coverage) !== 0],
];

type DefaultsMap = { [controllerId: string]: { [profileId: number]: /* isDefault */ boolean } };

export class TestProfileService extends Disposable implements ITestProfileService {
	declare readonly _serviceBrand: undefined;
	private readonly userDefaults: StoredValue<DefaultsMap>;
	private readonly capabilitiesContexts: { [K in TestRunProfileBitset]: IContextKey<boolean> };
	private readonly changeEmitter = this._register(new Emitter<void>());
	private readonly controllerProfiles = new Map</* controller ID */string, {
		profiles: IExtendedTestRunProfile[];
		controller: IMainThreadTestController;
	}>();

	/** @inheritdoc */
	public readonly onDidChange = this.changeEmitter.event;

	constructor(
		@IContextKeyService contextKeyService: IContextKeyService,
		@IStorageService storageService: IStorageService,
	) {
		super();

		storageService.remove('testingPreferredProfiles', StorageScope.WORKSPACE); // cleanup old format
		this.userDefaults = this._register(new StoredValue({
			key: 'testingPreferredProfiles2',
			scope: StorageScope.WORKSPACE,
			target: StorageTarget.MACHINE,
		}, storageService));

		this.capabilitiesContexts = {
			[TestRunProfileBitset.Run]: TestingContextKeys.hasRunnableTests.bindTo(contextKeyService),
			[TestRunProfileBitset.Debug]: TestingContextKeys.hasDebuggableTests.bindTo(contextKeyService),
			[TestRunProfileBitset.Coverage]: TestingContextKeys.hasCoverableTests.bindTo(contextKeyService),
			[TestRunProfileBitset.HasNonDefaultProfile]: TestingContextKeys.hasNonDefaultProfile.bindTo(contextKeyService),
			[TestRunProfileBitset.HasConfigurable]: TestingContextKeys.hasConfigurableProfile.bindTo(contextKeyService),
			[TestRunProfileBitset.SupportsContinuousRun]: TestingContextKeys.supportsContinuousRun.bindTo(contextKeyService),
		};

		this.refreshContextKeys();
	}

	/** @inheritdoc */
	public addProfile(controller: IMainThreadTestController, profile: ITestRunProfile): void {
		const previousExplicitDefaultValue = this.userDefaults.get()?.[controller.id]?.[profile.profileId];
		const extended: IExtendedTestRunProfile = {
			...profile,
			isDefault: previousExplicitDefaultValue ?? profile.isDefault,
			wasInitiallyDefault: profile.isDefault,
		};

		let record = this.controllerProfiles.get(profile.controllerId);
		if (record) {
			record.profiles.push(extended);
			record.profiles.sort(sorter);
		} else {
			record = {
				profiles: [extended],
				controller,
			};
			this.controllerProfiles.set(profile.controllerId, record);
		}

		this.refreshContextKeys();
		this.changeEmitter.fire();
	}

	/** @inheritdoc */
	public updateProfile(controllerId: string, profileId: number, update: Partial<ITestRunProfile>): void {
		const ctrl = this.controllerProfiles.get(controllerId);
		if (!ctrl) {
			return;
		}

		const profile = ctrl.profiles.find(c => c.controllerId === controllerId && c.profileId === profileId);
		if (!profile) {
			return;
		}

		Object.assign(profile, update);
		ctrl.profiles.sort(sorter);

		// store updates is isDefault as if the user changed it (which they might
		// have through some extension-contributed UI)
		if (update.isDefault !== undefined) {
			const map = deepClone(this.userDefaults.get({}));
			setIsDefault(map, profile, update.isDefault);
			this.userDefaults.store(map);
		}

		this.changeEmitter.fire();
	}

	/** @inheritdoc */
	public configure(controllerId: string, profileId: number) {
		this.controllerProfiles.get(controllerId)?.controller.configureRunProfile(profileId);
	}

	/** @inheritdoc */
	public removeProfile(controllerId: string, profileId?: number): void {
		const ctrl = this.controllerProfiles.get(controllerId);
		if (!ctrl) {
			return;
		}

		if (!profileId) {
			this.controllerProfiles.delete(controllerId);
			this.changeEmitter.fire();
			return;
		}

		const index = ctrl.profiles.findIndex(c => c.profileId === profileId);
		if (index === -1) {
			return;
		}

		ctrl.profiles.splice(index, 1);
		this.refreshContextKeys();
		this.changeEmitter.fire();
	}

	/** @inheritdoc */
	public capabilitiesForTest(test: ITestItem) {
		const ctrl = this.controllerProfiles.get(TestId.root(test.extId));
		if (!ctrl) {
			return 0;
		}

		let capabilities = 0;
		for (const profile of ctrl.profiles) {
			if (!profile.tag || test.tags.includes(profile.tag)) {
				capabilities |= capabilities & profile.group ? TestRunProfileBitset.HasNonDefaultProfile : profile.group;
			}
		}

		return capabilities;
	}

	/** @inheritdoc */
	public all() {
		return this.controllerProfiles.values();
	}

	/** @inheritdoc */
	public getControllerProfiles(profileId: string) {
		return this.controllerProfiles.get(profileId)?.profiles ?? [];
	}

	/** @inheritdoc */
	public getGroupDefaultProfiles(group: TestRunProfileBitset, controllerId?: string) {
		const allProfiles = controllerId
			? (this.controllerProfiles.get(controllerId)?.profiles || [])
			: [...Iterable.flatMap(this.controllerProfiles.values(), c => c.profiles)];
		const defaults = allProfiles.filter(c => c.group === group && c.isDefault);

		// have *some* default profile to run if none are set otherwise
		if (defaults.length === 0) {
			const first = allProfiles.find(p => p.group === group);
			if (first) {
				defaults.push(first);
			}
		}

		return defaults;
	}

	/** @inheritdoc */
	public setGroupDefaultProfiles(group: TestRunProfileBitset, profiles: ITestRunProfile[]) {
		const next: DefaultsMap = {};
		for (const ctrl of this.controllerProfiles.values()) {
			next[ctrl.controller.id] = {};
			for (const profile of ctrl.profiles) {
				if (profile.group !== group) {
					continue;
				}

				setIsDefault(next, profile, profiles.some(p => p.profileId === profile.profileId));
			}

			// When switching a profile, if the controller has a same-named profile in
			// other groups, update those to match the enablement state as well.
			for (const profile of ctrl.profiles) {
				if (profile.group === group) {
					continue;
				}
				const matching = ctrl.profiles.find(p => p.group === group && p.label === profile.label);
				if (matching) {
					setIsDefault(next, profile, matching.isDefault);
				}
			}

			ctrl.profiles.sort(sorter);
		}

		this.userDefaults.store(next);
		this.changeEmitter.fire();
	}

	getDefaultProfileForTest(group: TestRunProfileBitset, test: InternalTestItem): ITestRunProfile | undefined {
		return this.getControllerProfiles(test.controllerId).find(p => (p.group & group) !== 0 && canUseProfileWithTest(p, test));
	}

	private refreshContextKeys() {
		let allCapabilities = 0;
		for (const { profiles } of this.controllerProfiles.values()) {
			for (const profile of profiles) {
				allCapabilities |= allCapabilities & profile.group ? TestRunProfileBitset.HasNonDefaultProfile : profile.group;
				allCapabilities |= profile.supportsContinuousRun ? TestRunProfileBitset.SupportsContinuousRun : 0;
			}
		}

		for (const group of testRunProfileBitsetList) {
			this.capabilitiesContexts[group].set((allCapabilities & group) !== 0);
		}
	}
}

const setIsDefault = (map: DefaultsMap, profile: IExtendedTestRunProfile, isDefault: boolean) => {
	profile.isDefault = isDefault;
	map[profile.controllerId] ??= {};
	if (profile.isDefault !== profile.wasInitiallyDefault) {
		map[profile.controllerId][profile.profileId] = profile.isDefault;
	} else {
		delete map[profile.controllerId][profile.profileId];
	}
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/common/testResult.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/common/testResult.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DeferredPromise } from '../../../../base/common/async.js';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Lazy } from '../../../../base/common/lazy.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IObservable, observableValue } from '../../../../base/common/observable.js';
import { language } from '../../../../base/common/platform.js';
import { WellDefinedPrefixTree } from '../../../../base/common/prefixTree.js';
import { localize } from '../../../../nls.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IComputedStateAccessor, refreshComputedState } from './getComputedState.js';
import { TestCoverage } from './testCoverage.js';
import { TestId } from './testId.js';
import { makeEmptyCounts, maxPriority, statesInOrder, terminalStatePriorities, TestStateCount } from './testingStates.js';
import { getMarkId, IRichLocation, ISerializedTestResults, ITestItem, ITestMessage, ITestOutputMessage, ITestRunTask, ITestTaskState, ResolvedTestRunRequest, TestItemExpandState, TestMessageType, TestResultItem, TestResultState } from './testTypes.js';

export interface ITestRunTaskResults extends ITestRunTask {
	/**
	 * Contains test coverage for the result, if it's available.
	 */
	readonly coverage: IObservable<TestCoverage | undefined>;

	/**
	 * Messages from the task not associated with any specific test.
	 */
	readonly otherMessages: ITestOutputMessage[];

	/**
	 * Test results output for the task.
	 */
	readonly output: ITaskRawOutput;
}

export interface ITestResult {
	/**
	 * Count of the number of tests in each run state.
	 */
	readonly counts: Readonly<TestStateCount>;

	/**
	 * Unique ID of this set of test results.
	 */
	readonly id: string;

	/**
	 * If the test is completed, the unix milliseconds time at which it was
	 * completed. If undefined, the test is still running.
	 */
	readonly completedAt: number | undefined;

	/**
	 * Whether this test result is triggered from an auto run.
	 */
	readonly request: ResolvedTestRunRequest;

	/**
	 * Human-readable name of the test result.
	 */
	readonly name: string;

	/**
	 * Gets all tests involved in the run.
	 */
	tests: IterableIterator<TestResultItem>;

	/**
	 * List of this result's subtasks.
	 */
	tasks: ReadonlyArray<ITestRunTaskResults>;

	/**
	 * Gets the state of the test by its extension-assigned ID.
	 */
	getStateById(testExtId: string): TestResultItem | undefined;

	/**
	 * Serializes the test result. Used to save and restore results
	 * in the workspace.
	 */
	toJSON(): ISerializedTestResults | undefined;

	/**
	 * Serializes the test result, includes messages. Used to send the test states to the extension host.
	 */
	toJSONWithMessages(): ISerializedTestResults | undefined;
}

/**
 * Output type exposed from live test results.
 */
export interface ITaskRawOutput {
	readonly onDidWriteData: Event<VSBuffer>;
	readonly endPromise: Promise<void>;
	readonly buffers: VSBuffer[];
	readonly length: number;

	/** Gets a continuous buffer for the desired range */
	getRange(start: number, length: number): VSBuffer;
	/** Gets an iterator of buffers for the range; may avoid allocation of getRange() */
	getRangeIter(start: number, length: number): Iterable<VSBuffer>;
}

const emptyRawOutput: ITaskRawOutput = {
	buffers: [],
	length: 0,
	onDidWriteData: Event.None,
	endPromise: Promise.resolve(),
	getRange: () => VSBuffer.alloc(0),
	getRangeIter: () => [],
};

export class TaskRawOutput implements ITaskRawOutput {
	private readonly writeDataEmitter = new Emitter<VSBuffer>();
	private readonly endDeferred = new DeferredPromise<void>();
	private offset = 0;

	/** @inheritdoc */
	public readonly onDidWriteData = this.writeDataEmitter.event;

	/** @inheritdoc */
	public readonly endPromise = this.endDeferred.p;

	/** @inheritdoc */
	public readonly buffers: VSBuffer[] = [];

	/** @inheritdoc */
	public get length() {
		return this.offset;
	}

	/** @inheritdoc */
	getRange(start: number, length: number): VSBuffer {
		const buf = VSBuffer.alloc(length);
		let bufLastWrite = 0;
		for (const chunk of this.getRangeIter(start, length)) {
			buf.buffer.set(chunk.buffer, bufLastWrite);
			bufLastWrite += chunk.byteLength;
		}

		return bufLastWrite < length ? buf.slice(0, bufLastWrite) : buf;
	}

	/** @inheritdoc */
	*getRangeIter(start: number, length: number) {
		let soFar = 0;
		let internalLastRead = 0;
		for (const b of this.buffers) {
			if (internalLastRead + b.byteLength <= start) {
				internalLastRead += b.byteLength;
				continue;
			}

			const bstart = Math.max(0, start - internalLastRead);
			const bend = Math.min(b.byteLength, bstart + length - soFar);

			yield b.slice(bstart, bend);
			soFar += bend - bstart;
			internalLastRead += b.byteLength;

			if (soFar === length) {
				break;
			}
		}
	}

	/**
	 * Appends data to the output, returning the byte range where the data can be found.
	 */
	public append(data: VSBuffer, marker?: number) {
		const offset = this.offset;
		let length = data.byteLength;
		if (marker === undefined) {
			this.push(data);
			return { offset, length };
		}

		// Bytes that should be 'trimmed' off the end of data. This is done because
		// selections in the terminal are based on the entire line, and commonly
		// the interesting marked range has a trailing new line. We don't want to
		// select the trailing line (which might have other data)
		// so we place the marker before all trailing trimbytes.
		const enum TrimBytes {
			CR = 13,
			LF = 10,
		}

		const start = VSBuffer.fromString(getMarkCode(marker, true));
		const end = VSBuffer.fromString(getMarkCode(marker, false));
		length += start.byteLength + end.byteLength;

		this.push(start);
		let trimLen = data.byteLength;
		for (; trimLen > 0; trimLen--) {
			const last = data.buffer[trimLen - 1];
			if (last !== TrimBytes.CR && last !== TrimBytes.LF) {
				break;
			}
		}

		this.push(data.slice(0, trimLen));
		this.push(end);
		this.push(data.slice(trimLen));


		return { offset, length };
	}

	private push(data: VSBuffer) {
		if (data.byteLength === 0) {
			return;
		}

		this.buffers.push(data);
		this.writeDataEmitter.fire(data);
		this.offset += data.byteLength;
	}

	/** Signals the output has ended. */
	public end() {
		this.endDeferred.complete();
	}
}

export const resultItemParents = function* (results: ITestResult, item: TestResultItem) {
	for (const id of TestId.fromString(item.item.extId).idsToRoot()) {
		yield results.getStateById(id.toString())!;
	}
};

export const maxCountPriority = (counts: Readonly<TestStateCount>) => {
	for (const state of statesInOrder) {
		if (counts[state] > 0) {
			return state;
		}
	}

	return TestResultState.Unset;
};

const getMarkCode = (marker: number, start: boolean) => `\x1b]633;SetMark;Id=${getMarkId(marker, start)};Hidden\x07`;

interface TestResultItemWithChildren extends TestResultItem {
	/** Children in the run */
	children: TestResultItemWithChildren[];
}

const itemToNode = (controllerId: string, item: ITestItem, parent: string | null): TestResultItemWithChildren => ({
	controllerId,
	expand: TestItemExpandState.NotExpandable,
	item: { ...item },
	children: [],
	tasks: [],
	ownComputedState: TestResultState.Unset,
	computedState: TestResultState.Unset,
});

export const enum TestResultItemChangeReason {
	ComputedStateChange,
	OwnStateChange,
	NewMessage,
}

export type TestResultItemChange = { item: TestResultItem; result: ITestResult } & (
	| { reason: TestResultItemChangeReason.ComputedStateChange }
	| { reason: TestResultItemChangeReason.OwnStateChange; previousState: TestResultState; previousOwnDuration: number | undefined }
	| { reason: TestResultItemChangeReason.NewMessage; message: ITestMessage }
);

/**
 * Results of a test. These are created when the test initially started running
 * and marked as "complete" when the run finishes.
 */
export class LiveTestResult extends Disposable implements ITestResult {
	private readonly completeEmitter = this._register(new Emitter<void>());
	private readonly newTaskEmitter = this._register(new Emitter<number>());
	private readonly endTaskEmitter = this._register(new Emitter<number>());
	private readonly changeEmitter = this._register(new Emitter<TestResultItemChange>());
	/** todo@connor4312: convert to a WellDefinedPrefixTree */
	private readonly testById = new Map<string, TestResultItemWithChildren>();
	private testMarkerCounter = 0;
	private _completedAt?: number;

	public readonly startedAt = Date.now();
	public readonly onChange = this.changeEmitter.event;
	public readonly onComplete = this.completeEmitter.event;
	public readonly onNewTask = this.newTaskEmitter.event;
	public readonly onEndTask = this.endTaskEmitter.event;
	public readonly tasks: (ITestRunTaskResults & { output: TaskRawOutput })[] = [];
	public readonly name = localize('runFinished', 'Test run at {0}', new Date().toLocaleString(language));

	/**
	 * @inheritdoc
	 */
	public get completedAt() {
		return this._completedAt;
	}

	/**
	 * @inheritdoc
	 */
	public readonly counts = makeEmptyCounts();

	/**
	 * @inheritdoc
	 */
	public get tests() {
		return this.testById.values();
	}

	/** Gets an included test item by ID. */
	public getTestById(id: string) {
		return this.testById.get(id)?.item;
	}

	private readonly computedStateAccessor: IComputedStateAccessor<TestResultItemWithChildren> = {
		getOwnState: i => i.ownComputedState,
		getCurrentComputedState: i => i.computedState,
		setComputedState: (i, s) => i.computedState = s,
		getChildren: i => i.children,
		getParents: i => {
			const { testById: testByExtId } = this;
			return (function* () {
				const parentId = TestId.fromString(i.item.extId).parentId;
				if (parentId) {
					for (const id of parentId.idsToRoot()) {
						yield testByExtId.get(id.toString())!;
					}
				}
			})();
		},
	};

	constructor(
		public readonly id: string,
		public readonly persist: boolean,
		public readonly request: ResolvedTestRunRequest,
		public readonly insertOrder: number,
		@ITelemetryService private readonly telemetry: ITelemetryService,
	) {
		super();
	}

	/**
	 * @inheritdoc
	 */
	public getStateById(extTestId: string) {
		return this.testById.get(extTestId);
	}

	/**
	 * Appends output that occurred during the test run.
	 */
	public appendOutput(output: VSBuffer, taskId: string, location?: IRichLocation, testId?: string): void {
		const preview = output.byteLength > 100 ? output.slice(0, 100).toString() + '…' : output.toString();
		let marker: number | undefined;

		// currently, the UI only exposes jump-to-message from tests or locations,
		// so no need to mark outputs that don't come from either of those.
		if (testId || location) {
			marker = this.testMarkerCounter++;
		}

		const index = this.mustGetTaskIndex(taskId);
		const task = this.tasks[index];

		const { offset, length } = task.output.append(output, marker);
		const message: ITestOutputMessage = {
			location,
			message: preview,
			offset,
			length,
			marker,
			type: TestMessageType.Output,
		};

		const test = testId && this.testById.get(testId);
		if (test) {
			test.tasks[index].messages.push(message);
			this.changeEmitter.fire({ item: test, result: this, reason: TestResultItemChangeReason.NewMessage, message });
		} else {
			task.otherMessages.push(message);
		}
	}

	/**
	 * Adds a new run task to the results.
	 */
	public addTask(task: ITestRunTask) {
		this.tasks.push({ ...task, coverage: observableValue(this, undefined), otherMessages: [], output: new TaskRawOutput() });

		for (const test of this.tests) {
			test.tasks.push({ duration: undefined, messages: [], state: TestResultState.Unset });
		}

		this.newTaskEmitter.fire(this.tasks.length - 1);
	}

	/**
	 * Add the chain of tests to the run. The first test in the chain should
	 * be either a test root, or a previously-known test.
	 */
	public addTestChainToRun(controllerId: string, chain: ReadonlyArray<ITestItem>) {
		let parent = this.testById.get(chain[0].extId);
		if (!parent) { // must be a test root
			parent = this.addTestToRun(controllerId, chain[0], null);
		}

		for (let i = 1; i < chain.length; i++) {
			parent = this.addTestToRun(controllerId, chain[i], parent.item.extId);
		}

		return undefined;
	}

	/**
	 * Updates the state of the test by its internal ID.
	 */
	public updateState(testId: string, taskId: string, state: TestResultState, duration?: number) {
		const entry = this.testById.get(testId);
		if (!entry) {
			return;
		}

		const index = this.mustGetTaskIndex(taskId);

		const oldTerminalStatePrio = terminalStatePriorities[entry.tasks[index].state];
		const newTerminalStatePrio = terminalStatePriorities[state];

		// Ignore requests to set the state from one terminal state back to a
		// "lower" one, e.g. from failed back to passed:
		if (oldTerminalStatePrio !== undefined &&
			(newTerminalStatePrio === undefined || newTerminalStatePrio < oldTerminalStatePrio)) {
			return;
		}

		this.fireUpdateAndRefresh(entry, index, state, duration);
	}

	/**
	 * Appends a message for the test in the run.
	 */
	public appendMessage(testId: string, taskId: string, message: ITestMessage) {
		const entry = this.testById.get(testId);
		if (!entry) {
			return;
		}

		entry.tasks[this.mustGetTaskIndex(taskId)].messages.push(message);
		this.changeEmitter.fire({ item: entry, result: this, reason: TestResultItemChangeReason.NewMessage, message });
	}

	/**
	 * Marks the task in the test run complete.
	 */
	public markTaskComplete(taskId: string) {
		const index = this.mustGetTaskIndex(taskId);
		const task = this.tasks[index];
		task.running = false;
		task.output.end();

		this.setAllToState(
			TestResultState.Skipped,
			taskId,
			t => t.state === TestResultState.Queued || t.state === TestResultState.Running,
		);

		this.endTaskEmitter.fire(index);
	}

	/**
	 * Notifies the service that all tests are complete.
	 */
	public markComplete() {
		if (this._completedAt !== undefined) {
			throw new Error('cannot complete a test result multiple times');
		}

		for (const task of this.tasks) {
			if (task.running) {
				this.markTaskComplete(task.id);
			}
		}

		this._completedAt = Date.now();
		this.completeEmitter.fire();

		this.telemetry.publicLog2<
			{ failures: number; passes: number; controller: string },
			{
				owner: 'connor4312';
				comment: 'Test outcome metrics. This helps us understand magnitude of feature use and how to build fix suggestions.';
				failures: { comment: 'Number of test failures'; classification: 'SystemMetaData'; purpose: 'FeatureInsight' };
				passes: { comment: 'Number of test failures'; classification: 'SystemMetaData'; purpose: 'FeatureInsight' };
				controller: { comment: 'The test controller being used'; classification: 'SystemMetaData'; purpose: 'FeatureInsight' };
			}
		>('test.outcomes', {
			failures: this.counts[TestResultState.Errored] + this.counts[TestResultState.Failed],
			passes: this.counts[TestResultState.Passed],
			controller: this.request.targets.map(t => t.controllerId).join(',')
		});
	}

	/**
	 * Marks the test and all of its children in the run as retired.
	 */
	public markRetired(testIds: WellDefinedPrefixTree<undefined> | undefined) {
		for (const [id, test] of this.testById) {
			if (!test.retired && (!testIds || testIds.hasKeyOrParent(TestId.fromString(id).path))) {
				test.retired = true;
				this.changeEmitter.fire({ reason: TestResultItemChangeReason.ComputedStateChange, item: test, result: this });
			}
		}
	}

	/**
	 * @inheritdoc
	 */
	public toJSON(): ISerializedTestResults | undefined {
		return this.completedAt && this.persist ? this.doSerialize.value : undefined;
	}

	public toJSONWithMessages(): ISerializedTestResults | undefined {
		return this.completedAt && this.persist ? this.doSerializeWithMessages.value : undefined;
	}

	/**
	 * Updates all tests in the collection to the given state.
	 */
	protected setAllToState(state: TestResultState, taskId: string, when: (task: ITestTaskState, item: TestResultItem) => boolean) {
		const index = this.mustGetTaskIndex(taskId);
		for (const test of this.testById.values()) {
			if (when(test.tasks[index], test)) {
				this.fireUpdateAndRefresh(test, index, state);
			}
		}
	}

	private fireUpdateAndRefresh(entry: TestResultItem, taskIndex: number, newState: TestResultState, newOwnDuration?: number) {
		const previousOwnComputed = entry.ownComputedState;
		const previousOwnDuration = entry.ownDuration;
		const changeEvent: TestResultItemChange = {
			item: entry,
			result: this,
			reason: TestResultItemChangeReason.OwnStateChange,
			previousState: previousOwnComputed,
			previousOwnDuration: previousOwnDuration,
		};

		entry.tasks[taskIndex].state = newState;
		if (newOwnDuration !== undefined) {
			entry.tasks[taskIndex].duration = newOwnDuration;
			entry.ownDuration = Math.max(entry.ownDuration || 0, newOwnDuration);
		}

		const newOwnComputed = maxPriority(...entry.tasks.map(t => t.state));
		if (newOwnComputed === previousOwnComputed) {
			if (newOwnDuration !== previousOwnDuration) {
				this.changeEmitter.fire(changeEvent); // fire manually since state change won't do it
			}
			return;
		}

		entry.ownComputedState = newOwnComputed;
		this.counts[previousOwnComputed]--;
		this.counts[newOwnComputed]++;
		refreshComputedState(this.computedStateAccessor, entry).forEach(t =>
			this.changeEmitter.fire(t === entry ? changeEvent : {
				item: t,
				result: this,
				reason: TestResultItemChangeReason.ComputedStateChange,
			}),
		);
	}

	private addTestToRun(controllerId: string, item: ITestItem, parent: string | null) {
		const node = itemToNode(controllerId, item, parent);
		this.testById.set(item.extId, node);
		this.counts[TestResultState.Unset]++;

		if (parent) {
			this.testById.get(parent)?.children.push(node);
		}

		if (this.tasks.length) {
			for (let i = 0; i < this.tasks.length; i++) {
				node.tasks.push({ duration: undefined, messages: [], state: TestResultState.Unset });
			}
		}

		return node;
	}

	private mustGetTaskIndex(taskId: string) {
		const index = this.tasks.findIndex(t => t.id === taskId);
		if (index === -1) {
			throw new Error(`Unknown task ${taskId} in updateState`);
		}

		return index;
	}

	private readonly doSerialize = new Lazy((): ISerializedTestResults => ({
		id: this.id,
		completedAt: this.completedAt!,
		tasks: this.tasks.map(t => ({ id: t.id, name: t.name, ctrlId: t.ctrlId, hasCoverage: !!t.coverage.get() })),
		name: this.name,
		request: this.request,
		items: [...this.testById.values()].map(TestResultItem.serializeWithoutMessages),
	}));

	private readonly doSerializeWithMessages = new Lazy((): ISerializedTestResults => ({
		id: this.id,
		completedAt: this.completedAt!,
		tasks: this.tasks.map(t => ({ id: t.id, name: t.name, ctrlId: t.ctrlId, hasCoverage: !!t.coverage.get() })),
		name: this.name,
		request: this.request,
		items: [...this.testById.values()].map(TestResultItem.serialize),
	}));
}

/**
 * Test results hydrated from a previously-serialized test run.
 */
export class HydratedTestResult implements ITestResult {
	/**
	 * @inheritdoc
	 */
	public readonly counts = makeEmptyCounts();

	/**
	 * @inheritdoc
	 */
	public readonly id: string;

	/**
	 * @inheritdoc
	 */
	public readonly completedAt: number;

	/**
	 * @inheritdoc
	 */
	public readonly tasks: ITestRunTaskResults[];

	/**
	 * @inheritdoc
	 */
	public get tests() {
		return this.testById.values();
	}

	/**
	 * @inheritdoc
	 */
	public readonly name: string;

	/**
	 * @inheritdoc
	 */
	public readonly request: ResolvedTestRunRequest;

	private readonly testById = new Map<string, TestResultItem>();

	constructor(
		identity: IUriIdentityService,
		private readonly serialized: ISerializedTestResults,
		private readonly persist = true,
	) {
		this.id = serialized.id;
		this.completedAt = serialized.completedAt;
		this.tasks = serialized.tasks.map((task, i) => ({
			id: task.id,
			name: task.name || localize('testUnnamedTask', 'Unnamed Task'),
			ctrlId: task.ctrlId,
			running: false,
			coverage: observableValue(this, undefined),
			output: emptyRawOutput,
			otherMessages: []
		}));
		this.name = serialized.name;
		this.request = serialized.request;

		for (const item of serialized.items) {
			const de = TestResultItem.deserialize(identity, item);
			this.counts[de.ownComputedState]++;
			this.testById.set(item.item.extId, de);
		}
	}

	/**
	 * @inheritdoc
	 */
	public getStateById(extTestId: string) {
		return this.testById.get(extTestId);
	}

	/**
	 * @inheritdoc
	 */
	public toJSON(): ISerializedTestResults | undefined {
		return this.persist ? this.serialized : undefined;
	}

	/**
	 * @inheritdoc
	 */
	public toJSONWithMessages(): ISerializedTestResults | undefined {
		return this.toJSON();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/common/testResultService.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/common/testResultService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { findFirstIdxMonotonousOrArrLen } from '../../../../base/common/arraysFind.js';
import { RunOnceScheduler } from '../../../../base/common/async.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { createSingleCallFunction } from '../../../../base/common/functional.js';
import { Disposable, DisposableStore, dispose, toDisposable } from '../../../../base/common/lifecycle.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { TestingContextKeys } from './testingContextKeys.js';
import { ITestProfileService } from './testProfileService.js';
import { ITestResult, LiveTestResult, TestResultItemChange, TestResultItemChangeReason } from './testResult.js';
import { ITestResultStorage, RETAIN_MAX_RESULTS } from './testResultStorage.js';
import { ExtensionRunTestsRequest, ITestRunProfile, ResolvedTestRunRequest, TestResultItem, TestResultState, TestRunProfileBitset } from './testTypes.js';

export type ResultChangeEvent =
	| { completed: LiveTestResult }
	| { started: LiveTestResult }
	| { inserted: ITestResult }
	| { removed: ITestResult[] };

export interface ITestResultService {
	readonly _serviceBrand: undefined;
	/**
	 * Fired after any results are added, removed, or completed.
	 */
	readonly onResultsChanged: Event<ResultChangeEvent>;

	/**
	 * Fired when a test changed it state, or its computed state is updated.
	 */
	readonly onTestChanged: Event<TestResultItemChange>;

	/**
	 * List of known test results.
	 */
	readonly results: ReadonlyArray<ITestResult>;

	/**
	 * Discards all completed test results.
	 */
	clear(): void;

	/**
	 * Creates a new, live test result.
	 */
	createLiveResult(req: ResolvedTestRunRequest | ExtensionRunTestsRequest): LiveTestResult;

	/**
	 * Adds a new test result to the collection.
	 */
	push<T extends ITestResult>(result: T): T;

	/**
	 * Looks up a set of test results by ID.
	 */
	getResult(resultId: string): ITestResult | undefined;

	/**
	 * Looks up a test's most recent state, by its extension-assigned ID.
	 */
	getStateById(extId: string): [results: ITestResult, item: TestResultItem] | undefined;
}

const isRunningTests = (service: ITestResultService) =>
	service.results.length > 0 && service.results[0].completedAt === undefined;

export const ITestResultService = createDecorator<ITestResultService>('testResultService');

export class TestResultService extends Disposable implements ITestResultService {
	declare _serviceBrand: undefined;
	private changeResultEmitter = this._register(new Emitter<ResultChangeEvent>());
	private _results: ITestResult[] = [];
	private readonly _resultsDisposables: DisposableStore[] = [];
	private testChangeEmitter = this._register(new Emitter<TestResultItemChange>());
	private insertOrderCounter = 0;

	/**
	 * @inheritdoc
	 */
	public get results() {
		this.loadResults();
		return this._results;
	}

	/**
	 * @inheritdoc
	 */
	public readonly onResultsChanged = this.changeResultEmitter.event;

	/**
	 * @inheritdoc
	 */
	public readonly onTestChanged = this.testChangeEmitter.event;

	private readonly isRunning: IContextKey<boolean>;
	private readonly hasAnyResults: IContextKey<boolean>;
	private readonly loadResults = createSingleCallFunction(() => this.storage.read().then(loaded => {
		for (let i = loaded.length - 1; i >= 0; i--) {
			this.push(loaded[i]);
		}
	}));

	protected readonly persistScheduler = new RunOnceScheduler(() => this.persistImmediately(), 500);

	constructor(
		@IContextKeyService contextKeyService: IContextKeyService,
		@ITestResultStorage private readonly storage: ITestResultStorage,
		@ITestProfileService private readonly testProfiles: ITestProfileService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
	) {
		super();
		this._register(toDisposable(() => dispose(this._resultsDisposables)));
		this.isRunning = TestingContextKeys.isRunning.bindTo(contextKeyService);
		this.hasAnyResults = TestingContextKeys.hasAnyResults.bindTo(contextKeyService);
	}

	/**
	 * @inheritdoc
	 */
	public getStateById(extId: string): [results: ITestResult, item: TestResultItem] | undefined {
		for (const result of this.results) {
			const lookup = result.getStateById(extId);
			if (lookup && lookup.computedState !== TestResultState.Unset) {
				return [result, lookup];
			}
		}

		return undefined;
	}

	/**
	 * @inheritdoc
	 */
	public createLiveResult(req: ResolvedTestRunRequest | ExtensionRunTestsRequest) {
		if ('targets' in req) {
			const id = generateUuid();
			return this.push(new LiveTestResult(id, true, req, this.insertOrderCounter++, this.telemetryService));
		}

		let profile: ITestRunProfile | undefined;
		if (req.profile) {
			const profiles = this.testProfiles.getControllerProfiles(req.controllerId);
			profile = profiles.find(c => c.profileId === req.profile!.id);
		}

		const resolved: ResolvedTestRunRequest = {
			preserveFocus: req.preserveFocus,
			targets: [],
			exclude: req.exclude,
			continuous: req.continuous,
			group: profile?.group ?? TestRunProfileBitset.Run,
		};

		if (profile) {
			resolved.targets.push({
				profileId: profile.profileId,
				controllerId: req.controllerId,
				testIds: req.include,
			});
		}

		return this.push(new LiveTestResult(req.id, req.persist, resolved, this.insertOrderCounter++, this.telemetryService));
	}

	/**
	 * @inheritdoc
	 */
	public push<T extends ITestResult>(result: T): T {
		if (result.completedAt === undefined) {
			this.results.unshift(result);
		} else {
			const index = findFirstIdxMonotonousOrArrLen(this.results, r => r.completedAt !== undefined && r.completedAt <= result.completedAt!);
			this.results.splice(index, 0, result);
			this.persistScheduler.schedule();
		}

		this.hasAnyResults.set(true);
		if (this.results.length > RETAIN_MAX_RESULTS) {
			this.results.pop();
			this._resultsDisposables.pop()?.dispose();
		}

		const ds = new DisposableStore();
		this._resultsDisposables.push(ds);

		if (result instanceof LiveTestResult) {
			ds.add(result);
			ds.add(result.onComplete(() => this.onComplete(result)));
			ds.add(result.onChange(this.testChangeEmitter.fire, this.testChangeEmitter));
			this.isRunning.set(true);
			this.changeResultEmitter.fire({ started: result });
		} else {
			this.changeResultEmitter.fire({ inserted: result });
			// If this is not a new result, go through each of its tests. For each
			// test for which the new result is the most recently inserted, fir
			// a change event so that UI updates.
			for (const item of result.tests) {
				for (const otherResult of this.results) {
					if (otherResult === result) {
						this.testChangeEmitter.fire({ item, result, reason: TestResultItemChangeReason.ComputedStateChange });
						break;
					} else if (otherResult.getStateById(item.item.extId) !== undefined) {
						break;
					}
				}
			}
		}

		return result;
	}

	/**
	 * @inheritdoc
	 */
	public getResult(id: string) {
		return this.results.find(r => r.id === id);
	}

	/**
	 * @inheritdoc
	 */
	public clear() {
		const keep: ITestResult[] = [];
		const removed: ITestResult[] = [];
		for (const result of this.results) {
			if (result.completedAt !== undefined) {
				removed.push(result);
			} else {
				keep.push(result);
			}
		}

		this._results = keep;
		this.persistScheduler.schedule();
		if (keep.length === 0) {
			this.hasAnyResults.set(false);
		}
		this.changeResultEmitter.fire({ removed });
	}

	private onComplete(result: LiveTestResult) {
		this.resort();
		this.updateIsRunning();
		this.persistScheduler.schedule();
		this.changeResultEmitter.fire({ completed: result });
	}

	private resort() {
		this.results.sort((a, b) => {
			// Running tests should always be sorted higher:
			if (!!a.completedAt !== !!b.completedAt) {
				return a.completedAt === undefined ? -1 : 1;
			}

			// Otherwise sort by insertion order, hydrated tests are always last:
			const aComp = a instanceof LiveTestResult ? a.insertOrder : -1;
			const bComp = b instanceof LiveTestResult ? b.insertOrder : -1;
			return bComp - aComp;
		});
	}

	private updateIsRunning() {
		this.isRunning.set(isRunningTests(this));
	}

	protected async persistImmediately() {
		// ensure results are loaded before persisting to avoid deleting once
		// that we don't have yet.
		await this.loadResults();
		this.storage.persist(this.results);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/common/testResultStorage.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/common/testResultStorage.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { bufferToStream, newWriteableBufferStream, VSBuffer, VSBufferReadableStream, VSBufferWriteableStream } from '../../../../base/common/buffer.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { isDefined } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { StoredValue } from './storedValue.js';
import { HydratedTestResult, ITestResult } from './testResult.js';
import { ISerializedTestResults } from './testTypes.js';

export const RETAIN_MAX_RESULTS = 128;
const RETAIN_MIN_RESULTS = 16;
const RETAIN_MAX_BYTES = 1024 * 128;
const CLEANUP_PROBABILITY = 0.2;

export interface ITestResultStorage {
	_serviceBrand: undefined;

	/**
	 * Retrieves the list of stored test results.
	 */
	read(): Promise<HydratedTestResult[]>;

	/**
	 * Persists the list of test results.
	 */
	persist(results: ReadonlyArray<ITestResult>): Promise<void>;
}

export const ITestResultStorage = createDecorator('ITestResultStorage');

/**
 * Data revision this version of VS Code deals with. Should be bumped whenever
 * a breaking change is made to the stored results, which will cause previous
 * revisions to be discarded.
 */
const currentRevision = 1;

export abstract class BaseTestResultStorage extends Disposable implements ITestResultStorage {
	declare readonly _serviceBrand: undefined;

	protected readonly stored: StoredValue<ReadonlyArray<{ rev: number; id: string; bytes: number }>>;

	constructor(
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@IStorageService storageService: IStorageService,
		@ILogService private readonly logService: ILogService,
	) {
		super();
		this.stored = this._register(new StoredValue<ReadonlyArray<{ rev: number; id: string; bytes: number }>>({
			key: 'storedTestResults',
			scope: StorageScope.WORKSPACE,
			target: StorageTarget.MACHINE
		}, storageService));
	}

	/**
	 * @override
	 */
	public async read(): Promise<HydratedTestResult[]> {
		const results = await Promise.all(this.stored.get([]).map(async (rec) => {
			if (rec.rev !== currentRevision) {
				return undefined;
			}

			try {
				const contents = await this.readForResultId(rec.id);
				if (!contents) {
					return undefined;
				}

				return { rec, result: new HydratedTestResult(this.uriIdentityService, contents) };
			} catch (e) {
				this.logService.warn(`Error deserializing stored test result ${rec.id}`, e);
				return undefined;
			}
		}));

		const defined = results.filter(isDefined);
		if (defined.length !== results.length) {
			this.stored.store(defined.map(({ rec }) => rec));
		}

		return defined.map(({ result }) => result);
	}

	/**
	 * @override
	 */
	public getResultOutputWriter(resultId: string) {
		const stream = newWriteableBufferStream();
		this.storeOutputForResultId(resultId, stream);
		return stream;
	}

	/**
	 * @override
	 */
	public async persist(results: ReadonlyArray<ITestResult>): Promise<void> {
		const toDelete = new Map(this.stored.get([]).map(({ id, bytes }) => [id, bytes]));
		const toStore: { rev: number; id: string; bytes: number }[] = [];
		const todo: Promise<unknown>[] = [];
		let budget = RETAIN_MAX_BYTES;

		// Run until either:
		// 1. We store all results
		// 2. We store the max results
		// 3. We store the min results, and have no more byte budget
		for (
			let i = 0;
			i < results.length && i < RETAIN_MAX_RESULTS && (budget > 0 || toStore.length < RETAIN_MIN_RESULTS);
			i++
		) {
			const result = results[i];
			const existingBytes = toDelete.get(result.id);
			if (existingBytes !== undefined) {
				toDelete.delete(result.id);
				toStore.push({ id: result.id, rev: currentRevision, bytes: existingBytes });
				budget -= existingBytes;
				continue;
			}

			const obj = result.toJSON();
			if (!obj) {
				continue;
			}

			const contents = VSBuffer.fromString(JSON.stringify(obj));
			todo.push(this.storeForResultId(result.id, obj));
			toStore.push({ id: result.id, rev: currentRevision, bytes: contents.byteLength });
			budget -= contents.byteLength;
		}

		for (const id of toDelete.keys()) {
			todo.push(this.deleteForResultId(id).catch(() => undefined));
		}

		this.stored.store(toStore);
		await Promise.all(todo);
	}

	/**
	 * Reads serialized results for the test. Is allowed to throw.
	 */
	protected abstract readForResultId(id: string): Promise<ISerializedTestResults | undefined>;

	/**
	 * Reads output as a stream for the test.
	 */
	protected abstract readOutputForResultId(id: string): Promise<VSBufferReadableStream>;

	/**
	 * Reads an output range for the test.
	 */
	protected abstract readOutputRangeForResultId(id: string, offset: number, length: number): Promise<VSBuffer>;

	/**
	 * Deletes serialized results for the test.
	 */
	protected abstract deleteForResultId(id: string): Promise<unknown>;

	/**
	 * Stores test results by ID.
	 */
	protected abstract storeForResultId(id: string, data: ISerializedTestResults): Promise<unknown>;

	/**
	 * Reads serialized results for the test. Is allowed to throw.
	 */
	protected abstract storeOutputForResultId(id: string, input: VSBufferWriteableStream): Promise<void>;
}

export class InMemoryResultStorage extends BaseTestResultStorage {
	public readonly cache = new Map<string, ISerializedTestResults>();

	protected async readForResultId(id: string) {
		return Promise.resolve(this.cache.get(id));
	}

	protected storeForResultId(id: string, contents: ISerializedTestResults) {
		this.cache.set(id, contents);
		return Promise.resolve();
	}

	protected deleteForResultId(id: string) {
		this.cache.delete(id);
		return Promise.resolve();
	}

	protected readOutputForResultId(id: string): Promise<VSBufferReadableStream> {
		throw new Error('Method not implemented.');
	}

	protected storeOutputForResultId(id: string, input: VSBufferWriteableStream): Promise<void> {
		throw new Error('Method not implemented.');
	}

	protected readOutputRangeForResultId(id: string, offset: number, length: number): Promise<VSBuffer> {
		throw new Error('Method not implemented.');
	}
}

export class TestResultStorage extends BaseTestResultStorage {
	private readonly directory: URI;

	constructor(
		@IUriIdentityService uriIdentityService: IUriIdentityService,
		@IStorageService storageService: IStorageService,
		@ILogService logService: ILogService,
		@IWorkspaceContextService workspaceContext: IWorkspaceContextService,
		@IFileService private readonly fileService: IFileService,
		@IEnvironmentService environmentService: IEnvironmentService,
	) {
		super(uriIdentityService, storageService, logService);
		this.directory = URI.joinPath(environmentService.workspaceStorageHome, workspaceContext.getWorkspace().id, 'testResults');
	}

	protected async readForResultId(id: string) {
		const contents = await this.fileService.readFile(this.getResultJsonPath(id));
		return JSON.parse(contents.value.toString());
	}

	protected storeForResultId(id: string, contents: ISerializedTestResults) {
		return this.fileService.writeFile(this.getResultJsonPath(id), VSBuffer.fromString(JSON.stringify(contents)));
	}

	protected deleteForResultId(id: string) {
		return this.fileService.del(this.getResultJsonPath(id)).catch(() => undefined);
	}

	protected async readOutputRangeForResultId(id: string, offset: number, length: number): Promise<VSBuffer> {
		try {
			const { value } = await this.fileService.readFile(this.getResultOutputPath(id), { position: offset, length });
			return value;
		} catch {
			return VSBuffer.alloc(0);
		}
	}


	protected async readOutputForResultId(id: string): Promise<VSBufferReadableStream> {
		try {
			const { value } = await this.fileService.readFileStream(this.getResultOutputPath(id));
			return value;
		} catch {
			return bufferToStream(VSBuffer.alloc(0));
		}
	}

	protected async storeOutputForResultId(id: string, input: VSBufferWriteableStream) {
		await this.fileService.createFile(this.getResultOutputPath(id), input);
	}

	/**
	 * @inheritdoc
	 */
	public override async persist(results: ReadonlyArray<ITestResult>) {
		await super.persist(results);
		if (Math.random() < CLEANUP_PROBABILITY) {
			await this.cleanupDereferenced();
		}
	}

	/**
	 * Cleans up orphaned files. For instance, output can get orphaned if it's
	 * written but the editor is closed before the test run is complete.
	 */
	private async cleanupDereferenced() {
		const { children } = await this.fileService.resolve(this.directory);
		if (!children) {
			return;
		}

		const stored = new Set(this.stored.get([]).filter(s => s.rev === currentRevision).map(s => s.id));

		await Promise.all(
			children
				.filter(child => !stored.has(child.name.replace(/\.[a-z]+$/, '')))
				.map(child => this.fileService.del(child.resource).catch(() => undefined))
		);
	}

	private getResultJsonPath(id: string) {
		return URI.joinPath(this.directory, `${id}.json`);
	}

	private getResultOutputPath(id: string) {
		return URI.joinPath(this.directory, `${id}.output`);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/common/testService.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/common/testService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { assert } from '../../../../base/common/assert.js';
import { DeferredPromise } from '../../../../base/common/async.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Event } from '../../../../base/common/event.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { LinkedList } from '../../../../base/common/linkedList.js';
import { MarshalledId } from '../../../../base/common/marshallingIds.js';
import { IObservable } from '../../../../base/common/observable.js';
import { IPrefixTreeNode, WellDefinedPrefixTree } from '../../../../base/common/prefixTree.js';
import { URI } from '../../../../base/common/uri.js';
import { Position } from '../../../../editor/common/core/position.js';
import { Location } from '../../../../editor/common/languages.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { MutableObservableValue } from './observableValue.js';
import { TestExclusions } from './testExclusions.js';
import { TestId, TestIdPathParts } from './testId.js';
import { ITestResult } from './testResult.js';
import { AbstractIncrementalTestCollection, ICallProfileRunHandler, IncrementalTestCollectionItem, InternalTestItem, IStartControllerTests, IStartControllerTestsResult, ITestItemContext, ResolvedTestRunRequest, TestControllerCapability, TestItemExpandState, TestMessageFollowupRequest, TestMessageFollowupResponse, TestRunProfileBitset, TestsDiff } from './testTypes.js';

export const ITestService = createDecorator<ITestService>('testService');

export interface IMainThreadTestController {
	readonly id: string;
	readonly label: IObservable<string>;
	readonly capabilities: IObservable<TestControllerCapability>;
	syncTests(token: CancellationToken): Promise<void>;
	refreshTests(token: CancellationToken): Promise<void>;
	configureRunProfile(profileId: number): void;
	expandTest(id: string, levels: number): Promise<void>;
	getRelatedCode(testId: string, token: CancellationToken): Promise<Location[]>;
	startContinuousRun(request: ICallProfileRunHandler[], token: CancellationToken): Promise<IStartControllerTestsResult[]>;
	runTests(request: IStartControllerTests[], token: CancellationToken): Promise<IStartControllerTestsResult[]>;
}

export interface IMainThreadTestHostProxy {
	provideTestFollowups(req: TestMessageFollowupRequest, token: CancellationToken): Promise<TestMessageFollowupResponse[]>;
	getTestsRelatedToCode(uri: URI, position: Position, token: CancellationToken): Promise<string[]>;
	executeTestFollowup(id: number): Promise<void>;
	disposeTestFollowups(ids: number[]): void;
}

export interface IMainThreadTestCollection extends AbstractIncrementalTestCollection<IncrementalTestCollectionItem> {
	readonly onBusyProvidersChange: Event<number>;

	/**
	 * Number of providers working to discover tests.
	 */
	busyProviders: number;

	/**
	 * Root item IDs.
	 */
	rootIds: Iterable<string>;

	/**
	 * Root items, correspond to registered controllers.
	 */
	rootItems: Iterable<IncrementalTestCollectionItem>;

	/**
	 * Iterates over every test in the collection, in strictly descending
	 * order of depth.
	 */
	all: Iterable<IncrementalTestCollectionItem>;

	/**
	 * Gets a node in the collection by ID.
	 */
	getNodeById(id: string): IncrementalTestCollectionItem | undefined;

	/**
	 * Gets all tests that have the given URL. Tests returned from this
	 * method are *not* in any particular order.
	 */
	getNodeByUrl(uri: URI): Iterable<IncrementalTestCollectionItem>;

	/**
	 * Requests that children be revealed for the given test. "Levels" may
	 * be infinite.
	 */
	expand(testId: string, levels: number): Promise<void>;

	/**
	 * Gets a diff that adds all items currently in the tree to a new collection,
	 * allowing it to fully hydrate.
	 */
	getReviverDiff(): TestsDiff;
}

export const testCollectionIsEmpty = (collection: IMainThreadTestCollection) =>
	!Iterable.some(collection.rootItems, r => r.children.size > 0);

export const getContextForTestItem = (collection: IMainThreadTestCollection, id: string | TestId) => {
	if (typeof id === 'string') {
		id = TestId.fromString(id);
	}

	if (id.isRoot) {
		return { controller: id.toString() };
	}

	const context: ITestItemContext = { $mid: MarshalledId.TestItemContext, tests: [] };
	for (const i of id.idsFromRoot()) {
		if (!i.isRoot) {
			const test = collection.getNodeById(i.toString());
			if (test) {
				context.tests.push(test);
			}
		}
	}

	return context;
};

/**
 * Ensures the test with the given ID exists in the collection, if possible.
 * If cancellation is requested, or the test cannot be found, it will return
 * undefined.
 */
export const expandAndGetTestById = async (collection: IMainThreadTestCollection, id: string, ct = CancellationToken.None) => {
	const idPath = [...TestId.fromString(id).idsFromRoot()];

	let expandToLevel = 0;
	for (let i = idPath.length - 1; !ct.isCancellationRequested && i >= expandToLevel;) {
		const id = idPath[i].toString();
		const existing = collection.getNodeById(id);
		if (!existing) {
			i--;
			continue;
		}

		if (i === idPath.length - 1) {
			return existing;
		}

		// expand children only if it looks like it's necessary
		if (!existing.children.has(idPath[i + 1].toString())) {
			await collection.expand(id, 0);
		}

		expandToLevel = i + 1; // avoid an infinite loop if the test does not exist
		i = idPath.length - 1;
	}
	return undefined;
};

/**
 * Waits for the test to no longer be in the "busy" state.
 */
export const waitForTestToBeIdle = (testService: ITestService, test: IncrementalTestCollectionItem) => {
	if (!test.item.busy) {
		return;
	}

	return new Promise<void>(resolve => {
		const l = testService.onDidProcessDiff(() => {
			if (testService.collection.getNodeById(test.item.extId)?.item.busy !== true) {
				resolve(); // removed, or no longer busy
				l.dispose();
			}
		});
	});
};

/**
 * Iterator that expands to and iterates through tests in the file. Iterates
 * in strictly descending order.
 */
export const testsInFile = async function* (testService: ITestService, ident: IUriIdentityService, uri: URI, waitForIdle = true, descendInFile = true): AsyncIterable<readonly IncrementalTestCollectionItem[]> {
	// In this function we go to a bit of effort to avoid awaiting unnecessarily
	// and bulking the test collections we do collect for consumers. This fixes
	// a performance issue (#235819) where a large number of tests in a file
	// would cause a long delay switching editors.
	const queue = new LinkedList<Iterable<string> | DeferredPromise<Iterable<string>>>();

	const existing = [...testService.collection.getNodeByUrl(uri)].sort((a, b) => a.item.extId.length - b.item.extId.length);

	// getNodeByUrl will return all known tests in the URI, but this can include
	// children of tests even when `descendInFile` is false. Remove those cases.
	for (let i = 0; i < existing.length - 1; i++) {
		const prefix = existing[i].item.extId + TestIdPathParts.Delimiter;
		for (let k = i + 1; k < existing.length; k++) {
			if (existing[k].item.extId.startsWith(prefix)) {
				existing.splice(k--, 1);
			}
		}
	}

	queue.push(existing.length ? existing.map(e => e.item.extId) : testService.collection.rootIds);

	let n = 0;
	let gather: IncrementalTestCollectionItem[] = [];
	while (queue.size > 0) {
		const next = queue.pop()!;
		let ids: Iterable<string>;
		if (!(next instanceof DeferredPromise)) {
			ids = next;
		} else if (next.isSettled) {
			ids = next.value || Iterable.empty();
		} else {
			if (gather.length) {
				yield gather;
				gather = [];
			}
			ids = await next.p;
		}

		for (const id of ids) {
			n++;
			const test = testService.collection.getNodeById(id);
			if (!test) {
				continue; // possible because we expand async and things could delete
			}

			if (!test.item.uri) {
				queue.push(test.children);
				continue;
			}

			if (ident.extUri.isEqual(uri, test.item.uri)) {
				gather.push(test);

				if (!descendInFile) {
					continue;
				}
			}

			if (ident.extUri.isEqualOrParent(uri, test.item.uri)) {
				let prom: Promise<void> | undefined;
				if (test.expand === TestItemExpandState.Expandable) {
					prom = testService.collection.expand(test.item.extId, 1);
				}
				if (waitForIdle) {
					if (prom) {
						prom = prom.then(() => waitForTestToBeIdle(testService, test));
					} else if (test.item.busy) {
						prom = waitForTestToBeIdle(testService, test);
					}
				}

				if (prom) {
					queue.push(DeferredPromise.fromPromise(prom.then(() => test.children)));
				} else if (test.children.size) {
					queue.push(test.children);
				}
			}
		}
	}

	if (gather.length) {
		yield gather;
	}
};

/**
 * Iterator that iterates to the top-level children of tests under the given
 * the URI.
 */
export const testsUnderUri = async function* (testService: ITestService, ident: IUriIdentityService, uri: URI, waitForIdle = true): AsyncIterable<IncrementalTestCollectionItem> {

	const queue = [testService.collection.rootIds];
	while (queue.length) {
		for (const testId of queue.pop()!) {
			const test = testService.collection.getNodeById(testId);

			// Expand tests with URIs that are parent of the item, add tests
			// that are within the URI. Don't add their children, since those
			// tests already encompass their children.
			if (!test) {
				// no-op
			} else if (test.item.uri && ident.extUri.isEqualOrParent(test.item.uri, uri)) {
				yield test;
			} else if (!test.item.uri || ident.extUri.isEqualOrParent(uri, test.item.uri)) {
				if (test.expand === TestItemExpandState.Expandable) {
					await testService.collection.expand(test.item.extId, 1);
				}
				if (waitForIdle) {
					await waitForTestToBeIdle(testService, test);
				}
				queue.push(test.children.values());
			}
		}
	}
};

/**
 * Simplifies the array of tests by preferring test item parents if all of
 * their children are included.
 */
export const simplifyTestsToExecute = (collection: IMainThreadTestCollection, tests: IncrementalTestCollectionItem[]): IncrementalTestCollectionItem[] => {
	if (tests.length < 2) {
		return tests;
	}

	const tree = new WellDefinedPrefixTree<IncrementalTestCollectionItem>();
	for (const test of tests) {
		tree.insert(TestId.fromString(test.item.extId).path, test);
	}

	const out: IncrementalTestCollectionItem[] = [];

	// Returns the node if it and any children should be included. Otherwise
	// pushes into the `out` any individual children that should be included.
	const process = (currentId: string[], node: IPrefixTreeNode<IncrementalTestCollectionItem>) => {
		// directly included, don't try to over-specify, and children should be ignored
		if (node.value) {
			return node.value;
		}

		assert(!!node.children, 'expect to have children');

		const thisChildren: IncrementalTestCollectionItem[] = [];
		for (const [part, child] of node.children) {
			currentId.push(part);
			const c = process(currentId, child);
			if (c) { thisChildren.push(c); }
			currentId.pop();
		}

		if (!thisChildren.length) {
			return;
		}

		// If there are multiple children and we have all of them, then tell the
		// parent this node should be included. Otherwise include children individually.
		const id = new TestId(currentId);
		const test = collection.getNodeById(id.toString());
		if (test?.children.size === thisChildren.length) {
			return test;
		}

		out.push(...thisChildren);
		return;
	};

	for (const [id, node] of tree.entries) {
		const n = process([id], node);
		if (n) { out.push(n); }
	}

	return out;
};

/**
 * A run request that expresses the intent of the request and allows the
 * test service to resolve the specifics of the group.
 */
export interface AmbiguousRunTestsRequest {
	/** Group to run */
	group: TestRunProfileBitset;
	/** Tests to run. Allowed to be from different controllers */
	tests: readonly InternalTestItem[];
	/** Tests to exclude. If not given, the current UI excluded tests are used */
	exclude?: InternalTestItem[];
	/** Whether this was triggered from an auto run. */
	continuous?: boolean;
	/** Whether this was trigged by a user action in UI. Default=true */
	preserveFocus?: boolean;
}

export interface ITestFollowup {
	message: string;
	execute(): Promise<void>;
}

export interface ITestFollowups extends IDisposable {
	followups: ITestFollowup[];
}

export interface ITestService {
	readonly _serviceBrand: undefined;
	/**
	 * Fires when the user requests to cancel a test run -- or all runs, if no
	 * runId is given.
	 */
	readonly onDidCancelTestRun: Event<{ runId: string | undefined; taskId: string | undefined }>;

	/**
	 * Event that fires when the excluded tests change.
	 */
	readonly excluded: TestExclusions;

	/**
	 * Test collection instance.
	 */
	readonly collection: IMainThreadTestCollection;

	/**
	 * Event that fires immediately before a diff is processed.
	 */
	readonly onWillProcessDiff: Event<TestsDiff>;

	/**
	 * Event that fires after a diff is processed.
	 */
	readonly onDidProcessDiff: Event<TestsDiff>;

	/**
	 * Whether inline editor decorations should be visible.
	 */
	readonly showInlineOutput: MutableObservableValue<boolean>;

	/**
	 * Registers an interface that represents an extension host..
	 */
	registerExtHost(controller: IMainThreadTestHostProxy): IDisposable;

	/**
	 * Registers an interface that runs tests for the given provider ID.
	 */
	registerTestController(providerId: string, controller: IMainThreadTestController): IDisposable;

	/**
	 * Gets a registered test controller by ID.
	 */
	getTestController(controllerId: string): IMainThreadTestController | undefined;

	/**
	 * Refreshes tests for the controller, or all controllers if no ID is given.
	 */
	refreshTests(controllerId?: string): Promise<void>;

	/**
	 * Cancels any ongoing test refreshes.
	 */
	cancelRefreshTests(): void;

	/**
	 * Requests that tests be executed continuously, until the token is cancelled.
	 */
	startContinuousRun(req: ResolvedTestRunRequest, token: CancellationToken): Promise<void>;

	/**
	 * Requests that tests be executed.
	 */
	runTests(req: AmbiguousRunTestsRequest, token?: CancellationToken): Promise<ITestResult>;

	/**
	 * Requests that tests be executed.
	 */
	runResolvedTests(req: ResolvedTestRunRequest, token?: CancellationToken): Promise<ITestResult>;

	/**
	 * Provides followup actions for a test run.
	 */
	provideTestFollowups(req: TestMessageFollowupRequest, token: CancellationToken): Promise<ITestFollowups>;

	/**
	 * Ensures the test diff from the remote ext host is flushed and waits for
	 * any "busy" tests to become idle before resolving.
	 */
	syncTests(): Promise<void>;

	/**
	 * Cancels an ongoing test run by its ID, or all runs if no ID is given.
	 */
	cancelTestRun(runId?: string, taskId?: string): void;

	/**
	 * Publishes a test diff for a controller.
	 */
	publishDiff(controllerId: string, diff: TestsDiff): void;

	/**
	 * Gets all tests related to the given code position.
	 */
	getTestsRelatedToCode(uri: URI, position: Position, token?: CancellationToken): Promise<InternalTestItem[]>;

	/**
	 * Gets code related to the given test item.
	 */
	getCodeRelatedToTest(test: InternalTestItem, token?: CancellationToken): Promise<Location[]>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/common/testServiceImpl.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/common/testServiceImpl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { groupBy } from '../../../../base/common/arrays.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { Emitter } from '../../../../base/common/event.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { Disposable, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { observableValue } from '../../../../base/common/observable.js';
import { isDefined } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { Position } from '../../../../editor/common/core/position.js';
import { Location } from '../../../../editor/common/languages.js';
import { localize } from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKey, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { bindContextKey } from '../../../../platform/observable/common/platformObservableUtils.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IWorkspaceTrustRequestService } from '../../../../platform/workspace/common/workspaceTrust.js';
import { getTestingConfiguration, TestingConfigKeys } from './configuration.js';
import { MainThreadTestCollection } from './mainThreadTestCollection.js';
import { MutableObservableValue } from './observableValue.js';
import { StoredValue } from './storedValue.js';
import { TestExclusions } from './testExclusions.js';
import { TestId } from './testId.js';
import { TestingContextKeys } from './testingContextKeys.js';
import { canUseProfileWithTest, ITestProfileService } from './testProfileService.js';
import { ITestResult } from './testResult.js';
import { ITestResultService } from './testResultService.js';
import { AmbiguousRunTestsRequest, IMainThreadTestController, IMainThreadTestHostProxy, ITestFollowups, ITestService } from './testService.js';
import { InternalTestItem, ITestRunProfile, ResolvedTestRunRequest, TestControllerCapability, TestDiffOpType, TestMessageFollowupRequest, TestsDiff } from './testTypes.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';

export class TestService extends Disposable implements ITestService {
	declare readonly _serviceBrand: undefined;
	private testControllers = observableValue<ReadonlyMap<string, IMainThreadTestController>>('testControllers', new Map<string, IMainThreadTestController>());
	private testExtHosts = new Set<IMainThreadTestHostProxy>();

	private readonly cancelExtensionTestRunEmitter = new Emitter<{ runId: string | undefined; taskId: string | undefined }>();
	private readonly willProcessDiffEmitter = new Emitter<TestsDiff>();
	private readonly didProcessDiffEmitter = new Emitter<TestsDiff>();
	private readonly testRefreshCancellations = new Set<CancellationTokenSource>();
	private readonly isRefreshingTests: IContextKey<boolean>;
	private readonly activeEditorHasTests: IContextKey<boolean>;

	/**
	 * Cancellation for runs requested by the user being managed by the UI.
	 * Test runs initiated by extensions are not included here.
	 */
	private readonly uiRunningTests = new Map<string /* run ID */, CancellationTokenSource>();

	/**
	 * @inheritdoc
	 */
	public readonly onWillProcessDiff = this.willProcessDiffEmitter.event;

	/**
	 * @inheritdoc
	 */
	public readonly onDidProcessDiff = this.didProcessDiffEmitter.event;

	/**
	 * @inheritdoc
	 */
	public readonly onDidCancelTestRun = this.cancelExtensionTestRunEmitter.event;

	/**
	 * @inheritdoc
	 */
	public readonly collection: MainThreadTestCollection;

	/**
	 * @inheritdoc
	 */
	public readonly excluded: TestExclusions;

	/**
	 * @inheritdoc
	 */
	public readonly showInlineOutput: MutableObservableValue<boolean>;

	constructor(
		@IContextKeyService contextKeyService: IContextKeyService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
		@IStorageService storage: IStorageService,
		@IEditorService private readonly editorService: IEditorService,
		@ITestProfileService private readonly testProfiles: ITestProfileService,
		@INotificationService private readonly notificationService: INotificationService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@ITestResultService private readonly testResults: ITestResultService,
		@IWorkspaceTrustRequestService private readonly workspaceTrustRequestService: IWorkspaceTrustRequestService,
	) {
		super();
		this.collection = new MainThreadTestCollection(uriIdentityService, this.expandTest.bind(this));
		this.showInlineOutput = this._register(MutableObservableValue.stored(new StoredValue<boolean>({
			key: 'inlineTestOutputVisible',
			scope: StorageScope.WORKSPACE,
			target: StorageTarget.USER
		}, storage), true));

		this.excluded = instantiationService.createInstance(TestExclusions);
		this.isRefreshingTests = TestingContextKeys.isRefreshingTests.bindTo(contextKeyService);
		this.activeEditorHasTests = TestingContextKeys.activeEditorHasTests.bindTo(contextKeyService);

		this._register(bindContextKey(TestingContextKeys.providerCount, contextKeyService,
			reader => this.testControllers.read(reader).size));

		const bindCapability = (key: RawContextKey<boolean>, capability: TestControllerCapability) =>
			this._register(bindContextKey(key, contextKeyService, reader =>
				Iterable.some(
					this.testControllers.read(reader).values(),
					ctrl => !!(ctrl.capabilities.read(reader) & capability)
				),
			));

		bindCapability(TestingContextKeys.canRefreshTests, TestControllerCapability.Refresh);
		bindCapability(TestingContextKeys.canGoToRelatedCode, TestControllerCapability.CodeRelatedToTest);
		bindCapability(TestingContextKeys.canGoToRelatedTest, TestControllerCapability.TestRelatedToCode);

		this._register(editorService.onDidActiveEditorChange(() => this.updateEditorContextKeys()));
	}

	/**
	 * @inheritdoc
	 */
	public async expandTest(id: string, levels: number) {
		await this.testControllers.get().get(TestId.fromString(id).controllerId)?.expandTest(id, levels);
	}

	/**
	 * @inheritdoc
	 */
	public cancelTestRun(runId?: string, taskId?: string) {
		this.cancelExtensionTestRunEmitter.fire({ runId, taskId });

		if (runId === undefined) {
			for (const runCts of this.uiRunningTests.values()) {
				runCts.cancel();
			}
		} else if (!taskId) {
			this.uiRunningTests.get(runId)?.cancel();
		}
	}

	/**
	 * @inheritdoc
	 */
	public async runTests(req: AmbiguousRunTestsRequest, token = CancellationToken.None): Promise<ITestResult> {
		// We try to ensure that all tests in the request will be run, preferring
		// to use default profiles for each controller when possible.
		const byProfile: { profile: ITestRunProfile; tests: InternalTestItem[] }[] = [];
		for (const test of req.tests) {
			const existing = byProfile.find(p => canUseProfileWithTest(p.profile, test));
			if (existing) {
				existing.tests.push(test);
				continue;
			}

			const bestProfile = this.testProfiles.getDefaultProfileForTest(req.group, test);
			if (!bestProfile) {
				continue;
			}

			byProfile.push({ profile: bestProfile, tests: [test] });
		}

		const resolved: ResolvedTestRunRequest = {
			targets: byProfile.map(({ profile, tests }) => ({
				profileId: profile.profileId,
				controllerId: tests[0].controllerId,
				testIds: tests.map(t => t.item.extId),
			})),
			group: req.group,
			exclude: req.exclude?.map(t => t.item.extId),
			continuous: req.continuous,
			preserveFocus: req.preserveFocus,
		};

		// If no tests are covered by the defaults, just use whatever the defaults
		// for their controller are. This can happen if the user chose specific
		// profiles for the run button, but then asked to run a single test from the
		// explorer or decoration. We shouldn't no-op.
		if (resolved.targets.length === 0) {
			for (const byController of groupBy(req.tests, (a, b) => a.controllerId === b.controllerId ? 0 : 1)) {
				const profiles = this.testProfiles.getControllerProfiles(byController[0].controllerId);
				const withControllers = byController.map(test => ({
					profile: profiles.find(p => p.group === req.group && canUseProfileWithTest(p, test)),
					test,
				}));

				for (const byProfile of groupBy(withControllers, (a, b) => a.profile === b.profile ? 0 : 1)) {
					const profile = byProfile[0].profile;
					if (profile) {
						resolved.targets.push({
							testIds: byProfile.map(t => t.test.item.extId),
							profileId: profile.profileId,
							controllerId: profile.controllerId,
						});
					}
				}
			}
		}

		return this.runResolvedTests(resolved, token);
	}

	/** @inheritdoc */
	public async startContinuousRun(req: ResolvedTestRunRequest, token: CancellationToken) {
		if (!req.exclude) {
			req.exclude = [...this.excluded.all];
		}

		const trust = await this.workspaceTrustRequestService.requestWorkspaceTrust({
			message: localize('testTrust', "Running tests may execute code in your workspace."),
		});

		if (!trust) {
			return;
		}

		const byController = groupBy(req.targets, (a, b) => a.controllerId.localeCompare(b.controllerId));
		const requests = byController.map(
			group => this.getTestController(group[0].controllerId)?.startContinuousRun(
				group.map(controlReq => ({
					excludeExtIds: req.exclude!.filter(t => !controlReq.testIds.includes(t)),
					profileId: controlReq.profileId,
					controllerId: controlReq.controllerId,
					testIds: controlReq.testIds,
				})),
				token,
			).then(result => {
				const errs = result.map(r => r.error).filter(isDefined);
				if (errs.length) {
					this.notificationService.error(localize('testError', 'An error occurred attempting to run tests: {0}', errs.join(' ')));
				}
			})
		);

		await Promise.all(requests);
	}

	/**
	 * @inheritdoc
	 */
	public async runResolvedTests(req: ResolvedTestRunRequest, token = CancellationToken.None) {
		if (!req.exclude) {
			req.exclude = [...this.excluded.all];
		}

		const result = this.testResults.createLiveResult(req);
		const trust = await this.workspaceTrustRequestService.requestWorkspaceTrust({
			message: localize('testTrust', "Running tests may execute code in your workspace."),
		});

		if (!trust) {
			result.markComplete();
			return result;
		}

		try {
			const cancelSource = new CancellationTokenSource(token);
			this.uiRunningTests.set(result.id, cancelSource);

			const byController = groupBy(req.targets, (a, b) => a.controllerId.localeCompare(b.controllerId));
			const requests = byController.map(
				group => this.getTestController(group[0].controllerId)?.runTests(
					group.map(controlReq => ({
						runId: result.id,
						excludeExtIds: req.exclude!.filter(t => !controlReq.testIds.includes(t)),
						profileId: controlReq.profileId,
						controllerId: controlReq.controllerId,
						testIds: controlReq.testIds,
					})),
					cancelSource.token,
				).then(result => {
					const errs = result.map(r => r.error).filter(isDefined);
					if (errs.length) {
						this.notificationService.error(localize('testError', 'An error occurred attempting to run tests: {0}', errs.join(' ')));
					}
				})
			);
			await this.saveAllBeforeTest(req);
			await Promise.all(requests);
			return result;
		} finally {
			this.uiRunningTests.delete(result.id);
			result.markComplete();
		}
	}

	/**
	 * @inheritdoc
	 */
	public async provideTestFollowups(req: TestMessageFollowupRequest, token: CancellationToken): Promise<ITestFollowups> {
		const reqs = await Promise.all([...this.testExtHosts].map(async ctrl =>
			({ ctrl, followups: await ctrl.provideTestFollowups(req, token) })));

		const followups: ITestFollowups = {
			followups: reqs.flatMap(({ ctrl, followups }) => followups.map(f => ({
				message: f.title,
				execute: () => ctrl.executeTestFollowup(f.id)
			}))),
			dispose: () => {
				for (const { ctrl, followups } of reqs) {
					ctrl.disposeTestFollowups(followups.map(f => f.id));
				}
			}
		};

		if (token.isCancellationRequested) {
			followups.dispose();
		}

		return followups;
	}

	/**
	 * @inheritdoc
	 */
	public publishDiff(_controllerId: string, diff: TestsDiff) {
		this.willProcessDiffEmitter.fire(diff);
		this.collection.apply(diff);
		this.updateEditorContextKeys();
		this.didProcessDiffEmitter.fire(diff);
	}

	/**
	 * @inheritdoc
	 */
	public getTestController(id: string) {
		return this.testControllers.get().get(id);
	}

	/**
	 * @inheritdoc
	 */
	public async syncTests(): Promise<void> {
		const cts = new CancellationTokenSource();
		try {
			await Promise.all([...this.testControllers.get().values()].map(c => c.syncTests(cts.token)));
		} finally {
			cts.dispose(true);
		}
	}

	/**
	 * @inheritdoc
	 */
	public async refreshTests(controllerId?: string): Promise<void> {
		const cts = new CancellationTokenSource();
		this.testRefreshCancellations.add(cts);
		this.isRefreshingTests.set(true);

		try {
			if (controllerId) {
				await this.getTestController(controllerId)?.refreshTests(cts.token);
			} else {
				await Promise.all([...this.testControllers.get().values()].map(c => c.refreshTests(cts.token)));
			}
		} finally {
			this.testRefreshCancellations.delete(cts);
			this.isRefreshingTests.set(this.testRefreshCancellations.size > 0);
			cts.dispose(true);
		}
	}

	/**
	 * @inheritdoc
	 */
	public cancelRefreshTests(): void {
		for (const cts of this.testRefreshCancellations) {
			cts.cancel();
		}
		this.testRefreshCancellations.clear();
		this.isRefreshingTests.set(false);
	}

	/**
	 * @inheritdoc
	 */
	public registerExtHost(controller: IMainThreadTestHostProxy): IDisposable {
		this.testExtHosts.add(controller);
		return toDisposable(() => this.testExtHosts.delete(controller));
	}

	/**
	 * @inheritdoc
	 */
	public async getTestsRelatedToCode(uri: URI, position: Position, token: CancellationToken = CancellationToken.None): Promise<InternalTestItem[]> {
		const testIds = await Promise.all([...this.testExtHosts.values()].map(v => v.getTestsRelatedToCode(uri, position, token)));
		// ext host will flush diffs before returning, so we should have everything here:
		return testIds.flatMap(ids => ids.map(id => this.collection.getNodeById(id))).filter(isDefined);
	}

	/**
	 * @inheritdoc
	 */
	public registerTestController(id: string, controller: IMainThreadTestController): IDisposable {
		this.testControllers.set(new Map(this.testControllers.get()).set(id, controller), undefined);

		return toDisposable(() => {
			const diff: TestsDiff = [];
			for (const root of this.collection.rootItems) {
				if (root.controllerId === id) {
					diff.push({ op: TestDiffOpType.Remove, itemId: root.item.extId });
				}
			}

			this.publishDiff(id, diff);

			const next = new Map(this.testControllers.get());
			next.delete(id);
			this.testControllers.set(next, undefined);
		});
	}

	/**
	 * @inheritdoc
	 */
	public async getCodeRelatedToTest(test: InternalTestItem, token: CancellationToken = CancellationToken.None): Promise<Location[]> {
		return (await this.testControllers.get().get(test.controllerId)?.getRelatedCode(test.item.extId, token)) || [];
	}

	private updateEditorContextKeys() {
		const uri = this.editorService.activeEditor?.resource;
		if (uri) {
			this.activeEditorHasTests.set(!Iterable.isEmpty(this.collection.getNodeByUrl(uri)));
		} else {
			this.activeEditorHasTests.set(false);
		}
	}

	private async saveAllBeforeTest(req: ResolvedTestRunRequest, configurationService: IConfigurationService = this.configurationService, editorService: IEditorService = this.editorService): Promise<void> {
		if (req.preserveFocus === true) {
			return;
		}
		const saveBeforeTest = getTestingConfiguration(this.configurationService, TestingConfigKeys.SaveBeforeTest);
		if (saveBeforeTest) {
			await editorService.saveAll();
		}
		return;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/common/testTypes.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/common/testTypes.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IMarkdownString } from '../../../../base/common/htmlContent.js';
import { MarshalledId } from '../../../../base/common/marshallingIds.js';
import { URI, UriComponents } from '../../../../base/common/uri.js';
import { IPosition, Position } from '../../../../editor/common/core/position.js';
import { IRange, Range } from '../../../../editor/common/core/range.js';
import { localize } from '../../../../nls.js';
import { TestId } from './testId.js';

export const enum TestResultState {
	Unset = 0,
	Queued = 1,
	Running = 2,
	Passed = 3,
	Failed = 4,
	Skipped = 5,
	Errored = 6
}

export const testResultStateToContextValues: { [K in TestResultState]: string } = {
	[TestResultState.Unset]: 'unset',
	[TestResultState.Queued]: 'queued',
	[TestResultState.Running]: 'running',
	[TestResultState.Passed]: 'passed',
	[TestResultState.Failed]: 'failed',
	[TestResultState.Skipped]: 'skipped',
	[TestResultState.Errored]: 'errored',
};

/** note: keep in sync with TestRunProfileKind in vscode.d.ts */
export const enum ExtTestRunProfileKind {
	Run = 1,
	Debug = 2,
	Coverage = 3,
}

export const enum TestControllerCapability {
	Refresh = 1 << 1,
	CodeRelatedToTest = 1 << 2,
	TestRelatedToCode = 1 << 3,
}

export const enum TestRunProfileBitset {
	Run = 1 << 1,
	Debug = 1 << 2,
	Coverage = 1 << 3,
	HasNonDefaultProfile = 1 << 4,
	HasConfigurable = 1 << 5,
	SupportsContinuousRun = 1 << 6,
}

export const testProfileBitset = {
	[TestRunProfileBitset.Run]: localize('testing.runProfileBitset.run', 'Run'),
	[TestRunProfileBitset.Debug]: localize('testing.runProfileBitset.debug', 'Debug'),
	[TestRunProfileBitset.Coverage]: localize('testing.runProfileBitset.coverage', 'Coverage'),
};

/**
 * List of all test run profile bitset values.
 */
export const testRunProfileBitsetList = [
	TestRunProfileBitset.Run,
	TestRunProfileBitset.Debug,
	TestRunProfileBitset.Coverage,
	TestRunProfileBitset.HasNonDefaultProfile,
	TestRunProfileBitset.HasConfigurable,
	TestRunProfileBitset.SupportsContinuousRun,
];

/**
 * DTO for a controller's run profiles.
 */
export interface ITestRunProfile {
	controllerId: string;
	profileId: number;
	label: string;
	group: TestRunProfileBitset;
	isDefault: boolean;
	tag: string | null;
	hasConfigurationHandler: boolean;
	supportsContinuousRun: boolean;
}

export interface ITestRunProfileReference {
	controllerId: string;
	profileId: number;
	group: TestRunProfileBitset;
}

/**
 * A fully-resolved request to run tests, passsed between the main thread
 * and extension host.
 */
export interface ResolvedTestRunRequest {
	group: TestRunProfileBitset;
	targets: {
		testIds: string[];
		controllerId: string;
		profileId: number;
	}[];
	exclude?: string[];
	/** Whether this is a continuous test run */
	continuous?: boolean;
	/** Whether this was trigged by a user action in UI. Default=true */
	preserveFocus?: boolean;
}

/**
 * Request to the main thread to run a set of tests.
 */
export interface ExtensionRunTestsRequest {
	id: string;
	include: string[];
	exclude: string[];
	controllerId: string;
	profile?: { group: TestRunProfileBitset; id: number };
	persist: boolean;
	preserveFocus: boolean;
	/** Whether this is a result of a continuous test run request */
	continuous: boolean;
}

/**
 * Request parameters a controller run handler. This is different than
 * {@link IStartControllerTests}. The latter is used to ask for one or more test
 * runs tracked directly by the renderer.
 *
 * This alone can be used to start an autorun, without a specific associated runId.
 */
export interface ICallProfileRunHandler {
	controllerId: string;
	profileId: number;
	excludeExtIds: string[];
	testIds: string[];
}

export const isStartControllerTests = (t: ICallProfileRunHandler | IStartControllerTests): t is IStartControllerTests => ('runId' as keyof IStartControllerTests) in t;

/**
 * Request from the main thread to run tests for a single controller.
 */
export interface IStartControllerTests extends ICallProfileRunHandler {
	runId: string;
}

export interface IStartControllerTestsResult {
	error?: string;
}

/**
 * Location with a fully-instantiated Range and URI.
 */
export interface IRichLocation {
	range: Range;
	uri: URI;
}

/** Subset of the IUriIdentityService */
export interface ITestUriCanonicalizer {
	/** @link import('vs/platform/uriIdentity/common/uriIdentity').IUriIdentityService */
	asCanonicalUri(uri: URI): URI;
}

export namespace IRichLocation {
	export interface Serialize {
		range: IRange;
		uri: UriComponents;
	}

	export const serialize = (location: Readonly<IRichLocation>): Serialize => ({
		range: location.range.toJSON(),
		uri: location.uri.toJSON(),
	});

	export const deserialize = (uriIdentity: ITestUriCanonicalizer, location: Serialize): IRichLocation => ({
		range: Range.lift(location.range),
		uri: uriIdentity.asCanonicalUri(URI.revive(location.uri)),
	});
}

export const enum TestMessageType {
	Error,
	Output
}

export interface ITestMessageStackFrame {
	label: string;
	uri: URI | undefined;
	position: Position | undefined;
}

export namespace ITestMessageStackFrame {
	export interface Serialized {
		label: string;
		uri: UriComponents | undefined;
		position: IPosition | undefined;
	}

	export const serialize = (stack: Readonly<ITestMessageStackFrame>): Serialized => ({
		label: stack.label,
		uri: stack.uri?.toJSON(),
		position: stack.position?.toJSON(),
	});

	export const deserialize = (uriIdentity: ITestUriCanonicalizer, stack: Serialized): ITestMessageStackFrame => ({
		label: stack.label,
		uri: stack.uri ? uriIdentity.asCanonicalUri(URI.revive(stack.uri)) : undefined,
		position: stack.position ? Position.lift(stack.position) : undefined,
	});
}

export interface ITestErrorMessage {
	message: string | IMarkdownString;
	type: TestMessageType.Error;
	expected: string | undefined;
	actual: string | undefined;
	contextValue: string | undefined;
	location: IRichLocation | undefined;
	stackTrace: undefined | ITestMessageStackFrame[];
}

export namespace ITestErrorMessage {
	export interface Serialized {
		message: string | IMarkdownString;
		type: TestMessageType.Error;
		expected: string | undefined;
		actual: string | undefined;
		contextValue: string | undefined;
		location: IRichLocation.Serialize | undefined;
		stackTrace: undefined | ITestMessageStackFrame.Serialized[];
	}

	export const serialize = (message: Readonly<ITestErrorMessage>): Serialized => ({
		message: message.message,
		type: TestMessageType.Error,
		expected: message.expected,
		actual: message.actual,
		contextValue: message.contextValue,
		location: message.location && IRichLocation.serialize(message.location),
		stackTrace: message.stackTrace?.map(ITestMessageStackFrame.serialize),
	});

	export const deserialize = (uriIdentity: ITestUriCanonicalizer, message: Serialized): ITestErrorMessage => ({
		message: message.message,
		type: TestMessageType.Error,
		expected: message.expected,
		actual: message.actual,
		contextValue: message.contextValue,
		location: message.location && IRichLocation.deserialize(uriIdentity, message.location),
		stackTrace: message.stackTrace && message.stackTrace.map(s => ITestMessageStackFrame.deserialize(uriIdentity, s)),
	});
}

export interface ITestOutputMessage {
	message: string;
	type: TestMessageType.Output;
	offset: number;
	length: number;
	marker?: number;
	location: IRichLocation | undefined;
}

/**
 * Gets the TTY marker ID for either starting or ending
 * an ITestOutputMessage.marker of the given ID.
 */
export const getMarkId = (marker: number, start: boolean) => `${start ? 's' : 'e'}${marker}`;

export namespace ITestOutputMessage {
	export interface Serialized {
		message: string;
		offset: number;
		length: number;
		type: TestMessageType.Output;
		location: IRichLocation.Serialize | undefined;
	}

	export const serialize = (message: Readonly<ITestOutputMessage>): Serialized => ({
		message: message.message,
		type: TestMessageType.Output,
		offset: message.offset,
		length: message.length,
		location: message.location && IRichLocation.serialize(message.location),
	});

	export const deserialize = (uriIdentity: ITestUriCanonicalizer, message: Serialized): ITestOutputMessage => ({
		message: message.message,
		type: TestMessageType.Output,
		offset: message.offset,
		length: message.length,
		location: message.location && IRichLocation.deserialize(uriIdentity, message.location),
	});
}

export type ITestMessage = ITestErrorMessage | ITestOutputMessage;

export namespace ITestMessage {
	export type Serialized = ITestErrorMessage.Serialized | ITestOutputMessage.Serialized;

	export const serialize = (message: Readonly<ITestMessage>): Serialized =>
		message.type === TestMessageType.Error ? ITestErrorMessage.serialize(message) : ITestOutputMessage.serialize(message);

	export const deserialize = (uriIdentity: ITestUriCanonicalizer, message: Serialized): ITestMessage =>
		message.type === TestMessageType.Error ? ITestErrorMessage.deserialize(uriIdentity, message) : ITestOutputMessage.deserialize(uriIdentity, message);

	export const isDiffable = (message: ITestMessage): message is ITestErrorMessage & { actual: string; expected: string } =>
		message.type === TestMessageType.Error && message.actual !== undefined && message.expected !== undefined;
}

export interface ITestTaskState {
	state: TestResultState;
	duration: number | undefined;
	messages: ITestMessage[];
}

export namespace ITestTaskState {
	export interface Serialized {
		state: TestResultState;
		duration: number | undefined;
		messages: ITestMessage.Serialized[];
	}

	export const serializeWithoutMessages = (state: ITestTaskState): Serialized => ({
		state: state.state,
		duration: state.duration,
		messages: [],
	});

	export const serialize = (state: Readonly<ITestTaskState>): Serialized => ({
		state: state.state,
		duration: state.duration,
		messages: state.messages.map(ITestMessage.serialize),
	});

	export const deserialize = (uriIdentity: ITestUriCanonicalizer, state: Serialized): ITestTaskState => ({
		state: state.state,
		duration: state.duration,
		messages: state.messages.map(m => ITestMessage.deserialize(uriIdentity, m)),
	});
}

export interface ITestRunTask {
	id: string;
	name: string;
	running: boolean;
	ctrlId: string;
}

export interface ITestTag {
	readonly id: string;
}

const testTagDelimiter = '\0';

export const namespaceTestTag =
	(ctrlId: string, tagId: string) => ctrlId + testTagDelimiter + tagId;

export const denamespaceTestTag = (namespaced: string) => {
	const index = namespaced.indexOf(testTagDelimiter);
	return { ctrlId: namespaced.slice(0, index), tagId: namespaced.slice(index + 1) };
};

export interface ITestTagDisplayInfo {
	id: string;
}

/**
 * The TestItem from .d.ts, as a plain object without children.
 */
export interface ITestItem {
	/** ID of the test given by the test controller */
	extId: string;
	label: string;
	tags: string[];
	busy: boolean;
	children?: never;
	uri: URI | undefined;
	range: Range | null;
	description: string | null;
	error: string | IMarkdownString | null;
	sortText: string | null;
}

export namespace ITestItem {
	export interface Serialized {
		extId: string;
		label: string;
		tags: string[];
		busy: boolean;
		children?: never;
		uri: UriComponents | undefined;
		range: IRange | null;
		description: string | null;
		error: string | IMarkdownString | null;
		sortText: string | null;
	}

	export const serialize = (item: Readonly<ITestItem>): Serialized => ({
		extId: item.extId,
		label: item.label,
		tags: item.tags,
		busy: item.busy,
		children: undefined,
		uri: item.uri?.toJSON(),
		range: item.range?.toJSON() || null,
		description: item.description,
		error: item.error,
		sortText: item.sortText
	});

	export const deserialize = (uriIdentity: ITestUriCanonicalizer, serialized: Serialized): ITestItem => ({
		extId: serialized.extId,
		label: serialized.label,
		tags: serialized.tags,
		busy: serialized.busy,
		children: undefined,
		uri: serialized.uri ? uriIdentity.asCanonicalUri(URI.revive(serialized.uri)) : undefined,
		range: serialized.range ? Range.lift(serialized.range) : null,
		description: serialized.description,
		error: serialized.error,
		sortText: serialized.sortText
	});
}

export const enum TestItemExpandState {
	NotExpandable,
	Expandable,
	BusyExpanding,
	Expanded,
}

/**
 * TestItem-like shape, but with an ID and children as strings.
 */
export interface InternalTestItem {
	/** Controller ID from whence this test came */
	controllerId: string;
	/** Expandability state */
	expand: TestItemExpandState;
	/** Raw test item properties */
	item: ITestItem;
}

export namespace InternalTestItem {
	export interface Serialized {
		expand: TestItemExpandState;
		item: ITestItem.Serialized;
	}

	export const serialize = (item: Readonly<InternalTestItem>): Serialized => ({
		expand: item.expand,
		item: ITestItem.serialize(item.item)
	});

	export const deserialize = (uriIdentity: ITestUriCanonicalizer, serialized: Serialized): InternalTestItem => ({
		// the `controllerId` is derived from the test.item.extId. It's redundant
		// in the non-serialized InternalTestItem too, but there just because it's
		// checked against in many hot paths.
		controllerId: TestId.root(serialized.item.extId),
		expand: serialized.expand,
		item: ITestItem.deserialize(uriIdentity, serialized.item)
	});
}

/**
 * A partial update made to an existing InternalTestItem.
 */
export interface ITestItemUpdate {
	extId: string;
	expand?: TestItemExpandState;
	item?: Partial<ITestItem>;
}

export namespace ITestItemUpdate {
	export interface Serialized {
		extId: string;
		expand?: TestItemExpandState;
		item?: Partial<ITestItem.Serialized>;
	}

	export const serialize = (u: Readonly<ITestItemUpdate>): Serialized => {
		let item: Partial<ITestItem.Serialized> | undefined;
		if (u.item) {
			item = {};
			if (u.item.label !== undefined) { item.label = u.item.label; }
			if (u.item.tags !== undefined) { item.tags = u.item.tags; }
			if (u.item.busy !== undefined) { item.busy = u.item.busy; }
			if (u.item.uri !== undefined) { item.uri = u.item.uri?.toJSON(); }
			if (u.item.range !== undefined) { item.range = u.item.range?.toJSON(); }
			if (u.item.description !== undefined) { item.description = u.item.description; }
			if (u.item.error !== undefined) { item.error = u.item.error; }
			if (u.item.sortText !== undefined) { item.sortText = u.item.sortText; }
		}

		return { extId: u.extId, expand: u.expand, item };
	};

	export const deserialize = (u: Serialized): ITestItemUpdate => {
		let item: Partial<ITestItem> | undefined;
		if (u.item) {
			item = {};
			if (u.item.label !== undefined) { item.label = u.item.label; }
			if (u.item.tags !== undefined) { item.tags = u.item.tags; }
			if (u.item.busy !== undefined) { item.busy = u.item.busy; }
			if (u.item.range !== undefined) { item.range = u.item.range ? Range.lift(u.item.range) : null; }
			if (u.item.description !== undefined) { item.description = u.item.description; }
			if (u.item.error !== undefined) { item.error = u.item.error; }
			if (u.item.sortText !== undefined) { item.sortText = u.item.sortText; }
		}

		return { extId: u.extId, expand: u.expand, item };
	};

}

export const applyTestItemUpdate = (internal: InternalTestItem | ITestItemUpdate, patch: ITestItemUpdate) => {
	if (patch.expand !== undefined) {
		internal.expand = patch.expand;
	}
	if (patch.item !== undefined) {
		internal.item = internal.item ? Object.assign(internal.item, patch.item) : patch.item;
	}
};

/** Request to an ext host to get followup messages for a test failure. */
export interface TestMessageFollowupRequest {
	resultId: string;
	extId: string;
	taskIndex: number;
	messageIndex: number;
}

/** Request to an ext host to get followup messages for a test failure. */
export interface TestMessageFollowupResponse {
	id: number;
	title: string;
}

/**
 * Test result item used in the main thread.
 */
export interface TestResultItem extends InternalTestItem {
	/** State of this test in various tasks */
	tasks: ITestTaskState[];
	/** State of this test as a computation of its tasks */
	ownComputedState: TestResultState;
	/** Computed state based on children */
	computedState: TestResultState;
	/** Max duration of the item's tasks (if run directly) */
	ownDuration?: number;
	/** Whether this test item is outdated */
	retired?: boolean;
}

export namespace TestResultItem {
	/**
	 * Serialized version of the TestResultItem. Note that 'retired' is not
	 * included since all hydrated items are automatically retired.
	 */
	export interface Serialized extends InternalTestItem.Serialized {
		tasks: ITestTaskState.Serialized[];
		ownComputedState: TestResultState;
		computedState: TestResultState;
	}

	export const serializeWithoutMessages = (original: TestResultItem): Serialized => ({
		...InternalTestItem.serialize(original),
		ownComputedState: original.ownComputedState,
		computedState: original.computedState,
		tasks: original.tasks.map(ITestTaskState.serializeWithoutMessages),
	});

	export const serialize = (original: Readonly<TestResultItem>): Serialized => ({
		...InternalTestItem.serialize(original),
		ownComputedState: original.ownComputedState,
		computedState: original.computedState,
		tasks: original.tasks.map(ITestTaskState.serialize),
	});

	export const deserialize = (uriIdentity: ITestUriCanonicalizer, serialized: Serialized): TestResultItem => ({
		...InternalTestItem.deserialize(uriIdentity, serialized),
		ownComputedState: serialized.ownComputedState,
		computedState: serialized.computedState,
		tasks: serialized.tasks.map(m => ITestTaskState.deserialize(uriIdentity, m)),
		retired: true,
	});
}

export interface ISerializedTestResults {
	/** ID of these test results */
	id: string;
	/** Time the results were compelted */
	completedAt: number;
	/** Subset of test result items */
	items: TestResultItem.Serialized[];
	/** Tasks involved in the run. */
	tasks: { id: string; name: string | undefined; ctrlId: string; hasCoverage: boolean }[];
	/** Human-readable name of the test run. */
	name: string;
	/** Test trigger informaton */
	request: ResolvedTestRunRequest;
}

export interface ITestCoverage {
	files: IFileCoverage[];
}

export interface ICoverageCount {
	covered: number;
	total: number;
}

export namespace ICoverageCount {
	export const empty = (): ICoverageCount => ({ covered: 0, total: 0 });
	export const sum = (target: ICoverageCount, src: Readonly<ICoverageCount>) => {
		target.covered += src.covered;
		target.total += src.total;
	};
}

export interface IFileCoverage {
	id: string;
	uri: URI;
	testIds?: string[];
	statement: ICoverageCount;
	branch?: ICoverageCount;
	declaration?: ICoverageCount;
}

export namespace IFileCoverage {
	export interface Serialized {
		id: string;
		uri: UriComponents;
		testIds: string[] | undefined;
		statement: ICoverageCount;
		branch?: ICoverageCount;
		declaration?: ICoverageCount;
	}

	export const serialize = (original: Readonly<IFileCoverage>): Serialized => ({
		id: original.id,
		statement: original.statement,
		branch: original.branch,
		declaration: original.declaration,
		testIds: original.testIds,
		uri: original.uri.toJSON(),
	});

	export const deserialize = (uriIdentity: ITestUriCanonicalizer, serialized: Serialized): IFileCoverage => ({
		id: serialized.id,
		statement: serialized.statement,
		branch: serialized.branch,
		declaration: serialized.declaration,
		testIds: serialized.testIds,
		uri: uriIdentity.asCanonicalUri(URI.revive(serialized.uri)),
	});

	export const empty = (id: string, uri: URI): IFileCoverage => ({
		id,
		uri,
		statement: ICoverageCount.empty(),
	});
}

function serializeThingWithLocation<T extends { location?: Range | Position }>(serialized: T): T & { location?: IRange | IPosition } {
	return {
		...serialized,
		location: serialized.location?.toJSON(),
	};
}

function deserializeThingWithLocation<T extends { location?: IRange | IPosition }>(serialized: T): T & { location?: Range | Position } {
	serialized.location = serialized.location ? (Position.isIPosition(serialized.location) ? Position.lift(serialized.location) : Range.lift(serialized.location)) : undefined;
	return serialized as T & { location?: Range | Position };
}

/** Number of recent runs in which coverage reports should be retained. */
export const KEEP_N_LAST_COVERAGE_REPORTS = 3;

export const enum DetailType {
	Declaration,
	Statement,
	Branch,
}

export type CoverageDetails = IDeclarationCoverage | IStatementCoverage;

export namespace CoverageDetails {
	export type Serialized = IDeclarationCoverage.Serialized | IStatementCoverage.Serialized;

	export const serialize = (original: Readonly<CoverageDetails>): Serialized =>
		original.type === DetailType.Declaration ? IDeclarationCoverage.serialize(original) : IStatementCoverage.serialize(original);

	export const deserialize = (serialized: Serialized): CoverageDetails =>
		serialized.type === DetailType.Declaration ? IDeclarationCoverage.deserialize(serialized) : IStatementCoverage.deserialize(serialized);
}

export interface IBranchCoverage {
	count: number | boolean;
	label?: string;
	location?: Range | Position;
}

export namespace IBranchCoverage {
	export interface Serialized {
		count: number | boolean;
		label?: string;
		location?: IRange | IPosition;
	}

	export const serialize: (original: IBranchCoverage) => Serialized = serializeThingWithLocation;
	export const deserialize: (original: Serialized) => IBranchCoverage = deserializeThingWithLocation;
}

export interface IDeclarationCoverage {
	type: DetailType.Declaration;
	name: string;
	count: number | boolean;
	location: Range | Position;
}

export namespace IDeclarationCoverage {
	export interface Serialized {
		type: DetailType.Declaration;
		name: string;
		count: number | boolean;
		location: IRange | IPosition;
	}

	export const serialize: (original: IDeclarationCoverage) => Serialized = serializeThingWithLocation;
	export const deserialize: (original: Serialized) => IDeclarationCoverage = deserializeThingWithLocation;
}

export interface IStatementCoverage {
	type: DetailType.Statement;
	count: number | boolean;
	location: Range | Position;
	branches?: IBranchCoverage[];
}

export namespace IStatementCoverage {
	export interface Serialized {
		type: DetailType.Statement;
		count: number | boolean;
		location: IRange | IPosition;
		branches?: IBranchCoverage.Serialized[];
	}

	export const serialize = (original: Readonly<IStatementCoverage>): Serialized => ({
		...serializeThingWithLocation(original),
		branches: original.branches?.map(IBranchCoverage.serialize),
	});

	export const deserialize = (serialized: Serialized): IStatementCoverage => ({
		...deserializeThingWithLocation(serialized),
		branches: serialized.branches?.map(IBranchCoverage.deserialize),
	});
}

export const enum TestDiffOpType {
	/** Adds a new test (with children) */
	Add,
	/** Shallow-updates an existing test */
	Update,
	/** Ranges of some tests in a document were synced, so it should be considered up-to-date */
	DocumentSynced,
	/** Removes a test (and all its children) */
	Remove,
	/** Changes the number of controllers who are yet to publish their collection roots. */
	IncrementPendingExtHosts,
	/** Retires a test/result */
	Retire,
	/** Add a new test tag */
	AddTag,
	/** Remove a test tag */
	RemoveTag,
}

export type TestsDiffOp =
	| { op: TestDiffOpType.Add; item: InternalTestItem }
	| { op: TestDiffOpType.Update; item: ITestItemUpdate }
	| { op: TestDiffOpType.Remove; itemId: string }
	| { op: TestDiffOpType.Retire; itemId: string }
	| { op: TestDiffOpType.IncrementPendingExtHosts; amount: number }
	| { op: TestDiffOpType.AddTag; tag: ITestTagDisplayInfo }
	| { op: TestDiffOpType.RemoveTag; id: string }
	| { op: TestDiffOpType.DocumentSynced; uri: URI; docv?: number };

export namespace TestsDiffOp {
	export type Serialized =
		| { op: TestDiffOpType.Add; item: InternalTestItem.Serialized }
		| { op: TestDiffOpType.Update; item: ITestItemUpdate.Serialized }
		| { op: TestDiffOpType.Remove; itemId: string }
		| { op: TestDiffOpType.Retire; itemId: string }
		| { op: TestDiffOpType.IncrementPendingExtHosts; amount: number }
		| { op: TestDiffOpType.AddTag; tag: ITestTagDisplayInfo }
		| { op: TestDiffOpType.RemoveTag; id: string }
		| { op: TestDiffOpType.DocumentSynced; uri: UriComponents; docv?: number };

	export const deserialize = (uriIdentity: ITestUriCanonicalizer, u: Serialized): TestsDiffOp => {
		if (u.op === TestDiffOpType.Add) {
			return { op: u.op, item: InternalTestItem.deserialize(uriIdentity, u.item) };
		} else if (u.op === TestDiffOpType.Update) {
			return { op: u.op, item: ITestItemUpdate.deserialize(u.item) };
		} else if (u.op === TestDiffOpType.DocumentSynced) {
			return { op: u.op, uri: uriIdentity.asCanonicalUri(URI.revive(u.uri)), docv: u.docv };
		} else {
			return u;
		}
	};

	export const serialize = (u: Readonly<TestsDiffOp>): Serialized => {
		if (u.op === TestDiffOpType.Add) {
			return { op: u.op, item: InternalTestItem.serialize(u.item) };
		} else if (u.op === TestDiffOpType.Update) {
			return { op: u.op, item: ITestItemUpdate.serialize(u.item) };
		} else {
			return u;
		}
	};
}

/**
 * Context for actions taken in the test explorer view.
 */
export interface ITestItemContext {
	/** Marshalling marker */
	$mid: MarshalledId.TestItemContext;
	/** Tests and parents from the root to the current items */
	tests: InternalTestItem.Serialized[];
}

/**
 * Context for actions taken in the test explorer view.
 */
export interface ITestMessageMenuArgs {
	/** Marshalling marker */
	$mid: MarshalledId.TestMessageMenuArgs;
	/** Tests ext ID */
	test: InternalTestItem.Serialized;
	/** Serialized test message */
	message: ITestMessage.Serialized;
}

/**
 * Request from the ext host or main thread to indicate that tests have
 * changed. It's assumed that any item upserted *must* have its children
 * previously also upserted, or upserted as part of the same operation.
 * Children that no longer exist in an upserted item will be removed.
 */
export type TestsDiff = TestsDiffOp[];

/**
 * @private
 */
export interface IncrementalTestCollectionItem extends InternalTestItem {
	children: Set<string>;
}

/**
 * The IncrementalChangeCollector is used in the IncrementalTestCollection
 * and called with diff changes as they're applied. This is used in the
 * ext host to create a cohesive change event from a diff.
 */
export interface IncrementalChangeCollector<T> {
	/**
	 * A node was added.
	 */
	add?(node: T): void;

	/**
	 * A node in the collection was updated.
	 */
	update?(node: T): void;

	/**
	 * A node was removed.
	 */
	remove?(node: T, isNestedOperation: boolean): void;

	/**
	 * Called when the diff has been applied.
	 */
	complete?(): void;
}

/**
 * Maintains tests in this extension host sent from the main thread.
 */
export abstract class AbstractIncrementalTestCollection<T extends IncrementalTestCollectionItem> {
	private readonly _tags = new Map<string, ITestTagDisplayInfo>();

	/**
	 * Map of item IDs to test item objects.
	 */
	protected readonly items = new Map<string, T>();

	/**
	 * ID of test root items.
	 */
	protected readonly roots = new Set<T>();

	/**
	 * Number of 'busy' controllers.
	 */
	protected busyControllerCount = 0;

	/**
	 * Number of pending roots.
	 */
	protected pendingRootCount = 0;

	/**
	 * Known test tags.
	 */
	public readonly tags: ReadonlyMap<string, ITestTagDisplayInfo> = this._tags;

	constructor(private readonly uriIdentity: ITestUriCanonicalizer) { }

	/**
	 * Applies the diff to the collection.
	 */
	public apply(diff: TestsDiff) {
		const changes = this.createChangeCollector();

		for (const op of diff) {
			switch (op.op) {
				case TestDiffOpType.Add:
					this.add(InternalTestItem.deserialize(this.uriIdentity, op.item), changes);
					break;

				case TestDiffOpType.Update:
					this.update(ITestItemUpdate.deserialize(op.item), changes);
					break;

				case TestDiffOpType.Remove:
					this.remove(op.itemId, changes);
					break;

				case TestDiffOpType.Retire:
					this.retireTest(op.itemId);
					break;

				case TestDiffOpType.IncrementPendingExtHosts:
					this.updatePendingRoots(op.amount);
					break;

				case TestDiffOpType.AddTag:
					this._tags.set(op.tag.id, op.tag);
					break;

				case TestDiffOpType.RemoveTag:
					this._tags.delete(op.id);
					break;
			}
		}

		changes.complete?.();
	}

	protected add(item: InternalTestItem, changes: IncrementalChangeCollector<T>
	) {
		const parentId = TestId.parentId(item.item.extId)?.toString();
		let created: T;
		if (!parentId) {
			created = this.createItem(item);
			this.roots.add(created);
			this.items.set(item.item.extId, created);
		} else if (this.items.has(parentId)) {
			const parent = this.items.get(parentId)!;
			parent.children.add(item.item.extId);
			created = this.createItem(item, parent);
			this.items.set(item.item.extId, created);
		} else {
			console.error(`Test with unknown parent ID: ${JSON.stringify(item)}`);
			return;
		}

		changes.add?.(created);
		if (item.expand === TestItemExpandState.BusyExpanding) {
			this.busyControllerCount++;
		}

		return created;
	}

	protected update(patch: ITestItemUpdate, changes: IncrementalChangeCollector<T>
	) {
		const existing = this.items.get(patch.extId);
		if (!existing) {
			return;
		}

		if (patch.expand !== undefined) {
			if (existing.expand === TestItemExpandState.BusyExpanding) {
				this.busyControllerCount--;
			}
			if (patch.expand === TestItemExpandState.BusyExpanding) {
				this.busyControllerCount++;
			}
		}

		applyTestItemUpdate(existing, patch);
		changes.update?.(existing);
		return existing;
	}

	protected remove(itemId: string, changes: IncrementalChangeCollector<T>) {
		const toRemove = this.items.get(itemId);
		if (!toRemove) {
			return;
		}

		const parentId = TestId.parentId(toRemove.item.extId)?.toString();
		if (parentId) {
			const parent = this.items.get(parentId)!;
			parent.children.delete(toRemove.item.extId);
		} else {
			this.roots.delete(toRemove);
		}

		const queue: Iterable<string>[] = [[itemId]];
		while (queue.length) {
			for (const itemId of queue.pop()!) {
				const existing = this.items.get(itemId);
				if (existing) {
					queue.push(existing.children);
					this.items.delete(itemId);
					changes.remove?.(existing, existing !== toRemove);

					if (existing.expand === TestItemExpandState.BusyExpanding) {
						this.busyControllerCount--;
					}
				}
			}
		}
	}

	/**
	 * Called when the extension signals a test result should be retired.
	 */
	protected retireTest(testId: string) {
		// no-op
	}

	/**
	 * Updates the number of test root sources who are yet to report. When
	 * the total pending test roots reaches 0, the roots for all controllers
	 * will exist in the collection.
	 */
	public updatePendingRoots(delta: number) {
		this.pendingRootCount += delta;
	}

	/**
	 * Called before a diff is applied to create a new change collector.
	 */
	protected createChangeCollector(): IncrementalChangeCollector<T> {
		return {};
	}

	/**
	 * Creates a new item for the collection from the internal test item.
	 */
	protected abstract createItem(internal: InternalTestItem, parent?: T): T;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/test/browser/codeCoverageDecorations.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/test/browser/codeCoverageDecorations.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


import { assertSnapshot } from '../../../../../base/test/common/snapshot.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Position } from '../../../../../editor/common/core/position.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { ITextModel } from '../../../../../editor/common/model.js';
import * as assert from 'assert';
import { CoverageDetailsModel } from '../../browser/codeCoverageDecorations.js';
import { CoverageDetails, DetailType } from '../../common/testTypes.js';
import { upcastPartial } from '../../../../../base/test/common/mock.js';

suite('Code Coverage Decorations', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	const textModel = upcastPartial<ITextModel>({ getValueInRange: () => '' });
	const assertRanges = async (model: CoverageDetailsModel) => await assertSnapshot(model.ranges.map(r => ({
		range: r.range.toString(),
		count: r.metadata.detail.type === DetailType.Branch ? r.metadata.detail.detail.branches![r.metadata.detail.branch].count : r.metadata.detail.count,
	})));

	test('CoverageDetailsModel#1', async () => {
		// Create some sample coverage details
		const details: CoverageDetails[] = [
			{ location: new Range(1, 0, 5, 0), type: DetailType.Statement, count: 1 },
			{ location: new Range(2, 0, 3, 0), type: DetailType.Statement, count: 2 },
			{ location: new Range(4, 0, 6, 0), type: DetailType.Statement, branches: [{ location: new Range(3, 0, 7, 0), count: 3 }], count: 4 },
		];

		// Create a new CoverageDetailsModel instance
		const model = new CoverageDetailsModel(details, textModel);

		// Verify that the ranges are generated correctly
		await assertRanges(model);
	});

	test('CoverageDetailsModel#2', async () => {
		// Create some sample coverage details
		const details: CoverageDetails[] = [
			{ location: new Range(1, 0, 5, 0), type: DetailType.Statement, count: 1 },
			{ location: new Range(2, 0, 4, 0), type: DetailType.Statement, count: 2 },
			{ location: new Range(3, 0, 3, 5), type: DetailType.Statement, count: 3 },
		];

		// Create a new CoverageDetailsModel instance
		const model = new CoverageDetailsModel(details, textModel);

		// Verify that the ranges are generated correctly
		await assertRanges(model);
	});

	test('CoverageDetailsModel#3', async () => {
		// Create some sample coverage details
		const details: CoverageDetails[] = [
			{ location: new Range(1, 0, 5, 0), type: DetailType.Statement, count: 1 },
			{ location: new Range(2, 0, 3, 0), type: DetailType.Statement, count: 2 },
			{ location: new Range(4, 0, 5, 0), type: DetailType.Statement, count: 3 },
		];

		// Create a new CoverageDetailsModel instance
		const model = new CoverageDetailsModel(details, textModel);

		// Verify that the ranges are generated correctly
		await assertRanges(model);
	});

	test('CoverageDetailsModel#4', async () => {
		// Create some sample coverage details
		const details: CoverageDetails[] = [
			{ location: new Range(1, 0, 5, 0), type: DetailType.Statement, count: 1 },
			{ location: new Position(2, 0), type: DetailType.Statement, count: 2 },
			{ location: new Range(4, 0, 5, 0), type: DetailType.Statement, count: 3 },
			{ location: new Position(4, 3), type: DetailType.Statement, count: 4 },
		];

		// Create a new CoverageDetailsModel instance
		const model = new CoverageDetailsModel(details, textModel);

		// Verify that the ranges are generated correctly
		await assertRanges(model);
	});

	test('hasInlineCoverageDetails context key', () => {
		// Test that CoverageDetailsModel with ranges indicates inline coverage is available
		const detailsWithRanges: CoverageDetails[] = [
			{ location: new Range(1, 0, 2, 0), type: DetailType.Statement, count: 1 },
		];
		const modelWithRanges = new CoverageDetailsModel(detailsWithRanges, textModel);

		// Should have ranges available for inline display
		assert.strictEqual(modelWithRanges.ranges.length > 0, true, 'Model with coverage details should have ranges');

		// Test that empty coverage details indicates no inline coverage
		const emptyDetails: CoverageDetails[] = [];
		const emptyModel = new CoverageDetailsModel(emptyDetails, textModel);

		// Should have no ranges available for inline display
		assert.strictEqual(emptyModel.ranges.length === 0, true, 'Model with no coverage details should have no ranges');
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/test/browser/testObjectTree.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/test/browser/testObjectTree.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ObjectTree } from '../../../../../base/browser/ui/tree/objectTree.js';
import { Emitter } from '../../../../../base/common/event.js';
import { Disposable, DisposableStore } from '../../../../../base/common/lifecycle.js';
import { IWorkspaceFoldersChangeEvent } from '../../../../../platform/workspace/common/workspace.js';
import { ITestTreeProjection, TestExplorerTreeElement, TestItemTreeElement, TestTreeErrorMessage } from '../../browser/explorerProjections/index.js';
import { MainThreadTestCollection } from '../../common/mainThreadTestCollection.js';
import { TestsDiff, TestsDiffOp } from '../../common/testTypes.js';
import { ITestService } from '../../common/testService.js';
import { testStubs } from '../common/testStubs.js';
import { ITreeRenderer, ITreeSorter } from '../../../../../base/browser/ui/tree/tree.js';

type SerializedTree = { e: string; children?: SerializedTree[]; data?: string };

const element = document.createElement('div');
element.style.height = '1000px';
element.style.width = '200px';

class TestObjectTree<T> extends ObjectTree<T, any> {
	constructor(serializer: (node: T) => string, sorter?: ITreeSorter<T>) {
		super(
			'test',
			element,
			{
				getHeight: () => 20,
				getTemplateId: () => 'default'
			},
			[
				{
					disposeTemplate: ({ store }) => store.dispose(),
					renderElement: ({ depth, element }, _index, { container, store }) => {
						const render = () => {
							container.textContent = `${depth}:${serializer(element)}`;
							Object.assign(container.dataset, element);
						};
						render();

						if (element instanceof TestItemTreeElement) {
							store.add(element.onChange(render));
						}
					},
					disposeElement: (_el, _index, { store }) => store.clear(),
					renderTemplate: container => ({ container, store: new DisposableStore() }),
					templateId: 'default'
				} satisfies ITreeRenderer<T, any, { store: DisposableStore; container: HTMLElement }>
			],
			{
				sorter: sorter ?? {
					compare: (a, b) => serializer(a).localeCompare(serializer(b))
				}
			}
		);
		this.layout(1000, 200);
	}

	public getRendered(getProperty?: string) {
		// eslint-disable-next-line no-restricted-syntax
		const elements = element.querySelectorAll<HTMLElement>('.monaco-tl-contents');
		const sorted = [...elements].sort((a, b) => pos(a) - pos(b));
		const chain: SerializedTree[] = [{ e: '', children: [] }];
		for (const element of sorted) {
			const [depthStr, label] = element.textContent!.split(':');
			const depth = Number(depthStr);
			const parent = chain[depth - 1];
			const child: SerializedTree = { e: label };
			if (getProperty) {
				child.data = element.dataset[getProperty];
			}
			parent.children = parent.children?.concat(child) ?? [child];
			chain[depth] = child;
		}

		return chain[0].children;
	}
}

const pos = (element: Element) => Number(element.parentElement!.parentElement!.getAttribute('aria-posinset'));


class ByLabelTreeSorter implements ITreeSorter<TestExplorerTreeElement> {
	public compare(a: TestExplorerTreeElement, b: TestExplorerTreeElement): number {
		if (a instanceof TestTreeErrorMessage || b instanceof TestTreeErrorMessage) {
			return (a instanceof TestTreeErrorMessage ? -1 : 0) + (b instanceof TestTreeErrorMessage ? 1 : 0);
		}

		if (a instanceof TestItemTreeElement && b instanceof TestItemTreeElement && a.test.item.uri && b.test.item.uri && a.test.item.uri.toString() === b.test.item.uri.toString() && a.test.item.range && b.test.item.range) {
			const delta = a.test.item.range.startLineNumber - b.test.item.range.startLineNumber;
			if (delta !== 0) {
				return delta;
			}
		}

		return (a.test.item.sortText || a.test.item.label).localeCompare(b.test.item.sortText || b.test.item.label);
	}
}

// names are hard
export class TestTreeTestHarness<T extends ITestTreeProjection = ITestTreeProjection> extends Disposable {
	private readonly onDiff = this._register(new Emitter<TestsDiff>());
	public readonly onFolderChange = this._register(new Emitter<IWorkspaceFoldersChangeEvent>());
	private isProcessingDiff = false;
	public readonly projection: T;
	public readonly tree: TestObjectTree<TestExplorerTreeElement>;

	constructor(makeTree: (listener: ITestService) => T, public readonly c = testStubs.nested()) {
		super();
		this._register(c);
		this._register(this.c.onDidGenerateDiff(d => this.c.setDiff(d /* don't clear during testing */)));

		const collection = new MainThreadTestCollection({ asCanonicalUri: u => u }, (testId, levels) => {
			this.c.expand(testId, levels);
			if (!this.isProcessingDiff) {
				this.onDiff.fire(this.c.collectDiff());
			}
			return Promise.resolve();
		});
		this._register(this.onDiff.event(diff => collection.apply(diff)));

		// eslint-disable-next-line local/code-no-any-casts
		this.projection = this._register(makeTree({
			collection,
			onDidProcessDiff: this.onDiff.event,
		} as any));
		const sorter = new ByLabelTreeSorter();
		this.tree = this._register(new TestObjectTree(t => 'test' in t ? t.test.item.label : t.message.toString(), sorter));
		this._register(this.tree.onDidChangeCollapseState(evt => {
			if (evt.node.element instanceof TestItemTreeElement) {
				this.projection.expandElement(evt.node.element, evt.deep ? Infinity : 0);
			}
		}));
	}

	public pushDiff(...diff: TestsDiffOp[]) {
		this.onDiff.fire(diff);
	}

	public flush() {
		this.isProcessingDiff = true;
		while (this.c.currentDiff.length) {
			this.onDiff.fire(this.c.collectDiff());
		}
		this.isProcessingDiff = false;

		this.projection.applyTo(this.tree);
		return this.tree.getRendered();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/test/browser/explorerProjections/nameProjection.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/test/browser/explorerProjections/nameProjection.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Emitter, Event } from '../../../../../../base/common/event.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { ListProjection } from '../../../browser/explorerProjections/listProjection.js';
import { TestId } from '../../../common/testId.js';
import { TestResultItemChange } from '../../../common/testResult.js';
import { TestDiffOpType, TestItemExpandState } from '../../../common/testTypes.js';
import { TestTreeTestHarness } from '../testObjectTree.js';
import { TestTestItem } from '../../common/testStubs.js';
import { upcastPartial } from '../../../../../../base/test/common/mock.js';
import { ITestResultService } from '../../../common/testResultService.js';

suite('Workbench - Testing Explorer Hierarchal by Name Projection', () => {
	let harness: TestTreeTestHarness<ListProjection>;
	let onTestChanged: Emitter<TestResultItemChange>;
	let resultsService: ITestResultService;

	teardown(() => {
		harness.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	setup(() => {
		onTestChanged = new Emitter();
		resultsService = upcastPartial<ITestResultService>({
			onResultsChanged: Event.None,
			onTestChanged: onTestChanged.event,
			getStateById: () => undefined,
		});

		harness = new TestTreeTestHarness(l => new ListProjection({}, l, resultsService));
	});

	test('renders initial tree', () => {
		harness.flush();
		assert.deepStrictEqual(harness.tree.getRendered(), [
			{ e: 'aa' }, { e: 'ab' }, { e: 'b' }
		]);
	});

	test('updates render if second test provider appears', async () => {
		harness.flush();
		harness.pushDiff({
			op: TestDiffOpType.Add,
			item: { controllerId: 'ctrl2', expand: TestItemExpandState.Expanded, item: new TestTestItem(new TestId(['ctrl2']), 'root2').toTestItem() },
		}, {
			op: TestDiffOpType.Add,
			item: { controllerId: 'ctrl2', expand: TestItemExpandState.NotExpandable, item: new TestTestItem(new TestId(['ctrl2', 'id-c']), 'c', undefined).toTestItem() },
		});

		assert.deepStrictEqual(harness.flush(), [
			{ e: 'root', children: [{ e: 'aa' }, { e: 'ab' }, { e: 'b' }] },
			{ e: 'root2', children: [{ e: 'c' }] },
		]);
	});

	test('updates nodes if they add children', async () => {
		harness.flush();

		harness.c.root.children.get('id-a')!.children.add(new TestTestItem(new TestId(['ctrlId', 'id-a', 'id-ac']), 'ac'));

		assert.deepStrictEqual(harness.flush(), [
			{ e: 'aa' },
			{ e: 'ab' },
			{ e: 'ac' },
			{ e: 'b' }
		]);
	});

	test('updates nodes if they remove children', async () => {
		harness.flush();
		harness.c.root.children.get('id-a')!.children.delete('id-ab');

		assert.deepStrictEqual(harness.flush(), [
			{ e: 'aa' },
			{ e: 'b' }
		]);
	});

	test('swaps when node is no longer leaf', async () => {
		harness.flush();
		harness.c.root.children.get('id-b')!.children.add(new TestTestItem(new TestId(['ctrlId', 'id-b', 'id-ba']), 'ba'));

		assert.deepStrictEqual(harness.flush(), [
			{ e: 'aa' },
			{ e: 'ab' },
			{ e: 'ba' },
		]);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/test/browser/explorerProjections/treeProjection.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/test/browser/explorerProjections/treeProjection.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Emitter, Event } from '../../../../../../base/common/event.js';
import { DisposableStore } from '../../../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { TreeProjection } from '../../../browser/explorerProjections/treeProjection.js';
import { TestId } from '../../../common/testId.js';
import { TestResultItemChange, TestResultItemChangeReason } from '../../../common/testResult.js';
import { TestDiffOpType, TestItemExpandState, TestResultItem, TestResultState } from '../../../common/testTypes.js';
import { TestTreeTestHarness } from '../testObjectTree.js';
import { TestTestItem } from '../../common/testStubs.js';
import { upcastPartial } from '../../../../../../base/test/common/mock.js';
import { ITestResultService } from '../../../common/testResultService.js';

class TestHierarchicalByLocationProjection extends TreeProjection {
}

suite('Workbench - Testing Explorer Hierarchal by Location Projection', () => {
	let harness: TestTreeTestHarness<TestHierarchicalByLocationProjection>;
	let onTestChanged: Emitter<TestResultItemChange>;
	let resultsService: ITestResultService;
	let ds: DisposableStore;

	teardown(() => {
		ds.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	setup(() => {
		ds = new DisposableStore();
		onTestChanged = ds.add(new Emitter());
		resultsService = upcastPartial<ITestResultService>({
			results: [],
			onResultsChanged: Event.None,
			onTestChanged: onTestChanged.event,
			getStateById: () => undefined,
		});

		harness = ds.add(new TestTreeTestHarness(l => new TestHierarchicalByLocationProjection({}, l, resultsService)));
	});

	test('renders initial tree', async () => {
		harness.flush();
		assert.deepStrictEqual(harness.tree.getRendered(), [
			{ e: 'a' }, { e: 'b' }
		]);
	});

	test('expands children', async () => {
		harness.flush();
		harness.tree.expand(harness.projection.getElementByTestId(new TestId(['ctrlId', 'id-a']).toString())!);
		assert.deepStrictEqual(harness.flush(), [
			{ e: 'a', children: [{ e: 'aa' }, { e: 'ab' }] }, { e: 'b' }
		]);
	});

	test('updates render if second test provider appears', async () => {
		harness.flush();
		harness.pushDiff({
			op: TestDiffOpType.Add,
			item: { controllerId: 'ctrl2', expand: TestItemExpandState.Expanded, item: new TestTestItem(new TestId(['ctrlId2']), 'c').toTestItem() },
		}, {
			op: TestDiffOpType.Add,
			item: { controllerId: 'ctrl2', expand: TestItemExpandState.NotExpandable, item: new TestTestItem(new TestId(['ctrlId2', 'id-c']), 'ca').toTestItem() },
		});

		assert.deepStrictEqual(harness.flush(), [
			{ e: 'c', children: [{ e: 'ca' }] },
			{ e: 'root', children: [{ e: 'a' }, { e: 'b' }] }
		]);
	});

	test('updates nodes if they add children', async () => {
		harness.flush();
		harness.tree.expand(harness.projection.getElementByTestId(new TestId(['ctrlId', 'id-a']).toString())!);

		assert.deepStrictEqual(harness.flush(), [
			{ e: 'a', children: [{ e: 'aa' }, { e: 'ab' }] },
			{ e: 'b' }
		]);

		harness.c.root.children.get('id-a')!.children.add(new TestTestItem(new TestId(['ctrlId', 'id-a', 'id-ac']), 'ac'));

		assert.deepStrictEqual(harness.flush(), [
			{ e: 'a', children: [{ e: 'aa' }, { e: 'ab' }, { e: 'ac' }] },
			{ e: 'b' }
		]);
	});

	test('updates nodes if they remove children', async () => {
		harness.flush();
		harness.tree.expand(harness.projection.getElementByTestId(new TestId(['ctrlId', 'id-a']).toString())!);

		assert.deepStrictEqual(harness.flush(), [
			{ e: 'a', children: [{ e: 'aa' }, { e: 'ab' }] },
			{ e: 'b' }
		]);

		harness.c.root.children.get('id-a')!.children.delete('id-ab');

		assert.deepStrictEqual(harness.flush(), [
			{ e: 'a', children: [{ e: 'aa' }] },
			{ e: 'b' }
		]);
	});

	test('applies state changes', async () => {
		harness.flush();

		const resultInState = (state: TestResultState): TestResultItem => ({
			item: {
				extId: new TestId(['ctrlId', 'id-a']).toString(),
				busy: false,
				description: null,
				error: null,
				label: 'a',
				range: null,
				sortText: null,
				tags: [],
				uri: undefined,
			},
			tasks: [],
			ownComputedState: state,
			computedState: state,
			expand: 0,
			controllerId: 'ctrl',
		});

		// Applies the change:
		resultsService.getStateById = () => [undefined!, resultInState(TestResultState.Queued)];
		onTestChanged.fire({
			reason: TestResultItemChangeReason.OwnStateChange,
			result: undefined!,
			previousState: TestResultState.Unset,
			item: resultInState(TestResultState.Queued),
			previousOwnDuration: undefined,
		});
		harness.projection.applyTo(harness.tree);

		assert.deepStrictEqual(harness.tree.getRendered('state'), [
			{ e: 'a', data: String(TestResultState.Queued) },
			{ e: 'b', data: String(TestResultState.Unset) }
		]);

		// Falls back if moved into unset state:
		resultsService.getStateById = () => [undefined!, resultInState(TestResultState.Failed)];
		onTestChanged.fire({
			reason: TestResultItemChangeReason.OwnStateChange,
			result: undefined!,
			previousState: TestResultState.Queued,
			item: resultInState(TestResultState.Unset),
			previousOwnDuration: undefined,
		});
		harness.projection.applyTo(harness.tree);

		assert.deepStrictEqual(harness.tree.getRendered('state'), [
			{ e: 'a', data: String(TestResultState.Failed) },
			{ e: 'b', data: String(TestResultState.Unset) }
		]);
	});

	test('applies test changes (resort)', async () => {
		harness.flush();
		harness.tree.expand(harness.projection.getElementByTestId(new TestId(['ctrlId', 'id-a']).toString())!);
		assert.deepStrictEqual(harness.flush(), [
			{ e: 'a', children: [{ e: 'aa' }, { e: 'ab' }] }, { e: 'b' }
		]);
		// sortText causes order to change
		harness.pushDiff({
			op: TestDiffOpType.Update,
			item: { extId: new TestId(['ctrlId', 'id-a', 'id-aa']).toString(), item: { sortText: 'z' } }
		}, {
			op: TestDiffOpType.Update,
			item: { extId: new TestId(['ctrlId', 'id-a', 'id-ab']).toString(), item: { sortText: 'a' } }
		});
		assert.deepStrictEqual(harness.flush(), [
			{ e: 'a', children: [{ e: 'ab' }, { e: 'aa' }] }, { e: 'b' }
		]);
		// label causes order to change
		harness.pushDiff({
			op: TestDiffOpType.Update,
			item: { extId: new TestId(['ctrlId', 'id-a', 'id-aa']).toString(), item: { sortText: undefined, label: 'z' } }
		}, {
			op: TestDiffOpType.Update,
			item: { extId: new TestId(['ctrlId', 'id-a', 'id-ab']).toString(), item: { sortText: undefined, label: 'a' } }
		});
		assert.deepStrictEqual(harness.flush(), [
			{ e: 'a', children: [{ e: 'a' }, { e: 'z' }] }, { e: 'b' }
		]);
		harness.pushDiff({
			op: TestDiffOpType.Update,
			item: { extId: new TestId(['ctrlId', 'id-a', 'id-aa']).toString(), item: { label: 'a2' } }
		}, {
			op: TestDiffOpType.Update,
			item: { extId: new TestId(['ctrlId', 'id-a', 'id-ab']).toString(), item: { label: 'z2' } }
		});
		assert.deepStrictEqual(harness.flush(), [
			{ e: 'a', children: [{ e: 'a2' }, { e: 'z2' }] }, { e: 'b' }
		]);
	});

	test('applies test changes (error)', async () => {
		harness.flush();
		assert.deepStrictEqual(harness.flush(), [
			{ e: 'a' }, { e: 'b' }
		]);
		// sortText causes order to change
		harness.pushDiff({
			op: TestDiffOpType.Update,
			item: { extId: new TestId(['ctrlId', 'id-a']).toString(), item: { error: 'bad' } }
		});
		assert.deepStrictEqual(harness.flush(), [
			{ e: 'a' }, { e: 'b' }
		]);
		harness.tree.expand(harness.projection.getElementByTestId(new TestId(['ctrlId', 'id-a']).toString())!);
		assert.deepStrictEqual(harness.flush(), [
			{ e: 'a', children: [{ e: 'bad' }, { e: 'aa' }, { e: 'ab' }] }, { e: 'b' }
		]);
		harness.pushDiff({
			op: TestDiffOpType.Update,
			item: { extId: new TestId(['ctrlId', 'id-a']).toString(), item: { error: 'badder' } }
		});
		assert.deepStrictEqual(harness.flush(), [
			{ e: 'a', children: [{ e: 'badder' }, { e: 'aa' }, { e: 'ab' }] }, { e: 'b' }
		]);

	});

	test('fixes #204805', async () => {
		harness.flush();
		harness.pushDiff({
			op: TestDiffOpType.Remove,
			itemId: 'ctrlId',
		}, {
			op: TestDiffOpType.Add,
			item: { controllerId: 'ctrlId', expand: TestItemExpandState.NotExpandable, item: new TestTestItem(new TestId(['ctrlId']), 'ctrl').toTestItem() },
		}, {
			op: TestDiffOpType.Add,
			item: { controllerId: 'ctrlId', expand: TestItemExpandState.NotExpandable, item: new TestTestItem(new TestId(['ctrlId', 'a']), 'a').toTestItem() },
		});

		assert.deepStrictEqual(harness.flush(), [
			{ e: 'a' }
		]);

		harness.pushDiff({
			op: TestDiffOpType.Add,
			item: { controllerId: 'ctrlId', expand: TestItemExpandState.NotExpandable, item: new TestTestItem(new TestId(['ctrlId', 'a', 'b']), 'b').toTestItem() },
		});
		harness.flush();
		harness.tree.expandAll();
		assert.deepStrictEqual(harness.tree.getRendered(), [
			{ e: 'a', children: [{ e: 'b' }] }
		]);

		harness.pushDiff({
			op: TestDiffOpType.Add,
			item: { controllerId: 'ctrlId', expand: TestItemExpandState.NotExpandable, item: new TestTestItem(new TestId(['ctrlId', 'a', 'b', 'c']), 'c').toTestItem() },
		});
		harness.flush();
		harness.tree.expandAll();
		assert.deepStrictEqual(harness.tree.getRendered(), [
			{ e: 'a', children: [{ e: 'b', children: [{ e: 'c' }] }] }
		]);
	});

	test('fixes #213316 (single root)', async () => {
		harness.flush();
		assert.deepStrictEqual(harness.tree.getRendered(), [
			{ e: 'a' }, { e: 'b' }
		]);
		harness.pushDiff({
			op: TestDiffOpType.Remove,
			itemId: new TestId(['ctrlId', 'id-a']).toString(),
		});
		harness.flush();
		assert.deepStrictEqual(harness.tree.getRendered(), [
			{ e: 'b' }
		]);
	});

	test('fixes #213316 (multi root)', async () => {
		harness.pushDiff({
			op: TestDiffOpType.Add,
			item: { controllerId: 'ctrl2', expand: TestItemExpandState.Expanded, item: new TestTestItem(new TestId(['ctrlId2']), 'c').toTestItem() },
		}, {
			op: TestDiffOpType.Add,
			item: { controllerId: 'ctrl2', expand: TestItemExpandState.NotExpandable, item: new TestTestItem(new TestId(['ctrlId2', 'id-c']), 'ca').toTestItem() },
		});
		harness.flush();
		assert.deepStrictEqual(harness.flush(), [
			{ e: 'c', children: [{ e: 'ca' }] },
			{ e: 'root', children: [{ e: 'a' }, { e: 'b' }] }
		]);

		harness.pushDiff({
			op: TestDiffOpType.Remove,
			itemId: new TestId(['ctrlId', 'id-a']).toString(),
		});
		harness.flush();
		assert.deepStrictEqual(harness.tree.getRendered(), [
			{ e: 'c', children: [{ e: 'ca' }] },
			{ e: 'root', children: [{ e: 'b' }] }
		]);

		harness.pushDiff({
			op: TestDiffOpType.Remove,
			itemId: new TestId(['ctrlId', 'id-b']).toString(),
		});
		harness.flush();
		assert.deepStrictEqual(harness.tree.getRendered(), [
			{ e: 'ca' }
		]);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/test/browser/__snapshots__/Code_Coverage_Decorations_CoverageDetailsModel_1.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/testing/test/browser/__snapshots__/Code_Coverage_Decorations_CoverageDetailsModel_1.0.snap

```text
[
  {
    range: "[1,0 -> 2,0]",
    count: 1
  },
  {
    range: "[2,0 -> 3,0]",
    count: 2
  },
  {
    range: "[3,0 -> 4,0]",
    count: 3
  },
  {
    range: "[4,0 -> 6,0]",
    count: 4
  },
  {
    range: "[6,0 -> 7,0]",
    count: 3
  },
  {
    range: "[7,0 -> 7,0]",
    count: 2
  },
  {
    range: "[5,0 -> 7,0]",
    count: 1
  }
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/test/browser/__snapshots__/Code_Coverage_Decorations_CoverageDetailsModel_2.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/testing/test/browser/__snapshots__/Code_Coverage_Decorations_CoverageDetailsModel_2.0.snap

```text
[
  {
    range: "[1,0 -> 2,0]",
    count: 1
  },
  {
    range: "[2,0 -> 3,0]",
    count: 2
  },
  {
    range: "[3,0 -> 3,5]",
    count: 3
  },
  {
    range: "[3,5 -> 4,0]",
    count: 2
  },
  {
    range: "[4,0 -> 5,0]",
    count: 1
  }
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/test/browser/__snapshots__/Code_Coverage_Decorations_CoverageDetailsModel_3.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/testing/test/browser/__snapshots__/Code_Coverage_Decorations_CoverageDetailsModel_3.0.snap

```text
[
  {
    range: "[1,0 -> 2,0]",
    count: 1
  },
  {
    range: "[2,0 -> 3,0]",
    count: 2
  },
  {
    range: "[3,0 -> 4,0]",
    count: 1
  },
  {
    range: "[4,0 -> 5,0]",
    count: 3
  }
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/test/browser/__snapshots__/Code_Coverage_Decorations_CoverageDetailsModel_4.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/testing/test/browser/__snapshots__/Code_Coverage_Decorations_CoverageDetailsModel_4.0.snap

```text
[
  {
    range: "[1,0 -> 2,0]",
    count: 1
  },
  {
    range: "[2,0 -> 2,2147483647]",
    count: 2
  },
  {
    range: "[2,2147483647 -> 4,0]",
    count: 1
  },
  {
    range: "[4,0 -> 4,3]",
    count: 3
  },
  {
    range: "[4,3 -> 4,2147483647]",
    count: 4
  },
  {
    range: "[4,2147483647 -> 5,0]",
    count: 3
  }
]
```

--------------------------------------------------------------------------------

````
