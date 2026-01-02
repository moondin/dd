---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 172
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 172 of 552)

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

---[FILE: src/vs/base/common/async.ts]---
Location: vscode-main/src/vs/base/common/async.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken, CancellationTokenSource } from './cancellation.js';
import { BugIndicatingError, CancellationError } from './errors.js';
import { Emitter, Event } from './event.js';
import { Disposable, DisposableMap, DisposableStore, IDisposable, isDisposable, MutableDisposable, toDisposable } from './lifecycle.js';
import { extUri as defaultExtUri, IExtUri } from './resources.js';
import { URI } from './uri.js';
import { setTimeout0 } from './platform.js';
import { MicrotaskDelay } from './symbols.js';
import { Lazy } from './lazy.js';

export function isThenable<T>(obj: unknown): obj is Promise<T> {
	return !!obj && typeof (obj as unknown as Promise<T>).then === 'function';
}

export interface CancelablePromise<T> extends Promise<T> {
	cancel(): void;
}

/**
 * Returns a promise that can be cancelled using the provided cancellation token.
 *
 * @remarks When cancellation is requested, the promise will be rejected with a {@link CancellationError}.
 * If the promise resolves to a disposable object, it will be automatically disposed when cancellation
 * is requested.
 *
 * @param callback A function that accepts a cancellation token and returns a promise
 * @returns A promise that can be cancelled
 */
export function createCancelablePromise<T>(callback: (token: CancellationToken) => Promise<T>): CancelablePromise<T> {
	const source = new CancellationTokenSource();

	const thenable = callback(source.token);

	let isCancelled = false;

	const promise = new Promise<T>((resolve, reject) => {
		const subscription = source.token.onCancellationRequested(() => {
			isCancelled = true;
			subscription.dispose();
			reject(new CancellationError());
		});
		Promise.resolve(thenable).then(value => {
			subscription.dispose();
			source.dispose();

			if (!isCancelled) {
				resolve(value);

			} else if (isDisposable(value)) {
				// promise has been cancelled, result is disposable and will
				// be cleaned up
				value.dispose();
			}
		}, err => {
			subscription.dispose();
			source.dispose();
			reject(err);
		});
	});

	return <CancelablePromise<T>>new class {
		cancel() {
			source.cancel();
			source.dispose();
		}
		then<TResult1 = T, TResult2 = never>(resolve?: ((value: T) => TResult1 | Promise<TResult1>) | undefined | null, reject?: ((reason: unknown) => TResult2 | Promise<TResult2>) | undefined | null): Promise<TResult1 | TResult2> {
			return promise.then(resolve, reject);
		}
		catch<TResult = never>(reject?: ((reason: unknown) => TResult | Promise<TResult>) | undefined | null): Promise<T | TResult> {
			return this.then(undefined, reject);
		}
		finally(onfinally?: (() => void) | undefined | null): Promise<T> {
			return promise.finally(onfinally);
		}
	};
}

/**
 * Returns a promise that resolves with `undefined` as soon as the passed token is cancelled.
 * @see {@link raceCancellationError}
 */
export function raceCancellation<T>(promise: Promise<T>, token: CancellationToken): Promise<T | undefined>;

/**
 * Returns a promise that resolves with `defaultValue` as soon as the passed token is cancelled.
 * @see {@link raceCancellationError}
 */
export function raceCancellation<T>(promise: Promise<T>, token: CancellationToken, defaultValue: T): Promise<T>;

export function raceCancellation<T>(promise: Promise<T>, token: CancellationToken, defaultValue?: T): Promise<T | undefined> {
	return new Promise((resolve, reject) => {
		const ref = token.onCancellationRequested(() => {
			ref.dispose();
			resolve(defaultValue);
		});
		promise.then(resolve, reject).finally(() => ref.dispose());
	});
}

/**
 * Returns a promise that rejects with an {@CancellationError} as soon as the passed token is cancelled.
 * @see {@link raceCancellation}
 */
export function raceCancellationError<T>(promise: Promise<T>, token: CancellationToken): Promise<T> {
	return new Promise((resolve, reject) => {
		const ref = token.onCancellationRequested(() => {
			ref.dispose();
			reject(new CancellationError());
		});
		promise.then(resolve, reject).finally(() => ref.dispose());
	});
}

/**
 * Wraps a cancellable promise such that it is no cancellable. Can be used to
 * avoid issues with shared promises that would normally be returned as
 * cancellable to consumers.
 */
export function notCancellablePromise<T>(promise: CancelablePromise<T>): Promise<T> {
	return new Promise<T>((resolve, reject) => {
		promise.then(resolve, reject);
	});
}

/**
 * Returns as soon as one of the promises resolves or rejects and cancels remaining promises
 */
export function raceCancellablePromises<T>(cancellablePromises: (CancelablePromise<T> | Promise<T>)[]): CancelablePromise<T> {
	let resolvedPromiseIndex = -1;
	const promises = cancellablePromises.map((promise, index) => promise.then(result => { resolvedPromiseIndex = index; return result; }));
	const promise = Promise.race(promises) as CancelablePromise<T>;
	promise.cancel = () => {
		cancellablePromises.forEach((cancellablePromise, index) => {
			if (index !== resolvedPromiseIndex && (cancellablePromise as CancelablePromise<T>).cancel) {
				(cancellablePromise as CancelablePromise<T>).cancel();
			}
		});
	};
	promise.finally(() => {
		promise.cancel();
	});
	return promise;
}

export function raceTimeout<T>(promise: Promise<T>, timeout: number, onTimeout?: () => void): Promise<T | undefined> {
	let promiseResolve: ((value: T | undefined) => void) | undefined = undefined;

	const timer = setTimeout(() => {
		promiseResolve?.(undefined);
		onTimeout?.();
	}, timeout);

	return Promise.race([
		promise.finally(() => clearTimeout(timer)),
		new Promise<T | undefined>(resolve => promiseResolve = resolve)
	]);
}

export function asPromise<T>(callback: () => T | Thenable<T>): Promise<T> {
	return new Promise<T>((resolve, reject) => {
		const item = callback();
		if (isThenable<T>(item)) {
			item.then(resolve, reject);
		} else {
			resolve(item);
		}
	});
}

/**
 * Creates and returns a new promise, plus its `resolve` and `reject` callbacks.
 *
 * Replace with standardized [`Promise.withResolvers`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers) once it is supported
 */
export function promiseWithResolvers<T>(): { promise: Promise<T>; resolve: (value: T | PromiseLike<T>) => void; reject: (err?: any) => void } {
	let resolve: (value: T | PromiseLike<T>) => void;
	let reject: (reason?: any) => void;
	const promise = new Promise<T>((res, rej) => {
		resolve = res;
		reject = rej;
	});
	return { promise, resolve: resolve!, reject: reject! };
}

export interface ITask<T> {
	(): T;
}

export interface ICancellableTask<T> {
	(token: CancellationToken): T;
}

/**
 * A helper to prevent accumulation of sequential async tasks.
 *
 * Imagine a mail man with the sole task of delivering letters. As soon as
 * a letter submitted for delivery, he drives to the destination, delivers it
 * and returns to his base. Imagine that during the trip, N more letters were submitted.
 * When the mail man returns, he picks those N letters and delivers them all in a
 * single trip. Even though N+1 submissions occurred, only 2 deliveries were made.
 *
 * The throttler implements this via the queue() method, by providing it a task
 * factory. Following the example:
 *
 * 		const throttler = new Throttler();
 * 		const letters = [];
 *
 * 		function deliver() {
 * 			const lettersToDeliver = letters;
 * 			letters = [];
 * 			return makeTheTrip(lettersToDeliver);
 * 		}
 *
 * 		function onLetterReceived(l) {
 * 			letters.push(l);
 * 			throttler.queue(deliver);
 * 		}
 */
export class Throttler implements IDisposable {

	private activePromise: Promise<any> | null;
	private queuedPromise: Promise<any> | null;
	private queuedPromiseFactory: ICancellableTask<Promise<any>> | null;
	private cancellationTokenSource: CancellationTokenSource;

	constructor() {
		this.activePromise = null;
		this.queuedPromise = null;
		this.queuedPromiseFactory = null;

		this.cancellationTokenSource = new CancellationTokenSource();
	}

	queue<T>(promiseFactory: ICancellableTask<Promise<T>>): Promise<T> {
		if (this.cancellationTokenSource.token.isCancellationRequested) {
			return Promise.reject(new Error('Throttler is disposed'));
		}

		if (this.activePromise) {
			this.queuedPromiseFactory = promiseFactory;

			if (!this.queuedPromise) {
				const onComplete = () => {
					this.queuedPromise = null;

					if (this.cancellationTokenSource.token.isCancellationRequested) {
						return;
					}

					const result = this.queue(this.queuedPromiseFactory!);
					this.queuedPromiseFactory = null;

					return result;
				};

				this.queuedPromise = new Promise(resolve => {
					this.activePromise!.then(onComplete, onComplete).then(resolve);
				});
			}

			return new Promise((resolve, reject) => {
				this.queuedPromise!.then(resolve, reject);
			});
		}

		this.activePromise = promiseFactory(this.cancellationTokenSource.token);

		return new Promise((resolve, reject) => {
			this.activePromise!.then((result: T) => {
				this.activePromise = null;
				resolve(result);
			}, (err: unknown) => {
				this.activePromise = null;
				reject(err);
			});
		});
	}

	dispose(): void {
		this.cancellationTokenSource.cancel();
	}
}

export class Sequencer {

	private current: Promise<unknown> = Promise.resolve(null);

	queue<T>(promiseTask: ITask<Promise<T>>): Promise<T> {
		return this.current = this.current.then(() => promiseTask(), () => promiseTask());
	}
}

export class SequencerByKey<TKey> {

	private promiseMap = new Map<TKey, Promise<unknown>>();

	queue<T>(key: TKey, promiseTask: ITask<Promise<T>>): Promise<T> {
		const runningPromise = this.promiseMap.get(key) ?? Promise.resolve();
		const newPromise = runningPromise
			.catch(() => { })
			.then(promiseTask)
			.finally(() => {
				if (this.promiseMap.get(key) === newPromise) {
					this.promiseMap.delete(key);
				}
			});
		this.promiseMap.set(key, newPromise);
		return newPromise;
	}

	peek(key: TKey): Promise<unknown> | undefined {
		return this.promiseMap.get(key) || undefined;
	}

	keys(): IterableIterator<TKey> {
		return this.promiseMap.keys();
	}
}

interface IScheduledLater extends IDisposable {
	isTriggered(): boolean;
}

const timeoutDeferred = (timeout: number, fn: () => void): IScheduledLater => {
	let scheduled = true;
	const handle = setTimeout(() => {
		scheduled = false;
		fn();
	}, timeout);
	return {
		isTriggered: () => scheduled,
		dispose: () => {
			clearTimeout(handle);
			scheduled = false;
		},
	};
};

const microtaskDeferred = (fn: () => void): IScheduledLater => {
	let scheduled = true;
	queueMicrotask(() => {
		if (scheduled) {
			scheduled = false;
			fn();
		}
	});

	return {
		isTriggered: () => scheduled,
		dispose: () => { scheduled = false; },
	};
};

/**
 * A helper to delay (debounce) execution of a task that is being requested often.
 *
 * Following the throttler, now imagine the mail man wants to optimize the number of
 * trips proactively. The trip itself can be long, so he decides not to make the trip
 * as soon as a letter is submitted. Instead he waits a while, in case more
 * letters are submitted. After said waiting period, if no letters were submitted, he
 * decides to make the trip. Imagine that N more letters were submitted after the first
 * one, all within a short period of time between each other. Even though N+1
 * submissions occurred, only 1 delivery was made.
 *
 * The delayer offers this behavior via the trigger() method, into which both the task
 * to be executed and the waiting period (delay) must be passed in as arguments. Following
 * the example:
 *
 * 		const delayer = new Delayer(WAITING_PERIOD);
 * 		const letters = [];
 *
 * 		function letterReceived(l) {
 * 			letters.push(l);
 * 			delayer.trigger(() => { return makeTheTrip(); });
 * 		}
 */
export class Delayer<T> implements IDisposable {

	private deferred: IScheduledLater | null;
	private completionPromise: Promise<any> | null;
	private doResolve: ((value?: any | Promise<any>) => void) | null;
	private doReject: ((err: unknown) => void) | null;
	private task: ITask<T | Promise<T>> | null;

	constructor(public defaultDelay: number | typeof MicrotaskDelay) {
		this.deferred = null;
		this.completionPromise = null;
		this.doResolve = null;
		this.doReject = null;
		this.task = null;
	}

	trigger(task: ITask<T | Promise<T>>, delay = this.defaultDelay): Promise<T> {
		this.task = task;
		this.cancelTimeout();

		if (!this.completionPromise) {
			this.completionPromise = new Promise((resolve, reject) => {
				this.doResolve = resolve;
				this.doReject = reject;
			}).then(() => {
				this.completionPromise = null;
				this.doResolve = null;
				if (this.task) {
					const task = this.task;
					this.task = null;
					return task();
				}
				return undefined;
			});
		}

		const fn = () => {
			this.deferred = null;
			this.doResolve?.(null);
		};

		this.deferred = delay === MicrotaskDelay ? microtaskDeferred(fn) : timeoutDeferred(delay, fn);

		return this.completionPromise;
	}

	isTriggered(): boolean {
		return !!this.deferred?.isTriggered();
	}

	cancel(): void {
		this.cancelTimeout();

		if (this.completionPromise) {
			this.doReject?.(new CancellationError());
			this.completionPromise = null;
		}
	}

	private cancelTimeout(): void {
		this.deferred?.dispose();
		this.deferred = null;
	}

	dispose(): void {
		this.cancel();
	}
}

/**
 * A helper to delay execution of a task that is being requested often, while
 * preventing accumulation of consecutive executions, while the task runs.
 *
 * The mail man is clever and waits for a certain amount of time, before going
 * out to deliver letters. While the mail man is going out, more letters arrive
 * and can only be delivered once he is back. Once he is back the mail man will
 * do one more trip to deliver the letters that have accumulated while he was out.
 */
export class ThrottledDelayer<T> {

	private delayer: Delayer<Promise<T>>;
	private throttler: Throttler;

	constructor(defaultDelay: number) {
		this.delayer = new Delayer(defaultDelay);
		this.throttler = new Throttler();
	}

	trigger(promiseFactory: ICancellableTask<Promise<T>>, delay?: number): Promise<T> {
		return this.delayer.trigger(() => this.throttler.queue(promiseFactory), delay) as unknown as Promise<T>;
	}

	isTriggered(): boolean {
		return this.delayer.isTriggered();
	}

	cancel(): void {
		this.delayer.cancel();
	}

	dispose(): void {
		this.delayer.dispose();
		this.throttler.dispose();
	}
}

/**
 * A barrier that is initially closed and then becomes opened permanently.
 */
export class Barrier {
	private _isOpen: boolean;
	private _promise: Promise<boolean>;
	private _completePromise!: (v: boolean) => void;

	constructor() {
		this._isOpen = false;
		this._promise = new Promise<boolean>((c, e) => {
			this._completePromise = c;
		});
	}

	isOpen(): boolean {
		return this._isOpen;
	}

	open(): void {
		this._isOpen = true;
		this._completePromise(true);
	}

	wait(): Promise<boolean> {
		return this._promise;
	}
}

/**
 * A barrier that is initially closed and then becomes opened permanently after a certain period of
 * time or when open is called explicitly
 */
export class AutoOpenBarrier extends Barrier {

	private readonly _timeout: Timeout;

	constructor(autoOpenTimeMs: number) {
		super();
		this._timeout = setTimeout(() => this.open(), autoOpenTimeMs);
	}

	override open(): void {
		clearTimeout(this._timeout);
		super.open();
	}
}

export function timeout(millis: number): CancelablePromise<void>;
export function timeout(millis: number, token: CancellationToken): Promise<void>;
export function timeout(millis: number, token?: CancellationToken): CancelablePromise<void> | Promise<void> {
	if (!token) {
		return createCancelablePromise(token => timeout(millis, token));
	}

	return new Promise((resolve, reject) => {
		const handle = setTimeout(() => {
			disposable.dispose();
			resolve();
		}, millis);
		const disposable = token.onCancellationRequested(() => {
			clearTimeout(handle);
			disposable.dispose();
			reject(new CancellationError());
		});
	});
}

/**
 * Creates a timeout that can be disposed using its returned value.
 * @param handler The timeout handler.
 * @param timeout An optional timeout in milliseconds.
 * @param store An optional {@link DisposableStore} that will have the timeout disposable managed automatically.
 *
 * @example
 * const store = new DisposableStore;
 * // Call the timeout after 1000ms at which point it will be automatically
 * // evicted from the store.
 * const timeoutDisposable = disposableTimeout(() => {}, 1000, store);
 *
 * if (foo) {
 *   // Cancel the timeout and evict it from store.
 *   timeoutDisposable.dispose();
 * }
 */
export function disposableTimeout(handler: () => void, timeout = 0, store?: DisposableStore): IDisposable {
	const timer = setTimeout(() => {
		handler();
		if (store) {
			disposable.dispose();
		}
	}, timeout);
	const disposable = toDisposable(() => {
		clearTimeout(timer);
		store?.delete(disposable);
	});
	store?.add(disposable);
	return disposable;
}

/**
 * Runs the provided list of promise factories in sequential order. The returned
 * promise will complete to an array of results from each promise.
 */

export function sequence<T>(promiseFactories: ITask<Promise<T>>[]): Promise<T[]> {
	const results: T[] = [];
	let index = 0;
	const len = promiseFactories.length;

	function next(): Promise<T> | null {
		return index < len ? promiseFactories[index++]() : null;
	}

	function thenHandler(result: unknown): Promise<any> {
		if (result !== undefined && result !== null) {
			results.push(result as T);
		}

		const n = next();
		if (n) {
			return n.then(thenHandler);
		}

		return Promise.resolve(results);
	}

	return Promise.resolve(null).then(thenHandler);
}

export function first<T>(promiseFactories: ITask<Promise<T>>[], shouldStop: (t: T) => boolean = t => !!t, defaultValue: T | null = null): Promise<T | null> {
	let index = 0;
	const len = promiseFactories.length;

	const loop: () => Promise<T | null> = () => {
		if (index >= len) {
			return Promise.resolve(defaultValue);
		}

		const factory = promiseFactories[index++];
		const promise = Promise.resolve(factory());

		return promise.then(result => {
			if (shouldStop(result)) {
				return Promise.resolve(result);
			}

			return loop();
		});
	};

	return loop();
}

/**
 * Returns the result of the first promise that matches the "shouldStop",
 * running all promises in parallel. Supports cancelable promises.
 */
export function firstParallel<T>(promiseList: Promise<T>[], shouldStop?: (t: T) => boolean, defaultValue?: T | null): Promise<T | null>;
export function firstParallel<T, R extends T>(promiseList: Promise<T>[], shouldStop: (t: T) => t is R, defaultValue?: R | null): Promise<R | null>;
export function firstParallel<T>(promiseList: Promise<T>[], shouldStop: (t: T) => boolean = t => !!t, defaultValue: T | null = null) {
	if (promiseList.length === 0) {
		return Promise.resolve(defaultValue);
	}

	let todo = promiseList.length;
	const finish = () => {
		todo = -1;
		for (const promise of promiseList) {
			(promise as Partial<CancelablePromise<T>>).cancel?.();
		}
	};

	return new Promise<T | null>((resolve, reject) => {
		for (const promise of promiseList) {
			promise.then(result => {
				if (--todo >= 0 && shouldStop(result)) {
					finish();
					resolve(result);
				} else if (todo === 0) {
					resolve(defaultValue);
				}
			})
				.catch(err => {
					if (--todo >= 0) {
						finish();
						reject(err);
					}
				});
		}
	});
}

interface ILimitedTaskFactory<T> {
	factory: ITask<Promise<T>>;
	c: (value: T | Promise<T>) => void;
	e: (error?: unknown) => void;
}

export interface ILimiter<T> {

	readonly size: number;

	queue(factory: ITask<Promise<T>>): Promise<T>;

	clear(): void;
}

/**
 * A helper to queue N promises and run them all with a max degree of parallelism. The helper
 * ensures that at any time no more than M promises are running at the same time.
 */
export class Limiter<T> implements ILimiter<T> {

	private _size = 0;
	private _isDisposed = false;
	private runningPromises: number;
	private readonly maxDegreeOfParalellism: number;
	private readonly outstandingPromises: ILimitedTaskFactory<T>[];
	private readonly _onDrained: Emitter<void>;

	constructor(maxDegreeOfParalellism: number) {
		this.maxDegreeOfParalellism = maxDegreeOfParalellism;
		this.outstandingPromises = [];
		this.runningPromises = 0;
		this._onDrained = new Emitter<void>();
	}

	/**
	 *
	 * @returns A promise that resolved when all work is done (onDrained) or when
	 * there is nothing to do
	 */
	whenIdle(): Promise<void> {
		return this.size > 0
			? Event.toPromise(this.onDrained)
			: Promise.resolve();
	}

	get onDrained(): Event<void> {
		return this._onDrained.event;
	}

	get size(): number {
		return this._size;
	}

	queue(factory: ITask<Promise<T>>): Promise<T> {
		if (this._isDisposed) {
			throw new Error('Object has been disposed');
		}
		this._size++;

		return new Promise<T>((c, e) => {
			this.outstandingPromises.push({ factory, c, e });
			this.consume();
		});
	}

	private consume(): void {
		while (this.outstandingPromises.length && this.runningPromises < this.maxDegreeOfParalellism) {
			const iLimitedTask = this.outstandingPromises.shift()!;
			this.runningPromises++;

			const promise = iLimitedTask.factory();
			promise.then(iLimitedTask.c, iLimitedTask.e);
			promise.then(() => this.consumed(), () => this.consumed());
		}
	}

	private consumed(): void {
		if (this._isDisposed) {
			return;
		}
		this.runningPromises--;
		if (--this._size === 0) {
			this._onDrained.fire();
		}

		if (this.outstandingPromises.length > 0) {
			this.consume();
		}
	}

	clear(): void {
		if (this._isDisposed) {
			throw new Error('Object has been disposed');
		}
		this.outstandingPromises.length = 0;
		this._size = this.runningPromises;
	}

	dispose(): void {
		this._isDisposed = true;
		this.outstandingPromises.length = 0; // stop further processing
		this._size = 0;
		this._onDrained.dispose();
	}
}

/**
 * A queue is handles one promise at a time and guarantees that at any time only one promise is executing.
 */
export class Queue<T> extends Limiter<T> {

	constructor() {
		super(1);
	}
}

/**
 * Same as `Queue`, ensures that only 1 task is executed at the same time. The difference to `Queue` is that
 * there is only 1 task about to be scheduled next. As such, calling `queue` while a task is executing will
 * replace the currently queued task until it executes.
 *
 * As such, the returned promise may not be from the factory that is passed in but from the next factory that
 * is running after having called `queue`.
 */
export class LimitedQueue {

	private readonly sequentializer = new TaskSequentializer();

	private tasks = 0;

	queue(factory: ITask<Promise<void>>): Promise<void> {
		if (!this.sequentializer.isRunning()) {
			return this.sequentializer.run(this.tasks++, factory());
		}

		return this.sequentializer.queue(() => {
			return this.sequentializer.run(this.tasks++, factory());
		});
	}
}

/**
 * A helper to organize queues per resource. The ResourceQueue makes sure to manage queues per resource
 * by disposing them once the queue is empty.
 */
export class ResourceQueue implements IDisposable {

	private readonly queues = new Map<string, Queue<void>>();

	private readonly drainers = new Set<DeferredPromise<void>>();

	private drainListeners: DisposableMap<number> | undefined = undefined;
	private drainListenerCount = 0;

	async whenDrained(): Promise<void> {
		if (this.isDrained()) {
			return;
		}

		const promise = new DeferredPromise<void>();
		this.drainers.add(promise);

		return promise.p;
	}

	private isDrained(): boolean {
		for (const [, queue] of this.queues) {
			if (queue.size > 0) {
				return false;
			}
		}

		return true;
	}

	queueSize(resource: URI, extUri: IExtUri = defaultExtUri): number {
		const key = extUri.getComparisonKey(resource);

		return this.queues.get(key)?.size ?? 0;
	}

	queueFor(resource: URI, factory: ITask<Promise<void>>, extUri: IExtUri = defaultExtUri): Promise<void> {
		const key = extUri.getComparisonKey(resource);

		let queue = this.queues.get(key);
		if (!queue) {
			queue = new Queue<void>();
			const drainListenerId = this.drainListenerCount++;
			const drainListener = Event.once(queue.onDrained)(() => {
				queue?.dispose();
				this.queues.delete(key);
				this.onDidQueueDrain();

				this.drainListeners?.deleteAndDispose(drainListenerId);

				if (this.drainListeners?.size === 0) {
					this.drainListeners.dispose();
					this.drainListeners = undefined;
				}
			});

			if (!this.drainListeners) {
				this.drainListeners = new DisposableMap();
			}
			this.drainListeners.set(drainListenerId, drainListener);

			this.queues.set(key, queue);
		}

		return queue.queue(factory);
	}

	private onDidQueueDrain(): void {
		if (!this.isDrained()) {
			return; // not done yet
		}

		this.releaseDrainers();
	}

	private releaseDrainers(): void {
		for (const drainer of this.drainers) {
			drainer.complete();
		}

		this.drainers.clear();
	}

	dispose(): void {
		for (const [, queue] of this.queues) {
			queue.dispose();
		}

		this.queues.clear();

		// Even though we might still have pending
		// tasks queued, after the queues have been
		// disposed, we can no longer track them, so
		// we release drainers to prevent hanging
		// promises when the resource queue is being
		// disposed.
		this.releaseDrainers();

		this.drainListeners?.dispose();
	}
}

export type Task<T = void> = () => (Promise<T> | T);

/**
 * Wrap a type in an optional promise. This can be useful to avoid the runtime
 * overhead of creating a promise.
 */
export type MaybePromise<T> = Promise<T> | T;

/**
 * Processes tasks in the order they were scheduled.
*/
export class TaskQueue {
	private _runningTask: Task<any> | undefined = undefined;
	private _pendingTasks: { task: Task<any>; deferred: DeferredPromise<any>; setUndefinedWhenCleared: boolean }[] = [];

	/**
	 * Waits for the current and pending tasks to finish, then runs and awaits the given task.
	 * If the task is skipped because of clearPending, the promise is rejected with a CancellationError.
	*/
	public schedule<T>(task: Task<T>): Promise<T> {
		const deferred = new DeferredPromise<T>();
		this._pendingTasks.push({ task, deferred, setUndefinedWhenCleared: false });
		this._runIfNotRunning();
		return deferred.p;
	}

	/**
	 * Waits for the current and pending tasks to finish, then runs and awaits the given task.
	 * If the task is skipped because of clearPending, the promise is resolved with undefined.
	*/
	public scheduleSkipIfCleared<T>(task: Task<T>): Promise<T | undefined> {
		const deferred = new DeferredPromise<T>();
		this._pendingTasks.push({ task, deferred, setUndefinedWhenCleared: true });
		this._runIfNotRunning();
		return deferred.p;
	}

	private _runIfNotRunning(): void {
		if (this._runningTask === undefined) {
			this._processQueue();
		}
	}

	private async _processQueue(): Promise<void> {
		if (this._pendingTasks.length === 0) {
			return;
		}

		const next = this._pendingTasks.shift();
		if (!next) {
			return;
		}

		if (this._runningTask) {
			throw new BugIndicatingError();
		}

		this._runningTask = next.task;

		try {
			const result = await next.task();
			next.deferred.complete(result);
		} catch (e) {
			next.deferred.error(e);
		} finally {
			this._runningTask = undefined;
			this._processQueue();
		}
	}

	/**
	 * Clears all pending tasks. Does not cancel the currently running task.
	*/
	public clearPending(): void {
		const tasks = this._pendingTasks;
		this._pendingTasks = [];
		for (const task of tasks) {
			if (task.setUndefinedWhenCleared) {
				task.deferred.complete(undefined);
			} else {
				task.deferred.error(new CancellationError());
			}
		}
	}
}

export class TimeoutTimer implements IDisposable {
	private _token: Timeout | undefined;
	private _isDisposed = false;

	constructor();
	constructor(runner: () => void, timeout: number);
	constructor(runner?: () => void, timeout?: number) {
		this._token = undefined;

		if (typeof runner === 'function' && typeof timeout === 'number') {
			this.setIfNotSet(runner, timeout);
		}
	}

	dispose(): void {
		this.cancel();
		this._isDisposed = true;
	}

	cancel(): void {
		if (this._token !== undefined) {
			clearTimeout(this._token);
			this._token = undefined;
		}
	}

	cancelAndSet(runner: () => void, timeout: number): void {
		if (this._isDisposed) {
			throw new BugIndicatingError(`Calling 'cancelAndSet' on a disposed TimeoutTimer`);
		}

		this.cancel();
		this._token = setTimeout(() => {
			this._token = undefined;
			runner();
		}, timeout);
	}

	setIfNotSet(runner: () => void, timeout: number): void {
		if (this._isDisposed) {
			throw new BugIndicatingError(`Calling 'setIfNotSet' on a disposed TimeoutTimer`);
		}

		if (this._token !== undefined) {
			// timer is already set
			return;
		}
		this._token = setTimeout(() => {
			this._token = undefined;
			runner();
		}, timeout);
	}
}

export class IntervalTimer implements IDisposable {

	private disposable: IDisposable | undefined = undefined;
	private isDisposed = false;

	cancel(): void {
		this.disposable?.dispose();
		this.disposable = undefined;
	}

	cancelAndSet(runner: () => void, interval: number, context = globalThis): void {
		if (this.isDisposed) {
			throw new BugIndicatingError(`Calling 'cancelAndSet' on a disposed IntervalTimer`);
		}

		this.cancel();
		const handle = context.setInterval(() => {
			runner();
		}, interval);

		this.disposable = toDisposable(() => {
			context.clearInterval(handle);
			this.disposable = undefined;
		});
	}

	dispose(): void {
		this.cancel();
		this.isDisposed = true;
	}
}

export class RunOnceScheduler implements IDisposable {

	protected runner: ((...args: unknown[]) => void) | null;

	private timeoutToken: Timeout | undefined;
	private timeout: number;
	private timeoutHandler: () => void;

	constructor(runner: (...args: any[]) => void, delay: number) {
		this.timeoutToken = undefined;
		this.runner = runner;
		this.timeout = delay;
		this.timeoutHandler = this.onTimeout.bind(this);
	}

	/**
	 * Dispose RunOnceScheduler
	 */
	dispose(): void {
		this.cancel();
		this.runner = null;
	}

	/**
	 * Cancel current scheduled runner (if any).
	 */
	cancel(): void {
		if (this.isScheduled()) {
			clearTimeout(this.timeoutToken);
			this.timeoutToken = undefined;
		}
	}

	/**
	 * Cancel previous runner (if any) & schedule a new runner.
	 */
	schedule(delay = this.timeout): void {
		this.cancel();
		this.timeoutToken = setTimeout(this.timeoutHandler, delay);
	}

	get delay(): number {
		return this.timeout;
	}

	set delay(value: number) {
		this.timeout = value;
	}

	/**
	 * Returns true if scheduled.
	 */
	isScheduled(): boolean {
		return this.timeoutToken !== undefined;
	}

	flush(): void {
		if (this.isScheduled()) {
			this.cancel();
			this.doRun();
		}
	}

	private onTimeout() {
		this.timeoutToken = undefined;
		if (this.runner) {
			this.doRun();
		}
	}

	protected doRun(): void {
		this.runner?.();
	}
}

/**
 * Same as `RunOnceScheduler`, but doesn't count the time spent in sleep mode.
 * > **NOTE**: Only offers 1s resolution.
 *
 * When calling `setTimeout` with 3hrs, and putting the computer immediately to sleep
 * for 8hrs, `setTimeout` will fire **as soon as the computer wakes from sleep**. But
 * this scheduler will execute 3hrs **after waking the computer from sleep**.
 */
export class ProcessTimeRunOnceScheduler {

	private runner: (() => void) | null;
	private timeout: number;

	private counter: number;
	private intervalToken: Timeout | undefined;
	private intervalHandler: () => void;

	constructor(runner: () => void, delay: number) {
		if (delay % 1000 !== 0) {
			console.warn(`ProcessTimeRunOnceScheduler resolution is 1s, ${delay}ms is not a multiple of 1000ms.`);
		}
		this.runner = runner;
		this.timeout = delay;
		this.counter = 0;
		this.intervalToken = undefined;
		this.intervalHandler = this.onInterval.bind(this);
	}

	dispose(): void {
		this.cancel();
		this.runner = null;
	}

	cancel(): void {
		if (this.isScheduled()) {
			clearInterval(this.intervalToken);
			this.intervalToken = undefined;
		}
	}

	/**
	 * Cancel previous runner (if any) & schedule a new runner.
	 */
	schedule(delay = this.timeout): void {
		if (delay % 1000 !== 0) {
			console.warn(`ProcessTimeRunOnceScheduler resolution is 1s, ${delay}ms is not a multiple of 1000ms.`);
		}
		this.cancel();
		this.counter = Math.ceil(delay / 1000);
		this.intervalToken = setInterval(this.intervalHandler, 1000);
	}

	/**
	 * Returns true if scheduled.
	 */
	isScheduled(): boolean {
		return this.intervalToken !== undefined;
	}

	private onInterval() {
		this.counter--;
		if (this.counter > 0) {
			// still need to wait
			return;
		}

		// time elapsed
		clearInterval(this.intervalToken);
		this.intervalToken = undefined;
		this.runner?.();
	}
}

export class RunOnceWorker<T> extends RunOnceScheduler {

	private units: T[] = [];

	constructor(runner: (units: T[]) => void, timeout: number) {
		super(runner, timeout);
	}

	work(unit: T): void {
		this.units.push(unit);

		if (!this.isScheduled()) {
			this.schedule();
		}
	}

	protected override doRun(): void {
		const units = this.units;
		this.units = [];

		this.runner?.(units);
	}

	override dispose(): void {
		this.units = [];

		super.dispose();
	}
}

export interface IThrottledWorkerOptions {

	/**
	 * maximum of units the worker will pass onto handler at once
	 */
	maxWorkChunkSize: number;

	/**
	 * maximum of units the worker will keep in memory for processing
	 */
	maxBufferedWork: number | undefined;

	/**
	 * delay before processing the next round of chunks when chunk size exceeds limits
	 */
	throttleDelay: number;

	/**
	 * When enabled will guarantee that two distinct calls to `work()` are not executed
	 * without throttle delay between them.
	 * Otherwise if the worker isn't currently throttling it will execute work immediately.
	 */
	waitThrottleDelayBetweenWorkUnits?: boolean;
}

/**
 * The `ThrottledWorker` will accept units of work `T`
 * to handle. The contract is:
 * * there is a maximum of units the worker can handle at once (via `maxWorkChunkSize`)
 * * there is a maximum of units the worker will keep in memory for processing (via `maxBufferedWork`)
 * * after having handled `maxWorkChunkSize` units, the worker needs to rest (via `throttleDelay`)
 */
export class ThrottledWorker<T> extends Disposable {

	private readonly pendingWork: T[] = [];

	private readonly throttler = this._register(new MutableDisposable<RunOnceScheduler>());
	private disposed = false;
	private lastExecutionTime = 0;

	constructor(
		private options: IThrottledWorkerOptions,
		private readonly handler: (units: T[]) => void
	) {
		super();
	}

	/**
	 * The number of work units that are pending to be processed.
	 */
	get pending(): number { return this.pendingWork.length; }

	/**
	 * Add units to be worked on. Use `pending` to figure out
	 * how many units are not yet processed after this method
	 * was called.
	 *
	 * @returns whether the work was accepted or not. If the
	 * worker is disposed, it will not accept any more work.
	 * If the number of pending units would become larger
	 * than `maxPendingWork`, more work will also not be accepted.
	 */
	work(units: readonly T[]): boolean {
		if (this.disposed) {
			return false; // work not accepted: disposed
		}

		// Check for reaching maximum of pending work
		if (typeof this.options.maxBufferedWork === 'number') {

			// Throttled: simple check if pending + units exceeds max pending
			if (this.throttler.value) {
				if (this.pending + units.length > this.options.maxBufferedWork) {
					return false; // work not accepted: too much pending work
				}
			}

			// Unthrottled: same as throttled, but account for max chunk getting
			// worked on directly without being pending
			else {
				if (this.pending + units.length - this.options.maxWorkChunkSize > this.options.maxBufferedWork) {
					return false; // work not accepted: too much pending work
				}
			}
		}

		// Add to pending units first
		for (const unit of units) {
			this.pendingWork.push(unit);
		}

		const timeSinceLastExecution = Date.now() - this.lastExecutionTime;

		if (!this.throttler.value && (!this.options.waitThrottleDelayBetweenWorkUnits || timeSinceLastExecution >= this.options.throttleDelay)) {
			// Work directly if we are not throttling and we are not
			// enforced to throttle between `work()` calls.
			this.doWork();
		} else if (!this.throttler.value && this.options.waitThrottleDelayBetweenWorkUnits) {
			// Otherwise, schedule the throttler to work.
			this.scheduleThrottler(Math.max(this.options.throttleDelay - timeSinceLastExecution, 0));
		} else {
			// Otherwise, our work will be picked up by the running throttler
		}

		return true; // work accepted
	}

	private doWork(): void {
		this.lastExecutionTime = Date.now();

		// Extract chunk to handle and handle it
		this.handler(this.pendingWork.splice(0, this.options.maxWorkChunkSize));

		// If we have remaining work, schedule it after a delay
		if (this.pendingWork.length > 0) {
			this.scheduleThrottler();
		}
	}

	private scheduleThrottler(delay = this.options.throttleDelay): void {
		this.throttler.value = new RunOnceScheduler(() => {
			this.throttler.clear();

			this.doWork();
		}, delay);
		this.throttler.value.schedule();
	}

	override dispose(): void {
		super.dispose();

		this.pendingWork.length = 0;
		this.disposed = true;
	}
}

//#region -- run on idle tricks ------------

export interface IdleDeadline {
	readonly didTimeout: boolean;
	timeRemaining(): number;
}

type IdleApi = Pick<typeof globalThis, 'requestIdleCallback' | 'cancelIdleCallback'>;


/**
 * Execute the callback the next time the browser is idle, returning an
 * {@link IDisposable} that will cancel the callback when disposed. This wraps
 * [requestIdleCallback] so it will fallback to [setTimeout] if the environment
 * doesn't support it.
 *
 * @param callback The callback to run when idle, this includes an
 * [IdleDeadline] that provides the time alloted for the idle callback by the
 * browser. Not respecting this deadline will result in a degraded user
 * experience.
 * @param timeout A timeout at which point to queue no longer wait for an idle
 * callback but queue it on the regular event loop (like setTimeout). Typically
 * this should not be used.
 *
 * [IdleDeadline]: https://developer.mozilla.org/en-US/docs/Web/API/IdleDeadline
 * [requestIdleCallback]: https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback
 * [setTimeout]: https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout
 *
 * **Note** that there is `dom.ts#runWhenWindowIdle` which is better suited when running inside a browser
 * context
 */
export let runWhenGlobalIdle: (callback: (idle: IdleDeadline) => void, timeout?: number) => IDisposable;

export let _runWhenIdle: (targetWindow: IdleApi, callback: (idle: IdleDeadline) => void, timeout?: number) => IDisposable;

(function () {
	const safeGlobal: any = globalThis;
	if (typeof safeGlobal.requestIdleCallback !== 'function' || typeof safeGlobal.cancelIdleCallback !== 'function') {
		_runWhenIdle = (_targetWindow, runner, timeout?) => {
			setTimeout0(() => {
				if (disposed) {
					return;
				}
				const end = Date.now() + 15; // one frame at 64fps
				const deadline: IdleDeadline = {
					didTimeout: true,
					timeRemaining() {
						return Math.max(0, end - Date.now());
					}
				};
				runner(Object.freeze(deadline));
			});
			let disposed = false;
			return {
				dispose() {
					if (disposed) {
						return;
					}
					disposed = true;
				}
			};
		};
	} else {
		_runWhenIdle = (targetWindow: typeof safeGlobal, runner, timeout?) => {
			const handle: number = targetWindow.requestIdleCallback(runner, typeof timeout === 'number' ? { timeout } : undefined);
			let disposed = false;
			return {
				dispose() {
					if (disposed) {
						return;
					}
					disposed = true;
					targetWindow.cancelIdleCallback(handle);
				}
			};
		};
	}
	runWhenGlobalIdle = (runner, timeout) => _runWhenIdle(globalThis, runner, timeout);
})();

export abstract class AbstractIdleValue<T> {

	private readonly _executor: () => void;
	private readonly _handle: IDisposable;

	private _didRun: boolean = false;
	private _value?: T;
	private _error: unknown;

	constructor(targetWindow: IdleApi, executor: () => T) {
		this._executor = () => {
			try {
				this._value = executor();
			} catch (err) {
				this._error = err;
			} finally {
				this._didRun = true;
			}
		};
		this._handle = _runWhenIdle(targetWindow, () => this._executor());
	}

	dispose(): void {
		this._handle.dispose();
	}

	get value(): T {
		if (!this._didRun) {
			this._handle.dispose();
			this._executor();
		}
		if (this._error) {
			throw this._error;
		}
		return this._value!;
	}

	get isInitialized(): boolean {
		return this._didRun;
	}
}

/**
 * An `IdleValue` that always uses the current window (which might be throttled or inactive)
 *
 * **Note** that there is `dom.ts#WindowIdleValue` which is better suited when running inside a browser
 * context
 */
export class GlobalIdleValue<T> extends AbstractIdleValue<T> {

	constructor(executor: () => T) {
		super(globalThis, executor);
	}
}

//#endregion

export async function retry<T>(task: ITask<Promise<T>>, delay: number, retries: number): Promise<T> {
	let lastError: Error | undefined;

	for (let i = 0; i < retries; i++) {
		try {
			return await task();
		} catch (error) {
			lastError = error;

			await timeout(delay);
		}
	}

	throw lastError;
}

//#region Task Sequentializer

interface IRunningTask {
	readonly taskId: number;
	readonly cancel: () => void;
	readonly promise: Promise<void>;
}

interface IQueuedTask {
	readonly promise: Promise<void>;
	readonly promiseResolve: () => void;
	readonly promiseReject: (error: Error) => void;
	run: ITask<Promise<void>>;
}

export interface ITaskSequentializerWithRunningTask {
	readonly running: Promise<void>;
}

export interface ITaskSequentializerWithQueuedTask {
	readonly queued: IQueuedTask;
}

/**
 * @deprecated use `LimitedQueue` instead for an easier to use API
 */
export class TaskSequentializer {

	private _running?: IRunningTask;
	private _queued?: IQueuedTask;

	isRunning(taskId?: number): this is ITaskSequentializerWithRunningTask {
		if (typeof taskId === 'number') {
			return this._running?.taskId === taskId;
		}

		return !!this._running;
	}

	get running(): Promise<void> | undefined {
		return this._running?.promise;
	}

	cancelRunning(): void {
		this._running?.cancel();
	}

	run(taskId: number, promise: Promise<void>, onCancel?: () => void,): Promise<void> {
		this._running = { taskId, cancel: () => onCancel?.(), promise };

		promise.then(() => this.doneRunning(taskId), () => this.doneRunning(taskId));

		return promise;
	}

	private doneRunning(taskId: number): void {
		if (this._running && taskId === this._running.taskId) {

			// only set running to done if the promise finished that is associated with that taskId
			this._running = undefined;

			// schedule the queued task now that we are free if we have any
			this.runQueued();
		}
	}

	private runQueued(): void {
		if (this._queued) {
			const queued = this._queued;
			this._queued = undefined;

			// Run queued task and complete on the associated promise
			queued.run().then(queued.promiseResolve, queued.promiseReject);
		}
	}

	/**
	 * Note: the promise to schedule as next run MUST itself call `run`.
	 *       Otherwise, this sequentializer will report `false` for `isRunning`
	 *       even when this task is running. Missing this detail means that
	 *       suddenly multiple tasks will run in parallel.
	 */
	queue(run: ITask<Promise<void>>): Promise<void> {

		// this is our first queued task, so we create associated promise with it
		// so that we can return a promise that completes when the task has
		// completed.
		if (!this._queued) {
			const { promise, resolve: promiseResolve, reject: promiseReject } = promiseWithResolvers<void>();
			this._queued = {
				run,
				promise,
				promiseResolve,
				promiseReject
			};
		}

		// we have a previous queued task, just overwrite it
		else {
			this._queued.run = run;
		}

		return this._queued.promise;
	}

	hasQueued(): this is ITaskSequentializerWithQueuedTask {
		return !!this._queued;
	}

	async join(): Promise<void> {
		return this._queued?.promise ?? this._running?.promise;
	}
}

//#endregion

//#region

/**
 * The `IntervalCounter` allows to count the number
 * of calls to `increment()` over a duration of
 * `interval`. This utility can be used to conditionally
 * throttle a frequent task when a certain threshold
 * is reached.
 */
export class IntervalCounter {

	private lastIncrementTime = 0;

	private value = 0;

	constructor(private readonly interval: number, private readonly nowFn = () => Date.now()) { }

	increment(): number {
		const now = this.nowFn();

		// We are outside of the range of `interval` and as such
		// start counting from 0 and remember the time
		if (now - this.lastIncrementTime > this.interval) {
			this.lastIncrementTime = now;
			this.value = 0;
		}

		this.value++;

		return this.value;
	}
}

//#endregion

//#region

export type ValueCallback<T = unknown> = (value: T | Promise<T>) => void;

const enum DeferredOutcome {
	Resolved,
	Rejected
}

/**
 * Creates a promise whose resolution or rejection can be controlled imperatively.
 */
export class DeferredPromise<T> {

	public static fromPromise<T>(promise: Promise<T>): DeferredPromise<T> {
		const deferred = new DeferredPromise<T>();
		deferred.settleWith(promise);
		return deferred;
	}

	private completeCallback!: ValueCallback<T>;
	private errorCallback!: (err: unknown) => void;
	private outcome?: { outcome: DeferredOutcome.Rejected; value: unknown } | { outcome: DeferredOutcome.Resolved; value: T };

	public get isRejected() {
		return this.outcome?.outcome === DeferredOutcome.Rejected;
	}

	public get isResolved() {
		return this.outcome?.outcome === DeferredOutcome.Resolved;
	}

	public get isSettled() {
		return !!this.outcome;
	}

	public get value() {
		return this.outcome?.outcome === DeferredOutcome.Resolved ? this.outcome?.value : undefined;
	}

	public readonly p: Promise<T>;

	constructor() {
		this.p = new Promise<T>((c, e) => {
			this.completeCallback = c;
			this.errorCallback = e;
		});
	}

	public complete(value: T) {
		if (this.isSettled) {
			return Promise.resolve();
		}

		return new Promise<void>(resolve => {
			this.completeCallback(value);
			this.outcome = { outcome: DeferredOutcome.Resolved, value };
			resolve();
		});
	}

	public error(err: unknown) {
		if (this.isSettled) {
			return Promise.resolve();
		}

		return new Promise<void>(resolve => {
			this.errorCallback(err);
			this.outcome = { outcome: DeferredOutcome.Rejected, value: err };
			resolve();
		});
	}

	public settleWith(promise: Promise<T>): Promise<void> {
		return promise.then(
			value => this.complete(value),
			error => this.error(error)
		);
	}

	public cancel() {
		return this.error(new CancellationError());
	}
}

//#endregion

//#region Promises

export namespace Promises {

	/**
	 * A drop-in replacement for `Promise.all` with the only difference
	 * that the method awaits every promise to either fulfill or reject.
	 *
	 * Similar to `Promise.all`, only the first error will be returned
	 * if any.
	 */
	export async function settled<T>(promises: Promise<T>[]): Promise<T[]> {
		let firstError: Error | undefined = undefined;

		const result = await Promise.all(promises.map(promise => promise.then(value => value, error => {
			if (!firstError) {
				firstError = error;
			}

			return undefined; // do not rethrow so that other promises can settle
		})));

		if (typeof firstError !== 'undefined') {
			throw firstError;
		}

		return result as unknown as T[]; // cast is needed and protected by the `throw` above
	}

	/**
	 * A helper to create a new `Promise<T>` with a body that is a promise
	 * itself. By default, an error that raises from the async body will
	 * end up as a unhandled rejection, so this utility properly awaits the
	 * body and rejects the promise as a normal promise does without async
	 * body.
	 *
	 * This method should only be used in rare cases where otherwise `async`
	 * cannot be used (e.g. when callbacks are involved that require this).
	 */
	export function withAsyncBody<T, E = Error>(bodyFn: (resolve: (value: T) => unknown, reject: (error: E) => unknown) => Promise<unknown>): Promise<T> {
		// eslint-disable-next-line no-async-promise-executor
		return new Promise<T>(async (resolve, reject) => {
			try {
				await bodyFn(resolve, reject);
			} catch (error) {
				reject(error);
			}
		});
	}
}

export class StatefulPromise<T> {
	private _value: T | undefined = undefined;
	get value(): T | undefined { return this._value; }

	private _error: unknown = undefined;
	get error(): unknown { return this._error; }

	private _isResolved = false;
	get isResolved() { return this._isResolved; }

	public readonly promise: Promise<T>;

	constructor(promise: Promise<T>) {
		this.promise = promise.then(
			value => {
				this._value = value;
				this._isResolved = true;
				return value;
			},
			error => {
				this._error = error;
				this._isResolved = true;
				throw error;
			}
		);
	}

	/**
	 * Returns the resolved value.
	 * Throws if the promise is not resolved yet.
	 */
	public requireValue(): T {
		if (!this._isResolved) {
			throw new BugIndicatingError('Promise is not resolved yet');
		}
		if (this._error) {
			throw this._error;
		}
		return this._value!;
	}
}

export class LazyStatefulPromise<T> {
	private readonly _promise = new Lazy(() => new StatefulPromise(this._compute()));

	constructor(
		private readonly _compute: () => Promise<T>,
	) { }

	/**
	 * Returns the resolved value.
	 * Throws if the promise is not resolved yet.
	 */
	public requireValue(): T {
		return this._promise.value.requireValue();
	}

	/**
	 * Returns the promise (and triggers a computation of the promise if not yet done so).
	 */
	public getPromise(): Promise<T> {
		return this._promise.value.promise;
	}

	/**
	 * Reads the current value without triggering a computation of the promise.
	 */
	public get currentValue(): T | undefined {
		return this._promise.rawValue?.value;
	}
}

//#endregion

//#region

const enum AsyncIterableSourceState {
	Initial,
	DoneOK,
	DoneError,
}

/**
 * An object that allows to emit async values asynchronously or bring the iterable to an error state using `reject()`.
 * This emitter is valid only for the duration of the executor (until the promise returned by the executor settles).
 */
export interface AsyncIterableEmitter<T> {
	/**
	 * The value will be appended at the end.
	 *
	 * **NOTE** If `reject()` has already been called, this method has no effect.
	 */
	emitOne(value: T): void;
	/**
	 * The values will be appended at the end.
	 *
	 * **NOTE** If `reject()` has already been called, this method has no effect.
	 */
	emitMany(values: T[]): void;
	/**
	 * Writing an error will permanently invalidate this iterable.
	 * The current users will receive an error thrown, as will all future users.
	 *
	 * **NOTE** If `reject()` have already been called, this method has no effect.
	 */
	reject(error: Error): void;
}

/**
 * An executor for the `AsyncIterableObject` that has access to an emitter.
 */
export interface AsyncIterableExecutor<T> {
	/**
	 * @param emitter An object that allows to emit async values valid only for the duration of the executor.
	 */
	(emitter: AsyncIterableEmitter<T>): unknown | Promise<unknown>;
}

/**
 * A rich implementation for an `AsyncIterable<T>`.
 */
export class AsyncIterableObject<T> implements AsyncIterable<T> {

	public static fromArray<T>(items: T[]): AsyncIterableObject<T> {
		return new AsyncIterableObject<T>((writer) => {
			writer.emitMany(items);
		});
	}

	public static fromPromise<T>(promise: Promise<T[]>): AsyncIterableObject<T> {
		return new AsyncIterableObject<T>(async (emitter) => {
			emitter.emitMany(await promise);
		});
	}

	public static fromPromisesResolveOrder<T>(promises: Promise<T>[]): AsyncIterableObject<T> {
		return new AsyncIterableObject<T>(async (emitter) => {
			await Promise.all(promises.map(async (p) => emitter.emitOne(await p)));
		});
	}

	public static merge<T>(iterables: AsyncIterable<T>[]): AsyncIterableObject<T> {
		return new AsyncIterableObject(async (emitter) => {
			await Promise.all(iterables.map(async (iterable) => {
				for await (const item of iterable) {
					emitter.emitOne(item);
				}
			}));
		});
	}

	public static EMPTY = AsyncIterableObject.fromArray<any>([]);

	private _state: AsyncIterableSourceState;
	private _results: T[];
	private _error: Error | null;
	private readonly _onReturn?: () => void | Promise<void>;
	private readonly _onStateChanged: Emitter<void>;

	constructor(executor: AsyncIterableExecutor<T>, onReturn?: () => void | Promise<void>) {
		this._state = AsyncIterableSourceState.Initial;
		this._results = [];
		this._error = null;
		this._onReturn = onReturn;
		this._onStateChanged = new Emitter<void>();

		queueMicrotask(async () => {
			const writer: AsyncIterableEmitter<T> = {
				emitOne: (item) => this.emitOne(item),
				emitMany: (items) => this.emitMany(items),
				reject: (error) => this.reject(error)
			};
			try {
				await Promise.resolve(executor(writer));
				this.resolve();
			} catch (err) {
				this.reject(err);
			} finally {
				writer.emitOne = undefined!;
				writer.emitMany = undefined!;
				writer.reject = undefined!;
			}
		});
	}

	[Symbol.asyncIterator](): AsyncIterator<T, undefined, undefined> {
		let i = 0;
		return {
			next: async () => {
				do {
					if (this._state === AsyncIterableSourceState.DoneError) {
						throw this._error;
					}
					if (i < this._results.length) {
						return { done: false, value: this._results[i++] };
					}
					if (this._state === AsyncIterableSourceState.DoneOK) {
						return { done: true, value: undefined };
					}
					await Event.toPromise(this._onStateChanged.event);
				} while (true);
			},
			return: async () => {
				this._onReturn?.();
				return { done: true, value: undefined };
			}
		};
	}

	public static map<T, R>(iterable: AsyncIterable<T>, mapFn: (item: T) => R): AsyncIterableObject<R> {
		return new AsyncIterableObject<R>(async (emitter) => {
			for await (const item of iterable) {
				emitter.emitOne(mapFn(item));
			}
		});
	}

	public map<R>(mapFn: (item: T) => R): AsyncIterableObject<R> {
		return AsyncIterableObject.map(this, mapFn);
	}

	public static filter<T>(iterable: AsyncIterable<T>, filterFn: (item: T) => boolean): AsyncIterableObject<T> {
		return new AsyncIterableObject<T>(async (emitter) => {
			for await (const item of iterable) {
				if (filterFn(item)) {
					emitter.emitOne(item);
				}
			}
		});
	}

	public filter<T2 extends T>(filterFn: (item: T) => item is T2): AsyncIterableObject<T2>;
	public filter(filterFn: (item: T) => boolean): AsyncIterableObject<T>;
	public filter(filterFn: (item: T) => boolean): AsyncIterableObject<T> {
		return AsyncIterableObject.filter(this, filterFn);
	}

	public static coalesce<T>(iterable: AsyncIterable<T | undefined | null>): AsyncIterableObject<T> {
		return <AsyncIterableObject<T>>AsyncIterableObject.filter(iterable, item => !!item);
	}

	public coalesce(): AsyncIterableObject<NonNullable<T>> {
		return AsyncIterableObject.coalesce(this) as AsyncIterableObject<NonNullable<T>>;
	}

	public static async toPromise<T>(iterable: AsyncIterable<T>): Promise<T[]> {
		const result: T[] = [];
		for await (const item of iterable) {
			result.push(item);
		}
		return result;
	}

	public toPromise(): Promise<T[]> {
		return AsyncIterableObject.toPromise(this);
	}

	/**
	 * The value will be appended at the end.
	 *
	 * **NOTE** If `resolve()` or `reject()` have already been called, this method has no effect.
	 */
	private emitOne(value: T): void {
		if (this._state !== AsyncIterableSourceState.Initial) {
			return;
		}
		// it is important to add new values at the end,
		// as we may have iterators already running on the array
		this._results.push(value);
		this._onStateChanged.fire();
	}

	/**
	 * The values will be appended at the end.
	 *
	 * **NOTE** If `resolve()` or `reject()` have already been called, this method has no effect.
	 */
	private emitMany(values: T[]): void {
		if (this._state !== AsyncIterableSourceState.Initial) {
			return;
		}
		// it is important to add new values at the end,
		// as we may have iterators already running on the array
		this._results = this._results.concat(values);
		this._onStateChanged.fire();
	}

	/**
	 * Calling `resolve()` will mark the result array as complete.
	 *
	 * **NOTE** `resolve()` must be called, otherwise all consumers of this iterable will hang indefinitely, similar to a non-resolved promise.
	 * **NOTE** If `resolve()` or `reject()` have already been called, this method has no effect.
	 */
	private resolve(): void {
		if (this._state !== AsyncIterableSourceState.Initial) {
			return;
		}
		this._state = AsyncIterableSourceState.DoneOK;
		this._onStateChanged.fire();
	}

	/**
	 * Writing an error will permanently invalidate this iterable.
	 * The current users will receive an error thrown, as will all future users.
	 *
	 * **NOTE** If `resolve()` or `reject()` have already been called, this method has no effect.
	 */
	private reject(error: Error) {
		if (this._state !== AsyncIterableSourceState.Initial) {
			return;
		}
		this._state = AsyncIterableSourceState.DoneError;
		this._error = error;
		this._onStateChanged.fire();
	}
}


export function createCancelableAsyncIterableProducer<T>(callback: (token: CancellationToken) => AsyncIterable<T>): CancelableAsyncIterableProducer<T> {
	const source = new CancellationTokenSource();
	const innerIterable = callback(source.token);

	return new CancelableAsyncIterableProducer<T>(source, async (emitter) => {
		const subscription = source.token.onCancellationRequested(() => {
			subscription.dispose();
			source.dispose();
			emitter.reject(new CancellationError());
		});
		try {
			for await (const item of innerIterable) {
				if (source.token.isCancellationRequested) {
					// canceled in the meantime
					return;
				}
				emitter.emitOne(item);
			}
			subscription.dispose();
			source.dispose();
		} catch (err) {
			subscription.dispose();
			source.dispose();
			emitter.reject(err);
		}
	});
}

export class AsyncIterableSource<T> {

	private readonly _deferred = new DeferredPromise<void>();
	private readonly _asyncIterable: AsyncIterableObject<T>;

	private _errorFn: (error: Error) => void;
	private _emitOneFn: (item: T) => void;
	private _emitManyFn: (item: T[]) => void;

	/**
	 *
	 * @param onReturn A function that will be called when consuming the async iterable
	 * has finished by the consumer, e.g the for-await-loop has be existed (break, return) early.
	 * This is NOT called when resolving this source by its owner.
	 */
	constructor(onReturn?: () => Promise<void> | void) {
		this._asyncIterable = new AsyncIterableObject(emitter => {

			if (earlyError) {
				emitter.reject(earlyError);
				return;
			}
			if (earlyItems) {
				emitter.emitMany(earlyItems);
			}
			this._errorFn = (error: Error) => emitter.reject(error);
			this._emitOneFn = (item: T) => emitter.emitOne(item);
			this._emitManyFn = (items: T[]) => emitter.emitMany(items);
			return this._deferred.p;
		}, onReturn);

		let earlyError: Error | undefined;
		let earlyItems: T[] | undefined;


		this._errorFn = (error: Error) => {
			if (!earlyError) {
				earlyError = error;
			}
		};
		this._emitOneFn = (item: T) => {
			if (!earlyItems) {
				earlyItems = [];
			}
			earlyItems.push(item);
		};
		this._emitManyFn = (items: T[]) => {
			if (!earlyItems) {
				earlyItems = items.slice();
			} else {
				items.forEach(item => earlyItems!.push(item));
			}
		};
	}

	get asyncIterable(): AsyncIterableObject<T> {
		return this._asyncIterable;
	}

	resolve(): void {
		this._deferred.complete();
	}

	reject(error: Error): void {
		this._errorFn(error);
		this._deferred.complete();
	}

	emitOne(item: T): void {
		this._emitOneFn(item);
	}

	emitMany(items: T[]) {
		this._emitManyFn(items);
	}
}

export function cancellableIterable<T>(iterableOrIterator: AsyncIterator<T> | AsyncIterable<T>, token: CancellationToken): AsyncIterableIterator<T> {
	const iterator = Symbol.asyncIterator in iterableOrIterator ? iterableOrIterator[Symbol.asyncIterator]() : iterableOrIterator;

	return {
		async next(): Promise<IteratorResult<T>> {
			if (token.isCancellationRequested) {
				return { done: true, value: undefined };
			}
			const result = await raceCancellation(iterator.next(), token);
			return result || { done: true, value: undefined };
		},
		throw: iterator.throw?.bind(iterator),
		return: iterator.return?.bind(iterator),
		[Symbol.asyncIterator]() {
			return this;
		}
	};
}

type ProducerConsumerValue<T> = {
	ok: true;
	value: T;
} | {
	ok: false;
	error: Error;
};

class ProducerConsumer<T> {
	private readonly _unsatisfiedConsumers: DeferredPromise<T>[] = [];
	private readonly _unconsumedValues: ProducerConsumerValue<T>[] = [];
	private _finalValue: ProducerConsumerValue<T> | undefined;

	public get hasFinalValue(): boolean {
		return !!this._finalValue;
	}

	produce(value: ProducerConsumerValue<T>): void {
		this._ensureNoFinalValue();
		if (this._unsatisfiedConsumers.length > 0) {
			const deferred = this._unsatisfiedConsumers.shift()!;
			this._resolveOrRejectDeferred(deferred, value);
		} else {
			this._unconsumedValues.push(value);
		}
	}

	produceFinal(value: ProducerConsumerValue<T>): void {
		this._ensureNoFinalValue();
		this._finalValue = value;
		for (const deferred of this._unsatisfiedConsumers) {
			this._resolveOrRejectDeferred(deferred, value);
		}
		this._unsatisfiedConsumers.length = 0;
	}

	private _ensureNoFinalValue(): void {
		if (this._finalValue) {
			throw new BugIndicatingError('ProducerConsumer: cannot produce after final value has been set');
		}
	}

	private _resolveOrRejectDeferred(deferred: DeferredPromise<T>, value: ProducerConsumerValue<T>): void {
		if (value.ok) {
			deferred.complete(value.value);
		} else {
			deferred.error(value.error);
		}
	}

	consume(): Promise<T> {
		if (this._unconsumedValues.length > 0 || this._finalValue) {
			const value = this._unconsumedValues.length > 0 ? this._unconsumedValues.shift()! : this._finalValue!;
			if (value.ok) {
				return Promise.resolve(value.value);
			} else {
				return Promise.reject(value.error);
			}
		} else {
			const deferred = new DeferredPromise<T>();
			this._unsatisfiedConsumers.push(deferred);
			return deferred.p;
		}
	}
}

/**
 * Important difference to AsyncIterableObject:
 * If it is iterated two times, the second iterator will not see the values emitted by the first iterator.
 */
export class AsyncIterableProducer<T> implements AsyncIterable<T> {
	private readonly _producerConsumer = new ProducerConsumer<IteratorResult<T>>();

	constructor(executor: AsyncIterableExecutor<T>, private readonly _onReturn?: () => void) {
		queueMicrotask(async () => {
			const p = executor({
				emitOne: value => this._producerConsumer.produce({ ok: true, value: { done: false, value: value } }),
				emitMany: values => {
					for (const value of values) {
						this._producerConsumer.produce({ ok: true, value: { done: false, value: value } });
					}
				},
				reject: error => this._finishError(error),
			});

			if (!this._producerConsumer.hasFinalValue) {
				try {
					await p;
					this._finishOk();
				} catch (error) {
					this._finishError(error);
				}
			}
		});
	}

	public static fromArray<T>(items: T[]): AsyncIterableProducer<T> {
		return new AsyncIterableProducer<T>((writer) => {
			writer.emitMany(items);
		});
	}

	public static fromPromise<T>(promise: Promise<T[]>): AsyncIterableProducer<T> {
		return new AsyncIterableProducer<T>(async (emitter) => {
			emitter.emitMany(await promise);
		});
	}

	public static fromPromisesResolveOrder<T>(promises: Promise<T>[]): AsyncIterableProducer<T> {
		return new AsyncIterableProducer<T>(async (emitter) => {
			await Promise.all(promises.map(async (p) => emitter.emitOne(await p)));
		});
	}

	public static merge<T>(iterables: AsyncIterable<T>[]): AsyncIterableProducer<T> {
		return new AsyncIterableProducer(async (emitter) => {
			await Promise.all(iterables.map(async (iterable) => {
				for await (const item of iterable) {
					emitter.emitOne(item);
				}
			}));
		});
	}

	public static EMPTY = AsyncIterableProducer.fromArray<any>([]);

	public static map<T, R>(iterable: AsyncIterable<T>, mapFn: (item: T) => R): AsyncIterableProducer<R> {
		return new AsyncIterableProducer<R>(async (emitter) => {
			for await (const item of iterable) {
				emitter.emitOne(mapFn(item));
			}
		});
	}

	public static tee<T>(iterable: AsyncIterable<T>): [AsyncIterableProducer<T>, AsyncIterableProducer<T>] {
		let emitter1: AsyncIterableEmitter<T> | undefined;
		let emitter2: AsyncIterableEmitter<T> | undefined;

		const defer = new DeferredPromise<void>();

		const start = async () => {
			if (!emitter1 || !emitter2) {
				return; // not yet ready
			}
			try {
				for await (const item of iterable) {
					emitter1.emitOne(item);
					emitter2.emitOne(item);
				}
			} catch (err) {
				emitter1.reject(err);
				emitter2.reject(err);
			} finally {
				defer.complete();
			}
		};

		const p1 = new AsyncIterableProducer<T>(async (emitter) => {
			emitter1 = emitter;
			start();
			return defer.p;
		});
		const p2 = new AsyncIterableProducer<T>(async (emitter) => {
			emitter2 = emitter;
			start();
			return defer.p;
		});
		return [p1, p2];
	}

	public map<R>(mapFn: (item: T) => R): AsyncIterableProducer<R> {
		return AsyncIterableProducer.map(this, mapFn);
	}

	public static coalesce<T>(iterable: AsyncIterable<T | undefined | null>): AsyncIterableProducer<T> {
		return <AsyncIterableProducer<T>>AsyncIterableProducer.filter(iterable, item => !!item);
	}

	public coalesce(): AsyncIterableProducer<NonNullable<T>> {
		return AsyncIterableProducer.coalesce(this) as AsyncIterableProducer<NonNullable<T>>;
	}

	public static filter<T>(iterable: AsyncIterable<T>, filterFn: (item: T) => boolean): AsyncIterableProducer<T> {
		return new AsyncIterableProducer<T>(async (emitter) => {
			for await (const item of iterable) {
				if (filterFn(item)) {
					emitter.emitOne(item);
				}
			}
		});
	}

	public filter<T2 extends T>(filterFn: (item: T) => item is T2): AsyncIterableProducer<T2>;
	public filter(filterFn: (item: T) => boolean): AsyncIterableProducer<T>;
	public filter(filterFn: (item: T) => boolean): AsyncIterableProducer<T> {
		return AsyncIterableProducer.filter(this, filterFn);
	}

	private _finishOk(): void {
		if (!this._producerConsumer.hasFinalValue) {
			this._producerConsumer.produceFinal({ ok: true, value: { done: true, value: undefined } });
		}
	}

	private _finishError(error: Error): void {
		if (!this._producerConsumer.hasFinalValue) {
			this._producerConsumer.produceFinal({ ok: false, error: error });
		}
		// Warning: this can cause to dropped errors.
	}

	private readonly _iterator: AsyncIterator<T, void, void> = {
		next: () => this._producerConsumer.consume(),
		return: () => {
			this._onReturn?.();
			return Promise.resolve({ done: true, value: undefined });
		},
		throw: async (e) => {
			this._finishError(e);
			return { done: true, value: undefined };
		},
	};

	[Symbol.asyncIterator](): AsyncIterator<T, void, void> {
		return this._iterator;
	}
}

export class CancelableAsyncIterableProducer<T> extends AsyncIterableProducer<T> {
	constructor(
		private readonly _source: CancellationTokenSource,
		executor: AsyncIterableExecutor<T>
	) {
		super(executor);
	}

	cancel(): void {
		this._source.cancel();
	}
}

//#endregion

export const AsyncReaderEndOfStream = Symbol('AsyncReaderEndOfStream');

export class AsyncReader<T> {
	private _buffer: T[] = [];
	private _atEnd = false;

	public get endOfStream(): boolean { return this._buffer.length === 0 && this._atEnd; }
	private _extendBufferPromise: Promise<void> | undefined;

	constructor(
		private readonly _source: AsyncIterator<T>
	) {
	}

	public async read(): Promise<T | typeof AsyncReaderEndOfStream> {
		if (this._buffer.length === 0 && !this._atEnd) {
			await this._extendBuffer();
		}
		if (this._buffer.length === 0) {
			return AsyncReaderEndOfStream;
		}
		return this._buffer.shift()!;
	}

	public async readWhile(predicate: (value: T) => boolean, callback: (element: T) => unknown): Promise<void> {
		do {
			const piece = await this.peek();
			if (piece === AsyncReaderEndOfStream) {
				break;
			}
			if (!predicate(piece)) {
				break;
			}
			await this.read(); // consume
			await callback(piece);
		} while (true);
	}

	public readBufferedOrThrow(): T | typeof AsyncReaderEndOfStream {
		const value = this.peekBufferedOrThrow();
		this._buffer.shift();
		return value;
	}

	public async consumeToEnd(): Promise<void> {
		while (!this.endOfStream) {
			await this.read();
		}
	}

	public async peek(): Promise<T | typeof AsyncReaderEndOfStream> {
		if (this._buffer.length === 0 && !this._atEnd) {
			await this._extendBuffer();
		}
		if (this._buffer.length === 0) {
			return AsyncReaderEndOfStream;
		}
		return this._buffer[0];
	}

	public peekBufferedOrThrow(): T | typeof AsyncReaderEndOfStream {
		if (this._buffer.length === 0) {
			if (this._atEnd) {
				return AsyncReaderEndOfStream;
			}
			throw new BugIndicatingError('No buffered elements');
		}

		return this._buffer[0];
	}

	public async peekTimeout(timeoutMs: number): Promise<T | typeof AsyncReaderEndOfStream | undefined> {
		if (this._buffer.length === 0 && !this._atEnd) {
			await raceTimeout(this._extendBuffer(), timeoutMs);
		}
		if (this._atEnd) {
			return AsyncReaderEndOfStream;
		}
		if (this._buffer.length === 0) {
			return undefined;
		}
		return this._buffer[0];
	}

	private _extendBuffer(): Promise<void> {
		if (this._atEnd) {
			return Promise.resolve();
		}

		if (!this._extendBufferPromise) {
			this._extendBufferPromise = (async () => {
				const { value, done } = await this._source.next();
				this._extendBufferPromise = undefined;
				if (done) {
					this._atEnd = true;
				} else {
					this._buffer.push(value);
				}
			})();
		}

		return this._extendBufferPromise;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/buffer.ts]---
Location: vscode-main/src/vs/base/common/buffer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Lazy } from './lazy.js';
import * as streams from './stream.js';

interface NodeBuffer {
	allocUnsafe(size: number): Uint8Array;
	isBuffer(obj: unknown): obj is NodeBuffer;
	from(arrayBuffer: ArrayBufferLike, byteOffset?: number, length?: number): Uint8Array;
	from(data: string): Uint8Array;
}

declare const Buffer: NodeBuffer;

const hasBuffer = (typeof Buffer !== 'undefined');
const indexOfTable = new Lazy(() => new Uint8Array(256));

let textEncoder: { encode: (input: string) => Uint8Array } | null;
let textDecoder: { decode: (input: Uint8Array) => string } | null;

export class VSBuffer {

	/**
	 * When running in a nodejs context, the backing store for the returned `VSBuffer` instance
	 * might use a nodejs Buffer allocated from node's Buffer pool, which is not transferrable.
	 */
	static alloc(byteLength: number): VSBuffer {
		if (hasBuffer) {
			return new VSBuffer(Buffer.allocUnsafe(byteLength));
		} else {
			return new VSBuffer(new Uint8Array(byteLength));
		}
	}

	/**
	 * When running in a nodejs context, if `actual` is not a nodejs Buffer, the backing store for
	 * the returned `VSBuffer` instance might use a nodejs Buffer allocated from node's Buffer pool,
	 * which is not transferrable.
	 */
	static wrap(actual: Uint8Array): VSBuffer {
		if (hasBuffer && !(Buffer.isBuffer(actual))) {
			// https://nodejs.org/dist/latest-v10.x/docs/api/buffer.html#buffer_class_method_buffer_from_arraybuffer_byteoffset_length
			// Create a zero-copy Buffer wrapper around the ArrayBuffer pointed to by the Uint8Array
			actual = Buffer.from(actual.buffer, actual.byteOffset, actual.byteLength);
		}
		return new VSBuffer(actual);
	}

	/**
	 * When running in a nodejs context, the backing store for the returned `VSBuffer` instance
	 * might use a nodejs Buffer allocated from node's Buffer pool, which is not transferrable.
	 */
	static fromString(source: string, options?: { dontUseNodeBuffer?: boolean }): VSBuffer {
		const dontUseNodeBuffer = options?.dontUseNodeBuffer || false;
		if (!dontUseNodeBuffer && hasBuffer) {
			return new VSBuffer(Buffer.from(source));
		} else {
			if (!textEncoder) {
				textEncoder = new TextEncoder();
			}
			return new VSBuffer(textEncoder.encode(source));
		}
	}

	/**
	 * When running in a nodejs context, the backing store for the returned `VSBuffer` instance
	 * might use a nodejs Buffer allocated from node's Buffer pool, which is not transferrable.
	 */
	static fromByteArray(source: number[]): VSBuffer {
		const result = VSBuffer.alloc(source.length);
		for (let i = 0, len = source.length; i < len; i++) {
			result.buffer[i] = source[i];
		}
		return result;
	}

	/**
	 * When running in a nodejs context, the backing store for the returned `VSBuffer` instance
	 * might use a nodejs Buffer allocated from node's Buffer pool, which is not transferrable.
	 */
	static concat(buffers: VSBuffer[], totalLength?: number): VSBuffer {
		if (typeof totalLength === 'undefined') {
			totalLength = 0;
			for (let i = 0, len = buffers.length; i < len; i++) {
				totalLength += buffers[i].byteLength;
			}
		}

		const ret = VSBuffer.alloc(totalLength);
		let offset = 0;
		for (let i = 0, len = buffers.length; i < len; i++) {
			const element = buffers[i];
			ret.set(element, offset);
			offset += element.byteLength;
		}

		return ret;
	}

	static isNativeBuffer(buffer: unknown): boolean {
		return hasBuffer && Buffer.isBuffer(buffer);
	}

	readonly buffer: Uint8Array;
	readonly byteLength: number;

	private constructor(buffer: Uint8Array) {
		this.buffer = buffer;
		this.byteLength = this.buffer.byteLength;
	}

	/**
	 * When running in a nodejs context, the backing store for the returned `VSBuffer` instance
	 * might use a nodejs Buffer allocated from node's Buffer pool, which is not transferrable.
	 */
	clone(): VSBuffer {
		const result = VSBuffer.alloc(this.byteLength);
		result.set(this);
		return result;
	}

	toString(): string {
		if (hasBuffer) {
			return this.buffer.toString();
		} else {
			if (!textDecoder) {
				textDecoder = new TextDecoder(undefined, { ignoreBOM: true });
			}
			return textDecoder.decode(this.buffer);
		}
	}

	slice(start?: number, end?: number): VSBuffer {
		// IMPORTANT: use subarray instead of slice because TypedArray#slice
		// creates shallow copy and NodeBuffer#slice doesn't. The use of subarray
		// ensures the same, performance, behaviour.
		return new VSBuffer(this.buffer.subarray(start, end));
	}

	set(array: VSBuffer, offset?: number): void;
	set(array: Uint8Array, offset?: number): void;
	set(array: ArrayBuffer, offset?: number): void;
	set(array: ArrayBufferView, offset?: number): void;
	set(array: VSBuffer | Uint8Array | ArrayBuffer | ArrayBufferView, offset?: number): void;
	set(array: VSBuffer | Uint8Array | ArrayBuffer | ArrayBufferView, offset?: number): void {
		if (array instanceof VSBuffer) {
			this.buffer.set(array.buffer, offset);
		} else if (array instanceof Uint8Array) {
			this.buffer.set(array, offset);
		} else if (array instanceof ArrayBuffer) {
			this.buffer.set(new Uint8Array(array), offset);
		} else if (ArrayBuffer.isView(array)) {
			this.buffer.set(new Uint8Array(array.buffer, array.byteOffset, array.byteLength), offset);
		} else {
			throw new Error(`Unknown argument 'array'`);
		}
	}

	readUInt32BE(offset: number): number {
		return readUInt32BE(this.buffer, offset);
	}

	writeUInt32BE(value: number, offset: number): void {
		writeUInt32BE(this.buffer, value, offset);
	}

	readUInt32LE(offset: number): number {
		return readUInt32LE(this.buffer, offset);
	}

	writeUInt32LE(value: number, offset: number): void {
		writeUInt32LE(this.buffer, value, offset);
	}

	readUInt8(offset: number): number {
		return readUInt8(this.buffer, offset);
	}

	writeUInt8(value: number, offset: number): void {
		writeUInt8(this.buffer, value, offset);
	}

	indexOf(subarray: VSBuffer | Uint8Array, offset = 0) {
		return binaryIndexOf(this.buffer, subarray instanceof VSBuffer ? subarray.buffer : subarray, offset);
	}

	equals(other: VSBuffer): boolean {
		if (this === other) {
			return true;
		}

		if (this.byteLength !== other.byteLength) {
			return false;
		}

		return this.buffer.every((value, index) => value === other.buffer[index]);
	}
}

/**
 * Like String.indexOf, but works on Uint8Arrays.
 * Uses the boyer-moore-horspool algorithm to be reasonably speedy.
 */
export function binaryIndexOf(haystack: Uint8Array, needle: Uint8Array, offset = 0): number {
	const needleLen = needle.byteLength;
	const haystackLen = haystack.byteLength;

	if (needleLen === 0) {
		return 0;
	}

	if (needleLen === 1) {
		return haystack.indexOf(needle[0]);
	}

	if (needleLen > haystackLen - offset) {
		return -1;
	}

	// find index of the subarray using boyer-moore-horspool algorithm
	const table = indexOfTable.value;
	table.fill(needle.length);
	for (let i = 0; i < needle.length; i++) {
		table[needle[i]] = needle.length - i - 1;
	}

	let i = offset + needle.length - 1;
	let j = i;
	let result = -1;
	while (i < haystackLen) {
		if (haystack[i] === needle[j]) {
			if (j === 0) {
				result = i;
				break;
			}

			i--;
			j--;
		} else {
			i += Math.max(needle.length - j, table[haystack[i]]);
			j = needle.length - 1;
		}
	}

	return result;
}

export function readUInt16LE(source: Uint8Array, offset: number): number {
	return (
		((source[offset + 0] << 0) >>> 0) |
		((source[offset + 1] << 8) >>> 0)
	);
}

export function writeUInt16LE(destination: Uint8Array, value: number, offset: number): void {
	destination[offset + 0] = (value & 0b11111111);
	value = value >>> 8;
	destination[offset + 1] = (value & 0b11111111);
}

export function readUInt32BE(source: Uint8Array, offset: number): number {
	return (
		source[offset] * 2 ** 24
		+ source[offset + 1] * 2 ** 16
		+ source[offset + 2] * 2 ** 8
		+ source[offset + 3]
	);
}

export function writeUInt32BE(destination: Uint8Array, value: number, offset: number): void {
	destination[offset + 3] = value;
	value = value >>> 8;
	destination[offset + 2] = value;
	value = value >>> 8;
	destination[offset + 1] = value;
	value = value >>> 8;
	destination[offset] = value;
}

export function readUInt32LE(source: Uint8Array, offset: number): number {
	return (
		((source[offset + 0] << 0) >>> 0) |
		((source[offset + 1] << 8) >>> 0) |
		((source[offset + 2] << 16) >>> 0) |
		((source[offset + 3] << 24) >>> 0)
	);
}

export function writeUInt32LE(destination: Uint8Array, value: number, offset: number): void {
	destination[offset + 0] = (value & 0b11111111);
	value = value >>> 8;
	destination[offset + 1] = (value & 0b11111111);
	value = value >>> 8;
	destination[offset + 2] = (value & 0b11111111);
	value = value >>> 8;
	destination[offset + 3] = (value & 0b11111111);
}

export function readUInt8(source: Uint8Array, offset: number): number {
	return source[offset];
}

export function writeUInt8(destination: Uint8Array, value: number, offset: number): void {
	destination[offset] = value;
}

export interface VSBufferReadable extends streams.Readable<VSBuffer> { }

export interface VSBufferReadableStream extends streams.ReadableStream<VSBuffer> { }

export interface VSBufferWriteableStream extends streams.WriteableStream<VSBuffer> { }

export interface VSBufferReadableBufferedStream extends streams.ReadableBufferedStream<VSBuffer> { }

export function readableToBuffer(readable: VSBufferReadable): VSBuffer {
	return streams.consumeReadable<VSBuffer>(readable, chunks => VSBuffer.concat(chunks));
}

export function bufferToReadable(buffer: VSBuffer): VSBufferReadable {
	return streams.toReadable<VSBuffer>(buffer);
}

export function streamToBuffer(stream: streams.ReadableStream<VSBuffer>): Promise<VSBuffer> {
	return streams.consumeStream<VSBuffer>(stream, chunks => VSBuffer.concat(chunks));
}

export async function bufferedStreamToBuffer(bufferedStream: streams.ReadableBufferedStream<VSBuffer>): Promise<VSBuffer> {
	if (bufferedStream.ended) {
		return VSBuffer.concat(bufferedStream.buffer);
	}

	return VSBuffer.concat([

		// Include already read chunks...
		...bufferedStream.buffer,

		// ...and all additional chunks
		await streamToBuffer(bufferedStream.stream)
	]);
}

export function bufferToStream(buffer: VSBuffer): streams.ReadableStream<VSBuffer> {
	return streams.toStream<VSBuffer>(buffer, chunks => VSBuffer.concat(chunks));
}

export function streamToBufferReadableStream(stream: streams.ReadableStreamEvents<Uint8Array | string>): streams.ReadableStream<VSBuffer> {
	return streams.transform<Uint8Array | string, VSBuffer>(stream, { data: data => typeof data === 'string' ? VSBuffer.fromString(data) : VSBuffer.wrap(data) }, chunks => VSBuffer.concat(chunks));
}

export function newWriteableBufferStream(options?: streams.WriteableStreamOptions): streams.WriteableStream<VSBuffer> {
	return streams.newWriteableStream<VSBuffer>(chunks => VSBuffer.concat(chunks), options);
}

export function prefixedBufferReadable(prefix: VSBuffer, readable: VSBufferReadable): VSBufferReadable {
	return streams.prefixedReadable(prefix, readable, chunks => VSBuffer.concat(chunks));
}

export function prefixedBufferStream(prefix: VSBuffer, stream: VSBufferReadableStream): VSBufferReadableStream {
	return streams.prefixedStream(prefix, stream, chunks => VSBuffer.concat(chunks));
}

/** Decodes base64 to a uint8 array. URL-encoded and unpadded base64 is allowed. */
export function decodeBase64(encoded: string) {
	let building = 0;
	let remainder = 0;
	let bufi = 0;

	// The simpler way to do this is `Uint8Array.from(atob(str), c => c.charCodeAt(0))`,
	// but that's about 10-20x slower than this function in current Chromium versions.

	const buffer = new Uint8Array(Math.floor(encoded.length / 4 * 3));
	const append = (value: number) => {
		switch (remainder) {
			case 3:
				buffer[bufi++] = building | value;
				remainder = 0;
				break;
			case 2:
				buffer[bufi++] = building | (value >>> 2);
				building = value << 6;
				remainder = 3;
				break;
			case 1:
				buffer[bufi++] = building | (value >>> 4);
				building = value << 4;
				remainder = 2;
				break;
			default:
				building = value << 2;
				remainder = 1;
		}
	};

	for (let i = 0; i < encoded.length; i++) {
		const code = encoded.charCodeAt(i);
		// See https://datatracker.ietf.org/doc/html/rfc4648#section-4
		// This branchy code is about 3x faster than an indexOf on a base64 char string.
		if (code >= 65 && code <= 90) {
			append(code - 65); // A-Z starts ranges from char code 65 to 90
		} else if (code >= 97 && code <= 122) {
			append(code - 97 + 26); // a-z starts ranges from char code 97 to 122, starting at byte 26
		} else if (code >= 48 && code <= 57) {
			append(code - 48 + 52); // 0-9 starts ranges from char code 48 to 58, starting at byte 52
		} else if (code === 43 || code === 45) {
			append(62); // "+" or "-" for URLS
		} else if (code === 47 || code === 95) {
			append(63); // "/" or "_" for URLS
		} else if (code === 61) {
			break; // "="
		} else {
			throw new SyntaxError(`Unexpected base64 character ${encoded[i]}`);
		}
	}

	const unpadded = bufi;
	while (remainder > 0) {
		append(0);
	}

	// slice is needed to account for overestimation due to padding
	return VSBuffer.wrap(buffer).slice(0, unpadded);
}

const base64Alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const base64UrlSafeAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

/** Encodes a buffer to a base64 string. */
export function encodeBase64({ buffer }: VSBuffer, padded = true, urlSafe = false) {
	const dictionary = urlSafe ? base64UrlSafeAlphabet : base64Alphabet;
	let output = '';

	const remainder = buffer.byteLength % 3;

	let i = 0;
	for (; i < buffer.byteLength - remainder; i += 3) {
		const a = buffer[i + 0];
		const b = buffer[i + 1];
		const c = buffer[i + 2];

		output += dictionary[a >>> 2];
		output += dictionary[(a << 4 | b >>> 4) & 0b111111];
		output += dictionary[(b << 2 | c >>> 6) & 0b111111];
		output += dictionary[c & 0b111111];
	}

	if (remainder === 1) {
		const a = buffer[i + 0];
		output += dictionary[a >>> 2];
		output += dictionary[(a << 4) & 0b111111];
		if (padded) { output += '=='; }
	} else if (remainder === 2) {
		const a = buffer[i + 0];
		const b = buffer[i + 1];
		output += dictionary[a >>> 2];
		output += dictionary[(a << 4 | b >>> 4) & 0b111111];
		output += dictionary[(b << 2) & 0b111111];
		if (padded) { output += '='; }
	}

	return output;
}

const hexChars = '0123456789abcdef';
export function encodeHex({ buffer }: VSBuffer): string {
	let result = '';
	for (let i = 0; i < buffer.length; i++) {
		const byte = buffer[i];
		result += hexChars[byte >>> 4];
		result += hexChars[byte & 0x0f];
	}
	return result;
}

export function decodeHex(hex: string): VSBuffer {
	if (hex.length % 2 !== 0) {
		throw new SyntaxError('Hex string must have an even length');
	}
	const out = new Uint8Array(hex.length >> 1);
	for (let i = 0; i < hex.length;) {
		out[i >> 1] = (decodeHexChar(hex, i++) << 4) | decodeHexChar(hex, i++);
	}
	return VSBuffer.wrap(out);
}

function decodeHexChar(str: string, position: number) {
	const s = str.charCodeAt(position);
	if (s >= 48 && s <= 57) { // '0'-'9'
		return s - 48;
	} else if (s >= 97 && s <= 102) { // 'a'-'f'
		return s - 87;
	} else if (s >= 65 && s <= 70) { // 'A'-'F'
		return s - 55;
	} else {
		throw new SyntaxError(`Invalid hex character at position ${position}`);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/cache.ts]---
Location: vscode-main/src/vs/base/common/cache.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken, CancellationTokenSource } from './cancellation.js';
import { IDisposable } from './lifecycle.js';

export interface CacheResult<T> extends IDisposable {
	promise: Promise<T>;
}

export class Cache<T> {

	private result: CacheResult<T> | null = null;
	constructor(private task: (ct: CancellationToken) => Promise<T>) { }

	get(): CacheResult<T> {
		if (this.result) {
			return this.result;
		}

		const cts = new CancellationTokenSource();
		const promise = this.task(cts.token);

		this.result = {
			promise,
			dispose: () => {
				this.result = null;
				cts.cancel();
				cts.dispose();
			}
		};

		return this.result;
	}
}

export function identity<T>(t: T): T {
	return t;
}

interface ICacheOptions<TArg> {
	/**
	 * The cache key is used to identify the cache entry.
	 * Strict equality is used to compare cache keys.
	*/
	getCacheKey: (arg: TArg) => unknown;
}

/**
 * Uses a LRU cache to make a given parametrized function cached.
 * Caches just the last key/value.
*/
export class LRUCachedFunction<TArg, TComputed> {
	private lastCache: TComputed | undefined = undefined;
	private lastArgKey: unknown | undefined = undefined;

	private readonly _fn: (arg: TArg) => TComputed;
	private readonly _computeKey: (arg: TArg) => unknown;

	constructor(fn: (arg: TArg) => TComputed);
	constructor(options: ICacheOptions<TArg>, fn: (arg: TArg) => TComputed);
	constructor(arg1: ICacheOptions<TArg> | ((arg: TArg) => TComputed), arg2?: (arg: TArg) => TComputed) {
		if (typeof arg1 === 'function') {
			this._fn = arg1;
			this._computeKey = identity;
		} else {
			this._fn = arg2!;
			this._computeKey = arg1.getCacheKey;
		}
	}

	public get(arg: TArg): TComputed {
		const key = this._computeKey(arg);
		if (this.lastArgKey !== key) {
			this.lastArgKey = key;
			this.lastCache = this._fn(arg);
		}
		return this.lastCache!;
	}
}

/**
 * Uses an unbounded cache to memoize the results of the given function.
*/
export class CachedFunction<TArg, TComputed> {
	private readonly _map = new Map<TArg, TComputed>();
	private readonly _map2 = new Map<unknown, TComputed>();
	public get cachedValues(): ReadonlyMap<TArg, TComputed> {
		return this._map;
	}

	private readonly _fn: (arg: TArg) => TComputed;
	private readonly _computeKey: (arg: TArg) => unknown;

	constructor(fn: (arg: TArg) => TComputed);
	constructor(options: ICacheOptions<TArg>, fn: (arg: TArg) => TComputed);
	constructor(arg1: ICacheOptions<TArg> | ((arg: TArg) => TComputed), arg2?: (arg: TArg) => TComputed) {
		if (typeof arg1 === 'function') {
			this._fn = arg1;
			this._computeKey = identity;
		} else {
			this._fn = arg2!;
			this._computeKey = arg1.getCacheKey;
		}
	}

	public get(arg: TArg): TComputed {
		const key = this._computeKey(arg);
		if (this._map2.has(key)) {
			return this._map2.get(key)!;
		}

		const value = this._fn(arg);
		this._map.set(arg, value);
		this._map2.set(key, value);
		return value;
	}
}

/**
 * Uses an unbounded cache to memoize the results of the given function.
*/
export class WeakCachedFunction<TArg, TComputed> {
	private readonly _map = new WeakMap<WeakKey, TComputed>();

	private readonly _fn: (arg: TArg) => TComputed;
	private readonly _computeKey: (arg: TArg) => unknown;

	constructor(fn: (arg: TArg) => TComputed);
	constructor(options: ICacheOptions<TArg>, fn: (arg: TArg) => TComputed);
	constructor(arg1: ICacheOptions<TArg> | ((arg: TArg) => TComputed), arg2?: (arg: TArg) => TComputed) {
		if (typeof arg1 === 'function') {
			this._fn = arg1;
			this._computeKey = identity;
		} else {
			this._fn = arg2!;
			this._computeKey = arg1.getCacheKey;
		}
	}

	public get(arg: TArg): TComputed {
		const key = this._computeKey(arg) as WeakKey;
		if (this._map.has(key)) {
			return this._map.get(key)!;
		}

		const value = this._fn(arg);
		this._map.set(key, value);
		return value;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/cancellation.ts]---
Location: vscode-main/src/vs/base/common/cancellation.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from './event.js';
import { DisposableStore, IDisposable } from './lifecycle.js';

export interface CancellationToken {

	/**
	 * A flag signalling is cancellation has been requested.
	 */
	readonly isCancellationRequested: boolean;

	/**
	 * An event which fires when cancellation is requested. This event
	 * only ever fires `once` as cancellation can only happen once. Listeners
	 * that are registered after cancellation will be called (next event loop run),
	 * but also only once.
	 *
	 * @event
	 */
	readonly onCancellationRequested: (listener: (e: void) => unknown, thisArgs?: unknown, disposables?: IDisposable[]) => IDisposable;
}

const shortcutEvent: Event<void> = Object.freeze(function (callback, context?): IDisposable {
	const handle = setTimeout(callback.bind(context), 0);
	return { dispose() { clearTimeout(handle); } };
});

export namespace CancellationToken {

	export function isCancellationToken(thing: unknown): thing is CancellationToken {
		if (thing === CancellationToken.None || thing === CancellationToken.Cancelled) {
			return true;
		}
		if (thing instanceof MutableToken) {
			return true;
		}
		if (!thing || typeof thing !== 'object') {
			return false;
		}
		return typeof (thing as CancellationToken).isCancellationRequested === 'boolean'
			&& typeof (thing as CancellationToken).onCancellationRequested === 'function';
	}


	export const None = Object.freeze<CancellationToken>({
		isCancellationRequested: false,
		onCancellationRequested: Event.None
	});

	export const Cancelled = Object.freeze<CancellationToken>({
		isCancellationRequested: true,
		onCancellationRequested: shortcutEvent
	});
}

class MutableToken implements CancellationToken {

	private _isCancelled: boolean = false;
	private _emitter: Emitter<void> | null = null;

	public cancel() {
		if (!this._isCancelled) {
			this._isCancelled = true;
			if (this._emitter) {
				this._emitter.fire(undefined);
				this.dispose();
			}
		}
	}

	get isCancellationRequested(): boolean {
		return this._isCancelled;
	}

	get onCancellationRequested(): Event<void> {
		if (this._isCancelled) {
			return shortcutEvent;
		}
		if (!this._emitter) {
			this._emitter = new Emitter<void>();
		}
		return this._emitter.event;
	}

	public dispose(): void {
		if (this._emitter) {
			this._emitter.dispose();
			this._emitter = null;
		}
	}
}

export class CancellationTokenSource {

	private _token?: CancellationToken = undefined;
	private _parentListener?: IDisposable = undefined;

	constructor(parent?: CancellationToken) {
		this._parentListener = parent && parent.onCancellationRequested(this.cancel, this);
	}

	get token(): CancellationToken {
		if (!this._token) {
			// be lazy and create the token only when
			// actually needed
			this._token = new MutableToken();
		}
		return this._token;
	}

	cancel(): void {
		if (!this._token) {
			// save an object by returning the default
			// cancelled token when cancellation happens
			// before someone asks for the token
			this._token = CancellationToken.Cancelled;

		} else if (this._token instanceof MutableToken) {
			// actually cancel
			this._token.cancel();
		}
	}

	dispose(cancel: boolean = false): void {
		if (cancel) {
			this.cancel();
		}
		this._parentListener?.dispose();
		if (!this._token) {
			// ensure to initialize with an empty token if we had none
			this._token = CancellationToken.None;

		} else if (this._token instanceof MutableToken) {
			// actually dispose
			this._token.dispose();
		}
	}
}

export function cancelOnDispose(store: DisposableStore): CancellationToken {
	const source = new CancellationTokenSource();
	store.add({ dispose() { source.cancel(); } });
	return source.token;
}

/**
 * A pool that aggregates multiple cancellation tokens. The pool's own token
 * (accessible via `pool.token`) is cancelled only after every token added
 * to the pool has been cancelled. Adding tokens after the pool token has
 * been cancelled has no effect.
 */
export class CancellationTokenPool {

	private readonly _source = new CancellationTokenSource();
	private readonly _listeners = new DisposableStore();

	private _total: number = 0;
	private _cancelled: number = 0;
	private _isDone: boolean = false;

	get token(): CancellationToken {
		return this._source.token;
	}

	/**
	 * Add a token to the pool. If the token is already cancelled it is counted
	 * immediately. Tokens added after the pool token has been cancelled are ignored.
	 */
	add(token: CancellationToken): void {
		if (this._isDone) {
			return;
		}

		this._total++;

		if (token.isCancellationRequested) {
			this._cancelled++;
			this._check();
			return;
		}

		const d = token.onCancellationRequested(() => {
			d.dispose();
			this._cancelled++;
			this._check();
		});
		this._listeners.add(d);
	}

	private _check(): void {
		if (!this._isDone && this._total > 0 && this._total === this._cancelled) {
			this._isDone = true;
			this._listeners.dispose();
			this._source.cancel();
		}
	}

	dispose(): void {
		this._listeners.dispose();
		this._source.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/charCode.ts]---
Location: vscode-main/src/vs/base/common/charCode.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// Names from https://blog.codinghorror.com/ascii-pronunciation-rules-for-programmers/

/**
 * An inlined enum containing useful character codes (to be used with String.charCodeAt).
 * Please leave the const keyword such that it gets inlined when compiled to JavaScript!
 */
export const enum CharCode {
	Null = 0,
	/**
	 * The `\b` character.
	 */
	Backspace = 8,
	/**
	 * The `\t` character.
	 */
	Tab = 9,
	/**
	 * The `\n` character.
	 */
	LineFeed = 10,
	/**
	 * The `\r` character.
	 */
	CarriageReturn = 13,
	Space = 32,
	/**
	 * The `!` character.
	 */
	ExclamationMark = 33,
	/**
	 * The `"` character.
	 */
	DoubleQuote = 34,
	/**
	 * The `#` character.
	 */
	Hash = 35,
	/**
	 * The `$` character.
	 */
	DollarSign = 36,
	/**
	 * The `%` character.
	 */
	PercentSign = 37,
	/**
	 * The `&` character.
	 */
	Ampersand = 38,
	/**
	 * The `'` character.
	 */
	SingleQuote = 39,
	/**
	 * The `(` character.
	 */
	OpenParen = 40,
	/**
	 * The `)` character.
	 */
	CloseParen = 41,
	/**
	 * The `*` character.
	 */
	Asterisk = 42,
	/**
	 * The `+` character.
	 */
	Plus = 43,
	/**
	 * The `,` character.
	 */
	Comma = 44,
	/**
	 * The `-` character.
	 */
	Dash = 45,
	/**
	 * The `.` character.
	 */
	Period = 46,
	/**
	 * The `/` character.
	 */
	Slash = 47,

	Digit0 = 48,
	Digit1 = 49,
	Digit2 = 50,
	Digit3 = 51,
	Digit4 = 52,
	Digit5 = 53,
	Digit6 = 54,
	Digit7 = 55,
	Digit8 = 56,
	Digit9 = 57,

	/**
	 * The `:` character.
	 */
	Colon = 58,
	/**
	 * The `;` character.
	 */
	Semicolon = 59,
	/**
	 * The `<` character.
	 */
	LessThan = 60,
	/**
	 * The `=` character.
	 */
	Equals = 61,
	/**
	 * The `>` character.
	 */
	GreaterThan = 62,
	/**
	 * The `?` character.
	 */
	QuestionMark = 63,
	/**
	 * The `@` character.
	 */
	AtSign = 64,

	A = 65,
	B = 66,
	C = 67,
	D = 68,
	E = 69,
	F = 70,
	G = 71,
	H = 72,
	I = 73,
	J = 74,
	K = 75,
	L = 76,
	M = 77,
	N = 78,
	O = 79,
	P = 80,
	Q = 81,
	R = 82,
	S = 83,
	T = 84,
	U = 85,
	V = 86,
	W = 87,
	X = 88,
	Y = 89,
	Z = 90,

	/**
	 * The `[` character.
	 */
	OpenSquareBracket = 91,
	/**
	 * The `\` character.
	 */
	Backslash = 92,
	/**
	 * The `]` character.
	 */
	CloseSquareBracket = 93,
	/**
	 * The `^` character.
	 */
	Caret = 94,
	/**
	 * The `_` character.
	 */
	Underline = 95,
	/**
	 * The ``(`)`` character.
	 */
	BackTick = 96,

	a = 97,
	b = 98,
	c = 99,
	d = 100,
	e = 101,
	f = 102,
	g = 103,
	h = 104,
	i = 105,
	j = 106,
	k = 107,
	l = 108,
	m = 109,
	n = 110,
	o = 111,
	p = 112,
	q = 113,
	r = 114,
	s = 115,
	t = 116,
	u = 117,
	v = 118,
	w = 119,
	x = 120,
	y = 121,
	z = 122,

	/**
	 * The `{` character.
	 */
	OpenCurlyBrace = 123,
	/**
	 * The `|` character.
	 */
	Pipe = 124,
	/**
	 * The `}` character.
	 */
	CloseCurlyBrace = 125,
	/**
	 * The `~` character.
	 */
	Tilde = 126,

	/**
	 * The &nbsp; (no-break space) character.
	 * Unicode Character 'NO-BREAK SPACE' (U+00A0)
	 */
	NoBreakSpace = 160,

	U_Combining_Grave_Accent = 0x0300,								//	U+0300	Combining Grave Accent
	U_Combining_Acute_Accent = 0x0301,								//	U+0301	Combining Acute Accent
	U_Combining_Circumflex_Accent = 0x0302,							//	U+0302	Combining Circumflex Accent
	U_Combining_Tilde = 0x0303,										//	U+0303	Combining Tilde
	U_Combining_Macron = 0x0304,									//	U+0304	Combining Macron
	U_Combining_Overline = 0x0305,									//	U+0305	Combining Overline
	U_Combining_Breve = 0x0306,										//	U+0306	Combining Breve
	U_Combining_Dot_Above = 0x0307,									//	U+0307	Combining Dot Above
	U_Combining_Diaeresis = 0x0308,									//	U+0308	Combining Diaeresis
	U_Combining_Hook_Above = 0x0309,								//	U+0309	Combining Hook Above
	U_Combining_Ring_Above = 0x030A,								//	U+030A	Combining Ring Above
	U_Combining_Double_Acute_Accent = 0x030B,						//	U+030B	Combining Double Acute Accent
	U_Combining_Caron = 0x030C,										//	U+030C	Combining Caron
	U_Combining_Vertical_Line_Above = 0x030D,						//	U+030D	Combining Vertical Line Above
	U_Combining_Double_Vertical_Line_Above = 0x030E,				//	U+030E	Combining Double Vertical Line Above
	U_Combining_Double_Grave_Accent = 0x030F,						//	U+030F	Combining Double Grave Accent
	U_Combining_Candrabindu = 0x0310,								//	U+0310	Combining Candrabindu
	U_Combining_Inverted_Breve = 0x0311,							//	U+0311	Combining Inverted Breve
	U_Combining_Turned_Comma_Above = 0x0312,						//	U+0312	Combining Turned Comma Above
	U_Combining_Comma_Above = 0x0313,								//	U+0313	Combining Comma Above
	U_Combining_Reversed_Comma_Above = 0x0314,						//	U+0314	Combining Reversed Comma Above
	U_Combining_Comma_Above_Right = 0x0315,							//	U+0315	Combining Comma Above Right
	U_Combining_Grave_Accent_Below = 0x0316,						//	U+0316	Combining Grave Accent Below
	U_Combining_Acute_Accent_Below = 0x0317,						//	U+0317	Combining Acute Accent Below
	U_Combining_Left_Tack_Below = 0x0318,							//	U+0318	Combining Left Tack Below
	U_Combining_Right_Tack_Below = 0x0319,							//	U+0319	Combining Right Tack Below
	U_Combining_Left_Angle_Above = 0x031A,							//	U+031A	Combining Left Angle Above
	U_Combining_Horn = 0x031B,										//	U+031B	Combining Horn
	U_Combining_Left_Half_Ring_Below = 0x031C,						//	U+031C	Combining Left Half Ring Below
	U_Combining_Up_Tack_Below = 0x031D,								//	U+031D	Combining Up Tack Below
	U_Combining_Down_Tack_Below = 0x031E,							//	U+031E	Combining Down Tack Below
	U_Combining_Plus_Sign_Below = 0x031F,							//	U+031F	Combining Plus Sign Below
	U_Combining_Minus_Sign_Below = 0x0320,							//	U+0320	Combining Minus Sign Below
	U_Combining_Palatalized_Hook_Below = 0x0321,					//	U+0321	Combining Palatalized Hook Below
	U_Combining_Retroflex_Hook_Below = 0x0322,						//	U+0322	Combining Retroflex Hook Below
	U_Combining_Dot_Below = 0x0323,									//	U+0323	Combining Dot Below
	U_Combining_Diaeresis_Below = 0x0324,							//	U+0324	Combining Diaeresis Below
	U_Combining_Ring_Below = 0x0325,								//	U+0325	Combining Ring Below
	U_Combining_Comma_Below = 0x0326,								//	U+0326	Combining Comma Below
	U_Combining_Cedilla = 0x0327,									//	U+0327	Combining Cedilla
	U_Combining_Ogonek = 0x0328,									//	U+0328	Combining Ogonek
	U_Combining_Vertical_Line_Below = 0x0329,						//	U+0329	Combining Vertical Line Below
	U_Combining_Bridge_Below = 0x032A,								//	U+032A	Combining Bridge Below
	U_Combining_Inverted_Double_Arch_Below = 0x032B,				//	U+032B	Combining Inverted Double Arch Below
	U_Combining_Caron_Below = 0x032C,								//	U+032C	Combining Caron Below
	U_Combining_Circumflex_Accent_Below = 0x032D,					//	U+032D	Combining Circumflex Accent Below
	U_Combining_Breve_Below = 0x032E,								//	U+032E	Combining Breve Below
	U_Combining_Inverted_Breve_Below = 0x032F,						//	U+032F	Combining Inverted Breve Below
	U_Combining_Tilde_Below = 0x0330,								//	U+0330	Combining Tilde Below
	U_Combining_Macron_Below = 0x0331,								//	U+0331	Combining Macron Below
	U_Combining_Low_Line = 0x0332,									//	U+0332	Combining Low Line
	U_Combining_Double_Low_Line = 0x0333,							//	U+0333	Combining Double Low Line
	U_Combining_Tilde_Overlay = 0x0334,								//	U+0334	Combining Tilde Overlay
	U_Combining_Short_Stroke_Overlay = 0x0335,						//	U+0335	Combining Short Stroke Overlay
	U_Combining_Long_Stroke_Overlay = 0x0336,						//	U+0336	Combining Long Stroke Overlay
	U_Combining_Short_Solidus_Overlay = 0x0337,						//	U+0337	Combining Short Solidus Overlay
	U_Combining_Long_Solidus_Overlay = 0x0338,						//	U+0338	Combining Long Solidus Overlay
	U_Combining_Right_Half_Ring_Below = 0x0339,						//	U+0339	Combining Right Half Ring Below
	U_Combining_Inverted_Bridge_Below = 0x033A,						//	U+033A	Combining Inverted Bridge Below
	U_Combining_Square_Below = 0x033B,								//	U+033B	Combining Square Below
	U_Combining_Seagull_Below = 0x033C,								//	U+033C	Combining Seagull Below
	U_Combining_X_Above = 0x033D,									//	U+033D	Combining X Above
	U_Combining_Vertical_Tilde = 0x033E,							//	U+033E	Combining Vertical Tilde
	U_Combining_Double_Overline = 0x033F,							//	U+033F	Combining Double Overline
	U_Combining_Grave_Tone_Mark = 0x0340,							//	U+0340	Combining Grave Tone Mark
	U_Combining_Acute_Tone_Mark = 0x0341,							//	U+0341	Combining Acute Tone Mark
	U_Combining_Greek_Perispomeni = 0x0342,							//	U+0342	Combining Greek Perispomeni
	U_Combining_Greek_Koronis = 0x0343,								//	U+0343	Combining Greek Koronis
	U_Combining_Greek_Dialytika_Tonos = 0x0344,						//	U+0344	Combining Greek Dialytika Tonos
	U_Combining_Greek_Ypogegrammeni = 0x0345,						//	U+0345	Combining Greek Ypogegrammeni
	U_Combining_Bridge_Above = 0x0346,								//	U+0346	Combining Bridge Above
	U_Combining_Equals_Sign_Below = 0x0347,							//	U+0347	Combining Equals Sign Below
	U_Combining_Double_Vertical_Line_Below = 0x0348,				//	U+0348	Combining Double Vertical Line Below
	U_Combining_Left_Angle_Below = 0x0349,							//	U+0349	Combining Left Angle Below
	U_Combining_Not_Tilde_Above = 0x034A,							//	U+034A	Combining Not Tilde Above
	U_Combining_Homothetic_Above = 0x034B,							//	U+034B	Combining Homothetic Above
	U_Combining_Almost_Equal_To_Above = 0x034C,						//	U+034C	Combining Almost Equal To Above
	U_Combining_Left_Right_Arrow_Below = 0x034D,					//	U+034D	Combining Left Right Arrow Below
	U_Combining_Upwards_Arrow_Below = 0x034E,						//	U+034E	Combining Upwards Arrow Below
	U_Combining_Grapheme_Joiner = 0x034F,							//	U+034F	Combining Grapheme Joiner
	U_Combining_Right_Arrowhead_Above = 0x0350,						//	U+0350	Combining Right Arrowhead Above
	U_Combining_Left_Half_Ring_Above = 0x0351,						//	U+0351	Combining Left Half Ring Above
	U_Combining_Fermata = 0x0352,									//	U+0352	Combining Fermata
	U_Combining_X_Below = 0x0353,									//	U+0353	Combining X Below
	U_Combining_Left_Arrowhead_Below = 0x0354,						//	U+0354	Combining Left Arrowhead Below
	U_Combining_Right_Arrowhead_Below = 0x0355,						//	U+0355	Combining Right Arrowhead Below
	U_Combining_Right_Arrowhead_And_Up_Arrowhead_Below = 0x0356,	//	U+0356	Combining Right Arrowhead And Up Arrowhead Below
	U_Combining_Right_Half_Ring_Above = 0x0357,						//	U+0357	Combining Right Half Ring Above
	U_Combining_Dot_Above_Right = 0x0358,							//	U+0358	Combining Dot Above Right
	U_Combining_Asterisk_Below = 0x0359,							//	U+0359	Combining Asterisk Below
	U_Combining_Double_Ring_Below = 0x035A,							//	U+035A	Combining Double Ring Below
	U_Combining_Zigzag_Above = 0x035B,								//	U+035B	Combining Zigzag Above
	U_Combining_Double_Breve_Below = 0x035C,						//	U+035C	Combining Double Breve Below
	U_Combining_Double_Breve = 0x035D,								//	U+035D	Combining Double Breve
	U_Combining_Double_Macron = 0x035E,								//	U+035E	Combining Double Macron
	U_Combining_Double_Macron_Below = 0x035F,						//	U+035F	Combining Double Macron Below
	U_Combining_Double_Tilde = 0x0360,								//	U+0360	Combining Double Tilde
	U_Combining_Double_Inverted_Breve = 0x0361,						//	U+0361	Combining Double Inverted Breve
	U_Combining_Double_Rightwards_Arrow_Below = 0x0362,				//	U+0362	Combining Double Rightwards Arrow Below
	U_Combining_Latin_Small_Letter_A = 0x0363, 						//	U+0363	Combining Latin Small Letter A
	U_Combining_Latin_Small_Letter_E = 0x0364, 						//	U+0364	Combining Latin Small Letter E
	U_Combining_Latin_Small_Letter_I = 0x0365, 						//	U+0365	Combining Latin Small Letter I
	U_Combining_Latin_Small_Letter_O = 0x0366, 						//	U+0366	Combining Latin Small Letter O
	U_Combining_Latin_Small_Letter_U = 0x0367, 						//	U+0367	Combining Latin Small Letter U
	U_Combining_Latin_Small_Letter_C = 0x0368, 						//	U+0368	Combining Latin Small Letter C
	U_Combining_Latin_Small_Letter_D = 0x0369, 						//	U+0369	Combining Latin Small Letter D
	U_Combining_Latin_Small_Letter_H = 0x036A, 						//	U+036A	Combining Latin Small Letter H
	U_Combining_Latin_Small_Letter_M = 0x036B, 						//	U+036B	Combining Latin Small Letter M
	U_Combining_Latin_Small_Letter_R = 0x036C, 						//	U+036C	Combining Latin Small Letter R
	U_Combining_Latin_Small_Letter_T = 0x036D, 						//	U+036D	Combining Latin Small Letter T
	U_Combining_Latin_Small_Letter_V = 0x036E, 						//	U+036E	Combining Latin Small Letter V
	U_Combining_Latin_Small_Letter_X = 0x036F, 						//	U+036F	Combining Latin Small Letter X

	/**
	 * Unicode Character 'LINE SEPARATOR' (U+2028)
	 * http://www.fileformat.info/info/unicode/char/2028/index.htm
	 */
	LINE_SEPARATOR = 0x2028,
	/**
	 * Unicode Character 'PARAGRAPH SEPARATOR' (U+2029)
	 * http://www.fileformat.info/info/unicode/char/2029/index.htm
	 */
	PARAGRAPH_SEPARATOR = 0x2029,
	/**
	 * Unicode Character 'NEXT LINE' (U+0085)
	 * http://www.fileformat.info/info/unicode/char/0085/index.htm
	 */
	NEXT_LINE = 0x0085,

	// http://www.fileformat.info/info/unicode/category/Sk/list.htm
	U_CIRCUMFLEX = 0x005E,									// U+005E	CIRCUMFLEX
	U_GRAVE_ACCENT = 0x0060,								// U+0060	GRAVE ACCENT
	U_DIAERESIS = 0x00A8,									// U+00A8	DIAERESIS
	U_MACRON = 0x00AF,										// U+00AF	MACRON
	U_ACUTE_ACCENT = 0x00B4,								// U+00B4	ACUTE ACCENT
	U_CEDILLA = 0x00B8,										// U+00B8	CEDILLA
	U_MODIFIER_LETTER_LEFT_ARROWHEAD = 0x02C2,				// U+02C2	MODIFIER LETTER LEFT ARROWHEAD
	U_MODIFIER_LETTER_RIGHT_ARROWHEAD = 0x02C3,				// U+02C3	MODIFIER LETTER RIGHT ARROWHEAD
	U_MODIFIER_LETTER_UP_ARROWHEAD = 0x02C4,				// U+02C4	MODIFIER LETTER UP ARROWHEAD
	U_MODIFIER_LETTER_DOWN_ARROWHEAD = 0x02C5,				// U+02C5	MODIFIER LETTER DOWN ARROWHEAD
	U_MODIFIER_LETTER_CENTRED_RIGHT_HALF_RING = 0x02D2,		// U+02D2	MODIFIER LETTER CENTRED RIGHT HALF RING
	U_MODIFIER_LETTER_CENTRED_LEFT_HALF_RING = 0x02D3,		// U+02D3	MODIFIER LETTER CENTRED LEFT HALF RING
	U_MODIFIER_LETTER_UP_TACK = 0x02D4,						// U+02D4	MODIFIER LETTER UP TACK
	U_MODIFIER_LETTER_DOWN_TACK = 0x02D5,					// U+02D5	MODIFIER LETTER DOWN TACK
	U_MODIFIER_LETTER_PLUS_SIGN = 0x02D6,					// U+02D6	MODIFIER LETTER PLUS SIGN
	U_MODIFIER_LETTER_MINUS_SIGN = 0x02D7,					// U+02D7	MODIFIER LETTER MINUS SIGN
	U_BREVE = 0x02D8,										// U+02D8	BREVE
	U_DOT_ABOVE = 0x02D9,									// U+02D9	DOT ABOVE
	U_RING_ABOVE = 0x02DA,									// U+02DA	RING ABOVE
	U_OGONEK = 0x02DB,										// U+02DB	OGONEK
	U_SMALL_TILDE = 0x02DC,									// U+02DC	SMALL TILDE
	U_DOUBLE_ACUTE_ACCENT = 0x02DD,							// U+02DD	DOUBLE ACUTE ACCENT
	U_MODIFIER_LETTER_RHOTIC_HOOK = 0x02DE,					// U+02DE	MODIFIER LETTER RHOTIC HOOK
	U_MODIFIER_LETTER_CROSS_ACCENT = 0x02DF,				// U+02DF	MODIFIER LETTER CROSS ACCENT
	U_MODIFIER_LETTER_EXTRA_HIGH_TONE_BAR = 0x02E5,			// U+02E5	MODIFIER LETTER EXTRA-HIGH TONE BAR
	U_MODIFIER_LETTER_HIGH_TONE_BAR = 0x02E6,				// U+02E6	MODIFIER LETTER HIGH TONE BAR
	U_MODIFIER_LETTER_MID_TONE_BAR = 0x02E7,				// U+02E7	MODIFIER LETTER MID TONE BAR
	U_MODIFIER_LETTER_LOW_TONE_BAR = 0x02E8,				// U+02E8	MODIFIER LETTER LOW TONE BAR
	U_MODIFIER_LETTER_EXTRA_LOW_TONE_BAR = 0x02E9,			// U+02E9	MODIFIER LETTER EXTRA-LOW TONE BAR
	U_MODIFIER_LETTER_YIN_DEPARTING_TONE_MARK = 0x02EA,		// U+02EA	MODIFIER LETTER YIN DEPARTING TONE MARK
	U_MODIFIER_LETTER_YANG_DEPARTING_TONE_MARK = 0x02EB,	// U+02EB	MODIFIER LETTER YANG DEPARTING TONE MARK
	U_MODIFIER_LETTER_UNASPIRATED = 0x02ED,					// U+02ED	MODIFIER LETTER UNASPIRATED
	U_MODIFIER_LETTER_LOW_DOWN_ARROWHEAD = 0x02EF,			// U+02EF	MODIFIER LETTER LOW DOWN ARROWHEAD
	U_MODIFIER_LETTER_LOW_UP_ARROWHEAD = 0x02F0,			// U+02F0	MODIFIER LETTER LOW UP ARROWHEAD
	U_MODIFIER_LETTER_LOW_LEFT_ARROWHEAD = 0x02F1,			// U+02F1	MODIFIER LETTER LOW LEFT ARROWHEAD
	U_MODIFIER_LETTER_LOW_RIGHT_ARROWHEAD = 0x02F2,			// U+02F2	MODIFIER LETTER LOW RIGHT ARROWHEAD
	U_MODIFIER_LETTER_LOW_RING = 0x02F3,					// U+02F3	MODIFIER LETTER LOW RING
	U_MODIFIER_LETTER_MIDDLE_GRAVE_ACCENT = 0x02F4,			// U+02F4	MODIFIER LETTER MIDDLE GRAVE ACCENT
	U_MODIFIER_LETTER_MIDDLE_DOUBLE_GRAVE_ACCENT = 0x02F5,	// U+02F5	MODIFIER LETTER MIDDLE DOUBLE GRAVE ACCENT
	U_MODIFIER_LETTER_MIDDLE_DOUBLE_ACUTE_ACCENT = 0x02F6,	// U+02F6	MODIFIER LETTER MIDDLE DOUBLE ACUTE ACCENT
	U_MODIFIER_LETTER_LOW_TILDE = 0x02F7,					// U+02F7	MODIFIER LETTER LOW TILDE
	U_MODIFIER_LETTER_RAISED_COLON = 0x02F8,				// U+02F8	MODIFIER LETTER RAISED COLON
	U_MODIFIER_LETTER_BEGIN_HIGH_TONE = 0x02F9,				// U+02F9	MODIFIER LETTER BEGIN HIGH TONE
	U_MODIFIER_LETTER_END_HIGH_TONE = 0x02FA,				// U+02FA	MODIFIER LETTER END HIGH TONE
	U_MODIFIER_LETTER_BEGIN_LOW_TONE = 0x02FB,				// U+02FB	MODIFIER LETTER BEGIN LOW TONE
	U_MODIFIER_LETTER_END_LOW_TONE = 0x02FC,				// U+02FC	MODIFIER LETTER END LOW TONE
	U_MODIFIER_LETTER_SHELF = 0x02FD,						// U+02FD	MODIFIER LETTER SHELF
	U_MODIFIER_LETTER_OPEN_SHELF = 0x02FE,					// U+02FE	MODIFIER LETTER OPEN SHELF
	U_MODIFIER_LETTER_LOW_LEFT_ARROW = 0x02FF,				// U+02FF	MODIFIER LETTER LOW LEFT ARROW
	U_GREEK_LOWER_NUMERAL_SIGN = 0x0375,					// U+0375	GREEK LOWER NUMERAL SIGN
	U_GREEK_TONOS = 0x0384,									// U+0384	GREEK TONOS
	U_GREEK_DIALYTIKA_TONOS = 0x0385,						// U+0385	GREEK DIALYTIKA TONOS
	U_GREEK_KORONIS = 0x1FBD,								// U+1FBD	GREEK KORONIS
	U_GREEK_PSILI = 0x1FBF,									// U+1FBF	GREEK PSILI
	U_GREEK_PERISPOMENI = 0x1FC0,							// U+1FC0	GREEK PERISPOMENI
	U_GREEK_DIALYTIKA_AND_PERISPOMENI = 0x1FC1,				// U+1FC1	GREEK DIALYTIKA AND PERISPOMENI
	U_GREEK_PSILI_AND_VARIA = 0x1FCD,						// U+1FCD	GREEK PSILI AND VARIA
	U_GREEK_PSILI_AND_OXIA = 0x1FCE,						// U+1FCE	GREEK PSILI AND OXIA
	U_GREEK_PSILI_AND_PERISPOMENI = 0x1FCF,					// U+1FCF	GREEK PSILI AND PERISPOMENI
	U_GREEK_DASIA_AND_VARIA = 0x1FDD,						// U+1FDD	GREEK DASIA AND VARIA
	U_GREEK_DASIA_AND_OXIA = 0x1FDE,						// U+1FDE	GREEK DASIA AND OXIA
	U_GREEK_DASIA_AND_PERISPOMENI = 0x1FDF,					// U+1FDF	GREEK DASIA AND PERISPOMENI
	U_GREEK_DIALYTIKA_AND_VARIA = 0x1FED,					// U+1FED	GREEK DIALYTIKA AND VARIA
	U_GREEK_DIALYTIKA_AND_OXIA = 0x1FEE,					// U+1FEE	GREEK DIALYTIKA AND OXIA
	U_GREEK_VARIA = 0x1FEF,									// U+1FEF	GREEK VARIA
	U_GREEK_OXIA = 0x1FFD,									// U+1FFD	GREEK OXIA
	U_GREEK_DASIA = 0x1FFE,									// U+1FFE	GREEK DASIA

	U_IDEOGRAPHIC_FULL_STOP = 0x3002,						// U+3002	IDEOGRAPHIC FULL STOP
	U_LEFT_CORNER_BRACKET = 0x300C,							// U+300C	LEFT CORNER BRACKET
	U_RIGHT_CORNER_BRACKET = 0x300D,						// U+300D	RIGHT CORNER BRACKET
	U_LEFT_BLACK_LENTICULAR_BRACKET = 0x3010,				// U+3010	LEFT BLACK LENTICULAR BRACKET
	U_RIGHT_BLACK_LENTICULAR_BRACKET = 0x3011,				// U+3011	RIGHT BLACK LENTICULAR BRACKET


	U_OVERLINE = 0x203E, // Unicode Character 'OVERLINE'

	/**
	 * UTF-8 BOM
	 * Unicode Character 'ZERO WIDTH NO-BREAK SPACE' (U+FEFF)
	 * http://www.fileformat.info/info/unicode/char/feff/index.htm
	 */
	UTF8_BOM = 65279,

	U_FULLWIDTH_SEMICOLON = 0xFF1B,							// U+FF1B	FULLWIDTH SEMICOLON
	U_FULLWIDTH_COMMA = 0xFF0C,								// U+FF0C	FULLWIDTH COMMA
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/codicons.ts]---
Location: vscode-main/src/vs/base/common/codicons.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { ThemeIcon } from './themables.js';
import { register } from './codiconsUtil.js';
import { codiconsLibrary } from './codiconsLibrary.js';


/**
 * Only to be used by the iconRegistry.
 */
export function getAllCodicons(): ThemeIcon[] {
	return Object.values(Codicon);
}

/**
 * Derived icons, that could become separate icons.
 * These mappings should be moved into the mapping file in the vscode-codicons repo at some point.
 */
export const codiconsDerived = {
	dialogError: register('dialog-error', 'error'),
	dialogWarning: register('dialog-warning', 'warning'),
	dialogInfo: register('dialog-info', 'info'),
	dialogClose: register('dialog-close', 'close'),
	treeItemExpanded: register('tree-item-expanded', 'chevron-down'), // collapsed is done with rotation
	treeFilterOnTypeOn: register('tree-filter-on-type-on', 'list-filter'),
	treeFilterOnTypeOff: register('tree-filter-on-type-off', 'list-selection'),
	treeFilterClear: register('tree-filter-clear', 'close'),
	treeItemLoading: register('tree-item-loading', 'loading'),
	menuSelection: register('menu-selection', 'check'),
	menuSubmenu: register('menu-submenu', 'chevron-right'),
	menuBarMore: register('menubar-more', 'more'),
	scrollbarButtonLeft: register('scrollbar-button-left', 'triangle-left'),
	scrollbarButtonRight: register('scrollbar-button-right', 'triangle-right'),
	scrollbarButtonUp: register('scrollbar-button-up', 'triangle-up'),
	scrollbarButtonDown: register('scrollbar-button-down', 'triangle-down'),
	toolBarMore: register('toolbar-more', 'more'),
	quickInputBack: register('quick-input-back', 'arrow-left'),
	dropDownButton: register('drop-down-button', 0xeab4),
	symbolCustomColor: register('symbol-customcolor', 0xeb5c),
	exportIcon: register('export', 0xebac),
	workspaceUnspecified: register('workspace-unspecified', 0xebc3),
	newLine: register('newline', 0xebea),
	thumbsDownFilled: register('thumbsdown-filled', 0xec13),
	thumbsUpFilled: register('thumbsup-filled', 0xec14),
	gitFetch: register('git-fetch', 0xec1d),
	lightbulbSparkleAutofix: register('lightbulb-sparkle-autofix', 0xec1f),
	debugBreakpointPending: register('debug-breakpoint-pending', 0xebd9),

} as const;

/**
 * The Codicon library is a set of default icons that are built-in in VS Code.
 *
 * In the product (outside of base) Codicons should only be used as defaults. In order to have all icons in VS Code
 * themeable, component should define new, UI component specific icons using `iconRegistry.registerIcon`.
 * In that call a Codicon can be named as default.
 */
export const Codicon = {
	...codiconsLibrary,
	...codiconsDerived

} as const;
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/codiconsLibrary.ts]---
Location: vscode-main/src/vs/base/common/codiconsLibrary.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { register } from './codiconsUtil.js';


// This file is automatically generated by (microsoft/vscode-codicons)/scripts/export-to-ts.js
// Please don't edit it, as your changes will be overwritten.
// Instead, add mappings to codiconsDerived in codicons.ts.
export const codiconsLibrary = {
	add: register('add', 0xea60),
	plus: register('plus', 0xea60),
	gistNew: register('gist-new', 0xea60),
	repoCreate: register('repo-create', 0xea60),
	lightbulb: register('lightbulb', 0xea61),
	lightBulb: register('light-bulb', 0xea61),
	repo: register('repo', 0xea62),
	repoDelete: register('repo-delete', 0xea62),
	gistFork: register('gist-fork', 0xea63),
	repoForked: register('repo-forked', 0xea63),
	gitPullRequest: register('git-pull-request', 0xea64),
	gitPullRequestAbandoned: register('git-pull-request-abandoned', 0xea64),
	recordKeys: register('record-keys', 0xea65),
	keyboard: register('keyboard', 0xea65),
	tag: register('tag', 0xea66),
	gitPullRequestLabel: register('git-pull-request-label', 0xea66),
	tagAdd: register('tag-add', 0xea66),
	tagRemove: register('tag-remove', 0xea66),
	person: register('person', 0xea67),
	personFollow: register('person-follow', 0xea67),
	personOutline: register('person-outline', 0xea67),
	personFilled: register('person-filled', 0xea67),
	sourceControl: register('source-control', 0xea68),
	mirror: register('mirror', 0xea69),
	mirrorPublic: register('mirror-public', 0xea69),
	star: register('star', 0xea6a),
	starAdd: register('star-add', 0xea6a),
	starDelete: register('star-delete', 0xea6a),
	starEmpty: register('star-empty', 0xea6a),
	comment: register('comment', 0xea6b),
	commentAdd: register('comment-add', 0xea6b),
	alert: register('alert', 0xea6c),
	warning: register('warning', 0xea6c),
	search: register('search', 0xea6d),
	searchSave: register('search-save', 0xea6d),
	logOut: register('log-out', 0xea6e),
	signOut: register('sign-out', 0xea6e),
	logIn: register('log-in', 0xea6f),
	signIn: register('sign-in', 0xea6f),
	eye: register('eye', 0xea70),
	eyeUnwatch: register('eye-unwatch', 0xea70),
	eyeWatch: register('eye-watch', 0xea70),
	circleFilled: register('circle-filled', 0xea71),
	primitiveDot: register('primitive-dot', 0xea71),
	closeDirty: register('close-dirty', 0xea71),
	debugBreakpoint: register('debug-breakpoint', 0xea71),
	debugBreakpointDisabled: register('debug-breakpoint-disabled', 0xea71),
	debugHint: register('debug-hint', 0xea71),
	terminalDecorationSuccess: register('terminal-decoration-success', 0xea71),
	primitiveSquare: register('primitive-square', 0xea72),
	edit: register('edit', 0xea73),
	pencil: register('pencil', 0xea73),
	info: register('info', 0xea74),
	issueOpened: register('issue-opened', 0xea74),
	gistPrivate: register('gist-private', 0xea75),
	gitForkPrivate: register('git-fork-private', 0xea75),
	lock: register('lock', 0xea75),
	mirrorPrivate: register('mirror-private', 0xea75),
	close: register('close', 0xea76),
	removeClose: register('remove-close', 0xea76),
	x: register('x', 0xea76),
	repoSync: register('repo-sync', 0xea77),
	sync: register('sync', 0xea77),
	clone: register('clone', 0xea78),
	desktopDownload: register('desktop-download', 0xea78),
	beaker: register('beaker', 0xea79),
	microscope: register('microscope', 0xea79),
	vm: register('vm', 0xea7a),
	deviceDesktop: register('device-desktop', 0xea7a),
	file: register('file', 0xea7b),
	more: register('more', 0xea7c),
	ellipsis: register('ellipsis', 0xea7c),
	kebabHorizontal: register('kebab-horizontal', 0xea7c),
	mailReply: register('mail-reply', 0xea7d),
	reply: register('reply', 0xea7d),
	organization: register('organization', 0xea7e),
	organizationFilled: register('organization-filled', 0xea7e),
	organizationOutline: register('organization-outline', 0xea7e),
	newFile: register('new-file', 0xea7f),
	fileAdd: register('file-add', 0xea7f),
	newFolder: register('new-folder', 0xea80),
	fileDirectoryCreate: register('file-directory-create', 0xea80),
	trash: register('trash', 0xea81),
	trashcan: register('trashcan', 0xea81),
	history: register('history', 0xea82),
	clock: register('clock', 0xea82),
	folder: register('folder', 0xea83),
	fileDirectory: register('file-directory', 0xea83),
	symbolFolder: register('symbol-folder', 0xea83),
	logoGithub: register('logo-github', 0xea84),
	markGithub: register('mark-github', 0xea84),
	github: register('github', 0xea84),
	terminal: register('terminal', 0xea85),
	console: register('console', 0xea85),
	repl: register('repl', 0xea85),
	zap: register('zap', 0xea86),
	symbolEvent: register('symbol-event', 0xea86),
	error: register('error', 0xea87),
	stop: register('stop', 0xea87),
	variable: register('variable', 0xea88),
	symbolVariable: register('symbol-variable', 0xea88),
	array: register('array', 0xea8a),
	symbolArray: register('symbol-array', 0xea8a),
	symbolModule: register('symbol-module', 0xea8b),
	symbolPackage: register('symbol-package', 0xea8b),
	symbolNamespace: register('symbol-namespace', 0xea8b),
	symbolObject: register('symbol-object', 0xea8b),
	symbolMethod: register('symbol-method', 0xea8c),
	symbolFunction: register('symbol-function', 0xea8c),
	symbolConstructor: register('symbol-constructor', 0xea8c),
	symbolBoolean: register('symbol-boolean', 0xea8f),
	symbolNull: register('symbol-null', 0xea8f),
	symbolNumeric: register('symbol-numeric', 0xea90),
	symbolNumber: register('symbol-number', 0xea90),
	symbolStructure: register('symbol-structure', 0xea91),
	symbolStruct: register('symbol-struct', 0xea91),
	symbolParameter: register('symbol-parameter', 0xea92),
	symbolTypeParameter: register('symbol-type-parameter', 0xea92),
	symbolKey: register('symbol-key', 0xea93),
	symbolText: register('symbol-text', 0xea93),
	symbolReference: register('symbol-reference', 0xea94),
	goToFile: register('go-to-file', 0xea94),
	symbolEnum: register('symbol-enum', 0xea95),
	symbolValue: register('symbol-value', 0xea95),
	symbolRuler: register('symbol-ruler', 0xea96),
	symbolUnit: register('symbol-unit', 0xea96),
	activateBreakpoints: register('activate-breakpoints', 0xea97),
	archive: register('archive', 0xea98),
	arrowBoth: register('arrow-both', 0xea99),
	arrowDown: register('arrow-down', 0xea9a),
	arrowLeft: register('arrow-left', 0xea9b),
	arrowRight: register('arrow-right', 0xea9c),
	arrowSmallDown: register('arrow-small-down', 0xea9d),
	arrowSmallLeft: register('arrow-small-left', 0xea9e),
	arrowSmallRight: register('arrow-small-right', 0xea9f),
	arrowSmallUp: register('arrow-small-up', 0xeaa0),
	arrowUp: register('arrow-up', 0xeaa1),
	bell: register('bell', 0xeaa2),
	bold: register('bold', 0xeaa3),
	book: register('book', 0xeaa4),
	bookmark: register('bookmark', 0xeaa5),
	debugBreakpointConditionalUnverified: register('debug-breakpoint-conditional-unverified', 0xeaa6),
	debugBreakpointConditional: register('debug-breakpoint-conditional', 0xeaa7),
	debugBreakpointConditionalDisabled: register('debug-breakpoint-conditional-disabled', 0xeaa7),
	debugBreakpointDataUnverified: register('debug-breakpoint-data-unverified', 0xeaa8),
	debugBreakpointData: register('debug-breakpoint-data', 0xeaa9),
	debugBreakpointDataDisabled: register('debug-breakpoint-data-disabled', 0xeaa9),
	debugBreakpointLogUnverified: register('debug-breakpoint-log-unverified', 0xeaaa),
	debugBreakpointLog: register('debug-breakpoint-log', 0xeaab),
	debugBreakpointLogDisabled: register('debug-breakpoint-log-disabled', 0xeaab),
	briefcase: register('briefcase', 0xeaac),
	broadcast: register('broadcast', 0xeaad),
	browser: register('browser', 0xeaae),
	bug: register('bug', 0xeaaf),
	calendar: register('calendar', 0xeab0),
	caseSensitive: register('case-sensitive', 0xeab1),
	check: register('check', 0xeab2),
	checklist: register('checklist', 0xeab3),
	chevronDown: register('chevron-down', 0xeab4),
	chevronLeft: register('chevron-left', 0xeab5),
	chevronRight: register('chevron-right', 0xeab6),
	chevronUp: register('chevron-up', 0xeab7),
	chromeClose: register('chrome-close', 0xeab8),
	chromeMaximize: register('chrome-maximize', 0xeab9),
	chromeMinimize: register('chrome-minimize', 0xeaba),
	chromeRestore: register('chrome-restore', 0xeabb),
	circleOutline: register('circle-outline', 0xeabc),
	circle: register('circle', 0xeabc),
	debugBreakpointUnverified: register('debug-breakpoint-unverified', 0xeabc),
	terminalDecorationIncomplete: register('terminal-decoration-incomplete', 0xeabc),
	circleSlash: register('circle-slash', 0xeabd),
	circuitBoard: register('circuit-board', 0xeabe),
	clearAll: register('clear-all', 0xeabf),
	clippy: register('clippy', 0xeac0),
	closeAll: register('close-all', 0xeac1),
	cloudDownload: register('cloud-download', 0xeac2),
	cloudUpload: register('cloud-upload', 0xeac3),
	code: register('code', 0xeac4),
	collapseAll: register('collapse-all', 0xeac5),
	colorMode: register('color-mode', 0xeac6),
	commentDiscussion: register('comment-discussion', 0xeac7),
	creditCard: register('credit-card', 0xeac9),
	dash: register('dash', 0xeacc),
	dashboard: register('dashboard', 0xeacd),
	database: register('database', 0xeace),
	debugContinue: register('debug-continue', 0xeacf),
	debugDisconnect: register('debug-disconnect', 0xead0),
	debugPause: register('debug-pause', 0xead1),
	debugRestart: register('debug-restart', 0xead2),
	debugStart: register('debug-start', 0xead3),
	debugStepInto: register('debug-step-into', 0xead4),
	debugStepOut: register('debug-step-out', 0xead5),
	debugStepOver: register('debug-step-over', 0xead6),
	debugStop: register('debug-stop', 0xead7),
	debug: register('debug', 0xead8),
	deviceCameraVideo: register('device-camera-video', 0xead9),
	deviceCamera: register('device-camera', 0xeada),
	deviceMobile: register('device-mobile', 0xeadb),
	diffAdded: register('diff-added', 0xeadc),
	diffIgnored: register('diff-ignored', 0xeadd),
	diffModified: register('diff-modified', 0xeade),
	diffRemoved: register('diff-removed', 0xeadf),
	diffRenamed: register('diff-renamed', 0xeae0),
	diff: register('diff', 0xeae1),
	diffSidebyside: register('diff-sidebyside', 0xeae1),
	discard: register('discard', 0xeae2),
	editorLayout: register('editor-layout', 0xeae3),
	emptyWindow: register('empty-window', 0xeae4),
	exclude: register('exclude', 0xeae5),
	extensions: register('extensions', 0xeae6),
	eyeClosed: register('eye-closed', 0xeae7),
	fileBinary: register('file-binary', 0xeae8),
	fileCode: register('file-code', 0xeae9),
	fileMedia: register('file-media', 0xeaea),
	filePdf: register('file-pdf', 0xeaeb),
	fileSubmodule: register('file-submodule', 0xeaec),
	fileSymlinkDirectory: register('file-symlink-directory', 0xeaed),
	fileSymlinkFile: register('file-symlink-file', 0xeaee),
	fileZip: register('file-zip', 0xeaef),
	files: register('files', 0xeaf0),
	filter: register('filter', 0xeaf1),
	flame: register('flame', 0xeaf2),
	foldDown: register('fold-down', 0xeaf3),
	foldUp: register('fold-up', 0xeaf4),
	fold: register('fold', 0xeaf5),
	folderActive: register('folder-active', 0xeaf6),
	folderOpened: register('folder-opened', 0xeaf7),
	gear: register('gear', 0xeaf8),
	gift: register('gift', 0xeaf9),
	gistSecret: register('gist-secret', 0xeafa),
	gist: register('gist', 0xeafb),
	gitCommit: register('git-commit', 0xeafc),
	gitCompare: register('git-compare', 0xeafd),
	compareChanges: register('compare-changes', 0xeafd),
	gitMerge: register('git-merge', 0xeafe),
	githubAction: register('github-action', 0xeaff),
	githubAlt: register('github-alt', 0xeb00),
	globe: register('globe', 0xeb01),
	grabber: register('grabber', 0xeb02),
	graph: register('graph', 0xeb03),
	gripper: register('gripper', 0xeb04),
	heart: register('heart', 0xeb05),
	home: register('home', 0xeb06),
	horizontalRule: register('horizontal-rule', 0xeb07),
	hubot: register('hubot', 0xeb08),
	inbox: register('inbox', 0xeb09),
	issueReopened: register('issue-reopened', 0xeb0b),
	issues: register('issues', 0xeb0c),
	italic: register('italic', 0xeb0d),
	jersey: register('jersey', 0xeb0e),
	json: register('json', 0xeb0f),
	bracket: register('bracket', 0xeb0f),
	kebabVertical: register('kebab-vertical', 0xeb10),
	key: register('key', 0xeb11),
	law: register('law', 0xeb12),
	lightbulbAutofix: register('lightbulb-autofix', 0xeb13),
	linkExternal: register('link-external', 0xeb14),
	link: register('link', 0xeb15),
	listOrdered: register('list-ordered', 0xeb16),
	listUnordered: register('list-unordered', 0xeb17),
	liveShare: register('live-share', 0xeb18),
	loading: register('loading', 0xeb19),
	location: register('location', 0xeb1a),
	mailRead: register('mail-read', 0xeb1b),
	mail: register('mail', 0xeb1c),
	markdown: register('markdown', 0xeb1d),
	megaphone: register('megaphone', 0xeb1e),
	mention: register('mention', 0xeb1f),
	milestone: register('milestone', 0xeb20),
	gitPullRequestMilestone: register('git-pull-request-milestone', 0xeb20),
	mortarBoard: register('mortar-board', 0xeb21),
	move: register('move', 0xeb22),
	multipleWindows: register('multiple-windows', 0xeb23),
	mute: register('mute', 0xeb24),
	noNewline: register('no-newline', 0xeb25),
	note: register('note', 0xeb26),
	octoface: register('octoface', 0xeb27),
	openPreview: register('open-preview', 0xeb28),
	package: register('package', 0xeb29),
	paintcan: register('paintcan', 0xeb2a),
	pin: register('pin', 0xeb2b),
	play: register('play', 0xeb2c),
	run: register('run', 0xeb2c),
	plug: register('plug', 0xeb2d),
	preserveCase: register('preserve-case', 0xeb2e),
	preview: register('preview', 0xeb2f),
	project: register('project', 0xeb30),
	pulse: register('pulse', 0xeb31),
	question: register('question', 0xeb32),
	quote: register('quote', 0xeb33),
	radioTower: register('radio-tower', 0xeb34),
	reactions: register('reactions', 0xeb35),
	references: register('references', 0xeb36),
	refresh: register('refresh', 0xeb37),
	regex: register('regex', 0xeb38),
	remoteExplorer: register('remote-explorer', 0xeb39),
	remote: register('remote', 0xeb3a),
	remove: register('remove', 0xeb3b),
	replaceAll: register('replace-all', 0xeb3c),
	replace: register('replace', 0xeb3d),
	repoClone: register('repo-clone', 0xeb3e),
	repoForcePush: register('repo-force-push', 0xeb3f),
	repoPull: register('repo-pull', 0xeb40),
	repoPush: register('repo-push', 0xeb41),
	report: register('report', 0xeb42),
	requestChanges: register('request-changes', 0xeb43),
	rocket: register('rocket', 0xeb44),
	rootFolderOpened: register('root-folder-opened', 0xeb45),
	rootFolder: register('root-folder', 0xeb46),
	rss: register('rss', 0xeb47),
	ruby: register('ruby', 0xeb48),
	saveAll: register('save-all', 0xeb49),
	saveAs: register('save-as', 0xeb4a),
	save: register('save', 0xeb4b),
	screenFull: register('screen-full', 0xeb4c),
	screenNormal: register('screen-normal', 0xeb4d),
	searchStop: register('search-stop', 0xeb4e),
	server: register('server', 0xeb50),
	settingsGear: register('settings-gear', 0xeb51),
	settings: register('settings', 0xeb52),
	shield: register('shield', 0xeb53),
	smiley: register('smiley', 0xeb54),
	sortPrecedence: register('sort-precedence', 0xeb55),
	splitHorizontal: register('split-horizontal', 0xeb56),
	splitVertical: register('split-vertical', 0xeb57),
	squirrel: register('squirrel', 0xeb58),
	starFull: register('star-full', 0xeb59),
	starHalf: register('star-half', 0xeb5a),
	symbolClass: register('symbol-class', 0xeb5b),
	symbolColor: register('symbol-color', 0xeb5c),
	symbolConstant: register('symbol-constant', 0xeb5d),
	symbolEnumMember: register('symbol-enum-member', 0xeb5e),
	symbolField: register('symbol-field', 0xeb5f),
	symbolFile: register('symbol-file', 0xeb60),
	symbolInterface: register('symbol-interface', 0xeb61),
	symbolKeyword: register('symbol-keyword', 0xeb62),
	symbolMisc: register('symbol-misc', 0xeb63),
	symbolOperator: register('symbol-operator', 0xeb64),
	symbolProperty: register('symbol-property', 0xeb65),
	wrench: register('wrench', 0xeb65),
	wrenchSubaction: register('wrench-subaction', 0xeb65),
	symbolSnippet: register('symbol-snippet', 0xeb66),
	tasklist: register('tasklist', 0xeb67),
	telescope: register('telescope', 0xeb68),
	textSize: register('text-size', 0xeb69),
	threeBars: register('three-bars', 0xeb6a),
	thumbsdown: register('thumbsdown', 0xeb6b),
	thumbsup: register('thumbsup', 0xeb6c),
	tools: register('tools', 0xeb6d),
	triangleDown: register('triangle-down', 0xeb6e),
	triangleLeft: register('triangle-left', 0xeb6f),
	triangleRight: register('triangle-right', 0xeb70),
	triangleUp: register('triangle-up', 0xeb71),
	twitter: register('twitter', 0xeb72),
	unfold: register('unfold', 0xeb73),
	unlock: register('unlock', 0xeb74),
	unmute: register('unmute', 0xeb75),
	unverified: register('unverified', 0xeb76),
	verified: register('verified', 0xeb77),
	versions: register('versions', 0xeb78),
	vmActive: register('vm-active', 0xeb79),
	vmOutline: register('vm-outline', 0xeb7a),
	vmRunning: register('vm-running', 0xeb7b),
	watch: register('watch', 0xeb7c),
	whitespace: register('whitespace', 0xeb7d),
	wholeWord: register('whole-word', 0xeb7e),
	window: register('window', 0xeb7f),
	wordWrap: register('word-wrap', 0xeb80),
	zoomIn: register('zoom-in', 0xeb81),
	zoomOut: register('zoom-out', 0xeb82),
	listFilter: register('list-filter', 0xeb83),
	listFlat: register('list-flat', 0xeb84),
	listSelection: register('list-selection', 0xeb85),
	selection: register('selection', 0xeb85),
	listTree: register('list-tree', 0xeb86),
	debugBreakpointFunctionUnverified: register('debug-breakpoint-function-unverified', 0xeb87),
	debugBreakpointFunction: register('debug-breakpoint-function', 0xeb88),
	debugBreakpointFunctionDisabled: register('debug-breakpoint-function-disabled', 0xeb88),
	debugStackframeActive: register('debug-stackframe-active', 0xeb89),
	circleSmallFilled: register('circle-small-filled', 0xeb8a),
	debugStackframeDot: register('debug-stackframe-dot', 0xeb8a),
	terminalDecorationMark: register('terminal-decoration-mark', 0xeb8a),
	debugStackframe: register('debug-stackframe', 0xeb8b),
	debugStackframeFocused: register('debug-stackframe-focused', 0xeb8b),
	debugBreakpointUnsupported: register('debug-breakpoint-unsupported', 0xeb8c),
	symbolString: register('symbol-string', 0xeb8d),
	debugReverseContinue: register('debug-reverse-continue', 0xeb8e),
	debugStepBack: register('debug-step-back', 0xeb8f),
	debugRestartFrame: register('debug-restart-frame', 0xeb90),
	debugAlt: register('debug-alt', 0xeb91),
	callIncoming: register('call-incoming', 0xeb92),
	callOutgoing: register('call-outgoing', 0xeb93),
	menu: register('menu', 0xeb94),
	expandAll: register('expand-all', 0xeb95),
	feedback: register('feedback', 0xeb96),
	gitPullRequestReviewer: register('git-pull-request-reviewer', 0xeb96),
	groupByRefType: register('group-by-ref-type', 0xeb97),
	ungroupByRefType: register('ungroup-by-ref-type', 0xeb98),
	account: register('account', 0xeb99),
	gitPullRequestAssignee: register('git-pull-request-assignee', 0xeb99),
	bellDot: register('bell-dot', 0xeb9a),
	debugConsole: register('debug-console', 0xeb9b),
	library: register('library', 0xeb9c),
	output: register('output', 0xeb9d),
	runAll: register('run-all', 0xeb9e),
	syncIgnored: register('sync-ignored', 0xeb9f),
	pinned: register('pinned', 0xeba0),
	githubInverted: register('github-inverted', 0xeba1),
	serverProcess: register('server-process', 0xeba2),
	serverEnvironment: register('server-environment', 0xeba3),
	pass: register('pass', 0xeba4),
	issueClosed: register('issue-closed', 0xeba4),
	stopCircle: register('stop-circle', 0xeba5),
	playCircle: register('play-circle', 0xeba6),
	record: register('record', 0xeba7),
	debugAltSmall: register('debug-alt-small', 0xeba8),
	vmConnect: register('vm-connect', 0xeba9),
	cloud: register('cloud', 0xebaa),
	merge: register('merge', 0xebab),
	export: register('export', 0xebac),
	graphLeft: register('graph-left', 0xebad),
	magnet: register('magnet', 0xebae),
	notebook: register('notebook', 0xebaf),
	redo: register('redo', 0xebb0),
	checkAll: register('check-all', 0xebb1),
	pinnedDirty: register('pinned-dirty', 0xebb2),
	passFilled: register('pass-filled', 0xebb3),
	circleLargeFilled: register('circle-large-filled', 0xebb4),
	circleLarge: register('circle-large', 0xebb5),
	circleLargeOutline: register('circle-large-outline', 0xebb5),
	combine: register('combine', 0xebb6),
	gather: register('gather', 0xebb6),
	table: register('table', 0xebb7),
	variableGroup: register('variable-group', 0xebb8),
	typeHierarchy: register('type-hierarchy', 0xebb9),
	typeHierarchySub: register('type-hierarchy-sub', 0xebba),
	typeHierarchySuper: register('type-hierarchy-super', 0xebbb),
	gitPullRequestCreate: register('git-pull-request-create', 0xebbc),
	runAbove: register('run-above', 0xebbd),
	runBelow: register('run-below', 0xebbe),
	notebookTemplate: register('notebook-template', 0xebbf),
	debugRerun: register('debug-rerun', 0xebc0),
	workspaceTrusted: register('workspace-trusted', 0xebc1),
	workspaceUntrusted: register('workspace-untrusted', 0xebc2),
	workspaceUnknown: register('workspace-unknown', 0xebc3),
	terminalCmd: register('terminal-cmd', 0xebc4),
	terminalDebian: register('terminal-debian', 0xebc5),
	terminalLinux: register('terminal-linux', 0xebc6),
	terminalPowershell: register('terminal-powershell', 0xebc7),
	terminalTmux: register('terminal-tmux', 0xebc8),
	terminalUbuntu: register('terminal-ubuntu', 0xebc9),
	terminalBash: register('terminal-bash', 0xebca),
	arrowSwap: register('arrow-swap', 0xebcb),
	copy: register('copy', 0xebcc),
	personAdd: register('person-add', 0xebcd),
	filterFilled: register('filter-filled', 0xebce),
	wand: register('wand', 0xebcf),
	debugLineByLine: register('debug-line-by-line', 0xebd0),
	inspect: register('inspect', 0xebd1),
	layers: register('layers', 0xebd2),
	layersDot: register('layers-dot', 0xebd3),
	layersActive: register('layers-active', 0xebd4),
	compass: register('compass', 0xebd5),
	compassDot: register('compass-dot', 0xebd6),
	compassActive: register('compass-active', 0xebd7),
	azure: register('azure', 0xebd8),
	issueDraft: register('issue-draft', 0xebd9),
	gitPullRequestClosed: register('git-pull-request-closed', 0xebda),
	gitPullRequestDraft: register('git-pull-request-draft', 0xebdb),
	debugAll: register('debug-all', 0xebdc),
	debugCoverage: register('debug-coverage', 0xebdd),
	runErrors: register('run-errors', 0xebde),
	folderLibrary: register('folder-library', 0xebdf),
	debugContinueSmall: register('debug-continue-small', 0xebe0),
	beakerStop: register('beaker-stop', 0xebe1),
	graphLine: register('graph-line', 0xebe2),
	graphScatter: register('graph-scatter', 0xebe3),
	pieChart: register('pie-chart', 0xebe4),
	bracketDot: register('bracket-dot', 0xebe5),
	bracketError: register('bracket-error', 0xebe6),
	lockSmall: register('lock-small', 0xebe7),
	azureDevops: register('azure-devops', 0xebe8),
	verifiedFilled: register('verified-filled', 0xebe9),
	newline: register('newline', 0xebea),
	layout: register('layout', 0xebeb),
	layoutActivitybarLeft: register('layout-activitybar-left', 0xebec),
	layoutActivitybarRight: register('layout-activitybar-right', 0xebed),
	layoutPanelLeft: register('layout-panel-left', 0xebee),
	layoutPanelCenter: register('layout-panel-center', 0xebef),
	layoutPanelJustify: register('layout-panel-justify', 0xebf0),
	layoutPanelRight: register('layout-panel-right', 0xebf1),
	layoutPanel: register('layout-panel', 0xebf2),
	layoutSidebarLeft: register('layout-sidebar-left', 0xebf3),
	layoutSidebarRight: register('layout-sidebar-right', 0xebf4),
	layoutStatusbar: register('layout-statusbar', 0xebf5),
	layoutMenubar: register('layout-menubar', 0xebf6),
	layoutCentered: register('layout-centered', 0xebf7),
	target: register('target', 0xebf8),
	indent: register('indent', 0xebf9),
	recordSmall: register('record-small', 0xebfa),
	errorSmall: register('error-small', 0xebfb),
	terminalDecorationError: register('terminal-decoration-error', 0xebfb),
	arrowCircleDown: register('arrow-circle-down', 0xebfc),
	arrowCircleLeft: register('arrow-circle-left', 0xebfd),
	arrowCircleRight: register('arrow-circle-right', 0xebfe),
	arrowCircleUp: register('arrow-circle-up', 0xebff),
	layoutSidebarRightOff: register('layout-sidebar-right-off', 0xec00),
	layoutPanelOff: register('layout-panel-off', 0xec01),
	layoutSidebarLeftOff: register('layout-sidebar-left-off', 0xec02),
	blank: register('blank', 0xec03),
	heartFilled: register('heart-filled', 0xec04),
	map: register('map', 0xec05),
	mapHorizontal: register('map-horizontal', 0xec05),
	foldHorizontal: register('fold-horizontal', 0xec05),
	mapFilled: register('map-filled', 0xec06),
	mapHorizontalFilled: register('map-horizontal-filled', 0xec06),
	foldHorizontalFilled: register('fold-horizontal-filled', 0xec06),
	circleSmall: register('circle-small', 0xec07),
	bellSlash: register('bell-slash', 0xec08),
	bellSlashDot: register('bell-slash-dot', 0xec09),
	commentUnresolved: register('comment-unresolved', 0xec0a),
	gitPullRequestGoToChanges: register('git-pull-request-go-to-changes', 0xec0b),
	gitPullRequestNewChanges: register('git-pull-request-new-changes', 0xec0c),
	searchFuzzy: register('search-fuzzy', 0xec0d),
	commentDraft: register('comment-draft', 0xec0e),
	send: register('send', 0xec0f),
	sparkle: register('sparkle', 0xec10),
	insert: register('insert', 0xec11),
	mic: register('mic', 0xec12),
	thumbsdownFilled: register('thumbsdown-filled', 0xec13),
	thumbsupFilled: register('thumbsup-filled', 0xec14),
	coffee: register('coffee', 0xec15),
	snake: register('snake', 0xec16),
	game: register('game', 0xec17),
	vr: register('vr', 0xec18),
	chip: register('chip', 0xec19),
	piano: register('piano', 0xec1a),
	music: register('music', 0xec1b),
	micFilled: register('mic-filled', 0xec1c),
	repoFetch: register('repo-fetch', 0xec1d),
	copilot: register('copilot', 0xec1e),
	lightbulbSparkle: register('lightbulb-sparkle', 0xec1f),
	robot: register('robot', 0xec20),
	sparkleFilled: register('sparkle-filled', 0xec21),
	diffSingle: register('diff-single', 0xec22),
	diffMultiple: register('diff-multiple', 0xec23),
	surroundWith: register('surround-with', 0xec24),
	share: register('share', 0xec25),
	gitStash: register('git-stash', 0xec26),
	gitStashApply: register('git-stash-apply', 0xec27),
	gitStashPop: register('git-stash-pop', 0xec28),
	vscode: register('vscode', 0xec29),
	vscodeInsiders: register('vscode-insiders', 0xec2a),
	codeOss: register('code-oss', 0xec2b),
	runCoverage: register('run-coverage', 0xec2c),
	runAllCoverage: register('run-all-coverage', 0xec2d),
	coverage: register('coverage', 0xec2e),
	githubProject: register('github-project', 0xec2f),
	mapVertical: register('map-vertical', 0xec30),
	foldVertical: register('fold-vertical', 0xec30),
	mapVerticalFilled: register('map-vertical-filled', 0xec31),
	foldVerticalFilled: register('fold-vertical-filled', 0xec31),
	goToSearch: register('go-to-search', 0xec32),
	percentage: register('percentage', 0xec33),
	sortPercentage: register('sort-percentage', 0xec33),
	attach: register('attach', 0xec34),
	goToEditingSession: register('go-to-editing-session', 0xec35),
	editSession: register('edit-session', 0xec36),
	codeReview: register('code-review', 0xec37),
	copilotWarning: register('copilot-warning', 0xec38),
	python: register('python', 0xec39),
	copilotLarge: register('copilot-large', 0xec3a),
	copilotWarningLarge: register('copilot-warning-large', 0xec3b),
	keyboardTab: register('keyboard-tab', 0xec3c),
	copilotBlocked: register('copilot-blocked', 0xec3d),
	copilotNotConnected: register('copilot-not-connected', 0xec3e),
	flag: register('flag', 0xec3f),
	lightbulbEmpty: register('lightbulb-empty', 0xec40),
	symbolMethodArrow: register('symbol-method-arrow', 0xec41),
	copilotUnavailable: register('copilot-unavailable', 0xec42),
	repoPinned: register('repo-pinned', 0xec43),
	keyboardTabAbove: register('keyboard-tab-above', 0xec44),
	keyboardTabBelow: register('keyboard-tab-below', 0xec45),
	gitPullRequestDone: register('git-pull-request-done', 0xec46),
	mcp: register('mcp', 0xec47),
	extensionsLarge: register('extensions-large', 0xec48),
	layoutPanelDock: register('layout-panel-dock', 0xec49),
	layoutSidebarLeftDock: register('layout-sidebar-left-dock', 0xec4a),
	layoutSidebarRightDock: register('layout-sidebar-right-dock', 0xec4b),
	copilotInProgress: register('copilot-in-progress', 0xec4c),
	copilotError: register('copilot-error', 0xec4d),
	copilotSuccess: register('copilot-success', 0xec4e),
	chatSparkle: register('chat-sparkle', 0xec4f),
	searchSparkle: register('search-sparkle', 0xec50),
	editSparkle: register('edit-sparkle', 0xec51),
	copilotSnooze: register('copilot-snooze', 0xec52),
	sendToRemoteAgent: register('send-to-remote-agent', 0xec53),
	commentDiscussionSparkle: register('comment-discussion-sparkle', 0xec54),
	chatSparkleWarning: register('chat-sparkle-warning', 0xec55),
	chatSparkleError: register('chat-sparkle-error', 0xec56),
	collection: register('collection', 0xec57),
	newCollection: register('new-collection', 0xec58),
	thinking: register('thinking', 0xec59),
	build: register('build', 0xec5a),
	commentDiscussionQuote: register('comment-discussion-quote', 0xec5b),
	cursor: register('cursor', 0xec5c),
	eraser: register('eraser', 0xec5d),
	fileText: register('file-text', 0xec5e),
	quotes: register('quotes', 0xec60),
	rename: register('rename', 0xec61),
	runWithDeps: register('run-with-deps', 0xec62),
	debugConnected: register('debug-connected', 0xec63),
	strikethrough: register('strikethrough', 0xec64),
	openInProduct: register('open-in-product', 0xec65),
	indexZero: register('index-zero', 0xec66),
	agent: register('agent', 0xec67),
	editCode: register('edit-code', 0xec68),
	repoSelected: register('repo-selected', 0xec69),
	skip: register('skip', 0xec6a),
	mergeInto: register('merge-into', 0xec6b),
	gitBranchChanges: register('git-branch-changes', 0xec6c),
	gitBranchStagedChanges: register('git-branch-staged-changes', 0xec6d),
	gitBranchConflicts: register('git-branch-conflicts', 0xec6e),
	gitBranch: register('git-branch', 0xec6f),
	gitBranchCreate: register('git-branch-create', 0xec6f),
	gitBranchDelete: register('git-branch-delete', 0xec6f),
	searchLarge: register('search-large', 0xec70),
	terminalGitBash: register('terminal-git-bash', 0xec71),
	windowActive: register('window-active', 0xec72),
	forward: register('forward', 0xec73),
	download: register('download', 0xec74),
	clockface: register('clockface', 0xec75),
	unarchive: register('unarchive', 0xec76),
	sessionInProgress: register('session-in-progress', 0xec77),
	collectionSmall: register('collection-small', 0xec78),
	vmSmall: register('vm-small', 0xec79),
	cloudSmall: register('cloud-small', 0xec7a),
	addSmall: register('add-small', 0xec7b),
	removeSmall: register('remove-small', 0xec7c),
	worktreeSmall: register('worktree-small', 0xec7d),
	worktree: register('worktree', 0xec7e),
} as const;
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/codiconsUtil.ts]---
Location: vscode-main/src/vs/base/common/codiconsUtil.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { ThemeIcon } from './themables.js';
import { isString } from './types.js';


const _codiconFontCharacters: { [id: string]: number } = Object.create(null);

export function register(id: string, fontCharacter: number | string): ThemeIcon {
	if (isString(fontCharacter)) {
		const val = _codiconFontCharacters[fontCharacter];
		if (val === undefined) {
			throw new Error(`${id} references an unknown codicon: ${fontCharacter}`);
		}
		fontCharacter = val;
	}
	_codiconFontCharacters[id] = fontCharacter;
	return { id };
}

/**
 * Only to be used by the iconRegistry.
 */
export function getCodiconFontCharacters(): { [id: string]: number } {
	return _codiconFontCharacters;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/collections.ts]---
Location: vscode-main/src/vs/base/common/collections.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * An interface for a JavaScript object that
 * acts a dictionary. The keys are strings.
 */
export type IStringDictionary<V> = Record<string, V>;

/**
 * An interface for a JavaScript object that
 * acts a dictionary. The keys are numbers.
 */
export type INumberDictionary<V> = Record<number, V>;

/**
 * Groups the collection into a dictionary based on the provided
 * group function.
 */
export function groupBy<K extends string | number | symbol, V>(data: readonly V[], groupFn: (element: V) => K): Partial<Record<K, V[]>> {
	const result: Partial<Record<K, V[]>> = Object.create(null);
	for (const element of data) {
		const key = groupFn(element);
		let target = result[key];
		if (!target) {
			target = result[key] = [];
		}
		target.push(element);
	}
	return result;
}

export function groupByMap<K, V>(data: V[], groupFn: (element: V) => K): Map<K, V[]> {
	const result = new Map<K, V[]>();
	for (const element of data) {
		const key = groupFn(element);
		let target = result.get(key);
		if (!target) {
			target = [];
			result.set(key, target);
		}
		target.push(element);
	}
	return result;
}

export function diffSets<T>(before: ReadonlySet<T>, after: ReadonlySet<T>): { removed: T[]; added: T[] } {
	const removed: T[] = [];
	const added: T[] = [];
	for (const element of before) {
		if (!after.has(element)) {
			removed.push(element);
		}
	}
	for (const element of after) {
		if (!before.has(element)) {
			added.push(element);
		}
	}
	return { removed, added };
}

export function diffMaps<K, V>(before: Map<K, V>, after: Map<K, V>): { removed: V[]; added: V[] } {
	const removed: V[] = [];
	const added: V[] = [];
	for (const [index, value] of before) {
		if (!after.has(index)) {
			removed.push(value);
		}
	}
	for (const [index, value] of after) {
		if (!before.has(index)) {
			added.push(value);
		}
	}
	return { removed, added };
}

/**
 * Computes the intersection of two sets.
 *
 * @param setA - The first set.
 * @param setB - The second iterable.
 * @returns A new set containing the elements that are in both `setA` and `setB`.
 */
export function intersection<T>(setA: Set<T>, setB: Iterable<T>): Set<T> {
	const result = new Set<T>();
	for (const elem of setB) {
		if (setA.has(elem)) {
			result.add(elem);
		}
	}
	return result;
}

export class SetWithKey<T> implements Set<T> {
	private _map = new Map<unknown, T>();

	constructor(values: T[], private toKey: (t: T) => unknown) {
		for (const value of values) {
			this.add(value);
		}
	}

	get size(): number {
		return this._map.size;
	}

	add(value: T): this {
		const key = this.toKey(value);
		this._map.set(key, value);
		return this;
	}

	delete(value: T): boolean {
		return this._map.delete(this.toKey(value));
	}

	has(value: T): boolean {
		return this._map.has(this.toKey(value));
	}

	*entries(): IterableIterator<[T, T]> {
		for (const entry of this._map.values()) {
			yield [entry, entry];
		}
	}

	keys(): IterableIterator<T> {
		return this.values();
	}

	*values(): IterableIterator<T> {
		for (const entry of this._map.values()) {
			yield entry;
		}
	}

	clear(): void {
		this._map.clear();
	}

	forEach(callbackfn: (value: T, value2: T, set: Set<T>) => void, thisArg?: unknown): void {
		this._map.forEach(entry => callbackfn.call(thisArg, entry, entry, this));
	}

	[Symbol.iterator](): IterableIterator<T> {
		return this.values();
	}

	[Symbol.toStringTag]: string = 'SetWithKey';
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/color.ts]---
Location: vscode-main/src/vs/base/common/color.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CharCode } from './charCode.js';

function roundFloat(number: number, decimalPoints: number): number {
	const decimal = Math.pow(10, decimalPoints);
	return Math.round(number * decimal) / decimal;
}

export class RGBA {
	_rgbaBrand: void = undefined;

	/**
	 * Red: integer in [0-255]
	 */
	readonly r: number;

	/**
	 * Green: integer in [0-255]
	 */
	readonly g: number;

	/**
	 * Blue: integer in [0-255]
	 */
	readonly b: number;

	/**
	 * Alpha: float in [0-1]
	 */
	readonly a: number;

	constructor(r: number, g: number, b: number, a: number = 1) {
		this.r = Math.min(255, Math.max(0, r)) | 0;
		this.g = Math.min(255, Math.max(0, g)) | 0;
		this.b = Math.min(255, Math.max(0, b)) | 0;
		this.a = roundFloat(Math.max(Math.min(1, a), 0), 3);
	}

	static equals(a: RGBA, b: RGBA): boolean {
		return a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a;
	}
}

export class HSLA {

	_hslaBrand: void = undefined;

	/**
	 * Hue: integer in [0, 360]
	 */
	readonly h: number;

	/**
	 * Saturation: float in [0, 1]
	 */
	readonly s: number;

	/**
	 * Luminosity: float in [0, 1]
	 */
	readonly l: number;

	/**
	 * Alpha: float in [0, 1]
	 */
	readonly a: number;

	constructor(h: number, s: number, l: number, a: number) {
		this.h = Math.max(Math.min(360, h), 0) | 0;
		this.s = roundFloat(Math.max(Math.min(1, s), 0), 3);
		this.l = roundFloat(Math.max(Math.min(1, l), 0), 3);
		this.a = roundFloat(Math.max(Math.min(1, a), 0), 3);
	}

	static equals(a: HSLA, b: HSLA): boolean {
		return a.h === b.h && a.s === b.s && a.l === b.l && a.a === b.a;
	}

	/**
	 * Converts an RGB color value to HSL. Conversion formula
	 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
	 * Assumes r, g, and b are contained in the set [0, 255] and
	 * returns h in the set [0, 360], s, and l in the set [0, 1].
	 */
	static fromRGBA(rgba: RGBA): HSLA {
		const r = rgba.r / 255;
		const g = rgba.g / 255;
		const b = rgba.b / 255;
		const a = rgba.a;

		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		let h = 0;
		let s = 0;
		const l = (min + max) / 2;
		const chroma = max - min;

		if (chroma > 0) {
			s = Math.min((l <= 0.5 ? chroma / (2 * l) : chroma / (2 - (2 * l))), 1);

			switch (max) {
				case r: h = (g - b) / chroma + (g < b ? 6 : 0); break;
				case g: h = (b - r) / chroma + 2; break;
				case b: h = (r - g) / chroma + 4; break;
			}

			h *= 60;
			h = Math.round(h);
		}
		return new HSLA(h, s, l, a);
	}

	private static _hue2rgb(p: number, q: number, t: number): number {
		if (t < 0) {
			t += 1;
		}
		if (t > 1) {
			t -= 1;
		}
		if (t < 1 / 6) {
			return p + (q - p) * 6 * t;
		}
		if (t < 1 / 2) {
			return q;
		}
		if (t < 2 / 3) {
			return p + (q - p) * (2 / 3 - t) * 6;
		}
		return p;
	}

	/**
	 * Converts an HSL color value to RGB. Conversion formula
	 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
	 * Assumes h in the set [0, 360] s, and l are contained in the set [0, 1] and
	 * returns r, g, and b in the set [0, 255].
	 */
	static toRGBA(hsla: HSLA): RGBA {
		const h = hsla.h / 360;
		const { s, l, a } = hsla;
		let r: number, g: number, b: number;

		if (s === 0) {
			r = g = b = l; // achromatic
		} else {
			const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			const p = 2 * l - q;
			r = HSLA._hue2rgb(p, q, h + 1 / 3);
			g = HSLA._hue2rgb(p, q, h);
			b = HSLA._hue2rgb(p, q, h - 1 / 3);
		}

		return new RGBA(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), a);
	}
}

export class HSVA {

	_hsvaBrand: void = undefined;

	/**
	 * Hue: integer in [0, 360]
	 */
	readonly h: number;

	/**
	 * Saturation: float in [0, 1]
	 */
	readonly s: number;

	/**
	 * Value: float in [0, 1]
	 */
	readonly v: number;

	/**
	 * Alpha: float in [0, 1]
	 */
	readonly a: number;

	constructor(h: number, s: number, v: number, a: number) {
		this.h = Math.max(Math.min(360, h), 0) | 0;
		this.s = roundFloat(Math.max(Math.min(1, s), 0), 3);
		this.v = roundFloat(Math.max(Math.min(1, v), 0), 3);
		this.a = roundFloat(Math.max(Math.min(1, a), 0), 3);
	}

	static equals(a: HSVA, b: HSVA): boolean {
		return a.h === b.h && a.s === b.s && a.v === b.v && a.a === b.a;
	}

	// from http://www.rapidtables.com/convert/color/rgb-to-hsv.htm
	static fromRGBA(rgba: RGBA): HSVA {
		const r = rgba.r / 255;
		const g = rgba.g / 255;
		const b = rgba.b / 255;
		const cmax = Math.max(r, g, b);
		const cmin = Math.min(r, g, b);
		const delta = cmax - cmin;
		const s = cmax === 0 ? 0 : (delta / cmax);
		let m: number;

		if (delta === 0) {
			m = 0;
		} else if (cmax === r) {
			m = ((((g - b) / delta) % 6) + 6) % 6;
		} else if (cmax === g) {
			m = ((b - r) / delta) + 2;
		} else {
			m = ((r - g) / delta) + 4;
		}

		return new HSVA(Math.round(m * 60), s, cmax, rgba.a);
	}

	// from http://www.rapidtables.com/convert/color/hsv-to-rgb.htm
	static toRGBA(hsva: HSVA): RGBA {
		const { h, s, v, a } = hsva;
		const c = v * s;
		const x = c * (1 - Math.abs((h / 60) % 2 - 1));
		const m = v - c;
		let [r, g, b] = [0, 0, 0];

		if (h < 60) {
			r = c;
			g = x;
		} else if (h < 120) {
			r = x;
			g = c;
		} else if (h < 180) {
			g = c;
			b = x;
		} else if (h < 240) {
			g = x;
			b = c;
		} else if (h < 300) {
			r = x;
			b = c;
		} else if (h <= 360) {
			r = c;
			b = x;
		}

		r = Math.round((r + m) * 255);
		g = Math.round((g + m) * 255);
		b = Math.round((b + m) * 255);

		return new RGBA(r, g, b, a);
	}
}

export class Color {

	static fromHex(hex: string): Color {
		return Color.Format.CSS.parseHex(hex) || Color.red;
	}

	static equals(a: Color | null, b: Color | null): boolean {
		if (!a && !b) {
			return true;
		}
		if (!a || !b) {
			return false;
		}
		return a.equals(b);
	}

	readonly rgba: RGBA;
	private _hsla?: HSLA;
	get hsla(): HSLA {
		if (this._hsla) {
			return this._hsla;
		} else {
			return HSLA.fromRGBA(this.rgba);
		}
	}

	private _hsva?: HSVA;
	get hsva(): HSVA {
		if (this._hsva) {
			return this._hsva;
		}
		return HSVA.fromRGBA(this.rgba);
	}

	constructor(arg: RGBA | HSLA | HSVA) {
		if (!arg) {
			throw new Error('Color needs a value');
		} else if (arg instanceof RGBA) {
			this.rgba = arg;
		} else if (arg instanceof HSLA) {
			this._hsla = arg;
			this.rgba = HSLA.toRGBA(arg);
		} else if (arg instanceof HSVA) {
			this._hsva = arg;
			this.rgba = HSVA.toRGBA(arg);
		} else {
			throw new Error('Invalid color ctor argument');
		}
	}

	equals(other: Color | null): boolean {
		return !!other && RGBA.equals(this.rgba, other.rgba) && HSLA.equals(this.hsla, other.hsla) && HSVA.equals(this.hsva, other.hsva);
	}

	/**
	 * http://www.w3.org/TR/WCAG20/#relativeluminancedef
	 * Returns the number in the set [0, 1]. O => Darkest Black. 1 => Lightest white.
	 */
	getRelativeLuminance(): number {
		const R = Color._relativeLuminanceForComponent(this.rgba.r);
		const G = Color._relativeLuminanceForComponent(this.rgba.g);
		const B = Color._relativeLuminanceForComponent(this.rgba.b);
		const luminance = 0.2126 * R + 0.7152 * G + 0.0722 * B;

		return roundFloat(luminance, 4);
	}

	/**
	 * Reduces the "foreground" color on this "background" color unti it is
	 * below the relative luminace ratio.
	 * @returns the new foreground color
	 * @see https://github.com/xtermjs/xterm.js/blob/44f9fa39ae03e2ca6d28354d88a399608686770e/src/common/Color.ts#L315
	 */
	reduceRelativeLuminace(foreground: Color, ratio: number): Color {
		// This is a naive but fast approach to reducing luminance as converting to
		// HSL and back is expensive
		let { r: fgR, g: fgG, b: fgB } = foreground.rgba;

		let cr = this.getContrastRatio(foreground);
		while (cr < ratio && (fgR > 0 || fgG > 0 || fgB > 0)) {
			// Reduce by 10% until the ratio is hit
			fgR -= Math.max(0, Math.ceil(fgR * 0.1));
			fgG -= Math.max(0, Math.ceil(fgG * 0.1));
			fgB -= Math.max(0, Math.ceil(fgB * 0.1));
			cr = this.getContrastRatio(new Color(new RGBA(fgR, fgG, fgB)));
		}

		return new Color(new RGBA(fgR, fgG, fgB));
	}

	/**
	 * Increases the "foreground" color on this "background" color unti it is
	 * below the relative luminace ratio.
	 * @returns the new foreground color
	 * @see https://github.com/xtermjs/xterm.js/blob/44f9fa39ae03e2ca6d28354d88a399608686770e/src/common/Color.ts#L335
	 */
	increaseRelativeLuminace(foreground: Color, ratio: number): Color {
		// This is a naive but fast approach to reducing luminance as converting to
		// HSL and back is expensive
		let { r: fgR, g: fgG, b: fgB } = foreground.rgba;
		let cr = this.getContrastRatio(foreground);
		while (cr < ratio && (fgR < 0xFF || fgG < 0xFF || fgB < 0xFF)) {
			fgR = Math.min(0xFF, fgR + Math.ceil((255 - fgR) * 0.1));
			fgG = Math.min(0xFF, fgG + Math.ceil((255 - fgG) * 0.1));
			fgB = Math.min(0xFF, fgB + Math.ceil((255 - fgB) * 0.1));
			cr = this.getContrastRatio(new Color(new RGBA(fgR, fgG, fgB)));
		}

		return new Color(new RGBA(fgR, fgG, fgB));
	}

	private static _relativeLuminanceForComponent(color: number): number {
		const c = color / 255;
		return (c <= 0.03928) ? c / 12.92 : Math.pow(((c + 0.055) / 1.055), 2.4);
	}

	/**
	 * http://www.w3.org/TR/WCAG20/#contrast-ratiodef
	 * Returns the contrast ration number in the set [1, 21].
	 */
	getContrastRatio(another: Color): number {
		const lum1 = this.getRelativeLuminance();
		const lum2 = another.getRelativeLuminance();
		return lum1 > lum2 ? (lum1 + 0.05) / (lum2 + 0.05) : (lum2 + 0.05) / (lum1 + 0.05);
	}

	/**
	 *	http://24ways.org/2010/calculating-color-contrast
	 *  Return 'true' if darker color otherwise 'false'
	 */
	isDarker(): boolean {
		const yiq = (this.rgba.r * 299 + this.rgba.g * 587 + this.rgba.b * 114) / 1000;
		return yiq < 128;
	}

	/**
	 *	http://24ways.org/2010/calculating-color-contrast
	 *  Return 'true' if lighter color otherwise 'false'
	 */
	isLighter(): boolean {
		const yiq = (this.rgba.r * 299 + this.rgba.g * 587 + this.rgba.b * 114) / 1000;
		return yiq >= 128;
	}

	isLighterThan(another: Color): boolean {
		const lum1 = this.getRelativeLuminance();
		const lum2 = another.getRelativeLuminance();
		return lum1 > lum2;
	}

	isDarkerThan(another: Color): boolean {
		const lum1 = this.getRelativeLuminance();
		const lum2 = another.getRelativeLuminance();
		return lum1 < lum2;
	}

	/**
	 * Based on xterm.js: https://github.com/xtermjs/xterm.js/blob/44f9fa39ae03e2ca6d28354d88a399608686770e/src/common/Color.ts#L288
	 *
	 * Given a foreground color and a background color, either increase or reduce the luminance of the
	 * foreground color until the specified contrast ratio is met. If pure white or black is hit
	 * without the contrast ratio being met, go the other direction using the background color as the
	 * foreground color and take either the first or second result depending on which has the higher
	 * contrast ratio.
	 *
	 * @param foreground The foreground color.
	 * @param ratio The contrast ratio to achieve.
	 * @returns The adjusted foreground color.
	 */
	ensureConstrast(foreground: Color, ratio: number): Color {
		const bgL = this.getRelativeLuminance();
		const fgL = foreground.getRelativeLuminance();
		const cr = this.getContrastRatio(foreground);
		if (cr < ratio) {
			if (fgL < bgL) {
				const resultA = this.reduceRelativeLuminace(foreground, ratio);
				const resultARatio = this.getContrastRatio(resultA);
				if (resultARatio < ratio) {
					const resultB = this.increaseRelativeLuminace(foreground, ratio);
					const resultBRatio = this.getContrastRatio(resultB);
					return resultARatio > resultBRatio ? resultA : resultB;
				}
				return resultA;
			}
			const resultA = this.increaseRelativeLuminace(foreground, ratio);
			const resultARatio = this.getContrastRatio(resultA);
			if (resultARatio < ratio) {
				const resultB = this.reduceRelativeLuminace(foreground, ratio);
				const resultBRatio = this.getContrastRatio(resultB);
				return resultARatio > resultBRatio ? resultA : resultB;
			}
			return resultA;
		}

		return foreground;
	}

	lighten(factor: number): Color {
		return new Color(new HSLA(this.hsla.h, this.hsla.s, this.hsla.l + this.hsla.l * factor, this.hsla.a));
	}

	darken(factor: number): Color {
		return new Color(new HSLA(this.hsla.h, this.hsla.s, this.hsla.l - this.hsla.l * factor, this.hsla.a));
	}

	transparent(factor: number): Color {
		const { r, g, b, a } = this.rgba;
		return new Color(new RGBA(r, g, b, a * factor));
	}

	isTransparent(): boolean {
		return this.rgba.a === 0;
	}

	isOpaque(): boolean {
		return this.rgba.a === 1;
	}

	opposite(): Color {
		return new Color(new RGBA(255 - this.rgba.r, 255 - this.rgba.g, 255 - this.rgba.b, this.rgba.a));
	}

	blend(c: Color): Color {
		const rgba = c.rgba;

		// Convert to 0..1 opacity
		const thisA = this.rgba.a;
		const colorA = rgba.a;

		const a = thisA + colorA * (1 - thisA);
		if (a < 1e-6) {
			return Color.transparent;
		}

		const r = this.rgba.r * thisA / a + rgba.r * colorA * (1 - thisA) / a;
		const g = this.rgba.g * thisA / a + rgba.g * colorA * (1 - thisA) / a;
		const b = this.rgba.b * thisA / a + rgba.b * colorA * (1 - thisA) / a;

		return new Color(new RGBA(r, g, b, a));
	}

	/**
	 * Mixes the current color with the provided color based on the given factor.
	 * @param color The color to mix with
	 * @param factor The factor of mixing (0 means this color, 1 means the input color, 0.5 means equal mix)
	 * @returns A new color representing the mix
	 */
	mix(color: Color, factor: number = 0.5): Color {
		const normalize = Math.min(Math.max(factor, 0), 1);
		const thisRGBA = this.rgba;
		const otherRGBA = color.rgba;

		const r = thisRGBA.r + (otherRGBA.r - thisRGBA.r) * normalize;
		const g = thisRGBA.g + (otherRGBA.g - thisRGBA.g) * normalize;
		const b = thisRGBA.b + (otherRGBA.b - thisRGBA.b) * normalize;
		const a = thisRGBA.a + (otherRGBA.a - thisRGBA.a) * normalize;

		return new Color(new RGBA(r, g, b, a));
	}

	makeOpaque(opaqueBackground: Color): Color {
		if (this.isOpaque() || opaqueBackground.rgba.a !== 1) {
			// only allow to blend onto a non-opaque color onto a opaque color
			return this;
		}

		const { r, g, b, a } = this.rgba;

		// https://stackoverflow.com/questions/12228548/finding-equivalent-color-with-opacity
		return new Color(new RGBA(
			opaqueBackground.rgba.r - a * (opaqueBackground.rgba.r - r),
			opaqueBackground.rgba.g - a * (opaqueBackground.rgba.g - g),
			opaqueBackground.rgba.b - a * (opaqueBackground.rgba.b - b),
			1
		));
	}

	flatten(...backgrounds: Color[]): Color {
		const background = backgrounds.reduceRight((accumulator, color) => {
			return Color._flatten(color, accumulator);
		});
		return Color._flatten(this, background);
	}

	private static _flatten(foreground: Color, background: Color) {
		const backgroundAlpha = 1 - foreground.rgba.a;
		return new Color(new RGBA(
			backgroundAlpha * background.rgba.r + foreground.rgba.a * foreground.rgba.r,
			backgroundAlpha * background.rgba.g + foreground.rgba.a * foreground.rgba.g,
			backgroundAlpha * background.rgba.b + foreground.rgba.a * foreground.rgba.b
		));
	}

	private _toString?: string;
	toString(): string {
		if (!this._toString) {
			this._toString = Color.Format.CSS.format(this);
		}
		return this._toString;
	}

	private _toNumber32Bit?: number;
	toNumber32Bit(): number {
		if (!this._toNumber32Bit) {
			this._toNumber32Bit = (
				this.rgba.r /*  */ << 24 |
				this.rgba.g /*  */ << 16 |
				this.rgba.b /*  */ << 8 |
				this.rgba.a * 0xFF << 0
			) >>> 0;
		}
		return this._toNumber32Bit;
	}

	static getLighterColor(of: Color, relative: Color, factor?: number): Color {
		if (of.isLighterThan(relative)) {
			return of;
		}
		factor = factor ? factor : 0.5;
		const lum1 = of.getRelativeLuminance();
		const lum2 = relative.getRelativeLuminance();
		factor = factor * (lum2 - lum1) / lum2;
		return of.lighten(factor);
	}

	static getDarkerColor(of: Color, relative: Color, factor?: number): Color {
		if (of.isDarkerThan(relative)) {
			return of;
		}
		factor = factor ? factor : 0.5;
		const lum1 = of.getRelativeLuminance();
		const lum2 = relative.getRelativeLuminance();
		factor = factor * (lum1 - lum2) / lum1;
		return of.darken(factor);
	}

	static readonly white = new Color(new RGBA(255, 255, 255, 1));
	static readonly black = new Color(new RGBA(0, 0, 0, 1));
	static readonly red = new Color(new RGBA(255, 0, 0, 1));
	static readonly blue = new Color(new RGBA(0, 0, 255, 1));
	static readonly green = new Color(new RGBA(0, 255, 0, 1));
	static readonly cyan = new Color(new RGBA(0, 255, 255, 1));
	static readonly lightgrey = new Color(new RGBA(211, 211, 211, 1));
	static readonly transparent = new Color(new RGBA(0, 0, 0, 0));
}

export namespace Color {
	export namespace Format {
		export namespace CSS {

			export function formatRGB(color: Color): string {
				if (color.rgba.a === 1) {
					return `rgb(${color.rgba.r}, ${color.rgba.g}, ${color.rgba.b})`;
				}

				return Color.Format.CSS.formatRGBA(color);
			}

			export function formatRGBA(color: Color): string {
				return `rgba(${color.rgba.r}, ${color.rgba.g}, ${color.rgba.b}, ${+(color.rgba.a).toFixed(2)})`;
			}

			export function formatHSL(color: Color): string {
				if (color.hsla.a === 1) {
					return `hsl(${color.hsla.h}, ${Math.round(color.hsla.s * 100)}%, ${Math.round(color.hsla.l * 100)}%)`;
				}

				return Color.Format.CSS.formatHSLA(color);
			}

			export function formatHSLA(color: Color): string {
				return `hsla(${color.hsla.h}, ${Math.round(color.hsla.s * 100)}%, ${Math.round(color.hsla.l * 100)}%, ${color.hsla.a.toFixed(2)})`;
			}

			function _toTwoDigitHex(n: number): string {
				const r = n.toString(16);
				return r.length !== 2 ? '0' + r : r;
			}

			/**
			 * Formats the color as #RRGGBB
			 */
			export function formatHex(color: Color): string {
				return `#${_toTwoDigitHex(color.rgba.r)}${_toTwoDigitHex(color.rgba.g)}${_toTwoDigitHex(color.rgba.b)}`;
			}

			/**
			 * Formats the color as #RRGGBBAA
			 * If 'compact' is set, colors without transparancy will be printed as #RRGGBB
			 */
			export function formatHexA(color: Color, compact = false): string {
				if (compact && color.rgba.a === 1) {
					return Color.Format.CSS.formatHex(color);
				}

				return `#${_toTwoDigitHex(color.rgba.r)}${_toTwoDigitHex(color.rgba.g)}${_toTwoDigitHex(color.rgba.b)}${_toTwoDigitHex(Math.round(color.rgba.a * 255))}`;
			}

			/**
			 * The default format will use HEX if opaque and RGBA otherwise.
			 */
			export function format(color: Color): string {
				if (color.isOpaque()) {
					return Color.Format.CSS.formatHex(color);
				}

				return Color.Format.CSS.formatRGBA(color);
			}

			/**
			 * Parse a CSS color and return a {@link Color}.
			 * @param css The CSS color to parse.
			 * @see https://drafts.csswg.org/css-color/#typedef-color
			 */
			export function parse(css: string): Color | null {
				if (css === 'transparent') {
					return Color.transparent;
				}
				if (css.startsWith('#')) {
					return parseHex(css);
				}
				if (css.startsWith('rgba(')) {
					const color = css.match(/rgba\((?<r>(?:\+|-)?\d+), *(?<g>(?:\+|-)?\d+), *(?<b>(?:\+|-)?\d+), *(?<a>(?:\+|-)?\d+(\.\d+)?)\)/);
					if (!color) {
						throw new Error('Invalid color format ' + css);
					}
					const r = parseInt(color.groups?.r ?? '0');
					const g = parseInt(color.groups?.g ?? '0');
					const b = parseInt(color.groups?.b ?? '0');
					const a = parseFloat(color.groups?.a ?? '0');
					return new Color(new RGBA(r, g, b, a));
				}
				if (css.startsWith('rgb(')) {
					const color = css.match(/rgb\((?<r>(?:\+|-)?\d+), *(?<g>(?:\+|-)?\d+), *(?<b>(?:\+|-)?\d+)\)/);
					if (!color) {
						throw new Error('Invalid color format ' + css);
					}
					const r = parseInt(color.groups?.r ?? '0');
					const g = parseInt(color.groups?.g ?? '0');
					const b = parseInt(color.groups?.b ?? '0');
					return new Color(new RGBA(r, g, b));
				}
				// TODO: Support more formats as needed
				return parseNamedKeyword(css);
			}

			function parseNamedKeyword(css: string): Color | null {
				// https://drafts.csswg.org/css-color/#named-colors
				switch (css) {
					case 'aliceblue': return new Color(new RGBA(240, 248, 255, 1));
					case 'antiquewhite': return new Color(new RGBA(250, 235, 215, 1));
					case 'aqua': return new Color(new RGBA(0, 255, 255, 1));
					case 'aquamarine': return new Color(new RGBA(127, 255, 212, 1));
					case 'azure': return new Color(new RGBA(240, 255, 255, 1));
					case 'beige': return new Color(new RGBA(245, 245, 220, 1));
					case 'bisque': return new Color(new RGBA(255, 228, 196, 1));
					case 'black': return new Color(new RGBA(0, 0, 0, 1));
					case 'blanchedalmond': return new Color(new RGBA(255, 235, 205, 1));
					case 'blue': return new Color(new RGBA(0, 0, 255, 1));
					case 'blueviolet': return new Color(new RGBA(138, 43, 226, 1));
					case 'brown': return new Color(new RGBA(165, 42, 42, 1));
					case 'burlywood': return new Color(new RGBA(222, 184, 135, 1));
					case 'cadetblue': return new Color(new RGBA(95, 158, 160, 1));
					case 'chartreuse': return new Color(new RGBA(127, 255, 0, 1));
					case 'chocolate': return new Color(new RGBA(210, 105, 30, 1));
					case 'coral': return new Color(new RGBA(255, 127, 80, 1));
					case 'cornflowerblue': return new Color(new RGBA(100, 149, 237, 1));
					case 'cornsilk': return new Color(new RGBA(255, 248, 220, 1));
					case 'crimson': return new Color(new RGBA(220, 20, 60, 1));
					case 'cyan': return new Color(new RGBA(0, 255, 255, 1));
					case 'darkblue': return new Color(new RGBA(0, 0, 139, 1));
					case 'darkcyan': return new Color(new RGBA(0, 139, 139, 1));
					case 'darkgoldenrod': return new Color(new RGBA(184, 134, 11, 1));
					case 'darkgray': return new Color(new RGBA(169, 169, 169, 1));
					case 'darkgreen': return new Color(new RGBA(0, 100, 0, 1));
					case 'darkgrey': return new Color(new RGBA(169, 169, 169, 1));
					case 'darkkhaki': return new Color(new RGBA(189, 183, 107, 1));
					case 'darkmagenta': return new Color(new RGBA(139, 0, 139, 1));
					case 'darkolivegreen': return new Color(new RGBA(85, 107, 47, 1));
					case 'darkorange': return new Color(new RGBA(255, 140, 0, 1));
					case 'darkorchid': return new Color(new RGBA(153, 50, 204, 1));
					case 'darkred': return new Color(new RGBA(139, 0, 0, 1));
					case 'darksalmon': return new Color(new RGBA(233, 150, 122, 1));
					case 'darkseagreen': return new Color(new RGBA(143, 188, 143, 1));
					case 'darkslateblue': return new Color(new RGBA(72, 61, 139, 1));
					case 'darkslategray': return new Color(new RGBA(47, 79, 79, 1));
					case 'darkslategrey': return new Color(new RGBA(47, 79, 79, 1));
					case 'darkturquoise': return new Color(new RGBA(0, 206, 209, 1));
					case 'darkviolet': return new Color(new RGBA(148, 0, 211, 1));
					case 'deeppink': return new Color(new RGBA(255, 20, 147, 1));
					case 'deepskyblue': return new Color(new RGBA(0, 191, 255, 1));
					case 'dimgray': return new Color(new RGBA(105, 105, 105, 1));
					case 'dimgrey': return new Color(new RGBA(105, 105, 105, 1));
					case 'dodgerblue': return new Color(new RGBA(30, 144, 255, 1));
					case 'firebrick': return new Color(new RGBA(178, 34, 34, 1));
					case 'floralwhite': return new Color(new RGBA(255, 250, 240, 1));
					case 'forestgreen': return new Color(new RGBA(34, 139, 34, 1));
					case 'fuchsia': return new Color(new RGBA(255, 0, 255, 1));
					case 'gainsboro': return new Color(new RGBA(220, 220, 220, 1));
					case 'ghostwhite': return new Color(new RGBA(248, 248, 255, 1));
					case 'gold': return new Color(new RGBA(255, 215, 0, 1));
					case 'goldenrod': return new Color(new RGBA(218, 165, 32, 1));
					case 'gray': return new Color(new RGBA(128, 128, 128, 1));
					case 'green': return new Color(new RGBA(0, 128, 0, 1));
					case 'greenyellow': return new Color(new RGBA(173, 255, 47, 1));
					case 'grey': return new Color(new RGBA(128, 128, 128, 1));
					case 'honeydew': return new Color(new RGBA(240, 255, 240, 1));
					case 'hotpink': return new Color(new RGBA(255, 105, 180, 1));
					case 'indianred': return new Color(new RGBA(205, 92, 92, 1));
					case 'indigo': return new Color(new RGBA(75, 0, 130, 1));
					case 'ivory': return new Color(new RGBA(255, 255, 240, 1));
					case 'khaki': return new Color(new RGBA(240, 230, 140, 1));
					case 'lavender': return new Color(new RGBA(230, 230, 250, 1));
					case 'lavenderblush': return new Color(new RGBA(255, 240, 245, 1));
					case 'lawngreen': return new Color(new RGBA(124, 252, 0, 1));
					case 'lemonchiffon': return new Color(new RGBA(255, 250, 205, 1));
					case 'lightblue': return new Color(new RGBA(173, 216, 230, 1));
					case 'lightcoral': return new Color(new RGBA(240, 128, 128, 1));
					case 'lightcyan': return new Color(new RGBA(224, 255, 255, 1));
					case 'lightgoldenrodyellow': return new Color(new RGBA(250, 250, 210, 1));
					case 'lightgray': return new Color(new RGBA(211, 211, 211, 1));
					case 'lightgreen': return new Color(new RGBA(144, 238, 144, 1));
					case 'lightgrey': return new Color(new RGBA(211, 211, 211, 1));
					case 'lightpink': return new Color(new RGBA(255, 182, 193, 1));
					case 'lightsalmon': return new Color(new RGBA(255, 160, 122, 1));
					case 'lightseagreen': return new Color(new RGBA(32, 178, 170, 1));
					case 'lightskyblue': return new Color(new RGBA(135, 206, 250, 1));
					case 'lightslategray': return new Color(new RGBA(119, 136, 153, 1));
					case 'lightslategrey': return new Color(new RGBA(119, 136, 153, 1));
					case 'lightsteelblue': return new Color(new RGBA(176, 196, 222, 1));
					case 'lightyellow': return new Color(new RGBA(255, 255, 224, 1));
					case 'lime': return new Color(new RGBA(0, 255, 0, 1));
					case 'limegreen': return new Color(new RGBA(50, 205, 50, 1));
					case 'linen': return new Color(new RGBA(250, 240, 230, 1));
					case 'magenta': return new Color(new RGBA(255, 0, 255, 1));
					case 'maroon': return new Color(new RGBA(128, 0, 0, 1));
					case 'mediumaquamarine': return new Color(new RGBA(102, 205, 170, 1));
					case 'mediumblue': return new Color(new RGBA(0, 0, 205, 1));
					case 'mediumorchid': return new Color(new RGBA(186, 85, 211, 1));
					case 'mediumpurple': return new Color(new RGBA(147, 112, 219, 1));
					case 'mediumseagreen': return new Color(new RGBA(60, 179, 113, 1));
					case 'mediumslateblue': return new Color(new RGBA(123, 104, 238, 1));
					case 'mediumspringgreen': return new Color(new RGBA(0, 250, 154, 1));
					case 'mediumturquoise': return new Color(new RGBA(72, 209, 204, 1));
					case 'mediumvioletred': return new Color(new RGBA(199, 21, 133, 1));
					case 'midnightblue': return new Color(new RGBA(25, 25, 112, 1));
					case 'mintcream': return new Color(new RGBA(245, 255, 250, 1));
					case 'mistyrose': return new Color(new RGBA(255, 228, 225, 1));
					case 'moccasin': return new Color(new RGBA(255, 228, 181, 1));
					case 'navajowhite': return new Color(new RGBA(255, 222, 173, 1));
					case 'navy': return new Color(new RGBA(0, 0, 128, 1));
					case 'oldlace': return new Color(new RGBA(253, 245, 230, 1));
					case 'olive': return new Color(new RGBA(128, 128, 0, 1));
					case 'olivedrab': return new Color(new RGBA(107, 142, 35, 1));
					case 'orange': return new Color(new RGBA(255, 165, 0, 1));
					case 'orangered': return new Color(new RGBA(255, 69, 0, 1));
					case 'orchid': return new Color(new RGBA(218, 112, 214, 1));
					case 'palegoldenrod': return new Color(new RGBA(238, 232, 170, 1));
					case 'palegreen': return new Color(new RGBA(152, 251, 152, 1));
					case 'paleturquoise': return new Color(new RGBA(175, 238, 238, 1));
					case 'palevioletred': return new Color(new RGBA(219, 112, 147, 1));
					case 'papayawhip': return new Color(new RGBA(255, 239, 213, 1));
					case 'peachpuff': return new Color(new RGBA(255, 218, 185, 1));
					case 'peru': return new Color(new RGBA(205, 133, 63, 1));
					case 'pink': return new Color(new RGBA(255, 192, 203, 1));
					case 'plum': return new Color(new RGBA(221, 160, 221, 1));
					case 'powderblue': return new Color(new RGBA(176, 224, 230, 1));
					case 'purple': return new Color(new RGBA(128, 0, 128, 1));
					case 'rebeccapurple': return new Color(new RGBA(102, 51, 153, 1));
					case 'red': return new Color(new RGBA(255, 0, 0, 1));
					case 'rosybrown': return new Color(new RGBA(188, 143, 143, 1));
					case 'royalblue': return new Color(new RGBA(65, 105, 225, 1));
					case 'saddlebrown': return new Color(new RGBA(139, 69, 19, 1));
					case 'salmon': return new Color(new RGBA(250, 128, 114, 1));
					case 'sandybrown': return new Color(new RGBA(244, 164, 96, 1));
					case 'seagreen': return new Color(new RGBA(46, 139, 87, 1));
					case 'seashell': return new Color(new RGBA(255, 245, 238, 1));
					case 'sienna': return new Color(new RGBA(160, 82, 45, 1));
					case 'silver': return new Color(new RGBA(192, 192, 192, 1));
					case 'skyblue': return new Color(new RGBA(135, 206, 235, 1));
					case 'slateblue': return new Color(new RGBA(106, 90, 205, 1));
					case 'slategray': return new Color(new RGBA(112, 128, 144, 1));
					case 'slategrey': return new Color(new RGBA(112, 128, 144, 1));
					case 'snow': return new Color(new RGBA(255, 250, 250, 1));
					case 'springgreen': return new Color(new RGBA(0, 255, 127, 1));
					case 'steelblue': return new Color(new RGBA(70, 130, 180, 1));
					case 'tan': return new Color(new RGBA(210, 180, 140, 1));
					case 'teal': return new Color(new RGBA(0, 128, 128, 1));
					case 'thistle': return new Color(new RGBA(216, 191, 216, 1));
					case 'tomato': return new Color(new RGBA(255, 99, 71, 1));
					case 'turquoise': return new Color(new RGBA(64, 224, 208, 1));
					case 'violet': return new Color(new RGBA(238, 130, 238, 1));
					case 'wheat': return new Color(new RGBA(245, 222, 179, 1));
					case 'white': return new Color(new RGBA(255, 255, 255, 1));
					case 'whitesmoke': return new Color(new RGBA(245, 245, 245, 1));
					case 'yellow': return new Color(new RGBA(255, 255, 0, 1));
					case 'yellowgreen': return new Color(new RGBA(154, 205, 50, 1));
					default: return null;
				}
			}

			/**
			 * Converts an Hex color value to a Color.
			 * returns r, g, and b are contained in the set [0, 255]
			 * @param hex string (#RGB, #RGBA, #RRGGBB or #RRGGBBAA).
			 */
			export function parseHex(hex: string): Color | null {
				const length = hex.length;

				if (length === 0) {
					// Invalid color
					return null;
				}

				if (hex.charCodeAt(0) !== CharCode.Hash) {
					// Does not begin with a #
					return null;
				}

				if (length === 7) {
					// #RRGGBB format
					const r = 16 * _parseHexDigit(hex.charCodeAt(1)) + _parseHexDigit(hex.charCodeAt(2));
					const g = 16 * _parseHexDigit(hex.charCodeAt(3)) + _parseHexDigit(hex.charCodeAt(4));
					const b = 16 * _parseHexDigit(hex.charCodeAt(5)) + _parseHexDigit(hex.charCodeAt(6));
					return new Color(new RGBA(r, g, b, 1));
				}

				if (length === 9) {
					// #RRGGBBAA format
					const r = 16 * _parseHexDigit(hex.charCodeAt(1)) + _parseHexDigit(hex.charCodeAt(2));
					const g = 16 * _parseHexDigit(hex.charCodeAt(3)) + _parseHexDigit(hex.charCodeAt(4));
					const b = 16 * _parseHexDigit(hex.charCodeAt(5)) + _parseHexDigit(hex.charCodeAt(6));
					const a = 16 * _parseHexDigit(hex.charCodeAt(7)) + _parseHexDigit(hex.charCodeAt(8));
					return new Color(new RGBA(r, g, b, a / 255));
				}

				if (length === 4) {
					// #RGB format
					const r = _parseHexDigit(hex.charCodeAt(1));
					const g = _parseHexDigit(hex.charCodeAt(2));
					const b = _parseHexDigit(hex.charCodeAt(3));
					return new Color(new RGBA(16 * r + r, 16 * g + g, 16 * b + b));
				}

				if (length === 5) {
					// #RGBA format
					const r = _parseHexDigit(hex.charCodeAt(1));
					const g = _parseHexDigit(hex.charCodeAt(2));
					const b = _parseHexDigit(hex.charCodeAt(3));
					const a = _parseHexDigit(hex.charCodeAt(4));
					return new Color(new RGBA(16 * r + r, 16 * g + g, 16 * b + b, (16 * a + a) / 255));
				}

				// Invalid color
				return null;
			}

			function _parseHexDigit(charCode: CharCode): number {
				switch (charCode) {
					case CharCode.Digit0: return 0;
					case CharCode.Digit1: return 1;
					case CharCode.Digit2: return 2;
					case CharCode.Digit3: return 3;
					case CharCode.Digit4: return 4;
					case CharCode.Digit5: return 5;
					case CharCode.Digit6: return 6;
					case CharCode.Digit7: return 7;
					case CharCode.Digit8: return 8;
					case CharCode.Digit9: return 9;
					case CharCode.a: return 10;
					case CharCode.A: return 10;
					case CharCode.b: return 11;
					case CharCode.B: return 11;
					case CharCode.c: return 12;
					case CharCode.C: return 12;
					case CharCode.d: return 13;
					case CharCode.D: return 13;
					case CharCode.e: return 14;
					case CharCode.E: return 14;
					case CharCode.f: return 15;
					case CharCode.F: return 15;
				}
				return 0;
			}
		}
	}
}
```

--------------------------------------------------------------------------------

````
