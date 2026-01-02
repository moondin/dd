---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 543
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 543 of 552)

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

---[FILE: src/vs/workbench/test/browser/quickAccess.test.ts]---
Location: vscode-main/src/vs/workbench/test/browser/quickAccess.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Registry } from '../../../platform/registry/common/platform.js';
import { IQuickAccessRegistry, Extensions, IQuickAccessProvider, QuickAccessRegistry } from '../../../platform/quickinput/common/quickAccess.js';
import { IQuickPick, IQuickPickItem, IQuickInputService } from '../../../platform/quickinput/common/quickInput.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { TestServiceAccessor, workbenchInstantiationService, createEditorPart } from './workbenchTestServices.js';
import { DisposableStore, toDisposable, IDisposable } from '../../../base/common/lifecycle.js';
import { timeout } from '../../../base/common/async.js';
import { PickerQuickAccessProvider, FastAndSlowPicks } from '../../../platform/quickinput/browser/pickerQuickAccess.js';
import { URI } from '../../../base/common/uri.js';
import { IEditorGroupsService } from '../../services/editor/common/editorGroupsService.js';
import { IEditorService } from '../../services/editor/common/editorService.js';
import { EditorService } from '../../services/editor/browser/editorService.js';
import { PickerEditorState } from '../../browser/quickaccess.js';
import { EditorsOrder } from '../../common/editor.js';
import { Range } from '../../../editor/common/core/range.js';
import { TestInstantiationService } from '../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../base/test/common/utils.js';

suite('QuickAccess', () => {

	const disposables = ensureNoDisposablesAreLeakedInTestSuite();
	let instantiationService: TestInstantiationService;
	let accessor: TestServiceAccessor;

	let providerDefaultCalled = false;
	let providerDefaultCanceled = false;
	let providerDefaultDisposed = false;

	let provider1Called = false;
	let provider1Canceled = false;
	let provider1Disposed = false;

	let provider2Called = false;
	let provider2Canceled = false;
	let provider2Disposed = false;

	let provider3Called = false;
	let provider3Canceled = false;
	let provider3Disposed = false;

	class TestProviderDefault implements IQuickAccessProvider {

		constructor(@IQuickInputService private readonly quickInputService: IQuickInputService, disposables: DisposableStore) { }

		provide(picker: IQuickPick<IQuickPickItem, { useSeparators: true }>, token: CancellationToken): IDisposable {
			assert.ok(picker);
			providerDefaultCalled = true;
			const store = new DisposableStore();
			store.add(toDisposable(() => providerDefaultDisposed = true));
			store.add(token.onCancellationRequested(() => providerDefaultCanceled = true));

			// bring up provider #3
			setTimeout(() => this.quickInputService.quickAccess.show(providerDescriptor3.prefix));

			return store;
		}
	}

	class TestProvider1 implements IQuickAccessProvider {
		provide(picker: IQuickPick<IQuickPickItem, { useSeparators: true }>, token: CancellationToken): IDisposable {
			assert.ok(picker);
			provider1Called = true;
			const store = new DisposableStore();
			store.add(token.onCancellationRequested(() => provider1Canceled = true));

			store.add(toDisposable(() => provider1Disposed = true));
			return store;
		}
	}

	class TestProvider2 implements IQuickAccessProvider {
		provide(picker: IQuickPick<IQuickPickItem, { useSeparators: true }>, token: CancellationToken): IDisposable {
			assert.ok(picker);
			provider2Called = true;
			const store = new DisposableStore();
			store.add(token.onCancellationRequested(() => provider2Canceled = true));

			store.add(toDisposable(() => provider2Disposed = true));
			return store;
		}
	}

	class TestProvider3 implements IQuickAccessProvider {
		provide(picker: IQuickPick<IQuickPickItem, { useSeparators: true }>, token: CancellationToken): IDisposable {
			assert.ok(picker);
			provider3Called = true;
			const store = new DisposableStore();
			store.add(token.onCancellationRequested(() => provider3Canceled = true));

			// hide without picking
			setTimeout(() => picker.hide());

			store.add(toDisposable(() => provider3Disposed = true));
			return store;
		}
	}

	const providerDescriptorDefault = { ctor: TestProviderDefault, prefix: '', helpEntries: [] };
	const providerDescriptor1 = { ctor: TestProvider1, prefix: 'test', helpEntries: [] };
	const providerDescriptor2 = { ctor: TestProvider2, prefix: 'test something', helpEntries: [] };
	const providerDescriptor3 = { ctor: TestProvider3, prefix: 'changed', helpEntries: [] };

	setup(() => {
		instantiationService = workbenchInstantiationService(undefined, disposables);
		accessor = instantiationService.createInstance(TestServiceAccessor);
	});

	test('registry', () => {
		const registry = (Registry.as<IQuickAccessRegistry>(Extensions.Quickaccess));
		const restore = (registry as QuickAccessRegistry).clear();

		assert.ok(!registry.getQuickAccessProvider('test'));

		const disposables = new DisposableStore();

		disposables.add(registry.registerQuickAccessProvider(providerDescriptorDefault));
		assert(registry.getQuickAccessProvider('') === providerDescriptorDefault);
		assert(registry.getQuickAccessProvider('test') === providerDescriptorDefault);

		const disposable = disposables.add(registry.registerQuickAccessProvider(providerDescriptor1));
		assert(registry.getQuickAccessProvider('test') === providerDescriptor1);

		const providers = registry.getQuickAccessProviders();
		assert(providers.some(provider => provider.prefix === 'test'));

		disposable.dispose();
		assert(registry.getQuickAccessProvider('test') === providerDescriptorDefault);

		disposables.dispose();
		assert.ok(!registry.getQuickAccessProvider('test'));

		restore();
	});

	test('provider', async () => {
		const registry = (Registry.as<IQuickAccessRegistry>(Extensions.Quickaccess));
		const restore = (registry as QuickAccessRegistry).clear();

		const disposables = new DisposableStore();

		disposables.add(registry.registerQuickAccessProvider(providerDescriptorDefault));
		disposables.add(registry.registerQuickAccessProvider(providerDescriptor1));
		disposables.add(registry.registerQuickAccessProvider(providerDescriptor2));
		disposables.add(registry.registerQuickAccessProvider(providerDescriptor3));

		accessor.quickInputService.quickAccess.show('test');
		assert.strictEqual(providerDefaultCalled, false);
		assert.strictEqual(provider1Called, true);
		assert.strictEqual(provider2Called, false);
		assert.strictEqual(provider3Called, false);
		assert.strictEqual(providerDefaultCanceled, false);
		assert.strictEqual(provider1Canceled, false);
		assert.strictEqual(provider2Canceled, false);
		assert.strictEqual(provider3Canceled, false);
		assert.strictEqual(providerDefaultDisposed, false);
		assert.strictEqual(provider1Disposed, false);
		assert.strictEqual(provider2Disposed, false);
		assert.strictEqual(provider3Disposed, false);
		provider1Called = false;

		accessor.quickInputService.quickAccess.show('test something');
		assert.strictEqual(providerDefaultCalled, false);
		assert.strictEqual(provider1Called, false);
		assert.strictEqual(provider2Called, true);
		assert.strictEqual(provider3Called, false);
		assert.strictEqual(providerDefaultCanceled, false);
		assert.strictEqual(provider1Canceled, true);
		assert.strictEqual(provider2Canceled, false);
		assert.strictEqual(provider3Canceled, false);
		assert.strictEqual(providerDefaultDisposed, false);
		assert.strictEqual(provider1Disposed, true);
		assert.strictEqual(provider2Disposed, false);
		assert.strictEqual(provider3Disposed, false);
		provider2Called = false;
		provider1Canceled = false;
		provider1Disposed = false;

		accessor.quickInputService.quickAccess.show('usedefault');
		assert.strictEqual(providerDefaultCalled, true);
		assert.strictEqual(provider1Called, false);
		assert.strictEqual(provider2Called, false);
		assert.strictEqual(provider3Called, false);
		assert.strictEqual(providerDefaultCanceled, false);
		assert.strictEqual(provider1Canceled, false);
		assert.strictEqual(provider2Canceled, true);
		assert.strictEqual(provider3Canceled, false);
		assert.strictEqual(providerDefaultDisposed, false);
		assert.strictEqual(provider1Disposed, false);
		assert.strictEqual(provider2Disposed, true);
		assert.strictEqual(provider3Disposed, false);

		await timeout(1);

		assert.strictEqual(providerDefaultCanceled, true);
		assert.strictEqual(providerDefaultDisposed, true);
		assert.strictEqual(provider3Called, true);

		await timeout(1);

		assert.strictEqual(provider3Canceled, true);
		assert.strictEqual(provider3Disposed, true);

		disposables.dispose();

		restore();
	});

	let fastProviderCalled = false;
	let slowProviderCalled = false;
	let fastAndSlowProviderCalled = false;

	let slowProviderCanceled = false;
	let fastAndSlowProviderCanceled = false;

	class FastTestQuickPickProvider extends PickerQuickAccessProvider<IQuickPickItem> {

		constructor() {
			super('fast');
		}

		protected _getPicks(filter: string, disposables: DisposableStore, token: CancellationToken): Array<IQuickPickItem> {
			fastProviderCalled = true;

			return [{ label: 'Fast Pick' }];
		}
	}

	class SlowTestQuickPickProvider extends PickerQuickAccessProvider<IQuickPickItem> {

		constructor() {
			super('slow');
		}

		protected async _getPicks(filter: string, disposables: DisposableStore, token: CancellationToken): Promise<Array<IQuickPickItem>> {
			slowProviderCalled = true;

			await timeout(1);

			if (token.isCancellationRequested) {
				slowProviderCanceled = true;
			}

			return [{ label: 'Slow Pick' }];
		}
	}

	class FastAndSlowTestQuickPickProvider extends PickerQuickAccessProvider<IQuickPickItem> {

		constructor() {
			super('bothFastAndSlow');
		}

		protected _getPicks(filter: string, disposables: DisposableStore, token: CancellationToken): FastAndSlowPicks<IQuickPickItem> {
			fastAndSlowProviderCalled = true;

			return {
				picks: [{ label: 'Fast Pick' }],
				additionalPicks: (async () => {
					await timeout(1);

					if (token.isCancellationRequested) {
						fastAndSlowProviderCanceled = true;
					}

					return [{ label: 'Slow Pick' }];
				})()
			};
		}
	}

	const fastProviderDescriptor = { ctor: FastTestQuickPickProvider, prefix: 'fast', helpEntries: [] };
	const slowProviderDescriptor = { ctor: SlowTestQuickPickProvider, prefix: 'slow', helpEntries: [] };
	const fastAndSlowProviderDescriptor = { ctor: FastAndSlowTestQuickPickProvider, prefix: 'bothFastAndSlow', helpEntries: [] };

	test('quick pick access - show()', async () => {
		const registry = (Registry.as<IQuickAccessRegistry>(Extensions.Quickaccess));
		const restore = (registry as QuickAccessRegistry).clear();

		const disposables = new DisposableStore();

		disposables.add(registry.registerQuickAccessProvider(fastProviderDescriptor));
		disposables.add(registry.registerQuickAccessProvider(slowProviderDescriptor));
		disposables.add(registry.registerQuickAccessProvider(fastAndSlowProviderDescriptor));

		accessor.quickInputService.quickAccess.show('fast');
		assert.strictEqual(fastProviderCalled, true);
		assert.strictEqual(slowProviderCalled, false);
		assert.strictEqual(fastAndSlowProviderCalled, false);
		fastProviderCalled = false;

		accessor.quickInputService.quickAccess.show('slow');
		await timeout(2);

		assert.strictEqual(fastProviderCalled, false);
		assert.strictEqual(slowProviderCalled, true);
		assert.strictEqual(slowProviderCanceled, false);
		assert.strictEqual(fastAndSlowProviderCalled, false);
		slowProviderCalled = false;

		accessor.quickInputService.quickAccess.show('bothFastAndSlow');
		await timeout(2);

		assert.strictEqual(fastProviderCalled, false);
		assert.strictEqual(slowProviderCalled, false);
		assert.strictEqual(fastAndSlowProviderCalled, true);
		assert.strictEqual(fastAndSlowProviderCanceled, false);
		fastAndSlowProviderCalled = false;

		accessor.quickInputService.quickAccess.show('slow');
		accessor.quickInputService.quickAccess.show('bothFastAndSlow');
		accessor.quickInputService.quickAccess.show('fast');

		assert.strictEqual(fastProviderCalled, true);
		assert.strictEqual(slowProviderCalled, true);
		assert.strictEqual(fastAndSlowProviderCalled, true);

		await timeout(2);
		assert.strictEqual(slowProviderCanceled, true);
		assert.strictEqual(fastAndSlowProviderCanceled, true);

		disposables.dispose();

		restore();
	});

	test('quick pick access - pick()', async () => {
		const registry = (Registry.as<IQuickAccessRegistry>(Extensions.Quickaccess));
		const restore = (registry as QuickAccessRegistry).clear();

		const disposables = new DisposableStore();

		disposables.add(registry.registerQuickAccessProvider(fastProviderDescriptor));

		const result = accessor.quickInputService.quickAccess.pick('fast');
		assert.strictEqual(fastProviderCalled, true);
		assert.ok(result instanceof Promise);

		disposables.dispose();

		restore();
	});

	test('PickerEditorState can properly restore editors', async () => {

		const part = await createEditorPart(instantiationService, disposables.add(new DisposableStore()));
		instantiationService.stub(IEditorGroupsService, part);

		const editorService = disposables.add(instantiationService.createInstance(EditorService, undefined));
		instantiationService.stub(IEditorService, editorService);

		const editorViewState = disposables.add(instantiationService.createInstance(PickerEditorState));
		disposables.add(part);
		disposables.add(editorService);

		const input1 = {
			resource: URI.parse('foo://bar1'),
			options: {
				pinned: true, preserveFocus: true, selection: new Range(1, 0, 1, 3)
			}
		};
		const input2 = {
			resource: URI.parse('foo://bar2'),
			options: {
				pinned: true, selection: new Range(1, 0, 1, 3)
			}
		};
		const input3 = {
			resource: URI.parse('foo://bar3')
		};
		const input4 = {
			resource: URI.parse('foo://bar4')
		};

		const editor = await editorService.openEditor(input1);
		assert.strictEqual(editor, editorService.activeEditorPane);
		editorViewState.set();
		await editorService.openEditor(input2);
		await editorViewState.openTransientEditor(input3);
		await editorViewState.openTransientEditor(input4);
		await editorViewState.restore();

		assert.strictEqual(part.activeGroup.activeEditor?.resource, input1.resource);
		assert.deepStrictEqual(part.activeGroup.getEditors(EditorsOrder.MOST_RECENTLY_ACTIVE).map(e => e.resource), [input1.resource, input2.resource]);
		if (part.activeGroup.activeEditorPane?.getSelection) {
			assert.deepStrictEqual(part.activeGroup.activeEditorPane?.getSelection(), input1.options.selection);
		}
		await part.activeGroup.closeAllEditors();
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/test/browser/treeview.test.ts]---
Location: vscode-main/src/vs/workbench/test/browser/treeview.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { TreeView } from '../../browser/parts/views/treeView.js';
import { workbenchInstantiationService } from './workbenchTestServices.js';
import { TestInstantiationService } from '../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { ITreeItem, IViewDescriptorService, TreeItemCollapsibleState } from '../../common/views.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../base/test/common/utils.js';
import { ViewDescriptorService } from '../../services/views/browser/viewDescriptorService.js';

suite('TreeView', function () {

	let treeView: TreeView;
	let largestBatchSize: number = 0;

	const disposables = ensureNoDisposablesAreLeakedInTestSuite();

	setup(async () => {
		largestBatchSize = 0;
		const instantiationService: TestInstantiationService = workbenchInstantiationService(undefined, disposables);
		const viewDescriptorService = disposables.add(instantiationService.createInstance(ViewDescriptorService));
		instantiationService.stub(IViewDescriptorService, viewDescriptorService);
		treeView = disposables.add(instantiationService.createInstance(TreeView, 'testTree', 'Test Title'));
		const getChildrenOfItem = async (element?: ITreeItem): Promise<ITreeItem[] | undefined> => {
			if (element) {
				return undefined;
			} else {
				const rootChildren: ITreeItem[] = [];
				for (let i = 0; i < 100; i++) {
					rootChildren.push({ handle: `item_${i}`, collapsibleState: TreeItemCollapsibleState.Expanded });
				}
				return rootChildren;
			}
		};

		treeView.dataProvider = {
			getChildren: getChildrenOfItem,
			getChildrenBatch: async (elements?: ITreeItem[]): Promise<ITreeItem[][] | undefined> => {
				if (elements && elements.length > largestBatchSize) {
					largestBatchSize = elements.length;
				}
				if (elements) {
					return Array(elements.length).fill([]);
				} else {
					return [(await getChildrenOfItem()) ?? []];
				}
			}
		};
	});

	test('children are batched', async () => {
		assert.strictEqual(largestBatchSize, 0);
		treeView.setVisibility(true);
		await treeView.refresh();
		assert.strictEqual(largestBatchSize, 100);
	});


});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/test/browser/viewlet.test.ts]---
Location: vscode-main/src/vs/workbench/test/browser/viewlet.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Registry } from '../../../platform/registry/common/platform.js';
import { PaneCompositeDescriptor, Extensions, PaneCompositeRegistry, PaneComposite } from '../../browser/panecomposite.js';
import { isFunction } from '../../../base/common/types.js';
import { IBoundarySashes } from '../../../base/browser/ui/sash/sash.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../base/test/common/utils.js';

suite('Viewlets', () => {

	class TestViewlet extends PaneComposite {

		constructor() {
			super('id', null!, null!, null!, null!, null!, null!, null!);
		}

		override layout(dimension: any): void {
			throw new Error('Method not implemented.');
		}

		override setBoundarySashes(sashes: IBoundarySashes): void {
			throw new Error('Method not implemented.');
		}

		protected override createViewPaneContainer() { return null!; }
	}

	test('ViewletDescriptor API', function () {
		const d = PaneCompositeDescriptor.create(TestViewlet, 'id', 'name', 'class', 5);
		assert.strictEqual(d.id, 'id');
		assert.strictEqual(d.name, 'name');
		assert.strictEqual(d.cssClass, 'class');
		assert.strictEqual(d.order, 5);
	});

	test('Editor Aware ViewletDescriptor API', function () {
		let d = PaneCompositeDescriptor.create(TestViewlet, 'id', 'name', 'class', 5);
		assert.strictEqual(d.id, 'id');
		assert.strictEqual(d.name, 'name');

		d = PaneCompositeDescriptor.create(TestViewlet, 'id', 'name', 'class', 5);
		assert.strictEqual(d.id, 'id');
		assert.strictEqual(d.name, 'name');
	});

	test('Viewlet extension point and registration', function () {
		assert(isFunction(Registry.as<PaneCompositeRegistry>(Extensions.Viewlets).registerPaneComposite));
		assert(isFunction(Registry.as<PaneCompositeRegistry>(Extensions.Viewlets).getPaneComposite));
		assert(isFunction(Registry.as<PaneCompositeRegistry>(Extensions.Viewlets).getPaneComposites));

		const oldCount = Registry.as<PaneCompositeRegistry>(Extensions.Viewlets).getPaneComposites().length;
		const d = PaneCompositeDescriptor.create(TestViewlet, 'reg-test-id', 'name');
		Registry.as<PaneCompositeRegistry>(Extensions.Viewlets).registerPaneComposite(d);

		assert(d === Registry.as<PaneCompositeRegistry>(Extensions.Viewlets).getPaneComposite('reg-test-id'));
		assert.strictEqual(oldCount + 1, Registry.as<PaneCompositeRegistry>(Extensions.Viewlets).getPaneComposites().length);
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/test/browser/webview.test.ts]---
Location: vscode-main/src/vs/workbench/test/browser/webview.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { parentOriginHash } from '../../../base/browser/iframe.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../base/test/common/utils.js';

suite('parentOriginHash', () => {

	test('localhost 1', async () => {
		const hash = await parentOriginHash('http://localhost:9888', '123456');
		assert.strictEqual(hash, '0fnsiac2jaup1t266qekgr7iuj4pnm31gf8r0h1o6k2lvvmfh6hk');
	});

	test('localhost 2', async () => {
		const hash = await parentOriginHash('http://localhost:9888', '123457');
		assert.strictEqual(hash, '07shf01bmdfrghk96voldpletbh36vj7blnl4td8kdq1sej5kjqs');
	});

	test('localhost 3', async () => {
		const hash = await parentOriginHash('http://localhost:9887', '123456');
		assert.strictEqual(hash, '1v1128i162q0nee9l89360sqan26u3pdnjrkke5ijd0sel8sbtqf');
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/test/browser/window.test.ts]---
Location: vscode-main/src/vs/workbench/test/browser/window.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { IRegisteredCodeWindow } from '../../../base/browser/dom.js';
import { CodeWindow, mainWindow } from '../../../base/browser/window.js';
import { DisposableStore } from '../../../base/common/lifecycle.js';
import { runWithFakedTimers } from '../../../base/test/common/timeTravelScheduler.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../base/test/common/utils.js';
import { BaseWindow } from '../../browser/window.js';
import { TestContextMenuService, TestEnvironmentService, TestHostService, TestLayoutService } from './workbenchTestServices.js';

suite('Window', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	class TestWindow extends BaseWindow {

		constructor(window: CodeWindow, dom: { getWindowsCount: () => number; getWindows: () => Iterable<IRegisteredCodeWindow> }) {
			super(window, dom, new TestHostService(), TestEnvironmentService, new TestContextMenuService(), new TestLayoutService());
		}

		protected override enableWindowFocusOnElementFocus(): void { }
	}

	test('multi window aware setTimeout()', async function () {
		return runWithFakedTimers({ useFakeTimers: true }, async () => {
			const disposables = new DisposableStore();

			let windows: IRegisteredCodeWindow[] = [];
			const dom = {
				getWindowsCount: () => windows.length,
				getWindows: () => windows
			};

			const setTimeoutCalls: number[] = [];
			const clearTimeoutCalls: number[] = [];

			function createWindow(id: number, slow?: boolean) {
				// eslint-disable-next-line local/code-no-any-casts
				const res = {
					setTimeout: function (callback: Function, delay: number, ...args: any[]): number {
						setTimeoutCalls.push(id);

						return mainWindow.setTimeout(() => callback(id), slow ? delay * 2 : delay, ...args);
					},
					clearTimeout: function (timeoutId: number): void {
						clearTimeoutCalls.push(id);

						return mainWindow.clearTimeout(timeoutId);
					}
				} as any;

				disposables.add(new TestWindow(res, dom));

				return res;
			}

			const window1 = createWindow(1);
			windows = [{ window: window1, disposables }];

			// Window Count: 1

			let called = false;
			await new Promise<void>((resolve, reject) => {
				window1.setTimeout(() => {
					if (!called) {
						called = true;
						resolve();
					} else {
						reject(new Error('timeout called twice'));
					}
				}, 1);
			});

			assert.strictEqual(called, true);
			assert.deepStrictEqual(setTimeoutCalls, [1]);
			assert.deepStrictEqual(clearTimeoutCalls, []);
			called = false;
			setTimeoutCalls.length = 0;
			clearTimeoutCalls.length = 0;

			await new Promise<void>((resolve, reject) => {
				window1.setTimeout(() => {
					if (!called) {
						called = true;
						resolve();
					} else {
						reject(new Error('timeout called twice'));
					}
				}, 0);
			});

			assert.strictEqual(called, true);
			assert.deepStrictEqual(setTimeoutCalls, [1]);
			assert.deepStrictEqual(clearTimeoutCalls, []);
			called = false;
			setTimeoutCalls.length = 0;
			clearTimeoutCalls.length = 0;

			// Window Count: 3

			let window2 = createWindow(2);
			const window3 = createWindow(3);
			windows = [
				{ window: window2, disposables },
				{ window: window1, disposables },
				{ window: window3, disposables }
			];

			await new Promise<void>((resolve, reject) => {
				window1.setTimeout(() => {
					if (!called) {
						called = true;
						resolve();
					} else {
						reject(new Error('timeout called twice'));
					}
				}, 1);
			});

			assert.strictEqual(called, true);
			assert.deepStrictEqual(setTimeoutCalls, [2, 1, 3]);
			assert.deepStrictEqual(clearTimeoutCalls, [2, 1, 3]);
			called = false;
			setTimeoutCalls.length = 0;
			clearTimeoutCalls.length = 0;

			// Window Count: 2 (1 fast, 1 slow)

			window2 = createWindow(2, true);
			windows = [
				{ window: window2, disposables },
				{ window: window1, disposables },
			];

			await new Promise<void>((resolve, reject) => {
				window1.setTimeout((windowId: number) => {
					if (!called && windowId === 1) {
						called = true;
						resolve();
					} else if (called) {
						reject(new Error('timeout called twice'));
					} else {
						reject(new Error('timeout called for wrong window'));
					}
				}, 1);
			});

			assert.strictEqual(called, true);
			assert.deepStrictEqual(setTimeoutCalls, [2, 1]);
			assert.deepStrictEqual(clearTimeoutCalls, [2, 1]);
			called = false;
			setTimeoutCalls.length = 0;
			clearTimeoutCalls.length = 0;

			disposables.dispose();
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/test/browser/workbenchTestServices.ts]---
Location: vscode-main/src/vs/workbench/test/browser/workbenchTestServices.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IContextMenuDelegate } from '../../../base/browser/contextmenu.js';
import { IDimension } from '../../../base/browser/dom.js';
import { Direction, IViewSize } from '../../../base/browser/ui/grid/grid.js';
import { mainWindow } from '../../../base/browser/window.js';
import { DeferredPromise, timeout } from '../../../base/common/async.js';
import { VSBuffer, VSBufferReadable, VSBufferReadableStream } from '../../../base/common/buffer.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { Codicon } from '../../../base/common/codicons.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { isValidBasename } from '../../../base/common/extpath.js';
import { IMarkdownString } from '../../../base/common/htmlContent.js';
import { Disposable, DisposableStore, IDisposable } from '../../../base/common/lifecycle.js';
import { Schemas } from '../../../base/common/network.js';
import { posix, win32 } from '../../../base/common/path.js';
import { IProcessEnvironment, isWindows, OperatingSystem } from '../../../base/common/platform.js';
import { env } from '../../../base/common/process.js';
import { basename, isEqual } from '../../../base/common/resources.js';
import { newWriteableStream, ReadableStreamEvents } from '../../../base/common/stream.js';
import { ThemeIcon } from '../../../base/common/themables.js';
import { assertReturnsDefined, upcast } from '../../../base/common/types.js';
import { URI } from '../../../base/common/uri.js';
import { ICodeEditor } from '../../../editor/browser/editorBrowser.js';
import { ICodeEditorService } from '../../../editor/browser/services/codeEditorService.js';
import { IMarkdownRendererService, MarkdownRendererService } from '../../../platform/markdown/browser/markdownRenderer.js';
import { Position as EditorPosition, IPosition } from '../../../editor/common/core/position.js';
import { Range } from '../../../editor/common/core/range.js';
import { Selection } from '../../../editor/common/core/selection.js';
import { IDiffEditor, IEditor } from '../../../editor/common/editorCommon.js';
import { ILanguageService } from '../../../editor/common/languages/language.js';
import { ILanguageConfigurationService } from '../../../editor/common/languages/languageConfigurationRegistry.js';
import { DefaultEndOfLine, EndOfLinePreference, ITextBufferFactory, ITextSnapshot } from '../../../editor/common/model.js';
import { createTextBufferFactoryFromStream } from '../../../editor/common/model/textModel.js';
import { IEditorWorkerService } from '../../../editor/common/services/editorWorker.js';
import { ILanguageFeatureDebounceService, LanguageFeatureDebounceService } from '../../../editor/common/services/languageFeatureDebounce.js';
import { ILanguageFeaturesService } from '../../../editor/common/services/languageFeatures.js';
import { LanguageFeaturesService } from '../../../editor/common/services/languageFeaturesService.js';
import { LanguageService } from '../../../editor/common/services/languageService.js';
import { IModelService } from '../../../editor/common/services/model.js';
import { ModelService } from '../../../editor/common/services/modelService.js';
import { ITextModelService } from '../../../editor/common/services/resolverService.js';
import { ITextResourceConfigurationService, ITextResourcePropertiesService } from '../../../editor/common/services/textResourceConfiguration.js';
import { ITreeSitterLibraryService } from '../../../editor/common/services/treeSitter/treeSitterLibraryService.js';
import { TestCodeEditor } from '../../../editor/test/browser/testCodeEditor.js';
import { TestLanguageConfigurationService } from '../../../editor/test/common/modes/testLanguageConfigurationService.js';
import { TestEditorWorkerService } from '../../../editor/test/common/services/testEditorWorkerService.js';
import { TestTreeSitterLibraryService } from '../../../editor/test/common/services/testTreeSitterLibraryService.js';
import { IAccessibilityService } from '../../../platform/accessibility/common/accessibility.js';
import { TestAccessibilityService } from '../../../platform/accessibility/test/common/testAccessibilityService.js';
import { IAccessibilitySignalService } from '../../../platform/accessibilitySignal/browser/accessibilitySignalService.js';
import { IActionViewItemService, NullActionViewItemService } from '../../../platform/actions/browser/actionViewItemService.js';
import { IMenu, IMenuActionOptions, IMenuChangeEvent, IMenuService, MenuId, MenuItemAction, SubmenuItemAction } from '../../../platform/actions/common/actions.js';
import { IFolderBackupInfo, IWorkspaceBackupInfo } from '../../../platform/backup/common/backup.js';
import { ConfigurationTarget, IConfigurationService, IConfigurationValue } from '../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../platform/configuration/test/common/testConfigurationService.js';
import { ContextKeyValue, IContextKeyService } from '../../../platform/contextkey/common/contextkey.js';
import { ContextMenuService } from '../../../platform/contextview/browser/contextMenuService.js';
import { IContextMenuMenuDelegate, IContextMenuService, IContextViewService } from '../../../platform/contextview/browser/contextView.js';
import { ContextViewService } from '../../../platform/contextview/browser/contextViewService.js';
import { IDiagnosticInfo, IDiagnosticInfoOptions } from '../../../platform/diagnostics/common/diagnostics.js';
import { ConfirmResult, IDialogService, IFileDialogService, IOpenDialogOptions, IPickAndOpenOptions, ISaveDialogOptions } from '../../../platform/dialogs/common/dialogs.js';
import { TestDialogService } from '../../../platform/dialogs/test/common/testDialogService.js';
import { IEditorOptions, IResourceEditorInput, IResourceEditorInputIdentifier, ITextEditorOptions, ITextResourceEditorInput } from '../../../platform/editor/common/editor.js';
import { IEnvironmentService } from '../../../platform/environment/common/environment.js';
import { IExtensionManagementParticipant, IExtensionsControlManifest, IGalleryExtension, IGalleryMetadata, ILocalExtension, InstallExtensionInfo, InstallExtensionResult, InstallExtensionSummary, InstallOptions, Metadata, UninstallExtensionInfo, UninstallOptions } from '../../../platform/extensionManagement/common/extensionManagement.js';
import { ExtensionType, IExtension, IExtensionDescription, IRelaxedExtensionManifest, TargetPlatform } from '../../../platform/extensions/common/extensions.js';
import { FileOperationError, FileSystemProviderCapabilities, FileType, IFileChange, IFileDeleteOptions, IFileOpenOptions, IFileOverwriteOptions, IFileReadStreamOptions, IFileService, IFileStatWithMetadata, IFileSystemProvider, IFileSystemProviderWithFileReadStreamCapability, IFileWriteOptions, IStat, IWatchOptions } from '../../../platform/files/common/files.js';
import { FileService } from '../../../platform/files/common/fileService.js';
import { InMemoryFileSystemProvider } from '../../../platform/files/common/inMemoryFilesystemProvider.js';
import { IHoverService } from '../../../platform/hover/browser/hover.js';
import { NullHoverService } from '../../../platform/hover/test/browser/nullHoverService.js';
import { SyncDescriptor } from '../../../platform/instantiation/common/descriptors.js';
import { IInstantiationService, ServiceIdentifier } from '../../../platform/instantiation/common/instantiation.js';
import { ServiceCollection } from '../../../platform/instantiation/common/serviceCollection.js';
import { TestInstantiationService } from '../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { IKeybindingService } from '../../../platform/keybinding/common/keybinding.js';
import { MockContextKeyService, MockKeybindingService } from '../../../platform/keybinding/test/common/mockKeybindingService.js';
import { ILabelService } from '../../../platform/label/common/label.js';
import { ILayoutOffsetInfo } from '../../../platform/layout/browser/layoutService.js';
import { IListService } from '../../../platform/list/browser/listService.js';
import { ILoggerService, ILogService, NullLogService } from '../../../platform/log/common/log.js';
import { IMarkerService } from '../../../platform/markers/common/markers.js';
import { INotificationService } from '../../../platform/notification/common/notification.js';
import { TestNotificationService } from '../../../platform/notification/test/common/testNotificationService.js';
import product from '../../../platform/product/common/product.js';
import { IProductService } from '../../../platform/product/common/productService.js';
import { IProgress, IProgressCompositeOptions, IProgressDialogOptions, IProgressIndicator, IProgressNotificationOptions, IProgressOptions, IProgressService, IProgressStep, IProgressWindowOptions, Progress } from '../../../platform/progress/common/progress.js';
import { IInputBox, IInputOptions, IPickOptions, IQuickInputButton, IQuickInputService, IQuickNavigateConfiguration, IQuickPick, IQuickPickItem, IQuickTree, IQuickTreeItem, IQuickWidget, QuickPickInput } from '../../../platform/quickinput/common/quickInput.js';
import { Registry } from '../../../platform/registry/common/platform.js';
import { IRemoteAgentEnvironment } from '../../../platform/remote/common/remoteAgentEnvironment.js';
import { IRemoteExtensionsScannerService } from '../../../platform/remote/common/remoteExtensionsScanner.js';
import { IRemoteSocketFactoryService, RemoteSocketFactoryService } from '../../../platform/remote/common/remoteSocketFactoryService.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../platform/storage/common/storage.js';
import { ITelemetryData, ITelemetryService, TelemetryLevel } from '../../../platform/telemetry/common/telemetry.js';
import { NullTelemetryService } from '../../../platform/telemetry/common/telemetryUtils.js';
import { IExtensionTerminalProfile, IShellLaunchConfig, ITerminalBackend, ITerminalLogService, ITerminalProfile, TerminalIcon, TerminalLocation, TerminalShellType } from '../../../platform/terminal/common/terminal.js';
import { TerminalLogService } from '../../../platform/terminal/common/terminalLogService.js';
import { ColorScheme } from '../../../platform/theme/common/theme.js';
import { IThemeService } from '../../../platform/theme/common/themeService.js';
import { TestThemeService } from '../../../platform/theme/test/common/testThemeService.js';
import { IUndoRedoService } from '../../../platform/undoRedo/common/undoRedo.js';
import { UndoRedoService } from '../../../platform/undoRedo/common/undoRedoService.js';
import { IUriIdentityService } from '../../../platform/uriIdentity/common/uriIdentity.js';
import { UriIdentityService } from '../../../platform/uriIdentity/common/uriIdentityService.js';
import { IUserDataProfile, IUserDataProfilesService, UserDataProfilesService } from '../../../platform/userDataProfile/common/userDataProfile.js';
import { IOpenEmptyWindowOptions, IOpenWindowOptions, IRectangle, IWindowOpenable, MenuBarVisibility } from '../../../platform/window/common/window.js';
import { IWorkspaceContextService, IWorkspaceIdentifier } from '../../../platform/workspace/common/workspace.js';
import { IWorkspaceTrustManagementService, IWorkspaceTrustRequestService } from '../../../platform/workspace/common/workspaceTrust.js';
import { TestWorkspace } from '../../../platform/workspace/test/common/testWorkspace.js';
import { IEnterWorkspaceResult, IRecent, IRecentlyOpened, IWorkspaceFolderCreationData, IWorkspacesService } from '../../../platform/workspaces/common/workspaces.js';
import { EditorPaneDescriptor, IEditorPaneRegistry } from '../../browser/editor.js';
import { PaneComposite, PaneCompositeDescriptor } from '../../browser/panecomposite.js';
import { Part } from '../../browser/part.js';
import { DEFAULT_EDITOR_PART_OPTIONS, EditorServiceImpl, IEditorGroupsView, IEditorGroupTitleHeight, IEditorGroupView } from '../../browser/parts/editor/editor.js';
import { EditorPane } from '../../browser/parts/editor/editorPane.js';
import { MainEditorPart } from '../../browser/parts/editor/editorPart.js';
import { EditorParts } from '../../browser/parts/editor/editorParts.js';
import { SideBySideEditor } from '../../browser/parts/editor/sideBySideEditor.js';
import { TextEditorPaneSelection } from '../../browser/parts/editor/textEditor.js';
import { TextResourceEditor } from '../../browser/parts/editor/textResourceEditor.js';
import { IPaneCompositePart } from '../../browser/parts/paneCompositePart.js';
import { EditorExtensions, EditorInputCapabilities, EditorInputWithOptions, EditorPaneSelectionChangeReason, EditorsOrder, EditorExtensions as Extensions, GroupIdentifier, IActiveEditorChangeEvent, IEditorCloseEvent, IEditorFactoryRegistry, IEditorIdentifier, IEditorOpenContext, IEditorPane, IEditorPaneSelection, IEditorPartOptions, IEditorSerializer, IEditorWillMoveEvent, IEditorWillOpenEvent, IFileEditorInput, IMoveResult, IResourceDiffEditorInput, IRevertOptions, ISaveOptions, ITextDiffEditorPane, IToolbarActions, IUntitledTextResourceEditorInput, IUntypedEditorInput, IVisibleEditorPane } from '../../common/editor.js';
import { IGroupModelChangeEvent } from '../../common/editor/editorGroupModel.js';
import { EditorInput } from '../../common/editor/editorInput.js';
import { SideBySideEditorInput } from '../../common/editor/sideBySideEditorInput.js';
import { TextResourceEditorInput } from '../../common/editor/textResourceEditorInput.js';
import { IPaneComposite } from '../../common/panecomposite.js';
import { IView, IViewDescriptor, ViewContainer, ViewContainerLocation } from '../../common/views.js';
import { FileEditorInput } from '../../contrib/files/browser/editors/fileEditorInput.js';
import { TextFileEditor } from '../../contrib/files/browser/editors/textFileEditor.js';
import { FILE_EDITOR_INPUT_ID } from '../../contrib/files/common/files.js';
import { ICreateTerminalOptions, IDeserializedTerminalEditorInput, ITerminalConfigurationService, ITerminalEditorService, ITerminalGroup, ITerminalGroupService, ITerminalInstance, ITerminalInstanceService, TerminalEditorLocation } from '../../contrib/terminal/browser/terminal.js';
import { TerminalConfigurationService } from '../../contrib/terminal/browser/terminalConfigurationService.js';
import { TerminalEditorInput } from '../../contrib/terminal/browser/terminalEditorInput.js';
import { IEnvironmentVariableService } from '../../contrib/terminal/common/environmentVariable.js';
import { EnvironmentVariableService } from '../../contrib/terminal/common/environmentVariableService.js';
import { IRegisterContributedProfileArgs, IShellLaunchConfigResolveOptions, ITerminalProfileProvider, ITerminalProfileResolverService, ITerminalProfileService, type ITerminalConfiguration } from '../../contrib/terminal/common/terminal.js';
import { IChatEntitlementService } from '../../services/chat/common/chatEntitlementService.js';
import { IDecoration, IDecorationData, IDecorationsProvider, IDecorationsService, IResourceDecorationChangeEvent } from '../../services/decorations/common/decorations.js';
import { CodeEditorService } from '../../services/editor/browser/codeEditorService.js';
import { EditorPaneService } from '../../services/editor/browser/editorPaneService.js';
import { EditorResolverService } from '../../services/editor/browser/editorResolverService.js';
import { CustomEditorLabelService, ICustomEditorLabelService } from '../../services/editor/common/customEditorLabelService.js';
import { EditorGroupLayout, GroupDirection, GroupOrientation, GroupsArrangement, GroupsOrder, IAuxiliaryEditorPart, ICloseAllEditorsOptions, ICloseEditorOptions, ICloseEditorsFilter, IEditorDropTargetDelegate, IEditorGroup, IEditorGroupContextKeyProvider, IEditorGroupsContainer, IEditorGroupsService, IEditorPart, IEditorReplacement, IEditorWorkingSet, IEditorWorkingSetOptions, IFindGroupScope, IMergeGroupOptions } from '../../services/editor/common/editorGroupsService.js';
import { IEditorPaneService } from '../../services/editor/common/editorPaneService.js';
import { IEditorResolverService } from '../../services/editor/common/editorResolverService.js';
import { IEditorsChangeEvent, IEditorService, IRevertAllEditorsOptions, ISaveEditorsOptions, ISaveEditorsResult, PreferredGroup } from '../../services/editor/common/editorService.js';
import { BrowserWorkbenchEnvironmentService } from '../../services/environment/browser/environmentService.js';
import { IWorkbenchEnvironmentService } from '../../services/environment/common/environmentService.js';
import { EnablementState, IExtensionManagementServer, IResourceExtension, IScannedExtension, IWebExtensionsScannerService, IWorkbenchExtensionEnablementService, IWorkbenchExtensionManagementService } from '../../services/extensionManagement/common/extensionManagement.js';
import { IExtensionService } from '../../services/extensions/common/extensions.js';
import { BrowserElevatedFileService } from '../../services/files/browser/elevatedFileService.js';
import { IElevatedFileService } from '../../services/files/common/elevatedFileService.js';
import { FilesConfigurationService, IFilesConfigurationService } from '../../services/filesConfiguration/common/filesConfigurationService.js';
import { IHistoryService } from '../../services/history/common/history.js';
import { IHostService } from '../../services/host/browser/host.js';
import { LabelService } from '../../services/label/common/labelService.js';
import { ILanguageDetectionService } from '../../services/languageDetection/common/languageDetectionWorkerService.js';
import { IWorkbenchLayoutService, PanelAlignment, Position as PartPosition, Parts } from '../../services/layout/browser/layoutService.js';
import { BeforeShutdownErrorEvent, ILifecycleService, InternalBeforeShutdownEvent, IWillShutdownEventJoiner, LifecyclePhase, ShutdownReason, StartupKind, WillShutdownEvent } from '../../services/lifecycle/common/lifecycle.js';
import { IPaneCompositePartService } from '../../services/panecomposite/browser/panecomposite.js';
import { IPathService } from '../../services/path/common/pathService.js';
import { QuickInputService } from '../../services/quickinput/browser/quickInputService.js';
import { IExtensionHostExitInfo, IRemoteAgentConnection, IRemoteAgentService } from '../../services/remote/common/remoteAgentService.js';
import { BrowserTextFileService } from '../../services/textfile/browser/browserTextFileService.js';
import { EncodingOracle, IEncodingOverride } from '../../services/textfile/browser/textFileService.js';
import { UTF16be, UTF16le, UTF8_with_bom } from '../../services/textfile/common/encoding.js';
import { ITextEditorService, TextEditorService } from '../../services/textfile/common/textEditorService.js';
import { TextFileEditorModel } from '../../services/textfile/common/textFileEditorModel.js';
import { IReadTextFileOptions, ITextFileEditorModel, ITextFileEditorModelManager, ITextFileService, ITextFileStreamContent, IWriteTextFileOptions } from '../../services/textfile/common/textfiles.js';
import { TextModelResolverService } from '../../services/textmodelResolver/common/textModelResolverService.js';
import { UntitledTextEditorInput } from '../../services/untitled/common/untitledTextEditorInput.js';
import { IUntitledTextEditorModelManager, IUntitledTextEditorService, UntitledTextEditorService } from '../../services/untitled/common/untitledTextEditorService.js';
import { IUserDataProfileService } from '../../services/userDataProfile/common/userDataProfile.js';
import { UserDataProfileService } from '../../services/userDataProfile/common/userDataProfileService.js';
import { IViewsService } from '../../services/views/common/viewsService.js';
import { BrowserWorkingCopyBackupService } from '../../services/workingCopy/browser/workingCopyBackupService.js';
import { IWorkingCopy, IWorkingCopyBackupMeta, IWorkingCopyIdentifier } from '../../services/workingCopy/common/workingCopy.js';
import { IResolvedWorkingCopyBackup, IWorkingCopyBackupService } from '../../services/workingCopy/common/workingCopyBackup.js';
import { InMemoryWorkingCopyBackupService } from '../../services/workingCopy/common/workingCopyBackupService.js';
import { IWorkingCopyEditorService, WorkingCopyEditorService } from '../../services/workingCopy/common/workingCopyEditorService.js';
import { IWorkingCopyFileService, WorkingCopyFileService } from '../../services/workingCopy/common/workingCopyFileService.js';
import { IWorkingCopyService, WorkingCopyService } from '../../services/workingCopy/common/workingCopyService.js';
import { TestChatEntitlementService, TestContextService, TestExtensionService, TestFileService, TestHistoryService, TestLoggerService, TestMarkerService, TestProductService, TestStorageService, TestTextResourcePropertiesService, TestWorkspaceTrustManagementService, TestWorkspaceTrustRequestService } from '../common/workbenchTestServices.js';

// Backcompat export
export { TestFileService };

export function createFileEditorInput(instantiationService: IInstantiationService, resource: URI): FileEditorInput {
	return instantiationService.createInstance(FileEditorInput, resource, undefined, undefined, undefined, undefined, undefined, undefined);
}

Registry.as<IEditorFactoryRegistry>(EditorExtensions.EditorFactory).registerFileEditorFactory({

	typeId: FILE_EDITOR_INPUT_ID,

	createFileEditor: (resource, preferredResource, preferredName, preferredDescription, preferredEncoding, preferredLanguageId, preferredContents, instantiationService): IFileEditorInput => {
		return instantiationService.createInstance(FileEditorInput, resource, preferredResource, preferredName, preferredDescription, preferredEncoding, preferredLanguageId, preferredContents);
	},

	isFileEditor: (obj): obj is IFileEditorInput => {
		return obj instanceof FileEditorInput;
	}
});

export class TestTextResourceEditor extends TextResourceEditor {

	protected override createEditorControl(parent: HTMLElement, configuration: any): void {
		this.editorControl = this._register(this.instantiationService.createInstance(TestCodeEditor, parent, configuration, {}));
	}
}

export class TestTextFileEditor extends TextFileEditor {

	protected override createEditorControl(parent: HTMLElement, configuration: any): void {
		this.editorControl = this._register(this.instantiationService.createInstance(TestCodeEditor, parent, configuration, { contributions: [] }));
	}

	setSelection(selection: Selection | undefined, reason: EditorPaneSelectionChangeReason): void {
		this._options = selection ? upcast<IEditorOptions, ITextEditorOptions>({ selection }) : undefined;

		this._onDidChangeSelection.fire({ reason });
	}

	override getSelection(): IEditorPaneSelection | undefined {
		const options = this.options;
		if (!options) {
			return undefined;
		}

		const textSelection = (options as ITextEditorOptions).selection;
		if (!textSelection) {
			return undefined;
		}

		return new TextEditorPaneSelection(new Selection(textSelection.startLineNumber, textSelection.startColumn, textSelection.endLineNumber ?? textSelection.startLineNumber, textSelection.endColumn ?? textSelection.startColumn));
	}
}

export interface ITestInstantiationService extends IInstantiationService {
	stub<T>(service: ServiceIdentifier<T>, ctor: any): T;
}

export class TestWorkingCopyService extends WorkingCopyService {
	testUnregisterWorkingCopy(workingCopy: IWorkingCopy): void {
		return super.unregisterWorkingCopy(workingCopy);
	}
}

export function workbenchInstantiationService(
	overrides?: {
		environmentService?: (instantiationService: IInstantiationService) => IEnvironmentService;
		fileService?: (instantiationService: IInstantiationService) => IFileService;
		workingCopyBackupService?: (instantiationService: IInstantiationService) => IWorkingCopyBackupService;
		configurationService?: (instantiationService: IInstantiationService) => TestConfigurationService;
		textFileService?: (instantiationService: IInstantiationService) => ITextFileService;
		pathService?: (instantiationService: IInstantiationService) => IPathService;
		editorService?: (instantiationService: IInstantiationService) => IEditorService;
		contextKeyService?: (instantiationService: IInstantiationService) => IContextKeyService;
		textEditorService?: (instantiationService: IInstantiationService) => ITextEditorService;
	},
	disposables: Pick<DisposableStore, 'add'> = new DisposableStore()
): TestInstantiationService {
	const instantiationService = disposables.add(new TestInstantiationService(new ServiceCollection(
		[ILifecycleService, disposables.add(new TestLifecycleService())],
		[IActionViewItemService, new SyncDescriptor(NullActionViewItemService)],
	)));

	instantiationService.stub(IProductService, TestProductService);
	instantiationService.stub(IEditorWorkerService, new TestEditorWorkerService());
	instantiationService.stub(IWorkingCopyService, disposables.add(new TestWorkingCopyService()));
	const environmentService = overrides?.environmentService ? overrides.environmentService(instantiationService) : TestEnvironmentService;
	instantiationService.stub(IEnvironmentService, environmentService);
	instantiationService.stub(IWorkbenchEnvironmentService, environmentService);
	instantiationService.stub(ILogService, new NullLogService());
	const contextKeyService = overrides?.contextKeyService ? overrides.contextKeyService(instantiationService) : instantiationService.createInstance(MockContextKeyService);
	instantiationService.stub(IContextKeyService, contextKeyService);
	instantiationService.stub(IProgressService, new TestProgressService());
	const workspaceContextService = new TestContextService(TestWorkspace);
	instantiationService.stub(IWorkspaceContextService, workspaceContextService);
	const configService = overrides?.configurationService ? overrides.configurationService(instantiationService) : new TestConfigurationService({
		files: {
			participants: {
				timeout: 60000
			}
		}
	});
	instantiationService.stub(IConfigurationService, configService);
	const textResourceConfigurationService = new TestTextResourceConfigurationService(configService);
	instantiationService.stub(ITextResourceConfigurationService, textResourceConfigurationService);
	instantiationService.stub(IUntitledTextEditorService, disposables.add(instantiationService.createInstance(UntitledTextEditorService)));
	instantiationService.stub(IStorageService, disposables.add(new TestStorageService()));
	instantiationService.stub(IRemoteAgentService, new TestRemoteAgentService());
	instantiationService.stub(ILanguageDetectionService, new TestLanguageDetectionService());
	instantiationService.stub(IPathService, overrides?.pathService ? overrides.pathService(instantiationService) : new TestPathService());
	const layoutService = new TestLayoutService();
	instantiationService.stub(IWorkbenchLayoutService, layoutService);
	instantiationService.stub(IDialogService, new TestDialogService());
	const accessibilityService = new TestAccessibilityService();
	instantiationService.stub(IAccessibilityService, accessibilityService);
	// eslint-disable-next-line local/code-no-any-casts
	instantiationService.stub(IAccessibilitySignalService, {
		playSignal: async () => { },
		isSoundEnabled(signal: unknown) { return false; },
	} as any);
	instantiationService.stub(IFileDialogService, instantiationService.createInstance(TestFileDialogService));
	instantiationService.stub(ILanguageService, disposables.add(instantiationService.createInstance(LanguageService)));
	instantiationService.stub(ILanguageFeaturesService, new LanguageFeaturesService());
	instantiationService.stub(ILanguageFeatureDebounceService, instantiationService.createInstance(LanguageFeatureDebounceService));
	instantiationService.stub(IHistoryService, new TestHistoryService());
	instantiationService.stub(ITextResourcePropertiesService, new TestTextResourcePropertiesService(configService));
	instantiationService.stub(IUndoRedoService, instantiationService.createInstance(UndoRedoService));
	const themeService = new TestThemeService();
	instantiationService.stub(IThemeService, themeService);
	instantiationService.stub(ILanguageConfigurationService, disposables.add(new TestLanguageConfigurationService()));
	instantiationService.stub(ITreeSitterLibraryService, new TestTreeSitterLibraryService());
	instantiationService.stub(IModelService, disposables.add(instantiationService.createInstance(ModelService)));
	const fileService = overrides?.fileService ? overrides.fileService(instantiationService) : disposables.add(new TestFileService());
	instantiationService.stub(IFileService, fileService);
	instantiationService.stub(IUriIdentityService, disposables.add(new UriIdentityService(fileService)));
	const markerService = new TestMarkerService();
	instantiationService.stub(IMarkerService, markerService);
	instantiationService.stub(IFilesConfigurationService, disposables.add(instantiationService.createInstance(TestFilesConfigurationService)));
	const userDataProfilesService = instantiationService.stub(IUserDataProfilesService, disposables.add(instantiationService.createInstance(UserDataProfilesService)));
	instantiationService.stub(IUserDataProfileService, disposables.add(new UserDataProfileService(userDataProfilesService.defaultProfile)));
	instantiationService.stub(IWorkingCopyBackupService, overrides?.workingCopyBackupService ? overrides?.workingCopyBackupService(instantiationService) : disposables.add(new TestWorkingCopyBackupService()));
	instantiationService.stub(ITelemetryService, NullTelemetryService);
	instantiationService.stub(INotificationService, new TestNotificationService());
	instantiationService.stub(IUntitledTextEditorService, disposables.add(instantiationService.createInstance(UntitledTextEditorService)));
	instantiationService.stub(IMenuService, new TestMenuService());
	const keybindingService = new MockKeybindingService();
	instantiationService.stub(IKeybindingService, keybindingService);
	instantiationService.stub(IDecorationsService, new TestDecorationsService());
	instantiationService.stub(IExtensionService, new TestExtensionService());
	instantiationService.stub(IWorkingCopyFileService, disposables.add(instantiationService.createInstance(WorkingCopyFileService)));
	instantiationService.stub(ITextFileService, overrides?.textFileService ? overrides.textFileService(instantiationService) : disposables.add(<ITextFileService>instantiationService.createInstance(TestTextFileService)));
	instantiationService.stub(IHostService, <IHostService>instantiationService.createInstance(TestHostService));
	instantiationService.stub(ITextModelService, <ITextModelService>disposables.add(instantiationService.createInstance(TextModelResolverService)));
	instantiationService.stub(ILoggerService, disposables.add(new TestLoggerService(TestEnvironmentService.logsHome)));
	const editorGroupService = new TestEditorGroupsService([new TestEditorGroupView(0)]);
	instantiationService.stub(IEditorGroupsService, editorGroupService);
	instantiationService.stub(ILabelService, <ILabelService>disposables.add(instantiationService.createInstance(LabelService)));
	const editorService = overrides?.editorService ? overrides.editorService(instantiationService) : disposables.add(new TestEditorService(editorGroupService));
	instantiationService.stub(IEditorService, editorService);
	instantiationService.stub(IEditorPaneService, new EditorPaneService());
	instantiationService.stub(IWorkingCopyEditorService, disposables.add(instantiationService.createInstance(WorkingCopyEditorService)));
	instantiationService.stub(IEditorResolverService, disposables.add(instantiationService.createInstance(EditorResolverService)));
	const textEditorService = overrides?.textEditorService ? overrides.textEditorService(instantiationService) : disposables.add(instantiationService.createInstance(TextEditorService));
	instantiationService.stub(ITextEditorService, textEditorService);
	instantiationService.stub(ICodeEditorService, disposables.add(new CodeEditorService(editorService, themeService, configService)));
	instantiationService.stub(IPaneCompositePartService, disposables.add(new TestPaneCompositeService()));
	instantiationService.stub(IListService, new TestListService());
	instantiationService.stub(IContextViewService, disposables.add(instantiationService.createInstance(ContextViewService)));
	instantiationService.stub(IContextMenuService, disposables.add(instantiationService.createInstance(ContextMenuService)));
	instantiationService.stub(IQuickInputService, disposables.add(new QuickInputService(configService, instantiationService, keybindingService, contextKeyService, themeService, layoutService)));
	instantiationService.stub(IWorkspacesService, new TestWorkspacesService());
	instantiationService.stub(IWorkspaceTrustManagementService, disposables.add(new TestWorkspaceTrustManagementService()));
	instantiationService.stub(IWorkspaceTrustRequestService, disposables.add(new TestWorkspaceTrustRequestService(false)));
	instantiationService.stub(ITerminalInstanceService, new TestTerminalInstanceService());
	instantiationService.stub(ITerminalEditorService, new TestTerminalEditorService());
	instantiationService.stub(ITerminalGroupService, new TestTerminalGroupService());
	instantiationService.stub(ITerminalProfileService, new TestTerminalProfileService());
	instantiationService.stub(ITerminalProfileResolverService, new TestTerminalProfileResolverService());
	instantiationService.stub(ITerminalConfigurationService, disposables.add(instantiationService.createInstance(TestTerminalConfigurationService)));
	instantiationService.stub(ITerminalLogService, disposables.add(instantiationService.createInstance(TerminalLogService)));
	instantiationService.stub(IEnvironmentVariableService, disposables.add(instantiationService.createInstance(EnvironmentVariableService)));
	instantiationService.stub(IElevatedFileService, new BrowserElevatedFileService());
	instantiationService.stub(IRemoteSocketFactoryService, new RemoteSocketFactoryService());
	instantiationService.stub(ICustomEditorLabelService, disposables.add(new CustomEditorLabelService(configService, workspaceContextService)));
	instantiationService.stub(IHoverService, NullHoverService);
	instantiationService.stub(IChatEntitlementService, new TestChatEntitlementService());
	instantiationService.stub(IMarkdownRendererService, instantiationService.createInstance(MarkdownRendererService));

	return instantiationService;
}

export class TestServiceAccessor {
	constructor(
		@ILifecycleService public lifecycleService: TestLifecycleService,
		@ITextFileService public textFileService: TestTextFileService,
		@ITextEditorService public textEditorService: ITextEditorService,
		@IWorkingCopyFileService public workingCopyFileService: IWorkingCopyFileService,
		@IFilesConfigurationService public filesConfigurationService: TestFilesConfigurationService,
		@IWorkspaceContextService public contextService: TestContextService,
		@IModelService public modelService: ModelService,
		@IFileService public fileService: TestFileService,
		@IFileDialogService public fileDialogService: TestFileDialogService,
		@IDialogService public dialogService: TestDialogService,
		@IWorkingCopyService public workingCopyService: TestWorkingCopyService,
		@IEditorService public editorService: TestEditorService,
		@IEditorPaneService public editorPaneService: IEditorPaneService,
		@IWorkbenchEnvironmentService public environmentService: IWorkbenchEnvironmentService,
		@IPathService public pathService: IPathService,
		@IEditorGroupsService public editorGroupService: IEditorGroupsService,
		@IEditorResolverService public editorResolverService: IEditorResolverService,
		@ILanguageService public languageService: ILanguageService,
		@ITextModelService public textModelResolverService: ITextModelService,
		@IUntitledTextEditorService public untitledTextEditorService: UntitledTextEditorService,
		@IConfigurationService public testConfigurationService: TestConfigurationService,
		@IWorkingCopyBackupService public workingCopyBackupService: TestWorkingCopyBackupService,
		@IHostService public hostService: TestHostService,
		@IQuickInputService public quickInputService: IQuickInputService,
		@ILabelService public labelService: ILabelService,
		@ILogService public logService: ILogService,
		@IUriIdentityService public uriIdentityService: IUriIdentityService,
		@IInstantiationService public instantitionService: IInstantiationService,
		@INotificationService public notificationService: INotificationService,
		@IWorkingCopyEditorService public workingCopyEditorService: IWorkingCopyEditorService,
		@IInstantiationService public instantiationService: IInstantiationService,
		@IElevatedFileService public elevatedFileService: IElevatedFileService,
		@IWorkspaceTrustRequestService public workspaceTrustRequestService: TestWorkspaceTrustRequestService,
		@IDecorationsService public decorationsService: IDecorationsService,
		@IProgressService public progressService: IProgressService,
	) { }
}

export class TestTextFileService extends BrowserTextFileService {
	private readStreamError: FileOperationError | undefined = undefined;
	private writeError: FileOperationError | undefined = undefined;

	constructor(
		@IFileService fileService: IFileService,
		@IUntitledTextEditorService untitledTextEditorService: IUntitledTextEditorModelManager,
		@ILifecycleService lifecycleService: ILifecycleService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IModelService modelService: IModelService,
		@IWorkbenchEnvironmentService environmentService: IWorkbenchEnvironmentService,
		@IDialogService dialogService: IDialogService,
		@IFileDialogService fileDialogService: IFileDialogService,
		@ITextResourceConfigurationService textResourceConfigurationService: ITextResourceConfigurationService,
		@IFilesConfigurationService filesConfigurationService: IFilesConfigurationService,
		@ICodeEditorService codeEditorService: ICodeEditorService,
		@IPathService pathService: IPathService,
		@IWorkingCopyFileService workingCopyFileService: IWorkingCopyFileService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
		@ILanguageService languageService: ILanguageService,
		@ILogService logService: ILogService,
		@IElevatedFileService elevatedFileService: IElevatedFileService,
		@IDecorationsService decorationsService: IDecorationsService
	) {
		super(
			fileService,
			untitledTextEditorService,
			lifecycleService,
			instantiationService,
			modelService,
			environmentService,
			dialogService,
			fileDialogService,
			textResourceConfigurationService,
			filesConfigurationService,
			codeEditorService,
			pathService,
			workingCopyFileService,
			uriIdentityService,
			languageService,
			elevatedFileService,
			logService,
			decorationsService
		);
	}

	setReadStreamErrorOnce(error: FileOperationError): void {
		this.readStreamError = error;
	}

	override async readStream(resource: URI, options?: IReadTextFileOptions): Promise<ITextFileStreamContent> {
		if (this.readStreamError) {
			const error = this.readStreamError;
			this.readStreamError = undefined;

			throw error;
		}

		const content = await this.fileService.readFileStream(resource, options);
		return {
			resource: content.resource,
			name: content.name,
			mtime: content.mtime,
			ctime: content.ctime,
			etag: content.etag,
			encoding: 'utf8',
			value: await createTextBufferFactoryFromStream(content.value),
			size: 10,
			readonly: false,
			locked: false
		};
	}

	setWriteErrorOnce(error: FileOperationError): void {
		this.writeError = error;
	}

	override async write(resource: URI, value: string | ITextSnapshot, options?: IWriteTextFileOptions): Promise<IFileStatWithMetadata> {
		if (this.writeError) {
			const error = this.writeError;
			this.writeError = undefined;

			throw error;
		}

		return super.write(resource, value, options);
	}
}

export class TestBrowserTextFileServiceWithEncodingOverrides extends BrowserTextFileService {

	private _testEncoding: TestEncodingOracle | undefined;
	override get encoding(): TestEncodingOracle {
		if (!this._testEncoding) {
			this._testEncoding = this._register(this.instantiationService.createInstance(TestEncodingOracle));
		}

		return this._testEncoding;
	}
}

export class TestEncodingOracle extends EncodingOracle {

	protected override get encodingOverrides(): IEncodingOverride[] {
		return [
			{ extension: 'utf16le', encoding: UTF16le },
			{ extension: 'utf16be', encoding: UTF16be },
			{ extension: 'utf8bom', encoding: UTF8_with_bom }
		];
	}

	protected override set encodingOverrides(overrides: IEncodingOverride[]) { }
}

class TestEnvironmentServiceWithArgs extends BrowserWorkbenchEnvironmentService {
	args = [];
}

export const TestEnvironmentService = new TestEnvironmentServiceWithArgs('', URI.file('tests').with({ scheme: 'vscode-tests' }), Object.create(null), TestProductService);

export class TestProgressService implements IProgressService {

	declare readonly _serviceBrand: undefined;

	withProgress(
		options: IProgressOptions | IProgressDialogOptions | IProgressWindowOptions | IProgressNotificationOptions | IProgressCompositeOptions,
		task: (progress: IProgress<IProgressStep>) => Promise<any>,
		onDidCancel?: ((choice?: number | undefined) => void) | undefined
	): Promise<any> {
		return task(Progress.None);
	}
}

export class TestDecorationsService implements IDecorationsService {

	declare readonly _serviceBrand: undefined;

	readonly onDidChangeDecorations: Event<IResourceDecorationChangeEvent> = Event.None;

	registerDecorationsProvider(_provider: IDecorationsProvider): IDisposable { return Disposable.None; }
	getDecoration(_uri: URI, _includeChildren: boolean, _overwrite?: IDecorationData): IDecoration | undefined { return undefined; }
}

export class TestMenuService implements IMenuService {

	declare readonly _serviceBrand: undefined;

	createMenu(_id: MenuId, _scopedKeybindingService: IContextKeyService): IMenu {
		return {
			onDidChange: Event.None,
			dispose: () => undefined,
			getActions: () => []
		};
	}

	getMenuActions(id: MenuId, contextKeyService: IContextKeyService, options?: IMenuActionOptions): [string, Array<MenuItemAction | SubmenuItemAction>][] {
		throw new Error('Method not implemented.');
	}

	getMenuContexts(id: MenuId): ReadonlySet<string> {
		throw new Error('Method not implemented.');
	}

	resetHiddenStates(): void {
		// nothing
	}
}

export class TestFileDialogService implements IFileDialogService {

	declare readonly _serviceBrand: undefined;

	private confirmResult!: ConfirmResult;

	constructor(
		@IPathService private readonly pathService: IPathService
	) { }
	async defaultFilePath(_schemeFilter?: string): Promise<URI> { return this.pathService.userHome(); }
	async defaultFolderPath(_schemeFilter?: string): Promise<URI> { return this.pathService.userHome(); }
	async defaultWorkspacePath(_schemeFilter?: string): Promise<URI> { return this.pathService.userHome(); }
	async preferredHome(_schemeFilter?: string): Promise<URI> { return this.pathService.userHome(); }
	pickFileFolderAndOpen(_options: IPickAndOpenOptions): Promise<any> { return Promise.resolve(0); }
	pickFileAndOpen(_options: IPickAndOpenOptions): Promise<any> { return Promise.resolve(0); }
	pickFolderAndOpen(_options: IPickAndOpenOptions): Promise<any> { return Promise.resolve(0); }
	pickWorkspaceAndOpen(_options: IPickAndOpenOptions): Promise<any> { return Promise.resolve(0); }

	private fileToSave!: URI;
	setPickFileToSave(path: URI): void { this.fileToSave = path; }
	pickFileToSave(defaultUri: URI, availableFileSystems?: string[]): Promise<URI | undefined> { return Promise.resolve(this.fileToSave); }

	showSaveDialog(_options: ISaveDialogOptions): Promise<URI | undefined> { return Promise.resolve(undefined); }
	showOpenDialog(_options: IOpenDialogOptions): Promise<URI[] | undefined> { return Promise.resolve(undefined); }

	setConfirmResult(result: ConfirmResult): void { this.confirmResult = result; }
	showSaveConfirm(fileNamesOrResources: (string | URI)[]): Promise<ConfirmResult> { return Promise.resolve(this.confirmResult); }
}

export class TestLayoutService implements IWorkbenchLayoutService {

	declare readonly _serviceBrand: undefined;

	openedDefaultEditors = false;

	mainContainerDimension: IDimension = { width: 800, height: 600 };
	activeContainerDimension: IDimension = { width: 800, height: 600 };
	mainContainerOffset: ILayoutOffsetInfo = { top: 0, quickPickTop: 0 };
	activeContainerOffset: ILayoutOffsetInfo = { top: 0, quickPickTop: 0 };

	mainContainer: HTMLElement = mainWindow.document.body;
	containers = [mainWindow.document.body];
	activeContainer: HTMLElement = mainWindow.document.body;

	readonly onDidChangeZenMode: Event<boolean> = Event.None;
	readonly onDidChangeMainEditorCenteredLayout: Event<boolean> = Event.None;
	readonly onDidChangeWindowMaximized: Event<{ windowId: number; maximized: boolean }> = Event.None;
	readonly onDidChangePanelPosition: Event<string> = Event.None;
	readonly onDidChangePanelAlignment: Event<PanelAlignment> = Event.None;
	readonly onDidChangePartVisibility: Event<void> = Event.None;
	onDidLayoutMainContainer = Event.None;
	onDidLayoutActiveContainer = Event.None;
	onDidLayoutContainer = Event.None;
	onDidChangeNotificationsVisibility = Event.None;
	onDidAddContainer = Event.None;
	onDidChangeActiveContainer = Event.None;
	onDidChangeAuxiliaryBarMaximized = Event.None;

	layout(): void { }
	isRestored(): boolean { return true; }
	whenReady: Promise<void> = Promise.resolve(undefined);
	whenRestored: Promise<void> = Promise.resolve(undefined);
	hasFocus(_part: Parts): boolean { return false; }
	focusPart(_part: Parts): void { }
	hasMainWindowBorder(): boolean { return false; }
	getMainWindowBorderRadius(): string | undefined { return undefined; }
	isVisible(_part: Parts): boolean { return true; }
	getContainer(): HTMLElement { return mainWindow.document.body; }
	whenContainerStylesLoaded() { return undefined; }
	isTitleBarHidden(): boolean { return false; }
	isStatusBarHidden(): boolean { return false; }
	isActivityBarHidden(): boolean { return false; }
	setActivityBarHidden(_hidden: boolean): void { }
	setBannerHidden(_hidden: boolean): void { }
	isSideBarHidden(): boolean { return false; }
	async setEditorHidden(_hidden: boolean): Promise<void> { }
	async setSideBarHidden(_hidden: boolean): Promise<void> { }
	async setAuxiliaryBarHidden(_hidden: boolean): Promise<void> { }
	async setPartHidden(_hidden: boolean, part: Parts): Promise<void> { }
	isPanelHidden(): boolean { return false; }
	async setPanelHidden(_hidden: boolean): Promise<void> { }
	toggleMaximizedPanel(): void { }
	isPanelMaximized(): boolean { return false; }
	toggleMaximizedAuxiliaryBar(): void { }
	setAuxiliaryBarMaximized(maximized: boolean): boolean { return false; }
	isAuxiliaryBarMaximized(): boolean { return false; }
	getMenubarVisibility(): MenuBarVisibility { throw new Error('not implemented'); }
	toggleMenuBar(): void { }
	getSideBarPosition() { return 0; }
	getPanelPosition() { return 0; }
	getPanelAlignment(): PanelAlignment { return 'center'; }
	async setPanelPosition(_position: PartPosition): Promise<void> { }
	async setPanelAlignment(_alignment: PanelAlignment): Promise<void> { }
	addClass(_clazz: string): void { }
	removeClass(_clazz: string): void { }
	getMaximumEditorDimensions(): IDimension { throw new Error('not implemented'); }
	toggleZenMode(): void { }
	isMainEditorLayoutCentered(): boolean { return false; }
	centerMainEditorLayout(_active: boolean): void { }
	resizePart(_part: Parts, _sizeChangeWidth: number, _sizeChangeHeight: number): void { }
	getSize(part: Parts): IViewSize { throw new Error('Method not implemented.'); }
	setSize(part: Parts, size: IViewSize): void { throw new Error('Method not implemented.'); }
	registerPart(part: Part): IDisposable { return Disposable.None; }
	isWindowMaximized(targetWindow: Window) { return false; }
	updateWindowMaximizedState(targetWindow: Window, maximized: boolean): void { }
	getVisibleNeighborPart(part: Parts, direction: Direction): Parts | undefined { return undefined; }
	focus() { }
}

// eslint-disable-next-line local/code-no-any-casts
const activeViewlet: PaneComposite = {} as any;

export class TestPaneCompositeService extends Disposable implements IPaneCompositePartService {
	declare readonly _serviceBrand: undefined;

	readonly onDidPaneCompositeOpen: Event<{ composite: IPaneComposite; viewContainerLocation: ViewContainerLocation }>;
	readonly onDidPaneCompositeClose: Event<{ composite: IPaneComposite; viewContainerLocation: ViewContainerLocation }>;

	private parts = new Map<ViewContainerLocation, IPaneCompositePart>();

	constructor() {
		super();

		this.parts.set(ViewContainerLocation.Panel, new TestPanelPart());
		this.parts.set(ViewContainerLocation.Sidebar, new TestSideBarPart());

		this.onDidPaneCompositeOpen = Event.any(...([ViewContainerLocation.Panel, ViewContainerLocation.Sidebar].map(loc => Event.map(this.parts.get(loc)!.onDidPaneCompositeOpen, composite => { return { composite, viewContainerLocation: loc }; }))));
		this.onDidPaneCompositeClose = Event.any(...([ViewContainerLocation.Panel, ViewContainerLocation.Sidebar].map(loc => Event.map(this.parts.get(loc)!.onDidPaneCompositeClose, composite => { return { composite, viewContainerLocation: loc }; }))));
	}

	openPaneComposite(id: string | undefined, viewContainerLocation: ViewContainerLocation, focus?: boolean): Promise<IPaneComposite | undefined> {
		return this.getPartByLocation(viewContainerLocation).openPaneComposite(id, focus);
	}
	getActivePaneComposite(viewContainerLocation: ViewContainerLocation): IPaneComposite | undefined {
		return this.getPartByLocation(viewContainerLocation).getActivePaneComposite();
	}
	getPaneComposite(id: string, viewContainerLocation: ViewContainerLocation): PaneCompositeDescriptor | undefined {
		return this.getPartByLocation(viewContainerLocation).getPaneComposite(id);
	}
	getPaneComposites(viewContainerLocation: ViewContainerLocation): PaneCompositeDescriptor[] {
		return this.getPartByLocation(viewContainerLocation).getPaneComposites();
	}
	getProgressIndicator(id: string, viewContainerLocation: ViewContainerLocation): IProgressIndicator | undefined {
		return this.getPartByLocation(viewContainerLocation).getProgressIndicator(id);
	}
	hideActivePaneComposite(viewContainerLocation: ViewContainerLocation): void {
		this.getPartByLocation(viewContainerLocation).hideActivePaneComposite();
	}
	getLastActivePaneCompositeId(viewContainerLocation: ViewContainerLocation): string {
		return this.getPartByLocation(viewContainerLocation).getLastActivePaneCompositeId();
	}

	getPinnedPaneCompositeIds(viewContainerLocation: ViewContainerLocation): string[] {
		throw new Error('Method not implemented.');
	}

	getVisiblePaneCompositeIds(viewContainerLocation: ViewContainerLocation): string[] {
		throw new Error('Method not implemented.');
	}

	getPaneCompositeIds(viewContainerLocation: ViewContainerLocation): string[] {
		throw new Error('Method not implemented.');
	}

	getPartByLocation(viewContainerLocation: ViewContainerLocation): IPaneCompositePart {
		return assertReturnsDefined(this.parts.get(viewContainerLocation));
	}
}

export class TestSideBarPart implements IPaneCompositePart {
	declare readonly _serviceBrand: undefined;

	onDidViewletRegisterEmitter = new Emitter<PaneCompositeDescriptor>();
	onDidViewletDeregisterEmitter = new Emitter<PaneCompositeDescriptor>();
	onDidViewletOpenEmitter = new Emitter<IPaneComposite>();
	onDidViewletCloseEmitter = new Emitter<IPaneComposite>();

	readonly partId = Parts.SIDEBAR_PART;
	element: HTMLElement = undefined!;
	minimumWidth = 0;
	maximumWidth = 0;
	minimumHeight = 0;
	maximumHeight = 0;
	onDidChange = Event.None;
	onDidPaneCompositeOpen = this.onDidViewletOpenEmitter.event;
	onDidPaneCompositeClose = this.onDidViewletCloseEmitter.event;

	openPaneComposite(id: string, focus?: boolean): Promise<IPaneComposite | undefined> { return Promise.resolve(undefined); }
	getPaneComposites(): PaneCompositeDescriptor[] { return []; }
	getAllViewlets(): PaneCompositeDescriptor[] { return []; }
	getActivePaneComposite(): IPaneComposite { return activeViewlet; }
	getDefaultViewletId(): string { return 'workbench.view.explorer'; }
	getPaneComposite(id: string): PaneCompositeDescriptor | undefined { return undefined; }
	getProgressIndicator(id: string) { return undefined; }
	hideActivePaneComposite(): void { }
	getLastActivePaneCompositeId(): string { return undefined!; }
	dispose() { }
	getPinnedPaneCompositeIds() { return []; }
	getVisiblePaneCompositeIds() { return []; }
	getPaneCompositeIds() { return []; }
	layout(width: number, height: number, top: number, left: number): void { }
}

export class TestPanelPart implements IPaneCompositePart {
	declare readonly _serviceBrand: undefined;

	element: HTMLElement = undefined!;
	minimumWidth = 0;
	maximumWidth = 0;
	minimumHeight = 0;
	maximumHeight = 0;
	onDidChange = Event.None;
	onDidPaneCompositeOpen = new Emitter<IPaneComposite>().event;
	onDidPaneCompositeClose = new Emitter<IPaneComposite>().event;
	readonly partId = Parts.AUXILIARYBAR_PART;

	async openPaneComposite(id?: string, focus?: boolean): Promise<undefined> { return undefined; }
	getPaneComposite(id: string): any { return activeViewlet; }
	getPaneComposites() { return []; }
	getPinnedPaneCompositeIds() { return []; }
	getVisiblePaneCompositeIds() { return []; }
	getPaneCompositeIds() { return []; }
	getActivePaneComposite(): IPaneComposite { return activeViewlet; }
	setPanelEnablement(id: string, enabled: boolean): void { }
	dispose() { }
	getProgressIndicator(id: string) { return null!; }
	hideActivePaneComposite(): void { }
	getLastActivePaneCompositeId(): string { return undefined!; }
	layout(width: number, height: number, top: number, left: number): void { }
}

export class TestViewsService implements IViewsService {
	declare readonly _serviceBrand: undefined;


	onDidChangeViewContainerVisibility = new Emitter<{ id: string; visible: boolean; location: ViewContainerLocation }>().event;
	isViewContainerVisible(id: string): boolean { return true; }
	isViewContainerActive(id: string): boolean { return true; }
	getVisibleViewContainer(): ViewContainer | null { return null; }
	openViewContainer(id: string, focus?: boolean): Promise<IPaneComposite | null> { return Promise.resolve(null); }
	closeViewContainer(id: string): void { }

	onDidChangeViewVisibilityEmitter = new Emitter<{ id: string; visible: boolean }>();
	onDidChangeViewVisibility = this.onDidChangeViewVisibilityEmitter.event;
	onDidChangeFocusedViewEmitter = new Emitter<void>();
	onDidChangeFocusedView = this.onDidChangeFocusedViewEmitter.event;
	isViewVisible(id: string): boolean { return true; }
	getActiveViewWithId<T extends IView>(id: string): T | null { return null; }
	getViewWithId<T extends IView>(id: string): T | null { return null; }
	openView<T extends IView>(id: string, focus?: boolean | undefined): Promise<T | null> { return Promise.resolve(null); }
	closeView(id: string): void { }
	getViewProgressIndicator(id: string) { return null!; }
	getActiveViewPaneContainerWithId(id: string) { return null; }
	getFocusedViewName(): string { return ''; }
	getFocusedView(): IViewDescriptor | null { return null; }
}

export class TestEditorGroupsService implements IEditorGroupsService {

	declare readonly _serviceBrand: undefined;

	constructor(public groups: TestEditorGroupView[] = []) { }

	readonly parts: readonly IEditorPart[] = [this];

	windowId = mainWindow.vscodeWindowId;

	readonly onDidCreateAuxiliaryEditorPart: Event<IAuxiliaryEditorPart> = Event.None;
	readonly onDidChangeActiveGroup: Event<IEditorGroup> = Event.None;
	readonly onDidActivateGroup: Event<IEditorGroup> = Event.None;
	readonly onDidAddGroup: Event<IEditorGroup> = Event.None;
	readonly onDidRemoveGroup: Event<IEditorGroup> = Event.None;
	readonly onDidMoveGroup: Event<IEditorGroup> = Event.None;
	readonly onDidChangeGroupIndex: Event<IEditorGroup> = Event.None;
	readonly onDidChangeGroupLabel: Event<IEditorGroup> = Event.None;
	readonly onDidChangeGroupLocked: Event<IEditorGroup> = Event.None;
	readonly onDidChangeGroupMaximized: Event<boolean> = Event.None;
	readonly onDidLayout: Event<IDimension> = Event.None;
	onDidChangeEditorPartOptions = Event.None;
	onDidScroll = Event.None;
	onWillDispose = Event.None;

	orientation = GroupOrientation.HORIZONTAL;
	isReady = true;
	whenReady: Promise<void> = Promise.resolve(undefined);
	whenRestored: Promise<void> = Promise.resolve(undefined);
	hasRestorableState = false;

	contentDimension = { width: 800, height: 600 };

	get activeGroup(): IEditorGroup { return this.groups[0]; }
	get sideGroup(): IEditorGroup { return this.groups[0]; }
	get count(): number { return this.groups.length; }

	getPart(group: number | IEditorGroup): IEditorPart { return this; }
	saveWorkingSet(name: string): IEditorWorkingSet { throw new Error('Method not implemented.'); }
	getWorkingSets(): IEditorWorkingSet[] { throw new Error('Method not implemented.'); }
	applyWorkingSet(workingSet: IEditorWorkingSet | 'empty', options?: IEditorWorkingSetOptions): Promise<boolean> { throw new Error('Method not implemented.'); }
	deleteWorkingSet(workingSet: IEditorWorkingSet): Promise<boolean> { throw new Error('Method not implemented.'); }
	getGroups(_order?: GroupsOrder): readonly IEditorGroup[] { return this.groups; }
	getGroup(identifier: number): IEditorGroup | undefined { return this.groups.find(group => group.id === identifier); }
	getLabel(_identifier: number): string { return 'Group 1'; }
	findGroup(_scope: IFindGroupScope, _source?: number | IEditorGroup, _wrap?: boolean): IEditorGroup { throw new Error('not implemented'); }
	activateGroup(_group: number | IEditorGroup): IEditorGroup { throw new Error('not implemented'); }
	restoreGroup(_group: number | IEditorGroup): IEditorGroup { throw new Error('not implemented'); }
	getSize(_group: number | IEditorGroup): { width: number; height: number } { return { width: 100, height: 100 }; }
	setSize(_group: number | IEditorGroup, _size: { width: number; height: number }): void { }
	arrangeGroups(_arrangement: GroupsArrangement): void { }
	toggleMaximizeGroup(): void { }
	hasMaximizedGroup(): boolean { throw new Error('not implemented'); }
	toggleExpandGroup(): void { }
	applyLayout(_layout: EditorGroupLayout): void { }
	getLayout(): EditorGroupLayout { throw new Error('not implemented'); }
	setGroupOrientation(_orientation: GroupOrientation): void { }
	addGroup(_location: number | IEditorGroup, _direction: GroupDirection): IEditorGroup { throw new Error('not implemented'); }
	removeGroup(_group: number | IEditorGroup): void { }
	moveGroup(_group: number | IEditorGroup, _location: number | IEditorGroup, _direction: GroupDirection): IEditorGroup { throw new Error('not implemented'); }
	mergeGroup(_group: number | IEditorGroup, _target: number | IEditorGroup, _options?: IMergeGroupOptions): boolean { throw new Error('not implemented'); }
	mergeAllGroups(_group: number | IEditorGroup, _options?: IMergeGroupOptions): boolean { throw new Error('not implemented'); }
	copyGroup(_group: number | IEditorGroup, _location: number | IEditorGroup, _direction: GroupDirection): IEditorGroup { throw new Error('not implemented'); }
	centerLayout(active: boolean): void { }
	isLayoutCentered(): boolean { return false; }
	createEditorDropTarget(container: HTMLElement, delegate: IEditorDropTargetDelegate): IDisposable { return Disposable.None; }
	registerContextKeyProvider<T extends ContextKeyValue>(_provider: IEditorGroupContextKeyProvider<T>): IDisposable { throw new Error('not implemented'); }
	getScopedInstantiationService(part: IEditorPart): IInstantiationService { throw new Error('Method not implemented.'); }

	partOptions!: IEditorPartOptions;
	enforcePartOptions(options: IEditorPartOptions): IDisposable { return Disposable.None; }

	readonly mainPart = this;
	registerEditorPart(part: any): IDisposable { return Disposable.None; }
	createAuxiliaryEditorPart(): Promise<IAuxiliaryEditorPart> { throw new Error('Method not implemented.'); }
}

export class TestEditorGroupView implements IEditorGroupView {

	constructor(public id: number) { }

	windowId = mainWindow.vscodeWindowId;
	groupsView: IEditorGroupsView = undefined!;
	activeEditorPane!: IVisibleEditorPane;
	activeEditor!: EditorInput;
	selectedEditors: EditorInput[] = [];
	previewEditor!: EditorInput;
	count!: number;
	stickyCount!: number;
	disposed!: boolean;
	editors: readonly EditorInput[] = [];
	label!: string;
	isLocked!: boolean;
	ariaLabel!: string;
	index!: number;
	whenRestored: Promise<void> = Promise.resolve(undefined);
	element!: HTMLElement;
	minimumWidth!: number;
	maximumWidth!: number;
	minimumHeight!: number;
	maximumHeight!: number;

	titleHeight!: IEditorGroupTitleHeight;

	isEmpty = true;

	readonly onWillDispose: Event<void> = Event.None;
	readonly onDidModelChange: Event<IGroupModelChangeEvent> = Event.None;
	readonly onWillCloseEditor: Event<IEditorCloseEvent> = Event.None;
	readonly onDidCloseEditor: Event<IEditorCloseEvent> = Event.None;
	readonly onDidOpenEditorFail: Event<EditorInput> = Event.None;
	readonly onDidFocus: Event<void> = Event.None;
	readonly onDidChange: Event<{ width: number; height: number }> = Event.None;
	readonly onWillMoveEditor: Event<IEditorWillMoveEvent> = Event.None;
	readonly onWillOpenEditor: Event<IEditorWillOpenEvent> = Event.None;
	readonly onDidActiveEditorChange: Event<IActiveEditorChangeEvent> = Event.None;

	getEditors(_order?: EditorsOrder): readonly EditorInput[] { return []; }
	findEditors(_resource: URI): readonly EditorInput[] { return []; }
	getEditorByIndex(_index: number): EditorInput { throw new Error('not implemented'); }
	getIndexOfEditor(_editor: EditorInput): number { return -1; }
	isFirst(editor: EditorInput): boolean { return false; }
	isLast(editor: EditorInput): boolean { return false; }
	openEditor(_editor: EditorInput, _options?: IEditorOptions): Promise<IEditorPane> { throw new Error('not implemented'); }
	openEditors(_editors: EditorInputWithOptions[]): Promise<IEditorPane> { throw new Error('not implemented'); }
	isPinned(_editor: EditorInput): boolean { return false; }
	isSticky(_editor: EditorInput): boolean { return false; }
	isTransient(_editor: EditorInput): boolean { return false; }
	isActive(_editor: EditorInput | IUntypedEditorInput): boolean { return false; }
	setSelection(_activeSelectedEditor: EditorInput, _inactiveSelectedEditors: EditorInput[]): Promise<void> { throw new Error('not implemented'); }
	isSelected(_editor: EditorInput): boolean { return false; }
	contains(candidate: EditorInput | IUntypedEditorInput): boolean { return false; }
	moveEditor(_editor: EditorInput, _target: IEditorGroup, _options?: IEditorOptions): boolean { return true; }
	moveEditors(_editors: EditorInputWithOptions[], _target: IEditorGroup): boolean { return true; }
	copyEditor(_editor: EditorInput, _target: IEditorGroup, _options?: IEditorOptions): void { }
	copyEditors(_editors: EditorInputWithOptions[], _target: IEditorGroup): void { }
	async closeEditor(_editor?: EditorInput, options?: ICloseEditorOptions): Promise<boolean> { return true; }
	async closeEditors(_editors: EditorInput[] | ICloseEditorsFilter, options?: ICloseEditorOptions): Promise<boolean> { return true; }
	closeAllEditors(options?: ICloseAllEditorsOptions): any { return true; }
	async replaceEditors(_editors: IEditorReplacement[]): Promise<void> { }
	pinEditor(_editor?: EditorInput): void { }
	stickEditor(editor?: EditorInput | undefined): void { }
	unstickEditor(editor?: EditorInput | undefined): void { }
	lock(locked: boolean): void { }
	focus(): void { }
	get scopedContextKeyService(): IContextKeyService { throw new Error('not implemented'); }
	setActive(_isActive: boolean): void { }
	notifyIndexChanged(_index: number): void { }
	notifyLabelChanged(_label: string): void { }
	dispose(): void { }
	toJSON(): object { return Object.create(null); }
	layout(_width: number, _height: number): void { }
	relayout() { }
	createEditorActions(_menuDisposable: IDisposable): { actions: IToolbarActions; onDidChange: Event<IMenuChangeEvent> } { throw new Error('not implemented'); }
}

export class TestEditorGroupAccessor implements IEditorGroupsView {

	label: string = '';
	windowId = mainWindow.vscodeWindowId;

	groups: IEditorGroupView[] = [];
	activeGroup!: IEditorGroupView;

	partOptions: IEditorPartOptions = { ...DEFAULT_EDITOR_PART_OPTIONS };

	onDidChangeEditorPartOptions = Event.None;
	onDidVisibilityChange = Event.None;

	getGroup(identifier: number): IEditorGroupView | undefined { throw new Error('Method not implemented.'); }
	getGroups(order: GroupsOrder): IEditorGroupView[] { throw new Error('Method not implemented.'); }
	activateGroup(identifier: number | IEditorGroupView): IEditorGroupView { throw new Error('Method not implemented.'); }
	restoreGroup(identifier: number | IEditorGroupView): IEditorGroupView { throw new Error('Method not implemented.'); }
	addGroup(location: number | IEditorGroupView, direction: GroupDirection): IEditorGroupView { throw new Error('Method not implemented.'); }
	mergeGroup(group: number | IEditorGroupView, target: number | IEditorGroupView, options?: IMergeGroupOptions | undefined): boolean { throw new Error('Method not implemented.'); }
	moveGroup(group: number | IEditorGroupView, location: number | IEditorGroupView, direction: GroupDirection): IEditorGroupView { throw new Error('Method not implemented.'); }
	copyGroup(group: number | IEditorGroupView, location: number | IEditorGroupView, direction: GroupDirection): IEditorGroupView { throw new Error('Method not implemented.'); }
	removeGroup(group: number | IEditorGroupView): void { throw new Error('Method not implemented.'); }
	arrangeGroups(arrangement: GroupsArrangement, target?: number | IEditorGroupView | undefined): void { throw new Error('Method not implemented.'); }
	toggleMaximizeGroup(group: number | IEditorGroupView): void { throw new Error('Method not implemented.'); }
	toggleExpandGroup(group: number | IEditorGroupView): void { throw new Error('Method not implemented.'); }
}

export class TestEditorService extends Disposable implements EditorServiceImpl {

	declare readonly _serviceBrand: undefined;

	readonly onDidActiveEditorChange: Event<void> = Event.None;
	readonly onDidVisibleEditorsChange: Event<void> = Event.None;
	readonly onDidEditorsChange: Event<IEditorsChangeEvent> = Event.None;
	readonly onWillOpenEditor: Event<IEditorWillOpenEvent> = Event.None;
	readonly onDidCloseEditor: Event<IEditorCloseEvent> = Event.None;
	readonly onDidOpenEditorFail: Event<IEditorIdentifier> = Event.None;
	readonly onDidMostRecentlyActiveEditorsChange: Event<void> = Event.None;

	private _activeTextEditorControl: ICodeEditor | IDiffEditor | undefined;
	public get activeTextEditorControl(): ICodeEditor | IDiffEditor | undefined { return this._activeTextEditorControl; }
	public set activeTextEditorControl(value: ICodeEditor | IDiffEditor | undefined) { this._activeTextEditorControl = value; }

	activeEditorPane: IVisibleEditorPane | undefined;
	activeTextEditorLanguageId: string | undefined;

	private _activeEditor: EditorInput | undefined;
	public get activeEditor(): EditorInput | undefined { return this._activeEditor; }
	public set activeEditor(value: EditorInput | undefined) { this._activeEditor = value; }

	editors: readonly EditorInput[] = [];
	mostRecentlyActiveEditors: readonly IEditorIdentifier[] = [];
	visibleEditorPanes: readonly IVisibleEditorPane[] = [];
	visibleTextEditorControls = [];
	getVisibleTextEditorControls(order: EditorsOrder): readonly (IEditor | IDiffEditor)[] { return this.visibleTextEditorControls; }
	visibleEditors: readonly EditorInput[] = [];
	count = this.editors.length;

	constructor(private editorGroupService?: IEditorGroupsService) {
		super();
	}
	createScoped(editorGroupsContainer: IEditorGroupsContainer): IEditorService { return this; }
	getEditors() { return []; }
	// eslint-disable-next-line local/code-no-any-casts
	findEditors() { return [] as any; }
	openEditor(editor: EditorInput, options?: IEditorOptions, group?: PreferredGroup): Promise<IEditorPane | undefined>;
	openEditor(editor: IResourceEditorInput | IUntitledTextResourceEditorInput, group?: PreferredGroup): Promise<IEditorPane | undefined>;
	openEditor(editor: IResourceDiffEditorInput, group?: PreferredGroup): Promise<ITextDiffEditorPane | undefined>;
	async openEditor(editor: EditorInput | IUntypedEditorInput, optionsOrGroup?: IEditorOptions | PreferredGroup, group?: PreferredGroup): Promise<IEditorPane | undefined> {
		// openEditor takes ownership of the input, register it to the TestEditorService
		// so it's not marked as leaked during tests.
		if ('dispose' in editor) {
			this._register(editor);
		}
		return undefined;
	}
	async closeEditor(editor: IEditorIdentifier, options?: ICloseEditorOptions): Promise<void> { }
	async closeEditors(editors: IEditorIdentifier[], options?: ICloseEditorOptions): Promise<void> { }
	doResolveEditorOpenRequest(editor: EditorInput | IUntypedEditorInput): [IEditorGroup, EditorInput, IEditorOptions | undefined] | undefined {
		if (!this.editorGroupService) {
			return undefined;
		}

		return [this.editorGroupService.activeGroup, editor as EditorInput, undefined];
	}
	openEditors(_editors: any, _group?: any): Promise<IEditorPane[]> { throw new Error('not implemented'); }
	isOpened(_editor: IResourceEditorInputIdentifier): boolean { return false; }
	isVisible(_editor: EditorInput): boolean { return false; }
	replaceEditors(_editors: any, _group: any) { return Promise.resolve(undefined); }
	save(editors: IEditorIdentifier[], options?: ISaveEditorsOptions): Promise<ISaveEditorsResult> { throw new Error('Method not implemented.'); }
	saveAll(options?: ISaveEditorsOptions): Promise<ISaveEditorsResult> { throw new Error('Method not implemented.'); }
	revert(editors: IEditorIdentifier[], options?: IRevertOptions): Promise<boolean> { throw new Error('Method not implemented.'); }
	revertAll(options?: IRevertAllEditorsOptions): Promise<boolean> { throw new Error('Method not implemented.'); }
}

export class TestWorkingCopyBackupService extends InMemoryWorkingCopyBackupService {

	readonly resolved: Set<IWorkingCopyIdentifier> = new Set();

	constructor() {
		super();
	}

	parseBackupContent(textBufferFactory: ITextBufferFactory): string {
		const textBuffer = textBufferFactory.create(DefaultEndOfLine.LF).textBuffer;
		const lineCount = textBuffer.getLineCount();
		const range = new Range(1, 1, lineCount, textBuffer.getLineLength(lineCount) + 1);

		return textBuffer.getValueInRange(range, EndOfLinePreference.TextDefined);
	}

	override async resolve<T extends IWorkingCopyBackupMeta>(identifier: IWorkingCopyIdentifier): Promise<IResolvedWorkingCopyBackup<T> | undefined> {
		this.resolved.add(identifier);

		return super.resolve(identifier);
	}
}

export function toUntypedWorkingCopyId(resource: URI): IWorkingCopyIdentifier {
	return toTypedWorkingCopyId(resource, '');
}

export function toTypedWorkingCopyId(resource: URI, typeId = 'testBackupTypeId'): IWorkingCopyIdentifier {
	return { typeId, resource };
}

export class InMemoryTestWorkingCopyBackupService extends BrowserWorkingCopyBackupService {

	private backupResourceJoiners: Function[];
	private discardBackupJoiners: Function[];

	discardedBackups: IWorkingCopyIdentifier[];

	constructor() {
		const disposables = new DisposableStore();
		const environmentService = TestEnvironmentService;
		const logService = new NullLogService();
		const fileService = disposables.add(new FileService(logService));
		disposables.add(fileService.registerProvider(Schemas.file, disposables.add(new InMemoryFileSystemProvider())));
		disposables.add(fileService.registerProvider(Schemas.vscodeUserData, disposables.add(new InMemoryFileSystemProvider())));

		super(new TestContextService(TestWorkspace), environmentService, fileService, logService);

		this.backupResourceJoiners = [];
		this.discardBackupJoiners = [];
		this.discardedBackups = [];

		this._register(disposables);
	}

	testGetFileService(): IFileService {
		return this.fileService;
	}

	joinBackupResource(): Promise<void> {
		return new Promise(resolve => this.backupResourceJoiners.push(resolve));
	}

	joinDiscardBackup(): Promise<void> {
		return new Promise(resolve => this.discardBackupJoiners.push(resolve));
	}

	override async backup(identifier: IWorkingCopyIdentifier, content?: VSBufferReadableStream | VSBufferReadable, versionId?: number, meta?: any, token?: CancellationToken): Promise<void> {
		await super.backup(identifier, content, versionId, meta, token);

		while (this.backupResourceJoiners.length) {
			this.backupResourceJoiners.pop()!();
		}
	}

	override async discardBackup(identifier: IWorkingCopyIdentifier): Promise<void> {
		await super.discardBackup(identifier);
		this.discardedBackups.push(identifier);

		while (this.discardBackupJoiners.length) {
			this.discardBackupJoiners.pop()!();
		}
	}

	async getBackupContents(identifier: IWorkingCopyIdentifier): Promise<string> {
		const backupResource = this.toBackupResource(identifier);

		const fileContents = await this.fileService.readFile(backupResource);

		return fileContents.value.toString();
	}
}

export class TestLifecycleService extends Disposable implements ILifecycleService {

	declare readonly _serviceBrand: undefined;

	usePhases = false;
	_phase!: LifecyclePhase;
	get phase(): LifecyclePhase { return this._phase; }
	set phase(value: LifecyclePhase) {
		this._phase = value;
		if (value === LifecyclePhase.Starting) {
			this.whenStarted.complete();
		} else if (value === LifecyclePhase.Ready) {
			this.whenReady.complete();
		} else if (value === LifecyclePhase.Restored) {
			this.whenRestored.complete();
		} else if (value === LifecyclePhase.Eventually) {
			this.whenEventually.complete();
		}
	}

	private readonly whenStarted = new DeferredPromise<void>();
	private readonly whenReady = new DeferredPromise<void>();
	private readonly whenRestored = new DeferredPromise<void>();
	private readonly whenEventually = new DeferredPromise<void>();
	async when(phase: LifecyclePhase): Promise<void> {
		if (!this.usePhases) {
			return;
		}
		if (phase === LifecyclePhase.Starting) {
			await this.whenStarted.p;
		} else if (phase === LifecyclePhase.Ready) {
			await this.whenReady.p;
		} else if (phase === LifecyclePhase.Restored) {
			await this.whenRestored.p;
		} else if (phase === LifecyclePhase.Eventually) {
			await this.whenEventually.p;
		}
	}

	startupKind!: StartupKind;
	willShutdown = false;

	private readonly _onBeforeShutdown = this._register(new Emitter<InternalBeforeShutdownEvent>());
	get onBeforeShutdown(): Event<InternalBeforeShutdownEvent> { return this._onBeforeShutdown.event; }

	private readonly _onBeforeShutdownError = this._register(new Emitter<BeforeShutdownErrorEvent>());
	get onBeforeShutdownError(): Event<BeforeShutdownErrorEvent> { return this._onBeforeShutdownError.event; }

	private readonly _onShutdownVeto = this._register(new Emitter<void>());
	get onShutdownVeto(): Event<void> { return this._onShutdownVeto.event; }

	private readonly _onWillShutdown = this._register(new Emitter<WillShutdownEvent>());
	get onWillShutdown(): Event<WillShutdownEvent> { return this._onWillShutdown.event; }

	private readonly _onDidShutdown = this._register(new Emitter<void>());
	get onDidShutdown(): Event<void> { return this._onDidShutdown.event; }

	shutdownJoiners: Promise<void>[] = [];

	fireShutdown(reason = ShutdownReason.QUIT): void {
		this.shutdownJoiners = [];

		this._onWillShutdown.fire({
			join: p => {
				this.shutdownJoiners.push(typeof p === 'function' ? p() : p);
			},
			joiners: () => [],
			force: () => { /* No-Op in tests */ },
			token: CancellationToken.None,
			reason
		});
	}

	fireBeforeShutdown(event: InternalBeforeShutdownEvent): void { this._onBeforeShutdown.fire(event); }

	fireWillShutdown(event: WillShutdownEvent): void { this._onWillShutdown.fire(event); }

	async shutdown(): Promise<void> {
		this.fireShutdown();
	}
}

export class TestBeforeShutdownEvent implements InternalBeforeShutdownEvent {

	value: boolean | Promise<boolean> | undefined;
	finalValue: (() => boolean | Promise<boolean>) | undefined;
	reason = ShutdownReason.CLOSE;

	veto(value: boolean | Promise<boolean>): void {
		this.value = value;
	}

	finalVeto(vetoFn: () => boolean | Promise<boolean>): void {
		this.value = vetoFn();
		this.finalValue = vetoFn;
	}
}

export class TestWillShutdownEvent implements WillShutdownEvent {

	value: Promise<void>[] = [];
	joiners = () => [];
	reason = ShutdownReason.CLOSE;
	token = CancellationToken.None;

	join(promise: Promise<void> | (() => Promise<void>), joiner: IWillShutdownEventJoiner): void {
		this.value.push(typeof promise === 'function' ? promise() : promise);
	}

	force() { /* No-Op in tests */ }
}

export class TestTextResourceConfigurationService implements ITextResourceConfigurationService {

	declare readonly _serviceBrand: undefined;

	constructor(private configurationService = new TestConfigurationService()) { }

	onDidChangeConfiguration() {
		return { dispose() { } };
	}

	getValue<T>(resource: URI, arg2?: any, arg3?: any): T {
		const position: IPosition | null = EditorPosition.isIPosition(arg2) ? arg2 : null;
		const section: string | undefined = position ? (typeof arg3 === 'string' ? arg3 : undefined) : (typeof arg2 === 'string' ? arg2 : undefined);
		return this.configurationService.getValue(section, { resource }) as T;
	}

	inspect<T>(resource: URI | undefined, position: IPosition | null, section: string): IConfigurationValue<Readonly<T>> {
		return this.configurationService.inspect<T>(section, { resource });
	}

	updateValue(resource: URI, key: string, value: any, configurationTarget?: ConfigurationTarget): Promise<void> {
		return this.configurationService.updateValue(key, value);
	}
}

export class RemoteFileSystemProvider implements IFileSystemProvider {

	constructor(private readonly wrappedFsp: IFileSystemProvider, private readonly remoteAuthority: string) {
		this.capabilities = this.wrappedFsp.capabilities;
		this.onDidChangeCapabilities = this.wrappedFsp.onDidChangeCapabilities;
		this.onDidChangeFile = Event.map(this.wrappedFsp.onDidChangeFile, changes => changes.map(c => {
			return {
				type: c.type,
				resource: c.resource.with({ scheme: Schemas.vscodeRemote, authority: this.remoteAuthority }),
			};
		}));
	}

	readonly capabilities: FileSystemProviderCapabilities;
	readonly onDidChangeCapabilities: Event<void>;

	readonly onDidChangeFile: Event<readonly IFileChange[]>;
	watch(resource: URI, opts: IWatchOptions): IDisposable { return this.wrappedFsp.watch(this.toFileResource(resource), opts); }

	stat(resource: URI): Promise<IStat> { return this.wrappedFsp.stat(this.toFileResource(resource)); }
	mkdir(resource: URI): Promise<void> { return this.wrappedFsp.mkdir(this.toFileResource(resource)); }
	readdir(resource: URI): Promise<[string, FileType][]> { return this.wrappedFsp.readdir(this.toFileResource(resource)); }
	delete(resource: URI, opts: IFileDeleteOptions): Promise<void> { return this.wrappedFsp.delete(this.toFileResource(resource), opts); }

	rename(from: URI, to: URI, opts: IFileOverwriteOptions): Promise<void> { return this.wrappedFsp.rename(this.toFileResource(from), this.toFileResource(to), opts); }
	copy(from: URI, to: URI, opts: IFileOverwriteOptions): Promise<void> { return this.wrappedFsp.copy!(this.toFileResource(from), this.toFileResource(to), opts); }

	readFile(resource: URI): Promise<Uint8Array> { return this.wrappedFsp.readFile!(this.toFileResource(resource)); }
	writeFile(resource: URI, content: Uint8Array, opts: IFileWriteOptions): Promise<void> { return this.wrappedFsp.writeFile!(this.toFileResource(resource), content, opts); }

	open(resource: URI, opts: IFileOpenOptions): Promise<number> { return this.wrappedFsp.open!(this.toFileResource(resource), opts); }
	close(fd: number): Promise<void> { return this.wrappedFsp.close!(fd); }
	read(fd: number, pos: number, data: Uint8Array, offset: number, length: number): Promise<number> { return this.wrappedFsp.read!(fd, pos, data, offset, length); }
	write(fd: number, pos: number, data: Uint8Array, offset: number, length: number): Promise<number> { return this.wrappedFsp.write!(fd, pos, data, offset, length); }

	readFileStream(resource: URI, opts: IFileReadStreamOptions, token: CancellationToken): ReadableStreamEvents<Uint8Array> { return this.wrappedFsp.readFileStream!(this.toFileResource(resource), opts, token); }

	private toFileResource(resource: URI): URI { return resource.with({ scheme: Schemas.file, authority: '' }); }
}

export class TestInMemoryFileSystemProvider extends InMemoryFileSystemProvider implements IFileSystemProviderWithFileReadStreamCapability {
	override get capabilities(): FileSystemProviderCapabilities {
		return FileSystemProviderCapabilities.FileReadWrite
			| FileSystemProviderCapabilities.PathCaseSensitive
			| FileSystemProviderCapabilities.FileReadStream;
	}

	override readFileStream(resource: URI): ReadableStreamEvents<Uint8Array> {
		const BUFFER_SIZE = 64 * 1024;
		const stream = newWriteableStream<Uint8Array>(data => VSBuffer.concat(data.map(data => VSBuffer.wrap(data))).buffer);

		(async () => {
			try {
				const data = await this.readFile(resource);

				let offset = 0;
				while (offset < data.length) {
					await timeout(0);
					await stream.write(data.subarray(offset, offset + BUFFER_SIZE));
					offset += BUFFER_SIZE;
				}

				await timeout(0);
				stream.end();
			} catch (error) {
				stream.end(error);
			}
		})();

		return stream;
	}
}

export const productService: IProductService = { _serviceBrand: undefined, ...product };

export class TestHostService implements IHostService {

	declare readonly _serviceBrand: undefined;

	private _hasFocus = true;
	get hasFocus() { return this._hasFocus; }
	async hadLastFocus(): Promise<boolean> { return this._hasFocus; }

	private _onDidChangeFocus = new Emitter<boolean>();
	readonly onDidChangeFocus = this._onDidChangeFocus.event;

	private _onDidChangeWindow = new Emitter<number>();
	readonly onDidChangeActiveWindow = this._onDidChangeWindow.event;

	readonly onDidChangeFullScreen: Event<{ windowId: number; fullscreen: boolean }> = Event.None;

	setFocus(focus: boolean) {
		this._hasFocus = focus;
		this._onDidChangeFocus.fire(this._hasFocus);
	}

	async restart(): Promise<void> { }
	async reload(): Promise<void> { }
	async close(): Promise<void> { }
	async withExpectedShutdown<T>(expectedShutdownTask: () => Promise<T>): Promise<T> {
		return await expectedShutdownTask();
	}

	async focus(): Promise<void> { }
	async moveTop(): Promise<void> { }
	async getCursorScreenPoint(): Promise<undefined> { return undefined; }

	async getWindows(options: unknown) { return []; }

	async openWindow(arg1?: IOpenEmptyWindowOptions | IWindowOpenable[], arg2?: IOpenWindowOptions): Promise<void> { }

	async toggleFullScreen(): Promise<void> { }

	async getScreenshot(rect?: IRectangle): Promise<VSBuffer | undefined> { return undefined; }

	async getNativeWindowHandle(_windowId: number): Promise<VSBuffer | undefined> { return undefined; }

	readonly colorScheme = ColorScheme.DARK;
	onDidChangeColorScheme = Event.None;
}

export class TestFilesConfigurationService extends FilesConfigurationService {

	testOnFilesConfigurationChange(configuration: any): void {
		super.onFilesConfigurationChange(configuration, true);
	}
}

export class TestReadonlyTextFileEditorModel extends TextFileEditorModel {

	override isReadonly(): boolean {
		return true;
	}
}

export class TestEditorInput extends EditorInput {

	constructor(public resource: URI, private readonly _typeId: string) {
		super();
	}

	override get typeId(): string {
		return this._typeId;
	}

	override get editorId(): string {
		return this._typeId;
	}

	override resolve(): Promise<IDisposable | null> {
		return Promise.resolve(null);
	}
}

export function registerTestEditor(id: string, inputs: SyncDescriptor<EditorInput>[], serializerInputId?: string): IDisposable {
	const disposables = new DisposableStore();

	class TestEditor extends EditorPane {

		private _scopedContextKeyService: IContextKeyService;

		constructor(group: IEditorGroup) {
			super(id, group, NullTelemetryService, new TestThemeService(), disposables.add(new TestStorageService()));
			this._scopedContextKeyService = new MockContextKeyService();
		}

		override async setInput(input: EditorInput, options: IEditorOptions | undefined, context: IEditorOpenContext, token: CancellationToken): Promise<void> {
			super.setInput(input, options, context, token);

			await input.resolve();
		}

		override getId(): string { return id; }
		layout(): void { }
		protected createEditor(): void { }

		override get scopedContextKeyService() {
			return this._scopedContextKeyService;
		}
	}

	disposables.add(Registry.as<IEditorPaneRegistry>(Extensions.EditorPane).registerEditorPane(EditorPaneDescriptor.create(TestEditor, id, 'Test Editor Control'), inputs));

	if (serializerInputId) {

		interface ISerializedTestInput {
			resource: string;
		}

		class EditorsObserverTestEditorInputSerializer implements IEditorSerializer {

			canSerialize(editorInput: EditorInput): boolean {
				return true;
			}

			serialize(editorInput: EditorInput): string {
				const testEditorInput = <TestFileEditorInput>editorInput;
				const testInput: ISerializedTestInput = {
					resource: testEditorInput.resource.toString()
				};

				return JSON.stringify(testInput);
			}

			deserialize(instantiationService: IInstantiationService, serializedEditorInput: string): EditorInput {
				const testInput: ISerializedTestInput = JSON.parse(serializedEditorInput);

				return new TestFileEditorInput(URI.parse(testInput.resource), serializerInputId!);
			}
		}

		disposables.add(Registry.as<IEditorFactoryRegistry>(EditorExtensions.EditorFactory).registerEditorSerializer(serializerInputId, EditorsObserverTestEditorInputSerializer));
	}

	return disposables;
}

export function registerTestFileEditor(): IDisposable {
	const disposables = new DisposableStore();

	disposables.add(Registry.as<IEditorPaneRegistry>(Extensions.EditorPane).registerEditorPane(
		EditorPaneDescriptor.create(
			TestTextFileEditor,
			TestTextFileEditor.ID,
			'Text File Editor'
		),
		[new SyncDescriptor(FileEditorInput)]
	));

	return disposables;
}

export function registerTestResourceEditor(): IDisposable {
	const disposables = new DisposableStore();

	disposables.add(Registry.as<IEditorPaneRegistry>(Extensions.EditorPane).registerEditorPane(
		EditorPaneDescriptor.create(
			TestTextResourceEditor,
			TestTextResourceEditor.ID,
			'Text Editor'
		),
		[
			new SyncDescriptor(UntitledTextEditorInput),
			new SyncDescriptor(TextResourceEditorInput)
		]
	));

	return disposables;
}

export function registerTestSideBySideEditor(): IDisposable {
	const disposables = new DisposableStore();

	disposables.add(Registry.as<IEditorPaneRegistry>(Extensions.EditorPane).registerEditorPane(
		EditorPaneDescriptor.create(
			SideBySideEditor,
			SideBySideEditor.ID,
			'Text Editor'
		),
		[
			new SyncDescriptor(SideBySideEditorInput)
		]
	));

	return disposables;
}

export class TestFileEditorInput extends EditorInput implements IFileEditorInput {

	readonly preferredResource;

	gotDisposed = false;
	gotSaved = false;
	gotSavedAs = false;
	gotReverted = false;
	dirty = false;
	modified: boolean | undefined;
	private fails = false;

	disableToUntyped = false;

	constructor(
		public resource: URI,
		private _typeId: string
	) {
		super();

		this.preferredResource = this.resource;
	}

	override get typeId() { return this._typeId; }
	override get editorId() { return this._typeId; }

	private _capabilities: EditorInputCapabilities = EditorInputCapabilities.None;
	override get capabilities(): EditorInputCapabilities { return this._capabilities; }
	override set capabilities(capabilities: EditorInputCapabilities) {
		if (this._capabilities !== capabilities) {
			this._capabilities = capabilities;
			this._onDidChangeCapabilities.fire();
		}
	}

	override resolve(): Promise<IDisposable | null> { return !this.fails ? Promise.resolve(null) : Promise.reject(new Error('fails')); }
	override matches(other: EditorInput | IResourceEditorInput | ITextResourceEditorInput | IUntitledTextResourceEditorInput): boolean {
		if (super.matches(other)) {
			return true;
		}
		if (other instanceof EditorInput) {
			return !!(other?.resource && this.resource.toString() === other.resource.toString() && other instanceof TestFileEditorInput && other.typeId === this.typeId);
		}
		return isEqual(this.resource, other.resource) && (this.editorId === other.options?.override || other.options?.override === undefined);
	}
	setPreferredResource(resource: URI): void { }
	async setEncoding(encoding: string) { }
	getEncoding() { return undefined; }
	setPreferredName(name: string): void { }
	setPreferredDescription(description: string): void { }
	setPreferredEncoding(encoding: string) { }
	setPreferredContents(contents: string): void { }
	setLanguageId(languageId: string, source?: string) { }
	setPreferredLanguageId(languageId: string) { }
	setForceOpenAsBinary(): void { }
	setFailToOpen(): void {
		this.fails = true;
	}
	override async save(groupId: GroupIdentifier, options?: ISaveOptions): Promise<EditorInput | undefined> {
		this.gotSaved = true;
		this.dirty = false;
		return this;
	}
	override async saveAs(groupId: GroupIdentifier, options?: ISaveOptions): Promise<EditorInput | undefined> {
		this.gotSavedAs = true;
		return this;
	}
	override async revert(group: GroupIdentifier, options?: IRevertOptions): Promise<void> {
		this.gotReverted = true;
		this.gotSaved = false;
		this.gotSavedAs = false;
		this.dirty = false;
	}
	override toUntyped(): IUntypedEditorInput | undefined {
		if (this.disableToUntyped) {
			return undefined;
		}
		return { resource: this.resource };
	}
	setModified(): void { this.modified = true; }
	override isModified(): boolean {
		return this.modified === undefined ? this.dirty : this.modified;
	}
	setDirty(): void { this.dirty = true; }
	override isDirty(): boolean {
		return this.dirty;
	}
	isResolved(): boolean { return false; }
	override dispose(): void {
		super.dispose();
		this.gotDisposed = true;
	}
	movedEditor: IMoveResult | undefined = undefined;
	override async rename(): Promise<IMoveResult | undefined> { return this.movedEditor; }

	private moveDisabledReason: string | undefined = undefined;
	setMoveDisabled(reason: string): void {
		this.moveDisabledReason = reason;
	}

	override canMove(sourceGroup: GroupIdentifier, targetGroup: GroupIdentifier): string | true {
		if (typeof this.moveDisabledReason === 'string') {
			return this.moveDisabledReason;
		}
		return super.canMove(sourceGroup, targetGroup);
	}
}

export class TestSingletonFileEditorInput extends TestFileEditorInput {

	override get capabilities(): EditorInputCapabilities { return EditorInputCapabilities.Singleton; }
}

export class TestEditorPart extends MainEditorPart implements IEditorGroupsService {

	declare readonly _serviceBrand: undefined;

	readonly mainPart = this;
	readonly parts: readonly IEditorPart[] = [this];

	readonly onDidCreateAuxiliaryEditorPart: Event<IAuxiliaryEditorPart> = Event.None;

	testSaveState(): void {
		return super.saveState();
	}

	clearState(): void {
		const workspaceMemento = this.getMemento(StorageScope.WORKSPACE, StorageTarget.MACHINE) as Record<string, unknown>;
		for (const key of Object.keys(workspaceMemento)) {
			delete workspaceMemento[key];
		}

		const profileMemento = this.getMemento(StorageScope.PROFILE, StorageTarget.MACHINE) as Record<string, unknown>;
		for (const key of Object.keys(profileMemento)) {
			delete profileMemento[key];
		}
	}

	registerEditorPart(part: IEditorPart): IDisposable {
		return Disposable.None;
	}

	createAuxiliaryEditorPart(): Promise<IAuxiliaryEditorPart> {
		throw new Error('Method not implemented.');
	}

	getScopedInstantiationService(part: IEditorPart): IInstantiationService {
		throw new Error('Method not implemented.');
	}

	getPart(group: number | IEditorGroup): IEditorPart { return this; }

	saveWorkingSet(name: string): IEditorWorkingSet { throw new Error('Method not implemented.'); }
	getWorkingSets(): IEditorWorkingSet[] { throw new Error('Method not implemented.'); }
	applyWorkingSet(workingSet: IEditorWorkingSet | 'empty', options?: IEditorWorkingSetOptions): Promise<boolean> { throw new Error('Method not implemented.'); }
	deleteWorkingSet(workingSet: IEditorWorkingSet): Promise<boolean> { throw new Error('Method not implemented.'); }

	registerContextKeyProvider<T extends ContextKeyValue>(provider: IEditorGroupContextKeyProvider<T>): IDisposable { throw new Error('Method not implemented.'); }
}

export class TestEditorParts extends EditorParts {
	testMainPart!: TestEditorPart;

	protected override createMainEditorPart(): MainEditorPart {
		this.testMainPart = this.instantiationService.createInstance(TestEditorPart, this);

		return this.testMainPart;
	}
}

export async function createEditorParts(instantiationService: IInstantiationService, disposables: DisposableStore): Promise<TestEditorParts> {
	const parts = instantiationService.createInstance(TestEditorParts);
	const part = disposables.add(parts).testMainPart;
	part.create(document.createElement('div'));
	part.layout(1080, 800, 0, 0);

	await parts.whenReady;

	return parts;
}

export async function createEditorPart(instantiationService: IInstantiationService, disposables: DisposableStore): Promise<TestEditorPart> {
	return (await createEditorParts(instantiationService, disposables)).testMainPart;
}

export class TestListService implements IListService {
	declare readonly _serviceBrand: undefined;

	lastFocusedList: any | undefined = undefined;

	register(): IDisposable {
		return Disposable.None;
	}
}

export class TestPathService implements IPathService {

	declare readonly _serviceBrand: undefined;

	constructor(private readonly fallbackUserHome: URI = URI.from({ scheme: Schemas.file, path: '/' }), public defaultUriScheme = Schemas.file) { }

	hasValidBasename(resource: URI, basename?: string): Promise<boolean>;
	hasValidBasename(resource: URI, os: OperatingSystem, basename?: string): boolean;
	hasValidBasename(resource: URI, arg2?: string | OperatingSystem, name?: string): boolean | Promise<boolean> {
		if (typeof arg2 === 'string' || typeof arg2 === 'undefined') {
			return isValidBasename(arg2 ?? basename(resource));
		}

		return isValidBasename(name ?? basename(resource));
	}

	get path() { return Promise.resolve(isWindows ? win32 : posix); }

	userHome(options?: { preferLocal: boolean }): Promise<URI>;
	userHome(options: { preferLocal: true }): URI;
	userHome(options?: { preferLocal: boolean }): Promise<URI> | URI {
		return options?.preferLocal ? this.fallbackUserHome : Promise.resolve(this.fallbackUserHome);
	}

	get resolvedUserHome() { return this.fallbackUserHome; }

	async fileURI(path: string): Promise<URI> {
		return URI.file(path);
	}
}

export interface ITestTextFileEditorModelManager extends ITextFileEditorModelManager, IDisposable {
	add(resource: URI, model: TextFileEditorModel): void;
	remove(resource: URI): void;
}

interface ITestTextFileEditorModel extends ITextFileEditorModel {
	readonly lastResolvedFileStat: IFileStatWithMetadata | undefined;
}

export function getLastResolvedFileStat(model: unknown): IFileStatWithMetadata | undefined {
	const candidate = model as ITestTextFileEditorModel | undefined;

	return candidate?.lastResolvedFileStat;
}

export class TestWorkspacesService implements IWorkspacesService {
	_serviceBrand: undefined;

	onDidChangeRecentlyOpened = Event.None;

	async createUntitledWorkspace(folders?: IWorkspaceFolderCreationData[], remoteAuthority?: string): Promise<IWorkspaceIdentifier> { throw new Error('Method not implemented.'); }
	async deleteUntitledWorkspace(workspace: IWorkspaceIdentifier): Promise<void> { }
	async addRecentlyOpened(recents: IRecent[]): Promise<void> { }
	async removeRecentlyOpened(workspaces: URI[]): Promise<void> { }
	async clearRecentlyOpened(): Promise<void> { }
	async getRecentlyOpened(): Promise<IRecentlyOpened> { return { files: [], workspaces: [] }; }
	async getDirtyWorkspaces(): Promise<(IFolderBackupInfo | IWorkspaceBackupInfo)[]> { return []; }
	async enterWorkspace(path: URI): Promise<IEnterWorkspaceResult | undefined> { throw new Error('Method not implemented.'); }
	async getWorkspaceIdentifier(workspacePath: URI): Promise<IWorkspaceIdentifier> { throw new Error('Method not implemented.'); }
}

export class TestTerminalInstanceService implements ITerminalInstanceService {
	onDidCreateInstance = Event.None;
	onDidRegisterBackend = Event.None;
	declare readonly _serviceBrand: undefined;

	convertProfileToShellLaunchConfig(shellLaunchConfigOrProfile?: IShellLaunchConfig | ITerminalProfile, cwd?: string | URI): IShellLaunchConfig { throw new Error('Method not implemented.'); }
	preparePathForTerminalAsync(path: string, executable: string | undefined, title: string, shellType: TerminalShellType, remoteAuthority: string | undefined): Promise<string> { throw new Error('Method not implemented.'); }
	createInstance(options: ICreateTerminalOptions, target: TerminalLocation): ITerminalInstance { throw new Error('Method not implemented.'); }
	async getBackend(remoteAuthority?: string): Promise<ITerminalBackend | undefined> { throw new Error('Method not implemented.'); }
	didRegisterBackend(backend: ITerminalBackend): void { throw new Error('Method not implemented.'); }
	getRegisteredBackends(): IterableIterator<ITerminalBackend> { throw new Error('Method not implemented.'); }
}

export class TestTerminalEditorService implements ITerminalEditorService {
	_serviceBrand: undefined;
	activeInstance: ITerminalInstance | undefined;
	instances: readonly ITerminalInstance[] = [];
	onDidDisposeInstance = Event.None;
	onDidFocusInstance = Event.None;
	onDidChangeInstanceCapability = Event.None;
	onDidChangeActiveInstance = Event.None;
	onDidChangeInstances = Event.None;
	openEditor(instance: ITerminalInstance, editorOptions?: TerminalEditorLocation): Promise<void> { throw new Error('Method not implemented.'); }
	detachInstance(instance: ITerminalInstance): void { throw new Error('Method not implemented.'); }
	splitInstance(instanceToSplit: ITerminalInstance, shellLaunchConfig?: IShellLaunchConfig): ITerminalInstance { throw new Error('Method not implemented.'); }
	revealActiveEditor(preserveFocus?: boolean): Promise<void> { throw new Error('Method not implemented.'); }
	resolveResource(instance: ITerminalInstance): URI { throw new Error('Method not implemented.'); }
	reviveInput(deserializedInput: IDeserializedTerminalEditorInput): TerminalEditorInput { throw new Error('Method not implemented.'); }
	getInputFromResource(resource: URI): TerminalEditorInput { throw new Error('Method not implemented.'); }
	setActiveInstance(instance: ITerminalInstance): void { throw new Error('Method not implemented.'); }
	focusActiveInstance(): Promise<void> { throw new Error('Method not implemented.'); }
	focusInstance(instance: ITerminalInstance): void { throw new Error('Method not implemented.'); }
	getInstanceFromResource(resource: URI | undefined): ITerminalInstance | undefined { throw new Error('Method not implemented.'); }
	focusFindWidget(): void { throw new Error('Method not implemented.'); }
	hideFindWidget(): void { throw new Error('Method not implemented.'); }
	findNext(): void { throw new Error('Method not implemented.'); }
	findPrevious(): void { throw new Error('Method not implemented.'); }
}

export class TestTerminalGroupService implements ITerminalGroupService {
	_serviceBrand: undefined;
	activeInstance: ITerminalInstance | undefined;
	instances: readonly ITerminalInstance[] = [];
	groups: readonly ITerminalGroup[] = [];
	activeGroup: ITerminalGroup | undefined;
	activeGroupIndex: number = 0;
	lastAccessedMenu: 'inline-tab' | 'tab-list' = 'inline-tab';
	onDidChangeActiveGroup = Event.None;
	onDidDisposeGroup = Event.None;
	onDidShow = Event.None;
	onDidChangeGroups = Event.None;
	onDidChangePanelOrientation = Event.None;
	onDidDisposeInstance = Event.None;
	onDidFocusInstance = Event.None;
	onDidChangeInstanceCapability = Event.None;
	onDidChangeActiveInstance = Event.None;
	onDidChangeInstances = Event.None;
	createGroup(instance?: any): ITerminalGroup { throw new Error('Method not implemented.'); }
	getGroupForInstance(instance: ITerminalInstance): ITerminalGroup | undefined { throw new Error('Method not implemented.'); }
	moveGroup(source: ITerminalInstance | ITerminalInstance[], target: ITerminalInstance): void { throw new Error('Method not implemented.'); }
	moveGroupToEnd(source: ITerminalInstance | ITerminalInstance[]): void { throw new Error('Method not implemented.'); }
	moveInstance(source: ITerminalInstance, target: ITerminalInstance, side: 'before' | 'after'): void { throw new Error('Method not implemented.'); }
	unsplitInstance(instance: ITerminalInstance): void { throw new Error('Method not implemented.'); }
	joinInstances(instances: ITerminalInstance[]): void { throw new Error('Method not implemented.'); }
	instanceIsSplit(instance: ITerminalInstance): boolean { throw new Error('Method not implemented.'); }
	getGroupLabels(): string[] { throw new Error('Method not implemented.'); }
	setActiveGroupByIndex(index: number): void { throw new Error('Method not implemented.'); }
	setActiveGroupToNext(): void { throw new Error('Method not implemented.'); }
	setActiveGroupToPrevious(): void { throw new Error('Method not implemented.'); }
	setActiveInstanceByIndex(terminalIndex: number): void { throw new Error('Method not implemented.'); }
	setContainer(container: HTMLElement): void { throw new Error('Method not implemented.'); }
	showPanel(focus?: boolean): Promise<void> { throw new Error('Method not implemented.'); }
	hidePanel(): void { throw new Error('Method not implemented.'); }
	focusTabs(): void { throw new Error('Method not implemented.'); }
	focusHover(): void { throw new Error('Method not implemented.'); }
	setActiveInstance(instance: ITerminalInstance): void { throw new Error('Method not implemented.'); }
	focusActiveInstance(): Promise<void> { throw new Error('Method not implemented.'); }
	focusInstance(instance: ITerminalInstance): void { throw new Error('Method not implemented.'); }
	getInstanceFromResource(resource: URI | undefined): ITerminalInstance | undefined { throw new Error('Method not implemented.'); }
	focusFindWidget(): void { throw new Error('Method not implemented.'); }
	hideFindWidget(): void { throw new Error('Method not implemented.'); }
	findNext(): void { throw new Error('Method not implemented.'); }
	findPrevious(): void { throw new Error('Method not implemented.'); }
	updateVisibility(): void { throw new Error('Method not implemented.'); }
}

export class TestTerminalProfileService implements ITerminalProfileService {
	_serviceBrand: undefined;
	availableProfiles: ITerminalProfile[] = [];
	contributedProfiles: IExtensionTerminalProfile[] = [];
	profilesReady: Promise<void> = Promise.resolve();
	onDidChangeAvailableProfiles = Event.None;
	getPlatformKey(): Promise<string> { throw new Error('Method not implemented.'); }
	refreshAvailableProfiles(): void { throw new Error('Method not implemented.'); }
	getDefaultProfileName(): string | undefined { throw new Error('Method not implemented.'); }
	getDefaultProfile(): ITerminalProfile | undefined { throw new Error('Method not implemented.'); }
	getContributedDefaultProfile(shellLaunchConfig: IShellLaunchConfig): Promise<IExtensionTerminalProfile | undefined> { throw new Error('Method not implemented.'); }
	registerContributedProfile(args: IRegisterContributedProfileArgs): Promise<void> { throw new Error('Method not implemented.'); }
	getContributedProfileProvider(extensionIdentifier: string, id: string): ITerminalProfileProvider | undefined { throw new Error('Method not implemented.'); }
	registerTerminalProfileProvider(extensionIdentifier: string, id: string, profileProvider: ITerminalProfileProvider): IDisposable { throw new Error('Method not implemented.'); }
}

export class TestTerminalProfileResolverService implements ITerminalProfileResolverService {
	_serviceBrand: undefined;
	defaultProfileName = '';
	resolveIcon(shellLaunchConfig: IShellLaunchConfig): void { }
	async resolveShellLaunchConfig(shellLaunchConfig: IShellLaunchConfig, options: IShellLaunchConfigResolveOptions): Promise<void> { }
	async getDefaultProfile(options: IShellLaunchConfigResolveOptions): Promise<ITerminalProfile> { return { path: '/default', profileName: 'Default', isDefault: true }; }
	async getDefaultShell(options: IShellLaunchConfigResolveOptions): Promise<string> { return '/default'; }
	async getDefaultShellArgs(options: IShellLaunchConfigResolveOptions): Promise<string | string[]> { return []; }
	getDefaultIcon(): TerminalIcon & ThemeIcon { return Codicon.terminal; }
	async getEnvironment(): Promise<IProcessEnvironment> { return env; }
	getSafeConfigValue(key: string, os: OperatingSystem): unknown | undefined { return undefined; }
	getSafeConfigValueFullKey(key: string): unknown | undefined { return undefined; }
	createProfileFromShellAndShellArgs(shell?: unknown, shellArgs?: unknown): Promise<string | ITerminalProfile> { throw new Error('Method not implemented.'); }
}

export class TestTerminalConfigurationService extends TerminalConfigurationService {
	get fontMetrics() { return this._fontMetrics; }
	// eslint-disable-next-line local/code-no-any-casts
	setConfig(config: Partial<ITerminalConfiguration>) { this._config = config as any; }
}

export class TestQuickInputService implements IQuickInputService {
	declare readonly _serviceBrand: undefined;

	readonly onShow = Event.None;
	readonly onHide = Event.None;

	readonly currentQuickInput = undefined;
	readonly quickAccess = undefined!;
	backButton!: IQuickInputButton;

	pick<T extends IQuickPickItem>(picks: Promise<QuickPickInput<T>[]> | QuickPickInput<T>[], options?: IPickOptions<T> & { canPickMany: true }, token?: CancellationToken): Promise<T[]>;
	pick<T extends IQuickPickItem>(picks: Promise<QuickPickInput<T>[]> | QuickPickInput<T>[], options?: IPickOptions<T> & { canPickMany: false }, token?: CancellationToken): Promise<T>;
	async pick<T extends IQuickPickItem>(picks: Promise<QuickPickInput<T>[]> | QuickPickInput<T>[], options?: Omit<IPickOptions<T>, 'canPickMany'>, token?: CancellationToken): Promise<T | undefined> {
		if (Array.isArray(picks)) {
			// eslint-disable-next-line local/code-no-any-casts
			return <any>{ label: 'selectedPick', description: 'pick description', value: 'selectedPick' };
		} else {
			return undefined;
		}
	}

	async input(options?: IInputOptions, token?: CancellationToken): Promise<string> { return options ? 'resolved' + options.prompt : 'resolved'; }

	createQuickPick<T extends IQuickPickItem>(): IQuickPick<T, { useSeparators: boolean }> { throw new Error('not implemented.'); }
	createInputBox(): IInputBox { throw new Error('not implemented.'); }
	createQuickWidget(): IQuickWidget { throw new Error('Method not implemented.'); }
	createQuickTree<T extends IQuickTreeItem>(): IQuickTree<T> { throw new Error('not implemented.'); }
	focus(): void { throw new Error('not implemented.'); }
	toggle(): void { throw new Error('not implemented.'); }
	navigate(next: boolean, quickNavigate?: IQuickNavigateConfiguration): void { throw new Error('not implemented.'); }
	accept(): Promise<void> { throw new Error('not implemented.'); }
	back(): Promise<void> { throw new Error('not implemented.'); }
	cancel(): Promise<void> { throw new Error('not implemented.'); }
	setAlignment(alignment: 'top' | 'center' | { top: number; left: number }): void { throw new Error('not implemented.'); }
	toggleHover(): void { throw new Error('not implemented.'); }
}

class TestLanguageDetectionService implements ILanguageDetectionService {

	declare readonly _serviceBrand: undefined;

	isEnabledForLanguage(languageId: string): boolean { return false; }
	async detectLanguage(resource: URI, supportedLangs?: string[] | undefined): Promise<string | undefined> { return undefined; }
}

export class TestRemoteAgentService implements IRemoteAgentService {

	declare readonly _serviceBrand: undefined;

	getConnection(): IRemoteAgentConnection | null { return null; }
	async getEnvironment(): Promise<IRemoteAgentEnvironment | null> { return null; }
	async getRawEnvironment(): Promise<IRemoteAgentEnvironment | null> { return null; }
	async getExtensionHostExitInfo(reconnectionToken: string): Promise<IExtensionHostExitInfo | null> { return null; }
	async getDiagnosticInfo(options: IDiagnosticInfoOptions): Promise<IDiagnosticInfo | undefined> { return undefined; }
	async updateTelemetryLevel(telemetryLevel: TelemetryLevel): Promise<void> { }
	async logTelemetry(eventName: string, data?: ITelemetryData): Promise<void> { }
	async flushTelemetry(): Promise<void> { }
	async getRoundTripTime(): Promise<number | undefined> { return undefined; }
	async endConnection(): Promise<void> { }
}

export class TestRemoteExtensionsScannerService implements IRemoteExtensionsScannerService {
	declare readonly _serviceBrand: undefined;
	async whenExtensionsReady(): Promise<InstallExtensionSummary> { return { failed: [] }; }
	scanExtensions(): Promise<IExtensionDescription[]> { throw new Error('Method not implemented.'); }
}

export class TestWorkbenchExtensionEnablementService implements IWorkbenchExtensionEnablementService {
	_serviceBrand: undefined;
	onEnablementChanged = Event.None;
	getEnablementState(extension: IExtension): EnablementState { return EnablementState.EnabledGlobally; }
	getEnablementStates(extensions: IExtension[], workspaceTypeOverrides?: { trusted?: boolean | undefined } | undefined): EnablementState[] { return []; }
	getDependenciesEnablementStates(extension: IExtension): [IExtension, EnablementState][] { return []; }
	canChangeEnablement(extension: IExtension): boolean { return true; }
	canChangeWorkspaceEnablement(extension: IExtension): boolean { return true; }
	isEnabled(extension: IExtension): boolean { return true; }
	isEnabledEnablementState(enablementState: EnablementState): boolean { return true; }
	isDisabledGlobally(extension: IExtension): boolean { return false; }
	async setEnablement(extensions: IExtension[], state: EnablementState): Promise<boolean[]> { return []; }
	async updateExtensionsEnablementsWhenWorkspaceTrustChanges(): Promise<void> { }
}

export class TestWorkbenchExtensionManagementService implements IWorkbenchExtensionManagementService {
	_serviceBrand: undefined;
	onInstallExtension = Event.None;
	onDidInstallExtensions = Event.None;
	onUninstallExtension = Event.None;
	onDidUninstallExtension = Event.None;
	onDidUpdateExtensionMetadata = Event.None;
	onProfileAwareInstallExtension = Event.None;
	onProfileAwareDidInstallExtensions = Event.None;
	onProfileAwareUninstallExtension = Event.None;
	onProfileAwareDidUninstallExtension = Event.None;
	onDidProfileAwareUninstallExtensions = Event.None;
	onProfileAwareDidUpdateExtensionMetadata = Event.None;
	onDidChangeProfile = Event.None;
	onDidEnableExtensions = Event.None;
	preferPreReleases = true;
	installVSIX(location: URI, manifest: Readonly<IRelaxedExtensionManifest>, installOptions?: InstallOptions | undefined): Promise<ILocalExtension> {
		throw new Error('Method not implemented.');
	}
	installFromLocation(location: URI): Promise<ILocalExtension> {
		throw new Error('Method not implemented.');
	}
	installGalleryExtensions(extensions: InstallExtensionInfo[]): Promise<InstallExtensionResult[]> {
		throw new Error('Method not implemented.');
	}
	async updateFromGallery(gallery: IGalleryExtension, extension: ILocalExtension, installOptions?: InstallOptions | undefined): Promise<ILocalExtension> { return extension; }
	zip(extension: ILocalExtension): Promise<URI> {
		throw new Error('Method not implemented.');
	}
	getManifest(vsix: URI): Promise<Readonly<IRelaxedExtensionManifest>> {
		throw new Error('Method not implemented.');
	}
	install(vsix: URI, options?: InstallOptions | undefined): Promise<ILocalExtension> {
		throw new Error('Method not implemented.');
	}
	isAllowed(): true | IMarkdownString { return true; }
	async canInstall(extension: IGalleryExtension): Promise<true> { return true; }
	installFromGallery(extension: IGalleryExtension, options?: InstallOptions | undefined): Promise<ILocalExtension> {
		throw new Error('Method not implemented.');
	}
	uninstall(extension: ILocalExtension, options?: UninstallOptions | undefined): Promise<void> {
		throw new Error('Method not implemented.');
	}
	uninstallExtensions(extensions: UninstallExtensionInfo[]): Promise<void> {
		throw new Error('Method not implemented.');
	}
	async getInstalled(type?: ExtensionType | undefined): Promise<ILocalExtension[]> { return []; }
	getExtensionsControlManifest(): Promise<IExtensionsControlManifest> {
		throw new Error('Method not implemented.');
	}
	async updateMetadata(local: ILocalExtension, metadata: Partial<Metadata>): Promise<ILocalExtension> { return local; }
	registerParticipant(pariticipant: IExtensionManagementParticipant): void { }
	async getTargetPlatform(): Promise<TargetPlatform> { return TargetPlatform.UNDEFINED; }
	async cleanUp(): Promise<void> { }
	download(): Promise<URI> {
		throw new Error('Method not implemented.');
	}
	copyExtensions(): Promise<void> { throw new Error('Not Supported'); }
	toggleApplicationScope(): Promise<ILocalExtension> { throw new Error('Not Supported'); }
	installExtensionsFromProfile(): Promise<ILocalExtension[]> { throw new Error('Not Supported'); }
	whenProfileChanged(from: IUserDataProfile, to: IUserDataProfile): Promise<void> { throw new Error('Not Supported'); }
	getInstalledWorkspaceExtensionLocations(): URI[] { throw new Error('Method not implemented.'); }
	getInstalledWorkspaceExtensions(): Promise<ILocalExtension[]> { throw new Error('Method not implemented.'); }
	installResourceExtension(): Promise<ILocalExtension> { throw new Error('Method not implemented.'); }
	getExtensions(): Promise<IResourceExtension[]> { throw new Error('Method not implemented.'); }
	resetPinnedStateForAllUserExtensions(pinned: boolean): Promise<void> { throw new Error('Method not implemented.'); }
	getInstallableServers(extension: IGalleryExtension): Promise<IExtensionManagementServer[]> { throw new Error('Method not implemented.'); }
	isPublisherTrusted(extension: IGalleryExtension): boolean { return false; }
	getTrustedPublishers() { return []; }
	trustPublishers(): void { }
	untrustPublishers(): void { }
	async requestPublisherTrust(extensions: InstallExtensionInfo[]): Promise<void> { }
}



export class TestWebExtensionsScannerService implements IWebExtensionsScannerService {
	_serviceBrand: undefined;
	onDidChangeProfile = Event.None;
	async scanSystemExtensions(): Promise<IExtension[]> { return []; }
	async scanUserExtensions(): Promise<IScannedExtension[]> { return []; }
	async scanExtensionsUnderDevelopment(): Promise<IExtension[]> { return []; }
	async copyExtensions(): Promise<void> {
		throw new Error('Method not implemented.');
	}
	scanExistingExtension(extensionLocation: URI, extensionType: ExtensionType): Promise<IScannedExtension | null> {
		throw new Error('Method not implemented.');
	}
	addExtension(location: URI, metadata?: Partial<IGalleryMetadata & { isApplicationScoped: boolean; isMachineScoped: boolean; isBuiltin: boolean; isSystem: boolean; updated: boolean; preRelease: boolean; installedTimestamp: number }> | undefined): Promise<IExtension> {
		throw new Error('Method not implemented.');
	}
	addExtensionFromGallery(galleryExtension: IGalleryExtension, metadata?: Partial<IGalleryMetadata & { isApplicationScoped: boolean; isMachineScoped: boolean; isBuiltin: boolean; isSystem: boolean; updated: boolean; preRelease: boolean; installedTimestamp: number }> | undefined): Promise<IExtension> {
		throw new Error('Method not implemented.');
	}
	removeExtension(): Promise<void> {
		throw new Error('Method not implemented.');
	}
	updateMetadata(extension: IScannedExtension, metaData: Partial<Metadata>, profileLocation: URI): Promise<IScannedExtension> {
		throw new Error('Method not implemented.');
	}
	scanExtensionManifest(extensionLocation: URI): Promise<Readonly<IRelaxedExtensionManifest> | null> {
		throw new Error('Method not implemented.');
	}
}

export async function workbenchTeardown(instantiationService: IInstantiationService): Promise<void> {
	return instantiationService.invokeFunction(async accessor => {
		const workingCopyService = accessor.get(IWorkingCopyService);
		const editorGroupService = accessor.get(IEditorGroupsService);

		for (const workingCopy of workingCopyService.workingCopies) {
			await workingCopy.revert();
		}

		for (const group of editorGroupService.groups) {
			await group.closeAllEditors();
		}

		for (const group of editorGroupService.groups) {
			editorGroupService.removeGroup(group);
		}
	});
}

export class TestContextMenuService implements IContextMenuService {

	_serviceBrand: undefined;

	readonly onDidShowContextMenu = Event.None;
	readonly onDidHideContextMenu = Event.None;

	showContextMenu(delegate: IContextMenuDelegate | IContextMenuMenuDelegate): void {
		throw new Error('Method not implemented.');
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/test/browser/parts/editor/breadcrumbModel.test.ts]---
Location: vscode-main/src/vs/workbench/test/browser/parts/editor/breadcrumbModel.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { URI } from '../../../../../base/common/uri.js';
import { WorkspaceFolder } from '../../../../../platform/workspace/common/workspace.js';
import { BreadcrumbsModel, FileElement } from '../../../../browser/parts/editor/breadcrumbsModel.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { FileKind } from '../../../../../platform/files/common/files.js';
import { TestContextService } from '../../../common/workbenchTestServices.js';
import { Workspace } from '../../../../../platform/workspace/test/common/testWorkspace.js';
import { mock } from '../../../../../base/test/common/mock.js';
import { IOutlineService } from '../../../../services/outline/browser/outline.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

suite('Breadcrumb Model', function () {

	let model: BreadcrumbsModel;
	const workspaceService = new TestContextService(new Workspace('ffff', [new WorkspaceFolder({ uri: URI.parse('foo:/bar/baz/ws'), name: 'ws', index: 0 })]));
	const configService = new class extends TestConfigurationService {
		override getValue<T>(...args: any[]): T | undefined {
			if (args[0] === 'breadcrumbs.filePath') {
				return 'on' as T;
			}
			if (args[0] === 'breadcrumbs.symbolPath') {
				return 'on' as T;
			}
			return super.getValue(...args);
		}
		override updateValue() {
			return Promise.resolve();
		}
	};

	teardown(function () {
		model.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('only uri, inside workspace', function () {

		model = new BreadcrumbsModel(URI.parse('foo:/bar/baz/ws/some/path/file.ts'), undefined, configService, workspaceService, new class extends mock<IOutlineService>() { });
		const elements = model.getElements();

		assert.strictEqual(elements.length, 3);
		const [one, two, three] = elements as FileElement[];
		assert.strictEqual(one.kind, FileKind.FOLDER);
		assert.strictEqual(two.kind, FileKind.FOLDER);
		assert.strictEqual(three.kind, FileKind.FILE);
		assert.strictEqual(one.uri.toString(), 'foo:/bar/baz/ws/some');
		assert.strictEqual(two.uri.toString(), 'foo:/bar/baz/ws/some/path');
		assert.strictEqual(three.uri.toString(), 'foo:/bar/baz/ws/some/path/file.ts');
	});

	test('display uri matters for FileElement', function () {

		model = new BreadcrumbsModel(URI.parse('foo:/bar/baz/ws/some/PATH/file.ts'), undefined, configService, workspaceService, new class extends mock<IOutlineService>() { });
		const elements = model.getElements();

		assert.strictEqual(elements.length, 3);
		const [one, two, three] = elements as FileElement[];
		assert.strictEqual(one.kind, FileKind.FOLDER);
		assert.strictEqual(two.kind, FileKind.FOLDER);
		assert.strictEqual(three.kind, FileKind.FILE);
		assert.strictEqual(one.uri.toString(), 'foo:/bar/baz/ws/some');
		assert.strictEqual(two.uri.toString(), 'foo:/bar/baz/ws/some/PATH');
		assert.strictEqual(three.uri.toString(), 'foo:/bar/baz/ws/some/PATH/file.ts');
	});

	test('only uri, outside workspace', function () {

		model = new BreadcrumbsModel(URI.parse('foo:/outside/file.ts'), undefined, configService, workspaceService, new class extends mock<IOutlineService>() { });
		const elements = model.getElements();

		assert.strictEqual(elements.length, 2);
		const [one, two] = elements as FileElement[];
		assert.strictEqual(one.kind, FileKind.FOLDER);
		assert.strictEqual(two.kind, FileKind.FILE);
		assert.strictEqual(one.uri.toString(), 'foo:/outside');
		assert.strictEqual(two.uri.toString(), 'foo:/outside/file.ts');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/test/browser/parts/editor/diffEditorInput.test.ts]---
Location: vscode-main/src/vs/workbench/test/browser/parts/editor/diffEditorInput.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { EditorInput } from '../../../../common/editor/editorInput.js';
import { DiffEditorInput } from '../../../../common/editor/diffEditorInput.js';
import { workbenchInstantiationService } from '../../workbenchTestServices.js';
import { EditorResourceAccessor, isDiffEditorInput, isResourceDiffEditorInput, isResourceSideBySideEditorInput, IUntypedEditorInput } from '../../../../common/editor.js';
import { URI } from '../../../../../base/common/uri.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

suite('Diff editor input', () => {

	class MyEditorInput extends EditorInput {

		constructor(public resource: URI | undefined = undefined) {
			super();
		}

		override get typeId(): string { return 'myEditorInput'; }
		override resolve(): any { return null; }

		override toUntyped() {
			return { resource: this.resource, options: { override: this.typeId } };
		}

		override matches(otherInput: EditorInput | IUntypedEditorInput): boolean {
			if (super.matches(otherInput)) {
				return true;
			}

			const resource = EditorResourceAccessor.getCanonicalUri(otherInput);
			return resource?.toString() === this.resource?.toString();
		}
	}

	const disposables = new DisposableStore();

	teardown(() => {
		disposables.clear();
	});

	test('basics', () => {
		const instantiationService = workbenchInstantiationService(undefined, disposables);

		let counter = 0;
		const input = disposables.add(new MyEditorInput());
		disposables.add(input.onWillDispose(() => {
			assert(true);
			counter++;
		}));

		const otherInput = disposables.add(new MyEditorInput());
		disposables.add(otherInput.onWillDispose(() => {
			assert(true);
			counter++;
		}));

		const diffInput = instantiationService.createInstance(DiffEditorInput, 'name', 'description', input, otherInput, undefined);

		assert.ok(isDiffEditorInput(diffInput));
		assert.ok(!isDiffEditorInput(input));

		assert.strictEqual(diffInput.original, input);
		assert.strictEqual(diffInput.modified, otherInput);
		assert(diffInput.matches(diffInput));
		assert(!diffInput.matches(otherInput));

		diffInput.dispose();
		assert.strictEqual(counter, 0);
	});

	test('toUntyped', () => {
		const instantiationService = workbenchInstantiationService(undefined, disposables);

		const input = disposables.add(new MyEditorInput(URI.file('foo/bar1')));
		const otherInput = disposables.add(new MyEditorInput(URI.file('foo/bar2')));

		const diffInput = instantiationService.createInstance(DiffEditorInput, 'name', 'description', input, otherInput, undefined);

		const untypedDiffInput = diffInput.toUntyped();
		assert.ok(isResourceDiffEditorInput(untypedDiffInput));
		assert.ok(!isResourceSideBySideEditorInput(untypedDiffInput));
		assert.ok(diffInput.matches(untypedDiffInput));
	});

	test('disposes when input inside disposes', function () {
		const instantiationService = workbenchInstantiationService(undefined, disposables);

		let counter = 0;
		let input = disposables.add(new MyEditorInput());
		let otherInput = disposables.add(new MyEditorInput());

		const diffInput = disposables.add(instantiationService.createInstance(DiffEditorInput, 'name', 'description', input, otherInput, undefined));
		disposables.add(diffInput.onWillDispose(() => {
			counter++;
			assert(true);
		}));

		input.dispose();

		input = disposables.add(new MyEditorInput());
		otherInput = disposables.add(new MyEditorInput());

		const diffInput2 = disposables.add(instantiationService.createInstance(DiffEditorInput, 'name', 'description', input, otherInput, undefined));
		disposables.add(diffInput2.onWillDispose(() => {
			counter++;
			assert(true);
		}));

		otherInput.dispose();
		assert.strictEqual(counter, 2);
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/test/browser/parts/editor/editor.test.ts]---
Location: vscode-main/src/vs/workbench/test/browser/parts/editor/editor.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { EditorResourceAccessor, SideBySideEditor, EditorInputWithPreferredResource, EditorInputCapabilities, isEditorIdentifier, IResourceDiffEditorInput, IUntitledTextResourceEditorInput, isResourceEditorInput, isUntitledResourceEditorInput, isResourceDiffEditorInput, isEditorInputWithOptionsAndGroup, EditorInputWithOptions, isEditorInputWithOptions, isEditorInput, EditorInputWithOptionsAndGroup, isResourceSideBySideEditorInput, IResourceSideBySideEditorInput, isTextEditorViewState, isResourceMergeEditorInput, IResourceMergeEditorInput } from '../../../../common/editor.js';
import { DiffEditorInput } from '../../../../common/editor/diffEditorInput.js';
import { URI } from '../../../../../base/common/uri.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { workbenchInstantiationService, TestServiceAccessor, TestEditorInput, registerTestEditor, registerTestFileEditor, registerTestResourceEditor, TestFileEditorInput, createEditorPart, registerTestSideBySideEditor } from '../../workbenchTestServices.js';
import { Schemas } from '../../../../../base/common/network.js';
import { UntitledTextEditorInput } from '../../../../services/untitled/common/untitledTextEditorInput.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite, toResource } from '../../../../../base/test/common/utils.js';
import { SyncDescriptor } from '../../../../../platform/instantiation/common/descriptors.js';
import { whenEditorClosed } from '../../../../browser/editor.js';
import { IEditorGroupsService } from '../../../../services/editor/common/editorGroupsService.js';
import { EditorService } from '../../../../services/editor/browser/editorService.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { SideBySideEditorInput } from '../../../../common/editor/sideBySideEditorInput.js';
import { EditorResolution, IResourceEditorInput } from '../../../../../platform/editor/common/editor.js';
import { ICodeEditorViewState, IDiffEditorViewState } from '../../../../../editor/common/editorCommon.js';
import { Position } from '../../../../../editor/common/core/position.js';

suite('Workbench editor utils', () => {

	class TestEditorInputWithPreferredResource extends TestEditorInput implements EditorInputWithPreferredResource {

		constructor(resource: URI, public preferredResource: URI, typeId: string) {
			super(resource, typeId);
		}
	}

	const disposables = new DisposableStore();

	const TEST_EDITOR_ID = 'MyTestEditorForEditors';

	let instantiationService: IInstantiationService;
	let accessor: TestServiceAccessor;

	setup(() => {
		instantiationService = workbenchInstantiationService(undefined, disposables);
		accessor = instantiationService.createInstance(TestServiceAccessor);

		disposables.add(accessor.untitledTextEditorService);
		disposables.add(registerTestFileEditor());
		disposables.add(registerTestSideBySideEditor());
		disposables.add(registerTestResourceEditor());
		disposables.add(registerTestEditor(TEST_EDITOR_ID, [new SyncDescriptor(TestFileEditorInput)]));
	});

	teardown(() => {
		disposables.clear();
	});

	test('untyped check functions', () => {
		assert.ok(!isResourceEditorInput(undefined));
		assert.ok(!isResourceEditorInput({}));
		assert.ok(!isResourceEditorInput({ original: { resource: URI.file('/') }, modified: { resource: URI.file('/') } }));
		assert.ok(isResourceEditorInput({ resource: URI.file('/') }));

		assert.ok(!isUntitledResourceEditorInput(undefined));
		assert.ok(isUntitledResourceEditorInput({}));
		assert.ok(isUntitledResourceEditorInput({ resource: URI.file('/').with({ scheme: Schemas.untitled }) }));
		assert.ok(isUntitledResourceEditorInput({ resource: URI.file('/'), forceUntitled: true }));

		assert.ok(!isResourceDiffEditorInput(undefined));
		assert.ok(!isResourceDiffEditorInput({}));
		assert.ok(!isResourceDiffEditorInput({ resource: URI.file('/') }));
		assert.ok(isResourceDiffEditorInput({ original: { resource: URI.file('/') }, modified: { resource: URI.file('/') } }));
		assert.ok(isResourceDiffEditorInput({ original: { resource: URI.file('/') }, modified: { resource: URI.file('/') }, primary: { resource: URI.file('/') }, secondary: { resource: URI.file('/') } }));
		assert.ok(!isResourceDiffEditorInput({ primary: { resource: URI.file('/') }, secondary: { resource: URI.file('/') } }));

		assert.ok(!isResourceSideBySideEditorInput(undefined));
		assert.ok(!isResourceSideBySideEditorInput({}));
		assert.ok(!isResourceSideBySideEditorInput({ resource: URI.file('/') }));
		assert.ok(isResourceSideBySideEditorInput({ primary: { resource: URI.file('/') }, secondary: { resource: URI.file('/') } }));
		assert.ok(!isResourceSideBySideEditorInput({ original: { resource: URI.file('/') }, modified: { resource: URI.file('/') } }));
		assert.ok(!isResourceSideBySideEditorInput({ primary: { resource: URI.file('/') }, secondary: { resource: URI.file('/') }, original: { resource: URI.file('/') }, modified: { resource: URI.file('/') } }));

		assert.ok(!isResourceMergeEditorInput(undefined));
		assert.ok(!isResourceMergeEditorInput({}));
		assert.ok(!isResourceMergeEditorInput({ resource: URI.file('/') }));
		assert.ok(isResourceMergeEditorInput({ input1: { resource: URI.file('/') }, input2: { resource: URI.file('/') }, base: { resource: URI.file('/') }, result: { resource: URI.file('/') } }));
	});

	test('EditorInputCapabilities', () => {
		const testInput1 = disposables.add(new TestFileEditorInput(URI.file('resource1'), 'testTypeId'));
		const testInput2 = disposables.add(new TestFileEditorInput(URI.file('resource2'), 'testTypeId'));

		testInput1.capabilities = EditorInputCapabilities.None;
		assert.strictEqual(testInput1.hasCapability(EditorInputCapabilities.None), true);
		assert.strictEqual(testInput1.hasCapability(EditorInputCapabilities.Readonly), false);
		assert.strictEqual(testInput1.isReadonly(), false);
		assert.strictEqual(testInput1.hasCapability(EditorInputCapabilities.Untitled), false);
		assert.strictEqual(testInput1.hasCapability(EditorInputCapabilities.RequiresTrust), false);
		assert.strictEqual(testInput1.hasCapability(EditorInputCapabilities.Singleton), false);

		testInput1.capabilities |= EditorInputCapabilities.Readonly;
		assert.strictEqual(testInput1.hasCapability(EditorInputCapabilities.Readonly), true);
		assert.strictEqual(!!testInput1.isReadonly(), true);
		assert.strictEqual(testInput1.hasCapability(EditorInputCapabilities.None), false);
		assert.strictEqual(testInput1.hasCapability(EditorInputCapabilities.Untitled), false);
		assert.strictEqual(testInput1.hasCapability(EditorInputCapabilities.RequiresTrust), false);
		assert.strictEqual(testInput1.hasCapability(EditorInputCapabilities.Singleton), false);

		testInput1.capabilities = EditorInputCapabilities.None;
		testInput2.capabilities = EditorInputCapabilities.None;

		const sideBySideInput = instantiationService.createInstance(SideBySideEditorInput, 'name', undefined, testInput1, testInput2);
		assert.strictEqual(sideBySideInput.hasCapability(EditorInputCapabilities.MultipleEditors), true);
		assert.strictEqual(sideBySideInput.hasCapability(EditorInputCapabilities.Readonly), false);
		assert.strictEqual(sideBySideInput.isReadonly(), false);
		assert.strictEqual(sideBySideInput.hasCapability(EditorInputCapabilities.Untitled), false);
		assert.strictEqual(sideBySideInput.hasCapability(EditorInputCapabilities.RequiresTrust), false);
		assert.strictEqual(sideBySideInput.hasCapability(EditorInputCapabilities.Singleton), false);

		testInput1.capabilities |= EditorInputCapabilities.Readonly;
		assert.strictEqual(sideBySideInput.hasCapability(EditorInputCapabilities.Readonly), false);
		assert.strictEqual(sideBySideInput.isReadonly(), false);

		testInput2.capabilities |= EditorInputCapabilities.Readonly;
		assert.strictEqual(sideBySideInput.hasCapability(EditorInputCapabilities.Readonly), true);
		assert.strictEqual(!!sideBySideInput.isReadonly(), true);

		testInput1.capabilities |= EditorInputCapabilities.Untitled;
		assert.strictEqual(sideBySideInput.hasCapability(EditorInputCapabilities.Untitled), false);

		testInput2.capabilities |= EditorInputCapabilities.Untitled;
		assert.strictEqual(sideBySideInput.hasCapability(EditorInputCapabilities.Untitled), true);

		testInput1.capabilities |= EditorInputCapabilities.RequiresTrust;
		assert.strictEqual(sideBySideInput.hasCapability(EditorInputCapabilities.RequiresTrust), true);

		testInput2.capabilities |= EditorInputCapabilities.RequiresTrust;
		assert.strictEqual(sideBySideInput.hasCapability(EditorInputCapabilities.RequiresTrust), true);

		testInput1.capabilities |= EditorInputCapabilities.Singleton;
		assert.strictEqual(sideBySideInput.hasCapability(EditorInputCapabilities.Singleton), true);

		testInput2.capabilities |= EditorInputCapabilities.Singleton;
		assert.strictEqual(sideBySideInput.hasCapability(EditorInputCapabilities.Singleton), true);
	});

	test('EditorResourceAccessor - typed inputs', () => {
		const service = accessor.untitledTextEditorService;

		assert.ok(!EditorResourceAccessor.getCanonicalUri(null));
		assert.ok(!EditorResourceAccessor.getOriginalUri(null));

		const untitled = disposables.add(instantiationService.createInstance(UntitledTextEditorInput, service.create()));

		assert.strictEqual(EditorResourceAccessor.getCanonicalUri(untitled)?.toString(), untitled.resource.toString());
		assert.strictEqual(EditorResourceAccessor.getCanonicalUri(untitled, { supportSideBySide: SideBySideEditor.PRIMARY })?.toString(), untitled.resource.toString());
		assert.strictEqual(EditorResourceAccessor.getCanonicalUri(untitled, { supportSideBySide: SideBySideEditor.ANY })?.toString(), untitled.resource.toString());
		assert.strictEqual(EditorResourceAccessor.getCanonicalUri(untitled, { supportSideBySide: SideBySideEditor.SECONDARY })?.toString(), untitled.resource.toString());
		assert.strictEqual(EditorResourceAccessor.getCanonicalUri(untitled, { supportSideBySide: SideBySideEditor.BOTH })?.toString(), untitled.resource.toString());
		assert.strictEqual(EditorResourceAccessor.getCanonicalUri(untitled, { filterByScheme: Schemas.untitled })?.toString(), untitled.resource.toString());
		assert.strictEqual(EditorResourceAccessor.getCanonicalUri(untitled, { filterByScheme: [Schemas.file, Schemas.untitled] })?.toString(), untitled.resource.toString());
		assert.ok(!EditorResourceAccessor.getCanonicalUri(untitled, { filterByScheme: Schemas.file }));

		assert.strictEqual(EditorResourceAccessor.getOriginalUri(untitled)?.toString(), untitled.resource.toString());
		assert.strictEqual(EditorResourceAccessor.getOriginalUri(untitled, { supportSideBySide: SideBySideEditor.PRIMARY })?.toString(), untitled.resource.toString());
		assert.strictEqual(EditorResourceAccessor.getOriginalUri(untitled, { supportSideBySide: SideBySideEditor.ANY })?.toString(), untitled.resource.toString());
		assert.strictEqual(EditorResourceAccessor.getOriginalUri(untitled, { supportSideBySide: SideBySideEditor.SECONDARY })?.toString(), untitled.resource.toString());
		assert.strictEqual(EditorResourceAccessor.getOriginalUri(untitled, { supportSideBySide: SideBySideEditor.BOTH })?.toString(), untitled.resource.toString());
		assert.strictEqual(EditorResourceAccessor.getOriginalUri(untitled, { filterByScheme: Schemas.untitled })?.toString(), untitled.resource.toString());
		assert.strictEqual(EditorResourceAccessor.getOriginalUri(untitled, { filterByScheme: [Schemas.file, Schemas.untitled] })?.toString(), untitled.resource.toString());
		assert.ok(!EditorResourceAccessor.getOriginalUri(untitled, { filterByScheme: Schemas.file }));

		const file = disposables.add(new TestEditorInput(URI.file('/some/path.txt'), 'editorResourceFileTest'));

		assert.strictEqual(EditorResourceAccessor.getCanonicalUri(file)?.toString(), file.resource.toString());
		assert.strictEqual(EditorResourceAccessor.getCanonicalUri(file, { supportSideBySide: SideBySideEditor.PRIMARY })?.toString(), file.resource.toString());
		assert.strictEqual(EditorResourceAccessor.getCanonicalUri(file, { supportSideBySide: SideBySideEditor.ANY })?.toString(), file.resource.toString());
		assert.strictEqual(EditorResourceAccessor.getCanonicalUri(file, { supportSideBySide: SideBySideEditor.SECONDARY })?.toString(), file.resource.toString());
		assert.strictEqual(EditorResourceAccessor.getCanonicalUri(file, { supportSideBySide: SideBySideEditor.BOTH })?.toString(), file.resource.toString());
		assert.strictEqual(EditorResourceAccessor.getCanonicalUri(file, { filterByScheme: Schemas.file })?.toString(), file.resource.toString());
		assert.strictEqual(EditorResourceAccessor.getCanonicalUri(file, { filterByScheme: [Schemas.file, Schemas.untitled] })?.toString(), file.resource.toString());
		assert.ok(!EditorResourceAccessor.getCanonicalUri(file, { filterByScheme: Schemas.untitled }));

		assert.strictEqual(EditorResourceAccessor.getOriginalUri(file)?.toString(), file.resource.toString());
		assert.strictEqual(EditorResourceAccessor.getOriginalUri(file, { supportSideBySide: SideBySideEditor.PRIMARY })?.toString(), file.resource.toString());
		assert.strictEqual(EditorResourceAccessor.getOriginalUri(file, { supportSideBySide: SideBySideEditor.ANY })?.toString(), file.resource.toString());
		assert.strictEqual(EditorResourceAccessor.getOriginalUri(file, { supportSideBySide: SideBySideEditor.SECONDARY })?.toString(), file.resource.toString());
		assert.strictEqual(EditorResourceAccessor.getOriginalUri(file, { supportSideBySide: SideBySideEditor.BOTH })?.toString(), file.resource.toString());
		assert.strictEqual(EditorResourceAccessor.getOriginalUri(file, { filterByScheme: Schemas.file })?.toString(), file.resource.toString());
		assert.strictEqual(EditorResourceAccessor.getOriginalUri(file, { filterByScheme: [Schemas.file, Schemas.untitled] })?.toString(), file.resource.toString());
		assert.ok(!EditorResourceAccessor.getOriginalUri(file, { filterByScheme: Schemas.untitled }));

		const diffInput = instantiationService.createInstance(DiffEditorInput, 'name', 'description', untitled, file, undefined);
		const sideBySideInput = instantiationService.createInstance(SideBySideEditorInput, 'name', 'description', untitled, file);
		for (const input of [diffInput, sideBySideInput]) {
			assert.ok(!EditorResourceAccessor.getCanonicalUri(input));
			assert.ok(!EditorResourceAccessor.getCanonicalUri(input, { filterByScheme: Schemas.file }));

			assert.strictEqual(EditorResourceAccessor.getCanonicalUri(input, { supportSideBySide: SideBySideEditor.PRIMARY })?.toString(), file.resource.toString());
			assert.strictEqual(EditorResourceAccessor.getCanonicalUri(input, { supportSideBySide: SideBySideEditor.PRIMARY, filterByScheme: Schemas.file })?.toString(), file.resource.toString());
			assert.strictEqual(EditorResourceAccessor.getCanonicalUri(input, { supportSideBySide: SideBySideEditor.PRIMARY, filterByScheme: [Schemas.file, Schemas.untitled] })?.toString(), file.resource.toString());

			assert.strictEqual(EditorResourceAccessor.getCanonicalUri(input, { supportSideBySide: SideBySideEditor.SECONDARY })?.toString(), untitled.resource.toString());
			assert.strictEqual(EditorResourceAccessor.getCanonicalUri(input, { supportSideBySide: SideBySideEditor.SECONDARY, filterByScheme: Schemas.untitled })?.toString(), untitled.resource.toString());
			assert.strictEqual(EditorResourceAccessor.getCanonicalUri(input, { supportSideBySide: SideBySideEditor.SECONDARY, filterByScheme: [Schemas.file, Schemas.untitled] })?.toString(), untitled.resource.toString());

			assert.strictEqual((EditorResourceAccessor.getCanonicalUri(input, { supportSideBySide: SideBySideEditor.BOTH }) as { primary: URI; secondary: URI }).primary.toString(), file.resource.toString());
			assert.strictEqual((EditorResourceAccessor.getCanonicalUri(input, { supportSideBySide: SideBySideEditor.BOTH, filterByScheme: Schemas.file }) as { primary: URI; secondary: URI }).primary.toString(), file.resource.toString());
			assert.strictEqual((EditorResourceAccessor.getCanonicalUri(input, { supportSideBySide: SideBySideEditor.BOTH, filterByScheme: [Schemas.file, Schemas.untitled] }) as { primary: URI; secondary: URI }).primary.toString(), file.resource.toString());

			assert.strictEqual((EditorResourceAccessor.getCanonicalUri(input, { supportSideBySide: SideBySideEditor.BOTH }) as { primary: URI; secondary: URI }).secondary.toString(), untitled.resource.toString());
			assert.strictEqual((EditorResourceAccessor.getCanonicalUri(input, { supportSideBySide: SideBySideEditor.BOTH, filterByScheme: Schemas.untitled }) as { primary: URI; secondary: URI }).secondary.toString(), untitled.resource.toString());
			assert.strictEqual((EditorResourceAccessor.getCanonicalUri(input, { supportSideBySide: SideBySideEditor.BOTH, filterByScheme: [Schemas.file, Schemas.untitled] }) as { primary: URI; secondary: URI }).secondary.toString(), untitled.resource.toString());

			assert.ok(!EditorResourceAccessor.getOriginalUri(input));
			assert.ok(!EditorResourceAccessor.getOriginalUri(input, { filterByScheme: Schemas.file }));

			assert.strictEqual(EditorResourceAccessor.getOriginalUri(input, { supportSideBySide: SideBySideEditor.PRIMARY })?.toString(), file.resource.toString());
			assert.strictEqual(EditorResourceAccessor.getOriginalUri(input, { supportSideBySide: SideBySideEditor.PRIMARY, filterByScheme: Schemas.file })?.toString(), file.resource.toString());
			assert.strictEqual(EditorResourceAccessor.getOriginalUri(input, { supportSideBySide: SideBySideEditor.PRIMARY, filterByScheme: [Schemas.file, Schemas.untitled] })?.toString(), file.resource.toString());

			assert.strictEqual(EditorResourceAccessor.getOriginalUri(input, { supportSideBySide: SideBySideEditor.SECONDARY })?.toString(), untitled.resource.toString());
			assert.strictEqual(EditorResourceAccessor.getOriginalUri(input, { supportSideBySide: SideBySideEditor.SECONDARY, filterByScheme: Schemas.untitled })?.toString(), untitled.resource.toString());
			assert.strictEqual(EditorResourceAccessor.getOriginalUri(input, { supportSideBySide: SideBySideEditor.SECONDARY, filterByScheme: [Schemas.file, Schemas.untitled] })?.toString(), untitled.resource.toString());

			assert.strictEqual((EditorResourceAccessor.getOriginalUri(input, { supportSideBySide: SideBySideEditor.BOTH }) as { primary: URI; secondary: URI }).primary.toString(), file.resource.toString());
			assert.strictEqual((EditorResourceAccessor.getOriginalUri(input, { supportSideBySide: SideBySideEditor.BOTH, filterByScheme: Schemas.file }) as { primary: URI; secondary: URI }).primary.toString(), file.resource.toString());
			assert.strictEqual((EditorResourceAccessor.getOriginalUri(input, { supportSideBySide: SideBySideEditor.BOTH, filterByScheme: [Schemas.file, Schemas.untitled] }) as { primary: URI; secondary: URI }).primary.toString(), file.resource.toString());

			assert.strictEqual((EditorResourceAccessor.getOriginalUri(input, { supportSideBySide: SideBySideEditor.BOTH }) as { primary: URI; secondary: URI }).secondary.toString(), untitled.resource.toString());
			assert.strictEqual((EditorResourceAccessor.getOriginalUri(input, { supportSideBySide: SideBySideEditor.BOTH, filterByScheme: Schemas.untitled }) as { primary: URI; secondary: URI }).secondary.toString(), untitled.resource.toString());
			assert.strictEqual((EditorResourceAccessor.getOriginalUri(input, { supportSideBySide: SideBySideEditor.BOTH, filterByScheme: [Schemas.file, Schemas.untitled] }) as { primary: URI; secondary: URI }).secondary.toString(), untitled.resource.toString());
		}

		const resource = URI.file('/some/path.txt');
		const preferredResource = URI.file('/some/PATH.txt');
		const fileWithPreferredResource = disposables.add(new TestEditorInputWithPreferredResource(URI.file('/some/path.txt'), URI.file('/some/PATH.txt'), 'editorResourceFileTest'));

		assert.strictEqual(EditorResourceAccessor.getCanonicalUri(fileWithPreferredResource)?.toString(), resource.toString());
		assert.strictEqual(EditorResourceAccessor.getOriginalUri(fileWithPreferredResource)?.toString(), preferredResource.toString());
	});

	test('EditorResourceAccessor - untyped inputs', () => {

		assert.ok(!EditorResourceAccessor.getCanonicalUri(null));
		assert.ok(!EditorResourceAccessor.getOriginalUri(null));

		const untitledURI = URI.from({
			scheme: Schemas.untitled,
			authority: 'foo',
			path: '/bar'
		});
		const untitled: IUntitledTextResourceEditorInput = {
			resource: untitledURI
		};

		assert.strictEqual(EditorResourceAccessor.getCanonicalUri(untitled)?.toString(), untitled.resource?.toString());
		assert.strictEqual(EditorResourceAccessor.getCanonicalUri(untitled, { supportSideBySide: SideBySideEditor.PRIMARY })?.toString(), untitled.resource?.toString());
		assert.strictEqual(EditorResourceAccessor.getCanonicalUri(untitled, { supportSideBySide: SideBySideEditor.ANY })?.toString(), untitled.resource?.toString());
		assert.strictEqual(EditorResourceAccessor.getCanonicalUri(untitled, { supportSideBySide: SideBySideEditor.SECONDARY })?.toString(), untitled.resource?.toString());
		assert.strictEqual(EditorResourceAccessor.getCanonicalUri(untitled, { supportSideBySide: SideBySideEditor.BOTH })?.toString(), untitled.resource?.toString());
		assert.strictEqual(EditorResourceAccessor.getCanonicalUri(untitled, { filterByScheme: Schemas.untitled })?.toString(), untitled.resource?.toString());
		assert.strictEqual(EditorResourceAccessor.getCanonicalUri(untitled, { filterByScheme: [Schemas.file, Schemas.untitled] })?.toString(), untitled.resource?.toString());
		assert.ok(!EditorResourceAccessor.getCanonicalUri(untitled, { filterByScheme: Schemas.file }));

		assert.strictEqual(EditorResourceAccessor.getOriginalUri(untitled)?.toString(), untitled.resource?.toString());
		assert.strictEqual(EditorResourceAccessor.getOriginalUri(untitled, { supportSideBySide: SideBySideEditor.PRIMARY })?.toString(), untitled.resource?.toString());
		assert.strictEqual(EditorResourceAccessor.getOriginalUri(untitled, { supportSideBySide: SideBySideEditor.ANY })?.toString(), untitled.resource?.toString());
		assert.strictEqual(EditorResourceAccessor.getOriginalUri(untitled, { supportSideBySide: SideBySideEditor.SECONDARY })?.toString(), untitled.resource?.toString());
		assert.strictEqual(EditorResourceAccessor.getOriginalUri(untitled, { supportSideBySide: SideBySideEditor.BOTH })?.toString(), untitled.resource?.toString());
		assert.strictEqual(EditorResourceAccessor.getOriginalUri(untitled, { filterByScheme: Schemas.untitled })?.toString(), untitled.resource?.toString());
		assert.strictEqual(EditorResourceAccessor.getOriginalUri(untitled, { filterByScheme: [Schemas.file, Schemas.untitled] })?.toString(), untitled.resource?.toString());
		assert.ok(!EditorResourceAccessor.getOriginalUri(untitled, { filterByScheme: Schemas.file }));

		const file: IResourceEditorInput = {
			resource: URI.file('/some/path.txt')
		};

		assert.strictEqual(EditorResourceAccessor.getCanonicalUri(file)?.toString(), file.resource.toString());
		assert.strictEqual(EditorResourceAccessor.getCanonicalUri(file, { supportSideBySide: SideBySideEditor.PRIMARY })?.toString(), file.resource.toString());
		assert.strictEqual(EditorResourceAccessor.getCanonicalUri(file, { supportSideBySide: SideBySideEditor.ANY })?.toString(), file.resource.toString());
		assert.strictEqual(EditorResourceAccessor.getCanonicalUri(file, { supportSideBySide: SideBySideEditor.SECONDARY })?.toString(), file.resource.toString());
		assert.strictEqual(EditorResourceAccessor.getCanonicalUri(file, { supportSideBySide: SideBySideEditor.BOTH })?.toString(), file.resource.toString());
		assert.strictEqual(EditorResourceAccessor.getCanonicalUri(file, { filterByScheme: Schemas.file })?.toString(), file.resource.toString());
		assert.strictEqual(EditorResourceAccessor.getCanonicalUri(file, { filterByScheme: [Schemas.file, Schemas.untitled] })?.toString(), file.resource.toString());
		assert.ok(!EditorResourceAccessor.getCanonicalUri(file, { filterByScheme: Schemas.untitled }));

		assert.strictEqual(EditorResourceAccessor.getOriginalUri(file)?.toString(), file.resource.toString());
		assert.strictEqual(EditorResourceAccessor.getOriginalUri(file, { supportSideBySide: SideBySideEditor.PRIMARY })?.toString(), file.resource.toString());
		assert.strictEqual(EditorResourceAccessor.getOriginalUri(file, { supportSideBySide: SideBySideEditor.ANY })?.toString(), file.resource.toString());
		assert.strictEqual(EditorResourceAccessor.getOriginalUri(file, { supportSideBySide: SideBySideEditor.SECONDARY })?.toString(), file.resource.toString());
		assert.strictEqual(EditorResourceAccessor.getOriginalUri(file, { supportSideBySide: SideBySideEditor.BOTH })?.toString(), file.resource.toString());
		assert.strictEqual(EditorResourceAccessor.getOriginalUri(file, { filterByScheme: Schemas.file })?.toString(), file.resource.toString());
		assert.strictEqual(EditorResourceAccessor.getOriginalUri(file, { filterByScheme: [Schemas.file, Schemas.untitled] })?.toString(), file.resource.toString());
		assert.ok(!EditorResourceAccessor.getOriginalUri(file, { filterByScheme: Schemas.untitled }));

		const diffInput: IResourceDiffEditorInput = { original: untitled, modified: file };
		const sideBySideInput: IResourceSideBySideEditorInput = { primary: file, secondary: untitled };
		for (const untypedInput of [diffInput, sideBySideInput]) {
			assert.ok(!EditorResourceAccessor.getCanonicalUri(untypedInput));
			assert.ok(!EditorResourceAccessor.getCanonicalUri(untypedInput, { filterByScheme: Schemas.file }));

			assert.strictEqual(EditorResourceAccessor.getCanonicalUri(untypedInput, { supportSideBySide: SideBySideEditor.PRIMARY })?.toString(), file.resource.toString());
			assert.strictEqual(EditorResourceAccessor.getCanonicalUri(untypedInput, { supportSideBySide: SideBySideEditor.PRIMARY, filterByScheme: Schemas.file })?.toString(), file.resource.toString());
			assert.strictEqual(EditorResourceAccessor.getCanonicalUri(untypedInput, { supportSideBySide: SideBySideEditor.PRIMARY, filterByScheme: [Schemas.file, Schemas.untitled] })?.toString(), file.resource.toString());

			assert.strictEqual(EditorResourceAccessor.getCanonicalUri(untypedInput, { supportSideBySide: SideBySideEditor.SECONDARY })?.toString(), untitled.resource?.toString());
			assert.strictEqual(EditorResourceAccessor.getCanonicalUri(untypedInput, { supportSideBySide: SideBySideEditor.SECONDARY, filterByScheme: Schemas.untitled })?.toString(), untitled.resource?.toString());
			assert.strictEqual(EditorResourceAccessor.getCanonicalUri(untypedInput, { supportSideBySide: SideBySideEditor.SECONDARY, filterByScheme: [Schemas.file, Schemas.untitled] })?.toString(), untitled.resource?.toString());

			assert.strictEqual((EditorResourceAccessor.getCanonicalUri(untypedInput, { supportSideBySide: SideBySideEditor.BOTH }) as { primary: URI; secondary: URI }).primary.toString(), file.resource.toString());
			assert.strictEqual((EditorResourceAccessor.getCanonicalUri(untypedInput, { supportSideBySide: SideBySideEditor.BOTH, filterByScheme: Schemas.file }) as { primary: URI; secondary: URI }).primary.toString(), file.resource.toString());
			assert.strictEqual((EditorResourceAccessor.getCanonicalUri(untypedInput, { supportSideBySide: SideBySideEditor.BOTH, filterByScheme: [Schemas.file, Schemas.untitled] }) as { primary: URI; secondary: URI }).primary.toString(), file.resource.toString());

			assert.strictEqual((EditorResourceAccessor.getCanonicalUri(untypedInput, { supportSideBySide: SideBySideEditor.BOTH }) as { primary: URI; secondary: URI }).secondary.toString(), untitled.resource?.toString());
			assert.strictEqual((EditorResourceAccessor.getCanonicalUri(untypedInput, { supportSideBySide: SideBySideEditor.BOTH, filterByScheme: Schemas.untitled }) as { primary: URI; secondary: URI }).secondary.toString(), untitled.resource?.toString());
			assert.strictEqual((EditorResourceAccessor.getCanonicalUri(untypedInput, { supportSideBySide: SideBySideEditor.BOTH, filterByScheme: [Schemas.file, Schemas.untitled] }) as { primary: URI; secondary: URI }).secondary.toString(), untitled.resource?.toString());

			assert.ok(!EditorResourceAccessor.getOriginalUri(untypedInput));
			assert.ok(!EditorResourceAccessor.getOriginalUri(untypedInput, { filterByScheme: Schemas.file }));

			assert.strictEqual(EditorResourceAccessor.getOriginalUri(untypedInput, { supportSideBySide: SideBySideEditor.PRIMARY })?.toString(), file.resource.toString());
			assert.strictEqual(EditorResourceAccessor.getOriginalUri(untypedInput, { supportSideBySide: SideBySideEditor.PRIMARY, filterByScheme: Schemas.file })?.toString(), file.resource.toString());
			assert.strictEqual(EditorResourceAccessor.getOriginalUri(untypedInput, { supportSideBySide: SideBySideEditor.PRIMARY, filterByScheme: [Schemas.file, Schemas.untitled] })?.toString(), file.resource.toString());

			assert.strictEqual(EditorResourceAccessor.getOriginalUri(untypedInput, { supportSideBySide: SideBySideEditor.SECONDARY })?.toString(), untitled.resource?.toString());
			assert.strictEqual(EditorResourceAccessor.getOriginalUri(untypedInput, { supportSideBySide: SideBySideEditor.SECONDARY, filterByScheme: Schemas.untitled })?.toString(), untitled.resource?.toString());
			assert.strictEqual(EditorResourceAccessor.getOriginalUri(untypedInput, { supportSideBySide: SideBySideEditor.SECONDARY, filterByScheme: [Schemas.file, Schemas.untitled] })?.toString(), untitled.resource?.toString());

			assert.strictEqual((EditorResourceAccessor.getOriginalUri(untypedInput, { supportSideBySide: SideBySideEditor.BOTH }) as { primary: URI; secondary: URI }).primary.toString(), file.resource.toString());
			assert.strictEqual((EditorResourceAccessor.getOriginalUri(untypedInput, { supportSideBySide: SideBySideEditor.BOTH, filterByScheme: Schemas.file }) as { primary: URI; secondary: URI }).primary.toString(), file.resource.toString());
			assert.strictEqual((EditorResourceAccessor.getOriginalUri(untypedInput, { supportSideBySide: SideBySideEditor.BOTH, filterByScheme: [Schemas.file, Schemas.untitled] }) as { primary: URI; secondary: URI }).primary.toString(), file.resource.toString());

			assert.strictEqual((EditorResourceAccessor.getOriginalUri(untypedInput, { supportSideBySide: SideBySideEditor.BOTH }) as { primary: URI; secondary: URI }).secondary.toString(), untitled.resource?.toString());
			assert.strictEqual((EditorResourceAccessor.getOriginalUri(untypedInput, { supportSideBySide: SideBySideEditor.BOTH, filterByScheme: Schemas.untitled }) as { primary: URI; secondary: URI }).secondary.toString(), untitled.resource?.toString());
			assert.strictEqual((EditorResourceAccessor.getOriginalUri(untypedInput, { supportSideBySide: SideBySideEditor.BOTH, filterByScheme: [Schemas.file, Schemas.untitled] }) as { primary: URI; secondary: URI }).secondary.toString(), untitled.resource?.toString());
		}

		const fileMerge: IResourceMergeEditorInput = {
			input1: { resource: URI.file('/some/remote.txt') },
			input2: { resource: URI.file('/some/local.txt') },
			base: { resource: URI.file('/some/base.txt') },
			result: { resource: URI.file('/some/merged.txt') }
		};

		assert.strictEqual(EditorResourceAccessor.getCanonicalUri(fileMerge)?.toString(), fileMerge.result.resource.toString());
		assert.strictEqual(EditorResourceAccessor.getOriginalUri(fileMerge)?.toString(), fileMerge.result.resource.toString());
	});

	test('isEditorIdentifier', () => {
		assert.strictEqual(isEditorIdentifier(undefined), false);
		assert.strictEqual(isEditorIdentifier('undefined'), false);

		const testInput1 = disposables.add(new TestFileEditorInput(URI.file('resource1'), 'testTypeId'));
		assert.strictEqual(isEditorIdentifier(testInput1), false);
		assert.strictEqual(isEditorIdentifier({ editor: testInput1, groupId: 3 }), true);
	});

	test('isEditorInputWithOptionsAndGroup', () => {
		const editorInput = disposables.add(new TestFileEditorInput(URI.file('resource1'), 'testTypeId'));
		assert.strictEqual(isEditorInput(editorInput), true);
		assert.strictEqual(isEditorInputWithOptions(editorInput), false);
		assert.strictEqual(isEditorInputWithOptionsAndGroup(editorInput), false);

		const editorInputWithOptions: EditorInputWithOptions = { editor: editorInput, options: { override: EditorResolution.PICK } };
		assert.strictEqual(isEditorInput(editorInputWithOptions), false);
		assert.strictEqual(isEditorInputWithOptions(editorInputWithOptions), true);
		assert.strictEqual(isEditorInputWithOptionsAndGroup(editorInputWithOptions), false);

		const service = accessor.editorGroupService;
		const editorInputWithOptionsAndGroup: EditorInputWithOptionsAndGroup = { editor: editorInput, options: { override: EditorResolution.PICK }, group: service.activeGroup };
		assert.strictEqual(isEditorInput(editorInputWithOptionsAndGroup), false);
		assert.strictEqual(isEditorInputWithOptions(editorInputWithOptionsAndGroup), true);
		assert.strictEqual(isEditorInputWithOptionsAndGroup(editorInputWithOptionsAndGroup), true);
	});

	test('isTextEditorViewState', () => {
		assert.strictEqual(isTextEditorViewState(undefined), false);
		assert.strictEqual(isTextEditorViewState({}), false);

		const codeEditorViewState: ICodeEditorViewState = {
			contributionsState: {},
			cursorState: [],
			viewState: {
				scrollLeft: 0,
				firstPosition: new Position(1, 1),
				firstPositionDeltaTop: 1
			}
		};

		assert.strictEqual(isTextEditorViewState(codeEditorViewState), true);

		const diffEditorViewState: IDiffEditorViewState = {
			original: codeEditorViewState,
			modified: codeEditorViewState
		};

		assert.strictEqual(isTextEditorViewState(diffEditorViewState), true);
	});

	test('whenEditorClosed (single editor)', async function () {
		return testWhenEditorClosed(false, false, toResource.call(this, '/path/index.txt'));
	});

	test('whenEditorClosed (multiple editor)', async function () {
		return testWhenEditorClosed(false, false, toResource.call(this, '/path/index.txt'), toResource.call(this, '/test.html'));
	});

	test('whenEditorClosed (single editor, diff editor)', async function () {
		return testWhenEditorClosed(true, false, toResource.call(this, '/path/index.txt'));
	});

	test('whenEditorClosed (multiple editor, diff editor)', async function () {
		return testWhenEditorClosed(true, false, toResource.call(this, '/path/index.txt'), toResource.call(this, '/test.html'));
	});

	test('whenEditorClosed (single custom editor)', async function () {
		return testWhenEditorClosed(false, true, toResource.call(this, '/path/index.txt'));
	});

	test('whenEditorClosed (multiple custom editor)', async function () {
		return testWhenEditorClosed(false, true, toResource.call(this, '/path/index.txt'), toResource.call(this, '/test.html'));
	});

	async function createServices(): Promise<TestServiceAccessor> {
		const instantiationService = workbenchInstantiationService(undefined, disposables);

		const part = await createEditorPart(instantiationService, disposables);
		instantiationService.stub(IEditorGroupsService, part);

		const editorService = disposables.add(instantiationService.createInstance(EditorService, undefined));
		instantiationService.stub(IEditorService, editorService);

		return instantiationService.createInstance(TestServiceAccessor);
	}

	async function testWhenEditorClosed(sideBySide: boolean, custom: boolean, ...resources: URI[]): Promise<void> {
		const accessor = await createServices();

		for (const resource of resources) {
			if (custom) {
				await accessor.editorService.openEditor(new TestFileEditorInput(resource, 'testTypeId'), { pinned: true });
			} else if (sideBySide) {
				await accessor.editorService.openEditor(instantiationService.createInstance(SideBySideEditorInput, 'testSideBySideEditor', undefined, new TestFileEditorInput(resource, 'testTypeId'), new TestFileEditorInput(resource, 'testTypeId')), { pinned: true });
			} else {
				await accessor.editorService.openEditor({ resource, options: { pinned: true } });
			}
		}

		const closedPromise = accessor.instantitionService.invokeFunction(accessor => whenEditorClosed(accessor, resources));

		accessor.editorGroupService.activeGroup.closeAllEditors();

		await closedPromise;
	}

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

````
