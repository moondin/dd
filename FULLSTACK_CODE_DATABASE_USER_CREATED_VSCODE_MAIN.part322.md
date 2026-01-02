---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 322
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 322 of 552)

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

---[FILE: src/vs/workbench/api/test/browser/extHostTesting.test.ts]---
Location: vscode-main/src/vs/workbench/api/test/browser/extHostTesting.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import * as sinon from 'sinon';
import { timeout } from '../../../../base/common/async.js';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { Event } from '../../../../base/common/event.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { URI } from '../../../../base/common/uri.js';
import { mock, mockObject, MockObject } from '../../../../base/test/common/mock.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import * as editorRange from '../../../../editor/common/core/range.js';
import { ExtensionIdentifier, IExtensionDescription } from '../../../../platform/extensions/common/extensions.js';
import { NullLogService } from '../../../../platform/log/common/log.js';
import { MainThreadTestingShape } from '../../common/extHost.protocol.js';
import { ExtHostCommands } from '../../common/extHostCommands.js';
import { ExtHostDocumentsAndEditors } from '../../common/extHostDocumentsAndEditors.js';
import { IExtHostTelemetry } from '../../common/extHostTelemetry.js';
import { ExtHostTesting, TestRunCoordinator, TestRunDto, TestRunProfileImpl } from '../../common/extHostTesting.js';
import { ExtHostTestItemCollection, TestItemImpl } from '../../common/extHostTestItem.js';
import * as convert from '../../common/extHostTypeConverters.js';
import { Location, Position, Range, TestMessage, TestRunProfileKind, TestRunRequest as TestRunRequestImpl, TestTag } from '../../common/extHostTypes.js';
import { AnyCallRPCProtocol } from '../common/testRPCProtocol.js';
import { TestId } from '../../../contrib/testing/common/testId.js';
import { TestDiffOpType, TestItemExpandState, TestMessageType, TestsDiff } from '../../../contrib/testing/common/testTypes.js';
import { nullExtensionDescription } from '../../../services/extensions/common/extensions.js';
import type { TestController, TestItem, TestRunProfile, TestRunRequest } from 'vscode';

const simplify = (item: TestItem) => ({
	id: item.id,
	label: item.label,
	uri: item.uri,
	range: item.range,
});

const assertTreesEqual = (a: TestItemImpl | undefined, b: TestItemImpl | undefined) => {
	if (!a) {
		throw new assert.AssertionError({ message: 'Expected a to be defined', actual: a });
	}

	if (!b) {
		throw new assert.AssertionError({ message: 'Expected b to be defined', actual: b });
	}

	assert.deepStrictEqual(simplify(a), simplify(b));

	const aChildren = [...a.children].map(([_, c]) => c.id).sort();
	const bChildren = [...b.children].map(([_, c]) => c.id).sort();
	assert.strictEqual(aChildren.length, bChildren.length, `expected ${a.label}.children.length == ${b.label}.children.length`);
	aChildren.forEach(key => assertTreesEqual(a.children.get(key) as TestItemImpl, b.children.get(key) as TestItemImpl));
};

// const assertTreeListEqual = (a: ReadonlyArray<TestItem>, b: ReadonlyArray<TestItem>) => {
// 	assert.strictEqual(a.length, b.length, `expected a.length == n.length`);
// 	a.forEach((_, i) => assertTreesEqual(a[i], b[i]));
// };

// class TestMirroredCollection extends MirroredTestCollection {
// 	public changeEvent!: TestChangeEvent;

// 	constructor() {
// 		super();
// 		this.onDidChangeTests(evt => this.changeEvent = evt);
// 	}

// 	public get length() {
// 		return this.items.size;
// 	}
// }

suite('ExtHost Testing', () => {
	class TestExtHostTestItemCollection extends ExtHostTestItemCollection {
		public setDiff(diff: TestsDiff) {
			this.diff = diff;
		}
	}

	teardown(() => {
		sinon.restore();
	});

	const ds = ensureNoDisposablesAreLeakedInTestSuite();

	let single: TestExtHostTestItemCollection;
	let resolveCalls: (string | undefined)[] = [];
	setup(() => {
		resolveCalls = [];
		single = ds.add(new TestExtHostTestItemCollection('ctrlId', 'root', {
			getDocument: () => undefined,
		} as Partial<ExtHostDocumentsAndEditors> as ExtHostDocumentsAndEditors));
		single.resolveHandler = item => {
			resolveCalls.push(item?.id);
			if (item === undefined) {
				const a = new TestItemImpl('ctrlId', 'id-a', 'a', URI.file('/'));
				a.canResolveChildren = true;
				const b = new TestItemImpl('ctrlId', 'id-b', 'b', URI.file('/'));
				single.root.children.add(a);
				single.root.children.add(b);
			} else if (item.id === 'id-a') {
				item.children.add(new TestItemImpl('ctrlId', 'id-aa', 'aa', URI.file('/')));
				item.children.add(new TestItemImpl('ctrlId', 'id-ab', 'ab', URI.file('/')));
			}
		};

		ds.add(single.onDidGenerateDiff(d => single.setDiff(d /* don't clear during testing */)));
	});

	suite('OwnedTestCollection', () => {
		test('adds a root recursively', async () => {
			await single.expand(single.root.id, Infinity);
			const a = single.root.children.get('id-a') as TestItemImpl;
			const b = single.root.children.get('id-b') as TestItemImpl;
			assert.deepStrictEqual(single.collectDiff(), [
				{
					op: TestDiffOpType.Add,
					item: { controllerId: 'ctrlId', expand: TestItemExpandState.BusyExpanding, item: { ...convert.TestItem.from(single.root) } }
				},
				{
					op: TestDiffOpType.Add,
					item: { controllerId: 'ctrlId', expand: TestItemExpandState.BusyExpanding, item: { ...convert.TestItem.from(a) } }
				},
				{
					op: TestDiffOpType.Add,
					item: { controllerId: 'ctrlId', expand: TestItemExpandState.NotExpandable, item: convert.TestItem.from(a.children.get('id-aa') as TestItemImpl) }
				},
				{
					op: TestDiffOpType.Add,
					item: { controllerId: 'ctrlId', expand: TestItemExpandState.NotExpandable, item: convert.TestItem.from(a.children.get('id-ab') as TestItemImpl) }
				},
				{
					op: TestDiffOpType.Update,
					item: { extId: new TestId(['ctrlId', 'id-a']).toString(), expand: TestItemExpandState.Expanded }
				},
				{
					op: TestDiffOpType.Add,
					item: { controllerId: 'ctrlId', expand: TestItemExpandState.NotExpandable, item: convert.TestItem.from(b) }
				},
				{
					op: TestDiffOpType.Update,
					item: { extId: single.root.id, expand: TestItemExpandState.Expanded }
				},
			]);
		});

		test('parents are set correctly', () => {
			single.expand(single.root.id, Infinity);
			single.collectDiff();

			const a = single.root.children.get('id-a')!;
			const ab = a.children.get('id-ab')!;
			assert.strictEqual(a.parent, undefined);
			assert.strictEqual(ab.parent, a);
		});

		test('can add an item with same ID as root', () => {
			single.collectDiff();

			const child = new TestItemImpl('ctrlId', 'ctrlId', 'c', undefined);
			single.root.children.add(child);
			assert.deepStrictEqual(single.collectDiff(), [
				{
					op: TestDiffOpType.Add,
					item: { controllerId: 'ctrlId', expand: TestItemExpandState.NotExpandable, item: convert.TestItem.from(child) },
				}
			]);
		});

		test('no-ops if items not changed', () => {
			single.collectDiff();
			assert.deepStrictEqual(single.collectDiff(), []);
		});

		test('watches property mutations', () => {
			single.expand(single.root.id, Infinity);
			single.collectDiff();
			single.root.children.get('id-a')!.description = 'Hello world'; /* item a */

			assert.deepStrictEqual(single.collectDiff(), [
				{
					op: TestDiffOpType.Update,
					item: { extId: new TestId(['ctrlId', 'id-a']).toString(), item: { description: 'Hello world' } },
				}
			]);
		});

		test('removes children', () => {
			single.expand(single.root.id, Infinity);
			single.collectDiff();
			single.root.children.delete('id-a');

			assert.deepStrictEqual(single.collectDiff(), [
				{ op: TestDiffOpType.Remove, itemId: new TestId(['ctrlId', 'id-a']).toString() },
			]);
			assert.deepStrictEqual(
				[...single.tree.keys()].sort(),
				[single.root.id, new TestId(['ctrlId', 'id-b']).toString()],
			);
			assert.strictEqual(single.tree.size, 2);
		});

		test('adds new children', () => {
			single.expand(single.root.id, Infinity);
			single.collectDiff();
			const child = new TestItemImpl('ctrlId', 'id-ac', 'c', undefined);
			single.root.children.get('id-a')!.children.add(child);

			assert.deepStrictEqual(single.collectDiff(), [
				{
					op: TestDiffOpType.Add, item: {
						controllerId: 'ctrlId',
						expand: TestItemExpandState.NotExpandable,
						item: convert.TestItem.from(child),
					}
				},
			]);
			assert.deepStrictEqual(
				[...single.tree.values()].map(n => n.actual.id).sort(),
				[single.root.id, 'id-a', 'id-aa', 'id-ab', 'id-ac', 'id-b'],
			);
			assert.strictEqual(single.tree.size, 6);
		});

		test('manages tags correctly', () => {
			single.expand(single.root.id, Infinity);
			single.collectDiff();
			const tag1 = new TestTag('tag1');
			const tag2 = new TestTag('tag2');
			const tag3 = new TestTag('tag3');
			const child = new TestItemImpl('ctrlId', 'id-ac', 'c', undefined);
			child.tags = [tag1, tag2];
			single.root.children.get('id-a')!.children.add(child);

			assert.deepStrictEqual(single.collectDiff(), [
				{ op: TestDiffOpType.AddTag, tag: { id: 'ctrlId\0tag1' } },
				{ op: TestDiffOpType.AddTag, tag: { id: 'ctrlId\0tag2' } },
				{
					op: TestDiffOpType.Add, item: {
						controllerId: 'ctrlId',
						expand: TestItemExpandState.NotExpandable,
						item: convert.TestItem.from(child),
					}
				},
			]);

			child.tags = [tag2, tag3];
			assert.deepStrictEqual(single.collectDiff(), [
				{ op: TestDiffOpType.AddTag, tag: { id: 'ctrlId\0tag3' } },
				{
					op: TestDiffOpType.Update, item: {
						extId: new TestId(['ctrlId', 'id-a', 'id-ac']).toString(),
						item: { tags: ['ctrlId\0tag2', 'ctrlId\0tag3'] }
					}
				},
				{ op: TestDiffOpType.RemoveTag, id: 'ctrlId\0tag1' },
			]);

			const a = single.root.children.get('id-a')!;
			a.tags = [tag2];
			a.children.replace([]);
			assert.deepStrictEqual(single.collectDiff().filter(t => t.op === TestDiffOpType.RemoveTag), [
				{ op: TestDiffOpType.RemoveTag, id: 'ctrlId\0tag3' },
			]);
		});

		test('replaces on uri change', () => {
			single.expand(single.root.id, Infinity);
			single.collectDiff();

			const oldA = single.root.children.get('id-a') as TestItemImpl;
			const uri = single.root.children.get('id-a')!.uri?.with({ path: '/different' });
			const newA = new TestItemImpl('ctrlId', 'id-a', 'Hello world', uri);
			newA.children.replace([...oldA.children].map(([_, item]) => item));
			single.root.children.replace([...single.root.children].map(([id, i]) => id === 'id-a' ? newA : i));

			assert.deepStrictEqual(single.collectDiff(), [
				{ op: TestDiffOpType.Remove, itemId: new TestId(['ctrlId', 'id-a']).toString() },
				{
					op: TestDiffOpType.Add,
					item: { controllerId: 'ctrlId', expand: TestItemExpandState.NotExpandable, item: { ...convert.TestItem.from(newA) } }
				},
				{
					op: TestDiffOpType.Add,
					item: { controllerId: 'ctrlId', expand: TestItemExpandState.NotExpandable, item: convert.TestItem.from(newA.children.get('id-aa') as TestItemImpl) }
				},
				{
					op: TestDiffOpType.Add,
					item: { controllerId: 'ctrlId', expand: TestItemExpandState.NotExpandable, item: convert.TestItem.from(newA.children.get('id-ab') as TestItemImpl) }
				},
			]);
		});

		test('treats in-place replacement as mutation', () => {
			single.expand(single.root.id, Infinity);
			single.collectDiff();

			const oldA = single.root.children.get('id-a') as TestItemImpl;
			const uri = single.root.children.get('id-a')!.uri;
			const newA = new TestItemImpl('ctrlId', 'id-a', 'Hello world', uri);
			newA.children.replace([...oldA.children].map(([_, item]) => item));
			single.root.children.replace([
				newA,
				new TestItemImpl('ctrlId', 'id-b', single.root.children.get('id-b')!.label, uri),
			]);

			assert.deepStrictEqual(single.collectDiff(), [
				{
					op: TestDiffOpType.Update,
					item: { extId: new TestId(['ctrlId', 'id-a']).toString(), item: { label: 'Hello world' } },
				},
				{
					op: TestDiffOpType.DocumentSynced,
					docv: undefined,
					uri: uri
				}
			]);

			newA.label = 'still connected';
			assert.deepStrictEqual(single.collectDiff(), [
				{
					op: TestDiffOpType.Update,
					item: { extId: new TestId(['ctrlId', 'id-a']).toString(), item: { label: 'still connected' } }
				},
			]);

			oldA.label = 'no longer connected';
			assert.deepStrictEqual(single.collectDiff(), []);
		});

		suite('expandibility restoration', () => {
			const doReplace = async (canResolveChildren = true) => {
				const uri = single.root.children.get('id-a')!.uri;
				const newA = new TestItemImpl('ctrlId', 'id-a', 'Hello world', uri);
				newA.canResolveChildren = canResolveChildren;
				single.root.children.replace([
					newA,
					new TestItemImpl('ctrlId', 'id-b', single.root.children.get('id-b')!.label, uri),
				]);
				await timeout(0); // drain microtasks
			};

			test('does not restore an unexpanded state', async () => {
				await single.expand(single.root.id, 0);
				assert.deepStrictEqual(resolveCalls, [undefined]);
				await doReplace();
				assert.deepStrictEqual(resolveCalls, [undefined]);
			});

			test('restores resolve state on replacement', async () => {
				await single.expand(single.root.id, Infinity);
				assert.deepStrictEqual(resolveCalls, [undefined, 'id-a']);
				await doReplace();
				assert.deepStrictEqual(resolveCalls, [undefined, 'id-a', 'id-a']);
			});

			test('does not expand if new child is not expandable', async () => {
				await single.expand(single.root.id, Infinity);
				assert.deepStrictEqual(resolveCalls, [undefined, 'id-a']);
				await doReplace(false);
				assert.deepStrictEqual(resolveCalls, [undefined, 'id-a']);
			});
		});

		test('treats in-place replacement as mutation deeply', () => {
			single.expand(single.root.id, Infinity);
			single.collectDiff();

			const oldA = single.root.children.get('id-a')!;
			const uri = oldA.uri;
			const newA = new TestItemImpl('ctrlId', 'id-a', single.root.children.get('id-a')!.label, uri);
			const oldAA = oldA.children.get('id-aa')!;
			const oldAB = oldA.children.get('id-ab')!;
			const newAB = new TestItemImpl('ctrlId', 'id-ab', 'Hello world', uri);
			newA.children.replace([oldAA, newAB]);
			single.root.children.replace([newA, single.root.children.get('id-b')!]);

			assert.deepStrictEqual(single.collectDiff(), [
				{
					op: TestDiffOpType.Update,
					item: { extId: TestId.fromExtHostTestItem(oldAB, 'ctrlId').toString(), item: { label: 'Hello world' } },
				},
				{
					op: TestDiffOpType.DocumentSynced,
					docv: undefined,
					uri: uri
				}
			]);

			oldAA.label = 'still connected1';
			newAB.label = 'still connected2';
			oldAB.label = 'not connected3';
			assert.deepStrictEqual(single.collectDiff(), [
				{
					op: TestDiffOpType.Update,
					item: { extId: new TestId(['ctrlId', 'id-a', 'id-aa']).toString(), item: { label: 'still connected1' } }
				},
				{
					op: TestDiffOpType.Update,
					item: { extId: new TestId(['ctrlId', 'id-a', 'id-ab']).toString(), item: { label: 'still connected2' } }
				},
			]);

			assert.strictEqual(newAB.parent, newA);
			assert.strictEqual(oldAA.parent, newA);
			assert.deepStrictEqual(newA.parent, undefined);
		});

		test('moves an item to be a new child', async () => {
			await single.expand(single.root.id, 0);
			single.collectDiff();
			const b = single.root.children.get('id-b') as TestItemImpl;
			const a = single.root.children.get('id-a') as TestItemImpl;
			a.children.add(b);
			assert.deepStrictEqual(single.collectDiff(), [
				{
					op: TestDiffOpType.Remove,
					itemId: new TestId(['ctrlId', 'id-b']).toString(),
				},
				{
					op: TestDiffOpType.Add,
					item: { controllerId: 'ctrlId', expand: TestItemExpandState.NotExpandable, item: convert.TestItem.from(b) }
				},
			]);

			b.label = 'still connected';
			assert.deepStrictEqual(single.collectDiff(), [
				{
					op: TestDiffOpType.Update,
					item: { extId: new TestId(['ctrlId', 'id-a', 'id-b']).toString(), item: { label: 'still connected' } }
				},
			]);

			assert.deepStrictEqual([...single.root.children].map(([_, item]) => item), [single.root.children.get('id-a')]);
			assert.deepStrictEqual(b.parent, a);
		});

		test('sends document sync events', async () => {
			await single.expand(single.root.id, 0);
			single.collectDiff();

			const a = single.root.children.get('id-a') as TestItemImpl;
			a.range = new Range(new Position(0, 0), new Position(1, 0));

			assert.deepStrictEqual(single.collectDiff(), [
				{
					op: TestDiffOpType.DocumentSynced,
					docv: undefined,
					uri: URI.file('/')
				},
				{
					op: TestDiffOpType.Update,
					item: {
						extId: new TestId(['ctrlId', 'id-a']).toString(),
						item: {
							range: editorRange.Range.lift({
								endColumn: 1,
								endLineNumber: 2,
								startColumn: 1,
								startLineNumber: 1
							})
						}
					},
				},
			]);

			// sends on replace even if it's a no-op
			a.range = a.range;
			assert.deepStrictEqual(single.collectDiff(), [
				{
					op: TestDiffOpType.DocumentSynced,
					docv: undefined,
					uri: URI.file('/')
				},
			]);

			// sends on a child replacement
			const uri = URI.file('/');
			const a2 = new TestItemImpl('ctrlId', 'id-a', 'a', uri);
			a2.range = a.range;
			single.root.children.replace([a2, single.root.children.get('id-b')!]);
			assert.deepStrictEqual(single.collectDiff(), [
				{
					op: TestDiffOpType.DocumentSynced,
					docv: undefined,
					uri
				},
			]);
		});
	});


	suite('MirroredTestCollection', () => {
		// todo@connor4312: re-renable when we figure out what observing looks like we async children
		// 	let m: TestMirroredCollection;
		// 	setup(() => m = new TestMirroredCollection());

		// 	test('mirrors creation of the root', () => {
		// 		const tests = testStubs.nested();
		// 		single.addRoot(tests, 'pid');
		// 		single.expand(single.root.id, Infinity);
		// 		m.apply(single.collectDiff());
		// 		assertTreesEqual(m.rootTestItems[0], owned.getTestById(single.root.id)![1].actual);
		// 		assert.strictEqual(m.length, single.itemToInternal.size);
		// 	});

		// 	test('mirrors node deletion', () => {
		// 		const tests = testStubs.nested();
		// 		single.addRoot(tests, 'pid');
		// 		m.apply(single.collectDiff());
		// 		single.expand(single.root.id, Infinity);
		// 		tests.children!.splice(0, 1);
		// 		single.onItemChange(tests, 'pid');
		// 		single.expand(single.root.id, Infinity);
		// 		m.apply(single.collectDiff());

		// 		assertTreesEqual(m.rootTestItems[0], owned.getTestById(single.root.id)![1].actual);
		// 		assert.strictEqual(m.length, single.itemToInternal.size);
		// 	});

		// 	test('mirrors node addition', () => {
		// 		const tests = testStubs.nested();
		// 		single.addRoot(tests, 'pid');
		// 		m.apply(single.collectDiff());
		// 		tests.children![0].children!.push(stubTest('ac'));
		// 		single.onItemChange(tests, 'pid');
		// 		m.apply(single.collectDiff());

		// 		assertTreesEqual(m.rootTestItems[0], owned.getTestById(single.root.id)![1].actual);
		// 		assert.strictEqual(m.length, single.itemToInternal.size);
		// 	});

		// 	test('mirrors node update', () => {
		// 		const tests = testStubs.nested();
		// 		single.addRoot(tests, 'pid');
		// 		m.apply(single.collectDiff());
		// 		tests.children![0].description = 'Hello world'; /* item a */
		// 		single.onItemChange(tests, 'pid');
		// 		m.apply(single.collectDiff());

		// 		assertTreesEqual(m.rootTestItems[0], owned.getTestById(single.root.id)![1].actual);
		// 	});

		// 	suite('MirroredChangeCollector', () => {
		// 		let tests = testStubs.nested();
		// 		setup(() => {
		// 			tests = testStubs.nested();
		// 			single.addRoot(tests, 'pid');
		// 			m.apply(single.collectDiff());
		// 		});

		// 		test('creates change for root', () => {
		// 			assertTreeListEqual(m.changeEvent.added, [
		// 				tests,
		// 				tests.children[0],
		// 				tests.children![0].children![0],
		// 				tests.children![0].children![1],
		// 				tests.children[1],
		// 			]);
		// 			assertTreeListEqual(m.changeEvent.removed, []);
		// 			assertTreeListEqual(m.changeEvent.updated, []);
		// 		});

		// 		test('creates change for delete', () => {
		// 			const rm = tests.children.shift()!;
		// 			single.onItemChange(tests, 'pid');
		// 			m.apply(single.collectDiff());

		// 			assertTreeListEqual(m.changeEvent.added, []);
		// 			assertTreeListEqual(m.changeEvent.removed, [
		// 				{ ...rm },
		// 				{ ...rm.children![0] },
		// 				{ ...rm.children![1] },
		// 			]);
		// 			assertTreeListEqual(m.changeEvent.updated, []);
		// 		});

		// 		test('creates change for update', () => {
		// 			tests.children[0].label = 'updated!';
		// 			single.onItemChange(tests, 'pid');
		// 			m.apply(single.collectDiff());

		// 			assertTreeListEqual(m.changeEvent.added, []);
		// 			assertTreeListEqual(m.changeEvent.removed, []);
		// 			assertTreeListEqual(m.changeEvent.updated, [tests.children[0]]);
		// 		});

		// 		test('is a no-op if a node is added and removed', () => {
		// 			const nested = testStubs.nested('id2-');
		// 			tests.children.push(nested);
		// 			single.onItemChange(tests, 'pid');
		// 			tests.children.pop();
		// 			single.onItemChange(tests, 'pid');
		// 			const previousEvent = m.changeEvent;
		// 			m.apply(single.collectDiff());
		// 			assert.strictEqual(m.changeEvent, previousEvent);
		// 		});

		// 		test('is a single-op if a node is added and changed', () => {
		// 			const child = stubTest('c');
		// 			tests.children.push(child);
		// 			single.onItemChange(tests, 'pid');
		// 			child.label = 'd';
		// 			single.onItemChange(tests, 'pid');
		// 			m.apply(single.collectDiff());

		// 			assertTreeListEqual(m.changeEvent.added, [child]);
		// 			assertTreeListEqual(m.changeEvent.removed, []);
		// 			assertTreeListEqual(m.changeEvent.updated, []);
		// 		});

		// 		test('gets the common ancestor (1)', () => {
		// 			tests.children![0].children![0].label = 'za';
		// 			tests.children![0].children![1].label = 'zb';
		// 			single.onItemChange(tests, 'pid');
		// 			m.apply(single.collectDiff());

		// 		});

		// 		test('gets the common ancestor (2)', () => {
		// 			tests.children![0].children![0].label = 'za';
		// 			tests.children![1].label = 'ab';
		// 			single.onItemChange(tests, 'pid');
		// 			m.apply(single.collectDiff());
		// 		});
		// 	});
	});

	suite('TestRunTracker', () => {
		let proxy: MockObject<MainThreadTestingShape>;
		let c: TestRunCoordinator;
		let cts: CancellationTokenSource;
		let configuration: TestRunProfileImpl;

		let req: TestRunRequest;

		let dto: TestRunDto;
		// eslint-disable-next-line local/code-no-any-casts
		const ext: IExtensionDescription = {} as any;

		teardown(() => {
			for (const { id } of c.trackers) {
				c.disposeTestRun(id);
			}
		});

		setup(async () => {
			proxy = mockObject<MainThreadTestingShape>()();
			cts = new CancellationTokenSource();
			c = new TestRunCoordinator(proxy, new NullLogService());

			configuration = new TestRunProfileImpl(mockObject<MainThreadTestingShape>()(), new Map(), new Set(), Event.None, 'ctrlId', 42, 'Do Run', TestRunProfileKind.Run, () => { }, false);

			await single.expand(single.root.id, Infinity);
			single.collectDiff();

			req = {
				include: undefined,
				exclude: [single.root.children.get('id-b')!],
				profile: configuration,
				preserveFocus: false,
			};

			dto = TestRunDto.fromInternal({
				controllerId: 'ctrl',
				profileId: configuration.profileId,
				excludeExtIds: ['id-b'],
				runId: 'run-id',
				testIds: [single.root.id],
			}, single);
		});

		test('tracks a run started from a main thread request', () => {
			const tracker = ds.add(c.prepareForMainThreadTestRun(ext, req, dto, configuration, cts.token));
			assert.strictEqual(tracker.hasRunningTasks, false);

			const task1 = c.createTestRun(ext, 'ctrl', single, req, 'run1', true);
			const task2 = c.createTestRun(ext, 'ctrl', single, req, 'run2', true);
			assert.strictEqual(proxy.$startedExtensionTestRun.called, false);
			assert.strictEqual(tracker.hasRunningTasks, true);

			task1.appendOutput('hello');
			const taskId = proxy.$appendOutputToRun.args[0]?.[1];
			assert.deepStrictEqual([['run-id', taskId, VSBuffer.fromString('hello'), undefined, undefined]], proxy.$appendOutputToRun.args);
			task1.end();

			assert.strictEqual(proxy.$finishedExtensionTestRun.called, false);
			assert.strictEqual(tracker.hasRunningTasks, true);

			task2.end();

			assert.strictEqual(proxy.$finishedExtensionTestRun.called, false);
			assert.strictEqual(tracker.hasRunningTasks, false);
		});

		test('run cancel force ends after a timeout', () => {
			const clock = sinon.useFakeTimers();
			try {
				const tracker = ds.add(c.prepareForMainThreadTestRun(ext, req, dto, configuration, cts.token));
				const task = c.createTestRun(ext, 'ctrl', single, req, 'run1', true);
				const onEnded = sinon.stub();
				ds.add(tracker.onEnd(onEnded));

				assert.strictEqual(task.token.isCancellationRequested, false);
				assert.strictEqual(tracker.hasRunningTasks, true);
				tracker.cancel();

				assert.strictEqual(task.token.isCancellationRequested, true);
				assert.strictEqual(tracker.hasRunningTasks, true);

				clock.tick(9999);
				assert.strictEqual(tracker.hasRunningTasks, true);
				assert.strictEqual(onEnded.called, false);

				clock.tick(1);
				assert.strictEqual(onEnded.called, true);
				assert.strictEqual(tracker.hasRunningTasks, false);
			} finally {
				clock.restore();
			}
		});

		test('run cancel force ends on second cancellation request', () => {
			const tracker = ds.add(c.prepareForMainThreadTestRun(ext, req, dto, configuration, cts.token));
			const task = c.createTestRun(ext, 'ctrl', single, req, 'run1', true);
			const onEnded = sinon.stub();
			ds.add(tracker.onEnd(onEnded));

			assert.strictEqual(task.token.isCancellationRequested, false);
			assert.strictEqual(tracker.hasRunningTasks, true);
			tracker.cancel();

			assert.strictEqual(task.token.isCancellationRequested, true);
			assert.strictEqual(tracker.hasRunningTasks, true);
			assert.strictEqual(onEnded.called, false);
			tracker.cancel();

			assert.strictEqual(tracker.hasRunningTasks, false);
			assert.strictEqual(onEnded.called, true);
		});

		test('tracks a run started from an extension request', () => {
			const task1 = c.createTestRun(ext, 'ctrl', single, req, 'hello world', false);

			const tracker = Iterable.first(c.trackers)!;
			assert.strictEqual(tracker.hasRunningTasks, true);
			assert.deepStrictEqual(proxy.$startedExtensionTestRun.args, [
				[{
					profile: { group: 2, id: 42 },
					controllerId: 'ctrl',
					id: tracker.id,
					include: [single.root.id],
					exclude: [new TestId(['ctrlId', 'id-b']).toString()],
					persist: false,
					continuous: false,
					preserveFocus: false,
				}]
			]);

			const task2 = c.createTestRun(ext, 'ctrl', single, req, 'run2', true);
			const task3Detached = c.createTestRun(ext, 'ctrl', single, { ...req }, 'task3Detached', true);

			task1.end();
			assert.strictEqual(proxy.$finishedExtensionTestRun.called, false);
			assert.strictEqual(tracker.hasRunningTasks, true);

			task2.end();
			assert.deepStrictEqual(proxy.$finishedExtensionTestRun.args, [[tracker.id]]);
			assert.strictEqual(tracker.hasRunningTasks, false);

			task3Detached.end();
		});

		test('adds tests to run smartly', () => {
			const task1 = c.createTestRun(ext, 'ctrlId', single, req, 'hello world', false);
			const tracker = Iterable.first(c.trackers)!;
			const expectedArgs: unknown[][] = [];
			assert.deepStrictEqual(proxy.$addTestsToRun.args, expectedArgs);

			task1.passed(single.root.children.get('id-a')!.children.get('id-aa')!);
			expectedArgs.push([
				'ctrlId',
				tracker.id,
				[
					convert.TestItem.from(single.root),
					convert.TestItem.from(single.root.children.get('id-a') as TestItemImpl),
					convert.TestItem.from(single.root.children.get('id-a')!.children.get('id-aa') as TestItemImpl),
				]
			]);
			assert.deepStrictEqual(proxy.$addTestsToRun.args, expectedArgs);

			task1.enqueued(single.root.children.get('id-a')!.children.get('id-ab')!);
			expectedArgs.push([
				'ctrlId',
				tracker.id,
				[
					convert.TestItem.from(single.root.children.get('id-a') as TestItemImpl),
					convert.TestItem.from(single.root.children.get('id-a')!.children.get('id-ab') as TestItemImpl),
				],
			]);
			assert.deepStrictEqual(proxy.$addTestsToRun.args, expectedArgs);

			task1.passed(single.root.children.get('id-a')!.children.get('id-ab')!);
			assert.deepStrictEqual(proxy.$addTestsToRun.args, expectedArgs);

			task1.end();
		});

		test('adds test messages to run', () => {
			const test1 = new TestItemImpl('ctrlId', 'id-c', 'test c', URI.file('/testc.txt'));
			const test2 = new TestItemImpl('ctrlId', 'id-d', 'test d', URI.file('/testd.txt'));
			test1.range = test2.range = new Range(new Position(0, 0), new Position(1, 0));
			single.root.children.replace([test1, test2]);
			const task = c.createTestRun(ext, 'ctrlId', single, req, 'hello world', false);

			const message1 = new TestMessage('some message');
			message1.location = new Location(URI.file('/a.txt'), new Position(0, 0));
			task.failed(test1, message1);

			const args = proxy.$appendTestMessagesInRun.args[0];
			assert.deepStrictEqual(proxy.$appendTestMessagesInRun.args[0], [
				args[0],
				args[1],
				new TestId(['ctrlId', 'id-c']).toString(),
				[{
					message: 'some message',
					type: TestMessageType.Error,
					expected: undefined,
					contextValue: undefined,
					actual: undefined,
					location: convert.location.from(message1.location),
					stackTrace: undefined,
				}]
			]);

			// should use test location as default
			task.failed(test2, new TestMessage('some message'));
			assert.deepStrictEqual(proxy.$appendTestMessagesInRun.args[1], [
				args[0],
				args[1],
				new TestId(['ctrlId', 'id-d']).toString(),
				[{
					message: 'some message',
					type: TestMessageType.Error,
					contextValue: undefined,
					expected: undefined,
					actual: undefined,
					location: convert.location.from({ uri: test2.uri!, range: test2.range }),
					stackTrace: undefined,
				}]
			]);

			task.end();
		});

		test('guards calls after runs are ended', () => {
			const task = c.createTestRun(ext, 'ctrl', single, req, 'hello world', false);
			task.end();

			task.failed(single.root, new TestMessage('some message'));
			task.appendOutput('output');

			assert.strictEqual(proxy.$addTestsToRun.called, false);
			assert.strictEqual(proxy.$appendOutputToRun.called, false);
			assert.strictEqual(proxy.$appendTestMessagesInRun.called, false);
		});

		test('sets state of test with identical local IDs (#131827)', () => {
			const testA = single.root.children.get('id-a');
			const testB = single.root.children.get('id-b');
			const childA = new TestItemImpl('ctrlId', 'id-child', 'child', undefined);
			testA!.children.replace([childA]);
			const childB = new TestItemImpl('ctrlId', 'id-child', 'child', undefined);
			testB!.children.replace([childB]);

			const task1 = c.createTestRun(ext, 'ctrl', single, new TestRunRequestImpl(), 'hello world', false);
			const tracker = Iterable.first(c.trackers)!;

			task1.passed(childA);
			task1.passed(childB);
			assert.deepStrictEqual(proxy.$addTestsToRun.args, [
				[
					'ctrl',
					tracker.id,
					[single.root, testA, childA].map(t => convert.TestItem.from(t as TestItemImpl)),
				],
				[
					'ctrl',
					tracker.id,
					[single.root, testB, childB].map(t => convert.TestItem.from(t as TestItemImpl)),
				],
			]);

			task1.end();
		});
	});

	suite('service', () => {
		let ctrl: TestExtHostTesting;

		class TestExtHostTesting extends ExtHostTesting {
			public getProfileInternalId(ctrl: TestController, profile: TestRunProfile) {
				for (const [id, p] of this.controllers.get(ctrl.id)!.profiles) {
					if (profile === p) {
						return id;
					}
				}

				throw new Error('profile not found');
			}
		}

		setup(() => {
			const rpcProtocol = AnyCallRPCProtocol();
			ctrl = ds.add(new TestExtHostTesting(
				rpcProtocol,
				new NullLogService(),
				new ExtHostCommands(rpcProtocol, new NullLogService(), new class extends mock<IExtHostTelemetry>() {
					override onExtensionError(): boolean {
						return true;
					}
				}),
				new ExtHostDocumentsAndEditors(rpcProtocol, new NullLogService()),
			));
		});

		test('exposes active profiles correctly', async () => {
			const extA = { ...nullExtensionDescription, identifier: new ExtensionIdentifier('ext.a'), enabledApiProposals: ['testingActiveProfile'] };
			const extB = { ...nullExtensionDescription, identifier: new ExtensionIdentifier('ext.b'), enabledApiProposals: ['testingActiveProfile'] };

			const ctrlA = ds.add(ctrl.createTestController(extA, 'a', 'ctrla'));
			const profAA = ds.add(ctrlA.createRunProfile('aa', TestRunProfileKind.Run, () => { }));
			const profAB = ds.add(ctrlA.createRunProfile('ab', TestRunProfileKind.Run, () => { }));

			const ctrlB = ds.add(ctrl.createTestController(extB, 'b', 'ctrlb'));
			const profBA = ds.add(ctrlB.createRunProfile('ba', TestRunProfileKind.Run, () => { }));
			const profBB = ds.add(ctrlB.createRunProfile('bb', TestRunProfileKind.Run, () => { }));
			const neverCalled = sinon.stub();

			// empty default state:
			assert.deepStrictEqual(profAA.isDefault, false);
			assert.deepStrictEqual(profBA.isDefault, false);
			assert.deepStrictEqual(profBB.isDefault, false);

			// fires a change event:
			const changeA = Event.toPromise(profAA.onDidChangeDefault as Event<boolean>);
			const changeBA = Event.toPromise(profBA.onDidChangeDefault as Event<boolean>);
			const changeBB = Event.toPromise(profBB.onDidChangeDefault as Event<boolean>);

			ds.add(profAB.onDidChangeDefault(neverCalled));
			assert.strictEqual(neverCalled.called, false);

			ctrl.$setDefaultRunProfiles({
				a: [ctrl.getProfileInternalId(ctrlA, profAA)],
				b: [ctrl.getProfileInternalId(ctrlB, profBA), ctrl.getProfileInternalId(ctrlB, profBB)]
			});

			assert.deepStrictEqual(await changeA, true);
			assert.deepStrictEqual(await changeBA, true);
			assert.deepStrictEqual(await changeBB, true);

			// updates internal state:
			assert.deepStrictEqual(profAA.isDefault, true);
			assert.deepStrictEqual(profBA.isDefault, true);
			assert.deepStrictEqual(profBB.isDefault, true);
			assert.deepStrictEqual(profAB.isDefault, false);

			// no-ops if equal
			ds.add(profAA.onDidChangeDefault(neverCalled));
			ctrl.$setDefaultRunProfiles({
				a: [ctrl.getProfileInternalId(ctrlA, profAA)],
			});
			assert.strictEqual(neverCalled.called, false);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/test/browser/extHostTextEditor.test.ts]---
Location: vscode-main/src/vs/workbench/api/test/browser/extHostTextEditor.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { Lazy } from '../../../../base/common/lazy.js';
import { URI } from '../../../../base/common/uri.js';
import { mock } from '../../../../base/test/common/mock.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { RenderLineNumbersType, TextEditorCursorStyle } from '../../../../editor/common/config/editorOptions.js';
import { NullLogService } from '../../../../platform/log/common/log.js';
import { IResolvedTextEditorConfiguration, ITextEditorConfigurationUpdate, MainThreadTextEditorsShape } from '../../common/extHost.protocol.js';
import { ExtHostDocumentData } from '../../common/extHostDocumentData.js';
import { ExtHostTextEditor, ExtHostTextEditorOptions } from '../../common/extHostTextEditor.js';
import { Range, TextEditorLineNumbersStyle } from '../../common/extHostTypes.js';

suite('ExtHostTextEditor', () => {

	let editor: ExtHostTextEditor;
	const doc = new ExtHostDocumentData(undefined!, URI.file(''), [
		'aaaa bbbb+cccc abc'
	], '\n', 1, 'text', false, 'utf8');

	setup(() => {
		editor = new ExtHostTextEditor('fake', null!, new NullLogService(), new Lazy(() => doc.document), [], { cursorStyle: TextEditorCursorStyle.Line, insertSpaces: true, lineNumbers: 1, tabSize: 4, indentSize: 4, originalIndentSize: 'tabSize' }, [], 1);
	});

	test('disposed editor', () => {

		assert.ok(editor.value.document);
		editor._acceptViewColumn(3);
		assert.strictEqual(3, editor.value.viewColumn);

		editor.dispose();

		assert.throws(() => editor._acceptViewColumn(2));
		assert.strictEqual(3, editor.value.viewColumn);

		assert.ok(editor.value.document);
		assert.throws(() => editor._acceptOptions(null!));
		assert.throws(() => editor._acceptSelections([]));
	});

	test('API [bug]: registerTextEditorCommand clears redo stack even if no edits are made #55163', async function () {
		let applyCount = 0;
		const editor = new ExtHostTextEditor('edt1',
			new class extends mock<MainThreadTextEditorsShape>() {
				override $tryApplyEdits(): Promise<boolean> {
					applyCount += 1;
					return Promise.resolve(true);
				}
			}, new NullLogService(), new Lazy(() => doc.document), [], { cursorStyle: TextEditorCursorStyle.Line, insertSpaces: true, lineNumbers: 1, tabSize: 4, indentSize: 4, originalIndentSize: 'tabSize' }, [], 1);

		await editor.value.edit(edit => { });
		assert.strictEqual(applyCount, 0);

		await editor.value.edit(edit => { edit.setEndOfLine(1); });
		assert.strictEqual(applyCount, 1);

		await editor.value.edit(edit => { edit.delete(new Range(0, 0, 1, 1)); });
		assert.strictEqual(applyCount, 2);
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});

suite('ExtHostTextEditorOptions', () => {

	let opts: ExtHostTextEditorOptions;
	let calls: ITextEditorConfigurationUpdate[] = [];

	setup(() => {
		calls = [];
		const mockProxy: MainThreadTextEditorsShape = {
			dispose: undefined!,
			$trySetOptions: (id: string, options: ITextEditorConfigurationUpdate) => {
				assert.strictEqual(id, '1');
				calls.push(options);
				return Promise.resolve(undefined);
			},
			$tryShowTextDocument: undefined!,
			$registerTextEditorDecorationType: undefined!,
			$removeTextEditorDecorationType: undefined!,
			$tryShowEditor: undefined!,
			$tryHideEditor: undefined!,
			$trySetDecorations: undefined!,
			$trySetDecorationsFast: undefined!,
			$tryRevealRange: undefined!,
			$trySetSelections: undefined!,
			$tryApplyEdits: undefined!,
			$tryInsertSnippet: undefined!,
			$getDiffInformation: undefined!
		};
		opts = new ExtHostTextEditorOptions(mockProxy, '1', {
			tabSize: 4,
			indentSize: 4,
			originalIndentSize: 'tabSize',
			insertSpaces: false,
			cursorStyle: TextEditorCursorStyle.Line,
			lineNumbers: RenderLineNumbersType.On
		}, new NullLogService());
	});

	teardown(() => {
		opts = null!;
		calls = null!;
	});

	function assertState(opts: ExtHostTextEditorOptions, expected: Omit<IResolvedTextEditorConfiguration, 'originalIndentSize'>): void {
		const actual = {
			tabSize: opts.value.tabSize,
			indentSize: opts.value.indentSize,
			insertSpaces: opts.value.insertSpaces,
			cursorStyle: opts.value.cursorStyle,
			lineNumbers: opts.value.lineNumbers
		};
		assert.deepStrictEqual(actual, expected);
	}

	test('can set tabSize to the same value', () => {
		opts.value.tabSize = 4;
		assertState(opts, {
			tabSize: 4,
			indentSize: 4,
			insertSpaces: false,
			cursorStyle: TextEditorCursorStyle.Line,
			lineNumbers: RenderLineNumbersType.On
		});
		assert.deepStrictEqual(calls, []);
	});

	test('can change tabSize to positive integer', () => {
		opts.value.tabSize = 1;
		assertState(opts, {
			tabSize: 1,
			indentSize: 4,
			insertSpaces: false,
			cursorStyle: TextEditorCursorStyle.Line,
			lineNumbers: RenderLineNumbersType.On
		});
		assert.deepStrictEqual(calls, [{ tabSize: 1 }]);
	});

	test('can change tabSize to positive float', () => {
		opts.value.tabSize = 2.3;
		assertState(opts, {
			tabSize: 2,
			indentSize: 4,
			insertSpaces: false,
			cursorStyle: TextEditorCursorStyle.Line,
			lineNumbers: RenderLineNumbersType.On
		});
		assert.deepStrictEqual(calls, [{ tabSize: 2 }]);
	});

	test('can change tabSize to a string number', () => {
		opts.value.tabSize = '2';
		assertState(opts, {
			tabSize: 2,
			indentSize: 4,
			insertSpaces: false,
			cursorStyle: TextEditorCursorStyle.Line,
			lineNumbers: RenderLineNumbersType.On
		});
		assert.deepStrictEqual(calls, [{ tabSize: 2 }]);
	});

	test('tabSize can request indentation detection', () => {
		opts.value.tabSize = 'auto';
		assertState(opts, {
			tabSize: 4,
			indentSize: 4,
			insertSpaces: false,
			cursorStyle: TextEditorCursorStyle.Line,
			lineNumbers: RenderLineNumbersType.On
		});
		assert.deepStrictEqual(calls, [{ tabSize: 'auto' }]);
	});

	test('ignores invalid tabSize 1', () => {
		opts.value.tabSize = null!;
		assertState(opts, {
			tabSize: 4,
			indentSize: 4,
			insertSpaces: false,
			cursorStyle: TextEditorCursorStyle.Line,
			lineNumbers: RenderLineNumbersType.On
		});
		assert.deepStrictEqual(calls, []);
	});

	test('ignores invalid tabSize 2', () => {
		opts.value.tabSize = -5;
		assertState(opts, {
			tabSize: 4,
			indentSize: 4,
			insertSpaces: false,
			cursorStyle: TextEditorCursorStyle.Line,
			lineNumbers: RenderLineNumbersType.On
		});
		assert.deepStrictEqual(calls, []);
	});

	test('ignores invalid tabSize 3', () => {
		opts.value.tabSize = 'hello';
		assertState(opts, {
			tabSize: 4,
			indentSize: 4,
			insertSpaces: false,
			cursorStyle: TextEditorCursorStyle.Line,
			lineNumbers: RenderLineNumbersType.On
		});
		assert.deepStrictEqual(calls, []);
	});

	test('ignores invalid tabSize 4', () => {
		opts.value.tabSize = '-17';
		assertState(opts, {
			tabSize: 4,
			indentSize: 4,
			insertSpaces: false,
			cursorStyle: TextEditorCursorStyle.Line,
			lineNumbers: RenderLineNumbersType.On
		});
		assert.deepStrictEqual(calls, []);
	});

	test('can set indentSize to the same value', () => {
		opts.value.indentSize = 4;
		assertState(opts, {
			tabSize: 4,
			indentSize: 4,
			insertSpaces: false,
			cursorStyle: TextEditorCursorStyle.Line,
			lineNumbers: RenderLineNumbersType.On
		});
		assert.deepStrictEqual(calls, [{ indentSize: 4 }]);
	});

	test('can change indentSize to positive integer', () => {
		opts.value.indentSize = 1;
		assertState(opts, {
			tabSize: 4,
			indentSize: 1,
			insertSpaces: false,
			cursorStyle: TextEditorCursorStyle.Line,
			lineNumbers: RenderLineNumbersType.On
		});
		assert.deepStrictEqual(calls, [{ indentSize: 1 }]);
	});

	test('can change indentSize to positive float', () => {
		opts.value.indentSize = 2.3;
		assertState(opts, {
			tabSize: 4,
			indentSize: 2,
			insertSpaces: false,
			cursorStyle: TextEditorCursorStyle.Line,
			lineNumbers: RenderLineNumbersType.On
		});
		assert.deepStrictEqual(calls, [{ indentSize: 2 }]);
	});

	test('can change indentSize to a string number', () => {
		// eslint-disable-next-line local/code-no-any-casts
		opts.value.indentSize = <any>'2';
		assertState(opts, {
			tabSize: 4,
			indentSize: 2,
			insertSpaces: false,
			cursorStyle: TextEditorCursorStyle.Line,
			lineNumbers: RenderLineNumbersType.On
		});
		assert.deepStrictEqual(calls, [{ indentSize: 2 }]);
	});

	test('indentSize can request to use tabSize', () => {
		opts.value.indentSize = 'tabSize';
		assertState(opts, {
			tabSize: 4,
			indentSize: 4,
			insertSpaces: false,
			cursorStyle: TextEditorCursorStyle.Line,
			lineNumbers: RenderLineNumbersType.On
		});
		assert.deepStrictEqual(calls, [{ indentSize: 'tabSize' }]);
	});

	test('indentSize cannot request indentation detection', () => {
		// eslint-disable-next-line local/code-no-any-casts
		opts.value.indentSize = <any>'auto';
		assertState(opts, {
			tabSize: 4,
			indentSize: 4,
			insertSpaces: false,
			cursorStyle: TextEditorCursorStyle.Line,
			lineNumbers: RenderLineNumbersType.On
		});
		assert.deepStrictEqual(calls, []);
	});

	test('ignores invalid indentSize 1', () => {
		opts.value.indentSize = null!;
		assertState(opts, {
			tabSize: 4,
			indentSize: 4,
			insertSpaces: false,
			cursorStyle: TextEditorCursorStyle.Line,
			lineNumbers: RenderLineNumbersType.On
		});
		assert.deepStrictEqual(calls, []);
	});

	test('ignores invalid indentSize 2', () => {
		opts.value.indentSize = -5;
		assertState(opts, {
			tabSize: 4,
			indentSize: 4,
			insertSpaces: false,
			cursorStyle: TextEditorCursorStyle.Line,
			lineNumbers: RenderLineNumbersType.On
		});
		assert.deepStrictEqual(calls, []);
	});

	test('ignores invalid indentSize 3', () => {
		// eslint-disable-next-line local/code-no-any-casts
		opts.value.indentSize = <any>'hello';
		assertState(opts, {
			tabSize: 4,
			indentSize: 4,
			insertSpaces: false,
			cursorStyle: TextEditorCursorStyle.Line,
			lineNumbers: RenderLineNumbersType.On
		});
		assert.deepStrictEqual(calls, []);
	});

	test('ignores invalid indentSize 4', () => {
		// eslint-disable-next-line local/code-no-any-casts
		opts.value.indentSize = <any>'-17';
		assertState(opts, {
			tabSize: 4,
			indentSize: 4,
			insertSpaces: false,
			cursorStyle: TextEditorCursorStyle.Line,
			lineNumbers: RenderLineNumbersType.On
		});
		assert.deepStrictEqual(calls, []);
	});

	test('can set insertSpaces to the same value', () => {
		opts.value.insertSpaces = false;
		assertState(opts, {
			tabSize: 4,
			indentSize: 4,
			insertSpaces: false,
			cursorStyle: TextEditorCursorStyle.Line,
			lineNumbers: RenderLineNumbersType.On
		});
		assert.deepStrictEqual(calls, []);
	});

	test('can set insertSpaces to boolean', () => {
		opts.value.insertSpaces = true;
		assertState(opts, {
			tabSize: 4,
			indentSize: 4,
			insertSpaces: true,
			cursorStyle: TextEditorCursorStyle.Line,
			lineNumbers: RenderLineNumbersType.On
		});
		assert.deepStrictEqual(calls, [{ insertSpaces: true }]);
	});

	test('can set insertSpaces to false string', () => {
		opts.value.insertSpaces = 'false';
		assertState(opts, {
			tabSize: 4,
			indentSize: 4,
			insertSpaces: false,
			cursorStyle: TextEditorCursorStyle.Line,
			lineNumbers: RenderLineNumbersType.On
		});
		assert.deepStrictEqual(calls, []);
	});

	test('can set insertSpaces to truey', () => {
		opts.value.insertSpaces = 'hello';
		assertState(opts, {
			tabSize: 4,
			indentSize: 4,
			insertSpaces: true,
			cursorStyle: TextEditorCursorStyle.Line,
			lineNumbers: RenderLineNumbersType.On
		});
		assert.deepStrictEqual(calls, [{ insertSpaces: true }]);
	});

	test('insertSpaces can request indentation detection', () => {
		opts.value.insertSpaces = 'auto';
		assertState(opts, {
			tabSize: 4,
			indentSize: 4,
			insertSpaces: false,
			cursorStyle: TextEditorCursorStyle.Line,
			lineNumbers: RenderLineNumbersType.On
		});
		assert.deepStrictEqual(calls, [{ insertSpaces: 'auto' }]);
	});

	test('can set cursorStyle to same value', () => {
		opts.value.cursorStyle = TextEditorCursorStyle.Line;
		assertState(opts, {
			tabSize: 4,
			indentSize: 4,
			insertSpaces: false,
			cursorStyle: TextEditorCursorStyle.Line,
			lineNumbers: RenderLineNumbersType.On
		});
		assert.deepStrictEqual(calls, []);
	});

	test('can change cursorStyle', () => {
		opts.value.cursorStyle = TextEditorCursorStyle.Block;
		assertState(opts, {
			tabSize: 4,
			indentSize: 4,
			insertSpaces: false,
			cursorStyle: TextEditorCursorStyle.Block,
			lineNumbers: RenderLineNumbersType.On
		});
		assert.deepStrictEqual(calls, [{ cursorStyle: TextEditorCursorStyle.Block }]);
	});

	test('can set lineNumbers to same value', () => {
		opts.value.lineNumbers = TextEditorLineNumbersStyle.On;
		assertState(opts, {
			tabSize: 4,
			indentSize: 4,
			insertSpaces: false,
			cursorStyle: TextEditorCursorStyle.Line,
			lineNumbers: RenderLineNumbersType.On
		});
		assert.deepStrictEqual(calls, []);
	});

	test('can change lineNumbers', () => {
		opts.value.lineNumbers = TextEditorLineNumbersStyle.Off;
		assertState(opts, {
			tabSize: 4,
			indentSize: 4,
			insertSpaces: false,
			cursorStyle: TextEditorCursorStyle.Line,
			lineNumbers: RenderLineNumbersType.Off
		});
		assert.deepStrictEqual(calls, [{ lineNumbers: RenderLineNumbersType.Off }]);
	});

	test('can do bulk updates 0', () => {
		opts.assign({
			tabSize: 4,
			indentSize: 4,
			insertSpaces: false,
			cursorStyle: TextEditorCursorStyle.Line,
			lineNumbers: TextEditorLineNumbersStyle.On
		});
		assertState(opts, {
			tabSize: 4,
			indentSize: 4,
			insertSpaces: false,
			cursorStyle: TextEditorCursorStyle.Line,
			lineNumbers: RenderLineNumbersType.On
		});
		assert.deepStrictEqual(calls, [{ indentSize: 4 }]);
	});

	test('can do bulk updates 1', () => {
		opts.assign({
			tabSize: 'auto',
			insertSpaces: true
		});
		assertState(opts, {
			tabSize: 4,
			indentSize: 4,
			insertSpaces: true,
			cursorStyle: TextEditorCursorStyle.Line,
			lineNumbers: RenderLineNumbersType.On
		});
		assert.deepStrictEqual(calls, [{ tabSize: 'auto', insertSpaces: true }]);
	});

	test('can do bulk updates 2', () => {
		opts.assign({
			tabSize: 3,
			insertSpaces: 'auto'
		});
		assertState(opts, {
			tabSize: 3,
			indentSize: 4,
			insertSpaces: false,
			cursorStyle: TextEditorCursorStyle.Line,
			lineNumbers: RenderLineNumbersType.On
		});
		assert.deepStrictEqual(calls, [{ tabSize: 3, insertSpaces: 'auto' }]);
	});

	test('can do bulk updates 3', () => {
		opts.assign({
			cursorStyle: TextEditorCursorStyle.Block,
			lineNumbers: TextEditorLineNumbersStyle.Relative
		});
		assertState(opts, {
			tabSize: 4,
			indentSize: 4,
			insertSpaces: false,
			cursorStyle: TextEditorCursorStyle.Block,
			lineNumbers: RenderLineNumbersType.Relative
		});
		assert.deepStrictEqual(calls, [{ cursorStyle: TextEditorCursorStyle.Block, lineNumbers: RenderLineNumbersType.Relative }]);
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/test/browser/extHostTreeViews.test.ts]---
Location: vscode-main/src/vs/workbench/api/test/browser/extHostTreeViews.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import * as sinon from 'sinon';
import { Emitter } from '../../../../base/common/event.js';
import { ExtHostTreeViews } from '../../common/extHostTreeViews.js';
import { ExtHostCommands } from '../../common/extHostCommands.js';
import { MainThreadTreeViewsShape, MainContext, MainThreadCommandsShape } from '../../common/extHost.protocol.js';
import { TreeDataProvider, TreeItem } from 'vscode';
import { TestRPCProtocol } from '../common/testRPCProtocol.js';
import { mock } from '../../../../base/test/common/mock.js';
import { TreeItemCollapsibleState, ITreeItem, IRevealOptions } from '../../../common/views.js';
import { NullLogService } from '../../../../platform/log/common/log.js';
import type { IDisposable } from '../../../../base/common/lifecycle.js';
import { nullExtensionDescription as extensionsDescription } from '../../../services/extensions/common/extensions.js';
import { runWithFakedTimers } from '../../../../base/test/common/timeTravelScheduler.js';
import { IExtHostTelemetry } from '../../common/extHostTelemetry.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';

function unBatchChildren(result: (number | ITreeItem)[][] | undefined): ITreeItem[] | undefined {
	if (!result || result.length === 0) {
		return undefined;
	}
	if (result.length > 1) {
		throw new Error('Unexpected result length, all tests are unbatched.');
	}
	return result[0].slice(1) as ITreeItem[];
}

suite('ExtHostTreeView', function () {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	class RecordingShape extends mock<MainThreadTreeViewsShape>() {

		onRefresh = new Emitter<{ [treeItemHandle: string]: ITreeItem }>();

		override async $registerTreeViewDataProvider(treeViewId: string): Promise<void> {
		}

		override $refresh(viewId: string, itemsToRefresh: { [treeItemHandle: string]: ITreeItem }): Promise<void> {
			return Promise.resolve(null).then(() => {
				this.onRefresh.fire(itemsToRefresh);
			});
		}

		override $reveal(treeViewId: string, itemInfo: { item: ITreeItem; parentChain: ITreeItem[] } | undefined, options: IRevealOptions): Promise<void> {
			return Promise.resolve();
		}

		override $disposeTree(treeViewId: string): Promise<void> {
			return Promise.resolve();
		}

	}

	let testObject: ExtHostTreeViews;
	let target: RecordingShape;
	let onDidChangeTreeNode: Emitter<{ key: string } | undefined>;
	let onDidChangeTreeNodeWithId: Emitter<{ key: string }>;
	let tree: { [key: string]: any };
	let labels: { [key: string]: string };
	let nodes: { [key: string]: { key: string } };

	setup(() => {
		tree = {
			'a': {
				'aa': {},
				'ab': {}
			},
			'b': {
				'ba': {},
				'bb': {}
			}
		};

		labels = {};
		nodes = {};

		const rpcProtocol = new TestRPCProtocol();

		rpcProtocol.set(MainContext.MainThreadCommands, new class extends mock<MainThreadCommandsShape>() {
			override $registerCommand() { }
		});
		target = new RecordingShape();
		testObject = store.add(new ExtHostTreeViews(target, new ExtHostCommands(
			rpcProtocol,
			new NullLogService(),
			new class extends mock<IExtHostTelemetry>() {
				override onExtensionError(): boolean {
					return true;
				}
			}
		), new NullLogService()));
		onDidChangeTreeNode = new Emitter<{ key: string } | undefined>();
		onDidChangeTreeNodeWithId = new Emitter<{ key: string }>();
		testObject.createTreeView('testNodeTreeProvider', { treeDataProvider: aNodeTreeDataProvider() }, extensionsDescription);
		testObject.createTreeView('testNodeWithIdTreeProvider', { treeDataProvider: aNodeWithIdTreeDataProvider() }, extensionsDescription);
		testObject.createTreeView('testNodeWithHighlightsTreeProvider', { treeDataProvider: aNodeWithHighlightedLabelTreeDataProvider() }, extensionsDescription);

		return loadCompleteTree('testNodeTreeProvider');
	});

	test('construct node tree', () => {
		return testObject.$getChildren('testNodeTreeProvider')
			.then(elements => {
				const actuals = unBatchChildren(elements)?.map(e => e.handle);
				assert.deepStrictEqual(actuals, ['0/0:a', '0/0:b']);
				return Promise.all([
					testObject.$getChildren('testNodeTreeProvider', ['0/0:a'])
						.then(children => {
							const actuals = unBatchChildren(children)?.map(e => e.handle);
							assert.deepStrictEqual(actuals, ['0/0:a/0:aa', '0/0:a/0:ab']);
							return Promise.all([
								testObject.$getChildren('testNodeTreeProvider', ['0/0:a/0:aa']).then(children => assert.strictEqual(unBatchChildren(children)?.length, 0)),
								testObject.$getChildren('testNodeTreeProvider', ['0/0:a/0:ab']).then(children => assert.strictEqual(unBatchChildren(children)?.length, 0))
							]);
						}),
					testObject.$getChildren('testNodeTreeProvider', ['0/0:b'])
						.then(children => {
							const actuals = unBatchChildren(children)?.map(e => e.handle);
							assert.deepStrictEqual(actuals, ['0/0:b/0:ba', '0/0:b/0:bb']);
							return Promise.all([
								testObject.$getChildren('testNodeTreeProvider', ['0/0:b/0:ba']).then(children => assert.strictEqual(unBatchChildren(children)?.length, 0)),
								testObject.$getChildren('testNodeTreeProvider', ['0/0:b/0:bb']).then(children => assert.strictEqual(unBatchChildren(children)?.length, 0))
							]);
						})
				]);
			});
	});

	test('construct id tree', () => {
		return testObject.$getChildren('testNodeWithIdTreeProvider')
			.then(elements => {
				const actuals = unBatchChildren(elements)?.map(e => e.handle);
				assert.deepStrictEqual(actuals, ['1/a', '1/b']);
				return Promise.all([
					testObject.$getChildren('testNodeWithIdTreeProvider', ['1/a'])
						.then(children => {
							const actuals = unBatchChildren(children)?.map(e => e.handle);
							assert.deepStrictEqual(actuals, ['1/aa', '1/ab']);
							return Promise.all([
								testObject.$getChildren('testNodeWithIdTreeProvider', ['1/aa']).then(children => assert.strictEqual(unBatchChildren(children)?.length, 0)),
								testObject.$getChildren('testNodeWithIdTreeProvider', ['1/ab']).then(children => assert.strictEqual(unBatchChildren(children)?.length, 0))
							]);
						}),
					testObject.$getChildren('testNodeWithIdTreeProvider', ['1/b'])
						.then(children => {
							const actuals = unBatchChildren(children)?.map(e => e.handle);
							assert.deepStrictEqual(actuals, ['1/ba', '1/bb']);
							return Promise.all([
								testObject.$getChildren('testNodeWithIdTreeProvider', ['1/ba']).then(children => assert.strictEqual(unBatchChildren(children)?.length, 0)),
								testObject.$getChildren('testNodeWithIdTreeProvider', ['1/bb']).then(children => assert.strictEqual(unBatchChildren(children)?.length, 0))
							]);
						})
				]);
			});
	});

	test('construct highlights tree', () => {
		return testObject.$getChildren('testNodeWithHighlightsTreeProvider')
			.then(elements => {
				assert.deepStrictEqual(removeUnsetKeys(unBatchChildren(elements)), [{
					handle: '1/a',
					label: { label: 'a', highlights: [[0, 2], [3, 5]] },
					collapsibleState: TreeItemCollapsibleState.Collapsed
				}, {
					handle: '1/b',
					label: { label: 'b', highlights: [[0, 2], [3, 5]] },
					collapsibleState: TreeItemCollapsibleState.Collapsed
				}]);
				return Promise.all([
					testObject.$getChildren('testNodeWithHighlightsTreeProvider', ['1/a'])
						.then(children => {
							assert.deepStrictEqual(removeUnsetKeys(unBatchChildren(children)), [{
								handle: '1/aa',
								parentHandle: '1/a',
								label: { label: 'aa', highlights: [[0, 2], [3, 5]] },
								collapsibleState: TreeItemCollapsibleState.None
							}, {
								handle: '1/ab',
								parentHandle: '1/a',
								label: { label: 'ab', highlights: [[0, 2], [3, 5]] },
								collapsibleState: TreeItemCollapsibleState.None
							}]);
						}),
					testObject.$getChildren('testNodeWithHighlightsTreeProvider', ['1/b'])
						.then(children => {
							assert.deepStrictEqual(removeUnsetKeys(unBatchChildren(children)), [{
								handle: '1/ba',
								parentHandle: '1/b',
								label: { label: 'ba', highlights: [[0, 2], [3, 5]] },
								collapsibleState: TreeItemCollapsibleState.None
							}, {
								handle: '1/bb',
								parentHandle: '1/b',
								label: { label: 'bb', highlights: [[0, 2], [3, 5]] },
								collapsibleState: TreeItemCollapsibleState.None
							}]);
						})
				]);
			});
	});

	test('error is thrown if id is not unique', (done) => {
		tree['a'] = {
			'aa': {},
		};
		tree['b'] = {
			'aa': {},
			'ba': {}
		};
		let caughtExpectedError = false;
		store.add(target.onRefresh.event(() => {
			testObject.$getChildren('testNodeWithIdTreeProvider')
				.then(elements => {
					const actuals = unBatchChildren(elements)?.map(e => e.handle);
					assert.deepStrictEqual(actuals, ['1/a', '1/b']);
					return testObject.$getChildren('testNodeWithIdTreeProvider', ['1/a'])
						.then(() => testObject.$getChildren('testNodeWithIdTreeProvider', ['1/b']))
						.then(() => assert.fail('Should fail with duplicate id'))
						.catch(() => caughtExpectedError = true)
						.finally(() => caughtExpectedError ? done() : assert.fail('Expected duplicate id error not thrown.'));
				});
		}));
		onDidChangeTreeNode.fire(undefined);
	});

	test('refresh root', function (done) {
		store.add(target.onRefresh.event(actuals => {
			assert.strictEqual(undefined, actuals);
			done();
		}));
		onDidChangeTreeNode.fire(undefined);
	});

	test('refresh a parent node', () => {
		return new Promise((c, e) => {
			store.add(target.onRefresh.event(actuals => {
				assert.deepStrictEqual(['0/0:b'], Object.keys(actuals));
				assert.deepStrictEqual(removeUnsetKeys(actuals['0/0:b']), {
					handle: '0/0:b',
					label: { label: 'b' },
					collapsibleState: TreeItemCollapsibleState.Collapsed
				});
				c(undefined);
			}));
			onDidChangeTreeNode.fire(getNode('b'));
		});
	});

	test('refresh a leaf node', function (done) {
		store.add(target.onRefresh.event(actuals => {
			assert.deepStrictEqual(['0/0:b/0:bb'], Object.keys(actuals));
			assert.deepStrictEqual(removeUnsetKeys(actuals['0/0:b/0:bb']), {
				handle: '0/0:b/0:bb',
				parentHandle: '0/0:b',
				label: { label: 'bb' },
				collapsibleState: TreeItemCollapsibleState.None
			});
			done();
		}));
		onDidChangeTreeNode.fire(getNode('bb'));
	});

	async function runWithEventMerging(action: (resolve: () => void) => void) {
		await runWithFakedTimers({}, async () => {
			await new Promise<void>((resolve) => {
				let subscription: IDisposable | undefined = undefined;
				subscription = target.onRefresh.event(() => {
					subscription!.dispose();
					resolve();
				});
				onDidChangeTreeNode.fire(getNode('b'));
			});
			await new Promise<void>(action);
		});
	}

	test('refresh parent and child node trigger refresh only on parent - scenario 1', async () => {
		return runWithEventMerging((resolve) => {
			store.add(target.onRefresh.event(actuals => {
				assert.deepStrictEqual(['0/0:b', '0/0:a/0:aa'], Object.keys(actuals));
				assert.deepStrictEqual(removeUnsetKeys(actuals['0/0:b']), {
					handle: '0/0:b',
					label: { label: 'b' },
					collapsibleState: TreeItemCollapsibleState.Collapsed
				});
				assert.deepStrictEqual(removeUnsetKeys(actuals['0/0:a/0:aa']), {
					handle: '0/0:a/0:aa',
					parentHandle: '0/0:a',
					label: { label: 'aa' },
					collapsibleState: TreeItemCollapsibleState.None
				});
				resolve();
			}));
			onDidChangeTreeNode.fire(getNode('b'));
			onDidChangeTreeNode.fire(getNode('aa'));
			onDidChangeTreeNode.fire(getNode('bb'));
		});
	});

	test('refresh parent and child node trigger refresh only on parent - scenario 2', async () => {
		return runWithEventMerging((resolve) => {
			store.add(target.onRefresh.event(actuals => {
				assert.deepStrictEqual(['0/0:a/0:aa', '0/0:b'], Object.keys(actuals));
				assert.deepStrictEqual(removeUnsetKeys(actuals['0/0:b']), {
					handle: '0/0:b',
					label: { label: 'b' },
					collapsibleState: TreeItemCollapsibleState.Collapsed
				});
				assert.deepStrictEqual(removeUnsetKeys(actuals['0/0:a/0:aa']), {
					handle: '0/0:a/0:aa',
					parentHandle: '0/0:a',
					label: { label: 'aa' },
					collapsibleState: TreeItemCollapsibleState.None
				});
				resolve();
			}));
			onDidChangeTreeNode.fire(getNode('bb'));
			onDidChangeTreeNode.fire(getNode('aa'));
			onDidChangeTreeNode.fire(getNode('b'));
		});
	});

	test('refresh an element for label change', function (done) {
		labels['a'] = 'aa';
		store.add(target.onRefresh.event(actuals => {
			assert.deepStrictEqual(['0/0:a'], Object.keys(actuals));
			assert.deepStrictEqual(removeUnsetKeys(actuals['0/0:a']), {
				handle: '0/0:aa',
				label: { label: 'aa' },
				collapsibleState: TreeItemCollapsibleState.Collapsed
			});
			done();
		}));
		onDidChangeTreeNode.fire(getNode('a'));
	});

	test('refresh calls are throttled on roots', () => {
		return runWithEventMerging((resolve) => {
			store.add(target.onRefresh.event(actuals => {
				assert.strictEqual(undefined, actuals);
				resolve();
			}));
			onDidChangeTreeNode.fire(undefined);
			onDidChangeTreeNode.fire(undefined);
			onDidChangeTreeNode.fire(undefined);
			onDidChangeTreeNode.fire(undefined);
		});
	});

	test('refresh calls are throttled on elements', () => {
		return runWithEventMerging((resolve) => {
			store.add(target.onRefresh.event(actuals => {
				assert.deepStrictEqual(['0/0:a', '0/0:b'], Object.keys(actuals));
				resolve();
			}));

			onDidChangeTreeNode.fire(getNode('a'));
			onDidChangeTreeNode.fire(getNode('b'));
			onDidChangeTreeNode.fire(getNode('b'));
			onDidChangeTreeNode.fire(getNode('a'));
		});
	});

	test('refresh calls are throttled on unknown elements', () => {
		return runWithEventMerging((resolve) => {
			store.add(target.onRefresh.event(actuals => {
				assert.deepStrictEqual(['0/0:a', '0/0:b'], Object.keys(actuals));
				resolve();
			}));

			onDidChangeTreeNode.fire(getNode('a'));
			onDidChangeTreeNode.fire(getNode('b'));
			onDidChangeTreeNode.fire(getNode('g'));
			onDidChangeTreeNode.fire(getNode('a'));
		});
	});

	test('refresh calls are throttled on unknown elements and root', () => {
		return runWithEventMerging((resolve) => {
			store.add(target.onRefresh.event(actuals => {
				assert.strictEqual(undefined, actuals);
				resolve();
			}));

			onDidChangeTreeNode.fire(getNode('a'));
			onDidChangeTreeNode.fire(getNode('b'));
			onDidChangeTreeNode.fire(getNode('g'));
			onDidChangeTreeNode.fire(undefined);
		});
	});

	test('refresh calls are throttled on elements and root', () => {
		return runWithEventMerging((resolve) => {
			store.add(target.onRefresh.event(actuals => {
				assert.strictEqual(undefined, actuals);
				resolve();
			}));

			onDidChangeTreeNode.fire(getNode('a'));
			onDidChangeTreeNode.fire(getNode('b'));
			onDidChangeTreeNode.fire(undefined);
			onDidChangeTreeNode.fire(getNode('a'));
		});
	});

	test('generate unique handles from labels by escaping them', (done) => {
		tree = {
			'a/0:b': {}
		};

		store.add(target.onRefresh.event(() => {
			testObject.$getChildren('testNodeTreeProvider')
				.then(elements => {
					assert.deepStrictEqual(unBatchChildren(elements)?.map(e => e.handle), ['0/0:a//0:b']);
					done();
				});
		}));
		onDidChangeTreeNode.fire(undefined);
	});

	test('tree with duplicate labels', (done) => {

		const dupItems = {
			'adup1': 'c',
			'adup2': 'g',
			'bdup1': 'e',
			'hdup1': 'i',
			'hdup2': 'l',
			'jdup1': 'k'
		};

		labels['c'] = 'a';
		labels['e'] = 'b';
		labels['g'] = 'a';
		labels['i'] = 'h';
		labels['l'] = 'h';
		labels['k'] = 'j';

		tree[dupItems['adup1']] = {};
		tree['d'] = {};

		const bdup1Tree: { [key: string]: any } = {};
		bdup1Tree['h'] = {};
		bdup1Tree[dupItems['hdup1']] = {};
		bdup1Tree['j'] = {};
		bdup1Tree[dupItems['jdup1']] = {};
		bdup1Tree[dupItems['hdup2']] = {};

		tree[dupItems['bdup1']] = bdup1Tree;
		tree['f'] = {};
		tree[dupItems['adup2']] = {};

		store.add(target.onRefresh.event(() => {
			testObject.$getChildren('testNodeTreeProvider')
				.then(elements => {
					const actuals = unBatchChildren(elements)?.map(e => e.handle);
					assert.deepStrictEqual(actuals, ['0/0:a', '0/0:b', '0/1:a', '0/0:d', '0/1:b', '0/0:f', '0/2:a']);
					return testObject.$getChildren('testNodeTreeProvider', ['0/1:b'])
						.then(elements => {
							const actuals = unBatchChildren(elements)?.map(e => e.handle);
							assert.deepStrictEqual(actuals, ['0/1:b/0:h', '0/1:b/1:h', '0/1:b/0:j', '0/1:b/1:j', '0/1:b/2:h']);
							done();
						});
				});
		}));

		onDidChangeTreeNode.fire(undefined);
	});

	test('getChildren is not returned from cache if refreshed', (done) => {
		tree = {
			'c': {}
		};

		store.add(target.onRefresh.event(() => {
			testObject.$getChildren('testNodeTreeProvider')
				.then(elements => {
					assert.deepStrictEqual(unBatchChildren(elements)?.map(e => e.handle), ['0/0:c']);
					done();
				});
		}));

		onDidChangeTreeNode.fire(undefined);
	});

	test('getChildren is returned from cache if not refreshed', () => {
		tree = {
			'c': {}
		};

		return testObject.$getChildren('testNodeTreeProvider')
			.then(elements => {
				assert.deepStrictEqual(unBatchChildren(elements)?.map(e => e.handle), ['0/0:a', '0/0:b']);
			});
	});

	test('reveal will throw an error if getParent is not implemented', () => {
		const treeView = testObject.createTreeView('treeDataProvider', { treeDataProvider: aNodeTreeDataProvider() }, extensionsDescription);
		return treeView.reveal({ key: 'a' })
			.then(() => assert.fail('Reveal should throw an error as getParent is not implemented'), () => null);
	});

	test('reveal will return empty array for root element', () => {
		const revealTarget = sinon.spy(target, '$reveal');
		const treeView = testObject.createTreeView('treeDataProvider', { treeDataProvider: aCompleteNodeTreeDataProvider() }, extensionsDescription);
		const expected = {
			item:
				{ handle: '0/0:a', label: { label: 'a' }, collapsibleState: TreeItemCollapsibleState.Collapsed },
			parentChain: []
		};
		return treeView.reveal({ key: 'a' })
			.then(() => {
				assert.ok(revealTarget.calledOnce);
				assert.deepStrictEqual('treeDataProvider', revealTarget.args[0][0]);
				assert.deepStrictEqual(expected, removeUnsetKeys(revealTarget.args[0][1]));
				assert.deepStrictEqual({ select: true, focus: false, expand: false }, revealTarget.args[0][2]);
			});
	});

	test('reveal will return parents array for an element when hierarchy is not loaded', () => {
		const revealTarget = sinon.spy(target, '$reveal');
		const treeView = testObject.createTreeView('treeDataProvider', { treeDataProvider: aCompleteNodeTreeDataProvider() }, extensionsDescription);
		const expected = {
			item: { handle: '0/0:a/0:aa', label: { label: 'aa' }, collapsibleState: TreeItemCollapsibleState.None, parentHandle: '0/0:a' },
			parentChain: [{ handle: '0/0:a', label: { label: 'a' }, collapsibleState: TreeItemCollapsibleState.Collapsed }]
		};
		return treeView.reveal({ key: 'aa' })
			.then(() => {
				assert.ok(revealTarget.calledOnce);
				assert.deepStrictEqual('treeDataProvider', revealTarget.args[0][0]);
				assert.deepStrictEqual(expected.item, removeUnsetKeys(revealTarget.args[0][1]!.item));
				assert.deepStrictEqual(expected.parentChain, (<Array<any>>(revealTarget.args[0][1]!.parentChain)).map(arg => removeUnsetKeys(arg)));
				assert.deepStrictEqual({ select: true, focus: false, expand: false }, revealTarget.args[0][2]);
			});
	});

	test('reveal will return parents array for an element when hierarchy is loaded', () => {
		const revealTarget = sinon.spy(target, '$reveal');
		const treeView = testObject.createTreeView('treeDataProvider', { treeDataProvider: aCompleteNodeTreeDataProvider() }, extensionsDescription);
		const expected = {
			item: { handle: '0/0:a/0:aa', label: { label: 'aa' }, collapsibleState: TreeItemCollapsibleState.None, parentHandle: '0/0:a' },
			parentChain: [{ handle: '0/0:a', label: { label: 'a' }, collapsibleState: TreeItemCollapsibleState.Collapsed }]
		};
		return testObject.$getChildren('treeDataProvider')
			.then(() => testObject.$getChildren('treeDataProvider', ['0/0:a']))
			.then(() => treeView.reveal({ key: 'aa' })
				.then(() => {
					assert.ok(revealTarget.calledOnce);
					assert.deepStrictEqual('treeDataProvider', revealTarget.args[0][0]);
					assert.deepStrictEqual(expected.item, removeUnsetKeys(revealTarget.args[0][1]!.item));
					assert.deepStrictEqual(expected.parentChain, (<Array<any>>(revealTarget.args[0][1]!.parentChain)).map(arg => removeUnsetKeys(arg)));
					assert.deepStrictEqual({ select: true, focus: false, expand: false }, revealTarget.args[0][2]);
				}));
	});

	test('reveal will return parents array for deeper element with no selection', () => {
		tree = {
			'b': {
				'ba': {
					'bac': {}
				}
			}
		};
		const revealTarget = sinon.spy(target, '$reveal');
		const treeView = testObject.createTreeView('treeDataProvider', { treeDataProvider: aCompleteNodeTreeDataProvider() }, extensionsDescription);
		const expected = {
			item: { handle: '0/0:b/0:ba/0:bac', label: { label: 'bac' }, collapsibleState: TreeItemCollapsibleState.None, parentHandle: '0/0:b/0:ba' },
			parentChain: [
				{ handle: '0/0:b', label: { label: 'b' }, collapsibleState: TreeItemCollapsibleState.Collapsed },
				{ handle: '0/0:b/0:ba', label: { label: 'ba' }, collapsibleState: TreeItemCollapsibleState.Collapsed, parentHandle: '0/0:b' }
			]
		};
		return treeView.reveal({ key: 'bac' }, { select: false, focus: false, expand: false })
			.then(() => {
				assert.ok(revealTarget.calledOnce);
				assert.deepStrictEqual('treeDataProvider', revealTarget.args[0][0]);
				assert.deepStrictEqual(expected.item, removeUnsetKeys(revealTarget.args[0][1]!.item));
				assert.deepStrictEqual(expected.parentChain, (<Array<any>>(revealTarget.args[0][1]!.parentChain)).map(arg => removeUnsetKeys(arg)));
				assert.deepStrictEqual({ select: false, focus: false, expand: false }, revealTarget.args[0][2]);
			});
	});

	test('reveal after first udpate', () => {
		const revealTarget = sinon.spy(target, '$reveal');
		const treeView = testObject.createTreeView('treeDataProvider', { treeDataProvider: aCompleteNodeTreeDataProvider() }, extensionsDescription);
		const expected = {
			item: { handle: '0/0:a/0:ac', label: { label: 'ac' }, collapsibleState: TreeItemCollapsibleState.None, parentHandle: '0/0:a' },
			parentChain: [{ handle: '0/0:a', label: { label: 'a' }, collapsibleState: TreeItemCollapsibleState.Collapsed }]
		};
		return loadCompleteTree('treeDataProvider')
			.then(() => {
				tree = {
					'a': {
						'aa': {},
						'ac': {}
					},
					'b': {
						'ba': {},
						'bb': {}
					}
				};
				onDidChangeTreeNode.fire(getNode('a'));

				return treeView.reveal({ key: 'ac' })
					.then(() => {
						assert.ok(revealTarget.calledOnce);
						assert.deepStrictEqual('treeDataProvider', revealTarget.args[0][0]);
						assert.deepStrictEqual(expected.item, removeUnsetKeys(revealTarget.args[0][1]!.item));
						assert.deepStrictEqual(expected.parentChain, (<Array<any>>(revealTarget.args[0][1]!.parentChain)).map(arg => removeUnsetKeys(arg)));
						assert.deepStrictEqual({ select: true, focus: false, expand: false }, revealTarget.args[0][2]);
					});
			});
	});

	test('reveal after second udpate', () => {
		const revealTarget = sinon.spy(target, '$reveal');
		const treeView = testObject.createTreeView('treeDataProvider', { treeDataProvider: aCompleteNodeTreeDataProvider() }, extensionsDescription);
		return loadCompleteTree('treeDataProvider')
			.then(() => {
				return runWithEventMerging((resolve) => {
					tree = {
						'a': {
							'aa': {},
							'ac': {}
						},
						'b': {
							'ba': {},
							'bb': {}
						}
					};
					onDidChangeTreeNode.fire(getNode('a'));
					tree = {
						'a': {
							'aa': {},
							'ac': {}
						},
						'b': {
							'ba': {},
							'bc': {}
						}
					};
					onDidChangeTreeNode.fire(getNode('b'));
					resolve();
				}).then(() => {
					return treeView.reveal({ key: 'bc' })
						.then(() => {
							assert.ok(revealTarget.calledOnce);
							assert.deepStrictEqual('treeDataProvider', revealTarget.args[0][0]);
							assert.deepStrictEqual({ handle: '0/0:b/0:bc', label: { label: 'bc' }, collapsibleState: TreeItemCollapsibleState.None, parentHandle: '0/0:b' }, removeUnsetKeys(revealTarget.args[0][1]!.item));
							assert.deepStrictEqual([{ handle: '0/0:b', label: { label: 'b' }, collapsibleState: TreeItemCollapsibleState.Collapsed }], (<Array<any>>revealTarget.args[0][1]!.parentChain).map(arg => removeUnsetKeys(arg)));
							assert.deepStrictEqual({ select: true, focus: false, expand: false }, revealTarget.args[0][2]);
						});
				});
			});
	});

	function loadCompleteTree(treeId: string, element?: string): Promise<null> {
		return testObject.$getChildren(treeId, element ? [element] : undefined)
			.then(elements => {
				if (!elements || elements?.length === 0) {
					return null;
				}
				return elements[0].slice(1).map(e => loadCompleteTree(treeId, (e as ITreeItem).handle));
			})
			.then(() => null);
	}

	function removeUnsetKeys(obj: any): any {
		if (Array.isArray(obj)) {
			return obj.map(o => removeUnsetKeys(o));
		}

		if (typeof obj === 'object') {
			const result: { [key: string]: any } = {};
			for (const key of Object.keys(obj)) {
				if (obj[key] !== undefined) {
					result[key] = removeUnsetKeys(obj[key]);
				}
			}
			return result;
		}
		return obj;
	}

	function aNodeTreeDataProvider(): TreeDataProvider<{ key: string }> {
		return {
			getChildren: (element: { key: string }): { key: string }[] => {
				return getChildren(element ? element.key : undefined).map(key => getNode(key));
			},
			getTreeItem: (element: { key: string }): TreeItem => {
				return getTreeItem(element.key);
			},
			onDidChangeTreeData: onDidChangeTreeNode.event
		};
	}

	function aCompleteNodeTreeDataProvider(): TreeDataProvider<{ key: string }> {
		return {
			getChildren: (element: { key: string }): { key: string }[] => {
				return getChildren(element ? element.key : undefined).map(key => getNode(key));
			},
			getTreeItem: (element: { key: string }): TreeItem => {
				return getTreeItem(element.key);
			},
			getParent: ({ key }: { key: string }): { key: string } | undefined => {
				const parentKey = key.substring(0, key.length - 1);
				return parentKey ? new Key(parentKey) : undefined;
			},
			onDidChangeTreeData: onDidChangeTreeNode.event
		};
	}

	function aNodeWithIdTreeDataProvider(): TreeDataProvider<{ key: string }> {
		return {
			getChildren: (element: { key: string }): { key: string }[] => {
				return getChildren(element ? element.key : undefined).map(key => getNode(key));
			},
			getTreeItem: (element: { key: string }): TreeItem => {
				const treeItem = getTreeItem(element.key);
				treeItem.id = element.key;
				return treeItem;
			},
			onDidChangeTreeData: onDidChangeTreeNodeWithId.event
		};
	}

	function aNodeWithHighlightedLabelTreeDataProvider(): TreeDataProvider<{ key: string }> {
		return {
			getChildren: (element: { key: string }): { key: string }[] => {
				return getChildren(element ? element.key : undefined).map(key => getNode(key));
			},
			getTreeItem: (element: { key: string }): TreeItem => {
				const treeItem = getTreeItem(element.key, [[0, 2], [3, 5]]);
				treeItem.id = element.key;
				return treeItem;
			},
			onDidChangeTreeData: onDidChangeTreeNodeWithId.event
		};
	}

	function getTreeElement(element: string): any {
		let parent = tree;
		for (let i = 0; i < element.length; i++) {
			parent = parent[element.substring(0, i + 1)];
			if (!parent) {
				return null;
			}
		}
		return parent;
	}

	function getChildren(key: string | undefined): string[] {
		if (!key) {
			return Object.keys(tree);
		}
		const treeElement = getTreeElement(key);
		if (treeElement) {
			return Object.keys(treeElement);
		}
		return [];
	}

	function getTreeItem(key: string, highlights?: [number, number][]): TreeItem {
		const treeElement = getTreeElement(key);
		return {
			label: { label: labels[key] || key, highlights },
			collapsibleState: treeElement && Object.keys(treeElement).length ? TreeItemCollapsibleState.Collapsed : TreeItemCollapsibleState.None
		};
	}

	function getNode(key: string): { key: string } {
		if (!nodes[key]) {
			nodes[key] = new Key(key);
		}
		return nodes[key];
	}

	class Key {
		constructor(readonly key: string) { }
	}

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/test/browser/extHostTypeConverter.test.ts]---
Location: vscode-main/src/vs/workbench/api/test/browser/extHostTypeConverter.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


import assert from 'assert';
import * as extHostTypes from '../../common/extHostTypes.js';
import { MarkdownString, NotebookCellOutputItem, NotebookData, LanguageSelector, WorkspaceEdit } from '../../common/extHostTypeConverters.js';
import { isEmptyObject } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { IWorkspaceTextEditDto } from '../../common/extHost.protocol.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';

suite('ExtHostTypeConverter', function () {

	ensureNoDisposablesAreLeakedInTestSuite();

	function size<T>(from: Record<any, any>): number {
		let count = 0;
		for (const key in from) {
			if (Object.prototype.hasOwnProperty.call(from, key)) {
				count += 1;
			}
		}
		return count;
	}

	test('MarkdownConvert - uris', function () {

		let data = MarkdownString.from('Hello');
		assert.strictEqual(isEmptyObject(data.uris), true);
		assert.strictEqual(data.value, 'Hello');

		data = MarkdownString.from('Hello [link](foo)');
		assert.strictEqual(data.value, 'Hello [link](foo)');
		assert.strictEqual(isEmptyObject(data.uris), true); // no scheme, no uri

		data = MarkdownString.from('Hello [link](www.noscheme.bad)');
		assert.strictEqual(data.value, 'Hello [link](www.noscheme.bad)');
		assert.strictEqual(isEmptyObject(data.uris), true); // no scheme, no uri

		data = MarkdownString.from('Hello [link](foo:path)');
		assert.strictEqual(data.value, 'Hello [link](foo:path)');
		assert.strictEqual(size(data.uris!), 1);
		assert.ok(!!data.uris!['foo:path']);

		data = MarkdownString.from('hello@foo.bar');
		assert.strictEqual(data.value, 'hello@foo.bar');
		assert.strictEqual(size(data.uris!), 1);
		// assert.ok(!!data.uris!['mailto:hello@foo.bar']);

		data = MarkdownString.from('*hello* [click](command:me)');
		assert.strictEqual(data.value, '*hello* [click](command:me)');
		assert.strictEqual(size(data.uris!), 1);
		assert.ok(!!data.uris!['command:me']);

		data = MarkdownString.from('*hello* [click](file:///somepath/here). [click](file:///somepath/here)');
		assert.strictEqual(data.value, '*hello* [click](file:///somepath/here). [click](file:///somepath/here)');
		assert.strictEqual(size(data.uris!), 1);
		assert.ok(!!data.uris!['file:///somepath/here']);

		data = MarkdownString.from('*hello* [click](file:///somepath/here). [click](file:///somepath/here)');
		assert.strictEqual(data.value, '*hello* [click](file:///somepath/here). [click](file:///somepath/here)');
		assert.strictEqual(size(data.uris!), 1);
		assert.ok(!!data.uris!['file:///somepath/here']);

		data = MarkdownString.from('*hello* [click](file:///somepath/here). [click](file:///somepath/here2)');
		assert.strictEqual(data.value, '*hello* [click](file:///somepath/here). [click](file:///somepath/here2)');
		assert.strictEqual(size(data.uris!), 2);
		assert.ok(!!data.uris!['file:///somepath/here']);
		assert.ok(!!data.uris!['file:///somepath/here2']);
	});

	test('NPM script explorer running a script from the hover does not work #65561', function () {

		const data = MarkdownString.from('*hello* [click](command:npm.runScriptFromHover?%7B%22documentUri%22%3A%7B%22%24mid%22%3A1%2C%22external%22%3A%22file%3A%2F%2F%2Fc%253A%2Ffoo%2Fbaz.ex%22%2C%22path%22%3A%22%2Fc%3A%2Ffoo%2Fbaz.ex%22%2C%22scheme%22%3A%22file%22%7D%2C%22script%22%3A%22dev%22%7D)');
		// assert that both uri get extracted but that the latter is only decoded once...
		assert.strictEqual(size(data.uris!), 2);
		for (const value of Object.values(data.uris!)) {
			if (value.scheme === 'file') {
				assert.ok(URI.revive(value).toString().indexOf('file:///c%3A') === 0);
			} else {
				assert.strictEqual(value.scheme, 'command');
			}
		}
	});

	test('Notebook metadata is ignored when using Notebook Serializer #125716', function () {

		const d = new extHostTypes.NotebookData([]);
		d.cells.push(new extHostTypes.NotebookCellData(extHostTypes.NotebookCellKind.Code, 'hello', 'fooLang'));
		d.metadata = { foo: 'bar', bar: 123 };

		const dto = NotebookData.from(d);

		assert.strictEqual(dto.cells.length, 1);
		assert.strictEqual(dto.cells[0].language, 'fooLang');
		assert.strictEqual(dto.cells[0].source, 'hello');
		assert.deepStrictEqual(dto.metadata, d.metadata);
	});

	test('NotebookCellOutputItem', function () {

		const item = extHostTypes.NotebookCellOutputItem.text('Hello', 'foo/bar');

		const dto = NotebookCellOutputItem.from(item);

		assert.strictEqual(dto.mime, 'foo/bar');
		assert.deepStrictEqual(Array.from(dto.valueBytes.buffer), Array.from(new TextEncoder().encode('Hello')));

		const item2 = NotebookCellOutputItem.to(dto);

		assert.strictEqual(item2.mime, item.mime);
		assert.deepStrictEqual(Array.from(item2.data), Array.from(item.data));
	});

	test('LanguageSelector', function () {
		const out = LanguageSelector.from({ language: 'bat', notebookType: 'xxx' });
		assert.ok(typeof out === 'object');
		assert.deepStrictEqual(out, {
			language: 'bat',
			notebookType: 'xxx',
			scheme: undefined,
			pattern: undefined,
			exclusive: undefined,
		});
	});

	test('JS/TS Surround With Code Actions provide bad Workspace Edits when obtained by VSCode Command API #178654', function () {

		const uri = URI.parse('file:///foo/bar');
		const ws = new extHostTypes.WorkspaceEdit();
		ws.set(uri, [extHostTypes.SnippetTextEdit.insert(new extHostTypes.Position(1, 1), new extHostTypes.SnippetString('foo$0bar'))]);

		const dto = WorkspaceEdit.from(ws);
		const first = <IWorkspaceTextEditDto>dto.edits[0];
		assert.strictEqual(first.textEdit.insertAsSnippet, true);

		const ws2 = WorkspaceEdit.to(dto);
		const dto2 = WorkspaceEdit.from(ws2);
		const first2 = <IWorkspaceTextEditDto>dto2.edits[0];
		assert.strictEqual(first2.textEdit.insertAsSnippet, true);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/test/browser/extHostTypes.test.ts]---
Location: vscode-main/src/vs/workbench/api/test/browser/extHostTypes.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { URI } from '../../../../base/common/uri.js';
import * as types from '../../common/extHostTypes.js';
import { isWindows } from '../../../../base/common/platform.js';
import { assertType } from '../../../../base/common/types.js';
import { Mimes } from '../../../../base/common/mime.js';
import { MarshalledId } from '../../../../base/common/marshallingIds.js';
import { CancellationError } from '../../../../base/common/errors.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';

function assertToJSON(a: any, expected: any) {
	const raw = JSON.stringify(a);
	const actual = JSON.parse(raw);
	assert.deepStrictEqual(actual, expected);
}

suite('ExtHostTypes', function () {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('URI, toJSON', function () {

		const uri = URI.parse('file:///path/test.file');
		assert.deepStrictEqual(uri.toJSON(), {
			$mid: MarshalledId.Uri,
			scheme: 'file',
			path: '/path/test.file'
		});

		assert.ok(uri.fsPath);
		assert.deepStrictEqual(uri.toJSON(), {
			$mid: MarshalledId.Uri,
			scheme: 'file',
			path: '/path/test.file',
			fsPath: '/path/test.file'.replace(/\//g, isWindows ? '\\' : '/'),
			_sep: isWindows ? 1 : undefined,
		});

		assert.ok(uri.toString());
		assert.deepStrictEqual(uri.toJSON(), {
			$mid: MarshalledId.Uri,
			scheme: 'file',
			path: '/path/test.file',
			fsPath: '/path/test.file'.replace(/\//g, isWindows ? '\\' : '/'),
			_sep: isWindows ? 1 : undefined,
			external: 'file:///path/test.file'
		});
	});

	test('Disposable', () => {

		let count = 0;
		const d = new types.Disposable(() => {
			count += 1;
			return 12;
		});
		d.dispose();
		assert.strictEqual(count, 1);

		d.dispose();
		assert.strictEqual(count, 1);

		types.Disposable.from(undefined!, { dispose() { count += 1; } }).dispose();
		assert.strictEqual(count, 2);


		assert.throws(() => {
			new types.Disposable(() => {
				throw new Error();
			}).dispose();
		});

		new types.Disposable(undefined!).dispose();

	});

	test('Position', () => {
		assert.throws(() => new types.Position(-1, 0));
		assert.throws(() => new types.Position(0, -1));

		const pos = new types.Position(0, 0);
		// eslint-disable-next-line local/code-no-any-casts
		assert.throws(() => (pos as any).line = -1);
		// eslint-disable-next-line local/code-no-any-casts
		assert.throws(() => (pos as any).character = -1);
		// eslint-disable-next-line local/code-no-any-casts
		assert.throws(() => (pos as any).line = 12);

		const { line, character } = pos.toJSON();
		assert.strictEqual(line, 0);
		assert.strictEqual(character, 0);
	});

	test('Position, toJSON', function () {
		const pos = new types.Position(4, 2);
		assertToJSON(pos, { line: 4, character: 2 });
	});

	test('Position, isBefore(OrEqual)?', function () {
		const p1 = new types.Position(1, 3);
		const p2 = new types.Position(1, 2);
		const p3 = new types.Position(0, 4);

		assert.ok(p1.isBeforeOrEqual(p1));
		assert.ok(!p1.isBefore(p1));
		assert.ok(p2.isBefore(p1));
		assert.ok(p3.isBefore(p2));
	});

	test('Position, isAfter(OrEqual)?', function () {
		const p1 = new types.Position(1, 3);
		const p2 = new types.Position(1, 2);
		const p3 = new types.Position(0, 4);

		assert.ok(p1.isAfterOrEqual(p1));
		assert.ok(!p1.isAfter(p1));
		assert.ok(p1.isAfter(p2));
		assert.ok(p2.isAfter(p3));
		assert.ok(p1.isAfter(p3));
	});

	test('Position, compareTo', function () {
		const p1 = new types.Position(1, 3);
		const p2 = new types.Position(1, 2);
		const p3 = new types.Position(0, 4);

		assert.strictEqual(p1.compareTo(p1), 0);
		assert.strictEqual(p2.compareTo(p1), -1);
		assert.strictEqual(p1.compareTo(p2), 1);
		assert.strictEqual(p2.compareTo(p3), 1);
		assert.strictEqual(p1.compareTo(p3), 1);
	});

	test('Position, translate', function () {
		const p1 = new types.Position(1, 3);

		assert.ok(p1.translate() === p1);
		assert.ok(p1.translate({}) === p1);
		assert.ok(p1.translate(0, 0) === p1);
		assert.ok(p1.translate(0) === p1);
		assert.ok(p1.translate(undefined, 0) === p1);
		assert.ok(p1.translate(undefined) === p1);

		let res = p1.translate(-1);
		assert.strictEqual(res.line, 0);
		assert.strictEqual(res.character, 3);

		res = p1.translate({ lineDelta: -1 });
		assert.strictEqual(res.line, 0);
		assert.strictEqual(res.character, 3);

		res = p1.translate(undefined, -1);
		assert.strictEqual(res.line, 1);
		assert.strictEqual(res.character, 2);

		res = p1.translate({ characterDelta: -1 });
		assert.strictEqual(res.line, 1);
		assert.strictEqual(res.character, 2);

		res = p1.translate(11);
		assert.strictEqual(res.line, 12);
		assert.strictEqual(res.character, 3);

		assert.throws(() => p1.translate(null!));
		assert.throws(() => p1.translate(null!, null!));
		assert.throws(() => p1.translate(-2));
		assert.throws(() => p1.translate({ lineDelta: -2 }));
		assert.throws(() => p1.translate(-2, null!));
		assert.throws(() => p1.translate(0, -4));
	});

	test('Position, with', function () {
		const p1 = new types.Position(1, 3);

		assert.ok(p1.with() === p1);
		assert.ok(p1.with(1) === p1);
		assert.ok(p1.with(undefined, 3) === p1);
		assert.ok(p1.with(1, 3) === p1);
		assert.ok(p1.with(undefined) === p1);
		assert.ok(p1.with({ line: 1 }) === p1);
		assert.ok(p1.with({ character: 3 }) === p1);
		assert.ok(p1.with({ line: 1, character: 3 }) === p1);

		const p2 = p1.with({ line: 0, character: 11 });
		assert.strictEqual(p2.line, 0);
		assert.strictEqual(p2.character, 11);

		assert.throws(() => p1.with(null!));
		assert.throws(() => p1.with(-9));
		assert.throws(() => p1.with(0, -9));
		assert.throws(() => p1.with({ line: -1 }));
		assert.throws(() => p1.with({ character: -1 }));
	});

	test('Range', () => {
		assert.throws(() => new types.Range(-1, 0, 0, 0));
		assert.throws(() => new types.Range(0, -1, 0, 0));
		assert.throws(() => new types.Range(new types.Position(0, 0), undefined!));
		assert.throws(() => new types.Range(new types.Position(0, 0), null!));
		assert.throws(() => new types.Range(undefined!, new types.Position(0, 0)));
		assert.throws(() => new types.Range(null!, new types.Position(0, 0)));

		const range = new types.Range(1, 0, 0, 0);
		// eslint-disable-next-line local/code-no-any-casts
		assert.throws(() => { (range as any).start = null; });
		// eslint-disable-next-line local/code-no-any-casts
		assert.throws(() => { (range as any).start = new types.Position(0, 3); });
	});

	test('Range, toJSON', function () {

		const range = new types.Range(1, 2, 3, 4);
		assertToJSON(range, [{ line: 1, character: 2 }, { line: 3, character: 4 }]);
	});

	test('Range, sorting', function () {
		// sorts start/end
		let range = new types.Range(1, 0, 0, 0);
		assert.strictEqual(range.start.line, 0);
		assert.strictEqual(range.end.line, 1);

		range = new types.Range(0, 0, 1, 0);
		assert.strictEqual(range.start.line, 0);
		assert.strictEqual(range.end.line, 1);
	});

	test('Range, isEmpty|isSingleLine', function () {
		let range = new types.Range(1, 0, 0, 0);
		assert.ok(!range.isEmpty);
		assert.ok(!range.isSingleLine);

		range = new types.Range(1, 1, 1, 1);
		assert.ok(range.isEmpty);
		assert.ok(range.isSingleLine);

		range = new types.Range(0, 1, 0, 11);
		assert.ok(!range.isEmpty);
		assert.ok(range.isSingleLine);

		range = new types.Range(0, 0, 1, 1);
		assert.ok(!range.isEmpty);
		assert.ok(!range.isSingleLine);
	});

	test('Range, contains', function () {
		const range = new types.Range(1, 1, 2, 11);

		assert.ok(range.contains(range.start));
		assert.ok(range.contains(range.end));
		assert.ok(range.contains(range));

		assert.ok(!range.contains(new types.Range(1, 0, 2, 11)));
		assert.ok(!range.contains(new types.Range(0, 1, 2, 11)));
		assert.ok(!range.contains(new types.Range(1, 1, 2, 12)));
		assert.ok(!range.contains(new types.Range(1, 1, 3, 11)));
	});

	test('Range, contains (no instanceof)', function () {
		const range = new types.Range(1, 1, 2, 11);

		const startLike = { line: range.start.line, character: range.start.character };
		const endLike = { line: range.end.line, character: range.end.character };
		const rangeLike = { start: startLike, end: endLike };

		assert.ok(range.contains((<types.Position>startLike)));
		assert.ok(range.contains((<types.Position>endLike)));
		assert.ok(range.contains((<types.Range>rangeLike)));
	});

	test('Range, intersection', function () {
		const range = new types.Range(1, 1, 2, 11);
		let res: types.Range;

		res = range.intersection(range)!;
		assert.strictEqual(res.start.line, 1);
		assert.strictEqual(res.start.character, 1);
		assert.strictEqual(res.end.line, 2);
		assert.strictEqual(res.end.character, 11);

		res = range.intersection(new types.Range(2, 12, 4, 0))!;
		assert.strictEqual(res, undefined);

		res = range.intersection(new types.Range(0, 0, 1, 0))!;
		assert.strictEqual(res, undefined);

		res = range.intersection(new types.Range(0, 0, 1, 1))!;
		assert.ok(res.isEmpty);
		assert.strictEqual(res.start.line, 1);
		assert.strictEqual(res.start.character, 1);

		res = range.intersection(new types.Range(2, 11, 61, 1))!;
		assert.ok(res.isEmpty);
		assert.strictEqual(res.start.line, 2);
		assert.strictEqual(res.start.character, 11);

		assert.throws(() => range.intersection(null!));
		assert.throws(() => range.intersection(undefined!));
	});

	test('Range, union', function () {
		let ran1 = new types.Range(0, 0, 5, 5);
		assert.ok(ran1.union(new types.Range(0, 0, 1, 1)) === ran1);

		let res: types.Range;
		res = ran1.union(new types.Range(2, 2, 9, 9));
		assert.ok(res.start === ran1.start);
		assert.strictEqual(res.end.line, 9);
		assert.strictEqual(res.end.character, 9);

		ran1 = new types.Range(2, 1, 5, 3);
		res = ran1.union(new types.Range(1, 0, 4, 2));
		assert.ok(res.end === ran1.end);
		assert.strictEqual(res.start.line, 1);
		assert.strictEqual(res.start.character, 0);
	});

	test('Range, with', function () {
		const range = new types.Range(1, 1, 2, 11);

		assert.ok(range.with(range.start) === range);
		assert.ok(range.with(undefined, range.end) === range);
		assert.ok(range.with(range.start, range.end) === range);
		assert.ok(range.with(new types.Position(1, 1)) === range);
		assert.ok(range.with(undefined, new types.Position(2, 11)) === range);
		assert.ok(range.with() === range);
		assert.ok(range.with({ start: range.start }) === range);
		assert.ok(range.with({ start: new types.Position(1, 1) }) === range);
		assert.ok(range.with({ end: range.end }) === range);
		assert.ok(range.with({ end: new types.Position(2, 11) }) === range);

		let res = range.with(undefined, new types.Position(9, 8));
		assert.strictEqual(res.end.line, 9);
		assert.strictEqual(res.end.character, 8);
		assert.strictEqual(res.start.line, 1);
		assert.strictEqual(res.start.character, 1);

		res = range.with({ end: new types.Position(9, 8) });
		assert.strictEqual(res.end.line, 9);
		assert.strictEqual(res.end.character, 8);
		assert.strictEqual(res.start.line, 1);
		assert.strictEqual(res.start.character, 1);

		res = range.with({ end: new types.Position(9, 8), start: new types.Position(2, 3) });
		assert.strictEqual(res.end.line, 9);
		assert.strictEqual(res.end.character, 8);
		assert.strictEqual(res.start.line, 2);
		assert.strictEqual(res.start.character, 3);

		assert.throws(() => range.with(null!));
		assert.throws(() => range.with(undefined, null!));
	});

	test('TextEdit', () => {

		const range = new types.Range(1, 1, 2, 11);
		let edit = new types.TextEdit(range, undefined!);
		assert.strictEqual(edit.newText, '');
		assertToJSON(edit, { range: [{ line: 1, character: 1 }, { line: 2, character: 11 }], newText: '' });

		edit = new types.TextEdit(range, null);
		assert.strictEqual(edit.newText, '');

		edit = new types.TextEdit(range, '');
		assert.strictEqual(edit.newText, '');
	});

	test('WorkspaceEdit', () => {

		const a = URI.file('a.ts');
		const b = URI.file('b.ts');

		const edit = new types.WorkspaceEdit();
		assert.ok(!edit.has(a));

		edit.set(a, [types.TextEdit.insert(new types.Position(0, 0), 'fff')]);
		assert.ok(edit.has(a));
		assert.strictEqual(edit.size, 1);
		assertToJSON(edit, [[a.toJSON(), [{ range: [{ line: 0, character: 0 }, { line: 0, character: 0 }], newText: 'fff' }]]]);

		edit.insert(b, new types.Position(1, 1), 'fff');
		edit.delete(b, new types.Range(0, 0, 0, 0));
		assert.ok(edit.has(b));
		assert.strictEqual(edit.size, 2);
		assertToJSON(edit, [
			[a.toJSON(), [{ range: [{ line: 0, character: 0 }, { line: 0, character: 0 }], newText: 'fff' }]],
			[b.toJSON(), [{ range: [{ line: 1, character: 1 }, { line: 1, character: 1 }], newText: 'fff' }, { range: [{ line: 0, character: 0 }, { line: 0, character: 0 }], newText: '' }]]
		]);

		edit.set(b, undefined!);
		assert.ok(!edit.has(b));
		assert.strictEqual(edit.size, 1);

		edit.set(b, [types.TextEdit.insert(new types.Position(0, 0), 'ffff')]);
		assert.strictEqual(edit.get(b).length, 1);
	});

	test('WorkspaceEdit - keep order of text and file changes', function () {

		const edit = new types.WorkspaceEdit();
		edit.replace(URI.parse('foo:a'), new types.Range(1, 1, 1, 1), 'foo');
		edit.renameFile(URI.parse('foo:a'), URI.parse('foo:b'));
		edit.replace(URI.parse('foo:a'), new types.Range(2, 1, 2, 1), 'bar');
		edit.replace(URI.parse('foo:b'), new types.Range(3, 1, 3, 1), 'bazz');

		const all = edit._allEntries();
		assert.strictEqual(all.length, 4);

		const [first, second, third, fourth] = all;
		assertType(first._type === types.FileEditType.Text);
		assert.strictEqual(first.uri.toString(), 'foo:a');

		assertType(second._type === types.FileEditType.File);
		assert.strictEqual(second.from!.toString(), 'foo:a');
		assert.strictEqual(second.to!.toString(), 'foo:b');

		assertType(third._type === types.FileEditType.Text);
		assert.strictEqual(third.uri.toString(), 'foo:a');

		assertType(fourth._type === types.FileEditType.Text);
		assert.strictEqual(fourth.uri.toString(), 'foo:b');
	});

	test('WorkspaceEdit - two edits for one resource', function () {
		const edit = new types.WorkspaceEdit();
		const uri = URI.parse('foo:bar');
		edit.insert(uri, new types.Position(0, 0), 'Hello');
		edit.insert(uri, new types.Position(0, 0), 'Foo');

		assert.strictEqual(edit._allEntries().length, 2);
		const [first, second] = edit._allEntries();

		assertType(first._type === types.FileEditType.Text);
		assertType(second._type === types.FileEditType.Text);
		assert.strictEqual(first.edit.newText, 'Hello');
		assert.strictEqual(second.edit.newText, 'Foo');
	});

	test('WorkspaceEdit - set with metadata accepts undefined', function () {
		const edit = new types.WorkspaceEdit();
		const uri = URI.parse('foo:bar');

		edit.set(uri, [
			[types.TextEdit.insert(new types.Position(0, 0), 'Hello'), { needsConfirmation: true, label: 'foo' }],
			[types.TextEdit.insert(new types.Position(0, 0), 'Hello'), undefined],
		]);

		const all = edit._allEntries();
		assert.strictEqual(all.length, 2);
		const [first, second] = all;
		assert.ok(first.metadata);
		assert.ok(!second.metadata);
	});

	test('DocumentLink', () => {
		assert.throws(() => new types.DocumentLink(null!, null!));
		assert.throws(() => new types.DocumentLink(new types.Range(1, 1, 1, 1), null!));
	});

	test('toJSON & stringify', function () {

		assertToJSON(new types.Selection(3, 4, 2, 1), { start: { line: 2, character: 1 }, end: { line: 3, character: 4 }, anchor: { line: 3, character: 4 }, active: { line: 2, character: 1 } });

		assertToJSON(new types.Location(URI.file('u.ts'), new types.Position(3, 4)), { uri: URI.parse('file:///u.ts').toJSON(), range: [{ line: 3, character: 4 }, { line: 3, character: 4 }] });
		assertToJSON(new types.Location(URI.file('u.ts'), new types.Range(1, 2, 3, 4)), { uri: URI.parse('file:///u.ts').toJSON(), range: [{ line: 1, character: 2 }, { line: 3, character: 4 }] });

		const diag = new types.Diagnostic(new types.Range(0, 1, 2, 3), 'hello');
		assertToJSON(diag, { severity: 'Error', message: 'hello', range: [{ line: 0, character: 1 }, { line: 2, character: 3 }] });
		diag.source = 'me';
		assertToJSON(diag, { severity: 'Error', message: 'hello', range: [{ line: 0, character: 1 }, { line: 2, character: 3 }], source: 'me' });

		assertToJSON(new types.DocumentHighlight(new types.Range(2, 3, 4, 5)), { range: [{ line: 2, character: 3 }, { line: 4, character: 5 }], kind: 'Text' });
		assertToJSON(new types.DocumentHighlight(new types.Range(2, 3, 4, 5), types.DocumentHighlightKind.Read), { range: [{ line: 2, character: 3 }, { line: 4, character: 5 }], kind: 'Read' });

		assertToJSON(new types.SymbolInformation('test', types.SymbolKind.Boolean, new types.Range(0, 1, 2, 3)), {
			name: 'test',
			kind: 'Boolean',
			location: {
				range: [{ line: 0, character: 1 }, { line: 2, character: 3 }]
			}
		});

		assertToJSON(new types.CodeLens(new types.Range(7, 8, 9, 10)), { range: [{ line: 7, character: 8 }, { line: 9, character: 10 }] });
		assertToJSON(new types.CodeLens(new types.Range(7, 8, 9, 10), { command: 'id', title: 'title' }), {
			range: [{ line: 7, character: 8 }, { line: 9, character: 10 }],
			command: { command: 'id', title: 'title' }
		});

		assertToJSON(new types.CompletionItem('complete'), { label: 'complete' });

		const item = new types.CompletionItem('complete');
		item.kind = types.CompletionItemKind.Interface;
		assertToJSON(item, { label: 'complete', kind: 'Interface' });

	});

	test('SymbolInformation, old ctor', function () {

		const info = new types.SymbolInformation('foo', types.SymbolKind.Array, new types.Range(1, 1, 2, 3));
		assert.ok(info.location instanceof types.Location);
		assert.strictEqual(info.location.uri, undefined);
	});

	test('SnippetString, builder-methods', function () {

		let string: types.SnippetString;

		string = new types.SnippetString();
		assert.strictEqual(string.appendText('I need $ and $').value, 'I need \\$ and \\$');

		string = new types.SnippetString();
		assert.strictEqual(string.appendText('I need \\$').value, 'I need \\\\\\$');

		string = new types.SnippetString();
		string.appendPlaceholder('fo$o}');
		assert.strictEqual(string.value, '${1:fo\\$o\\}}');

		string = new types.SnippetString();
		string.appendText('foo').appendTabstop(0).appendText('bar');
		assert.strictEqual(string.value, 'foo$0bar');

		string = new types.SnippetString();
		string.appendText('foo').appendTabstop().appendText('bar');
		assert.strictEqual(string.value, 'foo$1bar');

		string = new types.SnippetString();
		string.appendText('foo').appendTabstop(42).appendText('bar');
		assert.strictEqual(string.value, 'foo$42bar');

		string = new types.SnippetString();
		string.appendText('foo').appendPlaceholder('farboo').appendText('bar');
		assert.strictEqual(string.value, 'foo${1:farboo}bar');

		string = new types.SnippetString();
		string.appendText('foo').appendPlaceholder('far$boo').appendText('bar');
		assert.strictEqual(string.value, 'foo${1:far\\$boo}bar');

		string = new types.SnippetString();
		string.appendText('foo').appendPlaceholder(b => b.appendText('abc').appendPlaceholder('nested')).appendText('bar');
		assert.strictEqual(string.value, 'foo${1:abc${2:nested}}bar');

		string = new types.SnippetString();
		string.appendVariable('foo');
		assert.strictEqual(string.value, '${foo}');

		string = new types.SnippetString();
		string.appendText('foo').appendVariable('TM_SELECTED_TEXT').appendText('bar');
		assert.strictEqual(string.value, 'foo${TM_SELECTED_TEXT}bar');

		string = new types.SnippetString();
		string.appendVariable('BAR', b => b.appendPlaceholder('ops'));
		assert.strictEqual(string.value, '${BAR:${1:ops}}');

		string = new types.SnippetString();
		string.appendVariable('BAR', b => { });
		assert.strictEqual(string.value, '${BAR}');

		string = new types.SnippetString();
		string.appendChoice(['b', 'a', 'r']);
		assert.strictEqual(string.value, '${1|b,a,r|}');

		string = new types.SnippetString();
		string.appendChoice(['b,1', 'a,2', 'r,3']);
		assert.strictEqual(string.value, '${1|b\\,1,a\\,2,r\\,3|}');

		string = new types.SnippetString();
		string.appendChoice(['b', 'a', 'r'], 0);
		assert.strictEqual(string.value, '${0|b,a,r|}');

		string = new types.SnippetString();
		string.appendText('foo').appendChoice(['far', 'boo']).appendText('bar');
		assert.strictEqual(string.value, 'foo${1|far,boo|}bar');

		string = new types.SnippetString();
		string.appendText('foo').appendChoice(['far', '$boo']).appendText('bar');
		assert.strictEqual(string.value, 'foo${1|far,$boo|}bar');

		string = new types.SnippetString();
		string.appendText('foo').appendPlaceholder('farboo').appendChoice(['far', 'boo']).appendText('bar');
		assert.strictEqual(string.value, 'foo${1:farboo}${2|far,boo|}bar');
	});

	test('Snippet choices are incorrectly escaped/applied #180132', function () {
		{
			const s = new types.SnippetString();
			s.appendChoice(['aaa$aaa']);
			s.appendText('bbb$bbb');
			assert.strictEqual(s.value, '${1|aaa$aaa|}bbb\\$bbb');
		}
		{
			const s = new types.SnippetString();
			s.appendChoice(['aaa,aaa']);
			s.appendText('bbb$bbb');
			assert.strictEqual(s.value, '${1|aaa\\,aaa|}bbb\\$bbb');
		}
		{
			const s = new types.SnippetString();
			s.appendChoice(['aaa|aaa']);
			s.appendText('bbb$bbb');
			assert.strictEqual(s.value, '${1|aaa\\|aaa|}bbb\\$bbb');
		}
		{
			const s = new types.SnippetString();
			s.appendChoice(['aaa\\aaa']);
			s.appendText('bbb$bbb');
			assert.strictEqual(s.value, '${1|aaa\\\\aaa|}bbb\\$bbb');
		}
	});

	test('instanceof doesn\'t work for FileSystemError #49386', function () {
		const error = types.FileSystemError.Unavailable('foo');
		assert.ok(error instanceof Error);
		assert.ok(error instanceof types.FileSystemError);
	});

	test('CancellationError', function () {
		// The CancellationError-type is used internally and exported as API. Make sure that at
		// its name and message are `Canceled`
		const err = new CancellationError();
		assert.strictEqual(err.name, 'Canceled');
		assert.strictEqual(err.message, 'Canceled');
	});

	test('CodeActionKind contains', () => {
		assert.ok(types.CodeActionKind.RefactorExtract.contains(types.CodeActionKind.RefactorExtract));
		assert.ok(types.CodeActionKind.RefactorExtract.contains(types.CodeActionKind.RefactorExtract.append('other')));

		assert.ok(!types.CodeActionKind.RefactorExtract.contains(types.CodeActionKind.Refactor));
		assert.ok(!types.CodeActionKind.RefactorExtract.contains(types.CodeActionKind.Refactor.append('other')));
		assert.ok(!types.CodeActionKind.RefactorExtract.contains(types.CodeActionKind.Empty.append('other').append('refactor')));
		assert.ok(!types.CodeActionKind.RefactorExtract.contains(types.CodeActionKind.Empty.append('refactory')));
	});

	test('CodeActionKind intersects', () => {
		assert.ok(types.CodeActionKind.RefactorExtract.intersects(types.CodeActionKind.RefactorExtract));
		assert.ok(types.CodeActionKind.RefactorExtract.intersects(types.CodeActionKind.Refactor));
		assert.ok(types.CodeActionKind.RefactorExtract.intersects(types.CodeActionKind.RefactorExtract.append('other')));

		assert.ok(!types.CodeActionKind.RefactorExtract.intersects(types.CodeActionKind.Refactor.append('other')));
		assert.ok(!types.CodeActionKind.RefactorExtract.intersects(types.CodeActionKind.Empty.append('other').append('refactor')));
		assert.ok(!types.CodeActionKind.RefactorExtract.intersects(types.CodeActionKind.Empty.append('refactory')));
	});

	function toArr(uint32Arr: Uint32Array): number[] {
		const r = [];
		for (let i = 0, len = uint32Arr.length; i < len; i++) {
			r[i] = uint32Arr[i];
		}
		return r;
	}

	test('SemanticTokensBuilder simple', () => {
		const builder = new types.SemanticTokensBuilder();
		builder.push(1, 0, 5, 1, 1);
		builder.push(1, 10, 4, 2, 2);
		builder.push(2, 2, 3, 2, 2);
		assert.deepStrictEqual(toArr(builder.build().data), [
			1, 0, 5, 1, 1,
			0, 10, 4, 2, 2,
			1, 2, 3, 2, 2
		]);
	});

	test('SemanticTokensBuilder no modifier', () => {
		const builder = new types.SemanticTokensBuilder();
		builder.push(1, 0, 5, 1);
		builder.push(1, 10, 4, 2);
		builder.push(2, 2, 3, 2);
		assert.deepStrictEqual(toArr(builder.build().data), [
			1, 0, 5, 1, 0,
			0, 10, 4, 2, 0,
			1, 2, 3, 2, 0
		]);
	});

	test('SemanticTokensBuilder out of order 1', () => {
		const builder = new types.SemanticTokensBuilder();
		builder.push(2, 0, 5, 1, 1);
		builder.push(2, 10, 1, 2, 2);
		builder.push(2, 15, 2, 3, 3);
		builder.push(1, 0, 4, 4, 4);
		assert.deepStrictEqual(toArr(builder.build().data), [
			1, 0, 4, 4, 4,
			1, 0, 5, 1, 1,
			0, 10, 1, 2, 2,
			0, 5, 2, 3, 3
		]);
	});

	test('SemanticTokensBuilder out of order 2', () => {
		const builder = new types.SemanticTokensBuilder();
		builder.push(2, 10, 5, 1, 1);
		builder.push(2, 2, 4, 2, 2);
		assert.deepStrictEqual(toArr(builder.build().data), [
			2, 2, 4, 2, 2,
			0, 8, 5, 1, 1
		]);
	});

	test('SemanticTokensBuilder with legend', () => {
		const legend = new types.SemanticTokensLegend(
			['aType', 'bType', 'cType', 'dType'],
			['mod0', 'mod1', 'mod2', 'mod3', 'mod4', 'mod5']
		);
		const builder = new types.SemanticTokensBuilder(legend);
		builder.push(new types.Range(1, 0, 1, 5), 'bType');
		builder.push(new types.Range(2, 0, 2, 4), 'cType', ['mod0', 'mod5']);
		builder.push(new types.Range(3, 0, 3, 3), 'dType', ['mod2', 'mod4']);
		assert.deepStrictEqual(toArr(builder.build().data), [
			1, 0, 5, 1, 0,
			1, 0, 4, 2, 1 | (1 << 5),
			1, 0, 3, 3, (1 << 2) | (1 << 4)
		]);
	});

	test('Markdown codeblock rendering is swapped #111604', function () {
		const md = new types.MarkdownString().appendCodeblock('<img src=0 onerror="alert(1)">', 'html');
		assert.deepStrictEqual(md.value, '\n```html\n<img src=0 onerror="alert(1)">\n```\n');
	});

	test('NotebookCellOutputItem - factories', function () {

		assert.throws(() => {
			// invalid mime type
			new types.NotebookCellOutputItem(new Uint8Array(), 'invalid');
		});

		// --- err

		let item = types.NotebookCellOutputItem.error(new Error());
		assert.strictEqual(item.mime, 'application/vnd.code.notebook.error');
		item = types.NotebookCellOutputItem.error({ name: 'Hello' });
		assert.strictEqual(item.mime, 'application/vnd.code.notebook.error');

		// --- JSON

		item = types.NotebookCellOutputItem.json(1);
		assert.strictEqual(item.mime, 'text/x-json');
		assert.deepStrictEqual(item.data, new TextEncoder().encode(JSON.stringify(1)));

		item = types.NotebookCellOutputItem.json(1, 'foo/bar');
		assert.strictEqual(item.mime, 'foo/bar');
		assert.deepStrictEqual(item.data, new TextEncoder().encode(JSON.stringify(1)));

		item = types.NotebookCellOutputItem.json(true);
		assert.strictEqual(item.mime, 'text/x-json');
		assert.deepStrictEqual(item.data, new TextEncoder().encode(JSON.stringify(true)));

		item = types.NotebookCellOutputItem.json([true, 1, 'ddd']);
		assert.strictEqual(item.mime, 'text/x-json');
		assert.deepStrictEqual(item.data, new TextEncoder().encode(JSON.stringify([true, 1, 'ddd'], undefined, '\t')));

		// --- text

		item = types.NotebookCellOutputItem.text('Hęłlö');
		assert.strictEqual(item.mime, Mimes.text);
		assert.deepStrictEqual(item.data, new TextEncoder().encode('Hęłlö'));

		item = types.NotebookCellOutputItem.text('Hęłlö', 'foo/bar');
		assert.strictEqual(item.mime, 'foo/bar');
		assert.deepStrictEqual(item.data, new TextEncoder().encode('Hęłlö'));
	});

	test('FileDecoration#validate', function () {

		assert.ok(types.FileDecoration.validate({ badge: 'u' }));
		assert.ok(types.FileDecoration.validate({ badge: 'ü' }));
		assert.ok(types.FileDecoration.validate({ badge: '1' }));
		assert.ok(types.FileDecoration.validate({ badge: 'ãã' }));
		assert.ok(types.FileDecoration.validate({ badge: '👋' }));
		assert.ok(types.FileDecoration.validate({ badge: '👋👋' }));
		assert.ok(types.FileDecoration.validate({ badge: '👩‍👩‍👧‍👧' }));
		assert.ok(types.FileDecoration.validate({ badge: 'போ' }));
		assert.throws(() => types.FileDecoration.validate({ badge: 'hel' }));
		assert.throws(() => types.FileDecoration.validate({ badge: '👋👋👋' }));
		assert.throws(() => types.FileDecoration.validate({ badge: 'புன்சிரிப்போடு' }));
		assert.throws(() => types.FileDecoration.validate({ badge: 'ããã' }));
	});

	test('runtime stable, type-def changed', function () {
		// see https://github.com/microsoft/vscode/issues/231938
		const m = new types.LanguageModelChatMessage(types.LanguageModelChatMessageRole.User, []);
		assert.deepStrictEqual(m.content, []);
		m.content = 'Hello';
		assert.deepStrictEqual(m.content, [new types.LanguageModelTextPart('Hello')]);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/test/browser/extHostWebview.test.ts]---
Location: vscode-main/src/vs/workbench/api/test/browser/extHostWebview.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../base/common/network.js';
import { URI } from '../../../../base/common/uri.js';
import { mock } from '../../../../base/test/common/mock.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { IExtensionDescription } from '../../../../platform/extensions/common/extensions.js';
import { NullLogService } from '../../../../platform/log/common/log.js';
import { MainThreadWebviewManager } from '../../browser/mainThreadWebviewManager.js';
import { NullApiDeprecationService } from '../../common/extHostApiDeprecationService.js';
import { IExtHostRpcService } from '../../common/extHostRpcService.js';
import { ExtHostWebviews } from '../../common/extHostWebview.js';
import { ExtHostWebviewPanels } from '../../common/extHostWebviewPanels.js';
import { SingleProxyRPCProtocol } from '../common/testRPCProtocol.js';
import { decodeAuthority, webviewResourceBaseHost } from '../../../contrib/webview/common/webview.js';
import { EditorGroupColumn } from '../../../services/editor/common/editorGroupColumn.js';
import { IExtHostContext } from '../../../services/extensions/common/extHostCustomers.js';
import type * as vscode from 'vscode';

suite('ExtHostWebview', () => {
	let disposables: DisposableStore;
	let rpcProtocol: (IExtHostRpcService & IExtHostContext) | undefined;

	setup(() => {
		disposables = new DisposableStore();

		const shape = createNoopMainThreadWebviews();
		rpcProtocol = SingleProxyRPCProtocol(shape);
	});

	teardown(() => {
		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	function createWebview(rpcProtocol: (IExtHostRpcService & IExtHostContext) | undefined, remoteAuthority: string | undefined) {
		const extHostWebviews = disposables.add(new ExtHostWebviews(rpcProtocol!, {
			authority: remoteAuthority,
			isRemote: !!remoteAuthority,
		}, undefined, new NullLogService(), NullApiDeprecationService));

		const extHostWebviewPanels = disposables.add(new ExtHostWebviewPanels(rpcProtocol!, extHostWebviews, undefined));

		return disposables.add(extHostWebviewPanels.createWebviewPanel({
			extensionLocation: URI.from({
				scheme: remoteAuthority ? Schemas.vscodeRemote : Schemas.file,
				authority: remoteAuthority,
				path: '/ext/path',
			})
		} as IExtensionDescription, 'type', 'title', 1, {}));
	}

	test('Cannot register multiple serializers for the same view type', async () => {
		const viewType = 'view.type';

		const extHostWebviews = disposables.add(new ExtHostWebviews(rpcProtocol!, { authority: undefined, isRemote: false }, undefined, new NullLogService(), NullApiDeprecationService));

		const extHostWebviewPanels = disposables.add(new ExtHostWebviewPanels(rpcProtocol!, extHostWebviews, undefined));

		let lastInvokedDeserializer: vscode.WebviewPanelSerializer | undefined = undefined;

		class NoopSerializer implements vscode.WebviewPanelSerializer {
			async deserializeWebviewPanel(webview: vscode.WebviewPanel, _state: any): Promise<void> {
				lastInvokedDeserializer = this;
				disposables.add(webview);
			}
		}

		const extension = {} as IExtensionDescription;

		const serializerA = new NoopSerializer();
		const serializerB = new NoopSerializer();

		const serializerARegistration = extHostWebviewPanels.registerWebviewPanelSerializer(extension, viewType, serializerA);

		await extHostWebviewPanels.$deserializeWebviewPanel('x', viewType, {
			title: 'title',
			state: {},
			panelOptions: {},
			webviewOptions: {},
			active: true,
		}, 0 as EditorGroupColumn);
		assert.strictEqual(lastInvokedDeserializer, serializerA);

		assert.throws(
			() => disposables.add(extHostWebviewPanels.registerWebviewPanelSerializer(extension, viewType, serializerB)),
			'Should throw when registering two serializers for the same view');

		serializerARegistration.dispose();

		disposables.add(extHostWebviewPanels.registerWebviewPanelSerializer(extension, viewType, serializerB));

		await extHostWebviewPanels.$deserializeWebviewPanel('x', viewType, {
			title: 'title',
			state: {},
			panelOptions: {},
			webviewOptions: {},
			active: true,
		}, 0 as EditorGroupColumn);
		assert.strictEqual(lastInvokedDeserializer, serializerB);
	});

	test('asWebviewUri for local file paths', () => {
		const webview = createWebview(rpcProtocol, /* remoteAuthority */undefined);

		assert.strictEqual(
			(webview.webview.asWebviewUri(URI.parse('file:///Users/codey/file.html')).toString()),
			`https://file%2B.vscode-resource.${webviewResourceBaseHost}/Users/codey/file.html`,
			'Unix basic'
		);

		assert.strictEqual(
			(webview.webview.asWebviewUri(URI.parse('file:///Users/codey/file.html#frag')).toString()),
			`https://file%2B.vscode-resource.${webviewResourceBaseHost}/Users/codey/file.html#frag`,
			'Unix should preserve fragment'
		);

		assert.strictEqual(
			(webview.webview.asWebviewUri(URI.parse('file:///Users/codey/f%20ile.html')).toString()),
			`https://file%2B.vscode-resource.${webviewResourceBaseHost}/Users/codey/f%20ile.html`,
			'Unix with encoding'
		);

		assert.strictEqual(
			(webview.webview.asWebviewUri(URI.parse('file://localhost/Users/codey/file.html')).toString()),
			`https://file%2Blocalhost.vscode-resource.${webviewResourceBaseHost}/Users/codey/file.html`,
			'Unix should preserve authority'
		);

		assert.strictEqual(
			(webview.webview.asWebviewUri(URI.parse('file:///c:/codey/file.txt')).toString()),
			`https://file%2B.vscode-resource.${webviewResourceBaseHost}/c%3A/codey/file.txt`,
			'Windows C drive'
		);
	});

	test('asWebviewUri for remote file paths', () => {
		const webview = createWebview(rpcProtocol, /* remoteAuthority */ 'remote');

		assert.strictEqual(
			(webview.webview.asWebviewUri(URI.parse('file:///Users/codey/file.html')).toString()),
			`https://vscode-remote%2Bremote.vscode-resource.${webviewResourceBaseHost}/Users/codey/file.html`,
			'Unix basic'
		);
	});

	test('asWebviewUri for remote with / and + in name', () => {
		const webview = createWebview(rpcProtocol, /* remoteAuthority */ 'remote');
		const authority = 'ssh-remote+localhost=foo/bar';

		const sourceUri = URI.from({
			scheme: 'vscode-remote',
			authority: authority,
			path: '/Users/cody/x.png'
		});

		const webviewUri = webview.webview.asWebviewUri(sourceUri);
		assert.strictEqual(
			webviewUri.toString(),
			`https://vscode-remote%2Bssh-002dremote-002blocalhost-003dfoo-002fbar.vscode-resource.vscode-cdn.net/Users/cody/x.png`,
			'Check transform');

		assert.strictEqual(
			decodeAuthority(webviewUri.authority),
			`vscode-remote+${authority}.vscode-resource.vscode-cdn.net`,
			'Check decoded authority'
		);
	});

	test('asWebviewUri for remote with port in name', () => {
		const webview = createWebview(rpcProtocol, /* remoteAuthority */ 'remote');
		const authority = 'localhost:8080';

		const sourceUri = URI.from({
			scheme: 'vscode-remote',
			authority: authority,
			path: '/Users/cody/x.png'
		});

		const webviewUri = webview.webview.asWebviewUri(sourceUri);
		assert.strictEqual(
			webviewUri.toString(),
			`https://vscode-remote%2Blocalhost-003a8080.vscode-resource.vscode-cdn.net/Users/cody/x.png`,
			'Check transform');

		assert.strictEqual(
			decodeAuthority(webviewUri.authority),
			`vscode-remote+${authority}.vscode-resource.vscode-cdn.net`,
			'Check decoded authority'
		);
	});
});


function createNoopMainThreadWebviews() {
	return new class extends mock<MainThreadWebviewManager>() {
		$disposeWebview() { /* noop */ }
		$createWebviewPanel() { /* noop */ }
		$registerSerializer() { /* noop */ }
		$unregisterSerializer() { /* noop */ }
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/test/browser/extHostWorkspace.test.ts]---
Location: vscode-main/src/vs/workbench/api/test/browser/extHostWorkspace.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { basename } from '../../../../base/common/path.js';
import { URI, UriComponents } from '../../../../base/common/uri.js';
import { ExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';
import { ILogService, NullLogService } from '../../../../platform/log/common/log.js';
import { IWorkspaceFolderData } from '../../../../platform/workspace/common/workspace.js';
import { MainThreadWorkspace } from '../../browser/mainThreadWorkspace.js';
import { IMainContext, IWorkspaceData, MainContext, ITextSearchComplete } from '../../common/extHost.protocol.js';
import { RelativePattern } from '../../common/extHostTypes.js';
import { ExtHostWorkspace } from '../../common/extHostWorkspace.js';
import { mock } from '../../../../base/test/common/mock.js';
import { TestRPCProtocol } from '../common/testRPCProtocol.js';
import { ExtHostRpcService } from '../../common/extHostRpcService.js';
import { IExtHostInitDataService } from '../../common/extHostInitDataService.js';
import { IFileQueryBuilderOptions, ITextQueryBuilderOptions } from '../../../services/search/common/queryBuilder.js';
import { IPatternInfo } from '../../../services/search/common/search.js';
import { isLinux, isWindows } from '../../../../base/common/platform.js';
import { IExtHostFileSystemInfo } from '../../common/extHostFileSystemInfo.js';
import { FileSystemProviderCapabilities } from '../../../../platform/files/common/files.js';
import { nullExtensionDescription as extensionDescriptor } from '../../../services/extensions/common/extensions.js';
import { IURITransformerService } from '../../common/extHostUriTransformerService.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { ExcludeSettingOptions } from '../../../services/search/common/searchExtTypes.js';

function createExtHostWorkspace(mainContext: IMainContext, data: IWorkspaceData, logService: ILogService): ExtHostWorkspace {
	const result = new ExtHostWorkspace(
		new ExtHostRpcService(mainContext),
		new class extends mock<IExtHostInitDataService>() { override workspace = data; },
		new class extends mock<IExtHostFileSystemInfo>() { override getCapabilities() { return isLinux ? FileSystemProviderCapabilities.PathCaseSensitive : undefined; } },
		logService,
		new class extends mock<IURITransformerService>() { }
	);
	result.$initializeWorkspace(data, true);
	return result;
}

suite('ExtHostWorkspace', function () {

	ensureNoDisposablesAreLeakedInTestSuite();

	function assertAsRelativePath(workspace: ExtHostWorkspace, input: string, expected: string, includeWorkspace?: boolean) {
		const actual = workspace.getRelativePath(input, includeWorkspace);
		assert.strictEqual(actual, expected);
	}

	test('asRelativePath', () => {

		const ws = createExtHostWorkspace(new TestRPCProtocol(), { id: 'foo', folders: [aWorkspaceFolderData(URI.file('/Coding/Applications/NewsWoWBot'), 0)], name: 'Test' }, new NullLogService());

		assertAsRelativePath(ws, '/Coding/Applications/NewsWoWBot/bernd/das/brot', 'bernd/das/brot');
		assertAsRelativePath(ws, '/Apps/DartPubCache/hosted/pub.dartlang.org/convert-2.0.1/lib/src/hex.dart',
			'/Apps/DartPubCache/hosted/pub.dartlang.org/convert-2.0.1/lib/src/hex.dart');

		assertAsRelativePath(ws, '', '');
		assertAsRelativePath(ws, '/foo/bar', '/foo/bar');
		assertAsRelativePath(ws, 'in/out', 'in/out');
	});

	test('asRelativePath, same paths, #11402', function () {
		const root = '/home/aeschli/workspaces/samples/docker';
		const input = '/home/aeschli/workspaces/samples/docker';
		const ws = createExtHostWorkspace(new TestRPCProtocol(), { id: 'foo', folders: [aWorkspaceFolderData(URI.file(root), 0)], name: 'Test' }, new NullLogService());

		assertAsRelativePath(ws, input, input);

		const input2 = '/home/aeschli/workspaces/samples/docker/a.file';
		assertAsRelativePath(ws, input2, 'a.file');
	});

	test('asRelativePath, no workspace', function () {
		const ws = createExtHostWorkspace(new TestRPCProtocol(), null!, new NullLogService());
		assertAsRelativePath(ws, '', '');
		assertAsRelativePath(ws, '/foo/bar', '/foo/bar');
	});

	test('asRelativePath, multiple folders', function () {
		const ws = createExtHostWorkspace(new TestRPCProtocol(), { id: 'foo', folders: [aWorkspaceFolderData(URI.file('/Coding/One'), 0), aWorkspaceFolderData(URI.file('/Coding/Two'), 1)], name: 'Test' }, new NullLogService());
		assertAsRelativePath(ws, '/Coding/One/file.txt', 'One/file.txt');
		assertAsRelativePath(ws, '/Coding/Two/files/out.txt', 'Two/files/out.txt');
		assertAsRelativePath(ws, '/Coding/Two2/files/out.txt', '/Coding/Two2/files/out.txt');
	});

	test('slightly inconsistent behaviour of asRelativePath and getWorkspaceFolder, #31553', function () {
		const mrws = createExtHostWorkspace(new TestRPCProtocol(), { id: 'foo', folders: [aWorkspaceFolderData(URI.file('/Coding/One'), 0), aWorkspaceFolderData(URI.file('/Coding/Two'), 1)], name: 'Test' }, new NullLogService());

		assertAsRelativePath(mrws, '/Coding/One/file.txt', 'One/file.txt');
		assertAsRelativePath(mrws, '/Coding/One/file.txt', 'One/file.txt', true);
		assertAsRelativePath(mrws, '/Coding/One/file.txt', 'file.txt', false);
		assertAsRelativePath(mrws, '/Coding/Two/files/out.txt', 'Two/files/out.txt');
		assertAsRelativePath(mrws, '/Coding/Two/files/out.txt', 'Two/files/out.txt', true);
		assertAsRelativePath(mrws, '/Coding/Two/files/out.txt', 'files/out.txt', false);
		assertAsRelativePath(mrws, '/Coding/Two2/files/out.txt', '/Coding/Two2/files/out.txt');
		assertAsRelativePath(mrws, '/Coding/Two2/files/out.txt', '/Coding/Two2/files/out.txt', true);
		assertAsRelativePath(mrws, '/Coding/Two2/files/out.txt', '/Coding/Two2/files/out.txt', false);

		const srws = createExtHostWorkspace(new TestRPCProtocol(), { id: 'foo', folders: [aWorkspaceFolderData(URI.file('/Coding/One'), 0)], name: 'Test' }, new NullLogService());
		assertAsRelativePath(srws, '/Coding/One/file.txt', 'file.txt');
		assertAsRelativePath(srws, '/Coding/One/file.txt', 'file.txt', false);
		assertAsRelativePath(srws, '/Coding/One/file.txt', 'One/file.txt', true);
		assertAsRelativePath(srws, '/Coding/Two2/files/out.txt', '/Coding/Two2/files/out.txt');
		assertAsRelativePath(srws, '/Coding/Two2/files/out.txt', '/Coding/Two2/files/out.txt', true);
		assertAsRelativePath(srws, '/Coding/Two2/files/out.txt', '/Coding/Two2/files/out.txt', false);
	});

	test('getPath, legacy', function () {
		let ws = createExtHostWorkspace(new TestRPCProtocol(), { id: 'foo', name: 'Test', folders: [] }, new NullLogService());
		assert.strictEqual(ws.getPath(), undefined);

		ws = createExtHostWorkspace(new TestRPCProtocol(), null!, new NullLogService());
		assert.strictEqual(ws.getPath(), undefined);

		ws = createExtHostWorkspace(new TestRPCProtocol(), undefined!, new NullLogService());
		assert.strictEqual(ws.getPath(), undefined);

		ws = createExtHostWorkspace(new TestRPCProtocol(), { id: 'foo', name: 'Test', folders: [aWorkspaceFolderData(URI.file('Folder'), 0), aWorkspaceFolderData(URI.file('Another/Folder'), 1)] }, new NullLogService());
		assert.strictEqual(ws.getPath()!.replace(/\\/g, '/'), '/Folder');

		ws = createExtHostWorkspace(new TestRPCProtocol(), { id: 'foo', name: 'Test', folders: [aWorkspaceFolderData(URI.file('/Folder'), 0)] }, new NullLogService());
		assert.strictEqual(ws.getPath()!.replace(/\\/g, '/'), '/Folder');
	});

	test('WorkspaceFolder has name and index', function () {
		const ws = createExtHostWorkspace(new TestRPCProtocol(), { id: 'foo', folders: [aWorkspaceFolderData(URI.file('/Coding/One'), 0), aWorkspaceFolderData(URI.file('/Coding/Two'), 1)], name: 'Test' }, new NullLogService());

		const [one, two] = ws.getWorkspaceFolders()!;

		assert.strictEqual(one.name, 'One');
		assert.strictEqual(one.index, 0);
		assert.strictEqual(two.name, 'Two');
		assert.strictEqual(two.index, 1);
	});

	test('getContainingWorkspaceFolder', () => {
		const ws = createExtHostWorkspace(new TestRPCProtocol(), {
			id: 'foo',
			name: 'Test',
			folders: [
				aWorkspaceFolderData(URI.file('/Coding/One'), 0),
				aWorkspaceFolderData(URI.file('/Coding/Two'), 1),
				aWorkspaceFolderData(URI.file('/Coding/Two/Nested'), 2)
			]
		}, new NullLogService());

		let folder = ws.getWorkspaceFolder(URI.file('/foo/bar'));
		assert.strictEqual(folder, undefined);

		folder = ws.getWorkspaceFolder(URI.file('/Coding/One/file/path.txt'))!;
		assert.strictEqual(folder.name, 'One');

		folder = ws.getWorkspaceFolder(URI.file('/Coding/Two/file/path.txt'))!;
		assert.strictEqual(folder.name, 'Two');

		folder = ws.getWorkspaceFolder(URI.file('/Coding/Two/Nest'))!;
		assert.strictEqual(folder.name, 'Two');

		folder = ws.getWorkspaceFolder(URI.file('/Coding/Two/Nested/file'))!;
		assert.strictEqual(folder.name, 'Nested');

		folder = ws.getWorkspaceFolder(URI.file('/Coding/Two/Nested/f'))!;
		assert.strictEqual(folder.name, 'Nested');

		folder = ws.getWorkspaceFolder(URI.file('/Coding/Two/Nested'), true)!;
		assert.strictEqual(folder.name, 'Two');

		folder = ws.getWorkspaceFolder(URI.file('/Coding/Two/Nested/'), true)!;
		assert.strictEqual(folder.name, 'Two');

		folder = ws.getWorkspaceFolder(URI.file('/Coding/Two/Nested'))!;
		assert.strictEqual(folder.name, 'Nested');

		folder = ws.getWorkspaceFolder(URI.file('/Coding/Two/Nested/'))!;
		assert.strictEqual(folder.name, 'Nested');

		folder = ws.getWorkspaceFolder(URI.file('/Coding/Two'), true)!;
		assert.strictEqual(folder, undefined);

		folder = ws.getWorkspaceFolder(URI.file('/Coding/Two'), false)!;
		assert.strictEqual(folder.name, 'Two');
	});

	test('Multiroot change event should have a delta, #29641', function (done) {
		const ws = createExtHostWorkspace(new TestRPCProtocol(), { id: 'foo', name: 'Test', folders: [] }, new NullLogService());

		let finished = false;
		const finish = (error?: any) => {
			if (!finished) {
				finished = true;
				done(error);
			}
		};

		let sub = ws.onDidChangeWorkspace(e => {
			try {
				assert.deepStrictEqual(e.added, []);
				assert.deepStrictEqual(e.removed, []);
			} catch (error) {
				finish(error);
			}
		});
		ws.$acceptWorkspaceData({ id: 'foo', name: 'Test', folders: [] });
		sub.dispose();

		sub = ws.onDidChangeWorkspace(e => {
			try {
				assert.deepStrictEqual(e.removed, []);
				assert.strictEqual(e.added.length, 1);
				assert.strictEqual(e.added[0].uri.toString(), 'foo:bar');
			} catch (error) {
				finish(error);
			}
		});
		ws.$acceptWorkspaceData({ id: 'foo', name: 'Test', folders: [aWorkspaceFolderData(URI.parse('foo:bar'), 0)] });
		sub.dispose();

		sub = ws.onDidChangeWorkspace(e => {
			try {
				assert.deepStrictEqual(e.removed, []);
				assert.strictEqual(e.added.length, 1);
				assert.strictEqual(e.added[0].uri.toString(), 'foo:bar2');
			} catch (error) {
				finish(error);
			}
		});
		ws.$acceptWorkspaceData({ id: 'foo', name: 'Test', folders: [aWorkspaceFolderData(URI.parse('foo:bar'), 0), aWorkspaceFolderData(URI.parse('foo:bar2'), 1)] });
		sub.dispose();

		sub = ws.onDidChangeWorkspace(e => {
			try {
				assert.strictEqual(e.removed.length, 2);
				assert.strictEqual(e.removed[0].uri.toString(), 'foo:bar');
				assert.strictEqual(e.removed[1].uri.toString(), 'foo:bar2');

				assert.strictEqual(e.added.length, 1);
				assert.strictEqual(e.added[0].uri.toString(), 'foo:bar3');
			} catch (error) {
				finish(error);
			}
		});
		ws.$acceptWorkspaceData({ id: 'foo', name: 'Test', folders: [aWorkspaceFolderData(URI.parse('foo:bar3'), 0)] });
		sub.dispose();
		finish();
	});

	test('Multiroot change keeps existing workspaces live', function () {
		const ws = createExtHostWorkspace(new TestRPCProtocol(), { id: 'foo', name: 'Test', folders: [aWorkspaceFolderData(URI.parse('foo:bar'), 0)] }, new NullLogService());

		const firstFolder = ws.getWorkspaceFolders()![0];
		ws.$acceptWorkspaceData({ id: 'foo', name: 'Test', folders: [aWorkspaceFolderData(URI.parse('foo:bar2'), 0), aWorkspaceFolderData(URI.parse('foo:bar'), 1, 'renamed')] });

		assert.strictEqual(ws.getWorkspaceFolders()![1], firstFolder);
		assert.strictEqual(firstFolder.index, 1);
		assert.strictEqual(firstFolder.name, 'renamed');

		ws.$acceptWorkspaceData({ id: 'foo', name: 'Test', folders: [aWorkspaceFolderData(URI.parse('foo:bar3'), 0), aWorkspaceFolderData(URI.parse('foo:bar2'), 1), aWorkspaceFolderData(URI.parse('foo:bar'), 2)] });
		assert.strictEqual(ws.getWorkspaceFolders()![2], firstFolder);
		assert.strictEqual(firstFolder.index, 2);

		ws.$acceptWorkspaceData({ id: 'foo', name: 'Test', folders: [aWorkspaceFolderData(URI.parse('foo:bar3'), 0)] });
		ws.$acceptWorkspaceData({ id: 'foo', name: 'Test', folders: [aWorkspaceFolderData(URI.parse('foo:bar3'), 0), aWorkspaceFolderData(URI.parse('foo:bar'), 1)] });

		assert.notStrictEqual(firstFolder, ws.workspace!.folders[0]);
	});

	test('updateWorkspaceFolders - invalid arguments', function () {
		let ws = createExtHostWorkspace(new TestRPCProtocol(), { id: 'foo', name: 'Test', folders: [] }, new NullLogService());

		assert.strictEqual(false, ws.updateWorkspaceFolders(extensionDescriptor, null!, null!));
		assert.strictEqual(false, ws.updateWorkspaceFolders(extensionDescriptor, 0, 0));
		assert.strictEqual(false, ws.updateWorkspaceFolders(extensionDescriptor, 0, 1));
		assert.strictEqual(false, ws.updateWorkspaceFolders(extensionDescriptor, 1, 0));
		assert.strictEqual(false, ws.updateWorkspaceFolders(extensionDescriptor, -1, 0));
		assert.strictEqual(false, ws.updateWorkspaceFolders(extensionDescriptor, -1, -1));

		ws = createExtHostWorkspace(new TestRPCProtocol(), { id: 'foo', name: 'Test', folders: [aWorkspaceFolderData(URI.parse('foo:bar'), 0)] }, new NullLogService());

		assert.strictEqual(false, ws.updateWorkspaceFolders(extensionDescriptor, 1, 1));
		assert.strictEqual(false, ws.updateWorkspaceFolders(extensionDescriptor, 0, 2));
		assert.strictEqual(false, ws.updateWorkspaceFolders(extensionDescriptor, 0, 1, asUpdateWorkspaceFolderData(URI.parse('foo:bar'))));
	});

	test('updateWorkspaceFolders - valid arguments', function (done) {
		let finished = false;
		const finish = (error?: any) => {
			if (!finished) {
				finished = true;
				done(error);
			}
		};

		const protocol: IMainContext = {
			getProxy: () => { return undefined!; },
			set: () => { return undefined!; },
			dispose: () => { },
			assertRegistered: () => { },
			drain: () => { return undefined!; },
		};

		const ws = createExtHostWorkspace(protocol, { id: 'foo', name: 'Test', folders: [] }, new NullLogService());

		//
		// Add one folder
		//

		assert.strictEqual(true, ws.updateWorkspaceFolders(extensionDescriptor, 0, 0, asUpdateWorkspaceFolderData(URI.parse('foo:bar'))));
		assert.strictEqual(1, ws.workspace!.folders.length);
		assert.strictEqual(ws.workspace!.folders[0].uri.toString(), URI.parse('foo:bar').toString());

		const firstAddedFolder = ws.getWorkspaceFolders()![0];

		let gotEvent = false;
		let sub = ws.onDidChangeWorkspace(e => {
			try {
				assert.deepStrictEqual(e.removed, []);
				assert.strictEqual(e.added.length, 1);
				assert.strictEqual(e.added[0].uri.toString(), 'foo:bar');
				assert.strictEqual(e.added[0], firstAddedFolder); // verify object is still live
				gotEvent = true;
			} catch (error) {
				finish(error);
			}
		});
		ws.$acceptWorkspaceData({ id: 'foo', name: 'Test', folders: [aWorkspaceFolderData(URI.parse('foo:bar'), 0)] }); // simulate acknowledgement from main side
		assert.strictEqual(gotEvent, true);
		sub.dispose();
		assert.strictEqual(ws.getWorkspaceFolders()![0], firstAddedFolder); // verify object is still live

		//
		// Add two more folders
		//

		assert.strictEqual(true, ws.updateWorkspaceFolders(extensionDescriptor, 1, 0, asUpdateWorkspaceFolderData(URI.parse('foo:bar1')), asUpdateWorkspaceFolderData(URI.parse('foo:bar2'))));
		assert.strictEqual(3, ws.workspace!.folders.length);
		assert.strictEqual(ws.workspace!.folders[0].uri.toString(), URI.parse('foo:bar').toString());
		assert.strictEqual(ws.workspace!.folders[1].uri.toString(), URI.parse('foo:bar1').toString());
		assert.strictEqual(ws.workspace!.folders[2].uri.toString(), URI.parse('foo:bar2').toString());

		const secondAddedFolder = ws.getWorkspaceFolders()![1];
		const thirdAddedFolder = ws.getWorkspaceFolders()![2];

		gotEvent = false;
		sub = ws.onDidChangeWorkspace(e => {
			try {
				assert.deepStrictEqual(e.removed, []);
				assert.strictEqual(e.added.length, 2);
				assert.strictEqual(e.added[0].uri.toString(), 'foo:bar1');
				assert.strictEqual(e.added[1].uri.toString(), 'foo:bar2');
				assert.strictEqual(e.added[0], secondAddedFolder);
				assert.strictEqual(e.added[1], thirdAddedFolder);
				gotEvent = true;
			} catch (error) {
				finish(error);
			}
		});
		ws.$acceptWorkspaceData({ id: 'foo', name: 'Test', folders: [aWorkspaceFolderData(URI.parse('foo:bar'), 0), aWorkspaceFolderData(URI.parse('foo:bar1'), 1), aWorkspaceFolderData(URI.parse('foo:bar2'), 2)] }); // simulate acknowledgement from main side
		assert.strictEqual(gotEvent, true);
		sub.dispose();
		assert.strictEqual(ws.getWorkspaceFolders()![0], firstAddedFolder); // verify object is still live
		assert.strictEqual(ws.getWorkspaceFolders()![1], secondAddedFolder); // verify object is still live
		assert.strictEqual(ws.getWorkspaceFolders()![2], thirdAddedFolder); // verify object is still live

		//
		// Remove one folder
		//

		assert.strictEqual(true, ws.updateWorkspaceFolders(extensionDescriptor, 2, 1));
		assert.strictEqual(2, ws.workspace!.folders.length);
		assert.strictEqual(ws.workspace!.folders[0].uri.toString(), URI.parse('foo:bar').toString());
		assert.strictEqual(ws.workspace!.folders[1].uri.toString(), URI.parse('foo:bar1').toString());

		gotEvent = false;
		sub = ws.onDidChangeWorkspace(e => {
			try {
				assert.deepStrictEqual(e.added, []);
				assert.strictEqual(e.removed.length, 1);
				assert.strictEqual(e.removed[0], thirdAddedFolder);
				gotEvent = true;
			} catch (error) {
				finish(error);
			}
		});
		ws.$acceptWorkspaceData({ id: 'foo', name: 'Test', folders: [aWorkspaceFolderData(URI.parse('foo:bar'), 0), aWorkspaceFolderData(URI.parse('foo:bar1'), 1)] }); // simulate acknowledgement from main side
		assert.strictEqual(gotEvent, true);
		sub.dispose();
		assert.strictEqual(ws.getWorkspaceFolders()![0], firstAddedFolder); // verify object is still live
		assert.strictEqual(ws.getWorkspaceFolders()![1], secondAddedFolder); // verify object is still live

		//
		// Rename folder
		//

		assert.strictEqual(true, ws.updateWorkspaceFolders(extensionDescriptor, 0, 2, asUpdateWorkspaceFolderData(URI.parse('foo:bar'), 'renamed 1'), asUpdateWorkspaceFolderData(URI.parse('foo:bar1'), 'renamed 2')));
		assert.strictEqual(2, ws.workspace!.folders.length);
		assert.strictEqual(ws.workspace!.folders[0].uri.toString(), URI.parse('foo:bar').toString());
		assert.strictEqual(ws.workspace!.folders[1].uri.toString(), URI.parse('foo:bar1').toString());
		assert.strictEqual(ws.workspace!.folders[0].name, 'renamed 1');
		assert.strictEqual(ws.workspace!.folders[1].name, 'renamed 2');
		assert.strictEqual(ws.getWorkspaceFolders()![0].name, 'renamed 1');
		assert.strictEqual(ws.getWorkspaceFolders()![1].name, 'renamed 2');

		gotEvent = false;
		sub = ws.onDidChangeWorkspace(e => {
			try {
				assert.deepStrictEqual(e.added, []);
				assert.strictEqual(e.removed.length, 0);
				gotEvent = true;
			} catch (error) {
				finish(error);
			}
		});
		ws.$acceptWorkspaceData({ id: 'foo', name: 'Test', folders: [aWorkspaceFolderData(URI.parse('foo:bar'), 0, 'renamed 1'), aWorkspaceFolderData(URI.parse('foo:bar1'), 1, 'renamed 2')] }); // simulate acknowledgement from main side
		assert.strictEqual(gotEvent, true);
		sub.dispose();
		assert.strictEqual(ws.getWorkspaceFolders()![0], firstAddedFolder); // verify object is still live
		assert.strictEqual(ws.getWorkspaceFolders()![1], secondAddedFolder); // verify object is still live
		assert.strictEqual(ws.workspace!.folders[0].name, 'renamed 1');
		assert.strictEqual(ws.workspace!.folders[1].name, 'renamed 2');
		assert.strictEqual(ws.getWorkspaceFolders()![0].name, 'renamed 1');
		assert.strictEqual(ws.getWorkspaceFolders()![1].name, 'renamed 2');

		//
		// Add and remove folders
		//

		assert.strictEqual(true, ws.updateWorkspaceFolders(extensionDescriptor, 0, 2, asUpdateWorkspaceFolderData(URI.parse('foo:bar3')), asUpdateWorkspaceFolderData(URI.parse('foo:bar4'))));
		assert.strictEqual(2, ws.workspace!.folders.length);
		assert.strictEqual(ws.workspace!.folders[0].uri.toString(), URI.parse('foo:bar3').toString());
		assert.strictEqual(ws.workspace!.folders[1].uri.toString(), URI.parse('foo:bar4').toString());

		const fourthAddedFolder = ws.getWorkspaceFolders()![0];
		const fifthAddedFolder = ws.getWorkspaceFolders()![1];

		gotEvent = false;
		sub = ws.onDidChangeWorkspace(e => {
			try {
				assert.strictEqual(e.added.length, 2);
				assert.strictEqual(e.added[0], fourthAddedFolder);
				assert.strictEqual(e.added[1], fifthAddedFolder);
				assert.strictEqual(e.removed.length, 2);
				assert.strictEqual(e.removed[0], firstAddedFolder);
				assert.strictEqual(e.removed[1], secondAddedFolder);
				gotEvent = true;
			} catch (error) {
				finish(error);
			}
		});
		ws.$acceptWorkspaceData({ id: 'foo', name: 'Test', folders: [aWorkspaceFolderData(URI.parse('foo:bar3'), 0), aWorkspaceFolderData(URI.parse('foo:bar4'), 1)] }); // simulate acknowledgement from main side
		assert.strictEqual(gotEvent, true);
		sub.dispose();
		assert.strictEqual(ws.getWorkspaceFolders()![0], fourthAddedFolder); // verify object is still live
		assert.strictEqual(ws.getWorkspaceFolders()![1], fifthAddedFolder); // verify object is still live

		//
		// Swap folders
		//

		assert.strictEqual(true, ws.updateWorkspaceFolders(extensionDescriptor, 0, 2, asUpdateWorkspaceFolderData(URI.parse('foo:bar4')), asUpdateWorkspaceFolderData(URI.parse('foo:bar3'))));
		assert.strictEqual(2, ws.workspace!.folders.length);
		assert.strictEqual(ws.workspace!.folders[0].uri.toString(), URI.parse('foo:bar4').toString());
		assert.strictEqual(ws.workspace!.folders[1].uri.toString(), URI.parse('foo:bar3').toString());

		assert.strictEqual(ws.getWorkspaceFolders()![0], fifthAddedFolder); // verify object is still live
		assert.strictEqual(ws.getWorkspaceFolders()![1], fourthAddedFolder); // verify object is still live

		gotEvent = false;
		sub = ws.onDidChangeWorkspace(e => {
			try {
				assert.strictEqual(e.added.length, 0);
				assert.strictEqual(e.removed.length, 0);
				gotEvent = true;
			} catch (error) {
				finish(error);
			}
		});
		ws.$acceptWorkspaceData({ id: 'foo', name: 'Test', folders: [aWorkspaceFolderData(URI.parse('foo:bar4'), 0), aWorkspaceFolderData(URI.parse('foo:bar3'), 1)] }); // simulate acknowledgement from main side
		assert.strictEqual(gotEvent, true);
		sub.dispose();
		assert.strictEqual(ws.getWorkspaceFolders()![0], fifthAddedFolder); // verify object is still live
		assert.strictEqual(ws.getWorkspaceFolders()![1], fourthAddedFolder); // verify object is still live
		assert.strictEqual(fifthAddedFolder.index, 0);
		assert.strictEqual(fourthAddedFolder.index, 1);

		//
		// Add one folder after the other without waiting for confirmation (not supported currently)
		//

		assert.strictEqual(true, ws.updateWorkspaceFolders(extensionDescriptor, 2, 0, asUpdateWorkspaceFolderData(URI.parse('foo:bar5'))));

		assert.strictEqual(3, ws.workspace!.folders.length);
		assert.strictEqual(ws.workspace!.folders[0].uri.toString(), URI.parse('foo:bar4').toString());
		assert.strictEqual(ws.workspace!.folders[1].uri.toString(), URI.parse('foo:bar3').toString());
		assert.strictEqual(ws.workspace!.folders[2].uri.toString(), URI.parse('foo:bar5').toString());

		const sixthAddedFolder = ws.getWorkspaceFolders()![2];

		gotEvent = false;
		sub = ws.onDidChangeWorkspace(e => {
			try {
				assert.strictEqual(e.added.length, 1);
				assert.strictEqual(e.added[0], sixthAddedFolder);
				gotEvent = true;
			} catch (error) {
				finish(error);
			}
		});
		ws.$acceptWorkspaceData({
			id: 'foo', name: 'Test', folders: [
				aWorkspaceFolderData(URI.parse('foo:bar4'), 0),
				aWorkspaceFolderData(URI.parse('foo:bar3'), 1),
				aWorkspaceFolderData(URI.parse('foo:bar5'), 2)
			]
		}); // simulate acknowledgement from main side
		assert.strictEqual(gotEvent, true);
		sub.dispose();

		assert.strictEqual(ws.getWorkspaceFolders()![0], fifthAddedFolder); // verify object is still live
		assert.strictEqual(ws.getWorkspaceFolders()![1], fourthAddedFolder); // verify object is still live
		assert.strictEqual(ws.getWorkspaceFolders()![2], sixthAddedFolder); // verify object is still live

		finish();
	});

	test('Multiroot change event is immutable', function (done) {
		let finished = false;
		const finish = (error?: any) => {
			if (!finished) {
				finished = true;
				done(error);
			}
		};

		const ws = createExtHostWorkspace(new TestRPCProtocol(), { id: 'foo', name: 'Test', folders: [] }, new NullLogService());
		const sub = ws.onDidChangeWorkspace(e => {
			try {
				assert.throws(() => {
					// eslint-disable-next-line local/code-no-any-casts
					(<any>e).added = [];
				});
				// assert.throws(() => {
				// 	(<any>e.added)[0] = null;
				// });
			} catch (error) {
				finish(error);
			}
		});
		ws.$acceptWorkspaceData({ id: 'foo', name: 'Test', folders: [] });
		sub.dispose();
		finish();
	});

	test('`vscode.workspace.getWorkspaceFolder(file)` don\'t return workspace folder when file open from command line. #36221', function () {
		if (isWindows) {

			const ws = createExtHostWorkspace(new TestRPCProtocol(), {
				id: 'foo', name: 'Test', folders: [
					aWorkspaceFolderData(URI.file('c:/Users/marek/Desktop/vsc_test/'), 0)
				]
			}, new NullLogService());

			assert.ok(ws.getWorkspaceFolder(URI.file('c:/Users/marek/Desktop/vsc_test/a.txt')));
			assert.ok(ws.getWorkspaceFolder(URI.file('C:/Users/marek/Desktop/vsc_test/b.txt')));
		}
	});

	function aWorkspaceFolderData(uri: URI, index: number, name: string = ''): IWorkspaceFolderData {
		return {
			uri,
			index,
			name: name || basename(uri.path)
		};
	}

	function asUpdateWorkspaceFolderData(uri: URI, name?: string): { uri: URI; name?: string } {
		return { uri, name };
	}

	suite('findFiles -', function () {
		test('string include', () => {
			const root = '/project/foo';
			const rpcProtocol = new TestRPCProtocol();

			let mainThreadCalled = false;
			rpcProtocol.set(MainContext.MainThreadWorkspace, new class extends mock<MainThreadWorkspace>() {
				override $startFileSearch(_includeFolder: UriComponents | null, options: IFileQueryBuilderOptions, token: CancellationToken): Promise<URI[] | null> {
					mainThreadCalled = true;
					assert.strictEqual(options.includePattern, 'foo');
					assert.strictEqual(_includeFolder, null);
					assert.strictEqual(options.excludePattern, undefined);
					assert.strictEqual(options.disregardExcludeSettings, false);
					assert.strictEqual(options.maxResults, 10);
					return Promise.resolve(null);
				}
			});

			const ws = createExtHostWorkspace(rpcProtocol, { id: 'foo', folders: [aWorkspaceFolderData(URI.file(root), 0)], name: 'Test' }, new NullLogService());
			return ws.findFiles('foo', undefined, 10, new ExtensionIdentifier('test')).then(() => {
				assert(mainThreadCalled, 'mainThreadCalled');
			});
		});

		function testFindFilesInclude(pattern: RelativePattern) {
			const root = '/project/foo';
			const rpcProtocol = new TestRPCProtocol();

			let mainThreadCalled = false;
			rpcProtocol.set(MainContext.MainThreadWorkspace, new class extends mock<MainThreadWorkspace>() {
				override $startFileSearch(_includeFolder: UriComponents | null, options: IFileQueryBuilderOptions, token: CancellationToken): Promise<URI[] | null> {
					mainThreadCalled = true;
					assert.strictEqual(options.includePattern, 'glob/**');
					assert.deepStrictEqual(_includeFolder ? URI.from(_includeFolder).toJSON() : null, URI.file('/other/folder').toJSON());
					assert.strictEqual(options.excludePattern, undefined);
					assert.strictEqual(options.disregardExcludeSettings, false);
					return Promise.resolve(null);
				}
			});

			const ws = createExtHostWorkspace(rpcProtocol, { id: 'foo', folders: [aWorkspaceFolderData(URI.file(root), 0)], name: 'Test' }, new NullLogService());
			return ws.findFiles(pattern, undefined, 10, new ExtensionIdentifier('test')).then(() => {
				assert(mainThreadCalled, 'mainThreadCalled');
			});
		}

		test('RelativePattern include (string)', () => {
			return testFindFilesInclude(new RelativePattern('/other/folder', 'glob/**'));
		});

		test('RelativePattern include (URI)', () => {
			return testFindFilesInclude(new RelativePattern(URI.file('/other/folder'), 'glob/**'));
		});

		test('no excludes', () => {
			const root = '/project/foo';
			const rpcProtocol = new TestRPCProtocol();

			let mainThreadCalled = false;
			rpcProtocol.set(MainContext.MainThreadWorkspace, new class extends mock<MainThreadWorkspace>() {
				override $startFileSearch(_includeFolder: UriComponents | null, options: IFileQueryBuilderOptions, token: CancellationToken): Promise<URI[] | null> {
					mainThreadCalled = true;
					assert.strictEqual(options.includePattern, 'glob/**');
					assert.deepStrictEqual(URI.revive(_includeFolder!).toString(), URI.file('/other/folder').toString());
					assert.strictEqual(options.excludePattern, undefined);
					assert.strictEqual(options.disregardExcludeSettings, true);
					return Promise.resolve(null);
				}
			});

			const ws = createExtHostWorkspace(rpcProtocol, { id: 'foo', folders: [aWorkspaceFolderData(URI.file(root), 0)], name: 'Test' }, new NullLogService());
			return ws.findFiles(new RelativePattern('/other/folder', 'glob/**'), null, 10, new ExtensionIdentifier('test')).then(() => {
				assert(mainThreadCalled, 'mainThreadCalled');
			});
		});

		test('with cancelled token', () => {
			const root = '/project/foo';
			const rpcProtocol = new TestRPCProtocol();

			let mainThreadCalled = false;
			rpcProtocol.set(MainContext.MainThreadWorkspace, new class extends mock<MainThreadWorkspace>() {
				override $startFileSearch(_includeFolder: UriComponents | null, options: IFileQueryBuilderOptions, token: CancellationToken): Promise<URI[] | null> {
					mainThreadCalled = true;
					return Promise.resolve(null);
				}
			});

			const ws = createExtHostWorkspace(rpcProtocol, { id: 'foo', folders: [aWorkspaceFolderData(URI.file(root), 0)], name: 'Test' }, new NullLogService());

			const token = CancellationToken.Cancelled;
			return ws.findFiles(new RelativePattern('/other/folder', 'glob/**'), null, 10, new ExtensionIdentifier('test'), token).then(() => {
				assert(!mainThreadCalled, '!mainThreadCalled');
			});
		});

		test('RelativePattern exclude', () => {
			const root = '/project/foo';
			const rpcProtocol = new TestRPCProtocol();

			let mainThreadCalled = false;
			rpcProtocol.set(MainContext.MainThreadWorkspace, new class extends mock<MainThreadWorkspace>() {
				override $startFileSearch(_includeFolder: UriComponents | null, options: IFileQueryBuilderOptions, token: CancellationToken): Promise<URI[] | null> {
					mainThreadCalled = true;
					assert.strictEqual(options.disregardExcludeSettings, false);
					assert.strictEqual(options.excludePattern?.length, 1);
					assert.strictEqual(options.excludePattern[0].pattern, 'glob/**'); // Note that the base portion is ignored, see #52651
					return Promise.resolve(null);
				}
			});

			const ws = createExtHostWorkspace(rpcProtocol, { id: 'foo', folders: [aWorkspaceFolderData(URI.file(root), 0)], name: 'Test' }, new NullLogService());
			return ws.findFiles('', new RelativePattern(root, 'glob/**'), 10, new ExtensionIdentifier('test')).then(() => {
				assert(mainThreadCalled, 'mainThreadCalled');
			});
		});
	});

	suite('findFiles2 -', function () {
		test('string include', () => {
			const root = '/project/foo';
			const rpcProtocol = new TestRPCProtocol();

			let mainThreadCalled = false;
			rpcProtocol.set(MainContext.MainThreadWorkspace, new class extends mock<MainThreadWorkspace>() {
				override $startFileSearch(_includeFolder: UriComponents | null, options: IFileQueryBuilderOptions, token: CancellationToken): Promise<URI[] | null> {
					mainThreadCalled = true;
					assert.strictEqual(options.filePattern, 'foo');
					assert.strictEqual(options.includePattern, undefined);
					assert.strictEqual(_includeFolder, null);
					assert.strictEqual(options.excludePattern, undefined);
					assert.strictEqual(options.disregardExcludeSettings, false);
					assert.strictEqual(options.maxResults, 10);
					return Promise.resolve(null);
				}
			});

			const ws = createExtHostWorkspace(rpcProtocol, { id: 'foo', folders: [aWorkspaceFolderData(URI.file(root), 0)], name: 'Test' }, new NullLogService());
			return ws.findFiles2(['foo'], { maxResults: 10, useExcludeSettings: ExcludeSettingOptions.FilesExclude }, new ExtensionIdentifier('test')).then(() => {
				assert(mainThreadCalled, 'mainThreadCalled');
			});
		});

		function testFindFiles2Include(pattern: RelativePattern[]) {
			const root = '/project/foo';
			const rpcProtocol = new TestRPCProtocol();

			let mainThreadCalled = false;
			rpcProtocol.set(MainContext.MainThreadWorkspace, new class extends mock<MainThreadWorkspace>() {
				override $startFileSearch(_includeFolder: UriComponents | null, options: IFileQueryBuilderOptions, token: CancellationToken): Promise<URI[] | null> {
					mainThreadCalled = true;
					assert.strictEqual(options.filePattern, 'glob/**');
					assert.strictEqual(options.includePattern, undefined);
					assert.deepStrictEqual(_includeFolder ? URI.from(_includeFolder).toJSON() : null, URI.file('/other/folder').toJSON());
					assert.strictEqual(options.excludePattern, undefined);
					assert.strictEqual(options.disregardExcludeSettings, false);
					return Promise.resolve(null);
				}
			});

			const ws = createExtHostWorkspace(rpcProtocol, { id: 'foo', folders: [aWorkspaceFolderData(URI.file(root), 0)], name: 'Test' }, new NullLogService());
			return ws.findFiles2(pattern, { maxResults: 10 }, new ExtensionIdentifier('test')).then(() => {
				assert(mainThreadCalled, 'mainThreadCalled');
			});
		}

		test('RelativePattern include (string)', () => {
			return testFindFiles2Include([new RelativePattern('/other/folder', 'glob/**')]);
		});

		test('RelativePattern include (URI)', () => {
			return testFindFiles2Include([new RelativePattern(URI.file('/other/folder'), 'glob/**')]);
		});

		test('no excludes', () => {
			const root = '/project/foo';
			const rpcProtocol = new TestRPCProtocol();

			let mainThreadCalled = false;
			rpcProtocol.set(MainContext.MainThreadWorkspace, new class extends mock<MainThreadWorkspace>() {
				override $startFileSearch(_includeFolder: UriComponents | null, options: IFileQueryBuilderOptions, token: CancellationToken): Promise<URI[] | null> {
					mainThreadCalled = true;
					assert.strictEqual(options.filePattern, 'glob/**');
					assert.strictEqual(options.includePattern, undefined);
					assert.deepStrictEqual(URI.revive(_includeFolder!).toString(), URI.file('/other/folder').toString());
					assert.strictEqual(options.excludePattern, undefined);
					assert.strictEqual(options.disregardExcludeSettings, false);
					return Promise.resolve(null);
				}
			});

			const ws = createExtHostWorkspace(rpcProtocol, { id: 'foo', folders: [aWorkspaceFolderData(URI.file(root), 0)], name: 'Test' }, new NullLogService());
			return ws.findFiles2([new RelativePattern('/other/folder', 'glob/**')], {}, new ExtensionIdentifier('test')).then(() => {
				assert(mainThreadCalled, 'mainThreadCalled');
			});
		});

		test('no dups', () => {
			const root = '/project/foo';
			const rpcProtocol = new TestRPCProtocol();

			let mainThreadCalled = false;
			rpcProtocol.set(MainContext.MainThreadWorkspace, new class extends mock<MainThreadWorkspace>() {
				override $startFileSearch(_includeFolder: UriComponents | null, options: IFileQueryBuilderOptions, token: CancellationToken): Promise<URI[] | null> {
					mainThreadCalled = true;
					assert.strictEqual(options.includePattern, undefined);
					assert.strictEqual(options.excludePattern, undefined);
					assert.strictEqual(options.disregardExcludeSettings, false);
					return Promise.resolve([URI.file(root + '/main.py')]);
				}
			});

			// Only add the root directory as a workspace folder - main.py will be a file within it
			const folders = [aWorkspaceFolderData(URI.file(root), 0)];
			const ws = createExtHostWorkspace(rpcProtocol, { id: 'foo', folders: folders, name: 'Test' }, new NullLogService());

			return ws.findFiles2(['**/main.py', '**/main.py/**'], {}, new ExtensionIdentifier('test')).then((uris) => {
				assert(mainThreadCalled, 'mainThreadCalled');
				assert.equal(uris.length, 1);
				assert.equal(uris[0].toString(), URI.file(root + '/main.py').toString());
			});
		});

		test('with cancelled token', () => {
			const root = '/project/foo';
			const rpcProtocol = new TestRPCProtocol();

			let mainThreadCalled = false;
			rpcProtocol.set(MainContext.MainThreadWorkspace, new class extends mock<MainThreadWorkspace>() {
				override $startFileSearch(_includeFolder: UriComponents | null, options: IFileQueryBuilderOptions, token: CancellationToken): Promise<URI[] | null> {
					mainThreadCalled = true;
					return Promise.resolve(null);
				}
			});

			const ws = createExtHostWorkspace(rpcProtocol, { id: 'foo', folders: [aWorkspaceFolderData(URI.file(root), 0)], name: 'Test' }, new NullLogService());

			const token = CancellationToken.Cancelled;
			return ws.findFiles2([new RelativePattern('/other/folder', 'glob/**')], {}, new ExtensionIdentifier('test'), token).then(() => {
				assert(!mainThreadCalled, '!mainThreadCalled');
			});
		});

		test('RelativePattern exclude', () => {
			const root = '/project/foo';
			const rpcProtocol = new TestRPCProtocol();

			let mainThreadCalled = false;
			rpcProtocol.set(MainContext.MainThreadWorkspace, new class extends mock<MainThreadWorkspace>() {
				override $startFileSearch(_includeFolder: UriComponents | null, options: IFileQueryBuilderOptions, token: CancellationToken): Promise<URI[] | null> {
					mainThreadCalled = true;
					assert.strictEqual(options.disregardExcludeSettings, false);
					assert.strictEqual(options.excludePattern?.length, 1);
					assert.strictEqual(options.excludePattern[0].pattern, 'glob/**'); // Note that the base portion is ignored, see #52651
					return Promise.resolve(null);
				}
			});

			const ws = createExtHostWorkspace(rpcProtocol, { id: 'foo', folders: [aWorkspaceFolderData(URI.file(root), 0)], name: 'Test' }, new NullLogService());
			return ws.findFiles2([''], { exclude: [new RelativePattern(root, 'glob/**')] }, new ExtensionIdentifier('test')).then(() => {
				assert(mainThreadCalled, 'mainThreadCalled');
			});
		});
		test('useIgnoreFiles', () => {
			const root = '/project/foo';
			const rpcProtocol = new TestRPCProtocol();

			let mainThreadCalled = false;
			rpcProtocol.set(MainContext.MainThreadWorkspace, new class extends mock<MainThreadWorkspace>() {
				override $startFileSearch(_includeFolder: UriComponents | null, options: IFileQueryBuilderOptions, token: CancellationToken): Promise<URI[] | null> {
					mainThreadCalled = true;
					assert.strictEqual(options.disregardExcludeSettings, false);
					assert.strictEqual(options.disregardIgnoreFiles, false);
					assert.strictEqual(options.disregardGlobalIgnoreFiles, false);
					assert.strictEqual(options.disregardParentIgnoreFiles, false);
					return Promise.resolve(null);
				}
			});

			const ws = createExtHostWorkspace(rpcProtocol, { id: 'foo', folders: [aWorkspaceFolderData(URI.file(root), 0)], name: 'Test' }, new NullLogService());
			return ws.findFiles2([''], { useIgnoreFiles: { local: true, parent: true, global: true } }, new ExtensionIdentifier('test')).then(() => {
				assert(mainThreadCalled, 'mainThreadCalled');
			});
		});

		test('use symlinks', () => {
			const root = '/project/foo';
			const rpcProtocol = new TestRPCProtocol();

			let mainThreadCalled = false;
			rpcProtocol.set(MainContext.MainThreadWorkspace, new class extends mock<MainThreadWorkspace>() {
				override $startFileSearch(_includeFolder: UriComponents | null, options: IFileQueryBuilderOptions, token: CancellationToken): Promise<URI[] | null> {
					mainThreadCalled = true;
					assert.strictEqual(options.ignoreSymlinks, false);
					return Promise.resolve(null);
				}
			});

			const ws = createExtHostWorkspace(rpcProtocol, { id: 'foo', folders: [aWorkspaceFolderData(URI.file(root), 0)], name: 'Test' }, new NullLogService());
			return ws.findFiles2([''], { followSymlinks: true }, new ExtensionIdentifier('test')).then(() => {
				assert(mainThreadCalled, 'mainThreadCalled');
			});
		});

		// todo: add tests with multiple filePatterns and excludes

	});

	suite('findTextInFiles -', function () {
		test('no include', async () => {
			const root = '/project/foo';
			const rpcProtocol = new TestRPCProtocol();

			let mainThreadCalled = false;
			rpcProtocol.set(MainContext.MainThreadWorkspace, new class extends mock<MainThreadWorkspace>() {
				override async $startTextSearch(query: IPatternInfo, folder: UriComponents | null, options: ITextQueryBuilderOptions, requestId: number, token: CancellationToken): Promise<ITextSearchComplete | null> {
					mainThreadCalled = true;
					assert.strictEqual(query.pattern, 'foo');
					assert.strictEqual(folder, null);
					assert.strictEqual(options.includePattern, undefined);
					assert.strictEqual(options.excludePattern, undefined);
					return null;
				}
			});

			const ws = createExtHostWorkspace(rpcProtocol, { id: 'foo', folders: [aWorkspaceFolderData(URI.file(root), 0)], name: 'Test' }, new NullLogService());
			await ws.findTextInFiles({ pattern: 'foo' }, {}, () => { }, new ExtensionIdentifier('test'));
			assert(mainThreadCalled, 'mainThreadCalled');
		});

		test('string include', async () => {
			const root = '/project/foo';
			const rpcProtocol = new TestRPCProtocol();

			let mainThreadCalled = false;
			rpcProtocol.set(MainContext.MainThreadWorkspace, new class extends mock<MainThreadWorkspace>() {
				override async $startTextSearch(query: IPatternInfo, folder: UriComponents | null, options: ITextQueryBuilderOptions, requestId: number, token: CancellationToken): Promise<ITextSearchComplete | null> {
					mainThreadCalled = true;
					assert.strictEqual(query.pattern, 'foo');
					assert.strictEqual(folder, null);
					assert.strictEqual(options.includePattern, '**/files');
					assert.strictEqual(options.excludePattern, undefined);
					return null;
				}
			});

			const ws = createExtHostWorkspace(rpcProtocol, { id: 'foo', folders: [aWorkspaceFolderData(URI.file(root), 0)], name: 'Test' }, new NullLogService());
			await ws.findTextInFiles({ pattern: 'foo' }, { include: '**/files' }, () => { }, new ExtensionIdentifier('test'));
			assert(mainThreadCalled, 'mainThreadCalled');
		});

		test('RelativePattern include', async () => {
			const root = '/project/foo';
			const rpcProtocol = new TestRPCProtocol();

			let mainThreadCalled = false;
			rpcProtocol.set(MainContext.MainThreadWorkspace, new class extends mock<MainThreadWorkspace>() {
				override async $startTextSearch(query: IPatternInfo, folder: UriComponents | null, options: ITextQueryBuilderOptions, requestId: number, token: CancellationToken): Promise<ITextSearchComplete | null> {
					mainThreadCalled = true;
					assert.strictEqual(query.pattern, 'foo');
					assert.deepStrictEqual(URI.revive(folder!).toString(), URI.file('/other/folder').toString());
					assert.strictEqual(options.includePattern, 'glob/**');
					assert.strictEqual(options.excludePattern, undefined);
					return null;
				}
			});

			const ws = createExtHostWorkspace(rpcProtocol, { id: 'foo', folders: [aWorkspaceFolderData(URI.file(root), 0)], name: 'Test' }, new NullLogService());
			await ws.findTextInFiles({ pattern: 'foo' }, { include: new RelativePattern('/other/folder', 'glob/**') }, () => { }, new ExtensionIdentifier('test'));
			assert(mainThreadCalled, 'mainThreadCalled');
		});

		test('with cancelled token', async () => {
			const root = '/project/foo';
			const rpcProtocol = new TestRPCProtocol();

			let mainThreadCalled = false;
			rpcProtocol.set(MainContext.MainThreadWorkspace, new class extends mock<MainThreadWorkspace>() {
				override async $startTextSearch(query: IPatternInfo, folder: UriComponents | null, options: ITextQueryBuilderOptions, requestId: number, token: CancellationToken): Promise<ITextSearchComplete | null> {
					mainThreadCalled = true;
					return null;
				}
			});

			const ws = createExtHostWorkspace(rpcProtocol, { id: 'foo', folders: [aWorkspaceFolderData(URI.file(root), 0)], name: 'Test' }, new NullLogService());
			const token = CancellationToken.Cancelled;
			await ws.findTextInFiles({ pattern: 'foo' }, {}, () => { }, new ExtensionIdentifier('test'), token);
			assert(!mainThreadCalled, '!mainThreadCalled');
		});

		test('RelativePattern exclude', async () => {
			const root = '/project/foo';
			const rpcProtocol = new TestRPCProtocol();

			let mainThreadCalled = false;
			rpcProtocol.set(MainContext.MainThreadWorkspace, new class extends mock<MainThreadWorkspace>() {
				override async $startTextSearch(query: IPatternInfo, folder: UriComponents | null, options: ITextQueryBuilderOptions, requestId: number, token: CancellationToken): Promise<ITextSearchComplete | null> {
					mainThreadCalled = true;
					assert.strictEqual(query.pattern, 'foo');
					assert.deepStrictEqual(folder, null);
					assert.strictEqual(options.includePattern, undefined);
					assert.strictEqual(options.excludePattern?.length, 1);
					assert.strictEqual(options.excludePattern[0].pattern, 'glob/**'); // exclude folder is ignored...
					return null;
				}
			});

			const ws = createExtHostWorkspace(rpcProtocol, { id: 'foo', folders: [aWorkspaceFolderData(URI.file(root), 0)], name: 'Test' }, new NullLogService());
			await ws.findTextInFiles({ pattern: 'foo' }, { exclude: new RelativePattern('/other/folder', 'glob/**') }, () => { }, new ExtensionIdentifier('test'));
			assert(mainThreadCalled, 'mainThreadCalled');
		});
	});

	suite('findTextInFiles2 -', function () {
		test('no include', async () => {
			const root = '/project/foo';
			const rpcProtocol = new TestRPCProtocol();

			let mainThreadCalled = false;
			rpcProtocol.set(MainContext.MainThreadWorkspace, new class extends mock<MainThreadWorkspace>() {
				override async $startTextSearch(query: IPatternInfo, folder: UriComponents | null, options: ITextQueryBuilderOptions, requestId: number, token: CancellationToken): Promise<ITextSearchComplete | null> {
					mainThreadCalled = true;
					assert.strictEqual(query.pattern, 'foo');
					assert.strictEqual(folder, null);
					assert.strictEqual(options.includePattern, undefined);
					assert.strictEqual(options.excludePattern, undefined);
					return null;
				}
			});

			const ws = createExtHostWorkspace(rpcProtocol, { id: 'foo', folders: [aWorkspaceFolderData(URI.file(root), 0)], name: 'Test' }, new NullLogService());
			await (ws.findTextInFiles2({ pattern: 'foo' }, {}, new ExtensionIdentifier('test'))).complete;
			assert(mainThreadCalled, 'mainThreadCalled');
		});

		test('string include', async () => {
			const root = '/project/foo';
			const rpcProtocol = new TestRPCProtocol();

			let mainThreadCalled = false;
			rpcProtocol.set(MainContext.MainThreadWorkspace, new class extends mock<MainThreadWorkspace>() {
				override async $startTextSearch(query: IPatternInfo, folder: UriComponents | null, options: ITextQueryBuilderOptions, requestId: number, token: CancellationToken): Promise<ITextSearchComplete | null> {
					mainThreadCalled = true;
					assert.strictEqual(query.pattern, 'foo');
					assert.strictEqual(folder, null);
					assert.strictEqual(options.includePattern, '**/files');
					assert.strictEqual(options.excludePattern, undefined);
					return null;
				}
			});

			const ws = createExtHostWorkspace(rpcProtocol, { id: 'foo', folders: [aWorkspaceFolderData(URI.file(root), 0)], name: 'Test' }, new NullLogService());
			await (ws.findTextInFiles2({ pattern: 'foo' }, { include: ['**/files'] }, new ExtensionIdentifier('test'))).complete;
			assert(mainThreadCalled, 'mainThreadCalled');
		});

		test('RelativePattern include', async () => {
			const root = '/project/foo';
			const rpcProtocol = new TestRPCProtocol();

			let mainThreadCalled = false;
			rpcProtocol.set(MainContext.MainThreadWorkspace, new class extends mock<MainThreadWorkspace>() {
				override async $startTextSearch(query: IPatternInfo, folder: UriComponents | null, options: ITextQueryBuilderOptions, requestId: number, token: CancellationToken): Promise<ITextSearchComplete | null> {
					mainThreadCalled = true;
					assert.strictEqual(query.pattern, 'foo');
					assert.deepStrictEqual(URI.revive(folder!).toString(), URI.file('/other/folder').toString());
					assert.strictEqual(options.includePattern, 'glob/**');
					assert.strictEqual(options.excludePattern, undefined);
					return null;
				}
			});

			const ws = createExtHostWorkspace(rpcProtocol, { id: 'foo', folders: [aWorkspaceFolderData(URI.file(root), 0)], name: 'Test' }, new NullLogService());
			await (ws.findTextInFiles2({ pattern: 'foo' }, { include: [new RelativePattern('/other/folder', 'glob/**')] }, new ExtensionIdentifier('test'))).complete;
			assert(mainThreadCalled, 'mainThreadCalled');
		});

		test('with cancelled token', async () => {
			const root = '/project/foo';
			const rpcProtocol = new TestRPCProtocol();

			let mainThreadCalled = false;
			rpcProtocol.set(MainContext.MainThreadWorkspace, new class extends mock<MainThreadWorkspace>() {
				override async $startTextSearch(query: IPatternInfo, folder: UriComponents | null, options: ITextQueryBuilderOptions, requestId: number, token: CancellationToken): Promise<ITextSearchComplete | null> {
					mainThreadCalled = true;
					return null;
				}
			});

			const ws = createExtHostWorkspace(rpcProtocol, { id: 'foo', folders: [aWorkspaceFolderData(URI.file(root), 0)], name: 'Test' }, new NullLogService());
			const token = CancellationToken.Cancelled;
			await (ws.findTextInFiles2({ pattern: 'foo' }, undefined, new ExtensionIdentifier('test'), token)).complete;
			assert(!mainThreadCalled, '!mainThreadCalled');
		});

		test('RelativePattern exclude', async () => {
			const root = '/project/foo';
			const rpcProtocol = new TestRPCProtocol();

			let mainThreadCalled = false;
			rpcProtocol.set(MainContext.MainThreadWorkspace, new class extends mock<MainThreadWorkspace>() {
				override async $startTextSearch(query: IPatternInfo, folder: UriComponents | null, options: ITextQueryBuilderOptions, requestId: number, token: CancellationToken): Promise<ITextSearchComplete | null> {
					mainThreadCalled = true;
					assert.strictEqual(query.pattern, 'foo');
					assert.deepStrictEqual(folder, null);
					assert.strictEqual(options.includePattern, undefined);
					assert.strictEqual(options.excludePattern?.length, 1);
					assert.strictEqual(options.excludePattern[0].pattern, 'glob/**'); // exclude folder is ignored...
					return null;
				}
			});

			const ws = createExtHostWorkspace(rpcProtocol, { id: 'foo', folders: [aWorkspaceFolderData(URI.file(root), 0)], name: 'Test' }, new NullLogService());
			await (ws.findTextInFiles2({ pattern: 'foo' }, { exclude: [new RelativePattern('/other/folder', 'glob/**')] }, new ExtensionIdentifier('test'))).complete;
			assert(mainThreadCalled, 'mainThreadCalled');
		});

		// TODO: test multiple includes/excludess
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/test/browser/mainThreadAuthentication.integrationTest.ts]---
Location: vscode-main/src/vs/workbench/api/test/browser/mainThreadAuthentication.integrationTest.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { TestDialogService } from '../../../../platform/dialogs/test/common/testDialogService.js';
import { TestInstantiationService } from '../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { TestNotificationService } from '../../../../platform/notification/test/common/testNotificationService.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { NullTelemetryService } from '../../../../platform/telemetry/common/telemetryUtils.js';
import { MainThreadAuthentication } from '../../browser/mainThreadAuthentication.js';
import { ExtHostContext, MainContext } from '../../common/extHost.protocol.js';
import { IActivityService } from '../../../services/activity/common/activity.js';
import { AuthenticationService } from '../../../services/authentication/browser/authenticationService.js';
import { IAuthenticationExtensionsService, IAuthenticationService } from '../../../services/authentication/common/authentication.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { IRemoteAgentService } from '../../../services/remote/common/remoteAgentService.js';
import { TestRPCProtocol } from '../common/testRPCProtocol.js';
import { TestEnvironmentService, TestHostService, TestQuickInputService, TestRemoteAgentService } from '../../../test/browser/workbenchTestServices.js';
import { TestActivityService, TestExtensionService, TestProductService, TestStorageService } from '../../../test/common/workbenchTestServices.js';
import { IBrowserWorkbenchEnvironmentService } from '../../../services/environment/browser/environmentService.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { AuthenticationAccessService, IAuthenticationAccessService } from '../../../services/authentication/browser/authenticationAccessService.js';
import { IAccountUsage, IAuthenticationUsageService } from '../../../services/authentication/browser/authenticationUsageService.js';
import { AuthenticationExtensionsService } from '../../../services/authentication/browser/authenticationExtensionsService.js';
import { ILogService, NullLogService } from '../../../../platform/log/common/log.js';
import { IHostService } from '../../../services/host/browser/host.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IUserActivityService, UserActivityService } from '../../../services/userActivity/common/userActivityService.js';
import { ISecretStorageService } from '../../../../platform/secrets/common/secrets.js';
import { TestSecretStorageService } from '../../../../platform/secrets/test/common/testSecretStorageService.js';
import { IDynamicAuthenticationProviderStorageService } from '../../../services/authentication/common/dynamicAuthenticationProviderStorage.js';
import { DynamicAuthenticationProviderStorageService } from '../../../services/authentication/browser/dynamicAuthenticationProviderStorageService.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { ServiceCollection } from '../../../../platform/instantiation/common/serviceCollection.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';

class TestAuthUsageService implements IAuthenticationUsageService {
	_serviceBrand: undefined;
	initializeExtensionUsageCache(): Promise<void> { return Promise.resolve(); }
	extensionUsesAuth(extensionId: string): Promise<boolean> { return Promise.resolve(false); }
	readAccountUsages(providerId: string, accountName: string): IAccountUsage[] { return []; }
	removeAccountUsage(providerId: string, accountName: string): void { }
	addAccountUsage(providerId: string, accountName: string, scopes: ReadonlyArray<string>, extensionId: string, extensionName: string): void { }
}

suite('MainThreadAuthentication', () => {
	const disposables = ensureNoDisposablesAreLeakedInTestSuite();

	let mainThreadAuthentication: MainThreadAuthentication;
	let instantiationService: TestInstantiationService;
	let rpcProtocol: TestRPCProtocol;

	setup(async () => {
		// services
		const services = new ServiceCollection();
		services.set(ILogService, new SyncDescriptor(NullLogService));
		services.set(IDialogService, new SyncDescriptor(TestDialogService, [{ confirmed: true }]));
		services.set(IStorageService, new SyncDescriptor(TestStorageService));
		services.set(ISecretStorageService, new SyncDescriptor(TestSecretStorageService));
		services.set(IDynamicAuthenticationProviderStorageService, new SyncDescriptor(DynamicAuthenticationProviderStorageService));
		services.set(IQuickInputService, new SyncDescriptor(TestQuickInputService));
		services.set(IExtensionService, new SyncDescriptor(TestExtensionService));
		services.set(IActivityService, new SyncDescriptor(TestActivityService));
		services.set(IRemoteAgentService, new SyncDescriptor(TestRemoteAgentService));
		services.set(INotificationService, new SyncDescriptor(TestNotificationService));
		services.set(IHostService, new SyncDescriptor(TestHostService));
		services.set(IUserActivityService, new SyncDescriptor(UserActivityService));
		services.set(IAuthenticationAccessService, new SyncDescriptor(AuthenticationAccessService));
		services.set(IAuthenticationService, new SyncDescriptor(AuthenticationService));
		services.set(IAuthenticationUsageService, new SyncDescriptor(TestAuthUsageService));
		services.set(IAuthenticationExtensionsService, new SyncDescriptor(AuthenticationExtensionsService));
		instantiationService = disposables.add(new TestInstantiationService(services, undefined, undefined, true));

		// stubs
		// eslint-disable-next-line local/code-no-dangerous-type-assertions
		instantiationService.stub(IOpenerService, {} as Partial<IOpenerService>);
		instantiationService.stub(ITelemetryService, NullTelemetryService);
		instantiationService.stub(IBrowserWorkbenchEnvironmentService, TestEnvironmentService);
		instantiationService.stub(IProductService, TestProductService);

		rpcProtocol = disposables.add(new TestRPCProtocol());
		mainThreadAuthentication = disposables.add(instantiationService.createInstance(MainThreadAuthentication, rpcProtocol));
		rpcProtocol.set(MainContext.MainThreadAuthentication, mainThreadAuthentication);
	});

	test('provider registration completes without errors', async () => {
		// Test basic registration - this should complete without throwing
		await mainThreadAuthentication.$registerAuthenticationProvider({
			id: 'test-provider',
			label: 'Test Provider',
			supportsMultipleAccounts: false
		});

		// Test unregistration - this should also complete without throwing
		await mainThreadAuthentication.$unregisterAuthenticationProvider('test-provider');

		// Success if we reach here without timeout
		assert.ok(true, 'Registration and unregistration completed successfully');
	});

	test('event suppression during explicit unregistration', async () => {
		let unregisterEventFired = false;
		let eventProviderId: string | undefined;

		// Mock the ext host to capture unregister events
		const mockExtHost = {
			$onDidUnregisterAuthenticationProvider: (id: string) => {
				unregisterEventFired = true;
				eventProviderId = id;
				return Promise.resolve();
			},
			$getSessions: () => Promise.resolve([]),
			// eslint-disable-next-line local/code-no-any-casts
			$createSession: () => Promise.resolve({} as any),
			$removeSession: () => Promise.resolve(),
			$onDidChangeAuthenticationSessions: () => Promise.resolve(),
			$registerDynamicAuthProvider: () => Promise.resolve('test'),
			$onDidChangeDynamicAuthProviderTokens: () => Promise.resolve(),
			$getSessionsFromChallenges: () => Promise.resolve([]),
			// eslint-disable-next-line local/code-no-any-casts
			$createSessionFromChallenges: () => Promise.resolve({} as any),
		};
		rpcProtocol.set(ExtHostContext.ExtHostAuthentication, mockExtHost);

		// Register a provider
		await mainThreadAuthentication.$registerAuthenticationProvider({
			id: 'test-suppress',
			label: 'Test Suppress',
			supportsMultipleAccounts: false
		});

		// Reset the flag
		unregisterEventFired = false;
		eventProviderId = undefined;

		// Unregister the provider - this should NOT fire the event due to suppression
		await mainThreadAuthentication.$unregisterAuthenticationProvider('test-suppress');

		// Verify the event was suppressed
		assert.strictEqual(unregisterEventFired, false, 'Unregister event should be suppressed during explicit unregistration');
		assert.strictEqual(eventProviderId, undefined, 'No provider ID should be captured from suppressed event');
	});

	test('concurrent provider registrations complete without errors', async () => {
		// Register multiple providers simultaneously
		const registrationPromises = [
			mainThreadAuthentication.$registerAuthenticationProvider({
				id: 'concurrent-1',
				label: 'Concurrent 1',
				supportsMultipleAccounts: false
			}),
			mainThreadAuthentication.$registerAuthenticationProvider({
				id: 'concurrent-2',
				label: 'Concurrent 2',
				supportsMultipleAccounts: false
			}),
			mainThreadAuthentication.$registerAuthenticationProvider({
				id: 'concurrent-3',
				label: 'Concurrent 3',
				supportsMultipleAccounts: false
			})
		];

		await Promise.all(registrationPromises);

		// Unregister all providers
		const unregistrationPromises = [
			mainThreadAuthentication.$unregisterAuthenticationProvider('concurrent-1'),
			mainThreadAuthentication.$unregisterAuthenticationProvider('concurrent-2'),
			mainThreadAuthentication.$unregisterAuthenticationProvider('concurrent-3')
		];

		await Promise.all(unregistrationPromises);

		// Success if we reach here without timeout
		assert.ok(true, 'Concurrent registrations and unregistrations completed successfully');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/test/browser/mainThreadBulkEdits.test.ts]---
Location: vscode-main/src/vs/workbench/api/test/browser/mainThreadBulkEdits.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { IWorkspaceTextEditDto } from '../../common/extHost.protocol.js';
import { mock } from '../../../../base/test/common/mock.js';
import { Event } from '../../../../base/common/event.js';
import { URI } from '../../../../base/common/uri.js';
import { FileSystemProviderCapabilities, IFileService } from '../../../../platform/files/common/files.js';
import { reviveWorkspaceEditDto } from '../../browser/mainThreadBulkEdits.js';
import { UriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentityService.js';
import { IWorkspaceTextEdit } from '../../../../editor/common/languages.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';

suite('MainThreadBulkEdits', function () {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('"Rename failed to apply edits" in monorepo with pnpm #158845', function () {


		const fileService = new class extends mock<IFileService>() {
			override onDidChangeFileSystemProviderCapabilities = Event.None;
			override onDidChangeFileSystemProviderRegistrations = Event.None;

			override hasProvider(uri: URI) {
				return true;
			}

			override hasCapability(resource: URI, capability: FileSystemProviderCapabilities): boolean {
				// if (resource.scheme === 'case' && capability === FileSystemProviderCapabilities.PathCaseSensitive) {
				// 	return false;
				// }
				// NO capabilities, esp not being case-sensitive
				return false;
			}
		};

		const uriIdentityService = new UriIdentityService(fileService);

		const edits: IWorkspaceTextEditDto[] = [
			{ resource: URI.from({ scheme: 'case', path: '/hello/WORLD/foo.txt' }), textEdit: { range: { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 }, text: 'sss' }, versionId: undefined },
			{ resource: URI.from({ scheme: 'case', path: '/heLLO/world/fOO.txt' }), textEdit: { range: { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 }, text: 'sss' }, versionId: undefined },
			{ resource: URI.from({ scheme: 'case', path: '/other/path.txt' }), textEdit: { range: { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 }, text: 'sss' }, versionId: undefined },
			{ resource: URI.from({ scheme: 'foo', path: '/other/path.txt' }), textEdit: { range: { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 }, text: 'sss' }, versionId: undefined },
		];


		const out = reviveWorkspaceEditDto({ edits }, uriIdentityService);

		assert.strictEqual((<IWorkspaceTextEdit>out.edits[0]).resource.path, '/hello/WORLD/foo.txt');
		assert.strictEqual((<IWorkspaceTextEdit>out.edits[1]).resource.path, '/hello/WORLD/foo.txt'); // the FIRST occurrence defined the shape!
		assert.strictEqual((<IWorkspaceTextEdit>out.edits[2]).resource.path, '/other/path.txt');
		assert.strictEqual((<IWorkspaceTextEdit>out.edits[3]).resource.path, '/other/path.txt');

		uriIdentityService.dispose();

	});
});
```

--------------------------------------------------------------------------------

````
