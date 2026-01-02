---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 180
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 180 of 552)

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

---[FILE: src/vs/base/common/observableInternal/logging/debugger/rpc.ts]---
Location: vscode-main/src/vs/base/common/observableInternal/logging/debugger/rpc.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export type ChannelFactory = (handler: IChannelHandler) => IChannel;

export interface IChannel {
	sendNotification(data: unknown): void;
	sendRequest(data: unknown): Promise<RpcRequestResult>;
}

export interface IChannelHandler {
	handleNotification(notificationData: unknown): void;
	handleRequest(requestData: unknown): Promise<RpcRequestResult> | RpcRequestResult;
}

export type RpcRequestResult = { type: 'result'; value: unknown } | { type: 'error'; value: unknown };

export type API = {
	host: Side;
	client: Side;
};

export type Side = {
	notifications: Record<string, (...args: any[]) => void>;
	requests: Record<string, (...args: any[]) => Promise<unknown> | unknown>;
};

type MakeAsyncIfNot<TFn> = TFn extends (...args: infer TArgs) => infer TResult ? TResult extends Promise<unknown> ? TFn : (...args: TArgs) => Promise<TResult> : never;

export type MakeSideAsync<T extends Side> = {
	notifications: T['notifications'];
	requests: { [K in keyof T['requests']]: MakeAsyncIfNot<T['requests'][K]> };
};

export class SimpleTypedRpcConnection<T extends Side> {
	public static createHost<T extends API>(channelFactory: ChannelFactory, getHandler: () => T['host']): SimpleTypedRpcConnection<MakeSideAsync<T['client']>> {
		return new SimpleTypedRpcConnection(channelFactory, getHandler);
	}

	public static createClient<T extends API>(channelFactory: ChannelFactory, getHandler: () => T['client']): SimpleTypedRpcConnection<MakeSideAsync<T['host']>> {
		return new SimpleTypedRpcConnection(channelFactory, getHandler);
	}

	public readonly api: T;
	private readonly _channel: IChannel;

	private constructor(
		private readonly _channelFactory: ChannelFactory,
		private readonly _getHandler: () => Side,
	) {
		this._channel = this._channelFactory({
			handleNotification: (notificationData) => {
				const m = notificationData as OutgoingMessage;
				const fn = this._getHandler().notifications[m[0]];
				if (!fn) {
					throw new Error(`Unknown notification "${m[0]}"!`);
				}
				fn(...m[1]);
			},
			handleRequest: (requestData) => {
				const m = requestData as OutgoingMessage;
				try {
					const result = this._getHandler().requests[m[0]](...m[1]);
					return { type: 'result', value: result };
				} catch (e) {
					return { type: 'error', value: e };
				}
			},
		});

		const requests = new Proxy({}, {
			get: (target, key: string) => {
				return async (...args: any[]) => {
					const result = await this._channel.sendRequest([key, args] satisfies OutgoingMessage);
					if (result.type === 'error') {
						throw result.value;
					} else {
						return result.value;
					}
				};
			}
		});

		const notifications = new Proxy({}, {
			get: (target, key: string) => {
				return (...args: any[]) => {
					this._channel.sendNotification([key, args] satisfies OutgoingMessage);
				};
			}
		});

		// eslint-disable-next-line local/code-no-any-casts
		this.api = { notifications: notifications, requests: requests } as any;
	}
}

type OutgoingMessage = [
	method: string,
	args: unknown[],
];
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/observableInternal/logging/debugger/utils.ts]---
Location: vscode-main/src/vs/base/common/observableInternal/logging/debugger/utils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable } from '../../../lifecycle.js';

export class Debouncer implements IDisposable {
	private _timeout: Timeout | undefined = undefined;

	public debounce(fn: () => void, timeoutMs: number): void {
		if (this._timeout !== undefined) {
			clearTimeout(this._timeout);
		}
		this._timeout = setTimeout(() => {
			this._timeout = undefined;
			fn();
		}, timeoutMs);
	}

	dispose(): void {
		if (this._timeout !== undefined) {
			clearTimeout(this._timeout);
		}
	}
}

export class Throttler implements IDisposable {
	private _timeout: Timeout | undefined = undefined;

	public throttle(fn: () => void, timeoutMs: number): void {
		if (this._timeout === undefined) {
			this._timeout = setTimeout(() => {
				this._timeout = undefined;
				fn();
			}, timeoutMs);
		}
	}

	dispose(): void {
		if (this._timeout !== undefined) {
			clearTimeout(this._timeout);
		}
	}
}

export function deepAssign<T>(target: T, source: T): void {
	for (const key in source) {
		if (!!target[key] && typeof target[key] === 'object' && !!source[key] && typeof source[key] === 'object') {
			deepAssign(target[key], source[key]);
		} else {
			target[key] = source[key];
		}
	}
}

export function deepAssignDeleteNulls<T>(target: T, source: T): void {
	for (const key in source) {
		if (source[key] === null) {
			delete target[key];
		} else if (!!target[key] && typeof target[key] === 'object' && !!source[key] && typeof source[key] === 'object') {
			deepAssignDeleteNulls(target[key], source[key]);
		} else {
			target[key] = source[key];
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/observableInternal/observables/baseObservable.ts]---
Location: vscode-main/src/vs/base/common/observableInternal/observables/baseObservable.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IObservableWithChange, IObserver, IReader, IObservable } from '../base.js';
import { DisposableStore } from '../commonFacade/deps.js';
import { DebugLocation } from '../debugLocation.js';
import { DebugOwner, getFunctionName } from '../debugName.js';
import { debugGetObservableGraph } from '../logging/debugGetDependencyGraph.js';
import { getLogger, logObservable } from '../logging/logging.js';
import type { keepObserved, recomputeInitiallyAndOnChange } from '../utils/utils.js';
import { derivedOpts } from './derived.js';

let _derived: typeof derivedOpts;
/**
 * @internal
 * This is to allow splitting files.
*/
export function _setDerivedOpts(derived: typeof _derived) {
	_derived = derived;
}

let _recomputeInitiallyAndOnChange: typeof recomputeInitiallyAndOnChange;
export function _setRecomputeInitiallyAndOnChange(recomputeInitiallyAndOnChange: typeof _recomputeInitiallyAndOnChange) {
	_recomputeInitiallyAndOnChange = recomputeInitiallyAndOnChange;
}

let _keepObserved: typeof keepObserved;
export function _setKeepObserved(keepObserved: typeof _keepObserved) {
	_keepObserved = keepObserved;
}

let _debugGetObservableGraph: typeof debugGetObservableGraph;
export function _setDebugGetObservableGraph(debugGetObservableGraph: typeof _debugGetObservableGraph) {
	_debugGetObservableGraph = debugGetObservableGraph;
}

export abstract class ConvenientObservable<T, TChange> implements IObservableWithChange<T, TChange> {
	get TChange(): TChange { return null!; }

	public abstract get(): T;

	public reportChanges(): void {
		this.get();
	}

	public abstract addObserver(observer: IObserver): void;
	public abstract removeObserver(observer: IObserver): void;

	/** @sealed */
	public read(reader: IReader | undefined): T {
		if (reader) {
			return reader.readObservable(this);
		} else {
			return this.get();
		}
	}

	/** @sealed */
	public map<TNew>(fn: (value: T, reader: IReader) => TNew): IObservable<TNew>;
	public map<TNew>(owner: DebugOwner, fn: (value: T, reader: IReader) => TNew): IObservable<TNew>;
	public map<TNew>(fnOrOwner: DebugOwner | ((value: T, reader: IReader) => TNew), fnOrUndefined?: (value: T, reader: IReader) => TNew, debugLocation: DebugLocation = DebugLocation.ofCaller()): IObservable<TNew> {
		const owner = fnOrUndefined === undefined ? undefined : fnOrOwner as DebugOwner;
		const fn = fnOrUndefined === undefined ? fnOrOwner as (value: T, reader: IReader) => TNew : fnOrUndefined;

		return _derived(
			{
				owner,
				debugName: () => {
					const name = getFunctionName(fn);
					if (name !== undefined) {
						return name;
					}

					// regexp to match `x => x.y` or `x => x?.y` where x and y can be arbitrary identifiers (uses backref):
					const regexp = /^\s*\(?\s*([a-zA-Z_$][a-zA-Z_$0-9]*)\s*\)?\s*=>\s*\1(?:\??)\.([a-zA-Z_$][a-zA-Z_$0-9]*)\s*$/;
					const match = regexp.exec(fn.toString());
					if (match) {
						return `${this.debugName}.${match[2]}`;
					}
					if (!owner) {
						return `${this.debugName} (mapped)`;
					}
					return undefined;
				},
				debugReferenceFn: fn,
			},
			(reader) => fn(this.read(reader), reader),
			debugLocation,
		);
	}

	public abstract log(): IObservableWithChange<T, TChange>;

	/**
	 * @sealed
	 * Converts an observable of an observable value into a direct observable of the value.
	*/
	public flatten<TNew>(this: IObservable<IObservableWithChange<TNew, any>>): IObservable<TNew> {
		return _derived(
			{
				owner: undefined,
				debugName: () => `${this.debugName} (flattened)`,
			},
			(reader) => this.read(reader).read(reader)
		);
	}

	public recomputeInitiallyAndOnChange(store: DisposableStore, handleValue?: (value: T) => void): IObservable<T> {
		store.add(_recomputeInitiallyAndOnChange!(this, handleValue));
		return this;
	}

	/**
	 * Ensures that this observable is observed. This keeps the cache alive.
	 * However, in case of deriveds, it does not force eager evaluation (only when the value is read/get).
	 * Use `recomputeInitiallyAndOnChange` for eager evaluation.
	 */
	public keepObserved(store: DisposableStore): IObservable<T> {
		store.add(_keepObserved!(this));
		return this;
	}

	public abstract get debugName(): string;

	protected get debugValue() {
		return this.get();
	}

	get debug(): DebugHelper {
		return new DebugHelper(this);
	}
}

class DebugHelper {
	constructor(public readonly observable: IObservableWithChange<any, any>) {
	}

	getDependencyGraph(): string {
		return _debugGetObservableGraph(this.observable, { type: 'dependencies' });
	}

	getObserverGraph(): string {
		return _debugGetObservableGraph(this.observable, { type: 'observers' });
	}
}

export abstract class BaseObservable<T, TChange = void> extends ConvenientObservable<T, TChange> {
	protected readonly _observers = new Set<IObserver>();

	constructor(debugLocation: DebugLocation) {
		super();
		getLogger()?.handleObservableCreated(this, debugLocation);
	}

	public addObserver(observer: IObserver): void {
		const len = this._observers.size;
		this._observers.add(observer);
		if (len === 0) {
			this.onFirstObserverAdded();
		}
		if (len !== this._observers.size) {
			getLogger()?.handleOnListenerCountChanged(this, this._observers.size);
		}
	}

	public removeObserver(observer: IObserver): void {
		const deleted = this._observers.delete(observer);
		if (deleted && this._observers.size === 0) {
			this.onLastObserverRemoved();
		}
		if (deleted) {
			getLogger()?.handleOnListenerCountChanged(this, this._observers.size);
		}
	}

	protected onFirstObserverAdded(): void { }
	protected onLastObserverRemoved(): void { }

	public override log(): IObservableWithChange<T, TChange> {
		const hadLogger = !!getLogger();
		logObservable(this);
		if (!hadLogger) {
			getLogger()?.handleObservableCreated(this, DebugLocation.ofCaller());
		}
		return this;
	}

	public debugGetObservers() {
		return this._observers;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/observableInternal/observables/constObservable.ts]---
Location: vscode-main/src/vs/base/common/observableInternal/observables/constObservable.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IObservable, IObserver, IObservableWithChange } from '../base.js';
import { ConvenientObservable } from './baseObservable.js';

/**
 * Represents an efficient observable whose value never changes.
 */

export function constObservable<T>(value: T): IObservable<T> {
	return new ConstObservable(value);
}
class ConstObservable<T> extends ConvenientObservable<T, void> {
	constructor(private readonly value: T) {
		super();
	}

	public override get debugName(): string {
		return this.toString();
	}

	public get(): T {
		return this.value;
	}
	public addObserver(observer: IObserver): void {
		// NO OP
	}
	public removeObserver(observer: IObserver): void {
		// NO OP
	}

	override log(): IObservableWithChange<T, void> {
		return this;
	}

	override toString(): string {
		return `Const: ${this.value}`;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/observableInternal/observables/derived.ts]---
Location: vscode-main/src/vs/base/common/observableInternal/observables/derived.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IObservable, IReader, ITransaction, ISettableObservable, IObservableWithChange } from '../base.js';
import { IChangeTracker } from '../changeTracker.js';
import { DisposableStore, EqualityComparer, IDisposable, strictEquals } from '../commonFacade/deps.js';
import { DebugLocation } from '../debugLocation.js';
import { DebugOwner, DebugNameData, IDebugNameData } from '../debugName.js';
import { _setDerivedOpts } from './baseObservable.js';
import { IDerivedReader, Derived, DerivedWithSetter } from './derivedImpl.js';

/**
 * Creates an observable that is derived from other observables.
 * The value is only recomputed when absolutely needed.
 *
 * {@link computeFn} should start with a JS Doc using `@description` to name the derived.
 */
export function derived<T, TChange = void>(computeFn: (reader: IDerivedReader<TChange>, debugLocation?: DebugLocation) => T): IObservableWithChange<T, TChange>;
export function derived<T, TChange = void>(owner: DebugOwner, computeFn: (reader: IDerivedReader<TChange>) => T, debugLocation?: DebugLocation): IObservableWithChange<T, TChange>;
export function derived<T, TChange = void>(
	computeFnOrOwner: ((reader: IDerivedReader<TChange>) => T) | DebugOwner,
	computeFn?: ((reader: IDerivedReader<TChange>) => T) | undefined,
	debugLocation = DebugLocation.ofCaller()
): IObservable<T> {
	if (computeFn !== undefined) {
		return new Derived(
			new DebugNameData(computeFnOrOwner, undefined, computeFn),
			computeFn,
			undefined,
			undefined,
			strictEquals,
			debugLocation,
		);
	}
	return new Derived(
		// eslint-disable-next-line local/code-no-any-casts
		new DebugNameData(undefined, undefined, computeFnOrOwner as any),
		// eslint-disable-next-line local/code-no-any-casts
		computeFnOrOwner as any,
		undefined,
		undefined,
		strictEquals,
		debugLocation,
	);
}

export function derivedWithSetter<T>(owner: DebugOwner | undefined, computeFn: (reader: IReader) => T, setter: (value: T, transaction: ITransaction | undefined) => void, debugLocation = DebugLocation.ofCaller()): ISettableObservable<T> {
	return new DerivedWithSetter(
		new DebugNameData(owner, undefined, computeFn),
		computeFn,
		undefined,
		undefined,
		strictEquals,
		setter,
		debugLocation
	);
}

export function derivedOpts<T>(
	options: IDebugNameData & {
		equalsFn?: EqualityComparer<T>;
		onLastObserverRemoved?: (() => void);
	},
	computeFn: (reader: IReader) => T,
	debugLocation = DebugLocation.ofCaller()
): IObservable<T> {
	return new Derived(
		new DebugNameData(options.owner, options.debugName, options.debugReferenceFn),
		computeFn,
		undefined,
		options.onLastObserverRemoved,
		options.equalsFn ?? strictEquals,
		debugLocation
	);
}
_setDerivedOpts(derivedOpts);

/**
 * Represents an observable that is derived from other observables.
 * The value is only recomputed when absolutely needed.
 *
 * {@link computeFn} should start with a JS Doc using `@description` to name the derived.
 *
 * Use `createEmptyChangeSummary` to create a "change summary" that can collect the changes.
 * Use `handleChange` to add a reported change to the change summary.
 * The compute function is given the last change summary.
 * The change summary is discarded after the compute function was called.
 *
 * @see derived
 */
export function derivedHandleChanges<T, TDelta, TChangeSummary>(
	options: IDebugNameData & {
		changeTracker: IChangeTracker<TChangeSummary>;
		equalityComparer?: EqualityComparer<T>;
	},
	computeFn: (reader: IDerivedReader<TDelta>, changeSummary: TChangeSummary) => T,
	debugLocation = DebugLocation.ofCaller()
): IObservableWithChange<T, TDelta> {
	return new Derived(
		new DebugNameData(options.owner, options.debugName, undefined),
		computeFn,
		options.changeTracker,
		undefined,
		options.equalityComparer ?? strictEquals,
		debugLocation
	);
}

/**
 * @deprecated Use `derived(reader => { reader.store.add(...) })` instead!
*/
export function derivedWithStore<T>(computeFn: (reader: IReader, store: DisposableStore) => T): IObservable<T>;

/**
 * @deprecated Use `derived(reader => { reader.store.add(...) })` instead!
*/
export function derivedWithStore<T>(owner: DebugOwner, computeFn: (reader: IReader, store: DisposableStore) => T): IObservable<T>;
export function derivedWithStore<T>(computeFnOrOwner: ((reader: IReader, store: DisposableStore) => T) | DebugOwner, computeFnOrUndefined?: ((reader: IReader, store: DisposableStore) => T), debugLocation = DebugLocation.ofCaller()): IObservable<T> {
	let computeFn: (reader: IReader, store: DisposableStore) => T;
	let owner: DebugOwner;
	if (computeFnOrUndefined === undefined) {
		// eslint-disable-next-line local/code-no-any-casts
		computeFn = computeFnOrOwner as any;
		owner = undefined;
	} else {
		owner = computeFnOrOwner;
		// eslint-disable-next-line local/code-no-any-casts
		computeFn = computeFnOrUndefined as any;
	}

	// Intentionally re-assigned in case an inactive observable is re-used later
	// eslint-disable-next-line local/code-no-potentially-unsafe-disposables
	let store = new DisposableStore();

	return new Derived(
		new DebugNameData(owner, undefined, computeFn),
		r => {
			if (store.isDisposed) {
				store = new DisposableStore();
			} else {
				store.clear();
			}
			return computeFn(r, store);
		},
		undefined,
		() => store.dispose(),
		strictEquals,
		debugLocation
	);
}

export function derivedDisposable<T extends IDisposable | undefined>(computeFn: (reader: IReader) => T): IObservable<T>;
export function derivedDisposable<T extends IDisposable | undefined>(owner: DebugOwner, computeFn: (reader: IReader) => T): IObservable<T>;
export function derivedDisposable<T extends IDisposable | undefined>(computeFnOrOwner: ((reader: IReader) => T) | DebugOwner, computeFnOrUndefined?: ((reader: IReader) => T), debugLocation = DebugLocation.ofCaller()): IObservable<T> {
	let computeFn: (reader: IReader) => T;
	let owner: DebugOwner;
	if (computeFnOrUndefined === undefined) {
		// eslint-disable-next-line local/code-no-any-casts
		computeFn = computeFnOrOwner as any;
		owner = undefined;
	} else {
		owner = computeFnOrOwner;
		// eslint-disable-next-line local/code-no-any-casts
		computeFn = computeFnOrUndefined as any;
	}

	let store: DisposableStore | undefined = undefined;
	return new Derived(
		new DebugNameData(owner, undefined, computeFn),
		r => {
			if (!store) {
				store = new DisposableStore();
			} else {
				store.clear();
			}
			const result = computeFn(r);
			if (result) {
				store.add(result);
			}
			return result;
		},
		undefined,
		() => {
			if (store) {
				store.dispose();
				store = undefined;
			}
		},
		strictEquals,
		debugLocation
	);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/observableInternal/observables/derivedImpl.ts]---
Location: vscode-main/src/vs/base/common/observableInternal/observables/derivedImpl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IObservable, IObservableWithChange, IObserver, IReaderWithStore, ISettableObservable, ITransaction, } from '../base.js';
import { BaseObservable } from './baseObservable.js';
import { DebugNameData } from '../debugName.js';
import { BugIndicatingError, DisposableStore, EqualityComparer, assertFn, onBugIndicatingError } from '../commonFacade/deps.js';
import { getLogger } from '../logging/logging.js';
import { IChangeTracker } from '../changeTracker.js';
import { DebugLocation } from '../debugLocation.js';

export interface IDerivedReader<TChange = void> extends IReaderWithStore {
	/**
	 * Call this to report a change delta or to force report a change, even if the new value is the same as the old value.
	*/
	reportChange(change: TChange): void;
}

export const enum DerivedState {
	/** Initial state, no previous value, recomputation needed */
	initial = 0,

	/**
	 * A dependency could have changed.
	 * We need to explicitly ask them if at least one dependency changed.
	 */
	dependenciesMightHaveChanged = 1,

	/**
	 * A dependency changed and we need to recompute.
	 * After recomputation, we need to check the previous value to see if we changed as well.
	 */
	stale = 2,

	/**
	 * No change reported, our cached value is up to date.
	 */
	upToDate = 3,
}

function derivedStateToString(state: DerivedState): string {
	switch (state) {
		case DerivedState.initial: return 'initial';
		case DerivedState.dependenciesMightHaveChanged: return 'dependenciesMightHaveChanged';
		case DerivedState.stale: return 'stale';
		case DerivedState.upToDate: return 'upToDate';
		default: return '<unknown>';
	}
}

export class Derived<T, TChangeSummary = any, TChange = void> extends BaseObservable<T, TChange> implements IDerivedReader<TChange>, IObserver {
	private _state = DerivedState.initial;
	private _value: T | undefined = undefined;
	private _updateCount = 0;
	private _dependencies = new Set<IObservable<any>>();
	private _dependenciesToBeRemoved = new Set<IObservable<any>>();
	private _changeSummary: TChangeSummary | undefined = undefined;
	private _isUpdating = false;
	private _isComputing = false;
	private _didReportChange = false;
	private _isInBeforeUpdate = false;
	private _isReaderValid = false;
	private _store: DisposableStore | undefined = undefined;
	private _delayedStore: DisposableStore | undefined = undefined;
	private _removedObserverToCallEndUpdateOn: Set<IObserver> | null = null;

	public override get debugName(): string {
		return this._debugNameData.getDebugName(this) ?? '(anonymous)';
	}

	constructor(
		public readonly _debugNameData: DebugNameData,
		public readonly _computeFn: (reader: IDerivedReader<TChange>, changeSummary: TChangeSummary) => T,
		private readonly _changeTracker: IChangeTracker<TChangeSummary> | undefined,
		private readonly _handleLastObserverRemoved: (() => void) | undefined = undefined,
		private readonly _equalityComparator: EqualityComparer<T>,
		debugLocation: DebugLocation,
	) {
		super(debugLocation);
		this._changeSummary = this._changeTracker?.createChangeSummary(undefined);
	}

	protected override onLastObserverRemoved(): void {
		/**
		 * We are not tracking changes anymore, thus we have to assume
		 * that our cache is invalid.
		 */
		this._state = DerivedState.initial;
		this._value = undefined;
		getLogger()?.handleDerivedCleared(this);
		for (const d of this._dependencies) {
			d.removeObserver(this);
		}
		this._dependencies.clear();

		if (this._store !== undefined) {
			this._store.dispose();
			this._store = undefined;
		}
		if (this._delayedStore !== undefined) {
			this._delayedStore.dispose();
			this._delayedStore = undefined;
		}

		this._handleLastObserverRemoved?.();
	}

	public override get(): T {
		const checkEnabled = false; // TODO set to true
		if (this._isComputing && checkEnabled) {
			// investigate why this fails in the diff editor!
			throw new BugIndicatingError('Cyclic deriveds are not supported yet!');
		}

		if (this._observers.size === 0) {
			let result;
			// Without observers, we don't know when to clean up stuff.
			// Thus, we don't cache anything to prevent memory leaks.
			try {
				this._isReaderValid = true;
				let changeSummary = undefined;
				if (this._changeTracker) {
					changeSummary = this._changeTracker.createChangeSummary(undefined);
					this._changeTracker.beforeUpdate?.(this, changeSummary);
				}
				result = this._computeFn(this, changeSummary!);
			} finally {
				this._isReaderValid = false;
			}
			// Clear new dependencies
			this.onLastObserverRemoved();
			return result;

		} else {
			do {
				// We might not get a notification for a dependency that changed while it is updating,
				// thus we also have to ask all our depedencies if they changed in this case.
				if (this._state === DerivedState.dependenciesMightHaveChanged) {
					for (const d of this._dependencies) {
						/** might call {@link handleChange} indirectly, which could make us stale */
						d.reportChanges();

						if (this._state as DerivedState === DerivedState.stale) {
							// The other dependencies will refresh on demand, so early break
							break;
						}
					}
				}

				// We called report changes of all dependencies.
				// If we are still not stale, we can assume to be up to date again.
				if (this._state === DerivedState.dependenciesMightHaveChanged) {
					this._state = DerivedState.upToDate;
				}

				if (this._state !== DerivedState.upToDate) {
					this._recompute();
				}
				// In case recomputation changed one of our dependencies, we need to recompute again.
			} while (this._state !== DerivedState.upToDate);
			return this._value!;
		}
	}

	private _recompute() {
		let didChange = false;
		this._isComputing = true;
		this._didReportChange = false;

		const emptySet = this._dependenciesToBeRemoved;
		this._dependenciesToBeRemoved = this._dependencies;
		this._dependencies = emptySet;

		try {
			const changeSummary = this._changeSummary!;

			this._isReaderValid = true;
			if (this._changeTracker) {
				this._isInBeforeUpdate = true;
				this._changeTracker.beforeUpdate?.(this, changeSummary);
				this._isInBeforeUpdate = false;
				this._changeSummary = this._changeTracker?.createChangeSummary(changeSummary);
			}

			const hadValue = this._state !== DerivedState.initial;
			const oldValue = this._value;
			this._state = DerivedState.upToDate;

			const delayedStore = this._delayedStore;
			if (delayedStore !== undefined) {
				this._delayedStore = undefined;
			}
			try {
				if (this._store !== undefined) {
					this._store.dispose();
					this._store = undefined;
				}
				/** might call {@link handleChange} indirectly, which could invalidate us */
				this._value = this._computeFn(this, changeSummary);

			} finally {
				this._isReaderValid = false;
				// We don't want our observed observables to think that they are (not even temporarily) not being observed.
				// Thus, we only unsubscribe from observables that are definitely not read anymore.
				for (const o of this._dependenciesToBeRemoved) {
					o.removeObserver(this);
				}
				this._dependenciesToBeRemoved.clear();

				if (delayedStore !== undefined) {
					delayedStore.dispose();
				}
			}

			didChange = this._didReportChange || (hadValue && !(this._equalityComparator(oldValue!, this._value)));

			getLogger()?.handleObservableUpdated(this, {
				oldValue,
				newValue: this._value,
				change: undefined,
				didChange,
				hadValue,
			});
		} catch (e) {
			onBugIndicatingError(e);
		}

		this._isComputing = false;

		if (!this._didReportChange && didChange) {
			for (const r of this._observers) {
				r.handleChange(this, undefined);
			}
		} else {
			this._didReportChange = false;
		}
	}

	public override toString(): string {
		return `LazyDerived<${this.debugName}>`;
	}

	// IObserver Implementation

	public beginUpdate<T>(_observable: IObservable<T>): void {
		if (this._isUpdating) {
			throw new BugIndicatingError('Cyclic deriveds are not supported yet!');
		}

		this._updateCount++;
		this._isUpdating = true;
		try {
			const propagateBeginUpdate = this._updateCount === 1;
			if (this._state === DerivedState.upToDate) {
				this._state = DerivedState.dependenciesMightHaveChanged;
				// If we propagate begin update, that will already signal a possible change.
				if (!propagateBeginUpdate) {
					for (const r of this._observers) {
						r.handlePossibleChange(this);
					}
				}
			}
			if (propagateBeginUpdate) {
				for (const r of this._observers) {
					r.beginUpdate(this); // This signals a possible change
				}
			}
		} finally {
			this._isUpdating = false;
		}
	}

	public endUpdate<T>(_observable: IObservable<T>): void {
		this._updateCount--;
		if (this._updateCount === 0) {
			// End update could change the observer list.
			const observers = [...this._observers];
			for (const r of observers) {
				r.endUpdate(this);
			}
			if (this._removedObserverToCallEndUpdateOn) {
				const observers = [...this._removedObserverToCallEndUpdateOn];
				this._removedObserverToCallEndUpdateOn = null;
				for (const r of observers) {
					r.endUpdate(this);
				}
			}
		}
		assertFn(() => this._updateCount >= 0);
	}

	public handlePossibleChange<T>(observable: IObservable<T>): void {
		// In all other states, observers already know that we might have changed.
		if (this._state === DerivedState.upToDate && this._dependencies.has(observable) && !this._dependenciesToBeRemoved.has(observable)) {
			this._state = DerivedState.dependenciesMightHaveChanged;
			for (const r of this._observers) {
				r.handlePossibleChange(this);
			}
		}
	}

	public handleChange<T, TChange>(observable: IObservableWithChange<T, TChange>, change: TChange): void {
		if (this._dependencies.has(observable) && !this._dependenciesToBeRemoved.has(observable) || this._isInBeforeUpdate) {
			getLogger()?.handleDerivedDependencyChanged(this, observable, change);

			let shouldReact = false;
			try {
				shouldReact = this._changeTracker ? this._changeTracker.handleChange({
					changedObservable: observable,
					change,
					// eslint-disable-next-line local/code-no-any-casts
					didChange: (o): this is any => o === observable as any,
				}, this._changeSummary!) : true;
			} catch (e) {
				onBugIndicatingError(e);
			}

			const wasUpToDate = this._state === DerivedState.upToDate;
			if (shouldReact && (this._state === DerivedState.dependenciesMightHaveChanged || wasUpToDate)) {
				this._state = DerivedState.stale;
				if (wasUpToDate) {
					for (const r of this._observers) {
						r.handlePossibleChange(this);
					}
				}
			}
		}
	}

	// IReader Implementation

	private _ensureReaderValid(): void {
		if (!this._isReaderValid) { throw new BugIndicatingError('The reader object cannot be used outside its compute function!'); }
	}

	public readObservable<T>(observable: IObservable<T>): T {
		this._ensureReaderValid();

		// Subscribe before getting the value to enable caching
		observable.addObserver(this);
		/** This might call {@link handleChange} indirectly, which could invalidate us */
		const value = observable.get();
		// Which is why we only add the observable to the dependencies now.
		this._dependencies.add(observable);
		this._dependenciesToBeRemoved.delete(observable);
		return value;
	}

	public reportChange(change: TChange): void {
		this._ensureReaderValid();

		this._didReportChange = true;
		// TODO add logging
		for (const r of this._observers) {
			r.handleChange(this, change);
		}
	}

	get store(): DisposableStore {
		this._ensureReaderValid();

		if (this._store === undefined) {
			this._store = new DisposableStore();
		}
		return this._store;
	}

	get delayedStore(): DisposableStore {
		this._ensureReaderValid();

		if (this._delayedStore === undefined) {
			this._delayedStore = new DisposableStore();
		}
		return this._delayedStore;
	}

	public override addObserver(observer: IObserver): void {
		const shouldCallBeginUpdate = !this._observers.has(observer) && this._updateCount > 0;
		super.addObserver(observer);

		if (shouldCallBeginUpdate) {
			if (!this._removedObserverToCallEndUpdateOn?.delete(observer)) {
				observer.beginUpdate(this);
			}
		}
	}

	public override removeObserver(observer: IObserver): void {
		if (this._observers.has(observer) && this._updateCount > 0) {
			if (!this._removedObserverToCallEndUpdateOn) {
				this._removedObserverToCallEndUpdateOn = new Set();
			}
			this._removedObserverToCallEndUpdateOn.add(observer);
		}
		super.removeObserver(observer);
	}

	public debugGetState() {
		return {
			state: this._state,
			stateStr: derivedStateToString(this._state),
			updateCount: this._updateCount,
			isComputing: this._isComputing,
			dependencies: this._dependencies,
			value: this._value,
		};
	}

	public debugSetValue(newValue: unknown) {
		// eslint-disable-next-line local/code-no-any-casts
		this._value = newValue as any;
	}

	public debugRecompute(): void {
		if (!this._isComputing) {
			this._recompute();
		} else {
			this._state = DerivedState.stale;
		}
	}

	public setValue(newValue: T, tx: ITransaction, change: TChange): void {
		this._value = newValue;
		const observers = this._observers;
		tx.updateObserver(this, this);
		for (const d of observers) {
			d.handleChange(this, change);
		}
	}
}


export class DerivedWithSetter<T, TChangeSummary = any, TOutChanges = any> extends Derived<T, TChangeSummary, TOutChanges> implements ISettableObservable<T, TOutChanges> {
	constructor(
		debugNameData: DebugNameData,
		computeFn: (reader: IDerivedReader<TOutChanges>, changeSummary: TChangeSummary) => T,
		changeTracker: IChangeTracker<TChangeSummary> | undefined,
		handleLastObserverRemoved: (() => void) | undefined = undefined,
		equalityComparator: EqualityComparer<T>,
		public readonly set: (value: T, tx: ITransaction | undefined, change: TOutChanges) => void,
		debugLocation: DebugLocation,
	) {
		super(
			debugNameData,
			computeFn,
			changeTracker,
			handleLastObserverRemoved,
			equalityComparator,
			debugLocation,
		);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/observableInternal/observables/lazyObservableValue.ts]---
Location: vscode-main/src/vs/base/common/observableInternal/observables/lazyObservableValue.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { EqualityComparer } from '../commonFacade/deps.js';
import { IObserver, ISettableObservable, ITransaction } from '../base.js';
import { TransactionImpl } from '../transaction.js';
import { DebugNameData } from '../debugName.js';
import { getLogger } from '../logging/logging.js';
import { BaseObservable } from './baseObservable.js';
import { DebugLocation } from '../debugLocation.js';

/**
 * Holds off updating observers until the value is actually read.
*/
export class LazyObservableValue<T, TChange = void>
	extends BaseObservable<T, TChange>
	implements ISettableObservable<T, TChange> {
	protected _value: T;
	private _isUpToDate = true;
	private readonly _deltas: TChange[] = [];

	get debugName() {
		return this._debugNameData.getDebugName(this) ?? 'LazyObservableValue';
	}

	constructor(
		private readonly _debugNameData: DebugNameData,
		initialValue: T,
		private readonly _equalityComparator: EqualityComparer<T>,
		debugLocation: DebugLocation
	) {
		super(debugLocation);
		this._value = initialValue;
	}

	public override get(): T {
		this._update();
		return this._value;
	}

	private _update(): void {
		if (this._isUpToDate) {
			return;
		}
		this._isUpToDate = true;

		if (this._deltas.length > 0) {
			for (const change of this._deltas) {
				getLogger()?.handleObservableUpdated(this, { change, didChange: true, oldValue: '(unknown)', newValue: this._value, hadValue: true });
				for (const observer of this._observers) {
					observer.handleChange(this, change);
				}
			}
			this._deltas.length = 0;
		} else {
			getLogger()?.handleObservableUpdated(this, { change: undefined, didChange: true, oldValue: '(unknown)', newValue: this._value, hadValue: true });
			for (const observer of this._observers) {
				observer.handleChange(this, undefined);
			}
		}
	}

	private _updateCounter = 0;

	private _beginUpdate(): void {
		this._updateCounter++;
		if (this._updateCounter === 1) {
			for (const observer of this._observers) {
				observer.beginUpdate(this);
			}
		}
	}

	private _endUpdate(): void {
		this._updateCounter--;
		if (this._updateCounter === 0) {
			this._update();

			// End update could change the observer list.
			const observers = [...this._observers];
			for (const r of observers) {
				r.endUpdate(this);
			}
		}
	}

	public override addObserver(observer: IObserver): void {
		const shouldCallBeginUpdate = !this._observers.has(observer) && this._updateCounter > 0;
		super.addObserver(observer);

		if (shouldCallBeginUpdate) {
			observer.beginUpdate(this);
		}
	}

	public override removeObserver(observer: IObserver): void {
		const shouldCallEndUpdate = this._observers.has(observer) && this._updateCounter > 0;
		super.removeObserver(observer);

		if (shouldCallEndUpdate) {
			// Calling end update after removing the observer makes sure endUpdate cannot be called twice here.
			observer.endUpdate(this);
		}
	}

	public set(value: T, tx: ITransaction | undefined, change: TChange): void {
		if (change === undefined && this._equalityComparator(this._value, value)) {
			return;
		}

		let _tx: TransactionImpl | undefined;
		if (!tx) {
			tx = _tx = new TransactionImpl(() => { }, () => `Setting ${this.debugName}`);
		}
		try {
			this._isUpToDate = false;
			this._setValue(value);
			if (change !== undefined) {
				this._deltas.push(change);
			}

			tx.updateObserver({
				beginUpdate: () => this._beginUpdate(),
				endUpdate: () => this._endUpdate(),
				handleChange: (observable, change) => { },
				handlePossibleChange: (observable) => { },
			}, this);

			if (this._updateCounter > 1) {
				// We already started begin/end update, so we need to manually call handlePossibleChange
				for (const observer of this._observers) {
					observer.handlePossibleChange(this);
				}
			}

		} finally {
			if (_tx) {
				_tx.finish();
			}
		}
	}

	override toString(): string {
		return `${this.debugName}: ${this._value}`;
	}

	protected _setValue(newValue: T): void {
		this._value = newValue;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/observableInternal/observables/observableFromEvent.ts]---
Location: vscode-main/src/vs/base/common/observableInternal/observables/observableFromEvent.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IObservable, ITransaction } from '../base.js';
import { subtransaction } from '../transaction.js';
import { EqualityComparer, Event, IDisposable, strictEquals } from '../commonFacade/deps.js';
import { DebugOwner, DebugNameData, IDebugNameData } from '../debugName.js';
import { getLogger } from '../logging/logging.js';
import { BaseObservable } from './baseObservable.js';
import { DebugLocation } from '../debugLocation.js';


export function observableFromEvent<T, TArgs = unknown>(
	owner: DebugOwner,
	event: Event<TArgs>,
	getValue: (args: TArgs | undefined) => T,
	debugLocation?: DebugLocation,
): IObservable<T>;
export function observableFromEvent<T, TArgs = unknown>(
	event: Event<TArgs>,
	getValue: (args: TArgs | undefined) => T,
): IObservable<T>;
export function observableFromEvent(...args:
	[owner: DebugOwner, event: Event<any>, getValue: (args: any | undefined) => any, debugLocation?: DebugLocation] |
	[event: Event<any>, getValue: (args: any | undefined) => any]
): IObservable<any> {
	let owner;
	let event;
	let getValue;
	let debugLocation;
	if (args.length === 2) {
		[event, getValue] = args;
	} else {
		[owner, event, getValue, debugLocation] = args;
	}
	return new FromEventObservable(
		new DebugNameData(owner, undefined, getValue),
		event,
		getValue,
		() => FromEventObservable.globalTransaction,
		strictEquals,
		debugLocation ?? DebugLocation.ofCaller()
	);
}

export function observableFromEventOpts<T, TArgs = unknown>(
	options: IDebugNameData & {
		equalsFn?: EqualityComparer<T>;
		getTransaction?: () => ITransaction | undefined;
	},
	event: Event<TArgs>,
	getValue: (args: TArgs | undefined) => T,
	debugLocation = DebugLocation.ofCaller()
): IObservable<T> {
	return new FromEventObservable(
		new DebugNameData(options.owner, options.debugName, options.debugReferenceFn ?? getValue),
		event,
		getValue,
		() => options.getTransaction?.() ?? FromEventObservable.globalTransaction,
		options.equalsFn ?? strictEquals,
		debugLocation
	);
}

export class FromEventObservable<TArgs, T> extends BaseObservable<T> {
	public static globalTransaction: ITransaction | undefined;

	private _value: T | undefined;
	private _hasValue = false;
	private _subscription: IDisposable | undefined;

	constructor(
		private readonly _debugNameData: DebugNameData,
		private readonly event: Event<TArgs>,
		public readonly _getValue: (args: TArgs | undefined) => T,
		private readonly _getTransaction: () => ITransaction | undefined,
		private readonly _equalityComparator: EqualityComparer<T>,
		debugLocation: DebugLocation
	) {
		super(debugLocation);
	}

	private getDebugName(): string | undefined {
		return this._debugNameData.getDebugName(this);
	}

	public get debugName(): string {
		const name = this.getDebugName();
		return 'From Event' + (name ? `: ${name}` : '');
	}

	protected override onFirstObserverAdded(): void {
		this._subscription = this.event(this.handleEvent);
	}

	private readonly handleEvent = (args: TArgs | undefined) => {
		const newValue = this._getValue(args);
		const oldValue = this._value;

		const didChange = !this._hasValue || !(this._equalityComparator(oldValue!, newValue));
		let didRunTransaction = false;

		if (didChange) {
			this._value = newValue;

			if (this._hasValue) {
				didRunTransaction = true;
				subtransaction(
					this._getTransaction(),
					(tx) => {
						getLogger()?.handleObservableUpdated(this, { oldValue, newValue, change: undefined, didChange, hadValue: this._hasValue });

						for (const o of this._observers) {
							tx.updateObserver(o, this);
							o.handleChange(this, undefined);
						}
					},
					() => {
						const name = this.getDebugName();
						return 'Event fired' + (name ? `: ${name}` : '');
					}
				);
			}
			this._hasValue = true;
		}

		if (!didRunTransaction) {
			getLogger()?.handleObservableUpdated(this, { oldValue, newValue, change: undefined, didChange, hadValue: this._hasValue });
		}
	};

	protected override onLastObserverRemoved(): void {
		this._subscription!.dispose();
		this._subscription = undefined;
		this._hasValue = false;
		this._value = undefined;
	}

	public get(): T {
		if (this._subscription) {
			if (!this._hasValue) {
				this.handleEvent(undefined);
			}
			return this._value!;
		} else {
			// no cache, as there are no subscribers to keep it updated
			const value = this._getValue(undefined);
			return value;
		}
	}

	public debugSetValue(value: unknown): void {
		// eslint-disable-next-line local/code-no-any-casts
		this._value = value as any;
	}

	public debugGetState() {
		return { value: this._value, hasValue: this._hasValue };
	}
}

export namespace observableFromEvent {
	export const Observer = FromEventObservable;

	export function batchEventsGlobally(tx: ITransaction, fn: () => void): void {
		let didSet = false;
		if (FromEventObservable.globalTransaction === undefined) {
			FromEventObservable.globalTransaction = tx;
			didSet = true;
		}
		try {
			fn();
		} finally {
			if (didSet) {
				FromEventObservable.globalTransaction = undefined;
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/observableInternal/observables/observableSignal.ts]---
Location: vscode-main/src/vs/base/common/observableInternal/observables/observableSignal.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IObservableWithChange, ITransaction } from '../base.js';
import { transaction } from '../transaction.js';
import { DebugNameData } from '../debugName.js';
import { BaseObservable } from './baseObservable.js';
import { DebugLocation } from '../debugLocation.js';

/**
 * Creates a signal that can be triggered to invalidate observers.
 * Signals don't have a value - when they are triggered they indicate a change.
 * However, signals can carry a delta that is passed to observers.
 */
export function observableSignal<TDelta = void>(debugName: string): IObservableSignal<TDelta>;
export function observableSignal<TDelta = void>(owner: object): IObservableSignal<TDelta>;
export function observableSignal<TDelta = void>(debugNameOrOwner: string | object, debugLocation = DebugLocation.ofCaller()): IObservableSignal<TDelta> {
	if (typeof debugNameOrOwner === 'string') {
		return new ObservableSignal<TDelta>(debugNameOrOwner, undefined, debugLocation);
	} else {
		return new ObservableSignal<TDelta>(undefined, debugNameOrOwner, debugLocation);
	}
}

export interface IObservableSignal<TChange> extends IObservableWithChange<void, TChange> {
	trigger(tx: ITransaction | undefined, change: TChange): void;
}

class ObservableSignal<TChange> extends BaseObservable<void, TChange> implements IObservableSignal<TChange> {
	public get debugName() {
		return new DebugNameData(this._owner, this._debugName, undefined).getDebugName(this) ?? 'Observable Signal';
	}

	public override toString(): string {
		return this.debugName;
	}

	constructor(
		private readonly _debugName: string | undefined,
		private readonly _owner: object | undefined,
		debugLocation: DebugLocation
	) {
		super(debugLocation);
	}

	public trigger(tx: ITransaction | undefined, change: TChange): void {
		if (!tx) {
			transaction(tx => {
				this.trigger(tx, change);
			}, () => `Trigger signal ${this.debugName}`);
			return;
		}

		for (const o of this._observers) {
			tx.updateObserver(o, this);
			o.handleChange(this, change);
		}
	}

	public override get(): void {
		// NO OP
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/observableInternal/observables/observableSignalFromEvent.ts]---
Location: vscode-main/src/vs/base/common/observableInternal/observables/observableSignalFromEvent.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IObservable } from '../base.js';
import { transaction } from '../transaction.js';
import { Event, IDisposable } from '../commonFacade/deps.js';
import { DebugOwner, DebugNameData } from '../debugName.js';
import { BaseObservable } from './baseObservable.js';
import { DebugLocation } from '../debugLocation.js';

export function observableSignalFromEvent(
	owner: DebugOwner | string,
	event: Event<any>,
	debugLocation = DebugLocation.ofCaller()
): IObservable<void> {
	return new FromEventObservableSignal(typeof owner === 'string' ? owner : new DebugNameData(owner, undefined, undefined), event, debugLocation);
}

class FromEventObservableSignal extends BaseObservable<void> {
	private subscription: IDisposable | undefined;

	public readonly debugName: string;
	constructor(
		debugNameDataOrName: DebugNameData | string,
		private readonly event: Event<any>,
		debugLocation: DebugLocation
	) {
		super(debugLocation);
		this.debugName = typeof debugNameDataOrName === 'string'
			? debugNameDataOrName
			: debugNameDataOrName.getDebugName(this) ?? 'Observable Signal From Event';
	}

	protected override onFirstObserverAdded(): void {
		this.subscription = this.event(this.handleEvent);
	}

	private readonly handleEvent = () => {
		transaction(
			(tx) => {
				for (const o of this._observers) {
					tx.updateObserver(o, this);
					o.handleChange(this, undefined);
				}
			},
			() => this.debugName
		);
	};

	protected override onLastObserverRemoved(): void {
		this.subscription!.dispose();
		this.subscription = undefined;
	}

	public override get(): void {
		// NO OP
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/observableInternal/observables/observableValue.ts]---
Location: vscode-main/src/vs/base/common/observableInternal/observables/observableValue.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ISettableObservable, ITransaction } from '../base.js';
import { TransactionImpl } from '../transaction.js';
import { BaseObservable } from './baseObservable.js';
import { EqualityComparer, IDisposable, strictEquals } from '../commonFacade/deps.js';
import { DebugNameData } from '../debugName.js';
import { getLogger } from '../logging/logging.js';
import { DebugLocation } from '../debugLocation.js';

/**
 * Creates an observable value.
 * Observers get informed when the value changes.
 * @template TChange An arbitrary type to describe how or why the value changed. Defaults to `void`.
 * Observers will receive every single change value.
 */

export function observableValue<T, TChange = void>(name: string, initialValue: T): ISettableObservable<T, TChange>;
export function observableValue<T, TChange = void>(owner: object, initialValue: T): ISettableObservable<T, TChange>;
export function observableValue<T, TChange = void>(nameOrOwner: string | object, initialValue: T, debugLocation = DebugLocation.ofCaller()): ISettableObservable<T, TChange> {
	let debugNameData: DebugNameData;
	if (typeof nameOrOwner === 'string') {
		debugNameData = new DebugNameData(undefined, nameOrOwner, undefined);
	} else {
		debugNameData = new DebugNameData(nameOrOwner, undefined, undefined);
	}
	return new ObservableValue(debugNameData, initialValue, strictEquals, debugLocation);
}

export class ObservableValue<T, TChange = void>
	extends BaseObservable<T, TChange>
	implements ISettableObservable<T, TChange> {
	protected _value: T;

	get debugName() {
		return this._debugNameData.getDebugName(this) ?? 'ObservableValue';
	}

	constructor(
		private readonly _debugNameData: DebugNameData,
		initialValue: T,
		private readonly _equalityComparator: EqualityComparer<T>,
		debugLocation: DebugLocation
	) {
		super(debugLocation);
		this._value = initialValue;

		getLogger()?.handleObservableUpdated(this, { hadValue: false, newValue: initialValue, change: undefined, didChange: true, oldValue: undefined });
	}
	public override get(): T {
		return this._value;
	}

	public set(value: T, tx: ITransaction | undefined, change: TChange): void {
		if (change === undefined && this._equalityComparator(this._value, value)) {
			return;
		}

		let _tx: TransactionImpl | undefined;
		if (!tx) {
			tx = _tx = new TransactionImpl(() => { }, () => `Setting ${this.debugName}`);
		}
		try {
			const oldValue = this._value;
			this._setValue(value);
			getLogger()?.handleObservableUpdated(this, { oldValue, newValue: value, change, didChange: true, hadValue: true });

			for (const observer of this._observers) {
				tx.updateObserver(observer, this);
				observer.handleChange(this, change);
			}
		} finally {
			if (_tx) {
				_tx.finish();
			}
		}
	}

	override toString(): string {
		return `${this.debugName}: ${this._value}`;
	}

	protected _setValue(newValue: T): void {
		this._value = newValue;
	}

	public debugGetState() {
		return {
			value: this._value,
		};
	}

	public debugSetValue(value: unknown) {
		this._value = value as T;
	}
}
/**
 * A disposable observable. When disposed, its value is also disposed.
 * When a new value is set, the previous value is disposed.
 */

export function disposableObservableValue<T extends IDisposable | undefined, TChange = void>(nameOrOwner: string | object, initialValue: T, debugLocation = DebugLocation.ofCaller()): ISettableObservable<T, TChange> & IDisposable {
	let debugNameData: DebugNameData;
	if (typeof nameOrOwner === 'string') {
		debugNameData = new DebugNameData(undefined, nameOrOwner, undefined);
	} else {
		debugNameData = new DebugNameData(nameOrOwner, undefined, undefined);
	}
	return new DisposableObservableValue(debugNameData, initialValue, strictEquals, debugLocation);
}

export class DisposableObservableValue<T extends IDisposable | undefined, TChange = void> extends ObservableValue<T, TChange> implements IDisposable {
	protected override _setValue(newValue: T): void {
		if (this._value === newValue) {
			return;
		}
		if (this._value) {
			this._value.dispose();
		}
		this._value = newValue;
	}

	public dispose(): void {
		this._value?.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/observableInternal/observables/observableValueOpts.ts]---
Location: vscode-main/src/vs/base/common/observableInternal/observables/observableValueOpts.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ISettableObservable } from '../base.js';
import { DebugNameData, IDebugNameData } from '../debugName.js';
import { EqualityComparer, strictEquals } from '../commonFacade/deps.js';
import { ObservableValue } from './observableValue.js';
import { LazyObservableValue } from './lazyObservableValue.js';
import { DebugLocation } from '../debugLocation.js';

export function observableValueOpts<T, TChange = void>(
	options: IDebugNameData & {
		equalsFn?: EqualityComparer<T>;
		lazy?: boolean;
	},
	initialValue: T,
	debugLocation = DebugLocation.ofCaller(),
): ISettableObservable<T, TChange> {
	if (options.lazy) {
		return new LazyObservableValue(
			new DebugNameData(options.owner, options.debugName, undefined),
			initialValue,
			options.equalsFn ?? strictEquals,
			debugLocation
		);
	}
	return new ObservableValue(
		new DebugNameData(options.owner, options.debugName, undefined),
		initialValue,
		options.equalsFn ?? strictEquals,
		debugLocation
	);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/observableInternal/reactions/autorun.ts]---
Location: vscode-main/src/vs/base/common/observableInternal/reactions/autorun.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IReaderWithStore, IReader, IObservable } from '../base.js';
import { IChangeTracker } from '../changeTracker.js';
import { DisposableStore, IDisposable, toDisposable } from '../commonFacade/deps.js';
import { DebugNameData, IDebugNameData } from '../debugName.js';
import { AutorunObserver } from './autorunImpl.js';
import { DebugLocation } from '../debugLocation.js';

/**
 * Runs immediately and whenever a transaction ends and an observed observable changed.
 * {@link fn} should start with a JS Doc using `@description` to name the autorun.
 */
export function autorun(fn: (reader: IReaderWithStore) => void, debugLocation = DebugLocation.ofCaller()): IDisposable {
	return new AutorunObserver(
		new DebugNameData(undefined, undefined, fn),
		fn,
		undefined,
		debugLocation
	);
}

/**
 * Runs immediately and whenever a transaction ends and an observed observable changed.
 * {@link fn} should start with a JS Doc using `@description` to name the autorun.
 */
export function autorunOpts(options: IDebugNameData & {}, fn: (reader: IReaderWithStore) => void, debugLocation = DebugLocation.ofCaller()): IDisposable {
	return new AutorunObserver(
		new DebugNameData(options.owner, options.debugName, options.debugReferenceFn ?? fn),
		fn,
		undefined,
		debugLocation
	);
}

/**
 * Runs immediately and whenever a transaction ends and an observed observable changed.
 * {@link fn} should start with a JS Doc using `@description` to name the autorun.
 *
 * Use `changeTracker.createChangeSummary` to create a "change summary" that can collect the changes.
 * Use `changeTracker.handleChange` to add a reported change to the change summary.
 * The run function is given the last change summary.
 * The change summary is discarded after the run function was called.
 *
 * @see autorun
 */
export function autorunHandleChanges<TChangeSummary>(
	options: IDebugNameData & {
		changeTracker: IChangeTracker<TChangeSummary>;
	},
	fn: (reader: IReader, changeSummary: TChangeSummary) => void,
	debugLocation = DebugLocation.ofCaller()
): IDisposable {
	return new AutorunObserver(
		new DebugNameData(options.owner, options.debugName, options.debugReferenceFn ?? fn),
		fn,
		options.changeTracker,
		debugLocation
	);
}

/**
 * @see autorunHandleChanges (but with a disposable store that is cleared before the next run or on dispose)
 */
export function autorunWithStoreHandleChanges<TChangeSummary>(
	options: IDebugNameData & {
		changeTracker: IChangeTracker<TChangeSummary>;
	},
	fn: (reader: IReader, changeSummary: TChangeSummary, store: DisposableStore) => void
): IDisposable {
	const store = new DisposableStore();
	const disposable = autorunHandleChanges(
		{
			owner: options.owner,
			debugName: options.debugName,
			debugReferenceFn: options.debugReferenceFn ?? fn,
			changeTracker: options.changeTracker,
		},
		(reader, changeSummary) => {
			store.clear();
			fn(reader, changeSummary, store);
		}
	);
	return toDisposable(() => {
		disposable.dispose();
		store.dispose();
	});
}

/**
 * @see autorun (but with a disposable store that is cleared before the next run or on dispose)
 *
 * @deprecated Use `autorun(reader => { reader.store.add(...) })` instead!
 */
export function autorunWithStore(fn: (reader: IReader, store: DisposableStore) => void): IDisposable {
	const store = new DisposableStore();
	const disposable = autorunOpts(
		{
			owner: undefined,
			debugName: undefined,
			debugReferenceFn: fn,
		},
		reader => {
			store.clear();
			fn(reader, store);
		}
	);
	return toDisposable(() => {
		disposable.dispose();
		store.dispose();
	});
}

export function autorunDelta<T>(
	observable: IObservable<T>,
	handler: (args: { lastValue: T | undefined; newValue: T }) => void
): IDisposable {
	let _lastValue: T | undefined;
	return autorunOpts({ debugReferenceFn: handler }, (reader) => {
		const newValue = observable.read(reader);
		const lastValue = _lastValue;
		_lastValue = newValue;
		handler({ lastValue, newValue });
	});
}

export function autorunIterableDelta<T>(
	getValue: (reader: IReader) => Iterable<T>,
	handler: (args: { addedValues: T[]; removedValues: T[] }) => void,
	getUniqueIdentifier: (value: T) => unknown = v => v
) {
	const lastValues = new Map<unknown, T>();
	return autorunOpts({ debugReferenceFn: getValue }, (reader) => {
		const newValues = new Map();
		const removedValues = new Map(lastValues);
		for (const value of getValue(reader)) {
			const id = getUniqueIdentifier(value);
			if (lastValues.has(id)) {
				removedValues.delete(id);
			} else {
				newValues.set(id, value);
				lastValues.set(id, value);
			}
		}
		for (const id of removedValues.keys()) {
			lastValues.delete(id);
		}

		if (newValues.size || removedValues.size) {
			handler({ addedValues: [...newValues.values()], removedValues: [...removedValues.values()] });
		}
	});
}

export interface IReaderWithDispose extends IReaderWithStore, IDisposable { }

/**
 * An autorun with a `dispose()` method on its `reader` which cancels the autorun.
 * It it safe to call `dispose()` synchronously.
 */
export function autorunSelfDisposable(fn: (reader: IReaderWithDispose) => void, debugLocation = DebugLocation.ofCaller()): IDisposable {
	let ar: IDisposable | undefined;
	let disposed = false;

	// eslint-disable-next-line prefer-const
	ar = autorun(reader => {
		fn({
			delayedStore: reader.delayedStore,
			store: reader.store,
			readObservable: reader.readObservable.bind(reader),
			dispose: () => {
				ar?.dispose();
				disposed = true;
			}
		});
	}, debugLocation);

	if (disposed) {
		ar.dispose();
	}

	return ar;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/observableInternal/reactions/autorunImpl.ts]---
Location: vscode-main/src/vs/base/common/observableInternal/reactions/autorunImpl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IObservable, IObservableWithChange, IObserver, IReaderWithStore } from '../base.js';
import { DebugNameData } from '../debugName.js';
import { assertFn, BugIndicatingError, DisposableStore, IDisposable, markAsDisposed, onBugIndicatingError, trackDisposable } from '../commonFacade/deps.js';
import { getLogger } from '../logging/logging.js';
import { IChangeTracker } from '../changeTracker.js';
import { DebugLocation } from '../debugLocation.js';

export const enum AutorunState {
	/**
	 * A dependency could have changed.
	 * We need to explicitly ask them if at least one dependency changed.
	 */
	dependenciesMightHaveChanged = 1,

	/**
	 * A dependency changed and we need to recompute.
	 */
	stale = 2,
	upToDate = 3,
}

function autorunStateToString(state: AutorunState): string {
	switch (state) {
		case AutorunState.dependenciesMightHaveChanged: return 'dependenciesMightHaveChanged';
		case AutorunState.stale: return 'stale';
		case AutorunState.upToDate: return 'upToDate';
		default: return '<unknown>';
	}
}

export class AutorunObserver<TChangeSummary = any> implements IObserver, IReaderWithStore, IDisposable {
	private _state = AutorunState.stale;
	private _updateCount = 0;
	private _disposed = false;
	private _dependencies = new Set<IObservable<any>>();
	private _dependenciesToBeRemoved = new Set<IObservable<any>>();
	private _changeSummary: TChangeSummary | undefined;
	private _isRunning = false;
	private _iteration = 0;

	public get debugName(): string {
		return this._debugNameData.getDebugName(this) ?? '(anonymous)';
	}

	constructor(
		public readonly _debugNameData: DebugNameData,
		public readonly _runFn: (reader: IReaderWithStore, changeSummary: TChangeSummary) => void,
		private readonly _changeTracker: IChangeTracker<TChangeSummary> | undefined,
		debugLocation: DebugLocation
	) {
		this._changeSummary = this._changeTracker?.createChangeSummary(undefined);
		getLogger()?.handleAutorunCreated(this, debugLocation);
		this._run();

		trackDisposable(this);
	}

	public dispose(): void {
		if (this._disposed) {
			return;
		}
		this._disposed = true;
		for (const o of this._dependencies) {
			o.removeObserver(this); // Warning: external call!
		}
		this._dependencies.clear();

		if (this._store !== undefined) {
			this._store.dispose();
		}
		if (this._delayedStore !== undefined) {
			this._delayedStore.dispose();
		}

		getLogger()?.handleAutorunDisposed(this);
		markAsDisposed(this);
	}

	private _run() {
		const emptySet = this._dependenciesToBeRemoved;
		this._dependenciesToBeRemoved = this._dependencies;
		this._dependencies = emptySet;

		this._state = AutorunState.upToDate;

		try {
			if (!this._disposed) {
				getLogger()?.handleAutorunStarted(this);
				const changeSummary = this._changeSummary!;
				const delayedStore = this._delayedStore;
				if (delayedStore !== undefined) {
					this._delayedStore = undefined;
				}
				try {
					this._isRunning = true;
					if (this._changeTracker) {
						this._changeTracker.beforeUpdate?.(this, changeSummary);
						this._changeSummary = this._changeTracker.createChangeSummary(changeSummary); // Warning: external call!
					}
					if (this._store !== undefined) {
						this._store.dispose();
						this._store = undefined;
					}

					this._runFn(this, changeSummary); // Warning: external call!
				} catch (e) {
					onBugIndicatingError(e);
				} finally {
					this._isRunning = false;
					if (delayedStore !== undefined) {
						delayedStore.dispose();
					}
				}
			}
		} finally {
			if (!this._disposed) {
				getLogger()?.handleAutorunFinished(this);
			}
			// We don't want our observed observables to think that they are (not even temporarily) not being observed.
			// Thus, we only unsubscribe from observables that are definitely not read anymore.
			for (const o of this._dependenciesToBeRemoved) {
				o.removeObserver(this); // Warning: external call!
			}
			this._dependenciesToBeRemoved.clear();
		}
	}

	public toString(): string {
		return `Autorun<${this.debugName}>`;
	}

	// IObserver implementation
	public beginUpdate(_observable: IObservable<any>): void {
		if (this._state === AutorunState.upToDate) {
			this._checkIterations();
			this._state = AutorunState.dependenciesMightHaveChanged;
		}
		this._updateCount++;
	}

	public endUpdate(_observable: IObservable<any>): void {
		try {
			if (this._updateCount === 1) {
				this._iteration = 1;
				do {
					if (this._checkIterations()) {
						return;
					}
					if (this._state === AutorunState.dependenciesMightHaveChanged) {
						this._state = AutorunState.upToDate;
						for (const d of this._dependencies) {
							d.reportChanges(); // Warning: external call!
							if (this._state as AutorunState === AutorunState.stale) {
								// The other dependencies will refresh on demand
								break;
							}
						}
					}

					this._iteration++;
					if (this._state !== AutorunState.upToDate) {
						this._run(); // Warning: indirect external call!
					}
				} while (this._state !== AutorunState.upToDate);
			}
		} finally {
			this._updateCount--;
		}

		assertFn(() => this._updateCount >= 0);
	}

	public handlePossibleChange(observable: IObservable<any>): void {
		if (this._state === AutorunState.upToDate && this._isDependency(observable)) {
			this._checkIterations();
			this._state = AutorunState.dependenciesMightHaveChanged;
		}
	}

	public handleChange<T, TChange>(observable: IObservableWithChange<T, TChange>, change: TChange): void {
		if (this._isDependency(observable)) {
			getLogger()?.handleAutorunDependencyChanged(this, observable, change);
			try {
				// Warning: external call!
				const shouldReact = this._changeTracker ? this._changeTracker.handleChange({
					changedObservable: observable,
					change,
					// eslint-disable-next-line local/code-no-any-casts
					didChange: (o): this is any => o === observable as any,
				}, this._changeSummary!) : true;
				if (shouldReact) {
					this._checkIterations();
					this._state = AutorunState.stale;
				}
			} catch (e) {
				onBugIndicatingError(e);
			}
		}
	}

	private _isDependency(observable: IObservableWithChange<any, any>): boolean {
		return this._dependencies.has(observable) && !this._dependenciesToBeRemoved.has(observable);
	}

	// IReader implementation

	private _ensureNoRunning(): void {
		if (!this._isRunning) { throw new BugIndicatingError('The reader object cannot be used outside its compute function!'); }
	}

	public readObservable<T>(observable: IObservable<T>): T {
		this._ensureNoRunning();

		// In case the run action disposes the autorun
		if (this._disposed) {
			return observable.get(); // warning: external call!
		}

		observable.addObserver(this); // warning: external call!
		const value = observable.get(); // warning: external call!
		this._dependencies.add(observable);
		this._dependenciesToBeRemoved.delete(observable);
		return value;
	}

	private _store: DisposableStore | undefined = undefined;
	get store(): DisposableStore {
		this._ensureNoRunning();
		if (this._disposed) {
			throw new BugIndicatingError('Cannot access store after dispose');
		}

		if (this._store === undefined) {
			this._store = new DisposableStore();
		}
		return this._store;
	}

	private _delayedStore: DisposableStore | undefined = undefined;
	get delayedStore(): DisposableStore {
		this._ensureNoRunning();
		if (this._disposed) {
			throw new BugIndicatingError('Cannot access store after dispose');
		}

		if (this._delayedStore === undefined) {
			this._delayedStore = new DisposableStore();
		}
		return this._delayedStore;
	}

	public debugGetState() {
		return {
			isRunning: this._isRunning,
			updateCount: this._updateCount,
			dependencies: this._dependencies,
			state: this._state,
			stateStr: autorunStateToString(this._state),
		};
	}

	public debugRerun(): void {
		if (!this._isRunning) {
			this._run();
		} else {
			this._state = AutorunState.stale;
		}
	}

	private _checkIterations(): boolean {
		if (this._iteration > 100) {
			onBugIndicatingError(new BugIndicatingError(`Autorun '${this.debugName}' is stuck in an infinite update loop.`));
			return true;
		}
		return false;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/observableInternal/utils/promise.ts]---
Location: vscode-main/src/vs/base/common/observableInternal/utils/promise.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { IObservable } from '../base.js';
import { transaction } from '../transaction.js';
import { derived } from '../observables/derived.js';
import { observableValue } from '../observables/observableValue.js';

export class ObservableLazy<T> {
	private readonly _value = observableValue<T | undefined>(this, undefined);

	/**
	 * The cached value.
	 * Does not force a computation of the value.
	 */
	public get cachedValue(): IObservable<T | undefined> { return this._value; }

	constructor(private readonly _computeValue: () => T) {
	}

	/**
	 * Returns the cached value.
	 * Computes the value if the value has not been cached yet.
	 */
	public getValue(): T {
		let v = this._value.get();
		if (!v) {
			v = this._computeValue();
			this._value.set(v, undefined);
		}
		return v;
	}
}

/**
 * A promise whose state is observable.
 */
export class ObservablePromise<T> {
	public static fromFn<T>(fn: () => Promise<T>): ObservablePromise<T> {
		return new ObservablePromise(fn());
	}

	public static resolved<T>(value: T): ObservablePromise<T> {
		return new ObservablePromise(Promise.resolve(value));
	}

	private readonly _value = observableValue<PromiseResult<T> | undefined>(this, undefined);

	/**
	 * The promise that this object wraps.
	 */
	public readonly promise: Promise<T>;

	/**
	 * The current state of the promise.
	 * Is `undefined` if the promise didn't resolve yet.
	 */
	public readonly promiseResult: IObservable<PromiseResult<T> | undefined> = this._value;

	constructor(promise: Promise<T>) {
		this.promise = promise.then(value => {
			transaction(tx => {
				/** @description onPromiseResolved */
				this._value.set(new PromiseResult(value, undefined), tx);
			});
			return value;
		}, error => {
			transaction(tx => {
				/** @description onPromiseRejected */
				this._value.set(new PromiseResult<T>(undefined, error), tx);
			});
			throw error;
		});
	}

	public readonly resolvedValue = derived(this, reader => {
		const result = this.promiseResult.read(reader);
		if (!result) {
			return undefined;
		}
		return result.getDataOrThrow();
	});
}

export class PromiseResult<T> {
	constructor(
		/**
		 * The value of the resolved promise.
		 * Undefined if the promise rejected.
		 */
		public readonly data: T | undefined,

		/**
		 * The error in case of a rejected promise.
		 * Undefined if the promise resolved.
		 */
		public readonly error: unknown | undefined,
	) {
	}

	/**
	 * Returns the value if the promise resolved, otherwise throws the error.
	 */
	public getDataOrThrow(): T {
		if (this.error) {
			throw this.error;
		}
		return this.data!;
	}
}

/**
 * A lazy promise whose state is observable.
 */
export class ObservableLazyPromise<T> {
	private readonly _lazyValue = new ObservableLazy(() => new ObservablePromise(this._computePromise()));

	/**
	 * Does not enforce evaluation of the promise compute function.
	 * Is undefined if the promise has not been computed yet.
	 */
	public readonly cachedPromiseResult = derived(this, reader => this._lazyValue.cachedValue.read(reader)?.promiseResult.read(reader));

	constructor(private readonly _computePromise: () => Promise<T>) {
	}

	public getPromise(): Promise<T> {
		return this._lazyValue.getValue().promise;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/observableInternal/utils/runOnChange.ts]---
Location: vscode-main/src/vs/base/common/observableInternal/utils/runOnChange.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IObservableWithChange } from '../base.js';
import { CancellationToken, cancelOnDispose } from '../commonFacade/cancellation.js';
import { DisposableStore, IDisposable } from '../commonFacade/deps.js';
import { autorunWithStoreHandleChanges } from '../reactions/autorun.js';

export type RemoveUndefined<T> = T extends undefined ? never : T;

export function runOnChange<T, TChange>(observable: IObservableWithChange<T, TChange>, cb: (value: T, previousValue: T, deltas: RemoveUndefined<TChange>[]) => void): IDisposable {
	let _previousValue: T | undefined;
	let _firstRun = true;
	return autorunWithStoreHandleChanges({
		changeTracker: {
			createChangeSummary: () => ({ deltas: [] as RemoveUndefined<TChange>[], didChange: false }),
			handleChange: (context, changeSummary) => {
				if (context.didChange(observable)) {
					const e = context.change;
					if (e !== undefined) {
						changeSummary.deltas.push(e as RemoveUndefined<TChange>);
					}
					changeSummary.didChange = true;
				}
				return true;
			},
		}
	}, (reader, changeSummary) => {
		const value = observable.read(reader);
		const previousValue = _previousValue;
		if (changeSummary.didChange) {
			_previousValue = value;
			// didChange can never be true on the first autorun, so we know previousValue is defined
			cb(value, previousValue!, changeSummary.deltas);
		}
		if (_firstRun) {
			_firstRun = false;
			_previousValue = value;
		}
	});
}

export function runOnChangeWithStore<T, TChange>(observable: IObservableWithChange<T, TChange>, cb: (value: T, previousValue: T, deltas: RemoveUndefined<TChange>[], store: DisposableStore) => void): IDisposable {
	const store = new DisposableStore();
	const disposable = runOnChange(observable, (value, previousValue: T, deltas) => {
		store.clear();
		cb(value, previousValue, deltas, store);
	});
	return {
		dispose() {
			disposable.dispose();
			store.dispose();
		}
	};
}

export function runOnChangeWithCancellationToken<T, TChange>(observable: IObservableWithChange<T, TChange>, cb: (value: T, previousValue: T, deltas: RemoveUndefined<TChange>[], token: CancellationToken) => Promise<void>): IDisposable {
	return runOnChangeWithStore(observable, (value, previousValue, deltas, store) => {
		cb(value, previousValue, deltas, cancelOnDispose(store));
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/observableInternal/utils/utils.ts]---
Location: vscode-main/src/vs/base/common/observableInternal/utils/utils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { autorun } from '../reactions/autorun.js';
import { IObservable, IObservableWithChange, IObserver, IReader, ITransaction } from '../base.js';
import { observableValue } from '../observables/observableValue.js';
import { DebugOwner } from '../debugName.js';
import { DisposableStore, Event, IDisposable, toDisposable } from '../commonFacade/deps.js';
import { derived, derivedOpts } from '../observables/derived.js';
import { observableFromEvent } from '../observables/observableFromEvent.js';
import { observableSignal } from '../observables/observableSignal.js';
import { _setKeepObserved, _setRecomputeInitiallyAndOnChange } from '../observables/baseObservable.js';
import { DebugLocation } from '../debugLocation.js';

export function observableFromPromise<T>(promise: Promise<T>): IObservable<{ value?: T }> {
	const observable = observableValue<{ value?: T }>('promiseValue', {});
	promise.then((value) => {
		observable.set({ value }, undefined);
	});
	return observable;
}

export function signalFromObservable<T>(owner: DebugOwner | undefined, observable: IObservable<T>): IObservable<void> {
	return derivedOpts({
		owner,
		equalsFn: () => false,
	}, reader => {
		observable.read(reader);
	});
}

/**
 * Creates an observable that debounces the input observable.
 */
export function debouncedObservable<T>(observable: IObservable<T>, debounceMs: number | ((lastValue: T | undefined, newValue: T) => number), debugLocation = DebugLocation.ofCaller()): IObservable<T> {
	let hasValue = false;
	let lastValue: T | undefined;

	let timeout: Timeout | undefined = undefined;

	return observableFromEvent<T, void>(undefined, cb => {
		const d = autorun(reader => {
			const value = observable.read(reader);

			if (!hasValue) {
				hasValue = true;
				lastValue = value;
			} else {
				if (timeout) {
					clearTimeout(timeout);
				}
				const debounceDuration = typeof debounceMs === 'number' ? debounceMs : debounceMs(lastValue, value);
				if (debounceDuration === 0) {
					lastValue = value;
					cb();
					return;
				}
				timeout = setTimeout(() => {
					lastValue = value;
					cb();
				}, debounceDuration);
			}
		});
		return {
			dispose() {
				d.dispose();
				hasValue = false;
				lastValue = undefined;
			},
		};
	}, () => {
		if (hasValue) {
			return lastValue!;
		} else {
			return observable.get();
		}
	}, debugLocation);
}

/**
 * Creates an observable that debounces the input observable.
 */
export function debouncedObservable2<T>(observable: IObservable<T>, debounceMs: number | ((currentValue: T | undefined, newValue: T) => number), debugLocation = DebugLocation.ofCaller()): IObservable<T> {
	const s = observableSignal('handleTimeout');

	let currentValue: T | undefined = undefined;
	let timeout: Timeout | undefined = undefined;

	const d = derivedOpts({
		owner: undefined,
		onLastObserverRemoved: () => {
			currentValue = undefined;
		}
	}, reader => {
		const val = observable.read(reader);
		s.read(reader);

		if (val !== currentValue) {
			const debounceDuration = typeof debounceMs === 'number' ? debounceMs : debounceMs(currentValue, val);

			if (debounceDuration === 0) {
				currentValue = val;
				return val;
			}

			if (timeout) {
				clearTimeout(timeout);
			}
			timeout = setTimeout(() => {
				currentValue = val;
				s.trigger(undefined);
			}, debounceDuration);
		}

		return currentValue!;
	}, debugLocation);

	return d;
}

export function wasEventTriggeredRecently(event: Event<any>, timeoutMs: number, disposableStore: DisposableStore): IObservable<boolean> {
	const observable = observableValue('triggeredRecently', false);

	let timeout: Timeout | undefined = undefined;

	disposableStore.add(event(() => {
		observable.set(true, undefined);

		if (timeout) {
			clearTimeout(timeout);
		}
		timeout = setTimeout(() => {
			observable.set(false, undefined);
		}, timeoutMs);
	}));

	return observable;
}

/**
 * This makes sure the observable is being observed and keeps its cache alive.
 */
export function keepObserved<T>(observable: IObservable<T>): IDisposable {
	const o = new KeepAliveObserver(false, undefined);
	observable.addObserver(o);
	return toDisposable(() => {
		observable.removeObserver(o);
	});
}

_setKeepObserved(keepObserved);

/**
 * This converts the given observable into an autorun.
 */
export function recomputeInitiallyAndOnChange<T>(observable: IObservable<T>, handleValue?: (value: T) => void): IDisposable {
	const o = new KeepAliveObserver(true, handleValue);
	observable.addObserver(o);
	try {
		o.beginUpdate(observable);
	} finally {
		o.endUpdate(observable);
	}

	return toDisposable(() => {
		observable.removeObserver(o);
	});
}

_setRecomputeInitiallyAndOnChange(recomputeInitiallyAndOnChange);

export class KeepAliveObserver implements IObserver {
	private _counter = 0;

	constructor(
		private readonly _forceRecompute: boolean,
		private readonly _handleValue: ((value: any) => void) | undefined,
	) { }

	beginUpdate<T>(observable: IObservable<T>): void {
		this._counter++;
	}

	endUpdate<T>(observable: IObservable<T>): void {
		if (this._counter === 1 && this._forceRecompute) {
			if (this._handleValue) {
				this._handleValue(observable.get());
			} else {
				observable.reportChanges();
			}
		}
		this._counter--;
	}

	handlePossibleChange<T>(observable: IObservable<T>): void {
		// NO OP
	}

	handleChange<T, TChange>(observable: IObservableWithChange<T, TChange>, change: TChange): void {
		// NO OP
	}
}

export function derivedObservableWithCache<T>(owner: DebugOwner, computeFn: (reader: IReader, lastValue: T | undefined) => T): IObservable<T> {
	let lastValue: T | undefined = undefined;
	const observable = derivedOpts({ owner, debugReferenceFn: computeFn }, reader => {
		lastValue = computeFn(reader, lastValue);
		return lastValue;
	});
	return observable;
}

export function derivedObservableWithWritableCache<T>(owner: object, computeFn: (reader: IReader, lastValue: T | undefined) => T): IObservable<T>
	& { clearCache(transaction: ITransaction): void; setCache(newValue: T | undefined, tx: ITransaction | undefined): void } {
	let lastValue: T | undefined = undefined;
	const onChange = observableSignal('derivedObservableWithWritableCache');
	const observable = derived(owner, reader => {
		onChange.read(reader);
		lastValue = computeFn(reader, lastValue);
		return lastValue;
	});
	return Object.assign(observable, {
		clearCache: (tx: ITransaction) => {
			lastValue = undefined;
			onChange.trigger(tx);
		},
		setCache: (newValue: T | undefined, tx: ITransaction | undefined) => {
			lastValue = newValue;
			onChange.trigger(tx);
		}
	});
}

/**
 * When the items array changes, referential equal items are not mapped again.
 */
export function mapObservableArrayCached<TIn, TOut, TKey = TIn>(owner: DebugOwner, items: IObservable<readonly TIn[]>, map: (input: TIn, store: DisposableStore) => TOut, keySelector?: (input: TIn) => TKey): IObservable<readonly TOut[]> {
	let m = new ArrayMap(map, keySelector);
	const self = derivedOpts({
		debugReferenceFn: map,
		owner,
		onLastObserverRemoved: () => {
			m.dispose();
			m = new ArrayMap(map);
		}
	}, (reader) => {
		const i = items.read(reader);
		m.setItems(i);
		return m.getItems();
	});
	return self;
}

class ArrayMap<TIn, TOut, TKey> implements IDisposable {
	private readonly _cache = new Map<TKey, { out: TOut; store: DisposableStore }>();
	private _items: TOut[] = [];
	constructor(
		private readonly _map: (input: TIn, store: DisposableStore) => TOut,
		private readonly _keySelector?: (input: TIn) => TKey,
	) {
	}

	public dispose(): void {
		this._cache.forEach(entry => entry.store.dispose());
		this._cache.clear();
	}

	public setItems(items: readonly TIn[]): void {
		const newItems: TOut[] = [];
		const itemsToRemove = new Set(this._cache.keys());

		for (const item of items) {
			const key = this._keySelector ? this._keySelector(item) : item as unknown as TKey;

			let entry = this._cache.get(key);
			if (!entry) {
				const store = new DisposableStore();
				const out = this._map(item, store);
				entry = { out, store };
				this._cache.set(key, entry);
			} else {
				itemsToRemove.delete(key);
			}
			newItems.push(entry.out);
		}

		for (const item of itemsToRemove) {
			const entry = this._cache.get(item)!;
			entry.store.dispose();
			this._cache.delete(item);
		}

		this._items = newItems;
	}

	public getItems(): TOut[] {
		return this._items;
	}
}

export function isObservable<T>(obj: unknown): obj is IObservable<T> {
	return !!obj && (<IObservable<T>>obj).read !== undefined && (<IObservable<T>>obj).reportChanges !== undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/observableInternal/utils/utilsCancellation.ts]---
Location: vscode-main/src/vs/base/common/observableInternal/utils/utilsCancellation.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IReader, IObservable } from '../base.js';
import { DebugOwner, DebugNameData } from '../debugName.js';
import { CancellationError, CancellationToken, CancellationTokenSource } from '../commonFacade/cancellation.js';
import { strictEquals } from '../commonFacade/deps.js';
import { autorun } from '../reactions/autorun.js';
import { Derived } from '../observables/derivedImpl.js';
import { DebugLocation } from '../debugLocation.js';

/**
 * Resolves the promise when the observables state matches the predicate.
 */
export function waitForState<T>(observable: IObservable<T | null | undefined>): Promise<T>;
export function waitForState<T, TState extends T>(observable: IObservable<T>, predicate: (state: T) => state is TState, isError?: (state: T) => boolean | unknown | undefined, cancellationToken?: CancellationToken): Promise<TState>;
export function waitForState<T>(observable: IObservable<T>, predicate: (state: T) => boolean, isError?: (state: T) => boolean | unknown | undefined, cancellationToken?: CancellationToken): Promise<T>;
export function waitForState<T>(observable: IObservable<T>, predicate?: (state: T) => boolean, isError?: (state: T) => boolean | unknown | undefined, cancellationToken?: CancellationToken): Promise<T> {
	if (!predicate) {
		predicate = state => state !== null && state !== undefined;
	}
	return new Promise((resolve, reject) => {
		let isImmediateRun = true;
		let shouldDispose = false;
		const stateObs = observable.map(state => {
			/** @description waitForState.state */
			return {
				isFinished: predicate(state),
				error: isError ? isError(state) : false,
				state
			};
		});
		const d = autorun(reader => {
			/** @description waitForState */
			const { isFinished, error, state } = stateObs.read(reader);
			if (isFinished || error) {
				if (isImmediateRun) {
					// The variable `d` is not initialized yet
					shouldDispose = true;
				} else {
					d.dispose();
				}
				if (error) {
					reject(error === true ? state : error);
				} else {
					resolve(state);
				}
			}
		});
		if (cancellationToken) {
			const dc = cancellationToken.onCancellationRequested(() => {
				d.dispose();
				dc.dispose();
				reject(new CancellationError());
			});
			if (cancellationToken.isCancellationRequested) {
				d.dispose();
				dc.dispose();
				reject(new CancellationError());
				return;
			}
		}
		isImmediateRun = false;
		if (shouldDispose) {
			d.dispose();
		}
	});
}

export function derivedWithCancellationToken<T>(computeFn: (reader: IReader, cancellationToken: CancellationToken) => T): IObservable<T>;
export function derivedWithCancellationToken<T>(owner: object, computeFn: (reader: IReader, cancellationToken: CancellationToken) => T): IObservable<T>;
export function derivedWithCancellationToken<T>(computeFnOrOwner: ((reader: IReader, cancellationToken: CancellationToken) => T) | object, computeFnOrUndefined?: ((reader: IReader, cancellationToken: CancellationToken) => T)): IObservable<T> {
	let computeFn: (reader: IReader, store: CancellationToken) => T;
	let owner: DebugOwner;
	if (computeFnOrUndefined === undefined) {
		// eslint-disable-next-line local/code-no-any-casts
		computeFn = computeFnOrOwner as any;
		owner = undefined;
	} else {
		owner = computeFnOrOwner;
		// eslint-disable-next-line local/code-no-any-casts
		computeFn = computeFnOrUndefined as any;
	}

	let cancellationTokenSource: CancellationTokenSource | undefined = undefined;
	return new Derived(
		new DebugNameData(owner, undefined, computeFn),
		r => {
			if (cancellationTokenSource) {
				cancellationTokenSource.dispose(true);
			}
			cancellationTokenSource = new CancellationTokenSource();
			return computeFn(r, cancellationTokenSource.token);
		}, undefined,
		() => cancellationTokenSource?.dispose(),
		strictEquals,
		DebugLocation.ofCaller()
	);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/observableInternal/utils/valueWithChangeEvent.ts]---
Location: vscode-main/src/vs/base/common/observableInternal/utils/valueWithChangeEvent.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IObservable } from '../base.js';
import { Event, IValueWithChangeEvent } from '../commonFacade/deps.js';
import { DebugOwner } from '../debugName.js';
import { observableFromEvent } from '../observables/observableFromEvent.js';

export class ValueWithChangeEventFromObservable<T> implements IValueWithChangeEvent<T> {
	constructor(public readonly observable: IObservable<T>) {
	}

	get onDidChange(): Event<void> {
		return Event.fromObservableLight(this.observable);
	}

	get value(): T {
		return this.observable.get();
	}
}

export function observableFromValueWithChangeEvent<T>(owner: DebugOwner, value: IValueWithChangeEvent<T>): IObservable<T> {
	if (value instanceof ValueWithChangeEventFromObservable) {
		return value.observable;
	}
	return observableFromEvent(owner, value.onDidChange, () => value.value);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/semver/cgmanifest.json]---
Location: vscode-main/src/vs/base/common/semver/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "semver",
					"repositoryUrl": "https://github.com/npm/node-semver",
					"commitHash": "44cbc8482ac4f0f8d2de0abb7f8808056d2d55f9"
				}
			},
			"license": "The ISC License",
			"version": "5.5.0"
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/semver/semver.d.ts]---
Location: vscode-main/src/vs/base/common/semver/semver.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export * from 'semver'

declare namespace semver {

	// Type definitions for semver 6.2
	// Project: https://github.com/npm/node-semver
	// Definitions by: Bart van der Schoor <https://github.com/Bartvds>
	//                 BendingBender <https://github.com/BendingBender>
	//                 Lucian Buzzo <https://github.com/LucianBuzzo>
	//                 Klaus Meinhardt <https://github.com/ajafff>
	//                 ExE Boss <https://github.com/ExE-Boss>
	// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/semver

	export const SEMVER_SPEC_VERSION: "2.0.0";

	export type ReleaseType = "major" | "premajor" | "minor" | "preminor" | "patch" | "prepatch" | "prerelease";

	export interface Options {
		loose?: boolean;
		includePrerelease?: boolean;
	}

	export interface CoerceOptions extends Options {
		/**
		 * Used by `coerce()` to coerce from right to left.
		 *
		 * @default false
		 *
		 * @example
		 * coerce('1.2.3.4', { rtl: true });
		 * // => SemVer { version: '2.3.4', ... }
		 *
		 * @since 6.2.0
		 */
		rtl?: boolean;
	}

	/**
	 * Return the parsed version as a SemVer object, or null if it's not valid.
	 */
	export function parse(version: string | SemVer | null | undefined, optionsOrLoose?: boolean | Options): SemVer | null;

	/**
	 * Return the parsed version as a string, or null if it's not valid.
	 */
	export function valid(version: string | SemVer | null | undefined, optionsOrLoose?: boolean | Options): string | null;

	/**
	 * Coerces a string to SemVer if possible
	 */
	export function coerce(version: string | number | SemVer | null | undefined, options?: CoerceOptions): SemVer | null;

	/**
	 * Returns cleaned (removed leading/trailing whitespace, remove '=v' prefix) and parsed version, or null if version is invalid.
	 */
	export function clean(version: string, optionsOrLoose?: boolean | Options): string | null;

	/**
	 * Return the version incremented by the release type (major, minor, patch, or prerelease), or null if it's not valid.
	 */
	export function inc(version: string | SemVer, release: ReleaseType, optionsOrLoose?: boolean | Options, identifier?: string): string | null;
	export function inc(version: string | SemVer, release: ReleaseType, identifier?: string): string | null;

	/**
	 * Return the major version number.
	 */
	export function major(version: string | SemVer, optionsOrLoose?: boolean | Options): number;

	/**
	 * Return the minor version number.
	 */
	export function minor(version: string | SemVer, optionsOrLoose?: boolean | Options): number;

	/**
	 * Return the patch version number.
	 */
	export function patch(version: string | SemVer, optionsOrLoose?: boolean | Options): number;

	/**
	 * Returns an array of prerelease components, or null if none exist.
	 */
	export function prerelease(version: string | SemVer, optionsOrLoose?: boolean | Options): ReadonlyArray<string> | null;

	// Comparison
	/**
	 * v1 > v2
	 */
	export function gt(v1: string | SemVer, v2: string | SemVer, optionsOrLoose?: boolean | Options): boolean;
	/**
	 * v1 >= v2
	 */
	export function gte(v1: string | SemVer, v2: string | SemVer, optionsOrLoose?: boolean | Options): boolean;
	/**
	 * v1 < v2
	 */
	export function lt(v1: string | SemVer, v2: string | SemVer, optionsOrLoose?: boolean | Options): boolean;
	/**
	 * v1 <= v2
	 */
	export function lte(v1: string | SemVer, v2: string | SemVer, optionsOrLoose?: boolean | Options): boolean;
	/**
	 * v1 == v2 This is true if they're logically equivalent, even if they're not the exact same string. You already know how to compare strings.
	 */
	export function eq(v1: string | SemVer, v2: string | SemVer, optionsOrLoose?: boolean | Options): boolean;
	/**
	 * v1 != v2 The opposite of eq.
	 */
	export function neq(v1: string | SemVer, v2: string | SemVer, optionsOrLoose?: boolean | Options): boolean;

	/**
	 * Pass in a comparison string, and it'll call the corresponding semver comparison function.
	 * "===" and "!==" do simple string comparison, but are included for completeness.
	 * Throws if an invalid comparison string is provided.
	 */
	export function cmp(v1: string | SemVer, operator: Operator, v2: string | SemVer, optionsOrLoose?: boolean | Options): boolean;
	export type Operator = '===' | '!==' | '' | '=' | '==' | '!=' | '>' | '>=' | '<' | '<=';

	/**
	 * Compares two versions excluding build identifiers (the bit after `+` in the semantic version string).
	 *
	 * Sorts in ascending order when passed to `Array.sort()`.
	 *
	 * @return
	 * - `0` if `v1` == `v2`
	 * - `1` if `v1` is greater
	 * - `-1` if `v2` is greater.
	 */
	export function compare(v1: string | SemVer, v2: string | SemVer, optionsOrLoose?: boolean | Options): 1 | 0 | -1;
	/**
	 * The reverse of compare.
	 *
	 * Sorts in descending order when passed to `Array.sort()`.
	 */
	export function rcompare(v1: string | SemVer, v2: string | SemVer, optionsOrLoose?: boolean | Options): 1 | 0 | -1;

	/**
	 * Compares two identifiers, must be numeric strings or truthy/falsy values.
	 *
	 * Sorts in ascending order when passed to `Array.sort()`.
	 */
	export function compareIdentifiers(a: string | null | undefined, b: string | null | undefined): 1 | 0 | -1;
	/**
	 * The reverse of compareIdentifiers.
	 *
	 * Sorts in descending order when passed to `Array.sort()`.
	 */
	export function rcompareIdentifiers(a: string | null | undefined, b: string | null | undefined): 1 | 0 | -1;

	/**
	 * Compares two versions including build identifiers (the bit after `+` in the semantic version string).
	 *
	 * Sorts in ascending order when passed to `Array.sort()`.
	 *
	 * @return
	 * - `0` if `v1` == `v2`
	 * - `1` if `v1` is greater
	 * - `-1` if `v2` is greater.
	 *
	 * @since 6.1.0
	 */
	export function compareBuild(a: string | SemVer, b: string | SemVer): 1 | 0 | -1;

	/**
	 * Sorts an array of semver entries in ascending order using `compareBuild()`.
	 */
	export function sort<T extends string | SemVer>(list: T[], optionsOrLoose?: boolean | Options): T[];
	/**
	 * Sorts an array of semver entries in descending order using `compareBuild()`.
	 */
	export function rsort<T extends string | SemVer>(list: T[], optionsOrLoose?: boolean | Options): T[];

	/**
	 * Returns difference between two versions by the release type (major, premajor, minor, preminor, patch, prepatch, or prerelease), or null if the versions are the same.
	 */
	export function diff(v1: string | SemVer, v2: string | SemVer, optionsOrLoose?: boolean | Options): ReleaseType | null;

	// Ranges
	/**
	 * Return the valid range or null if it's not valid
	 */
	export function validRange(range: string | Range | null | undefined, optionsOrLoose?: boolean | Options): string;
	/**
	 * Return true if the version satisfies the range.
	 */
	export function satisfies(version: string | SemVer, range: string | Range, optionsOrLoose?: boolean | Options): boolean;
	/**
	 * Return the highest version in the list that satisfies the range, or null if none of them do.
	 */
	export function maxSatisfying<T extends string | SemVer>(versions: ReadonlyArray<T>, range: string | Range, optionsOrLoose?: boolean | Options): T | null;
	/**
	 * Return the lowest version in the list that satisfies the range, or null if none of them do.
	 */
	export function minSatisfying<T extends string | SemVer>(versions: ReadonlyArray<T>, range: string | Range, optionsOrLoose?: boolean | Options): T | null;
	/**
	 * Return the lowest version that can possibly match the given range.
	 */
	export function minVersion(range: string | Range, optionsOrLoose?: boolean | Options): SemVer | null;
	/**
	 * Return true if version is greater than all the versions possible in the range.
	 */
	export function gtr(version: string | SemVer, range: string | Range, optionsOrLoose?: boolean | Options): boolean;
	/**
	 * Return true if version is less than all the versions possible in the range.
	 */
	export function ltr(version: string | SemVer, range: string | Range, optionsOrLoose?: boolean | Options): boolean;
	/**
	 * Return true if the version is outside the bounds of the range in either the high or low direction.
	 * The hilo argument must be either the string '>' or '<'. (This is the function called by gtr and ltr.)
	 */
	export function outside(version: string | SemVer, range: string | Range, hilo: '>' | '<', optionsOrLoose?: boolean | Options): boolean;
	/**
	 * Return true if any of the ranges comparators intersect
	 */
	export function intersects(range1: string | Range, range2: string | Range, optionsOrLoose?: boolean | Options): boolean;

	export class SemVer {
		constructor(version: string | SemVer, optionsOrLoose?: boolean | Options);

		raw: string;
		loose: boolean;
		options: Options;
		format(): string;
		inspect(): string;

		major: number;
		minor: number;
		patch: number;
		version: string;
		build: ReadonlyArray<string>;
		prerelease: ReadonlyArray<string | number>;

		/**
		 * Compares two versions excluding build identifiers (the bit after `+` in the semantic version string).
		 *
		 * @return
		 * - `0` if `this` == `other`
		 * - `1` if `this` is greater
		 * - `-1` if `other` is greater.
		 */
		compare(other: string | SemVer): 1 | 0 | -1;

		/**
		 * Compares the release portion of two versions.
		 *
		 * @return
		 * - `0` if `this` == `other`
		 * - `1` if `this` is greater
		 * - `-1` if `other` is greater.
		 */
		compareMain(other: string | SemVer): 1 | 0 | -1;

		/**
		 * Compares the prerelease portion of two versions.
		 *
		 * @return
		 * - `0` if `this` == `other`
		 * - `1` if `this` is greater
		 * - `-1` if `other` is greater.
		 */
		comparePre(other: string | SemVer): 1 | 0 | -1;

		/**
		 * Compares the build identifier of two versions.
		 *
		 * @return
		 * - `0` if `this` == `other`
		 * - `1` if `this` is greater
		 * - `-1` if `other` is greater.
		 */
		compareBuild(other: string | SemVer): 1 | 0 | -1;

		inc(release: ReleaseType, identifier?: string): SemVer;
	}

	export class Comparator {
		constructor(comp: string | Comparator, optionsOrLoose?: boolean | Options);

		semver: SemVer;
		operator: '' | '=' | '<' | '>' | '<=' | '>=';
		value: string;
		loose: boolean;
		options: Options;
		parse(comp: string): void;
		test(version: string | SemVer): boolean;
		intersects(comp: Comparator, optionsOrLoose?: boolean | Options): boolean;
	}

	export class Range {
		constructor(range: string | Range, optionsOrLoose?: boolean | Options);

		range: string;
		raw: string;
		loose: boolean;
		options: Options;
		includePrerelease: boolean;
		format(): string;
		inspect(): string;

		set: ReadonlyArray<ReadonlyArray<Comparator>>;
		parseRange(range: string): ReadonlyArray<Comparator>;
		test(version: string | SemVer): boolean;
		intersects(range: Range, optionsOrLoose?: boolean | Options): boolean;
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/semver/semver.js]---
Location: vscode-main/src/vs/base/common/semver/semver.js

```javascript
/**
 * Semver UMD module
 * Copyright (c) Isaac Z. Schlueter and Contributors
 * https://github.com/npm/node-semver
 */

/**
 * DO NOT EDIT THIS FILE
 */

const exports = {};
const module = { exports };

!function(e,r){if("object"==typeof exports&&"object"==typeof module)module.exports=r();else if("function"==typeof define&&define.amd)define([],r);else{var t=r();for(var n in t)("object"==typeof exports?exports:e)[n]=t[n]}}("undefined"!=typeof self?self:this,(function(){return function(e){var r={};function t(n){if(r[n])return r[n].exports;var o=r[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,t),o.l=!0,o.exports}return t.m=e,t.c=r,t.d=function(e,r,n){t.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:n})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,r){if(1&r&&(e=t(e)),8&r)return e;if(4&r&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(t.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&r&&"string"!=typeof e)for(var o in e)t.d(n,o,function(r){return e[r]}.bind(null,o));return n},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},t.p="",t(t.s=0)}([function(e,r,t){(function(t){var n;r=e.exports=H,n="object"==typeof t&&t.env&&t.env.NODE_DEBUG&&/\bsemver\b/i.test(t.env.NODE_DEBUG)?function(){var e=Array.prototype.slice.call(arguments,0);e.unshift("SEMVER"),console.log.apply(console,e)}:function(){},r.SEMVER_SPEC_VERSION="2.0.0";var o=256,i=Number.MAX_SAFE_INTEGER||9007199254740991,s=r.re=[],a=r.src=[],u=0,c=u++;a[c]="0|[1-9]\\d*";var p=u++;a[p]="[0-9]+";var f=u++;a[f]="\\d*[a-zA-Z-][a-zA-Z0-9-]*";var l=u++;a[l]="("+a[c]+")\\.("+a[c]+")\\.("+a[c]+")";var h=u++;a[h]="("+a[p]+")\\.("+a[p]+")\\.("+a[p]+")";var v=u++;a[v]="(?:"+a[c]+"|"+a[f]+")";var m=u++;a[m]="(?:"+a[p]+"|"+a[f]+")";var w=u++;a[w]="(?:-("+a[v]+"(?:\\."+a[v]+")*))";var g=u++;a[g]="(?:-?("+a[m]+"(?:\\."+a[m]+")*))";var y=u++;a[y]="[0-9A-Za-z-]+";var d=u++;a[d]="(?:\\+("+a[y]+"(?:\\."+a[y]+")*))";var b=u++,j="v?"+a[l]+a[w]+"?"+a[d]+"?";a[b]="^"+j+"$";var E="[v=\\s]*"+a[h]+a[g]+"?"+a[d]+"?",T=u++;a[T]="^"+E+"$";var x=u++;a[x]="((?:<|>)?=?)";var $=u++;a[$]=a[p]+"|x|X|\\*";var k=u++;a[k]=a[c]+"|x|X|\\*";var S=u++;a[S]="[v=\\s]*("+a[k]+")(?:\\.("+a[k]+")(?:\\.("+a[k]+")(?:"+a[w]+")?"+a[d]+"?)?)?";var R=u++;a[R]="[v=\\s]*("+a[$]+")(?:\\.("+a[$]+")(?:\\.("+a[$]+")(?:"+a[g]+")?"+a[d]+"?)?)?";var I=u++;a[I]="^"+a[x]+"\\s*"+a[S]+"$";var _=u++;a[_]="^"+a[x]+"\\s*"+a[R]+"$";var O=u++;a[O]="(?:^|[^\\d])(\\d{1,16})(?:\\.(\\d{1,16}))?(?:\\.(\\d{1,16}))?(?:$|[^\\d])";var A=u++;a[A]="(?:~>?)";var M=u++;a[M]="(\\s*)"+a[A]+"\\s+",s[M]=new RegExp(a[M],"g");var V=u++;a[V]="^"+a[A]+a[S]+"$";var P=u++;a[P]="^"+a[A]+a[R]+"$";var C=u++;a[C]="(?:\\^)";var L=u++;a[L]="(\\s*)"+a[C]+"\\s+",s[L]=new RegExp(a[L],"g");var N=u++;a[N]="^"+a[C]+a[S]+"$";var q=u++;a[q]="^"+a[C]+a[R]+"$";var D=u++;a[D]="^"+a[x]+"\\s*("+E+")$|^$";var X=u++;a[X]="^"+a[x]+"\\s*("+j+")$|^$";var z=u++;a[z]="(\\s*)"+a[x]+"\\s*("+E+"|"+a[S]+")",s[z]=new RegExp(a[z],"g");var G=u++;a[G]="^\\s*("+a[S]+")\\s+-\\s+("+a[S]+")\\s*$";var Z=u++;a[Z]="^\\s*("+a[R]+")\\s+-\\s+("+a[R]+")\\s*$";var B=u++;a[B]="(<|>)?=?\\s*\\*";for(var U=0;U<35;U++)n(U,a[U]),s[U]||(s[U]=new RegExp(a[U]));function F(e,r){if(e instanceof H)return e;if("string"!=typeof e)return null;if(e.length>o)return null;if(!(r?s[T]:s[b]).test(e))return null;try{return new H(e,r)}catch(e){return null}}function H(e,r){if(e instanceof H){if(e.loose===r)return e;e=e.version}else if("string"!=typeof e)throw new TypeError("Invalid Version: "+e);if(e.length>o)throw new TypeError("version is longer than "+o+" characters");if(!(this instanceof H))return new H(e,r);n("SemVer",e,r),this.loose=r;var t=e.trim().match(r?s[T]:s[b]);if(!t)throw new TypeError("Invalid Version: "+e);if(this.raw=e,this.major=+t[1],this.minor=+t[2],this.patch=+t[3],this.major>i||this.major<0)throw new TypeError("Invalid major version");if(this.minor>i||this.minor<0)throw new TypeError("Invalid minor version");if(this.patch>i||this.patch<0)throw new TypeError("Invalid patch version");t[4]?this.prerelease=t[4].split(".").map((function(e){if(/^[0-9]+$/.test(e)){var r=+e;if(r>=0&&r<i)return r}return e})):this.prerelease=[],this.build=t[5]?t[5].split("."):[],this.format()}r.parse=F,r.valid=function(e,r){var t=F(e,r);return t?t.version:null},r.clean=function(e,r){var t=F(e.trim().replace(/^[=v]+/,""),r);return t?t.version:null},r.SemVer=H,H.prototype.format=function(){return this.version=this.major+"."+this.minor+"."+this.patch,this.prerelease.length&&(this.version+="-"+this.prerelease.join(".")),this.version},H.prototype.toString=function(){return this.version},H.prototype.compare=function(e){return n("SemVer.compare",this.version,this.loose,e),e instanceof H||(e=new H(e,this.loose)),this.compareMain(e)||this.comparePre(e)},H.prototype.compareMain=function(e){return e instanceof H||(e=new H(e,this.loose)),K(this.major,e.major)||K(this.minor,e.minor)||K(this.patch,e.patch)},H.prototype.comparePre=function(e){if(e instanceof H||(e=new H(e,this.loose)),this.prerelease.length&&!e.prerelease.length)return-1;if(!this.prerelease.length&&e.prerelease.length)return 1;if(!this.prerelease.length&&!e.prerelease.length)return 0;var r=0;do{var t=this.prerelease[r],o=e.prerelease[r];if(n("prerelease compare",r,t,o),void 0===t&&void 0===o)return 0;if(void 0===o)return 1;if(void 0===t)return-1;if(t!==o)return K(t,o)}while(++r)},H.prototype.inc=function(e,r){switch(e){case"premajor":this.prerelease.length=0,this.patch=0,this.minor=0,this.major++,this.inc("pre",r);break;case"preminor":this.prerelease.length=0,this.patch=0,this.minor++,this.inc("pre",r);break;case"prepatch":this.prerelease.length=0,this.inc("patch",r),this.inc("pre",r);break;case"prerelease":0===this.prerelease.length&&this.inc("patch",r),this.inc("pre",r);break;case"major":0===this.minor&&0===this.patch&&0!==this.prerelease.length||this.major++,this.minor=0,this.patch=0,this.prerelease=[];break;case"minor":0===this.patch&&0!==this.prerelease.length||this.minor++,this.patch=0,this.prerelease=[];break;case"patch":0===this.prerelease.length&&this.patch++,this.prerelease=[];break;case"pre":if(0===this.prerelease.length)this.prerelease=[0];else{for(var t=this.prerelease.length;--t>=0;)"number"==typeof this.prerelease[t]&&(this.prerelease[t]++,t=-2);-1===t&&this.prerelease.push(0)}r&&(this.prerelease[0]===r?isNaN(this.prerelease[1])&&(this.prerelease=[r,0]):this.prerelease=[r,0]);break;default:throw new Error("invalid increment argument: "+e)}return this.format(),this.raw=this.version,this},r.inc=function(e,r,t,n){"string"==typeof t&&(n=t,t=void 0);try{return new H(e,t).inc(r,n).version}catch(e){return null}},r.diff=function(e,r){if(ee(e,r))return null;var t=F(e),n=F(r);if(t.prerelease.length||n.prerelease.length){for(var o in t)if(("major"===o||"minor"===o||"patch"===o)&&t[o]!==n[o])return"pre"+o;return"prerelease"}for(var o in t)if(("major"===o||"minor"===o||"patch"===o)&&t[o]!==n[o])return o},r.compareIdentifiers=K;var J=/^[0-9]+$/;function K(e,r){var t=J.test(e),n=J.test(r);return t&&n&&(e=+e,r=+r),t&&!n?-1:n&&!t?1:e<r?-1:e>r?1:0}function Q(e,r,t){return new H(e,t).compare(new H(r,t))}function W(e,r,t){return Q(e,r,t)>0}function Y(e,r,t){return Q(e,r,t)<0}function ee(e,r,t){return 0===Q(e,r,t)}function re(e,r,t){return 0!==Q(e,r,t)}function te(e,r,t){return Q(e,r,t)>=0}function ne(e,r,t){return Q(e,r,t)<=0}function oe(e,r,t,n){var o;switch(r){case"===":"object"==typeof e&&(e=e.version),"object"==typeof t&&(t=t.version),o=e===t;break;case"!==":"object"==typeof e&&(e=e.version),"object"==typeof t&&(t=t.version),o=e!==t;break;case"":case"=":case"==":o=ee(e,t,n);break;case"!=":o=re(e,t,n);break;case">":o=W(e,t,n);break;case">=":o=te(e,t,n);break;case"<":o=Y(e,t,n);break;case"<=":o=ne(e,t,n);break;default:throw new TypeError("Invalid operator: "+r)}return o}function ie(e,r){if(e instanceof ie){if(e.loose===r)return e;e=e.value}if(!(this instanceof ie))return new ie(e,r);n("comparator",e,r),this.loose=r,this.parse(e),this.semver===se?this.value="":this.value=this.operator+this.semver.version,n("comp",this)}r.rcompareIdentifiers=function(e,r){return K(r,e)},r.major=function(e,r){return new H(e,r).major},r.minor=function(e,r){return new H(e,r).minor},r.patch=function(e,r){return new H(e,r).patch},r.compare=Q,r.compareLoose=function(e,r){return Q(e,r,!0)},r.rcompare=function(e,r,t){return Q(r,e,t)},r.sort=function(e,t){return e.sort((function(e,n){return r.compare(e,n,t)}))},r.rsort=function(e,t){return e.sort((function(e,n){return r.rcompare(e,n,t)}))},r.gt=W,r.lt=Y,r.eq=ee,r.neq=re,r.gte=te,r.lte=ne,r.cmp=oe,r.Comparator=ie;var se={};function ae(e,r){if(e instanceof ae)return e.loose===r?e:new ae(e.raw,r);if(e instanceof ie)return new ae(e.value,r);if(!(this instanceof ae))return new ae(e,r);if(this.loose=r,this.raw=e,this.set=e.split(/\s*\|\|\s*/).map((function(e){return this.parseRange(e.trim())}),this).filter((function(e){return e.length})),!this.set.length)throw new TypeError("Invalid SemVer Range: "+e);this.format()}function ue(e){return!e||"x"===e.toLowerCase()||"*"===e}function ce(e,r,t,n,o,i,s,a,u,c,p,f,l){return((r=ue(t)?"":ue(n)?">="+t+".0.0":ue(o)?">="+t+"."+n+".0":">="+r)+" "+(a=ue(u)?"":ue(c)?"<"+(+u+1)+".0.0":ue(p)?"<"+u+"."+(+c+1)+".0":f?"<="+u+"."+c+"."+p+"-"+f:"<="+a)).trim()}function pe(e,r){for(var t=0;t<e.length;t++)if(!e[t].test(r))return!1;if(r.prerelease.length){for(t=0;t<e.length;t++)if(n(e[t].semver),e[t].semver!==se&&e[t].semver.prerelease.length>0){var o=e[t].semver;if(o.major===r.major&&o.minor===r.minor&&o.patch===r.patch)return!0}return!1}return!0}function fe(e,r,t){try{r=new ae(r,t)}catch(e){return!1}return r.test(e)}function le(e,r,t,n){var o,i,s,a,u;switch(e=new H(e,n),r=new ae(r,n),t){case">":o=W,i=ne,s=Y,a=">",u=">=";break;case"<":o=Y,i=te,s=W,a="<",u="<=";break;default:throw new TypeError('Must provide a hilo val of "<" or ">"')}if(fe(e,r,n))return!1;for(var c=0;c<r.set.length;++c){var p=r.set[c],f=null,l=null;if(p.forEach((function(e){e.semver===se&&(e=new ie(">=0.0.0")),f=f||e,l=l||e,o(e.semver,f.semver,n)?f=e:s(e.semver,l.semver,n)&&(l=e)})),f.operator===a||f.operator===u)return!1;if((!l.operator||l.operator===a)&&i(e,l.semver))return!1;if(l.operator===u&&s(e,l.semver))return!1}return!0}ie.prototype.parse=function(e){var r=this.loose?s[D]:s[X],t=e.match(r);if(!t)throw new TypeError("Invalid comparator: "+e);this.operator=t[1],"="===this.operator&&(this.operator=""),t[2]?this.semver=new H(t[2],this.loose):this.semver=se},ie.prototype.toString=function(){return this.value},ie.prototype.test=function(e){return n("Comparator.test",e,this.loose),this.semver===se||("string"==typeof e&&(e=new H(e,this.loose)),oe(e,this.operator,this.semver,this.loose))},ie.prototype.intersects=function(e,r){if(!(e instanceof ie))throw new TypeError("a Comparator is required");var t;if(""===this.operator)return t=new ae(e.value,r),fe(this.value,t,r);if(""===e.operator)return t=new ae(this.value,r),fe(e.semver,t,r);var n=!(">="!==this.operator&&">"!==this.operator||">="!==e.operator&&">"!==e.operator),o=!("<="!==this.operator&&"<"!==this.operator||"<="!==e.operator&&"<"!==e.operator),i=this.semver.version===e.semver.version,s=!(">="!==this.operator&&"<="!==this.operator||">="!==e.operator&&"<="!==e.operator),a=oe(this.semver,"<",e.semver,r)&&(">="===this.operator||">"===this.operator)&&("<="===e.operator||"<"===e.operator),u=oe(this.semver,">",e.semver,r)&&("<="===this.operator||"<"===this.operator)&&(">="===e.operator||">"===e.operator);return n||o||i&&s||a||u},r.Range=ae,ae.prototype.format=function(){return this.range=this.set.map((function(e){return e.join(" ").trim()})).join("||").trim(),this.range},ae.prototype.toString=function(){return this.range},ae.prototype.parseRange=function(e){var r=this.loose;e=e.trim(),n("range",e,r);var t=r?s[Z]:s[G];e=e.replace(t,ce),n("hyphen replace",e),e=e.replace(s[z],"$1$2$3"),n("comparator trim",e,s[z]),e=(e=(e=e.replace(s[M],"$1~")).replace(s[L],"$1^")).split(/\s+/).join(" ");var o=r?s[D]:s[X],i=e.split(" ").map((function(e){return function(e,r){return n("comp",e),e=function(e,r){return e.trim().split(/\s+/).map((function(e){return function(e,r){n("caret",e,r);var t=r?s[q]:s[N];return e.replace(t,(function(r,t,o,i,s){var a;return n("caret",e,r,t,o,i,s),ue(t)?a="":ue(o)?a=">="+t+".0.0 <"+(+t+1)+".0.0":ue(i)?a="0"===t?">="+t+"."+o+".0 <"+t+"."+(+o+1)+".0":">="+t+"."+o+".0 <"+(+t+1)+".0.0":s?(n("replaceCaret pr",s),"-"!==s.charAt(0)&&(s="-"+s),a="0"===t?"0"===o?">="+t+"."+o+"."+i+s+" <"+t+"."+o+"."+(+i+1):">="+t+"."+o+"."+i+s+" <"+t+"."+(+o+1)+".0":">="+t+"."+o+"."+i+s+" <"+(+t+1)+".0.0"):(n("no pr"),a="0"===t?"0"===o?">="+t+"."+o+"."+i+" <"+t+"."+o+"."+(+i+1):">="+t+"."+o+"."+i+" <"+t+"."+(+o+1)+".0":">="+t+"."+o+"."+i+" <"+(+t+1)+".0.0"),n("caret return",a),a}))}(e,r)})).join(" ")}(e,r),n("caret",e),e=function(e,r){return e.trim().split(/\s+/).map((function(e){return function(e,r){var t=r?s[P]:s[V];return e.replace(t,(function(r,t,o,i,s){var a;return n("tilde",e,r,t,o,i,s),ue(t)?a="":ue(o)?a=">="+t+".0.0 <"+(+t+1)+".0.0":ue(i)?a=">="+t+"."+o+".0 <"+t+"."+(+o+1)+".0":s?(n("replaceTilde pr",s),"-"!==s.charAt(0)&&(s="-"+s),a=">="+t+"."+o+"."+i+s+" <"+t+"."+(+o+1)+".0"):a=">="+t+"."+o+"."+i+" <"+t+"."+(+o+1)+".0",n("tilde return",a),a}))}(e,r)})).join(" ")}(e,r),n("tildes",e),e=function(e,r){return n("replaceXRanges",e,r),e.split(/\s+/).map((function(e){return function(e,r){e=e.trim();var t=r?s[_]:s[I];return e.replace(t,(function(r,t,o,i,s,a){n("xRange",e,r,t,o,i,s,a);var u=ue(o),c=u||ue(i),p=c||ue(s);return"="===t&&p&&(t=""),u?r=">"===t||"<"===t?"<0.0.0":"*":t&&p?(c&&(i=0),p&&(s=0),">"===t?(t=">=",c?(o=+o+1,i=0,s=0):p&&(i=+i+1,s=0)):"<="===t&&(t="<",c?o=+o+1:i=+i+1),r=t+o+"."+i+"."+s):c?r=">="+o+".0.0 <"+(+o+1)+".0.0":p&&(r=">="+o+"."+i+".0 <"+o+"."+(+i+1)+".0"),n("xRange return",r),r}))}(e,r)})).join(" ")}(e,r),n("xrange",e),e=function(e,r){return n("replaceStars",e,r),e.trim().replace(s[B],"")}(e,r),n("stars",e),e}(e,r)})).join(" ").split(/\s+/);return this.loose&&(i=i.filter((function(e){return!!e.match(o)}))),i=i.map((function(e){return new ie(e,r)}))},ae.prototype.intersects=function(e,r){if(!(e instanceof ae))throw new TypeError("a Range is required");return this.set.some((function(t){return t.every((function(t){return e.set.some((function(e){return e.every((function(e){return t.intersects(e,r)}))}))}))}))},r.toComparators=function(e,r){return new ae(e,r).set.map((function(e){return e.map((function(e){return e.value})).join(" ").trim().split(" ")}))},ae.prototype.test=function(e){if(!e)return!1;"string"==typeof e&&(e=new H(e,this.loose));for(var r=0;r<this.set.length;r++)if(pe(this.set[r],e))return!0;return!1},r.satisfies=fe,r.maxSatisfying=function(e,r,t){var n=null,o=null;try{var i=new ae(r,t)}catch(e){return null}return e.forEach((function(e){i.test(e)&&(n&&-1!==o.compare(e)||(o=new H(n=e,t)))})),n},r.minSatisfying=function(e,r,t){var n=null,o=null;try{var i=new ae(r,t)}catch(e){return null}return e.forEach((function(e){i.test(e)&&(n&&1!==o.compare(e)||(o=new H(n=e,t)))})),n},r.validRange=function(e,r){try{return new ae(e,r).range||"*"}catch(e){return null}},r.ltr=function(e,r,t){return le(e,r,"<",t)},r.gtr=function(e,r,t){return le(e,r,">",t)},r.outside=le,r.prerelease=function(e,r){var t=F(e,r);return t&&t.prerelease.length?t.prerelease:null},r.intersects=function(e,r,t){return e=new ae(e,t),r=new ae(r,t),e.intersects(r)},r.coerce=function(e){if(e instanceof H)return e;if("string"!=typeof e)return null;var r=e.match(s[O]);return null==r?null:F((r[1]||"0")+"."+(r[2]||"0")+"."+(r[3]||"0"))}}).call(this,t(1))},function(e,r){var t,n,o=e.exports={};function i(){throw new Error("setTimeout has not been defined")}function s(){throw new Error("clearTimeout has not been defined")}function a(e){if(t===setTimeout)return setTimeout(e,0);if((t===i||!t)&&setTimeout)return t=setTimeout,setTimeout(e,0);try{return t(e,0)}catch(r){try{return t.call(null,e,0)}catch(r){return t.call(this,e,0)}}}!function(){try{t="function"==typeof setTimeout?setTimeout:i}catch(e){t=i}try{n="function"==typeof clearTimeout?clearTimeout:s}catch(e){n=s}}();var u,c=[],p=!1,f=-1;function l(){p&&u&&(p=!1,u.length?c=u.concat(c):f=-1,c.length&&h())}function h(){if(!p){var e=a(l);p=!0;for(var r=c.length;r;){for(u=c,c=[];++f<r;)u&&u[f].run();f=-1,r=c.length}u=null,p=!1,function(e){if(n===clearTimeout)return clearTimeout(e);if((n===s||!n)&&clearTimeout)return n=clearTimeout,clearTimeout(e);try{n(e)}catch(r){try{return n.call(null,e)}catch(r){return n.call(this,e)}}}(e)}}function v(e,r){this.fun=e,this.array=r}function m(){}o.nextTick=function(e){var r=new Array(arguments.length-1);if(arguments.length>1)for(var t=1;t<arguments.length;t++)r[t-1]=arguments[t];c.push(new v(e,r)),1!==c.length||p||a(h)},v.prototype.run=function(){this.fun.apply(null,this.array)},o.title="browser",o.browser=!0,o.env={},o.argv=[],o.version="",o.versions={},o.on=m,o.addListener=m,o.once=m,o.off=m,o.removeListener=m,o.removeAllListeners=m,o.emit=m,o.prependListener=m,o.prependOnceListener=m,o.listeners=function(e){return[]},o.binding=function(e){throw new Error("process.binding is not supported")},o.cwd=function(){return"/"},o.chdir=function(e){throw new Error("process.chdir is not supported")},o.umask=function(){return 0}}])}));

export const SEMVER_SPEC_VERSION = module.exports.SEMVER_SPEC_VERSION;
export const parse = module.exports.parse;
export const valid = module.exports.valid;
export const coerce = module.exports.coerce;
export const clean = module.exports.clean;
export const inc = module.exports.inc;
export const major = module.exports.major;
export const minor = module.exports.minor;
export const patch = module.exports.patch;
export const prerelease = module.exports.prerelease;
export const gt = module.exports.gt;
export const gte = module.exports.gte;
export const lt = module.exports.lt;
export const lte = module.exports.lte;
export const eq = module.exports.eq;
export const neq = module.exports.neq;
export const cmp = module.exports.cmp;
export const compare = module.exports.compare;
export const rcompare = module.exports.rcompare;
export const compareIdentifiers = module.exports.compareIdentifiers;
export const rcompareIdentifiers = module.exports.rcompareIdentifiers;
export const compareBuild = module.exports.compareBuild;
export const sort = module.exports.sort;
export const rsort = module.exports.rsort;
export const diff = module.exports.diff;
export const validRange = module.exports.validRange;
export const satisfies = module.exports.satisfies;
export const maxSatisfying = module.exports.maxSatisfying;
export const minSatisfying = module.exports.minSatisfying;
export const minVersion = module.exports.minVersion;
export const gtr = module.exports.gtr;
export const ltr = module.exports.ltr;
export const outside = module.exports.outside;
export const intersects = module.exports.intersects;
export const SemVer = module.exports.SemVer;
export const Comparator = module.exports.Comparator;
export const Range = module.exports.Range;
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/worker/webWorker.ts]---
Location: vscode-main/src/vs/base/common/worker/webWorker.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CharCode } from '../charCode.js';
import { onUnexpectedError, SerializedError, transformErrorForSerialization } from '../errors.js';
import { Emitter, Event } from '../event.js';
import { Disposable, IDisposable } from '../lifecycle.js';
import { isWeb } from '../platform.js';
import * as strings from '../strings.js';

const DEFAULT_CHANNEL = 'default';
const INITIALIZE = '$initialize';

export interface IWebWorker extends IDisposable {
	getId(): number;
	readonly onMessage: Event<Message>;
	readonly onError: Event<unknown>;
	postMessage(message: Message, transfer: ArrayBuffer[]): void;
}

let webWorkerWarningLogged = false;
export function logOnceWebWorkerWarning(err: unknown): void {
	if (!isWeb) {
		// running tests
		return;
	}
	if (!webWorkerWarningLogged) {
		webWorkerWarningLogged = true;
		console.warn('Could not create web worker(s). Falling back to loading web worker code in main thread, which might cause UI freezes. Please see https://github.com/microsoft/monaco-editor#faq');
	}
	console.warn((err as Error).message);
}

const enum MessageType {
	Request,
	Reply,
	SubscribeEvent,
	Event,
	UnsubscribeEvent
}
class RequestMessage {
	public readonly type = MessageType.Request;
	constructor(
		public readonly vsWorker: number,
		public readonly req: string,
		public readonly channel: string,
		public readonly method: string,
		public readonly args: unknown[]
	) { }
}
class ReplyMessage {
	public readonly type = MessageType.Reply;
	constructor(
		public readonly vsWorker: number,
		public readonly seq: string,
		public readonly res: unknown,
		public readonly err: unknown | SerializedError
	) { }
}
class SubscribeEventMessage {
	public readonly type = MessageType.SubscribeEvent;
	constructor(
		public readonly vsWorker: number,
		public readonly req: string,
		public readonly channel: string,
		public readonly eventName: string,
		public readonly arg: unknown
	) { }
}
class EventMessage {
	public readonly type = MessageType.Event;
	constructor(
		public readonly vsWorker: number,
		public readonly req: string,
		public readonly event: unknown
	) { }
}
class UnsubscribeEventMessage {
	public readonly type = MessageType.UnsubscribeEvent;
	constructor(
		public readonly vsWorker: number,
		public readonly req: string
	) { }
}
export type Message = RequestMessage | ReplyMessage | SubscribeEventMessage | EventMessage | UnsubscribeEventMessage;

interface IMessageReply {
	resolve: (value?: unknown) => void;
	reject: (error?: unknown) => void;
}

interface IMessageHandler {
	sendMessage(msg: unknown, transfer?: ArrayBuffer[]): void;
	handleMessage(channel: string, method: string, args: unknown[]): Promise<unknown>;
	handleEvent(channel: string, eventName: string, arg: unknown): Event<unknown>;
}

class WebWorkerProtocol {

	private _workerId: number;
	private _lastSentReq: number;
	private _pendingReplies: { [req: string]: IMessageReply };
	private _pendingEmitters: Map<string, Emitter<unknown>>;
	private _pendingEvents: Map<string, IDisposable>;
	private _handler: IMessageHandler;

	constructor(handler: IMessageHandler) {
		this._workerId = -1;
		this._handler = handler;
		this._lastSentReq = 0;
		this._pendingReplies = Object.create(null);
		this._pendingEmitters = new Map<string, Emitter<unknown>>();
		this._pendingEvents = new Map<string, IDisposable>();
	}

	public setWorkerId(workerId: number): void {
		this._workerId = workerId;
	}

	public async sendMessage(channel: string, method: string, args: unknown[]): Promise<unknown> {
		const req = String(++this._lastSentReq);
		return new Promise<unknown>((resolve, reject) => {
			this._pendingReplies[req] = {
				resolve: resolve,
				reject: reject
			};
			this._send(new RequestMessage(this._workerId, req, channel, method, args));
		});
	}

	public listen(channel: string, eventName: string, arg: unknown): Event<unknown> {
		let req: string | null = null;
		const emitter = new Emitter<unknown>({
			onWillAddFirstListener: () => {
				req = String(++this._lastSentReq);
				this._pendingEmitters.set(req, emitter);
				this._send(new SubscribeEventMessage(this._workerId, req, channel, eventName, arg));
			},
			onDidRemoveLastListener: () => {
				this._pendingEmitters.delete(req!);
				this._send(new UnsubscribeEventMessage(this._workerId, req!));
				req = null;
			}
		});
		return emitter.event;
	}

	public handleMessage(message: unknown): void {
		if (!message || !(message as Message).vsWorker) {
			return;
		}
		if (this._workerId !== -1 && (message as Message).vsWorker !== this._workerId) {
			return;
		}
		this._handleMessage(message as Message);
	}

	public createProxyToRemoteChannel<T extends object>(channel: string, sendMessageBarrier?: () => Promise<void>): T {
		const handler = {
			get: (target: Record<PropertyKey, unknown>, name: PropertyKey) => {
				if (typeof name === 'string' && !target[name]) {
					if (propertyIsDynamicEvent(name)) { // onDynamic...
						target[name] = (arg: unknown): Event<unknown> => {
							return this.listen(channel, name, arg);
						};
					} else if (propertyIsEvent(name)) { // on...
						target[name] = this.listen(channel, name, undefined);
					} else if (name.charCodeAt(0) === CharCode.DollarSign) { // $...
						target[name] = async (...myArgs: unknown[]) => {
							await sendMessageBarrier?.();
							return this.sendMessage(channel, name, myArgs);
						};
					}
				}
				return target[name];
			}
		};
		return new Proxy(Object.create(null), handler);
	}

	private _handleMessage(msg: Message): void {
		switch (msg.type) {
			case MessageType.Reply:
				return this._handleReplyMessage(msg);
			case MessageType.Request:
				return this._handleRequestMessage(msg);
			case MessageType.SubscribeEvent:
				return this._handleSubscribeEventMessage(msg);
			case MessageType.Event:
				return this._handleEventMessage(msg);
			case MessageType.UnsubscribeEvent:
				return this._handleUnsubscribeEventMessage(msg);
		}
	}

	private _handleReplyMessage(replyMessage: ReplyMessage): void {
		if (!this._pendingReplies[replyMessage.seq]) {
			console.warn('Got reply to unknown seq');
			return;
		}

		const reply = this._pendingReplies[replyMessage.seq];
		delete this._pendingReplies[replyMessage.seq];

		if (replyMessage.err) {
			let err = replyMessage.err;
			if ((replyMessage.err as SerializedError).$isError) {
				const newErr = new Error();
				newErr.name = (replyMessage.err as SerializedError).name;
				newErr.message = (replyMessage.err as SerializedError).message;
				newErr.stack = (replyMessage.err as SerializedError).stack;
				err = newErr;
			}
			reply.reject(err);
			return;
		}

		reply.resolve(replyMessage.res);
	}

	private _handleRequestMessage(requestMessage: RequestMessage): void {
		const req = requestMessage.req;
		const result = this._handler.handleMessage(requestMessage.channel, requestMessage.method, requestMessage.args);
		result.then((r) => {
			this._send(new ReplyMessage(this._workerId, req, r, undefined));
		}, (e) => {
			if (e.detail instanceof Error) {
				// Loading errors have a detail property that points to the actual error
				e.detail = transformErrorForSerialization(e.detail);
			}
			this._send(new ReplyMessage(this._workerId, req, undefined, transformErrorForSerialization(e)));
		});
	}

	private _handleSubscribeEventMessage(msg: SubscribeEventMessage): void {
		const req = msg.req;
		const disposable = this._handler.handleEvent(msg.channel, msg.eventName, msg.arg)((event) => {
			this._send(new EventMessage(this._workerId, req, event));
		});
		this._pendingEvents.set(req, disposable);
	}

	private _handleEventMessage(msg: EventMessage): void {
		const emitter = this._pendingEmitters.get(msg.req);
		if (emitter === undefined) {
			console.warn('Got event for unknown req');
			return;
		}
		emitter.fire(msg.event);
	}

	private _handleUnsubscribeEventMessage(msg: UnsubscribeEventMessage): void {
		const event = this._pendingEvents.get(msg.req);
		if (event === undefined) {
			console.warn('Got unsubscribe for unknown req');
			return;
		}
		event.dispose();
		this._pendingEvents.delete(msg.req);
	}

	private _send(msg: Message): void {
		const transfer: ArrayBuffer[] = [];
		if (msg.type === MessageType.Request) {
			for (let i = 0; i < msg.args.length; i++) {
				const arg = msg.args[i];
				if (arg instanceof ArrayBuffer) {
					transfer.push(arg);
				}
			}
		} else if (msg.type === MessageType.Reply) {
			if (msg.res instanceof ArrayBuffer) {
				transfer.push(msg.res);
			}
		}
		this._handler.sendMessage(msg, transfer);
	}
}

type ProxiedMethodName = (`$${string}` | `on${string}`);

export type Proxied<T> = { [K in keyof T]: T[K] extends (...args: infer A) => infer R
	? (
		K extends ProxiedMethodName
		? (...args: A) => Promise<Awaited<R>>
		: never
	)
	: never
};

export interface IWebWorkerClient<TProxy> {
	proxy: Proxied<TProxy>;
	dispose(): void;
	setChannel<T extends object>(channel: string, handler: T): void;
	getChannel<T extends object>(channel: string): Proxied<T>;
}

export interface IWebWorkerServer {
	setChannel<T extends object>(channel: string, handler: T): void;
	getChannel<T extends object>(channel: string): Proxied<T>;
}

/**
 * Main thread side
 */
export class WebWorkerClient<W extends object> extends Disposable implements IWebWorkerClient<W> {

	private readonly _worker: IWebWorker;
	private readonly _onModuleLoaded: Promise<void>;
	private readonly _protocol: WebWorkerProtocol;
	public readonly proxy: Proxied<W>;
	private readonly _localChannels: Map<string, object> = new Map();
	private readonly _remoteChannels: Map<string, object> = new Map();

	constructor(
		worker: IWebWorker
	) {
		super();

		this._worker = this._register(worker);
		this._register(this._worker.onMessage((msg) => {
			this._protocol.handleMessage(msg);
		}));
		this._register(this._worker.onError((err) => {
			logOnceWebWorkerWarning(err);
			onUnexpectedError(err);
		}));

		this._protocol = new WebWorkerProtocol({
			sendMessage: (msg: Message, transfer: ArrayBuffer[]): void => {
				this._worker.postMessage(msg, transfer);
			},
			handleMessage: (channel: string, method: string, args: unknown[]): Promise<unknown> => {
				return this._handleMessage(channel, method, args);
			},
			handleEvent: (channel: string, eventName: string, arg: unknown): Event<unknown> => {
				return this._handleEvent(channel, eventName, arg);
			}
		});
		this._protocol.setWorkerId(this._worker.getId());

		// Send initialize message
		this._onModuleLoaded = this._protocol.sendMessage(DEFAULT_CHANNEL, INITIALIZE, [
			this._worker.getId(),
		]).then(() => { });

		this.proxy = this._protocol.createProxyToRemoteChannel(DEFAULT_CHANNEL, async () => { await this._onModuleLoaded; });
		this._onModuleLoaded.catch((e) => {
			this._onError('Worker failed to load ', e);
		});
	}

	private _handleMessage(channelName: string, method: string, args: unknown[]): Promise<unknown> {
		const channel: object | undefined = this._localChannels.get(channelName);
		if (!channel) {
			return Promise.reject(new Error(`Missing channel ${channelName} on main thread`));
		}

		const fn = (channel as Record<string, unknown>)[method];
		if (typeof fn !== 'function') {
			return Promise.reject(new Error(`Missing method ${method} on main thread channel ${channelName}`));
		}

		try {
			return Promise.resolve(fn.apply(channel, args));
		} catch (e) {
			return Promise.reject(e);
		}
	}

	private _handleEvent(channelName: string, eventName: string, arg: unknown): Event<unknown> {
		const channel: object | undefined = this._localChannels.get(channelName);
		if (!channel) {
			throw new Error(`Missing channel ${channelName} on main thread`);
		}
		if (propertyIsDynamicEvent(eventName)) {
			const fn = (channel as Record<string, unknown>)[eventName];
			if (typeof fn !== 'function') {
				throw new Error(`Missing dynamic event ${eventName} on main thread channel ${channelName}.`);
			}
			const event = fn.call(channel, arg);
			if (typeof event !== 'function') {
				throw new Error(`Missing dynamic event ${eventName} on main thread channel ${channelName}.`);
			}
			return event;
		}
		if (propertyIsEvent(eventName)) {
			const event = (channel as Record<string, unknown>)[eventName];
			if (typeof event !== 'function') {
				throw new Error(`Missing event ${eventName} on main thread channel ${channelName}.`);
			}
			return event as Event<unknown>;
		}
		throw new Error(`Malformed event name ${eventName}`);
	}

	public setChannel<T extends object>(channel: string, handler: T): void {
		this._localChannels.set(channel, handler);
	}

	public getChannel<T extends object>(channel: string): Proxied<T> {
		let inst = this._remoteChannels.get(channel);
		if (inst === undefined) {
			inst = this._protocol.createProxyToRemoteChannel(channel, async () => { await this._onModuleLoaded; });
			this._remoteChannels.set(channel, inst);
		}
		return inst as Proxied<T>;
	}

	private _onError(message: string, error?: unknown): void {
		console.error(message);
		console.info(error);
	}
}

function propertyIsEvent(name: string): boolean {
	// Assume a property is an event if it has a form of "onSomething"
	return name[0] === 'o' && name[1] === 'n' && strings.isUpperAsciiLetter(name.charCodeAt(2));
}

function propertyIsDynamicEvent(name: string): boolean {
	// Assume a property is a dynamic event (a method that returns an event) if it has a form of "onDynamicSomething"
	return /^onDynamic/.test(name) && strings.isUpperAsciiLetter(name.charCodeAt(9));
}

export interface IWebWorkerServerRequestHandler {
	_requestHandlerBrand: void;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[prop: string]: any;
}

export interface IWebWorkerServerRequestHandlerFactory<T extends IWebWorkerServerRequestHandler> {
	(workerServer: IWebWorkerServer): T;
}

/**
 * Worker side
 */
export class WebWorkerServer<T extends IWebWorkerServerRequestHandler> implements IWebWorkerServer {

	public readonly requestHandler: T;
	private _protocol: WebWorkerProtocol;
	private readonly _localChannels: Map<string, object> = new Map();
	private readonly _remoteChannels: Map<string, object> = new Map();

	constructor(postMessage: (msg: Message, transfer?: ArrayBuffer[]) => void, requestHandlerFactory: IWebWorkerServerRequestHandlerFactory<T>) {
		this._protocol = new WebWorkerProtocol({
			sendMessage: (msg: Message, transfer: ArrayBuffer[]): void => {
				postMessage(msg, transfer);
			},
			handleMessage: (channel: string, method: string, args: unknown[]): Promise<unknown> => this._handleMessage(channel, method, args),
			handleEvent: (channel: string, eventName: string, arg: unknown): Event<unknown> => this._handleEvent(channel, eventName, arg)
		});
		this.requestHandler = requestHandlerFactory(this);
	}

	public onmessage(msg: unknown): void {
		this._protocol.handleMessage(msg);
	}

	private _handleMessage(channel: string, method: string, args: unknown[]): Promise<unknown> {
		if (channel === DEFAULT_CHANNEL && method === INITIALIZE) {
			return this.initialize(<number>args[0]);
		}

		const requestHandler: object | null | undefined = (channel === DEFAULT_CHANNEL ? this.requestHandler : this._localChannels.get(channel));
		if (!requestHandler) {
			return Promise.reject(new Error(`Missing channel ${channel} on worker thread`));
		}

		const fn = (requestHandler as Record<string, unknown>)[method];
		if (typeof fn !== 'function') {
			return Promise.reject(new Error(`Missing method ${method} on worker thread channel ${channel}`));
		}

		try {
			return Promise.resolve(fn.apply(requestHandler, args));
		} catch (e) {
			return Promise.reject(e);
		}
	}

	private _handleEvent(channel: string, eventName: string, arg: unknown): Event<unknown> {
		const requestHandler: object | null | undefined = (channel === DEFAULT_CHANNEL ? this.requestHandler : this._localChannels.get(channel));
		if (!requestHandler) {
			throw new Error(`Missing channel ${channel} on worker thread`);
		}
		if (propertyIsDynamicEvent(eventName)) {
			const fn = (requestHandler as Record<string, unknown>)[eventName];
			if (typeof fn !== 'function') {
				throw new Error(`Missing dynamic event ${eventName} on request handler.`);
			}

			const event = fn.call(requestHandler, arg);
			if (typeof event !== 'function') {
				throw new Error(`Missing dynamic event ${eventName} on request handler.`);
			}
			return event;
		}
		if (propertyIsEvent(eventName)) {
			const event = (requestHandler as Record<string, unknown>)[eventName];
			if (typeof event !== 'function') {
				throw new Error(`Missing event ${eventName} on request handler.`);
			}
			return event as Event<unknown>;
		}
		throw new Error(`Malformed event name ${eventName}`);
	}

	public setChannel<T extends object>(channel: string, handler: T): void {
		this._localChannels.set(channel, handler);
	}

	public getChannel<T extends object>(channel: string): Proxied<T> {
		let inst = this._remoteChannels.get(channel);
		if (inst === undefined) {
			inst = this._protocol.createProxyToRemoteChannel(channel);
			this._remoteChannels.set(channel, inst);
		}
		return inst as Proxied<T>;
	}

	private async initialize(workerId: number): Promise<void> {
		this._protocol.setWorkerId(workerId);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/worker/webWorkerBootstrap.ts]---
Location: vscode-main/src/vs/base/common/worker/webWorkerBootstrap.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IWebWorkerServerRequestHandler, IWebWorkerServerRequestHandlerFactory, WebWorkerServer } from './webWorker.js';

type MessageEvent = {
	data: unknown;
};

declare const globalThis: {
	postMessage: (message: any) => void;
	onmessage: (event: MessageEvent) => void;
};

let initialized = false;

export function initialize<T extends IWebWorkerServerRequestHandler>(factory: IWebWorkerServerRequestHandlerFactory<T>) {
	if (initialized) {
		throw new Error('WebWorker already initialized!');
	}
	initialized = true;

	const webWorkerServer = new WebWorkerServer<T>(
		msg => globalThis.postMessage(msg),
		(workerServer) => factory(workerServer)
	);

	globalThis.onmessage = (e: MessageEvent) => {
		webWorkerServer.onmessage(e.data);
	};

	return webWorkerServer;
}

export function bootstrapWebWorker(factory: IWebWorkerServerRequestHandlerFactory<any>) {
	globalThis.onmessage = (_e: MessageEvent) => {
		// Ignore first message in this case and initialize if not yet initialized
		if (!initialized) {
			initialize(factory);
		}
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/node/cpuUsage.sh]---
Location: vscode-main/src/vs/base/node/cpuUsage.sh

```bash
#!/bin/bash

function get_total_cpu_time() {
  # Read the first line of /proc/stat and remove the cpu prefix
  CPU=(`sed -n 's/^cpu\s//p' /proc/stat`)

  # Sum all of the values in CPU to get total time
  for VALUE in "${CPU[@]}"; do
    let $1=$1+$VALUE
  done
}

TOTAL_TIME_BEFORE=0
get_total_cpu_time TOTAL_TIME_BEFORE

# Loop over the arguments, which are a list of PIDs
# The 13th and 14th words in /proc/<PID>/stat are the user and system time
# the process has used, so sum these to get total process run time
declare -a PROCESS_BEFORE_TIMES
ITER=0
for PID in "$@"; do
  if [ -f /proc/$PID/stat ]
  then
    PROCESS_STATS=`cat /proc/$PID/stat`
    PROCESS_STAT_ARRAY=($PROCESS_STATS)

    let PROCESS_TIME_BEFORE="${PROCESS_STAT_ARRAY[13]}+${PROCESS_STAT_ARRAY[14]}"
  else
    let PROCESS_TIME_BEFORE=0
  fi

  PROCESS_BEFORE_TIMES[$ITER]=$PROCESS_TIME_BEFORE
  ((++ITER))
done

# Wait for a second
sleep 1

TOTAL_TIME_AFTER=0
get_total_cpu_time TOTAL_TIME_AFTER

# Check the user and system time sum of each process again and compute the change
# in process time used over total system time
ITER=0
for PID in "$@"; do
  if [ -f /proc/$PID/stat ]
  then
    PROCESS_STATS=`cat /proc/$PID/stat`
    PROCESS_STAT_ARRAY=($PROCESS_STATS)

    let PROCESS_TIME_AFTER="${PROCESS_STAT_ARRAY[13]}+${PROCESS_STAT_ARRAY[14]}"
  else
    let PROCESS_TIME_AFTER=${PROCESS_BEFORE_TIMES[$ITER]}
  fi

  PROCESS_TIME_BEFORE=${PROCESS_BEFORE_TIMES[$ITER]}
  let PROCESS_DELTA=$PROCESS_TIME_AFTER-$PROCESS_TIME_BEFORE
  let TOTAL_DELTA=$TOTAL_TIME_AFTER-$TOTAL_TIME_BEFORE
  CPU_USAGE=`echo "$((100*$PROCESS_DELTA/$TOTAL_DELTA))"`

  # Parent script reads from stdout, so echo result to be read
  echo $CPU_USAGE
  ((++ITER))
done
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/node/crypto.ts]---
Location: vscode-main/src/vs/base/node/crypto.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as crypto from 'crypto';
import * as fs from 'fs';
import { createSingleCallFunction } from '../common/functional.js';

export async function checksum(path: string, sha256hash: string | undefined): Promise<void> {
	const checksumPromise = new Promise<string | undefined>((resolve, reject) => {
		const input = fs.createReadStream(path);
		const hash = crypto.createHash('sha256');
		input.pipe(hash);

		const done = createSingleCallFunction((err?: Error, result?: string) => {
			input.removeAllListeners();
			hash.removeAllListeners();

			if (err) {
				reject(err);
			} else {
				resolve(result);
			}
		});

		input.once('error', done);
		input.once('end', done);
		hash.once('error', done);
		hash.once('data', (data: Buffer) => done(undefined, data.toString('hex')));
	});

	const hash = await checksumPromise;

	if (hash !== sha256hash) {
		throw new Error('Hash mismatch');
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/node/id.ts]---
Location: vscode-main/src/vs/base/node/id.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { networkInterfaces } from 'os';
import { TernarySearchTree } from '../common/ternarySearchTree.js';
import * as uuid from '../common/uuid.js';
import { getMac } from './macAddress.js';
import { isWindows } from '../common/platform.js';

// http://www.techrepublic.com/blog/data-center/mac-address-scorecard-for-common-virtual-machine-platforms/
// VMware ESX 3, Server, Workstation, Player	00-50-56, 00-0C-29, 00-05-69
// Microsoft Hyper-V, Virtual Server, Virtual PC	00-03-FF
// Parallels Desktop, Workstation, Server, Virtuozzo	00-1C-42
// Virtual Iron 4	00-0F-4B
// Red Hat Xen	00-16-3E
// Oracle VM	00-16-3E
// XenSource	00-16-3E
// Novell Xen	00-16-3E
// Sun xVM VirtualBox	08-00-27
export const virtualMachineHint: { value(): number } = new class {

	private _virtualMachineOUIs?: TernarySearchTree<string, boolean>;
	private _value?: number;

	private _isVirtualMachineMacAddress(mac: string): boolean {
		if (!this._virtualMachineOUIs) {
			this._virtualMachineOUIs = TernarySearchTree.forStrings<boolean>();

			// dash-separated
			this._virtualMachineOUIs.set('00-50-56', true);
			this._virtualMachineOUIs.set('00-0C-29', true);
			this._virtualMachineOUIs.set('00-05-69', true);
			this._virtualMachineOUIs.set('00-03-FF', true);
			this._virtualMachineOUIs.set('00-1C-42', true);
			this._virtualMachineOUIs.set('00-16-3E', true);
			this._virtualMachineOUIs.set('08-00-27', true);

			// colon-separated
			this._virtualMachineOUIs.set('00:50:56', true);
			this._virtualMachineOUIs.set('00:0C:29', true);
			this._virtualMachineOUIs.set('00:05:69', true);
			this._virtualMachineOUIs.set('00:03:FF', true);
			this._virtualMachineOUIs.set('00:1C:42', true);
			this._virtualMachineOUIs.set('00:16:3E', true);
			this._virtualMachineOUIs.set('08:00:27', true);
		}
		return !!this._virtualMachineOUIs.findSubstr(mac);
	}

	value(): number {
		if (this._value === undefined) {
			let vmOui = 0;
			let interfaceCount = 0;

			const interfaces = networkInterfaces();
			for (const name in interfaces) {
				const networkInterface = interfaces[name];
				if (networkInterface) {
					for (const { mac, internal } of networkInterface) {
						if (!internal) {
							interfaceCount += 1;
							if (this._isVirtualMachineMacAddress(mac.toUpperCase())) {
								vmOui += 1;
							}
						}
					}
				}
			}
			this._value = interfaceCount > 0
				? vmOui / interfaceCount
				: 0;
		}

		return this._value;
	}
};

let machineId: Promise<string>;
export async function getMachineId(errorLogger: (error: Error) => void): Promise<string> {
	if (!machineId) {
		machineId = (async () => {
			const id = await getMacMachineId(errorLogger);

			return id || uuid.generateUuid(); // fallback, generate a UUID
		})();
	}

	return machineId;
}

async function getMacMachineId(errorLogger: (error: Error) => void): Promise<string | undefined> {
	try {
		const crypto = await import('crypto');
		const macAddress = getMac();
		return crypto.createHash('sha256').update(macAddress, 'utf8').digest('hex');
	} catch (err) {
		errorLogger(err);
		return undefined;
	}
}

const SQM_KEY: string = 'Software\\Microsoft\\SQMClient';
export async function getSqmMachineId(errorLogger: (error: Error) => void): Promise<string> {
	if (isWindows) {
		const Registry = await import('@vscode/windows-registry');
		try {
			return Registry.GetStringRegKey('HKEY_LOCAL_MACHINE', SQM_KEY, 'MachineId') || '';
		} catch (err) {
			errorLogger(err);
			return '';
		}
	}
	return '';
}

export async function getDevDeviceId(errorLogger: (error: Error) => void): Promise<string> {
	try {
		const deviceIdPackage = await import('@vscode/deviceid');
		const id = await deviceIdPackage.getDeviceId();
		return id;
	} catch (err) {
		errorLogger(err);
		return uuid.generateUuid();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/node/macAddress.ts]---
Location: vscode-main/src/vs/base/node/macAddress.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { networkInterfaces } from 'os';

const invalidMacAddresses = new Set([
	'00:00:00:00:00:00',
	'ff:ff:ff:ff:ff:ff',
	'ac:de:48:00:11:22'
]);

function validateMacAddress(candidate: string): boolean {
	const tempCandidate = candidate.replace(/\-/g, ':').toLowerCase();
	return !invalidMacAddresses.has(tempCandidate);
}

export function getMac(): string {
	const ifaces = networkInterfaces();
	for (const name in ifaces) {
		const networkInterface = ifaces[name];
		if (networkInterface) {
			for (const { mac } of networkInterface) {
				if (validateMacAddress(mac)) {
					return mac;
				}
			}
		}
	}

	throw new Error('Unable to retrieve mac address (unexpected format)');
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/node/nls.ts]---
Location: vscode-main/src/vs/base/node/nls.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { join } from '../common/path.js';
import { promises } from 'fs';
import { mark } from '../common/performance.js';
import { ILanguagePacks, INLSConfiguration } from '../../nls.js';
import { Promises } from './pfs.js';

export interface IResolveNLSConfigurationContext {

	/**
	 * Location where `nls.messages.json` and `nls.keys.json` are stored.
	 */
	readonly nlsMetadataPath: string;

	/**
	 * Path to the user data directory. Used as a cache for
	 * language packs converted to the format we need.
	 */
	readonly userDataPath: string;

	/**
	 * Commit of the running application. Can be `undefined`
	 * when not built.
	 */
	readonly commit: string | undefined;

	/**
	 * Locale as defined in `argv.json` or `app.getLocale()`.
	 */
	readonly userLocale: string;

	/**
	 * Locale as defined by the OS (e.g. `app.getPreferredSystemLanguages()`).
	 */
	readonly osLocale: string;
}

export async function resolveNLSConfiguration({ userLocale, osLocale, userDataPath, commit, nlsMetadataPath }: IResolveNLSConfigurationContext): Promise<INLSConfiguration> {
	mark('code/willGenerateNls');

	if (
		process.env['VSCODE_DEV'] ||
		userLocale === 'pseudo' ||
		userLocale.startsWith('en') ||
		!commit ||
		!userDataPath
	) {
		return defaultNLSConfiguration(userLocale, osLocale, nlsMetadataPath);
	}

	try {
		const languagePacks = await getLanguagePackConfigurations(userDataPath);
		if (!languagePacks) {
			return defaultNLSConfiguration(userLocale, osLocale, nlsMetadataPath);
		}

		const resolvedLanguage = resolveLanguagePackLanguage(languagePacks, userLocale);
		if (!resolvedLanguage) {
			return defaultNLSConfiguration(userLocale, osLocale, nlsMetadataPath);
		}

		const languagePack = languagePacks[resolvedLanguage];
		const mainLanguagePackPath = languagePack?.translations?.['vscode'];
		if (
			!languagePack ||
			typeof languagePack.hash !== 'string' ||
			!languagePack.translations ||
			typeof mainLanguagePackPath !== 'string' ||
			!(await Promises.exists(mainLanguagePackPath))
		) {
			return defaultNLSConfiguration(userLocale, osLocale, nlsMetadataPath);
		}

		const languagePackId = `${languagePack.hash}.${resolvedLanguage}`;
		const globalLanguagePackCachePath = join(userDataPath, 'clp', languagePackId);
		const commitLanguagePackCachePath = join(globalLanguagePackCachePath, commit);
		const languagePackMessagesFile = join(commitLanguagePackCachePath, 'nls.messages.json');
		const translationsConfigFile = join(globalLanguagePackCachePath, 'tcf.json');
		const languagePackCorruptMarkerFile = join(globalLanguagePackCachePath, 'corrupted.info');

		if (await Promises.exists(languagePackCorruptMarkerFile)) {
			await promises.rm(globalLanguagePackCachePath, { recursive: true, force: true, maxRetries: 3 }); // delete corrupted cache folder
		}

		const result: INLSConfiguration = {
			userLocale,
			osLocale,
			resolvedLanguage,
			defaultMessagesFile: join(nlsMetadataPath, 'nls.messages.json'),
			languagePack: {
				translationsConfigFile,
				messagesFile: languagePackMessagesFile,
				corruptMarkerFile: languagePackCorruptMarkerFile
			},

			// NLS: below properties are a relic from old times only used by vscode-nls and deprecated
			locale: userLocale,
			availableLanguages: { '*': resolvedLanguage },
			_languagePackId: languagePackId,
			_languagePackSupport: true,
			_translationsConfigFile: translationsConfigFile,
			_cacheRoot: globalLanguagePackCachePath,
			_resolvedLanguagePackCoreLocation: commitLanguagePackCachePath,
			_corruptedFile: languagePackCorruptMarkerFile
		};

		if (await Promises.exists(languagePackMessagesFile)) {
			touch(commitLanguagePackCachePath).catch(() => { }); // We don't wait for this. No big harm if we can't touch
			mark('code/didGenerateNls');
			return result;
		}

		const [
			nlsDefaultKeys,
			nlsDefaultMessages,
			nlsPackdata
		]:
			[Array<[string, string[]]>, string[], { contents: Record<string, Record<string, string>> }]
			//      ^moduleId ^nlsKeys                               ^moduleId      ^nlsKey ^nlsValue
			= await Promise.all([
				promises.readFile(join(nlsMetadataPath, 'nls.keys.json'), 'utf-8').then(content => JSON.parse(content)),
				promises.readFile(join(nlsMetadataPath, 'nls.messages.json'), 'utf-8').then(content => JSON.parse(content)),
				promises.readFile(mainLanguagePackPath, 'utf-8').then(content => JSON.parse(content)),
			]);

		const nlsResult: string[] = [];

		// We expect NLS messages to be in a flat array in sorted order as they
		// where produced during build time. We use `nls.keys.json` to know the
		// right order and then lookup the related message from the translation.
		// If a translation does not exist, we fallback to the default message.

		let nlsIndex = 0;
		for (const [moduleId, nlsKeys] of nlsDefaultKeys) {
			const moduleTranslations = nlsPackdata.contents[moduleId];
			for (const nlsKey of nlsKeys) {
				nlsResult.push(moduleTranslations?.[nlsKey] || nlsDefaultMessages[nlsIndex]);
				nlsIndex++;
			}
		}

		await promises.mkdir(commitLanguagePackCachePath, { recursive: true });

		await Promise.all([
			promises.writeFile(languagePackMessagesFile, JSON.stringify(nlsResult), 'utf-8'),
			promises.writeFile(translationsConfigFile, JSON.stringify(languagePack.translations), 'utf-8')
		]);

		mark('code/didGenerateNls');

		return result;
	} catch (error) {
		console.error('Generating translation files failed.', error);
	}

	return defaultNLSConfiguration(userLocale, osLocale, nlsMetadataPath);
}

/**
 * The `languagepacks.json` file is a JSON file that contains all metadata
 * about installed language extensions per language. Specifically, for
 * core (`vscode`) and all extensions it supports, it points to the related
 * translation files.
 *
 * The file is updated whenever a new language pack is installed or removed.
 */
async function getLanguagePackConfigurations(userDataPath: string): Promise<ILanguagePacks | undefined> {
	const configFile = join(userDataPath, 'languagepacks.json');
	try {
		return JSON.parse(await promises.readFile(configFile, 'utf-8'));
	} catch (err) {
		return undefined; // Do nothing. If we can't read the file we have no language pack config.
	}
}

function resolveLanguagePackLanguage(languagePacks: ILanguagePacks, locale: string | undefined): string | undefined {
	try {
		while (locale) {
			if (languagePacks[locale]) {
				return locale;
			}

			const index = locale.lastIndexOf('-');
			if (index > 0) {
				locale = locale.substring(0, index);
			} else {
				return undefined;
			}
		}
	} catch (error) {
		console.error('Resolving language pack configuration failed.', error);
	}

	return undefined;
}

function defaultNLSConfiguration(userLocale: string, osLocale: string, nlsMetadataPath: string): INLSConfiguration {
	mark('code/didGenerateNls');

	return {
		userLocale,
		osLocale,
		resolvedLanguage: 'en',
		defaultMessagesFile: join(nlsMetadataPath, 'nls.messages.json'),

		// NLS: below 2 are a relic from old times only used by vscode-nls and deprecated
		locale: userLocale,
		availableLanguages: {}
	};
}

//#region fs helpers

function touch(path: string): Promise<void> {
	const date = new Date();

	return promises.utimes(path, date, date);
}

//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/node/nodeStreams.ts]---
Location: vscode-main/src/vs/base/node/nodeStreams.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Transform } from 'stream';
import { binaryIndexOf } from '../common/buffer.js';

/**
 * A Transform stream that splits the input on the "splitter" substring.
 * The resulting chunks will contain (and trail with) the splitter match.
 * The last chunk when the stream ends will be emitted even if a splitter
 * is not encountered.
 */
export class StreamSplitter extends Transform {
	private buffer: Buffer | undefined;
	private readonly splitter: Buffer | number;
	private readonly spitterLen: number;

	constructor(splitter: string | number | Buffer) {
		super();
		if (typeof splitter === 'number') {
			this.splitter = splitter;
			this.spitterLen = 1;
		} else {
			const buf = Buffer.isBuffer(splitter) ? splitter : Buffer.from(splitter);
			this.splitter = buf.length === 1 ? buf[0] : buf;
			this.spitterLen = buf.length;
		}
	}

	override _transform(chunk: Buffer, _encoding: string, callback: (error?: Error | null, data?: Buffer) => void): void {
		if (!this.buffer) {
			this.buffer = chunk;
		} else {
			this.buffer = Buffer.concat([this.buffer, chunk]);
		}

		let offset = 0;
		while (offset < this.buffer.length) {
			const index = typeof this.splitter === 'number'
				? this.buffer.indexOf(this.splitter, offset)
				: binaryIndexOf(this.buffer, this.splitter, offset);
			if (index === -1) {
				break;
			}

			this.push(this.buffer.slice(offset, index + this.spitterLen));
			offset = index + this.spitterLen;
		}

		this.buffer = offset === this.buffer.length ? undefined : this.buffer.slice(offset);
		callback();
	}

	override _flush(callback: (error?: Error | null, data?: Buffer) => void): void {
		if (this.buffer) {
			this.push(this.buffer);
		}

		callback();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/node/osDisplayProtocolInfo.ts]---
Location: vscode-main/src/vs/base/node/osDisplayProtocolInfo.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { constants as FSConstants, promises as FSPromises } from 'fs';
import { join } from '../common/path.js';
import { env } from '../common/process.js';

const XDG_SESSION_TYPE = 'XDG_SESSION_TYPE';
const WAYLAND_DISPLAY = 'WAYLAND_DISPLAY';
const XDG_RUNTIME_DIR = 'XDG_RUNTIME_DIR';

const enum DisplayProtocolType {
	Wayland = 'wayland',
	XWayland = 'xwayland',
	X11 = 'x11',
	Unknown = 'unknown'
}

export async function getDisplayProtocol(errorLogger: (error: string | Error) => void): Promise<DisplayProtocolType> {
	const xdgSessionType = env[XDG_SESSION_TYPE];

	if (xdgSessionType) {
		// If XDG_SESSION_TYPE is set, return its value if it's either 'wayland' or 'x11'.
		// We assume that any value other than 'wayland' or 'x11' is an error or unexpected,
		// hence 'unknown' is returned.
		return xdgSessionType === DisplayProtocolType.Wayland || xdgSessionType === DisplayProtocolType.X11 ? xdgSessionType : DisplayProtocolType.Unknown;
	} else {
		const waylandDisplay = env[WAYLAND_DISPLAY];

		if (!waylandDisplay) {
			// If WAYLAND_DISPLAY is empty, then the session is x11.
			return DisplayProtocolType.X11;
		} else {
			const xdgRuntimeDir = env[XDG_RUNTIME_DIR];

			if (!xdgRuntimeDir) {
				// If XDG_RUNTIME_DIR is empty, then the session can only be guessed.
				return DisplayProtocolType.Unknown;
			} else {
				// Check for the presence of the file $XDG_RUNTIME_DIR/wayland-0.
				const waylandServerPipe = join(xdgRuntimeDir, 'wayland-0');

				try {
					await FSPromises.access(waylandServerPipe, FSConstants.R_OK);

					// If the file exists, then the session is wayland.
					return DisplayProtocolType.Wayland;
				} catch (err) {
					// If the file does not exist or an error occurs, we guess 'unknown'
					// since WAYLAND_DISPLAY was set but no wayland-0 pipe could be confirmed.
					errorLogger(err);
					return DisplayProtocolType.Unknown;
				}
			}
		}
	}
}


export function getCodeDisplayProtocol(displayProtocol: DisplayProtocolType, ozonePlatform: string | undefined): DisplayProtocolType {
	if (!ozonePlatform) {
		return displayProtocol === DisplayProtocolType.Wayland ? DisplayProtocolType.XWayland : DisplayProtocolType.X11;
	} else {
		switch (ozonePlatform) {
			case 'auto':
				return displayProtocol;
			case 'x11':
				return displayProtocol === DisplayProtocolType.Wayland ? DisplayProtocolType.XWayland : DisplayProtocolType.X11;
			case 'wayland':
				return DisplayProtocolType.Wayland;
			default:
				return DisplayProtocolType.Unknown;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/node/osReleaseInfo.ts]---
Location: vscode-main/src/vs/base/node/osReleaseInfo.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { constants as FSConstants, promises as FSPromises } from 'fs';
import { createInterface as readLines } from 'readline';
import * as Platform from '../common/platform.js';

type ReleaseInfo = {
	id: string;
	id_like?: string;
	version_id?: string;
};

export async function getOSReleaseInfo(errorLogger: (error: string | Error) => void): Promise<ReleaseInfo | undefined> {
	if (Platform.isMacintosh || Platform.isWindows) {
		return;
	}

	// Extract release information on linux based systems
	// using the identifiers specified in
	// https://www.freedesktop.org/software/systemd/man/os-release.html
	let handle: FSPromises.FileHandle | undefined;
	for (const filePath of ['/etc/os-release', '/usr/lib/os-release', '/etc/lsb-release']) {
		try {
			handle = await FSPromises.open(filePath, FSConstants.R_OK);
			break;
		} catch (err) { }
	}

	if (!handle) {
		errorLogger('Unable to retrieve release information from known identifier paths.');
		return;
	}

	try {
		const osReleaseKeys = new Set([
			'ID',
			'DISTRIB_ID',
			'ID_LIKE',
			'VERSION_ID',
			'DISTRIB_RELEASE',
		]);
		const releaseInfo: ReleaseInfo = {
			id: 'unknown'
		};

		for await (const line of readLines({ input: handle.createReadStream(), crlfDelay: Infinity })) {
			if (!line.includes('=')) {
				continue;
			}
			const key = line.split('=')[0].toUpperCase().trim();
			if (osReleaseKeys.has(key)) {
				const value = line.split('=')[1].replace(/"/g, '').toLowerCase().trim();
				if (key === 'ID' || key === 'DISTRIB_ID') {
					releaseInfo.id = value;
				} else if (key === 'ID_LIKE') {
					releaseInfo.id_like = value;
				} else if (key === 'VERSION_ID' || key === 'DISTRIB_RELEASE') {
					releaseInfo.version_id = value;
				}
			}
		}

		return releaseInfo;
	} catch (err) {
		errorLogger(err);
	}

	return;
}
```

--------------------------------------------------------------------------------

````
