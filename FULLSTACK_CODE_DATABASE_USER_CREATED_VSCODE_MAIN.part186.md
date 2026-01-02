---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 186
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 186 of 552)

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

---[FILE: src/vs/base/test/common/async.test.ts]---
Location: vscode-main/src/vs/base/test/common/async.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import * as async from '../../common/async.js';
import * as MicrotaskDelay from '../../common/symbols.js';
import { CancellationToken, CancellationTokenSource } from '../../common/cancellation.js';
import { isCancellationError } from '../../common/errors.js';
import { Event } from '../../common/event.js';
import { URI } from '../../common/uri.js';
import { runWithFakedTimers } from './timeTravelScheduler.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';
import { DisposableStore } from '../../common/lifecycle.js';
import { Iterable } from '../../common/iterator.js';

suite('Async', () => {

	const store = ensureNoDisposablesAreLeakedInTestSuite();

	suite('cancelablePromise', function () {
		test('set token, don\'t wait for inner promise', function () {
			let canceled = 0;
			const promise = async.createCancelablePromise(token => {
				store.add(token.onCancellationRequested(_ => { canceled += 1; }));
				return new Promise(resolve => { /*never*/ });
			});
			const result = promise.then(_ => assert.ok(false), err => {
				assert.strictEqual(canceled, 1);
				assert.ok(isCancellationError(err));
			});
			promise.cancel();
			promise.cancel(); // cancel only once
			return result;
		});

		test('cancel despite inner promise being resolved', function () {
			let canceled = 0;
			const promise = async.createCancelablePromise(token => {
				store.add(token.onCancellationRequested(_ => { canceled += 1; }));
				return Promise.resolve(1234);
			});
			const result = promise.then(_ => assert.ok(false), err => {
				assert.strictEqual(canceled, 1);
				assert.ok(isCancellationError(err));
			});
			promise.cancel();
			return result;
		});

		test('cancel disposes result', function () {

			const store = new DisposableStore();

			const promise = async.createCancelablePromise(async token => {
				return store;
			});
			promise.then(_ => assert.ok(false), err => {

				assert.ok(isCancellationError(err));
				assert.ok(store.isDisposed);
			});

			promise.cancel();
		});

		// Cancelling a sync cancelable promise will fire the cancelled token.
		// Also, every `then` callback runs in another execution frame.
		test('execution order (sync)', function () {
			const order: string[] = [];

			const cancellablePromise = async.createCancelablePromise(token => {
				order.push('in callback');
				store.add(token.onCancellationRequested(_ => order.push('cancelled')));
				return Promise.resolve(1234);
			});

			order.push('afterCreate');

			const promise = cancellablePromise
				.then(undefined, err => null)
				.then(() => order.push('finally'));

			cancellablePromise.cancel();
			order.push('afterCancel');

			return promise.then(() => assert.deepStrictEqual(order, ['in callback', 'afterCreate', 'cancelled', 'afterCancel', 'finally']));
		});

		// Cancelling an async cancelable promise is just the same as a sync cancellable promise.
		test('execution order (async)', function () {
			const order: string[] = [];

			const cancellablePromise = async.createCancelablePromise(token => {
				order.push('in callback');
				store.add(token.onCancellationRequested(_ => order.push('cancelled')));
				return new Promise(c => setTimeout(c.bind(1234), 0));
			});

			order.push('afterCreate');

			const promise = cancellablePromise
				.then(undefined, err => null)
				.then(() => order.push('finally'));

			cancellablePromise.cancel();
			order.push('afterCancel');

			return promise.then(() => assert.deepStrictEqual(order, ['in callback', 'afterCreate', 'cancelled', 'afterCancel', 'finally']));
		});

		test('execution order (async with late listener)', async function () {
			const order: string[] = [];

			const cancellablePromise = async.createCancelablePromise(async token => {
				order.push('in callback');

				await async.timeout(0);
				store.add(token.onCancellationRequested(_ => order.push('cancelled')));
				cancellablePromise.cancel();
				order.push('afterCancel');
			});

			order.push('afterCreate');

			const promise = cancellablePromise
				.then(undefined, err => null)
				.then(() => order.push('finally'));

			return promise.then(() => assert.deepStrictEqual(order, ['in callback', 'afterCreate', 'cancelled', 'afterCancel', 'finally']));
		});

		test('get inner result', async function () {
			const promise = async.createCancelablePromise(token => {
				return async.timeout(12).then(_ => 1234);
			});

			const result = await promise;
			assert.strictEqual(result, 1234);
		});
	});

	suite('Throttler', function () {
		test('non async', function () {
			let count = 0;
			const factory = () => {
				return Promise.resolve(++count);
			};

			const throttler = new async.Throttler();

			return Promise.all([
				throttler.queue(factory).then((result) => { assert.strictEqual(result, 1); }),
				throttler.queue(factory).then((result) => { assert.strictEqual(result, 2); }),
				throttler.queue(factory).then((result) => { assert.strictEqual(result, 2); }),
				throttler.queue(factory).then((result) => { assert.strictEqual(result, 2); }),
				throttler.queue(factory).then((result) => { assert.strictEqual(result, 2); })
			]).then(() => assert.strictEqual(count, 2));
		});

		test('async', () => {
			let count = 0;
			const factory = () => async.timeout(0).then(() => ++count);

			const throttler = new async.Throttler();

			return Promise.all([
				throttler.queue(factory).then((result) => { assert.strictEqual(result, 1); }),
				throttler.queue(factory).then((result) => { assert.strictEqual(result, 2); }),
				throttler.queue(factory).then((result) => { assert.strictEqual(result, 2); }),
				throttler.queue(factory).then((result) => { assert.strictEqual(result, 2); }),
				throttler.queue(factory).then((result) => { assert.strictEqual(result, 2); })
			]).then(() => {
				return Promise.all([
					throttler.queue(factory).then((result) => { assert.strictEqual(result, 3); }),
					throttler.queue(factory).then((result) => { assert.strictEqual(result, 4); }),
					throttler.queue(factory).then((result) => { assert.strictEqual(result, 4); }),
					throttler.queue(factory).then((result) => { assert.strictEqual(result, 4); }),
					throttler.queue(factory).then((result) => { assert.strictEqual(result, 4); })
				]);
			});
		});

		test('last factory should be the one getting called', function () {
			const factoryFactory = (n: number) => () => {
				return async.timeout(0).then(() => n);
			};

			const throttler = new async.Throttler();

			const promises: Promise<any>[] = [];

			promises.push(throttler.queue(factoryFactory(1)).then((n) => { assert.strictEqual(n, 1); }));
			promises.push(throttler.queue(factoryFactory(2)).then((n) => { assert.strictEqual(n, 3); }));
			promises.push(throttler.queue(factoryFactory(3)).then((n) => { assert.strictEqual(n, 3); }));

			return Promise.all(promises);
		});

		test('disposal after queueing', async () => {
			let factoryCalls = 0;
			const factory = async () => {
				factoryCalls++;
				return async.timeout(0);
			};

			const throttler = new async.Throttler();
			const promises: Promise<any>[] = [];

			promises.push(throttler.queue(factory));
			promises.push(throttler.queue(factory));
			throttler.dispose();

			await Promise.all(promises);
			assert.strictEqual(factoryCalls, 1);
		});

		test('disposal before queueing', async () => {
			let factoryCalls = 0;
			const factory = async () => {
				factoryCalls++;
				return async.timeout(0);
			};

			const throttler = new async.Throttler();
			const promises: Promise<any>[] = [];

			throttler.dispose();
			promises.push(throttler.queue(factory));

			try {
				await Promise.all(promises);
				assert.fail('should fail');
			} catch (err) {
				assert.strictEqual(factoryCalls, 0);
			}
		});
	});

	suite('Delayer', function () {
		test('simple', () => {
			let count = 0;
			const factory = () => {
				return Promise.resolve(++count);
			};

			const delayer = new async.Delayer(0);
			const promises: Promise<any>[] = [];

			assert(!delayer.isTriggered());

			promises.push(delayer.trigger(factory).then((result) => { assert.strictEqual(result, 1); assert(!delayer.isTriggered()); }));
			assert(delayer.isTriggered());

			promises.push(delayer.trigger(factory).then((result) => { assert.strictEqual(result, 1); assert(!delayer.isTriggered()); }));
			assert(delayer.isTriggered());

			promises.push(delayer.trigger(factory).then((result) => { assert.strictEqual(result, 1); assert(!delayer.isTriggered()); }));
			assert(delayer.isTriggered());

			return Promise.all(promises).then(() => {
				assert(!delayer.isTriggered());
			});
		});

		test('microtask delay simple', () => {
			let count = 0;
			const factory = () => {
				return Promise.resolve(++count);
			};

			const delayer = new async.Delayer(MicrotaskDelay.MicrotaskDelay);
			const promises: Promise<any>[] = [];

			assert(!delayer.isTriggered());

			promises.push(delayer.trigger(factory).then((result) => { assert.strictEqual(result, 1); assert(!delayer.isTriggered()); }));
			assert(delayer.isTriggered());

			promises.push(delayer.trigger(factory).then((result) => { assert.strictEqual(result, 1); assert(!delayer.isTriggered()); }));
			assert(delayer.isTriggered());

			promises.push(delayer.trigger(factory).then((result) => { assert.strictEqual(result, 1); assert(!delayer.isTriggered()); }));
			assert(delayer.isTriggered());

			return Promise.all(promises).then(() => {
				assert(!delayer.isTriggered());
			});
		});

		suite('ThrottledDelayer', () => {
			test('promise should resolve if disposed', async () => {
				const throttledDelayer = new async.ThrottledDelayer<void>(100);
				const promise = throttledDelayer.trigger(async () => { }, 0);
				throttledDelayer.dispose();

				try {
					await promise;
					assert.fail('SHOULD NOT BE HERE');
				} catch (err) {
					// OK
				}
			});

			test('trigger after dispose throws', async () => {
				const throttledDelayer = new async.ThrottledDelayer<void>(100);
				throttledDelayer.dispose();
				await assert.rejects(() => throttledDelayer.trigger(async () => { }, 0));
			});
		});

		test('simple cancel', function () {
			let count = 0;
			const factory = () => {
				return Promise.resolve(++count);
			};

			const delayer = new async.Delayer(0);

			assert(!delayer.isTriggered());

			const p = delayer.trigger(factory).then(() => {
				assert(false);
			}, () => {
				assert(true, 'yes, it was cancelled');
			});

			assert(delayer.isTriggered());
			delayer.cancel();
			assert(!delayer.isTriggered());

			return p;
		});

		test('simple cancel microtask', function () {
			let count = 0;
			const factory = () => {
				return Promise.resolve(++count);
			};

			const delayer = new async.Delayer(MicrotaskDelay.MicrotaskDelay);

			assert(!delayer.isTriggered());

			const p = delayer.trigger(factory).then(() => {
				assert(false);
			}, () => {
				assert(true, 'yes, it was cancelled');
			});

			assert(delayer.isTriggered());
			delayer.cancel();
			assert(!delayer.isTriggered());

			return p;
		});

		test('cancel should cancel all calls to trigger', function () {
			let count = 0;
			const factory = () => {
				return Promise.resolve(++count);
			};

			const delayer = new async.Delayer(0);
			const promises: Promise<any>[] = [];

			assert(!delayer.isTriggered());

			promises.push(delayer.trigger(factory).then(undefined, () => { assert(true, 'yes, it was cancelled'); }));
			assert(delayer.isTriggered());

			promises.push(delayer.trigger(factory).then(undefined, () => { assert(true, 'yes, it was cancelled'); }));
			assert(delayer.isTriggered());

			promises.push(delayer.trigger(factory).then(undefined, () => { assert(true, 'yes, it was cancelled'); }));
			assert(delayer.isTriggered());

			delayer.cancel();

			return Promise.all(promises).then(() => {
				assert(!delayer.isTriggered());
			});
		});

		test('trigger, cancel, then trigger again', function () {
			let count = 0;
			const factory = () => {
				return Promise.resolve(++count);
			};

			const delayer = new async.Delayer(0);
			let promises: Promise<any>[] = [];

			assert(!delayer.isTriggered());

			const p = delayer.trigger(factory).then((result) => {
				assert.strictEqual(result, 1);
				assert(!delayer.isTriggered());

				promises.push(delayer.trigger(factory).then(undefined, () => { assert(true, 'yes, it was cancelled'); }));
				assert(delayer.isTriggered());

				promises.push(delayer.trigger(factory).then(undefined, () => { assert(true, 'yes, it was cancelled'); }));
				assert(delayer.isTriggered());

				delayer.cancel();

				const p = Promise.all(promises).then(() => {
					promises = [];

					assert(!delayer.isTriggered());

					promises.push(delayer.trigger(factory).then(() => { assert.strictEqual(result, 1); assert(!delayer.isTriggered()); }));
					assert(delayer.isTriggered());

					promises.push(delayer.trigger(factory).then(() => { assert.strictEqual(result, 1); assert(!delayer.isTriggered()); }));
					assert(delayer.isTriggered());

					const p = Promise.all(promises).then(() => {
						assert(!delayer.isTriggered());
					});

					assert(delayer.isTriggered());

					return p;
				});

				return p;
			});

			assert(delayer.isTriggered());

			return p;
		});

		test('last task should be the one getting called', function () {
			const factoryFactory = (n: number) => () => {
				return Promise.resolve(n);
			};

			const delayer = new async.Delayer(0);
			const promises: Promise<any>[] = [];

			assert(!delayer.isTriggered());

			promises.push(delayer.trigger(factoryFactory(1)).then((n) => { assert.strictEqual(n, 3); }));
			promises.push(delayer.trigger(factoryFactory(2)).then((n) => { assert.strictEqual(n, 3); }));
			promises.push(delayer.trigger(factoryFactory(3)).then((n) => { assert.strictEqual(n, 3); }));

			const p = Promise.all(promises).then(() => {
				assert(!delayer.isTriggered());
			});

			assert(delayer.isTriggered());

			return p;
		});
	});

	suite('sequence', () => {
		test('simple', () => {
			const factoryFactory = (n: number) => () => {
				return Promise.resolve(n);
			};

			return async.sequence([
				factoryFactory(1),
				factoryFactory(2),
				factoryFactory(3),
				factoryFactory(4),
				factoryFactory(5),
			]).then((result) => {
				assert.strictEqual(5, result.length);
				assert.strictEqual(1, result[0]);
				assert.strictEqual(2, result[1]);
				assert.strictEqual(3, result[2]);
				assert.strictEqual(4, result[3]);
				assert.strictEqual(5, result[4]);
			});
		});
	});

	suite('Limiter', () => {
		test('assert degree of paralellism', function () {
			let activePromises = 0;
			const factoryFactory = (n: number) => () => {
				activePromises++;
				assert(activePromises < 6);
				return async.timeout(0).then(() => { activePromises--; return n; });
			};

			const limiter = new async.Limiter(5);

			const promises: Promise<any>[] = [];
			[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(n => promises.push(limiter.queue(factoryFactory(n))));

			return Promise.all(promises).then((res) => {
				assert.strictEqual(10, res.length);
				assert.deepStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], res);
			});
		});
	});


	suite('Queue', () => {
		test('simple', function () {
			const queue = new async.Queue();

			let syncPromise = false;
			const f1 = () => Promise.resolve(true).then(() => syncPromise = true);

			let asyncPromise = false;
			const f2 = () => async.timeout(10).then(() => asyncPromise = true);

			assert.strictEqual(queue.size, 0);

			queue.queue(f1);
			assert.strictEqual(queue.size, 1);

			const p = queue.queue(f2);
			assert.strictEqual(queue.size, 2);
			return p.then(() => {
				assert.strictEqual(queue.size, 0);
				assert.ok(syncPromise);
				assert.ok(asyncPromise);
			});
		});

		test('stop processing on dispose', async function () {
			const queue = new async.Queue();

			let workCounter = 0;
			const task = async () => {
				await async.timeout(0);
				workCounter++;
				queue.dispose(); // DISPOSE HERE
			};

			const p1 = queue.queue(task);
			queue.queue(task);
			queue.queue(task);
			assert.strictEqual(queue.size, 3);


			await p1;

			assert.strictEqual(workCounter, 1);
		});

		test('stop on clear', async function () {
			const queue = new async.Queue();

			let workCounter = 0;
			const task = async () => {
				await async.timeout(0);
				workCounter++;
				queue.clear(); // CLEAR HERE
				assert.strictEqual(queue.size, 1); // THIS task is still running
			};

			const p1 = queue.queue(task);
			queue.queue(task);
			queue.queue(task);
			assert.strictEqual(queue.size, 3);

			await p1;
			assert.strictEqual(workCounter, 1);
			assert.strictEqual(queue.size, 0); // has been cleared


			const p2 = queue.queue(task);
			await p2;
			assert.strictEqual(workCounter, 2);
		});

		test('clear and drain (1)', async function () {
			const queue = new async.Queue();

			let workCounter = 0;
			const task = async () => {
				await async.timeout(0);
				workCounter++;
				queue.clear(); // CLEAR HERE
			};

			const p0 = Event.toPromise(queue.onDrained);
			const p1 = queue.queue(task);

			await p1;
			await p0; // expect drain to fire because a task was running
			assert.strictEqual(workCounter, 1);
			queue.dispose();
		});

		test('clear and drain (2)', async function () {
			const queue = new async.Queue();

			let didFire = false;
			const d = queue.onDrained(() => {
				didFire = true;
			});

			queue.clear();

			assert.strictEqual(didFire, false); // no work, no drain!
			d.dispose();
			queue.dispose();
		});

		test('drain timing', async function () {
			const queue = new async.Queue();

			const logicClock = new class {
				private time = 0;
				tick() {
					return this.time++;
				}
			};

			let didDrainTime = 0;
			let didFinishTime1 = 0;
			let didFinishTime2 = 0;
			const d = queue.onDrained(() => {
				didDrainTime = logicClock.tick();
			});

			const p1 = queue.queue(() => {
				// await async.timeout(10);
				didFinishTime1 = logicClock.tick();
				return Promise.resolve();
			});

			const p2 = queue.queue(async () => {
				await async.timeout(10);
				didFinishTime2 = logicClock.tick();
			});


			await Promise.all([p1, p2]);

			assert.strictEqual(didFinishTime1, 0);
			assert.strictEqual(didFinishTime2, 1);
			assert.strictEqual(didDrainTime, 2);

			d.dispose();
			queue.dispose();
		});

		test('drain event is send only once', async function () {
			const queue = new async.Queue();

			let drainCount = 0;
			const d = queue.onDrained(() => { drainCount++; });
			queue.queue(async () => { });
			queue.queue(async () => { });
			queue.queue(async () => { });
			queue.queue(async () => { });
			assert.strictEqual(drainCount, 0);
			assert.strictEqual(queue.size, 4);

			await queue.whenIdle();

			assert.strictEqual(drainCount, 1);

			d.dispose();
			queue.dispose();
		});

		test('order is kept', function () {
			return runWithFakedTimers({}, () => {
				const queue = new async.Queue();

				const res: number[] = [];

				const f1 = () => Promise.resolve(true).then(() => res.push(1));
				const f2 = () => async.timeout(10).then(() => res.push(2));
				const f3 = () => Promise.resolve(true).then(() => res.push(3));
				const f4 = () => async.timeout(20).then(() => res.push(4));
				const f5 = () => async.timeout(0).then(() => res.push(5));

				queue.queue(f1);
				queue.queue(f2);
				queue.queue(f3);
				queue.queue(f4);
				return queue.queue(f5).then(() => {
					assert.strictEqual(res[0], 1);
					assert.strictEqual(res[1], 2);
					assert.strictEqual(res[2], 3);
					assert.strictEqual(res[3], 4);
					assert.strictEqual(res[4], 5);
				});
			});
		});

		test('errors bubble individually but not cause stop', function () {
			const queue = new async.Queue();

			const res: number[] = [];
			let error = false;

			const f1 = () => Promise.resolve(true).then(() => res.push(1));
			const f2 = () => async.timeout(10).then(() => res.push(2));
			const f3 = () => Promise.resolve(true).then(() => Promise.reject(new Error('error')));
			const f4 = () => async.timeout(20).then(() => res.push(4));
			const f5 = () => async.timeout(0).then(() => res.push(5));

			queue.queue(f1);
			queue.queue(f2);
			queue.queue(f3).then(undefined, () => error = true);
			queue.queue(f4);
			return queue.queue(f5).then(() => {
				assert.strictEqual(res[0], 1);
				assert.strictEqual(res[1], 2);
				assert.ok(error);
				assert.strictEqual(res[2], 4);
				assert.strictEqual(res[3], 5);
			});
		});

		test('order is kept (chained)', function () {
			const queue = new async.Queue();

			const res: number[] = [];

			const f1 = () => Promise.resolve(true).then(() => res.push(1));
			const f2 = () => async.timeout(10).then(() => res.push(2));
			const f3 = () => Promise.resolve(true).then(() => res.push(3));
			const f4 = () => async.timeout(20).then(() => res.push(4));
			const f5 = () => async.timeout(0).then(() => res.push(5));

			return queue.queue(f1).then(() => {
				return queue.queue(f2).then(() => {
					return queue.queue(f3).then(() => {
						return queue.queue(f4).then(() => {
							return queue.queue(f5).then(() => {
								assert.strictEqual(res[0], 1);
								assert.strictEqual(res[1], 2);
								assert.strictEqual(res[2], 3);
								assert.strictEqual(res[3], 4);
								assert.strictEqual(res[4], 5);
							});
						});
					});
				});
			});
		});

		test('events', async function () {
			const queue = new async.Queue();

			let drained = false;
			const onDrained = Event.toPromise(queue.onDrained).then(() => drained = true);

			const res: number[] = [];

			const f1 = () => async.timeout(10).then(() => res.push(2));
			const f2 = () => async.timeout(20).then(() => res.push(4));
			const f3 = () => async.timeout(0).then(() => res.push(5));

			const q1 = queue.queue(f1);
			const q2 = queue.queue(f2);
			queue.queue(f3);

			q1.then(() => {
				assert.ok(!drained);
				q2.then(() => {
					assert.ok(!drained);
				});
			});

			await onDrained;
			assert.ok(drained);
		});
	});

	suite('ResourceQueue', () => {
		test('simple', async function () {
			const queue = new async.ResourceQueue();

			await queue.whenDrained(); // returns immediately since empty

			let done1 = false;
			queue.queueFor(URI.file('/some/path'), async () => { done1 = true; });
			await queue.whenDrained(); // returns immediately since no work scheduled
			assert.strictEqual(done1, true);

			let done2 = false;
			queue.queueFor(URI.file('/some/other/path'), async () => { done2 = true; });
			await queue.whenDrained(); // returns immediately since no work scheduled
			assert.strictEqual(done2, true);

			// schedule some work
			const w1 = new async.DeferredPromise<void>();
			queue.queueFor(URI.file('/some/path'), () => w1.p);

			let drained = false;
			queue.whenDrained().then(() => drained = true);
			assert.strictEqual(drained, false);
			await w1.complete();
			await async.timeout(0);
			assert.strictEqual(drained, true);

			// schedule some work
			const w2 = new async.DeferredPromise<void>();
			const w3 = new async.DeferredPromise<void>();
			queue.queueFor(URI.file('/some/path'), () => w2.p);
			queue.queueFor(URI.file('/some/other/path'), () => w3.p);

			drained = false;
			queue.whenDrained().then(() => drained = true);

			queue.dispose();
			await async.timeout(0);
			assert.strictEqual(drained, true);
		});
	});

	suite('retry', () => {
		test('success case', async () => {
			return runWithFakedTimers({ useFakeTimers: true }, async () => {
				let counter = 0;

				const res = await async.retry(() => {
					counter++;
					if (counter < 2) {
						return Promise.reject(new Error('fail'));
					}

					return Promise.resolve(true);
				}, 10, 3);

				assert.strictEqual(res, true);
			});
		});

		test('error case', async () => {
			return runWithFakedTimers({ useFakeTimers: true }, async () => {
				const expectedError = new Error('fail');
				try {
					await async.retry(() => {
						return Promise.reject(expectedError);
					}, 10, 3);
				} catch (error) {
					assert.strictEqual(error, error);
				}
			});
		});
	});

	suite('TaskSequentializer', () => {
		test('execution basics', async function () {
			const sequentializer = new async.TaskSequentializer();

			assert.ok(!sequentializer.isRunning());
			assert.ok(!sequentializer.hasQueued());
			assert.ok(!sequentializer.isRunning(2323));
			assert.ok(!sequentializer.running);

			// pending removes itself after done
			await sequentializer.run(1, Promise.resolve());
			assert.ok(!sequentializer.isRunning());
			assert.ok(!sequentializer.isRunning(1));
			assert.ok(!sequentializer.running);
			assert.ok(!sequentializer.hasQueued());

			// pending removes itself after done (use async.timeout)
			sequentializer.run(2, async.timeout(1));
			assert.ok(sequentializer.isRunning());
			assert.ok(sequentializer.isRunning(2));
			assert.ok(!sequentializer.hasQueued());
			assert.strictEqual(sequentializer.isRunning(1), false);
			assert.ok(sequentializer.running);

			await async.timeout(2);
			assert.strictEqual(sequentializer.isRunning(), false);
			assert.strictEqual(sequentializer.isRunning(2), false);
			assert.ok(!sequentializer.running);
		});

		test('executing and queued (finishes instantly)', async function () {
			const sequentializer = new async.TaskSequentializer();

			let pendingDone = false;
			sequentializer.run(1, async.timeout(1).then(() => { pendingDone = true; return; }));

			// queued finishes instantly
			let queuedDone = false;
			const res = sequentializer.queue(() => Promise.resolve(null).then(() => { queuedDone = true; return; }));

			assert.ok(sequentializer.hasQueued());

			await res;
			assert.ok(pendingDone);
			assert.ok(queuedDone);
			assert.ok(!sequentializer.hasQueued());
		});

		test('executing and queued (finishes after timeout)', async function () {
			const sequentializer = new async.TaskSequentializer();

			let pendingDone = false;
			sequentializer.run(1, async.timeout(1).then(() => { pendingDone = true; return; }));

			// queued finishes after async.timeout
			let queuedDone = false;
			const res = sequentializer.queue(() => async.timeout(1).then(() => { queuedDone = true; return; }));

			await res;
			assert.ok(pendingDone);
			assert.ok(queuedDone);
			assert.ok(!sequentializer.hasQueued());
		});

		test('join (without executing or queued)', async function () {
			const sequentializer = new async.TaskSequentializer();

			await sequentializer.join();
			assert.ok(!sequentializer.hasQueued());
		});

		test('join (without queued)', async function () {
			const sequentializer = new async.TaskSequentializer();

			let pendingDone = false;
			sequentializer.run(1, async.timeout(1).then(() => { pendingDone = true; return; }));

			await sequentializer.join();
			assert.ok(pendingDone);
			assert.ok(!sequentializer.isRunning());
		});

		test('join (with executing and queued)', async function () {
			const sequentializer = new async.TaskSequentializer();

			let pendingDone = false;
			sequentializer.run(1, async.timeout(1).then(() => { pendingDone = true; return; }));

			// queued finishes after async.timeout
			let queuedDone = false;
			sequentializer.queue(() => async.timeout(1).then(() => { queuedDone = true; return; }));

			await sequentializer.join();
			assert.ok(pendingDone);
			assert.ok(queuedDone);
			assert.ok(!sequentializer.isRunning());
			assert.ok(!sequentializer.hasQueued());
		});

		test('executing and multiple queued (last one wins)', async function () {
			const sequentializer = new async.TaskSequentializer();

			let pendingDone = false;
			sequentializer.run(1, async.timeout(1).then(() => { pendingDone = true; return; }));

			// queued finishes after async.timeout
			let firstDone = false;
			const firstRes = sequentializer.queue(() => async.timeout(2).then(() => { firstDone = true; return; }));

			let secondDone = false;
			const secondRes = sequentializer.queue(() => async.timeout(3).then(() => { secondDone = true; return; }));

			let thirdDone = false;
			const thirdRes = sequentializer.queue(() => async.timeout(4).then(() => { thirdDone = true; return; }));

			await Promise.all([firstRes, secondRes, thirdRes]);
			assert.ok(pendingDone);
			assert.ok(!firstDone);
			assert.ok(!secondDone);
			assert.ok(thirdDone);
		});

		test('cancel executing', async function () {
			const sequentializer = new async.TaskSequentializer();
			const ctsTimeout = store.add(new CancellationTokenSource());

			let pendingCancelled = false;
			const timeout = async.timeout(1, ctsTimeout.token);
			sequentializer.run(1, timeout, () => pendingCancelled = true);
			sequentializer.cancelRunning();

			assert.ok(pendingCancelled);
			ctsTimeout.cancel();
		});
	});

	suite('disposableTimeout', () => {
		test('handler only success', async () => {
			let cb = false;
			const t = async.disposableTimeout(() => cb = true);

			await async.timeout(0);

			assert.strictEqual(cb, true);

			t.dispose();
		});

		test('handler only cancel', async () => {
			let cb = false;
			const t = async.disposableTimeout(() => cb = true);
			t.dispose();

			await async.timeout(0);

			assert.strictEqual(cb, false);
		});

		test('store managed success', async () => {
			let cb = false;
			const s = new DisposableStore();
			async.disposableTimeout(() => cb = true, 0, s);

			await async.timeout(0);

			assert.strictEqual(cb, true);

			s.dispose();
		});

		test('store managed cancel via disposable', async () => {
			let cb = false;
			const s = new DisposableStore();
			const t = async.disposableTimeout(() => cb = true, 0, s);
			t.dispose();

			await async.timeout(0);

			assert.strictEqual(cb, false);

			s.dispose();
		});

		test('store managed cancel via store', async () => {
			let cb = false;
			const s = new DisposableStore();
			async.disposableTimeout(() => cb = true, 0, s);
			s.dispose();

			await async.timeout(0);

			assert.strictEqual(cb, false);
		});
	});

	test('raceCancellation', async () => {
		const cts = store.add(new CancellationTokenSource());
		const ctsTimeout = store.add(new CancellationTokenSource());

		let triggered = false;
		const timeout = async.timeout(100, ctsTimeout.token);
		const p = async.raceCancellation(timeout.then(() => triggered = true), cts.token);
		cts.cancel();

		await p;

		assert.ok(!triggered);
		ctsTimeout.cancel();
	});

	test('raceTimeout', async () => {
		const cts = store.add(new CancellationTokenSource());

		// timeout wins
		let timedout = false;
		let triggered = false;

		const ctsTimeout1 = store.add(new CancellationTokenSource());
		const timeout1 = async.timeout(100, ctsTimeout1.token);
		const p1 = async.raceTimeout(timeout1.then(() => triggered = true), 1, () => timedout = true);
		cts.cancel();

		await p1;

		assert.ok(!triggered);
		assert.strictEqual(timedout, true);
		ctsTimeout1.cancel();

		// promise wins
		timedout = false;

		const ctsTimeout2 = store.add(new CancellationTokenSource());
		const timeout2 = async.timeout(1, ctsTimeout2.token);
		const p2 = async.raceTimeout(timeout2.then(() => triggered = true), 100, () => timedout = true);
		cts.cancel();

		await p2;

		assert.ok(triggered);
		assert.strictEqual(timedout, false);
		ctsTimeout2.cancel();
	});

	test('SequencerByKey', async () => {
		const s = new async.SequencerByKey<string>();

		const r1 = await s.queue('key1', () => Promise.resolve('hello'));
		assert.strictEqual(r1, 'hello');

		await s.queue('key2', () => Promise.reject(new Error('failed'))).then(() => {
			throw new Error('should not be resolved');
		}, err => {
			// Expected error
			assert.strictEqual(err.message, 'failed');
		});

		// Still works after a queued promise is rejected
		const r3 = await s.queue('key2', () => Promise.resolve('hello'));
		assert.strictEqual(r3, 'hello');
	});

	test('IntervalCounter', async () => {
		let now = 0;
		const counter = new async.IntervalCounter(5, () => now);

		assert.strictEqual(counter.increment(), 1);
		assert.strictEqual(counter.increment(), 2);
		assert.strictEqual(counter.increment(), 3);

		now = 10;

		assert.strictEqual(counter.increment(), 1);
		assert.strictEqual(counter.increment(), 2);
		assert.strictEqual(counter.increment(), 3);
	});

	suite('firstParallel', () => {
		test('simple', async () => {
			const a = await async.firstParallel([
				Promise.resolve(1),
				Promise.resolve(2),
				Promise.resolve(3),
			], v => v === 2);
			assert.strictEqual(a, 2);
		});

		test('uses null default', async () => {
			assert.strictEqual(await async.firstParallel([Promise.resolve(1)], v => v === 2), null);
		});

		test('uses value default', async () => {
			assert.strictEqual(await async.firstParallel([Promise.resolve(1)], v => v === 2, 4), 4);
		});

		test('empty', async () => {
			assert.strictEqual(await async.firstParallel([], v => v === 2, 4), 4);
		});

		test('cancels', async () => {
			let ct1: CancellationToken;
			const p1 = async.createCancelablePromise(async (ct) => {
				ct1 = ct;
				await async.timeout(200, ct);
				return 1;
			});
			let ct2: CancellationToken;
			const p2 = async.createCancelablePromise(async (ct) => {
				ct2 = ct;
				await async.timeout(2, ct);
				return 2;
			});

			assert.strictEqual(await async.firstParallel([p1, p2], v => v === 2, 4), 2);
			assert.strictEqual(ct1!.isCancellationRequested, true, 'should cancel a');
			assert.strictEqual(ct2!.isCancellationRequested, true, 'should cancel b');
		});

		test('rejection handling', async () => {
			let ct1: CancellationToken;
			const p1 = async.createCancelablePromise(async (ct) => {
				ct1 = ct;
				await async.timeout(200, ct);
				return 1;
			});
			let ct2: CancellationToken;
			const p2 = async.createCancelablePromise(async (ct) => {
				ct2 = ct;
				await async.timeout(2, ct);
				throw new Error('oh no');
			});

			assert.strictEqual(await async.firstParallel([p1, p2], v => v === 2, 4).catch(() => 'ok'), 'ok');
			assert.strictEqual(ct1!.isCancellationRequested, true, 'should cancel a');
			assert.strictEqual(ct2!.isCancellationRequested, true, 'should cancel b');
		});
	});

	suite('DeferredPromise', () => {
		test('resolves', async () => {
			const deferred = new async.DeferredPromise<number>();
			assert.strictEqual(deferred.isResolved, false);
			deferred.complete(42);
			assert.strictEqual(await deferred.p, 42);
			assert.strictEqual(deferred.isResolved, true);
		});

		test('rejects', async () => {
			const deferred = new async.DeferredPromise<number>();
			assert.strictEqual(deferred.isRejected, false);
			const err = new Error('oh no!');
			deferred.error(err);
			assert.strictEqual(await deferred.p.catch(e => e), err);
			assert.strictEqual(deferred.isRejected, true);
		});

		test('cancels', async () => {
			const deferred = new async.DeferredPromise<number>();
			assert.strictEqual(deferred.isRejected, false);
			deferred.cancel();
			assert.strictEqual((await deferred.p.catch(e => e)).name, 'Canceled');
			assert.strictEqual(deferred.isRejected, true);
		});

		test('retains the original settled value', async () => {
			const deferred = new async.DeferredPromise<number>();
			assert.strictEqual(deferred.isResolved, false);
			assert.strictEqual(deferred.value, undefined);

			deferred.complete(42);
			assert.strictEqual(await deferred.p, 42);
			assert.strictEqual(deferred.value, 42);
			assert.strictEqual(deferred.isResolved, true);

			deferred.complete(-1);
			assert.strictEqual(await deferred.p, 42);
			assert.strictEqual(deferred.value, 42);
			assert.strictEqual(deferred.isResolved, true);
		});
	});

	suite('Promises.settled', () => {
		test('resolves', async () => {
			const p1 = Promise.resolve(1);
			const p2 = async.timeout(1).then(() => 2);
			const p3 = async.timeout(2).then(() => 3);

			const result = await async.Promises.settled<number>([p1, p2, p3]);

			assert.strictEqual(result.length, 3);
			assert.deepStrictEqual(result[0], 1);
			assert.deepStrictEqual(result[1], 2);
			assert.deepStrictEqual(result[2], 3);
		});

		test('resolves in order', async () => {
			const p1 = async.timeout(2).then(() => 1);
			const p2 = async.timeout(1).then(() => 2);
			const p3 = Promise.resolve(3);

			const result = await async.Promises.settled<number>([p1, p2, p3]);

			assert.strictEqual(result.length, 3);
			assert.deepStrictEqual(result[0], 1);
			assert.deepStrictEqual(result[1], 2);
			assert.deepStrictEqual(result[2], 3);
		});

		test('rejects with first error but handles all promises (all errors)', async () => {
			const p1 = Promise.reject(1);

			let p2Handled = false;
			const p2Error = new Error('2');
			const p2 = async.timeout(1).then(() => {
				p2Handled = true;
				throw p2Error;
			});

			let p3Handled = false;
			const p3Error = new Error('3');
			const p3 = async.timeout(2).then(() => {
				p3Handled = true;
				throw p3Error;
			});

			let error: Error | undefined = undefined;
			try {
				await async.Promises.settled<number>([p1, p2, p3]);
			} catch (e) {
				error = e;
			}

			assert.ok(error);
			assert.notStrictEqual(error, p2Error);
			assert.notStrictEqual(error, p3Error);
			assert.ok(p2Handled);
			assert.ok(p3Handled);
		});

		test('rejects with first error but handles all promises (1 error)', async () => {
			const p1 = Promise.resolve(1);

			let p2Handled = false;
			const p2Error = new Error('2');
			const p2 = async.timeout(1).then(() => {
				p2Handled = true;
				throw p2Error;
			});

			let p3Handled = false;
			const p3 = async.timeout(2).then(() => {
				p3Handled = true;
				return 3;
			});

			let error: Error | undefined = undefined;
			try {
				await async.Promises.settled<number>([p1, p2, p3]);
			} catch (e) {
				error = e;
			}

			assert.strictEqual(error, p2Error);
			assert.ok(p2Handled);
			assert.ok(p3Handled);
		});
	});

	suite('Promises.withAsyncBody', () => {
		test('basics', async () => {

			const p1 = async.Promises.withAsyncBody(async (resolve, reject) => {
				resolve(1);
			});

			const p2 = async.Promises.withAsyncBody(async (resolve, reject) => {
				reject(new Error('error'));
			});

			const p3 = async.Promises.withAsyncBody(async (resolve, reject) => {
				throw new Error('error');
			});

			const r1 = await p1;
			assert.strictEqual(r1, 1);

			let e2: Error | undefined = undefined;
			try {
				await p2;
			} catch (error) {
				e2 = error;
			}

			assert.ok(e2 instanceof Error);

			let e3: Error | undefined = undefined;
			try {
				await p3;
			} catch (error) {
				e3 = error;
			}

			assert.ok(e3 instanceof Error);
		});
	});

	suite('ThrottledWorker', () => {

		function assertArrayEquals(actual: unknown[], expected: unknown[]) {
			assert.strictEqual(actual.length, expected.length);

			for (let i = 0; i < actual.length; i++) {
				assert.strictEqual(actual[i], expected[i]);
			}
		}

		test('basics', async () => {
			let handled: number[] = [];

			let handledCallback: Function;
			let handledPromise = new Promise(resolve => handledCallback = resolve);
			let handledCounterToResolve = 1;
			let currentHandledCounter = 0;

			const handler = (units: readonly number[]) => {
				handled.push(...units);

				currentHandledCounter++;
				if (currentHandledCounter === handledCounterToResolve) {
					handledCallback();

					handledPromise = new Promise(resolve => handledCallback = resolve);
					currentHandledCounter = 0;
				}
			};

			const worker = store.add(new async.ThrottledWorker<number>({
				maxWorkChunkSize: 5,
				maxBufferedWork: undefined,
				throttleDelay: 1
			}, handler));

			// Work less than chunk size

			let worked = worker.work([1, 2, 3]);

			assertArrayEquals(handled, [1, 2, 3]);
			assert.strictEqual(worker.pending, 0);
			assert.strictEqual(worked, true);

			worker.work([4, 5]);
			worked = worker.work([6]);

			assertArrayEquals(handled, [1, 2, 3, 4, 5, 6]);
			assert.strictEqual(worker.pending, 0);
			assert.strictEqual(worked, true);

			// Work more than chunk size (variant 1)

			handled = [];
			handledCounterToResolve = 2;

			worked = worker.work([1, 2, 3, 4, 5, 6, 7]);

			assertArrayEquals(handled, [1, 2, 3, 4, 5]);
			assert.strictEqual(worker.pending, 2);
			assert.strictEqual(worked, true);

			await handledPromise;

			assertArrayEquals(handled, [1, 2, 3, 4, 5, 6, 7]);

			handled = [];
			handledCounterToResolve = 4;

			worked = worker.work([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);

			assertArrayEquals(handled, [1, 2, 3, 4, 5]);
			assert.strictEqual(worker.pending, 14);
			assert.strictEqual(worked, true);

			await handledPromise;

			assertArrayEquals(handled, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);

			// Work more than chunk size (variant 2)

			handled = [];
			handledCounterToResolve = 2;

			worked = worker.work([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

			assertArrayEquals(handled, [1, 2, 3, 4, 5]);
			assert.strictEqual(worker.pending, 5);
			assert.strictEqual(worked, true);

			await handledPromise;

			assertArrayEquals(handled, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

			// Work more while throttled (variant 1)

			handled = [];
			handledCounterToResolve = 3;

			worked = worker.work([1, 2, 3, 4, 5, 6, 7]);

			assertArrayEquals(handled, [1, 2, 3, 4, 5]);
			assert.strictEqual(worker.pending, 2);
			assert.strictEqual(worked, true);

			worker.work([8]);
			worked = worker.work([9, 10, 11]);

			assertArrayEquals(handled, [1, 2, 3, 4, 5]);
			assert.strictEqual(worker.pending, 6);
			assert.strictEqual(worked, true);

			await handledPromise;

			assertArrayEquals(handled, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
			assert.strictEqual(worker.pending, 0);

			// Work more while throttled (variant 2)

			handled = [];
			handledCounterToResolve = 2;

			worked = worker.work([1, 2, 3, 4, 5, 6, 7]);

			assertArrayEquals(handled, [1, 2, 3, 4, 5]);
			assert.strictEqual(worked, true);

			worker.work([8]);
			worked = worker.work([9, 10]);

			assertArrayEquals(handled, [1, 2, 3, 4, 5]);
			assert.strictEqual(worked, true);

			await handledPromise;

			assertArrayEquals(handled, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
		});

		test('do not accept too much work', async () => {
			const handled: number[] = [];
			const handler = (units: readonly number[]) => handled.push(...units);

			const worker = store.add(new async.ThrottledWorker<number>({
				maxWorkChunkSize: 5,
				maxBufferedWork: 5,
				throttleDelay: 1
			}, handler));

			let worked = worker.work([1, 2, 3]);
			assert.strictEqual(worked, true);

			worked = worker.work([1, 2, 3, 4, 5, 6]);
			assert.strictEqual(worked, true);
			assert.strictEqual(worker.pending, 1);

			worked = worker.work([7]);
			assert.strictEqual(worked, true);
			assert.strictEqual(worker.pending, 2);

			worked = worker.work([8, 9, 10, 11]);
			assert.strictEqual(worked, false);
			assert.strictEqual(worker.pending, 2);
		});

		test('do not accept too much work (account for max chunk size', async () => {
			const handled: number[] = [];
			const handler = (units: readonly number[]) => handled.push(...units);

			const worker = store.add(new async.ThrottledWorker<number>({
				maxWorkChunkSize: 5,
				maxBufferedWork: 5,
				throttleDelay: 1
			}, handler));

			let worked = worker.work([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
			assert.strictEqual(worked, false);
			assert.strictEqual(worker.pending, 0);

			worked = worker.work([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
			assert.strictEqual(worked, true);
			assert.strictEqual(worker.pending, 5);
		});

		test('disposed', async () => {
			const handled: number[] = [];
			const handler = (units: readonly number[]) => handled.push(...units);

			const worker = store.add(new async.ThrottledWorker<number>({
				maxWorkChunkSize: 5,
				maxBufferedWork: undefined,
				throttleDelay: 1
			}, handler));
			worker.dispose();
			const worked = worker.work([1, 2, 3]);

			assertArrayEquals(handled, []);
			assert.strictEqual(worker.pending, 0);
			assert.strictEqual(worked, false);
		});

		//  https://github.com/microsoft/vscode/issues/230366
		// 	test('waitThrottleDelayBetweenWorkUnits option', async () => {
		// 		const handled: number[] = [];
		// 		let handledCallback: Function;
		// 		let handledPromise = new Promise(resolve => handledCallback = resolve);
		// 		let currentTime = 0;

		// 		const handler = (units: readonly number[]) => {
		// 			handled.push(...units);
		// 			handledCallback();
		// 			handledPromise = new Promise(resolve => handledCallback = resolve);
		// 		};

		// 		const worker = store.add(new async.ThrottledWorker<number>({
		// 			maxWorkChunkSize: 5,
		// 			maxBufferedWork: undefined,
		// 			throttleDelay: 5,
		// 			waitThrottleDelayBetweenWorkUnits: true
		// 		}, handler));

		// 		// Schedule work, it should execute immediately
		// 		currentTime = Date.now();
		// 		let worked = worker.work([1, 2, 3]);
		// 		assert.strictEqual(worked, true);
		// 		assertArrayEquals(handled, [1, 2, 3]);
		// 		assert.strictEqual(Date.now() - currentTime < 5, true);

		// 		// Schedule work again, it should wait at least throttle delay before executing
		// 		currentTime = Date.now();
		// 		worked = worker.work([4, 5]);
		// 		assert.strictEqual(worked, true);
		// 		// Throttle delay hasn't reset so we still must wait
		// 		assertArrayEquals(handled, [1, 2, 3]);
		// 		await handledPromise;
		// 		assert.strictEqual(Date.now() - currentTime >= 5, true);
		// 		assertArrayEquals(handled, [1, 2, 3, 4, 5]);
		// 	});
	});

	suite('LimitedQueue', () => {

		test('basics (with long running task)', async () => {
			const limitedQueue = new async.LimitedQueue();

			let counter = 0;
			const promises = [];
			for (let i = 0; i < 5; i++) {
				promises.push(limitedQueue.queue(async () => {
					counter = i;
					await async.timeout(1);
				}));
			}

			await Promise.all(promises);

			// only the last task executed
			assert.strictEqual(counter, 4);
		});

		test('basics (with sync running task)', async () => {
			const limitedQueue = new async.LimitedQueue();

			let counter = 0;
			const promises = [];
			for (let i = 0; i < 5; i++) {
				promises.push(limitedQueue.queue(async () => {
					counter = i;
				}));
			}

			await Promise.all(promises);

			// only the last task executed
			assert.strictEqual(counter, 4);
		});
	});

	suite('AsyncIterableObject', function () {


		test('onReturn NOT called', async function () {

			let calledOnReturn = false;
			const iter = new async.AsyncIterableObject<number>(writer => {
				writer.emitMany([1, 2, 3, 4, 5]);
			}, () => {
				calledOnReturn = true;
			});

			for await (const item of iter) {
				assert.strictEqual(typeof item, 'number');
			}

			assert.strictEqual(calledOnReturn, false);

		});

		test('onReturn called on break', async function () {

			let calledOnReturn = false;
			const iter = new async.AsyncIterableObject<number>(writer => {
				writer.emitMany([1, 2, 3, 4, 5]);
			}, () => {
				calledOnReturn = true;
			});

			for await (const item of iter) {
				assert.strictEqual(item, 1);
				break;
			}

			assert.strictEqual(calledOnReturn, true);

		});

		test('onReturn called on return', async function () {

			let calledOnReturn = false;
			const iter = new async.AsyncIterableObject<number>(writer => {
				writer.emitMany([1, 2, 3, 4, 5]);
			}, () => {
				calledOnReturn = true;
			});

			await (async function test() {
				for await (const item of iter) {
					assert.strictEqual(item, 1);
					return;
				}
			})();


			assert.strictEqual(calledOnReturn, true);

		});


		test('onReturn called on throwing', async function () {

			let calledOnReturn = false;
			const iter = new async.AsyncIterableObject<number>(writer => {
				writer.emitMany([1, 2, 3, 4, 5]);
			}, () => {
				calledOnReturn = true;
			});

			try {
				for await (const item of iter) {
					assert.strictEqual(item, 1);
					throw new Error();
				}
			} catch (e) {

			}

			assert.strictEqual(calledOnReturn, true);
		});
	});

	suite('AsyncIterableSource', function () {

		test('onReturn is wired up', async function () {
			let calledOnReturn = false;
			const source = new async.AsyncIterableSource<number>(() => { calledOnReturn = true; });

			source.emitOne(1);
			source.emitOne(2);
			source.emitOne(3);
			source.resolve();

			for await (const item of source.asyncIterable) {
				assert.strictEqual(item, 1);
				break;
			}

			assert.strictEqual(calledOnReturn, true);

		});

		test('onReturn is wired up 2', async function () {
			let calledOnReturn = false;
			const source = new async.AsyncIterableSource<number>(() => { calledOnReturn = true; });

			source.emitOne(1);
			source.emitOne(2);
			source.emitOne(3);
			source.resolve();

			for await (const item of source.asyncIterable) {
				assert.strictEqual(typeof item, 'number');
			}

			assert.strictEqual(calledOnReturn, false);
		});

		test('emitMany emits all items', async function () {
			const source = new async.AsyncIterableSource<number>();
			const values = [10, 20, 30, 40];
			source.emitMany(values);
			source.resolve();

			const result: number[] = [];
			for await (const item of source.asyncIterable) {
				result.push(item);
			}

			assert.deepStrictEqual(result, values);
		});
	});

	suite('cancellableIterable', () => {
		let cts: CancellationTokenSource;
		setup(() => {
			cts = store.add(new CancellationTokenSource());
		});

		test('should iterate through all values when not canceled', async function () {
			const asyncIterable = {
				async *[Symbol.asyncIterator]() {
					yield 'a';
					yield 'b';
					yield 'c';
				}
			};

			const cancelableIterable = async.cancellableIterable(asyncIterable, cts.token);

			const result = await Iterable.asyncToArray(cancelableIterable);
			assert.deepStrictEqual(result, ['a', 'b', 'c']);
		});

		test('should stop iteration immediately when cancelled before starting', async function () {
			const values: string[] = [];

			const asyncIterable = {
				async *[Symbol.asyncIterator]() {
					values.push('iterator created');
					yield 'a';
					values.push('after a');
					yield 'b';
					values.push('after b');
					yield 'c';
					values.push('after c');
				}
			};

			// Cancel before iteration starts
			cts.cancel();
			const cancelableIterable = async.cancellableIterable(asyncIterable, cts.token);

			const result = await Iterable.asyncToArray(cancelableIterable);
			assert.deepStrictEqual(result, []);
			assert.deepStrictEqual(values, []);
		});

		test('should stop iteration when cancelled during iteration', async function () {
			const cts = new CancellationTokenSource();
			const deferredA = new async.DeferredPromise<void>();
			const deferredB = new async.DeferredPromise<void>();
			const deferredC = new async.DeferredPromise<void>();

			const values: string[] = [];

			const asyncIterable = {
				async *[Symbol.asyncIterator]() {
					values.push('a yielded');
					yield 'a';
					await deferredA.p;

					values.push('b yielded');
					yield 'b';
					await deferredB.p;

					values.push('c yielded');
					yield 'c';
					await deferredC.p;
				}
			};

			for await (const value of async.cancellableIterable(asyncIterable, cts.token)) {
				if (value === 'a') {
					deferredA.complete();
				} else if (value === 'b') {
					cts.cancel();
					deferredB.complete();
				} else {
					throw new Error('Unexpected value');
				}
			}

			assert.deepStrictEqual(values, ['a yielded', 'b yielded']);
		});

		test('should handle return method correctly', async function () {
			let returnCalled = false;
			let n = 0;
			const asyncIterable = {
				async *[Symbol.asyncIterator]() {
					try {
						yield 'a'; n++;
						yield 'b'; n++;
						yield 'c'; n++;
					} finally {
						returnCalled = true;
					}
				},
			};

			// Add a return method to the iterator
			const originalIterable = asyncIterable[Symbol.asyncIterator]();
			originalIterable.return = async function () {
				returnCalled = true;
				return Promise.resolve({ done: true, value: undefined });
			};

			// Create a test-specific iterable with our mocked iterator
			const testIterable = {
				[Symbol.asyncIterator]: () => originalIterable
			};

			for await (const value of async.cancellableIterable(testIterable, cts.token)) {
				if (value === 'b') {
					break;
				}
			}

			assert.strictEqual(returnCalled, true);
			assert.strictEqual(n < 2, true);
		});
	});


	suite('AsyncIterableProducer', () => {
		test('emitOne produces single values', async () => {
			const producer = new async.AsyncIterableProducer<number>(emitter => {
				emitter.emitOne(1);
				emitter.emitOne(2);
				emitter.emitOne(3);
			});

			const result: number[] = [];
			for await (const item of producer) {
				result.push(item);
			}

			assert.deepStrictEqual(result, [1, 2, 3]);
		});

		test('emitMany produces multiple values', async () => {
			const producer = new async.AsyncIterableProducer<number>(emitter => {
				emitter.emitMany([1, 2, 3]);
				emitter.emitMany([4, 5]);
			});

			const result: number[] = [];
			for await (const item of producer) {
				result.push(item);
			}

			assert.deepStrictEqual(result, [1, 2, 3, 4, 5]);
		});

		test('mixed emitOne and emitMany', async () => {
			const producer = new async.AsyncIterableProducer<number>(emitter => {
				emitter.emitOne(1);
				emitter.emitMany([2, 3]);
				emitter.emitOne(4);
			});

			const result: number[] = [];
			for await (const item of producer) {
				result.push(item);
			}

			assert.deepStrictEqual(result, [1, 2, 3, 4]);
		});

		test('async executor with emitOne', async () => {
			const producer = new async.AsyncIterableProducer<number>(async emitter => {
				emitter.emitOne(1);
				await async.timeout(1);
				emitter.emitOne(2);
				await async.timeout(1);
				emitter.emitOne(3);
			});

			const result: number[] = [];
			for await (const item of producer) {
				result.push(item);
			}

			assert.deepStrictEqual(result, [1, 2, 3]);
		});

		test('async executor with emitMany', async () => {
			const producer = new async.AsyncIterableProducer<number>(async emitter => {
				emitter.emitMany([1, 2]);
				await async.timeout(1);
				emitter.emitMany([3, 4]);
			});

			const result: number[] = [];
			for await (const item of producer) {
				result.push(item);
			}

			assert.deepStrictEqual(result, [1, 2, 3, 4]);
		});

		test('reject with error', async () => {
			const expectedError = new Error('test error');
			const producer = new async.AsyncIterableProducer<number>(emitter => {
				emitter.emitOne(1);
				emitter.reject(expectedError);
			});

			const result: number[] = [];
			let caughtError: Error | undefined;

			try {
				for await (const item of producer) {
					result.push(item);
				}
			} catch (error) {
				caughtError = error as Error;
			}

			assert.deepStrictEqual(result, [1]);
			assert.strictEqual(caughtError, expectedError);
		});

		test('async executor throws error', async () => {
			const expectedError = new Error('executor error');
			const producer = new async.AsyncIterableProducer<number>(async emitter => {
				emitter.emitOne(1);
				throw expectedError;
			});

			const result: number[] = [];
			let caughtError: Error | undefined;

			try {
				for await (const item of producer) {
					result.push(item);
				}
			} catch (error) {
				caughtError = error as Error;
			}

			assert.deepStrictEqual(result, [1]);
			assert.strictEqual(caughtError, expectedError);
		});

		test('empty producer', async () => {
			const producer = new async.AsyncIterableProducer<number>(emitter => {
				// Don't emit anything
			});

			const result: number[] = [];
			for await (const item of producer) {
				result.push(item);
			}

			assert.deepStrictEqual(result, []);
		});

		test('async executor resolves without emitting', async () => {
			const producer = new async.AsyncIterableProducer<number>(async emitter => {
				await async.timeout(1);
				// Don't emit anything
			});

			const result: number[] = [];
			for await (const item of producer) {
				result.push(item);
			}

			assert.deepStrictEqual(result, []);
		});

		test('multiple iterators on same producer', async () => {
			const producer = new async.AsyncIterableProducer<number>(emitter => {
				emitter.emitMany([1, 2, 3]);
			});

			// First iterator should consume all values
			const result1: number[] = [];
			for await (const item of producer) {
				result1.push(item);
			}

			// Second iterator should not see any values (already consumed)
			const result2: number[] = [];
			for await (const item of producer) {
				result2.push(item);
			}

			assert.deepStrictEqual(result1, [1, 2, 3]);
			assert.deepStrictEqual(result2, []);
		});

		test('concurrent iteration', async () => {
			const producer = new async.AsyncIterableProducer<number>(async emitter => {
				emitter.emitOne(1);
				await async.timeout(1);
				emitter.emitOne(2);
				await async.timeout(1);
				emitter.emitOne(3);
			});

			const iterator1 = producer[Symbol.asyncIterator]();
			const iterator2 = producer[Symbol.asyncIterator]();

			// Both iterators share the same underlying producer
			const first1 = await iterator1.next();
			const first2 = await iterator2.next();
			const second1 = await iterator1.next();
			const second2 = await iterator2.next();

			// Since they share the same producer, values are consumed in order
			assert.strictEqual(first1.value, 1);
			assert.strictEqual(first2.value, 2);
			assert.strictEqual(second1.value, 3);
			assert.strictEqual(second2.done, true);
		});

		test('executor with promise return value', async () => {
			const producer = new async.AsyncIterableProducer<number>(emitter => {
				emitter.emitOne(1);
				emitter.emitOne(2);
				return Promise.resolve();
			});

			const result: number[] = [];
			for await (const item of producer) {
				result.push(item);
			}

			assert.deepStrictEqual(result, [1, 2]);
		});

		test('executor with non-promise return value', async () => {
			const producer = new async.AsyncIterableProducer<number>(emitter => {
				emitter.emitOne(1);
				emitter.emitOne(2);
				return 'some value';
			});

			const result: number[] = [];
			for await (const item of producer) {
				result.push(item);
			}

			assert.deepStrictEqual(result, [1, 2]);
		});

		test('emitMany with empty array', async () => {
			const producer = new async.AsyncIterableProducer<number>(emitter => {
				emitter.emitOne(1);
				emitter.emitMany([]);
				emitter.emitOne(2);
			});

			const result: number[] = [];
			for await (const item of producer) {
				result.push(item);
			}

			assert.deepStrictEqual(result, [1, 2]);
		});

		test('reject immediately without emitting', async () => {
			const expectedError = new Error('immediate error');
			const producer = new async.AsyncIterableProducer<number>(emitter => {
				emitter.reject(expectedError);
			});

			let caughtError: Error | undefined;
			try {
				for await (const _item of producer) {
					assert.fail('Should not iterate when rejected immediately');
				}
			} catch (error) {
				caughtError = error as Error;
			}

			assert.strictEqual(caughtError, expectedError);
		});

		test('string values', async () => {
			const producer = new async.AsyncIterableProducer<string>(emitter => {
				emitter.emitOne('hello');
				emitter.emitMany(['world', 'test']);
			});

			const result: string[] = [];
			for await (const item of producer) {
				result.push(item);
			}

			assert.deepStrictEqual(result, ['hello', 'world', 'test']);
		});

		test('object values', async () => {
			interface TestObject {
				id: number;
				name: string;
			}

			const producer = new async.AsyncIterableProducer<TestObject>(emitter => {
				emitter.emitOne({ id: 1, name: 'first' });
				emitter.emitMany([
					{ id: 2, name: 'second' },
					{ id: 3, name: 'third' }
				]);
			});

			const result: TestObject[] = [];
			for await (const item of producer) {
				result.push(item);
			}

			assert.deepStrictEqual(result, [
				{ id: 1, name: 'first' },
				{ id: 2, name: 'second' },
				{ id: 3, name: 'third' }
			]);
		});

		test('tee - both iterators receive all values', async () => {
			// TODO: Implementation bug - executors don't await start(), causing producers to finalize early
			async function* sourceGenerator() {
				yield 1;
				yield 2;
				yield 3;
				yield 4;
				yield 5;
			}

			const [iter1, iter2] = async.AsyncIterableProducer.tee(sourceGenerator());

			const result1: number[] = [];
			const result2: number[] = [];

			// Consume both iterables concurrently
			await Promise.all([
				(async () => {
					for await (const item of iter1) {
						result1.push(item);
					}
				})(),
				(async () => {
					for await (const item of iter2) {
						result2.push(item);
					}
				})()
			]);

			assert.deepStrictEqual(result1, [1, 2, 3, 4, 5]);
			assert.deepStrictEqual(result2, [1, 2, 3, 4, 5]);
		});

		test('tee - sequential consumption', async () => {
			// TODO: Implementation bug - executors don't await start(), causing producers to finalize early
			const source = new async.AsyncIterableProducer<number>(emitter => {
				emitter.emitMany([1, 2, 3]);
			});

			const [iter1, iter2] = async.AsyncIterableProducer.tee(source);

			// Consume first iterator completely
			const result1: number[] = [];
			for await (const item of iter1) {
				result1.push(item);
			}

			// Then consume second iterator
			const result2: number[] = [];
			for await (const item of iter2) {
				result2.push(item);
			}

			assert.deepStrictEqual(result1, [1, 2, 3]);
			assert.deepStrictEqual(result2, [1, 2, 3]);
		});

		test.skip('tee - empty source', async () => {
			// TODO: Implementation bug - executors don't await start(), causing producers to finalize early
			const source = new async.AsyncIterableProducer<number>(emitter => {
				// Emit nothing
			});

			const [iter1, iter2] = async.AsyncIterableProducer.tee(source);

			const result1: number[] = [];
			const result2: number[] = [];

			await Promise.all([
				(async () => {
					for await (const item of iter1) {
						result1.push(item);
					}
				})(),
				(async () => {
					for await (const item of iter2) {
						result2.push(item);
					}
				})()
			]);

			assert.deepStrictEqual(result1, []);
			assert.deepStrictEqual(result2, []);
		});

		test.skip('tee - handles errors in source', async () => {
			// TODO: Implementation bug - executors don't await start(), causing producers to finalize early
			const expectedError = new Error('source error');
			const source = new async.AsyncIterableProducer<number>(async emitter => {
				emitter.emitOne(1);
				emitter.emitOne(2);
				throw expectedError;
			});

			const [iter1, iter2] = async.AsyncIterableProducer.tee(source);

			let error1: Error | undefined;
			let error2: Error | undefined;
			const result1: number[] = [];
			const result2: number[] = [];

			await Promise.all([
				(async () => {
					try {
						for await (const item of iter1) {
							result1.push(item);
						}
					} catch (e) {
						error1 = e as Error;
					}
				})(),
				(async () => {
					try {
						for await (const item of iter2) {
							result2.push(item);
						}
					} catch (e) {
						error2 = e as Error;
					}
				})()
			]);

			// Both iterators should have received the same values before error
			assert.deepStrictEqual(result1, [1, 2]);
			assert.deepStrictEqual(result2, [1, 2]);

			// Both should have received the error
			assert.strictEqual(error1, expectedError);
			assert.strictEqual(error2, expectedError);
		});
	});

	suite('AsyncReader', () => {
		async function* createAsyncIterator<T>(values: T[]): AsyncIterator<T> {
			for (const value of values) {
				yield value;
			}
		}

		async function* createDelayedAsyncIterator<T>(values: T[], delayMs: number = 1): AsyncIterator<T> {
			for (const value of values) {
				await async.timeout(delayMs);
				yield value;
			}
		}

		test('read - basic functionality', async () => {
			const reader = new async.AsyncReader(createAsyncIterator([1, 2, 3]));

			assert.strictEqual(await reader.read(), 1);
			assert.strictEqual(await reader.read(), 2);
			assert.strictEqual(await reader.read(), 3);
			assert.strictEqual(await reader.read(), async.AsyncReaderEndOfStream);
		});

		test('read - empty iterator', async () => {
			const reader = new async.AsyncReader(createAsyncIterator([]));

			assert.strictEqual(await reader.read(), async.AsyncReaderEndOfStream);
			assert.strictEqual(await reader.read(), async.AsyncReaderEndOfStream);
		});

		test('endOfStream property', async () => {
			const reader = new async.AsyncReader(createAsyncIterator([1, 2]));

			assert.strictEqual(reader.endOfStream, false);

			await reader.read(); // 1
			assert.strictEqual(reader.endOfStream, false);

			await reader.read(); // 2
			assert.strictEqual(reader.endOfStream, false);

			await reader.read(); // end
			assert.strictEqual(reader.endOfStream, true);
		});

		test('peek - basic functionality', async () => {
			const reader = new async.AsyncReader(createAsyncIterator([1, 2, 3]));

			assert.strictEqual(await reader.peek(), 1);
			assert.strictEqual(await reader.peek(), 1); // Should return same value
			assert.strictEqual(await reader.read(), 1); // Should consume the peeked value

			assert.strictEqual(await reader.peek(), 2);
			assert.strictEqual(await reader.read(), 2);
		});

		test('peek - empty iterator', async () => {
			const reader = new async.AsyncReader(createAsyncIterator([]));

			assert.strictEqual(await reader.peek(), async.AsyncReaderEndOfStream);
		});

		test('readSyncOrThrow - throws when no data available', async () => {
			const reader = new async.AsyncReader(createAsyncIterator([1]));

			// Read the only item
			await reader.read();

			// Should throw since no more data and not at end yet
			assert.throws(() => reader.readBufferedOrThrow());
		});

		test('readSyncOrThrow - returns end of stream when at end', async () => {
			const reader = new async.AsyncReader(createAsyncIterator([]));

			// Trigger end detection
			await reader.read();

			assert.strictEqual(reader.readBufferedOrThrow(), async.AsyncReaderEndOfStream);
		});

		test('peekSyncOrThrow - with buffered data', async () => {
			const reader = new async.AsyncReader(createAsyncIterator([1, 2, 3]));

			// First peek to populate buffer
			await reader.peek();

			// Should be able to peek sync now
			assert.strictEqual(reader.peekBufferedOrThrow(), 1);
			assert.strictEqual(reader.peekBufferedOrThrow(), 1); // Should return same value
		});

		test('peekSyncOrThrow - throws when no data available', async () => {
			const reader = new async.AsyncReader(createAsyncIterator([1]));

			// Should throw since buffer is empty and we haven't loaded anything
			assert.throws(() => reader.peekBufferedOrThrow());
		});

		test('peekSyncOrThrow - returns end of stream when at end', async () => {
			const reader = new async.AsyncReader(createAsyncIterator([]));

			// Trigger end detection
			await reader.peek();

			assert.strictEqual(reader.peekBufferedOrThrow(), async.AsyncReaderEndOfStream);
		});

		test('consumeToEnd - consumes all remaining data', async () => {
			const reader = new async.AsyncReader(createAsyncIterator([1, 2, 3, 4, 5]));

			// Read some data first
			assert.strictEqual(await reader.read(), 1);
			assert.strictEqual(await reader.read(), 2);

			// Consume the rest
			await reader.consumeToEnd();

			assert.strictEqual(reader.endOfStream, true);
			assert.strictEqual(await reader.read(), async.AsyncReaderEndOfStream);
		});

		test('consumeToEnd - on empty reader', async () => {
			const reader = new async.AsyncReader(createAsyncIterator([]));

			await reader.consumeToEnd();

			assert.strictEqual(reader.endOfStream, true);
		});

		test('readWhile - basic functionality', async () => {
			const reader = new async.AsyncReader(createAsyncIterator([1, 2, 3, 4, 5]));
			const collected: number[] = [];

			await reader.readWhile(
				value => value < 4,
				async value => {
					collected.push(value);
				}
			);

			assert.deepStrictEqual(collected, [1, 2, 3]);

			// Next read should return 4
			assert.strictEqual(await reader.read(), 4);
		});

		test('readWhile - stops at end of stream', async () => {
			const reader = new async.AsyncReader(createAsyncIterator([1, 2, 3]));
			const collected: number[] = [];

			await reader.readWhile(
				value => value < 10, // Always true
				async value => {
					collected.push(value);
				}
			);

			assert.deepStrictEqual(collected, [1, 2, 3]);
			assert.strictEqual(reader.endOfStream, true);
		});

		test('readWhile - empty iterator', async () => {
			const reader = new async.AsyncReader(createAsyncIterator([]));
			const collected: number[] = [];

			await reader.readWhile(
				value => true,
				async value => {
					collected.push(value);
				}
			);

			assert.deepStrictEqual(collected, []);
		});

		test('readWhile - predicate returns false immediately', async () => {
			const reader = new async.AsyncReader(createAsyncIterator([1, 2, 3]));
			const collected: number[] = [];

			await reader.readWhile(
				value => false, // Always false
				async value => {
					collected.push(value);
				}
			);

			assert.deepStrictEqual(collected, []);

			// First item should still be available
			assert.strictEqual(await reader.read(), 1);
		});

		test('peekTimeout - with immediate data', async () => {
			const reader = new async.AsyncReader(createAsyncIterator([1, 2, 3]));

			const result = await reader.peekTimeout(100);
			assert.strictEqual(result, 1);
		});

		test('peekTimeout - with delayed data', async () => {
			const reader = new async.AsyncReader(createDelayedAsyncIterator([1, 2, 3], 10));

			const result = await reader.peekTimeout(50);
			assert.strictEqual(result, 1);
		});

		test('peekTimeout - timeout occurs', async () => {
			return runWithFakedTimers({}, async () => {
				const reader = new async.AsyncReader(createDelayedAsyncIterator([1, 2, 3], 50));

				const result = await reader.peekTimeout(10);
				assert.strictEqual(result, undefined);

				await reader.consumeToEnd();
			});
		});

		test('peekTimeout - empty iterator', async () => {
			const reader = new async.AsyncReader(createAsyncIterator([]));

			const result = await reader.peekTimeout(10);
			assert.strictEqual(result, async.AsyncReaderEndOfStream);
		});

		test('peekTimeout - after consuming all data', async () => {
			const reader = new async.AsyncReader(createAsyncIterator([1]));

			await reader.consumeToEnd();
			const result = await reader.peekTimeout(10);
			assert.strictEqual(result, async.AsyncReaderEndOfStream);
		});

		test('mixed operations - complex scenario', async () => {
			const reader = new async.AsyncReader(createAsyncIterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));

			// Peek first
			assert.strictEqual(await reader.peek(), 1);

			// Read some
			assert.strictEqual(await reader.read(), 1);
			assert.strictEqual(await reader.read(), 2);

			// Peek again
			assert.strictEqual(await reader.peek(), 3);

			// Read while
			const collected: number[] = [];
			await reader.readWhile(
				value => value <= 5,
				async value => collected.push(value)
			);
			assert.deepStrictEqual(collected, [3, 4, 5]);

			// Use sync operations
			assert.strictEqual(await reader.peek(), 6);
			assert.strictEqual(reader.peekBufferedOrThrow(), 6);
			assert.strictEqual(reader.readBufferedOrThrow(), 6);

			// Consume rest
			await reader.consumeToEnd();
			assert.strictEqual(reader.endOfStream, true);
		});

		test('string values', async () => {
			const reader = new async.AsyncReader(createAsyncIterator(['hello', 'world', 'test']));

			assert.strictEqual(await reader.read(), 'hello');
			assert.strictEqual(await reader.peek(), 'world');
			assert.strictEqual(await reader.read(), 'world');
			assert.strictEqual(await reader.read(), 'test');
			assert.strictEqual(await reader.read(), async.AsyncReaderEndOfStream);
		});

		test('object values', async () => {
			interface TestObj {
				id: number;
				name: string;
			}

			const objects: TestObj[] = [
				{ id: 1, name: 'first' },
				{ id: 2, name: 'second' },
				{ id: 3, name: 'third' }
			];

			const reader = new async.AsyncReader(createAsyncIterator(objects));

			assert.deepStrictEqual(await reader.read(), { id: 1, name: 'first' });
			assert.deepStrictEqual(await reader.peek(), { id: 2, name: 'second' });
			assert.deepStrictEqual(await reader.read(), { id: 2, name: 'second' });
		});

		test('concurrent operations', async () => {
			const reader = new async.AsyncReader(createDelayedAsyncIterator([1, 2, 3], 5));

			// Start multiple operations concurrently
			const peekPromise = reader.peek();
			const readPromise = reader.read();

			const [peekResult, readResult] = await Promise.all([peekPromise, readPromise]);

			// Both should return the same first value
			assert.strictEqual(peekResult, 1);
			assert.strictEqual(readResult, 1);

			// Next read should get the second value
			assert.strictEqual(await reader.read(), 2);
		});

		test('buffer management - single extend buffer call', async () => {
			let nextCallCount = 0;
			const mockIterator: AsyncIterator<number> = {
				async next() {
					nextCallCount++;
					if (nextCallCount === 1) {
						await async.timeout(1);
						return { value: 1, done: false };
					}
					return { value: undefined, done: true };
				}
			};

			const reader = new async.AsyncReader(mockIterator);

			// Multiple concurrent operations should only trigger one extend buffer call
			const promises = [
				reader.peek(),
				reader.peek(),
				reader.read()
			];

			await Promise.all(promises);

			// Should have called next() only once despite multiple concurrent operations
			assert.strictEqual(nextCallCount, 1);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/buffer.test.ts]---
Location: vscode-main/src/vs/base/test/common/buffer.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { timeout } from '../../common/async.js';
import { bufferedStreamToBuffer, bufferToReadable, bufferToStream, decodeBase64, decodeHex, encodeBase64, encodeHex, newWriteableBufferStream, readableToBuffer, streamToBuffer, VSBuffer } from '../../common/buffer.js';
import { peekStream } from '../../common/stream.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';

suite('Buffer', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('issue #71993 - VSBuffer#toString returns numbers', () => {
		const data = new Uint8Array([1, 2, 3, 'h'.charCodeAt(0), 'i'.charCodeAt(0), 4, 5]).buffer;
		const buffer = VSBuffer.wrap(new Uint8Array(data, 3, 2));
		assert.deepStrictEqual(buffer.toString(), 'hi');
	});

	test('issue #251527 - VSBuffer#toString preserves BOM character in filenames', () => {
		// BOM character (U+FEFF) is a zero-width character that was being stripped
		// when deserializing messages in the IPC layer. This test verifies that
		// the BOM character is preserved when using VSBuffer.toString().
		const bomChar = '\uFEFF';
		const filename = `${bomChar}c.txt`;
		const buffer = VSBuffer.fromString(filename);
		const result = buffer.toString();

		// Verify the BOM character is preserved
		assert.strictEqual(result, filename);
		assert.strictEqual(result.charCodeAt(0), 0xFEFF);
	});

	test('bufferToReadable / readableToBuffer', () => {
		const content = 'Hello World';
		const readable = bufferToReadable(VSBuffer.fromString(content));

		assert.strictEqual(readableToBuffer(readable).toString(), content);
	});

	test('bufferToStream / streamToBuffer', async () => {
		const content = 'Hello World';
		const stream = bufferToStream(VSBuffer.fromString(content));

		assert.strictEqual((await streamToBuffer(stream)).toString(), content);
	});

	test('bufferedStreamToBuffer', async () => {
		const content = 'Hello World';
		const stream = await peekStream(bufferToStream(VSBuffer.fromString(content)), 1);

		assert.strictEqual((await bufferedStreamToBuffer(stream)).toString(), content);
	});

	test('bufferWriteableStream - basics (no error)', async () => {
		const stream = newWriteableBufferStream();

		const chunks: VSBuffer[] = [];
		stream.on('data', data => {
			chunks.push(data);
		});

		let ended = false;
		stream.on('end', () => {
			ended = true;
		});

		const errors: Error[] = [];
		stream.on('error', error => {
			errors.push(error);
		});

		await timeout(0);
		stream.write(VSBuffer.fromString('Hello'));
		await timeout(0);
		stream.end(VSBuffer.fromString('World'));

		assert.strictEqual(chunks.length, 2);
		assert.strictEqual(chunks[0].toString(), 'Hello');
		assert.strictEqual(chunks[1].toString(), 'World');
		assert.strictEqual(ended, true);
		assert.strictEqual(errors.length, 0);
	});

	test('bufferWriteableStream - basics (error)', async () => {
		const stream = newWriteableBufferStream();

		const chunks: VSBuffer[] = [];
		stream.on('data', data => {
			chunks.push(data);
		});

		let ended = false;
		stream.on('end', () => {
			ended = true;
		});

		const errors: Error[] = [];
		stream.on('error', error => {
			errors.push(error);
		});

		await timeout(0);
		stream.write(VSBuffer.fromString('Hello'));
		await timeout(0);
		stream.error(new Error());
		stream.end();

		assert.strictEqual(chunks.length, 1);
		assert.strictEqual(chunks[0].toString(), 'Hello');
		assert.strictEqual(ended, true);
		assert.strictEqual(errors.length, 1);
	});

	test('bufferWriteableStream - buffers data when no listener', async () => {
		const stream = newWriteableBufferStream();

		await timeout(0);
		stream.write(VSBuffer.fromString('Hello'));
		await timeout(0);
		stream.end(VSBuffer.fromString('World'));

		const chunks: VSBuffer[] = [];
		stream.on('data', data => {
			chunks.push(data);
		});

		let ended = false;
		stream.on('end', () => {
			ended = true;
		});

		const errors: Error[] = [];
		stream.on('error', error => {
			errors.push(error);
		});

		assert.strictEqual(chunks.length, 1);
		assert.strictEqual(chunks[0].toString(), 'HelloWorld');
		assert.strictEqual(ended, true);
		assert.strictEqual(errors.length, 0);
	});

	test('bufferWriteableStream - buffers errors when no listener', async () => {
		const stream = newWriteableBufferStream();

		await timeout(0);
		stream.write(VSBuffer.fromString('Hello'));
		await timeout(0);
		stream.error(new Error());

		const chunks: VSBuffer[] = [];
		stream.on('data', data => {
			chunks.push(data);
		});

		const errors: Error[] = [];
		stream.on('error', error => {
			errors.push(error);
		});

		let ended = false;
		stream.on('end', () => {
			ended = true;
		});

		stream.end();

		assert.strictEqual(chunks.length, 1);
		assert.strictEqual(chunks[0].toString(), 'Hello');
		assert.strictEqual(ended, true);
		assert.strictEqual(errors.length, 1);
	});

	test('bufferWriteableStream - buffers end when no listener', async () => {
		const stream = newWriteableBufferStream();

		await timeout(0);
		stream.write(VSBuffer.fromString('Hello'));
		await timeout(0);
		stream.end(VSBuffer.fromString('World'));

		let ended = false;
		stream.on('end', () => {
			ended = true;
		});

		const chunks: VSBuffer[] = [];
		stream.on('data', data => {
			chunks.push(data);
		});

		const errors: Error[] = [];
		stream.on('error', error => {
			errors.push(error);
		});

		assert.strictEqual(chunks.length, 1);
		assert.strictEqual(chunks[0].toString(), 'HelloWorld');
		assert.strictEqual(ended, true);
		assert.strictEqual(errors.length, 0);
	});

	test('bufferWriteableStream - nothing happens after end()', async () => {
		const stream = newWriteableBufferStream();

		const chunks: VSBuffer[] = [];
		stream.on('data', data => {
			chunks.push(data);
		});

		await timeout(0);
		stream.write(VSBuffer.fromString('Hello'));
		await timeout(0);
		stream.end(VSBuffer.fromString('World'));

		let dataCalledAfterEnd = false;
		stream.on('data', data => {
			dataCalledAfterEnd = true;
		});

		let errorCalledAfterEnd = false;
		stream.on('error', error => {
			errorCalledAfterEnd = true;
		});

		let endCalledAfterEnd = false;
		stream.on('end', () => {
			endCalledAfterEnd = true;
		});

		await timeout(0);
		stream.write(VSBuffer.fromString('Hello'));
		await timeout(0);
		stream.error(new Error());
		await timeout(0);
		stream.end(VSBuffer.fromString('World'));

		assert.strictEqual(dataCalledAfterEnd, false);
		assert.strictEqual(errorCalledAfterEnd, false);
		assert.strictEqual(endCalledAfterEnd, false);

		assert.strictEqual(chunks.length, 2);
		assert.strictEqual(chunks[0].toString(), 'Hello');
		assert.strictEqual(chunks[1].toString(), 'World');
	});

	test('bufferWriteableStream - pause/resume (simple)', async () => {
		const stream = newWriteableBufferStream();

		const chunks: VSBuffer[] = [];
		stream.on('data', data => {
			chunks.push(data);
		});

		let ended = false;
		stream.on('end', () => {
			ended = true;
		});

		const errors: Error[] = [];
		stream.on('error', error => {
			errors.push(error);
		});

		stream.pause();

		await timeout(0);
		stream.write(VSBuffer.fromString('Hello'));
		await timeout(0);
		stream.end(VSBuffer.fromString('World'));

		assert.strictEqual(chunks.length, 0);
		assert.strictEqual(errors.length, 0);
		assert.strictEqual(ended, false);

		stream.resume();

		assert.strictEqual(chunks.length, 1);
		assert.strictEqual(chunks[0].toString(), 'HelloWorld');
		assert.strictEqual(ended, true);
		assert.strictEqual(errors.length, 0);
	});

	test('bufferWriteableStream - pause/resume (pause after first write)', async () => {
		const stream = newWriteableBufferStream();

		const chunks: VSBuffer[] = [];
		stream.on('data', data => {
			chunks.push(data);
		});

		let ended = false;
		stream.on('end', () => {
			ended = true;
		});

		const errors: Error[] = [];
		stream.on('error', error => {
			errors.push(error);
		});

		await timeout(0);
		stream.write(VSBuffer.fromString('Hello'));

		stream.pause();

		await timeout(0);
		stream.end(VSBuffer.fromString('World'));

		assert.strictEqual(chunks.length, 1);
		assert.strictEqual(chunks[0].toString(), 'Hello');
		assert.strictEqual(errors.length, 0);
		assert.strictEqual(ended, false);

		stream.resume();

		assert.strictEqual(chunks.length, 2);
		assert.strictEqual(chunks[0].toString(), 'Hello');
		assert.strictEqual(chunks[1].toString(), 'World');
		assert.strictEqual(ended, true);
		assert.strictEqual(errors.length, 0);
	});

	test('bufferWriteableStream - pause/resume (error)', async () => {
		const stream = newWriteableBufferStream();

		const chunks: VSBuffer[] = [];
		stream.on('data', data => {
			chunks.push(data);
		});

		let ended = false;
		stream.on('end', () => {
			ended = true;
		});

		const errors: Error[] = [];
		stream.on('error', error => {
			errors.push(error);
		});

		stream.pause();

		await timeout(0);
		stream.write(VSBuffer.fromString('Hello'));
		await timeout(0);
		stream.error(new Error());
		stream.end();

		assert.strictEqual(chunks.length, 0);
		assert.strictEqual(ended, false);
		assert.strictEqual(errors.length, 0);

		stream.resume();

		assert.strictEqual(chunks.length, 1);
		assert.strictEqual(chunks[0].toString(), 'Hello');
		assert.strictEqual(ended, true);
		assert.strictEqual(errors.length, 1);
	});

	test('bufferWriteableStream - destroy', async () => {
		const stream = newWriteableBufferStream();

		const chunks: VSBuffer[] = [];
		stream.on('data', data => {
			chunks.push(data);
		});

		let ended = false;
		stream.on('end', () => {
			ended = true;
		});

		const errors: Error[] = [];
		stream.on('error', error => {
			errors.push(error);
		});

		stream.destroy();

		await timeout(0);
		stream.write(VSBuffer.fromString('Hello'));
		await timeout(0);
		stream.end(VSBuffer.fromString('World'));

		assert.strictEqual(chunks.length, 0);
		assert.strictEqual(ended, false);
		assert.strictEqual(errors.length, 0);
	});

	test('Performance issue with VSBuffer#slice #76076', function () { // TODO@alexdima this test seems to fail in web (https://github.com/microsoft/vscode/issues/114042)
		// Buffer#slice creates a view
		if (typeof Buffer !== 'undefined') {
			const buff = Buffer.from([10, 20, 30, 40]);
			const b2 = buff.slice(1, 3);
			assert.strictEqual(buff[1], 20);
			assert.strictEqual(b2[0], 20);

			buff[1] = 17; // modify buff AND b2
			assert.strictEqual(buff[1], 17);
			assert.strictEqual(b2[0], 17);
		}

		// TypedArray#slice creates a copy
		{
			const unit = new Uint8Array([10, 20, 30, 40]);
			const u2 = unit.slice(1, 3);
			assert.strictEqual(unit[1], 20);
			assert.strictEqual(u2[0], 20);

			unit[1] = 17; // modify unit, NOT b2
			assert.strictEqual(unit[1], 17);
			assert.strictEqual(u2[0], 20);
		}

		// TypedArray#subarray creates a view
		{
			const unit = new Uint8Array([10, 20, 30, 40]);
			const u2 = unit.subarray(1, 3);
			assert.strictEqual(unit[1], 20);
			assert.strictEqual(u2[0], 20);

			unit[1] = 17; // modify unit AND b2
			assert.strictEqual(unit[1], 17);
			assert.strictEqual(u2[0], 17);
		}
	});

	test('indexOf', () => {
		const haystack = VSBuffer.fromString('abcaabbccaaabbbccc');
		assert.strictEqual(haystack.indexOf(VSBuffer.fromString('')), 0);
		assert.strictEqual(haystack.indexOf(VSBuffer.fromString('a'.repeat(100))), -1);

		assert.strictEqual(haystack.indexOf(VSBuffer.fromString('a')), 0);
		assert.strictEqual(haystack.indexOf(VSBuffer.fromString('c')), 2);

		assert.strictEqual(haystack.indexOf(VSBuffer.fromString('abcaa')), 0);
		assert.strictEqual(haystack.indexOf(VSBuffer.fromString('caaab')), 8);
		assert.strictEqual(haystack.indexOf(VSBuffer.fromString('ccc')), 15);

		assert.strictEqual(haystack.indexOf(VSBuffer.fromString('cccb')), -1);
	});

	test('wrap', () => {
		const actual = new Uint8Array([1, 2, 3]);
		const wrapped = VSBuffer.wrap(actual);
		assert.strictEqual(wrapped.byteLength, 3);
		assert.deepStrictEqual(Array.from(wrapped.buffer), [1, 2, 3]);
	});

	test('fromString', () => {
		const value = 'Hello World';
		const buff = VSBuffer.fromString(value);
		assert.strictEqual(buff.toString(), value);
	});

	test('fromByteArray', () => {
		const array = [1, 2, 3, 4, 5];
		const buff = VSBuffer.fromByteArray(array);
		assert.strictEqual(buff.byteLength, array.length);
		assert.deepStrictEqual(Array.from(buff.buffer), array);
	});

	test('concat', () => {
		const chunks = [
			VSBuffer.fromString('abc'),
			VSBuffer.fromString('def'),
			VSBuffer.fromString('ghi')
		];

		// Test without total length
		const result1 = VSBuffer.concat(chunks);
		assert.strictEqual(result1.toString(), 'abcdefghi');

		// Test with total length
		const result2 = VSBuffer.concat(chunks, 9);
		assert.strictEqual(result2.toString(), 'abcdefghi');
	});

	test('clone', () => {
		const original = VSBuffer.fromString('test');
		const clone = original.clone();

		assert.notStrictEqual(original.buffer, clone.buffer);
		assert.deepStrictEqual(Array.from(original.buffer), Array.from(clone.buffer));
	});

	test('slice', () => {
		const buff = VSBuffer.fromString('Hello World');

		const slice1 = buff.slice(0, 5);
		assert.strictEqual(slice1.toString(), 'Hello');

		const slice2 = buff.slice(6);
		assert.strictEqual(slice2.toString(), 'World');
	});

	test('set', () => {
		const buff = VSBuffer.alloc(5);

		// Test setting from VSBuffer
		buff.set(VSBuffer.fromString('ab'), 0);
		assert.strictEqual(buff.toString().substring(0, 2), 'ab');

		// Test setting from Uint8Array
		buff.set(new Uint8Array([99, 100]), 2); // 'cd'
		assert.strictEqual(buff.toString().substring(2, 4), 'cd');

		// Test invalid input
		assert.throws(() => {
			// eslint-disable-next-line local/code-no-any-casts
			buff.set({} as any);
		});
	});

	test('equals', () => {
		const buff1 = VSBuffer.fromString('test');
		const buff2 = VSBuffer.fromString('test');
		const buff3 = VSBuffer.fromString('different');
		const buff4 = VSBuffer.fromString('tes1');

		assert.strictEqual(buff1.equals(buff1), true);
		assert.strictEqual(buff1.equals(buff2), true);
		assert.strictEqual(buff1.equals(buff3), false);
		assert.strictEqual(buff1.equals(buff4), false);
	});

	test('read/write methods', () => {
		const buff = VSBuffer.alloc(8);

		// Test UInt32BE
		buff.writeUInt32BE(0x12345678, 0);
		assert.strictEqual(buff.readUInt32BE(0), 0x12345678);

		// Test UInt32LE
		buff.writeUInt32LE(0x12345678, 4);
		assert.strictEqual(buff.readUInt32LE(4), 0x12345678);

		// Test UInt8
		const buff2 = VSBuffer.alloc(1);
		buff2.writeUInt8(123, 0);
		assert.strictEqual(buff2.readUInt8(0), 123);
	});

	suite('encoding', () => {
		/*
		Generated with:

		const crypto = require('crypto');

		for (let i = 0; i < 16; i++) {
			const buf =  crypto.randomBytes(i);
			console.log(`[new Uint8Array([${Array.from(buf).join(', ')}]), '${buf.toString('base64')}'],`)
		}

		*/

		const testCases: [Uint8Array, base64: string, hex: string][] = [
			[new Uint8Array([]), '', ''],
			[new Uint8Array([77]), 'TQ==', '4d'],
			[new Uint8Array([230, 138]), '5oo=', 'e68a'],
			[new Uint8Array([104, 98, 82]), 'aGJS', '686252'],
			[new Uint8Array([92, 114, 57, 209]), 'XHI50Q==', '5c7239d1'],
			[new Uint8Array([238, 51, 1, 240, 124]), '7jMB8Hw=', 'ee3301f07c'],
			[new Uint8Array([96, 54, 130, 79, 47, 179]), 'YDaCTy+z', '6036824f2fb3'],
			[new Uint8Array([91, 22, 68, 217, 68, 117, 116]), 'WxZE2UR1dA==', '5b1644d9447574'],
			[new Uint8Array([184, 227, 214, 171, 244, 175, 141, 53]), 'uOPWq/SvjTU=', 'b8e3d6abf4af8d35'],
			[new Uint8Array([53, 98, 93, 130, 71, 117, 191, 137, 156]), 'NWJdgkd1v4mc', '35625d824775bf899c'],
			[new Uint8Array([154, 156, 60, 102, 232, 197, 92, 25, 124, 98]), 'mpw8ZujFXBl8Yg==', '9a9c3c66e8c55c197c62'],
			[new Uint8Array([152, 131, 106, 234, 17, 183, 164, 245, 252, 67, 26]), 'mINq6hG3pPX8Qxo=', '98836aea11b7a4f5fc431a'],
			[new Uint8Array([232, 254, 194, 234, 16, 42, 86, 135, 117, 61, 179, 4]), '6P7C6hAqVod1PbME', 'e8fec2ea102a5687753db304'],
			[new Uint8Array([4, 199, 85, 172, 125, 171, 172, 219, 61, 47, 78, 155, 127]), 'BMdVrH2rrNs9L06bfw==', '04c755ac7dabacdb3d2f4e9b7f'],
			[new Uint8Array([189, 67, 62, 189, 87, 171, 27, 164, 87, 142, 126, 113, 23, 182]), 'vUM+vVerG6RXjn5xF7Y=', 'bd433ebd57ab1ba4578e7e7117b6'],
			[new Uint8Array([153, 156, 145, 240, 228, 200, 199, 158, 40, 167, 97, 52, 217, 148, 43]), 'mZyR8OTIx54op2E02ZQr', '999c91f0e4c8c79e28a76134d9942b'],
		];

		test('encodes base64', () => {
			for (const [bytes, expected] of testCases) {
				assert.strictEqual(encodeBase64(VSBuffer.wrap(bytes)), expected);
			}
		});

		test('decodes, base64', () => {
			for (const [expected, encoded] of testCases) {
				assert.deepStrictEqual(new Uint8Array(decodeBase64(encoded).buffer), expected);
			}
		});

		test('encodes hex', () => {
			for (const [bytes, , expected] of testCases) {
				assert.strictEqual(encodeHex(VSBuffer.wrap(bytes)), expected);
			}
		});

		test('decodes, hex', () => {
			for (const [expected, , encoded] of testCases) {
				assert.deepStrictEqual(new Uint8Array(decodeHex(encoded).buffer), expected);
			}
		});

		test('throws error on invalid encoding', () => {
			assert.throws(() => decodeBase64('invalid!'));
			assert.throws(() => decodeHex('invalid!'));
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/cache.test.ts]---
Location: vscode-main/src/vs/base/test/common/cache.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { timeout } from '../../common/async.js';
import { Cache } from '../../common/cache.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';

suite('Cache', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('simple value', () => {
		let counter = 0;
		const cache = new Cache(_ => Promise.resolve(counter++));

		return cache.get().promise
			.then(c => assert.strictEqual(c, 0), () => assert.fail('Unexpected assertion error'))
			.then(() => cache.get().promise)
			.then(c => assert.strictEqual(c, 0), () => assert.fail('Unexpected assertion error'));
	});

	test('simple error', () => {
		let counter = 0;
		const cache = new Cache(_ => Promise.reject(new Error(String(counter++))));

		return cache.get().promise
			.then(() => assert.fail('Unexpected assertion error'), err => assert.strictEqual(err.message, '0'))
			.then(() => cache.get().promise)
			.then(() => assert.fail('Unexpected assertion error'), err => assert.strictEqual(err.message, '0'));
	});

	test('should retry cancellations', () => {
		let counter1 = 0, counter2 = 0;

		const cache = new Cache(token => {
			counter1++;
			return Promise.resolve(timeout(2, token).then(() => counter2++));
		});

		assert.strictEqual(counter1, 0);
		assert.strictEqual(counter2, 0);
		let result = cache.get();
		assert.strictEqual(counter1, 1);
		assert.strictEqual(counter2, 0);
		result.promise.then(undefined, () => assert(true));
		result.dispose();
		assert.strictEqual(counter1, 1);
		assert.strictEqual(counter2, 0);

		result = cache.get();
		assert.strictEqual(counter1, 2);
		assert.strictEqual(counter2, 0);

		return result.promise
			.then(c => {
				assert.strictEqual(counter1, 2);
				assert.strictEqual(counter2, 1);
			})
			.then(() => cache.get().promise)
			.then(c => {
				assert.strictEqual(counter1, 2);
				assert.strictEqual(counter2, 1);
			});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/cancellation.test.ts]---
Location: vscode-main/src/vs/base/test/common/cancellation.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { CancellationToken, CancellationTokenSource, CancellationTokenPool } from '../../common/cancellation.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';

suite('CancellationToken', function () {

	const store = ensureNoDisposablesAreLeakedInTestSuite();

	test('None', () => {
		assert.strictEqual(CancellationToken.None.isCancellationRequested, false);
		assert.strictEqual(typeof CancellationToken.None.onCancellationRequested, 'function');
	});

	test('cancel before token', function () {

		const source = new CancellationTokenSource();
		assert.strictEqual(source.token.isCancellationRequested, false);
		source.cancel();

		assert.strictEqual(source.token.isCancellationRequested, true);

		return new Promise<void>(resolve => {
			source.token.onCancellationRequested(() => resolve());
		});
	});

	test('cancel happens only once', function () {

		const source = new CancellationTokenSource();
		assert.strictEqual(source.token.isCancellationRequested, false);

		let cancelCount = 0;
		function onCancel() {
			cancelCount += 1;
		}

		store.add(source.token.onCancellationRequested(onCancel));

		source.cancel();
		source.cancel();

		assert.strictEqual(cancelCount, 1);
	});

	test('cancel calls all listeners', function () {

		let count = 0;

		const source = new CancellationTokenSource();
		store.add(source.token.onCancellationRequested(() => count++));
		store.add(source.token.onCancellationRequested(() => count++));
		store.add(source.token.onCancellationRequested(() => count++));

		source.cancel();
		assert.strictEqual(count, 3);
	});

	test('token stays the same', function () {

		let source = new CancellationTokenSource();
		let token = source.token;
		assert.ok(token === source.token); // doesn't change on get

		source.cancel();
		assert.ok(token === source.token); // doesn't change after cancel

		source.cancel();
		assert.ok(token === source.token); // doesn't change after 2nd cancel

		source = new CancellationTokenSource();
		source.cancel();
		token = source.token;
		assert.ok(token === source.token); // doesn't change on get
	});

	test('dispose calls no listeners', function () {

		let count = 0;

		const source = new CancellationTokenSource();
		store.add(source.token.onCancellationRequested(() => count++));

		source.dispose();
		source.cancel();
		assert.strictEqual(count, 0);
	});

	test('dispose calls no listeners (unless told to cancel)', function () {

		let count = 0;

		const source = new CancellationTokenSource();
		store.add(source.token.onCancellationRequested(() => count++));

		source.dispose(true);
		// source.cancel();
		assert.strictEqual(count, 1);
	});

	test('dispose does not cancel', function () {
		const source = new CancellationTokenSource();
		source.dispose();
		assert.strictEqual(source.token.isCancellationRequested, false);
	});

	test('parent cancels child', function () {

		const parent = new CancellationTokenSource();
		const child = new CancellationTokenSource(parent.token);

		let count = 0;
		store.add(child.token.onCancellationRequested(() => count++));

		parent.cancel();

		assert.strictEqual(count, 1);
		assert.strictEqual(child.token.isCancellationRequested, true);
		assert.strictEqual(parent.token.isCancellationRequested, true);

		child.dispose();
		parent.dispose();
	});
});

suite('CancellationTokenPool', function () {

	const store = ensureNoDisposablesAreLeakedInTestSuite();

	test('empty pool token is not cancelled', function () {
		const pool = new CancellationTokenPool();
		store.add(pool);

		assert.strictEqual(pool.token.isCancellationRequested, false);
	});

	test('pool token cancels when all tokens are cancelled', function () {
		const pool = new CancellationTokenPool();
		store.add(pool);

		const source1 = new CancellationTokenSource();
		const source2 = new CancellationTokenSource();
		const source3 = new CancellationTokenSource();

		pool.add(source1.token);
		pool.add(source2.token);
		pool.add(source3.token);

		assert.strictEqual(pool.token.isCancellationRequested, false);

		source1.cancel();
		assert.strictEqual(pool.token.isCancellationRequested, false);

		source2.cancel();
		assert.strictEqual(pool.token.isCancellationRequested, false);

		source3.cancel();
		assert.strictEqual(pool.token.isCancellationRequested, true);

		source1.dispose();
		source2.dispose();
		source3.dispose();
	});

	test('pool token fires cancellation event when all tokens are cancelled', function () {
		return new Promise<void>(resolve => {
			const pool = new CancellationTokenPool();
			store.add(pool);

			const source1 = new CancellationTokenSource();
			const source2 = new CancellationTokenSource();

			pool.add(source1.token);
			pool.add(source2.token);

			store.add(pool.token.onCancellationRequested(() => resolve()));

			source1.cancel();
			source2.cancel();

			source1.dispose();
			source2.dispose();
		});
	});

	test('adding already cancelled token counts immediately', function () {
		const pool = new CancellationTokenPool();
		store.add(pool);

		const source1 = new CancellationTokenSource();
		const source2 = new CancellationTokenSource();

		source1.cancel(); // Cancel before adding to pool

		pool.add(source1.token);
		assert.strictEqual(pool.token.isCancellationRequested, true); // 1 of 1 cancelled, so pool is cancelled

		pool.add(source2.token); // Adding after pool is done should have no effect
		assert.strictEqual(pool.token.isCancellationRequested, true);

		source2.cancel(); // This should have no effect since pool is already done
		assert.strictEqual(pool.token.isCancellationRequested, true);

		source1.dispose();
		source2.dispose();
	});

	test('adding single already cancelled token cancels pool immediately', function () {
		const pool = new CancellationTokenPool();
		store.add(pool);

		const source = new CancellationTokenSource();
		source.cancel();

		pool.add(source.token);
		assert.strictEqual(pool.token.isCancellationRequested, true); // 1 of 1 cancelled

		source.dispose();
	});

	test('adding token after pool is done has no effect', function () {
		const pool = new CancellationTokenPool();
		store.add(pool);

		const source1 = new CancellationTokenSource();
		const source2 = new CancellationTokenSource();

		pool.add(source1.token);
		source1.cancel(); // Pool should be done now

		assert.strictEqual(pool.token.isCancellationRequested, true);

		// Adding another token should have no effect
		pool.add(source2.token);
		source2.cancel();

		assert.strictEqual(pool.token.isCancellationRequested, true);

		source1.dispose();
		source2.dispose();
	});

	test('single token pool behaviour', function () {
		const pool = new CancellationTokenPool();
		store.add(pool);

		const source = new CancellationTokenSource();
		pool.add(source.token);

		assert.strictEqual(pool.token.isCancellationRequested, false);

		source.cancel();
		assert.strictEqual(pool.token.isCancellationRequested, true);

		source.dispose();
	});

	test('pool with only cancelled tokens', function () {
		const pool = new CancellationTokenPool();
		store.add(pool);

		const source1 = new CancellationTokenSource();
		const source2 = new CancellationTokenSource();

		source1.cancel();
		source2.cancel();

		pool.add(source1.token);
		pool.add(source2.token);

		assert.strictEqual(pool.token.isCancellationRequested, true);

		source1.dispose();
		source2.dispose();
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/cancelPreviousCalls.test.ts]---
Location: vscode-main/src/vs/base/test/common/cancelPreviousCalls.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Disposable } from '../../common/lifecycle.js';
import { CancellationToken } from '../../common/cancellation.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';
import { cancelPreviousCalls } from '../../common/decorators/cancelPreviousCalls.js';

suite('cancelPreviousCalls decorator', () => {
	const disposables = ensureNoDisposablesAreLeakedInTestSuite();

	class MockDisposable extends Disposable {
		/**
		 * Arguments that the {@linkcode doSomethingAsync} method was called with.
		 */
		private readonly callArgs1: ([number, string, CancellationToken | undefined])[] = [];

		/**
		 * Arguments that the {@linkcode doSomethingElseAsync} method was called with.
		 */
		private readonly callArgs2: ([number, string, CancellationToken | undefined])[] = [];

		/**
		 * Returns the arguments that the {@linkcode doSomethingAsync} method was called with.
		 */
		public get callArguments1() {
			return this.callArgs1;
		}

		/**
		 * Returns the arguments that the {@linkcode doSomethingElseAsync} method was called with.
		 */
		public get callArguments2() {
			return this.callArgs2;
		}

		@cancelPreviousCalls
		async doSomethingAsync(arg1: number, arg2: string, cancellationToken?: CancellationToken): Promise<void> {
			this.callArgs1.push([arg1, arg2, cancellationToken]);

			await new Promise(resolve => setTimeout(resolve, 25));
		}

		@cancelPreviousCalls
		async doSomethingElseAsync(arg1: number, arg2: string, cancellationToken?: CancellationToken): Promise<void> {
			this.callArgs2.push([arg1, arg2, cancellationToken]);

			await new Promise(resolve => setTimeout(resolve, 25));
		}
	}

	test('should call method with CancellationToken', async () => {
		const instance = disposables.add(new MockDisposable());

		await instance.doSomethingAsync(1, 'foo');

		const callArguments = instance.callArguments1;
		assert.strictEqual(
			callArguments.length,
			1,
			`The 'doSomethingAsync' method must be called just once.`,
		);

		const args = callArguments[0];
		assert(
			args.length === 3,
			`The 'doSomethingAsync' method must be called with '3' arguments, got '${args.length}'.`,
		);

		const arg1 = args[0];
		const arg2 = args[1];
		const arg3 = args[2];

		assert.strictEqual(
			arg1,
			1,
			`The 'doSomethingAsync' method call must have the correct 1st argument.`,
		);

		assert.strictEqual(
			arg2,
			'foo',
			`The 'doSomethingAsync' method call must have the correct 2nd argument.`,
		);

		assert(
			CancellationToken.isCancellationToken(arg3),
			`The last argument of the 'doSomethingAsync' method must be a 'CancellationToken', got '${arg3}'.`,
		);

		assert(
			arg3.isCancellationRequested === false,
			`The 'CancellationToken' argument must not yet be cancelled.`,
		);

		assert(
			instance.callArguments2.length === 0,
			`The 'doSomethingElseAsync' method must not be called.`,
		);
	});

	test('cancel token of the previous call when method is called again', async () => {
		const instance = disposables.add(new MockDisposable());

		instance.doSomethingAsync(1, 'foo');
		await new Promise(resolve => setTimeout(resolve, 10));
		instance.doSomethingAsync(2, 'bar');

		const callArguments = instance.callArguments1;
		assert.strictEqual(
			callArguments.length,
			2,
			`The 'doSomethingAsync' method must be called twice.`,
		);

		const call1Args = callArguments[0];
		assert(
			call1Args.length === 3,
			`The first call of the 'doSomethingAsync' method must have '3' arguments, got '${call1Args.length}'.`,
		);

		assert.strictEqual(
			call1Args[0],
			1,
			`The first call of the 'doSomethingAsync' method must have the correct 1st argument.`,
		);

		assert.strictEqual(
			call1Args[1],
			'foo',
			`The first call of the 'doSomethingAsync' method must have the correct 2nd argument.`,
		);

		assert(
			CancellationToken.isCancellationToken(call1Args[2]),
			`The first call of the 'doSomethingAsync' method must have the 'CancellationToken' as the 3rd argument.`,
		);

		assert(
			call1Args[2].isCancellationRequested === true,
			`The 'CancellationToken' of the first call must be cancelled.`,
		);

		const call2Args = callArguments[1];
		assert(
			call2Args.length === 3,
			`The second call of the 'doSomethingAsync' method must have '3' arguments, got '${call1Args.length}'.`,
		);

		assert.strictEqual(
			call2Args[0],
			2,
			`The second call of the 'doSomethingAsync' method must have the correct 1st argument.`,
		);

		assert.strictEqual(
			call2Args[1],
			'bar',
			`The second call of the 'doSomethingAsync' method must have the correct 2nd argument.`,
		);

		assert(
			CancellationToken.isCancellationToken(call2Args[2]),
			`The second call of the 'doSomethingAsync' method must have the 'CancellationToken' as the 3rd argument.`,
		);

		assert(
			call2Args[2].isCancellationRequested === false,
			`The 'CancellationToken' of the second call must be cancelled.`,
		);

		assert(
			instance.callArguments2.length === 0,
			`The 'doSomethingElseAsync' method must not be called.`,
		);
	});

	test('different method calls must not interfere with each other', async () => {
		const instance = disposables.add(new MockDisposable());

		instance.doSomethingAsync(10, 'baz');
		await new Promise(resolve => setTimeout(resolve, 10));
		instance.doSomethingElseAsync(25, 'qux');

		assert.strictEqual(
			instance.callArguments1.length,
			1,
			`The 'doSomethingAsync' method must be called once.`,
		);

		const call1Args = instance.callArguments1[0];
		assert(
			call1Args.length === 3,
			`The first call of the 'doSomethingAsync' method must have '3' arguments, got '${call1Args.length}'.`,
		);

		assert.strictEqual(
			call1Args[0],
			10,
			`The first call of the 'doSomethingAsync' method must have the correct 1st argument.`,
		);

		assert.strictEqual(
			call1Args[1],
			'baz',
			`The first call of the 'doSomethingAsync' method must have the correct 2nd argument.`,
		);

		assert(
			CancellationToken.isCancellationToken(call1Args[2]),
			`The first call of the 'doSomethingAsync' method must have the 'CancellationToken' as the 3rd argument.`,
		);

		assert(
			call1Args[2].isCancellationRequested === false,
			`The 'CancellationToken' of the first call must not be cancelled.`,
		);

		assert.strictEqual(
			instance.callArguments2.length,
			1,
			`The 'doSomethingElseAsync' method must be called once.`,
		);

		const call2Args = instance.callArguments2[0];
		assert(
			call2Args.length === 3,
			`The first call of the 'doSomethingElseAsync' method must have '3' arguments, got '${call1Args.length}'.`,
		);

		assert.strictEqual(
			call2Args[0],
			25,
			`The first call of the 'doSomethingElseAsync' method must have the correct 1st argument.`,
		);

		assert.strictEqual(
			call2Args[1],
			'qux',
			`The first call of the 'doSomethingElseAsync' method must have the correct 2nd argument.`,
		);

		assert(
			CancellationToken.isCancellationToken(call2Args[2]),
			`The first call of the 'doSomethingElseAsync' method must have the 'CancellationToken' as the 3rd argument.`,
		);

		assert(
			call2Args[2].isCancellationRequested === false,
			`The 'CancellationToken' of the second call must be cancelled.`,
		);

		instance.doSomethingElseAsync(105, 'uxi');

		assert.strictEqual(
			instance.callArguments1.length,
			1,
			`The 'doSomethingAsync' method must be called once.`,
		);

		assert.strictEqual(
			instance.callArguments2.length,
			2,
			`The 'doSomethingElseAsync' method must be called twice.`,
		);

		assert(
			call1Args[2].isCancellationRequested === false,
			`The 'CancellationToken' of the first call must not be cancelled.`,
		);

		const call3Args = instance.callArguments2[1];
		assert(
			CancellationToken.isCancellationToken(call3Args[2]),
			`The last argument of the second call of the 'doSomethingElseAsync' method must be a 'CancellationToken'.`,
		);

		assert(
			call2Args[2].isCancellationRequested,
			`The 'CancellationToken' of the first call must be cancelled.`,
		);

		assert(
			call3Args[2].isCancellationRequested === false,
			`The 'CancellationToken' of the second call must not be cancelled.`,
		);

		assert.strictEqual(
			call3Args[0],
			105,
			`The second call of the 'doSomethingElseAsync' method must have the correct 1st argument.`,
		);

		assert.strictEqual(
			call3Args[1],
			'uxi',
			`The second call of the 'doSomethingElseAsync' method must have the correct 2nd argument.`,
		);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/charCode.test.ts]---
Location: vscode-main/src/vs/base/test/common/charCode.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { CharCode } from '../../common/charCode.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';

suite('CharCode', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('has good values', () => {

		function assertValue(actual: CharCode, expected: string): void {
			assert.strictEqual(actual, expected.charCodeAt(0), 'char code ok for <<' + expected + '>>');
		}

		assertValue(CharCode.Tab, '\t');
		assertValue(CharCode.LineFeed, '\n');
		assertValue(CharCode.CarriageReturn, '\r');
		assertValue(CharCode.Space, ' ');
		assertValue(CharCode.ExclamationMark, '!');
		assertValue(CharCode.DoubleQuote, '"');
		assertValue(CharCode.Hash, '#');
		assertValue(CharCode.DollarSign, '$');
		assertValue(CharCode.PercentSign, '%');
		assertValue(CharCode.Ampersand, '&');
		assertValue(CharCode.SingleQuote, '\'');
		assertValue(CharCode.OpenParen, '(');
		assertValue(CharCode.CloseParen, ')');
		assertValue(CharCode.Asterisk, '*');
		assertValue(CharCode.Plus, '+');
		assertValue(CharCode.Comma, ',');
		assertValue(CharCode.Dash, '-');
		assertValue(CharCode.Period, '.');
		assertValue(CharCode.Slash, '/');

		assertValue(CharCode.Digit0, '0');
		assertValue(CharCode.Digit1, '1');
		assertValue(CharCode.Digit2, '2');
		assertValue(CharCode.Digit3, '3');
		assertValue(CharCode.Digit4, '4');
		assertValue(CharCode.Digit5, '5');
		assertValue(CharCode.Digit6, '6');
		assertValue(CharCode.Digit7, '7');
		assertValue(CharCode.Digit8, '8');
		assertValue(CharCode.Digit9, '9');

		assertValue(CharCode.Colon, ':');
		assertValue(CharCode.Semicolon, ';');
		assertValue(CharCode.LessThan, '<');
		assertValue(CharCode.Equals, '=');
		assertValue(CharCode.GreaterThan, '>');
		assertValue(CharCode.QuestionMark, '?');
		assertValue(CharCode.AtSign, '@');

		assertValue(CharCode.A, 'A');
		assertValue(CharCode.B, 'B');
		assertValue(CharCode.C, 'C');
		assertValue(CharCode.D, 'D');
		assertValue(CharCode.E, 'E');
		assertValue(CharCode.F, 'F');
		assertValue(CharCode.G, 'G');
		assertValue(CharCode.H, 'H');
		assertValue(CharCode.I, 'I');
		assertValue(CharCode.J, 'J');
		assertValue(CharCode.K, 'K');
		assertValue(CharCode.L, 'L');
		assertValue(CharCode.M, 'M');
		assertValue(CharCode.N, 'N');
		assertValue(CharCode.O, 'O');
		assertValue(CharCode.P, 'P');
		assertValue(CharCode.Q, 'Q');
		assertValue(CharCode.R, 'R');
		assertValue(CharCode.S, 'S');
		assertValue(CharCode.T, 'T');
		assertValue(CharCode.U, 'U');
		assertValue(CharCode.V, 'V');
		assertValue(CharCode.W, 'W');
		assertValue(CharCode.X, 'X');
		assertValue(CharCode.Y, 'Y');
		assertValue(CharCode.Z, 'Z');

		assertValue(CharCode.OpenSquareBracket, '[');
		assertValue(CharCode.Backslash, '\\');
		assertValue(CharCode.CloseSquareBracket, ']');
		assertValue(CharCode.Caret, '^');
		assertValue(CharCode.Underline, '_');
		assertValue(CharCode.BackTick, '`');

		assertValue(CharCode.a, 'a');
		assertValue(CharCode.b, 'b');
		assertValue(CharCode.c, 'c');
		assertValue(CharCode.d, 'd');
		assertValue(CharCode.e, 'e');
		assertValue(CharCode.f, 'f');
		assertValue(CharCode.g, 'g');
		assertValue(CharCode.h, 'h');
		assertValue(CharCode.i, 'i');
		assertValue(CharCode.j, 'j');
		assertValue(CharCode.k, 'k');
		assertValue(CharCode.l, 'l');
		assertValue(CharCode.m, 'm');
		assertValue(CharCode.n, 'n');
		assertValue(CharCode.o, 'o');
		assertValue(CharCode.p, 'p');
		assertValue(CharCode.q, 'q');
		assertValue(CharCode.r, 'r');
		assertValue(CharCode.s, 's');
		assertValue(CharCode.t, 't');
		assertValue(CharCode.u, 'u');
		assertValue(CharCode.v, 'v');
		assertValue(CharCode.w, 'w');
		assertValue(CharCode.x, 'x');
		assertValue(CharCode.y, 'y');
		assertValue(CharCode.z, 'z');

		assertValue(CharCode.OpenCurlyBrace, '{');
		assertValue(CharCode.Pipe, '|');
		assertValue(CharCode.CloseCurlyBrace, '}');
		assertValue(CharCode.Tilde, '~');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/collections.test.ts]---
Location: vscode-main/src/vs/base/test/common/collections.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import * as collections from '../../common/collections.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';

suite('Collections', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('groupBy', () => {

		const group1 = 'a', group2 = 'b';
		const value1 = 1, value2 = 2, value3 = 3;
		const source = [
			{ key: group1, value: value1 },
			{ key: group1, value: value2 },
			{ key: group2, value: value3 },
		];

		const grouped = collections.groupBy(source, x => x.key);

		// Group 1
		assert.strictEqual(grouped[group1]?.length, 2);
		assert.strictEqual(grouped[group1][0].value, value1);
		assert.strictEqual(grouped[group1][1].value, value2);

		// Group 2
		assert.strictEqual(grouped[group2]?.length, 1);
		assert.strictEqual(grouped[group2][0].value, value3);
	});

	suite('SetWithKey', () => {
		let setWithKey: collections.SetWithKey<{ someProp: string }>;

		const initialValues = ['a', 'b', 'c'].map(s => ({ someProp: s }));
		setup(() => {
			setWithKey = new collections.SetWithKey<{ someProp: string }>(initialValues, value => value.someProp);
		});

		test('size', () => {
			assert.strictEqual(setWithKey.size, 3);
		});

		test('add', () => {
			setWithKey.add({ someProp: 'd' });
			assert.strictEqual(setWithKey.size, 4);
			assert.strictEqual(setWithKey.has({ someProp: 'd' }), true);
		});

		test('delete', () => {
			assert.strictEqual(setWithKey.has({ someProp: 'b' }), true);
			setWithKey.delete({ someProp: 'b' });
			assert.strictEqual(setWithKey.size, 2);
			assert.strictEqual(setWithKey.has({ someProp: 'b' }), false);
		});

		test('has', () => {
			assert.strictEqual(setWithKey.has({ someProp: 'a' }), true);
			assert.strictEqual(setWithKey.has({ someProp: 'b' }), true);
		});

		test('entries', () => {
			const entries = Array.from(setWithKey.entries());
			assert.deepStrictEqual(entries, initialValues.map(value => [value, value]));
		});

		test('keys and values', () => {
			const keys = Array.from(setWithKey.keys());
			const values = Array.from(setWithKey.values());
			assert.deepStrictEqual(keys, initialValues);
			assert.deepStrictEqual(values, initialValues);
		});

		test('clear', () => {
			setWithKey.clear();
			assert.strictEqual(setWithKey.size, 0);
		});

		test('forEach', () => {
			const values: any[] = [];
			setWithKey.forEach(value => values.push(value));
			assert.deepStrictEqual(values, initialValues);
		});

		test('iterator', () => {
			const values: any[] = [];
			for (const value of setWithKey) {
				values.push(value);
			}
			assert.deepStrictEqual(values, initialValues);
		});

		test('toStringTag', () => {
			assert.strictEqual(setWithKey[Symbol.toStringTag], 'SetWithKey');
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/color.test.ts]---
Location: vscode-main/src/vs/base/test/common/color.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Color, HSLA, HSVA, RGBA } from '../../common/color.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';

suite('Color', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('isLighterColor', () => {
		const color1 = new Color(new HSLA(60, 1, 0.5, 1)), color2 = new Color(new HSLA(0, 0, 0.753, 1));

		assert.ok(color1.isLighterThan(color2));

		// Abyss theme
		assert.ok(Color.fromHex('#770811').isLighterThan(Color.fromHex('#000c18')));
	});

	test('getLighterColor', () => {
		const color1 = new Color(new HSLA(60, 1, 0.5, 1)), color2 = new Color(new HSLA(0, 0, 0.753, 1));

		assert.deepStrictEqual(color1.hsla, Color.getLighterColor(color1, color2).hsla);
		assert.deepStrictEqual(new HSLA(0, 0, 0.916, 1), Color.getLighterColor(color2, color1).hsla);
		assert.deepStrictEqual(new HSLA(0, 0, 0.851, 1), Color.getLighterColor(color2, color1, 0.3).hsla);
		assert.deepStrictEqual(new HSLA(0, 0, 0.981, 1), Color.getLighterColor(color2, color1, 0.7).hsla);
		assert.deepStrictEqual(new HSLA(0, 0, 1, 1), Color.getLighterColor(color2, color1, 1).hsla);

	});

	test('isDarkerColor', () => {
		const color1 = new Color(new HSLA(60, 1, 0.5, 1)), color2 = new Color(new HSLA(0, 0, 0.753, 1));

		assert.ok(color2.isDarkerThan(color1));

	});

	test('getDarkerColor', () => {
		const color1 = new Color(new HSLA(60, 1, 0.5, 1)), color2 = new Color(new HSLA(0, 0, 0.753, 1));

		assert.deepStrictEqual(color2.hsla, Color.getDarkerColor(color2, color1).hsla);
		assert.deepStrictEqual(new HSLA(60, 1, 0.392, 1), Color.getDarkerColor(color1, color2).hsla);
		assert.deepStrictEqual(new HSLA(60, 1, 0.435, 1), Color.getDarkerColor(color1, color2, 0.3).hsla);
		assert.deepStrictEqual(new HSLA(60, 1, 0.349, 1), Color.getDarkerColor(color1, color2, 0.7).hsla);
		assert.deepStrictEqual(new HSLA(60, 1, 0.284, 1), Color.getDarkerColor(color1, color2, 1).hsla);

		// Abyss theme
		assert.deepStrictEqual(new HSLA(355, 0.874, 0.157, 1), Color.getDarkerColor(Color.fromHex('#770811'), Color.fromHex('#000c18'), 0.4).hsla);
	});

	test('luminance', () => {
		assert.deepStrictEqual(0, new Color(new RGBA(0, 0, 0, 1)).getRelativeLuminance());
		assert.deepStrictEqual(1, new Color(new RGBA(255, 255, 255, 1)).getRelativeLuminance());

		assert.deepStrictEqual(0.2126, new Color(new RGBA(255, 0, 0, 1)).getRelativeLuminance());
		assert.deepStrictEqual(0.7152, new Color(new RGBA(0, 255, 0, 1)).getRelativeLuminance());
		assert.deepStrictEqual(0.0722, new Color(new RGBA(0, 0, 255, 1)).getRelativeLuminance());

		assert.deepStrictEqual(0.9278, new Color(new RGBA(255, 255, 0, 1)).getRelativeLuminance());
		assert.deepStrictEqual(0.7874, new Color(new RGBA(0, 255, 255, 1)).getRelativeLuminance());
		assert.deepStrictEqual(0.2848, new Color(new RGBA(255, 0, 255, 1)).getRelativeLuminance());

		assert.deepStrictEqual(0.5271, new Color(new RGBA(192, 192, 192, 1)).getRelativeLuminance());

		assert.deepStrictEqual(0.2159, new Color(new RGBA(128, 128, 128, 1)).getRelativeLuminance());
		assert.deepStrictEqual(0.0459, new Color(new RGBA(128, 0, 0, 1)).getRelativeLuminance());
		assert.deepStrictEqual(0.2003, new Color(new RGBA(128, 128, 0, 1)).getRelativeLuminance());
		assert.deepStrictEqual(0.1544, new Color(new RGBA(0, 128, 0, 1)).getRelativeLuminance());
		assert.deepStrictEqual(0.0615, new Color(new RGBA(128, 0, 128, 1)).getRelativeLuminance());
		assert.deepStrictEqual(0.17, new Color(new RGBA(0, 128, 128, 1)).getRelativeLuminance());
		assert.deepStrictEqual(0.0156, new Color(new RGBA(0, 0, 128, 1)).getRelativeLuminance());
	});

	test('blending', () => {
		assert.deepStrictEqual(new Color(new RGBA(0, 0, 0, 0)).blend(new Color(new RGBA(243, 34, 43))), new Color(new RGBA(243, 34, 43)));
		assert.deepStrictEqual(new Color(new RGBA(255, 255, 255)).blend(new Color(new RGBA(243, 34, 43))), new Color(new RGBA(255, 255, 255)));
		assert.deepStrictEqual(new Color(new RGBA(122, 122, 122, 0.7)).blend(new Color(new RGBA(243, 34, 43))), new Color(new RGBA(158, 95, 98)));
		assert.deepStrictEqual(new Color(new RGBA(0, 0, 0, 0.58)).blend(new Color(new RGBA(255, 255, 255, 0.33))), new Color(new RGBA(49, 49, 49, 0.719)));
	});

	suite('toString', () => {
		test('alpha channel', () => {
			assert.deepStrictEqual(Color.fromHex('#00000000').toString(), 'rgba(0, 0, 0, 0)');
			assert.deepStrictEqual(Color.fromHex('#00000080').toString(), 'rgba(0, 0, 0, 0.5)');
			assert.deepStrictEqual(Color.fromHex('#000000FF').toString(), '#000000');
		});

		test('opaque', () => {
			assert.deepStrictEqual(Color.fromHex('#000000').toString().toUpperCase(), '#000000'.toUpperCase());
			assert.deepStrictEqual(Color.fromHex('#FFFFFF').toString().toUpperCase(), '#FFFFFF'.toUpperCase());
			assert.deepStrictEqual(Color.fromHex('#FF0000').toString().toUpperCase(), '#FF0000'.toUpperCase());
			assert.deepStrictEqual(Color.fromHex('#00FF00').toString().toUpperCase(), '#00FF00'.toUpperCase());
			assert.deepStrictEqual(Color.fromHex('#0000FF').toString().toUpperCase(), '#0000FF'.toUpperCase());
			assert.deepStrictEqual(Color.fromHex('#FFFF00').toString().toUpperCase(), '#FFFF00'.toUpperCase());
			assert.deepStrictEqual(Color.fromHex('#00FFFF').toString().toUpperCase(), '#00FFFF'.toUpperCase());
			assert.deepStrictEqual(Color.fromHex('#FF00FF').toString().toUpperCase(), '#FF00FF'.toUpperCase());
			assert.deepStrictEqual(Color.fromHex('#C0C0C0').toString().toUpperCase(), '#C0C0C0'.toUpperCase());
			assert.deepStrictEqual(Color.fromHex('#808080').toString().toUpperCase(), '#808080'.toUpperCase());
			assert.deepStrictEqual(Color.fromHex('#800000').toString().toUpperCase(), '#800000'.toUpperCase());
			assert.deepStrictEqual(Color.fromHex('#808000').toString().toUpperCase(), '#808000'.toUpperCase());
			assert.deepStrictEqual(Color.fromHex('#008000').toString().toUpperCase(), '#008000'.toUpperCase());
			assert.deepStrictEqual(Color.fromHex('#800080').toString().toUpperCase(), '#800080'.toUpperCase());
			assert.deepStrictEqual(Color.fromHex('#008080').toString().toUpperCase(), '#008080'.toUpperCase());
			assert.deepStrictEqual(Color.fromHex('#000080').toString().toUpperCase(), '#000080'.toUpperCase());
			assert.deepStrictEqual(Color.fromHex('#010203').toString().toUpperCase(), '#010203'.toUpperCase());
			assert.deepStrictEqual(Color.fromHex('#040506').toString().toUpperCase(), '#040506'.toUpperCase());
			assert.deepStrictEqual(Color.fromHex('#070809').toString().toUpperCase(), '#070809'.toUpperCase());
			assert.deepStrictEqual(Color.fromHex('#0a0A0a').toString().toUpperCase(), '#0a0A0a'.toUpperCase());
			assert.deepStrictEqual(Color.fromHex('#0b0B0b').toString().toUpperCase(), '#0b0B0b'.toUpperCase());
			assert.deepStrictEqual(Color.fromHex('#0c0C0c').toString().toUpperCase(), '#0c0C0c'.toUpperCase());
			assert.deepStrictEqual(Color.fromHex('#0d0D0d').toString().toUpperCase(), '#0d0D0d'.toUpperCase());
			assert.deepStrictEqual(Color.fromHex('#0e0E0e').toString().toUpperCase(), '#0e0E0e'.toUpperCase());
			assert.deepStrictEqual(Color.fromHex('#0f0F0f').toString().toUpperCase(), '#0f0F0f'.toUpperCase());
			assert.deepStrictEqual(Color.fromHex('#a0A0a0').toString().toUpperCase(), '#a0A0a0'.toUpperCase());
		});
	});

	suite('toNumber32Bit', () => {
		test('alpha channel', () => {
			assert.deepStrictEqual(Color.fromHex('#00000000').toNumber32Bit(), 0x00000000);
			assert.deepStrictEqual(Color.fromHex('#00000080').toNumber32Bit(), 0x00000080);
			assert.deepStrictEqual(Color.fromHex('#000000FF').toNumber32Bit(), 0x000000FF);
		});

		test('opaque', () => {
			assert.deepStrictEqual(Color.fromHex('#000000').toNumber32Bit(), 0x000000FF);
			assert.deepStrictEqual(Color.fromHex('#FFFFFF').toNumber32Bit(), 0xFFFFFFFF);
			assert.deepStrictEqual(Color.fromHex('#FF0000').toNumber32Bit(), 0xFF0000FF);
			assert.deepStrictEqual(Color.fromHex('#00FF00').toNumber32Bit(), 0x00FF00FF);
			assert.deepStrictEqual(Color.fromHex('#0000FF').toNumber32Bit(), 0x0000FFFF);
			assert.deepStrictEqual(Color.fromHex('#FFFF00').toNumber32Bit(), 0xFFFF00FF);
			assert.deepStrictEqual(Color.fromHex('#00FFFF').toNumber32Bit(), 0x00FFFFFF);
			assert.deepStrictEqual(Color.fromHex('#FF00FF').toNumber32Bit(), 0xFF00FFFF);
			assert.deepStrictEqual(Color.fromHex('#C0C0C0').toNumber32Bit(), 0xC0C0C0FF);
			assert.deepStrictEqual(Color.fromHex('#808080').toNumber32Bit(), 0x808080FF);
			assert.deepStrictEqual(Color.fromHex('#800000').toNumber32Bit(), 0x800000FF);
			assert.deepStrictEqual(Color.fromHex('#808000').toNumber32Bit(), 0x808000FF);
			assert.deepStrictEqual(Color.fromHex('#008000').toNumber32Bit(), 0x008000FF);
			assert.deepStrictEqual(Color.fromHex('#800080').toNumber32Bit(), 0x800080FF);
			assert.deepStrictEqual(Color.fromHex('#008080').toNumber32Bit(), 0x008080FF);
			assert.deepStrictEqual(Color.fromHex('#000080').toNumber32Bit(), 0x000080FF);
			assert.deepStrictEqual(Color.fromHex('#010203').toNumber32Bit(), 0x010203FF);
			assert.deepStrictEqual(Color.fromHex('#040506').toNumber32Bit(), 0x040506FF);
			assert.deepStrictEqual(Color.fromHex('#070809').toNumber32Bit(), 0x070809FF);
			assert.deepStrictEqual(Color.fromHex('#0a0A0a').toNumber32Bit(), 0x0a0A0aFF);
			assert.deepStrictEqual(Color.fromHex('#0b0B0b').toNumber32Bit(), 0x0b0B0bFF);
			assert.deepStrictEqual(Color.fromHex('#0c0C0c').toNumber32Bit(), 0x0c0C0cFF);
			assert.deepStrictEqual(Color.fromHex('#0d0D0d').toNumber32Bit(), 0x0d0D0dFF);
			assert.deepStrictEqual(Color.fromHex('#0e0E0e').toNumber32Bit(), 0x0e0E0eFF);
			assert.deepStrictEqual(Color.fromHex('#0f0F0f').toNumber32Bit(), 0x0f0F0fFF);
			assert.deepStrictEqual(Color.fromHex('#a0A0a0').toNumber32Bit(), 0xa0A0a0FF);
		});
	});

	suite('HSLA', () => {
		test('HSLA.toRGBA', () => {
			assert.deepStrictEqual(HSLA.toRGBA(new HSLA(0, 0, 0, 0)), new RGBA(0, 0, 0, 0));
			assert.deepStrictEqual(HSLA.toRGBA(new HSLA(0, 0, 0, 1)), new RGBA(0, 0, 0, 1));
			assert.deepStrictEqual(HSLA.toRGBA(new HSLA(0, 0, 1, 1)), new RGBA(255, 255, 255, 1));

			assert.deepStrictEqual(HSLA.toRGBA(new HSLA(0, 1, 0.5, 1)), new RGBA(255, 0, 0, 1));
			assert.deepStrictEqual(HSLA.toRGBA(new HSLA(120, 1, 0.5, 1)), new RGBA(0, 255, 0, 1));
			assert.deepStrictEqual(HSLA.toRGBA(new HSLA(240, 1, 0.5, 1)), new RGBA(0, 0, 255, 1));

			assert.deepStrictEqual(HSLA.toRGBA(new HSLA(60, 1, 0.5, 1)), new RGBA(255, 255, 0, 1));
			assert.deepStrictEqual(HSLA.toRGBA(new HSLA(180, 1, 0.5, 1)), new RGBA(0, 255, 255, 1));
			assert.deepStrictEqual(HSLA.toRGBA(new HSLA(300, 1, 0.5, 1)), new RGBA(255, 0, 255, 1));

			assert.deepStrictEqual(HSLA.toRGBA(new HSLA(0, 0, 0.753, 1)), new RGBA(192, 192, 192, 1));

			assert.deepStrictEqual(HSLA.toRGBA(new HSLA(0, 0, 0.502, 1)), new RGBA(128, 128, 128, 1));
			assert.deepStrictEqual(HSLA.toRGBA(new HSLA(0, 1, 0.251, 1)), new RGBA(128, 0, 0, 1));
			assert.deepStrictEqual(HSLA.toRGBA(new HSLA(60, 1, 0.251, 1)), new RGBA(128, 128, 0, 1));
			assert.deepStrictEqual(HSLA.toRGBA(new HSLA(120, 1, 0.251, 1)), new RGBA(0, 128, 0, 1));
			assert.deepStrictEqual(HSLA.toRGBA(new HSLA(300, 1, 0.251, 1)), new RGBA(128, 0, 128, 1));
			assert.deepStrictEqual(HSLA.toRGBA(new HSLA(180, 1, 0.251, 1)), new RGBA(0, 128, 128, 1));
			assert.deepStrictEqual(HSLA.toRGBA(new HSLA(240, 1, 0.251, 1)), new RGBA(0, 0, 128, 1));
		});

		test('HSLA.fromRGBA', () => {
			assert.deepStrictEqual(HSLA.fromRGBA(new RGBA(0, 0, 0, 0)), new HSLA(0, 0, 0, 0));
			assert.deepStrictEqual(HSLA.fromRGBA(new RGBA(0, 0, 0, 1)), new HSLA(0, 0, 0, 1));
			assert.deepStrictEqual(HSLA.fromRGBA(new RGBA(255, 255, 255, 1)), new HSLA(0, 0, 1, 1));

			assert.deepStrictEqual(HSLA.fromRGBA(new RGBA(255, 0, 0, 1)), new HSLA(0, 1, 0.5, 1));
			assert.deepStrictEqual(HSLA.fromRGBA(new RGBA(0, 255, 0, 1)), new HSLA(120, 1, 0.5, 1));
			assert.deepStrictEqual(HSLA.fromRGBA(new RGBA(0, 0, 255, 1)), new HSLA(240, 1, 0.5, 1));

			assert.deepStrictEqual(HSLA.fromRGBA(new RGBA(255, 255, 0, 1)), new HSLA(60, 1, 0.5, 1));
			assert.deepStrictEqual(HSLA.fromRGBA(new RGBA(0, 255, 255, 1)), new HSLA(180, 1, 0.5, 1));
			assert.deepStrictEqual(HSLA.fromRGBA(new RGBA(255, 0, 255, 1)), new HSLA(300, 1, 0.5, 1));

			assert.deepStrictEqual(HSLA.fromRGBA(new RGBA(192, 192, 192, 1)), new HSLA(0, 0, 0.753, 1));

			assert.deepStrictEqual(HSLA.fromRGBA(new RGBA(128, 128, 128, 1)), new HSLA(0, 0, 0.502, 1));
			assert.deepStrictEqual(HSLA.fromRGBA(new RGBA(128, 0, 0, 1)), new HSLA(0, 1, 0.251, 1));
			assert.deepStrictEqual(HSLA.fromRGBA(new RGBA(128, 128, 0, 1)), new HSLA(60, 1, 0.251, 1));
			assert.deepStrictEqual(HSLA.fromRGBA(new RGBA(0, 128, 0, 1)), new HSLA(120, 1, 0.251, 1));
			assert.deepStrictEqual(HSLA.fromRGBA(new RGBA(128, 0, 128, 1)), new HSLA(300, 1, 0.251, 1));
			assert.deepStrictEqual(HSLA.fromRGBA(new RGBA(0, 128, 128, 1)), new HSLA(180, 1, 0.251, 1));
			assert.deepStrictEqual(HSLA.fromRGBA(new RGBA(0, 0, 128, 1)), new HSLA(240, 1, 0.251, 1));
		});
	});

	suite('HSVA', () => {
		test('HSVA.toRGBA', () => {
			assert.deepStrictEqual(HSVA.toRGBA(new HSVA(0, 0, 0, 0)), new RGBA(0, 0, 0, 0));
			assert.deepStrictEqual(HSVA.toRGBA(new HSVA(0, 0, 0, 1)), new RGBA(0, 0, 0, 1));
			assert.deepStrictEqual(HSVA.toRGBA(new HSVA(0, 0, 1, 1)), new RGBA(255, 255, 255, 1));

			assert.deepStrictEqual(HSVA.toRGBA(new HSVA(0, 1, 1, 1)), new RGBA(255, 0, 0, 1));
			assert.deepStrictEqual(HSVA.toRGBA(new HSVA(120, 1, 1, 1)), new RGBA(0, 255, 0, 1));
			assert.deepStrictEqual(HSVA.toRGBA(new HSVA(240, 1, 1, 1)), new RGBA(0, 0, 255, 1));

			assert.deepStrictEqual(HSVA.toRGBA(new HSVA(60, 1, 1, 1)), new RGBA(255, 255, 0, 1));
			assert.deepStrictEqual(HSVA.toRGBA(new HSVA(180, 1, 1, 1)), new RGBA(0, 255, 255, 1));
			assert.deepStrictEqual(HSVA.toRGBA(new HSVA(300, 1, 1, 1)), new RGBA(255, 0, 255, 1));

			assert.deepStrictEqual(HSVA.toRGBA(new HSVA(0, 0, 0.753, 1)), new RGBA(192, 192, 192, 1));

			assert.deepStrictEqual(HSVA.toRGBA(new HSVA(0, 0, 0.502, 1)), new RGBA(128, 128, 128, 1));
			assert.deepStrictEqual(HSVA.toRGBA(new HSVA(0, 1, 0.502, 1)), new RGBA(128, 0, 0, 1));
			assert.deepStrictEqual(HSVA.toRGBA(new HSVA(60, 1, 0.502, 1)), new RGBA(128, 128, 0, 1));
			assert.deepStrictEqual(HSVA.toRGBA(new HSVA(120, 1, 0.502, 1)), new RGBA(0, 128, 0, 1));
			assert.deepStrictEqual(HSVA.toRGBA(new HSVA(300, 1, 0.502, 1)), new RGBA(128, 0, 128, 1));
			assert.deepStrictEqual(HSVA.toRGBA(new HSVA(180, 1, 0.502, 1)), new RGBA(0, 128, 128, 1));
			assert.deepStrictEqual(HSVA.toRGBA(new HSVA(240, 1, 0.502, 1)), new RGBA(0, 0, 128, 1));

			assert.deepStrictEqual(HSVA.toRGBA(new HSVA(360, 0, 0, 0)), new RGBA(0, 0, 0, 0));
			assert.deepStrictEqual(HSVA.toRGBA(new HSVA(360, 0, 0, 1)), new RGBA(0, 0, 0, 1));
			assert.deepStrictEqual(HSVA.toRGBA(new HSVA(360, 0, 1, 1)), new RGBA(255, 255, 255, 1));
			assert.deepStrictEqual(HSVA.toRGBA(new HSVA(360, 1, 1, 1)), new RGBA(255, 0, 0, 1));
			assert.deepStrictEqual(HSVA.toRGBA(new HSVA(360, 0, 0.753, 1)), new RGBA(192, 192, 192, 1));
			assert.deepStrictEqual(HSVA.toRGBA(new HSVA(360, 0, 0.502, 1)), new RGBA(128, 128, 128, 1));
			assert.deepStrictEqual(HSVA.toRGBA(new HSVA(360, 1, 0.502, 1)), new RGBA(128, 0, 0, 1));

		});

		test('HSVA.fromRGBA', () => {

			assert.deepStrictEqual(HSVA.fromRGBA(new RGBA(0, 0, 0, 0)), new HSVA(0, 0, 0, 0));
			assert.deepStrictEqual(HSVA.fromRGBA(new RGBA(0, 0, 0, 1)), new HSVA(0, 0, 0, 1));
			assert.deepStrictEqual(HSVA.fromRGBA(new RGBA(255, 255, 255, 1)), new HSVA(0, 0, 1, 1));

			assert.deepStrictEqual(HSVA.fromRGBA(new RGBA(255, 0, 0, 1)), new HSVA(0, 1, 1, 1));
			assert.deepStrictEqual(HSVA.fromRGBA(new RGBA(0, 255, 0, 1)), new HSVA(120, 1, 1, 1));
			assert.deepStrictEqual(HSVA.fromRGBA(new RGBA(0, 0, 255, 1)), new HSVA(240, 1, 1, 1));

			assert.deepStrictEqual(HSVA.fromRGBA(new RGBA(255, 255, 0, 1)), new HSVA(60, 1, 1, 1));
			assert.deepStrictEqual(HSVA.fromRGBA(new RGBA(0, 255, 255, 1)), new HSVA(180, 1, 1, 1));
			assert.deepStrictEqual(HSVA.fromRGBA(new RGBA(255, 0, 255, 1)), new HSVA(300, 1, 1, 1));

			assert.deepStrictEqual(HSVA.fromRGBA(new RGBA(192, 192, 192, 1)), new HSVA(0, 0, 0.753, 1));

			assert.deepStrictEqual(HSVA.fromRGBA(new RGBA(128, 128, 128, 1)), new HSVA(0, 0, 0.502, 1));
			assert.deepStrictEqual(HSVA.fromRGBA(new RGBA(128, 0, 0, 1)), new HSVA(0, 1, 0.502, 1));
			assert.deepStrictEqual(HSVA.fromRGBA(new RGBA(128, 128, 0, 1)), new HSVA(60, 1, 0.502, 1));
			assert.deepStrictEqual(HSVA.fromRGBA(new RGBA(0, 128, 0, 1)), new HSVA(120, 1, 0.502, 1));
			assert.deepStrictEqual(HSVA.fromRGBA(new RGBA(128, 0, 128, 1)), new HSVA(300, 1, 0.502, 1));
			assert.deepStrictEqual(HSVA.fromRGBA(new RGBA(0, 128, 128, 1)), new HSVA(180, 1, 0.502, 1));
			assert.deepStrictEqual(HSVA.fromRGBA(new RGBA(0, 0, 128, 1)), new HSVA(240, 1, 0.502, 1));
		});

		test('Keep hue value when saturation is 0', () => {
			assert.deepStrictEqual(HSVA.toRGBA(new HSVA(10, 0, 0, 0)), HSVA.toRGBA(new HSVA(20, 0, 0, 0)));
			assert.deepStrictEqual(new Color(new HSVA(10, 0, 0, 0)).rgba, new Color(new HSVA(20, 0, 0, 0)).rgba);
			assert.notDeepStrictEqual(new Color(new HSVA(10, 0, 0, 0)).hsva, new Color(new HSVA(20, 0, 0, 0)).hsva);
		});

		test('bug#36240', () => {
			assert.deepStrictEqual(HSVA.fromRGBA(new RGBA(92, 106, 196, 1)), new HSVA(232, 0.531, 0.769, 1));
			assert.deepStrictEqual(HSVA.toRGBA(HSVA.fromRGBA(new RGBA(92, 106, 196, 1))), new RGBA(92, 106, 196, 1));
		});
	});

	suite('Format', () => {
		suite('CSS', () => {
			suite('parse', () => {
				test('invalid', () => {
					assert.deepStrictEqual(Color.Format.CSS.parse(''), null);
					assert.deepStrictEqual(Color.Format.CSS.parse('#'), null);
					assert.deepStrictEqual(Color.Format.CSS.parse('#0102030'), null);
				});

				test('transparent', () => {
					assert.deepStrictEqual(Color.Format.CSS.parse('transparent')!.rgba, new RGBA(0, 0, 0, 0));
				});

				test('named keyword', () => {
					assert.deepStrictEqual(Color.Format.CSS.parse('aliceblue')!.rgba, new RGBA(240, 248, 255, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('antiquewhite')!.rgba, new RGBA(250, 235, 215, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('aqua')!.rgba, new RGBA(0, 255, 255, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('aquamarine')!.rgba, new RGBA(127, 255, 212, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('azure')!.rgba, new RGBA(240, 255, 255, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('beige')!.rgba, new RGBA(245, 245, 220, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('bisque')!.rgba, new RGBA(255, 228, 196, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('black')!.rgba, new RGBA(0, 0, 0, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('blanchedalmond')!.rgba, new RGBA(255, 235, 205, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('blue')!.rgba, new RGBA(0, 0, 255, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('blueviolet')!.rgba, new RGBA(138, 43, 226, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('brown')!.rgba, new RGBA(165, 42, 42, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('burlywood')!.rgba, new RGBA(222, 184, 135, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('cadetblue')!.rgba, new RGBA(95, 158, 160, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('chartreuse')!.rgba, new RGBA(127, 255, 0, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('chocolate')!.rgba, new RGBA(210, 105, 30, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('coral')!.rgba, new RGBA(255, 127, 80, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('cornflowerblue')!.rgba, new RGBA(100, 149, 237, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('cornsilk')!.rgba, new RGBA(255, 248, 220, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('crimson')!.rgba, new RGBA(220, 20, 60, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('cyan')!.rgba, new RGBA(0, 255, 255, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('darkblue')!.rgba, new RGBA(0, 0, 139, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('darkcyan')!.rgba, new RGBA(0, 139, 139, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('darkgoldenrod')!.rgba, new RGBA(184, 134, 11, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('darkgray')!.rgba, new RGBA(169, 169, 169, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('darkgreen')!.rgba, new RGBA(0, 100, 0, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('darkgrey')!.rgba, new RGBA(169, 169, 169, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('darkkhaki')!.rgba, new RGBA(189, 183, 107, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('darkmagenta')!.rgba, new RGBA(139, 0, 139, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('darkolivegreen')!.rgba, new RGBA(85, 107, 47, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('darkorange')!.rgba, new RGBA(255, 140, 0, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('darkorchid')!.rgba, new RGBA(153, 50, 204, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('darkred')!.rgba, new RGBA(139, 0, 0, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('darksalmon')!.rgba, new RGBA(233, 150, 122, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('darkseagreen')!.rgba, new RGBA(143, 188, 143, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('darkslateblue')!.rgba, new RGBA(72, 61, 139, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('darkslategray')!.rgba, new RGBA(47, 79, 79, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('darkslategrey')!.rgba, new RGBA(47, 79, 79, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('darkturquoise')!.rgba, new RGBA(0, 206, 209, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('darkviolet')!.rgba, new RGBA(148, 0, 211, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('deeppink')!.rgba, new RGBA(255, 20, 147, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('deepskyblue')!.rgba, new RGBA(0, 191, 255, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('dimgray')!.rgba, new RGBA(105, 105, 105, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('dimgrey')!.rgba, new RGBA(105, 105, 105, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('dodgerblue')!.rgba, new RGBA(30, 144, 255, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('firebrick')!.rgba, new RGBA(178, 34, 34, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('floralwhite')!.rgba, new RGBA(255, 250, 240, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('forestgreen')!.rgba, new RGBA(34, 139, 34, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('fuchsia')!.rgba, new RGBA(255, 0, 255, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('gainsboro')!.rgba, new RGBA(220, 220, 220, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('ghostwhite')!.rgba, new RGBA(248, 248, 255, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('gold')!.rgba, new RGBA(255, 215, 0, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('goldenrod')!.rgba, new RGBA(218, 165, 32, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('gray')!.rgba, new RGBA(128, 128, 128, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('green')!.rgba, new RGBA(0, 128, 0, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('greenyellow')!.rgba, new RGBA(173, 255, 47, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('grey')!.rgba, new RGBA(128, 128, 128, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('honeydew')!.rgba, new RGBA(240, 255, 240, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('hotpink')!.rgba, new RGBA(255, 105, 180, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('indianred')!.rgba, new RGBA(205, 92, 92, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('indigo')!.rgba, new RGBA(75, 0, 130, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('ivory')!.rgba, new RGBA(255, 255, 240, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('khaki')!.rgba, new RGBA(240, 230, 140, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('lavender')!.rgba, new RGBA(230, 230, 250, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('lavenderblush')!.rgba, new RGBA(255, 240, 245, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('lawngreen')!.rgba, new RGBA(124, 252, 0, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('lemonchiffon')!.rgba, new RGBA(255, 250, 205, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('lightblue')!.rgba, new RGBA(173, 216, 230, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('lightcoral')!.rgba, new RGBA(240, 128, 128, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('lightcyan')!.rgba, new RGBA(224, 255, 255, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('lightgoldenrodyellow')!.rgba, new RGBA(250, 250, 210, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('lightgray')!.rgba, new RGBA(211, 211, 211, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('lightgreen')!.rgba, new RGBA(144, 238, 144, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('lightgrey')!.rgba, new RGBA(211, 211, 211, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('lightpink')!.rgba, new RGBA(255, 182, 193, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('lightsalmon')!.rgba, new RGBA(255, 160, 122, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('lightseagreen')!.rgba, new RGBA(32, 178, 170, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('lightskyblue')!.rgba, new RGBA(135, 206, 250, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('lightslategray')!.rgba, new RGBA(119, 136, 153, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('lightslategrey')!.rgba, new RGBA(119, 136, 153, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('lightsteelblue')!.rgba, new RGBA(176, 196, 222, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('lightyellow')!.rgba, new RGBA(255, 255, 224, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('lime')!.rgba, new RGBA(0, 255, 0, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('limegreen')!.rgba, new RGBA(50, 205, 50, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('linen')!.rgba, new RGBA(250, 240, 230, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('magenta')!.rgba, new RGBA(255, 0, 255, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('maroon')!.rgba, new RGBA(128, 0, 0, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('mediumaquamarine')!.rgba, new RGBA(102, 205, 170, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('mediumblue')!.rgba, new RGBA(0, 0, 205, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('mediumorchid')!.rgba, new RGBA(186, 85, 211, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('mediumpurple')!.rgba, new RGBA(147, 112, 219, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('mediumseagreen')!.rgba, new RGBA(60, 179, 113, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('mediumslateblue')!.rgba, new RGBA(123, 104, 238, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('mediumspringgreen')!.rgba, new RGBA(0, 250, 154, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('mediumturquoise')!.rgba, new RGBA(72, 209, 204, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('mediumvioletred')!.rgba, new RGBA(199, 21, 133, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('midnightblue')!.rgba, new RGBA(25, 25, 112, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('mintcream')!.rgba, new RGBA(245, 255, 250, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('mistyrose')!.rgba, new RGBA(255, 228, 225, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('moccasin')!.rgba, new RGBA(255, 228, 181, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('navajowhite')!.rgba, new RGBA(255, 222, 173, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('navy')!.rgba, new RGBA(0, 0, 128, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('oldlace')!.rgba, new RGBA(253, 245, 230, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('olive')!.rgba, new RGBA(128, 128, 0, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('olivedrab')!.rgba, new RGBA(107, 142, 35, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('orange')!.rgba, new RGBA(255, 165, 0, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('orangered')!.rgba, new RGBA(255, 69, 0, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('orchid')!.rgba, new RGBA(218, 112, 214, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('palegoldenrod')!.rgba, new RGBA(238, 232, 170, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('palegreen')!.rgba, new RGBA(152, 251, 152, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('paleturquoise')!.rgba, new RGBA(175, 238, 238, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('palevioletred')!.rgba, new RGBA(219, 112, 147, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('papayawhip')!.rgba, new RGBA(255, 239, 213, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('peachpuff')!.rgba, new RGBA(255, 218, 185, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('peru')!.rgba, new RGBA(205, 133, 63, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('pink')!.rgba, new RGBA(255, 192, 203, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('plum')!.rgba, new RGBA(221, 160, 221, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('powderblue')!.rgba, new RGBA(176, 224, 230, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('purple')!.rgba, new RGBA(128, 0, 128, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('rebeccapurple')!.rgba, new RGBA(102, 51, 153, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('red')!.rgba, new RGBA(255, 0, 0, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('rosybrown')!.rgba, new RGBA(188, 143, 143, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('royalblue')!.rgba, new RGBA(65, 105, 225, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('saddlebrown')!.rgba, new RGBA(139, 69, 19, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('salmon')!.rgba, new RGBA(250, 128, 114, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('sandybrown')!.rgba, new RGBA(244, 164, 96, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('seagreen')!.rgba, new RGBA(46, 139, 87, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('seashell')!.rgba, new RGBA(255, 245, 238, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('sienna')!.rgba, new RGBA(160, 82, 45, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('silver')!.rgba, new RGBA(192, 192, 192, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('skyblue')!.rgba, new RGBA(135, 206, 235, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('slateblue')!.rgba, new RGBA(106, 90, 205, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('slategray')!.rgba, new RGBA(112, 128, 144, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('slategrey')!.rgba, new RGBA(112, 128, 144, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('snow')!.rgba, new RGBA(255, 250, 250, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('springgreen')!.rgba, new RGBA(0, 255, 127, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('steelblue')!.rgba, new RGBA(70, 130, 180, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('tan')!.rgba, new RGBA(210, 180, 140, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('teal')!.rgba, new RGBA(0, 128, 128, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('thistle')!.rgba, new RGBA(216, 191, 216, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('tomato')!.rgba, new RGBA(255, 99, 71, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('turquoise')!.rgba, new RGBA(64, 224, 208, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('violet')!.rgba, new RGBA(238, 130, 238, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('wheat')!.rgba, new RGBA(245, 222, 179, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('white')!.rgba, new RGBA(255, 255, 255, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('whitesmoke')!.rgba, new RGBA(245, 245, 245, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('yellow')!.rgba, new RGBA(255, 255, 0, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('yellowgreen')!.rgba, new RGBA(154, 205, 50, 1));
				});

				test('hex-color', () => {
					// somewhat valid
					assert.deepStrictEqual(Color.Format.CSS.parse('#FFFFG0')!.rgba, new RGBA(255, 255, 0, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('#FFFFg0')!.rgba, new RGBA(255, 255, 0, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('#-FFF00')!.rgba, new RGBA(15, 255, 0, 1));

					// valid
					assert.deepStrictEqual(Color.Format.CSS.parse('#000000')!.rgba, new RGBA(0, 0, 0, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('#FFFFFF')!.rgba, new RGBA(255, 255, 255, 1));

					assert.deepStrictEqual(Color.Format.CSS.parse('#FF0000')!.rgba, new RGBA(255, 0, 0, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('#00FF00')!.rgba, new RGBA(0, 255, 0, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('#0000FF')!.rgba, new RGBA(0, 0, 255, 1));

					assert.deepStrictEqual(Color.Format.CSS.parse('#FFFF00')!.rgba, new RGBA(255, 255, 0, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('#00FFFF')!.rgba, new RGBA(0, 255, 255, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('#FF00FF')!.rgba, new RGBA(255, 0, 255, 1));

					assert.deepStrictEqual(Color.Format.CSS.parse('#C0C0C0')!.rgba, new RGBA(192, 192, 192, 1));

					assert.deepStrictEqual(Color.Format.CSS.parse('#808080')!.rgba, new RGBA(128, 128, 128, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('#800000')!.rgba, new RGBA(128, 0, 0, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('#808000')!.rgba, new RGBA(128, 128, 0, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('#008000')!.rgba, new RGBA(0, 128, 0, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('#800080')!.rgba, new RGBA(128, 0, 128, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('#008080')!.rgba, new RGBA(0, 128, 128, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('#000080')!.rgba, new RGBA(0, 0, 128, 1));

					assert.deepStrictEqual(Color.Format.CSS.parse('#010203')!.rgba, new RGBA(1, 2, 3, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('#040506')!.rgba, new RGBA(4, 5, 6, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('#070809')!.rgba, new RGBA(7, 8, 9, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('#0a0A0a')!.rgba, new RGBA(10, 10, 10, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('#0b0B0b')!.rgba, new RGBA(11, 11, 11, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('#0c0C0c')!.rgba, new RGBA(12, 12, 12, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('#0d0D0d')!.rgba, new RGBA(13, 13, 13, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('#0e0E0e')!.rgba, new RGBA(14, 14, 14, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('#0f0F0f')!.rgba, new RGBA(15, 15, 15, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('#a0A0a0')!.rgba, new RGBA(160, 160, 160, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('#CFA')!.rgba, new RGBA(204, 255, 170, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('#CFA8')!.rgba, new RGBA(204, 255, 170, 0.533));
				});

				test('rgb()', () => {
					// somewhat valid / unusual
					assert.deepStrictEqual(Color.Format.CSS.parse('rgb(-255, 0, 0)')!.rgba, new RGBA(0, 0, 0));
					assert.deepStrictEqual(Color.Format.CSS.parse('rgb(+255, 0, 0)')!.rgba, new RGBA(255, 0, 0));
					assert.deepStrictEqual(Color.Format.CSS.parse('rgb(800, 0, 0)')!.rgba, new RGBA(255, 0, 0));

					// valid
					assert.deepStrictEqual(Color.Format.CSS.parse('rgb(0, 0, 0)')!.rgba, new RGBA(0, 0, 0, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('rgb(255, 255, 255)')!.rgba, new RGBA(255, 255, 255, 1));

					assert.deepStrictEqual(Color.Format.CSS.parse('rgb(255, 0, 0)')!.rgba, new RGBA(255, 0, 0, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('rgb(0, 255, 0)')!.rgba, new RGBA(0, 255, 0, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('rgb(0, 0, 255)')!.rgba, new RGBA(0, 0, 255, 1));

					assert.deepStrictEqual(Color.Format.CSS.parse('rgb(255, 255, 0)')!.rgba, new RGBA(255, 255, 0, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('rgb(0, 255, 255)')!.rgba, new RGBA(0, 255, 255, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('rgb(255, 0, 255)')!.rgba, new RGBA(255, 0, 255, 1));

					assert.deepStrictEqual(Color.Format.CSS.parse('rgb(192, 192, 192)')!.rgba, new RGBA(192, 192, 192, 1));

					assert.deepStrictEqual(Color.Format.CSS.parse('rgb(128, 128, 128)')!.rgba, new RGBA(128, 128, 128, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('rgb(128, 0, 0)')!.rgba, new RGBA(128, 0, 0, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('rgb(128, 128, 0)')!.rgba, new RGBA(128, 128, 0, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('rgb(0, 128, 0)')!.rgba, new RGBA(0, 128, 0, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('rgb(128, 0, 128)')!.rgba, new RGBA(128, 0, 128, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('rgb(0, 128, 128)')!.rgba, new RGBA(0, 128, 128, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('rgb(0, 0, 128)')!.rgba, new RGBA(0, 0, 128, 1));

					assert.deepStrictEqual(Color.Format.CSS.parse('rgb(1, 2, 3)')!.rgba, new RGBA(1, 2, 3, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('rgb(4, 5, 6)')!.rgba, new RGBA(4, 5, 6, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('rgb(7, 8, 9)')!.rgba, new RGBA(7, 8, 9, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('rgb(10, 10, 10)')!.rgba, new RGBA(10, 10, 10, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('rgb(11, 11, 11)')!.rgba, new RGBA(11, 11, 11, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('rgb(12, 12, 12)')!.rgba, new RGBA(12, 12, 12, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('rgb(13, 13, 13)')!.rgba, new RGBA(13, 13, 13, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('rgb(14, 14, 14)')!.rgba, new RGBA(14, 14, 14, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('rgb(15, 15, 15)')!.rgba, new RGBA(15, 15, 15, 1));
				});

				test('rgba()', () => {
					// somewhat valid / unusual
					assert.deepStrictEqual(Color.Format.CSS.parse('rgba(0, 0, 0, 255)')!.rgba, new RGBA(0, 0, 0, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('rgba(-255, 0, 0, 1)')!.rgba, new RGBA(0, 0, 0, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('rgba(+255, 0, 0, 1)')!.rgba, new RGBA(255, 0, 0, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('rgba(800, 0, 0, 1)')!.rgba, new RGBA(255, 0, 0, 1));

					// alpha values
					assert.deepStrictEqual(Color.Format.CSS.parse('rgba(255, 0, 0, 0.2)')!.rgba, new RGBA(255, 0, 0, 0.2));
					assert.deepStrictEqual(Color.Format.CSS.parse('rgba(255, 0, 0, 0.5)')!.rgba, new RGBA(255, 0, 0, 0.5));
					assert.deepStrictEqual(Color.Format.CSS.parse('rgba(255, 0, 0, 0.75)')!.rgba, new RGBA(255, 0, 0, 0.75));

					// valid
					assert.deepStrictEqual(Color.Format.CSS.parse('rgba(0, 0, 0, 1)')!.rgba, new RGBA(0, 0, 0, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('rgba(255, 255, 255, 1)')!.rgba, new RGBA(255, 255, 255, 1));

					assert.deepStrictEqual(Color.Format.CSS.parse('rgba(255, 0, 0, 1)')!.rgba, new RGBA(255, 0, 0, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('rgba(0, 255, 0, 1)')!.rgba, new RGBA(0, 255, 0, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('rgba(0, 0, 255, 1)')!.rgba, new RGBA(0, 0, 255, 1));

					assert.deepStrictEqual(Color.Format.CSS.parse('rgba(255, 255, 0, 1)')!.rgba, new RGBA(255, 255, 0, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('rgba(0, 255, 255, 1)')!.rgba, new RGBA(0, 255, 255, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('rgba(255, 0, 255, 1)')!.rgba, new RGBA(255, 0, 255, 1));

					assert.deepStrictEqual(Color.Format.CSS.parse('rgba(192, 192, 192, 1)')!.rgba, new RGBA(192, 192, 192, 1));

					assert.deepStrictEqual(Color.Format.CSS.parse('rgba(128, 128, 128, 1)')!.rgba, new RGBA(128, 128, 128, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('rgba(128, 0, 0, 1)')!.rgba, new RGBA(128, 0, 0, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('rgba(128, 128, 0, 1)')!.rgba, new RGBA(128, 128, 0, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('rgba(0, 128, 0, 1)')!.rgba, new RGBA(0, 128, 0, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('rgba(128, 0, 128, 1)')!.rgba, new RGBA(128, 0, 128, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('rgba(0, 128, 128, 1)')!.rgba, new RGBA(0, 128, 128, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('rgba(0, 0, 128, 1)')!.rgba, new RGBA(0, 0, 128, 1));

					assert.deepStrictEqual(Color.Format.CSS.parse('rgba(1, 2, 3, 1)')!.rgba, new RGBA(1, 2, 3, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('rgba(4, 5, 6, 1)')!.rgba, new RGBA(4, 5, 6, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('rgba(7, 8, 9, 1)')!.rgba, new RGBA(7, 8, 9, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('rgba(10, 10, 10, 1)')!.rgba, new RGBA(10, 10, 10, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('rgba(11, 11, 11, 1)')!.rgba, new RGBA(11, 11, 11, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('rgba(12, 12, 12, 1)')!.rgba, new RGBA(12, 12, 12, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('rgba(13, 13, 13, 1)')!.rgba, new RGBA(13, 13, 13, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('rgba(14, 14, 14, 1)')!.rgba, new RGBA(14, 14, 14, 1));
					assert.deepStrictEqual(Color.Format.CSS.parse('rgba(15, 15, 15, 1)')!.rgba, new RGBA(15, 15, 15, 1));
				});
			});

			test('parseHex', () => {

				// invalid
				assert.deepStrictEqual(Color.Format.CSS.parseHex(''), null);
				assert.deepStrictEqual(Color.Format.CSS.parseHex('#'), null);
				assert.deepStrictEqual(Color.Format.CSS.parseHex('#0102030'), null);

				// somewhat valid
				assert.deepStrictEqual(Color.Format.CSS.parseHex('#FFFFG0')!.rgba, new RGBA(255, 255, 0, 1));
				assert.deepStrictEqual(Color.Format.CSS.parseHex('#FFFFg0')!.rgba, new RGBA(255, 255, 0, 1));
				assert.deepStrictEqual(Color.Format.CSS.parseHex('#-FFF00')!.rgba, new RGBA(15, 255, 0, 1));

				// valid
				assert.deepStrictEqual(Color.Format.CSS.parseHex('#000000')!.rgba, new RGBA(0, 0, 0, 1));
				assert.deepStrictEqual(Color.Format.CSS.parseHex('#FFFFFF')!.rgba, new RGBA(255, 255, 255, 1));

				assert.deepStrictEqual(Color.Format.CSS.parseHex('#FF0000')!.rgba, new RGBA(255, 0, 0, 1));
				assert.deepStrictEqual(Color.Format.CSS.parseHex('#00FF00')!.rgba, new RGBA(0, 255, 0, 1));
				assert.deepStrictEqual(Color.Format.CSS.parseHex('#0000FF')!.rgba, new RGBA(0, 0, 255, 1));

				assert.deepStrictEqual(Color.Format.CSS.parseHex('#FFFF00')!.rgba, new RGBA(255, 255, 0, 1));
				assert.deepStrictEqual(Color.Format.CSS.parseHex('#00FFFF')!.rgba, new RGBA(0, 255, 255, 1));
				assert.deepStrictEqual(Color.Format.CSS.parseHex('#FF00FF')!.rgba, new RGBA(255, 0, 255, 1));

				assert.deepStrictEqual(Color.Format.CSS.parseHex('#C0C0C0')!.rgba, new RGBA(192, 192, 192, 1));

				assert.deepStrictEqual(Color.Format.CSS.parseHex('#808080')!.rgba, new RGBA(128, 128, 128, 1));
				assert.deepStrictEqual(Color.Format.CSS.parseHex('#800000')!.rgba, new RGBA(128, 0, 0, 1));
				assert.deepStrictEqual(Color.Format.CSS.parseHex('#808000')!.rgba, new RGBA(128, 128, 0, 1));
				assert.deepStrictEqual(Color.Format.CSS.parseHex('#008000')!.rgba, new RGBA(0, 128, 0, 1));
				assert.deepStrictEqual(Color.Format.CSS.parseHex('#800080')!.rgba, new RGBA(128, 0, 128, 1));
				assert.deepStrictEqual(Color.Format.CSS.parseHex('#008080')!.rgba, new RGBA(0, 128, 128, 1));
				assert.deepStrictEqual(Color.Format.CSS.parseHex('#000080')!.rgba, new RGBA(0, 0, 128, 1));

				assert.deepStrictEqual(Color.Format.CSS.parseHex('#010203')!.rgba, new RGBA(1, 2, 3, 1));
				assert.deepStrictEqual(Color.Format.CSS.parseHex('#040506')!.rgba, new RGBA(4, 5, 6, 1));
				assert.deepStrictEqual(Color.Format.CSS.parseHex('#070809')!.rgba, new RGBA(7, 8, 9, 1));
				assert.deepStrictEqual(Color.Format.CSS.parseHex('#0a0A0a')!.rgba, new RGBA(10, 10, 10, 1));
				assert.deepStrictEqual(Color.Format.CSS.parseHex('#0b0B0b')!.rgba, new RGBA(11, 11, 11, 1));
				assert.deepStrictEqual(Color.Format.CSS.parseHex('#0c0C0c')!.rgba, new RGBA(12, 12, 12, 1));
				assert.deepStrictEqual(Color.Format.CSS.parseHex('#0d0D0d')!.rgba, new RGBA(13, 13, 13, 1));
				assert.deepStrictEqual(Color.Format.CSS.parseHex('#0e0E0e')!.rgba, new RGBA(14, 14, 14, 1));
				assert.deepStrictEqual(Color.Format.CSS.parseHex('#0f0F0f')!.rgba, new RGBA(15, 15, 15, 1));
				assert.deepStrictEqual(Color.Format.CSS.parseHex('#a0A0a0')!.rgba, new RGBA(160, 160, 160, 1));
				assert.deepStrictEqual(Color.Format.CSS.parseHex('#CFA')!.rgba, new RGBA(204, 255, 170, 1));
				assert.deepStrictEqual(Color.Format.CSS.parseHex('#CFA8')!.rgba, new RGBA(204, 255, 170, 0.533));
			});

			suite('format', () => {
				test('formatHSL should use whole numbers for percentages', () => {
					// Test case matching the issue: color with fractional percentages that should be rounded
					const color1 = new Color(new HSLA(0, 0.857, 0.437, 1)); // Should format as hsl(0, 86%, 44%)
					assert.strictEqual(Color.Format.CSS.formatHSL(color1), 'hsl(0, 86%, 44%)');

					// Test edge cases
					const color2 = new Color(new HSLA(120, 0.5, 0.75, 1)); // Should format as hsl(120, 50%, 75%)
					assert.strictEqual(Color.Format.CSS.formatHSL(color2), 'hsl(120, 50%, 75%)');

					// Test case with values that would round differently
					const color3 = new Color(new HSLA(240, 0.334, 0.666, 1)); // Should format as hsl(240, 33%, 67%)
					assert.strictEqual(Color.Format.CSS.formatHSL(color3), 'hsl(240, 33%, 67%)');
				});

				test('formatHSLA should use whole numbers for percentages', () => {
					// Test case with alpha
					const color1 = new Color(new HSLA(0, 0.857, 0.437, 0.85)); // Should format as hsla(0, 86%, 44%, 0.85)
					assert.strictEqual(Color.Format.CSS.formatHSLA(color1), 'hsla(0, 86%, 44%, 0.85)');

					// Test edge cases
					const color2 = new Color(new HSLA(180, 0.25, 0.5, 0.5)); // Should format as hsla(180, 25%, 50%, 0.50)
					assert.strictEqual(Color.Format.CSS.formatHSLA(color2), 'hsla(180, 25%, 50%, 0.50)');
				});
			});
		});
	});

	const rgbaFromInt = (int: number) => new Color(new RGBA(
		(int >> 24) & 0xff,
		(int >> 16) & 0xff,
		(int >> 8) & 0xff,
		(int) & 0xff
	));

	const assertContrastRatio = (background: number, foreground: number, ratio: number, expected = foreground) => {
		const bgColor = rgbaFromInt(background);
		const fgColor = rgbaFromInt(foreground);
		assert.deepStrictEqual(bgColor.ensureConstrast(fgColor, ratio).rgba, rgbaFromInt(expected).rgba);
	};

	// https://github.com/xtermjs/xterm.js/blob/44f9fa39ae03e2ca6d28354d88a399608686770e/src/common/Color.test.ts#L355
	suite('ensureContrastRatio', () => {
		test('should return undefined if the color already meets the contrast ratio (black bg)', () => {
			assertContrastRatio(0x000000ff, 0x606060ff, 1, undefined);
			assertContrastRatio(0x000000ff, 0x606060ff, 2, undefined);
			assertContrastRatio(0x000000ff, 0x606060ff, 3, undefined);
		});
		test('should return a color that meets the contrast ratio (black bg)', () => {
			assertContrastRatio(0x000000ff, 0x606060ff, 4, 0x707070ff);
			assertContrastRatio(0x000000ff, 0x606060ff, 5, 0x7f7f7fff);
			assertContrastRatio(0x000000ff, 0x606060ff, 6, 0x8c8c8cff);
			assertContrastRatio(0x000000ff, 0x606060ff, 7, 0x989898ff);
			assertContrastRatio(0x000000ff, 0x606060ff, 8, 0xa3a3a3ff);
			assertContrastRatio(0x000000ff, 0x606060ff, 9, 0xadadadff);
			assertContrastRatio(0x000000ff, 0x606060ff, 10, 0xb6b6b6ff);
			assertContrastRatio(0x000000ff, 0x606060ff, 11, 0xbebebeff);
			assertContrastRatio(0x000000ff, 0x606060ff, 12, 0xc5c5c5ff);
			assertContrastRatio(0x000000ff, 0x606060ff, 13, 0xd1d1d1ff);
			assertContrastRatio(0x000000ff, 0x606060ff, 14, 0xd6d6d6ff);
			assertContrastRatio(0x000000ff, 0x606060ff, 15, 0xdbdbdbff);
			assertContrastRatio(0x000000ff, 0x606060ff, 16, 0xe3e3e3ff);
			assertContrastRatio(0x000000ff, 0x606060ff, 17, 0xe9e9e9ff);
			assertContrastRatio(0x000000ff, 0x606060ff, 18, 0xeeeeeeff);
			assertContrastRatio(0x000000ff, 0x606060ff, 19, 0xf4f4f4ff);
			assertContrastRatio(0x000000ff, 0x606060ff, 20, 0xfafafaff);
			assertContrastRatio(0x000000ff, 0x606060ff, 21, 0xffffffff);
		});
		test('should return undefined if the color already meets the contrast ratio (white bg)', () => {
			assertContrastRatio(0xffffffff, 0x606060ff, 1, undefined);
			assertContrastRatio(0xffffffff, 0x606060ff, 2, undefined);
			assertContrastRatio(0xffffffff, 0x606060ff, 3, undefined);
			assertContrastRatio(0xffffffff, 0x606060ff, 4, undefined);
			assertContrastRatio(0xffffffff, 0x606060ff, 5, undefined);
			assertContrastRatio(0xffffffff, 0x606060ff, 6, undefined);
		});
		test('should return a color that meets the contrast ratio (white bg)', () => {
			assertContrastRatio(0xffffffff, 0x606060ff, 7, 0x565656ff);
			assertContrastRatio(0xffffffff, 0x606060ff, 8, 0x4d4d4dff);
			assertContrastRatio(0xffffffff, 0x606060ff, 9, 0x454545ff);
			assertContrastRatio(0xffffffff, 0x606060ff, 10, 0x3e3e3eff);
			assertContrastRatio(0xffffffff, 0x606060ff, 11, 0x373737ff);
			assertContrastRatio(0xffffffff, 0x606060ff, 12, 0x313131ff);
			assertContrastRatio(0xffffffff, 0x606060ff, 13, 0x313131ff);
			assertContrastRatio(0xffffffff, 0x606060ff, 14, 0x272727ff);
			assertContrastRatio(0xffffffff, 0x606060ff, 15, 0x232323ff);
			assertContrastRatio(0xffffffff, 0x606060ff, 16, 0x1f1f1fff);
			assertContrastRatio(0xffffffff, 0x606060ff, 17, 0x1b1b1bff);
			assertContrastRatio(0xffffffff, 0x606060ff, 18, 0x151515ff);
			assertContrastRatio(0xffffffff, 0x606060ff, 19, 0x101010ff);
			assertContrastRatio(0xffffffff, 0x606060ff, 20, 0x080808ff);
			assertContrastRatio(0xffffffff, 0x606060ff, 21, 0x000000ff);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/console.test.ts]---
Location: vscode-main/src/vs/base/test/common/console.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { getFirstFrame } from '../../common/console.js';
import { normalize } from '../../common/path.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';

suite('Console', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('getFirstFrame', () => {
		let stack = 'at vscode.commands.registerCommand (/Users/someone/Desktop/test-ts/out/src/extension.js:18:17)';
		let frame = getFirstFrame(stack)!;

		assert.strictEqual(frame.uri.fsPath, normalize('/Users/someone/Desktop/test-ts/out/src/extension.js'));
		assert.strictEqual(frame.line, 18);
		assert.strictEqual(frame.column, 17);

		stack = 'at /Users/someone/Desktop/test-ts/out/src/extension.js:18:17';
		frame = getFirstFrame(stack)!;

		assert.strictEqual(frame.uri.fsPath, normalize('/Users/someone/Desktop/test-ts/out/src/extension.js'));
		assert.strictEqual(frame.line, 18);
		assert.strictEqual(frame.column, 17);

		stack = 'at c:\\Users\\someone\\Desktop\\end-js\\extension.js:18:17';
		frame = getFirstFrame(stack)!;

		assert.strictEqual(frame.uri.fsPath, 'c:\\Users\\someone\\Desktop\\end-js\\extension.js');
		assert.strictEqual(frame.line, 18);
		assert.strictEqual(frame.column, 17);

		stack = 'at e.$executeContributedCommand(c:\\Users\\someone\\Desktop\\end-js\\extension.js:18:17)';
		frame = getFirstFrame(stack)!;

		assert.strictEqual(frame.uri.fsPath, 'c:\\Users\\someone\\Desktop\\end-js\\extension.js');
		assert.strictEqual(frame.line, 18);
		assert.strictEqual(frame.column, 17);

		stack = 'at /Users/someone/Desktop/test-ts/out/src/extension.js:18:17\nat /Users/someone/Desktop/test-ts/out/src/other.js:28:27\nat /Users/someone/Desktop/test-ts/out/src/more.js:38:37';
		frame = getFirstFrame(stack)!;

		assert.strictEqual(frame.uri.fsPath, normalize('/Users/someone/Desktop/test-ts/out/src/extension.js'));
		assert.strictEqual(frame.line, 18);
		assert.strictEqual(frame.column, 17);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/date.test.ts]---
Location: vscode-main/src/vs/base/test/common/date.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { strictEqual } from 'assert';
import { fromNow, fromNowByDay, getDurationString, safeIntl } from '../../common/date.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';
import { LANGUAGE_DEFAULT } from '../../common/platform.js';

suite('Date', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	suite('fromNow', () => {
		test('appendAgoLabel', () => {
			strictEqual(fromNow(Date.now() - 35000), '35 secs');
			strictEqual(fromNow(Date.now() - 35000, false), '35 secs');
			strictEqual(fromNow(Date.now() - 35000, true), '35 secs ago');
		});
		test('useFullTimeWords', () => {
			strictEqual(fromNow(Date.now() - 35000), '35 secs');
			strictEqual(fromNow(Date.now() - 35000, undefined, false), '35 secs');
			strictEqual(fromNow(Date.now() - 35000, undefined, true), '35 seconds');
		});
		test('disallowNow', () => {
			strictEqual(fromNow(Date.now() - 5000), 'now');
			strictEqual(fromNow(Date.now() - 5000, undefined, undefined, false), 'now');
			strictEqual(fromNow(Date.now() - 5000, undefined, undefined, true), '5 secs');
		});
	});

	suite('fromNowByDay', () => {
		test('today', () => {
			const now = new Date();
			strictEqual(fromNowByDay(now), 'Today');
		});
		test('yesterday', () => {
			const yesterday = new Date();
			yesterday.setDate(yesterday.getDate() - 1);
			yesterday.setHours(12);
			strictEqual(fromNowByDay(yesterday), 'Yesterday');
		});
		test('daysAgo', () => {
			const daysAgo = new Date();
			daysAgo.setDate(daysAgo.getDate() - 5);
			daysAgo.setHours(daysAgo.getHours() - 2); // 2 hours further to avoid DST issues
			strictEqual(fromNowByDay(daysAgo, true), '5 days ago');
		});
	});

	suite('getDurationString', () => {
		test('basic', () => {
			strictEqual(getDurationString(1), '1ms');
			strictEqual(getDurationString(999), '999ms');
			strictEqual(getDurationString(1000), '1s');
			strictEqual(getDurationString(1000 * 60 - 1), '59.999s');
			strictEqual(getDurationString(1000 * 60), '1 mins');
			strictEqual(getDurationString(1000 * 60 * 60 - 1), '60 mins');
			strictEqual(getDurationString(1000 * 60 * 60), '1 hrs');
			strictEqual(getDurationString(1000 * 60 * 60 * 24 - 1), '24 hrs');
			strictEqual(getDurationString(1000 * 60 * 60 * 24), '1 days');
		});
		test('useFullTimeWords', () => {
			strictEqual(getDurationString(1, true), '1 milliseconds');
			strictEqual(getDurationString(999, true), '999 milliseconds');
			strictEqual(getDurationString(1000, true), '1 seconds');
			strictEqual(getDurationString(1000 * 60 - 1, true), '59.999 seconds');
			strictEqual(getDurationString(1000 * 60, true), '1 minutes');
			strictEqual(getDurationString(1000 * 60 * 60 - 1, true), '60 minutes');
			strictEqual(getDurationString(1000 * 60 * 60, true), '1 hours');
			strictEqual(getDurationString(1000 * 60 * 60 * 24 - 1, true), '24 hours');
			strictEqual(getDurationString(1000 * 60 * 60 * 24, true), '1 days');
		});

		suite('safeIntl', () => {
			test('Collator fallback', () => {
				const collator = safeIntl.Collator('en_IT').value;
				const comparison = collator.compare('a', 'b');
				strictEqual(comparison, -1);
			});

			test('Locale fallback', () => {
				const locale = safeIntl.Locale('en_IT').value;
				strictEqual(locale.baseName, LANGUAGE_DEFAULT);
			});
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/decorators.test.ts]---
Location: vscode-main/src/vs/base/test/common/decorators.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import * as sinon from 'sinon';
import { memoize, throttle } from '../../common/decorators.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';

suite('Decorators', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('memoize should memoize methods', () => {
		class Foo {
			count = 0;

			constructor(private _answer: number | null | undefined) { }

			@memoize
			answer() {
				this.count++;
				return this._answer;
			}
		}

		const foo = new Foo(42);
		assert.strictEqual(foo.count, 0);
		assert.strictEqual(foo.answer(), 42);
		assert.strictEqual(foo.count, 1);
		assert.strictEqual(foo.answer(), 42);
		assert.strictEqual(foo.count, 1);

		const foo2 = new Foo(1337);
		assert.strictEqual(foo2.count, 0);
		assert.strictEqual(foo2.answer(), 1337);
		assert.strictEqual(foo2.count, 1);
		assert.strictEqual(foo2.answer(), 1337);
		assert.strictEqual(foo2.count, 1);

		assert.strictEqual(foo.answer(), 42);
		assert.strictEqual(foo.count, 1);

		const foo3 = new Foo(null);
		assert.strictEqual(foo3.count, 0);
		assert.strictEqual(foo3.answer(), null);
		assert.strictEqual(foo3.count, 1);
		assert.strictEqual(foo3.answer(), null);
		assert.strictEqual(foo3.count, 1);

		const foo4 = new Foo(undefined);
		assert.strictEqual(foo4.count, 0);
		assert.strictEqual(foo4.answer(), undefined);
		assert.strictEqual(foo4.count, 1);
		assert.strictEqual(foo4.answer(), undefined);
		assert.strictEqual(foo4.count, 1);
	});

	test('memoize should memoize getters', () => {
		class Foo {
			count = 0;

			constructor(private _answer: number | null | undefined) { }

			@memoize
			get answer() {
				this.count++;
				return this._answer;
			}
		}

		const foo = new Foo(42);
		assert.strictEqual(foo.count, 0);
		assert.strictEqual(foo.answer, 42);
		assert.strictEqual(foo.count, 1);
		assert.strictEqual(foo.answer, 42);
		assert.strictEqual(foo.count, 1);

		const foo2 = new Foo(1337);
		assert.strictEqual(foo2.count, 0);
		assert.strictEqual(foo2.answer, 1337);
		assert.strictEqual(foo2.count, 1);
		assert.strictEqual(foo2.answer, 1337);
		assert.strictEqual(foo2.count, 1);

		assert.strictEqual(foo.answer, 42);
		assert.strictEqual(foo.count, 1);

		const foo3 = new Foo(null);
		assert.strictEqual(foo3.count, 0);
		assert.strictEqual(foo3.answer, null);
		assert.strictEqual(foo3.count, 1);
		assert.strictEqual(foo3.answer, null);
		assert.strictEqual(foo3.count, 1);

		const foo4 = new Foo(undefined);
		assert.strictEqual(foo4.count, 0);
		assert.strictEqual(foo4.answer, undefined);
		assert.strictEqual(foo4.count, 1);
		assert.strictEqual(foo4.answer, undefined);
		assert.strictEqual(foo4.count, 1);
	});

	test('memoized property should not be enumerable', () => {
		class Foo {
			@memoize
			get answer() {
				return 42;
			}
		}

		const foo = new Foo();
		assert.strictEqual(foo.answer, 42);

		assert(!Object.keys(foo).some(k => /\$memoize\$/.test(k)));
	});

	test('memoized property should not be writable', () => {
		class Foo {
			@memoize
			get answer() {
				return 42;
			}
		}

		const foo = new Foo();
		assert.strictEqual(foo.answer, 42);

		try {
			// eslint-disable-next-line local/code-no-any-casts
			(foo as any)['$memoize$answer'] = 1337;
			assert(false);
		} catch (e) {
			assert.strictEqual(foo.answer, 42);
		}
	});

	test('throttle', () => {
		const spy = sinon.spy();
		const clock = sinon.useFakeTimers();
		try {
			class ThrottleTest {
				private _handle: Function;

				constructor(fn: Function) {
					this._handle = fn;
				}

				@throttle(
					100,
					(a: number, b: number) => a + b,
					() => 0
				)
				report(p: number): void {
					this._handle(p);
				}
			}

			const t = new ThrottleTest(spy);

			t.report(1);
			t.report(2);
			t.report(3);
			assert.deepStrictEqual(spy.args, [[1]]);

			clock.tick(200);
			assert.deepStrictEqual(spy.args, [[1], [5]]);
			spy.resetHistory();

			t.report(4);
			t.report(5);
			clock.tick(50);
			t.report(6);

			assert.deepStrictEqual(spy.args, [[4]]);
			clock.tick(60);
			assert.deepStrictEqual(spy.args, [[4], [11]]);
		} finally {
			clock.restore();
		}
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/envfile.test.ts]---
Location: vscode-main/src/vs/base/test/common/envfile.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { parseEnvFile } from '../../common/envfile.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';
import * as assert from 'assert';

/*
Test cases from https://github.com/motdotla/dotenv/blob/master/tests/.env

	Copyright (c) 2015, Scott Motte
	All rights reserved.

	Redistribution and use in source and binary forms, with or without
	modification, are permitted provided that the following conditions are met:

	* Redistributions of source code must retain the above copyright notice, this
		list of conditions and the following disclaimer.

	* Redistributions in binary form must reproduce the above copyright notice,
		this list of conditions and the following disclaimer in the documentation
		and/or other materials provided with the distribution.

	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
	DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
	FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
	DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
	SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
	CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
	OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
	OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

const example = `
BASIC=basic

# previous line intentionally left blank
AFTER_LINE=after_line
EMPTY=
EMPTY_SINGLE_QUOTES=''
EMPTY_DOUBLE_QUOTES=""
EMPTY_BACKTICKS=\`\`
SINGLE_QUOTES='single_quotes'
SINGLE_QUOTES_SPACED='    single quotes    '
DOUBLE_QUOTES="double_quotes"
DOUBLE_QUOTES_SPACED="    double quotes    "
DOUBLE_QUOTES_INSIDE_SINGLE='double "quotes" work inside single quotes'
DOUBLE_QUOTES_WITH_NO_SPACE_BRACKET="{ port: $MONGOLAB_PORT}"
SINGLE_QUOTES_INSIDE_DOUBLE="single 'quotes' work inside double quotes"
BACKTICKS_INSIDE_SINGLE='\`backticks\` work inside single quotes'
BACKTICKS_INSIDE_DOUBLE="\`backticks\` work inside double quotes"
BACKTICKS=\`backticks\`
BACKTICKS_SPACED=\`    backticks    \`
DOUBLE_QUOTES_INSIDE_BACKTICKS=\`double "quotes" work inside backticks\`
SINGLE_QUOTES_INSIDE_BACKTICKS=\`single 'quotes' work inside backticks\`
DOUBLE_AND_SINGLE_QUOTES_INSIDE_BACKTICKS=\`double "quotes" and single 'quotes' work inside backticks\`
EXPAND_NEWLINES="expand\\nnew\\nlines"
DONT_EXPAND_UNQUOTED=dontexpand\\nnewlines
DONT_EXPAND_SQUOTED='dontexpand\\nnewlines'
# COMMENTS=work
INLINE_COMMENTS=inline comments # work #very #well
INLINE_COMMENTS_SINGLE_QUOTES='inline comments outside of #singlequotes' # work
INLINE_COMMENTS_DOUBLE_QUOTES="inline comments outside of #doublequotes" # work
INLINE_COMMENTS_BACKTICKS=\`inline comments outside of #backticks\` # work
INLINE_COMMENTS_SPACE=inline comments start with a#number sign. no space required.
EQUAL_SIGNS=equals==
RETAIN_INNER_QUOTES={"foo": "bar"}
RETAIN_INNER_QUOTES_AS_STRING='{"foo": "bar"}'
RETAIN_INNER_QUOTES_AS_BACKTICKS=\`{"foo": "bar's"}\`
TRIM_SPACE_FROM_UNQUOTED=    some spaced out string
USERNAME=therealnerdybeast@example.tld
		SPACED_KEY = parsed
`;

suite('parseEnvFile', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('parses', () => {
		const parsed = parseEnvFile(example);
		assert.strictEqual(parsed.get('BASIC'), 'basic');
		assert.strictEqual(parsed.get('AFTER_LINE'), 'after_line');
		assert.strictEqual(parsed.get('EMPTY'), '');
		assert.strictEqual(parsed.get('EMPTY_SINGLE_QUOTES'), '');
		assert.strictEqual(parsed.get('EMPTY_DOUBLE_QUOTES'), '');
		assert.strictEqual(parsed.get('EMPTY_BACKTICKS'), '');
		assert.strictEqual(parsed.get('SINGLE_QUOTES'), 'single_quotes');
		assert.strictEqual(parsed.get('SINGLE_QUOTES_SPACED'), '    single quotes    ');
		assert.strictEqual(parsed.get('DOUBLE_QUOTES'), 'double_quotes');
		assert.strictEqual(parsed.get('DOUBLE_QUOTES_SPACED'), '    double quotes    ');
		assert.strictEqual(parsed.get('DOUBLE_QUOTES_INSIDE_SINGLE'), 'double "quotes" work inside single quotes');
		assert.strictEqual(parsed.get('DOUBLE_QUOTES_WITH_NO_SPACE_BRACKET'), '{ port: $MONGOLAB_PORT}');
		assert.strictEqual(parsed.get('SINGLE_QUOTES_INSIDE_DOUBLE'), `single 'quotes' work inside double quotes`);
		assert.strictEqual(parsed.get('BACKTICKS_INSIDE_SINGLE'), '`backticks` work inside single quotes');
		assert.strictEqual(parsed.get('BACKTICKS_INSIDE_DOUBLE'), '`backticks` work inside double quotes');
		assert.strictEqual(parsed.get('BACKTICKS'), 'backticks');
		assert.strictEqual(parsed.get('BACKTICKS_SPACED'), '    backticks    ');
		assert.strictEqual(parsed.get('DOUBLE_QUOTES_INSIDE_BACKTICKS'), 'double "quotes" work inside backticks');
		assert.strictEqual(parsed.get('SINGLE_QUOTES_INSIDE_BACKTICKS'), `single 'quotes' work inside backticks`);
		assert.strictEqual(parsed.get('DOUBLE_AND_SINGLE_QUOTES_INSIDE_BACKTICKS'), `double "quotes" and single 'quotes' work inside backticks`);
		assert.strictEqual(parsed.get('EXPAND_NEWLINES'), 'expand\nnew\nlines');
		assert.strictEqual(parsed.get('DONT_EXPAND_UNQUOTED'), 'dontexpand\\nnewlines');
		assert.strictEqual(parsed.get('DONT_EXPAND_SQUOTED'), 'dontexpand\\nnewlines');
		assert.strictEqual(parsed.get('COMMENTS'), undefined);
		assert.strictEqual(parsed.get('INLINE_COMMENTS'), 'inline comments');
		assert.strictEqual(parsed.get('INLINE_COMMENTS_SINGLE_QUOTES'), 'inline comments outside of #singlequotes');
		assert.strictEqual(parsed.get('INLINE_COMMENTS_DOUBLE_QUOTES'), 'inline comments outside of #doublequotes');
		assert.strictEqual(parsed.get('INLINE_COMMENTS_BACKTICKS'), 'inline comments outside of #backticks');
		assert.strictEqual(parsed.get('INLINE_COMMENTS_SPACE'), 'inline comments start with a');
		assert.strictEqual(parsed.get('EQUAL_SIGNS'), 'equals==');
		assert.strictEqual(parsed.get('RETAIN_INNER_QUOTES'), '{"foo": "bar"}');
		assert.strictEqual(parsed.get('RETAIN_INNER_QUOTES_AS_STRING'), '{"foo": "bar"}');
		assert.strictEqual(parsed.get('RETAIN_INNER_QUOTES_AS_BACKTICKS'), '{"foo": "bar\'s"}');
		assert.strictEqual(parsed.get('TRIM_SPACE_FROM_UNQUOTED'), 'some spaced out string');
		assert.strictEqual(parsed.get('USERNAME'), 'therealnerdybeast@example.tld');
		assert.strictEqual(parsed.get('SPACED_KEY'), 'parsed');
		const payload = parseEnvFile('BUFFER=true');
		assert.strictEqual(payload.get('BUFFER'), 'true');
		const expectedPayload = Object.entries({ SERVER: 'localhost', PASSWORD: 'password', DB: 'tests' });
		const RPayload = parseEnvFile('SERVER=localhost\rPASSWORD=password\rDB=tests\r');
		assert.deepStrictEqual([...RPayload], expectedPayload);
		const NPayload = parseEnvFile('SERVER=localhost\nPASSWORD=password\nDB=tests\n');
		assert.deepStrictEqual([...NPayload], expectedPayload);
		const RNPayload = parseEnvFile('SERVER=localhost\r\nPASSWORD=password\r\nDB=tests\r\n');
		assert.deepStrictEqual([...RNPayload], expectedPayload);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/errors.test.ts]---
Location: vscode-main/src/vs/base/test/common/errors.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { toErrorMessage } from '../../common/errorMessage.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';
import { transformErrorForSerialization, transformErrorFromSerialization } from '../../common/errors.js';
import { assertType } from '../../common/types.js';

suite('Errors', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('Get Error Message', function () {
		assert.strictEqual(toErrorMessage('Foo Bar'), 'Foo Bar');
		assert.strictEqual(toErrorMessage(new Error('Foo Bar')), 'Foo Bar');

		let error: any = new Error();
		error = new Error();
		error.detail = {};
		error.detail.exception = {};
		error.detail.exception.message = 'Foo Bar';
		assert.strictEqual(toErrorMessage(error), 'Foo Bar');
		assert.strictEqual(toErrorMessage(error, true), 'Foo Bar');

		assert(toErrorMessage());
		assert(toErrorMessage(null));
		assert(toErrorMessage({}));

		try {
			throw new Error();
		} catch (error) {
			assert.strictEqual(toErrorMessage(error), 'An unknown error occurred. Please consult the log for more details.');
			assert.ok(toErrorMessage(error, true).length > 'An unknown error occurred. Please consult the log for more details.'.length);
		}
	});

	test('Transform Error for Serialization', function () {
		const error = new Error('Test error');
		const serializedError = transformErrorForSerialization(error);
		assert.strictEqual(serializedError.name, 'Error');
		assert.strictEqual(serializedError.message, 'Test error');
		assert.strictEqual(serializedError.stack, error.stack);
		assert.strictEqual(serializedError.noTelemetry, false);
		assert.strictEqual(serializedError.cause, undefined);
	});

	test('Transform Error with Cause for Serialization', function () {
		const cause = new Error('Cause error');
		const error = new Error('Test error', { cause });
		const serializedError = transformErrorForSerialization(error);
		assert.strictEqual(serializedError.name, 'Error');
		assert.strictEqual(serializedError.message, 'Test error');
		assert.strictEqual(serializedError.stack, error.stack);
		assert.strictEqual(serializedError.noTelemetry, false);
		assert.ok(serializedError.cause);
		assert.strictEqual(serializedError.cause?.name, 'Error');
		assert.strictEqual(serializedError.cause?.message, 'Cause error');
		assert.strictEqual(serializedError.cause?.stack, cause.stack);
	});

	test('Transform Error from Serialization', function () {
		const serializedError = transformErrorForSerialization(new Error('Test error'));
		const error = transformErrorFromSerialization(serializedError);
		assert.strictEqual(error.name, 'Error');
		assert.strictEqual(error.message, 'Test error');
		assert.strictEqual(error.stack, serializedError.stack);
		assert.strictEqual(error.cause, undefined);
	});

	test('Transform Error with Cause from Serialization', function () {
		const cause = new Error('Cause error');
		const serializedCause = transformErrorForSerialization(cause);
		const error = new Error('Test error', { cause });
		const serializedError = transformErrorForSerialization(error);
		const deserializedError = transformErrorFromSerialization(serializedError);
		assert.strictEqual(deserializedError.name, 'Error');
		assert.strictEqual(deserializedError.message, 'Test error');
		assert.strictEqual(deserializedError.stack, serializedError.stack);
		assert.ok(deserializedError.cause);
		assertType(deserializedError.cause instanceof Error);
		assert.strictEqual(deserializedError.cause?.name, 'Error');
		assert.strictEqual(deserializedError.cause?.message, 'Cause error');
		assert.strictEqual(deserializedError.cause?.stack, serializedCause.stack);
	});
});
```

--------------------------------------------------------------------------------

````
