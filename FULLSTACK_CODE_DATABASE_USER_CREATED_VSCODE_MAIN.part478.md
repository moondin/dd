---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 478
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 478 of 552)

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

---[FILE: src/vs/workbench/contrib/testing/test/common/testCoverage.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/test/common/testCoverage.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { SinonSandbox, createSandbox } from 'sinon';
import { URI } from '../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { onObservableChange } from '../../common/observableUtils.js';
import { ICoverageAccessor, TestCoverage } from '../../common/testCoverage.js';
import { LiveTestResult } from '../../common/testResult.js';
import { IFileCoverage } from '../../common/testTypes.js';
import { IUriIdentityService } from '../../../../../platform/uriIdentity/common/uriIdentity.js';
import { upcastDeepPartial, upcastPartial } from '../../../../../base/test/common/mock.js';

suite('TestCoverage', () => {
	let sandbox: SinonSandbox;
	let coverageAccessor: ICoverageAccessor;
	let testCoverage: TestCoverage;

	const ds = ensureNoDisposablesAreLeakedInTestSuite();

	setup(() => {
		sandbox = createSandbox();
		coverageAccessor = {
			getCoverageDetails: sandbox.stub().resolves([]),
		};
		testCoverage = new TestCoverage({} as LiveTestResult, 'taskId', upcastDeepPartial<IUriIdentityService>({ extUri: upcastPartial({ ignorePathCasing: () => true }) }), coverageAccessor);
	});

	teardown(() => {
		sandbox.restore();
	});

	function addTests() {
		const raw1: IFileCoverage = {
			id: '1',
			uri: URI.file('/path/to/file'),
			statement: { covered: 10, total: 20 },
			branch: { covered: 5, total: 10 },
			declaration: { covered: 2, total: 5 },
		};

		testCoverage.append(raw1, undefined);

		const raw2: IFileCoverage = {
			id: '1',
			uri: URI.file('/path/to/file2'),
			statement: { covered: 5, total: 10 },
			branch: { covered: 1, total: 5 },
		};

		testCoverage.append(raw2, undefined);

		return { raw1, raw2 };
	}

	test('should look up file coverage', async () => {
		const { raw1 } = addTests();

		const fileCoverage = testCoverage.getUri(raw1.uri);
		assert.equal(fileCoverage?.id, raw1.id);
		assert.deepEqual(fileCoverage?.statement, raw1.statement);
		assert.deepEqual(fileCoverage?.branch, raw1.branch);
		assert.deepEqual(fileCoverage?.declaration, raw1.declaration);

		assert.strictEqual(testCoverage.getComputedForUri(raw1.uri), testCoverage.getUri(raw1.uri));
		assert.strictEqual(testCoverage.getComputedForUri(URI.file('/path/to/x')), undefined);
		assert.strictEqual(testCoverage.getUri(URI.file('/path/to/x')), undefined);
	});

	test('should compute coverage for directories', async () => {
		const { raw1 } = addTests();
		const dirCoverage = testCoverage.getComputedForUri(URI.file('/path/to'));
		assert.deepEqual(dirCoverage?.statement, { covered: 15, total: 30 });
		assert.deepEqual(dirCoverage?.branch, { covered: 6, total: 15 });
		assert.deepEqual(dirCoverage?.declaration, raw1.declaration);
	});

	test('should incrementally diff updates to existing files', async () => {
		addTests();

		const raw3: IFileCoverage = {
			id: '1',
			uri: URI.file('/path/to/file'),
			statement: { covered: 12, total: 24 },
			branch: { covered: 7, total: 10 },
			declaration: { covered: 2, total: 5 },
		};

		testCoverage.append(raw3, undefined);

		const fileCoverage = testCoverage.getUri(raw3.uri);
		assert.deepEqual(fileCoverage?.statement, raw3.statement);
		assert.deepEqual(fileCoverage?.branch, raw3.branch);
		assert.deepEqual(fileCoverage?.declaration, raw3.declaration);

		const dirCoverage = testCoverage.getComputedForUri(URI.file('/path/to'));
		assert.deepEqual(dirCoverage?.statement, { covered: 17, total: 34 });
		assert.deepEqual(dirCoverage?.branch, { covered: 8, total: 15 });
		assert.deepEqual(dirCoverage?.declaration, raw3.declaration);
	});

	test('should emit changes', async () => {
		const changes: string[][] = [];
		ds.add(onObservableChange(testCoverage.didAddCoverage, value =>
			changes.push(value.map(v => v.value!.uri.toString()))));

		addTests();

		assert.deepStrictEqual(changes, [
			[
				'file:///',
				'file:///',
				'file:///',
				'file:///path',
				'file:///path/to',
				'file:///path/to/file',
			],
			[
				'file:///',
				'file:///',
				'file:///',
				'file:///path',
				'file:///path/to',
				'file:///path/to/file2',
			],
		]);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/test/common/testExplorerFilterState.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/test/common/testExplorerFilterState.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { InMemoryStorageService } from '../../../../../platform/storage/common/storage.js';
import { TestExplorerFilterState, TestFilterTerm } from '../../common/testExplorerFilterState.js';

suite('TestExplorerFilterState', () => {
	let t: TestExplorerFilterState;
	let ds: DisposableStore;

	teardown(() => {
		ds.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	setup(() => {
		ds = new DisposableStore();
		t = ds.add(new TestExplorerFilterState(ds.add(new InMemoryStorageService())));
	});

	const assertFilteringFor = (expected: { [T in TestFilterTerm]?: boolean }) => {
		for (const [term, expectation] of Object.entries(expected)) {
			assert.strictEqual(t.isFilteringFor(term as TestFilterTerm), expectation, `expected filtering for ${term} === ${expectation}`);
		}
	};

	const termFiltersOff = {
		[TestFilterTerm.Failed]: false,
		[TestFilterTerm.Executed]: false,
		[TestFilterTerm.CurrentDoc]: false,
		[TestFilterTerm.Hidden]: false,
	};

	test('filters simple globs', () => {
		t.setText('hello, !world');
		assert.deepStrictEqual(t.globList, [{ text: 'hello', include: true }, { text: 'world', include: false }]);
		assert.deepStrictEqual(t.includeTags, new Set());
		assert.deepStrictEqual(t.excludeTags, new Set());
		assertFilteringFor(termFiltersOff);
	});

	test('filters to patterns', () => {
		t.setText('@doc');
		assert.deepStrictEqual(t.globList, []);
		assert.deepStrictEqual(t.includeTags, new Set());
		assert.deepStrictEqual(t.excludeTags, new Set());
		assertFilteringFor({
			...termFiltersOff,
			[TestFilterTerm.CurrentDoc]: true,
		});
	});

	test('filters to tags', () => {
		t.setText('@hello:world !@foo:bar');
		assert.deepStrictEqual(t.globList, []);
		assert.deepStrictEqual(t.includeTags, new Set(['hello\0world']));
		assert.deepStrictEqual(t.excludeTags, new Set(['foo\0bar']));
		assertFilteringFor(termFiltersOff);
	});

	test('filters to mixed terms and tags', () => {
		t.setText('@hello:world foo, !bar @doc !@foo:bar');
		assert.deepStrictEqual(t.globList, [{ text: 'foo', include: true }, { text: 'bar', include: false }]);
		assert.deepStrictEqual(t.includeTags, new Set(['hello\0world']));
		assert.deepStrictEqual(t.excludeTags, new Set(['foo\0bar']));
		assertFilteringFor({
			...termFiltersOff,
			[TestFilterTerm.CurrentDoc]: true,
		});
	});

	test('parses quotes', () => {
		t.setText('@hello:"world" @foo:\'bar\' baz');
		assert.deepStrictEqual(t.globList, [{ text: 'baz', include: true }]);
		assert.deepStrictEqual([...t.includeTags], ['hello\0world', 'foo\0bar']);
		assert.deepStrictEqual(t.excludeTags, new Set());
	});

	test('parses quotes with escapes', () => {
		t.setText('@hello:"world\\"1" foo');
		assert.deepStrictEqual(t.globList, [{ text: 'foo', include: true }]);
		assert.deepStrictEqual([...t.includeTags], ['hello\0world"1']);
		assert.deepStrictEqual(t.excludeTags, new Set());
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/test/common/testingContinuousRunService.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/test/common/testingContinuousRunService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { Emitter } from '../../../../../base/common/event.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { MockContextKeyService } from '../../../../../platform/keybinding/test/common/mockKeybindingService.js';
import { mock, TestStorageService } from '../../../../test/common/workbenchTestServices.js';
import { ITestingContinuousRunService, TestingContinuousRunService } from '../../common/testingContinuousRunService.js';
import { ITestProfileService } from '../../common/testProfileService.js';
import { ITestService } from '../../common/testService.js';
import { ITestRunProfile, ResolvedTestRunRequest, TestRunProfileBitset } from '../../common/testTypes.js';

suite('TestingContinuousRunService', () => {
	const ds = ensureNoDisposablesAreLeakedInTestSuite();
	let testService: MockTestService;
	let cr: ITestingContinuousRunService;

	const profile1: ITestRunProfile = { profileId: 1, controllerId: 'ctrl', group: TestRunProfileBitset.Run, label: 'label', supportsContinuousRun: true, isDefault: false, hasConfigurationHandler: true, tag: null };
	const profile2: ITestRunProfile = { profileId: 2, controllerId: 'ctrl', group: TestRunProfileBitset.Run, label: 'label', supportsContinuousRun: true, isDefault: false, hasConfigurationHandler: true, tag: null };

	class MockTestService extends mock<ITestService>() {
		public requests = new Set<ResolvedTestRunRequest>();
		public log: [kind: 'start' | 'stop', profileId: number, testIds: string[]][] = [];

		override startContinuousRun(req: ResolvedTestRunRequest, token: CancellationToken): Promise<void> {
			this.requests.add(req);
			this.log.push(['start', req.targets[0].profileId, req.targets[0].testIds]);
			ds.add(token.onCancellationRequested(() => {
				this.log.push(['stop', req.targets[0].profileId, req.targets[0].testIds]);
				this.requests.delete(req);
			}));
			return Promise.resolve();
		}
	}

	class MockProfilesService extends mock<ITestProfileService>() {
		public didChangeEmitter = ds.add(new Emitter<void>());
		override onDidChange = this.didChangeEmitter.event;

		override getGroupDefaultProfiles(group: TestRunProfileBitset, controllerId?: string): ITestRunProfile[] {
			return [];
		}
	}

	setup(() => {
		testService = new MockTestService();
		cr = ds.add(new TestingContinuousRunService(
			testService,
			ds.add(new TestStorageService()),
			ds.add(new MockContextKeyService()),
			new MockProfilesService(),
		));
	});

	test('isSpecificallyEnabledFor', () => {
		assert.strictEqual(cr.isEnabled(), false);
		assert.strictEqual(cr.isSpecificallyEnabledFor('testId'), false);

		cr.start([profile1], 'testId\0child');
		assert.strictEqual(cr.isSpecificallyEnabledFor('testId'), false);
		assert.strictEqual(cr.isSpecificallyEnabledFor('testId\0child'), true);

		assert.deepStrictEqual(testService.log, [
			['start', 1, ['testId\0child']],
		]);
	});

	test('isEnabledForAParentOf', () => {
		assert.strictEqual(cr.isEnabled(), false);
		assert.strictEqual(cr.isEnabledForAParentOf('testId'), false);
		cr.start([profile1], 'parentTestId\0testId');
		assert.strictEqual(cr.isEnabledForAParentOf('parentTestId'), false);
		assert.strictEqual(cr.isEnabledForAParentOf('parentTestId\0testId'), true);
		assert.strictEqual(cr.isEnabledForAParentOf('parentTestId\0testId\0nestd'), true);
		assert.strictEqual(cr.isEnabled(), true);

		assert.deepStrictEqual(testService.log, [
			['start', 1, ['parentTestId\0testId']],
		]);
	});

	test('isEnabledForAChildOf', () => {
		assert.strictEqual(cr.isEnabled(), false);
		assert.strictEqual(cr.isEnabledForAChildOf('testId'), false);
		cr.start([profile1], 'testId\0childTestId');
		assert.strictEqual(cr.isEnabledForAChildOf('testId'), true);
		assert.strictEqual(cr.isEnabledForAChildOf('testId\0childTestId'), true);
		assert.strictEqual(cr.isEnabledForAChildOf('testId\0childTestId\0neested'), false);
		assert.strictEqual(cr.isEnabled(), true);
	});

	suite('lifecycle', () => {
		test('stops general in DFS order', () => {
			cr.start([profile1], 'a\0b\0c\0d');
			cr.start([profile1], 'a\0b');
			cr.start([profile1], 'a\0b\0c');
			cr.stop();
			assert.deepStrictEqual(testService.log, [
				['start', 1, ['a\0b\0c\0d']],
				['start', 1, ['a\0b']],
				['start', 1, ['a\0b\0c']],
				['stop', 1, ['a\0b\0c\0d']],
				['stop', 1, ['a\0b\0c']],
				['stop', 1, ['a\0b']],
			]);
			assert.strictEqual(cr.isEnabled(), false);
		});

		test('stops profiles in DFS order', () => {
			cr.start([profile1], 'a\0b\0c\0d');
			cr.start([profile1], 'a\0b');
			cr.start([profile1], 'a\0b\0c');
			cr.stopProfile(profile1);
			assert.deepStrictEqual(testService.log, [
				['start', 1, ['a\0b\0c\0d']],
				['start', 1, ['a\0b']],
				['start', 1, ['a\0b\0c']],
				['stop', 1, ['a\0b\0c\0d']],
				['stop', 1, ['a\0b\0c']],
				['stop', 1, ['a\0b']],
			]);
			assert.strictEqual(cr.isEnabled(), false);
		});

		test('updates profile for a test if profile is changed', () => {
			cr.start([profile1], 'parent\0testId');
			cr.start([profile2], 'parent\0testId');
			assert.strictEqual(cr.isEnabled(), true);
			cr.stop();
			assert.strictEqual(cr.isEnabled(), false);
			assert.deepStrictEqual(testService.log, [
				['start', 1, ['parent\0testId']],
				['start', 2, ['parent\0testId']],
				['stop', 1, ['parent\0testId']],
				['stop', 2, ['parent\0testId']],
			]);
			assert.strictEqual(cr.isEnabled(), false);
		});

		test('stops a single profile test', () => {
			cr.start([profile1, profile2], 'parent\0testId');
			cr.stopProfile(profile1);
			assert.deepStrictEqual(testService.log, [
				['start', 1, ['parent\0testId']],
				['start', 2, ['parent\0testId']],
				['stop', 1, ['parent\0testId']],
			]);
			assert.strictEqual(cr.isEnabled(), true);

			cr.stopProfile(profile2);
			assert.deepStrictEqual(testService.log, [
				['start', 1, ['parent\0testId']],
				['start', 2, ['parent\0testId']],
				['stop', 1, ['parent\0testId']],
				['stop', 2, ['parent\0testId']],
			]);
			assert.strictEqual(cr.isEnabled(), false);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/test/common/testingUri.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/test/common/testingUri.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { buildTestUri, ParsedTestUri, parseTestUri, TestUriType } from '../../common/testingUri.js';

suite('Workbench - Testing URIs', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('round trip', () => {
		const uris: ParsedTestUri[] = [
			{ type: TestUriType.ResultActualOutput, taskIndex: 1, messageIndex: 42, resultId: 'r', testExtId: 't' },
			{ type: TestUriType.ResultExpectedOutput, taskIndex: 1, messageIndex: 42, resultId: 'r', testExtId: 't' },
			{ type: TestUriType.ResultMessage, taskIndex: 1, messageIndex: 42, resultId: 'r', testExtId: 't' },
		];

		for (const uri of uris) {
			const serialized = buildTestUri(uri);
			assert.deepStrictEqual(uri, parseTestUri(serialized));
		}
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/test/common/testProfileService.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/test/common/testProfileService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/



import assert from 'assert';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { MockContextKeyService } from '../../../../../platform/keybinding/test/common/mockKeybindingService.js';
import { TestProfileService } from '../../common/testProfileService.js';
import { ITestRunProfile, TestRunProfileBitset } from '../../common/testTypes.js';
import { TestStorageService } from '../../../../test/common/workbenchTestServices.js';
import { upcastPartial } from '../../../../../base/test/common/mock.js';
import { IMainThreadTestController } from '../../common/testService.js';

suite('Workbench - TestProfileService', () => {
	let t: TestProfileService;
	let ds: DisposableStore;
	let idCounter = 0;

	teardown(() => {
		ds.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	setup(() => {
		idCounter = 0;
		ds = new DisposableStore();
		t = ds.add(new TestProfileService(
			new MockContextKeyService(),
			ds.add(new TestStorageService()),
		));
	});

	const addProfile = (profile: Partial<ITestRunProfile>) => {
		const p: ITestRunProfile = {
			controllerId: 'ctrlId',
			group: TestRunProfileBitset.Run,
			isDefault: true,
			label: 'profile',
			profileId: idCounter++,
			hasConfigurationHandler: false,
			tag: null,
			supportsContinuousRun: false,
			...profile,
		};

		t.addProfile(upcastPartial<IMainThreadTestController>({ id: 'ctrlId' }), p);
		return p;
	};

	const assertGroupDefaults = (group: TestRunProfileBitset, expected: ITestRunProfile[]) => {
		assert.deepStrictEqual(t.getGroupDefaultProfiles(group).map(p => p.label), expected.map(e => e.label));
	};

	const expectProfiles = (expected: ITestRunProfile[], actual: string[]) => {
		const e = expected.map(e => e.label).sort();
		const a = actual.sort();
		assert.deepStrictEqual(e, a);
	};

	test('getGroupDefaultProfiles', () => {
		addProfile({ isDefault: true, group: TestRunProfileBitset.Debug, label: 'a' });
		addProfile({ isDefault: false, group: TestRunProfileBitset.Debug, label: 'b' });
		addProfile({ isDefault: true, group: TestRunProfileBitset.Run, label: 'c' });
		addProfile({ isDefault: true, group: TestRunProfileBitset.Run, label: 'd', controllerId: '2' });
		addProfile({ isDefault: false, group: TestRunProfileBitset.Run, label: 'e', controllerId: '2' });
		expectProfiles(t.getGroupDefaultProfiles(TestRunProfileBitset.Run), ['c', 'd']);
		expectProfiles(t.getGroupDefaultProfiles(TestRunProfileBitset.Debug), ['a']);
	});

	suite('setGroupDefaultProfiles', () => {
		test('applies simple changes', () => {
			const p1 = addProfile({ isDefault: false, group: TestRunProfileBitset.Debug, label: 'a' });
			addProfile({ isDefault: false, group: TestRunProfileBitset.Debug, label: 'b' });
			const p3 = addProfile({ isDefault: false, group: TestRunProfileBitset.Run, label: 'c' });
			addProfile({ isDefault: false, group: TestRunProfileBitset.Run, label: 'd' });

			t.setGroupDefaultProfiles(TestRunProfileBitset.Run, [p3]);
			assertGroupDefaults(TestRunProfileBitset.Run, [p3]);
			assertGroupDefaults(TestRunProfileBitset.Debug, [p1]);
		});

		test('syncs labels if same', () => {
			const p1 = addProfile({ isDefault: false, group: TestRunProfileBitset.Debug, label: 'a' });
			const p2 = addProfile({ isDefault: false, group: TestRunProfileBitset.Debug, label: 'b' });
			const p3 = addProfile({ isDefault: false, group: TestRunProfileBitset.Run, label: 'a' });
			const p4 = addProfile({ isDefault: false, group: TestRunProfileBitset.Run, label: 'b' });

			t.setGroupDefaultProfiles(TestRunProfileBitset.Run, [p3]);
			assertGroupDefaults(TestRunProfileBitset.Run, [p3]);
			assertGroupDefaults(TestRunProfileBitset.Debug, [p1]);

			t.setGroupDefaultProfiles(TestRunProfileBitset.Debug, [p2]);
			assertGroupDefaults(TestRunProfileBitset.Run, [p4]);
			assertGroupDefaults(TestRunProfileBitset.Debug, [p2]);
		});

		test('does not mess up sync for multiple controllers', () => {
			// ctrl a and b both of have their own labels. ctrl c does not and should be unaffected
			const p1 = addProfile({ isDefault: false, controllerId: 'a', group: TestRunProfileBitset.Debug, label: 'a' });
			const p2 = addProfile({ isDefault: false, controllerId: 'b', group: TestRunProfileBitset.Debug, label: 'b1' });
			const p3 = addProfile({ isDefault: false, controllerId: 'b', group: TestRunProfileBitset.Debug, label: 'b2' });
			const p4 = addProfile({ isDefault: false, controllerId: 'c', group: TestRunProfileBitset.Debug, label: 'c1' });

			const p5 = addProfile({ isDefault: false, controllerId: 'a', group: TestRunProfileBitset.Run, label: 'a' });
			const p6 = addProfile({ isDefault: false, controllerId: 'b', group: TestRunProfileBitset.Run, label: 'b1' });
			const p7 = addProfile({ isDefault: false, controllerId: 'b', group: TestRunProfileBitset.Run, label: 'b2' });
			const p8 = addProfile({ isDefault: false, controllerId: 'b', group: TestRunProfileBitset.Run, label: 'b3' });

			// same profile on both
			t.setGroupDefaultProfiles(TestRunProfileBitset.Debug, [p3]);
			assertGroupDefaults(TestRunProfileBitset.Run, [p7]);
			assertGroupDefaults(TestRunProfileBitset.Debug, [p3]);

			// different profile, other should be unaffected
			t.setGroupDefaultProfiles(TestRunProfileBitset.Run, [p8]);
			assertGroupDefaults(TestRunProfileBitset.Run, [p8]);
			assertGroupDefaults(TestRunProfileBitset.Debug, [p5]);

			// multiple changes in one go, with unmatched c
			t.setGroupDefaultProfiles(TestRunProfileBitset.Debug, [p1, p2, p4]);
			assertGroupDefaults(TestRunProfileBitset.Run, [p5, p6, p8]);
			assertGroupDefaults(TestRunProfileBitset.Debug, [p1, p2, p4]);

			// identity
			t.setGroupDefaultProfiles(TestRunProfileBitset.Run, [p5, p6, p8]);
			assertGroupDefaults(TestRunProfileBitset.Run, [p5, p6, p8]);
			assertGroupDefaults(TestRunProfileBitset.Debug, [p1, p2, p4]);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/test/common/testResultService.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/test/common/testResultService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { RunOnceScheduler, timeout } from '../../../../../base/common/async.js';
import { VSBuffer } from '../../../../../base/common/buffer.js';
import { CancellationTokenSource } from '../../../../../base/common/cancellation.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { MockContextKeyService } from '../../../../../platform/keybinding/test/common/mockKeybindingService.js';
import { NullLogService } from '../../../../../platform/log/common/log.js';
import { NullTelemetryService } from '../../../../../platform/telemetry/common/telemetryUtils.js';
import { IUriIdentityService } from '../../../../../platform/uriIdentity/common/uriIdentity.js';
import { TestId } from '../../common/testId.js';
import { TestProfileService } from '../../common/testProfileService.js';
import { HydratedTestResult, LiveTestResult, TaskRawOutput, TestResultItemChange, TestResultItemChangeReason, resultItemParents } from '../../common/testResult.js';
import { TestResultService } from '../../common/testResultService.js';
import { ITestResultStorage, InMemoryResultStorage } from '../../common/testResultStorage.js';
import { ITestTaskState, ResolvedTestRunRequest, TestResultItem, TestResultState, TestRunProfileBitset } from '../../common/testTypes.js';
import { makeEmptyCounts } from '../../common/testingStates.js';
import { TestTestCollection, getInitializedMainTestCollection, testStubs } from './testStubs.js';
import { TestStorageService } from '../../../../test/common/workbenchTestServices.js';
import { upcastPartial } from '../../../../../base/test/common/mock.js';

suite('Workbench - Test Results Service', () => {
	const getLabelsIn = (it: Iterable<TestResultItem>) => [...it].map(t => t.item.label).sort();
	const getChangeSummary = () => [...changed]
		.map(c => ({ reason: c.reason, label: c.item.item.label }));

	let r: TestLiveTestResult;
	let changed = new Set<TestResultItemChange>();
	let tests: TestTestCollection;

	const defaultOpts = (testIds: string[]): ResolvedTestRunRequest => ({
		group: TestRunProfileBitset.Run,
		targets: [{
			profileId: 0,
			controllerId: 'ctrlId',
			testIds,
		}]
	});

	let insertCounter = 0;

	class TestLiveTestResult extends LiveTestResult {
		constructor(
			id: string,
			persist: boolean,
			request: ResolvedTestRunRequest,
		) {
			super(id, persist, request, insertCounter++, NullTelemetryService);
			ds.add(this);
		}

		public setAllToStatePublic(state: TestResultState, taskId: string, when: (task: ITestTaskState, item: TestResultItem) => boolean) {
			this.setAllToState(state, taskId, when);
		}
	}

	const ds = ensureNoDisposablesAreLeakedInTestSuite();

	setup(async () => {
		changed = new Set();
		r = ds.add(new TestLiveTestResult(
			'foo',
			true,
			defaultOpts(['id-a']),
		));

		ds.add(r.onChange(e => changed.add(e)));
		r.addTask({ id: 't', name: 'n', running: true, ctrlId: 'ctrl' });

		tests = ds.add(testStubs.nested());
		const cts = ds.add(new CancellationTokenSource());
		const ok = await Promise.race([
			Promise.resolve(tests.expand(tests.root.id, Infinity)).then(() => true),
			timeout(1000, cts.token).then(() => false),
		]);
		cts.cancel();

		// todo@connor4312: debug for tests #137853:
		if (!ok) {
			throw new Error('timed out while expanding, diff: ' + JSON.stringify(tests.collectDiff()));
		}

		r.addTestChainToRun('ctrlId', [
			tests.root.toTestItem(),
			tests.root.children.get('id-a')!.toTestItem(),
			tests.root.children.get('id-a')!.children.get('id-aa')!.toTestItem(),
		]);

		r.addTestChainToRun('ctrlId', [
			tests.root.children.get('id-a')!.toTestItem(),
			tests.root.children.get('id-a')!.children.get('id-ab')!.toTestItem(),
		]);
	});

	// ensureNoDisposablesAreLeakedInTestSuite(); todo@connor4312

	suite('LiveTestResult', () => {
		test('is empty if no tests are yet present', async () => {
			assert.deepStrictEqual(getLabelsIn(new TestLiveTestResult(
				'foo',
				false,
				defaultOpts(['id-a']),
			).tests), []);
		});

		test('initially queues nothing', () => {
			assert.deepStrictEqual(getChangeSummary(), []);
		});

		test('initializes with the subtree of requested tests', () => {
			assert.deepStrictEqual(getLabelsIn(r.tests), ['a', 'aa', 'ab', 'root']);
		});

		test('initializes with valid counts', () => {
			const c = makeEmptyCounts();
			c[TestResultState.Unset] = 4;
			assert.deepStrictEqual(r.counts, c);
		});

		test('setAllToState', () => {
			changed.clear();
			r.setAllToStatePublic(TestResultState.Queued, 't', (_, t) => t.item.label !== 'root');
			const c = makeEmptyCounts();
			c[TestResultState.Unset] = 1;
			c[TestResultState.Queued] = 3;
			assert.deepStrictEqual(r.counts, c);

			r.setAllToStatePublic(TestResultState.Failed, 't', (_, t) => t.item.label !== 'root');
			const c2 = makeEmptyCounts();
			c2[TestResultState.Unset] = 1;
			c2[TestResultState.Failed] = 3;
			assert.deepStrictEqual(r.counts, c2);

			assert.deepStrictEqual(r.getStateById(new TestId(['ctrlId', 'id-a']).toString())?.ownComputedState, TestResultState.Failed);
			assert.deepStrictEqual(r.getStateById(new TestId(['ctrlId', 'id-a']).toString())?.tasks[0].state, TestResultState.Failed);
			assert.deepStrictEqual(getChangeSummary(), [
				{ label: 'a', reason: TestResultItemChangeReason.OwnStateChange },
				{ label: 'root', reason: TestResultItemChangeReason.ComputedStateChange },
				{ label: 'aa', reason: TestResultItemChangeReason.OwnStateChange },
				{ label: 'ab', reason: TestResultItemChangeReason.OwnStateChange },

				{ label: 'a', reason: TestResultItemChangeReason.OwnStateChange },
				{ label: 'root', reason: TestResultItemChangeReason.ComputedStateChange },
				{ label: 'aa', reason: TestResultItemChangeReason.OwnStateChange },
				{ label: 'ab', reason: TestResultItemChangeReason.OwnStateChange },
			]);
		});

		test('updateState', () => {
			changed.clear();
			const testId = new TestId(['ctrlId', 'id-a', 'id-aa']).toString();
			r.updateState(testId, 't', TestResultState.Running);
			const c = makeEmptyCounts();
			c[TestResultState.Running] = 1;
			c[TestResultState.Unset] = 3;
			assert.deepStrictEqual(r.counts, c);
			assert.deepStrictEqual(r.getStateById(testId)?.ownComputedState, TestResultState.Running);
			// update computed state:
			assert.deepStrictEqual(r.getStateById(tests.root.id)?.computedState, TestResultState.Running);
			assert.deepStrictEqual(getChangeSummary(), [
				{ label: 'aa', reason: TestResultItemChangeReason.OwnStateChange },
				{ label: 'a', reason: TestResultItemChangeReason.ComputedStateChange },
				{ label: 'root', reason: TestResultItemChangeReason.ComputedStateChange },
			]);

			r.updateState(testId, 't', TestResultState.Passed);
			assert.deepStrictEqual(r.getStateById(testId)?.ownComputedState, TestResultState.Passed);

			r.updateState(testId, 't', TestResultState.Errored);
			assert.deepStrictEqual(r.getStateById(testId)?.ownComputedState, TestResultState.Errored);

			r.updateState(testId, 't', TestResultState.Passed);
			assert.deepStrictEqual(r.getStateById(testId)?.ownComputedState, TestResultState.Errored);
		});

		test('ignores outside run', () => {
			changed.clear();
			r.updateState(new TestId(['ctrlId', 'id-b']).toString(), 't', TestResultState.Running);
			const c = makeEmptyCounts();
			c[TestResultState.Unset] = 4;
			assert.deepStrictEqual(r.counts, c);
			assert.deepStrictEqual(r.getStateById(new TestId(['ctrlId', 'id-b']).toString()), undefined);
		});

		test('markComplete', () => {
			r.setAllToStatePublic(TestResultState.Queued, 't', () => true);
			r.updateState(new TestId(['ctrlId', 'id-a', 'id-aa']).toString(), 't', TestResultState.Passed);
			changed.clear();

			r.markComplete();

			const c = makeEmptyCounts();
			c[TestResultState.Skipped] = 3;
			c[TestResultState.Passed] = 1;
			assert.deepStrictEqual(r.counts, c);

			assert.deepStrictEqual(r.getStateById(tests.root.id)?.ownComputedState, TestResultState.Skipped);
			assert.deepStrictEqual(r.getStateById(new TestId(['ctrlId', 'id-a', 'id-aa']).toString())?.ownComputedState, TestResultState.Passed);
		});
	});

	suite('service', () => {
		let storage: ITestResultStorage;
		let results: TestResultService;

		class TestTestResultService extends TestResultService {
			protected override persistScheduler = upcastPartial<RunOnceScheduler>({ schedule: () => this.persistImmediately() });
		}

		setup(() => {
			storage = ds.add(new InMemoryResultStorage({
				asCanonicalUri(uri) {
					return uri;
				},
			} as IUriIdentityService, ds.add(new TestStorageService()), new NullLogService()));
			results = ds.add(new TestTestResultService(
				new MockContextKeyService(),
				storage,
				ds.add(new TestProfileService(new MockContextKeyService(), ds.add(new TestStorageService()))),
				NullTelemetryService,
			));
		});

		test('pushes new result', () => {
			results.push(r);
			assert.deepStrictEqual(results.results, [r]);
		});

		test('serializes and re-hydrates', async () => {
			results.push(r);
			r.updateState(new TestId(['ctrlId', 'id-a', 'id-aa']).toString(), 't', TestResultState.Passed, 42);
			r.markComplete();
			await timeout(10); // allow persistImmediately async to happen

			results = ds.add(new TestResultService(
				new MockContextKeyService(),
				storage,
				ds.add(new TestProfileService(new MockContextKeyService(), ds.add(new TestStorageService()))),
				NullTelemetryService,
			));

			assert.strictEqual(0, results.results.length);
			await timeout(10); // allow load promise to resolve
			assert.strictEqual(1, results.results.length);

			const [rehydrated, actual] = results.getStateById(tests.root.id)!;
			const expected: any = { ...r.getStateById(tests.root.id)! };
			expected.item.uri = actual.item.uri;
			expected.item.children = undefined;
			expected.retired = true;
			delete expected.children;
			assert.deepStrictEqual(actual, { ...expected });
			assert.deepStrictEqual(rehydrated.counts, r.counts);
			assert.strictEqual(typeof rehydrated.completedAt, 'number');
		});

		test('clears results but keeps ongoing tests', async () => {
			results.push(r);
			r.markComplete();

			const r2 = results.push(new LiveTestResult(
				'',
				false,
				defaultOpts([]),
				insertCounter++,
				NullTelemetryService,
			));
			results.clear();

			assert.deepStrictEqual(results.results, [r2]);
		});

		test('keeps ongoing tests on top, restored order when done', async () => {
			results.push(r);
			const r2 = results.push(new LiveTestResult(
				'',
				false,
				defaultOpts([]),
				insertCounter++,
				NullTelemetryService,
			));

			assert.deepStrictEqual(results.results, [r2, r]);
			r2.markComplete();
			assert.deepStrictEqual(results.results, [r, r2]);
			r.markComplete();
			assert.deepStrictEqual(results.results, [r2, r]);
		});

		const makeHydrated = async (completedAt = 42, state = TestResultState.Passed) => new HydratedTestResult({
			asCanonicalUri(uri) {
				return uri;
			},
		} as IUriIdentityService, {
			completedAt,
			id: 'some-id',
			tasks: [{ id: 't', name: undefined, ctrlId: 'ctrl', hasCoverage: false }],
			name: 'hello world',
			request: defaultOpts([]),
			items: [{
				...(await getInitializedMainTestCollection()).getNodeById(new TestId(['ctrlId', 'id-a']).toString())!,
				tasks: [{ state, duration: 0, messages: [] }],
				computedState: state,
				ownComputedState: state,
			}]
		});

		test('pushes hydrated results', async () => {
			results.push(r);
			const hydrated = await makeHydrated();
			results.push(hydrated);
			assert.deepStrictEqual(results.results, [r, hydrated]);
		});

		test('inserts in correct order', async () => {
			results.push(r);
			const hydrated1 = await makeHydrated();
			results.push(hydrated1);
			assert.deepStrictEqual(results.results, [r, hydrated1]);
		});

		test('inserts in correct order 2', async () => {
			results.push(r);
			const hydrated1 = await makeHydrated();
			results.push(hydrated1);
			const hydrated2 = await makeHydrated(30);
			results.push(hydrated2);
			assert.deepStrictEqual(results.results, [r, hydrated1, hydrated2]);
		});
	});

	test('resultItemParents', function () {
		assert.deepStrictEqual([...resultItemParents(r, r.getStateById(new TestId(['ctrlId', 'id-a', 'id-aa']).toString())!)], [
			r.getStateById(new TestId(['ctrlId', 'id-a', 'id-aa']).toString()),
			r.getStateById(new TestId(['ctrlId', 'id-a']).toString()),
			r.getStateById(new TestId(['ctrlId']).toString()),
		]);

		assert.deepStrictEqual([...resultItemParents(r, r.getStateById(tests.root.id)!)], [
			r.getStateById(tests.root.id),
		]);
	});

	suite('output controller', () => {
		test('reads live output ranges', async () => {
			const ctrl = new TaskRawOutput();

			ctrl.append(VSBuffer.fromString('12345'));
			ctrl.append(VSBuffer.fromString('67890'));
			ctrl.append(VSBuffer.fromString('12345'));
			ctrl.append(VSBuffer.fromString('67890'));

			assert.deepStrictEqual(ctrl.getRange(0, 5), VSBuffer.fromString('12345'));
			assert.deepStrictEqual(ctrl.getRange(5, 5), VSBuffer.fromString('67890'));
			assert.deepStrictEqual(ctrl.getRange(7, 6), VSBuffer.fromString('890123'));
			assert.deepStrictEqual(ctrl.getRange(15, 5), VSBuffer.fromString('67890'));
			assert.deepStrictEqual(ctrl.getRange(15, 10), VSBuffer.fromString('67890'));
		});

		test('corrects offsets for marked ranges', async () => {
			const ctrl = new TaskRawOutput();

			const a1 = ctrl.append(VSBuffer.fromString('12345'), 1);
			const a2 = ctrl.append(VSBuffer.fromString('67890'), 1234);
			const a3 = ctrl.append(VSBuffer.fromString('with new line\r\n'), 4);

			assert.deepStrictEqual(ctrl.getRange(a1.offset, a1.length), VSBuffer.fromString('\x1b]633;SetMark;Id=s1;Hidden\x0712345\x1b]633;SetMark;Id=e1;Hidden\x07'));
			assert.deepStrictEqual(ctrl.getRange(a2.offset, a2.length), VSBuffer.fromString('\x1b]633;SetMark;Id=s1234;Hidden\x0767890\x1b]633;SetMark;Id=e1234;Hidden\x07'));
			assert.deepStrictEqual(ctrl.getRange(a3.offset, a3.length), VSBuffer.fromString('\x1b]633;SetMark;Id=s4;Hidden\x07with new line\x1b]633;SetMark;Id=e4;Hidden\x07\r\n'));
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/test/common/testResultStorage.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/test/common/testResultStorage.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { range } from '../../../../../base/common/arrays.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { NullLogService } from '../../../../../platform/log/common/log.js';
import { NullTelemetryService } from '../../../../../platform/telemetry/common/telemetryUtils.js';
import { IUriIdentityService } from '../../../../../platform/uriIdentity/common/uriIdentity.js';
import { ITestResult, LiveTestResult } from '../../common/testResult.js';
import { InMemoryResultStorage, RETAIN_MAX_RESULTS } from '../../common/testResultStorage.js';
import { TestRunProfileBitset } from '../../common/testTypes.js';
import { testStubs } from './testStubs.js';
import { TestStorageService } from '../../../../test/common/workbenchTestServices.js';

suite('Workbench - Test Result Storage', () => {
	let storage: InMemoryResultStorage;
	let ds: DisposableStore;

	const makeResult = (taskName = 't') => {
		const t = ds.add(new LiveTestResult(
			'',
			true,
			{ targets: [], group: TestRunProfileBitset.Run },
			1,
			NullTelemetryService,
		));

		t.addTask({ id: taskName, name: 'n', running: true, ctrlId: 'ctrlId' });
		const tests = ds.add(testStubs.nested());
		tests.expand(tests.root.id, Infinity);
		t.addTestChainToRun('ctrlId', [
			tests.root.toTestItem(),
			tests.root.children.get('id-a')!.toTestItem(),
			tests.root.children.get('id-a')!.children.get('id-aa')!.toTestItem(),
		]);

		t.markComplete();
		return t;
	};

	const assertStored = async (stored: ITestResult[]) =>
		assert.deepStrictEqual((await storage.read()).map(r => r.id), stored.map(s => s.id));

	setup(async () => {
		ds = new DisposableStore();
		storage = ds.add(new InMemoryResultStorage({
			asCanonicalUri(uri) {
				return uri;
			},
		} as IUriIdentityService, ds.add(new TestStorageService()), new NullLogService()));
	});

	teardown(() => ds.dispose());

	ensureNoDisposablesAreLeakedInTestSuite();

	test('stores a single result', async () => {
		const r = range(5).map(() => makeResult());
		await storage.persist(r);
		await assertStored(r);
	});

	test('deletes old results', async () => {
		const r = range(5).map(() => makeResult());
		await storage.persist(r);
		const r2 = [makeResult(), ...r.slice(0, 3)];
		await storage.persist(r2);
		await assertStored(r2);
	});

	test('limits stored results', async () => {
		const r = range(100).map(() => makeResult());
		await storage.persist(r);
		await assertStored(r.slice(0, RETAIN_MAX_RESULTS));
	});

	test('limits stored result by budget', async () => {
		const r = range(100).map(() => makeResult('a'.repeat(2048)));
		await storage.persist(r);
		const length = (await storage.read()).length;
		assert.strictEqual(true, length < 50);
	});

	test('always stores the min number of results', async () => {
		const r = range(20).map(() => makeResult('a'.repeat(1024 * 10)));
		await storage.persist(r);
		await assertStored(r.slice(0, 16));
	});

	test('takes into account existing stored bytes', async () => {
		const r = range(10).map(() => makeResult('a'.repeat(1024 * 10)));
		await storage.persist(r);
		await assertStored(r);

		const r2 = [...r, ...range(10).map(() => makeResult('a'.repeat(1024 * 10)))];
		await storage.persist(r2);
		await assertStored(r2.slice(0, 16));
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/test/common/testService.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/test/common/testService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { TestId } from '../../common/testId.js';
import { simplifyTestsToExecute } from '../../common/testService.js';
import { getInitializedMainTestCollection, makeSimpleStubTree } from './testStubs.js';

suite('Workbench - Test Service', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	suite('simplifyTestsToExecute', () => {
		const tree1 = {
			a: {
				b1: {
					c1: {
						d: undefined
					},
					c2: {
						d: undefined
					},
				},
				b2: undefined,
			}
		} as const;

		test('noop on single item', async () => {
			const c = await getInitializedMainTestCollection(makeSimpleStubTree(tree1));

			const t = simplifyTestsToExecute(c, [
				c.getNodeById(new TestId(['ctrlId', 'a', 'b1']).toString())!
			]);

			assert.deepStrictEqual(t.map(t => t.item.extId.toString()), [
				new TestId(['ctrlId', 'a', 'b1']).toString()
			]);
		});

		test('goes to common root 1', async () => {
			const c = await getInitializedMainTestCollection(makeSimpleStubTree(tree1));

			const t = simplifyTestsToExecute(c, [
				c.getNodeById(new TestId(['ctrlId', 'a', 'b1', 'c1', 'd']).toString())!,
				c.getNodeById(new TestId(['ctrlId', 'a', 'b1', 'c2']).toString())!,
			]);

			assert.deepStrictEqual(t.map(t => t.item.extId.toString()), [
				new TestId(['ctrlId', 'a', 'b1']).toString()
			]);
		});

		test('goes to common root 2', async () => {
			const c = await getInitializedMainTestCollection(makeSimpleStubTree(tree1));

			const t = simplifyTestsToExecute(c, [
				c.getNodeById(new TestId(['ctrlId', 'a', 'b1', 'c1']).toString())!,
				c.getNodeById(new TestId(['ctrlId', 'a', 'b1']).toString())!,
			]);

			assert.deepStrictEqual(t.map(t => t.item.extId.toString()), [
				new TestId(['ctrlId', 'a', 'b1']).toString()
			]);
		});

		test('goes to common root 3', async () => {
			const c = await getInitializedMainTestCollection(makeSimpleStubTree(tree1));

			const t = simplifyTestsToExecute(c, [
				c.getNodeById(new TestId(['ctrlId', 'a', 'b1', 'c1', 'd']).toString())!,
				c.getNodeById(new TestId(['ctrlId', 'a', 'b1', 'c2']).toString())!,
			]);

			assert.deepStrictEqual(t.map(t => t.item.extId.toString()), [
				new TestId(['ctrlId', 'a', 'b1']).toString()
			]);
		});

		test('goes to common root 4', async () => {
			const c = await getInitializedMainTestCollection(makeSimpleStubTree(tree1));

			const t = simplifyTestsToExecute(c, [
				c.getNodeById(new TestId(['ctrlId', 'a', 'b2']).toString())!,
				c.getNodeById(new TestId(['ctrlId', 'a', 'b1']).toString())!,
			]);

			assert.deepStrictEqual(t.map(t => t.item.extId.toString()), [
				new TestId(['ctrlId']).toString()
			]);
		});

		test('no-op divergent trees', async () => {
			const c = await getInitializedMainTestCollection(makeSimpleStubTree(tree1));

			const t = simplifyTestsToExecute(c, [
				c.getNodeById(new TestId(['ctrlId', 'a', 'b1', 'c2']).toString())!,
				c.getNodeById(new TestId(['ctrlId', 'a', 'b2']).toString())!,
			]);

			assert.deepStrictEqual(t.map(t => t.item.extId.toString()), [
				new TestId(['ctrlId', 'a', 'b1', 'c2']).toString(),
				new TestId(['ctrlId', 'a', 'b2']).toString(),
			]);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/test/common/testStubs.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/test/common/testStubs.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../../base/common/uri.js';
import { MainThreadTestCollection } from '../../common/mainThreadTestCollection.js';
import { ITestItem, TestsDiff } from '../../common/testTypes.js';
import { TestId } from '../../common/testId.js';
import { createTestItemChildren, ITestItemApi, ITestItemChildren, ITestItemLike, TestItemCollection, TestItemEventOp } from '../../common/testItemCollection.js';

export class TestTestItem implements ITestItemLike {
	private readonly props: ITestItem;
	private _canResolveChildren = false;

	public get tags() {
		return this.props.tags.map(id => ({ id }));
	}

	public set tags(value) {
		this.api.listener?.({ op: TestItemEventOp.SetTags, new: value, old: this.props.tags.map(t => ({ id: t })) });
		this.props.tags = value.map(tag => tag.id);
	}

	public get canResolveChildren() {
		return this._canResolveChildren;
	}

	public set canResolveChildren(value: boolean) {
		this._canResolveChildren = value;
		this.api.listener?.({ op: TestItemEventOp.UpdateCanResolveChildren, state: value });
	}

	public get parent() {
		return this.api.parent;
	}

	public get id() {
		return this._extId.localId;
	}

	public api: ITestItemApi<TestTestItem>;

	public children: ITestItemChildren<TestTestItem>;

	constructor(
		private readonly _extId: TestId,
		label: string,
		uri?: URI,
	) {
		this.api = { controllerId: this._extId.controllerId };
		this.children = createTestItemChildren(this.api, i => i.api, TestTestItem);
		this.props = {
			extId: _extId.toString(),
			busy: false,
			description: null,
			error: null,
			label,
			range: null,
			sortText: null,
			tags: [],
			uri,
		};
	}

	public get<K extends keyof ITestItem>(key: K): ITestItem[K] {
		return this.props[key];
	}

	public set<K extends keyof ITestItem>(key: K, value: ITestItem[K]) {
		this.props[key] = value;
		this.api.listener?.({ op: TestItemEventOp.SetProp, update: { [key]: value } });
	}

	public toTestItem(): ITestItem {
		const props = { ...this.props };
		props.extId = this._extId.toString();
		return props;
	}
}

export class TestTestCollection extends TestItemCollection<TestTestItem> {
	constructor(controllerId = 'ctrlId') {
		const root = new TestTestItem(new TestId([controllerId]), 'root');
		(root as TestTestItem & { _isRoot: boolean })._isRoot = true;

		super({
			controllerId,
			getApiFor: t => t.api,
			toITestItem: t => t.toTestItem(),
			getChildren: t => t.children,
			getDocumentVersion: () => undefined,
			root,
		});
	}

	public get currentDiff() {
		return this.diff;
	}

	public setDiff(diff: TestsDiff) {
		this.diff = diff;
	}
}

/**
 * Gets a main thread test collection initialized with the given set of
 * roots/stubs.
 */
export const getInitializedMainTestCollection = async (singleUse = testStubs.nested()) => {
	const c = new MainThreadTestCollection({ asCanonicalUri: u => u }, async (t, l) => singleUse.expand(t, l));
	await singleUse.expand(singleUse.root.id, Infinity);
	c.apply(singleUse.collectDiff());
	singleUse.dispose();
	return c;
};

type StubTreeIds = Readonly<{ [id: string]: StubTreeIds | undefined }>;

export const makeSimpleStubTree = (ids: StubTreeIds): TestTestCollection => {
	const collection = new TestTestCollection();

	const add = (parent: TestTestItem, children: StubTreeIds, path: readonly string[]) => {
		for (const id of Object.keys(children)) {
			const item = new TestTestItem(new TestId([...path, id]), id);
			parent.children.add(item);
			if (children[id]) {
				add(item, children[id]!, [...path, id]);
			}
		}
	};

	add(collection.root, ids, ['ctrlId']);

	return collection;
};

export const testStubs = {
	nested: (idPrefix = 'id-') => {
		const collection = new TestTestCollection();
		collection.resolveHandler = item => {
			if (item === undefined) {
				const a = new TestTestItem(new TestId(['ctrlId', 'id-a']), 'a', URI.file('/'));
				a.canResolveChildren = true;
				const b = new TestTestItem(new TestId(['ctrlId', 'id-b']), 'b', URI.file('/'));
				collection.root.children.add(a);
				collection.root.children.add(b);
			} else if (item.id === idPrefix + 'a') {
				item.children.add(new TestTestItem(new TestId(['ctrlId', 'id-a', 'id-aa']), 'aa', URI.file('/')));
				item.children.add(new TestTestItem(new TestId(['ctrlId', 'id-a', 'id-ab']), 'ab', URI.file('/')));
			}
		};

		return collection;
	},
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/themes/browser/themes.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/themes/browser/themes.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize, localize2 } from '../../../../nls.js';
import { KeyMod, KeyChord, KeyCode } from '../../../../base/common/keyCodes.js';
import { MenuRegistry, MenuId, Action2, registerAction2, ISubmenuItem } from '../../../../platform/actions/common/actions.js';
import { equalsIgnoreCase } from '../../../../base/common/strings.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { IWorkbenchThemeService, IWorkbenchTheme, ThemeSettingTarget, IWorkbenchColorTheme, IWorkbenchFileIconTheme, IWorkbenchProductIconTheme, ThemeSettings } from '../../../services/themes/common/workbenchThemeService.js';
import { IExtensionsWorkbenchService } from '../../extensions/common/extensions.js';
import { IExtensionGalleryService, IExtensionManagementService, IGalleryExtension } from '../../../../platform/extensionManagement/common/extensionManagement.js';
import { IColorRegistry, Extensions as ColorRegistryExtensions } from '../../../../platform/theme/common/colorRegistry.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { Color } from '../../../../base/common/color.js';
import { ColorScheme, isHighContrast } from '../../../../platform/theme/common/theme.js';
import { colorThemeSchemaId } from '../../../services/themes/common/colorThemeSchema.js';
import { isCancellationError, onUnexpectedError } from '../../../../base/common/errors.js';
import { IQuickInputButton, IQuickInputService, IQuickInputToggle, IQuickPick, IQuickPickItem, QuickPickInput } from '../../../../platform/quickinput/common/quickInput.js';
import { DEFAULT_PRODUCT_ICON_THEME_ID, ProductIconThemeData } from '../../../services/themes/browser/productIconThemeData.js';
import { ThrottledDelayer } from '../../../../base/common/async.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IProgressService, ProgressLocation } from '../../../../platform/progress/common/progress.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { Emitter } from '../../../../base/common/event.js';
import { IExtensionResourceLoaderService } from '../../../../platform/extensionResourceLoader/common/extensionResourceLoader.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { FileIconThemeData } from '../../../services/themes/browser/fileIconThemeData.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';

import { mainWindow } from '../../../../base/browser/window.js';
import { IPreferencesService } from '../../../services/preferences/common/preferences.js';
import { Toggle } from '../../../../base/browser/ui/toggle/toggle.js';
import { defaultToggleStyles } from '../../../../platform/theme/browser/defaultStyles.js';
import { DisposableStore, IDisposable } from '../../../../base/common/lifecycle.js';

export const manageExtensionIcon = registerIcon('theme-selection-manage-extension', Codicon.gear, localize('manageExtensionIcon', 'Icon for the \'Manage\' action in the theme selection quick pick.'));

type PickerResult = 'back' | 'selected' | 'cancelled';

enum ConfigureItem {
	BROWSE_GALLERY = 'marketplace',
	EXTENSIONS_VIEW = 'extensions',
	CUSTOM_TOP_ENTRY = 'customTopEntry'
}

class MarketplaceThemesPicker implements IDisposable {
	private readonly _installedExtensions: Promise<Set<string>>;
	private readonly _marketplaceExtensions: Set<string> = new Set();
	private readonly _marketplaceThemes: ThemeItem[] = [];

	private _searchOngoing: boolean = false;
	private _searchError: string | undefined = undefined;
	private readonly _onDidChange = new Emitter<void>();

	private _tokenSource: CancellationTokenSource | undefined;
	private readonly _queryDelayer = new ThrottledDelayer<void>(200);

	constructor(
		private readonly getMarketplaceColorThemes: (publisher: string, name: string, version: string) => Promise<IWorkbenchTheme[]>,
		private readonly marketplaceQuery: string,

		@IExtensionGalleryService private readonly extensionGalleryService: IExtensionGalleryService,
		@IExtensionManagementService private readonly extensionManagementService: IExtensionManagementService,
		@IQuickInputService private readonly quickInputService: IQuickInputService,
		@ILogService private readonly logService: ILogService,
		@IProgressService private readonly progressService: IProgressService,
		@IExtensionsWorkbenchService private readonly extensionsWorkbenchService: IExtensionsWorkbenchService,
		@IDialogService private readonly dialogService: IDialogService
	) {
		this._installedExtensions = extensionManagementService.getInstalled().then(installed => {
			const result = new Set<string>();
			for (const ext of installed) {
				result.add(ext.identifier.id);
			}
			return result;
		});
	}

	public get themes(): ThemeItem[] {
		return this._marketplaceThemes;
	}

	public get onDidChange() {
		return this._onDidChange.event;
	}

	public trigger(value: string) {
		if (this._tokenSource) {
			this._tokenSource.cancel();
			this._tokenSource = undefined;
		}
		this._queryDelayer.trigger(() => {
			this._tokenSource = new CancellationTokenSource();
			return this.doSearch(value, this._tokenSource.token);
		});
	}

	private async doSearch(value: string, token: CancellationToken): Promise<void> {
		this._searchOngoing = true;
		this._onDidChange.fire();
		try {
			const installedExtensions = await this._installedExtensions;

			const options = { text: `${this.marketplaceQuery} ${value}`, pageSize: 20 };
			const pager = await this.extensionGalleryService.query(options, token);
			for (let i = 0; i < pager.total && i < 1; i++) { // loading multiple pages is turned of for now to avoid flickering
				if (token.isCancellationRequested) {
					break;
				}

				const nThemes = this._marketplaceThemes.length;
				const gallery = i === 0 ? pager.firstPage : await pager.getPage(i, token);

				const promises: Promise<IWorkbenchTheme[]>[] = [];
				const promisesGalleries = [];
				for (let i = 0; i < gallery.length; i++) {
					if (token.isCancellationRequested) {
						break;
					}
					const ext = gallery[i];
					if (!installedExtensions.has(ext.identifier.id) && !this._marketplaceExtensions.has(ext.identifier.id)) {
						this._marketplaceExtensions.add(ext.identifier.id);
						promises.push(this.getMarketplaceColorThemes(ext.publisher, ext.name, ext.version));
						promisesGalleries.push(ext);
					}
				}
				const allThemes = await Promise.all(promises);
				for (let i = 0; i < allThemes.length; i++) {
					const ext = promisesGalleries[i];
					for (const theme of allThemes[i]) {
						this._marketplaceThemes.push({ id: theme.id, theme: theme, label: theme.label, description: `${ext.displayName} · ${ext.publisherDisplayName}`, galleryExtension: ext, buttons: [configureButton] });
					}
				}

				if (nThemes !== this._marketplaceThemes.length) {
					this._marketplaceThemes.sort((t1, t2) => t1.label.localeCompare(t2.label));
					this._onDidChange.fire();
				}
			}
		} catch (e) {
			if (!isCancellationError(e)) {
				this.logService.error(`Error while searching for themes:`, e);
				this._searchError = 'message' in e ? e.message : String(e);
			}
		} finally {
			this._searchOngoing = false;
			this._onDidChange.fire();
		}

	}

	public openQuickPick(value: string, currentTheme: IWorkbenchTheme | undefined, selectTheme: (theme: IWorkbenchTheme | undefined, applyTheme: boolean) => void): Promise<PickerResult> {
		let result: PickerResult | undefined = undefined;
		const disposables = new DisposableStore();
		return new Promise<PickerResult>((s, _) => {
			const quickpick = disposables.add(this.quickInputService.createQuickPick<ThemeItem>());
			quickpick.items = [];
			quickpick.sortByLabel = false;
			quickpick.matchOnDescription = true;
			quickpick.buttons = [this.quickInputService.backButton];
			quickpick.title = 'Marketplace Themes';
			quickpick.placeholder = localize('themes.selectMarketplaceTheme', "Type to Search More. Select to Install. Up/Down Keys to Preview");
			quickpick.canSelectMany = false;
			disposables.add(quickpick.onDidChangeValue(() => this.trigger(quickpick.value)));
			disposables.add(quickpick.onDidAccept(async _ => {
				const themeItem = quickpick.selectedItems[0];
				if (themeItem?.galleryExtension) {
					result = 'selected';
					quickpick.hide();
					const success = await this.installExtension(themeItem.galleryExtension);
					if (success) {
						selectTheme(themeItem.theme, true);
					} else {
						selectTheme(currentTheme, true);
					}
				}
			}));

			disposables.add(quickpick.onDidTriggerItemButton(e => {
				if (isItem(e.item)) {
					const extensionId = e.item.theme?.extensionData?.extensionId;
					if (extensionId) {
						this.extensionsWorkbenchService.openSearch(`@id:${extensionId}`);
					} else {
						this.extensionsWorkbenchService.openSearch(`${this.marketplaceQuery} ${quickpick.value}`);
					}
				}
			}));
			disposables.add(quickpick.onDidChangeActive(themes => {
				if (result === undefined) {
					selectTheme(themes[0]?.theme, false);
				}
			}));

			disposables.add(quickpick.onDidHide(() => {
				if (result === undefined) {
					selectTheme(currentTheme, true);
					result = 'cancelled';

				}
				s(result);
			}));

			disposables.add(quickpick.onDidTriggerButton(e => {
				if (e === this.quickInputService.backButton) {
					result = 'back';
					quickpick.hide();
				}
			}));

			disposables.add(this.onDidChange(() => {
				let items = this.themes;
				if (this._searchOngoing) {
					items = items.concat({ label: '$(loading~spin) Searching for themes...', id: undefined, alwaysShow: true });
				} else if (items.length === 0 && this._searchError) {
					items = [{ label: `$(error) ${localize('search.error', 'Error while searching for themes: {0}', this._searchError)}`, id: undefined, alwaysShow: true }];
				}
				const activeItemId = quickpick.activeItems[0]?.id;
				const newActiveItem = activeItemId ? items.find(i => isItem(i) && i.id === activeItemId) : undefined;

				quickpick.items = items;
				if (newActiveItem) {
					quickpick.activeItems = [newActiveItem as ThemeItem];
				}
			}));
			this.trigger(value);
			quickpick.show();
		}).finally(() => {
			disposables.dispose();
		});
	}

	private async installExtension(galleryExtension: IGalleryExtension) {
		this.extensionsWorkbenchService.openSearch(`@id:${galleryExtension.identifier.id}`);
		const result = await this.dialogService.confirm({
			message: localize('installExtension.confirm', "This will install extension '{0}' published by '{1}'. Do you want to continue?", galleryExtension.displayName, galleryExtension.publisherDisplayName),
			primaryButton: localize('installExtension.button.ok', "OK")
		});
		if (!result.confirmed) {
			return false;
		}
		try {
			await this.progressService.withProgress({
				location: ProgressLocation.Notification,
				title: localize('installing extensions', "Installing Extension {0}...", galleryExtension.displayName)
			}, async () => {
				await this.extensionManagementService.installFromGallery(galleryExtension, {
					// Setting this to false is how you get the extension to be synced with Settings Sync (if enabled).
					isMachineScoped: false,
				});
			});
			return true;
		} catch (e) {
			this.logService.error(`Problem installing extension ${galleryExtension.identifier.id}`, e);
			return false;
		}
	}


	public dispose() {
		if (this._tokenSource) {
			this._tokenSource.cancel();
			this._tokenSource = undefined;
		}
		this._queryDelayer.dispose();
		this._marketplaceExtensions.clear();
		this._marketplaceThemes.length = 0;
		this._onDidChange.dispose();
	}
}

interface InstalledThemesPickerOptions {
	readonly installMessage: string;
	readonly browseMessage?: string;
	readonly placeholderMessage: string;
	readonly marketplaceTag: string;
	readonly title?: string;
	readonly description?: string;
	readonly toggles?: IQuickInputToggle[];
	readonly onToggle?: (toggle: IQuickInputToggle, quickInput: IQuickPick<ThemeItem, { useSeparators: boolean }>) => Promise<void>;
}

class InstalledThemesPicker {
	constructor(
		private readonly options: InstalledThemesPickerOptions,
		private readonly setTheme: (theme: IWorkbenchTheme | undefined, settingsTarget: ThemeSettingTarget) => Promise<unknown>,
		private readonly getMarketplaceColorThemes: (publisher: string, name: string, version: string) => Promise<IWorkbenchTheme[]>,
		@IQuickInputService private readonly quickInputService: IQuickInputService,
		@IExtensionGalleryService private readonly extensionGalleryService: IExtensionGalleryService,
		@IExtensionsWorkbenchService private readonly extensionsWorkbenchService: IExtensionsWorkbenchService,
		@IExtensionResourceLoaderService private readonly extensionResourceLoaderService: IExtensionResourceLoaderService,
		@IInstantiationService private readonly instantiationService: IInstantiationService
	) {
	}

	public async openQuickPick(picks: QuickPickInput<ThemeItem>[], currentTheme: IWorkbenchTheme) {

		let marketplaceThemePicker: MarketplaceThemesPicker | undefined;
		if (this.extensionGalleryService.isEnabled()) {
			if (await this.extensionResourceLoaderService.supportsExtensionGalleryResources() && this.options.browseMessage) {
				marketplaceThemePicker = this.instantiationService.createInstance(MarketplaceThemesPicker, this.getMarketplaceColorThemes.bind(this), this.options.marketplaceTag);
				picks = [configurationEntry(this.options.browseMessage, ConfigureItem.BROWSE_GALLERY), ...picks];
			} else {
				picks = [...picks, { type: 'separator' }, configurationEntry(this.options.installMessage, ConfigureItem.EXTENSIONS_VIEW)];
			}
		}

		let selectThemeTimeout: number | undefined;

		const selectTheme = (theme: IWorkbenchTheme | undefined, applyTheme: boolean) => {
			if (selectThemeTimeout) {
				clearTimeout(selectThemeTimeout);
			}
			selectThemeTimeout = mainWindow.setTimeout(() => {
				selectThemeTimeout = undefined;
				const newTheme = (theme ?? currentTheme) as IWorkbenchTheme;
				this.setTheme(newTheme, applyTheme ? 'auto' : 'preview').then(undefined,
					err => {
						onUnexpectedError(err);
						this.setTheme(currentTheme, undefined);
					}
				);
			}, applyTheme ? 0 : 200);
		};

		const pickInstalledThemes = (activeItemId: string | undefined) => {
			const disposables = new DisposableStore();
			return new Promise<void>((s, _) => {
				let isCompleted = false;
				const autoFocusIndex = picks.findIndex(p => isItem(p) && p.id === activeItemId);
				const quickpick = disposables.add(this.quickInputService.createQuickPick<ThemeItem>({ useSeparators: true }));
				quickpick.items = picks;
				quickpick.title = this.options.title;
				quickpick.description = this.options.description;
				quickpick.placeholder = this.options.placeholderMessage;
				quickpick.activeItems = [picks[autoFocusIndex] as ThemeItem];
				quickpick.canSelectMany = false;
				quickpick.toggles = this.options.toggles;
				quickpick.toggles?.forEach(toggle => {
					disposables.add(toggle.onChange(() => this.options.onToggle?.(toggle, quickpick)));
				});
				quickpick.matchOnDescription = true;
				disposables.add(quickpick.onDidAccept(async _ => {
					isCompleted = true;
					const theme = quickpick.selectedItems[0];
					if (!theme || theme.configureItem) { // 'pick in marketplace' entry
						if (!theme || theme.configureItem === ConfigureItem.EXTENSIONS_VIEW) {
							this.extensionsWorkbenchService.openSearch(`${this.options.marketplaceTag} ${quickpick.value}`);
						} else if (theme.configureItem === ConfigureItem.BROWSE_GALLERY) {
							if (marketplaceThemePicker) {
								const res = await marketplaceThemePicker.openQuickPick(quickpick.value, currentTheme, selectTheme);
								if (res === 'back') {
									await pickInstalledThemes(undefined);
								}
							}
						}
					} else {
						selectTheme(theme.theme, true);
					}

					quickpick.hide();
					s();
				}));
				disposables.add(quickpick.onDidChangeActive(themes => selectTheme(themes[0]?.theme, false)));
				disposables.add(quickpick.onDidHide(() => {
					if (!isCompleted) {
						selectTheme(currentTheme, true);
						s();
					}
					quickpick.dispose();
				}));
				disposables.add(quickpick.onDidTriggerItemButton(e => {
					if (isItem(e.item)) {
						const extensionId = e.item.theme?.extensionData?.extensionId;
						if (extensionId) {
							this.extensionsWorkbenchService.openSearch(`@id:${extensionId}`);
						} else {
							this.extensionsWorkbenchService.openSearch(`${this.options.marketplaceTag} ${quickpick.value}`);
						}
					}
				}));
				quickpick.show();
			}).finally(() => {
				disposables.dispose();
			});
		};
		await pickInstalledThemes(currentTheme.id);

		marketplaceThemePicker?.dispose();

	}
}

const SelectColorThemeCommandId = 'workbench.action.selectTheme';

registerAction2(class extends Action2 {

	constructor() {
		super({
			id: SelectColorThemeCommandId,
			title: localize2('selectTheme.label', 'Color Theme'),
			category: Categories.Preferences,
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.KeyT)
			}
		});
	}

	private getTitle(colorScheme: ColorScheme | undefined): string {
		switch (colorScheme) {
			case ColorScheme.DARK: return localize('themes.selectTheme.darkScheme', "Select Color Theme for System Dark Mode");
			case ColorScheme.LIGHT: return localize('themes.selectTheme.lightScheme', "Select Color Theme for System Light Mode");
			case ColorScheme.HIGH_CONTRAST_DARK: return localize('themes.selectTheme.darkHC', "Select Color Theme for High Contrast Dark Mode");
			case ColorScheme.HIGH_CONTRAST_LIGHT: return localize('themes.selectTheme.lightHC', "Select Color Theme for High Contrast Light Mode");
			default:
				return localize('themes.selectTheme.default', "Select Color Theme (detect system color mode disabled)");
		}
	}

	override async run(accessor: ServicesAccessor) {
		const themeService = accessor.get(IWorkbenchThemeService);
		const preferencesService = accessor.get(IPreferencesService);

		const preferredColorScheme = themeService.getPreferredColorScheme();

		let modeConfigureToggle;
		if (preferredColorScheme) {
			modeConfigureToggle = new Toggle({
				title: localize('themes.configure.switchingEnabled', 'Detect system color mode enabled. Click to configure.'),
				icon: Codicon.colorMode,
				isChecked: false,
				...defaultToggleStyles
			});
		} else {
			modeConfigureToggle = new Toggle({
				title: localize('themes.configure.switchingDisabled', 'Detect system color mode disabled. Click to configure.'),
				icon: Codicon.colorMode,
				isChecked: false,
				...defaultToggleStyles
			});
		}

		const options = {
			installMessage: localize('installColorThemes', "Install Additional Color Themes..."),
			browseMessage: '$(plus) ' + localize('browseColorThemes', "Browse Additional Color Themes..."),
			placeholderMessage: this.getTitle(preferredColorScheme),
			marketplaceTag: 'category:themes',
			toggles: [modeConfigureToggle],
			onToggle: async (toggle, picker) => {
				picker.hide();
				await preferencesService.openSettings({ query: ThemeSettings.DETECT_COLOR_SCHEME });
			}
		} satisfies InstalledThemesPickerOptions;
		const setTheme = (theme: IWorkbenchTheme | undefined, settingsTarget: ThemeSettingTarget) => themeService.setColorTheme(theme as IWorkbenchColorTheme, settingsTarget);
		const getMarketplaceColorThemes = (publisher: string, name: string, version: string) => themeService.getMarketplaceColorThemes(publisher, name, version);

		const instantiationService = accessor.get(IInstantiationService);
		const picker = instantiationService.createInstance(InstalledThemesPicker, options, setTheme, getMarketplaceColorThemes);

		const themes = await themeService.getColorThemes();
		const currentTheme = themeService.getColorTheme();

		const lightEntries = toEntries(themes.filter(t => t.type === ColorScheme.LIGHT), localize('themes.category.light', "light themes"));
		const darkEntries = toEntries(themes.filter(t => t.type === ColorScheme.DARK), localize('themes.category.dark', "dark themes"));
		const hcEntries = toEntries(themes.filter(t => isHighContrast(t.type)), localize('themes.category.hc', "high contrast themes"));

		let picks;
		switch (preferredColorScheme) {
			case ColorScheme.DARK:
				picks = [...darkEntries, ...lightEntries, ...hcEntries];
				break;
			case ColorScheme.HIGH_CONTRAST_DARK:
			case ColorScheme.HIGH_CONTRAST_LIGHT:
				picks = [...hcEntries, ...lightEntries, ...darkEntries];
				break;
			case ColorScheme.LIGHT:
			default:
				picks = [...lightEntries, ...darkEntries, ...hcEntries];
				break;
		}
		await picker.openQuickPick(picks, currentTheme);

	}
});

const SelectFileIconThemeCommandId = 'workbench.action.selectIconTheme';

registerAction2(class extends Action2 {

	constructor() {
		super({
			id: SelectFileIconThemeCommandId,
			title: localize2('selectIconTheme.label', 'File Icon Theme'),
			category: Categories.Preferences,
			f1: true
		});
	}

	override async run(accessor: ServicesAccessor) {
		const themeService = accessor.get(IWorkbenchThemeService);

		const options = {
			installMessage: localize('installIconThemes', "Install Additional File Icon Themes..."),
			placeholderMessage: localize('themes.selectIconTheme', "Select File Icon Theme (Up/Down Keys to Preview)"),
			marketplaceTag: 'tag:icon-theme'
		};
		const setTheme = (theme: IWorkbenchTheme | undefined, settingsTarget: ThemeSettingTarget) => themeService.setFileIconTheme(theme as IWorkbenchFileIconTheme, settingsTarget);
		const getMarketplaceColorThemes = (publisher: string, name: string, version: string) => themeService.getMarketplaceFileIconThemes(publisher, name, version);

		const instantiationService = accessor.get(IInstantiationService);
		const picker = instantiationService.createInstance(InstalledThemesPicker, options, setTheme, getMarketplaceColorThemes);

		const picks: QuickPickInput<ThemeItem>[] = [
			{ type: 'separator', label: localize('fileIconThemeCategory', 'file icon themes') },
			{ id: '', theme: FileIconThemeData.noIconTheme, label: localize('noIconThemeLabel', 'None'), description: localize('noIconThemeDesc', 'Disable File Icons') },
			...toEntries(await themeService.getFileIconThemes()),
		];

		await picker.openQuickPick(picks, themeService.getFileIconTheme());
	}
});

const SelectProductIconThemeCommandId = 'workbench.action.selectProductIconTheme';

registerAction2(class extends Action2 {

	constructor() {
		super({
			id: SelectProductIconThemeCommandId,
			title: localize2('selectProductIconTheme.label', 'Product Icon Theme'),
			category: Categories.Preferences,
			f1: true
		});
	}

	override async run(accessor: ServicesAccessor) {
		const themeService = accessor.get(IWorkbenchThemeService);

		const options = {
			installMessage: localize('installProductIconThemes', "Install Additional Product Icon Themes..."),
			browseMessage: '$(plus) ' + localize('browseProductIconThemes', "Browse Additional Product Icon Themes..."),
			placeholderMessage: localize('themes.selectProductIconTheme', "Select Product Icon Theme (Up/Down Keys to Preview)"),
			marketplaceTag: 'tag:product-icon-theme'
		};
		const setTheme = (theme: IWorkbenchTheme | undefined, settingsTarget: ThemeSettingTarget) => themeService.setProductIconTheme(theme as IWorkbenchProductIconTheme, settingsTarget);
		const getMarketplaceColorThemes = (publisher: string, name: string, version: string) => themeService.getMarketplaceProductIconThemes(publisher, name, version);

		const instantiationService = accessor.get(IInstantiationService);
		const picker = instantiationService.createInstance(InstalledThemesPicker, options, setTheme, getMarketplaceColorThemes);

		const picks: QuickPickInput<ThemeItem>[] = [
			{ type: 'separator', label: localize('productIconThemeCategory', 'product icon themes') },
			{ id: DEFAULT_PRODUCT_ICON_THEME_ID, theme: ProductIconThemeData.defaultTheme, label: localize('defaultProductIconThemeLabel', 'Default') },
			...toEntries(await themeService.getProductIconThemes()),
		];

		await picker.openQuickPick(picks, themeService.getProductIconTheme());
	}
});

CommandsRegistry.registerCommand('workbench.action.previewColorTheme', async function (accessor: ServicesAccessor, extension: { publisher: string; name: string; version: string }, themeSettingsId?: string) {
	const themeService = accessor.get(IWorkbenchThemeService);

	let themes = findBuiltInThemes(await themeService.getColorThemes(), extension);
	if (themes.length === 0) {
		themes = await themeService.getMarketplaceColorThemes(extension.publisher, extension.name, extension.version);
	}
	for (const theme of themes) {
		if (!themeSettingsId || theme.settingsId === themeSettingsId) {
			await themeService.setColorTheme(theme, 'preview');
			return theme.settingsId;
		}
	}
	return undefined;
});

function findBuiltInThemes(themes: IWorkbenchColorTheme[], extension: { publisher: string; name: string }): IWorkbenchColorTheme[] {
	return themes.filter(({ extensionData }) => extensionData && extensionData.extensionIsBuiltin && equalsIgnoreCase(extensionData.extensionPublisher, extension.publisher) && equalsIgnoreCase(extensionData.extensionName, extension.name));
}

function configurationEntry(label: string, configureItem: ConfigureItem): QuickPickInput<ThemeItem> {
	return {
		id: undefined,
		label: label,
		alwaysShow: true,
		buttons: [configureButton],
		configureItem: configureItem
	};
}

interface ThemeItem extends IQuickPickItem {
	readonly id: string | undefined;
	readonly theme?: IWorkbenchTheme;
	readonly galleryExtension?: IGalleryExtension;
	readonly label: string;
	readonly description?: string;
	readonly alwaysShow?: boolean;
	readonly configureItem?: ConfigureItem;
}

function isItem(i: QuickPickInput<ThemeItem>): i is ThemeItem {
	// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
	return (<any>i)['type'] !== 'separator';
}

function toEntry(theme: IWorkbenchTheme): ThemeItem {
	const settingId = theme.settingsId ?? undefined;
	const item: ThemeItem = {
		id: theme.id,
		theme: theme,
		label: theme.label,
		description: theme.description || (theme.label === settingId ? undefined : settingId),
	};
	if (theme.extensionData) {
		item.buttons = [configureButton];
	}
	return item;
}

function toEntries(themes: Array<IWorkbenchTheme>, label?: string): QuickPickInput<ThemeItem>[] {
	const sorter = (t1: ThemeItem, t2: ThemeItem) => t1.label.localeCompare(t2.label);
	const entries: QuickPickInput<ThemeItem>[] = themes.map(toEntry).sort(sorter);
	if (entries.length > 0 && label) {
		entries.unshift({ type: 'separator', label });
	}
	return entries;
}

const configureButton: IQuickInputButton = {
	iconClass: ThemeIcon.asClassName(manageExtensionIcon),
	tooltip: localize('manage extension', "Manage Extension"),
};

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.action.generateColorTheme',
			title: localize2('generateColorTheme.label', 'Generate Color Theme From Current Settings'),
			category: Categories.Developer,
			f1: true
		});
	}

	override run(accessor: ServicesAccessor) {
		const themeService = accessor.get(IWorkbenchThemeService);

		const theme = themeService.getColorTheme();
		const colors = Registry.as<IColorRegistry>(ColorRegistryExtensions.ColorContribution).getColors();
		const colorIds = colors.filter(c => !c.deprecationMessage).map(c => c.id).sort();
		const resultingColors: { [key: string]: string | null } = {};
		const inherited: string[] = [];
		for (const colorId of colorIds) {
			const color = theme.getColor(colorId, false);
			if (color) {
				resultingColors[colorId] = Color.Format.CSS.formatHexA(color, true);
			} else {
				inherited.push(colorId);
			}
		}
		const nullDefaults = [];
		for (const id of inherited) {
			const color = theme.getColor(id);
			if (color) {
				resultingColors['__' + id] = Color.Format.CSS.formatHexA(color, true);
			} else {
				nullDefaults.push(id);
			}
		}
		for (const id of nullDefaults) {
			resultingColors['__' + id] = null;
		}
		let contents = JSON.stringify({
			'$schema': colorThemeSchemaId,
			type: theme.type,
			colors: resultingColors,
			tokenColors: theme.tokenColors.filter(t => !!t.scope)
		}, null, '\t');
		contents = contents.replace(/\"__/g, '//"');

		const editorService = accessor.get(IEditorService);
		return editorService.openEditor({ resource: undefined, contents, languageId: 'jsonc', options: { pinned: true } });
	}
});

const toggleLightDarkThemesCommandId = 'workbench.action.toggleLightDarkThemes';

registerAction2(class extends Action2 {

	constructor() {
		super({
			id: toggleLightDarkThemesCommandId,
			title: localize2('toggleLightDarkThemes.label', 'Toggle between Light/Dark Themes'),
			category: Categories.Preferences,
			f1: true,
		});
	}

	override async run(accessor: ServicesAccessor) {
		const themeService = accessor.get(IWorkbenchThemeService);
		const configurationService = accessor.get(IConfigurationService);
		const notificationService = accessor.get(INotificationService);
		const preferencesService = accessor.get(IPreferencesService);

		if (configurationService.getValue(ThemeSettings.DETECT_COLOR_SCHEME)) {
			const message = localize({ key: 'cannotToggle', comment: ['{0} is a setting name'] }, "Cannot toggle between light and dark themes when `{0}` is enabled in settings.", ThemeSettings.DETECT_COLOR_SCHEME);
			notificationService.prompt(Severity.Info, message, [
				{
					label: localize('goToSetting', "Open Settings"),
					run: () => {
						return preferencesService.openUserSettings({ query: ThemeSettings.DETECT_COLOR_SCHEME });
					}
				}
			]);
			return;
		}

		const currentTheme = themeService.getColorTheme();
		let newSettingsId: string = ThemeSettings.PREFERRED_DARK_THEME;
		switch (currentTheme.type) {
			case ColorScheme.LIGHT:
				newSettingsId = ThemeSettings.PREFERRED_DARK_THEME;
				break;
			case ColorScheme.DARK:
				newSettingsId = ThemeSettings.PREFERRED_LIGHT_THEME;
				break;
			case ColorScheme.HIGH_CONTRAST_LIGHT:
				newSettingsId = ThemeSettings.PREFERRED_HC_DARK_THEME;
				break;
			case ColorScheme.HIGH_CONTRAST_DARK:
				newSettingsId = ThemeSettings.PREFERRED_HC_LIGHT_THEME;
				break;
		}

		const themeSettingId: string = configurationService.getValue(newSettingsId);

		if (themeSettingId && typeof themeSettingId === 'string') {
			const theme = (await themeService.getColorThemes()).find(t => t.settingsId === themeSettingId);
			if (theme) {
				themeService.setColorTheme(theme.id, 'auto');
			}
		}
	}
});

const browseColorThemesInMarketplaceCommandId = 'workbench.action.browseColorThemesInMarketplace';

registerAction2(class extends Action2 {

	constructor() {
		super({
			id: browseColorThemesInMarketplaceCommandId,
			title: localize2('browseColorThemeInMarketPlace.label', 'Browse Color Themes in Marketplace'),
			category: Categories.Preferences,
			f1: true,
		});
	}

	override async run(accessor: ServicesAccessor) {
		const marketplaceTag = 'category:themes';
		const themeService = accessor.get(IWorkbenchThemeService);
		const extensionGalleryService = accessor.get(IExtensionGalleryService);
		const extensionResourceLoaderService = accessor.get(IExtensionResourceLoaderService);
		const extensionsWorkbenchService = accessor.get(IExtensionsWorkbenchService);
		const instantiationService = accessor.get(IInstantiationService);

		if (!extensionGalleryService.isEnabled()) {
			return;
		}

		if (!await extensionResourceLoaderService.supportsExtensionGalleryResources()) {
			await extensionsWorkbenchService.openSearch(marketplaceTag);
			return;
		}

		const currentTheme = themeService.getColorTheme();
		const getMarketplaceColorThemes = (publisher: string, name: string, version: string) => themeService.getMarketplaceColorThemes(publisher, name, version);

		let selectThemeTimeout: number | undefined;

		const selectTheme = (theme: IWorkbenchTheme | undefined, applyTheme: boolean) => {
			if (selectThemeTimeout) {
				clearTimeout(selectThemeTimeout);
			}
			selectThemeTimeout = mainWindow.setTimeout(() => {
				selectThemeTimeout = undefined;
				const newTheme = (theme ?? currentTheme) as IWorkbenchTheme;
				themeService.setColorTheme(newTheme as IWorkbenchColorTheme, applyTheme ? 'auto' : 'preview').then(undefined,
					err => {
						onUnexpectedError(err);
						themeService.setColorTheme(currentTheme, undefined);
					}
				);
			}, applyTheme ? 0 : 200);
		};

		const marketplaceThemePicker = instantiationService.createInstance(MarketplaceThemesPicker, getMarketplaceColorThemes, marketplaceTag);
		await marketplaceThemePicker.openQuickPick('', themeService.getColorTheme(), selectTheme).then(undefined, onUnexpectedError);
	}
});

const ThemesSubMenu = new MenuId('ThemesSubMenu');
MenuRegistry.appendMenuItem(MenuId.GlobalActivity, {
	title: localize('themes', "Themes"),
	submenu: ThemesSubMenu,
	group: '2_configuration',
	order: 7
} satisfies ISubmenuItem);
MenuRegistry.appendMenuItem(MenuId.MenubarPreferencesMenu, {
	title: localize({ key: 'miSelectTheme', comment: ['&& denotes a mnemonic'] }, "&&Themes"),
	submenu: ThemesSubMenu,
	group: '2_configuration',
	order: 7
} satisfies ISubmenuItem);

MenuRegistry.appendMenuItem(ThemesSubMenu, {
	command: {
		id: SelectColorThemeCommandId,
		title: localize('selectTheme.label', 'Color Theme')
	},
	order: 1
});

MenuRegistry.appendMenuItem(ThemesSubMenu, {
	command: {
		id: SelectFileIconThemeCommandId,
		title: localize('themes.selectIconTheme.label', "File Icon Theme")
	},
	order: 2
});

MenuRegistry.appendMenuItem(ThemesSubMenu, {
	command: {
		id: SelectProductIconThemeCommandId,
		title: localize('themes.selectProductIconTheme.label', "Product Icon Theme")
	},
	order: 3
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/themes/browser/themes.test.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/themes/browser/themes.test.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import type * as Parser from '@vscode/tree-sitter-wasm';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IWorkbenchThemeService, IWorkbenchColorTheme } from '../../../services/themes/common/workbenchThemeService.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { EditorResourceAccessor } from '../../../common/editor.js';
import { ITextMateTokenizationService } from '../../../services/textMate/browser/textMateTokenizationFeature.js';
import type { IGrammar, StateStack } from 'vscode-textmate';
import { TokenizationRegistry } from '../../../../editor/common/languages.js';
import { TokenMetadata } from '../../../../editor/common/encodedTokenAttributes.js';
import { ThemeRule, findMatchingThemeRule } from '../../../services/textMate/common/TMHelper.js';
import { Color } from '../../../../base/common/color.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { basename } from '../../../../base/common/resources.js';
import { Schemas } from '../../../../base/common/network.js';
import { splitLines } from '../../../../base/common/strings.js';
import { ColorThemeData, findMetadata } from '../../../services/themes/common/colorThemeData.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { Event } from '../../../../base/common/event.js';
import { Range } from '../../../../editor/common/core/range.js';
import { TreeSitterTree } from '../../../../editor/common/model/tokens/treeSitter/treeSitterTree.js';
import { TokenizationTextModelPart } from '../../../../editor/common/model/tokens/tokenizationTextModelPart.js';
import { TreeSitterSyntaxTokenBackend } from '../../../../editor/common/model/tokens/treeSitter/treeSitterSyntaxTokenBackend.js';
import { TreeSitterTokenizationImpl } from '../../../../editor/common/model/tokens/treeSitter/treeSitterTokenizationImpl.js';
import { waitForState } from '../../../../base/common/observable.js';

interface IToken {
	c: string; // token
	t: string; // space separated scopes, most general to most specific
	r: { [themeName: string]: string | undefined }; // token type: color
}

interface IThemedToken {
	text: string;
	color: Color | null;
}

interface IThemesResult {
	[themeName: string]: {
		document: ThemeDocument;
		tokens: IThemedToken[];
	};
}

class ThemeDocument {
	private readonly _theme: IWorkbenchColorTheme;
	private readonly _cache: { [scopes: string]: ThemeRule };
	private readonly _defaultColor: string;

	constructor(theme: IWorkbenchColorTheme) {
		this._theme = theme;
		this._cache = Object.create(null);
		this._defaultColor = '#000000';
		for (let i = 0, len = this._theme.tokenColors.length; i < len; i++) {
			const rule = this._theme.tokenColors[i];
			if (!rule.scope) {
				this._defaultColor = rule.settings.foreground!;
			}
		}
	}

	private _generateExplanation(selector: string, color: Color): string {
		return `${selector}: ${Color.Format.CSS.formatHexA(color, true).toUpperCase()}`;
	}

	public explainTokenColor(scopes: string, color: Color): string {

		const matchingRule = this._findMatchingThemeRule(scopes);
		if (!matchingRule) {
			const expected = Color.fromHex(this._defaultColor);
			// No matching rule
			if (!color.equals(expected)) {
				throw new Error(`[${this._theme.label}]: Unexpected color ${Color.Format.CSS.formatHexA(color)} for ${scopes}. Expected default ${Color.Format.CSS.formatHexA(expected)}`);
			}
			return this._generateExplanation('default', color);
		}

		const expected = Color.fromHex(matchingRule.settings.foreground!);
		if (!color.equals(expected)) {
			throw new Error(`[${this._theme.label}]: Unexpected color ${Color.Format.CSS.formatHexA(color)} for ${scopes}. Expected ${Color.Format.CSS.formatHexA(expected)} coming in from ${matchingRule.rawSelector}`);
		}
		return this._generateExplanation(matchingRule.rawSelector, color);
	}

	private _findMatchingThemeRule(scopes: string): ThemeRule {
		if (!this._cache[scopes]) {
			this._cache[scopes] = findMatchingThemeRule(this._theme, scopes.split(' '))!;
		}
		return this._cache[scopes];
	}
}

class Snapper {

	constructor(
		@ILanguageService private readonly languageService: ILanguageService,
		@IWorkbenchThemeService private readonly themeService: IWorkbenchThemeService,
		@ITextMateTokenizationService private readonly textMateService: ITextMateTokenizationService,
		@IModelService private readonly modelService: IModelService,
	) {
	}

	private _themedTokenize(grammar: IGrammar, lines: string[]): IThemedToken[] {
		const colorMap = TokenizationRegistry.getColorMap();
		let state: StateStack | null = null;
		const result: IThemedToken[] = [];
		let resultLen = 0;
		for (let i = 0, len = lines.length; i < len; i++) {
			const line = lines[i];

			const tokenizationResult = grammar.tokenizeLine2(line, state);

			for (let j = 0, lenJ = tokenizationResult.tokens.length >>> 1; j < lenJ; j++) {
				const startOffset = tokenizationResult.tokens[(j << 1)];
				const metadata = tokenizationResult.tokens[(j << 1) + 1];
				const endOffset = j + 1 < lenJ ? tokenizationResult.tokens[((j + 1) << 1)] : line.length;
				const tokenText = line.substring(startOffset, endOffset);

				const color = TokenMetadata.getForeground(metadata);

				result[resultLen++] = {
					text: tokenText,
					color: colorMap![color]
				};
			}

			state = tokenizationResult.ruleStack;
		}

		return result;
	}

	private _themedTokenizeTreeSitter(tokens: IToken[], languageId: string): IThemedToken[] {
		const colorMap = TokenizationRegistry.getColorMap();
		const result: IThemedToken[] = Array(tokens.length);
		const colorThemeData = this.themeService.getColorTheme() as ColorThemeData;
		for (let i = 0, len = tokens.length; i < len; i++) {
			const token = tokens[i];
			const scopes = token.t.split(' ');
			const metadata = findMetadata(colorThemeData, scopes, this.languageService.languageIdCodec.encodeLanguageId(languageId), false);
			const color = TokenMetadata.getForeground(metadata);

			result[i] = {
				text: token.c,
				color: colorMap![color]
			};
		}

		return result;
	}

	private _tokenize(grammar: IGrammar, lines: string[]): IToken[] {
		let state: StateStack | null = null;
		const result: IToken[] = [];
		let resultLen = 0;
		for (let i = 0, len = lines.length; i < len; i++) {
			const line = lines[i];

			const tokenizationResult = grammar.tokenizeLine(line, state);
			let lastScopes: string | null = null;

			for (let j = 0, lenJ = tokenizationResult.tokens.length; j < lenJ; j++) {
				const token = tokenizationResult.tokens[j];
				const tokenText = line.substring(token.startIndex, token.endIndex);
				const tokenScopes = token.scopes.join(' ');

				if (lastScopes === tokenScopes) {
					result[resultLen - 1].c += tokenText;
				} else {
					lastScopes = tokenScopes;
					result[resultLen++] = {
						c: tokenText,
						t: tokenScopes,
						r: {
							dark_plus: undefined,
							light_plus: undefined,
							dark_vs: undefined,
							light_vs: undefined,
							hc_black: undefined,
						}
					};
				}
			}

			state = tokenizationResult.ruleStack;
		}
		return result;
	}

	private async _getThemesResult(grammar: IGrammar, lines: string[]): Promise<IThemesResult> {
		const currentTheme = this.themeService.getColorTheme();

		const getThemeName = (id: string) => {
			const part = 'vscode-theme-defaults-themes-';
			const startIdx = id.indexOf(part);
			if (startIdx !== -1) {
				return id.substring(startIdx + part.length, id.length - 5);
			}
			return undefined;
		};

		const result: IThemesResult = {};

		const themeDatas = await this.themeService.getColorThemes();
		const defaultThemes = themeDatas.filter(themeData => !!getThemeName(themeData.id));
		for (const defaultTheme of defaultThemes) {
			const themeId = defaultTheme.id;
			const success = await this.themeService.setColorTheme(themeId, undefined);
			if (success) {
				const themeName = getThemeName(themeId);
				result[themeName!] = {
					document: new ThemeDocument(this.themeService.getColorTheme()),
					tokens: this._themedTokenize(grammar, lines)
				};
			}
		}
		await this.themeService.setColorTheme(currentTheme.id, undefined);
		return result;
	}

	private async _getTreeSitterThemesResult(tokens: IToken[], languageId: string): Promise<IThemesResult> {
		const currentTheme = this.themeService.getColorTheme();

		const getThemeName = (id: string) => {
			const part = 'vscode-theme-defaults-themes-';
			const startIdx = id.indexOf(part);
			if (startIdx !== -1) {
				return id.substring(startIdx + part.length, id.length - 5);
			}
			return undefined;
		};

		const result: IThemesResult = {};

		const themeDatas = await this.themeService.getColorThemes();
		const defaultThemes = themeDatas.filter(themeData => !!getThemeName(themeData.id));
		for (const defaultTheme of defaultThemes) {
			const themeId = defaultTheme.id;
			const success = await this.themeService.setColorTheme(themeId, undefined);
			if (success) {
				const themeName = getThemeName(themeId);
				result[themeName!] = {
					document: new ThemeDocument(this.themeService.getColorTheme()),
					tokens: this._themedTokenizeTreeSitter(tokens, languageId)
				};
			}
		}
		await this.themeService.setColorTheme(currentTheme.id, undefined);
		return result;
	}


	private _enrichResult(result: IToken[], themesResult: IThemesResult): void {
		const index: { [themeName: string]: number } = {};
		const themeNames = Object.keys(themesResult);
		for (const themeName of themeNames) {
			index[themeName] = 0;
		}

		for (let i = 0, len = result.length; i < len; i++) {
			const token = result[i];

			for (const themeName of themeNames) {
				const themedToken = themesResult[themeName].tokens[index[themeName]];

				themedToken.text = themedToken.text.substr(token.c.length);
				if (themedToken.color) {
					token.r[themeName] = themesResult[themeName].document.explainTokenColor(token.t, themedToken.color);
				}
				if (themedToken.text.length === 0) {
					index[themeName]++;
				}
			}
		}
	}

	private _moveInjectionCursorToRange(cursor: Parser.TreeCursor, injectionRange: { startIndex: number; endIndex: number }): void {
		let continueCursor = cursor.gotoFirstChild();
		// Get into the first "real" child node, as the root nodes can extend outside the range.
		while (((cursor.startIndex < injectionRange.startIndex) || (cursor.endIndex > injectionRange.endIndex)) && continueCursor) {
			if (cursor.endIndex < injectionRange.startIndex) {
				continueCursor = cursor.gotoNextSibling();
			} else {
				continueCursor = cursor.gotoFirstChild();
			}
		}
	}

	private async _treeSitterTokenize(treeSitterTree: TreeSitterTree, tokenizationModel: TreeSitterTokenizationImpl, languageId: string): Promise<IToken[]> {
		const tree = await waitForState(treeSitterTree.tree);
		if (!tree) {
			return [];
		}
		const cursor = tree.walk();
		cursor.gotoFirstChild();
		let cursorResult: boolean = true;
		const tokens: IToken[] = [];

		const cursors: { cursor: Parser.TreeCursor; languageId: string; startOffset: number; endOffset: number }[] = [{ cursor, languageId, startOffset: 0, endOffset: treeSitterTree.textModel.getValueLength() }];
		do {
			const current = cursors[cursors.length - 1];
			const currentCursor = current.cursor;
			const currentLanguageId = current.languageId;
			const isOutsideRange: boolean = (currentCursor.currentNode.endIndex > current.endOffset);

			if (!isOutsideRange && (currentCursor.currentNode.childCount === 0)) {
				const range = new Range(currentCursor.currentNode.startPosition.row + 1, currentCursor.currentNode.startPosition.column + 1, currentCursor.currentNode.endPosition.row + 1, currentCursor.currentNode.endPosition.column + 1);
				const injection = treeSitterTree.getInjectionTrees(currentCursor.currentNode.startIndex, currentLanguageId);
				const treeSitterRange = injection?.ranges!.find(r => r.startIndex <= currentCursor.currentNode.startIndex && r.endIndex >= currentCursor.currentNode.endIndex);

				const injectionTree = injection?.tree.get();
				const injectionLanguageId = injection?.languageId;
				if (injectionTree && injectionLanguageId && treeSitterRange && (treeSitterRange.startIndex === currentCursor.currentNode.startIndex)) {
					const injectionCursor = injectionTree.walk();
					this._moveInjectionCursorToRange(injectionCursor, treeSitterRange);
					cursors.push({ cursor: injectionCursor, languageId: injectionLanguageId, startOffset: treeSitterRange.startIndex, endOffset: treeSitterRange.endIndex });
					while ((currentCursor.endIndex <= treeSitterRange.endIndex) && (currentCursor.gotoNextSibling() || currentCursor.gotoParent())) { }
				} else {
					const capture = tokenizationModel.captureAtRangeTree(range);
					tokens.push({
						c: currentCursor.currentNode.text.replace(/\r/g, ''),
						t: capture?.map(cap => cap.name).join(' ') ?? '',
						r: {
							dark_plus: undefined,
							light_plus: undefined,
							dark_vs: undefined,
							light_vs: undefined,
							hc_black: undefined,
						}
					});
					while (!(cursorResult = currentCursor.gotoNextSibling())) {
						if (!(cursorResult = currentCursor.gotoParent())) {
							break;
						}
					}
				}

			} else {
				cursorResult = currentCursor.gotoFirstChild();
			}
			if (cursors.length > 1 && ((!cursorResult && currentCursor === cursors[cursors.length - 1].cursor) || isOutsideRange)) {
				current.cursor.delete();
				cursors.pop();
				cursorResult = true;
			}
		} while (cursorResult);
		cursor.delete();
		return tokens;
	}

	public captureSyntaxTokens(fileName: string, content: string): Promise<IToken[]> {
		const languageId = this.languageService.guessLanguageIdByFilepathOrFirstLine(URI.file(fileName));
		return this.textMateService.createTokenizer(languageId!).then((grammar) => {
			if (!grammar) {
				return [];
			}
			const lines = splitLines(content);

			const result = this._tokenize(grammar, lines);
			return this._getThemesResult(grammar, lines).then((themesResult) => {
				this._enrichResult(result, themesResult);
				return result.filter(t => t.c.length > 0);
			});
		});
	}

	public async captureTreeSitterSyntaxTokens(resource: URI, content: string): Promise<IToken[]> {
		const languageId = this.languageService.guessLanguageIdByFilepathOrFirstLine(resource);
		if (!languageId) {
			return [];
		}

		const model = this.modelService.getModel(resource) ?? this.modelService.createModel(content, { languageId, onDidChange: Event.None }, resource);
		const tokenizationPart = (model.tokenization as TokenizationTextModelPart).tokens.get();
		if (!(tokenizationPart instanceof TreeSitterSyntaxTokenBackend)) {
			return [];
		}

		const treeObs = tokenizationPart.tree;
		const tokenizationImplObs = tokenizationPart.tokenizationImpl;
		const treeSitterTree = treeObs.get() ?? await waitForState(treeObs);
		const tokenizationImpl = tokenizationImplObs.get() ?? await waitForState(tokenizationImplObs);
		// TODO: injections
		if (!treeSitterTree) {
			return [];
		}
		const result = (await this._treeSitterTokenize(treeSitterTree, tokenizationImpl, languageId)).filter(t => t.c.length > 0);
		const themeTokens = await this._getTreeSitterThemesResult(result, languageId);
		this._enrichResult(result, themeTokens);
		return result;

	}
}

async function captureTokens(accessor: ServicesAccessor, resource: URI | undefined, treeSitter: boolean = false) {
	const process = (resource: URI) => {
		const fileService = accessor.get(IFileService);
		const fileName = basename(resource);
		const snapper = accessor.get(IInstantiationService).createInstance(Snapper);

		return fileService.readFile(resource).then(content => {
			if (treeSitter) {
				return snapper.captureTreeSitterSyntaxTokens(resource, content.value.toString());
			} else {
				return snapper.captureSyntaxTokens(fileName, content.value.toString());
			}
		});
	};

	if (!resource) {
		const editorService = accessor.get(IEditorService);
		const file = editorService.activeEditor ? EditorResourceAccessor.getCanonicalUri(editorService.activeEditor, { filterByScheme: Schemas.file }) : null;
		if (file) {
			process(file).then(result => {
				console.log(result);
			});
		} else {
			console.log('No file editor active');
		}
	} else {
		const processResult = await process(resource);
		return processResult;
	}
	return undefined;

}

CommandsRegistry.registerCommand('_workbench.captureSyntaxTokens', function (accessor: ServicesAccessor, resource: URI) {
	return captureTokens(accessor, resource);
});

CommandsRegistry.registerCommand('_workbench.captureTreeSitterSyntaxTokens', function (accessor: ServicesAccessor, resource?: URI) {
	// If no resource is provided, use the active editor's resource
	// This is useful for testing the command
	if (!resource) {
		const editorService = accessor.get(IEditorService);
		resource = editorService.activeEditor?.resource;
	}
	return captureTokens(accessor, resource, true);
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/themes/test/node/colorRegistry.releaseTest.ts]---
Location: vscode-main/src/vs/workbench/contrib/themes/test/node/colorRegistry.releaseTest.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs';
import { Registry } from '../../../../../platform/registry/common/platform.js';
import { IColorRegistry, Extensions, ColorContribution, asCssVariableName } from '../../../../../platform/theme/common/colorRegistry.js';
import { ISizeRegistry, Extensions as SizeExtensions, asCssVariableName as asSizeCssVariableName } from '../../../../../platform/theme/common/sizeUtils.js';
import { asTextOrError } from '../../../../../platform/request/common/request.js';
import * as pfs from '../../../../../base/node/pfs.js';
import * as path from '../../../../../base/common/path.js';
import assert from 'assert';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { RequestService } from '../../../../../platform/request/node/requestService.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
// eslint-disable-next-line local/code-import-patterns
import '../../../../workbench.desktop.main.js';
import { NullLogService } from '../../../../../platform/log/common/log.js';
import { mock } from '../../../../../base/test/common/mock.js';
import { INativeEnvironmentService } from '../../../../../platform/environment/common/environment.js';
import { FileAccess } from '../../../../../base/common/network.js';

interface ColorInfo {
	description: string;
	offset: number;
	length: number;
}

interface DescriptionDiff {
	docDescription: string;
	specDescription: string;
}

export const experimental: string[] = []; // 'settings.modifiedItemForeground', 'editorUnnecessary.foreground' ];


const knwonVariablesFileName = 'vscode-known-variables.json';

suite('Color Registry', function () {

	test(`update colors in ${knwonVariablesFileName}`, async function () {
		const varFilePath = FileAccess.asFileUri(`vs/../../build/lib/stylelint/${knwonVariablesFileName}`).fsPath;
		const content = (await fs.promises.readFile(varFilePath)).toString();

		const variablesInfo = JSON.parse(content);

		const colorsArray = variablesInfo.colors as string[];

		assert.ok(colorsArray && colorsArray.length > 0, '${knwonVariablesFileName} contains no color descriptions');

		const colors = new Set(colorsArray);

		const updatedColors = [];
		const missing = [];
		const themingRegistry = Registry.as<IColorRegistry>(Extensions.ColorContribution);
		for (const color of themingRegistry.getColors()) {
			const id = asCssVariableName(color.id);

			if (!colors.has(id)) {
				if (!color.deprecationMessage) {
					missing.push(id);
				}
			} else {
				colors.delete(id);
			}
			updatedColors.push(id);
		}

		const superfluousKeys = [...colors.keys()];

		let errorText = '';
		if (missing.length > 0) {
			errorText += `\n\Adding the following colors:\n\n${JSON.stringify(missing, undefined, '\t')}\n`;
		}
		if (superfluousKeys.length > 0) {
			errorText += `\n\Removing the following colors:\n\n${superfluousKeys.join('\n')}\n`;
		}

		const sizesArray = variablesInfo.sizes as string[] || [];
		const sizes = new Set(sizesArray);
		const updatedSizes = [];
		const missingSizes = [];
		const sizeRegistry = Registry.as<ISizeRegistry>(SizeExtensions.SizeContribution);
		for (const size of sizeRegistry.getSizes()) {
			const id = asSizeCssVariableName(size.id);

			if (!sizes.has(id)) {
				if (!size.deprecationMessage) {
					missingSizes.push(id);
				}
			} else {
				sizes.delete(id);
			}
			updatedSizes.push(id);
		}

		const superfluousSizes = [...sizes.keys()];

		if (missingSizes.length > 0) {
			errorText += `\n\Adding the following sizes:\n\n${JSON.stringify(missingSizes, undefined, '\t')}\n`;
		}
		if (superfluousSizes.length > 0) {
			errorText += `\n\Removing the following sizes:\n\n${superfluousSizes.join('\n')}\n`;
		}

		if (errorText.length > 0) {
			updatedColors.sort();
			variablesInfo.colors = updatedColors;
			updatedSizes.sort();
			variablesInfo.sizes = updatedSizes;
			await pfs.Promises.writeFile(varFilePath, JSON.stringify(variablesInfo, undefined, '\t'));

			assert.fail(`\n\Updating ${path.normalize(varFilePath)}.\nPlease verify and commit.\n\n${errorText}\n`);
		}
	});

	test('all colors listed in theme-color.md', async function () {
		// avoid importing the TestEnvironmentService as it brings in a duplicate registration of the file editor input factory.
		const environmentService = new class extends mock<INativeEnvironmentService>() { override args = { _: [] }; };

		const docUrl = 'https://raw.githubusercontent.com/microsoft/vscode-docs/vnext/api/references/theme-color.md';

		const reqContext = await new RequestService('local', new TestConfigurationService(), environmentService, new NullLogService()).request({ url: docUrl }, CancellationToken.None);
		const content = (await asTextOrError(reqContext))!;

		const expression = /-\s*\`([\w\.]+)\`: (.*)/g;

		let m: RegExpExecArray | null;
		const colorsInDoc: { [id: string]: ColorInfo } = Object.create(null);
		let nColorsInDoc = 0;
		while (m = expression.exec(content)) {
			colorsInDoc[m[1]] = { description: m[2], offset: m.index, length: m.length };
			nColorsInDoc++;
		}
		assert.ok(nColorsInDoc > 0, 'theme-color.md contains to color descriptions');

		const missing = Object.create(null);
		const descriptionDiffs: { [id: string]: DescriptionDiff } = Object.create(null);

		const themingRegistry = Registry.as<IColorRegistry>(Extensions.ColorContribution);
		for (const color of themingRegistry.getColors()) {
			if (!colorsInDoc[color.id]) {
				if (!color.deprecationMessage) {
					missing[color.id] = getDescription(color);
				}
			} else {
				const docDescription = colorsInDoc[color.id].description;
				const specDescription = getDescription(color);
				if (docDescription !== specDescription) {
					descriptionDiffs[color.id] = { docDescription, specDescription };
				}
				delete colorsInDoc[color.id];
			}
		}
		const colorsInExtensions = await getColorsFromExtension();
		for (const colorId in colorsInExtensions) {
			if (!colorsInDoc[colorId]) {
				missing[colorId] = colorsInExtensions[colorId];
			} else {
				delete colorsInDoc[colorId];
			}
		}
		for (const colorId of experimental) {
			if (missing[colorId]) {
				delete missing[colorId];
			}
			if (colorsInDoc[colorId]) {
				assert.fail(`Color ${colorId} found in doc but marked experimental. Please remove from experimental list.`);
			}
		}
		const superfluousKeys = Object.keys(colorsInDoc);
		const undocumentedKeys = Object.keys(missing).map(k => `\`${k}\`: ${missing[k]}`);


		let errorText = '';
		if (undocumentedKeys.length > 0) {
			errorText += `\n\nAdd the following colors:\n\n${undocumentedKeys.join('\n')}\n`;
		}
		if (superfluousKeys.length > 0) {
			errorText += `\n\Remove the following colors:\n\n${superfluousKeys.join('\n')}\n`;
		}

		if (errorText.length > 0) {
			assert.fail(`\n\nOpen https://github.dev/microsoft/vscode-docs/blob/vnext/api/references/theme-color.md#50${errorText}`);
		}
	});
});

function getDescription(color: ColorContribution) {
	let specDescription = color.description;
	if (color.deprecationMessage) {
		specDescription = specDescription + ' ' + color.deprecationMessage;
	}
	return specDescription;
}

async function getColorsFromExtension(): Promise<{ [id: string]: string }> {
	const extPath = FileAccess.asFileUri('vs/../../extensions').fsPath;
	const extFolders = await pfs.Promises.readDirsInDir(extPath);
	const result: { [id: string]: string } = Object.create(null);
	for (const folder of extFolders) {
		try {
			const packageJSON = JSON.parse((await fs.promises.readFile(path.join(extPath, folder, 'package.json'))).toString());
			const contributes = packageJSON['contributes'];
			if (contributes) {
				const colors = contributes['colors'];
				if (colors) {
					for (const color of colors) {
						const colorId = color['id'];
						if (colorId) {
							result[colorId] = colorId['description'];
						}
					}
				}
			}
		} catch (e) {
			// ignore
		}

	}
	return result;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/themes/test/node/colorRegistryExport.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/themes/test/node/colorRegistryExport.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Color } from '../../../../../base/common/color.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Registry } from '../../../../../platform/registry/common/platform.js';
import { Extensions, IColorRegistry } from '../../../../../platform/theme/common/colorRegistry.js';

suite('ColorRegistry', () => {
	if (process.env.VSCODE_COLOR_REGISTRY_EXPORT) {
		test('exports', () => {
			const themingRegistry = Registry.as<IColorRegistry>(Extensions.ColorContribution);
			const colors = themingRegistry.getColors();
			const replacer = (_key: string, value: unknown) =>
				value instanceof Color ? Color.Format.CSS.formatHexA(value) : value;
			console.log(`#colors:${JSON.stringify(colors, replacer)}\n`);
		});
	}

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/timeline/browser/timeline.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/timeline/browser/timeline.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IViewsRegistry, IViewDescriptor, Extensions as ViewExtensions } from '../../../common/views.js';
import { VIEW_CONTAINER } from '../../files/browser/explorerViewlet.js';
import { ITimelineService, TimelinePaneId } from '../common/timeline.js';
import { TimelineHasProviderContext, TimelineService } from '../common/timelineService.js';
import { TimelinePane } from './timelinePane.js';
import { IConfigurationRegistry, Extensions as ConfigurationExtensions } from '../../../../platform/configuration/common/configurationRegistry.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { ISubmenuItem, MenuId, MenuRegistry } from '../../../../platform/actions/common/actions.js';
import { ICommandHandler, CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { ExplorerFolderContext } from '../../files/common/files.js';
import { ResourceContextKey } from '../../../common/contextkeys.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';
import { ILocalizedString } from '../../../../platform/action/common/action.js';
import { URI } from '../../../../base/common/uri.js';

const timelineViewIcon = registerIcon('timeline-view-icon', Codicon.history, localize('timelineViewIcon', 'View icon of the timeline view.'));
const timelineOpenIcon = registerIcon('timeline-open', Codicon.history, localize('timelineOpenIcon', 'Icon for the open timeline action.'));

export class TimelinePaneDescriptor implements IViewDescriptor {
	readonly id = TimelinePaneId;
	readonly name: ILocalizedString = TimelinePane.TITLE;
	readonly containerIcon = timelineViewIcon;
	readonly ctorDescriptor = new SyncDescriptor(TimelinePane);
	readonly order = 2;
	readonly weight = 30;
	readonly collapsed = true;
	readonly canToggleVisibility = true;
	readonly hideByDefault = false;
	readonly canMoveView = true;
	readonly when = TimelineHasProviderContext;

	focusCommand = { id: 'timeline.focus' };
}

// Configuration
const configurationRegistry = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration);
configurationRegistry.registerConfiguration({
	id: 'timeline',
	order: 1001,
	title: localize('timelineConfigurationTitle', "Timeline"),
	type: 'object',
	properties: {
		'timeline.pageSize': {
			type: ['number', 'null'],
			default: 50,
			markdownDescription: localize('timeline.pageSize', "The number of items to show in the Timeline view by default and when loading more items. Setting to `null` will automatically choose a page size based on the visible area of the Timeline view."),
		},
		'timeline.pageOnScroll': {
			type: 'boolean',
			default: true,
			description: localize('timeline.pageOnScroll', "Controls whether the Timeline view will load the next page of items when you scroll to the end of the list."),
		},
	}
});

Registry.as<IViewsRegistry>(ViewExtensions.ViewsRegistry).registerViews([new TimelinePaneDescriptor()], VIEW_CONTAINER);

namespace OpenTimelineAction {

	export const ID = 'files.openTimeline';
	export const LABEL = localize('files.openTimeline', "Open Timeline");

	export function handler(): ICommandHandler {
		return (accessor, arg) => {
			const service = accessor.get(ITimelineService);

			if (URI.isUri(arg)) {
				return service.setUri(arg);
			}
		};
	}
}

CommandsRegistry.registerCommand(OpenTimelineAction.ID, OpenTimelineAction.handler());

MenuRegistry.appendMenuItem(MenuId.ExplorerContext, ({
	group: '4_timeline',
	order: 1,
	command: {
		id: OpenTimelineAction.ID,
		title: OpenTimelineAction.LABEL,
		icon: timelineOpenIcon
	},
	when: ContextKeyExpr.and(ExplorerFolderContext.toNegated(), ResourceContextKey.HasResource, TimelineHasProviderContext)
}));

const timelineFilter = registerIcon('timeline-filter', Codicon.filter, localize('timelineFilter', 'Icon for the filter timeline action.'));

MenuRegistry.appendMenuItem(MenuId.TimelineTitle, {
	submenu: MenuId.TimelineFilterSubMenu,
	title: localize('filterTimeline', "Filter Timeline"),
	group: 'navigation',
	order: 100,
	icon: timelineFilter
} satisfies ISubmenuItem);

registerSingleton(ITimelineService, TimelineService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/timeline/browser/timelinePane.ts]---
Location: vscode-main/src/vs/workbench/contrib/timeline/browser/timelinePane.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/timelinePane.css';
import { localize, localize2 } from '../../../../nls.js';
import * as DOM from '../../../../base/browser/dom.js';
import * as css from '../../../../base/browser/cssValue.js';
import { IAction, ActionRunner } from '../../../../base/common/actions.js';
import { CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { fromNow } from '../../../../base/common/date.js';
import { debounce } from '../../../../base/common/decorators.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { FuzzyScore, createMatches } from '../../../../base/common/filters.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { DisposableStore, IDisposable, Disposable } from '../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../base/common/network.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { escapeRegExpCharacters } from '../../../../base/common/strings.js';
import { URI } from '../../../../base/common/uri.js';
import { IconLabel } from '../../../../base/browser/ui/iconLabel/iconLabel.js';
import { IListVirtualDelegate, IIdentityProvider, IKeyboardNavigationLabelProvider } from '../../../../base/browser/ui/list/list.js';
import { ITreeNode, ITreeRenderer, ITreeContextMenuEvent, ITreeElement } from '../../../../base/browser/ui/tree/tree.js';
import { ViewPane, IViewPaneOptions } from '../../../browser/parts/views/viewPane.js';
import { WorkbenchObjectTree } from '../../../../platform/list/browser/listService.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { ContextKeyExpr, IContextKeyService, RawContextKey, IContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { IConfigurationService, IConfigurationChangeEvent } from '../../../../platform/configuration/common/configuration.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { ITimelineService, TimelineChangeEvent, TimelineItem, TimelineOptions, TimelineProvidersChangeEvent, TimelineRequest, Timeline } from '../common/timeline.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { SideBySideEditor, EditorResourceAccessor } from '../../../common/editor.js';
import { ICommandService, CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { IViewDescriptorService, ViewContainerLocation } from '../../../common/views.js';
import { IProgressService } from '../../../../platform/progress/common/progress.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { ActionBar, IActionViewItemProvider } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { getContextMenuActions, createActionViewItem } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { IMenuService, MenuId, registerAction2, Action2, MenuRegistry } from '../../../../platform/actions/common/actions.js';
import { ActionViewItem } from '../../../../base/browser/ui/actionbar/actionViewItems.js';
import { isDark } from '../../../../platform/theme/common/theme.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';
import { API_OPEN_DIFF_EDITOR_COMMAND_ID, API_OPEN_EDITOR_COMMAND_ID } from '../../../browser/parts/editor/editorCommands.js';
import { MarshalledId } from '../../../../base/common/marshallingIds.js';
import { isString } from '../../../../base/common/types.js';
import { renderAsPlaintext } from '../../../../base/browser/markdownRenderer.js';
import { IHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegate.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { AriaRole } from '../../../../base/browser/ui/aria/aria.js';
import { ILocalizedString } from '../../../../platform/action/common/action.js';
import { IHoverService, WorkbenchHoverDelegate } from '../../../../platform/hover/browser/hover.js';
import { HoverPosition } from '../../../../base/browser/ui/hover/hoverWidget.js';

const ItemHeight = 22;

type TreeElement = TimelineItem | LoadMoreCommand;

function isLoadMoreCommand(item: TreeElement | undefined): item is LoadMoreCommand {
	return item instanceof LoadMoreCommand;
}

function isTimelineItem(item: TreeElement | undefined): item is TimelineItem {
	return !!item && !item.handle.startsWith('vscode-command:');
}

function updateRelativeTime(item: TimelineItem, lastRelativeTime: string | undefined): string | undefined {
	item.relativeTime = isTimelineItem(item) ? fromNow(item.timestamp) : undefined;
	item.relativeTimeFullWord = isTimelineItem(item) ? fromNow(item.timestamp, false, true) : undefined;
	if (lastRelativeTime === undefined || item.relativeTime !== lastRelativeTime) {
		lastRelativeTime = item.relativeTime;
		item.hideRelativeTime = false;
	} else {
		item.hideRelativeTime = true;
	}

	return lastRelativeTime;
}

interface TimelineActionContext {
	uri: URI | undefined;
	item: TreeElement;
}

class TimelineAggregate {
	readonly items: TimelineItem[];
	readonly source: string;

	lastRenderedIndex: number;

	constructor(timeline: Timeline) {
		this.source = timeline.source;
		this.items = timeline.items;
		this._cursor = timeline.paging?.cursor;
		this.lastRenderedIndex = -1;
	}

	private _cursor?: string;
	get cursor(): string | undefined {
		return this._cursor;
	}

	get more(): boolean {
		return this._cursor !== undefined;
	}

	get newest(): TimelineItem | undefined {
		return this.items[0];
	}

	get oldest(): TimelineItem | undefined {
		return this.items[this.items.length - 1];
	}

	add(timeline: Timeline, options: TimelineOptions) {
		let updated = false;

		if (timeline.items.length !== 0 && this.items.length !== 0) {
			updated = true;

			const ids = new Set();
			const timestamps = new Set();

			for (const item of timeline.items) {
				if (item.id === undefined) {
					timestamps.add(item.timestamp);
				}
				else {
					ids.add(item.id);
				}
			}

			// Remove any duplicate items
			let i = this.items.length;
			let item;
			while (i--) {
				item = this.items[i];
				if ((item.id !== undefined && ids.has(item.id)) || timestamps.has(item.timestamp)) {
					this.items.splice(i, 1);
				}
			}

			if ((timeline.items[timeline.items.length - 1]?.timestamp ?? 0) >= (this.newest?.timestamp ?? 0)) {
				this.items.splice(0, 0, ...timeline.items);
			} else {
				this.items.push(...timeline.items);
			}
		} else if (timeline.items.length !== 0) {
			updated = true;

			this.items.push(...timeline.items);
		}

		// If we are not requesting more recent items than we have, then update the cursor
		if (options.cursor !== undefined || typeof options.limit !== 'object') {
			this._cursor = timeline.paging?.cursor;
		}

		if (updated) {
			this.items.sort(
				(a, b) =>
					(b.timestamp - a.timestamp) ||
					(a.source === undefined
						? b.source === undefined ? 0 : 1
						: b.source === undefined ? -1 : b.source.localeCompare(a.source, undefined, { numeric: true, sensitivity: 'base' }))
			);
		}

		return updated;
	}

	private _stale = false;
	get stale() {
		return this._stale;
	}

	private _requiresReset = false;
	get requiresReset(): boolean {
		return this._requiresReset;
	}

	invalidate(requiresReset: boolean) {
		this._stale = true;
		this._requiresReset = requiresReset;
	}
}

class LoadMoreCommand {
	readonly handle = 'vscode-command:loadMore';
	readonly timestamp = 0;
	readonly description = undefined;
	readonly tooltip = undefined;
	readonly contextValue = undefined;
	// Make things easier for duck typing
	readonly id = undefined;
	readonly icon = undefined;
	readonly iconDark = undefined;
	readonly source = undefined;
	readonly relativeTime = undefined;
	readonly relativeTimeFullWord = undefined;
	readonly hideRelativeTime = undefined;

	constructor(loading: boolean) {
		this._loading = loading;
	}
	private _loading: boolean = false;
	get loading(): boolean {
		return this._loading;
	}
	set loading(value: boolean) {
		this._loading = value;
	}

	get ariaLabel() {
		return this.label;
	}

	get label() {
		return this.loading ? localize('timeline.loadingMore', "Loading...") : localize('timeline.loadMore', "Load more");
	}

	get themeIcon(): ThemeIcon | undefined {
		return undefined;
	}
}

export const TimelineFollowActiveEditorContext = new RawContextKey<boolean>('timelineFollowActiveEditor', true, true);
export const TimelineExcludeSources = new RawContextKey<string>('timelineExcludeSources', '[]', true);
export const TimelineViewFocusedContext = new RawContextKey<boolean>('timelineFocused', true);

interface IPendingRequest extends IDisposable {
	readonly request: TimelineRequest;
}

export class TimelinePane extends ViewPane {
	static readonly TITLE: ILocalizedString = localize2('timeline', "Timeline");

	private $container!: HTMLElement;
	private $message!: HTMLDivElement;
	private $tree!: HTMLDivElement;
	private tree!: WorkbenchObjectTree<TreeElement, FuzzyScore>;
	private treeRenderer: TimelineTreeRenderer | undefined;
	private commands: TimelinePaneCommands;
	private visibilityDisposables: DisposableStore | undefined;

	private followActiveEditorContext: IContextKey<boolean>;
	private timelineExcludeSourcesContext: IContextKey<string>;

	private excludedSources: Set<string>;
	private pendingRequests = new Map<string, IPendingRequest>();
	private timelinesBySource = new Map<string, TimelineAggregate>();

	private uri: URI | undefined;

	constructor(
		options: IViewPaneOptions,
		@IKeybindingService keybindingService: IKeybindingService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IConfigurationService configurationService: IConfigurationService,
		@IStorageService private readonly storageService: IStorageService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IEditorService protected editorService: IEditorService,
		@ICommandService protected commandService: ICommandService,
		@IProgressService private readonly progressService: IProgressService,
		@ITimelineService protected timelineService: ITimelineService,
		@IOpenerService openerService: IOpenerService,
		@IThemeService themeService: IThemeService,
		@IHoverService hoverService: IHoverService,
		@ILabelService private readonly labelService: ILabelService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@IExtensionService private readonly extensionService: IExtensionService,
	) {
		super({ ...options, titleMenuId: MenuId.TimelineTitle }, keybindingService, contextMenuService, configurationService, contextKeyService, viewDescriptorService, instantiationService, openerService, themeService, hoverService);

		this.commands = this._register(this.instantiationService.createInstance(TimelinePaneCommands, this));

		this.followActiveEditorContext = TimelineFollowActiveEditorContext.bindTo(this.contextKeyService);
		this.timelineExcludeSourcesContext = TimelineExcludeSources.bindTo(this.contextKeyService);

		const excludedSourcesString = storageService.get('timeline.excludeSources', StorageScope.PROFILE, '[]');
		this.timelineExcludeSourcesContext.set(excludedSourcesString);
		this.excludedSources = new Set(JSON.parse(excludedSourcesString));

		this._register(storageService.onDidChangeValue(StorageScope.PROFILE, 'timeline.excludeSources', this._store)(this.onStorageServiceChanged, this));
		this._register(configurationService.onDidChangeConfiguration(this.onConfigurationChanged, this));
		this._register(timelineService.onDidChangeProviders(this.onProvidersChanged, this));
		this._register(timelineService.onDidChangeTimeline(this.onTimelineChanged, this));
		this._register(timelineService.onDidChangeUri(uri => this.setUri(uri), this));
	}

	private _followActiveEditor: boolean = true;
	get followActiveEditor(): boolean {
		return this._followActiveEditor;
	}
	set followActiveEditor(value: boolean) {
		if (this._followActiveEditor === value) {
			return;
		}

		this._followActiveEditor = value;
		this.followActiveEditorContext.set(value);

		this.updateFilename(this._filename);

		if (value) {
			this.onActiveEditorChanged();
		}
	}

	private _pageOnScroll: boolean | undefined;
	get pageOnScroll() {
		if (this._pageOnScroll === undefined) {
			this._pageOnScroll = this.configurationService.getValue<boolean | null | undefined>('timeline.pageOnScroll') ?? false;
		}

		return this._pageOnScroll;
	}

	get pageSize() {
		let pageSize = this.configurationService.getValue<number | null | undefined>('timeline.pageSize');
		if (pageSize === undefined || pageSize === null) {
			// If we are paging when scrolling, then add an extra item to the end to make sure the "Load more" item is out of view
			pageSize = Math.max(20, Math.floor((this.tree?.renderHeight ?? 0 / ItemHeight) + (this.pageOnScroll ? 1 : -1)));
		}
		return pageSize;
	}

	reset() {
		this.loadTimeline(true);
	}

	setUri(uri: URI) {
		this.setUriCore(uri, true);
	}

	private setUriCore(uri: URI | undefined, disableFollowing: boolean) {
		if (disableFollowing) {
			this.followActiveEditor = false;
		}

		this.uri = uri;
		this.updateFilename(uri ? this.labelService.getUriBasenameLabel(uri) : undefined);
		this.treeRenderer?.setUri(uri);
		this.loadTimeline(true);
	}

	private onStorageServiceChanged() {
		const excludedSourcesString = this.storageService.get('timeline.excludeSources', StorageScope.PROFILE, '[]');
		this.timelineExcludeSourcesContext.set(excludedSourcesString);
		this.excludedSources = new Set(JSON.parse(excludedSourcesString));

		const missing = this.timelineService.getSources()
			.filter(({ id }) => !this.excludedSources.has(id) && !this.timelinesBySource.has(id));
		if (missing.length !== 0) {
			this.loadTimeline(true, missing.map(({ id }) => id));
		} else {
			this.refresh();
		}
	}

	private onConfigurationChanged(e: IConfigurationChangeEvent) {
		if (e.affectsConfiguration('timeline.pageOnScroll')) {
			this._pageOnScroll = undefined;
		}
	}

	private onActiveEditorChanged() {
		if (!this.followActiveEditor || !this.isExpanded()) {
			return;
		}

		const uri = EditorResourceAccessor.getOriginalUri(this.editorService.activeEditor, { supportSideBySide: SideBySideEditor.PRIMARY });

		if ((this.uriIdentityService.extUri.isEqual(uri, this.uri) && uri !== undefined) ||
			// Fallback to match on fsPath if we are dealing with files or git schemes
			(uri?.fsPath === this.uri?.fsPath && (uri?.scheme === Schemas.file || uri?.scheme === 'git') && (this.uri?.scheme === Schemas.file || this.uri?.scheme === 'git'))) {

			// If the uri hasn't changed, make sure we have valid caches
			for (const source of this.timelineService.getSources()) {
				if (this.excludedSources.has(source.id)) {
					continue;
				}

				const timeline = this.timelinesBySource.get(source.id);
				if (timeline !== undefined && !timeline.stale) {
					continue;
				}

				if (timeline !== undefined) {
					this.updateTimeline(timeline, timeline.requiresReset);
				} else {
					this.loadTimelineForSource(source.id, uri, true);
				}
			}

			return;
		}

		this.setUriCore(uri, false);
	}

	private onProvidersChanged(e: TimelineProvidersChangeEvent) {
		if (e.removed) {
			for (const source of e.removed) {
				this.timelinesBySource.delete(source);
			}

			this.refresh();
		}

		if (e.added) {
			this.loadTimeline(true, e.added);
		}
	}

	private onTimelineChanged(e: TimelineChangeEvent) {
		if (e?.uri === undefined || this.uriIdentityService.extUri.isEqual(URI.revive(e.uri), this.uri)) {
			const timeline = this.timelinesBySource.get(e.id);
			if (timeline === undefined) {
				return;
			}

			if (this.isBodyVisible()) {
				this.updateTimeline(timeline, e.reset);
			} else {
				timeline.invalidate(e.reset);
			}
		}
	}

	private _filename: string | undefined;
	updateFilename(filename: string | undefined) {
		this._filename = filename;
		if (this.followActiveEditor || !filename) {
			this.updateTitleDescription(filename);
		} else {
			this.updateTitleDescription(`${filename} (pinned)`);
		}
	}

	private _message: string | undefined;
	get message(): string | undefined {
		return this._message;
	}

	set message(message: string | undefined) {
		this._message = message;
		this.updateMessage();
	}

	private updateMessage(): void {
		if (this._message !== undefined) {
			this.showMessage(this._message);
		} else {
			this.hideMessage();
		}
	}

	private showMessage(message: string): void {
		if (!this.$message) {
			return;
		}
		this.$message.classList.remove('hide');
		this.resetMessageElement();

		this.$message.textContent = message;
	}

	private hideMessage(): void {
		this.resetMessageElement();
		this.$message.classList.add('hide');
	}

	private resetMessageElement(): void {
		DOM.clearNode(this.$message);
	}

	private _isEmpty = true;
	private _maxItemCount = 0;

	private _visibleItemCount = 0;
	private get hasVisibleItems() {
		return this._visibleItemCount > 0;
	}

	private clear(cancelPending: boolean) {
		this._visibleItemCount = 0;
		this._maxItemCount = this.pageSize;
		this.timelinesBySource.clear();

		if (cancelPending) {
			for (const pendingRequest of this.pendingRequests.values()) {
				pendingRequest.request.tokenSource.cancel();
				pendingRequest.dispose();
			}

			this.pendingRequests.clear();

			if (!this.isBodyVisible() && this.tree) {
				this.tree.setChildren(null, undefined);
				this._isEmpty = true;
			}
		}
	}

	private async loadTimeline(reset: boolean, sources?: string[]) {
		// If we have no source, we are resetting all sources, so cancel everything in flight and reset caches
		if (sources === undefined) {
			if (reset) {
				this.clear(true);
			}

			// TODO@eamodio: Are these the right the list of schemes to exclude? Is there a better way?
			if (this.uri?.scheme === Schemas.vscodeSettings || this.uri?.scheme === Schemas.webviewPanel || this.uri?.scheme === Schemas.walkThrough) {
				this.uri = undefined;

				this.clear(false);
				this.refresh();

				return;
			}

			if (this._isEmpty && this.uri !== undefined) {
				this.setLoadingUriMessage();
			}
		}

		if (this.uri === undefined) {
			this.clear(false);
			this.refresh();

			return;
		}

		if (!this.isBodyVisible()) {
			return;
		}

		let hasPendingRequests = false;

		for (const source of sources ?? this.timelineService.getSources().map(s => s.id)) {
			const requested = this.loadTimelineForSource(source, this.uri, reset);
			if (requested) {
				hasPendingRequests = true;
			}
		}

		if (!hasPendingRequests) {
			this.refresh();
		} else if (this._isEmpty) {
			this.setLoadingUriMessage();
		}
	}

	private loadTimelineForSource(source: string, uri: URI, reset: boolean, options?: TimelineOptions) {
		if (this.excludedSources.has(source)) {
			return false;
		}

		const timeline = this.timelinesBySource.get(source);

		// If we are paging, and there are no more items or we have enough cached items to cover the next page,
		// don't bother querying for more
		if (
			!reset &&
			options?.cursor !== undefined &&
			timeline !== undefined &&
			(!timeline?.more || timeline.items.length > timeline.lastRenderedIndex + this.pageSize)
		) {
			return false;
		}

		if (options === undefined) {
			if (
				!reset &&
				timeline !== undefined &&
				timeline.items.length > 0 &&
				!timeline.more
			) {
				// If we are not resetting, have item(s), and already know there are no more to fetch, we're done here
				return false;
			}
			options = { cursor: reset ? undefined : timeline?.cursor, limit: this.pageSize };
		}

		const pendingRequest = this.pendingRequests.get(source);
		if (pendingRequest !== undefined) {
			options.cursor = pendingRequest.request.options.cursor;

			// TODO@eamodio deal with concurrent requests better
			if (typeof options.limit === 'number') {
				if (typeof pendingRequest.request.options.limit === 'number') {
					options.limit += pendingRequest.request.options.limit;
				} else {
					options.limit = pendingRequest.request.options.limit;
				}
			}
		}
		pendingRequest?.request?.tokenSource.cancel();
		pendingRequest?.dispose();

		options.cacheResults = true;
		options.resetCache = reset;
		const tokenSource = new CancellationTokenSource();
		const newRequest = this.timelineService.getTimeline(source, uri, options, tokenSource);

		if (newRequest === undefined) {
			tokenSource.dispose();
			return false;
		}

		const disposables = new DisposableStore();
		this.pendingRequests.set(source, { request: newRequest, dispose: () => disposables.dispose() });
		disposables.add(tokenSource);
		disposables.add(tokenSource.token.onCancellationRequested(() => this.pendingRequests.delete(source)));

		this.handleRequest(newRequest);

		return true;
	}

	private updateTimeline(timeline: TimelineAggregate, reset: boolean) {
		if (reset) {
			this.timelinesBySource.delete(timeline.source);
			// Override the limit, to re-query for all our existing cached (possibly visible) items to keep visual continuity
			const { oldest } = timeline;
			this.loadTimelineForSource(timeline.source, this.uri!, true, oldest !== undefined ? { limit: { timestamp: oldest.timestamp, id: oldest.id } } : undefined);
		} else {
			// Override the limit, to query for any newer items
			const { newest } = timeline;
			this.loadTimelineForSource(timeline.source, this.uri!, false, newest !== undefined ? { limit: { timestamp: newest.timestamp, id: newest.id } } : { limit: this.pageSize });
		}
	}

	private _pendingRefresh = false;

	private async handleRequest(request: TimelineRequest) {
		let response: Timeline | undefined;
		try {
			response = await this.progressService.withProgress({ location: this.id }, () => request.result);
		} catch {
			// Ignore
		}

		// If the request was cancelled then it was already deleted from the pendingRequests map
		if (!request.tokenSource.token.isCancellationRequested) {
			this.pendingRequests.get(request.source)?.dispose();
			this.pendingRequests.delete(request.source);
		}

		if (response === undefined || request.uri !== this.uri) {
			if (this.pendingRequests.size === 0 && this._pendingRefresh) {
				this.refresh();
			}
			return;
		}

		const source = request.source;

		let updated = false;
		const timeline = this.timelinesBySource.get(source);
		if (timeline === undefined) {
			this.timelinesBySource.set(source, new TimelineAggregate(response));
			updated = true;
		}
		else {
			updated = timeline.add(response, request.options);
		}

		if (updated) {
			this._pendingRefresh = true;

			// If we have visible items already and there are other pending requests, debounce for a bit to wait for other requests
			if (this.hasVisibleItems && this.pendingRequests.size !== 0) {
				this.refreshDebounced();
			} else {
				this.refresh();
			}
		} else if (this.pendingRequests.size === 0) {
			if (this._pendingRefresh) {
				this.refresh();
			} else {
				this.tree.rerender();
			}
		}
	}

	private *getItems(): Generator<ITreeElement<TreeElement>, void, undefined> {
		let more = false;

		if (this.uri === undefined || this.timelinesBySource.size === 0) {
			this._visibleItemCount = 0;

			return;
		}

		const maxCount = this._maxItemCount;
		let count = 0;

		if (this.timelinesBySource.size === 1) {
			const [source, timeline] = Iterable.first(this.timelinesBySource)!;

			timeline.lastRenderedIndex = -1;

			if (this.excludedSources.has(source)) {
				this._visibleItemCount = 0;

				return;
			}

			if (timeline.items.length !== 0) {
				// If we have any items, just say we have one for now -- the real count will be updated below
				this._visibleItemCount = 1;
			}

			more = timeline.more;

			let lastRelativeTime: string | undefined;
			for (const item of timeline.items) {
				item.relativeTime = undefined;
				item.hideRelativeTime = undefined;

				count++;
				if (count > maxCount) {
					more = true;
					break;
				}

				lastRelativeTime = updateRelativeTime(item, lastRelativeTime);
				yield { element: item };
			}

			timeline.lastRenderedIndex = count - 1;
		}
		else {
			const sources: { timeline: TimelineAggregate; iterator: IterableIterator<TimelineItem>; nextItem: IteratorResult<TimelineItem, undefined> }[] = [];

			let hasAnyItems = false;
			let mostRecentEnd = 0;

			for (const [source, timeline] of this.timelinesBySource) {
				timeline.lastRenderedIndex = -1;

				if (this.excludedSources.has(source) || timeline.stale) {
					continue;
				}

				if (timeline.items.length !== 0) {
					hasAnyItems = true;
				}

				if (timeline.more) {
					more = true;

					const last = timeline.items[Math.min(maxCount, timeline.items.length - 1)];
					if (last.timestamp > mostRecentEnd) {
						mostRecentEnd = last.timestamp;
					}
				}

				const iterator = timeline.items[Symbol.iterator]();
				sources.push({ timeline, iterator, nextItem: iterator.next() });
			}

			this._visibleItemCount = hasAnyItems ? 1 : 0;

			function getNextMostRecentSource() {
				return sources
					.filter(source => !source.nextItem.done)
					.reduce((previous, current) => (previous === undefined || current.nextItem.value!.timestamp >= previous.nextItem.value!.timestamp) ? current : previous, undefined!);
			}

			let lastRelativeTime: string | undefined;
			let nextSource;
			while (nextSource = getNextMostRecentSource()) {
				nextSource.timeline.lastRenderedIndex++;

				const item = nextSource.nextItem.value!;
				item.relativeTime = undefined;
				item.hideRelativeTime = undefined;

				if (item.timestamp >= mostRecentEnd) {
					count++;
					if (count > maxCount) {
						more = true;
						break;
					}

					lastRelativeTime = updateRelativeTime(item, lastRelativeTime);
					yield { element: item };
				}

				nextSource.nextItem = nextSource.iterator.next();
			}
		}

		this._visibleItemCount = count;
		if (count > 0) {
			if (more) {
				yield {
					element: new LoadMoreCommand(this.pendingRequests.size !== 0)
				};
			} else if (this.pendingRequests.size !== 0) {
				yield {
					element: new LoadMoreCommand(true)
				};
			}
		}
	}

	private refresh() {
		if (!this.isBodyVisible()) {
			return;
		}

		this.tree.setChildren(null, this.getItems());
		this._isEmpty = !this.hasVisibleItems;

		if (this.uri === undefined) {
			this.updateFilename(undefined);
			this.message = localize('timeline.editorCannotProvideTimeline', "The active editor cannot provide timeline information.");
		} else if (this._isEmpty) {
			if (this.pendingRequests.size !== 0) {
				this.setLoadingUriMessage();
			} else {
				this.updateFilename(this.labelService.getUriBasenameLabel(this.uri));
				const scmProviderCount = this.contextKeyService.getContextKeyValue<number>('scm.providerCount');
				if (this.timelineService.getSources().filter(({ id }) => !this.excludedSources.has(id)).length === 0) {
					this.message = localize('timeline.noTimelineSourcesEnabled', "All timeline sources have been filtered out.");
				} else {
					if (this.configurationService.getValue('workbench.localHistory.enabled') && !this.excludedSources.has('timeline.localHistory')) {
						this.message = localize('timeline.noLocalHistoryYet', "Local History will track recent changes as you save them unless the file has been excluded or is too large.");
					} else if (this.excludedSources.size > 0) {
						this.message = localize('timeline.noTimelineInfoFromEnabledSources', "No filtered timeline information was provided.");
					} else {
						this.message = localize('timeline.noTimelineInfo', "No timeline information was provided.");
					}
				}
				if (!scmProviderCount || scmProviderCount === 0) {
					this.message += ' ' + localize('timeline.noSCM', "Source Control has not been configured.");
				}
			}
		} else {
			this.updateFilename(this.labelService.getUriBasenameLabel(this.uri));
			this.message = undefined;
		}

		this._pendingRefresh = false;
	}

	@debounce(500)
	private refreshDebounced() {
		this.refresh();
	}

	override focus(): void {
		super.focus();
		this.tree.domFocus();
	}

	override setExpanded(expanded: boolean): boolean {
		const changed = super.setExpanded(expanded);

		if (changed && this.isBodyVisible()) {
			if (!this.followActiveEditor) {
				this.setUriCore(this.uri, true);
			} else {
				this.onActiveEditorChanged();
			}
		}

		return changed;
	}

	override setVisible(visible: boolean): void {
		if (visible) {
			this.extensionService.activateByEvent('onView:timeline');
			this.visibilityDisposables = new DisposableStore();

			this.editorService.onDidActiveEditorChange(this.onActiveEditorChanged, this, this.visibilityDisposables);
			// Refresh the view on focus to update the relative timestamps
			this.onDidFocus(() => this.refreshDebounced(), this, this.visibilityDisposables);

			super.setVisible(visible);

			this.onActiveEditorChanged();
		} else {
			this.visibilityDisposables?.dispose();

			super.setVisible(visible);
		}
	}

	protected override layoutBody(height: number, width: number): void {
		super.layoutBody(height, width);
		this.tree.layout(height, width);
	}

	protected override renderHeaderTitle(container: HTMLElement): void {
		super.renderHeaderTitle(container, this.title);

		container.classList.add('timeline-view');
	}

	protected override renderBody(container: HTMLElement): void {
		super.renderBody(container);

		this.$container = container;
		container.classList.add('tree-explorer-viewlet-tree-view', 'timeline-tree-view');

		this.$message = DOM.append(this.$container, DOM.$('.message'));
		this.$message.classList.add('timeline-subtle');

		this.message = localize('timeline.editorCannotProvideTimeline', "The active editor cannot provide timeline information.");

		this.$tree = document.createElement('div');
		this.$tree.classList.add('customview-tree', 'file-icon-themable-tree', 'hide-arrows');
		// this.treeElement.classList.add('show-file-icons');
		container.appendChild(this.$tree);

		this.treeRenderer = this.instantiationService.createInstance(TimelineTreeRenderer, this.commands, this.viewDescriptorService.getViewLocationById(this.id));
		this._register(this.treeRenderer.onDidScrollToEnd(item => {
			if (this.pageOnScroll) {
				this.loadMore(item);
			}
		}));

		this.tree = this.instantiationService.createInstance(WorkbenchObjectTree<TreeElement, FuzzyScore>, 'TimelinePane',
			this.$tree, new TimelineListVirtualDelegate(), [this.treeRenderer], {
			identityProvider: new TimelineIdentityProvider(),
			accessibilityProvider: {
				getAriaLabel(element: TreeElement): string {
					if (isLoadMoreCommand(element)) {
						return element.ariaLabel;
					}
					return element.accessibilityInformation ? element.accessibilityInformation.label : localize('timeline.aria.item', "{0}: {1}", element.relativeTimeFullWord ?? '', element.label);
				},
				getRole(element: TreeElement): AriaRole {
					if (isLoadMoreCommand(element)) {
						return 'treeitem';
					}
					return element.accessibilityInformation && element.accessibilityInformation.role ? element.accessibilityInformation.role : 'treeitem';
				},
				getWidgetAriaLabel(): string {
					return localize('timeline', "Timeline");
				}
			},
			keyboardNavigationLabelProvider: new TimelineKeyboardNavigationLabelProvider(),
			multipleSelectionSupport: false,
			overrideStyles: this.getLocationBasedColors().listOverrideStyles,
		});

		TimelineViewFocusedContext.bindTo(this.tree.contextKeyService);

		this._register(this.tree.onContextMenu(e => this.onContextMenu(this.commands, e)));
		this._register(this.tree.onDidChangeSelection(e => this.ensureValidItems()));
		this._register(this.tree.onDidOpen(e => {
			if (!e.browserEvent || !this.ensureValidItems()) {
				return;
			}

			const selection = this.tree.getSelection();
			let item;
			if (selection.length === 1) {
				item = selection[0];
			}

			if (item === null) {
				return;
			}

			if (isTimelineItem(item)) {
				if (item.command) {
					let args = item.command.arguments ?? [];
					if (item.command.id === API_OPEN_EDITOR_COMMAND_ID || item.command.id === API_OPEN_DIFF_EDITOR_COMMAND_ID) {
						// Some commands owned by us should receive the
						// `IOpenEvent` as context to open properly
						args = [...args, e];
					}

					this.commandService.executeCommand(item.command.id, ...args);
				}
			}
			else if (isLoadMoreCommand(item)) {
				this.loadMore(item);
			}
		}));
	}

	private loadMore(item: LoadMoreCommand) {
		if (item.loading) {
			return;
		}

		item.loading = true;
		this.tree.rerender(item);

		if (this.pendingRequests.size !== 0) {
			return;
		}

		this._maxItemCount = this._visibleItemCount + this.pageSize;
		this.loadTimeline(false);
	}

	ensureValidItems() {
		// If we don't have any non-excluded timelines, clear the tree and show the loading message
		if (!this.hasVisibleItems || !this.timelineService.getSources().some(({ id }) => !this.excludedSources.has(id) && this.timelinesBySource.has(id))) {
			this.tree.setChildren(null, undefined);
			this._isEmpty = true;

			this.setLoadingUriMessage();

			return false;
		}

		return true;
	}

	setLoadingUriMessage() {
		const file = this.uri && this.labelService.getUriBasenameLabel(this.uri);
		this.updateFilename(file);
		this.message = file ? localize('timeline.loading', "Loading timeline for {0}...", file) : '';
	}

	private onContextMenu(commands: TimelinePaneCommands, treeEvent: ITreeContextMenuEvent<TreeElement | null>): void {
		const item = treeEvent.element;
		if (item === null) {
			return;
		}
		const event: UIEvent = treeEvent.browserEvent;

		event.preventDefault();
		event.stopPropagation();

		if (!this.ensureValidItems()) {
			return;
		}

		this.tree.setFocus([item]);
		const actions = commands.getItemContextActions(item);
		if (!actions.length) {
			return;
		}

		this.contextMenuService.showContextMenu({
			getAnchor: () => treeEvent.anchor,
			getActions: () => actions,
			getActionViewItem: (action) => {
				const keybinding = this.keybindingService.lookupKeybinding(action.id);
				if (keybinding) {
					return new ActionViewItem(action, action, { label: true, keybinding: keybinding.getLabel() });
				}
				return undefined;
			},
			onHide: (wasCancelled?: boolean) => {
				if (wasCancelled) {
					this.tree.domFocus();
				}
			},
			getActionsContext: (): TimelineActionContext => ({ uri: this.uri, item }),
			actionRunner: new TimelineActionRunner()
		});
	}
}

class TimelineElementTemplate implements IDisposable {
	static readonly id = 'TimelineElementTemplate';

	readonly actionBar: ActionBar;
	readonly icon: HTMLElement;
	readonly iconLabel: IconLabel;
	readonly timestamp: HTMLSpanElement;

	constructor(
		container: HTMLElement,
		actionViewItemProvider: IActionViewItemProvider,
		hoverDelegate: IHoverDelegate,
	) {
		container.classList.add('custom-view-tree-node-item');
		this.icon = DOM.append(container, DOM.$('.custom-view-tree-node-item-icon'));

		this.iconLabel = new IconLabel(container, { supportHighlights: true, supportIcons: true, hoverDelegate });

		const timestampContainer = DOM.append(this.iconLabel.element, DOM.$('.timeline-timestamp-container'));
		this.timestamp = DOM.append(timestampContainer, DOM.$('span.timeline-timestamp'));

		const actionsContainer = DOM.append(this.iconLabel.element, DOM.$('.actions'));
		this.actionBar = new ActionBar(actionsContainer, { actionViewItemProvider });
	}

	dispose() {
		this.iconLabel.dispose();
		this.actionBar.dispose();
	}

	reset() {
		this.icon.className = '';
		this.icon.style.backgroundImage = '';
		this.actionBar.clear();
	}
}

export class TimelineIdentityProvider implements IIdentityProvider<TreeElement> {
	getId(item: TreeElement): { toString(): string } {
		return item.handle;
	}
}

class TimelineActionRunner extends ActionRunner {

	protected override async runAction(action: IAction, { uri, item }: TimelineActionContext): Promise<void> {
		if (!isTimelineItem(item)) {
			// TODO@eamodio do we need to do anything else?
			await action.run();
			return;
		}

		await action.run(
			{
				$mid: MarshalledId.TimelineActionContext,
				handle: item.handle,
				source: item.source,
				uri
			},
			uri,
			item.source,
		);
	}
}

export class TimelineKeyboardNavigationLabelProvider implements IKeyboardNavigationLabelProvider<TreeElement> {
	getKeyboardNavigationLabel(element: TreeElement): { toString(): string } {
		return element.label;
	}
}

export class TimelineListVirtualDelegate implements IListVirtualDelegate<TreeElement> {
	getHeight(_element: TreeElement): number {
		return ItemHeight;
	}

	getTemplateId(element: TreeElement): string {
		return TimelineElementTemplate.id;
	}
}

class TimelineTreeRenderer implements ITreeRenderer<TreeElement, FuzzyScore, TimelineElementTemplate> {
	private readonly _onDidScrollToEnd = new Emitter<LoadMoreCommand>();
	readonly onDidScrollToEnd: Event<LoadMoreCommand> = this._onDidScrollToEnd.event;

	readonly templateId: string = TimelineElementTemplate.id;

	private _hoverDelegate: IHoverDelegate;

	private actionViewItemProvider: IActionViewItemProvider;

	constructor(
		private readonly commands: TimelinePaneCommands,
		private readonly viewContainerLocation: ViewContainerLocation | null,
		@IInstantiationService protected readonly instantiationService: IInstantiationService,
		@IThemeService private themeService: IThemeService
	) {
		this.actionViewItemProvider = createActionViewItem.bind(undefined, this.instantiationService);

		this._hoverDelegate = this.instantiationService.createInstance(
			WorkbenchHoverDelegate,
			this.viewContainerLocation === ViewContainerLocation.Panel ? 'mouse' : 'element',
			{
				instantHover: this.viewContainerLocation !== ViewContainerLocation.Panel
			}, {
			position: {
				hoverPosition: HoverPosition.RIGHT // Will flip when there's no space
			}
		});
	}

	private uri: URI | undefined;
	setUri(uri: URI | undefined) {
		this.uri = uri;
	}

	renderTemplate(container: HTMLElement): TimelineElementTemplate {
		return new TimelineElementTemplate(container, this.actionViewItemProvider, this._hoverDelegate);
	}

	renderElement(
		node: ITreeNode<TreeElement, FuzzyScore>,
		index: number,
		template: TimelineElementTemplate
	): void {
		template.reset();

		const { element: item } = node;

		const theme = this.themeService.getColorTheme();
		const icon = isDark(theme.type) ? item.iconDark : item.icon;
		const iconUrl = icon ? URI.revive(icon) : null;

		if (iconUrl) {
			template.icon.className = 'custom-view-tree-node-item-icon';
			template.icon.style.backgroundImage = css.asCSSUrl(iconUrl);
			template.icon.style.color = '';
		} else if (item.themeIcon) {
			template.icon.className = `custom-view-tree-node-item-icon ${ThemeIcon.asClassName(item.themeIcon)}`;
			if (item.themeIcon.color) {
				template.icon.style.color = theme.getColor(item.themeIcon.color.id)?.toString() ?? '';
			} else {
				template.icon.style.color = '';
			}
			template.icon.style.backgroundImage = '';
		} else {
			template.icon.className = 'custom-view-tree-node-item-icon';
			template.icon.style.backgroundImage = '';
			template.icon.style.color = '';
		}
		const tooltip = item.tooltip
			? isString(item.tooltip)
				? item.tooltip
				: { markdown: item.tooltip, markdownNotSupportedFallback: renderAsPlaintext(item.tooltip) }
			: undefined;

		template.iconLabel.setLabel(item.label, item.description, {
			title: tooltip,
			matches: createMatches(node.filterData)
		});

		template.timestamp.textContent = item.relativeTime ?? '';
		template.timestamp.ariaLabel = item.relativeTimeFullWord ?? '';
		template.timestamp.parentElement!.classList.toggle('timeline-timestamp--duplicate', isTimelineItem(item) && item.hideRelativeTime);

		template.actionBar.context = { uri: this.uri, item } satisfies TimelineActionContext;
		template.actionBar.actionRunner = new TimelineActionRunner();
		template.actionBar.push(this.commands.getItemActions(item), { icon: true, label: false });

		// If we are rendering the load more item, we've scrolled to the end, so trigger an event
		if (isLoadMoreCommand(item)) {
			setTimeout(() => this._onDidScrollToEnd.fire(item), 0);
		}
	}

	disposeElement(element: ITreeNode<TreeElement, FuzzyScore>, index: number, templateData: TimelineElementTemplate): void {
		templateData.actionBar.actionRunner.dispose();
	}

	disposeTemplate(template: TimelineElementTemplate): void {
		template.dispose();
	}
}


const timelineRefresh = registerIcon('timeline-refresh', Codicon.refresh, localize('timelineRefresh', 'Icon for the refresh timeline action.'));
const timelinePin = registerIcon('timeline-pin', Codicon.pin, localize('timelinePin', 'Icon for the pin timeline action.'));
const timelineUnpin = registerIcon('timeline-unpin', Codicon.pinned, localize('timelineUnpin', 'Icon for the unpin timeline action.'));

class TimelinePaneCommands extends Disposable {
	private readonly sourceDisposables: DisposableStore;

	constructor(
		private readonly pane: TimelinePane,
		@ITimelineService private readonly timelineService: ITimelineService,
		@IStorageService private readonly storageService: IStorageService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IMenuService private readonly menuService: IMenuService,
	) {
		super();

		this._register(this.sourceDisposables = new DisposableStore());

		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: 'timeline.refresh',
					title: localize2('refresh', "Refresh"),
					icon: timelineRefresh,
					category: localize2('timeline', "Timeline"),
					menu: {
						id: MenuId.TimelineTitle,
						group: 'navigation',
						order: 99,
					}
				});
			}
			run(accessor: ServicesAccessor, ...args: unknown[]) {
				pane.reset();
			}
		}));

		this._register(CommandsRegistry.registerCommand('timeline.toggleFollowActiveEditor',
			(accessor: ServicesAccessor, ...args: unknown[]) => pane.followActiveEditor = !pane.followActiveEditor
		));

		this._register(MenuRegistry.appendMenuItem(MenuId.TimelineTitle, ({
			command: {
				id: 'timeline.toggleFollowActiveEditor',
				title: localize2('timeline.toggleFollowActiveEditorCommand.follow', 'Pin the Current Timeline'),
				icon: timelinePin,
				category: localize2('timeline', "Timeline"),
			},
			group: 'navigation',
			order: 98,
			when: TimelineFollowActiveEditorContext
		})));

		this._register(MenuRegistry.appendMenuItem(MenuId.TimelineTitle, ({
			command: {
				id: 'timeline.toggleFollowActiveEditor',
				title: localize2('timeline.toggleFollowActiveEditorCommand.unfollow', 'Unpin the Current Timeline'),
				icon: timelineUnpin,
				category: localize2('timeline', "Timeline"),
			},
			group: 'navigation',
			order: 98,
			when: TimelineFollowActiveEditorContext.toNegated()
		})));

		this._register(timelineService.onDidChangeProviders(() => this.updateTimelineSourceFilters()));
		this.updateTimelineSourceFilters();
	}

	getItemActions(element: TreeElement): IAction[] {
		return this.getActions(MenuId.TimelineItemContext, { key: 'timelineItem', value: element.contextValue }).primary;
	}

	getItemContextActions(element: TreeElement): IAction[] {
		return this.getActions(MenuId.TimelineItemContext, { key: 'timelineItem', value: element.contextValue }).secondary;
	}

	private getActions(menuId: MenuId, context: { key: string; value?: string }): { primary: IAction[]; secondary: IAction[] } {
		const contextKeyService = this.contextKeyService.createOverlay([
			['view', this.pane.id],
			[context.key, context.value],
		]);

		const menu = this.menuService.getMenuActions(menuId, contextKeyService, { shouldForwardArgs: true });
		return getContextMenuActions(menu, 'inline');
	}

	private updateTimelineSourceFilters() {
		this.sourceDisposables.clear();

		const excluded = new Set(JSON.parse(this.storageService.get('timeline.excludeSources', StorageScope.PROFILE, '[]')));
		for (const source of this.timelineService.getSources()) {
			this.sourceDisposables.add(registerAction2(class extends Action2 {
				constructor() {
					super({
						id: `timeline.toggleExcludeSource:${source.id}`,
						title: source.label,
						menu: {
							id: MenuId.TimelineFilterSubMenu,
							group: 'navigation',
						},
						toggled: ContextKeyExpr.regex(`timelineExcludeSources`, new RegExp(`\\b${escapeRegExpCharacters(source.id)}\\b`)).negate()
					});
				}
				run(accessor: ServicesAccessor, ...args: unknown[]) {
					if (!excluded.delete(source.id)) {
						excluded.add(source.id);
					}

					const storageService = accessor.get(IStorageService);
					storageService.store('timeline.excludeSources', JSON.stringify([...excluded.keys()]), StorageScope.PROFILE, StorageTarget.USER);
				}
			}));
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/timeline/browser/media/timelinePane.css]---
Location: vscode-main/src/vs/workbench/contrib/timeline/browser/media/timelinePane.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench .timeline-tree-view {
	position: relative;
}

.monaco-workbench .timeline-tree-view .message.timeline-subtle {
	opacity: 0.5;
	padding: 10px 22px 0 22px;
	position: absolute;
	pointer-events: none;
	z-index: 1;
}

.timeline-tree-view .monaco-list .monaco-list-row .custom-view-tree-node-item .monaco-icon-label {
	flex: 1;
	text-overflow: ellipsis;
	overflow: hidden;
}

.timeline-tree-view .monaco-list .monaco-list-row .custom-view-tree-node-item .timeline-timestamp-container {
	margin-left: 2px;
	margin-right: 4px;
	opacity: 0.5;
	overflow: hidden;
	text-overflow: ellipsis;
}

.timeline-tree-view .monaco-list .monaco-list-row .custom-view-tree-node-item .timeline-timestamp-container.timeline-timestamp--duplicate::before {
	content: ' ';
	position: absolute;
	right: 10px;
	border-right: 1px solid currentColor;
	display: block;
	height: 100%;
	width: 1px;
	opacity: 0.25;
}

.timeline-tree-view .monaco-list .monaco-list-row:hover .custom-view-tree-node-item .timeline-timestamp-container.timeline-timestamp--duplicate::before,
.timeline-tree-view .monaco-list .monaco-list-row.selected .custom-view-tree-node-item .timeline-timestamp-container.timeline-timestamp--duplicate::before,
.timeline-tree-view .monaco-list .monaco-list-row.focused .custom-view-tree-node-item .timeline-timestamp-container.timeline-timestamp--duplicate::before {
	display: none;
}

.timeline-tree-view .monaco-list .monaco-list-row .custom-view-tree-node-item .timeline-timestamp-container .timeline-timestamp {
	display: inline-block;
}

.timeline-tree-view .monaco-list .monaco-list-row .custom-view-tree-node-item .timeline-timestamp-container.timeline-timestamp--duplicate .timeline-timestamp {
	visibility: hidden;
	width: 10px;
}

.timeline-tree-view .monaco-list .monaco-list-row:hover .custom-view-tree-node-item .timeline-timestamp-container.timeline-timestamp--duplicate .timeline-timestamp,
.timeline-tree-view .monaco-list .monaco-list-row.selected .custom-view-tree-node-item .timeline-timestamp-container.timeline-timestamp--duplicate .timeline-timestamp,
.timeline-tree-view .monaco-list .monaco-list-row.focused .custom-view-tree-node-item .timeline-timestamp-container.timeline-timestamp--duplicate .timeline-timestamp {
	visibility: visible !important;
	width: initial;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/timeline/common/timeline.ts]---
Location: vscode-main/src/vs/workbench/contrib/timeline/common/timeline.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { Event } from '../../../../base/common/event.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { Command } from '../../../../editor/common/languages.js';
import { ExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IAccessibilityInformation } from '../../../../platform/accessibility/common/accessibility.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { IMarkdownString } from '../../../../base/common/htmlContent.js';

export function toKey(extension: ExtensionIdentifier | string, source: string) {
	return `${typeof extension === 'string' ? extension : ExtensionIdentifier.toKey(extension)}|${source}`;
}

export const TimelinePaneId = 'timeline';

export interface TimelineItem {

	/**
	 * The handle of the item must be unique across all the
	 * timeline items provided by this source.
	 */
	handle: string;

	/**
	 * The identifier of the timeline provider this timeline item is from.
	 */
	source: string;

	id?: string;

	label: string;
	description?: string;
	tooltip?: string | IMarkdownString | undefined;

	timestamp: number;

	accessibilityInformation?: IAccessibilityInformation;

	icon?: URI;
	iconDark?: URI;
	themeIcon?: ThemeIcon;

	command?: Command;
	contextValue?: string;

	relativeTime?: string;
	relativeTimeFullWord?: string;
	hideRelativeTime?: boolean;
}

export interface TimelineChangeEvent {

	/**
	 * The identifier of the timeline provider this event is from.
	 */
	id: string;

	/**
	 * The resource that has timeline entries changed or `undefined`
	 * if not known.
	 */
	uri: URI | undefined;

	/**
	 * Whether to drop all timeline entries and refresh them again.
	 */
	reset: boolean;
}

export interface TimelineOptions {
	cursor?: string;
	limit?: number | { timestamp: number; id?: string };
	resetCache?: boolean;
	cacheResults?: boolean;
}

export interface Timeline {

	/**
	 * The identifier of the timeline provider this timeline is from.
	 */
	source: string;

	items: TimelineItem[];

	paging?: {
		cursor: string | undefined;
	};
}

export interface TimelineProvider extends TimelineProviderDescriptor, IDisposable {
	readonly onDidChange?: Event<TimelineChangeEvent>;

	provideTimeline(uri: URI, options: TimelineOptions, token: CancellationToken): Promise<Timeline | undefined>;
}

export interface TimelineSource {
	id: string;
	label: string;
}

export interface TimelineProviderDescriptor {

	/**
	 * An identifier of the source of the timeline items. This can be used to filter sources.
	 */
	id: string;

	/**
	 * A human-readable string describing the source of the timeline items. This can be used as the display label when filtering sources.
	 */
	label: string;

	/**
	 * The resource scheme(s) this timeline provider is providing entries for.
	 */
	scheme: string | string[];
}

export interface TimelineProvidersChangeEvent {
	readonly added?: string[];
	readonly removed?: string[];
}

export interface TimelineRequest {
	readonly result: Promise<Timeline | undefined>;
	readonly options: TimelineOptions;
	readonly source: string;
	readonly tokenSource: CancellationTokenSource;
	readonly uri: URI;
}

export interface ITimelineService {
	readonly _serviceBrand: undefined;

	readonly onDidChangeProviders: Event<TimelineProvidersChangeEvent>;
	readonly onDidChangeTimeline: Event<TimelineChangeEvent>;
	readonly onDidChangeUri: Event<URI>;

	registerTimelineProvider(provider: TimelineProvider): IDisposable;
	unregisterTimelineProvider(id: string): void;

	getSources(): TimelineSource[];

	getTimeline(id: string, uri: URI, options: TimelineOptions, tokenSource: CancellationTokenSource): TimelineRequest | undefined;

	setUri(uri: URI): void;
}

const TIMELINE_SERVICE_ID = 'timeline';
export const ITimelineService = createDecorator<ITimelineService>(TIMELINE_SERVICE_ID);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/timeline/common/timelineService.ts]---
Location: vscode-main/src/vs/workbench/contrib/timeline/common/timelineService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { Emitter } from '../../../../base/common/event.js';
import { Disposable, DisposableMap, IDisposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { ITimelineService, TimelineChangeEvent, TimelineOptions, TimelineProvidersChangeEvent, TimelineProvider, TimelinePaneId } from './timeline.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKey, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';

export const TimelineHasProviderContext = new RawContextKey<boolean>('timelineHasProvider', false);

export class TimelineService extends Disposable implements ITimelineService {

	declare readonly _serviceBrand: undefined;

	private readonly _onDidChangeProviders = this._register(new Emitter<TimelineProvidersChangeEvent>());
	readonly onDidChangeProviders = this._onDidChangeProviders.event;

	private readonly _onDidChangeTimeline = this._register(new Emitter<TimelineChangeEvent>());
	readonly onDidChangeTimeline = this._onDidChangeTimeline.event;

	private readonly _onDidChangeUri = this._register(new Emitter<URI>());
	readonly onDidChangeUri = this._onDidChangeUri.event;

	private readonly hasProviderContext: IContextKey<boolean>;
	private readonly providers = new Map<string, TimelineProvider>();
	private readonly providerSubscriptions = this._register(new DisposableMap<string>());

	constructor(
		@ILogService private readonly logService: ILogService,
		@IViewsService protected viewsService: IViewsService,
		@IConfigurationService protected configurationService: IConfigurationService,
		@IContextKeyService protected contextKeyService: IContextKeyService,
	) {
		super();

		this.hasProviderContext = TimelineHasProviderContext.bindTo(this.contextKeyService);
		this.updateHasProviderContext();
	}

	getSources() {
		return [...this.providers.values()].map(p => ({ id: p.id, label: p.label }));
	}

	getTimeline(id: string, uri: URI, options: TimelineOptions, tokenSource: CancellationTokenSource) {
		this.logService.trace(`TimelineService#getTimeline(${id}): uri=${uri.toString()}`);

		const provider = this.providers.get(id);
		if (provider === undefined) {
			return undefined;
		}

		if (typeof provider.scheme === 'string') {
			if (provider.scheme !== '*' && provider.scheme !== uri.scheme) {
				return undefined;
			}
		} else if (!provider.scheme.includes(uri.scheme)) {
			return undefined;
		}

		return {
			result: provider.provideTimeline(uri, options, tokenSource.token)
				.then(result => {
					if (result === undefined) {
						return undefined;
					}

					result.items = result.items.map(item => ({ ...item, source: provider.id }));
					result.items.sort((a, b) => (b.timestamp - a.timestamp) || b.source.localeCompare(a.source, undefined, { numeric: true, sensitivity: 'base' }));

					return result;
				}),
			options,
			source: provider.id,
			tokenSource,
			uri
		};
	}

	registerTimelineProvider(provider: TimelineProvider): IDisposable {
		this.logService.trace(`TimelineService#registerTimelineProvider: id=${provider.id}`);

		const id = provider.id;

		const existing = this.providers.get(id);
		if (existing) {
			// For now to deal with https://github.com/microsoft/vscode/issues/89553 allow any overwritting here (still will be blocked in the Extension Host)
			// TODO@eamodio: Ultimately will need to figure out a way to unregister providers when the Extension Host restarts/crashes
			// throw new Error(`Timeline Provider ${id} already exists.`);
			try {
				existing?.dispose();
			}
			catch { }
		}

		this.providers.set(id, provider);

		this.updateHasProviderContext();

		if (provider.onDidChange) {
			this.providerSubscriptions.set(id, provider.onDidChange(e => this._onDidChangeTimeline.fire(e)));
		}
		this._onDidChangeProviders.fire({ added: [id] });

		return {
			dispose: () => {
				this.providers.delete(id);
				this._onDidChangeProviders.fire({ removed: [id] });
			}
		};
	}

	unregisterTimelineProvider(id: string): void {
		this.logService.trace(`TimelineService#unregisterTimelineProvider: id=${id}`);

		if (!this.providers.has(id)) {
			return;
		}

		this.providers.delete(id);
		this.providerSubscriptions.deleteAndDispose(id);

		this.updateHasProviderContext();

		this._onDidChangeProviders.fire({ removed: [id] });
	}

	setUri(uri: URI) {
		this.viewsService.openView(TimelinePaneId, true);
		this._onDidChangeUri.fire(uri);
	}

	private updateHasProviderContext() {
		this.hasProviderContext.set(this.providers.size !== 0);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/typeHierarchy/browser/typeHierarchy.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/typeHierarchy/browser/typeHierarchy.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { isCancellationError } from '../../../../base/common/errors.js';
import { Event } from '../../../../base/common/event.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { ICodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { EditorAction2, EditorContributionInstantiation, registerEditorContribution, ServicesAccessor } from '../../../../editor/browser/editorExtensions.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { Position } from '../../../../editor/common/core/position.js';
import { Range } from '../../../../editor/common/core/range.js';
import { IEditorContribution } from '../../../../editor/common/editorCommon.js';
import { PeekContext } from '../../../../editor/contrib/peekView/browser/peekView.js';
import { localize, localize2 } from '../../../../nls.js';
import { MenuId, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { ContextKeyExpr, IContextKey, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { TypeHierarchyTreePeekWidget } from './typeHierarchyPeek.js';
import { TypeHierarchyDirection, TypeHierarchyModel, TypeHierarchyProviderRegistry } from '../common/typeHierarchy.js';


const _ctxHasTypeHierarchyProvider = new RawContextKey<boolean>('editorHasTypeHierarchyProvider', false, localize('editorHasTypeHierarchyProvider', 'Whether a type hierarchy provider is available'));
const _ctxTypeHierarchyVisible = new RawContextKey<boolean>('typeHierarchyVisible', false, localize('typeHierarchyVisible', 'Whether type hierarchy peek is currently showing'));
const _ctxTypeHierarchyDirection = new RawContextKey<string>('typeHierarchyDirection', undefined, { type: 'string', description: localize('typeHierarchyDirection', 'whether type hierarchy shows super types or subtypes') });

function sanitizedDirection(candidate: string): TypeHierarchyDirection {
	return candidate === TypeHierarchyDirection.Subtypes || candidate === TypeHierarchyDirection.Supertypes
		? candidate
		: TypeHierarchyDirection.Subtypes;
}

class TypeHierarchyController implements IEditorContribution {
	static readonly Id = 'typeHierarchy';

	static get(editor: ICodeEditor): TypeHierarchyController | null {
		return editor.getContribution<TypeHierarchyController>(TypeHierarchyController.Id);
	}

	private static readonly _storageDirectionKey = 'typeHierarchy/defaultDirection';

	private readonly _ctxHasProvider: IContextKey<boolean>;
	private readonly _ctxIsVisible: IContextKey<boolean>;
	private readonly _ctxDirection: IContextKey<string>;
	private readonly _disposables = new DisposableStore();
	private readonly _sessionDisposables = new DisposableStore();

	private _widget?: TypeHierarchyTreePeekWidget;

	constructor(
		readonly _editor: ICodeEditor,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService,
		@IStorageService private readonly _storageService: IStorageService,
		@ICodeEditorService private readonly _editorService: ICodeEditorService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
	) {
		this._ctxHasProvider = _ctxHasTypeHierarchyProvider.bindTo(this._contextKeyService);
		this._ctxIsVisible = _ctxTypeHierarchyVisible.bindTo(this._contextKeyService);
		this._ctxDirection = _ctxTypeHierarchyDirection.bindTo(this._contextKeyService);
		this._disposables.add(Event.any<any>(_editor.onDidChangeModel, _editor.onDidChangeModelLanguage, TypeHierarchyProviderRegistry.onDidChange)(() => {
			this._ctxHasProvider.set(_editor.hasModel() && TypeHierarchyProviderRegistry.has(_editor.getModel()));
		}));
		this._disposables.add(this._sessionDisposables);
	}

	dispose(): void {
		this._disposables.dispose();
	}

	// Peek
	async startTypeHierarchyFromEditor(): Promise<void> {
		this._sessionDisposables.clear();

		if (!this._editor.hasModel()) {
			return;
		}

		const document = this._editor.getModel();
		const position = this._editor.getPosition();
		if (!TypeHierarchyProviderRegistry.has(document)) {
			return;
		}

		const cts = new CancellationTokenSource();
		const model = TypeHierarchyModel.create(document, position, cts.token);
		const direction = sanitizedDirection(this._storageService.get(TypeHierarchyController._storageDirectionKey, StorageScope.PROFILE, TypeHierarchyDirection.Subtypes));

		this._showTypeHierarchyWidget(position, direction, model, cts);
	}

	private _showTypeHierarchyWidget(position: Position, direction: TypeHierarchyDirection, model: Promise<TypeHierarchyModel | undefined>, cts: CancellationTokenSource) {

		this._ctxIsVisible.set(true);
		this._ctxDirection.set(direction);
		Event.any<any>(this._editor.onDidChangeModel, this._editor.onDidChangeModelLanguage)(this.endTypeHierarchy, this, this._sessionDisposables);
		this._widget = this._instantiationService.createInstance(TypeHierarchyTreePeekWidget, this._editor, position, direction);
		this._widget.showLoading();
		this._sessionDisposables.add(this._widget.onDidClose(() => {
			this.endTypeHierarchy();
			this._storageService.store(TypeHierarchyController._storageDirectionKey, this._widget!.direction, StorageScope.PROFILE, StorageTarget.USER);
		}));
		this._sessionDisposables.add({ dispose() { cts.dispose(true); } });
		this._sessionDisposables.add(this._widget);

		model.then(model => {
			if (cts.token.isCancellationRequested) {
				return; // nothing
			}
			if (model) {
				this._sessionDisposables.add(model);
				this._widget!.showModel(model);
			}
			else {
				this._widget!.showMessage(localize('no.item', "No results"));
			}
		}).catch(err => {
			if (isCancellationError(err)) {
				this.endTypeHierarchy();
				return;
			}
			this._widget!.showMessage(localize('error', "Failed to show type hierarchy"));
		});
	}

	async startTypeHierarchyFromTypeHierarchy(): Promise<void> {
		if (!this._widget) {
			return;
		}
		const model = this._widget.getModel();
		const typeItem = this._widget.getFocused();
		if (!typeItem || !model) {
			return;
		}
		const newEditor = await this._editorService.openCodeEditor({ resource: typeItem.item.uri }, this._editor);
		if (!newEditor) {
			return;
		}
		const newModel = model.fork(typeItem.item);
		this._sessionDisposables.clear();

		TypeHierarchyController.get(newEditor)?._showTypeHierarchyWidget(
			Range.lift(newModel.root.selectionRange).getStartPosition(),
			this._widget.direction,
			Promise.resolve(newModel),
			new CancellationTokenSource()
		);
	}

	showSupertypes(): void {
		this._widget?.updateDirection(TypeHierarchyDirection.Supertypes);
		this._ctxDirection.set(TypeHierarchyDirection.Supertypes);
	}

	showSubtypes(): void {
		this._widget?.updateDirection(TypeHierarchyDirection.Subtypes);
		this._ctxDirection.set(TypeHierarchyDirection.Subtypes);
	}

	endTypeHierarchy(): void {
		this._sessionDisposables.clear();
		this._ctxIsVisible.set(false);
		this._editor.focus();
	}
}

registerEditorContribution(TypeHierarchyController.Id, TypeHierarchyController, EditorContributionInstantiation.Eager); // eager because it needs to define a context key

// Peek
registerAction2(class PeekTypeHierarchyAction extends EditorAction2 {

	constructor() {
		super({
			id: 'editor.showTypeHierarchy',
			title: localize2('title', 'Peek Type Hierarchy'),
			menu: {
				id: MenuId.EditorContextPeek,
				group: 'navigation',
				order: 1000,
				when: ContextKeyExpr.and(
					_ctxHasTypeHierarchyProvider,
					PeekContext.notInPeekEditor
				),
			},
			precondition: ContextKeyExpr.and(
				_ctxHasTypeHierarchyProvider,
				PeekContext.notInPeekEditor
			),
			f1: true
		});
	}

	async runEditorCommand(_accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> {
		return TypeHierarchyController.get(editor)?.startTypeHierarchyFromEditor();
	}
});

// actions for peek widget
registerAction2(class extends EditorAction2 {

	constructor() {
		super({
			id: 'editor.showSupertypes',
			title: localize2('title.supertypes', 'Show Supertypes'),
			icon: Codicon.typeHierarchySuper,
			precondition: ContextKeyExpr.and(_ctxTypeHierarchyVisible, _ctxTypeHierarchyDirection.isEqualTo(TypeHierarchyDirection.Subtypes)),
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.Shift + KeyMod.Alt + KeyCode.KeyH,
			},
			menu: {
				id: TypeHierarchyTreePeekWidget.TitleMenu,
				when: _ctxTypeHierarchyDirection.isEqualTo(TypeHierarchyDirection.Subtypes),
				order: 1,
			}
		});
	}

	runEditorCommand(_accessor: ServicesAccessor, editor: ICodeEditor) {
		return TypeHierarchyController.get(editor)?.showSupertypes();
	}
});

registerAction2(class extends EditorAction2 {

	constructor() {
		super({
			id: 'editor.showSubtypes',
			title: localize2('title.subtypes', 'Show Subtypes'),
			icon: Codicon.typeHierarchySub,
			precondition: ContextKeyExpr.and(_ctxTypeHierarchyVisible, _ctxTypeHierarchyDirection.isEqualTo(TypeHierarchyDirection.Supertypes)),
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.Shift + KeyMod.Alt + KeyCode.KeyH,
			},
			menu: {
				id: TypeHierarchyTreePeekWidget.TitleMenu,
				when: _ctxTypeHierarchyDirection.isEqualTo(TypeHierarchyDirection.Supertypes),
				order: 1,
			}
		});
	}

	runEditorCommand(_accessor: ServicesAccessor, editor: ICodeEditor) {
		return TypeHierarchyController.get(editor)?.showSubtypes();
	}
});

registerAction2(class extends EditorAction2 {

	constructor() {
		super({
			id: 'editor.refocusTypeHierarchy',
			title: localize2('title.refocusTypeHierarchy', 'Refocus Type Hierarchy'),
			precondition: _ctxTypeHierarchyVisible,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.Shift + KeyCode.Enter
			}
		});
	}

	async runEditorCommand(_accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> {
		return TypeHierarchyController.get(editor)?.startTypeHierarchyFromTypeHierarchy();
	}
});

registerAction2(class extends EditorAction2 {

	constructor() {
		super({
			id: 'editor.closeTypeHierarchy',
			title: localize('close', 'Close'),
			icon: Codicon.close,
			precondition: _ctxTypeHierarchyVisible,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib + 10,
				primary: KeyCode.Escape,
				when: ContextKeyExpr.not('config.editor.stablePeek')
			},
			menu: {
				id: TypeHierarchyTreePeekWidget.TitleMenu,
				order: 1000
			}
		});
	}

	runEditorCommand(_accessor: ServicesAccessor, editor: ICodeEditor): void {
		return TypeHierarchyController.get(editor)?.endTypeHierarchy();
	}
});
```

--------------------------------------------------------------------------------

````
